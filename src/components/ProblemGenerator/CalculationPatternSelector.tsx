import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { CalculationPattern, Grade } from '../../types';
import {
  PATTERNS_BY_GRADE,
  PATTERN_DESCRIPTIONS,
  PATTERN_LABELS,
} from '../../types';
import {
  CATEGORY_CONFIG,
  type DifficultyLevel,
  type PatternCategory,
  type PatternLanguage,
  filterPatternsByLanguage,
  getAvailableCategoriesSorted,
  getCategoryForPattern,
  getDifficultyLabel,
  getPatternDifficulty,
} from '../../config/pattern-categories';
import { LanguageFilter } from '../UI/LanguageFilter';
import { DifficultyStars } from '../UI/DifficultyStars';
import { getLearningStages } from '../../config/learning-paths';

interface CalculationPatternSelectorProps {
  grade: Grade;
  selectedPattern?: CalculationPattern;
  onPatternChange: (pattern: CalculationPattern) => void;
}

type CategoryFilter = 'all' | PatternCategory;
type DifficultyFilter = 'all' | DifficultyLevel;

export const CalculationPatternSelector: React.FC<
  CalculationPatternSelectorProps
> = ({ grade, selectedPattern, onPatternChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [language, setLanguage] = useState<PatternLanguage>('all');
  const previousGradeRef = useRef(grade);
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onPatternChangeRef = useRef(onPatternChange);
  onPatternChangeRef.current = onPatternChange;

  const allPatterns = useMemo(() => PATTERNS_BY_GRADE[grade] || [], [grade]);

  const languageFilteredPatterns = useMemo(
    () => filterPatternsByLanguage(allPatterns, language),
    [allPatterns, language]
  );

  // カテゴリ順→難易度順に並べることで、候補の順序を毎回一定にする。
  const categorizedPatterns = useMemo(
    () => getAvailableCategoriesSorted(languageFilteredPatterns),
    [languageFilteredPatterns]
  );

  const orderedPatterns = useMemo(
    () => categorizedPatterns.flatMap((group) => group.patterns),
    [categorizedPatterns]
  );

  const visiblePatterns = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ja');

    return orderedPatterns.filter((pattern) => {
      if (category !== 'all' && getCategoryForPattern(pattern) !== category) {
        return false;
      }
      if (
        difficulty !== 'all' &&
        getPatternDifficulty(pattern) !== difficulty
      ) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }

      const searchableText =
        `${PATTERN_LABELS[pattern]} ${PATTERN_DESCRIPTIONS[pattern]}`.toLocaleLowerCase(
          'ja'
        );
      return searchableText.includes(normalizedQuery);
    });
  }, [category, difficulty, orderedPatterns, query]);

  const selectedCategory = getCategoryForPattern(selectedPattern);
  const hasActiveFilters =
    query.trim() !== '' ||
    category !== 'all' ||
    difficulty !== 'all' ||
    language !== 'all';

  useEffect(() => {
    if (previousGradeRef.current === grade) {
      return;
    }

    previousGradeRef.current = grade;
    setIsPickerOpen(true);
    setQuery('');
    setCategory('all');
    setDifficulty('all');
  }, [grade]);

  // 未選択時だけ、現在の表示順で最初の問題を初期値にする。
  // フィルター操作では既存の選択を変更しない。
  useEffect(() => {
    if (!selectedPattern && orderedPatterns.length > 0) {
      onPatternChangeRef.current(
        getLearningStages(grade)[0]?.patterns[0] ?? orderedPatterns[0]
      );
    }
  }, [grade, orderedPatterns, selectedPattern]);

  const resetFilters = useCallback(() => {
    setQuery('');
    setCategory('all');
    setDifficulty('all');
    setLanguage('all');
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const handlePatternSelect = useCallback(
    (pattern: CalculationPattern) => {
      onPatternChange(pattern);
      setIsPickerOpen(false);
      setQuery('');
      window.requestAnimationFrame(() => changeButtonRef.current?.focus());
    },
    [onPatternChange]
  );

  if (allPatterns.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="pattern-selector-heading" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-teal-600">
            STEP 2
          </p>
          <h3
            id="pattern-selector-heading"
            className="text-sm font-semibold text-slate-800"
          >
            問題を選ぶ
          </h3>
        </div>
        {selectedPattern && (
          <button
            ref={changeButtonRef}
            type="button"
            onClick={() => setIsPickerOpen((open) => !open)}
            className="rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-400"
            aria-expanded={isPickerOpen}
            aria-controls="pattern-picker"
          >
            {isPickerOpen ? '候補を閉じる' : '問題を変更'}
          </button>
        )}
      </div>

      {selectedPattern && selectedCategory && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-3">
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-lg shadow-sm"
              aria-hidden="true"
            >
              {CATEGORY_CONFIG[selectedCategory].icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-[11px] font-semibold text-teal-700">
                  {CATEGORY_CONFIG[selectedCategory].label}
                </span>
                <span className="text-[11px] text-slate-500">
                  {getDifficultyLabel(getPatternDifficulty(selectedPattern))}
                </span>
              </div>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-900">
                {PATTERN_LABELS[selectedPattern]}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {PATTERN_DESCRIPTIONS[selectedPattern]}
              </p>
            </div>
          </div>
        </div>
      )}

      {isPickerOpen && (
        <div
          id="pattern-picker"
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div>
            <label
              htmlFor="pattern-search"
              className="mb-1.5 block text-xs font-semibold text-slate-600"
            >
              キーワードで探す
            </label>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="m20 20-3.5-3.5" strokeWidth="2" />
              </svg>
              <input
                ref={searchInputRef}
                id="pattern-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例：ひき算、時間、分数"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-teal-400 focus:bg-white focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-slate-600">
              目的から絞る
            </p>
            <div className="flex flex-wrap gap-1.5">
              <FilterChip
                label="すべて"
                count={languageFilteredPatterns.length}
                selected={category === 'all'}
                onClick={() => setCategory('all')}
              />
              {categorizedPatterns.map((group) => (
                <FilterChip
                  key={group.category}
                  label={`${CATEGORY_CONFIG[group.category].icon} ${CATEGORY_CONFIG[group.category].label}`}
                  count={group.patterns.length}
                  selected={category === group.category}
                  onClick={() => setCategory(group.category)}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-y border-slate-100 py-3">
            <label className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-600">
              難易度
              <select
                aria-label="難易度で絞り込む"
                value={difficulty}
                onChange={(event) =>
                  setDifficulty(
                    event.target.value === 'all'
                      ? 'all'
                      : (Number(event.target.value) as DifficultyLevel)
                  )
                }
                className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 font-medium text-slate-700 outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="all">すべて</option>
                <option value="1">やさしい</option>
                <option value="2">ふつう</option>
                <option value="3">チャレンジ</option>
              </select>
            </label>
            <LanguageFilter
              value={language}
              onChange={setLanguage}
              className="justify-between"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p
                className="text-xs font-semibold text-slate-600"
                role="status"
                aria-live="polite"
              >
                {visiblePatterns.length}件の候補
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-medium text-teal-700 hover:text-teal-900 hover:underline"
                >
                  絞り込みを解除
                </button>
              )}
            </div>

            {visiblePatterns.length > 0 ? (
              <fieldset className="max-h-96 space-y-1.5 overflow-y-auto pr-1">
                <legend className="sr-only">計算パターン</legend>
                {visiblePatterns.map((pattern) => (
                  <PatternOption
                    key={pattern}
                    pattern={pattern}
                    selected={selectedPattern === pattern}
                    onSelect={handlePatternSelect}
                  />
                ))}
              </fieldset>
            ) : (
              <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
                <p className="text-sm font-semibold text-slate-700">
                  条件に合う問題がありません
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  キーワードや絞り込み条件を変えてください。
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm ring-1 ring-slate-200"
                >
                  すべての候補を表示
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

interface FilterChipProps {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}

function FilterChip({
  label,
  count,
  selected,
  onClick,
}: FilterChipProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-2.5 py-1.5 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-300 ${
        selected
          ? 'border-teal-500 bg-teal-700 text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50'
      }`}
    >
      {label}
      <span className={`ml-1 ${selected ? 'text-teal-100' : 'text-slate-400'}`}>
        {count}
      </span>
    </button>
  );
}

interface PatternOptionProps {
  pattern: CalculationPattern;
  selected: boolean;
  onSelect: (pattern: CalculationPattern) => void;
}

function PatternOption({
  pattern,
  selected,
  onSelect,
}: PatternOptionProps): React.ReactElement {
  const difficulty = getPatternDifficulty(pattern);

  return (
    <label
      className={`block cursor-pointer rounded-xl border p-2.5 transition ${
        selected
          ? 'border-teal-400 bg-teal-50 ring-1 ring-teal-300 focus-within:ring-2 focus-within:ring-teal-500'
          : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-300'
      }`}
    >
      <input
        type="radio"
        name="calculationPattern"
        value={pattern}
        checked={selected}
        onChange={() => onSelect(pattern)}
        className="sr-only"
      />
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-slate-900">
            {PATTERN_LABELS[pattern]}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {PATTERN_DESCRIPTIONS[pattern]}
          </p>
        </div>
        <DifficultyStars difficulty={difficulty} />
      </div>
    </label>
  );
}
