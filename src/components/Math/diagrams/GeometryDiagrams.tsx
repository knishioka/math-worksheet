import type { ReactElement, ReactNode } from 'react';
import type { GardenFigure, WorksheetFigure } from '../../../types';

const shade = '#c8c8c8';

export function GeometryDiagram({
  description,
  children,
}: {
  description: string;
  children: ReactNode;
}): ReactElement {
  return (
    <svg
      role="img"
      aria-label={description}
      viewBox="0 0 186 100"
      width="186"
      height="100"
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
      fontSize="13"
      textAnchor="middle"
      fill="black"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

type PlaneFigure = Extract<
  WorksheetFigure,
  { kind: 'rectangle' | 'polygon' | 'split-angle' | 'circle' }
>;

export function SchoolGeometryDiagram({
  figure,
}: {
  figure: PlaneFigure;
}): ReactElement {
  switch (figure.kind) {
    case 'polygon':
      return (
        <GeometryDiagram
          description={
            figure.sides === 3
              ? '直線を順にたどると、右、左上、左下に進み、出発点に戻る形。'
              : '直線を順にたどると、右、右上、左上、左下に進み、出発点に戻る形。'
          }
        >
          <polygon
            points={
              figure.sides === 3
                ? '25,82 151,82 70,13'
                : '25,82 132,82 155,27 62,13'
            }
            fill="none"
            stroke="black"
          />
        </GeometryDiagram>
      );
    case 'rectangle': {
      const { width, height } = figure;
      const scale = Math.min(123 / width, 70 / height);
      const w = width * scale;
      const h = height * scale;
      return (
        <GeometryDiagram
          description={`横${width}cm、たて${height}cmの四角形。四つの角は直角。`}
        >
          <rect
            x={105 - w / 2}
            y={45 - h / 2}
            width={w}
            height={h}
            fill="none"
            stroke="black"
          />
          <text x={105 - w / 2 - 5} y="49" textAnchor="end">
            {height} cm
          </text>
          <text x="105" y={61 + h / 2}>
            {width} cm
          </text>
        </GeometryDiagram>
      );
    }
    case 'circle':
      return (
        <GeometryDiagram
          description={`円の中心から円周までの線分に${figure.radius}cmと書かれている。`}
        >
          <circle cx="92" cy="50" r="43" fill="none" stroke="black" />
          <path d="M92 50 h43" stroke="black" />
          <circle cx="92" cy="50" r="2" />
          <text x="114" y="45" fontSize="11">
            {figure.radius} cm
          </text>
        </GeometryDiagram>
      );
    case 'split-angle': {
      const straight = figure.total === 180;
      const ox = straight ? 92 : 47;
      const radians = (figure.known * Math.PI) / 180;
      const dx = Math.cos(radians);
      const dy = -Math.sin(radians);
      return (
        <GeometryDiagram
          description={`Oから出る二本の線OAとOBが${straight ? '一直線' : '直角'}を作る。その間に線OCがあり、角AOCは${figure.known}度。`}
        >
          <g fill="none" stroke="black">
            <path d={`M${ox + 68} 76 H${ox} ${straight ? 'h-68' : 'V10'}`} />
            <path d={`M${ox} 76 l${60 * dx} ${60 * dy}`} />
            <path
              d={`M${ox + 19} 76 A19 19 0 0 0 ${ox + 19 * dx} ${76 + 19 * dy}`}
            />
          </g>
          <text x={ox - 4} y="92">
            O
          </text>
          <text x={ox + 73} y="87">
            A
          </text>
          <text x={straight ? ox - 73 : ox - 11} y={straight ? 87 : 13}>
            B
          </text>
          <text x={ox + 69 * dx} y={75 + 67 * dy}>
            C
          </text>
        </GeometryDiagram>
      );
    }
  }
}

export function GardenDiagram({
  figure,
  english,
}: {
  figure: GardenFigure;
  english: boolean;
}): ReactElement {
  const { width, height } = figure;
  const scale = Math.min(124 / width, 70 / height);
  const w = width * scale;
  const h = height * scale;
  const left = 104 - w / 2;
  const top = 45 - h / 2;
  let region: ReactNode;
  let description: string;
  switch (figure.kind) {
    case 'corner-garden': {
      const x = w - figure.cutWidth * scale;
      const y = figure.cutHeight * scale;
      region = <path d={`M0 0 H${x} V${y} H${w} V${h} H0 Z`} />;
      description = english
        ? 'The shaded garden excludes a rectangular path in the top right corner.'
        : '右上の長方形の通路を除いたL字形の花壇が灰色。';
      break;
    }
    case 'crossing-paths': {
      const p = figure.pathWidth * scale;
      const x = (w - p) / 2;
      const y = (h - p) / 2;
      region = (
        <path
          d={`M${x} 0 h${p} v${y} H${w} v${p} H${x + p} V${h} h${-p} V${y + p} H0 v${-p} H${x} Z`}
        />
      );
      description = english
        ? 'Two shaded paths of equal width cross at right angles and reach the four sides.'
        : '同じ幅の縦と横の道が十字に交わって庭を横切り、道全体が灰色。';
      break;
    }
    case 'garden-border': {
      const p = figure.pathWidth * scale;
      region = (
        <>
          <rect width={w} height={h} />
          <rect x={p} y={p} width={w - 2 * p} height={h - 2 * p} fill="white" />
        </>
      );
      description = english
        ? 'A shaded path runs inside all four edges. The centre is unshaded.'
        : '四辺の内側に沿う道が灰色。中央の長方形は白い。';
      break;
    }
  }
  return (
    <GeometryDiagram
      description={
        english
          ? `Garden, ${width} m wide and ${height} m tall. ${description}`
          : `横${width}m、縦${height}mの庭。${description}`
      }
    >
      <g transform={`translate(${left} ${top})`} fill={shade} stroke="black">
        <rect width={w} height={h} fill="white" />
        {region}
      </g>
      <text x={left - 5} y="49" textAnchor="end">
        {height} m
      </text>
      <text x="104" y={top + h + 15}>
        {width} m
      </text>
    </GeometryDiagram>
  );
}

export function TriangleRatioDiagram({
  figure,
  english,
}: {
  figure: Extract<
    WorksheetFigure,
    { kind: 'split-triangle' | 'trapezoid-diagonals' }
  >;
  english: boolean;
}): ReactElement {
  if (figure.kind === 'trapezoid-diagonals') {
    const { top, bottom } = figure;
    const halfTop = (76 * top) / bottom;
    const intersection = 12 + (68 * top) / (top + bottom);
    return (
      <GeometryDiagram
        description={
          english
            ? 'Both diagonals of the trapezoid are drawn. The triangle touching the top base is shaded.'
            : '台形の二本の対角線を引き、上底と交点でできる三角形を灰色にしている。'
        }
      >
        <g stroke="black" fill="none">
          <path d={`M${93 - halfTop} 12 H${93 + halfTop} L169 80 H17 Z`} />
          <path d={`M${93 - halfTop} 12 L169 80 M${93 + halfTop} 12 L17 80`} />
          <path
            d={`M${93 - halfTop} 12 H${93 + halfTop} L93 ${intersection} Z`}
            fill={shade}
          />
        </g>
      </GeometryDiagram>
    );
  }
  const { left, right, midpoint } = figure;
  const d = 15 + (154 * left) / (left + right);
  const e = (78 + d) / 2;
  const target = midpoint ? 'BDE' : 'ABD';
  return (
    <GeometryDiagram
      description={
        english
          ? `D splits base BC in the ratio BD to DC = ${left} to ${right}. Triangle ${target} is shaded.`
          : `底辺BC上のDで、BDとDCの比は${left}対${right}。三角形${target}が灰色。`
      }
    >
      <g stroke="black" fill="none">
        <path d={`M15 67 L78 14 L169 67 Z M78 14 L${d} 67`} />
        <path
          d={`M15 67 H${d} L${midpoint ? e : 78} ${midpoint ? 40.5 : 14} Z`}
          fill={shade}
        />
      </g>
      <text x="78" y="12">
        A
      </text>
      <text x="12" y="82">
        B
      </text>
      <text x={d} y="82">
        D
      </text>
      <text x="171" y="82">
        C
      </text>
      {midpoint && (
        <>
          <circle cx={e} cy="40.5" r="2" />
          <text x={e + 9} y="42">
            E
          </text>
        </>
      )}
      <text x="92" y="97">
        BD : DC = {left} : {right}
      </text>
    </GeometryDiagram>
  );
}

export function SectorDiagram({
  figure,
  english,
}: {
  figure: Extract<WorksheetFigure, { kind: 'sector' }>;
  english: boolean;
}): ReactElement {
  const { angle, highlight } = figure;
  const radians = (angle * Math.PI) / 180;
  const arc = (r: number): string =>
    `M${92 + r} 50 A${r} ${r} 0 ${angle > 180 ? 1 : 0} 0 ${92 + r * Math.cos(radians)} ${50 - r * Math.sin(radians)}`;
  return (
    <GeometryDiagram
      description={
        english
          ? `Sector with central angle ${angle} degrees.`
          : `中心角が${angle}度のおうぎ形。`
      }
    >
      <circle
        cx="92"
        cy="50"
        r="44"
        stroke="#777"
        strokeDasharray="3 3"
        fill="none"
      />
      <path
        d={arc(44) + ' L92 50 Z'}
        fill={highlight === 'area' ? shade : 'white'}
        stroke="black"
        strokeWidth={highlight === 'perimeter' ? 2.5 : 1}
      />
      {highlight === 'arc' && (
        <path d={arc(44)} stroke="black" strokeWidth="3" fill="none" />
      )}
      <path d={arc(12)} stroke="black" fill="none" />
      <text
        x={92 + 28 * Math.cos(radians / 2)}
        y={54 - 28 * Math.sin(radians / 2)}
        fontSize="11"
      >
        {angle}°
      </text>
    </GeometryDiagram>
  );
}
