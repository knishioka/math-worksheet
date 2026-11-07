/**
 * 問題選択UI向けの教材カタログ
 *
 * - カテゴリ（基本計算・生活の中の算数 など）の中を「テーマ」でさらに分ける
 * - 同じ内容の日本語版（-jap）と英語版（-en）は1つのエントリーにまとめる
 * - 学習の道すじに載っている教材かどうかを示す
 *
 * 表示側はこのカタログを使い、言語の切り替えだけでペアの教材を行き来できる。
 */

import type { CalculationPattern, Grade } from '../types';
import { PATTERN_DESCRIPTIONS, PATTERN_LABELS } from '../types';
import { getLearningStages } from './learning-paths';
import {
  type DifficultyLevel,
  type PatternCategory,
  type PatternLanguage,
  getAvailableCategories,
  getPatternDifficulty,
  getPatternLanguage,
} from './pattern-categories';

/** 出題に使う言語（カタログは「すべて」を持たない） */
export type CatalogLanguage = Exclude<PatternLanguage, 'all'>;

export interface CatalogEntry {
  /** 言語サフィックスを除いた共通キー */
  key: string;
  /** 言語ごとの教材。言語非依存の教材は `all` に入る */
  patterns: Partial<Record<PatternLanguage, CalculationPattern>>;
  difficulty: DifficultyLevel;
  /** 学習の道すじ（学校算数・中学受験）に含まれるか */
  onLearningPath: boolean;
}

export interface CatalogTheme {
  /** テーマが無いカテゴリでは null（見出しを出さない） */
  key: string | null;
  label: string;
  entries: CatalogEntry[];
}

export interface CatalogCategory {
  category: PatternCategory;
  /** テーマ順に並べたエントリー（平坦） */
  entries: CatalogEntry[];
  themes: CatalogTheme[];
}

interface ThemeDefinition {
  key: string;
  label: string;
  matches: (pattern: CalculationPattern) => boolean;
}

const startsWithAny =
  (...prefixes: string[]) =>
  (pattern: CalculationPattern): boolean =>
    prefixes.some((prefix) => pattern.startsWith(prefix));

/**
 * カテゴリごとのテーマ定義。先に一致したものを採用する。
 * 定義がないカテゴリはテーマ分けしない。
 */
const THEME_DEFINITIONS: Partial<Record<PatternCategory, ThemeDefinition[]>> = {
  basic: [
    {
      key: 'counting',
      label: 'かずをかぞえる',
      matches: startsWithAny('add-counting', 'counting-'),
    },
    {
      key: 'missing',
      label: '虫食い算',
      matches: (pattern) => pattern.endsWith('-missing'),
    },
    {
      key: 'mixed',
      label: 'たし算・ひき算ミックス',
      matches: startsWithAny('add-sub-'),
    },
    { key: 'add', label: 'たし算', matches: startsWithAny('add-') },
    { key: 'sub', label: 'ひき算', matches: startsWithAny('sub-') },
    { key: 'table', label: '九九', matches: startsWithAny('mult-table-') },
    { key: 'mult', label: 'かけ算', matches: startsWithAny('mult-') },
    { key: 'div', label: 'わり算', matches: startsWithAny('div-') },
    { key: 'number', label: '数の性質', matches: startsWithAny('number-') },
  ],
  fraction: [
    {
      key: 'decimal',
      label: '小数',
      matches: (pattern) => pattern.includes('-dec-'),
    },
    { key: 'fraction', label: '分数', matches: startsWithAny('frac-') },
    {
      key: 'ratio',
      label: '割合・速さ・総合',
      matches: startsWithAny('percent-', 'ratio-', 'speed-', 'complex-'),
    },
  ],
  life: [
    { key: 'money', label: 'お金', matches: startsWithAny('money-') },
    { key: 'time', label: '時刻・時間', matches: startsWithAny('time-') },
    { key: 'unit', label: '単位', matches: startsWithAny('unit-') },
    { key: 'shopping', label: '買い物', matches: startsWithAny('shopping-') },
    {
      key: 'transport',
      label: '交通',
      matches: startsWithAny('transport-'),
    },
    { key: 'calendar', label: '暦・日数', matches: startsWithAny('calendar-') },
    { key: 'cooking', label: '料理', matches: startsWithAny('cooking-') },
    { key: 'distance', label: '距離', matches: startsWithAny('distance-') },
    {
      key: 'temperature',
      label: '温度',
      matches: startsWithAny('temperature-'),
    },
    { key: 'energy', label: '電気・節約', matches: startsWithAny('energy-') },
    {
      key: 'allowance',
      label: 'おこづかい・貯金',
      matches: startsWithAny('allowance-'),
    },
  ],
  anzan: [
    {
      key: 'add-sub',
      label: 'たし算・ひき算のコツ',
      matches: startsWithAny(
        'anzan-complement-',
        'anzan-pair-',
        'anzan-round-add',
        'anzan-round-sub',
        'anzan-change-'
      ),
    },
    {
      key: 'mult',
      label: 'かけ算のコツ',
      matches: startsWithAny(
        'anzan-mul-',
        'anzan-round-mul',
        'anzan-distributive',
        'anzan-square-'
      ),
    },
    {
      key: 'mixed',
      label: '組み合わせて使う',
      matches: startsWithAny('anzan-reorder', 'anzan-mixed'),
    },
  ],
};

