import React from 'react';
import type { WorksheetData, BasicProblem } from '../../types';

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
      
      // 文章問題の場合は間隔を調整
      const hasWordProblems = worksheet.problems.some(p => p.type === 'word');
      const rowGap = hasWordProblems ? '12px' : '24px';
      const colGap = hasWordProblems ? '20px' : '32px';
      const gridStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${rowGap} ${colGap};`;
      problemsHTML += `<div style="${gridStyle}">`;
      
      // 縦順に並び替えた問題配列を作成
      const reorderedProblems: (typeof worksheet.problems[0] | null)[] = [];
      const rowCount = Math.ceil(worksheet.problems.length / columns);
      
      for (let col = 0; col < columns; col++) {
        for (let row = 0; row < rowCount; row++) {
          const originalIndex = row + col * rowCount;
          const newIndex = row * columns + col;
          
          if (originalIndex < worksheet.problems.length) {
            reorderedProblems[newIndex] = worksheet.problems[originalIndex];
          } else {
            reorderedProblems[newIndex] = null;
          }
        }
      }
      
      reorderedProblems.forEach((problem, index) => {
        if (!problem) {
          const marginBottom = hasWordProblems ? '8px' : '16px';
          problemsHTML += `<div style="margin-bottom: ${marginBottom};"></div>`;
          return;
        }
        
        // 元のインデックスを計算（縦順の番号）
        const col = index % columns;
        const row = Math.floor(index / columns);
        const originalNumber = col * rowCount + row + 1;
        
        const marginBottom = hasWordProblems ? '8px' : '16px';
        problemsHTML += `<div style="margin-bottom: ${marginBottom};">`;
        problemsHTML += `<div style="font-size: 12px; color: #666;">(${originalNumber})</div>`;
        
        const fontSize = (problem.type === 'word') ? '16px' : '18px';
        problemsHTML += `<div style="font-family: monospace; font-size: ${fontSize}; margin-top: 4px;">`;
        
        if (problem.type === 'word') {
          // 文章問題の表示 - よりコンパクトに
          problemsHTML += `<div style="font-size: 12px; line-height: 1.3;">`;
          problemsHTML += problem.problemText;
          problemsHTML += '</div>';
          problemsHTML += '<div style="margin-top: 6px;">';
          if (showAnswers) {
            problemsHTML += `<span style="color: red; font-weight: bold;">答え: ${problem.answer}`;
            if (problem.unit) {
              problemsHTML += problem.unit;
            }
            problemsHTML += '</span>';
          } else {
            problemsHTML += '答え: <span style="display: inline-block; width: 96px; border-bottom: 1px solid black; margin: 0 4px;"></span>';
            if (problem.unit) {
              problemsHTML += `<span style="font-size: 14px;">${problem.unit}</span>`;
            }
          }
          problemsHTML += '</div>';
        } else if (problem.type === 'basic') {
          const operator = getOperatorSymbol(problem.operation);
          
          // operand1の表示
          if (problem.operand1 !== null) {
            problemsHTML += problem.operand1;
          } else if (showAnswers) {
            const missingOperand1 = calculateMissingOperand1(problem);
            problemsHTML += `<span style="color: red; font-weight: bold;">${missingOperand1}</span>`;
          } else {
            problemsHTML += '<span style="display: inline-block; width: 32px; height: 32px; border: 2px solid #333; background-color: #f9f9f9; vertical-align: middle;"></span>';
          }
          
          problemsHTML += ` ${operator} `;
          
          // operand2の表示
          if (problem.operand2 !== null) {
            problemsHTML += problem.operand2;
          } else if (showAnswers) {
            const missingOperand2 = calculateMissingOperand2(problem);
            problemsHTML += `<span style="color: red; font-weight: bold;">${missingOperand2}</span>`;
          } else {
            problemsHTML += '<span style="display: inline-block; width: 32px; height: 32px; border: 2px solid #333; background-color: #f9f9f9; vertical-align: middle;"></span>';
          }
          
          problemsHTML += ' = ';
          
          // 答えの表示
          if (problem.missingPosition === 'answer') {
            // 虫食い算で答えが空欄の場合
            if (showAnswers) {
              const calculatedAnswer = calculateMissingAnswer(problem);
              problemsHTML += `<span style="color: red; font-weight: bold;">${calculatedAnswer}</span>`;
            } else {
              problemsHTML += '<span style="display: inline-block; width: 32px; height: 32px; border: 2px solid #333; background-color: #f9f9f9; vertical-align: middle;"></span>';
            }
          } else if (showAnswers && problem.missingPosition) {
            // 虫食い算で答えの位置が空欄でない場合、通常の色で答えを表示
            problemsHTML += `<span style="font-family: monospace; font-size: 18px;">${problem.answer}</span>`;
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

function calculateMissingOperand1(problem: BasicProblem): string {
  // operand1が空欄の虫食い算の場合、答えとoperand2から逆算
  if (problem.answer !== null && problem.operand2 !== null) {
    switch (problem.operation) {
      case 'addition':
        return (problem.answer - problem.operand2).toString();
      case 'subtraction':
        return (problem.answer + problem.operand2).toString();
      case 'multiplication':
        return (problem.answer / problem.operand2).toString();
      case 'division':
        return (problem.answer * problem.operand2).toString();
    }
  }
  return '';
}

function calculateMissingOperand2(problem: BasicProblem): string {
  // operand2が空欄の虫食い算の場合、答えとoperand1から逆算
  if (problem.answer !== null && problem.operand1 !== null) {
    switch (problem.operation) {
      case 'addition':
        return (problem.answer - problem.operand1).toString();
      case 'subtraction':
        return (problem.operand1 - problem.answer).toString();
      case 'multiplication':
        return (problem.answer / problem.operand1).toString();
      case 'division':
        return (problem.operand1 / problem.answer).toString();
    }
  }
  return '';
}

function calculateMissingAnswer(problem: BasicProblem): string {
  // 虫食い算で答えが空欄の場合、operand1とoperand2から答えを計算
  if (problem.operand1 !== null && problem.operand2 !== null) {
    switch (problem.operation) {
      case 'addition':
        return (problem.operand1 + problem.operand2).toString();
      case 'subtraction':
        return (problem.operand1 - problem.operand2).toString();
      case 'multiplication':
        return (problem.operand1 * problem.operand2).toString();
      case 'division': {
        const quotient = Math.floor(problem.operand1 / problem.operand2);
        const remainder = problem.operand1 % problem.operand2;
        if (remainder === 0) {
          return quotient.toString();
        } else {
          return `${quotient}あまり${remainder}`;
        }
      }
    }
  }
  
  // fallback
  if (problem.answer !== null) {
    return problem.answer.toString();
  }
  
  return '';
}

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