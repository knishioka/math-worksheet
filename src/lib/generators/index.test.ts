import { describe, it, expect } from 'vitest';
import {
  generateProblems,
  generateMixedProblems,
  validateSettings,
} from './index';
import type { WorksheetSettings, Operation } from '../../types';

describe('generateProblems', () => {
  it('should generate addition problems', () => {
    const settings: WorksheetSettings = {
      grade: 2,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 5,
      layoutColumns: 2,
    };

    const problems = generateProblems(settings);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.operation).toBe('addition');
      expect(problem.type).toBe('basic');
    });
  });

  it('should generate subtraction problems', () => {
    const settings: WorksheetSettings = {
      grade: 2,
      problemType: 'basic',
      operation: 'subtraction',
      problemCount: 5,
      layoutColumns: 2,
    };

    const problems = generateProblems(settings);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.operation).toBe('subtraction');
      expect(problem.type).toBe('basic');
    });
  });

  it('should generate multiplication problems', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'multiplication',
      problemCount: 5,
      layoutColumns: 2,
    };

    const problems = generateProblems(settings);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.operation).toBe('multiplication');
      expect(problem.type).toBe('basic');
    });
  });

  it('should generate division problems', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'division',
      problemCount: 5,
      layoutColumns: 2,
    };

    const problems = generateProblems(settings);

    expect(problems).toHaveLength(5);
    problems.forEach((problem) => {
      expect(problem.operation).toBe('division');
      expect(problem.type).toBe('basic');
    });
  });

  it('should throw error for unsupported operation', () => {
    const settings: WorksheetSettings = {
      grade: 2,
      problemType: 'basic',
      operation: 'invalid' as Operation,
      problemCount: 5,
      layoutColumns: 2,
    };

    expect(() => generateProblems(settings)).toThrow(
      'Unsupported operation: invalid'
    );
  });
});

describe('generateMixedProblems', () => {
  it('should generate mixed operation problems', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 10,
      layoutColumns: 2,
    };

    const problems = generateMixedProblems(settings, [
      'addition',
      'subtraction',
    ]);

    expect(problems).toHaveLength(10);

    const additionProblems = problems.filter((p) => p.operation === 'addition');
    const subtractionProblems = problems.filter(
      (p) => p.operation === 'subtraction'
    );

    expect(additionProblems.length).toBeGreaterThan(0);
    expect(subtractionProblems.length).toBeGreaterThan(0);
    expect(additionProblems.length + subtractionProblems.length).toBe(10);
  });

  it('should distribute problems evenly across operations', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 12,
      layoutColumns: 2,
    };

    const problems = generateMixedProblems(settings, [
      'addition',
      'subtraction',
      'multiplication',
    ]);

    expect(problems).toHaveLength(12);

    const operationCounts = problems.reduce(
      (counts, problem) => {
        counts[problem.operation] = (counts[problem.operation] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>
    );

    // Should have 4 problems of each operation (12 / 3 = 4)
    Object.values(operationCounts).forEach((count) => {
      expect(count).toBe(4);
    });
  });

  it('should handle uneven distribution', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 10,
      layoutColumns: 2,
    };

    const problems = generateMixedProblems(settings, [
      'addition',
      'subtraction',
      'multiplication',
    ]);

    expect(problems).toHaveLength(10);

    const operationCounts = problems.reduce(
      (counts, problem) => {
        counts[problem.operation] = (counts[problem.operation] || 0) + 1;
        return counts;
      },
      {} as Record<string, number>
    );

    // Should have roughly 3-4 problems of each operation
    Object.values(operationCounts).forEach((count) => {
      expect(count).toBeGreaterThanOrEqual(3);
      expect(count).toBeLessThanOrEqual(4);
    });
  });
});

describe('validateSettings', () => {
  it('should validate correct settings', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 20,
      layoutColumns: 2,
    };

    const result = validateSettings(settings);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should detect invalid problem count', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 0,
      layoutColumns: 2,
    };

    const result = validateSettings(settings);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Problem count must be greater than 0');
  });

  it('should detect excessive problem count', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 150,
      layoutColumns: 2,
    };

    const result = validateSettings(settings);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Problem count should not exceed 100');
  });

  it('should detect invalid grade', () => {
    const settings: WorksheetSettings = {
      grade: 0 as 1 | 2 | 3 | 4 | 5 | 6,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 20,
      layoutColumns: 2,
    };

    const result = validateSettings(settings);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Grade must be between 1 and 6');
  });

  it('should detect invalid layout columns', () => {
    const settings: WorksheetSettings = {
      grade: 3,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 20,
      layoutColumns: 5 as 1 | 2 | 3,
    };

    const result = validateSettings(settings);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Layout columns must be between 1 and 3');
  });

  it('should detect multiple validation errors', () => {
    const settings: WorksheetSettings = {
      grade: 10 as 1 | 2 | 3 | 4 | 5 | 6,
      problemType: 'basic',
      operation: 'addition',
      problemCount: 0,
      layoutColumns: 0 as 1 | 2 | 3,
    };

    const result = validateSettings(settings);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
