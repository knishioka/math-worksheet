import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalculationPatternSelector } from '../CalculationPatternSelector';

describe('CalculationPatternSelector', () => {
  it('keeps the sidebar compact until the user changes the problem', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    expect(screen.getByText('大きな数のたし算')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '問題を変更' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(screen.queryByLabelText('キーワードで探す')).not.toBeInTheDocument();
  });

  it('searches labels and descriptions across categories', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: '大きな数' },
    });

    expect(screen.getByText('3件の候補')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /大きな数のたし算・ひき算ミックス/ })
    ).toBeInTheDocument();
  });

  it('filters discovery results without changing the current selection', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={onPatternChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    fireEvent.change(screen.getByLabelText('難易度で絞り込む'), {
      target: { value: '3' },
    });

    expect(onPatternChange).not.toHaveBeenCalled();
    expect(screen.getByText('大きな数のたし算')).toBeInTheDocument();
  });

  it('selects a result and closes the picker', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={onPatternChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.click(screen.getByRole('radio', { name: /大きな数のひき算/ }));

    expect(onPatternChange).toHaveBeenCalledWith('sub-large-numbers');
    expect(screen.queryByLabelText('キーワードで探す')).not.toBeInTheDocument();
  });

  it('restores focus to the change button after selecting a result', async () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.click(screen.getByRole('radio', { name: /大きな数のひき算/ }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '問題を変更' })).toHaveFocus()
    );
  });

  it('clears the language restriction with the other filters', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.click(screen.getByRole('button', { name: '日本語' }));
    fireEvent.click(screen.getByRole('button', { name: '絞り込みを解除' }));

    expect(
      screen.getByRole('radio', { name: /English Word Problems/ })
    ).toBeInTheDocument();
  });

  it('moves focus to search after clearing filters', async () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: '該当しない検索' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'すべての候補を表示' }));

    await waitFor(() =>
      expect(screen.getByLabelText('キーワードで探す')).toHaveFocus()
    );
  });

  it('combines category and difficulty filters', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
    fireEvent.click(screen.getByRole('button', { name: /基本計算/ }));
    fireEvent.change(screen.getByLabelText('難易度で絞り込む'), {
      target: { value: '3' },
    });

    expect(screen.getByText('1件の候補')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /大きな数のたし算・ひき算ミックス/ })
    ).toBeInTheDocument();
  });

  it('defaults to the first visible recommendation when no pattern is selected', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={1}
        selectedPattern={undefined}
        onPatternChange={onPatternChange}
      />
    );

    expect(onPatternChange).toHaveBeenCalledWith('add-single-digit');
  });
});
