<script lang="ts">
  import {
    Heart,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Lock,
    ExternalLink,
    HelpCircle
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';
  import { EvidenceRating } from '$lib/components';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  let childName = $derived(learner?.fullName ? learner.fullName.split(' ')[0] : 'Learner');

  // Trajectory disclosure
  let showTrajectory = $state(false);

  // At Home Activity Disclosure
  let showHomeActivitySteps = $state(false);

  // Consent Receipt Modal
  let consentModalOpen = $state(false);

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
    <button
      type="button"
      onclick={() => (consentModalOpen = true)}
      class="inline-flex items-center gap-2 text-xs text-brand font-medium hover:underline cursor-pointer focus-visible:outline-hidden"
    >
      <ShieldCheck class="w-4 h-4" />
      <span>Verified Parental Consent Active • Private & Encrypted</span>
      <span class="text-[11px] text-ink-muted">(View Receipt)</span>
    </button>

    <h1 class="text-3xl sm:text-4xl font-semibold tracking-tight text-ink leading-tight">
      How is {childName} doing?
    </h1>

    <p class="text-lg text-ink-secondary leading-relaxed">
      {childName} is developing well and building strong technical confidence.
    </p>
  </header>

  <!-- 2. DECIDE: The Three Core Insights (Strength / Growing / At Home) -->
  <section id="growth" class="space-y-6 pt-4 border-t border-border">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Strength -->
      <div class="space-y-2 p-4 rounded-none bg-surface border border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-positive">
            Strength
          </span>
          <EvidenceRating rating={4} max={5} />
        </div>
        <h3 class="text-base font-semibold text-ink">
          Spatial Reasoning
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Quickly visualizes three-dimensional mechanics and linkage systems.
        </p>
      </div>

      <!-- Growing -->
      <div class="space-y-2 p-4 rounded-none bg-surface border border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-attention">
            Growing
          </span>
          <EvidenceRating rating={3} max={5} />
        </div>
        <h3 class="text-base font-semibold text-ink">
          Proportional Reasoning
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Practicing rate equations through physical gear experiments.
        </p>
      </div>

      <!-- At Home -->
      <div class="space-y-2 p-4 rounded-none bg-surface border border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand">
            At Home
          </span>
          <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-none bg-brand-subtle text-brand">
            Co-Explore
          </span>
        </div>
        <h3 class="text-base font-semibold text-ink">
          Kitchen Balance Challenge
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Try comparing recipe scaling with balance scales during cooking.
        </p>
        <button
          type="button"
          onclick={() => (showHomeActivitySteps = !showHomeActivitySteps)}
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline pt-1 cursor-pointer"
        >
          <span>{showHomeActivitySteps ? 'Hide steps' : 'View experiment steps ↓'}</span>
        </button>
      </div>
    </div>

    <!-- Expandable At Home Experiment Steps -->
    {#if showHomeActivitySteps}
      <div class="p-5 rounded-none bg-surface-subtle border border-border space-y-3 text-xs">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold text-ink">Weekend Co-Exploration: Kitchen Balance Scale</h4>
          <span class="text-ink-muted text-[11px]">~15 min collaborative activity</span>
        </div>
        <ol class="space-y-2 text-ink-secondary list-decimal list-inside leading-relaxed">
          <li><strong>Gather simple ingredients:</strong> Set up a kitchen balance scale with flour, sugar, or measuring cups.</li>
          <li><strong>Test proportional ratios:</strong> Ask {childName} to predict the counterweight needed if one cup is placed twice as far from the balance fulcrum.</li>
          <li><strong>Connect to robotics:</strong> Reinforce that mechanical gear ratios work by the exact same physical principle: twice the radius yields twice the torque.</li>
        </ol>
      </div>
    {/if}
  </section>

  <!-- 3. EXPLORE: Shared Horizons -->
  <section id="horizons" class="p-6 sm:p-8 rounded-none bg-surface border border-border space-y-4">
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
        <div class="mt-4 p-4 rounded-none bg-surface-subtle border border-border text-xs space-y-2">
          <p class="font-medium text-ink">Demonstrated Progression</p>
          <p class="text-ink-secondary leading-relaxed">
            Over the past three terms, {childName} progressed from basic 2D geometry into complex 3D kinematic linkages. Her willingness to test multiple iterations before asking for help is a proven developmental milestone.
          </p>
        </div>
      {/if}
    </div>
  </section>

  <!-- 4. PROVE: Verified Evidence Summary -->
  <section id="evidence" class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">
          Evidence
        </h2>
        <p class="text-xs text-ink-muted">
          {(evidence || []).length} verified demonstrations corroborated across school labs
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
          <div class="flex items-center gap-3 shrink-0">
            <EvidenceRating rating={4} max={5} />
            <button
              type="button"
              onclick={() => inspect(item)}
              class="px-3 py-1.5 rounded-none bg-surface hover:bg-surface-subtle border border-border text-xs font-medium text-ink transition-colors cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 5. MESSAGES: School & Counselor Communication -->
  <section id="messages" class="space-y-4 pt-4 border-t border-border">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Messages & Advisory
      </h2>
      <span class="text-xs text-ink-muted">Direct Guidance Channel</span>
    </div>
    <div class="p-4 rounded-none bg-surface border border-border text-xs space-y-2">
      <div class="flex justify-between font-medium text-ink">
        <span>Ms. Nair (Science & Robotics Faculty)</span>
        <span class="text-ink-muted">Yesterday</span>
      </div>
      <p class="text-ink-secondary leading-relaxed">
        {childName} demonstrated exceptional curiosity during our linkage mechanisms lab. We recommend letting her explore the upcoming robotics maker challenge.
      </p>
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
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Rubric Evaluation</span>
        <div class="p-3 rounded-none bg-surface-subtle border border-border flex items-center justify-between">
          <span class="text-ink">Demonstration Consistency:</span>
          <EvidenceRating rating={4} max={5} label="Corroborated" />
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Verification Provenance</span>
        <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1.5">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Observation Method:</span>
            <span class="font-medium text-ink font-mono">{inspectedRecord.sourceType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Date Recorded:</span>
            <span class="font-medium text-ink font-mono">{new Date(inspectedRecord.observedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Teacher Sign-off:</span>
            <span class="font-medium text-positive">Confirmed in Lab</span>
          </div>
          <div class="flex justify-between pt-1 border-t border-border">
            <span class="text-ink-secondary">Data Encryption:</span>
            <span class="font-medium text-mint inline-flex items-center gap-1">
              <Lock class="w-3 h-3" />
              <span>AES-256 Verified</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  {/if}
</InspectorPanel>

<!-- Slide-out Inspector Panel for DPDP Consent Receipt -->
<InspectorPanel
  bind:open={consentModalOpen}
  title="Digital Personal Data Protection (DPDP) Receipt"
  subtitle="Statutory Child Consent Verification • Section 9 Compliance"
>
  <div class="space-y-6 text-xs">
    <div class="p-3.5 rounded-none bg-positive-subtle text-positive border border-border flex items-center gap-2">
      <ShieldCheck class="w-4 h-4 shrink-0" />
      <span>Verified Parental Consent Active • Cryptographically Authenticated via SMS OTP</span>
    </div>

    <div class="space-y-2">
      <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Consent Parameters</span>
      <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1.5">
        <div class="flex justify-between">
          <span class="text-ink-secondary">Learner Name:</span>
          <span class="font-medium text-ink">{learner?.fullName || 'Enrolled Learner'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-secondary">Authorized Guardian:</span>
          <span class="font-medium text-ink">{data.user?.name || 'Verified Guardian'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-secondary">School Authority:</span>
          <span class="font-medium text-ink">{learner?.schoolName || 'Affiliated Educational Institution'}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-ink-secondary">Purpose:</span>
          <span class="font-medium text-ink">Adaptive Learning & Formative Diagnostics</span>
        </div>
      </div>
    </div>

    <div class="space-y-2">
      <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Guardian Sovereignty Rights</span>
      <p class="text-ink-secondary leading-relaxed">
        Under DPDP Act 2023 Section 9, parents maintain the perpetual right to review, export, or withdraw consent for data processing at any time without adverse academic impact.
      </p>
    </div>

    <div class="pt-4 border-t border-border">
      <a
        href="/settings"
        class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-none bg-surface-subtle hover:bg-surface-raised border border-border font-medium text-ink transition-colors cursor-pointer"
      >
        <span>Manage Data Sovereignty Settings</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</InspectorPanel>
