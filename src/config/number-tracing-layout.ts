/**
 * 数字なぞり書きレイアウトの共通定数。
 * プレビュー描画とテンプレート推定で同じ値を使い、乖離を防ぐ。
 */

/** 左右2カラム時にA4幅へ収めるためのセル高さ */
export const NUMBER_TRACING_CELL_HEIGHT_PX = 70;

/** 行間 */
export const NUMBER_TRACING_ROW_GAP_PX = 12;

/** 列間（左右カラム間） */
export const NUMBER_TRACING_COL_GAP_PX = 24;

/**
 * 行の見かけ高さ。
 * cellHeight + border/padding(6px) + ラベル(9px) + ラベル間隔(2px) ≈ 90px
 */
export const NUMBER_TRACING_MIN_PROBLEM_HEIGHT_PX = 90;
