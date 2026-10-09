<script lang="ts">
  import { ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-svelte';
</script>

<svelte:head>
  <title>For Families — CREED OS</title>
  <meta name="description" content="Warm, quiet developmental growth reports and shared horizon alignment for parents and guardians." />
</svelte:head>

<div class="space-y-20 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <ShieldCheck class="w-3.5 h-3.5 text-brand" />
      <span>Family Intelligence</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
      Understand your child's growth without the anxiety of ranks.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      A calm, editorial family space designed around strengths, active practice at home, and shared aspirations — never competitive percentiles or deterministic exclusions.
    </p>
  </header>

  <!-- 2. DECIDE: The 3 things parents care about -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-positive">Strengths</span>
      <h2 class="text-base font-semibold text-ink">What They Love Doing</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Concrete evidence of spatial visualization, algorithmic thinking, and scientific curiosities demonstrated in real projects.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-attention">Growth Focus</span>
      <h2 class="text-base font-semibold text-ink">What They're Practicing</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Targeted foundational milestones without labeling them as deficits. Just the next logical step in their personal journey.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <span class="text-xs font-semibold uppercase tracking-wider text-brand">At Home</span>
      <h2 class="text-base font-semibold text-ink">Simple Family Challenges</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Non-academic, conversational experiments like kitchen balance trials and mechanics checks to support learning naturally.
      </p>
    </div>
  </section>

  <!-- 3. ACT -->
  <section class="p-8 rounded-none bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-semibold text-ink">See How It Looks</h3>
      <p class="text-xs text-ink-secondary">View the parent experience for an active Class 8 learner.</p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <a
        href="/parent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors"
      >
        <span>Open Family Space</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/consent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-surface-subtle border border-border text-xs font-medium text-ink hover:bg-surface-raised transition-colors"
      >
        <span>Parental Consent</span>
      </a>
    </div>
  </section>
</div>
