<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { Mic, Play, Pause, X, ArrowUp } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  type Mode = 'idle' | 'recording' | 'review';
  type Face = 'mic' | 'stop' | 'play' | 'pause';

  const BAR_COUNT = 48;
  const BAR_IDS = Array.from({ length: BAR_COUNT + 1 }, (_, i) => `bar-${i}`);
  const BAR_PITCH = 5;
  const SAMPLE_MS = 70;
  const REST_LEVEL = 0.12;
  const STILL_LEVELS = BAR_IDS.map(
    (_, i) => 0.25 + 0.5 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21))
  );
  const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
  const EDGE_MASK = 'linear-gradient(to right, transparent, black 18%, black 92%, transparent)';

  export interface AIVoiceProps {
    class?: string;
    demo?: boolean;
    level?: number;
    onListeningChange?: (listening: boolean) => void;
    onStop?: (duration: number) => void;
    onSend?: (duration: number) => void;
    onDiscard?: () => void;
  }

  let {
    class: className = '',
    demo = true,
    level = undefined,
    onListeningChange,
    onStop,
    onSend,
    onDiscard
  }: AIVoiceProps = $props();

  let mode = $state<Mode>('idle');
  let isDemo = $state(false);
  let seconds = $state(0);
  let duration = $state(0);
  let playing = $state(false);
  let playhead = $state(0);
  let reduceMotion = $state(false);

  let rootEl = $state<HTMLDivElement | null>(null);
  let rowEl = $state<HTMLDivElement | null>(null);
  let ringEl = $state<HTMLSpanElement | null>(null);
  let playedEl = $state<HTMLDivElement | null>(null);

  const barEls: (HTMLSpanElement | null)[] = [];
  const playedBarEls: (HTMLSpanElement | null)[] = [];
  let takeSamples: number[] = [];
  let startedAt = 0;
  let timerInterval: ReturnType<typeof setInterval> | null = null;
  let playbackRaf = 0;
  let recordRaf = 0;
  let demoTimer: ReturnType<typeof setTimeout> | null = null;

  function createVoiceSimulator() {
    let speaking = false;
    let switchAt = 0;
    let gate = 0;
    return (time: number) => {
      if (time >= switchAt) {
        speaking = !speaking;
        switchAt = time + (speaking ? 700 + Math.random() * 1600 : 180 + Math.random() * 500);
      }
      gate += ((speaking ? 1 : 0) - gate) * 0.35;
      const t = time / 1000;
      const syllable = Math.abs(Math.sin(t * Math.PI * 4.4 + Math.sin(t * 1.7) * 2));
      const grain = 0.65 + Math.random() * 0.35;
      return REST_LEVEL + gate * syllable * grain * (1 - REST_LEVEL);
    };
  }

  function condense(take: number[]) {
    if (take.length === 0) {
      return STILL_LEVELS.slice(0, BAR_COUNT);
    }
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const from = Math.floor((i / BAR_COUNT) * take.length);
      const to = Math.max(from + 1, Math.floor(((i + 1) / BAR_COUNT) * take.length));
      return Math.max(REST_LEVEL, ...take.slice(from, to));
    });
  }

  function formatTime(secs: number) {
    const whole = Math.floor(secs);
    const mins = Math.floor(whole / 60);
    const s = whole % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function setScales(bars: (HTMLSpanElement | null)[], levels: readonly number[]) {
    for (let i = 0; i < bars.length; i++) {
      const bar = bars[i];
      if (bar) {
        bar.style.transform = `scaleY(${(levels[i] ?? REST_LEVEL).toFixed(3)})`;
      }
    }
  }

  function startRecording(notify = true) {
    playing = false;
    mode = 'recording';
    if (notify) {
      onListeningChange?.(true);
    }
  }

  function stopRecording(notify = true) {
    const taken = Math.max(
      (Date.now() - startedAt) / 1000,
      takeSamples.length * (SAMPLE_MS / 1000)
    );
    duration = taken;
    playhead = 0;
    if (playedEl) {
      playedEl.style.clipPath = 'inset(0 100% 0 0)';
    }
    mode = 'review';
    if (notify) {
      onListeningChange?.(false);
      onStop?.(taken);
    }
  }

  function finish(sent: boolean, notify = true) {
    playing = false;
    mode = 'idle';
    if (!notify) return;
    if (sent) {
      onSend?.(duration);
    } else {
      onDiscard?.();
    }
  }

  function togglePlay() {
    if (!playing && playedEl) {
      playedEl.style.clipPath = 'inset(0 100% 0 0)';
    }
    playing = !playing;
  }

  function endDemo() {
    if (isDemo) {
      isDemo = false;
      playing = false;
      mode = 'idle';
      if (demoTimer) clearTimeout(demoTimer);
    }
  }

  function handleMainClick() {
    if (isDemo) {
      endDemo();
      startRecording();
    } else if (mode === 'recording') {
      stopRecording();
    } else if (mode === 'review') {
      togglePlay();
    } else {
      startRecording();
    }
  }

  // Waveform recording tick loop
  $effect(() => {
    if (mode !== 'recording' || !rowEl || !ringEl || !rootEl) {
      if (recordRaf) cancelAnimationFrame(recordRaf);
      if (ringEl) {
        ringEl.style.transform = 'scale(1)';
        ringEl.style.opacity = '0';
      }
      return;
    }

    takeSamples = [];
    if (reduceMotion) {
      setScales(barEls, STILL_LEVELS);
      takeSamples = STILL_LEVELS.slice();
      return;
    }

    const simulate = createVoiceSimulator();
    const samples = BAR_IDS.map(() => REST_LEVEL);
    let phase = 0;
    let smooth = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 100);
      last = now;
      phase += dt / SAMPLE_MS;

      while (phase >= 1) {
        phase -= 1;
        const live = level;
        const sample = live === undefined ? simulate(now) : Math.max(REST_LEVEL, Math.min(1, live));
        samples.shift();
        samples.push(sample);
        takeSamples.push(sample);
      }

      if (rowEl) {
        rowEl.style.transform = `translateX(${(-phase * BAR_PITCH).toFixed(2)}px)`;
      }
      setScales(barEls, samples);

      const latest = samples.at(-1) ?? REST_LEVEL;
      smooth += (latest - smooth) * 0.18;
      const lift = Math.max(0, smooth - REST_LEVEL);
      if (ringEl) {
        ringEl.style.transform = `scale(${(1 + lift * 0.22).toFixed(3)})`;
        ringEl.style.opacity = (0.4 + lift * 0.8).toFixed(3);
      }

      recordRaf = requestAnimationFrame(tick);
    };

    recordRaf = requestAnimationFrame(tick);
    return () => {
      if (recordRaf) cancelAnimationFrame(recordRaf);
      if (ringEl) {
        ringEl.style.transform = 'scale(1)';
        ringEl.style.opacity = '0';
      }
    };
  });

  // Review mode settled waveform scaling
  $effect(() => {
    if (mode === 'recording' || !rowEl) return;
    rowEl.style.transform = 'translateX(0px)';
    const levels = mode === 'review' ? condense(takeSamples) : BAR_IDS.map(() => REST_LEVEL);
    setScales(barEls, levels);
    setScales(playedBarEls, levels);
  });

  // Recording elapsed timer
  $effect(() => {
    if (mode !== 'recording') {
      if (timerInterval) clearInterval(timerInterval);
      return;
    }
    seconds = 0;
    startedAt = Date.now();
    timerInterval = setInterval(() => {
      seconds = Math.floor((Date.now() - startedAt) / 1000);
    }, 250);
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  });

  // Playback playhead sweep effect
  $effect(() => {
    if (!playing || !playedEl) {
      if (playbackRaf) cancelAnimationFrame(playbackRaf);
      return;
    }
    const len = Math.max(duration, 1) * 1000;
    const playbackStart = performance.now();
    let shownSec = -1;

    const tick = (now: number) => {
      const progress = Math.min((now - playbackStart) / len, 1);
      if (playedEl) {
        playedEl.style.clipPath = `inset(0 ${((1 - progress) * 100).toFixed(2)}% 0 0)`;
      }
      const pos = progress * Math.max(duration, 1);
      if (Math.floor(pos) !== shownSec || progress >= 1) {
        shownSec = Math.floor(pos);
        playhead = Math.max(pos, Number.EPSILON);
      }
      if (progress < 1) {
        playbackRaf = requestAnimationFrame(tick);
      } else {
        playing = false;
      }
    };

    playbackRaf = requestAnimationFrame(tick);
    return () => {
      if (playbackRaf) cancelAnimationFrame(playbackRaf);
    };
  });

  // Autonomous demo loop
  $effect(() => {
    if (!isDemo || playing) {
      if (demoTimer) clearTimeout(demoTimer);
      return;
    }
    const hasPlayed = playhead > 0;
    const delays: Record<Mode, number> = {
      idle: 1200,
      recording: 3400,
      review: hasPlayed ? 900 : 600
    };

    demoTimer = setTimeout(() => {
      if (!isDemo) return;
      if (mode === 'idle') {
        startRecording(false);
      } else if (mode === 'recording') {
        stopRecording(false);
      } else if (hasPlayed) {
        finish(true, false);
      } else {
        togglePlay();
      }
    }, delays[mode]);

    return () => {
      if (demoTimer) clearTimeout(demoTimer);
    };
  });

  onMount(() => {
    isDemo = demo;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotion = motion.matches;
    const handleMotion = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
    };
    motion.addEventListener('change', handleMotion);
    return () => {
      motion.removeEventListener('change', handleMotion);
      if (demoTimer) clearTimeout(demoTimer);
      if (timerInterval) clearInterval(timerInterval);
      if (recordRaf) cancelAnimationFrame(recordRaf);
      if (playbackRaf) cancelAnimationFrame(playbackRaf);
    };
  });

  const mainLabel = $derived.by(() => {
    if (mode === 'recording') return 'Stop recording';
    if (mode === 'review') return playing ? 'Pause playback' : 'Play recording';
    return 'Start recording';
  });

  const timerDisplay = $derived.by(() => {
    if (mode === 'review') {
      return formatTime(playing || playhead > 0 ? playhead : duration);
    }
    return formatTime(mode === 'recording' ? seconds : 0);
  });

  const announce = $derived(!isDemo);
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={rootEl}
  onpointerdowncapture={endDemo}
  class={cn(
    'w-full select-none rounded-none border border-border bg-surface-subtle py-4 px-4 text-ink transition-colors duration-200',
    className
  )}
