/**
 * 距離と地図の計算問題生成器（英語）
 * Distance and map calculation problem generator (English)
 */

import type { WordProblemEn, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

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
      const distance1 = randomInt(300, 900); // 300-900m
      const distance2 = randomInt(400, 1000); // 400-1000m
      const totalMeters = distance1 + distance2;

      problemText = `You walk ${distance1}m from home to school, then ${distance2}m from school to the park. What is the total distance in meters?`;
      answer = totalMeters;
    } else if (problemType === 1) {
      // Convert meters to km and m
      const totalMeters = randomInt(1000, 3500); // 1000-3500m
      const kilometers = Math.floor(totalMeters / 1000);
      const meters = totalMeters % 1000;

      problemText = `Convert ${totalMeters}m to kilometers and meters.`;
      answer = meters === 0 ? `${kilometers}km` : `${kilometers}km ${meters}m`;
    } else {
      // Convert km and m to total meters
      const kilometers = randomInt(1, 3); // 1-3km
      const meters = randomInt(200, 800); // 200-800m
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
      const mapCm = randomInt(2, 8); // 2-8cm
      const scale = [100, 200, 500, 1000][randomInt(0, 3)]; // 100m, 200m, 500m, 1000m per 1cm
      const actualMeters = mapCm * scale;

      problemText = `On a map, 1cm represents ${scale}m in reality. What is the actual distance for ${mapCm}cm on the map?`;
      answer = actualMeters;
    } else {
      // Calculate map distance from actual distance
      const scale = [100, 200, 500][randomInt(0, 2)]; // 100m, 200m, 500m per 1cm
      const actualMeters = randomInt(3, 10) * scale; // appropriate multiples
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
      const distanceKm = randomInt(1, 3) + randomInt(0, 9) / 10; // 1.0-3.9km
      const distanceM = randomInt(1000, 4000); // 1000-4000m
      const distanceKmInM = Math.round(distanceKm * 1000);
      const difference = Math.abs(distanceKmInM - distanceM);

      const longer = distanceKmInM > distanceM ? `${distanceKm}km` : `${distanceM}m`;
      problemText = `Which is longer: ${distanceKm}km or ${distanceM}m? How much longer (in meters)?`;
      answer = `${longer}, ${difference}m`;
    } else {
      // Difference between two distances
      const distance1 = randomInt(800, 1500); // 800-1500m
      const distance2 = randomInt(1000, 2000); // 1000-2000m
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
