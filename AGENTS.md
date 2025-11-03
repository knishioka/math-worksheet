# AGENTS Guidelines (math-worksheet)

> **適用範囲 / Scope**: この AGENTS.md はリポジトリ直下のすべてのファイルに適用されます。現状モノレポ構成ではなく、追加のローカル AGENTS.md は存在しません。今後サブディレクトリに AGENTS.md を追加する場合は「近接優先（より深い階層の指示が優先）」ルールに従ってください。

---

## 1. Overview / リポジトリ概要

1. **目的**  
   - 小学校算数カリキュラムに沿った計算プリント（MathMLベース）をブラウザのみで生成・印刷できる React + TypeScript アプリ。  
   - 教師・保護者が学年／テーマ別に問題をカスタマイズできるよう、生成ロジックと UI を厳密に管理します。
2. **技術スタック**  
   - React 19, Zustand, Tailwind CSS, Vite 7, TypeScript 5.9。  
   - テスト: Vitest + @testing-library/react + happy-dom。  
   - 検証スクリプト: `verify-*.mjs` シリーズおよび `verify-problems.js`。  
   - 検証用 Playwright ランナー (`check-error.mjs`、CI では未実行)。
3. **ディレクトリ構成（抜粋）**  
   - `/src/` … UI コンポーネント、状態管理、問題生成ロジック。  
   - `/public/` … Vite の静的アセット。  
   - `/docs/` … 仕様、計画、品質ポリシー（`docs/technical/pr-guidelines.md` を参照）。  
   - `verify-*.mjs` / `verify-problems.js` … 問題生成ロジックの回帰検証。  
   - `check-error.mjs` … Playwright でのブラウザ動作確認用スクリプト。  
   - `.github/workflows/deploy.yml` … Pull Request / main ブランチ push 時に品質ゲートを実行し、main では GitHub Pages にデプロイ。
4. **主要依存関係**  
   - `package-lock.json` が存在するためパッケージマネージャは **npm** 固定。  
   - Node.js 18 系（CI で `actions/setup-node@v4` + `node-version: 18`）。  
   - Playwright を使うスクリプトを動かす場合は `npx playwright install --with-deps` の事前実行が必要。
5. **ロールごとの関心**  
   - UI/スタイル変更: React + Tailwind の責務分離に注意、印刷レイアウト (`@media print`) 影響を確認。  
   - 問題生成ロジック: `src/features`・`src/utils` の純関数を優先し、検証スクリプトでの回帰確認が必須。  
   - ドキュメント更新: `docs/` 配下は長文 Markdown を想定、PR の「Background/Value/Implementation/Quality/Related/Notes」構成を踏襲。

---

## 2. Setup / 環境構築

1. **前提ソフトウェア**  
   - Node.js ≥ 18.x（`.nvmrc` は無いが CI と合わせる）。  
   - npm ≥ 9.x（`npm install -g npm@latest` などで整合性を確保）。  
   - Playwright を使う検証を行う場合、追加でブラウザバイナリをインストール (`npx playwright install`)。  
   - git, curl 等は各自で準備。
2. **初期セットアップ手順**  
   ```bash
   git clone <repo-url>
   cd math-worksheet
   npm install    # package-lock.json に従って依存関係を固定
   ```  
   - ローカルで Vite 開発サーバを使う場合は `npm run dev` → http://localhost:5173/。  
   - Playwright 用のブラウザ依存を初回に `npx playwright install`。  
   - Tailwind IntelliSense 等の VSCode 拡張は任意。
3. **秘密情報の取り扱い**  
   - 本リポジトリはブラウザ完結アプリのため API キー等は不要。  
   - 将来機能追加でシークレットが必要になった場合、`.env.local` 等に保存し `.gitignore` 済みであることを確認。  
   - リポジトリ／PR 上で秘密情報を共有しない。環境変数で参照し、手順書には変数名のみ記載する。
4. **ローカル QA の推奨順序**  
   - 変更ファイルに応じて `npm run lint` → `npm run typecheck` → `npm test -- --run` → 必要に応じ `node verify-*.mjs`。  
   - レイアウト変更時は `npm run build` で印刷 CSS の崩れがないかを dist 出力で確認。  
   - 生成ロジック変更時は `node verify-generation.mjs`、繰り上がり判定は `node verify-carry-over.mjs`、学年別は `node verify-grade-problems.mjs` を併用。

---

## 3. Build / Lint / Typecheck / Test / E2E コマンド

