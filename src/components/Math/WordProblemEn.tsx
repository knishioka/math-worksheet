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
    <div style={{ textAlign: 'left', fontSize: '14px', lineHeight: '1.6', color: '#000' }}>
      <div style={{ marginBottom: '8px' }}>
        {problem.problemText}
      </div>

      {problem.category === 'word-story' && (
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          <span style={{ color: '#000', fontSize: '12px' }}>Answer:</span>
          <div style={{ borderBottom: '2px solid #000', minWidth: '4rem', padding: '0 8px', height: '1.2em' }}>
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
