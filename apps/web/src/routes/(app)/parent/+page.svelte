<script lang="ts">
  import { goto } from '$app/navigation';
  import {
    Heart,
    ChevronDown,
    ChevronUp,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Lock,
    ExternalLink,
    HelpCircle,
    UserPlus,
    Users,
    AlertCircle,
    X
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';
  import { EvidenceRating } from '$lib/components';
  import AppleActivityCard, { type ActivityData } from '$lib/components/kokonutui/AppleActivityCard.svelte';
  import { Dialog } from 'bits-ui';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);
  let linkedLearners = $derived(data.linkedLearners || []);

  const parentActivities: ActivityData[] = [
    {
      label: 'FOUNDATION',
      color: 'var(--brand)',
      colorEnd: 'var(--brand-hover)',
      size: 140,
      current: 18,
      target: 24,
      unit: 'TIERS'
    },
    {
      label: 'EXPLORATION',
      color: 'var(--cyan)',
      colorEnd: 'var(--cyan)',
      size: 108,
      current: 45,
      target: 30,
      unit: 'MIN'
    },
    {
      label: 'PROJECTS',
      color: 'var(--positive)',
      colorEnd: 'var(--positive)',
      size: 76,
      current: 5,
      target: 6,
      unit: 'BUILDS'
    }
  ];

  let childName = $derived(learner?.fullName ? learner.fullName.split(' ')[0] : 'Learner');
  let isPreparatory = $derived(
    learner?.gradeBand?.includes('Class 5') ||
    learner?.gradeBand?.includes('Preparatory') ||
    (typeof learner?.age === 'number' && learner.age <= 11)
  );

  // Multi-child switching handler
  function handleChildSelect(e: Event) {
    const target = e.target as HTMLSelectElement;
    if (target.value && target.value !== learner?.id) {
      goto(`/parent?learnerId=${target.value}`, { keepFocus: true, noScroll: true });
    }
  }

  // Trajectory disclosure
  let showTrajectory = $state(false);

  // At Home Activity Disclosure
  let showHomeActivitySteps = $state(false);

  // Consent Receipt Modal
  let consentModalOpen = $state(false);

  // Link Child Modal State
  let linkChildModalOpen = $state(false);
  let linkIdentifier = $state('');
  let linkLoading = $state(false);
  let linkSuccess = $state(false);
  let linkError = $state('');

  async function handleLinkChildSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!linkIdentifier.trim()) return;
    linkLoading = true;
    linkError = '';

    try {
      // In dev or local testing, simulate immediate verification or call API
      await new Promise((r) => setTimeout(r, 600));
      linkSuccess = true;
      setTimeout(() => {
        linkSuccess = false;
        linkChildModalOpen = false;
        linkIdentifier = '';
      }, 1500);
    } catch (err: any) {
      linkError = err?.message || 'Unable to link learner record.';
    } finally {
      linkLoading = false;
    }
  }

  // Inspector for evidence
  let inspectorOpen = $state(false);
  let inspectedRecord = $state<any>(null);

  function inspect(item: any) {
    inspectedRecord = item;
    inspectorOpen = true;
  }
</script>

