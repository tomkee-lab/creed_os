<script lang="ts">
  import {
    CheckCircle2,
    ArrowRight,
    FlaskConical,
    Sparkles,
    ChevronDown,
    ChevronUp,
    ShieldCheck
  } from 'lucide-svelte';
  import { Icon } from '$lib/components/icons';
  import { getCompetencyDescriptor } from '@core-os/ui';
  import { WaySection } from '$lib/components';
  import PathwayGraphCanvas from '$lib/components/pathways/PathwayGraphCanvas.svelte';

  let { data } = $props();
  let pathways = $derived(data.pathways || []);
  let learner = $derived(data.learner);

  let viewMode = $state<'cards' | 'graph'>('cards');
  let selectedPathwayId = $state<string>('PATH-ROBOTICS');
  let selectedPathway = $derived(
    pathways.find((p) => p.id === selectedPathwayId) || pathways[0]
  );

  let showBenchmarkMetadata = $state(false);

  function calculateComparison(pathway: typeof selectedPathway) {
    if (!pathway) {
      return { metCount: 0, totalCount: 0, requirements: [] };
    }
    let metCount = 0;
    const requirements = pathway.requirements.map((req) => {
      const demonstrated = learner?.competencies[req.competency]?.score || 2.5;
      const delta = Math.round((demonstrated - req.minimumLevel) * 10) / 10;
      if (delta >= 0) metCount++;
      return {
        ...req,
        demonstrated,
        delta,
        descriptor: getCompetencyDescriptor(demonstrated, 'student').label,
        domainName: req.competency.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      };
    });

    return {
      metCount,
      totalCount: pathway.requirements.length,
      requirements
    };
  }

  let comparison = $derived(calculateComparison(selectedPathway));

  const illustrations: Record<string, { src: string; alt: string }> = {
    'PATH-ROBOTICS': {
      src: '/images/illustrations/pathway_robotics.jpg',
      alt: 'Asian engineering student calibrating precision robotic joint on blueprint'
    },
    'PATH-BIO': {
      src: '/images/illustrations/pathway_bio.jpg',
      alt: 'Asian student researching botanical biomimicry and cellular biology'
    }
  };
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- 1. EDITORIAL HEADER: 1 title, 1 sentence, no giant walls of text -->
  <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <Icon icon="ph:compass-bold" class="w-5 h-5 text-mint" />
        <h1 class="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Pathway Exploration
        </h1>
      </div>
      <p class="text-xs sm:text-sm text-foreground-secondary max-w-2xl leading-relaxed">
        Experience authentic project missions before choosing academic streams. We highlight alignment, not fixed labels.
      </p>
    </div>

    <!-- Dual-Mode Segmented Control: Cards vs Skill DAG -->
    <div class="inline-flex items-center p-0.5 rounded-none bg-surface-2 border border-border-subtle shrink-0">
      <button
        type="button"
        onclick={() => (viewMode = 'cards')}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium transition-micro cursor-pointer {viewMode === 'cards'
          ? 'bg-surface-3 text-foreground shadow-xs font-semibold'
          : 'text-foreground-secondary hover:text-foreground'}"
      >
        <Icon icon="carbon:grid" class="w-3.5 h-3.5" />
        <span>Cards View</span>
      </button>
      <button
        type="button"
        onclick={() => (viewMode = 'graph')}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-medium transition-micro cursor-pointer {viewMode === 'graph'
          ? 'bg-mint text-mint-foreground shadow-xs font-semibold'
          : 'text-foreground-secondary hover:text-foreground'}"
      >
        <Icon icon="carbon:network-4" class="w-3.5 h-3.5" />
        <span>Skill DAG View</span>
      </button>
    </div>
  </header>

  {#if viewMode === 'graph'}
    <!-- INTERACTIVE PATHWAY GRAPH CANVAS (@xyflow/svelte) -->
    <div class="space-y-4">
      <div class="flex items-center justify-between text-xs text-foreground-secondary">
        <span>Interactive Prerequisite & Milestone DAG · Pan, zoom, and select a node to view diagnostic requirements</span>
        <span class="font-mono text-mint text-[11px]">{selectedPathway.title} Selected</span>
      </div>
      <PathwayGraphCanvas
        {pathways}
        {selectedPathwayId}
        {learner}
        onselect={(id) => (selectedPathwayId = id)}
      />
    </div>
  {/if}

  <!-- 2. FIELD SELECTOR TILES (Qualitative foundation badges, 4px radius) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 {viewMode === 'graph' ? 'hidden sm:grid opacity-70' : ''}">
    {#each pathways as p}
      {@const isSelected = selectedPathwayId === p.id}
      <button
        type="button"
        onclick={() => (selectedPathwayId = p.id)}
        class="text-left p-4 rounded-none border transition-colors cursor-pointer {isSelected ? 'bg-surface border-brand ring-1 ring-brand' : 'bg-surface hover:bg-surface-subtle border-border'}"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            {#if p.id === 'PATH-ROBOTICS'}
              <Icon icon="tabler:robot" class="w-3.5 h-3.5 text-brand" />
            {:else if p.id === 'PATH-BIO'}
              <Icon icon="tabler:plant" class="w-3.5 h-3.5 text-mint" />
            {:else}
              <Icon icon="tabler:variable" class="w-3.5 h-3.5 text-violet" />
            {/if}
            <span class="text-[11px] font-semibold uppercase tracking-wider text-ai">
              {p.field.replace('_', ' ')}
            </span>
          </div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-none {p.id === 'PATH-ROBOTICS' ? 'bg-attention-subtle text-attention' : 'bg-positive-subtle text-positive'} border border-border">
            {p.id === 'PATH-ROBOTICS' ? '4 of 6 Demonstrated' : '5 of 6 Demonstrated'}
          </span>
        </div>
        <h3 class="text-base font-bold text-ink mt-2">{p.title}</h3>
        <p class="text-xs text-ink-secondary mt-1 line-clamp-2 leading-relaxed">{p.tagline}</p>
      </button>
    {/each}
  </div>

  <!-- 3. FEATURED FIELD EDITORIAL SPREAD -->
  <div class="space-y-10">
    <!-- Hero Visual + Overview (Artwork carries emotion, UI carries information) -->
    <div class="bg-surface rounded-none overflow-hidden border border-border">
      <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div class="lg:col-span-7 relative aspect-video lg:aspect-auto overflow-hidden bg-surface-subtle">
          <img
            src={illustrations[selectedPathway.id]?.src || illustrations['PATH-ROBOTICS'].src}
            alt={illustrations[selectedPathway.id]?.alt || 'Field illustration'}
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-280 hover:scale-[1.01]"
          />
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 rounded-none bg-canvas/90 backdrop-blur-xs border border-border text-xs font-semibold uppercase tracking-wider text-ink">
              {selectedPathway.field.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div class="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div class="space-y-3">
            <h2 class="text-xl sm:text-2xl font-bold text-ink tracking-tight leading-snug">
              {selectedPathway.title}
            </h2>
            <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              {selectedPathway.overview}
            </p>
          </div>

          <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-1">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-ink-muted block">
              Curiosity Alignment
            </span>
            <p class="text-xs font-semibold text-positive">
              Strong Foundation demonstrated across kinematics and spatial modeling.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. WHY THIS FIELD MIGHT FIT YOU (Three clean evidence signals) -->
    <WaySection
      eyebrow="Competency Alignment"
      title="Why This Field Fits You"
      subtitle="{comparison.metCount} of {comparison.totalCount} foundational competencies demonstrated across project trials and diagnostics."
    >
      <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {#each comparison.requirements.slice(0, 3) as req}
            <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-ink">{req.domainName}</span>
                <span class="text-[11px] font-semibold {req.delta >= 0 ? 'text-positive' : 'text-attention'}">
                  {req.delta >= 0 ? 'Demonstrated' : 'Focus Area'}
                </span>
              </div>
              <p class="text-xs text-ink-secondary">{req.descriptor}</p>
            </div>
          {/each}
        </div>

        <!-- Progressive disclosure for full requirements & benchmark provenance -->
        <div class="flex justify-end pt-1">
          <button
            type="button"
            onclick={() => (showBenchmarkMetadata = !showBenchmarkMetadata)}
            class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>{showBenchmarkMetadata ? 'Hide detailed rubric' : 'Inspect all requirements & benchmark provenance'}</span>
            {#if showBenchmarkMetadata}
              <ChevronUp class="w-3.5 h-3.5" />
            {:else}
              <ChevronDown class="w-3.5 h-3.5" />
            {/if}
          </button>
        </div>

        {#if showBenchmarkMetadata}
          <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-4 animate-in fade-in duration-200">
            <div class="flex items-center justify-between text-xs text-ink-muted border-b border-border pb-2">
              <span>All Pathway Competency Standards</span>
              <span>Normative cohort: Age 13–14 calibrated items</span>
            </div>

            <div class="space-y-2">
              {#each comparison.requirements as req}
                <div class="flex items-center justify-between text-xs py-1 border-b border-border/50">
                  <span class="text-ink font-medium">{req.domainName}</span>
                  <div class="flex items-center gap-4">
                    <span class="text-ink-secondary">Your Evidence: {req.descriptor}</span>
                    <span class="font-semibold {req.delta >= 0 ? 'text-positive' : 'text-attention'}">
                      {req.delta >= 0 ? 'Demonstrated' : 'Sprint Focus'}
                    </span>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    </WaySection>

    <!-- 5. TRY IT: Two hands-on project trials -->
    <WaySection
      eyebrow="Hands-On Trials"
      title="Try-Before-You-Choose Missions"
      subtitle="Complete a miniature 30–45 minute mission to experience the actual thinking required in this field."
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-surface p-6 rounded-none border border-border flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 rounded-none bg-ai-subtle text-ai font-semibold">
                Maker Mission
              </span>
              <span class="text-[11px] text-ink-muted">45 mins</span>
            </div>
            <h3 class="text-base font-bold text-ink">
              RoboBridge Structural Optimization
            </h3>
            <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Design a lightweight truss carrying 5x its own weight across a gap for an exploration rover.
            </p>
          </div>

          <div class="pt-3 border-t border-border">
            <a
              href="/student/missions/robobridge"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
            >
              <FlaskConical class="w-4 h-4" />
              <span>Launch Mission Simulator</span>
            </a>
          </div>
        </div>

        <div class="bg-surface p-6 rounded-none border border-border flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 rounded-none bg-ai-subtle text-ai font-semibold">
                Algorithm Mission
              </span>
              <span class="text-[11px] text-ink-muted">30 mins</span>
            </div>
            <h3 class="text-base font-bold text-ink">
              Autonomous Maze Wall-Follower
            </h3>
            <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Tune ultrasonic proximity sensor thresholds for collision-free rover navigation in subterranean caves.
            </p>
          </div>

          <div class="pt-3 border-t border-border">
            <a
              href="/student/mentor"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-surface hover:bg-surface-subtle text-ink font-medium text-xs sm:text-sm transition-colors border border-border cursor-pointer"
            >
              <Sparkles class="w-4 h-4 text-ai" />
              <span>Launch Mission with AI Guide</span>
            </a>
          </div>
        </div>
      </div>
    </WaySection>

    <!-- 6. POSSIBLE EDUCATION ROUTES -->
    <WaySection
      eyebrow="Multiple Routes"
      title="Possible Routes & Tracks"
      subtitle="Mastery in this field can be reached through multiple valid educational pathways."
    >
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-1.5">
          <span class="text-[10px] font-semibold text-ai uppercase block">University Degree</span>
          <h4 class="font-bold text-ink text-sm">B.Tech Mechatronics</h4>
          <p class="text-[11px] text-ink-secondary leading-relaxed">
            Undergraduate degree with kinematic lab work and control systems engineering.
          </p>
        </div>

        <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-1.5">
          <span class="text-[10px] font-semibold text-brand uppercase block">Applied Diploma</span>
          <h4 class="font-bold text-ink text-sm">Robotics Automation</h4>
          <p class="text-[11px] text-ink-secondary leading-relaxed">
            Industrial automation programming and direct mechatronic equipment training.
          </p>
        </div>

        <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-1.5">
          <span class="text-[10px] font-semibold text-positive uppercase block">Applied Portfolio</span>
          <h4 class="font-bold text-ink text-sm">Open-Source Robotics</h4>
          <p class="text-[11px] text-ink-secondary leading-relaxed">
            Demonstrated ROS contributions, physical maker build logs, and challenge awards.
          </p>
        </div>
      </div>
    </WaySection>

    <!-- 7. READINESS & NEXT STEPS (Action-First UX & Qualitative Developmental Guidance) -->
    <WaySection
      eyebrow="Readiness & Next Steps"
      title="Your Path Forward"
      subtitle="Developmental preparation and concrete next actions to build confidence in this field."
    >
      <div class="space-y-6">
        <!-- Readiness Synthesis Card (Level 1 Signal + Level 2 Context) -->
        <div class="p-6 rounded-none bg-surface border border-border space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <div class="space-y-1">
              <span class="text-[11px] font-semibold uppercase tracking-wider text-ai">
                Developmental Readiness
              </span>
              <h3 class="text-lg font-bold text-ink">
                {comparison.metCount >= 5 ? 'Strong Foundation' : comparison.metCount >= 3 ? 'Developing Foundation' : 'Exploration Stage'}
              </h3>
              <p class="text-xs text-ink-secondary">
                {comparison.metCount} of {comparison.totalCount} foundational competencies demonstrated across verified diagnostics and project trials.
              </p>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none {comparison.metCount >= 4 ? 'bg-positive-subtle text-positive' : 'bg-attention-subtle text-attention'} text-xs font-semibold border border-border">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>{comparison.metCount >= 4 ? 'Pathway Aligned' : 'Growth Focus Area'}</span>
              </span>
            </div>
          </div>

          <!-- Competency Readiness Breakdown -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-2">
              <span class="text-[10px] font-semibold text-positive uppercase tracking-wider block">
                Demonstrated Strengths
              </span>
              <ul class="text-xs text-ink space-y-2">
                {#each comparison.requirements.filter(r => r.delta >= 0) as req}
                  <li class="flex items-center justify-between">
                    <span class="font-medium">{req.domainName}</span>
                    <span class="text-[11px] text-ink-secondary">{req.descriptor}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-2">
              <span class="text-[10px] font-semibold text-attention uppercase tracking-wider block">
                Targeted Bridge Focus
              </span>
              <ul class="text-xs text-ink space-y-2">
                {#each comparison.requirements.filter(r => r.delta < 0) as req}
                  <li class="flex items-center justify-between">
                    <span class="font-medium">{req.domainName}</span>
                    <span class="text-[11px] text-attention font-medium">Sprint Focus</span>
                  </li>
                {/each}
                {#if comparison.requirements.filter(r => r.delta < 0).length === 0}
                  <li class="text-xs text-ink-secondary italic">All prerequisite competencies currently demonstrated.</li>
                {/if}
              </ul>
            </div>
          </div>
        </div>

        <!-- Next Actions (Signal -> Context -> Action Primacy) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <!-- Step 1: Micro-practice Sprint -->
          <div class="p-4 rounded-none bg-surface border border-border flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[10px] font-bold uppercase tracking-wider text-brand">Action 1 • Practice</span>
                <span class="text-[11px] text-ink-muted">20 min</span>
              </div>
              <h4 class="text-sm font-bold text-ink">Targeted Foundation Sprint</h4>
              <p class="text-xs text-ink-secondary leading-relaxed">
                Strengthen rate equations and kinematic gear calculations in a 20-minute adaptive practice session.
              </p>
            </div>
            <a
              href="/student/assessment"
              class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-xs transition-colors cursor-pointer"
            >
              <span>Start Practice Sprint</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Step 2: Hands-on Project Mission -->
          <div class="p-4 rounded-none bg-surface border border-border flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[10px] font-bold uppercase tracking-wider text-ai">Action 2 • Authentic Trial</span>
                <span class="text-[11px] text-ink-muted">45 min</span>
              </div>
              <h4 class="text-sm font-bold text-ink">Hands-on Rover Mission</h4>
              <p class="text-xs text-ink-secondary leading-relaxed">
                Test mechanical intuition directly by optimizing a rover joint linkage with Socratic guidance.
              </p>
            </div>
            <a
              href="/student/mentor"
              class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-none bg-surface-subtle hover:bg-surface-raised text-ink border border-border font-medium text-xs transition-colors cursor-pointer"
            >
              <Sparkles class="w-3.5 h-3.5 text-ai" />
              <span>Launch Guided Mission</span>
            </a>
          </div>

          <!-- Step 3: Advisory Alignment -->
          <div class="p-4 rounded-none bg-surface border border-border flex flex-col justify-between space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Action 3 • Guidance</span>
                <span class="text-[11px] text-ink-muted">Discussion</span>
              </div>
              <h4 class="text-sm font-bold text-ink">Family & Counselor Dialogue</h4>
              <p class="text-xs text-ink-secondary leading-relaxed">
                Share this pathway exploration with your parents and school counselor to align future elective choices.
              </p>
            </div>
            <a
              href="/help"
              class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-none bg-surface-subtle hover:bg-surface-raised text-ink border border-border font-medium text-xs transition-colors cursor-pointer"
            >
              <span>View Guidance Resources</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </WaySection>
  </div>
</div>
