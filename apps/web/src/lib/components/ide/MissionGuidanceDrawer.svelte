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
    Sparkles,
    ChevronRight,
    Play,
    RotateCcw,
    Compass,
    Award,
    BookOpen,
    HelpCircle,
    Cpu,
    ExternalLink,
    Check,
    Bot
  } from 'lucide-svelte';
  import SocraticVoiceMentor from '$lib/components/mentor/SocraticVoiceMentor.svelte';

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

  // Active PRIMM Step index (0 to 4: Predict, Run, Investigate, Modify, Make)
  let activePrimmIndex = $state(0);
  let completedPrimmSteps = $state<number[]>([]);

  // Socratic Mentor Modal State
  let showMentorModal = $state(false);

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
        return { label: 'Preparatory (Cl 3–5)', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
      case 'middle':
        return { label: 'Middle (Cl 6–8)', color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30' };
      case 'secondary':
        return { label: 'Secondary (Cl 9–12)', color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30' };
    }
  }
</script>

<aside class="flex flex-col h-full bg-surface select-none overflow-hidden text-ink font-sans">
  <!-- LEVEL 1: SIGNAL HEADER (WAY 2.1 Law 1) -->
  <header class="p-4 border-b border-border bg-surface shrink-0 space-y-2">
    <div class="flex items-center justify-between gap-2 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="text-xl" aria-hidden="true">{mission.icon}</span>
        <div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 border rounded-xs {getStageBadge(mission.stage).color}">
              {mission.gradeBracket}
            </span>
            <span class="text-[10px] font-mono text-ink-muted">Level {mission.level}/10</span>
          </div>
          <h2 class="text-sm font-semibold tracking-tight text-ink mt-0.5">
            {mission.title}
          </h2>
        </div>
      </div>

      <!-- Live Rubric Progress Chip -->
      <div class="flex items-center gap-1.5 font-mono text-xs">
        <div class="px-2 py-0.5 border border-border rounded-xs bg-surface-subtle flex items-center gap-1.5">
          <span class="text-ink-muted">Score:</span>
          <strong class={rubricEval.passed ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
            {rubricEval.score}/{rubricEval.maxScore} ({rubricEval.percentage}%)
          </strong>
        </div>
      </div>
    </div>

    <!-- Level 1 Signal: Primary Mission Objective -->
    <div class="p-2 bg-surface-subtle border border-border rounded-sm space-y-1">
      <div class="flex items-center justify-between text-[11px] font-mono text-ink-muted">
        <span class="font-bold text-ink flex items-center gap-1">
          <Compass class="size-3 text-accent-primary" /> Primary Directive
        </span>
        <span class="text-[10px] text-accent-indigo">DPDP & CSTA Aligned</span>
      </div>
      <p class="text-xs text-ink leading-relaxed">
        {mission.objective}
      </p>
    </div>

    <!-- Primary Action Bar (Action-First UX) -->
    <div class="flex items-center gap-2 pt-1">
      <button
        onclick={() => onVerify?.()}
        disabled={isVerifying}
        class="flex-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono text-xs font-semibold rounded-sm transition-micro flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50"
        title="Deterministically evaluate code and physical telemetry against mission rubric"
      >
        {#if isVerifying}
          <div class="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Verifying Rubric...</span>
        {:else if rubricEval.passed}
          <CheckCircle2 class="size-3.5" />
          <span>Verify Solution & Record Evidence</span>
        {:else}
          <Play class="size-3.5" />
          <span>Verify Solution ({rubricEval.percentage}%)</span>
        {/if}
      </button>

      <button
        onclick={() => (showMentorModal = true)}
        class="px-3 py-1.5 border border-border hover:bg-surface-subtle text-accent-indigo font-mono text-xs rounded-sm transition-micro flex items-center gap-1 shrink-0"
        title="Open Socratic AI Mentor for guided questions without giving away answers"
      >
        <Bot class="size-3.5" />
        <span class="hidden sm:inline">Ask Mentor</span>
      </button>

      <button
        onclick={() => onResetWorkspace?.()}
        class="p-1.5 border border-border hover:bg-surface-subtle text-ink-muted hover:text-ink rounded-sm transition-micro shrink-0"
        title="Reset workspace blocks to mission starter template"
        aria-label="Reset workspace to mission template"
      >
        <RotateCcw class="size-3.5" />
      </button>
    </div>

    <!-- Feedback Banner if Verification Run -->
    {#if verificationResult}
      <div class="p-2 border rounded-xs text-xs font-mono flex items-start gap-2 {verificationResult.passed ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300'}">
        {#if verificationResult.passed}
          <CheckCircle2 class="size-4 shrink-0 text-emerald-500 mt-0.5" />
        {:else}
          <AlertCircle class="size-4 shrink-0 text-amber-500 mt-0.5" />
        {/if}
        <div class="flex-1 min-w-0">
          <div class="font-bold">{verificationResult.passed ? 'Mission Complete!' : 'Criteria Remaining'}</div>
          <p class="text-[11px] opacity-90">{verificationResult.message}</p>
        </div>
      </div>
    {/if}
  </header>

  <!-- SCROLLABLE BODY: LEVEL 2 (CONTEXT) & LEVEL 3 (EVIDENCE) -->
  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    <!-- LEVEL 2: CONTEXT CARD (Why It Matters) -->
    <section class="space-y-1.5">
      <div class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
        <BookOpen class="size-3 text-cyan-500" />
        <span>Context & Scientific Significance</span>
      </div>
      <div class="p-3 bg-surface-subtle border border-border rounded-sm text-xs space-y-2">
        <p class="text-ink leading-relaxed">
          {mission.context}
        </p>
        <div class="pt-1 border-t border-border/60 flex items-start gap-1.5 text-ink-muted text-[11px]">
          <span class="font-semibold text-accent-indigo shrink-0">Why It Matters:</span>
          <span>{mission.whyItMatters}</span>
        </div>
        <div class="text-[10px] font-mono text-ink-muted/80 pt-0.5">
          Standard: <span class="text-ink">{mission.cstaStandard}</span>
        </div>
      </div>
    </section>

    <!-- LEVEL 3: PRIMM PEDAGOGY STEPPER (Predict -> Run -> Investigate -> Modify -> Make) -->
    <section class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
          <Sparkles class="size-3 text-amber-500" />
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
              <span class="size-1.5 rounded-none bg-emerald-500"></span>
            {:else}
              <span class="size-1.5 rounded-none bg-border"></span>
            {/if}
          </button>
        {/each}
      </div>

      <!-- Active PRIMM Step Content -->
      {#if mission.primmSteps[activePrimmIndex]}
        {@const curStep = mission.primmSteps[activePrimmIndex]}
        <div class="p-3 border border-border bg-surface-subtle rounded-sm space-y-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-ink flex items-center gap-1.5">
              <span class="size-5 rounded-xs bg-accent-indigo/15 text-accent-indigo text-[11px] font-mono font-bold flex items-center justify-center">
                {activePrimmIndex + 1}
              </span>
              {curStep.title}
            </span>
            <button
              onclick={() => togglePrimmStep(activePrimmIndex)}
              class="px-2 py-0.5 text-[10.5px] font-mono rounded-xs border transition-micro flex items-center gap-1 {completedPrimmSteps.includes(activePrimmIndex) ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-semibold' : 'border-border text-ink-muted hover:text-ink'}"
            >
              {#if completedPrimmSteps.includes(activePrimmIndex)}
                <Check class="size-3" /> Step Done
              {:else}
                <Circle class="size-3" /> Mark Done
              {/if}
            </button>
          </div>
          <p class="text-xs text-ink leading-relaxed pl-6">
            {curStep.instruction}
          </p>
        </div>
      {/if}
    </section>

    <!-- LEVEL 3: LIVE RUBRIC EVALUATION CHECKLIST -->
    <section class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-ink-muted">
          <Award class="size-3 text-emerald-500" />
          <span>Algorithmic Rubric Criteria</span>
        </div>
        <span class="text-[10px] font-mono text-ink-muted">
          {rubricEval.completedItems.length}/{mission.rubric.length} Criteria Passed
        </span>
      </div>

      <div class="space-y-1.5">
        {#each mission.rubric as item}
          {@const isPassed = rubricEval.completedItems.includes(item.id)}
          <div class="p-2 border rounded-xs transition-micro flex items-start gap-2 {isPassed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-surface-subtle border-border'}">
            <div class="pt-0.5 shrink-0">
              {#if isPassed}
                <CheckCircle2 class="size-3.5 text-emerald-500" />
              {:else}
                <Circle class="size-3.5 text-ink-muted/50" />
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1 text-xs">
                <span class="font-medium {isPassed ? 'text-ink line-through opacity-80' : 'text-ink'}">
                  {item.label}
                </span>
                <span class="font-mono text-[10px] text-ink-muted shrink-0">
                  +{item.points} pts
                </span>
              </div>
              <p class="text-[11px] text-ink-muted leading-tight mt-0.5">
                {item.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
    </section>

    <!-- LEVEL 3: SOCRATIC GUIDANCE & HINT -->
    <section class="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-sm space-y-1.5">
      <div class="flex items-center gap-1.5 text-xs font-mono text-accent-indigo font-bold">
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
          class="text-[11px] font-mono text-accent-indigo hover:underline flex items-center gap-1 font-semibold"
        >
          <span>Ask Socratic Mentor</span>
          <ChevronRight class="size-3" />
        </button>
      </div>
    </section>

    <!-- MISSION CATALOG BROWSER: Quick Switch Across All 10 Levels -->
    <section class="space-y-1.5 pt-2 border-t border-border">
      <div class="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-ink-muted">
        <span class="flex items-center gap-1.5">
          <Cpu class="size-3 text-cyan-500" />
          <span>10-Level STEM Curriculum Ladder</span>
        </span>
        <span class="text-[10px]">Cl 3 to 12</span>
      </div>

      <div class="grid grid-cols-2 gap-1.5 pt-1">
        {#each Object.values(STEM_MISSIONS) as m}
          {@const isCurrent = m.id === activeMissionId}
          <button
            onclick={() => onSelectMission?.(m.id)}
            class="p-2 text-left border rounded-xs transition-micro flex flex-col justify-between {isCurrent ? 'bg-surface border-cyan-500 shadow-2xs' : 'bg-surface-subtle border-border hover:bg-surface'}"
          >
            <div class="flex items-center justify-between gap-1 w-full">
              <span class="text-sm">{m.icon}</span>
              <span class="text-[9px] font-mono text-ink-muted uppercase">{m.stage.slice(0, 4)}</span>
            </div>
            <div class="text-[11px] font-semibold text-ink truncate mt-1">{m.title}</div>
            <div class="text-[9.5px] font-mono text-ink-muted truncate">Lvl {m.level} • {m.gradeBracket.split('•')[0]}</div>
          </button>
        {/each}
      </div>
    </section>
  </div>
</aside>

<!-- Socratic Voice Mentor Modal Dialog -->
{#if showMentorModal}
  <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="w-full max-w-xl bg-surface border border-border shadow-xl rounded-md flex flex-col max-h-[85vh] overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0">
        <div class="flex items-center gap-2">
          <Bot class="size-4 text-accent-indigo" />
          <h3 class="text-sm font-semibold text-ink">
            Socratic Mentor — {mission.title}
          </h3>
        </div>
        <button
          onclick={() => (showMentorModal = false)}
          class="p-1 rounded-xs text-ink-muted hover:text-ink hover:bg-surface-subtle transition-micro"
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 min-h-[380px]">
        <SocraticVoiceMentor
          initialTopic={`Mission ${mission.level}: ${mission.title} (${mission.cstaStandard})`}
        />
      </div>
    </div>
  </div>
{/if}
