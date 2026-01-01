/**
 * 計算パターンのカテゴリ分類
 * 260以上のパターンを5つの主要カテゴリに整理
 */

import type { CalculationPattern } from '../types/calculation-patterns';
import type { Grade } from '../types';

/**
 * 難易度レベル（3段階）
 * 1: やさしい（基本操作）
 * 2: ふつう（繰り上がり/下がりあり）
 * 3: チャレンジ（混合・虫食い・応用）
 */
export type DifficultyLevel = 1 | 2 | 3;

/**
 * パターンカテゴリの定義
 */
export type PatternCategory =
  | 'basic' // 基本計算
  | 'hissan' // 筆算
  | 'fraction' // 分数・小数
  | 'life' // 生活の中の算数
  | 'word'; // 文章問題

/**
 * 言語タイプ
 */
export type PatternLanguage = 'ja' | 'en' | 'all';

/**
 * カテゴリの表示名とアイコン
 */
export const CATEGORY_CONFIG: Record<
  PatternCategory,
  {
    label: string;
    icon: string;
    description: string;
  }
> = {
  basic: {
    label: '基本計算',
    icon: '🔢',
    description: '四則演算の基本問題',
  },
  hissan: {
    label: '筆算',
    icon: '✏️',
    description: '位取りを使った計算',
  },
  fraction: {
    label: '分数・小数',
    icon: '📊',
    description: '分数と小数の計算',
  },
  life: {
    label: '生活の中の算数',
    icon: '🏠',
    description: 'お金・時間・単位などの実用計算',
  },
  word: {
    label: '文章問題',
    icon: '📝',
    description: '文章を読んで解く問題',
  },
};

/**
 * カテゴリの表示順序
 */
export const CATEGORY_ORDER: PatternCategory[] = [
  'basic',
  'hissan',
  'fraction',
  'life',
  'word',
];

/**
 * 言語依存のあるカテゴリ
 * これらのカテゴリは言語フィルターが適用される
 */
export const LANGUAGE_DEPENDENT_CATEGORIES: PatternCategory[] = ['life', 'word'];

/**
 * パターンプレフィックスからカテゴリへのマッピング
 */
const PATTERN_PREFIX_MAPPING: Record<string, PatternCategory> = {
  // 基本計算 (basic)
  add: 'basic',
  sub: 'basic',
  mult: 'basic',
  div: 'basic',

  // 筆算 (hissan)
  hissan: 'hissan',

  // 分数・小数 (fraction)
  frac: 'fraction',
  dec: 'fraction',
  mixed: 'fraction',
  percent: 'fraction',
  ratio: 'fraction',
  area: 'fraction',
  speed: 'fraction',
  complex: 'fraction',

  // 生活の中の算数 (life)
  money: 'life',
  time: 'life',
  unit: 'life',
  shopping: 'life',
  temperature: 'life',
  distance: 'life',
  cooking: 'life',
  calendar: 'life',
  energy: 'life',
  transport: 'life',
  allowance: 'life',

  // 文章問題 (word)
  word: 'word',
};

/**
 * 言語サフィックスのマッピング
 */
const LANGUAGE_SUFFIX_MAP: Record<string, PatternLanguage> = {
  '-jap': 'ja',
  '-en': 'en',
};

/**
 * パターンの基本難易度（学年非依存）
 * 同じカテゴリ内での相対的な難しさを表す
 */
