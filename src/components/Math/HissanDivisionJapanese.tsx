import React from 'react';

/**
 * 日本式わり算筆算（長除法）コンポーネント
 *
 * SVGで括弧と横線を一体的に描画し、自然な見た目を実現
 *
 * 形式:
 *          ＿＿＿＿
 *     3 ）  7 2
 */

interface HissanDivisionJapaneseProps {
  dividend: number;
  divisor: number;
  quotient?: number;
  remainder?: number;
  showAnswer?: boolean;
  className?: string;
}

/**
 * SVGで）と横線を一体的に描画するコンポーネント
 */
const DivisionBracket: React.FC<{
  width: number;  // 横線の幅（px）
  height: number; // 全体の高さ（px）
}> = ({ width, height }) => {
  // 括弧部分の幅
  const bracketWidth = 16;
  // 横線の太さ
  const strokeWidth = 2;
  // 全体の幅
  const totalWidth = bracketWidth + width;

  // SVGパス: ）の曲線 + 横線
  // 下から上に曲線を描き、そこから右に横線を引く
  const path = `
    M 4 ${height - 4}
    Q ${bracketWidth + 2} ${height / 2} 4 4
    L ${totalWidth - 2} 4
  `;

  return (
    <svg
      width={totalWidth}
      height={height}
      viewBox={`0 0 ${totalWidth} ${height}`}
      style={{ display: 'block', overflow: 'visible' }}
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HissanDivisionJapanese: React.FC<HissanDivisionJapaneseProps> = ({
  dividend,
  divisor,
  quotient,
  remainder,
  showAnswer = false,
  className = '',
}) => {
  const dividendStr = dividend.toString();
  const quotientStr = quotient?.toString() || '';
  const paddedQuotient = quotientStr.padStart(dividendStr.length, ' ');

  // サイズ計算
  const fontSize = 24;
  const digitWidth = fontSize * 0.9; // 1文字の幅（px）
  const dividendWidthPx = dividendStr.length * digitWidth;
  const bracketHeight = fontSize * 1.8;

  return (
    <div
      className={`inline-block font-mono ${className}`}
      style={{ fontSize: `${fontSize}px`, lineHeight: 1.3 }}
    >
      {/* メインレイアウト: 除数 | SVG括弧+横線の上に商、下に被除数 */}
      <div className="flex items-start">
        {/* 除数 */}
        <div
          className="flex-shrink-0 flex items-center justify-end"
          style={{
            height: `${bracketHeight}px`,
            paddingRight: '2px',
            paddingTop: `${fontSize * 0.3}px`,
          }}
        >
          {divisor}
        </div>

        {/* 括弧 + 数字エリア */}
        <div className="relative">
          {/* SVG括弧（）と横線 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
            }}
          >
            <DivisionBracket
              width={dividendWidthPx + 10}
              height={bracketHeight}
            />
          </div>

          {/* 商（横線の上） */}
          <div
            style={{
              height: `${fontSize * 0.3}px`,
              paddingLeft: '20px',
              display: 'flex',
              alignItems: 'flex-end',
            }}
          >
            {showAnswer && quotient !== undefined ? (
              <span className="text-red-600 font-bold">
                {paddedQuotient.split('').map((char, i) => (
                  <span
                    key={i}
                    className="inline-block text-center"
                    style={{ width: `${digitWidth}px` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </span>
            ) : null}
          </div>

          {/* 被除数（横線の下） */}
          <div
            style={{
              paddingLeft: '20px',
              paddingTop: '2px',
            }}
          >
            {dividendStr.split('').map((digit, i) => (
              <span
                key={i}
                className="inline-block text-center"
                style={{ width: `${digitWidth}px` }}
              >
                {digit}
              </span>
            ))}
          </div>

          {/* 計算書き込みスペース */}
          <div
            style={{
              minHeight: '65px',
              minWidth: `${dividendWidthPx + 20}px`,
              paddingLeft: '20px',
            }}
          />
        </div>
      </div>

      {/* 余り表示 */}
      {showAnswer && remainder !== undefined && remainder > 0 && (
        <div
          className="text-red-600 font-bold"
          style={{
            fontSize: '14px',
            marginLeft: `${divisor.toString().length * digitWidth + 30}px`,
            marginTop: '-50px',
          }}
        >
          あまり {remainder}
        </div>
      )}
    </div>
  );
};

export default HissanDivisionJapanese;
