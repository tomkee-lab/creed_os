import type { AssessmentItem } from '@core-os/domain';

export interface EvaluationResult {
  isCorrect: boolean;
  selectedOptionId: string;
  correctOptionId: string;
  explanation: string;
  misconceptionCode?: string;
  misconceptionDescription?: string;
}

/**
 * Deterministically evaluates a submitted response against an assessment item,
 * diagnosing specific conceptual misconceptions on errors.
 */
export function evaluateItemResponse(
  item: AssessmentItem,
  selectedOptionId: string
): EvaluationResult {
  const isCorrect = selectedOptionId === item.correctOptionId;

  if (isCorrect) {
    return {
      isCorrect: true,
      selectedOptionId,
      correctOptionId: item.correctOptionId,
      explanation: item.explanation
    };
  }

  // Find matching distractor for misconception diagnosis
  const distractor = item.distractors.find((d) => d.id === selectedOptionId);

  return {
    isCorrect: false,
    selectedOptionId,
    correctOptionId: item.correctOptionId,
    explanation: item.explanation,
    misconceptionCode: distractor?.misconceptionCode ?? 'GENERIC_INCORRECT',
    misconceptionDescription:
      distractor?.misconceptionDescription ?? 'Incorrect choice based on invalid reasoning.'
  };
}
