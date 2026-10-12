<script lang="ts">
  import {
    Heart,
    ShieldCheck,
    Compass,
    BookOpen,
    Cpu,
    Calendar,
    Sparkles,
    CheckCircle2,
    HelpCircle,
    ArrowRight,
    MessageCircle,
    Info,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { BenchmarkDomain, GlobalBenchmarkReport } from '@core-os/assessment';

  let { data } = $props<{ data: PageData }>();

  let selectedDomain = $state<BenchmarkDomain | null>(null);
  const activeDomain = $derived<BenchmarkDomain>(selectedDomain ?? data.selectedDomain ?? 'stem');
  let openParentTipIndex = $state<number | null>(0);

  const currentReport = $derived<GlobalBenchmarkReport>(
    data.reports.find((r: GlobalBenchmarkReport) => r.domain === activeDomain) || data.activeReport
  );

  const domainTabs: Array<{ id: BenchmarkDomain; label: string; icon: any }> = [
    { id: 'stem', label: 'STEM & Math Reasoning', icon: Compass },
    { id: 'english', label: 'English & Communication', icon: BookOpen },
    { id: 'robotics', label: 'Robotics & Technology', icon: Cpu }
  ];
</script>

<svelte:head>
  <title>Family Growth Guide & Benchmark Report — CREED OS</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-6 pb-20">
  <!-- Top Family Greeting & DPDP Trust Badge -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
          <ShieldCheck class="w-3.5 h-3.5" />
          <span>DPDP Act Verified • Parent Portal</span>
        </span>
        <span class="text-xs text-muted">•</span>
        <span class="text-xs text-muted font-mono">{data.learner.fullName} ({data.learner.gradeBand})</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-foreground">
        Family Diagnostic Guide & International Standing
      </h1>
    </div>

    <!-- Domain selector -->
    <div class="flex items-center gap-1 p-1 bg-surface-raised border border-border rounded-sm">
      {#each domainTabs as tab}
        {@const Icon = tab.icon}
        {@const isActive = activeDomain === tab.id}
        <button
          onclick={() => (selectedDomain = tab.id)}
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer {isActive ? 'bg-foreground text-background shadow-xs' : 'text-muted hover:text-foreground'}"
        >
          <Icon class="w-3.5 h-3.5" />
          <span>{tab.label}</span>
        </button>
      {/each}
    </div>
  </div>

  {#if currentReport}
    <!-- LEVEL 1 — SIGNAL: PLAIN ENGLISH HORIZON & STATUS -->
    <section class="p-6 sm:p-8 bg-surface border border-border rounded-sm space-y-4">
      <div class="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
        <Heart class="w-4 h-4 text-rose-400" />
        <span>Developmental Summary for Parents</span>
      </div>

      <div class="space-y-2">
        <h2 class="text-lg sm:text-xl font-bold text-foreground leading-snug">
          {data.learner.fullName} demonstrates a <span class="text-indigo-400">{currentReport.developmentalBand}</span> in {currentReport.domainTitle}.
        </h2>
        <p class="text-xs sm:text-sm text-muted leading-relaxed">
          In recent 30-question diagnostic benchmarking, your child placed at the <strong>{currentReport.percentileRank}th international percentile</strong>, representing standing within the <strong>top {100 - currentReport.percentileRank}%</strong> of global peers on the {currentReport.scaleName}.
        </p>
      </div>

      <!-- Humanized Score Card Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border">
        <div class="p-3.5 bg-surface-raised border border-border rounded-sm space-y-1">
          <span class="text-[10px] uppercase font-semibold text-muted tracking-wider">International Standing</span>
          <p class="text-base font-bold text-foreground">{currentReport.internationalTier}</p>
          <span class="text-[11px] text-muted block">Equivalent to high school honors placement</span>
        </div>

        <div class="p-3.5 bg-surface-raised border border-border rounded-sm space-y-1">
          <span class="text-[10px] uppercase font-semibold text-muted tracking-wider">Standard Scaled Index</span>
          <p class="text-base font-bold text-indigo-400">{currentReport.scaleFormatted}</p>
          <span class="text-[11px] text-muted block">Against OECD Global Average ({currentReport.globalComparison.oecdAverage})</span>
        </div>

        <div class="p-3.5 bg-surface-raised border border-border rounded-sm space-y-1">
          <span class="text-[10px] uppercase font-semibold text-muted tracking-wider">Learning Posture</span>
          <p class="text-base font-bold text-emerald-400">High Growth Potential</p>
          <span class="text-[11px] text-muted block">Ready for progressive multi-step challenges</span>
        </div>
      </div>
    </section>

    <!-- LEVEL 2 — CONTEXT: WHAT THIS MEANS & HOW TO TALK AT HOME -->
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- What This Means for School & Beyond -->
      <div class="p-6 bg-surface border border-border rounded-sm space-y-4">
        <div class="space-y-1 border-b border-border pb-3">
          <h3 class="text-sm font-bold text-foreground">
            What This Means for School & Competitive Exams
          </h3>
          <p class="text-xs text-muted">Translation into board exams and future career pathways</p>
        </div>

        <div class="space-y-3 text-xs text-muted leading-relaxed">
          <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1.5">
            <span class="font-semibold text-foreground block">Board Examinations (Classes 8–10)</span>
            <p>
              Your child has solid conceptual mastery of standard curriculum prerequisites. Their analytical reasoning handles multi-step problem structures effectively.
            </p>
          </div>

          <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1.5">
            <span class="font-semibold text-foreground block">Targeted Growth Opportunity</span>
            {#if currentReport.identifiedMisconceptions.length > 0}
              <p>
                The primary barrier to top-tier mastery is <strong>{currentReport.identifiedMisconceptions[0].label}</strong>. Rather than drill repetitive questions, they benefit from concrete physical modeling before symbolic math.
              </p>
            {:else}
              <p>
                No core misconceptions identified. Encourage them to tackle independent open-ended synthesis projects.
              </p>
            {/if}
          </div>
        </div>
      </div>

      <!-- At-Home Partnership Guidance -->
      <div class="p-6 bg-surface border border-border rounded-sm space-y-4">
        <div class="space-y-1 border-b border-border pb-3">
          <h3 class="text-sm font-bold text-foreground">
            How You Can Support at Home
          </h3>
          <p class="text-xs text-muted">Nordic Lagom parenting guidelines: support without micromanaging</p>
        </div>

        <div class="space-y-2">
          <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
            <span class="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-indigo-400" />
              <span>Praise Persistence Over Intelligence</span>
            </span>
            <p class="text-xs text-muted leading-relaxed">
              Instead of saying "You are so smart", say "I noticed how you persisted when that circuit did not balance on the first attempt."
            </p>
          </div>

          <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
            <span class="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-indigo-400" />
              <span>Allow 2 Minutes of Productive Struggle</span>
            </span>
            <p class="text-xs text-muted leading-relaxed">
              When they ask "Is this right?", resist giving the answer immediately. Ask them: "What evidence made you choose that option?"
            </p>
          </div>

          <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
            <span class="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-indigo-400" />
              <span>Normalize Errors as Scientific Data</span>
            </span>
            <p class="text-xs text-muted leading-relaxed">
              Mistakes are not failures; in engineering and science, errors are valuable diagnostic feedback.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- DINNER TABLE CONVERSATION STARTERS (4-WEEK COMPANION) -->
    <section class="p-6 sm:p-8 bg-surface border border-border rounded-sm space-y-6">
      <div class="flex items-center justify-between border-b border-border pb-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <MessageCircle class="w-4 h-4 text-indigo-400" />
            <h2 class="text-base font-bold text-foreground">
              Dinner Table Conversations & Family Exploration
            </h2>
          </div>
          <p class="text-xs text-muted">
            Thought-provoking questions to explore together based on your child's active roadmap milestones
          </p>
        </div>
      </div>

      <div class="space-y-3">
        {#each currentReport.actionableRoadmap as milestone, idx}
          {@const isOpen = openParentTipIndex === idx}
          <div class="border border-border rounded-sm overflow-hidden bg-surface-raised">
            <button
              onclick={() => (openParentTipIndex = isOpen ? null : idx)}
              class="w-full p-4 flex items-center justify-between text-left hover:bg-surface transition-colors cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 rounded-sm bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  {milestone.week}
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-semibold text-foreground">
                    Week {milestone.week}: {milestone.title}
                  </h4>
                  <span class="text-[11px] text-muted block">
                    Core Concept: {milestone.focusArea}
                  </span>
                </div>
              </div>

              {#if isOpen}
                <ChevronUp class="w-4 h-4 text-muted" />
              {:else}
                <ChevronDown class="w-4 h-4 text-muted" />
              {/if}
            </button>

            {#if isOpen}
              <div class="p-4 pt-2 border-t border-border bg-surface space-y-3">
                <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-sm space-y-1">
                  <span class="text-[10px] font-semibold uppercase text-indigo-300 tracking-wider block">
                    Question to Ask Your Child This Week
                  </span>
                  <p class="text-xs font-medium text-foreground italic leading-relaxed">
                    "{milestone.primingQuestion}"
                  </p>
                </div>

                <div class="space-y-1 text-xs text-muted">
                  <span class="font-semibold text-foreground text-[11px] block">Simple At-Home Observation Activity:</span>
                  <p class="leading-relaxed">
                    {milestone.recommendedActivities[0]}
                  </p>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </section>

    <!-- DPDP Consent & School Coordination Footer -->
    <div class="p-5 bg-surface border border-border rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-3 text-xs text-muted">
        <ShieldCheck class="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <span class="font-medium text-foreground block">Verified Parental Consent Record Active</span>
          <span class="text-[11px]">DPDP Act 2023 Compliant • Valid for Academic Year 2026–2027</span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <a
          href="/student/report?domain={activeDomain}"
          class="px-4 py-2 text-xs font-medium border border-border hover:bg-surface-raised rounded-sm text-foreground transition-colors cursor-pointer"
        >
          View Technical Student Report
        </a>
      </div>
    </div>
  {:else}
    <div class="p-12 text-center bg-surface border border-border rounded-sm space-y-4">
      <Compass class="w-10 h-10 mx-auto text-muted" />
      <div class="space-y-1">
        <h3 class="text-base font-semibold text-foreground">No Diagnostic Benchmark Reported Yet</h3>
        <p class="text-sm text-muted max-w-md mx-auto">
          When your student completes a benchmark assessment in this domain, their international percentile rank, growth insights, and recommended home activities will appear here.
        </p>
      </div>
      <a
        href="/student/assessment"
        class="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-sm hover:opacity-90 transition-opacity"
      >
        <span>Encourage Assessment Diagnostic</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  {/if}
</div>
