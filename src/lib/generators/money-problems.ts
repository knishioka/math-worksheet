/**
 * お金の計算問題生成器（日本円）
 * Money calculation problem generator (Japanese Yen)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * おつりの計算問題を生成
 * Generate change calculation problems
 */
export function generateMoneyChange(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    let itemPrice: number;
    let payment: number;
    let change: number;

    if (grade === 1) {
      // 1年生: 10円単位、100円以内
      itemPrice = randomInt(1, 9) * 10;
      payment = 100;
      change = payment - itemPrice;
    } else if (grade === 2) {
      // 2年生: 10円単位、500円以内
      const priceBase = randomInt(5, 45) * 10;
      itemPrice = priceBase;
      payment = priceBase < 100 ? 100 : priceBase < 500 ? 500 : 1000;
      change = payment - itemPrice;
    } else {
      // 3-4年生: 1円単位
      itemPrice = randomInt(50, 950);
      payment = itemPrice < 500 ? 500 : 1000;
      change = payment - itemPrice;
    }

    const items = [
      'おかし', 'えんぴつ', '消しゴム', 'ノート', 'ジュース',
      'パン', 'おにぎり', 'アイス', 'ガム', 'シール'
    ];
    const item = items[randomInt(0, items.length - 1)];

    const problemText = `${payment}円で${itemPrice}円の${item}を買いました。おつりはいくらですか？`;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer: change,
      unit: '円',
    });
  }

  return problems;
}

/**
 * お金の合計計算問題を生成
 * Generate money total calculation problems
 */
export function generateMoneyTotal(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    let price1: number;
    let price2: number;
    let total: number;

    if (grade === 1) {
      // 1年生: 10円単位、合計100円以内
      price1 = randomInt(1, 5) * 10;
      price2 = randomInt(1, 10 - price1 / 10) * 10;
      total = price1 + price2;
    } else if (grade === 2) {
      // 2年生: 10円単位、合計500円以内
      price1 = randomInt(5, 25) * 10;
      price2 = randomInt(5, 25) * 10;
      total = price1 + price2;
    } else {
      // 3-4年生: 1円単位
      price1 = randomInt(50, 500);
      price2 = randomInt(50, 500);
      total = price1 + price2;
    }

    const items = [
      ['えんぴつ', '消しゴム'],
      ['ノート', 'えんぴつ'],
      ['おかし', 'ジュース'],
      ['パン', 'ぎゅうにゅう'],
      ['アイス', 'ガム'],
      ['シール', 'おりがみ'],
      ['クレヨン', 'スケッチブック'],
    ];
    const [item1, item2] = items[randomInt(0, items.length - 1)];

    const problemText = `${price1}円の${item1}と${price2}円の${item2}を買います。合計でいくらですか？`;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer: total,
      unit: '円',
    });
  }

  return problems;
}

/**
 * 支払い方法の問題を生成
 * Generate payment method problems
 */
export function generateMoneyPayment(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    let totalPrice: number;
    let coin1: number;
    let coin2: number;
    let answer: number;

    if (grade === 2) {
      // 2年生: 100円以内、10円と50円硬貨
      totalPrice = randomInt(2, 10) * 10;
      coin1 = 50;
      coin2 = 10;

      // 50円硬貨の枚数を計算
      const fifties = Math.floor(totalPrice / 50);
      const tens = (totalPrice - fifties * 50) / 10;
      answer = fifties + tens;
    } else {
      // 3-4年生: 500円以内、100円と10円硬貨
      totalPrice = randomInt(10, 50) * 10;
      coin1 = 100;
      coin2 = 10;

      // 100円硬貨の枚数を計算
      const hundreds = Math.floor(totalPrice / 100);
      const tens = (totalPrice - hundreds * 100) / 10;
      answer = hundreds + tens;
    }

    const problemText = `${totalPrice}円の買い物をします。${coin1}円玉と${coin2}円玉だけで払うとき、何枚必要ですか？`;

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '枚',
    });
  }

  return problems;
}

/**
 * 学年に応じたお金の問題を生成
 * Generate grade-appropriate money problems
 */
export function generateGradeMoneyProblems(
  grade: Grade,
  count: number,
  pattern: 'money-change-jap' | 'money-total-jap' | 'money-payment-jap'
): WordProblem[] {
  switch (pattern) {
    case 'money-change-jap':
      return generateMoneyChange(grade, count);
    case 'money-total-jap':
      return generateMoneyTotal(grade, count);
    case 'money-payment-jap':
      return generateMoneyPayment(grade, count);
    default:
      return generateMoneyTotal(grade, count);
  }
}
