import type { AssessmentItem } from '@core-os/domain';
import { calculateFisherInformation } from '../irt/three_pl.js';

export interface SelectionCriteria {
  currentTheta: number;
  administeredItemIds: string[];
  preferredCompetencies?: string[];
}

export interface SelectionResult {
  selectedItem: AssessmentItem | null;
  fisherInformation: number;
  remainingPoolSize: number;
  isTestComplete: boolean;
  reason?: string;
}

/**
 * Selects the next optimal assessment item via Maximum Fisher Information.
 */
export function selectNextAdaptiveItem(
  pool: AssessmentItem[],
  criteria: SelectionCriteria,
  stoppingRules: { minItems: number; maxItems: number; targetSE: number; currentSE: number }
): SelectionResult {
  const { currentTheta, administeredItemIds, preferredCompetencies } = criteria;
  const { minItems, maxItems, targetSE, currentSE } = stoppingRules;

  // Stopping Condition 1: Max items reached
  if (administeredItemIds.length >= maxItems) {
    return {
      selectedItem: null,
      fisherInformation: 0,
      remainingPoolSize: 0,
      isTestComplete: true,
      reason: 'Maximum item threshold reached'
    };
  }

  // Stopping Condition 2: Min items reached AND standard error target achieved
  if (administeredItemIds.length >= minItems && currentSE <= targetSE) {
    return {
      selectedItem: null,
      fisherInformation: 0,
      remainingPoolSize: 0,
      isTestComplete: true,
      reason: 'Standard error convergence achieved'
    };
  }

  // Filter out already administered items
  const eligibleItems = pool.filter(
    (item) => !administeredItemIds.includes(item.id) && item.status !== 'retired'
  );

  if (eligibleItems.length === 0) {
    return {
      selectedItem: null,
      fisherInformation: 0,
      remainingPoolSize: 0,
      isTestComplete: true,
      reason: 'Item pool exhausted'
    };
  }

  // Calculate Fisher Information for each candidate at currentTheta
  let bestItem: AssessmentItem | null = null;
  let maxInfo = -1;

  for (const item of eligibleItems) {
    let info = calculateFisherInformation(currentTheta, item.irt);

    // Minor boost if this item satisfies preferred competency diversity
    if (preferredCompetencies && preferredCompetencies.includes(item.competency)) {
      info *= 1.15;
    }

    if (info > maxInfo) {
      maxInfo = info;
      bestItem = item;
    }
  }

  return {
    selectedItem: bestItem,
    fisherInformation: Math.round(maxInfo * 1000) / 1000,
    remainingPoolSize: eligibleItems.length - 1,
    isTestComplete: false
  };
}
