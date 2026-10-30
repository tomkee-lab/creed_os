<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils';

  // Ported from Kokonut UI TypewriterTitle v1.1.0 (React/motion/react)
  // by @dorianbaffier · MIT · https://kokonutui.com
  // Svelte 5 adaptation for CREED OS WAY 2.1 — no React, no Framer Motion.
  // Reduced-motion, IntersectionObserver, seeded PRNG, typos, select-delete.

  interface TypewriterSequence {
    text: string;
    deleteAfter?: boolean;
    pauseAfter?: number;
  }

  interface Props {
    /** Static first line rendered as plain text above the typewriter. */
    staticLine?: string;
    sequences?: TypewriterSequence[];
    typingSpeed?: number;
    startDelay?: number;
    autoLoop?: boolean;
    loopDelay?: number;
    deleteSpeed?: number;
    pauseBeforeDelete?: number;
    naturalVariance?: boolean;
    /**
     * How a phrase is erased. `"backspace"` removes it one character at a
     * time; `"select"` highlights right-to-left then cuts in one go.
     */
    deleteMode?: 'backspace' | 'select';
    /**
     * Hit a neighbouring key now and then, pause, backspace, and correct it.
     * `true` is about a 4% chance per letter; a number sets the chance.
     */
    typos?: boolean | number;
    /** Seed for variance and typos so every visit types the same way. */
    seed?: number;
    /** Stops the typing where it is (WCAG 2.2.2 pause control). */
    paused?: boolean;
    class?: string;
    textClass?: string;
  }

  const DEFAULT_SEQUENCES: TypewriterSequence[] = [
    { text: 'Backed by real evidence.', deleteAfter: true },
    { text: 'Not a single test score.', deleteAfter: true },
    { text: 'Built for Classes 3 to 12.' }
  ];

  let {
    staticLine = 'Room to grow.',
    sequences = DEFAULT_SEQUENCES,
    typingSpeed = 48,
    startDelay = 320,
    autoLoop = true,
    loopDelay = 1200,
    deleteSpeed = 28,
    pauseBeforeDelete = 1100,
    naturalVariance = true,
    deleteMode = 'backspace',
    typos = false,
    seed = 7,
    paused = false,
    class: className,
    textClass
  }: Props = $props();

  // Constants (mirror Kokonut UI source exactly)
  const NEXT_SEQUENCE_DELAY = 100;
  const CARET_IDLE_MS = 500;
  const TYPO_NOTICE_MS = 250;
  const DEFAULT_TYPO_RATE = 0.04;
  const SELECT_SWEEP_MS = 120;
  const SELECT_HOLD_MS = 220;

  // QWERTY neighbour map
  const KEY_ROWS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

  function neighbours(char: string): string {
    const lower = char.toLowerCase();
    const row = KEY_ROWS.findIndex((r) => r.includes(lower));
    if (row === -1) return '';
    const col = KEY_ROWS[row].indexOf(lower);
    const around = [
      KEY_ROWS[row][col - 1],
      KEY_ROWS[row][col + 1],
      KEY_ROWS[row - 1]?.[col],
      KEY_ROWS[row + 1]?.[col]
    ]
      .filter(Boolean)
      .join('');
    return char === lower ? around : around.toUpperCase();
  }

  // Seeded PRNG (Park-Miller)
  function createRandom(s: number) {
    let state = (Math.abs(Math.floor(s)) % 2_147_483_646) + 1;
    return () => {
      state = (state * 16_807) % 2_147_483_647;
      return (state - 1) / 2_147_483_646;
    };
  }

  function getTypingDelay(speed: number, variance: boolean, rand: () => number): number {
    if (!variance) return speed;
    const roll = rand();
    if (roll < 0.1) return speed * 2;
    if (roll > 0.9) return speed * 0.5;
    return speed * (0.6 + rand() * 0.8);
  }

  // Screen state: visible text + how many trailing chars are "selected"
  interface Screen {
    text: string;
    selected: number;
  }

  // Svelte 5 reactive state
  let screen = $state<Screen>({ text: '', selected: 0 });
  let caretEl = $state<HTMLSpanElement | null>(null);
  let wrapperEl = $state<HTMLSpanElement | null>(null);

  // IntersectionObserver — mirrors Kokonut UI `useInView`
  let isInView = $state(false);
  // prefers-reduced-motion — mirrors `useReducedMotion`
  let reducedMotion = $state(false);

  // Typing engine position — kept in a plain object (not reactive) to avoid
  // triggering Svelte tracking inside the async loop.
  const position = { sequence: 0, char: 0, deleting: false };

  // Reduced-motion: show the final phrase statically, skip the loop.
  $effect(() => {
    if (reducedMotion) {
      const last = sequences.at(-1)?.text ?? '';
      screen = { text: last, selected: 0 };
    }
  });

  // Stopped sentinel — replaces the class-based Error approach
  class Stopped extends Error {}

  // Core typing engine — direct port of Kokonut UI's async run() loop
  $effect(() => {
    if (reducedMotion) return;
    if (paused || !isInView) return;

    const random = createRandom(seed);
    const seqs = sequences; // capture snapshot for this run
    const typoRate =
      typeof typos === 'number' ? typos : typos ? DEFAULT_TYPO_RATE : 0;

    const timers = new Set<ReturnType<typeof setTimeout>>();
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        if (stopped) { reject(new Stopped()); return; }
        const t = setTimeout(() => {
          timers.delete(t);
          if (stopped) reject(new Stopped());
          else resolve();
        }, ms);
        timers.add(t);
      });

    const keystroke = () => {
      if (!caretEl) return;
      caretEl.dataset.idle = 'false';
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (caretEl) caretEl.dataset.idle = 'true';
      }, CARET_IDLE_MS);
    };

    const show = (text: string, selected = 0) => {
      screen = { text, selected };
    };

    const typeChar = async (text: string) => {
      const wrongKeys = neighbours(text[position.char]);
      if (wrongKeys && random() < typoRate) {
        const wrong = wrongKeys[Math.floor(random() * wrongKeys.length)];
        show(text.slice(0, position.char) + wrong);
        keystroke();
        await wait(TYPO_NOTICE_MS + typingSpeed);
        show(text.slice(0, position.char));
        keystroke();
        await wait(typingSpeed * 1.5);
      }
      position.char += 1;
      show(text.slice(0, position.char));
      keystroke();
      await wait(getTypingDelay(typingSpeed, naturalVariance, random));
    };

    const erase = async (text: string) => {
      if (deleteMode === 'select') {
        const len = position.char;
        const step = SELECT_SWEEP_MS / Math.max(len, 1);
        for (let sel = 1; sel <= len; sel++) {
          show(text.slice(0, len), sel);
          keystroke();
          await wait(step);
        }
        await wait(SELECT_HOLD_MS);
        position.char = 0;
        show('');
        keystroke();
        return;
      }
      while (position.char > 0) {
        position.char -= 1;
        show(text.slice(0, position.char));
        keystroke();
        await wait(deleteSpeed);
      }
    };

    const advance = async (delay: number): Promise<boolean> => {
      const isLast = position.sequence >= seqs.length - 1;
      if (isLast && !autoLoop) return false;
      position.sequence = isLast ? 0 : position.sequence + 1;
      position.char = 0;
      position.deleting = false;
      await wait(isLast ? loopDelay : delay);
      show('');
      return true;
    };

    const phrase = async (): Promise<boolean> => {
      if (position.sequence >= seqs.length) {
        position.sequence = 0;
        position.char = 0;
        position.deleting = false;
      }
      const seq = seqs[position.sequence];
      if (!seq) return false;
      const { text } = seq;
      position.char = Math.min(position.char, text.length);
      show(text.slice(0, position.char));

      if (!position.deleting) {
        while (position.char < text.length) await typeChar(text);
        const pause = seq.pauseAfter ?? pauseBeforeDelete;
        const isLast = position.sequence === seqs.length - 1;
        if (!(seq.deleteAfter || (isLast && autoLoop))) return advance(pause);
        await wait(pause);
        position.deleting = true;
      }
      await erase(text);
      return advance(NEXT_SEQUENCE_DELAY);
    };

    const run = async () => {
      try {
        await wait(startDelay);
        while (await phrase()) { /* next phrase */ }
      } catch (err) {
        if (!(err instanceof Stopped)) throw err;
      }
    };

    run();

    return () => {
      stopped = true;
      for (const t of timers) clearTimeout(t);
      clearTimeout(idleTimer);
      if (caretEl) caretEl.dataset.idle = 'true';
    };
  });

  // Lifecycle: IntersectionObserver + prefers-reduced-motion
  onMount(() => {
    // prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => { reducedMotion = e.matches; };
    mq.addEventListener('change', onMqChange);

    // IntersectionObserver
    let io: IntersectionObserver | undefined;
    if (wrapperEl) {
      io = new IntersectionObserver(
        (entries) => { isInView = entries[0]?.isIntersecting ?? false; },
        { threshold: 0.1 }
      );
      io.observe(wrapperEl);
    }

    return () => {
      mq.removeEventListener('change', onMqChange);
      io?.disconnect();
    };
  });

  // Derived: split the screen text into kept + selected portions
  const kept = $derived(screen.text.slice(0, screen.text.length - screen.selected));
  const selectedText = $derived(screen.text.slice(kept.length));
