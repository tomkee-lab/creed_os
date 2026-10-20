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
    Sparkles,
    TrendingUp,
    GraduationCap,
    BookOpen,
    Users,
    Lock,
    FolderKanban,
    TerminalSquare
  } from 'lucide-svelte';
  import Sidebar from '$lib/components/shell/Sidebar.svelte';
  import TopBar from '$lib/components/shell/TopBar.svelte';
  import CommandMenu from '$lib/components/shell/CommandMenu.svelte';
  import { toggleTheme as toggleGlobalTheme } from '$lib/theme.js';

  let { data, children } = $props();

  let sidebarCollapsed = $state(false);
  let mobileSidebarOpen = $state(false);
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
    if (browser && window.innerWidth < 768) {
      mobileSidebarOpen = !mobileSidebarOpen;
      return;
    }
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
<!-- Authenticated application shell: sidebar (240px expanded / 64px collapsed), top bar, workspace grid. -->
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

    <!-- Mobile Bottom Navigation (Role-specific quick thumb navigation with safe-area support) -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface-raised border-t border-border px-2 py-1.5 flex items-center justify-around pb-[max(0.375rem,env(safe-area-inset-bottom,0px))]">
      {#if activeRole === 'student'}
        <a href="/student" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath === '/student' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Today</span>
        </a>
        <a href="/student/assessment" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath.startsWith('/student/assessment') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Activity class="w-4 h-4 mb-0.5" />
          <span>Assess</span>
        </a>
        <a href="/student/missions" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath.startsWith('/student/missions') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Layers class="w-4 h-4 mb-0.5" />
          <span>Missions</span>
        </a>
        <a href="/student/growth" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath.startsWith('/student/growth') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <TrendingUp class="w-4 h-4 mb-0.5" />
          <span>Growth</span>
        </a>
      {:else if activeRole === 'parent'}
        <a href="/parent" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath === '/parent' && !page.url.hash ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Overview</span>
        </a>
        <a href="/parent#growth" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {page.url.hash === '#growth' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Activity class="w-4 h-4 mb-0.5" />
          <span>Growth</span>
        </a>
        <a href="/parent#evidence" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {page.url.hash === '#evidence' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <FileText class="w-4 h-4 mb-0.5" />
          <span>Evidence</span>
        </a>
      {:else if activeRole === 'teacher'}
        <a href="/teacher" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath === '/teacher' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Command</span>
        </a>
        <a href="/teacher/lessons" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath.startsWith('/teacher/lessons') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <BookOpen class="w-4 h-4 mb-0.5" />
          <span>Lessons</span>
        </a>
        <a href="/teacher/roster" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath.startsWith('/teacher/roster') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <GraduationCap class="w-4 h-4 mb-0.5" />
          <span>Roster</span>
        </a>
      {:else if activeRole === 'counselor'}
        <a href="/counselor" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath === '/counselor' && !page.url.hash ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Users class="w-4 h-4 mb-0.5" />
          <span>Caseload</span>
        </a>
        <a href="/counselor#priority" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {page.url.hash === '#priority' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Priority</span>
        </a>
        <a href="/counselor#evidence" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {page.url.hash === '#evidence' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <FileText class="w-4 h-4 mb-0.5" />
          <span>Evidence</span>
        </a>
      {:else if activeRole === 'admin'}
        <a href="/admin" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath === '/admin' && !page.url.hash ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Compass class="w-4 h-4 mb-0.5" />
          <span>Overview</span>
        </a>
        <a href="/admin#consent" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {page.url.hash === '#consent' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <Lock class="w-4 h-4 mb-0.5" />
          <span>Consent</span>
        </a>
        <a href="/admin#audit" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {page.url.hash === '#audit' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <FileText class="w-4 h-4 mb-0.5" />
          <span>Audit</span>
        </a>
      {:else}
        <a href="/studio" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath === '/studio' ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <FolderKanban class="w-4 h-4 mb-0.5" />
          <span>Studio</span>
        </a>
        <a href="/ide" class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] {currentPath.startsWith('/ide') ? 'text-brand font-semibold' : 'text-ink-muted'}">
          <TerminalSquare class="w-4 h-4 mb-0.5" />
          <span>Robotics IDE</span>
        </a>
      {/if}

      <button
        type="button"
        onclick={() => (commandMenuOpen = true)}
        class="flex flex-col items-center justify-center min-h-11 min-w-12 py-1 px-3 text-[10px] text-ink-muted cursor-pointer rounded-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand"
        aria-label="Open search"
      >
        <Sparkles class="w-4 h-4 mb-0.5" />
        <span>Search</span>
      </button>
    </div>
  </div>
</div>

<!-- Mobile Slide-Over Navigation Drawer -->
{#if mobileSidebarOpen}
  <div
    class="fixed inset-0 z-40 md:hidden bg-canvas/80 backdrop-blur-xs transition-opacity duration-200"
    onclick={() => (mobileSidebarOpen = false)}
    aria-hidden="true"
  ></div>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-72 md:hidden bg-surface-raised border-r border-border shadow-xl flex flex-col animate-in slide-in-from-left duration-200"
    aria-label="Mobile Navigation Drawer"
  >
    <div class="h-14 px-4 border-b border-border flex items-center justify-between bg-surface shrink-0">
      <span class="text-xs font-mono uppercase tracking-wider text-ink-muted font-medium">Navigation Menu</span>
      <button
        type="button"
        onclick={() => (mobileSidebarOpen = false)}
        class="min-h-11 min-w-11 inline-flex items-center justify-center rounded-none text-ink-muted hover:text-ink cursor-pointer"
        aria-label="Close navigation drawer"
      >
        <span class="text-base font-mono">✕</span>
      </button>
    </div>
    <div class="flex-1 overflow-y-auto">
      <Sidebar
        collapsed={false}
        activeRole={activeRole}
        onRoleChange={(role) => {
          mobileSidebarOpen = false;
          handleRoleChange(role);
        }}
      />
    </div>
  </aside>
{/if}

<!-- Spotlight Command Palette Dialog (Cmd+K) -->
<CommandMenu bind:open={commandMenuOpen} />
{/if}
