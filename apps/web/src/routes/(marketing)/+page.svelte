<script lang="ts">
  import { onMount } from 'svelte';
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
    Calendar
  } from 'lucide-svelte';
  import { Icon } from '$lib/components/icons';
  import { revealOnScroll } from '$lib/motion/reveal.js';
  import { magneticHover, countUp } from '$lib/motion/interaction.js';
  import { initScrollTrigger, isReducedMotion } from '$lib/motion/scroll.js';
  import {
    Stepper,
    DropdownCheckbox,
    Breadcrumb,
    Kbd,
    ButtonGroup,
    EvidenceRating,
    GlyphMatrix
  } from '$lib/components';
  import * as Sheet from '$lib/components/ui/sheet';

  // --- Interactive State for Capability Studio ---
  const assessmentSteps = [
    { id: 1, label: 'Baseline CAT', description: 'Adaptive 3PL Diagnostic' },
    { id: 2, label: 'Maker Project', description: 'Kinematic Linkage Build' },
    { id: 3, label: 'Socratic Dialogue', description: 'Inquiry Verification' },
    { id: 4, label: 'Growth Synthesis', description: 'Longitudinal Profiling' }
  ];
  let currentStep = $state(2);
  let isAllCompleted = $state(false);

  const phaseDetails = [
    {
      id: 1,
      badge: 'PHASE 01 // ADAPTIVE DIAGNOSTIC',
      code: 'EVD-CAT-01',
      title: 'Baseline Computerized Adaptive Test',
      subtitle: 'Deterministic 3-Parameter Logistic (3PL) Item Response Theory evaluation.',
      metric1: { label: 'Ability Estimate (θ)', value: '+0.85', desc: 'Converged (SE: 0.28)' },
      metric2: { label: 'Adaptive Items', value: '18 / 24', desc: 'Early stop criterion met' },
      metric3: { label: 'Item Discrimination (a)', value: '1.42', desc: 'High Fisher information' },
      a: '1.42',
      b: '+0.38',
      c: '0.18',
      tag: 'Completed',
      status: 'completed',
      rubricLabel: 'Quantitative & Proportional Reasoning demonstrated',
      rubricRating: 4,
      rubricDesc: 'Student demonstrated stable item mastery across proportional tables without high-stakes ceiling fatigue.',
      evidenceHash: 'sha256: 3c81e9b23190dfca0199e31d45112dfc40a790101901ab210bde48123fae9912'
    },
    {
      id: 2,
      badge: 'PHASE 02 // PHYSICAL MAKER PROJECT',
      code: 'EVD-MAK-02',
      title: 'Maker Project: Kinematic Linkage',
      subtitle: 'Hands-on spatial kinematics and 4-bar planar mechanical linkage fabrication.',
      metric1: { label: 'Mechanical Assembly', value: '4-Bar Planar', desc: 'Rotational balance validated' },
      metric2: { label: 'Gear Ratio Constraint', value: '3:1 Mesh', desc: 'Friction torque compensated' },
      metric3: { label: 'Evidence Rigor', value: 'Level 4 / 5', desc: 'Independent fabrication' },
      a: '1.68',
      b: '+0.62',
      c: '0.12',
      tag: 'Demonstrated',
      status: 'completed',
      rubricLabel: 'Rotational Mechanics demonstrated',
      rubricRating: 4,
      rubricDesc: 'Student independently isolated rotational axis friction constraint and authored compensatory gear teeth mesh.',
      evidenceHash: 'sha256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
    },
    {
      id: 3,
      badge: 'PHASE 03 // SOCRATIC INQUIRY',
      code: 'EVD-SOC-03',
      title: 'Socratic Dialogue Verification',
      subtitle: 'Voice & text guided inquiry exploring counterfactual reasoning and gear trade-offs.',
      metric1: { label: 'Scaffolding Turns', value: '6 Exchanges', desc: 'Zero test anxiety' },
      metric2: { label: 'Deductive Precision', value: 'Level 5 / 5', desc: 'First-principles reasoning' },
      metric3: { label: 'Autonomous Rebuttal', value: 'Demonstrated', desc: 'Torque vs velocity tradeoff' },
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
      metric1: { label: 'Modalities Triangulated', value: '3 Sources', desc: 'CAT + Maker + Socratic' },
      metric2: { label: 'Developmental Band', value: 'Strong Foundation', desc: 'Qualitative growth classification' },
      metric3: { label: 'Statutory Ledger', value: 'DPDP Active', desc: 'Cryptographically signed' },
      a: '1.92',
      b: '+0.88',
      c: '0.05',
      tag: 'Ready to Synthesize',
      status: 'active',
      rubricLabel: 'Multi-Modal Evidence Synthesis',
      rubricRating: 5,
      rubricDesc: 'Deterministic algorithm synthesized longitudinal proof without arbitrary IQ labeling or deterministic career exclusions.',
      evidenceHash: 'sha256: a1f88c3904e2230a84128f09d8544e7c3011a091012fa89b2190cdbe78e0192a'
    }
  ];

  const activePhase = $derived(phaseDetails[currentStep - 1] ?? phaseDetails[0]);
  const journeyProgressPercent = $derived(
    isAllCompleted ? 100 : Math.round(((currentStep - 1) / assessmentSteps.length) * 100 + 25)
  );

  function handleNextPhase() {
    if (currentStep < assessmentSteps.length) {
      currentStep += 1;
    } else if (currentStep === assessmentSteps.length && !isAllCompleted) {
      isAllCompleted = true;
    }
  }

  function handlePrevPhase() {
    if (isAllCompleted) {
      isAllCompleted = false;
      currentStep = 4;
    } else {
      currentStep = Math.max(1, currentStep - 1);
    }
  }

  function handleReplayJourney() {
    currentStep = 1;
    isAllCompleted = false;
  }

  let competencyOptions = $state([
    { id: 'kinematics', label: 'Spatial Kinematics', description: 'Mechanical linkage & rotational balance', checked: true },
    { id: 'logic', label: 'Algorithmic Recursion', description: 'Branching tree traversal & base cases', checked: true },
    { id: 'quantitative', label: 'Proportional Tables', description: 'Non-linear ratios & scaling laws', checked: false },
    { id: 'inquiry', label: 'Socratic Deduction', description: 'Hypothesis framing & evidence rebuttal', checked: true }
  ]);

  let drawerOpen = $state(false);

  // Leadership Team Data
  const councilMembers = [
    {
      name: 'Dr. Aarav Mehta',
      role: 'Chief Psychometrician & IRT Lead',
      bio: 'Former NCERT & ETS assessment fellow; author of discrete CAT calibration models for middle-school developmental bands.',
      domain: 'Item Response Theory (3PL)',
      provenance: 'ETS / NCERT Research Fellow',
      code: 'PSY-IRT-01'
    },
    {
      name: 'Dr. Elena Rostova',
      role: 'Cognitive Science & Dialogue Architect',
      bio: 'Pioneered Socratic cognitive scaffolding; specializes in adolescent inquiry without performance anxiety.',
      domain: 'Socratic Voice Scaffolding',
      provenance: 'Max Planck Cognitive Lab',
      code: 'COG-SOC-04'
    },
    {
      name: 'Marcus Vance',
      role: 'Principal Privacy & Systems Engineer',
      bio: 'Architect of relationship-scoped RLS policies, DPDP verifiable parental consent state machines, and zero-knowledge audits.',
      domain: 'DPDP Security & Cryptography',
      provenance: 'CERN / OWASP Privacy SIG',
      code: 'SEC-DPDP-09'
    },
    {
      name: 'Dr. Aditi Sen',
      role: 'Head of Learner Experience & Child Safety',
      bio: 'Classroom curriculum designer; focuses on eliminating high-stakes test pressure in favor of continuous evidence capture.',
      domain: 'Pedagogical Safety & WAY System',
      provenance: 'Stanford Learning Design',
      code: 'PED-EXP-12'
    }
  ];

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
    opacity={0.5}
    class="z-0"
  />
  <div class="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-mint/5 blur-[120px] rounded-none pointer-events-none z-0"></div>

  <!-- Centered Hero Stack (Comfortable Reading Measure) -->
  <div class="w-full max-w-3xl mx-auto px-4 sm:px-6 space-y-6 my-auto relative z-10">
    <!-- Editorial Kicker Badge -->
    <div class="hero-reveal inline-flex items-center gap-2 px-2.5 py-0.5 rounded-none bg-surface/90 backdrop-blur-xs border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
      <span class="w-1.5 h-1.5 rounded-none bg-mint animate-pulse"></span>
      <span class="tracking-wide">AI-NATIVE LEARNER INTELLIGENCE</span>
    </div>

    <!-- Main Editorial Headline & Subtitle -->
    <div class="space-y-3.5 max-w-2xl mx-auto">
      <h1 class="hero-reveal text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink leading-[1.12]">
        Understand how<br />
        <span class="bg-clip-text text-transparent bg-linear-to-r from-ink via-mint to-ink">
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
        class="inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-none bg-mint hover:bg-mint-hover text-mint-foreground font-medium text-xs sm:text-sm transition-micro shadow-xs cursor-pointer active-press"
      >
        <span>Access Workspace</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="#observatory"
        class="inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-none bg-surface/90 hover:bg-surface-subtle text-foreground border border-border font-medium text-xs sm:text-sm transition-micro cursor-pointer active-press shadow-xs"
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
  <section use:revealOnScroll={{ stagger: 0.06 }} class="space-y-8 pt-8 border-t border-border-subtle">
    <div data-reveal-item class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Icon icon="carbon:cics-sit" class="w-4 h-4 text-mint" />
          <span class="text-xs font-mono font-medium text-mint tracking-wider uppercase">
            04 · Interactive Capability Studio
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
          Interactive evaluation tools in action.
        </h2>
      </div>
      <p class="text-xs sm:text-sm text-ink-secondary max-w-sm sm:text-right leading-relaxed">
        Test our zero-curve interactive primitives: multi-step evaluation journeys, domain filters, and rubric telemetry sheets.
      </p>
    </div>

    <!-- Interactive Frame Container -->
    <div data-reveal-item class="studio-frame p-6 rounded-none bg-surface border border-border space-y-6 shadow-sm">
      <!-- Breadcrumb Context Header -->
      <div class="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <Breadcrumb
          items={[
            { label: 'Evaluation Engine', href: '#observatory' },
            { label: 'Classes 5–10 Sandbox' },
            { label: 'Live Demonstration' }
          ]}
        />

        <div class="flex items-center gap-2">
          <span class="text-[11px] font-mono text-ink-muted">Shortcut:</span>
          <Kbd>Tab</Kbd>
          <span class="text-[11px] text-ink-muted">to navigate</span>
        </div>
      </div>

      <!-- Live Stepper Component & Progress Indicator -->
      <div class="space-y-3">
        <div class="flex items-center justify-between text-xs">
          <span class="font-medium text-ink">Multi-Phase Assessment Journey:</span>
          {#if isAllCompleted}
            <span class="font-mono text-mint flex items-center gap-1.5 font-semibold">
              <CheckCircle2 class="size-3.5 stroke-[2.5]" />
              All 4 Phases Completed · Synthesis Verified
            </span>
          {:else}
            <span class="font-mono text-mint">
              Phase {currentStep} of {assessmentSteps.length}
            </span>
          {/if}
        </div>

        <!-- Linear Motion Progress Indicator -->
        <div class="h-1 bg-surface-subtle w-full border border-border overflow-hidden">
          <div
            class="h-full bg-mint transition-all duration-300 ease-out"
            style="width: {journeyProgressPercent}%;"
          ></div>
        </div>

        <Stepper
          steps={assessmentSteps}
          bind:current={currentStep}
          completed={isAllCompleted}
          clickable={true}
          onStepClick={(idx) => {
            currentStep = idx;
            if (isAllCompleted && idx < 4) {
              isAllCompleted = false;
            }
          }}
        />
      </div>

      <!-- Active Phase Workbench & Dynamic Stage Display -->
      {#if isAllCompleted}
        <!-- All 4 Phases Completed Stage Banner & Final Synthesis View -->
        <div class="p-5 rounded-none bg-mint-subtle border border-mint/40 space-y-4 animate-in fade-in duration-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-mint/20 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="size-8 rounded-none bg-mint text-mint-foreground flex items-center justify-center font-bold shadow-xs">
                <CheckCircle2 class="size-5 stroke-[2.5]" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-none bg-canvas text-mint border border-mint/30">
                    STAGE COMPLETE · VERIFIED
                  </span>
                  <span class="text-[10px] font-mono text-ink-muted">SYN-ALL-04</span>
                </div>
                <h3 class="text-base sm:text-lg font-semibold text-ink">
                  Longitudinal Learner Record Synthesized
                </h3>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs px-2.5 py-1 rounded-none bg-mint text-mint-foreground font-semibold">
                4 / 4 Modalities Demonstrated
              </span>
            </div>
          </div>

          <!-- 4 Phases Grid Readout -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div class="p-2.5 bg-surface border border-border space-y-1">
              <div class="flex items-center justify-between text-[10px] text-ink-muted">
                <span>01. Baseline CAT</span>
                <Check class="size-3 text-mint stroke-[2.5]" />
              </div>
              <span class="font-bold text-ink block text-sm font-mono tabular-nums">θ = +0.85</span>
              <span class="text-[10px] text-mint block">3PL Converged</span>
            </div>

            <div class="p-2.5 bg-surface border border-border space-y-1">
              <div class="flex items-center justify-between text-[10px] text-ink-muted">
                <span>02. Maker Linkage</span>
                <Check class="size-3 text-mint stroke-[2.5]" />
              </div>
              <span class="font-bold text-ink block text-sm font-mono tabular-nums">Level 4 / 5</span>
              <span class="text-[10px] text-mint block">4-Bar Meshed</span>
            </div>

            <div class="p-2.5 bg-surface border border-border space-y-1">
              <div class="flex items-center justify-between text-[10px] text-ink-muted">
                <span>03. Socratic Inquiry</span>
                <Check class="size-3 text-mint stroke-[2.5]" />
              </div>
              <span class="font-bold text-ink block text-sm font-mono tabular-nums">6 Turns</span>
              <span class="text-[10px] text-mint block">High Precision</span>
            </div>

            <div class="p-2.5 bg-surface border border-border space-y-1">
              <div class="flex items-center justify-between text-[10px] text-ink-muted">
                <span>04. Synthesis</span>
                <Check class="size-3 text-mint stroke-[2.5]" />
              </div>
              <span class="font-bold text-ink block text-sm font-mono tabular-nums">Strong</span>
              <span class="text-[10px] text-mint block">Longitudinal</span>
            </div>
          </div>

          <!-- Narrative & Provenance Summary -->
          <div class="p-3 bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div class="space-y-0.5 max-w-xl">
              <span class="text-[10px] font-mono text-ink-muted uppercase tracking-wider block">Developmental Conclusion</span>
              <p class="text-xs text-ink-secondary leading-relaxed">
                Triangulation complete across adaptive psychometrics, physical maker artifacts, and verbal deduction. Zero deterministic career exclusions assigned.
              </p>
            </div>
            <div class="shrink-0 flex items-center gap-1.5 font-mono text-[11px] text-positive">
              <Lock class="size-3.5" />
              <span>DPDP Verified Ledger</span>
            </div>
          </div>
        </div>
      {:else}
        <!-- Active Phase Dynamic Workbench Card -->
        <div class="p-5 rounded-none bg-surface-subtle border border-border space-y-4 transition-all duration-200">
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-border pb-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-none bg-surface border border-border text-mint">
                  {activePhase.badge}
                </span>
                <span class="text-[10px] font-mono text-ink-muted">{activePhase.code}</span>
              </div>
              <h3 class="text-base sm:text-lg font-semibold text-ink">
                {activePhase.title}
              </h3>
              <p class="text-xs text-ink-secondary leading-relaxed">
                {activePhase.subtitle}
              </p>
            </div>

            <div class="shrink-0">
              <span class="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded-none bg-surface border border-border text-mint">
                <span class="size-1.5 bg-mint rounded-none"></span>
                {activePhase.tag}
              </span>
            </div>
          </div>

          <!-- 3 Metrics Grid for Active Phase -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div class="p-3 bg-surface border border-border space-y-1">
              <span class="text-[10px] text-ink-muted block uppercase tracking-wider">{activePhase.metric1.label}</span>
              <span class="font-bold font-mono tabular-nums text-ink text-sm block">{activePhase.metric1.value}</span>
              <span class="text-[10px] text-ink-secondary block">{activePhase.metric1.desc}</span>
            </div>
            <div class="p-3 bg-surface border border-border space-y-1">
              <span class="text-[10px] text-ink-muted block uppercase tracking-wider">{activePhase.metric2.label}</span>
              <span class="font-bold font-mono tabular-nums text-ink text-sm block">{activePhase.metric2.value}</span>
              <span class="text-[10px] text-ink-secondary block">{activePhase.metric2.desc}</span>
            </div>
            <div class="p-3 bg-surface border border-border space-y-1">
              <span class="text-[10px] text-ink-muted block uppercase tracking-wider">{activePhase.metric3.label}</span>
              <span class="font-bold font-mono tabular-nums text-ink text-sm block">{activePhase.metric3.value}</span>
              <span class="text-[10px] text-ink-secondary block">{activePhase.metric3.desc}</span>
            </div>
          </div>

          <!-- Active Rubric Demonstration Readout -->
          <div class="p-3 bg-surface border border-border space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-semibold text-[11px] uppercase tracking-wider text-brand">
                Live Rubric Demonstration
              </span>
              <span class="text-[10px] font-mono text-positive flex items-center gap-1">
                <Lock class="size-3" />
                Tamper-evident
              </span>
            </div>
            <EvidenceRating
              rating={activePhase.rubricRating}
              max={5}
              label={activePhase.rubricLabel}
            />
            <p class="text-xs text-ink-secondary leading-relaxed pt-0.5">
              {activePhase.rubricDesc}
            </p>
          </div>
        </div>
      {/if}

      <!-- Interactive Controls Toolbar -->
      <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
        <div class="flex flex-wrap items-center gap-3">
          <!-- Selection Dropdown with Checkboxes -->
          <DropdownCheckbox
            title="Filter Competencies"
            bind:items={competencyOptions}
          />

          <!-- Action Button Group with Full Completion & Replay -->
          <ButtonGroup>
            <button
              type="button"
              onclick={handlePrevPhase}
              disabled={currentStep === 1 && !isAllCompleted}
              class="px-3 py-1.5 text-xs font-medium bg-surface border border-border hover:bg-surface-subtle disabled:opacity-40 disabled:cursor-not-allowed text-ink transition-micro cursor-pointer active-press"
            >
              Previous Phase
            </button>

            {#if currentStep < assessmentSteps.length && !isAllCompleted}
              <button
                type="button"
                onclick={handleNextPhase}
                class="px-3.5 py-1.5 text-xs font-medium bg-mint text-mint-foreground hover:bg-mint-hover transition-micro cursor-pointer active-press shadow-xs flex items-center gap-1.5"
              >
                <span>Next Phase</span>
                <ArrowRight class="size-3.5" />
              </button>
            {:else if currentStep === assessmentSteps.length && !isAllCompleted}
              <!-- Complete Phase 4 & Synthesize Entire Stage -->
              <button
                type="button"
                onclick={handleNextPhase}
                class="px-4 py-1.5 text-xs font-semibold bg-mint text-mint-foreground hover:bg-mint-hover transition-micro cursor-pointer active-press shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 class="size-3.5 stroke-[2.5]" />
                <span>Complete Phase 4 & Synthesize</span>
              </button>
            {:else}
              <!-- Replay Journey when all completed -->
              <button
                type="button"
                onclick={handleReplayJourney}
                class="px-3.5 py-1.5 text-xs font-medium bg-surface border border-border hover:bg-surface-subtle text-ink transition-micro cursor-pointer active-press flex items-center gap-1.5"
              >
                <Icon icon="carbon:reset" class="size-3.5 text-mint" />
                <span>Replay Journey</span>
              </button>
            {/if}
          </ButtonGroup>
        </div>

        <!-- Sheet / Drawer Trigger for Diagnostic Telemetry -->
        <Sheet.Root bind:open={drawerOpen}>
          <Sheet.Trigger>
            {#snippet child({ props })}
              <button
                {...props}
                use:magneticHover
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-brand text-brand-foreground hover:bg-brand/90 text-xs font-medium transition-micro cursor-pointer shadow-xs active-press"
              >
                <Sliders class="size-3.5" />
                <span>Inspect Diagnostic Sheet</span>
              </button>
            {/snippet}
          </Sheet.Trigger>

          <!-- Right-Anchored Sheet Drawer Content (Strict 0px Sharp) -->
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
       7. RESEARCH & PSYCHOMETRIC COUNCIL (Team & Governance)
       ============================================================ -->
  <section use:revealOnScroll={{ stagger: 0.06 }} class="space-y-12 pt-8 border-t border-border-subtle">
    <div data-reveal-item class="text-center max-w-xl mx-auto space-y-2">
      <span class="text-xs font-mono font-medium text-mint tracking-wider uppercase">
        06 · Scientific Governance
      </span>
      <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        Multidisciplinary research council.
      </h2>
      <p class="text-sm text-ink-secondary">
        Cognitive scientists, psychometricians, and child safety engineers shaping ethical AI intelligence.
      </p>
    </div>

    <!-- 4 Members Technical Cards (Strict 0px Sharp) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each councilMembers as member}
        <div data-reveal-item class="council-card p-6 rounded-none bg-surface border border-border space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <!-- Square Avatar Technical Badge -->
              <div class="council-badge size-10 rounded-none bg-surface-subtle border border-border flex items-center justify-center font-mono text-xs font-bold text-mint shrink-0 shadow-2xs">
                {member.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 class="text-sm font-semibold text-ink">{member.name}</h3>
                <span class="text-xs text-brand block">{member.role}</span>
              </div>
            </div>
            <span class="font-mono text-[10px] bg-surface-subtle border border-border px-2 py-0.5 text-ink-muted">
              {member.code}
            </span>
          </div>

          <p class="text-xs text-ink-secondary leading-relaxed">
            {member.bio}
          </p>

          <div class="pt-2 border-t border-border flex items-center justify-between text-[11px] text-ink-muted">
            <span>Specialization: <strong class="text-ink font-medium">{member.domain}</strong></span>
            <span class="font-mono text-[10px]">{member.provenance}</span>
          </div>
        </div>
      {/each}
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
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-mint hover:bg-mint-hover text-mint-foreground font-medium text-xs sm:text-sm transition-micro shadow-xs cursor-pointer active-press"
            >
              <span>Request District Pilot</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
            <a
              href="/studio"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-surface-subtle hover:bg-surface-raised text-ink border border-border font-medium text-xs sm:text-sm transition-micro cursor-pointer shadow-xs active-press"
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

  .moment-arrow {
    transition: transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  :global(.group:hover) .moment-arrow {
    transform: translateX(3px);
  }

  /* --- Scientific Council Cards --- */
  .council-card {
    transition:
      transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1)),
      border-color var(--duration-standard, 200ms) ease,
      box-shadow var(--duration-standard, 200ms) ease;
  }

  .council-card:hover {
    transform: translateY(-2px);
    border-color: color-mix(in oklch, var(--color-brand) 35%, var(--color-border));
    box-shadow: 0 4px 16px rgb(0 0 0 / 0.06);
  }

  .council-badge {
    transition:
      background-color var(--duration-micro, 140ms) ease,
      border-color var(--duration-micro, 140ms) ease,
      color var(--duration-micro, 140ms) ease,
      transform var(--duration-standard, 200ms) var(--ease-lagom, cubic-bezier(0.16, 1, 0.3, 1));
  }

  .council-card:hover .council-badge {
    background-color: color-mix(in oklch, var(--color-brand) 15%, transparent);
    border-color: var(--color-brand);
    color: var(--color-brand);
    transform: scale(1.05);
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
    .moment-arrow,
    .council-card,
    .council-badge,
    .ambient-vector,
    :global(.active-press:active) {
      transition: none !important;
      animation: none !important;
      transform: none !important;
    }
  }
</style>
