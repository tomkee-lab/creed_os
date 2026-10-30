<script lang="ts">
  import WorkspaceHeader from '$lib/components/shell/WorkspaceHeader.svelte';
  import { Button, WaySection } from '$lib/components';
  import {
    ShieldCheck,
    Moon,
    Sun,
    Monitor,
    Bell,
    Download,
    Trash2,
    Sliders,
    Check,
    AlertTriangle,
    X
  } from 'lucide-svelte';

  let density = $state<'standard' | 'comfortable' | 'compact'>('standard');
  let emailNotifications = $state(true);
  let mentorVoiceRate = $state('normal');
  let savedStatus = $state(false);

  // 2-step confirmation state for data erasure
  let showErasureModal = $state(false);
  let erasureConfirmationText = $state('');
  let erasureStatus = $state<'idle' | 'submitting' | 'submitted'>('idle');


  function handleSave() {
    savedStatus = true;
    setTimeout(() => {
      savedStatus = false;
    }, 2000);
  }

  function handleInitiateErasure() {
    showErasureModal = true;
    erasureConfirmationText = '';
    erasureStatus = 'idle';
  }

  function handleConfirmErasure() {
    if (erasureConfirmationText !== 'ERASE') return;
    erasureStatus = 'submitting';
    setTimeout(() => {
      erasureStatus = 'submitted';
    }, 1200);
  }
</script>

<svelte:head>
  <title>Settings · CREED OS</title>
</svelte:head>

<div class="max-w-5xl mx-auto space-y-8 pb-16">
  <WorkspaceHeader
    title="Workspace Settings"
    description="Manage interface density, notification preferences, and privacy compliance parameters."
  >
    {#snippet actions()}
      <Button variant="primary" size="sm" onclick={handleSave}>
        {#if savedStatus}
          <Check class="w-3.5 h-3.5 mr-1" />
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
    <div class="p-6 bg-surface border border-border rounded-sm space-y-6">
      <div>
        <span class="block text-xs font-semibold text-foreground mb-2">Interface Density</span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {#each [
            { id: 'comfortable', label: 'Comfortable', desc: '56px rows, spacious reading rhythm' },
            { id: 'standard', label: 'Standard', desc: '44px rows, balanced editorial density' },
            { id: 'compact', label: 'Compact', desc: '36px rows, high-density data tables' }
          ] as opt}
            <button
              type="button"
              onclick={() => (density = opt.id as any)}
              class="p-3 text-left rounded-sm border transition-colors cursor-pointer {density === opt.id
                ? 'border-brand bg-brand-subtle/50 text-foreground font-semibold ring-1 ring-brand'
                : 'border-border bg-surface hover:bg-surface-raised text-foreground-secondary'}"
            >
              <div class="text-xs font-semibold text-foreground">{opt.label}</div>
              <div class="text-[11px] text-foreground-secondary mt-0.5">{opt.desc}</div>
            </button>
          {/each}
        </div>
      </div>

      <div class="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div class="space-y-0.5">
          <div class="text-xs font-semibold text-foreground">Lagom Motion & Animation</div>
          <div class="text-[11px] text-foreground-secondary">
            Enforces 140ms–280ms easing transitions. System <code class="font-mono text-[10px] bg-surface-raised px-1 py-0.5 rounded-xs">prefers-reduced-motion</code> automatically silences non-essential motion.
          </div>
        </div>
        <span class="text-xs font-mono px-2 py-1 rounded-sm bg-surface-raised border border-border text-foreground-secondary shrink-0">
          Standard · Respecting OS
        </span>
      </div>
    </div>
  </WaySection>

  <!-- Section 2: DPDP Act Privacy & Consent Governance -->
  <WaySection
    title="Privacy & Data Sovereignty"
    subtitle="Digital Personal Data Protection Act (DPDP 2023) governance and statutory consent status."
  >
    <div class="p-6 bg-surface border border-border rounded-sm space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div class="space-y-2 max-w-xl">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-4 h-4 text-positive shrink-0" />
            <span class="text-xs font-semibold text-foreground">Parental Verification Record</span>
          </div>
          <p class="text-xs text-foreground-secondary leading-relaxed">
            Guardian verification record registered in accordance with DPDP operational workflows. Guardian contact channel authenticated via secure SMS OTP challenge.
          </p>
          <div class="text-[11px] text-foreground-muted font-sans bg-surface-subtle p-2 border border-border rounded-xs space-y-1">
            <div class="flex items-center justify-between font-mono text-[10px] text-ink-secondary">
              <span>RECORD ID: CSR-881920-IN</span>
              <span>TOKEN: SHA256-e3b0c442...</span>
            </div>
            <div class="text-[10.5px] text-foreground-secondary">
              <strong>Workflow State:</strong> VERIFIED_ACTIVE · Valid through 14 Sep 2027
            </div>
            <p class="text-[10px] text-foreground-muted italic">
              Technical Notice: OTP verification was completed and recorded on file. This status confirms technical verification only and does not establish statutory legal sufficiency. Formal legal review remains pending under Gate 3.
            </p>
          </div>
        </div>
        <div class="flex flex-col sm:items-end gap-1.5 shrink-0">
          <span class="text-[11px] font-mono px-2 py-1 rounded-sm bg-positive-subtle text-positive border border-positive/20 font-semibold flex items-center gap-1">
            <span class="size-1.5 rounded-none bg-positive"></span>
            <span>VERIFIED_ACTIVE</span>
          </span>
          <span class="text-[10px] text-foreground-secondary font-mono">
            Channel: SMS OTP Authenticated
          </span>
          <span class="text-[9.5px] text-foreground-muted font-mono">
            Purposes: 3 Authorized
          </span>
        </div>
      </div>

      <div class="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold text-foreground">Export Learning Dossier</div>
          <div class="text-[11px] text-foreground-secondary">
            Download your verifiable competency records, mission submissions, and developmental trajectory in machine-readable JSON.
          </div>
        </div>
        <Button variant="outline" size="sm" class="rounded-sm">
          <Download class="w-3.5 h-3.5 mr-1" />
          Export JSON
        </Button>
      </div>

      <div class="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold text-critical">Statutory Right-to-be-Forgotten</div>
          <div class="text-[11px] text-foreground-secondary">
            Initiate formal account and diagnostic record erasure under DPDP Act Section 12.
          </div>
        </div>
        <Button variant="danger" size="sm" class="rounded-sm" onclick={handleInitiateErasure}>
          <Trash2 class="w-3.5 h-3.5 mr-1" />
          Request Erasure
        </Button>
      </div>
    </div>
  </WaySection>

  <!-- Section 3: Socratic Mentorship Constraints -->
  <WaySection
    title="Socratic Guide Parameters"
    subtitle="Configure pedagogical behavior and scoring isolation of the AI mentor."
  >
    <div class="p-6 bg-surface border border-border rounded-sm space-y-4">
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold text-foreground">Pedagogical Guardrails</div>
          <div class="text-[11px] text-foreground-secondary">
            Guided inquiry policy: AI mentor prompts with clarifying questions and hints, reserving direct solutions for self-discovery.
          </div>
        </div>
        <span class="text-xs font-mono px-2 py-0.5 rounded-sm bg-brand-subtle text-brand border border-brand/20 font-semibold shrink-0">
          Enforced
        </span>
      </div>

      <div class="pt-4 border-t border-border flex items-center justify-between gap-4">
        <div>
          <div class="text-xs font-semibold text-foreground">Deterministic Scoring Isolation</div>
          <div class="text-[11px] text-foreground-secondary">
            Scoring invariant: LLMs guide and explain; psychometric algorithms (3PL IRT / CAT) compute all scores.
          </div>
        </div>
        <span class="text-xs font-mono px-2 py-0.5 rounded-sm bg-surface-raised text-foreground-secondary border border-border font-semibold shrink-0">
          Active
        </span>
      </div>
    </div>
  </WaySection>

