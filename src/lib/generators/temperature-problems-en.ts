/**
 * 温度の計算問題生成器（英語）
 * Temperature calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 温度差の計算問題を生成（英語）
 * Generate temperature difference problems (English)
 */
export function generateTemperatureDiffEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Temperature rise
      const morningTemp = randomInt(18, 25); // 18-25℃
      const noonTemp = morningTemp + randomInt(5, 12); // +5-12℃
      const tempRise = noonTemp - morningTemp;

      problemText = `The temperature was ${morningTemp}°C in the morning. It rose to ${noonTemp}°C at noon. How many degrees did it rise?`;
      answer = tempRise;
    } else if (problemType === 1) {
      // Temperature drop
      const afternoonTemp = randomInt(28, 35); // 28-35℃
      const eveningTemp = afternoonTemp - randomInt(5, 12); // -5-12℃
      const tempDrop = afternoonTemp - eveningTemp;

      problemText = `The temperature was ${afternoonTemp}°C in the afternoon. It dropped to ${eveningTemp}°C in the evening. How many degrees did it drop?`;
      answer = tempDrop;
    } else {
      // Temperature range (max - min)
      const minTemp = randomInt(20, 25); // 20-25℃
      const maxTemp = minTemp + randomInt(8, 15); // +8-15℃
      const tempDiff = maxTemp - minTemp;

      problemText = `Today's minimum temperature was ${minTemp}°C and maximum was ${maxTemp}°C. What is the temperature difference?`;
      answer = tempDiff;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: '°C',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 温度の変換問題を生成（英語、高学年向け）
 * Generate temperature conversion problems (English, for higher grades)
 */
export function generateTemperatureConversionEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (conversionType === 0) {
      // Celsius to Fahrenheit
      const celsius = randomInt(0, 40); // 0-40℃
      const fahrenheit = Math.round((celsius * 9 / 5) + 32);

      problemText = `Convert ${celsius}°C to Fahrenheit. (Formula: °F = °C × 9/5 + 32)`;
      answer = fahrenheit;
    } else {
      // Fahrenheit to Celsius
      const fahrenheit = randomInt(32, 104); // 32-104℉ (equals 0-40℃)
      const celsius = Math.round((fahrenheit - 32) * 5 / 9);

      problemText = `Convert ${fahrenheit}°F to Celsius. (Formula: °C = (°F - 32) × 5/9)`;
      answer = celsius;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: grade >= 5 ? ('multiplication' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: conversionType === 0 ? '°F' : '°C',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた温度問題を生成（英語）
 * Generate grade-appropriate temperature problems (English)
 */
export function generateGradeTemperatureProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'temperature-diff-en' | 'temperature-conversion-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'temperature-diff-en':
      return generateTemperatureDiffEn(grade, count);
    case 'temperature-conversion-en':
      return generateTemperatureConversionEn(grade, count);
    default:
      return generateTemperatureDiffEn(grade, count);
  }
}
