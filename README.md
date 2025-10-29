# 税務調査立会ドットコム - プロフェッショナルブログサイト

洗練されたデザインの税務調査に関する専門ブログサイトです。元国税調査官による税務調査サポートサービスを紹介し、8つの包括的な記事を掲載しています。

## 🌟 特徴

- **モダンな技術スタック**: Next.js 14 + TypeScript + Tailwind CSS
- **レスポンシブデザイン**: モバイルからデスクトップまで完全対応
- **SEO最適化**: 静的サイト生成による高速読み込みとSEO対策
- **8つの専門記事**: 税務調査に関する包括的なコンテンツ
- **自動デプロイ**: GitHub Actionsによる継続的デプロイメント

## 📚 掲載記事

1. **税務調査の連絡が来た!? 焦らず対処するための完全ガイド**
2. **無申告がバレた! 今すぐ取るべき行動と税務調査の実態**
3. **追徴課税が怖い - 税務調査で指摘されやすい7つのポイントと対策**
4. **税理士を変えた直後に税務調査 - 危機を乗り越える完全対応マニュアル**
5. **現金商売は狙われる - 飲食店・美容室・小売店の税務調査対策**
6. **個人vs法人 - 税務調査の違いを知らないと大損する!**
7. **消費税還付で狙われる - 否認されやすい5つのパターンと対策**
8. **元国税調査官が明かす - 税務調査の裏側と立会サポートの強み**

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **デプロイ**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🚀 ローカル開発

### 前提条件

- Node.js 20以上
- npm または yarn

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### ビルド

```bash
# プロダクションビルド
npm run build

# ビルドされたファイルは ./out ディレクトリに出力されます
```

## 📦 プロジェクト構造

```
webapp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── articles/[slug]/    # 動的記事ページ
│   │   ├── globals.css         # グローバルスタイル
│   │   ├── layout.tsx          # ルートレイアウト
│   │   └── page.tsx            # ホームページ
│   ├── components/             # Reactコンポーネント
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ArticleCard.tsx
│   ├── data/                   # データファイル
│   │   └── articles_full.ts    # 記事データ
│   └── types/                  # TypeScript型定義
│       └── article.ts
├── public/                     # 静的ファイル
├── .github/workflows/          # GitHub Actions
└── next.config.js              # Next.js設定
```

## 🌐 デプロイ

このサイトはGitHub Pagesに自動デプロイされます。

### 初回セットアップ

1. GitHubリポジトリの設定でGitHub Pagesを有効化
2. GitHub Actionsワークフローを追加（詳細は `GITHUB_ACTIONS_WORKFLOW.md` を参照）

### 自動デプロイ

`main` ブランチへのプッシュごとに自動的にデプロイされます。

デプロイ後のURL: `https://awogurix.github.io/kokuzei/`

## 🎨 デザインの特徴

- **ミニマルで洗練されたUI**: 読みやすさを重視したクリーンなデザイン
- **アクセシビリティ**: WCAG準拠のカラーコントラストとセマンティックHTML
- **高速読み込み**: 静的サイト生成による最適化されたパフォーマンス
- **モバイルファースト**: タッチスクリーンに最適化されたインタラクション

## 📝 記事の追加・編集

記事は `src/data/articles_full.ts` ファイルで管理されています。

新しい記事を追加するには:

1. `articles` 配列に新しいオブジェクトを追加
2. 必要なフィールド（id, slug, title, excerpt, content等）を記入
3. ビルドして確認

## 🔧 カスタマイズ

### カラースキームの変更

`tailwind.config.ts` で primary カラーを変更できます:

```typescript
colors: {
  primary: {
    // カスタムカラーを定義
  },
}
```

### メタデータの更新

`src/app/layout.tsx` でサイト全体のメタデータを更新できます。

## 📞 サポート

質問や問題がある場合は、GitHubのIssueを作成してください。

## 📄 ライセンス

このプロジェクトは個人利用を目的としています。

---

**開発者**: AI Developer  
**最終更新**: 2025年10月29日
