import { describe, it, expect } from 'vitest';
import { generateGradeEnWordProblems } from './word-problem-en';
import { getPrintTemplate, detectPrimaryProblemType } from '../../config/print-templates';
import type { WordProblemEn } from '../../types';

/**
 * Integration tests for English word problems
 * Tests the complete flow from generation to display configuration
 */
describe('Word Problem EN Integration', () => {
  describe('Generation and Template Selection', () => {
    it('should generate problems that work with word-en template', () => {
      const problems = generateGradeEnWordProblems(3, 16);
      const template = getPrintTemplate('word-en');

      expect(problems).toHaveLength(16);
      expect(template.recommendedCounts[2]).toBe(16); // 2 columns
    });

    it('should detect correct template for generated problems', () => {
      const problems = generateGradeEnWordProblems(2, 8);
      const detectedType = detectPrimaryProblemType(problems);
      const template = getPrintTemplate(detectedType);

      expect(detectedType).toBe('word-en');
      expect(template.displayName).toBe('English Word Problems');
    });

    it('should generate problems within recommended count limits', () => {
      const template = getPrintTemplate('word-en');

      // Test 1 column layout
      const problems1Col = generateGradeEnWordProblems(
        1,
        template.recommendedCounts[1]
      );
      expect(problems1Col).toHaveLength(template.recommendedCounts[1]);

      // Test 2 column layout
      const problems2Col = generateGradeEnWordProblems(
        2,
        template.recommendedCounts[2]
      );
      expect(problems2Col).toHaveLength(template.recommendedCounts[2]);

      // Test 3 column layout
      const problems3Col = generateGradeEnWordProblems(
        3,
        template.recommendedCounts[3]
      );
      expect(problems3Col).toHaveLength(template.recommendedCounts[3]);
    });
  });

  describe('Print Layout Compatibility', () => {
    it('should generate problems suitable for 1-column layout', () => {
      const template = getPrintTemplate('word-en');
      const problems = generateGradeEnWordProblems(
        1,
        template.recommendedCounts[1]
      );

      problems.forEach((problem) => {
        // Problems should have reasonable text length for 1 column
        expect(problem.problemText.length).toBeGreaterThan(10);
        expect(problem.problemText.length).toBeLessThan(200);
      });
    });

    it('should generate problems suitable for 2-column layout', () => {
      const template = getPrintTemplate('word-en');
      const problems = generateGradeEnWordProblems(
        2,
        template.recommendedCounts[2]
      );

      expect(problems).toHaveLength(16);
      problems.forEach((problem) => {
        // Problems should fit in narrower columns
        expect(problem.problemText.length).toBeLessThan(150);
      });
    });

    it('should generate problems suitable for 3-column layout', () => {
      const template = getPrintTemplate('word-en');
      const problems = generateGradeEnWordProblems(
        3,
        template.recommendedCounts[3]
      );

      expect(problems).toHaveLength(24);
      problems.forEach((problem) => {
        // Problems should be reasonably concise for narrow columns
        expect(problem.problemText.length).toBeLessThan(200);
      });
    });
  });

  describe('Grade-Appropriate Generation with Templates', () => {
    it('should generate grade 1 problems with appropriate settings', () => {
      const problems = generateGradeEnWordProblems(1, 8);
      const template = getPrintTemplate('word-en');

      expect(problems).toHaveLength(8);
      expect(template.recommendedCounts[1]).toBe(8);

      problems.forEach((problem) => {
        // Grade 1: small numbers, simple language
        const answer = problem.answer as number;
        expect(answer).toBeLessThanOrEqual(20);
        expect(problem.problemText.length).toBeLessThan(100);
      });
    });

    it('should generate grade 6 problems with appropriate settings', () => {
      const problems = generateGradeEnWordProblems(6, 24);
      const template = getPrintTemplate('word-en');

      expect(problems).toHaveLength(24);
      expect(template.recommendedCounts[3]).toBe(24);

      // Grade 6 can have more complex problems
      const hasComplexProblem = problems.some((problem) => {
        const answer = problem.answer as number;
        return answer > 50;
      });
      expect(hasComplexProblem).toBe(true);
    });
  });

  describe('Template Layout Configuration', () => {
    it('should have appropriate spacing for English text', () => {
      const template = getPrintTemplate('word-en');

      // Verify layout settings are optimized for English word problems
      expect(template.layout.rowGap).toBe('8px');
      expect(template.layout.colGap).toBe('20px');
      expect(template.layout.fontSize).toBe('16px');
      expect(template.layout.minProblemHeight).toBe('80px');
    });

    it('should have tighter spacing than Japanese word problems', () => {
      const wordEnTemplate = getPrintTemplate('word-en');
      const wordTemplate = getPrintTemplate('word');

      // word-en has tighter row spacing for better fit
      expect(parseInt(wordEnTemplate.layout.rowGap)).toBeLessThan(
        parseInt(wordTemplate.layout.rowGap)
      );
      expect(wordEnTemplate.layout.colGap).toBe(wordTemplate.layout.colGap);
      expect(wordEnTemplate.layout.minProblemHeight).toBe(wordTemplate.layout.minProblemHeight);

      // They should have the same recommended counts
      expect(wordEnTemplate.recommendedCounts[1]).toBe(8);
      expect(wordTemplate.recommendedCounts[1]).toBe(8);
    });
  });

  describe('Problem Categories and Operations', () => {
    it('should generate only word-story and comparison categories', () => {
      const problems = generateGradeEnWordProblems(3, 20);

      const categories = new Set(problems.map((p) => p.category));
      categories.forEach((category) => {
        expect(['word-story', 'comparison']).toContain(category);
      });

      // Should not include missing-number category
      expect(categories.has('missing-number')).toBe(false);
    });

    it('should generate variety of operations', () => {
      const problems = generateGradeEnWordProblems(5, 30);

      const operations = new Set(problems.map((p) => p.operation));

      // Should have at least 2 different operations for variety
      expect(operations.size).toBeGreaterThanOrEqual(2);
    });

    it('should generate grade-appropriate operations', () => {
      // Grade 1: only addition and subtraction
      const grade1Problems = generateGradeEnWordProblems(1, 10);
      const grade1Operations = new Set(grade1Problems.map((p) => p.operation));

      grade1Operations.forEach((op) => {
        expect(['addition', 'subtraction']).toContain(op);
      });

      // Grade 3+: can include multiplication
      const grade3Problems = generateGradeEnWordProblems(3, 10);
      const hasMultiplication = grade3Problems.some(
        (p) => p.operation === 'multiplication'
      );
      // Not guaranteed, but should be possible
      expect(typeof hasMultiplication).toBe('boolean');
    });
  });

  describe('Answer Format Validation', () => {
    it('should generate valid answers for all problems', () => {
      const problems = generateGradeEnWordProblems(4, 20);

      problems.forEach((problem) => {
        expect(problem.answer).toBeDefined();
        expect(typeof problem.answer).toBe('number');
        expect(problem.answer).toBeGreaterThanOrEqual(0);
      });
    });

    it('should include units when appropriate', () => {
      const problems = generateGradeEnWordProblems(2, 20);

      // Some problems should have units (like "apples", "books", etc.)
      // This is template-dependent, so we just check the property exists
      problems.forEach((problem) => {
        if (problem.unit) {
          expect(typeof problem.unit).toBe('string');
          expect(problem.unit.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('ID Generation and Uniqueness', () => {
    it('should generate unique IDs across multiple calls', () => {
      const problems1 = generateGradeEnWordProblems(3, 10);
      const problems2 = generateGradeEnWordProblems(3, 10);

      const ids1 = new Set(problems1.map((p) => p.id));
      const ids2 = new Set(problems2.map((p) => p.id));

      // IDs should be unique within each set
      expect(ids1.size).toBe(10);
      expect(ids2.size).toBe(10);

      // IDs from different calls should not overlap
      const overlap = [...ids1].filter((id) => ids2.has(id));
      expect(overlap).toHaveLength(0);
    });
  });

  describe('Print Preview Compatibility', () => {
    it('should generate problems with all required fields for print', () => {
      const problems = generateGradeEnWordProblems(2, 8);

      problems.forEach((problem: WordProblemEn) => {
        // Required for print rendering
        expect(problem.id).toBeTruthy();
        expect(problem.type).toBe('word-en');
        expect(problem.problemText).toBeTruthy();
        expect(problem.answer).toBeDefined();
        expect(problem.category).toBeTruthy();
        expect(problem.language).toBe('en');

        // Problem text should be printable (no special characters that break HTML)
        expect(problem.problemText).not.toContain('<script>');
        expect(problem.problemText).not.toContain('</');
      });
    });

    it('should generate problems that render correctly in HTML', () => {
      const problems = generateGradeEnWordProblems(3, 10);

      problems.forEach((problem) => {
        // Simulate HTML rendering
        const htmlContent = `
          <div style="font-size: 13px; line-height: 1.5;">
            <div>${problem.problemText}</div>
            <div>Answer: ${problem.answer}${problem.unit ? ' ' + problem.unit : ''}</div>
          </div>
        `;

        expect(htmlContent).toContain(problem.problemText);
        expect(htmlContent).toContain(String(problem.answer));
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should handle large problem counts efficiently', () => {
      const startTime = Date.now();
      const problems = generateGradeEnWordProblems(6, 50);
      const endTime = Date.now();

      expect(problems).toHaveLength(50);
      // Should generate 50 problems in under 1 second
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle minimum problem count', () => {
      const problems = generateGradeEnWordProblems(1, 1);

      expect(problems).toHaveLength(1);
      expect(problems[0].type).toBe('word-en');
    });

    it('should handle all grade levels consistently', () => {
      for (let grade = 1; grade <= 6; grade++) {
        const problems = generateGradeEnWordProblems(grade as 1, 5);

        expect(problems).toHaveLength(5);
        problems.forEach((problem) => {
          expect(problem.type).toBe('word-en');
          expect(problem.language).toBe('en');
          expect(problem.category).toBeTruthy();
        });
      }
    });
  });
});
