<!-- apps/web/src/routes/sandbox/globe/+page.svelte -->
<script lang="ts">
  import PlanetaryStudio from '$lib/components/telemetry/PlanetaryStudio.svelte';
  import LivePortalsModal from '$lib/components/telemetry/LivePortalsModal.svelte';
  import { ArrowLeft, Globe, Shield, Sparkles, TerminalSquare } from 'lucide-svelte';

  let isMeshModalOpen = $state(false);
</script>

<svelte:head>
  <title>Planetary Telemetry & Earth Observation Studio — CREED OS</title>
</svelte:head>

<div class="relative flex h-screen w-screen flex-col overflow-hidden bg-canvas text-ink">
  <!-- Minimal Top Navigation Bar -->
  <nav class="flex h-11 shrink-0 items-center justify-between border-b border-border bg-surface px-4">
    <div class="flex items-center gap-3">
      <a
        href="/sandbox"
        class="flex items-center gap-1.5 text-xs text-ink-secondary hover:text-ink transition-micro"
      >
        <ArrowLeft class="size-3.5" />
        Back to Sandbox
      </a>
      <span class="text-border">|</span>
      <div class="flex items-center gap-2">
        <Globe class="size-4 text-brand" />
        <span class="text-xs font-semibold tracking-wide text-ink">
          Planetary Telemetry & Earth Observation Studio
        </span>
      </div>
      <a
        href="/observatory"
        class="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-none bg-brand/10 text-brand border border-brand/30 text-[10px] font-mono hover:bg-brand/20 transition-micro"
      >
        <span>Production Route: /observatory ↗</span>
      </a>
    </div>

    <!-- Right: Live Applications Navigation & Compliance -->
    <div class="flex items-center gap-2 sm:gap-3">
      <button
        onclick={() => (isMeshModalOpen = true)}
        class="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface hover:bg-surface-raised text-cyan border border-border text-[11px] font-mono transition-micro shadow-2xs cursor-pointer"
        title="Open 3D Three.js Telemetry Mesh & Live Portals"
      >
        <Sparkles class="size-3" />
        <span>3D Mesh</span>
      </button>

      <a
        href="/ide"
        class="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink border border-border text-[11px] font-mono transition-micro shadow-2xs"
        title="Open Robotics IDE & Hardware Telemetry Blocks"
      >
        <TerminalSquare class="size-3 text-amber" />
        <span>Robotics IDE ↗</span>
      </a>

      <span class="inline-flex items-center gap-1 rounded-sm bg-canvas px-2 py-0.5 text-[10px] font-mono text-brand border border-border">
        <Shield class="size-3" />
        100% Commercial Clean-Room
      </span>
      <span class="text-xs text-ink-muted hidden md:inline">
        CREED OS WAY 2.1
      </span>
    </div>
  </nav>

  <!-- Full-viewport Planetary Studio -->
  <main class="flex-1 overflow-hidden">
    <PlanetaryStudio />
  </main>
</div>

<!-- Global 3D Three.js Telemetry Mesh Modal -->
<LivePortalsModal bind:isOpen={isMeshModalOpen} />

