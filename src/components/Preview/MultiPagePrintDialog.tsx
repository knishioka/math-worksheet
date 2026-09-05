import React, { useState, useEffect, useRef } from 'react';
import type { WorksheetSettings } from '../../types';

interface MultiPagePrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (pageCount: number) => void | Promise<void>;
  settings: WorksheetSettings;
  showAnswers?: boolean;
}

export const MultiPagePrintDialog: React.FC<MultiPagePrintDialogProps> = ({
  isOpen,
  onClose,
  onPrint,
  settings,
  showAnswers = false,
}) => {
  const [pageCount, setPageCount] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus();
    return (): void => previous?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = async (): Promise<void> => {
    await onPrint(pageCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-dialog-title"
        className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full mx-4"
        onKeyDown={(event) => {
          if (event.key === 'Escape') onClose();
          if (event.key !== 'Tab') return;
          const elements =
            dialogRef.current?.querySelectorAll<HTMLElement>('input, button');
          if (!elements?.length) return;
          const first = elements[0],
            last = elements[elements.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
          if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }}
      >
        <h2 id="print-dialog-title" className="text-xl font-bold mb-4">
          複数枚印刷
        </h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            同じ設定で異なる問題を複数枚生成して印刷します。
          </p>
          <p className="text-sm text-gray-500">
            現在の設定: {settings.grade}年生 / {settings.problemCount}問
          </p>
          <p className="mt-3 rounded-lg bg-stone-100 p-3 text-sm font-medium">
            {showAnswers ? '解答付きで印刷します' : '問題のみを印刷します'} ·
            A4たて
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="print-page-count"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            印刷枚数
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="print-page-count"
              type="range"
              min="1"
              max="20"
              value={pageCount}
              onChange={(e) => setPageCount(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold w-12 text-center">
              {pageCount}枚
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1枚</span>
            <span>20枚</span>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            キャンセル
          </button>
          <button onClick={handlePrint} className="print-button">
            印刷する
          </button>
        </div>
      </div>
    </div>
  );
};
