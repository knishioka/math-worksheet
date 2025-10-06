# 印刷プレビュー検証システム

## 概要

印刷時の問題を自動検出するテストシステムです。以下の問題を検出できます：

1. **問題の消失** - 生成された問題数と印刷される問題数の不一致
2. **ページはみ出し** - A4サイズを超える問題数
3. **問題タイプの表示エラー** - 分数・小数・帯分数などが正しく表示されていない

## 検出方法

### 1. 問題の消失検出

生成されたHTMLから問題番号 `(1)`, `(2)`, ... `(N)` をカウントし、元の問題数と一致するか確認します。

```typescript
function countProblemsInHTML(html: string): number {
  const problemNumberPattern = /\((\d+)\)/g;
  const matches = html.match(problemNumberPattern);
  return matches ? matches.length : 0;
}

// 使用例
const html = printContainer.innerHTML;
const problemCount = countProblemsInHTML(html);
expect(problemCount).toBe(20); // 期待される問題数
```

### 2. 問題タイプの表示検証

各問題タイプが正しく表示されているか、HTML内の特定のマーカーで確認します。

```typescript
function validateProblemType(html: string, problemType: Problem['type']): boolean {
  switch (problemType) {
    case 'fraction':
      // MathMLの分数タグを確認
      return html.includes('<mfrac>') && html.includes('</mfrac>');

    case 'decimal':
      // 小数表示を確認
      return html.includes('<mn>') && /\d+\.\d+/.test(html);

    case 'mixed':
      // 帯分数タグを確認
      return html.includes('<mrow>') && html.includes('<mfrac>');

    case 'word':
      // 日本語文章問題
      return html.includes('答え:');

    case 'word-en':
      // 英語文章問題
      return html.includes('Answer:');

    case 'hissan':
      // 筆算の横線を確認
      return html.includes('border-top: 2px solid black');

    case 'basic':
      // 基本問題（演算子記号を確認）
      return /[+−×÷]/.test(html);

    default:
      return false;
  }
}

// 使用例
expect(validateProblemType(html, 'fraction')).toBe(true);
```

### 3. A4サイズ検証

問題数と問題タイプから、A4サイズ（297mm）に収まるか推定します。

```typescript
function estimateA4Fit(
  problemCount: number,
  layoutColumns: number,
  problemType: Problem['type']
): { fits: boolean; estimatedHeight: number; a4Height: number } {
  const template = getPrintTemplate(problemType);
  const rowCount = Math.ceil(problemCount / layoutColumns);

  // 問題タイプごとの推定高さ（mm）
  const minProblemHeightMm = parseInt(template.layout.minProblemHeight) * 0.26; // px to mm
  const rowGapMm = parseInt(template.layout.rowGap) * 0.26;

  // 必要な高さを計算
  const headerHeight = 25; // ヘッダー部分の高さ (mm)
  const verticalMarginMin = 5; // 最小余白 (mm)

  const contentHeight = headerHeight + (minProblemHeightMm + rowGapMm) * rowCount;
  const estimatedHeight = contentHeight + verticalMarginMin * 2;

  const a4Height = 297; // A4の高さ (mm)
  const fits = estimatedHeight <= a4Height;

  return { fits, estimatedHeight, a4Height };
}

// 使用例
const result = estimateA4Fit(20, 2, 'basic');
expect(result.fits).toBe(true);
expect(result.estimatedHeight).toBeLessThanOrEqual(297);
```

## テストの実行

### 単体テストの実行

```bash
# 全テスト実行
npm test

# 印刷検証テストのみ実行
npm test -- PrintValidation.test.tsx --run
```

### CI/CDでの統合

`.github/workflows/test.yml`

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
```

## 検出された問題の修正フロー

### 1. 問題が消失している場合

```
❌ Error: expected 20 to be 18
   - Expected problem count: 20
   - Actual problem count: 18
   - Missing problems: 2
```

**原因**:
- `MultiPrintButton.tsx`に問題タイプの表示ロジックが実装されていない
- 問題番号の重複や欠番

**修正方法**:
1. `MultiPrintButton.tsx`で該当の問題タイプのHTMLレンダリングを追加
2. 問題番号の並び替えロジックを確認

### 2. ページがはみ出している場合

```
❌ Error: expected false to be true
   - Estimated height: 320mm
   - A4 height: 297mm
   - Overflow: 23mm
```

**原因**:
- 推奨問題数を超えている
- 問題タイプの高さ設定が不適切

**修正方法**:
1. `print-templates.ts`で推奨問題数を調整
2. `rowGap`や`minProblemHeight`を縮小
3. ユーザーに警告を表示

### 3. 問題タイプが表示されていない場合

```
❌ Error: expected false to be true
   - Problem type: fraction
   - MathML tags not found in HTML
```

**原因**:
- 問題タイプの表示ロジックが実装されていない
- MathMLタグが正しく生成されていない

**修正方法**:
1. `MultiPrintButton.tsx`に問題タイプの表示ロジックを追加
2. MathMLタグの生成を確認

## ベストプラクティス

### 1. 新しい問題タイプを追加する場合

1. `validateProblemType()`に検証ロジックを追加
2. テストケースを追加
3. `MultiPrintButton.tsx`に表示ロジックを実装
4. テストを実行して確認

### 2. レイアウトを変更する場合

1. `estimateA4Fit()`で事前にサイズを確認
2. 変更後にテストを実行
3. 印刷プレビューで目視確認

### 3. 継続的な監視

- Pull Requestごとにテストを実行
- 新機能追加時は必ず検証テストを追加
- 定期的に印刷プレビューをチェック

## トラブルシューティング

### テストが失敗する場合

```bash
# キャッシュをクリア
npm run clean
npm ci

# テストを再実行
npm test -- PrintValidation.test.tsx --run
```

### 印刷プレビューで手動確認

1. 開発サーバーを起動: `npm run dev`
2. 問題を生成
3. 「印刷する」ボタンをクリック
4. 印刷プレビューで確認:
   - すべての問題が表示されているか
   - ページからはみ出ていないか
   - レイアウトが崩れていないか

## 今後の拡張

- [ ] Visual Regression Testing (Playwrightでスクリーンショット比較)
- [ ] クロスブラウザテスト (Chrome, Firefox, Safari)
- [ ] PDF生成テスト
- [ ] パフォーマンステスト

## 関連ドキュメント

- [プリントテンプレートシステム](/docs/specifications/print-template-system.md)
- [印刷・PDF仕様](/docs/specifications/pdf-generation-spec.md)
- [開発ガイド](/CLAUDE.md)
