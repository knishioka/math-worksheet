# MathML評価レポート - 計算プリント生成への適用

## 概要

MathMLは数学的表現のためのW3C標準マークアップ言語で、2024年現在では非常に有力な選択肢となっています。

## ブラウザサポート状況（2024-2025年）

### ✅ 優秀なサポート率：93.9%
- **Chrome**: 109版（2023年1月）以降で完全サポート
- **Firefox**: 全バージョンで完全サポート（最も長い実績）
- **Safari**: 10版以降で完全サポート
- **Edge**: Chromium基盤で完全サポート
- **モバイル**: iOS Safari、Chrome for Androidで強力なサポート

**重要**: Chromeが2023年にMathML Coreを採用したことで、ついに主要ブラウザでの統一サポートが実現しました。

## 基本的な数学表現の例

### 分数表示
```xml
<!-- 単純な分数: 3/4 -->
<math xmlns="http://www.w3.org/1998/Math/MathML">
  <mfrac>
    <mn>3</mn>
    <mn>4</mn>
  </mfrac>
</math>

<!-- 複雑な分数: (2x + 1)/(3y - 2) -->
<math display="block">
  <mfrac>
    <mrow>
      <mn>2</mn><mi>x</mi>
      <mo>+</mo>
      <mn>1</mn>
    </mrow>
    <mrow>
      <mn>3</mn><mi>y</mi>
      <mo>−</mo>
      <mn>2</mn>
    </mrow>
  </mfrac>
</math>
```

### 指数・添字
```xml
<!-- 上付き文字: x² -->
<msup>
  <mi>x</mi>
  <mn>2</mn>
</msup>

<!-- 下付き文字: H₂O -->
<mrow>
  <mi>H</mi>
  <msub><mn>2</mn></msub>
  <mi>O</mi>
</mrow>
```

### 平方根・立方根
```xml
<!-- 平方根 √x -->
<msqrt>
  <mi>x</mi>
</msqrt>

<!-- 立方根 ∛x -->
<mroot>
  <mi>x</mi>
  <mn>3</mn>
</mroot>
```

## 印刷品質について

### 利点
- **ネイティブレンダリング**: ブラウザエンジンが直接描画するため高品質
- **ベクター形式**: 拡大縮小に強い
- **フォント依存なし**: ブラウザ組み込みの数学フォントを使用

### 注意点
- **色空間の問題**: RGBで描画されるため、商業印刷ではCMYK変換が必要
- **一部の記号**: 特殊な数学記号で印刷問題が発生する可能性

### 印刷最適化
```css
@media print {
  /* 数式の改ページ防止 */
  math {
    page-break-inside: avoid;
    color: black !important;
  }
  
  /* 印刷用フォントサイズ */
  body { font-size: 12pt; }
}
```

## 他の手法との比較

| 手法 | パフォーマンス | ブラウザサポート | 印刷品質 | 実装難易度 |
|------|---------------|----------------|---------|-----------|
| **MathML** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ (93.9%) | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **HTML/CSS** | ⭐⭐ | ⭐⭐⭐⭐⭐ (100%) | ⭐⭐⭐ | ⭐⭐ |
| **MathJax** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ (100%) | ⭐⭐ | ⭐⭐⭐⭐ |

## フォールバック戦略

6.1%の非対応ブラウザ向けに：

```javascript
// MathMLサポート検出
function supportsMathML() {
  const div = document.createElement('div');
  div.innerHTML = '<math><mspace height="23px" width="77px"></mspace></math>';
  document.body.appendChild(div);
  const box = div.firstChild.firstChild.getBoundingClientRect();
  document.body.removeChild(div);
  return Math.abs(box.height - 23) <= 1 && Math.abs(box.width - 77) <= 1;
}

// フォールバック実装
if (!supportsMathML()) {
  // MathJaxまたはHTML/CSSにフォールバック
  loadMathJaxPolyfill();
}
```

## 計算プリントプロジェクトへの推奨実装

### 型定義の拡張
```typescript
interface FractionProblem extends BasicProblem {
  type: 'fraction';
  numerator1: number;
  denominator1: number;
  numerator2?: number;
  denominator2?: number;
  answerNumerator: number;
  answerDenominator: number;
}

interface DecimalProblem extends BasicProblem {
  type: 'decimal';
  decimalPlaces: number;
}
```

### MathMLコンポーネント
```typescript
const MathFraction: React.FC<{
  numerator: number;
  denominator: number;
}> = ({ numerator, denominator }) => (
  <math xmlns="http://www.w3.org/1998/Math/MathML">
    <mfrac>
      <mn>{numerator}</mn>
      <mn>{denominator}</mn>
    </mfrac>
  </math>
);
```

### 段階的実装計画
1. **Phase 1**: 基本的な分数表示（mfrac）
2. **Phase 2**: 小数表示の改善
3. **Phase 3**: 混合数（帯分数）の表示
4. **Phase 4**: より複雑な数式（必要に応じて）

## 結論

**MathMLを強く推奨します**：

1. **優秀なブラウザサポート**: 93.9%の対応率
2. **印刷品質**: ネイティブレンダリングで高品質
3. **パフォーマンス**: 最も高速
4. **将来性**: W3C標準で長期サポート保証
5. **アクセシビリティ**: スクリーンリーダー対応

小学校の計算プリントでは、MathMLの`mfrac`要素が分数表示に最適な選択肢です。HTML/CSSよりも美しく、MathJaxよりも高速で印刷品質も優秀です。