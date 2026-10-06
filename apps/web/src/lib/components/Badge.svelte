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
    neutral: 'bg-(--surface-content) border border-(--border-subtle) text-(--text-secondary)',
    primary: 'bg-(--accent-primary-subtle) text-(--accent-primary) border border-(--accent-primary)/20',
    indigo: 'bg-(--accent-indigo-subtle) text-(--accent-indigo) border border-(--accent-indigo)/20',
    teal: 'bg-(--accent-primary-subtle) text-(--accent-primary) border border-(--accent-primary)/20',
    success: 'bg-(--accent-success-subtle) text-(--accent-success) border border-(--accent-success)/20'
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
