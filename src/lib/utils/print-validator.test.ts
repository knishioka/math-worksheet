import { describe, it, expect } from 'vitest';
import {
  countProblemsInHTML,
  validateProblemType,
  validatePrintPreview,
} from './print-validator';

describe('Print Validator', () => {
  describe('countProblemsInHTML', () => {
    it('should count problem numbers correctly', () => {
      const html = `
        <div>(1) 5 + 3 = 8</div>
        <div>(2) 7 − 2 = 5</div>
        <div>(3) 4 × 2 = 8</div>
      `;
      expect(countProblemsInHTML(html)).toBe(3);
    });

    it('should return 0 for HTML without problem numbers', () => {
      const html = '<div>No problems here</div>';
      expect(countProblemsInHTML(html)).toBe(0);
    });

    it('should handle large problem numbers', () => {
      const html = `
        <div>(1) Problem 1</div>
        <div>(99) Problem 99</div>
        <div>(100) Problem 100</div>
      `;
      expect(countProblemsInHTML(html)).toBe(3);
    });
  });

  describe('validateProblemType', () => {
    it('should validate basic problems', () => {
      const html = '<div>5 + 3 = 8</div>';
      expect(validateProblemType(html, 'basic')).toBe(true);
    });

    it('should validate fraction problems', () => {
      const html = '<math><mfrac><mn>1</mn><mn>2</mn></mfrac></math>';
      expect(validateProblemType(html, 'fraction')).toBe(true);
    });

    it('should validate decimal problems', () => {
      const html = '<math><mn>12.5</mn></math> + 3.7';
      expect(validateProblemType(html, 'decimal')).toBe(true);
    });

    it('should validate mixed number problems', () => {
      const html = '<math><mrow><mn>1</mn><mfrac><mn>1</mn><mn>2</mn></mfrac></mrow></math>';
      expect(validateProblemType(html, 'mixed')).toBe(true);
    });

    it('should validate word problems', () => {
      const html = '<div>たろうくんは5個のりんごを持っています。答え: ___</div>';
      expect(validateProblemType(html, 'word')).toBe(true);
    });

    it('should validate English word problems', () => {
      const html = '<div>Sam has 5 apples. Answer: ___</div>';
      expect(validateProblemType(html, 'word-en')).toBe(true);
    });

    it('should validate hissan problems', () => {
      const html = '<div style="border-top: 2px solid black"></div>';
      expect(validateProblemType(html, 'hissan')).toBe(true);
    });
  });

  describe('validatePrintPreview', () => {
    it('should validate complete print preview', () => {
      const html = `
        <div>(1) 5 + 3 = 8</div>
        <div>(2) 7 − 2 = 5</div>
      `;
      const result = validatePrintPreview(html, 2, 'basic', 2);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.problemCount).toBe(2);
      expect(result.a4Fit.fits).toBe(true);
    });

    it('should detect missing problems', () => {
      const html = `
        <div>(1) 5 + 3 = 8</div>
      `;
      const result = validatePrintPreview(html, 2, 'basic', 2);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('問題数の不一致');
      expect(result.problemCount).toBe(1);
    });

    it('should detect invalid problem type rendering', () => {
      const html = `
        <div>(1) Some text without math</div>
        <div>(2) More text</div>
      `;
      const result = validatePrintPreview(html, 2, 'fraction', 2);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.includes('問題タイプ'))).toBe(true);
    });

    it('should warn about A4 overflow', () => {
      const html = Array.from({ length: 50 }, (_, i) => `<div>(${i + 1}) 5 + 3 = 8</div>`).join('');
      const result = validatePrintPreview(html, 50, 'basic', 2);

      expect(result.warnings.some(w => w.includes('A4サイズを超える'))).toBe(true);
    });
  });
});
