<script lang="ts">
  import {
    Mic,
    MicOff,
    Send,
    Sparkles,
    CheckCircle2,
    ArrowLeft
  } from 'lucide-svelte';

  interface ChatMessage {
    id: string;
    role: 'guide' | 'student';
    text: string;
    time: string;
  }

  type VoiceState = 'idle' | 'listening' | 'thinking' | 'your_turn';

  let messages = $state<ChatMessage[]>([
    {
      id: 'm1',
      role: 'guide',
      text: "Tell me what you notice first about the driving gear and the driven arm.",
      time: '10:02 AM'
    }
  ]);

  let inputText = $state('');
  let isSending = $state(false);
  let voiceMode = $state(false);
  let voiceState = $state<VoiceState>('your_turn');

  const thinkingMoves = [
    { title: 'Decompose', prompt: 'Let\'s break down the driving torque vs resisting arm load.' },
    { title: 'Represent', prompt: 'How would you draw the gear radius ratio as a simple fraction?' },
    { title: 'Test', prompt: 'What happens to the output speed if the driving gear radius doubles?' },
    { title: 'Compare', prompt: 'How does this compare to a simple seesaw lever balance?' }
  ];

  function applyThinkingMove(move: typeof thinkingMoves[0]) {
    inputText = move.prompt;
  }

  function toggleVoice() {
    voiceMode = !voiceMode;
    if (voiceMode) {
      voiceState = 'listening';
      setTimeout(() => {
        if (voiceMode) voiceState = 'thinking';
        setTimeout(() => {
          if (voiceMode) voiceState = 'your_turn';
        }, 1500);
      }, 3000);
    } else {
      voiceState = 'your_turn';
    }
  }

  async function handleSend() {
    if (!inputText.trim() || isSending) return;
    const userMsg = inputText.trim();
    inputText = '';

    messages.push({
      id: `m-${Date.now()}`,
      role: 'student',
      text: userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    isSending = true;
    voiceState = 'thinking';

    try {
      const history = messages
        .filter((m) => m.text)
        .map((m) => ({
          role: m.role === 'student' ? 'user' : 'assistant',
          content: m.text
        }));

      const res = await fetch('/api/v1/ai/mentor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history
        })
      });

      if (res.ok) {
        const data = await res.json();
        messages.push({
          id: `m-${Date.now() + 1}`,
          role: 'guide',
          text: data.reply || 'What led you to that reasoning step?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        throw new Error('Mentor service unavailable');
      }
    } catch (err: any) {
      console.error('[mentor/chat] Socratic mentor inference request failed:', {
        userMessage: userMsg,
        error: err?.message || err
      });
      messages.push({
        id: `m-${Date.now() + 1}`,
        role: 'guide',
        text: 'I had trouble connecting to the mentor service just now. Please try your question again or check your network connection.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      isSending = false;
      voiceState = 'your_turn';
    }
  }
</script>

<svelte:head>
  <title>Guided Thinking Studio — CREED OS</title>
</svelte:head>

<div class="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col justify-between py-2 space-y-4">
  <!-- 1. ORIENT: Topic & Minimal Chrome -->
  <header class="space-y-3 pb-3 border-b border-border">
    <div class="flex items-center justify-between">
      <a
        href="/student"
        class="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Today's Focus</span>
      </a>

      <!-- Restrained AI Status Tag -->
      <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-ai-subtle text-ai text-xs font-medium">
        <Sparkles class="w-3 h-3" />
        <span>Socratic Mentor • Non-judgmental</span>
      </span>
    </div>

    <div>
      <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-ink">
        Kinematics & Gear Ratio Balancing
      </h1>
      <p class="text-xs text-ink-secondary">
        Guided reasoning session • Proportional equations in mechanical design
      </p>
    </div>

    <!-- Thinking Moves Toolbar -->
    <div class="flex flex-wrap items-center gap-1.5 pt-1">
      <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider mr-1">
        Moves:
      </span>
      {#each thinkingMoves as move}
        <button
          type="button"
          onclick={() => applyThinkingMove(move)}
          class="px-2.5 py-1 rounded-sm bg-surface hover:bg-surface-subtle border border-border text-xs font-medium text-ink-secondary hover:text-ink transition-colors cursor-pointer"
        >
          {move.title}
        </button>
      {/each}
    </div>
  </header>

  <!-- 2. CONVERSATION SURFACE (Primary UI) -->
  <div class="flex-1 overflow-y-auto space-y-6 pr-2">
    {#each messages as msg}
      <div class="flex flex-col {msg.role === 'student' ? 'items-end' : 'items-start'} space-y-1">
        <div class="flex items-center gap-2 text-[11px] text-ink-muted">
          <span class="font-medium {msg.role === 'guide' ? 'text-ai' : 'text-ink'}">
            {msg.role === 'guide' ? 'Guide' : 'You'}
          </span>
          <span>•</span>
          <span>{msg.time}</span>
        </div>

        <div
          class="max-w-[85%] sm:max-w-[75%] p-4 rounded-sm text-sm leading-relaxed {msg.role === 'student' ? 'bg-brand text-white' : 'bg-surface border border-border text-ink'}"
        >
          {msg.text}
        </div>
      </div>
    {/each}

    {#if isSending}
      <div class="flex flex-col items-start space-y-1">
        <span class="text-[11px] font-medium text-ai">Guide</span>
        <div class="p-4 rounded-sm bg-surface border border-border text-xs text-ink-muted flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-ai animate-ping"></div>
          <span>Synthesizing pedagogical scaffold...</span>
        </div>
      </div>
    {/if}
  </div>

  <!-- 3. ACT: Interaction Chrome (Voice Indicator & Input) -->
  <footer class="pt-3 border-t border-border space-y-3">
    <!-- Restrained Voice Status Bar in Chrome -->
    {#if voiceMode}
      <div class="flex items-center justify-between px-3 py-1.5 rounded-sm bg-surface-subtle border border-border text-xs">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-ai opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-ai"></span>
          </span>
          <span class="font-medium text-ink">
            {#if voiceState === 'listening'}
              Listening • Speak your reasoning...
            {:else if voiceState === 'thinking'}
              Thinking...
            {:else}
              Your turn
            {/if}
          </span>
        </div>
        <button
          type="button"
          onclick={toggleVoice}
          class="text-xs text-ink-muted hover:text-ink underline cursor-pointer"
        >
          Exit voice
        </button>
      </div>
    {/if}

    <form
      onsubmit={(e) => { e.preventDefault(); handleSend(); }}
      class="flex items-center gap-2"
    >
      <button
        type="button"
        onclick={toggleVoice}
        title={voiceMode ? 'Voice active' : 'Enable voice mentor'}
        class="p-2.5 rounded-sm border transition-colors cursor-pointer {voiceMode ? 'bg-ai-subtle border-ai text-ai' : 'bg-surface border border-border text-ink-secondary hover:text-ink'}"
      >
        {#if voiceMode}
          <Mic class="w-4 h-4" />
        {:else}
          <MicOff class="w-4 h-4" />
        {/if}
      </button>

      <input
        type="text"
        bind:value={inputText}
        placeholder="Speak or type your reasoning..."
        class="flex-1 px-4 py-2.5 rounded-sm bg-surface border border-border text-sm text-ink placeholder-ink-muted focus:outline-hidden focus:border-brand transition-colors"
      />

      <button
        type="submit"
        disabled={!inputText.trim() || isSending}
        class="px-4 py-2.5 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span>Ask</span>
        <Send class="w-3.5 h-3.5" />
      </button>
    </form>
  </footer>
</div>
