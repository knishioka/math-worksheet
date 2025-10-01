# CLAUDE.md - 計算プリント自動作成サービス開発ガイド

## 📚 プロジェクト概要

**プロジェクト名**: 計算プリント自動作成サービス
**バージョン**: v2.0.0 (MathML対応版)
**最終更新**: 2024年12月
**実装完了率**: 85%

フロントエンドで完結する小学校算数カリキュラム対応の計算プリント自動生成システムです。**MathMLネイティブ対応**により、93.9%のブラウザで高品質な数式表示を実現。分数・小数・整数の四則演算に完全対応し、A4印刷に最適化されています。

### 🎯 主要機能（2024年12月実装完了）
- ✅ **MathML数式表示**: 93.9%ブラウザ対応 + 6.1%フォールバック
- ✅ **学年別カリキュラム**: 1〜6年生完全対応
- ✅ **分数・小数計算**: GCD/LCM算法、精度保証
- ✅ **印刷最適化**: A4レイアウト、3列まで対応
- ✅ **54テストスイート**: 100%パス、境界値テスト含む

## 開発規約

### コーディング規約

#### TypeScript
- strictモードを有効にする
- 型定義は明示的に行う（anyの使用は避ける）
- interfaceを優先的に使用（typeは合併型や交差型の場合のみ）
- 非同期処理はasync/awaitを使用

```typescript
// Good: 明示的な型定義（2024年12月版）
interface FractionProblem {
  id: string;
  type: 'fraction';
  operation: Operation;
  numerator1: number;
  denominator1: number;
  numerator2?: number;
  denominator2?: number;
  answerNumerator: number;
  answerDenominator: number;
  simplified?: boolean;
}

// Bad: any型の使用
type Problem = any;
```

#### React
- 関数コンポーネントを使用
- カスタムフックで共通ロジックを抽出
- メモ化（useMemo, useCallback）を適切に使用
- コンポーネントは単一責任の原則に従う

```typescript
// Good: MathML対応コンポーネント（2024年12月版）
const FractionProblem: React.FC<FractionProblemProps> = ({ problem }) => {
  const mathMLSupported = useMemo(() => 
    typeof MathMLElement !== 'undefined', []
  );
  
  if (mathMLSupported) {
    return (
      <math xmlns="http://www.w3.org/1998/Math/MathML">
        <mfrac>
          <mn>{problem.numerator1}</mn>
          <mn>{problem.denominator1}</mn>
        </mfrac>
      </math>
    );
  }
  
  // フォールバック表示
  return <div className="fraction-fallback">...</div>;
};
```

#### 命名規則
- コンポーネント: PascalCase
- 関数・変数: camelCase
- 定数: UPPER_SNAKE_CASE
- 型・インターフェース: PascalCase
- ファイル名: コンポーネントはPascalCase、その他はkebab-case

### テスト規約

#### 単体テスト
- すべてのユーティリティ関数にテストを書く
- 問題生成ロジックは境界値テストを含める
- React Testing Libraryを使用したコンポーネントテスト

```typescript
// 例: 分数問題生成のテスト（2024年12月版）
describe('generateFractionProblem', () => {
  it('should generate valid fraction addition', () => {
    const problem = generateFractionProblem({
      grade: 3,
      operation: 'addition',
      problemType: 'fraction'
    });
    expect(problem.answerNumerator).toBeGreaterThan(0);
    expect(problem.answerDenominator).toBeGreaterThan(0);
  });
  
  it('should automatically simplify fractions', () => {
    // 2/4 + 1/4 = 3/4 (not 3/4)
    const problem = generateFractionProblem({
      grade: 5,
      operation: 'addition'
    });
    expect(gcd(problem.answerNumerator, problem.answerDenominator)).toBe(1);
  });
});
```

#### 統合テスト
- ✅ **MathML表示確認**: 93.9%ブラウザでの数式表示
- ✅ **印刷レイアウト**: A4サイズでの出力確認
- ✅ **フォールバック動作**: 非対応ブラウザでのCSS表示
- ✅ **複数ブラウザ**: Chrome, Firefox, Safari, Edge対応
- ✅ **学年別カリキュラム**: 6学年すべての問題生成確認