const LANGUAGE_SUFFIXES: Record<CatalogLanguage, string> = {
  ja: '-jap',
  en: '-en',
};

/** 言語サフィックスを除いた共通キーを返す（例: money-change-en → money-change） */
export function getPatternBaseKey(pattern: CalculationPattern): string {
  const language = getPatternLanguage(pattern);
  if (language === 'all') return pattern;
  const suffix = LANGUAGE_SUFFIXES[language];
  return pattern.endsWith(suffix) ? pattern.slice(0, -suffix.length) : pattern;
}

/** カテゴリ内でのテーマを返す。テーマ分けしないカテゴリでは undefined */
export function getPatternTheme(
  pattern: CalculationPattern,
  category: PatternCategory
): { key: string; label: string } | undefined {
  const definitions = THEME_DEFINITIONS[category];
  if (!definitions) return undefined;
  const matched = definitions.find((definition) => definition.matches(pattern));
  return matched
    ? { key: matched.key, label: matched.label }
    : { key: 'other', label: 'その他' };
}

/** 希望する言語に最も近い教材を返す。無ければある方の言語を返す */
export function resolveEntryPattern(
  entry: CatalogEntry,
  preferred: CatalogLanguage
): CalculationPattern {
  const pattern =
    entry.patterns.all ??
    entry.patterns[preferred] ??
    entry.patterns.ja ??
    entry.patterns.en;
  if (!pattern) {
    throw new Error(`Catalog entry "${entry.key}" has no pattern`);
  }
  return pattern;
}

/** エントリーに含まれる教材すべて */
export function getEntryPatterns(entry: CatalogEntry): CalculationPattern[] {
  return Object.values(entry.patterns);
}

/** エントリーが指定の教材を含むか */
export function entryHasPattern(
  entry: CatalogEntry,
  pattern: CalculationPattern | undefined
): boolean {
  return pattern !== undefined && getEntryPatterns(entry).includes(pattern);
}

/**
 * エントリーの言語対応。
 * - 'both': 日本語版と英語版の両方がある
 * - 'ja' / 'en': 片方の言語だけ
 * - 'all': 言語に依存しない
 */
export function getEntryLanguageSupport(
  entry: CatalogEntry
): 'both' | 'ja' | 'en' | 'all' {
  if (entry.patterns.all) return 'all';
  if (entry.patterns.ja && entry.patterns.en) return 'both';
  return entry.patterns.ja ? 'ja' : 'en';
}

