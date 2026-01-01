import type { PrintTemplate } from '../../config/print-templates';

export const MM_PER_PX = 25.4 / 96;
export const PX_PER_MM = 96 / 25.4;
export const A4_HEIGHT_MM = 297;
export const MIN_MARGIN_MM = 5;
const MAX_MARGIN_ITERATIONS = 6;
const SCALE_SAFETY_MM = 0.5;
const MIN_SCALE = 0.85;
export const HEADER_HEIGHT_MM = 25;
const MAX_INITIAL_TOP_MARGIN_MM = 15;
const HORIZONTAL_MARGIN_MM = 15;

// マージン配分比率
const EQUAL_SHARE_RATIO = 0.5; // 上下余白が同等の場合の配分比率
const TOP_MARGIN_RATIO = 0.6; // 初期上部余白の配分比率（全体の60%）

/**
 * 精度制御定数
 * これらの値は印刷レイアウトの計算精度とブラウザ互換性のバランスを取っています。
 * 値を変更する場合は、すべての問題タイプでA4印刷テストを実施してください。
 */
/** スケール値の小数点精度（0.xxx - 3桁で十分な精度を確保） */
const SCALE_PRECISION = 3;
/** 余白値の小数点精度（mm単位で0.01mm精度 - 印刷には十分） */
const MARGIN_PRECISION = 2;
/** スケール適用時のパディング精度（px計算時の精度維持用） */
const PADDING_PRECISION = 3;

export const pxToMm = (px: number): number => px * MM_PER_PX;
export const mmToPx = (mm: number): number => mm * PX_PER_MM;

export interface FitResult {
  topMarginMm: number;
  bottomMarginMm: number;
  scale: number;
}

const roundMargin = (margin: number): number => Number(margin.toFixed(MARGIN_PRECISION));

export interface LayoutEstimateInput {
  problemCount: number;
  columns: number;
  template: PrintTemplate;
}

export interface LayoutEstimateResult {
  topMarginMm: number;
  bottomMarginMm: number;
  contentHeightMm: number;
}

/**
 * ページレイアウトの初期余白を推定
 *
 * アルゴリズム:
 * 1. 問題数と列数から必要な行数を計算
 * 2. テンプレートから問題の高さと行間隔を取得
 * 3. コンテンツ全体の高さを計算（ヘッダー + 問題エリア）
 * 4. A4用紙の残りスペースを余白として配分
 *    - 上部余白: 60%（最大15mm）
 *    - 下部余白: 40%
 * 5. 最小余白（5mm）を保証
 *
 * @param problemCount - 問題数
 * @param columns - 列数
 * @param template - 問題タイプのテンプレート
 * @returns 推定された上下余白とコンテンツ高さ
 */
export const estimatePageLayout = ({
  problemCount,
  columns,
  template,
}: LayoutEstimateInput): LayoutEstimateResult => {
  const rows = Math.max(1, Math.ceil(problemCount / columns));
  const minProblemHeightMm = parseFloat(template.layout.minProblemHeight) * MM_PER_PX;
  const rowGapMm = parseFloat(template.layout.rowGap) * MM_PER_PX;
  const contentHeightMm =
    HEADER_HEIGHT_MM + rows * (minProblemHeightMm + rowGapMm);
  const remainingSpace = A4_HEIGHT_MM - contentHeightMm;
  const marginBudget = Math.max(remainingSpace, MIN_MARGIN_MM * 2);

  let topMargin = Math.min(
    MAX_INITIAL_TOP_MARGIN_MM,
    marginBudget * TOP_MARGIN_RATIO,
  );
  let bottomMargin = marginBudget - topMargin;

  if (bottomMargin < MIN_MARGIN_MM) {
    bottomMargin = MIN_MARGIN_MM;
    topMargin = Math.max(MIN_MARGIN_MM, marginBudget - bottomMargin);
  }

  if (topMargin < MIN_MARGIN_MM) {
    topMargin = MIN_MARGIN_MM;
  }

  return {
    topMarginMm: roundMargin(topMargin),
    bottomMarginMm: roundMargin(bottomMargin),
    contentHeightMm,
  };
};

/**
 * ページをA4サイズに収めるための余白調整とスケーリング
 *
 * アルゴリズム:
 * Phase 1: 余白削減による調整（最大6回反復）
 *   1. 現在の高さがA4を超えているか確認
 *   2. はみ出し量を計算
 *   3. 上下余白から比例配分で削減
 *      - 上部余白が多い場合は上部を多く削減
 *      - 下部余白が多い場合は下部を多く削減
 *   4. パディングを再設定し、高さを再計算
 *   5. A4に収まるか、余白が最小値になるまで繰り返す
 *
 * Phase 2: スケーリングによる調整（余白削減で収まらない場合）
 *   1. コンテンツをスケール縮小する倍率を計算
 *   2. 最小スケール（0.85）を下回らないように制限
 *   3. スケールに合わせてパディングを調整
 *   4. transform: scale() でコンテンツを縮小
 *
 * @param pageElement - 調整対象のページ要素
 * @param initialTop - 初期上部余白（mm）
 * @param initialBottom - 初期下部余白（mm）
 * @returns 調整後の上下余白とスケール倍率
 */
