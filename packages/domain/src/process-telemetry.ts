/**
 * CREED OS — OECD PISA 2025 "Learning in the Digital World" (LDW) Process Telemetry Engine
 *
 * Implements:
 * 1. 3-Phase Module Flow: Show (Baseline Probe) → Learn (Worked Sandbox) → Apply (Constrained Optimization).
 * 2. Real-time Process Log-File Stream Telemetry (VOTAT - Vary One Thing At A Time analysis).
 * 3. Self-Regulated Learning (SRL) Metacognitive Metrics (Hypothesis Revision Latency, Strategic Shift, Resilience).
 * 4. PISA 2025 Competency Level Inference (Levels 1 to 6 conforming to OECD framework).
 * 5. Level 4 Learner Evidence Emission (High-trust applied task evidence atom).
 */

import type { CompetencyDomain } from './types/competency.js';
import type { LearnerEvidence } from './types/evidence.js';

export type PisaPhase = 'show' | 'learn' | 'apply';

export type PisaActionType =
  | 'parameter_change'
  | 'run_simulation'
  | 'reset_state'
  | 'request_scaffold_hint'
  | 'view_formula'
  | 'submit_solution';

export interface PisaTelemetryEvent {
  readonly timestamp: number; // UNIX epoch ms
  readonly phase: PisaPhase;
  readonly action: PisaActionType;
  readonly parameters: Record<string, number | string | boolean>;
  readonly outcome?: {
    readonly success: boolean;
    readonly deviation?: number;
    readonly errorType?: string;
  };
}

export type ResilienceIndex = 'High' | 'Moderate' | 'Developing';

export interface SelfRegulatedLearningMetrics {
  readonly totalTrials: number;
  readonly systematicParameterExplorationRatio: number; // Ratio of runs varying <= 1 variable (VOTAT)
  readonly averageHypothesisRevisionLatencyMs: number;
  readonly strategyShiftDetected: boolean;
  readonly efficiencyRatio: number; // optimal steps / actual steps taken (capped at 1.0)
  readonly resilienceIndex: ResilienceIndex;
}

export type PisaProficiencyLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface PisaProcessTelemetryReport {
  readonly missionId: string;
  readonly learnerId: string;
  readonly completedPhases: PisaPhase[];
  readonly totalDurationMs: number;
  readonly srlMetrics: SelfRegulatedLearningMetrics;
  readonly inferredPisaLevel: PisaProficiencyLevel;
  readonly levelRationale: string;
  readonly evidenceAtom?: LearnerEvidence;
  readonly generatedAt: string;
}

/**
 * Calculates Self-Regulated Learning (SRL) metrics from an interactive session event log.
 */
