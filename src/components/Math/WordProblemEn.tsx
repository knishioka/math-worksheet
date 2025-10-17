import React from 'react';
import type { WordProblemEn } from '../../types';

interface WordProblemEnProps {
  problem: WordProblemEn;
  showAnswer?: boolean;
}

/**
 * English Word Problem Display Component
 * Displays English word problems with proper formatting
 */
export const WordProblemEnComponent: React.FC<WordProblemEnProps> = ({
  problem,
  showAnswer = false,
}) => {
  return (
    <div style={{ textAlign: 'left', fontSize: '15px', lineHeight: '1.3', color: '#000' }}>
      <div style={{ marginBottom: '2px' }}>
        {problem.problemText}
      </div>

      {problem.category === 'word-story' && (
        <div style={{ marginTop: '4px', display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <span style={{ color: '#000', fontSize: '13px' }}>Answer:</span>
          <div style={{ borderBottom: '1.5px solid #000', minWidth: '3.5rem', padding: '0 6px', height: '1.1em' }}>
            {showAnswer && (
              <span style={{ fontWeight: '500', color: '#000' }}>
                {problem.answer}
                {problem.unit && ` ${problem.unit}`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WordProblemEnComponent;
