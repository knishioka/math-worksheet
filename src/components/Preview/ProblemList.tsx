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
  SingaporeProblem,
  HissanProblem,
  WorksheetSettings,
} from '../../types';
import { MathDecimal, MathMixedNumber } from '../Math/MathExpression';
import { HissanDivisionJapanese } from '../Math/HissanDivisionJapanese';
import {
  calculateMissingOperand1,
  calculateMissingOperand2,
  calculateMissingAnswer,
} from '../../lib/utils/missing-number-calculator';
import { WordProblemEnComponent } from '../Math/WordProblemEn';
import { SingaporeProblemComponent } from '../Math/SingaporeProblemComponent';
import { NumberTracingRow } from '../Math/NumberTracingRow';
import type { NumberTracingProblem } from '../../types';
import { getPrintTemplate } from '../../config/print-templates';
import { getEffectiveProblemType } from '../../lib/utils/problem-type-detector';
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
  HISSAN_ANSWER_GAP,
  SPACING,
} from '../../config/styles';

const multiOperandSymbols: Record<string, string> = {
  addition: '+',
  subtraction: '−',
  multiplication: '×',
  division: '÷',
};

interface ProblemListProps {
  problems: Problem[];
  layoutColumns: LayoutColumns;
  showAnswers?: boolean;
  settings: WorksheetSettings;
  printMode?: boolean;
}