const BASE_DIFFICULTY: Partial<Record<CalculationPattern, DifficultyLevel>> = {
  // === 1年生 basic ===
  'add-single-digit': 1,
  'add-to-10': 1,
  'add-10-plus': 1,
  'sub-single-digit': 1,
  'sub-from-10': 1,
  'add-single-digit-carry': 2,
  'sub-single-digit-borrow': 2,
  'add-sub-mixed-basic': 3,
  'add-single-missing': 3,
  'sub-single-missing': 3,

  // === 2年生 basic ===
  'add-double-digit-no-carry': 1,
  'sub-double-digit-no-borrow': 1,
  'add-hundreds-simple': 1,
  'add-double-digit-carry': 2,
  'sub-double-digit-borrow': 2,
  'mult-single-digit': 2,
  'add-sub-double-mixed': 3,
  'add-double-missing': 3,
  'sub-double-missing': 3,
  'mult-single-missing': 3,

  // === 3年生 basic ===
  'add-triple-digit': 1,
  'sub-triple-digit': 1,
  'mult-double-digit': 2,
  'div-basic': 2,

  // === 4年生 basic ===
  'add-large-numbers': 1,
  'sub-large-numbers': 1,
  'mult-triple-digit': 2,
  'div-with-remainder': 2,

  // === 筆算 (hissan) ===
  'hissan-add-double': 1,
  'hissan-sub-double': 1,
  'hissan-add-triple': 2,
  'hissan-sub-triple': 2,
  'hissan-mult-basic': 2,
  'hissan-mult-advanced': 3,
  'hissan-div-basic': 3,

  // === 分数・小数 (fraction) ===
  'add-dec-simple': 1,
  'sub-dec-simple': 1,
  'frac-same-denom': 1,
  'mult-dec-int': 2,
  'div-dec-int': 2,
  'frac-mixed-number': 2,
  'mult-dec-dec': 2,
  'div-dec-dec': 2,
  'frac-different-denom': 2,
  'frac-simplify': 2,
  'frac-mult': 2,
  'frac-div': 3,
  'percent-basic': 2,
  'area-volume': 3,
  'ratio-proportion': 3,
  'speed-time-distance': 3,
  'complex-calc': 3,

  // === 生活の中の算数 (life) - 日本語 ===
  'money-change-jap': 1,
  'money-total-jap': 1,
  'money-payment-jap': 2,
  'time-reading-jap': 1,
  'time-elapsed-jap': 2,
  'time-calc-jap': 2,
  'unit-length-jap': 1,
  'unit-weight-jap': 1,
  'unit-capacity-jap': 2,
  'shopping-discount-jap': 2,
  'shopping-budget-jap': 2,
  'shopping-comparison-jap': 3,
  'temperature-diff-jap': 1,
  'temperature-conversion-jap': 3,
  'distance-walk-jap': 1,
  'distance-comparison-jap': 2,
  'distance-map-scale-jap': 3,
  'cooking-ingredients-jap': 2,
  'cooking-time-jap': 2,
  'cooking-serving-jap': 1,
  'calendar-days-jap': 1,
  'calendar-week-jap': 2,
  'calendar-age-jap': 1,
  'energy-usage-jap': 2,
  'energy-saving-jap': 2,
  'transport-fare-jap': 1,
  'transport-change-jap': 1,
  'transport-discount-jap': 2,
  'allowance-saving-jap': 1,
  'allowance-goal-jap': 2,

  // === 生活の中の算数 (life) - 英語 ===
  'money-change-en': 1,
  'money-total-en': 1,
  'money-payment-en': 2,
  'time-reading-en': 1,
  'time-elapsed-en': 2,
  'time-calc-en': 2,
  'unit-length-en': 1,
  'unit-weight-en': 1,
  'unit-capacity-en': 2,
  'shopping-discount-en': 2,
  'shopping-budget-en': 2,
  'shopping-comparison-en': 3,
  'temperature-diff-en': 1,
  'temperature-conversion-en': 3,
  'distance-walk-en': 1,
  'distance-comparison-en': 2,
  'distance-map-scale-en': 3,
  'cooking-ingredients-en': 2,
  'cooking-time-en': 2,
  'cooking-serving-en': 1,
  'calendar-days-en': 1,
  'calendar-week-en': 2,
  'calendar-age-en': 1,
  'energy-usage-en': 2,
  'energy-saving-en': 2,
  'transport-fare-en': 1,
  'transport-change-en': 1,
  'transport-discount-en': 2,
  'allowance-saving-en': 1,
  'allowance-goal-en': 2,

  // === 文章問題 (word) ===
  'word-en': 2,
};

/**
 * パターンからカテゴリを判定
 */
export function getPatternCategory(pattern: CalculationPattern): PatternCategory {
  // 完全一致を最初にチェック
  if (pattern === 'word-en') {
    return 'word';
  }

  // プレフィックスで判定（長いマッチを優先）
  const prefixes = Object.keys(PATTERN_PREFIX_MAPPING).sort(
    (a, b) => b.length - a.length
  );

  for (const prefix of prefixes) {
    if (pattern.startsWith(prefix)) {
      return PATTERN_PREFIX_MAPPING[prefix];
    }
  }

  // デフォルトは基本計算
  return 'basic';
}

/**
 * パターンから言語を判定
 * 言語サフィックスがない場合は 'all' を返す
 */
export function getPatternLanguage(pattern: CalculationPattern): PatternLanguage {
  for (const [suffix, lang] of Object.entries(LANGUAGE_SUFFIX_MAP)) {
    if (pattern.endsWith(suffix)) {
      return lang;
    }
  }

  // word-en は特別扱い
  if (pattern === 'word-en') {
    return 'en';
  }

  return 'all';
}

/**
 * パターンが言語依存かどうかを判定
 */
export function isLanguageDependent(pattern: CalculationPattern): boolean {
  return getPatternLanguage(pattern) !== 'all';
}

/**
 * 言語フィルターを適用してパターンをフィルタリング
 */
