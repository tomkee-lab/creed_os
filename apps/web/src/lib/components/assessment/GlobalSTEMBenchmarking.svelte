<script lang="ts">
  import {
    Award,
    Trophy,
    TrendingUp,
    Compass,
    Sliders,
    Play,
    RotateCcw,
    Activity,
    Layers,
    CheckCircle2,
    Clock,
    Zap,
    ExternalLink,
    HelpCircle,
    BarChart3
  } from 'lucide-svelte';
  import {
    GLOBAL_COMPETITION_BENCHMARKS,
    NIST_TC_PEBRAS_TASKS,
    evaluateNistRoboticsBenchmark,
    type CompetitionEcosystemId,
    type NistTaskType,
    type RobotRunTrial,
    type BenchmarkEvaluationResult
  } from '@core-os/assessment';

  // Selected State
  let selectedCompetitionId = $state<CompetitionEcosystemId>('fll');
  let selectedTaskId = $state<NistTaskType>('line_tracking_autonomy');
  let isSimulating = $state(false);

  // Active definition lookups
  let currentCompetition = $derived(GLOBAL_COMPETITION_BENCHMARKS[selectedCompetitionId]);
  let currentTask = $derived(NIST_TC_PEBRAS_TASKS[selectedTaskId]);

  // Recorded robot run trials
  let trials = $state<RobotRunTrial[]>([
    {
      trialIndex: 1,
      taskType: 'line_tracking_autonomy',
      success: true,
      durationSec: 23.4,
      trajectoryDeviationsMm: [1.2, 2.1, 0.8, 1.5],
      collisionsCount: 0,
      telemetryDataPoints: 468
    },
    {
      trialIndex: 2,
      taskType: 'line_tracking_autonomy',
      success: true,
      durationSec: 22.8,
      trajectoryDeviationsMm: [0.9, 1.4, 0.7, 1.1],
      collisionsCount: 0,
      telemetryDataPoints: 456
    },
    {
      trialIndex: 3,
      taskType: 'line_tracking_autonomy',
      success: true,
      durationSec: 21.9,
      trajectoryDeviationsMm: [1.0, 1.2, 0.5, 0.9],
      collisionsCount: 0,
      telemetryDataPoints: 438
    }
  ]);

  // Deterministic evaluation result
  let evaluationResult = $derived(
    evaluateNistRoboticsBenchmark(trials, selectedCompetitionId, selectedTaskId)
  );

  // Simulate a new trial execution
  function addTrial() {
    isSimulating = true;
    setTimeout(() => {
      const baseTarget = currentTask.standardTargetTimeSec;
      const noise = (Math.random() - 0.45) * 4.0;
      const duration = Math.max(10.0, Math.round((baseTarget + noise) * 10) / 10);
      const success = Math.random() < 0.92;
      const collisions = success ? 0 : 1;

      trials = [
        ...trials,
        {
          trialIndex: trials.length + 1,
          taskType: selectedTaskId,
          success,
          durationSec: duration,
          trajectoryDeviationsMm: [
            Math.round(Math.random() * 20) / 10,
            Math.round(Math.random() * 25) / 10
          ],
          collisionsCount: collisions,
          telemetryDataPoints: Math.round(duration * 20)
        }
      ];
      isSimulating = false;
    }, 400);
  }

  function resetTrials() {
    trials = [];
  }

  // Preset switch
  function handleCompetitionChange(compId: CompetitionEcosystemId) {
    selectedCompetitionId = compId;
  }

  function handleTaskChange(taskId: NistTaskType) {
    selectedTaskId = taskId;
    // Reset or filter trials to match task
    trials = [
      {
        trialIndex: 1,
        taskType: taskId,
        success: true,
        durationSec: Math.round((currentTask.standardTargetTimeSec + 1.2) * 10) / 10,
        trajectoryDeviationsMm: [1.2, 1.8],
        collisionsCount: 0,
        telemetryDataPoints: 420
      }
    ];
  }

  // Band styles
  const bandConfig = {
    'Advanced Master': {
      color: 'text-mint',
      bg: 'bg-mint/10',
      border: 'border-mint/30',
      badge: 'Elite Qualifier Level'
    },
    'Competent Practitioner': {
      color: 'text-cyan',
      bg: 'bg-cyan/10',
      border: 'border-cyan/30',
      badge: 'Tournament Standard'
    },
    'Developing Foundation': {
      color: 'text-brand',
      bg: 'bg-brand/10',
      border: 'border-brand/30',
      badge: 'Targeted Scaffolding'
    },
    'Emergent Explorer': {
      color: 'text-attention',
      bg: 'bg-attention/10',
      border: 'border-attention/30',
      badge: 'Exploration Phase'
    }
  };
