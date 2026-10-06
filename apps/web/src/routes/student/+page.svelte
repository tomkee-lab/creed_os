<script lang="ts">
  import {
    Activity,
    Sparkles,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import {
    MasterySunburst,
    GrowthTrajectoryTimeline,
    IllustrationFrame,
    CompetencyRowList,
    DecisionSurface,
    EvidenceDisclosure,
    WaySection,
    EditorialFeature
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
  <!-- 1. GREETING & CONTEXT: 1 title, 1 short sentence, quick actions -->
  <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4 border-b border-(--border-subtle)">
    <div class="space-y-1">
      <div class="flex items-center gap-2">
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
          Good morning, {learner.fullName.split(' ')[0]}.
        </h1>
        <span class="px-2.5 py-0.5 rounded-sm text-xs font-medium bg-(--surface-sunken) text-(--text-secondary) border border-(--border-subtle)">
          Class 8
        </span>
      </div>
      <p class="text-sm text-(--text-secondary)">
        Here's your next step to move your learning journey forward.
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
        <Sparkles class="w-4 h-4 text-(--accent-indigo)" />
        <span>Guided Studio</span>
      </a>
    </div>
  </header>

  <!-- 2. DOMINANT NEXT ACTION: TODAY'S FOCUS (Asymmetric 60/40 Editorial Balance) -->
  <section class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
    <!-- Active Maker Studio Illustration -->
    <div class="lg:col-span-6">
      <IllustrationFrame
        src="/images/illustrations/student_workshop.jpg"
        alt="Asian student in engineering maker lab calibrating a kinematic robotic arm with blueprints"
        aspectRatio="16:9"
        badge="Active Project Mission"
        caption="Studio Lab • Kinematic Linkage Trial (Class 8 Maker Track)"
        credit="Verified Record #EVD-3904"
      />
    </div>

    <!-- Proprietary DecisionSurface Pattern -->
    <div class="lg:col-span-6 flex flex-col justify-between">
      <DecisionSurface
        signal="Today's Recommended Focus"
        signalVariant="alert"
        title="Strengthen Proportional Equations & Rates"
        context="You already demonstrate advanced spatial visualization in 3D modeling and linkage assembly. Strengthening proportional reasoning unlocks higher confidence in Robotics and Machine Intelligence pathways."
        actionLabel="Start 20-min Practice"
        actionHref="/student/assessment"
        evidenceBadge="Direct Demonstration"
        disclosureTitle="Why this focus?"
        disclosureBody="Demonstrated across kinematics trial & 2 diagnostic questions. Connecting rate equations directly with mechanical gear ratios strengthens foundational fluency without repetitive drill."
        class="h-full justify-between"
      />
    </div>
  </section>

  <!-- 3. DEMONSTRATED STRENGTHS: What You're Getting Good At -->
  <WaySection
    eyebrow="Capabilities"
    title="What You're Getting Good At"
    subtitle="Anchored in verified assessments, classroom challenges, and hands-on project missions."
    actionHref="/student/progress"
    actionLabel="View all capabilities"
  >
    <div class="space-y-4">
      <!-- Primary Analytical View: Horizontal Comparison Rows -->
      <CompetencyRowList
        competencies={learner.competencies}
        evidence={evidence}
        role="student"
        onViewDeepMap={() => (showDeepGeometry = true)}
      />

      <!-- Progressive Disclosure Toggle for Advanced Geometry -->
      <div class="flex justify-end pt-1">
        <button
          type="button"
          onclick={() => (showDeepGeometry = !showDeepGeometry)}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm surface-card text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) transition-colors cursor-pointer"
        >
          <span>{showDeepGeometry ? 'Hide Deep Geometry' : 'Explore Radial Map & Trajectory'}</span>
          {#if showDeepGeometry}
            <ChevronUp class="w-3.5 h-3.5" />
          {:else}
            <ChevronDown class="w-3.5 h-3.5" />
          {/if}
        </button>
      </div>

      <!-- Deep Geometric Visualization (Progressive Disclosure) -->
      {#if showDeepGeometry}
        <div class="p-6 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-4 animate-in fade-in duration-200">
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
    </div>
  </WaySection>

  <!-- 4. EXPLORE PATHWAYS & TRY-BEFORE-YOU-CHOOSE MISSIONS -->
  <WaySection
    eyebrow="Field Exploration"
    title="Fields Where Your Strengths Matter"
    subtitle="Test authentic curiosity with hands-on miniature projects before committing to academic streams."
    actionHref="/student/pathways"
    actionLabel="View all pathways"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each pathways as pathway}
        {@const illustration = pathway.id === 'PATH-ROBOTICS'
          ? { src: '/images/illustrations/pathway_robotics.jpg', alt: 'Asian engineering student calibrating precision robotic joint on blueprint' }
          : { src: '/images/illustrations/pathway_bio.jpg', alt: 'Asian student researching botanical biomimicry and cellular biology' }}
        <EditorialFeature
          src={illustration.src}
          alt={illustration.alt}
          aspectRatio="3:2"
          badge={pathway.field.replace('_', ' ')}
          title={pathway.title}
          description={pathway.overview}
          caption={pathway.id === 'PATH-ROBOTICS' ? 'Strong Foundation (4 / 6 Demonstrated)' : 'Strong Foundation (5 / 6 Demonstrated)'}
          actionLabel="Try Mission"
          actionHref="/student/pathways"
          secondaryLabel="Inspect Roadmap"
          secondaryHref="/student/pathways"
        />
      {/each}
    </div>
  </WaySection>

  <!-- 5. RECENT EVIDENCE: Clear Provenance via EvidenceDisclosure -->
  <WaySection
    eyebrow="Auditable Journey"
    title="Verified Evidence Log"
    subtitle="Auditable demonstrations across projects, diagnostics, and classroom observations."
    actionHref="/student/progress"
    actionLabel="View full timeline"
  >
    <EvidenceDisclosure
      title="Recent Verified Demonstrations"
      evidenceStrength="4 Foundational Records"
      records={evidence.slice(0, 4)}
    />
  </WaySection>
</div>
