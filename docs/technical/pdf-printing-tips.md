# PDF印刷機能の技術的詳細とTips

## 概要

本プロジェクトでは、ブラウザのネイティブ印刷機能を活用してPDF生成を実現しています。外部ライブラリに依存せず、CSSとJavaScriptのみで高品質な印刷レイアウトを実現する方法をまとめました。

## 技術的なアプローチ

### 1. ライブラリ不使用の理由

- **軽量性**: jsPDFやpuppeteerなどの外部ライブラリを使用せず、バンドルサイズを最小限に
- **保守性**: 依存関係が少なく、メンテナンスが容易
- **互換性**: ブラウザのネイティブ印刷機能は安定しており、将来的な互換性の心配が少ない
- **品質**: ブラウザの印刷エンジンは高品質で、特に日本語フォントの扱いが優秀

### 2. 動的レイアウト生成

```typescript
// 印刷専用のDOM要素を動的に生成
const printContainer = document.createElement('div');
printContainer.id = 'single-print-container';

// ページ全体のスタイル設定
const pageDiv = document.createElement('div');
pageDiv.style.minHeight = '100vh';
pageDiv.style.position = 'relative';
pageDiv.style.padding = '20mm';
```

**ポイント**:
- 画面表示用のレイアウトとは独立した印刷専用レイアウトを生成
- インラインスタイルで完全制御（Tailwindクラスの影響を受けない）

## CSS最適化テクニック

### 1. @pageルールの活用

```css
@media print {
  @page {
    size: A4;
    margin: 0;  /* ブラウザのデフォルトマージンを無効化 */
  }
}
```

**重要**: `margin: 0`により、コンテンツ側でマージンを完全制御できます。

### 2. 印刷専用クラス

```css
/* 画面では非表示、印刷時のみ表示 */
.print-only {
  display: none;
}

@media print {
  .print-only {
    display: block !important;
  }
}

/* 画面では表示、印刷時は非表示 */
.no-print {
  @media print {
    display: none !important;
  }
}
```

### 3. ページ内改行の制御

```css
.avoid-break {
  page-break-inside: avoid;
}

.page-break {
  page-break-after: always;
}
```

## レイアウト最適化

### 1. 問題タイプ別の間隔調整

```typescript
// 文章問題や虫食い算の場合は間隔を調整
const hasWordProblems = worksheet.problems.some(p => p.type === 'word');
const hasMissingNumbers = worksheet.problems.some(p => p.type === 'basic' && p.missingPosition);
const rowGap = hasWordProblems ? '12px' : hasMissingNumbers ? '18px' : '24px';
const colGap = hasWordProblems ? '20px' : '32px';
```

**理由**:
- 文章問題: テキストが多いため、間隔を狭めて収容力を向上
- 虫食い算: 四角形が大きいため、中間的な間隔を設定
- 通常問題: 読みやすさを優先して余裕のある間隔

### 2. 縦順配置アルゴリズム

```typescript
// 縦順に並び替えた問題配列を作成
const reorderedProblems: (typeof worksheet.problems[0] | null)[] = [];
const rowCount = Math.ceil(worksheet.problems.length / columns);

for (let col = 0; col < columns; col++) {
  for (let row = 0; row < rowCount; row++) {
    const originalIndex = row + col * rowCount;
    const newIndex = row * columns + col;
    
    if (originalIndex < worksheet.problems.length) {
      reorderedProblems[newIndex] = worksheet.problems[originalIndex];
    } else {
      reorderedProblems[newIndex] = null;
    }
  }
}
```

**効果**: 日本の教育現場で一般的な縦順配置を実現

### 3. A4用紙最適化

```typescript
// 推奨問題数の設定
const WORD_PROBLEM_RECOMMENDED: Record<LayoutColumns, number> = {
  1: 8,   // 1列の場合は8問を推奨
  2: 16,  // 2列の場合は16問を推奨
  3: 24,  // 3列の場合は24問を推奨
};
```

