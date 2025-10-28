/**
 * お小遣いの管理問題生成器（英語）
 * Allowance management problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 貯金の計算問題を生成（英語）
 * Generate saving calculation problems (English)
 */
export function generateAllowanceSavingEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Calculate periods needed to reach target
      const savingPerPeriod = randomInt(3, 10); // RM3-10
      const targetAmount = randomInt(30, 100); // RM30-100
      const periods = Math.ceil(targetAmount / savingPerPeriod);

      const periodType = randomInt(0, 1) === 0 ? 'week' : 'month';
      const periodPlural = periods > 1 ? periodType + 's' : periodType;

      problemText = `You save RM${savingPerPeriod} per ${periodType}. How many ${periodType}s to save RM${targetAmount}?`;
      answer = periods;
    } else {
      // Calculate total savings over time
      const savingPerPeriod = randomInt(5, 15); // RM5-15
      const periods = randomInt(6, 12); // 6-12 periods

      const periodType = randomInt(0, 1) === 0 ? 'week' : 'month';
      const periodPlural = periods > 1 ? periodType + 's' : periodType;
      const totalSaving = savingPerPeriod * periods;

      problemText = `You save RM${savingPerPeriod} per ${periodType} for ${periods} ${periodPlural}. How much in total?`;
      answer = totalSaving;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('division' as Operation) : ('multiplication' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 目標達成までの計算問題を生成（英語）
 * Generate savings goal problems (English)
 */
export function generateAllowanceGoalEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Months to reach goal
      const targetAmount = randomInt(40, 100); // RM40-100
      const savingPerMonth = randomInt(5, 15); // RM5-15
      const months = Math.ceil(targetAmount / savingPerMonth);

      const item = ['game', 'book', 'toy'][randomInt(0, 2)];
      problemText = `You want to buy a ${item} for RM${targetAmount}. If you save RM${savingPerMonth} per month, how many months will it take?`;
      answer = months;
    } else {
      // Amount still needed
      const targetAmount = randomInt(50, 100); // RM50-100
      const currentSaving = randomInt(20, targetAmount - 10); // RM20 to slightly below target
      const remaining = targetAmount - currentSaving;

      problemText = `Your savings goal is RM${targetAmount}. You have saved RM${currentSaving}. How much more do you need?`;
      answer = remaining;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? 'months' : 'RM',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じたお小遣い問題を生成（英語）
 * Generate grade-appropriate allowance problems (English)
 */
export function generateGradeAllowanceProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'allowance-saving-en' | 'allowance-goal-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'allowance-saving-en':
      return generateAllowanceSavingEn(grade, count);
    case 'allowance-goal-en':
      return generateAllowanceGoalEn(grade, count);
    default:
      return generateAllowanceSavingEn(grade, count);
  }
}
