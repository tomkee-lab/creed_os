<script lang="ts">
  import { ArrowRight, Compass, ShieldCheck } from 'lucide-svelte';
</script>

<svelte:head>
  <title>About CREED OS — Educational Mission</title>
  <meta name="description" content="Evidence before inference, growth before labeling, and quiet editorial workspace design." />
</svelte:head>

<div class="space-y-20 py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6">
  <header class="space-y-4 text-center">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-surface border border-border text-xs text-ink-secondary">
      <Compass class="w-3.5 h-3.5 text-brand" />
      <span>Our Philosophy</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
      Growth before labeling.<br />Evidence before inference.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed max-w-xl mx-auto">
      CREED was founded on a simple conviction: technology in education should calm anxiety, clarify next actions, and respect human dignity.
    </p>
  </header>

  <section class="space-y-8 text-sm text-ink-secondary leading-relaxed">
    <div class="p-6 rounded-sm bg-surface border border-border space-y-2">
      <h2 class="text-base font-semibold text-ink">1. Deterministic Scoring, Human Decisions</h2>
      <p>
        AI is exceptional at contextual explanations and Socratic questioning. But psychometric scoring of children's foundational competencies must be deterministic, transparent, and governed by established IRT models.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface border border-border space-y-2">
      <h2 class="text-base font-semibold text-ink">2. Quiet Editorial Design</h2>
      <p>
        We reject the hyper-gamified, neon, notification-saturated interfaces common in modern EdTech. Learners deserve focused, dignified environments inspired by Nordic restraint and architectural discipline.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface border border-border space-y-2">
      <h2 class="text-base font-semibold text-ink">3. Child Safety & Privacy Sovereignty</h2>
      <p>
        Children are not training data. Under the DPDP Act 2023, parental consent is verified before diagnostics commence, and data is guarded by strict relationship-scoped Row Level Security policies.
      </p>
    </div>
  </section>

  <section class="text-center pt-8 border-t border-border">
    <a
      href="/"
      class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 transition-colors"
    >
      <span>Back to Homepage</span>
      <ArrowRight class="w-3.5 h-3.5" />
    </a>
  </section>
</div>
