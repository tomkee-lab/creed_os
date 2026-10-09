<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils.js';

  let {
    class: className,
    children,
    ...restProps
  }: HTMLAttributes<HTMLSpanElement> = $props();
</script>

<span
  class={cn('ml-auto text-[10px] tracking-widest text-ink-muted font-mono', className)}
  {...restProps}
>
  {@render children?.()}
</span>
