/**
 * お小遣いの管理問題生成器（日本語）
 * Allowance management problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { rangeByGrade } from './grade-utils';

/**
 * 貯金の計算問題を生成
 * Generate saving calculation problems
 */
export function generateAllowanceSaving(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 毎週/毎月の貯金額から必要な期間を計算
      const savingBand = rangeByGrade(grade, {
        lower: { min: 5, max: 12 },
        middle: { min: 8, max: 20 },
        upper: { min: 12, max: 28 },
      });
      const savingPerPeriod = randomInt(savingBand.min, savingBand.max) * 10;
      const targetBand = rangeByGrade(grade, {
        lower: { min: 5, max: 12 },
        middle: { min: 8, max: 20 },
        upper: { min: 12, max: 30 },
      });
      const targetAmount = randomInt(targetBand.min, targetBand.max) * 100;
      const periods = Math.ceil(targetAmount / savingPerPeriod);

      const periodType = randomInt(0, 1) === 0 ? '週' : 'ヶ月';
      problemText = `毎${periodType}${savingPerPeriod}円ずつ貯金します。${targetAmount}円貯めるには何${periodType}かかりますか？`;
      answer = periods;
    } else {
      // 一定期間での総貯金額を計算
      const savingBand = rangeByGrade(grade, {
        lower: { min: 10, max: 18 },
        middle: { min: 12, max: 30 },
        upper: { min: 18, max: 40 },
      });
      const savingPerPeriod = randomInt(savingBand.min, savingBand.max) * 10;
      const periodsRange = rangeByGrade(grade, {
        lower: { min: 4, max: 8 },
        middle: { min: 6, max: 12 },
        upper: { min: 9, max: 16 },
      });
      const periods = randomInt(periodsRange.min, periodsRange.max);

      const periodType = randomInt(0, 1) === 0 ? '週間' : 'ヶ月';
      const totalSaving = savingPerPeriod * periods;

      problemText = `毎${periodType.replace('間', '').replace('月', 'ヶ月')}${savingPerPeriod}円ずつ${periods}${periodType}貯金しました。全部でいくら貯まりましたか？`;
      answer = totalSaving;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('division' as Operation) : ('multiplication' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '' : '円',
    });
  }

  return problems;
}

/**
 * 目標達成までの計算問題を生成
 * Generate savings goal problems
 */
export function generateAllowanceGoal(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 目標金額に達するまでの期間
      const targetBand = rangeByGrade(grade, {
        lower: { min: 8, max: 18 },
        middle: { min: 12, max: 24 },
        upper: { min: 18, max: 36 },
      });
      const targetAmount = randomInt(targetBand.min, targetBand.max) * 100;
      const savingBand = rangeByGrade(grade, {
        lower: { min: 1, max: 3 },
        middle: { min: 2, max: 5 },
        upper: { min: 3, max: 7 },
      });
      const savingPerMonth = randomInt(savingBand.min, savingBand.max) * 100;
      const months = Math.ceil(targetAmount / savingPerMonth);

      const item = ['ゲーム', '本', 'おもちゃ'][randomInt(0, 2)];
      problemText = `${targetAmount}円の${item}を買いたいです。毎月${savingPerMonth}円貯金すると、何ヶ月で買えますか？`;
      answer = months;
    } else {
      // あと何円貯めればよいか
      const targetBand = rangeByGrade(grade, {
        lower: { min: 10, max: 20 },
        middle: { min: 14, max: 28 },
        upper: { min: 18, max: 40 },
      });
      const targetAmount = randomInt(targetBand.min, targetBand.max) * 100;
      const savingsFloor = Math.max(2, Math.floor(targetBand.min * 0.4));
      const savingsCeil = Math.max(savingsFloor + 1, Math.floor(targetAmount / 100) - 1);
      const currentSaving = randomInt(savingsFloor, savingsCeil) * 100;
      const remaining = targetAmount - currentSaving;

      problemText = `${targetAmount}円の貯金が目標です。今${currentSaving}円貯まっています。あと何円必要ですか？`;
      answer = remaining;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('division' as Operation) : ('subtraction' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? 'ヶ月' : '円',
    });
  }

  return problems;
}

/**
 * 学年に応じたお小遣い問題を生成
 * Generate grade-appropriate allowance problems
 */
export function generateGradeAllowanceProblems(
  grade: Grade,
  count: number,
  pattern: 'allowance-saving-jap' | 'allowance-goal-jap'
): WordProblem[] {
  switch (pattern) {
    case 'allowance-saving-jap':
      return generateAllowanceSaving(grade, count);
    case 'allowance-goal-jap':
      return generateAllowanceGoal(grade, count);
    default:
      return generateAllowanceSaving(grade, count);
  }
}
