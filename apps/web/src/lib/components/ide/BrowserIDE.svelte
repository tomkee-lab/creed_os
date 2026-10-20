<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import '@xterm/xterm/css/xterm.css';
  import {
    Play,
    Square,
    TerminalSquare,
    Cpu,
    CheckCircle2,
    Code2,
    Layers,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Minimize2,
    Compass,
    Zap,
    X,
    ShieldCheck,
    Download,
    Upload,
    Activity,
    ChevronDown,
    ChevronRight,
    FolderDown,
    Sparkles,
    RotateCcw,
    Rocket,
    Undo2,
    Redo2,
    Search,
    ArrowLeft,
    Bot
  } from 'lucide-svelte';
  import {
    initializeRoboticsBlocks,
    STARTER_MISSIONS,
    STARTER_ROBOTICS_WORKSPACE,
    EXTENSION_PACKS,
    buildRoboticsToolbox
  } from './roboticsBlocks';
  import { webAudioSynth } from './webAudioSynth';
  import { hardwareBridge, exportMicroPythonArtifact, type BridgeState } from './hardwareTelemetryBridge';
  import { importScratchFile } from './scratchImporter';
  import { evaluateBlocklyWorkspace, type AlgorithmicEvaluation } from './competencyEvaluator';
  import SocraticVoiceMentor from '$lib/components/mentor/SocraticVoiceMentor.svelte';
  import RoverArenaSimulator from './RoverArenaSimulator.svelte';
  import MissionGuidanceDrawer from './MissionGuidanceDrawer.svelte';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { STEM_MISSIONS, evaluateMissionRubric } from './missionCurriculum';

  interface Props {
    stage?: 'primary' | 'middle' | 'secondary';
    isFullscreen?: boolean;
  }

  // Props & Mode State
  let {
    stage = $bindable('primary'),
    isFullscreen = $bindable(false)
  }: Props = $props();
  let activeCode = $state(
    `# CREED OS Robotics Controller\nimport time\n\nprint("Robotics controller ready.")\nfor step in range(3):\n    print(f"Executing motion step {step + 1}...")\n    time.sleep(0.5)\nprint("Autonomous mission complete!")\n`
  );
  let isExecuting = $state(false);
  let isAnimating = $state(false);
  let isExpanded = $state(false);
  let copiedCode = $state(false);
  let activeMissionId = $state<
    'starter' | 'patrol' | 'polygon_patrol' | 'obstacle' | 'pen_patrol' | 'sample_retriever' | 'line_follower' | 'dance_party' | 'sync_choreography' | 'mars_expedition'
  >('starter');
  let currentMicrobitIcon = $state<string>('HAPPY');
  let robotEmotion = $state<string>('HAPPY');
  let isJumping = $state<boolean>(false);
  let jumpHeight = $state<number>(0);
  let isDancing = $state<boolean>(false);
  let danceStyle = $state<string>('TWIRL');
  let speechBubbleText = $state<string | null>(null);
  let telemetryAction = $state<string>('Ready');

  const MICROBIT_5X5_BITMAPS: Record<string, number[][]> = {
    HAPPY: [
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ],
    HEART: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ],
    ARROW_N: [
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ],
    YES: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0],
      [1, 0, 1, 0, 0],
      [0, 1, 0, 0, 0]
    ],
    NO: [
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1]
    ],
    SURPRISED: [
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0]
    ],
    SAD: [
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [1, 0, 0, 0, 1]
    ],
    ANGRY: [
      [1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1]
    ],
    ASLEEP: [
      [0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0]
    ],
    CONFUSED: [
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1]
    ],
    PARTY: [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1]
    ],
    PROUD: [
      [1, 1, 1, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0]
    ],
    CLEAR: [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  };

  let customMicrobitPixels = $state<number[][] | null>(null);

  let activeMicrobitGrid = $derived.by(() => {
    if (customMicrobitPixels) return customMicrobitPixels;
    const raw = (currentMicrobitIcon || 'HAPPY').replace('Image.', '').trim().toUpperCase();
    if (MICROBIT_5X5_BITMAPS[raw]) return MICROBIT_5X5_BITMAPS[raw];
    if (raw === 'CLEAR') return MICROBIT_5X5_BITMAPS.CLEAR;
    return MICROBIT_5X5_BITMAPS.HAPPY;
  });

  function handleSetRoverPosition(x: number, y: number) {
    roverX = x;
    roverY = y;
    roverDistance = Math.max(8, Math.round(35 + Math.sin(roverX * 0.1) * 15));
    telemetryAction = `Relocated to (${x}, ${y})`;
    addMissionLog(`Rover relocated to coordinates (${x}, ${y}).`, 'info');
  }

  function handleMicrobitButtonPress(button: 'A' | 'B') {
    addMissionLog(`micro:bit hardware Button ${button} pressed.`, 'action');
  }

  function copyPythonCode() {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(activeCode);
      copiedCode = true;
      setTimeout(() => (copiedCode = false), 1500);
    }
  }

  function writeToTerminal(text: string) {
    if (terminal) {
      terminal.write(text);
      try {
        terminalFitAddon?.fit();
        terminal.scrollToBottom();
      } catch {}
    }
  }

  function clearTerminal() {
    if (terminal) {
      terminal.clear();
      writeToTerminal('CREED OS Robotics Environment initialized.\r\n$ ');
    }
  }

  function closeStudio() {
    isFullscreen = false;
    stage = 'primary';
    setTimeout(() => {
      if (blocklyWorkspace && blocklyLib?.svgResize) {
        blocklyLib.svgResize(blocklyWorkspace);
      }
      if (editor) {
        editor.layout();
      }
    }, 80);
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    setTimeout(() => {
      if (blocklyWorkspace && blocklyLib?.svgResize) {
        blocklyLib.svgResize(blocklyWorkspace);
      }
      if (editor) {
        editor.layout();
      }
    }, 80);
  }

  // Docked Auxiliary Panel State (Tabs: 'arena' | 'guidance' | 'console' | 'hardware')
  let auxiliaryTab = $state<'arena' | 'guidance' | 'console' | 'hardware'>('arena');
  let verificationResult = $state<{ passed: boolean; message: string; score?: number } | null>(null);
  let consoleSubTab = $state<'events' | 'terminal'>('events');
  let arenaSubView = $state<'field' | 'inspection'>('field');
  let playbackSpeed = $state<'1x' | '2x' | 'instant'>('1x');
  let isDarkTheme = $state(false);
  let dockStageSize = $state<'normal' | 'expanded'>('normal');

  // Extension Studio Filter & Search State
  let extensionSearchQuery = $state('');
  let extensionCategoryFilter = $state('all');
  let filteredExtensionPacks = $derived.by(() => {
    return EXTENSION_PACKS.filter((pack) => {
      const q = extensionSearchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        pack.name.toLowerCase().includes(q) ||
        pack.description.toLowerCase().includes(q) ||
        pack.badge.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (extensionCategoryFilter === 'all') return true;
      if (extensionCategoryFilter === 'enabled') return activeExtensionIds.includes(pack.id);
      return pack.badge.toLowerCase().includes(extensionCategoryFilter.toLowerCase());
    });
  });

  let executionWatchdog: any = null;

  // Execution Control & Workspace Ergonomics
  function stopExecution() {
    isExecuting = false;
    isAnimating = false;
    webAudioSynth.stopAll();
    isDancing = false;
    isJumping = false;
    speechBubbleText = null;
    if (executionWatchdog) {
      clearTimeout(executionWatchdog);
      executionWatchdog = null;
    }
    if (pyodideWorker) {
      try {
        pyodideWorker.terminate();
        pyodideWorker = null;
        initWorker();
      } catch (err) {
        console.warn('Pyodide worker restart error:', err);
      }
    }
    addMissionLog('Mission execution halted by user.', 'info');
    if (terminal) {
      writeToTerminal('\r\n\x1b[33m[Execution Halted]\x1b[0m\r\n$ ');
    }
  }

  function undoWorkspace() {
    if (blocklyWorkspace) {
      try {
        blocklyWorkspace.undo(false);
      } catch {}
    }
  }

  function redoWorkspace() {
    if (blocklyWorkspace) {
      try {
        blocklyWorkspace.undo(true);
      } catch {}
    }
  }

  // Mission Execution Logs HUD
  interface MissionLogItem {
    id: string;
    time: string;
    text: string;
    type: 'info' | 'action' | 'sound' | 'success' | 'error';
  }
  let missionLogs = $state<MissionLogItem[]>([
    {
      id: 'init-1',
      time: '00:00',
      text: 'CREED OS Robotics IDE initialized. Ready for mission execution.',
      type: 'info'
    }
  ]);

  function addMissionLog(text: string, type: 'info' | 'action' | 'sound' | 'success' | 'error' = 'info') {
    const now = new Date();
    const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    missionLogs = [
      ...missionLogs.slice(-49),
      {
        id: String(Date.now() + Math.random()),
        time: timeStr,
        text,
        type
      }
    ];
  }

  function clearMissionLogs() {
    missionLogs = [
      {
        id: 'cleared-1',
        time: '00:00',
        text: 'Mission log buffer cleared.',
        type: 'info'
      }
    ];
  }

  // Full-Stack Workspace Persistence & Evidence Verification State
  let cloudSyncStatus = $state<'saved' | 'saving' | 'offline'>('saved');
  let lastSavedAt = $state<string | null>(null);
  let isSubmittingEvidence = $state(false);
  let evidenceSubmitted = $state(false);
  let autosaveTimer: any = null;
  let handleWindowResize: (() => void) | null = null;

  // Modular Extensions & Scratch Importer State
  let showExtensionDrawer = $state(false);
  let activeExtensionIds = $state<string[]>([
    'robot_performance',
    'acoustic_synth',
    'turtle_pen',
    'space_telemetry'
  ]);
  let scratchFileInput = $state<HTMLInputElement>();
  let scratchToast = $state<string | null>(null);

  // Turtle Pen Geometry Drawing Layer
  let penTrails = $state<{ x1: number; y1: number; x2: number; y2: number; color: string; size: number }[]>([]);

  // Navigation Trajectory Motion Path (Visual Execution Trail)
  let motionPath = $state<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

  // Continuous Hardware Telemetry Bridge State (20Hz)
  let hardwareStreamState = $state<BridgeState>({
    isConnected: false,
    portName: 'Disconnected',
    baudRate: 115200,
    fps: 0
  });

  // Real-time Algorithmic Competency State (Psychometrics)
  let currentEvaluation = $state<AlgorithmicEvaluation | null>(null);
  let showCompetencyDrawer = $state(false);

  // Simulated 2D Rover Arena State
  let roverX = $state(240);
  let roverY = $state(220);
  let roverHeading = $state(0); // 0 = North, 90 = East, 180 = South, 270 = West
  let roverDistance = $state(38); // Ultrasonic cm
  let roverSensorActive = $state(true);
  let batteryLevel = $state(94);
  let radiationLevel = $state(1.4);
  let samplesCollected = $state(0);
  let solarDeployed = $state(false);
  let lastExecutionTelemetry = $state<any>(null);

  // DOM Container References
  let blocklyContainer = $state<HTMLDivElement>();
  let monacoContainer = $state<HTMLDivElement>();
  let terminalContainer = $state<HTMLDivElement>();
  let pyodideWorker: Worker | null = null;

  // Library Instances
  let editor: any = null;
  let terminal: any = null;
  let terminalFitAddon: any = null;
  let blocklyWorkspace: any = null;
  let blocklyLib: any = null;
  let ideResizeObserver: ResizeObserver | null = null;
  let ideThemeObserver: MutationObserver | null = null;

  // Hardware State
  let isFlashing = $state(false);
  let flashProgress = $state(0);
  let targetHardware = $state<'esp32' | 'microbit' | 'arduino'>('esp32');

  // Authoritative Execution State Indicator
  let executionState = $derived.by<'idle' | 'running' | 'flashing' | 'error' | 'completed'>(() => {
    if (isFlashing) return 'flashing';
    if (isExecuting || isAnimating) return 'running';
    const lastLog = missionLogs[missionLogs.length - 1];
    if (lastLog?.type === 'error') return 'error';
    if (evidenceSubmitted || lastLog?.type === 'success') return 'completed';
    return 'idle';
  });

  // Dropdown States ("some kind of drop")
  let showMissionDropdown = $state(false);
  let showProjectDropdown = $state(false);
  let showHardwareDropdown = $state(false);
  let showTemplateDropdown = $state(false);
  let activeTemplateLabel = $state('Wall-Follower 📡');
  let showMentorModal = $state(false);
  let showMissionDialog = $state(false);
  let lastDropdownTrigger: HTMLElement | null = null;

  function dismissDropdowns(restoreFocus = true) {
    const wasOpen = showMissionDropdown || showProjectDropdown || showHardwareDropdown || showTemplateDropdown;
    showMissionDropdown = false;
    showProjectDropdown = false;
    showHardwareDropdown = false;
    showTemplateDropdown = false;
    if (wasOpen && restoreFocus && lastDropdownTrigger) {
      lastDropdownTrigger.focus();
      lastDropdownTrigger = null;
    }
  }

  // Guided Missions List & Active Metadata
  const missionsList = [
    {
      id: 'starter' as const,
      icon: '🚀',
      title: 'Starter Mission',
      label: 'Starter 🚀',
      desc: 'Drive forward at speed & stop motors'
    },
    {
      id: 'patrol' as const,
      icon: '🔄',
      title: 'Square Patrol',
      label: 'Patrol 🔄',
      desc: '4-turn perimeter navigation loop'
    },
    {
      id: 'polygon_patrol' as const,
      icon: '🔄',
      title: 'Square Patrol Loop',
      label: 'Patrol 🔄',
      desc: 'Autonomous 4-sided perimeter patrol with nested sensor survey'
    },
    {
      id: 'obstacle' as const,
      icon: '🛑',
      title: 'Obstacle Avoidance',
      label: 'Avoid 🛑',
      desc: 'Ultrasonic sonar detection & evasive turn'
    },
    {
      id: 'pen_patrol' as const,
      icon: '🎨',
      title: 'Turtle Pen',
      label: 'Pen 🎨',
      desc: 'Kinematic geometry drawing trails'
    },
    {
      id: 'sample_retriever' as const,
      icon: '🧪',
      title: 'Planetary Science',
      label: 'Science 🧪',
      desc: 'Drill sample, deploy solar & survey radiation'
    },
    {
      id: 'line_follower' as const,
      icon: '🏁',
      title: 'Surface Line Track',
      label: 'Line 🏁',
      desc: 'Reflectance sensor route navigation'
    },
    {
      id: 'dance_party' as const,
      icon: '🕺',
      title: 'Dance & Speak Party',
      label: 'Dance 🕺',
      desc: 'Express emotions, voice greetings, rhythmic dances & party jumps'
    },
    {
      id: 'sync_choreography' as const,
      icon: '👯',
      title: 'Multi-Bot Sync Choreography',
      label: 'Choreo 👯',
      desc: 'Synchronized team routine: cues, funk beats, formation steps & jumps'
    },
    {
      id: 'mars_expedition' as const,
      icon: '🪐',
      title: 'Autonomous Mars Expedition',
      label: 'Mars 🪐',
      desc: 'Deploy solar arrays, survey geological craters, core drill samples & transmit telemetry'
    }
  ];

  let activeMissionMeta = $derived(
    missionsList.find((m) => m.id === activeMissionId) || missionsList[0]
  );

  function resetMissionWorkspace() {
    selectMission(activeMissionId);
    resetRover();
    addMissionLog('Workspace reset to initial mission state.', 'info');
  }

  // Curated Secondary Templates
  const templates = [
    {
      id: 'ultrasonic',
      label: 'Wall-Follower 📡',
      title: 'Ultrasonic Wall-Follower',
      desc: 'Sonar reactive obstacle evasive navigation',
      code: `# Ultrasonic Wall-Follower Rover\nimport time\n\ndef loop():\n    distance = robot.get_distance_cm()\n    if distance < 20:\n        print("Obstacle detected! Evading right.")\n        robot.turn(direction="RIGHT", angle=90)\n    else:\n        print("Path clear. Cruising forward at 70%.")\n        robot.drive(direction="FORWARD", speed=70, duration=1.0)\n\nloop()\n`
    },
    {
      id: 'telemetry',
      label: 'Telemetry 💓',
      title: 'micro:bit Sensor Telemetry',
      desc: 'BBC micro:bit ambient sensor broadcasting',
      code: `# BBC micro:bit Sensor Broadcast\nimport time\n\ndisplay.show(Image.HEART)\nlight = robot.get_light_level()\ndistance = robot.get_distance_cm()\nprint(f"Ambient Light: {light}% | Distance: {distance}cm")\nrobot.tone(freq=659, duration_ms=200)\ndisplay.show(Image.HAPPY)\n`
    },
    {
      id: 'pid',
      label: 'Line PID 🏁',
      title: 'Dual-Line Sensor PID',
      desc: 'Differential line following steering logic',
      code: `# Line Following Navigation\nimport time\n\nleft = robot.check_line(sensor="LEFT", color="BLACK")\ncenter = robot.check_line(sensor="CENTER", color="BLACK")\nright = robot.check_line(sensor="RIGHT", color="BLACK")\n\nif center:\n    robot.drive(direction="FORWARD", speed=75, duration=1.0)\nelif left:\n    robot.turn(direction="LEFT", angle=30)\nelse:\n    robot.turn(direction="RIGHT", angle=30)\n`
    }
  ];

  function loadTemplate(templateItem: (typeof templates)[0]) {
    activeTemplateLabel = templateItem.label;
    activeCode = templateItem.code;
    if (editor) {
      editor.setValue(activeCode);
    }
    triggerAutosave();
  }

  // Load Guided Robotics Mission
  function selectMission(
    missionKey: 'starter' | 'patrol' | 'polygon_patrol' | 'obstacle' | 'pen_patrol' | 'sample_retriever' | 'line_follower' | 'dance_party' | 'sync_choreography' | 'mars_expedition' | string
  ) {
    activeMissionId = missionKey as any;
    if (missionKey === 'mars_expedition') {
      arenaSubView = 'field';
      auxiliaryTab = 'arena';
    }
    if (blocklyWorkspace && blocklyLib) {
      const mission = (STARTER_MISSIONS as any)[missionKey];
      if (mission) {
        blocklyWorkspace.clear();
        blocklyLib.serialization.workspaces.load(mission.workspace, blocklyWorkspace);
        setTimeout(() => {
          if (typeof blocklyWorkspace.zoomToFit === 'function') {
            blocklyWorkspace.zoomToFit();
          } else {
            blocklyWorkspace.scrollCenter();
          }
          ensureSafeBlocklyMargin(220);
        }, 60);
        addMissionLog(`Loaded guided mission: ${mission.name}`, 'info');
        triggerAutosave();
      }
    }
  }

  function toggleExtension(packId: string) {
    const isEnabling = !activeExtensionIds.includes(packId);
    if (isEnabling) {
      activeExtensionIds = [...activeExtensionIds, packId];
    } else {
      activeExtensionIds = activeExtensionIds.filter((id) => id !== packId);
    }
    const pack = EXTENSION_PACKS.find((p) => p.id === packId);
    scratchToast = isEnabling
      ? `Extension enabled: ${pack?.name || packId}`
      : `Extension disabled: ${pack?.name || packId}`;
    setTimeout(() => {
      scratchToast = null;
    }, 2500);

    if (blocklyWorkspace) {
      const newToolbox = buildRoboticsToolbox(activeExtensionIds);
      blocklyWorkspace.updateToolbox(newToolbox);
    }
  }

  function clearPenTrails() {
    penTrails = [];
    motionPath = [];
    telemetryAction = 'Trails Cleared';
    addMissionLog('Kinematic pen trails and trajectory cleared.', 'info');
  }

  // Full-Stack Autosave to Backend API
  function triggerAutosave() {
    if (!browser) return;
    cloudSyncStatus = 'saving';
    if (autosaveTimer) clearTimeout(autosaveTimer);

    autosaveTimer = setTimeout(async () => {
      try {
        let wsState = null;
        if (blocklyWorkspace && blocklyLib) {
          wsState = blocklyLib.serialization.workspaces.save(blocklyWorkspace);
          if (window.localStorage) {
            window.localStorage.setItem('creed_robotics_workspace', JSON.stringify(wsState));
          }
        }

        const res = await fetch('/api/v1/missions/workspace', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            missionId: activeMissionId,
            workspace: wsState,
            stage,
            code: activeCode,
            evaluation: currentEvaluation
          })
        });

        if (res.ok) {
          cloudSyncStatus = 'saved';
          const now = new Date();
          lastSavedAt = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        } else {
          cloudSyncStatus = 'offline';
        }
      } catch {
        cloudSyncStatus = 'offline';
      }
    }, 1200);
  }

  // Full-Stack Mission Verification & Evidence Submission
  async function submitMissionForVerification() {
    if (isSubmittingEvidence) return;
    isSubmittingEvidence = true;

    try {
      let wsState = null;
      if (blocklyWorkspace && blocklyLib) {
        wsState = blocklyLib.serialization.workspaces.save(blocklyWorkspace);
        currentEvaluation = evaluateBlocklyWorkspace(wsState);
      }

      const rubricEval = evaluateMissionRubric(activeMissionId, currentEvaluation, {
        x: roverX,
        y: roverY,
        batteryLevel,
        hasCollided: false,
        samplesCollected
      });

      const res = await fetch('/api/v1/missions/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionType: 'robotics',
          missionId: activeMissionId,
          missionTitle: `Robotics Mission: ${activeMissionId.toUpperCase()} (${stage.toUpperCase()} Stage)`,
          stage,
          rubricScore: rubricEval.score,
          rubricPercentage: rubricEval.percentage,
          telemetry: {
            ...(lastExecutionTelemetry || {}),
            x: roverX,
            y: roverY,
            heading: roverHeading,
            distance: roverDistance,
            lastAction: telemetryAction,
            timeline: lastExecutionTelemetry?.timeline || (motionPath.length > 0 ? motionPath.map((p, i) => ({ type: 'drive', fromX: p.x1, fromY: p.y1, toX: p.x2, toY: p.y2, action: `Step ${i + 1}` })) : []),
            motionPath: motionPath,
            samplesCollected: samplesCollected,
            battery: batteryLevel
          },
          evaluation: currentEvaluation
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.verified === true) {
        evidenceSubmitted = true;
        verificationResult = {
          passed: true,
          message: `Mission Verified! ${rubricEval.score}/${rubricEval.maxScore} pts (${rubricEval.percentage}%). Level 4 applied competency recorded.`,
          score: rubricEval.percentage
        };
        addMissionLog(`Mission Verified! Level 4 applied competency recorded: ${currentEvaluation?.developmentalBand || 'Competent'} (${rubricEval.percentage}%)`, 'success');
        scratchToast = `Verified! Mastery recorded: ${currentEvaluation?.developmentalBand || 'Mastery'} (${rubricEval.percentage}%)`;
        setTimeout(() => {
          scratchToast = null;
          evidenceSubmitted = false;
        }, 5000);
      } else {
        verificationResult = {
          passed: false,
          message: data.message || (rubricEval.feedback.length > 0 ? `Criteria remaining: ${rubricEval.feedback.slice(0, 2).join('; ')}` : (data.error || 'Execution timeline steps and code blocks required for verification.')),
          score: rubricEval.percentage
        };
        addMissionLog(`Verification notice: ${verificationResult.message}`, 'info');
      }
    } catch (e: any) {
      verificationResult = {
        passed: false,
        message: `Network verification error: ${e?.message || 'Server could not be reached to verify evidence.'}`,
        score: 0
      };
      addMissionLog(`Verification error: ${verificationResult.message}`, 'error');
    } finally {
      isSubmittingEvidence = false;
    }
  }

  // Export Project File
  function exportProjectFile() {
    try {
      let exportObj: any = {
        title: `CREED-Robotics-${activeMissionId}`,
        stage,
        code: activeCode,
        timestamp: new Date().toISOString()
      };
      if (blocklyWorkspace && blocklyLib) {
        exportObj.blocklyWorkspace = blocklyLib.serialization.workspaces.save(blocklyWorkspace);
      }
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `creed_robotics_${activeMissionId}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addMissionLog('Project exported successfully as .json', 'info');
    } catch (err: any) {
      addMissionLog(`Export error: ${err?.message || err}`, 'error');
    }
  }

  async function handleScratchFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    try {
      const result = await importScratchFile(file);
      if (result.success && result.workspace && blocklyWorkspace && blocklyLib) {
        blocklyWorkspace.clear();
        blocklyLib.serialization.workspaces.load(result.workspace, blocklyWorkspace);
        setTimeout(() => {
          if (typeof blocklyWorkspace.zoomToFit === 'function') {
            blocklyWorkspace.zoomToFit();
          } else {
            blocklyWorkspace.scrollCenter();
          }
        }, 80);
        scratchToast = `Imported "${result.projectTitle}" (${result.blockCount} blocks translated)`;
        addMissionLog(`Imported Scratch 3.0 project: "${result.projectTitle}" (${result.blockCount} blocks)`, 'info');
        triggerAutosave();
        setTimeout(() => {
          scratchToast = null;
        }, 4000);
      } else if (result.error) {
        scratchToast = `Import error: ${result.error}`;
        setTimeout(() => {
          scratchToast = null;
        }, 4000);
      }
    } catch (e: any) {
      scratchToast = `Scratch load failed: ${e?.message || e}`;
      setTimeout(() => {
        scratchToast = null;
      }, 4000);
    } finally {
      target.value = '';
    }
  }

  async function toggleHardwareStream() {
    if (hardwareStreamState.isConnected) {
      await hardwareBridge.disconnect();
      addMissionLog('Disconnected physical hardware bridge.', 'info');
    } else {
      await hardwareBridge.connect();
      addMissionLog('Connecting Web Serial / WebUSB telemetry bridge...', 'info');
    }
  }

  // Zoom & Workspace Utilities
  function zoomIn() {
    if (blocklyWorkspace) {
      blocklyWorkspace.zoomCenter(1);
    }
  }

  function zoomOut() {
    if (blocklyWorkspace) {
      blocklyWorkspace.zoomCenter(-1);
    }
  }

  function ensureSafeBlocklyMargin(minGutter = 220) {
    if (!blocklyWorkspace) return;
    try {
      const topBlocks = blocklyWorkspace.getTopBlocks(true);
      if (topBlocks.length > 0) {
        let minX = Infinity;
        for (const block of topBlocks) {
          const xy = block.getRelativeToSurfaceXY();
          if (xy.x < minX) minX = xy.x;
        }
        if (minX < minGutter) {
          const shiftX = minGutter - minX;
          for (const block of topBlocks) {
            block.moveBy(shiftX, 0);
          }
        }
      }
    } catch (e) {
      console.warn('Blockly margin adjustment deferred:', e);
    }
  }

  function switchStage(newStage: 'primary' | 'middle' | 'secondary') {
    stage = newStage;
    if (blocklyWorkspace) {
      try {
        blocklyWorkspace.getFlyout()?.hide();
        (blocklyWorkspace.getToolbox() as any)?.clearSelection?.();
      } catch {}
    }
    setTimeout(() => {
      if (blocklyWorkspace && blocklyLib?.svgResize) {
        blocklyLib.svgResize(blocklyWorkspace);
      }
      if (editor) {
        editor.layout();
      }
    }, 60);
  }

  function zoomToFit() {
    if (blocklyWorkspace) {
      if (typeof blocklyWorkspace.zoomToFit === 'function') {
        blocklyWorkspace.zoomToFit();
      } else {
        blocklyWorkspace.scrollCenter();
      }
      setTimeout(() => {
        ensureSafeBlocklyMargin(220);
      }, 50);
    }
  }

  function resetZoom() {
    if (blocklyWorkspace) {
      blocklyWorkspace.setScale(0.85);
      blocklyWorkspace.scrollCenter();
      setTimeout(() => {
        ensureSafeBlocklyMargin(220);
      }, 50);
    }
  }

  function cleanUpBlocks() {
    if (blocklyWorkspace) {
      blocklyWorkspace.cleanUp();
      ensureSafeBlocklyMargin(220);
      addMissionLog('Block layout rearranged cleanly.', 'info');
    }
  }

  function resetRover() {
    roverX = 240;
    roverY = 220;
    roverHeading = 0;
    roverDistance = 38;
    roverSensorActive = true;
    batteryLevel = 94;
    radiationLevel = 1.4;
    samplesCollected = 0;
    solarDeployed = false;
    currentMicrobitIcon = 'HAPPY';
    robotEmotion = 'HAPPY';
    isJumping = false;
    jumpHeight = 0;
    isDancing = false;
    danceStyle = 'TWIRL';
    speechBubbleText = null;
    customMicrobitPixels = null;
    telemetryAction = 'Reset to Origin';
    penTrails = [];
    motionPath = [];
    addMissionLog('Simulated rover reset to origin (240, 220, 0°).', 'info');
  }

  // Step-by-Step Kinematic Playback Engine
  async function playKinematicTimeline(timeline: any[], finalTelemetry: any) {
    isAnimating = true;
    const speedMultiplier = playbackSpeed === '2x' ? 0.5 : playbackSpeed === 'instant' ? 0.05 : 1.0;

    addMissionLog(`Playing ${timeline.length} kinematic motion steps (${playbackSpeed})...`, 'info');

    for (let i = 0; i < timeline.length; i++) {
      if (!isExecuting && !isAnimating) break;
      const step = timeline[i];

      telemetryAction = step.action || `Step ${i + 1}/${timeline.length}`;
      addMissionLog(`[Step ${i + 1}] ${step.action}`, 'action');

      if (step.type === 'drive') {
        webAudioSynth.playEffect('MOTOR_STEP');
        const stepDuration = Math.max(250, (step.duration || 1) * 600 * speedMultiplier);
        const frames = playbackSpeed === 'instant' ? 1 : 12;
        const dx = (step.toX - step.fromX) / frames;
        const dy = (step.toY - step.fromY) / frames;

        motionPath = [
          ...motionPath,
          {
            x1: Math.round(step.fromX),
            y1: Math.round(step.fromY),
            x2: Math.round(step.toX),
            y2: Math.round(step.toY)
          }
        ];

        for (let f = 1; f <= frames; f++) {
          roverX = Math.round(step.fromX + dx * f);
          roverY = Math.round(step.fromY + dy * f);
          if (playbackSpeed !== 'instant') {
            await new Promise((r) => setTimeout(r, stepDuration / frames));
          }
        }
        roverDistance = Math.round(step.distance);
        if (step.trail) {
          penTrails = [...penTrails, step.trail];
        }
      } else if (step.type === 'turn') {
        webAudioSynth.playEffect('MOTOR_STEP');
        const stepDuration = 300 * speedMultiplier;
        roverHeading = Math.round(step.toHeading);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, stepDuration));
        }
      } else if (step.type === 'stop') {
        roverSensorActive = false;
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 150 * speedMultiplier));
        }
      } else if (step.type === 'wait') {
        webAudioSynth.playEffect('BLIP');
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, Math.max(120, (step.duration || 0.5) * 600 * speedMultiplier)));
        }
      } else if (step.type === 'tone') {
        webAudioSynth.playTone(step.freq, step.duration_ms);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, Math.min(350, step.duration_ms) * speedMultiplier));
        }
      } else if (step.type === 'note') {
        webAudioSynth.playNote(step.note, step.beats);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 220 * step.beats * speedMultiplier));
        }
      } else if (step.type === 'icon') {
        currentMicrobitIcon = step.icon;
        customMicrobitPixels = null;
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 250 * speedMultiplier));
        }
      } else if (step.type === 'pixel') {
        const x = Number(step.x);
        const y = Number(step.y);
        const b = Number(step.brightness);
        if (x >= 0 && x < 5 && y >= 0 && y < 5) {
          const baseGrid = customMicrobitPixels
            ? customMicrobitPixels.map((r) => [...r])
            : activeMicrobitGrid.map((r) => [...r]);
          baseGrid[y][x] = b > 0 ? 1 : 0;
          customMicrobitPixels = baseGrid;
        }
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 120 * speedMultiplier));
        }
      } else if (step.type === 'pen_clear') {
        penTrails = [];
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 150 * speedMultiplier));
        }
      } else if (step.type === 'sample') {
        samplesCollected += 1;
        webAudioSynth.playEffect('SUCCESS');
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 350 * speedMultiplier));
        }
      } else if (step.type === 'solar') {
        solarDeployed = true;
        batteryLevel = Math.min(100, batteryLevel + 25);
        webAudioSynth.playEffect('CHIRP');
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 350 * speedMultiplier));
        }
      } else if (step.type === 'volume') {
        webAudioSynth.setVolume(step.volume);
      } else if (step.type === 'tempo') {
        webAudioSynth.setTempo(step.bpm);
      } else if (step.type === 'stop_sound') {
        webAudioSynth.stopAll();
      } else if (step.type === 'telemetry') {
        addMissionLog(`[TELEMETRY] ${step.key} = ${step.value}`, 'info');
      } else if (step.type === 'telemetry_send') {
        webAudioSynth.playEffect('BLIP');
        addMissionLog('Telemetry packet transmitted to mission control.', 'info');
      } else if (step.type === 'effect') {
        webAudioSynth.playEffect(step.effect);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 220 * speedMultiplier));
        }
      } else if (step.type === 'emotion') {
        robotEmotion = step.emotion;
        currentMicrobitIcon = step.emotion;
        customMicrobitPixels = null;
        if (hardwareStreamState.isConnected) {
          hardwareBridge.sendEmotion(step.emotion);
        }
        webAudioSynth.playEffect(
          step.emotion === 'SAD'
            ? 'COLLISION'
            : step.emotion === 'SURPRISED'
              ? 'RADAR'
              : step.emotion === 'PARTY'
                ? 'SUCCESS'
                : 'CHIRP'
        );
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 300 * speedMultiplier));
        }
      } else if (step.type === 'jump') {
        isJumping = true;
        webAudioSynth.playJumpBoing();
        if (hardwareStreamState.isConnected) {
          hardwareBridge.sendMotion('jump', { height: step.height });
        }
        const jumpDur = Math.max(350, (step.duration || 0.6) * 1000 * speedMultiplier);
        const frames = playbackSpeed === 'instant' ? 1 : 16;
        for (let f = 1; f <= frames; f++) {
          const t = f / frames;
          jumpHeight = Math.sin(t * Math.PI) * (step.height || 1);
          if (playbackSpeed !== 'instant') {
            await new Promise((r) => setTimeout(r, jumpDur / frames));
          }
        }
        isJumping = false;
        jumpHeight = 0;
      } else if (step.type === 'dance') {
        isDancing = true;
        danceStyle = step.style || 'TWIRL';
        if (hardwareStreamState.isConnected) {
          hardwareBridge.sendMotion('dance', { style: step.style });
        }
        const danceDur = Math.max(450, (step.duration || 1.2) * 1000 * speedMultiplier);
        const beats = Math.max(2, Math.round((step.duration || 1.2) * 2));
        webAudioSynth.playDanceRhythm(danceStyle, beats);
        const frames = playbackSpeed === 'instant' ? 1 : 24;
        const baseHeading = roverHeading;
        for (let f = 1; f <= frames; f++) {
          const t = f / frames;
          if (danceStyle === 'TWIRL') {
            roverHeading = (baseHeading + Math.round(t * 360)) % 360;
          } else if (danceStyle === 'WOBBLE') {
            roverHeading = (baseHeading + Math.round(Math.sin(t * Math.PI * 4) * 25) + 360) % 360;
          } else if (danceStyle === 'SHUFFLE') {
            roverHeading = (baseHeading + (Math.floor(t * 8) % 2 === 0 ? 15 : -15) + 360) % 360;
          } else if (danceStyle === 'ZIGZAG') {
            roverHeading = (baseHeading + Math.round(Math.sin(t * Math.PI * 6) * 30) + 360) % 360;
          } else if (danceStyle === 'BOUNCE') {
            jumpHeight = Math.abs(Math.sin(t * Math.PI * 4)) * 0.6;
          }
          if (playbackSpeed !== 'instant') {
            await new Promise((r) => setTimeout(r, danceDur / frames));
          }
        }
        roverHeading = baseHeading;
        isDancing = false;
        jumpHeight = 0;
      } else if (step.type === 'beat') {
        webAudioSynth.playDanceRhythm(step.style || 'TECHNO', step.beats || 4);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, (step.beats || 4) * 240 * speedMultiplier));
        }
      } else if (step.type === 'cue') {
        addMissionLog(`[SYNC CUE] ${step.cue} broadcast to group ⏱️`, 'action');
        webAudioSynth.playTone(880, 120);
        if (hardwareStreamState.isConnected) {
          hardwareBridge.sendChoreographyCue(step.cue);
        }
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 260 * speedMultiplier));
        }
      } else if (step.type === 'formation') {
        addMissionLog(`[FORMATION] ${step.move} x${step.steps} synchronized 👯`, 'action');
        if (hardwareStreamState.isConnected) {
          hardwareBridge.sendMotion('drive', { move: step.move, steps: step.steps });
        }
        const delta = (step.move === 'BACKWARD' ? -1 : 1) * (step.steps || 2) * 12;
        const rad = ((roverHeading - 90) * Math.PI) / 180;
        const newX = Math.max(20, Math.min(460, roverX + Math.cos(rad) * delta));
        const newY = Math.max(20, Math.min(340, roverY + Math.sin(rad) * delta));
        motionPath = [
          ...motionPath,
          { x1: Math.round(roverX), y1: Math.round(roverY), x2: Math.round(newX), y2: Math.round(newY) }
        ];
        roverX = Math.round(newX);
        roverY = Math.round(newY);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, 280 * speedMultiplier));
        }
      } else if (step.type === 'speech') {
        speechBubbleText = step.text;
        webAudioSynth.speakVoice(step.text, step.voice || 'ROBOT');
        if (hardwareStreamState.isConnected) {
          hardwareBridge.sendSpeech(step.text, step.voice || 'ROBOT');
        }
        const speechDuration = Math.max(1200, (step.text.length * 85) * speedMultiplier);
        if (playbackSpeed !== 'instant') {
          await new Promise((r) => setTimeout(r, speechDuration));
        }
        speechBubbleText = null;
      }
    }

    roverX = finalTelemetry.x;
    roverY = finalTelemetry.y;
    roverHeading = Math.round(finalTelemetry.heading);
    roverDistance = Math.round(finalTelemetry.distance);
    if (finalTelemetry.emotion) robotEmotion = finalTelemetry.emotion;
    if (typeof finalTelemetry.battery === 'number') batteryLevel = Math.round(finalTelemetry.battery);
    if (typeof finalTelemetry.radiation === 'number') radiationLevel = Number(finalTelemetry.radiation.toFixed(1));
    if (typeof finalTelemetry.solarDeployed === 'boolean') solarDeployed = finalTelemetry.solarDeployed;
    if (Array.isArray(finalTelemetry.samplesCollected)) samplesCollected = finalTelemetry.samplesCollected.length;
    if (finalTelemetry.penTrails && finalTelemetry.penTrails.length > 0) {
      penTrails = finalTelemetry.penTrails;
    }
    isAnimating = false;
    isExecuting = false;
    webAudioSynth.playEffect('SUCCESS');
    addMissionLog('Kinematic mission sequence completed successfully! ✅', 'success');
  }

  // Fallback single-step simulation
  function stepRoverSimulation(action: string) {
    const act = action.toLowerCase();
    if (act.includes('drive') || act.includes('forward')) {
      webAudioSynth.playEffect('MOTOR_STEP');
      const oldX = roverX;
      const oldY = roverY;
      const rad = ((roverHeading - 90) * Math.PI) / 180;
      roverX = Math.max(20, Math.min(460, roverX + Math.cos(rad) * 28));
      roverY = Math.max(20, Math.min(340, roverY + Math.sin(rad) * 28));
      motionPath = [
        ...motionPath,
        { x1: Math.round(oldX), y1: Math.round(oldY), x2: Math.round(roverX), y2: Math.round(roverY) }
      ];
      roverDistance = Math.max(8, Math.round(35 + Math.sin(roverX * 0.1) * 15));
      telemetryAction = 'Drive Forward';
      addMissionLog('Drove forward in local simulation.', 'action');
    } else if (act.includes('backward')) {
      webAudioSynth.playEffect('MOTOR_STEP');
      const oldX = roverX;
      const oldY = roverY;
      const rad = ((roverHeading - 90) * Math.PI) / 180;
      roverX = Math.max(20, Math.min(460, roverX - Math.cos(rad) * 20));
      roverY = Math.max(20, Math.min(340, roverY - Math.sin(rad) * 20));
      motionPath = [
        ...motionPath,
        { x1: Math.round(oldX), y1: Math.round(oldY), x2: Math.round(roverX), y2: Math.round(roverY) }
      ];
      telemetryAction = 'Drive Backward';
      addMissionLog('Drove backward in local simulation.', 'action');
    } else if (act.includes('turn') && act.includes('left')) {
      webAudioSynth.playEffect('MOTOR_STEP');
      roverHeading = (roverHeading - 90 + 360) % 360;
      telemetryAction = 'Turn Left 90°';
      addMissionLog('Rotated left 90°.', 'action');
    } else if (act.includes('turn')) {
      webAudioSynth.playEffect('MOTOR_STEP');
      roverHeading = (roverHeading + 90) % 360;
      telemetryAction = 'Turn Right 90°';
      addMissionLog('Rotated right 90°.', 'action');
    } else if (act.includes('stop')) {
      roverSensorActive = false;
      webAudioSynth.playEffect('BLIP');
      telemetryAction = 'Motors Stopped';
      addMissionLog('Motors halted.', 'action');
    } else if (act.includes('align') || act.includes('planetary') || act.includes('azimuth') || act.includes('orbital')) {
      const vec = hardwareBridge.getPlanetaryVector();
      roverHeading = vec.azimuthDeg;
      telemetryAction = `Aligned to ${vec.sourceName} (${vec.azimuthDeg}°)`;
      addMissionLog(`Rover heading aligned with ${vec.sourceName} at ${vec.azimuthDeg}° azimuth.`, 'action');
    }

    if (act.includes('happy')) { currentMicrobitIcon = 'HAPPY'; robotEmotion = 'HAPPY'; }
    if (act.includes('heart')) { currentMicrobitIcon = 'HEART'; robotEmotion = 'HEART'; }
    if (act.includes('arrow')) currentMicrobitIcon = 'ARROW_N';
    if (act.includes('yes')) currentMicrobitIcon = 'YES';
    if (act.includes('no')) currentMicrobitIcon = 'NO';
    if (act.includes('jump')) { isJumping = true; webAudioSynth.playJumpBoing(); setTimeout(() => (isJumping = false), 700); }
    if (act.includes('dance')) { isDancing = true; webAudioSynth.playDanceRhythm('TWIRL', 4); setTimeout(() => (isDancing = false), 1500); }
    if (act.includes('speak')) { speechBubbleText = 'Hello!'; webAudioSynth.speakVoice('Hello!', 'ROBOT'); setTimeout(() => (speechBubbleText = null), 2000); }
  }

  // Initialize Pyodide Web Worker
  function initWorker() {
    if (!browser || pyodideWorker) return;
    try {
      pyodideWorker = new Worker('/workers/pyodide.worker.js');
      pyodideWorker.onmessage = async (event) => {
        if (executionWatchdog) {
          clearTimeout(executionWatchdog);
          executionWatchdog = null;
        }
        const { success, result, stdOut, error, telemetry } = event.data;

        if (terminal) {
          if (success) {
            if (stdOut) {
              writeToTerminal(stdOut.replace(/\n/g, '\r\n'));
            }
            if (result !== undefined && result !== null) writeToTerminal(`\r\nResult: ${result}\r\n`);
          } else {
            writeToTerminal(`\r\n\x1b[31mError:\x1b[0m ${error}\r\n`);
          }
          writeToTerminal('\r\n$ ');
        }

        if (success && telemetry) {
          lastExecutionTelemetry = telemetry;
          if (telemetry.timeline && telemetry.timeline.length > 0) {
            await playKinematicTimeline(telemetry.timeline, telemetry);
          } else {
            isExecuting = false;
            webAudioSynth.playEffect('SUCCESS');
            stepRoverSimulation(stdOut || activeCode);
          }
        } else {
          isExecuting = false;
          webAudioSynth.playEffect('ALARM');
          if (error) {
            addMissionLog(`Runtime error: ${error}`, 'error');
          }
        }
      };
      pyodideWorker.onerror = (err) => {
        console.error('Pyodide Worker Error:', err);
        isExecuting = false;
        webAudioSynth.playEffect('ALARM');
        addMissionLog(`Worker error: ${err.message || 'Script error in Pyodide'}`, 'error');
        if (terminal) {
          writeToTerminal(`\r\n\x1b[31mWorker error:\x1b[0m ${err.message || 'Worker failure'}\r\n$ `);
        }
      };
    } catch (e) {
      console.warn('Pyodide worker initialization deferred:', e);
    }
  }

  // Initialize Blockly Workspace with Non-Conflicting, Unobstructed Settings
  async function initBlockly() {
    if (!browser || !blocklyContainer || blocklyWorkspace) return;

    try {
      blocklyLib = await import('blockly');
      await initializeRoboticsBlocks();

      // Calm, high-density Creed typography theme
      const baseTheme = (blocklyLib.Themes as any)?.Dark || (blocklyLib.Themes as any)?.Classic;
      let creedTheme = baseTheme;
      try {
        creedTheme = blocklyLib.Theme.defineTheme('creed_theme', {
          base: baseTheme,
          fontStyle: {
            family: 'var(--font-sans), system-ui, -apple-system, sans-serif',
            weight: '600',
            size: 11
          },
          startHats: true
        });
      } catch {
        creedTheme = baseTheme;
      }

      blocklyWorkspace = blocklyLib.inject(blocklyContainer, {
        toolbox: buildRoboticsToolbox(activeExtensionIds),
        renderer: 'zelos',
        trashcan: false,
        scrollbars: true,
        move: {
          scrollbars: true,
          drag: true,
          wheel: true
        },
        zoom: {
          controls: false,
          wheel: false,
          startScale: 0.85,
          maxScale: 2.0,
          minScale: 0.3,
          scaleSpeed: 1.1
        },
        grid: {
          spacing: 24,
          length: 3,
          colour: '#334155',
          snap: true
        },
        theme: creedTheme
      });

      // Calibrate Flyout Workspace Scale (0.72 scale compacts oversized palette blocks) & UX toggling
      try {
        const flyout = blocklyWorkspace.getFlyout();
        if (flyout) {
          flyout.autoClose = true;
          const origShow = flyout.show.bind(flyout);
          flyout.show = function (flyoutDef: any) {
            origShow(flyoutDef);
            try {
              const flyoutWs = this.getWorkspace();
              if (flyoutWs) {
                flyoutWs.setScale(0.72);
              }
            } catch {}
          };
          const initialFlyoutWs = flyout.getWorkspace();
          if (initialFlyoutWs) {
            initialFlyoutWs.setScale(0.72);
          }
        }

        // Category click toggling: clicking already active category closes flyout
        const toolbox = blocklyWorkspace.getToolbox();
        if (toolbox) {
          const origSetSelectedItem = (toolbox as any).setSelectedItem?.bind(toolbox);
          if (origSetSelectedItem) {
            (toolbox as any).setSelectedItem = function (item: any) {
              if (this.selectedItem_ === item && item !== null) {
                this.clearSelection();
              } else {
                origSetSelectedItem(item);
              }
            };
          }
        }
      } catch {}

      // Load saved state or default starter mission
      try {
        const saved = window.localStorage?.getItem('creed_robotics_workspace');
        if (saved) {
          blocklyLib.serialization.workspaces.load(JSON.parse(saved), blocklyWorkspace);
        } else {
          blocklyLib.serialization.workspaces.load(STARTER_ROBOTICS_WORKSPACE, blocklyWorkspace);
        }
      } catch {
        try {
          blocklyLib.serialization.workspaces.load(STARTER_ROBOTICS_WORKSPACE, blocklyWorkspace);
        } catch {}
      }

      setTimeout(() => {
        ensureSafeBlocklyMargin(220);
      }, 60);

      // Initial competency evaluation
      try {
        const initialWsState = blocklyLib.serialization.workspaces.save(blocklyWorkspace);
        currentEvaluation = evaluateBlocklyWorkspace(initialWsState);
      } catch {}

      // Real-time Python Code Generator Sync & Workspace Autosave
      const { pythonGenerator } = await import('blockly/python');

      // Auto-disable disconnected orphan blocks (Google Best Practice)
      if (blocklyLib.Events?.disableOrphans) {
        blocklyWorkspace.addChangeListener(blocklyLib.Events.disableOrphans);
      }

      let codeGenDebounce: any = null;
      blocklyWorkspace.addChangeListener((e: any) => {
        if (!blocklyWorkspace) return;
        if (e.isUiEvent || e.type === blocklyLib.Events?.FINISHED_LOADING) return;

        clearTimeout(codeGenDebounce);
        codeGenDebounce = setTimeout(() => {
          try {
            const state = blocklyLib.serialization.workspaces.save(blocklyWorkspace);
            currentEvaluation = evaluateBlocklyWorkspace(state);
            triggerAutosave();
          } catch {}

          try {
            const code = pythonGenerator.workspaceToCode(blocklyWorkspace);
            if (code && code.trim().length > 0) {
              activeCode = `# Auto-generated from Visual Blocks\nimport time\n\n${code}`;
              if (editor && stage === 'middle') {
                editor.setValue(activeCode);
              }
            }
          } catch (err) {
            console.warn('Blockly code generator warning:', err);
          }
        }, 120);
      });

      setTimeout(() => {
        if (blocklyLib && blocklyLib.svgResize) {
          blocklyLib.svgResize(blocklyWorkspace);
        }
      }, 60);
    } catch (err) {
      console.error('Failed to initialize Blockly:', err);
    }
  }

  // Initialize Monaco Editor and Xterm
  async function initMonacoAndXterm() {
    if (!browser) return;

    try {
      const { setupMonacoEnvironment } = await import('./monacoEnvironment');
      setupMonacoEnvironment();

      const [monaco, { Terminal }, { FitAddon }] = await Promise.all([
        import('monaco-editor'),
        import('@xterm/xterm'),
        import('@xterm/addon-fit')
      ]);

      if (monacoContainer && !editor) {
        editor = monaco.editor.create(monacoContainer, {
          value: activeCode,
          language: 'python',
          theme: 'vs-dark',
          minimap: { enabled: false },
          automaticLayout: true,
          readOnly: stage === 'middle',
          wordWrap: 'on',
          wordWrapColumn: 80,
          wrappingIndent: 'indent',
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: false,
          fontFamily: "'JetBrains Mono Variable', monospace",
          fontSize: 12
        });

        editor.onDidChangeModelContent(() => {
          if (stage === 'secondary') {
            activeCode = editor.getValue();
            triggerAutosave();
          }
        });
      }

      if (terminalContainer && !terminal) {
        terminal = new Terminal({
          theme: {
            background: '#0a0a0a',
            foreground: '#e5e5e5',
            cursor: '#4ade80'
          },
          fontFamily: "'JetBrains Mono Variable', monospace",
          fontSize: 12,
          lineHeight: 1.25,
          cursorBlink: true,
          convertEol: true,
          scrollback: 1000
        });
        terminalFitAddon = new FitAddon();
        terminal.loadAddon(terminalFitAddon);
        terminal.open(terminalContainer);
        try {
          terminalFitAddon.fit();
        } catch {}
        writeToTerminal('CREED OS Robotics Environment initialized.\r\n$ ');
      }

      initWorker();
    } catch (err) {
      console.error('Monaco / Xterm initialization error:', err);
    }
  }

  onMount(async () => {
    if (!browser) return;
    await initBlockly();
    await initMonacoAndXterm();
    initWorker();

    try {
      const res = await fetch(`/api/v1/missions/workspace?missionId=${activeMissionId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.workspace && blocklyWorkspace && blocklyLib) {
          blocklyWorkspace.clear();
          blocklyLib.serialization.workspaces.load(data.workspace, blocklyWorkspace);
          currentEvaluation = evaluateBlocklyWorkspace(data.workspace);
          addMissionLog('Loaded synchronized workspace from cloud ledger.', 'info');
        }
      }
    } catch {}

    if (typeof window !== 'undefined') {
      (window as any).hardwareBridge = hardwareBridge;
    }

    hardwareBridge.onStateChange((state) => {
      hardwareStreamState = state;
    });
    hardwareBridge.onTelemetry((t) => {
      roverDistance = Math.round(t.distanceCm);
      roverHeading = Math.round(t.headingDeg);
      if (t.planetaryVector) {
        telemetryAction = `Tracking ${t.planetaryVector.sourceName} (${t.planetaryVector.azimuthDeg}°)`;
      } else {
        telemetryAction = `HW 20Hz: ${roverDistance}cm | ${roverHeading}°`;
      }
    });
    hardwareBridge.onPlanetaryTelemetry((vec) => {
      if (hardwareStreamState.planetaryTrackingActive) {
        roverHeading = vec.azimuthDeg;
      }
    });

    handleWindowResize = () => {
      if (blocklyWorkspace && blocklyLib && blocklyLib.svgResize) {
        blocklyLib.svgResize(blocklyWorkspace);
      }
      if (editor) {
        editor.layout();
      }
    };
    window.addEventListener('resize', handleWindowResize);


    // Continuous responsive layout observer for smooth container transitions
    if (typeof ResizeObserver !== 'undefined') {
      ideResizeObserver = new ResizeObserver(() => {
        if (blocklyWorkspace && blocklyLib && blocklyLib.svgResize) {
          blocklyLib.svgResize(blocklyWorkspace);
        }
        if (editor) {
          editor.layout();
        }
        if (terminalFitAddon && stage === 'secondary') {
          try {
            terminalFitAddon.fit();
            terminal?.scrollToBottom();
          } catch {}
        }
      });
      if (blocklyContainer) ideResizeObserver.observe(blocklyContainer);
      if (monacoContainer) ideResizeObserver.observe(monacoContainer);
      if (terminalContainer) ideResizeObserver.observe(terminalContainer);
    }

    // Dynamic Theme Observer for Monaco & Workspace Synchronization
    const updateTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
      isDarkTheme = isDark;
      if (editor) {
        import('monaco-editor').then((monaco) => {
          monaco.editor.setTheme(isDark ? 'vs-dark' : 'vs');
        });
      }
    };
    updateTheme();
    ideThemeObserver = new MutationObserver(updateTheme);
    ideThemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme']
    });
  });

  // Responsive Layout Synchronization when Stage or Fullscreen Changes
  $effect(() => {
    const currentStage = stage;
    const fullscreenActive = isFullscreen;
    if (!browser) return;

    if (fullscreenActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    setTimeout(() => {
      if (blocklyWorkspace && (currentStage === 'primary' || currentStage === 'middle')) {
        if (blocklyLib && blocklyLib.svgResize) {
          blocklyLib.svgResize(blocklyWorkspace);
        }
      }
      if (editor && (currentStage === 'middle' || currentStage === 'secondary')) {
        editor.layout();
        if (currentStage === 'middle') {
          editor.updateOptions({ readOnly: true, wordWrap: 'on', wrappingIndent: 'indent' });
          if (activeCode) editor.setValue(activeCode);
        } else {
          editor.updateOptions({ readOnly: false, wordWrap: 'on', wrappingIndent: 'indent' });
        }
      }
      if (terminalFitAddon && currentStage === 'secondary') {
        try {
          terminalFitAddon.fit();
          terminal?.scrollToBottom();
        } catch {}
      }
    }, 80);

    return () => {
      if (browser) document.body.style.overflow = '';
    };
  });

  onDestroy(() => {
    if (browser) {
      document.body.style.overflow = '';
    }
    if (handleWindowResize && typeof window !== 'undefined') {
      window.removeEventListener('resize', handleWindowResize);
    }
    if (ideResizeObserver) {
      ideResizeObserver.disconnect();
      ideResizeObserver = null;
    }
    if (ideThemeObserver) {
      ideThemeObserver.disconnect();
      ideThemeObserver = null;
    }
    if (autosaveTimer) clearTimeout(autosaveTimer);
    hardwareBridge.disconnect();
    if (editor) {
      try { editor.dispose(); } catch {}
      editor = null;
    }
    if (terminalFitAddon) {
      try { terminalFitAddon.dispose(); } catch {}
      terminalFitAddon = null;
    }
    if (terminal) {
      try { terminal.dispose(); } catch {}
      terminal = null;
    }
    if (blocklyWorkspace) {
      try { blocklyWorkspace.dispose(); } catch {}
      blocklyWorkspace = null;
    }
    if (pyodideWorker) {
      try { pyodideWorker.terminate(); } catch {}
      pyodideWorker = null;
    }
  });

  // Execute Code in WebAssembly Sandbox
  async function executeCode() {
    if (isExecuting) return;

    // Direct user-gesture audio unlock & crisp mission launch chime
    await webAudioSynth.resume();
    webAudioSynth.playEffect('START');

    isExecuting = true;

    // Deterministic state reset before every mission run
    motionPath = [];
    penTrails = [];
    roverX = 150;
    roverY = 150;
    roverHeading = 0;

    // Refresh code from Blockly in visual block modes
    if (blocklyWorkspace && (stage === 'primary' || stage === 'middle')) {
      try {
        const { pythonGenerator } = await import('blockly/python');
        const code = pythonGenerator.workspaceToCode(blocklyWorkspace);
        if (code && code.trim().length > 0) {
          activeCode = `# Auto-generated from Visual Blocks\nimport time\n\n${code}`;
        }
      } catch {}
    }

    auxiliaryTab = 'arena';
    addMissionLog(`Starting mission execution: ${activeMissionId.toUpperCase()}...`, 'info');

    if (terminal) {
      writeToTerminal('\r\n[CREED Runtime] Launching execution payload...\r\n');
    }

    if (pyodideWorker) {
      if (executionWatchdog) clearTimeout(executionWatchdog);
      executionWatchdog = setTimeout(() => {
        if (isExecuting) {
          addMissionLog('Execution timed out after 15s (unbounded loop detected). Halting execution.', 'error');
          stopExecution();
        }
      }, 15000);
      pyodideWorker.postMessage({ id: Date.now(), code: activeCode });
    } else {
      stepRoverSimulation(activeCode);
      setTimeout(() => {
        isExecuting = false;
        webAudioSynth.playEffect('SUCCESS');
        if (terminal) {
          writeToTerminal('Execution completed in local runtime environment.\r\n$ ');
        }
      }, 500);
    }
  }

  // Flash Device (ESP32 or BBC micro:bit)
  async function flashToDevice() {
    if (targetHardware === 'microbit') {
      await flashToMicrobit();
    } else {
      await flashToESP32();
    }
  }

  async function flashToMicrobit() {
    try {
      isFlashing = true;
      flashProgress = 40;
      writeToTerminal('\r\n\x1b[36mGenerating MicroPython Artifact for BBC micro:bit...\x1b[0m\r\n');
      const { filename, sizeBytes } = exportMicroPythonArtifact(activeCode, 'microbit');
      flashProgress = 100;
      writeToTerminal(`\x1b[32mExported ${filename} (${sizeBytes} bytes).\x1b[0m Open in python.microbit.org or copy to CircuitPython drive.\r\n$ `);
      addMissionLog(`Exported ${filename} (${sizeBytes} B) - load via python.microbit.org or CircuitPython drive.`, 'success');
    } catch (e: any) {
      writeToTerminal(`\r\n\x1b[31mExport Error:\x1b[0m ${e?.message || e}\r\n$ `);
      addMissionLog(`Export error: ${e?.message || e}`, 'error');
    } finally {
      isFlashing = false;
      flashProgress = 0;
    }
  }

  async function flashToESP32() {
    try {
      isFlashing = true;
      flashProgress = 40;
      writeToTerminal('\r\n\x1b[36mGenerating MicroPython Artifact for ESP32...\x1b[0m\r\n');
      const { filename, sizeBytes } = exportMicroPythonArtifact(activeCode, 'esp32');
      flashProgress = 100;
      writeToTerminal(`\x1b[32mExported ${filename} (${sizeBytes} bytes).\x1b[0m Copy to ESP32 device flash volume.\r\n$ `);
      addMissionLog(`Exported ${filename} (${sizeBytes} B) for ESP32.`, 'success');
    } catch (e: any) {
      writeToTerminal(`\r\n\x1b[31mExport Error:\x1b[0m ${e?.message || e}\r\n$ `);
      addMissionLog(`Export error: ${e?.message || e}`, 'error');
    } finally {
      isFlashing = false;
      flashProgress = 0;
    }
  }
