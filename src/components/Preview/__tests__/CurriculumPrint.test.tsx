import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProblemList } from '../ProblemList';
import {
  ENTRANCE_EXAM_PATTERNS,
  type EntranceExamPattern,
} from '../../../config/entrance-exam-patterns';
import { generateEntranceExamProblems } from '../../../lib/generators/entrance-exam';
import type {
  BasicProblem,
  WorksheetSettings,
  WordProblem,
} from '../../../types';

const settings: WorksheetSettings = {
  grade: 4,
  problemType: 'basic',
  operation: 'division',
  calculationPattern: 'div-with-remainder',
  problemCount: 1,
  layoutColumns: 1,
};
describe('新しい学習内容の印刷', () => {
  it.each(Object.keys(ENTRANCE_EXAM_PATTERNS) as EntranceExamPattern[])(
    '%s: 解答付きのときだけ考え方と答えを表示する',
    (pattern) => {
      const problems = generateEntranceExamProblems(pattern, 1);
      const props = {
        problems,
        settings: {
          ...settings,
          grade: ENTRANCE_EXAM_PATTERNS[pattern].grade,
          calculationPattern: pattern,
          showEquationLine: true,
        },
        layoutColumns: 1 as const,
        printMode: true,
      };
      const view = render(<ProblemList {...props} />);
      expect(
        screen.queryByRole('list', { name: '解き方' })
      ).not.toBeInTheDocument();
      for (const step of problems[0].solutionSteps!)
        expect(screen.queryByText(step)).not.toBeInTheDocument();
      expect(
        screen.queryByText(`答え: ${problems[0].answer}${problems[0].unit}`)
      ).not.toBeInTheDocument();
      view.rerender(<ProblemList {...props} showAnswers />);
      expect(screen.getByRole('list', { name: '解き方' })).toBeInTheDocument();
      expect(
        screen.getByText(`答え: ${problems[0].answer}${problems[0].unit}`)
      ).toBeInTheDocument();
      for (const step of problems[0].solutionSteps!)
        expect(screen.getByText(step)).toBeInTheDocument();
    }
  );

  it('あまりの解答欄があり、解答表示時のみ値が見える', () => {
    const problem: BasicProblem = {
      id: 'remainder',
      type: 'basic',
      operation: 'division',
      operand1: 50,
      operand2: 7,
      answer: 7,
      remainder: 1,
    };
    const view = render(
      <ProblemList
        problems={[problem]}
        settings={settings}
        layoutColumns={1}
        printMode
      />
    );
    expect(screen.getByText('あまり')).toHaveTextContent(/^あまり\s*$/);
    view.rerender(
      <ProblemList
        problems={[problem]}
        settings={settings}
        layoutColumns={1}
        printMode
        showAnswers
      />
    );
    expect(screen.getByText('あまり')).toHaveTextContent('あまり 1');
  });
  it('棒グラフは与えられたデータを表示し、求める差を明かさない', () => {
    const problem: WordProblem = {
      id: 'chart',
      type: 'word',
      operation: 'subtraction',
      problemText: '人数のちがいは？',
      answer: 3,
      unit: '人',
      dataDisplay: {
        kind: 'bar',
        label: '好きな遊び',
        unit: '人',
        entries: [
          { label: 'A', value: 2 },
          { label: 'B', value: 5 },
        ],
      },
    };
    const view = render(
      <ProblemList
        problems={[problem]}
        settings={{ ...settings, calculationPattern: 'data-bar-chart-jap' }}
        layoutColumns={1}
        printMode
      />
    );
    expect(screen.getByRole('img', { name: /A2人、B5人/ })).toBeInTheDocument();
    expect(screen.queryByText('答え: 3人')).not.toBeInTheDocument();
    view.rerender(
      <ProblemList
        problems={[problem]}
        settings={settings}
        layoutColumns={1}
        printMode
        showAnswers
      />
    );
    expect(screen.getByText('答え: 3人')).toBeInTheDocument();
  });
});
