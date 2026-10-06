<script lang="ts">
  import {
    Sparkles,
    Send,
    Bot,
    Compass,
    Mic,
    MicOff,
    Radio,
    Shield,
    Volume2,
    VolumeX,
    CheckCircle2
  } from 'lucide-svelte';
  import { AIExplainability } from '$lib/components';

  interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    text: string;
    state?: 'asking' | 'reflecting' | 'summarizing';
    observation?: { competency: string; note: string };
  }

  type GuideState = 'idle' | 'listening' | 'thinking' | 'your_turn' | 'reflecting' | 'summarizing';

  let messages = $state<ChatMessage[]>([
    {
      id: 'm1',
      role: 'assistant',
      text: "Tell me how you're thinking about the kinematic linkage problem. What do you notice about how the driving gear's rotational speed affects the output arm?",
      state: 'asking'
    }
  ]);

  let inputQuery = $state('');
  let isSending = $state(false);
  let voiceMode = $state(false);
  let guideState = $state<GuideState>('your_turn');
  let isMuted = $state(false);

  const thinkingMoves = [
    { title: 'Decompose', desc: 'Identify known vs unknown variables' },
    { title: 'Represent', desc: 'Sketch a mental model or diagram' },
    { title: 'Test', desc: 'What happens at extreme values (zero or max)?' },
    { title: 'Compare', desc: 'Contrast with a simpler balanced system' }
  ];

  function toggleVoiceMode() {
    voiceMode = !voiceMode;
    if (voiceMode) {
      guideState = 'listening';
    } else {
      guideState = 'your_turn';
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
    guideState = 'thinking';

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
      guideState = 'reflecting';

      setTimeout(() => {
        guideState = voiceMode ? 'listening' : 'your_turn';
      }, 2500);
    } catch {
      messages = [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'What happens if we double the number of teeth on the receiving gear? Does torque increase or decrease?',
          state: 'reflecting'
        }
      ];
      guideState = 'your_turn';
    } finally {
      isSending = false;
    }
  }

  function simulateVoiceSpeech() {
    if (guideState === 'listening') {
      guideState = 'thinking';
      setTimeout(() => {
        handleSend('If the driving gear has 12 teeth and the driven gear has 36 teeth, the driven gear turns one-third as fast.');
      }, 1000);
    } else {
      guideState = 'listening';
    }
  }

  const stateLabels: Record<GuideState, { label: string; color: string }> = {
    idle: { label: 'Ready', color: 'text-(--text-muted) bg-(--surface-sunken)' },
    listening: { label: 'Listening...', color: 'text-(--accent-success) bg-(--accent-success-subtle)' },
    thinking: { label: 'Thinking...', color: 'text-(--accent-primary) bg-(--accent-primary-subtle)' },
    your_turn: { label: 'Your turn', color: 'text-(--accent-indigo) bg-(--accent-indigo-subtle)' },
    reflecting: { label: 'Reflecting...', color: 'text-(--accent-warning) bg-(--accent-warning-subtle)' },
    summarizing: { label: 'Synthesizing...', color: 'text-(--accent-success) bg-(--accent-success-subtle)' }
  };
</script>

