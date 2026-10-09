<script lang="ts">
  import { Label } from "$lib/components/ui/label/index.js";
  import { cn } from "$lib/utils.js";
  import type { ComponentProps } from "svelte";

  let {
    class: className,
    children,
    ...restProps
  }: ComponentProps<typeof Label> = $props();
</script>

<Label
  data-slot="field-label"
  class={cn("text-xs font-medium text-ink", className)}
  {...restProps}
>
  {@render children?.()}
</Label>
