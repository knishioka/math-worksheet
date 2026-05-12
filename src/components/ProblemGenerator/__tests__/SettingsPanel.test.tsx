import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsPanel } from '../SettingsPanel';

const baseProps = {
  problemCount: 16,
  layoutColumns: 2 as const,
  onProblemCountChange: vi.fn(),
  onLayoutColumnsChange: vi.fn(),
  onShowEquationLineChange: vi.fn(),
};

describe('SettingsPanel equation line option', () => {
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
