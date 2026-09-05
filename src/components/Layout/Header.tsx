import React from 'react';

export const Header: React.FC = () => (
  <header className="app-header no-print">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 py-5">
      <a href="#main" className="flex items-center gap-3 text-slate-900">
        <span className="brand-mark" aria-hidden="true">
          ＋<br />−
        </span>
        <span>
          <span className="block text-lg font-bold tracking-tight">
            まいにち算数
          </span>
          <span className="block text-[10px] tracking-[0.18em] text-slate-500">
            MATH WORKSHEET
          </span>
        </span>
      </a>
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <span className="hidden sm:inline">
          小さな「できた」を、毎日の一枚に。
        </span>
        <span className="rounded-full border border-slate-200 px-3 py-1.5">
          A4 印刷対応
        </span>
      </div>
    </div>
  </header>
);
