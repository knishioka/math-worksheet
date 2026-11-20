import type { Operation, WordProblem, WordProblemEn } from '../../types';

/** "1 pencil" / "2 pencils" */
export function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export type EntranceEnContent = Omit<WordProblemEn, 'id'>;

export function entranceWordEn(
  problemText: string,
  answer: WordProblemEn['answer'],
  unit: string,
  solutionSteps: string[],
  operation: Operation = 'division'
): EntranceEnContent {
  return {
    type: 'word-en',
    operation,
    problemText,
    answer,
    unit,
    solutionSteps,
    showCalculation: true,
    category: 'word-story',
    language: 'en',
  };
}

export type EntranceContent = Omit<WordProblem, 'id'>;

export function entranceWord(
  problemText: string,
  answer: WordProblem['answer'],
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
