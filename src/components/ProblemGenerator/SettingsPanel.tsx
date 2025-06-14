import React from 'react';
import type { LayoutColumns, ProblemType } from '../../types';

interface SettingsPanelProps {
  problemCount: number;
  layoutColumns: LayoutColumns;
  problemType?: ProblemType;
  onProblemCountChange: (count: number) => void;
  onLayoutColumnsChange: (columns: LayoutColumns) => void;
}

// 列数に応じた最大問題数を定義
const MAX_PROBLEMS_PER_COLUMN: Record<LayoutColumns, number> = {
  1: 10, // 1列の場合は最大10問
  2: 20, // 2列の場合は最大20問（10問×2列）
  3: 30, // 3列の場合は最大30問（10問×3列）
};

// 文章問題用の推奨問題数
const WORD_PROBLEM_RECOMMENDED: Record<LayoutColumns, number> = {
  1: 8,  // 1列の場合は8問を推奨
  2: 16, // 2列の場合は16問を推奨
  3: 24, // 3列の場合は24問を推奨
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  problemCount,
  layoutColumns,
  problemType,
  onProblemCountChange,
  onLayoutColumnsChange,
}) => {
  // 列数に応じた最大問題数を取得
  const maxProblems = MAX_PROBLEMS_PER_COLUMN[layoutColumns];
  const isWordProblem = problemType === 'word';
  const recommendedCount = isWordProblem ? WORD_PROBLEM_RECOMMENDED[layoutColumns] : undefined;
  
  // 現在の問題数が最大値を超えている場合は調整
  React.useEffect(() => {
    if (problemCount > maxProblems) {
      onProblemCountChange(maxProblems);
    }
  }, [layoutColumns, maxProblems, problemCount, onProblemCountChange]);
  
  // 列数に応じた問題数の選択肢を生成
  const problemCountOptions = [];
  for (let i = 5; i <= maxProblems; i += 5) {
    problemCountOptions.push(i);
  }


  return (
    <div className="space-y-6">
      {/* レイアウトを先に選択 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          レイアウト
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onLayoutColumnsChange(1)}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${
              layoutColumns === 1
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            1列
          </button>
          <button
            type="button"
            onClick={() => onLayoutColumnsChange(2)}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${
              layoutColumns === 2
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            2列
          </button>
          <button
            type="button"
            onClick={() => onLayoutColumnsChange(3)}
            className={`px-4 py-2 text-sm font-medium rounded-md border ${
              layoutColumns === 3
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            3列
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          印刷時のレイアウトを選択してください
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ※ {layoutColumns}列の場合、最大{maxProblems}問まで入ります
        </p>
        {isWordProblem && recommendedCount && (
          <p className="text-xs text-blue-600 mt-1">
            💡 文章問題は{recommendedCount}問がA4用紙1枚に最適です
          </p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          問題数
        </label>
        <select
          value={problemCount}
          onChange={(e) => onProblemCountChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {problemCountOptions.map((count) => (
            <option key={count} value={count}>
              {count}問{isWordProblem && count === recommendedCount ? ' (推奨)' : ''}
            </option>
          ))}
        </select>
        {isWordProblem && recommendedCount && problemCount > recommendedCount && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ {problemCount}問だと2ページに分かれる可能性があります
          </p>
        )}
      </div>
    </div>
  );
};