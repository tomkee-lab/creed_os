<script lang="ts">
  import { ShieldCheck, ChevronDown, ChevronUp, Lock } from 'lucide-svelte';

  interface EvidenceRecord {
    id?: string;
    sourceType: string;
    sourceTitle: string;
    observedAt: string;
    summary: string;
  }

  interface Props {
    title: string;
    evidenceStrength?: string;
    records: EvidenceRecord[];
    class?: string;
  }

  let {
    title,
    evidenceStrength = 'Strong Foundation',
    records = [],
    class: className = ''
  }: Props = $props();

  let isOpen = $state(false);

  function formatObservedDate(dateStr: string): string {
    if (!dateStr) return '';
    const cleanStr = dateStr.includes('•') ? dateStr.split('•')[0].trim() : dateStr;
    const parsed = Date.parse(cleanStr);
    return isNaN(parsed)
      ? dateStr
      : new Date(parsed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
</script>

<div class="surface-card rounded-sm border border-(--border-subtle) overflow-hidden transition-all {className}">
  <!-- Summary Header Row -->
  <button
    type="button"
    onclick={() => (isOpen = !isOpen)}
    class="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-(--surface-sunken) transition-colors cursor-pointer"
  >
    <div class="space-y-0.5">
      <div class="flex items-center gap-2">
        <h4 class="text-sm font-bold text-(--text-primary)">{title}</h4>
        <span class="text-[11px] px-2 py-0.5 rounded-sm bg-(--accent-success-subtle) text-(--accent-success) font-semibold border border-(--border-subtle)">
          {evidenceStrength}
        </span>
      </div>
      <p class="text-xs text-(--text-secondary)">
        {records.length} verifiable demonstration {records.length === 1 ? 'record' : 'records'}
      </p>
    </div>

    <div class="flex items-center gap-2 text-xs font-semibold text-(--accent-primary)">
      <span>{isOpen ? 'Hide Audit Log' : 'Inspect Evidence'}</span>
      {#if isOpen}
        <ChevronUp class="w-4 h-4" />
      {:else}
        <ChevronDown class="w-4 h-4" />
      {/if}
    </div>
  </button>

  <!-- Expanded Provenance Layer -->
  {#if isOpen}
    <div class="p-4 sm:p-5 border-t border-(--border-subtle) bg-(--surface-canvas) space-y-3">
      <div class="flex items-center justify-between text-[11px] text-(--text-secondary) pb-1 border-b border-(--border-subtle)">
        <span>Tamper-evident evidence atom logs</span>
        <span class="flex items-center gap-1 text-(--accent-success) font-medium">
          <Lock class="w-3 h-3" />
          Consent Protected
        </span>
      </div>

      {#each records as record}
        <div class="p-3 rounded-sm bg-(--surface-sunken) border border-(--border-subtle) space-y-1 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-(--text-primary)">{record.sourceTitle}</span>
            <span class="text-[10px] text-(--text-secondary) font-mono">
              {formatObservedDate(record.observedAt)}
            </span>
          </div>
          <p class="text-[11px] text-(--text-secondary) leading-relaxed">{record.summary}</p>
          <span class="text-[10px] uppercase font-semibold text-(--text-secondary) block pt-0.5">
            Type: {record.sourceType.replace('_', ' ')}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
