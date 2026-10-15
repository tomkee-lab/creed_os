<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    ArrowRight,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    ChevronDown,
    Layers,
    Activity,
    Database,
    Users,
    BookOpen,
    Cpu,
    Award,
    FileText,
    Check,
    Lock,
    Sliders,
    Search,
    Info,
    Calendar,
    ArrowLeft,
    Shield
  } from 'lucide-svelte';
  import { Icon } from '$lib/components/icons';
  import { revealOnScroll } from '$lib/motion/reveal.js';
  import { magneticHover, countUp } from '$lib/motion/interaction.js';
  import { initScrollTrigger, isReducedMotion } from '$lib/motion/scroll.js';
  import {
    EvidenceRating,
    GlyphMatrix
  } from '$lib/components';
  import * as Sheet from '$lib/components/ui/sheet';

  // --- Interactive State for Capability Studio ---
  const assessmentSteps = [
    { id: 1, label: 'Adaptive CAT', description: 'Item Response Diagnostics' },
    { id: 2, label: 'Maker Build', description: 'Kinematic Linkage Fabrication' },
    { id: 3, label: 'Socratic Inquiry', description: 'Dialogue & Deduction' },
    { id: 4, label: 'Growth Synthesis', description: 'Longitudinal Profiling' }
  ];
  let currentStep = $state(2);

  async function handleExploreStudio(e: MouseEvent) {
    if (import.meta.env.DEV) {
      e.preventDefault();
      try {
        await fetch('/api/auth/dev-switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'studio' })
        });
      } catch {
        // Fallback
      }
      goto('/studio');
    }
  }

  const phaseDetails = [
    {
      id: 1,
      badge: 'PHASE 01 // ADAPTIVE DIAGNOSTIC',
      code: 'EVD-CAT-01',
      title: 'Adaptive Item Response Convergence',
      subtitle: 'Deterministic 3-Parameter Logistic (3PL) Item Response Theory evaluation.',
      metric1: { label: 'Ability Estimate', value: 'θ = +0.85', desc: 'SE < 0.28' },
      metric2: { label: 'Convergence Pace', value: '18 Items', desc: 'Early stop criteria met' },
      artifactType: 'Dynamic Item Response Trace',
      artifactMeta: 'Item Discrimination a=1.42 · Fisher Info Peak',
      a: '1.42',
      b: '+0.38',
      c: '0.18',
      tag: 'Completed',
      status: 'completed',
      rubricLabel: 'Quantitative & Proportional Reasoning',
      rubricRating: 4,
      rubricDesc: 'Learner demonstrated stable item mastery across proportional tables without high-stakes ceiling fatigue.',
      evidenceHash: 'sha256: 3c81e9b23190dfca0199e31d45112dfc40a790101901ab210bde48123fae9912'
    },
    {
      id: 2,
      badge: 'PHASE 02 // PHYSICAL MAKER PROJECT',
      code: 'EVD-MAK-02',
      title: 'Maker Project: Kinematic Linkage',
      subtitle: 'Hands-on spatial kinematics and 4-bar planar mechanical linkage fabrication.',
      metric1: { label: 'Mechanism Architecture', value: '4-Bar Planar', desc: 'Rotational balance verified' },
      metric2: { label: 'Gear Constraint', value: '3:1 Mesh', desc: 'Friction torque compensated' },
      artifactType: 'Kinematic Linkage & Gear Mesh',
      artifactMeta: 'Mechanical Simulation Validated · 0.02% Tolerance',
      a: '1.68',
      b: '+0.62',
      c: '0.12',
      tag: 'Demonstrated',
      status: 'completed',
      rubricLabel: 'Rotational Mechanics & Spatial Reasoning',
      rubricRating: 4,
      rubricDesc: 'Learner independently isolated rotational friction constraints and authored compensatory gear teeth mesh.',
      evidenceHash: 'sha256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 3,
      badge: 'PHASE 03 // SOCRATIC INQUIRY',
      code: 'EVD-SOC-03',
      title: 'Socratic Dialogue Verification',
      subtitle: 'Voice & text guided inquiry exploring counterfactual reasoning and gear trade-offs.',
      metric1: { label: 'Guided Exchanges', value: '6 Turns', desc: 'Zero test anxiety recorded' },
      metric2: { label: 'Autonomous Rebuttal', value: 'Level 5 / 5', desc: 'First-principles reasoning' },
      artifactType: 'Socratic Inquiry Exchange',
      artifactMeta: 'Multi-Turn Audio & Text Triangulation',
      a: '1.85',
      b: '+0.91',
      c: '0.08',
      tag: 'Verified',
      status: 'completed',
      rubricLabel: 'Conceptual Depth & Rebuttal Reasoning',
      rubricRating: 5,
      rubricDesc: 'Learner verbalized trade-off between angular velocity and torque without requiring mentor prompts.',
      evidenceHash: 'sha256: 9e02c77d44bc19a82088df2a4192b67dfa87110192e21bb49012aab78ef19092'
    },
    {
      id: 4,
      badge: 'PHASE 04 // LONGITUDINAL PROFILING',
      code: 'EVD-SYN-04',
      title: 'Growth Synthesis & Longitudinal Profiling',
      subtitle: 'Triangulation of psychometric ability, hands-on maker artifacts, and verbal reflection.',
      metric1: { label: 'Triangulated Sources', value: '3 Channels', desc: 'CAT + Maker + Socratic' },
      metric2: { label: 'Qualitative Band', value: 'Strong Foundation', desc: 'Zero career boxing' },
      artifactType: 'Triangulated Learner Profile',
      artifactMeta: 'DPDP Child Data Consent Cryptographically Signed',
      a: '1.92',
      b: '+0.88',
      c: '0.05',
      tag: 'Synthesized',
      status: 'active',
      rubricLabel: 'Multi-Modal Evidence Synthesis',
      rubricRating: 5,
      rubricDesc: 'Deterministic algorithms synthesized longitudinal evidence without arbitrary IQ labeling or career exclusions.',
      evidenceHash: 'sha256: a1f88c3904e2230a84128f09d8544e7c3011a091012fa89b2190cdbe78e0192a'
    }
  ];

  const activePhase = $derived(phaseDetails[currentStep - 1] ?? phaseDetails[0]);

  function handleNextPhase() {
    if (currentStep < assessmentSteps.length) {
      currentStep += 1;
    } else {
      currentStep = 1;
    }
  }

  function handlePrevPhase() {
    currentStep = Math.max(1, currentStep - 1);
  }

  let drawerOpen = $state(false);

  // Arra Core Team Architecture & Governance Testimonials (Flowbite Blocks Pattern · Creed OS Builders)
  interface TeamTestimonial {
    id: string;
    domain: string;
    pillarLabel: string;
    quote: string;
    name: string;
    role: string;
    affiliation: string;
    avatar: string;
    provenanceCode: string;
    technicalFocus: string;
  }

  const teamTestimonials: TeamTestimonial[] = [
    {
      id: 'systems',
      domain: 'Deterministic IRT & Core Systems',
      pillarLabel: '01 · Systems Architecture',
      quote:
        'We engineered Creed OS around a non-negotiable rule: deterministic scoring before AI inference. Psychometric ability is computed through pure 3-parameter IRT algorithms, while Gemini is reserved strictly for patient, step-by-step Socratic dialogue. No hallucinations, no black-box scoring.',
      name: 'Tom Th',
      role: 'Core Systems Architect & Lead Engineer',
      affiliation: 'Arra Core Team',
      avatar: '/images/avatars/tom_th.svg',
      provenanceCode: 'ARRA-CORE-SYS · Lead Architect',
      technicalFocus: 'Item Response Theory & CAT Engine'
    },
    {
      id: 'cognitive',
      domain: 'Socratic Dialogue & Cognitive Architecture',
      pillarLabel: '02 · Socratic Mentorship',
      quote:
        'Adolescent inquiry collapses the moment children feel evaluated or judged. We built the Socratic mentorship pipeline to treat mistakes as hypotheses rather than deficits—giving students a calm space to verbalize counterfactual reasoning without test anxiety.',
      name: 'Kennedy M',
      role: 'Cognitive Architecture & Psychometrics Lead',
      affiliation: 'Arra Core Team',
      avatar: '/images/avatars/kennedy_m.svg',
      provenanceCode: 'ARRA-CORE-COG · Cognitive Systems',
      technicalFocus: 'Inquiry Scaffolding & Metacognitive Reasoning'
    },
    {
      id: 'design',
      domain: 'WAY 2.1 Design & Privacy Sovereignty',
      pillarLabel: '03 · Quiet Editorial Design',
      quote:
        'We rejected the hyper-gamified reward loops and neon distractions that exhaust young learners. Creed OS is designed with quiet editorial restraint, strict 0px architectural geometry, and DPDP-compliant consent workflows that treat learners and families with dignity.',
      name: 'Melody Ning',
      role: 'Design Systems & Product Interaction Lead',
      affiliation: 'Arra Core Team',
      avatar: '/images/avatars/melody_ning.svg',
      provenanceCode: 'ARRA-CORE-UI · Interaction Design',
      technicalFocus: 'WAY 2.1 Design System & Child Privacy'
    }
  ];

  let activeTeamIndex = $state(0);
  const activeTeamMember = $derived(teamTestimonials[activeTeamIndex]);

  onMount(() => {
    if (isReducedMotion()) return;
    const g = initScrollTrigger();
    if (!g) return;

    g.fromTo(
      '.hero-reveal',
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform'
      }
    );
  });
