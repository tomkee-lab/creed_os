<script lang="ts">
  import '../app.css';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { TooltipProvider } from '$lib/components/ui/tooltip/index.js';
  import { getInitialTheme, applyTheme } from '$lib/theme.js';

  let { children } = $props();
  let hydrated = $state(false);

  onMount(() => {
    hydrated = true;
    const theme = getInitialTheme();
    applyTheme(theme);
  });
</script>

<div data-app-hydrated={hydrated} class="min-h-screen bg-canvas text-ink font-sans selection:bg-brand-subtle selection:text-brand">
  <TooltipProvider delayDuration={150}>
    {@render children?.()}
  </TooltipProvider>

  <Toaster richColors position="bottom-right" />
</div>
