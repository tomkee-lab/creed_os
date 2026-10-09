import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
  if (!locals.session || !locals.user) {
    throw redirect(303, `/login?next=/student/missions/${params.id}`);
  }

  const { id } = params;

  if (id !== 'robobridge' && id !== 'climate-sensor') {
    // Graceful fallback for demo
  }

  const mission = {
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
  };

  return {
    mission
  };
};
