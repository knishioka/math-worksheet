import React from 'react';
import type { LayoutColumns, Operation } from '../../types';

interface SettingsPanelProps {
  problemCount: number;
  layoutColumns: LayoutColumns;
  includeCarryOver?: boolean;
  operation?: Operation;
  minNumber?: number;
  maxNumber?: number;
  onProblemCountChange: (count: number) => void;
  onLayoutColumnsChange: (columns: LayoutColumns) => void;
  onIncludeCarryOverChange?: (include: boolean) => void;
  onMinNumberChange?: (min: number) => void;
  onMaxNumberChange?: (max: number) => void;
}

// 列数に応じた最大問題数を定義
const MAX_PROBLEMS_PER_COLUMN: Record<LayoutColumns, number> = {
  1: 20, // 1列の場合は最大20問
  2: 30, // 2列の場合は最大30問（15問×2列）
  3: 42, // 3列の場合は最大42問（14問×3列）
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  problemCount,
  layoutColumns,
  includeCarryOver,
  operation,
  minNumber,
  maxNumber,
  onProblemCountChange,
  onLayoutColumnsChange,
  onIncludeCarryOverChange,
  onMinNumberChange,
  onMaxNumberChange,
}) => {
  // 列数に応じた最大問題数を取得
  const maxProblems = MAX_PROBLEMS_PER_COLUMN[layoutColumns];
  
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

  // 演算に応じた繰り上がり・繰り下がりのラベルを取得
  const getCarryOverLabel = (): { label: string; description: string } => {
    switch (operation) {
      case 'addition':
        return {
          label: '繰り上がりを含む',
          description: '繰り上がりのあるたし算を含めます'
        };
      case 'subtraction':
        return {
          label: '繰り下がりを含む',
          description: '繰り下がりのあるひき算を含めます'
        };
      default:
        return {
          label: '繰り上がり・繰り下がりを含む',
          description: 'より難しい計算問題を含めます'
        };
    }
  };

  const carryOverLabels = getCarryOverLabel();

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
              {count}問
            </option>
          ))}
        </select>
      </div>

      {onIncludeCarryOverChange && (
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={includeCarryOver || false}
              onChange={(e) => onIncludeCarryOverChange(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              {carryOverLabels.label}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {carryOverLabels.description}
          </p>
        </div>
      )}

      {onMinNumberChange && onMaxNumberChange && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              数値の範囲
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">最小値</label>
                <input
                  type="number"
                  value={minNumber || 1}
                  onChange={(e) => onMinNumberChange(Number(e.target.value))}
                  min="1"
                  max="9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">最大値</label>
                <input
                  type="number"
                  value={maxNumber || 100}
                  onChange={(e) => onMaxNumberChange(Number(e.target.value))}
                  min="1"
                  max="9999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-black mb-2">プレビュー情報</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <div>レイアウト: {layoutColumns}列</div>
          <div>問題数: {problemCount}問</div>
          {includeCarryOver !== undefined && onIncludeCarryOverChange && (
            <div>
              {operation === 'addition' ? '繰り上がり' : operation === 'subtraction' ? '繰り下がり' : '繰り上がり・繰り下がり'}: {includeCarryOver ? 'あり' : 'なし'}
            </div>
          )}
          {minNumber !== undefined && maxNumber !== undefined && (
            <div>
              数値範囲: {minNumber} 〜 {maxNumber}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};