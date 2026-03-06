/**
 * 暗算パターン問題生成器（分解・結合系）
 * Mental math pattern generators (decomposition & algebraic)
 *
 * - anzan-distributive: 分配法則 (Distributive law)
 * - anzan-mul-decompose: かけ算の分解 (Multiplication decomposition)
 * - anzan-square-diff: 平方差の公式 (Difference of squares)
 */

import type { BasicProblem, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
