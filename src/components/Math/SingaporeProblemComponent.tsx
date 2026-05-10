import React from 'react';
import type { SingaporeProblem } from '../../types';
import { BarModelDiagramComponent } from './diagrams/BarModelDiagram';
import { NumberBondDiagramComponent } from './diagrams/NumberBondDiagram';
import { ComparisonDiagramComponent } from './diagrams/ComparisonDiagram';
import {
  wordProblemAnswerRowStyle,
  wordProblemAnswerUnderlineStyle,
} from '../../config/styles';

interface SingaporeProblemComponentProps {
  problem: SingaporeProblem;
  showAnswer?: boolean;
}

export const SingaporeProblemComponent: React.FC<
  SingaporeProblemComponentProps
> = ({ problem, showAnswer = false }) => {
  const { diagram, problemText, answer, unit, category } = problem;

  return (
    <div
      style={{
        textAlign: 'left',
        fontSize: '14px',
        lineHeight: '1.3',
        color: '#000',
      }}
    >
      {/* Diagram */}
      {diagram && (
        <div style={{ marginBottom: '4px' }}>
          {diagram.diagramType === 'bar-model' && (
            <BarModelDiagramComponent diagram={diagram} />
          )}
          {diagram.diagramType === 'number-bond' && (
            <NumberBondDiagramComponent diagram={diagram} />
          )}
          {diagram.diagramType === 'comparison' && (
            <ComparisonDiagramComponent diagram={diagram} />
          )}
        </div>
      )}

      {/* Problem text */}
      <div style={{ marginBottom: '2px' }}>{problemText}</div>

      {/* Answer line — shown for all Singapore Math categories */}
      <div style={wordProblemAnswerRowStyle}>
        <span style={{ color: '#000', fontSize: '12px' }}>Answer:</span>
        <div
          style={{
            ...wordProblemAnswerUnderlineStyle,
            flex: category === 'number-bond' ? '0 1 4rem' : '1 1 4.5rem',
            minWidth: category === 'number-bond' ? '2.5rem' : '3.5rem',
            maxWidth: category === 'number-bond' ? '5rem' : '10rem',
          }}
        >
          {showAnswer && (
            <span style={{ fontWeight: 500, color: '#000' }}>
              {answer}
              {unit && ` ${unit}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
