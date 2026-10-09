<script lang="ts">
  import {
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Shield,
    Sparkles,
    Sliders,
    Layers,
    Activity,
    Info,
    RotateCcw,
    Send
  } from 'lucide-svelte';
  import { EvidenceRating } from '$lib/components';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let mission = $derived(data.mission);

  // --- Interactive Simulation Parameters ---
  type TrussType = 'warren' | 'pratt' | 'howe';
  type MaterialType = 'aluminum' | 'carbon' | 'titanium';

  let trussType = $state<TrussType>('warren');
  let material = $state<MaterialType>('aluminum');
  let strutThicknessMm = $state(24); // 14mm to 36mm
  let testLoadKg = $state(1200); // 600kg to 2400kg
  let studentNotes = $state('');

  // Socratic guidance toggle
  let socraticDrawerOpen = $state(false);

  // Evidence submission state
  let isSubmitting = $state(false);
  let submissionResult = $state<{
    success: boolean;
    evidence?: any;
    message?: string;
  } | null>(null);
  let evidenceModalOpen = $state(false);

  // --- Material Physical Constants ---
  const materials = {
    aluminum: {
      name: 'Aerospace Aluminum (6061-T6)',
      densityFactor: 1.0,
      strengthFactor: 1.0,
      deflectionFactor: 1.0,
      costLevel: 'Standard'
    },
    carbon: {
      name: 'Carbon Composite (High-Modulus)',
      densityFactor: 0.58,
      strengthFactor: 1.65,
      deflectionFactor: 0.72,
      costLevel: 'High'
    },
    titanium: {
      name: 'Titanium Alloy (Ti-6Al-4V)',
      densityFactor: 1.62,
      strengthFactor: 2.35,
      deflectionFactor: 0.85,
      costLevel: 'Premium'
    }
  };

  // --- Truss Geometry Efficiency Constants ---
  const trussConfigs = {
    warren: {
      name: 'Warren Truss',
      description: 'Equilateral triangular bays distribute alternating tension and compression.',
      geometricMultiplier: 1.15,
      deflectionResistance: 1.12
    },
    pratt: {
      name: 'Pratt Truss',
      description: 'Vertical compression members with tension diagonals slanting toward center.',
      geometricMultiplier: 1.05,
      deflectionResistance: 1.04
    },
    howe: {
      name: 'Howe Truss',
      description: 'Vertical tension members with compression diagonals slanting away from center.',
      geometricMultiplier: 0.98,
      deflectionResistance: 0.96
    }
  };

  // --- Reactive Physics Simulation Calculations ---
  const massKg = $derived.by(() => {
    const baseMass = 145; // kg baseline for 12m span
    const thicknessScale = strutThicknessMm / 24;
    const mat = materials[material];
    const cfg = trussConfigs[trussType];
    const total = baseMass * thicknessScale * mat.densityFactor * cfg.geometricMultiplier;
    return Math.round(total * 10) / 10;
  });

  const maxSupportedLoadKg = $derived.by(() => {
    const baseCapacity = 1250;
    const thicknessScale = Math.pow(strutThicknessMm / 24, 1.4);
    const mat = materials[material];
    const cfg = trussConfigs[trussType];
    const load = baseCapacity * thicknessScale * mat.strengthFactor * cfg.geometricMultiplier;
    return Math.round(load);
  });

  const strengthToWeightRatio = $derived.by(() => {
    return Math.round((maxSupportedLoadKg / Math.max(1, massKg)) * 10) / 10;
  });

  const centerDeflectionMm = $derived.by(() => {
    const mat = materials[material];
    const cfg = trussConfigs[trussType];
    const loadFactor = testLoadKg / 1200;
    const thicknessFactor = Math.pow(24 / strutThicknessMm, 1.2);
    const deflection = 11.5 * loadFactor * thicknessFactor * mat.deflectionFactor / cfg.deflectionResistance;
    return Math.round(deflection * 10) / 10;
  });

  const stressPercentage = $derived.by(() => {
    const ratio = (testLoadKg / Math.max(1, maxSupportedLoadKg)) * 100;
    return Math.min(100, Math.round(ratio));
  });

  const passesCriteria = $derived(
    massKg <= mission.maxMassKg &&
    strengthToWeightRatio >= mission.targetRatio &&
    centerDeflectionMm <= 18.0 &&
    stressPercentage < 95
  );

  const defY = $derived(160 + (centerDeflectionMm * 0.8));
  const topDefY = $derived(90 + (centerDeflectionMm * 0.4));

  function resetToBaseline() {
    trussType = 'warren';
    material = 'aluminum';
    strutThicknessMm = 24;
    testLoadKg = 1200;
    studentNotes = '';
    submissionResult = null;
  }

  async function submitMissionDesign() {
    if (isSubmitting) return;
    isSubmitting = true;

    try {
      const res = await fetch('/api/v1/missions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionId: mission.id,
          missionTitle: mission.title,
          trussType,
          material,
          massKg,
          maxLoadKg: maxSupportedLoadKg,
          ratio: strengthToWeightRatio,
          learnerNotes: studentNotes.trim()
        })
      });

      const json = await res.json();
      submissionResult = json;
      if (json.success) {
        evidenceModalOpen = true;
      }
    } catch (err: any) {
      submissionResult = {
        success: false,
        message: err.message || 'Could not verify submission'
      };
    } finally {
      isSubmitting = false;
    }
  }

  // Visual helper for stress coloring
  const stressColorClass = $derived.by(() => {
    if (stressPercentage < 65) return 'text-positive';
    if (stressPercentage < 88) return 'text-attention';
    return 'text-critical';
  });

  const stressStrokeClass = $derived.by(() => {
    if (stressPercentage < 65) return '#10b981';
    if (stressPercentage < 88) return '#f59e0b';
    return '#ef4444';
  });
