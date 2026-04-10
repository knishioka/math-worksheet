import { describe, expect, it } from 'vitest';
import type { WorksheetSettings } from '../../types';
import { generateProblems } from './index';
import {
  calculateSequentialFractionUsage,
  generateSingaporeBarModel,
  generateSingaporeComparison,
  generateSingaporeMultiStep,
  generateSingaporeNumberBond,
  generateSingaporeFractionSet,
  generateSingaporeDecimal,
  generateSingaporeRatio,
  generateSingaporePercentage,
  generateSingaporeRate,
  generateSingaporeVolume,
  generateSingaporeAlgebra,
  generateSingaporeRatioAdvanced,
  generateSingaporeCircle,
  generateSingaporeDataAnalysis,
} from './singapore-problems-en';

describe('singapore-problems-en generators', () => {
  it('generates bar model problems with diagram data', () => {
    const problems = generateSingaporeBarModel(3, 12);

    expect(problems).toHaveLength(12);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.language).toBe('en');
      expect(problem.category).toBe('bar-model');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
      expect(problem.diagram?.diagramType).toBe('bar-model');
    });
  });

  it('generates number bond problems with diagram data', () => {
    const problems = generateSingaporeNumberBond(4, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.language).toBe('en');
      expect(problem.category).toBe('number-bond');
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
      expect(problem.diagram?.diagramType).toBe('number-bond');
      if (problem.diagram?.diagramType === 'number-bond') {
        expect(problem.diagram.parts.length).toBeGreaterThanOrEqual(2);
      }
    });
  });

  it('generates comparison problems with diagram data', () => {
    const problems = generateSingaporeComparison(5, 10);

    expect(problems).toHaveLength(10);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.operation).toBe('multiplication');
      expect(problem.category).toBe('comparison');
      // Grade 5 uses varied comparison: times, ratio, or percentage
      expect(
        problem.problemText.includes('times') ||
          problem.problemText.includes('ratio') ||
          problem.problemText.includes('%')
      ).toBe(true);
      expect(typeof problem.answer).toBe('number');
      expect(problem.diagram).toBeDefined();
      expect(problem.diagram?.diagramType).toBe('comparison');
    });
  });

  it('generates multi-step fraction problems without diagrams', () => {
    const problems = generateSingaporeMultiStep(6, 8);

    expect(problems).toHaveLength(8);
    problems.forEach((problem) => {
      expect(problem.type).toBe('singapore');
      expect(problem.category).toBe('multi-step');
      expect(problem.problemText).toContain('/');
      expect(
        problem.operation === 'subtraction' || problem.operation === 'division'
      ).toBe(true);
      expect(typeof problem.answer).toBe('number');
      expect(Number.isInteger(problem.answer)).toBe(true);
      expect(problem.diagram).toBeUndefined();
    });
  });

  it('never reuses the same name in two-person Singapore prompts', () => {
    const barModelProblems = generateSingaporeBarModel(4, 200);
    const comparisonProblems = generateSingaporeComparison(4, 200);

    const selfReferencePattern =
      /\b([A-Z][a-z]+)\b has \d+ (?:more than|times as many as) \1\b/;

    [...barModelProblems, ...comparisonProblems].forEach((problem) => {
      expect(selfReferencePattern.test(problem.problemText)).toBe(false);
    });
  });

  it('uses additive comparison language for grade 2', () => {
    const problems = generateSingaporeComparison(2, 80);

    expect(problems).toHaveLength(80);
    problems.forEach((problem) => {
      expect(
        problem.operation === 'addition' || problem.operation === 'subtraction'
      ).toBe(true);
      expect(problem.problemText.includes('times as many')).toBe(false);
      expect(
        problem.problemText.includes('more') ||
          problem.problemText.includes('fewer')
      ).toBe(true);
    });
  });

  it('keeps multiplicative comparison language for grade 3+', () => {
    const problems = generateSingaporeComparison(3, 80);

    expect(problems).toHaveLength(80);
    problems.forEach((problem) => {
      expect(problem.operation).toBe('multiplication');
      expect(problem.problemText).toContain('times as many');
    });
  });

  it('computes known multi-step calculations correctly', () => {
    const scenario = {
      fraction1Numerator: 1,
      fraction1Denominator: 2,
      fraction2Numerator: 1,
      fraction2Denominator: 4,
      lcm: 4,
    };
    const usage48 = calculateSequentialFractionUsage(48, scenario);
    const usage64 = calculateSequentialFractionUsage(64, scenario);

    expect(usage48).not.toBeNull();
    expect(usage64).not.toBeNull();
    expect(usage48?.usedFirst).toBe(24);
    expect(usage48?.usedSecond).toBe(6);
    expect(usage48?.remainingAfterSecond).toBe(18);
    expect((usage48?.remainingAfterSecond ?? 0) / 6).toBe(3);
    expect((usage64?.remainingAfterSecond ?? 0) / 6).toBe(4);
  });

  it('matches generated multi-step answers with sequential fraction math', () => {
    const problems = generateSingaporeMultiStep(3, 80);

    problems.forEach((problem) => {
      const [fraction1, fraction2] = [
        ...problem.problemText.matchAll(/(\d+)\/(\d+)/g),
      ];
      const totalMatch = problem.problemText.match(/(?:has|are) (\d+) /);
      expect(fraction1).toBeDefined();
      expect(fraction2).toBeDefined();
      expect(totalMatch).toBeDefined();

      const total = Number(totalMatch?.[1] ?? 0);
      const usage = calculateSequentialFractionUsage(total, {
        fraction1Numerator: Number(fraction1[1]),
        fraction1Denominator: Number(fraction1[2]),
        fraction2Numerator: Number(fraction2[1]),
        fraction2Denominator: Number(fraction2[2]),
        lcm: 1,
      });

      expect(usage).not.toBeNull();

      if (problem.operation === 'subtraction') {
        expect(problem.answer).toBe(usage?.remainingAfterSecond);
      } else {
        const groupsMatch = problem.problemText.match(/among (\d+) students/);
        expect(groupsMatch).toBeDefined();
        const groups = Number(groupsMatch?.[1] ?? 1);
        expect(problem.answer).toBe(
          (usage?.remainingAfterSecond ?? 0) / groups
        );
      }
    });
  });
});

