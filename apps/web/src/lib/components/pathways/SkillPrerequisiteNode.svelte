<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import { CheckCircle2, Clock } from 'lucide-svelte';

  type $$Props = NodeProps;
  let { data, selected }: { data: any; selected?: boolean } = $props();

  let isMet = $derived((data.delta ?? 0) >= 0);
  let progressPct = $derived(
    data.minimumLevel > 0
      ? Math.min(100, Math.round(((data.demonstrated ?? 0) / data.minimumLevel) * 100))
      : 100
  );
</script>

<div
  class="relative px-3 py-2 rounded-sm min-w-56 transition-micro border select-none {selected
    ? 'bg-surface-raised border-brand shadow-sm ring-1 ring-brand'
    : 'bg-surface dark:bg-surface-raised border-border hover:border-border-strong hover:shadow-2xs'}"
>
  <Handle
    type="target"
    position={Position.Left}
    class="w-2.5! h-2.5! bg-brand! border-2! border-surface! rounded-xs!"
  />

  <div class="flex items-center justify-between gap-2 mb-2">
    <span class="text-xs font-semibold text-ink truncate">
      {data.label}
    </span>
    {#if isMet}
      <span class="px-1.5 py-0.5 rounded-xs text-[9px] font-mono font-bold bg-positive-subtle text-positive border border-positive/30 inline-flex items-center gap-1 shrink-0">
        <CheckCircle2 class="w-2.5 h-2.5 shrink-0" />
        Met
      </span>
    {:else}
      <span class="px-1.5 py-0.5 rounded-xs text-[9px] font-mono font-bold bg-attention-subtle text-attention border border-attention/30 inline-flex items-center gap-1 shrink-0">
        <Clock class="w-2.5 h-2.5 shrink-0" />
        In Progress
      </span>
    {/if}
  </div>

  <div class="flex items-center justify-between text-[10px] font-mono text-ink-muted tabular-nums pt-1.5 border-t border-border">
    <span>Req: Level {data.minimumLevel}</span>
    <span class={isMet ? 'text-positive font-bold' : 'text-ink-secondary font-medium'}>
      Current: {data.demonstrated ?? '—'}
    </span>
  </div>

  <!-- Foundational Competency Mini Progress Bar -->
  <div class="w-full h-1 bg-surface-subtle border border-border/40 rounded-none overflow-hidden mt-2">
    <div
      class="h-full transition-all duration-200 {isMet ? 'bg-mint' : 'bg-attention'}"
      style="width: {progressPct}%;"
    ></div>
  </div>

  <Handle
    type="source"
    position={Position.Right}
    class="w-2.5! h-2.5! bg-brand! border-2! border-surface! rounded-xs!"
  />
</div>
