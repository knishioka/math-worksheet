import React from 'react';

export const Header: React.FC<{ catalogHash?: string }> = ({ catalogHash }) => (
  <header className="app-header no-print">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 py-4">
      <a
        href="#main"
        className="flex items-center gap-1.5 sm:gap-3 text-slate-900"
      >
        <span className="brand-mark" aria-hidden="true">
          ＋<br />−
        </span>
        <span>
          <span className="block text-sm sm:text-lg font-bold tracking-tight">
            まいにち算数
          </span>
          <span className="hidden sm:block text-[10px] tracking-[0.18em] text-slate-500">
            MATH WORKSHEET
          </span>
        </span>
      </a>
      <nav aria-label="メインメニュー" className="app-nav">
        <a href="#main" aria-current={catalogHash ? undefined : 'page'}>
          プリント作成
        </a>
        <a
          href={catalogHash ?? '#catalog'}
          aria-current={catalogHash ? 'page' : undefined}
        >
          教材一覧
        </a>
      </nav>
    </div>
  </header>
);
