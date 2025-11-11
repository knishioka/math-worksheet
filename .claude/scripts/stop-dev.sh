#!/bin/bash
# 開発サーバー停止スクリプト
# 使用方法: ./.claude/scripts/stop-dev.sh

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🛑 開発サーバーを停止しています...${NC}"

# PIDファイルから停止
if [ -f /tmp/vite-dev.pid ]; then
  PID=$(cat /tmp/vite-dev.pid)
  if ps -p $PID > /dev/null 2>&1; then
    echo -e "${BLUE}PID $PID のプロセスを停止しています...${NC}"
    kill $PID 2>/dev/null || true
    rm /tmp/vite-dev.pid
    echo -e "${GREEN}✅ サーバーを停止しました（PID: $PID）${NC}"
  else
    echo -e "${YELLOW}⚠️  PIDファイルは存在しますが、プロセスが見つかりません${NC}"
    rm /tmp/vite-dev.pid
  fi
fi

# ポート5174を使用しているプロセスを強制停止
if lsof -ti:5174 > /dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  ポート5174を使用しているプロセスが見つかりました${NC}"
  PIDS=$(lsof -ti:5174)
  for PID in $PIDS; do
    echo -e "${BLUE}PID $PID を停止しています...${NC}"
    kill -9 $PID 2>/dev/null || true
  done
  echo -e "${GREEN}✅ すべてのプロセスを停止しました${NC}"
else
  echo -e "${GREEN}✅ ポート5174は使用されていません${NC}"
fi

# ログファイルのクリーンアップ（オプション）
if [ -f /tmp/vite-dev.log ]; then
  rm /tmp/vite-dev.log
  echo -e "${GREEN}✅ ログファイルをクリーンアップしました${NC}"
fi

echo ""
