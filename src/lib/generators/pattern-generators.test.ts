import { describe, it, expect } from 'vitest';
import { generateProblems } from './index';
import type { WorksheetSettings } from '../../types';

describe('pattern-generators', () => {
  describe('hissan-mult-basic (2桁×1桁のかけ算)', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'multiplication',
      problemCount: 10,
      layoutColumns: 2,
      calculationPattern: 'hissan-mult-basic',
    };

    it('should generate 2-digit × 1-digit multiplication problems', () => {
      const problems = generateProblems(settings);

      expect(problems).toHaveLength(10);

      problems.forEach((problem) => {
        expect(problem.type).toBe('hissan');
        expect(problem.operation).toBe('multiplication');

        if (problem.type === 'hissan') {
          // operand1 は 2桁（10-99）
          expect(problem.operand1).toBeGreaterThanOrEqual(10);
          expect(problem.operand1).toBeLessThanOrEqual(99);

          // operand2 は 1桁（1-9）
          expect(problem.operand2!).toBeGreaterThanOrEqual(1);
          expect(problem.operand2!).toBeLessThanOrEqual(9);

          // 答えの検証
          expect(problem.answer).toBe(problem.operand1 * problem.operand2!);
        }
      });
    });

    it('should generate different problems', () => {
      const problems = generateProblems({ ...settings, problemCount: 20 });

      // すべて異なる問題かチェック（完全に同じ問題がないことを確認）
      const uniqueProblems = new Set(
        problems
          .filter((p) => p.type === 'hissan')
          .map((p) => `${p.operand1}×${p.operand2}`)
      );

      // 20問中、少なくとも15問は異なることを期待（ランダム性を考慮）
      expect(uniqueProblems.size).toBeGreaterThanOrEqual(15);
    });
  });

  describe('hissan-mult-advanced (3桁×2桁のかけ算)', () => {
    const settings: WorksheetSettings = {
      grade: 4,
      problemType: 'basic',
      operation: 'multiplication',
      problemCount: 10,
      layoutColumns: 2,
      calculationPattern: 'hissan-mult-advanced',
    };

    it('should generate 3-digit × 2-digit multiplication problems', () => {
      const problems = generateProblems(settings);

      expect(problems).toHaveLength(10);

      problems.forEach((problem) => {
        expect(problem.type).toBe('hissan');
        expect(problem.operation).toBe('multiplication');

        if (problem.type === 'hissan') {
          // operand1 は 3桁（100-999）
          expect(problem.operand1).toBeGreaterThanOrEqual(100);
          expect(problem.operand1).toBeLessThanOrEqual(999);

          // operand2 は 2桁（10-99）
          expect(problem.operand2!).toBeGreaterThanOrEqual(10);
          expect(problem.operand2!).toBeLessThanOrEqual(99);

          // 答えの検証
          expect(problem.answer).toBe(problem.operand1 * problem.operand2!);
        }
      });
    });
  });

  describe('hissan-add-double (2桁のたし算)', () => {
    const settings: WorksheetSettings = {
      grade: 2,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 10,
      layoutColumns: 2,
      calculationPattern: 'hissan-add-double',
    };

    it('should generate 2-digit addition problems', () => {
      const problems = generateProblems(settings);

      expect(problems).toHaveLength(10);

      problems.forEach((problem) => {
        expect(problem.type).toBe('hissan');
        expect(problem.operation).toBe('addition');

        if (problem.type === 'hissan') {
          // 両方とも 2桁（10-99）
          expect(problem.operand1).toBeGreaterThanOrEqual(10);
          expect(problem.operand1).toBeLessThanOrEqual(99);
          expect(problem.operand2!).toBeGreaterThanOrEqual(10);
          expect(problem.operand2!).toBeLessThanOrEqual(99);

          // 答えの検証
          expect(problem.answer).toBe(problem.operand1 + problem.operand2!);
        }
      });
    });
  });

  describe('hissan-sub-double (2桁のひき算)', () => {
    const settings: WorksheetSettings = {
      grade: 2,
      problemType: 'basic',
      operation: 'subtraction',
      problemCount: 10,
      layoutColumns: 2,
      calculationPattern: 'hissan-sub-double',
    };

    it('should generate 2-digit subtraction problems', () => {
      const problems = generateProblems(settings);

      expect(problems).toHaveLength(10);

      problems.forEach((problem) => {
        expect(problem.type).toBe('hissan');
        expect(problem.operation).toBe('subtraction');

        if (problem.type === 'hissan') {
          // 両方とも 2桁（10-99）
          expect(problem.operand1).toBeGreaterThanOrEqual(10);
          expect(problem.operand1).toBeLessThanOrEqual(99);
          expect(problem.operand2!).toBeGreaterThanOrEqual(10);
          expect(problem.operand2!).toBeLessThanOrEqual(99);

          // operand1 >= operand2
          expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2!);

          // 答えの検証
          expect(problem.answer).toBe(problem.operand1 - problem.operand2!);
        }
      });
    });
  });

  describe('Missing Number Problems (虫食い算)', () => {
    describe('add-single-missing (1年生たし算虫食い算)', () => {
      const settings: WorksheetSettings = {
        grade: 1,
        problemType: 'basic',
        operation: 'addition',
        problemCount: 20,
        layoutColumns: 2,
        calculationPattern: 'add-single-missing',
      };

      it('should only have operand1 or operand2 missing, never answer', () => {
        const problems = generateProblems(settings);

        expect(problems).toHaveLength(20);

        problems.forEach((problem) => {
          expect(problem.type).toBe('basic');
          if (problem.type === 'basic') {
            // missingPosition は 'operand1' または 'operand2' のみ
            expect(['operand1', 'operand2']).toContain(problem.missingPosition);

            // 答えは常に値がある
            expect(problem.answer).not.toBeNull();
            expect(typeof problem.answer).toBe('number');

            // operand1 または operand2 のどちらか一方だけが null
            const nullCount = [problem.operand1, problem.operand2].filter(v => v === null).length;
            expect(nullCount).toBe(1);
          }
        });
      });

      it('should generate valid solvable problems', () => {
        const problems = generateProblems(settings);

        problems.forEach((problem) => {
          if (problem.type === 'basic' && problem.answer !== null) {
            // 問題が解答可能であることを確認
            if (problem.operand1 === null && problem.operand2 !== null) {
              expect(problem.answer - problem.operand2).toBeGreaterThanOrEqual(1);
            } else if (problem.operand2 === null && problem.operand1 !== null) {
              expect(problem.answer - problem.operand1).toBeGreaterThanOrEqual(1);
            }
          }
        });
      });
    });

    describe('sub-single-missing (1年生ひき算虫食い算)', () => {
      const settings: WorksheetSettings = {
        grade: 1,
        problemType: 'basic',
        operation: 'subtraction',
        problemCount: 20,
        layoutColumns: 2,
        calculationPattern: 'sub-single-missing',
      };

      it('should only have operand1 or operand2 missing, never answer', () => {
        const problems = generateProblems(settings);

        expect(problems).toHaveLength(20);

        problems.forEach((problem) => {
          expect(problem.type).toBe('basic');
          if (problem.type === 'basic') {
            expect(['operand1', 'operand2']).toContain(problem.missingPosition);
            expect(problem.answer).not.toBeNull();
          }
        });
      });
    });

    describe('add-double-missing (2年生2桁たし算虫食い算)', () => {
      const settings: WorksheetSettings = {
        grade: 2,
        problemType: 'basic',
        operation: 'addition',
        problemCount: 20,
        layoutColumns: 2,
        calculationPattern: 'add-double-missing',
      };

      it('should only have operand1 or operand2 missing, never answer', () => {
        const problems = generateProblems(settings);

        expect(problems).toHaveLength(20);

        problems.forEach((problem) => {
          expect(problem.type).toBe('basic');
          if (problem.type === 'basic') {
            expect(['operand1', 'operand2']).toContain(problem.missingPosition);
            expect(problem.answer).not.toBeNull();

            // 2桁の範囲確認
            expect(problem.answer).toBeGreaterThanOrEqual(20);
            expect(problem.answer).toBeLessThanOrEqual(99);
          }
        });
      });
    });

    describe('sub-double-missing (2年生2桁ひき算虫食い算)', () => {
      const settings: WorksheetSettings = {
        grade: 2,
        problemType: 'basic',
        operation: 'subtraction',
        problemCount: 20,
        layoutColumns: 2,
        calculationPattern: 'sub-double-missing',
      };

      it('should only have operand1 or operand2 missing, never answer', () => {
        const problems = generateProblems(settings);

        expect(problems).toHaveLength(20);

        problems.forEach((problem) => {
          expect(problem.type).toBe('basic');
          if (problem.type === 'basic') {
            expect(['operand1', 'operand2']).toContain(problem.missingPosition);
            expect(problem.answer).not.toBeNull();
          }
        });
      });
    });

    describe('mult-single-missing (2年生九九虫食い算)', () => {
      const settings: WorksheetSettings = {
        grade: 2,
        problemType: 'basic',
        operation: 'multiplication',
        problemCount: 20,
        layoutColumns: 2,
        calculationPattern: 'mult-single-missing',
      };

      it('should only have operand1 or operand2 missing, never answer', () => {
        const problems = generateProblems(settings);

        expect(problems).toHaveLength(20);

        problems.forEach((problem) => {
          expect(problem.type).toBe('basic');
          if (problem.type === 'basic') {
            expect(['operand1', 'operand2']).toContain(problem.missingPosition);
            expect(problem.answer).not.toBeNull();

            // 九九の範囲確認
            if (problem.operand1 !== null) {
              expect(problem.operand1).toBeGreaterThanOrEqual(2);
              expect(problem.operand1).toBeLessThanOrEqual(9);
            }
            if (problem.operand2 !== null) {
              expect(problem.operand2).toBeGreaterThanOrEqual(2);
              expect(problem.operand2).toBeLessThanOrEqual(9);
            }
          }
        });
      });
    });
  });
});
