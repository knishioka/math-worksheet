import type { BasicProblem, Grade } from '../../types';
import { generateId, randomInt } from '../utils/math';

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
