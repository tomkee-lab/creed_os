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

  let { data } = $props();

  const workspaces = [
    {
      title: 'Student Experience',
      subtitle: 'Ages 10–16 (Classes 5–10)',
      description: 'Discover demonstrated strengths, master foundational gaps, and test real-world passion with hands-on STEM missions.',
      href: '/student',
      icon: GraduationCap,
      badge: 'Discovery & Map',
      tag: 'Anaya Verma (Class 8)'
    },
    {
      title: 'Parent Alignment',
      subtitle: 'DPDP Verified Consent',
      description: 'Replace anxiety with plain-language developmental summaries, concrete home actions, and collaborative pathway exploration.',
      href: '/parent',
      icon: Shield,
      badge: 'Family Consensus',
      tag: 'Rajesh Verma (Father)'
    },
    {
      title: 'Teacher Copilot',
      subtitle: 'Differentiated Interventions',
      description: 'Action-first queue grouping learners automatically by misconception clusters with targeted exercises.',
      href: '/teacher',
      icon: Users,
      badge: 'Classroom Copilot',
      tag: 'Meera Sen (Class 8-A)'
    },
    {
      title: 'Counselor Center',
      subtitle: 'Guidance & Triage',
      description: 'Prioritize student caseloads, inspect longitudinal evidence trails, and navigate multidimensional career horizons.',
      href: '/counselor',
      icon: BookOpen,
      badge: 'Guidance Caseload',
      tag: 'Dr. Rao (Specialist)'
    },
    {
      title: 'Admin Operations',
      subtitle: 'Institutional Governance',
      description: 'Carbon-disciplined high-density table views for learner rosters, staff permissions, and DPDP audit trails.',
      href: '/admin',
      icon: Building2,
      badge: 'Enterprise Console',
      tag: 'DPIS Administration'
    },
    {
      title: 'Item Studio',
      subtitle: 'Psychometrics & Calibration',
      description: 'Calibrated item authoring, 3PL IRT parameter estimation, and Fisher Information curves for psychometricians.',
      href: '/author',
      icon: Sliders,
      badge: '3PL IRT Engine',
      tag: 'Item Bank Authoring'
    }
  ];

  const pillars = [
    {
      title: 'Deterministic Psychometrics',
      desc: '3PL IRT with Gauss-Hermite EAP quadrature. Precise ability estimates scored deterministically, never hallucinated by raw LLMs.',
      icon: Activity
    },
    {
      title: 'Longitudinal Evidence Graph',
      desc: 'Every claimed competency is anchored to auditable evidence atoms: diagnostic checks, classroom observations, and project missions.',
      icon: Layers
    },
    {
      title: 'Constructive Mismatch Engine',
      desc: 'We never close doors on a child’s dream. When prerequisites show gaps, we provide targeted foundation sprints and practical trials.',
      icon: Compass
    },
    {
      title: 'DPDP Act Child Safety & RLS',
      desc: 'Zero advertising to minors, verified parental consent state machine, relationship-scoped row level security, and ephemeral processing.',
      icon: Lock
    }
  ];
</script>

