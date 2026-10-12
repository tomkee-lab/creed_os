import type { AssessmentItem } from '@core-os/domain';
import { STEM_BENCHMARK_ITEMS } from './stemBank.js';
import { ENGLISH_BENCHMARK_ITEMS } from './englishBank.js';
import { ROBOTICS_BENCHMARK_ITEMS } from './roboticsBank.js';

export { STEM_BENCHMARK_ITEMS } from './stemBank.js';
export { ENGLISH_BENCHMARK_ITEMS } from './englishBank.js';
export { ROBOTICS_BENCHMARK_ITEMS } from './roboticsBank.js';

/**
 * Unified 90-Item Psychometrically Calibrated Item Bank
 * 30 STEM + 30 English + 30 Robotics items
 */
export const CALIBRATED_ITEM_BANK: AssessmentItem[] = [
  ...STEM_BENCHMARK_ITEMS,
  ...ENGLISH_BENCHMARK_ITEMS,
  ...ROBOTICS_BENCHMARK_ITEMS
];

/**
 * Retrieve calibrated items filtered by specific assessment domain
 */
export function getBenchmarkItemsByDomain(
  domain: 'stem' | 'stem_reasoning' | 'english' | 'language_literacy' | 'robotics' | 'computational_thinking' | 'all'
): AssessmentItem[] {
  switch (domain) {
    case 'stem':
    case 'stem_reasoning':
      return STEM_BENCHMARK_ITEMS;
    case 'english':
    case 'language_literacy':
      return ENGLISH_BENCHMARK_ITEMS;
    case 'robotics':
    case 'computational_thinking':
      return ROBOTICS_BENCHMARK_ITEMS;
    default:
      return CALIBRATED_ITEM_BANK;
  }
}
