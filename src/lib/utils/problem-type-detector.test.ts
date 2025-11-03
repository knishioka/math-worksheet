import { describe, it, expect } from 'vitest';
import {
  getEffectiveProblemType,
  isWordProblem,
} from './problem-type-detector';

describe('problem-type-detector allowance classification', () => {
  it('treats allowance goal (Japanese) as a word problem', () => {
    expect(isWordProblem('basic', 'allowance-goal-jap')).toBe(true);
    expect(getEffectiveProblemType('basic', 'allowance-goal-jap')).toBe('word');
  });

  it('treats allowance saving (Japanese) as a word problem', () => {
    expect(isWordProblem('basic', 'allowance-saving-jap')).toBe(true);
    expect(getEffectiveProblemType('basic', 'allowance-saving-jap')).toBe('word');
  });
});
