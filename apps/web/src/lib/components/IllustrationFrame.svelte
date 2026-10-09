<script lang="ts">
  interface Props {
    src: string;
    alt: string;
    aspectRatio?: '16:9' | '3:2' | '1:1' | '4:3' | 'auto';
    caption?: string;
    badge?: string;
    credit?: string;
    class?: string;
    imageClass?: string;
    priority?: boolean;
    interactive?: boolean;
  }

  let {
    src,
    alt,
    aspectRatio = '16:9',
    caption,
    badge,
    credit,
    class: className = '',
    imageClass = '',
    priority = false,
    interactive = false
  }: Props = $props();

  const aspectClasses: Record<string, string> = {
    '16:9': 'aspect-video',
    '3:2': 'aspect-3/2',
    '1:1': 'aspect-square',
    '4:3': 'aspect-4/3',
    'auto': 'aspect-auto'
  };

  const containerInteractive = $derived(
    interactive
      ? 'group cursor-pointer transition-all duration-200 hover:border-border-strong'
      : ''
  );
</script>

<figure
  class="rounded-none border border-border p-2 sm:p-4 bg-surface {containerInteractive} {className}"
>
  <!-- Hairline Passe-Partout Matting & Inner Image Frame (8px Expressive Radius) -->
  <div class="relative overflow-hidden rounded-none border border-border bg-surface-raised {aspectClasses[aspectRatio] || 'aspect-video'}">
    <img
      {src}
      {alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      class="w-full h-full object-cover rounded-none transition-transform duration-280 ease-out {interactive ? 'group-hover:scale-[1.015]' : ''} {imageClass}"
    />

    {#if badge}
      <div class="absolute top-2 left-2 z-10">
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-none bg-canvas/90 backdrop-blur-sm border border-border text-[11px] font-semibold uppercase tracking-wider text-ink">
          {badge}
        </span>
      </div>
    {/if}
  </div>

  <!-- Editorial Caption Bar -->
  {#if caption || credit}
    <figcaption class="pt-2 px-1 pb-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-ink-muted leading-relaxed">
      {#if caption}
        <span class="text-ink-secondary font-medium">{caption}</span>
      {/if}
      {#if credit}
        <span class="text-ink-muted font-mono tracking-tight shrink-0">{credit}</span>
      {/if}
    </figcaption>
  {/if}
</figure>
