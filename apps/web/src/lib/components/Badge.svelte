<script lang="ts">
  import type { Snippet } from 'svelte';

  type BadgeVariant = 'growth' | 'focus' | 'alert' | 'neutral' | 'primary' | 'indigo' | 'teal' | 'success';
  type BadgeSize = 'sm' | 'md';

  interface Props {
    variant?: BadgeVariant;
    size?: BadgeSize;
    class?: string;
    children?: Snippet;
  }

  let {
    variant = 'neutral',
    size = 'sm',
    class: className = '',
    children
  }: Props = $props();

  const baseClasses = 'inline-flex items-center font-medium rounded-sm select-none';

  const sizeClasses: Record<BadgeSize, string> = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5'
  };

  const variantClasses: Record<BadgeVariant, string> = {
    growth: 'badge-growth',
    focus: 'badge-focus',
    alert: 'badge-alert',
    neutral: 'bg-surface border border-border text-ink-secondary',
    primary: 'bg-brand-subtle text-brand border border-brand/20',
    indigo: 'bg-ai-subtle text-ai border border-ai/20',
    teal: 'bg-brand-subtle text-brand border border-brand/20',
    success: 'bg-positive-subtle text-positive border border-positive/20'
  };

  const computedClass = $derived(
    `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  );
</script>

<span class={computedClass}>
  {#if children}
    {@render children()}
  {/if}
</span>
