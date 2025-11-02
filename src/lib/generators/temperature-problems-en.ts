/**
 * 温度の計算問題生成器（英語）
 * Temperature calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

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
      const morningTemp = randomIntByGrade(grade, {
        lower: { min: 16, max: 24 },
        middle: { min: 18, max: 28 },
        upper: { min: 20, max: 32 },
      });
      const noonTemp = morningTemp + randomIntByGrade(grade, {
        lower: { min: 4, max: 8 },
        middle: { min: 5, max: 12 },
        upper: { min: 6, max: 15 },
      });
      const tempRise = noonTemp - morningTemp;

      problemText = `The temperature was ${morningTemp}°C in the morning. It rose to ${noonTemp}°C at noon. How many degrees did it rise?`;
      answer = tempRise;
    } else if (problemType === 1) {
      // Temperature drop
      const afternoonTemp = randomIntByGrade(grade, {
        lower: { min: 24, max: 32 },
        middle: { min: 26, max: 35 },
        upper: { min: 28, max: 38 },
      });
      const eveningTemp = afternoonTemp - randomIntByGrade(grade, {
        lower: { min: 3, max: 7 },
        middle: { min: 4, max: 10 },
        upper: { min: 5, max: 12 },
      });
      const tempDrop = afternoonTemp - eveningTemp;

      problemText = `The temperature was ${afternoonTemp}°C in the afternoon. It dropped to ${eveningTemp}°C in the evening. How many degrees did it drop?`;
      answer = tempDrop;
    } else {
      // Temperature range (max - min)
      const minTemp = randomIntByGrade(grade, {
        lower: { min: 18, max: 24 },
        middle: { min: 20, max: 27 },
        upper: { min: 22, max: 30 },
      });
      const maxTemp = minTemp + randomIntByGrade(grade, {
        lower: { min: 6, max: 10 },
        middle: { min: 7, max: 14 },
        upper: { min: 8, max: 18 },
      });
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
      const celsius = randomIntByGrade(grade, {
        lower: { min: -5, max: 30 },
        middle: { min: -2, max: 35 },
        upper: { min: -5, max: 40 },
      });
      const fahrenheit = Math.round((celsius * 9 / 5) + 32);

      problemText = `Convert ${celsius}°C to Fahrenheit. (Formula: °F = °C × 9/5 + 32)`;
      answer = fahrenheit;
    } else {
      // Fahrenheit to Celsius
      const fahrenheitRange = rangeByGrade(grade, {
        lower: { min: 32, max: 90 },
        middle: { min: 32, max: 102 },
        upper: { min: 20, max: 108 },
      });
      const fahrenheit = randomInt(fahrenheitRange.min, fahrenheitRange.max);
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
