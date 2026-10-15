<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Compass,
    Activity,
    Layers,
    BrainCircuit,
    Sun,
    Moon,
    FileText,
    Sparkles
  } from 'lucide-svelte';
  import Sidebar from '$lib/components/shell/Sidebar.svelte';
  import TopBar from '$lib/components/shell/TopBar.svelte';
  import CommandMenu from '$lib/components/shell/CommandMenu.svelte';
  import { toggleTheme as toggleGlobalTheme } from '$lib/theme.js';

  let { data, children } = $props();

  let sidebarCollapsed = $state(false);
  let commandMenuOpen = $state(false);
  let isDarkMode = $state(false);

  onMount(() => {
    isDarkMode = document.documentElement.classList.contains('dark') ||
      document.documentElement.getAttribute('data-theme') === 'dark';

    const handleThemeChange = (e: Event) => {
      const ce = e as CustomEvent<{ theme: 'dark' | 'light' }>;
      if (ce.detail?.theme) {
        isDarkMode = ce.detail.theme === 'dark';
      }
    };
    window.addEventListener('way_theme_change', handleThemeChange);

    // Sidebar collapse state preference
    const savedSidebar = localStorage.getItem('creed_sidebar_collapsed');
    if (savedSidebar !== null) {
      sidebarCollapsed = savedSidebar === 'true';
    }

    return () => {
      window.removeEventListener('way_theme_change', handleThemeChange);
    };
  });

  function toggleSidebar() {
    sidebarCollapsed = !sidebarCollapsed;
    if (browser) {
      localStorage.setItem('creed_sidebar_collapsed', String(sidebarCollapsed));
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
      // Don't intercept if user is typing in input or textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      e.preventDefault();
      toggleSidebar();
    }
  }

  function toggleTheme() {
    const next = toggleGlobalTheme();
    isDarkMode = next === 'dark';
  }

  const currentPath = $derived(page.url.pathname);

  // Active role derived from route, with support for switching
  type ActiveRole = 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio';
  let activeRoleOverride = $state<ActiveRole | null>(null);

  const activeRole = $derived.by<ActiveRole>(() => {
    if (currentPath.startsWith('/parent')) return 'parent';
    if (currentPath.startsWith('/teacher')) return 'teacher';
    if (currentPath.startsWith('/counselor')) return 'counselor';
    if (currentPath.startsWith('/admin')) return 'admin';
    if (currentPath.startsWith('/studio') || currentPath.startsWith('/author')) return 'studio';
    if (currentPath.startsWith('/student')) return 'student';
    return activeRoleOverride || 'student';
  });

  async function handleRoleChange(newRole: string) {
    if (import.meta.env.DEV) {
      try {
        await fetch('/api/auth/dev-switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole })
        });
      } catch (err) {
        console.error('Failed to sync dev switch session:', err);
      }
    }
    activeRoleOverride = newRole as ActiveRole;
    switch (newRole) {
      case 'student':
        goto('/student');
        break;
      case 'parent':
        goto('/parent');
        break;
      case 'teacher':
        goto('/teacher');
        break;
      case 'counselor':
        goto('/counselor');
        break;
      case 'admin':
        goto('/admin');
        break;
      case 'studio':
        goto('/studio');
        break;
    }
  }

  const isHelpRoute = $derived(currentPath.startsWith('/help'));
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isHelpRoute}
  <div class="min-h-screen bg-canvas text-ink flex flex-col">
    {@render children?.()}
  </div>
{:else}
<!-- ============================================================
     AUTHENTICATED APPLICATION SHELL
     Sidebar (240px expanded / 64px collapsed) + TopBar + Workspace Grid
     ============================================================ -->
<div class="flex min-h-screen bg-canvas text-ink">
  <!-- Desktop Collapsible Sidebar -->
  <div class="hidden md:flex shrink-0 sticky top-0 h-screen">
    <Sidebar
      bind:collapsed={sidebarCollapsed}
      activeRole={activeRole}
      onRoleChange={handleRoleChange}
    />
  </div>

  <!-- Main Workspace Column -->
  <div class="flex-1 flex flex-col min-w-0">
    <!-- Top Context Bar (56px) -->
    <TopBar
      activeRole={activeRole}
      isDarkMode={isDarkMode}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      onToggleTheme={toggleTheme}
      onOpenSearch={() => (commandMenuOpen = true)}
      onRoleChange={handleRoleChange}
    />

    <!-- Primary Workspace Container (max-width 1360px) -->
    <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-340 w-full mx-auto pb-20 md:pb-8">
      {@render children?.()}
    </main>

    <!-- Mobile Bottom Navigation (Student & Parent quick access) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-raised border-t border-border px-2 py-1.5 flex items-center justify-around">
      {#if activeRole === 'student'}
        <a href="/student" class="flex flex-col items-center py-1 px-3 text-[10px] {currentPath === '/student' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Today</span>
        </a>
        <a href="/student/pathways" class="flex flex-col items-center py-1 px-3 text-[10px] {currentPath.startsWith('/student/pathways') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Layers class="w-4 h-4 mb-0.5" />
          <span>Map</span>
        </a>
        <a href="/student/progress" class="flex flex-col items-center py-1 px-3 text-[10px] {currentPath.startsWith('/student/progress') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Activity class="w-4 h-4 mb-0.5" />
          <span>Skills</span>
        </a>
        <a href="/student/mentor" class="flex flex-col items-center py-1 px-3 text-[10px] {currentPath.startsWith('/student/mentor') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <BrainCircuit class="w-4 h-4 mb-0.5" />
          <span>Guide</span>
        </a>
      {:else if activeRole === 'parent'}
        <a href="/parent" class="flex flex-col items-center py-1 px-3 text-[10px] {currentPath === '/parent' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Overview</span>
        </a>
        <a href="/parent#growth" class="flex flex-col items-center py-1 px-3 text-[10px] text-ink-muted">
          <Activity class="w-4 h-4 mb-0.5" />
          <span>Growth</span>
        </a>
        <a href="/parent#evidence" class="flex flex-col items-center py-1 px-3 text-[10px] text-ink-muted">
          <FileText class="w-4 h-4 mb-0.5" />
          <span>Evidence</span>
        </a>
      {:else}
        <a href={currentPath} class="flex flex-col items-center py-1 px-3 text-[10px] text-brand font-semibold">
          <Compass class="w-4 h-4 mb-0.5" />
          <span class="capitalize">{activeRole}</span>
        </a>
      {/if}

      <button
        onclick={() => (commandMenuOpen = true)}
        class="flex flex-col items-center py-1 px-3 text-[10px] text-ink-muted cursor-pointer"
        aria-label="Open search"
      >
        <Sparkles class="w-4 h-4 mb-0.5" />
        <span>Search</span>
      </button>
    </div>
  </div>
</div>

<!-- Spotlight Command Palette Dialog (Cmd+K) -->
<CommandMenu bind:open={commandMenuOpen} />
{/if}
