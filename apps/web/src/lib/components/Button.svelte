<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Loader2 } from 'lucide-svelte';

  type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  type ButtonSize = 'sm' | 'md' | 'lg';

  interface Props {
    variant?: ButtonVariant;
    size?: ButtonSize;
    type?: 'button' | 'submit' | 'reset';
    href?: string;
    disabled?: boolean;
    loading?: boolean;
    class?: string;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    type = 'button',
    href,
    disabled = false,
    loading = false,
    class: className = '',
    onclick,
    children
  }: Props = $props();

  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-140 rounded-sm select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:ring-offset-2 disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[32px]',
    md: 'text-xs sm:text-sm px-4 py-2 gap-2 min-h-[40px]',
    lg: 'text-sm sm:text-base px-6 py-3 gap-2 min-h-[48px]'
  };

  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      'bg-(--accent-indigo) text-white hover:bg-(--accent-indigo)/90 shadow-sm active:bg-(--accent-indigo)/80 font-semibold',
    secondary:
      'surface-card text-(--text-primary) hover:bg-(--surface-content) active:bg-(--surface-sunken)',
    outline:
      'border border-(--border-subtle) text-(--text-primary) hover:border-(--border-strong) hover:bg-(--surface-content)/50',
    ghost:
      'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-content)',
    danger:
      'bg-(--accent-danger) text-white hover:opacity-95 shadow-sm'
  };

  const computedClass = $derived(
    `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  );
</script>

{#if href}
  <a
    {href}
    class={computedClass}
    aria-disabled={disabled || loading}
  >
    {#if loading}
      <Loader2 class="w-3.5 h-3.5 animate-spin" />
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </a>
{:else}
  <button
    {type}
    {disabled}
    class={computedClass}
    {onclick}
  >
    {#if loading}
      <Loader2 class="w-3.5 h-3.5 animate-spin mr-1.5" />
    {/if}
    {#if children}
      {@render children()}
    {/if}
  </button>
{/if}
