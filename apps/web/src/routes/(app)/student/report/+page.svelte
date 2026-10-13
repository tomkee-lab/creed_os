<script lang="ts">
  import {
    Award,
    TrendingUp,
    Compass,
    BookOpen,
    Cpu,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Calendar,
    Target,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Layers,
    Share2,
    Sparkles
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { BenchmarkDomain, GlobalBenchmarkReport } from '@core-os/assessment';

  let { data } = $props<{ data: PageData }>();

  // State runes
  let selectedDomain = $state<BenchmarkDomain | null>(null);
  const activeDomain = $derived<BenchmarkDomain>(selectedDomain ?? data.selectedDomain ?? 'stem');
  let openRoadmapWeek = $state<number | null>(1);
  let showEvidenceDrawer = $state(false);

  const currentReport = $derived<GlobalBenchmarkReport>(
    data.reports.find((r: GlobalBenchmarkReport) => r.domain === activeDomain) || data.activeReport
  );

  const domainTabs: Array<{ id: BenchmarkDomain; label: string; icon: any }> = [
    { id: 'stem', label: 'STEM & Quantitative', icon: Compass },
    { id: 'english', label: 'English & Rhetoric', icon: BookOpen },
    { id: 'robotics', label: 'Robotics & Systems', icon: Cpu }
  ];
</script>

<svelte:head>
  <title>Student Diagnostic Benchmark Report & Roadmap — CREED OS</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-6 pb-20">
  <!-- Top Header & Domain Navigation -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-ai">
          Learner Intelligence Diagnostic
        </span>
        <span class="text-xs text-foreground-muted">•</span>
        <span class="text-xs text-foreground-muted font-mono">{data.learner.fullName}</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-foreground">
        International Benchmark Report & Growth Roadmap
      </h1>
    </div>

    <!-- Domain Selector Tabs -->
    <div class="flex items-center gap-1 p-1 bg-surface-raised border border-border rounded-sm">
      {#each domainTabs as tab}
        {@const Icon = tab.icon}
        {@const isActive = activeDomain === tab.id}
        <button
          onclick={() => (selectedDomain = tab.id)}
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer {isActive ? 'bg-foreground text-background shadow-xs' : 'text-foreground-muted hover:text-foreground'}"
        >
          <Icon class="w-3.5 h-3.5" />
          <span>{tab.label}</span>
        </button>
      {/each}
    </div>
  </div>

  {#if currentReport}
    <!-- LEVEL 1 — SIGNAL: DEVELOPMENTAL SUMMARY & SCALE STANDINGS -->
    <section class="space-y-4">
      <!-- Developmental Summary Callout (WAY 2.1 Quiet Editorial Intelligence) -->
      <div class="p-5 bg-surface border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-none bg-mint"></span>
            <span class="text-xs font-mono uppercase tracking-wider text-ink-secondary">Developmental Growth Diagnostic</span>
          </div>
          <h2 class="text-lg font-bold text-foreground">
            {currentReport.developmentalBand} · {currentReport.internationalTier}
          </h2>
          <p class="text-xs sm:text-sm text-foreground-secondary max-w-2xl leading-relaxed">
            Performance places this learner in the <strong>{currentReport.percentileRank}th international percentile</strong>, demonstrating authentic strengths with clear, actionable milestones ahead.
          </p>
        </div>

        <a
          href="/student/missions"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-semibold rounded-sm transition-colors shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <span>Start Week 1 Practice</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Standing Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Standard Scale Score -->
        <div class="p-5 bg-surface border border-border rounded-sm space-y-2">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary block">
            Standard Scale Score
          </span>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-foreground tracking-tight font-mono">
              {currentReport.standardScaleScore}
            </span>
            <span class="text-xs text-foreground-secondary font-medium">
              {currentReport.domain === 'english' ? 'Lexile' : currentReport.domain === 'robotics' ? 'RoboScale' : 'Ref Pts'}
            </span>
          </div>
          <p class="text-xs text-foreground-secondary leading-relaxed line-clamp-1">
            {currentReport.scaleName}
          </p>
        </div>

        <!-- Global Percentile -->
        <div class="p-5 bg-surface border border-border rounded-sm space-y-2">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary block">
            International Percentile
          </span>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-extrabold text-positive tracking-tight font-mono">
              {currentReport.percentileRank}th
            </span>
            <span class="text-xs text-positive font-semibold">
              Top {100 - currentReport.percentileRank}%
            </span>
          </div>
          <p class="text-xs text-foreground-secondary leading-relaxed">
            Contextual educational reference (Gate 4 empirical linking pending)
          </p>
        </div>

        <!-- Developmental Band -->
        <div class="p-5 bg-surface border border-border rounded-sm space-y-2">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary block">
            Developmental Tier
          </span>
          <div class="flex items-baseline gap-2">
            <span class="text-xl font-bold text-ai tracking-tight">
              {currentReport.developmentalBand}
            </span>
          </div>
          <p class="text-xs text-foreground-secondary leading-relaxed line-clamp-1">
            Evidence before labeling
          </p>
        </div>

        <!-- International Tier -->
        <div class="p-5 bg-surface border border-border rounded-sm space-y-2">
          <span class="text-[10px] font-semibold uppercase tracking-wider text-ink-secondary block">
            Benchmark Horizon
          </span>
          <div class="flex items-baseline gap-2">
            <span class="text-sm font-bold text-foreground">
              {currentReport.internationalTier}
            </span>
          </div>
          <p class="text-xs text-foreground-secondary leading-relaxed">
            Standard syllabus alignment
          </p>
        </div>
      </div>
    </section>

    <!-- LEVEL 2 — CONTEXT: GLOBAL NORM COMPARISON & QUALITATIVE ANALYSIS -->
    <section class="p-6 bg-surface border border-border rounded-sm space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h2 class="text-sm font-bold text-foreground">
            Global Benchmark Horizon & Normative Calibration
          </h2>
          <p class="text-xs text-muted">
            Comparison against international cohort means (OECD Baseline vs. Top Decile Advanced Threshold)
          </p>
        </div>
        <span class="text-xs font-mono text-muted">
          Delta vs Global Mean: <strong class="{currentReport.globalComparison.deltaVsGlobalMean >= 0 ? 'text-positive' : 'text-attention'}">{currentReport.globalComparison.deltaVsGlobalMean >= 0 ? `+${currentReport.globalComparison.deltaVsGlobalMean}` : currentReport.globalComparison.deltaVsGlobalMean} pts</strong>
        </span>
      </div>

      <!-- Comparative Spectrum Bar -->
      <div class="space-y-2 pt-2">
        <div class="relative w-full h-8 bg-surface-raised border border-border rounded-none overflow-hidden flex items-center px-4">
          <!-- OECD Average Marker -->
          <div
            class="absolute top-0 bottom-0 border-r-2 border-dashed border-attention/60 flex items-center z-10"
            style="left: 45%;"
            title="OECD Global Mean (500 pts)"
          >
            <span class="text-[9px] bg-attention-subtle text-attention font-mono px-1 py-0.5 ml-1">
              Global Mean (500)
            </span>
          </div>

          <!-- Top Decile Marker -->
          <div
            class="absolute top-0 bottom-0 border-r-2 border-dashed border-ai/60 flex items-center z-10"
            style="left: 78%;"
            title="Top Decile Advanced (625 pts)"
          >
            <span class="text-[9px] bg-ai-subtle text-ai font-mono px-1 py-0.5 ml-1">
              Top 10% (625)
            </span>
          </div>

          <!-- Learner Score Fill -->
          <div
            class="h-full bg-linear-to-r from-ai/30 to-ai/80 transition-all duration-200 flex items-center justify-end pr-2"
            style="width: {Math.min(95, Math.max(15, (currentReport.standardScaleScore / 800) * 100))}%"
          >
            <span class="text-xs font-bold text-white font-mono drop-shadow-xs">
              {currentReport.standardScaleScore}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between text-[11px] text-muted">
          <span>Foundational Explorer (300)</span>
          <span>Global Average (500)</span>
          <span>Advanced Master (750+)</span>
        </div>
      </div>
    </section>

    <!-- LEVEL 3 — EVIDENCE: SUB-COMPETENCY BREAKDOWN & MISCONCEPTION AUDIT -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Sub-Competencies Diagnostic Status -->
      <div class="p-6 bg-surface border border-border rounded-sm space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-foreground">
              Sub-Competency Mastery Profile
            </h3>
            <p class="text-xs text-muted">Diagnostic accuracy across core syllabus dimensions</p>
          </div>
          <span class="text-xs text-muted font-mono">{currentReport.subCompetencies.length} Dimensions</span>
        </div>

        <div class="space-y-3">
          {#each currentReport.subCompetencies as comp}
            {@const statusLabel = comp.qualitativeStatus === 'Exceeding' ? 'Exceeding' : comp.qualitativeStatus === 'Secure' ? 'Secure' : comp.qualitativeStatus === 'Developing' ? 'Developing' : 'Focus Area'}
            <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-foreground">{comp.name}</span>
                <span
                  class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-none border {comp.qualitativeStatus === 'Exceeding' ? 'bg-positive-subtle border-positive/30 text-positive' : comp.qualitativeStatus === 'Secure' ? 'bg-mint/15 border-mint/30 text-mint' : comp.qualitativeStatus === 'Developing' ? 'bg-brand/15 border-brand/30 text-brand' : 'bg-attention-subtle border-attention/30 text-attention'}"
                >
                  {statusLabel}
                </span>
              </div>

              <!-- Progress bar -->
              <div class="w-full h-1.5 bg-surface border border-border rounded-none overflow-hidden">
                <div
                  class="h-full bg-ai"
                  style="width: {Math.round(comp.scoreRatio * 100)}%"
                ></div>
              </div>

              <p class="text-[11px] text-foreground-secondary leading-relaxed">
                {comp.evidenceNote}
              </p>
            </div>
          {/each}
        </div>
      </div>

      <!-- Identified Misconceptions & Pedagogical Remedies -->
      <div class="p-6 bg-surface border border-border rounded-sm space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-foreground">
              Diagnosed Focus Areas & Clarifications
            </h3>
            <p class="text-xs text-foreground-secondary">Specific cognitive distinctions identified for practice</p>
          </div>
          <span class="text-xs text-ink-muted font-mono">{currentReport.identifiedMisconceptions.length} Focus Areas</span>
        </div>

        {#if currentReport.identifiedMisconceptions.length === 0}
          <div class="p-6 bg-surface-raised border border-border text-center space-y-2 rounded-sm">
            <CheckCircle2 class="w-6 h-6 text-positive mx-auto" />
            <p class="text-xs font-medium text-foreground">Zero Critical Misconceptions Detected</p>
            <p class="text-[11px] text-foreground-secondary">Responses demonstrated clean conceptual consistency across all distractors.</p>
          </div>
        {:else}
          <div class="space-y-3">
            {#each currentReport.identifiedMisconceptions as misc}
              <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-foreground flex items-center gap-1.5">
                    <AlertCircle class="w-3.5 h-3.5 text-attention" />
                    <span>{misc.label}</span>
                  </span>
                  <span
                    class="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-none bg-attention-subtle text-attention border border-attention/30 font-mono"
                  >
                    Focus Area
                  </span>
                </div>

                <div class="p-2 bg-surface border border-border rounded-sm space-y-1">
                  <span class="text-[10px] font-semibold uppercase text-ai block tracking-wider font-mono">
                    Targeted Pedagogical Remedy
                  </span>
                  <p class="text-xs text-foreground-secondary leading-relaxed">
                    {misc.pedagogicalRemedy}
                  </p>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </section>

    <!-- ACTION-FIRST UX: 4-WEEK DYNAMIC ACTIONABLE ROADMAP -->
    <section class="p-6 sm:p-8 bg-surface border border-border rounded-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Calendar class="w-4 h-4 text-ai" />
            <h2 class="text-base font-bold text-foreground">
              Dynamic 4-Week Actionable Growth Roadmap
            </h2>
          </div>
          <p class="text-xs text-muted">
            Curated developmental milestones tailored to address diagnosed gaps and propel toward the next international tier
          </p>
        </div>

        <a
          href="/student/missions"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-sm transition-colors cursor-pointer"
        >
          <span>Begin Week 1 Challenge</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>

      <!-- Roadmap Milestones Timeline -->
      <div class="space-y-3">
        {#each currentReport.actionableRoadmap as milestone}
          {@const isOpen = openRoadmapWeek === milestone.week}
          <div class="border border-border rounded-sm overflow-hidden bg-surface-raised transition-colors">
            <!-- Header bar -->
            <button
              onclick={() => (openRoadmapWeek = isOpen ? null : milestone.week)}
              class="w-full p-4 flex items-center justify-between text-left hover:bg-surface cursor-pointer transition-colors"
            >
              <div class="flex items-center gap-3">
                <div class="w-7 h-7 rounded-sm bg-foreground text-background flex items-center justify-center font-bold text-xs shrink-0">
                  W{milestone.week}
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-semibold text-foreground">
                    {milestone.title}
                  </h4>
                  <span class="text-[11px] text-foreground-secondary font-medium block mt-0.5">
                    Focus: {milestone.focusArea}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2">
                {#if isOpen}
                  <ChevronUp class="w-4 h-4 text-foreground-secondary" />
                {:else}
                  <ChevronDown class="w-4 h-4 text-foreground-secondary" />
                {/if}
              </div>
            </button>

            <!-- Expanded Details -->
            {#if isOpen}
              <div class="p-4 pt-2 border-t border-border bg-surface space-y-4">
                <!-- Pedagogical Objective -->
                <div class="space-y-1">
                  <span class="text-[10px] font-semibold uppercase text-foreground-secondary tracking-wider block">
                    Core Developmental Objective
                  </span>
                  <p class="text-xs text-foreground font-medium leading-relaxed">
                    {milestone.pedagogicalObjective}
                  </p>
                </div>

                <!-- Recommended Activities List -->
                <div class="space-y-2">
                  <span class="text-[10px] font-semibold uppercase text-foreground-secondary tracking-wider block">
                    Recommended Hands-on Missions & Drills
                  </span>
                  <ul class="space-y-1.5">
                    {#each milestone.recommendedActivities as act}
                      <li class="flex items-start gap-2 text-xs text-foreground-secondary leading-relaxed">
                        <CheckCircle2 class="w-3.5 h-3.5 text-ai shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </li>
                    {/each}
                  </ul>
                </div>

                <!-- Socratic Priming Question -->
                <div class="p-3 bg-ai-subtle border border-ai/20 rounded-sm space-y-1">
                  <div class="flex items-center gap-1.5 text-ai text-[11px] font-semibold">
                    <Sparkles class="w-3.5 h-3.5" />
                    <span>Socratic Priming Question to Ponder</span>
                  </div>
                  <p class="text-xs text-foreground/90 italic leading-relaxed">
                    "{milestone.primingQuestion}"
                  </p>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- Bottom Actions & Retest Options -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-surface border border-border rounded-sm">
      <div class="space-y-0.5 text-center sm:text-left">
        <h4 class="text-xs font-semibold text-foreground">Ready to measure progress again?</h4>
        <p class="text-[11px] text-foreground-secondary">Complete Week 1 activities before retaking the calibrated benchmark.</p>
      </div>

      <div class="flex items-center gap-2">
        <a
          href="/student/assessment"
          class="px-4 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-foreground rounded-sm transition-colors cursor-pointer"
        >
          Retake Calibrated Benchmark (30Q)
        </a>
        <a
          href="/parent/report?domain={activeDomain}"
          class="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-sm transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>Guardian Report View</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  {:else}
    <div class="p-12 text-center bg-surface border border-border rounded-sm space-y-4">
      <Compass class="w-10 h-10 mx-auto text-foreground-secondary" />
      <div class="space-y-1">
        <h3 class="text-base font-semibold text-foreground">No Benchmark Assessment Completed Yet</h3>
        <p class="text-sm text-foreground-secondary max-w-md mx-auto">
          Complete an adaptive diagnostic in this domain to generate an international benchmark report and personalized developmental roadmap.
        </p>
      </div>
      <a
        href="/student/assessment"
        class="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-sm hover:opacity-90 transition-opacity"
      >
        <span>Launch Adaptive Assessment</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  {/if}
</div>
