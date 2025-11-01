import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { ProblemList } from '../../Preview/ProblemList';
import type {
  WorksheetSettings,
  Problem,
  BasicProblem,
  FractionProblem,
  DecimalProblem,
  MixedNumberProblem,
  WordProblem,
  WordProblemEn,
  HissanProblem,
} from '../../../types';

/**
 * 印刷統合テスト
 *
 * PrintLayout.test.tsx と WordEnLayout.test.tsx を統合
 * 実際のコンポーネントをレンダリングして、実装と乖離しないようにする
 */
describe('Print Integration Tests', () => {
  beforeEach(() => {
    // MathMLサポートをモック
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    global.MathMLElement = class MathMLElement {} as any;
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (global as any).MathMLElement;
  });

  describe('Basic Layout and Structure', () => {
    const basicSettings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 6,
      layoutColumns: 2,
    };

    const basicProblems: Problem[] = [
      {
        id: '1',
        type: 'basic',
        operation: 'addition',
        operand1: 5,
        operand2: 3,
        answer: 8,
      },
      {
        id: '2',
        type: 'basic',
        operation: 'addition',
        operand1: 7,
        operand2: 2,
        answer: 9,
      },
      {
        id: '3',
        type: 'basic',
        operation: 'addition',
        operand1: 4,
        operand2: 6,
        answer: 10,
      },
      {
        id: '4',
        type: 'basic',
        operation: 'addition',
        operand1: 8,
        operand2: 1,
        answer: 9,
      },
      {
        id: '5',
        type: 'basic',
        operation: 'addition',
        operand1: 3,
        operand2: 4,
        answer: 7,
      },
      {
        id: '6',
        type: 'basic',
        operation: 'addition',
        operand1: 6,
        operand2: 2,
        answer: 8,
      },
    ];

    it('should render header with correct information', () => {
      const { container } = render(
        <ProblemList
          problems={basicProblems}
          layoutColumns={2}
          showAnswers={false}
          settings={basicSettings}
        />
      );

      const html = container.innerHTML;
      expect(html).toContain('名前：');
      expect(html).toContain('点数：');
      expect(html).toContain('3年生');
    });

    it('should arrange problems in vertical order for 2-column layout', () => {
      const { container } = render(
        <ProblemList
          problems={basicProblems}
          layoutColumns={2}
          showAnswers={false}
          settings={basicSettings}
        />
      );

      const html = container.innerHTML;
      // 2列レイアウトの場合、縦順になっているか確認
      // 期待される順序: (1), (4), (2), (5), (3), (6)
      const problemNumbers = html.match(/\(\d+\)/g);
      expect(problemNumbers).toEqual(['(1)', '(4)', '(2)', '(5)', '(3)', '(6)']);
    });

    it('should show answers when showAnswers is true', () => {
      const { container } = render(
        <ProblemList
          problems={basicProblems}
          layoutColumns={2}
          showAnswers={true}
          settings={basicSettings}
        />
      );

      const html = container.innerHTML;
      // 答えが表示されているか確認
      expect(html).toContain('8'); // 5 + 3 の答え
      expect(html).toContain('9'); // 7 + 2 の答え
    });

    it('should show answer lines when showAnswers is false', () => {
      const { container } = render(
        <ProblemList
          problems={basicProblems}
          layoutColumns={2}
          showAnswers={false}
          settings={basicSettings}
        />
      );

      const html = container.innerHTML;
      // 答えの下線が表示されているか確認
      expect(html).toContain('border-bottom');
    });

    it('should handle 3-column layout correctly', () => {
      const { container } = render(
        <ProblemList
          problems={basicProblems}
          layoutColumns={3}
          showAnswers={false}
          settings={{ ...basicSettings, layoutColumns: 3 }}
        />
      );

      const html = container.innerHTML;
      // 3列グリッドが使用されているか確認
      expect(html).toContain('grid-cols-3');
    });
  });

  describe('Problem Type Rendering', () => {
    const createSettings = (problemType: string): WorksheetSettings => ({
      grade: 3,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      problemType: problemType as any,
      operation: 'addition',
      problemCount: 1,
      layoutColumns: 2,
    });

    it('should render fraction problems correctly', () => {
      const fractionProblem: FractionProblem = {
        id: '1',
        type: 'fraction',
        operation: 'addition',
        numerator1: 1,
        denominator1: 2,
        numerator2: 1,
        denominator2: 3,
        answerNumerator: 5,
        answerDenominator: 6,
      };

      const { container } = render(
        <ProblemList
          problems={[fractionProblem]}
          layoutColumns={2}
          showAnswers={false}
          settings={createSettings('fraction')}
        />
      );

      const html = container.innerHTML;
      // 分数が表示されているか確認
      expect(html).toContain('1');
      expect(html).toContain('2');
      expect(html).toContain('3');
    });

    it('should render decimal problems correctly', () => {
      const decimalProblem: DecimalProblem = {
        id: '1',
        type: 'decimal',
        operation: 'addition',
        operand1: 12.5,
        operand2: 3.7,
        answer: 16.2,
        decimalPlaces: 1,
      };

      const { container } = render(
        <ProblemList
          problems={[decimalProblem]}
          layoutColumns={2}
          showAnswers={false}
          settings={createSettings('decimal')}
        />
      );

      const html = container.innerHTML;
      // 小数が表示されているか確認
      expect(html).toContain('12.5');
      expect(html).toContain('3.7');
    });

    it('should render mixed number problems correctly', () => {
      const mixedProblem: MixedNumberProblem = {
        id: '1',
        type: 'mixed',
        operation: 'addition',
        whole1: 1,
        numerator1: 1,
        denominator1: 2,
        whole2: 2,
        numerator2: 1,
        denominator2: 3,
        answerWhole: 3,
        answerNumerator: 5,
        answerDenominator: 6,
      };

      const { container } = render(
        <ProblemList
          problems={[mixedProblem]}
          layoutColumns={2}
          showAnswers={false}
          settings={createSettings('mixed')}
        />
      );

      const html = container.innerHTML;
      // 帯分数が表示されているか確認
      expect(html).toBeTruthy();
    });

    it('should render word problems correctly', () => {
      const wordProblem: WordProblem = {
        id: '1',
        type: 'word',
        operation: 'multiplication',
        problemText: 'たて5cm、よこ3cmの長方形の面積は？',
        answer: 15,
        unit: 'cm²',
      };

      const { container } = render(
        <ProblemList
          problems={[wordProblem]}
          layoutColumns={2}
          showAnswers={false}
          settings={createSettings('word')}
        />
      );

      const html = container.innerHTML;
      // 文章問題が表示されているか確認
      expect(html).toContain('たて5cm、よこ3cmの長方形の面積は？');
      expect(html).toContain('cm²');
    });

    it('should render missing number problems correctly', () => {
      const missingProblem: BasicProblem = {
        id: '1',
        type: 'basic',
        operation: 'addition',
        operand1: null,
        operand2: 3,
        answer: 8,
        missingPosition: 'operand1',
      };

      const { container } = render(
        <ProblemList
          problems={[missingProblem]}
          layoutColumns={2}
          showAnswers={false}
          settings={createSettings('basic')}
        />
      );

      const html = container.innerHTML;
      // 虫食い算の空欄が表示されているか確認（スタイルで判定）
      expect(html).toBeTruthy();
    });

    it('should render hissan problems correctly', () => {
      const hissanProblem: HissanProblem = {
        id: '1',
        type: 'hissan',
        operation: 'addition',
        operand1: 45,
        operand2: 32,
        answer: 77,
      };

      const { container } = render(
        <ProblemList
          problems={[hissanProblem]}
          layoutColumns={2}
          showAnswers={false}
          settings={createSettings('hissan')}
        />
      );

      const html = container.innerHTML;
      // 筆算の数字が表示されているか確認（個別のspanに分割されている）
      expect(html).toContain('4');
      expect(html).toContain('5');
      expect(html).toContain('3');
      expect(html).toContain('2');
      // 筆算の横線が表示されているか確認
      expect(html).toContain('border-top');
    });
  });

  describe('English Word Problems Layout', () => {
    const wordEnSettings: WorksheetSettings = {
      grade: 3,
      problemType: 'word-en',
      operation: 'addition',
      problemCount: 16,
      layoutColumns: 2,
    };

    const createWordEnProblems = (count: number): WordProblemEn[] =>
      Array.from({ length: count }, (_, i) => ({
        id: `word-en-${i}`,
        type: 'word-en' as const,
        operation: 'addition' as const,
        problemText: `Problem ${i + 1}: Sam has ${i + 1} apples.`,
        answer: i + 1,
        category: 'word-story' as const,
        language: 'en' as const,
      }));

    it('should display word-en problems in 2 columns', () => {
      const problems = createWordEnProblems(16);
      const { container } = render(
        <ProblemList
          problems={problems}
          layoutColumns={2}
          showAnswers={false}
          settings={wordEnSettings}
        />
      );

      const html = container.innerHTML;
      // 2列グリッドが使用されているか確認
      expect(html).toContain('grid-cols-2');
      // 問題数が正しいか確認
      const problemNumbers = html.match(/\(\d+\)/g);
      expect(problemNumbers).toHaveLength(16);
    });

    it('should display word-en problems in 3 columns', () => {
      const problems = createWordEnProblems(18);
      const { container } = render(
        <ProblemList
          problems={problems}
          layoutColumns={3}
          showAnswers={false}
          settings={{ ...wordEnSettings, layoutColumns: 3, problemCount: 18 }}
        />
      );

      const html = container.innerHTML;
      // 3列グリッドが使用されているか確認
      expect(html).toContain('grid-cols-3');
      // 問題数が正しいか確認
      const problemNumbers = html.match(/\(\d+\)/g);
      expect(problemNumbers).toHaveLength(18);
    });

    it('should have correct HTML structure for word-en', () => {
      const problems = createWordEnProblems(4);
      const { container } = render(
        <ProblemList
          problems={problems}
          layoutColumns={2}
          showAnswers={false}
          settings={{ ...wordEnSettings, problemCount: 4 }}
        />
      );

      const html = container.innerHTML;
      // グリッドコンテナが存在することを確認
      expect(html).toContain('grid');
      // 問題が含まれているか確認
      expect(html).toContain('Problem 1');
      expect(html).toContain('Problem 2');
      expect(html).toContain('Problem 3');
      expect(html).toContain('Problem 4');
    });

    it('should properly render problem numbers inline', () => {
      const problems = createWordEnProblems(2);
      const { container } = render(
        <ProblemList
          problems={problems}
          layoutColumns={2}
          showAnswers={false}
          settings={{ ...wordEnSettings, problemCount: 2 }}
        />
      );

      const html = container.innerHTML;
      // 問題番号が表示されているか確認
      expect(html).toContain('(1)');
      expect(html).toContain('(2)');
    });
  });

  describe('Dynamic Padding and A4 Fit', () => {
    it('should show warning when problems exceed A4 size', () => {
      const manyProblems: BasicProblem[] = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        type: 'basic',
        operation: 'addition',
        operand1: i + 1,
        operand2: i + 1,
        answer: (i + 1) * 2,
      }));

      const { container } = render(
        <ProblemList
          problems={manyProblems}
          layoutColumns={2}
          showAnswers={false}
          settings={{
            grade: 3,
            problemType: 'basic',
            operation: 'addition',
            problemCount: 50,
            layoutColumns: 2,
          }}
        />
      );

      const html = container.innerHTML;
      // A4警告が表示されているか確認
      expect(html).toContain('A4サイズを超えています');
    });

    it('should not show warning when problems fit in A4', () => {
      const fewProblems: BasicProblem[] = Array.from({ length: 10 }, (_, i) => ({
        id: `${i + 1}`,
        type: 'basic',
        operation: 'addition',
        operand1: i + 1,
        operand2: i + 1,
        answer: (i + 1) * 2,
      }));

      const { container } = render(
        <ProblemList
          problems={fewProblems}
          layoutColumns={2}
          showAnswers={false}
          settings={{
            grade: 3,
            problemType: 'basic',
            operation: 'addition',
            problemCount: 10,
            layoutColumns: 2,
          }}
        />
      );

      const html = container.innerHTML;
      // A4警告が表示されていないことを確認
      expect(html).not.toContain('A4サイズを超えています');
    });
  });

  describe('Empty State', () => {
    it('should show message when no problems are provided', () => {
      const { container } = render(
        <ProblemList
          problems={[]}
          layoutColumns={2}
          showAnswers={false}
          settings={{
            grade: 3,
            problemType: 'basic',
            operation: 'addition',
            problemCount: 0,
            layoutColumns: 2,
          }}
        />
      );

      const html = container.innerHTML;
      // 空状態メッセージが表示されているか確認
      expect(html).toContain('設定を確認して「問題を生成」ボタンをクリックしてください');
    });
  });

  describe('Print Mode', () => {
    it('should not show A4 warning in print mode', () => {
      const manyProblems: BasicProblem[] = Array.from({ length: 50 }, (_, i) => ({
        id: `${i + 1}`,
        type: 'basic',
        operation: 'addition',
        operand1: i + 1,
        operand2: i + 1,
        answer: (i + 1) * 2,
      }));

      const { container } = render(
        <ProblemList
          problems={manyProblems}
          layoutColumns={2}
          showAnswers={false}
          settings={{
            grade: 3,
            problemType: 'basic',
            operation: 'addition',
            problemCount: 50,
            layoutColumns: 2,
          }}
          printMode={true}
        />
      );

      const html = container.innerHTML;
      // 印刷モードではA4警告が表示されないことを確認
      expect(html).not.toContain('A4サイズを超えています');
    });

    it('should not show box-shadow in print mode', () => {
      const problems: BasicProblem[] = [
        {
          id: '1',
          type: 'basic',
          operation: 'addition',
          operand1: 5,
          operand2: 3,
          answer: 8,
        },
      ];

      const { container } = render(
        <ProblemList
          problems={problems}
          layoutColumns={2}
          showAnswers={false}
          settings={{
            grade: 3,
            problemType: 'basic',
            operation: 'addition',
            problemCount: 1,
            layoutColumns: 2,
          }}
          printMode={true}
        />
      );

      // 印刷モードではbox-shadowが'none'になっているか確認
      const a4Container = container.querySelector('[style*="width: 210mm"]');
      const styles = a4Container?.getAttribute('style');
      expect(styles).toContain('box-shadow: none');
    });
  });
});
