/**
 * 印刷プリント用スタイル定数
 * ProblemList.tsxで使用されるインラインスタイルを一元管理
 */

import type { CSSProperties } from 'react';

// ===== A4用紙の定数 =====
export const A4_DIMENSIONS = {
  width: '210mm',
  height: '297mm',
  widthMm: 210,
  heightMm: 297,
} as const;

// ===== 余白設定 =====
export const MARGINS = {
  top: 15, // mm
  side: 15, // mm
  bottom: 7.5, // mm
  minTop: 5, // mm
  maxTop: 15, // mm
} as const;

// ===== フォントサイズ =====
export const FONT_SIZES = {
  problemNumber: '12px',
  problemText: '18px',
  wordProblemText: '12px',
  headerText: '14px',
  unit: '14px',
} as const;

// ===== 色定数 =====
export const COLORS = {
  // テキスト
  textGray: '#666',
  textBlack: '#000',
  textRed: 'red',
  textDarkRed: '#991b1b',
  // ボーダー
  borderBlack: 'black',
  borderGray: '#ccc',
  borderRed: '#ef4444',
  // 背景
  bgWhite: '#fff',
  bgGray: '#f9f9f9',
  bgLightGray: '#f3f4f6',
  bgAlertRed: '#fef2f2',
  // 警告
  warningRed: '#dc2626',
  warningBorder: '#ef4444',
} as const;

// ===== スペーシング =====
export const SPACING = {
  gap: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
  margin: {
    small: '4px',
    medium: '10px',
    large: '16px',
  },
  padding: {
    small: '4px',
    medium: '12px',
    large: '16px',
  },
} as const;

// ===== ボーダースタイル =====
export const BORDERS = {
  standard: '1px solid black',
  gray: '1px solid #ccc',
  red: '1px solid red',
  thick: '2px solid black',
  box: '1.5px solid #333',
  alert: '2px solid #ef4444',
  alertThick: '3px solid #ef4444',
} as const;

// ===== 筆算スタイル =====
export const HISSAN_STYLES = {
  cellWidth: '30px',
  cellHeight: '30px',
  fontSize: '18px',
  lineHeight: '1.2',
  fontFamily: "'Courier New', monospace",
  borderWidth: '2px',
} as const;

// ===== 共通コンポーネントスタイル =====

/**
 * A4用紙のコンテナスタイル
 */
export const getA4ContainerStyle = (
  padding: string,
  printMode: boolean,
  hasError: boolean = false
): CSSProperties => ({
  width: A4_DIMENSIONS.width,
  minHeight: A4_DIMENSIONS.height,
  padding,
  boxSizing: 'border-box',
  boxShadow: printMode
    ? 'none'
    : '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 0, 0, 0.05)',
  border: !printMode && hasError ? BORDERS.alertThick : 'none',
});

/**
 * 空のA4コンテナスタイル（問題未生成時）
 */
export const emptyA4ContainerStyle: CSSProperties = {
  width: A4_DIMENSIONS.width,
  minHeight: A4_DIMENSIONS.height,
  padding: `${MARGINS.top}mm ${MARGINS.side}mm ${MARGINS.bottom}mm`,
  boxSizing: 'border-box',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 0, 0, 0.05)',
};

/**
 * ヘッダーボーダースタイル
 */
export const headerBorderStyle: CSSProperties = {
  borderBottom: BORDERS.gray,
  paddingBottom: SPACING.padding.medium,
  marginBottom: SPACING.margin.large,
};

/**
 * ヘッダーグリッドスタイル
 */
export const headerGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  gap: SPACING.gap.large,
  marginBottom: SPACING.margin.medium,
};

/**
 * 問題番号スタイル
 */
export const problemNumberStyle: CSSProperties = {
  fontSize: FONT_SIZES.problemNumber,
  color: COLORS.textGray,
};

/**
 * 問題アイテムスタイル
 */
export const problemItemStyle: CSSProperties = {
  marginBottom: SPACING.margin.large,
};

/**
 * 英語文章問題の問題番号スタイル
 */
export const wordEnNumberStyle: CSSProperties = {
  fontSize: FONT_SIZES.problemNumber,
  color: COLORS.textGray,
  flexShrink: 0,
};

/**
 * 名前・点数入力用下線スタイル
 */
export const getUnderlineStyle = (width: string): CSSProperties => ({
  display: 'inline-block',
  width,
  borderBottom: BORDERS.standard,
  marginLeft: SPACING.margin.small,
});

/**
 * 答え用の下線スタイル
 */
export const answerUnderlineStyle: CSSProperties = {
  display: 'inline-block',
  width: '64px',
  borderBottom: BORDERS.standard,
  marginLeft: SPACING.margin.small,
};

/**
 * 分数用の答え下線（広め）
 */
export const fractionAnswerUnderlineStyle: CSSProperties = {
  display: 'inline-block',
  width: '64px',
  borderBottom: BORDERS.standard,
  marginLeft: SPACING.margin.small,
};

