<script lang="ts">
  import { page } from '$app/state';
  import {
    Compass,
    Sparkles,
    Activity,
    BookOpen,
    BrainCircuit,
    Users,
    Shield,
    GraduationCap,
    Layers,
    FileText,
    Settings,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    Target,
    Briefcase,
    Building2,
    Lock,
    FolderKanban,
    Wrench,
    CheckCircle2
  } from 'lucide-svelte';
  import CreedLogo from '$lib/components/brand/CreedLogo.svelte';

  let {
    collapsed = $bindable(false),
    activeRole = 'student',
    onRoleChange
  }: {
    collapsed?: boolean;
    activeRole?: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio';
    onRoleChange?: (role: string) => void;
  } = $props();

  function toggleCollapse() {
    collapsed = !collapsed;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('creed_sidebar_collapsed', String(collapsed));
      } catch {}
    }
  }

  const currentPath = $derived(page.url.pathname);

  interface NavItem {
    label: string;
    href: string;
    icon: any;
    badge?: string;
  }

  const roleNavItems = $derived.by<NavItem[]>(() => {
    switch (activeRole) {
      case 'student':
        return [
          { label: 'Today', href: '/student', icon: Compass },
          { label: 'My Map', href: '/student/pathways', icon: Layers },
          { label: 'Missions', href: '/student#missions', icon: Target },
          { label: 'Capabilities', href: '/student/progress', icon: Activity },
          { label: 'Evidence', href: '/student/progress#evidence', icon: CheckCircle2 },
          { label: 'Socratic Guide', href: '/student/mentor', icon: BrainCircuit }
        ];
      case 'parent':
        return [
          { label: 'Overview', href: '/parent', icon: Compass },
          { label: 'Growth', href: '/parent#growth', icon: Activity },
          { label: 'Shared Horizons', href: '/parent#horizons', icon: Layers },
          { label: 'Evidence', href: '/parent#evidence', icon: FileText },
          { label: 'Messages', href: '/parent#messages', icon: Users }
        ];
      case 'teacher':
        return [
          { label: 'Today', href: '/teacher', icon: Compass },
          { label: 'Classes', href: '/teacher#classes', icon: Users },
          { label: 'Learners', href: '/teacher#roster', icon: GraduationCap },
          { label: 'Interventions', href: '/teacher#interventions', icon: Sparkles, badge: '3' },
          { label: 'Missions', href: '/teacher#missions', icon: Target },
          { label: 'Evidence', href: '/teacher#evidence', icon: FileText }
        ];
      case 'counselor':
        return [
          { label: 'Caseload', href: '/counselor', icon: Users },
          { label: 'Priority Cases', href: '/counselor#priority', icon: Target, badge: '3' },
          { label: 'Learners', href: '/counselor#learners', icon: GraduationCap },
          { label: 'Evidence', href: '/counselor#evidence', icon: FileText },
          { label: 'Conversations', href: '/counselor#conversations', icon: BrainCircuit }
        ];
      case 'admin':
        return [
          { label: 'Overview', href: '/admin', icon: Compass },
          { label: 'Learners', href: '/admin#learners', icon: GraduationCap },
          { label: 'Organizations', href: '/admin#orgs', icon: Building2 },
          { label: 'Consent', href: '/admin#consent', icon: Lock },
          { label: 'Audit Trail', href: '/admin#audit', icon: Shield },
          { label: 'Settings', href: '/settings', icon: Settings }
        ];
      case 'studio':
        return [
          { label: 'Item Bank', href: '/studio', icon: FolderKanban },
          { label: 'Authoring', href: '/studio#authoring', icon: Wrench },
          { label: 'Calibration', href: '/studio#calibration', icon: Activity }
        ];
      default:
        return [];
    }
  });

  function isItemActive(href: string): boolean {
    if (href === currentPath) return true;
    if (
      href !== '/student' &&
      href !== '/parent' &&
      href !== '/teacher' &&
      href !== '/counselor' &&
      href !== '/admin' &&
      href !== '/studio' &&
      href !== '/author'
    ) {
      return currentPath.startsWith(href);
    }
    return false;
  }
</script>

