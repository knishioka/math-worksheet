import type { WorksheetFigure } from '../../../types';

type Pair = readonly [string, string];

export interface StudioExercise {
  question: Pair;
  answer: number | string;
  unit: Pair;
  reasoning: Pair;
  calculation: string;
  figure?: WorksheetFigure;
}

export function exercise(
  question: Pair,
  answer: number | string,
  unit: Pair,
  reasoning: Pair,
  calculation: string,
  figure?: WorksheetFigure
): StudioExercise {
  return { question, answer, unit, reasoning, calculation, figure };
}
