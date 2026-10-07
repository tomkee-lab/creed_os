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

  let {
    collapsed = $bindable(false),
    activeRole = 'student',
    onRoleChange
  }: {
    collapsed?: boolean;
    activeRole?: 'student' | 'parent' | 'teacher' | 'counselor' | 'admin' | 'studio';
    onRoleChange?: (role: string) => void;
  } = $props();

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
    if (href !== '/student' && href !== '/parent' && href !== '/teacher' && href !== '/counselor' && href !== '/admin' && href !== '/studio' && href !== '/author') {
      return currentPath.startsWith(href);
    }
    return false;
  }
</script>

<aside
  class="relative flex flex-col shrink-0 border-r border-border bg-surface transition-all duration-200 select-none {collapsed ? 'w-17' : 'w-60'}"
  aria-label="Application Navigation"
>
  <!-- Brand / Workspace Identifier Header -->
  <div class="h-14 flex items-center justify-between px-3.5 border-b border-border">
    <a href="/" class="flex items-center gap-2.5 overflow-hidden group">
      <div class="w-7 h-7 rounded-sm bg-brand flex items-center justify-center shrink-0 text-white font-mono font-bold text-xs shadow-xs">
        C
      </div>
      {#if !collapsed}
        <div class="flex flex-col min-w-0">
          <span class="font-heading font-semibold text-xs tracking-tight text-ink group-hover:text-brand transition-colors truncate">
            CREED OS
          </span>
          <span class="text-[10px] uppercase font-mono tracking-wider text-ink-muted truncate">
            {activeRole} Workspace
          </span>
        </div>
      {/if}
    </a>

    <!-- Collapse Toggle Button -->
    <button
      onclick={() => (collapsed = !collapsed)}
      class="p-1 rounded-sm text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors cursor-pointer"
      title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {#if collapsed}
        <ChevronRight class="w-3.5 h-3.5" />
      {:else}
        <ChevronLeft class="w-3.5 h-3.5" />
      {/if}
    </button>
  </div>

  <!-- Primary Navigation Items -->
  <nav class="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto" aria-label="Role Navigation">
    {#each roleNavItems as item}
      {@const active = isItemActive(item.href)}
      {@const Icon = item.icon}
      <a
        href={item.href}
        class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs transition-colors group relative {active
          ? 'bg-surface-raised text-ink font-medium shadow-xs border border-border'
          : 'text-ink-secondary hover:text-ink hover:bg-surface-subtle/70'}"
        title={collapsed ? item.label : undefined}
      >
        <Icon class="w-4 h-4 shrink-0 {active ? 'text-brand' : 'text-ink-muted group-hover:text-ink'}" />
        {#if !collapsed}
          <span class="truncate flex-1">{item.label}</span>
          {#if item.badge}
            <span class="px-1.5 py-0.2 rounded-sm text-[10px] font-mono bg-brand-subtle text-brand border border-brand/20">
              {item.badge}
            </span>
          {/if}
        {/if}
      </a>
    {/each}
  </nav>

  <!-- Secondary Footer Actions -->
  <div class="p-2 border-t border-border space-y-0.5">
    <a
      href="/settings"
      class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs text-ink-secondary hover:text-ink hover:bg-surface-subtle/70 transition-colors"
      title={collapsed ? 'Settings' : undefined}
    >
      <Settings class="w-4 h-4 shrink-0 text-ink-muted" />
      {#if !collapsed}
        <span>Settings</span>
      {/if}
    </a>
    <a
      href="/help"
      class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-sm text-xs text-ink-secondary hover:text-ink hover:bg-surface-subtle/70 transition-colors"
      title={collapsed ? 'Help & Documentation' : undefined}
    >
      <HelpCircle class="w-4 h-4 shrink-0 text-ink-muted" />
      {#if !collapsed}
        <span>Help</span>
      {/if}
    </a>
  </div>
</aside>
