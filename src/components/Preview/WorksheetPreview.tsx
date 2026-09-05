import React, { useState, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useReactToPrint } from 'react-to-print';
import type { WorksheetData } from '../../types';
import { ProblemList } from './ProblemList';
import { MultiPagePrintDialog } from './MultiPagePrintDialog';
import { ResponsiveSheet } from './ResponsiveSheet';
import { useProblemStore } from '../../stores/problemStore';
import { buildPreviewTitle } from '../../lib/utils/previewTitle';
import {
  findOverflowingSheets,
  withPrintMediaStyles,
} from '../../lib/utils/a4-overflow';

/** 印刷前ガードでユーザーが印刷を中止したことを示すエラーメッセージ */
const PRINT_CANCELLED_BY_OVERFLOW_GUARD = 'print-cancelled-a4-overflow';

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

      // 印刷直前ガード: 描画済みの全ページを実測し、A4を超えるページが
      // あればユーザーに確認する。気づかずに印刷して紙を無駄にする事故を防ぐ。
      // この時点では印刷メディアが未適用のため、@media print のスタイルを
      // 一時適用した状態で計測する（画面用CSSでの誤検知を防ぐ）。
      const printArea = printRef.current;
      if (printArea) {
        // 印刷時に非表示になる画面の祖先から切り離し、実寸で計測する。
        const measurementCopy = printArea.cloneNode(true) as HTMLElement;
        Object.assign(measurementCopy.style, {
          position: 'absolute',
          left: '-10000px',
          top: '0',
          width: '210mm',
          visibility: 'hidden',
        });
        document.body.appendChild(measurementCopy);
        let overflowing;
        try {
          overflowing = withPrintMediaStyles(() =>
            findOverflowingSheets(measurementCopy)
          );
        } finally {
          measurementCopy.remove();
        }
        if (overflowing.length > 0) {
          const worstHeightMm = Math.max(
            ...overflowing.map((result) => result.heightMm)
          );
          const proceed = window.confirm(
            `${overflowing.length}ページがA4サイズ（297mm）を超えています（最大 ${Math.round(worstHeightMm)}mm）。\n` +
              'このまま印刷すると問題がはみ出します。\n\n' +
              '印刷を続けますか？（キャンセルして問題を再生成するか、問題数を減らすことをおすすめします）'
          );
          if (!proceed) {
            setMultiPageWorksheets([]);
            setIsPrinting(false);
            // rejectすることで react-to-print が印刷処理を中断する
            throw new Error(PRINT_CANCELLED_BY_OVERFLOW_GUARD);
          }
        }
      }
    },
    onPrintError: (_errorLocation, error) => {
      if (error.message !== PRINT_CANCELLED_BY_OVERFLOW_GUARD) {
        console.error('[WorksheetPreview] 印刷エラー:', error);
      }
      setMultiPageWorksheets([]);
      setIsPrinting(false);
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
              教材を選ぶと、ここにプリントが自動で表示されます。
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
      <div className="preview-card">
        {/* Worksheet Header */}
        <div className="no-print preview-toolbar">
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
            <button
              type="button"
              className="print-button"
              onClick={() => setIsMultiPageDialogOpen(true)}
            >
              印刷（複数ページにも対応）
            </button>
            <span>生成日時: {formatDate(generatedAt)}</span>
            {showAnswers && (
              <span className="rounded-full bg-rose-100 px-3 py-1 text-rose-700 shadow-sm">
                解答表示中
              </span>
            )}
          </div>
        </div>

        {/* Printable worksheet content */}
        <ResponsiveSheet>
          <div
            ref={printRef}
            data-print-area
            lang="ja"
            style={{ background: 'white' }}
          >
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
                      index < worksheetsToDisplay.length - 1
                        ? 'always'
                        : 'auto',
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
        </ResponsiveSheet>
      </div>

      {/* Multi-page print dialog */}
      <MultiPagePrintDialog
        isOpen={isMultiPageDialogOpen}
        onClose={() => setIsMultiPageDialogOpen(false)}
        onPrint={handleMultiPagePrint}
        settings={settings}
        showAnswers={showAnswers}
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
