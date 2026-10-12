import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSupabaseAdminClient } from '$lib/server/supabase';
import { coreRepository } from '$lib/server/repository';
import { calculateFisherInformation } from '@core-os/assessment';
import type { AssessmentItem } from '@core-os/domain';

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.session || !locals.user) {
    return json({ error: 'Unauthorized: Active session required' }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const {
      queryEmbedding,
      currentTheta = 0.0,
      matchThreshold = 0.5,
      matchCount = 5,
      administeredItemIds = []
    } = body;

    const supabase = getSupabaseAdminClient();
    let matchedSkills: Array<{
      id: string;
      competency_id: string;
      code: string;
      title: string;
      description: string;
      similarity?: number;
    }> = [];

    // 1. If an embedding vector is provided, execute pgvector RPC match_skills
    if (supabase && queryEmbedding && Array.isArray(queryEmbedding) && queryEmbedding.length === 1536) {
      const { data, error } = await supabase.rpc('match_skills', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount
      });

      if (!error && data) {
        matchedSkills = data;
      }
    }

    // Fallback: If no embedding or RPC didn't return, pull from Supabase skills directly or repository
    if (matchedSkills.length === 0 && supabase) {
      const { data } = await supabase
        .from('skills')
        .select('id, competency_id, code, title, description')
        .limit(matchCount);

      if (data && data.length > 0) {
        matchedSkills = data;
      }
    }

    // 2. Adaptive Item Selection via Maximum Fisher Information (CAT 3PL IRT)
    const allItems = coreRepository.getItemBank();
    const eligibleItems = allItems.filter(
      (item) => !administeredItemIds.includes(item.id) && item.status !== 'retired'
    );

    // Score candidates based on Fisher Information at learner's current theta
    const candidatesWithInfo = eligibleItems.map((item) => {
      const fisherInfo = calculateFisherInformation(currentTheta, item.irt);
      return {
        item: {
          id: item.id,
          code: item.code,
          prompt: item.prompt,
          competency: item.competency
        },
        fisherInformation: Math.round(fisherInfo * 1000) / 1000
      };
    });

    // Sort descending by Fisher Information
    candidatesWithInfo.sort((a, b) => b.fisherInformation - a.fisherInformation);

    const nextOptimalItem = candidatesWithInfo[0]?.item || null;

    return json({
      success: true,
      currentTheta,
      matchedSkills,
      nextOptimalItem,
      topCandidates: candidatesWithInfo.slice(0, 3)
    });
  } catch (err: any) {
    console.error('[match_skills API] Error executing skill matching:', err);
    return json({ error: err.message || 'Internal skill match error' }, { status: 500 });
  }
};
