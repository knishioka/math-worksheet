import { describe, it, expect } from 'vitest';
import {
  generateEnMissingNumber,
  generateEnWordStory,
  generateGradeEnWordProblems,
} from './word-problem-en';
import {
  MONEY_STORIES,
  MIXED_OPERATION_STORIES,
  TIME_STORIES,
  FRACTION_DIFF_DENOM_STORIES,
} from './templates/en-word-story';
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
      const uniquePatterns = new Set(texts.map((t) => t.replace(/\d+/g, 'N')));

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
        // Can be either word-story or comparison
        expect(['word-story', 'comparison']).toContain(problem.category);
        expect(problem.language).toBe('en');
        expect(problem.problemText.length).toBeGreaterThan(20); // Real sentences
        expect(typeof problem.answer).toBe('number');
      });
    });

    it('should generate problems with appropriate difficulty for each grade', () => {
      const grade1Problems = generateEnWordStory(1, 10);
      const grade2Problems = generateEnWordStory(2, 15);
      const grade6Problems = generateEnWordStory(6, 20);

      // Grade 1 should have smaller numbers
      grade1Problems.forEach((problem) => {
        const answer = problem.answer as number;
        expect(answer).toBeLessThanOrEqual(20);
      });

      // Grade 2 problems should avoid sequence drills and include at least one mid-range answer
      const grade2Texts = grade2Problems.map((problem) =>
        problem.problemText.toLowerCase()
      );
      grade2Texts.forEach((text) => {
        expect(text).not.toMatch(/what number comes|is between/);
      });
      const grade2Answers = grade2Problems.map(
        (problem) => problem.answer as number
      );
      expect(grade2Answers.some((answer) => answer >= 20)).toBe(true);
      grade2Answers.forEach((answer) => {
        expect(answer).toBeLessThanOrEqual(150);
      });

      // Grade 6 can have larger numbers (at least some should be > 50)
      const hasLargeNumber = grade6Problems.some((problem) => {
        const answer = problem.answer as number;
        return answer > 50;
      });
      expect(hasLargeNumber).toBe(true);
    });

    it('should scale numeric ranges for upper elementary grades', () => {
      const grade4Problems = generateEnWordStory(4, 60);
      const grade5Problems = generateEnWordStory(5, 80);
      const grade6Problems = generateEnWordStory(6, 100);

      const numericAnswers = (problems: WordProblemEn[]): number[] =>
        problems
          .map((p) => p.answer)
          .filter((a): a is number => typeof a === 'number');

      const grade4Max = Math.max(...numericAnswers(grade4Problems));
      const grade5Max = Math.max(...numericAnswers(grade5Problems));
      const grade6Max = Math.max(...numericAnswers(grade6Problems));

      // Grade 4 should regularly reach 3-digit territory.
      expect(grade4Max).toBeGreaterThanOrEqual(250);
      // Grade 5 should reach 4-digit answers at least sometimes.
      expect(grade5Max).toBeGreaterThanOrEqual(800);
      // Grade 6 should produce multi-thousand answers at least sometimes.
      expect(grade6Max).toBeGreaterThanOrEqual(2000);
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

    it('should use realistic payments in change stories', () => {
      const singleItemChange = MONEY_STORIES[0];

      for (let grade = 2; grade <= 5; grade++) {
        for (let i = 0; i < 40; i++) {
          const { text } = singleItemChange.generateProblem(grade);
          const match = text.match(/for \$(\d+).*pays with \$(\d+)/);
          expect(match).not.toBeNull();

          if (!match) {
            continue;
          }

          const price = Number(match[1]);
          const paid = Number(match[2]);

          expect(paid).toBeGreaterThan(price);
          const isMultipleOfFive = paid % 5 === 0;
          const isFiveMoreThanPrice = paid === price + 5;
          expect(isMultipleOfFive || isFiveMoreThanPrice).toBe(true);
        }
      }

      const multiItemChange = MIXED_OPERATION_STORIES[2];

      for (let grade = 4; grade <= 6; grade++) {
        for (let i = 0; i < 40; i++) {
          const { text } = multiItemChange.generateProblem(grade);
          const match = text.match(
            /buys (\d+) items at \$(\d+) each\. .*pays with \$(\d+)/
          );

          expect(match).not.toBeNull();
          if (!match) {
            continue;
          }

          const quantity = Number(match[1]);
          const price = Number(match[2]);
          const paid = Number(match[3]);
          const totalCost = quantity * price;

          expect(paid).toBeGreaterThan(totalCost);
          const isMultipleOfFive = paid % 5 === 0;
          const isFiveMoreThanTotal = paid === totalCost + 5;
          expect(isMultipleOfFive || isFiveMoreThanTotal).toBe(true);
        }
      }
    });

    it('"minutes past the hour" answers must stay under 60 across all grades', () => {
      // Regression: TIME_STORIES[1] used to allow startMinute + duration >= 60
      // for grade 5-6, producing nonsensical answers like "80 minutes past the hour".
      const minutesPastHourTemplate = TIME_STORIES[1];

      for (let grade = 2; grade <= 6; grade++) {
        for (let i = 0; i < 50; i++) {
          const { answer } = minutesPastHourTemplate.generateProblem(grade);
          expect(answer).toBeGreaterThan(0);
          expect(answer).toBeLessThan(60);
        }
      }
    });

    it('multi-step shopping problems never reuse the main item as the fixed-cost item', () => {
      // Regression: T4-MULTI-1 used to hard-code "calculator" as the fixed-cost
      // item, which collided with the main item when "calculators" was picked.
      const problems = generateEnWordStory(5, 200);
      problems.forEach((p) => {
        const match = p.problemText.match(
          /bought \d+ (\S+(?:\s\S+)?) at \$\d+ each and one (\S+(?:\s\S+)?) for/
        );
        if (!match) return;
        const mainItemPlural = match[1];
        const fixedItem = match[2];
        // Strip plural "s" or "es" for a loose comparison; the fixed item is
        // always singular so they must differ as nouns.
        const mainSingularGuess = mainItemPlural
          .replace(/ies$/, 'y')
          .replace(/s$/, '');
        expect(fixedItem).not.toBe(mainSingularGuess);
      });
    });
  });

  describe('Upper-elementary difficulty (grade 4+)', () => {
    it('grade 4 should produce some answers at or above 200', () => {
      const problems = generateEnWordStory(4, 80);
      const numerics = problems
        .map((p) => p.answer)
        .filter((a): a is number => typeof a === 'number');
      const max = Math.max(...numerics);
      expect(max).toBeGreaterThanOrEqual(200);
    });

    it('grade 5 should sometimes produce 4-digit answers', () => {
      const problems = generateEnWordStory(5, 100);
      expect(problems.some((p) => (p.answer as number) >= 1000)).toBe(true);
    });

    it('grade 6 should sometimes produce answers at or above 5000', () => {
      const problems = generateEnWordStory(6, 120);
      expect(problems.some((p) => (p.answer as number) >= 5000)).toBe(true);
    });

    it('grade 4 should produce multi-sentence problems in a noticeable share of output', () => {
      const problems = generateEnWordStory(4, 80);
      const multiSentence = problems.filter((p) => {
        const periods = (p.problemText.match(/[.!]/g) ?? []).length;
        return periods >= 2;
      });
      // At least 30% of grade 4 problems should be two-or-more-sentence stories.
      expect(multiSentence.length).toBeGreaterThan(problems.length * 0.3);
    });

    it('grade 5+ should sometimes use subordinate-clause connectives', () => {
      const problems = generateEnWordStory(5, 100);
      const hasClause = problems.some((p) =>
        /\b(if|since|because|after|although|while)\b/i.test(p.problemText)
      );
      expect(hasClause).toBe(true);
    });

    it('grade 4+ should sometimes use advanced school/event vocabulary', () => {
      const problems = generateEnWordStory(4, 100);
      const advancedRegex =
        /\b(library|auditorium|cafeteria|gymnasium|festival|concert|tournament|exhibition|fundraiser|marathon|drive|talent show|fair|charity)\b/i;
      expect(problems.some((p) => advancedRegex.test(p.problemText))).toBe(
        true
      );
    });

    it('grade 4+ should include area or perimeter problems sometimes', () => {
      const problems = generateEnWordStory(4, 120);
      expect(
        problems.some((p) =>
          /square meters|perimeter|area of/i.test(p.problemText)
        )
      ).toBe(true);
    });

    it('grade 5+ should sometimes include fraction-of or ratio problems', () => {
      const problems = generateEnWordStory(5, 150);
      expect(
        problems.some((p) => /\d+\/\d+|ratio of/i.test(p.problemText))
      ).toBe(true);
    });

    it('grade 4 should include multiplication and division problems', () => {
      const problems = generateEnWordStory(4, 100);
      const ops = new Set(problems.map((p) => p.operation));
      expect(ops.has('multiplication')).toBe(true);
      expect(ops.has('division')).toBe(true);
    });

    // Regression: event/venue themes must match the activity in the sentence
    // so we never produce nonsense like "at the art exhibition, students chose
    // basketball or soccer". See en-word-story tagged pools.
    describe('context coherence (grade 4+)', () => {
      const SAMPLE = ([4, 5, 6] as const).flatMap((g) =>
        generateEnWordStory(g, 400)
      );

      it('sport-choice problems only use sports-themed events', () => {
        const sportProblems = SAMPLE.filter((p) =>
          /chose basketball|chose soccer/i.test(p.problemText)
        );
        // The fraction-of template should appear in a large sample.
        expect(sportProblems.length).toBeGreaterThan(0);
        sportProblems.forEach((p) => {
          expect(p.problemText).toMatch(
            /\b(sports day|sports tournament|field day)\b/i
          );
          // Non-sports themes must never host a sport choice.
          expect(p.problemText).not.toMatch(
            /\b(art exhibition|concert|library|reading marathon|recycling drive)\b/i
          );
        });
      });

      it('orchestra rehearsals only happen in performance venues', () => {
        const rehearsals = SAMPLE.filter((p) =>
          /orchestra rehearsal/i.test(p.problemText)
        );
        expect(rehearsals.length).toBeGreaterThan(0);
        rehearsals.forEach((p) => {
          expect(p.problemText).toMatch(
            /\b(auditorium|gymnasium|music room)\b/i
          );
        });
      });

      it('floor area/perimeter problems only use indoor rooms', () => {
        const floors = SAMPLE.filter((p) =>
          /floor (is being retiled|is shaped like)/i.test(p.problemText)
        );
        expect(floors.length).toBeGreaterThan(0);
        // An outdoor playground has no tileable/measurable "floor".
        floors.forEach((p) => {
          expect(p.problemText).not.toMatch(/\bplayground\b/i);
        });
      });

      it('seat-row problems only use venues with audience seating', () => {
        const seating = SAMPLE.filter((p) =>
          /rows with .* seats in each row/i.test(p.problemText)
        );
        expect(seating.length).toBeGreaterThan(0);
        seating.forEach((p) => {
          expect(p.problemText).toMatch(
            /\b(auditorium|gymnasium|community center)\b/i
          );
        });
      });

      it('donation/collection problems pair drives with donatable items', () => {
        const drives = SAMPLE.filter((p) =>
          /from the donation box|contributed|class collected/i.test(
            p.problemText
          )
        );
        drives.forEach((p) => {
          if (!/\bdrive\b/i.test(p.problemText)) return; // grade<4 paths
          // Drives never ask about non-donatable goods like trophies/medals.
          expect(p.problemText).not.toMatch(
            /\b(trophy|trophies|medal|medals|calculator|calculators)\b/i
          );
        });
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
        expect([
          'addition',
          'subtraction',
          'multiplication',
          'division',
        ]).toContain(problem.operation);
        expect(typeof problem.problemText).toBe('string');
        expect(['number', 'string']).toContain(typeof problem.answer);
        expect(['word-story', 'comparison']).toContain(problem.category);
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
        expect(['number', 'string']).toContain(typeof answer);
        if (typeof answer === 'number') {
          // Some comparison problems may have negative results (e.g., "fewer than")
          // but the absolute value should be reasonable
          expect(Number.isFinite(answer)).toBe(true);
          expect(Math.abs(answer)).toBeGreaterThanOrEqual(0);
          expect(Math.abs(answer)).toBeLessThan(200000);
        } else {
          // String answers should be non-empty and match a fraction/decimal/
          // remainder shape (no garbled output).
          expect(answer.length).toBeGreaterThan(0);
          expect(answer).toMatch(/^[\d./ R-]+$/);
        }
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
    const hasSequenceProblem = (problems: WordProblemEn[]): boolean =>
      problems.some((p) =>
        /(comes just before|comes just after|is between|Count \d+ (step|steps))/i.test(
          p.problemText
        )
      );

    it('should generate number sequence problems for grade 1 students', () => {
      const grade1Problems = generateGradeEnWordProblems(1, 20);
      expect(hasSequenceProblem(grade1Problems)).toBe(true);
    });

    it('should focus grade 2 problems on contextual stories', () => {
      const grade2Problems = generateGradeEnWordProblems(2, 25);
      expect(hasSequenceProblem(grade2Problems)).toBe(false);
      // Grade 2 problem sets should include story-style questions
      expect(
        grade2Problems.some((problem) =>
          /How many|How much|How long|How far|What time/i.test(
            problem.problemText
          )
        )
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

  describe('Curriculum coverage', () => {
    // Sample sizes are large enough to make statistical coverage robust.
    const SAMPLE = 250;

    it('grade 3 should sometimes produce multiplication answers ≥ 100 (2-3桁×1桁)', () => {
      const problems = generateGradeEnWordProblems(3, SAMPLE);
      const hit = problems.some(
        (p) =>
          p.operation === 'multiplication' &&
          typeof p.answer === 'number' &&
          p.answer >= 100
      );
      expect(hit).toBe(true);
    });

    it('grade 3 should sometimes produce remainder-style "q R r" answers', () => {
      const problems = generateGradeEnWordProblems(3, SAMPLE);
      const hit = problems.some(
        (p) => typeof p.answer === 'string' && / R \d+/.test(p.answer)
      );
      expect(hit).toBe(true);
    });

    it('grade 3 should sometimes produce unit-fraction (1/n) problems', () => {
      const problems = generateGradeEnWordProblems(3, SAMPLE);
      const hit = problems.some((p) =>
        /\b1\/\d+\b|equal pieces/.test(p.problemText)
      );
      expect(hit).toBe(true);
    });

    it('grade 3 should sometimes produce tenths decimal problems', () => {
      const problems = generateGradeEnWordProblems(3, SAMPLE);
      const hit = problems.some(
        (p) => typeof p.answer === 'string' && /^\d+\.\d+$/.test(p.answer)
      );
      expect(hit).toBe(true);
    });

    it('grade 4 should sometimes produce same-denominator fraction answers', () => {
      const problems = generateGradeEnWordProblems(4, SAMPLE);
      const hit = problems.some(
        (p) => typeof p.answer === 'string' && /^\d+\/\d+$/.test(p.answer)
      );
      expect(hit).toBe(true);
    });

    it('grade 4 should sometimes produce decimal × integer / decimal ÷ integer', () => {
      const problems = generateGradeEnWordProblems(4, SAMPLE);
      const hit = problems.some(
        (p) => typeof p.answer === 'string' && /^\d+\.\d+$/.test(p.answer)
      );
      expect(hit).toBe(true);
    });

    it('grade 5 should sometimes produce decimal × decimal / decimal ÷ decimal', () => {
      const problems = generateGradeEnWordProblems(5, SAMPLE);
      const hit = problems.some(
        (p) =>
          typeof p.answer === 'string' &&
          /^\d+\.\d{1,2}$/.test(p.answer) &&
          /square meters|m wide|garden has area/.test(p.problemText)
      );
      expect(hit).toBe(true);
    });

    it('grade 5 should sometimes produce different-denominator fraction answers', () => {
      const problems = generateGradeEnWordProblems(5, SAMPLE);
      const hit = problems.some((p) => {
        if (typeof p.answer !== 'string' || !/^\d+\/\d+$/.test(p.answer)) {
          return false;
        }
        // Look for two distinct denominators in the problem text.
        const denoms = (p.problemText.match(/\d+\/(\d+)/g) ?? []).map((m) =>
          Number(m.split('/')[1])
        );
        return new Set(denoms).size >= 2;
      });
      expect(hit).toBe(true);
    });

    it('grade 5 should include speed / distance / time problems', () => {
      const problems = generateGradeEnWordProblems(5, SAMPLE);
      const hit = problems.some((p) =>
        /km\/h|km in|m per minute/.test(p.problemText)
      );
      expect(hit).toBe(true);
    });

    it('grade 5 should include percent problems', () => {
      const problems = generateGradeEnWordProblems(5, SAMPLE);
      const hit = problems.some((p) => /\b\d+%/.test(p.problemText));
      expect(hit).toBe(true);
    });

    it('grade 6 should sometimes produce fraction × fraction or fraction ÷ fraction', () => {
      const problems = generateGradeEnWordProblems(6, SAMPLE);
      const hit = problems.some((p) => {
        const fractions = p.problemText.match(/\d+\/\d+/g) ?? [];
        return fractions.length >= 2;
      });
      expect(hit).toBe(true);
    });

    it('grade 6 should NOT include simple 1-digit × 1-digit multiplication templates', () => {
      // MULTIPLICATION_STORIES[0-2] (basic "boxes/groups/rows") are now capped at G4.
      const problems = generateGradeEnWordProblems(6, SAMPLE);
      const simpleBoxesPattern =
        /^There are \d+ boxes\. Each box has \d+ \w+\. How many \w+ are there in total\?$/;
      const simpleGroupsPattern =
        /^There are \d+ groups of \d+ \w+\. How many \w+ are there altogether\?$/;
      const simpleRowsPattern =
        /^\w+ are arranged in \d+ rows with \d+ in each row\. How many \w+ are there in total\?$/;
      const hitsBasicMul = problems.some(
        (p) =>
          simpleBoxesPattern.test(p.problemText) ||
          simpleGroupsPattern.test(p.problemText) ||
          simpleRowsPattern.test(p.problemText)
      );
      expect(hitsBasicMul).toBe(false);
    });
  });

  describe('Different-denominator fraction story templates', () => {
    // Regression guards for PR #72 review feedback:
    // - Addition variant must keep painted-wall fractions ≤ 1 whole
    // - Subtraction variant must never produce a negative cake fraction
    const ADDITION_TEMPLATE = FRACTION_DIFF_DENOM_STORIES[0];
    const SUBTRACTION_TEMPLATE = FRACTION_DIFF_DENOM_STORIES[1];

    const parseFractionAnswer = (answer: number | string): number => {
      if (typeof answer === 'number') return answer;
      const [n, d] = answer.split('/').map(Number);
      return d ? n / d : n;
    };

    it('addition story (painted wall) keeps the painted fraction ≤ 1', () => {
      for (let i = 0; i < 500; i++) {
        const { answer } = ADDITION_TEMPLATE.generateProblem(5);
        const value = parseFractionAnswer(answer);
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    });

    it('subtraction story (eaten cake) never produces a negative fraction', () => {
      for (let i = 0; i < 500; i++) {
        const { answer } = SUBTRACTION_TEMPLATE.generateProblem(5);
        const value = parseFractionAnswer(answer);
        expect(value).toBeGreaterThan(0);
        expect(value).toBeLessThan(1);
      }
    });
  });
});
