# English Word Problems - Test Documentation

## 概要

English Word Problems（英語文章問題）機能のテストスイートドキュメント。3つのテストファイルで構成され、合計62個のテストケースをカバーしています。

## テストファイル構成

### 1. `word-problem-en.test.ts` (21 tests)
**目的**: 基本的な問題生成ロジックの単体テスト

#### テストカテゴリ

##### Missing Number Problems (3 tests)
- ✅ 1年生用の虫食い算問題生成
- ✅ 学年に応じた適切な数値範囲（1-20）
- ✅ 複数のテンプレートバリエーション（最低3パターン）

##### Word Story Problems (3 tests)
- ✅ 2年生用の文章問題生成
- ✅ 学年別難易度調整（1年生: ≤20, 6年生: >50）
- ✅ 英語文法の正確性（大文字開始、疑問符/句点終了、一般的な英単語）

##### Grade-Appropriate Generation (5 tests)
- ✅ 全学年（1-6年）での問題生成
- ✅ word-storyとcomparisonカテゴリのみ（missing-numberは除外）
- ✅ 一意のID生成
- ✅ 学年別演算子制限（1年: 加減算のみ）

##### Problem Type Validation (1 test)
- ✅ WordProblemEn型のすべてのプロパティ検証

##### Edge Cases and Robustness (5 tests)
- ✅ 最小問題数（1問）の生成
- ✅ 大量問題数（50問）の生成
- ✅ 有効な答えの生成（非負数、有限数）
- ✅ 適切な句読点（疑問符/句点、連続スペース無し）
- ✅ HTMLインジェクション対策（タグ除外）

##### Number Sequence Problems (1 test)
- ✅ 1-3年生用の数列問題（before, after, between）

##### Operation Coverage (3 tests)
- ✅ 3年生以上での掛け算問題
- ✅ 4年生以上でのわり算問題
- ✅ 1年生では加減算のみ

### 2. `word-problem-en-integration.test.ts` (21 tests)
**目的**: コンポーネント間連携と印刷レイアウトの統合テスト

#### テストカテゴリ

##### Generation and Template Selection (3 tests)
- ✅ word-enテンプレートとの連携
- ✅ 自動テンプレート検出
- ✅ 推奨問題数内での生成（8/16/24問）

##### Print Layout Compatibility (3 tests)
- ✅ 1列レイアウト対応（テキスト長: 10-200文字）
- ✅ 2列レイアウト対応（テキスト長: <150文字）
- ✅ 3列レイアウト対応（テキスト長: <200文字）

##### Grade-Appropriate Generation with Templates (2 tests)
- ✅ 1年生用設定（8問、数値≤20、簡潔な文章）
- ✅ 6年生用設定（24問、複雑な問題）

##### Template Layout Configuration (2 tests)
- ✅ 英語テキスト用の適切なスペーシング
- ✅ 日本語文章問題とのレイアウト差異

##### Problem Categories and Operations (3 tests)
- ✅ word-storyとcomparisonのみ（missing-number除外）
- ✅ 多様な演算子（最低2種類）
- ✅ 学年別演算子制限

##### Answer Format Validation (2 tests)
- ✅ すべての問題で有効な答え
- ✅ 適切な単位の付与

##### ID Generation and Uniqueness (1 test)
- ✅ 複数回呼び出しでの一意性保証

##### Print Preview Compatibility (2 tests)
- ✅ 印刷に必要なすべてのフィールド
- ✅ HTML安全性（スクリプトタグ除外）

##### Performance and Edge Cases (3 tests)
- ✅ 大量問題生成のパフォーマンス（50問<1秒）
- ✅ 最小問題数（1問）
- ✅ 全学年での一貫性

### 3. `print-templates.test.ts` (20 tests)
**目的**: word-enテンプレート設定の検証

#### テストカテゴリ

##### PRINT_TEMPLATES Configuration (5 tests)
- ✅ word-enテンプレートの定義
- ✅ 正しい設定値（rowGap: 16px, colGap: 24px, fontSize: 16px）
- ✅ 推奨問題数（1列: 8, 2列: 16, 3列: 24）
- ✅ 最大問題数（1列: 10, 2列: 20, 3列: 24）
- ✅ A4閾値（1列: 8, 2列: 16, 3列: 24）

