import React from 'react';

// MathMLサポート検出
function supportsMathML(): boolean {
  if (typeof window === 'undefined') return false;
  
  const div = document.createElement('div');
  div.innerHTML = '<math><mspace height="23px" width="77px"></mspace></math>';
  document.body.appendChild(div);
  const box = (div.firstChild?.firstChild as HTMLElement)?.getBoundingClientRect();
  document.body.removeChild(div);
  
  return box ? Math.abs(box.height - 23) <= 1 && Math.abs(box.width - 77) <= 1 : false;
}

// 分数コンポーネント
interface MathFractionProps {
  numerator: number;
  denominator: number;
  className?: string;
}

export const MathFraction: React.FC<MathFractionProps> = ({ 
  numerator, 
  denominator, 
  className = '' 
}) => {
  const [hasMathMLSupport, setHasMathMLSupport] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setHasMathMLSupport(supportsMathML());
  }, []);

  // MathMLサポート検出中
  if (hasMathMLSupport === null) {
    return <span className={className}>{numerator}/{denominator}</span>;
  }

  // MathMLサポートあり
  if (hasMathMLSupport) {
    return React.createElement('math', 
      { xmlns: "http://www.w3.org/1998/Math/MathML", className },
      React.createElement('mfrac', {},
        React.createElement('mn', {}, numerator),
        React.createElement('mn', {}, denominator)
      )
    );
  }

  // フォールバック: HTML/CSS
  return (
    <span className={`inline-block text-center ${className}`}>
      <span className="block border-b border-black px-1 text-sm leading-tight">
        {numerator}
      </span>
      <span className="block px-1 text-sm leading-tight">
        {denominator}
      </span>
    </span>
  );
};

// 混合数コンポーネント
interface MathMixedNumberProps {
  whole: number;
  numerator: number;
  denominator: number;
  className?: string;
}

export const MathMixedNumber: React.FC<MathMixedNumberProps> = ({
  whole,
  numerator,
  denominator,
  className = ''
}) => {
  const [hasMathMLSupport, setHasMathMLSupport] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setHasMathMLSupport(supportsMathML());
  }, []);

  // MathMLサポート検出中
  if (hasMathMLSupport === null) {
    return <span className={className}>{whole} {numerator}/{denominator}</span>;
  }

  // MathMLサポートあり
  if (hasMathMLSupport) {
    return React.createElement('math',
      { xmlns: "http://www.w3.org/1998/Math/MathML", className },
      React.createElement('mrow', {},
        React.createElement('mn', {}, whole),
        React.createElement('mfrac', {},
          React.createElement('mn', {}, numerator),
          React.createElement('mn', {}, denominator)
        )
      )
    );
  }

  // フォールバック: HTML/CSS
  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{whole}</span>
      <span className="inline-block text-center">
        <span className="block border-b border-black px-1 text-sm leading-tight">
          {numerator}
        </span>
        <span className="block px-1 text-sm leading-tight">
          {denominator}
        </span>
      </span>
    </span>
  );
};

// 小数コンポーネント（美しい表示のため）
interface MathDecimalProps {
  value: number;
  className?: string;
}

export const MathDecimal: React.FC<MathDecimalProps> = ({ 
  value, 
  className = '' 
}) => {
  const [hasMathMLSupport, setHasMathMLSupport] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setHasMathMLSupport(supportsMathML());
  }, []);

  const formattedValue = value.toString();

  // MathMLサポート検出中
  if (hasMathMLSupport === null) {
    return <span className={className}>{formattedValue}</span>;
  }

  // MathMLサポートあり
  if (hasMathMLSupport) {
    return React.createElement('math',
      { xmlns: "http://www.w3.org/1998/Math/MathML", className },
      React.createElement('mn', {}, formattedValue)
    );
  }

  // フォールバック: 通常のテキスト
  return <span className={className}>{formattedValue}</span>;
};

// 一般的な数式表現コンポーネント
interface MathExpressionProps {
  children: React.ReactNode;
  display?: boolean;
  className?: string;
}

export const MathExpression: React.FC<MathExpressionProps> = ({
  children,
  display = false,
  className = ''
}) => {
  const [hasMathMLSupport, setHasMathMLSupport] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setHasMathMLSupport(supportsMathML());
  }, []);

  // MathMLサポート検出中またはサポートなし
  if (hasMathMLSupport === null || !hasMathMLSupport) {
    return <span className={className}>{children}</span>;
  }

  // MathMLサポートあり
  return React.createElement('math',
    {
      xmlns: "http://www.w3.org/1998/Math/MathML",
      display: display ? 'block' : 'inline',
      className
    },
    children
  );
};