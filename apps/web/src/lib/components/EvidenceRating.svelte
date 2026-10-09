<script lang="ts">
  interface Props {
    rating: number; // e.g. 4
    max?: number;   // default 5
    label?: string;
    class?: string;
  }

  let {
    rating,
    max = 5,
    label,
    class: className = ''
  }: Props = $props();

  const bars = $derived(
    Array.from({ length: max }, (_, i) => ({
      index: i + 1,
      filled: i + 1 <= rating
    }))
  );
</script>

<div class="inline-flex items-center gap-2 text-xs font-mono {className}">
  <!-- Segmented Angular Rating Bars (Strict 0px Sharp) -->
  <div class="inline-flex items-center gap-1" role="img" aria-label="Rating {rating} of {max}">
    {#each bars as bar}
      <div
        class="w-4 h-2 rounded-none border transition-micro {bar.filled
          ? 'bg-mint border-mint'
          : 'bg-surface-subtle border-border'}"
      ></div>
    {/each}
  </div>

  <span class="text-ink font-semibold">
    {rating} / {max}
  </span>

  {#if label}
    <span class="text-ink-muted text-[11px]">
      ({label})
    </span>
  {/if}
</div>
