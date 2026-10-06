import type { PageServerLoad } from './$types';
import { coreRepository } from '$lib/server/repository';

export const load: PageServerLoad = async () => {
  const itemBank = coreRepository.getItemBank();

  // Compute item bank psychometric metrics
  const totalItems = itemBank.length;
  let sumA = 0;
  let minB = Infinity;
  let maxB = -Infinity;
  const domainCounts: Record<string, number> = {};

  for (const item of itemBank) {
    sumA += item.irt.a;
    minB = Math.min(minB, item.irt.b);
    maxB = Math.max(maxB, item.irt.b);
    domainCounts[item.competency] = (domainCounts[item.competency] ?? 0) + 1;
  }

  const meanDiscrimination = Number((sumA / Math.max(1, totalItems)).toFixed(2));
  const difficultySpan = `${minB.toFixed(1)} to +${maxB.toFixed(1)}`;

  return {
    itemBank,
    metrics: {
      totalItems,
      meanDiscrimination,
      difficultySpan,
      domainCounts
    }
  };
};
