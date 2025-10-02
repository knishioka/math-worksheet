import React from 'react';

/**
 * 筆算表示コンポーネント
 * CSS Grid + 等幅フォントで精密な桁揃えを実現
 */

// 共通Props
interface BaseHissanProps {
  showCarry?: boolean; // 繰り上がり・繰り下がりを表示するか
  showAnswer?: boolean; // 答えを表示するか
  className?: string;
}

// たし算の筆算
interface HissanAdditionProps extends BaseHissanProps {
  operand1: number;
  operand2: number;
  answer?: number;
}

export const HissanAddition: React.FC<HissanAdditionProps> = ({
  operand1,
  operand2,
  answer,
  showCarry = false,
  showAnswer = false,
  className = '',
}) => {
  // 数字を配列に分解
  const digits1 = operand1.toString().split('').map(Number);
  const digits2 = operand2.toString().split('').map(Number);
  const maxLength = Math.max(digits1.length, digits2.length);

  // パディング（右揃え用）
  const paddedDigits1 = Array(maxLength - digits1.length)
    .fill(null)
    .concat(digits1);
  const paddedDigits2 = Array(maxLength - digits2.length)
    .fill(null)
    .concat(digits2);

  // 繰り上がり計算
  const carries: (number | null)[] = [];
  if (showCarry) {
    let carry = 0;
    for (let i = maxLength - 1; i >= 0; i--) {
      const d1 = paddedDigits1[i] ?? 0;
      const d2 = paddedDigits2[i] ?? 0;
      const sum = d1 + d2 + carry;
      carries.unshift(sum >= 10 ? 1 : null);
      carry = sum >= 10 ? 1 : 0;
    }
    // 最上位の繰り上がり
    carries.unshift(carry > 0 ? carry : null);
  }

  // 答えの桁数（繰り上がりで1桁増える可能性）
  const answerLength = answer
    ? answer.toString().length
    : maxLength + (showCarry ? 1 : 0);
  const answerDigits = answer ? answer.toString().split('').map(Number) : [];
  const paddedAnswer = Array(answerLength - answerDigits.length)
    .fill(null)
    .concat(answerDigits);

  return (
    <div className={`hissan-container ${className}`}>
      {/* 繰り上がり行 */}
      {showCarry && (
        <div className="hissan-row carry-row">
          {carries.map((carry, i) => (
            <span key={i} className="hissan-digit carry">
              {carry || ''}
            </span>
          ))}
        </div>
      )}

      {/* 1つ目の数 */}
      <div className="hissan-row number-row">
        {showCarry && <span className="hissan-digit"></span>}
        {paddedDigits1.map((digit, i) => (
          <span key={i} className="hissan-digit">
            {digit === null ? '' : digit}
          </span>
        ))}
      </div>

      {/* 演算子と2つ目の数 */}
      <div className="hissan-row operator-row">
        <span className="hissan-operator">+</span>
        {paddedDigits2.map((digit, i) => (
          <span key={i} className="hissan-digit">
            {digit === null ? '' : digit}
          </span>
        ))}
      </div>

      {/* 横線 */}
      <div className="hissan-line" />

      {/* 答え */}
      <div className="hissan-row answer-row">
        {showAnswer ? (
          paddedAnswer.map((digit, i) => (
            <span key={i} className="hissan-digit answer">
              {digit === null ? '' : digit}
            </span>
          ))
        ) : (
          Array(answerLength)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="hissan-answer-box"></span>
            ))
        )}
      </div>
    </div>
  );
};

// ひき算の筆算
interface HissanSubtractionProps extends BaseHissanProps {
  operand1: number;
  operand2: number;
  answer?: number;
}

