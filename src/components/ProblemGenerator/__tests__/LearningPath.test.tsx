import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LearningPath } from '../LearningPath';

beforeEach(() => localStorage.clear());
describe('学習の道すじ', () => {
  it('加減を対に選べて、選択しただけでは練習済みにならない', () => {
    const onSelect = vi.fn();
    render(
      <LearningPath grade={1} pattern="add-plus-three" onSelect={onSelect} />
    );
    const stage = screen.getByRole('group', { name: 'たす・ひくを対に' });
    fireEvent.click(within(stage).getByRole('button', { name: /−3のひき算/ }));
    expect(onSelect).toHaveBeenCalledWith('sub-minus-three');
    expect(localStorage.getItem('math-worksheet-practice-v1')).toBeNull();
  });
  it('練習の記録を保存・復元・取り消しできる', () => {
    const props = {
      grade: 1 as const,
      pattern: 'sub-minus-three' as const,
      onSelect: vi.fn(),
    };
    const first = render(<LearningPath {...props} />);
    fireEvent.click(
      screen.getByRole('button', { name: 'この教材を「練習した」にする' })
    );
    expect(
      JSON.parse(localStorage.getItem('math-worksheet-practice-v1')!)
    ).toEqual(['1:sub-minus-three']);
    first.unmount();
    render(<LearningPath {...props} />);
    fireEvent.click(
      screen.getByRole('button', { name: '✓ 練習済み（取り消す）' })
    );
    expect(
      JSON.parse(localStorage.getItem('math-worksheet-practice-v1')!)
    ).toEqual([]);
  });
  it('次の教材に進んでも習得判定を自動で付けない', () => {
    const onSelect = vi.fn();
    render(
      <LearningPath grade={1} pattern="add-plus-three" onSelect={onSelect} />
    );
    fireEvent.click(screen.getByRole('button', { name: /次の教材/ }));
    expect(onSelect).toHaveBeenCalledWith('sub-minus-three');
    expect(localStorage.getItem('math-worksheet-practice-v1')).toBeNull();
  });
  it('別の段階を閲覧中に、前の教材を誤って記録させない', () => {
    render(
      <LearningPath grade={1} pattern="add-plus-three" onSelect={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /数と計算の入り口/ }));
    expect(
      screen.queryByRole('button', { name: 'この教材を「練習した」にする' })
    ).not.toBeInTheDocument();
  });
  it('壊れた保存データでも表示できる', () => {
    localStorage.setItem('math-worksheet-practice-v1', '{invalid');
    render(<LearningPath grade={3} pattern="div-basic" onSelect={vi.fn()} />);
    expect(
      screen.getByRole('heading', { name: '3年生の学習の道すじ' })
    ).toBeInTheDocument();
  });
});
