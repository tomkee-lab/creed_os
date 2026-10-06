<script lang="ts">
  import { ArrowRight, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-svelte';

  interface Props {
    signal: string;
    signalVariant?: 'alert' | 'growth' | 'neutral' | 'primary';
    title: string;
    context: string;
    actionLabel: string;
    actionHref?: string;
    actionOnClick?: () => void;
    evidenceBadge?: string;
    disclosureTitle?: string;
    disclosureBody?: string;
    class?: string;
  }

  let {
    signal,
    signalVariant = 'alert',
    title,
    context,
    actionLabel,
    actionHref,
    actionOnClick,
    evidenceBadge = 'Verified Demonstration',
    disclosureTitle,
    disclosureBody,
    class: className = ''
  }: Props = $props();

  let showDisclosure = $state(false);

  const signalColors = {
    alert: 'border-l-(--accent-warning) text-(--accent-warning) bg-(--accent-warning-subtle)',
    growth: 'border-l-(--accent-success) text-(--accent-success) bg-(--accent-success-subtle)',
    neutral: 'border-l-(--text-muted) text-(--text-secondary) bg-(--surface-sunken)',
    primary: 'border-l-(--accent-primary) text-(--accent-primary) bg-(--accent-primary-subtle)'
  };
</script>

<div
  class="surface-card rounded-sm p-6 sm:p-8 border-l-4 border border-(--border-subtle) space-y-5 transition-all {signalColors[signalVariant].split(' ')[0]} {className}"
>
  <!-- Level 1: Signal & Context Header -->
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-2">
      <span
        class="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm border border-(--border-subtle) {signalColors[signalVariant].split(' ').slice(1).join(' ')}"
      >
        {signal}
      </span>
      <span class="text-[11px] text-(--text-muted) font-medium flex items-center gap-1">
        <ShieldCheck class="w-3.5 h-3.5 text-(--accent-success)" />
        {evidenceBadge}
      </span>
    </div>

    <h3 class="text-xl sm:text-2xl font-bold tracking-tight text-(--text-primary) leading-snug">
      {title}
    </h3>

    <!-- Level 2: Context (1 sentence) -->
    <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
      {context}
    </p>
  </div>

  <!-- Level 3: Action Button (Dominant visual signal) -->
  <div class="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-(--border-subtle)">
    {#if disclosureTitle && disclosureBody}
      <button
        type="button"
        onclick={() => (showDisclosure = !showDisclosure)}
        class="text-xs font-medium text-(--text-muted) hover:text-(--text-primary) inline-flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
      >
        <span>{disclosureTitle}</span>
        {#if showDisclosure}
          <ChevronUp class="w-3.5 h-3.5" />
        {:else}
          <ChevronDown class="w-3.5 h-3.5" />
        {/if}
      </button>
    {:else}
      <div></div>
    {/if}

    {#if actionHref}
      <a
        href={actionHref}
        class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ArrowRight class="w-4 h-4" />
      </a>
    {:else if actionOnClick}
      <button
        type="button"
        onclick={actionOnClick}
        class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    {/if}
  </div>

  <!-- Level 3 Disclosure: Provenance / Diagnostic Rubric -->
  {#if showDisclosure && disclosureBody}
    <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-xs text-(--text-secondary) leading-relaxed animate-in fade-in duration-200">
      {disclosureBody}
    </div>
  {/if}
</div>
