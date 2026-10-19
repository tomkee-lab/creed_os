<script lang="ts">
  import {
    Compass,
    Sliders,
    Activity,
    ChevronLeft,
    ChevronRight,
    Brain,
    BookOpen,
    X,
    Maximize2,
    RotateCcw
  } from 'lucide-svelte';

  interface Props {
    title: string;
    stage?: 1 | 2 | 3;
    stageLabels?: [string, string, string];
    onStageChange?: (stage: 1 | 2 | 3) => void;
    dockCollapsed?: boolean;
    kpis?: Array<{ label: string; value: string | number; unit?: string }>;
    socraticOpen?: boolean;
    theoryOpen?: boolean;
    headerActions?: import('svelte').Snippet;
    controls?: import('svelte').Snippet;
    canvas?: import('svelte').Snippet;
    hudActions?: import('svelte').Snippet;
    socraticContent?: import('svelte').Snippet;
    theoryContent?: import('svelte').Snippet;
    children?: import('svelte').Snippet;
  }

  let {
    title,
    stage = $bindable(1),
    stageLabels = ['1. Explore', '2. Build & Tune', '3. Stress-Test'],
    onStageChange,
    dockCollapsed = $bindable(false),
    kpis = [],
    socraticOpen = $bindable(false),
    theoryOpen = $bindable(false),
    headerActions,
    controls,
    canvas,
    hudActions,
    socraticContent,
    theoryContent,
    children
  }: Props = $props();

  function selectStage(newStage: 1 | 2 | 3) {
    stage = newStage;
    onStageChange?.(newStage);
  }

  // Enforce max 2 KPIs in the floating bottom HUD pill
  const visibleKpis = $derived(kpis.slice(0, 2));
</script>

