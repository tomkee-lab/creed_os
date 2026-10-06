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
    BookOpen,
    Building2,
    Sliders,
    Lock
  } from 'lucide-svelte';
  import { IllustrationFrame } from '$lib/components';

  let { data } = $props();

  const journeySteps = [
    {
      step: '01',
      title: 'Discover',
      tagline: 'Measure authentic strengths without pressure.',
      description: 'An adaptive diagnostic identifies Anaya’s spatial visualization and computational logic in under 20 minutes.'
    },
    {
      step: '02',
      title: 'Learn',
      tagline: 'Decompose challenges step-by-step.',
      description: 'The Socratic Guide asks questions that help her master proportional equations without ever dumping answers.'
    },
    {
      step: '03',
      title: 'Explore',
      tagline: 'Try fields before committing to streams.',
      description: 'A hands-on miniature robotics rover trial tests her curiosity, tactile grit, and real-world passion.'
    },
    {
      step: '04',
      title: 'Reflect',
      tagline: 'Evidence that builds shared trust.',
      description: 'Longitudinal demonstration records reassure parents, align counselors, and guide classroom teachers.'
    }
  ];

  const roleExperiences = [
    {
      title: 'Student Experience',
      role: 'Learner (Ages 10–16)',
      desc: 'Action-first daily learning map, hands-on maker missions, and Socratic mentorship.',
      href: '/student',
      icon: GraduationCap
    },
    {
      title: 'Family Alignment',
      role: 'Parents & Guardians',
      desc: 'Reassuring developmental summaries, collaborative home projects, and zero jargon.',
      href: '/parent',
      icon: Shield
    },
    {
      title: 'Classroom Copilot',
      role: 'Teachers & Faculty',
      desc: 'Automated misconception clusters and 1-click differentiated scaffolding assignments.',
      href: '/teacher',
      icon: Users
    },
    {
      title: 'Guidance Center',
      role: 'Counselors & Mentors',
      desc: 'Evidence-backed caseload triage, parent-student alignment, and multidisciplinary routes.',
      href: '/counselor',
      icon: BookOpen
    },
    {
      title: 'Institution Console',
      role: 'School Administrators',
      desc: 'High-density operational rosters, staff permissions, and verifiable DPDP consent trails.',
      href: '/admin',
      icon: Building2
    },
    {
      title: 'Intelligence Studio',
      role: 'Psychometricians',
      desc: '3PL IRT mathematical item calibration, item bank curation, and Fisher information curves.',
      href: '/author',
      icon: Sliders
    }
  ];

  const principles = [
    {
      title: 'Evidence Before Inference',
      desc: 'Every claimed capability is anchored to tangible diagnostic or project evidence atoms.',
      icon: Layers
    },
    {
      title: 'Growth Before Labeling',
      desc: 'Never assign fixed IQ ceilings or permanent career exclusions. Gaps are opportunities for sprints.',
      icon: Compass
    },
    {
      title: 'Deterministic Scoring',
      desc: 'Scores and psychometric ability estimates are computed by deterministic algorithms, never unconstrained LLMs.',
      icon: Activity
    },
    {
      title: 'Child Privacy by Design',
      desc: 'Parental consent verification, data minimization, relationship-scoped access, and zero minors advertising.',
      icon: Lock
    }
  ];
</script>

