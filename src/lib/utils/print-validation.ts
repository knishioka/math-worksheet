import type { Problem, LayoutColumns } from '../../types';

/**
 * 印刷レイアウト検証ユーティリティ
 * A4サイズ（210mm × 297mm）での印刷可能性をチェック
 */

// A4サイズの定義（mm単位）
const A4_HEIGHT = 297;

// 余白設定（mm単位）
const MARGIN_TOP = 20;
const MARGIN_BOTTOM = 20;

// ヘッダー・フッターの高さ（mm単位）
const HEADER_HEIGHT = 20;
const FOOTER_HEIGHT = 20;

// 利用可能な印刷領域
const AVAILABLE_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM - HEADER_HEIGHT - FOOTER_HEIGHT;

// 問題タイプ別の高さ（mm単位）- 実測値に基づく推定
const PROBLEM_HEIGHTS = {
  basic: 15, // 基本問題（整数）
  fraction: 25, // 分数
  decimal: 15, // 小数
  mixed: 30, // 帯分数
  word: 40, // 文章問題
  hissan: 60, // 筆算（大きなスペースが必要）
};

// 行間のギャップ（mm単位）
const ROW_GAP_NORMAL = 5;
const ROW_GAP_HISSAN = 10; // 筆算の場合は広めに

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  recommendations: string[];
  estimatedHeight: number;
  maxAllowedHeight: number;
}

/**
 * 問題の主要タイプを検出
 */
function detectPrimaryProblemType(problems: Problem[]): keyof typeof PROBLEM_HEIGHTS {
  if (problems.length === 0) return 'basic';

  const typeCounts = problems.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 筆算が1つでもあれば筆算として扱う（最も高さが必要なため）
  if (typeCounts['hissan'] > 0) return 'hissan';

  // 最も多いタイプを返す
  const entries = Object.entries(typeCounts);
  if (entries.length === 0) return 'basic';

  const primaryType = entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  // PROBLEM_HEIGHTSに存在するタイプかチェック
  if (primaryType in PROBLEM_HEIGHTS) {
    return primaryType as keyof typeof PROBLEM_HEIGHTS;
  }

  return 'basic';
}

/**
 * 印刷レイアウトの検証
 */
export function validatePrintLayout(
  problems: Problem[],
  layoutColumns: LayoutColumns
): ValidationResult {
  const warnings: string[] = [];
  const recommendations: string[] = [];

  if (problems.length === 0) {
    return {
      isValid: true,
      warnings: [],
      recommendations: [],
      estimatedHeight: 0,
      maxAllowedHeight: AVAILABLE_HEIGHT,
    };
  }

  // 問題タイプを検出
  const primaryType = detectPrimaryProblemType(problems);
  const problemHeight = PROBLEM_HEIGHTS[primaryType];
  const rowGap = primaryType === 'hissan' ? ROW_GAP_HISSAN : ROW_GAP_NORMAL;

  // 行数を計算
  const rowCount = Math.ceil(problems.length / layoutColumns);

  // 推定高さを計算（mm単位）
  const estimatedHeight = rowCount * problemHeight + (rowCount - 1) * rowGap;

  // 検証結果
  const isValid = estimatedHeight <= AVAILABLE_HEIGHT;

  // 警告とレコメンデーション
  if (!isValid) {
    const overflowMm = estimatedHeight - AVAILABLE_HEIGHT;
    warnings.push(
      `印刷時にページをはみ出る可能性があります（約${Math.round(overflowMm)}mm超過）`
    );

    // 推奨設定を計算
    const maxProblemsPerColumn = Math.floor(
      (AVAILABLE_HEIGHT + rowGap) / (problemHeight + rowGap)
    );

    if (layoutColumns === 1) {
      // 1列の場合は列数を増やすことを推奨
      const recommendedColumns = Math.ceil(problems.length / maxProblemsPerColumn) as LayoutColumns;
      if (recommendedColumns <= 3) {
        recommendations.push(
          `列数を${recommendedColumns}列に増やすことをおすすめします`
        );
      } else {
        // 3列でも収まらない場合は問題数を減らす
        const maxProblems = maxProblemsPerColumn * 3;
        recommendations.push(
          `問題数を${maxProblems}問以下に減らすことをおすすめします`
        );
      }
    } else {
      // 複数列の場合は問題数を減らすことを推奨
      const maxProblems = maxProblemsPerColumn * layoutColumns;
      recommendations.push(
        `問題数を${maxProblems}問以下に減らすことをおすすめします`
      );

      // または列数を増やす（3列まで）
      if (layoutColumns < 3) {
        const recommendedColumns = Math.min(
          3,
          Math.ceil(problems.length / maxProblemsPerColumn)
        ) as LayoutColumns;
        recommendations.push(
          `または、列数を${recommendedColumns}列に増やしてください`
        );
      }
    }
  }

  // 筆算の特別な警告
  if (primaryType === 'hissan') {
    const hissanCount = problems.filter(p => p.type === 'hissan').length;
    const maxHissanProblems = Math.floor(AVAILABLE_HEIGHT / (PROBLEM_HEIGHTS.hissan + ROW_GAP_HISSAN)) * layoutColumns;

    if (hissanCount > maxHissanProblems) {
      warnings.push(
        `筆算問題は上下に大きなスペースが必要です（現在${hissanCount}問）`
      );
    }

    if (layoutColumns === 3 && hissanCount > 6) {
      warnings.push(
        '筆算問題を3列で配置すると横幅が狭くなります。2列以下を推奨します'
      );
    }
  }

  return {
    isValid,
    warnings,
    recommendations,
    estimatedHeight,
    maxAllowedHeight: AVAILABLE_HEIGHT,
  };
}

/**
 * 問題数とレイアウトから推奨設定を取得
 */
export function getRecommendedLayout(
  problemCount: number,
  problemType: keyof typeof PROBLEM_HEIGHTS = 'basic'
): { columns: LayoutColumns; maxProblems: number } {
  const problemHeight = PROBLEM_HEIGHTS[problemType];
  const rowGap = problemType === 'hissan' ? ROW_GAP_HISSAN : ROW_GAP_NORMAL;

  // 1列あたりの最大問題数
  const maxProblemsPerColumn = Math.floor(
    (AVAILABLE_HEIGHT + rowGap) / (problemHeight + rowGap)
  );

  // 必要な列数を計算
  let columns: LayoutColumns = 1;
  if (problemCount > maxProblemsPerColumn) {
    columns = Math.min(3, Math.ceil(problemCount / maxProblemsPerColumn)) as LayoutColumns;
  }

  // 推奨最大問題数
  const maxProblems = maxProblemsPerColumn * columns;

  return { columns, maxProblems };
}
