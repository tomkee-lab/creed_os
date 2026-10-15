<!-- apps/web/src/lib/components/telemetry/PlanetaryStudio.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import type { TelemetryEntity, SensorVisionMode, EducationalMission } from '$lib/telemetry/planetary/types';
  import { setupCommercialBasemap } from '$lib/telemetry/planetary/basemaps';
  import { CURATED_SATELLITES, propagateSatellite, calculateOrbitPath } from '$lib/telemetry/planetary/satellites';
  import { fetchLiveFlights } from '$lib/telemetry/planetary/flights';
  import { fetchLiveEarthquakes } from '$lib/telemetry/planetary/hazards';
  import { EDUCATIONAL_MISSIONS, evaluateMissionSubmission } from '$lib/telemetry/planetary/missions';
  import { FLIR_FRAGMENT_SHADER } from '$lib/telemetry/planetary/shaders/flirShader';
  import { NVG_FRAGMENT_SHADER } from '$lib/telemetry/planetary/shaders/nvgShader';
  import TelemetryHUD from './TelemetryHUD.svelte';
  import TelemetryEvidenceDrawer from './TelemetryEvidenceDrawer.svelte';
  import LegalAttributionModal from './LegalAttributionModal.svelte';
  import AIExplainability from '$lib/components/AIExplainability.svelte';

  let container: HTMLDivElement;
  let viewer: any = null;
  let Cesium: any = null;

  // Svelte 5 reactive states
  let activeVisionMode = $state<SensorVisionMode>('natural');
  let activeEntity = $state<TelemetryEntity | null>(null);
  let evidenceOpen = $state(false);
  let legalOpen = $state(false);
  let activeMission = $state<EducationalMission | null>(null);
  let missionAnswer = $state<number | null>(null);
  let missionResult = $state<{ passed: boolean; errorPct: number; feedback: string } | null>(null);

  // Entities cache
  let allEntities = $state<TelemetryEntity[]>([]);

  // Shaders
  let flirStage: any = null;
  let nvgStage: any = null;
  let orbitTickTimer: any = null;

  onMount(async () => {
    if (!browser) return;

    // Dynamically import Cesium client-side
    Cesium = await import('cesium');
    import('cesium/Build/Cesium/Widgets/widgets.css');

    // Initialize Cesium viewer with zero bloat and commercial basemap
    viewer = new Cesium.Viewer(container, {
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      infoBox: false,
      selectionIndicator: false,
      baseLayerPicker: false
    });

    viewer.scene.globe.depthTestAgainstTerrain = false;

    // Apply 100% Commercial Basemap (Esri Satellite + Re:Earth Terrain)
    await setupCommercialBasemap(viewer, { enableTerrain: false });

    // Initialize GLSL Post-Process Stages
    initShaderStages();

    // Load initial telemetry (Satellites, Flights, Hazards)
    await refreshTelemetry();

    // Start 1-second orbit propagation loop for satellites
    orbitTickTimer = setInterval(updateSatellitePositions, 1000);

    // Initial camera position (over Indian Subcontinent / Global View)
    resetGlobe();
  });

  onDestroy(() => {
    if (orbitTickTimer) clearInterval(orbitTickTimer);
    if (viewer && !viewer.isDestroyed()) {
      viewer.destroy();
    }
  });

  function initShaderStages() {
    if (!viewer || !Cesium) return;

    flirStage = new Cesium.PostProcessStage({
      name: 'creed_flir_stage',
      fragmentShader: FLIR_FRAGMENT_SHADER,
      uniforms: { intensity: 0.0 }
    });
    flirStage.enabled = false;
    viewer.scene.postProcessStages.add(flirStage);

    nvgStage = new Cesium.PostProcessStage({
      name: 'creed_nvg_stage',
      fragmentShader: NVG_FRAGMENT_SHADER,
      uniforms: { intensity: 0.0 }
    });
    nvgStage.enabled = false;
    viewer.scene.postProcessStages.add(nvgStage);
  }

  // Effect to update GLSL shader stages when mode changes
  $effect(() => {
    const mode = activeVisionMode;
    if (!flirStage || !nvgStage) return;

    if (mode === 'flir') {
      flirStage.enabled = true;
      flirStage.uniforms.intensity = 1.0;
      nvgStage.enabled = false;
      nvgStage.uniforms.intensity = 0.0;
    } else if (mode === 'nvg') {
      nvgStage.enabled = true;
      nvgStage.uniforms.intensity = 1.0;
      flirStage.enabled = false;
      flirStage.uniforms.intensity = 0.0;
    } else {
      flirStage.enabled = false;
      flirStage.uniforms.intensity = 0.0;
      nvgStage.enabled = false;
      nvgStage.uniforms.intensity = 0.0;
    }
  });

  async function refreshTelemetry() {
    if (!viewer || !Cesium) return;

    const entities: TelemetryEntity[] = [];

    // 1. Satellites
    for (const sat of CURATED_SATELLITES) {
      const prop = propagateSatellite(sat);
      if (prop) entities.push(prop);

      // Render orbital track geometry
      const orbitPoints = calculateOrbitPath(sat);
      viewer.entities.add({
        name: `${sat.name} Orbit`,
        polyline: {
          positions: orbitPoints,
          width: 1.5,
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.15,
            color: Cesium.Color.fromCssColorString('#10b981').withAlpha(0.5)
          })
        }
      });
    }

    // 2. Commercial Flights
    const flights = await fetchLiveFlights(20.5937, 78.9629, 300);
    entities.push(...flights);

    // 3. Earth Hazards
    const hazards = await fetchLiveEarthquakes();
    entities.push(...hazards);

    allEntities = entities;
    renderEntitiesOnGlobe();
  }

  function updateSatellitePositions() {
    if (!viewer || !Cesium) return;

    const now = new Date();
    for (const sat of CURATED_SATELLITES) {
      const prop = propagateSatellite(sat, now);
      if (!prop) continue;

      // Update in allEntities state
      const idx = allEntities.findIndex((e) => e.id === sat.id);
      if (idx !== -1) {
        allEntities[idx] = prop;
        if (activeEntity?.id === sat.id) {
          activeEntity = prop;
        }
      }

      // Update Cesium entity position
      const cesiumEntity = viewer.entities.getById(sat.id);
      if (cesiumEntity) {
        cesiumEntity.position = Cesium.Cartesian3.fromDegrees(
          prop.lon,
          prop.lat,
          prop.altM
        );
      }
    }
  }

  function renderEntitiesOnGlobe() {
    if (!viewer || !Cesium) return;

    for (const item of allEntities) {
      if (viewer.entities.getById(item.id)) continue;

      let color = Cesium.Color.fromCssColorString('#10b981'); // Mint for satellites
      let pointSize = 8;

      if (item.type === 'flight') {
        color = Cesium.Color.fromCssColorString('#38bdf8'); // Sky blue for flights
        pointSize = 6;
      } else if (item.type === 'hazard') {
        color = Cesium.Color.fromCssColorString('#f59e0b'); // Amber for hazards
        pointSize = 7;
      }

      viewer.entities.add({
        id: item.id,
        name: item.name,
        position: Cesium.Cartesian3.fromDegrees(item.lon, item.lat, Math.max(item.altM, 100)),
        point: {
          pixelSize: pointSize,
          color: color,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1.5
        },
        label: {
          text: item.name,
          font: '10px JetBrains Mono, monospace',
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -9),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 15000000)
        }
      });
    }

    // Bind click listener for entity selection
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction((click: any) => {
      const pickedObject = viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject) && pickedObject.id) {
        selectEntityById(pickedObject.id.id);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  function selectEntityById(id: string) {
    const found = allEntities.find((e) => e.id === id);
    if (found) {
      activeEntity = found;
      flyToEntity(found);
    }
  }

  function flyToEntity(e: TelemetryEntity) {
    if (!viewer || !Cesium) return;

    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        e.lon,
        e.lat,
        Math.max(e.altM * 2.2, 1200000)
      ),
      duration: 1.6
    });
  }

  function resetGlobe() {
    if (!viewer || !Cesium) return;

    activeEntity = null;
    evidenceOpen = false;
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(78.9629, 20.5937, 18000000), // Over India
      duration: 1.2
    });
  }

  function startMission(m: EducationalMission) {
    activeMission = m;
    missionAnswer = null;
    missionResult = null;

    if (viewer && Cesium) {
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          m.targetCoordinates[0],
          m.targetCoordinates[1],
          m.cameraAltitudeM
        ),
        duration: 1.8
      });
    }

    selectEntityById(m.targetEntityId);
  }

  function submitMissionCalculation() {
    if (!activeMission || missionAnswer === null) return;
    missionResult = evaluateMissionSubmission(activeMission, missionAnswer);
  }
