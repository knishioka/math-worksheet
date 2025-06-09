# PDF生成仕様書

## 概要
ブラウザ上で動作する計算プリントのPDF生成に関する技術仕様

## 選定技術

### 主要ライブラリ: pdfmake
- **理由**: 
  - 宣言的APIで複雑なレイアウトが簡単
  - 複数列レイアウトのネイティブサポート
  - 日本語フォント対応
  - ヘッダー/フッターの自動処理

### 代替案: pdf-lib
- **使用場面**: より細かい制御が必要な場合（筆算の精密な配置など）

## 日本語フォント仕様

### フォント選定
- **Noto Sans JP**: Google製の無料日本語フォント
- **サイズ**: Regular版で約16MB（圧縮前）

### 最適化方法
1. **サブセット化**: 使用する文字のみを抽出
2. **Web Font Loader**: 非同期読み込み
3. **キャッシュ**: Service Workerでのキャッシュ

## レイアウト仕様

### 用紙サイズ
- **A4**: 210mm × 297mm
- **解像度**: 72 DPI（Web標準）

### 余白設定
```javascript
const margins = {
  top: 20,     // 20mm
  bottom: 20,  // 20mm
  left: 25,    // 25mm（ファイリング考慮）
  right: 20    // 20mm
};
```

### 複数列レイアウト
```javascript
// pdfmakeでの実装例
columns: [
  { width: '33%', text: '問題1' },
  { width: '33%', text: '問題2' },
  { width: '33%', text: '問題3' }
]
```

## ヘッダー/フッター仕様

### ヘッダー構成
```javascript
header: {
  columns: [
    { text: '名前：＿＿＿＿＿＿＿＿', alignment: 'left' },
    { text: '日付：＿＿年＿＿月＿＿日', alignment: 'center' },
    { text: '点数：＿＿＿点', alignment: 'right' }
  ],
  margin: [25, 10, 20, 10]
}
```

### フッター構成
- ページ番号（複数ページの場合）
- 著作権表示（必要に応じて）

## 問題レイアウト仕様

### 基本計算
```javascript
{
  text: '(1) 12 + 8 = ____',
  fontSize: 14,
  margin: [0, 5, 0, 5]
}
```

### 筆算レイアウト
```javascript
{
  table: {
    widths: ['auto', 'auto', 'auto'],
    body: [
      [' ', ' ', '1', '2'],
      ['+', ' ', ' ', '8'],
      [{colSpan: 4, text: '────'}],
      [' ', ' ', ' ', ' ']
    ]
  },
  layout: 'noBorders'
}
```

## 印刷最適化

### CSS設定
```css
@media print {
  @page {
    size: A4;
    margin: 0;
  }
  
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

### ページ分割制御
```javascript
pageBreak: 'avoid'  // 問題の途中での改ページを防ぐ
```

## パフォーマンス要件

1. **生成時間**: 100問以内で3秒以内
2. **ファイルサイズ**: フォント含めて5MB以内
3. **メモリ使用**: 最大200MB

## エラーハンドリング

1. **フォント読み込みエラー**: フォールバックフォントを使用
2. **メモリ不足**: 問題数を分割して処理
3. **ブラウザ互換性**: Chrome, Firefox, Safari, Edgeで動作保証

## セキュリティ考慮事項

1. **クライアントサイド完結**: サーバーへのデータ送信なし
2. **ローカルストレージ**: 個人情報は保存しない
3. **外部リソース**: CDNからのフォント読み込みのみ