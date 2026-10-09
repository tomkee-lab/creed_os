<script lang="ts">
  import {
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Compass,
    Bot,
    ExternalLink,
    ShieldCheck,
    Clock
  } from 'lucide-svelte';
  import { Icon } from '$lib/components/icons';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';
  import { Stepper, EvidenceRating } from '$lib/components';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);
  let pathways = $derived(data.pathways);

  let firstName = $derived(learner?.fullName ? learner.fullName.split(' ')[0] : (data.user?.name ? data.user.name.split(' ')[0] : 'Learner'));

  // Daily Mission Stepper definition
  const missionSteps = [
    {
      id: 1,
      label: 'Diagnostic Challenge',
      description: 'Proportional equations • 10m'
    },
    {
      id: 2,
      label: 'Gear Simulation',
      description: 'Kinematic torque lab • 5m'
    },
    {
      id: 3,
      label: 'Socratic Synthesis',
      description: 'Voice mentor dialogue • 5m'
    }
  ];

  let currentMissionStep = $state(1);

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
  <section id="missions" class="p-6 sm:p-8 rounded-none bg-surface border border-border space-y-6">
    <div class="flex items-center justify-between text-xs font-semibold tracking-wider uppercase text-brand">
      <div class="flex items-center gap-2">
        <span class="px-2 py-0.5 rounded-none bg-brand-subtle text-brand font-mono text-[11px]">Mission Active</span>
        <span>Today</span>
      </div>
      <span class="flex items-center gap-1.5 text-ink-muted">
        <Clock class="w-3.5 h-3.5" />
        <span>20 min total</span>
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

    <!-- Structured 3-Phase Daily Mission Stepper -->
    <div class="pt-2 pb-1 border-y border-border">
      <Stepper
        steps={missionSteps}
        current={currentMissionStep}
        clickable={false}
      />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
      <a
        href="/student/assessment"
        class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-sm transition-colors duration-140 shadow-xs cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-brand"
      >
        <span>Start practice</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <span class="text-xs text-ink-muted">
        Based on your recent kinematics demonstration
      </span>
    </div>
  </section>

  <!-- 3. SOCRATIC AI MENTOR DIRECT LAUNCHER (Restrained Iris, Carbon for AI) -->
  <section class="p-5 rounded-none bg-surface-subtle border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="space-y-1">
      <div class="flex items-center gap-1.5 text-xs font-medium text-ai">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Socratic Mentor • Non-judgmental Guidance</span>
      </div>
      <h3 class="text-sm font-semibold text-ink">
        Need guided thinking on gear ratios?
      </h3>
      <p class="text-xs text-ink-secondary">
        Work through torque balancing questions step-by-step with your voice-enabled reasoning partner.
      </p>
    </div>

    <a
      href="/student/mentor"
      class="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-surface hover:bg-surface-raised border border-border text-xs font-semibold text-ink shrink-0 transition-colors shadow-2xs hover:border-border-strong cursor-pointer"
    >
      <Bot class="w-3.5 h-3.5 text-ai" />
      <span>Open thinking session</span>
      <ArrowRight class="w-3.5 h-3.5 text-ink-muted" />
    </a>
  </section>

  <!-- 4. ORIENT: What You're Getting Good At -->
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
      <div class="py-3 flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <span class="text-sm font-medium text-ink block">Spatial reasoning</span>
          <p class="text-xs text-ink-muted">Orthographic projection & mental rotation</p>
        </div>
        <div class="flex items-center gap-3">
          <EvidenceRating rating={4} max={5} label="Demonstrated" />
          <span class="text-xs font-medium px-2 py-0.5 rounded-none bg-positive-subtle text-positive">
            Strong
          </span>
        </div>
      </div>

      <div class="py-3 flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <span class="text-sm font-medium text-ink block">Computational thinking</span>
          <p class="text-xs text-ink-muted">Algorithmic decomposition & iteration</p>
        </div>
        <div class="flex items-center gap-3">
          <EvidenceRating rating={4} max={5} label="Demonstrated" />
          <span class="text-xs font-medium px-2 py-0.5 rounded-none bg-positive-subtle text-positive">
            Strong
          </span>
        </div>
      </div>

      <div class="py-3 flex items-center justify-between gap-4">
        <div class="space-y-0.5">
          <span class="text-sm font-medium text-ink block">Scientific inquiry</span>
          <p class="text-xs text-ink-muted">Hypothesis isolation & experiment design</p>
        </div>
        <div class="flex items-center gap-3">
          <EvidenceRating rating={3} max={5} label="Demonstrated" />
          <span class="text-xs font-medium px-2 py-0.5 rounded-none bg-attention-subtle text-attention">
            Growing
          </span>
        </div>
      </div>
    </div>
  </section>

  <!-- 5. EXPLORE: Try Fields Before Committing -->
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
        class="p-4 rounded-none bg-surface hover:bg-surface-subtle border border-border transition-colors duration-140 group space-y-2 block"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="tabler:robot" class="w-4 h-4 text-brand" />
            <span class="text-sm font-semibold text-ink group-hover:text-brand">Robotics</span>
          </div>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
        </div>
        <p class="text-xs text-ink-muted">Autonomous systems & linkages</p>
        <span class="inline-block text-[11px] font-medium text-positive">
          Aligned with your spatial foundation
        </span>
      </a>

      <a
        href="/student/pathways"
        class="p-4 rounded-none bg-surface hover:bg-surface-subtle border border-border transition-colors duration-140 group space-y-2 block"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="tabler:chart-dots" class="w-4 h-4 text-mint" />
            <span class="text-sm font-semibold text-ink group-hover:text-brand">Data</span>
          </div>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
        </div>
        <p class="text-xs text-ink-muted">Pattern recognition & models</p>
        <span class="inline-block text-[11px] font-medium text-mint">
          High computational synergy
        </span>
      </a>

      <a
        href="/student/pathways"
        class="p-4 rounded-none bg-surface hover:bg-surface-subtle border border-border transition-colors duration-140 group space-y-2 block"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon icon="tabler:flask-2" class="w-4 h-4 text-attention" />
            <span class="text-sm font-semibold text-ink group-hover:text-brand">Scientific Discovery</span>
          </div>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted group-hover:text-brand transition-transform group-hover:translate-x-0.5" />
        </div>
        <p class="text-xs text-ink-muted">Biomimicry & cellular physics</p>
        <span class="inline-block text-[11px] font-medium text-attention">
          Active exploration track
        </span>
      </a>
    </div>
  </section>

  <!-- 5b. MAKER MISSIONS: Try-Before-You-Choose Experiments -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-base font-semibold text-ink">
          Applied Maker Missions
        </h2>
        <p class="text-xs text-ink-muted">Experience real-world thinking before choosing streams</p>
      </div>
      <a
        href="/student/pathways"
        class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1"
      >
        <span>All missions</span>
        <ArrowRight class="w-3 h-3" />
      </a>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div class="p-5 rounded-none bg-surface border border-border flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2 py-0.5 rounded-none bg-brand-subtle text-brand font-semibold text-[11px]">
              Robotics & Mechanics
            </span>
            <span class="text-[11px] text-ink-muted">45 mins • L4 Task</span>
          </div>
          <h3 class="text-sm font-bold text-ink">
            RoboBridge Structural Optimization
          </h3>
          <p class="text-xs text-ink-secondary leading-relaxed">
            Design a lightweight exploration rover truss supporting 5x its own mass across a 12m chasm.
          </p>
        </div>
        <a
          href="/student/missions/robobridge"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs transition-colors shadow-xs cursor-pointer"
        >
          <span>Launch Mission Simulator</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <div class="p-5 rounded-none bg-surface border border-border flex flex-col justify-between space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2 py-0.5 rounded-none bg-ai-subtle text-ai font-semibold text-[11px]">
              Data & Sensing
            </span>
            <span class="text-[11px] text-ink-muted">30 mins • L4 Task</span>
          </div>
          <h3 class="text-sm font-bold text-ink">
            Environmental Climate Sensor Feed
          </h3>
          <p class="text-xs text-ink-secondary leading-relaxed">
            Filter noisy acoustic telemetry and isolate anomaly spikes using multi-variable rate isolation.
          </p>
        </div>
        <a
          href="/student/mentor"
          class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-surface-subtle hover:bg-surface-raised border border-border text-ink font-medium text-xs transition-colors cursor-pointer"
        >
          <span>Launch Socratic Mentor</span>
          <ArrowRight class="w-3.5 h-3.5 text-ink-muted" />
        </a>
      </div>
    </div>
  </section>

  <!-- 6. PROVE: Recent Verified Evidence -->
  <section class="space-y-4">
    <div class="flex items-center justify-between">
      <div class="space-y-0.5">
        <h2 class="text-base font-semibold text-ink">
          Recent evidence
        </h2>
        <p class="text-xs text-ink-secondary">
          {(evidence || []).length} verified demonstrations
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
        <div class="p-3.5 rounded-none bg-surface border border-border flex items-center justify-between gap-4">
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
          <div class="flex items-center gap-3 shrink-0">
            <EvidenceRating rating={4} max={5} />
            <button
              type="button"
              onclick={() => inspectEvidence(item)}
              class="text-xs font-medium text-brand hover:underline shrink-0 cursor-pointer"
            >
              Inspect
            </button>
          </div>
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
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Demonstrated Mastery Rubric</span>
        <div class="p-3 rounded-none bg-surface-subtle border border-border flex items-center justify-between">
          <span class="text-xs text-ink">Rubric Demonstration:</span>
          <EvidenceRating rating={4} max={5} label="Verified" />
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-xs font-medium text-ink-muted uppercase tracking-wider">Source Provenance & Sovereignty</span>
        <div class="p-3 rounded-none bg-surface-subtle border border-border text-xs space-y-1.5">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Source Type:</span>
            <span class="font-medium text-ink font-mono">{inspectedRecord.sourceType}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Date Recorded:</span>
            <span class="font-medium text-ink font-mono">{new Date(inspectedRecord.observedAt).toLocaleDateString()}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Verification Authority:</span>
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
          class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-none bg-surface-subtle hover:bg-surface-raised border border-border text-xs font-medium text-ink transition-colors"
        >
          <span>View in complete capability timeline</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  {/if}
</InspectorPanel>
