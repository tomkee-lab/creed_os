/**
 * Cyber-Mech Studio & Arena Combat Physics Engine
 * 
 * Implements:
 * 1. Multi-Layer Modular Mech Costume Archetypes (Chassis, Visor, Weapons, Support Drones, Palettes)
 * 2. Real-time Stat Computation (Hull Integrity, Shield Points, Agility, DPS)
 * 3. 60 FPS Micro-Animation Formulas (Harmonic Hover, 3D Elliptical Orbit Drones, Dampened Aiming, Recoil Springs)
 * 4. Swarm Enemy AI Tracking with Lateral Sway Physics
 * 5. Telegraphed Boss Laser Matrix & Mega Beam Execution
 * 6. Score Multiplier Combo Engine (3.0s decay, 1x/2x/3x tiers)
 */

export interface MechPartOption {
  id: string;
  name: string;
  desc: string;
  stats: {
    healthMod: number;
    shieldMod: number;
    speedMod: number;
    damageMod: number;
    fireRateMod: number;
  };
}

export interface MechPaletteOption {
  id: string;
  name: string;
  primary: string;
  accent: string;
  glow: string;
  energyCore: string;
}

export const MECH_CHASSIS_OPTIONS: MechPartOption[] = [
  {
    id: 'ION_HOVER',
    name: 'Ion Hover-Treads',
    desc: 'Magnetic levitation suspension with balanced agility and stability.',
    stats: { healthMod: 100, shieldMod: 100, speedMod: 1.0, damageMod: 1.0, fireRateMod: 1.0 }
  },
  {
    id: 'TITAN_HEAVY',
    name: 'Titan Bastion Plating',
    desc: 'Reinforced depleted-polymer armor with heavy kinetic deflection shields.',
    stats: { healthMod: 180, shieldMod: 160, speedMod: 0.75, damageMod: 1.1, fireRateMod: 0.9 }
  },
  {
    id: 'RAPTOR_LIGHT',
    name: 'Raptor Vector Frame',
    desc: 'Lightweight carbon-nanotube chassis tuned for high-velocity lateral strafing.',
    stats: { healthMod: 75, shieldMod: 70, speedMod: 1.45, damageMod: 0.95, fireRateMod: 1.25 }
  },
  {
    id: 'STRIDER_LEGS',
    name: 'Strider Articulated Pylons',
    desc: 'High-clearance hydraulic walker joints engineered for crater terrain.',
    stats: { healthMod: 120, shieldMod: 110, speedMod: 1.1, damageMod: 1.05, fireRateMod: 1.0 }
  }
];

export const MECH_VISOR_OPTIONS: MechPartOption[] = [
  {
    id: 'CYBER_SCAN',
    name: 'Cybernetic Scanline Visor',
    desc: 'Panoramic holographic band with stochastic telemetry glitch scans.',
    stats: { healthMod: 0, shieldMod: 10, speedMod: 1.0, damageMod: 1.05, fireRateMod: 1.0 }
  },
  {
    id: 'MATRIX_PULSE',
    name: 'micro:bit Matrix Visor',
    desc: '5x5 tactile LED matrix synchronized with real-time robot emotional states.',
    stats: { healthMod: 10, shieldMod: 15, speedMod: 1.0, damageMod: 1.0, fireRateMod: 1.05 }
  },
  {
    id: 'NEON_HEX',
    name: 'Neon Hex Targeter',
    desc: 'Hexagonal predictive HUD lens providing locked crosshair trajectories.',
    stats: { healthMod: 0, shieldMod: 5, speedMod: 1.05, damageMod: 1.15, fireRateMod: 1.0 }
  },
  {
    id: 'TACTICAL_OLED',
    name: 'Tactical Dual-Beam OLED',
    desc: 'Hardened dual-aperture optic arrays with high thermal sensor range.',
    stats: { healthMod: 15, shieldMod: 20, speedMod: 0.95, damageMod: 1.1, fireRateMod: 1.0 }
  }
];

export const MECH_WEAPON_OPTIONS: MechPartOption[] = [
  {
    id: 'PLASMA_CANNON',
    name: 'Heavy Plasma Cannon',
    desc: 'Charges a compressed thermal plasma sphere with dramatic recoil kickback.',
    stats: { healthMod: 0, shieldMod: 0, speedMod: 0.95, damageMod: 1.4, fireRateMod: 0.85 }
  },
  {
    id: 'RAIL_BEAM',
    name: 'Hyper-Velocity Railgun',
    desc: 'Electromagnetic solid-slug rail penetrator with extreme piercing punch.',
    stats: { healthMod: 0, shieldMod: 0, speedMod: 0.9, damageMod: 1.65, fireRateMod: 0.7 }
  },
  {
    id: 'ION_BLASTER',
    name: 'Pulse Ion Blaster',
    desc: 'Rapid-cycling dual emitters delivering continuous suppression streams.',
    stats: { healthMod: 0, shieldMod: 0, speedMod: 1.05, damageMod: 0.85, fireRateMod: 1.6 }
  },
  {
    id: 'DUAL_GATLING',
    name: 'Twin Kinetic Autocannon',
    desc: 'Rotary high-cadence vulcan barrels with spread suppression cones.',
    stats: { healthMod: 0, shieldMod: 0, speedMod: 1.0, damageMod: 1.0, fireRateMod: 1.35 }
  }
];

