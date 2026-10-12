<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Mic,
    MicOff,
    Send,
    Volume2,
    VolumeX,
    Sparkles,
    AlertCircle,
    Coffee,
    X,
    Activity
  } from 'lucide-svelte';
  import { affectiveTracker } from '$lib/telemetry/affective.svelte';

  interface Message {
    id: string;
    role: 'student' | 'guide';
    text: string;
    time: string;
    observation?: { competency: string; note: string };
  }

  let { initialTopic = 'Robotics & Mechanical Kinematics' } = $props<{
    initialTopic?: string;
  }>();

  let messages = $state<Message[]>([]);

  let inputText = $state('');
  let isSending = $state(false);
  let isListening = $state(false);
  let ttsEnabled = $state(true);
  let recognition: any = null;

  // Thinking moves / scaffolding prompts
  const thinkingPrompts = [
    { label: 'Decompose', text: 'How can I break down this multi-gear drive ratio?' },
    { label: 'Hypothesize', text: 'If I double the torque, what happens to angular velocity?' },
    { label: 'Falsify', text: 'What test would prove my sensor calibration is incorrect?' }
  ];

  onMount(() => {
    messages = [
      {
        id: 'm1',
        role: 'guide',
        text: `Hello! I am your Socratic Mentor for ${initialTopic}. Tell me what challenge you are working on or what hypothesis you'd like to test.`,
        time: 'Just now'
      }
    ];
    affectiveTracker.startListening();

    // Check Web Speech Recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            inputText = transcript;
            isListening = false;
            sendMessage();
          }
        };

        recognition.onerror = () => {
          isListening = false;
        };

        recognition.onend = () => {
          isListening = false;
        };
      }
    }
  });

  onDestroy(() => {
    affectiveTracker.stopListening();
    if (recognition) {
      try {
        recognition.abort();
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  });

  function toggleSpeechRecognition() {
    if (!recognition) {
      alert('Speech Recognition is not supported in this browser. You can type your question.');
      return;
    }

    if (isListening) {
      recognition.stop();
      isListening = false;
    } else {
      isListening = true;
      recognition.start();
    }
  }

  function speakResponse(text: string) {
    if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Gentle, measured cadence
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  async function sendMessage() {
    if (!inputText.trim() || isSending) return;
    const userText = inputText.trim();
    inputText = '';

    messages.push({
      id: `usr-${Date.now()}`,
      role: 'student',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    isSending = true;

    try {
      const history = messages.map((m) => ({
        role: m.role === 'student' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/v1/ai/mentor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userText,
          history
        })
      });

      if (!res.ok) throw new Error('Mentor service error');

      const data = await res.json();
      const reply = data.reply || 'What is the first sub-problem we can test together?';

      messages.push({
        id: `ai-${Date.now()}`,
        role: 'guide',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        observation: data.observation
      });

      speakResponse(reply);
    } catch (err: any) {
      console.error('Socratic mentor error:', err);
      const fallback =
        'Before moving forward, what is the single most important variable you are trying to solve for?';
      messages.push({
        id: `ai-fb-${Date.now()}`,
        role: 'guide',
        text: fallback,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      speakResponse(fallback);
    } finally {
      isSending = false;
    }
  }
</script>

<div class="flex flex-col h-162.5 border border-border bg-surface shadow-xs rounded-none font-sans">
  <!-- 1. Header with Affective Telemetry Status & Child-Safety Tag -->
  <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-subtle">
    <div class="flex items-center gap-3">
      <div class="p-1.5 bg-ai-subtle border border-ai/20">
        <Sparkles class="size-4 text-ai" />
      </div>
      <div>
        <h3 class="text-sm font-semibold tracking-tight text-ink flex items-center gap-2">
          Socratic Mentor
          <span class="text-[10px] font-mono font-normal px-1.5 py-0.5 bg-surface border border-border text-ink-muted">
            Voice • Ephemeral
          </span>
        </h3>
        <p class="text-xs text-ink-muted">Non-directive guidance • Never gives direct answers</p>
      </div>
    </div>

    <!-- Cognitive Rhythm Indicator -->
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-border bg-surface">
        <Activity class="size-3.5 {affectiveTracker.rhythm === 'calm' ? 'text-mint' : affectiveTracker.rhythm === 'focused' ? 'text-brand' : 'text-attention'}" />
        <span class="text-ink-secondary">
          Rhythm:
          <span class="font-medium capitalize text-ink">{affectiveTracker.rhythm}</span>
        </span>
      </div>

      <button
        onclick={() => (ttsEnabled = !ttsEnabled)}
        title={ttsEnabled ? 'Disable Voice Playback' : 'Enable Voice Playback'}
        class="p-1.5 border border-border hover:bg-surface-overlay transition-micro {ttsEnabled ? 'text-ink' : 'text-ink-muted'}"
      >
        {#if ttsEnabled}
          <Volume2 class="size-4" />
        {:else}
          <VolumeX class="size-4" />
        {/if}
      </button>
    </div>
  </div>

  <!-- 2. Physical Maker Break Alert (Triggered automatically by Affective Telemetry) -->
  {#if affectiveTracker.breakSuggestion.active}
    <div class="flex items-center justify-between px-4 py-2 bg-attention-subtle border-b border-attention/30 text-attention text-xs transition-micro">
      <div class="flex items-center gap-2">
        <Coffee class="size-4 shrink-0" />
        <div>
          <span class="font-bold">{affectiveTracker.breakSuggestion.title}:</span>
          <span class="ml-1 text-ink">{affectiveTracker.breakSuggestion.instruction}</span>
        </div>
      </div>
      <button
        onclick={() => affectiveTracker.dismissBreak()}
        class="p-1 hover:bg-attention/20 text-attention transition-micro"
        title="Dismiss Break"
      >
        <X class="size-3.5" />
      </button>
    </div>
  {/if}

  <!-- 3. Chat Messages Stream -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-canvas">
    {#each messages as msg (msg.id)}
      <div class="flex flex-col {msg.role === 'student' ? 'items-end' : 'items-start'}">
        <div
          class="max-w-[85%] p-3 text-xs leading-relaxed border {msg.role === 'student'
            ? 'bg-brand text-brand-foreground border-brand'
            : 'bg-surface text-ink border-border shadow-2xs'}"
        >
          <p>{msg.text}</p>
        </div>

        <div class="flex items-center gap-2 mt-1 text-[10px] text-ink-muted font-mono">
          <span>{msg.role === 'student' ? 'You' : 'Socratic Guide'}</span>
          <span>•</span>
          <span>{msg.time}</span>
          {#if msg.observation}
            <span>•</span>
            <span class="text-mint font-medium">Logged: {msg.observation.competency}</span>
          {/if}
        </div>
      </div>
    {/each}

    {#if isSending}
      <div class="flex items-center gap-2 text-xs text-ink-muted py-2">
        <div class="size-2 bg-ai animate-ping"></div>
        <span>Formulating Socratic decomposition question...</span>
      </div>
    {/if}
  </div>

  <!-- 4. Scaffolding Thinking Moves -->
  <div class="flex items-center gap-2 px-4 py-2 border-t border-border bg-surface-subtle overflow-x-auto">
    <span class="text-[10px] font-mono text-ink-muted uppercase tracking-wider shrink-0">Prompts:</span>
    {#each thinkingPrompts as move}
      <button
        onclick={() => {
          inputText = move.text;
          sendMessage();
        }}
        class="px-3 py-1 text-xs border border-border bg-surface hover:border-ink-muted text-ink-secondary hover:text-ink transition-micro shrink-0"
      >
        <span class="font-medium text-brand mr-1">[{move.label}]</span>
        <span>{move.text}</span>
      </button>
    {/each}
  </div>

  <!-- 5. Voice Input & Text Control Bar -->
  <div class="flex items-center gap-2 p-3 border-t border-border bg-surface">
    <button
      onclick={toggleSpeechRecognition}
      class="p-2 border transition-micro {isListening
        ? 'bg-red border-red text-white animate-pulse'
        : 'border-border hover:bg-surface-overlay text-ink'}"
      title={isListening ? 'Listening (Click to stop)' : 'Speak your question'}
    >
      {#if isListening}
        <MicOff class="size-4" />
      {:else}
        <Mic class="size-4" />
      {/if}
    </button>

    <input
      type="text"
      bind:value={inputText}
      onkeydown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder={isListening ? 'Listening to your voice...' : 'Ask a question or explain your reasoning...'}
      class="flex-1 px-3 py-2 text-xs bg-surface-canvas border border-border text-ink focus:outline-none focus:border-brand"
    />

    <button
      onclick={sendMessage}
      disabled={!inputText.trim() || isSending}
      class="flex items-center gap-1.5 px-4 py-2 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold text-xs transition-micro disabled:opacity-50"
    >
      <Send class="size-3.5" />
      <span>Send</span>
    </button>
  </div>
</div>
