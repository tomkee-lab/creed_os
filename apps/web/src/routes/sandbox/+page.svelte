<script lang="ts">
  import { onMount } from 'svelte';
  import {
    TerminalSquare,
    Bot,
    Compass,
    Sparkles,
    Cpu,
    Activity,
    Layers,
    Code2,
    Sliders,
    TrendingUp,
    Brain,
    HelpCircle,
    Sun,
    Moon,
    ArrowRight,
    ExternalLink,
    Trophy,
    Maximize2,
    Globe
  } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';
  import BrowserIDE from '$lib/components/ide/BrowserIDE.svelte';
  import ConstructiveMismatchCalculator from '$lib/components/pathway/ConstructiveMismatchCalculator.svelte';
  import SocraticVoiceMentor from '$lib/components/mentor/SocraticVoiceMentor.svelte';
  import AdaptiveDiagnosticRunner from '$lib/components/assessment/AdaptiveDiagnosticRunner.svelte';
  import GlobalSTEMBenchmarking from '$lib/components/assessment/GlobalSTEMBenchmarking.svelte';
  import OpenSourceComplianceModal from '$lib/components/compliance/OpenSourceComplianceModal.svelte';
  import ThreeLaunchpad from '$lib/components/telemetry/ThreeLaunchpad.svelte';
  import LivePortalsModal from '$lib/components/telemetry/LivePortalsModal.svelte';
  import {
    SBOM_DEPENDENCIES,
    CLEAN_ROOM_STATUS,
    type DependencyLicenseRecord
  } from '$lib/compliance/licenses';
  import { calculateProbability3PL, calculateFisherInformation } from '@core-os/assessment';
  import {
    Scale,
    ShieldCheck,
    CheckCircle2,
    Search,
    AlertCircle,
    FileText
  } from 'lucide-svelte';

  // Active Sandbox Section
  let activeSection = $state<'mesh' | 'ide' | 'mentor' | 'pathways' | 'psychometrics' | 'benchmarks' | 'compliance'>('mesh');
  let isComplianceModalOpen = $state(false);
  let isMeshModalOpen = $state(false);

  // License & Compliance Explorer State
  let sbomSearch = $state('');
  let sbomFilter = $state('all');
  let filteredSbom = $derived(
    SBOM_DEPENDENCIES.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(sbomSearch.toLowerCase()) ||
        item.role.toLowerCase().includes(sbomSearch.toLowerCase()) ||
        item.author.toLowerCase().includes(sbomSearch.toLowerCase());
      const matchesLicense = sbomFilter === 'all' || item.license === sbomFilter;
      return matchesSearch && matchesLicense;
    })
  );

  // IDE Stage & Fullscreen State
  let ideStage = $state<'primary' | 'middle' | 'secondary'>('primary');
  let isIdeFullscreen = $state(false);

  // Theme Management (Synced with Landing Page WAY 2.1 Tokens)
  let isDarkMode = $state(true);

  onMount(() => {
    const saved = localStorage.getItem('way_theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      isDarkMode = false;
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      isDarkMode = true;
    }
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('way_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('way_theme', 'light');
    }
  }

  // Psychometrics CAT Theoretical Simulator State
  let simTheta = $state(0.0);
  let itemA = $state(1.4); // Discrimination
  let itemB = $state(0.2); // Difficulty
  let itemC = $state(0.25); // Guessing

  let itemProbability = $derived(
    Math.round(calculateProbability3PL(simTheta, { a: itemA, b: itemB, c: itemC }) * 1000) / 1000
  );

  let fisherInfo = $derived(
    Math.round(calculateFisherInformation(simTheta, { a: itemA, b: itemB, c: itemC }) * 1000) / 1000
  );
</script>

<svelte:head>
  <title>Production Feature Sandbox — CREED OS</title>
  <meta name="description" content="End-to-end verification harness for K-12 Robotics IDE, Affective Socratic Mentor, SBB Pathway Engine, and 3PL IRT CAT." />
</svelte:head>

<div class="min-h-screen flex flex-col bg-canvas text-ink font-sans pb-24 selection:bg-brand-subtle selection:text-brand">
  <!-- ============================================================
       TOP NAVIGATION BAR (Editorial Shell Aligned with Landing Page)
       Strict 64px (h-16), max-w-6xl container, generous margins
       ============================================================ -->
  <header class="sticky top-0 z-30 w-full border-b border-border/80 bg-surface/90 backdrop-blur-md shadow-xs">
    <div class="max-w-6xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      <!-- Left: Logo & Brand Identity -->
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2 group">
          <div class="w-8 h-8 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shadow-xs">
            <CreedLogo size={20} class="transition-transform group-hover:scale-105" />
          </div>
          <div class="flex flex-col">
            <span class="font-heading font-semibold text-sm tracking-tight text-ink">
              CREED OS
            </span>
            <span class="text-[9px] uppercase tracking-widest text-ink-muted font-mono">
              Feature Sandbox
            </span>
          </div>
        </a>

        <div class="h-4 w-px bg-border hidden sm:block"></div>

        <span class="text-[10px] font-mono px-2 py-0.5 bg-surface-subtle border border-border text-ink-muted hidden md:inline-block">
          v2.1 Architecture
        </span>
      </div>

      <!-- Center: Segmented Navigation Pills (Balanced Scale) -->
      <nav
        class="hidden sm:flex items-center p-1 rounded-none border border-border/80 bg-surface-subtle/60 backdrop-blur-xs"
        aria-label="Sandbox Sections"
      >
        <button
          onclick={() => (activeSection = 'mesh')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'mesh'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <Globe class="size-3.5 text-cyan" />
          <span>0. 3D Mesh</span>
        </button>

        <button
          onclick={() => (activeSection = 'ide')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'ide'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <TerminalSquare class="size-3.5" />
          <span>1. Robotics IDE</span>
        </button>

        <button
          onclick={() => (activeSection = 'mentor')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'mentor'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <Bot class="size-3.5" />
          <span>2. Socratic Mentor</span>
        </button>

        <button
          onclick={() => (activeSection = 'pathways')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'pathways'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <Compass class="size-3.5" />
          <span>3. SBB Pathway</span>
        </button>

        <button
          onclick={() => (activeSection = 'psychometrics')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'psychometrics'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <TrendingUp class="size-3.5" />
          <span>4. CAT Diagnostics</span>
        </button>

        <button
          onclick={() => (activeSection = 'benchmarks')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'benchmarks'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <Trophy class="size-3.5" />
          <span>5. Global Benchmarks</span>
        </button>

        <button
          onclick={() => (activeSection = 'compliance')}
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro {activeSection === 'compliance'
            ? 'bg-surface-raised border border-border text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <Scale class="size-3.5" />
          <span>6. Architecture & Licenses</span>
        </button>

        <a
          href="/sandbox/globe"
          class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono transition-micro text-ink-secondary hover:text-ink hover:bg-surface-raised border border-transparent hover:border-border"
        >
          <Globe class="size-3.5 text-brand" />
          <span>7. Planetary Studio ↗</span>
        </a>
      </nav>

      <!-- Right: Action & Theme Controls -->
      <div class="flex items-center gap-2">
        <!-- Theme Toggle -->
        <button
          onclick={toggleTheme}
          class="p-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle cursor-pointer border border-transparent hover:border-border transition-all"
          title={isDarkMode ? 'Switch to Mineral White (Light)' : 'Switch to Deep Slate (Dark)'}
          aria-label="Toggle theme"
        >
          {#if isDarkMode}
            <Sun class="size-4 text-attention" />
          {:else}
            <Moon class="size-4" />
          {/if}
        </button>

        <!-- 3D Mesh Modal Quick Trigger -->
        <button
          onclick={() => (isMeshModalOpen = true)}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-border bg-surface hover:bg-surface-subtle text-xs font-mono text-cyan transition-micro shadow-2xs cursor-pointer"
          title="Open interactive 3D Three.js Telemetry Mesh & Live Portals"
        >
          <Sparkles class="size-3.5" />
          <span>3D Mesh</span>
        </button>

        <!-- Quick Compliance Modal Trigger -->
        <button
          onclick={() => (isComplianceModalOpen = true)}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-border bg-surface hover:bg-surface-subtle text-xs font-mono text-mint transition-micro shadow-2xs cursor-pointer"
          title="Inspect Open Source Software Bill of Materials (SBOM) and License Notices"
        >
          <ShieldCheck class="size-3.5" />
          <span>Licenses</span>
        </button>

        <!-- Return to Landing Portal -->
        <a
          href="/"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none border border-border bg-surface hover:bg-surface-subtle text-xs font-medium text-ink transition-micro shadow-2xs"
        >
          <span>Portal</span>
          <ArrowRight class="size-3 text-ink-muted" />
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Bar (Horizontal Scroll for small viewports) -->
    <div class="sm:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-border/60 bg-surface-subtle/40 gap-1">
      <button
        onclick={() => (activeSection = 'mesh')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'mesh'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        0. 3D Mesh
      </button>
      <button
        onclick={() => (activeSection = 'ide')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'ide'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        1. Robotics
      </button>
      <button
        onclick={() => (activeSection = 'mentor')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'mentor'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        2. Mentor
      </button>
      <button
        onclick={() => (activeSection = 'pathways')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'pathways'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        3. SBB
      </button>
      <button
        onclick={() => (activeSection = 'psychometrics')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'psychometrics'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        4. CAT
      </button>
      <button
        onclick={() => (activeSection = 'benchmarks')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'benchmarks'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        5. Benchmarks
      </button>
      <button
        onclick={() => (activeSection = 'compliance')}
        class="px-3 py-1 text-[11px] font-mono whitespace-nowrap border transition-micro {activeSection === 'compliance'
          ? 'bg-brand text-brand-foreground font-bold border-brand'
          : 'border-border text-ink-muted'}"
      >
        6. Licenses
      </button>
    </div>
  </header>

  <!-- ============================================================
       MAIN CONTENT CONTAINER (Comfortable Measure, No Edge Crowding)
       Constrained to max-w-5xl (or max-w-6xl for IDE)
       ============================================================ -->
  <main class="w-full flex-1">
    {#if activeSection === 'mesh'}
      <!-- ==========================================
           SECTION 0: 3D THREE.JS TELEMETRY LAUNCHPAD
           Full-width 3D spatial navigation & telemetry
           ========================================== -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-cyan animate-pulse"></span>
            <span class="tracking-wide">00 · THREE.JS SPATIAL INTELLIGENCE & TELEMETRY MESH</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
                Interactive 3D Mission Launchpad
              </h1>
              <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
                Hardware-accelerated Three.js WebGL telemetry mesh connecting Planetary Studio, Feature Sandbox, and Robotics IDE with live SGP4 orbital kinematics.
              </p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <a
                href="/sandbox/globe"
                class="flex items-center gap-2 px-3.5 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground font-mono text-xs font-bold transition-micro shadow-xs"
              >
                <Globe class="size-3.5" />
                <span>Full Cesium Globe ↗</span>
              </a>
            </div>
          </div>
        </div>

        <!-- 3D Three.js Launchpad Frame -->
        <ThreeLaunchpad />

        <!-- Architectural Highlights (3 Columns) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <span class="font-mono text-cyan font-bold uppercase text-[10px]">Three.js WebGL Scene Graph</span>
            <p class="text-ink-secondary leading-relaxed text-[11px]">
              Geodesic wireframe Icosahedron with 180 constellation star points and real-time mouse parallax tilt damping.
            </p>
          </div>
          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <span class="font-mono text-mint font-bold uppercase text-[10px]">Keplerian Orbit Physics</span>
            <p class="text-ink-secondary leading-relaxed text-[11px]">
              Deterministic parametric orbits (LEO 51.6°, MEO 28.5°, Polar 98.2°) with real-time sinusoidal beacon pulses.
            </p>
          </div>
          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <span class="font-mono text-yellow font-bold uppercase text-[10px]">Lagom Motion Contract</span>
            <p class="text-ink-secondary leading-relaxed text-[11px]">
              Smooth GSAP camera transitions (240ms) and frame-rate adaptive lerping strictly adhering to WAY 2.1 motion rules.
            </p>
          </div>
        </div>
      </div>

    {:else if activeSection === 'ide'}
      <!-- ==========================================
           SECTION 1: BROWSER ROBOTICS IDE
           Max-w-6xl for comfortable dual-pane code space
           ========================================== -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span class="tracking-wide">01 · K-12 ROBOTICS DEVELOPMENT ENVIRONMENT</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
                Visual Blocks & Hardware Runtime
              </h1>
              <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
                Adaptive progression from Primary (visual blocks) to Middle (dual-pane live Python translation) to Secondary (Monaco + Pyodide).
              </p>
            </div>

            <!-- Action: Launch Fullscreen Studio -->
            <button
              onclick={() => (isIdeFullscreen = true)}
              class="flex items-center gap-2 px-3.5 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground font-mono text-xs font-bold transition-micro shadow-xs shrink-0 self-start sm:self-auto"
              title="Expand the entire Robotics IDE to an immersive full-screen studio"
            >
              <Maximize2 class="size-3.5" />
              <span>Launch Fullscreen Studio ↗</span>
            </button>
          </div>
        </div>

        <!-- IDE Workbench Frame -->
        <div class="rounded-none shadow-sm overflow-hidden border border-border">
          <BrowserIDE bind:stage={ideStage} bind:isFullscreen={isIdeFullscreen} />
        </div>

        <!-- Architectural Highlights (3 Columns) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <span class="font-mono text-brand font-bold uppercase text-[10px]">Client-Side Pyodide Sandbox</span>
            <p class="text-ink-secondary leading-relaxed text-[11px]">
              Python compiles and executes inside an isolated WebAssembly Web Worker with full robotics telemetry.
            </p>
          </div>
          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <span class="font-mono text-mint font-bold uppercase text-[10px]">Hardware Flashing APIs</span>
            <p class="text-ink-secondary leading-relaxed text-[11px]">
              Web Serial API for ESP32 microcontrollers and WebUSB API via dapjs for BBC micro:bit devices.
            </p>
          </div>
          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <span class="font-mono text-cyan font-bold uppercase text-[10px]">Bidirectional Translation</span>
            <p class="text-ink-secondary leading-relaxed text-[11px]">
              Middle stage dynamically maps Blockly AST to clean Python syntax with live listener hooks.
            </p>
          </div>
        </div>
      </div>

    {:else if activeSection === 'mentor'}
      <!-- ==========================================
           SECTION 2: SOCRATIC VOICE MENTOR
           Max-w-4xl for comfortable dialogue measure
           ========================================== -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span class="tracking-wide">02 · AFFECTIVE SOCRATIC INQUIRY</span>
          </div>

          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
              Socratic Voice Mentor Studio
            </h1>
            <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Verify AI-guided inquiry, speech recognition, affective engagement rhythms, and child-safe ephemeral voice interaction.
            </p>
          </div>
        </div>

        <div class="w-full shadow-xs">
          <SocraticVoiceMentor initialTopic="Robotics & Mechanical Kinematics" />
        </div>
      </div>

    {:else if activeSection === 'pathways'}
      <!-- ==========================================
           SECTION 3: SBB CONSTRUCTIVE MISMATCH
           Max-w-5xl for clean 2-column cards
           ========================================== -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span class="tracking-wide">03 · FULL SBB & CONSTRUCTIVE MISMATCH</span>
          </div>

          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
              Singapore SBB & Pathway Navigation
            </h1>
            <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Model MOE Full SBB G1/G2/G3 bands, ZPD logits delta, and post-secondary qualification cutoffs (L1R5, ELR2B2, ELMAB3).
            </p>
          </div>
        </div>

        <div class="w-full shadow-xs">
          <ConstructiveMismatchCalculator />
        </div>
      </div>

    {:else if activeSection === 'psychometrics'}
      <!-- ==========================================
           SECTION 4: CAT PSYCHOMETRICS
           Max-w-4xl for optimal reading measure
           ========================================== -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span class="tracking-wide">04 · COMPUTERIZED ADAPTIVE TESTING</span>
          </div>

          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
              Deterministic 3PL IRT Diagnostics
            </h1>
            <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
              Interactive 6-item benchmark diagnostic runner and theoretical 3-parameter logistic mathematical simulator.
            </p>
          </div>
        </div>

        <!-- Interactive Benchmark Diagnostic Runner (Comfortable Width) -->
        <div class="w-full shadow-xs">
          <AdaptiveDiagnosticRunner />
        </div>

        <!-- Theoretical Mathematical 3PL Model Playground -->
        <div class="space-y-4 pt-4 border-t border-border">
          <div class="space-y-1">
            <h2 class="text-base font-bold uppercase tracking-wider text-ink flex items-center gap-2 font-mono">
              <TrendingUp class="size-4 text-brand" />
              Theoretical 3PL IRT Parameter Playground
            </h2>
            <p class="text-xs text-ink-secondary">
              Tune latent ability (θ), item discrimination (a), difficulty (b), guessing (c), and observe real-time Fisher Information.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Left: IRT Parameter Controls -->
            <div class="p-5 border border-border bg-surface space-y-4 shadow-2xs">
              <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-ink-secondary">
                3PL Control Variables
              </h3>

              <!-- Latent Ability Slider -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-mono">
                  <span>Learner Ability (θ)</span>
                  <span class="font-bold text-mint">{simTheta.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3.5"
                  max="3.5"
                  step="0.05"
                  bind:value={simTheta}
                  class="w-full accent-mint h-1.5 bg-surface-overlay"
                />
                <span class="text-[10px] text-ink-muted font-mono">Normal ability continuum (-3.5 to +3.5 logits).</span>
              </div>

              <!-- Item Discrimination Slider -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-mono">
                  <span>Discrimination (a)</span>
                  <span class="font-bold text-cyan">{itemA.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.05"
                  bind:value={itemA}
                  class="w-full accent-cyan h-1.5 bg-surface-overlay"
                />
                <span class="text-[10px] text-ink-muted font-mono">Slope of response curve at difficulty point b.</span>
              </div>

              <!-- Item Difficulty Slider -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-mono">
                  <span>Difficulty (b)</span>
                  <span class="font-bold text-violet">{itemB.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3.0"
                  max="3.0"
                  step="0.05"
                  bind:value={itemB}
                  class="w-full accent-violet h-1.5 bg-surface-overlay"
                />
                <span class="text-[10px] text-ink-muted font-mono">Location where P(θ) is midway between c and 1.0.</span>
              </div>

              <!-- Guessing Floor Slider -->
              <div class="space-y-1">
                <div class="flex justify-between text-xs font-mono">
                  <span>Pseudo-Guessing (c)</span>
                  <span class="font-bold text-attention">{itemC.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.5"
                  step="0.05"
                  bind:value={itemC}
                  class="w-full accent-attention h-1.5 bg-surface-overlay"
                />
                <span class="text-[10px] text-ink-muted font-mono">Lower asymptote: multiple-choice guessing floor.</span>
              </div>
            </div>

            <!-- Right: Mathematical Diagnostics Output -->
            <div class="p-5 border border-border bg-surface-subtle flex flex-col justify-between space-y-4 shadow-2xs">
              <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-ink-secondary">
                Deterministic Output Readout
              </h3>

              <!-- 3PL Probability Readout -->
              <div class="p-4 border border-border bg-surface space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">P(θ) Response Probability</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-mono font-bold text-mint">
                    {(itemProbability * 100).toFixed(1)}%
                  </span>
                  <span class="text-xs text-ink-muted font-mono">P = {itemProbability}</span>
                </div>
                <p class="text-[11px] text-ink-secondary mt-1">
                  Deterministic formula: <code class="font-mono bg-surface-subtle px-1">P(θ) = c + (1-c)/(1 + e^(-1.7a(θ-b)))</code>
                </p>
              </div>

              <!-- Fisher Information Readout -->
              <div class="p-4 border border-border bg-surface space-y-1">
                <span class="text-[10px] font-mono text-ink-muted uppercase">Fisher Information Value I(θ)</span>
                <div class="flex items-baseline gap-2">
                  <span class="text-2xl font-mono font-bold text-brand">
                    {fisherInfo}
                  </span>
                  <span class="text-xs text-ink-muted font-mono">Diagnostic Power</span>
                </div>
                <p class="text-[11px] text-ink-secondary mt-1">
                  The CAT item bank serves items maximizing this value to minimize Standard Error (SE).
                </p>
              </div>

              <!-- Convergence Invariant -->
              <div class="p-2 border border-border bg-surface text-xs font-mono text-ink-secondary flex items-center justify-between">
                <span>Stopping Rule:</span>
                <span class="text-mint font-semibold">SE &lt; 0.32 or 15 Items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {:else if activeSection === 'benchmarks'}
      <!-- ==========================================
           SECTION 5: GLOBAL STEM BENCHMARKING
           Max-w-6xl for comprehensive data visualization
           ========================================== -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span class="tracking-wide">05 · GLOBAL STEM & ROBOTICS BENCHMARKING</span>
          </div>

          <div>
            <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
              International Competition Ecosystems & NIST Standards
            </h1>
            <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-2xl leading-relaxed">
              Empirical rubrics mapped across 12 global championships (FLL, WRO, VEX, FRC, TechRadiance) with deterministic IEEE RAS TC-PEBRAS task board evaluation.
            </p>
          </div>
        </div>

        <div class="w-full shadow-xs">
          <GlobalSTEMBenchmarking />
        </div>
      </div>

    {:else if activeSection === 'compliance'}
      <!-- ==========================================
           SECTION 6: ARCHITECTURE & LICENSE COMPLIANCE
           Max-w-6xl for comprehensive audit ledger
           ========================================== -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        <!-- Section Kicker Header -->
        <div class="space-y-2 pb-4 border-b border-border/60">
          <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span class="tracking-wide">06 · OPEN SOURCE ARCHITECTURE & COMPLIANCE DOSSIER</span>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
                Clean-Room Verification & Dependency License Ledger
              </h1>
              <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-2xl leading-relaxed">
                Audited against the 2026 Scratch & Blockly Technical Architecture Dossier. 100% copyleft-isolated, zero AGPL-3.0 contamination, permissive Apache-2.0 / MIT foundation.
              </p>
            </div>

            <button
              onclick={() => (isComplianceModalOpen = true)}
              class="flex items-center gap-2 px-3.5 py-1.5 bg-mint hover:bg-mint/90 text-mint-foreground font-mono text-xs font-bold transition-micro shadow-xs shrink-0 self-start sm:self-auto"
              title="Launch full legal text and notices modal"
            >
              <FileText class="size-3.5" />
              <span>Full License Notices ↗</span>
            </button>
          </div>
        </div>

        <!-- 4-Pillar Compliance Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 border border-mint/40 bg-mint/5 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between text-mint font-mono">
              <span class="text-[10px] uppercase font-bold">Copyleft Boundary</span>
              <CheckCircle2 class="size-4" />
            </div>
            <div class="text-2xl font-bold font-mono text-ink">0 AGPL Taint</div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              No code from scratch-editor, scratch-vm, or scratch-audio. Complete network isolation.
            </p>
          </div>

          <div class="p-4 border border-cyan/40 bg-cyan/5 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between text-cyan font-mono">
              <span class="text-[10px] uppercase font-bold">Block Foundation</span>
              <Code2 class="size-4" />
            </div>
            <div class="text-2xl font-bold font-mono text-ink">Blockly 13.3</div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Google / Raspberry Pi Foundation core under Apache-2.0 with custom dual-generators.
            </p>
          </div>

          <div class="p-4 border border-brand/40 bg-brand/5 space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between text-brand font-mono">
              <span class="text-[10px] uppercase font-bold">Python Execution</span>
              <Cpu class="size-4" />
            </div>
            <div class="text-2xl font-bold font-mono text-ink">Pyodide WASM</div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Mozilla Public License 2.0. Runs in isolated client worker with sandbox watchdogs.
            </p>
          </div>

          <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
            <div class="flex items-center justify-between text-ink-muted font-mono">
              <span class="text-[10px] uppercase font-bold">Trademark & IP</span>
              <ShieldCheck class="size-4 text-mint" />
            </div>
            <div class="text-2xl font-bold font-mono text-mint">100% Original</div>
            <p class="text-[11px] text-ink-secondary leading-relaxed">
              Zero Scratch Cat, Gobo, or MIT marks. Bespoke SVG rovers and WAY 2.1 design tokens.
            </p>
          </div>
        </div>

        <!-- Architectural Seam Comparison Map -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-5 border border-critical/30 bg-critical-subtle space-y-3 font-mono text-xs shadow-2xs">
            <div class="flex items-center gap-2 text-critical font-bold uppercase text-[11px]">
              <AlertCircle class="size-4" />
              <span>Upstream Scratch Monorepo (AGPL-3.0 Copyleft)</span>
            </div>
            <p class="text-ink-secondary font-sans text-xs leading-relaxed">
              The public Scratch repository enforces network copyleft (AGPL-3.0) and uses proprietary backend services and character artwork:
            </p>
            <div class="space-y-1.5 text-[11px]">
              <div class="p-2 border border-border bg-surface">
                <strong>scratch-gui:</strong> React workspace (AGPL-3.0-only)
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>scratch-vm:</strong> Thread scheduler & opcode graph (AGPL)
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>scratch-audio:</strong> Web Audio sound engine (AGPL)
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>scratch-link:</strong> Local daemon requiring install (AGPL)
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>Scratch Characters:</strong> Proprietary MIT / Scratch Foundation marks
              </div>
            </div>
          </div>

          <div class="p-5 border border-mint/30 bg-mint/5 space-y-3 font-mono text-xs shadow-2xs">
            <div class="flex items-center gap-2 text-mint font-bold uppercase text-[11px]">
              <CheckCircle2 class="size-4" />
              <span>CREED OS Clean-Room Implementation (Permissive)</span>
            </div>
            <p class="text-ink-secondary font-sans text-xs leading-relaxed">
              Engineered clean-room from behavioral specifications, utilizing only permissive or decoupled technologies:
            </p>
            <div class="space-y-1.5 text-[11px]">
              <div class="p-2 border border-border bg-surface">
                <strong>BrowserIDE.svelte:</strong> Svelte 5 + Bits UI (MIT)
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>roboticsBlocks.ts:</strong> Bespoke Python/JS AST generators (Apache)
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>webAudioSynth.ts:</strong> Native browser AudioContext synthesizer
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>hardwareTelemetryBridge.ts:</strong> Browser Web Serial & WebUSB APIs
              </div>
              <div class="p-2 border border-border bg-surface">
                <strong>Autonomous Rover:</strong> Original SVG geometry & WAY 2.1 design tokens
              </div>
            </div>
          </div>
        </div>

        <!-- Interactive Software Bill of Materials (SBOM) Explorer -->
        <div class="p-5 border border-border bg-surface space-y-4 shadow-2xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <h3 class="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-2">
                <Layers class="size-4 text-brand" />
                <span>Production Dependency Bill of Materials (SBOM)</span>
              </h3>
              <p class="text-xs text-ink-secondary">
                Audited dependency manifest verifying license classification, authors, and clean-room purpose.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <div class="relative w-full sm:w-56">
                <Search class="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Filter packages..."
                  bind:value={sbomSearch}
                  class="w-full pl-8 pr-3 py-1 bg-surface-subtle border border-border text-xs font-mono text-ink placeholder:text-ink-muted focus:outline-hidden focus:border-brand"
                />
              </div>

              <div class="flex items-center gap-1 font-mono text-xs">
                {#each ['all', 'Apache-2.0', 'MIT', 'MPL-2.0', 'OFL-1.1'] as lic}
                  <button
                    onclick={() => (sbomFilter = lic)}
                    class="px-2 py-0.5 text-[10px] border transition-micro {sbomFilter === lic
                      ? 'border-brand text-brand bg-brand/10 font-bold'
                      : 'border-border text-ink-muted hover:text-ink bg-surface'}"
                  >
                    {lic}
                  </button>
                {/each}
              </div>
            </div>
          </div>

          <!-- Table of Audited Dependencies -->
          <div class="border border-border overflow-hidden">
            <div class="max-h-96 overflow-y-auto">
              <table class="w-full text-left border-collapse text-[11px] font-mono">
                <thead class="sticky top-0 bg-surface-subtle border-b border-border text-ink-muted text-[10px] uppercase">
                  <tr>
                    <th class="p-2 font-bold">Package Name</th>
                    <th class="p-2 font-bold">Version</th>
                    <th class="p-2 font-bold">License</th>
                    <th class="p-2 font-bold">Author / Licensor</th>
                    <th class="p-2 font-bold">Clean-Room Subsystem Role</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-border">
                  {#each filteredSbom as dep}
                    <tr class="hover:bg-surface-subtle/50 transition-micro">
                      <td class="p-2 font-bold text-ink">
                        <a
                          href={dep.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="hover:text-brand hover:underline flex items-center gap-1"
                        >
                          <span>{dep.name}</span>
                          <ExternalLink class="size-2.5 opacity-50" />
                        </a>
                      </td>
                      <td class="p-2 text-ink-muted">{dep.version}</td>
                      <td class="p-2">
                        <span class="px-1.5 py-0.5 text-[10px] font-bold border {dep.license === 'Apache-2.0'
                          ? 'border-cyan/40 bg-cyan/10 text-cyan'
                          : dep.license === 'MIT'
                          ? 'border-mint/40 bg-mint/10 text-mint'
                          : dep.license === 'MPL-2.0'
                          ? 'border-brand/40 bg-brand/10 text-brand'
                          : 'border-violet/40 bg-violet/10 text-violet'}">
                          {dep.license}
                        </span>
                      </td>
                      <td class="p-2 text-ink-secondary truncate max-w-44" title={dep.author}>
                        {dep.author}
                      </td>
                      <td class="p-2 text-ink-muted font-sans text-[11px]">
                        {dep.role}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
          </div>
          <div class="flex items-center justify-between text-[10px] text-ink-muted font-mono pt-1">
            <span>Showing {filteredSbom.length} of {SBOM_DEPENDENCIES.length} audited packages. Zero AGPL-3.0 dependencies.</span>
            <button
              onclick={() => (isComplianceModalOpen = true)}
              class="text-brand hover:underline font-bold"
            >
              View Verbatim License Texts →
            </button>
          </div>
        </div>
      </div>
    {/if}
  </main>
</div>

<!-- Global Open Source Licenses & Architecture Compliance Modal -->
<OpenSourceComplianceModal bind:isOpen={isComplianceModalOpen} />

<!-- Global 3D Three.js Telemetry Mesh Modal -->
<LivePortalsModal bind:isOpen={isMeshModalOpen} />
