import React from 'react';
import type { Grade, CalculationPattern } from '../../types';
import {
  PATTERNS_BY_GRADE,
  PATTERN_LABELS,
  PATTERN_DESCRIPTIONS,
} from '../../types';

interface CalculationPatternSelectorProps {
  grade: Grade;
  selectedPattern?: CalculationPattern;
  onPatternChange: (pattern: CalculationPattern) => void;
}

export const CalculationPatternSelector: React.FC<
  CalculationPatternSelectorProps
> = ({ grade, selectedPattern, onPatternChange }) => {
  const availablePatterns = React.useMemo(
    () => PATTERNS_BY_GRADE[grade] || [],
    [grade]
  );

  // 最初のパターンを自動選択
  React.useEffect(() => {
    if (!selectedPattern && availablePatterns.length > 0) {
      onPatternChange(availablePatterns[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPattern, availablePatterns]);

  if (availablePatterns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        計算の種類を選択
      </label>

      <div className="space-y-2">
        {availablePatterns.map((pattern) => (
          <label
            key={pattern}
            className={`block p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedPattern === pattern
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name="calculationPattern"
              value={pattern}
              checked={selectedPattern === pattern}
              onChange={() => onPatternChange(pattern)}
              className="sr-only"
            />
            <div className="flex items-start">
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {PATTERN_LABELS[pattern]}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {PATTERN_DESCRIPTIONS[pattern]}
                </div>
              </div>
              {selectedPattern === pattern && (
                <div className="ml-3 flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-600"
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
