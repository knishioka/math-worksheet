import type { BasicProblem, WorksheetSettings } from '../../types';
import { randomInt, hasBorrow, generateId } from '../utils/math';

export interface SubtractionOptions {
  minNumber?: number;
  maxNumber?: number;
  includeBorrow?: boolean;
  excludeBorrow?: boolean;
  digitCount?: number;
  allowNegative?: boolean;
}

/**
 * Generate subtraction problems based on grade level and settings
 */
export function generateSubtractionProblem(
  settings: WorksheetSettings,
  options: SubtractionOptions = {}
): BasicProblem {
  // 学年に応じたデフォルト値を設定
  const defaultMax = settings.grade <= 1 ? 10 : settings.grade <= 2 ? 20 : 100;
  
  const {
    minNumber = 1,
    maxNumber = defaultMax,
    includeBorrow = false,
    excludeBorrow = false,
    digitCount,
    allowNegative = false,
  } = options;

  let operand1: number = minNumber;
  let operand2: number = minNumber;
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

    // Ensure operand1 >= operand2 unless negative results are allowed
    if (!allowNegative && operand1 < operand2) {
      [operand1, operand2] = [operand2, operand1];
    }

    attempts++;

    const borrowNeeded = hasBorrow(operand1, operand2);

    // Check borrow requirements
    if (includeBorrow && !borrowNeeded) continue;
    if (excludeBorrow && borrowNeeded) continue;

    break;
  }

  const answer = operand1 - operand2;

  return {
    id: generateId(),
    type: 'basic',
    operation: 'subtraction',
    operand1,
    operand2,
    answer,
    carryOver: hasBorrow(operand1, operand2), // Store borrow info in carryOver field
  };
}

/**
 * Generate multiple subtraction problems
 */
export function generateSubtractionProblems(
  settings: WorksheetSettings,
  count: number,
  options: SubtractionOptions = {}
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: BasicProblem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      problem = generateSubtractionProblem(settings, options);
      const key = `${problem.operand1}-${problem.operand2}`;

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
 * Generate grade-appropriate subtraction problems
 */
export function generateGradeSubtractionProblems(
  grade: number,
  count: number
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: grade as 1 | 2 | 3 | 4 | 5 | 6,
    problemType: 'basic',
    operation: 'subtraction',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (grade) {
    case 1:
      // 1年生: 1〜100の範囲、繰り下がりはオプション（2学期後半から）
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 100,
        // ランダムに繰り下がりあり・なしを混在
        includeBorrow: Math.random() < 0.3,  // 30%の確率で繰り下がりあり
        allowNegative: false,
      });

    case 2:
      // 2年生: 2桁の筆算、繰り下がり含む
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 10,
        maxNumber: 99,
        includeBorrow: true,
        allowNegative: false,
        digitCount: 2,
      });

    case 3:
      // 3年生: 3桁・4桁の筆算
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 100,
        maxNumber: 9999,
        includeBorrow: true,
        allowNegative: false,
      });

    case 4:
    case 5:
    case 6:
      // 4〜6年生: より大きな数、小数・分数は別途実装
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 100,
        maxNumber: 99999,
        includeBorrow: true,
        allowNegative: false,
      });

    default:
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 10,
        allowNegative: false,
      });
  }
}

/**
 * Generate subtraction problems with specific patterns for educational purposes
 */
export function generateEducationalSubtractionProblems(
  count: number,
  pattern: 'no-borrow' | 'simple-borrow' | 'complex-borrow' | 'zero-subtraction'
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: 2,
    problemType: 'basic',
    operation: 'subtraction',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (pattern) {
    case 'no-borrow':
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 10,
        maxNumber: 99,
        excludeBorrow: true,
      });

    case 'simple-borrow':
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 20,
        maxNumber: 99,
        includeBorrow: true,
      });

    case 'complex-borrow':
      return generateSubtractionProblems(baseSettings, count, {
        minNumber: 100,
        maxNumber: 999,
        includeBorrow: true,
      });

    case 'zero-subtraction':
      // Generate problems with zeros (e.g., 100 - 35, 204 - 67)
      return Array.from({ length: count }, () => {
        const operand1 = randomInt(100, 999);
        // Ensure operand1 has at least one zero or creates borrowing situation
        const operand2 = randomInt(
          Math.floor(operand1 * 0.1),
          Math.floor(operand1 * 0.9)
        );

        return {
          id: generateId(),
          type: 'basic' as const,
          operation: 'subtraction' as const,
          operand1,
          operand2,
          answer: operand1 - operand2,
          carryOver: hasBorrow(operand1, operand2),
        };
      });

    default:
      return generateSubtractionProblems(baseSettings, count);
  }
}