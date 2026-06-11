import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import {
  evaluateA4Overflow,
  measureSheetHeightPx,
} from '../../lib/utils/a4-overflow';
import type { A4OverflowResult } from '../../lib/utils/a4-overflow';

/**
 * 描画済みA4シートの実測高さを監視し、A4超過を検出するフック
 *
 * estimateA4Fit（定数ベースの推定）が「収まる」と判定しても、
 * 文章問題の折り返し行数次第で実際にははみ出すことがあるため、
 * ResizeObserver で実際のDOMの高さを監視する。
 *
 * @param sheetRef - [data-a4-sheet] 要素への ref
 * @param enabled - false の場合は監視しない（印刷モードなど）
 * @param remeasureKey - 変更時に再計測するキー（問題配列など）
 */
export function useA4SheetOverflow(
  sheetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  remeasureKey?: unknown
): A4OverflowResult | null {
  const [result, setResult] = useState<A4OverflowResult | null>(null);

  useEffect(() => {
    if (!enabled) {
      setResult(null);
      return;
    }
    const sheet = sheetRef.current;
    if (!sheet) {
      setResult(null);
      return;
    }

    const measure = (): void => {
      setResult(evaluateA4Overflow(measureSheetHeightPx(sheet)));
    };

    measure();

    // jsdom など ResizeObserver 非対応環境では初回計測のみ
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(sheet);
    return (): void => observer.disconnect();
  }, [sheetRef, enabled, remeasureKey]);

  return result;
}
