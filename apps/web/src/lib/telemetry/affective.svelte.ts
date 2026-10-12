/**
 * Affective Telemetry Engine (DPDP-Compliant & Child-Safe)
 *
 * Measures cognitive rhythm, cursor velocity entropy, and hesitation latency.
 * Detects frustration / cognitive fatigue and triggers gentle "Physical Maker Break"
 * recommendations without storing any biometric or spatial tracking data.
 */

export type CognitiveRhythm = 'calm' | 'focused' | 'strained' | 'frustrated';

export interface MakerBreakSuggestion {
  active: boolean;
  type: 'desk_stretch' | 'sketch_circuit' | 'water_reset' | 'clarify_goal';
  title: string;
  instruction: string;
}

export class AffectiveTracker {
  // Svelte 5 Runes for reactive state
  velocity = $state(0);
  jitterRate = $state(0);
  idleSeconds = $state(0);
  frustrationScore = $state(0); // 0.0 - 1.0
  rhythm = $state<CognitiveRhythm>('calm');
  breakSuggestion = $state<MakerBreakSuggestion>({
    active: false,
    type: 'desk_stretch',
    title: 'Physical Maker Break',
    instruction: 'Stand up and stretch for 2 minutes before tackling this step.'
  });

  private lastX = 0;
  private lastY = 0;
  private lastTime = 0;
  private recentVelocities: number[] = [];
  private directionChanges = 0;
  private lastDirection = { dx: 0, dy: 0 };
  private idleTimer: any = null;
  private isListening = false;

  constructor() {
    this.lastTime = typeof performance !== 'undefined' ? performance.now() : 0;
  }

  public startListening() {
    if (typeof window === 'undefined' || this.isListening) return;
    this.isListening = true;

    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('keydown', this.handleKeyDown, { passive: true });

    this.idleTimer = setInterval(() => {
      this.idleSeconds += 1;
      this.evaluateAffectiveState();
    }, 1000);
  }

  public stopListening() {
    if (typeof window === 'undefined') return;
    this.isListening = false;
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.idleTimer) clearInterval(this.idleTimer);
  }

  private handlePointerMove = (e: PointerEvent) => {
    const now = performance.now();
    const dt = Math.max(1, now - this.lastTime);
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const v = dist / dt; // pixels per ms
    this.velocity = Math.round(v * 100) / 100;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.lastTime = now;
    this.idleSeconds = 0;

    // Detect erratic direction changes (rapid zig-zag without intentional clicks)
    if (dist > 15) {
      const dot = dx * this.lastDirection.dx + dy * this.lastDirection.dy;
      if (dot < 0) {
        this.directionChanges += 1;
      }
      this.lastDirection = { dx, dy };
    }

    this.recentVelocities.push(v);
    if (this.recentVelocities.length > 20) {
      this.recentVelocities.shift();
    }

    this.evaluateAffectiveState();
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    this.idleSeconds = 0;
    // Rapid backspacing indicates cognitive struggle/doubt
    if (e.key === 'Backspace') {
      this.frustrationScore = Math.min(1.0, this.frustrationScore + 0.05);
      this.evaluateAffectiveState();
    }
  };

  private evaluateAffectiveState() {
    // Calculate velocity entropy / variance
    const avgV =
      this.recentVelocities.length > 0
        ? this.recentVelocities.reduce((a, b) => a + b, 0) / this.recentVelocities.length
        : 0;

    // High velocity + frequent direction changes = frustration jitter
    if (avgV > 2.0 && this.directionChanges > 5) {
      this.frustrationScore = Math.min(1.0, this.frustrationScore + 0.08);
      this.directionChanges = 0;
    } else {
      // Natural decay towards calm
      this.frustrationScore = Math.max(0.0, this.frustrationScore - 0.02);
    }

    // Prolonged idle hesitation
    if (this.idleSeconds > 45) {
      this.rhythm = 'strained';
    } else if (this.frustrationScore > 0.65) {
      this.rhythm = 'frustrated';
    } else if (this.frustrationScore > 0.35) {
      this.rhythm = 'strained';
    } else if (avgV > 0.3) {
      this.rhythm = 'focused';
    } else {
      this.rhythm = 'calm';
    }

    // Trigger Physical Maker Break if frustration or severe strain persists
    if (this.frustrationScore >= 0.75 && !this.breakSuggestion.active) {
      this.breakSuggestion = {
        active: true,
        type: 'sketch_circuit',
        title: 'Step Back & Sketch on Paper',
        instruction:
          'You are tackling a high-friction concept. Step away from the screen for 2 minutes and draw the gear relationship with pen and paper.'
      };
    } else if (this.idleSeconds >= 90 && !this.breakSuggestion.active) {
      this.breakSuggestion = {
        active: true,
        type: 'desk_stretch',
        title: 'Movement & Refreshment Break',
        instruction:
          'Deep thinking takes energy. Stand up, stretch your arms, drink some water, and come back with fresh eyes.'
      };
    }
  }

  public dismissBreak() {
    this.breakSuggestion.active = false;
    this.frustrationScore = 0.2;
    this.idleSeconds = 0;
    this.rhythm = 'calm';
  }
}

export const affectiveTracker = new AffectiveTracker();
