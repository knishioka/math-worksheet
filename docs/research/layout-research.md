# 計算プリントの複数列レイアウト実装ガイド

## 1. CSS GridとFlexboxを使ったレスポンシブな列レイアウト

### CSS Grid（推奨：2次元レイアウト向け）

```css
/* 3列レイアウトの例 */
.math-worksheet-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .math-worksheet-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .math-worksheet-grid {
    grid-template-columns: 1fr;
  }
}

/* 印刷時の固定レイアウト */
@media print {
  .math-worksheet-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }
}
```

### Flexbox（1次元レイアウト向け）

```css
/* 複数列のFlexboxレイアウト */
.math-worksheet-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.problem-item {
  flex: 0 1 calc(33.333% - 14px); /* 3列の場合 */
  margin-bottom: 20px;
}

/* 2列レイアウト */
.two-column .problem-item {
  flex: 0 1 calc(50% - 10px);
}

/* 1列レイアウト */
.one-column .problem-item {
  flex: 0 1 100%;
}
```

### CSS Multi-column（テキスト中心のコンテンツ向け）

```css
/* 文章問題用の複数列レイアウト */
.word-problems {
  column-count: 2;
  column-gap: 30px;
  column-rule: 1px solid #ddd;
}

.problem {
  break-inside: avoid;
  margin-bottom: 1.5em;
}
```

## 2. PDFライブラリでの複数列実装方法

### pdfmake（推奨：より細かい制御が可能）

```javascript
// pdfmakeでの3列レイアウト
const docDefinition = {
  content: [
    {
      columns: [
        {
          width: '33%',
          stack: [
            { text: '1) 25 + 17 = ___', margin: [0, 0, 0, 10] },
            { text: '2) 48 - 23 = ___', margin: [0, 0, 0, 10] },
            { text: '3) 15 × 4 = ___', margin: [0, 0, 0, 10] }
          ]
        },
        {
          width: '33%',
          stack: [
            { text: '4) 72 ÷ 8 = ___', margin: [0, 0, 0, 10] },
            { text: '5) 36 + 29 = ___', margin: [0, 0, 0, 10] },
            { text: '6) 91 - 45 = ___', margin: [0, 0, 0, 10] }
          ]
        },
        {
          width: '33%',
          stack: [
            { text: '7) 12 × 7 = ___', margin: [0, 0, 0, 10] },
            { text: '8) 84 ÷ 6 = ___', margin: [0, 0, 0, 10] },
            { text: '9) 53 + 38 = ___', margin: [0, 0, 0, 10] }
          ]
        }
      ],
      columnGap: 20
    }
  ],
  pageSize: 'A4',
  pageMargins: [40, 60, 40, 60]
};
```

### jsPDF（HTML変換に適している）

```javascript
// jsPDFでの実装（HTML to PDF）
const doc = new jsPDF({
  orientation: 'portrait',
  unit: 'mm',
  format: 'a4'
});

// HTMLコンテンツを準備
const htmlContent = `
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
    <div>1) 25 + 17 = ___</div>
    <div>2) 48 - 23 = ___</div>
    <div>3) 15 × 4 = ___</div>
    <!-- 他の問題... -->
  </div>
`;

// html2canvasと組み合わせて使用
doc.html(htmlContent, {
  callback: function (doc) {
    doc.save('math-worksheet.pdf');
  },
  x: 15,
  y: 15,
  width: 180,
  windowWidth: 650
});
```

## 3. 印刷時のページ幅への収まり具合の調整方法

```css
@page {
  size: A4;
  margin: 1.5cm 2cm;
}

@media print {
  html, body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 0;
  }
  
  .worksheet-container {
    width: 100%;
    max-width: 170mm; /* 210mm - (2cm × 2) の余白 */
    margin: 0 auto;
  }
  
  /* 改ページ制御 */
  .problem-set {
    page-break-inside: avoid;
  }
  
  .new-page {
    page-break-before: always;
  }
}
```

## 4. 問題番号の自動採番方法

### CSS Countersを使用した自動採番

```css
/* 基本的な自動採番 */
.worksheet {
  counter-reset: problem-number;
}

.problem::before {
  counter-increment: problem-number;
  content: counter(problem-number) ") ";
  font-weight: bold;
  margin-right: 5px;
}

/* 列ごとに連続した番号を維持 */
.multi-column-worksheet {
  counter-reset: problem;
}

.column {
  /* カウンターは列をまたいで継続 */
}

.problem-item::before {
  counter-increment: problem;
  content: counter(problem) ". ";
  display: inline-block;
  width: 25px;
  text-align: right;
  margin-right: 10px;
}

/* ネストした採番（1.1, 1.2など） */
.section {
  counter-reset: subsection;
}

.section h3::before {
  counter-increment: section;
  content: counter(section) ". ";
}

.subsection::before {
  counter-increment: subsection;
  content: counter(section) "." counter(subsection) " ";
}
```

## 5. 列間のスペーシング調整

### Gap プロパティの使用（モダンブラウザ）

