import React from 'react';
import type {
  Problem,
  LayoutColumns,
  FractionProblem,
  DecimalProblem,
  MixedNumberProblem,
  BasicProblem,
  WordProblem,
  WordProblemEn,
  HissanProblem,
  WorksheetSettings,
} from '../../types';
import { MathDecimal, MathMixedNumber } from '../Math/MathExpression';
import {
  calculateMissingOperand1,
  calculateMissingOperand2,
  calculateMissingAnswer,
} from '../../lib/utils/missing-number-calculator';
import { WordProblemEnComponent } from '../Math/WordProblemEn';
import { getPrintTemplate } from '../../config/print-templates';
import { estimateA4Fit } from '../../lib/utils/print-validator';
import { buildPreviewTitle } from '../../lib/utils/previewTitle';
import {
  emptyA4ContainerStyle,
  getA4ContainerStyle,
  a4WarningContainerStyle,
  a4WarningIconRowStyle,
  a4WarningTitleStyle,
  a4WarningMessageStyle,
  headerBorderStyle,
  headerGridStyle,
  headerTextStyle,
  headerCenterTextStyle,
  headerRightTextStyle,
  getUnderlineStyle,
  problemNumberStyle,
  problemItemStyle,
  problemTextStyle,
  wordProblemTextStyle,
  wordProblemAnswerUnderlineStyle,
  answerDisplayStyle,
  answerUnderlineStyle,
  missingNumberBoxStyle,
  fractionContainerStyle,
  fractionNumeratorStyle,
  fractionDenominatorStyle,
  fractionAnswerNumeratorStyle,
  wordEnNumberStyle,
  hissanContainerStyle,
  hissanCellStyle,
  hissanAnswerBoxStyle,
  getHissanLineStyle,
  SPACING,
} from '../../config/styles';

interface ProblemListProps {
  problems: Problem[];
  layoutColumns: LayoutColumns;
  showAnswers?: boolean;
  settings: WorksheetSettings;
  printMode?: boolean;
}

