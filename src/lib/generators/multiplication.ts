import type { BasicProblem, WorksheetSettings } from '../../types';
import { randomInt, generateId } from '../utils/math';

export interface MultiplicationOptions {
  minNumber?: number;
  maxNumber?: number;
  includeZero?: boolean;
  includeOne?: boolean;
  timesTableFocus?: number; // Focus on specific times table (e.g., 3 for 3x table)
  digitCount?: number;
  maxAnswer?: number;
}

/**
 * Generate multiplication problems based on grade level and settings
 */
export function generateMultiplicationProblem(
  settings: WorksheetSettings,
  options: MultiplicationOptions = {}
): BasicProblem {
  const {
    minNumber = settings.minNumber || 1,
    maxNumber = settings.maxNumber || 10,
    includeZero = false,
    includeOne = true,
    timesTableFocus,
    digitCount,
    maxAnswer = 1000,
  } = options;

  let operand1: number = minNumber;
  let operand2: number = minNumber;
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    if (timesTableFocus) {
      // Focus on specific times table
      operand1 = timesTableFocus;
      operand2 = randomInt(minNumber, maxNumber);
      
      // Sometimes swap to get variety (e.g., both 3x4 and 4x3)
      if (Math.random() < 0.5) {
        [operand1, operand2] = [operand2, operand1];
      }
    } else if (digitCount) {
      // Generate numbers with specific digit count
      const min = Math.pow(10, digitCount - 1);
      const max = Math.pow(10, digitCount) - 1;
      operand1 = randomInt(min, Math.min(max, maxNumber));
      operand2 = randomInt(min, Math.min(max, maxNumber));
    } else {
      operand1 = randomInt(minNumber, maxNumber);
      operand2 = randomInt(minNumber, maxNumber);
    }

    const answer = operand1 * operand2;

    attempts++;

    // Check constraints
    if (!includeZero && (operand1 === 0 || operand2 === 0)) {
      continue;
    }

    if (!includeOne && (operand1 === 1 || operand2 === 1)) {
      continue;
    }

    if (answer > maxAnswer) {
      continue;
    }

    break;
  }

  const answer = operand1 * operand2;

  return {
    id: generateId(),
    type: 'basic',
    operation: 'multiplication',
    operand1,
    operand2,
    answer,
  };
}

/**
 * Generate multiple multiplication problems
 */
export function generateMultiplicationProblems(
  settings: WorksheetSettings,
  count: number,
  options: MultiplicationOptions = {}
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let problem: BasicProblem;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      problem = generateMultiplicationProblem(settings, options);
      const key = `${Math.min(problem.operand1, problem.operand2)}x${Math.max(problem.operand1, problem.operand2)}`;

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
 * Generate grade-appropriate multiplication problems
 */
export function generateGradeMultiplicationProblems(
  grade: number,
  count: number
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: grade as 1 | 2 | 3 | 4 | 5 | 6,
    problemType: 'basic',
    operation: 'multiplication',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (grade) {
    case 1:
      // 1年生: 掛け算は学習しない
      return [];

    case 2:
      // 2年生: 九九（1×1〜9×9）
      return generateMultiplicationProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 9,
        includeOne: true,
        includeZero: false,
        maxAnswer: 81,
        timesTableFocus: Math.random() < 0.5 ? randomInt(2, 9) : undefined,  // 時々特定の段にフォーカス
      });

    case 3: {
      // 3年生: 2桁×1桁、3桁×1桁の筆算
      const use2Digit = Math.random() < 0.7;  // 70%の確率で2桁×1桁
      if (use2Digit) {
        return Array.from({ length: count }, () => {
          const operand1 = randomInt(10, 99);  // 2桁
          const operand2 = randomInt(1, 9);    // 1桁
          return {
            id: generateId(),
            type: 'basic' as const,
            operation: 'multiplication' as const,
            operand1,
            operand2,
            answer: operand1 * operand2,
          };
        });
      } else {
        return Array.from({ length: count }, () => {
          const operand1 = randomInt(100, 999);  // 3桁
          const operand2 = randomInt(1, 9);      // 1桁
          return {
            id: generateId(),
            type: 'basic' as const,
            operation: 'multiplication' as const,
            operand1,
            operand2,
            answer: operand1 * operand2,
          };
        });
      }
    }

    case 4:
      // Grade 4: 2-digit x 1-digit
      return generateMultiplicationProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 99,
        maxAnswer: 999,
      });

    case 5:
    case 6:
      // Grade 5-6: Multi-digit multiplication
      return generateMultiplicationProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 999,
        maxAnswer: 9999,
      });

    default:
      return generateMultiplicationProblems(baseSettings, count, {
        minNumber: 1,
        maxNumber: 10,
      });
  }
}