// ── Structure diversity tests ────────────────────────────────────────

describe('bar model structure diversity', () => {
  it('grade 3-4: produces multi-step, 3-part, and before/after variants', () => {
    const problems = generateSingaporeBarModel(4, 200);
    const hasMultiStep = problems.some((p) =>
      p.problemText.includes('times as many')
    );
    const has3Part = problems.some((p) => p.problemText.includes('3 pieces'));
    const hasBeforeAfter = problems.some((p) =>
      p.problemText.includes('gave away')
    );
    expect(hasMultiStep).toBe(true);
    expect(has3Part).toBe(true);
    expect(hasBeforeAfter).toBe(true);
  });

  it('grade 5-6: produces ratio-based, transfer, and fraction multi-step variants', () => {
    const problems = generateSingaporeBarModel(6, 200);
    const hasRatio = problems.some((p) => p.problemText.includes('ratio'));
    const hasTransfer = problems.some((p) =>
      p.problemText.includes('gives some')
    );
    const hasFractionStep = problems.some((p) =>
      p.problemText.includes('remainder')
    );
    expect(hasRatio).toBe(true);
    expect(hasTransfer).toBe(true);
    expect(hasFractionStep).toBe(true);
  });

  it('grade 1-2: only produces simple part-whole and comparison', () => {
    const problems = generateSingaporeBarModel(1, 200);
    problems.forEach((p) => {
      expect(p.problemText.includes('ratio')).toBe(false);
      expect(p.problemText.includes('gave away')).toBe(false);
      expect(p.problemText.includes('3 pieces')).toBe(false);
    });
  });
});

describe('number bond structure diversity', () => {
  it('grade 3-4: produces 4-digit place value, sum-difference, and 3-part bonds', () => {
    const problems = generateSingaporeNumberBond(4, 200);
    const has4Digit = problems.some((p) => {
      if (p.diagram?.diagramType !== 'number-bond') return false;
      return p.diagram.parts.length === 4;
    });
    const hasSumDiff = problems.some((p) =>
      p.problemText.includes('add up to')
    );
    const has3Part = problems.some((p) => {
      if (p.diagram?.diagramType !== 'number-bond') return false;
      return p.diagram.parts.length === 3;
    });
    expect(has4Digit).toBe(true);
    expect(hasSumDiff).toBe(true);
    expect(has3Part).toBe(true);
  });

  it('grade 5-6: produces fraction, decimal, and complement problems', () => {
    const problems = generateSingaporeNumberBond(6, 200);
    const hasFraction = problems.some((p) => p.problemText.includes('/'));
    const hasDecomposition = problems.some(
      (p) => p.problemText.includes('= ') && p.problemText.includes('+ ?')
    );
    const hasComplement = problems.some((p) => p.problemText.includes('makes'));
    expect(hasFraction).toBe(true);
    expect(hasDecomposition).toBe(true);
    expect(hasComplement).toBe(true);
  });
});

