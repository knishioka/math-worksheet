import React from 'react';
import type {
  Problem,
  LayoutColumns,
  FractionProblem,
  DecimalProblem,
  MixedNumberProblem,
  BasicProblem,
  WordProblem,
  HissanProblem,
} from '../../types';
import { MathDecimal, MathMixedNumber } from '../Math/MathExpression';
import {
  calculateMissingOperand1,
  calculateMissingOperand2,
  calculateMissingAnswer,
} from '../../lib/utils/missing-number-calculator';

interface ProblemListProps {
  problems: Problem[];
  layoutColumns: LayoutColumns;
  showAnswers?: boolean;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  layoutColumns,
  showAnswers = false,
}) => {
  if (problems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        設定を確認して「問題を生成」ボタンをクリックしてください
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

  return (
    <div
      className={`grid ${gridCols} gap-x-3 gap-y-2 print:gap-y-1 avoid-break`}
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
  );
};

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
      <div className="problem-text" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>({number})</div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '18px',
            marginTop: '4px',
          }}
        >
          {/* 分子1 */}
          <span
            style={{
              display: 'inline-block',
              textAlign: 'center',
              verticalAlign: 'middle',
            }}
          >
            <span
              style={{
                display: 'block',
                borderBottom: '1px solid black',
                padding: '0 4px',
              }}
            >
              {fractionProblem.numerator1}
            </span>
            <span style={{ display: 'block', padding: '0 4px' }}>
              {fractionProblem.denominator1}
            </span>
          </span>
          {' ' + operationSymbol + ' '}
          {/* 分子2 */}
          {fractionProblem.numerator2 !== undefined &&
            fractionProblem.denominator2 !== undefined && (
              <span
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    borderBottom: '1px solid black',
                    padding: '0 4px',
                  }}
                >
                  {fractionProblem.numerator2}
                </span>
                <span style={{ display: 'block', padding: '0 4px' }}>
                  {fractionProblem.denominator2}
                </span>
              </span>
            )}
          {' = '}
          {/* 答え */}
          {showAnswer ? (
            <span
              style={{
                color: 'red',
                fontWeight: 'bold',
                display: 'inline-block',
                textAlign: 'center',
                verticalAlign: 'middle',
              }}
            >
              <span
                style={{
                  display: 'block',
                  borderBottom: '1px solid red',
                  padding: '0 4px',
                }}
              >
                {fractionProblem.answerNumerator}
              </span>
              <span style={{ display: 'block', padding: '0 4px' }}>
                {fractionProblem.answerDenominator}
              </span>
            </span>
          ) : (
            <span
              style={{
                display: 'inline-block',
                width: '64px',
                borderBottom: '1px solid black',
                marginLeft: '4px',
              }}
            />
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
      <div className="problem-text" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>({number})</div>
        <div style={{ fontSize: '12px', lineHeight: '1.3' }}>
          {wordProblem.problemText}
        </div>
        <div style={{ marginTop: '6px' }}>
          {showAnswer ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              答え: {wordProblem.answer}
              {wordProblem.unit && wordProblem.unit}
            </span>
          ) : (
            <>
              答え:{' '}
              <span
                style={{
                  display: 'inline-block',
                  width: '96px',
                  borderBottom: '1px solid black',
                  margin: '0 4px',
                }}
              />
              {wordProblem.unit && (
                <span style={{ fontSize: '14px' }}>{wordProblem.unit}</span>
              )}
            </>
          )}
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
      <div className="problem-text" style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#666' }}>({number})</div>
        <div
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '18px',
            display: 'inline-block',
            textAlign: 'right',
            lineHeight: '1.2',
            margin: '10px 0',
          }}
        >
          {/* 1つ目の数 */}
          <div style={{ whiteSpace: 'nowrap' }}>
            {paddedDigits1.map((d, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: '30px',
                  textAlign: 'center',
                }}
              >
                {d === '' ? '\u00A0' : d}
              </span>
            ))}
          </div>

          {/* 演算子と2つ目の数 */}
          <div style={{ whiteSpace: 'nowrap' }}>
            {/* 演算子を数字の左に配置（digits2の長さに応じて左側にパディング） */}
            {Array(maxLength - digits2.length).fill('').map((_, i) => (
              <span
                key={`pad-${i}`}
                style={{
                  display: 'inline-block',
                  width: '30px',
                  textAlign: 'center',
                }}
              >
                {'\u00A0'}
              </span>
            ))}
            <span
              style={{
                display: 'inline-block',
                width: '30px',
                textAlign: 'center',
              }}
            >
              {operator}
            </span>
            {paddedDigits2.map((d, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  width: '30px',
                  textAlign: 'center',
                }}
              >
                {d === '' ? '\u00A0' : d}
              </span>
            ))}
          </div>

          {/* 横線 */}
          <div
            style={{
              borderTop: '2px solid black',
              margin: '2px 0',
              width: `${maxLength * 30 + 30}px`,
            }}
          />

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
                        display: 'inline-block',
                        width: '30px',
                        textAlign: 'center',
                        color: 'red',
                        fontWeight: 'bold',
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
                    <span
                      key={i}
                      style={{
                        display: 'inline-block',
                        width: '30px',
                        height: '30px',
                        border: '1px solid #ccc',
                        margin: '0 2px',
                      }}
                    />
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
    <div className="problem-text" style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', color: '#666' }}>({number})</div>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '18px',
          marginTop: '4px',
        }}
      >
        {/* operand1 */}
        {basicProblem.operand1 !== null ? (
          basicProblem.operand1
        ) : showAnswer ? (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {calculateMissingOperand1(basicProblem)}
          </span>
        ) : (
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '1.5px solid #333',
              backgroundColor: '#f9f9f9',
              verticalAlign: 'text-bottom',
            }}
          />
        )}
        {' ' + operationSymbol + ' '}
        {/* operand2 */}
        {basicProblem.operand2 !== null ? (
          basicProblem.operand2
        ) : showAnswer ? (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {calculateMissingOperand2(basicProblem)}
          </span>
        ) : (
          <span
            style={{
              display: 'inline-block',
              width: '24px',
              height: '24px',
              border: '1.5px solid #333',
              backgroundColor: '#f9f9f9',
              verticalAlign: 'text-bottom',
            }}
          />
        )}
        {' = '}
        {/* 答え */}
        {basicProblem.missingPosition === 'answer' ? (
          showAnswer ? (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              {calculateMissingAnswer(basicProblem)}
            </span>
          ) : (
            <span
              style={{
                display: 'inline-block',
                width: '24px',
                height: '24px',
                border: '1.5px solid #333',
                backgroundColor: '#f9f9f9',
                verticalAlign: 'text-bottom',
              }}
            />
          )
        ) : showAnswer && basicProblem.missingPosition ? (
          <span style={{ fontFamily: 'monospace', fontSize: '18px' }}>
            {basicProblem.answer}
          </span>
        ) : showAnswer && basicProblem.answer !== null ? (
          <span style={{ color: 'red', fontWeight: 'bold' }}>
            {basicProblem.answer}
          </span>
        ) : (
          <span
            style={{
              display: 'inline-block',
              width: '64px',
              borderBottom: '1px solid black',
              marginLeft: '4px',
            }}
          />
        )}
      </div>
    </div>
  );
};

