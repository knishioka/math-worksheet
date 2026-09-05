import type { ReactNode } from 'react';
import type { WordProblem } from '../../types';

export function DataDisplay({
  data,
}: {
  data: NonNullable<WordProblem['dataDisplay']>;
}): ReactNode {
  if (data.kind === 'table')
    return (
      <table className="worksheet-data-table">
        <caption>{data.label}</caption>
        <thead>
          <tr>
            {data.entries.map((entry) => (
              <th key={entry.label} scope="col">
                {entry.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {data.entries.map((entry) => (
              <td key={entry.label}>
                {entry.value}
                {data.unit}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    );
  return (
    <svg
      viewBox="0 0 240 112"
      role="img"
      aria-label={`${data.label}。${data.entries.map((entry) => `${entry.label}${entry.value}${data.unit}`).join('、')}`}
      className="worksheet-bar-chart"
    >
      <text x="4" y="12" fontSize="10">
        {data.label}（{data.unit}）
      </text>
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line
            x1={76 + i * 15}
            y1="24"
            x2={76 + i * 15}
            y2="87"
            stroke="#d1d5db"
          />
          <text x={76 + i * 15} y="102" textAnchor="middle" fontSize="10">
            {i}
          </text>
        </g>
      ))}
      {data.entries.map((entry, i) => (
        <g key={entry.label}>
          <text x="2" y={44 + i * 32} fontSize="10">
            {entry.label}
          </text>
          <rect
            x="76"
            y={29 + i * 32}
            width={entry.value * 15}
            height="22"
            fill="#d1d5db"
            stroke="#111827"
          />
        </g>
      ))}
    </svg>
  );
}
