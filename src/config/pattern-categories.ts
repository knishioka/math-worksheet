/**
 * 計算パターンのカテゴリ分類
 * 260以上のパターンを5つの主要カテゴリに整理
 */

import type { CalculationPattern } from '../types/calculation-patterns';

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
