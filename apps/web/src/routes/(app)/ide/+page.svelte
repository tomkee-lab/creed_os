<script lang="ts">
  import BrowserIDE from '$lib/components/ide/BrowserIDE.svelte';
  import { TerminalSquare, Cpu, Layers, Code2, Sparkles, Maximize2 } from 'lucide-svelte';

  let currentStage = $state<'primary' | 'middle' | 'secondary'>('primary');
  let isIdeFullscreen = $state(false);
</script>

<svelte:head>
  <title>Robotics IDE & Hardware Runtime — CREED OS</title>
  <meta
    name="description"
    content="Zero-install browser robotics IDE powered by Pyodide WebAssembly, Web Serial API, and Scratch 3.0 blocks."
  />
</svelte:head>

<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
  <!-- Section Kicker Header -->
  <div class="space-y-2 pb-4 border-b border-border/60">
    <div class="inline-flex items-center gap-2 px-3 py-0.5 rounded-none bg-surface/90 border border-border text-[11px] font-mono text-ink-secondary shadow-xs">
      <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
      <span class="tracking-wide">01 · K-12 ROBOTICS DEVELOPMENT ENVIRONMENT</span>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink font-heading">
          Robotics IDE & Hardware Runtime
        </h1>
        <p class="text-xs sm:text-sm text-ink-secondary mt-1 max-w-xl leading-relaxed">
          Fluid progression from Primary (visual blocks & Scratch extensions) to Middle (dual-pane live Python translation) to Secondary (Monaco + Pyodide).
        </p>
      </div>

      <!-- Action: Launch Fullscreen Studio -->
      <button
        onclick={() => (isIdeFullscreen = true)}
        class="flex items-center gap-2 px-3.5 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground font-mono text-xs font-bold transition-micro shadow-xs shrink-0 self-start sm:self-auto"
        title="Expand the entire Robotics IDE to an immersive full-screen studio"
      >
        <Maximize2 class="size-3.5" />
        <span>Launch Fullscreen Studio ↗</span>
      </button>
    </div>
  </div>

  <!-- IDE Workbench Frame -->
  <div class="rounded-none shadow-sm overflow-hidden border border-border">
    <BrowserIDE bind:stage={currentStage} bind:isFullscreen={isIdeFullscreen} />
  </div>

  <!-- Architectural Highlights (3 Columns) -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
    <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
      <span class="font-mono text-brand font-bold uppercase text-[10px]">Client-Side Pyodide Sandbox</span>
      <p class="text-ink-secondary leading-relaxed text-[11px]">
        Python compiles and executes inside an isolated WebAssembly Web Worker with real-time 20Hz robotics telemetry.
      </p>
    </div>
    <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
      <span class="font-mono text-mint font-bold uppercase text-[10px]">Hardware Flashing & Telemetry</span>
      <p class="text-ink-secondary leading-relaxed text-[11px]">
        Web Serial API for ESP32 microcontrollers and WebUSB API via dapjs for BBC micro:bit devices.
      </p>
    </div>
    <div class="p-4 border border-border bg-surface space-y-1.5 shadow-2xs">
      <span class="font-mono text-cyan font-bold uppercase text-[10px]">Scratch 3.0 & Turtle Pen</span>
      <p class="text-ink-secondary leading-relaxed text-[11px]">
        Client-side .sb3 project archive decompression, 5 modular domain extension packs, and SVG arena path tracing.
      </p>
    </div>
  </div>
</div>
