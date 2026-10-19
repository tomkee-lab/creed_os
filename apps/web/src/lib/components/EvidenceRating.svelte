<script lang="ts">
  interface Props {
    rating: number; // e.g. 4
    max?: number;   // default 5
    label?: string;
    class?: string;
    compact?: boolean;
  }

  let {
    rating,
    max = 5,
    label,
    class: className = '',
    compact = false
  }: Props = $props();

  const bars = $derived(
    Array.from({ length: max }, (_, i) => ({
      index: i + 1,
      filled: i + 1 <= rating
    }))
  );
</script>

<div class="inline-flex items-center gap-2 text-xs font-mono whitespace-nowrap {className}">
  <!-- Segmented Angular Rating Bars (Strict 0px Sharp) -->
  <div class="inline-flex items-center gap-1 shrink-0" role="img" aria-label="Rating {rating} of {max}">
    {#each bars as bar}
      <div
        class="{compact ? 'w-2.5 h-1.5' : 'w-4 h-2'} rounded-none border transition-micro {bar.filled
          ? 'bg-mint border-mint'
          : 'bg-surface-subtle border-border'}"
      ></div>
    {/each}
  </div>

  <span class="text-ink font-semibold whitespace-nowrap">
    {rating} / {max}
  </span>

  {#if label}
    <span class="text-ink-muted text-[11px] whitespace-nowrap">
      ({label})
    </span>
  {/if}
</div>
