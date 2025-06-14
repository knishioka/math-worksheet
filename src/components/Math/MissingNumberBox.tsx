import React from 'react';

interface MissingNumberBoxProps {
  className?: string;
}

export const MissingNumberBox: React.FC<MissingNumberBoxProps> = ({ className = '' }) => {
  return (
    <span 
      className={`missing-number-box inline-block border-2 border-gray-400 rounded ${className}`}
      style={{ 
        width: '1.75rem', 
        height: '1.75rem',
        verticalAlign: 'text-bottom',
        backgroundColor: '#f9f9f9'
      }}
    />
  );
};

export const MissingNumberSymbol: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span className={`font-mono text-xl ${className}`}>□</span>
  );
};