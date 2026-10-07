<script lang="ts">
  import type { Snippet } from 'svelte';

  type CardVariant = 'raised' | 'elevated' | 'sunken' | 'canvas' | 'content';
  type CardPadding = 'none' | 'sm' | 'md' | 'lg';

  interface Props {
    variant?: CardVariant;
    padding?: CardPadding;
    interactive?: boolean;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'raised',
    padding = 'md',
    interactive = false,
    class: className = '',
    children
  }: Props = $props();

  const variantClasses: Record<CardVariant, string> = {
    raised: 'bg-surface-raised border border-border shadow-xs',
    elevated: 'bg-surface-raised border border-border shadow-md',
    sunken: 'bg-surface-subtle border border-border',
    canvas: 'bg-canvas',
    content: 'bg-surface border border-border'
  };

  const paddingClasses: Record<CardPadding, string> = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const interactiveClass = $derived(
    interactive
      ? 'transition-all duration-200 hover:border-border-strong hover:shadow-sm cursor-pointer'
      : ''
  );

  const computedClass = $derived(
    `rounded-sm ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClass} ${className}`
  );
</script>

<div class={computedClass}>
  {#if children}
    {@render children()}
  {/if}
</div>
