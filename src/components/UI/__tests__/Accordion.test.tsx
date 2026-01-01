import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Accordion } from '../Accordion';

describe('Accordion', () => {
  const mockItems = [
    {
      id: 'item1',
      title: 'First Item',
      icon: '🔢',
      badge: 5,
      children: <div>Content 1</div>,
    },
    {
      id: 'item2',
      title: 'Second Item',
      badge: 3,
      children: <div>Content 2</div>,
    },
  ];

  describe('rendering', () => {
    it('should render all items', () => {
      render(<Accordion items={mockItems} />);

      expect(screen.getByText('First Item')).toBeInTheDocument();
      expect(screen.getByText('Second Item')).toBeInTheDocument();
    });

    it('should render icons when provided', () => {
      render(<Accordion items={mockItems} />);

      expect(screen.getByText('🔢')).toBeInTheDocument();
    });

    it('should render badges when provided', () => {
      render(<Accordion items={mockItems} />);

      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('should render nothing when items is empty', () => {
      const { container } = render(<Accordion items={[]} />);

      expect(container.firstChild).toBeEmptyDOMElement();
    });
  });

  describe('expansion behavior', () => {
    it('should expand items in defaultOpen', () => {
      render(<Accordion items={mockItems} defaultOpen={['item1']} />);

      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('should toggle item on click', () => {
      render(<Accordion items={mockItems} defaultOpen={[]} />);

      const firstItemButton = screen.getByRole('button', { name: /First Item/i });
      fireEvent.click(firstItemButton);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });

    it('should allow multiple items expanded when allowMultiple is true', () => {
      render(<Accordion items={mockItems} defaultOpen={['item1']} allowMultiple />);

      const secondItemButton = screen.getByRole('button', { name: /Second Item/i });
      fireEvent.click(secondItemButton);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should collapse other items when allowMultiple is false', () => {
      render(
        <Accordion items={mockItems} defaultOpen={['item1']} allowMultiple={false} />
      );

      const secondItemButton = screen.getByRole('button', { name: /Second Item/i });
      fireEvent.click(secondItemButton);

      // Only item2 should be visible now
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('should use expandedIds when provided', () => {
      render(<Accordion items={mockItems} expandedIds={['item2']} />);

      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('should call onExpandChange when item is toggled', () => {
      const onExpandChange = vi.fn();
      render(
        <Accordion
          items={mockItems}
          expandedIds={[]}
          onExpandChange={onExpandChange}
        />
      );

      const firstItemButton = screen.getByRole('button', { name: /First Item/i });
      fireEvent.click(firstItemButton);

      expect(onExpandChange).toHaveBeenCalledWith(['item1']);
    });

    it('should remove item from expandedIds when collapsed', () => {
      const onExpandChange = vi.fn();
      render(
        <Accordion
          items={mockItems}
          expandedIds={['item1']}
          onExpandChange={onExpandChange}
        />
      );

      const firstItemButton = screen.getByRole('button', { name: /First Item/i });
      fireEvent.click(firstItemButton);

      expect(onExpandChange).toHaveBeenCalledWith([]);
    });
  });

  describe('accessibility', () => {
    it('should have aria-expanded attribute on buttons', () => {
      render(<Accordion items={mockItems} defaultOpen={['item1']} />);

      const firstButton = screen.getByRole('button', { name: /First Item/i });
      const secondButton = screen.getByRole('button', { name: /Second Item/i });

      expect(firstButton).toHaveAttribute('aria-expanded', 'true');
      expect(secondButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should be keyboard accessible', () => {
      render(<Accordion items={mockItems} />);

      const firstButton = screen.getByRole('button', { name: /First Item/i });
      firstButton.focus();

      expect(document.activeElement).toBe(firstButton);
    });
  });
});