</div>

<!-- 2-STEP DATA ERASURE CONFIRMATION MODAL -->
{#if showErasureModal}
  <div class="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
    <div class="bg-surface border border-border rounded-sm max-w-md w-full p-6 space-y-5 shadow-lg animate-in fade-in zoom-in-95 duration-150">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-2 text-critical font-bold text-sm">
          <AlertTriangle class="w-5 h-5 shrink-0" />
          <span>Confirm Data Erasure Request</span>
        </div>
        <button
          onclick={() => (showErasureModal = false)}
          class="text-foreground-secondary hover:text-foreground cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      {#if erasureStatus === 'submitted'}
        <div class="p-4 bg-positive-subtle border border-positive/30 rounded-sm space-y-2 text-xs">
          <div class="font-semibold text-positive flex items-center gap-1.5">
            <Check class="w-4 h-4" />
            <span>Erasure Request Dispatched</span>
          </div>
          <p class="text-foreground-secondary">
            Your request (Ticket #ERASE-{Math.floor(100000 + Math.random() * 900000)}) has been logged. In accordance with DPDP Act timelines, a confirmation link has been sent to the verified guardian contact. Active profile processing is suspended.
          </p>
          <div class="pt-2 flex justify-end">
            <Button size="sm" variant="outline" onclick={() => (showErasureModal = false)}>
              Close
            </Button>
          </div>
        </div>
      {:else}
        <div class="space-y-3 text-xs text-foreground-secondary leading-relaxed">
          <p>
            You are requesting permanent erasure of learner records, diagnostic histories, and developmental profiles.
          </p>
          <div class="p-3 bg-critical-subtle/50 border border-critical/30 rounded-sm text-[11px] text-foreground">
            <strong>Legal Notice:</strong> Active operational accounts and competency profiles will be permanently erased. Statutory financial transaction logs and tamper-evident cryptographic ledgers will be quarantined under applicable statutory retention policies.
          </div>
          <div class="space-y-1.5 pt-2">
            <label for="erasure-input" class="text-xs font-semibold text-foreground block">
              Type <span class="font-mono text-critical font-bold">ERASE</span> to confirm:
            </label>
            <input
              id="erasure-input"
              type="text"
              bind:value={erasureConfirmationText}
              placeholder="ERASE"
              class="w-full px-3 py-2 bg-surface-raised border border-border rounded-sm text-xs font-mono text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-critical focus-visible:ring-offset-1 focus-visible:border-critical transition-colors"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onclick={() => (showErasureModal = false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={erasureConfirmationText !== 'ERASE' || erasureStatus === 'submitting'}
            onclick={handleConfirmErasure}
          >
            {#if erasureStatus === 'submitting'}
              Submitting Request...
            {:else}
              Confirm Erasure
            {/if}
          </Button>
        </div>
      {/if}
    </div>
  </div>
{/if}
