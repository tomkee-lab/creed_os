<script lang="ts">
  import { onMount } from 'svelte';
  import { Compass, Bot, Cpu, Radio, Zap, Activity, CheckCircle2, Layers, RotateCcw, ChevronDown, X, Info } from 'lucide-svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { webAudioSynth } from './webAudioSynth';

  interface PenTrail {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    size: number;
  }

  interface MotionSegment {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }

  interface Props {
    roverX: number;
    roverY: number;
    roverHeading: number;
    roverDistance: number;
    roverSensorActive?: boolean;
    batteryLevel?: number;
    radiationLevel?: number;
    samplesCollected?: number;
    solarDeployed?: boolean;
    penTrails: PenTrail[];
    motionPath?: MotionSegment[];
    activeActionText?: string | null;
    currentMicrobitIcon?: string;
    activeMicrobitGrid: number[][];
    // Expressive Bot & Performance Props
    robotEmotion?: string;
    isJumping?: boolean;
    jumpHeight?: number;
    isDancing?: boolean;
    danceStyle?: string;
    speechBubbleText?: string | null;
    isHardwareBridgeConnected?: boolean;
    hideHeader?: boolean;
    hideMicrobitBar?: boolean;
    viewMode?: 'field' | 'inspection' | 'arena' | 'companion';
    isDark?: boolean;
    activeMissionTitle?: string;
    activeMissionLevel?: number;
    activeMissionIcon?: string;
    onOpenMissionBrief?: () => void;
    onReset: () => void;
    onSetPosition?: (x: number, y: number) => void;
    onButtonPress?: (button: 'A' | 'B') => void;
  }

  let {
    roverX = 240,
    roverY = 220,
    roverHeading = 0,
    roverDistance = 38,
    roverSensorActive = false,
    batteryLevel = 94,
    radiationLevel = 1.4,
    samplesCollected = 0,
    solarDeployed = false,
    penTrails = [],
    motionPath = [],
    activeActionText = null,
    currentMicrobitIcon = 'HAPPY',
    activeMicrobitGrid = [
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ],
    robotEmotion = 'HAPPY',
    isJumping = false,
    jumpHeight = 0,
    isDancing = false,
    danceStyle = 'TWIRL',
    speechBubbleText = null,
    isHardwareBridgeConnected = false,
    hideHeader = false,
    hideMicrobitBar = false,
    viewMode = 'arena',
    isDark = undefined,
    activeMissionTitle = undefined,
    activeMissionLevel = 1,
    activeMissionIcon = '🚀',
    onOpenMissionBrief = undefined,
    onReset,
    onSetPosition,
    onButtonPress
  }: Props = $props();

  // Dual-mode view: 'field' (autonomous proving ground) vs 'inspection' (vehicle detail inspection blueprint)
  let arenaViewMode = $state<'field' | 'inspection'>('field');
  $effect(() => {
    if (viewMode === 'companion' || viewMode === 'inspection') {
      arenaViewMode = 'inspection';
    } else if (viewMode === 'arena' || viewMode === 'field') {
      arenaViewMode = 'field';
    }
  });

  // Dynamic Theme Detection (Synchronized with global light/dark class on <html> or isDark prop)
  let isDarkTheme = $state(false);
  $effect(() => {
    if (isDark !== undefined) {
      isDarkTheme = isDark;
    }
  });

  // Local interactive performance test states
  let localEmotion = $state<string | null>(null);
  let localJumping = $state(false);
  let localDancing = $state(false);
  let localDanceStyle = $state('TWIRL');
  let localSpeech = $state<string | null>(null);

  let effectiveEmotion = $derived(
    (localEmotion || robotEmotion || currentMicrobitIcon || 'HAPPY')
      .replace('Image.', '')
      .trim()
      .toUpperCase()
  );
  let effectiveIsJumping = $derived(localJumping || isJumping);
  let effectiveJumpHeight = $derived(localJumping ? 1 : (jumpHeight || 0));
  let effectiveIsDancing = $derived(localDancing || isDancing);
  let effectiveDanceStyle = $derived(localDancing ? localDanceStyle : (danceStyle || 'TWIRL'));
  let effectiveSpeech = $derived(localSpeech || speechBubbleText);

  // Visor color token based on active emotion
  let visorBorderColor = $derived.by(() => {
    switch (effectiveEmotion) {
      case 'HEART':
      case 'LOVE':
        return '#f43f5e';
      case 'PARTY':
      case 'CELEBRATE':
        return '#eab308';
      case 'PROUD':
      case 'COOL':
        return '#10b981';
      case 'ANGRY':
        return '#ef4444';
      case 'SAD':
        return '#60a5fa';
      default:
        return '#38bdf8';
    }
  });

  let visorGlowColor = $derived.by(() => {
    switch (effectiveEmotion) {
      case 'HEART':
      case 'LOVE':
        return '#fb7185';
      case 'PARTY':
        return '#fde047';
      case 'PROUD':
      case 'COOL':
        return '#34d399';
      case 'ANGRY':
        return '#f87171';
      case 'SAD':
        return '#93c5fd';
      default:
        return '#7dd3fc';
    }
  });

  onMount(() => {
    const updateTheme = () => {
      if (isDark !== undefined) {
        isDarkTheme = isDark;
        return;
      }
      isDarkTheme =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
    return () => observer.disconnect();
  });

  // Radar/LiDAR beam calculation
  let radHeading = $derived(((roverHeading - 90) * Math.PI) / 180);
  let coneAngle = $derived(Math.PI / 6); // 30 degrees half-angle (60 deg total)
  let scanDistance = $derived(Math.max(20, Math.min(100, roverDistance * 1.8)));

  let beamEndX = $derived(roverX + Math.cos(radHeading) * scanDistance);
  let beamEndY = $derived(roverY + Math.sin(radHeading) * scanDistance);

  let coneLeftX = $derived(roverX + Math.cos(radHeading - coneAngle) * scanDistance);
  let coneLeftY = $derived(roverY + Math.sin(radHeading - coneAngle) * scanDistance);

  let coneRightX = $derived(roverX + Math.cos(radHeading + coneAngle) * scanDistance);
  let coneRightY = $derived(roverY + Math.sin(radHeading + coneAngle) * scanDistance);

  let sensorColor = $derived.by(() => {
    if (roverDistance < 18) return '#ef4444'; // Alert Red
    if (roverDistance < 32) return '#f59e0b'; // Caution Amber
    return '#06b6d4'; // Operational Cyan
  });

  // Adaptive Surface Color Tokens for Light & Dark Themes
  let arenaFloorFill = $derived(isDarkTheme ? '#070b12' : '#eef2f7');
  let gridLineStroke = $derived(isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(15, 23, 42, 0.08)');
  let gridDotFill = $derived(isDarkTheme ? 'rgba(255, 255, 255, 0.15)' : 'rgba(15, 23, 42, 0.20)');
  let contourStroke = $derived(isDarkTheme ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.22)');

  // Perimeter border & text
  let perimeterOuterStroke = $derived(isDarkTheme ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.14)');
  let perimeterInnerStroke = $derived(isDarkTheme ? 'rgba(56, 189, 248, 0.20)' : 'rgba(2, 132, 199, 0.35)');
  let perimeterTextColor = $derived(isDarkTheme ? 'rgba(255, 255, 255, 0.40)' : 'rgba(15, 23, 42, 0.50)');

  // Base Alpha Hub
  let baseHubFill = $derived(isDarkTheme ? 'rgba(30, 41, 59, 0.50)' : 'rgba(224, 242, 254, 0.85)');
  let baseHubStroke = $derived(isDarkTheme ? '#38bdf8' : '#0284c7');
  let baseHubText = $derived(isDarkTheme ? '#38bdf8' : '#0369a1');

  // Sample Alpha & Beta
  let sampleAlphaFill = $derived(isDarkTheme ? 'rgba(16, 185, 129, 0.25)' : 'rgba(209, 250, 229, 0.85)');
  let sampleAlphaStroke = $derived(isDarkTheme ? '#10b981' : '#059669');
  let sampleAlphaText = $derived(isDarkTheme ? '#34d399' : '#047857');

  let sampleBetaFill = $derived(isDarkTheme ? 'rgba(245, 158, 11, 0.30)' : 'rgba(254, 243, 199, 0.85)');
  let sampleBetaStroke = $derived(isDarkTheme ? '#f59e0b' : '#d97706');
  let sampleBetaText = $derived(isDarkTheme ? '#fbbf24' : '#b45309');

  // Hazards: Crater & Ridge
  let craterStop0 = $derived(isDarkTheme ? '#14070a' : '#fee2e2');
  let craterStop1 = $derived(isDarkTheme ? '#2d0a11' : '#fca5a5');
  let craterStop2 = $derived(isDarkTheme ? '#450a0a' : '#f87171');
  let craterCenterFill = $derived(isDarkTheme ? '#14070a' : '#fecaca');
  let craterRimStroke = $derived(isDarkTheme ? '#ef4444' : '#dc2626');
  let craterRimInner = $derived(isDarkTheme ? '#f87171' : '#ef4444');
  let craterText = $derived(isDarkTheme ? '#fca5a5' : '#b91c1c');
  let boulderFill1 = $derived(isDarkTheme ? '#52525b' : '#94a3b8');
  let boulderFill2 = $derived(isDarkTheme ? '#3f3f46' : '#64748b');

  let ridgeFill = $derived(isDarkTheme ? '#141417' : '#e2e8f0');
  let ridgeStroke = $derived(isDarkTheme ? '#f59e0b' : '#d97706');
  let ridgeLineStroke = $derived(isDarkTheme ? 'rgba(245, 158, 11, 0.40)' : 'rgba(217, 119, 6, 0.50)');
  let ridgeText = $derived(isDarkTheme ? '#fde68a' : '#92400e');

  // Rover Sprite Colors
  let roverChassisFill = $derived(isDarkTheme ? '#0f172a' : '#ffffff');
  let roverChassisStroke = $derived(isDarkTheme ? '#0284c7' : '#0284c7');
  let roverSolarFill = $derived(isDarkTheme ? '#1e3a8a' : '#0284c7');
  let roverSolarStroke = $derived(isDarkTheme ? '#38bdf8' : '#38bdf8');
  let roverWheelFill = $derived(isDarkTheme ? '#18181b' : '#334155');
  let roverWheelStroke = $derived(isDarkTheme ? '#3f3f46' : '#64748b');
  let roverStrutStroke = $derived(isDarkTheme ? '#71717a' : '#64748b');
  let roverShadowFill = $derived(isDarkTheme ? 'rgba(0,0,0,0.5)' : 'rgba(15,23,42,0.20)');

  // Interactive Navigation & Grid Layer States
  let showGridLines = $state(true);
  let showSonarBeam = $state(true);
  let showWaypoints = $state(true);
  let showHazards = $state(true);
  let showTrails = $state(true);

  let gridInteractionMode = $state<'navigate' | 'obstacle'>('navigate');

  let targetWaypoint = $state<{ x: number; y: number; active: boolean } | null>(null);

  let waypointDistance = $derived(
    targetWaypoint?.active
      ? Math.round(Math.hypot(targetWaypoint.x - roverX, targetWaypoint.y - roverY))
      : null
  );

  let waypointBearing = $derived.by(() => {
    if (!targetWaypoint?.active) return null;
    const deg = (Math.atan2(targetWaypoint.y - roverY, targetWaypoint.x - roverX) * 180) / Math.PI + 90;
    return Math.round((deg + 360) % 360);
  });

  let dynamicObstacles = $state<Array<{ id: string; x: number; y: number; radius: number }>>([]);

  function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  let effectiveSonarDistance = $derived.by(() => {
    let minD = roverDistance;
    if (dynamicObstacles.length > 0 && showHazards) {
      for (const obs of dynamicObstacles) {
        const dist = pointToSegmentDistance(obs.x, obs.y, roverX, roverY, beamEndX, beamEndY);
        if (dist < obs.radius + 4) {
          const directD = Math.hypot(obs.x - roverX, obs.y - roverY) - obs.radius;
          if (directD < minD) minD = Math.max(5, Math.round(directD));
        }
      }
    }
    return minD;
  });

  function handleContainerClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 480);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 360);
    if (x < 15 || x > 465 || y < 15 || y > 345) return;

    if (gridInteractionMode === 'obstacle') {
      // Check if clicking existing obstacle to remove
      const existingIdx = dynamicObstacles.findIndex((o) => Math.hypot(o.x - x, o.y - y) < o.radius + 8);
      if (existingIdx >= 0) {
        dynamicObstacles = dynamicObstacles.filter((_, idx) => idx !== existingIdx);
        webAudioSynth.playEffect('CHIRP');
      } else {
        dynamicObstacles = [...dynamicObstacles, { id: `obs-${Date.now()}`, x, y, radius: 16 }];
        webAudioSynth.playEffect('BLIP');
      }
      return;
    }

    // Default 'navigate' mode: drop/update waypoint
    targetWaypoint = { x, y, active: true };
    webAudioSynth.playEffect('BLIP');
  }

  function driveToWaypoint() {
    if (!targetWaypoint?.active || !onSetPosition) return;
    webAudioSynth.playEffect('RADAR');
    onSetPosition(targetWaypoint.x, targetWaypoint.y);
  }

  function handleButtonPress(btn: 'A' | 'B') {
    webAudioSynth.playEffect('BLIP');
    onButtonPress?.(btn);
  }

  // Hardware Inspection & Subsystem Diagnostics
  let activeDiagnosticSubsystem = $state<string | null>(null);
  let motorPulseActive = $state(false);
  let sonarPulseActive = $state(false);
  let penActuatorActive = $state(false);
  let radioTxActive = $state(false);

  function triggerSubsystemDiagnostic(system: 'sonar' | 'led' | 'motor' | 'pen' | 'radio') {
    activeDiagnosticSubsystem = system;
    if (system === 'sonar') {
      sonarPulseActive = true;
      webAudioSynth.playEffect('RADAR');
      setTimeout(() => { sonarPulseActive = false; }, 1200);
    } else if (system === 'led') {
      localEmotion = localEmotion === 'HAPPY' ? 'HEART' : localEmotion === 'HEART' ? 'COOL' : 'HAPPY';
      webAudioSynth.playEffect('CHIRP');
      setTimeout(() => { localEmotion = null; }, 3000);
    } else if (system === 'motor') {
      motorPulseActive = true;
      webAudioSynth.playEffect('BLIP');
      setTimeout(() => { motorPulseActive = false; }, 900);
    } else if (system === 'pen') {
      penActuatorActive = true;
      webAudioSynth.playEffect('BLIP');
      setTimeout(() => { penActuatorActive = false; }, 1000);
    } else if (system === 'radio') {
      radioTxActive = true;
      webAudioSynth.playEffect('SUCCESS');
      setTimeout(() => { radioTxActive = false; }, 1500);
    }

    setTimeout(() => {
      if (activeDiagnosticSubsystem === system) activeDiagnosticSubsystem = null;
    }, 2000);
  }
