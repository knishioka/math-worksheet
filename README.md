# 📚 計算プリント自動作成サービス

> 小学校算数カリキュラム対応のMathML計算プリント生成システム

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescript.org)
[![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)](https://reactjs.org)
[![MathML](https://img.shields.io/badge/MathML-Native-green.svg)](https://www.w3.org/Math/)
[![Tests](https://img.shields.io/badge/Tests-54%20passing-brightgreen.svg)](#テスト)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Demo-Live%20on%20GitHub%20Pages-brightgreen.svg)](https://knishioka.github.io/math-worksheet/)

日本の小学校算数カリキュラムに完全対応した、美しい数式表示とフロントエンド完結型の計算プリント自動生成システムです。

---

## 🌐 ライブデモサイト

### 🔗 **デモサイトURL**: https://knishioka.github.io/math-worksheet/

**[📱 今すぐ試す →](https://knishioka.github.io/math-worksheet/)**

### 📋 デモサイトの特徴
- 🚀 **インストール不要**: ブラウザでアクセスするだけ
- 💨 **高速動作**: フロントエンド完結で瞬時に問題生成
- 🖨️ **印刷対応**: A4サイズに最適化済み
- 🔢 **美しい数式**: MathML対応ブラウザで高品質表示
- 📱 **レスポンシブ**: PC・タブレット・スマートフォン対応
- 🔒 **プライバシー保護**: データは一切サーバーに送信されません

### 🎯 すぐに試せる機能
1. **学年選択**: 1〜6年生から選択
2. **問題タイプ**: 基本計算・分数・小数から選択
3. **レイアウト設定**: 1列・2列・3列レイアウト
4. **印刷**: ブラウザの印刷機能でA4出力

---

## ✨ 主な特徴

### 🎯 完全なカリキュラム対応
- **学年別問題生成**: 1〜6年生の学習指導要領に準拠
- **段階的難易度**: 各学年の学習進度に合わせた問題設定
- **四則演算完全対応**: 整数・分数・小数の全計算タイプ

### 🔢 美しい数式表示
- **MathMLネイティブ対応**: 93.9%のブラウザで高品質表示
- **自動フォールバック**: 残り6.1%のブラウザにはHTML/CSS表示
- **印刷最適化**: A4サイズに完璧フィット

### 🚀 フロントエンド完結
- **サーバー不要**: ブラウザのみで完全動作
- **高速生成**: JavaScript計算エンジンで瞬時に問題作成
- **オフライン対応**: インターネット接続不要

## 📊 対応している計算問題

### 整数計算
| 学年 | たし算 | ひき算 | かけ算 | わり算 |
|------|--------|--------|--------|--------|
| 1年生 | ✅ 1〜100 | ✅ 1〜100 | ❌ | ❌ |
| 2年生 | ✅ 2桁筆算 | ✅ 2桁筆算 | ✅ 九九 | ❌ |
| 3年生 | ✅ 3〜4桁 | ✅ 3〜4桁 | ✅ 2×1桁 | ✅ 基本 |
| 4〜6年生 | ✅ 大きな数 | ✅ 大きな数 | ✅ 多桁 | ✅ あまり |

### 分数計算 🆕
| 学年 | 対応内容 | 表示例 |
|------|----------|--------|
| 2年生 | 基本概念 | <math><mfrac><mn>1</mn><mn>2</mn></mfrac></math> |
| 3年生 | 同分母加減 | <math><mfrac><mn>2</mn><mn>5</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>5</mn></mfrac></math> |
| 4年生 | 真分数・仮分数 | <math><mn>1</mn><mfrac><mn>2</mn><mn>3</mn></mfrac></math> |
| 5年生 | 異分母・約分 | <math><mfrac><mn>1</mn><mn>3</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>4</mn></mfrac></math> |
| 6年生 | 四則演算 | <math><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>×</mo><mfrac><mn>3</mn><mn>4</mn></mfrac></math> |

### 小数計算 🆕
| 学年 | 対応内容 | 表示例 |
|------|----------|--------|
| 3年生 | 0.1の位 | `1.2 + 0.3` |
| 4年生 | 整数×小数 | `12 × 0.3` |
| 5年生 | 小数×小数 | `1.2 × 3.4` |
| 6年生 | 複雑な計算 | `12.345 ÷ 2.5` |

## 🛠️ 技術スタック

### フロントエンド
- **React 18** + **TypeScript 5**: モダンなコンポーネント開発
- **Vite**: 高速ビルドツール
- **Tailwind CSS**: ユーティリティファーストCSS

### 数式表示
- **MathML**: W3C標準の数学マークアップ言語
- **フォールバック**: HTML/CSS自動切り替え
- **印刷最適化**: `@media print`対応

### 計算エンジン
- **分数計算**: GCD/LCM アルゴリズム
- **小数計算**: 精度保証ラウンド処理
- **問題生成**: カリキュラム準拠アルゴリズム

### 品質保証
- **54個のテストスイート**: Vitest使用
- **TypeScript Strict**: 型安全性保証
- **ESLint + Prettier**: コード品質維持

## 🚀 クイックスタート

### 🌐 オンラインで即座に使用
**[デモサイト](https://knishioka.github.io/math-worksheet/)** にアクセスして今すぐご利用いただけます！

### 💻 ローカル開発環境のセットアップ

#### 必要環境
- Node.js 18.0+
- npm 9.0+

#### インストール & 起動
```bash
# リポジトリのクローン
git clone https://github.com/knishioka/math-worksheet.git
cd math-worksheet

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173/ を開く
```

### 📋 基本的な使い方
1. **学年選択**: 1〜6年生から選択
2. **問題タイプ選択**: 基本計算・分数・小数
3. **演算選択**: 学年に応じて利用可能な演算が表示
4. **レイアウト設定**: 1列（20問）、2列（30問）、3列（42問）
5. **問題生成**: 美しいMathML表示で即座に生成
6. **印刷**: ブラウザの印刷機能でA4出力

> 💡 **ヒント**: まずは[デモサイト](https://knishioka.github.io/math-worksheet/)で機能をお試しください！

## 📸 スクリーンショット

### 分数問題の例
```
(1) 1/2 + 1/4 = ___

(2) 2/3 - 1/6 = ___

(3) 3/4 × 2/5 = ___
```

### 小数問題の例
```
(1) 1.2 + 0.8 = ___

(2) 2.5 × 4 = ___

(3) 7.2 ÷ 1.2 = ___
```

## 🧪 テスト

```bash
# 全テストの実行
npm test

# TypeScript型チェック
npm run typecheck

# Lintチェック
npm run lint

# ビルドテスト
npm run build
```

### テスト内容
- **54個のテストケース**
- 問題生成ロジックの検証
- 学年別カリキュラム準拠の確認
- 分数・小数計算の精度テスト
- MathMLコンポーネントのレンダリング

## 📖 ドキュメント

### 開発者向け
- [**CLAUDE.md**](./CLAUDE.md): 開発規約とガイドライン
- [**実装状況**](./docs/implementation-status.md): 機能実装状況
- [**技術調査**](./docs/research/): MathML、PDF生成調査

### 仕様書
- [**カリキュラム仕様**](./docs/specifications/curriculum-spec.md): 学年別学習内容
- [**レイアウト仕様**](./docs/specifications/layout-spec.md): 印刷レイアウト仕様
- [**PDF生成仕様**](./docs/specifications/pdf-generation-spec.md): 出力仕様

### 実装計画
- [**実装計画**](./docs/plans/implementation-plan.md): 開発ロードマップ

## 🌟 新機能（2024年12月アップデート）

### MathML完全対応
- ✅ ネイティブMathML表示（93.9%ブラウザサポート）
- ✅ 自動フォールバック機能
- ✅ 印刷品質大幅向上

### 分数計算エンジン
- ✅ 最大公約数・最小公倍数アルゴリズム
- ✅ 自動約分・通分
- ✅ 真分数・仮分数・帯分数対応

### 小数計算エンジン
- ✅ 精度保証ラウンド処理
- ✅ 桁数制御
- ✅ 学年別難易度調整

### UI/UX改善
- ✅ 学年別問題タイプ自動表示
- ✅ リアルタイム説明文更新
- ✅ 印刷レイアウト最適化

## 🏗️ アーキテクチャ

```
src/
├── components/          # Reactコンポーネント
│   ├── Math/           # MathML数式コンポーネント
│   ├── Preview/        # プレビュー表示
│   ├── ProblemGenerator/ # 問題生成UI
│   └── Export/         # 印刷・出力
├── lib/
│   ├── generators/     # 問題生成エンジン
│   │   ├── addition.ts     # たし算
│   │   ├── subtraction.ts  # ひき算
│   │   ├── multiplication.ts # かけ算
│   │   ├── division.ts     # わり算
│   │   ├── fraction.ts     # 分数 🆕
│   │   └── decimal.ts      # 小数 🆕
│   └── utils/          # ユーティリティ
├── stores/             # 状態管理
└── types/              # TypeScript型定義
```

## 🤝 コントリビュート

### 開発参加方法
1. **Issue作成**: バグ報告・機能提案
2. **Fork & PR**: コード改善・新機能追加
3. **ドキュメント改善**: 仕様書・説明文の更新

### 開発規約
- [CLAUDE.md](./CLAUDE.md)に詳細な開発規約を記載
- TypeScript Strictモード必須
- テストカバレッジ維持
- commit前のlint/typecheck必須

### 貢献者
- **メイン開発**: Claude Code AI
- **企画・設計**: knishioka

## 📄 ライセンス

MIT License - 詳細は[LICENSE](./LICENSE)を参照

## 🚀 ロードマップ

### 近期予定
- [ ] 筆算形式表示（hissan type）
- [ ] 虫食い算（missing type）
- [ ] 文章題（word type）

### 将来計画
- [ ] 解答自動生成
- [ ] 学習履歴記録
- [ ] 複数ページPDF対応
- [ ] 印刷カスタマイズ

## 📞 サポート

### 🌐 まずはお試しください
**[📱 デモサイト](https://knishioka.github.io/math-worksheet/)** で実際の機能をご確認いただけます

### 🤝 サポート・お問い合わせ
- **GitHub Issues**: バグ報告・機能要望
- **GitHub Discussions**: 使い方の質問・一般的な議論
- **Wiki**: よくある質問・ドキュメント

### 📋 フィードバック歓迎
デモサイトをお試しいただき、ご意見・ご要望をお聞かせください！

---

**🌟 日本の小学校算数教育を技術で支援する** 🇯🇵

**🔗 デモサイト**: https://knishioka.github.io/math-worksheet/

Made with ❤️ using React + MathML + TypeScript