export const ProblemList = React.forwardRef<HTMLDivElement, ProblemListProps>(
  ({ problems, layoutColumns, showAnswers = false, settings, printMode = false }, ref) => {
  if (problems.length === 0) {
    return (
      <div className="flex justify-center py-8 bg-gray-100">
        <div
          className="bg-white flex items-center justify-center"
          style={emptyA4ContainerStyle}
        >
          <div className="text-center text-gray-500">
            設定を確認して「問題を生成」ボタンをクリックしてください
          </div>
        </div>
      </div>
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
  }[layoutColumns];

  // 縦順に並び替えた問題配列を作成
  const reorderedProblems: (Problem | null)[] = [];
  const rowCount = Math.ceil(problems.length / layoutColumns);

  for (let col = 0; col < layoutColumns; col++) {
    for (let row = 0; row < rowCount; row++) {
      const originalIndex = row + col * rowCount;
      const newIndex = row * layoutColumns + col;

      if (originalIndex < problems.length) {
        reorderedProblems[newIndex] = problems[originalIndex];
      } else {
        reorderedProblems[newIndex] = null;
      }
    }
  }

  const previewTitle = buildPreviewTitle({
    settings,
    format: { gradeFirst: true, wrapGradeInParentheses: false },
  });

  // 動的余白の計算（印刷プレビューと同じロジック）
  const calculatePadding = (): string => {
    const template = getPrintTemplate(
      settings.problemType === 'word-en' ? 'word-en' : settings.problemType
    );
    const problemCount = problems.length;
    const columns = layoutColumns;
    const estimatedRows = Math.ceil(problemCount / columns);

    // 問題タイプごとの推定高さ（mm）
    const minProblemHeightMm = parseInt(template.layout.minProblemHeight) * 0.26;
    const rowGapMm = parseInt(template.layout.rowGap) * 0.26;

    // 必要な高さを計算
    const headerHeight = 25; // ヘッダー部分の高さ (mm)
    const estimatedContentHeight = headerHeight + (minProblemHeightMm + rowGapMm) * estimatedRows;

    // A4の高さは297mm、残りスペースを余白として配分
    const a4Height = 297;
    const remainingSpace = a4Height - estimatedContentHeight;

    // 上の余白: 5mm〜15mm
    const topMargin = Math.max(5, Math.min(15, remainingSpace * 0.6));
    // 下の余白: 上の余白の半分（小さめに）
    const bottomMargin = Math.max(5, topMargin * 0.5);

    return `${topMargin}mm 15mm ${bottomMargin}mm`;
  };

  // A4サイズオーバーフロー判定
  const a4FitResult = estimateA4Fit(
    problems.length,
    layoutColumns,
    settings.problemType === 'word-en' ? 'word-en' : settings.problemType
  );

  // テンプレートから gap を取得
  const template = getPrintTemplate(
    settings.problemType === 'word-en' ? 'word-en' : settings.problemType
  );
  const gridGapStyle: React.CSSProperties = {
    display: 'grid',
    rowGap: template.layout.rowGap,
    columnGap: template.layout.colGap,
  };

  // 印刷モードの場合は外側のラッパーを省略
  const content = (
    <>
      {/* A4オーバーフロー警告 */}
      {!printMode && !a4FitResult.fits && (
        <div style={a4WarningContainerStyle}>
          <div style={a4WarningIconRowStyle}>
            <span style={{ fontSize: '20px' }}>⚠️</span>
            <div>
              <div style={a4WarningTitleStyle}>
                A4サイズを超えています
              </div>
              <div style={a4WarningMessageStyle}>
                推定高さ: {a4FitResult.estimatedHeight.toFixed(0)}mm（A4: {a4FitResult.a4Height}mm）
                <br />
                問題数を減らすか、列数を増やしてください。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* A4用紙風のコンテナ */}
      <div
        ref={ref}
        className="bg-white"
        style={getA4ContainerStyle(calculatePadding(), printMode, !a4FitResult.fits)}
      >
        {/* ヘッダー */}
        <div style={headerBorderStyle}>
          <div style={headerGridStyle}>
            <div style={headerTextStyle}>
              名前：<span style={getUnderlineStyle('128px')}></span>
            </div>
            <div style={headerCenterTextStyle}>
              {previewTitle}
            </div>
            <div style={headerRightTextStyle}>
              点数：<span style={getUnderlineStyle('64px')}></span>点
            </div>
          </div>
        </div>

        <div
          className={`${gridCols} avoid-break`}
          style={gridGapStyle}
        >
          {reorderedProblems.map((problem, index) => {
        if (!problem) {
          // 空のセルを配置（レイアウトを保つため）
          return <div key={`empty-${index}`} className="avoid-break" />;
        }

        // 元のインデックスを計算（縦順から横順へ）
        const col = index % layoutColumns;
        const row = Math.floor(index / layoutColumns);
        const originalNumber = col * rowCount + row + 1;

        return (
          <div key={problem.id} className="avoid-break">
            <ProblemItem
              problem={problem}
              number={originalNumber}
              showAnswer={showAnswers}
            />
          </div>
        );
      })}
        </div>
      </div>
    </>
  );

  // 印刷モードの場合は直接コンテンツを返す、プレビューモードの場合は外側のラッパーで囲む
  if (printMode) {
    return content;
  }

  return (
    <div className="flex flex-col items-center py-8 bg-gray-100">
      {content}
    </div>
  );
});

ProblemList.displayName = 'ProblemList';

interface ProblemItemProps {
  problem: Problem;
  number: number;
  showAnswer?: boolean;
}

const ProblemItem: React.FC<ProblemItemProps> = ({
  problem,
  number,
  showAnswer = false,
}) => {
  const operationSymbol = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷',
  }[problem.operation];

  // 分数問題の場合
  if (problem.type === 'fraction') {
    const fractionProblem = problem as FractionProblem;
    return (
      <div className="problem-text" style={problemItemStyle}>
        <div style={problemNumberStyle}>({number})</div>
        <div style={problemTextStyle}>
          {/* 分子1 */}
          <span style={fractionContainerStyle}>
            <span style={fractionNumeratorStyle}>
              {fractionProblem.numerator1}
            </span>
            <span style={fractionDenominatorStyle}>
              {fractionProblem.denominator1}
            </span>
          </span>
          {' ' + operationSymbol + ' '}
          {/* 分子2 */}
          {fractionProblem.numerator2 !== undefined &&
            fractionProblem.denominator2 !== undefined && (
              <span style={fractionContainerStyle}>
                <span style={fractionNumeratorStyle}>
                  {fractionProblem.numerator2}
                </span>
                <span style={fractionDenominatorStyle}>
                  {fractionProblem.denominator2}
                </span>
              </span>
            )}
          {' = '}
          {/* 答え */}
          {showAnswer ? (
            <span
              style={{
                ...answerDisplayStyle,
                ...fractionContainerStyle,
              }}
            >
              <span style={fractionAnswerNumeratorStyle}>
                {fractionProblem.answerNumerator}
              </span>
              <span style={fractionDenominatorStyle}>
                {fractionProblem.answerDenominator}
              </span>
            </span>
          ) : (
            <span style={answerUnderlineStyle} />
          )}
        </div>
      </div>
    );
  }

  // 小数問題の場合
  if (problem.type === 'decimal') {
    const decimalProblem = problem as DecimalProblem;
    return (
      <div className="problem-text space-y-1">
        <div className="text-xs text-gray-600">({number})</div>
        <div className="flex items-baseline space-x-2">
          <MathDecimal value={decimalProblem.operand1} />
          <span className="font-mono text-lg">{operationSymbol}</span>
          <MathDecimal value={decimalProblem.operand2} />
          <span className="font-mono text-lg">=</span>
          {showAnswer ? (
            <MathDecimal
              value={decimalProblem.answer}
              className="text-red-600 font-bold"
            />
          ) : (
            <span
              className="inline-block w-16 border-b border-black mx-1 align-bottom"
              style={{ height: '1.5rem' }}
            />
          )}
        </div>
      </div>
    );
  }

  // 帯分数問題の場合
  if (problem.type === 'mixed') {
    const mixedProblem = problem as MixedNumberProblem;
    return (
      <div className="problem-text space-y-1">
        <div className="text-xs text-gray-600">({number})</div>
        <div className="flex items-center space-x-2">
          <MathMixedNumber
            whole={mixedProblem.whole1}
            numerator={mixedProblem.numerator1}
            denominator={mixedProblem.denominator1}
          />
          <span className="font-mono text-lg">{operationSymbol}</span>
          {mixedProblem.whole2 !== undefined &&
            mixedProblem.numerator2 !== undefined &&
            mixedProblem.denominator2 !== undefined && (
              <MathMixedNumber
                whole={mixedProblem.whole2}
                numerator={mixedProblem.numerator2}
                denominator={mixedProblem.denominator2}
              />
            )}
          <span className="font-mono text-lg">=</span>
          {showAnswer ? (
            <MathMixedNumber
              whole={mixedProblem.answerWhole}
              numerator={mixedProblem.answerNumerator}
              denominator={mixedProblem.answerDenominator}
              className="text-red-600 font-bold"
            />
          ) : (
            <span
              className="inline-block w-16 border-b border-black mx-1 align-bottom"
              style={{ height: '1.5rem' }}
            />
          )}
        </div>
      </div>
    );
  }

  // 文章問題の場合
  if (problem.type === 'word') {
    const wordProblem = problem as WordProblem;
    return (
      <div className="problem-text" style={problemItemStyle}>
        <div style={problemNumberStyle}>({number})</div>
        <div style={wordProblemTextStyle}>
          {wordProblem.problemText}
        </div>
        <div style={{ marginTop: SPACING.gap.small }}>
          {showAnswer ? (
            <span style={answerDisplayStyle}>
              答え: {wordProblem.answer}
              {wordProblem.unit && wordProblem.unit}
            </span>
          ) : (
            <>
              答え:{' '}
              <span style={wordProblemAnswerUnderlineStyle} />
              {wordProblem.unit && (
                <span style={{ fontSize: '14px' }}>{wordProblem.unit}</span>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // 英語文章問題の場合 - 問題番号を横並びに
  if (problem.type === 'word-en') {
    const wordProblemEn = problem as WordProblemEn;
    return (
      <div className="problem-item" style={{ ...problemItemStyle, display: 'flex', gap: SPACING.gap.medium }}>
        <div style={wordEnNumberStyle}>
          ({number})
        </div>
        <div style={{ flex: 1 }}>
          <WordProblemEnComponent problem={wordProblemEn} showAnswer={showAnswer} />
        </div>
      </div>
    );
  }

  // 筆算問題の場合
  if (problem.type === 'hissan') {
    const hissanProblem = problem as HissanProblem;
    const operator = {
      addition: '+',
      subtraction: '−',
      multiplication: '×',
      division: '÷',
    }[hissanProblem.operation];

    const digits1 = hissanProblem.operand1.toString().split('');
    const digits2 = hissanProblem.operand2.toString().split('');
    const maxLength = Math.max(digits1.length, digits2.length);

    const paddedDigits1 = Array(maxLength - digits1.length)
      .fill('')
      .concat(digits1);
    const paddedDigits2 = Array(maxLength - digits2.length)
      .fill('')
      .concat(digits2);

    const answerDigits =
      showAnswer && hissanProblem.answer
        ? hissanProblem.answer.toString().split('')
        : [];

    return (
      <div className="problem-text" style={problemItemStyle}>
        <div style={problemNumberStyle}>({number})</div>
        <div style={hissanContainerStyle}>
          {/* 1つ目の数 */}
          <div style={{ whiteSpace: 'nowrap' }}>
            {paddedDigits1.map((d, i) => (
              <span key={i} style={hissanCellStyle}>
                {d === '' ? '\u00A0' : d}
              </span>
            ))}
          </div>

          {/* 演算子と2つ目の数 */}
          <div style={{ whiteSpace: 'nowrap' }}>
            {/* 演算子を数字の左に配置（digits2の長さに応じて左側にパディング） */}
            {Array(maxLength - digits2.length).fill('').map((_, i) => (
              <span key={`pad-${i}`} style={hissanCellStyle}>
                {'\u00A0'}
              </span>
            ))}
            <span style={hissanCellStyle}>
              {operator}
            </span>
            {paddedDigits2.map((d, i) => (
              <span key={i} style={hissanCellStyle}>
                {d === '' ? '\u00A0' : d}
              </span>
            ))}
          </div>

          {/* 横線 */}
          <div style={getHissanLineStyle(maxLength)} />

          {/* 答え */}
          <div style={{ whiteSpace: 'nowrap' }}>
            {showAnswer && hissanProblem.answer ? (
              <>
                {Array(maxLength + 1 - answerDigits.length)
                  .fill('')
                  .concat(answerDigits)
                  .map((d, i) => (
                    <span
                      key={i}
                      style={{
                        ...hissanCellStyle,
                        ...answerDisplayStyle,
                      }}
                    >
                      {d === '' ? '\u00A0' : d}
                    </span>
                  ))}
              </>
            ) : (
              <>
                {Array(maxLength + 1)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} style={hissanAnswerBoxStyle} />
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 基本的な問題の場合（整数）
  const basicProblem = problem as BasicProblem;

  return (
    <div className="problem-text" style={problemItemStyle}>
      <div style={problemNumberStyle}>({number})</div>
      <div style={problemTextStyle}>
        {/* operand1 */}
        {basicProblem.operand1 !== null ? (
          basicProblem.operand1
        ) : showAnswer ? (
          <span style={answerDisplayStyle}>
            {calculateMissingOperand1(basicProblem)}
          </span>
        ) : (
          <span style={missingNumberBoxStyle} />
        )}
        {' ' + operationSymbol + ' '}
        {/* operand2 */}
        {basicProblem.operand2 !== null ? (
          basicProblem.operand2
        ) : showAnswer ? (
          <span style={answerDisplayStyle}>
            {calculateMissingOperand2(basicProblem)}
          </span>
        ) : (
          <span style={missingNumberBoxStyle} />
        )}
        {' = '}
        {/* 答え */}
        {basicProblem.missingPosition === 'answer' ? (
          showAnswer ? (
            <span style={answerDisplayStyle}>
              {calculateMissingAnswer(basicProblem)}
            </span>
          ) : (
            <span style={missingNumberBoxStyle} />
          )
        ) : basicProblem.missingPosition ? (
          // 虫食い算でoperand1またはoperand2が空白の場合、答えは常に表示
          <span style={{ fontFamily: 'monospace', fontSize: '18px' }}>
            {basicProblem.answer}
          </span>
        ) : showAnswer && basicProblem.answer !== null ? (
          <span style={answerDisplayStyle}>
            {basicProblem.answer}
          </span>
        ) : (
          <span style={answerUnderlineStyle} />
        )}
      </div>
    </div>
  );
};