</script>

<div class="relative w-full h-full flex flex-col bg-surface-subtle dark:bg-canvas overflow-hidden select-none transition-colors duration-200">
  <!-- 1. Technical Proving Ground Fixed Toolbar Strip (0% Canvas Occlusion) -->
  {#if !hideHeader}
    <div class="shrink-0 px-2 py-1 bg-surface border-b border-border text-[9.5px] font-mono flex items-center justify-between text-ink-muted select-none gap-2 flex-wrap">
      <!-- Left: Perspective Switcher & Mission Context -->
      <div class="flex items-center gap-1.5 shrink-0">
        <div class="inline-flex p-0.5 bg-surface-subtle border border-border rounded-xs gap-0.5 shrink-0">
          <button
            type="button"
            onclick={() => (arenaViewMode = 'field')}
            class="px-2 py-0.5 rounded-2xs transition-micro font-bold flex items-center gap-1 {arenaViewMode === 'field' ? 'bg-surface text-cyan shadow-2xs' : 'text-ink-muted hover:text-ink'}"
            title="Top-Down Autonomous Proving Ground Field"
          >
            <span>🗺️ Field</span>
          </button>
          <button
            type="button"
            onclick={() => (arenaViewMode = 'inspection')}
            class="px-2 py-0.5 rounded-2xs transition-micro font-bold flex items-center gap-1 {arenaViewMode === 'inspection' ? 'bg-surface text-brand shadow-2xs' : 'text-ink-muted hover:text-ink'}"
            title="ARES-Prime Vehicle Detail Inspection"
          >
            <span>🔍 Inspection</span>
          </button>
        </div>

        {#if activeMissionTitle}
          <button
            type="button"
            onclick={onOpenMissionBrief}
            class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-surface-subtle hover:bg-surface border border-border hover:border-cyan/40 text-[10px] font-mono transition-micro shrink-0 cursor-pointer group"
            title="Open Mission Objective & PRIMM Checklist Dialog"
          >
            <span class="shrink-0">{activeMissionIcon || '🚀'}</span>
            <span class="font-bold text-ink truncate max-w-32 sm:max-w-44 group-hover:text-cyan transition-colors">{activeMissionTitle}</span>
            <span class="text-[9px] px-1 py-0.2 bg-surface border border-border rounded-xs text-ink-muted">
              L{activeMissionLevel || 1}
            </span>
            <span class="text-[9px] text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">ℹ️</span>
          </button>
        {/if}
      </div>

      <!-- Right Controls for Field Proving Ground -->
      {#if arenaViewMode === 'field'}
        <div class="flex items-center gap-1.5 shrink-0 flex-wrap">
          <!-- Interaction Modes -->
          <div class="inline-flex p-0.5 bg-surface-subtle border border-border rounded-xs gap-0.5 shrink-0">
            <button
              type="button"
              onclick={() => (gridInteractionMode = 'navigate')}
              class="px-2 py-0.5 rounded-2xs transition-micro font-bold flex items-center gap-1 {gridInteractionMode === 'navigate' ? 'bg-cyan text-white shadow-2xs' : 'text-ink-muted hover:text-ink'}"
              title="Click grid to drop navigation target waypoint"
            >
              <span>📍 Waypoint</span>
            </button>
            <button
              type="button"
              onclick={() => (gridInteractionMode = 'obstacle')}
              class="px-2 py-0.5 rounded-2xs transition-micro font-bold flex items-center gap-1 {gridInteractionMode === 'obstacle' ? 'bg-rose-500 text-white shadow-2xs' : 'text-ink-muted hover:text-ink'}"
              title="Click grid to add or remove obstacle pylons"
            >
              <span>🛑 Obstacle ({dynamicObstacles.length})</span>
            </button>
          </div>

          <!-- Drive to Waypoint (Inline) -->
          {#if targetWaypoint?.active}
            <button
              type="button"
              onclick={driveToWaypoint}
              class="px-2 py-0.5 rounded-xs bg-mint text-black font-bold transition-micro hover:bg-mint/90 flex items-center gap-1 shadow-2xs shrink-0 animate-pulse"
              title="Drive bot directly to target waypoint"
            >
              <span>▶ Drive ({waypointDistance}cm)</span>
            </button>
          {/if}

          <!-- Display Layers Dropdown Menu -->
          <DropdownMenu.Root>
            <DropdownMenu.Trigger
              class="h-6 px-2 border border-border bg-surface-subtle hover:bg-surface text-[9.5px] font-mono font-bold text-ink rounded-xs transition-micro flex items-center gap-1 cursor-pointer shrink-0"
              title="Toggle Field Display Layers & Overlays"
            >
              <Layers class="size-3 text-cyan" />
              <span>Layers</span>
              <ChevronDown class="size-2.5 text-ink-muted opacity-70" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end" class="w-48 p-1 bg-surface-overlay border border-border shadow-md rounded-xs font-sans text-xs">
              <div class="px-2 py-1.5 border-b border-border mb-1">
                <p class="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Display Overlays</p>
              </div>
              <DropdownMenu.CheckboxItem
                bind:checked={showGridLines}
                class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer"
              >
                <span>Coordinate Grid</span>
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem
                bind:checked={showSonarBeam}
                class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer"
              >
                <span>LiDAR / Sonar Beam</span>
              </DropdownMenu.CheckboxItem>
              <DropdownMenu.CheckboxItem
                bind:checked={showTrails}
                class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer"
              >
                <span>Motion & Pen Trails</span>
              </DropdownMenu.CheckboxItem>
              {#if dynamicObstacles.length > 0 || targetWaypoint?.active}
                <DropdownMenu.Separator class="my-1 border-t border-border" />
              {/if}
              {#if dynamicObstacles.length > 0}
                <DropdownMenu.Item
                  onclick={() => { dynamicObstacles = []; }}
                  class="px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer text-rose-500 font-medium"
                >
                  Clear Obstacles ({dynamicObstacles.length})
                </DropdownMenu.Item>
              {/if}
              {#if targetWaypoint?.active}
                <DropdownMenu.Item
                  onclick={() => { targetWaypoint = null; }}
                  class="px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer text-ink-muted hover:text-ink"
                >
                  Clear Target Waypoint
                </DropdownMenu.Item>
              {/if}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      {:else}
        <!-- Clean Subheader in Inspection Mode -->
        <div class="flex items-center gap-2 text-[9px] font-mono text-ink-muted">
          <span class="text-ink font-bold">CAD Blueprint</span>
          <span class="text-border">·</span>
          <button
            type="button"
            onclick={onReset}
            class="text-mint hover:underline font-bold"
          >
            Reset Telemetry
          </button>
        </div>
      {/if}
    </div>
  {/if}

  <!-- 2. Main Proving Ground Viewport Area -->
  {#if arenaViewMode === 'field'}
    <!-- ARENA MAP MODE: 100% Unobstructed SVG Proving Ground with Unified Cyber-Bot -->
    <div class="flex-1 min-h-0 relative flex items-center justify-center p-2 overflow-hidden">
      <!-- Live Execution Step HUD Banner (Docked non-intrusively at bottom) -->
      {#if activeActionText}
        <div class="absolute bottom-2 left-2 right-2 bg-surface/95 backdrop-blur-xs border border-brand/40 px-3 py-1 rounded-sm shadow-md flex items-center justify-between text-brand text-[10px] font-mono font-bold select-none pointer-events-none z-10 animate-in fade-in-0 duration-150">
          <div class="flex items-center gap-1.5 truncate">
            <span class="inline-block size-1.5 rounded-none bg-brand animate-ping shrink-0"></span>
            <span class="truncate">{activeActionText}</span>
          </div>
          <span class="text-[9px] text-ink-muted shrink-0 font-normal">X:{Math.round(roverX)} Y:{Math.round(roverY)} {roverHeading}°</span>
        </div>
      {/if}

      <button
        type="button"
        class="w-full h-full max-w-full max-h-full aspect-4/3 p-0 border-0 bg-transparent cursor-crosshair focus-visible:outline-2 focus-visible:outline-brand flex items-center justify-center rounded-none"
        onclick={handleContainerClick}
        aria-label="Mars Surface Exploration Proving Ground Simulator"
      >
        <svg
          class="w-full h-full max-w-full max-h-full aspect-4/3 object-contain pointer-events-none"
          viewBox="0 0 480 360"
          preserveAspectRatio="xMidYMid meet"
        >
        <defs>
          <!-- Technical Surface Coordinate Mesh Pattern -->
          <pattern id="aresSurfaceGrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke={gridLineStroke} stroke-width="0.75" />
            <circle cx="0" cy="0" r="0.75" fill={gridDotFill} />
          </pattern>

          <!-- Rover Headlight Radial Beam Gradient -->
          <linearGradient id="headlightBeam" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="#fef08a" stop-opacity={isDarkTheme ? 0.35 : 0.45} />
            <stop offset="100%" stop-color="#fef08a" stop-opacity="0" />
          </linearGradient>

          <!-- LiDAR Scan Fan Gradient -->
          <radialGradient id="lidarConeGrad" cx="0%" cy="100%" r="100%">
            <stop offset="0%" stop-color={sensorColor} stop-opacity={isDarkTheme ? 0.35 : 0.42} />
            <stop offset="80%" stop-color={sensorColor} stop-opacity={isDarkTheme ? 0.12 : 0.18} />
            <stop offset="100%" stop-color={sensorColor} stop-opacity="0" />
          </radialGradient>
        </defs>

        <!-- Planetary Surface Floor (480x360 Scratch-compatible 4:3 arena) -->
        <rect width="480" height="360" fill={arenaFloorFill} />
        {#if showGridLines}
          <rect width="480" height="360" fill="url(#aresSurfaceGrid)" />

          <!-- Center Reference Crosshair (240, 180) -->
          <line x1="234" y1="180" x2="246" y2="180" stroke={gridDotFill} stroke-width="1" />
          <line x1="240" y1="174" x2="240" y2="186" stroke={gridDotFill} stroke-width="1" />
        {/if}

        <!-- Kinematic Navigation Trajectory Path (Precision Vector Breadcrumbs) -->
        {#if showTrails}
          {#each motionPath as segment}
            <line
              x1={segment.x1}
              y1={segment.y1}
              x2={segment.x2}
              y2={segment.y2}
              stroke={isDarkTheme ? '#38bdf8' : '#0284c7'}
              stroke-width="1.2"
              stroke-dasharray="3,3"
              stroke-linecap="round"
              opacity="0.75"
            />
            <circle cx={segment.x1} cy={segment.y1} r="1.5" fill={isDarkTheme ? '#38bdf8' : '#0284c7'} opacity="0.6" />
            <circle cx={segment.x2} cy={segment.y2} r="1.5" fill={isDarkTheme ? '#38bdf8' : '#0284c7'} opacity="0.6" />
          {/each}

          <!-- Turtle Pen Drawing Trails on Arena Floor -->
          {#each penTrails as trail}
            <line
              x1={trail.x1}
              y1={trail.y1}
              x2={trail.x2}
              y2={trail.y2}
              stroke={trail.color}
              stroke-width={trail.size}
              stroke-linecap="round"
            />
          {/each}
        {/if}

        <!-- Sleek Technical Obstacle Pylons & Proximity Safety Zones -->
        {#if showHazards}
          {#each dynamicObstacles as obs, idx}
            <g transform="translate({obs.x}, {obs.y})" class="transition-transform duration-150">
              <!-- Safety Buffer Radius Zone -->
              <circle
                cx="0"
                cy="0"
                r={obs.radius}
                fill={isDarkTheme ? 'rgba(56, 189, 248, 0.04)' : 'rgba(2, 132, 199, 0.04)'}
                stroke={isDarkTheme ? 'rgba(56, 189, 248, 0.35)' : 'rgba(2, 132, 199, 0.4)'}
                stroke-width="0.75"
                stroke-dasharray="3,3"
              />
              <!-- Solid Precision Cylinder -->
              <circle
                cx="0"
                cy="0"
                r={obs.radius * 0.55}
                fill={isDarkTheme ? '#1e293b' : '#cbd5e1'}
                stroke={isDarkTheme ? '#0284c7' : '#0284c7'}
                stroke-width="1.2"
              />
              <circle cx="0" cy="0" r="2.5" fill={isDarkTheme ? '#38bdf8' : '#0ea5e9'} />
              <text x="0" y="3.5" font-size="5" font-family="monospace" fill={isDarkTheme ? '#94a3b8' : '#475569'} text-anchor="middle" font-weight="bold">
                P{idx + 1}
              </text>
            </g>
          {/each}
        {/if}

        <!-- Interactive Waypoint Target & Navigation Vector -->
        {#if targetWaypoint?.active && showWaypoints}
          <line
            x1={roverX}
            y1={roverY}
            x2={targetWaypoint.x}
            y2={targetWaypoint.y}
            stroke="#06b6d4"
            stroke-width="1.2"
            stroke-dasharray="4,3"
            opacity="0.85"
          />
          {@const midX = (roverX + targetWaypoint.x) / 2}
          {@const midY = (roverY + targetWaypoint.y) / 2}
          <g transform="translate({midX}, {midY})">
            <rect x="-24" y="-7" width="48" height="14" rx="2" fill={isDarkTheme ? '#020617' : '#0f172a'} stroke="#06b6d4" stroke-width="0.8" />
            <text x="0" y="3" font-size="6.5" font-family="monospace" fill="#38bdf8" text-anchor="middle" font-weight="bold">
              {waypointDistance}cm · {waypointBearing}°
            </text>
          </g>

          <g transform="translate({targetWaypoint.x}, {targetWaypoint.y})">
            <circle cx="0" cy="0" r="12" fill="none" stroke="#06b6d4" stroke-width="1" stroke-dasharray="3,2" />
            <circle cx="0" cy="0" r="6" fill={isDarkTheme ? 'rgba(6, 182, 212, 0.25)' : 'rgba(6, 182, 212, 0.35)'} stroke="#06b6d4" stroke-width="0.8" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#06b6d4" stroke-width="0.8" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#06b6d4" stroke-width="0.8" />
            <circle cx="0" cy="0" r="2" fill="#ffffff" />
          </g>
        {/if}

        <!-- Dynamic LiDAR / Ultrasonic Sensor Cone -->
        {#if showSonarBeam && (roverSensorActive || effectiveSonarDistance < 80)}
          <path
            d="M {roverX} {roverY} L {coneLeftX} {coneLeftY} A {scanDistance} {scanDistance} 0 0 1 {coneRightX} {coneRightY} Z"
            fill="url(#lidarConeGrad)"
            stroke={sensorColor}
            stroke-width="0.8"
            stroke-dasharray="2,2"
          />
          <line
            x1={roverX}
            y1={roverY}
            x2={beamEndX}
            y2={beamEndY}
            stroke={sensorColor}
            stroke-width="1.5"
            stroke-dasharray="3,3"
          />
          <circle cx={beamEndX} cy={beamEndY} r="3" fill={sensorColor} />
        {/if}

        <!-- ============================================== -->
        <!-- THE NEW UNIFIED CYBER-BOT SPRITE               -->
        <!-- ============================================== -->
        <!-- Dynamic Ground Contact Shadow (Expands/fades dynamically during jumps/levitation) -->
        <g transform="translate({roverX}, {roverY}) rotate({roverHeading})">
          <ellipse
            cx="0"
            cy="1"
            rx={Math.max(6, 16 * (1 - effectiveJumpHeight * 0.3))}
            ry={Math.max(6, 16 * (1 - effectiveJumpHeight * 0.3))}
            fill={roverShadowFill}
            opacity={effectiveIsJumping ? Math.max(0.12, 0.5 - effectiveJumpHeight * 0.3) : (isDarkTheme ? 0.6 : 0.25)}
          />
        </g>

        <!-- Cyber-Bot Core Entity (Elevated with squash & stretch kinematics during jumps) -->
        <g
          transform="translate({roverX}, {roverY - (effectiveIsJumping ? Math.round(effectiveJumpHeight * 18) : 0)}) rotate({roverHeading}) scale({effectiveIsJumping ? (1 - effectiveJumpHeight * 0.12) : 1}, {effectiveIsJumping ? (1 + effectiveJumpHeight * 0.18) : 1})"
        >
          <!-- Forward Dual Projective Headlights Beam -->
          <polygon
            points="-5,-12 -18,-50 18,-50 5,-12"
            fill="url(#headlightBeam)"
          />

          <!-- Rear Ion Thruster Plasma Jets (Dual High-Velocity Propulsion) -->
          <polygon points="-8,13 -4,13 -6,24" fill="#38bdf8" opacity="0.85" />
          <polygon points="-7,13 -5,13 -6,19" fill="#ffffff" />
          <polygon points="4,13 8,13 6,24" fill="#38bdf8" opacity="0.85" />
          <polygon points="5,13 7,13 6,19" fill="#ffffff" />

          <!-- Magnetic Levitation Outrigger Pods (Left & Right Wings) -->
          <rect x="-17" y="-8" width="5.5" height="19" rx="1.5" fill={isDarkTheme ? '#1e293b' : '#334155'} stroke={isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width="0.8" />
          <rect x="-16" y="-3" width="3.5" height="9" fill={isDarkTheme ? '#0284c7' : '#0ea5e9'} opacity="0.8" />

          <rect x="11.5" y="-8" width="5.5" height="19" rx="1.5" fill={isDarkTheme ? '#1e293b' : '#334155'} stroke={isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width="0.8" />
          <rect x="12.5" y="-3" width="3.5" height="9" fill={isDarkTheme ? '#0284c7' : '#0ea5e9'} opacity="0.8" />

          <!-- Outrigger Magnetic Suspension Struts -->
          <line x1="-11.5" y1="-2" x2="-8" y2="0" stroke={isDarkTheme ? '#64748b' : '#94a3b8'} stroke-width="1.2" />
          <line x1="11.5" y1="-2" x2="8" y2="0" stroke={isDarkTheme ? '#64748b' : '#94a3b8'} stroke-width="1.2" />
          <line x1="-11.5" y1="6" x2="-8" y2="4" stroke={isDarkTheme ? '#64748b' : '#94a3b8'} stroke-width="1.2" />
          <line x1="11.5" y1="6" x2="8" y2="4" stroke={isDarkTheme ? '#64748b' : '#94a3b8'} stroke-width="1.2" />

          <!-- Aerodynamic Stealth Composite Chassis -->
          <polygon
            points="0,-16 11,-4 9,14 -9,14 -11,-4"
            fill={isDarkTheme ? '#0f172a' : '#ffffff'}
            stroke={isDarkTheme ? '#38bdf8' : '#0284c7'}
            stroke-width="1.2"
          />

          <!-- Internal Carbon Infill Deck -->
          <polygon
            points="0,-11 7,-2 6,10 -6,10 -7,-2"
            fill={isDarkTheme ? '#1e293b' : '#f1f5f9'}
          />

          <!-- Pulsing Power Core Reactor (Battery & Operational Status) -->
          <circle cx="0" cy="5" r="4.5" fill={isDarkTheme ? '#020617' : '#0f172a'} stroke="#10b981" stroke-width="0.8" />
          <circle cx="0" cy="5" r="2.5" fill="#10b981" />
          <circle cx="0" cy="5" r="1.2" fill="#ffffff" />

          <!-- Forward Heading Vector Arrow -->
          <polygon points="0,-19 -3,-14 3,-14" fill="#10b981" />

          <!-- High-Contrast Digital OLED Emotion Visor (Forward Chassis) -->
          <g transform="translate(0, -8)">
            <rect
              x="-8"
              y="-4"
              width="16"
              height="8"
              rx="1"
              fill={isDarkTheme ? '#020617' : '#090d16'}
              stroke={visorBorderColor}
              stroke-width="1"
            />
            <!-- Facial Expressions directly on the Bot Visor -->
            {#if effectiveEmotion === 'HAPPY' || effectiveEmotion === 'SMILE'}
              <path d="M -5.5 -1.5 L -3.5 -3 L -1.5 -1.5" fill="none" stroke={visorGlowColor} stroke-width="1" stroke-linecap="round" />
              <path d="M 1.5 -1.5 L 3.5 -3 L 5.5 -1.5" fill="none" stroke={visorGlowColor} stroke-width="1" stroke-linecap="round" />
              <path d="M -3 1.2 Q 0 3 3 1.2" fill="none" stroke={visorGlowColor} stroke-width="0.9" />
            {:else if effectiveEmotion === 'HEART' || effectiveEmotion === 'LOVE'}
              <path d="M -4 -3 C -5.5 -4 -7 -3 -7 -1.5 C -7 0.5 -4 2.5 -4 2.5 C -4 2.5 -1 0.5 -1 -1.5 C -1 -3 -2.5 -4 -4 -3 Z" fill="#f43f5e" />
              <path d="M 4 -3 C 2.5 -4 1 -3 1 -1.5 C 1 0.5 4 2.5 4 2.5 C 4 2.5 7 0.5 7 -1.5 C 7 -3 5.5 -4 4 -3 Z" fill="#f43f5e" />
              <path d="M -2.5 1.5 Q 0 2.5 2.5 1.5" fill="none" stroke="#f43f5e" stroke-width="0.8" />
            {:else if effectiveEmotion === 'WINK'}
              <line x1="-5.5" y1="-1.5" x2="-1.5" y2="-1.5" stroke={visorGlowColor} stroke-width="1.2" stroke-linecap="round" />
              <path d="M 1.5 -1.5 L 3.5 -3 L 5.5 -1.5" fill="none" stroke={visorGlowColor} stroke-width="1" stroke-linecap="round" />
              <path d="M -3 1.2 Q 0 3 3 1.2" fill="none" stroke={visorGlowColor} stroke-width="0.9" />
            {:else if effectiveEmotion === 'SURPRISED'}
              <circle cx="-3.5" cy="-1.5" r="1.5" fill={visorGlowColor} />
              <circle cx="3.5" cy="-1.5" r="1.5" fill={visorGlowColor} />
              <circle cx="0" cy="1.5" r="1" fill="none" stroke={visorGlowColor} stroke-width="0.75" />
            {:else if effectiveEmotion === 'PROUD' || effectiveEmotion === 'COOL'}
              <polygon points="-6,-2.5 6,-2.5 5,0.2 -5,0.2" fill="#10b981" />
              <line x1="0" y1="1.8" x2="3" y2="1.4" stroke="#10b981" stroke-width="0.8" />
            {:else if effectiveEmotion === 'PARTY'}
              <polygon points="-4,-3 -3,-1 -5,-1 -3.5,-0.2 -4,0.8" fill="#eab308" />
              <polygon points="4,-3 5,-1 3,-1 4.5,-0.2 4,0.8" fill="#eab308" />
              <path d="M -3 1.5 Q 0 3.2 3 1.5" fill="none" stroke="#eab308" stroke-width="1" />
            {:else if effectiveEmotion === 'SAD'}
              <path d="M -5.5 -3 L -3.5 -1.5 L -1.5 -3" fill="none" stroke="#60a5fa" stroke-width="1" />
              <path d="M 1.5 -3 L 3.5 -1.5 L 5.5 -3" fill="none" stroke="#60a5fa" stroke-width="1" />
              <path d="M -3 2.5 Q 0 0.8 3 2.5" fill="none" stroke="#60a5fa" stroke-width="0.9" />
            {:else if effectiveEmotion === 'ANGRY'}
              <line x1="-5.5" y1="-3.2" x2="-1.5" y2="-1.5" stroke="#ef4444" stroke-width="1.2" />
              <line x1="5.5" y1="-3.2" x2="1.5" y2="-1.5" stroke="#ef4444" stroke-width="1.2" />
              <line x1="-3" y1="2" x2="3" y2="2" stroke="#ef4444" stroke-width="1" />
            {:else}
              <!-- Default Alert Cyber Line -->
              <rect x="-6" y="-1.5" width="12" height="3" rx="0.5" fill={visorGlowColor} />
            {/if}
          </g>
        </g>

        <!-- Floating Speech Bubble (when robot speaks) -->
        {#if effectiveSpeech}
          <g transform="translate({roverX}, {roverY - 26 - (effectiveIsJumping ? Math.round(effectiveJumpHeight * 16) : 0)})">
            <rect
              x={-Math.min(95, Math.max(34, effectiveSpeech.length * 3.6 + 10))}
              y="-16"
              width={Math.min(190, Math.max(68, effectiveSpeech.length * 7.2 + 20))}
              height="16"
              fill={isDarkTheme ? '#0f172a' : '#ffffff'}
              stroke="#38bdf8"
              stroke-width="1"
            />
            <polygon
              points="-3,0 3,0 0,4"
              fill={isDarkTheme ? '#0f172a' : '#ffffff'}
              stroke="#38bdf8"
              stroke-width="1"
            />
            <line x1="-2.5" y1="0" x2="2.5" y2="0" stroke={isDarkTheme ? '#0f172a' : '#ffffff'} stroke-width="1.2" />
            <text
              x="0"
              y="-5"
              text-anchor="middle"
              font-size="7.5"
              font-family="monospace"
              font-weight="bold"
              fill={isDarkTheme ? '#38bdf8' : '#0369a1'}
            >
              "{effectiveSpeech}"
            </text>
          </g>
        {/if}

        <!-- Clean Perimeter Technical Border (480x360) -->
        <rect x="2" y="2" width="476" height="356" rx="2" fill="none" stroke={perimeterOuterStroke} stroke-width="1" stroke-dasharray="6,4" />
      </svg>
      </button>
    </div>
  {:else}
    <!-- ARES-PRIME VEHICLE DETAIL INSPECTION STAGE: High-Tech Educational Robotics Blueprint -->
    <div class="flex-1 min-h-0 relative flex flex-col justify-between p-2 overflow-hidden bg-surface-subtle dark:bg-canvas">
      <!-- 1. Header: Technical Specification & Status Bar (Clean Single-Line Typography) -->
      <div class="w-full flex items-center justify-between border-b border-border pb-1 shrink-0 select-none text-[9.5px] font-mono">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="size-1.5 rounded-none bg-cyan shadow-xs shrink-0"></span>
          <span class="font-bold text-ink truncate">ARES-Prime Mk-III Blueprint</span>
          <span class="px-1 py-0.2 bg-cyan/10 border border-cyan/30 text-cyan text-[8px] font-bold uppercase rounded-2xs shrink-0">
            v3.4
          </span>
        </div>
        <div class="flex items-center gap-1 text-[9px] shrink-0 text-mint font-bold">
          <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
          <span>NOMINAL</span>
        </div>
      </div>

      <!-- Live Execution Step Banner (when running script) -->
      {#if activeActionText}
        <div class="w-full bg-surface border border-cyan/40 px-2 py-0.5 rounded-xs flex items-center justify-between text-cyan text-[9px] font-mono font-bold select-none my-1 shrink-0">
          <div class="flex items-center gap-1.5 truncate">
            <span class="inline-block size-1.5 rounded-none bg-cyan animate-ping shrink-0"></span>
            <span class="truncate">{activeActionText}</span>
          </div>
          <span class="text-[8px] text-ink-muted shrink-0 font-normal">X:{Math.round(roverX)} Y:{Math.round(roverY)} {roverHeading}°</span>
        </div>
      {/if}

      <!-- 2. Central Technical CAD Blueprint Visualizer (SVG 480x360 Widescreen) -->
      <div class="flex-1 w-full min-h-0 flex items-center justify-center relative my-1 overflow-hidden">
        <svg
          class="w-full h-full aspect-4/3 object-contain select-none"
          viewBox="0 0 480 360"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <!-- Blueprint Pattern Grid -->
            <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" />
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke={isDarkTheme ? 'rgba(56, 189, 248, 0.08)' : 'rgba(2, 132, 199, 0.12)'} stroke-width="0.6" />
              <circle cx="20" cy="20" r="0.8" fill={isDarkTheme ? 'rgba(56, 189, 248, 0.25)' : 'rgba(2, 132, 199, 0.35)'} />
            </pattern>
            <!-- Chassis Gradient -->
            <linearGradient id="blueprintChassisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color={isDarkTheme ? '#0b1324' : '#f8fafc'} />
              <stop offset="100%" stop-color={isDarkTheme ? '#050a14' : '#e2e8f0'} />
            </linearGradient>
            <!-- Track Unit Gradient -->
            <linearGradient id="blueprintTrackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color={isDarkTheme ? '#1e293b' : '#64748b'} />
              <stop offset="50%" stop-color={isDarkTheme ? '#0f172a' : '#475569'} />
              <stop offset="100%" stop-color={isDarkTheme ? '#1e293b' : '#64748b'} />
            </linearGradient>
          </defs>

          <!-- Background Technical CAD Grid -->
          <rect x="0" y="0" width="480" height="360" fill="url(#cadGrid)" />

          <!-- CAD Frame & Dimension Labels -->
          <rect x="4" y="4" width="472" height="352" fill="none" stroke={isDarkTheme ? 'rgba(56, 189, 248, 0.20)' : 'rgba(2, 132, 199, 0.25)'} stroke-width="0.8" stroke-dasharray="4,4" />
          <text x="12" y="16" font-size="7" font-family="monospace" fill={isDarkTheme ? '#38bdf8' : '#0284c7'} opacity="0.7">SCALE: 1:1 [140mm x 115mm]</text>
          <text x="468" y="16" text-anchor="end" font-size="7" font-family="monospace" fill={isDarkTheme ? '#38bdf8' : '#0284c7'} opacity="0.7">DATUM: CHASSIS_CENTER (240, 180)</text>

          <!-- Center Reference Crosshair -->
          <line x1="240" y1="20" x2="240" y2="340" stroke={isDarkTheme ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.20)'} stroke-width="0.7" stroke-dasharray="2,4" />
          <line x1="20" y1="180" x2="460" y2="180" stroke={isDarkTheme ? 'rgba(56, 189, 248, 0.15)' : 'rgba(2, 132, 199, 0.20)'} stroke-width="0.7" stroke-dasharray="2,4" />

          <!-- ARES-Prime Chassis Master Group (Centered at 240, 180) -->
          <g transform="translate(240, 180)">
            <!-- Sonar / LiDAR Acoustic Wave Pulses (when tested or active) -->
            {#if sonarPulseActive || activeDiagnosticSubsystem === 'sonar'}
              <path d="M -20 -95 A 100 100 0 0 1 20 -95" fill="none" stroke="#06b6d4" stroke-width="1.8" opacity="0.9" />
              <path d="M -35 -110 A 130 130 0 0 1 35 -110" fill="none" stroke="#06b6d4" stroke-width="1.2" opacity="0.6" stroke-dasharray="4,2" />
              <path d="M -50 -125 A 160 160 0 0 1 50 -125" fill="none" stroke="#06b6d4" stroke-width="0.8" opacity="0.4" />
            {/if}

            <!-- LiDAR / Ultrasonic Transceiver Horn (Front Sensor Array) -->
            <g
              transform="translate(0, -68)"
              class="cursor-pointer hover:opacity-80 transition-micro"
              role="button"
              tabindex="0"
              onclick={() => triggerSubsystemDiagnostic('sonar')}
              onkeydown={(e) => { if (e.key === 'Enter') triggerSubsystemDiagnostic('sonar'); }}
            >
              <polygon points="-14,0 -20,-12 20,-12 14,0" fill={isDarkTheme ? '#1e293b' : '#cbd5e1'} stroke="#06b6d4" stroke-width="1.2" />
              <!-- Transceiver Emitters (Dual Eyes) -->
              <circle cx="-7" cy="-6" r="4" fill={isDarkTheme ? '#020617' : '#0f172a'} stroke="#06b6d4" stroke-width="0.8" />
              <circle cx="-7" cy="-6" r="2" fill="#06b6d4" />
              <circle cx="7" cy="-6" r="4" fill={isDarkTheme ? '#020617' : '#0f172a'} stroke="#06b6d4" stroke-width="0.8" />
              <circle cx="7" cy="-6" r="2" fill="#06b6d4" />
            </g>

            <!-- Left All-Terrain Track / Geared Stepper Assembly -->
            <g
              transform="translate(-62, -45)"
              class="cursor-pointer hover:opacity-80 transition-micro"
              role="button"
              tabindex="0"
              onclick={() => triggerSubsystemDiagnostic('motor')}
              onkeydown={(e) => { if (e.key === 'Enter') triggerSubsystemDiagnostic('motor'); }}
            >
              <rect x="-14" y="0" width="24" height="90" rx="3" fill="url(#blueprintTrackGrad)" stroke={motorPulseActive ? '#10b981' : isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width={motorPulseActive ? 2 : 1.2} />
              <!-- Wheel Bogies / Sprockets -->
              <circle cx="-2" cy="16" r="7" fill={isDarkTheme ? '#0f172a' : '#1e293b'} stroke="#64748b" stroke-width="1" />
              <circle cx="-2" cy="45" r="7" fill={isDarkTheme ? '#0f172a' : '#1e293b'} stroke="#64748b" stroke-width="1" />
              <circle cx="-2" cy="74" r="7" fill={isDarkTheme ? '#0f172a' : '#1e293b'} stroke="#64748b" stroke-width="1" />
              <!-- Track Tread Cleats -->
              {#each [6, 18, 30, 42, 54, 66, 78, 86] as yPos}
                <line x1="-13" y1={yPos} x2="9" y2={yPos} stroke={isDarkTheme ? '#334155' : '#94a3b8'} stroke-width="0.8" />
              {/each}
            </g>

            <!-- Right All-Terrain Track / Geared Stepper Assembly -->
            <g
              transform="translate(62, -45)"
              class="cursor-pointer hover:opacity-80 transition-micro"
              role="button"
              tabindex="0"
              onclick={() => triggerSubsystemDiagnostic('motor')}
              onkeydown={(e) => { if (e.key === 'Enter') triggerSubsystemDiagnostic('motor'); }}
            >
              <rect x="-10" y="0" width="24" height="90" rx="3" fill="url(#blueprintTrackGrad)" stroke={motorPulseActive ? '#10b981' : isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width={motorPulseActive ? 2 : 1.2} />
              <!-- Wheel Bogies / Sprockets -->
              <circle cx="2" cy="16" r="7" fill={isDarkTheme ? '#0f172a' : '#1e293b'} stroke="#64748b" stroke-width="1" />
              <circle cx="2" cy="45" r="7" fill={isDarkTheme ? '#0f172a' : '#1e293b'} stroke="#64748b" stroke-width="1" />
              <circle cx="2" cy="74" r="7" fill={isDarkTheme ? '#0f172a' : '#1e293b'} stroke="#64748b" stroke-width="1" />
              <!-- Track Tread Cleats -->
              {#each [6, 18, 30, 42, 54, 66, 78, 86] as yPos}
                <line x1="-9" y1={yPos} x2="13" y2={yPos} stroke={isDarkTheme ? '#334155' : '#94a3b8'} stroke-width="0.8" />
              {/each}
            </g>

            <!-- Left & Right Magnetic Suspension Brackets -->
            <line x1="-50" y1="-15" x2="-38" y2="-10" stroke={isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width="2" />
            <line x1="-50" y1="20" x2="-38" y2="15" stroke={isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width="2" />
            <line x1="50" y1="-15" x2="38" y2="-10" stroke={isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width="2" />
            <line x1="50" y1="20" x2="38" y2="15" stroke={isDarkTheme ? '#38bdf8' : '#0284c7'} stroke-width="2" />

            <!-- Main Composite Stealth Chassis Hull -->
            <polygon
              points="0,-68 42,-22 36,46 -36,46 -42,-22"
              fill="url(#blueprintChassisGrad)"
              stroke={isDarkTheme ? '#38bdf8' : '#0284c7'}
              stroke-width="1.8"
            />

            <!-- Internal Carbon Rib Infill -->
            <polygon
              points="0,-52 30,-16 26,38 -26,38 -30,-16"
              fill={isDarkTheme ? 'rgba(30, 41, 59, 0.7)' : 'rgba(241, 245, 249, 0.9)'}
              stroke={isDarkTheme ? 'rgba(56, 189, 248, 0.4)' : 'rgba(2, 132, 199, 0.4)'}
              stroke-width="0.8"
            />

            <!-- Forward Digital OLED Emotion Visor -->
            <g transform="translate(0, -36)">
              <rect x="-24" y="-10" width="48" height="20" rx="2" fill={isDarkTheme ? '#020617' : '#090d16'} stroke={visorBorderColor} stroke-width="1.2" />
              {#if effectiveEmotion === 'HAPPY' || effectiveEmotion === 'SMILE'}
                <path d="M -14 -3 L -8 -7 L -2 -3" fill="none" stroke={visorGlowColor} stroke-width="1.8" stroke-linecap="round" />
                <path d="M 2 -3 L 8 -7 L 14 -3" fill="none" stroke={visorGlowColor} stroke-width="1.8" stroke-linecap="round" />
                <path d="M -8 3 Q 0 8 8 3" fill="none" stroke={visorGlowColor} stroke-width="1.6" />
              {:else if effectiveEmotion === 'HEART' || effectiveEmotion === 'LOVE'}
                <path d="M -9 -4 C -12 -6 -15 -4 -15 -1 C -15 3 -9 6 -9 6 C -9 6 -3 3 -3 -1 C -3 -4 -6 -6 -9 -4 Z" fill="#f43f5e" />
                <path d="M 9 -4 C 6 -6 3 -4 3 -1 C 3 3 9 6 9 6 C 9 6 15 3 15 -1 C 15 -4 12 -6 9 -4 Z" fill="#f43f5e" />
                <path d="M -5 4 Q 0 6 5 4" fill="none" stroke="#f43f5e" stroke-width="1.2" />
              {:else if effectiveEmotion === 'PROUD' || effectiveEmotion === 'COOL'}
                <polygon points="-16,-6 16,-6 14,0 -14,0" fill="#10b981" />
                <line x1="0" y1="3" x2="6" y2="2" stroke="#10b981" stroke-width="1.2" />
              {:else}
                <line x1="-12" y1="-2" x2="12" y2="-2" stroke={visorGlowColor} stroke-width="2" stroke-linecap="round" />
              {/if}
            </g>

            <!-- Central BBC micro:bit v2 Subsystem Module (Authentic 5x5 Matrix) -->
            <g
              transform="translate(0, 0)"
              class="cursor-pointer hover:opacity-80 transition-micro"
              role="button"
              tabindex="0"
              onclick={() => triggerSubsystemDiagnostic('led')}
              onkeydown={(e) => { if (e.key === 'Enter') triggerSubsystemDiagnostic('led'); }}
            >
              <!-- micro:bit Board Frame -->
              <rect x="-24" y="-14" width="48" height="34" rx="2" fill={isDarkTheme ? '#020617' : '#0f172a'} stroke="#f59e0b" stroke-width="1.2" />
              <!-- Edge Connector Pins (Gold) -->
              <rect x="-22" y="16" width="44" height="4" fill="#fbbf24" stroke="#d97706" stroke-width="0.5" />
              {#each [-18, -14, -10, -6, -2, 2, 6, 10, 14, 18] as pinX}
                <line x1={pinX} y1="16" x2={pinX} y2="20" stroke="#78350f" stroke-width="0.8" />
              {/each}
              <!-- 5x5 LED Matrix Core -->
              <g transform="translate(-14, -10)">
                {#each activeMicrobitGrid as row, rIdx}
                  {#each row as pixel, cIdx}
                    <rect
                      x={cIdx * 6}
                      y={rIdx * 5}
                      width="4.5"
                      height="3.8"
                      rx="0.5"
                      fill={pixel === 1 ? '#ef4444' : isDarkTheme ? '#1e293b' : '#334155'}
                      stroke={pixel === 1 ? '#f87171' : 'none'}
                      stroke-width={pixel === 1 ? '0.6' : '0'}
                    />
                  {/each}
                {/each}
              </g>
              <!-- Pushbutton A & B -->
              <circle cx="-19" cy="0" r="2.5" fill="#e2e8f0" stroke="#64748b" stroke-width="0.8" />
              <text x="-19" y="8" font-size="5" font-family="monospace" font-weight="bold" fill="#f59e0b" text-anchor="middle">A</text>
              <circle cx="19" cy="0" r="2.5" fill="#e2e8f0" stroke="#64748b" stroke-width="0.8" />
              <text x="19" y="8" font-size="5" font-family="monospace" font-weight="bold" fill="#f59e0b" text-anchor="middle">B</text>
            </g>

            <!-- Rear Solenoid Pen Actuator Mechanism (Trail Marker) -->
            <g
              transform="translate(0, 42)"
              class="cursor-pointer hover:opacity-80 transition-micro"
              role="button"
              tabindex="0"
              onclick={() => triggerSubsystemDiagnostic('pen')}
              onkeydown={(e) => { if (e.key === 'Enter') triggerSubsystemDiagnostic('pen'); }}
            >
              <rect x="-8" y="0" width="16" height="14" fill={isDarkTheme ? '#1e293b' : '#cbd5e1'} stroke={penActuatorActive ? '#10b981' : '#f59e0b'} stroke-width="1.2" />
              <circle cx="0" cy="7" r="3.5" fill={penActuatorActive ? '#10b981' : penTrails.length > 0 ? '#38bdf8' : isDarkTheme ? '#020617' : '#64748b'} />
              <text x="0" y="21" font-size="6" font-family="monospace" font-weight="bold" fill={penActuatorActive ? '#10b981' : '#94a3b8'} text-anchor="middle">
                {penActuatorActive ? 'ACTUATED' : penTrails.length > 0 ? 'PEN: DOWN' : 'PEN: UP'}
              </text>
            </g>

            <!-- RF Radio Telemetry Antenna Beacon (Top Right) -->
            <g
              transform="translate(28, -50)"
              class="cursor-pointer hover:opacity-80 transition-micro"
              role="button"
              tabindex="0"
              onclick={() => triggerSubsystemDiagnostic('radio')}
              onkeydown={(e) => { if (e.key === 'Enter') triggerSubsystemDiagnostic('radio'); }}
            >
              <line x1="0" y1="0" x2="16" y2="-18" stroke={radioTxActive ? '#10b981' : '#06b6d4'} stroke-width="1.4" />
              <circle cx="16" cy="-18" r="2.5" fill={radioTxActive ? '#10b981' : '#06b6d4'} />
              {#if radioTxActive}
                <circle cx="16" cy="-18" r="7" fill="none" stroke="#10b981" stroke-width="0.8" class="animate-ping" />
              {/if}
            </g>
          </g>

          <!-- Technical CAD Callout Annotations (Arranged cleanly outside track perimeters in 480x360 space) -->
          <!-- Callout 01: LiDAR / Ultrasonic Array -->
          <g transform="translate(16, 60)">
            <text x="0" y="0" font-size="7.5" font-family="monospace" font-weight="bold" fill="#06b6d4">[01] LiDAR / ToF Rangefinder</text>
            <text x="0" y="9" font-size="6.5" font-family="monospace" fill={isDarkTheme ? '#94a3b8' : '#64748b'}>60° FoV // 5–200cm Range</text>
            <polyline points="138,-4 190,-4 224,52" fill="none" stroke="#06b6d4" stroke-width="0.8" stroke-dasharray="2,2" />
            <circle cx="224" cy="52" r="1.5" fill="#06b6d4" />
          </g>

          <!-- Callout 02: BBC micro:bit v2 Core -->
          <g transform="translate(16, 215)">
            <text x="0" y="0" font-size="7.5" font-family="monospace" font-weight="bold" fill="#f59e0b">[02] micro:bit v2 Processor</text>
            <text x="0" y="9" font-size="6.5" font-family="monospace" fill={isDarkTheme ? '#94a3b8' : '#64748b'}>64MHz ARM Cortex-M4 // 5x5 LED</text>
            <polyline points="142,-4 180,-4 200,-35" fill="none" stroke="#f59e0b" stroke-width="0.8" stroke-dasharray="2,2" />
            <circle cx="200" cy="-35" r="1.5" fill="#f59e0b" />
          </g>

          <!-- Callout 03: Dual DC Stepper Drives -->
          <g transform="translate(325, 60)">
            <text x="0" y="0" font-size="7.5" font-family="monospace" font-weight="bold" fill="#38bdf8">[03] Dual DC Stepper Drives</text>
            <text x="0" y="9" font-size="6.5" font-family="monospace" fill={isDarkTheme ? '#94a3b8' : '#64748b'}>High-Torque All-Terrain Treads</text>
            <polyline points="-6,-4 -20,-4 -33,55" fill="none" stroke="#38bdf8" stroke-width="0.8" stroke-dasharray="2,2" />
            <circle cx="-33" cy="55" r="1.5" fill="#38bdf8" />
          </g>

          <!-- Callout 04: Solenoid Precision Pen -->
          <g transform="translate(325, 260)">
            <text x="0" y="0" font-size="7.5" font-family="monospace" font-weight="bold" fill="#10b981">[04] Solenoid Trail Marker</text>
            <text x="0" y="9" font-size="6.5" font-family="monospace" fill={isDarkTheme ? '#94a3b8' : '#64748b'}>Sub-Millimeter Vector Plotting</text>
            <polyline points="-6,-4 -35,-4 -77,-38" fill="none" stroke="#10b981" stroke-width="0.8" stroke-dasharray="2,2" />
            <circle cx="-77" cy="-38" r="1.5" fill="#10b981" />
          </g>
        </svg>
      </div>

      <!-- 3. Streamlined Subsystem Diagnostic Deck (WAY 2.1 Single-Line Control Strip) -->
      <div class="w-full shrink-0 border-t border-border pt-1.5 flex flex-col gap-1 select-none">
        <div class="flex items-center justify-between text-[9px] font-mono">
          <span class="flex items-center gap-1 font-bold text-ink uppercase tracking-wider">
            <Cpu class="size-3 text-cyan" />
            <span>Diagnostics</span>
          </span>
          <span class="{activeDiagnosticSubsystem ? 'text-cyan font-bold animate-pulse' : 'text-mint font-bold'} text-[8.5px] uppercase">
            {activeDiagnosticSubsystem ? `TESTING ${activeDiagnosticSubsystem.toUpperCase()}...` : 'ALL SYSTEMS NOMINAL'}
          </span>
        </div>

        <!-- 5 Compact Interactive Action Chips -->
        <div class="grid grid-cols-5 gap-1">
          <button
            type="button"
            onclick={() => triggerSubsystemDiagnostic('sonar')}
            class="px-1 py-1 bg-surface hover:bg-surface-subtle active:scale-95 border rounded-xs text-[8.5px] font-mono font-bold transition-micro flex items-center justify-center gap-1 truncate {activeDiagnosticSubsystem === 'sonar' ? 'border-cyan text-cyan bg-cyan/10' : 'border-border text-ink'}"
            title="Ping ultrasonic sonar / LiDAR distance array"
          >
            <span>📡 LiDAR</span>
          </button>
          <button
            type="button"
            onclick={() => triggerSubsystemDiagnostic('led')}
            class="px-1 py-1 bg-surface hover:bg-surface-subtle active:scale-95 border rounded-xs text-[8.5px] font-mono font-bold transition-micro flex items-center justify-center gap-1 truncate {activeDiagnosticSubsystem === 'led' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-border text-ink'}"
            title="Cycle 5x5 micro:bit LED matrix diagnostic patterns"
          >
            <span>💡 Matrix</span>
          </button>
          <button
            type="button"
            onclick={() => triggerSubsystemDiagnostic('motor')}
            class="px-1 py-1 bg-surface hover:bg-surface-subtle active:scale-95 border rounded-xs text-[8.5px] font-mono font-bold transition-micro flex items-center justify-center gap-1 truncate {activeDiagnosticSubsystem === 'motor' ? 'border-mint text-mint bg-mint/10' : 'border-border text-ink'}"
            title="Perform brief dual-motor drive pulse"
          >
            <span>⚙️ Motors</span>
          </button>
          <button
            type="button"
            onclick={() => triggerSubsystemDiagnostic('pen')}
            class="px-1 py-1 bg-surface hover:bg-surface-subtle active:scale-95 border rounded-xs text-[8.5px] font-mono font-bold transition-micro flex items-center justify-center gap-1 truncate {activeDiagnosticSubsystem === 'pen' ? 'border-brand text-brand bg-brand/10' : 'border-border text-ink'}"
            title="Test solenoid pen actuator up/down stroke"
          >
            <span>🖋️ Pen</span>
          </button>
          <button
            type="button"
            onclick={() => triggerSubsystemDiagnostic('radio')}
            class="px-1 py-1 bg-surface hover:bg-surface-subtle active:scale-95 border rounded-xs text-[8.5px] font-mono font-bold transition-micro flex items-center justify-center gap-1 truncate {activeDiagnosticSubsystem === 'radio' ? 'border-positive text-positive bg-positive-subtle' : 'border-border text-ink'}"
            title="Broadcast test packet over 2.4GHz micro:bit radio"
          >
            <span>📻 Radio</span>
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- 3. Docked Authentic BBC micro:bit v2 Hardware Controller Deck -->
  {#if !hideMicrobitBar}
    <div class="shrink-0 border-t border-border bg-surface px-2 py-1.5 flex items-center justify-between gap-1.5 shadow-xs select-none transition-colors duration-200 overflow-hidden">
      <!-- Left: Board Identity & Active Icon Badge -->
      <div class="flex items-center gap-1.5 min-w-0 shrink-0">
        <span class="size-2 rounded-none bg-amber-500 shadow-xs shrink-0"></span>
        <span class="font-mono text-[9.5px] font-bold text-ink tracking-tight uppercase shrink-0">
          micro:bit
        </span>
        <span class="px-1 py-0.2 bg-surface-subtle border border-border text-[8.5px] font-mono text-mint font-bold uppercase truncate max-w-16 tracking-wider">
          {effectiveEmotion}
        </span>
        {#if isHardwareBridgeConnected}
          <span
            class="px-1 py-0.2 bg-mint/15 border border-mint/40 text-[8px] font-mono font-bold text-mint uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0"
            title="Web Serial Physical Hardware Bridge Connected & Streaming"
          >
            LIVE
          </span>
        {/if}
      </div>

      <!-- Center: Interactive Tactile Buttons + 5x5 LED Display Grid -->
      <div class="flex items-center justify-center gap-1.5 shrink-0">
        <!-- Tactile Button A -->
        <button
          type="button"
          onclick={() => handleButtonPress('A')}
          class="w-5 h-5 bg-surface-2 hover:bg-surface-subtle active:scale-95 border border-border rounded-none flex items-center justify-center text-[9px] font-mono font-bold text-ink shadow-xs transition-micro"
          title="Interactive micro:bit Button A"
        >
          A
        </button>

        <!-- 5x5 LED Display Grid -->
        <div class="p-0.5 bg-surface-subtle dark:bg-canvas border border-border dark:border-zinc-800 grid grid-cols-5 gap-0.5 shadow-inner shrink-0">
          {#each activeMicrobitGrid as row}
            {#each row as pixel}
              <div
                class="w-1.5 h-1.5 rounded-none transition-colors duration-150 {pixel === 1
                  ? 'bg-red-500 shadow-xs'
                  : 'bg-zinc-300 dark:bg-zinc-900 border border-zinc-400/30 dark:border-zinc-800/60'}"
              ></div>
            {/each}
          {/each}
        </div>

        <!-- Tactile Button B -->
        <button
          type="button"
          onclick={() => handleButtonPress('B')}
          class="w-5 h-5 bg-surface-2 hover:bg-surface-subtle active:scale-95 border border-border rounded-none flex items-center justify-center text-[9px] font-mono font-bold text-ink shadow-xs transition-micro"
          title="Interactive micro:bit Button B"
        >
          B
        </button>
      </div>

      <!-- Right: Gold Edge Connector Pins Bus (Large screens only) -->
      <div class="hidden xl:flex items-center gap-1 px-1.5 py-0.5 bg-surface-subtle border border-border text-[8px] font-mono shrink-0">
        <span class="text-amber-600 dark:text-amber-400 font-bold">P0</span>
        <span class="text-amber-600 dark:text-amber-400 font-bold">P1</span>
        <span class="text-amber-600 dark:text-amber-400 font-bold">P2</span>
        <span class="text-amber-600 dark:text-amber-400 font-semibold">3V</span>
        <span class="text-ink-muted">GND</span>
      </div>
    </div>
  {/if}
</div>
