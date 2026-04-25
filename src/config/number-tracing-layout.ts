/**
 * 数字なぞり書きレイアウトの共通定数。
 * プレビュー描画とテンプレート推定で同じ値を使い、乖離を防ぐ。
 */

/** 左右2カラム時にA4幅へ収めるためのセル高さ */
export const NUMBER_TRACING_CELL_HEIGHT_PX = 70;

/** 数字ブロック間の縦ギャップ（複数の数字の間） */
export const NUMBER_TRACING_ROW_GAP_PX = 8;

/** 列間（左右カラム間） */
export const NUMBER_TRACING_COL_GAP_PX = 24;

/**
 * 1問（1つの数字ブロック）の見かけ高さ。
 * 2行構成（1行目: お手本+なぞる+練習 / 2行目: 追加練習）。
 * 内訳: 2行 × (cellHeight 70 + ラベル枠 11 + border/padding 6) + 内部 rowGap 8 ≒ 182px
 */
export const NUMBER_TRACING_MIN_PROBLEM_HEIGHT_PX = 182;
