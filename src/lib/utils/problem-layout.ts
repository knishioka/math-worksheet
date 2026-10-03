import type { LayoutColumns, ProblemOrder } from '../../types';

/** 元の番号を保ち、たて順では列ごとの問題数を均等に配分する。 */
export function arrangeProblems<T>(
  problems: T[],
  columns: LayoutColumns,
  order: ProblemOrder = 'column'
): ({ problem: T; number: number } | null)[] {
  const rows = Math.ceil(problems.length / columns);
  const perColumn = Math.floor(problems.length / columns);
  const extraColumns = problems.length % columns;
  return Array.from({ length: rows * columns }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const columnSize = perColumn + (column < extraColumns ? 1 : 0);
    if (order === 'column' && row >= columnSize) return null;
    const sourceIndex =
      order === 'row'
        ? index
        : column * perColumn + Math.min(column, extraColumns) + row;
    return sourceIndex < problems.length
      ? { problem: problems[sourceIndex], number: sourceIndex + 1 }
      : null;
  });
}
