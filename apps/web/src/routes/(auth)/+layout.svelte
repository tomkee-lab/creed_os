<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon } from 'lucide-svelte';

  let { children } = $props();

  let isDarkMode = $state(false);

  onMount(() => {
    isDarkMode = document.documentElement.classList.contains('dark');
  });

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('way_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('way_theme', 'light');
    }
  }
</script>

<div class="min-h-screen flex flex-col justify-between p-4 sm:p-8 bg-canvas text-ink">
  <!-- Top Minimal Header -->
  <header class="flex items-center justify-between max-w-5xl mx-auto w-full">
    <a href="/" class="flex items-center gap-2 group">
      <div class="w-7 h-7 rounded-sm bg-brand flex items-center justify-center text-white font-mono font-bold text-xs shadow-xs">
        C
      </div>
      <span class="font-heading font-semibold text-xs tracking-tight text-ink group-hover:text-brand transition-colors">
        CREED OS
      </span>
    </a>

    <button
      onclick={toggleTheme}
      class="p-1.5 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {#if isDarkMode}
        <Sun class="w-4 h-4 text-amber-400" />
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
