import React from 'react';

interface WorksheetHeaderProps {
  title?: string;
  studentName?: string;
  date?: string;
  generatedAt?: Date;
  grade: number;
  operation: string;
  calculationPattern?: string;
}

export const WorksheetHeader: React.FC<WorksheetHeaderProps> = ({
  date,
  grade,
  operation,
  calculationPattern,
}) => {
  const getOperationName = (op: string, pattern?: string): string => {
    // 混合パターンの場合は特別な表示
    if (
      pattern === 'add-sub-mixed-basic' ||
      pattern === 'add-sub-double-mixed'
    ) {
      return 'たし算・ひき算';
    }

    switch (op) {
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
  };

  return (
    <div className="border-b border-gray-200 pb-3 mb-4">
      <div className="grid grid-cols-3 gap-4 mb-3">
        <div className="text-sm flex items-baseline">
          名前：
          <span
            className="inline-block w-32 border-b border-black mx-1"
            style={{ height: '1.2rem' }}
          />
        </div>
        <div className="text-sm text-center">
          {grade}年生 {getOperationName(operation, calculationPattern)}
        </div>
        <div className="text-sm text-right flex items-baseline justify-end">
          点数：
          <span
            className="inline-block w-16 border-b border-black mx-1"
            style={{ height: '1.2rem' }}
          />
          点
        </div>
      </div>
      {date && (
        <div className="text-xs text-gray-600 text-right">日付: {date}</div>
      )}
    </div>
  );
};
