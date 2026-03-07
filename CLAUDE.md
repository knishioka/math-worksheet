# CLAUDE.md - 計算プリント自動作成サービス

小学校算数カリキュラム対応の計算プリント自動生成システム。MathMLネイティブ対応、A4印刷最適化。

## クイックリファレンス

```bash
npm run dev        # 開発サーバー起動 (http://localhost:5174/)
npm run build      # 本番ビルド
npm run test       # テスト実行 (459テスト)
npm run typecheck  # 型チェック
npm run lint       # ESLintチェック
```

**プッシュ前必須**: `npm run lint && npm run typecheck && npm test -- --run && npm run build`

## アーキテクチャ

```
src/
├── lib/generators/     # 問題生成ロジック（純関数）
├── config/
│   ├── print-templates.ts  # レイアウト設定（重要）
│   ├── problem-patterns.ts # パターン定義
│   └── styles.ts           # スタイル定数
├── components/
│   ├── Math/           # 数式表示（MathML）
│   ├── Preview/        # プレビュー
│   └── Export/         # 印刷・PDF
├── stores/             # Zustand状態管理
└── types/              # 型定義
```

**技術スタック**: React 18 + TypeScript 5 + Vite + Tailwind CSS + Zustand

## プリントテンプレート

`src/config/print-templates.ts` で問題タイプごとのレイアウトを管理：

| 問題タイプ   | rowGap | 推奨問題数 (1/2/3列) |
| ------------ | ------ | -------------------- |
| `basic`      | 24px   | 10/20/30             |
| `fraction`   | 24px   | 10/18/27             |
| `decimal`    | 24px   | 10/20/30             |
| `mixed`      | 24px   | 8/16/24              |
| `hissan`     | 32px   | 6/12/18              |
| `hissan-div` | 75px   | 4/8/12               |
| `missing`    | 18px   | 10/20/30             |
| `word`       | 12px   | 8/16/24              |
| `word-en`    | 2px    | 8/16/18              |
| `anzan`      | 24px   | 6/12/18              |

**テンプレート取得**:

```typescript
import {
  getPrintTemplate,
  getEffectiveProblemType,
} from '@/config/print-templates';
const effectiveType = getEffectiveProblemType(
  settings.problemType,
  settings.calculationPattern
);
const template = getPrintTemplate(effectiveType);
```

## ルール

### やるべきこと

- 小さなPRで頻繁にコミット
- 変更箇所のテストを追加・更新
- 既存パターン（Zustand → コンポーネント）を踏襲
- UI変更時は`npm run test:e2e`で確認
- 印刷レイアウト変更時は`npm run build`で確認

### やってはいけないこと

- クラスコンポーネントの新規追加
- `any`型の使用
- `verify-*.mjs`や品質ゲートのスキップ
- テストなしの問題生成ロジック変更
- 巨大な`useEffect`/多責務コンポーネント
- MathMLへのインラインスタイル直書き

## レイアウト確認

印刷レイアウトの確認に2つのツールを使い分ける。

| ツール                     | 用途                                       | 設定                             |
| -------------------------- | ------------------------------------------ | -------------------------------- |
| **Playwright MCP**         | 開発中のUI確認・インタラクティブなデバッグ | `.mcp.json`                      |
| **check-print-layout.mjs** | CI/ローカルでの自動レイアウトチェック      | `scripts/check-print-layout.mjs` |

### Playwright MCP（インタラクティブ確認）

`.mcp.json` で設定済み。Claude Code から直接ブラウザを操作できる。

```text
# ページを開く
mcp__playwright__browser_navigate → url: "https://knishioka.github.io/math-worksheet/"

# アクセシビリティツリーで要素を確認
mcp__playwright__browser_snapshot

# 学年セレクターを変更（snapshotでref確認後）
mcp__playwright__browser_select_option → ref: "e5", values: ["3"]

# ボタンをクリック
mcp__playwright__browser_click → ref: "e10"

# スクリーンショット
mcp__playwright__browser_take_screenshot
```

**利点**: 状態がセッション間で維持される、`$`のシェル展開問題なし、複数行コード対応。

### レイアウト自動チェック（CI向け）

`scripts/check-print-layout.mjs` は Playwright Node.js API を使い、複数シナリオの印刷レイアウトを自動検証する。

```bash
# デプロイ済みサイトをチェック
npm run check:layout

# ローカルビルドをチェック
npm run check:layout:local
```

スクリーンショットは `.playwright-cli/layout-check/` に保存される。

## テスト

**構成** (459テスト):

- `src/lib/generators/*.test.ts`: 問題生成ロジック
- `src/components/**/__tests__/`: コンポーネント
- `src/config/print-templates.test.ts`: テンプレート検証

**実行**:

```bash
npm test -- --run                    # 全テスト
npm test -- --run path/to/file.test  # 個別ファイル
npm run test:ui                      # Vitest UI
```

## トラブルシューティング

### テストで`storage.setItem is not a function`

Zustand persist用のlocalStorageモックが`src/test/setup.ts`に定義済み。

### `npm run lint`でエラー

```bash
npm run lint -- --fix  # 自動修正
```

### Tailwindクラスがビルドで欠落

`tailwind.config.js`の`content`パスを確認。

### MathMLレンダリング崩れ

`src/components/Math/`のテンプレートと`@media print`スタイルを確認。

## 品質ゲート

PRマージ条件：

1. `npm run lint` 成功
2. `npm run typecheck` 成功
3. `npm test -- --run` 成功
4. `npm run build` 成功
5. CIステータス緑

## コミット規約

Conventional Commits形式：

- `feat:` 新機能
- `fix:` バグ修正
- `docs:` ドキュメント
- `refactor:` リファクタリング
- `test:` テスト追加
- `chore:` その他

```bash
git commit -m "feat(generator): add new problem type"
```

## 問題タイプ追加手順

1. `src/types/index.ts`に型追加
2. `src/config/print-templates.ts`にテンプレート追加
3. `src/lib/generators/`に生成ロジック実装
4. `src/components/Math/`に表示コンポーネント実装
5. テスト追加
6. Playwright MCP または `npm run check:layout` でレイアウト確認

## 参考リソース

- `docs/specifications/`: 仕様書
- `docs/research/`: 技術調査（MathML vs KaTeX等）
- `docs/plans/`: 実装計画
