/**
 * 暗算の丸め・調整パターン問題生成器
 * Rounding and adjustment mental math problem generators
 */

import type { BasicProblem, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { pickByGrade } from './grade-utils';

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

  for (let i = 0; i < count; i++) {
    const multiple =
      randomInt(
        config.roundBase === 10 ? 2 : 2,
        config.roundBase === 10 ? 10 : 5
      ) * config.roundBase;
    const offset = randomInt(1, 3);
    const sign = randomInt(0, 1) === 0 ? 1 : -1;
    const nearRound = multiple + sign * offset;

    if (nearRound < 2) {
      i--;
      continue;
    }

    const other = randomInt(config.otherMin, config.otherMax);
    const swapOrder = randomInt(0, 1) === 0;
    const operand1 = swapOrder ? nearRound : other;
    const operand2 = swapOrder ? other : nearRound;
    const answer = operand1 + operand2;

    if (answer <= 0) {
      i--;
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

  for (let i = 0; i < count; i++) {
    const multiple =
      randomInt(config.multipleMin, config.multipleMax) * config.roundBase;
    const offset = randomInt(1, 3);
    const sign = randomInt(0, 1) === 0 ? 1 : -1;
    const nearRound = multiple + sign * offset;

    if (nearRound < 2) {
      i--;
      continue;
    }

    const otherMax = Math.min(config.otherMax, nearRound - 1);
    if (otherMax < config.otherMin) {
      i--;
      continue;
    }
    const other = randomInt(config.otherMin, otherMax);
    const answer = nearRound - other;

    if (answer <= 0) {
      i--;
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
