/**
 * 買い物の計算問題生成器（英語）
 * Shopping calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
      const originalPrice = randomInt(10, 50) * 2; // RM20-RM100
      const discountRate = [10, 20, 25, 30][randomInt(0, 3)]; // 10%, 20%, 25%, 30%
      const discountAmount = Math.floor(originalPrice * discountRate / 100);
      const finalPrice = originalPrice - discountAmount;

      problemText = `A shirt costs RM${originalPrice}. It has a ${discountRate}% discount. How much do you pay?`;
      answer = finalPrice;
    } else {
      // Calculate discount rate from discount amount
      const originalPrice = randomInt(20, 50) * 2; // RM40-RM100
      const discountAmount = randomInt(5, 20); // RM5-RM20
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
      const budget = randomInt(10, 30) * 2; // RM20-RM60
      const itemPrice = randomInt(2, 8); // RM2-RM8
      const quantity = Math.floor(budget / itemPrice);

      problemText = `You have RM${budget}. Candy costs RM${itemPrice} each. How many can you buy?`;
      answer = quantity;
    } else {
      // Calculate change
      const budget = randomInt(25, 50) * 2; // RM50-RM100
      const item1Price = randomInt(5, 15); // RM5-RM15
      const item2Price = randomInt(8, 20); // RM8-RM20
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
      const weight1 = randomInt(50, 100); // 50-100g
      const price1 = randomInt(2, 5); // RM2-RM5
      const weight2 = randomInt(80, 150); // 80-150g
      const price2 = randomInt(4, 8); // RM4-RM8

      const unitPrice1 = Math.round((price1 / weight1) * 100 * 100) / 100;
      const unitPrice2 = Math.round((price2 / weight2) * 100 * 100) / 100;
      const priceDiff = Math.round(Math.abs(unitPrice1 - unitPrice2) * 100);

      problemText = `Shop A sells ${weight1}g for RM${price1}. Shop B sells ${weight2}g for RM${price2}. What is the price difference per 100g (in sen)?`;
      answer = priceDiff;
    } else {
      // Calculate total price difference
      const priceA = randomInt(2, 5); // RM2-RM5
      const priceB = randomInt(3, 6); // RM3-RM6
      const quantity = randomInt(3, 6); // 3-6 items
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
