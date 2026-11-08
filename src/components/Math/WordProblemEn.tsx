import React from 'react';
import type { WordProblemEn } from '../../types';
import { EquationLine } from './EquationLine';
import {
  wordProblemAnswerRowStyle,
  wordProblemAnswerUnderlineStyle,
} from '../../config/styles';

interface WordProblemEnProps {
  problem: WordProblemEn;
  showAnswer?: boolean;
  showEquationLine?: boolean;
}

/**
 * English Word Problem Display Component
 * Displays English word problems with proper formatting
 */
export const WordProblemEnComponent: React.FC<WordProblemEnProps> = ({
  problem,
  showAnswer = false,
  showEquationLine = false,
}) => {
  const ANSWER_LINE_CATEGORIES = new Set([
    'word-story',
    'missing-number',
    'comparison',
    'bar-model',
    'number-bond',
    'multi-step',
  ]);

  return (
    <div
      style={{
        textAlign: 'left',
        fontSize: '15px',
        lineHeight: '1.3',
        color: '#000',
      }}
    >
      <div style={{ marginBottom: '2px' }}>{problem.problemText}</div>

      {showAnswer && problem.solutionSteps && (
        <ol
          aria-label="Solution"
          style={{
            margin: '4px 0',
            paddingLeft: '1.5em',
            fontSize: '12px',
            lineHeight: '1.3',
            listStyleType: 'decimal',
            overflowWrap: 'anywhere',
          }}
        >
          {problem.solutionSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )}

      {ANSWER_LINE_CATEGORIES.has(problem.category) && (
        <>
          {showEquationLine && (
            <EquationLine
              label="Equation:"
              labelColor="#000"
              labelFontSize="13px"
              minWidth="3.5rem"
            />
          )}
          <div style={wordProblemAnswerRowStyle}>
            <span style={{ color: '#000', fontSize: '13px' }}>Answer:</span>
            <div
              style={{
                ...wordProblemAnswerUnderlineStyle,
                minWidth: '3.5rem',
                maxWidth: '10rem',
              }}
            >
              {showAnswer && (
                <span style={{ fontWeight: '500', color: '#000' }}>
                  {problem.answer}
                  {problem.unit && ` ${problem.unit}`}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WordProblemEnComponent;
