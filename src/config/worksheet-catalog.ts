import {
  PATTERNS_BY_GRADE,
  PATTERN_LABELS,
  PATTERN_DESCRIPTIONS,
  type CalculationPattern,
  type Grade,
} from '../types';
import { GRADES, getGradeProblemType } from './grades';
import {
  buildPatternCatalog,
  getEntryPatterns,
  matchesCatalogQuery,
} from './pattern-catalog';
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  getPatternLanguage,
  type PatternCategory,
  type PatternLanguage,
} from './pattern-categories';
import { getPrintTemplate } from './print-templates';

export interface MaterialVersion {
  pattern?: CalculationPattern;
  language: PatternLanguage;
  title: string;
  description: string;
  grades: Grade[];
}

export interface CatalogMaterial {
  key: string;
  category: PatternCategory;
  versions: MaterialVersion[];
}

// 学年別の選択画面と同じカタログを横断し、配当学年は言語版ごとに保持する。
export function buildWorksheetCatalog(): CatalogMaterial[] {
  const materials = new Map<string, CatalogMaterial>();
  for (const grade of GRADES) {
    const type = getGradeProblemType(grade);
    if (type !== 'basic') {
      const template = getPrintTemplate(type);
      materials.set(type, {
        key: type,
        category: 'basic',
        versions: [
          {
            language: 'all',
            title: template.displayName,
            description: template.description,
            grades: [grade],
          },
        ],
      });
      continue;
    }
    for (const { category, entries } of buildPatternCatalog(
      PATTERNS_BY_GRADE[grade],
      grade
    )) {
      for (const entry of entries) {
        const material: CatalogMaterial = materials.get(entry.key) ?? {
          key: entry.key,
          category,
          versions: [],
        };
        for (const pattern of getEntryPatterns(entry)) {
          const existing = material.versions.find((v) => v.pattern === pattern);
          if (existing) existing.grades.push(grade);
          else
            material.versions.push({
              pattern,
              language: getPatternLanguage(pattern),
              title: PATTERN_LABELS[pattern],
              description: PATTERN_DESCRIPTIONS[pattern],
              grades: [grade],
            });
        }
        materials.set(entry.key, material);
      }
    }
  }
  return [...materials.values()];
}

export interface CatalogFilters {
  query: string;
  grade: Grade | '';
  category: PatternCategory | '';
  language: PatternLanguage | '';
}

export const EMPTY_FILTERS: CatalogFilters = {
  query: '',
  grade: '',
  category: '',
  language: '',
};

export function filterWorksheetCatalog(
  materials: CatalogMaterial[],
  filters: CatalogFilters
): CatalogMaterial[] {
  return materials.flatMap((material) => {
    if (filters.category && material.category !== filters.category) return [];
    // 反対言語の教材名からも同じ単元を探せる。
    const text = [
      CATEGORY_CONFIG[material.category].label,
      ...material.versions.map((v) => v.title + ' ' + v.description),
    ].join(' ');
    if (!matchesCatalogQuery(text, filters.query)) return [];
    const versions = material.versions.filter(
      (v) =>
        (filters.grade === '' || v.grades.includes(filters.grade)) &&
        (!filters.language || v.language === filters.language)
    );
    return versions.length ? [{ ...material, versions }] : [];
  });
}

export function isCatalogHash(hash: string): boolean {
  return hash === '#catalog' || hash.startsWith('#catalog?');
}

export function filtersFromHash(hash: string): CatalogFilters {
  const params = new URLSearchParams(hash.slice('#catalog?'.length));
  const grade = GRADES.find((g) => String(g) === params.get('grade')) ?? '';
  const category =
    CATEGORY_ORDER.find((c) => c === params.get('category')) ?? '';
  const language = params.get('lang');
  return {
    grade,
    category,
    query: params.get('q') ?? '',
    language:
      language === 'ja' || language === 'en' || language === 'all'
        ? language
        : '',
  };
}

export function catalogHash(filters: CatalogFilters): string {
  const params = new URLSearchParams();
  if (filters.query) params.set('q', filters.query);
  if (filters.grade !== '') params.set('grade', String(filters.grade));
  if (filters.category) params.set('category', filters.category);
  if (filters.language) params.set('lang', filters.language);
  return params.size ? '#catalog?' + params.toString() : '#catalog';
}
