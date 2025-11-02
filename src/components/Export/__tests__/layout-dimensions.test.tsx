import { describe, it, expect } from 'vitest';
import { PRINT_TEMPLATES, getPrintTemplate } from '../../../config/print-templates';
import type { ProblemType, LayoutColumns } from '../../../types';
import {
  estimatePageLayout,
  mmToPx,
  pxToMm,
  A4_HEIGHT_MM,
  MIN_MARGIN_MM,
  HEADER_HEIGHT_MM,
} from '../fitPageToA4';

interface LayoutStats {
  topMarginMm: number;
  bottomMarginMm: number;
  contentHeightMm: number;
  totalHeightMm: number;
  totalHeightPx: number;
  remainingHeightMm: number;
}

/**
 * レイアウト寸法テスト
 *
 * 推奨問題数がA4用紙（1123px高さ）に収まるかを検証
 * 各問題タイプのレイアウト設定が適切かをチェック
 */
describe('Layout Dimensions Tests', () => {
  const A4_HEIGHT_PX = Math.round(mmToPx(A4_HEIGHT_MM));

  const computeLayoutStats = (
    problemType: ProblemType,
    layoutColumns: LayoutColumns,
    problemCount: number
  ): LayoutStats => {
    const template = getPrintTemplate(problemType);
    const estimate = estimatePageLayout({
      problemCount,
      columns: layoutColumns,
      template,
    });

    const totalHeightMm =
      estimate.topMarginMm + estimate.bottomMarginMm + estimate.contentHeightMm;

    return {
      ...estimate,
      totalHeightMm,
      totalHeightPx: mmToPx(totalHeightMm),
      remainingHeightMm: Math.max(0, A4_HEIGHT_MM - totalHeightMm),
    };
  };

  describe('Recommended Problem Counts - A4 Fit Validation', () => {
    // すべての問題タイプをテスト
    const problemTypes: ProblemType[] = [
      'basic',
      'fraction',
      'decimal',
      'mixed',
      'hissan',
      'missing',
      'word',
      'word-en',
    ];

    problemTypes.forEach((problemType) => {
      const template = PRINT_TEMPLATES[problemType];

      describe(`${problemType} (${template.displayName})`, () => {
        // 1列、2列、3列それぞれでテスト
        ([1, 2, 3] as const).forEach((layoutColumns) => {
          it(`should fit recommended count (${template.recommendedCounts[layoutColumns]} problems) in A4 for ${layoutColumns}-column layout`, () => {
            const recommendedCount = template.recommendedCounts[layoutColumns];
            const threshold = template.fitsInA4.threshold[layoutColumns];

            // 推奨問題数がA4閾値以下であることを確認
            expect(recommendedCount).toBeLessThanOrEqual(threshold);

            // 推定高さを計算
            const stats = computeLayoutStats(
              problemType,
              layoutColumns,
              recommendedCount
            );

            expect(stats.totalHeightPx).toBeLessThanOrEqual(A4_HEIGHT_PX);
            expect(stats.topMarginMm).toBeGreaterThanOrEqual(MIN_MARGIN_MM);
            expect(stats.bottomMarginMm).toBeGreaterThanOrEqual(MIN_MARGIN_MM);

            const marginPx = mmToPx(stats.remainingHeightMm);
            const marginMm = Math.round(stats.remainingHeightMm * 1000) / 1000;

            expect(marginPx).toBeGreaterThanOrEqual(0);

            console.log(
              `${problemType} ${layoutColumns}列: ` +
                `推奨${recommendedCount}問 = ${stats.totalHeightPx.toFixed(1)}px ` +
                `(上下余白: ${stats.topMarginMm.toFixed(2)}mm / ${stats.bottomMarginMm.toFixed(2)}mm, ` +
                `残余白: ${marginPx.toFixed(1)}px / ${marginMm.toFixed(2)}mm)`
            );
          });
        });

        // 最大問題数がA4に収まるかもテスト
        ([1, 2, 3] as const).forEach((layoutColumns) => {
          it(`should validate max count (${template.maxCounts[layoutColumns]} problems) for ${layoutColumns}-column layout`, () => {
            const maxCount = template.maxCounts[layoutColumns];
            const threshold = template.fitsInA4.threshold[layoutColumns];

            // 最大問題数がA4閾値以下の場合のみテスト
            if (maxCount <= threshold) {
              const stats = computeLayoutStats(
                problemType,
                layoutColumns,
                maxCount
              );

              expect(stats.totalHeightPx).toBeLessThanOrEqual(
                A4_HEIGHT_PX + mmToPx(2)
              );
            }
          });
        });
      });
    });
  });

  describe('Layout Settings Consistency', () => {
    it('should have consistent recommended counts across all problem types', () => {
      Object.entries(PRINT_TEMPLATES).forEach(([_, template]) => {
        // 推奨問題数は列数に応じて増加すべき
        expect(template.recommendedCounts[1]).toBeLessThanOrEqual(
          template.recommendedCounts[2]
        );

        // 推奨問題数は最大問題数以下であるべき
        expect(template.recommendedCounts[1]).toBeLessThanOrEqual(
          template.maxCounts[1]
        );
        expect(template.recommendedCounts[2]).toBeLessThanOrEqual(
          template.maxCounts[2]
        );
        expect(template.recommendedCounts[3]).toBeLessThanOrEqual(
          template.maxCounts[3]
        );

        // 推奨問題数はA4閾値と一致すべき
        expect(template.recommendedCounts[1]).toBe(
          template.fitsInA4.threshold[1]
        );
        expect(template.recommendedCounts[2]).toBe(
          template.fitsInA4.threshold[2]
        );
        expect(template.recommendedCounts[3]).toBe(
          template.fitsInA4.threshold[3]
        );
      });
    });

    it('should have valid layout measurements', () => {
      Object.entries(PRINT_TEMPLATES).forEach(([_, template]) => {
        const { rowGap, colGap, fontSize, minProblemHeight } = template.layout;

        // 数値として解析可能であることを確認
        expect(parseInt(rowGap)).toBeGreaterThan(0);
        expect(parseInt(colGap)).toBeGreaterThan(0);
        expect(parseInt(fontSize)).toBeGreaterThan(0);
        expect(parseInt(minProblemHeight)).toBeGreaterThan(0);

        // 単位が'px'であることを確認
        expect(rowGap).toMatch(/^\d+px$/);
        expect(colGap).toMatch(/^\d+px$/);
        expect(fontSize).toMatch(/^\d+px$/);
        expect(minProblemHeight).toMatch(/^\d+px$/);
      });
    });
  });

  describe('Word Problem Specific Layout Tests', () => {
    it('should have ultra-compact spacing for word-en problems', () => {
      const wordEnTemplate = getPrintTemplate('word-en');
      const wordTemplate = getPrintTemplate('word');

      // word-enはwordよりもコンパクトであるべき
      expect(parseInt(wordEnTemplate.layout.rowGap)).toBeLessThan(
        parseInt(wordTemplate.layout.rowGap)
      );
      expect(parseInt(wordEnTemplate.layout.colGap)).toBeLessThan(
        parseInt(wordTemplate.layout.colGap)
      );
      expect(parseInt(wordEnTemplate.layout.minProblemHeight)).toBeLessThan(
        parseInt(wordTemplate.layout.minProblemHeight)
      );
    });

    it('should fit word-en 2-column 16 problems in A4 comfortably', () => {
      const stats = computeLayoutStats('word-en', 2, 16);

      expect(stats.totalHeightPx).toBeLessThanOrEqual(A4_HEIGHT_PX);

      console.log(
        `word-en 2列16問: ${stats.totalHeightPx.toFixed(1)}px ` +
          `(上下余白: ${stats.topMarginMm.toFixed(2)}mm / ${stats.bottomMarginMm.toFixed(2)}mm)`
      );

      expect(stats.bottomMarginMm).toBeGreaterThanOrEqual(50);
    });
  });

  describe('Hissan (Vertical Calculation) Layout Tests', () => {
    it('should have larger minimum height for hissan problems', () => {
      const hissanTemplate = getPrintTemplate('hissan');
      const basicTemplate = getPrintTemplate('basic');

      // 筆算は基本計算よりも高さが必要
      expect(parseInt(hissanTemplate.layout.minProblemHeight)).toBeGreaterThan(
        parseInt(basicTemplate.layout.minProblemHeight)
      );

      // 筆算の最小高さは100px以上
      expect(parseInt(hissanTemplate.layout.minProblemHeight)).toBeGreaterThanOrEqual(
        100
      );
    });

    it('should fit hissan recommended counts in A4', () => {
      const hissanTemplate = getPrintTemplate('hissan');

      ([1, 2, 3] as const).forEach((layoutColumns) => {
        const recommendedCount = hissanTemplate.recommendedCounts[layoutColumns];
        const stats = computeLayoutStats('hissan', layoutColumns, recommendedCount);

        expect(stats.totalHeightPx).toBeLessThanOrEqual(A4_HEIGHT_PX);
        expect(stats.topMarginMm).toBeGreaterThanOrEqual(MIN_MARGIN_MM);
        expect(stats.bottomMarginMm).toBeGreaterThanOrEqual(MIN_MARGIN_MM);
      });
    });
  });

  describe('Edge Case Tests', () => {
    it('should handle 1 problem per column correctly', () => {
      const template = getPrintTemplate('basic');
      const stats = computeLayoutStats('basic', 1, 1);

      const minProblemHeightMm = pxToMm(parseInt(template.layout.minProblemHeight));
      const rowGapMm = pxToMm(parseInt(template.layout.rowGap));
      const expectedContentMm = HEADER_HEIGHT_MM + minProblemHeightMm + rowGapMm;

      expect(stats.contentHeightMm).toBeCloseTo(expectedContentMm, 3);
    });

    it('should handle maximum recommended counts', () => {
      Object.entries(PRINT_TEMPLATES).forEach(([type, template]) => {
        ([1, 2, 3] as const).forEach((layoutColumns) => {
          const maxRecommended = template.recommendedCounts[layoutColumns];
          const stats = computeLayoutStats(
            type as ProblemType,
            layoutColumns,
            maxRecommended
          );

          expect(stats.totalHeightPx).toBeLessThanOrEqual(
            A4_HEIGHT_PX + mmToPx(2)
          );
        });
      });
    });
  });
});
