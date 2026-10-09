<script lang="ts">
  import {
    ArrowRight,
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Clock,
    CheckCircle2,
    Filter,
    ShieldCheck
  } from 'lucide-svelte';
  import { MasterySunburst, GrowthTrajectoryTimeline, ButtonGroup, EvidenceRating } from '$lib/components';
  import { LongitudinalGrowthBand } from '$lib/components/charts';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  // Progressive disclosure for deep visualization
  let showDeepMap = $state(false);
  let deepVisualMode = $state<'sunburst' | 'ribbon' | 'timeline'>('ribbon');

  // Inspector state
  let inspectorOpen = $state(false);
  let selectedRecord = $state<any>(null);

  // Evidence filtering
  type FilterMode = 'all' | 'assessment' | 'project' | 'teacher';
  let activeFilter = $state<FilterMode>('all');

  const filterSourceMap: Record<FilterMode, string[]> = {
    all: [],
    assessment: ['cat_assessment'],
    project: ['project_mission'],
    teacher: ['teacher_observation']
  };

  const filteredEvidence = $derived.by(() => {
    if (activeFilter === 'all') return evidence || [];
    const allowed = filterSourceMap[activeFilter];
    return (evidence || []).filter((e: any) => allowed.includes(e.sourceType));
  });

  function inspect(record: any) {
    selectedRecord = record;
    inspectorOpen = true;
  }

  // Capability data with qualitative developmental tiers
  const capabilities = [
    {
      name: 'Spatial reasoning',
      level: 'Strong Foundation',
      rating: 4,
      maxRating: 5,
      tier: 'positive',
      summary: 'Advanced 3D visualization, orthographic translation, and mental rotation'
    },
    {
      name: 'Computational thinking',
      level: 'Strong Foundation',
      rating: 4,
      maxRating: 5,
      tier: 'positive',
      summary: 'Decomposition, pattern recognition, and algorithm efficiency'
    },
    {
      name: 'Quantitative reasoning',
      level: 'Growing Foundation',
      rating: 3,
      maxRating: 5,
      tier: 'attention',
      summary: 'Proportional equations, rate ratios, and dimensional analysis'
    },
    {
      name: 'Scientific inquiry',
      level: 'Growing Foundation',
      rating: 3,
      maxRating: 5,
      tier: 'attention',
      summary: 'Hypothesis testing, variable isolation, and experimental verification'
    }
  ];
</script>

