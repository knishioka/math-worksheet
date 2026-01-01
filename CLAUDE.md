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

| 問題タイプ | rowGap | 推奨問題数 (1/2/3列) |
|-----------|--------|---------------------|
| `basic` | 24px | 10/20/30 |
| `fraction` | 24px | 10/18/27 |
| `decimal` | 24px | 10/20/30 |
| `mixed` | 24px | 8/16/24 |
| `hissan` | 32px | 6/12/18 |
| `hissan-div` | 75px | 4/8/12 |
| `missing` | 18px | 10/20/30 |
| `word` | 12px | 8/16/24 |
| `word-en` | 2px | 8/16/18 |

**テンプレート取得**:
```typescript
import { getPrintTemplate, getEffectiveProblemType } from '@/config/print-templates';
const effectiveType = getEffectiveProblemType(settings.problemType, settings.calculationPattern);
const template = getPrintTemplate(effectiveType);
```

## ルール

### やるべきこと
- 小さなPRで頻繁にコミット
- 変更箇所のテストを追加・更新
- 既存パターン（Zustand → コンポーネント）を踏襲
- UI変更時はPlaywright MCPで確認
- 印刷レイアウト変更時は`npm run build`で確認

### やってはいけないこと
- クラスコンポーネントの新規追加
- `any`型の使用
- `verify-*.mjs`や品質ゲートのスキップ
- テストなしの問題生成ロジック変更
- 巨大な`useEffect`/多責務コンポーネント
- MathMLへのインラインスタイル直書き

## Playwright MCP動作確認

レイアウト変更やUI実装後は必ず確認：

```typescript
// 1. ページを開く
await mcp__playwright__browser_navigate({ url: 'http://localhost:5174/' });

// 2. 学年を選択
await mcp__playwright__browser_select_option({
  element: '学年 combobox',
  values: ['2年生']
});

// 3. スクリーンショット
await mcp__playwright__browser_take_screenshot({ filename: 'layout-check.png' });
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

### Playwright MCPエラー
```bash
pkill -f "playwright"  # プロセスクリーンアップ
# Claude Codeを再起動
```

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
6. Playwright MCPで動作確認

## 参考リソース

- `docs/specifications/`: 仕様書
- `docs/research/`: 技術調査（MathML vs KaTeX等）
- `docs/plans/`: 実装計画
