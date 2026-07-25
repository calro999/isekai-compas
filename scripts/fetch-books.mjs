import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'public/data/books.json')
const statePath = path.join(root, 'public/data/sync-state.json')
const siteUrl = process.env.SITE_URL || 'https://isekai-compass.jp'
const seedBooks = JSON.parse(await fs.readFile(dataPath, 'utf8'))

const queries = ['異世界 転生 小説', '異世界 ファンタジー ライトノベル', '悪役令嬢 異世界 小説', 'スローライフ 異世界 小説']

const slugify = (value) => value.toString().trim().toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '').slice(0, 90)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function rakutenSearch(keyword, page = 1) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID || '',
    format: 'json', formatVersion: '2', keyword, koboGenreId: '101',
    hits: '30', page: String(page), sort: '-releaseDate', orFlag: '1'
  })
  const response = await fetch(`https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`)
  if (!response.ok) throw new Error(`Rakuten API ${response.status}: ${await response.text()}`)
  const json = await response.json()
  return json.Items || json.items || []
}

async function generateArticle(item) {
  const fallback = {
    description: item.itemCaption || `${item.title}の作品情報を紹介します。`,
    aiIntro: `${item.title}は、${item.author || '作者'}による異世界作品です。作品の魅力と世界観をわかりやすく紹介します。`,
    tags: ['異世界', 'ファンタジー'],
    readerTypes: ['異世界作品を探している人']
  }
  if (!process.env.GEMINI_API_KEY) return fallback
  const prompt = `あなたは異世界小説専門メディアの編集者です。以下の書誌情報だけを根拠に、日本語でSEOに配慮した作品紹介を作成してください。あらすじの創作、未確認の受賞歴、ネタバレは禁止。JSONだけを返してください。\n\nタイトル: ${item.title}\n作者: ${item.author || ''}\nシリーズ: ${item.seriesName || ''}\n出版社: ${item.publisherName || ''}\n発売日: ${item.salesDate || ''}\n公式説明: ${item.itemCaption || ''}\n\n形式: {"description":"120〜180文字の要約","aiIntro":"読者に向けた120〜180文字の紹介","tags":["細かなタグを5〜8個"],"readerTypes":["向いている読者タイプを3つ"]}`
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } })
  })
  if (!response.ok) throw new Error(`Gemini API ${response.status}: ${await response.text()}`)
  const json = await response.json()
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
  try { return { ...fallback, ...JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')) } } catch { return fallback }
}

function toBook(item, article) {
  const title = item.title || item.itemName || '作品名未取得'
  return {
    id: String(item.itemNumber || item.isbn || slugify(title)), slug: slugify(title), title,
    author: item.author || '作者情報なし', genre: '異世界・ファンタジー', tags: article.tags,
    badge: '新着', color: 'gold', cover: item.largeImageUrl || item.mediumImageUrl || '',
    description: article.description, aiIntro: article.aiIntro, readerTypes: article.readerTypes,
    price: item.itemPrice || 0, salesDate: item.salesDate || '', affiliateUrl: item.affiliateUrl || item.itemUrl,
    sourceUrl: item.itemUrl, source: 'rakuten-kobo', publishedAt: new Date().toISOString()
  }
}

async function writeIndex(books) {
  const urls = books.map(book => `  <url><loc>${siteUrl}/works/${book.slug}/</loc><lastmod>${book.publishedAt.slice(0, 10)}</lastmod><changefreq>weekly</changefreq></url>`).join('\n')
  await fs.writeFile(path.join(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n  <url><loc>${siteUrl}/new</loc><priority>0.9</priority><changefreq>daily</changefreq></url>\n${urls}\n</urlset>\n`)
  const latest = books.slice(-20).reverse().map(book => `    <item><title>${escapeXml(book.title)}</title><link>${siteUrl}/works/${book.slug}/</link><description>${escapeXml(book.description)}</description><pubDate>${new Date(book.publishedAt).toUTCString()}</pubDate></item>`).join('\n')
  await fs.writeFile(path.join(root, 'public/rss.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>異世界コンパス｜新刊情報</title><link>${siteUrl}/new</link><description>異世界漫画・小説の新刊情報</description>\n${latest}\n</channel></rss>\n`)
  await Promise.all(books.map(book => writeWorkPage(book)))
}
const escapeXml = value => String(value).replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

async function writeWorkPage(book) {
  const workDir = path.join(root, 'public/works', book.slug)
  await fs.mkdir(workDir, { recursive: true })
  const title = `${book.title}｜作品紹介・読者タイプ｜異世界コンパス`
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Book', name: book.title, author: { '@type': 'Person', name: book.author }, image: book.cover, description: book.description, datePublished: book.salesDate, offers: { '@type': 'Offer', url: book.affiliateUrl, priceCurrency: 'JPY', price: book.price } })
  const tags = (book.tags || []).map(tag => `<a href="/tags/${encodeURIComponent(tag)}/">#${escapeXml(tag)}</a>`).join(' ')
  const readers = (book.readerTypes || []).map(type => `<li>${escapeXml(type)}</li>`).join('')
  await fs.writeFile(path.join(workDir, 'index.html'), `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(title)}</title><meta name="description" content="${escapeXml(book.description)}"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(title)}"><meta property="og:description" content="${escapeXml(book.description)}"><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${jsonLd}</script><style>body{margin:0;color:#17221f;background:#f4f1e9;font-family:system-ui,-apple-system,sans-serif}main{max-width:780px;margin:0 auto;padding:48px 22px 80px}a{color:#8b672d}.crumb{font-size:12px;margin-bottom:35px}.eyebrow{font-size:11px;letter-spacing:.18em;color:#a37a32}.cover{width:170px;height:240px;object-fit:cover;float:right;margin:0 0 24px 36px}h1{font-family:serif;font-size:34px;line-height:1.5}h2{font-family:serif;margin-top:46px;border-left:3px solid #d6a24a;padding-left:12px}p{line-height:2;color:#5f6c62}.tags a{display:inline-block;background:#e2e8de;padding:7px 10px;margin:4px;font-size:12px;text-decoration:none}.cta{display:inline-block;background:#17221f;color:white;padding:14px 22px;margin-top:12px;text-decoration:none}.note{font-size:11px;color:#8a9389}@media(max-width:600px){.cover{width:120px;height:170px;margin-left:18px}h1{font-size:27px}}</style></head><body><main><div class="crumb"><a href="/">異世界コンパス</a>　/　作品紹介</div><img class="cover" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙"><div class="eyebrow">WORK GUIDE</div><h1>${escapeXml(book.title)}</h1><p>作者：${escapeXml(book.author)}　｜　${escapeXml(book.genre)}　｜　発売日：${escapeXml(book.salesDate)}</p><p>${escapeXml(book.aiIntro || book.description)}</p><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで作品を見る ↗</a><h2>作品概要</h2><p>${escapeXml(book.description)}</p><h2>こんな読者におすすめ</h2><ul>${readers}</ul><h2>関連タグ</h2><div class="tags">${tags}</div><p class="note">※価格・配信状況はリンク先の楽天Koboでご確認ください。紹介文は作品データをもとに生成・編集しています。</p></main></body></html>`)
}

async function main() {
  if (process.argv.includes('--seed')) { console.log(`Seed data already contains ${seedBooks.length} works.`); await writeIndex(seedBooks); return }
  for (const name of ['RAKUTEN_APPLICATION_ID', 'RAKUTEN_ACCESS_KEY']) if (!process.env[name]) throw new Error(`${name} is not set`)
  const state = JSON.parse(await fs.readFile(statePath, 'utf8').catch(() => '{"queryIndex":0,"page":1}'))
  const keyword = queries[state.queryIndex % queries.length]
  const items = await rakutenSearch(keyword, state.page)
  const existing = new Set(seedBooks.map(book => book.id))
  const candidate = items.find(item => !existing.has(String(item.itemNumber || item.isbn || slugify(item.title || item.itemName))))
  if (!candidate) { state.queryIndex = (state.queryIndex + 1) % queries.length; state.page = state.page >= 100 ? 1 : state.page + 1; await fs.writeFile(statePath, JSON.stringify(state, null, 2) + '\n'); console.log('No new candidate. Cursor advanced.'); return }
  const article = await generateArticle(candidate)
  const book = toBook(candidate, article)
  seedBooks.push(book)
  await fs.writeFile(dataPath, JSON.stringify(seedBooks, null, 2) + '\n')
  await fs.writeFile(statePath, JSON.stringify({ queryIndex: state.queryIndex, page: state.page, lastAdded: book.id, updatedAt: new Date().toISOString() }, null, 2) + '\n')
  await writeIndex(seedBooks)
  console.log(`Added: ${book.title} (${book.id})`)
}

await main()