</script>

<!-- WAY 2.1 0px Structural Outer Frame (No bubbly curves) -->
<div class="relative h-full w-full overflow-hidden rounded-none border border-border bg-canvas">
  <!-- Cesium WebGL Surface -->
  <div bind:this={container} class="h-full w-full cursor-crosshair"></div>

  <!-- Signal & Context HUD -->
  <TelemetryHUD
    {activeEntity}
    bind:activeVisionMode
    onOpenEvidence={() => evidenceOpen = true}
    onOpenLegal={() => legalOpen = true}
    onResetView={resetGlobe}
  />

  <!-- Bottom Left: Educational Mission Selector (WAY 2.1: 4px controls) -->
  <aside class="pointer-events-none absolute bottom-4 left-4 z-20 flex max-w-md flex-col gap-2">
    <div class="pointer-events-auto rounded-sm border border-border bg-surface/90 p-3 shadow-lg backdrop-blur-md">
      <div class="flex items-center justify-between border-b border-border pb-1.5">
        <span class="text-xs font-mono font-semibold text-ink">
          GUIDED STEM MISSIONS
        </span>
        <span class="rounded-sm bg-surface-raised px-1.5 py-0.5 text-[10px] text-ai font-mono">
          Deterministic Scoring
        </span>
      </div>

      <!-- Mission Selection Pills -->
      <div class="mt-2 flex flex-wrap gap-1.5">
        {#each EDUCATIONAL_MISSIONS as mission}
          <button
            onclick={() => startMission(mission)}
            class="rounded-sm px-2 py-1 text-left text-[11px] font-medium transition-colors duration-150 {activeMission?.id === mission.id ? 'bg-ai text-white' : 'bg-surface-raised text-ink-secondary hover:text-ink'}"
          >
            {mission.title.split(':')[0]}
          </button>
        {/each}
      </div>

      <!-- Active Mission Card -->
      {#if activeMission}
        <div class="mt-3 space-y-2 border-t border-border pt-2 text-xs text-ink-secondary">
          <div class="flex items-start justify-between gap-2">
            <p class="font-medium text-ink flex-1">{activeMission.objective}</p>
            <AIExplainability
              label="Socratic Mentor"
              intent={activeMission.contextSentence}
              reasoning="Deterministic Keplerian / Geodesic mechanics derived from SGP4 propagation and WGS84 ellipsoid parameters."
              evidenceSources={['CelesTrak Two-Line Elements', 'WGS84 Geodesic Math', 'adsb.lol Open Transponders']}
              limitations="Scoring derives solely from empirical tolerance bands; Socratic dialogue does not provide answers."
            />
          </div>
          <ul class="list-disc pl-4 text-[11px] space-y-0.5 text-ink-muted">
            {#each activeMission.instructions as inst}
              <li>{inst}</li>
            {/each}
          </ul>

          <!-- Calculation Submission Input -->
          <form onsubmit={(e) => { e.preventDefault(); submitMissionCalculation(); }} class="mt-2 flex items-center gap-2">
            <input
              type="number"
              step="any"
              bind:value={missionAnswer}
              placeholder={`Enter value (${activeMission.unit})`}
              class="w-full rounded-sm border border-border bg-canvas px-2 py-1 font-mono text-xs text-ink focus:border-brand focus:outline-none"
            />
            <button
              type="submit"
              class="rounded-sm bg-brand px-3 py-1 font-medium text-black text-xs hover:opacity-90 transition-opacity"
            >
              Verify
            </button>
          </form>

          <!-- Evaluation Feedback (Deterministic Tolerance Result) -->
          {#if missionResult}
            <div class="mt-2 rounded-sm p-2 text-[11px] font-mono {missionResult.passed ? 'bg-positive-subtle text-positive border border-positive/30' : 'bg-attention-subtle text-attention border border-attention/30'}">
              {missionResult.feedback}
            </div>
          {/if}
        </div>
      {/if}
    </div>
  </aside>

  <!-- Level 3 Evidence Disclosure Drawer -->
  <TelemetryEvidenceDrawer
    entity={activeEntity}
    bind:open={evidenceOpen}
  />

  <!-- 100% Commercial Legal & Attribution Modal -->
  <LegalAttributionModal bind:open={legalOpen} />
</div>