</script>

<svelte:head>
  <title>CREED OS — Understand How a Learner Grows</title>
  <meta name="description" content="AI-native learner intelligence, adaptive diagnostics, longitudinal evidence, and pathway navigation." />
</svelte:head>

<!-- ============================================================
     1. EDITORIAL HERO (Viewport 1) — FULL VIEWPORT WIDTH
     ============================================================ -->
<section class="min-h-svh w-full flex flex-col justify-between items-center text-center relative pt-20 sm:pt-24 pb-4 overflow-hidden isolate border-b border-border/40">
  <!-- Full-Width Ambient Psychometric Glyph Matrix & Subtle Glow -->
  <GlyphMatrix
    glyphs="θλΔΣ01·•+*/\\<>=≈≠"
    cellSize={16}
    mutationRate={0.035}
    interval={90}
    fadeBottom={0.65}
    opacity={0.05}
    class="z-0"
  />
  <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-mint/5 blur-[120px] rounded-none pointer-events-none z-0"></div>

  <!-- Centered Hero Stack (Comfortable Reading Measure) -->
  <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6 my-auto relative z-10">
    <!-- Editorial Kicker Badge -->
    <div class="hero-reveal inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 backdrop-blur-xs border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
      <span class="w-1.5 h-1.5 rounded-none bg-mint animate-pulse"></span>
      <span class="tracking-wide">AI-NATIVE LEARNER INTELLIGENCE</span>
    </div>

    <!-- Main Editorial Headline & Subtitle -->
    <div class="space-y-3.5 max-w-2xl mx-auto">
      <h1 class="hero-reveal text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink leading-[1.12]">
        Understand how<br />
        <span class="text-brand">
          a learner grows.
        </span>
      </h1>
      <div class="hero-reveal space-y-1.5 max-w-xl mx-auto">
        <p class="text-base sm:text-lg text-ink font-normal">
          Assess deeply. Learn personally. Explore freely.
        </p>
        <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed">
          Deterministic psychometrics, longitudinal evidence provenance, and calm Socratic mentorship — without diagnostic pressure or permanent labels.
        </p>
      </div>
    </div>

    <!-- CTA Actions -->
    <div class="hero-reveal flex flex-wrap items-center justify-center gap-3 pt-1">
      <a
        href="/login"
        use:magneticHover
        class="inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2 rounded-none bg-mint hover:bg-mint-hover text-mint-foreground font-medium text-xs sm:text-sm transition-micro shadow-xs cursor-pointer active-press"
      >
        <span>Access Workspace</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="#observatory"
        class="inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2 rounded-none bg-surface/90 hover:bg-surface-subtle text-foreground border border-border font-medium text-xs sm:text-sm transition-micro cursor-pointer active-press shadow-xs"
      >
        <span>See how it works</span>
        <ChevronDown class="w-3.5 h-3.5 text-ink-muted" />
      </a>
    </div>

    <!-- Trust Proof & Statutory Compliance -->
    <div class="hero-reveal pt-1.5 flex flex-wrap items-center justify-center gap-3 text-[11px] text-ink-muted">
      <span class="inline-flex items-center gap-1.5">
        <ShieldCheck class="w-3.5 h-3.5 text-mint" />
        <span>India DPDP Act 2023 Compliant</span>
      </span>
      <span class="text-border">•</span>
      <span class="inline-flex items-center gap-1.5">
        <CheckCircle2 class="w-3.5 h-3.5 text-mint" />
        <span>Deterministic Evidence Scoring</span>
      </span>
      <span class="text-border">•</span>
      <span>Classes 5–10 (Ages 10–16)</span>
    </div>
  </div>

  <!-- Scroll Indicator -->
  <a
    href="#observatory"
    class="hero-reveal pt-3 pb-1 inline-flex flex-col items-center gap-1 text-[11px] text-ink-muted hover:text-ink font-mono uppercase tracking-widest transition-micro cursor-pointer group relative z-10"
  >
    <span class="group-hover:text-mint transition-micro">Scroll to explore observatory</span>
    <ChevronDown class="w-3.5 h-3.5 animate-bounce text-mint" />
  </a>