export function filterPatternsByLanguage(
  patterns: CalculationPattern[],
  language: PatternLanguage
): CalculationPattern[] {
  if (language === 'all') {
    return patterns;
  }

  return patterns.filter((pattern) => {
    const patternLang = getPatternLanguage(pattern);
    // 言語非依存のパターンは常に表示
    // 言語依存のパターンは選択した言語のみ表示
    return patternLang === 'all' || patternLang === language;
  });
}

/**
 * パターンをカテゴリごとにグループ化
 */
export function groupPatternsByCategory(
  patterns: CalculationPattern[]
): Record<PatternCategory, CalculationPattern[]> {
  const grouped: Record<PatternCategory, CalculationPattern[]> = {
    basic: [],
    hissan: [],
    fraction: [],
    life: [],
    word: [],
  };

  for (const pattern of patterns) {
    const category = getPatternCategory(pattern);
    grouped[category].push(pattern);
  }

  return grouped;
}

/**
 * カテゴリごとにグループ化し、空でないカテゴリのみ返す
 */
export function getAvailableCategories(
  patterns: CalculationPattern[]
): { category: PatternCategory; patterns: CalculationPattern[] }[] {
  const grouped = groupPatternsByCategory(patterns);

  return CATEGORY_ORDER.filter((category) => grouped[category].length > 0).map(
    (category) => ({
      category,
      patterns: grouped[category],
    })
  );
}

/**
 * カテゴリ内のパターン数を取得
 */
export function getCategoryCounts(
  patterns: CalculationPattern[]
): Record<PatternCategory, number> {
  const grouped = groupPatternsByCategory(patterns);

  return {
    basic: grouped.basic.length,
    hissan: grouped.hissan.length,
    fraction: grouped.fraction.length,
    life: grouped.life.length,
    word: grouped.word.length,
  };
}

/**
 * 選択中のパターンのカテゴリを取得（自動展開用）
 */
export function getCategoryForPattern(
  pattern: CalculationPattern | undefined
): PatternCategory | undefined {
  if (!pattern) {
    return undefined;
  }
  return getPatternCategory(pattern);
}

/**
 * パターンの難易度を取得
 * 定義されていない場合はデフォルト値2を返す
 */
export function getPatternDifficulty(pattern: CalculationPattern): DifficultyLevel {
  return BASE_DIFFICULTY[pattern] ?? 2;
}

/**
 * 学年を考慮した難易度を取得
 * 同じパターンでも学年によって相対的な難しさが変わる場合がある
 * 現在は基本難易度をそのまま返す（将来の拡張用）
 */
export function getDifficultyForGrade(
  pattern: CalculationPattern,
  _grade: Grade
): DifficultyLevel {
  // 将来的に学年別の調整が必要な場合はここで実装
  return getPatternDifficulty(pattern);
}

/**
 * パターンを難易度順にソート
 */
export function sortPatternsByDifficulty(
  patterns: CalculationPattern[]
): CalculationPattern[] {
  return [...patterns].sort((a, b) => {
    const diffA = getPatternDifficulty(a);
    const diffB = getPatternDifficulty(b);
    return diffA - diffB;
  });
}

/**
 * パターンをカテゴリごとにグループ化し、難易度順にソート
 */
export function groupPatternsByCategorySorted(
  patterns: CalculationPattern[]
): Record<PatternCategory, CalculationPattern[]> {
  const grouped = groupPatternsByCategory(patterns);

  // 各カテゴリ内を難易度順にソート
  return {
    basic: sortPatternsByDifficulty(grouped.basic),
    hissan: sortPatternsByDifficulty(grouped.hissan),
    fraction: sortPatternsByDifficulty(grouped.fraction),
    life: sortPatternsByDifficulty(grouped.life),
    word: sortPatternsByDifficulty(grouped.word),
  };
}

/**
 * カテゴリごとにグループ化し、難易度順にソートして、空でないカテゴリのみ返す
 */
export function getAvailableCategoriesSorted(
  patterns: CalculationPattern[]
): { category: PatternCategory; patterns: CalculationPattern[] }[] {
  const grouped = groupPatternsByCategorySorted(patterns);

  return CATEGORY_ORDER.filter((category) => grouped[category].length > 0).map(
    (category) => ({
      category,
      patterns: grouped[category],
    })
  );
}

/**
 * 難易度を星の文字列として表示
 */
export function getDifficultyStars(difficulty: DifficultyLevel): string {
  return '⭐'.repeat(difficulty);
}

/**
 * 難易度のラベルを取得
 */
export function getDifficultyLabel(difficulty: DifficultyLevel): string {
  switch (difficulty) {
    case 1:
      return 'やさしい';
    case 2:
      return 'ふつう';
    case 3:
      return 'チャレンジ';
  }
}
