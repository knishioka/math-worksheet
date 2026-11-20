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
import { WORD_TOPICS, type WordTopic } from './word-topics';
import { getMaterialWordTopics } from './material-word-topics';

export const STORY_COURSES = {
  school: '学校算数',
  entrance: '中学受験',
  singapore: 'Singapore Math',
} as const;
type StoryCourse = keyof typeof STORY_COURSES;

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
  topics: readonly WordTopic[];
  practice: '' | 'unit' | 'mixed';
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
        topics: [],
        practice: '',
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
        const patterns = getEntryPatterns(entry);
        const topics = getMaterialWordTopics(patterns[0], entry.key, category);
        const material: CatalogMaterial = materials.get(entry.key) ?? {
          key: entry.key,
          category,
          topics,
          practice: patterns.includes('word-en')
            ? 'mixed'
            : topics.length
              ? 'unit'
              : '',
          versions: [],
        };
        for (const pattern of patterns) {
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
  practice: CatalogMaterial['practice'];
  course: StoryCourse | '';
  topic: WordTopic | '';
}

export const EMPTY_FILTERS: CatalogFilters = {
  query: '',
  grade: '',
  category: '',
  language: '',
  practice: '',
  course: '',
  topic: '',
};

export function filterWorksheetCatalog(
  materials: CatalogMaterial[],
  filters: CatalogFilters
): CatalogMaterial[] {
  return materials.flatMap((material) => {
    if (filters.category && material.category !== filters.category) return [];
    if (filters.practice && material.practice !== filters.practice) return [];
    const course =
      material.category === 'entrance' || material.category === 'singapore'
        ? material.category
        : 'school';
    if (filters.course && course !== filters.course) return [];
    if (filters.topic && !material.topics.includes(filters.topic)) return [];
    // 反対言語の教材名からも同じ単元を探せる。
    const text = [
      CATEGORY_CONFIG[material.category].label,
      ...(material.practice
        ? ['文章題 文章問題 word problems', STORY_COURSES[course]]
        : []),
      ...material.topics.map(
        (topic) => WORD_TOPICS[topic].ja + ' ' + WORD_TOPICS[topic].en
      ),
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

export function countWordTopics(
  materials: CatalogMaterial[]
): Map<WordTopic, number> {
  const counts = new Map<WordTopic, number>();
  for (const material of materials) {
    for (const topic of material.topics)
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return counts;
}

export function filtersFromHash(hash: string): CatalogFilters {
  const params = new URLSearchParams(hash.slice('#catalog?'.length));
  const grade = GRADES.find((g) => String(g) === params.get('grade')) ?? '';
  const category =
    CATEGORY_ORDER.find((c) => c === params.get('category')) ?? '';
  const language = params.get('lang');
  const practice = params.get('practice');
  const topic = params.get('topic');
  const course = params.get('course');
  return {
    grade,
    category: practice === 'unit' || practice === 'mixed' ? '' : category,
    practice: practice === 'unit' || practice === 'mixed' ? practice : '',
    topic:
      practice === 'unit' &&
      topic &&
      Object.prototype.hasOwnProperty.call(WORD_TOPICS, topic)
        ? (topic as WordTopic)
        : '',
    course:
      practice === 'unit' &&
      course &&
      Object.prototype.hasOwnProperty.call(STORY_COURSES, course)
        ? (course as StoryCourse)
        : '',
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
  if (filters.practice) params.set('practice', filters.practice);
  if (filters.course) params.set('course', filters.course);
  if (filters.topic) params.set('topic', filters.topic);
  return params.size ? '#catalog?' + params.toString() : '#catalog';
}