<div class="py-12 sm:py-20 space-y-24">
  <!-- Editorial Hero Section -->
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-(--border-subtle) bg-(--surface-sunken) text-xs font-medium text-(--accent-primary)">
      <Sparkles class="w-3.5 h-3.5" />
      <span>WAYFORGE • Learner Intelligence & Navigation OS</span>
    </div>

    <h1 class="text-4xl sm:text-6xl font-bold tracking-tight text-(--text-primary) leading-[1.12]">
      Measure deeply.<br />
      <span class="text-(--accent-primary)">Decide with evidence.</span>
    </h1>

    <p class="text-base sm:text-lg text-(--text-secondary) leading-relaxed max-w-xl mx-auto">
      Continuous learner intelligence connecting adaptive diagnostics, real-world project evidence, and transparent pathway navigation.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
      <a
        href="/student"
        class="px-6 py-3 rounded-none bg-(--accent-primary) hover:opacity-90 text-white font-medium text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
      >
        <span>Explore Student Map</span>
        <ArrowRight class="w-4 h-4" />
      </a>
      <a
        href="/student/assessment"
        class="px-6 py-3 rounded-none surface-card hover:bg-(--surface-sunken) text-(--text-primary) font-medium text-sm transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Activity class="w-4 h-4 text-(--accent-primary)" />
        <span>Try Adaptive Diagnostic</span>
      </a>
    </div>
  </section>

  <!-- Interactive Learner Map Showcase Card -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="surface-elevated p-8 sm:p-10 border border-(--border-subtle) space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-(--border-subtle) pb-4">
        <div>
          <span class="text-xs font-semibold uppercase text-(--accent-indigo)">
            Sample Learner Profile
          </span>
          <h2 class="text-xl sm:text-2xl font-bold text-(--text-primary)">
            Anaya Verma • Class 8 (Middle Stage)
          </h2>
        </div>
        <div class="flex items-center gap-2 text-xs font-medium text-(--accent-success) px-3 py-1 rounded-full bg-(--accent-success-subtle)">
          <CheckCircle2 class="w-4 h-4" />
          <span>Longitudinal Graph Verified</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
        <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
          <span class="text-xs font-medium text-(--text-muted)">Core Demonstrated Strength</span>
          <p class="font-bold text-(--text-primary) text-sm">Spatial Reasoning & 3D Modeling</p>
          <p class="text-xs text-(--text-secondary)">Advanced (4.5 / 5.0) • 2 verified assessments</p>
        </div>

        <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
          <span class="text-xs font-medium text-(--text-muted)">Active Growth Focus</span>
          <p class="font-bold text-(--text-primary) text-sm">Quantitative Proportional Rates</p>
          <p class="text-xs text-(--text-secondary)">Developing (2.8 / 5.0) • 4-week sprint active</p>
        </div>

        <div class="p-4 rounded-xl bg-(--surface-sunken) border border-(--border-subtle) space-y-1">
          <span class="text-xs font-medium text-(--text-muted)">Best Pathway Match</span>
          <p class="font-bold text-(--text-primary) text-sm">Robotics & Autonomous Systems</p>
          <p class="text-xs text-(--text-secondary)">74% Baseline Fit • 2 missions pending</p>
        </div>
      </div>

      <div class="pt-4 flex items-center justify-between text-xs text-(--text-muted)">
        <span>Scored with deterministic 3PL IRT • DPDP Act Verified Consent</span>
        <a href="/student" class="text-(--accent-primary) font-semibold hover:underline flex items-center gap-1">
          <span>Open Full Interactive Student View</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </section>

  <!-- Six Purpose-Built Workspaces Grid -->
  <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="text-center max-w-2xl mx-auto space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        Six Purpose-Built Experiences
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        A single coherent intelligence engine, tailored in density, vocabulary, and workflows for each role.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each workspaces as ws}
        <a
          href={ws.href}
          class="surface-card p-6 flex flex-col justify-between space-y-4 hover:border-(--accent-primary) transition-all group cursor-pointer"
        >
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 rounded-lg bg-(--surface-sunken) text-(--accent-primary) flex items-center justify-center border border-(--border-subtle)">
                <ws.icon class="w-5 h-5" />
              </div>
              <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-(--surface-sunken) text-(--text-muted) border border-(--border-subtle)">
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
            Demo Context: <span class="text-(--text-primary)">{ws.tag}</span>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <!-- Architectural Moats & Educational Principles -->
  <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <div class="text-center max-w-xl mx-auto space-y-2">
      <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
        Core Educational Principles
      </h2>
      <p class="text-xs sm:text-sm text-(--text-secondary)">
        Why Core_OS breaks out of the "quiz app" and "generic AI wrapper" categories.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {#each pillars as pillar}
        <div class="surface-card p-6 space-y-3 border border-(--border-subtle)">
          <div class="w-8 h-8 rounded-lg bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center">
            <pillar.icon class="w-4 h-4" />
          </div>
          <h3 class="text-base font-bold text-(--text-primary)">{pillar.title}</h3>
          <p class="text-xs sm:text-sm text-(--text-secondary) leading-relaxed">{pillar.desc}</p>
        </div>
      {/each}
    </div>
  </section>
</div>
