/**
 * A4オーバーフロー実測ユーティリティ
 *
 * estimateA4Fit（定数ベースの推定）と異なり、実際に描画された
 * [data-a4-sheet] 要素の縦横と列内のはみ出しを測って判定する。
 * 問題文の折り返し行数など、推定では捉えられない変動を検出できる。
 */

import {
  A4_HEIGHT_MM,
  A4_WIDTH_MM,
  MM_PER_PX,
  PX_PER_MM,
} from '../../components/Export/fitPageToA4';

/** A4の高さ（px @ 96dpi）。check-print-layout.mjs と同じ基準 */
export const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;
export const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;

/** 寸法の整数丸めによる誤差だけを許容する（px）。 */
export const A4_OVERFLOW_TOLERANCE_PX = 1;

export interface A4OverflowResult {
  /** 用紙寸法、または問題の列の範囲を超えている場合 true */
  isOverflow: boolean;
  /** 実測高さ（px） */
  heightPx: number;
  /** 実測高さ（mm） */
  heightMm: number;
  /** はみ出し量（mm）。収まっている場合は 0 */
  overflowMm: number;
  widthPx: number;
  widthMm: number;
  horizontalOverflowMm: number;
  hasClippedProblems?: boolean;
}

/**
 * 実測寸法（px）からA4超過を判定する
 */
export function evaluateA4Overflow(
  heightPx: number,
  widthPx = A4_WIDTH_PX
): A4OverflowResult {
  const overflowPx = heightPx - A4_HEIGHT_PX;
  const horizontalOverflowPx = widthPx - A4_WIDTH_PX;
  const isOverflow =
    overflowPx > A4_OVERFLOW_TOLERANCE_PX ||
    horizontalOverflowPx > A4_OVERFLOW_TOLERANCE_PX;
  return {
    isOverflow,
    heightPx,
    heightMm: heightPx * MM_PER_PX,
    overflowMm:
      overflowPx > A4_OVERFLOW_TOLERANCE_PX ? overflowPx * MM_PER_PX : 0,
    widthPx,
    widthMm: widthPx * MM_PER_PX,
    horizontalOverflowMm:
      horizontalOverflowPx > A4_OVERFLOW_TOLERANCE_PX
        ? horizontalOverflowPx * MM_PER_PX
        : 0,
  };
}

export function measureSheetOverflow(sheet: HTMLElement): A4OverflowResult {
  const result = evaluateA4Overflow(
    measureSheetHeightPx(sheet),
    Math.max(sheet.clientWidth, sheet.scrollWidth)
  );
  // 用紙内に収まっていても、隣の問題の列へはみ出した数式を検出する。
  const hasClippedProblems = Array.from(
    sheet.querySelectorAll<HTMLElement>('[data-problem-grid] > div')
  ).some(
    (cell) => cell.scrollWidth > cell.clientWidth + A4_OVERFLOW_TOLERANCE_PX
  );
  return {
    ...result,
    hasClippedProblems,
    isOverflow: result.isOverflow || hasClippedProblems,
  };
}

/**
 * シート要素の実測高さ（px）を取得する
 *
 * minHeight 固定のコンテナでも内容のはみ出しを拾えるよう、
 * clientHeight と scrollHeight の大きい方を採用する。
 *
 * getBoundingClientRect は警告表示時に付与される枠線も含むため、
 * その枠線自身を「はみ出し」と誤判定して警告が解除されなくなる。
 * clientHeight は枠線を含まないので、シート内容だけを安定して測定できる。
 */
export function measureSheetHeightPx(sheet: HTMLElement): number {
  return Math.max(sheet.clientHeight, sheet.scrollHeight);
}

/**
 * 全 [data-a4-sheet] を実測し、用紙・列の範囲を超えるシートを返す
 *
 * 複数枚印刷では1ページごとに別のシートが描画されるため、
 * 印刷直前のガードはこの関数で全ページを検査する。
 */
export function findOverflowingSheets(root: HTMLElement): A4OverflowResult[] {
  const sheets = Array.from(
    root.querySelectorAll<HTMLElement>('[data-a4-sheet]')
  );
  return sheets.map(measureSheetOverflow).filter((result) => result.isOverflow);
}

/**
 * コールバック実行中だけ @media print のスタイルを強制適用する
 *
 * onBeforePrint 時点ではブラウザの印刷メディアがまだ有効でないため、
 * 画面用CSS（印刷時より大きいフォント等）で実測すると印刷時には
 * 収まるページを誤ってはみ出し判定してしまう。同一オリジンの
 * 全スタイルシートから @media print 内のルールを抽出し、一時的な
 * <style> 要素として適用した状態で計測する。
 */
export function withPrintMediaStyles<T>(
  callback: () => T,
  targetDocument = document
): T {
  const printRules: string[] = [];

  for (const sheet of Array.from(targetDocument.styleSheets)) {
    let rules: CSSRuleList;
    try {
      rules = sheet.cssRules;
    } catch {
      // クロスオリジンのスタイルシートは読めないためスキップ
      continue;
    }
    for (const rule of Array.from(rules)) {
      if (rule.type === 4) {
        const mediaRule = rule as CSSMediaRule;
        // conditionText 非対応環境（jsdom等）では media.mediaText を使う
        const condition = mediaRule.conditionText || mediaRule.media.mediaText;
        if (/(^|,)\s*print\s*($|,)/.test(condition)) {
          for (const inner of Array.from(mediaRule.cssRules)) {
            printRules.push(inner.cssText);
          }
        }
      }
    }
  }

  if (printRules.length === 0) {
    return callback();
  }

  const styleElement = targetDocument.createElement('style');
  styleElement.setAttribute('data-print-measure', '');
  styleElement.textContent = printRules.join('\n');
  targetDocument.head.appendChild(styleElement);
  try {
    return callback();
  } finally {
    styleElement.remove();
  }
}
