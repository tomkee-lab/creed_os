<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    direction?: 'left' | 'right' | 'up' | 'down';
    speed?: number; // duration in seconds
    pauseOnHover?: boolean;
    gap?: string;
    fade?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    direction = 'left',
    speed = 24,
    pauseOnHover = true,
    gap = '1.5rem',
    fade = true,
    class: className = '',
    children
  }: Props = $props();

  const isVertical = $derived(direction === 'up' || direction === 'down');
  const isReverse = $derived(direction === 'right' || direction === 'down');
</script>

<div
  class="group relative flex overflow-hidden {isVertical ? 'flex-col' : 'flex-row'} {className}"
  class:mask-fade-horizontal={fade && !isVertical}
  class:mask-fade-vertical={fade && isVertical}
  style="--marquee-gap: {gap}; --marquee-duration: {speed}s; gap: {gap};"
>
  <!-- Primary animated track -->
  <div
    class="flex shrink-0 items-center {isVertical ? 'flex-col animate-marquee-v' : 'flex-row animate-marquee-h'} {pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}"
    style="animation-direction: {isReverse ? 'reverse' : 'normal'}; gap: {gap};"
  >
    {@render children?.()}
  </div>

  <!-- Duplicate seamless track (inert and hidden from screen readers) -->
  <div
    aria-hidden="true"
    inert
    class="flex shrink-0 items-center {isVertical ? 'flex-col animate-marquee-v' : 'flex-row animate-marquee-h'} {pauseOnHover ? 'group-hover:[animation-play-state:paused]' : ''}"
    style="animation-direction: {isReverse ? 'reverse' : 'normal'}; gap: {gap};"
  >
    {@render children?.()}
  </div>
</div>

<style>
  @keyframes marquee-h {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--marquee-gap, 1.5rem)));
    }
  }

  @keyframes marquee-v {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--marquee-gap, 1.5rem)));
    }
  }

  .animate-marquee-h {
    animation: marquee-h var(--marquee-duration, 24s) linear infinite;
    will-change: transform;
  }

  .animate-marquee-v {
    animation: marquee-v var(--marquee-duration, 24s) linear infinite;
    will-change: transform;
  }

  .mask-fade-horizontal {
    mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
  }

  .mask-fade-vertical {
    mask-image: linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-marquee-h,
    .animate-marquee-v {
      animation: none !important;
      transform: none !important;
    }
  }
</style>
