import { coreRepository } from '$lib/server/repository';
import { calibrateItemParameters, type CalibrationSample } from '@core-os/assessment';
import { getDbPool } from '$lib/server/supabase';

export interface RecalibrationJobPayload {
  organizationId?: string;
  itemIds?: string[];
  windowDays?: number;
}

export interface RecalibrationJobResult {
  itemsProcessed: number;
  parametersUpdated: number;
  flaggedDIFItems: string[];
  completedAt: string;
}

export async function runBatchRecalibrationJob(
  payload: RecalibrationJobPayload = {}
): Promise<RecalibrationJobResult> {
  const windowDays = payload.windowDays ?? 7;
  const pool = getDbPool();
  let itemsProcessed = 0;
  let parametersUpdated = 0;
  const flaggedDIFItems: string[] = [];

  const targetItemIds = payload.itemIds && payload.itemIds.length > 0
    ? payload.itemIds
    : coreRepository.getItemBank().map((i) => i.id);

  if (pool) {
    try {
      const sinceDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
      const orgId = payload.organizationId || null;
      const res = await pool.query(
        `WITH session_responses AS (
           SELECT
             r.id,
             r.session_id,
             r.item_id,
             r.is_correct,
             r.created_at,
             COALESCE(
               LAG(r.theta_after) OVER (PARTITION BY r.session_id ORDER BY r.created_at ASC),
               s.current_theta,
               0.0
             ) as theta_before
           FROM assessment_responses r
           JOIN assessment_sessions s ON s.id = r.session_id
           WHERE ($2::text IS NULL OR s.organization_id = $2::uuid)
         )
         SELECT item_id, is_correct, theta_before
         FROM session_responses
         WHERE created_at >= $1
         ORDER BY created_at ASC`,
        [sinceDate, orgId]
      );

      const samplesByItem = new Map<string, CalibrationSample[]>();
      for (const row of res.rows) {
        if (!targetItemIds.includes(row.item_id)) continue;
        const list = samplesByItem.get(row.item_id) || [];
        list.push({
          learnerTheta: Number(row.theta_before || 0),
          isCorrect: Boolean(row.is_correct)
        });
        samplesByItem.set(row.item_id, list);
      }

      for (const itemId of targetItemIds) {
        itemsProcessed++;
        const samples = samplesByItem.get(itemId);
        if (samples && samples.length >= 5) {
          const calibration = calibrateItemParameters(samples);
          if (calibration.converged) {
            parametersUpdated++;
            const currentItem = coreRepository.getItemById(itemId);
            if (currentItem && Math.abs(currentItem.irt.b - calibration.b) > 1.0) {
              flaggedDIFItems.push(itemId);
            }
          }
        }
      }
    } catch (err) {
      console.error('[Trigger.dev:batchRecalibration] Database query error:', err);
      throw err;
    }
  } else {
    // Local memory / dev fallback using active item bank
    for (const itemId of targetItemIds) {
      itemsProcessed++;
    }
  }

  return {
    itemsProcessed,
    parametersUpdated,
    flaggedDIFItems,
    completedAt: new Date().toISOString()
  };
}
