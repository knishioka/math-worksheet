/**
 * 買い物の計算問題生成器（日本語）
 * Shopping calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 割引計算問題を生成
 * Generate discount calculation problems
 */
export function generateShoppingDiscount(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const discountType = randomInt(0, 2);
    let problemText: string;
    let answer: number;

    if (discountType === 0) {
      // 割引率から割引後の価格を計算
      const originalPrice = randomInt(5, 20) * 100; // 500-2000円
      const discountRate = [10, 20, 25, 30][randomInt(0, 3)]; // 10%, 20%, 25%, 30%
      const discountAmount = Math.floor(originalPrice * discountRate / 100);
      const finalPrice = originalPrice - discountAmount;

      problemText = `${originalPrice}円の商品が${discountRate}%引きで売っています。いくらで買えますか？`;
      answer = finalPrice;
    } else {
      // 割引額から割引率を計算
      const originalPrice = randomInt(8, 20) * 100; // 800-2000円
      const discountAmount = randomInt(1, 5) * 100; // 100-500円
      const discountRate = Math.round((discountAmount / originalPrice) * 100);

      problemText = `${originalPrice}円の商品が${discountAmount}円引きで売っています。何%引きですか？`;
      answer = discountRate;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: grade >= 5 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: discountType === 0 ? '円' : '%',
    });
  }

  return problems;
}

/**
 * 予算内の買い物問題を生成
 * Generate shopping within budget problems
 */
export function generateShoppingBudget(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const budgetType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (budgetType === 0) {
      // 予算内で買える数を計算
      const budget = randomInt(5, 15) * 100; // 500-1500円
      const itemPrice = randomInt(1, 5) * 100; // 100-500円
      const quantity = Math.floor(budget / itemPrice);

      problemText = `${budget}円持っています。1個${itemPrice}円のお菓子は何個買えますか？`;
      answer = quantity;
    } else {
      // おつりを計算
      const budget = randomInt(10, 20) * 100; // 1000-2000円
      const item1Price = randomInt(2, 5) * 100; // 200-500円
      const item2Price = randomInt(3, 6) * 100; // 300-600円
      const totalSpent = item1Price + item2Price;
      const change = budget - totalSpent;

      problemText = `${budget}円持っています。${item1Price}円のノートと${item2Price}円のペンを買いました。おつりはいくらですか？`;
      answer = change;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: budgetType === 0 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: budgetType === 0 ? '個' : '円',
    });
  }

  return problems;
}

/**
 * 値段の比較問題を生成
 * Generate price comparison problems
 */
export function generateShoppingComparison(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const comparisonType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (comparisonType === 0) {
      // 単位あたりの価格を比較
      const weight1 = randomInt(50, 100); // 50-100g
      const price1 = randomInt(100, 200); // 100-200円
      const weight2 = randomInt(80, 150); // 80-150g
      const price2 = randomInt(150, 300); // 150-300円

      const unitPrice1 = Math.round((price1 / weight1) * 100);
      const unitPrice2 = Math.round((price2 / weight2) * 100);
      const cheaper = unitPrice1 < unitPrice2 ? 'A' : 'B';
      const priceDiff = Math.abs(unitPrice1 - unitPrice2);

      problemText = `A店では${weight1}gで${price1}円、B店では${weight2}gで${price2}円のお菓子があります。100gあたりの値段の差はいくらですか？`;
      answer = priceDiff;
    } else {
      // 合計金額の差を計算
      const priceA = randomInt(3, 8) * 100; // 300-800円
      const priceB = randomInt(4, 9) * 100; // 400-900円
      const quantity = randomInt(2, 5); // 2-5個
      const totalA = priceA * quantity;
      const totalB = priceB * quantity;
      const difference = Math.abs(totalA - totalB);

      problemText = `A店では1個${priceA}円、B店では1個${priceB}円のりんごがあります。${quantity}個買うときの値段の差はいくらですか？`;
      answer = difference;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '円',
    });
  }

  return problems;
}

/**
 * 学年に応じた買い物問題を生成
 * Generate grade-appropriate shopping problems
 */
export function generateGradeShoppingProblems(
  grade: Grade,
  count: number,
  pattern: 'shopping-discount-jap' | 'shopping-budget-jap' | 'shopping-comparison-jap'
): WordProblem[] {
  switch (pattern) {
    case 'shopping-discount-jap':
      return generateShoppingDiscount(grade, count);
    case 'shopping-budget-jap':
      return generateShoppingBudget(grade, count);
    case 'shopping-comparison-jap':
      return generateShoppingComparison(grade, count);
    default:
      return generateShoppingDiscount(grade, count);
  }
}