| カテゴリ | コマンド | 実行タイミング / メモ |
| --- | --- | --- |
| Install | `npm install` | 依存追加は禁止（要承認）だが、初期セットアップ時に必須。CI では `npm ci`。 |
| Dev Server | `npm run dev` | Vite 開発サーバ。Playwright 手動確認 (`check-error.mjs`) 前に起動。
| Build | `npm run build` | `tsc -b && vite build`。本番バンドル確認。CI で必須。
| Preview | `npm run preview` | dist をローカルで配信。デプロイ検証に使用。
| Lint | `npm run lint` | ESLint ルール。CI で必須。差分が小さい場合は `npm run lint -- --fix` を手動で実行してからコミット。
| Format Check | `npm run format:check` | Prettier 監査。必要に応じ `npm run format` で修正。
| Typecheck | `npm run typecheck` | TypeScript `--noEmit`。CI で必須。型エラーは `tsconfig.json` の strict 設定に沿って解決。
| Unit Test | `npm test -- --run` | Vitest の非ウォッチ実行（CI と整合）。補助として `npm run test:coverage` でカバレッジ取得。
| UI Test (interactive) | `npm run test:ui` | Vitest UI。レビュー前に失敗テスト調査する際に使用。
| Regression Scripts | `node verify-generation.mjs` | 生成ロジックの回帰チェック。繰り返し実行可能。
|  | `node verify-carry-over.mjs` | 繰り上がり・繰り下がり判定の検証。
|  | `node verify-grade-problems.mjs` | 学年別に想定内のパターンかを確認。
|  | `node verify-problems.js` | 旧来の問題生成回帰テスト。ESM ではなく CJS なので `node` で直接実行。
|  | `node verify-ui-behavior.mjs` | happy-dom 環境で UI 状態遷移を検証。
| E2E Smoke | `node check-error.mjs` | Playwright で dev サーバに接続し、ブラウザコンソールエラーを検知。`npm run dev` を別ターミナルで起動してから使用。
| E2E (Playwright CLI) | `npx playwright test` | 公式 CLI。現状自動テストは未整備だが、追加した際の標準コマンドとして予約。初回は `npx playwright install` が必要。
| Static Assets | `npm run build && npm run preview` | 印刷レイアウトの最終確認前に実施。

- `verify-*.mjs` は Node 20 でも動作するが、CI の Node 18 と互換を保つため同じバージョンで検証すること。  
- テスト／検証コマンド実行ログは PR テンプレの **Quality Gates** セクションに列挙する。

---

## 4. Runbook / よくあるトラブル対応

1. **Node バージョン不一致**  
   - 症状: `npm install` で `Unsupported engine` やバイナリビルド失敗。  
   - 対処: `nvm install 18 && nvm use 18` または Volta で固定。CI と同じ Node 18 を利用。
2. **`npm run lint` で `Parsing error`**  
   - `eslint.config.js` を参照し、ESM モジュール解決のパスが崩れていないか確認。  
   - `tsconfig.json` の `paths` 変更時は ESLint 側の `tsconfigRootDir` 設定も整合させる。
3. **`npm test -- --run` が `ReferenceError: window is not defined`**  
   - `vitest.config.ts` で `environment: 'happy-dom'` を設定済み。新規テストで DOM API を使う場合、`describe` 前に `vi.stubGlobal` を行うか、`render` を利用。  
   - グローバル設定が必要な場合は `src/test/setup.ts` に追記し、`vitest.config.ts` の `setupFiles` を更新。
4. **Tailwind クラスがビルドで欠落**  
   - `tailwind.config.js` の `content` パスにファイルが含まれているか確認。新しいファイル拡張子を導入した場合は更新。  
   - `npm run build` → `npm run preview` で該当コンポーネントの印刷スタイルを手動確認。
5. **`verify-*.mjs` で失敗**  
   - 失敗メッセージからテストケースを特定。  
   - `docs/testing/test-organization-plan.md` に定義済みの想定ケースと照合。  
   - 仕様変更が正当であればテストを更新し、PR 説明に変更理由と影響範囲を明記。
6. **`node check-error.mjs` がタイムアウト**  
   - 事前に `npm run dev` が起動済みか確認。  
   - Playwright のブラウザがインストールされていない場合は `npx playwright install --with-deps`。CI では実行しないためローカル限定。
7. **GitHub Pages デプロイが失敗**  
   - `deploy.yml` の品質ゲート（lint/typecheck/test/build）が失敗していないかチェック。  
   - main に直接 push すると自動で Pages 配信される。失敗した場合は Actions ログで該当ステップを修正し、再実行。
8. **MathML レンダリング崩れ**  
   - `src/features/worksheet/` の MathML テンプレートを参照し、`aria-label` や `semantic` 属性が正しいか確認。  
   - ブラウザ毎の差異は `docs/print-validation.md` にまとめてあるので参照。

---

## 5. Safety & Permissions / 操作権限

- **許可済み（要承認不要）**  
  - 既存ファイルの閲覧、コメント追加、Markdown ドキュメントの更新。  
  - 単一ファイルのフォーマット・リンティング・型チェック・個別テスト実行。  
  - 既存スクリプト (`npm run lint` など) の実行。  
  - 小規模な UI 修正・バグ修正での Pull Request 作成。
