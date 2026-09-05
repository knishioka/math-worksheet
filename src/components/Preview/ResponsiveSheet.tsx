import { useEffect, useRef, useState, type ReactNode } from 'react';

/** 画面だけ縮小し、A4の組版と印刷対象のDOM寸法を保つ。 */
export function ResponsiveSheet({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ scale: 1, height: 1163 });
  const [fit, setFit] = useState(true);
  useEffect(() => {
    const measure = (): void => {
      if (!viewport.current || !content.current) return;
      const scale = fit
        ? Math.min(1, viewport.current.clientWidth / ((210 * 96) / 25.4))
        : 1;
      setSize({ scale, height: content.current.scrollHeight * scale });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    if (content.current) observer.observe(content.current);
    return (): void => observer.disconnect();
  }, [fit]);
  return (
    <>
      <div
        className="no-print flex items-center justify-end gap-2 bg-stone-100 px-4 py-2 text-xs text-slate-600"
        role="group"
        aria-label="プレビューの大きさ"
      >
        <span className="mr-auto">A4 · 210 × 297 mm</span>
        <button
          type="button"
          className="secondary-button"
          aria-pressed={fit}
          onClick={() => setFit(true)}
        >
          用紙全体
        </button>
        <button
          type="button"
          className="secondary-button"
          aria-pressed={!fit}
          onClick={() => setFit(false)}
        >
          原寸で見る
        </button>
      </div>
      <div
        ref={viewport}
        className="sheet-viewport"
        style={{ height: size.height, overflowX: fit ? 'hidden' : 'auto' }}
      >
        <div
          ref={content}
          className="sheet-scaled"
          style={{ transform: `scale(${size.scale})` }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
