export const MM_PER_PX = 25.4 / 96;
export const PX_PER_MM = 96 / 25.4;
export const A4_HEIGHT_MM = 297;
export const MIN_MARGIN_MM = 5;
const MAX_MARGIN_ITERATIONS = 6;
const SCALE_SAFETY_MM = 0.5;
const MIN_SCALE = 0.85;

export const pxToMm = (px: number): number => px * MM_PER_PX;
export const mmToPx = (mm: number): number => mm * PX_PER_MM;

export interface FitResult {
  topMarginMm: number;
  bottomMarginMm: number;
  scale: number;
}

const roundMargin = (margin: number): number => Number(margin.toFixed(2));

export const fitPageToA4 = (
  pageElement: HTMLDivElement,
  initialTop: number,
  initialBottom: number,
): FitResult => {
  let top = Number.isFinite(initialTop) ? initialTop : MIN_MARGIN_MM;
  let bottom = Number.isFinite(initialBottom) ? initialBottom : MIN_MARGIN_MM;

  const setPadding = (): void => {
    const safeTop = Math.max(MIN_MARGIN_MM, roundMargin(top));
    const safeBottom = Math.max(MIN_MARGIN_MM, roundMargin(bottom));
    pageElement.style.padding = `${safeTop}mm 15mm ${safeBottom}mm`;
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

  while (heightPx > a4HeightPx && iterations < MAX_MARGIN_ITERATIONS) {
    const overflowMm = pxToMm(heightPx - a4HeightPx);
    const availableTop = Math.max(0, top - MIN_MARGIN_MM);
    const availableBottom = Math.max(0, bottom - MIN_MARGIN_MM);
    const totalAvailable = availableTop + availableBottom;

    if (totalAvailable <= 0) {
      break;
    }

    const topShare = totalAvailable === 0 ? 0.5 : availableTop / totalAvailable;
    const bottomShare = totalAvailable === 0 ? 0.5 : availableBottom / totalAvailable;

    const topReduction = Math.min(availableTop, overflowMm * topShare);
    const bottomReduction = Math.min(availableBottom, overflowMm * bottomShare);

    top -= topReduction;
    bottom -= bottomReduction;
    setPadding();
    heightPx = pageElement.getBoundingClientRect().height;
    iterations += 1;
  }

  if (heightPx > a4HeightPx) {
    const targetHeightPx = a4HeightPx - mmToPx(SCALE_SAFETY_MM);
    const proposedScale = targetHeightPx / heightPx;
    const scale = Math.min(1, Math.max(MIN_SCALE, Number(proposedScale.toFixed(3))));

    if (scale < 1) {
      const effectiveWidthMm = 210 / scale;
      pageElement.style.transform = `scale(${scale})`;
      pageElement.style.transformOrigin = 'top center';
      pageElement.style.width = `${effectiveWidthMm.toFixed(3)}mm`;
      pageElement.dataset.printScale = scale.toFixed(3);
      return { topMarginMm: top, bottomMarginMm: bottom, scale };
    }
  }

  pageElement.dataset.printScale = '1.000';
  return { topMarginMm: top, bottomMarginMm: bottom, scale: 1 };
};
