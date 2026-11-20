import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import type { Grade, WorksheetSettings } from '../types';
import { GRADES, GRADE_LABELS, getGradeProblemType } from '../config/grades';
import {
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  type PatternCategory,
  type PatternLanguage,
} from '../config/pattern-categories';
import {
  buildWorksheetCatalog,
  catalogHash,
  EMPTY_FILTERS,
  filterWorksheetCatalog,
  countWordTopics,
  filtersFromHash,
  type CatalogFilters,
  type CatalogMaterial,
  type MaterialVersion,
  STORY_COURSES,
} from '../config/worksheet-catalog';
import { WORD_TOPICS, type WordTopic } from '../config/word-topics';
import { WordTopicCoverage } from './WordTopicCoverage';
import {
  getOperationFromPattern,
  settingsToUrlParams,
} from '../lib/utils/url-state';
import { generateProblems } from '../lib/generators';
import { ProblemItem } from './Preview/ProblemList';
import { NumberTracingRow } from './Math/NumberTracingRow';
import { getEffectiveProblemType } from '../lib/utils/problem-type-detector';
import { getEffectiveCounts } from '../config/print-templates';
import { Container } from './Layout/Container';

const LANGUAGE_OPTIONS: Record<PatternLanguage, string> = {
  ja: '日本語版',
  en: '英語版',
  all: '言語共通',
};

function worksheetHref(
  version: MaterialVersion,
  grade: Grade,
  settings: WorksheetSettings
): string {
  const pattern = version.pattern;
  const problemType = getGradeProblemType(grade);
  if (
    settings.grade === grade &&
    settings.problemType === problemType &&
    settings.calculationPattern === pattern
  ) {
    return '#worksheet-preview';
  }
  const cols = problemType === 'number-tracing' ? 2 : settings.layoutColumns;
  const counts = getEffectiveCounts(
    getEffectiveProblemType(problemType, pattern),
    pattern,
    grade,
    settings.showEquationLine
  );
  const query = settingsToUrlParams({
    ...settings,
    grade,
    calculationPattern: pattern,
    problemType,
    layoutColumns: cols,
    problemCount: counts.recommendedCounts[cols],
  });
  return '?' + query + '#worksheet-preview';
}

function SampleProblem({
  version,
  grade,
}: {
  version: MaterialVersion;
  grade: Grade;
}): ReactElement {
  const [problem] = useState(
    () =>
      generateProblems({
        grade,
        calculationPattern: version.pattern,
        problemType: getGradeProblemType(grade),
        operation: version.pattern
          ? getOperationFromPattern(version.pattern)
          : 'addition',
        layoutColumns: 1,
        problemCount: 1,
      })[0]
  );
  return (
    <div className="catalog-sample">
      {problem.type === 'number-tracing' ? (
        <NumberTracingRow
          digit={problem.digit}
          traceCount={problem.traceCount}
          practiceCount={problem.practiceCount}
        />
      ) : (
        <ProblemItem problem={problem} number={1} />
      )}
    </div>
  );
}

