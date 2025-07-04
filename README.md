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
- 🖨️ **完璧な印刷対応**: A4サイズに最適化、家庭・学校ですぐ使える
- 🔢 **美しい数式**: MathML対応ブラウザで高品質表示
- 📱 **レスポンシブ**: PC・タブレット・スマートフォン対応
- 🔒 **プライバシー保護**: データは一切サーバーに送信されません

### 🎯 すぐに試せる機能
1. **学年選択**: 1〜6年生から選択
2. **問題タイプ**: 基本計算・分数・小数から選択
3. **レイアウト設定**: 1列（20問）・2列（30問）・3列（42問）
4. **🖨️ ワンクリック印刷**: ブラウザの印刷機能でA4プリントが完成！

---

## ✨ 主な特徴

### 🎯 完全なカリキュラム対応
- **学年別問題生成**: 1〜6年生の学習指導要領に準拠
- **段階的難易度**: 各学年の学習進度に合わせた問題設定
- **四則演算完全対応**: 整数・分数・小数の全計算タイプ

### 🖨️ 印刷特化設計
- **A4完璧フィット**: 余白・文字サイズ・行間すべて最適化
- **複数レイアウト**: 1列（20問）・2列（30問）・3列（42問）対応
- **ワンクリック印刷**: ブラウザの印刷機能で即座に美しいプリント
- **ヘッダー付き**: 名前・日付・点数欄を自動配置
- **手書きスペース**: 答えを書きやすい十分な空白確保

### 🔢 美しい数式表示
- **MathMLネイティブ対応**: 93.9%のブラウザで高品質表示
- **自動フォールバック**: 残り6.1%のブラウザにはHTML/CSS表示
- **印刷品質**: 拡大縮小に対応したベクター形式

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

### 分数計算
| 学年 | 対応内容 | 表示例 |
|------|----------|--------|
| 2年生 | 基本概念 | <math><mfrac><mn>1</mn><mn>2</mn></mfrac></math> |
| 3年生 | 同分母加減 | <math><mfrac><mn>2</mn><mn>5</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>5</mn></mfrac></math> |
| 4年生 | 真分数・仮分数 | <math><mn>1</mn><mfrac><mn>2</mn><mn>3</mn></mfrac></math> |
| 5年生 | 異分母・約分 | <math><mfrac><mn>1</mn><mn>3</mn></mfrac><mo>+</mo><mfrac><mn>1</mn><mn>4</mn></mfrac></math> |
| 6年生 | 四則演算 | <math><mfrac><mn>2</mn><mn>3</mn></mfrac><mo>×</mo><mfrac><mn>3</mn><mn>4</mn></mfrac></math> |

### 小数計算
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
6. **🖨️ ワンクリック印刷**: すぐに使える計算プリントが完成！

> 💡 **ヒント**: まずは[デモサイト](https://knishioka.github.io/math-worksheet/)で機能をお試しください！

## 🖨️ 印刷機能について

### 📄 印刷の特徴
- **🎯 A4サイズ最適化**: 家庭・学校のプリンターで完璧印刷
- **⚡ ワンクリック印刷**: ブラウザの印刷ボタンを押すだけ
- **📏 最適レイアウト**: 余白・文字サイズ・行間すべて調整済み
- **✏️ 手書きスペース**: 答えを書きやすい十分な空白
- **📝 ヘッダー完備**: 名前・日付・点数記入欄付き

### 🖨️ 印刷手順
1. [デモサイト](https://knishioka.github.io/math-worksheet/)で問題を生成
2. 「印刷」ボタンをクリック
3. ブラウザの印刷画面で「印刷」を実行
4. **完成！** すぐに使える計算プリントが出来上がり

### 📐 対応レイアウト
| レイアウト | 問題数 | 用途 |
|------------|--------|------|
| **1列** | 20問 | 低学年・大きな文字で見やすく |
| **2列** | 30問 | 中学年・バランス重視 |
| **3列** | 42問 | 高学年・最大問題数 |

## 📋 問題例

### 基本計算（虫食い算）の例
```
(1) □ + 3 = 7

(2) 8 - □ = 5

(3) 4 + 2 = □
```

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

## 🌟 主な機能

### MathML数式表示
- ✅ ネイティブMathML表示（93.9%ブラウザサポート）
- ✅ 自動フォールバック機能
- ✅ 印刷品質最適化

### 分数計算対応
- ✅ 最大公約数・最小公倍数アルゴリズム
- ✅ 自動約分・通分
- ✅ 真分数・仮分数・帯分数対応

### 小数計算対応
- ✅ 精度保証ラウンド処理
- ✅ 桁数制御
- ✅ 学年別難易度調整

### UI/UX特徴
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
│   │   ├── fraction.ts     # 分数
│   │   ├── decimal.ts      # 小数
│   │   └── pattern-generators.ts # 学年別パターン生成
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