<script lang="ts">
  import { PinInput as PinInputPrimitive } from 'bits-ui';
  import type { ComponentProps } from 'svelte';
  import { cn } from '$lib/utils';

  let {
    class: className,
    cell,
    ...restProps
  }: ComponentProps<typeof PinInputPrimitive.Cell> = $props();
</script>

<PinInputPrimitive.Cell
  {cell}
  class={cn(
    'relative flex items-center justify-center w-10 h-12 rounded-none border bg-surface font-mono text-sm font-semibold text-ink transition-all',
    'border-border hover:border-border-strong',
    cell.isActive && 'border-brand ring-1 ring-brand/50 bg-surface-raised',
    className
  )}
  {...restProps}
>
  {cell.char ?? ''}
  {#if cell.hasFakeCaret}
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div class="w-0.5 h-4.5 bg-brand animate-pulse"></div>
    </div>
  {/if}
</PinInputPrimitive.Cell>
