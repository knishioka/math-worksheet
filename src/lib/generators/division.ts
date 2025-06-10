import type { BasicProblem, WorksheetSettings } from '../../types';
import { randomInt, generateId } from '../utils/math';

export interface DivisionOptions {
  minDividend?: number;
  maxDividend?: number;
  minDivisor?: number;
  maxDivisor?: number;
  allowRemainder?: boolean;
  exactDivisionOnly?: boolean;
  maxQuotient?: number;
  timesTableBased?: boolean; // Generate based on known times tables
}

/**
 * Generate division problems based on grade level and settings
 */
export function generateDivisionProblem(
  settings: WorksheetSettings,
  options: DivisionOptions = {}
): BasicProblem {
  const {
    minDividend = 2,
    maxDividend = settings.maxNumber || 100,
    minDivisor = 2,
    maxDivisor = 12,
    allowRemainder = true,
    exactDivisionOnly = false,
    maxQuotient = 100,
    timesTableBased = true,
  } = options;

  let dividend: number = minDividend;
  let divisor: number = minDivisor;
  let quotient: number = 1;
  let remainder: number = 0;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    if (timesTableBased && !allowRemainder) {
      // Generate based on multiplication facts for exact division
      quotient = randomInt(1, maxQuotient);
      divisor = randomInt(minDivisor, maxDivisor);
      dividend = quotient * divisor;
      remainder = 0;
    } else {
      dividend = randomInt(minDividend, maxDividend);
      divisor = randomInt(minDivisor, Math.min(maxDivisor, dividend));
      quotient = Math.floor(dividend / divisor);
      remainder = dividend % divisor;
    }

    attempts++;

    // Check constraints
    if (exactDivisionOnly && remainder !== 0) continue;
    if (!allowRemainder && remainder !== 0) continue;
    if (quotient > maxQuotient) continue;
    if (dividend > maxDividend) continue;

    break;
  }

  // For basic problems, we typically show the quotient as the answer
  // For problems with remainder, the answer would be represented differently
  const answer = allowRemainder && remainder > 0 
    ? quotient // We'll handle remainder display in the UI
    : quotient;

  return {
    id: generateId(),
    type: 'basic',
    operation: 'division',
    operand1: dividend,
    operand2: divisor,
    answer,
  };
}

/**
 * Generate multiple division problems
 */
export function generateDivisionProblems(
  settings: WorksheetSettings,
  count: number,
  options: DivisionOptions = {}
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: BasicProblem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      problem = generateDivisionProblem(settings, options);
      const key = `${problem.operand1}÷${problem.operand2}`;

      if (!usedCombinations.has(key)) {
        usedCombinations.add(key);
        break;
      }

      attempts++;
    } while (attempts < maxAttempts);

    problems.push(problem);
  }

  return problems;
}

/**
 * Generate grade-appropriate division problems
 */
export function generateGradeDivisionProblems(
  grade: number,
  count: number
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: grade as 1 | 2 | 3 | 4 | 5 | 6,
    problemType: 'basic',
    operation: 'division',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (grade) {
    case 1:
    case 2:
      // 1・2年生: 割り算は学習しない
      return [];

    case 3:
      // 3年生: 基本的な割り算の導入、九九ベース
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 6,
        maxDividend: 81,
        minDivisor: 2,
        maxDivisor: 9,
        exactDivisionOnly: true,
        timesTableBased: true,
        maxQuotient: 9,
      });

    case 4:
      // 4年生: あまりのある割り算
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 10,
        maxDividend: 100,
        minDivisor: 2,
        maxDivisor: 12,
        allowRemainder: true,
        maxQuotient: 20,
      });

    case 5:
    case 6:
      // 5・6年生: 多桁数の割り算、小数・分数は別途実装
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 100,
        maxDividend: 999,
        minDivisor: 2,
        maxDivisor: 25,
        allowRemainder: true,
        maxQuotient: 100,
      });

    default:
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 6,
        maxDividend: 50,
        minDivisor: 2,
        maxDivisor: 10,
        exactDivisionOnly: true,
      });
  }
}

/**
 * Generate division problems based on specific times tables
 */
export function generateTimesTableDivisionProblems(
  timesTable: number,
  count: number,
  maxMultiplier: number = 12
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    const multiplier = randomInt(1, maxMultiplier);
    const dividend = timesTable * multiplier;
    const divisor = timesTable;
    const quotient = multiplier;

    const key = `${dividend}÷${divisor}`;
    
    // Avoid duplicates, but allow them if we can't generate enough unique ones
    if (usedCombinations.has(key) && usedCombinations.size < maxMultiplier) {
      i--;
      continue;
    }
    
    usedCombinations.add(key);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'division',
      operand1: dividend,
      operand2: divisor,
      answer: quotient,
    });
  }

  return problems;
}

/**
 * Generate division problems with specific educational patterns
 */
export function generateEducationalDivisionProblems(
  count: number,
  pattern: 'no-remainder' | 'with-remainder' | 'single-digit-divisor' | 'equal-sharing'
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: 3,
    problemType: 'basic',
    operation: 'division',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (pattern) {
    case 'no-remainder':
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 6,
        maxDividend: 144,
        minDivisor: 2,
        maxDivisor: 12,
        exactDivisionOnly: true,
        timesTableBased: true,
      });

    case 'with-remainder':
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 10,
        maxDividend: 100,
        minDivisor: 3,
        maxDivisor: 8,
        allowRemainder: true,
        exactDivisionOnly: false,
      });

    case 'single-digit-divisor':
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 20,
        maxDividend: 999,
        minDivisor: 2,
        maxDivisor: 9,
        allowRemainder: true,
      });

    case 'equal-sharing':
      // Generate problems that model equal sharing (smaller numbers)
      return generateDivisionProblems(baseSettings, count, {
        minDividend: 4,
        maxDividend: 48,
        minDivisor: 2,
        maxDivisor: 8,
        exactDivisionOnly: true,
        maxQuotient: 12,
      });

    default:
      return generateDivisionProblems(baseSettings, count);
  }
}

/**
 * Calculate remainder for division problems
 */
export function getDivisionRemainder(dividend: number, divisor: number): number {
  return dividend % divisor;
}

/**
 * Check if division is exact (no remainder)
 */
export function isExactDivision(dividend: number, divisor: number): boolean {
  return dividend % divisor === 0;
}