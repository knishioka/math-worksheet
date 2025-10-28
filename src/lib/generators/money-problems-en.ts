/**
 * お金の計算問題生成器（マレーシアリンギット）
 * Money calculation problem generator (Malaysian Ringgit)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * おつりの計算問題を生成（リンギット）
 * Generate change calculation problems (Ringgit)
 */
export function generateMoneyChangeEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    let itemPrice: number;
    let payment: number;
    let change: number;

    if (grade === 1) {
      // Grade 1: RM0.10 increments, under RM1
      itemPrice = randomInt(1, 9) * 0.1;
      payment = 1;
      change = Math.round((payment - itemPrice) * 100) / 100;
    } else if (grade === 2) {
      // Grade 2: RM0.10 increments, under RM5
      const priceBase = randomInt(5, 45) * 0.1;
      itemPrice = Math.round(priceBase * 10) / 10;
      payment = itemPrice < 1 ? 1 : itemPrice < 5 ? 5 : 10;
      change = Math.round((payment - itemPrice) * 100) / 100;
    } else {
      // Grade 3-4: RM0.01 increments
      itemPrice = Math.round(randomInt(50, 950) * 0.01 * 100) / 100;
      payment = itemPrice < 5 ? 5 : 10;
      change = Math.round((payment - itemPrice) * 100) / 100;
    }

    const items = [
      'candy', 'pencil', 'eraser', 'notebook', 'juice',
      'bread', 'rice ball', 'ice cream', 'gum', 'sticker'
    ];
    const item = items[randomInt(0, items.length - 1)];

    const problemText = `You buy ${item} for RM${itemPrice.toFixed(2)} with RM${payment}. How much change do you get?`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer: change,
      unit: 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * お金の合計計算問題を生成（リンギット）
 * Generate money total calculation problems (Ringgit)
 */
export function generateMoneyTotalEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    let price1: number;
    let price2: number;
    let total: number;

    if (grade === 1) {
      // Grade 1: RM0.10 increments, total under RM1
      price1 = randomInt(1, 5) * 0.1;
      price2 = randomInt(1, 10 - price1 * 10) * 0.1;
      total = Math.round((price1 + price2) * 100) / 100;
    } else if (grade === 2) {
      // Grade 2: RM0.10 increments, total under RM5
      price1 = randomInt(5, 25) * 0.1;
      price2 = randomInt(5, 25) * 0.1;
      total = Math.round((price1 + price2) * 100) / 100;
    } else {
      // Grade 3-4: RM0.01 increments
      price1 = Math.round(randomInt(50, 500) * 0.01 * 100) / 100;
      price2 = Math.round(randomInt(50, 500) * 0.01 * 100) / 100;
      total = Math.round((price1 + price2) * 100) / 100;
    }

    const items = [
      ['pencil', 'eraser'],
      ['notebook', 'pen'],
      ['candy', 'juice'],
      ['bread', 'milk'],
      ['ice cream', 'gum'],
      ['sticker', 'origami paper'],
      ['crayon', 'sketchbook'],
    ];
    const [item1, item2] = items[randomInt(0, items.length - 1)];

    const problemText = `A ${item1} costs RM${price1.toFixed(2)} and a ${item2} costs RM${price2.toFixed(2)}. What is the total?`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer: total,
      unit: 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 支払い方法の問題を生成（リンギット）
 * Generate payment method problems (Ringgit)
 */
export function generateMoneyPaymentEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    let totalPrice: number;
    let coin1: number;
    let coin2: number;
    let answer: number;

    if (grade === 2) {
      // Grade 2: under RM1, using RM0.50 and RM0.10 coins
      totalPrice = Math.round(randomInt(2, 10) * 0.1 * 10) / 10;
      coin1 = 0.5;
      coin2 = 0.1;

      // Calculate number of RM0.50 coins
      const fifties = Math.floor(totalPrice / 0.5);
      const tens = Math.round((totalPrice - fifties * 0.5) / 0.1);
      answer = fifties + tens;
    } else {
      // Grade 3-4: under RM5, using RM1 and RM0.10 coins
      totalPrice = Math.round(randomInt(10, 50) * 0.1 * 10) / 10;
      coin1 = 1;
      coin2 = 0.1;

      // Calculate number of RM1 coins
      const ones = Math.floor(totalPrice / 1);
      const tens = Math.round((totalPrice - ones * 1) / 0.1);
      answer = ones + tens;
    }

    const problemText = `You need to pay RM${totalPrice.toFixed(2)}. How many coins do you need if you use only RM${coin1.toFixed(2)} and RM${coin2.toFixed(2)} coins?`;

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: 'coins',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じたお金の問題を生成（リンギット）
 * Generate grade-appropriate money problems (Ringgit)
 */
export function generateGradeMoneyProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'money-change-en' | 'money-total-en' | 'money-payment-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'money-change-en':
      return generateMoneyChangeEn(grade, count);
    case 'money-total-en':
      return generateMoneyTotalEn(grade, count);
    case 'money-payment-en':
      return generateMoneyPaymentEn(grade, count);
    default:
      return generateMoneyTotalEn(grade, count);
  }
}
