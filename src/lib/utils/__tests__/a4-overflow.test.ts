import { describe, it, expect } from 'vitest';
import {
  A4_HEIGHT_PX,
  A4_OVERFLOW_TOLERANCE_PX,
  evaluateA4Overflow,
  measureSheetHeightPx,
  findOverflowingSheets,
} from '../a4-overflow';

/** テスト用に高さを偽装したシート要素を作る */
function createSheet(heightPx: number): HTMLElement {
  const el = document.createElement('div');
  el.setAttribute('data-a4-sheet', '');
  Object.defineProperty(el, 'scrollHeight', {
    value: heightPx,
    configurable: true,
  });
  el.getBoundingClientRect = (): DOMRect => ({ height: heightPx }) as DOMRect;
  return el;
}

describe('evaluateA4Overflow', () => {
  it('A4ちょうどの高さは収まる判定になる', () => {
    const result = evaluateA4Overflow(A4_HEIGHT_PX);
    expect(result.isOverflow).toBe(false);
    expect(result.overflowMm).toBe(0);
  });

  it('許容誤差内（+5px）は収まる判定になる', () => {
    const result = evaluateA4Overflow(A4_HEIGHT_PX + A4_OVERFLOW_TOLERANCE_PX);
    expect(result.isOverflow).toBe(false);
  });

  it('許容誤差を超えるとはみ出し判定になる', () => {
    const result = evaluateA4Overflow(
      A4_HEIGHT_PX + A4_OVERFLOW_TOLERANCE_PX + 1
    );
    expect(result.isOverflow).toBe(true);
    expect(result.overflowMm).toBeGreaterThan(0);
  });

  it('実測したword-enのはみ出しケース（1196px ≒ A4の106.5%）を検出する', () => {
    const result = evaluateA4Overflow(1196);
    expect(result.isOverflow).toBe(true);
    expect(result.heightMm).toBeCloseTo(316.4, 0);
    expect(result.overflowMm).toBeCloseTo(19.4, 0);
  });
});

describe('measureSheetHeightPx', () => {
  it('boundingClientRect と scrollHeight の大きい方を返す', () => {
    const el = document.createElement('div');
    Object.defineProperty(el, 'scrollHeight', { value: 1200 });
    el.getBoundingClientRect = (): DOMRect => ({ height: 1123 }) as DOMRect;
    expect(measureSheetHeightPx(el)).toBe(1200);
  });
});

describe('findOverflowingSheets', () => {
  it('複数シートからはみ出しているものだけを返す', () => {
    const root = document.createElement('div');
    root.appendChild(createSheet(1123)); // 収まる
    root.appendChild(createSheet(1196)); // はみ出し
    root.appendChild(createSheet(1500)); // はみ出し

    const results = findOverflowingSheets(root);
    expect(results).toHaveLength(2);
    expect(results[0].heightPx).toBe(1196);
    expect(results[1].heightPx).toBe(1500);
  });

  it('全シートが収まっている場合は空配列を返す', () => {
    const root = document.createElement('div');
    root.appendChild(createSheet(1000));
    root.appendChild(createSheet(1123));
    expect(findOverflowingSheets(root)).toHaveLength(0);
  });

  it('シートが存在しない場合は空配列を返す', () => {
    const root = document.createElement('div');
    expect(findOverflowingSheets(root)).toHaveLength(0);
  });
});
