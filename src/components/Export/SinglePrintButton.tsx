import React from 'react';
import type { WorksheetData, BasicProblem } from '../../types';

interface SinglePrintButtonProps {
  id?: string;
  worksheet: WorksheetData;
  showAnswers: boolean;
  onPrint?: () => void;
}

export const SinglePrintButton: React.FC<SinglePrintButtonProps> = ({
  id,
  worksheet,
  showAnswers,
  onPrint,
}) => {
  const handleSinglePrint = (): void => {
    // 元のタイトルを保存
    const originalTitle = document.title;
    document.title = `${worksheet.settings.grade}年生 ${getOperationName(worksheet.settings.operation, worksheet.settings.calculationPattern)}プリント`;

    // 印刷用コンテナを作成
    const printContainer = document.createElement('div');
    printContainer.id = 'single-print-container';
    
    // ページ全体のスタイル設定
    const pageDiv = document.createElement('div');
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
            ${worksheet.settings.grade}年生 ${getOperationName(worksheet.settings.operation, worksheet.settings.calculationPattern)}
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
    
    // 文章問題や虫食い算の場合は間隔を調整
    const hasWordProblems = worksheet.problems.some(p => p.type === 'word');
    const hasMissingNumbers = worksheet.problems.some(p => p.type === 'basic' && p.missingPosition);
    const rowGap = hasWordProblems ? '12px' : hasMissingNumbers ? '18px' : '24px';
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
        const marginBottom = hasWordProblems ? '8px' : hasMissingNumbers ? '12px' : '16px';
        problemsHTML += `<div style="margin-bottom: ${marginBottom};"></div>`;
        return;
      }
      
      // 元のインデックスを計算（縦順の番号）
      const col = index % columns;
      const row = Math.floor(index / columns);
      const originalNumber = col * rowCount + row + 1;
      
      const marginBottom = hasWordProblems ? '8px' : hasMissingNumbers ? '12px' : '16px';
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
      } else if (problem.type === 'fraction') {
        // 分数問題の表示
        const operator = getOperatorSymbol(problem.operation);
        problemsHTML += `<span style="display: inline-block; text-align: center; vertical-align: middle;">`;
        problemsHTML += `<span style="display: block; border-bottom: 1px solid black; padding: 0 4px;">${problem.numerator1}</span>`;
        problemsHTML += `<span style="display: block; padding: 0 4px;">${problem.denominator1}</span>`;
        problemsHTML += `</span>`;
        problemsHTML += ` ${operator} `;
        
        if (problem.numerator2 !== undefined && problem.denominator2 !== undefined) {
          problemsHTML += `<span style="display: inline-block; text-align: center; vertical-align: middle;">`;
          problemsHTML += `<span style="display: block; border-bottom: 1px solid black; padding: 0 4px;">${problem.numerator2}</span>`;
          problemsHTML += `<span style="display: block; padding: 0 4px;">${problem.denominator2}</span>`;
          problemsHTML += `</span>`;
        }
        
        problemsHTML += ' = ';
        
        if (showAnswers) {
          problemsHTML += `<span style="color: red; font-weight: bold; display: inline-block; text-align: center; vertical-align: middle;">`;
          problemsHTML += `<span style="display: block; border-bottom: 1px solid red; padding: 0 4px;">${problem.answerNumerator}</span>`;
          problemsHTML += `<span style="display: block; padding: 0 4px;">${problem.answerDenominator}</span>`;
          problemsHTML += `</span>`;
        } else {
          problemsHTML += '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
        }
      } else if (problem.type === 'basic') {
        const basicProblem = problem as BasicProblem;
        const operator = getOperatorSymbol(problem.operation);
        
        // operand1の表示
        if (basicProblem.operand1 !== null) {
          problemsHTML += basicProblem.operand1;
        } else if (showAnswers) {
          const missingOperand1 = calculateMissingOperand1(basicProblem);
          problemsHTML += `<span style="color: red; font-weight: bold;">${missingOperand1}</span>`;
        } else {
          problemsHTML += '<span style="display: inline-block; width: 24px; height: 24px; border: 1.5px solid #333; background-color: #f9f9f9; vertical-align: text-bottom;"></span>';
        }
        
        problemsHTML += ` ${operator} `;
        
        // operand2の表示
        if (basicProblem.operand2 !== null) {
          problemsHTML += basicProblem.operand2;
        } else if (showAnswers) {
          const missingOperand2 = calculateMissingOperand2(basicProblem);
          problemsHTML += `<span style="color: red; font-weight: bold;">${missingOperand2}</span>`;
        } else {
          problemsHTML += '<span style="display: inline-block; width: 24px; height: 24px; border: 1.5px solid #333; background-color: #f9f9f9; vertical-align: text-bottom;"></span>';
        }
        
        problemsHTML += ' = ';
        
        // 答えの表示
        if (basicProblem.missingPosition === 'answer') {
          // 虫食い算で答えが空欄の場合
          if (showAnswers) {
            const calculatedAnswer = calculateMissingAnswer(basicProblem);
            problemsHTML += `<span style="color: red; font-weight: bold;">${calculatedAnswer}</span>`;
          } else {
            problemsHTML += '<span style="display: inline-block; width: 24px; height: 24px; border: 1.5px solid #333; background-color: #f9f9f9; vertical-align: text-bottom;"></span>';
          }
        } else if (showAnswers && basicProblem.missingPosition) {
          // 虫食い算で答えの位置が空欄でない場合、通常の色で答えを表示
          problemsHTML += `<span style="font-family: monospace; font-size: 18px;">${basicProblem.answer}</span>`;
        } else if (showAnswers && basicProblem.answer !== null) {
          problemsHTML += `<span style="color: red; font-weight: bold;">${basicProblem.answer}</span>`;
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
        </div>
      `;
    }
    
    pageDiv.innerHTML = headerHTML + problemsHTML + footerHTML;
    printContainer.appendChild(pageDiv);
    
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
        #single-print-container {
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
    if (onPrint) {
      onPrint();
    }
  };

  return (
    <button
      id={id}
      onClick={handleSinglePrint}
      className="w-full px-4 py-2 text-sm font-medium rounded-md border bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
    >
      <div className="flex items-center justify-center">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
          />
        </svg>
        印刷
      </div>
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

function getOperationName(operation: string, calculationPattern?: string): string {
  // 混合パターンの場合は特別な表示
  if (calculationPattern === 'add-sub-mixed-basic' || calculationPattern === 'add-sub-double-mixed') {
    return 'たし算・ひき算';
  }

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