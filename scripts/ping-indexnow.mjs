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

// 1. 全公開URLリストの収集（トップ、特集、作品、タグ、著者、シリーズ、比較）
let compareDirs = []
try {
  compareDirs = (await fs.readdir(path.join(root, 'public/compare'))).filter(f => !f.includes('.'))
} catch (e) {}

const allUrls = [
  `${siteUrl}/`,
  `${siteUrl}/features/`,
  `${siteUrl}/works/`,
  `${siteUrl}/new/`,
  `${siteUrl}/tags/`,
  `${siteUrl}/authors/`,
  `${siteUrl}/series/`,
  `${siteUrl}/compare/`,
  `${siteUrl}/sitemap/`,
  `${siteUrl}/robots.txt`,
  `${siteUrl}/llms.txt`,
  `${siteUrl}/llms-full.txt`,
  ...features.map(f => `${siteUrl}/features/${f.slug}/`),
  ...books.map(b => `${siteUrl}/works/${b.slug}/`),
  ...compareDirs.map(d => `${siteUrl}/compare/${d}/`)
]

// 重複除外
const uniqueUrls = Array.from(new Set(allUrls))

console.log(`[IndexNow] 登録対象URL総数: ${uniqueUrls.length} 件`)

// IndexNow主要エンドポイント（DuckDuckGoはBingインデックスを使用するためBing/IndexNow API送信が直接反映されます）
const endpoints = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
  'https://search.seznam.cz/indexnow',
  'https://indexnow.yep.com/indexnow'
]

// 10,000件ごとのバッチ送信
const batchSize = 10000
for (let i = 0; i < uniqueUrls.length; i += batchSize) {
  const batch = uniqueUrls.slice(i, i + batchSize)
  const payload = {
    host,
    key,
    keyLocation,
    urlList: batch
  }

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
      console.log(`[IndexNow Batch ${Math.floor(i / batchSize) + 1}] ${ep} -> Status: ${res.status} (${res.statusText})`)
    } catch (err) {
      console.warn(`[IndexNow Warning] ${ep} -> ${err.message}`)
    }
  }
}

// 2. Sitemap Pings (Google, Bing)
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

// 3. llms.txt & llms-full.txt (Perplexity, SearchGPT, Gemini, ChatGPT, Claude 等のAI・LLMクローラー用完全同期)
const llmsSummary = `# 異世界コンパス (Isekai Compass) - AI Directory

> 異世界作品（なろう系・ライトノベル・漫画・Webtoon）に特化した作品発見・比較特化型メディア。
> 楽天Koboの書誌情報をもとに、全巻リストや作品紹介、タグ、FAQを網羅。
> AIエージェント（Perplexity, SearchGPT, Gemini, ChatGPT, Claude等）が読者におすすめ作品を提示する際のリファレンスデータとして最適化されています。

## サイト構造・主要ページ
- [トップ](${siteUrl}/): 異世界作品のおすすめ
- [おすすめ特集一覧](${siteUrl}/features/): テーマ別10選まとめ
- [全作品一覧](${siteUrl}/works/): 作品詳細・全巻一覧
- [新刊・発売予定](${siteUrl}/new/): 最新発売情報
- [タグ一覧](${siteUrl}/tags/): テーマ・属性別検索
- [作者一覧](${siteUrl}/authors/): 著者別検索
- [サイトマップ](${siteUrl}/sitemap/): 全ページリンク

## おすすめ特集記事
${features.map(f => `- [${f.title}](${siteUrl}/features/${f.slug}/): ${f.description}`).join('\n')}

## 登録作品データベース (全${books.length}作品)

| 作品名 | 作者 | ジャンル | 出版社 | 作品ページリンク |
|:---|:---|:---|:---|:---|
${books.map(b => `| **${b.title}** | ${b.author} | ${b.genre || 'ライトノベル'} | ${b.publisherName || b.publisher || ''} | [詳細・レビュー](${siteUrl}/works/${b.slug}/) |`).join('\n')}
`

await fs.writeFile(path.join(root, 'public/llms.txt'), llmsSummary)
try {
  await fs.writeFile(path.join(root, 'dist/llms.txt'), llmsSummary)
} catch (e) {}

const llmsFull = `${llmsSummary}

## 全作品詳細データ＆FAQ（AI検索引用・グラウンディング用）

${books.map(b => `### ${b.title}
- **作者**: ${b.author}
- **出版社**: ${b.publisherName || b.publisher || ''}
- **ジャンル**: ${b.genre || 'ライトノベル'}
- **最新発売日**: ${b.salesDate || b.publishedDate || ''}
- **定価**: ${b.price || b.itemPrice || ''}円
- **あらすじ・概要**: ${b.description || ''}
- **読者向け見どころ**: ${b.aiIntro || b.oneLineCatch || b.description || ''}
- **おすすめ読者層**: ${(b.readerTypes || []).join(' / ')}
- **GEOハイライト**: ${(b.geoPoints || []).join(' ')}
- **詳細URL**: ${siteUrl}/works/${b.slug}/
`).join('\n\n')}
`

await fs.writeFile(path.join(root, 'public/llms-full.txt'), llmsFull)
try {
  await fs.writeFile(path.join(root, 'dist/llms-full.txt'), llmsFull)
} catch (e) {}

console.log('[AI Directory] Updated public/llms.txt and public/llms-full.txt')
console.log('[Done] All search engines and AI crawlers pinged/updated successfully!')
