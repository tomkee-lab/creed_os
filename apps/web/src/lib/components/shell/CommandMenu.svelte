<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    Search,
    Compass,
    Layers,
    BrainCircuit,
    GraduationCap,
    FileText,
    Target,
    Settings,
    X,
    ArrowRight
  } from 'lucide-svelte';

  let {
    open = $bindable(false)
  }: {
    open?: boolean;
  } = $props();

  let searchQuery = $state('');

  const searchItems = [
    { category: 'Workspaces', title: 'Today’s Mission Dashboard', subtitle: 'Daily mission, focus challenges, and next actions', href: '/student' },
    { category: 'Workspaces', title: 'Capabilities & Progress', subtitle: 'Demonstrated strengths and qualitative developmental tiers', href: '/student/growth?tab=capabilities' },
    { category: 'Workspaces', title: 'Evidence Ledger', subtitle: 'Verified longitudinal demonstrations across projects and diagnostics', href: '/student/growth?tab=evidence' },
    { category: 'Workspaces', title: 'Pathway Explorer', subtitle: 'Experience authentic project missions before choosing streams', href: '/student/growth?tab=pathways' },
    { category: 'Workspaces', title: 'Adaptive Benchmark', subtitle: 'International calibrated 30Q diagnostic assessment', href: '/student/assessment' },
    { category: 'Workspaces', title: 'Diagnostic Report', subtitle: 'International benchmark report and 4-week growth roadmap', href: '/student/growth?tab=report' },
    { category: 'Workspaces', title: 'Classroom Cohort Roster', subtitle: 'Learner performance matrix and gap interventions', href: '/teacher/roster' },
    { category: 'Workspaces', title: 'Educator Lesson Studio', subtitle: 'AI co-designed lesson plans, syllabus mapping, and scaffolds', href: '/teacher/lessons' },
    { category: 'Workspaces', title: 'Counselor Advisory Caseload', subtitle: 'Priority case management and developmental plans', href: '/counselor' },
    { category: 'Workspaces', title: 'Parent Guardian Portal', subtitle: 'Holistic growth, milestone approvals, and statutory consent', href: '/parent' },
    { category: 'Tools', title: 'Robotics IDE', subtitle: 'Zero-install browser robotics IDE and Python translation', href: '/ide' },
    { category: 'Tools', title: 'Item Bank & Calibration Studio', subtitle: 'Psychometric 3PL IRT authoring and item bank', href: '/studio' },
    { category: 'Tools', title: 'System Administration & Consent Ledger', subtitle: 'DPDP Act statutory compliance audit records', href: '/admin' },
    { category: 'Missions', title: 'RoboBridge Structural Optimization', subtitle: 'Spatial Reasoning & Statics · Intermediate 20 min', href: '/student/missions/mission-gear-train' },
    { category: 'Missions', title: 'Urban Climate Heat-Island Discovery', subtitle: 'Data Intelligence & AI · Intermediate 25 min', href: '/student/missions/mission-telemetry-filter' },
    { category: 'Missions', title: 'Autonomous Maze Rover Navigation', subtitle: 'Robotics Kinematics · Introductory 30 min', href: '/student/missions' }
  ];

  const filteredItems = $derived.by(() => {
    if (!searchQuery.trim()) return searchItems.slice(0, 8);
    const q = searchQuery.toLowerCase();
    return searchItems.filter(
      (item) => item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  });

  onMount(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        open = !open;
      }
      if (e.key === 'Escape' && open) {
        open = false;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  async function selectItem(href: string) {
    open = false;
    searchQuery = '';
    if (import.meta.env.DEV) {
      if (href === '/studio') {
        await fetch('/api/auth/dev-switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'studio' })
        }).catch(() => {});
      } else if (href.startsWith('/admin')) {
        await fetch('/api/auth/dev-switch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'admin' })
        }).catch(() => {});
      }
    }
    goto(href);
  }
</script>

{#if open}
  <!-- Backdrop -->
  <div
    class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-xs flex items-start justify-center pt-[15vh] px-4 animate-in fade-in-0 duration-150"
    onclick={() => (open = false)}
    role="presentation"
  >
    <!-- Modal Card -->
    <div
      class="w-full max-w-xl rounded-none bg-surface-raised border border-border shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search dialog"
      tabindex="-1"
    >
      <!-- Search Input Header -->
      <div class="flex items-center gap-2 px-3.5 py-3 border-b border-border bg-surface">
        <Search class="w-4 h-4 text-ink-muted shrink-0" />
        <input
          bind:value={searchQuery}
          type="text"
          placeholder="Search learners, pathways, evidence, actions..."
          class="flex-1 bg-transparent border-none text-xs text-ink placeholder:text-ink-muted outline-none focus-visible:ring-0"
        />
        {#if searchQuery}
          <button
            onclick={() => (searchQuery = '')}
            class="p-1 rounded-none text-ink-muted hover:text-ink cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
            aria-label="Clear search query"
            title="Clear search query"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        {/if}
        <kbd class="px-1.5 py-0.5 rounded-none bg-surface-raised border border-border text-[10px] font-mono text-ink-secondary">
          ESC
        </kbd>
      </div>

      <!-- Results List -->
      <div class="max-h-80 overflow-y-auto p-1.5 space-y-0.5">
        {#if filteredItems.length === 0}
          <div class="py-8 text-center text-xs text-ink-muted">
            No matches found for "{searchQuery}"
          </div>
        {:else}
          {#each filteredItems as item}
            <button
              onclick={() => selectItem(item.href)}
              class="w-full text-left px-3 py-2 rounded-none text-xs hover:bg-surface-subtle flex items-center justify-between gap-3 group transition-colors cursor-pointer"
            >
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-ink group-hover:text-brand transition-colors truncate">
                    {item.title}
                  </span>
                  <span class="text-[10px] font-mono px-1 py-0.5 rounded-none bg-surface-subtle border border-border text-ink-muted uppercase">
                    {item.category}
                  </span>
                </div>
                <span class="text-[11px] text-ink-muted truncate mt-0.5">
                  {item.subtitle}
                </span>
              </div>
              <ArrowRight class="w-3.5 h-3.5 text-ink-muted opacity-0 group-hover:opacity-100 group-hover:text-brand transition-opacity shrink-0" />
            </button>
          {/each}
        {/if}
      </div>

      <!-- Footer Help Hints -->
      <div class="px-3.5 py-2 border-t border-border bg-surface-subtle flex items-center justify-between text-[11px] text-ink-muted">
        <span class="text-[10px] text-ink-muted font-medium">CREED OS Command & Intelligence Index</span>
        <span>Press <kbd class="px-1 py-0.5 rounded-none bg-surface-raised border border-border font-mono">↵</kbd> to select</span>
      </div>
    </div>
  </div>
{/if}
