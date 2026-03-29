import React from 'react';
import type { SingaporeProblem } from '../../types';
import { BarModelDiagramComponent } from './diagrams/BarModelDiagram';
import { NumberBondDiagramComponent } from './diagrams/NumberBondDiagram';
import { ComparisonDiagramComponent } from './diagrams/ComparisonDiagram';

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

      {/* Answer line */}
      {(category === 'bar-model' ||
        category === 'comparison' ||
        category === 'multi-step') && (
        <div
          style={{
            marginTop: '4px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '6px',
          }}
        >
          <span style={{ color: '#000', fontSize: '12px' }}>Answer:</span>
          <div
            style={{
              borderBottom: '1.5px solid #000',
              minWidth: '3.5rem',
              padding: '0 6px',
              height: '1.1em',
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
      )}

      {/* Number bond: answer inline */}
      {category === 'number-bond' && (
        <div
          style={{
            marginTop: '4px',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '6px',
          }}
        >
          <span style={{ color: '#000', fontSize: '12px' }}>Answer:</span>
          <div
            style={{
              borderBottom: '1.5px solid #000',
              minWidth: '2.5rem',
              padding: '0 6px',
              height: '1.1em',
            }}
          >
            {showAnswer && (
              <span style={{ fontWeight: 500, color: '#000' }}>{answer}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
