<script lang="ts">
  import { ArrowRight, Check, Shield, Sparkles, Building2, User } from 'lucide-svelte';
</script>

<svelte:head>
  <title>Pricing & Plans — CREED OS</title>
  <meta
    name="description"
    content="Transparent institutional pilots and free portable family tiers for CREED OS learner intelligence."
  />
</svelte:head>

<div class="space-y-24 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Master Header -->
  <header class="space-y-6 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <Sparkles class="w-3.5 h-3.5 text-brand" />
      <span class="font-mono uppercase tracking-wider text-[11px]">Honest Value · WAY 3.0</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-ink leading-tight">
      Transparent, ethical intelligence.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      No hidden ad tiers. No behavioral monetization. Just pure, child-safe learner intelligence and verified psychometrics.
    </p>
  </header>

  <!-- 2. PRICING MATRIX -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
    <!-- Family Plan -->
    <div class="p-8 rounded-none bg-surface-raised border border-border flex flex-col justify-between space-y-8">
      <div class="space-y-6">
        <div class="space-y-1 border-b border-border pb-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-brand font-mono">Family Tier</span>
            <User class="w-4 h-4 text-brand" />
          </div>
          <h2 class="text-2xl font-heading font-bold text-ink">Free & Portable</h2>
          <p class="text-xs text-ink-secondary">Lifelong learner record owned by the student & legal guardian.</p>
        </div>

        <ul class="space-y-3 text-xs text-ink-secondary">
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Complete Learner Observatory profile</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Socratic Guided Thinking Studio (Google ADK & Gemini powered)</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Applied maker missions & kinematic physics labs</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>DPDP Act 2023 verified parental consent encryption</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Zero advertising, zero tracking, and zero data monetization</span>
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
    <div class="p-8 rounded-none bg-surface-raised border border-border flex flex-col justify-between space-y-8 relative">
      <div class="space-y-6">
        <div class="space-y-1 border-b border-border pb-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wider text-brand font-mono">Institutions</span>
            <Building2 class="w-4 h-4 text-brand" />
          </div>
          <h2 class="text-2xl font-heading font-bold text-ink">School Pilot</h2>
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
            <span>Counselor caseload management & evidence trajectory review</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Multi-tenant Row Level Security & statutory DPDP audit exports</span>
          </li>
          <li class="flex items-center gap-2">
            <Check class="w-3.5 h-3.5 text-positive shrink-0" />
            <span>Item Studio workbench with QTI 3.0 psychometric item authoring</span>
          </li>
        </ul>
      </div>

      <a
        href="/schools"
        class="w-full text-center py-2 px-4 rounded-sm bg-brand hover:bg-brand/90 text-brand-foreground text-xs font-semibold transition-colors shadow-xs cursor-pointer"
      >
        <span>Inquire for Institutional Pilot</span>
      </a>
    </div>
  </div>
</div>
