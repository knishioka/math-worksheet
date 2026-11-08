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
  getCategoryForPattern,
  getDifficultyLabel,
  getPatternDifficulty,
  getPatternLanguage,
} from '../../config/pattern-categories';
import {
  type CatalogCategory,
  type CatalogEntry,
  type CatalogLanguage,
  buildPatternCatalog,
  entryHasPattern,
  getEntryLanguageSupport,
  getEntrySearchText,
  resolveEntryPattern,
} from '../../config/pattern-catalog';
import { DifficultyStars } from '../UI/DifficultyStars';
import { getLearningStages } from '../../config/learning-paths';

interface CalculationPatternSelectorProps {
  grade: Grade;
  selectedPattern?: CalculationPattern;
  onPatternChange: (pattern: CalculationPattern) => void;
}

type DifficultyFilter = 'all' | DifficultyLevel;

const LANGUAGE_LABELS: Record<CatalogLanguage, string> = {
  ja: '日本語',
  en: 'English',
};

const DIFFICULTY_OPTIONS: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 1, label: '★ やさしい' },
  { value: 2, label: '★★ ふつう' },
  { value: 3, label: '★★★ チャレンジ' },
];

const RECENT_STORAGE_KEY = 'math-worksheet-recent-patterns-v1';
const RECENT_LIMIT = 8;
const RECENT_VISIBLE = 5;

function readRecentPatterns(): CalculationPattern[] {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(RECENT_STORAGE_KEY) ?? '[]'
    );
    return Array.isArray(saved)
      ? saved.filter(
          (value): value is CalculationPattern =>
            typeof value === 'string' && value in PATTERN_LABELS
        )
      : [];
  } catch {
    return [];
  }
}

function writeRecentPatterns(patterns: CalculationPattern[]): void {
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(patterns));
  } catch {
    // 保存できないブラウザでは画面を閉じるまでの記憶だけにする
  }
}

const normalizeSearch = (text: string): string =>
  text
    .normalize('NFKC')
    .toLocaleLowerCase('ja')
    .replace(/[ァ-ヶ]/g, (character) =>
      String.fromCharCode(character.charCodeAt(0) - 0x60)
    );

const languageOfPattern = (
  pattern: CalculationPattern | undefined
): CatalogLanguage =>
  pattern && getPatternLanguage(pattern) === 'en' ? 'en' : 'ja';

export const CalculationPatternSelector: React.FC<
  CalculationPatternSelectorProps
