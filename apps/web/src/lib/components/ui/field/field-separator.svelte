<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
  bind:this={ref}
  data-slot="field-separator"
  class={cn("relative my-2", className)}
  {...restProps}
>
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-border"></div>
  </div>
  <div class="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
    <span class="bg-surface-raised px-2 text-ink-muted">
      {@render children?.()}
    </span>
  </div>
</div>
