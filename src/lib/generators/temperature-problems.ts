/**
 * 温度の計算問題生成器（日本語）
 * Temperature calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
      const morningTemp = randomInt(5, 20); // 5-20℃
      const noonTemp = morningTemp + randomInt(5, 15); // +5-15℃
      const tempRise = noonTemp - morningTemp;

      problemText = `朝の気温は${morningTemp}℃でした。昼には${noonTemp}℃になりました。何度上がりましたか？`;
      answer = tempRise;
    } else if (problemType === 1) {
      // 気温の下降
      const afternoonTemp = randomInt(20, 30); // 20-30℃
      const eveningTemp = afternoonTemp - randomInt(5, 15); // -5-15℃
      const tempDrop = afternoonTemp - eveningTemp;

      problemText = `午後の気温は${afternoonTemp}℃でした。夕方には${eveningTemp}℃になりました。何度下がりましたか？`;
      answer = tempDrop;
    } else {
      // 最高気温と最低気温の差
      const minTemp = randomInt(5, 15); // 5-15℃
      const maxTemp = minTemp + randomInt(10, 20); // +10-20℃
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
      const celsius = randomInt(0, 40); // 0-40℃
      const fahrenheit = Math.round((celsius * 9 / 5) + 32);

      problemText = `摂氏${celsius}℃は華氏何度ですか？（計算式：℉ = ℃ × 9/5 + 32）`;
      answer = fahrenheit;
    } else {
      // 華氏から摂氏へ
      const fahrenheit = randomInt(32, 104); // 32-104℉ (0-40℃に相当)
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
