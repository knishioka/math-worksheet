import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LearningPath } from '../LearningPath';

beforeEach(() => localStorage.clear());
describe('学習の道すじ', () => {
  it.each([
    [5, 'entrance-ratio-sharing-jap', '比の分配', 'entrance-multiples-jap'],
    [6, 'entrance-work-jap', '仕事算', 'entrance-newton-jap'],
  ] as const)(
    '%i年生でも受験コースを選択し、次の単元へ進める',
    (grade, pattern, label, next) => {
      const onSelect = vi.fn();
      const { rerender } = render(
        <LearningPath grade={grade} pattern={pattern} onSelect={onSelect} />
      );
      expect(
        screen.getByRole('heading', { name: `${grade}年生の中学受験の道すじ` })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: new RegExp(`未記録 ${label}`) })
      ).toHaveAttribute('aria-pressed', 'true');
      fireEvent.click(screen.getByRole('button', { name: /次の教材/ }));
      expect(onSelect).toHaveBeenCalledWith(next);
      fireEvent.click(screen.getByRole('button', { name: '学校算数' }));
      expect(
        screen.getByRole('heading', { name: `${grade}年生の学習の道すじ` })
      ).toBeInTheDocument();
      rerender(
        <LearningPath grade={grade} pattern={next} onSelect={onSelect} />
      );
      expect(screen.getByRole('button', { name: '中学受験' })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
    }
  );

  it('学校算数から受験コースを閲覧し、教材を選べる', () => {
    const onSelect = vi.fn();
    render(
      <LearningPath grade={4} pattern="add-large-numbers" onSelect={onSelect} />
    );
    fireEvent.click(screen.getByRole('button', { name: '中学受験' }));
    expect(
      screen.getByRole('heading', { name: '4年生の中学受験の道すじ' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'この教材を「練習した」にする' })
    ).not.toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: /和差算/ }));
    expect(onSelect).toHaveBeenCalledWith('entrance-sum-difference-jap');
  });

  it('受験教材を外から選ぶとコースと段階が切り替わり、次へ進める', () => {
    const onSelect = vi.fn();
    const { rerender } = render(
      <LearningPath grade={4} pattern="add-large-numbers" onSelect={onSelect} />
    );
    rerender(
      <LearningPath
        grade={4}
        pattern="entrance-crane-turtle-jap"
        onSelect={onSelect}
      />
    );
    expect(screen.getByRole('button', { name: '中学受験' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(
      screen.getByRole('button', { name: /1つあたりの差を使う/ })
    ).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: /次の教材/ }));
    expect(onSelect).toHaveBeenCalledWith('entrance-difference-gathering-jap');
    fireEvent.click(
      screen.getByRole('button', { name: 'この教材を「練習した」にする' })
    );
    expect(
      JSON.parse(localStorage.getItem('math-worksheet-practice-v1')!)
    ).toEqual(['4:entrance-crane-turtle-jap']);
    rerender(
      <LearningPath grade={3} pattern="div-basic" onSelect={onSelect} />
    );
    expect(
      screen.queryByRole('group', { name: '学習コース' })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '3年生の学習の道すじ' })
    ).toBeInTheDocument();
  });

  it('前の教材に戻れる', () => {
    const onSelect = vi.fn();
    render(
      <LearningPath grade={1} pattern="sub-minus-three" onSelect={onSelect} />
    );
    fireEvent.click(screen.getByRole('button', { name: /前の教材/ }));
    expect(onSelect).toHaveBeenCalledWith('add-plus-three');
  });

  it('サイドバーから別の教材を選ぶと対応する段階へ戻る', () => {
    const { rerender } = render(
      <LearningPath grade={1} pattern="add-plus-three" onSelect={vi.fn()} />
    );
    fireEvent.click(screen.getByRole('button', { name: /数と計算の入り口/ }));
    rerender(
      <LearningPath
        grade={1}
        pattern="sub-single-digit-borrow"
        onSelect={vi.fn()}
      />
    );
    expect(
      screen.getByRole('button', { name: /使い分けて考える/ })
    ).toHaveAttribute('aria-pressed', 'true');
  });
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
