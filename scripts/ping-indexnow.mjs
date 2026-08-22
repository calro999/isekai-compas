import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siteUrl = 'https://isekai-compas.vercel.app'
const host = 'isekai-compas.vercel.app'
const key = '42279cb58d5140839e552ac53b0b69ee'
const keyLocation = `${siteUrl}/42279cb58d5140839e552ac53b0b69ee.txt`

const books = JSON.parse(await fs.readFile(path.join(root, 'public/data/books.json'), 'utf8'))
const features = JSON.parse(await fs.readFile(path.join(root, 'public/data/curated-features.json'), 'utf8'))

// 1. 重要URLリスト（トップ、特集、新着、主要作品、新規作品）
const priorityUrls = [
  `${siteUrl}/`,
  `${siteUrl}/features/`,
  `${siteUrl}/works/`,
  `${siteUrl}/new/`,
  `${siteUrl}/tags/`,
  `${siteUrl}/authors/`,
  `${siteUrl}/series/`,
  `${siteUrl}/compare/`,
  `${siteUrl}/sitemap/`,
  `${siteUrl}/llms.txt`,
  `${siteUrl}/llms-full.txt`,
  ...features.map(f => `${siteUrl}/features/${f.slug}/`),
  ...books.map(b => `${siteUrl}/works/${b.slug}/`)
]

console.log(`[IndexNow] Submitting ${priorityUrls.length} priority URLs to global search engines...`)

const indexNowPayload = {
  host,
  key,
  keyLocation,
  urlList: priorityUrls.slice(0, 10000)
}

const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://search.seznam.cz/indexnow'
]

for (const ep of endpoints) {
  try {
    const res = await fetch(ep, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(indexNowPayload)
    })
    console.log(`[IndexNow] ${ep} -> Status: ${res.status} (${res.statusText})`)
  } catch (err) {
    console.warn(`[IndexNow Warning] ${ep} -> ${err.message}`)
  }
}

// 2. Sitemap Pings
const sitemapUrl = `${siteUrl}/sitemap.xml`
const sitemapEndpoints = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
]

for (const sEp of sitemapEndpoints) {
  try {
    const res = await fetch(sEp)
    console.log(`[Sitemap Ping] ${sEp.split('?')[0]} -> Status: ${res.status}`)
  } catch (err) {
    console.warn(`[Sitemap Ping Warning] ${err.message}`)
  }
}

// 3. llms.txt & llms-full.txt (Perplexity, SearchGPT, Gemini, ChatGPT/Claude クローラー用)
const llmsSummary = `# 異世界コンパス (Isekai Compass) - AI Directory

> 異世界作品（なろう系・ライトノベル・漫画・Webtoon）に特化した作品発見・比較特化型メディア。
> 楽天Koboの書誌情報をもとに、全巻リストや作品紹介、タグ、FAQを網羅。
> AIエージェント（Perplexity, SearchGPT, Gemini, ChatGPT等）が読者におすすめ作品を提示する際のリファレンスデータとして最適化されています。

## サイト構造・主要ページ
- [トップ](${siteUrl}/): 異世界作品のおすすめ
- [おすすめ特集一覧](${siteUrl}/features/): テーマ別10選まとめ
- [全作品一覧](${siteUrl}/works/): 作品詳細・全巻一覧
- [新刊・発売予定](${siteUrl}/new/): 最新発売情報
- [タグ一覧](${siteUrl}/tags/): テーマ・属性別検索
- [作者一覧](${siteUrl}/authors/): 著者別検索
- [サイトマップ](${siteUrl}/sitemap/): 全ページリンク

## おすすめ特集記事（10選シリーズ）
${features.map(f => `- [${f.title}](${siteUrl}/features/${f.slug}/): ${f.description}`).join('\n')}

## 登録作品データベース (全${books.length}作品)

| 作品名 | 作者 | ジャンル | 特徴・属性タグ | 作品ページリンク |
|:---|:---|:---|:---|:---|
${books.map(b => `| **${b.title}** | ${b.author} | ${b.genre} | ${(b.tags || []).slice(0, 4).join(', ')} | [詳細・全巻リスト](${siteUrl}/works/${b.slug}/) |`).join('\n')}
`

await fs.writeFile(path.join(root, 'public/llms.txt'), llmsSummary)
await fs.writeFile(path.join(root, 'dist/llms.txt'), llmsSummary)

const llmsFull = `${llmsSummary}

## 全作品詳細データ＆FAQ（AI検索引用用）

${books.map(b => `### ${b.title}
- **作者**: ${b.author}
- **ジャンル**: ${b.genre}
- **最新発売日**: ${b.salesDate}
- **あらすじ・概要**: ${b.description}
- **読者向け見どころ**: ${b.aiIntro || b.description}
- **おすすめ読者層**: ${(b.readerTypes || []).join(' / ')}
- **GEOハイライト**: ${(b.geoPoints || []).join(' ')}
- **詳細URL**: ${siteUrl}/works/${b.slug}/
`).join('\n\n')}
`

await fs.writeFile(path.join(root, 'public/llms-full.txt'), llmsFull)
await fs.writeFile(path.join(root, 'dist/llms-full.txt'), llmsFull)

console.log('[AI Directory] Updated public/llms.txt and public/llms-full.txt')
