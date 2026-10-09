<script lang="ts">
  import { Menubar as MenubarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.TriggerProps = $props();
</script>

<MenubarPrimitive.Trigger
  bind:ref
  data-slot="menubar-trigger"
  class={cn(
    'flex cursor-pointer select-none items-center rounded-none px-2 py-0.5 text-xs font-medium outline-hidden transition-colors',
    'text-ink-secondary hover:bg-surface-raised hover:text-ink focus:bg-surface-raised focus:text-ink data-[state=open]:bg-surface-raised data-[state=open]:text-ink',
    className
  )}
  {...restProps}
/>
