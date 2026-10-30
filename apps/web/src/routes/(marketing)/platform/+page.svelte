<script lang="ts">
  import {
    ArrowRight,
    CheckCircle2,
    Shield,
    Layers,
    Lock,
    Compass,
    FileCheck,
    Scale,
    Sliders,
    ChevronDown,
    BookOpen
  } from 'lucide-svelte';

  let showTechnicalAppendix = $state(false);
</script>

<svelte:head>
  <title>Platform Methodology & Architecture · CREED OS</title>
  <meta
    name="description"
    content="Consistent adaptive item scaling, low-anxiety check limits, and sealed multi-tier evidence provenance."
  />
</svelte:head>

<div class="space-y-16 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Master Architecture Header -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface border border-border text-[11px] font-mono text-ink-secondary">
      <span>METHODOLOGY OVERVIEW</span>
      <span class="text-border">·</span>
      <span class="text-brand font-semibold">WAY 2.1</span>
    </div>
    <h1 class="font-heading font-medium text-3xl sm:text-4xl lg:text-[42px] text-ink tracking-tight leading-[1.15]">
      Measure consistently.<br />
      <span class="text-brand">Adapt without pressure. Show real evidence.</span>
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto">
      CREED OS replaces probabilistic black-box grading with calibrated item models, gentle session boundaries, and verifiable learning artifacts.
    </p>

    <!-- Anchor Quick-Jumps -->
    <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
      <a
        href="#measure"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
      >
        <Scale class="w-3.5 h-3.5 text-brand" />
        <span>Consistent Measurement</span>
      </a>
      <a
        href="#adapt"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
      >
        <Sliders class="w-3.5 h-3.5 text-brand" />
        <span>Adaptive Checks</span>
      </a>
      <a
        href="#evidence"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
      >
        <FileCheck class="w-3.5 h-3.5 text-brand" />
        <span>Evidence Provenance</span>
      </a>
    </div>
  </header>

  <!-- Pillar 1: Measure Consistently -->
  <section id="measure" class="scroll-mt-24 space-y-6">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
        <Scale class="w-3.5 h-3.5" />
        <span>Pillar 01</span>
      </div>
      <h2 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Measure consistently across every check
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Every question is calibrated against documented curriculum standards before appearing in front of a learner. Scores are computed by audited mathematical models, never by unconstrained generative text.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-2">
        <div class="font-heading font-semibold text-sm text-ink">Calibrated Item Scaling</div>
        <p class="text-ink-secondary leading-relaxed">
          Questions are pre-calibrated by curriculum researchers to isolate distinct developmental concepts rather than raw test speed.
        </p>
      </div>
      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-2">
        <div class="font-heading font-semibold text-sm text-ink">Separation of Scoring and Context</div>
        <p class="text-ink-secondary leading-relaxed">
          Mathematical engines score student answers. Socratic AI models provide conversational explanations and diagnostic hints, never grades.
        </p>
      </div>
      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-2">
        <div class="font-heading font-semibold text-sm text-ink">Stable Developmental Scale</div>
        <p class="text-ink-secondary leading-relaxed">
          Growth is tracked on a unified developmental continuum from Class 3 to 12, eliminating artificial grade-level cliff drops.
        </p>
      </div>
    </div>
  </section>

  <!-- Pillar 2: Adapt Without Pressure -->
  <section id="adapt" class="scroll-mt-24 space-y-6">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
        <Sliders class="w-3.5 h-3.5" />
        <span>Pillar 02</span>
      </div>
      <h2 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Adapt gently without countdown pressure
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
        The system dynamically selects questions matching each learner's current developmental frontier, gathering reliable signal with short sessions and zero anxiety.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-3">
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-positive shrink-0" />
          <h3 class="font-semibold text-ink text-sm">Targeted Questions</h3>
        </div>
        <p class="text-ink-secondary leading-relaxed">
          Each prompt meets the student at their working boundary: challenging enough to test understanding, never overwhelming.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-3">
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-positive shrink-0" />
          <h3 class="font-semibold text-ink text-sm">Quiet Session Caps</h3>
        </div>
        <p class="text-ink-secondary leading-relaxed">
          Checks conclude automatically between 5 and 15 questions as soon as certainty is reached. No 60-question marathons.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-3">
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-positive shrink-0" />
          <h3 class="font-semibold text-ink text-sm">Zero Clock Pressure</h3>
        </div>
        <p class="text-ink-secondary leading-relaxed">
          Countdown timers are silenced during active sessions so students can reflect, sketch, and think deeply in peace.
        </p>
      </div>
    </div>
  </section>

  <!-- Pillar 3: Show Real Evidence -->
  <section id="evidence" class="scroll-mt-24 space-y-6">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
        <FileCheck class="w-3.5 h-3.5" />
        <span>Pillar 03</span>
      </div>
      <h2 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Show tangible evidence behind every profile statement
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Evidence before inference. Every competency claim in a student profile links directly to observable work across four distinct learning levels.
      </p>
    </div>

    <!-- The 4-Tier Evidence Hierarchy -->
    <div class="border border-border rounded-sm overflow-hidden bg-surface-raised">
      <div class="p-4 bg-surface-subtle border-b border-border flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-ink font-mono">
          Four-Tier Evidence Ladder
        </h3>
        <span class="text-[11px] font-mono text-ink-muted">Observable & Auditable</span>
      </div>
      <div class="divide-y divide-border text-xs">
        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-sm bg-brand/10 text-brand font-mono font-semibold text-[10px]">TIER 1</span>
              <strong class="text-ink">Diagnostic Check Responses</strong>
            </div>
            <p class="text-ink-secondary">
              Direct question interactions verified by calibrated item curves and statistical bounds.
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Item Level Telemetry</span>
        </div>

        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-sm bg-brand/10 text-brand font-mono font-semibold text-[10px]">TIER 2</span>
              <strong class="text-ink">Hands-On Simulation Work</strong>
            </div>
            <p class="text-ink-secondary">
              Observed telemetry from interactive sandboxes (gear kinematics, bridge tension, rover coordinates).
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Mechanical Telemetry</span>
        </div>

        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-sm bg-brand/10 text-brand font-mono font-semibold text-[10px]">TIER 3</span>
              <strong class="text-ink">Educator Rubric Sign-Off</strong>
            </div>
            <p class="text-ink-secondary">
              Classroom observations logged by accredited educators using objective rubrics.
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Teacher Verification</span>
        </div>

        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-sm bg-positive/10 text-positive font-mono font-semibold text-[10px]">TIER 4</span>
              <strong class="text-ink">Applied Capstone Projects</strong>
            </div>
            <p class="text-ink-secondary">
              Complete student builds, code repositories, or design portfolios demonstrating synthesized mastery.
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Immutable Project Record</span>
        </div>
      </div>
    </div>

    <!-- Cryptographic Sealing Explainer -->
    <div class="p-6 rounded-sm bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-ink font-semibold text-sm">
          <Lock class="w-4 h-4 text-brand" />
          <span>Tamper-Evident SHA-256 Provenance</span>
        </div>
        <p class="text-xs text-ink-secondary max-w-2xl leading-relaxed">
          Every evidence entry is sealed with a cryptographic hash containing timestamp, evaluator ID, task rubric, and raw parameter values. Records cannot be silently altered or retroactively manipulated.
        </p>
      </div>
      <a
        href="/consent"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface-subtle border border-border text-xs font-medium text-ink hover:border-brand shrink-0 transition-colors"
      >
        <span>View Privacy & Consent</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </section>

  <!-- Progressive Disclosure: Technical Psychometrics & IRT Appendix (Level 3 Detail) -->
  <section id="technical-appendix" class="scroll-mt-24 border border-border rounded-sm bg-surface p-6 space-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <BookOpen class="w-4 h-4 text-brand" />
        <h3 class="font-heading font-medium text-sm text-ink">Technical Psychometrics & IRT Appendix</h3>
      </div>
      <button
        type="button"
        onclick={() => showTechnicalAppendix = !showTechnicalAppendix}
        class="inline-flex items-center gap-1 text-xs font-mono text-brand hover:underline cursor-pointer"
        aria-expanded={showTechnicalAppendix}
      >
        <span>{showTechnicalAppendix ? 'Hide technical formulas' : 'Show technical formulas'}</span>
        <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200 {showTechnicalAppendix ? 'rotate-180' : ''}" />
      </button>
    </div>

    <p class="text-xs text-ink-secondary leading-relaxed">
      Intended for psychometricians, researchers, and technical evaluators who require exact mathematical parameters and calibration constraints.
    </p>

    {#if showTechnicalAppendix}
      <div class="pt-4 border-t border-border space-y-6 text-xs">
        <!-- 3PL Mathematical Model -->
        <div class="space-y-2">
          <div class="font-semibold text-ink">1. Three-Parameter Logistic Function (3PL)</div>
          <div class="p-3 rounded-none bg-surface-raised border border-border font-mono text-center text-ink overflow-x-auto">
            P(ability) = c + (1 - c) / [ 1 + exp(-1.702 · a · (ability - b)) ]
          </div>
          <p class="text-ink-secondary leading-relaxed">
            Where <em>a</em> is item discrimination constrained to [0.20, 2.50], <em>b</em> is item difficulty on the standard scale [-3.00, +3.00], and <em>c</em> bounds random guess probability [0.00, 0.35].
          </p>
        </div>

        <!-- Convergence & Information -->
        <div class="space-y-2">
          <div class="font-semibold text-ink">2. Numerical Quadrature & Information Convergence</div>
          <p class="text-ink-secondary leading-relaxed">
            Posterior distributions are integrated numerically through a 41-node Gauss-Hermite quadrature. Item selection maximizes candidate information at the current developmental estimate. Adaptive sessions terminate when standard error falls to or below 0.30 or upon reaching hard item limits.
          </p>
        </div>
      </div>
    {/if}
  </section>

  <!-- Action footer: single clear CTA -->
  <section class="p-8 rounded-sm bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-medium text-ink">Explore how calm measurement feels in practice</h3>
      <p class="text-xs text-ink-secondary">Review a developmental profile without fixed ability scores or percentage labels.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/student"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Explore an example learner profile</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </section>
</div>