export const MECH_DRONE_OPTIONS: MechPartOption[] = [
  {
    id: 'CHRONO_ORBIT',
    name: 'Dual Chrono Orbiters (2x)',
    desc: 'Pair of autonomous companion drones maintaining 3D elliptical orbits.',
    stats: { healthMod: 10, shieldMod: 25, speedMod: 1.05, damageMod: 1.15, fireRateMod: 1.1 }
  },
  {
    id: 'AEGIS_SHIELD',
    name: 'Aegis Barrier Generator',
    desc: 'Overhead sentinel unit establishing hexagonal energy shield umbrellas.',
    stats: { healthMod: 20, shieldMod: 60, speedMod: 0.95, damageMod: 0.9, fireRateMod: 1.0 }
  },
  {
    id: 'STORM_DRONE',
    name: 'Storm Auto-Turret Drone',
    desc: 'Close-quarters interceptor drone firing autonomous defense bursts.',
    stats: { healthMod: 5, shieldMod: 15, speedMod: 1.0, damageMod: 1.3, fireRateMod: 1.15 }
  },
  {
    id: 'NONE',
    name: 'No Support Drones (Solo)',
    desc: 'Solo stealth configuration redirecting all auxiliary bus power to speed.',
    stats: { healthMod: 0, shieldMod: 0, speedMod: 1.15, damageMod: 1.0, fireRateMod: 1.0 }
  }
];

export const MECH_PALETTES: MechPaletteOption[] = [
  {
    id: 'CYBER_CYAN',
    name: 'Cyber Cyan 01',
    primary: '#0284c7',
    accent: '#38bdf8',
    glow: '#7dd3fc',
    energyCore: '#06b6d4'
  },
  {
    id: 'NEON_PURPLE',
    name: 'Neon Iris 02',
    primary: '#7c3aed',
    accent: '#c084fc',
    glow: '#e879f9',
    energyCore: '#d946ef'
  },
  {
    id: 'SOLAR_AMBER',
    name: 'Solar Forge 03',
    primary: '#d97706',
    accent: '#fbbf24',
    glow: '#fde68a',
    energyCore: '#f59e0b'
  },
  {
    id: 'EMERALD_MINT',
    name: 'Bio-Matrix Mint 04',
    primary: '#059669',
    accent: '#34d399',
    glow: '#6ee7b7',
    energyCore: '#10b981'
  }
];

export interface MechLoadout {
  chassisId: string;
  visorId: string;
  weaponId: string;
  droneId: string;
  paletteId: string;
}

export const DEFAULT_MECH_LOADOUT: MechLoadout = {
  chassisId: 'ION_HOVER',
  visorId: 'CYBER_SCAN',
  weaponId: 'PLASMA_CANNON',
  droneId: 'CHRONO_ORBIT',
  paletteId: 'CYBER_CYAN'
};

export interface MechComputedStats {
  maxHealth: number;
  maxShield: number;
  speed: number;
  damage: number;
  fireRate: number;
  powerRating: number;
}

export function computeMechStats(loadout: MechLoadout): MechComputedStats {
  const chassis = MECH_CHASSIS_OPTIONS.find((c) => c.id === loadout.chassisId) || MECH_CHASSIS_OPTIONS[0];
  const visor = MECH_VISOR_OPTIONS.find((v) => v.id === loadout.visorId) || MECH_VISOR_OPTIONS[0];
  const weapon = MECH_WEAPON_OPTIONS.find((w) => w.id === loadout.weaponId) || MECH_WEAPON_OPTIONS[0];
  const drone = MECH_DRONE_OPTIONS.find((d) => d.id === loadout.droneId) || MECH_DRONE_OPTIONS[0];

  const maxHealth = Math.round(chassis.stats.healthMod + visor.stats.healthMod + drone.stats.healthMod);
  const maxShield = Math.round(chassis.stats.shieldMod + visor.stats.shieldMod + drone.stats.shieldMod);
  const speed = Number((chassis.stats.speedMod * visor.stats.speedMod * weapon.stats.speedMod * drone.stats.speedMod).toFixed(2));
  const damage = Number((chassis.stats.damageMod * visor.stats.damageMod * weapon.stats.damageMod * drone.stats.damageMod).toFixed(2));
  const fireRate = Number((chassis.stats.fireRateMod * visor.stats.fireRateMod * weapon.stats.fireRateMod * drone.stats.fireRateMod).toFixed(2));
  const powerRating = Math.round(maxHealth + maxShield * 1.2 + speed * 120 + damage * 150 + fireRate * 110);

  return {
    maxHealth,
    maxShield,
    speed,
    damage,
    fireRate,
    powerRating
  };
}

