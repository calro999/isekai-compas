import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'public/data/books.json')
const statePath = path.join(root, 'public/data/sync-state.json')
const siteUrl = process.env.SITE_URL || 'https://isekai-compas.vercel.app'
const seedBooks = JSON.parse(await fs.readFile(dataPath, 'utf8'))

const queries = ['無職転生 異世界行ったら本気だす', '転生したらスライムだった件', 'とんでもスキルで異世界放浪メシ', '異世界 転生 小説', '異世界 ファンタジー ライトノベル', '悪役令嬢 異世界 小説', 'スローライフ 異世界 小説']

const hashString = (value) => crypto.createHash('md5').update(String(value)).digest('hex').slice(0, 10)

const slugify = (value) => {
  const ascii = String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
  if (ascii.length >= 3) return ascii.slice(0, 40)
  return `ref-${hashString(value)}`
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const normalizeTitle = (value) => String(value || '').replace(/[\s　「」『』（）()！？!?・:：～〜]/g, '').toLowerCase()
const buildAffiliateUrl = (itemUrl, affiliateId) => `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(itemUrl)}&m=${encodeURIComponent(itemUrl)}`
const releaseDateOf = (value) => {
  const match = String(value || '').match(/(\d{4})年(\d{1,2})月(\d{1,2})日/)
  return match ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3])) : null
}
const isWithinReservationWindow = (item) => {
  const date = releaseDateOf(item.salesDate)
  if (!date) return item.salesType !== '1'
  const now = new Date()
  const oneMonthLater = new Date(now)
  oneMonthLater.setDate(now.getDate() + 31)
  return date <= oneMonthLater
}
const isRakutenItem = (item) => Boolean(item?.itemUrl && process.env.RAKUTEN_AFFILIATE_ID && (item.largeImageUrl || item.mediumImageUrl) && isWithinReservationWindow(item))
const isPublishableBook = (book) => Boolean(book?.source === 'rakuten-kobo' && book.slug && book.cover?.includes('rakuten') && book.affiliateUrl?.startsWith('https://hb.afl.rakuten.co.jp/'))

async function rakutenSearch(keyword, page = 1) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
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
  if (!isRakutenItem(item)) throw new Error(`Not publishable Rakuten item: ${item.title || item.itemName}`)
  const title = item.title || item.itemName || '作品名未取得'
  const rawId = String(item.itemNumber || item.isbn || '')
  const bookSlug = rawId ? rawId : `work-${hashString(title)}`
  return {
    id: rawId || bookSlug, slug: bookSlug, title,
    author: item.author || '作者情報なし', seriesName: item.seriesName || '', genre: '異世界・ファンタジー', tags: article.tags,
    badge: releaseDateOf(item.salesDate) > new Date() ? 'まもなく発売' : '新着', color: 'gold', cover: item.largeImageUrl || item.mediumImageUrl || '',
    description: article.description, aiIntro: article.aiIntro, readerTypes: article.readerTypes,
    price: item.itemPrice || 0, salesDate: item.salesDate || '', salesType: item.salesType || '0', affiliateUrl: buildAffiliateUrl(item.itemUrl, process.env.RAKUTEN_AFFILIATE_ID),
    sourceUrl: item.itemUrl, source: 'rakuten-kobo', publishedAt: new Date().toISOString()
  }
}