> = ({ grade, selectedPattern, onPatternChange }) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyFilter>('all');
  const [language, setLanguage] = useState<CatalogLanguage>(() =>
    languageOfPattern(selectedPattern)
  );
  const [openCategories, setOpenCategories] = useState<PatternCategory[]>(
    () => {
      const current = getCategoryForPattern(selectedPattern);
      return current ? [current] : [];
    }
  );
  const [recentPatterns, setRecentPatterns] =
    useState<CalculationPattern[]>(readRecentPatterns);
  const previousGradeRef = useRef(grade);
  const previousSelectedRef = useRef(selectedPattern);
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onPatternChangeRef = useRef(onPatternChange);
  onPatternChangeRef.current = onPatternChange;

  const allPatterns = useMemo(() => PATTERNS_BY_GRADE[grade] || [], [grade]);

  const catalog = useMemo(
    () => buildPatternCatalog(allPatterns, grade),
    [allPatterns, grade]
  );

  const orderedPatterns = useMemo(
    () =>
      catalog.flatMap((group) =>
        group.entries.map((entry) => resolveEntryPattern(entry, language))
      ),
    [catalog, language]
  );

  const entryMatches = useCallback(
    (entry: CatalogEntry): boolean => {
      if (difficulty !== 'all' && entry.difficulty !== difficulty) {
        return false;
      }
      const keywords = normalizeSearch(query)
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      if (keywords.length === 0) return true;
      const searchableText = normalizeSearch(getEntrySearchText(entry));
      return keywords.every((keyword) => searchableText.includes(keyword));
    },
    [difficulty, query]
  );

  const visibleCatalog = useMemo<CatalogCategory[]>(
    () =>
      catalog
        .map((group) => {
          const themes = group.themes
            .map((theme) => ({
              ...theme,
              entries: theme.entries.filter(entryMatches),
            }))
            .filter((theme) => theme.entries.length > 0);
          return {
            ...group,
            themes,
            entries: themes.flatMap((theme) => theme.entries),
          };
        })
        .filter((group) => group.entries.length > 0),
    [catalog, entryMatches]
  );

  const visibleCount = useMemo(
    () => visibleCatalog.reduce((sum, group) => sum + group.entries.length, 0),
    [visibleCatalog]
  );

  const selectedCategory = getCategoryForPattern(selectedPattern);
  const allEntries = useMemo(
    () => catalog.flatMap((group) => group.entries),
    [catalog]
  );
  const selectedEntryIndex = allEntries.findIndex((entry) =>
    entryHasPattern(entry, selectedPattern)
  );
  const selectedEntry =
    selectedEntryIndex >= 0 ? allEntries[selectedEntryIndex] : undefined;
  // 前後の教材は、いま選んでいる言語版を優先して選ぶ
  const selectedLanguage = languageOfPattern(selectedPattern);
  const neighbourPattern = (offset: -1 | 1): CalculationPattern | undefined => {
    if (selectedEntryIndex < 0) return undefined;
    const entry = allEntries[selectedEntryIndex + offset];
    return entry ? resolveEntryPattern(entry, selectedLanguage) : undefined;
  };
  const previousPattern = neighbourPattern(-1);
  const nextPattern = neighbourPattern(1);
  // 最近使った教材（いま選んでいるものと、この学年に無いものは除く）
  const visibleRecent = recentPatterns
    .filter(
      (pattern) => pattern !== selectedPattern && allPatterns.includes(pattern)
    )
    .slice(0, RECENT_VISIBLE);
  const selectedPairPattern =
    selectedEntry && getEntryLanguageSupport(selectedEntry) === 'both'
      ? resolveEntryPattern(
          selectedEntry,
          languageOfPattern(selectedPattern) === 'ja' ? 'en' : 'ja'
        )
      : undefined;

  const hasActiveFilters = query.trim() !== '' || difficulty !== 'all';
  // 検索・絞り込み中は該当カテゴリをすべて開き、探しやすくする
  const forceOpen = hasActiveFilters;

  useEffect(() => {
    if (previousGradeRef.current === grade) {
      return;
    }

    previousGradeRef.current = grade;
    setIsPickerOpen(true);
    setQuery('');
    setDifficulty('all');
  }, [grade]);

  // 選択中の教材が変わったら、そのカテゴリを開いた状態にする
  useEffect(() => {
    if (!selectedCategory) return;
    setOpenCategories((open) =>
      open.includes(selectedCategory) ? open : [...open, selectedCategory]
    );
  }, [selectedCategory]);

  useEffect(() => {
    if (isPickerOpen) searchInputRef.current?.focus();
  }, [isPickerOpen]);

  // 教材が切り替わったら、新しい教材と離れた教材を「最近使った」に積む
  // （初期表示のまま使い続けている間は積まない）
  useEffect(() => {
    const previous = previousSelectedRef.current;
    previousSelectedRef.current = selectedPattern;
    if (!selectedPattern || previous === selectedPattern) return;
    setRecentPatterns((recent) => {
      const touched = previous ? [selectedPattern, previous] : [selectedPattern];
      const updated = [
        ...touched,
        ...recent.filter((pattern) => !touched.includes(pattern)),
      ].slice(0, RECENT_LIMIT);
      writeRecentPatterns(updated);
      return updated;
    });
  }, [selectedPattern]);

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
    setDifficulty('all');
    window.requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  // 選んでも候補は閉じない。続けて別の教材へ切り替えられるようにする
  // （プレビューは横に表示され、候補一覧は内側でスクロールする）。
  const handlePatternSelect = useCallback(
    (pattern: CalculationPattern) => {
      onPatternChange(pattern);
    },
    [onPatternChange]
  );

  const jumpToPattern = useCallback(
    (pattern: CalculationPattern) => {
      setLanguage(languageOfPattern(pattern));
      onPatternChange(pattern);
    },
    [onPatternChange]
  );

  const toggleCategory = useCallback((target: PatternCategory) => {
    setOpenCategories((open) =>
      open.includes(target)
        ? open.filter((item) => item !== target)
        : [...open, target]
    );
  }, []);

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
                {selectedEntry?.onLearningPath && <LearningPathBadge />}
              </div>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-900">
                {PATTERN_LABELS[selectedPattern]}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                {PATTERN_DESCRIPTIONS[selectedPattern]}
              </p>
              {selectedPairPattern && (
                <button
                  type="button"
                  onClick={() => jumpToPattern(selectedPairPattern)}
                  className="mt-2 text-xs font-semibold text-teal-700 hover:text-teal-900 hover:underline"
                >
                  {LANGUAGE_LABELS[languageOfPattern(selectedPairPattern)]}
                  版に切り替える
                </button>
              )}
            </div>
          </div>
          {(previousPattern || nextPattern) && (
            <div
              className="mt-3 grid grid-cols-2 gap-2"
              role="group"
              aria-label="前後の教材"
            >
              <button
                type="button"
                disabled={!previousPattern}
                onClick={() => previousPattern && jumpToPattern(previousPattern)}
                title={previousPattern && PATTERN_LABELS[previousPattern]}
                className="flex min-w-0 items-center gap-1 rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-left text-xs font-medium text-teal-800 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span aria-hidden="true">←</span>
                <span className="min-w-0 flex-1 truncate">
                  前：{previousPattern ? PATTERN_LABELS[previousPattern] : '—'}
                </span>
              </button>
              <button
                type="button"
                disabled={!nextPattern}
                onClick={() => nextPattern && jumpToPattern(nextPattern)}
                title={nextPattern && PATTERN_LABELS[nextPattern]}
                className="flex min-w-0 items-center gap-1 rounded-lg border border-teal-200 bg-white px-2 py-1.5 text-right text-xs font-medium text-teal-800 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="min-w-0 flex-1 truncate">
                  次：{nextPattern ? PATTERN_LABELS[nextPattern] : '—'}
                </span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          )}
        </div>
      )}

      {visibleRecent.length > 0 && (
        <div role="group" aria-label="最近使った教材">
          <p className="mb-1.5 text-[11px] font-semibold tracking-wide text-slate-500">
            最近使った
          </p>
          <div className="flex flex-wrap gap-1.5">
            {visibleRecent.map((pattern) => (
              <button
                key={pattern}
                type="button"
                onClick={() => jumpToPattern(pattern)}
                className="max-w-full truncate rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900"
              >
                {PATTERN_LABELS[pattern]}
              </button>
            ))}
          </div>
        </div>
      )}

      {isPickerOpen && (
        <div
          id="pattern-picker"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              setIsPickerOpen(false);
              changeButtonRef.current?.focus();
            }
          }}
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

          <div className="space-y-3 border-y border-slate-100 py-3">
            <div
              role="group"
              aria-label="難易度で絞り込む"
              className="flex flex-wrap items-center gap-1.5"
            >
              <span className="mr-1 text-xs font-semibold text-slate-600">
                難易度
              </span>
              {DIFFICULTY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={difficulty === option.value}
                  onClick={() => setDifficulty(option.value)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                    difficulty === option.value
                      ? 'border-teal-500 bg-teal-700 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold text-slate-600">
                出題のことば
              </span>
              <div
                role="group"
                aria-label="出題のことば"
                className="inline-flex rounded-lg bg-slate-200 p-0.5"
              >
                {(Object.keys(LANGUAGE_LABELS) as CatalogLanguage[]).map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={language === option}
                      onClick={() => setLanguage(option)}
                      className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                        language === option
                          ? 'bg-white text-teal-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {LANGUAGE_LABELS[option]}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p
                className="text-xs font-semibold text-slate-600"
                role="status"
                aria-live="polite"
              >
                {visibleCount}件の候補
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

            {visibleCount > 0 ? (
              // 候補は内側でスクロールし、下にあるレイアウト・問題数の設定を
              // 押し下げないようにする（カテゴリ見出しは中で固定表示）。
              <fieldset className="relative min-w-0 max-h-[60vh] space-y-2 overflow-y-auto pr-0.5">
                <legend className="sr-only">計算パターン</legend>
                {visibleCatalog.map((group) => (
                  <CategorySection
                    key={group.category}
                    group={group}
                    open={forceOpen || openCategories.includes(group.category)}
                    onToggle={() => toggleCategory(group.category)}
                    language={language}
                    selectedPattern={selectedPattern}
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

interface CategorySectionProps {
  group: CatalogCategory;
  open: boolean;
  onToggle: () => void;
  language: CatalogLanguage;
  selectedPattern?: CalculationPattern;
  onSelect: (pattern: CalculationPattern) => void;
}

function CategorySection({
  group,
  open,
  onToggle,
  language,
  selectedPattern,
  onSelect,
}: CategorySectionProps): React.ReactElement {
  const config = CATEGORY_CONFIG[group.category];
  const headingId = `pattern-group-${group.category}`;
  const panelId = `pattern-panel-${group.category}`;
  const containsSelected = group.entries.some((entry) =>
    entryHasPattern(entry, selectedPattern)
  );
  // 全部が道すじ上のカテゴリでは、バッジを付けても区別にならないので省く
  const showPathBadge = group.entries.some((entry) => !entry.onLearningPath);

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      className="rounded-xl border border-slate-200 bg-white"
    >
      <h4 id={headingId} className="sticky top-0 z-10 rounded-t-xl bg-white">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-300"
        >
          <span aria-hidden="true" className="w-5 text-center text-sm">
            {config.icon}
          </span>
          <span className="flex-1 truncate">
            {config.label}{' '}
            <span className="font-normal text-slate-400">
              · {group.entries.length}件
            </span>
          </span>
          {containsSelected && !open && (
            <span className="rounded-full bg-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-800">
              選択中
            </span>
          )}
          <span
            aria-hidden="true"
            className={`text-sm text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            ▾
          </span>
        </button>
      </h4>
      {open && (
        <div id={panelId} className="space-y-3 border-t border-slate-100 p-2">
          {group.themes.map((theme) => (
            <div
              key={theme.key ?? 'default'}
              role="group"
              aria-label={theme.key ? theme.label : config.label}
              className="space-y-1.5"
            >
              {theme.key && (
                <p className="px-1 pt-1 text-[11px] font-semibold tracking-wide text-slate-500">
                  {theme.label}
                  <span className="ml-1 font-normal text-slate-400">
                    {theme.entries.length}
                  </span>
                </p>
              )}
              {theme.entries.map((entry) => (
                <PatternOption
                  key={entry.key}
                  entry={entry}
                  language={language}
                  selected={entryHasPattern(entry, selectedPattern)}
                  showPathBadge={showPathBadge}
                  onSelect={onSelect}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LearningPathBadge(): React.ReactElement {
  return (
    <span
      className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800"
      title="学習の道すじに含まれる教材"
    >
      道すじ
    </span>
  );
}

interface PatternOptionProps {
  entry: CatalogEntry;
  language: CatalogLanguage;
  selected: boolean;
  showPathBadge: boolean;
  onSelect: (pattern: CalculationPattern) => void;
}

function PatternOption({
  entry,
  language,
  selected,
  showPathBadge,
  onSelect,
}: PatternOptionProps): React.ReactElement {
  const pattern = resolveEntryPattern(entry, language);
  const support = getEntryLanguageSupport(entry);
  // 選んだ言語と違う言語でしか用意がない教材には、その言語を示す
  const languageNote =
    support === 'ja' || support === 'en'
      ? support !== language
        ? `${LANGUAGE_LABELS[support]}のみ`
        : undefined
      : undefined;

  return (
    <label
      className={`relative block cursor-pointer rounded-xl border p-2.5 transition ${
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
            {selected && (
              <span aria-hidden="true" className="mr-1 text-teal-700">
                ✓
              </span>
            )}
            {PATTERN_LABELS[pattern]}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {PATTERN_DESCRIPTIONS[pattern]}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <DifficultyStars difficulty={entry.difficulty} />
          {showPathBadge && entry.onLearningPath && <LearningPathBadge />}
          {languageNote && (
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {languageNote}
            </span>
          )}
        </div>
      </div>
    </label>
  );
}
