/**
 * 温度の計算問題生成器（日本語）
 * Temperature calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

/**
 * 温度差の計算問題を生成
 * Generate temperature difference problems
 */
export function generateTemperatureDiff(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 気温の上昇
      const morningTemp = randomIntByGrade(grade, {
        lower: { min: 4, max: 18 },
        middle: { min: 6, max: 22 },
        upper: { min: 8, max: 26 },
      });
      const noonTemp = morningTemp + randomIntByGrade(grade, {
        lower: { min: 4, max: 8 },
        middle: { min: 5, max: 12 },
        upper: { min: 6, max: 15 },
      });
      const tempRise = noonTemp - morningTemp;

      problemText = `朝の気温は${morningTemp}℃でした。昼には${noonTemp}℃になりました。何度上がりましたか？`;
      answer = tempRise;
    } else if (problemType === 1) {
      // 気温の下降
      const afternoonTemp = randomIntByGrade(grade, {
        lower: { min: 18, max: 28 },
        middle: { min: 20, max: 32 },
        upper: { min: 22, max: 35 },
      });
      const eveningTemp = afternoonTemp - randomIntByGrade(grade, {
        lower: { min: 3, max: 7 },
        middle: { min: 4, max: 10 },
        upper: { min: 5, max: 12 },
      });
      const tempDrop = afternoonTemp - eveningTemp;

      problemText = `午後の気温は${afternoonTemp}℃でした。夕方には${eveningTemp}℃になりました。何度下がりましたか？`;
      answer = tempDrop;
    } else {
      // 最高気温と最低気温の差
      const minTemp = randomIntByGrade(grade, {
        lower: { min: 4, max: 14 },
        middle: { min: 5, max: 18 },
        upper: { min: 6, max: 20 },
      });
      const maxTemp = minTemp + randomIntByGrade(grade, {
        lower: { min: 6, max: 10 },
        middle: { min: 7, max: 15 },
        upper: { min: 8, max: 18 },
      });
      const tempDiff = maxTemp - minTemp;

      problemText = `今日の最低気温は${minTemp}℃、最高気温は${maxTemp}℃でした。気温差は何度ですか？`;
      answer = tempDiff;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '℃',
    });
  }

  return problems;
}

/**
 * 温度の変換問題を生成（高学年向け）
 * Generate temperature conversion problems (for higher grades)
 */
export function generateTemperatureConversion(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (conversionType === 0) {
      // 摂氏から華氏へ
      const celsius = randomIntByGrade(grade, {
        lower: { min: -5, max: 30 },
        middle: { min: -2, max: 35 },
        upper: { min: -5, max: 40 },
      });
      const fahrenheit = Math.round((celsius * 9 / 5) + 32);

      problemText = `摂氏${celsius}℃は華氏何度ですか？（計算式：℉ = ℃ × 9/5 + 32）`;
      answer = fahrenheit;
    } else {
      // 華氏から摂氏へ
      const fahrenheitRange = rangeByGrade(grade, {
        lower: { min: 32, max: 90 },
        middle: { min: 32, max: 102 },
        upper: { min: 20, max: 108 },
      });
      const fahrenheit = randomInt(fahrenheitRange.min, fahrenheitRange.max);
      const celsius = Math.round((fahrenheit - 32) * 5 / 9);

      problemText = `華氏${fahrenheit}℉は摂氏何度ですか？（計算式：℃ = (℉ - 32) × 5/9）`;
      answer = celsius;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: grade >= 5 ? ('multiplication' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: conversionType === 0 ? '℉' : '℃',
    });
  }

  return problems;
}

/**
 * 学年に応じた温度問題を生成
 * Generate grade-appropriate temperature problems
 */
export function generateGradeTemperatureProblems(
  grade: Grade,
  count: number,
  pattern: 'temperature-diff-jap' | 'temperature-conversion-jap'
): WordProblem[] {
  switch (pattern) {
    case 'temperature-diff-jap':
      return generateTemperatureDiff(grade, count);
    case 'temperature-conversion-jap':
      return generateTemperatureConversion(grade, count);
    default:
      return generateTemperatureDiff(grade, count);
  }
}