</script>

<!--
  WAY 2.1: font-heading, semantic token colors, no arbitrary radii.
  The wrapper uses role="heading" + aria-level so it degrades cleanly
  regardless of which element the parent uses.
-->
<span
  bind:this={wrapperEl}
  class={cn('block', className)}
>
  <!-- Screen-reader version: speak every phrase once, not the partial string -->
  <span class="sr-only">
    {staticLine}
    {sequences.map((s) => s.text).join(', ')}
  </span>

  <!--
    Two-line hero heading.
    Line 1: static, always fully visible.
    Line 2: typewriter loop.
    Both share the same heading class hierarchy for rhythm (WAY 2.1 Signal-first).
  -->
  <span aria-hidden="true" class={cn('flex flex-col items-center gap-0', textClass)}>
    <!-- Static line -->
    <span class="text-ink">
      {staticLine}
    </span>

    <!-- Typewriter line — inline-grid keeps width stable (widest ghost phrase); overflow-hidden prevents mobile bleed -->
    <span
      class="relative mt-1 inline-grid max-w-full justify-items-start overflow-hidden whitespace-normal sm:whitespace-pre"
    >
      <!-- Ghost phrases fix the column width without affecting layout flow -->
      {#each sequences as seq}
        <span class="invisible col-start-1 row-start-1 select-none" aria-hidden="true">
          {seq.text}
        </span>
      {/each}

      <!-- Live text + caret -->
      <span class="col-start-1 row-start-1 text-brand">
        {kept}<span
          class="relative inline-block w-0"
        ><span
            bind:this={caretEl}
            data-idle="true"
            class="caret absolute bottom-[-0.1em] left-[0.04em] h-[1.05em] w-[0.08em] min-w-[2px] bg-brand"
          ></span></span>{#if selectedText}<span
            class="rounded-none bg-brand/15">{selectedText}</span
          >{/if}
      </span>
    </span>
  </span>
</span>

<style>
  /*
    Caret blink: solid while typing (data-idle=false), blinks once idle.
    Runs off the main thread via CSS animation. Mirror of Kokonut UI CARET_KEYFRAMES.
    WAY 2.1 Lagom Motion Contract: the blink itself is not an interactive animation
    so the 280ms cap does not apply; it follows the text-cursor convention (1s).
  */
  @keyframes creed-caret-blink {
    0%,
    33.333% {
      opacity: 1;
    }
    66.667%,
    100% {
      opacity: 0;
    }
  }

  .caret {
    animation: none;
    opacity: 1;
  }

  .caret[data-idle='true'] {
    animation: creed-caret-blink 1s linear infinite;
  }
</style>
