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
    TrendingUp,
    ShieldCheck,
    FlaskConical,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import {
    MasterySunburst,
    GrowthTrajectoryTimeline,
    IllustrationFrame,
    CompetencyRowList
  } from '$lib/components';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);
  let pathways = $derived(data.pathways);

  // Progressive disclosure for advanced geometric visualizations
  let showDeepGeometry = $state(false);
  let deepVisualMode = $state<'sunburst' | 'trajectory'>('sunburst');
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
  <!-- 1. GREETING & CONTEXT HEADER -->
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
          Good morning, {learner.fullName.split(' ')[0]}.
        </h1>
        <span class="px-2.5 py-0.5 rounded-sm text-xs font-medium bg-(--accent-primary-subtle) text-(--accent-primary) border border-(--border-subtle)">
          Class 8
        </span>
      </div>
      <p class="text-sm text-(--text-secondary)">
        Your learning map is moving forward • <span class="font-medium text-(--text-primary)">{learner.schoolName}</span>
      </p>
    </div>

    <!-- Quick Navigation Actions -->
    <div class="flex items-center gap-3">
      <a
        href="/student/assessment"
        class="px-4 py-2 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <Activity class="w-4 h-4" />
        <span>Diagnostic</span>
      </a>
      <a
        href="/student/mentor"
        class="px-4 py-2 rounded-sm surface-card text-(--text-primary) hover:bg-(--surface-sunken) font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer border border-(--border-subtle)"
      >
        <Sparkles class="w-4 h-4 text-(--accent-primary)" />
        <span>AI Guide</span>
      </a>
    </div>
  </header>

  <!-- 2. DOMINANT NEXT ACTION: TODAY'S RECOMMENDED FOCUS -->
  <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
    <!-- Active Maker Studio Illustration -->
    <div class="lg:col-span-7">
      <IllustrationFrame
        src="/images/illustrations/student_workshop.jpg"
        alt="Asian student in engineering maker lab calibrating a kinematic robotic arm with blueprints"
        aspectRatio="16:9"
        badge="Active STEM Project Mission"
        caption="Studio Lab • Kinematic Linkage & Robotic Articulation Trial (Class 8 Maker Track)"
        credit="Verified Evidence Record #EVD-3904"
      />
    </div>

    <!-- Next Action Decision Card -->
    <div class="lg:col-span-5 surface-card rounded-sm p-6 sm:p-8 border-l-4 border-l-(--accent-warning) flex flex-col justify-between space-y-6">
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-warning)">
            Today's Recommended Focus
          </span>
          <span class="text-[11px] px-2 py-0.5 rounded-sm bg-(--accent-warning-subtle) text-(--accent-warning) font-medium border border-(--border-subtle)">
            20 min session
          </span>
        </div>
        <h2 class="text-xl font-bold text-(--text-primary) leading-snug">
          Strengthen Proportional Equations & Rates
        </h2>
        <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
          You already demonstrate advanced spatial visualization in 3D modeling and linkage assembly. Strengthening proportional reasoning unlocks higher confidence in Robotics and Machine Intelligence pathways.
        </p>
      </div>

      <div class="pt-4 border-t border-(--border-subtle) flex items-center justify-between gap-4">
        <span class="text-xs text-(--text-muted)">Non-punitive growth sprint</span>
        <a
          href="/student/assessment"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-(--accent-warning) text-white hover:opacity-90 font-medium text-xs sm:text-sm transition-all shadow-sm cursor-pointer"
        >
          <span>Start Practice</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- 3. DEMONSTRATED STRENGTHS & CAPABILITIES (Horizontal Comparison Default) -->
  <section class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-(--border-subtle) pb-3">
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-primary)">
          Capabilities
        </span>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight mt-0.5">
          What You're Getting Good At
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Anchored in verified assessments, classroom challenges, and hands-on project missions.
        </p>
      </div>

      <!-- Progressive Disclosure Toggle -->
      <button
        type="button"
        onclick={() => (showDeepGeometry = !showDeepGeometry)}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm surface-card text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer self-start sm:self-auto"
      >
        <span>{showDeepGeometry ? 'Hide Deep Geometry' : 'Explore Radial Map & Trajectory'}</span>
        {#if showDeepGeometry}
          <ChevronUp class="w-3.5 h-3.5" />
        {:else}
          <ChevronDown class="w-3.5 h-3.5" />
        {/if}
      </button>
    </div>

    <!-- Primary Analytical View: Horizontal Comparison Rows -->
    <CompetencyRowList
      competencies={learner.competencies}
      evidence={evidence}
      role="student"
      onViewDeepMap={() => (showDeepGeometry = true)}
    />

    <!-- Deep Geometric Visualization (Progressive Disclosure) -->
    {#if showDeepGeometry}
      <div class="p-6 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
          <span class="text-xs font-semibold text-(--text-primary)">
            Advanced Geometric Representations
          </span>
          <div class="flex items-center gap-1 p-0.5 rounded-sm bg-(--surface-raised) border border-(--border-subtle) text-xs">
            <button
              type="button"
              onclick={() => (deepVisualMode = 'sunburst')}
              class="px-2.5 py-1 rounded-sm font-medium transition-all {deepVisualMode === 'sunburst' ? 'bg-(--accent-primary) text-white' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
            >
              Mastery Sunburst
            </button>
            <button
              type="button"
              onclick={() => (deepVisualMode = 'trajectory')}
              class="px-2.5 py-1 rounded-sm font-medium transition-all {deepVisualMode === 'trajectory' ? 'bg-(--accent-primary) text-white' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
            >
              Growth Trajectory
            </button>
          </div>
        </div>

        {#if deepVisualMode === 'sunburst'}
          <MasterySunburst />
        {:else}
          <GrowthTrajectoryTimeline />
        {/if}
      </div>
    {/if}
  </section>

  <!-- 4. EXPLORE PATHWAYS & TRY-BEFORE-YOU-CHOOSE MISSIONS -->
  <section class="space-y-6">
    <div class="flex items-baseline justify-between border-b border-(--border-subtle) pb-3">
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
          Field Exploration
        </span>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight mt-0.5">
          Fields Where Your Strengths Matter
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Test your authentic curiosity with hands-on miniature projects before committing to academic streams.
        </p>
      </div>
      <a href="/student/pathways" class="text-xs font-semibold text-(--accent-primary) hover:underline inline-flex items-center gap-1">
        <span>View all pathways</span>
        <ChevronRight class="w-3.5 h-3.5" />
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each pathways as pathway}
        {@const illustration = pathway.id === 'PATH-ROBOTICS'
          ? { src: '/images/illustrations/pathway_robotics.jpg', alt: 'Asian engineering student calibrating precision robotic joint on blueprint' }
          : { src: '/images/illustrations/pathway_bio.jpg', alt: 'Asian student researching botanical biomimicry and cellular biology' }}
        <div class="surface-card rounded-sm overflow-hidden flex flex-col justify-between hover:border-(--accent-primary) transition-all border border-(--border-subtle)">
          <!-- Editorial Pathway Thumbnail Banner -->
          <div class="relative aspect-3/2 w-full overflow-hidden border-b border-(--border-subtle) bg-(--surface-sunken)">
            <img
              src={illustration.src}
              alt={illustration.alt}
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-280 hover:scale-[1.02]"
            />
            <div class="absolute top-3 left-3 z-10">
              <span class="px-2.5 py-1 rounded-sm bg-(--surface-canvas)/90 backdrop-blur-xs border border-(--border-subtle) text-[10px] font-semibold uppercase tracking-wider text-(--text-primary)">
                {pathway.field.replace('_', ' ')}
              </span>
            </div>
            <div class="absolute top-3 right-3 z-10">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-sm badge-growth border border-(--border-subtle)">
                {pathway.id === 'PATH-ROBOTICS' ? 'Strong Foundation (4 / 6 Demonstrated)' : 'Strong Foundation (5 / 6 Demonstrated)'}
              </span>
            </div>
          </div>

          <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-(--text-primary)">
                {pathway.title}
              </h3>
              <p class="text-xs text-(--text-secondary) leading-relaxed">
                {pathway.overview}
              </p>
            </div>

            <!-- Featured Mini-Mission -->
            {#if pathway.missions && pathway.missions.length > 0}
              {@const task = pathway.missions[0]}
              <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-(--text-primary) flex items-center gap-1.5">
                    <FlaskConical class="w-3.5 h-3.5 text-(--accent-indigo)" />
                    Try Mission: {task.title}
                  </span>
                  <span class="text-[11px] text-(--text-muted)">{task.durationMinutes} mins</span>
                </div>
                <p class="text-[11px] text-(--text-secondary) leading-normal line-clamp-2">
                  {task.scenario}
                </p>
              </div>
            {/if}

            <div class="pt-3 flex items-center justify-between border-t border-(--border-subtle)">
              <a
                href="/student/pathways"
                class="text-xs font-medium text-(--accent-primary) hover:underline flex items-center gap-1"
              >
                <span>Inspect Roadmap</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
              <a
                href="/student/mentor"
                class="px-3.5 py-1.5 rounded-sm surface-card hover:bg-(--surface-sunken) text-xs font-medium text-(--text-primary) border border-(--border-subtle) transition-colors"
              >
                Discuss with Guide
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 5. RECENT VERIFIED EVIDENCE STREAM (Clear Provenance & Humane Language) -->
  <section class="space-y-4">
    <div class="flex items-baseline justify-between border-b border-(--border-subtle) pb-3">
      <div>
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-success)">
          Longitudinal Journey
        </span>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight mt-0.5">
          Verified Evidence Log
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Auditable evidence demonstrating your abilities across projects, diagnostics, and observations.
        </p>
      </div>
      <span class="text-xs text-(--text-muted)">
        {evidence.length} Verified Entries
      </span>
    </div>

    <div class="space-y-3">
      {#each evidence.slice(0, 4) as item}
        <div class="surface-card p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-(--border-subtle)">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-sm font-medium text-[11px] bg-(--surface-sunken) border border-(--border-subtle) text-(--text-secondary)">
                {item.sourceType.replace('_', ' ').toUpperCase()}
              </span>
              <span class="text-[11px] text-(--text-muted)">
                {new Date(item.observedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <p class="font-medium text-(--text-primary)">
              {item.sourceTitle}
            </p>
            <p class="text-[11px] text-(--text-secondary) line-clamp-1">
              {item.summary}
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0 self-start sm:self-center">
            <div class="text-right">
              <span class="text-[11px] font-semibold text-(--accent-success) block">
                Strong Evidence
              </span>
              <span class="text-[10px] text-(--text-muted)">
                Direct Demonstration
              </span>
            </div>
            <ShieldCheck class="w-4 h-4 text-(--accent-success)" />
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
