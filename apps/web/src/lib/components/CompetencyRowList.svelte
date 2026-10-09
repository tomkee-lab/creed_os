<script lang="ts">
  import { getCompetencyDescriptor, type AudienceRole } from '@core-os/ui';
  import { Badge } from '$lib/components';
  import { ArrowRight, Sparkles } from 'lucide-svelte';

  export interface CompetencyItem {
    id: string;
    name: string;
    score: number; // 1.0 to 5.0
    evidenceCount: number;
    trend?: 'up' | 'stable' | 'focus';
    focusReason?: string;
  }

  interface Props {
    competencies: CompetencyItem[] | Record<string, any>;
    evidence?: any[];
    role?: AudienceRole;
    showDeepVisualCta?: boolean;
    onViewDeepMap?: () => void;
    class?: string;
  }

  let {
    competencies,
    evidence = [],
    role = 'student',
    showDeepVisualCta = true,
    onViewDeepMap,
    class: className = ''
  }: Props = $props();

  const normalizedCompetencies = $derived.by(() => {
    if (Array.isArray(competencies)) {
      return competencies;
    }
    return Object.entries(competencies || {}).map(([key, val]: [string, any]) => {
      const name = key.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const count = Array.isArray(evidence) ? evidence.filter((e: any) => e.competency === key).length : 0;
      return {
        id: key,
        name,
        score: val.score ?? 3.0,
        evidenceCount: val.evidenceCount ?? count ?? 0
      };
    }).sort((a, b) => b.score - a.score);
  });
</script>

<div class="space-y-3 w-full {className}">
  {#each normalizedCompetencies as comp (comp.id)}
    {@const descriptor = getCompetencyDescriptor(comp.score, role)}
    {@const percentage = Math.min(Math.max(((comp.score - 1) / 4) * 100, 10), 100)}

    <div
      class="surface-card rounded-none border border-border p-3 sm:p-4 hover:border-border-strong transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
    >
      <!-- Title & Evidence Count -->
      <div class="min-w-0 sm:w-1/3">
        <div class="flex items-center gap-2">
          <h4 class="text-xs sm:text-sm font-semibold text-ink truncate">
            {comp.name}
          </h4>
          <span class="text-[10px] font-mono text-ink-muted shrink-0">
            {comp.evidenceCount} {comp.evidenceCount === 1 ? 'atom' : 'atoms'}
          </span>
        </div>
        {#if comp.focusReason}
          <p class="text-[11px] text-attention truncate mt-0.5">
            {comp.focusReason}
          </p>
        {/if}
      </div>

      <!-- Qualitative Developmental Label -->
      <div class="shrink-0">
        <Badge
          variant={comp.score >= 3.5 ? 'growth' : 'focus'}
          size="sm"
        >
          {descriptor.label}
        </Badge>
      </div>

      <!-- Horizontal Bar Metric (True 8pt Rhythm, No Rainbow) -->
      <div class="flex-1 min-w-30 max-w-xs flex items-center gap-2">
        <div class="flex-1 h-2 rounded-none bg-surface-subtle overflow-hidden border border-border">
          <div
            class="h-full rounded-none transition-all duration-200 {comp.score >= 3.5 ? 'bg-brand' : 'bg-attention'}"
            style="width: {percentage}%"
          ></div>
        </div>
      </div>

      <!-- Progressive Disclosure Link to Deep Evidence -->
      <div class="shrink-0 flex items-center justify-end">
        <a
          href="/student/assessment"
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline"
        >
          <span>Evidence Trail</span>
          <ArrowRight class="w-3 h-3" />
        </a>
      </div>
    </div>
  {/each}
</div>