<div class="workbench-shell flex flex-col w-full h-[calc(100svh-4rem)] max-h-270 bg-canvas text-ink overflow-hidden border border-border select-none">
  <!-- 56px Progressive Stepper Header -->
  <header class="h-14 px-4 bg-surface border-b border-border flex items-center justify-between gap-4 shrink-0 z-20">
    <!-- Title & Mission Identity -->
    <div class="flex items-center gap-3 min-w-0">
      <div class="size-7 rounded-sm bg-brand/10 border border-brand/20 text-brand flex items-center justify-center shrink-0">
        <Compass class="size-4" />
      </div>
      <h2 class="font-heading font-bold text-xs sm:text-sm text-ink truncate">
        {title}
      </h2>
    </div>

    <!-- 3-Stage Progressive Stepper -->
    <nav class="hidden md:flex items-center p-0.5 rounded-sm bg-surface-subtle border border-border" aria-label="Workbench Stages">
      {#each [1, 2, 3] as s}
        <button
          type="button"
          onclick={() => selectStage(s as 1 | 2 | 3)}
          class="px-3 py-1 text-xs font-mono rounded-xs transition-micro flex items-center gap-1.5 cursor-pointer {stage === s
            ? 'bg-surface-raised text-brand font-bold shadow-2xs border border-border'
            : 'text-ink-secondary hover:text-ink'}"
        >
          <span class="size-1.5 rounded-none {stage === s ? 'bg-brand' : 'bg-ink-muted'}"></span>
          <span>{stageLabels[s - 1]}</span>
        </button>
      {/each}
    </nav>

    <!-- Header Actions & Drawer Triggers -->
    <div class="flex items-center gap-2 shrink-0">
      {#if headerActions}
        {@render headerActions()}
      {/if}

      <!-- Socratic Coach Trigger -->
      <button
        type="button"
        onclick={() => (socraticOpen = !socraticOpen)}
        class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-sm border transition-micro cursor-pointer {socraticOpen
          ? 'bg-brand text-brand-foreground border-brand font-bold'
          : 'bg-surface hover:bg-surface-subtle text-ink-secondary border-border'}"
        title="Open Socratic Dialogue Coach"
      >
        <Brain class="size-3.5" />
        <span class="hidden sm:inline">Coach</span>
      </button>

      <!-- Deep Theory Trigger -->
      <button
        type="button"
        onclick={() => (theoryOpen = !theoryOpen)}
        class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-sm border transition-micro cursor-pointer {theoryOpen
          ? 'bg-brand text-brand-foreground border-brand font-bold'
          : 'bg-surface hover:bg-surface-subtle text-ink-secondary border-border'}"
        title="Open First-Principles Theory Dossier"
      >
        <BookOpen class="size-3.5" />
        <span class="hidden sm:inline">Theory</span>
      </button>
    </div>
  </header>

  <!-- Main Split Body: Collapsible 35% Control Dock + >=65% Simulator Canvas -->
  <div class="flex-1 flex w-full overflow-hidden relative">
    <!-- Left: Collapsible 35% Control Dock -->
    <aside
      class="border-r border-border bg-surface transition-[width] duration-200 ease-lagom flex flex-col shrink-0 overflow-hidden z-10 {dockCollapsed
        ? 'w-12'
        : 'w-full sm:w-[35%] max-w-110 min-w-70'}"
    >
      <div class="h-9 px-3 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
        {#if !dockCollapsed}
          <span class="text-[10px] font-mono uppercase tracking-wider text-ink-muted font-bold flex items-center gap-1.5">
            <Sliders class="size-3 text-brand" />
            <span>Parameters & Directives</span>
          </span>
        {/if}

        <button
          type="button"
          onclick={() => (dockCollapsed = !dockCollapsed)}
          class="p-1 text-ink-muted hover:text-ink cursor-pointer ml-auto rounded-xs"
          title={dockCollapsed ? 'Expand Dock' : 'Collapse Dock'}
        >
          {#if dockCollapsed}
            <ChevronRight class="size-3.5" />
          {:else}
            <ChevronLeft class="size-3.5" />
          {/if}
        </button>
      </div>

      {#if !dockCollapsed}
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          {#if controls}
            {@render controls()}
          {:else if children}
            {@render children()}
          {/if}
        </div>
      {:else}
        <div class="flex-1 flex flex-col items-center py-4 space-y-4 text-ink-muted">
          <button
            type="button"
            onclick={() => (dockCollapsed = false)}
            class="p-1 hover:text-brand cursor-pointer"
            title="Expand Controls Dock"
          >
            <Sliders class="size-4" />
          </button>
        </div>
      {/if}
    </aside>

    <!-- Right: >=65% Interactive 2D Simulator Canvas Area -->
    <main class="flex-1 flex flex-col relative bg-canvas overflow-hidden min-w-0">
      <div class="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        {#if canvas}
          {@render canvas()}
        {/if}

        <!-- Floating Bottom HUD Pill: Max 2 .tabular-nums KPIs -->
        {#if visibleKpis.length > 0 || hudActions}
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 bg-surface/90 backdrop-blur-md border border-border rounded-sm shadow-md pointer-events-auto">
            {#each visibleKpis as kpi}
              <div class="flex items-baseline gap-1.5 font-mono text-xs">
                <span class="text-[10px] uppercase text-ink-muted">{kpi.label}:</span>
                <span class="font-bold text-ink tabular-nums">{kpi.value}</span>
                {#if kpi.unit}
                  <span class="text-[10px] text-ink-muted">{kpi.unit}</span>
                {/if}
              </div>
            {/each}

            {#if hudActions}
              <div class="h-3 w-px bg-border"></div>
              {@render hudActions()}
            {/if}
          </div>
        {/if}
      </div>
    </main>

    <!-- Slide-over Drawer 1: Socratic Coach -->
    {#if socraticOpen}
      <aside class="absolute inset-y-0 right-0 w-full sm:w-96 bg-surface border-l border-border shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
        <div class="h-12 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface-subtle">
          <div class="flex items-center gap-2">
            <Brain class="size-4 text-brand" />
            <h3 class="text-xs font-bold font-mono uppercase text-ink">Socratic Inquiry Coach</h3>
          </div>
          <button
            type="button"
            onclick={() => (socraticOpen = false)}
            aria-label="Close Socratic Inquiry Coach drawer"
            class="p-1 text-ink-muted hover:text-ink cursor-pointer rounded-xs"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          {#if socraticContent}
            {@render socraticContent()}
          {:else}
            <div class="text-xs text-ink-secondary leading-relaxed">
              Live physical telemetry from your simulation is actively synthesized into guided Socratic hints.
            </div>
          {/if}
        </div>
      </aside>
    {/if}

    <!-- Slide-over Drawer 2: Deep Theory -->
    {#if theoryOpen}
      <aside class="absolute inset-y-0 right-0 w-full sm:w-96 bg-surface border-l border-border shadow-xl z-30 flex flex-col animate-in slide-in-from-right duration-200">
        <div class="h-12 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface-subtle">
          <div class="flex items-center gap-2">
            <BookOpen class="size-4 text-brand" />
            <h3 class="text-xs font-bold font-mono uppercase text-ink">First-Principles Theory</h3>
          </div>
          <button
            type="button"
            onclick={() => (theoryOpen = false)}
            aria-label="Close First-Principles Theory drawer"
            class="p-1 text-ink-muted hover:text-ink cursor-pointer rounded-xs"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          {#if theoryContent}
            {@render theoryContent()}
          {:else}
            <div class="text-xs text-ink-secondary leading-relaxed">
              Mathematical invariants, statics equations, and physical governing laws for this mission.
            </div>
          {/if}
        </div>
      </aside>
    {/if}
  </div>
</div>
