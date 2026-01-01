import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HissanDivisionJapanese } from '../HissanDivisionJapanese';

describe('HissanDivisionJapanese', () => {
  describe('Basic rendering', () => {
    it('should render dividend and divisor', () => {
      render(<HissanDivisionJapanese dividend={72} divisor={3} />);

      // 被除数の各桁が表示される
      expect(screen.getByText('7')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      // 除数が表示される
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render SVG bracket', () => {
      const { container } = render(
        <HissanDivisionJapanese dividend={72} divisor={3} />
      );

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();

      // SVGパスが存在することを確認
      const path = container.querySelector('path');
      expect(path).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <HissanDivisionJapanese
          dividend={72}
          divisor={3}
          className="custom-class"
        />
      );

      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Answer display', () => {
    it('should not show answer by default', () => {
      render(
        <HissanDivisionJapanese dividend={72} divisor={3} quotient={24} />
      );

      // 商が赤色で表示されないこと（showAnswer=falseのため）
      const redElements = document.querySelectorAll('.text-red-600');
      expect(redElements.length).toBe(0);
    });

    it('should show answer when showAnswer is true', () => {
      render(
        <HissanDivisionJapanese
          dividend={72}
          divisor={3}
          quotient={24}
          showAnswer={true}
        />
      );

      // 商が赤色で表示されること
      const answerElement = document.querySelector('.text-red-600');
      expect(answerElement).toBeInTheDocument();
    });

    it('should show remainder when showAnswer is true and remainder > 0', () => {
      render(
        <HissanDivisionJapanese
          dividend={73}
          divisor={3}
          quotient={24}
          remainder={1}
          showAnswer={true}
        />
      );

      // 余りが表示されること（「あまり 1」というテキストを含む要素）
      expect(screen.getByText(/あまり 1/)).toBeInTheDocument();
    });

    it('should not show remainder when remainder is 0', () => {
      render(
        <HissanDivisionJapanese
          dividend={72}
          divisor={3}
          quotient={24}
          remainder={0}
          showAnswer={true}
        />
      );

      // 余り0の場合は「あまり」が表示されない
      expect(screen.queryByText(/あまり/)).not.toBeInTheDocument();
    });
  });

  describe('Quotient positioning', () => {
    it('should pad quotient to match dividend length', () => {
      const { container } = render(
        <HissanDivisionJapanese
          dividend={144}
          divisor={4}
          quotient={36}
          showAnswer={true}
        />
      );

      // 被除数が3桁なので、商も3桁分のスペースを使用
      // 商の各桁がspan要素として表示される
      const answerSpans = container.querySelectorAll(
        '.text-red-600 .inline-block'
      );
      expect(answerSpans.length).toBe(3); // " 36" の3文字分
    });
  });

  describe('Edge cases', () => {
    it('should handle single digit dividend', () => {
      render(<HissanDivisionJapanese dividend={9} divisor={3} quotient={3} />);

      expect(screen.getByText('9')).toBeInTheDocument();
    });

    it('should handle large dividend', () => {
      render(
        <HissanDivisionJapanese dividend={9876} divisor={4} quotient={2469} />
      );

      // 各桁が正しく表示される
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    it('should handle quotient with leading zeros in context', () => {
      const { container } = render(
        <HissanDivisionJapanese
          dividend={105}
          divisor={5}
          quotient={21}
          showAnswer={true}
        />
      );

      // 被除数が3桁、商が2桁の場合、商はパディングされて " 21" になる
      const answerSpans = container.querySelectorAll(
        '.text-red-600 .inline-block'
      );
      expect(answerSpans.length).toBe(3);
    });
  });

  describe('SVG dimensions', () => {
    it('should scale SVG width based on dividend length', () => {
      const { container: container2 } = render(
        <HissanDivisionJapanese dividend={12} divisor={3} />
      );

      const { container: container4 } = render(
        <HissanDivisionJapanese dividend={1234} divisor={3} />
      );

      const svg2 = container2.querySelector('svg');
      const svg4 = container4.querySelector('svg');

      expect(svg2).toBeInTheDocument();
      expect(svg4).toBeInTheDocument();

      // 4桁のほうが幅が広い
      const width2 = Number(svg2?.getAttribute('width'));
      const width4 = Number(svg4?.getAttribute('width'));
      expect(width4).toBeGreaterThan(width2);
    });
  });
});
