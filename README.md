# 異世界コンパス

楽天Koboの作品情報を2時間ごとに1件取り込み、Geminiで紹介文・タグ・読者タイプを生成するViteサイトです。

## GitHub Actions Secrets

リポジトリの Settings → Secrets and variables → Actions → New repository secret から以下を登録してください。キーはソースコードには書きません。

- `RAKUTEN_APPLICATION_ID`: 楽天ウェブサービスのアプリID
- `RAKUTEN_ACCESS_KEY`: 楽天ウェブサービスのアクセスキー（現在のKobo APIで必須）
- `RAKUTEN_AFFILIATE_ID`: 楽天アフィリエイトID
- `GEMINI_API_KEY`: Google AI StudioのGemini APIキー

`SITE_URL` は Repository variable に登録できます。未登録時は `https://isekai-compass.jp` を使います。

## ローカルテスト

```bash
npm run seed:books
npm run build
```

API接続テストは、`.env` にSecretsと同じ名前の環境変数を設定して `npm run sync:books` を実行します。`--seed` はAPIを呼ばず、初期3作品のデータとsitemap/RSSを生成します。

楽天Kobo APIの書誌情報・画像・affiliate URLを取得し、同一作品をIDで重複登録しないようにしています。Geminiが失敗した場合は、楽天の公式説明文を使ったフォールバック文に切り替えます。
