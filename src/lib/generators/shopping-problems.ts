/**
 * 買い物の計算問題生成器（日本語）
 * Shopping calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

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
      const priceBand = rangeByGrade(grade, {
        lower: { min: 4, max: 15 },
        middle: { min: 6, max: 20 },
        upper: { min: 8, max: 25 },
      });
      const originalPrice = randomInt(priceBand.min, priceBand.max) * 100;
      const rateOptions = grade <= 2 ? [10, 15, 20] : grade <= 4 ? [10, 20, 25] : [15, 20, 25, 30];
      const discountRate = rateOptions[randomInt(0, rateOptions.length - 1)];
      const discountAmount = Math.floor(originalPrice * discountRate / 100);
      const finalPrice = originalPrice - discountAmount;

      problemText = `${originalPrice}円の商品が${discountRate}%引きで売っています。いくらで買えますか？`;
      answer = finalPrice;
    } else {
      // 割引額から割引率を計算
      const originalPriceRange = rangeByGrade(grade, {
        lower: { min: 7, max: 16 },
        middle: { min: 8, max: 20 },
        upper: { min: 10, max: 25 },
      });
      const originalPrice = randomInt(originalPriceRange.min, originalPriceRange.max) * 100;
      const discountAmount = randomIntByGrade(grade, {
        lower: { min: 1, max: 4 },
        middle: { min: 2, max: 6 },
        upper: { min: 3, max: 8 },
      }) * 100;
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
      const budget = randomIntByGrade(grade, {
        lower: { min: 5, max: 12 },
        middle: { min: 7, max: 18 },
        upper: { min: 9, max: 22 },
      }) * 100;
      const itemPrice = randomIntByGrade(grade, {
        lower: { min: 1, max: 4 },
        middle: { min: 2, max: 5 },
        upper: { min: 3, max: 6 },
      }) * 100;
      const quantity = Math.floor(budget / itemPrice);

      problemText = `${budget}円持っています。1個${itemPrice}円のお菓子は何個買えますか？`;
      answer = quantity;
    } else {
      // おつりを計算
      const budget = randomIntByGrade(grade, {
        lower: { min: 10, max: 18 },
        middle: { min: 12, max: 24 },
        upper: { min: 15, max: 30 },
      }) * 100;
      const item1Price = randomIntByGrade(grade, {
        lower: { min: 2, max: 4 },
        middle: { min: 3, max: 6 },
        upper: { min: 4, max: 7 },
      }) * 100;
      const item2Price = randomIntByGrade(grade, {
        lower: { min: 3, max: 5 },
        middle: { min: 4, max: 7 },
        upper: { min: 5, max: 9 },
      }) * 100;
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
      const weight1 = randomIntByGrade(grade, {
        lower: { min: 40, max: 90 },
        middle: { min: 60, max: 130 },
        upper: { min: 90, max: 200 },
      });
      const price1 = randomIntByGrade(grade, {
        lower: { min: 80, max: 160 },
        middle: { min: 100, max: 220 },
        upper: { min: 130, max: 300 },
      });
      const weight2 = randomIntByGrade(grade, {
        lower: { min: 70, max: 140 },
        middle: { min: 90, max: 200 },
        upper: { min: 120, max: 260 },
      });
      const price2 = randomIntByGrade(grade, {
        lower: { min: 120, max: 250 },
        middle: { min: 150, max: 320 },
        upper: { min: 200, max: 420 },
      });

      const unitPrice1 = Math.round((price1 / weight1) * 100);
      const unitPrice2 = Math.round((price2 / weight2) * 100);
      const priceDiff = Math.abs(unitPrice1 - unitPrice2);

      problemText = `A店では${weight1}gで${price1}円、B店では${weight2}gで${price2}円のお菓子があります。100gあたりの値段の差はいくらですか？`;
      answer = priceDiff;
    } else {
      // 合計金額の差を計算
      const priceA = randomIntByGrade(grade, {
        lower: { min: 3, max: 6 },
        middle: { min: 4, max: 8 },
        upper: { min: 5, max: 10 },
      }) * 100;
      const priceB = randomIntByGrade(grade, {
        lower: { min: 4, max: 7 },
        middle: { min: 5, max: 9 },
        upper: { min: 6, max: 11 },
      }) * 100;
      const quantity = randomIntByGrade(grade, {
        lower: { min: 2, max: 4 },
        middle: { min: 3, max: 6 },
        upper: { min: 4, max: 8 },
      });
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
