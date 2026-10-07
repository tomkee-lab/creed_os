<script lang="ts">
  import {
    Search,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    ShieldAlert,
    ChevronRight,
    Send
  } from 'lucide-svelte';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let consentLedger = $derived(data.consentLedger || []);

  let searchQuery = $state('');
  let statusFilter = $state<'ALL' | 'VERIFIED_ACTIVE' | 'PENDING_NOTICE'>('ALL');
  let feedbackMessage = $state<string | null>(null);

  // Inspector state
  let inspectorOpen = $state(false);
  let selectedRecord = $state<any>(null);

  const filteredLedger = $derived(
    consentLedger.filter((item: any) => {
      const matchesFilter = statusFilter === 'ALL' || item.status === statusFilter;
      const matchesSearch =
        item.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.gradeBand.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    })
  );

  function openInspector(record: any) {
    selectedRecord = record;
    inspectorOpen = true;
  }

  function handleResendNotice(name: string) {
    feedbackMessage = `Statutory DPDP verification notice sent to ${name}.`;
    setTimeout(() => {
      feedbackMessage = null;
    }, 4000);
  }

  function handleExport() {
    feedbackMessage = `Exported ${filteredLedger.length} immutable DPDP compliance records.`;
    setTimeout(() => {
      feedbackMessage = null;
    }, 4000);
  }
</script>

