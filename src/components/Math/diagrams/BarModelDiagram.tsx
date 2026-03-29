import React from 'react';
import type { BarModelDiagram } from '../../../types';

interface BarModelDiagramProps {
  diagram: BarModelDiagram;
}

const BAR_HEIGHT = 28;
const LABEL_HEIGHT = 16;
const BRACKET_WIDTH = 8;

const barStyle: React.CSSProperties = {
  height: `${BAR_HEIGHT}px`,
  border: '1.5px solid #000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: 500,
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  textAlign: 'center',
  lineHeight: `${LABEL_HEIGHT}px`,
  color: '#333',
};

function PartWholeDiagram({
  diagram,
}: {
  diagram: Extract<BarModelDiagram, { variant: 'part-whole' }>;
}): React.ReactElement {
  const { totalValue, segments, hidden } = diagram;
  const hideTotal = hidden === 'total';

  return (
    <div style={{ width: '100%', maxWidth: '260px' }}>
      {/* Total bracket + label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2px',
        }}
      >
        <svg
          width={BRACKET_WIDTH}
          height={BAR_HEIGHT + 4}
          style={{ flexShrink: 0, marginRight: '4px' }}
        >
          <path
            d={`M ${BRACKET_WIDTH - 2} 2 L 2 2 L 2 ${BAR_HEIGHT + 2} L ${BRACKET_WIDTH - 2} ${BAR_HEIGHT + 2}`}
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
        <div style={{ ...barStyle, flex: 1, background: '#f0f0f0' }}>
          {hideTotal ? '?' : totalValue}
        </div>
      </div>

      {/* Segments */}
      <div style={{ display: 'flex', marginLeft: `${BRACKET_WIDTH + 4}px` }}>
        {segments.map((seg, i) => {
          const proportion = seg.value / totalValue;
          const isHidden = typeof hidden === 'number' && hidden === i;
          return (
            <div
              key={i}
              style={{
                flex: `${proportion} 0 0`,
                minWidth: '30px',
              }}
            >
              <div
                style={{
                  ...barStyle,
                  borderLeft: i === 0 ? '1.5px solid #000' : 'none',
                }}
              >
                {isHidden ? '?' : seg.value}
              </div>
              {seg.label && <div style={labelStyle}>{seg.label}</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ComparisonBarDiagram({
  diagram,
}: {
  diagram: Extract<BarModelDiagram, { variant: 'comparison' }>;
}): React.ReactElement {
  const { bars, differenceValue, hidden } = diagram;
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
              marginBottom: i < bars.length - 1 ? '4px' : '0',
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
                ...barStyle,
                width: `${(bar.value / maxValue) * 100}%`,
                minWidth: '40px',
                maxWidth: '100%',
                flex: 'none',
              }}
            >
              {isHidden ? '?' : bar.value}
            </div>
          </div>
        );
      })}

      {/* Difference bracket */}
      {differenceValue > 0 && bars.length === 2 && (
        <div
          style={{
            marginLeft: '54px',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <div
            style={{
              width: `${(Math.abs(bars[0].value - bars[1].value) / maxValue) * 100}%`,
              minWidth: '30px',
              textAlign: 'center',
              fontSize: '11px',
              borderTop: '1.5px solid #666',
              paddingTop: '1px',
              marginLeft: `${(Math.min(bars[0].value, bars[1].value) / maxValue) * 100}%`,
            }}
          >
            {hideDifference ? '?' : differenceValue}
          </div>
        </div>
      )}
    </div>
  );
}

export const BarModelDiagramComponent: React.FC<BarModelDiagramProps> = ({
  diagram,
}) => {
  if (diagram.variant === 'part-whole') {
    return <PartWholeDiagram diagram={diagram} />;
  }
  return <ComparisonBarDiagram diagram={diagram} />;
};
