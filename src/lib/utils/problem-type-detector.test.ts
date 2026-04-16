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
    expect(getEffectiveProblemType('basic', 'allowance-saving-jap')).toBe(
      'word'
    );
  });

  it('routes allowance goal (English) through the English word template', () => {
    expect(isWordProblem('basic', 'allowance-goal-en')).toBe(true);
    expect(getEffectiveProblemType('basic', 'allowance-goal-en')).toBe('word');
    expect(getEffectiveProblemType('word-en', 'allowance-goal-en')).toBe(
      'word-en'
    );
  });

  it('routes allowance saving (English) through the English word template', () => {
    expect(isWordProblem('basic', 'allowance-saving-en')).toBe(true);
    expect(getEffectiveProblemType('basic', 'allowance-saving-en')).toBe(
      'word'
    );
    expect(getEffectiveProblemType('word-en', 'allowance-saving-en')).toBe(
      'word-en'
    );
  });
});

describe('problem-type-detector anzan classification', () => {
  it('routes anzan-pair-sum to anzan template', () => {
    expect(getEffectiveProblemType('basic', 'anzan-pair-sum')).toBe('anzan');
  });

  it('routes anzan-reorder to anzan template', () => {
    expect(getEffectiveProblemType('basic', 'anzan-reorder')).toBe('anzan');
  });

  it('routes anzan-mixed to anzan template', () => {
    expect(getEffectiveProblemType('basic', 'anzan-mixed')).toBe('anzan');
  });

  it('routes anzan-round-add to anzan template', () => {
    expect(getEffectiveProblemType('basic', 'anzan-round-add')).toBe('anzan');
  });

  it('does not route non-anzan patterns to anzan template', () => {
    expect(getEffectiveProblemType('basic', undefined)).toBe('basic');
    expect(getEffectiveProblemType('fraction', undefined)).toBe('fraction');
  });
});

describe('problem-type-detector explicit problem type priority', () => {
  it('keeps explicit decimal type even if stale fraction pattern remains', () => {
    expect(getEffectiveProblemType('decimal', 'frac-mult')).toBe('decimal');
  });

  it('keeps explicit basic-derived type when not in basic mode', () => {
    expect(getEffectiveProblemType('hissan', 'frac-div')).toBe('hissan');
    expect(getEffectiveProblemType('missing', 'frac-simplify')).toBe('missing');
  });

  it('still routes fraction and mixed templates in basic mode', () => {
    expect(getEffectiveProblemType('basic', 'frac-same-denom')).toBe(
      'fraction'
    );
    expect(getEffectiveProblemType('basic', 'frac-mixed-number')).toBe(
      'mixed'
    );
  });
});
