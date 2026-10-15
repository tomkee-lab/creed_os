<script lang="ts">
  import {
    ArrowRight,
    CheckCircle2,
    Shield,
    BrainCircuit,
    Activity,
    Sparkles,
    Layers,
    Lock,
    Cpu,
    Compass,
    FileCheck,
    Sigma
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Platform Science & Architecture — CREED OS</title>
  <meta
    name="description"
    content="Deterministic 3PL Item Response Theory (IRT), Computerized Adaptive Testing (CAT) stopping bounds, and cryptographic evidence provenance."
  />
</svelte:head>

<div class="space-y-24 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Master Architecture Header -->
  <header class="space-y-6 text-center max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <BrainCircuit class="w-3.5 h-3.5 text-brand" />
      <span class="font-mono uppercase tracking-wider text-[11px]">Science & Architecture · WAY 3.0</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-ink leading-tight">
      Deterministic algorithms score.<br />AI explains. Humans decide.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      CREED OS replaces probabilistic black-box grading with verified psychometrics, adaptive standard-error bounds, and cryptographic evidence provenance.
    </p>

    <!-- Anchor Quick-Jumps -->
    <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
      <a
        href="#irt"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <Sigma class="w-3.5 h-3.5 text-brand" />
        <span>Deterministic IRT</span>
      </a>
      <a
        href="#cat"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <Activity class="w-3.5 h-3.5 text-mint" />
        <span>Adaptive CAT Bounds</span>
      </a>
      <a
        href="#evidence"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <FileCheck class="w-3.5 h-3.5 text-ai" />
        <span>Evidence Provenance</span>
      </a>
    </div>
  </header>

  <!-- ============================================================
       SECTION 1: DETERMINISTIC IRT (Item Response Theory 3PL)
       Anchor: #irt
       ============================================================ -->
  <section id="irt" class="scroll-mt-24 space-y-8">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand">
        <Sigma class="w-4 h-4" />
        <span>Scientific Pillar 01</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-heading font-semibold text-ink">
        Deterministic 3PL Item Response Theory
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Latent ability estimates are computed strictly through deterministic psychometric models, never by raw generative LLMs. Scores are mathematical; generative AI provides Socratic reasoning context only.
      </p>
    </div>

    <!-- Mathematical Specification Card -->
    <div class="p-6 sm:p-8 rounded-none bg-surface-raised border border-border space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span class="text-xs font-mono uppercase text-ink-muted">Mathematical Model</span>
          <h3 class="text-base font-semibold text-ink">Three-Parameter Logistic Function (3PL)</h3>
        </div>
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-none bg-brand/10 border border-brand/20 text-brand text-xs font-mono">
          Scaling Constant D = 1.702
        </span>
      </div>

      <!-- Formula Visual Display -->
      <div class="p-4 rounded-none bg-canvas border border-border font-mono text-center sm:text-lg text-ink space-y-2 overflow-x-auto">
        <div class="tracking-wide">
          P(θ) = c + (1 − c) / [ 1 + exp(−1.702 · a · (θ − b)) ]
        </div>
        <div class="text-xs text-ink-muted font-sans">
          Probability of correct response as a function of latent developmental ability (θ)
        </div>
      </div>

      <!-- The 3 Triad Parameters -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div class="p-4 rounded-none bg-surface border border-border space-y-2">
          <div class="font-mono text-sm font-semibold text-brand">Parameter a (Discrimination)</div>
          <p class="text-ink-secondary leading-relaxed">
            Governs the slope of the Item Characteristic Curve at the inflection point. Constrained strictly to [0.20, 2.50] to eliminate unstable items.
          </p>
        </div>
        <div class="p-4 rounded-none bg-surface border border-border space-y-2">
          <div class="font-mono text-sm font-semibold text-brand">Parameter b (Difficulty)</div>
          <p class="text-ink-secondary leading-relaxed">
            Locates the item along the developmental ability spectrum on the standard scale [−3.00, +3.00], calibrated across Class 5–10 standards.
          </p>
        </div>
        <div class="p-4 rounded-none bg-surface border border-border space-y-2">
          <div class="font-mono text-sm font-semibold text-brand">Parameter c (Pseudo-Guessing)</div>
          <p class="text-ink-secondary leading-relaxed">
            Represents the lower horizontal asymptote. Bounds random guess contamination for multi-choice response interactions [0.00, 0.35].
          </p>
        </div>
      </div>

      <!-- Numerical Quadrature & Bayesian EAP -->
      <div class="p-4 rounded-none bg-surface border border-border space-y-2 text-xs">
        <h4 class="font-semibold text-ink">Bayesian Expected A Posteriori (EAP) Estimation</h4>
        <p class="text-ink-secondary leading-relaxed">
          Posterior distributions are integrated numerically via a 41-node Gauss-Hermite quadrature across [−4.0, +4.0] standard deviations. Posterior variance is updated dynamically upon every response vector, preventing runaway calibration errors.
        </p>
      </div>
    </div>
  </section>

  <!-- ============================================================
       SECTION 2: ADAPTIVE CAT BOUNDS
       Anchor: #cat
       ============================================================ -->
  <section id="cat" class="scroll-mt-24 space-y-8">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mint">
        <Activity class="w-4 h-4" />
        <span>Scientific Pillar 02</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-heading font-semibold text-ink">
        Adaptive CAT Bounds & Stopping Criteria
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Computerized Adaptive Testing selects items that maximize information at the learner's current developmental frontier, achieving high measurement precision without test fatigue.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Item Information Maximization -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-4">
        <div class="w-8 h-8 rounded-none bg-mint/10 border border-mint/20 text-mint flex items-center justify-center">
          <Cpu class="w-4 h-4" />
        </div>
        <h3 class="text-base font-semibold text-ink">Fisher Information Maximization</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          At every step in the assessment session, the engine evaluates available item bank candidates against the current ability estimate θ, selecting the item that yields maximum Fisher Information I(θ):
        </p>
        <div class="p-3 rounded-none bg-canvas border border-border font-mono text-center text-xs text-ink">
          I(θ) = [ D² · a² · (1 − c) ] / [ (c + e^(D·a·(θ−b))) · (1 + e^(−D·a·(θ−b)))² ]
        </div>
        <p class="text-xs text-ink-muted">
          Maximizing information drastically minimizes posterior variance with every answered question.
        </p>
      </div>

      <!-- Stopping Rules & Cognitive Bounds -->
      <div class="p-6 rounded-none bg-surface-raised border border-border space-y-4">
        <div class="w-8 h-8 rounded-none bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
          <Compass class="w-4 h-4" />
        </div>
        <h3 class="text-base font-semibold text-ink">Low-Anxiety Stopping Bounds</h3>
        <ul class="space-y-3 text-xs text-ink-secondary">
          <li class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-mint shrink-0 mt-0.5" />
            <div>
              <strong class="text-ink">Standard Error Criterion:</strong> Session concludes automatically when standard error SE(θ) ≤ 0.30, confirming statistically solid confidence.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-mint shrink-0 mt-0.5" />
            <div>
              <strong class="text-ink">Hard Length Limits:</strong> Minimum 5 items, maximum 15 items. Never subjects children to 60-question marathon exhaustion.
            </div>
          </li>
          <li class="flex items-start gap-2">
            <CheckCircle2 class="w-4 h-4 text-mint shrink-0 mt-0.5" />
            <div>
              <strong class="text-ink">No Panic Timers:</strong> Active assessments suppress countdown timers to keep cognitive load centered purely on problem-solving.
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ============================================================
       SECTION 3: EVIDENCE PROVENANCE & 4-TIER PYRAMID
       Anchor: #evidence
       ============================================================ -->
  <section id="evidence" class="scroll-mt-24 space-y-8">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-ai">
        <FileCheck class="w-4 h-4" />
        <span>Scientific Pillar 03</span>
      </div>
      <h2 class="text-2xl sm:text-3xl font-heading font-semibold text-ink">
        Longitudinal Evidence Provenance
      </h2>
      <p class="text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Evidence before inference. Every claim in a student's profile maps to tangible, verified learning artifacts across a four-level progressive mastery ladder.
      </p>
    </div>

    <!-- The 4-Tier Evidence Hierarchy Table -->
    <div class="border border-border rounded-none overflow-hidden bg-surface-raised">
      <div class="p-4 bg-surface-subtle border-b border-border flex items-center justify-between">
        <h3 class="text-xs font-semibold uppercase tracking-wider text-ink font-mono">
          Four-Tier Multimodal Evidence Pyramid
        </h3>
        <span class="text-[11px] font-mono text-ink-muted">W3C Verifiable Credentials Compatible</span>
      </div>
      <div class="divide-y divide-border text-xs">
        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-none bg-brand/10 text-brand font-mono font-semibold text-[10px]">LEVEL 1</span>
              <strong class="text-ink">Formative Diagnostic Interaction</strong>
            </div>
            <p class="text-ink-secondary">
              Single-item CAT interaction with item-level discrimination and standard error verification.
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Item Response Telemetry</span>
        </div>

        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-none bg-mint/10 text-mint font-mono font-semibold text-[10px]">LEVEL 2</span>
              <strong class="text-ink">Multimodal Simulation Telemetry</strong>
            </div>
            <p class="text-ink-secondary">
              Direct telemetry from interactive simulations (e.g. 3-gear kinematic torque lab, truss bridge load simulation).
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Parameter Curves & Step Times</span>
        </div>

        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-none bg-ai/10 text-ai font-mono font-semibold text-[10px]">LEVEL 3</span>
              <strong class="text-ink">Educator Demonstration Rubric</strong>
            </div>
            <p class="text-ink-secondary">
              Direct classroom observation logged by accredited teachers evaluating hands-on conceptual mastery.
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Teacher Cryptographic Sign-Off</span>
        </div>

        <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-none bg-positive/10 text-positive font-mono font-semibold text-[10px]">LEVEL 4</span>
              <strong class="text-ink">Applied Capstone Maker Artifact</strong>
            </div>
            <p class="text-ink-secondary">
              End-to-end student project or design portfolio demonstrating synthesized mastery across real-world problem spaces.
            </p>
          </div>
          <span class="text-ink-muted font-mono shrink-0">Immutable Project Seal</span>
        </div>
      </div>
    </div>

    <!-- Cryptographic Sealing Explainer -->
    <div class="p-6 rounded-none bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="space-y-1">
        <div class="flex items-center gap-2 text-ink font-semibold text-sm">
          <Lock class="w-4 h-4 text-brand" />
          <span>Tamper-Evident SHA-256 Provenance</span>
        </div>
        <p class="text-xs text-ink-secondary max-w-2xl leading-relaxed">
          Every evidence entry is sealed with an HMAC-SHA256 signature containing timestamp, evaluator ID, task rubric, and raw interaction parameters. Records cannot be retroactively manipulated or hallucinated.
        </p>
      </div>
      <a
        href="/consent#ledger"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface-subtle border border-border text-xs font-medium text-ink hover:border-brand shrink-0 transition-colors"
      >
        <span>Inspect Consent Ledger</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
    </div>
  </section>

  <!-- ============================================================
       ACTION FOOTER: Experience Workspaces
       ============================================================ -->
  <section class="p-8 rounded-none bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-semibold text-ink">Ready to verify the science in action?</h3>
      <p class="text-xs text-ink-secondary">Explore role-specific workspaces designed for students, families, and educators.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/student"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Student Space</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/studio"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Item Studio Workbench</span>
      </a>
    </div>
  </section>
</div>
