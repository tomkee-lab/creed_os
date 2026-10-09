<script lang="ts">
  import { ArrowRight, CheckCircle2, Shield, BrainCircuit, Activity, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Platform Architecture — CREED OS</title>
  <meta name="description" content="Deterministic psychometric scoring, longitudinal evidence architecture, and child-safe AI mentorship." />
</svelte:head>

<div class="space-y-20 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Single Purpose Editorial Header -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <BrainCircuit class="w-3.5 h-3.5 text-brand" />
      <span>Architecture & Principles</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
      Deterministic algorithms score. AI explains. Humans decide.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      CREED OS replaces probabilistic black-box grading with verified longitudinal psychometrics, ensuring no child is ever assigned fixed labels or permanent career exclusions.
    </p>
  </header>

  <!-- 2. DECIDE: The Three Core Architectural Pillars -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-brand-subtle flex items-center justify-center text-brand">
        <Activity class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Deterministic Psychometrics</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Ability estimates are computed strictly by deterministic CAT/3PL-IRT models, never unconstrained LLMs. Every calculation maintains statistical provenance.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-ai-subtle flex items-center justify-center text-ai">
        <Sparkles class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Restrained Socratic Mentorship</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Google ADK powered guided thinking focuses on decomposition and active reasoning moves, never dispensing direct answers or judgmental evaluations.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-positive-subtle flex items-center justify-center text-positive">
        <Shield class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Child Safety by Design</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Full DPDP Act alignment, verified parental consent state machine, and relationship-scoped Row Level Security guarantee absolute data privacy.
      </p>
    </div>
  </section>

  <!-- 3. ACT: Call to action -->
  <section class="p-8 rounded-none bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-semibold text-ink">Experience the Platform</h3>
      <p class="text-xs text-ink-secondary">Explore role-specific workspaces designed for students, families, and educators.</p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <a
        href="/student"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors"
      >
        <span>Explore Student Space</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/schools"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-surface-subtle border border-border text-xs font-medium text-ink hover:bg-surface-raised transition-colors"
      >
        <span>For Schools</span>
      </a>
    </div>
  </section>
</div>
