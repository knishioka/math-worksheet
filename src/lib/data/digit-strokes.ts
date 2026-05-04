/**
 * 数字0〜9のSVGストロークデータ（書き順付き）
 * 未就学児が鉛筆でなぞる中心線として自然な字形に寄せる。
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
  /** 書き順番号バッジだけを微調整したい場合のオフセット */
  badgeOffset?: { x: number; y: number };
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
 *   - 0,1,2,3,6,8,9 = 1画 / 5,7 = 2画 / 4 = 3画
 *   - フォントの輪郭ではなく、手書きの運筆でなぞれる中心線として定義する
 *   - 7は短い左縦から横・斜めへ。8は中央で交差する一筆。9は右上から輪を書いて下ろす
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
        // 手書き練習では左上のはねを付けず、上から下へまっすぐ書く
        path: 'M 50 20 L 50 124',
        order: 1,
        arrowStart: { x: 50, y: 20 },
        arrowDirection: { x: 50, y: 42 },
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
        // 参考画像に合わせた短い左縦。上から下へ止める
        path: 'M 22 28 L 22 52',
        order: 1,
        arrowStart: { x: 22, y: 28 },
        arrowDirection: { x: 22, y: 45 },
        badgeOffset: { x: -7, y: 9 },
      },
      {
        // 横棒から斜め下へ。書くときの主線として長く伸ばす
        path: 'M 22 26 L 80 26 L 38 124',
        order: 2,
        arrowStart: { x: 22, y: 26 },
        arrowDirection: { x: 44, y: 26 },
        badgeOffset: { x: 21, y: -7 },
      },
    ],
  },
  8: {
    digit: 8,
    strokes: [
      {
        // 右上から入り、中央を斜めに交差して下ループを回り、再び中央を通る
        path: 'M 68 42 C 68 26, 54 18, 40 22 C 23 27, 22 50, 40 62 C 52 70, 64 76, 72 90 C 82 108, 68 126, 50 126 C 30 126, 20 112, 27 96 C 32 83, 43 75, 54 68 C 66 60, 76 52, 68 42',
        order: 1,
        arrowStart: { x: 68, y: 42 },
        arrowDirection: { x: 64, y: 28 },
      },
    ],
  },
  9: {
    digit: 9,
    strokes: [
      {
        // 右上から輪を書き、右側をほぼ直線で下ろす
        path: 'M 72 42 C 70 27, 58 19, 44 22 C 28 25, 21 39, 24 55 C 27 73, 45 81, 60 72 C 71 65, 76 53, 72 42 L 74 124',
        order: 1,
        arrowStart: { x: 72, y: 42 },
        arrowDirection: { x: 68, y: 28 },
      },
    ],
  },
};