/**
 * 文章問題用の答え下線（さらに広め）
 */
export const wordProblemAnswerUnderlineStyle: CSSProperties = {
  display: 'inline-block',
  width: '96px',
  borderBottom: BORDERS.standard,
  margin: '0 4px',
};

/**
 * 答え表示スタイル（赤字・太字）
 */
export const answerDisplayStyle: CSSProperties = {
  color: COLORS.textRed,
  fontWeight: 'bold',
};

/**
 * 虫食い算の空欄ボックススタイル
 */
export const missingNumberBoxStyle: CSSProperties = {
  display: 'inline-block',
  width: '24px',
  height: '24px',
  border: BORDERS.box,
  backgroundColor: COLORS.bgGray,
  verticalAlign: 'text-bottom',
};

/**
 * 筆算の数字セルスタイル
 */
export const hissanCellStyle: CSSProperties = {
  display: 'inline-block',
  width: HISSAN_STYLES.cellWidth,
  textAlign: 'center',
};

/**
 * 筆算の答え用空欄ボックススタイル
 */
export const hissanAnswerBoxStyle: CSSProperties = {
  display: 'inline-block',
  width: HISSAN_STYLES.cellWidth,
  height: HISSAN_STYLES.cellHeight,
  border: BORDERS.gray,
  margin: '0 2px',
};

/**
 * 筆算のコンテナスタイル
 */
export const hissanContainerStyle: CSSProperties = {
  fontFamily: HISSAN_STYLES.fontFamily,
  fontSize: HISSAN_STYLES.fontSize,
  display: 'inline-block',
  textAlign: 'right',
  lineHeight: HISSAN_STYLES.lineHeight,
  margin: `${SPACING.margin.medium} 0`,
};

/**
 * 筆算の横線スタイル
 */
export const getHissanLineStyle = (maxLength: number): CSSProperties => ({
  borderTop: BORDERS.thick,
  margin: '2px 0',
  width: `${maxLength * 30 + 30}px`,
});

/**
 * 分数の分子スタイル
 */
export const fractionNumeratorStyle: CSSProperties = {
  display: 'block',
  borderBottom: BORDERS.standard,
  padding: '0 4px',
};

/**
 * 分数の分母スタイル
 */
export const fractionDenominatorStyle: CSSProperties = {
  display: 'block',
  padding: '0 4px',
};

/**
 * 分数のコンテナスタイル
 */
export const fractionContainerStyle: CSSProperties = {
  display: 'inline-block',
  textAlign: 'center',
  verticalAlign: 'middle',
};

/**
 * 分数の答え（赤字）の分子スタイル
 */
export const fractionAnswerNumeratorStyle: CSSProperties = {
  display: 'block',
  borderBottom: BORDERS.red,
  padding: '0 4px',
};

/**
 * 問題テキストスタイル
 */
export const problemTextStyle: CSSProperties = {
  fontFamily: 'monospace',
  fontSize: FONT_SIZES.problemText,
  marginTop: SPACING.margin.small,
};

/**
 * 文章問題のテキストスタイル
 */
export const wordProblemTextStyle: CSSProperties = {
  fontSize: FONT_SIZES.wordProblemText,
  lineHeight: '1.3',
};

// ===== A4オーバーフロー警告スタイル =====

/**
 * A4オーバーフロー警告のコンテナスタイル
 */
export const a4WarningContainerStyle: CSSProperties = {
  backgroundColor: COLORS.bgAlertRed,
  border: BORDERS.alert,
  borderRadius: '8px',
  padding: '12px 16px',
  marginBottom: SPACING.margin.large,
  maxWidth: A4_DIMENSIONS.width,
  width: '100%',
  boxSizing: 'border-box',
};

/**
 * A4警告のアイコン行スタイル
 */
export const a4WarningIconRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.gap.medium,
};

/**
 * A4警告のタイトルスタイル
 */
export const a4WarningTitleStyle: CSSProperties = {
  color: COLORS.warningRed,
  fontWeight: 'bold',
  fontSize: FONT_SIZES.headerText,
};

/**
 * A4警告のメッセージスタイル
 */
export const a4WarningMessageStyle: CSSProperties = {
  color: COLORS.textDarkRed,
  fontSize: FONT_SIZES.problemNumber,
  marginTop: SPACING.margin.small,
};

/**
 * ヘッダーのテキストスタイル
 */
export const headerTextStyle: CSSProperties = {
  fontSize: FONT_SIZES.headerText,
};

/**
 * ヘッダーの中央テキストスタイル
 */
export const headerCenterTextStyle: CSSProperties = {
  fontSize: FONT_SIZES.headerText,
  textAlign: 'center',
};

/**
 * ヘッダーの右寄せテキストスタイル
 */
export const headerRightTextStyle: CSSProperties = {
  fontSize: FONT_SIZES.headerText,
  textAlign: 'right',
};