## MathML対応

### 1. ネイティブMathMLの利点

- **軽量**: KaTeXやMathJaxと比較して非常に軽量
- **高速**: JavaScriptによるレンダリング不要
- **印刷品質**: ベクターグラフィックスで高品質

### 2. フォールバック実装

```typescript
// MathMLサポートチェック
const mathMLSupported = typeof MathMLElement !== 'undefined';

if (mathMLSupported) {
  return <math>...</math>;
} else {
  // CSSベースのフォールバック
  return <div className="fraction-fallback">...</div>;
}
```

## 特殊な問題タイプへの対応

### 1. 虫食い算の最適化

```css
/* 印刷時に虫食い算の四角を最適化 */
.missing-number-box {
  width: 1.5rem !important;    /* 24px */
  height: 1.5rem !important;   /* 24px */
  border: 1.5px solid #333 !important;
  vertical-align: text-bottom !important;
}
```

**工夫点**:
- サイズを小さくしつつ、書き込みスペースは確保
- `vertical-align: text-bottom`で行高を統一

### 2. 文章問題の最適化

```typescript
// 文章問題用のコンパクトなスタイル
if (problem.type === 'word') {
  problemsHTML += `<div style="font-size: 12px; line-height: 1.3;">`;
  problemsHTML += problem.problemText;
  problemsHTML += '</div>';
}
```

## パフォーマンス最適化

### 1. DOM操作の最小化

```typescript
// 文字列連結でHTMLを構築し、最後に一度だけDOM操作
let problemsHTML = '';
problems.forEach(problem => {
  problemsHTML += renderProblem(problem);
});
container.innerHTML = headerHTML + problemsHTML + footerHTML;
```

### 2. メモリ効率

```typescript
// 印刷後は必ずクリーンアップ
printContainer.remove();
styleEl.remove();
document.title = originalTitle;
```

## トラブルシューティング

### 1. 2ページに分かれる問題

**原因**: コンテンツの高さがA4サイズを超過

**解決策**:
```typescript
// 問題数を動的に調整
const recommendedCount = isWordProblem 
  ? WORD_PROBLEM_RECOMMENDED[layoutColumns] 
  : MAX_PROBLEMS_PER_COLUMN[layoutColumns];
```

### 2. 印刷時のスタイル崩れ

**原因**: メディアクエリの優先順位

**解決策**:
```css
@media print {
  /* !importantで確実に適用 */
  .problem-text {
    font-size: 14px !important;
  }
}
```

### 3. ブラウザ間の差異

**対策**:
- Chrome/Edge: 標準的な動作
- Firefox: MathMLのネイティブサポートが優秀
- Safari: 印刷ダイアログのカスタマイズ性が高い

## ベストプラクティス

### 1. テスト方法

```javascript
// 印刷プレビューを自動で開く
window.print();

// 実際のPDF生成は手動でテスト
// Chrome: Cmd+P → "PDFとして保存"
```

### 2. デバッグ方法

```css
/* 印刷レイアウトのデバッグ用 */
@media print {
  * {
    border: 1px solid red !important;
  }
}
```

### 3. ユーザビリティの配慮

- 印刷ボタンは目立つ位置に配置
- 複数枚印刷オプションを提供
- 解答の表示/非表示を選択可能に

## まとめ

本プロジェクトのPDF印刷機能は、以下の技術的工夫により実現されています：

1. **ブラウザネイティブ機能の活用**: 外部ライブラリ不要で高品質
2. **動的レイアウト生成**: 印刷専用の最適化されたDOM構造
3. **CSS最適化**: @pageルールとメディアクエリの活用
4. **問題タイプ別の調整**: 文章問題、虫食い算など特殊ケースへの対応
5. **A4サイズ最適化**: 日本の教育現場に適した推奨問題数設定

これらの工夫により、教育現場で実用的な高品質な計算プリントのPDF生成を実現しています。