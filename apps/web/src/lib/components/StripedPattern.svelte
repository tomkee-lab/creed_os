<script module lang="ts">
  let globalId = 0;
</script>

<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';

  interface Props extends SVGAttributes<SVGSVGElement> {
    direction?: 'left' | 'right';
    width?: number;
    height?: number;
    strokeWidth?: number;
    class?: string;
  }

  let {
    direction = 'left',
    width = 20,
    height = 20,
    strokeWidth = 1,
    class: className = '',
    ...restProps
  }: Props = $props();

  const id = `striped-pattern-${++globalId}`;
  const w = $derived(Number(width));
  const h = $derived(Number(height));
</script>

<svg
  aria-hidden="true"
  class="pointer-events-none absolute inset-0 z-0 h-full w-full stroke-1 text-foreground/12 dark:text-foreground/20 {className}"
  xmlns="http://www.w3.org/2000/svg"
  {...restProps}
>
  <defs>
    <pattern {id} width={w} height={h} patternUnits="userSpaceOnUse" overflow="visible">
      {#if direction === 'left'}
        <line x1="0" y1={h} x2={w} y2="0" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="square" />
        <line x1={-w} y1={h} x2="0" y2="0" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="square" />
        <line x1={w} y1={h} x2={w * 2} y2="0" stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="square" />
      {:else}
        <line x1="0" y1="0" x2={w} y2={h} stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="square" />
        <line x1={-w} y1="0" x2="0" y2={h} stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="square" />
        <line x1={w} y1="0" x2={w * 2} y2={h} stroke="currentColor" stroke-width={strokeWidth} stroke-linecap="square" />
      {/if}
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#{id})" />
</svg>
