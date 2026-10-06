<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Sparkles,
    Send,
    Bot,
    User,
    BrainCircuit,
    Lightbulb,
    CheckCircle2,
    Shield,
    Mic,
    MicOff,
    Volume2,
    VolumeX,
    RotateCcw,
    Radio,
    Compass,
    HelpCircle,
    Info,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import { Button, Badge, Card, Input, IllustrationFrame } from '$lib/components';

  interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    state?: 'asking' | 'reflecting' | 'summarizing';
    observation?: { competency: string; note: string };
  }

  type MentorState = 'idle' | 'listening' | 'thinking' | 'asking' | 'reflecting' | 'summarizing' | 'evidence_captured';

  let messages = $state<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: 'Hello Anaya! I am your Socratic Guide. I will never simply dump answers or solve homework for you. Instead, we break down tricky STEM, spatial, and mathematical challenges step-by-step. What question or project mission are you exploring today?',
      state: 'asking'
    }
  ]);

  let inputQuery = $state('');
  let isSending = $state(false);
  let voiceMode = $state(false);
  let currentState = $state<MentorState>('idle');
  let isMuted = $state(false);
  let showPedagogicalNote = $state(false);

  const samplePrompts = [
    'How do I balance an equation when variables are on both sides?',
    'Why do edge cubes on a 3×3×3 cube have exactly two painted faces?',
    'How does gear teeth ratio change rotational speed and torque?'
  ];

  const reasoningMoves = [
    { title: 'Decompose', desc: 'Identify known vs unknown variables' },
    { title: 'Represent', desc: 'Sketch a quick diagram or mental model' },
    { title: 'Test Extreme', desc: 'What happens at zero or infinity?' }
  ];

  function toggleVoiceMode() {
    voiceMode = !voiceMode;
    if (voiceMode) {
      currentState = 'listening';
    } else {
      currentState = 'idle';
    }
  }

  async function handleSend(textToSend?: string) {
    const text = textToSend || inputQuery;
    if (!text.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text
    };

    messages = [...messages, userMsg];
    inputQuery = '';
    isSending = true;
    currentState = 'thinking';

    try {
      const res = await fetch('/api/v1/ai/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          learnerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          history: messages.map((m) => ({ role: m.role, content: m.text }))
        })
      });

      if (!res.ok) throw new Error('Mentor API error');

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        text: data.reply,
        state: data.observation ? 'summarizing' : 'reflecting',
        observation: data.observation
      };

      messages = [...messages, assistantMsg];
      currentState = data.observation ? 'evidence_captured' : 'reflecting';

      setTimeout(() => {
        if (voiceMode) currentState = 'listening';
        else currentState = 'idle';
      }, 4000);
    } catch {
      messages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'Let us pause and examine what we already know: what is the single most critical variable given in this scenario?',
          state: 'reflecting'
        }
      ];
      currentState = 'asking';
      setTimeout(() => {
        if (voiceMode) currentState = 'listening';
        else currentState = 'idle';
      }, 3000);
    } finally {
      isSending = false;
    }
  }

  function simulateVoiceInput() {
    if (currentState === 'listening') {
      currentState = 'thinking';
      setTimeout(() => {
        handleSend('If a gear has 12 teeth and drives a 36-tooth gear, does it turn faster or slower?');
      }, 1200);
    } else {
      currentState = 'listening';
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
  <!-- 1. HEADER: Calm Intelligence & Ephemeral Safety Context -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-(--accent-primary)" />
        <h1 class="text-xl sm:text-2xl font-bold text-(--text-primary) tracking-tight">
          Socratic Guide & Inquiry Workspace
        </h1>
      </div>
      <p class="text-xs text-(--text-secondary)">
        Step-by-step problem decomposition • Calm scaffolding without answers dumping
      </p>
    </div>

    <div class="flex items-center gap-2">
      <!-- Calm Ephemeral Marker -->
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-medium bg-(--accent-success-subtle) text-(--accent-success) border border-(--border-subtle)">
        <Shield class="w-3.5 h-3.5" />
        <span>Parent Consent Active</span>
      </span>

      <!-- Voice Mentor Toggle -->
      <button
        type="button"
        onclick={toggleVoiceMode}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all border cursor-pointer {voiceMode ? 'bg-(--accent-primary) text-white border-(--accent-primary)' : 'surface-card text-(--text-secondary) hover:text-(--text-primary) border-(--border-subtle)'}"
      >
        {#if voiceMode}
          <Mic class="w-3.5 h-3.5 animate-pulse" />
          <span>Voice Live</span>
        {:else}
          <Radio class="w-3.5 h-3.5" />
          <span>Voice Mentor</span>
        {/if}
      </button>
    </div>
  </header>

  <!-- 2. CONVERSATIONAL WORKSPACE (Compact & Connected, No Giant Blank Gaps) -->
  <div class="surface-card rounded-sm border border-(--border-subtle) overflow-hidden flex flex-col">
    <!-- Top Bar: Mentor State & Pedagogical Principle -->
    <div class="px-5 py-3 border-b border-(--border-subtle) bg-(--surface-sunken) flex items-center justify-between text-xs">
      <!-- Active Mentor State Indicator -->
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full {currentState === 'listening' ? 'bg-(--accent-success) animate-ping' : (currentState === 'thinking' ? 'bg-(--accent-primary) animate-pulse' : (currentState === 'reflecting' ? 'bg-(--accent-indigo)' : (currentState === 'evidence_captured' ? 'bg-(--accent-success)' : 'bg-(--text-muted)')))}"></div>
        <span class="font-medium text-(--text-primary)">
          {#if currentState === 'listening'}
            Listening for your reasoning...
          {:else if currentState === 'thinking'}
            Formulating Socratic question...
          {:else if currentState === 'reflecting'}
            Reflecting on your approach...
          {:else if currentState === 'summarizing'}
            Synthesizing demonstrated principle...
          {:else if currentState === 'evidence_captured'}
            Evidence item captured to profile
          {:else}
            Socratic Guide ready
          {/if}
        </span>
      </div>

      <!-- Pedagogical Collapsible Trigger -->
      <button
        type="button"
        onclick={() => (showPedagogicalNote = !showPedagogicalNote)}
        class="text-[11px] text-(--text-muted) hover:text-(--text-primary) flex items-center gap-1 transition-colors cursor-pointer"
      >
        <span>Pedagogy</span>
        {#if showPedagogicalNote}
          <ChevronUp class="w-3 h-3" />
        {:else}
          <ChevronDown class="w-3 h-3" />
        {/if}
      </button>
    </div>

    <!-- Collapsible Compact Pedagogy Note -->
    {#if showPedagogicalNote}
      <div class="px-5 py-3 bg-(--surface-canvas) border-b border-(--border-subtle) text-xs text-(--text-secondary) flex items-start gap-2 leading-relaxed">
        <Info class="w-4 h-4 text-(--accent-indigo) shrink-0 mt-0.5" />
        <div>
          <strong class="text-(--text-primary)">The Socratic Method:</strong> We guide attention toward invariants, edge cases, and mental representations so you discover the core insight independently. Observations are securely indexed into your learning map.
        </div>
      </div>
    {/if}

    <!-- Voice Waveform HUD (If active) -->
    {#if voiceMode}
      <div class="px-6 py-4 border-b border-(--border-subtle) bg-(--surface-canvas) flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-1.5 h-8">
          {#each [14, 24, 38, 18, 30, 42, 22, 34, 28, 16, 36, 20, 32, 24, 30] as h, i}
            <div
              class="w-1 rounded-full transition-all duration-200 {currentState === 'listening' ? 'bg-(--accent-success)' : (currentState === 'thinking' ? 'bg-(--accent-primary)' : 'bg-(--border-subtle)')}"
              style="height: {currentState === 'idle' ? 4 : (currentState === 'listening' ? Math.max(6, (h * 0.6) + (Math.sin(i) * 8)) : Math.max(8, h * 0.7))}px;"
            ></div>
          {/each}
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => (isMuted = !isMuted)}
            class="p-1.5 rounded-sm surface-card text-(--text-muted) hover:text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {#if isMuted}
              <VolumeX class="w-4 h-4" />
            {:else}
              <Volume2 class="w-4 h-4 text-(--accent-primary)" />
            {/if}
          </button>
          <button
            type="button"
            onclick={simulateVoiceInput}
            class="px-3 py-1.5 rounded-sm bg-(--surface-raised) hover:bg-(--surface-sunken) text-xs font-medium text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer"
          >
            {currentState === 'listening' ? 'Simulate Speech' : 'Listen Again'}
          </button>
        </div>
      </div>
    {/if}

    <!-- Connected Message Thread -->
    <div class="p-5 sm:p-6 space-y-4 max-h-115 overflow-y-auto bg-(--surface-canvas)">
      {#each messages as msg}
        <div class="flex items-start gap-3 {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
          {#if msg.role === 'assistant'}
            <div class="w-7 h-7 rounded-sm bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center shrink-0 border border-(--border-subtle)">
              <Bot class="w-4 h-4" />
            </div>
          {/if}

          <div class="space-y-1.5 max-w-[82%]">
            <div class="p-4 rounded-sm text-xs sm:text-sm leading-relaxed border {msg.role === 'user' ? 'bg-(--accent-primary) text-white font-medium border-(--accent-primary)' : 'surface-card text-(--text-primary) border-(--border-subtle)'}">
              {msg.text}
            </div>

            <!-- Transparent AI Marker & Evidence provenance -->
            {#if msg.role === 'assistant'}
              <div class="flex items-center gap-2 text-[10px] text-(--text-muted) px-1">
                <span class="inline-flex items-center gap-1 text-(--accent-indigo)">
                  <Sparkles class="w-2.5 h-2.5" />
                  <span>AI Guided Dialogue</span>
                </span>
                <span>•</span>
                <span>Child-safe guardrails</span>
              </div>
            {/if}

            {#if msg.observation}
              <div class="flex items-center gap-1.5 px-3 py-1 rounded-sm badge-growth text-[11px] font-medium border border-(--border-subtle)">
                <CheckCircle2 class="w-3.5 h-3.5 text-(--accent-success)" />
                <span>Demonstrated: [{msg.observation.competency.replace('_', ' ')}] — {msg.observation.note}</span>
              </div>
            {/if}
          </div>

          {#if msg.role === 'user'}
            <div class="w-7 h-7 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) flex items-center justify-center text-(--text-primary) shrink-0 font-semibold text-[11px]">
              AV
            </div>
          {/if}
        </div>
      {/each}

      {#if isSending}
        <div class="flex items-center gap-2 text-xs text-(--accent-primary) pl-10">
          <div class="w-2 h-2 rounded-full bg-(--accent-primary) animate-pulse"></div>
          <span>Formulating Socratic inquiry...</span>
        </div>
      {/if}
    </div>

    <!-- Integrated Controls Section (Suggested moves & input in same view) -->
    <div class="p-4 sm:p-5 bg-(--surface-sunken) border-t border-(--border-subtle) space-y-3">
      <!-- Reasoning Moves Ribbon -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-[11px] font-semibold text-(--text-muted) flex items-center gap-1 mr-1">
          <Compass class="w-3 h-3 text-(--accent-primary)" />
          Moves:
        </span>
        {#each reasoningMoves as move}
          <button
            type="button"
            onclick={() => handleSend(`Can you guide me through how to ${move.title.toLowerCase()} this problem?`)}
            class="px-2.5 py-1 rounded-sm bg-(--surface-canvas) hover:bg-(--surface-raised) text-[11px] font-medium text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer"
          >
            <strong class="text-(--text-primary)">{move.title}:</strong> {move.desc}
          </button>
        {/each}
      </div>

      <!-- Quick Starter Prompts -->
      <div class="flex flex-wrap items-center gap-1.5 pt-1">
        <span class="text-[11px] text-(--text-muted) flex items-center gap-1 mr-1">
          <Lightbulb class="w-3 h-3 text-(--accent-warning)" />
          Try:
        </span>
        {#each samplePrompts as prompt}
          <button
            type="button"
            onclick={() => handleSend(prompt)}
            class="px-2.5 py-1 rounded-sm bg-(--surface-canvas) hover:bg-(--surface-raised) text-[11px] text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) transition-colors text-left truncate max-w-xs cursor-pointer"
          >
            {prompt}
          </button>
        {/each}
      </div>

      <!-- Compact Input Bar -->
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        class="flex items-center gap-2 pt-1"
      >
        <input
          type="text"
          bind:value={inputQuery}
          placeholder="Ask a question or describe a constraint you're stuck on..."
          class="flex-1 bg-(--surface-canvas) border border-(--border-subtle) rounded-sm px-4 py-2.5 text-xs sm:text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--accent-primary)"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isSending}
          class="px-5 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 disabled:opacity-40 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer shrink-0"
        >
          <span>Ask</span>
          <Send class="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  </div>
</div>