async function writeIndex(books) {
  await clearGeneratedPages()
  const tagEntries = [...new Set(books.flatMap(book => book.tags || []))]
  const authorEntries = [...new Set(books.map(book => book.author).filter(Boolean))]
  const seriesEntries = [...new Set(books.map(book => book.seriesName).filter(Boolean))]
  const pairEntries = getPairs(books)
  const urls = [
    '  <url><loc>' + siteUrl + '/works/</loc><priority>0.9</priority><changefreq>daily</changefreq></url>',
    '  <url><loc>' + siteUrl + '/compare/</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>',
    '  <url><loc>' + siteUrl + '/tags/</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>',
    '  <url><loc>' + siteUrl + '/authors/</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>',
    '  <url><loc>' + siteUrl + '/series/</loc><priority>0.7</priority><changefreq>weekly</changefreq></url>',
    '  <url><loc>' + siteUrl + '/new/</loc><priority>0.9</priority><changefreq>daily</changefreq></url>',
    ...tagEntries.map(tag => `  <url><loc>${siteUrl}/tags/${encodeURIComponent(slugify(tag))}/</loc><changefreq>weekly</changefreq></url>`),
    ...authorEntries.map(author => `  <url><loc>${siteUrl}/authors/${encodeURIComponent(slugify(author))}/</loc><changefreq>weekly</changefreq></url>`),
    ...seriesEntries.map(series => `  <url><loc>${siteUrl}/series/${encodeURIComponent(slugify(series))}/</loc><changefreq>weekly</changefreq></url>`),
    ...pairEntries.map(([a, b]) => `  <url><loc>${siteUrl}/compare/${pairSlug(a, b)}/</loc><changefreq>weekly</changefreq></url>`),
    ...books.map(book => `  <url><loc>${siteUrl}/works/${book.slug}/</loc><lastmod>${book.publishedAt.slice(0, 10)}</lastmod><changefreq>weekly</changefreq></url>`)
  ].join('\n')
  await fs.writeFile(path.join(root, 'public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${siteUrl}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>\n  <url><loc>${siteUrl}/new</loc><priority>0.9</priority><changefreq>daily</changefreq></url>\n${urls}\n</urlset>\n`)
  const latest = books.slice(-20).reverse().map(book => `    <item><title>${escapeXml(book.title)}</title><link>${siteUrl}/works/${book.slug}/</link><description>${escapeXml(book.description)}</description><pubDate>${new Date(book.publishedAt).toUTCString()}</pubDate></item>`).join('\n')
  await fs.writeFile(path.join(root, 'public/rss.xml'), `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>異世界コンパス｜新刊情報</title><link>${siteUrl}/new</link><description>異世界漫画・小説の新刊情報</description>\n${latest}\n</channel></rss>\n`)
  await Promise.all(books.map(book => writeWorkPage(book, books)))
  await writeCategoryPages(books, tagEntries, authorEntries, seriesEntries)
  await writeComparePages(books, pairEntries)
  const llmEntries = books.slice(-30).reverse().map(book => `- [${book.title}](${siteUrl}/works/${book.slug}/): ${book.description}`).join('\n')
  await fs.writeFile(path.join(root, 'public/llms.txt'), `# 異世界コンパス\n\n> 異世界作品に特化した作品発見・比較サイト。楽天Koboの書誌情報をもとに、作品紹介、タグ、読者タイプを整理しています。\n\n## 主要ページ\n- [トップ](${siteUrl}/): 異世界作品のおすすめ\n- [全作品](${siteUrl}/works/): 作品詳細を一覧で検索\n- [新刊](${siteUrl}/new/): 新しく追加された作品\n- [タグ一覧](${siteUrl}/tags/): 作品をテーマ別に検索\n- [作者一覧](${siteUrl}/authors/): 作者から検索\n- [シリーズ一覧](${siteUrl}/series/): シリーズから検索\n- [比較・関連作品](${siteUrl}/compare/): 似ている作品を比較\n\n## 作品ページ\n${llmEntries}\n\n## データ方針\n- 作品データは楽天Kobo APIから定期更新します。\n- 紹介文・タグ・読者タイプはGeminiで生成し、作品データの範囲で編集します。\n- 価格と配信状況は各販売ページで確認してください。\n`)
}
const escapeXml = value => String(value).replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

async function clearGeneratedPages() {
  for (const dir of ['works', 'compare', 'tags', 'authors', 'series', 'new']) {
    await fs.rm(path.join(root, 'public', dir), { recursive: true, force: true })
  }
}

function getPairs(books) {
  const pairs = []
  for (let i = 0; i < books.length; i += 1) for (let j = i + 1; j < books.length; j += 1) pairs.push([books[i], books[j]])
  return pairs
}

function pairSlug(a, b) {
  return `${a.slug}-vs-${b.slug}`
}

function relatedBooks(book, books) {
  return books.filter(other => other.id !== book.id).map(other => ({
    book: other,
    score: (other.tags || []).filter(tag => (book.tags || []).includes(tag)).length + (other.genre === book.genre ? 2 : 0)
  })).filter(entry => entry.score > 0).sort((a, b) => b.score - a.score).slice(0, 6).map(entry => entry.book)
}

async function writeWorkPage(book, books) {
  const workDir = path.join(root, 'public/works', book.slug)
  await fs.mkdir(workDir, { recursive: true })
  const title = `${book.title}｜作品紹介・読者タイプ｜異世界コンパス`
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Book', name: book.title, author: { '@type': 'Person', name: book.author }, image: book.cover, description: book.description, datePublished: book.salesDate, offers: { '@type': 'Offer', url: book.affiliateUrl, priceCurrency: 'JPY', price: book.price } })
  const tags = (book.tags || []).map(tag => `<a href="/tags/${slugify(tag)}/">#${escapeXml(tag)}</a>`).join(' ')
  const readers = (book.readerTypes || []).map(type => `<li>${escapeXml(type)}</li>`).join('')
  const related = relatedBooks(book, books)
  const relatedLinks = related.map(other => `<li><a href="/works/${other.slug}/">${escapeXml(other.title)}</a><span>${escapeXml(other.genre)}｜${escapeXml(other.author)}</span></li>`).join('')
  const compareLinks = related.slice(0, 3).map(other => `<a href="/compare/${pairSlug(book, other)}/">${escapeXml(book.title)}と${escapeXml(other.title)}を比較</a>`).join(' ・ ')
  await fs.writeFile(path.join(workDir, 'index.html'), `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(title)}</title><meta name="description" content="${escapeXml(book.description)}"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(title)}"><meta property="og:description" content="${escapeXml(book.description)}"><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${jsonLd}</script><style>body{margin:0;color:#17221f;background:#f4f1e9;font-family:system-ui,-apple-system,sans-serif}main{max-width:780px;margin:0 auto;padding:48px 22px 80px}a{color:#8b672d}.crumb{font-size:12px;margin-bottom:35px}.eyebrow{font-size:11px;letter-spacing:.18em;color:#a37a32}.cover{width:170px;height:240px;object-fit:cover;float:right;margin:0 0 24px 36px}h1{font-family:serif;font-size:34px;line-height:1.5}h2{font-family:serif;margin-top:46px;border-left:3px solid #d6a24a;padding-left:12px}p{line-height:2;color:#5f6c62}.tags a{display:inline-block;background:#e2e8de;padding:7px 10px;margin:4px;font-size:12px;text-decoration:none}.cta{display:inline-block;background:#17221f;color:white;padding:14px 22px;margin-top:12px;text-decoration:none}.related{list-style:none;padding:0;border-top:1px solid #d9ddd3}.related li{padding:14px 4px;border-bottom:1px solid #d9ddd3;display:flex;justify-content:space-between;gap:15px}.related span{font-size:12px;color:#7d8580}.note{font-size:11px;color:#8a9389}@media(max-width:600px){.cover{width:120px;height:170px;margin-left:18px}h1{font-size:27px}.related li{display:block}.related span{display:block;margin-top:6px}}</style></head><body><main><div class="crumb"><a href="/">異世界コンパス</a>　/　<a href="/works/">全作品</a>　/　作品紹介</div><img class="cover" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙"><div class="eyebrow">WORK GUIDE</div><h1>${escapeXml(book.title)}</h1><p>作者：<a href="/authors/${slugify(book.author)}/">${escapeXml(book.author)}</a>　｜　${escapeXml(book.genre)}　｜　発売日：${escapeXml(book.salesDate)}</p><p>${escapeXml(book.aiIntro || book.description)}</p><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで作品を見る ↗</a><h2>作品概要</h2><p>${escapeXml(book.description)}</p><h2>こんな読者におすすめ</h2><ul>${readers}</ul><h2>関連タグ</h2><div class="tags">${tags}</div><h2>似ている作品・関連作品</h2><ul class="related">${relatedLinks || '<li>関連作品を準備中です。</li>'}</ul><h2>比較ページ</h2><p>${compareLinks || '<a href="/compare/">比較ページ一覧を見る</a>'}</p><p class="note">※価格・配信状況はリンク先の楽天Koboでご確認ください。紹介文は作品データをもとに生成・編集しています。</p></main></body></html>`)
}

async function writeCategoryPages(books, tagEntries, authorEntries, seriesEntries) {
  const renderList = (title, description, items, canonical, type = 'CollectionPage') => {
    const links = items.map(book => `<li><a href="/works/${book.slug}/">${escapeXml(book.title)}</a><span>${escapeXml(book.author)}　${escapeXml(book.genre)}</span></li>`).join('')
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': type, name: title, description, url: `${siteUrl}${canonical}`, mainEntity: { '@type': 'ItemList', itemListElement: items.map((book, index) => ({ '@type': 'ListItem', position: index + 1, url: `${siteUrl}/works/${book.slug}/`, name: book.title })) } })
    return `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(title)}｜異世界コンパス</title><meta name="description" content="${escapeXml(description)}"><link rel="canonical" href="${siteUrl}${canonical}"><script type="application/ld+json">${jsonLd}</script><style>body{margin:0;color:#17221f;background:#f4f1e9;font-family:system-ui,-apple-system,sans-serif}main{max-width:860px;margin:0 auto;padding:52px 22px 80px}a{color:#8b672d}.crumb{font-size:12px;margin-bottom:40px}.eyebrow{font-size:11px;letter-spacing:.18em;color:#a37a32}h1{font-family:serif;font-size:34px;margin:12px 0}header p{line-height:1.9;color:#627066;max-width:650px}ul{list-style:none;padding:0;border-top:1px solid #d9ddd3;margin-top:35px}li{border-bottom:1px solid #d9ddd3;padding:20px 5px;display:flex;justify-content:space-between;gap:20px}li span{font-size:12px;color:#7d8580}@media(max-width:600px){li{display:block}li span{display:block;margin-top:7px}h1{font-size:28px}}</style></head><body><main><div class="crumb"><a href="/">異世界コンパス</a>　/　一覧</div><header><div class="eyebrow">ISEKAI COMPASS DIRECTORY</div><h1>${escapeXml(title)}</h1><p>${escapeXml(description)}</p></header><ul>${links || '<li>該当する作品はまだありません。</li>'}</ul></main></body></html>`
  }
  const write = async (dir, html) => { await fs.mkdir(path.join(root, 'public', dir), { recursive: true }); await fs.writeFile(path.join(root, 'public', dir, 'index.html'), html) }
  await write('works', renderList('異世界作品をすべて見る', '異世界作品の作品詳細・作者・タグ・読者タイプを一覧で探せます。気になる作品から関連作品や比較ページへ移動できます。', books, '/works/'))
  await write('new', renderList('異世界作品の新刊・更新一覧', '楽天Koboから取得した異世界作品の新着情報。発売日や作品紹介を一覧で確認できます。', [...books].reverse(), '/new/'))
  await write('tags', renderList('異世界作品をタグから探す', '追放、悪役令嬢、スローライフ、転生など、異世界作品のテーマ別タグ一覧。', books, '/tags/'))
  await write('authors', renderList('異世界作品の作者一覧', '異世界作品を手がける作者ごとに、関連作品を探せます。', books, '/authors/'))
  await write('series', renderList('異世界作品のシリーズ一覧', '異世界作品をシリーズ単位で探せる一覧ページです。', books, '/series/'))
  for (const tag of tagEntries) await write(`tags/${slugify(tag)}`, renderList(`#${tag}の異世界作品`, `${tag}タグが付いた異世界作品の一覧。関連する作品を比較して、次に読む一冊を探せます。`, books.filter(book => (book.tags || []).includes(tag)), `/tags/${slugify(tag)}/`))
  for (const author of authorEntries) await write(`authors/${slugify(author)}`, renderList(`${author}の異世界作品`, `${author}が手がける異世界作品の一覧。作品紹介と関連タグをまとめています。`, books.filter(book => book.author === author), `/authors/${slugify(author)}/`))
  for (const series of seriesEntries) await write(`series/${slugify(series)}`, renderList(`${series}の異世界作品`, `${series}に含まれる作品の一覧。シリーズの読む順番や関連作品を探せます。`, books.filter(book => book.seriesName === series), `/series/${slugify(series)}/`))
}

async function writeComparePages(books, pairs) {
  const links = pairs.map(([a, b]) => `<li><a href="/compare/${pairSlug(a, b)}/">${escapeXml(a.title)} と ${escapeXml(b.title)}を比較</a></li>`).join('')
  const index = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>異世界作品の比較・関連作品一覧｜異世界コンパス</title><meta name="description" content="異世界作品をタグ、世界観、読者タイプ、読みやすさから比較。次に読む作品を探せます。"><link rel="canonical" href="${siteUrl}/compare/"><script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: '異世界作品の比較・関連作品一覧', url: `${siteUrl}/compare/` })}</script></head><body><main style="max-width:780px;margin:0 auto;padding:48px 22px;font-family:system-ui;background:#f4f1e9;color:#17221f;line-height:1.9"><p><a href="/">異世界コンパス</a>　/　比較</p><h1>異世界作品の比較・関連作品</h1><p>似ている異世界作品を、ジャンル・タグ・読者タイプから比較できます。</p><ul>${links || '<li>作品が増えると比較ページが生成されます。</li>'}</ul></main></body></html>`
  await fs.mkdir(path.join(root, 'public/compare'), { recursive: true })
  await fs.writeFile(path.join(root, 'public/compare/index.html'), index)
  await Promise.all(pairs.map(async ([a, b]) => {
    const sharedTags = (a.tags || []).filter(tag => (b.tags || []).includes(tag))
    const pageTitle = `${a.title}と${b.title}を比較｜異世界コンパス`
    const description = `${a.title}と${b.title}を、ジャンル・タグ・読者タイプから比較。どちらが自分に合うかを確認できます。`
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: pageTitle, description, url: `${siteUrl}/compare/${pairSlug(a, b)}/` })
    const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(pageTitle)}</title><meta name="description" content="${escapeXml(description)}"><link rel="canonical" href="${siteUrl}/compare/${pairSlug(a, b)}/"><script type="application/ld+json">${jsonLd}</script><style>body{margin:0;background:#f4f1e9;color:#17221f;font-family:system-ui,-apple-system,sans-serif}main{max-width:900px;margin:0 auto;padding:48px 22px 80px}a{color:#8b672d}.eyebrow{font-size:11px;color:#a37a32;letter-spacing:.18em}h1{font-family:serif;font-size:32px;line-height:1.5}h2{font-family:serif;margin-top:42px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.card{background:#fff;padding:22px}.card h3{font-family:serif;font-size:19px}.card p{color:#657268;line-height:1.9}.pill{display:inline-block;background:#e2e8de;padding:5px 8px;margin:3px;font-size:12px}@media(max-width:600px){.grid{grid-template-columns:1fr}h1{font-size:27px}}</style></head><body><main><p><a href="/">異世界コンパス</a>　/　<a href="/compare/">比較</a></p><div class="eyebrow">WORK COMPARISON</div><h1>${escapeXml(a.title)} と ${escapeXml(b.title)}を比較</h1><p>${escapeXml(description)}</p><div class="grid"><section class="card"><h3>${escapeXml(a.title)}</h3><p>作者：${escapeXml(a.author)}<br>ジャンル：${escapeXml(a.genre)}</p><p>${escapeXml(a.description)}</p><a href="/works/${a.slug}/">作品詳細を見る →</a></section><section class="card"><h3>${escapeXml(b.title)}</h3><p>作者：${escapeXml(b.author)}<br>ジャンル：${escapeXml(b.genre)}</p><p>${escapeXml(b.description)}</p><a href="/works/${b.slug}/">作品詳細を見る →</a></section></div><h2>共通タグ</h2><p>${sharedTags.length ? sharedTags.map(tag => `<span class="pill">#${escapeXml(tag)}</span>`).join('') : '共通タグはありません。'}</p><h2>どちらを選ぶ？</h2><p>${escapeXml(a.readerTypes?.[0] || a.title)}なら${escapeXml(a.title)}、${escapeXml(b.readerTypes?.[0] || b.title)}なら${escapeXml(b.title)}がおすすめです。作品詳細で読者タイプも確認できます。</p></main></body></html>`
    const dir = path.join(root, 'public/compare', pairSlug(a, b))
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'index.html'), html)
  }))
}

