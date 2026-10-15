<!-- apps/web/src/routes/(app)/observatory/+page.svelte -->
<script lang="ts">
  import PlanetaryStudio from '$lib/components/telemetry/PlanetaryStudio.svelte';
  import LivePortalsModal from '$lib/components/telemetry/LivePortalsModal.svelte';
  import {
    Globe,
    Shield,
    Sparkles,
    TerminalSquare,
    Target,
    Maximize2,
    Minimize2
  } from 'lucide-svelte';

  let isMeshModalOpen = $state(false);
  let isStudioFullscreen = $state(false);

  function toggleFullscreen() {
    isStudioFullscreen = !isStudioFullscreen;
  }
</script>

<svelte:head>
  <title>Earth & Space Planetary Observatory — CREED OS</title>
  <meta
    name="description"
    content="Production Earth Observation and Keplerian Planetary Telemetry Studio powered by Cesium 3D, SGP4 orbital propagation, crowdsourced ADS-B transponders, and multi-spectral sensors."
  />
</svelte:head>

{#if isStudioFullscreen}
  <!-- Immersive Full-Screen Observatory Studio -->
  <div class="fixed inset-0 z-50 flex flex-col bg-canvas text-ink overflow-hidden">
    <header class="flex h-11 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
      <div class="flex items-center gap-3">
        <button
          onclick={toggleFullscreen}
          class="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-raised hover:bg-surface text-ink text-xs font-mono border border-border rounded-none cursor-pointer transition-micro"
          title="Exit Fullscreen Mode"
        >
          <Minimize2 class="size-3.5 text-mint" />
          <span>Exit Fullscreen</span>
        </button>
        <span class="text-border">|</span>
        <div class="flex items-center gap-2">
          <Globe class="size-4 text-brand" />
          <span class="text-xs font-semibold tracking-wide text-ink font-mono uppercase">
            Earth & Space Planetary Observatory · Immersive Mode
          </span>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <button
          onclick={() => (isMeshModalOpen = true)}
          class="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-surface hover:bg-surface-raised text-cyan border border-border text-[11px] font-mono transition-micro shadow-2xs cursor-pointer"
        >
          <Sparkles class="size-3" />
          <span>3D Mesh</span>
        </button>

        <a
          href="/ide"
          class="inline-flex items-center gap-1.5 px-2 py-1 rounded-none bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink border border-border text-[11px] font-mono transition-micro shadow-2xs"
        >
          <TerminalSquare class="size-3 text-amber" />
          <span>Robotics IDE ↗</span>
        </a>

        <span class="inline-flex items-center gap-1 rounded-none bg-canvas px-2 py-0.5 text-[10px] font-mono text-mint border border-border">
          <Shield class="size-3" />
          100% Commercial Clean-Room
        </span>
      </div>
    </header>

    <main class="flex-1 overflow-hidden relative">
      <PlanetaryStudio />
    </main>
  </div>
{:else}
  <!-- Standard Workbench Frame inside Authenticated App Shell -->
  <div class="w-full px-2 sm:px-4 lg:px-6 py-4 space-y-3">
    <!-- Workbench Header (WAY 2.1 Quiet Editorial Intelligence) -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
      <div class="space-y-1">
        <div class="inline-flex items-center gap-2 px-2 py-0.5 rounded-none bg-surface border border-border text-[11px] font-mono text-ink-secondary">
          <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
          <span class="tracking-wide">PLANETARY TELEMETRY & EARTH OBSERVATION · SGP4 PROPAGATION</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-bold tracking-tight text-ink font-heading">
          Earth & Space Planetary Observatory
        </h1>
        <p class="text-xs text-ink-secondary max-w-2xl leading-relaxed">
          Real-time Keplerian orbital mechanics, live OpenSky aircraft transponders, multi-spectral FLIR & NVG sensor shaders, and applied STEM space missions.
        </p>
      </div>

      <!-- Action Bar -->
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
          href="/ide"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink border border-border text-xs font-mono rounded-none transition-micro shadow-2xs"
          title="Open Robotics IDE & Hardware Telemetry Blocks"
        >
          <TerminalSquare class="size-3.5 text-amber" />
          <span>Robotics IDE ↗</span>
        </a>

        <a
          href="/student/missions"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink border border-border text-xs font-mono rounded-none transition-micro shadow-2xs"
          title="View Applied Engineering & Robotics Missions"
        >
          <Target class="size-3.5 text-mint" />
          <span class="hidden sm:inline">Missions Hub ↗</span>
        </a>

        <button
          onclick={toggleFullscreen}
          class="inline-flex items-center gap-2 px-3 py-1.5 bg-brand hover:bg-brand/90 text-brand-foreground font-mono text-xs font-semibold rounded-none transition-micro shadow-xs cursor-pointer"
          title="Expand Observatory to Fullscreen"
        >
          <Maximize2 class="size-3.5" />
          <span>Fullscreen Studio ↗</span>
        </button>
      </div>
    </div>

    <!-- Full-Width Studio Frame -->
    <div class="h-[calc(100vh-12rem)] min-h-145 rounded-none shadow-xs overflow-hidden border border-border bg-surface relative">
      <PlanetaryStudio />
    </div>
  </div>
{/if}

<!-- Global 3D Three.js Telemetry Mesh Modal -->
<LivePortalsModal bind:isOpen={isMeshModalOpen} />
