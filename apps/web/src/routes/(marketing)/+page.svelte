<script lang="ts">
  import { goto } from '$app/navigation';
  import { Dialog } from 'bits-ui';
  import {
    Brain,
    AudioWaveform,
    Database,
    MessageSquareText,
    Wrench,
    ArrowUpRight,
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Plus,
    Minus,
    Check,
    ShieldCheck,
    Mail,
    Building2,
    X
  } from 'lucide-svelte';
  import { TextScramble } from '$lib/components/beui';
  import {
    ParticleButton,
    ActivityTerrain,
    AIVoice,
    MetricCard,
    AppleActivityCard,
    MorphicNavbar,
    AICitations,
    TypewriterHeading,
    type ParticleButtonStatus
  } from '$lib/components/kokonutui';

  type GradeClass = '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  type WorkspaceRole = 'learner' | 'family' | 'school' | 'studio';

  let isModalOpen = $state(false);
  let selectedRole = $state<WorkspaceRole>('learner');
  let selectedClass = $state<GradeClass>('8');
  let activeLevel = $state<1 | 2 | 3>(1);
  let activeStageIndex = $state(0);

  interface HowItWorksStage {
    id: string;
    stepNumber: string;
    stageLabel: string;
    title: string;
    description: string;
    metricBadge: string;
    accentClass: string;
    dotClass: string;
    badgeBgClass: string;
    probe: {
      domainTag: string;
      level1Title: string;
      level1Prompt: string;
      level2Context: string;
      level3Claim: string;
      level3Proof: string;
      rubricCount: string;
      provenanceHash: string;
    };
  }

  const howItWorksStages: HowItWorksStage[] = [
    {
      id: 'calibrate',
      stepNumber: '01',
      stageLabel: 'STAGE 01 · CALIBRATE',
      title: 'Untimed Adaptive Concept Checks',
      description:
        'Questions adapt smoothly to prior responses in 18 minutes, identifying conceptual boundaries without countdown stress.',
      metricBadge: '18 min · CAT Engine · Untimed',
      accentClass: 'text-brand',
      dotClass: 'bg-brand',
      badgeBgClass: 'bg-brand-subtle text-brand',
      probe: {
        domainTag: 'Class 8 Maker Lab · Practical Build',
        level1Title: 'Dual-Syringe Hydraulic Gripper',
        level1Prompt:
          'A 10 mL master syringe drives a 30 mL actuator cylinder. How does piston travel distance trade off against gripping force?',
        level2Context:
          'Piston displacement verifies Pascal principle and conservation of fluid work in mechanical equilibrium.',
        level3Claim: '3:1 Force Multiplication Verified',
        level3Proof:
          'Pushing master piston 3 cm displaces fluid to lift load piston 1 cm at triple force. Corroborated across build and oral defense.',
        rubricCount: '4 / 4 Rubric Criteria Met',
        provenanceHash: 'SHA-256: 4f8b91...7e2a'
      }
    },
    {
      id: 'inquire',
      stepNumber: '02',
      stageLabel: 'STAGE 02 · INQUIRE',
      title: 'First-Principles Socratic Dialogue',
      description:
        'When a learner hits friction, the voice mentor asks targeted guiding questions so the insight stays theirs.',
      metricBadge: 'Voice Inquiry · Zero Direct Answers · Socratic',
      accentClass: 'text-ai',
      dotClass: 'bg-ai',
      badgeBgClass: 'bg-ai-subtle text-ai',
      probe: {
        domainTag: 'Socratic Voice Mentor · Guided Reflection',
        level1Title: 'Thermal Convection & Acoustic Resonance',
        level1Prompt:
          'As temperature rises in the resonant tube, the resonant acoustic pitch sharpens. What thermodynamic property of the medium changed?',
        level2Context:
          'Sound speed increases with the square root of absolute temperature, raising standing frequency at fixed tube wavelength.',
        level3Claim: 'First-Principles Gas Law Defense',
        level3Proof:
          'Learner derived that speed of sound increases with temperature (v ∝ √T), raising the standing frequency. Zero hint leaks.',
        rubricCount: 'Socratic Move #SM-04 Verified',
        provenanceHash: 'SHA-256: 9c3d14...08fe'
      }
    },
    {
      id: 'navigate',
      stepNumber: '03',
      stageLabel: 'STAGE 03 · NAVIGATE',
      title: 'Multi-Year Pathway Navigation',
      description:
        'Demonstrated strengths accumulate across terms into actionable subject and project recommendations for families and schools.',
      metricBadge: '14+ Artifacts · No Percentiles · Longitudinal',
      accentClass: 'text-positive',
      dotClass: 'bg-positive',
      badgeBgClass: 'bg-positive/10 text-positive',
      probe: {
        domainTag: 'Pathway Map · Classes 5 to 10 Guidance',
        level1Title: 'Applied Mechatronics & Kinematics Pathway',
        level1Prompt:
          'Accumulated evidence across Class 7 and 8 projects demonstrates strong spatial visualization and mechanical equilibrium.',
        level2Context:
          'Actionable guidance connects student passion with secondary coursework before high-stakes streaming.',
        level3Claim: 'Verified Longitudinal Portfolio Seal',
        level3Proof:
          '14 verified physical & adaptive artifacts corroborated. Recommended bridge sprint in mechatronics without premature career labeling.',
        rubricCount: 'Tripartite Consensus Signed',
        provenanceHash: 'SHA-256: 7a1e52...3d81'
      }
    }
  ];

  const currentStage = $derived(howItWorksStages[activeStageIndex]);

  function selectStage(index: number) {
    activeStageIndex = index;
    activeLevel = 1;
  }

  function prevStage() {
    if (activeStageIndex > 0) {
      selectStage(activeStageIndex - 1);
    }
  }

  function nextStage() {
    if (activeStageIndex < howItWorksStages.length - 1) {
      selectStage(activeStageIndex + 1);
    }
  }

  // Research dispatch subscription state
  let dispatchEmail = $state('');
  let dispatchStatus = $state<ParticleButtonStatus>('idle');
  let dispatchConfirmed = $state(false);
  let dispatchError = $state('');

  interface ClassCurriculum {
    grade: GradeClass;
    label: string;
    ageBracket: string;
    tierName: string;
    focusArea: string;
    missionTitle: string;
    missionDescription: string;
    competencyPillars: string[];
    consentStatus: string;
  }

  const classCurricula: Record<GradeClass, ClassCurriculum> = {
    '3': {
      grade: '3',
      label: 'Class 3',
      ageBracket: 'Ages 8 to 9',
      tierName: 'Tier I · Foundational Discovery',
      focusArea: 'Plant Hydraulics & Capillary Action',
      missionTitle: 'Class 3 Mission · Seed Germination & Capillary Tracking',
      missionDescription:
        'Track capillary water absorption across 3 soil blends in an observation journal with illustrated daily logs.',
      competencyPillars: ['Pattern Recognition', 'Empirical Measurement', 'Nature Observation'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '4': {
      grade: '4',
      label: 'Class 4',
      ageBracket: 'Ages 9 to 10',
      tierName: 'Tier I · Foundational Discovery',
      focusArea: 'Simple Levers & Equilibrium Scales',
      missionTitle: 'Class 4 Mission · Mechanical Advantage on a Fulcrum',
      missionDescription:
        'Construct a wooden balance scale to calculate weight offsets and verify proportional equilibrium ratios.',
      competencyPillars: ['Mechanical Advantage', 'Fractional Scaling', 'Physical Modeling'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '5': {
      grade: '5',
      label: 'Class 5',
      ageBracket: 'Ages 10 to 11',
      tierName: 'Tier I · Foundational Discovery',
      focusArea: 'Optics & Focal Refraction',
      missionTitle: 'Class 5 Mission · Pinhole Camera & Geometric Rays',
      missionDescription:
        'Fabricate an aperture box, measure inverted ray angles, and plot light transmission through water lenses.',
      competencyPillars: ['Geometric Optics', 'Symmetric Mapping', 'Hypothesis Testing'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '6': {
      grade: '6',
      label: 'Class 6',
      ageBracket: 'Ages 11 to 12',
      tierName: 'Tier II · Exploratory Core',
      focusArea: 'Circuit Logic & Solenoid Electromagnets',
      missionTitle: 'Class 6 Mission · Dual-Switch Relays & Magnetic Force',
      missionDescription:
        'Wire parallel and series circuits with copper tape and test solenoid lifting capacity at varied voltage inputs.',
      competencyPillars: ['Circuit Architecture', 'Magnetic Flux', 'System Verification'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '7': {
      grade: '7',
      label: 'Class 7',
      ageBracket: 'Ages 12 to 13',
      tierName: 'Tier II · Exploratory Core',
      focusArea: 'Pneumatics & Atmospheric Compression',
      missionTitle: 'Class 7 Mission · Dual-Syringe Actuator Arm',
      missionDescription:
        'Build a hydraulic gripper using linked tubing and measure force transmission across liquid versus air compression.',
      competencyPillars: ['Fluid Pressure', 'Mechanical Efficiency', 'Algebraic Rates'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '8': {
      grade: '8',
      label: 'Class 8',
      ageBracket: 'Ages 13 to 14',
      tierName: 'Tier II · Exploratory Core',
      focusArea: 'Kinematic 4-Bar Linkages & Gear Mesh',
      missionTitle: 'Class 8 Mission · 3:1 Torque Compensation & Planar Mechanics',
      missionDescription:
        'Assemble laser-cut acrylic linkages, balance friction resistance, and defend thermodynamic convection loops in Socratic voice inquiry.',
      competencyPillars: ['Spatial Kinematics', 'Proportional Algebra', 'Socratic Deduction'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '9': {
      grade: '9',
      label: 'Class 9',
      ageBracket: 'Ages 14 to 15',
      tierName: 'Tier III · Secondary Core & Diagnostics',
      focusArea: 'Sensor Telemetry & Environmental Closed Loops',
      missionTitle: 'Class 9 Mission · Microcontroller Calibration & Feedback Control',
      missionDescription:
        'Interface digital thermistors and photoresistors to write closed-loop feedback routines with quadratic error smoothing.',
      competencyPillars: ['Sensor Calibration', 'Quadratic Modeling', 'Embedded Logic'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '10': {
      grade: '10',
      label: 'Class 10',
      ageBracket: 'Ages 15 to 16',
      tierName: 'Tier III · Secondary Core & Diagnostics',
      focusArea: 'Autonomous Mechatronics & Trigonometric Guidance',
      missionTitle: 'Class 10 Mission · 2-Axis Robotic Servo Arm',
      missionDescription:
        'Calculate inverse trigonometric angles for end-effector positioning and model joint friction under continuous load.',
      competencyPillars: ['Spatial Geometry', 'Trigonometric Vectoring', 'Structural Stress Analysis'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '11': {
      grade: '11',
      label: 'Class 11',
      ageBracket: 'Ages 16 to 17',
      tierName: 'Tier IV · Senior Secondary Pathways',
      focusArea: 'Bio-Computational Modeling & Enzyme Kinetics',
      missionTitle: 'Class 11 Mission · Differential Reaction Rates & Cellular Modeling',
      missionDescription:
        'Model substrate reaction kinetics in computational notebooks and defend research citations in Socratic evaluation.',
      competencyPillars: ['Biochemical Kinetics', 'Differential Equations', 'Literature Defense'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    },
    '12': {
      grade: '12',
      label: 'Class 12',
      ageBracket: 'Ages 17 to 18',
      tierName: 'Tier IV · Senior Secondary Pathways',
      focusArea: 'Machine Intelligence & Capstone Synthesis',
      missionTitle: 'Class 12 Mission · Multi-Spectral Sorting & Decision Boundaries',
      missionDescription:
        'Train a lightweight computer vision classifier for automated material sorting and compile verifiable capstone portfolio evidence.',
      competencyPillars: ['Computer Vision', 'Multivariate Synthesis', 'Capstone Defense'],
      consentStatus: 'Parental Consent Verified · DPDP Act 2023 Statutory Protection'
    }
  };

  const currentCurriculum = $derived(classCurricula[selectedClass] || classCurricula['8']);

  const workspaceTargets: Record<WorkspaceRole, string> = {
    learner: '/student',
    family: '/parent',
    school: '/teacher',
    studio: '/studio'
  };

  function openWorkspaceModal(role: WorkspaceRole = 'learner', grade: GradeClass = '8') {
    selectedRole = role;
    selectedClass = grade;
    isModalOpen = true;
  }

  async function handleEnterWorkspace(roleKey: WorkspaceRole) {
    const targetPath = workspaceTargets[roleKey];
    const query = `?class=${selectedClass}`;
    if (import.meta.env.DEV) {
      try {
        await fetch('/api/auth/dev-switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: roleKey === 'family' ? 'parent' : roleKey === 'school' ? 'teacher' : roleKey,
            gradeClass: selectedClass
          })
        });
      } catch {
        // Fallback to direct navigation
      }
      goto(`${targetPath}${query}`);
    } else {
      goto('/login');
    }
  }

  const capabilities = [
    {
      id: 'maker-studio',
      label: 'Maker Studio',
      icon: Wrench,
      cadence: '20-min build',
      summary: 'Hands-on engineering and science missions mapped to verifiable rubric outcomes.',
      imageSrc: '/images/agenta/hero_maker_studio.jpg',
      imageWidth: 1280,
      imageHeight: 714,
      imageAlt: 'Class 8 student assembling a precision kinematic linkage in a maker workshop',
      milestone: 'Milestone 02 · Kinematic linkage build · 4 of 5 foundational competencies demonstrated',
      tag: 'Maker Studio · Class 8',
      pageUrl: '/ide',
      pageLabel: 'Rover Studio IDE'
    },
    {
      id: 'adaptive-assessment',
      label: 'Adaptive Check',
      icon: Brain,
      cadence: '18-min check',
      summary: 'Calm, untimed adaptive concept checks that meet each learner where they are.',
      imageSrc: '/images/agenta/step_adaptive_diagnostic.jpg',
      imageWidth: 960,
      imageHeight: 717,
      imageAlt: 'Student engaged in an untimed adaptive mathematics concept check',
      milestone: 'Calibration 01 · Untimed adaptive check · High calibration consistency',
      tag: 'Adaptive Check · Class 8',
      pageUrl: '/student/assessment',
      pageLabel: 'Adaptive Check'
    },
    {
      id: 'socratic-mentor',
      label: 'Socratic Mentor',
      icon: AudioWaveform,
      cadence: 'Live voice',
      summary: 'Guided Socratic voice dialogue that asks first-principles questions without giving answers.',
      imageSrc: '/images/agenta/step_socratic_inquiry.jpg',
      imageWidth: 960,
      imageHeight: 717,
      imageAlt: 'Student testing a circuit prototype during a guided Socratic voice dialogue',
      milestone: 'Inquiry 02 · Guided Socratic voice dialogue · Independent reasoning verified',
      tag: 'Quiet Mentor · Class 8',
      pageUrl: '/student',
      pageLabel: 'Voice Mentor'
    },
    {
      id: 'evidence-portfolio',
      label: 'Evidence Ledger',
      icon: Database,
      cadence: 'Provenance',
      summary: 'Every growth statement links directly to a verified project, rubric, or inquiry log.',
      imageSrc: '/images/agenta/evidence_space_explorer.jpg',
      imageWidth: 960,
      imageHeight: 717,
      imageAlt: 'Student exploring geometric learning pathways backed by verified artifacts',
      milestone: 'Portfolio 03 · Sealed artifact provenance · 14 verified submissions',
      tag: 'Evidence Ledger · Class 8',
      pageUrl: '/student/growth',
      pageLabel: 'Evidence Ledger'
    },
    {
      id: 'pathway-navigator',
      label: 'Pathway Map',
      icon: MessageSquareText,
      cadence: 'Classes 5 to 10',
      summary: 'Developmental trajectory guidance across STEM, humanities, and creative disciplines.',
      imageSrc: '/images/agenta/step_growth_synthesis.jpg',
      imageWidth: 960,
      imageHeight: 717,
      imageAlt: 'Faceted botanical growth model representing longitudinal learning pathways',
      milestone: 'Trajectory 04 · Longitudinal synthesis · Broad exploratory readiness',
      tag: 'Pathway Map · Class 8',
      pageUrl: '/schools',
      pageLabel: 'Pathway Framework'
    }
  ];

  let selectedCapIndex = $state(0);
  const activeCap = $derived(capabilities[selectedCapIndex]);

  // Animated tab indicator
  let capRailEl = $state<HTMLElement | null>(null);
  let capIndicatorLeft = $state(0);
  let capIndicatorWidth = $state(0);

  $effect(() => {
    if (!capRailEl) return;
    const btn = capRailEl.querySelectorAll('button')[selectedCapIndex] as HTMLButtonElement | undefined;
    if (btn) {
      capIndicatorLeft = btn.offsetLeft;
      capIndicatorWidth = btn.offsetWidth;
    }
  });

  const sectionNavItems = {
    '#philosophy': { name: 'Evidence Law' },
    '#how-it-works': { name: 'How It Works' },
    '#capabilities': { name: 'Capabilities' },
    '#roles': { name: 'Workspaces' },
    '#faq': { name: 'Governance FAQ' },
    '#contact': { name: 'Contact' }
  };

  const socraticTurns = [
    {
      speaker: 'Learner · Aarav (Class 8)',
      text: 'When I swapped the narrow syringe for one twice as wide, the arm lifted more weight but barely moved half as far.'
    },
    {
      speaker: 'Quiet Voice Mentor · AI Guided',
      text: 'Good observation. If the piston diameter doubles while the water volume stays fixed, how does the circular cross-section area change?'
    },
    {
      speaker: 'Learner · Aarav (Class 8)',
      text: 'Area uses radius squared, so doubling the width makes the area four times larger. That means one quarter the travel distance!'
    }
  ];

  let faqList = $state([
    {
      id: '01',
      q: 'How is CREED OS different from a standard exam or report card?',
      a: 'Traditional report cards compress months of learning into a single retroactive percentage. CREED OS continuously links practical builds, untimed adaptive checks, and Socratic voice reflections into a living developmental profile where every claim cites concrete work.',
      open: true
    },
    {
      id: '02',
      q: 'Do you use generative AI to score or grade student work?',
      a: 'Never. Capability estimates and rubric scores are computed strictly by deterministic mathematical models and educator-verified criteria. AI explains context and asks guiding Socratic questions; deterministic systems score; human educators and families decide.',
      open: false
    },
    {
      id: '03',
      q: 'How does child data privacy work under India DPDP Act 2023?',
      a: 'Statutory child safety applies to every minor under 18 years. Verified parental consent is mandatory before any profiling or processing begins. Access is isolated by relationship-scoped Row Level Security, with zero behavioral advertising or third-party data brokerage.',
      open: false
    },
    {
      id: '04',
      q: 'Why focus core navigation on Classes 5 to 10 (with modular Classes 3 to 12)?',
      a: 'Ages 10 to 16 represent the formative window before high-stakes subject streaming. Giving learners structured room to build, test, and discover authentic strengths during middle and secondary school prevents premature career exclusions.',
      open: false
    },
    {
      id: '05',
      q: 'What do parents see versus teachers and counselors?',
      a: 'Families see calm, plain-language developmental narratives and weekly activity rhythms without raw technical parameters or anxiety-inducing rank tables. Educators and counselors receive high-density curriculum alignment matrices and early support signals.',
      open: false
    }
  ]);

  function toggleFaq(index: number) {
    faqList[index].open = !faqList[index].open;
  }

  async function submitDispatch(e: SubmitEvent) {
    e.preventDefault();
    const trimmed = dispatchEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      dispatchError = 'Enter a valid school or guardian email address.';
      dispatchStatus = 'error';
      return;
    }
    dispatchError = '';
    dispatchStatus = 'pending';
    await new Promise((resolve) => setTimeout(resolve, 260));
    dispatchStatus = 'success';
    dispatchConfirmed = true;
  }
</script>

<svelte:head>
  <title>CREED OS · Learner Intelligence &amp; Pathway Navigation Platform</title>
  <meta
    name="description"
    content="Practical projects, deterministic adaptive checks, and Socratic voice inquiry united into one evidence-backed developmental profile for Classes 5 to 10 (modular 3 to 12)."
  />
</svelte:head>

<!-- Hero Decision Surface -->
<section class="relative w-full border-b border-border bg-canvas pt-20 pb-8 sm:pt-24 sm:pb-12 lg:pt-28 lg:pb-14">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <div class="mx-auto max-w-4xl text-center">
      <div class="inline-flex items-center gap-2 rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-xs text-ink-secondary shadow-2xs">
        <ShieldCheck class="size-3.5 text-brand" />
        <span>Classes 3 to 12 · DPDP Act 2023 Verified</span>
      </div>

      <h1 class="mt-6 font-heading font-semibold text-4xl tracking-tight text-ink sm:text-5xl lg:text-6xl">
        <TypewriterHeading
          staticLine="Room to grow."
          sequences={[
            { text: 'Backed by real evidence.', deleteAfter: true },
            { text: 'Not a single test score.', deleteAfter: true },
            { text: 'Built for Classes 3 to 12.' }
          ]}
          typingSpeed={46}
          deleteSpeed={26}
          pauseBeforeDelete={1100}
          loopDelay={1400}
          naturalVariance={true}
          deleteMode="backspace"
          textClass="text-4xl sm:text-5xl lg:text-6xl leading-[1.15] tracking-tight"
        />
      </h1>

      <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-secondary text-balance sm:text-lg">
        Hands-on maker builds, adaptive checks, and Socratic voice inquiry.<br class="hidden sm:inline" />
        One calm developmental profile, free of fixed ability labels.
      </p>

      <!-- Primary & Secondary Next Actions -->
      <div class="mt-8 flex flex-col items-center justify-center gap-3 pb-6 sm:flex-row sm:pb-8">
        <button
          type="button"
          onclick={() => openWorkspaceModal('learner', '8')}
          class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-brand px-6 py-2 text-sm font-semibold text-brand-foreground shadow-xs transition-colors duration-150 hover:bg-brand-hover outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto cursor-pointer"
        >
          <span>Start 20-Min Mission</span>
          <ArrowRight class="size-4" />
        </button>

        <a
          href="/schools"
          class="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-sm border border-border bg-surface-raised px-6 py-2 text-sm font-medium text-ink transition-colors duration-150 hover:bg-surface-subtle outline-none focus-visible:ring-2 focus-visible:ring-brand sm:w-auto"
        >
          <span>School Rollout</span>
          <ArrowUpRight class="size-4 text-ink-muted" />
        </a>
      </div>
    </div>

    <!-- Integrated Expressive Hero Console Frame (WAY 2.1 Rule 3: 8px rounded-md structural) -->
    <div class="mx-auto mt-8 max-w-5xl overflow-hidden rounded-md border border-border bg-surface-raised shadow-xs sm:mt-12 lg:mt-14">
      <!-- Capability Rail with compositor-accelerated sliding indicator -->
      <div
        bind:this={capRailEl}
        role="tablist"
        aria-label="Platform capabilities"
        class="relative grid grid-cols-2 divide-x divide-y sm:divide-y-0 divide-border border-b border-border bg-surface sm:grid-cols-5"
      >
        <!-- Sliding brand indicator (hidden on mobile grid) -->
        <span
          aria-hidden="true"
          class="pointer-events-none absolute bottom-0 hidden h-0.5 bg-brand transition-all duration-200 ease-out sm:block"
          style="left: {capIndicatorLeft}px; width: {capIndicatorWidth}px;"
        ></span>

        {#each capabilities as cap, index (cap.id)}
          {@const Icon = cap.icon}
          {@const isSelected = selectedCapIndex === index}
          <button
            type="button"
            role="tab"
            aria-selected={isSelected}
            onclick={() => (selectedCapIndex = index)}
            class="flex flex-col items-start justify-between gap-1 p-3 text-left outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand cursor-pointer {isSelected
              ? 'bg-surface-raised text-ink border-b-2 border-brand sm:border-b-0 font-semibold'
              : 'text-ink-secondary hover:bg-surface-subtle hover:text-ink'}"
          >
            <div class="flex w-full items-center justify-between gap-2">
              <Icon class="size-4 shrink-0 {isSelected ? 'text-brand' : 'text-ink-muted'}" />
              <span class="font-mono text-[10px] {isSelected ? 'text-brand font-semibold' : 'text-ink-muted'}">
                {cap.cadence}
              </span>
            </div>
            <span class="text-xs tracking-tight">{cap.label}</span>
          </button>
        {/each}
      </div>

      <!-- Media frame: ambient backdrop + contained illustration (never cropped) -->
      <div class="relative flex min-h-[280px] items-center justify-center overflow-hidden bg-surface-subtle sm:min-h-[380px] lg:min-h-[440px]">
        <!-- Blurred ambient fill — always covers the frame regardless of image aspect ratio -->
        <img
          src={activeCap.imageSrc}
          alt=""
          aria-hidden="true"
          width={activeCap.imageWidth}
          height={activeCap.imageHeight}
          class="pointer-events-none absolute inset-0 h-full w-full select-none scale-110 object-cover opacity-15 blur-2xl transition-opacity duration-200"
        />
        <!-- Primary illustration: contained, never clipped -->
        <img
          src={activeCap.imageSrc}
          alt={activeCap.imageAlt}
          width={activeCap.imageWidth}
          height={activeCap.imageHeight}
          fetchpriority="high"
          loading="eager"
          decoding="async"
          class="relative z-10 max-h-[280px] w-auto max-w-full object-contain transition-opacity duration-200 sm:max-h-[380px] lg:max-h-[440px]"
        />
      </div>

      <!-- Capability Milestone Dock (WAY 2.1 Level 1 + 2: Signal → Context → Action) -->
      <div class="flex flex-col gap-2 border-t border-border bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div class="min-w-0 space-y-0.5">
          <p class="truncate text-xs font-semibold text-ink">{activeCap.milestone}</p>
          <p class="truncate text-[11px] text-ink-secondary">{activeCap.summary}</p>
        </div>
        <div class="flex shrink-0 items-center gap-3">
          <span class="hidden font-mono text-[11px] text-ink-muted md:inline">{activeCap.tag}</span>
          <a
            href={activeCap.pageUrl}
            class="inline-flex min-h-8 items-center gap-1 rounded-sm bg-brand px-3 py-1 text-xs font-medium text-brand-foreground transition-colors duration-150 hover:bg-brand-hover outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span>Open {activeCap.pageLabel}</span>
            <ArrowUpRight class="size-3.5" />
          </a>
        </div>
      </div>
    </div>

    <!-- Section Jump Bar (Kokonut UI MorphicNavbar Svelte 5 Port) -->
    <div class="mt-6 hidden md:block">
      <MorphicNavbar items={sectionNavItems} defaultPath="#philosophy" />
    </div>
  </div>
</section>

<!-- Section 2: Core Educational Law & Interactive AI Inline Citations -->
<section id="philosophy" class="scroll-mt-20 border-b border-border bg-surface py-16 sm:py-20">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <div class="mx-auto grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
      <div class="space-y-6 lg:col-span-5">
        <div>
          <span class="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
            Evidence Before Inference
          </span>
          <h2 class="mt-2 font-heading font-semibold text-2xl tracking-tight text-ink sm:text-3xl">
            A single test score does not tell you who a young person is becoming.
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-ink-secondary">
            Every statement in a CREED OS learner profile maps to tangible project rubrics, adaptive checks, or guided Socratic reflections. Deterministic engines compute progress; AI explains context; educators and families decide.
          </p>
        </div>

        <dl class="space-y-4 border-t border-border pt-4">
          <div class="border-l-2 border-brand/50 pl-3.5 space-y-1">
            <dt class="font-mono text-xs font-semibold text-ink">01 · Deterministic Calibration</dt>
            <dd class="text-xs leading-relaxed text-ink-secondary">
              Untimed adaptive checks estimate mastery bands mathematically, never via unconstrained language model guesses.
            </dd>
          </div>
          <div class="border-l-2 border-brand/50 pl-3.5 space-y-1">
            <dt class="font-mono text-xs font-semibold text-ink">02 · Growth Before Labeling</dt>
            <dd class="text-xs leading-relaxed text-ink-secondary">
              Zero fixed IQ numbers, rank shaming, or premature stream exclusions during formative school years.
            </dd>
          </div>
        </dl>
      </div>

      <!-- Interactive Evidence-Backed Narrative (Kokonut UI AICitations Port) -->
      <div class="lg:col-span-7">
        <div class="rounded-sm border border-border bg-surface-raised p-6 shadow-2xs">
          <div class="mb-4 flex items-center gap-3">
            <img
              src="/images/agenta/learner_profile_aarav-sm.jpg"
              alt="Portrait of Aarav S., Class 8 learner"
              width="48"
              height="48"
              loading="lazy"
              decoding="async"
              class="size-12 shrink-0 rounded-sm border border-border object-cover object-top"
            />
            <div>
              <h3 class="text-sm font-semibold text-ink">Aarav S. · Class 8 Growth Synthesis</h3>
              <p class="font-mono text-xs text-ink-muted">
                Strong foundation · 4 / 5 mechanical systems competencies demonstrated
              </p>
            </div>
          </div>

          <AICitations />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Section 3: How It Works + Interactive Three-Level Evidence Probe -->
<section id="how-it-works" class="scroll-mt-20 border-b border-border bg-canvas py-16 sm:py-20">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <!-- Section Header -->
      <div class="max-w-2xl">
        <div class="inline-flex items-center gap-2 rounded-sm border border-border bg-surface-raised px-3 py-1 font-mono text-xs font-semibold text-brand shadow-2xs">
          <span class="size-2 rounded-none bg-brand"></span>
          <span>WAY 2.1 EVIDENCE LAW · PROGRESSIVE DISCLOSURE</span>
        </div>
        <h2 class="mt-3 font-heading font-semibold text-2xl tracking-tight text-ink sm:text-3xl lg:text-4xl">
          Signal first, context second, sealed proof on demand.
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink-secondary sm:text-base">
          Learners complete focused 20-minute builds and calm concept checks while every rubric outcome remains inspectable underneath.
        </p>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        <!-- Interactive Progressive Evidence Stepper Rail (7 cols) -->
        <div class="lg:col-span-7">
          <div
            role="tablist"
            aria-label="How CREED OS Works Stages"
            class="space-y-4"
          >
            {#each howItWorksStages as stage, index (stage.id)}
              {@const isSelected = activeStageIndex === index}
              <button
                type="button"
                role="tab"
                id="stage-tab-{stage.id}"
                aria-controls="stage-panel-{stage.id}"
                aria-selected={isSelected}
                onclick={() => selectStage(index)}
                class="group relative flex w-full flex-col text-left rounded-sm p-4 sm:p-5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer {isSelected
                  ? `bg-surface-raised border border-border shadow-xs ${stage.id === 'calibrate' ? 'border-l-2 border-l-brand' : stage.id === 'inquire' ? 'border-l-2 border-l-ai' : 'border-l-2 border-l-positive'}`
                  : 'bg-surface/50 border border-border/60 hover:border-border hover:bg-surface-subtle'}"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2">
                    <span class="size-2 rounded-none {stage.dotClass}"></span>
                    <span class="font-mono text-xs font-semibold {stage.accentClass}">
                      {stage.stageLabel}
                    </span>
                  </div>
                  <span class="font-mono text-[10px] text-ink-muted border border-border/80 rounded-sm px-2 py-0.5 bg-surface">
                    {stage.metricBadge}
                  </span>
                </div>

                <h3 class="mt-2 text-base font-semibold text-ink group-hover:text-brand transition-colors">
                  {stage.title}
                </h3>

                <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
                  {stage.description}
                </p>

                <!-- Active Stage Diagnostic Metadata (Level 1 & Level 3 summary) -->
                {#if isSelected}
                  <div class="mt-3 pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                    <span class="text-ink-secondary">
                      Live Probe: <span class="text-ink font-medium">{stage.probe.level1Title}</span>
                    </span>
                    <span class="flex items-center gap-1 font-semibold {stage.accentClass}">
                      <span>Inspect 3D Probe &rarr;</span>
                    </span>
                  </div>
                {/if}
              </button>
            {/each}
          </div>
        </div>

        <!-- Architectural Proof Console & Level Inspector (5 cols) -->
        <div class="flex flex-col justify-between rounded-md border border-border bg-surface-raised p-5 sm:p-6 shadow-xs lg:col-span-5">
          <!-- Console Header with Navigation & Level Switcher -->
          <div class="border-b border-border pb-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-1.5">
                <span class="font-mono text-xs font-semibold text-ink">
                  Stage {currentStage.stepNumber} of 03
                </span>
                <div class="inline-flex items-center gap-0.5 ml-1">
                  <button
                    type="button"
                    aria-label="Previous evidence stage"
                    onclick={prevStage}
                    disabled={activeStageIndex === 0}
                    class="p-1 rounded-sm text-ink-secondary hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft class="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next evidence stage"
                    onclick={nextStage}
                    disabled={activeStageIndex === howItWorksStages.length - 1}
                    class="p-1 rounded-sm text-ink-secondary hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight class="size-3.5" />
                  </button>
                </div>
              </div>

              <!-- High-precision Level Segmented Switcher -->
              <div class="inline-flex items-center rounded-sm border border-border bg-surface p-0.5 font-mono text-[11px]">
                <button
                  type="button"
                  onclick={() => (activeLevel = 1)}
                  class="rounded-sm px-2 py-1 transition-colors cursor-pointer {activeLevel === 1
                    ? 'bg-brand text-brand-foreground font-semibold shadow-2xs'
                    : 'text-ink-secondary hover:text-ink'}"
                >
                  L1 Signal
                </button>
                <button
                  type="button"
                  onclick={() => (activeLevel = 2)}
                  class="rounded-sm px-2 py-1 transition-colors cursor-pointer {activeLevel === 2
                    ? 'bg-brand text-brand-foreground font-semibold shadow-2xs'
                    : 'text-ink-secondary hover:text-ink'}"
                >
                  L2 Context
                </button>
                <button
                  type="button"
                  onclick={() => (activeLevel = 3)}
                  class="rounded-sm px-2 py-1 transition-colors cursor-pointer {activeLevel === 3
                    ? 'bg-brand text-brand-foreground font-semibold shadow-2xs'
                    : 'text-ink-secondary hover:text-ink'}"
                >
                  L3 Proof
                </button>
              </div>
            </div>
          </div>

          <!-- Main Level Disclosure Surface -->
          <div class="my-4 min-h-[300px] rounded-sm border border-border bg-surface p-5 shadow-2xs flex flex-col justify-between">
            {#if activeLevel === 1}
              <!-- Level 1: Signal View -->
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 border-b border-border pb-2">
                  <span class="inline-block rounded-none px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider {currentStage.badgeBgClass}">
                    Level 1 · Active Signal
                  </span>
                  <span class="font-mono text-[10px] text-ink-muted truncate max-w-[170px]">
                    {currentStage.probe.domainTag}
                  </span>
                </div>

                <div>
                  <h4 class="text-base font-semibold tracking-tight text-ink">
                    {currentStage.probe.level1Title}
                  </h4>
                  <div class="mt-2 rounded-sm border-l-2 border-brand bg-surface-subtle p-3 text-xs leading-relaxed text-ink">
                    <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-brand block mb-1">
                      Learner Prompt
                    </span>
                    {currentStage.probe.level1Prompt}
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs font-mono text-ink-secondary pt-1">
                  <span class="text-[11px] text-ink-muted">Diagnostic Mode</span>
                  <span class="font-semibold text-brand">Adaptive Calibration Live</span>
                </div>
              </div>

              <!-- Level 1 Footer Action -->
              <div class="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span class="font-mono text-[10px] text-ink-muted">Why this matters</span>
                <button
                  type="button"
                  onclick={() => (activeLevel = 2)}
                  class="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-brand hover:text-brand-hover cursor-pointer"
                >
                  <span>Disclose Level 2 Context &rarr;</span>
                </button>
              </div>

            {:else if activeLevel === 2}
              <!-- Level 2: Context View -->
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 border-b border-border pb-2">
                  <span class="inline-block rounded-none px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-surface-subtle text-ink font-semibold border border-border">
                    Level 2 · Pedagogical Context
                  </span>
                  <span class="font-mono text-[10px] text-ink-muted truncate max-w-[170px]">
                    {currentStage.probe.domainTag}
                  </span>
                </div>

                <div>
                  <h4 class="text-base font-semibold tracking-tight text-ink">
                    {currentStage.probe.level1Title}
                  </h4>
                  <div class="mt-2 rounded-sm border border-border bg-surface-subtle p-3 text-xs leading-relaxed text-ink-secondary">
                    <span class="font-mono text-[10px] font-semibold uppercase tracking-wider text-ink-muted block mb-1">
                      Evidence Rationale
                    </span>
                    {currentStage.probe.level2Context}
                  </div>
                </div>

                <div class="rounded-sm border border-border/80 bg-surface-raised p-3 text-xs font-mono">
                  <div class="flex items-center justify-between text-ink-muted text-[10px]">
                    <span>DEVELOPMENTAL AIM:</span>
                    <span class="text-ink font-semibold">Mastery Calibration</span>
                  </div>
                  <p class="mt-1 text-[11px] font-sans text-ink-secondary">
                    Maps conceptual boundaries without speed penalties or rank anxiety.
                  </p>
                </div>
              </div>

              <!-- Level 2 Footer Action -->
              <div class="flex items-center justify-between border-t border-border pt-3 text-xs">
                <button
                  type="button"
                  onclick={() => (activeLevel = 1)}
                  class="font-mono text-[11px] text-ink-muted hover:text-ink cursor-pointer"
                >
                  &larr; Return to Signal
                </button>
                <button
                  type="button"
                  onclick={() => (activeLevel = 3)}
                  class="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-brand hover:text-brand-hover cursor-pointer"
                >
                  <span>Inspect Sealed Proof &rarr;</span>
                </button>
              </div>

            {:else}
              <!-- Level 3: Sealed Proof View -->
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-2 border-b border-border pb-2">
                  <span class="inline-block rounded-none px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider bg-brand/10 text-brand font-semibold">
                    Level 3 · Sealed Rubric &amp; Proof
                  </span>
                  <span class="font-mono text-[10px] text-positive flex items-center gap-1 font-semibold">
                    <ShieldCheck class="size-3.5" />
                    <span>Tamper-Evident</span>
                  </span>
                </div>

                <div>
                  <h4 class="text-base font-semibold tracking-tight text-ink">
                    {currentStage.probe.level3Claim}
                  </h4>
                  <p class="mt-2 text-xs leading-relaxed text-ink-secondary">
                    {currentStage.probe.level3Proof}
                  </p>
                </div>

                <!-- Cryptographic Ledger Readout with TextScramble -->
                <div class="rounded-sm border border-border/80 bg-surface-subtle p-3 font-mono text-[10px] space-y-1.5">
                  <div class="flex justify-between items-center text-ink-muted">
                    <span>PROVENANCE LEDGER:</span>
                    <span class="text-ink font-semibold">
                      <TextScramble text={currentStage.probe.provenanceHash} />
                    </span>
                  </div>
                  <div class="flex justify-between items-center text-ink-muted">
                    <span>RUBRIC CRITERIA:</span>
                    <span class="font-semibold text-positive">{currentStage.probe.rubricCount}</span>
                  </div>
                  <div class="flex justify-between items-center text-ink-muted border-t border-border pt-1">
                    <span>STATUTORY AUDIT:</span>
                    <span class="text-brand font-medium">DPDP Act 2023 Compliant</span>
                  </div>
                </div>
              </div>

              <!-- Level 3 Footer Action -->
              <div class="flex items-center justify-between border-t border-border pt-3 text-xs">
                <span class="font-mono text-[10px] text-positive font-medium flex items-center gap-1">
                  <Check class="size-3" />
                  <span>Verified by Educator</span>
                </span>
                <button
                  type="button"
                  onclick={() => (activeLevel = 1)}
                  class="font-mono text-[11px] text-ink-muted hover:text-ink cursor-pointer"
                >
                  &larr; Back to Signal
                </button>
              </div>
            {/if}
          </div>

          <!-- Bottom Information Architecture Indicator (WAY 2.1 Grammar) -->
          <div class="border-t border-border pt-3">
            <div class="flex items-center justify-between text-[11px] font-mono text-ink-secondary">
              <span class="text-ink-muted">Active Disclosure Tier:</span>
              <span class="font-semibold text-ink">
                {activeLevel === 1 ? '01 · Signal (Primary Action)' : activeLevel === 2 ? '02 · Context (Pedagogical Why)' : '03 · Evidence (Sealed Provenance)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
</section>

<!-- Section 4: Live Kokonut UI Capability Engines -->
<section id="capabilities" class="scroll-mt-20 border-b border-border bg-surface py-16 sm:py-20">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div class="max-w-2xl">
          <span class="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
            Interactive Telemetry
          </span>
          <h2 class="mt-2 font-heading font-semibold text-2xl tracking-tight text-ink sm:text-3xl">
            Calm intelligence for learners, families, and educators.
          </h2>
          <p class="mt-2 text-sm leading-relaxed text-ink-secondary">
            Explore live interactive instruments built natively in Svelte 5 with deterministic evidence tracking.
          </p>
        </div>
        <a
          href="/platform"
          class="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-sm border border-border bg-surface-raised px-4 py-2 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand/50 outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <span>Read Platform Architecture</span>
          <ArrowUpRight class="size-3.5 text-brand" />
        </a>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Card 1: MetricCard (Competency Evidence Signals) -->
        <div id="adaptive-assessment" class="scroll-mt-24 flex flex-col justify-between rounded-sm border border-border bg-surface-raised p-6">
          <MetricCard
            badge="DETERMINISTIC ENGINE"
            telemetry="Untimed Calibration"
            title="Verified Evidence Signals"
            description="Scrub any day or drag across a date window to inspect verified projects, concept checks, and reflections."
            class="border-0 p-0"
          />
        </div>

        <!-- Card 2: AIVoice + Socratic Dialogue Trace (High-Contrast Accessible) -->
        <div id="socratic-mentor" class="scroll-mt-24 flex flex-col justify-between gap-4 rounded-sm border border-border bg-surface-raised p-6">
          <div>
            <div class="flex items-center justify-between gap-2 border-b border-border pb-3">
              <span class="inline-flex items-center gap-1.5 rounded-sm border border-ai/30 bg-ai-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-ai">
                <span class="size-1.5 rounded-none bg-ai"></span>
                QUIET VOICE MENTOR
              </span>
              <span class="font-mono text-[11px] text-ink-muted">Guides · Never Gives Answers</span>
            </div>
            <h3 class="mt-3 text-base font-semibold tracking-tight text-ink">
              Socratic Voice Inquiry
            </h3>
            <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
              Real-time voice mentorship prompts learners to test assumptions aloud while safeguarding independent thinking.
            </p>
          </div>

          <AIVoice demo={true} />

          <!-- Compact Socratic Dialogue Preview (WAY 2.1 Level 2 Context) -->
          <div class="space-y-2 border-t border-border pt-3" aria-label="Sample Socratic inquiry exchange">
            <div class="rounded-sm border border-border bg-surface-subtle p-2">
              <p class="font-mono text-[10px] font-semibold text-ai">{socraticTurns[1].speaker}</p>
              <p class="mt-0.5 text-xs leading-relaxed text-ink">{socraticTurns[1].text}</p>
            </div>
            <div class="rounded-sm border border-border bg-surface-subtle p-2">
              <p class="font-mono text-[10px] font-semibold text-brand">{socraticTurns[2].speaker}</p>
              <p class="mt-0.5 text-xs leading-relaxed text-ink">{socraticTurns[2].text}</p>
            </div>
          </div>
        </div>

        <!-- Card 3: AppleActivityCard (Family Growth Rings) -->
        <div id="family-insights" class="scroll-mt-24 flex flex-col justify-between gap-4 rounded-sm border border-border bg-surface-raised p-6">
          <AppleActivityCard
            badge="ACTIVE RHYTHMS"
            title="Family Growth Insights"
            description="Concentric weekly habits replace rank tables with clear, low-anxiety progress across foundational skills, inquiry time, and builds."
          />

          <div class="flex flex-col justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <div class="flex items-center gap-3">
              <img
                src="/images/agenta/privacy_shield_asian-sm.jpg"
                alt="Student data protected by statutory parental consent"
                width="40"
                height="40"
                loading="lazy"
                decoding="async"
                class="size-10 shrink-0 rounded-sm border border-border object-cover"
              />
              <div>
                <p class="text-xs font-semibold text-ink">DPDP Act 2023 Family Controls</p>
                <p class="text-xs text-ink-secondary">Revocable guardian consent ledger and zero third-party ad tracking.</p>
              </div>
            </div>
            <a
              href="/families"
              class="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-sm border border-border bg-surface-subtle px-3 py-1.5 text-xs font-medium text-ink transition-colors duration-150 hover:border-brand/50 outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              <span>Family Guide</span>
              <ArrowRight class="size-3.5 text-brand" />
            </a>
          </div>
        </div>

        <!-- Card 4: ActivityTerrain (26-Week Practice & Portfolio Cadence) -->
        <div id="evidence-portfolio" class="scroll-mt-24 flex flex-col justify-between rounded-sm border border-border bg-surface-raised p-6">
          <ActivityTerrain
            title="26-Week Evidence Cadence"
            class="border-0"
          />
        </div>
      </div>
    </div>
</section>

<!-- Section 5: Role Perspectives & Institutional Access -->
<section id="roles" class="scroll-mt-20 border-b border-border bg-canvas py-16 sm:py-20">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <div class="max-w-2xl">
        <span class="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
          Role-Scoped Workspaces
        </span>
        <h2 class="mt-2 font-heading font-semibold text-2xl tracking-tight text-ink sm:text-3xl">
          Purpose-built surfaces for every participant in a child's growth.
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink-secondary">
          Warm, human-first guidance for students and parents; high-density diagnostic tables for teachers and school counselors.
        </p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <!-- Learner Card -->
        <div class="flex flex-col justify-between rounded-sm border border-border bg-surface-raised p-6">
          <div>
            <span class="font-mono text-xs font-semibold text-brand">WAY EXPERIENCE · LEARNER</span>
            <h3 class="mt-2 text-lg font-semibold text-ink">Students (Classes 3 to 12)</h3>
            <p class="mt-2 text-xs leading-relaxed text-ink-secondary">
              Focused 20-minute missions, interactive Rover IDE labs, and a supportive voice mentor without public leaderboards.
            </p>
            <ul class="mt-4 space-y-2 text-xs text-ink-secondary">
              <li class="flex items-center gap-2"><Check class="size-3.5 shrink-0 text-brand" /><span>Clear next-mission focus</span></li>
              <li class="flex items-center gap-2"><Check class="size-3.5 shrink-0 text-brand" /><span>Personal artifact portfolio</span></li>
            </ul>
          </div>
          <button
            type="button"
            onclick={() => openWorkspaceModal('learner', '8')}
            class="mt-6 inline-flex min-h-11 w-full items-center justify-between rounded-sm border border-border bg-surface-subtle px-4 py-2 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:bg-brand-subtle outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          >
            <span>Preview Learner View</span>
            <ArrowRight class="size-4 text-brand" />
          </button>
        </div>

        <!-- Family Card -->
        <div class="flex flex-col justify-between rounded-sm border border-border bg-surface-raised p-6">
          <div>
            <span class="font-mono text-xs font-semibold text-brand">WAY EXPERIENCE · GUARDIAN</span>
            <h3 class="mt-2 text-lg font-semibold text-ink">Parents &amp; Families</h3>
            <p class="mt-2 text-xs leading-relaxed text-ink-secondary">
              Plain-language growth summaries, conversation starters for home, and granular DPDP consent controls.
            </p>
            <ul class="mt-4 space-y-2 text-xs text-ink-secondary">
              <li class="flex items-center gap-2"><Check class="size-3.5 shrink-0 text-brand" /><span>Zero psychometric jargon leaks</span></li>
              <li class="flex items-center gap-2"><Check class="size-3.5 shrink-0 text-brand" /><span>Instant consent audit ledger</span></li>
            </ul>
          </div>
          <button
            type="button"
            onclick={() => openWorkspaceModal('family', '8')}
            class="mt-6 inline-flex min-h-11 w-full items-center justify-between rounded-sm border border-border bg-surface-subtle px-4 py-2 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:bg-brand-subtle outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          >
            <span>Preview Family View</span>
            <ArrowRight class="size-4 text-brand" />
          </button>
        </div>

        <!-- Educator Card -->
        <div class="flex flex-col justify-between rounded-sm border border-border bg-surface-raised p-6">
          <div>
            <span class="font-mono text-xs font-semibold text-ai">WAY CONSOLE · EDUCATOR</span>
            <h3 class="mt-2 text-lg font-semibold text-ink">Schools &amp; Counselors</h3>
            <p class="mt-2 text-xs leading-relaxed text-ink-secondary">
              Cohort competency matrices, NEP / NCF curriculum mapping, and early foundational support signals.
            </p>
            <ul class="mt-4 space-y-2 text-xs text-ink-secondary">
              <li class="flex items-center gap-2"><Check class="size-3.5 shrink-0 text-ai" /><span>Cohort mastery heatmaps</span></li>
              <li class="flex items-center gap-2"><Check class="size-3.5 shrink-0 text-ai" /><span>NEP 2020 holistic progress cards</span></li>
            </ul>
          </div>
          <button
            type="button"
            onclick={() => openWorkspaceModal('school', '8')}
            class="mt-6 inline-flex min-h-11 w-full items-center justify-between rounded-sm border border-border bg-surface-subtle px-4 py-2 text-xs font-semibold text-ink transition-colors duration-150 hover:border-brand hover:bg-brand-subtle outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          >
            <span>Preview School View</span>
            <ArrowRight class="size-4 text-brand" />
          </button>
        </div>
      </div>

      <!-- Transparent Access Strip -->
      <div id="pathway-navigator" class="mt-6 flex flex-col justify-between gap-4 rounded-sm border border-border bg-surface p-6 sm:flex-row sm:items-center">
        <div>
          <h3 class="text-sm font-semibold text-ink">Transparent Family &amp; Institutional Licensing</h3>
          <p class="mt-1 text-xs text-ink-secondary">
            Explore individual family memberships or multi-cohort school deployments with dedicated teacher onboarding.
          </p>
        </div>
        <div class="flex shrink-0 flex-wrap items-center gap-3">
          <a
            href="/pricing"
            class="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-brand px-4 py-2 text-xs font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <span>Compare Plans</span>
            <ArrowRight class="size-3.5" />
          </a>
          <button
            type="button"
            onclick={() => openWorkspaceModal('studio', '9')}
            class="inline-flex min-h-11 items-center gap-1.5 rounded-sm border border-border bg-surface-raised px-4 py-2 text-xs font-medium text-ink transition-colors duration-150 hover:bg-surface-subtle outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
          >
            <span>Inspect Item Studio</span>
          </button>
        </div>
      </div>
    </div>
</section>

<!-- Section 6: Governance & Methodology FAQ -->
<section id="faq" class="scroll-mt-20 border-b border-border bg-surface py-16 sm:py-20">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <div>
      <span class="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
        Methodology &amp; Safety
      </span>
      <h2 class="mt-2 font-heading font-semibold text-2xl tracking-tight text-ink sm:text-3xl">
        Questions families and school leaders ask first.
      </h2>
    </div>

    <div class="mt-8 space-y-3">
      {#each faqList as faq, i (faq.id)}
        <div class="rounded-sm border border-border bg-surface-raised">
          <button
            type="button"
            aria-expanded={faq.open}
            aria-controls={`faq-panel-${faq.id}`}
            onclick={() => toggleFaq(i)}
            class="flex min-h-12 w-full items-center justify-between gap-4 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer sm:p-5"
          >
            <div class="flex items-baseline gap-3">
              <span class="font-mono text-xs font-semibold text-brand">{faq.id}</span>
              <span class="text-sm font-semibold text-ink sm:text-base">{faq.q}</span>
            </div>
            <span class="flex size-7 shrink-0 items-center justify-center rounded-sm bg-surface-subtle text-ink-secondary">
              {#if faq.open}
                <Minus class="size-4" />
              {:else}
                <Plus class="size-4" />
              {/if}
            </span>
          </button>

          {#if faq.open}
            <div id={`faq-panel-${faq.id}`} class="border-t border-border px-4 pt-3 pb-5 sm:px-5">
              <p class="pl-7 text-sm leading-relaxed text-ink-secondary">
                {faq.a}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Section 7: Direct Human Contact & Monthly Research Dispatch -->
<section id="contact" class="scroll-mt-20 bg-canvas pt-16 pb-4 sm:pt-20">
  <div class="mx-auto max-w-5xl px-4 sm:px-6">
    <div class="max-w-2xl">
        <span class="font-mono text-xs font-semibold uppercase tracking-wider text-brand">
          Direct Governance &amp; Support
        </span>
        <h2 class="mt-2 font-heading font-semibold text-2xl tracking-tight text-ink sm:text-3xl">
          Reach the CREED OS team directly.
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-ink-secondary">
          School partnerships, guardian questions, and statutory DPDP data requests are answered by dedicated specialists rather than automated bots.
        </p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="flex flex-col justify-between gap-4 rounded-sm border border-border bg-surface-raised p-5">
          <div>
            <div class="flex size-9 items-center justify-center rounded-sm bg-brand-subtle text-brand">
              <Building2 class="size-4" />
            </div>
            <h3 class="mt-3 text-sm font-semibold text-ink">Schools &amp; Districts</h3>
            <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
              Curriculum alignment, cohort pilots, and educator onboarding for Classes 3 to 12.
            </p>
          </div>
          <a
            href="mailto:schools@creed-os.app"
            class="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-ink transition-colors duration-150 hover:border-brand/50 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Mail class="size-3.5 text-brand" />
            <span>schools@creed-os.app</span>
          </a>
        </div>

        <div class="flex flex-col justify-between gap-4 rounded-sm border border-border bg-surface-raised p-5">
          <div>
            <div class="flex size-9 items-center justify-center rounded-sm bg-brand-subtle text-brand">
              <MessageSquareText class="size-4" />
            </div>
            <h3 class="mt-3 text-sm font-semibold text-ink">Families &amp; Guardians</h3>
            <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
              Guidance on consent verification, learner profiles, and home inquiry routines.
            </p>
          </div>
          <a
            href="mailto:support@creed-os.app"
            class="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-ink transition-colors duration-150 hover:border-brand/50 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Mail class="size-3.5 text-brand" />
            <span>support@creed-os.app</span>
          </a>
        </div>

        <div class="flex flex-col justify-between gap-4 rounded-sm border border-border bg-surface-raised p-5">
          <div>
            <div class="flex size-9 items-center justify-center rounded-sm bg-brand-subtle text-brand">
              <ShieldCheck class="size-4" />
            </div>
            <h3 class="mt-3 text-sm font-semibold text-ink">Data Protection Officer</h3>
            <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
              DPDP Act 2023 consent withdrawal, data export, and statutory grievance redressal.
            </p>
          </div>
          <a
            href="mailto:dpo@creed-os.app"
            class="inline-flex min-h-10 items-center gap-2 rounded-sm border border-border bg-surface-subtle px-3 py-2 text-xs font-medium text-ink transition-colors duration-150 hover:border-brand/50 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Mail class="size-3.5 text-brand" />
            <span>dpo@creed-os.app</span>
          </a>
        </div>
      </div>

      <!-- Accessible Monthly Research Dispatch Form (Fixes Dead Form P0) -->
      <div class="mt-8 rounded-sm border border-border bg-surface p-6">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-center">
          <div class="md:col-span-6">
            <h3 class="text-base font-semibold text-ink">Monthly Learner Intelligence Dispatch</h3>
            <p class="mt-1 text-xs leading-relaxed text-ink-secondary">
              Receive new Class 3 to 12 maker rubrics, open assessment whitepapers, and DPDP child-safety updates once a month.
            </p>
          </div>

          <div class="md:col-span-6">
            {#if dispatchConfirmed}
              <div
                role="status"
                class="flex items-center justify-between gap-3 rounded-sm border border-brand/30 bg-brand-subtle px-4 py-3 text-xs text-ink"
              >
                <div class="flex items-center gap-2">
                  <Check class="size-4 shrink-0 text-brand" />
                  <span>
                    Registered <strong class="font-semibold">{dispatchEmail}</strong> for the monthly research dispatch.
                  </span>
                </div>
                <button
                  type="button"
                  onclick={() => {
                    dispatchConfirmed = false;
                    dispatchStatus = 'idle';
                    dispatchEmail = '';
                  }}
                  class="shrink-0 rounded-sm px-2 py-1 font-mono text-[11px] text-brand underline outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
                >
                  Change
                </button>
              </div>
            {:else}
              <form class="space-y-2" onsubmit={submitDispatch} novalidate>
                <label for="dispatch-email" class="block font-mono text-xs font-medium text-ink-secondary">
                  School or Guardian Email
                </label>
                <div class="flex flex-col gap-2 sm:flex-row">
                  <input
                    id="dispatch-email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    bind:value={dispatchEmail}
                    placeholder="educator@school.edu.in"
                    aria-invalid={dispatchError ? 'true' : undefined}
                    aria-describedby={dispatchError ? 'dispatch-error' : undefined}
                    required
                    class="min-h-11 flex-1 rounded-sm border border-border bg-surface-raised px-3 text-sm text-ink placeholder:text-ink-muted outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  />
                  <ParticleButton
                    type="submit"
                    status={dispatchStatus}
                    pendingLabel="Recording..."
                    successLabel="Subscribed"
                    errorLabel="Check email"
                    class="min-h-11 px-5 bg-brand text-brand-foreground hover:bg-brand-hover font-semibold text-xs"
                  >
                    Subscribe
                  </ParticleButton>
                </div>
                {#if dispatchError}
                  <p id="dispatch-error" role="alert" class="text-xs font-medium text-critical">
                    {dispatchError}
                  </p>
                {/if}
              </form>
            {/if}
          </div>
        </div>
      </div>
    </div>
</section>

<!-- Interactive Workspace & Class 3-12 Curriculum Preview Modal -->
<Dialog.Root bind:open={isModalOpen}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200" />
    <Dialog.Content
      class="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-32px)] w-[min(640px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-sm border border-border bg-surface-raised p-6 text-ink shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <div class="flex items-start justify-between gap-4">
        <div>
          <span class="block font-mono text-xs font-semibold uppercase tracking-wider text-brand">
            Workspace &amp; Curriculum Preview
          </span>
          <Dialog.Title class="mt-1 font-heading text-xl font-semibold tracking-tight text-ink">
            Choose a role and grade perspective
          </Dialog.Title>
        </div>
        <Dialog.Close
          aria-label="Close workspace preview dialog"
          class="inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm border border-transparent text-ink-muted transition-colors duration-150 hover:border-border hover:bg-surface-subtle hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
        >
          <X class="size-4" />
        </Dialog.Close>
      </div>

      <Dialog.Description class="mt-2 text-xs leading-relaxed text-ink-secondary">
        Inspect how developmental missions, guardian summaries, and educator diagnostics adapt across Classes 3 to 12.
      </Dialog.Description>

      <div class="mt-5 space-y-3">
        <!-- Role Tabs (44px touch targets) -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {#each [
            ['learner', 'Learner'],
            ['family', 'Family'],
            ['school', 'Educator'],
            ['studio', 'Item Studio']
          ] as [roleKey, roleLabel]}
            <button
              type="button"
              onclick={() => (selectedRole = roleKey as WorkspaceRole)}
              class="min-h-11 rounded-sm border px-3 text-xs font-semibold transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer {selectedRole === roleKey
                ? 'border-brand bg-brand text-brand-foreground'
                : 'border-border bg-surface-subtle text-ink-secondary hover:text-ink'}"
            >
              {roleLabel}
            </button>
          {/each}
        </div>

        <!-- Class 3 to 12 Selector -->
        <div class="flex flex-col justify-between gap-3 rounded-sm border border-border bg-surface-subtle p-3 sm:flex-row sm:items-center">
          <div class="flex items-center gap-2">
            <label for="class-select" class="shrink-0 font-mono text-xs font-medium uppercase tracking-wider text-ink-secondary">
              Curriculum Grade:
            </label>
            <div class="relative">
              <select
                id="class-select"
                bind:value={selectedClass}
                class="min-h-11 appearance-none rounded-sm border border-border bg-surface-raised pl-3 pr-8 text-xs font-semibold text-ink outline-none focus-visible:ring-2 focus-visible:ring-brand cursor-pointer"
              >
                <optgroup label="Tier I: Foundational Discovery (Classes 3 to 5)">
                  <option value="3">Class 3 · Ages 8 to 9</option>
                  <option value="4">Class 4 · Ages 9 to 10</option>
                  <option value="5">Class 5 · Ages 10 to 11</option>
                </optgroup>
                <optgroup label="Tier II: Exploratory Core (Classes 6 to 8)">
                  <option value="6">Class 6 · Ages 11 to 12</option>
                  <option value="7">Class 7 · Ages 12 to 13</option>
                  <option value="8">Class 8 · Ages 13 to 14</option>
                </optgroup>
                <optgroup label="Tier III: Secondary Core (Classes 9 to 10)">
                  <option value="9">Class 9 · Ages 14 to 15</option>
                  <option value="10">Class 10 · Ages 15 to 16</option>
                </optgroup>
                <optgroup label="Tier IV: Senior Pathways (Classes 11 to 12)">
                  <option value="11">Class 11 · Ages 16 to 17</option>
                  <option value="12">Class 12 · Ages 17 to 18</option>
                </optgroup>
              </select>
              <ChevronDown class="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-ink-muted" />
            </div>
          </div>

          <span class="font-mono text-xs font-semibold text-brand">
            {currentCurriculum.tierName}
          </span>
        </div>
      </div>

      <!-- Dynamic Curriculum & Role Preview Surface -->
      <div class="mt-4 space-y-3 rounded-sm border border-border bg-surface p-4">
        <div class="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <span class="block font-mono text-xs font-semibold uppercase tracking-wider text-brand">
              {#if selectedRole === 'learner'}
                LEARNER WORKSPACE · CLASS {selectedClass} ({currentCurriculum.ageBracket})
              {:else if selectedRole === 'family'}
                GUARDIAN SUMMARY · CLASS {selectedClass} ({currentCurriculum.ageBracket})
              {:else if selectedRole === 'school'}
                EDUCATOR COHORT CONSOLE · CLASS {selectedClass}
              {:else}
                ITEM AUTHORING STUDIO · CLASS {selectedClass}
              {/if}
            </span>
            <p class="mt-0.5 text-xs text-ink-secondary">
              {#if selectedRole === 'learner'}
                Active hands-on focus: {currentCurriculum.focusArea}
              {:else if selectedRole === 'family'}
                Plain-language guardian view for {currentCurriculum.focusArea}
              {:else if selectedRole === 'school'}
                Curriculum-aligned cohort diagnostics for {currentCurriculum.focusArea}
              {:else}
                Structured rubric and adaptive item authoring console
              {/if}
            </p>
          </div>

          <span class="inline-flex items-center gap-1.5 self-start rounded-sm border border-brand/30 bg-brand-subtle px-2 py-0.5 font-mono text-[11px] font-medium text-brand sm:self-auto">
            <span class="size-1.5 rounded-none bg-brand"></span>
            Active Term Mission
          </span>
        </div>

        <div class="space-y-3 rounded-sm border border-border bg-surface-raised p-4">
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-sm font-semibold text-ink">
              {#if selectedRole === 'learner'}
                {currentCurriculum.missionTitle}
              {:else if selectedRole === 'family'}
                Growth Summary · {currentCurriculum.focusArea}
              {:else if selectedRole === 'school'}
                Class {selectedClass} Cohort Matrix · {currentCurriculum.focusArea}
              {:else}
                Rubric Bank #C{selectedClass} · {currentCurriculum.focusArea}
              {/if}
            </h4>
            <span class="shrink-0 font-mono text-xs text-ink-muted">Class {selectedClass}</span>
          </div>

          <p class="text-xs leading-relaxed text-ink-secondary">
            {#if selectedRole === 'learner'}
              {currentCurriculum.missionDescription}
            {:else if selectedRole === 'family'}
              Steady confidence observed in {currentCurriculum.focusArea}, backed by completed build milestones and guided voice reflections without high-stakes test pressure.
            {:else if selectedRole === 'school'}
              Strong cohort foundation across {currentCurriculum.focusArea} standards, with targeted small-group practice recommended for two foundational sub-skills.
            {:else}
              Authoring structured multi-step items and deterministic scoring rubrics for {currentCurriculum.focusArea}.
            {/if}
          </p>

          <div class="flex flex-wrap items-center gap-2 pt-1">
            {#each currentCurriculum.competencyPillars as pillar}
              <span class="rounded-none border border-border bg-surface-subtle px-2 py-0.5 font-mono text-[11px] text-ink">
                {pillar}
              </span>
            {/each}
          </div>

          <div class="flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-ink-muted">
            <span class="flex items-center gap-1.5">
              <ShieldCheck class="size-3.5 text-brand" />
              <span>{currentCurriculum.consentStatus}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="mt-6 flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
        <span class="font-mono text-xs text-ink-muted">
          Selected: <strong class="font-semibold uppercase text-ink">{selectedRole}</strong> · Class {selectedClass}
        </span>

        <div class="flex w-full items-center gap-3 sm:w-auto">
          <Dialog.Close
            class="inline-flex min-h-11 flex-1 items-center justify-center rounded-sm border border-border bg-surface-subtle px-4 text-xs font-medium text-ink transition-colors duration-150 hover:bg-surface outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex-initial cursor-pointer"
          >
            Close
          </Dialog.Close>

          <button
            type="button"
            onclick={() => handleEnterWorkspace(selectedRole)}
            class="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-sm bg-brand px-5 text-xs font-semibold text-brand-foreground transition-colors duration-150 hover:bg-brand-hover outline-none focus-visible:ring-2 focus-visible:ring-brand sm:flex-initial cursor-pointer"
          >
            <span>Enter Workspace</span>
            <ArrowRight class="size-3.5" />
          </button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
