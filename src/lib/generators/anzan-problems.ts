/**
 * 暗算パターン問題生成器
 * Mental math problem generators (complement + rounding + decomposition patterns)
 */

import type { BasicProblem, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { pickByGrade } from './grade-utils';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 10の補数を生成
 * 1年生: 1〜9の補数 (7+?=10)
 * 2年生以上: 同じ範囲（スピード重視）
 */
export function generateComplement10(
  _grade: Grade,
  count: number
): BasicProblem[] {
  const pool = shuffleArray(Array.from({ length: 9 }, (_, i) => i + 1));

  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    type: 'basic' as const,
    operation: 'addition' as const,
    operand1: pool[i % pool.length],
    operand2: null,
    answer: 10,
    missingPosition: 'operand2' as const,
  }));
}

/**
 * 100の補数を生成
 * 3年生: 10の倍数の補数 (70+?=100)
 * 4年生以上: 任意の2桁数の補数 (73+?=100)
 */
export function generateComplement100(
  grade: Grade,
  count: number
): BasicProblem[] {
  const pool = shuffleArray(
    grade <= 3
      ? Array.from({ length: 9 }, (_, i) => (i + 1) * 10) // 10, 20, ..., 90
      : Array.from({ length: 99 }, (_, i) => i + 1) // 1-99
  );

  return Array.from({ length: count }, (_, i) => ({
    id: generateId(),
    type: 'basic' as const,
    operation: 'addition' as const,
    operand1: pool[i % pool.length],
    operand2: null,
    answer: 100,
    missingPosition: 'operand2' as const,
  }));
}

/**
 * おつり算（補数応用）を生成
 * 4年生: 1000円からのおつり (1000-637=?)
 * 5年生以上: 5000円、10000円からのおつり
 */
export function generateChangeMaking(
  grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedOperands = new Set<number>();

  for (let i = 0; i < count; i++) {
    let totalAmount: number;
    let price: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      if (grade <= 4) {
        // 4年生: 1000円からのおつり
        totalAmount = 1000;
        price = randomInt(100, 999);
      } else {
        // 5年生以上: 1000円、5000円、10000円からのおつり
        const amounts = [1000, 5000, 10000];
        totalAmount = amounts[randomInt(0, amounts.length - 1)];
        if (totalAmount === 1000) {
          price = randomInt(100, 999);
        } else if (totalAmount === 5000) {
          price = randomInt(100, 4999);
        } else {
          price = randomInt(100, 9999);
        }
      }
      attempts++;
    } while (usedOperands.has(price) && attempts < maxAttempts);

    if (attempts < maxAttempts) {
      usedOperands.add(price);
    }

    const change = totalAmount - price;

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1: totalAmount,
      operand2: price,
      answer: change,
    });
  }

  return problems;
}

/**
 * 丸めて足す問題を生成
 * Generate rounding addition problems
 * e.g., 98 + 45 → (100 + 45 - 2)
 */
export function generateAnzanRoundAdd(
  grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const config = pickByGrade(grade, {
    lower: {
      roundBase: 10,
      baseMin: 2,
      baseMax: 9,
      otherMin: 11,
      otherMax: 49,
    },
    middle: {
      roundBase: 10,
      baseMin: 2,
      baseMax: 9,
      otherMin: 11,
      otherMax: 99,
    },
    upper: {
      roundBase: 100,
      baseMin: 1,
      baseMax: 9,
      otherMin: 101,
      otherMax: 499,
    },
  });

  while (problems.length < count) {
    const multiple =
      randomInt(config.baseMin, config.baseMax) * config.roundBase;
    const offset = randomInt(1, 3);
    const sign = randomInt(0, 1) === 0 ? 1 : -1;
    const nearRound = multiple + sign * offset;

    if (nearRound < 2) {
      continue;
    }

    const other = randomInt(config.otherMin, config.otherMax);
    const swapOrder = randomInt(0, 1) === 0;
    const operand1 = swapOrder ? nearRound : other;
    const operand2 = swapOrder ? other : nearRound;
    const answer = operand1 + operand2;

    if (answer <= 0) {
      continue;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2,
      answer,
    });
  }

  return problems;
}

/**
 * 丸めて引く問題を生成
 * Generate rounding subtraction problems
 * e.g., 102 - 47 → (100 - 47 + 2)
 */
export function generateAnzanRoundSub(
  grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const config = pickByGrade(grade, {
    lower: {
      roundBase: 10,
      multipleMin: 5,
      multipleMax: 10,
      otherMin: 11,
      otherMax: 49,
    },
    middle: {
      roundBase: 10,
      multipleMin: 5,
      multipleMax: 15,
      otherMin: 11,
      otherMax: 99,
    },
    upper: {
      roundBase: 100,
      multipleMin: 2,
      multipleMax: 5,
      otherMin: 101,
      otherMax: 399,
    },
  });

  while (problems.length < count) {
    const multiple =
      randomInt(config.multipleMin, config.multipleMax) * config.roundBase;
    const offset = randomInt(1, 3);
    const sign = randomInt(0, 1) === 0 ? 1 : -1;
    const nearRound = multiple + sign * offset;

    if (nearRound < 2) {
      continue;
    }

    const otherMax = Math.min(config.otherMax, nearRound - 1);
    if (otherMax < config.otherMin) {
      continue;
    }
    const other = randomInt(config.otherMin, otherMax);
    const answer = nearRound - other;

    if (answer <= 0) {
      continue;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'subtraction',
      operand1: nearRound,
      operand2: other,
      answer,
    });
  }

  return problems;
}

