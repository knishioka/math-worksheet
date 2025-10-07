import React from 'react';
import type {
  LayoutColumns,
  ProblemType,
  CalculationPattern,
} from '../../types';
import { getPrintTemplate } from '../../config/print-templates';
import {
  isWordEnProblem,
  isWordProblem,
  getEffectiveProblemType,
} from '../../lib/utils/problem-type-detector';

interface SettingsPanelProps {
  problemCount: number;
  layoutColumns: LayoutColumns;
  problemType?: ProblemType;
  calculationPattern?: CalculationPattern;
  onProblemCountChange: (count: number) => void;
  onLayoutColumnsChange: (columns: LayoutColumns) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  problemCount,
  layoutColumns,
  problemType,
  calculationPattern,
  onProblemCountChange,
  onLayoutColumnsChange,
}) => {
  // 問題タイプの判定
  const isWordEn = isWordEnProblem(calculationPattern);
  const isWord = isWordProblem(problemType, calculationPattern);

  // 実効的な問題タイプを取得
  const effectiveProblemType = getEffectiveProblemType(problemType, calculationPattern);
  const template = getPrintTemplate(effectiveProblemType);

  // 列数に応じた最大問題数と推奨問題数を取得
  const maxProblems = template.maxCounts[layoutColumns];
  const recommendedCount = template.recommendedCounts[layoutColumns];

  // 文章問題の場合は2列レイアウトを推奨デフォルトにする
  React.useEffect(() => {
    if ((isWord || isWordEn) && layoutColumns !== 2) {
      onLayoutColumnsChange(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWord, isWordEn]);

  // 問題タイプまたは列数が変更されたときに推奨問題数を自動選択
  React.useEffect(() => {
    onProblemCountChange(recommendedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveProblemType, layoutColumns, recommendedCount]);

  // 列数に応じた問題数の選択肢を生成
  // 推奨問題数をステップとして使用し、最大値まで生成
  const problemCountOptions = [];
  const step = recommendedCount;
  for (let i = step; i <= maxProblems; i += step) {
    problemCountOptions.push(i);
  }
  // 最大値が選択肢に含まれていない場合は追加
  if (!problemCountOptions.includes(maxProblems)) {
    problemCountOptions.push(maxProblems);
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
        {isWord && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xs text-blue-700 font-medium mb-2">
              💡 {template.displayName}の推奨問題数 (A4用紙1枚に最適)
            </p>
            <div className="grid grid-cols-3 gap-1">
              {([1, 2, 3] as const).map((cols) => {
                const colTemplate = getPrintTemplate(effectiveProblemType);
                const colRecommended = colTemplate.recommendedCounts[cols];
                const isCurrentLayout = layoutColumns === cols;
                const isSelected = problemCount === colRecommended;
                return (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => onProblemCountChange(colRecommended)}
                    className={`px-2 py-1 text-xs rounded border relative ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : isCurrentLayout
                          ? 'bg-blue-100 text-blue-700 border-blue-400 hover:bg-blue-200 ring-2 ring-blue-300'
                          : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {cols}列: {colRecommended}問
                    {isCurrentLayout && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              🎯 現在のレイアウト({layoutColumns}列)の推奨: {recommendedCount}問
            </p>
          </div>
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
              {count}問{count === recommendedCount ? ' (推奨)' : ''}
            </option>
          ))}
        </select>
        {problemCount > template.fitsInA4.threshold[layoutColumns] && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠️ {problemCount}問だと2ページに分かれる可能性があります
          </p>
        )}
      </div>
    </div>
  );
};