</script>

<svelte:head>
  <title>{mission.title} — CREED OS</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 py-3 px-4 sm:px-6">
  <!-- 1. BREADCRUMB & HEADER -->
  <header class="space-y-3">
    <div class="flex items-center justify-between">
      <a
        href="/student"
        class="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink transition-colors"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Return to Today's Learning Map</span>
      </a>

      <div class="flex items-center gap-2">
        <span class="text-[11px] font-mono px-2 py-0.5 rounded-none bg-brand-subtle text-brand border border-brand/20">
          LEVEL 4 APPLIED TASK
        </span>
        <button
          type="button"
          onclick={() => (socraticDrawerOpen = true)}
          class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-ai-subtle border border-ai/20 text-ai text-xs font-medium hover:bg-ai-subtle/80 cursor-pointer"
        >
          <Sparkles class="w-3.5 h-3.5" />
          <span>Socratic Guide</span>
        </button>
      </div>
    </div>

    <div class="space-y-1">
      <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
        {mission.title}
      </h1>
      <p class="text-sm text-ink-secondary max-w-3xl leading-relaxed">
        {mission.brief}
      </p>
    </div>

    <!-- Target Constraints Strip -->
    <div class="flex flex-wrap items-center gap-6 py-2.5 px-4 rounded-none bg-surface border border-border text-xs text-ink-muted">
      <div>
        <span class="text-ink-secondary">Span:</span>
        <span class="font-semibold text-ink ml-1">{mission.spanMeters} meters</span>
      </div>
      <div>
        <span class="text-ink-secondary">Mass Limit:</span>
        <span class="font-semibold text-ink ml-1">≤ {mission.maxMassKg} kg</span>
      </div>
      <div>
        <span class="text-ink-secondary">Target Ratio:</span>
        <span class="font-semibold text-ink ml-1">≥ {mission.targetRatio}x load</span>
      </div>
      <div>
        <span class="text-ink-secondary">Rover Test Load:</span>
        <span class="font-semibold text-ink ml-1">{testLoadKg} kg</span>
      </div>
    </div>
  </header>

  <!-- 2. MAIN WORKBENCH GRID -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- LEFT 7 COLS: Interactive SVG Simulation Visualizer -->
    <div class="lg:col-span-7 space-y-4">
      <div class="p-5 rounded-none bg-surface border border-border space-y-4">
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-ink">Structural Load Simulation</span>
            <span class="px-1.5 py-0.5 rounded-none bg-surface-subtle border border-border text-[10px] font-mono text-ink-muted">
              12m Warren / Pratt Geometry
            </span>
          </div>

          <div class="flex items-center gap-1.5 font-medium {stressColorClass}">
            <Activity class="w-3.5 h-3.5" />
            <span>Stress: {stressPercentage}%</span>
          </div>
        </div>

        <!-- Interactive SVG Bridge Canvas -->
        <div class="w-full h-64 bg-surface-subtle border border-border flex items-center justify-center p-3 relative overflow-hidden">
          <svg viewBox="0 0 600 240" class="w-full h-full">
            <defs>
              <!-- Chasm terrain fill -->
              <pattern id="chasmPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="20" x2="20" y2="0" stroke="currentColor" stroke-width="0.5" class="text-border" />
              </pattern>
            </defs>

            <!-- Abutments (Left & Right Banks) -->
            <rect x="0" y="160" width="80" height="80" class="fill-surface stroke-border" stroke-width="1.5" />
            <rect x="520" y="160" width="80" height="80" class="fill-surface stroke-border" stroke-width="1.5" />
            <text x="15" y="190" class="text-[10px] fill-ink-muted font-mono">BANK A</text>
            <text x="535" y="190" class="text-[10px] fill-ink-muted font-mono">BANK B</text>

            <!-- Chasm gap representation -->
            <rect x="80" y="180" width="440" height="60" fill="url(#chasmPattern)" />
            <line x1="80" y1="160" x2="80" y2="240" stroke="currentColor" class="text-border" stroke-dasharray="2 2" />
            <line x1="520" y1="160" x2="520" y2="240" stroke="currentColor" class="text-border" stroke-dasharray="2 2" />

            <!-- Dimension Line (12 meters) -->
            <line x1="80" y1="225" x2="520" y2="225" stroke="currentColor" class="text-ink-muted" stroke-width="1" />
            <line x1="80" y1="220" x2="80" y2="230" stroke="currentColor" class="text-ink-muted" stroke-width="1" />
            <line x1="520" y1="220" x2="520" y2="230" stroke="currentColor" class="text-ink-muted" stroke-width="1" />
            <text x="270" y="235" class="text-[10px] fill-ink-muted font-mono text-center">12.0 METERS SPAN</text>

            <!-- Truss Nodes (Coordinates calculated for 12m span across 6 bays) -->
            <!-- Lower Chord Nodes: L0(80,160), L1(153,160), L2(226,160), L3(300,defY), L4(373,160), L5(446,160), L6(520,160) -->

            <!-- Bottom Chord Lines -->
            <line x1="80" y1="160" x2="153" y2="160" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="153" y1="160" x2="226" y2="160" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="226" y1="160" x2="300" y2={defY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="300" y1={defY} x2="373" y2="160" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="373" y1="160" x2="446" y2="160" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="446" y1="160" x2="520" y2="160" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />

            <!-- Top Chord Nodes: T1(153, 90), T2(226, 90), T3(300, topDefY), T4(373, 90), T5(446, 90) -->
            <line x1="153" y1="90" x2="226" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="226" y1="90" x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="300" y1={topDefY} x2="373" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="373" y1="90" x2="446" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />

            <!-- End Slopes -->
            <line x1="80" y1="160" x2="153" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            <line x1="520" y1="160" x2="446" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />

            <!-- Web Members based on Truss Type -->
            {#if trussType === 'warren'}
              <!-- Warren alternating diagonals -->
              <line x1="153" y1="160" x2="153" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 8} opacity="0.4" />
              <line x1="153" y1="160" x2="226" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="226" y1="160" x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="300" y1={defY} x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 8} opacity="0.4" />
              <line x1="373" y1="160" x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="446" y1="160" x2="373" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="446" y1="160" x2="446" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 8} opacity="0.4" />
            {:else if trussType === 'pratt'}
              <!-- Pratt vertical compression with center-leaning diagonals -->
              <line x1="153" y1="160" x2="153" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="226" y1="160" x2="226" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="300" y1={defY} x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="373" y1="160" x2="373" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="446" y1="160" x2="446" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="153" y1="160" x2="226" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="226" y1="160" x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="446" y1="160" x2="373" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="373" y1="160" x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            {:else}
              <!-- Howe verticals with outward leaning diagonals -->
              <line x1="153" y1="160" x2="153" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="226" y1="160" x2="226" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="300" y1={defY} x2="300" y2={topDefY} stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="373" y1="160" x2="373" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="446" y1="160" x2="446" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="226" y1="160" x2="153" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="300" y1={defY} x2="226" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="300" y1={defY} x2="373" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
              <line x1="373" y1="160" x2="446" y2="90" stroke={stressStrokeClass} stroke-width={strutThicknessMm / 7} />
            {/if}

            <!-- Rover Position at center top chord -->
            <g transform={`translate(280, ${topDefY - 35})`}>
              <rect x="0" y="5" width="40" height="20" class="fill-brand" />
              <circle cx="8" cy="28" r="5" class="fill-ink" />
              <circle cx="32" cy="28" r="5" class="fill-ink" />
              <line x1="20" y1="5" x2="20" y2="0" stroke="currentColor" class="text-ink" stroke-width="2" />
              <circle cx="20" cy="-2" r="2.5" class="fill-ai" />
              <text x="20" y="19" class="text-[8px] fill-white font-mono text-center font-bold" text-anchor="middle">ROVER</text>
            </g>

            <!-- Load Arrow -->
            <line x1="300" y1={topDefY - 45} x2="300" y2={topDefY - 38} stroke="currentColor" class="text-attention" stroke-width="2" marker-end="url(#arrow)" />
          </svg>
        </div>

        <!-- Telemetry 4-Stat Box (Level 1 Signal) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1">
            <span class="text-ink-muted text-[11px] block">Bridge Mass</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold font-mono text-ink">{massKg}</span>
              <span class="text-[11px] text-ink-muted">kg</span>
            </div>
            <span class="text-[10px] {massKg <= mission.maxMassKg ? 'text-positive' : 'text-critical'} font-medium">
              {massKg <= mission.maxMassKg ? `✓ Under ${mission.maxMassKg}kg ceiling` : `✗ Exceeds ${mission.maxMassKg}kg`}
            </span>
          </div>

          <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1">
            <span class="text-ink-muted text-[11px] block">Max Load</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold font-mono text-ink">{maxSupportedLoadKg}</span>
              <span class="text-[11px] text-ink-muted">kg</span>
            </div>
            <span class="text-[10px] text-positive font-medium">
              {maxSupportedLoadKg >= testLoadKg ? '✓ Supports rover' : '✗ Yields under load'}
            </span>
          </div>

          <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1">
            <span class="text-ink-muted text-[11px] block">Strength-to-Weight</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold font-mono text-ink">{strengthToWeightRatio}x</span>
            </div>
            <span class="text-[10px] {strengthToWeightRatio >= mission.targetRatio ? 'text-positive' : 'text-attention'} font-medium">
              {strengthToWeightRatio >= mission.targetRatio ? `✓ Meets ${mission.targetRatio}x target` : `Needs ≥ ${mission.targetRatio}x`}
            </span>
          </div>

          <div class="p-3 rounded-none bg-surface-subtle border border-border space-y-1">
            <span class="text-ink-muted text-[11px] block">Center Deflection</span>
            <div class="flex items-baseline gap-1">
              <span class="text-base font-bold font-mono text-ink">{centerDeflectionMm}</span>
              <span class="text-[11px] text-ink-muted">mm</span>
            </div>
            <span class="text-[10px] {centerDeflectionMm <= 18.0 ? 'text-positive' : 'text-critical'} font-medium">
              {centerDeflectionMm <= 18.0 ? '✓ Within safety limit' : '✗ Excessive sag'}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- RIGHT 5 COLS: Engineering Controls & Submission Deck -->
    <div class="lg:col-span-5 space-y-4">
      <div class="p-5 rounded-none bg-surface border border-border space-y-5 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <div class="flex items-center gap-2">
            <Sliders class="w-4 h-4 text-brand" />
            <h2 class="text-sm font-semibold text-ink">Design Parameters</h2>
          </div>
          <button
            type="button"
            onclick={resetToBaseline}
            class="inline-flex items-center gap-1 text-[11px] text-ink-muted hover:text-ink cursor-pointer"
          >
            <RotateCcw class="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <!-- 1. Truss Type Selection -->
        <div class="space-y-2">
          <span class="block font-medium text-ink">Truss Architecture</span>
          <div class="grid grid-cols-3 gap-2">
            {#each (['warren', 'pratt', 'howe'] as const) as type}
              <button
                type="button"
                onclick={() => (trussType = type)}
                class="p-2.5 rounded-none border text-center transition-colors cursor-pointer {trussType === type ? 'border-brand bg-brand-subtle text-ink font-semibold' : 'border-border bg-surface-subtle text-ink-secondary hover:bg-surface-raised'}"
              >
                <span class="block capitalize">{type}</span>
                <span class="text-[10px] text-ink-muted block mt-0.5">
                  {type === 'warren' ? 'Diagonal' : type === 'pratt' ? 'Vertical' : 'Inverted'}
                </span>
              </button>
            {/each}
          </div>
          <p class="text-[11px] text-ink-muted leading-relaxed">
            {trussConfigs[trussType].description}
          </p>
        </div>

        <!-- 2. Material Choice -->
        <div class="space-y-2">
          <span class="block font-medium text-ink">Structural Material</span>
          <div class="space-y-1.5">
            {#each (['aluminum', 'carbon', 'titanium'] as const) as matKey}
              <button
                type="button"
                onclick={() => (material = matKey)}
                class="w-full p-2.5 rounded-none border text-left flex items-center justify-between transition-colors cursor-pointer {material === matKey ? 'border-brand bg-brand-subtle text-ink font-medium' : 'border-border bg-surface-subtle text-ink-secondary hover:bg-surface-raised'}"
              >
                <div>
                  <span class="block font-semibold">{materials[matKey].name}</span>
                  <span class="text-[10px] text-ink-muted">Density: {materials[matKey].densityFactor}x • Yield: {materials[matKey].strengthFactor}x</span>
                </div>
                <div class="w-3.5 h-3.5 rounded-none border border-border flex items-center justify-center shrink-0 {material === matKey ? 'bg-brand border-brand' : ''}">
                  {#if material === matKey}
                    <div class="w-1.5 h-1.5 rounded-none bg-white"></div>
                  {/if}
                </div>
              </button>
            {/each}
          </div>
        </div>

        <!-- 3. Strut Tube Thickness Slider -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label for="strut-slider" class="font-medium text-ink">Strut Outer Diameter</label>
            <span class="font-mono font-semibold text-ink">{strutThicknessMm} mm</span>
          </div>
          <input
            id="strut-slider"
            type="range"
            min="14"
            max="36"
            step="1"
            bind:value={strutThicknessMm}
            class="w-full accent-brand cursor-pointer"
          />
          <div class="flex justify-between text-[10px] text-ink-muted font-mono">
            <span>14mm (Ultralight)</span>
            <span>24mm (Nominal)</span>
            <span>36mm (Heavy-Duty)</span>
          </div>
        </div>

        <!-- 4. Test Load Slider -->
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <label for="load-slider" class="font-medium text-ink">Applied Rover Load</label>
            <span class="font-mono font-semibold text-ink">{testLoadKg} kg</span>
          </div>
          <input
            id="load-slider"
            type="range"
            min="600"
            max="2400"
            step="50"
            bind:value={testLoadKg}
            class="w-full accent-brand cursor-pointer"
          />
          <div class="flex justify-between text-[10px] text-ink-muted font-mono">
            <span>600kg</span>
            <span>1,200kg (Rover Spec)</span>
            <span>2,400kg (2x Safety)</span>
          </div>
        </div>

        <!-- 5. Student Reasoning Notes -->
        <div class="space-y-1.5">
          <label for="student-notes" class="font-medium text-ink">Engineering Notes & Trade-off Justification</label>
          <textarea
            id="student-notes"
            bind:value={studentNotes}
            rows={2}
            placeholder="Why did you pick this truss geometry? How did material density affect your strength-to-weight ratio?"
            class="w-full p-2.5 rounded-none bg-surface-subtle border border-border text-xs text-ink placeholder-ink-muted"
          ></textarea>
        </div>

        <!-- Submission Status Indicator -->
        <div class="p-3 rounded-none border {passesCriteria ? 'bg-positive-subtle border-positive text-positive' : 'bg-attention-subtle border-attention text-attention'} flex items-center gap-2">
          {#if passesCriteria}
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span class="font-medium">Specification Verified: Meets all strength, mass, and deflection requirements.</span>
          {:else}
            <AlertTriangle class="w-4 h-4 shrink-0" />
            <span class="font-medium">Criteria Not Met: Check mass limit (≤250kg) or strength ratio (≥4.5x).</span>
          {/if}
        </div>

        <!-- Action Button -->
        <button
          type="button"
          onclick={submitMissionDesign}
          disabled={!passesCriteria || isSubmitting}
          class="w-full py-2.5 px-4 rounded-none bg-brand hover:bg-brand/90 disabled:opacity-40 disabled:pointer-events-none text-brand-foreground font-medium text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send class="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Evaluating Simulation...' : 'Submit Design for Level 4 Evidence'}</span>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- SOCRATIC GUIDE DRAWER -->
<InspectorPanel
  bind:open={socraticDrawerOpen}
  title="Socratic Reasoning Partner"
  subtitle="Guided thinking for structural mechanics"
>
  <div class="space-y-4 text-xs">
    <div class="p-3 rounded-none bg-ai-subtle border border-ai/20 text-ai space-y-1">
      <div class="flex items-center gap-1.5 font-semibold">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Decomposition Heuristic</span>
      </div>
      <p class="text-xs text-ink-secondary leading-relaxed">
        Bridges do not fail all at once. They fail at the single member carrying the highest compressive buckling load.
      </p>
    </div>

    <div class="space-y-2">
      <span class="font-semibold text-ink uppercase tracking-wider text-[11px]">Questions to consider:</span>
      <ul class="space-y-2.5 text-ink-secondary">
        <li class="p-2.5 rounded-none bg-surface-subtle border border-border">
          <strong>1. Tension vs. Compression:</strong> Why does a Warren truss alternate tension and compression diagonals, and how does that prevent concentrated bending moments?
        </li>
        <li class="p-2.5 rounded-none bg-surface-subtle border border-border">
          <strong>2. Material Efficiency:</strong> Carbon composite is lighter, but how does its modulus of elasticity affect center-span deflection compared to Titanium?
        </li>
        <li class="p-2.5 rounded-none bg-surface-subtle border border-border">
          <strong>3. The Weight Trade-off:</strong> If you increase strut diameter to 36mm, your max load increases, but what happens to your ratio when mass doubles?
        </li>
      </ul>
    </div>
  </div>
</InspectorPanel>

<!-- SUCCESS EVIDENCE RECEIPT MODAL -->
<InspectorPanel
  bind:open={evidenceModalOpen}
  title="Verified Level 4 Applied Evidence"
  subtitle="Cryptographically logged to learner longitudinal evidence graph"
>
  {#if submissionResult?.evidence}
    <div class="space-y-5 text-xs">
      <div class="p-3.5 rounded-none bg-positive-subtle border border-positive text-positive flex items-center gap-2.5">
        <CheckCircle2 class="w-5 h-5 shrink-0" />
        <div class="space-y-0.5">
          <p class="font-bold text-sm">Challenge Completed & Verified</p>
          <p class="text-[11px] text-ink-secondary">Evidence Level 4 (Applied Mission Task) created.</p>
        </div>
      </div>

      <div class="p-4 rounded-none bg-surface-subtle border border-border space-y-3">
        <div class="flex justify-between items-center text-xs">
          <span class="text-ink-secondary">Source Challenge:</span>
          <span class="font-semibold text-ink">{submissionResult.evidence.sourceTitle}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-ink-secondary">Competency Domain:</span>
          <span class="font-semibold text-brand uppercase">{submissionResult.evidence.competency.replace('_', ' ')}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-ink-secondary">Evidence Strength:</span>
          <EvidenceRating rating={4} max={5} label="Level 4 Applied" />
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-ink-secondary">Strength-to-Weight Ratio:</span>
          <span class="font-mono font-bold text-positive">{submissionResult.evidence.observedValue.strengthToWeightRatio}x</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-ink-secondary">Total Bridge Mass:</span>
          <span class="font-mono text-ink">{submissionResult.evidence.observedValue.massKg} kg</span>
        </div>
        <div class="pt-2 border-t border-border text-ink-secondary leading-relaxed">
          {submissionResult.evidence.summary}
        </div>
      </div>

      <div class="pt-4 border-t border-border flex flex-col gap-2">
        <a
          href="/student"
          class="w-full py-2.5 px-4 rounded-none bg-brand hover:bg-brand/90 text-brand-foreground font-medium text-center cursor-pointer"
        >
          Return to Learning Map
        </a>
        <a
          href="/student/progress"
          class="w-full py-2 px-4 rounded-none bg-surface-subtle hover:bg-surface-raised border border-border text-ink text-center cursor-pointer"
        >
          View Updated Capabilities Graph
        </a>
      </div>
    </div>
  {/if}
</InspectorPanel>
