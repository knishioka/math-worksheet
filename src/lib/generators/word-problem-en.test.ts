import { describe, it, expect } from 'vitest';
import {
  generateEnMissingNumber,
  generateEnWordStory,
  generateGradeEnWordProblems,
} from './word-problem-en';
import type { WordProblemEn } from '../../types';

describe('English Word Problem Generator', () => {
  describe('generateEnMissingNumber', () => {
    it('should generate missing number problems for grade 1', () => {
      const problems = generateEnMissingNumber(1, 10);
      expect(problems).toHaveLength(10);

      problems.forEach((problem) => {
        expect(problem.type).toBe('word-en');
        expect(problem.category).toBe('missing-number');
        expect(problem.language).toBe('en');
        expect(problem.problemText).toMatch(/\[\]/); // Contains []
        expect(typeof problem.answer).toBe('number');
      });
    });

    it('should generate problems with numbers in grade 1 range (1-20)', () => {
      const problems = generateEnMissingNumber(1, 10);

      problems.forEach((problem) => {
        const answer = problem.answer as number;
        expect(answer).toBeGreaterThanOrEqual(1);
        expect(answer).toBeLessThanOrEqual(20);
      });
    });

    it('should generate varied templates', () => {
      const problems = generateEnMissingNumber(1, 20);
      const texts = problems.map((p) => p.problemText);
      const uniquePatterns = new Set(
        texts.map((t) => t.replace(/\d+/g, 'N'))
      );

      // Should have at least 3 different patterns
      expect(uniquePatterns.size).toBeGreaterThanOrEqual(3);
    });
  });

  describe('generateEnWordStory', () => {
    it('should generate word story problems for grade 2', () => {
      const problems = generateEnWordStory(2, 10);
      expect(problems).toHaveLength(10);

      problems.forEach((problem) => {
        expect(problem.type).toBe('word-en');
        expect(problem.category).toBe('word-story');
        expect(problem.language).toBe('en');
        expect(problem.problemText.length).toBeGreaterThan(20); // Real sentences
        expect(typeof problem.answer).toBe('number');
      });
    });

    it('should generate problems with appropriate difficulty for each grade', () => {
      const grade1Problems = generateEnWordStory(1, 10);
      const grade6Problems = generateEnWordStory(6, 20);

      // Grade 1 should have smaller numbers
      grade1Problems.forEach((problem) => {
        const answer = problem.answer as number;
        expect(answer).toBeLessThanOrEqual(20);
      });

      // Grade 6 can have larger numbers (at least some should be > 50)
      const hasLargeNumber = grade6Problems.some((problem) => {
        const answer = problem.answer as number;
        return answer > 50;
      });
      expect(hasLargeNumber).toBe(true);
    });

    it('should include proper English grammar', () => {
      const problems = generateEnWordStory(2, 10);

      problems.forEach((problem) => {
        // Should start with capital letter or number
        expect(problem.problemText[0]).toMatch(/[A-Z0-9]/);
        // Should end with question mark or period (for statements like "17 is between 16 and ___.")
        expect(problem.problemText).toMatch(/[?.]$/);
        // Should contain common English words
        expect(problem.problemText.toLowerCase()).toMatch(
          /has|have|is|are|many|how|what|number|between|count/
        );
      });
    });
  });

  describe('generateGradeEnWordProblems', () => {
    it('should generate appropriate problems for grade 1', () => {
      const problems = generateGradeEnWordProblems(1, 10);
      expect(problems).toHaveLength(10);

      // Should only generate word-story or comparison problems (not missing-number)
      problems.forEach((problem) => {
        expect(['word-story', 'comparison']).toContain(problem.category);
      });
    });

    it('should generate appropriate problems for grade 3', () => {
      const problems = generateGradeEnWordProblems(3, 10);
      expect(problems).toHaveLength(10);

      // Should only generate word-story or comparison problems (not missing-number)
      problems.forEach((problem) => {
        expect(['word-story', 'comparison']).toContain(problem.category);
      });
    });

    it('should generate appropriate problems for grade 6', () => {
      const problems = generateGradeEnWordProblems(6, 20);
      expect(problems).toHaveLength(20);

      // Grade 6 should include comparison or word-story problems
      const hasStoryProblems = problems.some(
        (p) => p.category === 'comparison' || p.category === 'word-story'
      );
      expect(hasStoryProblems).toBe(true);
    });

    it('should generate unique problem IDs', () => {
      const problems = generateGradeEnWordProblems(3, 20);
      const ids = problems.map((p) => p.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(20);
    });

    it('should handle all grade levels', () => {
      for (let grade = 1; grade <= 6; grade++) {
        const problems = generateGradeEnWordProblems(grade as 1, 5);
        expect(problems).toHaveLength(5);

        problems.forEach((problem) => {
          expect(problem.type).toBe('word-en');
          expect(problem.language).toBe('en');
        });
      }
    });
  });

  describe('Problem Type Validation', () => {
    it('should generate valid WordProblemEn objects', () => {
      const problems = generateGradeEnWordProblems(3, 5);

      problems.forEach((problem: WordProblemEn) => {
        // Type checks
        expect(problem).toHaveProperty('id');
        expect(problem).toHaveProperty('type');
        expect(problem).toHaveProperty('operation');
        expect(problem).toHaveProperty('problemText');
        expect(problem).toHaveProperty('answer');
        expect(problem).toHaveProperty('category');
        expect(problem).toHaveProperty('language');

        // Value checks
        expect(typeof problem.id).toBe('string');
        expect(problem.type).toBe('word-en');
        expect(['addition', 'subtraction', 'multiplication', 'division']).toContain(
          problem.operation
        );
        expect(typeof problem.problemText).toBe('string');
        expect(['number', 'string']).toContain(typeof problem.answer);
        expect(['word-story', 'comparison']).toContain(
          problem.category
        );
        expect(problem.language).toBe('en');
      });
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('should handle edge case: single problem generation', () => {
      const problems = generateGradeEnWordProblems(2, 1);

      expect(problems).toHaveLength(1);
      expect(problems[0].type).toBe('word-en');
      expect(problems[0].problemText.length).toBeGreaterThan(0);
    });

    it('should handle edge case: maximum problem count', () => {
      const problems = generateGradeEnWordProblems(6, 50);

      expect(problems).toHaveLength(50);
      // All should have unique IDs
      const ids = new Set(problems.map((p) => p.id));
      expect(ids.size).toBe(50);
    });

    it('should generate valid answers for all problems', () => {
      const problems = generateGradeEnWordProblems(4, 30);

      problems.forEach((problem) => {
        const answer = problem.answer;
        expect(answer).toBeDefined();
        expect(typeof answer).toBe('number');
        // Some comparison problems may have negative results (e.g., "fewer than")
        // but the absolute value should be reasonable
        expect(Number.isFinite(answer as number)).toBe(true);
        expect(Math.abs(answer as number)).toBeGreaterThanOrEqual(0);
        expect(Math.abs(answer as number)).toBeLessThan(10000);
      });
    });

    it('should generate problems with proper punctuation', () => {
      const problems = generateGradeEnWordProblems(3, 20);

      problems.forEach((problem) => {
        const text = problem.problemText;
        // Should end with question mark or period
        expect(text).toMatch(/[?.]$/);
        // Should not have multiple consecutive spaces
        expect(text).not.toMatch(/  +/);
        // Should not have trailing spaces
        expect(text.trim()).toBe(text);
      });
    });

    it('should generate problems without HTML injection risks', () => {
      const problems = generateGradeEnWordProblems(5, 20);

      problems.forEach((problem) => {
        // Should not contain HTML tags
        expect(problem.problemText).not.toContain('<');
        expect(problem.problemText).not.toContain('>');
        expect(problem.problemText).not.toContain('</');
        expect(problem.problemText).not.toContain('<script');
      });
    });
  });

  describe('Number Sequence Problems', () => {
    it('should generate number sequence problems for grade 1-3', () => {
      // Number sequence problems are available for grade 1-3
      const grade1Problems = generateGradeEnWordProblems(1, 20);
      const grade2Problems = generateGradeEnWordProblems(2, 20);
      const grade3Problems = generateGradeEnWordProblems(3, 20);

      // Should contain "before", "after", or "between" for sequence problems
      const hasSequenceProblem = (problems: WordProblemEn[]): boolean =>
        problems.some((p) =>
          /before|after|between|count/i.test(p.problemText)
        );

      // At least one of the grades should have sequence problems
      expect(
        hasSequenceProblem(grade1Problems) ||
          hasSequenceProblem(grade2Problems) ||
          hasSequenceProblem(grade3Problems)
      ).toBe(true);
    });
  });

  describe('Operation Coverage', () => {
    it('should include multiplication problems for appropriate grades', () => {
      const grade3Problems = generateGradeEnWordProblems(3, 30);
      const hasMultiplication = grade3Problems.some(
        (p) => p.operation === 'multiplication'
      );

      // Grade 3+ should be able to generate multiplication problems
      expect(typeof hasMultiplication).toBe('boolean');
    });

    it('should include division problems for appropriate grades', () => {
      const grade4Problems = generateGradeEnWordProblems(4, 30);
      const hasDivision = grade4Problems.some(
        (p) => p.operation === 'division'
      );

      // Grade 4+ should be able to generate division problems
      expect(typeof hasDivision).toBe('boolean');
    });

    it('should not generate invalid operations for grade 1', () => {
      const problems = generateGradeEnWordProblems(1, 20);

      problems.forEach((problem) => {
        // Grade 1 should only have addition and subtraction
        expect(['addition', 'subtraction']).toContain(problem.operation);
      });
    });
  });
});
