import type { CalculationPattern } from '../types/calculation-patterns';

/**
 * 問題パターン定義
 * 問題タイプを判定するためのパターン定義を集約
 */

/**
 * 文章問題を生成する計算パターン
 */
export const WORD_PROBLEM_PATTERNS: readonly CalculationPattern[] = [
  'percent-basic', // 百分率
  'area-volume', // 面積・体積
  'ratio-proportion', // 比と比例
  'speed-time-distance', // 速さ・時間・距離
  'complex-calc', // 複雑な計算
] as const;

/**
 * 筆算を生成する計算パターン
 */
export const HISSAN_PATTERNS: readonly CalculationPattern[] = [
  'hissan-add-double', // 2桁のたし算の筆算
  'hissan-sub-double', // 2桁のひき算の筆算
  'hissan-add-triple', // 3桁のたし算の筆算
  'hissan-sub-triple', // 3桁のひき算の筆算
  'hissan-mult-basic', // 2桁×1桁のかけ算の筆算
  'hissan-mult-advanced', // 3桁×2桁のかけ算の筆算
  'hissan-div-basic', // わり算の筆算
] as const;

/**
 * パターンが文章問題かどうかを判定
 */
export function isWordProblemPattern(pattern?: CalculationPattern): boolean {
  return pattern !== undefined && WORD_PROBLEM_PATTERNS.includes(pattern);
}

/**
 * パターンが筆算問題かどうかを判定
 */
export function isHissanPattern(pattern?: CalculationPattern): boolean {
  return pattern !== undefined && HISSAN_PATTERNS.includes(pattern);
}
