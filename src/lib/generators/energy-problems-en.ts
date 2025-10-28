/**
 * 省エネ・電気の計算問題生成器（英語）
 * Energy and electricity calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 電気使用量の計算問題を生成（英語）
 * Generate energy usage problems (English)
 */
export function generateEnergyUsageEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  const appliances = [
    { name: 'air conditioner', wattHour: [800, 1000, 1200, 1500] },
    { name: 'television', wattHour: [50, 80, 100, 150] },
    { name: 'heater', wattHour: [1000, 1200, 1500, 2000] },
    { name: 'microwave', wattHour: [1000, 1200, 1400, 1600] },
    { name: 'refrigerator', wattHour: [40, 50, 60, 80] },
  ];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Power consumption per hour × hours
      const appliance = appliances[randomInt(0, appliances.length - 1)];
      const wattHour = appliance.wattHour[randomInt(0, appliance.wattHour.length - 1)];
      const hours = randomInt(3, 8); // 3-8 hours
      const totalWh = wattHour * hours;

      problemText = `A ${appliance.name} uses ${wattHour}Wh per hour. How much energy does it use in ${hours} hours?`;
      answer = totalWh;
    } else {
      // Daily usage to monthly usage
      const dailyWh = randomInt(8, 20) * 100; // 800-2000Wh
      const days = 30;
      const monthlyWh = dailyWh * days;

      problemText = `You use ${dailyWh}Wh of electricity per day. How much in 30 days?`;
      answer = monthlyWh;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'multiplication' as Operation,
      problemText,
      answer,
      unit: 'Wh',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 節約額の計算問題を生成（英語）
 * Generate energy saving problems (English)
 */
export function generateEnergySavingEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Monthly savings to yearly savings
      const monthlySaving = randomInt(10, 30); // RM10-RM30
      const yearlySaving = monthlySaving * 12;

      problemText = `By switching to LED bulbs, you save RM${monthlySaving} per month. How much do you save in a year?`;
      answer = yearlySaving;
    } else {
      // Energy consumption reduction
      const beforeWh = randomInt(50, 100) * 100; // 5000-10000Wh
      const reductionPercent = [10, 20, 25, 30][randomInt(0, 3)]; // 10%, 20%, 25%, 30%
      const reductionWh = Math.floor(beforeWh * reductionPercent / 100);

      problemText = `You used ${beforeWh}Wh per month, but reduced it by ${reductionPercent}%. How much Wh did you save?`;
      answer = reductionWh;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('multiplication' as Operation) : ('division' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? 'RM' : 'Wh',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた省エネ問題を生成（英語）
 * Generate grade-appropriate energy problems (English)
 */
export function generateGradeEnergyProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'energy-usage-en' | 'energy-saving-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'energy-usage-en':
      return generateEnergyUsageEn(grade, count);
    case 'energy-saving-en':
      return generateEnergySavingEn(grade, count);
    default:
      return generateEnergyUsageEn(grade, count);
  }
}
