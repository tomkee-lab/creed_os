<script lang="ts">
  import WorkspaceHeader from '$lib/components/shell/WorkspaceHeader.svelte';
  import WaySection from '$lib/components/WaySection.svelte';
  import Button from '$lib/components/Button.svelte';
  import { ShieldCheck, Moon, Sun, Monitor, Bell, Download, Trash2, Sliders, Check } from 'lucide-svelte';

  let density = $state<'standard' | 'comfortable' | 'compact'>('standard');
  let emailNotifications = $state(true);
  let mentorVoiceRate = $state('normal');
  let savedStatus = $state(false);

  function handleSave() {
    savedStatus = true;
    setTimeout(() => {
      savedStatus = false;
    }, 2000);
  }
</script>

<svelte:head>
  <title>Settings — CREED OS</title>
</svelte:head>

<div class="max-w-4xl mx-auto space-y-8">
  <WorkspaceHeader
    title="Workspace Settings"
    description="Manage interface density, notification preferences, and privacy compliance parameters."
  >
    {#snippet actions()}
      <Button variant="primary" size="sm" onclick={handleSave}>
        {#if savedStatus}
          <Check class="w-3.5 h-3.5 mr-1 text-ink-inverse" />
          Saved
        {:else}
          Save Preferences
        {/if}
      </Button>
    {/snippet}
  </WorkspaceHeader>

  <!-- Section 1: Display & Density Ergonomics -->
  <WaySection
    title="Display & Ergonomics"
    subtitle="Calibrate visual pacing and vertical density for comfortable working sessions."
  >
    <div class="p-6 bg-surface-raised border border-border rounded-none space-y-6">
      <div>
        <span class="block text-xs font-semibold text-ink mb-2">Interface Density</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {#each [
            { id: 'comfortable', label: 'Comfortable', desc: '56px rows, spacious reading rhythm' },
            { id: 'standard', label: 'Standard', desc: '44px rows, balanced editorial density' },
            { id: 'compact', label: 'Compact', desc: '36px rows, maximum data overview' }
          ] as opt}
            <button
              type="button"
              onclick={() => (density = opt.id as any)}
              class="p-3 text-left rounded-none border transition-colors cursor-pointer {density === opt.id
                ? 'border-brand bg-brand-subtle/50 text-ink'
                : 'border-border bg-surface hover:bg-surface-subtle text-ink-secondary'}"
            >
              <div class="text-xs font-semibold">{opt.label}</div>
              <div class="text-[11px] text-ink-muted mt-0.5">{opt.desc}</div>
            </button>
          {/each}
        </div>
      </div>

      <div class="pt-4 border-t border-border flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-ink">Lagom Motion & Animation</div>
          <div class="text-[11px] text-ink-secondary">Enforces calibrated 140ms–280ms easing transitions.</div>
        </div>
        <span class="text-xs font-mono px-2 py-0.5 rounded-none bg-surface-subtle border border-border text-ink-muted">
          Active (Standard)
        </span>
      </div>
    </div>
  </WaySection>

  <!-- Section 2: DPDP Act Privacy & Consent Governance -->
  <WaySection
    title="Privacy & Data Sovereignty"
    subtitle="Digital Personal Data Protection Act compliance and learner data management."
  >
    <div class="p-6 bg-surface-raised border border-border rounded-none space-y-6">
      <div class="flex items-start justify-between gap-4">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-positive" />
            <span class="text-xs font-semibold text-ink">Verified Parental Consent Status</span>
          </div>
          <p class="text-xs text-ink-secondary">
            Verified by OTP handshake under DPDP Act 2023 for minor accounts under 18 years.
          </p>
        </div>
        <span class="text-[11px] font-mono px-2 py-0.5 rounded-none bg-positive-subtle text-positive border border-positive/20 shrink-0">
          COMPLIANT · VERIFIED
        </span>
      </div>

      <div class="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold text-ink">Export Learning Dossier</div>
          <div class="text-[11px] text-ink-secondary">Download complete cryptographic competency portfolio in machine-readable JSON.</div>
        </div>
        <Button variant="outline" size="sm">
          <Download class="w-3.5 h-3.5 mr-1 text-ink-muted" />
          Export JSON
        </Button>
      </div>

      <div class="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold text-critical">Data Erasure Request</div>
          <div class="text-[11px] text-ink-secondary">Initiate formal DPDP Act right-to-be-forgotten verification pipeline.</div>
        </div>
        <Button variant="danger" size="sm">
          <Trash2 class="w-3.5 h-3.5 mr-1" />
          Request Erasure
        </Button>
      </div>
    </div>
  </WaySection>

  <!-- Section 3: Socratic Mentorship Constraints -->
  <WaySection
    title="Socratic Guide Parameters"
    subtitle="Configure the conversational behavior of the AI mentor."
  >
    <div class="p-6 bg-surface-raised border border-border rounded-none space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-ink">Pedagogical Guardrails</div>
          <div class="text-[11px] text-ink-secondary">Strictly answers with clarifying questions, never reveals direct answers.</div>
        </div>
        <span class="text-xs font-mono px-2 py-0.5 rounded-none bg-brand-subtle text-brand border border-brand/20">
          Enforced
        </span>
      </div>

      <div class="pt-4 border-t border-border flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-ink">Deterministic Scoring Isolation</div>
          <div class="text-[11px] text-ink-secondary">AI models explain and mentor; psychometric IRT engines score.</div>
        </div>
        <span class="text-xs font-mono px-2 py-0.5 rounded-none bg-surface-subtle text-ink-muted border border-border">
          Active
        </span>
      </div>
    </div>
  </WaySection>
</div>
