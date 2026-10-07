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
    { category: 'Learners', title: 'Anaya Verma', subtitle: 'Class 8-A · Advanced STEM / Math Gap', href: '/student/progress' },
    { category: 'Learners', title: 'Rohan Sharma', subtitle: 'Class 8-A · High Quantitative / Emerging Spatial', href: '/teacher#roster' },
    { category: 'Learners', title: 'Zoya Khan', subtitle: 'Class 8-A · Acceleration Case', href: '/counselor#priority' },
    { category: 'Pathways', title: 'Robotics & Autonomous Systems', subtitle: 'Engineering · 3 Verified Missions', href: '/student/pathways' },
    { category: 'Pathways', title: 'Data Intelligence & Machine Learning', subtitle: 'Computing & AI · 1 Mission', href: '/student/pathways' },
    { category: 'Pathways', title: 'Space Science & Orbital Mechanics', subtitle: 'Natural Sciences · Celestial Dynamics', href: '/student/pathways' },
    { category: 'Missions', title: 'RoboBridge Structural Optimization', subtitle: 'Robotics · Intermediate 45 min', href: '/student/assessment' },
    { category: 'Missions', title: 'Autonomous Maze Rover Navigation', subtitle: 'Robotics · Introductory 30 min', href: '/student/assessment' },
    { category: 'Missions', title: 'Urban Climate Heat-Island Discovery', subtitle: 'Data AI · Intermediate 35 min', href: '/student/assessment' },
    { category: 'Tools', title: 'Guided Thinking Studio', subtitle: 'Socratic Mentorship & Voice reasoning', href: '/student/mentor' },
    { category: 'Tools', title: 'Verified Consent Ledger', subtitle: 'DPDP Act compliance audit records', href: '/admin#consent' },
    { category: 'Tools', title: 'Item Bank & Calibration Studio', subtitle: 'Psychometric 3PL IRT authoring', href: '/author' }
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

  function selectItem(href: string) {
    open = false;
    searchQuery = '';
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
      class="w-full max-w-xl rounded-sm bg-surface-raised border border-border shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      onclick={(e) => e.stopPropagation()}
      onkeydown={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Spotlight search dialog"
      tabindex="-1"
    >
      <!-- Search Input Header -->
      <div class="flex items-center gap-2.5 px-3.5 py-3 border-b border-border bg-surface">
        <Search class="w-4 h-4 text-ink-muted shrink-0" />
        <input
          bind:value={searchQuery}
          type="text"
          placeholder="Search learners, pathways, evidence, actions..."
          class="flex-1 bg-transparent border-none text-xs text-ink placeholder:text-ink-muted outline-none"
        />
        {#if searchQuery}
          <button
            onclick={() => (searchQuery = '')}
            class="p-1 rounded-sm text-ink-muted hover:text-ink cursor-pointer"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        {/if}
        <kbd class="px-1.5 py-0.5 rounded-sm bg-surface-raised border border-border text-[10px] font-mono text-ink-secondary">
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
              class="w-full text-left px-2.5 py-2 rounded-sm text-xs hover:bg-surface-subtle flex items-center justify-between gap-3 group transition-colors cursor-pointer"
            >
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-ink group-hover:text-brand transition-colors truncate">
                    {item.title}
                  </span>
                  <span class="text-[10px] font-mono px-1 py-0.2 rounded-sm bg-surface-subtle border border-border text-ink-muted uppercase">
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
        <span class="font-mono text-[10px]">CREED OS Command & Intelligence Index</span>
        <span>Press <kbd class="px-1 py-0.2 rounded-sm bg-surface-raised border border-border">↵</kbd> to select</span>
      </div>
    </div>
  </div>
{/if}
