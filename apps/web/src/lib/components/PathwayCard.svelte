<script lang="ts">
  import type { Pathway } from '@core-os/domain';
  import { Compass, ArrowRight, Sparkles } from 'lucide-svelte';

  interface Props {
    pathway: Pathway;
    studentReadinessScore?: number; // 0 to 5.0
    isSelected?: boolean;
    illustrationUrl?: string;
    illustrationAlt?: string;
    onSelect?: (pathway: Pathway) => void;
  }

  let {
    pathway,
    studentReadinessScore = 3.8,
    isSelected = false,
    illustrationUrl,
    illustrationAlt,
    onSelect
  }: Props = $props();

  const matchStatus = $derived(
    studentReadinessScore >= 4.0
      ? { label: 'Strong Foundation', badgeClass: 'badge-growth', colorClass: 'text-positive' }
      : studentReadinessScore >= 3.0
        ? { label: 'Developing Foundation', badgeClass: 'badge-primary', colorClass: 'text-brand' }
        : { label: 'Exploration Stage', badgeClass: 'badge-focus', colorClass: 'text-attention' }
  );

  const demonstratedCount = $derived(
    Math.min(pathway.requirements?.length ?? 4, Math.round((studentReadinessScore / 5.0) * (pathway.requirements?.length ?? 4)))
  );
</script>

<div
  class="surface-card rounded-none overflow-hidden text-left transition-all duration-140 {isSelected
    ? 'border-brand ring-1 ring-brand'
    : 'hover:border-border-strong'}"
>
  {#if illustrationUrl}
    <div class="relative aspect-3/2 w-full overflow-hidden border-b border-border bg-surface-subtle">
      <img
        src={illustrationUrl}
        alt={illustrationAlt || pathway.title}
        loading="lazy"
        class="w-full h-full object-cover rounded-none transition-transform duration-280 hover:scale-[1.02]"
      />
      <div class="absolute bottom-2 left-2 z-10">
        <span class="px-2 py-0.5 rounded-none bg-canvas/90 backdrop-blur-xs border border-border text-[10px] font-semibold uppercase tracking-wider text-ink">
          {pathway.field.replace('_', ' ')}
        </span>
      </div>
    </div>
  {/if}

  <div class="p-5 space-y-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-ai">
            {pathway.field.replace('_', ' ')}
          </span>
          <span class="text-[11px] font-medium px-2 py-0.5 rounded-none {matchStatus.badgeClass} flex items-center gap-1">
            <Sparkles class="w-2.5 h-2.5" /> {matchStatus.label}
          </span>
        </div>
        <h3 class="text-base font-bold text-ink">
          {pathway.title}
        </h3>
      </div>
      <div class="text-right shrink-0">
        <span class="text-xs font-semibold {matchStatus.colorClass}">
          {demonstratedCount} / {pathway.requirements?.length ?? 4} Demonstrated
        </span>
        <span class="text-[10px] text-ink-muted block">Prerequisites Met</span>
      </div>
    </div>

    <p class="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
      {pathway.overview}
    </p>

    <!-- Required Competencies Badges -->
    {#if pathway.requirements && pathway.requirements.length > 0}
      <div class="space-y-1.5">
        <span class="text-[11px] text-ink-muted font-medium">Foundational Competencies:</span>
        <div class="flex flex-wrap gap-1.5">
          {#each pathway.requirements as req}
            <span class="text-[10px] px-2 py-0.5 rounded-none bg-surface border border-border text-ink-secondary">
              {req.competency.replace('_', ' ')}
            </span>
          {/each}
        </div>
      </div>
    {/if}

    {#if onSelect}
      <button
        type="button"
        onclick={() => onSelect(pathway)}
        class="w-full mt-2 py-2 px-3 rounded-none text-xs font-semibold surface-card hover:bg-surface text-ink transition-all duration-140 flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>Explore Field & Missions</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    {/if}
  </div>
</div>
