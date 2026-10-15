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
    FlaskConical,
    Globe,
    ChevronDown,
    Check,
    X,
    GraduationCap
  } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import ThreeLaunchpad from '$lib/components/telemetry/ThreeLaunchpad.svelte';
  import type { PageData } from './$types';
  import type { StemMission } from '$lib/server/repository';

  let { data } = $props<{ data: PageData }>();

  let show3DLaunchpad = $state(true);

  // State runes
  let stageFilterState = $state<string | null>(null);
  const activeStage = $derived(stageFilterState ?? data.selectedStage ?? 'all');

  let domainFilterState = $state<string | null>(null);
  const activeDomain = $derived(domainFilterState ?? data.selectedDomain ?? 'all');

  let searchQuery = $state('');

  const stageOptions = [
    { id: 'all', label: 'All Stages', grades: 'Classes 3–12', description: 'Complete developmental continuum' },
    { id: 'preparatory', label: 'Preparatory', grades: 'Classes 3–5', description: 'Foundational mechanics & statics' },
    { id: 'middle', label: 'Middle', grades: 'Classes 6–8', description: 'Autonomous kinematics & telemetry' },
    { id: 'secondary', label: 'Secondary', grades: 'Classes 9–12', description: 'Closed-loop PID & computer vision' }
  ];

  const domainFilterOptions = [
    { id: 'all', label: 'All Competency Tracks', description: 'All applied engineering disciplines' },
    { id: 'computational_thinking', label: 'Computational Thinking & AI', description: 'A* search, vision tracking & state machines' },
    { id: 'quantitative_reasoning', label: 'Quantitative Kinematics', description: 'Torque ratios, mechanical advantage & PID' },
    { id: 'spatial_reasoning', label: 'Spatial Reasoning & Statics', description: 'Truss load deflection & bridge mechanics' }
  ];

  const activeStageOption = $derived(
    stageOptions.find((opt) => opt.id === activeStage) ?? stageOptions[0]
  );

  const activeDomainOption = $derived(
    domainFilterOptions.find((opt) => opt.id === activeDomain) ?? domainFilterOptions[0]
  );

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
    preparatory: { label: 'Classes 3–5', color: 'bg-positive-subtle text-positive', border: 'border-positive/30' },
    middle: { label: 'Classes 6–8', color: 'bg-ai-subtle text-ai', border: 'border-ai/30' },
    secondary: { label: 'Classes 9–12', color: 'bg-attention-subtle text-attention', border: 'border-attention/30' }
  };

  const difficultyBadges: Record<string, string> = {
    Foundational: 'border-positive text-positive',
    Intermediate: 'border-ai text-ai',
    Advanced: 'border-attention text-attention',
    Olympiad: 'border-critical text-critical'
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
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider text-ai font-mono flex items-center gap-1.5">
          <FlaskConical class="w-3.5 h-3.5" />
          <span>Hands-on Engineering Challenges</span>
        </span>
        <span class="text-xs text-foreground-secondary">•</span>
        <span class="text-xs text-foreground-secondary font-mono">{data.learner?.fullName || 'Student Learner'} ({data.learner?.gradeBand || 'Class 8'})</span>
      </div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">
        STEM & Autonomous Robotics Missions
      </h1>
      <p class="text-sm text-foreground-secondary max-w-2xl leading-relaxed">
        Authentic engineering challenges calibrated to international curricula (PISA, TIMSS, CSTA K-12, WRO, FRC). Build, simulate, and demonstrate applied competency.
      </p>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap items-center gap-2 shrink-0">
      <button
        onclick={() => (show3DLaunchpad = !show3DLaunchpad)}
        class="px-3 py-2 border border-border hover:bg-surface-raised text-xs font-mono text-cyan rounded-none transition-micro flex items-center gap-1.5 cursor-pointer shadow-2xs"
        title="Toggle 3D Holographic Launchpad"
      >
        <Sparkles class="w-3.5 h-3.5" />
        <span>{show3DLaunchpad ? 'Hide 3D Mesh' : 'Show 3D Mesh'}</span>
      </button>

      <a
        href="/observatory"
        class="px-3.5 py-2 border border-border bg-surface hover:bg-surface-raised text-xs font-medium text-foreground rounded-none transition-micro flex items-center gap-1.5 cursor-pointer shadow-xs"
        title="Open Earth & Space Planetary Observatory"
      >
        <Globe class="w-3.5 h-3.5 text-brand" />
        <span>Observatory ↗</span>
      </a>

      <a
        href="/ide"
        class="px-3.5 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-none transition-micro flex items-center gap-1.5 cursor-pointer shadow-xs"
      >
        <TerminalSquare class="w-3.5 h-3.5" />
        <span>Robotics IDE ↗</span>
      </a>
      <a
        href="/student/assessment"
        class="px-3.5 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-foreground rounded-none transition-micro cursor-pointer"
      >
        <span>30Q Benchmark</span>
      </a>
    </div>
  </div>

  {#if show3DLaunchpad}
    <!-- 3D Interactive Telemetry Launchpad Hero Frame -->
    <div class="border border-border bg-surface rounded-none overflow-hidden shadow-xs">
      <ThreeLaunchpad compact={false} />
    </div>
  {/if}

  <!-- Editorial Orientation Summary -->
  <div class="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface border border-border rounded-sm">
    <div class="flex items-center gap-6 text-xs text-foreground-secondary">
      <div>
        <span class="font-semibold text-foreground font-mono">{data.totalMissions}</span> Available Missions
      </div>
      <span class="text-border">•</span>
      <div>
        <span class="font-semibold text-foreground">Classes 3–12</span> Developmental Progression
      </div>
      <span class="text-border">•</span>
      <div>
        <span class="font-semibold text-positive">Calibrated Rubrics</span> PISA & WRO Aligned
      </div>
    </div>
    <span class="text-[11px] font-mono text-foreground-secondary">
      Showing {filteredMissions.length} {filteredMissions.length === 1 ? 'mission' : 'missions'}
    </span>
  </div>

  <div class="space-y-6">
    <!-- Filter & Search Controls: Unified WAY 2.1 Dropdown Suite -->
    <div class="space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-2 border border-border rounded-sm shadow-2xs">
      <div class="flex flex-wrap items-center gap-2">
        <!-- Stage Dropdown Filter -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class="h-9 px-3 border border-border bg-surface-raised hover:bg-surface text-xs font-medium rounded-sm transition-colors flex items-center justify-between gap-2 cursor-pointer shadow-2xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-brand min-w-[190px] sm:min-w-[210px] {activeStage !== 'all' ? 'border-brand/50 text-brand bg-brand-subtle/10' : ''}"
          >
            <div class="flex items-center gap-2 truncate">
              <GraduationCap class="w-3.5 h-3.5 text-foreground-secondary shrink-0" />
              <span class="truncate">
                <span class="text-foreground-secondary font-normal">Stage:</span>
                <span class="font-medium ml-1">{activeStageOption.label}</span>
              </span>
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-foreground-secondary shrink-0 opacity-70" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="start" class="w-80 p-1 bg-surface-overlay border border-border shadow-md rounded-sm">
            <div class="px-3 py-2 border-b border-border mb-1">
              <p class="text-[10px] font-mono uppercase tracking-wider text-foreground-secondary">Filter by Stage</p>
              <p class="text-[11px] text-foreground-secondary">Classes 3–12 Developmental Continuum</p>
            </div>
            {#each stageOptions as opt}
              <DropdownMenu.Item
                onclick={() => (stageFilterState = opt.id)}
                class="flex items-center justify-between px-3 py-2 text-xs rounded-sm hover:bg-surface-raised cursor-pointer transition-colors {activeStage === opt.id ? 'bg-surface-raised' : ''}"
              >
                <div class="flex flex-col gap-0.5">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-foreground">{opt.label}</span>
                    <span class="text-[10px] font-mono text-foreground-secondary">({opt.grades})</span>
                  </div>
                  <span class="text-[11px] text-foreground-secondary">{opt.description}</span>
                </div>
                {#if activeStage === opt.id}
                  <Check class="w-3.5 h-3.5 text-brand shrink-0 ml-2" />
                {/if}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>

        <!-- Competency Track Dropdown Filter -->
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            class="h-9 px-3 border border-border bg-surface-raised hover:bg-surface text-xs font-medium rounded-sm transition-colors flex items-center justify-between gap-2 cursor-pointer shadow-2xs text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-brand min-w-[200px] sm:min-w-[230px] {activeDomain !== 'all' ? 'border-brand/50 text-brand bg-brand-subtle/10' : ''}"
          >
            <div class="flex items-center gap-2 truncate">
              <Compass class="w-3.5 h-3.5 text-foreground-secondary shrink-0" />
              <span class="truncate">
                <span class="text-foreground-secondary font-normal">Track:</span>
                <span class="font-medium ml-1">{activeDomainOption.label}</span>
              </span>
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-foreground-secondary shrink-0 opacity-70" />
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="start" class="w-80 p-1 bg-surface-overlay border border-border shadow-md rounded-sm">
            <div class="px-3 py-2 border-b border-border mb-1">
              <p class="text-[10px] font-mono uppercase tracking-wider text-foreground-secondary">Competency Track</p>
              <p class="text-[11px] text-foreground-secondary">Engineering & Algorithmic Strands</p>
            </div>
            {#each domainFilterOptions as opt}
              <DropdownMenu.Item
                onclick={() => (domainFilterState = opt.id)}
                class="flex items-center justify-between px-3 py-2 text-xs rounded-sm hover:bg-surface-raised cursor-pointer transition-colors {activeDomain === opt.id ? 'bg-surface-raised' : ''}"
              >
                <div class="flex flex-col gap-0.5">
                  <span class="font-medium text-foreground">{opt.label}</span>
                  <span class="text-[11px] text-foreground-secondary">{opt.description}</span>
                </div>
                {#if activeDomain === opt.id}
                  <Check class="w-3.5 h-3.5 text-brand shrink-0 ml-2" />
                {/if}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      <!-- Search Input with Clear Button -->
      <div class="relative w-full sm:w-64">
        <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-foreground-secondary pointer-events-none" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search missions..."
          class="h-9 w-full pl-8 pr-8 bg-surface-raised border border-border text-xs rounded-sm text-foreground placeholder:text-foreground-secondary focus:outline-hidden focus:border-brand/50 shadow-2xs"
        />
        {#if searchQuery}
          <button
            type="button"
            onclick={() => (searchQuery = '')}
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground p-0.5 rounded-sm cursor-pointer"
            title="Clear search"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Active Filter Badges / Chips -->
    {#if activeStage !== 'all' || activeDomain !== 'all' || searchQuery.trim()}
      <div class="flex flex-wrap items-center gap-2 px-1 text-xs">
        <span class="text-[11px] font-mono text-foreground-secondary">Active filters:</span>
        {#if activeStage !== 'all'}
          <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-raised border border-border rounded-sm text-xs text-foreground">
            <span>Stage: <strong>{activeStageOption.label}</strong> ({activeStageOption.grades})</span>
            <button
              type="button"
              onclick={() => (stageFilterState = 'all')}
              class="hover:text-critical cursor-pointer ml-1"
              title="Remove stage filter"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        {/if}
        {#if activeDomain !== 'all'}
          <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-raised border border-border rounded-sm text-xs text-foreground">
            <span>Track: <strong>{activeDomainOption.label}</strong></span>
            <button
              type="button"
              onclick={() => (domainFilterState = 'all')}
              class="hover:text-critical cursor-pointer ml-1"
              title="Remove track filter"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        {/if}
        {#if searchQuery.trim()}
          <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-raised border border-border rounded-sm text-xs text-foreground">
            <span>Search: <strong>"{searchQuery}"</strong></span>
            <button
              type="button"
              onclick={() => (searchQuery = '')}
              class="hover:text-critical cursor-pointer ml-1"
              title="Clear search query"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        {/if}
        <button
          type="button"
          onclick={() => { stageFilterState = 'all'; domainFilterState = 'all'; searchQuery = ''; }}
          class="text-xs text-foreground-secondary hover:text-foreground underline underline-offset-4 ml-1 cursor-pointer"
        >
          Reset all
        </button>
      </div>
    {/if}
  </div>

    <!-- MISSION CARDS GRID: 4-QUESTION ANATOMY -->
    {#if filteredMissions.length === 0}
      <div class="p-12 text-center border border-dashed border-border rounded-sm bg-surface space-y-2">
        <Target class="w-8 h-8 text-foreground-secondary mx-auto" />
        <h3 class="text-sm font-semibold text-foreground">No missions found matching your filter</h3>
        <p class="text-xs text-foreground-secondary">Try resetting your stage or competency track filters.</p>
        <button
          onclick={() => { stageFilterState = 'all'; domainFilterState = 'all'; searchQuery = ''; }}
          class="px-4 py-2 border border-border text-xs font-medium hover:bg-surface-raised text-foreground rounded-sm transition-colors cursor-pointer mt-2"
        >
          Reset All Filters
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each filteredMissions as mission}
          {@const stageBadge = stageBadges[mission.stage] || stageBadges.middle}
          <div class="p-6 bg-surface border border-border hover:border-foreground/30 rounded-sm transition-colors space-y-5 flex flex-col justify-between">
            <!-- QUESTION 1: HOW LONG & WHICH STAGE? -->
            <div class="space-y-3">
              <div class="flex items-center justify-between gap-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-mono text-[11px] font-semibold text-foreground">
                    {stageBadge.label}
                  </span>
                  <span class="text-border">•</span>
                  <span class="text-[11px] text-foreground-secondary font-mono">
                    {mission.code}
                  </span>
                </div>

                <div class="flex items-center gap-2 text-[11px] text-foreground-secondary font-mono">
                  <span>{mission.difficulty}</span>
                  <span class="text-border">•</span>
                  <span class="flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    <span>{mission.estimatedMinutes} min</span>
                  </span>
                </div>
              </div>

              <!-- QUESTION 2: WHAT WILL I BUILD OR INVESTIGATE? -->
              <div>
                <h3 class="text-base font-bold text-foreground leading-snug">
                  {mission.title}
                </h3>
                <span class="text-xs text-ai font-medium block mt-0.5">
                  {mission.domainTitle}
                </span>
              </div>

              <!-- SHORT BRIEF -->
              <p class="text-xs text-foreground-secondary leading-relaxed line-clamp-3">
                {mission.brief}
              </p>
            </div>

            <!-- QUESTION 3: WHAT WILL I LEARN & DEMONSTRATE? -->
            <div class="space-y-4 pt-3 border-t border-border">
              {#if mission.rubricCriteria && mission.rubricCriteria.length > 0}
                <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-1">
                  <span class="text-[10px] uppercase font-semibold text-foreground-secondary tracking-wider block">
                    Target Evaluation Rubric
                  </span>
                  <div class="flex items-start gap-1.5 text-xs text-foreground">
                    <CheckCircle2 class="w-3.5 h-3.5 text-positive shrink-0 mt-0.5" />
                    <span class="font-medium">{mission.rubricCriteria[0].criterion}</span>
                  </div>
                </div>
              {/if}

              <!-- QUESTION 4: WHAT HAPPENS WHEN I START? (ACTION) -->
              <div class="flex items-center justify-between gap-2 pt-1">
                <a
                  href="/student/missions/{mission.id}"
                  class="flex-1 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-medium rounded-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Start Mission</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </a>

                <a
                  href="/ide"
                  class="px-3 py-2 border border-border hover:bg-surface-raised text-xs font-medium text-foreground-secondary hover:text-foreground rounded-sm transition-colors cursor-pointer"
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
