import type { CalculationPattern } from '../types/calculation-patterns';

/**
 * 問題パターン定義
 * 問題タイプを判定するためのパターン定義を集約
 */

/**
 * 文章問題を生成する計算パターン
 */
export const WORD_PROBLEM_PATTERNS: readonly CalculationPattern[] = [
  // 高学年向け
  'percent-basic', // 百分率
  'area-volume', // 面積・体積
  'ratio-proportion', // 比と比例
  'speed-time-distance', // 速さ・時間・距離
  'complex-calc', // 複雑な計算

  // 時刻・時間（日本語）
  'time-reading-jap', // 時刻の読み方
  'time-elapsed-jap', // 経過時間
  'time-calc-jap', // 時間の計算

  // 時刻・時間（英語）
  'time-reading-en', // Reading Time
  'time-elapsed-en', // Elapsed Time
  'time-calc-en', // Time Calculation

  // お金（日本語）
  'money-change-jap', // おつりの計算
  'money-total-jap', // お金の合計
  'money-payment-jap', // 支払い方法

  // お金（英語）
  'money-change-en', // Change Calculation (RM)
  'money-total-en', // Money Total (RM)
  'money-payment-en', // Payment Methods (RM)

  // 単位変換（日本語）
  'unit-length-jap', // 長さの単位
  'unit-weight-jap', // 重さの単位
  'unit-capacity-jap', // かさの単位

  // 単位変換（英語）
  'unit-length-en', // Length Units
  'unit-weight-en', // Weight Units
  'unit-capacity-en', // Capacity Units

  // 買い物（日本語）
  'shopping-discount-jap', // 割引計算
  'shopping-budget-jap', // 予算内の買い物
  'shopping-comparison-jap', // 値段の比較

  // 買い物（英語）
  'shopping-discount-en', // Discount Calculation
  'shopping-budget-en', // Shopping within Budget
  'shopping-comparison-en', // Price Comparison

  // 温度（日本語・英語）
  'temperature-diff-jap', // 温度差の計算
  'temperature-diff-en', // Temperature Difference

  // 距離（日本語）
  'distance-walk-jap', // 歩く距離の計算
  'distance-comparison-jap', // 距離の比較

  // 距離（英語）
  'distance-walk-en', // Walking Distance
  'distance-comparison-en', // Distance Comparison

  // 料理（日本語）
  'cooking-ingredients-jap', // 材料の量
  'cooking-time-jap', // 調理時間
  'cooking-serving-jap', // 人数分の計算

  // 料理（英語）
  'cooking-ingredients-en', // Ingredient Quantities
  'cooking-time-en', // Cooking Time
  'cooking-serving-en', // Serving Size

  // カレンダー（日本語）
  'calendar-days-jap', // 日数の計算
  'calendar-week-jap', // 週数の計算
  'calendar-age-jap', // 年齢の計算

  // カレンダー（英語）
  'calendar-days-en', // Days Calculation
  'calendar-week-en', // Weeks Calculation
  'calendar-age-en', // Age Calculation

  // 交通機関（日本語）
  'transport-fare-jap', // 運賃の計算
  'transport-change-jap', // 交通機関のおつり
  'transport-discount-jap', // 回数券・定期券

  // 交通機関（英語）
  'transport-fare-en', // Transportation Fare
  'transport-change-en', // Transport Change
  'transport-discount-en', // Ticket/Pass Discounts

  // お小遣い管理（日本語）
  'allowance-saving-jap', // 貯金の計算
  'allowance-goal-jap', // 目標達成までの期間

  // お小遣い管理（英語）
  'allowance-saving-en', // Saving Calculation (RM)
  'allowance-goal-en', // Savings Goal (RM)
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
