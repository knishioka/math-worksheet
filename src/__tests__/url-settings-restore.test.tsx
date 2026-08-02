import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';

/**
 * 共有URLの設定が復元されることの回帰テスト。
 *
 * 以前は「デフォルト設定で1度描画 → useEffect で URL を反映」という順序だったため、
 * 復元前に走る初期化 effect（URLの書き戻し・パターンの自動選択・推奨問題数の適用）が
 * URL パラメータを打ち消していた。StrictMode の再マウントで書き戻し済みの URL を
 * 読み直すため、共有URLを開くと必ず先頭パターン・デフォルト問題数になっていた。
 */

// ストアは import 時に URL を読むため、テストごとにモジュールを読み直す
async function renderAppWithUrl(search: string): Promise<void> {
  window.history.replaceState(null, '', `/${search}`);
  vi.resetModules();
  const { default: App } = await import('../App');
  render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

function currentParams(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

describe('共有URLからの設定復元', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('URL の pattern がプレビューに反映され、URL からも消えない', async () => {
    await renderAppWithUrl(
      '?grade=1&type=basic&pattern=add-single-digit-mixed&cols=2&count=14'
    );

    expect(
      await screen.findByRole('heading', {
        name: /1桁のたし算（繰り上がり混在）/,
      })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(currentParams().get('pattern')).toBe('add-single-digit-mixed');
    });
  });

  it('URL の問題数・列数が推奨値で上書きされない', async () => {
    await renderAppWithUrl(
      '?grade=1&type=basic&pattern=add-single-digit-mixed&cols=2&count=14'
    );

    // 2列の推奨問題数は20。復元した14問が維持されること
    await waitFor(() => {
      expect(currentParams().get('count')).toBe('14');
      expect(currentParams().get('cols')).toBe('2');
    });
  });

  it('学年も復元される', async () => {
    await renderAppWithUrl(
      '?grade=3&type=basic&pattern=mult-double-digit&cols=2&count=10'
    );

    await waitFor(() => {
      expect(currentParams().get('grade')).toBe('3');
      expect(currentParams().get('pattern')).toBe('mult-double-digit');
    });
  });

  it('URL パラメータがない場合はデフォルト設定が URL に同期される', async () => {
    await renderAppWithUrl('');

    await waitFor(() => {
      expect(currentParams().get('grade')).toBe('1');
      expect(currentParams().get('cols')).toBe('3');
      expect(currentParams().get('count')).toBe('30');
    });
  });

  it('不正な pattern は無視され、既定の選択にフォールバックする', async () => {
    await renderAppWithUrl('?grade=1&type=basic&pattern=not-a-real-pattern');

    await waitFor(() => {
      expect(currentParams().get('pattern')).not.toBe('not-a-real-pattern');
      expect(currentParams().get('pattern')).toBeTruthy();
    });
  });
});
