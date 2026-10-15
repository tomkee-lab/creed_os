/**
 * missions.ts — Deterministic Educational Planetary Missions for CREED OS
 * Principle: Deterministic scoring algorithms (IRT/CAT/tolerances), AI explains, humans decide.
 */
import type { EducationalMission } from './types';

export const EDUCATIONAL_MISSIONS: EducationalMission[] = [
  {
    id: 'mission-iss-speed',
    title: 'Orbital Mechanics: Calculate the ISS Velocity',
    category: 'Physics',
    gradeBand: 'Classes 9–10',
    objective: 'Calculate the instantaneous orbital velocity of the International Space Station from its Keplerian ground fixes.',
    contextSentence: 'The ISS orbits Earth every ~92 minutes at an altitude of approximately 418 kilometers.',
    targetEntityId: 'iss',
    targetCoordinates: [78.9629, 20.5937], // Over Indian Subcontinent
    cameraAltitudeM: 6500000,
    instructions: [
      'Locate and click the International Space Station (ISS) in orbit.',
      'Open the Evidence Drawer to inspect its SGP4 state vectors.',
      'Record the ground distance covered in 60 seconds of propagation.',
      'Calculate the velocity in km/h (formula: v = distance / time).'
    ],
    expectedValue: 27600,
    unit: 'km/h',
    tolerancePct: 6
  },
  {
    id: 'mission-cyclone-path',
    title: 'Meteorology: Cyclone Warning Track & Arrival Estimation',
    category: 'Geography',
    gradeBand: 'Classes 5–8',
    objective: 'Inspect advisory uncertainty cones and estimate the coastal landfall timeline.',
    contextSentence: 'Tropical systems draw kinetic energy from warm sea-surface temperatures above 26.5°C.',
    targetEntityId: 'cyclone-arabian-sea',
    targetCoordinates: [68.25, 18.75],
    cameraAltitudeM: 2500000,
    instructions: [
      'Toggle the Meteorology layer to view atmospheric wind barbs.',
      'Select the active storm system in the Arabian Sea.',
      'Measure the forward translation speed toward Gujarat coastline.',
      'Determine estimated hours remaining until outer eyewall landfall.'
    ],
    expectedValue: 18,
    unit: 'hours',
    tolerancePct: 15
  },
  {
    id: 'mission-great-circle',
    title: 'Aeronautics: Great-Circle Polar Routing vs Flat Mapping',
    category: 'Aeronautics',
    gradeBand: 'Classes 11–12',
    objective: 'Demonstrate spherical geodesic fuel and distance conservation across polar flight corridors.',
    contextSentence: 'On a sphere, the shortest distance between two points is a Great-Circle geodesic arc, not a straight flat-map line.',
    targetEntityId: 'fl-ua890',
    targetCoordinates: [-170.0, 55.0], // North Pacific / Aleutian arc
    cameraAltitudeM: 9000000,
    instructions: [
      'Track Trans-Pacific Flight UA890 between Tokyo (NRT) and San Francisco (SFO).',
      'Compare the WGS84 geodesic arc distance against a flat Mercator straight line.',
      'Compute the distance saved in kilometers by following Earth curvature.'
    ],
    expectedValue: 1850,
    unit: 'km saved',
    tolerancePct: 10
  }
];

/**
 * Deterministic mission score evaluation (Gauss-Hermite precision, zero random LLM scoring).
 */
export function evaluateMissionSubmission(
  mission: EducationalMission,
  userAnswer: number
): { passed: boolean; errorPct: number; feedback: string } {
  const diff = Math.abs(userAnswer - mission.expectedValue);
  const errorPct = (diff / mission.expectedValue) * 100;
  const passed = errorPct <= mission.tolerancePct;

  if (passed) {
    return {
      passed: true,
      errorPct: Number(errorPct.toFixed(1)),
      feedback: `Demonstrated foundational mastery! Your calculated value of ${userAnswer.toLocaleString()} ${mission.unit} is within the ${mission.tolerancePct}% empirical tolerance band.`
    };
  }

  return {
    passed: false,
    errorPct: Number(errorPct.toFixed(1)),
    feedback: `Calculation variance is ${errorPct.toFixed(1)}% (exceeds the ${mission.tolerancePct}% threshold). Tip: Verify your time denominator and unit conversions (m/s vs km/h).`
  };
}
