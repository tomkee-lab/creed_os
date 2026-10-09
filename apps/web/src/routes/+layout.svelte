<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { TooltipProvider } from '$lib/components/ui/tooltip/index.js';

  let { children } = $props();
  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
    const savedTheme = localStorage.getItem('way_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  });
</script>

<div data-app-hydrated={hydrated} class="min-h-screen bg-canvas text-ink font-sans selection:bg-brand-subtle selection:text-brand">
  <TooltipProvider delayDuration={150}>
    {@render children?.()}
  </TooltipProvider>

  {#if browser}
    <Toaster richColors position="bottom-right" />
  {/if}
</div>
