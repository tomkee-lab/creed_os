<!-- apps/web/src/lib/components/telemetry/TelemetryHUD.svelte -->
<script lang="ts">
  import type { TelemetryEntity, SensorVisionMode } from '$lib/telemetry/planetary/types';

  let {
    activeEntity = null,
    activeVisionMode = $bindable('natural'),
    onOpenEvidence = () => {},
    onOpenLegal = () => {},
    onResetView = () => {}
  } = $props<{
    activeEntity: TelemetryEntity | null;
    activeVisionMode: SensorVisionMode;
    onOpenEvidence: () => void;
    onOpenLegal: () => void;
    onResetView: () => void;
  }>();
</script>

<!-- WAY 2.1 Signal & Context Top HUD Overlay -->
<header class="pointer-events-none absolute top-4 left-4 right-4 z-20 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
  <!-- Level 1 (Signal) & Level 2 (Context) Surface -->
  <div class="pointer-events-auto flex max-w-xl flex-col gap-1 rounded-sm border border-border bg-surface/90 p-3 shadow-lg backdrop-blur-md">
    <!-- Level 1: Signal -->
    <div class="flex items-center gap-2">
      <span class="inline-block h-2 w-2 rounded-none bg-brand animate-pulse"></span>
      <h1 class="text-xs font-mono font-semibold uppercase tracking-wider text-ink">
        Planetary Telemetry & Earth Observation Studio
      </h1>
      <span class="rounded-none bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
        WGS84 · 60 FPS
      </span>
    </div>

    <!-- Level 2: Context (1 concise sentence maximum) -->
    <p class="text-xs text-ink-secondary">
      {#if activeEntity}
        Tracking <strong class="text-ink">{activeEntity.name}</strong> · {activeEntity.description}
      {:else}
        Live orbital ephemeris, aviation transponders, and global climate vectors. Select any contact to inspect provenance.
      {/if}
    </p>

    <!-- Level 3 Action Disclosure Link -->
    {#if activeEntity}
      <div class="mt-1 flex items-center gap-3">
        <button
          onclick={onOpenEvidence}
          class="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:underline"
        >
          Inspect Evidence & Ephemeris →
        </button>
      </div>
    {/if}
  </div>

  <!-- Interactive Controls Bar (WAY 2.1: 4px radius controls) -->
  <div class="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-sm border border-border bg-surface/90 p-1.5 shadow-lg backdrop-blur-md">
    <!-- Sensor Optics Switcher -->
    <div class="flex items-center gap-1 border-r border-border pr-1.5">
      <span class="px-1 text-[10px] font-mono text-ink-muted">SENSOR:</span>
      <button
        onclick={() => activeVisionMode = 'natural'}
        class="rounded-sm px-2 py-1 text-[11px] font-mono font-medium transition-all duration-200 {activeVisionMode === 'natural' ? 'bg-surface-raised text-brand shadow-xs' : 'text-ink-muted hover:text-ink'}"
      >
        OPTICAL
      </button>
      <button
        onclick={() => activeVisionMode = 'flir'}
        class="rounded-sm px-2 py-1 text-[11px] font-mono font-medium transition-all duration-200 {activeVisionMode === 'flir' ? 'bg-surface-raised text-attention shadow-xs' : 'text-ink-muted hover:text-ink'}"
      >
        FLIR
      </button>
      <button
        onclick={() => activeVisionMode = 'nvg'}
        class="rounded-sm px-2 py-1 text-[11px] font-mono font-medium transition-all duration-200 {activeVisionMode === 'nvg' ? 'bg-surface-raised text-brand shadow-xs' : 'text-ink-muted hover:text-ink'}"
      >
        NVG
      </button>
    </div>

    <!-- Quick Actions -->
    <button
      onclick={onResetView}
      class="rounded-sm px-2 py-1 text-[11px] font-medium text-ink-secondary hover:bg-surface-raised hover:text-ink transition-colors duration-150"
      title="Reset camera to global view"
    >
      Reset Globe
    </button>
    <button
      onclick={onOpenLegal}
      class="rounded-sm px-2 py-1 text-[11px] font-medium text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors duration-150"
      title="Commercial Licenses & Third-Party Notices"
    >
      Legal / Attribution
    </button>
  </div>
</header>
