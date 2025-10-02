import React from 'react';
import type {
  LayoutColumns,
  ProblemType,
  CalculationPattern,
} from '../../types';
import { getPrintTemplate } from '../../config/print-templates';

interface SettingsPanelProps {
  problemCount: number;
  layoutColumns: LayoutColumns;
  problemType?: ProblemType;
  calculationPattern?: CalculationPattern;
  onProblemCountChange: (count: number) => void;
  onLayoutColumnsChange: (columns: LayoutColumns) => void;
}

// 文章問題を生成する計算パターン
const WORD_PROBLEM_PATTERNS: CalculationPattern[] = [
  'percent-basic', // 百分率
  'area-volume', // 面積・体積
  'ratio-proportion', // 比と比例
  'speed-time-distance', // 速さ・時間・距離
  'complex-calc', // 複雑な計算
];

// 筆算を生成する計算パターン
const HISSAN_PATTERNS: CalculationPattern[] = [
  'hissan-add-double', // 2桁のたし算の筆算
  'hissan-sub-double', // 2桁のひき算の筆算
  'hissan-add-triple', // 3桁のたし算の筆算
  'hissan-sub-triple', // 3桁のひき算の筆算
  'hissan-mult-basic', // 2桁×1桁のかけ算の筆算
  'hissan-mult-advanced', // 3桁×2桁のかけ算の筆算
  'hissan-div-basic', // わり算の筆算
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  problemCount,
  layoutColumns,
  problemType,
  calculationPattern,
  onProblemCountChange,
  onLayoutColumnsChange,
}) => {
  // 文章問題かどうかを判定：問題タイプが'word'または、基本計算で文章問題パターンが選択されている場合
  const isWordProblem =
    problemType === 'word' ||
    (problemType === 'basic' &&
      calculationPattern &&
      WORD_PROBLEM_PATTERNS.includes(calculationPattern));

  // 筆算かどうかを判定
  const isHissan =
    problemType === 'hissan' ||
    (problemType === 'basic' &&
      calculationPattern &&
      HISSAN_PATTERNS.includes(calculationPattern));

  // 問題タイプに応じたテンプレートを取得
  const effectiveProblemType: ProblemType = isWordProblem
    ? 'word'
    : isHissan
      ? 'hissan'
      : problemType || 'basic';
  const template = getPrintTemplate(effectiveProblemType);

  // 列数に応じた最大問題数と推奨問題数を取得
  const maxProblems = template.maxCounts[layoutColumns];
  const recommendedCount = template.recommendedCounts[layoutColumns];

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
        {isWordProblem && (
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
