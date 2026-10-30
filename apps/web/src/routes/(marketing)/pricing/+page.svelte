<script lang="ts">
  import { ArrowRight, Check, Shield, Building2, User, Sparkles, Clock, CheckCircle2 } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Pricing & Plans · CREED OS</title>
  <meta
    name="description"
    content="Transparent institutional pilots and free portable family tiers for CREED OS learner intelligence."
  />
</svelte:head>

<div class="space-y-16 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Master Header -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface border border-border text-[11px] font-mono text-ink-secondary">
      <span>TRANSPARENT COMMITMENT</span>
      <span class="text-border">·</span>
      <span class="text-brand font-semibold">CHILD-SAFE TIERS</span>
    </div>
    <h1 class="font-heading font-medium text-3xl sm:text-4xl lg:text-[42px] text-ink tracking-tight leading-[1.15]">
      Transparent, ethical<br />
      <span class="text-brand">learner intelligence.</span>
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto">
      Child-safe intelligence and verified psychometrics with zero advertising, zero behavioral profiling, and complete data sovereignty.
    </p>
  </header>

  <!-- 2. HOW A SCHOOL PILOT BEGINS (3-Step Roadmap) -->
  <section id="pilot" class="scroll-mt-24 space-y-4">
    <div class="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
      <div>
        <span class="text-[11px] font-mono uppercase tracking-wider text-brand font-semibold">Onboarding Process</span>
        <h2 class="font-heading font-medium text-xl text-ink tracking-tight">How an Institutional Pilot Begins</h2>
      </div>
      <span class="text-xs text-ink-muted font-mono">Simple, 3-Step Setup</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">STEP 01</span>
        <h3 class="font-heading font-semibold text-sm text-ink">Cohort Selection</h3>
        <p class="text-ink-secondary leading-relaxed">
          Select 1 to 2 grade cohorts (e.g. Class 7 and 8 science and mathematics, up to 100 learners) to test targeted missions.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">STEP 02</span>
        <h3 class="font-heading font-semibold text-sm text-ink">Verified Digital Consent</h3>
        <p class="text-ink-secondary leading-relaxed">
          Educator accounts are provisioned; legal guardians grant DPDP-compliant verified consent via digital link in under 60 seconds.
        </p>
      </div>

      <div class="p-5 rounded-sm bg-surface-raised border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">STEP 03</span>
        <h3 class="font-heading font-semibold text-sm text-ink">30-Day Classroom Trial</h3>
        <p class="text-ink-secondary leading-relaxed">
          Teachers run 20-minute daily missions, access morning intervention triage, and review longitudinal growth portfolios.
        </p>
      </div>
    </div>
  </section>

  <!-- 3. PRICING MATRIX -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
    <!-- Family Plan -->
    <div class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border flex flex-col justify-between space-y-6">
      <div class="space-y-5">
        <div class="space-y-1 border-b border-border pb-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-brand font-mono">Family Tier</span>
            <User class="w-4 h-4 text-brand" />
          </div>
          <h2 class="text-2xl font-heading font-medium text-ink">Free & Portable</h2>
          <p class="text-xs text-ink-secondary">Lifelong learner record owned by the student and legal guardian.</p>
        </div>

        <ul class="space-y-3 text-xs text-ink-secondary">
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Complete Learner Observatory growth profile</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Socratic Guided Thinking Studio with quiet hints</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Applied maker missions and kinematic physics labs</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>DPDP Act 2023 verified parental consent encryption</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Zero advertising, zero tracking, zero commercial monetization</span>
          </li>
        </ul>
      </div>

      <a
        href="/login?next=%2Fparent"
        class="w-full text-center py-2 px-4 rounded-sm bg-surface-subtle hover:bg-surface border border-border text-xs font-semibold text-ink transition-colors cursor-pointer"
      >
        <span>Explore Parent Portal</span>
      </a>
    </div>

    <!-- School / Institutional Plan -->
    <div class="p-6 sm:p-8 rounded-sm bg-surface-raised border border-border flex flex-col justify-between space-y-6 relative">
      <div class="space-y-5">
        <div class="space-y-1 border-b border-border pb-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-brand font-mono">Institutions</span>
            <Building2 class="w-4 h-4 text-brand" />
          </div>
          <h2 class="text-2xl font-heading font-medium text-ink">School Pilot</h2>
          <p class="text-xs text-ink-secondary">Tailored for classrooms, academic counselors, and school leadership.</p>
        </div>

        <ul class="space-y-3 text-xs text-ink-secondary">
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>High-density Teacher Copilot & Classroom Intervention Queues</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>1-click targeted scaffolds ready to assign to practice queues</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Counselor caseload management and evidence trajectory review</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Multi-tenant Row Level Security and statutory DPDP audit exports</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Item Studio workbench for custom curriculum checks</span>
          </li>
        </ul>
      </div>

      <a
        href="/schools"
        class="w-full text-center py-2 px-4 rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-semibold transition-colors shadow-xs cursor-pointer"
      >
        <span>Book an Institutional Pilot</span>
      </a>
    </div>
  </div>

  <!-- Statutory Guarantee Footnote -->
  <div class="p-4 rounded-sm bg-surface border border-border text-center text-xs text-ink-muted max-w-2xl mx-auto space-y-1">
    <div class="font-medium text-ink">Statutory DPDP Child Protection Guarantee</div>
    <p>All minor profiles are governed by explicit verified parental consent. Portability is guaranteed under Section 9, India DPDP Act 2023.</p>
  </div>
</div>