>
  <div class="relative mx-auto flex w-full max-w-sm flex-col items-center gap-3">
    <!-- Main Interactive Trigger Button with Wave Ring -->
    <div class="relative">
      <span
        bind:this={ringEl}
        aria-hidden="true"
        class="pointer-events-none absolute -inset-1 rounded-sm bg-brand/15 opacity-0 transition-transform duration-150"
      ></span>

      <button
        type="button"
        aria-label={mainLabel}
        aria-pressed={mode === 'recording' && announce}
        onclick={handleMainClick}
        class={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-sm transition-colors duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer',
          mode === 'idle'
            ? 'bg-surface-raised border border-border hover:border-brand/40 text-ink'
            : mode === 'recording'
              ? 'bg-critical text-white shadow-xs'
              : 'bg-brand text-brand-foreground hover:bg-brand-hover shadow-xs'
        )}
      >
        {#if mode === 'idle'}
          <Mic class="size-6 transition-transform duration-150 group-hover:scale-105" />
        {:else if mode === 'recording'}
          <span class="size-4 rounded-none bg-white"></span>
        {:else if playing}
          <Pause class="size-5 fill-current" />
        {:else}
          <Play class="size-5 fill-current ml-0.5" />
        {/if}
      </button>
    </div>

    <!-- Timer readout with recording LED dot -->
    <span
      class={cn(
        'relative font-mono text-xs tabular-nums tracking-wider transition-colors duration-200',
        mode === 'idle' ? 'text-ink-muted' : 'text-ink font-medium'
      )}
    >
      <span
        aria-hidden="true"
        class={cn(
          'absolute top-1/2 right-full mr-2 size-1.5 -translate-y-1/2 rounded-none bg-critical transition-opacity duration-150',
          mode === 'recording' ? 'opacity-100 animate-pulse' : 'opacity-0'
        )}
      ></span>
      {timerDisplay}
    </span>

    <!-- Waveform Scrolling Canvas Container -->
    <div
      aria-hidden="true"
      class="relative h-8 w-60 overflow-hidden"
      style="mask-image: {mode === 'recording' ? EDGE_MASK : 'none'};"
    >
      <div bind:this={rowEl} class="flex h-full items-center gap-0.5">
        {#each BAR_IDS as id, i}
          <span
            bind:this={barEls[i]}
            class={cn(
              'h-full w-0.75 shrink-0 rounded-none',
              mode === 'recording'
                ? 'bg-brand'
                : 'bg-ink/20 transition-transform duration-200 motion-reduce:transition-none'
            )}
            style="transform: scaleY({REST_LEVEL}); transition-delay: {mode === 'recording' ? '0ms' : `${(BAR_COUNT - i) * 4}ms`}; transition-timing-function: {EASE_OUT};"
          ></span>
        {/each}
      </div>

      <!-- Playback clip-path overlay -->
      <div
        bind:this={playedEl}
        class={cn(
          'absolute inset-0 flex items-center gap-0.5 transition-opacity duration-200',
          mode === 'review' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style="clip-path: inset(0 100% 0 0);"
      >
        {#each BAR_IDS as id, i}
          <span
            bind:this={playedBarEls[i]}
            class="h-full w-0.75 shrink-0 rounded-none bg-brand"
            style="transform: scaleY({REST_LEVEL});"
          ></span>
        {/each}
      </div>
    </div>

    <!-- Mode actions / status message -->
    <div class="relative flex h-9 items-center justify-center">
      {#if mode === 'review'}
        <div in:fly={{ y: 4, duration: 200 }} out:fade={{ duration: 140 }} class="flex items-center gap-2">
          <button
            type="button"
            onclick={() => finish(false)}
            class="flex h-8 items-center gap-1 rounded-sm border border-border bg-surface-raised px-3 text-xs font-medium text-ink-secondary transition-colors duration-150 hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          >
            <X class="size-3.5" />
            Discard
          </button>
          <button
            type="button"
            onclick={() => finish(true)}
            class="flex h-8 items-center gap-1 rounded-sm bg-brand px-3 text-xs font-medium text-brand-foreground transition-colors duration-150 hover:bg-brand-hover outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          >
            Send
            <ArrowUp class="size-3.5" />
          </button>
        </div>
      {:else}
        <span in:fade={{ duration: 150 }} class="text-xs text-ink-secondary">
          {mode === 'recording' ? 'Listening to learner reasoning...' : 'Click mic to sample Socratic voice inquiry'}
        </span>
      {/if}
    </div>

    <output aria-live={announce ? 'polite' : 'off'} class="sr-only">
      {announce && mode === 'recording' ? 'Recording inquiry session' : ''}
      {announce && mode === 'review' ? 'Inquiry recording ready to review and send' : ''}
    </output>
  </div>
</div>
