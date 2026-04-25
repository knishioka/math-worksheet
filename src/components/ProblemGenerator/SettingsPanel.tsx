import React from 'react';
import type {
  LayoutColumns,
  ProblemType,
  CalculationPattern,
} from '../../types';
import {
  getPrintTemplate,
  PATTERN_COUNT_OVERRIDES,
} from '../../config/print-templates';
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
  const effectiveProblemType = getEffectiveProblemType(
    problemType,
    calculationPattern
  );
  const template = getPrintTemplate(effectiveProblemType);
  const isAnzan = effectiveProblemType === 'anzan';
  const isNumberTracing = effectiveProblemType === 'number-tracing';

  // 列数に応じた最大問題数と推奨問題数を取得（パターン固有オーバーライド対応）
  const patternOverride = calculationPattern
    ? PATTERN_COUNT_OVERRIDES[calculationPattern]
    : undefined;
  const maxProblems =
    patternOverride?.maxCounts[layoutColumns] ??
    template.maxCounts[layoutColumns];
  const recommendedCount =
    patternOverride?.recommendedCounts[layoutColumns] ??
    template.recommendedCounts[layoutColumns];

  // 文章問題・暗算の場合は2列レイアウトを推奨デフォルトにする
  React.useEffect(() => {
    if ((isWord || isWordEn || isAnzan) && layoutColumns !== 2) {
      onLayoutColumnsChange(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWord, isWordEn, isAnzan]);

  // 問題タイプまたは列数が変更されたときに推奨問題数を自動選択
  React.useEffect(() => {
    onProblemCountChange(recommendedCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveProblemType, layoutColumns, recommendedCount]);

  // 列数に応じた問題数の選択肢を生成
  // 小さなステップ（2問または4問）で細かく選択可能にする
  const problemCountOptions = [];

  // ステップサイズの決定: 文章問題は2問、それ以外は問題数に応じて調整
  const getStepSize = (): number => {
    if (isWord || isWordEn) return 2; // 文章問題は2問ステップ
    if (recommendedCount >= 20) return 5; // 20問以上は5問ステップ
    if (recommendedCount >= 10) return 2; // 10-19問は2問ステップ
    return 1; // 10問未満は1問ステップ
  };

  const step = getStepSize();
  const minProblems = Math.max(step, Math.floor(recommendedCount / 2)); // 最小値は推奨の半分程度

  const lessCount = Math.floor((recommendedCount * 0.75) / step) * step;
  const moreCount = Math.ceil((recommendedCount * 1.25) / step) * step;

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

  const showLessOption =
    lessCount >= minProblems && problemCountOptions.includes(lessCount);
  const showMoreOption =
    moreCount <= maxProblems && problemCountOptions.includes(moreCount);

  // なぞり書きはレイアウト・問題数固定（10問・2分割）なので設定UIを省略
  if (isNumberTracing) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
          <h4 className="mb-2 text-sm font-semibold text-sky-900">
            レイアウトと問題数
          </h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            数字なぞり書きはA4一枚に0〜4を左、5〜9を右に配置した固定レイアウトです（10問）。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* レイアウトを先に選択 */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          レイアウト
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => onLayoutColumnsChange(1)}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              layoutColumns === 1
                ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                : 'border-sky-200 bg-white/80 text-slate-600 hover:bg-sky-50'
            }`}
          >
            1列
          </button>
          <button
            type="button"
            onClick={() => onLayoutColumnsChange(2)}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              layoutColumns === 2
                ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                : 'border-sky-200 bg-white/80 text-slate-600 hover:bg-sky-50'
            }`}
          >
            2列
          </button>
          <button
            type="button"
            onClick={() => onLayoutColumnsChange(3)}
            className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
              layoutColumns === 3
                ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                : 'border-sky-200 bg-white/80 text-slate-600 hover:bg-sky-50'
            }`}
          >
            3列
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          印刷時のレイアウトを選択してください
        </p>
        <p className="mt-1 text-xs text-slate-500">
          ※ {layoutColumns}列の場合、最大{maxProblems}問まで入ります
        </p>
        {isWord && (
          <div className="mt-2 rounded-2xl border border-sky-100 bg-sky-50/70 p-3">
            <p className="mb-2 text-xs font-semibold text-sky-800">
              💡 {template.displayName}の推奨問題数 (A4用紙1枚に最適)
            </p>
            <div className="grid grid-cols-3 gap-1">
              {([1, 2, 3] as const).map((cols) => {
                const colTemplate = getPrintTemplate(effectiveProblemType);
                const colRecommended =
                  patternOverride?.recommendedCounts[cols] ??
                  colTemplate.recommendedCounts[cols];
                const isCurrentLayout = layoutColumns === cols;
                const isSelected = problemCount === colRecommended;
                return (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => onProblemCountChange(colRecommended)}
                    className={`relative rounded-2xl border px-2 py-1 text-xs transition ${
                      isSelected
                        ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                        : isCurrentLayout
                          ? 'border-sky-300 bg-sky-100/90 text-sky-700 ring-2 ring-sky-200 hover:bg-sky-200/80'
                          : 'border-sky-200 bg-white/80 text-sky-600 hover:bg-sky-50'
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
            <p className="mt-1 text-xs text-sky-700">
              🎯 現在のレイアウト({layoutColumns}列)の推奨: {recommendedCount}問
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          問題数
        </label>

        {/* クイック選択ボタン */}
        <div className="mb-3 rounded-2xl border border-sky-100 bg-slate-50/80 p-3">
          <p className="mb-2 text-xs font-semibold text-slate-600">
            クイック選択
          </p>
          <div className="grid grid-cols-3 gap-2">
            {/* 少なめ: 推奨の約0.75倍 */}
            {showLessOption && (
              <button
                type="button"
                onClick={() => onProblemCountChange(lessCount)}
                className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                  problemCount === lessCount
                    ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                    : 'border-sky-200 bg-white/80 text-slate-600 hover:bg-sky-50'
                }`}
              >
                少なめ
                <br />
                <span className="text-xs">{lessCount}問</span>
              </button>
            )}

            {/* 推奨 */}
            <button
              type="button"
              onClick={() => onProblemCountChange(recommendedCount)}
              className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                problemCount === recommendedCount
                  ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                  : 'border-sky-200 bg-sky-50/80 text-sky-700 hover:bg-sky-100'
              }`}
            >
              推奨 🎯
              <br />
              <span className="text-xs font-medium">{recommendedCount}問</span>
            </button>

            {/* 多め: 推奨の約1.25倍 */}
            {showMoreOption && (
              <button
                type="button"
                onClick={() => onProblemCountChange(moreCount)}
                className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                  problemCount === moreCount
                    ? 'border-sky-500 bg-sky-500/90 text-white shadow'
                    : 'border-sky-200 bg-white/80 text-slate-600 hover:bg-sky-50'
                }`}
              >
                多め
                <br />
                <span className="text-xs">{moreCount}問</span>
              </button>
            )}
          </div>
        </div>

        {/* 詳細選択 */}
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-500">
            詳細選択 ({minProblems}〜{maxProblems}問、{step}問ステップ)
          </label>
          <select
            value={problemCount}
            onChange={(e) => onProblemCountChange(Number(e.target.value))}
            className="w-full rounded-2xl border border-sky-200 bg-white/80 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-300"
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
