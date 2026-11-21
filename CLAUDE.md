# まいにち算数 開発ガイド

セットアップとプリントの使い方は [README](README.md) を参照してください。依存関係と利用できる npm スクリプトは [package.json](package.json) で管理しています。

## 実装の入口

| 変更したいもの | 実装 |
| --- | --- |
| 問題の生成・再生成 | [ジェネレーター](src/lib/generators/)と[プリントの組み立て](src/lib/generators/worksheet.ts) |
| 教材一覧と学習順 | [教材カタログ](src/config/worksheet-catalog.ts)と[学習の道すじ](src/config/learning-paths.ts) |
| 設定の更新と共有URLの復元 | [Zustand ストア](src/stores/problemStore.ts)と[URLパラメーター](src/lib/utils/url-state.ts) |
| 数式・図・解答の表示 | [Math コンポーネント](src/components/Math/)と[問題リスト](src/components/Preview/ProblemList.tsx) |
| 問題数の上限と印刷 | [印刷テンプレート](src/config/print-templates.ts)と[印刷プレビュー](src/components/Preview/WorksheetPreview.tsx) |

## 実装時の規約

- React の関数コンポーネントを使い、問題生成は UI から独立させます。TypeScript の型を明示し、`any` を避けます。副作用と表示の責務を小さく保ちます。
- 問題生成ロジックを変えたら、変更した出題条件と正答をテストします。Bar Model や Number Bond の図では `hidden` で未知数を指定し、問題用紙では `?` や空欄で示します。解答表示を切り替えて印刷時の見え方も目視で確認します。MathML のスタイルは共通化します。
- 教材の登録先・学年配当・解説動画は[教材の追加と変更](docs/materials.md)、列数ごとの実測手順は[印刷と教材一覧の検証](docs/print-validation.md)を参照してください。手動確認のスクリーンショットは `.playwright-cli/` に保存します。

## プッシュ前の確認

```bash
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

個別のテストは、例えば `npm test -- --run src/config/print-templates.test.ts` で実行できます。UI・教材・印刷の変更では該当するブラウザ検証も実行します。開発サーバーをバックグラウンドで管理する手順は[補助スクリプトの説明](.claude/scripts/README.md)にあります。

PRは変更目的ごとに小さくまとめ、コミットには Conventional Commits（例 `fix(print): align answer boxes`）を使います。PRには学習者への影響、実行したチェック、目視確認の結果を記載し、CIの成功を確認します。[PRの記載ガイド](docs/technical/pr-guidelines.md)
