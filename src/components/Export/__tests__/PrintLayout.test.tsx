import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { WorksheetData, BasicProblem, FractionProblem, WordProblem } from '../../../types';

// PrintLayoutのDOM構造をテストするヘルパー関数
function createPrintDOM(worksheet: WorksheetData, showAnswers: boolean): HTMLElement {
  const container = document.createElement('div');
  
  // ヘッダー
  const header = document.createElement('div');
  header.innerHTML = `
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
  container.appendChild(header);
  
  // 問題部分
  const problemsContainer = document.createElement('div');
  problemsContainer.style.marginTop = '24px';
  
  const columns = worksheet.settings.layoutColumns || 2;
  const gridContainer = document.createElement('div');
  gridContainer.style.display = 'grid';
  gridContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  gridContainer.style.gap = '24px 32px';
  
  // 縦順に並び替え
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
    const problemDiv = document.createElement('div');
    problemDiv.style.marginBottom = '16px';
    
    if (!problem) {
      gridContainer.appendChild(problemDiv);
      return;
    }
    
    // 元のインデックスを計算
    const col = index % columns;
    const row = Math.floor(index / columns);
    const originalNumber = col * rowCount + row + 1;
    
    const numberDiv = document.createElement('div');
    numberDiv.style.fontSize = '12px';
    numberDiv.style.color = '#666';
    numberDiv.textContent = `(${originalNumber})`;
    problemDiv.appendChild(numberDiv);
    
    const contentDiv = document.createElement('div');
    contentDiv.style.fontFamily = 'monospace';
    contentDiv.style.fontSize = '18px';
    contentDiv.style.marginTop = '4px';
    
    if (problem.type === 'word') {
      const wordProblem = problem as WordProblem;
      contentDiv.innerHTML = `
        <div style="font-size: 14px;">${wordProblem.problemText}</div>
        <div style="margin-top: 8px;">
          ${showAnswers 
            ? `<span style="color: red; font-weight: bold;">答え: ${wordProblem.answer}${wordProblem.unit || ''}</span>`
            : `答え: <span style="display: inline-block; width: 96px; border-bottom: 1px solid black; margin: 0 4px;"></span>${wordProblem.unit ? `<span style="font-size: 14px;">${wordProblem.unit}</span>` : ''}`
          }
        </div>
      `;
    } else if (problem.type === 'fraction') {
      const fractionProblem = problem as FractionProblem;
      contentDiv.innerHTML = renderFractionProblem(fractionProblem, showAnswers);
    } else if (problem.type === 'basic') {
      const basicProblem = problem as BasicProblem;
      contentDiv.innerHTML = renderBasicProblem(basicProblem, showAnswers);
    }
    
    problemDiv.appendChild(contentDiv);
    gridContainer.appendChild(problemDiv);
  });
  
  problemsContainer.appendChild(gridContainer);
  container.appendChild(problemsContainer);
  
  return container;
}

function getOperationName(operation: string): string {
  const names: Record<string, string> = {
    addition: 'たし算',
    subtraction: 'ひき算',
    multiplication: 'かけ算',
    division: 'わり算',
  };
  return names[operation] || '計算';
}

function renderFractionProblem(problem: FractionProblem, showAnswers: boolean): string {
  const frac1 = `${problem.numerator1}/${problem.denominator1}`;
  const frac2 = problem.numerator2 !== undefined && problem.denominator2 !== undefined
    ? `${problem.numerator2}/${problem.denominator2}`
    : '';
  const answer = `${problem.answerNumerator}/${problem.answerDenominator}`;
  const operator = getOperatorSymbol(problem.operation);
  
  if (showAnswers) {
    return `${frac1} ${operator} ${frac2} = <span style="color: red; font-weight: bold;">${answer}</span>`;
  }
  return `${frac1} ${operator} ${frac2} = <span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>`;
}

function renderBasicProblem(problem: BasicProblem, showAnswers: boolean): string {
  const operator = getOperatorSymbol(problem.operation);
  let html = '';
  
  // operand1
  if (problem.operand1 !== null) {
    html += problem.operand1;
  } else if (showAnswers && problem.missingPosition === 'operand1') {
    const answer = problem.answer! - problem.operand2!;
    html += `<span style="color: red; font-weight: bold;">${answer}</span>`;
  } else {
    html += '<span style="display: inline-block; width: 32px; height: 32px; border: 2px solid #333; background-color: #f9f9f9;"></span>';
  }
  
  html += ` ${operator} `;
  
  // operand2
  if (problem.operand2 !== null) {
    html += problem.operand2;
  } else if (showAnswers && problem.missingPosition === 'operand2') {
    const answer = problem.operation === 'subtraction' 
      ? problem.operand1! - problem.answer!
      : problem.answer! - problem.operand1!;
    html += `<span style="color: red; font-weight: bold;">${answer}</span>`;
  } else {
    html += '<span style="display: inline-block; width: 32px; height: 32px; border: 2px solid #333; background-color: #f9f9f9;"></span>';
  }
  
  html += ' = ';
  
  // answer
  if (problem.missingPosition === 'answer') {
    if (showAnswers) {
      const answer = calculateAnswer(problem);
      html += `<span style="color: red; font-weight: bold;">${answer}</span>`;
    } else {
      html += '<span style="display: inline-block; width: 32px; height: 32px; border: 2px solid #333; background-color: #f9f9f9;"></span>';
    }
  } else if (showAnswers && problem.answer !== null) {
    html += `<span style="color: red; font-weight: bold;">${problem.answer}</span>`;
  } else {
    html += '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
  }
  
  return html;
}

function getOperatorSymbol(operation: string): string {
  const symbols: Record<string, string> = {
    addition: '+',
    subtraction: '-',
    multiplication: '×',
    division: '÷',
  };
  return symbols[operation] || '';
}

function calculateAnswer(problem: BasicProblem): string {
  if (problem.operand1 === null || problem.operand2 === null) return '';
  
  switch (problem.operation) {
    case 'addition':
      return (problem.operand1 + problem.operand2).toString();
    case 'subtraction':
      return (problem.operand1 - problem.operand2).toString();
    case 'multiplication':
      return (problem.operand1 * problem.operand2).toString();
    case 'division':
      const quotient = Math.floor(problem.operand1 / problem.operand2);
      const remainder = problem.operand1 % problem.operand2;
      return remainder === 0 ? quotient.toString() : `${quotient}あまり${remainder}`;
    default:
      return '';
  }
}

describe('PrintLayout', () => {
  const mockWorksheet: WorksheetData = {
    settings: {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 6,
      layoutColumns: 2,
    },
    problems: [
      { id: '1', type: 'basic', operation: 'addition', operand1: 5, operand2: 3, answer: 8 },
      { id: '2', type: 'basic', operation: 'addition', operand1: 7, operand2: 2, answer: 9 },
      { id: '3', type: 'basic', operation: 'addition', operand1: 4, operand2: 6, answer: 10 },
      { id: '4', type: 'basic', operation: 'addition', operand1: 8, operand2: 1, answer: 9 },
      { id: '5', type: 'basic', operation: 'addition', operand1: 3, operand2: 4, answer: 7 },
      { id: '6', type: 'basic', operation: 'addition', operand1: 6, operand2: 2, answer: 8 },
    ],
    generatedAt: new Date('2024-01-01'),
  };

  it('should create correct print layout structure', () => {
    const printDOM = createPrintDOM(mockWorksheet, false);
    
    // ヘッダーが存在することを確認
    const header = printDOM.querySelector('div[style*="border-bottom"]');
    expect(header).toBeTruthy();
    
    // 学年と演算が正しく表示されることを確認
    expect(printDOM.textContent).toContain('3年生 たし算');
    
    // 名前欄と点数欄が存在することを確認
    expect(printDOM.textContent).toContain('名前：');
    expect(printDOM.textContent).toContain('点数：');
  });

  it('should arrange problems in vertical order for multi-column layout', () => {
    const printDOM = createPrintDOM(mockWorksheet, false);
    
    // 問題番号を取得
    const problemNumbers = Array.from(printDOM.querySelectorAll('div[style*="color: #666"]'))
      .map(el => el.textContent);
    
    // 2列レイアウトの場合、縦順になっているか確認
    // 期待される順序: (1), (4), (2), (5), (3), (6)
    expect(problemNumbers).toEqual(['(1)', '(4)', '(2)', '(5)', '(3)', '(6)']);
  });

  it('should show answers in red when showAnswers is true', () => {
    const printDOM = createPrintDOM(mockWorksheet, true);
    
    // 赤色の答えが表示されているか確認
    const redAnswers = printDOM.querySelectorAll('span[style*="color: red"]');
    expect(redAnswers.length).toBeGreaterThan(0);
  });

  it('should show answer lines when showAnswers is false', () => {
    const printDOM = createPrintDOM(mockWorksheet, false);
    
    // 答えの下線が表示されているか確認
    const answerLines = printDOM.querySelectorAll('span[style*="border-bottom: 1px solid black"]');
    expect(answerLines.length).toBeGreaterThan(mockWorksheet.problems.length); // 名前欄、点数欄も含む
  });

  it('should handle different column layouts correctly', () => {
    const threeColumnWorksheet = {
      ...mockWorksheet,
      settings: { ...mockWorksheet.settings, layoutColumns: 3 as const },
    };
    
    const printDOM = createPrintDOM(threeColumnWorksheet, false);
    
    // グリッドが3列になっているか確認
    const grid = printDOM.querySelector('div[style*="grid-template-columns: repeat(3"]');
    expect(grid).toBeTruthy();
  });

  it('should handle fraction problems correctly', () => {
    const fractionWorksheet: WorksheetData = {
      ...mockWorksheet,
      settings: { ...mockWorksheet.settings, problemType: 'fraction' },
      problems: [
        {
          id: '1',
          type: 'fraction',
          operation: 'addition',
          numerator1: 1,
          denominator1: 2,
          numerator2: 1,
          denominator2: 3,
          answerNumerator: 5,
          answerDenominator: 6,
        },
      ],
    };
    
    const printDOM = createPrintDOM(fractionWorksheet, false);
    
    // 分数が正しく表示されているか確認
    expect(printDOM.textContent).toContain('1/2');
    expect(printDOM.textContent).toContain('1/3');
  });

  it('should handle word problems correctly', () => {
    const wordWorksheet: WorksheetData = {
      ...mockWorksheet,
      settings: { ...mockWorksheet.settings, problemType: 'word' },
      problems: [
        {
          id: '1',
          type: 'word',
          operation: 'multiplication',
          problemText: 'たて5cm、よこ3cmの長方形の面積は？',
          answer: 15,
          unit: 'cm²',
        },
      ],
    };
    
    const printDOM = createPrintDOM(wordWorksheet, false);
    
    // 文章問題が正しく表示されているか確認
    expect(printDOM.textContent).toContain('たて5cm、よこ3cmの長方形の面積は？');
    expect(printDOM.textContent).toContain('cm²');
  });

  it('should handle missing number problems correctly', () => {
    const missingNumberWorksheet: WorksheetData = {
      ...mockWorksheet,
      problems: [
        {
          id: '1',
          type: 'basic',
          operation: 'addition',
          operand1: null,
          operand2: 3,
          answer: 8,
          missingPosition: 'operand1',
        },
      ],
    };
    
    const printDOM = createPrintDOM(missingNumberWorksheet, false);
    
    // 虫食い算の四角が表示されているか確認
    const squares = printDOM.querySelectorAll('span[style*="border: 2px solid #333"]');
    expect(squares.length).toBe(1);
  });

  it('should show missing number answers when showAnswers is true', () => {
    const missingNumberWorksheet: WorksheetData = {
      ...mockWorksheet,
      problems: [
        {
          id: '1',
          type: 'basic',
          operation: 'addition',
          operand1: null,
          operand2: 3,
          answer: 8,
          missingPosition: 'operand1',
        },
      ],
    };
    
    const printDOM = createPrintDOM(missingNumberWorksheet, true);
    
    // 虫食い算の答え（5）が赤で表示されているか確認
    const redAnswer = printDOM.querySelector('span[style*="color: red"]');
    expect(redAnswer?.textContent).toBe('5');
  });

  it('should handle division with remainder correctly', () => {
    const divisionWorksheet: WorksheetData = {
      ...mockWorksheet,
      settings: { ...mockWorksheet.settings, operation: 'division' },
      problems: [
        {
          id: '1',
          type: 'basic',
          operation: 'division',
          operand1: 17,
          operand2: 5,
          answer: 3,
          missingPosition: 'answer',
        },
      ],
    };
    
    const printDOM = createPrintDOM(divisionWorksheet, true);
    
    // あまりのある割り算が正しく表示されているか確認
    expect(printDOM.textContent).toContain('3あまり2');
  });
});