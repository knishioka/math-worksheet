import type { Operation, WordProblem } from '../../types';

export type EntranceContent = Omit<WordProblem, 'id'>;

export function entranceWord(
  problemText: string,
  answer: number,
  unit: string,
  solutionSteps: string[],
  operation: Operation = 'division'
): EntranceContent {
  return {
    type: 'word',
    operation,
    problemText,
    answer,
    unit,
    solutionSteps,
    showCalculation: true,
  };
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}
