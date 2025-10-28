/**
 * 省エネ・電気の計算問題生成器（日本語）
 * Energy and electricity calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 電気使用量の計算問題を生成
 * Generate energy usage problems
 */
export function generateEnergyUsage(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  const appliances = [
    { name: 'エアコン', wattHour: [600, 800, 1000, 1200] },
    { name: 'テレビ', wattHour: [50, 80, 100, 150] },
    { name: '電気ストーブ', wattHour: [800, 1000, 1200, 1500] },
    { name: '電子レンジ', wattHour: [1000, 1200, 1400] },
    { name: '冷蔵庫', wattHour: [40, 50, 60, 80] },
  ];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 1時間あたりの電力使用量 × 時間
      const appliance = appliances[randomInt(0, appliances.length - 1)];
      const wattHour = appliance.wattHour[randomInt(0, appliance.wattHour.length - 1)];
      const hours = randomInt(2, 8); // 2-8時間
      const totalWh = wattHour * hours;

      problemText = `${appliance.name}を${hours}時間使いました。1時間に${wattHour}Wh使うとき、全部で何Wh使いましたか？`;
      answer = totalWh;
    } else {
      // 1日の使用量から1ヶ月を計算
      const dailyWh = randomInt(5, 15) * 100; // 500-1500Wh
      const days = 30;
      const monthlyWh = dailyWh * days;

      problemText = `1日に${dailyWh}Whの電気を使います。30日では何Wh使いますか？`;
      answer = monthlyWh;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'multiplication' as Operation,
      problemText,
      answer,
      unit: 'Wh',
    });
  }

  return problems;
}

/**
 * 節約額の計算問題を生成
 * Generate energy saving problems
 */
export function generateEnergySaving(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 月々の節約額から年間節約額を計算
      const monthlySaving = randomInt(2, 10) * 100; // 200-1000円
      const yearlySaving = monthlySaving * 12;

      problemText = `LED電球に変えて、月に${monthlySaving}円節約できました。1年間では何円節約できますか？`;
      answer = yearlySaving;
    } else {
      // 電気使用量の削減
      const beforeWh = randomInt(40, 80) * 100; // 4000-8000Wh
      const reductionPercent = [10, 20, 25, 30][randomInt(0, 3)]; // 10%, 20%, 25%, 30%
      const reductionWh = Math.floor(beforeWh * reductionPercent / 100);

      problemText = `月に${beforeWh}Whの電気を使っていましたが、${reductionPercent}%削減しました。何Wh減りましたか？`;
      answer = reductionWh;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('multiplication' as Operation) : ('division' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? '円' : 'Wh',
    });
  }

  return problems;
}

/**
 * 学年に応じた省エネ問題を生成
 * Generate grade-appropriate energy problems
 */
export function generateGradeEnergyProblems(
  grade: Grade,
  count: number,
  pattern: 'energy-usage-jap' | 'energy-saving-jap'
): WordProblem[] {
  switch (pattern) {
    case 'energy-usage-jap':
      return generateEnergyUsage(grade, count);
    case 'energy-saving-jap':
      return generateEnergySaving(grade, count);
    default:
      return generateEnergyUsage(grade, count);
  }
}
