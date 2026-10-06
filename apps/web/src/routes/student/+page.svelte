<script lang="ts">
  import {
    Activity,
    Compass,
    Sparkles,
    ArrowRight,
    Award,
    CheckCircle2,
    Clock,
    Layers,
    AlertCircle,
    ChevronRight,
    TrendingUp
  } from 'lucide-svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);
  let pathways = $derived(data.pathways);

  // Helper for color coding
  function getScoreBadge(score: number) {
    if (score >= 4.0) return 'text-purple-300 bg-purple-500/10 border-purple-500/30';
    if (score >= 3.4) return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 2.5) return 'text-sky-300 bg-sky-500/10 border-sky-500/30';
    return 'text-amber-300 bg-amber-500/10 border-amber-500/30';
  }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Top Welcome & Status Telemetry -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl glass-panel-elevated">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">My Learning & Future Map</h1>
        <span class="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">Live Graph</span>
      </div>
      <p class="text-sm text-slate-300">
        Continuous longitudinal evidence for <span class="font-semibold text-white">{learner.fullName}</span> • {learner.gradeBand} • {learner.schoolName}
      </p>
    </div>

    <!-- Quick Action Navigation Buttons -->
    <div class="flex items-center gap-3">
      <a
        href="/student/assessment"
        class="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-cyan-500/20"
      >
        <Activity class="w-4 h-4" />
        <span>Take Adaptive CAT</span>
      </a>
      <a
        href="/student/mentor"
        class="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all"
      >
        <Sparkles class="w-4 h-4 text-cyan-400" />
        <span>Ask Socratic AI</span>
      </a>
    </div>
  </div>

  <!-- Active Focus Banner (Constructive Remediation) -->
  <div class="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div class="flex items-start gap-3">
      <div class="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 mt-0.5 sm:mt-0">
        <AlertCircle class="w-5 h-5" />
      </div>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">Active Development Focus</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">Sprint In Progress</span>
        </div>
        <h2 class="text-base font-bold text-white mt-0.5">Quantitative Reasoning: Proportional Equations & Rates</h2>
        <p class="text-xs text-slate-300 mt-1">
          Current Score: <span class="font-mono font-bold text-amber-400">2.8 / 5.0</span> (Developing). Strengthening this foundation unlocks higher readiness in Robotics and Machine Intelligence.
        </p>
      </div>
    </div>

    <a
      href="/student/assessment"
      class="whitespace-nowrap px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors self-end sm:self-center"
    >
      <span>Practice Diagnostic</span>
      <ArrowRight class="w-3.5 h-3.5" />
    </a>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column: Competencies & Evidence Timeline (2 cols on large) -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Competency Matrix -->
      <div class="p-6 rounded-xl glass-panel space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-bold text-white">Demonstrated Competency Graph</h3>
            <p class="text-xs text-slate-400">Derived from 3PL IRT adaptive assessments and verified project missions</p>
          </div>
          <span class="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20">8 Core Dimensions</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {#each Object.entries(learner.competencies) as [key, comp]}
            <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-2 hover:border-cyan-500/30 transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-slate-300">{comp.title}</span>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded border {getScoreBadge(comp.score)}">
                  {comp.descriptor}
                </span>
              </div>
              <div class="flex items-baseline justify-between">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-xl font-bold font-mono text-white">{comp.score.toFixed(1)}</span>
                  <span class="text-[11px] text-slate-400">/ 5.0</span>
                </div>
                <div class="text-[11px] font-mono text-slate-400">
                  θ = {comp.theta > 0 ? '+' : ''}{comp.theta} (SE: {comp.standardError})
                </div>
              </div>
              <!-- Progress Bar -->
              <div class="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500 {comp.score >= 4.0 ? 'bg-purple-400' : comp.score >= 3.4 ? 'bg-emerald-400' : comp.score >= 2.5 ? 'bg-sky-400' : 'bg-amber-400'}"
                  style="width: {(comp.score / 5.0) * 100}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Longitudinal Evidence Timeline -->
      <div class="p-6 rounded-xl glass-panel space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Layers class="w-5 h-5 text-cyan-400" />
            <h3 class="text-lg font-bold text-white">Longitudinal Evidence Stream</h3>
          </div>
          <span class="text-xs font-mono text-slate-400">{evidence.length} Verified Atoms</span>
        </div>

        <div class="space-y-3">
          {#each evidence as item}
            <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-2 hover:border-white/20 transition-colors">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Level {item.evidenceStrength} • {item.sourceType.replace('_', ' ').toUpperCase()}
                  </span>
                  <span class="text-xs font-bold text-white capitalize">{item.competency.replace('_', ' ')}</span>
                </div>
                <span class="text-[11px] font-mono text-slate-400">{new Date(item.observedAt).toLocaleDateString()}</span>
              </div>
              <p class="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
              <div class="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5 font-mono">
                <span>Source: {item.sourceTitle}</span>
                <span class="text-emerald-400">Confidence: {(item.confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Column: Pathway Horizons & Try-Before-You-Choose Experiments -->
    <div class="space-y-8">
      <!-- Pathway Readiness Horizons -->
      <div class="p-6 rounded-xl glass-panel space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Compass class="w-5 h-5 text-cyan-400" />
            <h3 class="text-lg font-bold text-white">Pathway Horizons</h3>
          </div>
          <a href="/student/pathways" class="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>Explore All</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </a>
        </div>

        <div class="space-y-4">
          <!-- Pathway 1: Robotics -->
          <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">Engineering</span>
                <h4 class="text-sm font-bold text-white">Robotics & Autonomous Systems</h4>
              </div>
              <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                74% Readiness
              </span>
            </div>
            <p class="text-xs text-slate-300">
              Strong spatial visualization (+1.0 above req). Foundation gap in quantitative balancing (-0.4).
            </p>
            <div class="pt-2 border-t border-white/5 flex items-center justify-between">
              <span class="text-[11px] text-amber-400 font-mono">Constructive Mismatch Active</span>
              <a href="/student/pathways" class="text-xs text-cyan-400 hover:underline">View Roadmap →</a>
            </div>
          </div>

          <!-- Pathway 2: AI & Data Intelligence -->
          <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">Computing & AI</span>
                <h4 class="text-sm font-bold text-white">Data Intelligence & Machine Learning</h4>
              </div>
              <span class="text-xs font-bold font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/30">
                78% Readiness
              </span>
            </div>
            <p class="text-xs text-slate-300">
              Advanced computational thinking (4.1). Statistical quantitative foundation sprint recommended.
            </p>
            <div class="pt-2 border-t border-white/5 flex items-center justify-between">
              <span class="text-[11px] text-sky-400 font-mono">Sprint Available</span>
              <a href="/student/pathways" class="text-xs text-cyan-400 hover:underline">View Roadmap →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Mission Card -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2">
          <Award class="w-5 h-5 text-purple-400" />
          <h3 class="text-lg font-bold text-white">Applied Project Missions</h3>
        </div>

        {#each learner.completedMissions as mission}
          <div class="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-purple-300">{mission.title}</span>
              <span class="font-mono text-white">Rating: {mission.rating} ★</span>
            </div>
            <p class="text-xs text-slate-300 italic">"{mission.reflectionText}"</p>
            <div class="text-[10px] font-mono text-slate-400 pt-1">
              Completed on {new Date(mission.completedAt).toLocaleDateString()} • Level 4 Project Evidence
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
