import { describe, expect, it } from 'vitest';
import {
  assertNoDuplicateNames,
  assertNonEmptyText,
  assertValidAnswer,
  assertValidProblem,
} from './assertions';

describe('assertValidAnswer', () => {
  it('accepts positive finite numbers', () => {
    expect(() => assertValidAnswer(42, 'test')).not.toThrow();
    expect(() => assertValidAnswer(0.5, 'test')).not.toThrow();
  });

  it('rejects NaN', () => {
    expect(() => assertValidAnswer(NaN, 'test')).toThrow('not a finite number');
  });

  it('rejects Infinity', () => {
    expect(() => assertValidAnswer(Infinity, 'test')).toThrow(
      'not a finite number'
    );
  });

  it('rejects zero', () => {
    expect(() => assertValidAnswer(0, 'test')).toThrow('must be positive');
  });

  it('rejects negative numbers', () => {
    expect(() => assertValidAnswer(-5, 'test')).toThrow('must be positive');
  });

  it('accepts string answers without validation', () => {
    expect(() => assertValidAnswer('3/4', 'test')).not.toThrow();
  });
});

describe('assertNoDuplicateNames', () => {
  it('accepts problems with different names', () => {
    expect(() =>
      assertNoDuplicateNames(
        'Maya has 10 stickers. Noah has 5 more than Maya.',
        'test'
      )
    ).not.toThrow();
  });

  it('rejects self-referential names', () => {
    expect(() =>
      assertNoDuplicateNames(
        'Noah has 10 stickers. Noah has 5 more than Noah.',
        'test'
      )
    ).toThrow('Self-referential name');
  });

  it('accepts problems without comparison phrases', () => {
    expect(() =>
      assertNoDuplicateNames('How many stickers are there in all?', 'test')
    ).not.toThrow();
  });
});

describe('assertNonEmptyText', () => {
  it('accepts non-empty text', () => {
    expect(() => assertNonEmptyText('How many?', 'test')).not.toThrow();
  });

  it('rejects empty string', () => {
    expect(() => assertNonEmptyText('', 'test')).toThrow('Empty problem text');
  });

  it('rejects whitespace-only string', () => {
    expect(() => assertNonEmptyText('   ', 'test')).toThrow(
      'Empty problem text'
    );
  });
});

describe('assertValidProblem', () => {
  it('validates a well-formed problem', () => {
    expect(() =>
      assertValidProblem(
        {
          problemText: 'Maya has 10 stickers. How many are red?',
          answer: 5,
        },
        'test'
      )
    ).not.toThrow();
  });

  it('catches invalid answer in combined check', () => {
    expect(() =>
      assertValidProblem({ problemText: 'Some question', answer: -1 }, 'test')
    ).toThrow('must be positive');
  });
});
