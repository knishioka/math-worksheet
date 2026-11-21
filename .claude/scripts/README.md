# 開発用の補助スクリプト

以下のコマンドはリポジトリのルートから実行します。通常のセットアップは [README](../../README.md)、プッシュ前の確認項目は[開発ガイド](../../CLAUDE.md)にあります。

| コマンド | 動作 |
| --- | --- |
| `BROWSER=none ./.claude/scripts/start-dev.sh` | ポート5174で開発サーバーをバックグラウンド起動する。使用中の場合は再起動するかを尋ねる。ログは `/tmp/vite-dev.log` に保存する。 |
| `./.claude/scripts/stop-dev.sh` | 保存したPIDのプロセスを停止し、ポート5174を使用しているプロセスも強制終了する。共有環境では先に `lsof -i:5174` で対象を確認する。 |
| `./.claude/scripts/check-quality.sh` | 型チェック、ESLint、Prettier、Vitest を順に実行する。`--fix` を付けると ESLint と Prettier がファイルを書き換える。 |

[SessionStart](../SessionStart) をセッション開始フックに使う環境では、依存関係の確認、型チェック、開発サーバーの起動も行います。
