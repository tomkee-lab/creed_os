<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { Sun, Moon } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';

  let { children } = $props();

  let isDarkMode = $state(true);
  const isLoginPage = $derived(page.url.pathname === '/login');

  onMount(() => {
    const saved = localStorage.getItem('way_theme');
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      isDarkMode = false;
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      isDarkMode = true;
    }
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('way_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('way_theme', 'light');
    }
  }
</script>

{#if isLoginPage}
  {@render children?.()}
{:else}
  <div class="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-canvas text-ink">
    <!-- Top Minimal Header -->
    <header class="flex items-center justify-between max-w-5xl mx-auto w-full">
    <a href="/" class="flex items-center gap-2.5 group">
      <div class="w-8 h-8 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shadow-xs group-hover:bg-brand group-hover:text-brand-foreground transition-all">
        <CreedLogo size={18} class="transition-transform group-hover:scale-105" />
      </div>
      <span class="font-heading font-semibold text-xs tracking-tight text-ink group-hover:text-brand transition-colors">
        CREED OS
      </span>
    </a>

    <button
      onclick={toggleTheme}
      class="p-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {#if isDarkMode}
        <Sun class="w-4 h-4 text-attention" />
      {:else}
        <Moon class="w-4 h-4" />
      {/if}
    </button>
  </header>

  <!-- Focused Center Canvas -->
  <main class="w-full max-w-md mx-auto my-auto py-8">
    {@render children?.()}
  </main>

  <!-- Legal & Privacy Sovereignty Footer -->
  <footer class="max-w-5xl mx-auto w-full text-center text-[11px] text-ink-muted py-4">
    DPDP Act 2023 Compliant · Verified Parental Consent Required for Minors under 18
  </footer>
</div>
{/if}
