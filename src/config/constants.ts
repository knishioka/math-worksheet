/**
 * アプリケーション設定の集約
 * 環境変数から設定値を読み込み、デフォルト値を提供
 */

/**
 * アプリケーションのタイトル
 */
export const APP_TITLE =
  import.meta.env.VITE_APP_TITLE || '計算プリント自動作成サービス';

/**
 * デフォルトの問題数
 */
export const DEFAULT_PROBLEM_COUNT = Number(
  import.meta.env.VITE_DEFAULT_PROBLEM_COUNT || 30
);

/**
 * デフォルトのレイアウト列数
 */
export const DEFAULT_LAYOUT_COLUMNS = Number(
  import.meta.env.VITE_DEFAULT_LAYOUT_COLUMNS || 3
) as 1 | 2 | 3;

/**
 * PDF出力機能の有効/無効
 */
export const ENABLE_PDF_EXPORT =
  import.meta.env.VITE_ENABLE_PDF_EXPORT === 'true';

/**
 * アナリティクス機能の有効/無効
 */
export const ENABLE_ANALYTICS =
  import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

/**
 * アプリケーション設定のオブジェクト
 */
export const APP_CONFIG = {
  title: APP_TITLE,
  defaultProblemCount: DEFAULT_PROBLEM_COUNT,
  defaultLayoutColumns: DEFAULT_LAYOUT_COLUMNS,
  features: {
    pdfExport: ENABLE_PDF_EXPORT,
    analytics: ENABLE_ANALYTICS,
  },
} as const;
