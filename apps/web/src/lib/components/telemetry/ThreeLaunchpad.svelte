<!-- apps/web/src/lib/components/telemetry/ThreeLaunchpad.svelte -->
<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { gsap } from 'gsap';
  import {
    Globe,
    ShieldCheck,
    TerminalSquare,
    ArrowUpRight,
    Play,
    Pause,
    RotateCcw,
    Layers,
    Activity,
    Compass,
    Radio,
    Sparkles
  } from 'lucide-svelte';

  // Props
  interface Props {
    activePortal?: 'globe' | 'sandbox' | 'ide' | null;
    compact?: boolean;
    class?: string;
  }

  let {
    activePortal = null,
    compact = false,
    class: className = ''
  }: Props = $props();

  // DOM Container
  let canvasContainer: HTMLDivElement | null = $state(null);
  let canvasEl: HTMLCanvasElement | null = $state(null);

  // Interaction State
  let hoveredKey = $state<'globe' | 'sandbox' | 'ide' | null>(null);
  let isAutoRotating = $state(true);
  let fps = $state(60);
  let currentYaw = $state(0);
  let currentPitch = $state(0);
  let telemetryEpoch = $state(new Date().toISOString().substring(11, 19));

  // Three.js internal references
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let animFrameId: number | null = null;
  let resizeObserver: ResizeObserver | null = null;

  // 3D Objects
  let mainGroup: THREE.Group | null = null;
  let globeGroup: THREE.Group | null = null;
  let orbitLineGlobe: THREE.Line | null = null;
  let orbitLineSandbox: THREE.Line | null = null;
  let orbitLineIde: THREE.Line | null = null;
  let satGlobe: THREE.Group | null = null;
  let satSandbox: THREE.Group | null = null;
  let satIde: THREE.Group | null = null;
  let satBeacons: THREE.Mesh[] = [];

  // Mouse kinematics
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  // Default camera position
  const DEFAULT_CAM_POS = { x: 0, y: 2.2, z: 7.2 };
  const DEFAULT_LOOK_AT = { x: 0, y: 0, z: 0 };
  let currentLookAt = { ...DEFAULT_LOOK_AT };

  // Destination Metadata Definition
  const PORTAL_ITEMS = [
    {
      key: 'globe' as const,
      title: 'Planetary Telemetry & Earth Observation Studio',
      shortTitle: 'Planetary Observatory',
      href: '/observatory',
      badge: 'CESIUM 1.146 · SGP4 KEPLERIAN',
      role: 'Full-screen 3D Cesium globe, live Keplerian SGP4 satellite orbits, aircraft transponders, optical/FLIR/NVG sensor modes, and STEM missions.',
      colorHex: 0x22d3ee, // Cyan
      colorClass: 'text-cyan',
      borderHoverClass: 'hover:border-cyan',
      bgSubtleClass: 'bg-cyan-subtle/30',
      tagColor: 'border-cyan/40 text-cyan',
      icon: Globe,
      orbitRadius: 3.0,
      inclinationDeg: 51.6
    },
    {
      key: 'sandbox' as const,
      title: 'Production Feature Sandbox',
      shortTitle: 'Production Feature Sandbox',
      href: '/sandbox',
      badge: 'SECTION 1–6 · CLEAN-ROOM SBOM',
      role: 'Features Section 6 "Architecture & Licenses" SBOM ledger, clean-room verification, CAT diagnostics, and top navigation link to Planetary Studio.',
      colorHex: 0x34d399, // Mint
      colorClass: 'text-mint',
      borderHoverClass: 'hover:border-mint',
      bgSubtleClass: 'bg-mint-subtle/30',
      tagColor: 'border-mint/40 text-mint',
      icon: ShieldCheck,
      orbitRadius: 3.7,
      inclinationDeg: 28.5
    },
    {
      key: 'ide' as const,
      title: 'Robotics IDE & Space Telemetry Blocks',
      shortTitle: 'Robotics IDE & Telemetry',
      href: '/ide',
      badge: 'WASM PYODIDE · WEB SERIAL/USB',
      role: 'Blockly visual programming with the new Space Telemetry extension pack and live hardware telemetry bridge for ESP32 and micro:bit.',
      colorHex: 0xfbbf24, // Amber
      colorClass: 'text-amber',
      borderHoverClass: 'hover:border-amber',
      bgSubtleClass: 'bg-yellow-subtle/30',
      tagColor: 'border-yellow/40 text-yellow',
      icon: TerminalSquare,
      orbitRadius: 4.4,
      inclinationDeg: 98.2
    }
  ];

  // Helper to construct parametric 3D circular orbit curve
  function createOrbitCurve(radius: number, inclinationDeg: number, segments = 128): THREE.BufferGeometry {
    const points: THREE.Vector3[] = [];
    const incRad = (inclinationDeg * Math.PI) / 180;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius * Math.sin(incRad);
      const z = Math.sin(theta) * radius * Math.cos(incRad);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }

  // Helper to create small angular satellite models
  function createSatelliteModel(type: 'globe' | 'sandbox' | 'ide', colorHex: number): THREE.Group {
    const group = new THREE.Group();

    if (type === 'globe') {
      // Cylindrical Earth observation body with solar wings
      const bodyGeo = new THREE.BoxGeometry(0.24, 0.16, 0.16);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.8,
        roughness: 0.2
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      group.add(body);

      // Solar Panels
      const wingGeo = new THREE.BoxGeometry(0.42, 0.02, 0.16);
      const wingMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.3,
        roughness: 0.1
      });
      const wingL = new THREE.Mesh(wingGeo, wingMat);
      wingL.position.x = -0.32;
      const wingR = new THREE.Mesh(wingGeo, wingMat);
      wingR.position.x = 0.32;
      group.add(wingL);
      group.add(wingR);

      // Optical Lens cone
      const lensGeo = new THREE.ConeGeometry(0.06, 0.12, 12);
      const lensMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const lens = new THREE.Mesh(lensGeo, lensMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.z = 0.12;
      group.add(lens);

    } else if (type === 'sandbox') {
      // Hexagonal Core Sensor satellite
      const coreGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 6);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        metalness: 0.7,
        roughness: 0.3
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.rotation.x = Math.PI / 4;
      group.add(core);

      // Protective Ring Shield
      const ringGeo = new THREE.RingGeometry(0.24, 0.28, 6);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 4;
      group.add(ring);

    } else {
      // Robotics Octahedron Relay satellite with antenna
      const octaGeo = new THREE.OctahedronGeometry(0.22, 0);
      const octaMat = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.85,
        roughness: 0.15
      });
      const octa = new THREE.Mesh(octaGeo, octaMat);
      group.add(octa);

      // Antenna Mast
      const mastGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8);
      const mastMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.y = 0.24;
      group.add(mast);

      // Telemetry Dish
      const dishGeo = new THREE.ConeGeometry(0.1, 0.08, 8);
      const dishMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        wireframe: true
      });
      const dish = new THREE.Mesh(dishGeo, dishMat);
      dish.position.y = 0.36;
      group.add(dish);
    }

    // Common Pulsing Beacon Marker
    const beaconGeo = new THREE.SphereGeometry(0.05, 12, 12);
    const beaconMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.95
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.userData = { type, baseColor: colorHex };
    group.add(beacon);
    satBeacons.push(beacon);

    group.userData = { type };
    return group;
  }

  // Initialize Three.js WebGL Scene
  function initThree() {
    if (!canvasContainer || !canvasEl) return;

    const width = canvasContainer.clientWidth;
    const height = canvasContainer.clientHeight || 360;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(DEFAULT_CAM_POS.x, DEFAULT_CAM_POS.y, DEFAULT_CAM_POS.z);
    camera.lookAt(DEFAULT_LOOK_AT.x, DEFAULT_LOOK_AT.y, DEFAULT_LOOK_AT.z);

    // Renderer (Antialiased + Alpha transparent)
    renderer = new THREE.WebGLRenderer({
      canvas: canvasEl,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting (Calibrated Ambient + Soft Directional Rim)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Master Group
    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Geodesic Earth Globe
    globeGroup = new THREE.Group();
    mainGroup.add(globeGroup);

    // Wireframe Icosahedron
    const icosaGeo = new THREE.IcosahedronGeometry(2.1, 2);
    const wireGeo = new THREE.WireframeGeometry(icosaGeo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x64748b,
      transparent: true,
      opacity: 0.38
    });
    const wireframeGlobe = new THREE.LineSegments(wireGeo, wireMat);
    globeGroup.add(wireframeGlobe);

    // Surface Vertex Dots (Constellation Points)
    const ptsGeo = new THREE.BufferGeometry();
    const posAttr = icosaGeo.attributes.position;
    ptsGeo.setAttribute('position', posAttr);
    const ptsMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.08,
      transparent: true,
      opacity: 0.75
    });
    const surfacePoints = new THREE.Points(ptsGeo, ptsMat);
    globeGroup.add(surfacePoints);

    // Equator Coordinate Ring
    const equatorGeo = createOrbitCurve(2.14, 0, 96);
    const equatorMat = new THREE.LineBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.5
    });
    const equatorLine = new THREE.Line(equatorGeo, equatorMat);
    globeGroup.add(equatorLine);

    // 2. Three Active Orbits & Satellites
    // Orbit 1: Planetary Studio (Cyan)
    const orbitGeo1 = createOrbitCurve(3.0, 51.6);
    const orbitMat1 = new THREE.LineBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.55
    });
    orbitLineGlobe = new THREE.Line(orbitGeo1, orbitMat1);
    mainGroup.add(orbitLineGlobe);

    satGlobe = createSatelliteModel('globe', 0x22d3ee);
    mainGroup.add(satGlobe);

    // Orbit 2: Production Feature Sandbox (Mint)
    const orbitGeo2 = createOrbitCurve(3.7, 28.5);
    const orbitMat2 = new THREE.LineBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.55
    });
    orbitLineSandbox = new THREE.Line(orbitGeo2, orbitMat2);
    mainGroup.add(orbitLineSandbox);

    satSandbox = createSatelliteModel('sandbox', 0x34d399);
    mainGroup.add(satSandbox);

    // Orbit 3: Robotics IDE (Amber Polar)
    const orbitGeo3 = createOrbitCurve(4.4, 98.2);
    const orbitMat3 = new THREE.LineBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.55
    });
    orbitLineIde = new THREE.Line(orbitGeo3, orbitMat3);
    mainGroup.add(orbitLineIde);

    satIde = createSatelliteModel('ide', 0xfbbf24);
    mainGroup.add(satIde);

    // 3. Ambient Star Field Particle Dust
    const starCount = 180;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 5.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.05,
      transparent: true,
      opacity: 0.4
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Setup Window Resize Observer
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        if (renderer && camera && w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(canvasContainer);

    // Start Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;

    const animate = (time: number) => {
      animFrameId = requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Track FPS
      frameCount++;
      fpsTimer += delta;
      if (fpsTimer >= 1.0) {
        fps = Math.round(frameCount / fpsTimer);
        frameCount = 0;
        fpsTimer = 0;
        telemetryEpoch = new Date().toISOString().substring(11, 19);
      }

      const tSec = time * 0.001;

      // Rotate central globe slowly
      if (globeGroup && isAutoRotating) {
        globeGroup.rotation.y += 0.0025;
      }

      // Propagate Satellites along Keplerian paths
      if (satGlobe) {
        const speed = 0.55;
        const r = 3.0;
        const inc = (51.6 * Math.PI) / 180;
        const angle = tSec * speed;
        satGlobe.position.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r * Math.sin(inc),
          Math.sin(angle) * r * Math.cos(inc)
        );
        satGlobe.rotation.y = angle + Math.PI / 2;
        satGlobe.rotation.z = Math.sin(angle * 2) * 0.1;
      }

      if (satSandbox) {
        const speed = 0.42;
        const r = 3.7;
        const inc = (28.5 * Math.PI) / 180;
        const angle = tSec * speed + 2.0;
        satSandbox.position.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r * Math.sin(inc),
          Math.sin(angle) * r * Math.cos(inc)
        );
        satSandbox.rotation.y = angle;
        satSandbox.rotation.x = Math.sin(angle) * 0.2;
      }

      if (satIde) {
        const speed = 0.35;
        const r = 4.4;
        const inc = (98.2 * Math.PI) / 180;
        const angle = tSec * speed + 4.2;
        satIde.position.set(
          Math.cos(angle) * r,
          Math.sin(angle) * r * Math.sin(inc),
          Math.sin(angle) * r * Math.cos(inc)
        );
        satIde.rotation.y = angle * 2;
      }

      // Pulse Beacons with sinusoidal wave
      const pulseScale = 1.0 + Math.sin(tSec * 4.0) * 0.25;
      for (const b of satBeacons) {
        b.scale.set(pulseScale, pulseScale, pulseScale);
      }

      // Interactive mouse parallax damping (Lagom Motion contract)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      if (mainGroup) {
        mainGroup.rotation.y = currentMouseX * 0.45;
        mainGroup.rotation.x = -currentMouseY * 0.35;
        currentYaw = Math.round(mainGroup.rotation.y * (180 / Math.PI) * 10) / 10;
        currentPitch = Math.round(mainGroup.rotation.x * (180 / Math.PI) * 10) / 10;
      }

      // LookAt target
      if (camera) {
        camera.lookAt(currentLookAt.x, currentLookAt.y, currentLookAt.z);
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animFrameId = requestAnimationFrame(animate);
  }

  // Handle Mouse Kinematics
  function handleMouseMove(e: MouseEvent) {
    if (!canvasContainer) return;
    const rect = canvasContainer.getBoundingClientRect();
    targetMouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  }

  function handleMouseLeave() {
    targetMouseX = 0;
    targetMouseY = 0;
  }

  // Handle Card Hover Focus via GSAP
  function focusOnPortal(key: 'globe' | 'sandbox' | 'ide' | null) {
    hoveredKey = key;
    if (!camera) return;

    if (key === 'globe') {
      // Focus near Cyan inclined orbit
      gsap.to(camera.position, {
        x: 2.2,
        y: 1.8,
        z: 4.8,
        duration: 0.24,
        ease: 'power2.out'
      });
      gsap.to(currentLookAt, {
        x: 0.5,
        y: 0.3,
        z: 0.2,
        duration: 0.24,
        ease: 'power2.out'
      });
    } else if (key === 'sandbox') {
      // Focus near Mint equatorial orbit
      gsap.to(camera.position, {
        x: -2.8,
        y: 1.4,
        z: 5.2,
        duration: 0.24,
        ease: 'power2.out'
      });
      gsap.to(currentLookAt, {
        x: -0.4,
        y: 0.2,
        z: 0.0,
        duration: 0.24,
        ease: 'power2.out'
      });
    } else if (key === 'ide') {
      // Focus near Amber polar orbit
      gsap.to(camera.position, {
        x: 0.0,
        y: 3.6,
        z: 4.6,
        duration: 0.24,
        ease: 'power2.out'
      });
      gsap.to(currentLookAt, {
        x: 0.0,
        y: 0.6,
        z: 0.0,
        duration: 0.24,
        ease: 'power2.out'
      });
    } else {
      // Reset to default
      resetCameraView();
    }
  }

  // Reset Camera View
  function resetCameraView() {
    hoveredKey = null;
    if (!camera) return;
    gsap.to(camera.position, {
      x: DEFAULT_CAM_POS.x,
      y: DEFAULT_CAM_POS.y,
      z: DEFAULT_CAM_POS.z,
      duration: 0.24,
      ease: 'power2.out'
    });
    gsap.to(currentLookAt, {
      x: DEFAULT_LOOK_AT.x,
      y: DEFAULT_LOOK_AT.y,
      z: DEFAULT_LOOK_AT.z,
      duration: 0.24,
      ease: 'power2.out'
    });
  }

  // Toggle Auto-Rotation
  function toggleRotation() {
    isAutoRotating = !isAutoRotating;
  }

  onMount(() => {
    initThree();
  });

  onDestroy(() => {
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (renderer) {
      renderer.dispose();
    }
    // Clean up Three geometries and materials
    if (scene) {
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
    }
  });
