import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white py-4 px-6 no-print">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold">計算プリント作成ツール</h1>
        <p className="text-sm opacity-90 mt-1">
          小学校の算数カリキュラムに対応した計算プリントを自動生成
        </p>
      </div>
    </header>
  );
};
