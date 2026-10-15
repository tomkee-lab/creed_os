<!-- apps/web/src/lib/components/telemetry/LegalAttributionModal.svelte -->
<script lang="ts">
  let { open = $bindable(false) } = $props<{ open: boolean }>();
</script>

{#if open}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 backdrop-blur-sm"
    role="dialog"
    aria-modal="true"
  >
    <!-- Modal Card (WAY 2.1: 4px radius, semantic tokens, 0px tables) -->
    <div class="relative max-h-[85vh] w-[90vw] max-w-2xl overflow-y-auto rounded-sm border border-border bg-surface p-6 text-ink shadow-2xl">
      <div class="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h2 class="text-base font-semibold tracking-wide text-ink">
            Open Source & Commercial Attributions
          </h2>
          <p class="text-xs text-ink-muted">
            Planetary Telemetry & Earth Observation Module · 100% Permissive Commercial Stack
          </p>
        </div>
        <button
          onclick={() => open = false}
          class="rounded-sm p-1.5 text-ink-muted hover:bg-surface-raised hover:text-ink transition-colors duration-150"
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>

      <div class="mt-4 space-y-4 text-xs leading-relaxed text-ink-secondary">
        <div>
          <h3 class="font-medium text-ink">1. Software Engine & Core Shaders</h3>
          <p class="mt-1">
            Derived from <strong>God's Eye View</strong> (Copyright © 2026 Bilawal Sidhu), licensed under the <strong>MIT License</strong>.
            CesiumJS (Copyright © 2011–2026 CesiumGS, Inc.) licensed under the <strong>Apache License, Version 2.0</strong>.
            Orbit calculations via <code>satellite.js</code> (Copyright © 2013–2026 Shashwat Kandadai, Bill Chappell) licensed under the <strong>MIT License</strong>.
          </p>
        </div>

        <div>
          <h3 class="font-medium text-ink">2. 3D Model Assets (CC BY 4.0)</h3>
          <p class="mt-1">
            3D models (B787, Jet, Cargo Ship, Bell 206, Cessna 172) modified for WGS84 meter scaling from original works by 
            <em>zairiq-123</em>, <em>Nick the Name</em>, <em>Javier_Fernandez</em>, <em>terran4627</em>, <em>e737</em>, <em>IProZenoN</em>, and <em>Nobilis 2</em> under the <strong>Creative Commons Attribution 4.0 International License (CC BY 4.0)</strong>.
          </p>
        </div>

        <div>
          <h3 class="font-medium text-ink">3. Data & Live Providers</h3>
          <ul class="mt-1 list-disc pl-4 space-y-1">
            <li><strong>Basemap</strong>: Powered by Esri (Source: Esri, Maxar, Earthstar Geographics) and Re:Earth Terrain (CC BY 4.0 / EGM2008 NGA).</li>
            <li><strong>Aviation Feeds</strong>: Powered by <code>adsb.lol</code> under the <strong>Open Database License (ODbL) 1.0</strong> (© OpenStreetMap contributors).</li>
            <li><strong>Space & Orbit Ephemeris</strong>: SGP4 Two-Line Element sets courtesy of <strong>CelesTrak</strong> (Dr. T.S. Kelso, U.S. Public Domain).</li>
            <li><strong>Seismic & Thermal Anomalies</strong>: U.S. Geological Survey (USGS) and NASA FIRMS (U.S. Federal Government Public Domain).</li>
          </ul>
        </div>

        <div class="rounded-sm border border-border bg-canvas p-3 text-[11px]">
          <span class="font-semibold text-brand">Commercial Compliance Guarantee:</span>
          All upstream non-commercial datasets (TeleGeography Submarine Cables, CC BY-NC flood scenes, and surveillance/ALPR feeds) have been excised. This build contains <strong>zero non-commercial (NC) or copyleft (GPL) code</strong> and complies fully with India's DPDP Act 2023 statutory minor safety requirements.
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          onclick={() => open = false}
          class="rounded-sm bg-surface-raised px-4 py-1.5 text-xs font-medium text-ink hover:bg-surface-raised/80 transition-colors duration-150"
        >
          Acknowledge & Close
        </button>
      </div>
    </div>
  </div>
{/if}
