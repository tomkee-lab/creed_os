<script lang="ts">
  import {
    Target,
    Compass,
    Layers,
    Clock,
    CheckCircle2,
    ArrowRight,
    TerminalSquare,
    Sliders,
    Search,
    Cpu,
    Activity,
    Award,
    Sparkles,
    ShieldCheck,
    FlaskConical
  } from 'lucide-svelte';
  import type { PageData } from './$types';
  import type { StemMission } from '$lib/server/repository';

  let { data } = $props<{ data: PageData }>();

  // State runes
  let stageFilterState = $state<string | null>(null);
  const activeStage = $derived(stageFilterState ?? data.selectedStage ?? 'all');

  let domainFilterState = $state<string | null>(null);
  const activeDomain = $derived(domainFilterState ?? data.selectedDomain ?? 'all');

  let searchQuery = $state('');

  const stageTabs = [
    { id: 'all', label: 'All Stages' },
    { id: 'preparatory', label: 'Preparatory (Classes 3–5)' },
    { id: 'middle', label: 'Middle (Classes 6–8)' },
    { id: 'secondary', label: 'Secondary (Classes 9–12)' }
  ];

  const domainFilterOptions = [
    { id: 'all', label: 'All Competency Tracks' },
    { id: 'computational_thinking', label: 'Computational Thinking & AI' },
    { id: 'quantitative_reasoning', label: 'Quantitative Kinematics' },
    { id: 'spatial_reasoning', label: 'Spatial Reasoning & Statics' }
  ];

  const filteredMissions = $derived<StemMission[]>(
    data.missions.filter((m: StemMission) => {
      const matchStage = activeStage === 'all' || m.stage === activeStage;
      const matchDomain = activeDomain === 'all' || m.domain === activeDomain;
      const matchQuery =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brief.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.domainTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStage && matchDomain && matchQuery;
    })
  );

  const stageBadges: Record<string, { label: string; color: string; border: string }> = {
    preparatory: { label: 'Classes 3–5', color: 'bg-emerald-500/10 text-emerald-400', border: 'border-emerald-500/30' },
    middle: { label: 'Classes 6–8', color: 'bg-indigo-500/10 text-indigo-400', border: 'border-indigo-500/30' },
    secondary: { label: 'Classes 9–12', color: 'bg-amber-500/10 text-amber-400', border: 'border-amber-500/30' }
  };

  const difficultyBadges: Record<string, string> = {
    Foundational: 'border-emerald-500 text-emerald-400',
    Intermediate: 'border-indigo-500 text-indigo-400',
    Advanced: 'border-amber-500 text-amber-400',
    Olympiad: 'border-rose-500 text-rose-400'
  };
</script>

