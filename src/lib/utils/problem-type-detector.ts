import type { ProblemType, CalculationPattern } from '../../types';
import { isWordProblemPattern, isHissanPattern } from '../../config/problem-patterns';

/**
 * 問題タイプ判定ユーティリティ
 * 問題タイプと計算パターンから実効的な問題タイプを判定
 */

/**
 * 英語文章問題かどうかを判定
 */
export function isWordEnProblem(calculationPattern?: CalculationPattern): boolean {
  return calculationPattern === 'word-en';
}

/**
 * 文章問題かどうかを判定
 * - 問題タイプが'word'
 * - または、基本計算で文章問題パターンが選択されている場合
 */
export function isWordProblem(
  problemType?: ProblemType,
  calculationPattern?: CalculationPattern
): boolean {
  return (
    problemType === 'word' ||
    (problemType === 'basic' && isWordProblemPattern(calculationPattern))
  );
}

/**
 * 筆算問題かどうかを判定
 * - 問題タイプが'hissan'または'hissan-div'
 * - または、基本計算で筆算パターンが選択されている場合
 */
export function isHissanProblem(
  problemType?: ProblemType,
  calculationPattern?: CalculationPattern
): boolean {
  return (
    problemType === 'hissan' ||
    problemType === 'hissan-div' ||
    (problemType === 'basic' && isHissanPattern(calculationPattern))
  );
}

/**
 * わり算筆算かどうかを判定
 */
export function isDivisionHissanProblem(
  calculationPattern?: CalculationPattern
): boolean {
  return calculationPattern === 'hissan-div-basic';
}

/**
 * 問題タイプと計算パターンから実効的な問題タイプを取得
 * 計算パターンによって実際の問題タイプが変わる場合に使用
 */
export function getEffectiveProblemType(
  problemType?: ProblemType,
  calculationPattern?: CalculationPattern
): ProblemType {
  if (isWordEnProblem(calculationPattern)) {
    return 'word-en';
  }
  if (isWordProblem(problemType, calculationPattern)) {
    return 'word';
  }
  // わり算筆算の場合は'hissan-div'テンプレートを使用
  if (isDivisionHissanProblem(calculationPattern)) {
    return 'hissan-div';
  }
  if (isHissanProblem(problemType, calculationPattern)) {
    return 'hissan';
  }
  return problemType || 'basic';
}
