import React from 'react';
import type { WorksheetData } from '../../types';

interface MultiPrintButtonProps {
  id?: string;
  worksheets: WorksheetData[];
  showAnswers: boolean;
  onPrint: () => void;
}

export const MultiPrintButton: React.FC<MultiPrintButtonProps> = ({
  id,
  worksheets,
  showAnswers,
  onPrint,
}) => {
  const handleMultiPrint = (): void => {
    // 元のタイトルを保存
    const originalTitle = document.title;
    document.title = `計算プリント ${worksheets.length}枚`;

    // 印刷用コンテナを作成
    const printContainer = document.createElement('div');
    printContainer.id = 'multi-print-container';
    
    // 各ワークシートをレンダリング
    worksheets.forEach((worksheet, index) => {
      const pageDiv = document.createElement('div');
      if (index > 0) {
        pageDiv.style.pageBreakBefore = 'always';
      }
      pageDiv.style.minHeight = '100vh';
      pageDiv.style.position = 'relative';
      pageDiv.style.padding = '20mm';
      
      // ヘッダー部分
      const headerHTML = `
        <div style="border-bottom: 1px solid #ccc; padding-bottom: 12px; margin-bottom: 16px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 12px;">
            <div style="font-size: 14px;">
              名前：<span style="display: inline-block; width: 128px; border-bottom: 1px solid black; margin-left: 4px;"></span>
            </div>
            <div style="font-size: 14px; text-align: center;">
              ${worksheet.settings.grade}年生 ${getOperationName(worksheet.settings.operation)}
            </div>
            <div style="font-size: 14px; text-align: right;">
              点数：<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>点
            </div>
          </div>
        </div>
      `;
      
      // 問題部分
      let problemsHTML = '<div style="margin-top: 24px;">';
      const columns = worksheet.settings.layoutColumns || 2;
      const gridStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: 24px 32px;`;
      problemsHTML += `<div style="${gridStyle}">`;
      
      worksheet.problems.forEach((problem, pIndex) => {
        problemsHTML += `<div style="margin-bottom: 16px;">`;
        problemsHTML += `<div style="font-size: 12px; color: #666;">(${pIndex + 1})</div>`;
        problemsHTML += '<div style="font-family: monospace; font-size: 18px; margin-top: 4px;">';
        
        if (problem.type === 'basic') {
          const operand1 = problem.operand1 !== null ? problem.operand1 : '□';
          const operand2 = problem.operand2 !== null ? problem.operand2 : '□';
          const operator = getOperatorSymbol(problem.operation);
          
          problemsHTML += `${operand1} ${operator} ${operand2} = `;
          
          if (problem.missingPosition && problem.missingPosition !== 'answer') {
            problemsHTML += problem.answer;
          } else if (showAnswers && problem.answer !== null) {
            problemsHTML += `<span style="color: red; font-weight: bold;">${problem.answer}</span>`;
          } else {
            problemsHTML += '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
          }
        }
        
        problemsHTML += '</div></div>';
      });
      
      problemsHTML += '</div></div>';
      
      // フッター（答え表示時）
      let footerHTML = '';
      if (showAnswers) {
        footerHTML = `
          <div style="margin-top: 32px; padding-top: 16px; border-top: 2px solid #ccc;">
            <h3 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">答え</h3>
            <p style="font-size: 14px; color: #666;">
              ページ ${index + 1} / ${worksheets.length}
            </p>
          </div>
        `;
      }
      
      pageDiv.innerHTML = headerHTML + problemsHTML + footerHTML;
      printContainer.appendChild(pageDiv);
    });
    
    // スタイルを追加
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
        }
        #multi-print-container {
          width: 100%;
        }
      }
    `;
    document.head.appendChild(styleEl);
    
    // 既存の要素を非表示
    const allElements = document.body.querySelectorAll('body > *');
    allElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // 印刷用コンテナを追加
    document.body.appendChild(printContainer);
    
    // 印刷
    window.print();
    
    // 元に戻す
    allElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });
    
    // クリーンアップ
    printContainer.remove();
    styleEl.remove();
    document.title = originalTitle;
    
    // コールバック
    onPrint();
  };

  return (
    <button
      id={id}
      onClick={handleMultiPrint}
      className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      印刷する
    </button>
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

function getOperatorSymbol(operation: string): string {
  switch (operation) {
    case 'addition':
      return '+';
    case 'subtraction':
      return '-';
    case 'multiplication':
      return '×';
    case 'division':
      return '÷';
    default:
      return '';
  }
}