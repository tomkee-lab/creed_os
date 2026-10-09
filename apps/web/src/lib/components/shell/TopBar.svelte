<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import {
    Search,
    Bell,
    Sun,
    Moon,
    ChevronDown,
    User,
    Shield,
    Users,
    LogOut,
    Check,
    Wrench,
    BookOpen,
    PanelLeft
  } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { authClient } from '$lib/auth-client';

  let {
    activeRole = 'student',
    isDarkMode = false,
    sidebarCollapsed = false,
    onToggleSidebar,
    onToggleTheme,
    onOpenSearch,
    onRoleChange
  }: {
    activeRole?: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio';
    isDarkMode?: boolean;
    sidebarCollapsed?: boolean;
    onToggleSidebar?: () => void;
    onToggleTheme?: () => void;
    onOpenSearch?: () => void;
    onRoleChange?: (role: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio') => void;
  } = $props();

  let isSigningOut = $state(false);

  async function handleSignOut() {
    if (isSigningOut) return;
    isSigningOut = true;
    try {
      if (import.meta.env.DEV) {
        await fetch('/api/auth/dev-switch', { method: 'DELETE' }).catch(() => {});
      }
      const res = await authClient.signOut();
      if (res?.error) {
        console.error('[auth] Failed to sign out via authClient:', res.error);
      }
      goto('/login');
    } catch (err) {
      console.error('[auth] Exception during sign out via authClient:', err);
      goto('/login');
    } finally {
      isSigningOut = false;
    }
  }

  function handleToggleTheme() {
    if (onToggleTheme) {
      onToggleTheme();
    } else if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.toggle('dark');
      if (isDark) {
        document.documentElement.classList.remove('light');
        localStorage.setItem('way_theme', 'dark');
      } else {
        document.documentElement.classList.add('light');
        localStorage.setItem('way_theme', 'light');
      }
    }
  }

  const currentPath = $derived(page.url.pathname);

  // Contextual breadcrumb text derived from route and role
  const breadcrumbText = $derived.by(() => {
    if (currentPath === '/student') return 'Today’s Mission';
    if (currentPath.startsWith('/student/progress')) return 'Capability Map';
    if (currentPath.startsWith('/student/pathways')) return 'Pathway Explorer';
    if (currentPath.startsWith('/student/mentor')) return 'Guided Thinking Studio';
    if (currentPath.startsWith('/student/assessment')) return 'Adaptive Diagnostic';
    if (currentPath === '/parent') return 'Family Overview';
    if (currentPath === '/teacher') return 'Instructional Priority Workspace';
    if (currentPath === '/counselor') return 'Caseload Management';
    if (currentPath === '/admin') return 'Institutional Administration';
    if (currentPath === '/studio' || currentPath === '/author') return 'Item Studio & Calibration';
    return 'Workspace';
  });

  // Profile data dynamically derived from authenticated session and active role
  const userProfile = $derived.by(() => {
    const authUser = page.data.user;
    const roleFallbackName =
      activeRole === 'student' ? 'Student Learner' :
      activeRole === 'parent' ? 'Parent Guardian' :
      activeRole === 'teacher' ? 'Lead Educator' :
      activeRole === 'counselor' ? 'Academic Counselor' :
      activeRole === 'admin' ? 'System Administrator' : 'Psychometrician';

    const name = authUser?.name || authUser?.email?.split('@')[0] || roleFallbackName;

    const descriptor =
      activeRole === 'student' ? 'Student Workspace' :
      activeRole === 'parent' ? 'Guardian Workspace' :
      activeRole === 'teacher' ? 'Educator Workspace' :
      activeRole === 'counselor' ? 'Counseling Advisory' :
      activeRole === 'admin' ? 'Institutional Administration' : 'Psychometric Calibration';

    const initials = name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join('') || (activeRole[0]?.toUpperCase() ?? 'U');

    return { name, descriptor, initials };
  });
</script>