</section>

<!-- ============================================================
     LONGITUDINAL OBSERVATORIES & WORKSPACES (Constrained Measure)
     ============================================================ -->
<div class="space-y-24 max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">

  <!-- ============================================================
       2. THE LEARNER OBSERVATORY (Viewport 2)
       ============================================================ -->
  <section id="observatory" use:revealOnScroll={{ stagger: 0.08 }} class="min-h-[calc(100svh-4rem)] flex flex-col justify-center space-y-6 pt-12 pb-16 scroll-mt-16">
    <div data-reveal-item class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Icon icon="carbon:observability" class="w-4 h-4 text-mint" />
          <span class="text-[11px] font-mono font-medium text-mint tracking-wide">
            01 · The Learner Observatory
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
          Authentic maker missions and verified evidence artifacts.
        </h2>
      </div>
      <p class="text-xs sm:text-sm text-ink-secondary max-w-sm sm:text-right leading-relaxed">
        Observe tangible student problem-solving in kinematics and robotics before drawing inferences.
      </p>
    </div>

    <!-- Observatory Artwork Frame -->
    <div data-reveal-item class="artwork-frame rounded-none overflow-hidden border border-border bg-surface shadow-md">
      <img
        src="/images/illustrations/student_workshop.jpg"
        alt="Learner in engineering studio calibrating robotic mechanism with blueprints"
        class="w-full aspect-video sm:aspect-21/9 object-cover"
      />
    </div>
  </section>

  <!-- ============================================================
       3. EVIDENCE-DRIVEN ARCHITECTURE (Content with Image)
       ============================================================ -->
  <section use:revealOnScroll={{ stagger: 0.06 }} class="space-y-12 pt-8 border-t border-border-subtle">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Left Editorial Narrative -->
      <div data-reveal-item class="space-y-6">
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <Icon icon="carbon:chemistry" class="w-4 h-4 text-brand" />
            <span class="text-[11px] font-mono font-medium text-brand tracking-wide">
              02 · Evidence Before Inference
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            Not reinventing the wheel.<br />Rebuilding assessment on real evidence.
          </h2>
        </div>

        <p class="text-sm text-ink-secondary leading-relaxed">
          Standardized exams force students into high-anxiety, single-moment snapshots, assigning deterministic labels that limit developmental potential. CREED OS is built on a non-negotiable educational law: <strong>every inference must originate from an observable artifact.</strong>
        </p>

        <p class="text-sm text-ink-secondary leading-relaxed">
          When a student works through a kinematics arm build, authors an algorithmic tree, or debates a physics hypothesis with the calm Socratic mentor, deterministic 3PL algorithms evaluate the demonstration—not speculative black-box guesses.
        </p>

        <!-- Technical Attributes List -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
          <div data-reveal-item class="attribute-card p-3.5 rounded-none bg-surface border border-border space-y-1.5 cursor-default">
            <div class="flex items-center gap-1.5 text-mint font-semibold font-sans">
              <Check class="w-3.5 h-3.5" />
              <span>3PL IRT Calibration</span>
            </div>
            <p class="text-xs text-ink-secondary leading-relaxed">
              Item discrimination (<span class="font-mono text-[11px] text-ink">a</span>), difficulty (<span class="font-mono text-[11px] text-ink">b</span>), and guessing floor (<span class="font-mono text-[11px] text-ink">c</span>) computed mathematically.
            </p>
          </div>

          <div data-reveal-item class="attribute-card p-3.5 rounded-none bg-surface border border-border space-y-1.5 cursor-default">
            <div class="flex items-center gap-1.5 text-mint font-semibold font-sans">
              <Check class="w-3.5 h-3.5" />
              <span>Zero Career Boxing</span>
            </div>
            <p class="text-xs text-ink-secondary leading-relaxed">
              Qualitative developmental growth bands over misleading percentage fitness scores.
            </p>
          </div>
        </div>
      </div>

      <!-- Right Visual Feature Frame -->
      <div data-reveal-item class="artwork-frame rounded-none border border-border bg-surface overflow-hidden shadow-md">
        <img
          src="/images/illustrations/pathway_robotics.jpg"
          alt="Hands-on robotics mechanism build diagram"
          class="w-full aspect-16/10 object-cover"
        />
      </div>
    </div>
  </section>

  <!-- ============================================================
       4. QUANTIFIED PLATFORM IMPACT (Platform & Psychometric Metrics)
       ============================================================ -->
  <section use:revealOnScroll={{ stagger: 0.07 }} class="space-y-8 pt-8 border-t border-border-subtle">
    <div data-reveal-item class="text-center max-w-xl mx-auto space-y-2">
      <span class="text-[11px] font-mono font-medium text-mint tracking-wide">
        03 · Quantified Platform Scale
      </span>
      <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        Calm intelligence measured in verified growth.
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary">
        Statistically calibrated across schools, learning centers, and open research cohorts.
      </p>
    </div>

    <!-- 4-Column Carbon Metric Strip -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div data-reveal-item class="metric-card p-6 rounded-none bg-surface border border-border text-center space-y-1.5 cursor-default">
        <dt use:countUp={{ value: 14200, suffix: '+' }} class="text-3xl sm:text-4xl font-bold text-mint font-mono tabular-nums tracking-tight">14,200+</dt>
        <dd class="text-xs text-ink font-medium">Maker Artifacts Scored</dd>
        <span class="text-[11px] text-ink-muted block">Tangible Project Evidence</span>
      </div>

      <div data-reveal-item class="metric-card p-6 rounded-none bg-surface border border-border text-center space-y-1.5 cursor-default">
        <dt use:countUp={{ value: 0.26, prefix: '<', suffix: ' SE', decimals: 2 }} class="text-3xl sm:text-4xl font-bold text-ink font-mono tabular-nums tracking-tight">&lt;0.26 SE</dt>
        <dd class="text-xs text-ink font-medium">Standard Error Precision</dd>
        <span class="text-[11px] text-ink-muted block">Fast CAT Convergence</span>
      </div>

      <div data-reveal-item class="metric-card p-6 rounded-none bg-surface border border-border text-center space-y-1.5 cursor-default">
        <dt use:countUp={{ value: 100, suffix: '%' }} class="text-3xl sm:text-4xl font-bold text-brand font-mono tabular-nums tracking-tight">100%</dt>
        <dd class="text-xs text-ink font-medium">DPDP Verified Consent</dd>
        <span class="text-[11px] text-ink-muted block">Statutory Child Safety</span>
      </div>

      <div data-reveal-item class="metric-card p-6 rounded-none bg-surface border border-border text-center space-y-1.5 cursor-default">
        <dt use:countUp={{ value: 48, suffix: '+' }} class="text-3xl sm:text-4xl font-bold text-positive font-mono tabular-nums tracking-tight">48+</dt>
        <dd class="text-xs text-ink font-medium">Active Partner Hubs</dd>
        <span class="text-[11px] text-ink-muted block">Classes 5–10 Districts</span>
      </div>
    </div>
  </section>

  <!-- ============================================================
       5. INTERACTIVE CAPABILITY STUDIO (Live Components Showcase)
       ============================================================ -->
  <section use:revealOnScroll={{ stagger: 0.06 }} class="space-y-6 pt-8 border-t border-border-subtle">
    <div data-reveal-item class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Icon icon="carbon:cics-sit" class="w-4 h-4 text-mint" />
          <span class="text-xs font-mono font-medium text-mint tracking-wider uppercase">
            04 · Interactive Capability Studio
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
          Interactive evaluation tools in action.
        </h2>
      </div>
      <p class="text-xs sm:text-sm text-ink-secondary max-w-sm sm:text-right leading-relaxed">
        Test our zero-curve multi-modal evaluation moments: adaptive diagnostics, physical maker builds, and Socratic deduction.
      </p>
    </div>

    <!-- Calm Capability Canvas Frame -->
    <div data-reveal-item class="studio-frame p-4 sm:p-6 rounded-none bg-surface border border-border space-y-6 shadow-xs">
      <!-- 4-Phase Segmented Interactive Rail -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-2 border-b border-border pb-4">
        {#each assessmentSteps as step (step.id)}
          <button
            type="button"
            onclick={() => { currentStep = step.id; }}
            class="text-left p-3 rounded-none border transition-micro cursor-pointer flex flex-col justify-between {currentStep === step.id ? 'bg-surface-raised border-mint text-ink ring-1 ring-mint/30' : 'bg-surface/50 border-border hover:bg-surface text-ink-secondary hover:text-ink'}"
            title="Switch to Phase 0{step.id}: {step.label}"
          >
            <div class="flex items-center justify-between text-[11px] font-mono">
              <span class="{currentStep === step.id ? 'text-mint font-semibold' : 'text-ink-muted'}">0{step.id}</span>
              {#if currentStep > step.id}
                <Check class="size-3 text-mint stroke-[2.5]" />
              {:else if currentStep === step.id}
                <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
              {/if}
            </div>
            <div class="mt-2 space-y-0.5">
              <span class="text-xs font-semibold block text-ink">{step.label}</span>
              <span class="text-[11px] text-ink-muted block line-clamp-1">{step.description}</span>
            </div>
          </button>
        {/each}
      </div>

      <!-- Split Evaluation Canvas -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Left Column: Living Evaluation Artifact (Col 7 / 58%) -->
        <div class="lg:col-span-7 rounded-none bg-canvas border border-border p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden min-h-80">
          <!-- Artifact Header -->
          <div class="flex items-center justify-between border-b border-border/60 pb-3 text-xs font-mono">
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-none bg-mint"></span>
              <span class="text-ink font-semibold uppercase">{activePhase.artifactType}</span>
            </div>
            <span class="text-ink-muted text-[11px]">{activePhase.code}</span>
          </div>

          <!-- Dynamic Artifact Demonstration Display -->
          <div class="flex-1 flex items-center justify-center py-5">
            {#if currentStep === 1}
              <!-- Phase 1: Adaptive CAT Item Convergence Trace -->
              <div class="w-full max-w-md space-y-3 font-mono text-xs">
                <div class="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>θ Latent Ability Convergence Trace</span>
                  <span class="text-mint font-semibold">SE: 0.24 · Converged</span>
                </div>
                <div class="h-28 w-full bg-surface border border-border relative p-2 flex flex-col justify-between overflow-hidden">
                  <!-- Confidence Interval Band -->
                  <div class="absolute inset-x-0 top-1/4 h-1/2 bg-mint/10 border-y border-mint/20"></div>
                  <!-- Center Convergence Axis -->
                  <div class="absolute inset-x-0 top-1/2 border-t border-dashed border-border-strong"></div>
                  
                  <!-- Responsive Adaptive Step SVG Line -->
                  <svg class="w-full h-full relative z-10" viewBox="0 0 400 90" fill="none" preserveAspectRatio="none">
                    <!-- Target convergence path -->
                    <path
                      d="M 10 75 L 45 25 L 85 65 L 130 35 L 180 50 L 230 42 L 280 46 L 330 44 L 380 45"
                      stroke="var(--color-ink-muted, #71717a)"
                      stroke-width="1.5"
                      stroke-dasharray="2 2"
                    />
                    <path
                      d="M 180 50 L 230 42 L 280 46 L 330 44 L 380 45"
                      stroke="var(--color-mint, #10b981)"
                      stroke-width="2"
                    />
                    <!-- Item test points -->
                    <circle cx="10" cy="75" r="3" fill="var(--color-ink, #fff)" />
                    <circle cx="45" cy="25" r="3" fill="var(--color-ink, #fff)" />
                    <circle cx="85" cy="65" r="3" fill="var(--color-ink, #fff)" />
                    <circle cx="130" cy="35" r="3" fill="var(--color-ink, #fff)" />
                    <circle cx="180" cy="50" r="3.5" fill="var(--color-mint, #10b981)" />
                    <circle cx="230" cy="42" r="3.5" fill="var(--color-mint, #10b981)" />
                    <circle cx="280" cy="46" r="3.5" fill="var(--color-mint, #10b981)" />
                    <circle cx="330" cy="44" r="3.5" fill="var(--color-mint, #10b981)" />
                    <circle cx="380" cy="45" r="4.5" fill="var(--color-mint, #10b981)" />
                  </svg>
                </div>
                <div class="flex items-center justify-between text-[10px] text-ink-muted">
                  <span>Item 1 (Initial seed)</span>
                  <span>Item 18 (Early stopping threshold met)</span>
                </div>
              </div>
            {:else if currentStep === 2}
              <!-- Phase 2: Maker Project Kinematic Linkage Simulation -->
              <div class="w-full max-w-md space-y-3 font-mono text-xs">
                <div class="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>Planar Mechanical Assembly · Kinematics Engine</span>
                  <span class="text-mint font-semibold">Mesh Ratio 3:1</span>
                </div>
                <div class="h-28 w-full bg-surface border border-border relative p-3 flex items-center justify-center overflow-hidden">
                  <!-- Mechanical Gear & 4-Bar Assembly SVG -->
                  <svg class="w-full h-full" viewBox="0 0 340 80" fill="none">
                    <!-- Ground Link -->
                    <line x1="50" y1="60" x2="290" y2="60" stroke="var(--color-border-strong, #3f3f46)" stroke-width="2" stroke-dasharray="4 4" />
                    <!-- Driver Crank -->
                    <line x1="70" y1="60" x2="110" y2="25" stroke="var(--color-mint, #10b981)" stroke-width="2.5" />
                    <!-- Coupler Link -->
                    <line x1="110" y1="25" x2="220" y2="35" stroke="var(--color-ink, #fff)" stroke-width="2.5" />
                    <!-- Follower Rocker -->
                    <line x1="220" y1="35" x2="260" y2="60" stroke="var(--color-brand, #6366f1)" stroke-width="2.5" />
                    <!-- Mechanical Joints -->
                    <circle cx="70" cy="60" r="4.5" fill="var(--color-surface, #18181b)" stroke="var(--color-mint, #10b981)" stroke-width="2" />
                    <circle cx="110" cy="25" r="4" fill="var(--color-mint, #10b981)" />
                    <circle cx="220" cy="35" r="4" fill="var(--color-brand, #6366f1)" />
                    <circle cx="260" cy="60" r="4.5" fill="var(--color-surface, #18181b)" stroke="var(--color-brand, #6366f1)" stroke-width="2" />
                    <!-- Mesh gear indicator -->
                    <text x="145" y="52" fill="var(--color-mint, #10b981)" font-size="10" font-family="monospace">3:1 Planetary Gear</text>
                  </svg>
                </div>
                <div class="flex items-center justify-between text-[10px] text-ink-muted">
                  <span>Pivot A: Fixed Base</span>
                  <span>Coupler Pivot B</span>
                  <span>Rocker Pin C</span>
                </div>
              </div>
            {:else if currentStep === 3}
              <!-- Phase 3: Socratic Dialogue Verification -->
              <div class="w-full max-w-md space-y-3 text-xs">
                <!-- Mentor Prompt -->
                <div class="p-3 rounded-none bg-surface border border-border border-l-2 border-l-mint space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-mono text-mint">
                    <span>SOCRATIC MENTOR · TURN 05</span>
                    <span class="text-ink-muted">Audio + Text</span>
                  </div>
                  <p class="text-xs text-ink-secondary leading-relaxed">
                    "If the follower gear diameter triples, what happens to the output rotational speed and the motor torque requirement?"
                  </p>
                </div>

                <!-- Student Rebuttal -->
                <div class="p-3 rounded-none bg-surface-raised border border-border border-l-2 border-l-brand space-y-1">
                  <div class="flex items-center justify-between text-[10px] font-mono text-brand">
                    <span>LEARNER REBUTTAL · AUTONOMOUS</span>
                    <span class="text-mint">Level 5 / 5 Verified</span>
                  </div>
                  <p class="text-xs text-ink leading-relaxed">
                    "Output angular velocity drops to 1/3, but available mechanical torque triples to overcome the linkage friction threshold."
                  </p>
                </div>
              </div>
            {:else}
              <!-- Phase 4: Longitudinal Growth Synthesis -->
              <div class="w-full max-w-md space-y-3 font-mono text-xs">
                <div class="flex items-center justify-between text-[11px] text-ink-muted">
                  <span>Triangulated Multi-Modal Record</span>
                  <span class="text-mint font-semibold">100% DPDP Verified</span>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="p-2 bg-surface border border-border space-y-1">
                    <span class="text-[10px] text-ink-muted block uppercase">Adaptive CAT</span>
                    <span class="font-bold text-ink block text-xs">θ = +0.85</span>
                    <span class="text-[10px] text-mint block">3PL Converged</span>
                  </div>
                  <div class="p-2 bg-surface border border-border space-y-1">
                    <span class="text-[10px] text-ink-muted block uppercase">Maker Build</span>
                    <span class="font-bold text-ink block text-xs">Level 4 / 5</span>
                    <span class="text-[10px] text-mint block">Kinematic Mesh</span>
                  </div>
                  <div class="p-2 bg-surface border border-border space-y-1">
                    <span class="text-[10px] text-ink-muted block uppercase">Socratic</span>
                    <span class="font-bold text-ink block text-xs">6 Turns</span>
                    <span class="text-[10px] text-mint block">High Precision</span>
                  </div>
                </div>
                <div class="p-2 bg-surface border border-border flex items-center justify-between text-[11px]">
                  <span class="text-ink-secondary">Developmental Growth Band:</span>
                  <span class="font-bold text-mint font-sans">Strong Foundation</span>
                </div>
              </div>
            {/if}
          </div>

          <!-- Artifact Telemetry Footer -->
          <div class="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-mono text-ink-secondary">
            <span>{activePhase.artifactMeta}</span>
            <span class="text-mint flex items-center gap-1">
              <Shield class="size-3" />
              Verified Telemetry
            </span>
          </div>
        </div>

        <!-- Right Column: Editorial Signal & Human-First Evidence (Col 5 / 42%) -->
        <div class="lg:col-span-5 rounded-none bg-surface border border-border p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-none bg-surface-subtle border border-border text-mint font-semibold">
                {activePhase.badge}
              </span>
              <span class="text-xs font-mono text-ink-muted">
                Phase {currentStep} of {assessmentSteps.length}
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="text-lg font-bold text-ink leading-snug font-heading">
                {activePhase.title}
              </h3>
              <p class="text-xs text-ink-secondary leading-relaxed">
                {activePhase.rubricDesc}
              </p>
            </div>

            <!-- Single Clean Inline Metric Strip -->
            <div class="grid grid-cols-2 gap-3 py-2 border-y border-border/70 text-xs font-mono">
              <div class="space-y-0.5">
                <span class="text-[10px] text-ink-muted uppercase block tracking-wider">{activePhase.metric1.label}</span>
                <span class="font-bold text-ink text-sm block">{activePhase.metric1.value}</span>
                <span class="text-[10px] text-ink-muted block">{activePhase.metric1.desc}</span>
              </div>
              <div class="space-y-0.5">
                <span class="text-[10px] text-ink-muted uppercase block tracking-wider">{activePhase.metric2.label}</span>
                <span class="font-bold text-mint text-sm block">{activePhase.metric2.value}</span>
                <span class="text-[10px] text-ink-muted block">{activePhase.metric2.desc}</span>
              </div>
            </div>

            <!-- Rubric Competency Rating -->
            <div class="space-y-1.5 pt-1">
              <div class="flex items-center justify-between text-xs">
                <span class="text-[11px] font-mono font-medium text-ink-secondary uppercase tracking-wider">
                  Demonstrated Competency
                </span>
                <span class="text-[11px] font-mono font-bold text-mint">
                  Level {activePhase.rubricRating} / 5
                </span>
              </div>
              <EvidenceRating
                rating={activePhase.rubricRating}
                max={5}
                label={activePhase.rubricLabel}
              />
            </div>
          </div>

          <!-- Progressive Disclosure Link for Technical Provenance -->
          <div class="pt-2">
            <button
              type="button"
              onclick={() => (drawerOpen = true)}
              class="w-full inline-flex items-center justify-between px-3 py-2 bg-surface-subtle hover:bg-surface border border-border text-[11px] font-mono text-ink-secondary hover:text-ink transition-micro cursor-pointer rounded-none"
            >
              <span class="flex items-center gap-1.5">
                <Sliders class="size-3 text-mint" />
                Technical Provenance & 3PL Calibration
              </span>
              <ArrowRight class="size-3 text-ink-muted" />
            </button>
          </div>
        </div>
      </div>

      <!-- Action Primacy Navigation Bar -->
      <div class="flex items-center justify-between pt-4 border-t border-border">
        <button
          type="button"
          onclick={handlePrevPhase}
          disabled={currentStep === 1}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-surface border border-border hover:bg-surface-subtle disabled:opacity-30 disabled:cursor-not-allowed text-ink transition-micro cursor-pointer rounded-none"
        >
          <ArrowLeft class="size-3.5" />
          <span>Previous</span>
        </button>

        <div class="flex items-center gap-2">
          {#if currentStep < assessmentSteps.length}
            <button
              type="button"
              onclick={handleNextPhase}
              class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold font-mono bg-mint text-mint-foreground hover:bg-mint-hover transition-micro cursor-pointer shadow-xs rounded-none"
            >
              <span>Next: {assessmentSteps[currentStep].label}</span>
              <ArrowRight class="size-3.5" />
            </button>
          {:else}
            <a
              href="/observatory"
              class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold font-mono bg-mint text-mint-foreground hover:bg-mint-hover transition-micro shadow-xs rounded-none"
            >
              <span>Launch Observatory Studio ↗</span>
            </a>
          {/if}
        </div>
      </div>

      <!-- Progressive Disclosure Sheet: Psychometric Calibration & Cryptographic Evidence -->
      <Sheet.Root bind:open={drawerOpen}>
        <Sheet.Content class="rounded-none w-full sm:max-w-md bg-surface-overlay border-l border-border p-6 space-y-6">
          <Sheet.Header class="space-y-2 border-b border-border pb-4">
            <Sheet.Title class="text-base font-semibold text-ink">
              Item Calibration & Rubric Readout
            </Sheet.Title>
            <Sheet.Description class="text-xs text-ink-secondary">
              Deterministic 3PL parameters and rubrics mapped to this active stage ({activePhase.code}).
            </Sheet.Description>
          </Sheet.Header>

          <!-- Parameters Grid -->
          <div class="space-y-4 font-mono text-xs">
            <div class="p-3 bg-surface border border-border space-y-2">
              <span class="font-semibold block text-[11px] uppercase tracking-wider text-mint">
                Active Item Calibration ({activePhase.code})
              </span>
              <div class="grid grid-cols-3 gap-2 text-center pt-1">
                <div class="bg-surface-subtle p-2 border border-border">
                  <span class="text-[10px] text-ink-muted block">Discrimination (a)</span>
                  <span class="font-bold text-ink">{activePhase.a}</span>
                </div>
                <div class="bg-surface-subtle p-2 border border-border">
                  <span class="text-[10px] text-ink-muted block">Difficulty (b)</span>
                  <span class="font-bold text-ink">{activePhase.b}</span>
                </div>
                <div class="bg-surface-subtle p-2 border border-border">
                  <span class="text-[10px] text-ink-muted block">Guessing (c)</span>
                  <span class="font-bold text-ink">{activePhase.c}</span>
                </div>
              </div>
            </div>

            <!-- Evidence Demonstrations -->
            <div class="p-3 bg-surface border border-border space-y-2">
              <span class="font-semibold block text-[11px] uppercase tracking-wider text-brand">
                Competency Rubric Rating
              </span>
              <EvidenceRating
                rating={activePhase.rubricRating}
                max={5}
                label={activePhase.rubricLabel}
              />
              <p class="font-sans text-[11px] text-ink-secondary leading-relaxed pt-1">
                {activePhase.rubricDesc}
              </p>
            </div>

            <!-- Provenance Verification -->
            <div class="p-3 bg-surface border border-border space-y-1 text-[11px]">
              <div class="flex items-center gap-1.5 text-positive font-semibold">
                <Lock class="size-3" />
                <span>Verifiable Evidence Hash</span>
              </div>
              <p class="text-ink-muted break-all text-[10px]">
                {activePhase.evidenceHash}
              </p>
            </div>
          </div>

          <Sheet.Footer class="border-t border-border pt-4">
            <button
              type="button"
              onclick={() => (drawerOpen = false)}
              class="w-full py-2 rounded-none bg-surface border border-border hover:bg-surface-subtle text-xs font-medium text-ink transition-micro cursor-pointer"
            >
              Close Diagnostic Sheet
            </button>
          </Sheet.Footer>
        </Sheet.Content>
      </Sheet.Root>
    </div>
  </section>

  <!-- ============================================================
       6. ONE INTELLIGENCE. DIFFERENT MOMENTS. (Bifurcated Ecosystem)
       ============================================================ -->
  <section id="moments" use:revealOnScroll={{ stagger: 0.06 }} class="space-y-12 pt-8 border-t border-border-subtle">
    <div data-reveal-item class="space-y-2 text-center max-w-xl mx-auto">
      <span class="text-xs font-mono font-medium text-brand tracking-wider uppercase">
        05 · Multi-Role Ecosystem
      </span>
      <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        One intelligence. Different moments.
      </h2>
      <p class="text-sm text-ink-secondary">
        Longitudinal evidence, deterministic scoring, and calm spaces designed for each human role.
      </p>
    </div>

    <!-- Primary Moments (Student, Family, Teacher) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div data-reveal-item class="moment-card p-6 rounded-none bg-surface border border-border space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-brand">
            Student
          </span>
          <h3 class="text-lg font-semibold text-ink">
            Discover → Practice → Explore
          </h3>
        </div>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Action-first daily learning map, hands-on maker missions, and quiet Socratic mentorship without pressure or labeling.
        </p>
        <div class="pt-2">
          <a href="/login?next=%2Fstudent" class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 group">
            <span>Enter student space</span>
            <ArrowRight class="moment-arrow w-3 h-3 transition-transform" />
          </a>
        </div>
      </div>

      <div data-reveal-item class="moment-card p-6 rounded-none bg-surface border border-border space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-positive">
            Family
          </span>
          <h3 class="text-lg font-semibold text-ink">
            Understand → Support → Align
          </h3>
        </div>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Clear developmental summaries, shared horizon conversations, and practical at-home experiments free of diagnostic jargon.
        </p>
        <div class="pt-2">
          <a href="/login?next=%2Fparent" class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 group">
            <span>Enter family space</span>
            <ArrowRight class="moment-arrow w-3 h-3 transition-transform" />
          </a>
        </div>
      </div>

      <div data-reveal-item class="moment-card p-6 rounded-none bg-surface border border-border space-y-4">
        <div class="space-y-1">
          <span class="text-xs font-semibold uppercase tracking-wider text-attention">
            Teacher
          </span>
          <h3 class="text-lg font-semibold text-ink">
            Notice → Intervene → Verify
          </h3>
        </div>
        <p class="text-xs text-ink-secondary leading-relaxed">
          Classroom misconception clusters, quick 1-click scaffolding assignments, and direct observation capture in seconds.
        </p>
        <div class="pt-2">
          <a href="/login?next=%2Fteacher" class="text-xs font-medium text-brand hover:underline inline-flex items-center gap-1 group">
            <span>Enter teacher space</span>
            <ArrowRight class="moment-arrow w-3 h-3 transition-transform" />
          </a>
        </div>
      </div>
    </div>

    <!-- Secondary Console Portals (Counselor, Institution, Studio) -->
    <div data-reveal-item class="pt-4 border-t border-border grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-ink-secondary">
      <div class="space-y-1 group">
        <a href="/login?next=%2Fcounselor" class="font-semibold text-ink hover:text-brand inline-flex items-center gap-1">
          <span>Counselor</span>
          <ArrowRight class="moment-arrow w-3 h-3 transition-transform" />
        </a>
        <p>Aspiration-capability bridge dialogues & caseload management.</p>
      </div>

      <div class="space-y-1 group">
        <a href="/login?next=%2Fadmin" class="font-semibold text-ink hover:text-brand inline-flex items-center gap-1">
          <span>Institution Admin</span>
          <ArrowRight class="moment-arrow w-3 h-3 transition-transform" />
        </a>
        <p>DPDP Act statutory parental consent ledger & multi-cohort operations.</p>
      </div>

      <div class="space-y-1 group">
        <a href="/login?next=%2Fstudio" class="font-semibold text-ink hover:text-brand inline-flex items-center gap-1">
          <span>Item Studio</span>
          <ArrowRight class="moment-arrow w-3 h-3 transition-transform" />
        </a>
        <p>Deterministic 3PL Item Response Theory item bank & calibration.</p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       7. ARRA CORE TEAM & GOVERNANCE (Flowbite Testimonial Pattern)
       ============================================================ -->
  <section
    use:revealOnScroll={{ stagger: 0.06 }}
    class="space-y-8 pt-12 pb-6 border-t border-border-subtle"
    aria-label="Arra Core Team and Governance"
  >
    <!-- Section Header (Signal + Context) -->
    <div data-reveal-item class="text-center max-w-xl mx-auto space-y-2">
      <span class="text-xs font-mono font-medium text-mint tracking-wider uppercase">
        06 · Core Engineering & Governance
      </span>
      <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
        Built with quiet discipline by the Arra Core team.
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed">
        Systems architects, cognitive engineers, and product designers building Creed OS from first principles.
      </p>
    </div>

    <!-- Governance Pillar Switcher (Zero-Radius Discipline) -->
    <div data-reveal-item class="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
      {#each teamTestimonials as member, idx}
        <button
          type="button"
          onclick={() => { activeTeamIndex = idx; }}
          class="px-3 py-1.5 text-xs font-mono transition-micro rounded-none border cursor-pointer {activeTeamIndex === idx
            ? 'bg-mint/10 border-mint text-mint font-semibold shadow-2xs'
            : 'bg-surface border-border text-ink-muted hover:text-ink hover:border-border-strong'}"
          aria-pressed={activeTeamIndex === idx}
        >
          {member.pillarLabel}
        </button>
      {/each}
    </div>

    <!-- Flowbite-Svelte Blocks Testimonial Structure (Restrained OKLCH & 0px Sharp) -->
    <div
      data-reveal-item
      class="testimonial-card max-w-4xl mx-auto p-8 sm:p-12 rounded-none bg-surface border border-border text-center space-y-6 shadow-xs relative overflow-hidden"
    >
      <!-- Architectural Accent Geometry -->
      <div class="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-mint/40 pointer-events-none"></div>
      <div class="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-mint/40 pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-mint/40 pointer-events-none"></div>
      <div class="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-mint/40 pointer-events-none"></div>

      <!-- Prominent Quotes Icon (Flowbite Testimonial Icon Pattern) -->
      <div class="flex justify-center" aria-hidden="true">
        <svg
          class="h-8 w-8 sm:h-10 sm:w-10 text-mint/60"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
        </svg>
      </div>

      <!-- Semantic Figure Container for Testimonial & Figcaption Attribution -->
      <figure class="space-y-6">
        <!-- Blockquote Statement -->
        <blockquote class="max-w-3xl mx-auto">
          <p class="text-lg sm:text-xl md:text-2xl font-heading font-medium text-ink leading-relaxed tracking-tight text-balance">
            "{activeTeamMember.quote}"
          </p>
        </blockquote>

        <!-- Flowbite Footer Snippet: 0px Avatar & Divided Attribution -->
        <figcaption class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <!-- Square 0px Avatar (Zero-Radius Rule) -->
          <img
            class="h-10 w-10 sm:h-12 sm:w-12 rounded-none border border-border object-cover shadow-2xs shrink-0"
            src={activeTeamMember.avatar}
            alt="{activeTeamMember.name} portrait"
            width="48"
            height="48"
            loading="lazy"
          />

          <!-- Divided Metadata (divide-x-2) -->
          <div class="flex items-center divide-x-2 divide-border text-left">
            <div class="pr-3.5 font-semibold text-sm sm:text-base text-ink">
              {activeTeamMember.name}
            </div>
            <div class="pl-3.5 text-xs sm:text-sm text-ink-muted">
              <span class="text-ink-secondary font-medium">{activeTeamMember.role}</span>
              <span class="hidden sm:inline text-ink-muted"> · {activeTeamMember.affiliation}</span>
            </div>
          </div>
        </figcaption>
      </figure>

      <!-- Provenance Footnote -->
      <div class="pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-[11px] text-ink-muted">
        <span class="font-mono text-ink-muted">
          Pillar: <strong class="text-ink font-medium">{activeTeamMember.technicalFocus}</strong>
        </span>
        <span class="font-mono text-[10px] bg-surface-subtle border border-border px-2 py-0.5 text-mint">
          {activeTeamMember.provenanceCode}
        </span>
      </div>
    </div>
  </section>

  <!-- ============================================================
       8. INSTITUTIONAL DISTRICT ENGAGEMENT (Enterprise CTA)
       ============================================================ -->
  <section use:revealOnScroll={{ stagger: 0.06 }} class="space-y-8 pt-8 border-t border-border-subtle">
    <div data-reveal-item class="p-8 sm:p-12 rounded-none bg-surface border border-border relative overflow-hidden shadow-md">
      <!-- Background Ambient Mint Vector -->
      <div class="ambient-vector absolute -right-16 -top-16 w-80 h-80 bg-mint/5 blur-[80px] rounded-none pointer-events-none"></div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center relative z-10">
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-mint" />
            <span class="text-xs font-mono font-medium text-mint tracking-wider uppercase">
              07 · District Adoption & Pilot Intake
            </span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
            Bring calm intelligence to your school or innovation center.
          </h2>
          <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl">
            Join forward-thinking school networks adopting continuous evidence capture, verified parental consent workflows under the India DPDP Act 2023, and quiet Socratic mentorship.
          </p>
          <div class="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="/schools"
              use:magneticHover
              class="inline-flex items-center gap-2 px-5 py-2 rounded-none bg-mint hover:bg-mint-hover text-mint-foreground font-medium text-xs sm:text-sm transition-micro shadow-xs cursor-pointer active-press"
            >
              <span>Request District Pilot</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
            <a
              href="/studio"
              onclick={handleExploreStudio}
              class="inline-flex items-center gap-2 px-5 py-2 rounded-none bg-surface-subtle hover:bg-surface-raised text-ink border border-border font-medium text-xs sm:text-sm transition-micro cursor-pointer shadow-xs active-press"
            >
              <span>Explore Item Studio</span>
              <Sliders class="w-3.5 h-3.5 text-ink-muted" />
            </a>
          </div>
        </div>

        <!-- Metric Callout Card -->
        <div data-reveal-item class="p-6 rounded-none bg-surface-subtle border border-border space-y-3 text-xs">
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-ink-muted">Onboarding Cycle:</span>
            <span class="font-semibold text-ink font-mono tabular-nums">48-Hour Setup</span>
          </div>
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-ink-muted">Consent Protocol:</span>
            <span class="font-semibold text-mint">DPDP Act Compliant</span>
          </div>
          <div class="flex items-center justify-between border-b border-border pb-2">
            <span class="text-ink-muted">Item Calibrations:</span>
            <span class="font-semibold text-ink font-mono tabular-nums">3PL Standardized</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-ink-muted">Assessment Latency:</span>
            <span class="font-semibold text-brand font-mono tabular-nums">&lt; 120ms CAT Response</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  /* ================================================================
     LANDING PAGE EDITORIAL MOTION & MICRO-INTERACTIONS
     WAY 2.1 Lagom Motion Contract:
     - 140ms (micro) · 200ms (standard) · 280ms (emphasis)
     - Easing: cubic-bezier(0.16, 1, 0.3, 1) — WAY Lagom spring
     ================================================================ */

  /* --- Artwork Frames: Depth illumination --- */
  .artwork-frame {
    transition:
      box-shadow var(--duration-emphasis, 280ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      border-color var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .artwork-frame:hover {
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.12), 0 0 16px color-mix(in oklch, var(--color-brand) 15%, transparent);
    border-color: color-mix(in oklch, var(--color-brand) 30%, var(--color-border));
  }

  /* --- Technical Attribute Cards --- */
  .attribute-card {
    transition:
      transform var(--duration-micro, 140ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      border-color var(--duration-micro, 140ms) ease,
      background-color var(--duration-micro, 140ms) ease;
  }

  .attribute-card:hover {
    transform: translateY(-2px);
    border-color: color-mix(in oklch, var(--color-mint) 40%, var(--color-border));
    background-color: var(--color-surface-subtle);
  }

  /* --- Metric Scale Cards --- */
  .metric-card {
    transition:
      transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      border-color var(--duration-standard, 200ms) ease,
      box-shadow var(--duration-standard, 200ms) ease;
  }

  .metric-card:hover {
    transform: translateY(-3px);
    border-color: color-mix(in oklch, var(--color-brand) 35%, var(--color-border));
    box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
  }

  /* --- Capability Studio Frame --- */
  .studio-frame {
    transition:
      border-color var(--duration-standard, 200ms) ease,
      box-shadow var(--duration-standard, 200ms) ease;
  }

  .studio-frame:hover {
    border-color: color-mix(in oklch, var(--color-brand) 25%, var(--color-border));
    box-shadow: 0 2px 12px rgb(0 0 0 / 0.06);
  }

  /* --- Multi-Role Moment Cards --- */
  .moment-card {
    transition:
      transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      border-color var(--duration-standard, 200ms) ease,
      box-shadow var(--duration-standard, 200ms) ease;
  }

  .moment-card:hover {
    transform: translateY(-3px);
    border-color: color-mix(in oklch, var(--color-brand) 40%, var(--color-border));
    box-shadow: 0 6px 24px rgb(0 0 0 / 0.08);
  }

  :global(.moment-arrow) {
    transition: transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  :global(.group:hover .moment-arrow) {
    transform: translateX(3px);
  }

  /* --- Scientific Governance Testimonial Card --- */
  .testimonial-card {
    transition:
      border-color var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      box-shadow var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .testimonial-card:hover {
    border-color: color-mix(in oklch, var(--color-mint) 35%, var(--color-border));
    box-shadow: 0 4px 20px rgb(0 0 0 / 0.04);
  }

  /* --- Ambient Pulse Animation for Enterprise Banner --- */
  @keyframes ambientPulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.08);
      opacity: 0.9;
    }
  }

  .ambient-vector {
    animation: ambientPulse 8s ease-in-out infinite;
  }

  /* --- Tactile Button Press --- */
  :global(.active-press:active) {
    transform: scale(0.97);
  }

  /* ================================================================
     REDUCED MOTION OVERRIDES — Accessibility Guarantee
     ================================================================ */
  @media (prefers-reduced-motion: reduce) {
    .artwork-frame,
    .attribute-card,
    .metric-card,
    .studio-frame,
    .moment-card,
    :global(.moment-arrow),
    .testimonial-card,
    .ambient-vector,
    :global(.active-press:active) {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
