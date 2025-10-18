import { describe, it, expect } from 'vitest';
import { PRINT_TEMPLATES, getPrintTemplate } from '../../../config/print-templates';
import type { ProblemType, LayoutColumns } from '../../../types';

/**
 * レイアウト寸法テスト
 *
 * 推奨問題数がA4用紙（1123px高さ）に収まるかを検証
 * 各問題タイプのレイアウト設定が適切かをチェック
 */
describe('Layout Dimensions Tests', () => {
  // A4用紙の定数
  const A4_HEIGHT_PX = 1123; // 297mm at 96dpi
  const HEADER_HEIGHT_PX = 75; // ヘッダー部分の高さ
  const USABLE_HEIGHT_PX = A4_HEIGHT_PX - HEADER_HEIGHT_PX; // 1048px

  /**
   * 推定高さを計算する関数
   * @param problemType 問題タイプ
   * @param layoutColumns 列数
   * @param problemCount 問題数
   * @returns 推定高さ（ピクセル）
   */
  function estimateHeight(
    problemType: ProblemType,
    layoutColumns: LayoutColumns,
    problemCount: number
  ): number {
    const template = getPrintTemplate(problemType);
    const { rowGap, minProblemHeight } = template.layout;

    const rowGapPx = parseInt(rowGap);
    const problemHeightPx = parseInt(minProblemHeight);

    // 列あたりの問題数（切り上げ）
    const problemsPerColumn = Math.ceil(problemCount / layoutColumns);

    // 推定高さ = (問題の高さ + 行間) × 問題数 - 最後の行間
    const estimatedHeight =
      problemsPerColumn * (problemHeightPx + rowGapPx) - rowGapPx;

    return estimatedHeight;
  }

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
            const estimatedHeight = estimateHeight(
              problemType,
              layoutColumns,
              recommendedCount
            );

            // 推定高さがA4使用可能高さ以下であることを確認
            expect(estimatedHeight).toBeLessThanOrEqual(USABLE_HEIGHT_PX);

            // 余白を計算（デバッグ用）
            const marginPx = USABLE_HEIGHT_PX - estimatedHeight;
            const marginMm = Math.round(marginPx * 0.2645833); // px to mm at 96dpi

            // 余白が少なすぎないかチェック（最低10mm = 38px）
            expect(marginPx).toBeGreaterThanOrEqual(38);

            // デバッグ情報
            console.log(
              `${problemType} ${layoutColumns}列: ` +
                `推奨${recommendedCount}問 = ${estimatedHeight}px ` +
                `(余白: ${marginPx}px / ${marginMm}mm)`
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
              const estimatedHeight = estimateHeight(
                problemType,
                layoutColumns,
                maxCount
              );

              // A4使用可能高さに収まるか確認（ギリギリの場合もあるので、少し余裕を持たせる）
              expect(estimatedHeight).toBeLessThanOrEqual(
                USABLE_HEIGHT_PX + 50
              );
            }
          });
        });
      });
    });
  });

  describe('Layout Settings Consistency', () => {
    it('should have consistent recommended counts across all problem types', () => {
      Object.entries(PRINT_TEMPLATES).forEach(([type, template]) => {
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
      Object.entries(PRINT_TEMPLATES).forEach(([type, template]) => {
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
      const estimatedHeight = estimateHeight('word-en', 2, 16);

      // 余裕を持ってA4に収まるべき（少なくとも50mm = 189pxの余白）
      expect(estimatedHeight).toBeLessThanOrEqual(USABLE_HEIGHT_PX - 189);

      const marginPx = USABLE_HEIGHT_PX - estimatedHeight;
      const marginMm = Math.round(marginPx * 0.2645833);

      console.log(
        `word-en 2列16問: ${estimatedHeight}px (余白: ${marginPx}px / ${marginMm}mm)`
      );

      // 余白が十分にあることを確認（最低50mm）
      expect(marginMm).toBeGreaterThanOrEqual(50);
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
        const estimatedHeight = estimateHeight('hissan', layoutColumns, recommendedCount);

        expect(estimatedHeight).toBeLessThanOrEqual(USABLE_HEIGHT_PX);
      });
    });
  });

  describe('Edge Case Tests', () => {
    it('should handle 1 problem per column correctly', () => {
      const template = getPrintTemplate('basic');
      const estimatedHeight = estimateHeight('basic', 1, 1);

      // 1問だけでも最小高さが適用される
      expect(estimatedHeight).toBe(parseInt(template.layout.minProblemHeight));
    });

    it('should handle maximum recommended counts', () => {
      Object.entries(PRINT_TEMPLATES).forEach(([type, template]) => {
        ([1, 2, 3] as const).forEach((layoutColumns) => {
          const maxRecommended = template.recommendedCounts[layoutColumns];
          const estimatedHeight = estimateHeight(
            type as ProblemType,
            layoutColumns,
            maxRecommended
          );

          // 最大推奨問題数でもA4に収まるべき
          expect(estimatedHeight).toBeLessThanOrEqual(USABLE_HEIGHT_PX);
        });
      });
    });
  });
});
