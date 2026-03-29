import React from 'react';
import type { ComparisonDiagram } from '../../../types';

interface ComparisonDiagramProps {
  diagram: ComparisonDiagram;
}

const BAR_HEIGHT = 26;

const barBaseStyle: React.CSSProperties = {
  height: `${BAR_HEIGHT}px`,
  border: '1.5px solid #000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 500,
  boxSizing: 'border-box',
};

export const ComparisonDiagramComponent: React.FC<ComparisonDiagramProps> = ({
  diagram,
}) => {
  const { bars, differenceValue, multiplicative, multiplier, hidden } = diagram;
  const maxValue = Math.max(...bars.map((b) => b.value));
  const hideDifference = hidden === 'difference';

  return (
    <div style={{ width: '100%', maxWidth: '280px' }}>
      {bars.map((bar, i) => {
        const isHidden = typeof hidden === 'number' && hidden === i;
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
              gap: '6px',
            }}
          >
            <div
              style={{
                width: '48px',
                fontSize: '11px',
                textAlign: 'right',
                flexShrink: 0,
              }}
            >
              {bar.label}
            </div>
            <div
              style={{
                ...barBaseStyle,
                width: `${(bar.value / maxValue) * 100}%`,
                minWidth: '36px',
                flex: 'none',
              }}
            >
              {isHidden ? '?' : bar.value}
            </div>
          </div>
        );
      })}

      {/* Difference/multiplier annotation */}
      <div
        style={{
          marginLeft: '54px',
          fontSize: '11px',
          color: '#333',
          marginTop: '1px',
        }}
      >
        {multiplicative && multiplier
          ? `× ${multiplier}`
          : differenceValue > 0
            ? hideDifference
              ? 'Difference: ?'
              : `Difference: ${differenceValue}`
            : null}
      </div>
    </div>
  );
};
