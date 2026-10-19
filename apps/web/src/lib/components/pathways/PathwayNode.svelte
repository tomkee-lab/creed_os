<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import { Compass, CheckCircle2 } from 'lucide-svelte';

  type $$Props = NodeProps;
  let { data, selected }: { data: any; selected?: boolean } = $props();

  let isAllMet = $derived(data.metCount >= data.totalCount && data.totalCount > 0);
  let progressPct = $derived(
    data.totalCount > 0
      ? Math.min(100, Math.round((data.metCount / data.totalCount) * 100))
      : 0
  );
</script>

<div
  class="relative px-4 py-3 rounded-sm min-w-60 transition-micro border select-none cursor-pointer {selected
    ? 'bg-surface-raised border-brand shadow-sm ring-1 ring-brand'
    : 'bg-surface dark:bg-surface-raised border-border hover:border-brand/60 hover:bg-surface-subtle shadow-xs'}"
>
  <Handle
    type="target"
    position={Position.Left}
    class="w-2.5! h-2.5! bg-brand! border-2! border-surface! rounded-xs!"
  />

  <div class="flex items-start justify-between gap-2">
    <div class="space-y-0.5 min-w-0">
      <div class="flex items-center gap-1.5">
        <Compass class="w-3.5 h-3.5 text-brand shrink-0" />
        <span class="text-[10px] font-mono tracking-wider uppercase text-ink-muted truncate">
          {data.field || 'Pathway'}
        </span>
      </div>
      <h4 class="text-xs font-bold text-ink tracking-tight leading-tight line-clamp-1">
        {data.title}
      </h4>
    </div>

    {#if isAllMet}
      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs text-[9px] font-mono font-bold bg-positive-subtle text-positive border border-positive/30 shrink-0">
        <CheckCircle2 class="w-2.5 h-2.5 shrink-0" />
        Ready
      </span>
    {/if}
  </div>

  <div class="mt-2 pt-2 border-t border-border flex items-center justify-between text-[11px]">
    <span class="text-ink-muted text-[10px] font-mono">Foundations</span>
    <span class="font-mono text-[10px] tabular-nums {data.metCount >= data.totalCount ? 'text-positive font-bold' : 'text-ink font-medium'}">
      {data.metCount} / {data.totalCount} demonstrated
    </span>
  </div>

  <!-- Progress Bar Track -->
  <div class="w-full h-1 bg-surface-subtle border border-border/40 rounded-none overflow-hidden mt-1.5">
    <div
      class="h-full transition-all duration-200 {isAllMet ? 'bg-mint' : 'bg-brand'}"
      style="width: {progressPct}%;"
    ></div>
  </div>

  <Handle
    type="source"
    position={Position.Right}
    class="w-2.5! h-2.5! bg-brand! border-2! border-surface! rounded-xs!"
  />
</div>
