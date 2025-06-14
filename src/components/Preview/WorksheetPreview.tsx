import React, { useState, useCallback } from 'react';
import type { WorksheetData, WorksheetSettings } from '../../types';
import { ProblemList } from './ProblemList';
import { SinglePrintButton } from '../Export/SinglePrintButton';
import { MultiPagePrintDialog } from './MultiPagePrintDialog';
import { MultiPrintButton } from '../Export/MultiPrintButton';
import { generateProblems } from '../../lib/generators';
import { PATTERN_LABELS } from '../../types/calculation-patterns';

interface WorksheetPreviewProps {
  worksheetData?: WorksheetData;
  showAnswers?: boolean;
}

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({
  worksheetData,
  showAnswers = false,
}) => {
  const [isMultiPageDialogOpen, setIsMultiPageDialogOpen] = useState(false);
  const [multiPageWorksheets, setMultiPageWorksheets] = useState<WorksheetData[]>([]);

  const handleMultiPagePrint = useCallback((pageCount: number) => {
    if (!worksheetData) return;
    
    // 複数ページ分のワークシートを生成
    const worksheets: WorksheetData[] = [];
    for (let i = 0; i < pageCount; i++) {
      const newProblems = generateProblems(worksheetData.settings);
      worksheets.push({
        settings: worksheetData.settings,
        problems: newProblems,
        generatedAt: new Date(),
      });
    }
    
    setMultiPageWorksheets(worksheets);
    setIsMultiPageDialogOpen(false);
    
    // 印刷処理は別のタイミングで実行
    setTimeout(() => {
      const printButton = document.getElementById('multi-print-trigger');
      if (printButton) {
        printButton.click();
      }
    }, 100);
  }, [worksheetData]);
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
    <>
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Worksheet Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50 no-print">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-black">
            プレビュー - {getPreviewTitle(settings)}
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

      {/* Print Buttons - Below problems */}
      <div className="p-6 pt-0 no-print">
        <div className="flex items-center gap-4">
          <SinglePrintButton
            worksheet={worksheetData}
            showAnswers={showAnswers}
          />
          <button
            onClick={() => setIsMultiPageDialogOpen(true)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            複数枚印刷
          </button>
        </div>
      </div>
    </div>

    {/* Multi-page print dialog */}
    <MultiPagePrintDialog
      isOpen={isMultiPageDialogOpen}
      onClose={() => setIsMultiPageDialogOpen(false)}
      onPrint={handleMultiPagePrint}
      settings={settings}
    />

    {/* Multi-page worksheets for printing */}
    {multiPageWorksheets.length > 0 && (
      <div style={{ display: 'none' }}>
        <MultiPrintButton
          id="multi-print-trigger"
          worksheets={multiPageWorksheets}
          showAnswers={showAnswers}
          onPrint={() => setMultiPageWorksheets([])}
        />
      </div>
    )}
  </>
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

function getPreviewTitle(settings: WorksheetSettings): string {
  const grade = `${settings.grade}年生`;
  
  // 計算パターンがある場合は、パターンのラベルを表示
  if (settings.calculationPattern) {
    const patternLabel = PATTERN_LABELS[settings.calculationPattern];
    if (patternLabel) {
      return `${patternLabel} (${grade})`;
    }
  }
  
  // 問題タイプによって適切なタイトルを生成
  if (settings.problemType === 'fraction') {
    return `分数の${getOperationName(settings.operation)} (${grade})`;
  } else if (settings.problemType === 'decimal') {
    return `小数の${getOperationName(settings.operation)} (${grade})`;
  } else if (settings.problemType === 'mixed') {
    return `帯分数の${getOperationName(settings.operation)} (${grade})`;
  }
  
  // デフォルトは演算名
  return `${getOperationName(settings.operation)} (${grade})`;
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