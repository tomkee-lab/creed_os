<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    children?: Snippet;
    class?: string;
  }

  let { children, class: className = '' }: Props = $props();
</script>

<kbd
  class="inline-flex items-center justify-center px-1.5 py-0.5 rounded-none bg-surface-subtle border border-border font-mono text-[10px] text-ink font-semibold shadow-2xs select-none {className}"
>
  {@render children?.()}
</kbd>
