<script lang="ts">
  import { Handle, Position, type NodeProps } from '@xyflow/svelte';
  import { CheckCircle2, Clock, Sparkles } from 'lucide-svelte';

  type $$Props = NodeProps;
  let { data, selected } = $props<any>();

  let isMet = $derived((data.delta ?? 0) >= 0);
</script>

<div
  class="relative px-3 py-2.5 rounded-none min-w-47.5 transition-micro border select-none {selected
    ? 'bg-surface-3 border-mint shadow-xs'
    : 'bg-surface border-border-subtle hover:border-border'}"
>
  <Handle
    type="target"
    position={Position.Left}
    class="w-2! h-2! bg-border-strong! border! border-surface!"
  />

  <div class="flex items-center justify-between gap-1.5 mb-1.5">
    <span class="text-xs font-medium text-foreground truncate">
      {data.label}
    </span>
    {#if isMet}
      <span class="px-1.5 py-0.2 rounded-none text-[9px] font-mono bg-mint/15 text-mint border border-mint/25 inline-flex items-center gap-0.5">
        <CheckCircle2 class="w-2.5 h-2.5" />
        Met
      </span>
    {:else}
      <span class="px-1.5 py-0.2 rounded-none text-[9px] font-mono bg-yellow/15 text-yellow border border-yellow/25 inline-flex items-center gap-0.5">
        <Clock class="w-2.5 h-2.5" />
        In progress
      </span>
    {/if}
  </div>

  <div class="flex items-center justify-between text-[10px] font-mono text-foreground-muted tabular-nums pt-1 border-t border-border-subtle/60">
    <span>Req: {data.minimumLevel}</span>
    <span class={isMet ? 'text-mint' : 'text-foreground-secondary'}>
      Current: {data.demonstrated ?? '—'}
    </span>
  </div>

  <Handle
    type="source"
    position={Position.Right}
    class="w-2! h-2! bg-border-strong! border! border-surface!"
  />
</div>
