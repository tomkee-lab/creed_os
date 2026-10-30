<script lang="ts">
  import { onMount } from 'svelte';
  import { Shield, Zap, RefreshCw, Play, Flame } from 'lucide-svelte';
  import { webAudioSynth } from './webAudioSynth';
  import {
    MECH_CHASSIS_OPTIONS,
    MECH_VISOR_OPTIONS,
    MECH_WEAPON_OPTIONS,
    MECH_DRONE_OPTIONS,
    MECH_PALETTES,
    DEFAULT_MECH_LOADOUT,
    computeMechStats,
    calculateHarmonicHover,
    calculateDrone3DOrbit,
    calculateDampenedAimAngle,
    calculateRecoilSpring,
    updateComboTracker,
    registerComboKill,
    type MechLoadout,
    type PlasmaProjectile,
    type SwarmEnemy,
    type BossMech,
    type ComboTracker
  } from './cyberMechStudio';

  interface Props {
    viewMode?: 'hangar' | 'cyber_arena';
    activeMicrobitGrid?: number[][];
    effectiveEmotion?: string;
    roverX?: number;
    roverY?: number;
    activeActionText?: string | null;
    onReset?: () => void;
  }

  let {
    viewMode = 'hangar',
    activeMicrobitGrid = [
      [0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0],
      [1, 0, 0, 0, 1],
      [0, 1, 1, 1, 0]
    ],
    effectiveEmotion = 'HAPPY',
    roverX = 150,
    roverY = 150,
    activeActionText = null,
    onReset
  }: Props = $props();

  // Mode state: 'hangar' (Customization) vs 'cyber_arena' (Combat Proving Ground)
  let subMode = $state<'hangar' | 'cyber_arena'>('hangar');
  $effect(() => {
    if (viewMode) {
      subMode = viewMode;
    }
  });

  // Theme detection
  let isDarkTheme = $state(true);
  onMount(() => {
    const updateTheme = () => {
      isDarkTheme =
        document.documentElement.classList.contains('dark') ||
        document.documentElement.getAttribute('data-theme') === 'dark';
    };
    updateTheme();
    const obs = new MutationObserver(updateTheme);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    return () => obs.disconnect();
  });

  // Modular loadout and computed stats.
  let loadout = $state<MechLoadout>({ ...DEFAULT_MECH_LOADOUT });
  let activeCustomizerTab = $state<'chassis' | 'visor' | 'weapon' | 'drones' | 'palette'>('chassis');

  let activeChassis = $derived(MECH_CHASSIS_OPTIONS.find((c) => c.id === loadout.chassisId) || MECH_CHASSIS_OPTIONS[0]);
  let activeVisor = $derived(MECH_VISOR_OPTIONS.find((v) => v.id === loadout.visorId) || MECH_VISOR_OPTIONS[0]);
  let activeWeapon = $derived(MECH_WEAPON_OPTIONS.find((w) => w.id === loadout.weaponId) || MECH_WEAPON_OPTIONS[0]);
  let activeDrone = $derived(MECH_DRONE_OPTIONS.find((d) => d.id === loadout.droneId) || MECH_DRONE_OPTIONS[0]);
  let activePalette = $derived(MECH_PALETTES.find((p) => p.id === loadout.paletteId) || MECH_PALETTES[0]);

  let stats = $derived(computeMechStats(loadout));

  // Micro-animation and physics engine.
  let animTime = $state(0);
  let hoverOffsetY = $state(0);
  let shadowScale = $state(1);
  let thrusterScale = $state(1);
  let droneOrbitAngle = $state(0);
  let currentAimAngle = $state(0);
  let targetAimAngle = $state(0);
  let recoilTimer = $state(0);
  let recoilState = $state({ kickbackX: 0, bloomScale: 1.0 });

  let isChargingWeapon = $state(false);
  let chargeLevel = $state(0);
  let shieldActive = $state(false);
  let shieldTimer = $state(0);
  let visorGlitch = $state(false);

  // Combat arena simulation entities and game loop.
  let playerX = $state(150);
  let playerY = $state(220);
  let currentHull = $state(100);
  let currentShield = $state(100);
  let credits = $state(0);
  let combo = $state<ComboTracker>({ count: 0, timerSec: 0, maxTimerSec: 3.0, tier: 1 });
  let plasmaProjectiles = $state<PlasmaProjectile[]>([]);
  let swarmEnemies = $state<SwarmEnemy[]>([]);
  let boss = $state<BossMech>({
    x: 150,
    y: 65,
    hp: 120,
    maxHp: 120,
    state: 'idle',
    strafeDir: 1,
    targetAngle: 90,
    telegraphTimer: 0,
    telegraphDuration: 1.5,
    megaBeamTimer: 0,
    attackCooldown: 2.0
  });
  let matchStatus = $state<'playing' | 'victory' | 'defeat'>('playing');

  // Sync with rover coordinate updates if provided
  $effect(() => {
    if (typeof roverX === 'number' && typeof roverY === 'number') {
      playerX = Math.max(30, Math.min(270, roverX));
      playerY = Math.max(80, Math.min(270, roverY));
    }
  });

  // Animation frame loop
  onMount(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    // Spawn initial swarm enemies
    spawnInitialEnemies();

    const loop = (timestamp: number) => {
      const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
      lastTimestamp = timestamp;
      animTime += dt;

      // 1. Harmonic hover physics
      const hover = calculateHarmonicHover(animTime, 6.5, 4.5);
      hoverOffsetY = hover.offsetY;
      shadowScale = hover.shadowScale;
      thrusterScale = hover.thrusterFlameScale;

      // 2. 3D Elliptical drone orbit (constant 5 rad/s)
      droneOrbitAngle = (droneOrbitAngle + dt * 4.5) % (Math.PI * 2);

      // 3. Aim angle interpolation
      currentAimAngle = calculateDampenedAimAngle(currentAimAngle, targetAimAngle, 0.22);

      // 4. Weapon recoil spring
      if (recoilTimer > 0) {
        recoilTimer -= dt;
        recoilState = calculateRecoilSpring(0.35 - recoilTimer, 12, 9);
      } else {
        recoilState = { kickbackX: 0, bloomScale: 1.0 };
      }

      // 5. Shield timer
      if (shieldTimer > 0) {
        shieldTimer -= dt;
        if (shieldTimer <= 0) shieldActive = false;
      }

      // 6. Stochastic visor glitch
      if (Math.random() < 0.015) {
        visorGlitch = true;
        setTimeout(() => { visorGlitch = false; }, 90);
      }

      // 7. Combat update when in arena mode
      if (subMode === 'cyber_arena' && matchStatus === 'playing') {
        updateCombatEntities(dt);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  });

  function spawnInitialEnemies() {
    swarmEnemies = [
      { id: 'sw-1', x: 50, y: 40, hp: 3, maxHp: 3, swayPhase: 0, speed: 22, hitFlashTimer: 0 },
      { id: 'sw-2', x: 250, y: 45, hp: 3, maxHp: 3, swayPhase: 1.8, speed: 24, hitFlashTimer: 0 },
      { id: 'sw-3', x: 120, y: 30, hp: 2, maxHp: 2, swayPhase: 3.2, speed: 26, hitFlashTimer: 0 }
    ];
  }

  function updateCombatEntities(dt: number) {
    // A. Update combo countdown
    combo = updateComboTracker(combo, dt);

    // B. Shield auto-regeneration (if not damaged recently)
    if (currentShield < stats.maxShield && !shieldActive) {
      currentShield = Math.min(stats.maxShield, currentShield + dt * 6);
    }

    // C. Update projectiles
    plasmaProjectiles = plasmaProjectiles
      .map((p) => ({
        ...p,
        x: p.x + p.vx * dt,
        y: p.y + p.vy * dt,
        life: p.life - dt
      }))
      .filter((p) => p.life > 0 && p.x >= 0 && p.x <= 300 && p.y >= 0 && p.y <= 300);

    // D. Update Swarm Enemies
    swarmEnemies = swarmEnemies.map((e) => {
      // Swarm hunting math with lateral harmonic sway
      const dx = playerX - e.x;
      const dy = playerY - e.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      const baseAngle = Math.atan2(dy, dx);
      const swayAngle = baseAngle + Math.sin(animTime * 3.5 + e.swayPhase) * 0.45;

      const vx = Math.cos(swayAngle) * e.speed;
      const vy = Math.sin(swayAngle) * e.speed;

      let newX = e.x + vx * dt;
      let newY = e.y + vy * dt;
      let hp = e.hp;
      let hitFlash = Math.max(0, e.hitFlashTimer - dt);

      // Projectile collision detection
      for (const proj of plasmaProjectiles) {
        if (Math.hypot(proj.x - newX, proj.y - newY) < 14) {
          hp -= 1;
          hitFlash = 0.12;
          proj.life = 0; // Destroy projectile
          webAudioSynth.playEffect('BLIP');
        }
      }

      // Contact damage with player
      if (dist < 18) {
        applyPlayerDamage(12);
        hp = 0; // Enemy suicide detonates
      }

      return {
        ...e,
        x: newX,
        y: newY,
        hp,
        hitFlashTimer: hitFlash
      };
    });

    // Check for defeated swarm enemies & award combo
    const defeatedCount = swarmEnemies.filter((e) => e.hp <= 0).length;
    if (defeatedCount > 0) {
      for (let i = 0; i < defeatedCount; i++) {
        const result = registerComboKill(combo);
        combo = result.updatedCombo;
        credits += result.creditsAwarded;
        webAudioSynth.playEffect('SUCCESS');
      }
      swarmEnemies = swarmEnemies.filter((e) => e.hp > 0);
      // Respawn reinforcements if count is low
      if (swarmEnemies.length < 2 && boss.hp > 0) {
        swarmEnemies.push({
          id: `sw-${Date.now()}`,
          x: Math.random() < 0.5 ? 30 : 270,
          y: Math.random() * 60 + 20,
          hp: 3,
          maxHp: 3,
          swayPhase: Math.random() * 6,
          speed: 24,
          hitFlashTimer: 0
        });
      }
    }

    // E. Update Boss Mech AI
    if (boss.hp > 0) {
      updateBossAI(dt);
    }
  }

  function updateBossAI(dt: number) {
    let { x, y, hp, state, strafeDir, telegraphTimer, telegraphDuration, megaBeamTimer, attackCooldown } = boss;

    // Side-to-side strafe movement
    x += strafeDir * 28 * dt;
    if (x > 220) { x = 220; strafeDir = -1; }
    if (x < 80) { x = 80; strafeDir = 1; }

    // Target laser points at player
    const targetAngle = (Math.atan2(playerY - y, playerX - x) * 180) / Math.PI;

    if (state === 'idle') {
      attackCooldown -= dt;
      if (attackCooldown <= 0) {
        state = 'telegraph';
        telegraphTimer = telegraphDuration;
        webAudioSynth.playTone(880, 150);
      }
    } else if (state === 'telegraph') {
      telegraphTimer -= dt;
      if (telegraphTimer <= 0) {
        state = 'mega_beam';
        megaBeamTimer = 0.5; // Mega Beam duration
        webAudioSynth.playEffect('LASER');
      }
    } else if (state === 'mega_beam') {
      megaBeamTimer -= dt;

      // Check if player is intersecting the beam cylinder
      const rad = (targetAngle * Math.PI) / 180;
      const beamEndX = x + Math.cos(rad) * 300;
      const beamEndY = y + Math.sin(rad) * 300;

      // Distance from player to segment
      const beamDist = pointToSegmentDistance(playerX, playerY, x, y, beamEndX, beamEndY);
      if (beamDist < 16) {
        applyPlayerDamage(35);
      }

      if (megaBeamTimer <= 0) {
        state = 'idle';
        attackCooldown = 3.5; // Cooldown before next sequence
      }
    }

    // Projectile collisions with boss
    for (const proj of plasmaProjectiles) {
      if (Math.hypot(proj.x - x, proj.y - y) < 24) {
        hp = Math.max(0, hp - 4);
        proj.life = 0;
        webAudioSynth.playEffect('BLIP');
        if (hp <= 0) {
          matchStatus = 'victory';
          webAudioSynth.playEffect('FANFARE');
        }
      }
    }

    boss = {
      ...boss,
      x,
      y,
      hp,
      state,
      strafeDir,
      targetAngle,
      telegraphTimer,
      megaBeamTimer,
      attackCooldown
    };
  }

  function applyPlayerDamage(dmg: number) {
    if (shieldActive) {
      // Deflected by hexagonal barrier
      webAudioSynth.playTone(1200, 80);
      return;
    }

    // Shield absorbs damage first
    if (currentShield > 0) {
      const remainingDmg = Math.max(0, dmg - currentShield);
      currentShield = Math.max(0, currentShield - dmg);
      dmg = remainingDmg;
    }

    if (dmg > 0) {
      currentHull = Math.max(0, currentHull - dmg);
      combo = { ...combo, count: 0, timerSec: 0, tier: 1 }; // Combo break!
      webAudioSynth.playEffect('COLLISION');
      if (currentHull <= 0) {
        matchStatus = 'defeat';
      }
    }
  }

  function pointToSegmentDistance(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  }

  // Interactive controls.
  function handleArenaMouseMove(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement | SVGSVGElement;
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 300;
    const my = ((e.clientY - rect.top) / rect.height) * 300;

    // Aim toward mouse cursor
    const angleRad = Math.atan2(my - (playerY + hoverOffsetY), mx - playerX);
    targetAimAngle = (angleRad * 180) / Math.PI;
  }

  function triggerPlayerFire() {
    if (matchStatus !== 'playing') return;

    recoilTimer = 0.35;
    webAudioSynth.playEffect('LASER');

    // Spawn plasma bolt at cannon muzzle
    const rad = (currentAimAngle * Math.PI) / 180;
    const spawnX = playerX + Math.cos(rad) * 22;
    const spawnY = (playerY + hoverOffsetY) + Math.sin(rad) * 22;

    plasmaProjectiles = [
      ...plasmaProjectiles,
      {
        id: `bolt-${Date.now()}-${Math.random()}`,
        x: spawnX,
        y: spawnY,
        vx: Math.cos(rad) * 240,
        vy: Math.sin(rad) * 240,
        angle: currentAimAngle,
        power: stats.damage,
        life: 1.5
      }
    ];
  }

  function triggerPlayerShield() {
    if (shieldActive || currentShield < 20) return;
    shieldActive = true;
    shieldTimer = 2.5;
    currentShield = Math.max(0, currentShield - 25);
    webAudioSynth.playTone(659, 200);
  }

  function resetMatch() {
    currentHull = stats.maxHealth;
    currentShield = stats.maxShield;
    credits = 0;
    combo = { count: 0, timerSec: 0, maxTimerSec: 3.0, tier: 1 };
    plasmaProjectiles = [];
    spawnInitialEnemies();
    boss = {
      ...boss,
      x: 150,
      y: 65,
      hp: 120,
      state: 'idle',
      telegraphTimer: 0,
      megaBeamTimer: 0,
      attackCooldown: 2.0
    };
    matchStatus = 'playing';
    onReset?.();
  }

  // 3D Orbit Drone Calculations
  let drone1State = $derived(calculateDrone3DOrbit(0, -6, droneOrbitAngle, 38, 14));
  let drone2State = $derived(calculateDrone3DOrbit(0, -6, droneOrbitAngle + Math.PI, 38, 14));
</script>

<div class="relative w-full h-full flex flex-col bg-surface-subtle dark:bg-canvas text-ink select-none overflow-hidden transition-colors duration-200">
  <!-- Minimalist Status Strip (WAY 2.1 Calm Editorial Intelligence) -->
  <div class="shrink-0 px-3 py-1 border-b border-border bg-surface text-[10px] font-mono flex items-center justify-between text-ink-muted">
    <div class="flex items-center gap-2 min-w-0">
      <span class="size-1.5 {subMode === 'hangar' ? 'bg-amber-500' : 'bg-rose-500'}"></span>
      <span class="text-[9px] uppercase tracking-wider text-ink font-bold truncate">
        {activeChassis.name} // {activeWeapon.name}
      </span>
      <span class="text-border">·</span>
      <span class="text-[8.5px] text-ink-muted truncate hidden sm:inline">
        {activePalette.name}
      </span>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-2 shrink-0">
      <div class="flex items-center gap-1 bg-surface-subtle px-1.5 py-0.5 border border-border text-[9px]">
        <span class="text-ink-muted">POW:</span>
        <strong class="text-mint font-bold">{stats.powerRating}</strong>
      </div>
      <button
        onclick={resetMatch}
        class="px-1.5 py-0.5 text-ink-muted hover:text-mint transition-micro font-bold text-[9px] flex items-center gap-0.5 rounded-xs hover:bg-surface-subtle"
        title="Reset match and health"
      >
        <RefreshCw class="size-2.5" />
        <span>Reset</span>
      </button>
    </div>
  </div>

  <!-- MAIN VIEWPORT CONTENT -->
  {#if subMode === 'hangar'}
    <!-- Hangar bay customization studio. -->
    <div class="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden p-2 gap-2">
      <!-- Left: 60 FPS Animated Mech Preview Stage -->
      <div class="flex-1 flex flex-col items-center justify-between bg-surface border border-border rounded-xs p-3 relative overflow-hidden shadow-xs">
        <!-- Hangar Grid Background Lines -->
        <div class="absolute inset-0 opacity-15 pointer-events-none" style="background-image: linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px); background-size: 20px 20px;"></div>

        <!-- Stage Header Banner -->
        <div class="w-full flex items-center justify-between text-[10px] font-mono z-10">
          <div class="flex items-center gap-1.5">
            <span class="size-1.5 rounded-none bg-amber-500 shadow-xs"></span>
            <span class="font-bold text-ink uppercase tracking-wider">Modular Rig Assembly</span>
          </div>
          <span class="text-[9px] text-ink-muted">60 FPS HARMONIC PREVIEW</span>
        </div>

        <!-- Large-Scale Cyber-Mech Preview SVG -->
        <div class="flex-1 w-full flex items-center justify-center relative my-1 z-10">
          <button
            type="button"
            class="w-full h-full max-h-62.5 p-0 border-0 bg-transparent cursor-crosshair flex items-center justify-center rounded-none focus-visible:outline-2 focus-visible:outline-focus"
            aria-label="Modular Cyber-Mech Hangar Rig Assembly Preview"
            onmousemove={handleArenaMouseMove}
            onclick={triggerPlayerFire}
          >
            <svg
              class="w-full h-full max-h-62.5 object-contain pointer-events-none"
              viewBox="0 0 240 240"
              preserveAspectRatio="xMidYMid meet"
            >
            <defs>
              <radialGradient id="hangarHoloPlatform" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color={activePalette.primary} stop-opacity={isDarkTheme ? 0.35 : 0.2} />
                <stop offset="100%" stop-color={activePalette.primary} stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- Holographic Hangar Rings -->
            <ellipse cx="120" cy="195" rx="72" ry="20" fill="url(#hangarHoloPlatform)" />
            <ellipse cx="120" cy="195" rx="55" ry="15" fill="none" stroke={activePalette.primary} stroke-width="1.2" opacity="0.6" stroke-dasharray="6,4" />
            <ellipse cx="120" cy="195" rx="30" ry="8" fill="none" stroke={activePalette.accent} stroke-width="0.8" opacity="0.8" />

            <!-- Dynamic Breathing Contact Shadow -->
            <ellipse
              cx="120"
              cy="194"
              rx={36 * shadowScale}
              ry={10 * shadowScale}
              fill={isDarkTheme ? 'rgba(0,0,0,0.65)' : 'rgba(15,23,42,0.25)'}
            />

            <!-- Cyber-mech multi-layer rig. -->
            <g transform="translate(120, {145 + hoverOffsetY})">
              <!-- LAYER 1 (BACK): Back-Orbit Support Drone (if behind) -->
              {#if activeDrone.id !== 'NONE' && !drone1State.isFrontLayer}
                <g transform="translate({drone1State.x}, {drone1State.y}) scale({drone1State.scale})" opacity={drone1State.opacity}>
                  <rect x="-6" y="-6" width="12" height="12" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="0.8" />
                  <circle cx="0" cy="0" r="2.5" fill={activePalette.glow} />
                </g>
              {/if}
              {#if activeDrone.id !== 'NONE' && !drone2State.isFrontLayer}
                <g transform="translate({drone2State.x}, {drone2State.y}) scale({drone2State.scale})" opacity={drone2State.opacity}>
                  <rect x="-6" y="-6" width="12" height="12" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="0.8" />
                  <circle cx="0" cy="0" r="2.5" fill={activePalette.glow} />
                </g>
              {/if}

              <!-- LAYER 1.5 (BACK): Ion Thruster Flame Plume -->
              <g transform="translate(0, 24) scale(1, {thrusterScale})">
                <polygon points="-8,0 8,0 0,16" fill={activePalette.energyCore} opacity="0.9" />
                <polygon points="-4,0 4,0 0,10" fill="#ffffff" opacity="0.8" />
              </g>

              <!-- LAYER 2 (BASE): Chassis Frame & Mechanical Joints -->
              {#if activeChassis.id === 'TITAN_HEAVY'}
                <!-- Titan Heavy Bastion Plating -->
                <polygon points="-36,18 36,18 28,32 -28,32" fill="#1e293b" stroke={activePalette.primary} stroke-width="1.2" />
                <rect x="-24" y="-8" width="48" height="28" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="1.4" />
              {:else if activeChassis.id === 'RAPTOR_LIGHT'}
                <!-- Raptor Vector Chassis -->
                <polygon points="-28,20 28,20 18,30 -18,30" fill="#0f172a" stroke={activePalette.accent} stroke-width="1" />
                <polygon points="-18,-8 18,-8 24,18 -24,18" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="1.2" />
              {:else if activeChassis.id === 'STRIDER_LEGS'}
                <!-- Hydraulic Walker Pylons -->
                <line x1="-22" y1="12" x2="-32" y2="34" stroke={activePalette.accent} stroke-width="2.5" />
                <line x1="22" y1="12" x2="32" y2="34" stroke={activePalette.accent} stroke-width="2.5" />
                <rect x="-20" y="-8" width="40" height="24" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="1.2" />
              {:else}
                <!-- Default Ion Hover-Treads -->
                <rect x="-30" y="16" width="60" height="12" fill="#1e293b" stroke={activePalette.primary} stroke-width="1" />
                <rect x="-22" y="-10" width="44" height="28" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="1.2" />
              {/if}

              <!-- Central Power Core Reactor -->
              <circle cx="0" cy="4" r="6" fill={activePalette.energyCore} />
              <circle cx="0" cy="4" r="3" fill="#ffffff" />

              <!-- LAYER 3 (DETAIL): Head Module & Visor Optics -->
              <g transform="translate(0, -20)">
                <rect x="-16" y="-12" width="32" height="18" fill="#0f172a" stroke={activePalette.accent} stroke-width="1.2" />
                
                <!-- Digital Visor Glass -->
                {#if activeVisor.id === 'MATRIX_PULSE'}
                  <!-- 5x5 micro:bit Matrix Visor -->
                  <rect x="-12" y="-8" width="24" height="12" fill="#000000" stroke={activePalette.accent} stroke-width="0.8" />
                  <g transform="translate(-10, -6)">
                    {#each activeMicrobitGrid as row, rIdx}
                      {#each row as pixel, cIdx}
                        <rect x={cIdx * 4} y={rIdx * 2} width="2" height="1.5" fill={pixel === 1 ? '#ef4444' : '#1e293b'} />
                      {/each}
                    {/each}
                  </g>
                {:else if activeVisor.id === 'NEON_HEX'}
                  <polygon points="-12,-2 -6,-8 6,-8 12,-2 6,4 -6,4" fill={activePalette.glow} opacity={visorGlitch ? 0.4 : 0.85} />
                {:else if activeVisor.id === 'TACTICAL_OLED'}
                  <rect x="-12" y="-6" width="10" height="8" fill="#ef4444" />
                  <rect x="2" y="-6" width="10" height="8" fill="#ef4444" />
                {:else}
                  <!-- Default Cyber Scanline Visor -->
                  <rect x="-13" y="-7" width="26" height="10" fill={activePalette.glow} opacity={visorGlitch ? 0.35 : 0.9} />
                  <line x1="-12" y1="-2" x2="12" y2="-2" stroke="#ffffff" stroke-width="0.8" />
                {/if}
              </g>

              <!-- LAYER 4 (FRONT): Aim-Tracked Weapon System with Recoil Kickback -->
              <g transform="translate(18, 0) rotate({currentAimAngle}) translate({recoilState.kickbackX}, 0)">
                {#if activeWeapon.id === 'RAIL_BEAM'}
                  <!-- Long Hyper-Velocity Railgun -->
                  <rect x="0" y="-3" width="36" height="6" fill="#334155" stroke={activePalette.accent} stroke-width="0.8" />
                  <rect x="24" y="-5" width="8" height="10" fill={activePalette.primary} />
                {:else if activeWeapon.id === 'ION_BLASTER'}
                  <!-- Dual Barrel Pulse Blaster -->
                  <rect x="0" y="-4" width="22" height="3.5" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="0.8" />
                  <rect x="0" y="0.5" width="22" height="3.5" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="0.8" />
                {:else if activeWeapon.id === 'DUAL_GATLING'}
                  <!-- Rotary Autocannon -->
                  <rect x="0" y="-5" width="26" height="10" fill="#1e293b" stroke={activePalette.accent} stroke-width="1" />
                  <circle cx="26" cy="0" r="5" fill={activePalette.energyCore} />
                {:else}
                  <!-- Default Heavy Plasma Cannon -->
                  <rect x="0" y="-5" width="28" height="10" fill="#1e293b" stroke={activePalette.accent} stroke-width="1.2" />
                  <circle cx="28" cy="0" r={4 * recoilState.bloomScale} fill={activePalette.energyCore} />
                {/if}
              </g>

              <!-- LAYER 5 (FRONT ORBIT): Front-Orbit Support Drone -->
              {#if activeDrone.id !== 'NONE' && drone1State.isFrontLayer}
                <g transform="translate({drone1State.x}, {drone1State.y}) scale({drone1State.scale})" opacity={drone1State.opacity}>
                  <rect x="-7" y="-7" width="14" height="14" fill={activePalette.accent} stroke="#ffffff" stroke-width="1" />
                  <circle cx="0" cy="0" r="3" fill={activePalette.glow} />
                </g>
              {/if}
              {#if activeDrone.id !== 'NONE' && drone2State.isFrontLayer}
                <g transform="translate({drone2State.x}, {drone2State.y}) scale({drone2State.scale})" opacity={drone2State.opacity}>
                  <rect x="-7" y="-7" width="14" height="14" fill={activePalette.accent} stroke="#ffffff" stroke-width="1" />
                  <circle cx="0" cy="0" r="3" fill={activePalette.glow} />
                </g>
              {/if}

              <!-- Holographic Shield Bubble (when triggered) -->
              {#if shieldActive}
                <polygon
                  points="0,-48 38,-24 38,24 0,48 -38,24 -38,-24"
                  fill={activePalette.accent}
                  fill-opacity="0.25"
                  stroke={activePalette.glow}
                  stroke-width="1.5"
                  stroke-dasharray="4,2"
                />
              {/if}
            </g>
            </svg>
          </button>
        </div>

        <!-- Hangar Interactive Test Strip -->
        <div class="w-full flex items-center justify-between gap-2 border-t border-border pt-2 text-[10px] font-mono z-10">
          <div class="flex items-center gap-1.5">
            <button
              onclick={triggerPlayerFire}
              class="px-2 py-0.5 bg-brand text-brand-foreground font-bold rounded-xs transition-micro hover:opacity-90 active:scale-95 flex items-center gap-1 shadow-2xs"
            >
              <Zap class="size-3" />
              <span>Test Fire</span>
            </button>
            <button
              onclick={triggerPlayerShield}
              class="px-2 py-0.5 border border-border bg-surface-subtle text-ink font-bold rounded-xs transition-micro hover:bg-surface active:scale-95 flex items-center gap-1"
            >
              <Shield class="size-3 text-cyan" />
              <span>Hex Barrier</span>
            </button>
          </div>
          <button
            onclick={() => (subMode = 'cyber_arena')}
            class="px-3 py-0.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xs transition-micro flex items-center gap-1 shadow-xs"
          >
            <Play class="size-3" />
            <span>Deploy to Arena</span>
          </button>
        </div>
      </div>

      <!-- Right: Modular Customizer Deck & Stat Readouts -->
      <div class="w-full md:w-76 flex flex-col bg-surface border border-border rounded-xs p-3 overflow-y-auto gap-3 shrink-0 shadow-xs">
        <!-- Slot Switcher Tabs -->
        <div class="grid grid-cols-5 gap-0.5 bg-surface-subtle border border-border p-0.5 rounded-xs text-[9px] font-mono text-center">
          <button
            onclick={() => (activeCustomizerTab = 'chassis')}
            class="py-1 rounded-xs transition-micro {activeCustomizerTab === 'chassis' ? 'bg-brand text-brand-foreground font-bold' : 'text-ink-muted hover:text-ink'}"
          >
            Chassis
          </button>
          <button
            onclick={() => (activeCustomizerTab = 'visor')}
            class="py-1 rounded-xs transition-micro {activeCustomizerTab === 'visor' ? 'bg-brand text-brand-foreground font-bold' : 'text-ink-muted hover:text-ink'}"
          >
            Visor
          </button>
          <button
            onclick={() => (activeCustomizerTab = 'weapon')}
            class="py-1 rounded-xs transition-micro {activeCustomizerTab === 'weapon' ? 'bg-brand text-brand-foreground font-bold' : 'text-ink-muted hover:text-ink'}"
          >
            Weapon
          </button>
          <button
            onclick={() => (activeCustomizerTab = 'drones')}
            class="py-1 rounded-xs transition-micro {activeCustomizerTab === 'drones' ? 'bg-brand text-brand-foreground font-bold' : 'text-ink-muted hover:text-ink'}"
          >
            Drones
          </button>
          <button
            onclick={() => (activeCustomizerTab = 'palette')}
            class="py-1 rounded-xs transition-micro {activeCustomizerTab === 'palette' ? 'bg-brand text-brand-foreground font-bold' : 'text-ink-muted hover:text-ink'}"
          >
            Color
          </button>
        </div>

        <!-- Options List for Active Slot -->
        <div class="flex-1 space-y-1.5 overflow-y-auto pr-0.5">
          {#if activeCustomizerTab === 'chassis'}
            {#each MECH_CHASSIS_OPTIONS as opt}
              <button
                onclick={() => (loadout.chassisId = opt.id)}
                class="w-full text-left p-2 border rounded-xs transition-micro flex flex-col gap-0.5 {loadout.chassisId === opt.id ? 'border-brand bg-brand/5 shadow-2xs' : 'border-border bg-surface-subtle hover:border-ink-muted'}"
              >
                <div class="flex items-center justify-between text-xs font-bold text-ink">
                  <span>{opt.name}</span>
                  {#if loadout.chassisId === opt.id}
                    <span class="text-brand text-[10px]">EQUIPPED ✓</span>
                  {/if}
                </div>
                <span class="text-[10px] text-ink-muted font-sans leading-tight">{opt.desc}</span>
              </button>
            {/each}
          {:else if activeCustomizerTab === 'visor'}
            {#each MECH_VISOR_OPTIONS as opt}
              <button
                onclick={() => (loadout.visorId = opt.id)}
                class="w-full text-left p-2 border rounded-xs transition-micro flex flex-col gap-0.5 {loadout.visorId === opt.id ? 'border-brand bg-brand/5 shadow-2xs' : 'border-border bg-surface-subtle hover:border-ink-muted'}"
              >
                <div class="flex items-center justify-between text-xs font-bold text-ink">
                  <span>{opt.name}</span>
                  {#if loadout.visorId === opt.id}
                    <span class="text-brand text-[10px]">EQUIPPED ✓</span>
                  {/if}
                </div>
                <span class="text-[10px] text-ink-muted font-sans leading-tight">{opt.desc}</span>
              </button>
            {/each}
          {:else if activeCustomizerTab === 'weapon'}
            {#each MECH_WEAPON_OPTIONS as opt}
              <button
                onclick={() => (loadout.weaponId = opt.id)}
                class="w-full text-left p-2 border rounded-xs transition-micro flex flex-col gap-0.5 {loadout.weaponId === opt.id ? 'border-brand bg-brand/5 shadow-2xs' : 'border-border bg-surface-subtle hover:border-ink-muted'}"
              >
                <div class="flex items-center justify-between text-xs font-bold text-ink">
                  <span>{opt.name}</span>
                  {#if loadout.weaponId === opt.id}
                    <span class="text-brand text-[10px]">EQUIPPED ✓</span>
                  {/if}
                </div>
                <span class="text-[10px] text-ink-muted font-sans leading-tight">{opt.desc}</span>
              </button>
            {/each}
          {:else if activeCustomizerTab === 'drones'}
            {#each MECH_DRONE_OPTIONS as opt}
              <button
                onclick={() => (loadout.droneId = opt.id)}
                class="w-full text-left p-2 border rounded-xs transition-micro flex flex-col gap-0.5 {loadout.droneId === opt.id ? 'border-brand bg-brand/5 shadow-2xs' : 'border-border bg-surface-subtle hover:border-ink-muted'}"
              >
                <div class="flex items-center justify-between text-xs font-bold text-ink">
                  <span>{opt.name}</span>
                  {#if loadout.droneId === opt.id}
                    <span class="text-brand text-[10px]">EQUIPPED ✓</span>
                  {/if}
                </div>
                <span class="text-[10px] text-ink-muted font-sans leading-tight">{opt.desc}</span>
              </button>
            {/each}
          {:else if activeCustomizerTab === 'palette'}
            {#each MECH_PALETTES as pal}
              <button
                onclick={() => (loadout.paletteId = pal.id)}
                class="w-full text-left p-2 border rounded-xs transition-micro flex items-center justify-between {loadout.paletteId === pal.id ? 'border-brand bg-brand/5 shadow-2xs' : 'border-border bg-surface-subtle hover:border-ink-muted'}"
              >
                <div class="flex items-center gap-2">
                  <div class="size-4 rounded-none border border-border" style="background-color: {pal.primary};"></div>
                  <span class="text-xs font-bold text-ink">{pal.name}</span>
                </div>
                {#if loadout.paletteId === pal.id}
                  <span class="text-brand text-[10px] font-mono">ACTIVE ✓</span>
                {/if}
              </button>
            {/each}
          {/if}
        </div>

        <!-- Dynamic Stat Telemetry Section -->
        <div class="border-t border-border pt-2 space-y-1.5 font-mono text-[10px]">
          <div class="flex items-center justify-between text-ink-muted">
            <span>HULL INTEGRITY</span>
            <strong class="text-ink">{stats.maxHealth} HP</strong>
          </div>
          <div class="w-full h-1.5 bg-surface-subtle border border-border">
            <div class="h-full bg-mint" style="width: {Math.min(100, (stats.maxHealth / 200) * 100)}%;"></div>
          </div>

          <div class="flex items-center justify-between text-ink-muted pt-1">
            <span>ENERGY SHIELD</span>
            <strong class="text-cyan font-bold">{stats.maxShield} SP</strong>
          </div>
          <div class="w-full h-1.5 bg-surface-subtle border border-border">
            <div class="h-full bg-cyan" style="width: {Math.min(100, (stats.maxShield / 220) * 100)}%;"></div>
          </div>

          <div class="flex items-center justify-between text-ink-muted pt-1">
            <span>FIREPOWER DPS</span>
            <strong class="text-amber-500 font-bold">{stats.damage}x</strong>
          </div>
          <div class="w-full h-1.5 bg-surface-subtle border border-border">
            <div class="h-full bg-amber-500" style="width: {Math.min(100, (stats.damage / 2.0) * 100)}%;"></div>
          </div>

          <div class="flex items-center justify-between text-ink-muted pt-1">
            <span>AGILITY & SPEED</span>
            <strong class="text-ink">{stats.speed}x</strong>
          </div>
          <div class="w-full h-1.5 bg-surface-subtle border border-border">
            <div class="h-full bg-fuchsia-500" style="width: {Math.min(100, (stats.speed / 1.6) * 100)}%;"></div>
          </div>
        </div>
      </div>
    </div>

  {:else}
    <!-- Cyber-mech combat proving ground arena. -->
    <div class="flex-1 min-h-0 relative flex flex-col p-2 overflow-hidden">
      <!-- Cockpit HUD Status Header (Minimalist WAY 2.1) -->
      <div class="w-full bg-surface/90 border border-border px-3 py-1.5 rounded-xs flex items-center justify-between text-[10px] font-mono mb-1.5 shrink-0 shadow-xs z-20 gap-2">
        <!-- Health & Shield Bars -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1 text-[8.5px]">
              <span class="text-ink-muted">HULL</span>
              <strong class={currentHull < 25 ? 'text-red-500 font-bold animate-pulse' : 'text-mint'}>{Math.round(currentHull)}/{stats.maxHealth}</strong>
            </div>
            <div class="w-16 h-1.5 bg-black/40 border border-border">
              <div class="h-full transition-all duration-150 {currentHull < 25 ? 'bg-red-500' : 'bg-mint'}" style="width: {(currentHull / stats.maxHealth) * 100}%;"></div>
            </div>
          </div>

          <div class="flex flex-col gap-0.5">
            <div class="flex items-center gap-1 text-[8.5px]">
              <span class="text-ink-muted">SHD</span>
              <strong class="text-cyan font-bold">{Math.round(currentShield)}/{stats.maxShield}</strong>
            </div>
            <div class="w-16 h-1.5 bg-black/40 border border-border">
              <div class="h-full bg-cyan transition-all duration-150" style="width: {(currentShield / stats.maxShield) * 100}%;"></div>
            </div>
          </div>
        </div>

        <!-- Center: Dynamic Score Multiplier Combo Engine & Credits -->
        <div class="flex items-center gap-1.5 shrink-0">
          {#if combo.count > 0}
            <div class="px-1.5 py-0.5 border border-amber-500/50 bg-amber-500/10 text-amber-500 font-bold text-[8.5px] rounded-xs animate-in zoom-in-95 duration-100 flex items-center gap-1">
              <Flame class="size-2.5 text-amber-500" />
              <span>{combo.tier}x ({combo.count})</span>
            </div>
          {/if}
          <div class="flex items-center gap-1 text-[8.5px]">
            <span class="text-ink-muted hidden sm:inline">CREDITS:</span>
            <strong class="text-amber-500 font-bold">${credits}</strong>
          </div>
        </div>

        <!-- Right: Action status -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            onclick={triggerPlayerShield}
            class="px-2 py-0.5 border text-[8.5px] font-bold rounded-xs transition-micro {shieldActive ? 'border-cyan bg-cyan text-black' : 'border-border bg-surface-subtle text-ink hover:bg-surface'}"
            title="Toggle Hexagonal Energy Shield"
          >
            🛡️ Shield [E]
          </button>
        </div>
      </div>

      <!-- Combat Arena SVG Canvas -->
      <div class="flex-1 w-full h-full relative flex items-center justify-center overflow-hidden">
        <button
          type="button"
          class="w-full h-full max-w-full max-h-full aspect-square border border-border bg-canvas cursor-crosshair rounded-none p-0 flex items-center justify-center focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Cyber-Mech Battle Arena Proving Ground"
          onmousemove={handleArenaMouseMove}
          onclick={triggerPlayerFire}
        >
          <svg
            class="w-full h-full max-w-full max-h-full aspect-square pointer-events-none"
            viewBox="0 0 300 300"
            preserveAspectRatio="xMidYMid meet"
          >
          <!-- Arena Grid Surface Lines -->
          <defs>
            <pattern id="combatGridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke={isDarkTheme ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} stroke-width="0.75" />
            </pattern>
          </defs>
          <rect width="300" height="300" fill="url(#combatGridPattern)" />

          <!-- Boss mech combat entity. -->
          {#if boss.hp > 0}
            <g transform="translate({boss.x}, {boss.y})">
              <!-- Boss HP Bar -->
              <rect x="-35" y="-32" width="70" height="4" fill="#000000" stroke="#ef4444" stroke-width="0.75" />
              <rect x="-34" y="-31" width={(boss.hp / boss.maxHp) * 68} height="2" fill="#ef4444" />
              <text x="0" y="-36" font-size="6" font-family="monospace" text-anchor="middle" fill="#ef4444" font-weight="bold">
                ARES-WARLORD [BOSS] // {boss.hp} HP
              </text>

              <!-- Boss Chassis Heavy Hex Armor -->
              <polygon points="0,-22 32,-10 26,18 0,26 -26,18 -32,-10" fill="#1c1917" stroke="#ef4444" stroke-width="1.5" />
              <circle cx="0" cy="0" r="10" fill="#450a0a" stroke="#f87171" stroke-width="1" />
              <circle cx="0" cy="0" r="4" fill="#ef4444" />

              <!-- Telegraphed Mega Beam Warning Line (Phase A & B) -->
              {#if boss.state === 'telegraph'}
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos((boss.targetAngle * Math.PI) / 180) * 320}
                  y2={Math.sin((boss.targetAngle * Math.PI) / 180) * 320}
                  stroke="#ef4444"
                  stroke-width="1.2"
                  stroke-dasharray="8,4"
                  opacity={boss.telegraphTimer < 0.4 ? (Math.sin(animTime * 30) > 0 ? 1 : 0.2) : 0.65}
                />
              {/if}

              <!-- Mega Beam Blast Execution (Phase C) -->
              {#if boss.state === 'mega_beam'}
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos((boss.targetAngle * Math.PI) / 180) * 320}
                  y2={Math.sin((boss.targetAngle * Math.PI) / 180) * 320}
                  stroke="#f43f5e"
                  stroke-width="16"
                  opacity="0.85"
                />
                <line
                  x1="0"
                  y1="0"
                  x2={Math.cos((boss.targetAngle * Math.PI) / 180) * 320}
                  y2={Math.sin((boss.targetAngle * Math.PI) / 180) * 320}
                  stroke="#ffffff"
                  stroke-width="6"
                />
              {/if}
            </g>
          {/if}

          <!-- Swarm enemy drones. -->
          {#each swarmEnemies as enemy}
            <g transform="translate({enemy.x}, {enemy.y})">
              <!-- Swarm Drone Body -->
              <polygon
                points="0,-8 7,0 0,8 -7,0"
                fill={enemy.hitFlashTimer > 0 ? '#ffffff' : '#7f1d1d'}
                stroke={enemy.hitFlashTimer > 0 ? '#ffffff' : '#ef4444'}
                stroke-width="1"
              />
              <circle cx="0" cy="0" r="2.5" fill={enemy.hitFlashTimer > 0 ? '#ffffff' : '#f87171'} />
            </g>
          {/each}

          <!-- Flying plasma projectiles. -->
          {#each plasmaProjectiles as proj}
            <g transform="translate({proj.x}, {proj.y}) rotate({proj.angle})">
              <ellipse cx="0" cy="0" rx="6" ry="2" fill={activePalette.glow} />
              <ellipse cx="-2" cy="0" rx="3" ry="1" fill="#ffffff" />
            </g>
          {/each}

          <!-- Player cyber-mech rig. -->
          <g transform="translate({playerX}, {playerY + hoverOffsetY}) scale(0.85)">
            <!-- Back Drones -->
            {#if activeDrone.id !== 'NONE' && !drone1State.isFrontLayer}
              <g transform="translate({drone1State.x}, {drone1State.y}) scale({drone1State.scale})" opacity="0.7">
                <rect x="-5" y="-5" width="10" height="10" fill={activePalette.primary} />
              </g>
            {/if}

            <!-- Thruster Flame -->
            <polygon points="-6,18 6,18 0,30" fill={activePalette.energyCore} opacity="0.9" />

            <!-- Main Chassis -->
            <rect x="-18" y="-8" width="36" height="24" fill={activePalette.primary} stroke={activePalette.accent} stroke-width="1" />
            <circle cx="0" cy="4" r="4" fill={activePalette.energyCore} />

            <!-- Visor Head -->
            <rect x="-10" y="-18" width="20" height="10" fill="#0f172a" stroke={activePalette.accent} stroke-width="0.8" />
            <rect x="-8" y="-15" width="16" height="5" fill={activePalette.glow} />

            <!-- Pinned Weapon Tracking Angle with Spring Recoil -->
            <g transform="translate(14, 2) rotate({currentAimAngle}) translate({recoilState.kickbackX}, 0)">
              <rect x="0" y="-4" width="22" height="8" fill="#1e293b" stroke={activePalette.accent} stroke-width="1" />
              <circle cx="22" cy="0" r="3" fill={activePalette.energyCore} />
            </g>

            <!-- Front Drones -->
            {#if activeDrone.id !== 'NONE' && drone1State.isFrontLayer}
              <g transform="translate({drone1State.x}, {drone1State.y}) scale({drone1State.scale})">
                <rect x="-5" y="-5" width="10" height="10" fill={activePalette.accent} stroke="#ffffff" stroke-width="0.8" />
              </g>
            {/if}

            <!-- Hexagonal Shield Bubble -->
            {#if shieldActive}
              <polygon
                points="0,-38 30,-19 30,19 0,38 -30,19 -30,-19"
                fill={activePalette.accent}
                fill-opacity="0.3"
                stroke={activePalette.glow}
                stroke-width="1.5"
              />
            {/if}
          </g>

          <!-- Arena Borders -->
          <rect x="4" y="4" width="292" height="292" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" />
          <text x="10" y="293" font-size="6" font-family="monospace" fill="rgba(255,255,255,0.4)">
            SECTOR: COMBAT-ZONE // CYBER-MECH ARENA
          </text>
        </svg>
      </button>

        <!-- GAME OVER / VICTORY MODALS -->
        {#if matchStatus === 'victory'}
          <div class="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30 animate-in fade-in-0 duration-200">
            <span class="text-2xl font-black text-mint tracking-wider font-mono mb-1">SYSTEMS SECURED! 🏆</span>
            <span class="text-xs text-ink-muted font-sans mb-3">Boss neutralized and perimeter secured. Applied competency verified!</span>
            <div class="flex items-center gap-3 bg-surface border border-border px-3 py-1.5 rounded-xs font-mono text-xs mb-4">
              <span>Bounty: <strong class="text-amber-500 font-bold">${credits}</strong></span>
              <span class="text-border">|</span>
              <span>Max Combo: <strong class="text-cyan font-bold">{combo.count}x</strong></span>
            </div>
            <button
              onclick={resetMatch}
              class="px-3 py-1 bg-mint text-black font-bold font-mono text-xs rounded-xs transition-micro hover:opacity-90"
            >
              Play Again 🔄
            </button>
          </div>
        {:else if matchStatus === 'defeat'}
          <div class="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-30 animate-in fade-in-0 duration-200">
            <span class="text-2xl font-black text-red-500 tracking-wider font-mono mb-1">MISSION FAILED 🛑</span>
            <span class="text-xs text-ink-muted font-sans mb-3">Hull integrity collapsed under fire. Evade telegraphed Mega Beams!</span>
            <button
              onclick={resetMatch}
              class="px-3 py-1 bg-red-600 text-white font-bold font-mono text-xs rounded-xs transition-micro hover:opacity-90"
            >
              Restart Simulation 🔄
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
