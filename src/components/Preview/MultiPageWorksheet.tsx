import React from 'react';
import type { WorksheetData } from '../../types';
import { WorksheetHeader } from './WorksheetHeader';
import { ProblemList } from './ProblemList';

interface MultiPageWorksheetProps {
  worksheets: WorksheetData[];
  showAnswers: boolean;
}

export const MultiPageWorksheet: React.FC<MultiPageWorksheetProps> = ({
  worksheets,
  showAnswers,
}) => {
  return (
    <div id="multi-page-print" className="print-only">
      {worksheets.map((worksheet, index) => (
        <div
          key={index}
          className={index > 0 ? 'page-break-before' : ''}
          style={{ pageBreakBefore: index > 0 ? 'always' : 'auto' }}
        >
          <div className="bg-white p-8 max-w-4xl mx-auto">
            <WorksheetHeader
              title={worksheet.settings.title}
              studentName={worksheet.settings.studentName}
              date={worksheet.settings.date}
              generatedAt={worksheet.generatedAt}
              grade={worksheet.settings.grade}
              operation={worksheet.settings.operation}
            />
            
            <div className="mt-6">
              <ProblemList
                problems={worksheet.problems}
                layoutColumns={worksheet.settings.layoutColumns}
                showAnswers={showAnswers}
              />
            </div>
            
            {showAnswers && (
              <div className="mt-8 pt-4 border-t-2 border-gray-300">
                <h3 className="text-lg font-bold mb-2">答え</h3>
                <p className="text-sm text-gray-600">
                  ページ {index + 1} / {worksheets.length}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};