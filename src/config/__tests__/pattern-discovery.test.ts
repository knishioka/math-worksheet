import { describe, expect, it } from 'vitest';
import { getDiscoveryGroups } from '../pattern-discovery';
import { getPatternDifficulty } from '../pattern-categories';
import type { CalculationPattern } from '../../types';

describe('discovery order', () => {
  it('follows the paired addition/subtraction learning sequence within a category', () => {
    const patterns: CalculationPattern[] = [
      'add-plus-nine',
      'add-to-10',
      'sub-minus-one',
      'add-plus-one',
    ];
    expect(getDiscoveryGroups(patterns, 1)[0].patterns).toEqual([
      'add-plus-one',
      'sub-minus-one',
      'add-to-10',
      'add-plus-nine',
    ]);
    expect(patterns[0]).toBe('add-plus-nine');
  });

  it('puts times-table two and five before the later tables', () => {
    expect(
      getDiscoveryGroups(
        [
          'mult-table-one',
          'mult-table-nine',
          'mult-table-five',
          'mult-table-two',
        ],
        2
      )[0].patterns
    ).toEqual([
      'mult-table-two',
      'mult-table-five',
      'mult-table-nine',
      'mult-table-one',
    ]);
  });

  it('includes material outside the learning path and supports difficulty order', () => {
    const patterns: CalculationPattern[] = [
      'add-plus-one',
      'add-single-missing',
      'anzan-pair-sum',
    ];
    for (const order of ['learning', 'difficulty'] as const) {
      const groups = getDiscoveryGroups(patterns, 1, order);
      expect(groups.flatMap((group) => group.patterns).sort()).toEqual(
        [...patterns].sort()
      );
    }
    const groups = getDiscoveryGroups(patterns, 1, 'difficulty');
    for (const group of groups) {
      const difficulties = group.patterns.map(getPatternDifficulty);
      expect(difficulties).toEqual([...difficulties].sort());
    }
  });
});
