import { describe, expect, it } from 'vitest';
import { PATTERNS_BY_GRADE } from '../../types';
import {
  buildPatternCatalog,
  getEntryLanguageSupport,
  getPatternBaseKey,
  getPatternTheme,
  resolveEntryPattern,
} from '../pattern-catalog';
import type { CalculationPattern } from '../../types';

describe('pattern catalog', () => {
  it('merges Japanese and English versions into one entry', () => {
    const catalog = buildPatternCatalog(
      ['money-change-jap', 'money-change-en', 'add-plus-one'],
      2
    );
    const life = catalog.find((group) => group.category === 'life');
    expect(life?.entries).toHaveLength(1);
    const entry = life!.entries[0];
    expect(entry.key).toBe('money-change');
    expect(getEntryLanguageSupport(entry)).toBe('both');
    expect(resolveEntryPattern(entry, 'ja')).toBe('money-change-jap');
    expect(resolveEntryPattern(entry, 'en')).toBe('money-change-en');
  });

  it('falls back to the available language and keeps neutral patterns as-is', () => {
    const catalog = buildPatternCatalog(['word-en', 'add-plus-one'], 1);
    const word = catalog.find((group) => group.category === 'word')!.entries[0];
    expect(getEntryLanguageSupport(word)).toBe('en');
    expect(resolveEntryPattern(word, 'ja')).toBe('word-en');
    const basic = catalog.find((group) => group.category === 'basic')!
      .entries[0];
    expect(getEntryLanguageSupport(basic)).toBe('all');
    expect(resolveEntryPattern(basic, 'en')).toBe('add-plus-one');
  });

  it('splits life patterns into themes and keeps the learning path order first', () => {
    const catalog = buildPatternCatalog(PATTERNS_BY_GRADE[4], 4);
    const life = catalog.find((group) => group.category === 'life')!;
    const themeKeys = life.themes.map((theme) => theme.key);
    expect(themeKeys).toContain('money');
    expect(themeKeys).toContain('time');
    expect(new Set(themeKeys).size).toBe(themeKeys.length);
    // 道すじに載っている単位のテーマが先頭、道すじ外のテーマは後ろ
    expect(themeKeys[0]).toBe('unit');
    expect(life.themes[0].entries.every((entry) => entry.onLearningPath)).toBe(
      true
    );
    // 道すじに無いテーマは定義順（お金 → 時刻・時間 → …）
    expect(themeKeys.slice(1, 4)).toEqual(['money', 'time', 'shopping']);
    // ペア統合で件数は半分になる（4年生は日英28ずつ）
    expect(life.entries).toHaveLength(28);
  });

  it('groups grade 1 basics by operation', () => {
    const catalog = buildPatternCatalog(PATTERNS_BY_GRADE[1], 1);
    const basic = catalog.find((group) => group.category === 'basic')!;
    expect(basic.themes.map((theme) => theme.label)).toEqual([
      'かずをかぞえる',
      'たし算',
      'ひき算',
      'たし算・ひき算ミックス',
      '虫食い算',
    ]);
    expect(basic.themes[0].entries.map((entry) => entry.key)).toEqual([
      'add-counting',
      'counting-add',
      'counting-sub',
    ]);
  });

  it('flattens themes when most of them would hold a single entry', () => {
    const catalog = buildPatternCatalog(PATTERNS_BY_GRADE[4], 4);
    const basic = catalog.find((group) => group.category === 'basic')!;
    expect(basic.entries).toHaveLength(6);
    expect(basic.themes).toHaveLength(1);
    expect(basic.themes[0].key).toBeNull();
  });

  it('does not add themes to categories without definitions', () => {
    const catalog = buildPatternCatalog(
      ['hissan-add-double', 'hissan-sub-double'],
      2
    );
    expect(catalog[0].themes).toHaveLength(1);
    expect(catalog[0].themes[0].key).toBeNull();
  });

  it('classifies patterns into themes', () => {
    const cases: [CalculationPattern, string | undefined][] = [
      ['mult-table-two', '九九'],
      ['mult-single-digit', 'かけ算'],
      ['add-single-missing', '虫食い算'],
      ['add-sub-mixed-basic', 'たし算・ひき算ミックス'],
      ['number-rounding-jap', '数の性質'],
      ['anzan-mul-9', 'かけ算のコツ'],
      ['anzan-complement-10', 'たし算・ひき算のコツ'],
      ['add-dec-simple', '小数'],
      ['frac-mult', '分数'],
      ['speed-time-distance', '割合・速さ・総合'],
    ];
    for (const [pattern, label] of cases) {
      const category = buildPatternCatalog([pattern], 6)[0].category;
      expect(getPatternTheme(pattern, category)?.label).toBe(label);
    }
    expect(getPatternTheme('hissan-add-double', 'hissan')).toBeUndefined();
  });

  it('strips language suffixes for the base key', () => {
    expect(getPatternBaseKey('money-change-jap')).toBe('money-change');
    expect(getPatternBaseKey('money-change-en')).toBe('money-change');
    expect(getPatternBaseKey('word-en')).toBe('word');
    expect(getPatternBaseKey('add-plus-one')).toBe('add-plus-one');
  });
});
