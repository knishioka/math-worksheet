/**
 * 単位変換問題生成器（英語）
 * Unit conversion problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 長さの単位変換問題を生成（英語）
 * Generate length unit conversion problems (English)
 */
export function generateUnitLengthEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 3);
    let problemText: string;
    let answer: number | string;

    if (conversionType === 0) {
      // m to cm conversion
      const meters = randomInt(1, 10);
      const centimeters = randomInt(0, 9) * 10;
      const totalCm = meters * 100 + centimeters;

      problemText = `Convert ${meters}m ${centimeters}cm to centimeters. How many cm?`;
      answer = totalCm;
    } else if (conversionType === 1) {
      // cm to m and cm conversion
      const totalCm = randomInt(100, 900);
      const meters = Math.floor(totalCm / 100);
      const centimeters = totalCm % 100;

      problemText = `Convert ${totalCm}cm to meters and centimeters.`;
      answer = centimeters === 0 ? `${meters}m` : `${meters}m ${centimeters}cm`;
    } else if (conversionType === 2) {
      // km to m conversion
      const kilometers = randomInt(1, 5);
      const meters = randomInt(0, 9) * 100;
      const totalM = kilometers * 1000 + meters;

      problemText = `Convert ${kilometers}km ${meters}m to meters. How many meters?`;
      answer = totalM;
    } else {
      // cm to mm conversion
      const centimeters = randomInt(1, 50);
      const millimeters = centimeters * 10;

      problemText = `Convert ${centimeters}cm to millimeters. How many mm?`;
      answer = millimeters;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 重さの単位変換問題を生成（英語）
 * Generate weight unit conversion problems (English)
 */
export function generateUnitWeightEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 1);
    let problemText: string;
    let answer: number | string;

    if (conversionType === 0) {
      // kg to g conversion
      const kilograms = randomInt(1, 5);
      const grams = randomInt(0, 9) * 100;
      const totalG = kilograms * 1000 + grams;

      problemText = `Convert ${kilograms}kg ${grams}g to grams. How many grams?`;
      answer = totalG;
    } else {
      // g to kg and g conversion
      const totalG = randomInt(1000, 5000);
      const kilograms = Math.floor(totalG / 1000);
      const grams = totalG % 1000;

      problemText = `Convert ${totalG}g to kilograms and grams.`;
      answer = grams === 0 ? `${kilograms}kg` : `${kilograms}kg ${grams}g`;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * かさの単位変換問題を生成（英語）
 * Generate capacity unit conversion problems (English)
 */
export function generateUnitCapacityEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 1);
    let problemText: string;
    let answer: number | string;

    if (conversionType === 0) {
      // L to mL conversion
      const liters = randomInt(1, 5);
      const milliliters = randomInt(0, 9) * 100;
      const totalMl = liters * 1000 + milliliters;

      problemText = `Convert ${liters}L ${milliliters}mL to milliliters. How many mL?`;
      answer = totalMl;
    } else {
      // mL to L and mL conversion
      const totalMl = randomInt(1000, 5000);
      const liters = Math.floor(totalMl / 1000);
      const milliliters = totalMl % 1000;

      problemText = `Convert ${totalMl}mL to liters and milliliters.`;
      answer = milliliters === 0 ? `${liters}L` : `${liters}L ${milliliters}mL`;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた単位変換問題を生成（英語）
 * Generate grade-appropriate unit conversion problems (English)
 */
export function generateGradeUnitProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'unit-length-en' | 'unit-weight-en' | 'unit-capacity-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'unit-length-en':
      return generateUnitLengthEn(grade, count);
    case 'unit-weight-en':
      return generateUnitWeightEn(grade, count);
    case 'unit-capacity-en':
      return generateUnitCapacityEn(grade, count);
    default:
      return generateUnitLengthEn(grade, count);
  }
}
