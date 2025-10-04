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

        // operand1 は 2桁（10-99）
        expect(problem.operand1).toBeGreaterThanOrEqual(10);
        expect(problem.operand1).toBeLessThanOrEqual(99);

        // operand2 は 1桁（1-9）
        expect(problem.operand2).toBeGreaterThanOrEqual(1);
        expect(problem.operand2).toBeLessThanOrEqual(9);

        // 答えの検証
        expect(problem.answer).toBe(problem.operand1 * problem.operand2);
      });
    });

    it('should generate different problems', () => {
      const problems = generateProblems({ ...settings, problemCount: 20 });

      // すべて異なる問題かチェック（完全に同じ問題がないことを確認）
      const uniqueProblems = new Set(
        problems.map((p) => `${p.operand1}×${p.operand2}`)
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

        // operand1 は 3桁（100-999）
        expect(problem.operand1).toBeGreaterThanOrEqual(100);
        expect(problem.operand1).toBeLessThanOrEqual(999);

        // operand2 は 2桁（10-99）
        expect(problem.operand2).toBeGreaterThanOrEqual(10);
        expect(problem.operand2).toBeLessThanOrEqual(99);

        // 答えの検証
        expect(problem.answer).toBe(problem.operand1 * problem.operand2);
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

        // 両方とも 2桁（10-99）
        expect(problem.operand1).toBeGreaterThanOrEqual(10);
        expect(problem.operand1).toBeLessThanOrEqual(99);
        expect(problem.operand2).toBeGreaterThanOrEqual(10);
        expect(problem.operand2).toBeLessThanOrEqual(99);

        // 答えの検証
        expect(problem.answer).toBe(problem.operand1 + problem.operand2);
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

        // 両方とも 2桁（10-99）
        expect(problem.operand1).toBeGreaterThanOrEqual(10);
        expect(problem.operand1).toBeLessThanOrEqual(99);
        expect(problem.operand2).toBeGreaterThanOrEqual(10);
        expect(problem.operand2).toBeLessThanOrEqual(99);

        // operand1 >= operand2
        expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);

        // 答えの検証
        expect(problem.answer).toBe(problem.operand1 - problem.operand2);
      });
    });
  });
});
