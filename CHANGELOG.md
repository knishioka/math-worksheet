# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-01

### Added
- 環境変数システムの導入
  - `.env.example` と `.env.production` ファイルを追加
  - `VITE_BASE_PATH`, `VITE_APP_TITLE`, `VITE_DEFAULT_PROBLEM_COUNT` などの設定をサポート
  - GitHub Pages デプロイメントのための base path 設定
- 共有ユーティリティファイルの作成
  - `src/lib/utils/formatting.ts` - 演算名・演算子記号のフォーマット関数
  - `src/lib/utils/missing-number-calculator.ts` - 虫食い算の計算ロジック
- 設定管理システム
  - `src/config/constants.ts` - アプリケーション設定の一元管理
- エディター設定ファイル
  - `.editorconfig` - IDE間で一貫したコードフォーマットを実現

### Fixed
- 混合問題タイトル表示のバグを修正
  - たし算・ひき算混合問題が「たし算」のみ表示される問題を解決
  - `calculationPattern` パラメータを考慮した演算名表示に修正
  - 影響ファイル: WorksheetHeader.tsx, WorksheetPreview.tsx, SinglePrintButton.tsx, MultiPrintButton.tsx

### Changed
- 依存関係の更新 (12パッケージ)
  - React: 18.3.1 → 19.1.0
  - TypeScript: 5.6.2 → 5.9.3
  - Vite: 6.0.1 → 7.1.7
  - Vitest: 2.1.5 → 3.2.4
  - その他マイナーバージョン更新
- コードの DRY 原則適用
  - 重複コードを約150行削減
  - 4つのコンポーネントで共有されていたヘルパー関数を統合
- 全ファイルに Prettier フォーマット適用
  - 45ファイル、1849行の挿入、1149行の削除
  - コードスタイルの統一

### Refactored
- `WorksheetHeader.tsx` - 共有ユーティリティを使用
- `WorksheetPreview.tsx` - 重複関数を削除、共有ユーティリティにリファクタリング
- `SinglePrintButton.tsx` - ~100行の重複コードを削除
- `MultiPrintButton.tsx` - ~100行の重複コードを削除
- `problemStore.ts` - 設定値を constants から取得
- `vite.config.ts` - 環境変数から base path を取得

### Developer Experience
- Git タグによるバージョン管理の導入
  - `v2.0.0-pre-refactor` タグを作成し安全なロールバックポイントを確保
- パッケージバージョンを 0.0.0 から 2.0.0 にアップデート
- すべてのテストが引き続き合格 (80/80 tests)
- TypeScript 厳密モードでエラーなし

### Technical Details
- コード削減: 約150行
- フォーマット変更: 45ファイル
- テストカバレッジ: 維持 (100%)
- ビルド: 正常
- GitHub Pages 互換性: 確認済み

## [1.0.0] - 2024-12-XX

### Added
- 初回リリース
- MathML ネイティブ対応 (93.9% ブラウザサポート)
- 学年別カリキュラム対応 (1〜6年生)
- 分数・小数・整数の四則演算完全対応
- A4印刷最適化レイアウト (1〜3列)
- 54テストスイート (100%パス)
- 計算パターン別問題生成
- 虫食い算対応
- 筆算表示機能

[2.0.0]: https://github.com/yourusername/math-worksheet/compare/v2.0.0-pre-refactor...v2.0.0
[1.0.0]: https://github.com/yourusername/math-worksheet/releases/tag/v1.0.0
