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
    ArrowUpRight,
    Check
  } from 'lucide-svelte';

  let { data, children } = $props();

  let mobileNavOpen = $state(false);
  let personaMenuOpen = $state(false);
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

  // Persona directory for the floating Persona Switcher Dock
  const personas = [
    { id: 'student', label: 'Student Experience', sublabel: 'Anaya Verma (Class 8)', href: '/student', icon: GraduationCap, badge: 'Lagom' },
    { id: 'parent', label: 'Parent Portal', sublabel: 'Rajesh Verma (Father)', href: '/parent', icon: Shield, badge: 'Family' },
    { id: 'teacher', label: 'Teacher Copilot', sublabel: 'Meera Sen (Class 8-A)', href: '/teacher', icon: Users, badge: 'Educator' },
    { id: 'counselor', label: 'Counselor Center', sublabel: 'Dr. Rao (Caseload)', href: '/counselor', icon: BookOpen, badge: 'Guidance' },
    { id: 'admin', label: 'Admin Console', sublabel: 'Institutional Operations', href: '/admin', icon: Building2, badge: 'Carbon' },
    { id: 'author', label: 'Item Studio', sublabel: 'Psychometric Authoring', href: '/author', icon: Sliders, badge: '3PL IRT' }
  ];

  // Contextual navigations per role (No universal kitchen sink)
  const studentNav = [
    { href: '/student', label: 'My Map', icon: GraduationCap, match: (p: string) => p === '/student' },
    { href: '/student/assessment', label: 'Diagnostic Check', icon: Activity, match: (p: string) => p === '/student/assessment' },
    { href: '/student/pathways', label: 'Explore Pathways', icon: Compass, match: (p: string) => p === '/student/pathways' },
    { href: '/student/mentor', label: 'Socratic Guide', icon: Sparkles, match: (p: string) => p === '/student/mentor' }
  ];

  const parentNav = [
    { href: '/parent', label: 'Overview', icon: Shield, match: (p: string) => p === '/parent' },
    { href: '/parent#strengths', label: 'Strengths & Growth', icon: GraduationCap, match: () => false },
    { href: '/parent#pathways', label: 'Pathway Alignment', icon: Compass, match: () => false },
    { href: '/parent#evidence', label: 'Verified Evidence', icon: BookOpen, match: () => false }
  ];

  const teacherNav = [
    { href: '/teacher', label: 'Action Queue', icon: Users, match: (p: string) => p === '/teacher' },
    { href: '/teacher#roster', label: 'Class Roster', icon: GraduationCap, match: () => false },
    { href: '/teacher#clusters', label: 'Misconceptions', icon: Activity, match: () => false }
  ];

  const counselorNav = [
    { href: '/counselor', label: 'Caseload', icon: BookOpen, match: (p: string) => p === '/counselor' },
    { href: '/counselor#referrals', label: 'Referrals & Triage', icon: Compass, match: () => false },
    { href: '/counselor#evidence', label: 'Evidence Stream', icon: Activity, match: () => false }
  ];

  const adminNav = [
    { href: '/admin', label: 'Institutional Overview', icon: Building2, match: (p: string) => p === '/admin' },
    { href: '/admin#learners', label: 'Learners', icon: Users, match: () => false },
    { href: '/admin#consent', label: 'Consent State', icon: Shield, match: () => false },
    { href: '/admin#audit', label: 'Audit Trail', icon: Activity, match: () => false }
  ];

  const authorNav = [
    { href: '/author', label: 'Item Bank', icon: Sliders, match: (p: string) => p === '/author' },
    { href: '/author#calibration', label: '3PL Calibration', icon: Activity, match: () => false },
    { href: '/author#new', label: 'Author Question', icon: Sparkles, match: () => false },
    { href: '/author#analytics', label: 'Item Curves', icon: Compass, match: () => false }
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
      label: 'Public Overview',
      sublabel: 'CREED OS Experience',
      href: '/',
      icon: BrainCircuit,
      badge: 'Editorial'
    }
  );
</script>

