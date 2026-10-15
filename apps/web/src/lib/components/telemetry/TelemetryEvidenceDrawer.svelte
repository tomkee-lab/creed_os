<!-- apps/web/src/lib/components/telemetry/TelemetryEvidenceDrawer.svelte -->
<script lang="ts">
  import type { TelemetryEntity } from '$lib/telemetry/planetary/types';

  let {
    entity = null,
    open = $bindable(false)
  } = $props<{
    entity: TelemetryEntity | null;
    open: boolean;
  }>();
</script>

{#if open && entity}
  <aside
    class="fixed right-4 top-20 bottom-8 z-30 flex w-96 flex-col overflow-hidden rounded-sm border border-border bg-surface/95 shadow-2xl backdrop-blur-md"
    role="region"
    aria-label="Telemetry Evidence Disclosure"
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-border p-3">
      <div>
        <span class="font-mono text-[10px] uppercase text-brand">
          Level 3 · Empirical Evidence
        </span>
        <h2 class="text-sm font-semibold text-ink">
          {entity.name}
        </h2>
      </div>
      <button
        onclick={() => open = false}
        class="rounded-sm p-1 text-xs text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors duration-150"
        aria-label="Close drawer"
      >
        ✕
      </button>
    </div>

    <!-- Scrollable Content Body -->
    <div class="flex-1 space-y-4 overflow-y-auto p-3 text-xs text-ink-secondary">
      <!-- Coordinate Telemetry Ribbon (0px radius structural surface) -->
      <div class="rounded-none border border-border bg-canvas p-2 font-mono text-[11px]">
        <div class="grid grid-cols-2 gap-1.5">
          <div><span class="text-ink-muted">LAT:</span> {entity.lat.toFixed(4)}°</div>
          <div><span class="text-ink-muted">LON:</span> {entity.lon.toFixed(4)}°</div>
          <div><span class="text-ink-muted">ALT:</span> {entity.altM.toLocaleString()} m</div>
          <div><span class="text-ink-muted">SPD:</span> {entity.speedKmh ? `${entity.speedKmh} km/h` : 'N/A'}</div>
        </div>
      </div>

      <!-- Provenance & Source Attribution -->
      <div>
        <h3 class="font-medium text-ink">Provenance & Data License</h3>
        <p class="mt-1 text-[11px] text-ink-secondary">
          <strong>Source:</strong> {entity.evidence.source}
        </p>
        <p class="text-[11px] text-brand">
          <strong>License:</strong> {entity.evidence.license}
        </p>
      </div>

      <!-- Mathematical Calculation Proof -->
      {#if entity.evidence.calculationProof}
        <div>
          <h3 class="font-medium text-ink">Algorithmic Method</h3>
          <p class="mt-1 rounded-sm border border-border bg-surface-raised p-2 font-mono text-[11px] text-ink">
            {entity.evidence.calculationProof}
          </p>
        </div>
      {/if}

      <!-- Raw Ingested Ephemeris Payload (0px data table) -->
      <div>
        <h3 class="font-medium text-ink">Raw Ephemeris Vector</h3>
        <pre class="mt-1 max-h-48 overflow-x-auto rounded-none border border-border bg-canvas p-2 font-mono text-[10px] text-ink-muted">
{JSON.stringify(entity.evidence.rawPayload, null, 2)}
        </pre>
      </div>
    </div>
  </aside>
{/if}