/**
 * 丸めてかける問題を生成
 * Generate rounding multiplication problems
 * e.g., 25 × 12 → 25 × 4 × 3 = 300
 */
export function generateAnzanRoundMul(
  grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const roundFactors = pickByGrade(grade, {
    lower: [5, 25],
    middle: [5, 25, 50],
    upper: [25, 50, 125],
  });
  const multiplierRange = pickByGrade(grade, {
    lower: { min: 2, max: 9 },
    middle: { min: 2, max: 12 },
    upper: { min: 4, max: 16 },
  });

  for (let i = 0; i < count; i++) {
    const roundFactor = roundFactors[randomInt(0, roundFactors.length - 1)];
    const multiplier = randomInt(multiplierRange.min, multiplierRange.max);
    const answer = roundFactor * multiplier;

    const swapOrder = randomInt(0, 1) === 0;
    const operand1 = swapOrder ? roundFactor : multiplier;
    const operand2 = swapOrder ? multiplier : roundFactor;

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'multiplication',
      operand1,
      operand2,
      answer,
    });
  }

  return problems;
}

/**
 * 学年に応じた丸め・調整暗算問題を生成
 */
export function generateGradeAnzanRoundingProblems(
  grade: Grade,
  count: number,
  pattern: 'anzan-round-add' | 'anzan-round-sub' | 'anzan-round-mul'
): BasicProblem[] {
  switch (pattern) {
    case 'anzan-round-add':
      return generateAnzanRoundAdd(grade, count);
    case 'anzan-round-sub':
      return generateAnzanRoundSub(grade, count);
    case 'anzan-round-mul':
      return generateAnzanRoundMul(grade, count);
  }
}

/**
 * 分配法則の問題を生成
 * Generate distributive law problems: A × B = A × (10k) + A × r
 *
 * Grade 4: 1-digit × 2-digit (10s-20s range)
 * Grade 5+: 1-digit × 3-digit
 */
export function generateDistributiveProblems(
  grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const a = randomInt(2, 9);
    let b: number;

    if (grade <= 4) {
      // 2-digit: 11-29 range (10s-20s), ensuring remainder > 0
      const tens = randomInt(1, 2); // 10 or 20
      const ones = randomInt(1, 9);
      b = tens * 10 + ones;
    } else {
      // 3-digit: 101-299, ensuring remainder > 0
      const hundreds = randomInt(1, 2);
      const remainder = randomInt(1, 99);
      b = hundreds * 100 + remainder;
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'multiplication',
      operand1: a,
      operand2: b,
      answer: a * b,
    });
  }

  return problems;
}

/**
 * かけ算の分解問題を生成
 * Generate multiplication decomposition problems: A × B where one operand ≈ multiple of 10
 *
 * Grade 5: 2-digit × 2-digit, one operand is 10k + r (r ≤ 5)
 * Grade 6: larger numbers (2-digit × 3-digit)
 */
export function generateMulDecomposeProblems(
  grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const tens = randomInt(1, 4);
    const remainder = randomInt(1, 5);
    const nearRound = tens * 10 + remainder;
    const other = grade <= 5 ? randomInt(11, 19) : randomInt(101, 199);
    const [operand1, operand2] =
      randomInt(0, 1) === 0 ? [nearRound, other] : [other, nearRound];

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
 * 平方差の公式問題を生成
 * Generate difference of squares problems: (center+diff) × (center-diff) = center² - diff²
 *
 * Grade 6: center is a multiple of 10 (10-50), diff is 1-5
 */
export function generateSquareDiffProblems(
  _grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];

  for (let i = 0; i < count; i++) {
    const center = randomInt(1, 5) * 10; // 10, 20, 30, 40, 50
    const diff = randomInt(1, 5);
    const a = center + diff;
    const b = center - diff;
    const answer = center * center - diff * diff;

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'multiplication',
      operand1: a,
      operand2: b,
      answer,
    });
  }

  return problems;
}

/**
 * 暗算（分解・結合系）パターンのディスパッチ関数
 */
export function generateAnzanDecompositionProblems(
  grade: Grade,
  count: number,
  pattern: 'anzan-distributive' | 'anzan-mul-decompose' | 'anzan-square-diff'
): BasicProblem[] {
  switch (pattern) {
    case 'anzan-distributive':
      return generateDistributiveProblems(grade, count);
    case 'anzan-mul-decompose':
      return generateMulDecomposeProblems(grade, count);
    case 'anzan-square-diff':
      return generateSquareDiffProblems(grade, count);
    default: {
      const _exhaustiveCheck: never = pattern;
      throw new Error(
        `Unhandled anzan decomposition pattern: ${_exhaustiveCheck}`
      );
    }
  }
}
