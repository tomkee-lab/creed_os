<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { Toaster } from '$lib/components/ui/sonner/index.js';

  let { children } = $props();

  onMount(() => {
    const savedTheme = localStorage.getItem('way_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
</script>

<div class="min-h-screen bg-canvas text-ink font-sans selection:bg-brand-subtle selection:text-brand">
  {@render children?.()}

  {#if browser}
    <Toaster richColors position="bottom-right" />
  {/if}
</div>
