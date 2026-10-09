import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const MISSION_CATALOG: Record<string, any> = {
  robobridge: {
    id: 'robobridge',
    title: 'RoboBridge Structural Optimization Challenge',
    code: 'MISSION-ROBOT-01',
    domain: 'spatial_reasoning',
    gradeBand: 'Middle Stage (Classes 6–8)',
    spanMeters: 12,
    maxMassKg: 250,
    targetRatio: 4.5,
    roverMassKg: 1200,
    brief:
      'An autonomous planetary exploration rover needs to cross a 12-meter terrain chasm on an unpaved survey site. Design a bridge truss that withstands the rover load with minimal structural mass.',
    rubricCriteria: [
      {
        criterion: 'Strength-to-Weight Ratio',
        target: '≥ 4.5x load capacity',
        importance: 'Primary'
      },
      {
        criterion: 'Structural Mass Ceiling',
        target: '≤ 250 kg total mass',
        importance: 'Mandatory'
      },
      {
        criterion: 'Center-Span Deflection',
        target: '< 18 mm under full test load',
        importance: 'Safety Margin'
      }
    ]
  },
  'climate-sensor': {
    id: 'climate-sensor',
    title: 'Urban Heat Island Pattern Discovery',
    code: 'MISSION-DATA-01',
    domain: 'computational_thinking',
    gradeBand: 'Middle Stage (Classes 6–8)',
    spanMeters: 0,
    maxMassKg: 100,
    targetRatio: 5.0,
    roverMassKg: 500,
    brief:
      'Analyze 10,000 spatial telemetry temperature feeds from urban sensors, filter noise artifacts, and isolate microclimate heat anomalies.',
    rubricCriteria: [
      {
        criterion: 'Data Cleaning Completeness',
        target: 'Eliminate 100% sensor drift artifacts',
        importance: 'Primary'
      },
      {
        criterion: 'Statistical Confidence',
        target: '≥ 95% Confidence Interval on delta-T',
        importance: 'Mandatory'
      }
    ]
  }
};

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.session || !locals.user) {
    throw redirect(303, `/login?next=/student/missions/${params.id}`);
  }

  const { id } = params;
  const mission = MISSION_CATALOG[id];

  if (!mission) {
    throw error(404, `Mission '${id}' not found in curriculum catalog.`);
  }

  return {
    mission
  };
};
