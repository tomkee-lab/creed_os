<script lang="ts">
  import {
    Shield,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Users,
    TrendingUp,
    HeartHandshake,
    Calendar,
    Layers,
    Lock
  } from 'lucide-svelte';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);

  let selectedTab = $state<'overview' | 'alignment' | 'evidence'>('overview');
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Parent Portal Header -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-xl glass-panel-elevated">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Shield class="w-6 h-6 text-purple-400" />
        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Parent Alignment Workspace</h1>
      </div>
      <p class="text-sm text-slate-300">
        Transparent evidence, non-stigmatizing growth tracking, and shared pathway navigation for <strong class="text-white">{learner.fullName}</strong>.
      </p>
    </div>

    <!-- Verified Consent Badge (DPDP Act) -->
    <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
      <Lock class="w-4 h-4 text-emerald-400" />
      <span>DPDP Consent: Verified Guardian</span>
    </div>
  </div>

  <!-- Navigation Tabs -->
  <div class="flex items-center gap-2 border-b border-white/8 pb-4">
    <button
      type="button"
      onclick={() => (selectedTab = 'overview')}
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {selectedTab === 'overview' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}"
    >
      Development Overview
    </button>
    <button
      type="button"
      onclick={() => (selectedTab = 'alignment')}
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {selectedTab === 'alignment' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}"
    >
      Parent-Student Alignment
    </button>
    <button
      type="button"
      onclick={() => (selectedTab = 'evidence')}
      class="px-4 py-2 rounded-lg text-sm font-medium transition-colors {selectedTab === 'evidence' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}"
    >
      Evidence Traceability ({evidence.length})
    </button>
  </div>

  {#if selectedTab === 'overview'}
    <!-- The Five Essential Questions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- 1. Where is my child doing well? -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase font-mono">
          <CheckCircle2 class="w-4 h-4" />
          <span>1. Demonstrated Core Strengths</span>
        </div>
        <div class="space-y-3">
          <div class="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <strong class="text-white">Spatial Visualization & 3D Modeling</strong>
              <span class="font-mono text-emerald-400">Score: 4.5 / 5.0 (Advanced)</span>
            </div>
            <p class="text-xs text-slate-300">
              Anaya excels at mentally rotating multi-dimensional shapes, interpreting isometric projections, and designing structural truss geometries.
            </p>
          </div>

          <div class="p-3.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 space-y-1">
            <div class="flex items-center justify-between text-xs">
              <strong class="text-white">Computational Problem Decomposition</strong>
              <span class="font-mono text-emerald-400">Score: 4.1 / 5.0 (Advanced)</span>
            </div>
            <p class="text-xs text-slate-300">
              She systematically deconstructs complex algorithmic loops and identifies algorithmic patterns without feeling overwhelmed.
            </p>
          </div>
        </div>
      </div>

      <!-- 2. Where are the current gaps? -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase font-mono">
          <AlertCircle class="w-4 h-4" />
          <span>2. Current Foundation Gaps (Not Blockers!)</span>
        </div>
        <div class="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <strong class="text-white">Quantitative Balancing & Inversion</strong>
            <span class="font-mono text-amber-400">Score: 2.8 / 5.0 (Developing)</span>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            The diagnostic identified that Anaya occasionally transposes positive and negative signs when isolating multi-variable terms on balance scales. This is a common conceptual gap in Class 8 algebra, entirely remediable with targeted practice.
          </p>
        </div>
      </div>

      <!-- 3. What has actually been observed? -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase font-mono">
          <Layers class="w-4 h-4" />
          <span>3. What Has Actually Been Observed?</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
          Over the past 30 days, Core_OS recorded <strong class="text-white">4 verified evidence records</strong>:
          two 3PL IRT adaptive assessments, one teacher classroom observation by Mr. Sharma, and one completed applied bridge engineering mission.
        </p>
        <button
          onclick={() => (selectedTab = 'evidence')}
          class="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
        >
          <span>Inspect individual evidence records & provenance →</span>
        </button>
      </div>

      <!-- 4. What should we do next? -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase font-mono">
          <TrendingUp class="w-4 h-4" />
          <span>4. Recommended Next Action</span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed">
          Enroll Anaya in the <strong class="text-white">8-Week Proportional Foundations Sprint</strong> (2 hours/week). After 4 weeks, have her attempt the Autonomous Rover Sensor Trial.
        </p>
        <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-200">
          <strong>Review Milestone:</strong> Revisit pathway readiness after the rover mission is completed on November 15, 2026.
        </div>
      </div>
    </div>
  {:else if selectedTab === 'alignment'}
    <!-- Parent-Student Alignment Matrix -->
    <div class="p-6 rounded-xl glass-panel space-y-6">
      <div class="flex items-center gap-2">
        <HeartHandshake class="w-5 h-5 text-purple-400" />
        <h2 class="text-xl font-bold text-white">Parent-Student Alignment Matrix</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-2">
          <span class="text-xs font-mono uppercase text-slate-400">Parent Career Aspiration</span>
          <h3 class="text-base font-bold text-white">Robotics & Mechatronics Engineering</h3>
          <p class="text-xs text-slate-300">
            "We want Anaya to build a strong foundation in high-growth engineering fields."
          </p>
        </div>

        <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-2">
          <span class="text-xs font-mono uppercase text-cyan-400">Student Demonstrated Passion</span>
          <h3 class="text-base font-bold text-white">Interactive 3D Design & Computational Media</h3>
          <p class="text-xs text-slate-300">
            "I love designing spatial structures and writing logic loops that simulate real things."
          </p>
        </div>
      </div>

      <!-- Neutral Evidence Layer Resolving Conflict -->
      <div class="p-5 rounded-xl border border-purple-500/30 bg-purple-500/10 space-y-3">
        <div class="flex items-center gap-2 text-sm font-bold text-purple-300">
          <TrendingUp class="w-4 h-4" />
          <span>Platform Consensus Analysis</span>
        </div>
        <p class="text-xs text-slate-200 leading-relaxed">
          Both parent and student goals share high spatial visualization (Anaya: 4.5/5.0) and computational thinking (4.1/5.0). The single point of vulnerability is foundational quantitative balancing (2.8/5.0).
        </p>
        <div class="pt-3 border-t border-purple-500/20 text-xs text-white">
          <strong class="text-purple-300">Agreed Collaborative Action:</strong> Avoid forcing an immediate stream decision. Complete the 3 Try-Before-You-Choose project missions together. If Anaya enjoys the hardware robotics trial and completes the math sprint, both pathways remain open.
        </div>
      </div>
    </div>
  {:else if selectedTab === 'evidence'}
    <!-- Verifiable Evidence Stream -->
    <div class="p-6 rounded-xl glass-panel space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-bold text-white">Verifiable Learner Evidence Records</h2>
        <span class="text-xs font-mono text-slate-400">Immutable & DPDP Protected</span>
      </div>

      <div class="space-y-3">
        {#each evidence as item}
          <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-white font-mono">[{item.evidenceType.toUpperCase()}] • {item.competency.replace('_', ' ').toUpperCase()}</span>
              <span class="font-mono text-emerald-400">Confidence: {(item.confidence * 100).toFixed(0)}%</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">{item.summary}</p>
            <div class="text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
              <span>Source: {item.sourceTitle}</span>
              <span>Observed: {new Date(item.observedAt).toLocaleDateString()}</span>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>