async function main() {
  if (process.argv.includes('--seed')) { console.log(`Seed data contains ${seedBooks.filter(isPublishableBook).length} publishable Rakuten works.`); await writeIndex(seedBooks.filter(isPublishableBook)); return }
  for (const name of ['RAKUTEN_APPLICATION_ID', 'RAKUTEN_ACCESS_KEY', 'RAKUTEN_AFFILIATE_ID']) if (!process.env[name]) throw new Error(`${name} is not set`)
  const state = JSON.parse(await fs.readFile(statePath, 'utf8').catch(() => '{"queryIndex":0,"page":1}'))
  const keyword = queries[state.queryIndex % queries.length]
  const items = await rakutenSearch(keyword, state.page)
  let affiliateLinksChanged = false
  for (const existingBook of seedBooks) {
    if (existingBook.source === 'rakuten-kobo' && existingBook.sourceUrl && process.env.RAKUTEN_AFFILIATE_ID) {
      const nextAffiliateUrl = buildAffiliateUrl(existingBook.sourceUrl, process.env.RAKUTEN_AFFILIATE_ID)
      if (existingBook.affiliateUrl !== nextAffiliateUrl) { existingBook.affiliateUrl = nextAffiliateUrl; affiliateLinksChanged = true }
    }
  }
  const existing = new Set(seedBooks.filter(book => book.source === 'rakuten-kobo').map(book => book.id))
  const pending = seedBooks.filter(book => book.source === 'pending-rakuten-sync')
  const pendingCandidate = items.find(item => isRakutenItem(item) && pending.some(book => normalizeTitle(item.title).includes(normalizeTitle(book.title)) || normalizeTitle(book.title).includes(normalizeTitle(item.title))))
  const candidate = pendingCandidate || items.find(item => isRakutenItem(item) && !existing.has(String(item.itemNumber || item.isbn || slugify(item.title || item.itemName))))
  if (!candidate) { state.queryIndex = (state.queryIndex + 1) % queries.length; state.page = state.page >= 100 ? 1 : state.page + 1; if (affiliateLinksChanged) await fs.writeFile(dataPath, JSON.stringify(seedBooks, null, 2) + '\n'); await fs.writeFile(statePath, JSON.stringify(state, null, 2) + '\n'); console.log(affiliateLinksChanged ? 'Affiliate links refreshed. Cursor advanced.' : 'No new candidate. Cursor advanced.'); return }
  const article = await generateArticle(candidate)
  const book = toBook(candidate, article)
  const pendingIndex = seedBooks.findIndex(existingBook => existingBook.source === 'pending-rakuten-sync' && (normalizeTitle(existingBook.title).includes(normalizeTitle(book.title)) || normalizeTitle(book.title).includes(normalizeTitle(existingBook.title))))
  if (pendingIndex >= 0) seedBooks[pendingIndex] = book
  else seedBooks.push(book)
  await fs.writeFile(dataPath, JSON.stringify(seedBooks, null, 2) + '\n')
  await fs.writeFile(statePath, JSON.stringify({ queryIndex: state.queryIndex, page: state.page, lastAdded: book.id, updatedAt: new Date().toISOString() }, null, 2) + '\n')
  await writeIndex(seedBooks.filter(isPublishableBook))
  console.log(`${pendingIndex >= 0 ? 'Updated' : 'Added'}: ${book.title} (${book.id})`)
}

await main()
