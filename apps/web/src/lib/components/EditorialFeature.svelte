<script lang="ts">
  import { ArrowRight, Sparkles } from 'lucide-svelte';

  interface Props {
    src: string;
    alt: string;
    aspectRatio?: '16:9' | '3:2' | '1:1';
    badge?: string;
    caption?: string;
    title: string;
    description: string;
    actionLabel: string;
    actionHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
    class?: string;
  }

  let {
    src,
    alt,
    aspectRatio = '16:9',
    badge,
    caption,
    title,
    description,
    actionLabel,
    actionHref,
    secondaryLabel,
    secondaryHref,
    class: className = ''
  }: Props = $props();

  const aspectMap = {
    '16:9': 'aspect-16/9',
    '3:2': 'aspect-3/2',
    '1:1': 'aspect-square'
  };
</script>

<div
  class="surface-card rounded-sm overflow-hidden border border-(--border-subtle) transition-all hover:border-(--border-strong) flex flex-col justify-between {className}"
>
  <!-- Integrated Editorial Visual (8px expressive radius on container) -->
  <div class="relative {aspectMap[aspectRatio]} w-full overflow-hidden bg-(--surface-sunken)">
    <img
      {src}
      {alt}
      loading="lazy"
      class="w-full h-full object-cover transition-transform duration-280 hover:scale-[1.01]"
    />
    {#if badge}
      <div class="absolute top-3 left-3 z-10">
        <span
          class="px-2.5 py-1 rounded-sm bg-(--surface-canvas)/90 backdrop-blur-xs border border-(--border-subtle) text-[10px] font-semibold uppercase tracking-wider text-(--text-primary)"
        >
          {badge}
        </span>
      </div>
    {/if}
  </div>

  <!-- Narrative Context & Action Bar -->
  <div class="p-6 sm:p-7 space-y-4 flex-1 flex flex-col justify-between">
    <div class="space-y-2">
      <h3 class="text-xl font-bold tracking-tight text-(--text-primary)">
        {title}
      </h3>
      <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
        {description}
      </p>
      {#if caption}
        <p class="text-[11px] text-(--text-muted) pt-1 font-mono">
          {caption}
        </p>
      {/if}
    </div>

    <!-- Actions -->
    <div class="pt-3 border-t border-(--border-subtle) flex items-center justify-between gap-3">
      {#if secondaryLabel && secondaryHref}
        <a
          href={secondaryHref}
          class="text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
        >
          {secondaryLabel}
        </a>
      {:else}
        <div></div>
      {/if}

      <a
        href={actionHref}
        class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
      >
        <span>{actionLabel}</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</div>
