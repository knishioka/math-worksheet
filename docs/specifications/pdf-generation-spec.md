# PDF・印刷出力仕様書

## 📋 概要
**最終更新**: 2024年12月
**対応方式**: ブラウザネイティブ印刷（MathML + HTML/CSS）
**PDF生成**: 段階的実装予定

ブラウザ上で動作する計算プリントの印刷・PDF出力に関する技術仕様

## 🎯 現在の実装方式（v2.0）

### ブラウザネイティブ印刷
- **採用理由**:
  - ✅ MathMLネイティブサポート（93.9%ブラウザ）
  - ✅ ゼロ依存性（外部ライブラリ不要）
  - ✅ 高品質出力（ベクター形式）
  - ✅ 軽量・高速（JavaScriptエンジン不要）
  - ✅ A4サイズ完全対応

### 技術スタック
```typescript
// MathMLネイティブ表示（93.9%ブラウザ）
<math>
  <mfrac>
    <mn>{numerator}</mn>
    <mn>{denominator}</mn>
  </mfrac>
</math>

// HTML/CSSフォールバック（6.1%ブラウザ）
<div className="fraction-fallback">
  <span className="numerator">{numerator}</span>
  <span className="fraction-line"></span>
  <span className="denominator">{denominator}</span>
</div>
```

## 🔮 将来の拡張計画

### PDF生成ライブラリ（v3.0予定）
- **候補1: pdfmake**
  - 宣言的API、複数列サポート
  - 日本語フォント対応
  - **課題**: MathML非対応

- **候補2: pdf-lib**
  - 細かい制御可能
  - **課題**: 複雑なレイアウト実装

## 🎨 フォント・文字表示仕様

### 現在の実装
```css
/* システムフォント使用（軽量・高速） */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
             'Apple Color Emoji', 'Segoe UI Emoji';
```

### MathML表示
- **ネイティブレンダリング**: ブラウザ標準の数学フォント
- **品質**: ベクター形式で拡大縮小対応
- **パフォーマンス**: JavaScript不要の高速表示

### 将来の日本語フォント対応
- **Noto Sans JP**: Google製無料フォント（16MB）
- **最適化**: サブセット化で小学生用漢字のみ（約2MB）
- **読み込み**: Web Font Loaderで非同期読み込み

## 📐 レイアウト仕様

### 用紙・印刷設定
```css
@media print {
  @page {
    size: A4;           /* 210mm × 297mm */
    margin: 1cm 1.5cm;  /* 上下1cm、左右1.5cm */
  }
}
```

### 複数列レイアウト（Tailwind CSS Grid）
```typescript
// 1列レイアウト（20問まで）
<div className="grid grid-cols-1 gap-4">

// 2列レイアウト（30問まで）
<div className="grid grid-cols-2 gap-6">

// 3列レイアウト（42問まで）
<div className="grid grid-cols-3 gap-4">
```

### 問題間隔調整
```css
.problem-item {
  margin-bottom: 0.75rem;  /* 3列時の最適間隔 */
  page-break-inside: avoid; /* 問題の途中改ページ防止 */
}
```

## 📄 ヘッダー・フッター仕様

### ヘッダー構成（実装済み）
```tsx
<div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-gray-800">
  <div className="flex-1">
    名前：<span className="border-b border-gray-800 inline-block w-32 h-6"></span>
  </div>
  <div className="flex-1 text-center">
    日付：<span className="border-b border-gray-800 inline-block w-24 h-6"></span>
  </div>
  <div className="flex-1 text-right">
    点数：<span className="border-b border-gray-800 inline-block w-16 h-6"></span>点
  </div>
</div>
```

### ブラウザフッター非表示
```css
@media print {
  /* URLとページ番号を非表示 */
  @page { margin: 0; }
  html { margin: 1cm 1.5cm; }
}
```

## 🔢 問題表示仕様

### 基本計算（整数）
```tsx
<div className="flex items-center space-x-2">
  <span className="font-mono text-base">
    ({index + 1}) {operand1} {operatorSymbol} {operand2} = 
  </span>
  <span className="border-b border-gray-800 inline-block w-20 h-6"></span>
</div>
```

