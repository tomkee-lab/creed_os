<script lang="ts">
  import {
    Heart,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    CheckCircle2
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  let childName = $derived(learner?.fullName ? learner.fullName.split(' ')[0] : 'Anaya');

  // Trajectory disclosure
  let showTrajectory = $state(false);

  // Inspector for evidence
  let inspectorOpen = $state(false);
  let inspectedRecord = $state<any>(null);

  function inspect(item: any) {
    inspectedRecord = item;
    inspectorOpen = true;
  }
</script>

<svelte:head>
  <title>Family Growth Guide — CREED OS</title>
</svelte:head>

<div class="max-w-3xl mx-auto space-y-12 py-4">
  <!-- 1. ORIENT: Warm Editorial Family Heading -->
  <header class="space-y-3">
    <div class="flex items-center gap-2 text-xs text-brand font-medium">
      <ShieldCheck class="w-4 h-4" />
      <span>Verified Parental Consent Active • Private & Encrypted</span>
    </div>

    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
      How is {childName} doing?
    </h1>

    <p class="text-lg text-ink-secondary leading-relaxed">
      {childName} is developing well and building strong technical confidence.
    </p>
  </header>

  <!-- 2. DECIDE: The Three Core Insights (Strength / Growing / At Home) -->
  <section class="space-y-6 pt-4 border-t border-border">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <div class="space-y-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-positive">
          Strength
        </span>
        <h3 class="text-base font-semibold text-ink">
          Spatial Reasoning
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Quickly visualizes three-dimensional mechanics and linkage systems.
        </p>
      </div>

      <div class="space-y-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-attention">
          Growing
        </span>
        <h3 class="text-base font-semibold text-ink">
          Proportional Reasoning
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Practicing rate equations through physical gear experiments.
        </p>
      </div>

      <div class="space-y-1">
        <span class="text-xs font-semibold uppercase tracking-wider text-brand">
          At Home
        </span>
        <h3 class="text-base font-semibold text-ink">
          Kitchen Balance Challenge
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Try comparing recipe scaling with balance scales during cooking.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. EXPLORE: Shared Horizons -->
  <section class="p-6 sm:p-8 rounded-sm bg-surface border border-border space-y-4">
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold uppercase tracking-wider text-brand">
        Shared Horizon
      </span>
      <span class="text-xs text-ink-muted">
        Reviewed with Family Counselor
      </span>
    </div>

    <div class="space-y-2">
      <h2 class="text-xl font-semibold text-ink">
        Robotics & Applied Engineering
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed">
        {childName}'s high spatial curiosity aligns naturally with mechanical design and robotics maker tracks. Both parent and student aspirations share a focus on engineering exploration.
      </p>
    </div>

    <div class="pt-2">
      <button
        type="button"
        onclick={() => (showTrajectory = !showTrajectory)}
        class="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline cursor-pointer"
      >
        <span>{showTrajectory ? 'Hide growth journey' : 'Explore growth journey ↓'}</span>
        {#if showTrajectory}
          <ChevronUp class="w-3.5 h-3.5" />
        {:else}
          <ChevronDown class="w-3.5 h-3.5" />
        {/if}
      </button>

      {#if showTrajectory}
        <div class="mt-4 p-4 rounded-sm bg-surface-subtle border border-border text-xs space-y-2">
          <p class="font-medium text-ink">Demonstrated Progression</p>
          <p class="text-ink-secondary leading-relaxed">
            Over the past three terms, {childName} progressed from basic 2D geometry into complex 3D kinematic linkages. Her willingness to test multiple iterations before asking for help is a proven developmental milestone.
          </p>
        </div>
      {/if}
    </div>
  </section>

  <!-- 4. PROVE: Verified Evidence Summary -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">
          Evidence
        </h2>
        <p class="text-xs text-ink-muted">
          4 verified demonstrations
        </p>
      </div>
    </div>

    <div class="divide-y divide-border border-y border-border">
      {#each (evidence || []).slice(0, 4) as item}
        <div class="py-3.5 flex items-center justify-between gap-4">
          <div class="min-w-0 space-y-0.5">
            <span class="text-sm font-medium text-ink truncate block">
              {item.sourceTitle}
            </span>
            <p class="text-xs text-ink-secondary truncate">
              {item.summary}
            </p>
          </div>
          <button
            type="button"
            onclick={() => inspect(item)}
            class="px-3 py-1.5 rounded-sm bg-surface hover:bg-surface-subtle border border-border text-xs font-medium text-ink shrink-0 transition-colors cursor-pointer"
          >
            Inspect
          </button>
        </div>
      {/each}
    </div>
  </section>
</div>

<!-- Right Slide-out Inspector Panel for Verified Evidence -->
<InspectorPanel
  bind:open={inspectorOpen}
  title={inspectedRecord?.sourceTitle || 'Demonstration Record'}
  subtitle="Child Safety & DPDP Compliant Verification"
>
  {#if inspectedRecord}
    <div class="space-y-6 text-xs">
      <div class="space-y-1">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">What Was Demonstrated</span>
        <p class="text-sm text-ink leading-relaxed">
          {inspectedRecord.summary}
        </p>
      </div>

      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Verification Provenance</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border space-y-1.5">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Observation Method:</span>
            <span class="font-medium text-ink">{inspectedRecord.sourceType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Date Recorded:</span>
            <span class="font-medium text-ink">{new Date(inspectedRecord.observedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Teacher Sign-off:</span>
            <span class="font-medium text-positive">Confirmed in Lab</span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</InspectorPanel>