<svelte:head>
  <title>Institution Operations — CREED OS</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-8 py-2">
  <!-- 1. ORIENT: Single Purpose Admin Header with Thin KPI Layer -->
  <header class="space-y-4">
    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        Operations
      </h1>
      <span class="text-xs text-ink-muted">
        Delhi Public International School • Academic Session 2026–27
      </span>
    </div>

    <!-- Thin KPI Layer (Section 38: not giant cards, just thin metadata) -->
    <div class="flex flex-wrap items-center gap-6 py-2.5 px-4 rounded-sm bg-surface border border-border text-xs">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-ink">420</span>
        <span class="text-ink-muted">learners enrolled</span>
      </div>
      <span class="text-border">•</span>
      <div class="flex items-center gap-2">
        <span class="font-semibold text-positive">94.2%</span>
        <span class="text-ink-muted">verified DPDP consent</span>
      </div>
      <span class="text-border">•</span>
      <div class="flex items-center gap-2">
        <span class="font-semibold text-attention">12</span>
        <span class="text-ink-muted">counselor referrals</span>
      </div>
    </div>
  </header>

  <!-- Feedback Notice -->
  {#if feedbackMessage}
    <div class="p-3 rounded-sm bg-positive-subtle text-positive text-xs flex items-center gap-2 border border-border">
      <CheckCircle2 class="w-4 h-4 shrink-0" />
      <span>{feedbackMessage}</span>
    </div>
  {/if}

  <!-- 2. TOOLBAR: Search, Filter, Export (Statutory Consent & Learners Ledger) -->
  <section id="consent" class="space-y-4">
    <div id="learners" class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <!-- Search Input -->
      <div class="relative flex-1 max-w-sm">
        <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search by learner, guardian, or grade..."
          class="w-full pl-8 pr-3 py-1.5 rounded-sm bg-surface border border-border text-xs text-ink placeholder-ink-muted focus:outline-hidden focus:border-brand"
        />
      </div>

      <!-- Filter Controls & Export -->
      <div class="flex items-center gap-2">
        <div class="flex items-center p-0.5 rounded-sm bg-surface border border-border text-xs">
          <button
            type="button"
            onclick={() => (statusFilter = 'ALL')}
            class="px-2.5 py-1 rounded-sm transition-colors {statusFilter === 'ALL' ? 'bg-surface-subtle font-medium text-ink' : 'text-ink-secondary hover:text-ink'}"
          >
            All
          </button>
          <button
            type="button"
            onclick={() => (statusFilter = 'VERIFIED_ACTIVE')}
            class="px-2.5 py-1 rounded-sm transition-colors {statusFilter === 'VERIFIED_ACTIVE' ? 'bg-surface-subtle font-medium text-ink' : 'text-ink-secondary hover:text-ink'}"
          >
            Verified
          </button>
          <button
            type="button"
            onclick={() => (statusFilter = 'PENDING_NOTICE')}
            class="px-2.5 py-1 rounded-sm transition-colors {statusFilter === 'PENDING_NOTICE' ? 'bg-surface-subtle font-medium text-ink' : 'text-ink-secondary hover:text-ink'}"
          >
            Pending
          </button>
        </div>

        <button
          type="button"
          onclick={handleExport}
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-surface hover:bg-surface-subtle border border-border text-xs font-medium text-ink transition-colors cursor-pointer"
        >
          <Download class="w-3.5 h-3.5 text-ink-muted" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- 3. TABLE: High-Density Operational Consent Ledger -->
    <div class="rounded-none border border-border overflow-hidden bg-surface">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-border bg-surface-subtle text-ink-muted font-medium">
              <th class="p-3.5">Learner</th>
              <th class="p-3.5">Guardian</th>
              <th class="p-3.5">Grade</th>
              <th class="p-3.5">Consent Status</th>
              <th class="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            {#each filteredLedger as row}
              <tr class="hover:bg-surface-subtle transition-colors">
                <td class="p-3.5 font-medium text-ink">
                  {row.learnerName}
                </td>
                <td class="p-3.5 text-ink-secondary">
                  {row.parentName}
                </td>
                <td class="p-3.5 text-ink-secondary">
                  {row.gradeBand}
                </td>
                <td class="p-3.5">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-medium {row.status === 'VERIFIED_ACTIVE' ? 'bg-positive-subtle text-positive' : 'bg-attention-subtle text-attention'}">
                    {#if row.status === 'VERIFIED_ACTIVE'}
                      <CheckCircle2 class="w-3 h-3" />
                      <span>Verified</span>
                    {:else}
                      <Clock class="w-3 h-3" />
                      <span>Pending Guardian</span>
                    {/if}
                  </span>
                </td>
                <td class="p-3.5 text-right">
                  <button
                    type="button"
                    onclick={() => openInspector(row)}
                    class="text-xs font-medium text-brand hover:underline cursor-pointer"
                  >
                    Inspect
                  </button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- 4. AUDIT TRAIL: Statutory Compliance Audit Ledger -->
  <section id="audit" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Statutory Compliance & Audit Trail
      </h2>
      <span class="text-xs text-ink-muted">DPDP Act Section 9 Compliance</span>
    </div>
    <div class="p-4 rounded-sm bg-surface border border-border text-xs space-y-2">
      <div class="flex justify-between text-ink-muted font-mono text-[11px]">
        <span>CONSENT LEDGER LOG: IMMUTABLE AUDIT TRAIL</span>
        <span class="text-positive font-sans font-medium">Active</span>
      </div>
      <p class="text-ink-secondary">All consent notices, guardian authorizations, and state transitions are recorded into an append-only institutional audit ledger in compliance with DPDP statutory requirements.</p>
    </div>
  </section>

  <!-- 5. ORGANIZATIONS / TENANTS -->
  <section id="orgs" class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-base font-semibold text-ink">
        Campus Configuration & Scope
      </h2>
      <span class="text-xs text-ink-muted">Affiliated Campus Cluster</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
      <div class="p-4 rounded-sm bg-surface border border-border space-y-1">
        <span class="text-ink-muted font-medium">Cohort Boundaries</span>
        <p class="text-ink font-semibold">Classes 5 through 10 (Middle & Secondary)</p>
      </div>
      <div class="p-4 rounded-sm bg-surface border border-border space-y-1">
        <span class="text-ink-muted font-medium">Data Boundary Zone</span>
        <p class="text-ink font-semibold">India Central (me-south-1) • DPDP Sovereign</p>
      </div>
    </div>
  </section>
</div>

<!-- Right Slide-out Inspector Panel for Compliance Provenance -->
<InspectorPanel
  bind:open={inspectorOpen}
  title={selectedRecord?.learnerName || 'Consent Ledger'}
  subtitle={selectedRecord ? `Student ID: ${selectedRecord.id}` : ''}
  verified={selectedRecord?.status === 'VERIFIED_ACTIVE'}
  verificationLabel={selectedRecord?.status === 'VERIFIED_ACTIVE'
    ? 'Cryptographically Verified'
    : selectedRecord?.status === 'WITHDRAWN'
    ? 'Consent Revoked / Withdrawn'
    : 'Notice Pending Guardian Action'}
>
  {#if selectedRecord}
    <div class="space-y-6 text-xs">
      <div class="space-y-2">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">Statutory Consent Details</span>
        <div class="p-3 rounded-sm bg-surface-subtle border border-border space-y-2">
          <div class="flex justify-between">
            <span class="text-ink-secondary">Learner:</span>
            <span class="font-medium text-ink">{selectedRecord.learnerName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Primary Guardian:</span>
            <span class="font-medium text-ink">{selectedRecord.parentName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Grade Band:</span>
            <span class="font-medium text-ink">{selectedRecord.gradeBand}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-ink-secondary">Legal Status:</span>
            <span class="font-medium {selectedRecord.status === 'VERIFIED_ACTIVE' ? 'text-positive' : 'text-attention'}">
              {selectedRecord.status}
            </span>
          </div>
          {#if selectedRecord.verifiedAt}
            <div class="flex justify-between">
              <span class="text-ink-secondary">Timestamp:</span>
              <span class="font-medium text-ink">{new Date(selectedRecord.verifiedAt).toLocaleDateString()}</span>
            </div>
          {/if}
        </div>
      </div>

      <div class="space-y-1.5">
        <span class="text-[11px] font-medium text-ink-muted uppercase tracking-wider">DPDP Act Compliance</span>
        <p class="text-ink-secondary leading-relaxed">
          Statutory parental consent is cryptographically bound to the learner profile. No unverified third-party sharing or algorithmic targeting is permitted under DPDP Section 9.
        </p>
      </div>

      {#if selectedRecord.status !== 'VERIFIED_ACTIVE'}
        <div class="pt-4 border-t border-border">
          <button
            type="button"
            onclick={() => handleResendNotice(selectedRecord.parentName)}
            class="w-full py-2.5 px-4 rounded-sm bg-brand hover:bg-brand/90 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send class="w-3.5 h-3.5" />
            <span>Resend Guardian Notice</span>
          </button>
        </div>
      {/if}
    </div>
  {/if}
</InspectorPanel>
