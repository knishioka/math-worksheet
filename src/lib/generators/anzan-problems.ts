import type { BasicProblem, Grade } from '../../types';
import { generateId, randomInt } from '../utils/math';

/**
 * 10の補数を生成
 * 1年生: 1〜9の補数 (7+?=10)
 * 2年生以上: 同じ範囲（スピード重視）
 */
export function generateComplement10(
  _grade: Grade,
  count: number
): BasicProblem[] {
  const problems: BasicProblem[] = [];
  const usedOperands = new Set<number>();

  for (let i = 0; i < count; i++) {
    let operand1: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      operand1 = randomInt(1, 9);
      attempts++;
    } while (usedOperands.has(operand1) && attempts < maxAttempts);

    // 9通りしかないので重複を許容する場合もある
    if (attempts < maxAttempts) {
      usedOperands.add(operand1);
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2: null,
      answer: 10,
      missingPosition: 'operand2',
    });
  }

  return problems;
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
  const problems: BasicProblem[] = [];
  const usedOperands = new Set<number>();

  for (let i = 0; i < count; i++) {
    let operand1: number;
    let attempts = 0;
    const maxAttempts = 50;

    do {
      if (grade <= 3) {
        // 3年生: 10の倍数 (10, 20, ..., 90)
        operand1 = randomInt(1, 9) * 10;
      } else {
        // 4年生以上: 任意の2桁数 (1-99)
        operand1 = randomInt(1, 99);
      }
      attempts++;
    } while (usedOperands.has(operand1) && attempts < maxAttempts);

    if (attempts < maxAttempts) {
      usedOperands.add(operand1);
    }

    problems.push({
      id: generateId(),
      type: 'basic',
      operation: 'addition',
      operand1,
      operand2: null,
      answer: 100,
      missingPosition: 'operand2',
    });
  }

  return problems;
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
        price = randomInt(1, 99) * 10 + randomInt(1, 9); // 11〜999の3桁以下
        // 100〜999の範囲に調整して実用的な金額に
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
