<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  import {
    Compass,
    GraduationCap,
    Users,
    Activity,
    Shield,
    Sparkles,
    BrainCircuit,
    Menu,
    X,
    BookOpen,
    Building2,
    Sliders,
    Sun,
    Moon,
    ChevronDown,
    Check,
    Wrench
  } from 'lucide-svelte';

  let { data, children } = $props();

  let mobileNavOpen = $state(false);
  let devMenuOpen = $state(false);
  let isDarkMode = $state(false);

  onMount(() => {
    // Light mode default across all experience roles
    const savedTheme = localStorage.getItem('way_theme');
    if (savedTheme === 'dark') {
      isDarkMode = true;
      document.documentElement.classList.add('dark');
    } else {
      isDarkMode = false;
      document.documentElement.classList.remove('dark');
    }
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

  function closeMobileNav() {
    mobileNavOpen = false;
  }

  // Determine current active persona based on route
  const currentPath = $derived(page.url.pathname);
  const activeRole = $derived.by(() => {
    if (currentPath.startsWith('/student')) return 'student';
    if (currentPath.startsWith('/parent')) return 'parent';
    if (currentPath.startsWith('/teacher')) return 'teacher';
    if (currentPath.startsWith('/counselor')) return 'counselor';
    if (currentPath.startsWith('/admin')) return 'admin';
    if (currentPath.startsWith('/author')) return 'author';
    return 'public';
  });

  // Persona directory for DEV Role Switcher Dock
  const personas = [
    { id: 'student', label: 'Student Experience', sublabel: 'Anaya Verma (Class 8)', href: '/student', icon: GraduationCap },
    { id: 'parent', label: 'Parent Portal', sublabel: 'Rajesh Verma (Father)', href: '/parent', icon: Shield },
    { id: 'teacher', label: 'Teacher Copilot', sublabel: 'Meera Sen (Class 8-A)', href: '/teacher', icon: Users },
    { id: 'counselor', label: 'Counselor Center', sublabel: 'Dr. Rao (Caseload)', href: '/counselor', icon: BookOpen },
    { id: 'admin', label: 'Admin Console', sublabel: 'Institutional Operations', href: '/admin', icon: Building2 },
    { id: 'author', label: 'Item Studio', sublabel: 'Psychometric Calibration', href: '/author', icon: Sliders }
  ];

  // Contextual navigations per role (Cognitive job aligned)
  const studentNav = [
    { href: '/student', label: 'Today & Map', icon: GraduationCap, match: (p: string) => p === '/student' },
    { href: '/student/assessment', label: 'Quick Diagnostic', icon: Activity, match: (p: string) => p === '/student/assessment' },
    { href: '/student/pathways', label: 'Explore Fields', icon: Compass, match: (p: string) => p === '/student/pathways' },
    { href: '/student/mentor', label: 'Socratic Guide', icon: Sparkles, match: (p: string) => p === '/student/mentor' }
  ];

  const parentNav = [
    { href: '/parent', label: 'Family Overview', icon: Shield, match: (p: string) => p === '/parent' },
    { href: '/parent#strengths', label: 'Growth & Strengths', icon: GraduationCap, match: () => false },
    { href: '/parent#pathways', label: 'Field Horizons', icon: Compass, match: () => false },
    { href: '/parent#evidence', label: 'Verified Evidence', icon: BookOpen, match: () => false }
  ];

  const teacherNav = [
    { href: '/teacher', label: 'Action Queue', icon: Users, match: (p: string) => p === '/teacher' },
    { href: '/teacher#roster', label: 'Learners', icon: GraduationCap, match: () => false },
    { href: '/teacher#clusters', label: 'Interventions', icon: Activity, match: () => false }
  ];

  const counselorNav = [
    { href: '/counselor', label: 'Caseload', icon: BookOpen, match: (p: string) => p === '/counselor' },
    { href: '/counselor#referrals', label: 'Priority Cases', icon: Compass, match: () => false },
    { href: '/counselor#evidence', label: 'Longitudinal Evidence', icon: Activity, match: () => false }
  ];

  const adminNav = [
    { href: '/admin', label: 'Operations & Audit', icon: Building2, match: (p: string) => p === '/admin' },
    { href: '/admin#learners', label: 'Learners', icon: Users, match: () => false },
    { href: '/admin#consent', label: 'Consent State', icon: Shield, match: () => false },
    { href: '/admin#audit', label: 'Audit Trail', icon: Activity, match: () => false }
  ];

  const authorNav = [
    { href: '/author', label: 'Item Bank', icon: Sliders, match: (p: string) => p === '/author' },
    { href: '/author#calibration', label: 'Calibration', icon: Activity, match: () => false },
    { href: '/author#new', label: 'Author Item', icon: Sparkles, match: () => false }
  ];

  const publicNav = [
    { href: '/student', label: 'Student View', icon: GraduationCap, match: () => false },
    { href: '/parent', label: 'Parent View', icon: Shield, match: () => false },
    { href: '/teacher', label: 'Educator View', icon: Users, match: () => false },
    { href: '/admin', label: 'Console View', icon: Building2, match: () => false }
  ];

  const currentRoleNav = $derived.by(() => {
    switch (activeRole) {
      case 'student': return studentNav;
      case 'parent': return parentNav;
      case 'teacher': return teacherNav;
      case 'counselor': return counselorNav;
      case 'admin': return adminNav;
      case 'author': return authorNav;
      default: return publicNav;
    }
  });

  const activePersonaInfo = $derived(
    personas.find(p => p.id === activeRole) || {
      id: 'public',
      label: 'CREED OS',
      sublabel: 'Learner Intelligence',
      href: '/',
      icon: BrainCircuit
    }
  );
</script>

<div class="min-h-screen bg-(--surface-canvas) text-(--text-primary) font-sans flex flex-col transition-colors duration-200">
  <!-- Role-Contextual Navigation Bar -->
  <header class="sticky top-0 z-40 border-b border-(--border-subtle) bg-(--surface-raised)/95 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Brand & Product Title (Clean, authorial, no internal badges) -->
      <a href="/" class="flex items-center gap-2.5 group" onclick={closeMobileNav}>
        <div class="w-8 h-8 rounded-sm bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105 border border-(--border-subtle)">
          <BrainCircuit class="w-4 h-4" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold tracking-tight text-(--text-primary) text-base">CREED OS</span>
          {#if activeRole !== 'public'}
            <span class="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-(--surface-content) text-(--text-secondary) border border-(--border-subtle) capitalize">
              {activeRole}
            </span>
          {/if}
        </div>
      </a>

      <!-- Contextual Role Navigation (Desktop) -->
      <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
        {#each currentRoleNav as link}
          {@const isActive = link.match(currentPath)}
          <a
            href={link.href}
            class="px-3 py-1.5 rounded-sm transition-all duration-140 flex items-center gap-2 {isActive ? 'bg-(--surface-content) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-content)/60'}"
          >
            <link.icon class="w-4 h-4 {isActive ? 'text-(--accent-primary)' : 'text-(--text-muted)'}" />
            <span>{link.label}</span>
          </a>
        {/each}
      </nav>

      <!-- Right Header Actions: Theme Toggle + Profile Initials + Mobile Hamburger -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Quick Theme Toggle -->
        <button
          onclick={toggleTheme}
          class="w-8 h-8 rounded-sm flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-content) transition-colors border border-(--border-subtle) cursor-pointer"
          aria-label="Toggle light/dark theme"
          title="Toggle light/dark theme"
        >
          {#if isDarkMode}
            <Sun class="w-4 h-4 text-amber-400" />
          {:else}
            <Moon class="w-4 h-4 text-slate-600" />
          {/if}
        </button>

        <!-- Current User Profile Avatar (Human-first) -->
        {#if activeRole !== 'public'}
          <div class="hidden sm:flex items-center gap-2.5 pl-2 border-l border-(--border-subtle)">
            <div class="text-right">
              <p class="text-xs font-semibold text-(--text-primary)">{activePersonaInfo.sublabel}</p>
              <p class="text-[10px] text-(--text-muted) capitalize">{activeRole} Portal</p>
            </div>
            <div class="w-8 h-8 rounded-sm bg-(--accent-primary-subtle) text-(--accent-primary) font-semibold text-xs flex items-center justify-center border border-(--border-subtle)">
              {#if activeRole === 'student'}AV
              {:else if activeRole === 'parent'}RV
              {:else if activeRole === 'teacher'}MS
              {:else if activeRole === 'counselor'}CR
              {:else if activeRole === 'admin'}AD
              {:else if activeRole === 'author'}PS
              {:else}CR
              {/if}
            </div>
          </div>
        {/if}

        <!-- Mobile hamburger -->
        <button
          id="mobile-nav-toggle"
          class="md:hidden w-8 h-8 flex items-center justify-center rounded-sm text-(--text-secondary) hover:bg-(--surface-content) transition-colors border border-(--border-subtle)"
          onclick={() => (mobileNavOpen = !mobileNavOpen)}
          aria-label="Toggle navigation menu"
        >
          {#if mobileNavOpen}
            <X class="w-5 h-5" />
          {:else}
            <Menu class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    {#if mobileNavOpen}
      <div class="md:hidden border-t border-(--border-subtle) bg-(--surface-raised) px-4 py-3 space-y-1">
        {#each currentRoleNav as link}
          {@const isActive = link.match(currentPath)}
          <a
            href={link.href}
            onclick={closeMobileNav}
            class="flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-medium transition-colors {isActive ? 'bg-(--surface-content) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-secondary) hover:bg-(--surface-content)'}"
          >
            <link.icon class="w-4 h-4 {isActive ? 'text-(--accent-primary)' : 'text-(--text-muted)'}" />
            <span>{link.label}</span>
          </a>
        {/each}
      </div>
    {/if}
  </header>

  <!-- Main Content Viewport -->
  <main class="flex-1">
    {@render children()}
  </main>

  <!-- Global Footer (Clean, honest, non-cluttered) -->
  <footer class="border-t border-(--border-subtle) bg-(--surface-raised)/60 py-6 text-xs text-(--text-muted)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <div class="space-y-0.5">
        <p class="font-medium text-(--text-secondary)">CREED OS • Longitudinal Learner Intelligence & Navigation Platform</p>
        <p>Evidence Before Inference. Growth Before Labeling. Deterministic Assessment Scoring.</p>
      </div>
      <div class="flex items-center gap-3 text-[11px]">
        <span class="inline-flex items-center gap-1 text-(--text-secondary)">
          <Shield class="w-3 h-3 text-(--accent-success)" />
          Child Privacy & Consent Protected
        </span>
        <span>•</span>
        <a href="/docs" class="hover:text-(--text-primary) underline">Documentation</a>
        <span>•</span>
        <a href="/" class="hover:text-(--text-primary) underline">Home</a>
      </div>
    </div>
  </footer>

  <!-- Floating DEV Role Switcher Dock (Internal Developer / Stakeholder Inspection Tool) -->
  <aside class="fixed bottom-4 right-4 z-50 select-none print:hidden" aria-label="Developer Role Switcher">
    <div class="relative">
      {#if devMenuOpen}
        <!-- Backdrop to close -->
        <button
          class="fixed inset-0 bg-black/10 z-40 backdrop-blur-[1px] cursor-default"
          onclick={() => (devMenuOpen = false)}
          aria-label="Close developer menu"
        ></button>

        <!-- Popover Menu -->
        <div class="absolute bottom-11 right-0 z-50 w-72 surface-elevated rounded-sm p-2 shadow-2xl border border-(--border-subtle) space-y-1 animate-in fade-in zoom-in-95 duration-140">
          <div class="px-3 py-1.5 border-b border-(--border-subtle) flex items-center justify-between">
            <span class="text-[11px] font-semibold text-(--text-secondary) uppercase tracking-wider flex items-center gap-1.5">
              <Wrench class="w-3 h-3 text-(--accent-warning)" />
              Internal Role Inspector
            </span>
            <span class="text-[9px] px-1.5 py-0.5 rounded-sm bg-(--accent-warning-subtle) text-(--accent-warning) border border-(--border-subtle) font-mono">
              DEV ONLY
            </span>
          </div>

          <div class="max-h-80 overflow-y-auto space-y-0.5 py-1">
            {#each personas as p}
              {@const isSelected = p.id === activeRole}
              <a
                href={p.href}
                onclick={() => (devMenuOpen = false)}
                class="flex items-center justify-between p-2 rounded-sm text-xs transition-colors {isSelected ? 'bg-(--accent-primary-subtle) text-(--accent-primary) font-semibold border border-(--border-subtle)' : 'text-(--text-primary) hover:bg-(--surface-content)'}"
              >
                <div class="flex items-center gap-2.5">
                  <p.icon class="w-4 h-4 shrink-0 {isSelected ? 'text-(--accent-primary)' : 'text-(--text-muted)'}" />
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span>{p.label}</span>
                      {#if isSelected}
                        <Check class="w-3 h-3 text-(--accent-primary)" />
                      {/if}
                    </div>
                    <span class="text-[10px] text-(--text-muted) block font-normal">{p.sublabel}</span>
                  </div>
                </div>
              </a>
            {/each}
          </div>

          <div class="pt-1.5 border-t border-(--border-subtle) flex items-center justify-between px-2 text-[11px]">
            <span class="text-(--text-muted)">Theme Mode:</span>
            <button
              onclick={toggleTheme}
              class="flex items-center gap-1 text-(--text-secondary) hover:text-(--text-primary) font-medium px-2 py-1 rounded-sm bg-(--surface-content) transition-colors border border-(--border-subtle) cursor-pointer"
            >
              {#if isDarkMode}
                <Moon class="w-3 h-3 text-amber-400" /> Dark Slate
              {:else}
                <Sun class="w-3 h-3 text-amber-500" /> Mineral White
              {/if}
            </button>
          </div>
        </div>
      {/if}

      <!-- Compact Trigger Pill Button with distinct DEV branding -->
      <button
        onclick={() => (devMenuOpen = !devMenuOpen)}
        class="flex items-center gap-2 px-3 py-1.5 rounded-sm surface-card text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) shadow-md hover:shadow-lg transition-all border border-(--border-subtle) cursor-pointer bg-(--surface-raised)/90 backdrop-blur-sm"
        aria-label="Open developer persona switcher"
        aria-expanded={devMenuOpen}
        title="Developer Persona Inspector (Internal Demo Only)"
      >
        <Wrench class="w-3.5 h-3.5 text-(--text-muted)" />
        <span class="text-[11px] font-mono tracking-tight text-(--text-muted)">DEV:</span>
        <span class="font-semibold text-xs text-(--text-primary) capitalize">{activeRole}</span>
        <ChevronDown class="w-3 h-3 text-(--text-muted) transition-transform {devMenuOpen ? 'rotate-180' : ''}" />
      </button>
    </div>
  </aside>
</div>