<header class="h-14 border-b border-border bg-surface-raised/80 backdrop-blur-sm px-4 flex items-center justify-between shrink-0 z-20">
  <!-- Left: Sidebar Toggle & Context Breadcrumb -->
  <div class="flex items-center gap-2 min-w-0">
    {#if onToggleSidebar}
      <button
        onclick={onToggleSidebar}
        class="p-1.5 -ml-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle transition-all duration-140 active:scale-95 cursor-pointer shrink-0"
        title={sidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
        aria-label="Toggle sidebar"
      >
        <PanelLeft class="w-4 h-4 transition-transform duration-140 hover:scale-105" />
      </button>
    {/if}
    <span class="text-xs font-mono uppercase tracking-wider text-ink-muted">
      {activeRole}
    </span>
    <span class="text-ink-muted text-xs">/</span>
    <span class="text-xs font-medium text-ink truncate transition-all duration-150">
      {breadcrumbText}
    </span>
  </div>

  <!-- Center: Spotlight Search Trigger (Cmd+K / Ctrl+K) -->
  <button
    onclick={onOpenSearch}
    class="hidden md:flex items-center justify-between w-64 lg:w-80 px-2.5 py-1 rounded-none bg-surface-subtle border border-border text-xs text-ink-muted hover:border-border-strong hover:text-ink transition-all duration-140 group cursor-pointer active:scale-[0.99]"
    aria-label="Open spotlight search"
  >
    <div class="flex items-center gap-2">
      <Search class="w-3.5 h-3.5 group-hover:scale-110 group-hover:text-brand transition-all duration-140" />
      <span class="transition-colors group-hover:text-ink">Search learners, evidence, missions...</span>
    </div>
    <kbd class="px-1.5 py-0.5 rounded-none bg-surface-raised border border-border text-[10px] font-mono text-ink-secondary group-hover:border-border-strong group-hover:text-ink transition-all duration-140 shadow-2xs">
      ⌘K
    </kbd>
  </button>

  <!-- Right: Controls & User Profile -->
  <div class="flex items-center gap-2">
    <!-- Dark Mode Toggle with Celestial Rotation -->
    <button
      onclick={handleToggleTheme}
      class="p-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle transition-all duration-140 active:scale-90 cursor-pointer overflow-hidden"
      title={isDarkMode ? 'Switch to Mineral White (Light)' : 'Switch to Linear Obsidian (Dark)'}
      aria-label="Toggle theme mode"
    >
      <span class="inline-flex items-center justify-center transition-transform duration-200 {isDarkMode ? 'rotate-0' : '-rotate-45'}">
        {#if isDarkMode}
          <Sun class="w-4 h-4 text-attention transition-transform duration-140 hover:rotate-45" />
        {:else}
          <Moon class="w-4 h-4 text-ink-muted transition-transform duration-140 hover:-rotate-12" />
        {/if}
      </span>
    </button>

    <!-- User Profile Dropdown Menu -->
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex items-center gap-1.5 p-1 rounded-none hover:bg-surface-subtle transition-colors cursor-pointer outline-hidden border border-transparent hover:border-border">
        <div class="w-7 h-7 rounded-none bg-surface-subtle border border-border text-ink flex items-center justify-center font-mono font-medium text-xs">
          {userProfile.initials}
        </div>
        <ChevronDown class="w-3 h-3 text-ink-muted" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" class="w-64 rounded-none p-1 shadow-md bg-surface-overlay border border-border">
        <!-- Profile Header In Menu -->
        <div class="px-2.5 py-2 border-b border-border mb-1">
          <p class="text-xs font-semibold text-ink">{userProfile.name}</p>
          <p class="text-[11px] text-ink-secondary">{userProfile.descriptor}</p>
        </div>

        <DropdownMenu.Item class="rounded-none text-xs cursor-pointer">
          <User class="w-3.5 h-3.5 mr-2 text-ink-muted" />
          <span>Your Profile</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item class="rounded-none text-xs cursor-pointer">
          <Shield class="w-3.5 h-3.5 mr-2 text-ink-muted" />
          <span>Privacy & Consent</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item class="rounded-none text-xs cursor-pointer">
          <Users class="w-3.5 h-3.5 mr-2 text-ink-muted" />
          <span>Connected Guardians</span>
        </DropdownMenu.Item>

        <!-- Contextual / Developer Workspace Switcher -->
        {#if import.meta.env.DEV}
          <DropdownMenu.Separator />
          <div class="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
            <Wrench class="w-3 h-3" />
            <span>Dev Role Switcher</span>
          </div>

          {#each ['student', 'parent', 'teacher', 'counselor', 'admin', 'studio'] as role}
            <DropdownMenu.Item
              onclick={() => onRoleChange?.(role as any)}
              class="rounded-none text-xs cursor-pointer capitalize flex items-center justify-between"
            >
              <span>{role} Workspace</span>
              {#if activeRole === role}
                <Check class="w-3.5 h-3.5 text-brand" />
              {/if}
            </DropdownMenu.Item>
          {/each}
        {/if}

        <DropdownMenu.Separator />

        <DropdownMenu.Item onclick={handleSignOut} class="rounded-none text-xs text-critical cursor-pointer">
          <LogOut class="w-3.5 h-3.5 mr-2" />
          <span>Sign Out</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
