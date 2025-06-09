# CLAUDE.md - 計算プリント自動作成サービス開発ガイド

## プロジェクト概要
このプロジェクトは、フロントエンドで完結する計算プリント自動作成サービスです。小学校の算数カリキュラムに対応した問題を生成し、PDFとして出力できます。

## 開発規約

### コーディング規約

#### TypeScript
- strictモードを有効にする
- 型定義は明示的に行う（anyの使用は避ける）
- interfaceを優先的に使用（typeは合併型や交差型の場合のみ）
- 非同期処理はasync/awaitを使用

```typescript
// Good
interface Problem {
  id: string;
  type: ProblemType;
  question: string;
  answer: number;
}

// Bad
type Problem = any;
```

#### React
- 関数コンポーネントを使用
- カスタムフックで共通ロジックを抽出
- メモ化（useMemo, useCallback）を適切に使用
- コンポーネントは単一責任の原則に従う

```typescript
// Good
const ProblemItem: React.FC<ProblemItemProps> = ({ problem }) => {
  const formattedProblem = useMemo(() => 
    formatProblem(problem), [problem]
  );
  
  return <div>{formattedProblem}</div>;
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
// 例: 問題生成関数のテスト
describe('generateAdditionProblem', () => {
  it('should generate problem within specified range', () => {
    const problem = generateAdditionProblem({ max: 10 });
    expect(problem.answer).toBeLessThanOrEqual(10);
  });
  
  it('should handle carry over correctly', () => {
    const problem = generateAdditionProblem({ 
      carryOver: true,
      digits: [1, 1]
    });
    expect(problem.answer).toBeGreaterThanOrEqual(10);
  });
});
```

#### 統合テスト
- PDF生成の出力確認
- レイアウトの崩れチェック
- 複数ブラウザでの動作確認

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

## 実装のコツ

### 問題生成ロジック
1. **再現性の確保**: シード値を使って同じ問題セットを再生成可能に
2. **教育的配慮**: 段階的な難易度上昇を考慮
3. **バリエーション**: 同じパターンの問題が連続しないよう工夫

### レイアウト実装
1. **印刷最優先**: 画面表示より印刷時のレイアウトを重視
2. **余白の確保**: 手書きスペースは十分に取る
3. **可読性**: フォントサイズは最低12pt以上

### パフォーマンス最適化
1. **遅延読み込み**: 日本語フォントは必要時のみ読み込む
2. **メモ化**: 問題生成結果をキャッシュ
3. **バッチ処理**: 大量の問題生成時は分割処理

### エラーハンドリング
1. **ユーザーフレンドリー**: エラーメッセージは分かりやすく
2. **フォールバック**: PDF生成失敗時はHTML表示に切り替え
3. **ログ収集**: エラー情報は開発時のみコンソールに出力

## トラブルシューティング

### よくある問題と解決策

1. **日本語が表示されない**
   - フォントが正しく読み込まれているか確認
   - Base64エンコーディングが正しいか確認

2. **レイアウトが崩れる**
   - CSS Resetが適用されているか確認
   - 印刷用CSSが正しく設定されているか確認

3. **メモリ不足エラー**
   - 問題数を減らして生成
   - フォントのサブセット化を検討

## リソース

- [プロジェクト仕様書](/docs/specifications/)
- [技術調査レポート](/docs/research/)
- [実装計画](/docs/plans/)
- [APIドキュメント](/docs/api/) ※実装後作成予定

## 連絡先

質問や提案がある場合は、GitHubのIssueを作成してください。