export const fitPageToA4 = (
  pageElement: HTMLDivElement,
  initialTop: number,
  initialBottom: number,
): FitResult => {
  // 不正な値のバリデーション
  if (!Number.isFinite(initialTop) || initialTop < 0) {
    if (import.meta.env.DEV) {
      console.warn(
        `[fitPageToA4] Invalid initialTop: ${initialTop}, using MIN_MARGIN_MM (${MIN_MARGIN_MM}mm)`
      );
    }
  }
  if (!Number.isFinite(initialBottom) || initialBottom < 0) {
    if (import.meta.env.DEV) {
      console.warn(
        `[fitPageToA4] Invalid initialBottom: ${initialBottom}, using MIN_MARGIN_MM (${MIN_MARGIN_MM}mm)`
      );
    }
  }

  let top = Number.isFinite(initialTop) && initialTop >= 0 ? initialTop : MIN_MARGIN_MM;
  let bottom = Number.isFinite(initialBottom) && initialBottom >= 0 ? initialBottom : MIN_MARGIN_MM;

  const setPadding = (): void => {
    const safeTop = Math.max(MIN_MARGIN_MM, roundMargin(top));
    const safeBottom = Math.max(MIN_MARGIN_MM, roundMargin(bottom));
    pageElement.style.padding = `${safeTop}mm ${HORIZONTAL_MARGIN_MM}mm ${safeBottom}mm`;
    top = safeTop;
    bottom = safeBottom;
  };

  const a4HeightPx = mmToPx(A4_HEIGHT_MM);

  pageElement.style.removeProperty('transform');
  pageElement.style.removeProperty('transform-origin');
  pageElement.style.removeProperty('width');

  setPadding();

  let heightPx = pageElement.getBoundingClientRect().height;
  let iterations = 0;

  // Phase 1: 余白削減による反復的調整
  while (heightPx > a4HeightPx && iterations < MAX_MARGIN_ITERATIONS) {
    // はみ出し量を計算
    const overflowMm = pxToMm(heightPx - a4HeightPx);

    // 削減可能な余白量を計算（最小余白を下回らない範囲）
    const availableTop = Math.max(0, top - MIN_MARGIN_MM);
    const availableBottom = Math.max(0, bottom - MIN_MARGIN_MM);
    const totalAvailable = availableTop + availableBottom;

    // これ以上削減できない場合は終了
    if (totalAvailable <= 0) {
      break;
    }

    // 上下余白から比例配分で削減量を計算
    const topShare = totalAvailable === 0 ? EQUAL_SHARE_RATIO : availableTop / totalAvailable;
    const bottomShare = totalAvailable === 0 ? EQUAL_SHARE_RATIO : availableBottom / totalAvailable;

    const topReduction = Math.min(availableTop, overflowMm * topShare);
    const bottomReduction = Math.min(availableBottom, overflowMm * bottomShare);

    // 余白を削減して再計算
    top -= topReduction;
    bottom -= bottomReduction;
    setPadding();
    heightPx = pageElement.getBoundingClientRect().height;
    iterations += 1;
  }

  // Phase 2: スケーリングによる調整（余白削減で収まらない場合）
  if (heightPx > a4HeightPx) {
    if (import.meta.env.DEV) {
      console.warn(
        `[fitPageToA4] Content exceeds A4 height after margin reduction (${pxToMm(heightPx).toFixed(1)}mm > ${A4_HEIGHT_MM}mm), applying scaling`
      );
    }

    // 安全マージンを考慮したターゲット高さ
    const targetHeightPx = a4HeightPx - mmToPx(SCALE_SAFETY_MM);
    const topPx = mmToPx(top);
    const bottomPx = mmToPx(bottom);

    // コンテンツ部分の高さを計算
    const contentHeightPx = Math.max(0, heightPx - topPx - bottomPx);
    const availableContentPx = targetHeightPx - (topPx + bottomPx);

    // スケール倍率を計算（0.85以上1.0以下に制限）
    const proposedScale =
      contentHeightPx > 0 ? availableContentPx / contentHeightPx : 1;
    const scale = Math.min(1, Math.max(MIN_SCALE, Number(proposedScale.toFixed(SCALE_PRECISION))));

    if (import.meta.env.DEV && proposedScale < MIN_SCALE) {
      console.warn(
        `[fitPageToA4] Proposed scale (${proposedScale.toFixed(3)}) is below minimum (${MIN_SCALE}), clamping to ${MIN_SCALE}`
      );
    }

    if (scale < 1) {
      // スケール適用時はパディングも拡大する必要がある
      const expandPaddingForScale = (valueMm: number): number => {
        return Math.ceil((valueMm / scale) * 1000) / 1000;
      };

      const scaledTopPaddingMm = expandPaddingForScale(top);
      const scaledBottomPaddingMm = expandPaddingForScale(bottom);
      const scaledHorizontalPaddingMm = expandPaddingForScale(
        HORIZONTAL_MARGIN_MM,
      );
      const effectiveWidthMm = 210 / scale; // A4幅をスケールで割る

      // CSSでスケーリングを適用
      pageElement.style.padding = `${scaledTopPaddingMm.toFixed(PADDING_PRECISION)}mm ${scaledHorizontalPaddingMm.toFixed(PADDING_PRECISION)}mm ${scaledBottomPaddingMm.toFixed(PADDING_PRECISION)}mm`;
      pageElement.style.transform = `scale(${scale})`;
      pageElement.style.transformOrigin = 'top center';
      pageElement.style.width = `${effectiveWidthMm.toFixed(PADDING_PRECISION)}mm`;

      // デバッグ用: 開発モードでのみスケール値を記録
      if (import.meta.env.DEV) {
        pageElement.dataset.printScale = scale.toFixed(SCALE_PRECISION);
      }

      return { topMarginMm: top, bottomMarginMm: bottom, scale };
    }
  }

  // デバッグ用: 開発モードでのみスケール値を記録
  if (import.meta.env.DEV) {
    pageElement.dataset.printScale = (1).toFixed(SCALE_PRECISION);
  }

  return { topMarginMm: top, bottomMarginMm: bottom, scale: 1 };
};
