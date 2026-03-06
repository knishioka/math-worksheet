# CLAUDE.md - 計算プリント自動作成サービス

小学校算数カリキュラム対応の計算プリント自動生成システム。MathMLネイティブ対応、A4印刷最適化。

## クイックリファレンス

```bash
npm run dev        # 開発サーバー起動 (http://localhost:5174/)
npm run build      # 本番ビルド
npm run test       # テスト実行 (292テスト)
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

## Playwright CLIによるレイアウト確認

デプロイ済みサイト (`https://knishioka.github.io/math-worksheet/`) の印刷レイアウトをチェックする。
`playwright-cli` はグローバルインストール済み（`npm install -g @playwright/cli`）。

### 基本的な使い方

```bash
# サイトを開く
playwright-cli open https://knishioka.github.io/math-worksheet/

# スクリーンショット
playwright-cli screenshot

# 要素のrefを確認（クリック・選択の前に実行）
playwright-cli snapshot

# 学年セレクターを変更（snapshotでrefを確認してから）
playwright-cli select <ref> "3"   # 3年生

# ボタンをクリック（列数切り替えなど）
playwright-cli click <ref>
```

### 印刷レイアウトチェック

`run-code` の引数は `page` を受け取る関数として渡す。
このアプリは `react-to-print` を使うため `emulateMedia` では印刷エリアが消える。
代わりにプリントエリア要素を直接スクリーンショットする。

```bash
# プリントエリアをスクリーンショット
playwright-cli run-code 'async (page) => { const el = await page.$("[style*=\"background: white\"]"); if (el) { await el.scrollIntoViewIfNeeded(); await el.screenshot({ path: ".playwright-cli/print-preview.png" }); } }'

# フルページスクリーンショット
playwright-cli run-code 'async (page) => { await page.screenshot({ path: ".playwright-cli/fullpage.png", fullPage: true }) }'
```

### 典型的なチェックフロー

UI変更・印刷レイアウト変更後：

1. `playwright-cli open https://knishioka.github.io/math-worksheet/`
2. `playwright-cli snapshot` で要素のrefを取得
3. `playwright-cli select <ref> "3"` で学年を変更
4. `playwright-cli click <ref>` で列数ボタンをクリック
5. 上記の `run-code` でプリントエリアをスクリーンショット

### セッション管理

```bash
playwright-cli close-all   # 全セッションを閉じる
playwright-cli kill-all    # 強制終了（ゾンビプロセス対策）
playwright-cli list        # 実行中セッション一覧
```

## テスト

**構成** (292テスト):

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
6. `playwright-cli` でレイアウト確認

## 参考リソース

- `docs/specifications/`: 仕様書
- `docs/research/`: 技術調査（MathML vs KaTeX等）
- `docs/plans/`: 実装計画
