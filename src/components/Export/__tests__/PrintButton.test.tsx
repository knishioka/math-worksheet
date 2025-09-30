import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PrintButton } from '../PrintButton';

describe('PrintButton', () => {
  let originalPrint: typeof window.print;
  let originalTitle: string;

  beforeEach(() => {
    // window.printのモック
    originalPrint = window.print;
    window.print = vi.fn();
    originalTitle = document.title;
  });

  afterEach(() => {
    // 元に戻す
    window.print = originalPrint;
    document.title = originalTitle;
    // 追加された要素をクリーンアップ
    document.querySelectorAll('style').forEach((el) => el.remove());
    document.querySelectorAll('#print-container').forEach((el) => el.remove());
  });

  it('should render print button', () => {
    render(<PrintButton />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('印刷')).toBeInTheDocument();
  });

  it('should handle basic print', () => {
    render(<PrintButton />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(window.print).toHaveBeenCalled();
    expect(document.title).toBe(originalTitle);
  });

  it('should handle print with custom title', () => {
    const customTitle = 'My Custom Worksheet';
    render(<PrintButton worksheetTitle={customTitle} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(window.print).toHaveBeenCalled();
    // タイトルが元に戻ることを確認
    expect(document.title).toBe(originalTitle);
  });

  it('should handle print with specific element', () => {
    // テスト用の要素を作成
    const testElement = document.createElement('div');
    testElement.id = 'test-element';
    testElement.textContent = 'Test Content';
    document.body.appendChild(testElement);

    render(<PrintButton elementId="test-element" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(window.print).toHaveBeenCalled();

    // クリーンアップ
    testElement.remove();
  });

  it('should handle print when element not found', () => {
    render(<PrintButton elementId="non-existent-element" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // 要素が見つからない場合も通常のprintが呼ばれる
    expect(window.print).toHaveBeenCalled();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<PrintButton disabled />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('should clean up print elements after printing with elementId', () => {
    const testElement = document.createElement('div');
    testElement.id = 'test-element';
    testElement.textContent = 'Test Content';
    document.body.appendChild(testElement);

    render(<PrintButton elementId="test-element" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(window.print).toHaveBeenCalled();
    // 印刷用の一時的な要素が削除されていることを確認
    expect(document.querySelector('#print-container')).toBeNull();

    // クリーンアップ
    testElement.remove();
  });

  it('should restore element visibility after printing', () => {
    // テスト用の要素を作成
    const testElement = document.createElement('div');
    testElement.id = 'test-element';
    document.body.appendChild(testElement);

    const otherElement = document.createElement('div');
    otherElement.id = 'other-element';
    document.body.appendChild(otherElement);

    render(<PrintButton elementId="test-element" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // 他の要素の表示が復元されていることを確認
    expect(otherElement.style.display).toBe('');

    // クリーンアップ
    testElement.remove();
    otherElement.remove();
  });
});
