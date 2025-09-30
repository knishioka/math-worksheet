import React from 'react';
import type {
  Problem,
  LayoutColumns,
  FractionProblem,
  DecimalProblem,
  MixedNumberProblem,
  BasicProblem,
  WordProblem,
} from '../../types';
import {
  MathFraction,
  MathDecimal,
  MathMixedNumber,
} from '../Math/MathExpression';
import { MissingNumberBox } from '../Math/MissingNumberBox';

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
      <div className="problem-text space-y-1">
        <div className="text-xs text-gray-600">({number})</div>
        <div className="flex items-center space-x-2">
          <MathFraction
            numerator={fractionProblem.numerator1}
            denominator={fractionProblem.denominator1}
          />
          <span className="font-mono text-lg">{operationSymbol}</span>
          {fractionProblem.numerator2 !== undefined &&
            fractionProblem.denominator2 !== undefined && (
              <MathFraction
                numerator={fractionProblem.numerator2}
                denominator={fractionProblem.denominator2}
              />
            )}
          <span className="font-mono text-lg">=</span>
          {showAnswer ? (
            <MathFraction
              numerator={fractionProblem.answerNumerator}
              denominator={fractionProblem.answerDenominator}
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
      <div className="problem-text space-y-1">
        <div className="text-xs text-gray-600">({number})</div>
        <div className="space-y-2">
          <div className="text-sm">{wordProblem.problemText}</div>
          {showAnswer ? (
            <div className="text-red-600 font-bold">
              答え: {wordProblem.answer}
              {wordProblem.unit && wordProblem.unit}
            </div>
          ) : (
            <div className="flex items-baseline">
              <span className="text-sm mr-2">答え:</span>
              <span
                className="inline-block w-24 border-b border-black mx-1"
                style={{ height: '1.5rem' }}
              />
              {wordProblem.unit && (
                <span className="text-sm ml-1">{wordProblem.unit}</span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 基本的な問題の場合（整数）
  const basicProblem = problem as BasicProblem;

  return (
    <div className="problem-text space-y-1">
      <div className="text-xs text-gray-600">({number})</div>
      <div className="flex items-center space-x-2">
        {basicProblem.missingPosition === 'operand1' ? (
          // 虫食い算でoperand1が虫食いの場合
          <MissingNumberBox />
        ) : (
          // 通常の数値表示
          <span className="font-mono text-lg">{basicProblem.operand1}</span>
        )}
        <span className="font-mono text-lg">{operationSymbol}</span>
        {basicProblem.missingPosition === 'operand2' ? (
          // 虫食い算でoperand2が虫食いの場合
          <MissingNumberBox />
        ) : (
          // 通常の数値表示
          <span className="font-mono text-lg">{basicProblem.operand2}</span>
        )}
        <span className="font-mono text-lg">=</span>
        {basicProblem.missingPosition === 'answer' ||
        !basicProblem.missingPosition ? (
          // 答えが虫食いの場合、または虫食いでない通常問題の場合
          showAnswer ? (
            <span className="font-mono text-lg text-red-600 font-bold">
              {formatAnswer(problem)}
            </span>
          ) : (
            <span
              className="inline-block w-16 border-b border-black mx-1 align-bottom"
              style={{ height: '1.5rem' }}
            />
          )
        ) : (
          // 虫食い算で答えが虫食いでない場合（operand1またはoperand2が虫食い）、答えを問題として表示
          <span className="font-mono text-lg">{basicProblem.answer}</span>
        )}
      </div>
    </div>
  );
};

function formatAnswer(problem: Problem): string {
  if (problem.type === 'basic') {
    const basicProblem = problem as BasicProblem;

    // 虫食い算で答えが虫食いの場合、operand1とoperand2から計算
    if (
      basicProblem.missingPosition === 'answer' &&
      basicProblem.operand1 !== null &&
      basicProblem.operand2 !== null
    ) {
      switch (basicProblem.operation) {
        case 'addition':
          return (basicProblem.operand1 + basicProblem.operand2).toString();
        case 'subtraction':
          return (basicProblem.operand1 - basicProblem.operand2).toString();
        case 'multiplication':
          return (basicProblem.operand1 * basicProblem.operand2).toString();
        case 'division': {
          const quotient = Math.floor(
            basicProblem.operand1 / basicProblem.operand2
          );
          const remainder = basicProblem.operand1 % basicProblem.operand2;
          if (remainder === 0) {
            return quotient.toString();
          } else {
            return `${quotient}あまり${remainder}`;
          }
        }
      }
    }

    // 通常の問題またはanswerが設定されている場合
    if (basicProblem.answer !== null) {
      // わり算の余りがある場合の処理
      if (
        basicProblem.operation === 'division' &&
        basicProblem.operand1 !== null &&
        basicProblem.operand2 !== null
      ) {
        const remainder = basicProblem.operand1 % basicProblem.operand2;
        if (remainder !== 0) {
          return `${basicProblem.answer}あまり${remainder}`;
        }
      }
      return basicProblem.answer.toString();
    }
  }

  if ('answer' in problem && problem.answer !== null) {
    return problem.answer.toString();
  }

  return '';
}