<svelte:head>
  <title>STEM & Robotics Mission Studio — CREED OS</title>
  <meta
    name="description"
    content="Level 4 Applied Engineering & Robotics Missions across Preparatory, Middle, and Secondary stages."
  />
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8 pb-20">
  <!-- Top Navigation & Persona Signal -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 font-mono flex items-center gap-1.5">
          <FlaskConical class="w-3.5 h-3.5" />
          <span>Level 4 Applied Proving Grounds</span>
        </span>
        <span class="text-xs text-muted">•</span>
        <span class="text-xs text-muted font-mono">{data.learner?.fullName || 'Student Learner'} ({data.learner?.gradeBand || 'Class 8'})</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold text-foreground">
        STEM & Autonomous Robotics Missions
      </h1>
      <p class="text-xs text-muted max-w-2xl">
        Authentic engineering challenges calibrated to international curricula (PISA, TIMSS, CSTA K-12, WRO, FRC). Solve challenges to log verified Level 4 evidence in your profile.
      </p>
    </div>

    <!-- Quick Action: Launch Full IDE -->
    <div class="flex items-center gap-2 shrink-0">
      <a
        href="/ide"
        class="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
      >
        <TerminalSquare class="w-3.5 h-3.5" />
        <span>Robotics IDE Studio ↗</span>
      </a>
      <a
        href="/student/assessment"
        class="px-4 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-foreground rounded-sm transition-colors cursor-pointer"
      >
        <span>30Q Benchmark</span>
      </a>
    </div>
  </div>

  <!-- LEVEL 1 — SIGNAL: COHORT OVERVIEW & STAGES SELECTOR -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div class="p-5 bg-surface border border-border rounded-sm space-y-1">
      <span class="text-[11px] font-mono text-muted uppercase font-semibold">Active Missions In Curriculum</span>
      <p class="text-2xl font-bold text-foreground font-mono">{data.totalMissions} Proving Grounds</p>
      <p class="text-xs text-muted">Across Preparatory, Middle & Secondary Stages</p>
    </div>

    <div class="p-5 bg-surface border border-border rounded-sm space-y-1">
      <span class="text-[11px] font-mono text-muted uppercase font-semibold">Level 4 Applied Evidence</span>
      <p class="text-2xl font-bold text-indigo-400 font-mono">Verified Ledger</p>
      <p class="text-xs text-muted">Real-world engineering rubrics (No raw test anxiety)</p>
    </div>

    <div class="p-5 bg-surface border border-border rounded-sm space-y-1">
      <span class="text-[11px] font-mono text-muted uppercase font-semibold">International Standard Alignments</span>
      <p class="text-2xl font-bold text-emerald-400 font-mono">PISA • WRO • CSTA</p>
      <p class="text-xs text-muted">Direct mapping to competitive tournament rubrics</p>
    </div>
  </div>

  <!-- STAGE FILTER TABS (0px sharp geometric WAY 2.1) -->
  <div class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Stage Segmented Tabs -->
      <div class="flex items-center gap-1 p-1 bg-surface-raised border border-border rounded-sm overflow-x-auto">
        {#each stageTabs as tab}
          {@const isActive = activeStage === tab.id}
          <button
            onclick={() => (stageFilterState = tab.id)}
            class="px-3 py-1.5 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap {isActive ? 'bg-foreground text-background shadow-xs' : 'text-muted hover:text-foreground'}"
          >
            {tab.label}
          </button>
        {/each}
      </div>

      <!-- Domain Track & Search Filters -->
      <div class="flex items-center gap-2">
        <select
          value={activeDomain}
          onchange={(e) => (domainFilterState = (e.target as HTMLSelectElement).value)}
          class="px-3 py-1.5 bg-surface-raised border border-border text-xs rounded-sm text-foreground focus:outline-hidden"
        >
          {#each domainFilterOptions as opt}
            <option value={opt.id}>{opt.label}</option>
          {/each}
        </select>

        <div class="relative">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            bind:value={searchQuery}
            placeholder="Search missions..."
            class="pl-8 pr-3 py-1.5 bg-surface-raised border border-border text-xs rounded-sm text-foreground focus:outline-hidden w-40 sm:w-48"
          />
        </div>
      </div>
    </div>

    <!-- MISSION CARDS GRID -->
    {#if filteredMissions.length === 0}
      <div class="p-12 text-center border border-dashed border-border rounded-sm bg-surface-raised space-y-2">
        <Target class="w-8 h-8 text-muted mx-auto" />
        <h3 class="text-sm font-bold text-foreground">No missions found matching your filter</h3>
        <p class="text-xs text-muted">Try resetting your stage or competency track filters.</p>
        <button
          onclick={() => { stageFilterState = 'all'; domainFilterState = 'all'; searchQuery = ''; }}
          class="px-4 py-2 border border-border text-xs font-medium hover:bg-surface rounded-sm transition-colors cursor-pointer mt-2"
        >
          Reset All Filters
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each filteredMissions as mission}
          {@const stageBadge = stageBadges[mission.stage] || stageBadges.middle}
          <div class="p-6 bg-surface border border-border hover:border-border-strong rounded-sm transition-all space-y-5 flex flex-col justify-between">
            <!-- Top Card Header -->
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-sm border {stageBadge.color} {stageBadge.border}">
                    {stageBadge.label}
                  </span>
                  <span class="text-[10px] font-mono text-muted uppercase font-semibold">
                    {mission.code}
                  </span>
                </div>

                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono px-2 py-0.5 border rounded-sm {difficultyBadges[mission.difficulty] || 'border-border text-muted'}">
                    {mission.difficulty}
                  </span>
                  <span class="text-[10px] text-muted flex items-center gap-1 font-mono">
                    <Clock class="w-3 h-3" />
                    <span>{mission.estimatedMinutes}m</span>
                  </span>
                </div>
              </div>

              <div>
                <h3 class="text-base font-bold text-foreground leading-snug">
                  {mission.title}
                </h3>
                <p class="text-xs text-indigo-400 font-medium mt-0.5">
                  {mission.domainTitle}
                </p>
              </div>

              <!-- LEVEL 2 CONTEXT: BRIEF -->
              <p class="text-xs text-muted leading-relaxed line-clamp-3">
                {mission.brief}
              </p>
            </div>

            <!-- LEVEL 3 EVIDENCE: RUBRICS & STANDARDS -->
            <div class="space-y-3 pt-3 border-t border-border">
              <div class="space-y-1.5">
                <span class="text-[10px] font-mono text-muted uppercase font-semibold">Evaluated Rubric Targets</span>
                <div class="space-y-1">
                  {#each mission.rubricCriteria.slice(0, 2) as criterion}
                    <div class="flex items-center justify-between text-[11px]">
                      <span class="text-muted flex items-center gap-1.5">
                        <CheckCircle2 class="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{criterion.criterion}</span>
                      </span>
                      <span class="font-mono text-foreground text-[10px]">{criterion.target}</span>
                    </div>
                  {/each}
                </div>
              </div>

              <div class="flex flex-wrap items-center gap-1 pt-1">
                {#each mission.alignedStandards.slice(0, 2) as std}
                  <span class="text-[9px] font-mono px-1.5 py-0.5 bg-surface-raised border border-border text-muted rounded-none">
                    {std}
                  </span>
                {/each}
              </div>

              <!-- Action Launcher -->
              <div class="flex items-center justify-between gap-2 pt-2">
                <a
                  href="/student/missions/{mission.id}"
                  class="flex-1 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Launch Proving Ground</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </a>

                <a
                  href="/ide"
                  class="px-3 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-muted hover:text-foreground rounded-sm transition-colors cursor-pointer"
                  title="Open Mission in Robotics WebAssembly IDE"
                >
                  <TerminalSquare class="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
