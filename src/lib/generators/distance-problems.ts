/**
 * 距離と地図の計算問題生成器（日本語）
 * Distance and map calculation problem generator (Japanese)
 */

import type { WordProblem, Operation, Grade } from '../../types';
import { randomInt, generateId } from '../utils/math';
import { randomIntByGrade, rangeByGrade } from './grade-utils';

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
      const distance1 = randomIntByGrade(grade, {
        lower: { min: 150, max: 600 },
        middle: { min: 350, max: 900 },
        upper: { min: 600, max: 1400 },
      });
      const distance2 = randomIntByGrade(grade, {
        lower: { min: 200, max: 700 },
        middle: { min: 400, max: 1100 },
        upper: { min: 700, max: 1700 },
      });
      const totalMeters = distance1 + distance2;

      problemText = `家から学校まで${distance1}m、学校から公園まで${distance2}m歩きました。合計何m歩きましたか？`;
      answer = totalMeters;
    } else if (problemType === 1) {
      // m から km への変換
      const totalMeters = randomIntByGrade(grade, {
        lower: { min: 700, max: 1800 },
        middle: { min: 1000, max: 3500 },
        upper: { min: 1500, max: 5500 },
      });
      const kilometers = Math.floor(totalMeters / 1000);
      const meters = totalMeters % 1000;

      problemText = `${totalMeters}mは何kmと何mですか？`;
      answer = meters === 0 ? `${kilometers}km` : `${kilometers}km ${meters}m`;
    } else {
      // km と m の合計をmで表す
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
      const mapCm = randomIntByGrade(grade, {
        lower: { min: 2, max: 6 },
        middle: { min: 3, max: 8 },
        upper: { min: 4, max: 10 },
      });
      const scaleOptions = grade <= 3 ? [100, 200, 500] : [200, 500, 1000, 2000];
      const scale = scaleOptions[randomInt(0, scaleOptions.length - 1)];
      const actualMeters = mapCm * scale;

      problemText = `地図の1cmが実際の${scale}mです。地図上で${mapCm}cmの距離は、実際には何mですか？`;
      answer = actualMeters;
    } else {
      // 実際の距離から地図上の距離を計算
      const scaleOptions = grade <= 3 ? [100, 200] : [200, 500, 1000];
      const scale = scaleOptions[randomInt(0, scaleOptions.length - 1)];
      const actualMultipliers = rangeByGrade(grade, {
        lower: { min: 3, max: 8 },
        middle: { min: 4, max: 12 },
        upper: { min: 6, max: 18 },
      });
      const actualMeters = randomInt(actualMultipliers.min, actualMultipliers.max) * scale; // 適切な倍数
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
      const distanceKm = randomIntByGrade(grade, {
        lower: { min: 10, max: 30 },
        middle: { min: 15, max: 40 },
        upper: { min: 20, max: 60 },
      }) / 10;
      const distanceM = randomIntByGrade(grade, {
        lower: { min: 800, max: 2400 },
        middle: { min: 1100, max: 4200 },
        upper: { min: 1600, max: 6800 },
      });
      const distanceKmInM = Math.round(distanceKm * 1000);
      const difference = Math.abs(distanceKmInM - distanceM);

      const longer = distanceKmInM > distanceM ? `${distanceKm}km` : `${distanceM}m`;
      problemText = `${distanceKm}kmと${distanceM}m、どちらが長いですか？また、何m長いですか？`;
      answer = `${longer}、${difference}m`;
    } else {
      // 2つの距離の差
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