export function calculateSrlMetrics(
  events: readonly PisaTelemetryEvent[],
  optimalSteps: number = 3
): SelfRegulatedLearningMetrics {
  const simulationRuns = events.filter((e) => e.action === 'run_simulation');
  const totalTrials = simulationRuns.length;

  if (totalTrials === 0) {
    return {
      totalTrials: 0,
      systematicParameterExplorationRatio: 0,
      averageHypothesisRevisionLatencyMs: 0,
      strategyShiftDetected: false,
      efficiencyRatio: 0,
      resilienceIndex: 'Developing'
    };
  }

  // 1. Analyze Vary-One-Thing-At-A-Time (VOTAT) Systematic Exploration
  let votatCount = 0;
  for (let i = 1; i < simulationRuns.length; i++) {
    const prevParams = simulationRuns[i - 1].parameters;
    const currParams = simulationRuns[i].parameters;
    const allKeys = new Set([...Object.keys(prevParams), ...Object.keys(currParams)]);
    let deltaCount = 0;

    for (const key of allKeys) {
      if (prevParams[key] !== currParams[key]) {
        deltaCount++;
      }
    }

    if (deltaCount === 1) {
      votatCount++;
    }
  }

  const systematicRatio =
    simulationRuns.length > 1 ? Number((votatCount / (simulationRuns.length - 1)).toFixed(2)) : 1.0;

  // 2. Measure Hypothesis Revision Latency (time between failed run and next param change or run)
  const latencies: number[] = [];
  for (let i = 0; i < events.length - 1; i++) {
    const ev = events[i];
    if (ev.action === 'run_simulation' && ev.outcome && !ev.outcome.success) {
      // Find the next parameter change or simulation run
      const nextEv = events.slice(i + 1).find((e) => e.action === 'parameter_change' || e.action === 'run_simulation');
      if (nextEv) {
        latencies.push(Math.max(0, nextEv.timestamp - ev.timestamp));
      }
    }
  }

  const avgLatency =
    latencies.length > 0
      ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
      : 3000;

  // 3. Detect Strategic Shift (transition from erratic parameter changes to systematic VOTAT)
  let strategyShift = false;
  if (simulationRuns.length >= 4) {
    const midpoint = Math.floor(simulationRuns.length / 2);
    const firstHalfRuns = simulationRuns.slice(0, midpoint);
    const secondHalfRuns = simulationRuns.slice(midpoint);

    let firstVotat = 0;
    for (let i = 1; i < firstHalfRuns.length; i++) {
      const keys = new Set([...Object.keys(firstHalfRuns[i - 1].parameters), ...Object.keys(firstHalfRuns[i].parameters)]);
      let diff = 0;
      for (const k of keys) {
        if (firstHalfRuns[i - 1].parameters[k] !== firstHalfRuns[i].parameters[k]) diff++;
      }
      if (diff === 1) firstVotat++;
    }

    let secondVotat = 0;
    for (let i = 1; i < secondHalfRuns.length; i++) {
      const keys = new Set([...Object.keys(secondHalfRuns[i - 1].parameters), ...Object.keys(secondHalfRuns[i].parameters)]);
      let diff = 0;
      for (const k of keys) {
        if (secondHalfRuns[i - 1].parameters[k] !== secondHalfRuns[i].parameters[k]) diff++;
      }
      if (diff === 1) secondVotat++;
    }

    const firstRatio = firstHalfRuns.length > 1 ? firstVotat / (firstHalfRuns.length - 1) : 0;
    const secondRatio = secondHalfRuns.length > 1 ? secondVotat / (secondHalfRuns.length - 1) : 0;

    if (secondRatio > firstRatio + 0.3) {
      strategyShift = true;
    }
  }

  // 4. Efficiency Ratio
  const efficiencyRatio = Number(Math.min(1.0, optimalSteps / Math.max(1, totalTrials)).toFixed(2));

  // 5. Resilience Index: sustained focus after failure
  const failureCount = simulationRuns.filter((r) => r.outcome && !r.outcome.success).length;
  let resilienceIndex: ResilienceIndex = 'Developing';
  if (failureCount >= 2) {
    if (avgLatency > 1500 && systematicRatio >= 0.5) {
      resilienceIndex = 'High';
    } else if (systematicRatio >= 0.3) {
      resilienceIndex = 'Moderate';
    }
  } else {
    resilienceIndex = 'High';
  }

  return {
    totalTrials,
    systematicParameterExplorationRatio: systematicRatio,
    averageHypothesisRevisionLatencyMs: avgLatency,
    strategyShiftDetected: strategyShift,
    efficiencyRatio,
    resilienceIndex
  };
}

/**
 * Maps SRL metrics and task convergence to OECD PISA 2025 Proficiency Levels (1 to 6).
 */
