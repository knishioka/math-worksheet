import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LanguageFilter } from '../LanguageFilter';

describe('LanguageFilter', () => {
  describe('rendering', () => {
    it('should render all three language options', () => {
      render(<LanguageFilter value="all" onChange={() => {}} />);

      expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '日本語' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument();
    });

    it('should render language label', () => {
      render(<LanguageFilter value="all" onChange={() => {}} />);

      expect(screen.getByText('言語:')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <LanguageFilter value="all" onChange={() => {}} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('selection behavior', () => {
    it('should highlight the selected option', () => {
      render(<LanguageFilter value="ja" onChange={() => {}} />);

      const jaButton = screen.getByRole('button', { name: '日本語' });
      expect(jaButton).toHaveClass('bg-white');
    });

    it('should call onChange when option is clicked', () => {
      const onChange = vi.fn();
      render(<LanguageFilter value="all" onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: '日本語' }));

      expect(onChange).toHaveBeenCalledWith('ja');
    });

    it('should call onChange with "en" when English is clicked', () => {
      const onChange = vi.fn();
      render(<LanguageFilter value="all" onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'English' }));

      expect(onChange).toHaveBeenCalledWith('en');
    });

    it('should call onChange with "all" when すべて is clicked', () => {
      const onChange = vi.fn();
      render(<LanguageFilter value="ja" onChange={onChange} />);

      fireEvent.click(screen.getByRole('button', { name: 'すべて' }));

      expect(onChange).toHaveBeenCalledWith('all');
    });
  });

  describe('disabled state', () => {
    it('should not call onChange when disabled', () => {
      const onChange = vi.fn();
      render(<LanguageFilter value="all" onChange={onChange} disabled />);

      fireEvent.click(screen.getByRole('button', { name: '日本語' }));

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should apply disabled styling when disabled', () => {
      render(<LanguageFilter value="all" onChange={() => {}} disabled />);

      const jaButton = screen.getByRole('button', { name: '日本語' });
      expect(jaButton).toBeDisabled();
    });
  });
});
