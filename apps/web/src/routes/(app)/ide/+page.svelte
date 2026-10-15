<script lang="ts">
  import BrowserIDE from '$lib/components/ide/BrowserIDE.svelte';
  import LivePortalsModal from '$lib/components/telemetry/LivePortalsModal.svelte';
  import { TerminalSquare, Cpu, Layers, Code2, Sparkles, Maximize2, Globe } from 'lucide-svelte';

  let currentStage = $state<'primary' | 'middle' | 'secondary'>('primary');
  let isIdeFullscreen = $state(false);
  let isMeshModalOpen = $state(false);
</script>

<svelte:head>
  <title>Robotics IDE & Hardware Runtime — CREED OS</title>
  <meta
    name="description"
    content="Zero-install browser robotics IDE powered by Pyodide WebAssembly, Web Serial API, and Scratch 3.0 blocks."
  />
</svelte:head>

<div class="w-full px-2 sm:px-4 lg:px-6 py-4 space-y-3">
  <!-- Dedicated Engineering Workbench Header (WAY 2.1 Quiet Editorial Intelligence) -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
    <div class="space-y-1">
      <div class="inline-flex items-center gap-2 px-2 py-0.5 rounded-none bg-surface border border-border text-[11px] font-mono text-ink-secondary">
        <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
        <span class="tracking-wide">K-12 ROBOTICS WORKSPACE · ZERO-INSTALL WASM RUNTIME</span>
      </div>
      <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-ink font-heading">
        Robotics IDE & Hardware Runtime
      </h1>
      <p class="text-xs text-ink-secondary max-w-2xl leading-relaxed">
        Autonomous robotics simulation, live Python translation, and direct hardware flashing for ESP32 and BBC micro:bit.
      </p>
    </div>

    <!-- Actions: Live Portals & Fullscreen -->
    <div class="flex flex-wrap items-center gap-2 shrink-0">
      <button
        onclick={() => (isMeshModalOpen = true)}
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-raised text-cyan border border-border text-xs font-mono rounded-none transition-micro shadow-2xs cursor-pointer"
        title="Open 3D Three.js Telemetry Mesh & Live Portals"
      >
        <Sparkles class="size-3.5" />
        <span>3D Mesh</span>
      </button>

      <a
        href="/observatory"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink border border-border text-xs font-mono rounded-none transition-micro shadow-2xs"
        title="Navigate to Planetary Telemetry & Earth Observation Studio"
      >
        <Globe class="size-3.5 text-cyan" />
        <span class="hidden sm:inline">Observatory ↗</span>
      </a>

      <a
        href="/sandbox"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink border border-border text-xs font-mono rounded-none transition-micro shadow-2xs"
        title="Navigate to Production Feature Sandbox"
      >
        <Layers class="size-3.5 text-mint" />
        <span class="hidden sm:inline">Sandbox ↗</span>
      </a>

      <button
        onclick={() => (isIdeFullscreen = true)}
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground font-mono text-xs font-semibold rounded-none transition-micro shadow-xs cursor-pointer"
        title="Expand the Robotics IDE to an immersive full-screen studio"
      >
        <Maximize2 class="size-3.5" />
        <span>Fullscreen Studio ↗</span>
      </button>
    </div>
  </div>

  <!-- Dedicated Full-Width IDE Workbench Frame -->
  <div class="rounded-none shadow-xs overflow-hidden border border-border bg-surface">
    <BrowserIDE bind:stage={currentStage} bind:isFullscreen={isIdeFullscreen} />
  </div>
</div>

<!-- Global 3D Three.js Telemetry Mesh Modal -->
<LivePortalsModal bind:isOpen={isMeshModalOpen} />

