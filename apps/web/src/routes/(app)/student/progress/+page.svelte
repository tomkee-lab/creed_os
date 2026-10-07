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
  import { MasterySunburst, GrowthTrajectoryTimeline } from '$lib/components';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  // Progressive disclosure for deep visualization
  let showDeepMap = $state(false);
  let deepVisualMode = $state<'sunburst' | 'trajectory'>('sunburst');

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

  // Capability data with qualitative tiers
  const capabilities = [
    {
      name: 'Spatial reasoning',
      level: 'Strong',
      percent: 85,
      tier: 'positive',
      summary: 'Advanced 3D visualization, orthographic translation, and mental rotation'
    },
    {
      name: 'Computational thinking',
      level: 'Strong',
      percent: 80,
      tier: 'positive',
      summary: 'Decomposition, pattern recognition, and algorithm efficiency'
    },
    {
      name: 'Quantitative reasoning',
      level: 'Growing',
      percent: 65,
      tier: 'attention',
      summary: 'Proportional equations, rate ratios, and dimensional analysis'
    },
    {
      name: 'Scientific inquiry',
      level: 'Growing',
      percent: 62,
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

  <!-- 2. DECIDE: Horizontal Capability Bars (Default Analytical View) -->
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
        <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="font-medium text-ink">{cap.name}</span>
            <span class="text-xs font-medium px-2 py-0.5 rounded-sm {cap.tier === 'positive' ? 'bg-positive-subtle text-positive' : 'bg-attention-subtle text-attention'}">
              {cap.level}
            </span>
          </div>

          <!-- Clean Horizontal Bar -->
          <div class="w-full h-2 bg-surface-subtle rounded-none overflow-hidden">
            <div
              class="h-full {cap.tier === 'positive' ? 'bg-brand' : 'bg-attention'} transition-all duration-200"
              style="width: {cap.percent}%"
            ></div>
          </div>

          <p class="text-xs text-ink-muted">
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
        <div class="mt-4 p-6 rounded-sm bg-surface border border-border space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-border">
            <span class="text-xs font-semibold text-ink">Deep Visual Exploration</span>
            <div class="flex items-center gap-1 p-0.5 rounded-sm bg-surface-subtle border border-border text-xs">
              <button
                type="button"
                onclick={() => (deepVisualMode = 'sunburst')}
                class="px-2.5 py-1 rounded-sm font-medium transition-colors {deepVisualMode === 'sunburst' ? 'bg-brand text-white' : 'text-ink-secondary hover:text-ink'}"
              >
                Radial Sunburst
              </button>
              <button
                type="button"
                onclick={() => (deepVisualMode = 'trajectory')}
                class="px-2.5 py-1 rounded-sm font-medium transition-colors {deepVisualMode === 'trajectory' ? 'bg-brand text-white' : 'text-ink-secondary hover:text-ink'}"
              >
                Growth Trajectory
              </button>
            </div>
          </div>

          {#if deepVisualMode === 'sunburst'}
            <MasterySunburst />
          {:else}
            <GrowthTrajectoryTimeline />
          {/if}
        </div>
      {/if}
    </div>
  </section>

  <!-- 3. ACT: Recommended Next Step -->
  <section class="p-6 rounded-sm bg-surface border border-border space-y-4">
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
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-sm transition-colors duration-140"
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
      <div class="flex items-center gap-1.5 text-xs">
        <button
          type="button"
          onclick={() => (activeFilter = 'all')}
          class="px-2.5 py-1 rounded-sm transition-colors {activeFilter === 'all' ? 'bg-surface-subtle font-medium text-ink border border-border' : 'text-ink-secondary hover:text-ink'}"
        >
          All
        </button>
        <button
          type="button"
          onclick={() => (activeFilter = 'assessment')}
          class="px-2.5 py-1 rounded-sm transition-colors {activeFilter === 'assessment' ? 'bg-surface-subtle font-medium text-ink border border-border' : 'text-ink-secondary hover:text-ink'}"
        >
          Diagnostics
        </button>
        <button
          type="button"
          onclick={() => (activeFilter = 'project')}
          class="px-2.5 py-1 rounded-sm transition-colors {activeFilter === 'project' ? 'bg-surface-subtle font-medium text-ink border border-border' : 'text-ink-secondary hover:text-ink'}"
        >
          Projects
        </button>
      </div>
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
          <button
            type="button"
            onclick={() => inspect(item)}
            class="px-3 py-1.5 rounded-sm bg-surface-subtle hover:bg-surface-raised text-xs font-medium text-ink border border-border shrink-0 transition-colors cursor-pointer"
          >
            Inspect
          </button>
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
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Audit Metadata</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border text-xs space-y-1.5">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Method:</span>
            <span class="font-medium text-ink">{selectedRecord.sourceType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Observed:</span>
            <span class="font-medium text-ink">{new Date(selectedRecord.observedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Authority:</span>
            <span class="font-medium text-positive">Deterministic Evaluator</span>
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