export const ProblemList = React.forwardRef<HTMLDivElement, ProblemListProps>(
  (
    {
      problems,
      layoutColumns,
      showAnswers = false,
      settings,
      printMode = false,
    },
    ref
  ) => {
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

    // 実効的な問題タイプを取得（わり算筆算の場合は 'hissan-div'、暗算は 'anzan' になる）
    const effectiveProblemType = getEffectiveProblemType(
      settings.problemType,
      settings.calculationPattern
    );

    // 動的余白の計算（印刷プレビューと同じロジック）
    // A4サイズオーバーフロー判定
    const a4FitResult = estimateA4Fit(
      problems.length,
      layoutColumns,
      effectiveProblemType
    );

    // テンプレートから gap を取得
    const template = getPrintTemplate(effectiveProblemType);
    // A4に収まる場合は align-content: space-between で行間を自動拡張し余白を均等配分
    const gridGapStyle: React.CSSProperties = {
      display: 'grid',
      rowGap: template.layout.rowGap,
      columnGap: template.layout.colGap,
      ...(a4FitResult.fits ? { alignContent: 'space-between', flex: 1 } : {}),
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
                <div style={a4WarningTitleStyle}>A4サイズを超えています</div>
                <div style={a4WarningMessageStyle}>
                  推定高さ: {a4FitResult.estimatedHeight.toFixed(0)}mm（A4:{' '}
                  {a4FitResult.a4Height}mm）
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
          data-a4-sheet
          className="bg-white"
          style={getA4ContainerStyle(
            '15mm 15mm 7.5mm',
            printMode,
            !a4FitResult.fits
          )}
        >
          {/* ヘッダー */}
          <div style={headerBorderStyle}>
            <div style={headerGridStyle}>
              <div style={headerTextStyle}>
                名前：<span style={getUnderlineStyle('128px')}></span>
              </div>
              <div style={headerCenterTextStyle}>{previewTitle}</div>
              <div style={headerRightTextStyle}>
                点数：<span style={getUnderlineStyle('64px')}></span>点
              </div>
            </div>
          </div>

          <div data-problem-grid className={gridCols} style={gridGapStyle}>
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
                    layoutColumns={layoutColumns}
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
  }
);

ProblemList.displayName = 'ProblemList';

/** 筆算の答え行（記入欄または解答表示） */
const HissanAnswerRow: React.FC<{
  answerWidth: number;
  answerDigits: string[];
  showAnswer: boolean;
}> = ({ answerWidth, answerDigits, showAnswer }) => (
  <div
    style={{
      whiteSpace: 'nowrap',
      display: 'flex',
      gap: `${HISSAN_ANSWER_GAP}px`,
      justifyContent: 'flex-end',
    }}
  >
    {showAnswer ? (
      <>
        {Array(Math.max(answerWidth - answerDigits.length, 0))
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
        {Array(answerWidth)
          .fill(0)
          .map((_, i) => (
            <span key={i} style={hissanAnswerBoxStyle} />
          ))}
      </>
    )}
  </div>
);

/** 多桁乗算の部分積記入欄 */
const PartialProductBoxes: React.FC<{
  digits1Length: number;
  digits2Length: number;
  lineBoxCount: number;
}> = ({ digits1Length, digits2Length, lineBoxCount }) => {
  const partialWidth = digits1Length + 1;
  const totalWidth = digits1Length + digits2Length;
  return (
    <>
      {Array.from({ length: digits2Length }).map((_, idx) => {
        const rightPad = idx;
        const leftPad = totalWidth - partialWidth - rightPad;
        return (
          <div key={`partial-${idx}`} style={{ whiteSpace: 'nowrap' }}>
            {Array(Math.max(leftPad, 0))
              .fill('')
              .map((_, i) => (
                <span key={`lpad-${i}`} style={hissanCellStyle}>
                  {'\u00A0'}
                </span>
              ))}
            {Array(partialWidth)
              .fill(0)
              .map((_, i) => (
                <span key={`pp-${i}`} style={hissanAnswerBoxStyle} />
              ))}
            {Array(Math.max(rightPad, 0))
              .fill('')
              .map((_, i) => (
                <span key={`rpad-${i}`} style={hissanCellStyle}>
                  {'\u00A0'}
                </span>
              ))}
          </div>
        );
      })}
      <div style={getHissanLineStyle(lineBoxCount - 1)} />
    </>
  );
};

interface ProblemItemProps {
  problem: Problem;
  number: number;
  showAnswer?: boolean;
  layoutColumns?: LayoutColumns;
}

function ProblemItem({
  problem,
  number,
  showAnswer = false,
  layoutColumns = 1,
}: ProblemItemProps): React.ReactElement {
  const operationSymbol = {
    addition: '+',
    subtraction: '−',
    multiplication: '×',
    division: '÷',
  }[problem.operation];

  // 数字なぞり書きの場合
  if (problem.type === 'number-tracing') {
    const tracingProblem = problem as NumberTracingProblem;
    // 列数に応じてセルサイズと練習マス数を調整
    const cellHeight = layoutColumns === 1 ? 56 : layoutColumns === 2 ? 44 : 36;
    const traceCount = layoutColumns === 1 ? 3 : layoutColumns === 2 ? 2 : 1;
    const practiceCount = layoutColumns === 1 ? 3 : layoutColumns === 2 ? 2 : 1;
    return (
      <div style={problemItemStyle}>
        <NumberTracingRow
          digit={tracingProblem.digit}
          traceCount={Math.min(tracingProblem.traceCount, traceCount)}
          practiceCount={Math.min(tracingProblem.practiceCount, practiceCount)}
          cellHeight={cellHeight}
        />
      </div>
    );
  }

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
    const isCountingProblem = !!wordProblem.isSymbolProblem;
    return (
      <div className="problem-text" style={problemItemStyle}>
        <div style={problemNumberStyle}>({number})</div>
        {isCountingProblem ? (
          <div>
            {wordProblem.problemText.split('\n').map((line, i) => (
              <div
                key={i}
                style={{
                  fontSize: '20px',
                  letterSpacing: '3px',
                  lineHeight: '1.2',
                }}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ ...wordProblemTextStyle, whiteSpace: 'pre-line' }}>
            {wordProblem.problemText}
          </div>
        )}
        <div style={{ marginTop: SPACING.gap.small }}>
          {showAnswer ? (
            <span style={answerDisplayStyle}>
              答え: {wordProblem.answer}
              {wordProblem.unit && wordProblem.unit}
            </span>
          ) : (
            <>
              答え: <span style={wordProblemAnswerUnderlineStyle} />
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
      <div
        className="problem-item"
        style={{
          ...problemItemStyle,
          display: 'flex',
          gap: SPACING.gap.medium,
        }}
      >
        <div style={wordEnNumberStyle}>({number})</div>
        <div style={{ flex: 1 }}>
          <WordProblemEnComponent
            problem={wordProblemEn}
            showAnswer={showAnswer}
          />
        </div>
      </div>
    );
  }

  // Singapore Math問題の場合
  if (problem.type === 'singapore') {
    const sgProblem = problem as SingaporeProblem;
    return (
      <div
        className="problem-item"
        style={{
          ...problemItemStyle,
          display: 'flex',
          gap: SPACING.gap.medium,
        }}
      >
        <div style={wordEnNumberStyle}>({number})</div>
        <div style={{ flex: 1 }}>
          <SingaporeProblemComponent
            problem={sgProblem}
            showAnswer={showAnswer}
          />
        </div>
      </div>
    );
  }

  // 筆算問題の場合
  if (problem.type === 'hissan') {
    const hissanProblem = problem as HissanProblem;

    // わり算の場合は日本式長除法レイアウトを使用
    if (hissanProblem.operation === 'division') {
      return (
        <div className="problem-text" style={problemItemStyle}>
          <div style={problemNumberStyle}>({number})</div>
          <HissanDivisionJapanese
            dividend={hissanProblem.operand1}
            divisor={hissanProblem.operand2}
            quotient={hissanProblem.answer}
            remainder={hissanProblem.remainder}
            showAnswer={showAnswer}
          />
        </div>
      );
    }

    // その他の筆算（たし算、ひき算、かけ算）
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

    // 答え行の桁数（かけ算は digits1+digits2、それ以外は maxLength+1）
    // 横線は答え行と同じ幅に揃える
    const answerWidth =
      hissanProblem.operation === 'multiplication'
        ? digits1.length + digits2.length
        : maxLength + 1;

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
            {Array(maxLength - digits2.length)
              .fill('')
              .map((_, i) => (
                <span key={`pad-${i}`} style={hissanCellStyle}>
                  {'\u00A0'}
                </span>
              ))}
            <span style={hissanCellStyle}>{operator}</span>
            {paddedDigits2.map((d, i) => (
              <span key={i} style={hissanCellStyle}>
                {d === '' ? '\u00A0' : d}
              </span>
            ))}
          </div>

          {/* 横線（答え行と同じ幅に揃える） */}
          <div style={getHissanLineStyle(answerWidth - 1)} />

          {/* 多桁乗算の部分積記入欄（digits2 が 2 桁以上のかけ算のみ） */}
          {hissanProblem.operation === 'multiplication' &&
            digits2.length >= 2 &&
            !showAnswer && (
              <PartialProductBoxes
                digits1Length={digits1.length}
                digits2Length={digits2.length}
                lineBoxCount={answerWidth}
              />
            )}

          {/* 答え */}
          <HissanAnswerRow
            answerWidth={answerWidth}
            answerDigits={answerDigits}
            showAnswer={showAnswer && !!hissanProblem.answer}
          />
        </div>
      </div>
    );
  }

  // 基本的な問題の場合（整数）
  const basicProblem = problem as BasicProblem;

  // 多項演算（3数以上）の場合
  if (basicProblem.operands && basicProblem.operators) {
    return (
      <div className="problem-text" style={problemItemStyle}>
        <div style={problemNumberStyle}>({number})</div>
        <div style={problemTextStyle}>
          {basicProblem.operands.map((operand, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 &&
                ` ${multiOperandSymbols[basicProblem.operators![idx - 1]]} `}
              {operand}
            </React.Fragment>
          ))}
          {' = '}
          {showAnswer && basicProblem.answer !== null ? (
            <span style={answerDisplayStyle}>{basicProblem.answer}</span>
          ) : (
            <span style={answerUnderlineStyle} />
          )}
        </div>
      </div>
    );
  }

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
          <span style={answerDisplayStyle}>{basicProblem.answer}</span>
        ) : (
          <span style={answerUnderlineStyle} />
        )}
      </div>
    </div>
  );
}
