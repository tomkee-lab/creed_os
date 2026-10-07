<script lang="ts">
  import { onMount } from 'svelte';
  import { Sun, Moon, ArrowRight } from 'lucide-svelte';

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

<div class="min-h-screen flex flex-col bg-canvas text-ink">
  <!-- ============================================================
       PUBLIC MARKETING SHELL
       Editorial top navigation with zero app-persona clutter
       ============================================================ -->
  <header class="sticky top-0 z-30 w-full border-b border-border bg-surface-raised/85 backdrop-blur-md">
    <div class="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <a href="/" class="flex items-center gap-2.5 group">
        <div class="w-8 h-8 rounded-sm bg-brand flex items-center justify-center text-white font-mono font-bold text-sm shadow-xs">
          C
        </div>
        <div class="flex flex-col">
          <span class="font-heading font-semibold text-sm tracking-tight text-ink group-hover:text-brand transition-colors">
            CREED OS
          </span>
          <span class="text-[9px] uppercase tracking-widest text-ink-muted font-mono">
            Learner Intelligence
          </span>
        </div>
      </a>

      <!-- Center Editorial Links -->
      <nav class="hidden md:flex items-center gap-8 text-xs font-medium text-ink-secondary">
        <a href="/platform" class="hover:text-ink transition-colors">Platform</a>
        <a href="/#moments" class="hover:text-ink transition-colors">How It Works</a>
        <a href="/schools" class="hover:text-ink transition-colors">For Schools</a>
        <a href="/families" class="hover:text-ink transition-colors">For Families</a>
        <a href="/about" class="hover:text-ink transition-colors">About</a>
        <a href="/pricing" class="hover:text-ink transition-colors">Pricing</a>
      </nav>

      <!-- Right Action Buttons -->
      <div class="flex items-center gap-3">
        <!-- Theme Toggle -->
        <button
          onclick={toggleTheme}
          class="p-1.5 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {#if isDarkMode}
            <Sun class="w-4 h-4 text-amber-400" />
          {:else}
            <Moon class="w-4 h-4" />
          {/if}
        </button>

        <a
          href="/login"
          class="text-xs font-medium text-ink-secondary hover:text-ink px-3 py-1.5 rounded-sm transition-colors"
        >
          Sign in
        </a>
        <a
          href="/student"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-brand text-white text-xs font-medium hover:bg-brand/90 shadow-xs transition-colors"
        >
          <span>Explore CREED</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </header>

  <!-- Public Content -->
  <main class="flex-1">
    {@render children?.()}
  </main>

  <!-- Editorial Footer -->
  <footer class="border-t border-border bg-surface py-12 px-4 sm:px-6 lg:px-8 mt-20">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-ink-secondary">
      <div class="flex items-center gap-3">
        <div class="w-6 h-6 rounded-sm bg-brand flex items-center justify-center text-white font-mono font-bold text-xs">
          C
        </div>
        <span class="font-heading font-medium text-ink">CREED OS</span>
        <span class="text-ink-muted">·</span>
        <span class="text-ink-muted">AI-Native Learner Intelligence & Longitudinal Navigation Platform</span>
      </div>

      <div class="flex flex-wrap items-center gap-6 text-xs text-ink-muted">
        <a href="/platform" class="hover:text-ink transition-colors">Platform</a>
        <a href="/schools" class="hover:text-ink transition-colors">Schools</a>
        <a href="/families" class="hover:text-ink transition-colors">Families</a>
        <a href="/about" class="hover:text-ink transition-colors">About</a>
        <a href="/pricing" class="hover:text-ink transition-colors">Pricing</a>
        <a href="/consent" class="hover:text-ink transition-colors">Consent & Privacy</a>
      </div>
    </div>
    <div class="max-w-7xl mx-auto mt-6 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-ink-muted gap-2">
      <p>© 2026 CREED OS Inc. DPDP Act 2023 Compliant. Deterministic Scoring. Longitudinal Evidence.</p>
      <p>Quiet Editorial Workspace · WAY 3.0</p>
    </div>
  </footer>
</div>
