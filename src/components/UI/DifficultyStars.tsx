import React from 'react';
import type { DifficultyLevel } from '../../config/pattern-categories';
import { getDifficultyLabel } from '../../config/pattern-categories';

interface DifficultyStarsProps {
  difficulty: DifficultyLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * 難易度を星で表示するコンポーネント
 * 1: ⭐ (やさしい)
 * 2: ⭐⭐ (ふつう)
 * 3: ⭐⭐⭐ (チャレンジ)
 */
export function DifficultyStars({
  difficulty,
  showLabel = false,
  size = 'sm',
  className = '',
}: DifficultyStarsProps): React.ReactElement {
  const starSize = size === 'sm' ? 'text-xs' : 'text-sm';
  const label = getDifficultyLabel(difficulty);

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      title={label}
      aria-label={`難易度: ${label}`}
    >
      <span className={`${starSize} leading-none`} aria-hidden="true">
        {Array.from({ length: difficulty }, (_, i) => (
          <span key={i} className="text-yellow-500">
            ★
          </span>
        ))}
        {Array.from({ length: 3 - difficulty }, (_, i) => (
          <span key={i} className="text-gray-300">
            ★
          </span>
        ))}
      </span>
      {showLabel && (
        <span className="text-xs text-gray-500 ml-1">{label}</span>
      )}
    </span>
  );
}
