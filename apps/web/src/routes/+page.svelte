<script lang="ts">
  import {
    Activity,
    Compass,
    Shield,
    Users,
    GraduationCap,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Layers,
    Cpu,
    Target,
    BookOpen,
    Building2,
    Sliders,
    Lock,
    BrainCircuit
  } from 'lucide-svelte';
  import { IllustrationFrame } from '$lib/components';

  let { data } = $props();

  const workspaces = [
    {
      title: 'Student',
      category: 'Experience',
      subtitle: 'Ages 10–16 (Classes 5–10)',
      description: 'Discover demonstrated strengths, master foundational gaps, and test real-world passion with hands-on STEM missions.',
      href: '/student',
      icon: GraduationCap,
      badge: 'Discovery & Map',
      tag: 'Anaya Verma (Class 8)'
    },
    {
      title: 'Family',
      category: 'Experience',
      subtitle: 'Parent Alignment & Consensus',
      description: 'Replace anxiety with plain-language developmental summaries, concrete home actions, and collaborative pathway exploration.',
      href: '/parent',
      icon: Shield,
      badge: 'Family Consensus',
      tag: 'Rajesh Verma (Father)'
    },
    {
      title: 'Educator',
      category: 'Experience',
      subtitle: 'Teacher Copilot & Interventions',
      description: 'Action-first queue grouping learners automatically by misconception clusters with targeted exercises.',
      href: '/teacher',
      icon: Users,
      badge: 'Classroom Copilot',
      tag: 'Meera Sen (Class 8-A)'
    },
    {
      title: 'Guidance',
      category: 'Experience',
      subtitle: 'Counselor Center & Triage',
      description: 'Prioritize student caseloads, inspect longitudinal evidence trails, and navigate multidimensional career horizons.',
      href: '/counselor',
      icon: BookOpen,
      badge: 'Guidance Caseload',
      tag: 'Dr. Rao (Specialist)'
    },
    {
      title: 'Institution',
      category: 'Console',
      subtitle: 'Admin Governance & Compliance',
      description: 'Carbon-disciplined high-density table views for learner rosters, staff permissions, and verifiable audit trails.',
      href: '/admin',
      icon: Building2,
      badge: 'Enterprise Console',
      tag: 'DPIS Administration'
    },
    {
      title: 'Intelligence Studio',
      category: 'Console',
      subtitle: 'Item Authoring & Psychometrics',
      description: 'Calibrated item authoring, mathematical parameter estimation, and information curves for psychometricians.',
      href: '/author',
      icon: Sliders,
      badge: 'Psychometrics Studio',
      tag: 'Item Bank Authoring'
    }
  ];

  const pillars = [
    {
      title: 'Evidence Before Inference',
      desc: 'Every claimed competency is anchored to auditable evidence: adaptive diagnostic checks, teacher observations, and physical project artifacts.',
      icon: Layers
    },
    {
      title: 'Growth Before Labeling',
      desc: 'Never assign fixed IQ scores, permanent ability classifications, or deterministic career exclusions. When prerequisites show gaps, we provide targeted sprints.',
      icon: Compass
    },
    {
      title: 'Deterministic Scoring',
      desc: 'Scores and psychometric ability estimates are computed by deterministic algorithms, never by raw unconstrained LLMs. AI explains; algorithms score; humans decide.',
      icon: Activity
    },
    {
      title: 'Child Safety & Privacy by Design',
      desc: 'Built around parental consent verification, strict data minimization, relationship-scoped row level security, and zero advertising to minors.',
      icon: Lock
    }
  ];
</script>

