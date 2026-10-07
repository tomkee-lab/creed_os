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
    BookOpen
  } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { authClient } from '$lib/auth-client';

  let {
    activeRole = 'student',
    isDarkMode = false,
    onToggleTheme,
    onOpenSearch,
    onRoleChange
  }: {
    activeRole?: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio';
    isDarkMode?: boolean;
    onToggleTheme?: () => void;
    onOpenSearch?: () => void;
    onRoleChange?: (role: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio') => void;
  } = $props();

  let isSigningOut = $state(false);

  async function handleSignOut() {
    if (isSigningOut) return;
    isSigningOut = true;
    try {
      const res = await authClient.signOut();
      if (res?.error) {
        console.error('[auth] Failed to sign out via authClient:', res.error);
        return;
      }
      goto('/login');
    } catch (err) {
      console.error('[auth] Exception during sign out via authClient:', err);
    } finally {
      isSigningOut = false;
    }
  }

  function handleToggleTheme() {
    if (onToggleTheme) {
      onToggleTheme();
    } else if (typeof document !== 'undefined') {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('way_theme', isDark ? 'dark' : 'light');
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

  // Profile data mapped by active persona
  const userProfile = $derived.by(() => {
    switch (activeRole) {
      case 'student':
        return {
          name: 'Anaya Verma',
          descriptor: 'Class 8 · Delhi Public International School',
          initials: 'AV'
        };
      case 'parent':
        return {
          name: 'Sunita Verma',
          descriptor: 'Parent · Anaya’s Guardian',
          initials: 'SV'
        };
      case 'teacher':
        return {
          name: 'Ms. Priya Nair',
          descriptor: 'Educator · Class 8-A Lead',
          initials: 'PN'
        };
      case 'counselor':
        return {
          name: 'Dr. Suresh Sharma',
          descriptor: 'Counselor · Middle Stage Caseload',
          initials: 'SS'
        };
      case 'admin':
        return {
          name: 'Admin Desk',
          descriptor: 'Delhi Public International School',
          initials: 'AD'
        };
      case 'studio':
        return {
          name: 'Dr. Evelyn Reed',
          descriptor: 'Psychometrician · CAT Calibration',
          initials: 'ER'
        };
    }
  });
</script>

<header class="h-14 border-b border-border bg-surface-raised/80 backdrop-blur-sm px-4 flex items-center justify-between shrink-0 z-20">
  <!-- Left: Context & Breadcrumb -->
  <div class="flex items-center gap-2 min-w-0">
    <span class="text-xs font-mono uppercase tracking-wider text-ink-muted">
      {activeRole}
    </span>
    <span class="text-ink-muted text-xs">/</span>
    <span class="text-xs font-medium text-ink truncate">
      {breadcrumbText}
    </span>
  </div>

  <!-- Center: Spotlight Search Trigger (Cmd+K / Ctrl+K) -->
  <button
    onclick={onOpenSearch}
    class="hidden md:flex items-center justify-between w-64 lg:w-80 px-2.5 py-1 rounded-sm bg-surface-subtle border border-border text-xs text-ink-muted hover:border-border-strong hover:text-ink transition-colors cursor-pointer"
    aria-label="Open spotlight search"
  >
    <div class="flex items-center gap-2">
      <Search class="w-3.5 h-3.5" />
      <span>Search learners, evidence, missions...</span>
    </div>
    <kbd class="px-1.5 py-0.5 rounded-sm bg-surface-raised border border-border text-[10px] font-mono text-ink-secondary">
      ⌘K
    </kbd>
  </button>

  <!-- Right: Controls & User Profile -->
  <div class="flex items-center gap-2">
    <!-- Dark Mode Toggle -->
    <button
      onclick={handleToggleTheme}
      class="p-1.5 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
      title={isDarkMode ? 'Switch to Mineral White (Light)' : 'Switch to Deep Slate (Dark)'}
      aria-label="Toggle theme mode"
    >
      {#if isDarkMode}
        <Sun class="w-4 h-4 text-amber-400" />
      {:else}
        <Moon class="w-4 h-4 text-ink-muted" />
      {/if}
    </button>

    <!-- User Profile Dropdown Menu -->
    <DropdownMenu.Root>
      <DropdownMenu.Trigger class="flex items-center gap-2.5 p-1 pl-2 rounded-sm hover:bg-surface-subtle transition-colors cursor-pointer outline-hidden border border-transparent hover:border-border">
        <div class="hidden sm:flex flex-col text-right">
          <span class="text-xs font-medium text-ink leading-tight">
            {userProfile.name}
          </span>
          <span class="text-[10px] text-ink-muted leading-tight truncate max-w-40">
            {userProfile.descriptor}
          </span>
        </div>
        <div class="w-7 h-7 rounded-sm bg-surface-subtle border border-border text-ink flex items-center justify-center font-mono font-medium text-xs">
          {userProfile.initials}
        </div>
        <ChevronDown class="w-3 h-3 text-ink-muted" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" class="w-64 rounded-sm p-1 shadow-md bg-surface-overlay border border-border">
        <!-- Profile Header In Menu -->
        <div class="px-2.5 py-2 border-b border-border mb-1">
          <p class="text-xs font-semibold text-ink">{userProfile.name}</p>
          <p class="text-[11px] text-ink-secondary">{userProfile.descriptor}</p>
        </div>

        <DropdownMenu.Item class="rounded-sm text-xs cursor-pointer">
          <User class="w-3.5 h-3.5 mr-2 text-ink-muted" />
          <span>Your Profile</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item class="rounded-sm text-xs cursor-pointer">
          <Shield class="w-3.5 h-3.5 mr-2 text-ink-muted" />
          <span>Privacy & Consent</span>
        </DropdownMenu.Item>

        <DropdownMenu.Item class="rounded-sm text-xs cursor-pointer">
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
              class="rounded-sm text-xs cursor-pointer capitalize flex items-center justify-between"
            >
              <span>{role} Workspace</span>
              {#if activeRole === role}
                <Check class="w-3.5 h-3.5 text-brand" />
              {/if}
            </DropdownMenu.Item>
          {/each}
        {/if}

        <DropdownMenu.Separator />

        <DropdownMenu.Item onclick={handleSignOut} class="rounded-sm text-xs text-critical cursor-pointer">
          <LogOut class="w-3.5 h-3.5 mr-2" />
          <span>Sign Out</span>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</header>
