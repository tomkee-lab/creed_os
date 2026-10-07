<script lang="ts">
  import type { Snippet } from 'svelte';
  import { ChevronRight } from 'lucide-svelte';

  interface Props {
    eyebrow?: string;
    title: string;
    subtitle?: string;
    actionHref?: string;
    actionLabel?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    eyebrow,
    title,
    subtitle,
    actionHref,
    actionLabel,
    class: className = '',
    children
  }: Props = $props();
</script>

<section class="space-y-4 {className}">
  <!-- Section Header: Signal & Context -->
  <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border pb-3">
    <div class="space-y-0.5">
      {#if eyebrow}
        <span class="text-[11px] font-semibold uppercase tracking-wider text-brand block">
          {eyebrow}
        </span>
      {/if}
      <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-ink">
        {title}
      </h2>
      {#if subtitle}
        <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          {subtitle}
        </p>
      {/if}
    </div>

    {#if actionHref && actionLabel}
      <a
        href={actionHref}
        class="text-xs font-semibold text-brand hover:underline inline-flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </a>
    {/if}
  </div>

  <!-- Content Slot -->
  {#if children}
    <div class="pt-1">
      {@render children()}
    </div>
  {/if}
</section>
