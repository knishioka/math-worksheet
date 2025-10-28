/**
 * 単位変換問題生成器（日本語）
 * Unit conversion problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 長さの単位変換問題を生成
 * Generate length unit conversion problems
 */
export function generateUnitLength(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 3);
    let problemText: string;
    let answer: number | string;

    if (conversionType === 0) {
      // m と cm の変換
      const meters = randomInt(1, 10);
      const centimeters = randomInt(0, 9) * 10;
      const totalCm = meters * 100 + centimeters;

      problemText = `${meters}m ${centimeters}cm は何cmですか？`;
      answer = totalCm;
    } else if (conversionType === 1) {
      // cm を m と cm に変換
      const totalCm = randomInt(100, 900);
      const meters = Math.floor(totalCm / 100);
      const centimeters = totalCm % 100;

      problemText = `${totalCm}cm は何m何cmですか？`;
      answer = centimeters === 0 ? `${meters}m` : `${meters}m ${centimeters}cm`;
    } else if (conversionType === 2) {
      // km と m の変換
      const kilometers = randomInt(1, 5);
      const meters = randomInt(0, 9) * 100;
      const totalM = kilometers * 1000 + meters;

      problemText = `${kilometers}km ${meters}m は何mですか？`;
      answer = totalM;
    } else {
      // cm と mm の変換
      const centimeters = randomInt(1, 50);
      const millimeters = centimeters * 10;

      problemText = `${centimeters}cm は何mmですか？`;
      answer = millimeters;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
    });
  }

  return problems;
}

/**
 * 重さの単位変換問題を生成
 * Generate weight unit conversion problems
 */
export function generateUnitWeight(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 1);
    let problemText: string;
    let answer: number | string;

    if (conversionType === 0) {
      // kg と g の変換
      const kilograms = randomInt(1, 5);
      const grams = randomInt(0, 9) * 100;
      const totalG = kilograms * 1000 + grams;

      problemText = `${kilograms}kg ${grams}g は何gですか？`;
      answer = totalG;
    } else {
      // g を kg と g に変換
      const totalG = randomInt(1000, 5000);
      const kilograms = Math.floor(totalG / 1000);
      const grams = totalG % 1000;

      problemText = `${totalG}g は何kg何gですか？`;
      answer = grams === 0 ? `${kilograms}kg` : `${kilograms}kg ${grams}g`;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
    });
  }

  return problems;
}

/**
 * かさの単位変換問題を生成
 * Generate capacity unit conversion problems
 */
export function generateUnitCapacity(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const conversionType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (conversionType === 0) {
      // L と mL の変換
      const liters = randomInt(1, 5);
      const milliliters = randomInt(0, 9) * 100;
      const totalMl = liters * 1000 + milliliters;

      problemText = `${liters}L ${milliliters}mL は何mLですか？`;
      answer = totalMl;
    } else if (conversionType === 1) {
      // mL を L と mL に変換
      const totalMl = randomInt(1000, 5000);
      const liters = Math.floor(totalMl / 1000);
      const milliliters = totalMl % 1000;

      problemText = `${totalMl}mL は何L何mLですか？`;
      answer = milliliters === 0 ? `${liters}L` : `${liters}L ${milliliters}mL`;
    } else {
      // L と dL の変換
      const liters = randomInt(1, 10);
      const deciliters = liters * 10;

      problemText = `${liters}L は何dLですか？`;
      answer = deciliters;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'addition' as Operation,
      problemText,
      answer,
      unit: '',
    });
  }

  return problems;
}

/**
 * 学年に応じた単位変換問題を生成
 * Generate grade-appropriate unit conversion problems
 */
export function generateGradeUnitProblems(
  grade: Grade,
  count: number,
  pattern: 'unit-length-jap' | 'unit-weight-jap' | 'unit-capacity-jap'
): WordProblem[] {
  switch (pattern) {
    case 'unit-length-jap':
      return generateUnitLength(grade, count);
    case 'unit-weight-jap':
      return generateUnitWeight(grade, count);
    case 'unit-capacity-jap':
      return generateUnitCapacity(grade, count);
    default:
      return generateUnitLength(grade, count);
  }
}
