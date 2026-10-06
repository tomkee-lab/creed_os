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
    Zap,
    FlaskConical,
    Sparkles,
    ChevronDown,
    ChevronUp
  } from 'lucide-svelte';
  import { getCompetencyDescriptor } from '@core-os/ui';
  import { IllustrationFrame } from '$lib/components';

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

    const isStrong = metCount >= 4;
    return {
      metCount,
      totalCount: pathway.requirements.length,
      isStrong,
      requirements
    };
  }

  let comparison = $derived(calculateComparison(selectedPathway));
</script>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
  <!-- Header: Invitational Exploration -->
  <header class="space-y-1.5 pb-3 border-b border-(--border-subtle)">
    <div class="flex items-center gap-2">
      <Compass class="w-6 h-6 text-(--accent-primary)" />
      <h1 class="text-2xl sm:text-3xl font-bold text-(--text-primary) tracking-tight">
        Pathway Exploration & Real-World Projects
      </h1>
    </div>
    <p class="text-xs sm:text-sm text-(--text-secondary) max-w-3xl">
      We never assign fixed career labels or close doors. We measure foundational alignment, highlight growth areas, and invite you to try hands-on project trials before you choose your educational stream.
    </p>
  </header>

  <!-- Pathway Selector Grid (Qualitative Tiers, 4px Radius) -->
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {#each pathways as p}
      {@const isSelected = selectedPathwayId === p.id}
      <button
        type="button"
        onclick={() => (selectedPathwayId = p.id)}
        class="text-left p-5 rounded-sm border transition-all cursor-pointer {isSelected ? 'surface-elevated border-(--accent-primary) ring-1 ring-(--accent-primary)' : 'surface-card hover:bg-(--surface-sunken) border-(--border-subtle)'}"
      >
        <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
          {p.field.replace('_', ' ')}
        </span>
        <h3 class="text-base font-bold text-(--text-primary) mt-1">{p.title}</h3>
        <p class="text-xs text-(--text-secondary) mt-2 line-clamp-2 leading-relaxed">{p.tagline}</p>

        <div class="mt-4 pt-3 border-t border-(--border-subtle) flex items-center justify-between text-xs">
          <span class="text-(--text-muted) font-medium">Demonstrated Fit</span>
          <span class="font-semibold {p.id === 'PATH-ROBOTICS' ? 'text-(--accent-warning)' : 'text-(--accent-success)'}">
            {p.id === 'PATH-ROBOTICS' ? 'Strong Foundation (4/6 Met)' : 'Strong Foundation (5/6 Met)'}
          </span>
        </div>
      </button>
    {/each}
  </div>

  <!-- Selected Pathway Detail View -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Left 2 Cols: Invitation, Editorial Context & Skill Comparison -->
    <div class="lg:col-span-2 space-y-8">
      <!-- Field Introduction Card with Tactile Editorial Illustration -->
      <div class="surface-card rounded-sm p-6 space-y-5 border border-(--border-subtle)">
        <IllustrationFrame
          src={selectedPathway.id === 'PATH-ROBOTICS'
            ? '/images/illustrations/pathway_robotics.jpg'
            : '/images/illustrations/pathway_bio.jpg'}
          alt={selectedPathway.id === 'PATH-ROBOTICS'
            ? 'Asian engineering student calibrating precision robotic joint on blueprint'
            : 'Asian student researching botanical biomimicry and cellular biology'}
          aspectRatio="3:2"
          badge={selectedPathway.field.replace('_', ' ')}
          caption="{selectedPathway.title} • Experiential blueprint and foundational competency alignment."
          credit="CREED OS • Fine Art Mixed-Media Series"
        />

        <div class="space-y-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-(--accent-indigo)">
            Featured Field
          </span>
          <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary)">
            {selectedPathway.title}
          </h2>
          <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">
            {selectedPathway.overview}
          </p>
        </div>

        <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-xs text-(--text-secondary) flex items-center justify-between">
          <span class="font-medium">Curiosity Outlook:</span>
          <span class="font-semibold text-(--accent-success)">
            High Opportunity Area • Multidisciplinary Hardware & Software
          </span>
        </div>
      </div>

      <!-- Why This Field Fits You: Capability Alignment (Progressive disclosure for benchmarks) -->
      <div class="surface-card rounded-sm p-6 space-y-5 border border-(--border-subtle)">
        <div class="flex items-center justify-between border-b border-(--border-subtle) pb-3">
          <div>
            <h3 class="text-base font-bold text-(--text-primary)">
              Why This Field Fits You
            </h3>
            <p class="text-xs text-(--text-muted) mt-0.5">
              {comparison.metCount} of {comparison.totalCount} foundational competencies demonstrated
            </p>
          </div>
          <button
            type="button"
            onclick={() => (showBenchmarkMetadata = !showBenchmarkMetadata)}
            class="text-[11px] font-medium text-(--accent-primary) hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Benchmark context</span>
            {#if showBenchmarkMetadata}
              <ChevronUp class="w-3 h-3" />
            {:else}
              <ChevronDown class="w-3 h-3" />
            {/if}
          </button>
        </div>

        {#if showBenchmarkMetadata}
          <div class="p-3 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) text-[11px] text-(--text-secondary) space-y-1">
            <span class="font-bold text-(--text-primary) block">Normative Benchmark Source:</span>
            <p>Age 13–14 STEM Foundation Benchmark cohort (N=1,420 multi-curriculum calibrated items). Not an aptitude ceiling or deterministic filter.</p>
          </div>
        {/if}

        <div class="space-y-3">
          {#each comparison.requirements as req}
            <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div class="space-y-0.5">
                <span class="font-semibold text-(--text-primary) text-sm">{req.domainName}</span>
                <span class="text-[11px] text-(--text-muted) block">Weight: {req.importance}</span>
              </div>

              <div class="flex items-center gap-6">
                <div class="text-right">
                  <span class="text-[10px] text-(--text-muted) uppercase block">Your Evidence</span>
                  <span class="font-semibold text-(--text-primary)">{req.descriptor}</span>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-(--text-muted) uppercase block">Pathway Requirement</span>
                  <span class="font-medium text-(--text-secondary)">{req.minimumLevel >= 3.5 ? 'Strong' : 'Developing'}</span>
                </div>
                <div class="w-20 text-right">
                  {#if req.delta >= 0}
                    <span class="text-[11px] font-semibold text-(--accent-success)">Met</span>
                  {:else}
                    <span class="text-[11px] font-semibold text-(--accent-warning)">Sprint Focus</span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>

        <!-- Constructive Growth Narrative -->
        <div class="p-4 rounded-sm border border-(--accent-warning)/40 bg-(--accent-warning-subtle) space-y-2 mt-4">
          <div class="flex items-center gap-2 text-sm font-bold text-(--text-primary)">
            <Zap class="w-4 h-4 text-(--accent-warning)" />
            <span>Constructive Growth Opportunity</span>
          </div>
          <p class="text-xs text-(--text-secondary) leading-relaxed">
            Your spatial and computational reasoning are well above the requirements for this engineering field. Practicing proportional scaling opens up deeper mechanical design challenges.
          </p>
          <div class="pt-1 text-xs font-semibold text-(--text-primary)">
            Recommended Next Step: Try one of the hands-on project trials below with your Socratic Guide.
          </div>
        </div>
      </div>

      <!-- Multiple Pathways to Mastery (No Single Exam Trap) -->
      <div class="surface-card rounded-sm p-6 space-y-4 border border-(--border-subtle)">
        <div>
          <h3 class="text-base font-bold text-(--text-primary)">
            Possible Routes & Education Tracks
          </h3>
          <p class="text-xs text-(--text-muted) mt-0.5">
            Real-world mastery has multiple viable routes, not just single high-stakes exams.
          </p>
        </div>

        <div class="grid sm:grid-cols-3 gap-3 text-xs">
          <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <span class="text-[10px] font-semibold text-(--accent-indigo) uppercase">University Degree</span>
            <h4 class="font-bold text-(--text-primary)">B.Tech Mechatronics</h4>
            <p class="text-[11px] text-(--text-secondary)">Undergraduate degree with kinematic lab work.</p>
          </div>
          <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <span class="text-[10px] font-semibold text-(--accent-primary) uppercase">Applied Diploma</span>
            <h4 class="font-bold text-(--text-primary)">Robotics Automation</h4>
            <p class="text-[11px] text-(--text-secondary)">Industrial PLC programming & direct equipment training.</p>
          </div>
          <div class="p-3.5 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1.5">
            <span class="text-[10px] font-semibold text-(--accent-success) uppercase">Applied Portfolio</span>
            <h4 class="font-bold text-(--text-primary)">Open-Source Robotics</h4>
            <p class="text-[11px] text-(--text-secondary)">Demonstrated ROS contributions and physical build logs.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Col: Try-Before-You-Choose Project Missions -->
    <div class="space-y-6">
      <div class="surface-card rounded-sm p-6 space-y-5 border border-(--border-subtle)">
        <div>
          <div class="flex items-center gap-2">
            <FlaskConical class="w-5 h-5 text-(--accent-indigo)" />
            <h3 class="text-lg font-bold text-(--text-primary)">
              Try Before You Choose
            </h3>
          </div>
          <p class="text-xs text-(--text-secondary) mt-1.5 leading-relaxed">
            Experience miniature project challenges to test your curiosity and grit before committing to educational streams.
          </p>
        </div>

        <div class="space-y-4">
          <div class="p-4 rounded-sm border border-(--border-subtle) bg-(--surface-sunken) space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-(--text-primary)">
                RoboBridge Structural Optimization
              </span>
              <span class="text-[11px] font-medium text-(--text-muted)">45 mins</span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              Design a lightweight bridge truss carrying 5x its own weight across a canyon for a supply rover.
            </p>
            <div class="pt-1">
              <a
                href="/student/mentor"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-sm bg-(--accent-primary) text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Sparkles class="w-3.5 h-3.5" />
                <span>Launch Mission with AI Guide</span>
              </a>
            </div>
          </div>

          <div class="p-4 rounded-sm border border-(--border-subtle) bg-(--surface-sunken) space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-(--text-primary)">
                Autonomous Maze Wall-Follower
              </span>
              <span class="text-[11px] font-medium text-(--text-muted)">30 mins</span>
            </div>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              Tune ultrasonic proximity sensor thresholds for collision-free rover navigation in subterranean caves.
            </p>
            <div class="pt-1">
              <a
                href="/student/mentor"
                class="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-sm surface-card text-(--text-primary) hover:bg-(--surface-sunken) text-xs font-medium transition-colors border border-(--border-subtle) cursor-pointer"
              >
                <Sparkles class="w-3.5 h-3.5 text-(--accent-primary)" />
                <span>Launch Mission with AI Guide</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
