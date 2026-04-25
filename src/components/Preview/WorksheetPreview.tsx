import React, { useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import type { WorksheetData } from '../../types';
import { ProblemList } from './ProblemList';
import { MultiPagePrintDialog } from './MultiPagePrintDialog';
import { useProblemStore } from '../../stores/problemStore';
import { buildPreviewTitle } from '../../lib/utils/previewTitle';

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
  const [isPrinting, setIsPrinting] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);
  const buildWorksheetBatch = useProblemStore(
    (state) => state.buildWorksheetBatch
  );

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: worksheetData
      ? `計算プリント_${worksheetData.settings.grade}年生`
      : '計算プリント',
    onBeforePrint: async () => {
      flushSync(() => setIsPrinting(true));
    },
    onAfterPrint: () => {
      // 印刷後に複数ページの状態をクリア
      setMultiPageWorksheets([]);
      setIsPrinting(false);
    },
  });

  const handleMultiPagePrint = useCallback(
    async (pageCount: number) => {
      if (!worksheetData) return;

      // 複数ページ分のワークシートを生成
      const worksheets = buildWorksheetBatch(pageCount, worksheetData);
      setMultiPageWorksheets(worksheets);
      setIsMultiPageDialogOpen(false);
      await Promise.resolve(handlePrint());
    },
    [worksheetData, buildWorksheetBatch, handlePrint]
  );
  if (!worksheetData) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-3xl border border-dashed border-sky-200/80 bg-white/70 p-8 text-sky-700 shadow-inner backdrop-blur">
        <div className="text-center space-y-3">
          <div className="text-6xl">📝</div>
          <div>
            <h3 className="text-lg font-semibold">問題プレビューエリア</h3>
            <p className="mt-2 text-sm text-slate-600">
              左側の設定で「生成」すると、ここに出来上がったプリントが表示されます。
            </p>
          </div>
          <p className="text-xs text-slate-500">
            学年・問題数・レイアウトを選んで、ぴったりのプリントを作りましょう。
          </p>
        </div>
      </div>
    );
  }

  const { settings, problems, generatedAt } = worksheetData;

  const worksheetsToDisplay =
    multiPageWorksheets.length > 0 ? multiPageWorksheets : [worksheetData];

  return (
    <>
      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white/85 shadow-xl backdrop-blur">
        {/* Worksheet Header */}
        <div className="no-print border-b border-sky-100 bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              問題プレビュー - {buildPreviewTitle({ settings })}
            </h2>
            <div className="text-sm text-slate-500">
              {settings.problemType === 'number-tracing'
                ? `${problems.length}問 • 0〜4 / 5〜9 の左右レイアウト`
                : `${problems.length}問 • ${settings.layoutColumns}列レイアウト`}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
            <span>生成日時: {formatDate(generatedAt)}</span>
            {showAnswers && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 shadow-sm">
                解答表示中
              </span>
            )}
          </div>
        </div>

        {/* Printable worksheet content */}
        <div ref={printRef} data-print-area style={{ background: 'white' }}>
          {/* プレビュー表示: 最初のページのみ */}
          {!isPrinting && (
            <ProblemList
              problems={worksheetData.problems}
              layoutColumns={worksheetData.settings.layoutColumns}
              showAnswers={showAnswers}
              settings={worksheetData.settings}
              printMode={false}
            />
          )}

          {/* 印刷用: 全ページ（画面には表示されない） */}
          {isPrinting &&
            worksheetsToDisplay.map((worksheet, index) => (
              <div
                key={index}
                style={{
                  pageBreakAfter:
                    index < worksheetsToDisplay.length - 1 ? 'always' : 'auto',
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
        <div className="no-print p-6 pt-0">
          <button
            onClick={() => setIsMultiPageDialogOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-white shadow-lg transition-colors hover:bg-emerald-600"
          >
            <svg
              className="h-5 w-5"
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
            印刷（複数ページにも対応）
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
