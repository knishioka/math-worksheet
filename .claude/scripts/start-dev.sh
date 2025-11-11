#!/bin/bash
# 開発サーバー起動スクリプト
# 使用方法: ./.claude/scripts/start-dev.sh

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🌐 開発サーバーを起動しています...${NC}"

# ポート5174が既に使用されているかチェック
if lsof -ti:5174 > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  ポート5174は既に使用されています${NC}"
  echo -e "${BLUE}既存のプロセス:${NC}"
  lsof -i:5174
  echo ""
  read -p "既存のサーバーを停止して再起動しますか？ (y/N): " -n 1 -r
  echo ""
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}既存のサーバーを停止しています...${NC}"
    ./.claude/scripts/stop-dev.sh
  else
    echo -e "${GREEN}既存のサーバーを使用します${NC}"
    exit 0
  fi
fi

# 開発サーバーをバックグラウンドで起動
echo -e "${BLUE}Vite開発サーバーを起動しています...${NC}"
npm run dev > /tmp/vite-dev.log 2>&1 &
DEV_SERVER_PID=$!
echo $DEV_SERVER_PID > /tmp/vite-dev.pid

# サーバー起動待機
echo -e "${BLUE}サーバーの起動を待機しています...${NC}"
for i in {1..30}; do
  if curl -s http://localhost:5174 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 開発サーバーが起動しました！${NC}"
    echo -e "${GREEN}   URL: http://localhost:5174${NC}"
    echo -e "${GREEN}   PID: $DEV_SERVER_PID${NC}"
    echo ""
    echo -e "${BLUE}ログを表示するには:${NC} tail -f /tmp/vite-dev.log"
    echo -e "${BLUE}サーバーを停止するには:${NC} ./.claude/scripts/stop-dev.sh"
    exit 0
  fi
  sleep 0.5
done

echo -e "${RED}❌ サーバーの起動に失敗しました${NC}"
echo -e "${BLUE}ログを確認してください:${NC} cat /tmp/vite-dev.log"
exit 1
