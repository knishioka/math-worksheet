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
      const english = ENTRANCE_EXAM_PATTERNS[pattern].type === 'word-en';
      const listName = english ? 'Solution' : '解き方';
      const answerLabel = english ? 'Answer' : '答え';
      const view = render(<ProblemList {...props} />);
      expect(problems[0].type).toBe(english ? 'word-en' : 'word');
      if (problems[0].figure) {
        const name = screen.getByRole('img').getAttribute('aria-label');
        expect(name).toBeTruthy();
        expect(/[ぁ-んァ-ン一-龥]/.test(name!)).toBe(!english);
      }
      expect(
        screen.queryByRole('list', { name: listName })
      ).not.toBeInTheDocument();
      for (const step of problems[0].solutionSteps!)
        expect(screen.queryByText(step)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(answerLabel, { selector: 'output' })
      ).not.toBeInTheDocument();
      view.rerender(<ProblemList {...props} showAnswers />);
      expect(screen.getByRole('list', { name: listName })).toBeInTheDocument();
      const output = screen.getByLabelText(answerLabel, { selector: 'output' });
      expect(output).toHaveTextContent(String(problems[0].answer));
      if (problems[0].unit) expect(output).toHaveTextContent(problems[0].unit);
      for (const step of problems[0].solutionSteps!)
        expect(screen.getByText(step)).toBeInTheDocument();
    }
  );

  it('底辺の比と灰色の領域を印刷し、面積は解答用紙だけに載せる', () => {
    const problem: WordProblem = {
      id: 'midpoint',
      type: 'word',
      operation: 'division',
      problemText:
        '三角形ABCの面積は60cm²で、EはADの中点です。灰色の三角形の面積は何cm²ですか。',
      figure: { kind: 'split-triangle', left: 4, right: 6, midpoint: true },
      answer: 12,
      unit: 'cm²',
    };
    const props = {
      problems: [problem],
      settings,
      layoutColumns: 1 as const,
      printMode: true,
    };
    const view = render(<ProblemList {...props} />);
    const diagram = screen.getByRole('img', {
      name: /BDとDCの比は4対6。三角形BDE/,
    });
    expect(diagram).toHaveTextContent('BD : DC = 4 : 6');
    expect(screen.queryByText(/12cm²/)).not.toBeInTheDocument();
    view.rerender(<ProblemList {...props} showAnswers />);
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('答え: 12cm²')).toBeInTheDocument();
  });

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
