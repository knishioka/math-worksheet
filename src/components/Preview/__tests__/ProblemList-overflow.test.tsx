import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Problem, WorksheetSettings } from '../../../types';
import type { A4OverflowResult } from '../../../lib/utils/a4-overflow';

let useA4SheetOverflowMock: Mock<() => A4OverflowResult | null>;

vi.mock('../useA4SheetOverflow', () => ({
  useA4SheetOverflow: (): A4OverflowResult | null => useA4SheetOverflowMock(),
}));

import { ProblemList } from '../ProblemList';

const settings: WorksheetSettings = {
  grade: 4,
  problemType: 'basic',
  operation: 'addition',
  problemCount: 4,
  layoutColumns: 2,
};

const problems: Problem[] = Array.from({ length: 4 }, (_, index) => ({
  id: `p-${index}`,
  type: 'basic',
  operation: 'addition',
  operand1: index + 1,
  operand2: index + 2,
  answer: index + index + 3,
}));

describe('ProblemList 実測ベースのA4オーバーフロー警告', () => {
  beforeEach(() => {
    useA4SheetOverflowMock = vi.fn<() => A4OverflowResult | null>(() => null);
  });

  it('実測が収まっている場合は警告を表示しない', () => {
    useA4SheetOverflowMock.mockReturnValue({
      isOverflow: false,
      heightPx: 1123,
      heightMm: 297,
      overflowMm: 0,
    });

    render(
      <ProblemList
        problems={problems}
        layoutColumns={settings.layoutColumns}
        settings={settings}
      />
    );

    expect(
      screen.queryByText('A4サイズを超えています')
    ).not.toBeInTheDocument();
  });

  it('推定が収まる判定でも実測ではみ出していれば警告を表示する', () => {
    // 4問2列のbasicは推定では余裕で収まるが、実測がはみ出した状況を再現
    useA4SheetOverflowMock.mockReturnValue({
      isOverflow: true,
      heightPx: 1196,
      heightMm: 316.4,
      overflowMm: 19.4,
    });

    render(
      <ProblemList
        problems={problems}
        layoutColumns={settings.layoutColumns}
        settings={settings}
      />
    );

    expect(screen.getByText('A4サイズを超えています')).toBeInTheDocument();
    expect(screen.getByText(/実測高さ: 316mm/)).toBeInTheDocument();
  });

  it('印刷モードでは警告を表示しない', () => {
    useA4SheetOverflowMock.mockReturnValue({
      isOverflow: true,
      heightPx: 1196,
      heightMm: 316.4,
      overflowMm: 19.4,
    });

    render(
      <ProblemList
        problems={problems}
        layoutColumns={settings.layoutColumns}
        settings={settings}
        printMode
      />
    );

    expect(
      screen.queryByText('A4サイズを超えています')
    ).not.toBeInTheDocument();
  });
});
