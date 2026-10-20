import { describe, it, expect } from 'vitest';
import {
  calculateSrlMetrics,
  inferPisaLevel,
  compilePisaProcessReport,
  emitLevel4PisaEvidence,
  type PisaTelemetryEvent
} from '../src/process-telemetry.js';

describe('OECD PISA 2025 Process Telemetry & SRL Metrics Engine', () => {
  describe('calculateSrlMetrics', () => {
    it('returns baseline default metrics when event stream is empty', () => {
      const metrics = calculateSrlMetrics([]);
      expect(metrics.totalTrials).toBe(0);
      expect(metrics.systematicParameterExplorationRatio).toBe(0);
      expect(metrics.averageHypothesisRevisionLatencyMs).toBe(0);
      expect(metrics.strategyShiftDetected).toBe(false);
      expect(metrics.efficiencyRatio).toBe(0);
      expect(metrics.resilienceIndex).toBe('Developing');
    });

    it('measures 100% VOTAT (Vary One Thing At A Time) when one parameter changes per run', () => {
      const now = 1700000000000;
      const events: PisaTelemetryEvent[] = [
        {
          timestamp: now,
          phase: 'learn',
          action: 'run_simulation',
          parameters: { frequencyHz: 50.0, solarGenMw: 120, batteryDrainMw: 30 },
          outcome: { success: false, deviation: 0.8 }
        },
        {
          timestamp: now + 5000,
          phase: 'learn',
          action: 'run_simulation',
          // Only solarGenMw changed from 120 to 140
          parameters: { frequencyHz: 50.0, solarGenMw: 140, batteryDrainMw: 30 },
          outcome: { success: false, deviation: 0.4 }
        },
        {
          timestamp: now + 10000,
          phase: 'learn',
          action: 'run_simulation',
          // Only batteryDrainMw changed from 30 to 45
          parameters: { frequencyHz: 50.0, solarGenMw: 140, batteryDrainMw: 45 },
          outcome: { success: true }
        }
      ];

      const metrics = calculateSrlMetrics(events, 3);
      expect(metrics.totalTrials).toBe(3);
      expect(metrics.systematicParameterExplorationRatio).toBe(1.0);
      expect(metrics.efficiencyRatio).toBe(1.0); // 3 optimal / 3 actual
    });

    it('penalizes VOTAT ratio when multiple parameters are changed simultaneously', () => {
      const now = 1700000000000;
      const events: PisaTelemetryEvent[] = [
        {
          timestamp: now,
          phase: 'learn',
          action: 'run_simulation',
          parameters: { voltage: 100, agarosePercent: 1.0, runTimeMinutes: 30 }
        },
        {
          timestamp: now + 4000,
          phase: 'learn',
          action: 'run_simulation',
          // All 3 parameters changed simultaneously (erratic thrashing)
          parameters: { voltage: 150, agarosePercent: 2.0, runTimeMinutes: 60 }
        }
      ];

      const metrics = calculateSrlMetrics(events, 2);
      expect(metrics.totalTrials).toBe(2);
      expect(metrics.systematicParameterExplorationRatio).toBe(0.0);
    });

    it('detects strategy shift when learner transitions from erratic changes to VOTAT isolation', () => {
      const now = 1700000000000;
      const events: PisaTelemetryEvent[] = [
        // First half: erratic multi-variable thrashing
        { timestamp: now + 1000, phase: 'apply', action: 'run_simulation', parameters: { p1: 10, p2: 10 } },
        { timestamp: now + 2000, phase: 'apply', action: 'run_simulation', parameters: { p1: 20, p2: 30 } }, // 2 changed
        { timestamp: now + 3000, phase: 'apply', action: 'run_simulation', parameters: { p1: 40, p2: 50 } }, // 2 changed

        // Second half: systematic 1-variable isolation
        { timestamp: now + 5000, phase: 'apply', action: 'run_simulation', parameters: { p1: 45, p2: 50 } }, // only p1 changed
        { timestamp: now + 8000, phase: 'apply', action: 'run_simulation', parameters: { p1: 50, p2: 50 } }, // only p1 changed
        { timestamp: now + 11000, phase: 'apply', action: 'run_simulation', parameters: { p1: 50, p2: 55 } } // only p2 changed
      ];

      const metrics = calculateSrlMetrics(events, 3);
      expect(metrics.strategyShiftDetected).toBe(true);
    });
  });

  describe('inferPisaLevel', () => {
    it('infers Level 6 for completed tasks with high VOTAT and high efficiency', () => {
      const srl = {
        totalTrials: 3,
        systematicParameterExplorationRatio: 0.85,
        averageHypothesisRevisionLatencyMs: 3500,
        strategyShiftDetected: false,
        efficiencyRatio: 0.8,
        resilienceIndex: 'High' as const
      };

      const result = inferPisaLevel(srl, true);
      expect(result.level).toBe(6);
      expect(result.rationale).toContain('Autonomous mastery');
    });

    it('infers Level 5 for completed tasks with systematic inquiry or strategic shift', () => {
      const srl = {
        totalTrials: 5,
        systematicParameterExplorationRatio: 0.60,
        averageHypothesisRevisionLatencyMs: 2500,
        strategyShiftDetected: true,
        efficiencyRatio: 0.5,
        resilienceIndex: 'High' as const
      };

      const result = inferPisaLevel(srl, true);
      expect(result.level).toBe(5);
      expect(result.rationale).toContain('Systematic inquiry');
    });

    it('infers Level 4 for completed tasks with localized trial and error', () => {
      const srl = {
        totalTrials: 8,
        systematicParameterExplorationRatio: 0.35,
        averageHypothesisRevisionLatencyMs: 1200,
        strategyShiftDetected: false,
        efficiencyRatio: 0.35,
        resilienceIndex: 'Moderate' as const
      };

      const result = inferPisaLevel(srl, true);
      expect(result.level).toBe(4);
    });

    it('infers Level 2 or 1 for incomplete tasks', () => {
      const srlStructured = {
        totalTrials: 4,
        systematicParameterExplorationRatio: 0.45,
        averageHypothesisRevisionLatencyMs: 2000,
        strategyShiftDetected: false,
        efficiencyRatio: 0.25,
        resilienceIndex: 'Moderate' as const
      };
      expect(inferPisaLevel(srlStructured, false).level).toBe(2);

      const srlErratic = {
        totalTrials: 4,
        systematicParameterExplorationRatio: 0.1,
        averageHypothesisRevisionLatencyMs: 800,
        strategyShiftDetected: false,
        efficiencyRatio: 0.1,
        resilienceIndex: 'Developing' as const
      };
      expect(inferPisaLevel(srlErratic, false).level).toBe(1);
    });
  });

  describe('compilePisaProcessReport & Level 4 Evidence Emission', () => {
    it('compiles comprehensive report and attaches Level 4 Learner Evidence on task success', () => {
      const now = 1700000000000;
      const events: PisaTelemetryEvent[] = [
        { timestamp: now, phase: 'show', action: 'view_formula', parameters: { inspected: true } },
        { timestamp: now + 3000, phase: 'learn', action: 'request_scaffold_hint', parameters: { hintLevel: 1 } },
        { timestamp: now + 6000, phase: 'learn', action: 'run_simulation', parameters: { loadMw: 100 }, outcome: { success: false } },
        { timestamp: now + 9000, phase: 'apply', action: 'parameter_change', parameters: { loadMw: 120 } },
        { timestamp: now + 12000, phase: 'apply', action: 'run_simulation', parameters: { loadMw: 120 }, outcome: { success: true } },
        { timestamp: now + 14000, phase: 'apply', action: 'submit_solution', parameters: { verified: true }, outcome: { success: true } }
      ];

      const report = compilePisaProcessReport('learner-xyz', 'smart-grid-balancing', events, {
        missionTitle: 'Smart Grid Load Balancing',
        optimalSteps: 3
      });

      expect(report.missionId).toBe('smart-grid-balancing');
      expect(report.learnerId).toBe('learner-xyz');
      expect(report.completedPhases).toEqual(['show', 'learn', 'apply']);
      expect(report.totalDurationMs).toBe(14000);
      expect(report.inferredPisaLevel).toBeGreaterThanOrEqual(4);
      expect(report.evidenceAtom).toBeDefined();

      if (report.evidenceAtom) {
        expect(report.evidenceAtom.evidenceStrength).toBe(4);
        expect(report.evidenceAtom.competency).toBe('scientific_inquiry');
        expect(report.evidenceAtom.sourceTitle).toContain('Smart Grid Load Balancing');
        expect(report.evidenceAtom.status).toBe('validated');
      }
    });
  });
});
