<script lang="ts">
  import {
    Compass,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Award,
    Target,
    Layers,
    BookOpen,
    Play,
    Zap
  } from 'lucide-svelte';

  let { data } = $props();
  let pathways = $derived(data.pathways);
  let learner = $derived(data.learner);

  // Active selected pathway for detail view
  let selectedPathwayId = $state<string>('PATH-ROBOTICS');
  let selectedPathway = $derived(
    pathways.find((p) => p.id === selectedPathwayId) || pathways[0]
  );

  // Calculate readiness and mismatch delta dynamically against learner's actual competencies
  function calculateMismatch(pathway: typeof selectedPathway) {
    let metCount = 0;
    const requirementsWithDeltas = pathway.requirements.map((req) => {
      const demonstrated = learner.competencies[req.competency]?.score || 2.5;
      const delta = Math.round((demonstrated - req.minimumLevel) * 10) / 10;
      if (delta >= 0) metCount++;
      return {
        ...req,
        demonstrated,
        delta
      };
    });

    const readinessPct = Math.round((metCount / pathway.requirements.length) * 100);
    const hasGap = requirementsWithDeltas.some((r) => r.delta < 0);

    return {
      readinessPct,
      hasGap,
      requirements: requirementsWithDeltas
    };
  }

  let mismatch = $derived(calculateMismatch(selectedPathway));
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
  <!-- Header -->
  <div class="space-y-1">
    <div class="flex items-center gap-2">
      <Compass class="w-6 h-6 text-cyan-400" />
      <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Pathway Explorer & Mismatch Engine</h1>
    </div>
    <p class="text-sm text-slate-300">
      We do not decide your career. We measure prerequisite readiness, identify foundation gaps, and provide real-world project trials before you choose.
    </p>
  </div>

  <!-- Pathway Selector Tabs -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {#each pathways as p}
      <button
        type="button"
        onclick={() => (selectedPathwayId = p.id)}
        class="text-left p-5 rounded-xl border transition-all {selectedPathwayId === p.id ? 'glass-panel-elevated border-cyan-400/50' : 'glass-panel hover:border-white/20'}"
      >
        <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400">{p.field.replace('_', ' ')}</span>
        <h3 class="text-base font-bold text-white mt-1">{p.title}</h3>
        <p class="text-xs text-slate-300 mt-2 line-clamp-2">{p.tagline}</p>
        <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
          <span class="text-slate-400">Prerequisites</span>
          <span class="font-bold {p.id === 'PATH-ROBOTICS' ? 'text-amber-400' : 'text-cyan-400'}">
            {p.id === 'PATH-ROBOTICS' ? '74% (Gap)' : '82% (Ready)'}
          </span>
        </div>
      </button>
    {/each}
  </div>

  <!-- Detailed Selected Pathway View -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left Column: Overview & Requirements Analysis (2 cols) -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Pathway Overview Card -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div>
          <span class="text-xs font-mono uppercase text-cyan-400">{selectedPathway.code} • {selectedPathway.field.toUpperCase()}</span>
          <h2 class="text-xl font-bold text-white mt-1">{selectedPathway.title}</h2>
          <p class="text-sm text-slate-300 mt-2 leading-relaxed">{selectedPathway.overview}</p>
        </div>
        <div class="p-3.5 rounded-lg bg-white/5 border border-white/8 text-xs font-mono text-emerald-400">
          <span>Market Outlook: {selectedPathway.growthOutlook}</span>
        </div>
      </div>

      <!-- Constructive Mismatch Analysis Engine Card -->
      <div class="p-6 rounded-xl glass-panel space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Target class="w-5 h-5 text-cyan-400" />
            <h3 class="text-lg font-bold text-white">Prerequisite Readiness Analysis</h3>
          </div>
          <span class="text-xs font-mono px-2.5 py-1 rounded border {mismatch.hasGap ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'}">
            {mismatch.hasGap ? 'Constructive Mismatch Detected' : 'All Foundations Aligned'}
          </span>
        </div>

        <!-- Requirements Breakdown Table -->
        <div class="space-y-3">
          {#each mismatch.requirements as req}
            <div class="p-3.5 rounded-lg bg-white/5 border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span class="text-xs font-bold text-white capitalize">{req.competency.replace('_', ' ')}</span>
                <span class="text-[11px] text-slate-400 block sm:inline sm:ml-2">({req.importance.replace('_', ' ')})</span>
              </div>

              <div class="flex items-center gap-4 text-xs font-mono">
                <span class="text-slate-400">Req: {req.minimumLevel.toFixed(1)}</span>
                <span class="text-white">Demonstrated: <strong class="text-cyan-300">{req.demonstrated.toFixed(1)}</strong></span>
                {#if req.delta >= 0}
                  <span class="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    +{req.delta.toFixed(1)}
                  </span>
                {:else}
                  <span class="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {req.delta.toFixed(1)} Gap
                  </span>
                {/if}
              </div>
            </div>
          {/each}
        </div>

        <!-- Constructive Roadmap Box (Never Rejects!) -->
        {#if mismatch.hasGap}
          <div class="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-3">
            <div class="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Zap class="w-4 h-4" />
              <span>Constructive Growth Plan (Do Not Close the Door!)</span>
            </div>
            <p class="text-xs text-slate-200 leading-relaxed">
              Your spatial and computational reasoning are well above the requirements for this engineering field. However, foundational quantitative balancing shows a <span class="font-bold text-amber-300">-0.4 gap</span>.
            </p>
            <div class="pt-2 border-t border-amber-500/20 text-xs text-white">
              <span class="font-semibold text-amber-300">Recommended 8-Week Action:</span> Complete the Proportional Scaling sprint, followed by the two Try-Before-You-Choose project missions below to re-verify readiness before making high-stakes stream choices.
            </div>
          </div>
        {/if}
      </div>

      <!-- Multiple Education Routes (No University Monopoly) -->
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2">
          <BookOpen class="w-5 h-5 text-purple-400" />
          <h3 class="text-lg font-bold text-white">Multi-Route Education Paths</h3>
        </div>
        <p class="text-xs text-slate-400">
          Core_OS models multiple paths to mastery instead of treating competitive university admission as the sole route.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each selectedPathway.routes as route}
            <div class="p-4 rounded-lg bg-white/5 border border-white/8 space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono uppercase text-cyan-400">{route.type.replace('_', ' ')}</span>
                <span class="text-xs font-mono text-slate-400">{route.durationYears} Years</span>
              </div>
              <h4 class="text-sm font-bold text-white">{route.title}</h4>
              <p class="text-xs text-slate-300">{route.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Right Column: Try-Before-You-Choose Applied Missions -->
    <div class="space-y-6">
      <div class="p-6 rounded-xl glass-panel space-y-4">
        <div class="flex items-center gap-2">
          <Award class="w-5 h-5 text-cyan-400" />
          <h3 class="text-lg font-bold text-white">Try-Before-You-Choose Missions</h3>
        </div>
        <p class="text-xs text-slate-300">
          Experience real miniature tasks to test your grit, curiosity, and authentic interest before committing to years of coaching.
        </p>

        <div class="space-y-4">
          {#each selectedPathway.missions as mission}
            <div class="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 space-y-3">
              <div>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                    {mission.difficulty} • {mission.durationMinutes} Mins
                  </span>
                </div>
                <h4 class="text-sm font-bold text-white mt-2">{mission.title}</h4>
                <p class="text-xs text-slate-300 mt-1 italic">"{mission.headline}"</p>
              </div>

              <div class="text-xs text-slate-300 space-y-1">
                <p><strong>Scenario:</strong> {mission.scenario}</p>
                <p><strong>Deliverable:</strong> {mission.deliverable}</p>
              </div>

              <a
                href="/student/mentor"
                class="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Play class="w-3.5 h-3.5 fill-current" />
                <span>Launch Mission with AI Mentor</span>
              </a>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
