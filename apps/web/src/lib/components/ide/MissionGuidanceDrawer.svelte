<script lang="ts">
  import {
    STEM_MISSIONS,
    evaluateMissionRubric,
    type StemMissionDefinition,
    type PrimmStep,
    type MissionRubricItem
  } from './missionCurriculum';
  import type { AlgorithmicEvaluation } from './competencyEvaluator';
  import {
    CheckCircle2,
    Circle,
    AlertCircle,
    ChevronRight,
    ChevronDown,
    Play,
    RotateCcw,
    Compass,
    Award,
    BookOpen,
    HelpCircle,
    Cpu,
    ExternalLink,
    Check,
    Bot,
    X,
    Filter,
    Target,
    Layers
  } from 'lucide-svelte';
  import { Dialog } from 'bits-ui';


  interface Props {
    activeMissionId: string;
    currentEvaluation: AlgorithmicEvaluation | null;
    roverState?: {
      x: number;
      y: number;
      heading: number;
      distance: number;
      hasCollided?: boolean;
      batteryLevel?: number;
      samplesCollected?: number;
    };
    isVerifying?: boolean;
    verificationResult?: {
      passed: boolean;
      message: string;
      score?: number;
    } | null;
    showMentorModal?: boolean;
    onVerify?: () => void;
    onSelectMission?: (missionId: string) => void;
    onResetWorkspace?: () => void;
  }

  let {
    activeMissionId = 'starter',
    currentEvaluation = null,
    roverState = { x: 100, y: 100, heading: 0, distance: 100, hasCollided: false, batteryLevel: 100, samplesCollected: 0 },
    isVerifying = false,
    verificationResult = null,
    showMentorModal = $bindable(false),
    onVerify,
    onSelectMission,
    onResetWorkspace
  }: Props = $props();

  // Active mission definition
  let mission: StemMissionDefinition = $derived(
    STEM_MISSIONS[activeMissionId] || STEM_MISSIONS.starter
  );

  // Live Rubric Evaluation
  let rubricEval = $derived(
    evaluateMissionRubric(activeMissionId, currentEvaluation, {
      x: roverState?.x ?? 100,
      y: roverState?.y ?? 100,
      batteryLevel: roverState?.batteryLevel ?? 100,
      hasCollided: roverState?.hasCollided ?? false,
      samplesCollected: roverState?.samplesCollected ?? 0
    })
  );

  // Curriculum Modal Dialog State
  let showCurriculumDialog = $state(false);
  let curriculumFilter = $state<'all' | 'preparatory' | 'middle' | 'secondary'>('all');
  let filteredMissions = $derived(
    Object.values(STEM_MISSIONS).filter(
      (m) => curriculumFilter === 'all' || m.stage === curriculumFilter
    )
  );

  // Active PRIMM Step index (0 to 4: Predict, Run, Investigate, Modify, Make)
  let activePrimmIndex = $state(0);
  let completedPrimmSteps = $state<number[]>([]);



  // Track completed PRIMM steps
  function togglePrimmStep(index: number) {
    if (completedPrimmSteps.includes(index)) {
      completedPrimmSteps = completedPrimmSteps.filter((i) => i !== index);
    } else {
      completedPrimmSteps = [...completedPrimmSteps, index];
    }
  }

  // Stage Color / Badge Helpers
  function getStageBadge(stage: 'preparatory' | 'middle' | 'secondary') {
    switch (stage) {
      case 'preparatory':
        return { label: 'Preparatory (Cl 3–5)', color: 'bg-positive-subtle text-positive border-positive/30' };
      case 'middle':
        return { label: 'Middle (Cl 6–8)', color: 'bg-brand-subtle text-brand border-brand/30' };
      case 'secondary':
        return { label: 'Secondary (Cl 9–12)', color: 'bg-ai-subtle text-ai border-ai/30' };
    }
  }
</script>

