<script lang="ts">
  import {
    Compass,
    CheckCircle2,
    ArrowRight,
    FlaskConical,
    Sparkles,
    ChevronDown,
    ChevronUp,
    ShieldCheck
  } from 'lucide-svelte';
  import { getCompetencyDescriptor } from '@core-os/ui';
  import { WaySection } from '$lib/components';

  let { data } = $props();
  let pathways = $derived(data.pathways);
  let learner = $derived(data.learner);

  let selectedPathwayId = $state<string>('PATH-ROBOTICS');
  let selectedPathway = $derived(
    pathways.find((p) => p.id === selectedPathwayId) || pathways[0]
  );

  let showBenchmarkMetadata = $state(false);

  function calculateComparison(pathway: typeof selectedPathway) {
    let metCount = 0;
    const requirements = pathway.requirements.map((req) => {
      const demonstrated = learner.competencies[req.competency]?.score || 2.5;
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
  <header class="space-y-1 pb-4 border-b border-(--border-subtle)">
    <div class="flex items-center gap-2">
      <Compass class="w-5 h-5 text-(--accent-primary)" />
      <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
        Pathway Exploration
      </h1>
    </div>
    <p class="text-xs sm:text-sm text-(--text-secondary) max-w-2xl leading-relaxed">
      Experience authentic project missions before choosing academic streams. We highlight alignment, not fixed labels.
    </p>
  </header>

  <!-- 2. FIELD SELECTOR TILES (Qualitative foundation badges, 4px radius) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {#each pathways as p}
      {@const isSelected = selectedPathwayId === p.id}
      <button
        type="button"
        onclick={() => (selectedPathwayId = p.id)}
        class="text-left p-5 rounded-sm border transition-all cursor-pointer {isSelected ? 'surface-card border-(--accent-primary) ring-1 ring-(--accent-primary)' : 'surface-card hover:bg-(--surface-sunken) border-(--border-subtle)'}"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-(--accent-indigo)">
            {p.field.replace('_', ' ')}
          </span>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-sm {p.id === 'PATH-ROBOTICS' ? 'bg-(--accent-warning-subtle) text-(--accent-warning)' : 'bg-(--accent-success-subtle) text-(--accent-success)'} border border-(--border-subtle)">
            {p.id === 'PATH-ROBOTICS' ? '4 of 6 Demonstrated' : '5 of 6 Demonstrated'}
          </span>
        </div>
        <h3 class="text-base font-bold text-(--text-primary) mt-2">{p.title}</h3>
        <p class="text-xs text-(--text-secondary) mt-1 line-clamp-2 leading-relaxed">{p.tagline}</p>
      </button>
    {/each}
  </div>

  <!-- 3. FEATURED FIELD EDITORIAL SPREAD -->
  <div class="space-y-10">
    <!-- Hero Visual + Overview (Artwork carries emotion, UI carries information) -->
    <div class="surface-card rounded-sm overflow-hidden border border-(--border-subtle)">
      <div class="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div class="lg:col-span-7 relative aspect-16/9 lg:aspect-auto overflow-hidden bg-(--surface-sunken)">
          <img
            src={illustrations[selectedPathway.id]?.src || illustrations['PATH-ROBOTICS'].src}
            alt={illustrations[selectedPathway.id]?.alt || 'Field illustration'}
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-280 hover:scale-[1.01]"
          />
          <div class="absolute top-4 left-4">
            <span class="px-3 py-1 rounded-sm bg-(--surface-canvas)/90 backdrop-blur-xs border border-(--border-subtle) text-xs font-semibold uppercase tracking-wider text-(--text-primary)">
              {selectedPathway.field.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div class="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div class="space-y-3">
            <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary) tracking-tight leading-snug">
              {selectedPathway.title}
            </h2>
            <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
              {selectedPathway.overview}
            </p>
          </div>

          <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
            <span class="text-[10px] font-semibold uppercase tracking-wider text-(--text-muted) block">
              Curiosity Alignment
            </span>
            <p class="text-xs font-semibold text-(--accent-success)">
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
            <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-(--text-primary)">{req.domainName}</span>
                <span class="text-[11px] font-semibold {req.delta >= 0 ? 'text-(--accent-success)' : 'text-(--accent-warning)'}">
                  {req.delta >= 0 ? 'Demonstrated' : 'Focus Area'}
                </span>
              </div>
              <p class="text-xs text-(--text-secondary)">{req.descriptor}</p>
            </div>
          {/each}
        </div>

        <!-- Progressive disclosure for full requirements & benchmark provenance -->
        <div class="flex justify-end pt-1">
          <button
            type="button"
            onclick={() => (showBenchmarkMetadata = !showBenchmarkMetadata)}
            class="text-xs font-medium text-(--accent-primary) hover:underline inline-flex items-center gap-1 cursor-pointer"
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
          <div class="p-5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-4 animate-in fade-in duration-200">
            <div class="flex items-center justify-between text-xs text-(--text-muted) border-b border-(--border-subtle) pb-2">
              <span>All Pathway Competency Standards</span>
              <span>Normative cohort: Age 13–14 calibrated items</span>
            </div>

            <div class="space-y-2">
              {#each comparison.requirements as req}
                <div class="flex items-center justify-between text-xs py-1 border-b border-(--border-subtle)/50">
                  <span class="text-(--text-primary) font-medium">{req.domainName}</span>
                  <div class="flex items-center gap-4">
                    <span class="text-(--text-secondary)">Your Evidence: {req.descriptor}</span>
                    <span class="font-semibold {req.delta >= 0 ? 'text-(--accent-success)' : 'text-(--accent-warning)'}">
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
        <div class="surface-card p-6 rounded-sm border border-(--border-subtle) flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 rounded-sm bg-(--accent-indigo-subtle) text-(--accent-indigo) font-semibold">
                Maker Mission
              </span>
              <span class="text-[11px] text-(--text-muted)">45 mins</span>
            </div>
            <h3 class="text-base font-bold text-(--text-primary)">
              RoboBridge Structural Optimization
            </h3>
            <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
              Design a lightweight truss carrying 5x its own weight across a gap for an exploration rover.
            </p>
          </div>

          <div class="pt-3 border-t border-(--border-subtle)">
            <a
              href="/student/mentor"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
            >
              <FlaskConical class="w-4 h-4" />
              <span>Launch Mission with AI Guide</span>
            </a>
          </div>
        </div>

        <div class="surface-card p-6 rounded-sm border border-(--border-subtle) flex flex-col justify-between space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="px-2 py-0.5 rounded-sm bg-(--accent-indigo-subtle) text-(--accent-indigo) font-semibold">
                Algorithm Mission
              </span>
              <span class="text-[11px] text-(--text-muted)">30 mins</span>
            </div>
            <h3 class="text-base font-bold text-(--text-primary)">
              Autonomous Maze Wall-Follower
            </h3>
            <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
              Tune ultrasonic proximity sensor thresholds for collision-free rover navigation in subterranean caves.
            </p>
          </div>

          <div class="pt-3 border-t border-(--border-subtle)">
            <a
              href="/student/mentor"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm surface-card hover:bg-(--surface-sunken) text-(--text-primary) font-medium text-xs sm:text-sm transition-colors border border-(--border-subtle) cursor-pointer"
            >
              <Sparkles class="w-4 h-4 text-(--accent-indigo)" />
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
        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
          <span class="text-[10px] font-semibold text-(--accent-indigo) uppercase block">University Degree</span>
          <h4 class="font-bold text-(--text-primary) text-sm">B.Tech Mechatronics</h4>
          <p class="text-[11px] text-(--text-secondary) leading-relaxed">
            Undergraduate degree with kinematic lab work and control systems engineering.
          </p>
        </div>

        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
          <span class="text-[10px] font-semibold text-(--accent-primary) uppercase block">Applied Diploma</span>
          <h4 class="font-bold text-(--text-primary) text-sm">Robotics Automation</h4>
          <p class="text-[11px] text-(--text-secondary) leading-relaxed">
            Industrial automation programming and direct mechatronic equipment training.
          </p>
        </div>

        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
          <span class="text-[10px] font-semibold text-(--accent-success) uppercase block">Applied Portfolio</span>
          <h4 class="font-bold text-(--text-primary) text-sm">Open-Source Robotics</h4>
          <p class="text-[11px] text-(--text-secondary) leading-relaxed">
            Demonstrated ROS contributions, physical maker build logs, and challenge awards.
          </p>
        </div>
      </div>
    </WaySection>
  </div>
</div>
