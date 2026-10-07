<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    title = '',
    description,
    actions,
    statusBadge
  }: {
    title?: string;
    description?: string;
    actions?: Snippet;
    statusBadge?: Snippet;
  } = $props();
</script>

<header class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
  <div class="space-y-1 max-w-2xl">
    <div class="flex items-center gap-2.5">
      <h1 class="text-2xl sm:text-[28px] font-heading font-semibold text-ink tracking-tight leading-tight">
        {title}
      </h1>
      {#if statusBadge}
        {@render statusBadge()}
      {/if}
    </div>
    {#if description}
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
        {description}
      </p>
    {/if}
  </div>

  {#if actions}
    <div class="flex items-center gap-2 shrink-0">
      {@render actions()}
    </div>
  {/if}
</header>
