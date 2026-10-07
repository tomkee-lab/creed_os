<script lang="ts">
  import {
    ArrowRight,
    Clock,
    Sparkles,
    CheckCircle2,
    Compass,
    Bot,
    ExternalLink
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);
  let pathways = $derived(data.pathways);

  let firstName = $derived(learner?.fullName ? learner.fullName.split(' ')[0] : 'Anaya');

  // Inspector state for quick record inspection
  let inspectorOpen = $state(false);
  let inspectedRecord = $state<any>(null);

  function inspectEvidence(record: any) {
    inspectedRecord = record;
    inspectorOpen = true;
  }
</script>

<svelte:head>
  <title>Today — CREED OS</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-12 py-4">
  <!-- 1. ORIENT: Student Greeting & Immediate Direction -->
  <header class="space-y-1.5">
    <h1 class="text-3xl font-semibold tracking-tight text-ink">
      Good morning, {firstName}.
    </h1>
    <p class="text-base text-ink-secondary">
      Your next step is ready.
    </p>
  </header>

  <!-- 2. ACT: DOMINANT TODAY FOCUS (<= 80 words before action) -->
  <section class="p-6 sm:p-8 rounded-sm bg-surface border border-border space-y-6">
    <div class="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-brand">
      <span>Today</span>
      <span class="flex items-center gap-1.5 text-ink-muted">
        <Clock class="w-3.5 h-3.5" />
        <span>20 min</span>
      </span>
    </div>

    <div class="space-y-2">
      <h2 class="text-xl sm:text-2xl font-semibold text-ink tracking-tight">
        Strengthen proportional reasoning
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed">
        Connect rate equations with mechanical gear ratios to unlock robotics challenges.
      </p>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 pt-2">
      <a
        href="/student/assessment"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-sm transition-colors duration-140 shadow-xs cursor-pointer"
      >
        <span>Start practice</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <span class="text-xs text-ink-muted">
        Based on your recent kinematics demonstration
      </span>
    </div>
  </section>

  <!-- 3. ORIENT: What You're Getting Good At -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        You're getting good at
      </h2>
      <a
        href="/student/progress"
        class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
      >
        <span>View capabilities</span>
        <ArrowRight class="w-3 h-3" />
      </a>
    </div>

    <div class="divide-y divide-border border-y border-border">
      <div class="py-3 flex items-center justify-between">
        <span class="text-sm font-medium text-ink">Spatial reasoning</span>
        <span class="text-xs font-medium px-2 py-0.5 rounded-sm bg-positive-subtle text-positive">
          Strong
        </span>
      </div>
      <div class="py-3 flex items-center justify-between">
        <span class="text-sm font-medium text-ink">Computational thinking</span>
        <span class="text-xs font-medium px-2 py-0.5 rounded-sm bg-positive-subtle text-positive">
          Strong
        </span>
      </div>
      <div class="py-3 flex items-center justify-between">
        <span class="text-sm font-medium text-ink">Scientific inquiry</span>
        <span class="text-xs font-medium px-2 py-0.5 rounded-sm bg-attention-subtle text-attention">
          Growing
        </span>
      </div>
    </div>
  </section>

  <!-- 4. EXPLORE: Try Fields Before Committing -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Explore something
      </h2>
      <a
        href="/student/pathways"
        class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
      >
        <span>All pathways</span>
        <ArrowRight class="w-3 h-3" />
      </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <a
        href="/student/pathways"
        class="p-4 rounded-sm bg-surface hover:bg-surface-subtle border border-border transition-colors duration-140 group space-y-1 block"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-ink group-hover:text-brand">Robotics</span>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
        </div>
        <p class="text-xs text-ink-muted">Autonomous systems & linkages</p>
      </a>

      <a
        href="/student/pathways"
        class="p-4 rounded-sm bg-surface hover:bg-surface-subtle border border-border transition-colors duration-140 group space-y-1 block"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-ink group-hover:text-brand">Data</span>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
        </div>
        <p class="text-xs text-ink-muted">Pattern recognition & models</p>
      </a>

      <a
        href="/student/pathways"
        class="p-4 rounded-sm bg-surface hover:bg-surface-subtle border border-border transition-colors duration-140 group space-y-1 block"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-ink group-hover:text-brand">Scientific Discovery</span>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
        </div>
        <p class="text-xs text-ink-muted">Biomimicry & cellular physics</p>
      </a>
    </div>
  </section>

  <!-- 5. PROVE: Recent Verified Evidence -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-0.5">
        <h2 class="text-base font-semibold text-ink">
          Recent evidence
        </h2>
        <p class="text-xs text-ink-secondary">
          4 verified demonstrations
        </p>
      </div>
      <a
        href="/student/progress"
        class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
      >
        <span>View journey</span>
        <ArrowRight class="w-3 h-3" />
      </a>
    </div>

    <div class="space-y-2">
      {#each (evidence || []).slice(0, 3) as item}
        <div class="p-3.5 rounded-sm bg-surface border border-border flex items-center justify-between gap-4">
          <div class="space-y-0.5 min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-xs font-medium text-ink truncate">
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
            onclick={() => inspectEvidence(item)}
            class="text-xs font-medium text-brand hover:underline shrink-0 cursor-pointer"
          >
            Inspect
          </button>
        </div>
      {/each}
    </div>
  </section>
</div>

<!-- Progressive Disclosure: InspectorPanel for Evidence Details -->
<InspectorPanel
  bind:open={inspectorOpen}
  title={inspectedRecord?.sourceTitle || 'Evidence Record'}
  subtitle={inspectedRecord?.id ? `ID: ${inspectedRecord.id}` : ''}
>
  {#if inspectedRecord}
    <div class="space-y-6">
      <div class="space-y-1">
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Context & Observation</span>
        <p class="text-sm text-ink leading-relaxed">
          {inspectedRecord.summary}
        </p>
      </div>

      <div class="space-y-2">
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Source Provenance</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border text-xs space-y-1">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Source Type:</span>
            <span class="font-medium text-ink">{inspectedRecord.sourceType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Date Recorded:</span>
            <span class="font-medium text-ink">{new Date(inspectedRecord.observedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Verified By:</span>
            <span class="font-medium text-positive">Teacher & Psychometric Engine</span>
          </div>
        </div>
      </div>

      {#if inspectedRecord.observedValue?.rubricCriteria}
        <div class="space-y-2">
          <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Demonstrated Criteria</span>
          <ul class="text-xs space-y-1.5 text-ink-secondary">
            {#each Object.keys(inspectedRecord.observedValue.rubricCriteria) as crit}
              <li class="flex items-start gap-1.5">
                <CheckCircle2 class="w-3.5 h-3.5 text-positive shrink-0 mt-0.5" />
                <span>{crit}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <div class="pt-4 border-t border-border">
        <a
          href="/student/progress"
          class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-sm bg-surface-subtle hover:bg-surface-raised border border-border text-xs font-medium text-ink transition-colors"
        >
          <span>View in complete capability timeline</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  {/if}
</InspectorPanel>