</script>

<div class="flex flex-col border border-border bg-surface text-ink w-full p-0 font-sans shadow-xs rounded-none overflow-hidden">
  <!-- Header: Signal & Level 1 Overview -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-border bg-surface-subtle gap-4">
    <div class="flex items-center gap-3">
      <div class="p-2 bg-brand/10 border border-brand/20 rounded-none text-brand">
        <Trophy class="size-5" />
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-base font-bold uppercase tracking-wider text-ink font-mono">
            Global STEM & Robotics Benchmarking
          </h2>
          <span class="text-[10px] font-mono px-2 py-0.5 bg-surface border border-border text-ink-muted">
            IEEE RAS TC-PEBRAS / NIST
          </span>
        </div>
        <p class="text-xs text-ink-secondary mt-0.5">
          Objective task board evaluation • Two-Sample Kolmogorov-Smirnov Test • One-Way ANOVA Normative Contrast
        </p>
      </div>
    </div>

    <!-- Active Band Status Pill -->
    <div class="inline-flex items-center gap-2 px-3 py-1.5 border {bandConfig[evaluationResult.developmentalBand].border} {bandConfig[evaluationResult.developmentalBand].bg} self-start sm:self-auto">
      <span class="size-2 bg-current {bandConfig[evaluationResult.developmentalBand].color}"></span>
      <div class="flex flex-col">
        <span class="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Developmental Band</span>
        <span class="text-xs font-bold font-mono {bandConfig[evaluationResult.developmentalBand].color}">
          {evaluationResult.developmentalBand}
        </span>
      </div>
    </div>
  </div>

  <!-- Primary Controls Grid: Ecosystem & NIST Task Selection -->
  <div class="p-4 sm:p-6 border-b border-border bg-surface grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Left: Competition Ecosystem Selector -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label for="competition-select" class="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-2">
          <Award class="size-4 text-brand" />
          Competition Ecosystem
        </label>
        <span class="text-[11px] font-mono text-ink-muted">
          {currentCompetition.region} · {currentCompetition.targetClasses}
        </span>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {#each Object.values(GLOBAL_COMPETITION_BENCHMARKS) as comp}
          <button
            onclick={() => handleCompetitionChange(comp.id)}
            class="px-3 py-2 text-left text-xs font-mono border transition-micro {selectedCompetitionId === comp.id
              ? 'bg-brand text-brand-foreground font-bold border-brand shadow-2xs'
              : 'bg-surface-subtle border-border text-ink hover:border-border-strong hover:bg-surface'}"
          >
            <div class="truncate font-semibold">{comp.id.toUpperCase()}</div>
            <div class="text-[10px] opacity-80 truncate">{comp.name.split('(')[0]}</div>
          </button>
        {/each}
      </div>

      <!-- Competition Overview Box -->
      <div class="p-3.5 border border-border bg-surface-subtle text-xs space-y-1.5">
        <div class="font-bold text-ink">{currentCompetition.name}</div>
        <p class="text-ink-secondary text-[11px] leading-relaxed">
          {currentCompetition.coreFocus}
        </p>
        <div class="pt-1 flex flex-wrap gap-2 text-[10px] font-mono text-ink-muted">
          <span>Organizer: {currentCompetition.organizer}</span>
          <span>•</span>
          <span>Baseline Time: ~{currentCompetition.normativeExecutionTimeSec.mean}s</span>
          <span>•</span>
          <span>Qualifier Pass: {Math.round(currentCompetition.normativeSuccessRate * 100)}%</span>
        </div>
      </div>
    </div>

    <!-- Right: NIST TC-PEBRAS Standard Task Board Task -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <label for="nist-task-select" class="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-2">
          <Layers class="size-4 text-mint" />
          NIST Standard Test Method
        </label>
        <span class="text-[11px] font-mono text-mint">
          Category: {currentTask.category}
        </span>
      </div>

      <div class="flex flex-col gap-2">
        {#each Object.values(NIST_TC_PEBRAS_TASKS) as task}
          <button
            onclick={() => handleTaskChange(task.id)}
            class="px-3 py-2 text-left text-xs font-mono border transition-micro flex items-center justify-between {selectedTaskId === task.id
              ? 'bg-surface-raised border-mint text-mint font-bold shadow-2xs'
              : 'bg-surface-subtle border-border text-ink hover:border-border-strong hover:bg-surface'}"
          >
            <div class="flex flex-col">
              <span>{task.title}</span>
              <span class="text-[10px] text-ink-muted font-normal">Tolerance: ±{task.toleranceMm}mm · Target: {task.standardTargetTimeSec}s</span>
            </div>
            <span class="text-[10px] px-1.5 py-0.5 border border-border bg-surface text-ink-muted">
              {task.category}
            </span>
          </button>
        {/each}
      </div>

      <!-- Trial Execution Action Bar -->
      <div class="flex items-center justify-between pt-2">
        <div class="flex items-center gap-2">
          <button
            onclick={addTrial}
            disabled={isSimulating}
            class="inline-flex items-center gap-1.5 px-3 py-1.5 border border-brand bg-brand text-brand-foreground text-xs font-mono font-bold hover:bg-brand/90 cursor-pointer disabled:opacity-50 transition-micro shadow-2xs"
          >
            <Play class="size-3.5 fill-current" />
            <span>{isSimulating ? 'Executing Run...' : 'Execute Robot Trial'}</span>
          </button>

          <button
            onclick={resetTrials}
            class="inline-flex items-center gap-1 px-3 py-1.5 border border-border bg-surface text-ink-secondary text-xs font-mono hover:text-ink hover:bg-surface-subtle transition-micro"
          >
            <RotateCcw class="size-3" />
            <span>Reset</span>
          </button>
        </div>

        <span class="text-xs font-mono text-ink-muted">
          {trials.length} Recorded Runs
        </span>
      </div>
    </div>
  </div>

  <!-- Benchmarking Diagnostics & Statistical Evidence (Level 2 & 3) -->
  <div class="p-4 sm:p-6 bg-surface-subtle space-y-6">
    <!-- Key Metric Readout Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- Percentile Rank -->
      <div class="p-4 border border-border bg-surface space-y-1 shadow-2xs">
        <span class="text-[10px] font-mono text-ink-muted uppercase">Global Peer Standing</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-mono font-bold text-mint">
            {evaluationResult.percentileRank}th
          </span>
          <span class="text-[11px] font-mono text-ink-muted">percentile</span>
        </div>
        <div class="w-full bg-surface-overlay h-1 mt-2">
          <div
            class="bg-mint h-1 transition-all duration-200"
            style="width: {evaluationResult.percentileRank}%"
          ></div>
        </div>
      </div>

      <!-- Autonomous Success Rate -->
      <div class="p-4 border border-border bg-surface space-y-1 shadow-2xs">
        <span class="text-[10px] font-mono text-ink-muted uppercase">Autonomous Success Rate</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-mono font-bold text-cyan">
            {Math.round(evaluationResult.successRate * 100)}%
          </span>
          <span class="text-[11px] font-mono text-ink-muted">completion</span>
        </div>
        <p class="text-[10px] text-ink-muted font-mono mt-1">
          Cohort Norm: {Math.round(currentTask.globalCohortSuccessRate * 100)}%
        </p>
      </div>

      <!-- Median Execution Time -->
      <div class="p-4 border border-border bg-surface space-y-1 shadow-2xs">
        <span class="text-[10px] font-mono text-ink-muted uppercase">Median Run Duration</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-mono font-bold text-brand">
            {evaluationResult.medianDurationSec}s
          </span>
          <span class="text-[11px] font-mono text-ink-muted">±{evaluationResult.stdevDurationSec}s</span>
        </div>
        <p class="text-[10px] text-ink-muted font-mono mt-1">
          NIST Target: {currentTask.standardTargetTimeSec}s
        </p>
      </div>

      <!-- Repeatability StDev -->
      <div class="p-4 border border-border bg-surface space-y-1 shadow-2xs">
        <span class="text-[10px] font-mono text-ink-muted uppercase">Kinematic Repeatability</span>
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl sm:text-3xl font-mono font-bold text-ink">
            {evaluationResult.stdevDurationSec < 1.5 ? 'High' : 'Moderate'}
          </span>
          <span class="text-[11px] font-mono text-ink-muted">jitter</span>
        </div>
        <p class="text-[10px] text-ink-muted font-mono mt-1">
          ANOVA: {evaluationResult.anovaComparison.isSignificant ? 'Differentiated' : 'Consistent'}
        </p>
      </div>
    </div>

    <!-- Evidence Disclosure Section (Two Columns) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left: Qualitative Narrative & Rubric Dimensions -->
      <div class="p-5 border border-border bg-surface space-y-4 shadow-2xs">
        <div class="space-y-1">
          <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-2">
            <CheckCircle2 class="size-4 text-mint" />
            Qualitative Developmental Growth Evidence
          </h3>
          <p class="text-xs text-ink leading-relaxed font-sans">
            {evaluationResult.qualitativeSummary}
          </p>
        </div>

        <!-- Competition Rubric Alignment -->
        <div class="space-y-2 pt-2 border-t border-border">
          <span class="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            {currentCompetition.name} Core Rubric Mapping
          </span>
          <div class="space-y-2">
            {#each currentCompetition.rubricCriteria as rubric}
              <div class="p-2 border border-border bg-surface-subtle space-y-1 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-ink font-mono">{rubric.dimension}</span>
                  <span class="text-[10px] font-mono text-brand font-bold">{Math.round(rubric.weight * 100)}% Weight</span>
                </div>
                <p class="text-[11px] text-ink-secondary">{rubric.description}</p>
              </div>
            {/each}
          </div>
        </div>

        <!-- Evidence Tags for Graph Ingestion -->
        <div class="pt-2 flex flex-wrap gap-1.5">
          {#each evaluationResult.evidenceTags as tag}
            <span class="text-[10px] font-mono px-2 py-0.5 border border-border bg-surface-subtle text-ink-muted">
              {tag}
            </span>
          {/each}
        </div>
      </div>

      <!-- Right: Rigorous IEEE RAS TC-PEBRAS Statistical Tests -->
      <div class="p-5 border border-border bg-surface space-y-4 shadow-2xs">
        <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-ink-secondary flex items-center gap-2">
          <BarChart3 class="size-4 text-brand" />
          Deterministic Statistical Modeling
        </h3>

        <!-- Kolmogorov-Smirnov Test Readout -->
        <div class="p-3.5 border border-border bg-surface-subtle space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold font-mono text-ink">Two-Sample Kolmogorov-Smirnov Test</span>
            <span class="text-xs font-mono font-bold text-mint">
              D = {evaluationResult.kolmogorovSmirnovTest.value} (p = {evaluationResult.kolmogorovSmirnovTest.pValueApprox})
            </span>
          </div>
          <p class="text-[11px] text-ink-secondary leading-relaxed">
            {evaluationResult.kolmogorovSmirnovTest.interpretation}
          </p>
          <div class="text-[10px] font-mono text-ink-muted">
            Empirical CDF contrast: {trials.length} student trials vs {currentTask.globalCohortTimes.length} TC-PEBRAS baseline trials.
          </div>
        </div>

        <!-- One-Way ANOVA Test Readout -->
        <div class="p-3.5 border border-border bg-surface-subtle space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold font-mono text-ink">One-Way Analysis of Variance (ANOVA)</span>
            <span class="text-xs font-mono font-bold text-cyan">
              F = {evaluationResult.anovaComparison.value} (p = {evaluationResult.anovaComparison.pValueApprox})
            </span>
          </div>
          <p class="text-[11px] text-ink-secondary leading-relaxed">
            {evaluationResult.anovaComparison.interpretation}
          </p>
          <div class="text-[10px] font-mono text-ink-muted">
            Separates systematic engineering skill from stochastic track friction or battery drain.
          </div>
        </div>

        <!-- Trial Log Table -->
        <div class="space-y-1.5 pt-1">
          <span class="text-[11px] font-mono uppercase tracking-wider text-ink-muted">
            Recent Run History ({trials.length} Trials)
          </span>
          <div class="border border-border max-h-36 overflow-y-auto">
            <table class="w-full text-left text-xs font-mono border-collapse">
              <thead class="bg-surface-subtle border-b border-border text-[10px] text-ink-muted">
                <tr>
                  <th class="p-1.5">#</th>
                  <th class="p-1.5">Status</th>
                  <th class="p-1.5">Time</th>
                  <th class="p-1.5">Jitter (mm)</th>
                  <th class="p-1.5">Telemetry Pts</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border text-[11px]">
                {#each trials as trial}
                  <tr class="hover:bg-surface-subtle/50">
                    <td class="p-1.5 font-bold">{trial.trialIndex}</td>
                    <td class="p-1.5">
                      {#if trial.success}
                        <span class="text-mint font-semibold">PASS</span>
                      {:else}
                        <span class="text-attention font-semibold">FAIL</span>
                      {/if}
                    </td>
                    <td class="p-1.5">{trial.durationSec}s</td>
                    <td class="p-1.5">±{trial.trajectoryDeviationsMm[0]}</td>
                    <td class="p-1.5 text-ink-muted">{trial.telemetryDataPoints}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