- **要承認**  
  - 依存パッケージの追加・更新 (`package.json` / `package-lock.json` の変更)。  
  - 大規模なファイルリネーム／削除、フォルダ構成変更。  
  - DB／外部サービス連携の導入、CI ワークフローの改変。  
  - 全量 E2E 実行やブラウザ自動操作を CI に組み込む場合。  
  - 本番デプロイ（main への直接 push）。
- **明示禁止**  
  - 秘密情報/API キーのハードコード。  
  - 無断での外部データ送信・トラッキングコード追加。  
  - 不要な依存追加、ロックファイルの手動編集。  
  - 教育的価値を損なう意図的な問題生成ロジックの劣化。

---

## 6. Do / Don't

- **Do**  
  1. 小さな差分で頻繁に PR を作成し、レビューを容易にする。  
  2. 変更箇所に関連するテスト／検証スクリプトを追加または更新。  
  3. UI 変更時はスクリーンショットまたは印刷プレビューを添付。  
  4. 既存のアーキテクチャ（状態は Zustand ストア → プレゼンテーションコンポーネント）を尊重。  
  5. `docs/` の仕様やプランを参照し、変更理由を背景と共に説明。
- **Don't**  
  1. クラスベースコンポーネントの新規追加（関数コンポーネント + Hooks が標準）。  
  2. 巨大な `useEffect` / 多責務コンポーネントを生む実装。責務分割とユニットテストを優先。  
  3. ビルド・テストを通さないままコミット／PR 作成。  
  4. MathML テンプレートにハードコードでスタイルを埋め込む（Tailwind または CSS Modules を使用）。  
  5. `verify-*.mjs` の失敗を無視したままレビュー依頼する。

---

## 7. PR / CI Rules

1. **ブランチ運用**  
   - `main` がデフォルトブランチ。  
   - 機能追加: `feature/<summary>`、バグ修正: `fix/<issue-id>`、メンテナンス: `chore/<topic>` 等の prefix を推奨。  
   - main への直接 push は原則禁止。必ず PR を経由。
2. **コミット規約**  
   - Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:` 等) を採用。  
   - 一コミット一トピック。フォーマット用コミットは `chore:` を使用。  
   - 自動生成されたバイナリやビルド成果物はコミットしない。
3. **PR メッセージ**  
   - `docs/technical/pr-guidelines.md` に従い、Background → Value → Implementation → Quality Gates → Related → Notes の順で記述。  
   - 品質ゲートでは実行したコマンド（lint/test/typecheck/build/verify 等）と結果をすべて列挙。  
   - ユーザー／教育的影響を明記し、スクリーンショットや添付ドキュメントがあればリンク。
4. **CI ステータス**  
   - `.github/workflows/deploy.yml` が Pull Request 時に `npm run test`, `npm run typecheck`, `npm run lint`, `npm run build` を実行。  
   - いずれかが失敗すると PR に赤バッジが付与されるため、ローカルで再現し修正する。  
   - GitHub Pages へのデプロイは main ブランチの成功時のみ。
5. **レビュー体制**  
   - 主要ロジック変更時は少なくとも 1 名のレビューアにアサイン。  
   - 大規模変更はドラフト PR として早期共有し、仕様合意を取ってから実装を確定。  
   - 自己レビューコメントで意図や懸念点を共有すると承認が早まる。

---

## 8. Acceptance Criteria / 受入基準

- Pull Request がマージ可能となる条件は以下の通りです。  
  1. `npm run lint`, `npm run typecheck`, `npm test -- --run`, `npm run build` の 4 コマンドがローカルまたは CI で成功。  
  2. 変更内容に応じた `verify-*.mjs` または `node check-error.mjs` の実行結果を PR に記載（UI 変更は Playwright smoke、生成ロジック変更は該当 verify スクリプト）。  
  3. PR 説明文がガイドライン（Background/Value/Implementation/Quality/Related/Notes）を満たし、実行コマンドとスクリーンショット（必要時）が添付。  
  4. コードレビューで指摘された事項が解決済み。  
  5. CI ステータスがすべて緑であること（`Deploy to GitHub Pages` ワークフローの Pull Request ステップ）。

---

## 9. 更新履歴

- 2025-02-14: ドキュメント全体を再編し、Setup/Runbook/PR ルール/受入基準を網羅（AI エージェント整備タスク）。

---

**備考 / Notes**  
- 追加の詳細やドメイン仕様は `docs/` 配下を参照。  
- 新規サブプロジェクトを導入する場合は、そのディレクトリ直下に AGENTS.md を配置し、本ドキュメントを参照するよう明記してください。