<div class="py-12 sm:py-20 space-y-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- 1. EDITORIAL HERO: Quiet Editorial Intelligence -->
  <section class="max-w-3xl mx-auto text-center space-y-6">
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border border-(--border-subtle) bg-(--surface-sunken) text-[11px] font-semibold text-(--accent-primary)">
      <Sparkles class="w-3.5 h-3.5" />
      <span>CREED OS • WAY 2.1 Quiet Editorial Intelligence</span>
    </div>

    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-(--text-primary) leading-tight">
      Understand how<br />
      <span class="text-(--accent-primary)">a learner grows.</span>
    </h1>

    <p class="text-base sm:text-lg text-(--text-secondary) leading-relaxed max-w-lg mx-auto">
      Assess deeply. Learn personally. Explore freely.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <a
        href="/student"
        class="px-6 py-2.5 rounded-sm bg-(--accent-primary) hover:opacity-90 text-white font-medium text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <span>Explore Experience</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <a
        href="/student/assessment"
        class="px-6 py-2.5 rounded-sm surface-card hover:bg-(--surface-sunken) text-(--text-primary) font-medium text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer border border-(--border-subtle)"
      >
        <Activity class="w-4 h-4 text-(--accent-primary)" />
        <span>Try Diagnostic</span>
      </a>
    </div>
  </section>

  <!-- 2. EDITORIAL VISUAL CENTERPIECE (8px Expressive Radius) -->
  <section class="max-w-5xl mx-auto">
    <IllustrationFrame
      src="/images/illustrations/hero_observatory.jpg"
      alt="Asian learner in stone observatory reviewing celestial charts and botanical journals"
      aspectRatio="16:9"
      priority={true}
      badge="The Learner Observatory"
      caption="Longitudinal intelligence connecting adaptive diagnostics, physical maker evidence, and transparent pathway navigation."
      credit="CREED OS • Fine Art Mixed-Media Archive"
    />
  </section>

  <!-- 3. ONE LEARNER JOURNEY: Discover -> Learn -> Explore -> Reflect -->
  <section class="space-y-8">
    <div class="space-y-1 text-center max-w-xl mx-auto">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-(--accent-primary) block">
        The Experience Journey
      </span>
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        One learner's path forward
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Follow Anaya from initial diagnostic discovery to verified real-world confidence.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each journeySteps as step}
        <div class="surface-card rounded-sm p-6 border border-(--border-subtle) space-y-3 flex flex-col justify-between hover:border-(--border-strong) transition-colors">
          <div class="space-y-2">
            <span class="text-xs font-mono font-bold text-(--accent-primary)">{step.step}</span>
            <h3 class="text-lg font-bold text-(--text-primary)">{step.title}</h3>
            <p class="text-xs font-medium text-(--accent-indigo)">{step.tagline}</p>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- 4. SIX PURPOSE-BUILT WORKSPACES (Clean 4px Tiles) -->
  <section class="space-y-8">
    <div class="space-y-1 text-center max-w-xl mx-auto">
      <span class="text-[11px] font-semibold uppercase tracking-wider text-(--accent-indigo) block">
        Ecosystem
      </span>
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        Six purpose-built experiences
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        One coherent intelligence model with role-calibrated density and cognitive jobs.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each roleExperiences as role}
        <a
          href={role.href}
          class="surface-card rounded-sm p-6 border border-(--border-subtle) space-y-3 flex flex-col justify-between hover:border-(--accent-primary) transition-all group cursor-pointer"
        >
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="w-9 h-9 rounded-sm bg-(--surface-sunken) text-(--accent-primary) flex items-center justify-center border border-(--border-subtle)">
                <role.icon class="w-4 h-4" />
              </div>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-(--surface-sunken) text-(--text-muted) border border-(--border-subtle)">
                {role.role}
              </span>
            </div>
            <h3 class="text-base font-bold text-(--text-primary) group-hover:text-(--accent-primary) transition-colors flex items-center justify-between">
              <span>{role.title}</span>
              <ArrowRight class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
            <p class="text-xs text-(--text-secondary) leading-relaxed">
              {role.desc}
            </p>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- 5. CORE PRINCIPLES: Non-Negotiable Foundations -->
  <section class="space-y-8">
    <div class="space-y-1 text-center max-w-xl mx-auto">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        Core Educational Principles
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Why CREED OS breaks out of the quiz app and generic AI wrapper categories.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each principles as p}
        <div class="surface-card rounded-sm p-6 border border-(--border-subtle) space-y-2.5">
          <div class="w-8 h-8 rounded-sm bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center border border-(--border-subtle)">
            <p.icon class="w-4 h-4" />
          </div>
          <h3 class="text-base font-bold text-(--text-primary)">{p.title}</h3>
          <p class="text-xs text-(--text-secondary) leading-relaxed">{p.desc}</p>
        </div>
      {/each}
    </div>
  </section>
</div>
