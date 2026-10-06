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
    FlaskConical
  } from 'lucide-svelte';
  import { getCompetencyDescriptor } from '@core-os/ui';
  import { MasterySunburst, GrowthTrajectoryTimeline, IllustrationFrame } from '$lib/components';

  let { data } = $props();
  let learner = $derived(data.learner);
  let evidence = $derived(data.evidence);
  let pathways = $derived(data.pathways);

  let activeVisualTab = $state<'sunburst' | 'trajectory' | 'bars'>('sunburst');

  // Group competencies into strengths and focus areas
  const competenciesList = $derived(
    Object.entries(learner.competencies).map(([key, val]) => {
      const descriptor = getCompetencyDescriptor(val.score, 'student');
      const domainName = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      const count = evidence.filter((e: any) => e.competency === key).length;
      return {
        key,
        name: domainName,
        score: val.score,
        descriptor: descriptor.label,
        colorClass: descriptor.colorClass,
        evidenceCount: count,
        isStrength: val.score >= 3.5
      };
    }).sort((a, b) => b.score - a.score)
  );

  const topStrengths = $derived(competenciesList.filter(c => c.isStrength));
  const focusAreas = $derived(competenciesList.filter(c => !c.isStrength));
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- Hero Section: Student-First Welcome -->
  <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-(--border-subtle)">
    <div class="space-y-1.5">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
          My Learning & Future Map
        </h1>
        <span class="px-2.5 py-0.5 rounded-none text-xs font-medium bg-(--accent-primary-subtle) text-(--accent-primary) border border-(--border-subtle)">
          Class 8
        </span>
      </div>
      <p class="text-sm text-(--text-secondary)">
        Continuous evidence for <span class="font-semibold text-(--text-primary)">{learner.fullName}</span> • {learner.schoolName}
      </p>
    </div>

    <!-- Quick Exploration Triggers -->
    <div class="flex items-center gap-3">
      <a
        href="/student/assessment"
        class="px-4 py-2.5 rounded-none bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
      >
        <Activity class="w-4 h-4" />
        <span>Take Diagnostic Check</span>
      </a>
      <a
        href="/student/mentor"
        class="px-4 py-2.5 rounded-none surface-card text-(--text-primary) hover:bg-(--surface-sunken) font-medium text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
      >
        <Sparkles class="w-4 h-4 text-(--accent-primary)" />
        <span>Ask Socratic Guide</span>
      </a>
    </div>
  </div>

  <!-- 1. ACTIVE STEM WORKSHOP & TODAY'S ACTION FOCUS -->
  <section class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- Active Mission Illustration Card -->
    <div class="lg:col-span-7">
      <IllustrationFrame
        src="/images/illustrations/student_workshop.jpg"
        alt="Asian student in engineering maker lab calibrating a kinematic robotic arm with blueprints"
        aspectRatio="16:9"
        badge="Active STEM Project Mission"
        caption="Studio Lab • Hands-on Kinematic Linkage & Robotic Articulation Trial (Class 8 Maker Track)"
        credit="Verifiable Project Evidence Atom #EVD-3904"
      />
    </div>

    <!-- Actionable Focus Queue -->
    <div class="lg:col-span-5 surface-card rounded-none p-6 border-l-4 border-l-(--accent-warning) flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-warning)">
            Today's Recommended Focus
          </span>
          <span class="text-[11px] px-2 py-0.5 rounded-none bg-(--accent-warning-subtle) text-(--accent-warning) font-medium border border-(--border-subtle)">
            20 min session
          </span>
        </div>
        <h2 class="text-lg font-bold text-(--text-primary)">
          Strengthen Proportional Equations & Rates
        </h2>
        <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
          You already demonstrate high spatial intuition in 3D modeling and linkage assembly. Strengthening proportional reasoning unlocks higher readiness in Robotics and Machine Intelligence pathways.
        </p>
      </div>

      <div class="pt-2 border-t border-(--border-subtle) flex items-center justify-between">
        <span class="text-xs text-(--text-muted)">Non-punitive growth sprint</span>
        <a
          href="/student/assessment"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-none bg-(--accent-warning) text-white hover:opacity-90 font-medium text-xs sm:text-sm transition-all cursor-pointer"
        >
          <span>Start Practice</span>
          <ArrowRight class="w-4 h-4" />
        </a>
      </div>
    </div>
  </section>

  <!-- 2. DEMONSTRATED STRENGTHS & CAPABILITIES (Interactive Sunburst, Trajectory & Horizontal rhythm) -->
  <section class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-(--border-subtle) pb-3">
      <div>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight">
          Your Demonstrated Capabilities
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Anchored in verified assessments, classroom challenges, and project missions.
        </p>
      </div>

      <!-- Interactive View Toggle -->
      <div class="flex items-center gap-1 p-1 rounded-none bg-(--surface-sunken) border border-(--border-subtle) text-xs shrink-0">
        <button
          type="button"
          onclick={() => activeVisualTab = 'sunburst'}
          class="px-3 py-1.5 rounded-none font-medium transition-all {activeVisualTab === 'sunburst' ? 'bg-(--surface-raised) text-(--text-primary) shadow-sm' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
        >
          Mastery Sunburst
        </button>
        <button
          type="button"
          onclick={() => activeVisualTab = 'trajectory'}
          class="px-3 py-1.5 rounded-none font-medium transition-all {activeVisualTab === 'trajectory' ? 'bg-(--surface-raised) text-(--text-primary) shadow-sm' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
        >
          Growth Trajectory
        </button>
        <button
          type="button"
          onclick={() => activeVisualTab = 'bars'}
          class="px-3 py-1.5 rounded-none font-medium transition-all {activeVisualTab === 'bars' ? 'bg-(--surface-raised) text-(--text-primary) shadow-sm' : 'text-(--text-secondary) hover:text-(--text-primary)'}"
        >
          Dimension List
        </button>
      </div>
    </div>

    {#if activeVisualTab === 'sunburst'}
      <MasterySunburst />
    {:else if activeVisualTab === 'trajectory'}
      <GrowthTrajectoryTimeline />
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {#each competenciesList as comp}
          <div class="space-y-2 group">
            <div class="flex items-center justify-between text-sm">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-(--text-primary)">{comp.name}</span>
                <span class="text-[11px] px-2 py-0.5 rounded-none font-medium {comp.colorClass}">
                  {comp.descriptor}
                </span>
              </div>
              <div class="flex items-center gap-1.5 text-xs text-(--text-muted) font-medium">
                <span>{comp.score.toFixed(1)} / 5.0</span>
                <span>•</span>
                <span>{comp.evidenceCount} evidence items</span>
              </div>
            </div>

            <!-- Progress Bar (Clean Nordic style) -->
            <div class="h-2 w-full bg-(--surface-sunken) rounded-none overflow-hidden border border-(--border-subtle)">
              <div
                class="h-full rounded-none transition-all duration-500 bg-(--accent-primary) group-hover:opacity-90"
                style="width: {(comp.score / 5.0) * 100}%;"
              ></div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>

  <!-- 3. EXPLORE PATHWAYS & TRY-BEFORE-YOU-CHOOSE MISSIONS -->
  <section class="space-y-6">
    <div class="flex items-baseline justify-between border-b border-(--border-subtle) pb-3">
      <div>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight">
          Explore Pathways & Hands-on Missions
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Test your authentic interest with real-world miniature projects before committing to academic streams.
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
        <div class="surface-card rounded-none overflow-hidden flex flex-col justify-between hover:border-(--accent-primary) transition-all">
          <!-- Editorial Pathway Thumbnail Banner -->
          <div class="relative aspect-3/2 w-full overflow-hidden border-b border-(--border-subtle) bg-(--surface-sunken)">
            <img
              src={illustration.src}
              alt={illustration.alt}
              loading="lazy"
              class="w-full h-full object-cover rounded-none transition-transform duration-500 hover:scale-[1.02]"
            />
            <div class="absolute top-2.5 left-2.5 z-10">
              <span class="px-2 py-0.5 rounded-none bg-(--surface-canvas)/90 backdrop-blur-xs border border-(--border-subtle) text-[10px] font-semibold uppercase tracking-wider text-(--text-primary)">
                {pathway.field.replace('_', ' ')}
              </span>
            </div>
            <div class="absolute top-2.5 right-2.5 z-10">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-none badge-growth border border-(--border-subtle)">
                {pathway.id === 'PATH-ROBOTICS' ? '74% Alignment' : '82% Alignment'}
              </span>
            </div>
          </div>

          <div class="p-6 space-y-4 flex-1 flex flex-col justify-between">
            <div class="space-y-3">
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
              <div class="p-3.5 rounded-none bg-(--surface-sunken) border border-(--border-subtle) space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-(--text-primary) flex items-center gap-1.5">
                    <FlaskConical class="w-3.5 h-3.5 text-(--accent-indigo)" />
                    Try: {task.title}
                  </span>
                  <span class="text-[11px] text-(--text-muted)">{task.durationMinutes} mins</span>
                </div>
                <p class="text-[11px] text-(--text-secondary) leading-normal line-clamp-2">
                  {task.scenario}
                </p>
              </div>
            {/if}

            <div class="pt-2 flex items-center justify-between border-t border-(--border-subtle)">
              <a
                href="/student/pathways"
                class="text-xs font-medium text-(--accent-primary) hover:underline flex items-center gap-1"
              >
                <span>Inspect Roadmap</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </a>
              <a
                href="/student/mentor"
                class="px-3 py-1.5 rounded-none surface-card hover:bg-(--surface-sunken) text-xs font-medium text-(--text-primary) border border-(--border-subtle) transition-colors"
              >
                Discuss with Guide
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 4. RECENT VERIFIED EVIDENCE STREAM (Clear Provenance) -->
  <section class="space-y-4">
    <div class="flex items-baseline justify-between border-b border-(--border-subtle) pb-3">
      <div>
        <h2 class="text-xl font-bold text-(--text-primary) tracking-tight">
          Verified Evidence Log
        </h2>
        <p class="text-xs text-(--text-muted) mt-0.5">
          Auditable evidence demonstrating your abilities across time.
        </p>
      </div>
      <span class="text-xs text-(--text-muted)">
        {evidence.length} Verified Entries
      </span>
    </div>

    <div class="space-y-3">
      {#each evidence.slice(0, 4) as item}
        <div class="surface-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-none font-medium text-[11px] bg-(--surface-sunken) border border-(--border-subtle) text-(--text-secondary)">
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
                {Math.round(item.confidence * 100)}% Confidence
              </span>
              <span class="text-[10px] text-(--text-muted) font-mono">
                L{item.evidenceStrength} Verified
              </span>
            </div>
            <ShieldCheck class="w-4 h-4 text-(--accent-success)" />
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>
