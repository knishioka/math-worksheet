#!/bin/bash
# 品質チェック一括実行スクリプト
# 使用方法: ./.claude/scripts/check-quality.sh [--fix]
#
# オプション:
#   --fix    自動修正可能な問題を修正します（lintとformat）

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FIX_MODE=false
if [ "$1" = "--fix" ]; then
  FIX_MODE=true
  echo -e "${YELLOW}🔧 自動修正モードで実行します${NC}\n"
fi

ERRORS=0

# ヘッダー
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Math Worksheet 品質チェック              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

# 1. TypeScript 型チェック
echo -e "${BLUE}📋 1/4: TypeScript型チェックを実行しています...${NC}"
if npm run typecheck; then
  echo -e "${GREEN}✅ 型チェック: 成功${NC}\n"
else
  echo -e "${RED}❌ 型チェック: 失敗${NC}\n"
  ERRORS=$((ERRORS + 1))
fi

# 2. ESLint
echo -e "${BLUE}🔍 2/4: ESLintチェックを実行しています...${NC}"
if [ "$FIX_MODE" = true ]; then
  if npm run lint -- --fix; then
    echo -e "${GREEN}✅ ESLint: 成功（自動修正適用済み）${NC}\n"
  else
    echo -e "${RED}❌ ESLint: 失敗（一部は修正不可）${NC}\n"
    ERRORS=$((ERRORS + 1))
  fi
else
  if npm run lint; then
    echo -e "${GREEN}✅ ESLint: 成功${NC}\n"
  else
    echo -e "${RED}❌ ESLint: 失敗${NC}"
    echo -e "${YELLOW}💡 自動修正を試すには: $0 --fix${NC}\n"
    ERRORS=$((ERRORS + 1))
  fi
fi

# 3. Prettier フォーマットチェック
echo -e "${BLUE}💅 3/4: コードフォーマットをチェックしています...${NC}"
if [ "$FIX_MODE" = true ]; then
  if npm run format; then
    echo -e "${GREEN}✅ Prettier: フォーマット適用済み${NC}\n"
  else
    echo -e "${RED}❌ Prettier: 失敗${NC}\n"
    ERRORS=$((ERRORS + 1))
  fi
else
  if npm run format:check; then
    echo -e "${GREEN}✅ Prettier: 成功${NC}\n"
  else
    echo -e "${RED}❌ Prettier: フォーマットが必要です${NC}"
    echo -e "${YELLOW}💡 自動修正を試すには: $0 --fix${NC}\n"
    ERRORS=$((ERRORS + 1))
  fi
fi

# 4. テスト実行
echo -e "${BLUE}🧪 4/4: テストを実行しています...${NC}"
if npm run test -- --run; then
  echo -e "${GREEN}✅ テスト: すべて成功${NC}\n"
else
  echo -e "${RED}❌ テスト: 失敗${NC}\n"
  ERRORS=$((ERRORS + 1))
fi

# サマリー
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  チェック結果サマリー                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}\n"

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}🎉 すべてのチェックが成功しました！${NC}"
  echo -e "${GREEN}プッシュ可能な状態です。${NC}\n"
  exit 0
else
  echo -e "${RED}❌ $ERRORS 個のチェックが失敗しました${NC}"
  echo -e "${YELLOW}修正してから再度実行してください${NC}\n"

  if [ "$FIX_MODE" = false ]; then
    echo -e "${BLUE}💡 ヒント:${NC}"
    echo -e "  自動修正を試す: ${GREEN}$0 --fix${NC}"
  fi
  echo ""
  exit 1
fi