<aside class="flex flex-col h-full bg-surface select-none overflow-hidden text-ink font-sans">
  <!-- LEVEL 1: SIGNAL HEADER (WAY 2.1 Law 1) -->
  <header class="p-3 border-b border-border bg-surface shrink-0 space-y-2">
    <!-- Row 1: Mission Identity & Criteria Progress in one cohesive line -->
    <div class="flex items-center justify-between gap-1.5">
      <button
        type="button"
        onclick={() => (showCurriculumDialog = true)}
        class="flex items-center gap-1.5 min-w-0 flex-1 hover:opacity-80 transition-micro text-left group cursor-pointer"
        title="Click to browse 10-level STEM mission curriculum"
      >
        <div class="p-1 rounded-sm bg-brand/10 text-brand border border-brand/20 shrink-0">
          <Compass class="size-3.5" />
        </div>
        <div class="flex items-center gap-1.5 min-w-0">
          <h2 class="text-xs font-bold text-ink truncate group-hover:text-brand transition-colors">
            {mission.title}
          </h2>
          <ChevronDown class="size-3 text-ink-muted shrink-0 opacity-60 group-hover:opacity-100" />
        </div>
        <span class="text-[10px] font-mono text-ink-muted shrink-0">L{mission.level}/10</span>
      </button>

      <!-- Live Rubric Progress Chip -->
      <div class="px-2 py-0.5 border border-border rounded-xs bg-surface-subtle font-mono text-[9.5px] shrink-0 flex items-center gap-1 shadow-2xs">
        <strong class={rubricEval.passed ? 'text-positive font-bold' : 'text-attention font-bold'}>
          {rubricEval.completedItems.length}/{rubricEval.totalItems} criteria
        </strong>
      </div>
    </div>

    <!-- Row 2: Level 1 Signal: Primary Mission Directive (Clean, readable, zero truncation) -->
    <div class="flex flex-col gap-1 text-xs text-ink bg-surface-subtle border border-border p-2 rounded-sm shadow-2xs">
      <div class="flex items-center justify-between gap-1">
        <div class="flex items-center gap-1.5">
          <span class="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 border rounded-xs font-semibold {getStageBadge(mission.stage).color}">
            {mission.gradeBracket}
          </span>
          <span class="text-[9px] font-mono text-ink-muted uppercase">Mission Directive</span>
        </div>
        <span class="text-[9px] font-mono text-accent-indigo font-semibold">{mission.cstaStandard}</span>
      </div>
      <p class="text-[11px] leading-relaxed text-ink font-medium pt-0.5">
        {mission.objective}
      </p>
    </div>

    <!-- Row 3: Primary Action Bar (Action-First UX) -->
    <div class="flex items-center gap-1.5">
      <button
        onclick={() => onVerify?.()}
        disabled={isVerifying}
        class="flex-1 px-3 py-1.5 bg-mint hover:bg-mint-hover active:bg-mint-active text-white font-mono text-xs font-bold rounded-sm transition-micro flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50 cursor-pointer"
        title="Deterministically evaluate code and physical telemetry against mission rubric"
      >
        {#if isVerifying}
          <div class="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Verifying Rubric...</span>
        {:else if rubricEval.passed}
          <CheckCircle2 class="size-3.5" />
          <span>Verify & Record Evidence</span>
        {:else}
          <Play class="size-3.5 fill-current" />
          <span>Verify Solution ({rubricEval.completedItems.length}/{rubricEval.totalItems})</span>
        {/if}
      </button>

      <button
        onclick={() => (showMentorModal = true)}
        class="px-3 py-1.5 border border-border hover:bg-surface text-accent-indigo font-mono text-xs font-medium rounded-sm transition-micro flex items-center gap-1 shrink-0 bg-surface shadow-2xs cursor-pointer"
        title="Open Socratic AI Mentor for guided questions without giving away answers"
      >
        <Bot class="size-3.5" />
        <span class="hidden sm:inline">Ask Mentor</span>
      </button>

      <button
        onclick={() => onResetWorkspace?.()}
        class="p-1.5 border border-border hover:bg-surface text-ink-muted hover:text-ink rounded-sm transition-micro shrink-0 bg-surface shadow-2xs cursor-pointer"
        title="Reset workspace blocks to mission starter template"
        aria-label="Reset workspace to mission template"
      >
        <RotateCcw class="size-3.5" />
      </button>
    </div>

    <!-- Feedback Banner if Verification Run -->
    {#if verificationResult}
      <div class="p-1.5 border rounded-xs text-xs font-mono flex items-start gap-1.5 {verificationResult.passed ? 'bg-positive-subtle border-positive/30 text-positive' : 'bg-attention-subtle border-attention/30 text-attention'}">
        {#if verificationResult.passed}
          <CheckCircle2 class="size-3.5 shrink-0 text-positive mt-0.5" />
        {:else}
          <AlertCircle class="size-3.5 shrink-0 text-attention mt-0.5" />
        {/if}
        <div class="flex-1 min-w-0 text-[11px]">
          <span class="font-bold mr-1">{verificationResult.passed ? 'Mission Complete!' : 'Criteria Remaining:'}</span>
          <span class="opacity-90">{verificationResult.message}</span>
        </div>
      </div>
    {/if}
  </header>

  <!-- SCROLLABLE BODY: LEVEL 2 (CONTEXT) & LEVEL 3 (EVIDENCE) -->
  <div class="flex-1 overflow-y-auto p-3 space-y-3">
    <!-- LEVEL 2: CONTEXT & CSTA DISCLOSURE (Progressive Disclosure - Saves 130px) -->
    <details class="group bg-surface-subtle border border-border rounded-sm transition-micro">
      <summary class="flex items-center justify-between p-2 cursor-pointer list-none select-none text-xs font-mono text-ink-muted hover:text-ink">
        <div class="flex items-center gap-1.5 min-w-0">
          <BookOpen class="size-3 text-cyan shrink-0" />
          <span class="font-bold text-[11px] tracking-wide truncate">Context & Scientific Significance</span>
        </div>
        <div class="flex items-center gap-1.5 text-[10px] shrink-0">
          <span class="text-ink-muted font-normal hidden md:inline truncate max-w-36">{mission.cstaStandard}</span>
          <ChevronDown class="size-3 text-ink-muted transition-transform duration-150 group-open:rotate-180" />
        </div>
      </summary>
      <div class="p-2 pt-1 text-xs space-y-2 border-t border-border/50">
        <p class="text-ink leading-relaxed text-[11px]">
          {mission.context}
        </p>
        <div class="pt-1 border-t border-border/50 flex items-start gap-1.5 text-ink-muted text-[11px]">
          <span class="font-semibold text-accent-indigo shrink-0">Why It Matters:</span>
          <span>{mission.whyItMatters}</span>
        </div>
        <div class="text-[10px] font-mono text-ink-muted/80 pt-0.5">
          Standard: <span class="text-ink font-semibold">{mission.cstaStandard}</span>
        </div>
      </div>
    </details>

    <!-- LEVEL 3: PRIMM PEDAGOGY STEPPER (Predict -> Run -> Investigate -> Modify -> Make) -->
    <section class="space-y-1.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
          <Compass class="size-3 text-brand" />
          <span>PRIMM Inquiry Progression</span>
        </div>
        <span class="text-[10px] font-mono text-ink-muted">
          {completedPrimmSteps.length}/5 Completed
        </span>
      </div>

      <!-- PRIMM Step Pill Navigation -->
      <div class="grid grid-cols-5 gap-1 p-1 bg-surface-subtle border border-border rounded-sm text-center">
        {#each mission.primmSteps as step, i}
          <button
            onclick={() => (activePrimmIndex = i)}
            class="py-1 px-0.5 text-[10px] font-mono rounded-xs transition-micro flex flex-col items-center justify-center gap-0.5 {activePrimmIndex === i ? 'bg-surface text-ink font-bold shadow-2xs border border-border' : 'text-ink-muted hover:text-ink'}"
          >
            <span class="truncate w-full">{step.phase}</span>
            {#if completedPrimmSteps.includes(i)}
              <span class="size-1.5 rounded-none bg-positive"></span>
            {:else}
              <span class="size-1.5 rounded-none bg-border"></span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Active PRIMM Step Content -->
      {#if mission.primmSteps[activePrimmIndex]}
        {@const curStep = mission.primmSteps[activePrimmIndex]}
        <div class="p-2 border border-border bg-surface-subtle rounded-sm space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-ink flex items-center gap-1.5">
              <span class="size-4 rounded-xs bg-ai-subtle text-ai text-[10px] font-mono font-bold flex items-center justify-center">
                {activePrimmIndex + 1}
              </span>
              {curStep.title}
            </span>
            <button
              onclick={() => togglePrimmStep(activePrimmIndex)}
              class="px-2 py-0.5 text-[10px] font-mono rounded-xs border transition-micro flex items-center gap-1 {completedPrimmSteps.includes(activePrimmIndex) ? 'bg-positive-subtle border-positive/30 text-positive font-semibold' : 'border-border text-ink-muted hover:text-ink bg-surface'}"
            >
              {#if completedPrimmSteps.includes(activePrimmIndex)}
                <Check class="size-3" /> Step Done
              {:else}
                <Circle class="size-3" /> Mark Done
              {/if}
            </button>
          </div>
          <p class="text-xs text-ink leading-relaxed pl-5">
            {curStep.instruction}
          </p>
        </div>
      {/if}
    </section>

    <!-- LEVEL 3: LIVE RUBRIC EVALUATION CHECKLIST -->
    <section class="space-y-1.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
          <Award class="size-3 text-positive" />
          <span>Algorithmic Rubric Criteria</span>
        </div>
        <span class="text-[10px] font-mono text-ink-muted">
          {rubricEval.completedItems.length}/{mission.rubric.length} Criteria Passed
        </span>
      </div>

      <div class="space-y-1.5">
        {#each mission.rubric as item}
          {@const isPassed = rubricEval.completedItems.includes(item.id)}
          <div class="p-2 border rounded-xs transition-micro flex items-start gap-2 {isPassed ? 'bg-positive-subtle/50 border-positive/30' : 'bg-surface-subtle border-border'}">
            <div class="pt-0.5 shrink-0">
              {#if isPassed}
                <CheckCircle2 class="size-3.5 text-positive" />
              {:else}
                <Circle class="size-3.5 text-ink-muted/50" />
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 text-xs">
                <span class="font-semibold text-ink">
                  {item.label}
                </span>
                {#if isPassed}
                  <span class="px-1.5 py-0.2 rounded-xs bg-positive/10 text-positive border border-positive/30 font-mono text-[9px] font-bold shrink-0">
                    Demonstrated
                  </span>
                {:else}
                  <span class="px-1.5 py-0.2 rounded-xs bg-surface text-ink-muted border border-border font-mono text-[9px] shrink-0">
                    Pending
                  </span>
                {/if}
              </div>
              <p class="text-[11px] text-ink-muted leading-relaxed mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- LEVEL 3: SOCRATIC GUIDANCE & HINT -->
    <section class="p-3 bg-ai-subtle/40 border border-ai/20 rounded-sm space-y-1.5">
      <div class="flex items-center gap-1.5 text-xs font-mono text-ai font-bold">
        <HelpCircle class="size-3.5" />
        <span>Socratic Inquiry Hint</span>
      </div>
      <p class="text-xs text-ink leading-relaxed">
        {mission.socraticHint}
      </p>
      <div class="pt-1 flex items-center justify-between">
        <span class="text-[10px] font-mono text-ink-muted">Need a deeper hint without the answer?</span>
        <button
          onclick={() => (showMentorModal = true)}
          class="text-[11px] font-mono text-accent-indigo hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span>Ask Socratic Mentor</span>
          <ChevronRight class="size-3" />
        </button>
      </div>
    </section>

    <!-- LEVEL 3: STEM CURRICULUM LADDER ACTION CARD -->
    <section class="p-3 border border-border bg-surface-subtle rounded-sm space-y-2">
      <div class="flex items-center justify-between text-xs font-mono">
        <span class="flex items-center gap-1.5 font-bold text-ink uppercase tracking-wider">
          <BookOpen class="size-3.5 text-brand" />
          <span>Curriculum Ladder</span>
        </span>
        <span class="text-[10px] text-ink-muted font-mono">10 Levels</span>
      </div>
      <p class="text-[11px] text-ink-muted leading-relaxed">
        Current: <strong class="text-ink">{mission.title}</strong> (Lvl {mission.level} · {mission.gradeBracket})
      </p>
      <button
        type="button"
        onclick={() => (showCurriculumDialog = true)}
        class="w-full py-1.5 px-3 bg-surface hover:bg-surface-subtle border border-border rounded-sm text-xs font-mono font-medium text-ink transition-micro flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
      >
        <Compass class="size-3.5 text-brand" />
        <span>Browse All 10 STEM Missions...</span>
      </button>
    </section>
  </div>
</aside>

<!-- BITS UI DIALOG: 10-LEVEL STEM MISSION CURRICULUM CATALOG -->
<Dialog.Root bind:open={showCurriculumDialog}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs transition-opacity duration-150" />
    <Dialog.Content class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-surface border border-border rounded-sm shadow-2xl z-50 flex flex-col font-sans select-none overflow-hidden focus-visible:outline-none animate-in fade-in-0 zoom-in-98 duration-150">
      <!-- Modal Header -->
      <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
        <div class="flex items-center gap-2">
          <div class="p-1.5 rounded-sm bg-brand/10 text-brand border border-brand/20">
            <Compass class="size-4" />
          </div>
          <div>
            <Dialog.Title class="text-sm font-bold text-ink">10-Level STEM Robotics Curriculum</Dialog.Title>
            <Dialog.Description class="text-[11px] text-ink-muted font-mono">
              Progressive computational robotics & sensor feedback ladder from Classes 3 to 12
            </Dialog.Description>
          </div>
        </div>
        <button
          onclick={() => (showCurriculumDialog = false)}
          class="p-1.5 rounded-sm hover:bg-surface text-ink-muted hover:text-ink transition-micro cursor-pointer"
          aria-label="Close Curriculum Catalog"
        >
          <X class="size-4" />
        </button>
      </div>

      <!-- Filter Bar -->
      <div class="px-4 py-2 border-b border-border bg-surface flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
        <span class="text-[10px] font-mono text-ink-muted uppercase mr-1 flex items-center gap-1">
          <Filter class="size-3" />
          Stage:
        </span>
        <button
          type="button"
          onclick={() => (curriculumFilter = 'all')}
          class="px-3 py-1 text-xs font-mono rounded-xs transition-micro cursor-pointer {curriculumFilter === 'all' ? 'bg-ink text-canvas font-bold' : 'bg-surface-subtle border border-border text-ink-muted hover:text-ink'}"
        >
          All (10)
        </button>
        <button
          type="button"
          onclick={() => (curriculumFilter = 'preparatory')}
          class="px-3 py-1 text-xs font-mono rounded-xs transition-micro cursor-pointer {curriculumFilter === 'preparatory' ? 'bg-positive text-white font-bold' : 'bg-surface-subtle border border-border text-ink-muted hover:text-ink'}"
        >
          Preparatory (Cl 3–5)
        </button>
        <button
          type="button"
          onclick={() => (curriculumFilter = 'middle')}
          class="px-3 py-1 text-xs font-mono rounded-xs transition-micro cursor-pointer {curriculumFilter === 'middle' ? 'bg-brand text-white font-bold' : 'bg-surface-subtle border border-border text-ink-muted hover:text-ink'}"
        >
          Middle (Cl 6–8)
        </button>
        <button
          type="button"
          onclick={() => (curriculumFilter = 'secondary')}
          class="px-3 py-1 text-xs font-mono rounded-xs transition-micro cursor-pointer {curriculumFilter === 'secondary' ? 'bg-ai text-white font-bold' : 'bg-surface-subtle border border-border text-ink-muted hover:text-ink'}"
        >
          Secondary (Cl 9–12)
        </button>
      </div>

      <!-- Mission List Grid -->
      <div class="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-surface-subtle">
        {#each filteredMissions as m}
          {@const isCurrent = m.id === activeMissionId}
          <div class="p-3 bg-surface border rounded-sm flex flex-col justify-between gap-2 shadow-2xs transition-micro {isCurrent ? 'ring-2 ring-brand border-brand' : 'border-border hover:border-brand/40'}">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 border rounded-xs font-semibold {getStageBadge(m.stage).color}">
                  {m.gradeBracket}
                </span>
                <span class="text-[10px] font-mono text-ink-muted font-bold">Level {m.level}/10</span>
              </div>
              <h3 class="text-xs font-bold text-ink leading-snug">{m.title}</h3>
              <p class="text-[11px] text-ink-muted leading-relaxed line-clamp-2">{m.objective}</p>
            </div>
            <div class="pt-2 border-t border-border flex items-center justify-between gap-2">
              <span class="text-[9.5px] font-mono text-ink-muted truncate max-w-36">{m.cstaStandard}</span>
              <button
                type="button"
                onclick={() => {
                  onSelectMission?.(m.id);
                  showCurriculumDialog = false;
                }}
                class="px-3 py-1 text-xs font-mono rounded-xs transition-micro cursor-pointer {isCurrent ? 'bg-brand/10 text-brand border border-brand/30 font-bold' : 'bg-brand text-white font-semibold hover:bg-brand/90'}"
              >
                {isCurrent ? 'Active Mission' : 'Select Mission'}
              </button>
            </div>
          </div>
        {/each}
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>


