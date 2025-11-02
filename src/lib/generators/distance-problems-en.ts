/**
 * 距離と地図の計算問題生成器（英語）
 * Distance and map calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

/**
 * 歩く距離の計算問題を生成（英語）
 * Generate walking distance problems (English)
 */
export function generateDistanceWalkEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // Total distance of multiple segments (in meters)
      const distance1 = randomIntByGrade(grade, {
        lower: { min: 200, max: 600 },
        middle: { min: 400, max: 1000 },
        upper: { min: 600, max: 1500 },
      });
      const distance2 = randomIntByGrade(grade, {
        lower: { min: 250, max: 700 },
        middle: { min: 500, max: 1200 },
        upper: { min: 800, max: 1800 },
      });
      const totalMeters = distance1 + distance2;

      problemText = `You walk ${distance1}m from home to school, then ${distance2}m from school to the park. What is the total distance in meters?`;
      answer = totalMeters;
    } else if (problemType === 1) {
      // Convert meters to km and m
      const totalMeters = randomIntByGrade(grade, {
        lower: { min: 800, max: 2000 },
        middle: { min: 1200, max: 4000 },
        upper: { min: 1800, max: 6000 },
      });
      const kilometers = Math.floor(totalMeters / 1000);
      const meters = totalMeters % 1000;

      problemText = `Convert ${totalMeters}m to kilometers and meters.`;
      answer = meters === 0 ? `${kilometers}km` : `${kilometers}km ${meters}m`;
    } else {
      // Convert km and m to total meters
      const kilometers = randomIntByGrade(grade, {
        lower: { min: 1, max: 2 },
        middle: { min: 1, max: 3 },
        upper: { min: 2, max: 4 },
      });
      const meters = randomIntByGrade(grade, {
        lower: { min: 100, max: 600 },
        middle: { min: 200, max: 900 },
        upper: { min: 300, max: 1200 },
      });
      const totalMeters = kilometers * 1000 + meters;

      problemText = `What is ${kilometers}km ${meters}m in meters?`;
      answer = totalMeters;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 1 ? ('division' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: problemType === 1 ? '' : 'm',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 地図の縮尺計算問題を生成（英語、高学年向け）
 * Generate map scale calculation problems (English, for higher grades)
 */
export function generateDistanceMapScaleEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // Calculate actual distance from map distance
      const mapCm = randomIntByGrade(grade, {
        lower: { min: 2, max: 6 },
        middle: { min: 3, max: 8 },
        upper: { min: 4, max: 10 },
      });
      const scaleOptions = grade <= 3 ? [100, 200, 500] : [200, 500, 1000, 2000];
      const scale = scaleOptions[randomInt(0, scaleOptions.length - 1)];
      const actualMeters = mapCm * scale;

      problemText = `On a map, 1cm represents ${scale}m in reality. What is the actual distance for ${mapCm}cm on the map?`;
      answer = actualMeters;
    } else {
      // Calculate map distance from actual distance
      const scaleOptions = grade <= 3 ? [100, 200] : [200, 500, 1000];
      const scale = scaleOptions[randomInt(0, scaleOptions.length - 1)];
      const actualMultipliers = rangeByGrade(grade, {
        lower: { min: 3, max: 8 },
        middle: { min: 4, max: 12 },
        upper: { min: 6, max: 18 },
      });
      const actualMeters = randomInt(actualMultipliers.min, actualMultipliers.max) * scale; // appropriate multiples
      const mapCm = actualMeters / scale;

      problemText = `On a map, 1cm represents ${scale}m. If the actual distance is ${actualMeters}m, what is the distance on the map?`;
      answer = mapCm;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: problemType === 0 ? ('multiplication' as Operation) : ('division' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? 'm' : 'cm',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 距離の比較問題を生成（英語）
 * Generate distance comparison problems (English)
 */
export function generateDistanceComparisonEn(grade: Grade, count: number): WordProblemEn[] {
  const problems: WordProblemEn[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // Compare km and m
      const distanceKm = randomIntByGrade(grade, {
        lower: { min: 10, max: 30 },
        middle: { min: 15, max: 40 },
        upper: { min: 20, max: 60 },
      }) / 10;
      const distanceM = randomIntByGrade(grade, {
        lower: { min: 800, max: 2500 },
        middle: { min: 1200, max: 4500 },
        upper: { min: 1800, max: 7000 },
      });
      const distanceKmInM = Math.round(distanceKm * 1000);
      const difference = Math.abs(distanceKmInM - distanceM);

      const longer = distanceKmInM > distanceM ? `${distanceKm}km` : `${distanceM}m`;
      problemText = `Which is longer: ${distanceKm}km or ${distanceM}m? How much longer (in meters)?`;
      answer = `${longer}, ${difference}m`;
    } else {
      // Difference between two distances
      const distance1 = randomIntByGrade(grade, {
        lower: { min: 600, max: 1400 },
        middle: { min: 900, max: 2200 },
        upper: { min: 1200, max: 3200 },
      });
      const distance2 = randomIntByGrade(grade, {
        lower: { min: 700, max: 1600 },
        middle: { min: 1100, max: 2600 },
        upper: { min: 1500, max: 3600 },
      });
      const difference = Math.abs(distance1 - distance2);

      problemText = `Point A to B is ${distance1}m. Point B to C is ${distance2}m. What is the difference in distance?`;
      answer = difference;
    }

    problems.push({
      id: generateId(),
      type: 'word-en',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: problemType === 0 ? '' : 'm',
      category: 'word-story',
      language: 'en',
    });
  }

  return problems;
}

/**
 * 学年に応じた距離問題を生成（英語）
 * Generate grade-appropriate distance problems (English)
 */
export function generateGradeDistanceProblemsEn(
  grade: Grade,
  count: number,
  pattern: 'distance-walk-en' | 'distance-map-scale-en' | 'distance-comparison-en'
): WordProblemEn[] {
  switch (pattern) {
    case 'distance-walk-en':
      return generateDistanceWalkEn(grade, count);
    case 'distance-map-scale-en':
      return generateDistanceMapScaleEn(grade, count);
    case 'distance-comparison-en':
      return generateDistanceComparisonEn(grade, count);
    default:
      return generateDistanceWalkEn(grade, count);
  }
}
