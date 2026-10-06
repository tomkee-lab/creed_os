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

  const readinessPercent = $derived(
    Math.min(100, Math.round((studentReadinessScore / 5.0) * 100))
  );

  const isStrongMatch = $derived(studentReadinessScore >= 4.0);
  const isModerateMatch = $derived(studentReadinessScore >= 3.0 && studentReadinessScore < 4.0);
</script>

<div
  class="surface-card rounded-none overflow-hidden text-left transition-all {isSelected
    ? 'border-(--accent-primary) ring-1 ring-(--accent-primary)'
    : 'hover:border-(--accent-primary)'}"
>
  {#if illustrationUrl}
    <div class="relative aspect-3/2 w-full overflow-hidden border-b border-(--border-subtle) bg-(--surface-sunken)">
      <img
        src={illustrationUrl}
        alt={illustrationAlt || pathway.title}
        loading="lazy"
        class="w-full h-full object-cover rounded-none transition-transform duration-500 hover:scale-[1.02]"
      />
      <div class="absolute bottom-2 left-2 z-10">
        <span class="px-2 py-0.5 rounded-none bg-(--surface-canvas)/90 backdrop-blur-xs border border-(--border-subtle) text-[10px] font-semibold uppercase tracking-wider text-(--text-primary)">
          {pathway.field.replace('_', ' ')}
        </span>
      </div>
    </div>
  {/if}

  <div class="p-5 space-y-4">
  <div class="flex items-start justify-between gap-3">
    <div>
      <div class="flex items-center gap-2 mb-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
          {pathway.field.replace('_', ' ')}
        </span>
        {#if isStrongMatch}
          <span class="text-[11px] font-medium px-2 py-0.5 rounded-none badge-growth flex items-center gap-1">
            <Sparkles class="w-3 h-3" /> High Alignment
          </span>
        {/if}
      </div>
      <h3 class="text-base font-bold text-(--text-primary)">
        {pathway.title}
      </h3>
    </div>
    <div class="text-right shrink-0">
      <span class="text-xs font-bold text-(--text-primary)">
        {studentReadinessScore.toFixed(1)} / 5.0
      </span>
      <span class="text-[10px] text-(--text-muted) block">Readiness Index</span>
    </div>
  </div>

  <p class="text-xs text-(--text-secondary) line-clamp-2 leading-relaxed">
    {pathway.overview}
  </p>

  <!-- Required Competencies Badges -->
  {#if pathway.requirements && pathway.requirements.length > 0}
    <div class="space-y-1.5">
      <span class="text-[11px] text-(--text-muted) font-medium">Core Requirements:</span>
      <div class="flex flex-wrap gap-1.5">
        {#each pathway.requirements as req}
          <span class="text-[10px] px-2 py-0.5 rounded-none bg-(--surface-sunken) border border-(--border-subtle) text-(--text-secondary)">
            {req.competency.replace('_', ' ')} (≥{req.minimumLevel.toFixed(1)})
          </span>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Readiness Progress Bar -->
  <div class="space-y-1 pt-1">
    <div class="flex justify-between text-[11px] text-(--text-muted) font-medium">
      <span>Foundational Fit</span>
      <span class="font-bold text-(--accent-primary)">{readinessPercent}%</span>
    </div>
    <div class="h-2 bg-(--surface-sunken) rounded-none overflow-hidden border border-(--border-subtle)">
      <div
        class="h-full rounded-none transition-all duration-500 {isStrongMatch
          ? 'bg-(--accent-success)'
          : isModerateMatch
            ? 'bg-(--accent-primary)'
            : 'bg-(--accent-warning)'}"
        style="width: {readinessPercent}%;"
      ></div>
    </div>
  </div>

  {#if onSelect}
    <button
      type="button"
      onclick={() => onSelect(pathway)}
      class="w-full mt-2 py-2 px-3 rounded-none text-xs font-medium surface-card hover:bg-(--surface-sunken) text-(--text-primary) transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
    >
      <span>Explore Milestones & Curriculum</span>
      <ArrowRight class="w-3.5 h-3.5" />
    </button>
  {/if}
  </div>
</div>
