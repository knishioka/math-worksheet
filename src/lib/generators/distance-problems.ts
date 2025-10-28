/**
 * 距離と地図の計算問題生成器（日本語）
 * Distance and map calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';

/**
 * 歩く距離の計算問題を生成
 * Generate walking distance problems
 */
export function generateDistanceWalk(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 2);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // 複数区間の合計距離（m単位）
      const distance1 = randomInt(200, 800); // 200-800m
      const distance2 = randomInt(300, 900); // 300-900m
      const totalMeters = distance1 + distance2;

      problemText = `家から学校まで${distance1}m、学校から公園まで${distance2}m歩きました。合計何m歩きましたか？`;
      answer = totalMeters;
    } else if (problemType === 1) {
      // m から km への変換
      const totalMeters = randomInt(1000, 3000); // 1000-3000m
      const kilometers = Math.floor(totalMeters / 1000);
      const meters = totalMeters % 1000;

      problemText = `${totalMeters}mは何kmと何mですか？`;
      answer = meters === 0 ? `${kilometers}km` : `${kilometers}km ${meters}m`;
    } else {
      // km と m の合計をmで表す
      const kilometers = randomInt(1, 3); // 1-3km
      const meters = randomInt(200, 800); // 200-800m
      const totalMeters = kilometers * 1000 + meters;

      problemText = `${kilometers}km ${meters}m は全部で何mですか？`;
      answer = totalMeters;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 1 ? ('division' as Operation) : ('addition' as Operation),
      problemText,
      answer,
      unit: problemType === 1 ? '' : 'm',
    });
  }

  return problems;
}

/**
 * 地図の縮尺計算問題を生成（高学年向け）
 * Generate map scale calculation problems (for higher grades)
 */
export function generateDistanceMapScale(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number;

    if (problemType === 0) {
      // 地図上の距離から実際の距離を計算
      const mapCm = randomInt(2, 8); // 2-8cm
      const scale = [100, 200, 500, 1000][randomInt(0, 3)]; // 100m, 200m, 500m, 1000m per 1cm
      const actualMeters = mapCm * scale;

      problemText = `地図の1cmが実際の${scale}mです。地図上で${mapCm}cmの距離は、実際には何mですか？`;
      answer = actualMeters;
    } else {
      // 実際の距離から地図上の距離を計算
      const scale = [100, 200, 500][randomInt(0, 2)]; // 100m, 200m, 500m per 1cm
      const actualMeters = randomInt(3, 10) * scale; // 適切な倍数
      const mapCm = actualMeters / scale;

      problemText = `地図の1cmが実際の${scale}mです。実際の距離が${actualMeters}mのとき、地図上では何cmですか？`;
      answer = mapCm;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: problemType === 0 ? ('multiplication' as Operation) : ('division' as Operation),
      problemText,
      answer,
      unit: problemType === 0 ? 'm' : 'cm',
    });
  }

  return problems;
}

/**
 * 距離の比較問題を生成
 * Generate distance comparison problems
 */
export function generateDistanceComparison(grade: Grade, count: number): WordProblem[] {
  const problems: WordProblem[] = [];

  for (let i = 0; i < count; i++) {
    const problemType = randomInt(0, 1);
    let problemText: string;
    let answer: number | string;

    if (problemType === 0) {
      // km と m の比較
      const distanceKm = randomInt(1, 3) + randomInt(0, 9) / 10; // 1.0-3.9km
      const distanceM = randomInt(1000, 4000); // 1000-4000m
      const distanceKmInM = Math.round(distanceKm * 1000);
      const difference = Math.abs(distanceKmInM - distanceM);

      const longer = distanceKmInM > distanceM ? `${distanceKm}km` : `${distanceM}m`;
      problemText = `${distanceKm}kmと${distanceM}m、どちらが長いですか？また、何m長いですか？`;
      answer = `${longer}、${difference}m`;
    } else {
      // 2つの距離の差
      const distance1 = randomInt(800, 1500); // 800-1500m
      const distance2 = randomInt(1000, 2000); // 1000-2000m
      const difference = Math.abs(distance1 - distance2);

      problemText = `A地点からB地点までは${distance1}m、B地点からC地点までは${distance2}mです。どちらが何m長いですか？`;
      answer = difference;
    }

    problems.push({
      id: generateId(),
      type: 'word',
      operation: 'subtraction' as Operation,
      problemText,
      answer,
      unit: problemType === 0 ? '' : 'm',
    });
  }

  return problems;
}

/**
 * 学年に応じた距離問題を生成
 * Generate grade-appropriate distance problems
 */
export function generateGradeDistanceProblems(
  grade: Grade,
  count: number,
  pattern: 'distance-walk-jap' | 'distance-map-scale-jap' | 'distance-comparison-jap'
): WordProblem[] {
  switch (pattern) {
    case 'distance-walk-jap':
      return generateDistanceWalk(grade, count);
    case 'distance-map-scale-jap':
      return generateDistanceMapScale(grade, count);
    case 'distance-comparison-jap':
      return generateDistanceComparison(grade, count);
    default:
      return generateDistanceWalk(grade, count);
  }
}
