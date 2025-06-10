import React from 'react';
import type { Problem, LayoutColumns } from '../../types';

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

  return (
    <div className={`grid ${gridCols} gap-4 avoid-break`}>
      {problems.map((problem, index) => (
        <div key={problem.id} className="avoid-break">
          <ProblemItem
            problem={problem}
            number={index + 1}
            showAnswer={showAnswers}
          />
        </div>
      ))}
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

  return (
    <div className="problem-text space-y-2">
      <div className="text-sm text-gray-600">({number})</div>
      <div className="flex items-center space-x-2">
        <span className="font-mono text-lg">{problem.operand1}</span>
        <span className="font-mono text-lg">{operationSymbol}</span>
        <span className="font-mono text-lg">{problem.operand2}</span>
        <span className="font-mono text-lg">=</span>
        {showAnswer ? (
          <span className="font-mono text-lg text-red-600 font-bold">
            {formatAnswer(problem)}
          </span>
        ) : (
          <span className="answer-line" />
        )}
      </div>
    </div>
  );
};

function formatAnswer(problem: Problem): string {
  if (problem.operation === 'division') {
    // For division, check if there's a remainder
    const quotient = Math.floor(problem.operand1 / problem.operand2);
    const remainder = problem.operand1 % problem.operand2;
    
    if (remainder === 0) {
      return quotient.toString();
    } else {
      return `${quotient}あまり${remainder}`;
    }
  }
  
  return problem.answer.toString();
}