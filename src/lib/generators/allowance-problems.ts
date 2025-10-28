/**
 * お小遣いの管理問題生成器（日本語）
 * Allowance management problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
      const savingPerPeriod = randomInt(5, 20) * 10; // 50-200円
      const targetAmount = randomInt(5, 15) * 100; // 500-1500円
      const periods = Math.ceil(targetAmount / savingPerPeriod);

      const periodType = randomInt(0, 1) === 0 ? '週' : 'ヶ月';
      problemText = `毎${periodType}${savingPerPeriod}円ずつ貯金します。${targetAmount}円貯めるには何${periodType}かかりますか？`;
      answer = periods;
    } else {
      // 一定期間での総貯金額を計算
      const savingPerPeriod = randomInt(10, 30) * 10; // 100-300円
      const periods = randomInt(5, 12); // 5-12期間

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
      const targetAmount = randomInt(8, 20) * 100; // 800-2000円
      const savingPerMonth = randomInt(1, 3) * 100; // 100-300円
      const months = Math.ceil(targetAmount / savingPerMonth);

      const item = ['ゲーム', '本', 'おもちゃ'][randomInt(0, 2)];
      problemText = `${targetAmount}円の${item}を買いたいです。毎月${savingPerMonth}円貯金すると、何ヶ月で買えますか？`;
      answer = months;
    } else {
      // あと何円貯めればよいか
      const targetAmount = randomInt(10, 20) * 100; // 1000-2000円
      const currentSaving = randomInt(3, targetAmount / 100 - 2) * 100; // 300円〜目標の少し手前
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