/**
 * Generate times table practice problems
 */
export function generateTimesTableProblems(
  timesTable: number,
  count: number,
  includeReverse: boolean = true
): BasicProblem[] {
  // Generate times table problems without using base settings directly

  const problems: BasicProblem[] = [];
  const usedCombinations = new Set<string>();

  for (let i = 0; i < count; i++) {
    let operand1 = timesTable;
    let operand2 = randomInt(1, 12);

    // Sometimes reverse the order for variety
    if (includeReverse && Math.random() < 0.5) {
      [operand1, operand2] = [operand2, operand1];
    }

    const key = `${Math.min(operand1, operand2)}x${Math.max(operand1, operand2)}`;
    
    // Avoid duplicates, but allow them if we can't generate enough unique ones
    if (usedCombinations.has(key) && usedCombinations.size < 20) {
      i--;
      continue;
    }
    
    usedCombinations.add(key);

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'multiplication',
      operand1,
      operand2,
      answer: operand1 * operand2,
    });
  }

  return problems;
}

/**
 * Generate multiplication problems with specific educational patterns
 */
export function generateEducationalMultiplicationProblems(
  count: number,
  pattern: 'easy-tables' | 'hard-tables' | 'mixed-digit' | 'zero-one-focus'
): BasicProblem[] {
  const baseSettings: WorksheetSettings = {
    grade: 3,
    problemType: 'basic',
    operation: 'multiplication',
    problemCount: count,
    layoutColumns: 2,
  };

  switch (pattern) {
    case 'easy-tables':
      // Focus on easier times tables: 1, 2, 5, 10
      return Array.from({ length: count }, () => {
        const easyTables = [1, 2, 5, 10];
        const table = easyTables[Math.floor(Math.random() * easyTables.length)];
        const other = randomInt(1, 12);
        
        return {
          id: generateId(),
          type: 'basic' as const,
          operation: 'multiplication' as const,
          operand1: table,
          operand2: other,
          answer: table * other,
        };
      });

    case 'hard-tables':
      // Focus on harder times tables: 6, 7, 8, 9
      return Array.from({ length: count }, () => {
        const hardTables = [6, 7, 8, 9];
        const table = hardTables[Math.floor(Math.random() * hardTables.length)];
        const other = randomInt(1, 12);
        
        return {
          id: generateId(),
          type: 'basic' as const,
          operation: 'multiplication' as const,
          operand1: table,
          operand2: other,
          answer: table * other,
        };
      });

    case 'mixed-digit':
      // 2-digit x 1-digit problems
      return generateMultiplicationProblems(baseSettings, count, {
        minNumber: 10,
        maxNumber: 99,
        maxAnswer: 999,
      });

    case 'zero-one-focus':
      // Focus on multiplication with 0 and 1
      return Array.from({ length: count }, () => {
        const special = Math.random() < 0.5 ? 0 : 1;
        const other = randomInt(1, 20);
        const operand1 = Math.random() < 0.5 ? special : other;
        const operand2 = operand1 === special ? other : special;
        
        return {
          id: generateId(),
          type: 'basic' as const,
          operation: 'multiplication' as const,
          operand1,
          operand2,
          answer: operand1 * operand2,
        };
      });

    default:
      return generateMultiplicationProblems(baseSettings, count);
  }
}