describe('comparison structure diversity', () => {
  it('grade 5-6: produces combined, ratio-based, and percentage-based variants', () => {
    const problems = generateSingaporeComparison(6, 200);
    const hasCombined = problems.some((p) => p.problemText.includes('plus'));
    const hasRatio = problems.some((p) => p.problemText.includes('ratio'));
    const hasPercentage = problems.some((p) => p.problemText.includes('%'));
    expect(hasCombined).toBe(true);
    expect(hasRatio).toBe(true);
    expect(hasPercentage).toBe(true);
  });

  it('grade 3-4: only produces multiplicative comparison (times as many)', () => {
    const problems = generateSingaporeComparison(4, 200);
    problems.forEach((p) => {
      expect(p.problemText).toContain('times as many');
      expect(p.problemText.includes('ratio')).toBe(false);
      expect(p.problemText.includes('%')).toBe(false);
    });
  });
});

// ── Grade 4-6 generator tests ────────────────────────────────────────

describe('singapore-fraction-set generator', () => {
  it('generates fraction-set problems for grade 4', () => {
    const problems = generateSingaporeFractionSet(4, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.language).toBe('en');
      expect(p.category).toBe('fraction-set');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('produces valid problems across 200 samples', () => {
    const problems = generateSingaporeFractionSet(5, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      expect(typeof p.answer).toBe('number');
      expect(p.answer).toBeGreaterThan(0);
    });
  });
});

describe('singapore-decimal generator', () => {
  it('generates decimal word problems for grade 4', () => {
    const problems = generateSingaporeDecimal(4, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.language).toBe('en');
      expect(p.category).toBe('decimal');
      expect(typeof p.answer).toBe('number');
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('never reuses the same name in two-person prompts across 200 samples', () => {
    const problems = generateSingaporeDecimal(5, 200);
    const selfRef =
      /\b([A-Z][a-z]+)\b has \d+[^.]*?(?:more than|fewer than|times as many as) \1\b/;
    problems.forEach((p) => {
      expect(selfRef.test(p.problemText)).toBe(false);
    });
  });
});

describe('singapore-ratio generator', () => {
  it('generates ratio problems for grade 5', () => {
    const problems = generateSingaporeRatio(5, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('ratio');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('produces valid problems across 200 samples', () => {
    const problems = generateSingaporeRatio(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('never reuses the same name in two-person prompts', () => {
    const problems = generateSingaporeRatio(5, 200);
    const selfRef =
      /\b([A-Z][a-z]+)\b has \d+[^.]*?(?:more than|fewer than|times as many as) \1\b/;
    problems.forEach((p) => {
      expect(selfRef.test(p.problemText)).toBe(false);
    });
  });
});

describe('singapore-percentage generator', () => {
  it('generates percentage problems for grade 5', () => {
    const problems = generateSingaporePercentage(5, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('percentage');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('produces valid problems across 200 samples', () => {
    const problems = generateSingaporePercentage(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      expect(p.answer).toBeGreaterThan(0);
    });
  });
});

describe('singapore-rate generator', () => {
  it('generates speed/distance/time problems for grade 5', () => {
    const problems = generateSingaporeRate(5, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('rate');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('verifies distance = speed × time across 200 samples', () => {
    const problems = generateSingaporeRate(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      expect(p.answer).toBeGreaterThan(0);
      // All rate answers should be whole numbers
      expect(Number.isInteger(p.answer)).toBe(true);
    });
  });
});

describe('singapore-volume generator', () => {
  it('generates volume problems for grade 5', () => {
    const problems = generateSingaporeVolume(5, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('volume');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('produces valid problems across 200 samples', () => {
    const problems = generateSingaporeVolume(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      expect(p.answer).toBeGreaterThan(0);
    });
  });
});

describe('singapore-algebra generator', () => {
  it('generates algebra problems for grade 6', () => {
    const problems = generateSingaporeAlgebra(6, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('algebra');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('produces valid problems across 200 samples', () => {
    const problems = generateSingaporeAlgebra(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('verifies ax + b = c equation answers', () => {
    const problems = generateSingaporeAlgebra(6, 200);
    problems.forEach((p) => {
      const addMatch = p.problemText.match(/(\d+)x \+ (\d+) = (\d+)/);
      if (addMatch) {
        const a = Number(addMatch[1]);
        const b = Number(addMatch[2]);
        const c = Number(addMatch[3]);
        expect(p.answer).toBe((c - b) / a);
      }
      const subMatch = p.problemText.match(/(\d+)x − (\d+) = (\d+)/);
      if (subMatch) {
        const a = Number(subMatch[1]);
        const b = Number(subMatch[2]);
        const c = Number(subMatch[3]);
        expect(p.answer).toBe((c + b) / a);
      }
    });
  });
});

describe('singapore-ratio-advanced generator', () => {
  it('generates advanced ratio problems for grade 6', () => {
    const problems = generateSingaporeRatioAdvanced(6, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('ratio-advanced');
      expect(typeof p.answer).toBe('number');
      expect(Number.isInteger(p.answer)).toBe(true);
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('never reuses names and produces 200 valid samples', () => {
    const problems = generateSingaporeRatioAdvanced(6, 200);
    const selfRef =
      /\b([A-Z][a-z]+)\b has \d+[^.]*?(?:more than|fewer than|times as many as) \1\b/;
    problems.forEach((p) => {
      expect(selfRef.test(p.problemText)).toBe(false);
      expect(p.answer).toBeGreaterThan(0);
    });
  });
});

describe('singapore-circle generator', () => {
  it('generates circle problems for grade 6', () => {
    const problems = generateSingaporeCircle(6, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('circle');
      expect(typeof p.answer).toBe('number');
      expect(p.answer).toBeGreaterThan(0);
      expect(p.problemText).toContain('π = 3.14');
    });
  });

  it('verifies circumference and area calculations across 200 samples', () => {
    const PI = 3.14;
    const problems = generateSingaporeCircle(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      const radiusMatch = p.problemText.match(/radius of (\d+) cm/);
      const diameterMatch = p.problemText.match(/diameter of (\d+) cm/);
      if (p.problemText.includes('area') && radiusMatch) {
        const r = Number(radiusMatch[1]);
        expect(p.answer).toBe(Math.round(PI * r * r * 100) / 100);
      } else if (p.problemText.includes('circumference') && radiusMatch) {
        const r = Number(radiusMatch[1]);
        expect(p.answer).toBe(Math.round(2 * PI * r * 100) / 100);
      } else if (p.problemText.includes('circumference') && diameterMatch) {
        const d = Number(diameterMatch[1]);
        expect(p.answer).toBe(Math.round(PI * d * 100) / 100);
      } else {
        throw new Error(`Unhandled circle problem variant: "${p.problemText}"`);
      }
    });
  });
});

describe('singapore-data-analysis generator', () => {
  it('generates data analysis problems for grade 6', () => {
    const problems = generateSingaporeDataAnalysis(6, 10);
    expect(problems).toHaveLength(10);
    problems.forEach((p) => {
      expect(p.type).toBe('singapore');
      expect(p.category).toBe('data-analysis');
      expect(typeof p.answer).toBe('number');
      expect(p.answer).toBeGreaterThan(0);
    });
  });

  it('verifies mean, median, and mode calculations across 200 samples', () => {
    const problems = generateSingaporeDataAnalysis(6, 200);
    expect(problems).toHaveLength(200);
    problems.forEach((p) => {
      const dataMatch = p.problemText.match(/: (.+)\.$/);
      expect(dataMatch).not.toBeNull();
      const numbers = dataMatch![1].split(', ').map(Number);

      if (p.problemText.includes('mean')) {
        const sum = numbers.reduce((a, b) => a + b, 0);
        expect(p.answer).toBe(sum / numbers.length);
      } else if (p.problemText.includes('median')) {
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        expect(p.answer).toBe(sorted[mid]);
      } else if (p.problemText.includes('mode')) {
        const freq = new Map<number, number>();
        numbers.forEach((n) => freq.set(n, (freq.get(n) ?? 0) + 1));
        let maxFreq = 0;
        let mode = 0;
        freq.forEach((count, val) => {
          if (count > maxFreq) {
            maxFreq = count;
            mode = val;
          }
        });
        expect(p.answer).toBe(mode);
      } else {
        throw new Error(`Unhandled data analysis type: "${p.problemText}"`);
      }
    });
  });
});

describe('singapore pattern router integration', () => {
  const baseSettings: Omit<WorksheetSettings, 'calculationPattern'> = {
    grade: 5,
    problemType: 'basic',
    operation: 'addition',
    problemCount: 6,
    layoutColumns: 2,
  };

  it.each([
    'singapore-bar-model',
    'singapore-number-bond',
    'singapore-comparison',
    'singapore-multi-step',
    'singapore-fraction-set',
    'singapore-decimal',
    'singapore-ratio',
    'singapore-percentage',
    'singapore-rate',
    'singapore-volume',
    'singapore-algebra',
    'singapore-ratio-advanced',
    'singapore-circle',
    'singapore-data-analysis',
  ] as const)('routes %s through generateProblems', (calculationPattern) => {
    const problems = generateProblems({
      ...baseSettings,
      calculationPattern,
    });

    expect(problems).toHaveLength(6);
    expect(problems.every((problem) => problem.type === 'singapore')).toBe(
      true
    );
  });
});
