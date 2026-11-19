import React from 'react';
import { missingNumberBoxStyle } from '../../config/styles';

interface MissingNumberBoxProps {
  className?: string;
}

export const MissingNumberBox: React.FC<MissingNumberBoxProps> = ({
  className = '',
}) => {
  return (
    <span
      className={`missing-number-box ${className}`}
      style={missingNumberBoxStyle}
    />
  );
};

export const MissingNumberSymbol: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return <span className={`font-mono text-xl ${className}`}>□</span>;
};