#### Playwright MCP による動作確認（必須）

**重要**: レイアウト変更やUI実装が完了したら、**必ずPlaywright MCPで動作確認**してください。

##### 確認手順

1. **開発サーバーが起動していることを確認**
   ```bash
   npm run dev  # http://localhost:5174/ で起動
   ```

2. **Playwright MCPでブラウザ操作**
   ```typescript
   // 1. ページを開く
   await mcp__playwright__browser_navigate({ url: 'http://localhost:5174/' });

   // 2. 学年を選択（例: 2年生）
   await mcp__playwright__browser_select_option({
     element: '学年 combobox',
     values: ['2年生']
   });

   // 3. 問題タイプを選択（例: 筆算）
   await mcp__playwright__browser_click({
     element: '2桁のたし算の筆算 container'
   });

   // 4. スクリーンショットを撮影
   await mcp__playwright__browser_take_screenshot({
     filename: 'hissan-layout-check.png',
     type: 'png'
   });
   ```

3. **確認項目**
   - UIが期待通りに表示されているか
   - 問題数の選択肢が正しいか（問題タイプごとの最大値）
   - レイアウトが崩れていないか
   - 印刷プレビューが正常に開くか

4. **トラブルシューティング**
   ```bash
   # Playwright MCPがエラーになる場合
   # 1. Playwrightプロセスをクリーンアップ
   pkill -f "playwright"

   # 2. Claude Codeを再起動
   # 3. 再度Playwright MCPで確認
   ```

##### 確認が必須なケース
- ✅ レイアウト変更（列数、行間、フォントサイズなど）
- ✅ 新しい問題タイプの追加
- ✅ print-templates.tsの設定変更
- ✅ 問題数の最大値変更
- ✅ 印刷機能の修正
- ✅ UIコンポーネントの修正

### Lint規約

#### ESLint設定
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react/prop-types": "off"
  }
}
```

#### Prettier設定
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

### Git規約

#### コミットメッセージ
```
<type>(<scope>): <subject>

<body>

<footer>
```

- type: feat, fix, docs, style, refactor, test, chore
- scope: コンポーネント名や機能名
- subject: 変更内容の要約（50文字以内）

例:
```
feat(generator): add multiplication problem generator

- Implement basic multiplication logic
- Add carry over support
- Include tests for edge cases
```

#### ブランチ戦略
- main: 本番環境
- develop: 開発環境
- feature/*: 新機能開発
- fix/*: バグ修正
- refactor/*: リファクタリング

### プッシュ前チェックリスト

1. **Lintチェック**
   ```bash
   npm run lint
   ```

2. **型チェック**
   ```bash
   npm run typecheck
   ```

3. **テスト実行**
   ```bash
   npm run test
   ```

4. **ビルド確認**
   ```bash
   npm run build
   ```

## 🎨 プリントテンプレートシステム（2025年1月導入）

### 概要
問題タイプごとに最適化されたレイアウト設定を提供するテンプレートシステム。新しい問題タイプの追加時に一貫性のあるレイアウトを保証し、保守性を向上させます。

### テンプレート定義
`src/config/print-templates.ts`

```typescript
interface PrintTemplate {
  type: ProblemType;              // 問題タイプ
  displayName: string;            // 表示名
  description: string;            // 説明
  layout: {
    rowGap: string;               // 行間隔
    colGap: string;               // 列間隔
    fontSize: string;             // フォントサイズ
    minProblemHeight: string;     // 問題の最小高さ
  };
  recommendedCounts: Record<LayoutColumns, number>;  // 推奨問題数
  maxCounts: Record<LayoutColumns, number>;          // 最大問題数
  fitsInA4: {
    threshold: Record<LayoutColumns, number>;        // A4 1枚に収まる閾値
  };
}
```

### 現在のテンプレート

| 問題タイプ | rowGap | colGap | fontSize | 推奨問題数 (1/2/3列) |
|-----------|--------|--------|----------|---------------------|
| `basic` (基本計算) | 24px | 32px | 18px | 10/20/30 |
| `fraction` (分数) | 24px | 32px | 18px | 10/18/27 |
| `decimal` (小数) | 24px | 32px | 18px | 10/20/30 |
| `mixed` (帯分数) | 24px | 32px | 18px | 8/16/24 |
| `missing` (虫食い算) | 18px | 32px | 18px | 10/20/30 |
| `word` (文章問題) | 12px | 20px | 16px | 8/16/24 |
| `hissan` (筆算) | 40px | 32px | 18px | 6/12/18 |

### 使用方法

#### 1. テンプレートの取得
```typescript
import { getPrintTemplate, detectPrimaryProblemType } from '@/config/print-templates';

