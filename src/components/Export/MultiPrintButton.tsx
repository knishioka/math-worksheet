import React from 'react';
import type {
  WorksheetData,
  HissanProblem,
  WordProblemEn,
  FractionProblem,
  DecimalProblem,
  MixedNumberProblem,
} from '../../types';
import {
  getOperationName,
  getOperatorSymbol,
} from '../../lib/utils/formatting';
import {
  calculateMissingOperand1,
  calculateMissingOperand2,
  calculateMissingAnswer,
} from '../../lib/utils/missing-number-calculator';
import {
  detectPrimaryProblemType,
  getPrintTemplate,
} from '../../config/print-templates';
import { fitPageToA4, estimatePageLayout } from './fitPageToA4';

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

    // 既存要素を記録
    const originalChildren = Array.from(document.body.children);

    // 印刷用コンテナを作成
    const printContainer = document.createElement('div');
    printContainer.id = 'multi-print-container';
    printContainer.style.position = 'absolute';
    printContainer.style.left = '0';
    printContainer.style.top = '0';
    printContainer.style.width = '100%';
    printContainer.style.visibility = 'hidden';
    printContainer.style.display = 'flex';
    printContainer.style.flexDirection = 'column';
    printContainer.style.alignItems = 'center';
    printContainer.style.backgroundColor = '#ffffff';

    document.body.appendChild(printContainer);

    // 各ワークシートをレンダリング
    worksheets.forEach((worksheet, index) => {
      const pageDiv = document.createElement('div');
      pageDiv.classList.add('multi-print-page');
      if (index > 0) {
        pageDiv.style.pageBreakBefore = 'always';
      }
      pageDiv.style.position = 'relative';
      pageDiv.style.boxSizing = 'border-box';
      pageDiv.style.backgroundColor = '#ffffff';
      pageDiv.style.width = '210mm';
      pageDiv.style.margin = '0 auto';
      pageDiv.style.pageBreakInside = 'avoid';
      pageDiv.style.breakInside = 'avoid';

      // 問題数とタイプから動的に余白を計算
      const primaryType = detectPrimaryProblemType(worksheet.problems);
      const template = getPrintTemplate(primaryType);
      const problemCount = worksheet.problems.length;
      const columns = worksheet.settings.layoutColumns || 2;
      const { topMarginMm, bottomMarginMm } = estimatePageLayout({
        problemCount,
        columns,
        template,
      });

      // ヘッダー部分
      const headerHTML = `
        <div style="border-bottom: 1px solid #ccc; padding-bottom: 6px; margin-bottom: 8px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 8px;">
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
      let problemsHTML = '<div style="margin-top: 12px;">';

      // テンプレートの設定を使用
      const { rowGap, colGap } = template.layout;

      const gridStyle = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${rowGap} ${colGap};`;
      problemsHTML += `<div style="${gridStyle}">`;

      // 縦順に並び替えた問題配列を作成
      const reorderedProblems: ((typeof worksheet.problems)[0] | null)[] = [];
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
          problemsHTML += `<div style="margin-bottom: 8px;"></div>`;
          return;
        }

        // 元のインデックスを計算（縦順の番号）
        const col = index % columns;
        const row = Math.floor(index / columns);
        const originalNumber = col * rowCount + row + 1;

        // 問題タイプに応じて余白を調整（word系は狭め）
        const problemMargin = (problem.type === 'word-en' || problem.type === 'word') ? '6px' : '8px';
        problemsHTML += `<div style="margin-bottom: ${problemMargin};">`;

        const fontSize = template.layout.fontSize;

        // word-enの場合は問題番号を横並びにするため、後で出力
        if (problem.type !== 'word-en') {
          problemsHTML += `<div style="font-size: 12px; color: #666;">(${originalNumber})</div>`;
          problemsHTML += `<div style="font-family: monospace; font-size: ${fontSize}; margin-top: 4px;">`;
        }

        if (problem.type === 'word') {
          // 文章問題の表示
          problemsHTML += `<div style="font-size: ${fontSize}; line-height: 1.3;">`;
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
            problemsHTML +=
              '答え: <span style="display: inline-block; width: 96px; border-bottom: 1px solid black; margin: 0 4px;"></span>';
            if (problem.unit) {
              problemsHTML += `<span style="font-size: 14px;">${problem.unit}</span>`;
            }
          }
          problemsHTML += '</div>';
        } else if (problem.type === 'fraction') {
          // 分数問題の表示
          const fractionProblem = problem as FractionProblem;
          const operator = getOperatorSymbol(problem.operation);

          // 分数1
          problemsHTML += '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac>';
          problemsHTML += `<mn>${fractionProblem.numerator1}</mn>`;
          problemsHTML += `<mn>${fractionProblem.denominator1}</mn>`;
          problemsHTML += '</mfrac></math>';

          problemsHTML += ` ${operator} `;

          // 分数2
          if (fractionProblem.numerator2 !== undefined && fractionProblem.denominator2 !== undefined) {
            problemsHTML += '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac>';
            problemsHTML += `<mn>${fractionProblem.numerator2}</mn>`;
            problemsHTML += `<mn>${fractionProblem.denominator2}</mn>`;
            problemsHTML += '</mfrac></math>';
          }

          problemsHTML += ' = ';

          // 答え
          if (showAnswers) {
            problemsHTML += '<math xmlns="http://www.w3.org/1998/Math/MathML"><mfrac>';
            problemsHTML += `<mn style="color: red; font-weight: bold;">${fractionProblem.answerNumerator}</mn>`;
            problemsHTML += `<mn style="color: red; font-weight: bold;">${fractionProblem.answerDenominator}</mn>`;
            problemsHTML += '</mfrac></math>';
          } else {
            problemsHTML += '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
          }
        } else if (problem.type === 'decimal') {
          // 小数問題の表示
          const decimalProblem = problem as DecimalProblem;
          const operator = getOperatorSymbol(problem.operation);

          problemsHTML += `<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>${decimalProblem.operand1}</mn></math>`;
          problemsHTML += ` ${operator} `;
          problemsHTML += `<math xmlns="http://www.w3.org/1998/Math/MathML"><mn>${decimalProblem.operand2}</mn></math>`;
          problemsHTML += ' = ';

          if (showAnswers) {
            problemsHTML += `<math xmlns="http://www.w3.org/1998/Math/MathML"><mn style="color: red; font-weight: bold;">${decimalProblem.answer}</mn></math>`;
          } else {
            problemsHTML += '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
          }
        } else if (problem.type === 'mixed') {
          // 帯分数問題の表示
          const mixedProblem = problem as MixedNumberProblem;
          const operator = getOperatorSymbol(problem.operation);

          // 帯分数1
          problemsHTML += '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>';
          problemsHTML += `<mn>${mixedProblem.whole1}</mn>`;
          problemsHTML += '<mfrac>';
          problemsHTML += `<mn>${mixedProblem.numerator1}</mn>`;
          problemsHTML += `<mn>${mixedProblem.denominator1}</mn>`;
          problemsHTML += '</mfrac>';
          problemsHTML += '</mrow></math>';

          problemsHTML += ` ${operator} `;

          // 帯分数2
          if (mixedProblem.whole2 !== undefined && mixedProblem.numerator2 !== undefined && mixedProblem.denominator2 !== undefined) {
            problemsHTML += '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>';
            problemsHTML += `<mn>${mixedProblem.whole2}</mn>`;
            problemsHTML += '<mfrac>';
            problemsHTML += `<mn>${mixedProblem.numerator2}</mn>`;
            problemsHTML += `<mn>${mixedProblem.denominator2}</mn>`;
            problemsHTML += '</mfrac>';
            problemsHTML += '</mrow></math>';
          }

          problemsHTML += ' = ';

          // 答え
          if (showAnswers) {
            problemsHTML += '<math xmlns="http://www.w3.org/1998/Math/MathML"><mrow>';
            problemsHTML += `<mn style="color: red; font-weight: bold;">${mixedProblem.answerWhole}</mn>`;
            problemsHTML += '<mfrac>';
            problemsHTML += `<mn style="color: red; font-weight: bold;">${mixedProblem.answerNumerator}</mn>`;
            problemsHTML += `<mn style="color: red; font-weight: bold;">${mixedProblem.answerDenominator}</mn>`;
            problemsHTML += '</mfrac>';
            problemsHTML += '</mrow></math>';
          } else {
            problemsHTML += '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
          }
        } else if (problem.type === 'word-en') {
          // 英語文章問題の表示 - 問題番号を横並びに
          const wordProblemEn = problem as WordProblemEn;
          problemsHTML += `<div style="display: flex; gap: 8px; font-size: ${fontSize}; line-height: 1.4; color: #000; text-align: left;">`;
          problemsHTML += `<div style="font-size: 12px; color: #666; flex-shrink: 0;">(${originalNumber})</div>`;
          problemsHTML += `<div style="flex: 1;">`;
          problemsHTML += `<div style="margin-bottom: 4px;">${wordProblemEn.problemText}</div>`;
          if (wordProblemEn.category === 'word-story') {
            problemsHTML += '<div style="margin-top: 4px; display: flex; align-items: flex-end; gap: 6px;">';
            problemsHTML += '<span style="color: #000; font-size: 14px;">Answer:</span>';
            problemsHTML += '<div style="border-bottom: 1.5px solid #000; min-width: 3.5rem; padding: 0 6px; height: 1.2em;">';
            if (showAnswers) {
              problemsHTML += `<span style="font-weight: 500; color: #000;">${wordProblemEn.answer}`;
              if (wordProblemEn.unit) {
                problemsHTML += ` ${wordProblemEn.unit}`;
              }
              problemsHTML += '</span>';
            }
            problemsHTML += '</div>';
            problemsHTML += '</div>';
          }
          problemsHTML += '</div>'; // flex: 1の閉じタグ
          problemsHTML += '</div>'; // flexコンテナの閉じタグ
        } else if (problem.type === 'hissan') {
          // 筆算問題の表示
          const hissanProblem = problem as HissanProblem;
          const operator = getOperatorSymbol(problem.operation);

          // 筆算のHTML生成
          const digits1 = hissanProblem.operand1.toString().split('');
          const digits2 = hissanProblem.operand2.toString().split('');
          const maxLength = Math.max(digits1.length, digits2.length);

          // パディング
          const paddedDigits1 = Array(maxLength - digits1.length).fill('&nbsp;').concat(digits1);
          const paddedDigits2 = Array(maxLength - digits2.length).fill('&nbsp;').concat(digits2);

          const answerDigits = showAnswers && hissanProblem.answer
            ? hissanProblem.answer.toString().split('')
            : [];

          problemsHTML += '<div style="font-family: \'Courier New\', monospace; display: inline-block; text-align: right; line-height: 1.2; margin: 10px 0;">';

          // 1つ目の数
          problemsHTML += '<div style="white-space: nowrap;">';
          paddedDigits1.forEach(d => {
            problemsHTML += `<span style="display: inline-block; width: 30px; text-align: center;">${d}</span>`;
          });
          problemsHTML += '</div>';

          // 演算子と2つ目の数（演算子を数字の左に配置）
          problemsHTML += '<div style="white-space: nowrap;">';
          // 演算子を左側にパディング
          for (let i = 0; i < maxLength - digits2.length; i++) {
            problemsHTML += '<span style="display: inline-block; width: 30px; text-align: center;">&nbsp;</span>';
          }
          problemsHTML += `<span style="display: inline-block; width: 30px; text-align: center;">${operator}</span>`;
          paddedDigits2.forEach(d => {
            problemsHTML += `<span style="display: inline-block; width: 30px; text-align: center;">${d}</span>`;
          });
          problemsHTML += '</div>';

          // 横線
          problemsHTML += `<div style="border-top: 2px solid black; margin: 2px 0; width: ${maxLength * 30 + 30}px;"></div>`;

          // 答え
          problemsHTML += '<div style="white-space: nowrap;">';
          if (showAnswers && hissanProblem.answer) {
            const paddedAnswer = Array(maxLength + 1 - answerDigits.length).fill('&nbsp;').concat(answerDigits);
            paddedAnswer.forEach(d => {
              problemsHTML += `<span style="display: inline-block; width: 30px; text-align: center; color: red; font-weight: bold;">${d}</span>`;
            });
          } else {
            for (let i = 0; i <= maxLength; i++) {
              problemsHTML += '<span style="display: inline-block; width: 30px; height: 30px; border: 1px solid #ccc; margin: 0 2px;"></span>';
            }
          }
          problemsHTML += '</div>';

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
            problemsHTML +=
              '<span style="display: inline-block; width: 24px; height: 24px; border: 1.5px solid #333; background-color: #f9f9f9; vertical-align: text-bottom;"></span>';
          }

          problemsHTML += ` ${operator} `;

          // operand2の表示
          if (problem.operand2 !== null) {
            problemsHTML += problem.operand2;
          } else if (showAnswers) {
            const missingOperand2 = calculateMissingOperand2(problem);
            problemsHTML += `<span style="color: red; font-weight: bold;">${missingOperand2}</span>`;
          } else {
            problemsHTML +=
              '<span style="display: inline-block; width: 24px; height: 24px; border: 1.5px solid #333; background-color: #f9f9f9; vertical-align: text-bottom;"></span>';
          }

          problemsHTML += ' = ';

          // 答えの表示
          if (problem.missingPosition === 'answer') {
            // 虫食い算で答えが空欄の場合
            if (showAnswers) {
              const calculatedAnswer = calculateMissingAnswer(problem);
              problemsHTML += `<span style="color: red; font-weight: bold;">${calculatedAnswer}</span>`;
            } else {
              problemsHTML +=
                '<span style="display: inline-block; width: 24px; height: 24px; border: 1.5px solid #333; background-color: #f9f9f9; vertical-align: text-bottom;"></span>';
            }
          } else if (showAnswers && problem.missingPosition) {
            // 虫食い算で答えの位置が空欄でない場合、通常の色で答えを表示
            problemsHTML += `<span style="font-family: monospace; font-size: 18px;">${problem.answer}</span>`;
          } else if (showAnswers && problem.answer !== null) {
            problemsHTML += `<span style="color: red; font-weight: bold;">${problem.answer}</span>`;
          } else {
            problemsHTML +=
              '<span style="display: inline-block; width: 64px; border-bottom: 1px solid black; margin-left: 4px;"></span>';
          }
        }

        // word-enの場合は外側のdivのみを閉じ、それ以外は2つのdivを閉じる
        if (problem.type === 'word-en') {
          problemsHTML += '</div>'; // 130行目で開始したdiv (margin-bottom)
        } else {
          problemsHTML += '</div></div>'; // 137行目と130行目で開始した2つのdiv
        }
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
      const { topMarginMm: fittedTop, bottomMarginMm: fittedBottom, scale } =
        fitPageToA4(pageDiv, topMarginMm, bottomMarginMm);

      // デバッグ用: 開発モードでのみレイアウト情報を記録
      if (import.meta.env.DEV) {
        pageDiv.dataset.printTopMarginMm = fittedTop.toFixed(2);
        pageDiv.dataset.printBottomMarginMm = fittedBottom.toFixed(2);
        pageDiv.dataset.printScale = scale.toFixed(3);
      }
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
          background: #ffffff;
        }
        #multi-print-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        #multi-print-container .multi-print-page {
          width: 210mm;
          box-sizing: border-box;
          page-break-after: always;
          break-after: page;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        #multi-print-container .multi-print-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
      }
    `;
    document.head.appendChild(styleEl);

    // 既存の要素を非表示
    const hiddenElements: HTMLElement[] = [];
    originalChildren.forEach((el) => {
      if (el instanceof HTMLElement) {
        hiddenElements.push(el);
        el.style.display = 'none';
      }
    });

    // 印刷用コンテナを表示
    printContainer.style.visibility = 'visible';
    printContainer.style.position = 'relative';
    printContainer.style.left = '0';
    printContainer.style.top = '0';
    printContainer.style.pointerEvents = 'auto';

    // 印刷
    window.print();

    // 元に戻す
    hiddenElements.forEach((el) => {
      el.style.display = '';
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
      <svg
        className="w-5 h-5 mr-2"
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
      印刷する
    </button>
  );
};

// 共通ユーティリティ関数は src/lib/utils/ からインポート済み
