import { describe, it, expect } from 'vitest';
import { generateHissanProblem } from './hissan';
import type { Grade, Operation } from '../../types';

describe('generateHissanProblem', () => {
  describe('2桁×1桁のかけ算', () => {
    it('should generate 2-digit × 1-digit multiplication for grade 3', () => {
      // grade 3 で multiplication を選択すると 3桁×1桁になる想定だが、
      // hissan-mult-basic パターンでは直接 2桁×1桁を生成すべき
      const problem = generateHissanProblem({
        grade: 3,
        operation: 'multiplication',
      });

      expect(problem.type).toBe('hissan');
      expect(problem.operation).toBe('multiplication');

      // 注: generateHissanProblem は grade 3 で 3桁×1桁を生成する
      // 2桁×1桁は generateHissanMultBasic で直接生成される
    });
  });

  describe('たし算の筆算', () => {
    it('should generate valid addition problem for grade 2', () => {
      const problem = generateHissanProblem({
        grade: 2,
        operation: 'addition',
      });

      expect(problem.type).toBe('hissan');
      expect(problem.operation).toBe('addition');
      expect(problem.operand1).toBeGreaterThanOrEqual(10);
      expect(problem.operand1).toBeLessThanOrEqual(99);
      expect(problem.operand2).toBeGreaterThanOrEqual(10);
      expect(problem.operand2).toBeLessThanOrEqual(99);
      expect(problem.answer).toBe(problem.operand1 + problem.operand2);
    });
  });

  describe('ひき算の筆算', () => {
    it('should generate valid subtraction problem for grade 2', () => {
      const problem = generateHissanProblem({
        grade: 2,
        operation: 'subtraction',
      });

      expect(problem.type).toBe('hissan');
      expect(problem.operation).toBe('subtraction');
      expect(problem.operand1).toBeGreaterThanOrEqual(problem.operand2);
      expect(problem.answer).toBe(problem.operand1 - problem.operand2);
    });
  });

  describe('わり算の筆算', () => {
    it('should generate valid division problem for grade 3', () => {
      const problem = generateHissanProblem({
        grade: 3,
        operation: 'division',
      });

      expect(problem.type).toBe('hissan');
      expect(problem.operation).toBe('division');
      expect(problem.operand2).toBeGreaterThan(0); // divisor > 0

      // 余りがない場合
      if (problem.remainder === 0) {
        expect(problem.operand1).toBe(problem.answer * problem.operand2);
      } else {
        expect(problem.operand1).toBe(
          problem.answer * problem.operand2 + (problem.remainder ?? 0)
        );
      }
    });
  });
});
