/**
 * 印刷プレビュー検証ユーティリティ
 *
 * 印刷時の問題を自動検出するヘルパー関数
 */

import type { ProblemType, LayoutColumns } from '../../types';
import { getPrintTemplate } from '../../config/print-templates';

/**
 * 生成されたHTMLから問題番号をカウントする
 *
 * @param html - 印刷用のHTML文字列
 * @returns 検出された問題数
 *
 * @example
 * ```ts
 * const html = printContainer.innerHTML;
 * const count = countProblemsInHTML(html);
 * console.log(`検出された問題数: ${count}`);
 * ```
 */
export function countProblemsInHTML(html: string): number {
  // 問題番号のパターン: (1), (2), ... (N)
  const problemNumberPattern = /\((\d+)\)/g;
  const matches = html.match(problemNumberPattern);
  return matches ? matches.length : 0;
}

/**
 * 各問題タイプが正しく表示されているか確認
 *
 * @param html - 印刷用のHTML文字列
 * @param problemType - 確認する問題タイプ
 * @returns 正しく表示されている場合true
 *
 * @example
 * ```ts
 * const html = printContainer.innerHTML;
 * const isValid = validateProblemType(html, 'fraction');
 * if (!isValid) {
 *   console.error('分数問題が正しく表示されていません');
 * }
 * ```
 */
export function validateProblemType(html: string, problemType: ProblemType): boolean {
  switch (problemType) {
    case 'fraction':
      // MathMLの分数タグを確認
      return html.includes('<mfrac>') && html.includes('</mfrac>');

    case 'decimal':
      // MathMLの数値タグを確認（小数は<mn>で表示）
      return html.includes('<mn>') && /\d+\.\d+/.test(html);

    case 'mixed':
      // MathMLの帯分数タグを確認
      return html.includes('<mrow>') && html.includes('<mfrac>');

    case 'word':
      // 日本語文章問題
      return html.includes('答え:');

    case 'word-en':
      // 英語文章問題
      return html.includes('Answer:');

    case 'hissan':
      // 筆算の横線を確認
      return html.includes('border-top: 2px solid black');

    case 'basic':
      // 基本問題（演算子記号を確認）
      return /[+−×÷]/.test(html);

    default:
      return false;
  }
}

/**
 * A4サイズに収まるか推定する
 *
 * @param problemCount - 問題数
 * @param layoutColumns - 列数
 * @param problemType - 問題タイプ
 * @returns { fits, estimatedHeight, a4Height }
 *
 * @example
 * ```ts
 * const result = estimateA4Fit(20, 2, 'basic');
 * if (!result.fits) {
 *   console.warn(`A4からはみ出る可能性があります: ${result.estimatedHeight}mm > ${result.a4Height}mm`);
 * }
 * ```
 */
export function estimateA4Fit(
  problemCount: number,
  layoutColumns: LayoutColumns,
  problemType: ProblemType
): { fits: boolean; estimatedHeight: number; a4Height: number } {
  const template = getPrintTemplate(problemType);
  const rowCount = Math.ceil(problemCount / layoutColumns);

  // 問題タイプごとの推定高さ（mm）
  const minProblemHeightMm = parseInt(template.layout.minProblemHeight) * 0.26; // px to mm (96dpi)
  const rowGapMm = parseInt(template.layout.rowGap) * 0.26;

  // 必要な高さを計算
  const headerHeight = 25; // ヘッダー部分の高さ (mm)
  const verticalMarginMin = 5; // 最小余白 (mm)

  const contentHeight = headerHeight + (minProblemHeightMm + rowGapMm) * rowCount;
  const estimatedHeight = contentHeight + verticalMarginMin * 2;

  const a4Height = 297; // A4の高さ (mm)
  const fits = estimatedHeight <= a4Height;

  return { fits, estimatedHeight, a4Height };
}

/**
 * 印刷プレビューの総合検証
 *
 * @param html - 印刷用のHTML文字列
 * @param expectedProblems - 期待される問題数
 * @param problemType - 問題タイプ
 * @param layoutColumns - 列数
 * @returns 検証結果
 *
 * @example
 * ```ts
 * const html = printContainer.innerHTML;
 * const result = validatePrintPreview(html, 20, 'basic', 2);
 *
 * if (!result.isValid) {
 *   console.error('印刷プレビューに問題があります:');
 *   result.errors.forEach(error => console.error(`- ${error}`));
 * }
 * ```
 */
export function validatePrintPreview(
  html: string,
  expectedProblems: number,
  problemType: ProblemType,
  layoutColumns: LayoutColumns
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  problemCount: number;
  a4Fit: ReturnType<typeof estimateA4Fit>;
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 問題数の確認
  const problemCount = countProblemsInHTML(html);
  if (problemCount !== expectedProblems) {
    errors.push(
      `問題数の不一致: 期待=${expectedProblems}, 実際=${problemCount}, 欠損=${expectedProblems - problemCount}`
    );
  }

  // 問題タイプの表示確認
  const isTypeValid = validateProblemType(html, problemType);
  if (!isTypeValid) {
    errors.push(`問題タイプ "${problemType}" が正しく表示されていません`);
  }

  // A4サイズ確認
  const a4Fit = estimateA4Fit(expectedProblems, layoutColumns, problemType);
  if (!a4Fit.fits) {
    warnings.push(
      `A4サイズを超える可能性があります: ${a4Fit.estimatedHeight.toFixed(0)}mm > ${a4Fit.a4Height}mm`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    problemCount,
    a4Fit,
  };
}
