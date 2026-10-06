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
    HelpCircle
  } from 'lucide-svelte';
  import { Button, Badge, Card, Input, IllustrationFrame } from '$lib/components';

  interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    observation?: { competency: string; note: string };
  }

  type AudioState = 'idle' | 'listening' | 'thinking' | 'speaking';

  let messages = $state<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: 'Hello Anaya! I am your Socratic Guide. I will never simply give away direct answers or do your homework for you, but I will help you break down tricky STEM, spatial, and mathematical problems step-by-step. What question or mission are you working through today?'
    }
  ]);

  let inputQuery = $state('');
  let isSending = $state(false);
  let voiceMode = $state(false);
  let audioState = $state<AudioState>('idle');
  let isMuted = $state(false);

  const samplePrompts = [
    'How do I balance an equation when variables are on both sides?',
    'Why do edge cubes on a 3×3×3 cube have exactly two painted faces?',
    'How does gear teeth ratio change rotational speed and torque?'
  ];

  const socraticNudges = [
    { title: 'Decompose', desc: 'Identify known vs unknown variables first' },
    { title: 'Represent', desc: 'Sketch a quick diagram or mental model' },
    { title: 'Test Extreme', desc: 'What happens if the value is zero or infinity?' }
  ];

  function toggleVoiceMode() {
    voiceMode = !voiceMode;
    if (voiceMode) {
      audioState = 'listening';
    } else {
      audioState = 'idle';
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
    audioState = 'thinking';

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
        observation: data.observation
      };

      messages = [...messages, assistantMsg];
      audioState = 'speaking';
      setTimeout(() => {
        if (voiceMode) audioState = 'listening';
        else audioState = 'idle';
      }, 4000);
    } catch {
      messages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'Let us pause and look at what you already know: what is the single most critical variable given in your problem?'
        }
      ];
      audioState = 'speaking';
      setTimeout(() => {
        if (voiceMode) audioState = 'listening';
        else audioState = 'idle';
      }, 3000);
    } finally {
      isSending = false;
    }
  }

  function simulateVoiceInput() {
    if (audioState === 'listening') {
      audioState = 'thinking';
      setTimeout(() => {
        handleSend('If a gear has 12 teeth and drives a 36-tooth gear, does it turn faster or slower?');
      }, 1200);
    } else {
      audioState = 'listening';
    }
  }
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
  <!-- Header with Role & Safety Indicators -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--border-subtle) pb-4">
    <div class="space-y-0.5">
      <div class="flex items-center gap-2">
        <Sparkles class="w-5 h-5 text-(--accent-primary)" />
        <h1 class="text-xl font-bold text-(--text-primary)">Socratic AI Guide & Voice Mentor</h1>
      </div>
      <p class="text-xs text-(--text-secondary)">
        Thoughtful step-by-step problem decomposition • Child safety & zero answer dumping
      </p>
    </div>

    <div class="flex items-center gap-2">
      <Badge variant="growth" size="sm">
        <Shield class="w-3.5 h-3.5" />
        <span>DPDP Verified & Ephemeral</span>
      </Badge>
      <Button
        variant={voiceMode ? 'primary' : 'outline'}
        size="sm"
        onclick={toggleVoiceMode}
      >
        {#if voiceMode}
          <Mic class="w-3.5 h-3.5" />
          <span>Live Voice Mode</span>
        {:else}
          <Radio class="w-3.5 h-3.5" />
          <span>Enable Voice Mentor</span>
        {/if}
      </Button>
    </div>
  </div>

  <!-- Editorial Socratic Mentor Vignette -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center surface-card rounded-none p-4 sm:p-5 border border-(--border-subtle)">
    <div class="md:col-span-5">
      <IllustrationFrame
        src="/images/illustrations/socratic_inquiry.jpg"
        alt="Asian mentor and student in thoughtful philosophical dialogue over open journals in library courtyard"
        aspectRatio="1:1"
        badge="Socratic Method"
        caption="The Atrium of Inquiry • Step-by-step problem decomposition and intellectual growth."
        credit="CREED OS • Guided Mentorship"
      />
    </div>
    <div class="md:col-span-7 space-y-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
        Pedagogical Principle
      </span>
      <h2 class="text-lg font-bold text-(--text-primary)">
        "We ask the questions that help you discover the principle yourself."
      </h2>
      <p class="text-xs text-(--text-secondary) leading-relaxed">
        The Socratic Guide is designed to prevent passive answers. Instead of solving equations for you, it guides your attention toward identifying invariants, testing edge cases, and sketching mental models.
      </p>
      <div class="pt-2 border-t border-(--border-subtle) flex items-center gap-2 text-xs text-(--text-muted)">
        <Sparkles class="w-3.5 h-3.5 text-(--accent-primary)" />
        <span>Observation tags are captured into your verified longitudinal evidence graph.</span>
      </div>
    </div>
  </div>

  <!-- Voice Mentor Waveform HUD (When Voice Mode is Active) -->
  {#if voiceMode}
    <Card variant="raised" class="p-6 space-y-4 border border-(--accent-primary)/30">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-none {audioState === 'listening' ? 'bg-(--accent-success) animate-ping' : (audioState === 'thinking' ? 'bg-(--accent-primary) animate-pulse' : 'bg-(--accent-indigo)')}"></div>
          <span class="text-xs font-bold uppercase tracking-wider text-(--text-primary)">
            Mentor Voice State:
            <span class="text-(--accent-primary) font-mono">{audioState}</span>
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => (isMuted = !isMuted)}
            class="p-1.5 rounded-none text-(--text-muted) hover:text-(--text-primary) hover:bg-(--surface-sunken) transition-colors cursor-pointer border border-(--border-subtle)"
            aria-label={isMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {#if isMuted}
              <VolumeX class="w-4 h-4" />
            {:else}
              <Volume2 class="w-4 h-4 text-(--accent-primary)" />
            {/if}
          </button>
          <Button variant="secondary" size="sm" onclick={simulateVoiceInput}>
            {#if audioState === 'listening'}
              <span>Simulate Speech</span>
            {:else}
              <span>Listen Again</span>
            {/if}
          </Button>
        </div>
      </div>

      <!-- Dynamic Audio Waveform -->
      <div class="h-20 bg-(--surface-sunken) rounded-none flex items-center justify-center px-4 overflow-hidden relative border border-(--border-subtle)">
        <div class="flex items-center gap-1.5 h-12">
          {#each [16, 28, 44, 20, 36, 48, 24, 40, 32, 18, 42, 22, 38, 26, 34] as h, i}
            <div
              class="w-1.5 rounded-none transition-all duration-300 {audioState === 'listening' ? 'bg-(--accent-success)' : (audioState === 'thinking' ? 'bg-(--accent-primary)' : (audioState === 'speaking' ? 'bg-(--accent-indigo)' : 'bg-(--border-subtle)'))}"
              style="height: {audioState === 'idle' ? 6 : (audioState === 'listening' ? Math.max(8, (h * 0.7) + (Math.sin(i) * 10)) : (audioState === 'thinking' ? 12 + (i % 4) * 6 : Math.max(10, h)))}px;"
            ></div>
          {/each}
        </div>

        <span class="absolute bottom-1.5 text-[10px] text-(--text-muted) font-mono">
          {#if audioState === 'listening'}
            Listening for your reasoning...
          {:else if audioState === 'thinking'}
            Formulating Socratic question...
          {:else if audioState === 'speaking'}
            Guiding your thought process...
          {:else}
            Voice mentor standing by
          {/if}
        </span>
      </div>
    </Card>
  {/if}

  <!-- Chat History Window -->
  <Card variant="canvas" class="p-6 space-y-4 min-h-100 max-h-135 overflow-y-auto">
    {#each messages as msg}
      <div class="flex items-start gap-3 {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
        {#if msg.role === 'assistant'}
          <div class="w-8 h-8 rounded-none bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center shrink-0 border border-(--border-subtle)">
            <Bot class="w-4 h-4" />
          </div>
        {/if}

        <div class="space-y-2 max-w-[80%]">
          <div class="p-4 rounded-none text-sm leading-relaxed border {msg.role === 'user' ? 'bg-(--accent-primary) text-white font-medium border-(--accent-primary)' : 'surface-card text-(--text-primary) border-(--border-subtle)'}">
            {msg.text}
          </div>

          {#if msg.observation}
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-none badge-growth text-[11px] font-medium border border-(--border-subtle)">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>Evidence Captured: [{msg.observation.competency}] — {msg.observation.note}</span>
            </div>
          {/if}
        </div>

        {#if msg.role === 'user'}
          <div class="w-8 h-8 rounded-none bg-(--surface-sunken) border border-(--border-subtle) flex items-center justify-center text-(--text-primary) shrink-0 font-semibold text-xs">
            AV
          </div>
        {/if}
      </div>
    {/each}

    {#if isSending}
      <div class="flex items-center gap-2 text-xs text-(--accent-primary) pl-11">
        <div class="w-2 h-2 rounded-none bg-(--accent-primary) animate-pulse"></div>
        <span>Formulating Socratic inquiry...</span>
      </div>
    {/if}
  </Card>

  <!-- Socratic Strategy Nudges -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {#each socraticNudges as nudge}
      <div class="p-3 rounded-none bg-(--surface-sunken) border border-(--border-subtle) text-xs space-y-0.5">
        <span class="font-bold text-(--accent-primary) flex items-center gap-1">
          <Compass class="w-3 h-3" />
          {nudge.title}
        </span>
        <p class="text-(--text-muted) text-[11px] leading-tight">{nudge.desc}</p>
      </div>
    {/each}
  </div>

  <!-- Prompt Starters -->
  <div class="space-y-2">
    <span class="text-xs text-(--text-muted) font-medium flex items-center gap-1.5">
      <Lightbulb class="w-3.5 h-3.5 text-(--accent-warning)" />
      <span>Suggested Reasoning Questions</span>
    </span>
    <div class="flex flex-wrap gap-2">
      {#each samplePrompts as prompt}
        <button
          type="button"
          onclick={() => handleSend(prompt)}
          class="px-3.5 py-1.5 rounded-none surface-card text-xs text-(--text-secondary) hover:text-(--text-primary) hover:border-(--accent-primary) transition-colors text-left cursor-pointer border border-(--border-subtle)"
        >
          {prompt}
        </button>
      {/each}
    </div>
  </div>

  <!-- Message Input Bar -->
  <form
    onsubmit={(e) => {
      e.preventDefault();
      handleSend();
    }}
    class="flex items-center gap-2 p-2 rounded-none surface-card border border-(--border-subtle)"
  >
    <input
      type="text"
      bind:value={inputQuery}
      placeholder="Ask about a problem, concept, or project mission constraint..."
      class="flex-1 bg-transparent px-4 py-2.5 text-sm text-(--text-primary) placeholder-(--text-muted) focus:outline-none"
    />
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={!inputQuery.trim() || isSending}
    >
      <span>Ask</span>
      <Send class="w-4 h-4" />
    </Button>
  </form>
</div>

