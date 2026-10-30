<script lang="ts">
  import {
    ArrowRight,
    Users,
    FileText,
    CheckCircle2,
    Shield,
    HeartPulse,
    Clock,
    Sliders,
    Layers,
    Calendar,
    Send
  } from 'lucide-svelte';

  let assignedSample = $state(false);
</script>

<svelte:head>
  <title>For Schools & Institutes · CREED OS</title>
  <meta
    name="description"
    content="High-density educator workspaces, classroom intervention queues, observation logging, and longitudinal learner intelligence."
  />
</svelte:head>

<div class="space-y-16 py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6">
  <!-- 1. ORIENT: Master Header -->
  <header class="space-y-4 text-center max-w-2xl mx-auto">
    <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface border border-border text-[11px] font-mono text-ink-secondary">
      <span>EDUCATOR WORKSPACES</span>
      <span class="text-border">·</span>
      <span class="text-brand font-semibold">WAY 2.1 CONSOLE</span>
    </div>
    <h1 class="font-heading font-medium text-3xl sm:text-4xl lg:text-[42px] text-ink tracking-tight leading-[1.15]">
      Equip educators with<br />
      <span class="text-brand">action-first intelligence.</span>
    </h1>
    <p class="text-xs sm:text-sm text-ink-secondary leading-relaxed max-w-xl mx-auto">
      Replace administrative paperwork and guesswork with high-density educator workspaces, prioritized classroom intervention queues, and direct observation logging.
    </p>

    <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
      <a
        href="/pricing#pilot"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Book a school pilot</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </a>
      <a
        href="/login?next=%2Fteacher"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-surface border border-border text-xs font-medium text-ink hover:border-brand transition-colors"
      >
        <span>Preview Teacher Workspace</span>
      </a>
    </div>
  </header>

  <!-- 2. HIGH DENSITY INTERVENTION QUEUE PREVIEW (The 10-Second Triage Job) -->
  <section class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border pb-3">
      <div>
        <span class="text-[11px] font-mono uppercase tracking-wider text-brand font-semibold">Cognitive Job: Triage & Scaffolding</span>
        <h2 class="font-heading font-medium text-xl text-ink tracking-tight">Morning Intervention Queue Preview</h2>
      </div>
      <div class="flex items-center gap-2 text-xs text-ink-muted font-mono">
        <Clock class="w-3.5 h-3.5 text-brand" />
        <span>Average Triage Time: &le; 10 seconds per cluster</span>
      </div>
    </div>

    <!-- Live Preview Table (0px structural frame, high density Carbon style) -->
    <div class="border border-border rounded-none bg-surface-raised overflow-hidden shadow-xs">
      <div class="p-3 bg-surface border-b border-border flex items-center justify-between text-xs">
        <div class="flex items-center gap-2 font-mono font-medium text-ink">
          <Users class="w-3.5 h-3.5 text-brand" />
          <span>Class 8B · Physical Sciences & Mechanics</span>
        </div>
        <span class="text-[11px] font-mono text-ink-muted">24 Active Learners</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-border bg-surface-subtle/60 text-ink-muted font-mono text-[11px]">
              <th class="py-2 px-4 font-normal">Identified Need</th>
              <th class="py-2 px-4 font-normal">Affected Cohort</th>
              <th class="py-2 px-4 font-normal">Evidence Provenance</th>
              <th class="py-2 px-4 font-normal text-right">Targeted Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr class="hover:bg-surface/50 transition-colors">
              <td class="py-3 px-4">
                <div class="font-medium text-ink">Kinematic Torque: Off-Center Fulcrum</div>
                <div class="text-[11px] text-ink-muted">3 learners miscalculating mechanical advantage</div>
              </td>
              <td class="py-3 px-4 font-mono text-ink-secondary">
                <span class="inline-flex items-center px-2 py-0.5 rounded-sm bg-attention/10 text-attention text-[10px] font-semibold">
                  3 Students
                </span>
              </td>
              <td class="py-3 px-4 font-mono text-ink-muted text-[11px]">
                Tier 2: Lever Simulation Lab
              </td>
              <td class="py-3 px-4 text-right">
                {#if assignedSample}
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm bg-positive/10 text-positive text-xs font-medium">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    <span>Scaffold Assigned</span>
                  </span>
                {:else}
                  <button
                    type="button"
                    onclick={() => assignedSample = true}
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand text-brand-foreground text-xs font-medium hover:bg-brand/90 transition-colors cursor-pointer"
                  >
                    <Send class="w-3 h-3" />
                    <span>Assign 10-Min Scaffold</span>
                  </button>
                {/if}
              </td>
            </tr>

            <tr class="hover:bg-surface/50 transition-colors">
              <td class="py-3 px-4">
                <div class="font-medium text-ink">Gear Ratios: Compound Speed Reduction</div>
                <div class="text-[11px] text-ink-muted">Ready for advanced 3-stage mechanical challenge</div>
              </td>
              <td class="py-3 px-4 font-mono text-ink-secondary">
                <span class="inline-flex items-center px-2 py-0.5 rounded-sm bg-brand/10 text-brand text-[10px] font-semibold">
                  5 Students
                </span>
              </td>
              <td class="py-3 px-4 font-mono text-ink-muted text-[11px]">
                Tier 4: Rover Gearbox Build
              </td>
              <td class="py-3 px-4 text-right">
                <span class="inline-flex items-center px-3 py-1.5 rounded-sm bg-surface border border-border text-ink-secondary text-xs">
                  Autonomous Track
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 3. DECIDE: Institutional Pillars -->
  <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
        <Users class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Classroom Intervention Queues</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Teachers see clusters needing immediate scaffolding first. Assign targeted 1-click exercises to student practice queues in seconds without manual grading overhead.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
        <FileText class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Direct Classroom Observation Sheets</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Log qualitative hands-on demonstration rubrics into the learner's longitudinal record via a focused right-side drawer during lab experiments without page reloads.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center">
        <HeartPulse class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Counselor Advisory & Caseload Triage</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Identify pathway dilemmas and accelerated trajectories with longitudinal multi-tier evidence bases, enabling dignified, evidence-grounded guidance.
      </p>
    </div>

    <div class="p-6 rounded-sm bg-surface-raised border border-border space-y-3">
      <div class="w-8 h-8 rounded-sm bg-positive/10 border border-positive/20 text-positive flex items-center justify-center">
        <Shield class="w-4 h-4" />
      </div>
      <h2 class="text-base font-semibold text-ink">Multi-Tenant Consent & Audit Trail</h2>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Statutory DPDP Act 2023 alignment with verified parental consent tracking, role-scoped Row Level Security policies, and exportable immutable audit logs.
      </p>
    </div>
  </section>

  <!-- 4. WORKFLOW: The Educator Operating Loop -->
  <section class="p-8 rounded-sm bg-surface-raised border border-border space-y-6">
    <div class="space-y-1">
      <span class="text-xs font-mono uppercase text-brand tracking-wider font-semibold">Operational Rhythm</span>
      <h3 class="text-lg font-heading font-medium text-ink">How Classrooms Run on CREED OS</h3>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
      <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">01 · MORNING ORIENTATION</span>
        <h4 class="font-semibold text-ink">Scan Intervention Clusters</h4>
        <p class="text-ink-secondary leading-relaxed">
          Educators open Teacher Copilot to see which cohorts need support on foundational concepts before direct instruction begins.
        </p>
      </div>

      <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">02 · LAB DEMONSTRATION</span>
        <h4 class="font-semibold text-ink">Log Hands-on Rubrics</h4>
        <p class="text-ink-secondary leading-relaxed">
          During kinematics and robotics trials, teachers tap "Log Observation" to stamp Tier 3 evidence directly into the student portfolio.
        </p>
      </div>

      <div class="p-4 rounded-sm bg-surface border border-border space-y-2">
        <span class="text-[10px] font-mono font-semibold text-brand">03 · FAMILY SYNC</span>
        <h4 class="font-semibold text-ink">Share Growth Without Ranks</h4>
        <p class="text-ink-secondary leading-relaxed">
          Parents receive calm, non-punitive developmental milestones and at-home experiment prompts aligned with the curriculum.
        </p>
      </div>
    </div>
  </section>

  <!-- 5. ACT: Pilot Briefing Call to Action -->
  <section class="p-8 rounded-sm bg-surface-raised border border-border flex flex-col sm:flex-row items-center justify-between gap-6">
    <div class="space-y-1 text-center sm:text-left">
      <h3 class="text-lg font-heading font-medium text-ink">Ready to Pilot CREED OS in Your School?</h3>
      <p class="text-xs text-ink-secondary">Schedule an institutional pilot or test the live teacher workspace.</p>
    </div>
    <div class="flex flex-wrap items-center gap-3 shrink-0">
      <a
        href="/pricing#pilot"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-sm bg-brand text-brand-foreground text-xs font-semibold hover:bg-brand/90 transition-colors shadow-xs"
      >
        <span>Book a school pilot</span>
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
