import { describe, it, expect } from 'vitest';

import { generateGradeAllowanceProblems } from './allowance-problems';
import { generateGradeAllowanceProblemsEn } from './allowance-problems-en';
import {
  detectPrimaryProblemType,
  fitsInA4,
  getPrintTemplate,
} from '../../config/print-templates';

describe('allowance problem layout regression', () => {
  describe('Japanese allowance problems', () => {
    it('keeps grade 2 allowance goal problems within the word template limits', () => {
      const template = getPrintTemplate('word');
      const count = template.recommendedCounts[2];

      const problems = generateGradeAllowanceProblems(
        2,
        count,
        'allowance-goal-jap',
      );

      expect(problems).toHaveLength(count);
      expect(problems.every((problem) => problem.type === 'word')).toBe(true);

      const detectedType = detectPrimaryProblemType(problems);
      expect(detectedType).toBe('word');
      expect(fitsInA4(detectedType, 2, problems.length)).toBe(true);
      expect(fitsInA4(detectedType, 2, count + 1)).toBe(false);
    });

    it('keeps grade 2 allowance saving problems within the word template limits', () => {
      const template = getPrintTemplate('word');
      const count = template.recommendedCounts[2];

      const problems = generateGradeAllowanceProblems(
        2,
        count,
        'allowance-saving-jap',
      );

      expect(problems).toHaveLength(count);
      expect(problems.every((problem) => problem.type === 'word')).toBe(true);

      const detectedType = detectPrimaryProblemType(problems);
      expect(detectedType).toBe('word');
      expect(fitsInA4(detectedType, 2, problems.length)).toBe(true);
      expect(fitsInA4(detectedType, 2, count + 1)).toBe(false);
    });
  });

  describe('English allowance problems', () => {
    it('keeps allowance goal problems within the word-en template limits', () => {
      const template = getPrintTemplate('word-en');
      const count = template.recommendedCounts[2];

      const problems = generateGradeAllowanceProblemsEn(
        2,
        count,
        'allowance-goal-en',
      );

      expect(problems).toHaveLength(count);
      expect(problems.every((problem) => problem.type === 'word-en')).toBe(true);

      const detectedType = detectPrimaryProblemType(problems);
      expect(detectedType).toBe('word-en');
      expect(fitsInA4(detectedType, 2, problems.length)).toBe(true);
      expect(fitsInA4(detectedType, 2, count + 1)).toBe(false);
    });

    it('keeps allowance saving problems within the word-en template limits', () => {
      const template = getPrintTemplate('word-en');
      const count = template.recommendedCounts[2];

      const problems = generateGradeAllowanceProblemsEn(
        2,
        count,
        'allowance-saving-en',
      );

      expect(problems).toHaveLength(count);
      expect(problems.every((problem) => problem.type === 'word-en')).toBe(true);

      const detectedType = detectPrimaryProblemType(problems);
      expect(detectedType).toBe('word-en');
      expect(fitsInA4(detectedType, 2, problems.length)).toBe(true);
      expect(fitsInA4(detectedType, 2, count + 1)).toBe(false);
    });
  });
});
