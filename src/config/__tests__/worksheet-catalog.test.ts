import { describe, expect, it } from 'vitest';
import { PATTERN_LABELS, PATTERNS_BY_GRADE } from '../../types';
import { getPrintTemplate } from '../print-templates';
import { generateProblems } from '../../lib/generators';
import {
  englishUnitPatternsForGrade,
  getStoriesForGrade,
  isEnglishUnitPattern,
} from '../../lib/generators/templates/en-word-story';
import { GRADES } from '../grades';
import {
  buildWorksheetCatalog,
  catalogHash,
  EMPTY_FILTERS,
  filtersFromHash,
  filterWorksheetCatalog,
} from '../worksheet-catalog';

const catalog = buildWorksheetCatalog();

describe('全学年の教材一覧', () => {
  it('複合問題を各単元から同じ教材として探せ、学校算数と受験算数を横断できる', () => {
    const base = {
      ...EMPTY_FILTERS,
      practice: 'unit',
      language: 'en',
    } as const;
    for (const topic of ['age', 'ratio'] as const) {
      const filters = { ...base, topic, grade: 6, course: 'entrance' } as const;
      expect(filtersFromHash(catalogHash(filters))).toEqual(filters);
      const rows = filterWorksheetCatalog(catalog, filters);
      expect(
        rows.filter((row) => row.key === 'entrance-advanced-ratio-age')
      ).toHaveLength(1);
    }
    const speed = filterWorksheetCatalog(catalog, {
      ...base,
      grade: 5,
      topic: 'speed',
    });
    expect(speed.map((m) => m.key)).toEqual(
      expect.arrayContaining(['entrance-traveler', 'word-unit-speed'])
    );
    expect(speed.some((m) => m.practice === 'mixed')).toBe(false);
    expect(
      filterWorksheetCatalog(catalog, {
        ...base,
        grade: 6,
        practice: 'mixed',
      }).flatMap((m) => m.versions.map((v) => v.pattern))
    ).toEqual(['word-en']);
  });

  it('各学年で実際に出題できる英語の単元だけを登録し、総合演習と全素材を共有する', () => {
    for (const grade of GRADES.filter((g) => g > 0)) {
      const patterns = englishUnitPatternsForGrade(grade);
      expect(PATTERNS_BY_GRADE[grade].filter(isEnglishUnitPattern)).toEqual(
        patterns
      );
      const templates = patterns.flatMap((pattern) =>
        getStoriesForGrade(grade, pattern)
      );
      expect(new Set(templates)).toEqual(new Set(getStoriesForGrade(grade)));
      expect(getStoriesForGrade(grade)).toHaveLength(new Set(templates).size);
      for (const pattern of patterns) {
        expect(
          generateProblems({
            grade,
            problemType: 'basic',
            operation: 'addition',
            calculationPattern: pattern,
            layoutColumns: 1,
            problemCount: 1,
          })[0].type
        ).toBe('word-en');
      }
    }
    expect(englishUnitPatternsForGrade(1)).not.toContain(
      'word-unit-percent-en'
    );
    for (const problemType of ['basic', 'word-en'] as const) {
      const problems = generateProblems({
        grade: 5,
        problemType,
        calculationPattern: 'word-unit-percent-en',
        operation: 'addition',
        layoutColumns: 2,
        problemCount: 8,
      });
      expect(
        problems.every(
          (p) => p.type === 'word-en' && p.problemText.includes('%')
        )
      ).toBe(true);
    }
  });
  it('教材登録の全件と各学年の選択肢に一致し、同一の教材・言語版を重複表示しない', () => {
    const versions = catalog.flatMap((material) => material.versions);
    expect(new Set(catalog.map((m) => m.key)).size).toBe(catalog.length);
    expect(versions.flatMap((v) => v.pattern ?? []).sort()).toEqual(
      Object.keys(PATTERN_LABELS).sort()
    );
    for (const [grade, registered] of Object.entries(PATTERNS_BY_GRADE)) {
      const available = versions.filter((v) =>
        v.grades.some((g) => String(g) === grade)
      );
      expect(available.map((v) => v.pattern).sort()).toEqual(
        [...registered].sort()
      );
    }
    expect(
      versions.filter((v) => v.grades.includes(0)).map((v) => v.title)
    ).toEqual([getPrintTemplate('number-tracing').displayName]);
  });

  it('学年・分野・言語・複数キーワードを組み合わせ、別言語の名称でも検索できる', () => {
    const filters = {
      ...EMPTY_FILTERS,
      grade: 6,
      category: 'entrance',
      language: 'en',
      query: 'ＷＡＴＥＲ　水ソウ',
    } as const;
    const result = filterWorksheetCatalog(catalog, filters);
    expect(result.map((m) => m.key)).toEqual(['entrance-water-depth']);
    expect(result[0].versions.map((v) => v.pattern)).toEqual([
      'entrance-water-depth-en',
    ]);
    expect(filterWorksheetCatalog(catalog, { ...filters, grade: 1 })).toEqual(
      []
    );
  });

  it('実際にその学年で使える言語版のみを提示する', () => {
    const material = catalog.find((m) => m.key === 'entrance-water-depth')!;
    const disjoint = {
      ...material,
      versions: material.versions.map((v) => ({
        ...v,
        grades: v.language === 'en' ? [5 as const] : [6 as const],
      })),
    };
    expect(
      filterWorksheetCatalog([disjoint], {
        ...EMPTY_FILTERS,
        grade: 6,
        language: 'en',
      })
    ).toEqual([]);
  });

  it('幼児と記号を含む検索条件をURLで復元し、不明な条件は無視する', () => {
    const filters = {
      ...EMPTY_FILTERS,
      grade: 0,
      category: 'basic',
      language: 'all',
      query: '0 & １?',
    } as const;
    expect(filtersFromHash(catalogHash(filters))).toEqual(filters);
    expect(
      filtersFromHash('#catalog?grade=9&category=unknown&lang=other')
    ).toEqual(EMPTY_FILTERS);
  });
});
