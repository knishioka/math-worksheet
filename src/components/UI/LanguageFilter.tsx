import React from 'react';
import type { PatternLanguage } from '../../config/pattern-categories';

export interface LanguageFilterProps {
  value: PatternLanguage;
  onChange: (value: PatternLanguage) => void;
  /** 非活性状態（言語非依存のみ表示中など） */
  disabled?: boolean;
  className?: string;
}

const LANGUAGE_OPTIONS: { value: PatternLanguage; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

/**
 * 言語フィルターコンポーネント
 * 3択トグルボタンで言語を切り替え
 */
export function LanguageFilter({
  value,
  onChange,
  disabled = false,
  className = '',
}: LanguageFilterProps): React.ReactElement {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs font-medium text-slate-500">言語:</span>
      <div
        className={`inline-flex rounded-lg p-0.5 ${
          disabled ? 'bg-slate-100' : 'bg-slate-200'
        }`}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => !disabled && onChange(option.value)}
            disabled={disabled}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              value === option.value
                ? disabled
                  ? 'bg-slate-300 text-slate-500'
                  : 'bg-white text-sky-700 shadow-sm'
                : disabled
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
