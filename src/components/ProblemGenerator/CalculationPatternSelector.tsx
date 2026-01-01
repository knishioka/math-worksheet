import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import type { Grade, CalculationPattern } from '../../types';
import {
  PATTERNS_BY_GRADE,
  PATTERN_LABELS,
  PATTERN_DESCRIPTIONS,
} from '../../types';
import {
  type PatternLanguage,
  CATEGORY_CONFIG,
  LANGUAGE_DEPENDENT_CATEGORIES,
  getAvailableCategories,
  filterPatternsByLanguage,
  getCategoryForPattern,
} from '../../config/pattern-categories';
import { Accordion, type AccordionItem } from '../UI/Accordion';
import { LanguageFilter } from '../UI/LanguageFilter';

interface CalculationPatternSelectorProps {
  grade: Grade;
  selectedPattern?: CalculationPattern;
  onPatternChange: (pattern: CalculationPattern) => void;
}

export const CalculationPatternSelector: React.FC<
  CalculationPatternSelectorProps
> = ({ grade, selectedPattern, onPatternChange }) => {
  const [language, setLanguage] = useState<PatternLanguage>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    'basic',
  ]);

  // コールバック参照を安定化
  const onPatternChangeRef = useRef(onPatternChange);
  onPatternChangeRef.current = onPatternChange;

  // 学年に対応するすべてのパターン
  const allPatterns = useMemo(
    () => PATTERNS_BY_GRADE[grade] || [],
    [grade]
  );

  // 言語フィルター適用後のパターン
  const filteredPatterns = useMemo(
    () => filterPatternsByLanguage(allPatterns, language),
    [allPatterns, language]
  );

  // カテゴリごとにグループ化
  const categorizedPatterns = useMemo(
    () => getAvailableCategories(filteredPatterns),
    [filteredPatterns]
  );

  // 言語依存パターンがあるかどうか（言語フィルターの表示判定用）
  const hasLanguageDependentPatterns = useMemo(() => {
    return allPatterns.some((pattern) => {
      const category = getCategoryForPattern(pattern);
      return category && LANGUAGE_DEPENDENT_CATEGORIES.includes(category);
    });
  }, [allPatterns]);

  // 選択中パターンのカテゴリを自動展開
  useEffect(() => {
    if (selectedPattern) {
      const category = getCategoryForPattern(selectedPattern);
      if (category && !expandedCategories.includes(category)) {
        setExpandedCategories((prev) => [...prev, category]);
      }
    }
  }, [selectedPattern, expandedCategories]);

  // 最初のパターンを自動選択
  useEffect(() => {
    if (!selectedPattern && filteredPatterns.length > 0) {
      onPatternChangeRef.current(filteredPatterns[0]);
    }
  }, [selectedPattern, filteredPatterns]);

  // 言語変更時に選択中のパターンがフィルターアウトされた場合の処理
  useEffect(() => {
    if (
      selectedPattern &&
      !filteredPatterns.includes(selectedPattern) &&
      filteredPatterns.length > 0
    ) {
      onPatternChangeRef.current(filteredPatterns[0]);
    }
  }, [selectedPattern, filteredPatterns]);

  // パターン選択ハンドラー
  const handlePatternSelect = useCallback(
    (pattern: CalculationPattern) => {
      onPatternChange(pattern);
    },
    [onPatternChange]
  );

  if (allPatterns.length === 0) {
    return null;
  }

  // アコーディオンアイテムを生成
  const accordionItems: AccordionItem[] = categorizedPatterns.map(
    ({ category, patterns }) => {
      const config = CATEGORY_CONFIG[category];
      return {
        id: category,
        title: config.label,
        icon: config.icon,
        badge: patterns.length,
        children: (
          <PatternList
            patterns={patterns}
            selectedPattern={selectedPattern}
            onPatternSelect={handlePatternSelect}
          />
        ),
      };
    }
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          計算の種類を選択
        </label>
        {hasLanguageDependentPatterns && (
          <LanguageFilter value={language} onChange={setLanguage} />
        )}
      </div>

      <Accordion
        items={accordionItems}
        expandedIds={expandedCategories}
        onExpandChange={setExpandedCategories}
        allowMultiple
      />

      <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <p className="text-sm text-amber-800">
          <strong>ヒント:</strong>{' '}
          学年に応じた適切な難易度の問題が自動生成されます。
          まずは基本的な計算から始めることをおすすめします。
        </p>
      </div>
    </div>
  );
};

// パターン一覧コンポーネント
interface PatternListProps {
  patterns: CalculationPattern[];
  selectedPattern?: CalculationPattern;
  onPatternSelect: (pattern: CalculationPattern) => void;
}

function PatternList({
  patterns,
  selectedPattern,
  onPatternSelect,
}: PatternListProps): React.ReactElement {
  return (
    <div className="space-y-1.5">
      {patterns.map((pattern) => (
        <label
          key={pattern}
          className={`block p-2.5 rounded-lg border cursor-pointer transition-colors ${
            selectedPattern === pattern
              ? 'border-sky-400 bg-sky-50 ring-1 ring-sky-400'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <input
            type="radio"
            name="calculationPattern"
            value={pattern}
            checked={selectedPattern === pattern}
            onChange={() => onPatternSelect(pattern)}
            className="sr-only"
          />
          <div className="flex items-start">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-slate-900 truncate">
                {PATTERN_LABELS[pattern]}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                {PATTERN_DESCRIPTIONS[pattern]}
              </div>
            </div>
            {selectedPattern === pattern && (
              <div className="ml-2 flex-shrink-0">
                <svg
                  className="h-4 w-4 text-sky-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
