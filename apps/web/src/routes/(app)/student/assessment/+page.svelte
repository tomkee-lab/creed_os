<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Activity,
    CheckCircle2,
    ArrowRight,
    AlertCircle,
    Award,
    Clock,
    Loader2,
    Sparkles,
    BookOpen,
    Cpu,
    Compass,
    RotateCcw
  } from 'lucide-svelte';
  import type { ClientAssessmentItem } from '@core-os/domain';
  import type { BenchmarkDomain } from '@core-os/assessment';

  let { data }: { data?: any } = $props();

  const currentLearnerId = $derived(
    (data?.user?.role === 'student' ? (data?.learner?.id || data?.user?.learnerId || data?.user?.id) : null) ||
    data?.learner?.id ||
    '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  );

  // Domain selection state
  let selectedDomain = $state<BenchmarkDomain>('stem');
  let assessmentMode = $state<'benchmark' | 'rapid'>('benchmark');
  let hasStarted = $state(false);
  let showCalibrationDetails = $state(false);

  // Assessment session state
  let sessionId = $state<string | null>(null);
  let status = $state<'idle' | 'loading' | 'active' | 'evaluating' | 'completed' | 'error'>('idle');
  let currentItem = $state<ClientAssessmentItem | null>(null);
  let selectedOptionId = $state<string | null>(null);
  let itemsAnswered = $state(0);
  let errorMessage = $state<string | null>(null);

  // Result state for current question
  let lastEvaluation = $state<{
    isCorrect: boolean;
    explanation: string;
    misconceptionCode?: string;
  } | null>(null);

  // Completion summary
  let completionSummary = $state<{
    itemsCount: number;
    evidenceGeneratedId?: string;
    benchmarkReport?: any;
  } | null>(null);

  const domainConfigs: Record<
    BenchmarkDomain,
    {
      title: string;
      subtitle: string;
      icon: any;
      scaleName: string;
      targetCount: number;
      estimatedMinutes: number;
      description: string;
    }
  > = {
    stem: {
      title: 'Integrated STEM & Quantitative Literacy',
      subtitle: 'PISA Scientific Scale & TIMSS International Benchmarks',
      icon: Compass,
      scaleName: 'PISA Scale (200 - 800)',
      targetCount: 30,
      estimatedMinutes: 25,
      description: 'Physical kinematics, Archimedes buoyancy, stoichiometry, thermodynamics, circuit impedance, and mathematical modeling.'
    },
    english: {
      title: 'Global English & Critical Rhetoric',
      subtitle: 'CEFR Proficiency Tiers (A1–C1) & Lexile Framework',
      icon: BookOpen,
      scaleName: 'Lexile Framework (300L - 1350L)',
      targetCount: 30,
      estimatedMinutes: 25,
      description: 'Syntactic distancing, subject-verb concord, subjunctive clauses, logical fallacies, rhetorical nuance, and academic prose.'
    },
    robotics: {
      title: 'Autonomous Robotics & Physical Computing',
      subtitle: 'CSTA K-12 Computer Science Standards & WRO Readiness',
      icon: Cpu,
      scaleName: 'CSTA Level 1A - 3B',
      targetCount: 30,
      estimatedMinutes: 25,
      description: 'Sensor perception physics, bang-bang vs PID feedback, finite state machines, PWM duty cycles, concurrency, and algorithm efficiency.'
    }
  };

  async function startBenchmarkSession(domain: BenchmarkDomain, mode: 'benchmark' | 'rapid' = 'benchmark') {
    selectedDomain = domain;
    assessmentMode = mode;
    hasStarted = true;
    status = 'loading';
    errorMessage = null;
    lastEvaluation = null;
    selectedOptionId = null;
    completionSummary = null;

    try {
      const res = await fetch('/api/v1/assessments/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerId: currentLearnerId,
          domain,
          mode
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Could not initialize adaptive assessment session');
      }

      const data = await res.json();
      sessionId = data.sessionId;
      currentItem = data.firstItem;
      itemsAnswered = 0;
      status = 'active';
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Failed to start adaptive session';
    }
  }

  async function submitResponse() {
    if (!selectedOptionId || !sessionId || !currentItem || status === 'evaluating') return;

    status = 'evaluating';

    try {
      const res = await fetch(`/api/v1/assessments/sessions/${sessionId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: currentItem.id,
          selectedOptionId,
          timeSpentSeconds: 22
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to evaluate response');
      }

      const data = await res.json();

      lastEvaluation = {
        isCorrect: data.isCorrect,
        explanation: data.explanation,
        misconceptionCode: data.misconceptionCode
      };

      itemsAnswered = data.itemsAnswered;

      if (data.isTestComplete) {
        completionSummary = data.completionSummary || {
          itemsCount: data.itemsAnswered,
          benchmarkReport: data.benchmarkReport
        };
        setTimeout(() => {
          status = 'completed';
        }, 1200);
      } else {
        setTimeout(() => {
          currentItem = data.nextItem;
          selectedOptionId = null;
          lastEvaluation = null;
          status = 'active';
        }, 1400);
      }
    } catch (err: any) {
      status = 'error';
      errorMessage = err.message || 'Failed to record response';
    }
  }

  const currentConfig = $derived(domainConfigs[selectedDomain]);
  const maxQuestionCount = $derived(assessmentMode === 'benchmark' ? 30 : 8);
</script>

<svelte:head>
  <title>Adaptive Benchmark Assessment · CREED OS</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6 pb-16">
  <!-- Top Navigation & Domain Breadcrumbs -->
  <div class="flex items-center justify-between border-b border-border pb-4">
    <div class="space-y-1">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-ink-secondary">
        Diagnostic & Benchmarking Engine
      </span>
      <h1 class="text-xl sm:text-2xl font-bold text-foreground">
        Adaptive Benchmark Assessment
      </h1>
    </div>

    {#if hasStarted && status !== 'idle'}
      <button
        onclick={() => { hasStarted = false; status = 'idle'; }}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-foreground-secondary hover:text-foreground border border-border rounded-sm transition-colors cursor-pointer"
      >
        <RotateCcw class="w-3.5 h-3.5" />
        <span>Change Assessment</span>
      </button>
    {/if}
  </div>

  <!-- STATE 1: DOMAIN SELECTOR SCREEN -->
  {#if !hasStarted || status === 'idle'}
    <div class="space-y-6">
      <!-- Calm Editorial Introduction -->
      <div class="p-5 sm:p-6 bg-surface border border-border rounded-sm space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 text-ai text-xs font-semibold uppercase tracking-wider">
            <Sparkles class="w-4 h-4" />
            <span>Global Standards Calibration</span>
          </div>
          <button
            type="button"
            onclick={() => (showCalibrationDetails = !showCalibrationDetails)}
            class="text-xs text-brand hover:underline cursor-pointer font-medium"
          >
            {showCalibrationDetails ? 'Hide methodology ↑' : 'Assessment methodology ↓'}
          </button>
        </div>

        <div>
          <h2 class="text-lg font-bold text-foreground">
            Select Your Assessment Track
          </h2>
          <p class="text-xs sm:text-sm text-foreground-secondary leading-relaxed max-w-2xl mt-1">
            Standardized evaluations calibrated against international benchmarks to identify demonstrated strengths and targeted focus areas.
          </p>
        </div>

        {#if showCalibrationDetails}
          <div class="pt-3 border-t border-border text-xs text-foreground-secondary space-y-2 animate-in fade-in-0 duration-140">
            <p>
              Each assessment adapts to your learning pace using evidence-backed diagnostic standards. Questions map to national and international frameworks (PISA, TIMSS, CEFR, and CSTA K-12) to generate an authentic growth profile and 4-week practice roadmap.
            </p>
            <div class="flex flex-wrap gap-2 text-[11px] font-mono text-ink-secondary">
              <span class="px-2 py-0.5 bg-surface-raised border border-border">Adaptive Questioning</span>
              <span class="px-2 py-0.5 bg-surface-raised border border-border">Evidence-Based Mastery</span>
              <span class="px-2 py-0.5 bg-surface-raised border border-border">Zero Fixed Ability Labeling</span>
            </div>
          </div>
        {/if}
      </div>

      <!-- Domain Selection Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each (['stem', 'english', 'robotics'] as const) as domain}
          {@const cfg = domainConfigs[domain]}
          {@const Icon = cfg.icon}
          {@const isSelected = selectedDomain === domain}
          <div
            role="button"
            tabindex="0"
            onclick={() => (selectedDomain = domain)}
            onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectedDomain = domain; }}
            class="p-5 bg-surface border transition-all rounded-sm flex flex-col justify-between cursor-pointer {isSelected ? 'border-brand ring-1 ring-brand bg-surface-raised shadow-xs' : 'border-border hover:border-border-strong'}"
          >
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="w-9 h-9 rounded-sm bg-surface-raised border border-border flex items-center justify-center text-foreground">
                  <Icon class="w-5 h-5 text-brand" />
                </div>
                {#if isSelected}
                  <span class="text-[10px] font-mono font-bold px-2 py-0.5 bg-brand-subtle text-brand border border-brand/20 rounded-xs">
                    Selected Track ✓
                  </span>
                {/if}
              </div>

              <div>
                <h3 class="text-sm font-bold text-foreground">{cfg.title}</h3>
                <span class="text-[11px] text-foreground-secondary block mt-0.5 font-medium">{cfg.subtitle}</span>
              </div>
              <p class="text-xs text-foreground-secondary leading-relaxed line-clamp-3">
                {cfg.description}
              </p>
            </div>

            <div class="pt-4 mt-4 border-t border-border space-y-3">
              <div class="flex items-center justify-between text-[11px] text-foreground-secondary font-medium font-mono">
                <span>{cfg.scaleName}</span>
                <span>{cfg.targetCount} Questions</span>
              </div>
              <button
                type="button"
                onclick={(e) => {
                  e.stopPropagation();
                  startBenchmarkSession(domain, 'benchmark');
                }}
                class="w-full min-h-11 py-2 px-3 rounded-sm text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs {isSelected ? 'bg-brand text-brand-foreground hover:bg-brand/90' : 'bg-surface-raised border border-border text-foreground hover:bg-surface-subtle'}"
              >
                <span>Start 30Q Benchmark</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- Secondary Rapid Diagnostic Alternative -->
      <div class="p-4 bg-surface-raised border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-foreground-secondary">
        <div class="space-y-0.5">
          <span class="font-semibold text-foreground">Need a quick checkpoint instead?</span>
          <p class="text-[11px] text-foreground-secondary">The 8-question rapid diagnostic provides an immediate adaptive pulse check in 5 minutes.</p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            onclick={() => startBenchmarkSession(selectedDomain, 'rapid')}
            class="min-h-11 px-4 py-2 border border-border hover:bg-surface hover:text-foreground text-foreground-secondary font-medium text-xs rounded-sm transition-colors cursor-pointer shadow-2xs inline-flex items-center justify-center"
          >
            Launch 8-Question Rapid Diagnostic ↗
          </button>
        </div>
      </div>
    </div>

  <!-- STATE 2: LOADING -->
  {:else if status === 'loading'}
    <div class="p-16 bg-surface border border-border rounded-none text-center space-y-4">
      <Loader2 class="w-8 h-8 text-ai animate-spin mx-auto" />
      <div class="space-y-1">
        <p class="text-sm font-medium text-foreground">Calibrating Diagnostic Session...</p>
        <p class="text-xs text-foreground-secondary">Loading standard item models for {currentConfig.title}</p>
      </div>
    </div>

  <!-- STATE 3: ERROR -->
  {:else if status === 'error'}
    <div class="p-8 bg-surface border-l-4 border-l-critical border border-border rounded-none text-center space-y-4">
      <AlertCircle class="w-8 h-8 text-critical mx-auto" />
      <p class="text-sm font-medium text-foreground max-w-lg mx-auto">{errorMessage}</p>
      {#if errorMessage?.includes('parental consent') || errorMessage?.includes('DPDP')}
        <div class="flex items-center justify-center gap-3 pt-2">
          <a
            href="/consent"
            class="px-4 py-2 bg-brand text-brand-foreground text-xs font-semibold rounded-sm hover:bg-brand/90 transition-colors cursor-pointer shadow-xs"
          >
            Obtain Parental Consent ↗
          </a>
          <button
            onclick={() => startBenchmarkSession(selectedDomain, assessmentMode)}
            class="px-4 py-2 border border-border bg-surface text-ink text-xs font-medium rounded-sm cursor-pointer hover:bg-surface-subtle transition-colors"
          >
            Retry Session
          </button>
        </div>
      {:else}
        <button
          onclick={() => startBenchmarkSession(selectedDomain, assessmentMode)}
          class="px-4 py-2 bg-foreground text-background text-xs font-medium rounded-sm cursor-pointer hover:bg-foreground/90 transition-colors"
        >
          Retry Session
        </button>
      {/if}
    </div>

  <!-- STATE 4: COMPLETED SUMMARY -->
  {:else if status === 'completed'}
    <div class="p-8 sm:p-10 bg-surface border border-border rounded-none space-y-8">
      <div class="text-center space-y-3">
        <div class="w-14 h-14 bg-positive-subtle text-positive flex items-center justify-center mx-auto border border-positive/20 rounded-sm">
          <Award class="w-7 h-7" />
        </div>
        <span class="text-xs font-semibold uppercase tracking-wider text-positive block">
          Assessment Complete & Recorded
        </span>
        <h2 class="text-2xl font-bold text-foreground">
          {currentConfig.title}
        </h2>
        <p class="text-sm text-foreground-secondary max-w-md mx-auto leading-relaxed">
          Your responses have been processed through our diagnostic assessment engine. Your curriculum standings and growth roadmap are ready.
        </p>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 border-y border-border py-6">
        <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-1">
          <span class="text-[10px] uppercase font-semibold text-foreground-secondary tracking-wider">Demonstrated Level</span>
          <p class="text-lg font-bold text-foreground">
            {completionSummary?.benchmarkReport?.internationalTier || 'Foundational Competency'}
          </p>
          <span class="text-xs text-foreground-secondary block">
            {completionSummary?.benchmarkReport?.scaleName || 'Standard Framework'}
          </span>
        </div>

        <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-1">
          <span class="text-[10px] uppercase font-semibold text-foreground-secondary tracking-wider">Diagnostic Evidence</span>
          <p class="text-lg font-bold text-positive">
            {completionSummary?.itemsCount ? `${completionSummary.itemsCount} Items Verified` : 'Demonstration Verified'}
          </p>
          <span class="text-xs text-foreground-secondary block">Formative Portfolio Evidence</span>
        </div>

        <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-1">
          <span class="text-[10px] uppercase font-semibold text-foreground-secondary tracking-wider">Developmental Band</span>
          <p class="text-lg font-bold text-ai">
            {completionSummary?.benchmarkReport?.developmentalBand || 'Developing Foundation'}
          </p>
          <span class="text-xs text-foreground-secondary block">Qualitative Mastery</span>
        </div>
      </div>

      <!-- Action Primacy CTAs -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href="/student/growth?tab=report&domain={selectedDomain}"
          class="w-full sm:w-auto px-6 py-2 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-xs sm:text-sm rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <span>View Full International Report & 4-Week Roadmap</span>
          <ArrowRight class="w-4 h-4" />
        </a>

        <button
          onclick={() => { hasStarted = false; status = 'idle'; }}
          class="w-full sm:w-auto px-5 py-2 border border-border hover:bg-surface-raised text-foreground-secondary hover:text-foreground text-xs sm:text-sm rounded-sm transition-colors cursor-pointer"
        >
          Select Another Track
        </button>
      </div>
    </div>

  <!-- STATE 5: ACTIVE ASSESSMENT RUNNER -->
  {:else if currentItem}
    <div class="p-6 sm:p-8 bg-surface border border-border rounded-none space-y-6">
      <!-- Question Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold px-2 py-0.5 bg-surface-raised border border-border rounded-none uppercase text-ink-secondary">
            {currentConfig.title}
          </span>
          <span class="text-xs text-ink-muted font-mono">{currentItem.code}</span>
        </div>

        <div class="flex items-center gap-3 text-xs text-foreground-secondary">
          <span>Question <strong>{itemsAnswered + 1}</strong> of {maxQuestionCount}</span>
          <div class="w-24 h-1.5 bg-surface-raised border border-border rounded-none overflow-hidden">
            <div
              class="h-full bg-ai transition-all duration-200"
              style="width: {Math.min(100, Math.round(((itemsAnswered + 1) / maxQuestionCount) * 100))}%"
            ></div>
          </div>
        </div>
      </div>

      <!-- Stimulus Image if present -->
      {#if currentItem.stimulusUrl}
        <div class="border border-border p-2 bg-surface-raised rounded-none">
          <img
            src={currentItem.stimulusUrl}
            alt="Question Diagram"
            class="max-h-48 mx-auto object-contain"
          />
        </div>
      {/if}

      <!-- Prompt Text -->
      <div class="space-y-2">
        <p class="text-base sm:text-lg font-medium text-foreground leading-relaxed">
          {currentItem.prompt}
        </p>
      </div>

      <!-- Options List (4px tactile surfaces) -->
      <div class="space-y-2 pt-2">
        {#each currentItem.options as opt}
          <button
            type="button"
            disabled={status === 'evaluating'}
            onclick={() => (selectedOptionId = opt.id)}
            class="w-full text-left p-4 rounded-sm border transition-colors flex items-center justify-between cursor-pointer {selectedOptionId === opt.id ? 'border-brand bg-brand-subtle/50 text-foreground font-medium ring-1 ring-brand' : 'border-border bg-surface-raised hover:bg-surface text-foreground-secondary hover:text-foreground'}"
          >
            <span class="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
            <div class="w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 ml-3 {selectedOptionId === opt.id ? 'border-ai bg-ai' : 'border-border'}">
              {#if selectedOptionId === opt.id}
                <div class="w-1.5 h-1.5 bg-white rounded-none"></div>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <!-- Socratic Learning Feedback -->
      {#if lastEvaluation}
        <div class="p-4 rounded-sm border transition-colors {lastEvaluation.isCorrect ? 'bg-positive-subtle border-positive/30 text-positive' : 'bg-attention-subtle border-attention/30 text-attention'} space-y-1">
          <div class="flex items-center gap-2 text-xs font-semibold">
            {#if lastEvaluation.isCorrect}
              <CheckCircle2 class="w-4 h-4 text-positive" />
              <span>Accurate analytical deduction</span>
            {:else}
              <AlertCircle class="w-4 h-4 text-attention" />
              <span>Conceptual clarification:</span>
            {/if}
          </div>
          <p class="text-xs text-foreground/80 leading-relaxed">{lastEvaluation.explanation}</p>
        </div>
      {/if}

      <!-- Action Button -->
      {#if !lastEvaluation}
        <div class="pt-4 flex items-center justify-end">
          <button
            onclick={submitResponse}
            disabled={!selectedOptionId || status === 'evaluating'}
            class="w-full sm:w-auto min-h-11 px-6 py-2 rounded-sm bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none font-medium text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Confirm Answer</span>
            <ArrowRight class="w-4 h-4" />
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>
