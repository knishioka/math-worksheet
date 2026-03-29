import React from 'react';
import type { NumberBondDiagram } from '../../../types';

interface NumberBondDiagramProps {
  diagram: NumberBondDiagram;
}

const CIRCLE_R = 18;
const CIRCLE_STROKE = 1.5;
const FONT_SIZE = 12;

export const NumberBondDiagramComponent: React.FC<NumberBondDiagramProps> = ({
  diagram,
}) => {
  const { whole, parts, hidden } = diagram;
  const partCount = parts.length;
  const hideWhole = hidden === 'whole';

  // Layout calculations
  const cx = 70; // center x for whole circle
  const wholeY = CIRCLE_R + 4;
  const partY = wholeY + 50;
  const partSpacing = 50;
  const totalPartWidth = (partCount - 1) * partSpacing;
  const startX = cx - totalPartWidth / 2;

  const svgWidth = Math.max(140, totalPartWidth + CIRCLE_R * 2 + 20);
  const svgHeight = partY + CIRCLE_R + 6;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {/* Lines from whole to parts */}
      {parts.map((_, i) => {
        const partX = startX + i * partSpacing;
        return (
          <line
            key={`line-${i}`}
            x1={cx}
            y1={wholeY + CIRCLE_R}
            x2={partX}
            y2={partY - CIRCLE_R}
            stroke="currentColor"
            strokeWidth={CIRCLE_STROKE}
          />
        );
      })}

      {/* Whole circle */}
      <circle
        cx={cx}
        cy={wholeY}
        r={CIRCLE_R}
        stroke="currentColor"
        strokeWidth={CIRCLE_STROKE}
        fill="white"
      />
      <text
        x={cx}
        y={wholeY + FONT_SIZE / 3}
        textAnchor="middle"
        fontSize={FONT_SIZE}
        fontWeight={500}
        fill="currentColor"
      >
        {hideWhole ? '?' : whole}
      </text>

      {/* Part circles */}
      {parts.map((part, i) => {
        const partX = startX + i * partSpacing;
        const isHidden = typeof hidden === 'number' && hidden === i;
        return (
          <g key={`part-${i}`}>
            <circle
              cx={partX}
              cy={partY}
              r={CIRCLE_R}
              stroke="currentColor"
              strokeWidth={CIRCLE_STROKE}
              fill="white"
            />
            <text
              x={partX}
              y={partY + FONT_SIZE / 3}
              textAnchor="middle"
              fontSize={FONT_SIZE}
              fontWeight={500}
              fill="currentColor"
            >
              {isHidden ? '?' : part}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
