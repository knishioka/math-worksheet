import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import type { WorksheetData, WorksheetSettings } from '../../types';
import { ProblemList } from './ProblemList';
import { MultiPagePrintDialog } from './MultiPagePrintDialog';
import { generateProblems } from '../../lib/generators';
import { PATTERN_LABELS } from '../../types/calculation-patterns';
import { getOperationName } from '../../lib/utils/formatting';

interface WorksheetPreviewProps {
  worksheetData?: WorksheetData;
  showAnswers?: boolean;
}

export const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({
  worksheetData,
  showAnswers = false,
}) => {
  const [isMultiPageDialogOpen, setIsMultiPageDialogOpen] = useState(false);
  const [multiPageWorksheets, setMultiPageWorksheets] = useState<
    WorksheetData[]
  >([]);
  const [shouldPrint, setShouldPrint] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: worksheetData
      ? `計算プリント_${worksheetData.settings.grade}年生`
      : '計算プリント',
    onAfterPrint: () => {
      // 印刷後に複数ページの状態をクリア
      setMultiPageWorksheets([]);
      setShouldPrint(false);
    },
  });

  // 複数ページのワークシートが生成されたら印刷を実行
  useEffect(() => {
    if (shouldPrint && multiPageWorksheets.length > 0 && printRef.current) {
      // DOMが更新されるまで少し待つ
      const timer = setTimeout(() => {
        handlePrint();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [shouldPrint, multiPageWorksheets.length, handlePrint]);

  const handleMultiPagePrint = useCallback(
    (pageCount: number) => {
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
      setShouldPrint(true);
    },
    [worksheetData]
  );
  if (!worksheetData) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 min-h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium mb-2">問題プレビューエリア</h3>
          <p className="text-sm">
            左側の設定で問題を生成すると、ここに問題プレビューが表示されます
          </p>
        </div>
      </div>
    );
  }

  const { settings, problems, generatedAt } = worksheetData;

  const worksheetsToDisplay = multiPageWorksheets.length > 0 ? multiPageWorksheets : [worksheetData];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Worksheet Header */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 no-print">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-black">
              問題プレビュー - {getPreviewTitle(settings)}
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
        <div ref={printRef} style={{ background: 'white' }}>
          {/* プレビュー表示: 最初のページのみ */}
          {!shouldPrint && (
            <ProblemList
              problems={worksheetData.problems}
              layoutColumns={worksheetData.settings.layoutColumns}
              showAnswers={showAnswers}
              settings={worksheetData.settings}
              printMode={false}
            />
          )}

          {/* 印刷用: 全ページ（画面には表示されない） */}
          {shouldPrint && worksheetsToDisplay.map((worksheet, index) => (
            <div
              key={index}
              style={{
                pageBreakAfter: index < worksheetsToDisplay.length - 1 ? 'always' : 'auto',
              }}
            >
              <ProblemList
                problems={worksheet.problems}
                layoutColumns={worksheet.settings.layoutColumns}
                showAnswers={showAnswers}
                settings={worksheet.settings}
                printMode={true}
              />
            </div>
          ))}
        </div>

        {/* Print Button - Below problems */}
        <div className="p-6 pt-0 no-print">
          <button
            onClick={() => setIsMultiPageDialogOpen(true)}
            className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            印刷
          </button>
        </div>
      </div>

      {/* Multi-page print dialog */}
      <MultiPagePrintDialog
        isOpen={isMultiPageDialogOpen}
        onClose={() => setIsMultiPageDialogOpen(false)}
        onPrint={handleMultiPagePrint}
        settings={settings}
      />
    </>
  );
};

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
    return `分数の${getOperationName(settings.operation, settings.calculationPattern)} (${grade})`;
  } else if (settings.problemType === 'decimal') {
    return `小数の${getOperationName(settings.operation, settings.calculationPattern)} (${grade})`;
  } else if (settings.problemType === 'mixed') {
    return `帯分数の${getOperationName(settings.operation, settings.calculationPattern)} (${grade})`;
  }

  // デフォルトは演算名
  return `${getOperationName(settings.operation, settings.calculationPattern)} (${grade})`;
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
