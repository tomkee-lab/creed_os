<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    class?: string;
  }

  let { children, class: className = '' }: Props = $props();
</script>

<div
  role="group"
  class="inline-flex rounded-none -space-x-px [&>button]:rounded-none [&>button]:border-border [&>button:hover]:z-10 [&>button:focus-visible]:z-20 {className}"
>
  {@render children?.()}
</div>
