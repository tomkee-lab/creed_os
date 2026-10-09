<script lang="ts">
  import { Menubar as MenubarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.RootProps = $props();
</script>

<MenubarPrimitive.Root
  bind:ref
  data-slot="menubar"
  class={cn(
    'flex h-8 items-center gap-0.5 rounded-none border border-border bg-surface-subtle p-0.5 shadow-2xs font-mono text-xs',
    className
  )}
  {...restProps}
/>