```css
/* Grid Layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px; /* 行と列の両方に適用 */
  /* または個別に指定 */
  row-gap: 15px;
  column-gap: 25px;
}

/* Flexbox (最新ブラウザ) */
.flex-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* Multi-column */
.multi-column {
  column-count: 3;
  column-gap: 30px;
  column-rule: 1px solid #e0e0e0;
}
```

### 旧ブラウザ対応（margin を使用）

```css
/* Flexbox の旧ブラウザ対応 */
.flex-container {
  display: flex;
  flex-wrap: wrap;
  margin: -10px; /* 負のマージンで外側の余白を相殺 */
}

.flex-item {
  flex: 0 1 calc(33.333% - 20px);
  margin: 10px;
}
```

## 6. A4用紙での最適な余白設定

```css
/* 推奨される余白設定 */
@page {
  size: A4; /* 210mm × 297mm */
  margin: 20mm 25mm 20mm 25mm; /* 上 右 下 左 */
}

/* 用途別の余白設定 */

/* 標準的な計算プリント */
.standard-worksheet {
  margin: 15mm 20mm; /* 上下15mm、左右20mm */
}

/* ファイリング用（左余白を広く） */
.filing-worksheet {
  margin: 15mm 15mm 15mm 30mm;
}

/* 最大限コンテンツを活用 */
.compact-worksheet {
  margin: 10mm 15mm;
}

/* ヘッダー・フッター付き */
.with-header-footer {
  margin: 25mm 20mm; /* 上下に余裕を持たせる */
}
```

## 7. 実際の計算プリントでよく使われるレイアウトパターン

### パターン1: 基本計算練習（3列レイアウト）

```css
.basic-math-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px 30px;
  font-size: 14pt;
  line-height: 2.5;
}

.problem {
  display: flex;
  align-items: baseline;
  border-bottom: 1px solid #333;
  padding-bottom: 3px;
}
```

### パターン2: 筆算用レイアウト（2列）

```css
.calculation-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px 40px;
}

.calculation-box {
  border: 1px solid #ccc;
  padding: 20px;
  min-height: 100px;
  position: relative;
}

.calculation-box::before {
  content: attr(data-number);
  position: absolute;
  top: -10px;
  left: 10px;
  background: white;
  padding: 0 5px;
  font-size: 12px;
}
```

### パターン3: 文章題レイアウト（1列）

```css
.word-problem-layout {
  max-width: 600px;
  margin: 0 auto;
}

.word-problem {
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.answer-area {
  margin-top: 15px;
  border: 2px solid #333;
  min-height: 60px;
  padding: 10px;
  background: white;
}
```

### パターン4: 混合レイアウト（ヘッダー + 複数セクション）

```css
.mixed-layout {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
}

.problems-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

@media print {
  .problems-section {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 実装時のベストプラクティス

1. **印刷プレビューでの確認**: 必ず印刷プレビューで実際の出力を確認
2. **単位の統一**: 印刷用にはmm、cm、ptなどの絶対単位を使用
3. **フォントサイズ**: 小学生向けは14pt以上、中高生向けは12pt程度
4. **行間**: 手書きスペースは line-height: 2.5〜3 を確保
5. **カラー**: 印刷コストを考慮し、基本は白黒で設計
6. **改ページ**: 問題が途中で切れないよう page-break-inside: avoid を使用
7. **余白のバランス**: ファイリングや書き込みスペースを考慮した余白設定

## サンプルコード（完全な実装例）

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <title>計算プリント</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    @media print {
      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        font-family: "游明朝", "Yu Mincho", serif;
      }
      
      .no-print {
        display: none !important;
      }
    }
    
    body {
      font-size: 14pt;
      line-height: 1.8;
      color: #000;
      background: #fff;
    }
    
    .worksheet {
      max-width: 170mm;
      margin: 0 auto;
      counter-reset: problem;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 10px;
      border-bottom: 2px solid #000;
    }
    
    .problems {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px 25px;
    }
    
    .problem {
      display: flex;
      align-items: baseline;
      page-break-inside: avoid;
    }
    
    .problem::before {
      counter-increment: problem;
      content: counter(problem) ") ";
      font-weight: bold;
      margin-right: 8px;
      min-width: 25px;
    }
    
    .problem-content {
      flex: 1;
      border-bottom: 1px solid #666;
      padding-bottom: 2px;
      min-height: 30px;
    }
    
    @media screen {
      body {
        padding: 20px;
        background: #f0f0f0;
      }
      
      .worksheet {
        background: white;
        padding: 30px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    }
  </style>
</head>
<body>
  <div class="worksheet">
    <div class="header">
      <h1>たし算・ひき算の練習</h1>
      <p>名前: _____________ 日付: _____________</p>
    </div>
    
    <div class="problems">
      <div class="problem">
        <div class="problem-content">25 + 17 = </div>
      </div>
      <div class="problem">
        <div class="problem-content">48 - 23 = </div>
      </div>
      <div class="problem">
        <div class="problem-content">36 + 29 = </div>
      </div>
      <!-- 他の問題を追加 -->
    </div>
  </div>
</body>
</html>
```

このガイドに従って実装することで、見やすく使いやすい計算プリントを作成できます。