<script lang="ts">
  import {
    ArrowRight,
    Compass,
    ShieldCheck,
    BrainCircuit,
    Heart,
    CheckCircle2,
    Eye,
    ShieldAlert,
    BookOpen,
    Users,
    Lock,
    Scale
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>About CREED OS · Pedagogical Mission & Safeguarding</title>
  <meta
    name="description"
    content="Pedagogical safety, growth before labeling, quiet Socratic mentorship, and child data sovereignty under DPDP Act 2023."
  />
</svelte:head>

<div class="space-y-16 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Mission Header -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface border border-border text-[11px] font-mono text-ink-secondary">
      <span>PEDAGOGICAL DOCTRINE</span>
      <span class="text-border">·</span>
      <span class="text-brand font-semibold">CHILD-SAFE DESIGN</span>
    </div>
    <h1 class="font-heading font-medium text-3xl sm:text-4xl lg:text-[42px] text-ink tracking-tight leading-[1.15]">
      Growth before labeling.<br />
      <span class="text-brand">Evidence before inference.</span>
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto">
      CREED OS was built on a singular conviction: technology in education must calm anxiety, respect developmental horizons, and never reduce a child to a fixed number.
    </p>

    <!-- Quick Navigation Anchors -->
    <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
      <a
        href="#safety"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
      >
        <ShieldCheck class="w-3.5 h-3.5 text-brand" />
        <span>Pedagogical Safety</span>
      </a>
      <a
        href="#mentorship"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
      >
        <BrainCircuit class="w-3.5 h-3.5 text-brand" />
        <span>Quiet Mentorship</span>
      </a>
      <a
        href="#governance"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand hover:text-brand transition-colors"
      >
        <Lock class="w-3.5 h-3.5 text-brand" />
        <span>Institutional Governance</span>
      </a>
    </div>
  </header>

  <!-- 2. Pedagogical safety principles. -->
  <section id="safety" class="scroll-mt-24 space-y-6">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>Pedagogical Pillar 01</span>
      </div>
      <h2 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Pedagogical Safety & Anti-Deficit Framing
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Standard educational testing often produces destructive anxiety, fixed labels, and premature exclusions. We enforce non-negotiable pedagogical boundaries.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
      <!-- Rule 1: Growth Before Labeling -->
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
        <div class="w-8 h-8 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
          <Heart class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-semibold text-ink">Growth Before Labeling</h3>
        <p class="text-ink-secondary leading-relaxed">
          Never assign fixed IQ classifications, deterministic ability rankings, or career exclusions. Every skill is modeled as an open developmental horizon that shifts with authentic practice.
        </p>
      </div>

      <!-- Rule 2: Zero False Precision -->
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
        <div class="w-8 h-8 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
          <CheckCircle2 class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-semibold text-ink">Zero False Precision</h3>
        <p class="text-ink-secondary leading-relaxed">
          We reject deceptive percentage readiness metrics (e.g. "74% fit"). Capabilities are expressed exclusively in qualitative developmental tiers: <em>Emerging</em>, <em>Developing</em>, and <em>Strong Foundation</em>.
        </p>
      </div>

      <!-- Rule 3: Low-Anxiety Architecture -->
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
        <div class="w-8 h-8 rounded-sm bg-positive/10 border border-positive/20 text-positive flex items-center justify-center">
          <ShieldAlert class="w-4 h-4" />
        </div>
        <h3 class="text-sm font-semibold text-ink">Low-Anxiety Testing</h3>
        <p class="text-ink-secondary leading-relaxed">
          Panic countdown timers and high-stakes 60-question marathons are eliminated. Adaptive check items calibrate dynamically, reaching high statistical confidence in 5 to 15 unpressured interactions.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. Quiet mentorship and Socratic dialogues. -->
  <section id="mentorship" class="scroll-mt-24 space-y-6">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
        <BrainCircuit class="w-3.5 h-3.5" />
        <span>Pedagogical Pillar 02</span>
      </div>
      <h2 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Quiet Mentorship & The Socratic Frontier
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
        AI should not think for children. Powered by Google ADK and Gemini API, our Socratic mentor guides cognitive discovery without ever handing out direct answers.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- The Socratic Move System -->
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-4">
        <h3 class="text-base font-semibold text-ink">The Socratic Move Engine</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          When a learner reaches an impasse, the mentor selects from four deliberate scaffolding moves rather than dispensing solutions:
        </p>
        <ul class="space-y-2 text-xs text-ink-secondary">
          <li class="p-3 rounded-sm bg-surface border border-border">
            <strong class="text-ink">1. Problem Decomposition:</strong> Breaking multi-variable challenges into isolated foundational steps.
          </li>
          <li class="p-3 rounded-sm bg-surface border border-border">
            <strong class="text-ink">2. Counter-Example Probing:</strong> Offering a simple edge case to help the student spot their own assumption.
          </li>
          <li class="p-3 rounded-sm bg-surface border border-border">
            <strong class="text-ink">3. Physical Analogy:</strong> Relating mathematical relations to tactile physical mechanics (levers, water flow, balance).
          </li>
          <li class="p-3 rounded-sm bg-surface border border-border">
            <strong class="text-ink">4. Metacognitive Reflection:</strong> Asking the learner to summarize their reasoning before attempting the next trial.
          </li>
        </ul>
      </div>

      <!-- Restrained AI Identity -->
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-4">
        <h3 class="text-base font-semibold text-ink">Restrained Guidance & Human Escalation</h3>
        <p class="text-xs text-ink-secondary leading-relaxed">
          We treat AI as a quiet laboratory instrument, not an entertainment spectacle. Every AI-assisted interaction conforms to strict pedagogical boundaries:
        </p>
        <div class="space-y-3 text-xs text-ink-secondary">
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-none bg-brand shrink-0 mt-1.5"></div>
            <div>
              <strong class="text-ink">Calibrated Visual Restraint:</strong> Distinct visual identification without glowing neon loops, cyber borders, or animated mascots.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-none bg-brand shrink-0 mt-1.5"></div>
            <div>
              <strong class="text-ink">Full Explainability:</strong> Contextual "Why?" disclosures accompany every suggestion so students understand the reasoning.
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div class="w-2 h-2 rounded-none bg-brand shrink-0 mt-1.5"></div>
            <div>
              <strong class="text-ink">Teacher Escalation:</strong> If a learner experiences persistent cognitive blockages, the system flags the moment directly to their teacher's triage queue.
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- 4. Institutional Governance & Human Safeguarding (Replacing Internal Design Rules) -->
  <section id="governance" class="scroll-mt-24 space-y-6">
    <div class="border-b border-border pb-4 space-y-2">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-surface border border-border text-[11px] font-mono uppercase tracking-wider text-brand">
        <Lock class="w-3.5 h-3.5" />
        <span>Governance & Trust</span>
      </div>
      <h2 class="font-heading font-medium text-2xl sm:text-3xl text-ink tracking-tight">
        Institutional Safeguarding & Evidence Governance
      </h2>
      <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-3xl">
        Every learner profile is protected by legal child data sovereignty, verified pedagogical rubrics, and strict human-in-the-loop accountability.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-2">
        <span class="text-[10px] font-mono uppercase text-brand font-semibold">Governance Law 01</span>
        <h3 class="text-sm font-semibold text-ink">Statutory Child Protection</h3>
        <p class="text-ink-secondary leading-relaxed">
          Strict DPDP Act 2023 alignment. Minors under 18 require verified parental consent before processing. Zero commercial advertising, zero third-party profiling, and guaranteed data portability.
        </p>
      </div>

      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-2">
        <span class="text-[10px] font-mono uppercase text-brand font-semibold">Governance Law 02</span>
        <h3 class="text-sm font-semibold text-ink">Sealed Evidence Provenance</h3>
        <p class="text-ink-secondary leading-relaxed">
          Every developmental claim maps directly to observable student artifacts across four tiers. Records are cryptographically sealed with SHA-256 hashes to prevent retroactive manipulation.
        </p>
      </div>

      <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-2">
        <span class="text-[10px] font-mono uppercase text-brand font-semibold">Governance Law 03</span>
        <h3 class="text-sm font-semibold text-ink">Educator-In-The-Loop</h3>
        <p class="text-ink-secondary leading-relaxed">
          AI suggests pedagogical scaffolds, but accredited educators hold final authority. High-stakes decisions always require human teacher and counselor sign-off.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. Action footer -->
  <section class="p-8 rounded-sm bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-medium text-ink">Support the Calm Education Movement</h3>
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
