/**
 * A4オーバーフロー実測ユーティリティ
 *
 * estimateA4Fit（定数ベースの推定）と異なり、実際に描画された
 * [data-a4-sheet] 要素の高さを測ってA4超過を判定する。
 * 問題文の折り返し行数など、推定では捉えられない変動を検出できる。
 */

import {
  A4_HEIGHT_MM,
  MM_PER_PX,
  PX_PER_MM,
} from '../../components/Export/fitPageToA4';

/** A4の高さ（px @ 96dpi）。check-print-layout.mjs と同じ基準 */
export const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;

/** 許容誤差（px）。check-print-layout.mjs の TOLERANCE_PX と揃える */
export const A4_OVERFLOW_TOLERANCE_PX = 5;

export interface A4OverflowResult {
  /** A4の高さを許容誤差を超えて上回っている場合 true */
  isOverflow: boolean;
  /** 実測高さ（px） */
  heightPx: number;
  /** 実測高さ（mm） */
  heightMm: number;
  /** はみ出し量（mm）。収まっている場合は 0 */
  overflowMm: number;
}

/**
 * 実測高さ（px）からA4超過を判定する
 */
export function evaluateA4Overflow(heightPx: number): A4OverflowResult {
  const overflowPx = heightPx - A4_HEIGHT_PX;
  const isOverflow = overflowPx > A4_OVERFLOW_TOLERANCE_PX;
  return {
    isOverflow,
    heightPx,
    heightMm: heightPx * MM_PER_PX,
    overflowMm: isOverflow ? overflowPx * MM_PER_PX : 0,
  };
}

/**
 * シート要素の実測高さ（px）を取得する
 *
 * minHeight 固定のコンテナでも内容のはみ出しを拾えるよう、
 * boundingClientRect と scrollHeight の大きい方を採用する。
 */
export function measureSheetHeightPx(sheet: HTMLElement): number {
  return Math.max(sheet.getBoundingClientRect().height, sheet.scrollHeight);
}

/**
 * ルート要素配下の全 [data-a4-sheet] を実測し、A4を超えるシートを返す
 *
 * 複数枚印刷では1ページごとに別のシートが描画されるため、
 * 印刷直前のガードはこの関数で全ページを検査する。
 */
export function findOverflowingSheets(root: HTMLElement): A4OverflowResult[] {
  const sheets = Array.from(
    root.querySelectorAll<HTMLElement>('[data-a4-sheet]')
  );
  return sheets
    .map((sheet) => evaluateA4Overflow(measureSheetHeightPx(sheet)))
    .filter((result) => result.isOverflow);
}
