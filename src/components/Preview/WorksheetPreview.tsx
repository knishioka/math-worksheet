import React from 'react';
import type { WorksheetData } from '../../types';
import { ProblemList } from './ProblemList';
import { PrintButton } from '../Export/PrintButton';

interface WorksheetPreviewProps {
  worksheetData?: WorksheetData;
  showAnswers?: boolean;
}

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({
  worksheetData,
  showAnswers = false,
}) => {
  if (!worksheetData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">プレビューエリア</h3>
          <p className="text-sm">
            左側の設定で問題を生成すると、ここにプレビューが表示されます
          </p>
        </div>
      </div>
    );
  }

  const { settings, problems, generatedAt } = worksheetData;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Worksheet Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 no-print">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">
            プレビュー - {getOperationName(settings.operation)}
            ({settings.grade}年生)
          </h2>
          <div className="text-sm text-gray-500">
            {problems.length}問 • {settings.layoutColumns}列レイアウト
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>生成日時: {formatDate(generatedAt)}</span>
          {showAnswers && (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
              解答表示中
            </span>
          )}
        </div>
      </div>

      {/* Printable worksheet content */}
      <div id="printable-worksheet">
        {/* Print Header - Only visible when printing */}
        <div className="print-only p-3 border-b border-gray-200">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-sm flex items-baseline">
              名前：<span className="inline-block w-32 border-b border-black mx-1" style={{ height: '1.2rem' }} />
            </div>
            <div className="text-sm text-center">
              {settings.grade}年生 {getOperationName(settings.operation)}
            </div>
            <div className="text-sm text-right flex items-baseline justify-end">
              点数：<span className="inline-block w-16 border-b border-black mx-1" style={{ height: '1.2rem' }} />点
            </div>
          </div>
        </div>

        {/* Problems Content */}
        <div className="p-4 print:p-2">
          <ProblemList
            problems={problems}
            layoutColumns={settings.layoutColumns}
            showAnswers={showAnswers}
          />
        </div>

        {/* Footer - Only visible when printing */}
        <div className="print-only p-2 border-t border-gray-200 text-center text-xs text-gray-500">
          計算プリント自動作成ツール
        </div>
      </div>

      {/* Print Button - Below problems */}
      <div className="p-6 pt-0 no-print">
        <PrintButton
          worksheetTitle={`${settings.grade}年生${getOperationName(settings.operation)}プリント`}
          elementId="printable-worksheet"
        />
      </div>
    </div>
  );
};

function getOperationName(operation: string): string {
  switch (operation) {
    case 'addition':
      return 'たし算';
    case 'subtraction':
      return 'ひき算';
    case 'multiplication':
      return 'かけ算';
    case 'division':
      return 'わり算';
    default:
      return '計算';
  }
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}