<aside
  class="relative flex flex-col shrink-0 border-r border-border bg-surface transition-[width] duration-200 ease-in-out select-none overflow-x-hidden {collapsed
    ? 'w-16'
    : 'w-60'}"
  aria-label="Application Navigation"
>
  <!-- Brand / Workspace Identifier Header -->
  <div
    class="h-14 flex items-center {collapsed
      ? 'justify-center px-2'
      : 'justify-between px-3'} border-b border-border shrink-0"
  >
    {#if collapsed}
      <!-- Collapsed: Centered Brand Sigil Button (Click to Expand) -->
      <button
        type="button"
        onclick={toggleCollapse}
        class="w-10 h-10 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0 shadow-xs hover:bg-brand hover:text-brand-foreground transition-all cursor-pointer group"
        title="Expand sidebar (⌘B)"
        aria-label="Expand sidebar"
      >
        <CreedLogo size={22} class="transition-transform group-hover:scale-105" />
      </button>
    {:else}
      <!-- Expanded: Full Brand Lockup + Collapse Action -->
      <a href="/" class="flex items-center gap-2.5 overflow-hidden group min-w-0">
        <div
          class="w-8 h-8 rounded-none bg-brand/10 text-brand border border-brand/20 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-brand group-hover:text-brand-foreground transition-all"
        >
          <CreedLogo size={18} class="transition-transform group-hover:scale-105" />
        </div>
        <div class="flex flex-col min-w-0">
          <span
            class="font-heading font-semibold text-xs tracking-tight text-ink group-hover:text-brand transition-colors truncate"
          >
            CREED OS
          </span>
          <span class="text-[10px] uppercase font-mono tracking-wider text-ink-muted truncate">
            {activeRole} Workspace
          </span>
        </div>
      </a>

      <button
        type="button"
        onclick={toggleCollapse}
        class="p-1.5 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer shrink-0"
        title="Collapse sidebar (⌘B)"
        aria-label="Collapse sidebar"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>
    {/if}
  </div>

  <!-- Primary Navigation Items -->
  <nav
    class="flex-1 py-3 {collapsed
      ? 'px-2 flex flex-col items-center space-y-1.5'
      : 'px-2 space-y-0.5'} overflow-y-auto"
    aria-label="Role Navigation"
  >
    {#each roleNavItems as item}
      {@const active = isItemActive(item.href)}
      {@const Icon = item.icon}

      {#if collapsed}
        <!-- Collapsed: Centered square icon with active accent line -->
        <a
          href={item.href}
          class="relative flex items-center justify-center w-10 h-10 rounded-none transition-all duration-140 active:scale-95 group cursor-pointer {active
            ? 'bg-surface-raised text-brand shadow-xs border border-border'
            : 'text-ink-secondary hover:text-ink hover:bg-surface-subtle/80 hover:border hover:border-border/60'}"
          title={item.badge ? `${item.label} (${item.badge})` : item.label}
          aria-label={item.label}
        >
          <!-- Active Accent Line on Left Rail -->
          {#if active}
            <div class="absolute -left-2 top-2 bottom-2 w-0.75 bg-brand rounded-none shadow-2xs transition-all duration-200"></div>
          {/if}

          <Icon
            class="w-4.5 h-4.5 shrink-0 transition-all duration-140 group-hover:scale-105 {active
              ? 'text-brand'
              : 'text-ink-muted group-hover:text-ink'}"
          />

          <!-- Collapsed Micro Badge Notification Indicator -->
          {#if item.badge}
            <span
              class="absolute top-1.5 right-1.5 w-2 h-2 rounded-none bg-brand ring-2 ring-surface animate-pulse"
            ></span>
          {/if}
        </a>
      {:else}
        <!-- Expanded: Full row label with badge -->
        <a
          href={item.href}
          class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-none text-xs transition-all duration-140 hover:translate-x-0.5 active:scale-[0.99] group relative {active
            ? 'bg-surface-raised text-ink font-medium shadow-xs border border-border'
            : 'text-ink-secondary hover:text-ink hover:bg-surface-subtle/70'}"
        >
          <!-- Active accent indicator -->
          {#if active}
            <div class="absolute left-0 top-1.5 bottom-1.5 w-0.75 bg-brand rounded-none shadow-2xs transition-all duration-200"></div>
          {/if}

          <Icon
            class="w-4 h-4 shrink-0 transition-all duration-140 group-hover:scale-105 {active
              ? 'text-brand'
              : 'text-ink-muted group-hover:text-ink'}"
          />
          <span class="truncate flex-1">{item.label}</span>
          {#if item.badge}
            <span
              class="px-1.5 py-0.2 rounded-none text-[10px] font-mono bg-brand-subtle text-brand border border-brand/20 transition-transform duration-140 group-hover:scale-105"
            >
              {item.badge}
            </span>
          {/if}
        </a>
      {/if}
    {/each}
  </nav>

  <!-- Secondary Footer Actions -->
  <div
    class="p-2 border-t border-border {collapsed
      ? 'flex flex-col items-center space-y-1.5'
      : 'space-y-0.5'} shrink-0"
  >
    {#if collapsed}
      <!-- Collapsed: Centered Settings Icon -->
      <a
        href="/settings"
        class="relative flex items-center justify-center w-10 h-10 rounded-none text-ink-secondary hover:text-ink hover:bg-surface-subtle/80 transition-all cursor-pointer group"
        title="Settings"
        aria-label="Settings"
      >
        <Settings class="w-4.5 h-4.5 shrink-0 text-ink-muted group-hover:text-ink transition-colors" />
      </a>

      <!-- Collapsed: Centered Help Icon -->
      <a
        href="/help"
        class="relative flex items-center justify-center w-10 h-10 rounded-none text-ink-secondary hover:text-ink hover:bg-surface-subtle/80 transition-all duration-140 active:scale-95 cursor-pointer group"
        title="Help & Documentation"
        aria-label="Help & Documentation"
      >
        <HelpCircle class="w-4.5 h-4.5 shrink-0 text-ink-muted group-hover:text-ink group-hover:scale-105 transition-all duration-140" />
      </a>

      <!-- Collapsed: Expand Toggle Button at Bottom -->
      <button
        type="button"
        onclick={toggleCollapse}
        class="flex items-center justify-center w-10 h-10 rounded-none text-ink-muted hover:text-ink hover:bg-surface-subtle/80 transition-all duration-140 active:scale-95 cursor-pointer mt-1 border-t border-border/50 pt-1"
        title="Expand sidebar (⌘B)"
        aria-label="Expand sidebar"
      >
        <ChevronRight class="w-4 h-4 transition-transform duration-140 hover:scale-110" />
      </button>
    {:else}
      <!-- Expanded: Full row links -->
      <a
        href="/settings"
        class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-none text-xs text-ink-secondary hover:text-ink hover:bg-surface-subtle/70 transition-all duration-140 hover:translate-x-0.5 active:scale-[0.99]"
      >
        <Settings class="w-4 h-4 shrink-0 text-ink-muted" />
        <span>Settings</span>
      </a>
      <a
        href="/help"
        class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-none text-xs text-ink-secondary hover:text-ink hover:bg-surface-subtle/70 transition-all duration-140 hover:translate-x-0.5 active:scale-[0.99]"
      >
        <HelpCircle class="w-4 h-4 shrink-0 text-ink-muted" />
        <span>Help & Docs</span>
      </a>
      <button
        type="button"
        onclick={toggleCollapse}
        class="flex items-center justify-between w-full px-2.5 py-1.5 rounded-none text-xs text-ink-muted hover:text-ink hover:bg-surface-subtle/70 transition-all duration-140 active:scale-[0.99] cursor-pointer mt-1 pt-2 border-t border-border/60 group"
        aria-label="Collapse sidebar (⌘B)"
      >
        <span class="flex items-center gap-2.5">
          <ChevronLeft class="w-4 h-4 shrink-0 transition-transform duration-140 group-hover:-translate-x-0.5" />
          <span>Collapse</span>
        </span>
        <kbd class="px-1.5 py-0.2 rounded-none bg-surface-subtle border border-border text-[10px] font-mono text-ink-muted transition-colors group-hover:border-border-strong group-hover:text-ink">⌘B</kbd>
      </button>
    {/if}
  </div>
</aside>