// ==========================================
// 60 FPS Micro-Animation & Physics Formulas
// ==========================================

export interface HarmonicHoverState {
  offsetY: number;
  shadowScale: number;
  thrusterFlameScale: number;
}

export function calculateHarmonicHover(timeSec: number, freq = 6, amp = 4.5): HarmonicHoverState {
  const offsetY = Math.sin(timeSec * freq) * amp;
  const shadowScale = Math.max(0.65, Math.min(1.15, 1 - offsetY / 30));
  const thrusterFlameScale = Math.max(0.7, Math.min(1.35, 1 + Math.cos(timeSec * (freq * 1.8)) * 0.25));
  return { offsetY, shadowScale, thrusterFlameScale };
}

export interface Drone3DOrbitState {
  droneIndex: number;
  x: number;
  y: number;
  scale: number;
  isFrontLayer: boolean;
  opacity: number;
}

export function calculateDrone3DOrbit(
  centerX: number,
  centerY: number,
  angleRad: number,
  radiusX = 42,
  radiusY = 16
): Drone3DOrbitState {
  const x = centerX + Math.cos(angleRad) * radiusX;
  const y = centerY + Math.sin(angleRad) * radiusY;
  const sinVal = Math.sin(angleRad);
  const isFrontLayer = sinVal > 0;
  // Dynamic scale: 115% closer when in front, 82% smaller when orbiting behind
  const scale = isFrontLayer ? 1.0 + sinVal * 0.18 : 0.82 + Math.abs(sinVal) * 0.12;
  const opacity = isFrontLayer ? 1.0 : 0.72;

  return {
    droneIndex: 0,
    x,
    y,
    scale,
    isFrontLayer,
    opacity
  };
}

export function calculateDampenedAimAngle(currentAngleDeg: number, targetAngleDeg: number, damping = 0.25): number {
  let diff = (targetAngleDeg - currentAngleDeg) % 360;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return currentAngleDeg + diff * damping;
}

export interface RecoilState {
  kickbackX: number;
  bloomScale: number;
}

export function calculateRecoilSpring(recoilTimerSec: number, maxKickback = 12, decay = 8): RecoilState {
  if (recoilTimerSec <= 0) return { kickbackX: 0, bloomScale: 1.0 };
  const kickbackX = -maxKickback * Math.exp(-decay * recoilTimerSec) * Math.cos(recoilTimerSec * 15);
  const bloomScale = 1.0 + Math.max(0, 0.45 * Math.exp(-decay * 1.2 * recoilTimerSec));
  return { kickbackX, bloomScale };
}

// ==========================================
// Combat Entity Models & Swarm AI
// ==========================================

export interface PlasmaProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  power: number;
  life: number;
}

export interface SwarmEnemy {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  swayPhase: number;
  speed: number;
  hitFlashTimer: number;
}

export interface BossMech {
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  state: 'idle' | 'strafe' | 'telegraph' | 'mega_beam' | 'summon';
  strafeDir: number;
  targetAngle: number;
  telegraphTimer: number;
  telegraphDuration: number;
  megaBeamTimer: number;
  attackCooldown: number;
}

export interface ComboTracker {
  count: number;
  timerSec: number;
  maxTimerSec: number;
  tier: 1 | 2 | 3;
}

export function updateComboTracker(combo: ComboTracker, deltaSec: number): ComboTracker {
  if (combo.count <= 0) return { ...combo, count: 0, timerSec: 0, tier: 1 };
  const newTimer = Math.max(0, combo.timerSec - deltaSec);
  if (newTimer <= 0) {
    return { ...combo, count: 0, timerSec: 0, tier: 1 };
  }
  const tier = combo.count >= 10 ? 3 : combo.count >= 5 ? 2 : 1;
  return { ...combo, timerSec: newTimer, tier };
}

export function registerComboKill(combo: ComboTracker): { updatedCombo: ComboTracker; creditsAwarded: number; didTierUp: boolean } {
  const newCount = combo.count + 1;
  const newTimerSec = 3.0; // 3 seconds window to maintain combo
  const oldTier = combo.tier;
  const newTier = newCount >= 10 ? 3 : newCount >= 5 ? 2 : 1;
  const multiplier = newTier === 3 ? 3 : newTier === 2 ? 2 : 1;
  const creditsAwarded = 25 * multiplier;

  return {
    updatedCombo: { count: newCount, timerSec: newTimerSec, maxTimerSec: 3.0, tier: newTier },
    creditsAwarded,
    didTierUp: newTier > oldTier
  };
}
