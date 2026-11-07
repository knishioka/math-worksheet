import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CalculationPatternSelector } from '../CalculationPatternSelector';

const openPicker = (): void => {
  fireEvent.click(screen.getByRole('button', { name: '問題を変更' }));
};

const categoryButton = (name: RegExp): HTMLElement =>
  screen.getByRole('button', { name });

describe('CalculationPatternSelector', () => {
  it('shows category headings and keeps the learning order inside themes', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={2}
        selectedPattern="mult-table-five"
        onPatternChange={onPatternChange}
      />
    );
    openPicker();
    expect(
      screen.getByRole('heading', { name: /基本計算 ·/ })
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '九九' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    const tables = radios
      .map((radio) => (radio as HTMLInputElement).value)
      .filter((pattern) => pattern.startsWith('mult-table-'));
    expect(tables.slice(0, 2)).toEqual(['mult-table-two', 'mult-table-five']);
    expect(onPatternChange).not.toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: /九九・5の段/ })).toBeChecked();
  });

  it('opens only the category of the selected pattern by default', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );
    openPicker();
    expect(categoryButton(/基本計算 ·/)).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(categoryButton(/生活の中の算数 ·/)).toHaveAttribute(
      'aria-expanded',
      'false'
    );
    expect(
      screen.queryByRole('radio', { name: /おつりの計算/ })
    ).not.toBeInTheDocument();

    fireEvent.click(categoryButton(/生活の中の算数 ·/));
    expect(categoryButton(/生活の中の算数 ·/)).toHaveAttribute(
      'aria-expanded',
      'true'
    );
    expect(screen.getByRole('group', { name: 'お金' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /おつりの計算/ })
    ).toBeInTheDocument();
  });

  it('merges Japanese and English versions into one card per theme', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={onPatternChange}
      />
    );
    openPicker();
    expect(categoryButton(/生活の中の算数 · 28件/)).toBeInTheDocument();
    fireEvent.click(categoryButton(/生活の中の算数 ·/));
    expect(
      screen.queryByRole('radio', { name: /Change Calculation/ })
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(onPatternChange).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('radio', { name: /おつりの計算/ })
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: /Change Calculation/ }));
    expect(onPatternChange).toHaveBeenCalledWith('money-change-en');
  });

  it('switches the selected material to its other-language version', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="money-change-jap"
        onPatternChange={onPatternChange}
      />
    );
    fireEvent.click(
      screen.getByRole('button', { name: 'English版に切り替える' })
    );
    expect(onPatternChange).toHaveBeenCalledWith('money-change-en');
  });

  it('labels single-language materials when the other language is chosen', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );
    openPicker();
    fireEvent.click(categoryButton(/文章問題 ·/));
    const option = screen
      .getByRole('radio', { name: /English Word Problems/ })
      .closest('label');
    expect(option).not.toBeNull();
    expect(within(option!).getByText('Englishのみ')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(within(option!).queryByText('Englishのみ')).not.toBeInTheDocument();
  });

  it('marks materials that are part of the learning path only where it tells them apart', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );
    openPicker();
    // 基本計算は全部が道すじ上なのでバッジを出さない
    const basic = screen.getByRole('group', { name: '基本計算' });
    expect(within(basic).queryByText('道すじ')).not.toBeInTheDocument();

    fireEvent.click(categoryButton(/生活の中の算数 ·/));
    const onPath = screen
      .getByRole('radio', { name: /長さの単位/ })
      .closest('label');
    const offPath = screen
      .getByRole('radio', { name: /おつりの計算/ })
      .closest('label');
    expect(within(onPath!).getByText('道すじ')).toBeInTheDocument();
    expect(within(offPath!).queryByText('道すじ')).not.toBeInTheDocument();
  });

  it('normalizes kana and matches multiple keywords regardless of their order', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );
    openPicker();
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: 'タシ算　大きな数' },
    });
    expect(
      screen.getByRole('radio', { name: /大きな数のたし算・ひき算ミックス/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('radio', { name: /^大きな数のひき算/ })
    ).not.toBeInTheDocument();
  });

  it('expands every matching category while searching', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );
    openPicker();
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: 'おつり' },
    });
    expect(
      screen.getByRole('radio', { name: /おつりの計算/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /交通機関のおつり/ })
    ).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /おつり算/ })).toBeInTheDocument();
    // 英語版の説明にも一致するので、言語を切り替えても見つかる
    fireEvent.click(screen.getByRole('button', { name: 'English' }));
    expect(
      screen.getByRole('radio', { name: /Change Calculation/ })
    ).toBeInTheDocument();
  });

  it('focuses search on open and closes with Escape without changing the selection', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={onPatternChange}
      />
    );
    openPicker();
    const search = screen.getByLabelText('キーワードで探す');
    expect(search).toHaveFocus();
    fireEvent.keyDown(search, { key: 'Escape' });
    expect(screen.queryByLabelText('キーワードで探す')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '問題を変更' })).toHaveFocus();
    expect(onPatternChange).not.toHaveBeenCalled();
  });

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

    openPicker();
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: '大きな数' },
    });

    expect(screen.getByText('3件の候補')).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: /大きな数のたし算・ひき算ミックス/ })
    ).toBeInTheDocument();
  });

  it('filters by difficulty without changing the current selection', () => {
    const onPatternChange = vi.fn();
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={onPatternChange}
      />
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '★★★ チャレンジ' }));

    expect(onPatternChange).not.toHaveBeenCalled();
    expect(screen.getByText('大きな数のたし算')).toBeInTheDocument();
    const basic = screen.getByRole('group', { name: '基本計算' });
    expect(within(basic).getAllByRole('radio')).toHaveLength(1);
    expect(
      within(basic).getByRole('radio', {
        name: /大きな数のたし算・ひき算ミックス/,
      })
    ).toBeInTheDocument();
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

    openPicker();
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

    openPicker();
    fireEvent.click(screen.getByRole('radio', { name: /大きな数のひき算/ }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '問題を変更' })).toHaveFocus()
    );
  });

  it('clears the difficulty restriction with the other filters', () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    openPicker();
    fireEvent.click(screen.getByRole('button', { name: '★ やさしい' }));
    expect(screen.queryByText('62件の候補')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: '絞り込みを解除' }));

    expect(screen.getByText('62件の候補')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'すべて' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
  });

  it('moves focus to search after clearing filters', async () => {
    render(
      <CalculationPatternSelector
        grade={4}
        selectedPattern="add-large-numbers"
        onPatternChange={vi.fn()}
      />
    );

    openPicker();
    fireEvent.change(screen.getByLabelText('キーワードで探す'), {
      target: { value: '該当しない検索' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'すべての候補を表示' }));

    await waitFor(() =>
      expect(screen.getByLabelText('キーワードで探す')).toHaveFocus()
    );
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

    expect(onPatternChange).toHaveBeenCalledWith('add-counting');
  });
});