/** 検索対象のテキスト（全言語のラベルと説明） */
export function getEntrySearchText(entry: CatalogEntry): string {
  return getEntryPatterns(entry)
    .map(
      (pattern) => `${PATTERN_LABELS[pattern]} ${PATTERN_DESCRIPTIONS[pattern]}`
    )
    .join(' ');
}

/**
 * 学年の教材リストからカタログを組み立てる。
 * 並び順は「学習の道すじ順 → 難易度順」。
 */
export function buildPatternCatalog(
  patterns: CalculationPattern[],
  grade: Grade
): CatalogCategory[] {
  const learningOrder = new Map(
    [...getLearningStages(grade), ...getLearningStages(grade, 'entrance')]
      .flatMap((stage) => stage.patterns)
      .map((pattern, index) => [pattern, index])
  );
  const orderOf = (pattern: CalculationPattern): number =>
    learningOrder.get(pattern) ?? Number.MAX_SAFE_INTEGER;

  return getAvailableCategories(patterns).map(({ category, patterns }) => {
    const entriesByKey = new Map<string, CatalogEntry>();
    const themeOfEntry = new Map<string, CatalogTheme['key']>();
    const themeLabels = new Map<CatalogTheme['key'], string>();

    for (const pattern of patterns) {
      const key = getPatternBaseKey(pattern);
      const language = getPatternLanguage(pattern);
      const entry = entriesByKey.get(key) ?? {
        key,
        patterns: {},
        difficulty: getPatternDifficulty(pattern),
        onLearningPath: false,
      };
      entry.patterns[language] = pattern;
      entry.difficulty = Math.min(
        entry.difficulty,
        getPatternDifficulty(pattern)
      ) as DifficultyLevel;
      entry.onLearningPath ||= learningOrder.has(pattern);
      entriesByKey.set(key, entry);

      const theme = getPatternTheme(pattern, category);
      const themeKey = theme?.key ?? null;
      if (!themeOfEntry.has(key)) themeOfEntry.set(key, themeKey);
      if (!themeLabels.has(themeKey))
        themeLabels.set(themeKey, theme?.label ?? '');
    }

    const entryOrder = (entry: CatalogEntry): number =>
      Math.min(...getEntryPatterns(entry).map(orderOf));
    const sortedEntries = [...entriesByKey.values()].sort(
      (a, b) =>
        entryOrder(a) - entryOrder(b) ||
        a.difficulty - b.difficulty ||
        a.key.localeCompare(b.key)
    );

    // テーマの並びは「道すじ上で最初に出てくる教材」が早い順。
    // 道すじに教材がないテーマは、定義順（身近なものから）で後ろに続ける。
    const definitionIndex = (key: CatalogTheme['key']): number =>
      THEME_DEFINITIONS[category]?.findIndex((item) => item.key === key) ?? 0;
    const themeOrder = new Map<CatalogTheme['key'], number>();
    for (const [index, entry] of sortedEntries.entries()) {
      const themeKey = themeOfEntry.get(entry.key) ?? null;
      if (themeOrder.has(themeKey)) continue;
      themeOrder.set(
        themeKey,
        entry.onLearningPath
          ? index
          : sortedEntries.length + definitionIndex(themeKey)
      );
    }
    const themes: CatalogTheme[] = [...themeOrder.keys()]
      .sort((a, b) => (themeOrder.get(a) ?? 0) - (themeOrder.get(b) ?? 0))
      .map((key) => ({
        key,
        label: themeLabels.get(key) ?? '',
        entries: sortedEntries.filter(
          (entry) => (themeOfEntry.get(entry.key) ?? null) === key
        ),
      }));

    // テーマ1つあたり平均2件未満なら、見出しが邪魔になるのでまとめる
    const flatThemes: CatalogTheme[] =
      sortedEntries.length < themes.length * 2
        ? [{ key: null, label: '', entries: sortedEntries }]
        : themes;

    return {
      category,
      entries: flatThemes.flatMap((theme) => theme.entries),
      themes: flatThemes,
    };
  });
}
