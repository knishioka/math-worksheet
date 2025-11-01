/**
 * 買い物の計算問題生成器（英語）
 * Shopping calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

/**
 * 割引計算問題を生成（英語）
 * Generate discount calculation problems (English)
 */
export function generateShoppingDiscountEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const discountType = randomInt(0, 2);
    let problemText: string;
    let answer: number;

    if (discountType === 0) {
      // Calculate final price after discount
      const priceBand = rangeByGrade(grade, {
        lower: { min: 10, max: 30 },
        middle: { min: 15, max: 45 },
        upper: { min: 20, max: 60 },
      });
      const originalPrice = randomInt(priceBand.min, priceBand.max) * 2;
      const rateOptions = grade <= 2 ? [10, 15, 20] : grade <= 4 ? [10, 20, 25] : [15, 20, 25, 30];
      const discountRate = rateOptions[randomInt(0, rateOptions.length - 1)];
      const discountAmount = Math.floor(originalPrice * discountRate / 100);
      const finalPrice = originalPrice - discountAmount;

      problemText = `A shirt costs RM${originalPrice}. It has a ${discountRate}% discount. How much do you pay?`;
      answer = finalPrice;
    } else {
      // Calculate discount rate from discount amount
      const originalPriceRange = rangeByGrade(grade, {
        lower: { min: 20, max: 40 },
        middle: { min: 25, max: 55 },
        upper: { min: 30, max: 70 },
      });
      const originalPrice = randomInt(originalPriceRange.min, originalPriceRange.max) * 2;
      const discountAmount = randomIntByGrade(grade, {
        lower: { min: 4, max: 12 },
        middle: { min: 5, max: 18 },
        upper: { min: 8, max: 25 },
      });
      const discountRate = Math.round((discountAmount / originalPrice) * 100);

      problemText = `A toy costs RM${originalPrice}. The discount is RM${discountAmount}. What is the discount percentage?`;
      answer = discountRate;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: grade >= 5 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: discountType === 0 ? 'RM' : '%',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 予算内の買い物問題を生成（英語）
 * Generate shopping within budget problems (English)
 */
export function generateShoppingBudgetEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const budgetType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (budgetType === 0) {
      // Calculate how many items can be bought within budget
      const budget = randomIntByGrade(grade, {
        lower: { min: 10, max: 25 },
        middle: { min: 15, max: 35 },
        upper: { min: 20, max: 45 },
      }) * 2;
      const itemPrice = randomIntByGrade(grade, {
        lower: { min: 2, max: 5 },
        middle: { min: 3, max: 7 },
        upper: { min: 4, max: 9 },
      });
      const quantity = Math.floor(budget / itemPrice);

      problemText = `You have RM${budget}. Candy costs RM${itemPrice} each. How many can you buy?`;
      answer = quantity;
    } else {
      // Calculate change
      const budget = randomIntByGrade(grade, {
        lower: { min: 25, max: 40 },
        middle: { min: 30, max: 50 },
        upper: { min: 35, max: 60 },
      }) * 2;
      const item1Price = randomIntByGrade(grade, {
        lower: { min: 4, max: 10 },
        middle: { min: 6, max: 15 },
        upper: { min: 8, max: 20 },
      });
      const item2Price = randomIntByGrade(grade, {
        lower: { min: 6, max: 14 },
        middle: { min: 8, max: 18 },
        upper: { min: 12, max: 24 },
      });
      const totalSpent = item1Price + item2Price;
      const change = budget - totalSpent;

      problemText = `You have RM${budget}. You buy a book for RM${item1Price} and a pen for RM${item2Price}. What is your change?`;
      answer = change;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: budgetType === 0 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: budgetType === 0 ? '' : 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 値段の比較問題を生成（英語）
 * Generate price comparison problems (English)
 */
export function generateShoppingComparisonEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const comparisonType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (comparisonType === 0) {
      // Compare unit prices
      const weight1 = randomIntByGrade(grade, {
        lower: { min: 40, max: 90 },
        middle: { min: 60, max: 120 },
        upper: { min: 80, max: 180 },
      });
      const price1 = randomIntByGrade(grade, {
        lower: { min: 2, max: 4 },
        middle: { min: 3, max: 6 },
        upper: { min: 4, max: 8 },
      });
      const weight2 = randomIntByGrade(grade, {
        lower: { min: 60, max: 120 },
        middle: { min: 80, max: 180 },
        upper: { min: 110, max: 250 },
      });
      const price2 = randomIntByGrade(grade, {
        lower: { min: 3, max: 6 },
        middle: { min: 4, max: 8 },
        upper: { min: 5, max: 10 },
      });

      const unitPrice1 = Math.round((price1 / weight1) * 100 * 100) / 100;
      const unitPrice2 = Math.round((price2 / weight2) * 100 * 100) / 100;
      const priceDiff = Math.round(Math.abs(unitPrice1 - unitPrice2) * 100);

      problemText = `Shop A sells ${weight1}g for RM${price1}. Shop B sells ${weight2}g for RM${price2}. What is the price difference per 100g (in sen)?`;
      answer = priceDiff;
    } else {
      // Calculate total price difference
      const priceA = randomIntByGrade(grade, {
        lower: { min: 2, max: 4 },
        middle: { min: 3, max: 6 },
        upper: { min: 4, max: 8 },
      });
      const priceB = randomIntByGrade(grade, {
        lower: { min: 3, max: 5 },
        middle: { min: 4, max: 7 },
        upper: { min: 5, max: 9 },
      });
      const quantity = randomIntByGrade(grade, {
        lower: { min: 2, max: 4 },
        middle: { min: 3, max: 6 },
        upper: { min: 4, max: 8 },
      });
      const totalA = priceA * quantity;
      const totalB = priceB * quantity;
      const difference = Math.abs(totalA - totalB);

      problemText = `Shop A sells apples for RM${priceA} each. Shop B sells them for RM${priceB} each. What is the price difference for ${quantity} apples?`;
      answer = difference;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: comparisonType === 0 ? 'sen' : 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた買い物問題を生成（英語）
 * Generate grade-appropriate shopping problems (English)
 */
export function generateGradeShoppingProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'shopping-discount-en' | 'shopping-budget-en' | 'shopping-comparison-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'shopping-discount-en':
      return generateShoppingDiscountEn(grade, count);
    case 'shopping-budget-en':
      return generateShoppingBudgetEn(grade, count);
    case 'shopping-comparison-en':
      return generateShoppingComparisonEn(grade, count);
    default:
      return generateShoppingDiscountEn(grade, count);
  }
}
