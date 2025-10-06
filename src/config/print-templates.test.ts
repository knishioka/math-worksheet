import { describe, it, expect } from 'vitest';
import {
  getPrintTemplate,
  detectPrimaryProblemType,
  fitsInA4,
  PRINT_TEMPLATES,
} from './print-templates';
import type { WordProblemEn, Problem, ProblemType } from '../types';

describe('Print Templates', () => {
  describe('PRINT_TEMPLATES configuration', () => {
    it('should have word-en template defined', () => {
      expect(PRINT_TEMPLATES['word-en']).toBeDefined();
    });

    it('should have correct word-en template settings', () => {
      const template = PRINT_TEMPLATES['word-en'];

      expect(template.type).toBe('word-en');
      expect(template.displayName).toBe('English Word Problems');
      expect(template.layout.rowGap).toBe('8px');
      expect(template.layout.colGap).toBe('20px');
      expect(template.layout.fontSize).toBe('16px');
    });

    it('should have word-en recommended counts for all layouts', () => {
      const template = PRINT_TEMPLATES['word-en'];

      expect(template.recommendedCounts[1]).toBe(8);
      expect(template.recommendedCounts[2]).toBe(16);
      expect(template.recommendedCounts[3]).toBe(24);
    });

    it('should have word-en max counts for all layouts', () => {
      const template = PRINT_TEMPLATES['word-en'];

      expect(template.maxCounts[1]).toBe(10);
      expect(template.maxCounts[2]).toBe(20);
      expect(template.maxCounts[3]).toBe(24);
    });

    it('should have word-en A4 thresholds for all layouts', () => {
      const template = PRINT_TEMPLATES['word-en'];

      expect(template.fitsInA4.threshold[1]).toBe(8);
      expect(template.fitsInA4.threshold[2]).toBe(16);
      expect(template.fitsInA4.threshold[3]).toBe(24);
    });
  });

  describe('getPrintTemplate', () => {
    it('should return word-en template', () => {
      const template = getPrintTemplate('word-en');

      expect(template.type).toBe('word-en');
      expect(template.displayName).toBe('English Word Problems');
    });

    it('should return different templates for different types', () => {
      const wordEnTemplate = getPrintTemplate('word-en');
      const wordTemplate = getPrintTemplate('word');
      const basicTemplate = getPrintTemplate('basic');

      expect(wordEnTemplate.type).toBe('word-en');
      expect(wordTemplate.type).toBe('word');
      expect(basicTemplate.type).toBe('basic');

      // word-en has tighter row spacing than word for better fit
      expect(parseInt(wordEnTemplate.layout.rowGap)).toBeLessThan(
        parseInt(wordTemplate.layout.rowGap)
      );
      expect(wordEnTemplate.layout.colGap).toBe(wordTemplate.layout.colGap);
    });

    it('should return template for all problem types', () => {
      const types: ProblemType[] = [
        'basic',
        'fraction',
        'decimal',
        'mixed',
        'hissan',
        'missing',
        'word',
        'word-en',
      ];

      types.forEach((type) => {
        const template = getPrintTemplate(type);
        expect(template.type).toBe(type);
        expect(template.displayName).toBeTruthy();
      });
    });
  });

  describe('detectPrimaryProblemType', () => {
    it('should detect word-en problems', () => {
      const problems: Problem[] = [
        {
          id: '1',
          type: 'word-en',
          operation: 'addition',
          problemText: 'Sam has 5 apples. He gets 3 more. How many does he have?',
          answer: 8,
          category: 'word-story',
          language: 'en',
        } as WordProblemEn,
        {
          id: '2',
          type: 'word-en',
          operation: 'subtraction',
          problemText: 'There are 10 birds. 3 fly away. How many are left?',
          answer: 7,
          category: 'word-story',
          language: 'en',
        } as WordProblemEn,
      ];

      const detectedType = detectPrimaryProblemType(problems);
      expect(detectedType).toBe('word-en');
    });

    it('should detect word-en even with mixed problems', () => {
      const problems: Problem[] = [
        {
          id: '1',
          type: 'word-en',
          operation: 'addition',
          problemText: 'Test problem',
          answer: 5,
          category: 'word-story',
          language: 'en',
        } as WordProblemEn,
        {
          id: '2',
          type: 'basic',
          operation: 'addition',
          operand1: 5,
          operand2: 3,
          answer: 8,
        },
      ];

      const detectedType = detectPrimaryProblemType(problems);
      expect(detectedType).toBe('word-en');
    });

    it('should not confuse word-en with word', () => {
      const wordEnProblems: Problem[] = [
        {
          id: '1',
          type: 'word-en',
          operation: 'addition',
          problemText: 'English problem',
          answer: 5,
          category: 'word-story',
          language: 'en',
        } as WordProblemEn,
      ];

      const wordProblems: Problem[] = [
        {
          id: '1',
          type: 'word',
          operation: 'addition',
          problemText: '日本語の問題',
          answer: 5,
        },
      ];

      expect(detectPrimaryProblemType(wordEnProblems)).toBe('word-en');
      expect(detectPrimaryProblemType(wordProblems)).toBe('word');
    });
  });

  describe('fitsInA4', () => {
    it('should return true for word-en within threshold', () => {
      expect(fitsInA4('word-en', 1, 8)).toBe(true);
      expect(fitsInA4('word-en', 2, 16)).toBe(true);
      expect(fitsInA4('word-en', 3, 24)).toBe(true);
    });

    it('should return false for word-en above threshold', () => {
      expect(fitsInA4('word-en', 1, 9)).toBe(false);
      expect(fitsInA4('word-en', 2, 17)).toBe(false);
      expect(fitsInA4('word-en', 3, 25)).toBe(false);
    });

    it('should handle edge cases at threshold boundary', () => {
      expect(fitsInA4('word-en', 1, 7)).toBe(true); // Below threshold
      expect(fitsInA4('word-en', 1, 8)).toBe(true); // At threshold
      expect(fitsInA4('word-en', 1, 9)).toBe(false); // Above threshold
    });

    it('should work for all layout columns', () => {
      // 1 column
      expect(fitsInA4('word-en', 1, 8)).toBe(true);
      expect(fitsInA4('word-en', 1, 10)).toBe(false);

      // 2 columns
      expect(fitsInA4('word-en', 2, 16)).toBe(true);
      expect(fitsInA4('word-en', 2, 20)).toBe(false);

      // 3 columns
      expect(fitsInA4('word-en', 3, 24)).toBe(true);
      expect(fitsInA4('word-en', 3, 30)).toBe(false);
    });
  });

  describe('Template layout optimization', () => {
    it('should have compact spacing for word-en', () => {
      const wordEnTemplate = getPrintTemplate('word-en');
      const basicTemplate = getPrintTemplate('basic');

      // word-en should have smaller row gap than basic due to compact layout
      expect(parseInt(wordEnTemplate.layout.rowGap)).toBeLessThan(
        parseInt(basicTemplate.layout.rowGap)
      );

      // word-en should have smaller column gap than basic
      expect(parseInt(wordEnTemplate.layout.colGap)).toBeLessThan(
        parseInt(basicTemplate.layout.colGap)
      );
    });

    it('should have appropriate problem height for word-en', () => {
      const template = getPrintTemplate('word-en');

      // word-en needs more vertical space for multi-line text
      expect(parseInt(template.layout.minProblemHeight)).toBeGreaterThan(50);
    });
  });

  describe('Recommended count validation', () => {
    it('should have recommended count less than or equal to max count', () => {
      const template = getPrintTemplate('word-en');

      expect(template.recommendedCounts[1]).toBeLessThanOrEqual(
        template.maxCounts[1]
      );
      expect(template.recommendedCounts[2]).toBeLessThanOrEqual(
        template.maxCounts[2]
      );
      expect(template.recommendedCounts[3]).toBeLessThanOrEqual(
        template.maxCounts[3]
      );
    });

    it('should have recommended count equal to A4 threshold', () => {
      const template = getPrintTemplate('word-en');

      expect(template.recommendedCounts[1]).toBe(
        template.fitsInA4.threshold[1]
      );
      expect(template.recommendedCounts[2]).toBe(
        template.fitsInA4.threshold[2]
      );
      expect(template.recommendedCounts[3]).toBe(
        template.fitsInA4.threshold[3]
      );
    });

    it('should scale recommended counts appropriately across layouts', () => {
      const template = getPrintTemplate('word-en');

      // 2 columns should have roughly 2x the count of 1 column
      expect(template.recommendedCounts[2]).toBeGreaterThanOrEqual(
        template.recommendedCounts[1] * 1.5
      );

      // 3 columns should have roughly 3x the count of 1 column
      expect(template.recommendedCounts[3]).toBeGreaterThanOrEqual(
        template.recommendedCounts[1] * 2.5
      );
    });
  });
});
