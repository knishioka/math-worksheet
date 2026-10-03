import type { CalculationPattern, Grade } from '../types';
import { getLearningStages } from './learning-paths';
import {
  getAvailableCategories,
  getPatternDifficulty,
} from './pattern-categories';

export type PatternSortOrder = 'learning' | 'difficulty';

/** 道すじの順序を優先し、道すじ以外の教材は難易度順に続ける。 */
export function getDiscoveryGroups(
  patterns: CalculationPattern[],
  grade: Grade,
  order: PatternSortOrder = 'learning'
): ReturnType<typeof getAvailableCategories> {
  const learningOrder = new Map(
    getLearningStages(grade)
      .flatMap((stage) => stage.patterns)
      .map((pattern, index) => [pattern, index])
  );
  return getAvailableCategories(patterns).map((group) => ({
    ...group,
    patterns: [...group.patterns].sort((a, b) => {
      const learningDifference =
        (learningOrder.get(a) ?? Number.MAX_SAFE_INTEGER) -
        (learningOrder.get(b) ?? Number.MAX_SAFE_INTEGER);
      if (order === 'learning' && learningDifference !== 0)
        return learningDifference;
      return getPatternDifficulty(a) - getPatternDifficulty(b);
    }),
  }));
}
