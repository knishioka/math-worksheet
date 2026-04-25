/**
 * 数字0〜9のSVGストロークデータ（書き順付き）
 * 日本の小学校教科書体（学参フォント系）に準拠した字形
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
 *
 * 字形ルール:
 *   - 上端 y=18, 下端 y=125 を基本ベースライン
 *   - 横幅は概ね x=18..82 に収める
 *   - 0,1,2,3,6,8 = 1画 / 5,7,9 = 2画 / 4 = 3画
 *   - 角張った形（4,7）は鋭角を保つ。丸い形（0,3,6,8,9）は対称性重視
 */
export const DIGIT_STROKES: Record<number, DigitStrokeData> = {
  0: {
    digit: 0,
    strokes: [
      {
        // 左右対称な楕円。上中央から反時計回り → 戻りで閉じる
        path: 'M 50 18 C 28 18, 17 45, 17 71 C 17 98, 28 124, 50 124 C 72 124, 83 98, 83 71 C 83 45, 72 18, 50 18 Z',
        order: 1,
        arrowStart: { x: 50, y: 18 },
        arrowDirection: { x: 35, y: 22 },
      },
    ],
  },
  1: {
    digit: 1,
    strokes: [
      {
        // 教科書体の1：左上に短いフラッグ → 中心へ縦線（1画で書く）
        path: 'M 28 35 L 50 18 L 50 124',
        order: 1,
        arrowStart: { x: 28, y: 35 },
        arrowDirection: { x: 42, y: 24 },
      },
    ],
  },
  2: {
    digit: 2,
    strokes: [
      {
        // 上の弧を滑らかに、底辺はきっぱり水平
        path: 'M 22 38 C 22 22, 38 16, 52 16 C 70 16, 80 26, 80 42 C 80 58, 60 78, 22 122 L 82 122',
        order: 1,
        arrowStart: { x: 22, y: 38 },
        arrowDirection: { x: 26, y: 26 },
      },
    ],
  },
  3: {
    digit: 3,
    strokes: [
      {
        // 上下の弧。中央でしっかりくびれを作って2つの輪の境界を明確に
        path: 'M 22 30 C 22 14, 42 14, 56 18 C 76 24, 78 48, 56 60 C 50 63, 42 64, 38 64 C 44 64, 56 64, 66 70 C 84 80, 82 110, 60 120 C 40 128, 24 122, 20 108',
        order: 1,
        arrowStart: { x: 22, y: 30 },
        arrowDirection: { x: 32, y: 18 },
      },
    ],
  },
  4: {
    digit: 4,
    strokes: [
      {
        // 1画目: 左上から斜め下へ（左下がり）
        path: 'M 60 18 L 16 88',
        order: 1,
        arrowStart: { x: 60, y: 18 },
        arrowDirection: { x: 50, y: 33 },
      },
      {
        // 2画目: 横線（左から右）
        path: 'M 16 88 L 84 88',
        order: 2,
        arrowStart: { x: 16, y: 88 },
        arrowDirection: { x: 36, y: 88 },
      },
      {
        // 3画目: 縦線（上から下）
        path: 'M 64 40 L 64 124',
        order: 3,
        arrowStart: { x: 64, y: 40 },
        arrowDirection: { x: 64, y: 60 },
      },
    ],
  },
  5: {
    digit: 5,
    strokes: [
      {
        // 1画目: 縦線 → 右下へ膨らむ大きなカーブ → 左下へ収束
        path: 'M 28 22 L 28 62 C 38 56, 60 54, 72 64 C 86 76, 84 110, 64 120 C 44 128, 24 120, 18 106',
        order: 1,
        arrowStart: { x: 28, y: 22 },
        arrowDirection: { x: 28, y: 42 },
      },
      {
        // 2画目: 上の横線（左から右）
        path: 'M 28 22 L 72 22',
        order: 2,
        arrowStart: { x: 28, y: 22 },
        arrowDirection: { x: 50, y: 22 },
      },
    ],
  },
  6: {
    digit: 6,
    strokes: [
      {
        // 滑らかな弧 → 下のループ。1画で閉じる
        path: 'M 70 22 C 50 18, 30 36, 22 60 C 16 78, 16 100, 28 116 C 42 128, 66 128, 78 114 C 88 100, 86 80, 72 72 C 58 64, 38 68, 28 80 C 22 88, 20 98, 22 108',
        order: 1,
        arrowStart: { x: 70, y: 22 },
        arrowDirection: { x: 56, y: 21 },
      },
    ],
  },
  7: {
    digit: 7,
    strokes: [
      {
        // 1画目: 上の横棒の左端から下へ伸びる短い縦の棒（教科書体 serif）
        // 横棒(y=26)の起点から長さ約30で下へ。幼児でも書きやすいサイズ
        path: 'M 22 26 L 22 56',
        order: 1,
        arrowStart: { x: 22, y: 30 },
        arrowDirection: { x: 22, y: 44 },
      },
      {
        // 2画目: 上の横棒から続けて斜め下へ一筆で書く（横→斜め）
        // arrowStart はパスの実際の書き始め位置 (22, 26) と一致させる（教科書順序の正確性を優先）
        path: 'M 22 26 L 80 26 L 36 124',
        order: 2,
        arrowStart: { x: 22, y: 26 },
        arrowDirection: { x: 42, y: 26 },
      },
    ],
  },
  8: {
    digit: 8,
    strokes: [
      {
        // 上の輪（小さめ） → 中央交差 → 下の輪（大きめ） → 戻りで閉じる
        path: 'M 56 22 C 38 22, 28 32, 28 46 C 28 56, 38 64, 50 66 C 64 68, 78 80, 78 100 C 78 116, 64 126, 50 126 C 36 126, 22 116, 22 100 C 22 80, 36 68, 50 66 C 62 64, 72 56, 72 46 C 72 32, 62 22, 50 22',
        order: 1,
        arrowStart: { x: 56, y: 22 },
        arrowDirection: { x: 44, y: 24 },
      },
    ],
  },
  9: {
    digit: 9,
    strokes: [
      {
        // 1画目: 上の輪（左上から開始 → 右回り → 左下で閉じる）
        path: 'M 78 50 C 78 32, 66 18, 50 18 C 32 18, 22 34, 22 50 C 22 66, 34 78, 50 78 C 64 78, 78 70, 78 50',
        order: 1,
        arrowStart: { x: 78, y: 50 },
        arrowDirection: { x: 76, y: 36 },
      },
      {
        // 2画目: 上の輪の右端から下へ伸ばし、わずかにカーブして終わる
        path: 'M 78 50 L 78 96 C 78 116, 64 126, 42 124',
        order: 2,
        arrowStart: { x: 78, y: 50 },
        arrowDirection: { x: 78, y: 70 },
      },
    ],
  },
};
