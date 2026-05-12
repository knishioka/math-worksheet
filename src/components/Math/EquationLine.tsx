import React from 'react';
import {
  wordProblemAnswerLabelStyle,
  wordProblemEquationRowStyle,
  wordProblemEquationUnderlineStyle,
} from '../../config/styles';

interface EquationLineProps {
  label: string;
  labelFontSize?: string;
  labelColor?: string;
  minWidth?: string;
}

/**
 * 文章問題用の式記入行を表示する共通コンポーネント
 * 日本語文章問題、英語文章問題、シンガポール式問題で共有利用する
 */
export const EquationLine: React.FC<EquationLineProps> = ({
  label,
  labelFontSize,
  labelColor,
  minWidth,
}) => (
  <div style={wordProblemEquationRowStyle}>
    <span
      style={{
        ...wordProblemAnswerLabelStyle,
        ...(labelColor !== undefined ? { color: labelColor } : {}),
        ...(labelFontSize !== undefined ? { fontSize: labelFontSize } : {}),
      }}
    >
      {label}
    </span>
    <span
      style={{
        ...wordProblemEquationUnderlineStyle,
        ...(minWidth !== undefined ? { minWidth } : {}),
      }}
    />
  </div>
);
