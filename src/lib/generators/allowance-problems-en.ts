/**
 * お小遣いの管理問題生成器（英語）
 * Allowance management problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

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
      const savingPerPeriod = randomIntByGrade(grade, {
        lower: { min: 3, max: 8 },
        middle: { min: 5, max: 12 },
        upper: { min: 8, max: 18 },
      });
      const targetAmount = randomIntByGrade(grade, {
        lower: { min: 25, max: 70 },
        middle: { min: 45, max: 140 },
        upper: { min: 80, max: 220 },
      });
      const periods = Math.ceil(targetAmount / savingPerPeriod);

      const periodType = randomInt(0, 1) === 0 ? 'week' : 'month';
      const periodPlural = periods > 1 ? periodType + 's' : periodType;

      problemText = `You save RM${savingPerPeriod} per ${periodType}. How many ${periodPlural} to save RM${targetAmount}?`;
      answer = periods;
    } else {
      // Calculate total savings over time
      const savingPerPeriod = randomIntByGrade(grade, {
        lower: { min: 4, max: 9 },
        middle: { min: 6, max: 14 },
        upper: { min: 9, max: 20 },
      });
      const { min: minPeriods, max: maxPeriods } = rangeByGrade(grade, {
        lower: { min: 4, max: 8 },
        middle: { min: 6, max: 12 },
        upper: { min: 9, max: 16 },
      });
      const periods = randomInt(minPeriods, maxPeriods);

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
      const targetAmount = randomIntByGrade(grade, {
        lower: { min: 40, max: 100 },
        middle: { min: 60, max: 180 },
        upper: { min: 90, max: 250 },
      });
      const savingPerMonth = randomIntByGrade(grade, {
        lower: { min: 4, max: 10 },
        middle: { min: 6, max: 16 },
        upper: { min: 10, max: 25 },
      });
      const months = Math.ceil(targetAmount / savingPerMonth);

      const item = ['game', 'book', 'toy'][randomInt(0, 2)];
      problemText = `You want to buy a ${item} for RM${targetAmount}. If you save RM${savingPerMonth} per month, how many months will it take?`;
      answer = months;
    } else {
      // Amount still needed
      const targetAmount = randomIntByGrade(grade, {
        lower: { min: 50, max: 100 },
        middle: { min: 80, max: 200 },
        upper: { min: 120, max: 320 },
      });
      const savingsWindow = rangeByGrade(grade, {
        lower: { min: Math.max(15, Math.floor(targetAmount * 0.3)), max: targetAmount - 10 },
        middle: { min: Math.max(25, Math.floor(targetAmount * 0.35)), max: targetAmount - 15 },
        upper: { min: Math.max(40, Math.floor(targetAmount * 0.4)), max: targetAmount - 20 },
      });
      const currentSaving = randomInt(savingsWindow.min, Math.max(savingsWindow.min + 1, savingsWindow.max));
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
