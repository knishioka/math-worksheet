import type { BasicProblem, WorksheetSettings } from '../../types';
import { randomInt, hasCarryOver, generateId } from '../utils/math';

export interface AdditionOptions {
  minNumber?: number;
  maxNumber?: number;
  includeCarryOver?: boolean;
  excludeCarryOver?: boolean;
  digitCount?: number;
}

/**
 * Generate addition problems based on grade level and settings
 */
export function generateAdditionProblem(
  settings: WorksheetSettings,
  options: AdditionOptions = {}
): BasicProblem {
  const {
    minNumber = settings.minNumber || 1,
    maxNumber = settings.maxNumber || 10,
    includeCarryOver = settings.includeCarryOver,
    excludeCarryOver = false,
    digitCount,
  } = options;

  let operand1: number;
  let operand2: number;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    if (digitCount) {
      // Generate numbers with specific digit count
      const min = Math.pow(10, digitCount - 1);
      const max = Math.pow(10, digitCount) - 1;
      operand1 = randomInt(min, Math.min(max, maxNumber));
      operand2 = randomInt(min, Math.min(max, maxNumber));
    } else {
      operand1 = randomInt(minNumber, maxNumber);
      operand2 = randomInt(minNumber, maxNumber);
    }

    attempts++;

    const carryOver = hasCarryOver(operand1, operand2);

    // Check carry over requirements
    if (includeCarryOver && !carryOver) continue;
    if (excludeCarryOver && carryOver) continue;

    break;
  }

  const answer = operand1 + operand2;

  return {
    id: generateId(),
    type: 'basic',
    operation: 'addition',
    operand1,
    operand2,
    answer,
    carryOver: hasCarryOver(operand1, operand2),
  };
}

/**
 * Generate multiple addition problems
 */
export function generateAdditionProblems(
  settings: WorksheetSettings,
  count: number,
  options: AdditionOptions = {}
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: BasicProblem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      problem = generateAdditionProblem(settings, options);
      const key = `${problem.operand1}+${problem.operand2}`;
      const reverseKey = `${problem.operand2}+${problem.operand1}`;

      if (!usedCombinations.has(key) && !usedCombinations.has(reverseKey)) {
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
 * Generate grade-appropriate addition problems
 */
export function generateGradeAdditionProblems(
  grade: number,
  count: number
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: grade as 1 | 2 | 3 | 4 | 5 | 6,
    problemType: 'basic',
    operation: 'addition',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (grade) {
    case 1:
      return generateAdditionProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 10,
        excludeCarryOver: true,
      });

    case 2:
      return generateAdditionProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 100,
        includeCarryOver: true,
      });

    case 3:
      return generateAdditionProblems(baseSettings, count, {
        minNumber: 10,
        maxNumber: 1000,
        includeCarryOver: true,
      });

    case 4:
    case 5:
    case 6:
      return generateAdditionProblems(baseSettings, count, {
        minNumber: 100,
        maxNumber: 10000,
        includeCarryOver: true,
      });

    default:
      return generateAdditionProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 10,
      });
  }
}