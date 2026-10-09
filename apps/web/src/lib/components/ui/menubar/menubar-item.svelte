<script lang="ts">
  import { Menubar as MenubarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    inset = false,
    ...restProps
  }: MenubarPrimitive.ItemProps & { inset?: boolean } = $props();
</script>

<MenubarPrimitive.Item
  bind:ref
  data-slot="menubar-item"
  class={cn(
    'relative flex cursor-pointer select-none items-center rounded-none px-2 py-1 text-xs outline-hidden transition-colors',
    'hover:bg-surface-raised focus:bg-surface-raised hover:text-ink focus:text-ink text-ink-secondary',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    inset && 'pl-8',
    className
  )}
  {...restProps}
/>
