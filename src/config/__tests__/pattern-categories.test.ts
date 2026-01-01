import { describe, it, expect } from 'vitest';
import {
  getPatternCategory,
  getPatternLanguage,
  isLanguageDependent,
  filterPatternsByLanguage,
  groupPatternsByCategory,
  getAvailableCategories,
  getCategoryCounts,
  getCategoryForPattern,
  getPatternDifficulty,
  getDifficultyForGrade,
  sortPatternsByDifficulty,
  getAvailableCategoriesSorted,
  getDifficultyStars,
  getDifficultyLabel,
  CATEGORY_CONFIG,
  CATEGORY_ORDER,
  LANGUAGE_DEPENDENT_CATEGORIES,
} from '../pattern-categories';
import type { CalculationPattern } from '../../types/calculation-patterns';

describe('pattern-categories', () => {
  describe('getPatternCategory', () => {
    it('should categorize basic arithmetic patterns', () => {
      expect(getPatternCategory('add-single-digit')).toBe('basic');
      expect(getPatternCategory('sub-double-digit-borrow')).toBe('basic');
      expect(getPatternCategory('mult-single-digit')).toBe('basic');
      expect(getPatternCategory('div-basic')).toBe('basic');
    });

    it('should categorize hissan patterns', () => {
      expect(getPatternCategory('hissan-add-double')).toBe('hissan');
      expect(getPatternCategory('hissan-mult-advanced')).toBe('hissan');
      expect(getPatternCategory('hissan-div-basic')).toBe('hissan');
    });

    it('should categorize fraction and decimal patterns', () => {
      expect(getPatternCategory('frac-same-denom')).toBe('fraction');
      expect(getPatternCategory('frac-mult')).toBe('fraction');
      expect(getPatternCategory('dec-add-simple' as CalculationPattern)).toBe('fraction');
      expect(getPatternCategory('percent-basic')).toBe('fraction');
      expect(getPatternCategory('ratio-proportion')).toBe('fraction');
    });

    it('should categorize life skills patterns', () => {
      expect(getPatternCategory('money-change-jap')).toBe('life');
      expect(getPatternCategory('time-reading-en')).toBe('life');
      expect(getPatternCategory('shopping-discount-jap')).toBe('life');
      expect(getPatternCategory('cooking-ingredients-en')).toBe('life');
      expect(getPatternCategory('calendar-days-jap')).toBe('life');
    });

    it('should categorize word problem patterns', () => {
      expect(getPatternCategory('word-en')).toBe('word');
    });
  });

  describe('getPatternLanguage', () => {
    it('should identify Japanese patterns', () => {
      expect(getPatternLanguage('money-change-jap')).toBe('ja');
      expect(getPatternLanguage('time-reading-jap')).toBe('ja');
      expect(getPatternLanguage('shopping-discount-jap')).toBe('ja');
    });

    it('should identify English patterns', () => {
      expect(getPatternLanguage('money-change-en')).toBe('en');
      expect(getPatternLanguage('time-reading-en')).toBe('en');
      expect(getPatternLanguage('word-en')).toBe('en');
    });

    it('should identify language-neutral patterns', () => {
      expect(getPatternLanguage('add-single-digit')).toBe('all');
      expect(getPatternLanguage('hissan-add-double')).toBe('all');
      expect(getPatternLanguage('frac-same-denom')).toBe('all');
    });
  });

  describe('isLanguageDependent', () => {
    it('should return true for language-specific patterns', () => {
      expect(isLanguageDependent('money-change-jap')).toBe(true);
      expect(isLanguageDependent('shopping-discount-en')).toBe(true);
    });

    it('should return false for language-neutral patterns', () => {
      expect(isLanguageDependent('add-single-digit')).toBe(false);
      expect(isLanguageDependent('hissan-mult-basic')).toBe(false);
    });
  });

  describe('filterPatternsByLanguage', () => {
    const testPatterns: CalculationPattern[] = [
      'add-single-digit',
      'money-change-jap',
      'money-change-en',
      'hissan-add-double',
      'shopping-discount-jap',
      'shopping-discount-en',
    ];

    it('should return all patterns when language is "all"', () => {
      const result = filterPatternsByLanguage(testPatterns, 'all');
      expect(result).toHaveLength(6);
      expect(result).toEqual(testPatterns);
    });

    it('should filter to Japanese + neutral patterns when language is "ja"', () => {
      const result = filterPatternsByLanguage(testPatterns, 'ja');
      expect(result).toContain('add-single-digit');
      expect(result).toContain('money-change-jap');
      expect(result).toContain('hissan-add-double');
      expect(result).toContain('shopping-discount-jap');
      expect(result).not.toContain('money-change-en');
      expect(result).not.toContain('shopping-discount-en');
    });

    it('should filter to English + neutral patterns when language is "en"', () => {
      const result = filterPatternsByLanguage(testPatterns, 'en');
      expect(result).toContain('add-single-digit');
      expect(result).toContain('money-change-en');
      expect(result).toContain('hissan-add-double');
      expect(result).toContain('shopping-discount-en');
      expect(result).not.toContain('money-change-jap');
      expect(result).not.toContain('shopping-discount-jap');
    });
  });

  describe('groupPatternsByCategory', () => {
    const testPatterns: CalculationPattern[] = [
      'add-single-digit',
      'sub-double-digit-borrow',
      'hissan-add-double',
      'frac-same-denom',
      'money-change-jap',
      'word-en',
    ];

    it('should group patterns by category', () => {
      const result = groupPatternsByCategory(testPatterns);

      expect(result.basic).toContain('add-single-digit');
      expect(result.basic).toContain('sub-double-digit-borrow');
      expect(result.hissan).toContain('hissan-add-double');
      expect(result.fraction).toContain('frac-same-denom');
      expect(result.life).toContain('money-change-jap');
      expect(result.word).toContain('word-en');
    });

    it('should return empty arrays for categories with no patterns', () => {
      const result = groupPatternsByCategory(['add-single-digit']);
      expect(result.hissan).toEqual([]);
      expect(result.fraction).toEqual([]);
      expect(result.life).toEqual([]);
      expect(result.word).toEqual([]);
    });
  });

  describe('getAvailableCategories', () => {
    it('should return only categories with patterns', () => {
      const testPatterns: CalculationPattern[] = [
        'add-single-digit',
        'hissan-add-double',
      ];

      const result = getAvailableCategories(testPatterns);

      expect(result).toHaveLength(2);
      expect(result.map((r) => r.category)).toContain('basic');
      expect(result.map((r) => r.category)).toContain('hissan');
      expect(result.map((r) => r.category)).not.toContain('fraction');
    });

    it('should maintain category order', () => {
      const testPatterns: CalculationPattern[] = [
        'word-en',
        'hissan-add-double',
        'add-single-digit',
      ];

      const result = getAvailableCategories(testPatterns);

      // Order should be: basic, hissan, word (following CATEGORY_ORDER)
      expect(result[0].category).toBe('basic');
      expect(result[1].category).toBe('hissan');
      expect(result[2].category).toBe('word');
    });
  });

  describe('getCategoryCounts', () => {
    it('should count patterns per category', () => {
      const testPatterns: CalculationPattern[] = [
        'add-single-digit',
        'sub-double-digit-borrow',
        'mult-single-digit',
        'hissan-add-double',
        'hissan-sub-double',
      ];

      const result = getCategoryCounts(testPatterns);

      expect(result.basic).toBe(3);
      expect(result.hissan).toBe(2);
      expect(result.fraction).toBe(0);
      expect(result.life).toBe(0);
      expect(result.word).toBe(0);
    });
  });

  describe('getCategoryForPattern', () => {
    it('should return category for valid pattern', () => {
      expect(getCategoryForPattern('add-single-digit')).toBe('basic');
      expect(getCategoryForPattern('hissan-add-double')).toBe('hissan');
    });

    it('should return undefined for undefined pattern', () => {
      expect(getCategoryForPattern(undefined)).toBeUndefined();
    });
  });

  describe('constants', () => {
    it('should have all 5 categories configured', () => {
      expect(Object.keys(CATEGORY_CONFIG)).toHaveLength(5);
      expect(CATEGORY_CONFIG.basic).toBeDefined();
      expect(CATEGORY_CONFIG.hissan).toBeDefined();
      expect(CATEGORY_CONFIG.fraction).toBeDefined();
      expect(CATEGORY_CONFIG.life).toBeDefined();
      expect(CATEGORY_CONFIG.word).toBeDefined();
    });

    it('should have correct category order', () => {
      expect(CATEGORY_ORDER).toEqual(['basic', 'hissan', 'fraction', 'life', 'word']);
    });

    it('should have language-dependent categories defined', () => {
      expect(LANGUAGE_DEPENDENT_CATEGORIES).toContain('life');
      expect(LANGUAGE_DEPENDENT_CATEGORIES).toContain('word');
      expect(LANGUAGE_DEPENDENT_CATEGORIES).not.toContain('basic');
      expect(LANGUAGE_DEPENDENT_CATEGORIES).not.toContain('hissan');
    });
  });

  describe('getPatternDifficulty', () => {
    it('should return difficulty level 1 for easy patterns', () => {
      expect(getPatternDifficulty('add-single-digit')).toBe(1);
      expect(getPatternDifficulty('add-to-10')).toBe(1);
      expect(getPatternDifficulty('sub-single-digit')).toBe(1);
      expect(getPatternDifficulty('money-change-jap')).toBe(1);
    });

    it('should return difficulty level 2 for medium patterns', () => {
      expect(getPatternDifficulty('add-single-digit-carry')).toBe(2);
      expect(getPatternDifficulty('mult-single-digit')).toBe(2);
      expect(getPatternDifficulty('time-elapsed-jap')).toBe(2);
    });

    it('should return difficulty level 3 for challenging patterns', () => {
      expect(getPatternDifficulty('add-sub-mixed-basic')).toBe(3);
      expect(getPatternDifficulty('add-single-missing')).toBe(3);
      expect(getPatternDifficulty('hissan-mult-advanced')).toBe(3);
    });

    it('should return default difficulty 2 for undefined patterns', () => {
      // Cast to test undefined pattern behavior
      expect(getPatternDifficulty('unknown-pattern' as CalculationPattern)).toBe(2);
    });
  });

  describe('getDifficultyForGrade', () => {
    it('should return base difficulty for any grade', () => {
      expect(getDifficultyForGrade('add-single-digit', 1)).toBe(1);
      expect(getDifficultyForGrade('add-single-digit', 2)).toBe(1);
      expect(getDifficultyForGrade('mult-single-digit', 2)).toBe(2);
    });
  });

  describe('sortPatternsByDifficulty', () => {
    it('should sort patterns by difficulty ascending', () => {
      const patterns: CalculationPattern[] = [
        'add-sub-mixed-basic', // 3
        'add-single-digit', // 1
        'add-single-digit-carry', // 2
      ];

      const sorted = sortPatternsByDifficulty(patterns);

      expect(sorted[0]).toBe('add-single-digit');
      expect(sorted[1]).toBe('add-single-digit-carry');
      expect(sorted[2]).toBe('add-sub-mixed-basic');
    });

    it('should maintain order for same difficulty patterns', () => {
      const patterns: CalculationPattern[] = [
        'add-to-10', // 1
        'add-single-digit', // 1
        'sub-single-digit', // 1
      ];

      const sorted = sortPatternsByDifficulty(patterns);

      // All have same difficulty, order should be stable
      expect(sorted).toHaveLength(3);
      sorted.forEach((p) => expect(getPatternDifficulty(p)).toBe(1));
    });
  });

  describe('getAvailableCategoriesSorted', () => {
    it('should return categories with patterns sorted by difficulty', () => {
      const patterns: CalculationPattern[] = [
        'add-sub-mixed-basic', // basic, difficulty 3
        'add-single-digit', // basic, difficulty 1
        'add-single-digit-carry', // basic, difficulty 2
        'hissan-mult-advanced', // hissan, difficulty 3
        'hissan-add-double', // hissan, difficulty 1
      ];

      const result = getAvailableCategoriesSorted(patterns);

      // Check basic category is sorted by difficulty
      const basicCategory = result.find((r) => r.category === 'basic');
      expect(basicCategory).toBeDefined();
      expect(basicCategory!.patterns[0]).toBe('add-single-digit'); // difficulty 1
      expect(basicCategory!.patterns[1]).toBe('add-single-digit-carry'); // difficulty 2
      expect(basicCategory!.patterns[2]).toBe('add-sub-mixed-basic'); // difficulty 3

      // Check hissan category is sorted by difficulty
      const hissanCategory = result.find((r) => r.category === 'hissan');
      expect(hissanCategory).toBeDefined();
      expect(hissanCategory!.patterns[0]).toBe('hissan-add-double'); // difficulty 1
      expect(hissanCategory!.patterns[1]).toBe('hissan-mult-advanced'); // difficulty 3
    });
  });

  describe('getDifficultyStars', () => {
    it('should return correct number of stars', () => {
      expect(getDifficultyStars(1)).toBe('⭐');
      expect(getDifficultyStars(2)).toBe('⭐⭐');
      expect(getDifficultyStars(3)).toBe('⭐⭐⭐');
    });
  });

  describe('getDifficultyLabel', () => {
    it('should return correct Japanese labels', () => {
      expect(getDifficultyLabel(1)).toBe('やさしい');
      expect(getDifficultyLabel(2)).toBe('ふつう');
      expect(getDifficultyLabel(3)).toBe('チャレンジ');
    });
  });
});
