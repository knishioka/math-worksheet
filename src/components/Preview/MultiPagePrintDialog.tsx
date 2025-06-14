import React, { useState } from 'react';
import type { WorksheetSettings } from '../../types';

interface MultiPagePrintDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: (pageCount: number) => void;
  settings: WorksheetSettings;
}

export const MultiPagePrintDialog: React.FC<MultiPagePrintDialogProps> = ({
  isOpen,
  onClose,
  onPrint,
  settings,
}) => {
  const [pageCount, setPageCount] = useState(5);

  if (!isOpen) return null;

  const handlePrint = () => {
    onPrint(pageCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">複数枚印刷</h2>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            同じ設定で異なる問題を複数枚生成して印刷します。
          </p>
          <p className="text-sm text-gray-500">
            現在の設定: {settings.grade}年生 / {settings.problemCount}問
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            印刷枚数
          </label>
          <div className="flex items-center space-x-4">
            <input
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
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            印刷する
          </button>
        </div>
      </div>
    </div>
  );
};