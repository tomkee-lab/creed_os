<script lang="ts">
  import { Menubar as MenubarPrimitive } from 'bits-ui';
  import { cn } from '$lib/utils.js';

  let {
    ref = $bindable(null),
    align = 'start',
    sideOffset = 4,
    alignOffset = -4,
    class: className,
    ...restProps
  }: MenubarPrimitive.ContentProps = $props();
</script>

<MenubarPrimitive.Portal>
  <MenubarPrimitive.Content
    bind:ref
    data-slot="menubar-content"
    {align}
    {sideOffset}
    {alignOffset}
    class={cn(
      'z-50 min-w-44 overflow-hidden rounded-none border border-border bg-surface-overlay p-1 text-ink shadow-md font-mono text-xs',
      'data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95',
      className
    )}
    {...restProps}
  />
</MenubarPrimitive.Portal>