export const HissanSubtraction: React.FC<HissanSubtractionProps> = ({
  operand1,
  operand2,
  answer,
  showCarry = false,
  showAnswer = false,
  className = '',
}) => {
  const digits1 = operand1.toString().split('').map(Number);
  const digits2 = operand2.toString().split('').map(Number);
  const maxLength = Math.max(digits1.length, digits2.length);

  const paddedDigits1 = Array(maxLength - digits1.length)
    .fill(null)
    .concat(digits1);
  const paddedDigits2 = Array(maxLength - digits2.length)
    .fill(null)
    .concat(digits2);

  // 繰り下がり計算
  const borrows: (boolean | null)[] = [];
  if (showCarry) {
    let borrow = 0;
    const workingDigits = [...paddedDigits1];
    for (let i = maxLength - 1; i >= 0; i--) {
      const d1 = workingDigits[i] ?? 0;
      const d2 = paddedDigits2[i] ?? 0;
      const needsBorrow = d1 - borrow < d2;
      borrows.unshift(needsBorrow);
      if (needsBorrow && i > 0) {
        workingDigits[i - 1] = (workingDigits[i - 1] ?? 0) - 1;
      }
      borrow = needsBorrow ? 1 : 0;
    }
  }

  const answerDigits = answer ? answer.toString().split('').map(Number) : [];
  const paddedAnswer = Array(maxLength - answerDigits.length)
    .fill(null)
    .concat(answerDigits);

  return (
    <div className={`hissan-container ${className}`}>
      {/* 繰り下がり行 */}
      {showCarry && (
        <div className="hissan-row borrow-row">
          {borrows.map((borrow, i) => (
            <span key={i} className="hissan-digit borrow">
              {borrow ? '↓' : ''}
            </span>
          ))}
        </div>
      )}

      {/* 1つ目の数 */}
      <div className="hissan-row number-row">
        {paddedDigits1.map((digit, i) => (
          <span key={i} className="hissan-digit">
            {digit === null ? '' : digit}
          </span>
        ))}
      </div>

      {/* 演算子と2つ目の数 */}
      <div className="hissan-row operator-row">
        <span className="hissan-operator">−</span>
        {paddedDigits2.map((digit, i) => (
          <span key={i} className="hissan-digit">
            {digit === null ? '' : digit}
          </span>
        ))}
      </div>

      {/* 横線 */}
      <div className="hissan-line" />

      {/* 答え */}
      <div className="hissan-row answer-row">
        {showAnswer ? (
          paddedAnswer.map((digit, i) => (
            <span key={i} className="hissan-digit answer">
              {digit === null ? '' : digit}
            </span>
          ))
        ) : (
          Array(maxLength)
            .fill(null)
            .map((_, i) => (
              <span key={i} className="hissan-answer-box"></span>
            ))
        )}
      </div>
    </div>
  );
};

// かけ算の筆算
interface HissanMultiplicationProps extends BaseHissanProps {
  operand1: number;
  operand2: number;
  answer?: number;
  showPartialProducts?: boolean; // 部分積を表示するか
}

export const HissanMultiplication: React.FC<HissanMultiplicationProps> = ({
  operand1,
  operand2,
  answer,
  showPartialProducts = false,
  showAnswer = false,
  className = '',
}) => {
  const digits2 = operand2.toString().split('').map(Number);

  // 部分積の計算
  const partialProducts: number[] = [];
  if (showPartialProducts) {
    digits2.reverse().forEach((digit, index) => {
      const product = operand1 * digit * Math.pow(10, index);
      partialProducts.push(product);
    });
  }

  const maxLength = Math.max(
    operand1.toString().length,
    operand2.toString().length,
    ...(answer ? [answer.toString().length] : []),
    ...(showPartialProducts
      ? partialProducts.map((p) => p.toString().length)
      : [])
  );

  return (
    <div className={`hissan-container ${className}`}>
      {/* 1つ目の数 */}
      <div className="hissan-row number-row" style={{ textAlign: 'right' }}>
        <span>{operand1}</span>
      </div>

      {/* 演算子と2つ目の数 */}
      <div
        className="hissan-row operator-row"
        style={{ display: 'flex', justifyContent: 'flex-end' }}
      >
        <span className="hissan-operator">×</span>
        <span style={{ minWidth: '30px', textAlign: 'right' }}>
          {operand2}
        </span>
      </div>

      {/* 横線 */}
      <div className="hissan-line" />

      {/* 部分積 */}
      {showPartialProducts && (
        <>
          {partialProducts.map((product, i) => (
            <div
              key={i}
              className="hissan-row partial-product"
              style={{
                textAlign: 'right',
                paddingRight: `${i * 30}px`,
              }}
            >
              {product}
            </div>
          ))}
          <div className="hissan-line" />
        </>
      )}

      {/* 答え */}
      <div className="hissan-row answer-row" style={{ textAlign: 'right' }}>
        {showAnswer ? (
          <span className="answer">{answer}</span>
        ) : (
          <span
            className="hissan-answer-box"
            style={{ width: `${maxLength * 30}px` }}
          ></span>
        )}
      </div>
    </div>
  );
};

// わり算の筆算（シンプル版）
interface HissanDivisionProps extends BaseHissanProps {
  dividend: number; // 被除数
  divisor: number; // 除数
  quotient?: number; // 商
  remainder?: number; // 余り
}

export const HissanDivision: React.FC<HissanDivisionProps> = ({
  dividend,
  divisor,
  quotient,
  remainder,
  showAnswer = false,
  className = '',
}) => {
  return (
    <div className={`hissan-container hissan-division ${className}`}>
      {/* 商 */}
      <div className="division-quotient">
        {showAnswer && quotient !== undefined ? (
          <span className="answer">
            {quotient}
            {remainder !== undefined && remainder > 0 && ` あまり ${remainder}`}
          </span>
        ) : (
          <span className="hissan-answer-box" style={{ width: '80px' }}></span>
        )}
      </div>

      {/* 除数・記号・被除数 */}
      <div className="division-layout">
        <span className="division-divisor">{divisor}</span>
        <span className="division-symbol">)</span>
        <span className="division-dividend">{dividend}</span>
      </div>
    </div>
  );
};