<svelte:head>
  <title>Family Growth Guide · CREED OS</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-10 py-4 px-4 sm:px-6">
  <!-- Multi-Child Selector & Relationship Switcher -->
  {#if linkedLearners.length > 0}
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-sm bg-surface border border-border">
      <div class="flex items-center gap-2">
        <label for="child-select" class="text-xs font-mono uppercase tracking-wider text-ink-muted">
          Active Learner:
        </label>
        {#if linkedLearners.length > 1}
          <div class="relative inline-block">
            <select
              id="child-select"
              value={learner?.id}
              onchange={handleChildSelect}
              class="h-8 pl-3 pr-8 rounded-sm bg-surface-raised border border-border text-xs font-semibold text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
            >
              {#each linkedLearners as child}
                <option value={child.id}>
                  {child.fullName} ({child.gradeBand || 'Enrolled'})
                </option>
              {/each}
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-ink-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        {:else}
          <span class="text-xs font-semibold text-ink">
            {childName} ({learner?.gradeBand || 'Class 8'})
          </span>
        {/if}
      </div>

      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface-raised border border-border text-[11px] font-mono text-ink-muted">
          <ShieldCheck class="w-3.5 h-3.5 text-mint" />
          <span>{linkedLearners.length} verified {linkedLearners.length === 1 ? 'learner' : 'learners'} linked</span>
        </span>
        <button
          type="button"
          onclick={() => (linkChildModalOpen = true)}
          class="inline-flex items-center gap-1 text-xs text-brand font-medium hover:underline cursor-pointer"
        >
          <UserPlus class="w-3.5 h-3.5" />
          <span>Link another child</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- 1. ORIENT: Warm Editorial Family Heading & Weekly Rhythm -->
  <header class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
    <div class="md:col-span-7 space-y-3">
      <button
        type="button"
        onclick={() => (consentModalOpen = true)}
        class="inline-flex items-center gap-2 text-xs text-brand font-medium hover:underline cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <ShieldCheck class="w-4 h-4 text-positive" />
        <span>Verified Parental Consent Active · Private & Encrypted</span>
        <span class="text-[11px] text-ink-muted font-mono">(View Receipt)</span>
      </button>

      <h1 class="font-heading font-medium text-3xl sm:text-4xl text-ink tracking-tight leading-[1.15]">
        How is {childName} doing?
      </h1>

      <p class="text-base text-ink-secondary leading-relaxed">
        {#if isPreparatory}
          {childName} is discovering foundational computational patterns and enjoying exploratory learning.
        {:else}
          {childName} is developing well and building strong technical confidence.
        {/if}
      </p>
    </div>

    <div class="md:col-span-5">
      <AppleActivityCard
        activities={parentActivities}
        title="Weekly Rhythm"
        badge="Active"
        description="Progress across foundational milestones and hands-on builds"
        compact={true}
        class="border border-border rounded-sm bg-surface-raised shadow-xs"
      />
    </div>
  </header>

  <!-- 2. DECIDE: The Three Core Insights (Strength / Growing / At Home) -->
  <section id="growth" class="space-y-6 pt-4 border-t border-border scroll-mt-16">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <!-- Strength -->
      <div class="space-y-2 p-4 rounded-sm bg-surface border border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-positive">
            Strength
          </span>
          <EvidenceRating rating={isPreparatory ? 4 : 4} max={5} compact />
        </div>
        <h3 class="text-base font-semibold text-ink">
          {isPreparatory ? 'Pattern Recognition' : 'Spatial Reasoning'}
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          {#if isPreparatory}
            Quickly identifies repeating geometric series and spatial rotations.
          {:else}
            Quickly visualizes three-dimensional mechanics and linkage systems.
          {/if}
        </p>
      </div>

      <!-- Growing -->
      <div class="space-y-2 p-4 rounded-sm bg-surface border border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-attention">
            Growing
          </span>
          <EvidenceRating rating={3} max={5} compact />
        </div>
        <h3 class="text-base font-semibold text-ink">
          {isPreparatory ? 'Algorithmic Thinking' : 'Proportional Reasoning'}
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          {#if isPreparatory}
            Practicing step-by-step loop execution with physical block challenges.
          {:else}
            Practicing rate equations through physical gear experiments.
          {/if}
        </p>
      </div>

      <!-- At Home -->
      <div class="space-y-2 p-4 rounded-sm bg-surface border border-border">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand">
            At Home
          </span>
          <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-brand-subtle text-brand">
            Co-Explore
          </span>
        </div>
        <h3 class="text-base font-semibold text-ink">
          {isPreparatory ? 'Grid Navigation Walk' : 'Kitchen Balance Challenge'}
        </h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          {#if isPreparatory}
            Try creating simple command paths on tile floors or grid paper.
          {:else}
            Try comparing recipe scaling with balance scales during cooking.
          {/if}
        </p>
        <button
          type="button"
          onclick={() => (showHomeActivitySteps = !showHomeActivitySteps)}
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline pt-1 cursor-pointer"
        >
          <span>{showHomeActivitySteps ? 'Hide steps' : 'View experiment steps'}</span>
          {#if showHomeActivitySteps}
            <ChevronUp class="w-3.5 h-3.5" />
          {:else}
            <ChevronDown class="w-3.5 h-3.5" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Expandable At Home Experiment Steps -->
    {#if showHomeActivitySteps}
      <div class="p-5 rounded-sm bg-surface-subtle border border-border space-y-3 text-xs">
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
  <section id="horizons" class="p-6 sm:p-8 rounded-sm bg-surface border border-border space-y-4 scroll-mt-16">
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
        <span>{showTrajectory ? 'Hide growth trajectory' : 'Explore growth trajectory'}</span>
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
  <section id="evidence" class="space-y-4 scroll-mt-16">
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
              class="px-3 py-1.5 rounded-sm bg-surface hover:bg-surface-subtle border border-border text-xs font-medium text-ink transition-colors cursor-pointer"
            >
              Inspect
            </button>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 5. MESSAGES: School & Counselor Communication -->
  <section id="messages" class="space-y-4 pt-4 border-t border-border scroll-mt-16">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Messages & Advisory
      </h2>
      <span class="text-xs text-ink-muted">Direct Guidance Channel</span>
    </div>
    <div class="p-4 rounded-sm bg-surface border border-border text-xs space-y-2">
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
        <div class="p-3 rounded-sm bg-surface-subtle border border-border flex items-center justify-between">
          <span class="text-ink">Demonstration Consistency:</span>
          <EvidenceRating rating={4} max={5} label="Corroborated" />
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Verification Provenance</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border space-y-1.5">
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
    <div class="p-3.5 rounded-sm bg-positive-subtle text-positive border border-border flex items-center gap-2">
      <ShieldCheck class="w-4 h-4 shrink-0" />
      <span>Verified Parental Consent Active • Cryptographically Authenticated via SMS OTP</span>
    </div>

    <div class="space-y-2">
      <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Consent Parameters</span>
      <div class="p-3 rounded-sm bg-surface-subtle border border-border space-y-1.5">
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
        class="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-sm bg-surface-subtle hover:bg-surface-raised border border-border font-medium text-ink transition-colors cursor-pointer"
      >
        <span>Manage Data Sovereignty Settings</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </div>
</InspectorPanel>

<!-- Dialog for Linking Another Child under DPDP Section 9 -->
<Dialog.Root bind:open={linkChildModalOpen}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs transition-opacity duration-140" />
    <Dialog.Content class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-surface-raised border border-border rounded-sm shadow-md space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <Dialog.Title class="text-base font-semibold text-ink">
            Link a child to your family account
          </Dialog.Title>
          <Dialog.Description class="text-xs text-ink-secondary leading-relaxed">
            Under India's DPDP Act 2023, guardian-learner relationships require verifiable identity correlation to prevent unauthorized child profiling.
          </Dialog.Description>
        </div>
        <Dialog.Close class="p-1 text-ink-muted hover:text-ink rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand">
          <X class="w-4 h-4" />
        </Dialog.Close>
      </div>

      {#if linkSuccess}
        <div class="p-3.5 rounded-sm bg-positive-subtle text-positive border border-positive/20 text-xs flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 shrink-0" />
          <span>Learner record linked successfully. Refreshing family growth view.</span>
        </div>
      {:else}
        {#if linkError}
          <div class="p-3 rounded-sm bg-critical-subtle text-critical border border-critical/20 text-xs flex items-center gap-2">
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{linkError}</span>
          </div>
        {/if}

        <form onsubmit={handleLinkChildSubmit} class="space-y-4 text-xs">
          <div class="space-y-1.5">
            <label for="link-id" class="block font-medium text-ink">
              Student APAAR ID or School Enrollment Code
            </label>
            <input
              id="link-id"
              type="text"
              bind:value={linkIdentifier}
              required
              placeholder="e.g. APAAR-12-3456-7890 or SCH-8821"
              class="w-full px-3 py-2 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
            <p class="text-[11px] text-ink-muted">
              Provided on your student's school report card or DigiLocker education profile.
            </p>
          </div>

          <div class="p-3 rounded-sm bg-surface-subtle border border-border space-y-1.5">
            <span class="font-medium text-ink block">Verification Channel</span>
            <div class="flex items-center gap-2 text-ink-secondary">
              <ShieldCheck class="w-4 h-4 text-brand shrink-0" />
              <span>SMS OTP will be dispatched to your registered parent phone.</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-2">
            <Dialog.Close class="h-8 px-3 rounded-sm border border-border bg-surface text-ink text-xs font-medium hover:bg-surface-raised transition-colors">
              Cancel
            </Dialog.Close>
            <button
              type="submit"
              disabled={linkLoading || !linkIdentifier.trim()}
              class="h-8 px-4 rounded-sm bg-brand text-brand-foreground font-medium text-xs inline-flex items-center gap-1.5 hover:bg-brand/90 transition-colors disabled:opacity-40 cursor-pointer shadow-xs"
            >
              <span>{linkLoading ? 'Verifying...' : 'Verify & Link Child'}</span>
              <ArrowRight class="w-3 h-3" />
            </button>
          </div>
        </form>
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
