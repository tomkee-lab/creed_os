<script lang="ts">
  import {
    ArrowRight,
    GraduationCap,
    Users,
    FileText,
    CheckCircle2,
    Shield,
    HeartPulse,
    Layers,
    Clock,
    Sigma
  } from 'lucide-svelte';
</script>

<svelte:head>
  <title> · </title>
  <meta
    name="description"
    content="High-density educator workspaces, classroom observation logging, counselor advisory, and longitudinal intelligence."
  />
</svelte:head>

<div class="space-y-24 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Master Header -->
  <header class="space-y-6 text-center max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <GraduationCap class="w-3.5 h-3.5 text-brand" />
      <span class="font-mono uppercase tracking-wider text-[11px]">Institutional Intelligence · WAY 3.0</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-heading font-semibold tracking-tight text-ink leading-tight">
      Equip educators with action-first intelligence.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      Replace administrative paperwork and blind guesswork with high-density educator workspaces, prioritized classroom intervention queues, and direct observation logging.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a
        href="/login?next=%2Fteacher"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Open Teacher Copilot</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/login?next=%2Fadmin"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Admin Console</span>
      </a>
    </div>
  </header>

  <!-- 2. DECIDE: Institutional Pillars -->
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
        <Users class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Classroom Intervention Queues</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Teachers see clusters needing immediate scaffolding first. Assign targeted 1-click exercises to student practice queues in seconds without manual grading overhead.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-mint/10 border border-mint/20 text-mint flex items-center justify-center">
        <FileText class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Direct Classroom Observation Sheets</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Log qualitative hands-on demonstration rubrics into the learner's longitudinal record via a focused right-side drawer during lab experiments without page reloads.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-ai/10 border border-ai/20 text-ai flex items-center justify-center">
        <HeartPulse class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Counselor Advisory & Caseload Triage</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Identify pathway dilemmas and accelerated trajectories with longitudinal multi-tier evidence bases, enabling dignified, evidence-grounded career counseling.
      </p>
    </div>

    <div class="p-6 rounded-none bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-none bg-positive/10 border border-positive/20 text-positive flex items-center justify-center">
        <Shield class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Multi-Tenant Consent & Audit Trail</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Statutory DPDP Act 2023 alignment with verified parental consent tracking, role-scoped Row Level Security policies, and exportable immutable audit logs.
      </p>
    </div>
  </section>

  <!-- 3. WORKFLOW: The Educator Operating Loop -->
  <section class="p-8 rounded-none bg-surface-raised border border-border space-y-6">
    <div class="space-y-1">
      <span class="text-xs font-mono uppercase text-brand tracking-wider">Operational Rhythm</span>
      <h3 class="text-lg font-heading font-semibold text-ink">How Classrooms Run on CREED OS</h3>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div class="p-4 rounded-none bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">01 · MORNING ORIENTATION</span>
        <h4 class="font-semibold text-ink">Scan Intervention Clusters</h4>
        <p class="text-ink-secondary leading-relaxed">
          Educators open Teacher Copilot to see which cohorts need support on proportional equations before direct instruction begins.
        </p>
      </div>

      <div class="p-4 rounded-none bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-mint">02 · LAB DEMONSTRATION</span>
        <h4 class="font-semibold text-ink">Log Hands-on Rubrics</h4>
        <p class="text-ink-secondary leading-relaxed">
          During kinematics and robotics trials, teachers tap "Log Observation" to stamp Level 3 evidence directly into the student portfolio.
        </p>
      </div>

      <div class="p-4 rounded-none bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-ai">03 · FAMILY SYNC</span>
        <h4 class="font-semibold text-ink">Share Growth Without Ranks</h4>
        <p class="text-ink-secondary leading-relaxed">
          Parents receive calm, non-punitive developmental milestones and at-home experiment prompts aligned with school curriculum.
        </p>
      </div>
    </div>
  </section>

  <!-- 4. ACT: Pilot Briefing Call to Action -->
  <section class="p-8 rounded-none bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-semibold text-ink">Ready to Pilot CREED OS in Your School?</h3>
      <p class="text-xs text-ink-secondary">Schedule an institutional briefing or inspect the live teacher workspace.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/login?next=%2Fteacher"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Open Teacher Workspace</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/pricing"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Pricing & Plans</span>
      </a>
    </div>
  </section>
</div>
