import { describe, expect, it } from 'vitest';
import { PATTERN_LABELS, PATTERNS_BY_GRADE } from '../../types';
import { getPrintTemplate } from '../print-templates';
import {
  buildWorksheetCatalog,
  catalogHash,
  EMPTY_FILTERS,
  filtersFromHash,
  filterWorksheetCatalog,
} from '../worksheet-catalog';

const catalog = buildWorksheetCatalog();

describe('全学年の教材一覧', () => {
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
