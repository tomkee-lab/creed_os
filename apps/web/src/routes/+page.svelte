<script lang="ts">
  import {
    Activity,
    Compass,
    Shield,
    Users,
    GraduationCap,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Layers,
    Cpu,
    Target
  } from 'lucide-svelte';

  let { data } = $props();
</script>

<div class="relative overflow-hidden py-12 lg:py-20">
  <!-- Subtle Aurora Glow Background -->
  <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl -z-10 pointer-events-none"></div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
    <!-- Hero Section -->
    <div class="text-center max-w-3xl mx-auto space-y-6">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-mono">
        <Sparkles class="w-3.5 h-3.5 text-cyan-400" />
        <span>AI-Native Learner Intelligence & Navigation OS</span>
      </div>

      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
        Measure deeply.<br />
        <span class="bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
          Decide with evidence.
        </span>
      </h1>

      <p class="text-lg text-slate-300 leading-relaxed">
        We do not decide a child’s future or rank them with an IQ number. Core_OS maintains a longitudinal evidence graph, continuously connecting adaptive psychometric diagnostics, hands-on project experiments, and transparent pathway navigation.
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4 pt-4">
        <a
          href="/student"
          class="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
        >
          <span>Launch Student Map</span>
          <ArrowRight class="w-4 h-4" />
        </a>
        <a
          href="/student/assessment"
          class="px-6 py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-sm transition-all flex items-center gap-2"
        >
          <Activity class="w-4 h-4 text-cyan-400" />
          <span>Try Adaptive CAT Test</span>
        </a>
      </div>
    </div>

    <!-- Multi-Persona Portals Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 1. Student Portal Card -->
      <a
        href="/student"
        class="group p-6 rounded-xl glass-panel hover:glass-panel-elevated transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <GraduationCap class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center justify-between">
              <span>Student Experience</span>
              <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p class="text-xs text-slate-400 mt-1">Ages 10–16 (Classes 5–10)</p>
          </div>
          <p class="text-sm text-slate-300">
            "My Learning & Future Map" — Discover demonstrated strengths, foundation gaps, daily STEM reasoning puzzles, and try-before-you-choose missions.
          </p>
        </div>
        <div class="pt-6 border-t border-white/8 mt-6 flex items-center gap-2 font-mono text-xs text-cyan-400">
          <span>Active Learner: Anaya Verma (Gr 8)</span>
        </div>
      </a>

      <!-- 2. Parent Portal Card -->
      <a
        href="/parent"
        class="group p-6 rounded-xl glass-panel hover:glass-panel-elevated transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Shield class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-white group-hover:text-purple-300 transition-colors flex items-center justify-between">
              <span>Parent Alignment Workspace</span>
              <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p class="text-xs text-slate-400 mt-1">DPDP Verified Consent & Transparency</p>
          </div>
          <p class="text-sm text-slate-300">
            Replace anxiety with concrete next actions. View plain-language development summaries, evidence provenance, and align on career pathways collaboratively.
          </p>
        </div>
        <div class="pt-6 border-t border-white/8 mt-6 flex items-center gap-2 font-mono text-xs text-purple-400">
          <span>Pathway Mismatch Engine Active</span>
        </div>
      </a>

      <!-- 3. Teacher Portal Card -->
      <a
        href="/teacher"
        class="group p-6 rounded-xl glass-panel hover:glass-panel-elevated transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="w-12 h-12 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users class="w-6 h-6" />
          </div>
          <div>
            <h2 class="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center justify-between">
              <span>Teacher Copilot Portal</span>
              <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h2>
            <p class="text-xs text-slate-400 mt-1">Differentiated Interventions</p>
          </div>
          <p class="text-sm text-slate-300">
            Inspect Class 8-A competency heatmaps, view students grouped automatically by conceptual misconception, and assign targeted differentiated exercises.
          </p>
        </div>
        <div class="pt-6 border-t border-white/8 mt-6 flex items-center gap-2 font-mono text-xs text-emerald-400">
          <span>24 Active Students Synced</span>
        </div>
      </a>
    </div>

    <!-- Core Scientific Moats Section -->
    <div class="border border-white/10 rounded-2xl p-8 glass-panel space-y-8">
      <div class="text-center max-w-2xl mx-auto space-y-2">
        <h3 class="text-2xl font-bold text-white">The Six Architectural Moats of Core_OS</h3>
        <p class="text-sm text-slate-400">Why Core_OS breaks out of the "quiz app" and "generic AI wrapper" category</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
          <div class="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
            <Cpu class="w-4 h-4" />
            <span>3PL IRT Adaptive CAT Engine</span>
          </div>
          <p class="text-xs text-slate-300">
            Dynamic Fisher Information maximization selects the most informative diagnostic question, estimating latent ability θ with rigorous Gauss-Hermite EAP quadrature.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
          <div class="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <Layers class="w-4 h-4" />
            <span>5-Level Learner Evidence Graph</span>
          </div>
          <p class="text-xs text-slate-300">
            Every claimed strength or gap is anchored to immutable evidence atoms (Level 1 self-report to Level 4 project missions) with auditable provenance.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
          <div class="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Target class="w-4 h-4" />
            <span>Constructive Mismatch Engine</span>
          </div>
          <p class="text-xs text-slate-300">
            Never rejects a child’s dream. When prerequisites are missing, generates an 8-week foundation sprint and hands-on trial missions rather than closing the door.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
          <div class="flex items-center gap-2 text-sky-400 font-semibold text-sm">
            <Compass class="w-4 h-4" />
            <span>Try-Before-You-Choose Missions</span>
          </div>
          <p class="text-xs text-slate-300">
            Authentic simulation tasks (bridge stress testing, climate sensor anomaly isolation) let learners test their real-world grit before academic commitments.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
          <div class="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Sparkles class="w-4 h-4" />
            <span>Socratic AI with Strict Guardrails</span>
          </div>
          <p class="text-xs text-slate-300">
            Never dumps answers or assigns IQ scores. Asks high-leverage decomposition questions and captures qualitative reflection signals into the evidence store.
          </p>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
          <div class="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
            <Shield class="w-4 h-4" />
            <span>DPDP Act Child Safety & RLS</span>
          </div>
          <p class="text-xs text-slate-300">
            Zero advertising to minors, ephemeral voice processing with zero audio retention, relationship-gated RLS, and non-enumerable RPC token security.
          </p>
        </div>
      </div>
    </div>
  </div>
</div>
