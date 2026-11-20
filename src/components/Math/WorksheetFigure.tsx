import type { ReactElement } from 'react';
import type { WorksheetFigure as Figure } from '../../types';

export function WorksheetFigure({
  figure,
  english = false,
}: {
  figure: Figure;
  english?: boolean;
}): ReactElement {
  if (figure.kind === 'cube-net') {
    const { first } = figure;
    return (
      <svg
        role="img"
        aria-label={
          english
            ? `Cube net. A row reads ${first}, ${first + 1}, ${first + 2}, ${first + 3}. A square lies above and below the second face.`
            : `展開図。左から${first}、${first + 1}、${first + 2}、${first + 3}の四面が並び、二番目の面の上下に一面ずつある。`
        }
        viewBox="0 0 100 75"
        style={{ height: '68px', maxWidth: '100%' }}
      >
        {[
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [3, 1],
          [1, 2],
        ].map(([x, y]) => (
          <g key={x + '-' + y}>
            <rect
              x={x * 24 + 1}
              y={y * 24 + 1}
              width={24}
              height={24}
              fill="white"
              stroke="black"
            />
            {y === 1 && (
              <text
                x={x * 24 + 13}
                y={y * 24 + 17}
                textAnchor="middle"
                fontSize={13}
              >
                {first + x}
              </text>
            )}
          </g>
        ))}
      </svg>
    );
  }
  const { firstMinute, lastMinute, firstDepth, lastDepth } = figure;
  const x = 27 + (108 * firstMinute) / lastMinute;
  const y = 67 - (51 * firstDepth) / lastDepth;
  const description = english
    ? `Depth graph: 0 cm at 0 min, ${firstDepth} cm at ${firstMinute} min, ${lastDepth} cm at ${lastMinute} min`
    : `水深のグラフ。0分に0cm、${firstMinute}分に${firstDepth}cm、${lastMinute}分に${lastDepth}cm`;
  return (
    <svg
      role="img"
      aria-label={description}
      viewBox="0 0 175 85"
      style={{ height: '85px', maxWidth: '100%' }}
    >
      <g fill="none" stroke="black">
        <path d="M27 5 V67 H151" />
        <path
          d={`M27 ${y} H${x} V67 M27 16 H135 V67`}
          strokeDasharray="2 2"
          stroke="#666"
        />
        <path d={`M27 67 L${x} ${y} L135 16`} strokeWidth="2" />
      </g>
      <g fill="black" fontSize="10">
        <text x="3" y="9">
          cm
        </text>
        <text x="151" y="78">
          {english ? 'min' : '分'}
        </text>
        <text x="22" y="78" textAnchor="end">
          0
        </text>
        <text x="23" y={y + 3} textAnchor="end">
          {firstDepth}
        </text>
        <text x="23" y="19" textAnchor="end">
          {lastDepth}
        </text>
        <text x={x} y="80" textAnchor="middle">
          {firstMinute}
        </text>
        <text x="135" y="80" textAnchor="middle">
          {lastMinute}
        </text>
      </g>
    </svg>
  );
}