</script>

<!-- If in full-screen dialog mode, render inline placeholder so page layout remains stable -->
{#if isFullscreen}
  <div class="w-full h-160 border border-dashed border-border/80 bg-surface-subtle/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
    <div class="size-12 bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
      <Layers class="size-6" />
    </div>
    <div class="space-y-1">
      <h3 class="text-sm font-semibold text-ink font-mono uppercase tracking-wide">
        {#if stage === 'primary'}
          Primary Visual Studio Active (Full Screen Dialog)
        {:else if stage === 'middle'}
          Middle Dual-Pane Studio Active (Full Screen Dialog)
        {:else}
          Secondary Monaco Studio Active (Full Screen Dialog)
        {/if}
      </h3>
      <p class="text-xs text-ink-muted max-w-sm">
        The workbench is currently open in an immersive full-screen dialog. You can return anytime via the Close Studio button or by pressing <kbd class="px-1 py-0.5 text-[10px] bg-surface border border-border text-ink font-mono">Esc</kbd>.
      </p>
    </div>
    <button
      onclick={closeStudio}
      class="px-4 py-1.5 bg-surface hover:bg-surface-raised border border-border text-ink text-xs font-mono transition-micro shadow-xs flex items-center gap-2"
    >
      <X class="size-3.5 text-red-400" />
      <span>Return to Inline Workbench</span>
    </button>
  </div>
{/if}

<svelte:window
  onkeydown={(e) => {
    if (e.key === 'Escape') {
      // 1. Highest priority: dismiss modal dialog if open
      if (showMentorModal) {
        showMentorModal = false;
        return;
      }
      // 2. Second priority: dismiss active dropdown menu and restore focus to trigger
      const anyDropdownOpen = showMissionDropdown || showProjectDropdown || showHardwareDropdown || showTemplateDropdown;
      if (anyDropdownOpen) {
        dismissDropdowns(true);
        return;
      }
      // 3. Lowest priority: exit fullscreen studio mode if no overlays or menus are open
      if (isFullscreen) {
        closeStudio();
      }
    }
  }}
  onclick={(e) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('header.min-h-12')) return;
    dismissDropdowns(false);
  }}