// 問題タイプから直接取得
const template = getPrintTemplate('word');

// 問題配列から自動判定
const primaryType = detectPrimaryProblemType(problems);
const template = getPrintTemplate(primaryType);
```

#### 2. レイアウト設定の適用
```typescript
const { rowGap, colGap, fontSize } = template.layout;
const gridStyle = `display: grid; gap: ${rowGap} ${colGap};`;
```

#### 3. 推奨問題数の取得
```typescript
const recommendedCount = template.recommendedCounts[layoutColumns];
const maxCount = template.maxCounts[layoutColumns];
```

#### 4. A4判定
```typescript
import { fitsInA4 } from '@/config/print-templates';

const willFit = fitsInA4('word', 2, 16); // true
```

### 新しい問題タイプの追加手順

1. **型定義の追加** (`src/types/index.ts`)
```typescript
export type ProblemType =
  | 'basic'
  | 'fraction'
  // ...
  | 'new-type';  // 追加
```

2. **テンプレート定義の追加** (`src/config/print-templates.ts`)
```typescript
export const PRINT_TEMPLATES: Record<ProblemType, PrintTemplate> = {
  // ... 既存のテンプレート
  'new-type': {
    type: 'new-type',
    displayName: '新しい問題',
    description: '新しい問題タイプの説明',
    layout: {
      rowGap: '24px',
      colGap: '32px',
      fontSize: '18px',
      minProblemHeight: '50px',
    },
    recommendedCounts: { 1: 10, 2: 20, 3: 30 },
    maxCounts: { 1: 10, 2: 20, 3: 30 },
    fitsInA4: {
      threshold: { 1: 10, 2: 20, 3: 30 },
    },
  },
};
```

3. **問題生成ロジックの実装** (`src/lib/generators/`)
4. **表示コンポーネントの実装** (`src/components/`)
5. **テストの追加** (`*.test.ts`)

### テンプレートの調整指針

- **rowGap**: 問題の高さに応じて調整（高い問題ほど狭く）
- **colGap**: 横幅の広い問題は広めに設定
- **fontSize**: 問題の複雑さに応じて調整（文章問題は小さめ）
- **推奨問題数**: A4用紙1枚に快適に収まる数
- **最大問題数**: 物理的に収まる限界値

### メリット

1. **一貫性**: すべての問題タイプで統一されたレイアウトルール
2. **保守性**: 1箇所の修正で全体に反映
3. **拡張性**: 新しい問題タイプの追加が容易
4. **テスト容易性**: テンプレートごとに独立してテスト可能

## 実装のコツ

### 問題生成ロジック（2024年12月アップデート）
1. **カリキュラム準拠**: 日本の学習指導要領完全対応
2. **数学的正確性**: 
   - 分数: GCD/LCM算法による正確な約分・通分
   - 小数: 精度保証ラウンド処理
   - 整数: 桁数制御と繰り上がり/繰り下がり管理
3. **学年別制限**: 
   ```typescript
   const isOperationAvailable = (grade: Grade, op: Operation) => {
     if (grade === 1 && ['multiplication', 'division'].includes(op)) return false;
     if (grade === 2 && op === 'division') return false;
     return true;
   };
   ```
4. **バリエーション**: 同一パターン回避アルゴリズム

### レイアウト実装（MathML最適化）
1. **印刷最優先設計**: 
   ```css
   @media print {
     @page { size: A4; margin: 0; }
     html { margin: 1cm 1.5cm; }
     .problem-item { page-break-inside: avoid; }
   }
   ```
2. **MathML表示最適化**: 
   - ネイティブ数式レンダリング（軽量・高速）
   - 自動フォールバック（100%ブラウザ対応）
3. **レスポンシブレイアウト**: 
   - 1列: 20問（A4最適）
   - 2列: 30問（バランス重視）
   - 3列: 42問（最大密度）
4. **答案スペース**: 下線による記入欄確保

### パフォーマンス最適化（ネイティブ実装）
1. **ゼロ依存性**: 外部ライブラリ不使用（軽量化）
2. **MathMLネイティブ**: JavaScript数式エンジン不要
   ```typescript
   // 従来: 重いJavaScript描画
   katex.render(expression, element); // 100-500ms
   
   // 現在: ネイティブレンダリング
   <math>...</math> // 0ms
   ```
3. **メモリ効率**: 50MB未満（従来の1/4）
4. **瞬時生成**: 42問を瞬時に生成

### エラーハンドリング（ロバスト設計）
1. **MathMLフォールバック**: 
   ```typescript
   const MathFraction = ({ numerator, denominator }) => {
     if (typeof MathMLElement !== 'undefined') {
       return <math><mfrac>...</mfrac></math>;
     }
     return <div className="fraction-fallback">...</div>;
   };
   ```
2. **学年制限**: 未対応演算の自動非表示
3. **境界値処理**: 分母0回避、負数制御
4. **TypeScript型安全**: 実行時エラー最小化

## 🔧 トラブルシューティング（2024年12月版）

### よくある問題と解決策

1. **MathMLが表示されない**
   ```typescript
   // 対処法: ブラウザサポート確認
   if (typeof MathMLElement === 'undefined') {
     console.log('MathML非対応 → フォールバック表示');
   }
   ```

2. **印刷時にレイアウトが崩れる**
   ```css
   /* 対処法: 印刷CSS確認 */
   @media print {
     .no-print { display: none !important; }
     math { font-size: 1.1em; }
   }
   ```

3. **問題生成でエラーが発生**
   ```typescript
   // 対処法: 学年制限確認
   const canGenerate = isOperationAvailable(grade, operation) && 
                      isProblemTypeAvailable(grade, problemType);
   ```

4. **テストが失敗する**
   ```bash
   # 対処法: 依存関係と型チェック
   npm run typecheck
   npm run lint
   npm test
   ```

## 📖 開発リソース

### プロジェクト文書
- 📋 [**実装状況レポート**](/docs/implementation-status.md): 現在の実装完了率85%
- 📏 [**カリキュラム仕様**](/docs/specifications/curriculum-spec.md): 学年別学習内容
- 🖨️ [**印刷・PDF仕様**](/docs/specifications/pdf-generation-spec.md): MathML印刷対応
- 📐 [**レイアウト仕様**](/docs/specifications/layout-spec.md): A4最適化
- 🔬 [**技術調査レポート**](/docs/research/): MathML vs KaTeX比較
- 🗺️ [**実装計画**](/docs/plans/implementation-plan.md): ロードマップ

### 開発コマンド
```bash
# 開発環境
npm run dev         # 開発サーバー起動
npm run build       # 本番ビルド

# 品質チェック
npm run test        # 54テスト実行
npm run typecheck   # TypeScript型チェック
npm run lint        # ESLintチェック

# プッシュ前必須
npm run test && npm run typecheck && npm run lint
```

### 技術スタック詳細
- **React 18** + **TypeScript 5**: Strictモード
- **Vite**: 高速ビルド
- **Tailwind CSS v3**: 印刷最適化
- **MathML**: W3C標準数式マークアップ
- **Vitest**: 54テストケース
- **Zustand**: 軽量状態管理

## 📞 サポート・連絡先

- **GitHub Issues**: バグ報告・機能要望
- **GitHub Discussions**: 技術相談・質問
- **Pull Requests**: コード貢献歓迎

### 貢献ガイドライン
1. 🐛 **バグ報告**: 再現手順・環境情報を詳記
2. ✨ **機能提案**: 教育的価値・実装可能性を検討
3. 🔧 **コード貢献**: 本ガイド遵守・テスト必須
4. 📝 **文書改善**: 分かりやすさ・正確性を重視