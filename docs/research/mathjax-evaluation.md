# MathJax評価レポート - 計算プリント生成への適用

## 概要

MathJaxは数式をウェブ上で美しく表示するためのJavaScriptライブラリですが、印刷用途では注意が必要です。

## 印刷時の問題点

### 1. **フォント読み込みの問題**
- カスタムフォントがPDF生成時に正しく読み込まれない
- 結果として数式が文字化けすることがある

### 2. **レンダリングタイミング**
- PDF生成ツールがMathJaxの描画完了を待たない
- 「Processing math: X%」のような未完成状態で印刷される

### 3. **プラットフォーム依存性**
- macOSでは高品質、Ubuntuでは低品質など、OS間で差がある
- ブラウザによっても表示が異なる（Firefox on Linuxで上線が消えるなど）

## 推奨される解決策

### 1. **SVG出力モードを使用**
```javascript
window.MathJax = {
  output: 'svg',  // フォント問題を回避
  scale: 1.2      // 印刷用にサイズ調整
};
```

### 2. **代替案：KaTeX**
- MathJaxより20-30倍高速
- 印刷品質が安定
- 基本的な数式には十分な機能

### 3. **シンプルな数式にはHTML/CSS**
分数などの基本的な表現には純粋なHTML/CSSが最も確実：

```html
<span class="fraction">
  <span class="numerator">3</span>
  <span class="denominator">4</span>
</span>
```

```css
.fraction {
  display: inline-block;
  vertical-align: middle;
  text-align: center;
}
.fraction .numerator {
  display: block;
  border-bottom: 1px solid black;
  padding: 0 0.2em;
}
.fraction .denominator {
  display: block;
  padding: 0 0.2em;
}
```

## 計算プリントプロジェクトへの推奨

### 現在の要件に基づく推奨

1. **小学校レベルの基本的な分数**
   - HTML/CSSで実装（最も確実で高速）
   - 印刷品質が保証される
   - 実装が簡単

2. **将来的に複雑な数式が必要になった場合**
   - KaTeXを第一選択として検討
   - 必要に応じてMathJax 3（SVGモード）を使用

### 実装方針

```typescript
// 分数の型定義を追加
interface FractionProblem {
  id: string;
  type: 'fraction';
  operation: Operation;
  numerator1: number;
  denominator1: number;
  numerator2: number;
  denominator2: number;
  answerNumerator: number;
  answerDenominator: number;
}

// 小数の型定義を追加
interface DecimalProblem {
  id: string;
  type: 'decimal';
  operation: Operation;
  operand1: number;  // 12.5 など
  operand2: number;  // 3.7 など
  answer: number;
  decimalPlaces: number;
}
```

## 結論

現時点では、MathJaxやKaTeXの導入は必要ありません。小学校の計算プリントで必要な分数・小数表現は、HTML/CSSで十分に実現可能で、かつ印刷品質も保証されます。

将来的により複雑な数式表現が必要になった場合は、以下の優先順位で検討：
1. HTML/CSS（基本的な表現）
2. KaTeX（中程度の複雑さ）
3. MathJax 3 SVGモード（高度な数式）