/>

<div
  class={isFullscreen
    ? 'fixed inset-0 z-50 w-screen h-screen bg-canvas flex flex-col font-sans select-none overflow-hidden animate-in fade-in-0 duration-150'
    : 'flex flex-col w-full h-[clamp(460px,calc(100vh-10rem),920px)] min-h-115 max-h-230 border border-border bg-surface shadow-xs rounded-none font-sans overflow-hidden transition-all duration-200'}
>
  <!-- IDE Toolbar (WAY 2.1 Unified Engineering Header - Responsive Clusters) -->
  <header class="min-h-12 px-3 py-1.5 border-b border-border bg-surface flex flex-wrap items-center justify-between gap-2 shrink-0 relative z-40 select-none">
    <!-- ZONE 1 (Left): Workbench / Studio Title, Mission Selector, Mode Pill -->
    <div class="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
      {#if isFullscreen}
        <button
          onclick={closeStudio}
          class="flex items-center gap-1.5 px-3 py-1 bg-surface-subtle hover:bg-surface border border-border text-ink text-xs font-mono rounded-sm transition-micro shadow-2xs group"
          title="Return to workbench (Esc)"
        >
          <ArrowLeft class="size-3.5 text-ink-muted group-hover:text-ink transition-colors" />
          <span class="font-bold hidden sm:inline">Workbench</span>
          <kbd class="px-1 py-0.5 text-[9px] bg-canvas border border-border text-ink-muted font-mono">Esc</kbd>
        </button>
      {:else}
        <div class="flex items-center gap-1.5">
          <TerminalSquare class="size-4 text-brand" />
          <span class="text-xs font-mono font-bold text-ink uppercase tracking-wider hidden sm:inline">
            Robotics Studio
          </span>
        </div>
      {/if}

      <div class="h-4 w-px bg-border"></div>

      <!-- Guided Mission Selector Dropdown -->
      <div class="relative inline-block">
        <button
          onclick={(e) => {
            e.stopPropagation();
            lastDropdownTrigger = e.currentTarget as HTMLElement;
            showMissionDropdown = !showMissionDropdown;
            showProjectDropdown = false;
            showHardwareDropdown = false;
            showTemplateDropdown = false;
          }}
          class="px-3 py-1 text-xs font-mono border border-border bg-surface hover:bg-surface-subtle text-ink flex items-center gap-1.5 rounded-sm transition-micro shadow-2xs"
          aria-expanded={showMissionDropdown}
          aria-label="Select Robotics Mission"
          title="Select guided robotics mission"
        >
          <span class="text-sm">{activeMissionMeta.icon}</span>
          <span class="font-bold text-ink max-w-28 sm:max-w-44 md:max-w-56 lg:max-w-64 truncate">{activeMissionMeta.title}</span>
          <span class="text-[9px] font-mono px-1 py-0.5 bg-surface-subtle border border-border rounded-xs text-ink-muted hidden md:inline">
            L{STEM_MISSIONS[activeMissionId]?.level || 1}
          </span>
          <ChevronDown class="size-3 text-ink-muted transition-transform duration-150 {showMissionDropdown ? 'rotate-180' : ''}" />
        </button>
        {#if showMissionDropdown}
          <div
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); dismissDropdowns(true); } }}
            tabindex="-1"
            class="absolute left-0 top-full mt-1 w-72 bg-surface border border-border shadow-lg rounded-sm z-50 py-1 text-xs font-mono animate-in fade-in-0 zoom-in-95 duration-100"
            role="menu"
          >
            <div class="px-3 py-1.5 border-b border-border text-[10px] uppercase tracking-wider text-ink-muted font-bold flex items-center justify-between">
              <span>Guided Missions</span>
              <span class="text-[9px] text-brand">Level 1–10</span>
            </div>
            <div class="max-h-80 overflow-y-auto divide-y divide-border/50">
              {#each missionsList as m}
                <button
                  onclick={() => { selectMission(m.id); showMissionDropdown = false; }}
                  class="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-surface-subtle transition-micro {activeMissionId === m.id ? 'bg-brand/10 text-brand font-bold' : 'text-ink'}"
                  role="menuitem"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-base shrink-0">{m.icon}</span>
                    <div class="flex flex-col min-w-0">
                      <span class="truncate">{m.title}</span>
                      <span class="text-[10px] text-ink-muted font-normal font-sans truncate">{m.desc}</span>
                    </div>
                  </div>
                  {#if activeMissionId === m.id}
                    <span class="text-brand text-xs font-bold shrink-0 ml-1">✓</span>
                  {/if}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <div class="h-4 w-px bg-border hidden sm:block"></div>

      <!-- Segmented Mode Selector (Blocks | Split | Code) -->
      <div class="inline-flex border border-border bg-surface-subtle p-0.5 rounded-sm shadow-2xs">
        <button
          onclick={() => switchStage('primary')}
          class="px-3 py-0.5 text-xs font-mono rounded-xs transition-micro {stage === 'primary'
            ? 'bg-surface text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
          title="Visual Blockly programming workspace"
        >
          Blocks
        </button>
        <button
          onclick={() => switchStage('middle')}
          class="px-3 py-0.5 text-xs font-mono rounded-xs transition-micro flex items-center gap-1 {stage === 'middle'
            ? 'bg-surface text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
          title="Split mode: Visual Blocks with real-time Python AST sync"
        >
          <span>Split</span>
        </button>
        <button
          onclick={() => switchStage('secondary')}
          class="px-3 py-0.5 text-xs font-mono rounded-xs transition-micro flex items-center gap-1 {stage === 'secondary'
            ? 'bg-surface text-brand font-bold shadow-2xs'
            : 'text-ink-secondary hover:text-ink'}"
          title="Full Monaco Python code editor with Pyodide runtime"
        >
          <span>Code</span>
        </button>
      </div>
    </div>

    <!-- ZONE 2 (Center): Primary Execution CTA, Flash Button, Canonical Verify, Template (Code mode) -->
    <div class="flex items-center gap-1.5 shrink-0">
      <!-- Single Contextual Primary Action Button -->
      {#if isAnimating || isExecuting}
        <button
          onclick={stopExecution}
          class="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-sm transition-micro shadow-xs active:scale-98"
          title="Stop running mission execution"
        >
          <Square class="size-3.5 fill-current" />
          <span>Stop Mission</span>
        </button>
      {:else}
        <button
          onclick={executeCode}
          disabled={isFlashing}
          class="flex items-center gap-1.5 px-3.5 py-1 bg-mint hover:bg-mint-hover text-mint-foreground font-bold text-xs rounded-sm transition-micro disabled:opacity-50 shadow-xs active:scale-98"
          title="Execute robotics mission"
        >
          <Play class="size-3.5 fill-current" />
          <span>{stage === 'primary' ? 'Run Mission' : stage === 'middle' ? 'Run Split' : 'Run Code'}</span>
        </button>
      {/if}

      <!-- Secondary Flash Action -->
      <button
        onclick={flashToDevice}
        disabled={isExecuting || isAnimating || isFlashing}
        class="flex items-center gap-1.5 px-3 py-1 border border-border bg-surface hover:bg-surface-subtle text-ink text-xs font-mono rounded-sm transition-micro disabled:opacity-50 shadow-2xs"
        title="Flash firmware payload to physical hardware device"
      >
        <Cpu class="size-3.5 text-brand" />
        <span class="hidden md:inline">{isFlashing ? `Flashing ${flashProgress}%` : `Flash ${targetHardware === 'esp32' ? 'ESP32' : 'micro:bit'}`}</span>
        <span class="md:hidden">Flash</span>
      </button>

      <!-- Canonical Verification Button (Single Central Authoritative Instance) -->
      <button
        onclick={submitMissionForVerification}
        disabled={isSubmittingEvidence || isExecuting}
        class="flex items-center gap-1.5 px-3 py-1 text-xs font-mono border rounded-sm transition-micro {evidenceSubmitted
          ? 'border-mint text-mint bg-mint/10 font-bold'
          : 'border-border text-ink bg-surface hover:bg-surface-subtle hover:border-brand/50'} disabled:opacity-50 shadow-2xs"
        title="Submit mission for applied competency verification against deterministic rubric"
      >
        <CheckCircle2 class="size-3.5 text-mint" />
        <span>{isSubmittingEvidence ? 'Verifying...' : 'Verify'}</span>
      </button>

      {#if stage === 'secondary'}
        <!-- Starter Template Selector Dropdown in Code Mode -->
        <div class="relative inline-block ml-0.5">
          <button
            onclick={(e) => {
              e.stopPropagation();
              lastDropdownTrigger = e.currentTarget as HTMLElement;
              showTemplateDropdown = !showTemplateDropdown;
              showMissionDropdown = false;
              showProjectDropdown = false;
              showHardwareDropdown = false;
            }}
            class="px-2 py-0.5 text-xs font-mono border border-border bg-surface hover:border-ink-muted text-ink flex items-center gap-1.5 rounded-sm shadow-2xs transition-micro"
            aria-expanded={showTemplateDropdown}
            aria-label="Select starter template for textual Python development"
            title="Select starter template for textual Python development"
          >
            <Code2 class="size-3 text-brand" />
            <span class="text-ink-muted text-[10px] uppercase hidden lg:inline">Template:</span>
            <span class="font-bold">{activeTemplateLabel}</span>
            <ChevronDown class="size-3 text-ink-muted transition-transform duration-150 {showTemplateDropdown ? 'rotate-180' : ''}" />
          </button>
          {#if showTemplateDropdown}
            <div
              onclick={(e) => e.stopPropagation()}
              onkeydown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); dismissDropdowns(true); } }}
              tabindex="-1"
              class="absolute left-0 top-full mt-1 w-64 bg-surface border border-border shadow-xl rounded-sm z-50 divide-y divide-border font-mono text-xs animate-in fade-in-0 zoom-in-95 duration-100"
              role="menu"
            >
              {#each templates as t}
                <button
                  onclick={() => { loadTemplate(t); showTemplateDropdown = false; }}
                  class="w-full px-3 py-2 text-left hover:bg-surface-subtle transition-micro flex flex-col gap-0.5 {activeTemplateLabel === t.label ? 'bg-surface-subtle border-l-2 border-brand font-bold' : ''}"
                  role="menuitem"
                >
                  <div class="flex items-center justify-between text-ink">
                    <span>{t.label}</span>
                    <span class="text-[10px] text-ink-muted">{t.title}</span>
                  </div>
                  <span class="text-[10px] text-ink-muted font-sans font-normal">{t.desc}</span>
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    </div>

    <!-- ZONE 3 (Right): Execution State, Hardware Target, Autosave, Project, HW Bridge, Extensions, Fullscreen -->
    <div class="flex items-center gap-1.5 shrink-0">
      <!-- Unmistakable Execution State Indicator (Non-color-only) -->
      <div class="flex items-center mr-1">
        {#if executionState === 'running'}
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-mint/15 text-mint border border-mint/40 rounded-xs text-[10px] font-mono font-bold">
            <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            <span>RUNNING</span>
          </span>
        {:else if executionState === 'flashing'}
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-brand/15 text-brand border border-brand/40 rounded-xs text-[10px] font-mono font-bold">
            <span class="size-1.5 rounded-none bg-brand animate-pulse"></span>
            <span>FLASHING</span>
          </span>
        {:else if executionState === 'error'}
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-500/15 text-red-500 border border-red-500/40 rounded-xs text-[10px] font-mono font-bold">
            <span class="size-1.5 rounded-none bg-red-500"></span>
            <span>ERROR</span>
          </span>
        {:else if executionState === 'completed'}
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-mint/15 text-mint border border-mint/40 rounded-xs text-[10px] font-mono font-bold">
            <CheckCircle2 class="size-3 text-mint" />
            <span>COMPLETED</span>
          </span>
        {:else}
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 bg-surface-subtle text-ink-muted border border-border rounded-xs text-[10px] font-mono">
            <span class="size-1.5 rounded-none bg-border-strong"></span>
            <span>IDLE</span>
          </span>
        {/if}
      </div>

      <!-- Autosave Status Indicator -->
      <div class="hidden xl:flex items-center gap-1 text-[11px] font-mono text-ink-muted mr-1" title="Autosave status">
        <span class="size-1.5 rounded-none {cloudSyncStatus === 'saved' ? 'bg-mint' : cloudSyncStatus === 'saving' ? 'bg-brand animate-pulse' : 'bg-amber-500'}"></span>
        <span>{cloudSyncStatus === 'saved' ? 'Saved' : cloudSyncStatus === 'saving' ? 'Saving...' : 'Offline'}</span>
      </div>

      <!-- Hardware Target Selector -->
      <div class="relative inline-block">
        <button
          onclick={(e) => {
            e.stopPropagation();
            lastDropdownTrigger = e.currentTarget as HTMLElement;
            showHardwareDropdown = !showHardwareDropdown;
            showMissionDropdown = false;
            showProjectDropdown = false;
            showTemplateDropdown = false;
          }}
          class="px-2 py-1 text-xs font-mono border border-border bg-surface hover:bg-surface-subtle text-ink flex items-center gap-1.5 rounded-sm transition-micro shadow-2xs"
          aria-expanded={showHardwareDropdown}
          aria-label="Select Target Hardware"
          title="Target hardware controller"
        >
          <Cpu class="size-3.5 {targetHardware === 'esp32' ? 'text-brand' : 'text-mint'}" />
          <span class="font-bold hidden md:inline">{targetHardware === 'esp32' ? 'ESP32 MCU' : 'micro:bit v2'}</span>
          <ChevronDown class="size-3 text-ink-muted transition-transform duration-150 {showHardwareDropdown ? 'rotate-180' : ''}" />
        </button>
        {#if showHardwareDropdown}
          <div
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); dismissDropdowns(true); } }}
            tabindex="-1"
            class="absolute left-0 top-full mt-1 w-56 bg-surface border border-border shadow-lg rounded-sm z-50 py-1 text-xs font-mono animate-in fade-in-0 zoom-in-95 duration-100"
            role="menu"
          >
            <div class="px-3 py-1.5 border-b border-border text-[10px] uppercase tracking-wider text-ink-muted font-bold">
              Target Controller
            </div>
            <button
              onclick={() => { targetHardware = 'esp32'; showHardwareDropdown = false; }}
              class="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-surface-subtle transition-micro {targetHardware === 'esp32' ? 'bg-brand/10 text-brand font-bold' : 'text-ink'}"
              role="menuitem"
            >
              <div class="flex items-center gap-2">
                <Cpu class="size-3.5 text-brand" />
                <div class="flex flex-col">
                  <span>ESP32 MCU</span>
                  <span class="text-[10px] text-ink-muted font-normal font-sans">Web Serial · 115200 baud</span>
                </div>
              </div>
              {#if targetHardware === 'esp32'}
                <span class="text-brand text-xs font-bold">✓</span>
              {/if}
            </button>
            <button
              onclick={() => { targetHardware = 'microbit'; showHardwareDropdown = false; }}
              class="w-full text-left px-3 py-2 flex items-center justify-between hover:bg-surface-subtle transition-micro {targetHardware === 'microbit' ? 'bg-mint/10 text-mint font-bold' : 'text-ink'}"
              role="menuitem"
            >
              <div class="flex items-center gap-2">
                <Layers class="size-3.5 text-mint" />
                <div class="flex flex-col">
                  <span>BBC micro:bit v2</span>
                  <span class="text-[10px] text-ink-muted font-normal font-sans">WebUSB · CMSIS-DAP</span>
                </div>
              </div>
              {#if targetHardware === 'microbit'}
                <span class="text-mint text-xs font-bold">✓</span>
              {/if}
            </button>
          </div>
        {/if}
      </div>

      <!-- Project Actions Dropdown -->
      <div class="relative inline-block">
        <input
          type="file"
          accept=".sb3,.json"
          bind:this={scratchFileInput}
          onchange={handleScratchFileUpload}
          class="hidden"
        />
        <button
          onclick={(e) => {
            e.stopPropagation();
            lastDropdownTrigger = e.currentTarget as HTMLElement;
            showProjectDropdown = !showProjectDropdown;
            showMissionDropdown = false;
            showHardwareDropdown = false;
            showTemplateDropdown = false;
          }}
          class="px-2 py-1 text-xs font-mono border border-border bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink flex items-center gap-1.5 rounded-sm transition-micro shadow-2xs"
          aria-expanded={showProjectDropdown}
          aria-label="Project Actions"
          title="Project file operations"
        >
          <FolderDown class="size-3.5 text-ink-muted" />
          <span class="hidden lg:inline">Project</span>
          <ChevronDown class="size-3 text-ink-muted transition-transform duration-150 {showProjectDropdown ? 'rotate-180' : ''}" />
        </button>
        {#if showProjectDropdown}
          <div
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); dismissDropdowns(true); } }}
            tabindex="-1"
            class="absolute left-0 top-full mt-1 w-56 bg-surface border border-border shadow-lg rounded-sm z-50 py-1 text-xs font-mono animate-in fade-in-0 zoom-in-95 duration-100"
            role="menu"
          >
            <div class="px-3 py-1 border-b border-border text-[10px] uppercase tracking-wider text-ink-muted font-bold">
              Workspace Files
            </div>
            <button
              onclick={() => { scratchFileInput?.click(); showProjectDropdown = false; }}
              class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-subtle text-ink transition-micro"
              role="menuitem"
            >
              <Upload class="size-3.5 text-cyan" />
              <span>Import (.sb3 / .json)</span>
            </button>
            <button
              onclick={() => { exportProjectFile(); showProjectDropdown = false; }}
              class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-subtle text-ink transition-micro"
              role="menuitem"
            >
              <Download class="size-3.5 text-mint" />
              <span>Export Project (.json)</span>
            </button>
            <div class="h-px bg-border my-1"></div>
            <div class="h-px bg-border my-1"></div>
            <button
              onclick={() => { resetMissionWorkspace(); showProjectDropdown = false; }}
              class="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-surface-subtle text-red-500 hover:text-red-400 transition-micro"
              role="menuitem"
            >
              <RotateCcw class="size-3.5 text-red-400" />
              <span>Reset Workspace</span>
            </button>
          </div>
        {/if}
      </div>

      <!-- Live Hardware Streaming Bridge Button -->
      <button
        onclick={toggleHardwareStream}
        class="flex items-center gap-1 px-2 py-1 text-xs font-mono border rounded-sm transition-micro {hardwareStreamState.isConnected
          ? 'border-mint text-mint bg-mint/10 font-bold'
          : 'border-border text-ink-secondary hover:text-ink bg-surface'} shadow-2xs"
        title={hardwareStreamState.isConnected ? 'Streaming live hardware telemetry at 20Hz' : 'Connect hardware bridge'}
      >
        <Zap class="size-3.5 {hardwareStreamState.isConnected ? 'text-mint animate-pulse' : 'text-ink-muted'}" />
        <span class="hidden md:inline">{hardwareStreamState.isConnected ? `${hardwareStreamState.fps}Hz` : 'Connect HW'}</span>
      </button>

      <!-- Extension Studio Sheet Trigger Button -->
      <button
        onclick={() => (showExtensionDrawer = !showExtensionDrawer)}
        class="flex items-center gap-1 px-2 py-1 text-xs font-mono border rounded-sm transition-micro {showExtensionDrawer
          ? 'border-brand text-brand bg-brand/10 font-bold'
          : 'border-border text-ink-secondary hover:text-ink bg-surface'} shadow-2xs"
        title="Browse and toggle modular robotics extension packs"
      >
        <Layers class="size-3.5 text-brand" />
        <span class="hidden md:inline">Ext ({activeExtensionIds.length})</span>
      </button>

      <!-- Competency Mastery Pill (if evaluated) -->
      {#if currentEvaluation}
        <button
          onclick={() => (showCompetencyDrawer = !showCompetencyDrawer)}
          class="hidden xl:flex items-center gap-1 px-2 py-1 text-xs font-mono border rounded-sm transition-micro {showCompetencyDrawer
            ? 'border-mint text-mint bg-mint/10 font-bold'
            : 'border-border text-ink-secondary hover:text-ink bg-surface-subtle'}"
          title="Inspect competency evidence: {currentEvaluation.developmentalBand}"
        >
          <ShieldCheck class="size-3.5 text-mint" />
          <span class="text-xs font-bold text-ink">Mastery</span>
        </button>
      {/if}

      <!-- Fullscreen / Window Toggle -->
      {#if isFullscreen}
        <button
          onclick={closeStudio}
          class="p-1.5 border border-border bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink rounded-sm transition-micro shadow-2xs"
          title="Minimize fullscreen (Esc)"
        >
          <Minimize2 class="size-3.5" />
        </button>
      {:else}
        <button
          onclick={toggleFullscreen}
          class="p-1.5 border border-border bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink rounded-sm transition-micro shadow-2xs"
          title="Fullscreen studio"
        >
          <Maximize2 class="size-3.5" />
        </button>
      {/if}
    </div>
  </header>

  <!-- Persistent 3-Stage Responsive Workspace (Zero Canvas Overlap) -->
  <div class="flex flex-1 overflow-hidden relative z-10">

    <!-- PANEL 1: Visual Blockly Workspace (Unconditionally Mounted in DOM) -->
    <div
      class={stage === 'primary'
        ? (isFullscreen ? (dockStageSize === 'expanded' ? 'w-[46%]' : 'w-[64%]') + ' h-full relative transition-all duration-200' : (dockStageSize === 'expanded' ? 'w-full lg:w-[46%]' : 'w-full lg:w-[62%]') + ' h-full relative transition-all duration-200')
        : stage === 'middle'
        ? (isFullscreen ? (dockStageSize === 'expanded' ? 'w-full md:w-1/2 lg:w-[28%]' : 'w-full md:w-1/2 lg:w-[35%]') + ' min-w-0 h-full relative border-r border-border transition-all duration-200' : (dockStageSize === 'expanded' ? 'w-full sm:w-1/2 xl:w-[28%]' : 'w-full sm:w-1/2 xl:w-[35%]') + ' min-w-0 h-full relative border-r border-border transition-all duration-200')
        : 'hidden'}
    >
      <div bind:this={blocklyContainer} class="absolute inset-0"></div>

      <!-- Floating Canvas Navigation Toolbar (Restrained Ergonomic Controls) -->
      <div class="absolute top-3 right-3 z-10 flex items-center bg-surface/90 backdrop-blur-xs border border-border p-0.5 rounded-sm shadow-xs font-mono text-xs select-none">
        <button
          onclick={zoomIn}
          title="Zoom In (+)"
          class="p-1.5 hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro rounded-xs"
        >
          <ZoomIn class="size-3.5" />
        </button>
        <button
          onclick={resetZoom}
          title="Reset Zoom to 100%"
          class="px-2 py-1 text-[11px] hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro border-x border-border"
        >
          100%
        </button>
        <button
          onclick={zoomOut}
          title="Zoom Out (-)"
          class="p-1.5 hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro rounded-xs"
        >
          <ZoomOut class="size-3.5" />
        </button>
        <div class="h-3.5 w-px bg-border my-auto mx-0.5"></div>
        <button
          onclick={zoomToFit}
          title="Zoom to Fit Workspace"
          class="px-2 py-1 text-[11px] hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro"
        >
          Fit
        </button>
        <div class="h-3.5 w-px bg-border my-auto mx-0.5"></div>
        <button
          onclick={cleanUpBlocks}
          title="Clean Up Blocks (Arrange Vertically)"
          class="p-1.5 hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro rounded-xs"
        >
          <Sparkles class="size-3.5 text-attention" />
        </button>
        <div class="h-3.5 w-px bg-border my-auto mx-0.5"></div>
        <button
          onclick={undoWorkspace}
          title="Undo (Ctrl+Z)"
          class="p-1.5 hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro rounded-xs"
        >
          <Undo2 class="size-3.5" />
        </button>
        <button
          onclick={redoWorkspace}
          title="Redo (Ctrl+Y)"
          class="p-1.5 hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro rounded-xs"
        >
          <Redo2 class="size-3.5" />
        </button>
      </div>
    </div>

    <!-- PANEL 2: Monaco Python Code Editor (Unconditionally Mounted in DOM) -->
    <div
      class={stage === 'middle'
        ? (isFullscreen ? 'hidden md:flex md:w-1/2 lg:w-[33%] min-w-0 h-full flex-col bg-surface-subtle border-r border-border transition-all duration-200' : 'hidden sm:flex sm:w-1/2 xl:w-[33%] min-w-0 h-full flex-col bg-surface-subtle border-r border-border transition-all duration-200')
        : stage === 'secondary'
        ? 'w-[62%] h-full flex flex-col bg-surface-subtle border-r border-border transition-all duration-200'
        : 'hidden'}
    >
      {#if stage === 'middle'}
        <div class="px-3 py-1.5 border-b border-border bg-surface flex items-center justify-between text-[11px] font-mono text-ink-muted shrink-0">
          <span class="flex items-center gap-1.5">
            <Code2 class="size-3 text-mint" />
            Live Python Output (Read-only AST)
          </span>
          <div class="flex items-center gap-2">
            <button
              onclick={copyPythonCode}
              class="px-2 py-0.5 text-[10px] font-mono border border-border bg-surface hover:bg-surface-subtle text-ink-secondary hover:text-ink transition-micro rounded-sm flex items-center gap-1"
              title="Copy generated Python code to clipboard"
            >
              <span>{copiedCode ? 'Copied ✓' : 'Copy'}</span>
            </button>
            <span class="text-[10px] text-mint font-mono font-bold">AST Sync ✓</span>
          </div>
        </div>
      {:else}
        <div class="px-3 py-1.5 border-b border-border bg-surface flex items-center justify-between text-[11px] font-mono text-ink-muted shrink-0">
          <span class="flex items-center gap-1.5">
            <Code2 class="size-3 text-brand" />
            Monaco Python Code Editor (Full Language Service)
          </span>
          <span class="text-[10px] text-ink-muted font-mono">Pyodide WASM Runtime</span>
        </div>
      {/if}

      <div class="flex-1 relative">
        <div bind:this={monacoContainer} class="absolute inset-0"></div>
      </div>
    </div>

    <!-- PANEL 3: Unified Resizable Auxiliary Dock (Single Authoritative Instance) -->
    <div
      class={stage === 'primary'
        ? (isFullscreen ? (dockStageSize === 'expanded' ? 'w-[54%]' : 'w-[36%]') + ' min-w-75 h-full border-l border-border bg-surface flex flex-col transition-all duration-200' : 'hidden lg:flex lg:flex-col ' + (dockStageSize === 'expanded' ? 'lg:w-[54%]' : 'lg:w-[38%]') + ' min-w-75 h-full border-l border-border bg-surface transition-all duration-200')
        : stage === 'middle'
        ? (isFullscreen ? 'hidden lg:flex lg:flex-col ' + (dockStageSize === 'expanded' ? 'lg:w-[42%]' : 'lg:w-[32%]') + ' min-w-70 h-full border-l border-border bg-surface transition-all duration-200' : 'hidden xl:flex xl:flex-col ' + (dockStageSize === 'expanded' ? 'xl:w-[42%]' : 'xl:w-[32%]') + ' min-w-70 h-full border-l border-border bg-surface transition-all duration-200')
        : (dockStageSize === 'expanded' ? 'w-[54%]' : 'w-[38%]') + ' min-w-75 h-full border-l border-border bg-surface flex flex-col transition-all duration-200'}
    >
      <!-- Level 1 Integrated Dock Tab Bar & Telemetry Strip (36px) -->
      <div class="h-9 px-2 border-b border-border bg-surface flex items-center justify-between text-[10.5px] font-mono shrink-0 select-none gap-1">
        <div class="inline-flex p-0.5 bg-surface-subtle border border-border rounded-sm gap-0.5 shrink-0">
          <button
            onclick={() => { auxiliaryTab = 'arena'; arenaSubView = 'field'; }}
            class="px-1.5 py-0.5 rounded-xs transition-micro flex items-center gap-1 shrink-0 {auxiliaryTab === 'arena'
              ? 'bg-surface text-cyan font-bold shadow-2xs'
              : 'text-ink-muted hover:text-ink'}"
            title="ARES-Prime Autonomous Proving Ground Simulation"
          >
            <span>🎯</span>
            <span class="hidden sm:inline">Arena</span>
          </button>
          <button
            onclick={() => (auxiliaryTab = 'guidance')}
            class="px-1.5 py-0.5 rounded-xs transition-micro flex items-center gap-1 shrink-0 {auxiliaryTab === 'guidance'
              ? 'bg-surface text-amber-500 font-bold shadow-2xs'
              : 'text-ink-muted hover:text-ink'}"
            title="WAY 2.1 Mission Guidance, PRIMM Stepper & Rubric Criteria"
          >
            <span>🧭</span>
            <span class="hidden sm:inline">Guidance</span>
          </button>
          <button
            onclick={() => {
              auxiliaryTab = 'console';
              setTimeout(() => { terminalFitAddon?.fit(); }, 40);
            }}
            class="px-1.5 py-0.5 rounded-xs transition-micro flex items-center gap-1 shrink-0 {auxiliaryTab === 'console'
              ? 'bg-surface text-mint font-bold shadow-2xs'
              : 'text-ink-muted hover:text-ink'}"
            title="Execution Events & Serial Terminal Console"
          >
            <span>📋</span>
            <span class="hidden sm:inline">Console</span>
            {#if missionLogs.length > 1}
              <span class="px-1 text-[8px] bg-surface-subtle border border-border text-ink-muted rounded-xs hidden md:inline">{missionLogs.length}</span>
            {/if}
          </button>
          <button
            onclick={() => (auxiliaryTab = 'hardware')}
            class="px-1.5 py-0.5 rounded-xs transition-micro flex items-center gap-1 shrink-0 {auxiliaryTab === 'hardware'
              ? 'bg-surface text-brand font-bold shadow-2xs'
              : 'text-ink-muted hover:text-ink'}"
            title="Hardware Telemetry Bridge (ESP32 / micro:bit / Arduino)"
          >
            <span>🔌</span>
            <span class="hidden sm:inline">Hardware</span>
            {#if hardwareStreamState.isConnected}
              <span class="size-1.5 rounded-none bg-mint animate-pulse"></span>
            {/if}
          </button>
        </div>

        <!-- Integrated Telemetry & Playback Controls on Right -->
        {#if auxiliaryTab === 'console'}
          <div class="flex items-center gap-1 shrink-0">
            <button
              onclick={() => (consoleSubTab = 'events')}
              class="px-1.5 py-0.5 text-[9px] font-mono rounded-xs transition-micro {consoleSubTab === 'events' ? 'bg-surface-subtle text-ink font-bold' : 'text-ink-muted hover:text-ink'}"
            >
              Events
            </button>
            <button
              onclick={() => {
                consoleSubTab = 'terminal';
                setTimeout(() => { terminalFitAddon?.fit(); }, 40);
              }}
              class="px-1.5 py-0.5 text-[9px] font-mono rounded-xs transition-micro {consoleSubTab === 'terminal' ? 'bg-surface-subtle text-ink font-bold' : 'text-ink-muted hover:text-ink'}"
            >
              xterm.js
            </button>
          </div>
        {:else}
          <div class="flex items-center gap-1.5 shrink-0 text-[10px] text-ink-muted">
            <!-- Dedicated Prominent Reset Button (Never truncated, high touch affordance) -->
            <button
              type="button"
              onclick={resetRover}
              class="shrink-0 px-2 py-0.5 text-[9.5px] font-mono font-bold rounded-xs border border-mint/40 bg-mint/10 text-mint hover:bg-mint/20 hover:border-mint transition-micro flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Reset simulated rover position and heading to origin"
              aria-label="Reset rover to origin"
            >
              <RotateCcw class="size-3 shrink-0" />
              <span>Reset</span>
            </button>

            <!-- Compact Sim Settings & Stage Layout Dropdown Menu -->
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                class="h-6 px-1.5 border border-border bg-surface-subtle hover:bg-surface text-[9.5px] font-mono font-bold text-ink rounded-xs transition-micro flex items-center gap-1 cursor-pointer shrink-0"
                title="Simulator Kinematics & Stage Settings"
              >
                <span>⚡ {playbackSpeed}</span>
                <span class="text-border">·</span>
                <span class={batteryLevel < 25 ? 'text-red-500 font-bold' : 'text-ink-muted'}>🔋{Math.round(batteryLevel)}%</span>
                <ChevronDown class="size-2.5 text-ink-muted opacity-70" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="end" class="w-52 p-1 bg-surface-overlay border border-border shadow-md rounded-xs font-sans text-xs">
                <div class="px-2 py-1.5 border-b border-border mb-1">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Kinematic Playback Speed</p>
                </div>
                <DropdownMenu.Item
                  onclick={() => (playbackSpeed = '1x')}
                  class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer {playbackSpeed === '1x' ? 'text-cyan font-bold bg-surface-raised' : 'text-ink'}"
                >
                  <span>1x (Realtime)</span>
                  {#if playbackSpeed === '1x'}<span class="text-cyan font-bold">✓</span>{/if}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onclick={() => (playbackSpeed = '2x')}
                  class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer {playbackSpeed === '2x' ? 'text-cyan font-bold bg-surface-raised' : 'text-ink'}"
                >
                  <span>2x (High Speed)</span>
                  {#if playbackSpeed === '2x'}<span class="text-cyan font-bold">✓</span>{/if}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onclick={() => (playbackSpeed = 'instant')}
                  class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer {playbackSpeed === 'instant' ? 'text-cyan font-bold bg-surface-raised' : 'text-ink'}"
                >
                  <span>Instant (Skip Anim)</span>
                  {#if playbackSpeed === 'instant'}<span class="text-cyan font-bold">✓</span>{/if}
                </DropdownMenu.Item>

                <div class="px-2 py-1.5 border-b border-t border-border my-1">
                  <p class="text-[10px] font-mono uppercase tracking-wider text-ink-muted">Stage Layout</p>
                </div>
                <DropdownMenu.Item
                  onclick={() => {
                    dockStageSize = 'normal';
                    setTimeout(() => { if (blocklyWorkspace && blocklyLib?.svgResize) blocklyLib.svgResize(blocklyWorkspace); if (editor) editor.layout(); }, 60);
                  }}
                  class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer {dockStageSize === 'normal' ? 'text-cyan font-bold bg-surface-raised' : 'text-ink'}"
                >
                  <span>Standard Stage</span>
                  {#if dockStageSize === 'normal'}<span class="text-cyan font-bold">✓</span>{/if}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onclick={() => {
                    dockStageSize = 'expanded';
                    setTimeout(() => { if (blocklyWorkspace && blocklyLib?.svgResize) blocklyLib.svgResize(blocklyWorkspace); if (editor) editor.layout(); }, 60);
                  }}
                  class="flex items-center justify-between px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer {dockStageSize === 'expanded' ? 'text-cyan font-bold bg-surface-raised' : 'text-ink'}"
                >
                  <span>Expanded Stage</span>
                  {#if dockStageSize === 'expanded'}<span class="text-cyan font-bold">✓</span>{/if}
                </DropdownMenu.Item>

                <DropdownMenu.Separator class="my-1 border-t border-border" />
                <DropdownMenu.Item
                  onclick={clearPenTrails}
                  class="px-2 py-1 text-xs rounded-xs hover:bg-surface-raised cursor-pointer text-ink-muted hover:text-ink"
                >
                  Clear Trails & Path
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        {/if}
      </div>

      <!-- TAB 1: Autonomous Robotics Proving Ground (Maximized 100% Canvas Space) -->
      <div class={auxiliaryTab === 'arena' ? 'flex-1 min-h-0 flex flex-col relative' : 'hidden'}>
        <div class="flex-1 min-h-0 relative overflow-hidden flex flex-col p-0">
          <RoverArenaSimulator
            {roverX}
            {roverY}
            {roverHeading}
            {roverDistance}
            {roverSensorActive}
            {batteryLevel}
            {radiationLevel}
            {samplesCollected}
            {solarDeployed}
            {penTrails}
            {motionPath}
            {currentMicrobitIcon}
            {activeMicrobitGrid}
            {robotEmotion}
            {isJumping}
            {jumpHeight}
            {isDancing}
            {danceStyle}
            {speechBubbleText}
            activeActionText={isAnimating || isExecuting ? telemetryAction : null}
            isHardwareBridgeConnected={hardwareStreamState.isConnected}
            hideHeader={false}
            hideMicrobitBar={true}
            viewMode={arenaSubView}
            isDark={isDarkTheme}
            activeMissionTitle={activeMissionMeta.title}
            activeMissionLevel={STEM_MISSIONS[activeMissionId]?.level || 1}
            activeMissionIcon={activeMissionMeta.icon}
            onOpenMissionBrief={() => (showMissionDialog = true)}
            onReset={resetRover}
            onSetPosition={handleSetRoverPosition}
            onButtonPress={handleMicrobitButtonPress}
          />
        </div>

        <!-- Level 2 & 3 Telemetry Strip with Docked micro:bit Display Chip -->
        <div class="px-3 py-1.5 border-t border-border bg-surface text-[10px] font-mono flex items-center justify-between text-ink-muted shrink-0 select-none">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-ink font-bold">X: {Math.round(roverX)} <span class="text-ink-muted font-normal">Y:</span> {Math.round(roverY)}</span>
            <span class="text-border">·</span>
            <span>HDG: <strong class="text-ink">{roverHeading}°</strong></span>
            <span class={roverDistance < 20 ? 'text-red-500 font-bold' : 'text-cyan font-bold'}>LiDAR: {roverDistance}cm</span>
            {#if penTrails.length > 0 || motionPath.length > 0}
              <span class="inline-flex items-center gap-1">
                <span>TRAILS: <strong class="text-cyan">{penTrails.length + motionPath.length}</strong></span>
                <button onclick={clearPenTrails} class="text-[9px] text-cyan hover:underline">Clear</button>
              </span>
            {/if}
          </div>

          <!-- Docked micro:bit v2 LED Display Status Chip (0% arena occlusion) -->
          <div
            class="flex items-center gap-1.5 px-2 py-0.5 border border-border bg-surface-subtle text-[9px] font-mono rounded-none select-none shrink-0"
            title="Live BBC micro:bit v2 5x5 LED Display Matrix"
          >
            <span class="size-1.5 rounded-none bg-amber-500 shadow-xs shrink-0"></span>
            <span class="text-[8px] uppercase tracking-wider text-ink-muted font-bold hidden md:inline">micro:bit</span>
            <span class="text-border hidden md:inline">|</span>
            <span class="font-bold text-mint text-[9px] uppercase tracking-wider truncate max-w-16">{currentMicrobitIcon || robotEmotion || 'HAPPY'}</span>
            <div class="grid grid-cols-5 gap-0.5 p-0.5 bg-black/40 dark:bg-black/80 rounded-none border border-border-subtle shrink-0">
              {#each activeMicrobitGrid as row}
                {#each row as pixel}
                  <div class="size-1 rounded-none {pixel === 1 ? 'bg-red-500 shadow-xs' : 'bg-slate-700 dark:bg-zinc-800'}"></div>
                {/each}
              {/each}
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: Mission Console HUD & xterm.js Terminal -->
      <div class={auxiliaryTab === 'console' ? 'flex-1 min-h-0 flex flex-col relative' : 'hidden'}>
        <!-- Sub-View 1: Events Log HUD -->
        <div class={consoleSubTab === 'events' ? 'flex-1 min-h-0 bg-surface-subtle dark:bg-canvas text-ink dark:text-zinc-300 font-mono text-xs p-3 overflow-y-auto flex flex-col justify-between' : 'hidden'}>
          <div class="space-y-1.5 overflow-y-auto">
            {#each missionLogs as log}
              <div class="flex items-start gap-2 leading-relaxed">
                <span class="text-ink-muted dark:text-zinc-500 text-[10px] shrink-0 font-mono">{log.time}</span>
                <span class="{log.type === 'action' ? 'text-cyan' : log.type === 'success' ? 'text-mint font-bold' : log.type === 'error' ? 'text-red-500 font-bold' : 'text-ink dark:text-zinc-300'}">
                  {log.text}
                </span>
              </div>
            {/each}
          </div>
          <div class="pt-2 border-t border-border dark:border-zinc-800 flex items-center justify-between text-[10px] text-ink-muted dark:text-zinc-500 shrink-0">
            <span>{missionLogs.length} events logged</span>
            <button onclick={clearMissionLogs} class="hover:text-ink dark:hover:text-zinc-300 underline">Clear Events</button>
          </div>
        </div>

        <!-- Sub-View 2: Interactive Terminal (Unconditionally Mounted in DOM) -->
        <div class={consoleSubTab === 'terminal' ? 'flex-1 min-h-0 bg-canvas flex flex-col relative' : 'hidden'}>
          <div class="px-3 py-1 border-b border-border/40 bg-surface-subtle flex items-center justify-between text-[10px] font-mono text-zinc-400 shrink-0">
            <span class="flex items-center gap-1.5">
              <TerminalSquare class="size-3 text-mint" />
              Interactive WASM Terminal (xterm.js)
            </span>
            <button onclick={clearTerminal} class="text-[10px] text-zinc-400 hover:text-zinc-200 hover:underline">
              Clear stdout
            </button>
          </div>
          <div class="flex-1 min-h-0 p-2 pb-3 overflow-hidden relative">
            <div bind:this={terminalContainer} class="h-full w-full"></div>
          </div>
        </div>
      </div>

      <!-- TAB 3: Hardware Controller & Diagnostics -->
      <div class={auxiliaryTab === 'hardware' ? 'flex-1 min-h-0 flex flex-col p-2 overflow-y-auto font-mono text-xs gap-2 bg-surface' : 'hidden'}>
        <!-- Board Target Info Bar (High-density header) -->
        <div class="p-2 border border-border bg-surface-subtle rounded-sm flex items-center justify-between gap-2 shadow-2xs">
          <div class="flex items-center gap-2 min-w-0">
            <Cpu class="size-3.5 text-brand shrink-0" />
            <div class="flex flex-col min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-bold text-ink text-xs truncate">{targetHardware === 'esp32' ? 'ESP32 MCU' : 'BBC micro:bit v2'}</span>
                <span class="px-1.5 py-0.5 text-[9px] uppercase font-bold rounded-xs {hardwareStreamState.isConnected ? 'bg-mint/10 text-mint border border-mint/30' : 'bg-surface text-ink-muted border border-border'}">
                  {hardwareStreamState.isConnected ? 'Connected' : 'Simulation'}
                </span>
              </div>
              <span class="text-[10px] text-ink-muted truncate">
                {hardwareStreamState.isConnected ? `Port: ${hardwareStreamState.portName} (${hardwareStreamState.fps}Hz)` : (targetHardware === 'esp32' ? 'Web Serial · 115200 baud' : 'WebUSB CMSIS-DAP')}
              </span>
            </div>
          </div>
          <button
            onclick={toggleHardwareStream}
            class="px-3 py-1 text-xs border rounded-sm transition-micro shrink-0 {hardwareStreamState.isConnected ? 'border-red-500/30 text-red-500 hover:bg-red-500/10' : 'border-mint text-mint hover:bg-mint/10 font-bold bg-surface'}"
          >
            {hardwareStreamState.isConnected ? 'Disconnect' : 'Connect Bridge'}
          </button>
        </div>

        <!-- micro:bit V2 Interactive Stage -->
        <div class="p-2 border border-border bg-surface-subtle rounded-sm flex flex-col gap-1.5 shadow-2xs">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-ink text-[11px] flex items-center gap-1.5">
              <Layers class="size-3 text-mint" />
              5x5 LED Matrix & Tactile Buttons
            </span>
            <span class="text-[10px] text-mint uppercase font-bold tracking-wider">{robotEmotion}</span>
          </div>

          <div class="flex items-center justify-center gap-3 py-1.5 bg-surface rounded-sm border border-border">
            <!-- Button A -->
            <button
              type="button"
              onclick={() => handleMicrobitButtonPress('A')}
              class="w-6 h-6 bg-surface-subtle hover:bg-surface active:scale-95 border border-border rounded-sm flex items-center justify-center text-xs font-mono font-bold text-ink shadow-2xs transition-micro"
              title="Press Button A"
            >
              A
            </button>

            <!-- 5x5 LED Grid -->
            <div class="p-1 bg-canvas border border-border rounded-sm grid grid-cols-5 gap-0.5 shadow-inner">
              {#each activeMicrobitGrid as row}
                {#each row as pixel}
                  <div
                    class="w-2 h-2 rounded-xs transition-colors duration-150 {pixel === 1
                      ? 'bg-red-500 shadow-xs'
                      : 'bg-zinc-300 dark:bg-zinc-800'}"
                  ></div>
                {/each}
              {/each}
            </div>

            <!-- Button B -->
            <button
              type="button"
              onclick={() => handleMicrobitButtonPress('B')}
              class="w-6 h-6 bg-surface-subtle hover:bg-surface active:scale-95 border border-border rounded-sm flex items-center justify-center text-xs font-mono font-bold text-ink shadow-2xs transition-micro"
              title="Press Button B"
            >
              B
            </button>
          </div>

          <!-- Integrated Pins Bus -->
          <div class="flex items-center justify-between px-2 py-0.5 bg-surface border border-border rounded-xs text-[10px]">
            <span class="text-ink-muted text-[9px] uppercase tracking-wider">Edge Connector:</span>
            <div class="flex items-center gap-2 font-mono font-bold">
              <span class="text-amber-600 dark:text-amber-400">P0</span>
              <span class="text-amber-600 dark:text-amber-400">P1</span>
              <span class="text-amber-600 dark:text-amber-400">P2</span>
              <span class="text-amber-600 dark:text-amber-400 font-semibold">3V</span>
              <span class="text-ink-muted">GND</span>
            </div>
          </div>
        </div>

        <!-- Firmware Flashing Console Card -->
        <div class="p-2 border border-border bg-surface-subtle rounded-sm flex flex-col gap-1.5 shadow-2xs">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-ink text-[11px] flex items-center gap-1.5">
              <Cpu class="size-3 text-cyan" />
              Firmware Flasher
            </span>
            <span class="text-[9px] font-mono text-ink-muted">{targetHardware === 'esp32' ? 'MicroPython .py' : 'UF2 / .py'}</span>
          </div>
          {#if isFlashing}
            <div class="w-full bg-surface h-1.5 rounded-xs overflow-hidden border border-border">
              <div class="bg-brand h-full transition-all duration-200" style="width: {flashProgress}%;"></div>
            </div>
          {/if}
          <button
            onclick={flashToDevice}
            disabled={isFlashing || isExecuting}
            class="w-full py-1 bg-brand hover:bg-brand/90 text-brand-foreground font-bold text-xs rounded-sm transition-micro disabled:opacity-50 shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Cpu class="size-3" />
            <span>{isFlashing ? `Flashing ${flashProgress}%...` : `Flash Firmware to ${targetHardware === 'esp32' ? 'ESP32' : 'micro:bit'}`}</span>
          </button>
        </div>
      </div>

      <!-- TAB 4: WAY 2.1 Mission Guidance Drawer & PRIMM Stepper -->
      <div class={auxiliaryTab === 'guidance' ? 'flex-1 min-h-0 flex flex-col relative' : 'hidden'}>
        <MissionGuidanceDrawer
          {activeMissionId}
          {currentEvaluation}
          roverState={{
            x: roverX,
            y: roverY,
            heading: roverHeading,
            distance: roverDistance,
            hasCollided: false,
            batteryLevel,
            samplesCollected
          }}
          isVerifying={isSubmittingEvidence}
          {verificationResult}
          bind:showMentorModal
          onVerify={submitMissionForVerification}
          onSelectMission={selectMission}
          onResetWorkspace={resetMissionWorkspace}
        />
      </div>
    </div>

    <!-- Scratch Import / Evidence Verification Toast Notification -->
    {#if scratchToast}
      <div class="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-surface border border-mint text-mint text-xs font-mono shadow-md z-30 flex items-center gap-2 rounded-sm animate-in fade-in-0 slide-in-from-top-2 duration-150">
        <CheckCircle2 class="size-3.5" />
        <span>{scratchToast}</span>
      </div>
    {/if}

    <!-- Modular Extension Studio Sheet (Slide-in Right Sheet, Nordic Lagom) -->
    {#if showExtensionDrawer}
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 animate-in fade-in-0 duration-150"
        onclick={() => (showExtensionDrawer = false)}
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === 'Escape') showExtensionDrawer = false; }}
      ></div>

      <!-- Sheet Container -->
      <div
        class="fixed inset-y-0 right-0 w-full sm:w-104 bg-surface border-l border-border shadow-2xl z-50 flex flex-col font-sans animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-label="Modular Extension Studio"
      >
        <!-- Header -->
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-brand/10 text-brand rounded-sm">
              <Layers class="size-4" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-ink">Extension Studio</span>
              <span class="text-[11px] text-ink-muted font-mono">{activeExtensionIds.length} of {EXTENSION_PACKS.length} enabled</span>
            </div>
          </div>
          <button
            onclick={() => (showExtensionDrawer = false)}
            class="p-1.5 rounded-sm hover:bg-surface text-ink-muted hover:text-ink transition-micro"
            aria-label="Close Extension Studio"
          >
            <X class="size-4" />
          </button>
        </div>

        <!-- Search & Domain Filter Bar -->
        <div class="p-3 border-b border-border bg-surface flex flex-col gap-2 shrink-0">
          <div class="relative">
            <Search class="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search extension packs & tools..."
              bind:value={extensionSearchQuery}
              class="w-full pl-8 pr-3 py-1.5 text-xs bg-surface-subtle border border-border rounded-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-brand font-mono"
            />
          </div>

          <!-- Domain Filter Chips -->
          <div class="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] font-mono">
            <button
              onclick={() => (extensionCategoryFilter = 'all')}
              class="px-2 py-0.5 rounded-xs transition-micro {extensionCategoryFilter === 'all' ? 'bg-brand text-brand-foreground font-bold' : 'bg-surface-subtle text-ink-muted hover:text-ink'}"
            >
              All
            </button>
            <button
              onclick={() => (extensionCategoryFilter = 'enabled')}
              class="px-2 py-0.5 rounded-xs transition-micro {extensionCategoryFilter === 'enabled' ? 'bg-brand text-brand-foreground font-bold' : 'bg-surface-subtle text-ink-muted hover:text-ink'}"
            >
              Enabled ({activeExtensionIds.length})
            </button>
            <button
              onclick={() => (extensionCategoryFilter = 'astro')}
              class="px-2 py-0.5 rounded-xs transition-micro {extensionCategoryFilter === 'astro' ? 'bg-brand text-brand-foreground font-bold' : 'bg-surface-subtle text-ink-muted hover:text-ink'}"
            >
              Robotics
            </button>
            <button
              onclick={() => (extensionCategoryFilter = 'audio')}
              class="px-2 py-0.5 rounded-xs transition-micro {extensionCategoryFilter === 'audio' ? 'bg-brand text-brand-foreground font-bold' : 'bg-surface-subtle text-ink-muted hover:text-ink'}"
            >
              Audio
            </button>
            <button
              onclick={() => (extensionCategoryFilter = 'mesh')}
              class="px-2 py-0.5 rounded-xs transition-micro {extensionCategoryFilter === 'mesh' ? 'bg-brand text-brand-foreground font-bold' : 'bg-surface-subtle text-ink-muted hover:text-ink'}"
            >
              Hardware
            </button>
          </div>
        </div>

        <!-- Extension Cards Canonical List -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          {#if filteredExtensionPacks.length === 0}
            <div class="text-center py-8 text-xs text-ink-muted font-mono">
              No matching extension packs found.
            </div>
          {/if}
          {#each filteredExtensionPacks as pack}
            <div class="border border-border p-3 rounded-sm flex flex-col gap-2 bg-surface hover:border-ink-muted transition-micro shadow-2xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="size-2.5 rounded-xs shrink-0" style="background-color: {pack.categoryColor};"></span>
                  <span class="text-xs font-bold text-ink">{pack.name}</span>
                </div>
                <span class="px-1.5 py-0.5 text-[9px] font-mono border border-border text-ink-muted bg-surface-subtle rounded-xs">
                  {pack.badge}
                </span>
              </div>

              <p class="text-[11px] text-ink-secondary leading-relaxed font-sans">{pack.description}</p>

              <div class="flex items-center justify-between pt-2 border-t border-border/60">
                <span class="text-[10px] font-mono text-ink-muted">{pack.blocks.length} blocks included</span>
                <button
                  onclick={() => toggleExtension(pack.id)}
                  class="px-3 py-1 text-xs font-mono rounded-sm transition-micro flex items-center gap-1.5 {activeExtensionIds.includes(pack.id)
                    ? 'bg-mint/15 text-mint border border-mint/40 font-bold'
                    : 'bg-surface border border-border text-ink-secondary hover:text-ink hover:bg-surface-subtle'}"
                >
                  {#if activeExtensionIds.includes(pack.id)}
                    <span>Enabled ✓</span>
                  {:else}
                    <span>+ Enable</span>
                  {/if}
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Competency Evidence Drawer (WAY 2.1 Quiet Intelligence) -->
    {#if showCompetencyDrawer && currentEvaluation}
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 animate-in fade-in-0 duration-150"
        onclick={() => (showCompetencyDrawer = false)}
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === 'Escape') showCompetencyDrawer = false; }}
      ></div>

      <div class="fixed inset-y-0 right-0 w-full sm:w-104 bg-surface border-l border-border shadow-2xl z-50 flex flex-col font-sans animate-in slide-in-from-right duration-200">
        <div class="p-4 border-b border-border bg-surface-subtle flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <div class="p-1.5 bg-mint/10 text-mint rounded-sm">
              <ShieldCheck class="size-4 text-mint" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-ink">Competency Evidence</span>
              <span class="text-[11px] text-mint font-mono font-bold">{currentEvaluation.developmentalBand}</span>
            </div>
          </div>
          <button onclick={() => (showCompetencyDrawer = false)} class="p-1.5 rounded-sm hover:bg-surface text-ink-muted hover:text-ink transition-micro">
            <X class="size-4" />
          </button>
        </div>
        <div class="p-3 border-b border-border bg-surface-subtle/50 text-[11px] text-ink-muted font-mono">
          Evaluated across {currentEvaluation.totalBlocks} active AST block nodes.
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          {#each currentEvaluation.activeDimensions as dim}
            <div class="border border-border p-3 rounded-sm bg-surface flex flex-col gap-1.5 shadow-2xs">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-ink">{dim.title}</span>
                <span class="px-1.5 py-0.5 text-[9px] font-mono uppercase font-bold rounded-xs {dim.level === 'established' ? 'text-mint bg-mint/10 border border-mint/30' : dim.level === 'developing' ? 'text-brand bg-brand/10 border border-brand/30' : 'text-ink-muted bg-surface-subtle border border-border'}">
                  {dim.level}
                </span>
              </div>
              <p class="text-[11px] text-ink-secondary leading-relaxed font-sans">{dim.description}</p>
              {#if dim.evidenceItems.length > 0}
                <div class="mt-1 pt-1.5 border-t border-border/50 flex flex-col gap-1">
                  {#each dim.evidenceItems as item}
                    <span class="text-[10px] font-mono text-ink-secondary flex items-center gap-1.5">
                      <span class="size-1 rounded-none bg-mint"></span>
                      {item}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}

  </div>
</div>



<!-- Socratic Voice Mentor Modal Dialog (Global Viewport Overlay: z-100, unclipped by IDE toolbar) -->
{#if showMentorModal}
  <div
    class="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-150 font-sans"
    role="dialog"
    aria-modal="true"
    aria-label="Socratic Voice Mentor"
    tabindex="-1"
    onkeydown={(e) => { if (e.key === 'Escape') showMentorModal = false; }}
  >
    <!-- Accessible backdrop click dismiss layer -->
    <button
      type="button"
      class="fixed inset-0 bg-transparent -z-10 cursor-default"
      onclick={() => (showMentorModal = false)}
      tabindex="-1"
      aria-label="Dismiss Socratic Mentor dialog"
    ></button>

    <div class="w-full max-w-xl bg-surface border border-border shadow-2xl rounded-md flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150 relative z-10">
      <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0">
        <div class="flex items-center gap-2">
          <Bot class="size-4 text-accent-indigo" />
          <h3 class="text-sm font-semibold text-ink">
            Socratic Mentor · {activeMissionMeta.title}
          </h3>
        </div>
        <button
          onclick={() => (showMentorModal = false)}
          class="p-1 rounded-xs text-ink-muted hover:text-ink hover:bg-surface-subtle transition-micro"
          aria-label="Close dialog"
        >
          ✕
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 min-h-95">
        <SocraticVoiceMentor
          initialTopic={`Mission ${STEM_MISSIONS[activeMissionId]?.level || 1}: ${activeMissionMeta.title} (${STEM_MISSIONS[activeMissionId]?.cstaStandard || 'CSTA Standard'})`}
        />
      </div>
    </div>
  </div>
{/if}

<!-- Mission Briefing & PRIMM Guide Modal Dialog -->
{#if showMissionDialog}
  {@const currentStemMission = STEM_MISSIONS[activeMissionId]}
  <div
    class="fixed inset-0 z-100 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-0 duration-150 font-sans"
    role="dialog"
    aria-modal="true"
    aria-label="Mission Briefing & PRIMM Guide"
    tabindex="-1"
    onkeydown={(e) => { if (e.key === 'Escape') showMissionDialog = false; }}
  >
    <!-- Accessible backdrop click dismiss layer -->
    <button
      type="button"
      class="fixed inset-0 bg-transparent -z-10 cursor-default"
      onclick={() => (showMissionDialog = false)}
      tabindex="-1"
      aria-label="Dismiss mission dialog"
    ></button>

    <div class="w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-md flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-150 relative z-10">
      <!-- Dialog Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-border bg-surface shrink-0">
        <div class="flex items-center gap-2 min-w-0">
          <span class="text-2xl shrink-0">{activeMissionMeta.icon}</span>
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="text-sm font-bold text-ink truncate">
                {activeMissionMeta.title}
              </h3>
              <span class="text-[10px] font-mono px-1.5 py-0.5 bg-surface-subtle border border-border rounded-xs text-ink-muted shrink-0">
                Level {currentStemMission?.level || 1}
              </span>
              {#if currentStemMission?.stage}
                <span class="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-brand/10 border border-brand/30 text-brand rounded-xs shrink-0">
                  {currentStemMission.stage}
                </span>
              {/if}
            </div>
            {#if currentStemMission?.cstaStandard}
              <p class="text-[10px] font-mono text-ink-muted truncate mt-0.5">
                {currentStemMission.cstaStandard}
              </p>
            {/if}
          </div>
        </div>
        <button
          type="button"
          onclick={() => (showMissionDialog = false)}
          class="p-1 rounded-xs text-ink-muted hover:text-ink hover:bg-surface-subtle transition-micro"
          aria-label="Close dialog"
        >
          <X class="size-4" />
        </button>
      </div>

      <!-- Dialog Body -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-ink">
        <!-- Objective & Pedagogical Context -->
        <div class="p-3 bg-surface-subtle border border-border rounded-sm space-y-1.5">
          <span class="text-[10px] font-mono uppercase tracking-wider text-cyan font-bold">Mission Objective</span>
          <p class="text-xs leading-relaxed text-ink font-medium">
            {currentStemMission?.objective || activeMissionMeta.desc}
          </p>
          {#if currentStemMission?.context}
            <p class="text-[11px] leading-relaxed text-ink-muted">
              {currentStemMission.context}
            </p>
          {/if}
        </div>

        <!-- PRIMM Progression Checklist -->
        {#if currentStemMission?.primmSteps && currentStemMission.primmSteps.length > 0}
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold">PRIMM Pedagogy Checklist</span>
              <span class="text-[10px] font-mono text-ink-muted">Predict → Run → Investigate → Modify → Make</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {#each currentStemMission.primmSteps as step}
                <div class="p-2 bg-surface border border-border rounded-sm space-y-1">
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="font-bold font-mono text-brand">{step.phase}</span>
                    <span class="text-ink-muted font-mono">{step.badge}</span>
                  </div>
                  <p class="text-[11px] font-semibold text-ink">{step.title}</p>
                  <p class="text-[10px] text-ink-muted leading-normal">{step.instruction}</p>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Scoring Rubric Criteria -->
        {#if currentStemMission?.rubric && currentStemMission.rubric.length > 0}
          <div class="space-y-2">
            <span class="text-[10px] font-mono uppercase tracking-wider text-mint font-bold">Scoring Rubric Criteria</span>
            <div class="space-y-1.5">
              {#each currentStemMission.rubric as item}
                <div class="flex items-start justify-between p-2 bg-surface border border-border rounded-sm text-[11px] gap-2">
                  <div>
                    <span class="font-semibold text-ink">{item.label}</span>
                    <p class="text-[10px] text-ink-muted mt-0.5">{item.description}</p>
                  </div>
                  <span class="font-mono text-mint font-bold shrink-0">+{item.points} pts</span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>

      <!-- Dialog Footer -->
      <div class="px-4 py-2 border-t border-border bg-surface-subtle flex items-center justify-between shrink-0">
        <button
          type="button"
          onclick={() => {
            showMissionDialog = false;
            auxiliaryTab = 'guidance';
          }}
          class="px-2 py-1 text-xs font-mono text-ink-muted hover:text-ink hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>Open Full Guidance Panel</span>
          <ChevronRight class="size-3" />
        </button>
        <button
          type="button"
          onclick={() => (showMissionDialog = false)}
          class="px-4 py-1.5 text-xs font-medium rounded-xs bg-ink text-surface hover:opacity-90 transition-micro cursor-pointer font-sans"
        >
          Return to Arena
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  /* stylelint-disable selector-class-pattern */

  /* ============================================================
     CREED OS · Theme-Adaptive Blockly Styling Engine
     Guarantees 100% Color Scheme Consistency in Light & Dark Mode
     ============================================================ */

  /* 1. Global Workspace & Canvas (Dark Theme) */
  :global(.dark) :global(.blocklySvg),
  :global([data-theme="dark"]) :global(.blocklySvg) {
    background-color: #0c1017 !important;
  }

  :global(.dark) :global(.blocklyMainBackground),
  :global([data-theme="dark"]) :global(.blocklyMainBackground) {
    fill: #0c1017 !important;
  }

  /* 2. Global Workspace & Canvas (Light Theme) */
  :global(html.light) :global(.blocklySvg),
  :global([data-theme="light"]) :global(.blocklySvg),
  :global(html:not(.dark)) :global(.blocklySvg) {
    background-color: #fff !important;
  }

  :global(html.light) :global(.blocklyMainBackground),
  :global([data-theme="light"]) :global(.blocklyMainBackground),
  :global(html:not(.dark)) :global(.blocklyMainBackground) {
    fill: #fff !important;
  }

  /* 3. Grid Pattern Dots & Lines */
  :global(.dark) :global(.blocklyGridPattern line),
  :global(.dark) :global(.blocklyGridPattern circle),
  :global([data-theme="dark"]) :global(.blocklyGridPattern line),
  :global([data-theme="dark"]) :global(.blocklyGridPattern circle) {
    stroke: rgb(255 255 255 / 0.12) !important;
    fill: rgb(255 255 255 / 0.12) !important;
  }

  :global(html.light) :global(.blocklyGridPattern line),
  :global(html.light) :global(.blocklyGridPattern circle),
  :global([data-theme="light"]) :global(.blocklyGridPattern line),
  :global([data-theme="light"]) :global(.blocklyGridPattern circle),
  :global(html:not(.dark)) :global(.blocklyGridPattern line),
  :global(html:not(.dark)) :global(.blocklyGridPattern circle) {
    stroke: rgb(15 23 42 / 0.14) !important;
    fill: rgb(15 23 42 / 0.14) !important;
  }

  /* 4. Toolbox Sidebar (Dark Theme) */
  :global(.dark) :global(.blocklyToolbox),
  :global(.dark) :global(.blocklyToolboxDiv),
  :global(.dark) :global(.blocklyToolboxContents),
  :global([data-theme="dark"]) :global(.blocklyToolbox),
  :global([data-theme="dark"]) :global(.blocklyToolboxDiv),
  :global([data-theme="dark"]) :global(.blocklyToolboxContents) {
    background-color: #111622 !important;
    border-right: 1px solid rgb(255 255 255 / 0.08) !important;
    color: #e2e8f0 !important;
    scrollbar-width: thin !important;
    scrollbar-color: rgb(255 255 255 / 0.16) transparent !important;
    padding-bottom: 32px !important;
    min-width: 155px !important;
  }

  :global(.dark) :global(.blocklyToolboxDiv::-webkit-scrollbar),
  :global([data-theme="dark"]) :global(.blocklyToolboxDiv::-webkit-scrollbar) {
    width: 4px !important;
  }

  :global(.dark) :global(.blocklyToolboxDiv::-webkit-scrollbar-thumb),
  :global([data-theme="dark"]) :global(.blocklyToolboxDiv::-webkit-scrollbar-thumb) {
    background-color: rgb(255 255 255 / 0.16) !important;
    border-radius: 4px !important;
  }

  :global(.dark) :global(.blocklyToolboxCategory),
  :global(.dark) :global(.blocklyTreeRow),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory),
  :global([data-theme="dark"]) :global(.blocklyTreeRow) {
    background-color: transparent !important;
    color: #cbd5e1 !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    border-radius: 0 !important;
    transition: background-color 140ms ease, color 140ms ease !important;
  }

  :global(.dark) :global(.blocklyToolboxCategoryLabel),
  :global(.dark) :global(.blocklyTreeLabel),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="dark"]) :global(.blocklyTreeLabel) {
    color: #cbd5e1 !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-size: 11px !important;
    font-weight: 600 !important;
  }

  :global(.dark) :global(.blocklyToolboxCategory:hover),
  :global(.dark) :global(.blocklyTreeRow:hover),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory:hover),
  :global([data-theme="dark"]) :global(.blocklyTreeRow:hover) {
    background-color: #1c2436 !important;
    color: #fff !important;
  }

  :global(.dark) :global(.blocklyToolboxCategory:hover) :global(.blocklyToolboxCategoryLabel),
  :global(.dark) :global(.blocklyTreeRow:hover) :global(.blocklyTreeLabel),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory:hover) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="dark"]) :global(.blocklyTreeRow:hover) :global(.blocklyTreeLabel) {
    color: #fff !important;
  }

  :global(.dark) :global(.blocklyToolboxCategory.blocklyTreeSelected),
  :global(.dark) :global(.blocklyToolboxCategory.blocklyToolboxSelected),
  :global(.dark) :global(.blocklyTreeSelected),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory.blocklyTreeSelected),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory.blocklyToolboxSelected),
  :global([data-theme="dark"]) :global(.blocklyTreeSelected) {
    background-color: rgb(6 182 212 / 0.15) !important;
    border-left: 3px solid #06b6d4 !important;
  }

  :global(.dark) :global(.blocklyToolboxCategory.blocklyTreeSelected) :global(.blocklyToolboxCategoryLabel),
  :global(.dark) :global(.blocklyToolboxCategory.blocklyToolboxSelected) :global(.blocklyToolboxCategoryLabel),
  :global(.dark) :global(.blocklyTreeSelected) :global(.blocklyTreeLabel),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory.blocklyTreeSelected) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="dark"]) :global(.blocklyToolboxCategory.blocklyToolboxSelected) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="dark"]) :global(.blocklyTreeSelected) :global(.blocklyTreeLabel) {
    color: #38bdf8 !important;
    font-weight: 700 !important;
  }

  /* 5. Toolbox Sidebar (Light Theme) */
  :global(html.light) :global(.blocklyToolbox),
  :global(html.light) :global(.blocklyToolboxDiv),
  :global(html.light) :global(.blocklyToolboxContents),
  :global([data-theme="light"]) :global(.blocklyToolbox),
  :global([data-theme="light"]) :global(.blocklyToolboxDiv),
  :global([data-theme="light"]) :global(.blocklyToolboxContents),
  :global(html:not(.dark)) :global(.blocklyToolbox),
  :global(html:not(.dark)) :global(.blocklyToolboxDiv),
  :global(html:not(.dark)) :global(.blocklyToolboxContents) {
    background-color: #f8fafc !important;
    border-right: 1px solid #e2e8f0 !important;
    color: #1e293b !important;
    scrollbar-width: thin !important;
    scrollbar-color: #cbd5e1 transparent !important;
    padding-bottom: 32px !important;
    min-width: 155px !important;
  }

  :global(html.light) :global(.blocklyToolboxDiv::-webkit-scrollbar),
  :global([data-theme="light"]) :global(.blocklyToolboxDiv::-webkit-scrollbar),
  :global(html:not(.dark)) :global(.blocklyToolboxDiv::-webkit-scrollbar) {
    width: 4px !important;
  }

  :global(html.light) :global(.blocklyToolboxDiv::-webkit-scrollbar-thumb),
  :global([data-theme="light"]) :global(.blocklyToolboxDiv::-webkit-scrollbar-thumb),
  :global(html:not(.dark)) :global(.blocklyToolboxDiv::-webkit-scrollbar-thumb) {
    background-color: #cbd5e1 !important;
    border-radius: 4px !important;
  }

  /* Blockly SVG Scrollbars */
  :global(.blocklyScrollbarVertical),
  :global(.blocklyScrollbarHorizontal) {
    opacity: 0.3 !important;
    transition: opacity 140ms ease !important;
  }

  :global(.blocklyScrollbarVertical:hover),
  :global(.blocklyScrollbarHorizontal:hover) {
    opacity: 0.8 !important;
  }

  :global(.blocklyScrollbarHandle) {
    rx: 3px !important;
    ry: 3px !important;
  }

  :global(.blocklyScrollbarBackground) {
    fill: transparent !important;
  }

  :global(html.light) :global(.blocklyToolboxCategory),
  :global(html.light) :global(.blocklyTreeRow),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory),
  :global([data-theme="light"]) :global(.blocklyTreeRow),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory),
  :global(html:not(.dark)) :global(.blocklyTreeRow) {
    background-color: transparent !important;
    color: #334155 !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    border-radius: 0 !important;
    transition: background-color 140ms ease, color 140ms ease !important;
  }

  :global(html.light) :global(.blocklyToolboxCategoryLabel),
  :global(html.light) :global(.blocklyTreeLabel),
  :global([data-theme="light"]) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="light"]) :global(.blocklyTreeLabel),
  :global(html:not(.dark)) :global(.blocklyToolboxCategoryLabel),
  :global(html:not(.dark)) :global(.blocklyTreeLabel) {
    color: #334155 !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-size: 11px !important;
    font-weight: 600 !important;
  }

  :global(html.light) :global(.blocklyToolboxCategory:hover),
  :global(html.light) :global(.blocklyTreeRow:hover),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory:hover),
  :global([data-theme="light"]) :global(.blocklyTreeRow:hover),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory:hover),
  :global(html:not(.dark)) :global(.blocklyTreeRow:hover) {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
  }

  :global(html.light) :global(.blocklyToolboxCategory:hover) :global(.blocklyToolboxCategoryLabel),
  :global(html.light) :global(.blocklyTreeRow:hover) :global(.blocklyTreeLabel),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory:hover) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="light"]) :global(.blocklyTreeRow:hover) :global(.blocklyTreeLabel),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory:hover) :global(.blocklyToolboxCategoryLabel),
  :global(html:not(.dark)) :global(.blocklyTreeRow:hover) :global(.blocklyTreeLabel) {
    color: #0f172a !important;
  }

  :global(html.light) :global(.blocklyToolboxCategory.blocklyTreeSelected),
  :global(html.light) :global(.blocklyToolboxCategory.blocklyToolboxSelected),
  :global(html.light) :global(.blocklyTreeSelected),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory.blocklyTreeSelected),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory.blocklyToolboxSelected),
  :global([data-theme="light"]) :global(.blocklyTreeSelected),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory.blocklyTreeSelected),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory.blocklyToolboxSelected),
  :global(html:not(.dark)) :global(.blocklyTreeSelected) {
    background-color: rgb(2 132 199 / 0.12) !important;
    border-left: 3px solid #0284c7 !important;
  }

  :global(html.light) :global(.blocklyToolboxCategory.blocklyTreeSelected) :global(.blocklyToolboxCategoryLabel),
  :global(html.light) :global(.blocklyToolboxCategory.blocklyToolboxSelected) :global(.blocklyToolboxCategoryLabel),
  :global(html.light) :global(.blocklyTreeSelected) :global(.blocklyTreeLabel),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory.blocklyTreeSelected) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="light"]) :global(.blocklyToolboxCategory.blocklyToolboxSelected) :global(.blocklyToolboxCategoryLabel),
  :global([data-theme="light"]) :global(.blocklyTreeSelected) :global(.blocklyTreeLabel),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory.blocklyTreeSelected) :global(.blocklyToolboxCategoryLabel),
  :global(html:not(.dark)) :global(.blocklyToolboxCategory.blocklyToolboxSelected) :global(.blocklyToolboxCategoryLabel),
  :global(html:not(.dark)) :global(.blocklyTreeSelected) :global(.blocklyTreeLabel) {
    color: #0284c7 !important;
    font-weight: 700 !important;
  }

  /* 6. Flyout Palette Background */
  :global(.dark) :global(.blocklyFlyoutBackground),
  :global([data-theme="dark"]) :global(.blocklyFlyoutBackground) {
    fill: #141a29 !important;
    fill-opacity: 0.96 !important;
  }

  :global(html.light) :global(.blocklyFlyoutBackground),
  :global([data-theme="light"]) :global(.blocklyFlyoutBackground),
  :global(html:not(.dark)) :global(.blocklyFlyoutBackground) {
    fill: #f1f5f9 !important;
    fill-opacity: 0.98 !important;
  }

  /* 7. Dropdowns, Menus & Tooltips */
  :global(.dark) :global(.blocklyDropDownDiv),
  :global(.dark) :global(.blocklyWidgetDiv .blocklyContextMenu),
  :global([data-theme="dark"]) :global(.blocklyDropDownDiv),
  :global([data-theme="dark"]) :global(.blocklyWidgetDiv .blocklyContextMenu) {
    background-color: #182030 !important;
    border: 1px solid rgb(255 255 255 / 0.12) !important;
    color: #f1f5f9 !important;
    border-radius: 4px !important;
    box-shadow: 0 8px 32px rgb(0 0 0 / 0.5) !important;
    padding: 4px 0 !important;
  }

  :global(.dark) :global(.blocklyMenu),
  :global([data-theme="dark"]) :global(.blocklyMenu) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }

  :global(.dark) :global(.blocklyMenuItem),
  :global([data-theme="dark"]) :global(.blocklyMenuItem) {
    color: #f1f5f9 !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    padding: 6px 14px !important;
    cursor: pointer !important;
    transition: background-color 140ms ease !important;
  }

  :global(.dark) :global(.blocklyMenuItemContent),
  :global([data-theme="dark"]) :global(.blocklyMenuItemContent) {
    color: #f1f5f9 !important;
    font-family: inherit !important;
  }

  :global(.dark) :global(.blocklyMenuItem:hover),
  :global(.dark) :global(.blocklyMenuItemHighlight),
  :global([data-theme="dark"]) :global(.blocklyMenuItem:hover),
  :global([data-theme="dark"]) :global(.blocklyMenuItemHighlight) {
    background-color: rgb(255 255 255 / 0.08) !important;
    color: #fff !important;
  }

  :global(.dark) :global(.blocklyMenuItemCheckbox),
  :global([data-theme="dark"]) :global(.blocklyMenuItemCheckbox) {
    color: var(--mint, #5B50E6) !important;
  }

  :global(html.light) :global(.blocklyDropDownDiv),
  :global(html.light) :global(.blocklyWidgetDiv .blocklyContextMenu),
  :global([data-theme="light"]) :global(.blocklyDropDownDiv),
  :global([data-theme="light"]) :global(.blocklyWidgetDiv .blocklyContextMenu),
  :global(html:not(.dark)) :global(.blocklyDropDownDiv),
  :global(html:not(.dark)) :global(.blocklyWidgetDiv .blocklyContextMenu) {
    background-color: #fff !important;
    border: 1px solid #cbd5e1 !important;
    color: #0f172a !important;
    border-radius: 4px !important;
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.12) !important;
    padding: 4px 0 !important;
  }

  :global(html.light) :global(.blocklyMenu),
  :global([data-theme="light"]) :global(.blocklyMenu),
  :global(html:not(.dark)) :global(.blocklyMenu) {
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
  }

  :global(html.light) :global(.blocklyMenuItem),
  :global([data-theme="light"]) :global(.blocklyMenuItem),
  :global(html:not(.dark)) :global(.blocklyMenuItem) {
    color: #0f172a !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-size: 11px !important;
    font-weight: 500 !important;
    padding: 6px 14px !important;
    cursor: pointer !important;
    transition: background-color 140ms ease !important;
  }

  :global(html.light) :global(.blocklyMenuItemContent),
  :global([data-theme="light"]) :global(.blocklyMenuItemContent),
  :global(html:not(.dark)) :global(.blocklyMenuItemContent) {
    color: #0f172a !important;
    font-family: inherit !important;
  }

  :global(html.light) :global(.blocklyMenuItem:hover),
  :global(html.light) :global(.blocklyMenuItemHighlight),
  :global([data-theme="light"]) :global(.blocklyMenuItem:hover),
  :global([data-theme="light"]) :global(.blocklyMenuItemHighlight),
  :global(html:not(.dark)) :global(.blocklyMenuItem:hover),
  :global(html:not(.dark)) :global(.blocklyMenuItemHighlight) {
    background-color: #f1f5f9 !important;
    color: #0f172a !important;
  }

  :global(html.light) :global(.blocklyMenuItemCheckbox),
  :global([data-theme="light"]) :global(.blocklyMenuItemCheckbox),
  :global(html:not(.dark)) :global(.blocklyMenuItemCheckbox) {
    color: #0f172a !important;
  }

  :global(.blocklyTooltipDiv) {
    background-color: #1e293b !important;
    border: 1px solid rgb(255 255 255 / 0.15) !important;
    color: #fff !important;
    font-family: var(--font-mono), monospace !important;
    font-size: 10px !important;
    padding: 4px 8px !important;
    border-radius: 0 !important;
  }

  /* 8. Separators */
  :global(.blocklyTreeSeparator) {
    border-bottom: 1px solid var(--border-subtle) !important;
    height: 0 !important;
    margin: 6px 8px !important;
  }

  /* 9. Scrollbar & Controls Clean Suppressions */
  :global(.blocklyScrollbarVertical),
  :global(.blocklyScrollbarHorizontal),
  :global(.blocklyFlyoutScrollbar),
  :global(.blocklyScrollbarHandle),
  :global(.blocklyScrollbarBackground),
  :global(.blocklyTrash),
  :global(.blocklyZoom) {
    display: none !important;
    opacity: 0 !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }

  /* 10. Compact Flyout Typography & Proportions */
  :global(.blocklyFlyout text),
  :global(.blocklyFlyout .blocklyText) {
    font-size: 10.5px !important;
    font-family: var(--font-sans), system-ui, sans-serif !important;
    font-weight: 600 !important;
  }

  :global(.blocklyText) {
    font-family: var(--font-sans), system-ui, sans-serif !important;
  }

  /* stylelint-enable selector-class-pattern */
</style>