<div class="py-12 sm:py-20 space-y-24">
  <!-- Editorial Hero Section -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-(--border-subtle) bg-(--surface-sunken) text-xs font-medium text-(--accent-primary)">
      <Sparkles class="w-3.5 h-3.5" />
      <span>CREED OS • WAY 2.0 Calm Intelligence</span>
    </div>

    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-(--text-primary) leading-[1.14]">
      Understand how a learner grows.<br />
      <span class="text-(--accent-primary)">Assess deeply. Learn personally. Explore freely.</span>
    </h1>

    <p class="text-base sm:text-lg text-(--text-secondary) leading-relaxed max-w-2xl mx-auto">
      Continuous learner intelligence connecting adaptive diagnostics, verifiable real-world project evidence, and transparent pathway navigation.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <a
        href="/student"
        class="px-6 py-3 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <span>Explore Student Map</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <a
        href="/student/assessment"
        class="px-6 py-3 rounded-sm surface-card hover:bg-(--surface-sunken) text-(--text-primary) font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer border border-(--border-subtle)"
      >
        <Activity class="w-4 h-4 text-(--accent-primary)" />
        <span>Try Adaptive Diagnostic</span>
      </a>
    </div>
  </section>

  <!-- Editorial Centerpiece Illustration (8px expressive radius) -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <IllustrationFrame
      src="/images/illustrations/hero_observatory.jpg"
      alt="Asian learner in stone observatory reviewing celestial charts and botanical journals"
      aspectRatio="16:9"
      priority={true}
      badge="Evidence Horizon"
      caption="The Learner Observatory • Longitudinal intelligence anchoring every ability claim to tangible diagnostic and project evidence."
      credit="CREED OS • Fine Art Mixed-Media Archive"
    />
  </section>

  <!-- Sample Learner Map Showcase Card (4px radius, qualitative developmental tiers) -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="surface-elevated rounded-sm p-8 sm:p-10 border border-(--border-subtle) space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--border-subtle) pb-4">
        <div>
          <span class="text-xs font-semibold uppercase text-(--accent-indigo)">
            Sample Learner Profile
          </span>
          <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary) mt-0.5">
            Anaya Verma • Class 8 (Middle Stage)
          </h2>
        </div>
        <div class="flex items-center gap-2 text-xs font-medium text-(--accent-success) px-3 py-1 rounded-sm bg-(--accent-success-subtle) border border-(--border-subtle)">
          <CheckCircle2 class="w-4 h-4" />
          <span>Longitudinal Graph Verified</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
          <span class="text-xs font-medium text-(--text-muted)">Core Demonstrated Strength</span>
          <p class="font-bold text-(--text-primary) text-sm">Spatial Reasoning & 3D Modeling</p>
          <p class="text-xs text-(--text-secondary)">Advanced (4.5 / 5.0) • 2 verified assessments</p>
        </div>

        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
          <span class="text-xs font-medium text-(--text-muted)">Active Growth Focus</span>
          <p class="font-bold text-(--text-primary) text-sm">Quantitative Proportional Rates</p>
          <p class="text-xs text-(--text-secondary)">Developing (2.8 / 5.0) • 4-week sprint active</p>
        </div>

        <div class="p-4 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
          <span class="text-xs font-medium text-(--text-muted)">Pathway Alignment</span>
          <p class="font-bold text-(--text-primary) text-sm">Robotics & Autonomous Systems</p>
          <p class="text-xs text-(--text-secondary)">Strong Foundation (4 / 6 Demonstrated)</p>
        </div>
      </div>

      <div class="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-(--text-muted)">
        <span>Anchored in longitudinal evidence • Built around parental consent and data minimization</span>
        <a href="/student" class="text-(--accent-primary) font-semibold hover:underline flex items-center gap-1 cursor-pointer">
          <span>Open Full Interactive Student View</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- Six Purpose-Built Workspaces Grid (4px radius) -->
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        Six Purpose-Built Experiences
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        A single coherent intelligence engine, tailored in density, vocabulary, and cognitive jobs for each role.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each workspaces as ws}
        <a
          href={ws.href}
          class="surface-card rounded-sm p-6 flex flex-col justify-between space-y-4 hover:border-(--accent-primary) transition-all group cursor-pointer border border-(--border-subtle)"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-sm bg-(--surface-sunken) text-(--accent-primary) flex items-center justify-center border border-(--border-subtle)">
                <ws.icon class="w-5 h-5" />
              </div>
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-(--surface-sunken) text-(--text-muted) border border-(--border-subtle)">
                {ws.badge}
              </span>
            </div>

            <div>
              <h3 class="text-base font-bold text-(--text-primary) group-hover:text-(--accent-primary) transition-colors flex items-center justify-between">
                <span>{ws.title}</span>
                <ArrowRight class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p class="text-[11px] font-medium text-(--text-muted) mt-0.5">{ws.subtitle}</p>
            </div>

            <p class="text-xs text-(--text-secondary) leading-relaxed">
              {ws.description}
            </p>
          </div>

          <div class="pt-4 border-t border-(--border-subtle) text-[11px] text-(--text-muted) font-medium">
            Role: <span class="text-(--text-primary)">{ws.tag}</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- Core Educational Principles -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        Core Educational Principles
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Why CREED OS breaks out of the "quiz app" and "generic AI wrapper" categories.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each pillars as pillar}
        <div class="surface-card rounded-sm p-6 space-y-3 border border-(--border-subtle)">
          <div class="w-8 h-8 rounded-sm bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center border border-(--border-subtle)">
            <pillar.icon class="w-4 h-4" />
          </div>
          <h3 class="text-base font-bold text-(--text-primary)">{pillar.title}</h3>
          <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">{pillar.desc}</p>
        </div>
      {/each}
    </div>
  </section>
</div>
