import { fireEvent, render, screen } from '@testing-library/react';
import { useState, type ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPanel } from '../SettingsPanel';
import { getEffectiveCounts } from '../../../config/print-templates';
import type {
  CalculationPattern,
  LayoutColumns,
  ProblemType,
} from '../../../types';

const baseProps = {
  problemCount: 16,
  layoutColumns: 2 as const,
  onProblemCountChange: vi.fn(),
  onLayoutColumnsChange: vi.fn(),
  onShowEquationLineChange: vi.fn(),
};

describe('SettingsPanel equation line option', () => {
  it.each([1, 3] as const)(
    'applies the final column recommendation when leaving a %i-column basic material',
    (initialColumns) => {
      const cases = [
        { problemType: 'word', pattern: 'data-bar-chart-jap' },
        { problemType: 'basic', pattern: 'word-en' },
        { problemType: 'anzan', pattern: undefined },
      ] as const;
      for (const material of cases) {
        function ControlledPanel({
          problemType,
          pattern,
        }: {
          problemType: ProblemType;
          pattern?: CalculationPattern;
        }): ReactElement {
          const [columns, setColumns] = useState<LayoutColumns>(initialColumns);
          const [count, setCount] = useState(5);
          return (
            <SettingsPanel
              {...baseProps}
              grade={3}
              problemType={problemType}
              calculationPattern={pattern}
              layoutColumns={columns}
              problemCount={count}
              onLayoutColumnsChange={setColumns}
              onProblemCountChange={setCount}
            />
          );
        }
        const { rerender, unmount } = render(
          <ControlledPanel problemType="basic" pattern="add-single-digit" />
        );
        rerender(<ControlledPanel {...material} />);
        expect(screen.getByRole('button', { name: '2列' })).toHaveAttribute(
          'aria-pressed',
          'true'
        );
        expect(screen.getByRole('combobox')).toHaveValue(
          String(
            getEffectiveCounts(
              material.pattern === 'word-en' ? 'word-en' : material.problemType,
              material.pattern,
              3
            ).recommendedCounts[2]
          )
        );
        unmount();
      }
    }
  );
  it('changes problem order independently of the problem count', () => {
    const onProblemOrderChange = vi.fn();
    const onProblemCountChange = vi.fn();
    render(
      <SettingsPanel
        {...baseProps}
        onProblemOrderChange={onProblemOrderChange}
        onProblemCountChange={onProblemCountChange}
      />
    );
    fireEvent.click(screen.getByRole('radio', { name: /よこ順/ }));
    expect(onProblemOrderChange).toHaveBeenCalledWith('row');
    expect(onProblemCountChange).not.toHaveBeenCalled();
  });
  it('preserves a chosen count when changing columns and clamps only above the maximum', () => {
    const onProblemCountChange = vi.fn();
    const props = {
      ...baseProps,
      problemType: 'basic' as const,
      problemCount: 14,
      layoutColumns: 2 as const,
      onProblemCountChange,
    };
    const { rerender } = render(<SettingsPanel {...props} />);
    rerender(<SettingsPanel {...props} layoutColumns={3} />);
    expect(onProblemCountChange).not.toHaveBeenCalled();
    rerender(<SettingsPanel {...props} layoutColumns={1} />);
    expect(onProblemCountChange).toHaveBeenCalledWith(10);
  });
  it('applies both columns and count when a print recommendation is selected', () => {
    const onLayoutColumnsChange = vi.fn();
    const onProblemCountChange = vi.fn();
    const counts = getEffectiveCounts('word', 'data-bar-chart-jap', 3);
    render(
      <SettingsPanel
        {...baseProps}
        grade={3}
        problemType="word"
        calculationPattern="data-bar-chart-jap"
        problemCount={counts.recommendedCounts[2]}
        onLayoutColumnsChange={onLayoutColumnsChange}
        onProblemCountChange={onProblemCountChange}
      />
    );

    const recommendation = screen.getByRole('button', {
      name: `3列: ${counts.recommendedCounts[3]}問`,
    });
    expect(recommendation).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(recommendation);

    expect(onLayoutColumnsChange).toHaveBeenCalledWith(3);
    expect(onProblemCountChange).toHaveBeenCalledWith(
      counts.recommendedCounts[3]
    );
  });

  it('uses the supplied step number when problem selection is skipped', () => {
    render(<SettingsPanel {...baseProps} stepNumber={2} />);

    expect(screen.getByText('STEP 2')).toBeInTheDocument();
    expect(screen.queryByText('STEP 3')).not.toBeInTheDocument();
  });

  it('shows equation line toggle for Japanese word problems', () => {
    render(
      <SettingsPanel
        {...baseProps}
        problemType="word"
        calculationPattern={undefined}
      />
    );

    expect(screen.getByLabelText('式を書く欄')).toBeInTheDocument();
  });

  it('shows equation line toggle for Singapore Math patterns', () => {
    render(
      <SettingsPanel
        {...baseProps}
        problemType="basic"
        calculationPattern="singapore-bar-model"
      />
    );

    expect(screen.getByLabelText('式を書く欄')).toBeInTheDocument();
  });

  it('does not show equation line toggle for basic calculation problems', () => {
    render(
      <SettingsPanel
        {...baseProps}
        problemType="basic"
        calculationPattern="add-single-digit"
      />
    );

    expect(screen.queryByLabelText('式を書く欄')).not.toBeInTheDocument();
  });

  it('notifies when the equation line toggle changes', () => {
    const onShowEquationLineChange = vi.fn();
    render(
      <SettingsPanel
        {...baseProps}
        problemType="word"
        calculationPattern={undefined}
        onShowEquationLineChange={onShowEquationLineChange}
      />
    );

    fireEvent.click(screen.getByLabelText('式を書く欄'));

    expect(onShowEquationLineChange).toHaveBeenCalledWith(true);
  });
});
