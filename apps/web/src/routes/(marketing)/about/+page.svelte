<script lang="ts">
  import {
    ArrowRight,
    Compass,
    ShieldCheck,
    BrainCircuit,
    Heart,
    Sparkles,
    CheckCircle2,
    Eye,
    ShieldAlert,
    BookOpen,
    Users
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title> · </title>
  <meta
    name="description"
    content="Pedagogical safety, growth before labeling, quiet Socratic mentorship, and child data sovereignty under DPDP Act 2023."
  />
</svelte:head>

<div class="space-y-24 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Mission Header -->
  <header class="space-y-6 text-center max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <Compass class="w-3.5 h-3.5 text-brand" />
      <span class="font-mono uppercase tracking-wider text-[11px]">Philosophy & Safety · WAY 3.0</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-ink leading-tight">
      Growth before labeling.<br />Evidence before inference.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      CREED OS was built on a singular conviction: technology in education must calm anxiety, respect developmental horizons, and never reduce a child to a fixed number.
    </p>

    <!-- Quick Navigation Anchors -->
    <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
      <a
        href="#safety"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <ShieldCheck class="w-3.5 h-3.5 text-brand" />
        <span>Pedagogical Safety</span>
      </a>
      <a
        href="#mentorship"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <BrainCircuit class="w-3.5 h-3.5 text-ai" />
        <span>Quiet Mentorship</span>
      </a>
      <a
        href="#principles"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <BookOpen class="w-3.5 h-3.5 text-mint" />
        <span>Editorial Design</span>
      </a>
    </div>
  </header>

  <!-- ============================================================
       SECTION 1: PEDAGOGICAL SAFETY
       Anchor: #safety
       ============================================================ -->
  <section id="safety" class="scroll-mt-24 space-y-8">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand">
        <ShieldCheck class="w-4 h-4" />
        <span>Pedagogical Pillar 01</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-heading font-semibold text-ink">
        Pedagogical Safety & Anti-Deficit Framing
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Standard educational testing often produces destructive anxiety, fixed labels, and premature exclusions. We enforce non-negotiable pedagogical boundaries.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
      <!-- Rule 1: Growth Before Labeling -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
        <div class="w-8 h-8 rounded-none bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
          <Heart class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-semibold text-ink">Growth Before Labeling</h3>
        <p class="text-ink-secondary leading-relaxed">
          Never assign fixed IQ classifications, deterministic ability rankings, or career exclusions. Every skill is modeled as an open developmental horizon that shifts with authentic practice.
        </p>
      </div>

      <!-- Rule 2: Zero False Precision -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
        <div class="w-8 h-8 rounded-none bg-mint/10 border border-mint/20 text-mint flex items-center justify-center">
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-semibold text-ink">Zero False Precision</h3>
        <p class="text-ink-secondary leading-relaxed">
          We reject deceptive percentage readiness metrics (e.g. "74% fit"). Capabilities are expressed exclusively in qualitative developmental tiers: <em>Emerging</em>, <em>Developing</em>, and <em>Strong Foundation</em>.
        </p>
      </div>

      <!-- Rule 3: Low-Anxiety Architecture -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
        <div class="w-8 h-8 rounded-none bg-positive/10 border border-positive/20 text-positive flex items-center justify-center">
          <ShieldAlert class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-semibold text-ink">Low-Anxiety Testing</h3>
        <p class="text-ink-secondary leading-relaxed">
          Panic countdown timers and high-stakes 60-question marathons are eliminated. Adaptive CAT items calibrate dynamically, reaching high statistical confidence in 8–12 unpressured interactions.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       SECTION 2: QUIET MENTORSHIP
       Anchor: #mentorship
       ============================================================ -->
  <section id="mentorship" class="scroll-mt-24 space-y-8">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ai">
        <BrainCircuit class="w-4 h-4" />
        <span>Pedagogical Pillar 02</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-heading font-semibold text-ink">
        Quiet Mentorship & The Socratic Frontier
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed max-w-3xl">
        AI should not think for children. Powered by Google ADK and Gemini API, our Socratic mentor guides cognitive discovery without ever handing out direct answers.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- The Socratic Move System -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-4">
        <h3 class="text-base font-semibold text-ink">The Socratic Move Engine</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          When a learner reaches an impasse, the mentor selects from four deliberate scaffolding moves rather than dispensing solutions:
        </p>
        <ul class="space-y-2 text-xs text-ink-secondary">
          <li class="p-3 rounded-none bg-surface border border-border">
            <strong class="text-ink">1. Problem Decomposition:</strong> Breaking multi-variable challenges into isolated foundational steps.
          </li>
          <li class="p-3 rounded-none bg-surface border border-border">
            <strong class="text-ink">2. Counter-Example Probing:</strong> Offering a simple edge case to help the student spot their own false assumption.
          </li>
          <li class="p-3 rounded-none bg-surface border border-border">
            <strong class="text-ink">3. Physical Analogy:</strong> Relating mathematical relations to tactile physical mechanics (levers, water flow, balance).
          </li>
          <li class="p-3 rounded-none bg-surface border border-border">
            <strong class="text-ink">4. Metacognitive Reflection:</strong> Asking the learner to summarize their reasoning before attempting the next trial.
          </li>
        </ul>
      </div>

      <!-- Restrained Iris Visual Identity -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-4">
        <h3 class="text-base font-semibold text-ink">Restrained Iris & Zero Slop</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          We treat AI as a quiet laboratory instrument, not an entertainment spectacle. Every AI-assisted interaction conforms to strict anti-slop rules:
        </p>
        <div class="space-y-3 text-xs text-ink-secondary">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-none bg-ai shrink-0 mt-1.5"></div>
            <div>
              <strong class="text-ink">Calibrated Iris Accent:</strong> Distinct visual identification without glowing neon loops, cyber borders, or animated mascots.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-none bg-ai shrink-0 mt-1.5"></div>
            <div>
              <strong class="text-ink">Full Explainability:</strong> Contextual "Why?" disclosures accompany every suggestion so students understand the pedagogical reasoning.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-none bg-ai shrink-0 mt-1.5"></div>
            <div>
              <strong class="text-ink">Human Escalation:</strong> If a learner experiences persistent cognitive blockages, the system flags the moment directly to their teacher's triage queue.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============================================================
       SECTION 3: EDITORIAL DESIGN PRINCIPLES
       Anchor: #principles
       ============================================================ -->
  <section id="principles" class="scroll-mt-24 space-y-8">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mint">
        <BookOpen class="w-4 h-4" />
        <span>Ergonomic Grammar</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-heading font-semibold text-ink">
        WAY 2.1 Quiet Editorial Intelligence
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Every interface is built to minimize cognitive load and eliminate "card soup" and metric fatigue through strict architectural laws.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
      <div class="p-6 rounded-none bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono uppercase text-brand font-semibold">Ergonomic Law 01</span>
        <h3 class="text-sm font-semibold text-ink">Three Information Levels</h3>
        <p class="text-ink-secondary leading-relaxed">
          Level 1 (Signal: what to notice first) → Level 2 (Context: 1 short sentence why it matters) → Level 3 (Evidence: disclosed only upon request).
        </p>
      </div>

      <div class="p-6 rounded-none bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono uppercase text-mint font-semibold">Ergonomic Law 02</span>
        <h3 class="text-sm font-semibold text-ink">0 / 4 / 8px Architectural Radii</h3>
        <p class="text-ink-secondary leading-relaxed">
          0px structural frames, 4px controls and inputs, 8px expressive artwork. Zero bubbly 12px+ consumer curves or floating pills.
        </p>
      </div>

      <div class="p-6 rounded-none bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono uppercase text-ai font-semibold">Ergonomic Law 03</span>
        <h3 class="text-sm font-semibold text-ink">Lagom Motion Contract</h3>
        <p class="text-ink-secondary leading-relaxed">
          Motion durations strictly between 140ms and 280ms. Transitions feel tactile, natural, and never delay active learner work.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       ACTION FOOTER
       ============================================================ -->
  <section class="p-8 rounded-none bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-semibold text-ink">Support the Calm Education Movement</h3>
      <p class="text-xs text-ink-secondary">Explore how CREED OS brings dignified intelligence to your family or institution.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/families"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>For Families</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/schools"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>For Schools</span>
      </a>
    </div>
  </section>
</div>
