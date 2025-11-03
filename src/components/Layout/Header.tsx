import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white no-print shadow-lg">
      <div className="absolute -top-12 -left-10 h-48 w-48 rounded-full bg-white/20 blur-3xl" aria-hidden="true"></div>
      <div className="absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-emerald-300/30 blur-3xl" aria-hidden="true"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wide uppercase bg-white/20 rounded-full backdrop-blur-sm">
              ✨ 新しいプリントづくりをもっと手軽に
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                計算プリント作成ツール
              </h1>
              <p className="mt-2 text-base text-white/90 leading-relaxed">
                学年や計算パターンを選ぶだけで、教室ですぐに使える計算プリントを生成できます。
                先生もご家庭の方も、準備時間を短縮して学習サポートに集中しましょう。
              </p>
            </div>
            <dl className="grid grid-cols-1 gap-4 text-sm text-white/90 sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-lg">🎯</span>
                <div>
                  <dt className="font-semibold">学年別カリキュラム対応</dt>
                  <dd>学習段階に合わせた問題を自動でご提案します。</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-lg">🖨️</span>
                <div>
                  <dt className="font-semibold">ワンクリック印刷</dt>
                  <dd>PDF出力を待たずにそのままプリントできます。</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-lg">🌟</span>
                <div>
                  <dt className="font-semibold">学習を楽しく</dt>
                  <dd>色味を抑えたやさしいUIで迷わず設定できます。</dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-white/30 blur" aria-hidden="true"></div>
              <div className="relative flex flex-col items-center gap-3 rounded-3xl bg-white/20 px-10 py-8 text-center backdrop-blur-lg">
                <span className="text-5xl">📚</span>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
                  Ready to print
                </p>
                <p className="text-sm leading-relaxed text-white/90">
                  学校や家庭学習で使える<br />オリジナルのプリントを作成
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