### 分数計算（MathML）
```tsx
<div className="flex items-center space-x-2">
  <span>({index + 1})</span>
  <math xmlns="http://www.w3.org/1998/Math/MathML">
    <mfrac>
      <mn>{numerator1}</mn>
      <mn>{denominator1}</mn>
    </mfrac>
    <mo>{operatorSymbol}</mo>
    <mfrac>
      <mn>{numerator2}</mn>
      <mn>{denominator2}</mn>
    </mfrac>
    <mo>=</mo>
  </math>
  <span className="border-b border-gray-800 inline-block w-24 h-6"></span>
</div>
```

### 小数計算
```tsx
<div className="flex items-center space-x-2">
  <span className="font-mono text-base">
    ({index + 1}) {operand1.toFixed(decimalPlaces)} {operatorSymbol} {operand2.toFixed(decimalPlaces)} = 
  </span>
  <span className="border-b border-gray-800 inline-block w-24 h-6"></span>
</div>
```

## 🖨️ 印刷最適化

### 印刷専用CSS（実装済み）
```css
@media print {
  /* A4サイズ設定 */
  @page {
    size: A4;
    margin: 0;
  }
  
  /* マージン調整 */
  html {
    margin: 1cm 1.5cm;
  }
  
  /* UI要素非表示 */
  .no-print {
    display: none !important;
  }
  
  /* ページ分割制御 */
  .problem-item {
    page-break-inside: avoid;
  }
  
  /* 色彩保持 */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  /* MathML最適化 */
  math {
    font-size: 1.1em;
    line-height: 1.4;
  }
}
```

### 列数別問題数制限
```typescript
const getMaxProblems = (columns: number): number => {
  switch (columns) {
    case 1: return 20;  // A4に収まる最大数
    case 2: return 30;  // 2列レイアウト最適
    case 3: return 42;  // 3列レイアウト最適
    default: return 20;
  }
};
```

## ⚡ パフォーマンス要件

### 現在の実績
- ✅ **問題生成**: 42問（最大）を瞬時生成
- ✅ **メモリ使用**: 50MB未満（従来比1/4）
- ✅ **ファイルサイズ**: 依存性ゼロ（軽量）
- ✅ **印刷時間**: 1秒以内

### MathMLパフォーマンス
```typescript
// ネイティブレンダリング（高速）
render: () => <math>...</math>  // 0ms

// 従来のJavaScript描画（重い）
render: () => katex.render(...) // 100-500ms
```

## 🛡️ ブラウザ互換性・エラーハンドリング

### MathML対応状況
- ✅ **Chrome 114+**: ネイティブサポート
- ✅ **Firefox**: 長期サポート
- ✅ **Safari 14+**: ネイティブサポート
- ✅ **Edge 114+**: ネイティブサポート
- ⚠️ **旧ブラウザ**: HTML/CSS自動フォールバック

### フォールバック機能
```tsx
const MathFraction = ({ numerator, denominator }) => {
  // MathML対応チェック
  if (supportsMathML()) {
    return (
      <math>
        <mfrac><mn>{numerator}</mn><mn>{denominator}</mn></mfrac>
      </math>
    );
  }
  
  // フォールバック表示
  return (
    <div className="fraction-fallback">
      <span className="numerator">{numerator}</span>
      <span className="denominator">{denominator}</span>
    </div>
  );
};
```

## 🔐 セキュリティ・プライバシー仕様

### データ保護
- ✅ **完全クライアントサイド**: サーバー送信一切なし
- ✅ **個人情報非保存**: ローカルストレージ使用せず
- ✅ **外部通信ゼロ**: CDN依存なし
- ✅ **ゼロトラッキング**: アナリティクス一切なし

### 技術的セキュリティ
- ✅ **CSP対応**: Content Security Policy準拠
- ✅ **XSS防止**: TypeScript型安全性
- ✅ **HTTPS必須**: 本番環境での暗号化通信