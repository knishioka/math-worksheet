# 開発スクリプト

Claude Code on the Web で開発を効率化するためのスクリプト集です。

## 📁 ファイル構成

```
.claude/
├── SessionStart              # セッション開始時に自動実行されるフック
└── scripts/
    ├── start-dev.sh         # 開発サーバー起動スクリプト
    ├── stop-dev.sh          # 開発サーバー停止スクリプト
    ├── check-quality.sh     # 品質チェック一括実行スクリプト
    └── README.md            # このファイル
```

## 🚀 SessionStart フック

Claude Code on the Web でセッションを開始すると自動的に実行されます。

### 実行内容

1. Node.js環境の確認
2. 依存関係のインストール確認（必要に応じて `npm install`）
3. TypeScript型チェック実行
4. 開発サーバーの自動起動（`http://localhost:5174`）
5. 利用可能なコマンドの表示

### カスタマイズ

`.claude/SessionStart` ファイルを編集して、自動実行する内容をカスタマイズできます。

## 🛠️ スクリプト詳細

### start-dev.sh

開発サーバーをバックグラウンドで起動します。

```bash
./.claude/scripts/start-dev.sh
```

**機能:**
- ポート5174の使用状況チェック
- 既存サーバーの検出と対話的な停止確認
- Vite開発サーバーのバックグラウンド起動
- サーバー起動完了の待機と確認
- ログファイルの保存（`/tmp/vite-dev.log`）

**出力例:**
```
🌐 開発サーバーを起動しています...
Vite開発サーバーを起動しています...
サーバーの起動を待機しています...
✅ 開発サーバーが起動しました！
   URL: http://localhost:5174
   PID: 12345
```

### stop-dev.sh

開発サーバーを停止します。

```bash
./.claude/scripts/stop-dev.sh
```

**機能:**
- PIDファイルからプロセスを特定して停止
- ポート5174を使用しているすべてのプロセスを停止
- ログファイルのクリーンアップ

**出力例:**
```
🛑 開発サーバーを停止しています...
PID 12345 のプロセスを停止しています...
✅ サーバーを停止しました（PID: 12345）
✅ ログファイルをクリーンアップしました
```

### check-quality.sh

プッシュ前の品質チェックを一括実行します。

```bash
# 通常モード（チェックのみ）
./.claude/scripts/check-quality.sh

# 自動修正モード
./.claude/scripts/check-quality.sh --fix
```

**チェック項目:**
1. **TypeScript型チェック** (`npm run typecheck`)
2. **ESLint** (`npm run lint`)
3. **Prettier** (`npm run format:check`)
4. **テスト** (`npm run test`)

**オプション:**
- `--fix`: ESLintとPrettierで自動修正可能な問題を修正

**出力例:**
```
╔════════════════════════════════════════════╗
║  Math Worksheet 品質チェック              ║
╚════════════════════════════════════════════╝

📋 1/4: TypeScript型チェックを実行しています...
✅ 型チェック: 成功

🔍 2/4: ESLintチェックを実行しています...
✅ ESLint: 成功

💅 3/4: コードフォーマットをチェックしています...
✅ Prettier: 成功

🧪 4/4: テストを実行しています...
✅ テスト: すべて成功

╔════════════════════════════════════════════╗
║  チェック結果サマリー                      ║
╚════════════════════════════════════════════╝

🎉 すべてのチェックが成功しました！
プッシュ可能な状態です。
```

## 📝 使用例

### 通常の開発フロー

1. **セッション開始**
   ```
   → SessionStart が自動実行される
   → 開発サーバーが自動起動する
   ```

2. **コード編集**
   ```
   → エディタでコードを編集
   → ブラウザで http://localhost:5174 を確認
   ```

3. **プッシュ前チェック**
   ```bash
   ./.claude/scripts/check-quality.sh --fix
   git add .
   git commit -m "feat: 新機能追加"
   git push
   ```

### トラブルシューティング

**開発サーバーが起動しない場合:**
```bash
# 既存のサーバーを停止
./.claude/scripts/stop-dev.sh

# 再起動
./.claude/scripts/start-dev.sh

# ログを確認
tail -f /tmp/vite-dev.log
```

**品質チェックでエラーが出る場合:**
```bash
# 自動修正を試す
./.claude/scripts/check-quality.sh --fix

# 個別にチェック
npm run typecheck  # 型エラー確認
npm run lint       # ESLintエラー確認
npm run test       # テスト失敗確認
```

## 🔧 カスタマイズ

### SessionStart のカスタマイズ

`.claude/SessionStart` を編集して、セッション開始時の動作をカスタマイズできます。

**例: テストを自動実行する**
```bash
# SessionStart の最後に追加
echo -e "\n${BLUE}🧪 テストを実行しています...${NC}"
npm run test -- --run
```

**例: 環境変数を設定する**
```bash
# SessionStart の最初に追加
export NODE_ENV=development
export VITE_API_URL=http://localhost:3000
```

### スクリプトの拡張

新しいスクリプトを追加する場合:

1. `.claude/scripts/` に新しいファイルを作成
2. 実行権限を付与: `chmod +x .claude/scripts/your-script.sh`
3. このREADMEに説明を追加

## 📚 関連ドキュメント

- [CLAUDE.md](/CLAUDE.md) - プロジェクト開発ガイド
- [AGENTS.md](/AGENTS.md) - エージェント設定
- [package.json](/package.json) - npmスクリプト定義

## 🎯 ベストプラクティス

1. **プッシュ前に必ず品質チェック**
   ```bash
   ./.claude/scripts/check-quality.sh --fix
   ```

2. **開発サーバーの適切な管理**
   - セッション終了時は `stop-dev.sh` で停止
   - エラー時はログを確認

3. **SessionStart のカスタマイズ**
   - プロジェクト固有のセットアップを追加
   - チーム全体で共有

## 💡 Tips

- **Playwright MCP でUIテスト:**
  ```javascript
  await mcp__playwright__browser_navigate({
    url: 'http://localhost:5174/'
  });
  ```

- **開発サーバーログの確認:**
  ```bash
  tail -f /tmp/vite-dev.log
  ```

- **自動修正で解決できない問題:**
  - TypeScript型エラー → コードを修正
  - テスト失敗 → テストまたは実装を修正
