import { describe, it, expect } from 'vitest';
import { generateGradeMoneyProblems } from './money-problems';
import { generateGradeMoneyProblemsEn } from './money-problems-en';
import { generateGradeTimeProblems } from './time-problems';
import { generateGradeTimeProblemsEn } from './time-problems-en';
import { generateGradeUnitProblems } from './unit-problems';
import { generateGradeUnitProblemsEn } from './unit-problems-en';

describe('New Problem Generators Verification', () => {
  it('should generate Japanese money problems', () => {
    const problems = generateGradeMoneyProblems(1, 5, 'money-change-jap');
    expect(problems).toHaveLength(5);
    expect(problems[0].type).toBe('word');
    expect(problems[0].unit).toBe('円');
  });

  it('should generate English money problems with Ringgit', () => {
    const problems = generateGradeMoneyProblemsEn(1, 5, 'money-change-en');
    expect(problems).toHaveLength(5);
    expect(problems[0].type).toBe('word-en');
    expect(problems[0].unit).toBe('RM');
    expect(problems[0].language).toBe('en');
  });

  it('should generate Japanese time problems', () => {
    const problems = generateGradeTimeProblems(2, 5, 'time-reading-jap');
    expect(problems).toHaveLength(5);
    expect(problems[0].type).toBe('word');
  });

  it('should generate English time problems', () => {
    const problems = generateGradeTimeProblemsEn(2, 5, 'time-reading-en');
    expect(problems).toHaveLength(5);
    expect(problems[0].type).toBe('word-en');
    expect(problems[0].language).toBe('en');
  });

  it('should generate Japanese unit conversion problems', () => {
    const problems = generateGradeUnitProblems(3, 5, 'unit-length-jap');
    expect(problems).toHaveLength(5);
    expect(problems[0].type).toBe('word');
  });

  it('should generate English unit conversion problems', () => {
    const problems = generateGradeUnitProblemsEn(3, 5, 'unit-length-en');
    expect(problems).toHaveLength(5);
    expect(problems[0].type).toBe('word-en');
    expect(problems[0].language).toBe('en');
  });
});
