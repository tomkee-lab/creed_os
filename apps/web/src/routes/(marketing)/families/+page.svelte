<script lang="ts">
  import {
    ArrowRight,
    ShieldCheck,
    Heart,
    Sparkles,
    CheckCircle2,
    Lock,
    Compass,
    Home,
    Activity
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title>For Families — CREED OS</title>
  <meta
    name="description"
    content="Warm, quiet developmental growth reports, home exploratory experiments, and shared horizon alignment for parents and guardians."
  />
</svelte:head>

<div class="space-y-24 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Family Master Header -->
  <header class="space-y-6 text-center max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <ShieldCheck class="w-3.5 h-3.5 text-brand" />
      <span class="font-mono uppercase tracking-wider text-[11px]">Family Intelligence · WAY 3.0</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-ink leading-tight">
      Understand your child's growth without the anxiety of ranks.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      A calm, editorial family space designed around observable strengths, active practice at home, and shared aspirations — never competitive percentiles or deterministic exclusions.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a
        href="/login?next=%2Fparent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Open Parent Portal</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/consent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Parental Consent Hub</span>
      </a>
    </div>
  </header>

  <!-- 2. DECIDE: The Three Things Parents Care About -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-positive font-mono">Observable Strengths</span>
        <CheckCircle2 class="w-4 h-4 text-positive" />
      </div>
      <h2 class="text-base font-semibold text-ink">What They Love Doing</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Concrete evidence of spatial visualization, computational thinking, and scientific curiosities demonstrated in real projects — not standardized multiple-choice trivia.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-attention font-mono">Developmental Focus</span>
        <Activity class="w-4 h-4 text-attention" />
      </div>
      <h2 class="text-base font-semibold text-ink">What They're Practicing</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Targeted foundational milestones without labeling them as deficits. Just the next logical step in their personal journey with zero false-precision percentage rankings.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wider text-brand font-mono">At-Home Learning</span>
        <Home class="w-4 h-4 text-brand" />
      </div>
      <h2 class="text-base font-semibold text-ink">Simple Family Challenges</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Non-academic, conversational experiments like kitchen balance trials, gear ratios, and mechanics checks to support learning naturally around the dinner table.
      </p>
    </div>
  </section>

  <!-- 3. TRUST: DPDP Child Data Sovereignty Guarantee -->
  <section class="p-8 rounded-none bg-surface-raised border border-border space-y-4">
    <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-mint">
      <Lock class="w-4 h-4" />
      <span>Child Privacy Sovereignty</span>
    </div>
    <h3 class="text-lg font-heading font-semibold text-ink">Your Family's Data Belongs Exclusively to You</h3>
    <p class="text-xs text-ink-secondary leading-relaxed max-w-3xl">
      Under India's DPDP Act 2023, children are not commercial products. Your child's assessments are protected by relationship-scoped Row Level Security, meaning only you and their verified teacher can access their records. Zero ads, zero tracking, and 1-click consent revocation.
    </p>
  </section>

  <!-- 4. ACT: Experience Call to Action -->
  <section class="p-8 rounded-none bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-semibold text-ink">See What Calm Family Growth Looks Like</h3>
      <p class="text-xs text-ink-secondary">View the live Parent Portal experience for an active Class 8 learner.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/login?next=%2Fparent"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Open Parent Portal</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/consent#dpdp"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Inspect DPDP Compliance</span>
      </a>
    </div>
  </section>
</div>
