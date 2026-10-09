<script lang="ts">
  import { ArrowRight, GraduationCap, Users, FileText, CheckCircle2 } from 'lucide-svelte';
</script>

<svelte:head>
  <title>For Schools & Institutes — CREED OS</title>
  <meta name="description" content="High-density educator workspaces, classroom observation logging, and longitudinal intelligence." />
</svelte:head>

<div class="space-y-20 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-surface border border-border text-xs text-ink-secondary">
      <GraduationCap class="w-3.5 h-3.5 text-brand" />
      <span>Institutional Intelligence</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-semibold tracking-tight text-ink leading-tight">
      Empower teachers with action-first intelligence.
    </h1>
    <p class="text-base text-ink-secondary leading-relaxed">
      Replace administrative paperwork with a quiet, high-density educator workspace that highlights priority interventions, longitudinal growth, and classroom observations.
    </p>
  </header>

  <!-- 2. DECIDE: Institutional capabilities -->
  <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <h2 class="text-base font-semibold text-ink">Classroom Intervention Queues</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Teachers see groups needing attention first, with 1-click targeted scaffolds ready to assign to student practice queues in seconds.
      </p>
    </div>
    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <h2 class="text-base font-semibold text-ink">Direct Classroom Observation Sheets</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Log qualitative hands-on demonstration rubrics into the learner's longitudinal record via a focused right-side drawer without page reloads.
      </p>
    </div>
    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <h2 class="text-base font-semibold text-ink">Counselor Case Management</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Prioritize students navigating pathway dilemmas or accelerated trajectories with longitudinal evidence bases and consultation scheduling.
      </p>
    </div>
    <div class="p-6 rounded-none bg-surface border border-border space-y-3">
      <h2 class="text-base font-semibold text-ink">Multi-Tenant Consent & Audit Trail</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Complete DPDP Act governance with verified parental consent tracking, role-scoped RLS policies, and immutable diagnostic logs.
      </p>
    </div>
  </section>

  <!-- 3. ACT -->
  <section class="p-8 rounded-none bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-semibold text-ink">Ready to Pilot CREED OS?</h3>
      <p class="text-xs text-ink-secondary">Schedule an institutional briefing or inspect the live teacher workspace.</p>
    </div>
    <div class="flex items-center gap-3 shrink-0">
      <a
        href="/teacher"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors"
      >
        <span>Open Teacher Workspace</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/admin"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-none bg-surface-subtle border border-border text-xs font-medium text-ink hover:bg-surface-raised transition-colors"
      >
        <span>Admin Console</span>
      </a>
    </div>
  </section>
</div>
