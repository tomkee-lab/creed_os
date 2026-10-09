<script lang="ts">
  import { PinInput as PinInputPrimitive } from 'bits-ui';
  import type { ComponentProps } from 'svelte';
  import { cn } from '$lib/utils';

  let {
    class: className,
    value = $bindable(''),
    maxlength = 6,
    children: childrenProp,
    ...restProps
  }: ComponentProps<typeof PinInputPrimitive.Root> = $props();
</script>

<PinInputPrimitive.Root
  bind:value
  {maxlength}
  class={cn('flex items-center gap-2 select-none', className)}
  {...restProps}
>
  {#snippet children(snippetProps)}
    {@render childrenProp?.(snippetProps)}
  {/snippet}
</PinInputPrimitive.Root>
