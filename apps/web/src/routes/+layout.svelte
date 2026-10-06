<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import {
    Compass,
    GraduationCap,
    Users,
    Activity,
    Shield,
    Sparkles,
    BrainCircuit,
    ChevronRight
  } from 'lucide-svelte';

  let { data, children } = $props();
</script>

<div class="min-h-screen bg-[oklch(0.130_0.018_250)] text-[oklch(0.960_0.005_240)] font-sans flex flex-col">
  <!-- Top Telemetry & Role Navigation Bar -->
  <header class="sticky top-0 z-50 border-b border-white/8 bg-[oklch(0.130_0.018_250)]/90 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Logo & Product Brand -->
      <a href="/" class="flex items-center gap-3 group">
        <div class="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
          <BrainCircuit class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="font-bold tracking-tight text-white text-base">Core_OS</span>
            <span class="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">Phase 1 MVP</span>
          </div>
          <p class="text-[11px] text-slate-400 hidden sm:block">Learner Intelligence & Navigation Platform</p>
        </div>
      </a>

      <!-- Primary Portal Navigation -->
      <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
        <a
          href="/student"
          class="px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 {page.url.pathname.startsWith('/student') ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}"
        >
          <GraduationCap class="w-4 h-4" />
          <span>Student Map</span>
        </a>
        <a
          href="/student/assessment"
          class="px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 {page.url.pathname === '/student/assessment' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}"
        >
          <Activity class="w-4 h-4" />
          <span>Adaptive CAT</span>
        </a>
        <a
          href="/student/pathways"
          class="px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 {page.url.pathname === '/student/pathways' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}"
        >
          <Compass class="w-4 h-4" />
          <span>Pathways</span>
        </a>
        <a
          href="/student/mentor"
          class="px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 {page.url.pathname === '/student/mentor' ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}"
        >
          <Sparkles class="w-4 h-4 text-cyan-400" />
          <span>Socratic AI</span>
        </a>
        <a
          href="/parent"
          class="px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 {page.url.pathname.startsWith('/parent') ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}"
        >
          <Shield class="w-4 h-4 text-purple-400" />
          <span>Parent Portal</span>
        </a>
        <a
          href="/teacher"
          class="px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-2 {page.url.pathname.startsWith('/teacher') ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'text-slate-300 hover:text-white hover:bg-white/5'}"
        >
          <Users class="w-4 h-4 text-emerald-400" />
          <span>Teacher Copilot</span>
        </a>
      </nav>

      <!-- Active Profile Indicator -->
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <p class="text-xs font-medium text-white">{data.learner.fullName}</p>
          <p class="text-[10px] font-mono text-cyan-400">θ = {data.learner.competencies.spatial_reasoning.theta > 0 ? '+' : ''}{data.learner.competencies.spatial_reasoning.theta} (Spatial)</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-xs font-bold text-cyan-300">
          AV
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="flex-1">
    {@render children()}
  </main>

  <!-- Minimal Lagom Footer -->
  <footer class="border-t border-white/8 py-6 text-xs text-slate-500 text-center">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
      <p>Core_OS — Deterministic 3PL IRT Psychometrics • Evidence Before Inference • NEP 2020 Aligned</p>
      <div class="flex items-center gap-4 font-mono text-[11px] text-slate-400">
        <span>pnpm strictly enforced</span>
        <span>•</span>
        <span>DPDP Verified Consent</span>
      </div>
    </div>
  </footer>
</div>
