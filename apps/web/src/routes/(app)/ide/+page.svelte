<script lang="ts">
  import BrowserIDE from '$lib/components/ide/BrowserIDE.svelte';
  import WorkbenchShell from '$lib/components/workbench/WorkbenchShell.svelte';
  import {
    TerminalSquare,
    Cpu,
    Layers,
    Code2,
    Maximize2,
    Download,
    Play,
    RotateCcw,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Compass
  } from 'lucide-svelte';

  let currentStageIndex = $state<1 | 2 | 3>(1);
  let ideStage = $state<'primary' | 'middle' | 'secondary'>('primary');
  let dockCollapsed = $state(false);
  let isIdeFullscreen = $state(false);
  let socraticOpen = $state(false);
  let theoryOpen = $state(false);

  const stageTitles: Record<1 | 2 | 3, string> = {
    1: 'Visual Blocks',
    2: 'Dual-Pane Python',
    3: 'Pyodide WASM'
  };

  // Bidirectional synchronization between Workbench stepper and BrowserIDE stage
  $effect(() => {
    if (currentStageIndex === 1 && ideStage !== 'primary') ideStage = 'primary';
    else if (currentStageIndex === 2 && ideStage !== 'middle') ideStage = 'middle';
    else if (currentStageIndex === 3 && ideStage !== 'secondary') ideStage = 'secondary';
  });

  $effect(() => {
    if (ideStage === 'primary' && currentStageIndex !== 1) currentStageIndex = 1;
    else if (ideStage === 'middle' && currentStageIndex !== 2) currentStageIndex = 2;
    else if (ideStage === 'secondary' && currentStageIndex !== 3) currentStageIndex = 3;
  });

  const kpis = [
    { label: 'Pyodide WASM', value: 'Ready', unit: '32MB' },
    { label: 'Execution Tick', value: '60', unit: 'Hz' }
  ];
</script>

<svelte:head>
  <title>Robotics IDE & Hardware Runtime · CREED OS</title>
  <meta
    name="description"
    content="Zero-install browser robotics IDE powered by Pyodide WebAssembly, MicroPython artifact export, and Blockly."
  />
</svelte:head>

<WorkbenchShell
  title="Robotics IDE"
  bind:stage={currentStageIndex}
  stageLabels={['1. Visual Blocks', '2. Dual-Pane Python', '3. Pyodide WASM']}
  bind:dockCollapsed
  bind:socraticOpen
  bind:theoryOpen
  {kpis}
>
  {#snippet headerActions()}
    <button
      type="button"
      onclick={() => (isIdeFullscreen = !isIdeFullscreen)}
      class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-sm border border-border bg-surface hover:bg-surface-subtle text-ink-secondary cursor-pointer"
      title="Toggle Fullscreen Studio"
    >
      <Maximize2 class="size-3.5" />
      <span class="hidden sm:inline">Fullscreen</span>
    </button>
  {/snippet}

  {#snippet controls()}
    <div class="space-y-4 text-xs font-sans">
      <!-- Primary CTA: Continue to IDE Option / Focus Workspace -->
      <button
        type="button"
        onclick={() => (dockCollapsed = true)}
        class="w-full py-3 px-3 bg-brand text-brand-foreground font-semibold rounded-sm text-xs flex items-center justify-center gap-2 hover:bg-brand/90 transition-micro cursor-pointer shadow-xs active:scale-98"
        title="Maximize editor workspace"
      >
        <span>Start Coding in {stageTitles[currentStageIndex]}</span>
        <ArrowRight class="size-3.5" />
      </button>

      <!-- Stage Selector with Clear Active Feedback -->
      <div class="space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="font-bold text-ink uppercase text-[10px] font-mono tracking-wider block">Development Stage</span>
          <span class="text-[10px] font-mono text-brand font-semibold">Tier {currentStageIndex}/3</span>
        </div>
        <div class="grid grid-cols-1 gap-1.5">
          {#each [
            { s: 1, title: 'Primary Stage', desc: 'Visual blocks for foundational robotics algorithms' },
            { s: 2, title: 'Middle Stage', desc: 'Live side-by-side Blockly to Python AST generator' },
            { s: 3, title: 'Secondary Stage', desc: 'Professional Monaco editor + Pyodide sandbox' }
          ] as opt}
            <button
              type="button"
              onclick={() => (currentStageIndex = opt.s as 1 | 2 | 3)}
              class="p-3 text-left border rounded-sm transition-micro cursor-pointer relative {currentStageIndex === opt.s
                ? 'bg-surface-raised border-brand text-ink font-semibold ring-1 ring-brand'
                : 'bg-surface border-border hover:bg-surface-subtle text-ink-secondary'}"
            >
              <div class="flex items-center justify-between">
                <span class="font-bold text-ink">{opt.title}</span>
                {#if currentStageIndex === opt.s}
                  <CheckCircle2 class="size-3.5 text-brand" />
                {/if}
              </div>
              <div class="text-[11px] text-ink-muted mt-0.5">{opt.desc}</div>
            </button>
          {/each}
        </div>
      </div>

      <!-- Active Mission Context -->
      <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="font-bold text-ink text-[10px] font-mono uppercase tracking-wider block">Active Proving Ground</span>
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-brand/10 text-brand font-bold">Guided</span>
        </div>
        <div class="font-semibold text-xs text-ink">Autonomous Rover Navigation</div>
        <div class="text-[11px] text-ink-secondary leading-relaxed">
          Use visual blocks or Python to program differential-drive obstacle avoidance. Test in the 2D arena before flashing to physical hardware.
        </div>
      </div>

      <!-- Hardware Export Info -->
      <div class="p-3 bg-surface-raised border border-border rounded-sm space-y-2">
        <span class="font-bold text-ink text-[10px] font-mono uppercase tracking-wider block">Target Microcontroller</span>
        <div class="text-[11px] text-ink-secondary leading-relaxed">
          Export compiled MicroPython <code class="font-mono bg-surface-subtle px-1">.py</code> and UF2 artifacts directly for drag-and-drop hardware installation.
        </div>
      </div>
    </div>
  {/snippet}

  {#snippet canvas()}
    <div class="w-full h-full">
      <BrowserIDE bind:stage={ideStage} bind:isFullscreen={isIdeFullscreen} />
    </div>
  {/snippet}

  {#snippet socraticContent()}
    <div class="space-y-3 text-xs text-ink-secondary leading-relaxed font-sans">
      <p class="font-semibold text-ink">Autonomous Inquiry Coach:</p>
      <p>
        Notice how changing your sensor sampling rate in the loop affects rover steering responsiveness.
      </p>
      <div class="p-3 bg-surface-subtle border border-border rounded-sm text-xs font-mono text-ink">
        "What happens to the corner escape reliability when you reduce the ultrasonic detection distance from 25cm to 10cm?"
      </div>
    </div>
  {/snippet}

  {#snippet theoryContent()}
    <div class="space-y-3 text-xs text-ink-secondary leading-relaxed font-sans">
      <p class="font-semibold text-ink">Robotics Kinematics & Control Theory:</p>
      <p>
        Differential drive kinematics governs two-wheel mobile robots where linear velocity <code class="font-mono bg-surface-subtle px-1">v = (v_r + v_l) / 2</code> and angular velocity <code class="font-mono bg-surface-subtle px-1">ω = (v_r - v_l) / L</code>.
      </p>
      <p>
        Under zero-slip constraints, the instantaneous center of curvature (ICC) is dynamically adjusted by the differential speed ratio.
      </p>
    </div>
  {/snippet}
</WorkbenchShell>
