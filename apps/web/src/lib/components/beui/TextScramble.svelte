<script lang="ts">
  import { onMount } from 'svelte';

  interface Props {
    text: string;
    glyphs?: string;
    duration?: number; // total duration in ms
    speed?: number; // interval tick in ms
    as?: string;
    class?: string;
  }

  let {
    text,
    glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789%#@*&',
    duration = 500,
    speed = 35,
    as = 'span',
    class: className = ''
  }: Props = $props();

  let displayedText = $state<string | null>(null);
  let isAnimating = $state(false);

  const currentDisplay = $derived(displayedText ?? text);

  function randomGlyph(): string {
    return glyphs[Math.floor(Math.random() * glyphs.length)] || '#';
  }

  $effect(() => {
    const target = text;
    if (typeof window === 'undefined') {
      displayedText = target;
      return;
    }

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayedText = target;
      return;
    }

    let frame = 0;
    const totalFrames = Math.max(1, Math.floor(duration / speed));
    const targetLength = target.length;
    isAnimating = true;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const settledCount = Math.floor(progress * targetLength);

      let result = '';
      for (let i = 0; i < targetLength; i++) {
        if (target[i] === ' ') {
          result += ' ';
        } else if (i < settledCount) {
          result += target[i];
        } else {
          result += randomGlyph();
        }
      }

      displayedText = result;

      if (frame >= totalFrames) {
        clearInterval(interval);
        displayedText = target;
        isAnimating = false;
      }
    }, speed);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<svelte:element
  this={as}
  class="inline-block font-mono {className}"
  aria-label={text}
>
  <span aria-hidden="true">{currentDisplay}</span>
</svelte:element>
