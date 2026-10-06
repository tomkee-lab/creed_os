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
      ? 'group cursor-pointer transition-all duration-300 hover:border-(--border-strong)'
      : ''
  );
</script>

<figure
  class="surface-card rounded-none border border-(--border-subtle) p-2 sm:p-2.5 bg-(--surface-sunken) {containerInteractive} {className}"
>
  <!-- Hairline Passe-Partout Matting & Inner Image Frame -->
  <div class="relative overflow-hidden rounded-none border border-(--border-subtle) bg-(--surface-raised) {aspectClasses[aspectRatio] || 'aspect-video'}">
    <img
      {src}
      {alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      class="w-full h-full object-cover rounded-none transition-transform duration-500 {interactive ? 'group-hover:scale-[1.015]' : ''} {imageClass}"
    />

    {#if badge}
      <div class="absolute top-2.5 left-2.5 z-10">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-(--surface-canvas)/90 backdrop-blur-sm border border-(--border-subtle) text-[11px] font-semibold uppercase tracking-wider text-(--text-primary)">
          {badge}
        </span>
      </div>
    {/if}
  </div>

  <!-- Editorial Caption Bar -->
  {#if caption || credit}
    <figcaption class="pt-2 px-1 pb-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-(--text-muted) leading-relaxed">
      {#if caption}
        <span class="text-(--text-secondary) font-medium">{caption}</span>
      {/if}
      {#if credit}
        <span class="text-(--text-muted) font-mono tracking-tight shrink-0">{credit}</span>
      {/if}
    </figcaption>
  {/if}
</figure>