<svelte:head>
  <title>Capabilities — CREED OS</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-12 py-4">
  <!-- 1. ORIENT: Navigation & Header -->
  <header class="space-y-3">
    <a
      href="/student"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted hover:text-ink transition-colors"
    >
      <ArrowLeft class="w-3.5 h-3.5" />
      <span>Back to Today</span>
    </a>

    <div class="space-y-1">
      <h1 class="text-3xl font-semibold tracking-tight text-ink">
        Capabilities
      </h1>
      <p class="text-base text-ink-secondary">
        What you're getting good at, grounded in verified demonstrations.
      </p>
    </div>
  </header>

  <!-- 2. DECIDE: Demonstrated Strengths (Qualitative Developmental Bands) -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Demonstrated Strengths
      </h2>
      <span class="text-xs text-ink-muted">
        Qualitative Developmental Tiers
      </span>
    </div>

    <div class="space-y-3">
      {#each capabilities as cap}
        <div class="p-5 rounded-none bg-surface border border-border space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span class="text-sm font-semibold text-ink">{cap.name}</span>
            <div class="flex items-center gap-3">
              <EvidenceRating rating={cap.rating} max={cap.maxRating} />
              <span class="text-xs font-medium px-2 py-0.5 rounded-none {cap.tier === 'positive' ? 'bg-positive-subtle text-positive' : 'bg-attention-subtle text-attention'}">
                {cap.level}
              </span>
            </div>
          </div>

          <!-- Angular Segmented Foundation Indicator (Strict 0px Sharp) -->
          <div class="grid grid-cols-5 gap-1.5 py-1">
            {#each Array(cap.maxRating) as _, i}
              <div
                class="h-1.5 rounded-none transition-micro {i < cap.rating
                  ? cap.tier === 'positive' ? 'bg-mint' : 'bg-attention'
                  : 'bg-surface-subtle border border-border'}"
              ></div>
            {/each}
          </div>

          <p class="text-xs text-ink-secondary leading-relaxed">
            {cap.summary}
          </p>
        </div>
      {/each}
    </div>

    <!-- Progressive Disclosure for Deep Geometry -->
    <div class="pt-2">
      <button
        type="button"
        onclick={() => (showDeepMap = !showDeepMap)}
        class="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline cursor-pointer"
      >
        <span>{showDeepMap ? 'Hide capability map' : 'Explore capability map ↓'}</span>
        {#if showDeepMap}
          <ChevronUp class="w-3.5 h-3.5" />
        {:else}
          <ChevronDown class="w-3.5 h-3.5" />
        {/if}
      </button>

      {#if showDeepMap}
        <div class="mt-4 p-6 rounded-none bg-surface border border-border space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
            <span class="text-xs font-semibold text-ink">Deep Visual Exploration</span>
            
            <ButtonGroup class="border border-border">
              <button
                type="button"
                onclick={() => (deepVisualMode = 'ribbon')}
                class="px-3 py-1.5 text-xs font-medium transition-colors border-r cursor-pointer {deepVisualMode === 'ribbon' ? 'bg-brand text-brand-foreground font-semibold' : 'bg-surface text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
              >
                Growth Band
              </button>
              <button
                type="button"
                onclick={() => (deepVisualMode = 'sunburst')}
                class="px-3 py-1.5 text-xs font-medium transition-colors border-r cursor-pointer {deepVisualMode === 'sunburst' ? 'bg-brand text-brand-foreground font-semibold' : 'bg-surface text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
              >
                Radial Sunburst
              </button>
              <button
                type="button"
                onclick={() => (deepVisualMode = 'timeline')}
                class="px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer {deepVisualMode === 'timeline' ? 'bg-brand text-brand-foreground font-semibold' : 'bg-surface text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
              >
                Milestone Strip
              </button>
            </ButtonGroup>
          </div>

          {#if deepVisualMode === 'ribbon'}
            <LongitudinalGrowthBand />
          {:else if deepVisualMode === 'sunburst'}
            <MasterySunburst />
          {:else}
            <GrowthTrajectoryTimeline />
          {/if}
        </div>
      {/if}
    </div>
  </section>

  <!-- 3. ACT: Recommended Next Step -->
  <section class="p-6 rounded-none bg-surface border border-border space-y-4">
    <div class="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-brand">
      <span>Recommended Next Step</span>
      <span class="flex items-center gap-1 text-ink-muted">
        <Clock class="w-3.5 h-3.5" />
        <span>20 min</span>
      </span>
    </div>

    <div class="space-y-1">
      <h2 class="text-lg font-semibold text-ink">
        Strengthen proportional reasoning
      </h2>
      <p class="text-sm text-ink-secondary">
        Bridging proportional equations unlocks robotics kinematics and advanced algorithm modules.
      </p>
    </div>

    <div>
      <a
        href="/student/assessment"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-sm transition-colors duration-140 cursor-pointer"
      >
        <span>Start 20-min practice</span>
        <ArrowRight class="w-4 h-4" />
      </a>
    </div>
  </section>

  <!-- 4. PROVE: Evidence Trail (Drawer/Inspector Powered) -->
  <section class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div>
        <h2 class="text-base font-semibold text-ink">
          Evidence
        </h2>
        <p class="text-xs text-ink-muted">
          {(evidence || []).length} verified demonstrations across projects and diagnostics
        </p>
      </div>

      <!-- Compact Source Filters -->
      <ButtonGroup class="border border-border">
        <button
          type="button"
          onclick={() => (activeFilter = 'all')}
          class="px-2.5 py-1 text-xs border-r transition-colors cursor-pointer {activeFilter === 'all' ? 'bg-surface-subtle font-medium text-ink' : 'bg-surface text-ink-secondary hover:text-ink'}"
        >
          All
        </button>
        <button
          type="button"
          onclick={() => (activeFilter = 'assessment')}
          class="px-2.5 py-1 text-xs border-r transition-colors cursor-pointer {activeFilter === 'assessment' ? 'bg-surface-subtle font-medium text-ink' : 'bg-surface text-ink-secondary hover:text-ink'}"
        >
          Diagnostics
        </button>
        <button
          type="button"
          onclick={() => (activeFilter = 'project')}
          class="px-2.5 py-1 text-xs transition-colors cursor-pointer {activeFilter === 'project' ? 'bg-surface-subtle font-medium text-ink' : 'bg-surface text-ink-secondary hover:text-ink'}"
        >
          Projects
        </button>
      </ButtonGroup>
    </div>

    <div class="divide-y divide-border border-y border-border">
      {#each filteredEvidence as item}
        <div class="py-3.5 flex items-center justify-between gap-4">
          <div class="min-w-0 space-y-0.5">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium text-ink truncate">
                {item.sourceTitle}
              </span>
              <span class="text-[11px] text-ink-muted">
                {new Date(item.observedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <p class="text-xs text-ink-secondary truncate">
              {item.summary}
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <EvidenceRating rating={4} max={5} />
            <button
              type="button"
              onclick={() => inspect(item)}
              class="px-3 py-1.5 rounded-none bg-surface-subtle hover:bg-surface-raised text-xs font-medium text-ink border border-border shrink-0 transition-colors cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<!-- Right Slide-out Inspector Panel -->
<InspectorPanel
  bind:open={inspectorOpen}
  title={selectedRecord?.sourceTitle || 'Demonstration Record'}
  subtitle={selectedRecord?.id ? `Record ID: ${selectedRecord.id}` : ''}
>
  {#if selectedRecord}
    <div class="space-y-6">
      <div class="space-y-1">
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Context</span>
        <p class="text-sm text-ink leading-relaxed">
          {selectedRecord.summary}
        </p>
      </div>

      <div class="space-y-2">
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Demonstrated Mastery Rubric</span>
        <div class="p-3 rounded-none bg-surface-subtle border border-border flex items-center justify-between">
          <span class="text-xs text-ink">Rubric Demonstration:</span>
          <EvidenceRating rating={4} max={5} label="Verified" />
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Audit Metadata & Provenance</span>
        <div class="p-3 rounded-none bg-surface-subtle border border-border text-xs space-y-1.5">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Method:</span>
            <span class="font-medium text-ink font-mono">{selectedRecord.sourceType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Observed:</span>
            <span class="font-medium text-ink font-mono">{new Date(selectedRecord.observedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Authority:</span>
            <span class="font-medium text-positive">Certified Educator & Deterministic Evaluator</span>
          </div>
          <div class="flex justify-between pt-1 border-t border-border">
            <span class="text-ink-secondary">DPDP Consent Status:</span>
            <span class="font-medium text-mint inline-flex items-center gap-1">
              <ShieldCheck class="w-3 h-3" />
              <span>Cryptographically Sealed</span>
            </span>
          </div>
        </div>
      </div>

      {#if selectedRecord.observedValue?.rubricCriteria}
        <div class="space-y-2">
          <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Demonstrated Criteria</span>
          <ul class="text-xs space-y-1.5 text-ink-secondary">
            {#each Object.keys(selectedRecord.observedValue.rubricCriteria) as crit}
              <li class="flex items-start gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-positive shrink-0 mt-0.5" />
                <span>{crit}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  {/if}
</InspectorPanel>
