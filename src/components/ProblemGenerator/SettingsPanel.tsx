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
  // 小さなステップ（2問または4問）で細かく選択可能にする
  const problemCountOptions = [];

  // ステップサイズの決定: 文章問題は2問、それ以外は問題数に応じて調整
  const getStepSize = () => {
    if (isWord || isWordEn) return 2; // 文章問題は2問ステップ
    if (recommendedCount >= 20) return 5; // 20問以上は5問ステップ
    if (recommendedCount >= 10) return 2; // 10-19問は2問ステップ
    return 1; // 10問未満は1問ステップ
  };

  const step = getStepSize();
  const minProblems = Math.max(step, Math.floor(recommendedCount / 2)); // 最小値は推奨の半分程度

  // 最小値から最大値まで、ステップごとに選択肢を生成
  for (let i = minProblems; i <= maxProblems; i += step) {
    problemCountOptions.push(i);
  }

  // 推奨問題数が選択肢に含まれていない場合は追加
  if (!problemCountOptions.includes(recommendedCount)) {
    problemCountOptions.push(recommendedCount);
    problemCountOptions.sort((a, b) => a - b);
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

        {/* クイック選択ボタン */}
        <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 mb-2 font-medium">
            クイック選択
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* 少なめ: 推奨の約0.75倍 */}
            {(() => {
              const lessCount = Math.floor(recommendedCount * 0.75 / step) * step;
              if (lessCount >= minProblems && problemCountOptions.includes(lessCount)) {
                return (
                  <button
                    type="button"
                    onClick={() => onProblemCountChange(lessCount)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      problemCount === lessCount
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    少なめ<br />
                    <span className="text-xs">{lessCount}問</span>
                  </button>
                );
              }
              return null;
            })()}

            {/* 推奨 */}
            <button
              type="button"
              onClick={() => onProblemCountChange(recommendedCount)}
              className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                problemCount === recommendedCount
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
              }`}
            >
              推奨 🎯<br />
              <span className="text-xs font-medium">{recommendedCount}問</span>
            </button>

            {/* 多め: 推奨の約1.25倍 */}
            {(() => {
              const moreCount = Math.ceil(recommendedCount * 1.25 / step) * step;
              if (moreCount <= maxProblems && problemCountOptions.includes(moreCount)) {
                return (
                  <button
                    type="button"
                    onClick={() => onProblemCountChange(moreCount)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                      problemCount === moreCount
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    多め<br />
                    <span className="text-xs">{moreCount}問</span>
                  </button>
                );
              }
              return null;
            })()}
          </div>
        </div>

        {/* 詳細選択 */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">
            詳細選択 ({minProblems}〜{maxProblems}問、{step}問ステップ)
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
        </div>

        {problemCount > template.fitsInA4.threshold[layoutColumns] && (
          <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
            <span>⚠️</span>
            <span>{problemCount}問だと2ページに分かれる可能性があります</span>
          </p>
        )}
        {problemCount === recommendedCount && (
          <p className="text-xs text-green-600 mt-2 flex items-start gap-1">
            <span>✓</span>
            <span>A4用紙1枚に最適な問題数です</span>
          </p>
        )}
      </div>
    </div>
  );
};
