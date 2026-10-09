<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import { Compass, CheckCircle2 } from 'lucide-svelte';

  type $$Props = NodeProps;
  let { data, selected } = $props<any>();

  let isAllMet = $derived(data.metCount >= data.totalCount && data.totalCount > 0);
</script>

<div
  class="relative px-4 py-3 rounded-none min-w-55 transition-micro border select-none cursor-pointer {selected
    ? 'bg-surface-3 border-mint shadow-xs ring-1 ring-mint/50'
    : 'bg-surface-2 border-border-subtle hover:border-border hover:bg-surface-3'}"
>
  <Handle
    type="target"
    position={Position.Left}
    class="w-2! h-2! bg-border-strong! border! border-surface-2!"
  />

  <div class="flex items-start justify-between gap-2">
    <div class="space-y-0.5">
      <div class="flex items-center gap-1.5">
        <Compass class="w-3.5 h-3.5 text-mint shrink-0" />
        <span class="text-[10px] font-mono tracking-wider uppercase text-foreground-muted">
          {data.field || 'Pathway'}
        </span>
      </div>
      <h4 class="text-xs font-semibold text-foreground tracking-tight leading-tight">
        {data.title}
      </h4>
    </div>

    {#if isAllMet}
      <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-none text-[9px] font-mono bg-mint/15 text-mint border border-mint/25">
        <CheckCircle2 class="w-2.5 h-2.5" />
        Ready
      </span>
    {/if}
  </div>

  <div class="mt-2.5 pt-2 border-t border-border-subtle/80 flex items-center justify-between text-[11px]">
    <span class="text-foreground-secondary text-[10px]">Foundations</span>
    <span class="font-mono text-[10px] tabular-nums {data.metCount >= data.totalCount ? 'text-mint font-medium' : 'text-foreground'}">
      {data.metCount} / {data.totalCount} demonstrated
    </span>
  </div>

  <Handle
    type="source"
    position={Position.Right}
    class="w-2! h-2! bg-border-strong! border! border-surface-2!"
  />
</div>
