export interface SocraticTurn {
  role: 'user' | 'assistant';
  content: string;
}

export const SOCRATIC_SYSTEM_PROMPT = `
You are the CREED OS Socratic Mentor, an age-appropriate (Ages 10–16 / Grades 5–10) guide for STEM, reasoning, and critical thinking.

PEDAGOGICAL & SAFETY GUARDRAILS:
1. NEVER dump the final answer or write the solution directly.
2. Guide the learner by asking a single, high-leverage question that helps them decompose the problem.
3. If the learner expresses confusion, prompt them to identify what they already know from the problem statement.
4. Validate effort and persistence, not raw speed or intelligence.
5. NEVER assign an IQ score, clinical psychological diagnosis, or tell a learner they cannot pursue a pathway.
6. Keep explanations concise (2 to 4 sentences maximum) so the student stays active.
`.trim();

/**
 * Deterministic Socratic dialogue fallback for offline use or when no GEMINI_API_KEY is configured.
 */
export function generateDeterministicSocraticResponse(
  userQuery: string,
  history: SocraticTurn[] = []
): { reply: string; extractedObservation?: { competency: string; note: string } } {
  const query = userQuery.toLowerCase();

  // Balance scale or algebraic equation queries
  if (query.includes('balance') || query.includes('equation') || query.includes('sphere') || query.includes('algebra')) {
    return {
      reply: 'Great problem to decompose! When looking at a balance in equilibrium, what happens to both pans if you remove the exact same item from each side? Try taking away one sphere from both sides.',
      extractedObservation: {
        competency: 'quantitative_reasoning',
        note: 'Engaged with multi-variable balance scale decomposition prompt.'
      }
    };
  }

  // Gear trains, ratios, rotations
  if (query.includes('gear') || query.includes('teeth') || query.includes('rotation') || query.includes('ratio')) {
    return {
      reply: 'Think about how meshed gears interact: when a small gear with fewer teeth turns, does the bigger connected gear turn faster or slower? What does that tell you about the relationship between teeth count and total turns?',
      extractedObservation: {
        competency: 'quantitative_reasoning',
        note: 'Explored inverse proportion mechanics in gear trains.'
      }
    };
  }

  // Spatial rotations or 3D cubes
  if (query.includes('cube') || query.includes('rotate') || query.includes('faces') || query.includes('spatial')) {
    return {
      reply: 'Let’s visualize the geometry step-by-step. On a 3x3x3 painted cube, corner cubes touch 3 exterior faces. Where do the cubes with paint on exactly 2 faces sit: on the corners, along the edges, or in the center of the faces?',
      extractedObservation: {
        competency: 'spatial_reasoning',
        note: 'Investigated 3D cube edge vs face topological properties.'
      }
    };
  }

  // Logic, conditional rules, or rovers
  if (query.includes('rule') || query.includes('rover') || query.includes('card') || query.includes('logic')) {
    return {
      reply: 'Let’s test the exact logical condition. If the rule says "If Motor, then Even Code", what would prove this rule FALSE: finding a Motor with an Odd code, or finding another subsystem with an Even code?',
      extractedObservation: {
        competency: 'logical_deduction',
        note: 'Addressed conditional hypothesis falsification logic.'
      }
    };
  }

  // Default pedagogical Socratic prompt
  return {
    reply: 'That is an intriguing question. Before we dive into the calculations, what is the single most important clue given to you in the prompt, and what are you trying to find?',
    extractedObservation: {
      competency: 'metacognition',
      note: 'Prompted for initial problem decomposition and goal identification.'
    }
  };
}
