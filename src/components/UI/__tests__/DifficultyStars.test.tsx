import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DifficultyStars } from '../DifficultyStars';

describe('DifficultyStars', () => {
  describe('rendering', () => {
    it('should render 1 filled star and 2 empty stars for difficulty 1', () => {
      render(<DifficultyStars difficulty={1} />);

      const container = screen.getByLabelText('難易度: やさしい');
      expect(container).toBeInTheDocument();

      // Check filled stars (yellow)
      const filledStars = container.querySelectorAll('.text-yellow-500');
      expect(filledStars).toHaveLength(1);

      // Check empty stars (gray)
      const emptyStars = container.querySelectorAll('.text-gray-300');
      expect(emptyStars).toHaveLength(2);
    });

    it('should render 2 filled stars and 1 empty star for difficulty 2', () => {
      render(<DifficultyStars difficulty={2} />);

      const container = screen.getByLabelText('難易度: ふつう');
      expect(container).toBeInTheDocument();

      const filledStars = container.querySelectorAll('.text-yellow-500');
      expect(filledStars).toHaveLength(2);

      const emptyStars = container.querySelectorAll('.text-gray-300');
      expect(emptyStars).toHaveLength(1);
    });

    it('should render 3 filled stars for difficulty 3', () => {
      render(<DifficultyStars difficulty={3} />);

      const container = screen.getByLabelText('難易度: チャレンジ');
      expect(container).toBeInTheDocument();

      const filledStars = container.querySelectorAll('.text-yellow-500');
      expect(filledStars).toHaveLength(3);

      const emptyStars = container.querySelectorAll('.text-gray-300');
      expect(emptyStars).toHaveLength(0);
    });
  });

  describe('showLabel prop', () => {
    it('should not show label by default', () => {
      render(<DifficultyStars difficulty={1} />);

      expect(screen.queryByText('やさしい')).not.toBeInTheDocument();
    });

    it('should show label when showLabel is true', () => {
      render(<DifficultyStars difficulty={1} showLabel />);

      expect(screen.getByText('やさしい')).toBeInTheDocument();
    });

    it('should show correct label for each difficulty', () => {
      const { rerender } = render(<DifficultyStars difficulty={1} showLabel />);
      expect(screen.getByText('やさしい')).toBeInTheDocument();

      rerender(<DifficultyStars difficulty={2} showLabel />);
      expect(screen.getByText('ふつう')).toBeInTheDocument();

      rerender(<DifficultyStars difficulty={3} showLabel />);
      expect(screen.getByText('チャレンジ')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper aria-label', () => {
      render(<DifficultyStars difficulty={2} />);

      expect(screen.getByLabelText('難易度: ふつう')).toBeInTheDocument();
    });

    it('should have title attribute for tooltip', () => {
      render(<DifficultyStars difficulty={3} />);

      const container = screen.getByLabelText('難易度: チャレンジ');
      expect(container).toHaveAttribute('title', 'チャレンジ');
    });
  });

  describe('className prop', () => {
    it('should apply custom className', () => {
      render(<DifficultyStars difficulty={1} className="custom-class" />);

      const container = screen.getByLabelText('難易度: やさしい');
      expect(container).toHaveClass('custom-class');
    });
  });
});
