<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import {
    Mic,
    MicOff,
    Send,
    Volume2,
    VolumeX,
    BrainCircuit,
    Activity,
    Radio,
    ShieldCheck
  } from 'lucide-svelte';

  interface Message {
    id: string;
    role: 'student' | 'guide';
    text: string;
    time: string;
    observation?: { competency: string; note: string };
  }

  let { initialTopic = 'Robotics & Mechanical Kinematics' }: {
    initialTopic?: string;
  } = $props();

  let messages = $state<Message[]>([]);
  let inputText = $state('');
  let isSending = $state(false);
  let isListening = $state(false);
  let ttsEnabled = $state(true);
  let liveSessionActive = $state(false);
  let liveModeAvailable = $state<boolean | null>(null);
  let liveConnectionStatus = $state<'idle' | 'connecting' | 'connected' | 'fallback'>('idle');

  // Audio stream state for Live API
  let audioContext: AudioContext | null = null;
  let micStream: MediaStream | null = null;
  let audioProcessor: ScriptProcessorNode | null = null;
  let liveSocket: WebSocket | null = null;
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

    // Proactively check ephemeral token availability for Gemini Live API
    checkLiveApiAvailability();

    // Setup standard Web Speech Recognition as baseline fallback
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const transcript = event.results?.[0]?.[0]?.transcript;
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
    stopLiveAudio();
    if (recognition) {
      try {
        recognition.abort();
      } catch {}
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  });

  async function checkLiveApiAvailability() {
    try {
      const res = await fetch('/api/v1/ai/mentor/token', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.available && data.token) {
          liveModeAvailable = true;
          liveConnectionStatus = 'idle';
          return;
        }
      }
      liveModeAvailable = false;
      liveConnectionStatus = 'fallback';
    } catch {
      liveModeAvailable = false;
      liveConnectionStatus = 'fallback';
    }
  }

  async function startLiveSession() {
    liveConnectionStatus = 'connecting';
    try {
      const res = await fetch('/api/v1/ai/mentor/token', { method: 'POST' });
      if (!res.ok) throw new Error('Live token generation unavailable');
      const data = await res.json();

      if (!data.available || !data.token || !data.wsUrl) {
        throw new Error(data.message || 'Live API mode not available');
      }

      // Connect to Gemini Live WebSocket endpoint
      const wsUrlWithToken = `${data.wsUrl}?access_token=${encodeURIComponent(data.token)}`;
      liveSocket = new WebSocket(wsUrlWithToken);

      liveSocket.onopen = async () => {
        liveSessionActive = true;
        liveConnectionStatus = 'connected';
        await initMicrophoneStream();
      };

      liveSocket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          handleLiveServerEvent(payload);
        } catch (err) {
          console.error('Error parsing Live API WebSocket frame:', err);
        }
      };

      liveSocket.onerror = (err) => {
        console.warn('Live WebSocket error, falling back to REST mentor:', err);
        liveConnectionStatus = 'fallback';
        stopLiveAudio();
      };

      liveSocket.onclose = () => {
        liveSessionActive = false;
        if (liveConnectionStatus === 'connected') {
          liveConnectionStatus = 'idle';
        }
        stopLiveAudio();
      };
    } catch (err) {
      console.warn('Live session initialization error, falling back:', err);
      liveConnectionStatus = 'fallback';
      liveModeAvailable = false;
    }
  }

  function handleLiveServerEvent(payload: any) {
    const serverContent = payload.serverContent;
    if (!serverContent) return;

    // Handle incoming audio from model turn
    if (serverContent.modelTurn?.parts) {
      for (const part of serverContent.modelTurn.parts) {
        if (part.text) {
          messages.push({
            id: `ai-live-${Date.now()}`,
            role: 'guide',
            text: part.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
        if (part.inlineData && ttsEnabled && audioContext) {
          playPcm24kAudio(part.inlineData.data);
        }
      }
    }

    if (serverContent.interrupted) {
      // User started speaking; clear audio queue immediately
      if (audioContext && audioContext.state === 'running') {
        audioContext.suspend().then(() => audioContext?.resume());
      }
    }
  }

  function playPcm24kAudio(base64Data: string) {
    try {
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const pcm16 = new Int16Array(bytes.buffer);
      if (!audioContext) audioContext = new AudioContext({ sampleRate: 24000 });
      const buffer = audioContext.createBuffer(1, pcm16.length, 24000);
      const channel = buffer.getChannelData(0);
      for (let i = 0; i < pcm16.length; i++) {
        channel[i] = pcm16[i] / 32768.0;
      }
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (err) {
      console.error('Audio playback error:', err);
    }
  }

  async function initMicrophoneStream() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      audioContext = new AudioContext({ sampleRate: 16000 });
      const source = audioContext.createMediaStreamSource(micStream);
      audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);

      audioProcessor.onaudioprocess = (e) => {
        if (!liveSocket || liveSocket.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32 to 16-bit PCM Little Endian
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }
        const bytes = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Chunk = btoa(binary);

        liveSocket.send(
          JSON.stringify({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: 'audio/pcm;rate=16000',
                  data: base64Chunk
                }
              ]
            }
          })
        );
      };

      source.connect(audioProcessor);
      audioProcessor.connect(audioContext.destination);
      isListening = true;
    } catch (err) {
      console.error('Microphone capture error:', err);
      liveConnectionStatus = 'fallback';
      stopLiveAudio();
    }
  }

  function stopLiveAudio() {
    if (audioProcessor) {
      try {
        audioProcessor.disconnect();
      } catch {}
      audioProcessor = null;
    }
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      micStream = null;
    }
    if (liveSocket) {
      try {
        liveSocket.close();
      } catch {}
      liveSocket = null;
    }
    liveSessionActive = false;
    isListening = false;
  }

  function toggleSpeech() {
    if (liveModeAvailable && !liveSessionActive) {
      startLiveSession();
      return;
    }

    if (liveSessionActive) {
      stopLiveAudio();
      return;
    }

    // Fallback: Web Speech API
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
    utterance.rate = 0.95;
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

    // If live WebSocket is connected, send via realtime text input
    if (liveSocket && liveSocket.readyState === WebSocket.OPEN) {
      liveSocket.send(
        JSON.stringify({
          clientContent: {
            turns: [
              {
                role: 'user',
                parts: [{ text: userText }]
              }
            ],
            turnComplete: true
          }
        })
      );
      return;
    }

    // Otherwise use the authenticated Socratic mentor HTTP route
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
        <BrainCircuit class="size-4 text-ai" />
      </div>
      <div>
        <h3 class="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          Socratic Mentor
          {#if liveSessionActive}
            <span class="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-positive/10 border border-positive/30 text-positive rounded-sm inline-flex items-center gap-1">
              <Radio class="size-2.5 animate-pulse" />
              Live WebSocket Stream
            </span>
          {:else if liveModeAvailable}
            <span class="text-[10px] font-mono font-normal px-1.5 py-0.5 bg-surface border border-border text-foreground-secondary rounded-sm">
              Gemini Live Ready
            </span>
          {:else}
            <span class="text-[10px] font-mono font-normal px-1.5 py-0.5 bg-surface border border-border text-foreground-secondary rounded-sm">
              Socratic Engine • Local
            </span>
          {/if}
        </h3>
        <p class="text-xs text-foreground-secondary flex items-center gap-1.5">
          <ShieldCheck class="size-3 text-positive" />
          <span>DPDP Act Section 9 Protected • Psychometrics strictly decoupled</span>
        </p>
      </div>
    </div>

    <!-- Audio Controls -->
    <div class="flex items-center gap-2">
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

    {#if liveSessionActive}
      <div class="flex items-center gap-2 px-3 py-2 bg-surface-raised border border-positive/30 text-xs text-positive font-mono rounded-sm">
        <Activity class="size-3.5 animate-pulse text-positive" />
        <span>Live voice bidirectional stream active (Speak freely to the mentor)</span>
      </div>
    {/if}
  </div>

  <!-- 4. Scaffolding Thinking Moves -->
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
      onclick={toggleSpeech}
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
        <span class="hidden sm:inline text-[11px] text-foreground-secondary">
          {liveModeAvailable ? 'Live Voice' : 'Voice'}
        </span>
      {/if}
    </button>

    <input
      type="text"
      bind:value={inputText}
      onkeydown={(e) => e.key === 'Enter' && sendMessage()}
      placeholder={isListening ? 'Listening to your voice...' : 'Ask a question or explain your reasoning...'}
      class="flex-1 px-3 py-2 text-xs bg-surface-raised border border-border text-foreground placeholder:text-foreground-secondary rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-1 focus-visible:border-foreground transition-colors"
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