function MaterialRow({
  material,
  gradeFilter,
  settings,
  showTopics,
}: {
  material: CatalogMaterial;
  gradeFilter: CatalogFilters['grade'];
  settings: WorksheetSettings;
  showTopics: boolean;
}): ReactElement {
  const { versions } = material;
  const grades = GRADES.filter((grade) =>
    versions.some((v) => v.grades.includes(grade))
  );
  const [chosenGrade, setChosenGrade] = useState<Grade>(() => {
    const saved = window.history.state?.catalogReturn;
    return saved?.key === material.key && grades.includes(saved.grade)
      ? saved.grade
      : settings.grade;
  });
  const [showSample, setShowSample] = useState(false);
  const grade =
    gradeFilter !== ''
      ? gradeFilter
      : grades.includes(chosenGrade)
        ? chosenGrade
        : grades[0];
  const offered = versions.filter((v) => v.grades.includes(grade));
  const primary = offered.find((v) => v.language === 'ja') ?? offered[0];
  const english = offered.find((v) => v.language === 'en');
  return (
    <li className="catalog-row">
      <div className="min-w-0">
        <h3 className="font-semibold text-slate-900">{primary.title}</h3>
        {english && english !== primary && (
          <p lang="en" className="mt-0.5 text-xs text-slate-600">
            {english.title}
          </p>
        )}
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          {primary.description}
        </p>
        {showTopics && material.topics.length > 0 && (
          <p className="mt-1 text-xs text-teal-800">
            {material.topics.map((topic) => WORD_TOPICS[topic].ja).join(' ・ ')}
          </p>
        )}
        <details
          className="mt-1.5"
          onToggle={(event) => setShowSample(event.currentTarget.open)}
        >
          <summary className="w-fit cursor-pointer py-1 text-xs font-semibold text-teal-800">
            {showSample ? '例題を閉じる' : '例題を見る'}
          </summary>
          {showSample && (
            <SampleProblem
              key={grade + ':' + primary.language}
              grade={grade}
              version={primary}
            />
          )}
        </details>
      </div>
      <div className="catalog-row-actions">
        {gradeFilter === '' && grades.length > 1 ? (
          <select
            aria-label={primary.title + 'の作成学年'}
            value={grade}
            onChange={(e) => setChosenGrade(Number(e.target.value) as Grade)}
          >
            {grades.map((g) => (
              <option value={g} key={g}>
                {GRADE_LABELS[g]}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-xs text-slate-600">{GRADE_LABELS[grade]}</span>
        )}
        <div className="flex flex-wrap gap-2">
          {offered.map((v) => {
            const action =
              v.language === 'all'
                ? 'プリントを開く'
                : v.language === 'ja'
                  ? '日本語で開く'
                  : '英語で開く';
            return (
              <a
                key={v.language}
                id={'open-' + (v.pattern ?? material.key)}
                className="catalog-launch"
                href={worksheetHref(v, grade, settings)}
                onClick={(event) => {
                  // ブラウザの「戻る」で同じ教材・学年・位置から比較を続けられる。
                  window.history.replaceState(
                    {
                      ...window.history.state,
                      catalogReturn: {
                        key: material.key,
                        grade,
                        link: event.currentTarget.id,
                        y: window.scrollY,
                      },
                    },
                    ''
                  );
                }}
                aria-label={`${GRADE_LABELS[grade]}・${v.title}のプリントを開く（${LANGUAGE_OPTIONS[v.language]}）`}
              >
                {action}
                <span aria-hidden="true">→</span>
              </a>
            );
          })}
        </div>
      </div>
    </li>
  );
}

export function WorksheetCatalog({
  hash,
  onReplaceHash,
  settings,
}: {
  hash: string;
  onReplaceHash: (hash: string) => void;
  settings: WorksheetSettings;
}): ReactElement {
  const catalog = useMemo(buildWorksheetCatalog, []);
  const filters = useMemo(() => filtersFromHash(hash), [hash]);
  const results = useMemo(
    () => filterWorksheetCatalog(catalog, filters),
    [catalog, filters]
  );
  const topicCounts = useMemo(() => {
    if (filters.practice !== 'unit') return new Map<WordTopic, number>();
    return countWordTopics(
      filterWorksheetCatalog(catalog, { ...filters, topic: '' })
    );
  }, [catalog, filters]);
  const title = useRef<HTMLHeadingElement>(null);
  const search = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const previousTitle = document.title;
    document.title = '教材一覧 | まいにち算数';
    const saved = window.history.state?.catalogReturn;
    const target = saved && document.getElementById(saved.link);
    (target || title.current)?.focus({ preventScroll: true });
    window.scrollTo(0, target ? saved.y : 0);
    return (): void => {
      document.title = previousTitle;
    };
  }, []);
  function change(patch: Partial<CatalogFilters>): void {
    // ネイティブリンクの hashchange が届く前の操作でも、移動先の条件を引き継ぐ。
    onReplaceHash(
      catalogHash({ ...filtersFromHash(window.location.hash), ...patch })
    );
  }
  function reset(): void {
    onReplaceHash(catalogHash(EMPTY_FILTERS));
    search.current?.focus();
  }
  return (
    <main id="catalog" className="py-7 md:py-10">
      <Container>
        <h1
          tabIndex={-1}
          ref={title}
          className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl"
        >
          教材一覧
        </h1>
        <nav aria-label="教材の探し方" className="catalog-view-switch">
          <a
            aria-current={!filters.practice ? 'page' : undefined}
            href={catalogHash({
              ...filters,
              practice: '',
              course: '',
              topic: '',
            })}
          >
            全教材
          </a>
          <a
            aria-current={filters.practice ? 'page' : undefined}
            href={catalogHash({
              ...filters,
              category: '',
              practice: filters.practice || 'unit',
            })}
          >
            文章題から探す
          </a>
        </nav>
        <div className="catalog-layout">
          <section
            aria-labelledby="catalog-filters"
            className="catalog-filters"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="catalog-filters" className="font-bold text-slate-900">
                絞り込み
              </h2>
              <button
                type="button"
                className="catalog-reset"
                disabled={
                  !filters.query &&
                  filters.grade === '' &&
                  !filters.category &&
                  !filters.language &&
                  !filters.topic &&
                  !filters.course
                }
                onClick={() => {
                  onReplaceHash(
                    catalogHash({
                      ...EMPTY_FILTERS,
                      practice: filters.practice,
                    })
                  );
                  search.current?.focus();
                }}
              >
                条件をクリア
              </button>
            </div>
            {filters.practice && (
              <fieldset className="catalog-practice">
                <legend>練習のしかた</legend>
                {(
                  [
                    ['unit', '単元を選んで練習'],
                    ['mixed', '学年別の総合演習'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="catalog-practice"
                      value={value}
                      checked={filters.practice === value}
                      onChange={() =>
                        change({ practice: value, topic: '', course: '' })
                      }
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
            )}
            <label className="catalog-field">
              キーワード
              <input
                ref={search}
                type="search"
                value={filters.query}
                placeholder="例：分数、水そう、clock"
                onChange={(e) => change({ query: e.target.value })}
              />
            </label>
            <div className="catalog-selects">
              <div className="catalog-field">
                <label htmlFor="catalog-grade">学年</label>
                <select
                  id="catalog-grade"
                  value={filters.grade}
                  onChange={(e) =>
                    change({
                      grade:
                        e.target.value === ''
                          ? ''
                          : (Number(e.target.value) as Grade),
                    })
                  }
                >
                  <option value="">すべて</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {GRADE_LABELS[g]}
                    </option>
                  ))}
                </select>
              </div>
              {!filters.practice && (
                <div className="catalog-field">
                  <label htmlFor="catalog-category">分野</label>
                  <select
                    id="catalog-category"
                    value={filters.category}
                    onChange={(e) =>
                      change({
                        category: e.target.value as PatternCategory | '',
                      })
                    }
                  >
                    <option value="">すべて</option>
                    {CATEGORY_ORDER.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_CONFIG[c].label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {filters.practice === 'unit' && (
                <div className="catalog-field">
                  <label htmlFor="catalog-course">コース</label>
                  <select
                    id="catalog-course"
                    value={filters.course}
                    onChange={(e) =>
                      change({
                        course: e.target.value as CatalogFilters['course'],
                      })
                    }
                  >
                    <option value="">すべて</option>
                    {Object.entries(STORY_COURSES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="catalog-field">
                <label htmlFor="catalog-language">言語</label>
                <select
                  id="catalog-language"
                  value={filters.language}
                  onChange={(e) =>
                    change({ language: e.target.value as PatternLanguage | '' })
                  }
                >
                  <option value="">すべて</option>
                  {Object.entries(LANGUAGE_OPTIONS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {filters.practice === 'unit' && (
              <div className="catalog-field">
                <label htmlFor="catalog-topic">単元</label>
                <select
                  id="catalog-topic"
                  value={filters.topic}
                  onChange={(e) =>
                    change({ topic: e.target.value as CatalogFilters['topic'] })
                  }
                >
                  <option value="">すべての単元</option>
                  {(Object.keys(WORD_TOPICS) as WordTopic[])
                    .filter(
                      (topic) =>
                        topicCounts.has(topic) || topic === filters.topic
                    )
                    .map((topic) => (
                      <option key={topic} value={topic}>
                        {WORD_TOPICS[topic].ja}（{topicCounts.get(topic) ?? 0}
                        件）
                      </option>
                    ))}
                </select>
              </div>
            )}
          </section>
          <section aria-label="検索結果" className="min-w-0">
            {filters.practice === 'unit' && (
              <WordTopicCoverage
                catalog={catalog}
                grade={filters.grade}
                course={filters.course}
                onChoose={(topic, language) =>
                  change({ topic, language, query: '' })
                }
              />
            )}
            <p className="mb-4 text-sm text-slate-700" role="status">
              <strong className="text-xl tabular-nums text-teal-800">
                {results.length}
              </strong>{' '}
              件の教材
              {results.length !== catalog.length && (
                <span className="ml-2 text-slate-500">
                  ／ 全{catalog.length}件
                </span>
              )}
            </p>
            {results.length === 0 && (
              <div className="catalog-empty">
                <h2 className="font-bold">条件に一致する教材がありません</h2>
                <p className="my-3 text-sm text-slate-600">
                  キーワードを短くするか、絞り込み条件を減らしてください。
                </p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={reset}
                >
                  すべての教材を表示
                </button>
              </div>
            )}
            {CATEGORY_ORDER.map((category) => {
              const items = results.filter(
                (item) => item.category === category
              );
              if (!items.length) return null;
              return (
                <section
                  className="catalog-section"
                  key={category}
                  aria-labelledby={'catalog-' + category}
                >
                  <h2
                    id={'catalog-' + category}
                    className="catalog-group-heading"
                  >
                    {CATEGORY_CONFIG[category].label}{' '}
                    <span>{items.length}件</span>
                  </h2>
                  <ul>
                    {items.map((material) => (
                      <MaterialRow
                        key={material.key}
                        material={material}
                        gradeFilter={filters.grade}
                        settings={settings}
                        showTopics={filters.practice === 'unit'}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}
          </section>
        </div>
      </Container>
    </main>
  );
}