##### getPrintTemplate (3 tests)
- ✅ word-enテンプレート取得
- ✅ 異なるタイプのテンプレート区別（レイアウト差異）
- ✅ 全問題タイプでのテンプレート提供

##### detectPrimaryProblemType (3 tests)
- ✅ word-en問題の検出
- ✅ 混合問題での検出
- ✅ wordとword-enの区別

##### fitsInA4 (4 tests)
- ✅ 閾値以内での判定（true）
- ✅ 閾値超過での判定（false）
- ✅ 境界値でのエッジケース
- ✅ 全レイアウト列での動作確認

##### Template Layout Optimization (2 tests)
- ✅ word-enとbasicのスペーシング比較
- ✅ 適切な問題高さ（>50px）

##### Recommended Count Validation (3 tests)
- ✅ 推奨問題数≤最大問題数
- ✅ 推奨問題数=A4閾値
- ✅ レイアウト列間での適切なスケーリング

## テストカバレッジ概要

### 機能カバレッジ
| カテゴリ | テスト数 | カバー内容 |
|---------|---------|-----------|
| 問題生成ロジック | 21 | 基本生成、学年別難易度、演算子 |
| 統合テスト | 21 | テンプレート連携、印刷レイアウト |
| テンプレート設定 | 20 | word-en設定、A4最適化 |
| **合計** | **62** | **全機能カバー** |

### 品質保証項目
- ✅ **型安全性**: TypeScript型定義の完全検証
- ✅ **データ妥当性**: 数値範囲、答えの正確性
- ✅ **セキュリティ**: HTMLインジェクション対策
- ✅ **パフォーマンス**: 50問生成<1秒
- ✅ **印刷互換性**: A4レイアウト最適化
- ✅ **学年適合性**: 1-6年生すべての難易度調整
- ✅ **エッジケース**: 最小/最大問題数、境界値

## テスト実行コマンド

```bash
# 全テスト実行
npm test

# 型チェック
npm run typecheck

# Lint
npm run lint

# プッシュ前推奨
npm test && npm run typecheck && npm run lint
```

## テスト追加ガイドライン

### 新しいテンプレートを追加する場合
1. `en-word-story.ts`に新しいテンプレートを追加
2. `word-problem-en.test.ts`にバリエーションテストを追加
3. `word-problem-en-integration.test.ts`に統合テストを追加

### 新しい問題タイプを追加する場合
1. `generateEnWordStory`関数を更新
2. `word-problem-en.test.ts`にカテゴリテストを追加
3. `print-templates.test.ts`にテンプレート設定テストを追加

### テストが失敗した場合
1. エラーメッセージを確認（どのアサーションが失敗したか）
2. 問題の原因を特定（生成ロジック/テンプレート設定/型定義）
3. 修正後に全テストを再実行

## 主要な設計決定

### 1. word-storyのみに限定
**理由**: ユーザーフィードバック「文章問題にちゃんと限定して」
**実装**: `generateGradeEnWordProblems`でword-storyのみ生成
**テスト**: すべての生成テストでcategory検証

### 2. 推奨問題数設定
**理由**: A4用紙1枚に最適な問題数を提供
**実装**: word-enテンプレートで1列: 8, 2列: 16, 3列: 24
**テスト**: `print-templates.test.ts`で閾値検証

### 3. 印刷HTML生成
**理由**: print previewでの表示問題を解決
**実装**: `MultiPrintButton.tsx`にword-enケースを追加
**テスト**: 統合テストで印刷互換性検証

## 今後の改善案

### テストカバレッジ拡張
- [ ] 視覚回帰テスト（Playwright + スクリーンショット比較）
- [ ] パフォーマンスベンチマーク（100問、1000問）
- [ ] アクセシビリティテスト（ARIA属性、スクリーンリーダー）

### テストツール改善
- [ ] カバレッジレポート自動生成（vitest coverage）
- [ ] CI/CD統合（GitHub Actions）
- [ ] プレコミットフック（husky + lint-staged）

### ドキュメント拡充
- [ ] テスト失敗時のトラブルシューティングガイド
- [ ] 新規メンテナー向けのオンボーディング資料
- [ ] テスト設計思想のドキュメント
