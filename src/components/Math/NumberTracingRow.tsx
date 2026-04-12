import React from 'react';
import {
  DIGIT_STROKES,
  DIGIT_VIEWBOX,
  type StrokeSegment,
} from '../../lib/data/digit-strokes';

interface NumberTracingRowProps {
  digit: number;
  traceCount: number;
  practiceCount: number;
  /** 各セルの高さ(px)。列数に応じて親が調整する */
  cellHeight?: number;
}

const STROKE_WIDTH = 4;
const TRACE_STROKE_WIDTH = 3;

/** 数字書き順の矢印を描画（始点位置と方向点から三角形を作る） */
const StrokeArrow: React.FC<{
  from: { x: number; y: number };
  to: { x: number; y: number };
  color: string;
}> = ({ from, to, color }) => {
  // 方向ベクトル
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  // 矢印の大きさ
  const size = 8;
  const tipX = from.x + ux * size;
  const tipY = from.y + uy * size;
  // 垂直ベクトル
  const px = -uy;
  const py = ux;
  const baseLX = from.x + px * (size / 2);
  const baseLY = from.y + py * (size / 2);
  const baseRX = from.x - px * (size / 2);
  const baseRY = from.y - py * (size / 2);
  return (
    <polygon
      points={`${tipX},${tipY} ${baseLX},${baseLY} ${baseRX},${baseRY}`}
      fill={color}
    />
  );
};

/** 書き順番号バッジ（viewBox外へのはみ出しをクランプ） */
const StrokeOrderBadge: React.FC<{
  arrowStart: { x: number; y: number };
  order: number;
}> = ({ arrowStart, order }) => {
  const r = 7;
  const cx = Math.min(Math.max(arrowStart.x - 8, r), DIGIT_VIEWBOX.width - r);
  const cy = Math.min(Math.max(arrowStart.y - 8, r), DIGIT_VIEWBOX.height - r);
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="#dc2626" />
      <text
        x={cx}
        y={cy}
        fontSize="10"
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontWeight="bold"
      >
        {order}
      </text>
    </>
  );
};

/** お手本：書き順番号・矢印付き */
const StrokeOrderDigit: React.FC<{ digit: number; size: number }> = ({
  digit,
  size,
}) => {
  const data = DIGIT_STROKES[digit];
  if (!data) return null;
  const aspect = DIGIT_VIEWBOX.width / DIGIT_VIEWBOX.height;
  const width = size * aspect;
  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${DIGIT_VIEWBOX.width} ${DIGIT_VIEWBOX.height}`}
      style={{ display: 'block' }}
    >
      {data.strokes.map((stroke: StrokeSegment) => (
        <g key={stroke.order}>
          <path
            d={stroke.path}
            stroke="#1e3a8a"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <StrokeArrow
            from={stroke.arrowStart}
            to={stroke.arrowDirection}
            color="#dc2626"
          />
          <StrokeOrderBadge
            arrowStart={stroke.arrowStart}
            order={stroke.order}
          />
        </g>
      ))}
    </svg>
  );
};

/** なぞり書き用：点線表示 */
const TracingDigit: React.FC<{ digit: number; size: number }> = ({
  digit,
  size,
}) => {
  const data = DIGIT_STROKES[digit];
  if (!data) return null;
  const aspect = DIGIT_VIEWBOX.width / DIGIT_VIEWBOX.height;
  const width = size * aspect;
  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${DIGIT_VIEWBOX.width} ${DIGIT_VIEWBOX.height}`}
      style={{ display: 'block' }}
    >
      {data.strokes.map((stroke: StrokeSegment) => (
        <path
          key={stroke.order}
          d={stroke.path}
          stroke="#9ca3af"
          strokeWidth={TRACE_STROKE_WIDTH}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 4"
          fill="none"
        />
      ))}
    </svg>
  );
};

/** 自由練習マス：空白ガイド線のみ */
const PracticeBox: React.FC<{ size: number }> = ({ size }) => {
  const aspect = DIGIT_VIEWBOX.width / DIGIT_VIEWBOX.height;
  const width = size * aspect;
  return (
    <svg
      width={width}
      height={size}
      viewBox={`0 0 ${DIGIT_VIEWBOX.width} ${DIGIT_VIEWBOX.height}`}
      style={{ display: 'block' }}
    >
      {/* 中央補助線（縦） */}
      <line
        x1={DIGIT_VIEWBOX.width / 2}
        y1={10}
        x2={DIGIT_VIEWBOX.width / 2}
        y2={DIGIT_VIEWBOX.height - 10}
        stroke="#e5e7eb"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
      {/* 中央補助線（横） */}
      <line
        x1={10}
        y1={DIGIT_VIEWBOX.height / 2}
        x2={DIGIT_VIEWBOX.width - 10}
        y2={DIGIT_VIEWBOX.height / 2}
        stroke="#e5e7eb"
        strokeWidth={1}
        strokeDasharray="2 3"
      />
    </svg>
  );
};

/** セルを囲むボックス */
const Cell: React.FC<{
  children: React.ReactNode;
  size: number;
  label?: string;
}> = ({ children, size, label }) => {
  const aspect = DIGIT_VIEWBOX.width / DIGIT_VIEWBOX.height;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      {label && (
        <div style={{ fontSize: 9, color: '#6b7280', lineHeight: 1 }}>
          {label}
        </div>
      )}
      <div
        style={{
          width: size * aspect,
          height: size,
          border: '1px solid #cbd5e1',
          borderRadius: 4,
          boxSizing: 'content-box',
          padding: 2,
          backgroundColor: 'white',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const NumberTracingRow: React.FC<NumberTracingRowProps> = ({
  digit,
  traceCount,
  practiceCount,
  cellHeight = 48,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
      }}
    >
      {/* 数字ラベル */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          minWidth: 24,
          textAlign: 'center',
          color: '#0f172a',
        }}
      >
        {digit}
      </div>
      {/* お手本 */}
      <Cell size={cellHeight} label="おてほん">
        <StrokeOrderDigit digit={digit} size={cellHeight} />
      </Cell>
      {/* なぞり書き */}
      {Array.from({ length: traceCount }).map((_, i) => (
        <Cell
          key={`trace-${i}`}
          size={cellHeight}
          label={i === 0 ? 'なぞる' : undefined}
        >
          <TracingDigit digit={digit} size={cellHeight} />
        </Cell>
      ))}
      {/* 自由練習 */}
      {Array.from({ length: practiceCount }).map((_, i) => (
        <Cell
          key={`practice-${i}`}
          size={cellHeight}
          label={i === 0 ? 'かいてみよう' : undefined}
        >
          <PracticeBox size={cellHeight} />
        </Cell>
      ))}
    </div>
  );
};