<div class="min-h-screen bg-(--surface-canvas) text-(--text-primary) font-sans flex flex-col transition-colors duration-200">
  <!-- Role-Contextual Navigation Bar -->
  <header class="sticky top-0 z-40 border-b border-(--border-subtle) bg-(--surface-raised)/95 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <!-- Brand & Product Title -->
      <a href="/" class="flex items-center gap-2.5 group" onclick={closeMobileNav}>
        <div class="w-8 h-8 rounded-lg bg-(--accent-primary-subtle) text-(--accent-primary) flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105">
          <BrainCircuit class="w-4 h-4" />
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold tracking-tight text-(--text-primary) text-base">CREED OS</span>
          <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-(--surface-sunken) text-(--text-secondary) border border-(--border-subtle)">
            {activePersonaInfo.badge}
          </span>
        </div>
      </a>

      <!-- Contextual Role Navigation (Desktop) -->
      <nav class="hidden md:flex items-center gap-1 text-sm font-medium">
        {#each currentRoleNav as link}
          {@const isActive = link.match(currentPath)}
          <a
            href={link.href}
            class="px-3 py-1.5 rounded-md transition-colors flex items-center gap-2 {isActive ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold' : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-sunken)/60'}"
          >
            <link.icon class="w-4 h-4 {isActive ? 'text-(--accent-primary)' : 'text-(--text-muted)'}" />
            <span>{link.label}</span>
          </a>
        {/each}
      </nav>

      <!-- Right Header Actions: Theme Toggle + Role Status + Mobile Hamburger -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Quick Theme Toggle -->
        <button
          onclick={toggleTheme}
          class="w-8 h-8 rounded-lg flex items-center justify-center text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--surface-sunken) transition-colors border border-(--border-subtle)"
          aria-label="Toggle light/dark theme"
          title="Toggle light/dark theme"
        >
          {#if isDarkMode}
            <Sun class="w-4 h-4 text-amber-400" />
          {:else}
            <Moon class="w-4 h-4 text-slate-600" />
          {/if}
        </button>

        <!-- Current Role Status Badge -->
        <div class="hidden sm:flex items-center gap-2.5 pl-2 border-l border-(--border-subtle)">
          <div class="text-right">
            <p class="text-xs font-semibold text-(--text-primary)">{activePersonaInfo.sublabel}</p>
            <p class="text-[10px] text-(--text-muted) capitalize">{activeRole} Workspace</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-(--accent-primary-subtle) text-(--accent-primary) font-semibold text-xs flex items-center justify-center border border-(--border-subtle)">
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

        <!-- Mobile hamburger -->
        <button
          id="mobile-nav-toggle"
          class="md:hidden w-8 h-8 flex items-center justify-center rounded-lg text-(--text-secondary) hover:bg-(--surface-sunken) transition-colors"
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
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors {isActive ? 'bg-(--surface-sunken) text-(--accent-primary) font-semibold' : 'text-(--text-secondary) hover:bg-(--surface-sunken)'}"
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

  <!-- Global Footer -->
  <footer class="border-t border-(--border-subtle) bg-(--surface-raised)/60 py-6 text-xs text-(--text-muted)">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
      <div class="space-y-0.5">
        <p class="font-medium text-(--text-secondary)">CREED OS • Continuous Learner Intelligence</p>
        <p>Calm Intelligence. Deterministic Psychometrics. NEP 2020 & DPDP Aligned.</p>
      </div>
      <div class="flex items-center gap-3 text-[11px]">
        <span class="inline-flex items-center gap-1 text-(--accent-success)">
          <span class="w-1.5 h-1.5 rounded-full bg-(--accent-success)"></span>
          DPDP Verified
        </span>
        <span>•</span>
        <span>3PL IRT Gauss-Hermite EAP</span>
        <span>•</span>
        <a href="/" class="hover:text-(--text-primary) underline">Overview</a>
      </div>
    </div>
  </footer>

  <!-- Floating Persona Switcher Dock (For rapid auditing & multi-role testing) -->
  <div class="fixed bottom-5 right-5 z-50">
    <div class="relative">
      {#if personaMenuOpen}
        <!-- Backdrop to close -->
        <button
          class="fixed inset-0 bg-black/20 z-40 backdrop-blur-[1px] cursor-default"
          onclick={() => (personaMenuOpen = false)}
          aria-label="Close role menu"
        ></button>

        <!-- Popover Menu -->
        <div class="absolute bottom-12 right-0 z-50 w-72 surface-elevated p-2 shadow-2xl border border-(--border-subtle) space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div class="px-3 py-1.5 border-b border-(--border-subtle) flex items-center justify-between">
            <span class="text-xs font-semibold text-(--text-secondary) uppercase tracking-wider">Switch Persona / Role</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-(--surface-sunken) text-(--text-muted)">Auditor Dock</span>
          </div>

          <div class="max-h-80 overflow-y-auto space-y-0.5 py-1">
            {#each personas as p}
              {@const isSelected = p.id === activeRole}
              <a
                href={p.href}
                onclick={() => (personaMenuOpen = false)}
                class="flex items-center justify-between p-2 rounded-lg text-xs transition-colors {isSelected ? 'bg-(--accent-primary-subtle) text-(--accent-primary) font-semibold' : 'text-(--text-primary) hover:bg-(--surface-sunken)'}"
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
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-(--surface-sunken) border border-(--border-subtle) text-(--text-muted)">
                  {p.badge}
                </span>
              </a>
            {/each}
          </div>

          <div class="pt-1.5 border-t border-(--border-subtle) flex items-center justify-between px-2 text-[11px]">
            <span class="text-(--text-muted)">Canvas Theme:</span>
            <button
              onclick={toggleTheme}
              class="flex items-center gap-1 text-(--text-secondary) hover:text-(--text-primary) font-medium px-2 py-1 rounded bg-(--surface-sunken) transition-colors"
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

      <!-- Trigger Pill Button -->
      <button
        onclick={() => (personaMenuOpen = !personaMenuOpen)}
        class="flex items-center gap-2 px-3.5 py-2 rounded-full surface-elevated text-xs font-medium text-(--text-primary) shadow-lg hover:shadow-xl transition-all border border-(--border-subtle) hover:scale-102 cursor-pointer"
        aria-label="Open persona switcher"
        aria-expanded={personaMenuOpen}
      >
        <activePersonaInfo.icon class="w-3.5 h-3.5 text-(--accent-primary)" />
        <span class="font-semibold">{activePersonaInfo.label}</span>
        <ChevronDown class="w-3.5 h-3.5 text-(--text-muted) transition-transform {personaMenuOpen ? 'rotate-180' : ''}" />
      </button>
    </div>
  </div>
</div>
