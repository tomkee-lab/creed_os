/**
 * types.ts — Commercial Planetary Telemetry Types for CREED OS
 * 100% Clean-Room & Permissive Type Contracts
 */

export interface TelemetryEntity {
  id: string;
  name: string;
  type: 'satellite' | 'flight' | 'hazard' | 'cyclone' | 'ground-station';
  lat: number;
  lon: number;
  altM: number;
  headingDeg?: number;
  speedKmh?: number;
  description: string;
  evidence: {
    source: string;
    license: string;
    rawPayload: Record<string, any>;
    calculationProof?: string;
  };
}

export interface SatelliteOrbit {
  id: string;
  name: string;
  noradId: number;
  tleLine1: string;
  tleLine2: string;
  category: 'station' | 'scientific' | 'weather' | 'navigation';
}

export interface EducationalMission {
  id: string;
  title: string;
  category: 'Physics' | 'Geography' | 'Aeronautics';
  gradeBand: 'Classes 5–8' | 'Classes 9–10' | 'Classes 11–12';
  objective: string;
  contextSentence: string;
  targetEntityId: string;
  targetCoordinates: [number, number]; // [lon, lat]
  cameraAltitudeM: number;
  instructions: string[];
  expectedValue: number;
  unit: string;
  tolerancePct: number;
}

export type SensorVisionMode = 'natural' | 'flir' | 'nvg';