<div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
  <!-- 1. HEADER: Guided Thinking Studio context -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
          Guided Thinking Studio
        </span>
        <span class="text-xs text-(--text-muted)">•</span>
        <span class="px-2 py-0.5 rounded-sm text-[11px] font-medium border border-(--border-subtle) {stateLabels[guideState].color}">
          {stateLabels[guideState].label}
        </span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-(--text-primary) tracking-tight">
        Socratic Guide
      </h1>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        We're exploring: <strong class="text-(--text-primary)">Kinematic Linkage & Gear Ratio Balancing</strong>
      </p>
    </div>

    <div class="flex items-center gap-2">
      <!-- Consent Protection Badge -->
      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[11px] font-medium bg-(--surface-sunken) text-(--text-secondary) border border-(--border-subtle)">
        <Shield class="w-3.5 h-3.5 text-(--accent-success)" />
        <span>Child Guardrails Active</span>
      </span>

      <!-- Voice Session Mode Switcher -->
      <button
        type="button"
        onclick={toggleVoiceMode}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-all border cursor-pointer {voiceMode ? 'bg-(--accent-primary) text-white border-(--accent-primary)' : 'surface-card text-(--text-secondary) hover:text-(--text-primary) border-(--border-subtle)'}"
      >
        {#if voiceMode}
          <Mic class="w-3.5 h-3.5 animate-pulse" />
          <span>Exit Voice Mode</span>
        {:else}
          <Radio class="w-3.5 h-3.5" />
          <span>Start Voice Session</span>
        {/if}
      </button>
    </div>
  </header>

  <!-- 2. THINKING MOVES RIBBON (Restrained instrument toolbar) -->
  <div class="flex flex-wrap items-center gap-2 pb-2">
    <span class="text-xs font-semibold text-(--text-muted) flex items-center gap-1 mr-1">
      <Compass class="w-3.5 h-3.5 text-(--accent-indigo)" />
      Thinking Moves:
    </span>
    {#each thinkingMoves as move}
      <button
        type="button"
        onclick={() => handleSend(`Can you guide me to ${move.title.toLowerCase()} this problem?`)}
        class="px-3 py-1.5 rounded-sm surface-card hover:bg-(--surface-sunken) text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer"
      >
        <strong class="text-(--text-primary)">{move.title}:</strong> {move.desc}
      </button>
    {/each}
  </div>

  <!-- 3. CENTRAL CONVERSATION WORKSPACE (The primary instrument) -->
  <div class="surface-card rounded-sm border border-(--border-subtle) overflow-hidden flex flex-col min-h-120">
    <!-- Voice HUD (Active only during voice mode) -->
    {#if voiceMode}
      <div class="px-6 py-4 border-b border-(--border-subtle) bg-(--surface-sunken) flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 h-6">
            {#each [12, 22, 34, 16, 28, 38, 20, 30, 24, 14, 32, 18] as h, i}
              <div
                class="w-1 rounded-full transition-all duration-150 {guideState === 'listening' ? 'bg-(--accent-success)' : (guideState === 'thinking' ? 'bg-(--accent-primary)' : 'bg-(--border-strong)')}"
                style="height: {guideState === 'listening' ? Math.max(6, (h * 0.6) + (Math.sin(i) * 6)) : 6}px;"
              ></div>
            {/each}
          </div>
          <span class="text-xs text-(--text-secondary) font-medium">
            {guideState === 'listening' ? 'Listening to speech...' : (guideState === 'thinking' ? 'Synthesizing...' : 'Voice mode ready')}
          </span>
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
            onclick={simulateVoiceSpeech}
            class="px-3 py-1.5 rounded-sm bg-(--surface-raised) hover:bg-(--surface-sunken) text-xs font-medium text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer"
          >
            {guideState === 'listening' ? 'Simulate Voice' : 'Listen Again'}
          </button>
        </div>
      </div>
    {/if}

    <!-- Connected Message Stream -->
    <div class="p-6 space-y-6 flex-1 overflow-y-auto bg-(--surface-canvas)">
      {#each messages as msg}
        <div class="flex items-start gap-3 {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
          {#if msg.role === 'assistant'}
            <div class="w-7 h-7 rounded-sm bg-(--accent-indigo-subtle) text-(--accent-indigo) flex items-center justify-center shrink-0 border border-(--border-subtle)">
              <Bot class="w-4 h-4" />
            </div>
          {/if}

          <div class="space-y-2 max-w-[85%]">
            <div class="p-4 rounded-sm text-xs sm:text-sm leading-relaxed border {msg.role === 'user' ? 'bg-(--accent-primary) text-white font-medium border-(--accent-primary)' : 'surface-card text-(--text-primary) border-(--border-subtle)'}">
              {msg.text}
            </div>

            <!-- AI Provenance & Explainability (Restrained, no neon glow) -->
            {#if msg.role === 'assistant'}
              <div class="flex items-center gap-3 text-[11px] text-(--text-muted) px-1">
                <span class="inline-flex items-center gap-1 text-(--accent-indigo) font-medium">
                  <Sparkles class="w-3 h-3" />
                  <span>Socratic Guide</span>
                </span>
                <span>•</span>
                <AIExplainability
                  evidenceUsed="Kinematic Linkage Maker Trial #EVD-3904 + Proportional Reasoning Diagnostic"
                  reasoning="Decomposes the inverse relationship between gear tooth count and rotational velocity without solving the arithmetic directly."
                  limitations="Purely formative Socratic dialogue; deterministic scores are derived solely from verified assessment items."
                />
              </div>
            {/if}

            <!-- Verified Observation Tag -->
            {#if msg.observation}
              <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-(--accent-success-subtle) text-(--accent-success) text-xs font-medium border border-(--border-subtle)">
                <CheckCircle2 class="w-3.5 h-3.5" />
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
          <span>Formulating Socratic question...</span>
        </div>
      {/if}
    </div>

    <!-- 4. INPUT INSTRUMENT (Speak / Type) -->
    <div class="p-4 sm:p-5 bg-(--surface-sunken) border-t border-(--border-subtle)">
      <form
        onsubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        class="flex items-center gap-3"
      >
        <button
          type="button"
          onclick={simulateVoiceSpeech}
          class="px-3.5 py-2.5 rounded-sm surface-card hover:bg-(--surface-raised) text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Voice input"
        >
          <Mic class="w-4 h-4 text-(--accent-indigo)" />
          <span class="hidden sm:inline">Speak</span>
        </button>

        <input
          type="text"
          bind:value={inputQuery}
          placeholder="Explain your thinking or ask what happens when a variable changes..."
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
