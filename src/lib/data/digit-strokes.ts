/**
 * 数字0〜9のSVGストロークデータ（書き順付き）
 * 日本の書き順に準拠
 * viewBox: 0 0 100 140 で統一
 */

export interface StrokeSegment {
  /** SVG path 'd' attribute */
  path: string;
  /** 書き順番号（1始まり） */
  order: number;
  /** 矢印の始点（書き始め位置） */
  arrowStart: { x: number; y: number };
  /** 矢印の方向を示す点（始点から少し先） */
  arrowDirection: { x: number; y: number };
}

export interface DigitStrokeData {
  digit: number;
  strokes: StrokeSegment[];
}

/** 全数字共通の viewBox */
export const DIGIT_VIEWBOX = { width: 100, height: 140 };

/**
 * 数字0〜9のストロークデータ
 * パスは viewBox 0 0 100 140 内で定義
 */
export const DIGIT_STROKES: Record<number, DigitStrokeData> = {
  0: {
    digit: 0,
    strokes: [
      {
        // 楕円：上部中央から時計回り
        path: 'M 50 20 C 75 20, 85 50, 85 70 C 85 100, 70 125, 50 125 C 30 125, 15 100, 15 70 C 15 50, 25 20, 50 20 Z',
        order: 1,
        arrowStart: { x: 50, y: 20 },
        arrowDirection: { x: 65, y: 22 },
      },
    ],
  },
  1: {
    digit: 1,
    strokes: [
      {
        // 上から下へ直線
        path: 'M 50 15 L 50 125',
        order: 1,
        arrowStart: { x: 50, y: 15 },
        arrowDirection: { x: 50, y: 35 },
      },
    ],
  },
  2: {
    digit: 2,
    strokes: [
      {
        // 左上から弧を描いて右下、そして横線
        path: 'M 25 40 C 25 20, 75 15, 75 45 C 75 65, 25 95, 20 120 L 80 120',
        order: 1,
        arrowStart: { x: 25, y: 40 },
        arrowDirection: { x: 30, y: 28 },
      },
    ],
  },
  3: {
    digit: 3,
    strokes: [
      {
        // 一筆書き：上の弧 → 中央 → 下の弧
        path: 'M 25 30 C 25 12, 80 12, 75 40 C 72 55, 55 62, 50 65 C 60 65, 82 75, 80 95 C 78 118, 25 125, 22 105',
        order: 1,
        arrowStart: { x: 25, y: 30 },
        arrowDirection: { x: 35, y: 18 },
      },
    ],
  },
  4: {
    digit: 4,
    strokes: [
      {
        // 左上から斜め下へ
        path: 'M 65 15 L 15 90',
        order: 1,
        arrowStart: { x: 65, y: 15 },
        arrowDirection: { x: 55, y: 35 },
      },
      {
        // 横線
        path: 'M 15 90 L 85 90',
        order: 2,
        arrowStart: { x: 15, y: 90 },
        arrowDirection: { x: 35, y: 90 },
      },
      {
        // 縦線
        path: 'M 65 50 L 65 125',
        order: 3,
        arrowStart: { x: 65, y: 50 },
        arrowDirection: { x: 65, y: 70 },
      },
    ],
  },
  5: {
    digit: 5,
    strokes: [
      {
        // 縦→カーブ（先に書く）
        path: 'M 30 20 L 28 65 C 28 55, 80 50, 82 85 C 84 115, 30 130, 20 108',
        order: 1,
        arrowStart: { x: 30, y: 20 },
        arrowDirection: { x: 29, y: 40 },
      },
      {
        // 上の横線（最後に書く：左から右）
        path: 'M 30 20 L 75 20',
        order: 2,
        arrowStart: { x: 30, y: 20 },
        arrowDirection: { x: 50, y: 20 },
      },
    ],
  },
  6: {
    digit: 6,
    strokes: [
      {
        // 上から丸く下へ
        path: 'M 65 20 C 40 20, 18 55, 18 80 C 18 110, 35 125, 55 125 C 75 125, 85 110, 85 90 C 85 70, 70 60, 50 60 C 30 60, 18 72, 18 80',
        order: 1,
        arrowStart: { x: 65, y: 20 },
        arrowDirection: { x: 52, y: 22 },
      },
    ],
  },
  7: {
    digit: 7,
    strokes: [
      {
        // 横線
        path: 'M 20 20 L 80 20',
        order: 1,
        arrowStart: { x: 20, y: 20 },
        arrowDirection: { x: 40, y: 20 },
      },
      {
        // 斜め下へ
        path: 'M 80 20 L 40 125',
        order: 2,
        arrowStart: { x: 80, y: 20 },
        arrowDirection: { x: 72, y: 42 },
      },
    ],
  },
  8: {
    digit: 8,
    strokes: [
      {
        // 一筆書き：上の丸 → 中央交差 → 下の丸 → 戻り
        path: 'M 60 22 C 35 22, 22 35, 22 50 C 22 60, 35 65, 50 65 C 70 65, 85 80, 85 100 C 85 118, 68 128, 50 128 C 32 128, 15 118, 15 100 C 15 80, 30 65, 50 65 C 65 65, 78 60, 78 50 C 78 35, 65 22, 50 22',
        order: 1,
        arrowStart: { x: 60, y: 22 },
        arrowDirection: { x: 48, y: 24 },
      },
    ],
  },
  9: {
    digit: 9,
    strokes: [
      {
        // 上の丸
        path: 'M 82 60 C 82 40, 70 18, 50 18 C 30 18, 18 35, 18 55 C 18 72, 35 82, 50 82 C 68 82, 82 72, 82 55',
        order: 1,
        arrowStart: { x: 82, y: 60 },
        arrowDirection: { x: 82, y: 48 },
      },
      {
        // 下へ伸ばす
        path: 'M 82 55 L 82 90 C 82 110, 70 128, 45 128',
        order: 2,
        arrowStart: { x: 82, y: 55 },
        arrowDirection: { x: 82, y: 75 },
      },
    ],
  },
};