export function inferPisaLevel(
  srl: SelfRegulatedLearningMetrics,
  taskCompleted: boolean
): { level: PisaProficiencyLevel; rationale: string } {
  if (taskCompleted) {
    if (srl.systematicParameterExplorationRatio >= 0.75 && srl.efficiencyRatio >= 0.6) {
      return {
        level: 6,
        rationale: 'Level 6: Autonomous mastery. Controlled single-variable experimentation (VOTAT >= 75%) with high convergence efficiency.'
      };
    }
    if (srl.systematicParameterExplorationRatio >= 0.50 || srl.strategyShiftDetected) {
      return {
        level: 5,
        rationale: 'Level 5: Systematic inquiry. Successfully shifted strategy or maintained consistent parameter isolation to reach equilibrium.'
      };
    }
    if (srl.systematicParameterExplorationRatio >= 0.30) {
      return {
        level: 4,
        rationale: 'Level 4: Competent problem solving. Reached physical task completion with localized parameter testing.'
      };
    }
    return {
      level: 3,
      rationale: 'Level 3: Heuristic exploration. Reached solution through multi-variable trial-and-error with low parameter isolation.'
    };
  }

  // Task incomplete or ongoing
  if (srl.systematicParameterExplorationRatio >= 0.40) {
    return {
      level: 2,
      rationale: 'Level 2: Emerging structured exploration. Demonstrates initial hypothesis formulation but hasn’t achieved terminal convergence.'
    };
  }

  return {
    level: 1,
    rationale: 'Level 1: Intuitive / exploratory baseline. High parameter thrashing requiring guided scaffolding.'
  };
}

/**
 * Compiles an end-to-end PISA 2025 process telemetry report.
 */
export function compilePisaProcessReport(
  learnerId: string,
  missionId: string,
  events: readonly PisaTelemetryEvent[],
  options: {
    optimalSteps?: number;
    missionTitle?: string;
  } = {}
): PisaProcessTelemetryReport {
  const completedPhases = Array.from(new Set(events.map((e) => e.phase))) as PisaPhase[];
  const firstTime = events.length > 0 ? events[0].timestamp : Date.now();
  const lastTime = events.length > 0 ? events[events.length - 1].timestamp : firstTime;
  const totalDurationMs = Math.max(0, lastTime - firstTime);

  const optimalSteps = options.optimalSteps ?? 3;
  const srlMetrics = calculateSrlMetrics(events, optimalSteps);

  // Check if final apply phase was successfully completed
  const hasSuccessfulApply = events.some(
    (e) => e.phase === 'apply' && e.action === 'submit_solution' && e.outcome?.success === true
  );

  const { level, rationale } = inferPisaLevel(srlMetrics, hasSuccessfulApply);

  const report: PisaProcessTelemetryReport = {
    missionId,
    learnerId,
    completedPhases,
    totalDurationMs,
    srlMetrics,
    inferredPisaLevel: level,
    levelRationale: rationale,
    generatedAt: new Date().toISOString()
  };

  if (hasSuccessfulApply) {
    (report as any).evidenceAtom = emitLevel4PisaEvidence(learnerId, report, options.missionTitle);
  }

  return report;
}

/**
 * Emits a validated Level 4 Learner Evidence atom into the CREED OS evidence ledger.
 */
export function emitLevel4PisaEvidence(
  learnerId: string,
  report: PisaProcessTelemetryReport,
  missionTitle: string = 'Applied STEM Proving Ground'
): LearnerEvidence {
  const now = new Date().toISOString();
  const competency: CompetencyDomain = 'scientific_inquiry';

  return {
    id: `ev_pisa_${report.missionId}_${Date.now()}`,
    learnerId,
    competency,
    evidenceType: 'mission_artifact',
    sourceType: 'project_mission',
    sourceTitle: `${missionTitle} (PISA 2025 Inquiry Process)`,
    summary: `[OECD PISA 2025 Level ${report.inferredPisaLevel}] Systematic Parameter Exploration: ${Math.round(
      report.srlMetrics.systematicParameterExplorationRatio * 100
    )}% VOTAT isolation. Resilience: ${report.srlMetrics.resilienceIndex}.`,
    observedValue: {
      scoreFraction: Number((report.inferredPisaLevel / 6).toFixed(2)),
      rubricCriteria: {
        pisaLevel: report.inferredPisaLevel,
        systematicVotatRatio: report.srlMetrics.systematicParameterExplorationRatio,
        efficiencyRatio: report.srlMetrics.efficiencyRatio,
        evidenceLevel: 4
      },
      qualitativeNotes: report.levelRationale
    },
    confidence: 0.95,
    evidenceStrength: 4 as const, // Level 4 Applied Mission Task
    status: 'validated' as const,
    visibility: 'learner_only',
    observedAt: now,
    createdAt: now
  };
}
