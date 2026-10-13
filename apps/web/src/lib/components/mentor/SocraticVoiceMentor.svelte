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
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-border bg-surface-raised">
    <div class="flex items-center gap-3">
      <div class="p-1.5 bg-ai-subtle border border-ai/20 rounded-sm">
        <Sparkles class="size-4 text-ai" />
      </div>
      <div>
        <h3 class="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          Socratic Mentor
          <span class="text-[10px] font-mono font-normal px-1.5 py-0.5 bg-surface border border-border text-foreground-secondary rounded-sm">
            Voice • Ephemeral
          </span>
        </h3>
        <p class="text-xs text-foreground-secondary">
          Pedagogical policy: Guided inquiry & clarifying questions
        </p>
      </div>
    </div>

    <!-- Cognitive Rhythm Indicator & Audio Controls -->
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono border border-border bg-surface rounded-sm">
        <Activity class="size-3.5 {affectiveTracker.rhythm === 'calm' ? 'text-positive' : affectiveTracker.rhythm === 'focused' ? 'text-ai' : 'text-attention'}" />
        <span class="text-foreground-secondary">
          Rhythm:
          <span class="font-medium capitalize text-foreground">{affectiveTracker.rhythm}</span>
        </span>
      </div>

      <button
        onclick={() => (ttsEnabled = !ttsEnabled)}
        title={ttsEnabled ? 'Disable Voice Playback' : 'Enable Voice Playback'}
        class="p-1.5 border border-border hover:bg-surface-raised rounded-sm transition-colors cursor-pointer {ttsEnabled ? 'text-foreground' : 'text-foreground-secondary'}"
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
    <div class="flex items-center justify-between px-4 py-2 bg-attention-subtle border-b border-attention/30 text-attention text-xs transition-colors">
      <div class="flex items-center gap-2">
        <Coffee class="size-4 shrink-0" />
        <div>
          <span class="font-bold">{affectiveTracker.breakSuggestion.title}:</span>
          <span class="ml-1 text-foreground">{affectiveTracker.breakSuggestion.instruction}</span>
        </div>
      </div>
      <button
        onclick={() => affectiveTracker.dismissBreak()}
        class="p-1 hover:bg-attention/20 text-attention transition-colors rounded-sm cursor-pointer"
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
          class="max-w-[85%] p-3.5 text-xs leading-relaxed border rounded-sm {msg.role === 'student'
            ? 'bg-foreground text-background border-foreground font-medium'
            : 'bg-surface text-foreground border-border shadow-xs'}"
        >
          <p>{msg.text}</p>
        </div>

        <div class="flex items-center gap-2 mt-1 text-[10px] text-foreground-secondary font-mono">
          <span>{msg.role === 'student' ? 'You' : 'Socratic Guide'}</span>
          <span>•</span>
          <span>{msg.time}</span>
          {#if msg.observation}
            <span>•</span>
            <span class="text-positive font-medium">Logged: {msg.observation.competency}</span>
          {/if}
        </div>
      </div>
    {/each}

    {#if isSending}
      <div class="flex items-center gap-2 text-xs text-foreground-secondary py-2">
        <div class="size-2 bg-ai animate-ping rounded-none"></div>
        <span>Formulating Socratic decomposition question...</span>
      </div>
    {/if}
  </div>

  <!-- 4. Scaffolding Thinking Moves (Wrapping Chips, No Overflow Scrollbar) -->
  <div class="flex flex-wrap items-center gap-2 px-4 py-2 border-t border-border bg-surface-raised">
    <span class="text-[10px] font-mono text-foreground-secondary uppercase tracking-wider mr-1">
      Scaffold Prompts:
    </span>
    {#each thinkingPrompts as move}
      <button
        type="button"
        onclick={() => {
          inputText = move.text;
          sendMessage();
        }}
        class="inline-flex items-center px-3 py-1 text-xs border border-border bg-surface hover:bg-surface-raised text-foreground rounded-sm transition-colors cursor-pointer shadow-2xs"
      >
        <span class="font-semibold text-ai mr-1">[{move.label}]</span>
        <span class="text-foreground-secondary hover:text-foreground">{move.text}</span>
      </button>
    {/each}
  </div>

  <!-- 5. Voice Input & Text Control Bar -->
  <div class="flex items-center gap-2 p-3 border-t border-border bg-surface">
    <button
      type="button"
      onclick={toggleSpeechRecognition}
      class="p-2 border rounded-sm transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium {isListening
        ? 'bg-critical text-critical-foreground border-critical animate-pulse'
        : 'border-border hover:bg-surface-raised text-foreground'}"
      title={isListening ? 'Listening (Click to stop)' : 'Speak your question'}
    >
      {#if isListening}
        <MicOff class="size-4" />
        <span class="hidden sm:inline text-[11px]">Listening...</span>
      {:else}
        <Mic class="size-4" />
        <span class="hidden sm:inline text-[11px] text-foreground-secondary">Voice</span>
      {/if}
    </button>

    <input
      type="text"
      bind:value={inputText}
      onkeydown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder={isListening ? 'Listening to your voice...' : 'Ask a question or explain your reasoning...'}
      class="flex-1 px-3 py-2 text-xs bg-surface-raised border border-border text-foreground placeholder:text-foreground-secondary rounded-sm focus:outline-hidden focus:border-foreground"
    />

    <button
      type="button"
      onclick={sendMessage}
      disabled={!inputText.trim() || isSending}
      class="flex items-center gap-1.5 px-4 py-2 bg-foreground hover:bg-foreground/90 text-background font-medium text-xs rounded-sm transition-colors cursor-pointer disabled:opacity-40"
    >
      <Send class="size-3.5" />
      <span>Send</span>
    </button>
  </div>
</div>