</script>

<!-- ============================================================
     WAY 2.1 TELEMETRY LAUNCHPAD (Quiet Editorial Intelligence)
     0/4/8px Architectural Radii · Pure Semantic Tokens · Lagom Motion
     ============================================================ -->
<div class="w-full bg-surface border border-border rounded-none shadow-xs overflow-hidden {className}">
  <!-- Top Telemetry Strip -->
  <div class="px-4 py-2 border-b border-border bg-surface-subtle/70 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
    <div class="flex items-center gap-2">
      <div class="size-2 bg-brand rounded-none animate-pulse"></div>
      <span class="font-bold text-ink tracking-wide text-[11px] uppercase">
        Live Application Telemetry Mesh
      </span>
      <span class="text-ink-muted">|</span>
      <span class="text-[10px] text-ink-secondary hidden sm:inline">
        Three.js WebGL Engine · SGP4 Propagation
      </span>
    </div>

    <!-- Active Kinematics Telemetry Readout -->
    <div class="flex items-center gap-3 text-[10px] text-ink-muted">
      <div class="flex items-center gap-1">
        <Activity class="size-3 text-mint" />
        <span>{fps} FPS</span>
      </div>
      <div class="hidden md:flex items-center gap-1">
        <Compass class="size-3 text-cyan" />
        <span>Y:{currentYaw}° P:{currentPitch}°</span>
      </div>
      <div class="flex items-center gap-1">
        <Radio class="size-3 text-brand" />
        <span>UTC {telemetryEpoch}</span>
      </div>

      <!-- Quick 3D Scene Controls -->
      <div class="flex items-center gap-1 pl-2 border-l border-border">
        <button
          onclick={toggleRotation}
          class="p-1 rounded-sm border border-border bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink transition-micro cursor-pointer"
          title={isAutoRotating ? 'Pause Orbital Spin' : 'Resume Orbital Spin'}
          aria-label={isAutoRotating ? 'Pause rotation' : 'Resume rotation'}
        >
          {#if isAutoRotating}
            <Pause class="size-2.5" />
          {:else}
            <Play class="size-2.5" />
          {/if}
        </button>

        <button
          onclick={resetCameraView}
          class="p-1 rounded-sm border border-border bg-surface hover:bg-surface-raised text-ink-secondary hover:text-ink transition-micro cursor-pointer"
          title="Reset Camera Vantage Point"
          aria-label="Reset camera"
        >
          <RotateCcw class="size-2.5" />
        </button>
      </div>
    </div>
  </div>

  <!-- 3D Interactive WebGL Stage -->
  <div
    bind:this={canvasContainer}
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    role="region"
    aria-label="Interactive 3D Three.js Globe and Telemetry Mesh"
    class="relative w-full h-70 sm:h-80 md:h-90 bg-canvas flex items-center justify-center overflow-hidden cursor-crosshair select-none"
  >
    <!-- Three.js Canvas -->
    <canvas bind:this={canvasEl} class="absolute inset-0 w-full h-full block"></canvas>

    <!-- Overlay HUD: Active Focus Target -->
    <div class="absolute top-3 left-3 pointer-events-none z-10 flex flex-col gap-1 max-w-xs">
      <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-surface/90 border border-border text-[10px] font-mono text-ink shadow-2xs">
        <span class="size-1.5 bg-mint rounded-none"></span>
        <span>
          {#if hoveredKey === 'globe'}
            NODE 01: PLANETARY STUDIO (51.6° ISS INCLINATION)
          {:else if hoveredKey === 'sandbox'}
            NODE 02: PRODUCTION SANDBOX (28.5° CAPE ORBIT)
          {:else if hoveredKey === 'ide'}
            NODE 03: ROBOTICS IDE (98.2° SUN-SYNCHRONOUS POLAR)
          {:else}
            MESH SYNCHRONIZED · 3 LIVE SATELLITE BEACONS
          {/if}
        </span>
      </div>

      <p class="text-[10px] text-ink-secondary bg-surface/80 px-2 py-0.5 border border-border/60 backdrop-blur-xs font-mono">
        {#if hoveredKey}
          Active camera tracking locked. Hover cards to inspect mission orbits.
        {:else}
          Drag mouse to adjust pitch/yaw angle. Click any portal card below to launch.
        {/if}
      </p>
    </div>

    <!-- Bottom HUD Watermark -->
    <div class="absolute bottom-2 right-3 pointer-events-none z-10 text-[9px] font-mono text-ink-muted/80 flex items-center gap-2">
      <span class="inline-block px-1.5 py-0.5 bg-surface/80 border border-border">100% Commercial Clean-Room</span>
      <span class="inline-block px-1.5 py-0.5 bg-surface/80 border border-border">Three.js v0.186 MIT</span>
    </div>
  </div>

  <!-- ============================================================
       ENHANCED LIVE APPLICATION LINKS (3 Mission Portals)
       ============================================================ -->
  <div class="p-4 sm:p-6 bg-surface border-t border-border">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-4 border-b border-border/70">
      <div>
        <h3 class="text-sm font-semibold text-ink font-heading tracking-tight flex items-center gap-2">
          <span>Active Live Application Portals</span>
          <span class="text-[10px] font-mono font-normal px-2 py-0.5 rounded-none bg-surface-subtle border border-border text-ink-secondary">
            3 Deployed Services
          </span>
        </h3>
        <p class="text-xs text-ink-secondary mt-0.5">
          Select any live node to navigate directly to the production workspace.
        </p>
      </div>

      <div class="flex items-center gap-2 text-xs font-mono text-ink-muted">
        <Sparkles class="size-3 text-brand" />
        <span>Lagom Kinematics Damping</span>
      </div>
    </div>

    <!-- 3-Column Portal Deck -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {#each PORTAL_ITEMS as portal}
        {@const IconComp = portal.icon}
        {@const isHovered = hoveredKey === portal.key}
        <div
          onmouseenter={() => focusOnPortal(portal.key)}
          onmouseleave={() => focusOnPortal(null)}
          role="region"
          aria-label={portal.title}
          class="flex flex-col justify-between p-4 rounded-sm border transition-micro bg-surface shadow-2xs relative group {isHovered
            ? 'border-brand ring-1 ring-brand/40 bg-surface-raised'
            : 'border-border hover:border-border-strong hover:bg-surface-subtle'}"
        >
          <!-- Card Header -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono px-2 py-0.5 border rounded-none {portal.tagColor} bg-surface">
                {portal.badge}
              </span>
              <div class="size-2 rounded-none {isHovered ? 'bg-brand' : 'bg-ink-muted/50'} transition-micro"></div>
            </div>

            <div class="flex items-start gap-3 pt-1">
              <div class="p-2 rounded-sm border border-border bg-surface-subtle text-ink shrink-0 group-hover:border-brand/40 transition-micro">
                <IconComp class="size-4 {portal.colorClass}" />
              </div>

              <div>
                <h4 class="text-xs sm:text-sm font-semibold text-ink font-heading leading-tight group-hover:text-brand transition-micro">
                  {portal.title}
                </h4>
                <div class="flex items-center gap-2 mt-1 text-[10px] font-mono text-ink-muted">
                  <span>Orbit R: {portal.orbitRadius}</span>
                  <span>•</span>
                  <span>Inc: {portal.inclinationDeg}°</span>
                </div>
              </div>
            </div>

            <!-- Role Description -->
            <p class="text-xs text-ink-secondary leading-relaxed pt-1">
              {portal.role}
            </p>
          </div>

          <!-- Card Primary Action -->
          <div class="pt-4 mt-2 border-t border-border/50 flex items-center justify-between gap-2">
            <a
              href={portal.href}
              class="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-sm bg-surface-subtle group-hover:bg-brand text-ink group-hover:text-brand-foreground text-xs font-mono font-medium border border-border group-hover:border-brand transition-micro shadow-2xs"
            >
              <span>Launch {portal.shortTitle}</span>
              <ArrowUpRight class="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
