import type { ReactElement, ReactNode } from 'react';
import type { CubeSectionFigure } from '../../../types';
import { GeometryDiagram } from './GeometryDiagrams';

export function CubeSectionDiagram({
  figure,
  english,
}: {
  figure: CubeSectionFigure;
  english: boolean;
}): ReactElement {
  let section: ReactNode;
  let description: string;
  switch (figure.kind) {
    case 'corner-marks': {
      const fraction = figure.distance / figure.edge;
      section = (
        <g>
          <circle cx={117 - 68 * fraction} cy="27" r="3" />
          <circle cx={117} cy={27 + 56 * fraction} r="3" />
          <circle cx={117 + 26 * fraction} cy={27 - 18 * fraction} r="3" />
        </g>
      );
      description = english
        ? 'Three dots mark the edges meeting at the top front right corner.'
        : '手前の右上の頂点から出る三本の辺に、黒い点が一つずつある。';
      break;
    }
    case 'level-slice': {
      const y = 83 - (56 * figure.height) / figure.edge;
      section = (
        <g>
          <path d={`M49 ${y} h68 l26 -18 h-68 Z`} fill="#ccc" />
          <path
            d={`M49 ${y} h68 l26 -18`}
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
          <path
            d={`M49 ${y} l26 -18 h68`}
            fill="none"
            stroke="black"
            strokeDasharray="3 2"
          />
        </g>
      );
      description = english
        ? 'A horizontal cutting plane passes through the four upright edges.'
        : '四本の縦の辺を横切る水平な切り口が灰色。';
      break;
    }
    case 'diagonal-slice':
      section = (
        <g>
          <path d="M49 27 L143 9 V65 L49 83 Z" fill="#ccc" />
          <path d="M49 27 L143 9" stroke="black" />
          <path
            d="M49 83 L143 65"
            fill="none"
            stroke="black"
            strokeDasharray="4 2"
          />
        </g>
      );
      description = english
        ? 'The cutting plane goes through the front left and back right vertical edges.'
        : '手前の左と奥の右の縦の辺を通る切り口が灰色。';
      break;
  }
  return (
    <GeometryDiagram
      description={
        english
          ? `Cube with edge length ${figure.edge} cm. ${description}`
          : `一辺${figure.edge}cmの立方体。${description}`
      }
    >
      <path
        d="M49 83 l26 -18 V9 M75 65 h68"
        fill="none"
        stroke="#666"
        strokeDasharray="3 3"
      />
      {section}
      <path
        d="M49 83 V27 H117 V83 Z M49 27 L75 9 H143 V65 L117 83 M117 27 L143 9"
        fill="none"
        stroke="black"
      />
      <text x="83" y="98">
        {figure.edge} cm
      </text>
    </GeometryDiagram>
  );
}
