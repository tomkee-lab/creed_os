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
    Send,
    TerminalSquare,
    Play,
    Compass,
    Cpu,
    Radio,
    Eye,
    Gauge,
    Flame
  } from 'lucide-svelte';
  import { EvidenceRating } from '$lib/components';
  import InspectorPanel from '$lib/components/shell/InspectorPanel.svelte';

  let { data } = $props();
  let mission = $derived(data.mission);

  // Socratic guidance toggle & evidence submission
  let socraticDrawerOpen = $state(false);
  let isSubmitting = $state(false);
  let submissionResult = $state<{
    success: boolean;
    evidence?: any;
    message?: string;
  } | null>(null);
  let evidenceModalOpen = $state(false);
  let studentNotes = $state('');

  // =========================================================================
  // SIMULATOR 1: TRUSS STRUCTURAL SIMULATION (robobridge)
  // =========================================================================
  type TrussType = 'warren' | 'pratt' | 'howe';
  type MaterialType = 'aluminum' | 'carbon' | 'titanium';
  let trussType = $state<TrussType>('warren');
  let material = $state<MaterialType>('aluminum');
  let strutThicknessMm = $state(24);
  let testLoadKg = $state(1200);

  const materials = {
    aluminum: { name: 'Aerospace Aluminum (6061-T6)', densityFactor: 1.0, strengthFactor: 1.0, deflectionFactor: 1.0 },
    carbon: { name: 'Carbon Composite (High-Modulus)', densityFactor: 0.58, strengthFactor: 1.65, deflectionFactor: 0.72 },
    titanium: { name: 'Titanium Alloy (Ti-6Al-4V)', densityFactor: 1.62, strengthFactor: 2.35, deflectionFactor: 0.85 }
  };

  const trussConfigs = {
    warren: { name: 'Warren Truss', description: 'Equilateral triangular bays distribute alternating tension and compression.', geometricMultiplier: 1.15, deflectionResistance: 1.12 },
    pratt: { name: 'Pratt Truss', description: 'Vertical compression members with tension diagonals slanting toward center.', geometricMultiplier: 1.05, deflectionResistance: 1.04 },
    howe: { name: 'Howe Truss', description: 'Vertical tension members with compression diagonals slanting away from center.', geometricMultiplier: 0.98, deflectionResistance: 0.96 }
  };

  const massKg = $derived.by(() => {
    const baseMass = 145;
    const thicknessScale = strutThicknessMm / 24;
    const mat = materials[material];
    const cfg = trussConfigs[trussType];
    return Math.round(baseMass * thicknessScale * mat.densityFactor * cfg.geometricMultiplier * 10) / 10;
  });

  const maxSupportedLoadKg = $derived.by(() => {
    const baseLoad = 4800;
    const thicknessScale = Math.pow(strutThicknessMm / 24, 1.8);
    const mat = materials[material];
    const cfg = trussConfigs[trussType];
    return Math.round(baseLoad * thicknessScale * mat.strengthFactor * cfg.geometricMultiplier);
  });

  const strengthToWeightRatio = $derived(
    Math.round((maxSupportedLoadKg / massKg) * 10) / 10
  );

  const stressPercentage = $derived.by(() => {
    const ratio = testLoadKg / maxSupportedLoadKg;
    return Math.min(100, Math.round(ratio * 100));
  });

  const centerDeflectionMm = $derived.by(() => {
    const baseDeflection = 14.0;
    const loadScale = testLoadKg / 1200;
    const thicknessReduction = Math.pow(24 / strutThicknessMm, 2.2);
    const mat = materials[material];
    const cfg = trussConfigs[trussType];
    const total = (baseDeflection * loadScale * thicknessReduction * mat.deflectionFactor) / cfg.deflectionResistance;
    return Math.round(total * 10) / 10;
  });

  const passesTrussCriteria = $derived(
    massKg <= 250 &&
    strengthToWeightRatio >= 4.5 &&
    centerDeflectionMm <= 18.0 &&
    stressPercentage < 95
  );

  // =========================================================================
  // SIMULATOR 2: 2D GRID MARS ROVER PATHFINDER (mars-rover-pathfinder)
  // =========================================================================
  type Command = 'FORWARD' | 'LEFT' | 'RIGHT';
  let roverCommands = $state<Command[]>([]);
  let roverX = $state(0);
  let roverY = $state(0);
  let roverHeading = $state<0 | 90 | 180 | 270>(0); // 0=North, 90=East, 180=South, 270=West
  let roverStatus = $state<'idle' | 'running' | 'success' | 'collision' | 'boundary'>('idle');

  const craters = [{ x: 1, y: 1 }, { x: 3, y: 2 }, { x: 2, y: 3 }];
  const targetBase = { x: 4, y: 4 };

  function addRoverCommand(cmd: Command) {
    if (roverCommands.length < 12) {
      roverCommands = [...roverCommands, cmd];
    }
  }

  function resetRover() {
    roverCommands = [];
    roverX = 0;
    roverY = 0;
    roverHeading = 0;
    roverStatus = 'idle';
  }

  function runRoverSimulation() {
    let x = 0;
    let y = 0;
    let heading: 0 | 90 | 180 | 270 = 0;

    for (const cmd of roverCommands) {
      if (cmd === 'LEFT') {
        heading = ((heading + 270) % 360) as 0 | 90 | 180 | 270;
      } else if (cmd === 'RIGHT') {
        heading = ((heading + 90) % 360) as 0 | 90 | 180 | 270;
      } else if (cmd === 'FORWARD') {
        if (heading === 0) y += 1;
        else if (heading === 90) x += 1;
        else if (heading === 180) y -= 1;
        else if (heading === 270) x -= 1;

        if (x < 0 || x > 4 || y < 0 || y > 4) {
          roverX = Math.max(0, Math.min(4, x));
          roverY = Math.max(0, Math.min(4, y));
          roverHeading = heading;
          roverStatus = 'boundary';
          return;
        }

        if (craters.some(c => c.x === x && c.y === y)) {
          roverX = x;
          roverY = y;
          roverHeading = heading;
          roverStatus = 'collision';
          return;
        }
      }
    }

    roverX = x;
    roverY = y;
    roverHeading = heading;

    if (roverX === targetBase.x && roverY === targetBase.y) {
      roverStatus = 'success';
    } else {
      roverStatus = 'idle';
    }
  }

  // =========================================================================
  // SIMULATOR 3: GEAR TRAIN KINEMATICS (gear-train-mechanics)
  // =========================================================================
  let gearATeeth = $state(10);
  let gearBTeeth = $state(20);
  let motorRpm = $state(60);

  const gearRatio = $derived(Math.round((gearBTeeth / gearATeeth) * 100) / 100);
  const outputRpm = $derived(Math.round((motorRpm / gearRatio) * 10) / 10);
  const torqueMultiplier = $derived(gearRatio);
  const passesGearCriteria = $derived(gearRatio === 2.0 && outputRpm === 30.0);

  // =========================================================================
  // SIMULATOR 4: ENVIRONMENTAL TELEMETRY FILTER (climate-sensor)
  // =========================================================================
  let filterWindow = $state(8); // 1 to 15
  let driftCompensationEnabled = $state(true);
  const signalNoiseReduction = $derived(Math.min(99, Math.round(filterWindow * 9.5 + (driftCompensationEnabled ? 20 : 0))));
  const statisticalConfidence = $derived(Math.min(99.5, Math.round(85 + (filterWindow * 1.4) + (driftCompensationEnabled ? 4 : 0))));
  const passesTelemetryCriteria = $derived(signalNoiseReduction >= 90 && statisticalConfidence >= 95.0);

  // =========================================================================
  // SIMULATOR 5: ULTRASONIC CORNER EVASION (sonar-autonomous-rover)
  // =========================================================================
  let detectionThresholdCm = $state(25);
  let multiDirectionalScan = $state(true);
  let cornerEscapeLogic = $state(true);
  const cornerEscapeRate = $derived(multiDirectionalScan && cornerEscapeLogic ? 100 : multiDirectionalScan ? 65 : 20);
  const passesSonarCriteria = $derived(cornerEscapeRate === 100 && detectionThresholdCm >= 20);

  // =========================================================================
  // SIMULATOR 6: FRC WINCH LIFT STATICS (frc-winch-kinematics)
  // =========================================================================
  let spoolRadiusInches = $state(2.0); // 1.0 to 4.0 inches
  let robotWeightLbs = 120; // 120 lbs FRC limit
  let planetaryRatio = $state(25); // 15:1 to 40:1

  const totalDrumTorqueInLbs = $derived(Math.round(robotWeightLbs * spoolRadiusInches));
  const motorRequiredTorqueInLbs = $derived(Math.round((totalDrumTorqueInLbs / (planetaryRatio * 0.85)) * 10) / 10);
  const safetyFactor = $derived(Math.round((28.0 / motorRequiredTorqueInLbs) * 10) / 10); // CIM/Falcon motor max holding torque ~28 in-lbs
  const passesWinchCriteria = $derived(totalDrumTorqueInLbs === 240 && safetyFactor >= 1.5);

  // =========================================================================
  // SIMULATOR 7: COMPUTER VISION COLOR TRACKING (cv-element-tracker)
  // =========================================================================
  let colorSpace = $state<'HSV' | 'BGR'>('HSV');
  let ambientLightingLux = $state(500); // 200 to 1200 lux
  let hueTolerance = $state(15);

  const lightingStability = $derived(colorSpace === 'HSV' ? 96 : Math.max(30, Math.round(100 - Math.abs(ambientLightingLux - 500) * 0.12)));
  const boundingBoxIou = $derived(colorSpace === 'HSV' && hueTolerance >= 10 && hueTolerance <= 20 ? 0.92 : 0.62);
  const passesCvCriteria = $derived(colorSpace === 'HSV' && boundingBoxIou >= 0.85);

  // =========================================================================
  // SIMULATOR 8: CLOSED-LOOP PID TUNER (closed-loop-pid)
  // =========================================================================
  let kP = $state(1.8);
  let kI = $state(0.4);
  let kD = $state(0.85);

  const overshootPercent = $derived(Math.max(0, Math.round((kP * 5.2 - kD * 4.0) * 10) / 10));
  const settlingTimeSec = $derived(Math.max(0.8, Math.round((4.0 / (kP + kD * 1.5)) * 10) / 10));
  const steadyStateError = $derived(kI > 0.2 ? 0.0 : 0.15);
  const passesPidCriteria = $derived(overshootPercent < 8.0 && settlingTimeSec < 2.5 && steadyStateError === 0.0);

  // =========================================================================
  // OVERALL PASS CRITERIA ACROSS ALL SIMULATOR TYPES
  // =========================================================================
  const isMissionPassed = $derived.by(() => {
    switch (mission.simulatorType) {
      case 'truss':
        return passesTrussCriteria;
      case 'grid_rover':
        return roverStatus === 'success';
      case 'gear_train':
        return passesGearCriteria;
      case 'sensor_telemetry':
        return passesTelemetryCriteria;
      case 'obstacle_avoidance':
        return passesSonarCriteria;
      case 'winch_lift':
        return passesWinchCriteria;
      case 'cv_vision':
        return passesCvCriteria;
      case 'pid_control':
        return passesPidCriteria;
      default:
        return true;
    }
  });

  // SUBMISSION LOGIC
  async function submitMission() {
    if (isSubmitting) return;
    isSubmitting = true;

    try {
      let payload: any = {
        missionId: mission.id,
        missionTitle: mission.title,
        competency: mission.domain,
        learnerNotes: studentNotes.trim()
      };

      if (mission.simulatorType === 'truss') {
        payload = {
          ...payload,
          trussType,
          material: material === 'carbon' ? 'carbon_fiber' : material,
          massKg,
          maxLoadKg: maxSupportedLoadKg,
          ratio: strengthToWeightRatio
        };
      } else {
        payload = {
          ...payload,
          missionType: 'stem_simulation',
          solution: {
            simulatorType: mission.simulatorType,
            summary: `Passed all target rubric thresholds for ${mission.title}`,
            rubricResults: { verified: true, passRate: 1.0 }
          }
        };
      }

      const res = await fetch('/api/v1/missions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resJson = await res.json();
      submissionResult = resJson;
      if (resJson.success) {
        evidenceModalOpen = true;
      }
    } catch (err: any) {
      submissionResult = {
        success: false,
        message: err.message || 'Could not verify mission submission'
      };
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>{mission.title} — CREED OS Proving Ground</title>
</svelte:head>

<div class="max-w-6xl mx-auto space-y-6 py-4 px-4 sm:px-6 pb-20">
  <!-- BREADCRUMB & HEADER -->
  <header class="space-y-3 pb-4 border-b border-border">
    <div class="flex items-center justify-between">
      <a
        href="/student/missions"
        class="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft class="w-3.5 h-3.5" />
        <span>Return to Missions Studio</span>
      </a>

      <div class="flex items-center gap-2">
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-ai-subtle text-ai border border-ai/30">
          LEVEL 4 APPLIED TASK
        </span>
        <button
          type="button"
          onclick={() => (socraticDrawerOpen = true)}
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm bg-surface-raised border border-border text-foreground text-xs font-medium hover:border-border-strong cursor-pointer"
        >
          <Sparkles class="w-3.5 h-3.5 text-ai" />
          <span>Socratic Guide</span>
        </button>
      </div>
    </div>

    <div class="space-y-1">
      <div class="flex items-center gap-2 text-xs font-mono text-muted">
        <span>{mission.code}</span>
        <span>•</span>
        <span class="text-ai font-semibold">{mission.stageLabel}</span>
        <span>•</span>
        <span>{mission.domainTitle}</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {mission.title}
      </h1>
      <p class="text-xs sm:text-sm text-muted max-w-3xl leading-relaxed">
        {mission.brief}
      </p>
    </div>

    <!-- Rubric Targets Strip -->
    <div class="flex flex-wrap items-center gap-4 py-2 px-4 bg-surface border border-border rounded-sm text-xs">
      {#each mission.rubricCriteria as rc}
        <div class="flex items-center gap-1.5">
          <CheckCircle2 class="w-3.5 h-3.5 text-positive" />
          <span class="text-muted">{rc.criterion}:</span>
          <span class="font-mono font-bold text-foreground">{rc.target}</span>
        </div>
      {/each}
    </div>
  </header>

  <!-- WORKBENCH DUAL-PANE -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <!-- LEFT 7 COLS: INTERACTIVE SIMULATION VISUALIZER -->
    <div class="lg:col-span-7 space-y-4">
      <div class="p-5 bg-surface border border-border rounded-sm space-y-4">
        <div class="flex items-center justify-between text-xs">
          <span class="font-semibold text-foreground flex items-center gap-1.5">
            <Activity class="w-3.5 h-3.5 text-ai" />
            <span>Interactive Proving Ground Simulation</span>
          </span>
          <span class="font-mono text-[10px] uppercase text-muted">
            Engine: Deterministic Physics Model • 12.0 METERS SPAN
          </span>
        </div>

        <!-- SIMULATOR CONTAINER -->
        <div class="w-full min-h-75 bg-surface-raised border border-border rounded-sm p-4 flex flex-col items-center justify-center relative overflow-hidden">
          {#if mission.simulatorType === 'truss'}
            <!-- TRUSS SVG CANVAS -->
            <svg viewBox="0 0 600 240" class="w-full h-56">
              <rect x="0" y="160" width="80" height="80" fill="var(--color-surface, #1e293b)" stroke="currentColor" stroke-width="1.5" class="text-border" />
              <rect x="520" y="160" width="80" height="80" fill="var(--color-surface, #1e293b)" stroke="currentColor" stroke-width="1.5" class="text-border" />
              <line x1="80" y1="160" x2="520" y2="160" stroke="#64748b" stroke-width="2" />
              <!-- Truss members -->
              {#each [0, 1, 2, 3] as bay}
                {@const x1 = 80 + bay * 110}
                {@const x2 = x1 + 110}
                {@const xm = (x1 + x2) / 2}
                <line x1={x1} y1="160" x2={xm} y2="90" stroke={stressPercentage > 85 ? '#ef4444' : '#38bdf8'} stroke-width="3" />
                <line x1={xm} y1="90" x2={x2} y2="160" stroke={stressPercentage > 85 ? '#ef4444' : '#38bdf8'} stroke-width="3" />
                <line x1={x1} y1="90" x2={x2} y2="90" stroke="#38bdf8" stroke-width="2.5" />
              {/each}
              <!-- Deflection indicator -->
              <circle cx="300" cy={160 + centerDeflectionMm * 0.8} r="6" fill="#f43f5e" />
            </svg>
            <div class="flex items-center justify-between w-full pt-2 text-xs border-t border-border">
              <span>Bridge Mass: <strong class="font-mono text-foreground">{massKg} kg</strong></span>
              <span>Strength-to-Weight: <strong class="font-mono text-foreground font-semibold">{strengthToWeightRatio}x</strong></span>
              <span>Deflection: <strong class="font-mono {centerDeflectionMm <= 18 ? 'text-positive' : 'text-critical'}">{centerDeflectionMm} mm</strong></span>
            </div>

          {:else if mission.simulatorType === 'grid_rover'}
            <!-- 5x5 MARTIAN GRID CANVAS -->
            <div class="grid grid-cols-5 gap-1.5 p-3 bg-surface border border-border rounded-sm">
              {#each Array(25) as _, idx}
                {@const gx = idx % 5}
                {@const gy = 4 - Math.floor(idx / 5)}
                {@const isRover = roverX === gx && roverY === gy}
                {@const isTarget = targetBase.x === gx && targetBase.y === gy}
                {@const isCrater = craters.some(c => c.x === gx && c.y === gy)}
                <div class="w-12 h-12 border border-border flex items-center justify-center font-mono text-[10px] relative {isCrater ? 'bg-critical-subtle text-critical' : isTarget ? 'bg-positive-subtle text-positive' : isRover ? 'bg-ai-subtle text-ai' : 'bg-surface-raised text-muted'}">
                  {#if isRover}
                    <div class="font-bold flex flex-col items-center">
                      <span>🤖</span>
                      <span class="text-[8px]">{roverHeading}°</span>
                    </div>
                  {:else if isTarget}
                    <span class="text-base">🏁</span>
                  {:else if isCrater}
                    <span class="text-base">🕳️</span>
                  {:else}
                    <span class="text-[8px] opacity-40">{gx},{gy}</span>
                  {/if}
                </div>
              {/each}
            </div>

            <div class="flex items-center justify-between w-full pt-3 text-xs border-t border-border">
              <span class="text-muted">Pos: ({roverX}, {roverY}) Heading: {roverHeading}°</span>
              <span class="font-bold {roverStatus === 'success' ? 'text-positive' : roverStatus === 'collision' ? 'text-critical' : roverStatus === 'boundary' ? 'text-attention' : 'text-muted'}">
                Status: {roverStatus.toUpperCase()}
              </span>
            </div>

          {:else if mission.simulatorType === 'gear_train'}
            <!-- GEAR TRAIN SIMULATOR -->
            <div class="flex items-center justify-center gap-6 py-6 w-full">
              <div class="flex flex-col items-center space-y-2">
                <div class="w-24 h-24 rounded-full border-4 border-dashed border-ai flex items-center justify-center bg-ai-subtle"> <!-- allowed-circle: gear wheel -->
                  <span class="font-mono font-bold text-xs">{gearATeeth}T</span>
                </div>
                <span class="text-[11px] text-muted">Driving Gear (CW)</span>
                <span class="font-mono text-xs text-foreground">{motorRpm} RPM</span>
              </div>

              <span class="text-lg font-bold text-muted">⇄</span>

              <div class="flex flex-col items-center space-y-2">
                <div class="w-36 h-36 rounded-full border-4 border-dashed border-positive flex items-center justify-center bg-positive-subtle"> <!-- allowed-circle: gear wheel -->
                  <span class="font-mono font-bold text-xs">{gearBTeeth}T</span>
                </div>
                <span class="text-[11px] text-muted">Driven Gear (CCW)</span>
                <span class="font-mono text-xs text-positive">{outputRpm} RPM</span>
              </div>
            </div>

            <div class="flex items-center justify-between w-full pt-3 text-xs border-t border-border">
              <span>Ratio: <strong class="font-mono text-foreground">{gearRatio}:1</strong></span>
              <span>Torque Multiplication: <strong class="font-mono text-positive">{torqueMultiplier}x</strong></span>
              <span>Direction: <strong class="font-mono text-foreground">Inverted (CCW)</strong></span>
            </div>

          {:else if mission.simulatorType === 'sensor_telemetry'}
            <!-- SENSOR TELEMETRY FILTER -->
            <div class="w-full space-y-3 py-4">
              <div class="h-28 w-full bg-surface border border-border flex items-center justify-center relative p-3">
                <svg viewBox="0 0 400 100" class="w-full h-full">
                  <path d="M 0 50 Q 50 20 100 60 T 200 40 T 300 80 T 400 30" fill="none" stroke="#64748b" stroke-width="1.5" stroke-dasharray="3,3" />
                  <path d="M 0 50 Q 50 {50 - filterWindow * 2} 100 55 T 200 {50 - filterWindow * 1.5} T 300 {50 + filterWindow} T 400 45" fill="none" stroke="#10b981" stroke-width="2.5" />
                  <circle cx="280" cy="52" r="5" fill="#f43f5e" />
                </svg>
                <span class="absolute top-2 right-2 text-[10px] font-mono text-critical">Microclimate Anomaly (+3.2°C)</span>
              </div>
            </div>

            <div class="flex items-center justify-between w-full pt-2 text-xs border-t border-border">
              <span>Noise Reduction: <strong class="font-mono text-positive">{signalNoiseReduction}%</strong></span>
              <span>Statistical Confidence: <strong class="font-mono text-ai">{statisticalConfidence}% CI</strong></span>
              <span>Drift Compensation: <strong class="font-mono text-foreground">{driftCompensationEnabled ? 'ACTIVE' : 'OFF'}</strong></span>
            </div>

          {:else if mission.simulatorType === 'obstacle_avoidance'}
            <!-- SONAR ARENA -->
            <div class="w-full h-44 bg-surface border border-border flex items-center justify-center relative overflow-hidden">
              <div class="absolute left-6 top-6 bottom-6 w-3 bg-critical/40"></div>
              <div class="absolute left-6 top-6 right-6 h-3 bg-critical/40"></div>
              <div class="p-3 bg-ai-subtle border border-ai text-xs font-mono rounded-sm">
                ROVER ARENA (Corner Trap Matrix)
              </div>
            </div>

            <div class="flex items-center justify-between w-full pt-2 text-xs border-t border-border">
              <span>Detection Distance: <strong class="font-mono text-foreground">{detectionThresholdCm} cm</strong></span>
              <span>Corner Escape Rate: <strong class="font-mono {cornerEscapeRate === 100 ? 'text-positive' : 'text-critical'}">{cornerEscapeRate}%</strong></span>
            </div>

          {:else if mission.simulatorType === 'winch_lift'}
            <!-- WINCH STATICS -->
            <div class="w-full flex items-center justify-around py-6 text-xs">
              <div class="text-center space-y-1">
                <span class="text-muted text-[11px]">Spool Drum Radius</span>
                <p class="text-xl font-bold font-mono text-foreground">{spoolRadiusInches} in</p>
              </div>
              <span class="text-xl font-bold text-muted">×</span>
              <div class="text-center space-y-1">
                <span class="text-muted text-[11px]">FRC Mass Load</span>
                <p class="text-xl font-bold font-mono text-foreground">120 lbs</p>
              </div>
              <span class="text-xl font-bold text-muted">=</span>
              <div class="text-center space-y-1">
                <span class="text-muted text-[11px]">Required Torque</span>
                <p class="text-xl font-bold font-mono text-ai">{totalDrumTorqueInLbs} in-lbs</p>
              </div>
            </div>

            <div class="flex items-center justify-between w-full pt-2 text-xs border-t border-border">
              <span>Planetary Ratio: <strong class="font-mono text-foreground">{planetaryRatio}:1</strong></span>
              <span>Motor Torque: <strong class="font-mono text-foreground">{motorRequiredTorqueInLbs} in-lbs</strong></span>
              <span>Safety Factor: <strong class="font-mono {safetyFactor >= 1.5 ? 'text-positive' : 'text-critical'}">{safetyFactor}x</strong></span>
            </div>

          {:else if mission.simulatorType === 'cv_vision'}
            <!-- COMPUTER VISION -->
            <div class="w-full flex items-center justify-around py-6 text-xs">
              <div class="text-center space-y-1">
                <span class="text-muted text-[11px]">Active Color Space</span>
                <p class="text-base font-bold font-mono text-ai">{colorSpace}</p>
              </div>
              <div class="text-center space-y-1">
                <span class="text-muted text-[11px]">Ambient Illuminance</span>
                <p class="text-base font-bold font-mono text-foreground">{ambientLightingLux} Lux</p>
              </div>
              <div class="text-center space-y-1">
                <span class="text-muted text-[11px]">Bounding Box IOU</span>
                <p class="text-base font-bold font-mono {boundingBoxIou >= 0.85 ? 'text-positive' : 'text-critical'}">{boundingBoxIou}</p>
              </div>
            </div>

            <div class="flex items-center justify-between w-full pt-2 text-xs border-t border-border">
              <span>Lighting Stability: <strong class="font-mono text-positive">{lightingStability}%</strong></span>
              <span>WRO Target Match: <strong class="font-mono text-foreground">{passesCvCriteria ? 'PASSED' : 'DRIFTING'}</strong></span>
            </div>

          {:else if mission.simulatorType === 'pid_control'}
            <!-- PID TUNER -->
            <div class="w-full space-y-2 py-4">
              <div class="h-28 w-full bg-surface border border-border flex items-center justify-center p-3">
                <svg viewBox="0 0 300 80" class="w-full h-full">
                  <line x1="0" y1="30" x2="300" y2="30" stroke="#64748b" stroke-dasharray="4 4" />
                  <path d="M 0 70 Q 40 {30 - overshootPercent * 2} 80 32 T 160 30 T 300 30" fill="none" stroke="#10b981" stroke-width="2.5" />
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between w-full pt-2 text-xs border-t border-border">
              <span>Overshoot: <strong class="font-mono {overshootPercent < 8 ? 'text-positive' : 'text-critical'}">{overshootPercent}%</strong></span>
              <span>Settling Time: <strong class="font-mono {settlingTimeSec < 2.5 ? 'text-positive' : 'text-critical'}">{settlingTimeSec}s</strong></span>
              <span>Steady-State Error: <strong class="font-mono text-positive">{steadyStateError}</strong></span>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- RIGHT 5 COLS: CONTROLS & SUBMISSION PANEL -->
    <div class="lg:col-span-5 space-y-4">
      <div class="p-5 bg-surface border border-border rounded-sm space-y-5 text-xs">
        <div class="flex items-center justify-between pb-2 border-b border-border">
          <div class="flex items-center gap-2">
            <Sliders class="w-4 h-4 text-ai" />
            <h2 class="text-sm font-semibold text-foreground">Mission Control Deck</h2>
          </div>
          <a
            href="/ide"
            class="text-[11px] text-ai hover:underline flex items-center gap-1 font-mono"
          >
            <TerminalSquare class="w-3 h-3" />
            <span>Open in IDE</span>
          </a>
        </div>

        <!-- DYNAMIC CONTROLS PER SIMULATOR TYPE -->
        {#if mission.simulatorType === 'truss'}
          <div class="space-y-3">
            <div class="space-y-1.5">
              <span class="font-medium text-foreground">Truss Architecture</span>
              <div class="grid grid-cols-3 gap-2">
                {#each (['warren', 'pratt', 'howe'] as const) as type}
                  <button
                    type="button"
                    onclick={() => (trussType = type)}
                    class="p-2 border text-center rounded-sm transition-colors cursor-pointer {trussType === type ? 'border-ai bg-surface-raised font-bold text-foreground' : 'border-border text-muted hover:text-foreground'}"
                  >
                    <span class="capitalize">{type}</span>
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-1.5">
              <span class="font-medium text-foreground">Material</span>
              <div class="grid grid-cols-3 gap-2">
                {#each (['aluminum', 'carbon', 'titanium'] as const) as mat}
                  <button
                    type="button"
                    onclick={() => (material = mat)}
                    class="p-2 border text-center rounded-sm transition-colors cursor-pointer {material === mat ? 'border-ai bg-surface-raised font-bold text-foreground' : 'border-border text-muted hover:text-foreground'}"
                  >
                    <span class="capitalize">{mat}</span>
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Strut Thickness</span>
                <span class="font-mono font-bold text-foreground">{strutThicknessMm} mm</span>
              </div>
              <input type="range" min="14" max="36" bind:value={strutThicknessMm} class="w-full accent-ai" />
            </div>
          </div>

        {:else if mission.simulatorType === 'grid_rover'}
          <div class="space-y-3">
            <span class="font-medium text-foreground">Input Navigation Commands</span>
            <div class="grid grid-cols-3 gap-2">
              <button onclick={() => addRoverCommand('FORWARD')} class="p-2 bg-surface-raised border border-border text-xs rounded-sm hover:border-ai cursor-pointer">
                FORWARD 1
              </button>
              <button onclick={() => addRoverCommand('LEFT')} class="p-2 bg-surface-raised border border-border text-xs rounded-sm hover:border-ai cursor-pointer">
                TURN LEFT 90°
              </button>
              <button onclick={() => addRoverCommand('RIGHT')} class="p-2 bg-surface-raised border border-border text-xs rounded-sm hover:border-ai cursor-pointer">
                TURN RIGHT 90°
              </button>
            </div>

            <div class="p-2 bg-surface-raised border border-border rounded-sm space-y-1 min-h-12.5">
              <span class="text-[10px] font-mono text-muted uppercase font-semibold">Active Sequence ({roverCommands.length}/12):</span>
              <p class="font-mono text-xs text-foreground">{roverCommands.join(' → ') || 'No commands queued.'}</p>
            </div>

            <div class="flex gap-2">
              <button onclick={runRoverSimulation} class="flex-1 py-2 bg-foreground text-background font-medium rounded-sm hover:bg-foreground/90 cursor-pointer flex items-center justify-center gap-1.5">
                <Play class="w-3.5 h-3.5" />
                <span>Execute Sequence</span>
              </button>
              <button onclick={resetRover} class="px-3 py-2 border border-border text-muted rounded-sm hover:text-foreground cursor-pointer">
                <RotateCcw class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        {:else if mission.simulatorType === 'gear_train'}
          <div class="space-y-3">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Gear A Teeth (Driving)</span>
                <span class="font-mono font-bold text-foreground">{gearATeeth} Teeth</span>
              </div>
              <input type="range" min="8" max="24" step="2" bind:value={gearATeeth} class="w-full accent-indigo-500" />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Gear B Teeth (Driven)</span>
                <span class="font-mono font-bold text-foreground">{gearBTeeth} Teeth</span>
              </div>
              <input type="range" min="12" max="40" step="2" bind:value={gearBTeeth} class="w-full accent-indigo-500" />
            </div>
          </div>

        {:else if mission.simulatorType === 'sensor_telemetry'}
          <div class="space-y-3">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Moving Average Smoothing Window</span>
                <span class="font-mono font-bold text-foreground">{filterWindow} Samples</span>
              </div>
              <input type="range" min="1" max="15" bind:value={filterWindow} class="w-full accent-indigo-500" />
            </div>

            <label class="flex items-center gap-2 cursor-pointer pt-2">
              <input type="checkbox" bind:checked={driftCompensationEnabled} class="accent-indigo-500" />
              <span class="text-xs text-foreground">Enable Baseline Thermal Drift Compensation</span>
            </label>
          </div>

        {:else if mission.simulatorType === 'obstacle_avoidance'}
          <div class="space-y-3">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Detection Threshold</span>
                <span class="font-mono font-bold text-foreground">{detectionThresholdCm} cm</span>
              </div>
              <input type="range" min="10" max="45" bind:value={detectionThresholdCm} class="w-full accent-indigo-500" />
            </div>

            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" bind:checked={multiDirectionalScan} class="accent-indigo-500" />
              <span>Multi-Directional Ultrasonic Scan (Scan Left & Right)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" bind:checked={cornerEscapeLogic} class="accent-indigo-500" />
              <span>FSM Corner Evasion State Machine</span>
            </label>
          </div>

        {:else if mission.simulatorType === 'winch_lift'}
          <div class="space-y-3">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Spool Drum Radius</span>
                <span class="font-mono font-bold text-foreground">{spoolRadiusInches} in</span>
              </div>
              <input type="range" min="1" max="4" step="0.5" bind:value={spoolRadiusInches} class="w-full accent-indigo-500" />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Planetary Reduction Ratio</span>
                <span class="font-mono font-bold text-foreground">{planetaryRatio}:1</span>
              </div>
              <input type="range" min="15" max="40" step="5" bind:value={planetaryRatio} class="w-full accent-ai" />
            </div>
          </div>

        {:else if mission.simulatorType === 'cv_vision'}
          <div class="space-y-3">
            <div class="space-y-1.5">
              <span class="font-medium text-foreground">Color Space Format</span>
              <div class="grid grid-cols-2 gap-2">
                {#each (['HSV', 'BGR'] as const) as cs}
                  <button
                    onclick={() => (colorSpace = cs)}
                    class="p-2 border text-center rounded-sm cursor-pointer {colorSpace === cs ? 'border-ai bg-surface-raised font-bold text-foreground' : 'border-border text-muted hover:text-foreground'}"
                  >
                    {cs}
                  </button>
                {/each}
              </div>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Ambient Illuminance</span>
                <span class="font-mono font-bold text-foreground">{ambientLightingLux} Lux</span>
              </div>
              <input type="range" min="200" max="1200" step="100" bind:value={ambientLightingLux} class="w-full accent-indigo-500" />
            </div>
          </div>

        {:else if mission.simulatorType === 'pid_control'}
          <div class="space-y-3">
            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Kp (Proportional)</span>
                <span class="font-mono font-bold text-foreground">{kP}</span>
              </div>
              <input type="range" min="0.5" max="3.5" step="0.1" bind:value={kP} class="w-full accent-indigo-500" />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Ki (Integral)</span>
                <span class="font-mono font-bold text-foreground">{kI}</span>
              </div>
              <input type="range" min="0" max="1.5" step="0.1" bind:value={kI} class="w-full accent-indigo-500" />
            </div>

            <div class="space-y-1">
              <div class="flex justify-between">
                <span>Kd (Derivative)</span>
                <span class="font-mono font-bold text-foreground">{kD}</span>
              </div>
              <input type="range" min="0" max="2.0" step="0.05" bind:value={kD} class="w-full accent-ai" />
            </div>
          </div>
        {/if}

        <!-- CRITERIA STATUS BADGE -->
        <div class="p-3 rounded-sm border {isMissionPassed ? 'bg-positive-subtle border-positive/30 text-positive' : 'bg-attention-subtle border-attention/30 text-attention'} flex items-center gap-2">
          {#if isMissionPassed}
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span class="font-medium">All target rubric requirements satisfied!</span>
          {:else}
            <AlertTriangle class="w-4 h-4 shrink-0" />
            <span class="font-medium">Specifications not met. Adjust parameters or test commands.</span>
          {/if}
        </div>

        <!-- SUBMIT ACTION BUTTON -->
        <button
          onclick={submitMission}
          disabled={!isMissionPassed || isSubmitting}
          class="w-full py-2 px-4 bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium rounded-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send class="w-3.5 h-3.5" />
          <span>{isSubmitting ? 'Evaluating Verification...' : 'Submit Design for Level 4 Evidence'}</span>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- SOCRATIC GUIDE DRAWER -->
<InspectorPanel
  bind:open={socraticDrawerOpen}
  title="Socratic Reasoning Partner"
  subtitle="Guided inquiry for applied engineering"
>
  <div class="space-y-4 text-xs">
    <div class="p-3 bg-ai-subtle border border-ai/20 text-ai rounded-sm space-y-1">
      <div class="flex items-center gap-1.5 font-semibold">
        <Sparkles class="w-3.5 h-3.5" />
        <span>Inquiry Heuristic</span>
      </div>
      <p class="text-xs text-muted leading-relaxed">
        {mission.pedagogicalObjective}
      </p>
    </div>

    <div class="space-y-2">
      <span class="font-semibold text-foreground uppercase tracking-wider text-[10px] font-mono">
        Guiding Questions:
      </span>
      <ul class="space-y-2 text-muted">
        <li class="p-2 bg-surface-raised border border-border rounded-sm">
          <strong>1. Core Principles:</strong> How does your chosen configuration balance competing constraints (e.g. mass vs strength, speed vs stability)?
        </li>
        <li class="p-2 bg-surface-raised border border-border rounded-sm">
          <strong>2. Failure Modes:</strong> What physical condition causes the first failure point in this system?
        </li>
      </ul>
    </div>
  </div>
</InspectorPanel>

<!-- SUCCESS EVIDENCE RECEIPT MODAL -->
<InspectorPanel
  bind:open={evidenceModalOpen}
  title="Verified Level 4 Applied Evidence"
  subtitle="Logged to learner longitudinal growth graph"
>
  {#if submissionResult?.evidence}
    <div class="space-y-5 text-xs">
      <div class="p-3.5 bg-positive-subtle border border-positive/30 text-positive rounded-sm flex items-center gap-2">
        <CheckCircle2 class="w-5 h-5 shrink-0" />
        <div class="space-y-0.5">
          <p class="font-bold text-sm">Challenge Verified & Passed</p>
          <p class="text-[11px] text-muted">Evidence Level 4 (Applied Mission Task) recorded.</p>
        </div>
      </div>

      <div class="p-4 bg-surface-raised border border-border rounded-sm space-y-3">
        <div class="flex justify-between items-center text-xs">
          <span class="text-muted">Source Challenge:</span>
          <span class="font-semibold text-foreground">{submissionResult.evidence.sourceTitle}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-muted">Competency Track:</span>
          <span class="font-semibold text-ai uppercase">{submissionResult.evidence.competency.replace('_', ' ')}</span>
        </div>
        <div class="flex justify-between items-center text-xs">
          <span class="text-muted">Evidence Level:</span>
          <EvidenceRating rating={4} max={5} label="Level 4 Applied" />
        </div>
        <div class="pt-2 border-t border-border text-muted leading-relaxed">
          {submissionResult.evidence.summary}
        </div>
      </div>

      <div class="pt-4 border-t border-border flex flex-col gap-2">
        <a
          href="/student/missions"
          class="w-full py-2 px-4 bg-foreground text-background hover:bg-foreground/90 font-medium text-center rounded-sm cursor-pointer shadow-xs"
        >
          Return to Missions Studio
        </a>
        <a
          href="/student/progress"
          class="w-full py-2 px-4 border border-border hover:bg-surface-raised text-foreground text-center rounded-sm cursor-pointer"
        >
          View Updated Capabilities Ledger
        </a>
      </div>
    </div>
  {/if}
</InspectorPanel>
