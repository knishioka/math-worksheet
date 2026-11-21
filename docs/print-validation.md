# 印刷と教材一覧の検証

## 印刷レイアウトを変更したとき

問題タイプごとの余白・行間と、教材別の推奨問題数・上限は[印刷テンプレート](../src/config/print-templates.ts)で管理します。設定画面や共有URLから問題数を決めるときは、`getEffectiveCounts` に問題タイプ・教材・学年・式欄の有無を渡します。例えば英語文章題では、同じ列数でも文章の長さや式欄によって収まる問題数が変わります。

印刷ボタンを押すと、`react-to-print` が印刷用の iframe を作ります。アプリはフォントの読み込みを待って用紙の実寸コピーと iframe 内の全ページを測り、縦横のはみ出しや列内で切れた問題があれば印刷を中止します。縦に収まらない場合は問題数を減らし、横に切れる場合は列数を減らします。[印刷処理](../src/components/Preview/WorksheetPreview.tsx)・[用紙と列の測定](../src/lib/utils/a4-overflow.ts)

## CIと同じビルドで確認する

リポジトリのルートで `npm ci` を済ませ、Playwright のテスト用 Chromium を導入します。次のコマンドで本番用ビルドのプレビューを起動したままにします。

```bash
npx playwright install --only-shell chromium
npm run build
BROWSER=none npm run preview -- --host 127.0.0.1 --port 4173 --strictPort
```

別のターミナルで、プレビューのURLを明示して検証します。本番ビルドの既定のベースパスは `/math-worksheet/` です。

```bash
url=http://127.0.0.1:4173/math-worksheet/
npm run check:layout -- "$url"
npm run check:curriculum -- "$url" --print-only
npm run check:catalog -- "$url"
```

| コマンド | 確認できること | 結果の保存先 |
| --- | --- | --- |
| `check:layout` | 筆算・暗算・文章題などの代表例で、用紙の高さや余白を確認する | `.playwright-cli/layout-check/` |
| `check:curriculum -- … --print-only` | 印刷用 iframe からの複数ページPDF、超過時の印刷中止、学習画面の操作を確認する | `.playwright-cli/curriculum-check/` |
| `check:catalog` | 教材一覧の絞り込み、例題、言語別のプリント、ブラウザの「戻る」を確認する | `.playwright-cli/catalog/` |

GitHub Actions はアプリの変更を含むPRでテスト・lint・型チェック付きビルドと上記のブラウザ検証を実行します。文書だけのPRではこれらを省略し、`main` へのpushではテスト・lint・ビルドの成功後に GitHub Pages へ公開します。[ワークフロー](../.github/workflows/deploy.yml)

## 個別の教材を詳しく調べる

中学受験の問題を変更したときは、同じプレビューを使い、該当する教材IDの接頭辞を指定します。例えば「水そうの深さと流量」の日英両版を確認するには次を実行します。

```bash
npm run check:curriculum -- http://127.0.0.1:4173/math-worksheet/ --pattern-prefix=entrance-water-depth --max-values
```

最大側の数値と列ごとの最大問題数を使い、1〜3列で式欄付きの問題用紙と解説付きの解答用紙を検査します。印刷ボタン経由のPDFで本文の有無とページ数も確認します。中学受験全体を調べる場合は接頭辞を `entrance-` にします。`--measure-only` を追加すると、PDFを作成せずにプレビューのはみ出しだけを集計できます。[検証スクリプト](../scripts/check-curriculum-print.mjs)
