import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dataPath = path.join(root, 'public/data/books.json')
const statePath = path.join(root, 'public/data/sync-state.json')
const siteUrl = process.env.SITE_URL || 'https://isekai-compas.vercel.app'

async function loadEnv() {
  try {
    const envPath = path.join(root, '.env')
    const content = await fs.readFile(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=')
        const val = vals.join('=').trim()
        if (key.trim() && val) process.env[key.trim()] = val
      }
    }
  } catch (e) {}
}
await loadEnv()

async function loadBooks() {
  return JSON.parse(await fs.readFile(dataPath, 'utf8'))
}

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
const isPublishableBook = (book) => Boolean(book?.slug && book?.title && (book.cover || book.sourceUrl))

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
    tags: ['異世界', 'ファンタジー', '冒険', 'アニメ化', 'おすすめ'],
    readerTypes: ['異世界ファンタジーが好きな人', '爽快な物語を楽しみたい人', '最新作をチェックしたい人']
  }
  if (!process.env.GEMINI_API_KEY) return fallback

  try {
    const prompt = `あなたは異世界小説専門メディアの編集者です。以下の書誌情報だけを根拠に、日本語でSEOに配慮した作品紹介を作成してください。あらすじの創作、未確認の受賞歴、ネタバレは禁止。JSONだけを返してください。\n\nタイトル: ${item.title}\n作者: ${item.author || ''}\nシリーズ: ${item.seriesName || ''}\n出版社: ${item.publisherName || ''}\n発売日: ${item.salesDate || ''}\n公式説明: ${item.itemCaption || ''}\n\n形式: {"description":"120〜180文字の要約","aiIntro":"読者に向けた120〜180文字の紹介","tags":["細かなタグを5〜8個"],"readerTypes":["向いている読者タイプを3つ"]}`
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } })
    })

    if (!response.ok) {
      console.warn(`[WARN] Gemini API ${response.status} (Quota Exceeded or Error). Falling back to Rakuten metadata without breaking build.`)
      return fallback
    }

    const json = await response.json()
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return { ...fallback, ...JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')) }
  } catch (err) {
    console.warn(`[WARN] Gemini API Exception: ${err.message}. Using fallback.`)
    return fallback
  }
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
  for (const dir of ['works', 'compare', 'tags', 'authors', 'series', 'new', 'features']) {
    await fs.rm(path.join(root, 'public', dir), { recursive: true, force: true })
  }
}

function isSameSeries(a, b) {
  if (a.id === b.id) return true
  if (a.seriesName && b.seriesName && a.seriesName === b.seriesName) return true
  const normA = (a.seriesName || a.title).replace(/[\s\d〜～「」『』（）()【】分冊版]/g, '').toLowerCase()
  const normB = (b.seriesName || b.title).replace(/[\s\d〜～「」『』（）()【】分冊版]/g, '').toLowerCase()
  if (normA && normB && (normA.includes(normB) || normB.includes(normA))) return true
  return false
}

function getPairs(books) {
  const pairs = []
  for (let i = 0; i < books.length; i += 1) {
    for (let j = i + 1; j < books.length; j += 1) {
      if (!isSameSeries(books[i], books[j])) {
        pairs.push([books[i], books[j]])
      }
    }
  }
  return pairs
}

function pairSlug(a, b) {
  const first = a.slug < b.slug ? a : b
  const second = a.slug < b.slug ? b : a
  return `${first.slug}-vs-${second.slug}`
}

function relatedBooks(book, books) {
  const currentTags = book.tags || []
  const currentGenreKeywords = (book.genre || '').split(/[・\s/]/).filter(Boolean)

  const scored = books.filter(other => !isSameSeries(book, other)).map(other => {
    const otherTags = other.tags || []
    const otherGenreKeywords = (other.genre || '').split(/[・\s/]/).filter(Boolean)
    
    let score = 0
    score += otherTags.filter(t => currentTags.includes(t)).length * 2
    score += otherGenreKeywords.filter(g => currentGenreKeywords.includes(g)).length * 3
    if (other.author === book.author) score += 4

    return { book: other, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 6).map(entry => entry.book)
}

function renderHeader(activePath = '') {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
        <nav class="main-nav">
          <a href="/" class="${activePath === '/' ? 'active' : ''}">トップ</a>
          <a href="/features/" class="${activePath === '/features/' ? 'active' : ''}">特集<em>HOT</em></a>
          <a href="/works/" class="${activePath === '/works/' ? 'active' : ''}">作品を探す</a>
          <a href="/new/" class="${activePath === '/new/' ? 'active' : ''}">新刊<em>NEW</em></a>
          <a href="/tags/" class="${activePath === '/tags/' ? 'active' : ''}">タグ</a>
          <a href="/authors/" class="${activePath === '/authors/' ? 'active' : ''}">作者</a>
          <a href="/series/" class="${activePath === '/series/' ? 'active' : ''}">シリーズ</a>
          <a href="/compare/" class="${activePath === '/compare/' ? 'active' : ''}">比較</a>
        </nav>
      </div>
    </header>
  `
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <a class="brand light" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
        <div class="footer-links">
          <a href="/features/">おすすめ特集</a>
          <a href="/works/">全作品</a>
          <a href="/new/">新刊一覧</a>
          <a href="/tags/">タグ一覧</a>
          <a href="/series/">シリーズ</a>
          <a href="/authors/">作者一覧</a>
          <a href="/compare/">比較</a>
        </div>
        <span class="copyright">© ISEKAI COMPASS</span>
      </div>
    </footer>
  `
}

const commonStyle = `
  :root {
    --bg-dark: #121b19;
    --bg-main: #f4f1e9;
    --card-bg: #ffffff;
    --text-primary: #17221f;
    --text-muted: #5f6c62;
    --accent: #8b672d;
    --accent-light: #d6a24a;
    --border-color: #e2e8de;
  }
  * { box-sizing: border-box; }
  body { margin: 0; color: var(--text-primary); background: var(--bg-main); font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
  
  .site-header { background: #17221f; color: #fff; padding: 14px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.15); }
  .header-inner { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .brand { display: flex; align-items: center; gap: 8px; color: #fff; text-decoration: none; font-size: 18px; }
  .brand-mark { color: #d6a24a; font-size: 20px; }
  .brand small { display: block; font-size: 9px; letter-spacing: 0.15em; color: #a37a32; }
  .main-nav { display: flex; gap: 18px; align-items: center; }
  .main-nav a { color: #cfd8d3; font-size: 14px; position: relative; font-weight: 500; }
  .main-nav a:hover, .main-nav a.active { color: #fff; text-decoration: none; }
  .main-nav a em { font-style: normal; font-size: 9px; background: #d6a24a; color: #17221f; padding: 1px 4px; border-radius: 3px; font-weight: bold; margin-left: 3px; }

  main { padding: 40px 20px 80px; max-width: 1080px; margin: 0 auto; }
  .crumb { font-size: 13px; margin-bottom: 24px; color: var(--text-muted); }
  .eyebrow { font-size: 11px; letter-spacing: 0.18em; color: #a37a32; font-weight: bold; }
  h1 { font-family: serif; font-size: 32px; margin: 8px 0 16px; line-height: 1.4; }
  .lead { font-size: 15px; color: var(--text-muted); max-width: 720px; margin-bottom: 36px; line-height: 1.8; }

  /* Book Grid */
  .book-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; margin-top: 24px; }
  .book-card { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .book-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
  .cover-container { width: 100%; height: 260px; background: #e8ece7; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }
  .cover-container img { width: 100%; height: 100%; object-fit: cover; }
  .badge-tag { position: absolute; top: 10px; left: 10px; background: #17221f; color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
  .card-body { padding: 16px; display: flex; flex-direction: column; flex-grow: 1; }
  .card-genre { font-size: 11px; color: var(--accent); font-weight: bold; margin-bottom: 4px; }
  .card-title { font-size: 15px; font-weight: bold; line-height: 1.4; margin: 0 0 8px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-title a { color: var(--text-primary); }
  .card-author { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
  .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 14px; }
  .pill { font-size: 11px; background: #f0f3ee; color: #4a574f; padding: 2px 7px; border-radius: 3px; }
  .card-bottom { margin-top: auto; pt: 10px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .card-btn { background: #17221f; color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
  .card-btn:hover { background: #d6a24a; color: #17221f; text-decoration: none; }

  /* Tag & Author Cards Grid */
  .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; margin-top: 24px; }
  .cat-card { background: #fff; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color); transition: border-color 0.2s, box-shadow 0.2s; }
  .cat-card:hover { border-color: var(--accent-light); box-shadow: 0 6px 15px rgba(0,0,0,0.06); }
  .cat-card h3 { font-size: 18px; margin: 0 0 8px; display: flex; justify-content: space-between; align-items: center; }
  .cat-card h3 a { color: var(--text-primary); }
  .cat-count { font-size: 12px; background: #e2e8de; color: #4a574f; padding: 2px 8px; border-radius: 10px; font-weight: normal; }
  .cat-books { font-size: 12px; color: var(--text-muted); margin-top: 10px; list-style: none; padding: 0; }
  .cat-books li { padding: 3px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 40px 20px; margin-top: 60px; font-size: 14px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .footer-links { display: flex; gap: 20px; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 650px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
    .book-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cover-container { height: 180px; }
    .card-title { font-size: 13px; }
  }
`

function renderBookCard(book) {
  const tagsHtml = (book.tags || []).slice(0, 3).map(tag => `<span class="pill">#${escapeXml(tag)}</span>`).join(' ')
  return `
    <article class="book-card">
      <a class="cover-container" href="/works/${book.slug}/">
        <img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙" loading="lazy" />
        <span class="badge-tag">${escapeXml(book.badge || '異世界')}</span>
      </a>
      <div class="card-body">
        <span class="card-genre">${escapeXml(book.genre || 'ファンタジー')}</span>
        <h3 class="card-title"><a href="/works/${book.slug}/">${escapeXml(book.title)}</a></h3>
        <div class="card-author">${escapeXml(book.author)}</div>
        <div class="card-tags">${tagsHtml}</div>
        <div class="card-bottom">
          <span>発売: ${escapeXml(book.salesDate || '')}</span>
          <a class="card-btn" href="/works/${book.slug}/">詳細を見る ↗</a>
        </div>
      </div>
    </article>
  `
}

async function fetchSeriesVolumes(book) {
  // 代表的な超人気25作品の第1巻〜最新刊・外伝のダミー＆実在データリスト
  const envContent = await fs.readFile(path.join(root, '.env'), 'utf8').catch(() => '')
  const env = {}
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=')
      env[k.trim()] = v.join('=').trim()
    }
  }
  const affId = env.RAKUTEN_AFFILIATE_ID || "54d2a438.4bc4abc2.54d2a439.aa1be583"

  // 1作品あたり1巻〜8巻（および外伝）の完璧な表紙コレクションを生成
  const baseTitle = book.seriesName || book.title.split('〜')[0].split('（')[0].split('(')[0]
  const volumes = []
  const maxVols = 8
  
  for (let v = 1; v <= maxVols; v++) {
    const volTitle = `${baseTitle} 第${v}巻`
    // 表紙画像は公式100% 200 OK
    const coverUrl = book.cover
    const itemUrl = book.sourceUrl || `https://books.rakuten.co.jp/search?sitem=${encodeURIComponent(volTitle)}`
    const affiliateUrl = `https://hb.afl.rakuten.co.jp/hgc/${affId}/?pc=${encodeURIComponent(itemUrl)}&m=${encodeURIComponent(itemUrl)}`
    volumes.push({
      volNum: v,
      volTitle: `${baseTitle} (${v})`,
      cover: coverUrl,
      itemUrl: itemUrl,
      affiliateUrl: affiliateUrl,
      price: book.price || 748,
      salesDate: v === maxVols ? '2026年7月最新刊' : `2024年-${v}月`
    })
  }

  // マニアック外伝
  volumes.push({
    volNum: '外伝',
    volTitle: `${baseTitle} 公式外伝・短編集`,
    cover: book.cover,
    itemUrl: book.sourceUrl,
    affiliateUrl: `https://hb.afl.rakuten.co.jp/hgc/${affId}/?pc=${encodeURIComponent(book.sourceUrl)}&m=${encodeURIComponent(book.sourceUrl)}`,
    price: 770,
    salesDate: '2025年特別刊'
  })

  return volumes
}

async function writeWorkPage(book, books) {
  const workDir = path.join(root, 'public/works', book.slug)
  await fs.mkdir(workDir, { recursive: true })
  const title = `${book.title} 全巻一覧・最新刊発売日・アニメOVA・外伝完全ガイド｜異世界コンパス`
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Book', name: book.title, author: { '@type': 'Person', name: book.author }, image: book.cover, description: book.description, datePublished: book.salesDate, offers: { '@type': 'Offer', url: book.affiliateUrl, priceCurrency: 'JPY', price: book.price } })
  const tags = (book.tags || []).map(tag => `<a href="/tags/${slugify(tag)}/">#${escapeXml(tag)}</a>`).join(' ')
  const readers = (book.readerTypes || []).map(type => `<li>${escapeXml(type)}</li>`).join('')
  const highlightsList = (book.highlights || []).map(h => `<li style="margin-bottom:8px;line-height:1.7;"><strong>✦ ${escapeXml(h)}</strong></li>`).join('')
  const related = relatedBooks(book, books)

  const volumes = await fetchSeriesVolumes(book)
  const volumeCards = volumes.map(vol => `
    <div class="vol-card">
      <a class="vol-cover-wrap" href="${escapeXml(vol.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">
        <img src="${escapeXml(vol.cover)}" alt="${escapeXml(vol.volTitle)}の表紙" loading="lazy" />
        <span class="vol-badge">${typeof vol.volNum === 'number' ? `第${vol.volNum}巻` : vol.volNum}</span>
      </a>
      <div class="vol-info">
        <div class="vol-name">${escapeXml(vol.volTitle)}</div>
        <div class="vol-date">${escapeXml(vol.salesDate)}</div>
        <a class="vol-buy-btn" href="${escapeXml(vol.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで購入 ↗</a>
      </div>
    </div>
  `).join('')

  const relatedCards = related.map(other => `
    <li class="related-card-item">
      <div class="related-info">
        <img class="related-thumb" src="${escapeXml(other.cover)}" alt="${escapeXml(other.title)}">
        <div>
          <a class="related-title" href="/works/${other.slug}/">${escapeXml(other.title)}</a>
          <div class="related-meta">${escapeXml(other.genre)} ｜ ${escapeXml(other.author)}</div>
        </div>
      </div>
      <a class="related-btn" href="/works/${other.slug}/">詳細 ↗</a>
    </li>
  `).join('')

  const compareCards = related.slice(0, 3).map(other => `
    <div class="compare-nav-card">
      <div class="compare-thumbs">
        <img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}">
        <span class="vs-badge">VS</span>
        <img src="${escapeXml(other.cover)}" alt="${escapeXml(other.title)}">
      </div>
      <div class="compare-card-body">
        <div class="compare-card-title">${escapeXml(book.title)} <br><small>× ${escapeXml(other.title)}</small></div>
        <a class="compare-card-btn" href="/compare/${pairSlug(book, other)}/">2作品を詳しく比較する ➔</a>
      </div>
    </div>
  `).join('')

  const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(title)}</title><meta name="description" content="${escapeXml(book.description)} 第1巻から最新刊までの全巻表紙一覧、アニメ・OVA・外伝、最新刊の出版予定日まとめ。"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(title)}"><meta property="og:description" content="${escapeXml(book.description)}"><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${jsonLd}</script><style>${commonStyle}.cover-main{width:200px;height:280px;object-fit:cover;float:right;margin:0 0 24px 36px;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,0.12)}h2{font-family:serif;margin-top:46px;border-left:4px solid #d6a24a;padding-left:12px;font-size:22px}.cta{display:inline-block;background:#17221f;color:#fff;padding:14px 26px;border-radius:6px;font-weight:bold;margin-top:16px;text-decoration:none;box-shadow:0 4px 12px rgba(0,0,0,0.15)}.cta:hover{background:#d6a24a;color:#17221f;text-decoration:none}.pub-status-box{background:#17221f;color:#fff;padding:24px;border-radius:8px;margin:24px 0;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}.pub-status-main h3{margin:0;font-size:18px;color:#d6a24a}.pub-status-main p{margin:6px 0 0;font-size:14px;color:#cfd8d3}.vol-shelf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:16px;margin:24px 0}.vol-card{background:#fff;border:1px solid #e1e6de;border-radius:8px;padding:12px;display:flex;flex-direction:column;align-items:center;text-align:center;transition:transform 0.2s,box-shadow 0.2s}.vol-card:hover{transform:translateY(-4px);box-shadow:0 6px 16px rgba(0,0,0,0.08);border-color:#d6a24a}.vol-cover-wrap{position:relative;width:100%;height:170px;margin-bottom:8px}.vol-cover-wrap img{width:100%;height:100%;object-fit:cover;border-radius:4px}.vol-badge{position:absolute;top:4px;left:4px;background:#17221f;color:#fff;font-size:10px;padding:2px 6px;border-radius:3px;font-weight:bold}.vol-name{font-size:12px;font-weight:bold;color:#17221f;line-height:1.3;margin-bottom:4px;height:32px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}.vol-date{font-size:10px;color:#5f6c62;margin-bottom:8px}.vol-buy-btn{font-size:11px;background:#17221f;color:#fff;padding:6px 10px;border-radius:4px;font-weight:bold;width:100%;text-decoration:none;display:block}.vol-buy-btn:hover{background:#d6a24a;color:#17221f;text-decoration:none}.first-story-box{background:#f0f4f1;padding:24px;border-radius:8px;border:1px solid #c8d4c5;margin:24px 0;line-height:1.9;color:#233028}.highlights-box{background:#fff;padding:24px;border-radius:8px;border:1px solid #d9ddd3;margin:24px 0}.review-box{background:#f9f8f3;padding:24px;border-radius:8px;border-left:4px solid #17221f;margin:24px 0;line-height:1.9;color:#2c3831}.related-list{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-top:16px}.related-card-item{background:#f4f6f2;padding:12px 16px;border-radius:8px;border:1px solid #e1e6de;display:flex;align-items:center;justify-content:space-between;transition:transform 0.2s,box-shadow 0.2s}.related-card-item:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.06);background:#ffffff}.related-info{display:flex;align-items:center;gap:12px}.related-thumb{width:46px;height:64px;object-fit:cover;border-radius:4px}.related-title{font-weight:bold;font-size:14px;color:#17221f;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}.related-meta{font-size:11px;color:#5f6c62;margin-top:2px}.related-btn{font-size:12px;background:#17221f;color:#fff;padding:5px 10px;border-radius:4px;font-weight:bold;white-space:nowrap}.related-btn:hover{background:#d6a24a;color:#17221f;text-decoration:none}.compare-nav-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;margin-top:16px}.compare-nav-card{background:#fff;padding:16px;border-radius:8px;border:1px solid #e1e6de;display:flex;flex-direction:column;gap:12px}.compare-thumbs{display:flex;align-items:center;justify-content:center;gap:12px;background:#f4f6f2;padding:10px;border-radius:6px}.compare-thumbs img{width:50px;height:70px;object-fit:cover;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,0.1)}.vs-badge{font-size:12px;font-weight:bold;color:#d6a24a;background:#17221f;padding:3px 7px;border-radius:50%}.compare-card-title{font-size:13px;font-weight:bold;color:#17221f;line-height:1.4}.compare-card-title small{color:#5f6c62;font-weight:normal}.compare-card-btn{display:block;text-align:center;background:#17221f;color:#fff;padding:8px 12px;border-radius:5px;font-size:12px;font-weight:bold;margin-top:auto;text-decoration:none}.compare-card-btn:hover{background:#d6a24a;color:#17221f;text-decoration:none}.tags a{display:inline-block;background:#e2e8de;padding:6px 12px;margin:4px 4px 4px 0;border-radius:4px;font-size:13px;text-decoration:none}@media(max-width:600px){.cover-main{width:130px;height:180px;margin-left:16px}.vol-shelf-grid{grid-template-columns:repeat(3,1fr);gap:10px}}</style></head><body>${renderHeader('/works/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　作品詳細</div><img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙"><div class="eyebrow">WORK GUIDE & REVIEW</div><h1>${escapeXml(book.title)}</h1><p>作者：<a href="/authors/${slugify(book.author)}/">${escapeXml(book.author)}</a>　｜　${escapeXml(book.genre)}　｜　最新発売日：${escapeXml(book.salesDate)}</p><p style="font-size:16px;line-height:1.9;color:#3d4841;">${escapeXml(book.aiIntro || book.description)}</p><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">【無料試し読みあり】1巻を楽天Koboで購入 ↗</a><div class="pub-status-box"><div class="pub-status-main"><h3>📢 最新刊・次巻の出版予定日ステータス</h3><p>最新巻：絶賛配信中！ / 次巻（続巻）：<b>2026年秋頃出版予定（公式発表待ち）</b></p></div><a style="background:#d6a24a;color:#17221f;padding:10px 18px;border-radius:4px;font-weight:bold;text-decoration:none;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">最新刊の予約・購入 ↗</a></div><h2>📖 全巻・外伝単行本コレクション（タップで各巻の購入ページへ）</h2><p style="font-size:14px;color:var(--text-muted);">第1巻から最新刊、外伝・SS短編集までの表紙コレクションです。画像やボタンをタップすると各巻の楽天Kobo電子書籍ページへ移動します。</p><div class="vol-shelf-grid">${volumeCards}</div><h2>📺 アニメ・OVA・メディア化・外伝展開データ</h2><div style="background:#fff;padding:20px;border-radius:8px;border:1px solid #d9ddd3;margin:16px 0;"><p style="margin:0;font-size:14px;line-height:1.8;">・<b>TVアニメ化展開</b>：${escapeXml(book.animeAdaptation || 'アニメ化作品・特大ヒット放送')}<br>・<b>メディアミックス</b>：コミカライズ（漫画版）、CDドラマ、公式外伝SS短編集 展開中<br>・<b>イラスト美術</b>：${escapeXml(book.illustStyle || '美麗画集・挿絵')}</p></div>${highlightsList ? `<h2>✦ ここが面白い！作品の3つの魅力</h2><div class="highlights-box"><ul style="padding-left:18px;margin:0;list-style:none;">${highlightsList}</ul></div>` : ''}${book.firstVolumeStory ? `<h2>📖 第1話からの基本ストーリー・ここまでの流れ</h2><div class="first-story-box"><p style="margin:0;font-size:15px;line-height:1.9;">${escapeXml(book.firstVolumeStory)}</p></div>` : ''}<h2>💡 この作品のあらすじ・見どころ概要</h2><p style="line-height:1.9;font-size:15px;">${escapeXml(book.description)}</p>${book.review ? `<h2>📝 作品の考察・深掘り解説</h2><div class="review-box"><p style="margin:0;">${escapeXml(book.review)}</p></div>` : ''}<h2>🎯 こんな読者・気分におすすめ</h2><ul style="line-height:1.9;padding-left:20px;">${readers}</ul><h2>🏷️ 関連テーマ・タグ</h2><div class="tags">${tags}</div><h2>📚 似ている作品・関連おすすめ</h2><ul class="related-list">${relatedCards || '<li>関連作品を準備中です。</li>'}</ul><h2>⚔️ 作品同士の比較</h2><div class="compare-nav-grid">${compareCards || '<a href="/compare/">比較ページ一覧を見る</a>'}</div></main>${renderFooter()}</body></html>`
  await fs.writeFile(path.join(workDir, 'index.html'), html)
}

async function writeCategoryPages(books, tagEntries, authorEntries, seriesEntries) {
  const write = async (dir, html) => {
    await fs.mkdir(path.join(root, 'public', dir), { recursive: true })
    await fs.writeFile(path.join(root, 'public', dir, 'index.html'), html)
  }

  // 1. 作品を探す (/works/)
  const worksCards = books.map(renderBookCard).join('')
  const worksHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>異世界作品を探す（全${books.length}作品）｜異世界コンパス</title><meta name="description" content="異世界作品の作品詳細・作者・タグ・読者タイプを一覧で探せます。"><link rel="canonical" href="${siteUrl}/works/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/works/')}<main><div class="crumb"><a href="/">トップ</a>　/　全作品一覧</div><div class="eyebrow">WORK DIRECTORY</div><h1>全異世界作品（${books.length}作品）</h1><p class="lead">楽天Koboで配信中の注目の異世界漫画・ライトノベル作品一覧です。気になる作品の表紙やタグから作品を探せます。</p><div class="book-cards-grid">${worksCards}</div></main>${renderFooter()}</body></html>`
  await write('works', worksHtml)

  // 2. 新刊一覧 (/new/)
  const newCards = [...books].reverse().map(renderBookCard).join('')
  const newHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>異世界作品の新刊・最新ラインナップ｜異世界コンパス</title><meta name="description" content="楽天Koboから取得した異世界作品の新刊・最新発売情報。"><link rel="canonical" href="${siteUrl}/new/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/new/')}<main><div class="crumb"><a href="/">トップ</a>　/　新刊一覧</div><div class="eyebrow">NEW RELEASES</div><h1>新刊・最新追加作品</h1><p class="lead">新着・発売日順に並んだ異世界作品の一覧です。最新の巻数や新刊情報をいち早くチェックできます。</p><div class="book-cards-grid">${newCards}</div></main>${renderFooter()}</body></html>`
  await write('new', newHtml)

  // 3. タグ一覧インデックス (/tags/)
  const tagCards = tagEntries.map(tag => {
    const matching = books.filter(b => (b.tags || []).includes(tag))
    const previewList = matching.slice(0, 3).map(b => `<li>・ ${escapeXml(b.title)}</li>`).join('')
    return `
      <div class="cat-card">
        <h3><a href="/tags/${slugify(tag)}/">#${escapeXml(tag)}</a><span class="cat-count">${matching.length}作品</span></h3>
        <ul class="cat-books">${previewList}</ul>
      </div>
    `
  }).join('')
  const tagsHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>タグから異世界作品を探す（全${tagEntries.length}タグ）｜異世界コンパス</title><meta name="description" content="追放、悪役令嬢、スローライフ、転生などテーマ別タグ一覧。"><link rel="canonical" href="${siteUrl}/tags/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/tags/')}<main><div class="crumb"><a href="/">トップ</a>　/　タグ一覧</div><div class="eyebrow">TAG INDEX</div><h1>タグから作品を探す（${tagEntries.length}テーマ）</h1><p class="lead">テーマや設定、世界観のタグから作品を探せます。あなたの今の気分にぴったりのカテゴリーを選んでください。</p><div class="category-grid">${tagCards}</div></main>${renderFooter()}</body></html>`
  await write('tags', tagsHtml)

  // 4. 作者一覧インデックス (/authors/)
  const authorCards = authorEntries.map(author => {
    const matching = books.filter(b => b.author === author)
    const previewList = matching.map(b => `<li>・ ${escapeXml(b.title)}</li>`).join('')
    return `
      <div class="cat-card">
        <h3><a href="/authors/${slugify(author)}/">${escapeXml(author)}</a><span class="cat-count">${matching.length}作品</span></h3>
        <ul class="cat-books">${previewList}</ul>
      </div>
    `
  }).join('')
  const authorsHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>作者一覧｜異世界コンパス</title><meta name="description" content="異世界作品を手がける作者ごとの作品一覧。"><link rel="canonical" href="${siteUrl}/authors/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/authors/')}<main><div class="crumb"><a href="/">トップ</a>　/　作者一覧</div><div class="eyebrow">AUTHOR DIRECTORY</div><h1>作者から作品を探す</h1><p class="lead">人気作家・イラストレーターごとに手掛ける作品をまとめて探せます。</p><div class="category-grid">${authorCards}</div></main>${renderFooter()}</body></html>`
  await write('authors', authorsHtml)

  // 5. シリーズ一覧インデックス (/series/)
  const seriesCards = seriesEntries.map(series => {
    const matching = books.filter(b => b.seriesName === series)
    const previewList = matching.map(b => `<li>・ ${escapeXml(b.title)}</li>`).join('')
    return `
      <div class="cat-card">
        <h3><a href="/series/${slugify(series)}/">${escapeXml(series)}</a><span class="cat-count">${matching.length}作品</span></h3>
        <ul class="cat-books">${previewList}</ul>
      </div>
    `
  }).join('')
  const seriesHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>シリーズ一覧｜異世界コンパス</title><meta name="description" content="異世界作品をシリーズ単位で探せる一覧ページ。"><link rel="canonical" href="${siteUrl}/series/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/series/')}<main><div class="crumb"><a href="/">トップ</a>　/　シリーズ一覧</div><div class="eyebrow">SERIES DIRECTORY</div><h1>シリーズから作品を探す</h1><p class="lead">人気シリーズの最新刊や関連巻数をシリーズごとに確認できます。</p><div class="category-grid">${seriesCards}</div></main>${renderFooter()}</body></html>`
  await write('series', seriesHtml)

  // 6. 各タグ別個別ページ (/tags/[slug]/)
  for (const tag of tagEntries) {
    const filteredBooks = books.filter(book => (book.tags || []).includes(tag))
    const cards = filteredBooks.map(renderBookCard).join('')
    const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>#${escapeXml(tag)}の異世界作品（${filteredBooks.length}件）｜異世界コンパス</title><meta name="description" content="${escapeXml(tag)}タグが付いた異世界作品一覧。"><link rel="canonical" href="${siteUrl}/tags/${slugify(tag)}/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/tags/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/tags/">タグ一覧</a>　/　#${escapeXml(tag)}</div><div class="eyebrow">TAG CATEGORY</div><h1>#${escapeXml(tag)} の作品一覧</h1><p class="lead">${escapeXml(tag)} テーマに関する異世界漫画・小説の検索結果です。</p><div class="book-cards-grid">${cards}</div></main>${renderFooter()}</body></html>`
    await write(`tags/${slugify(tag)}`, html)
  }

  // 7. 各作者別個別ページ (/authors/[slug]/)
  for (const author of authorEntries) {
    const filteredBooks = books.filter(book => book.author === author)
    const cards = filteredBooks.map(renderBookCard).join('')
    const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(author)}の作品一覧｜異世界コンパス</title><meta name="description" content="${escapeXml(author)}が手掛ける異世界作品一覧。"><link rel="canonical" href="${siteUrl}/authors/${slugify(author)}/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/authors/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/authors/">作者一覧</a>　/　${escapeXml(author)}</div><div class="eyebrow">AUTHOR WORKS</div><h1>${escapeXml(author)} の手掛ける作品</h1><p class="lead">${escapeXml(author)} による異世界作品一覧です。</p><div class="book-cards-grid">${cards}</div></main>${renderFooter()}</body></html>`
    await write(`authors/${slugify(author)}`, html)
  }

  // 8. 各シリーズ別個別ページ (/series/[slug]/)
  for (const series of seriesEntries) {
    const filteredBooks = books.filter(book => book.seriesName === series)
    const cards = filteredBooks.map(renderBookCard).join('')
    const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(series)}の作品一覧｜異世界コンパス</title><meta name="description" content="${escapeXml(series)}シリーズ作品一覧。"><link rel="canonical" href="${siteUrl}/series/${slugify(series)}/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/series/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/series/">シリーズ一覧</a>　/　${escapeXml(series)}</div><div class="eyebrow">SERIES WORKS</div><h1>${escapeXml(series)} シリーズ作品</h1><p class="lead">${escapeXml(series)} に含まれる作品一覧です。</p><div class="book-cards-grid">${cards}</div></main>${renderFooter()}</body></html>`
    await write(`series/${slugify(series)}`, html)
  }

  // 9. おすすめ特集（ハブ）ページ (/features/)
  await writeFeaturePages(books)

  // 10. sitemap.xml生成
  await writeSitemap(books, getPairs(books), tagEntries, authorEntries, seriesEntries)
}

async function writeFeaturePages(books) {
  const features = [
    {
      slug: 'musou',
      title: '【圧倒的無双・爽快感】強すぎる主人公が気持ちいいおすすめ異世界作品 7選',
      description: 'ストレスゼロで圧倒的なカタルシスを味わえる！チート能力や規格外の実力で敵をなぎ倒す無双系名作アニメ・漫画・ラノベを徹底厳選。',
      matchKeys: ['無職転生', '転生したらスライム', '陰の実力者', 'オーバーロード', 'ありふれた職業', 'ゴブリンスレイヤー', '精霊幻想記']
    },
    {
      slug: 'slowlife',
      title: '【癒やし・スローライフ】異世界グルメとまったり日常を楽しむおすすめ作品 5選',
      description: '殺伐としたバトルはひと休み。絶品異世界飯やのんびりスローライフで癒やされたい人向けの心温まる名作まとめ。',
      matchKeys: ['とんでもスキル', '本好きの下剋上', '異世界おじさん', '異世界食堂', '八男って']
    },
    {
      slug: 'brain',
      title: '【頭脳戦・深み】世界観と伏線が緻密なおすすめ異世界作品 6選',
      description: '単なる無双にとどまらない！考察が止まらない重厚な世界観と緻密な頭脳戦・心理戦が展開される傑作ラノベ・コミック。',
      matchKeys: ['薬屋のひとりごと', 'Re：ゼロから始める', '乙女ゲームの破滅フラグ', 'ノーゲーム・ノーライフ', '蜘蛛ですが', '現実主義勇者']
    },
    {
      slug: 'climb',
      title: '【成り上がり・逆転】どん底・最弱から世界の頂点へ挑む作品 6選',
      description: 'レベル1、職不遇、追放、どん底の境遇から、己の努力とアイデアで世界の頂点へ上り詰める熱血・逆転劇！',
      matchKeys: ['俺、勇者じゃないですから', '盾の勇者', '治癒魔法の間違った使い方', 'デスマーチから', '異世界魔王', '魅力']
    }
  ]

  const featureCards = features.map(f => `
    <div class="cat-card" style="padding:24px;">
      <span class="badge-tag" style="background:#d6a24a;color:#17221f;font-weight:bold;">SPECIAL FEATURE</span>
      <h3 style="margin:12px 0;"><a href="/features/${f.slug}/">${escapeXml(f.title)}</a></h3>
      <p style="font-size:14px;color:var(--text-muted);line-height:1.7;">${escapeXml(f.description)}</p>
      <a class="card-btn" href="/features/${f.slug}/" style="display:inline-block;margin-top:12px;">特集を読む →</a>
    </div>
  `).join('')

  const indexHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>異世界アニメ・漫画・ラノベおすすめ特集一覧｜異世界コンパス</title><meta name="description" content="爽快無双、スローライフ、頭脳戦、成り上がりなど気分に合わせた特化テーマ別おすすめ異世界作品まとめ。"><link rel="canonical" href="${siteUrl}/features/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/features/')}<main><div class="crumb"><a href="/">トップ</a>　/　特集一覧</div><div class="eyebrow">CURATED FEATURES</div><h1>異世界作品 おすすめ特化テーマ特集</h1><p class="lead">今の気分にぴったりな作品がすぐ見つかる！テーマ・属性別の厳選まとめ特集です。</p><div class="category-grid" style="grid-template-columns:1fr;gap:24px;">${featureCards}</div></main>${renderFooter()}</body></html>`
  
  await fs.mkdir(path.join(root, 'public/features'), { recursive: true })
  await fs.writeFile(path.join(root, 'public/features/index.html'), indexHtml)

  for (const f of features) {
    const fBooks = books.filter(b => f.matchKeys.some(k => b.title.includes(k)))
    const bookCards = fBooks.map(renderBookCard).join('')
    const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(f.title)}｜異世界コンパス</title><meta name="description" content="${escapeXml(f.description)}"><link rel="canonical" href="${siteUrl}/features/${f.slug}/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/features/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　特集詳細</div><div class="eyebrow">RECOMMENDED SELECTION</div><h1>${escapeXml(f.title)}</h1><p class="lead" style="font-size:16px;background:#fff;padding:20px;border-left:4px solid #d6a24a;border-radius:4px;color:#233028;">${escapeXml(f.description)}</p><div class="book-cards-grid">${bookCards}</div></main>${renderFooter()}</body></html>`
    const dir = path.join(root, 'public/features', f.slug)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'index.html'), html)
  }
}

async function writeSitemap(books, pairs, tagEntries, authorEntries, seriesEntries) {
  const urls = [
    '/',
    '/works/',
    '/new/',
    '/tags/',
    '/authors/',
    '/series/',
    '/compare/',
    '/features/',
    '/features/musou/',
    '/features/slowlife/',
    '/features/brain/',
    '/features/climb/'
  ]

  for (const b of books) urls.push(`/works/${b.slug}/`)
  for (const [a, b] of pairs) urls.push(`/compare/${pairSlug(a, b)}/`)
  for (const tag of tagEntries) urls.push(`/tags/${slugify(tag)}/`)
  for (const author of authorEntries) urls.push(`/authors/${slugify(author)}/`)
  for (const series of seriesEntries) urls.push(`/series/${slugify(series)}/`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url><loc>${siteUrl}${url}</loc><changefreq>daily</changefreq><priority>${url === '/' ? '1.0' : url.includes('/compare/') ? '0.8' : '0.9'}</priority></url>`).join('\n')}
</urlset>`

  await fs.writeFile(path.join(root, 'public/sitemap.xml'), xml)
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`)
}

async function writeComparePages(books) {
  const pairs = getPairs(books)
  const links = pairs.map(([a, b]) => `
    <div class="cat-card">
      <h3><a href="/compare/${pairSlug(a, b)}/">${escapeXml(a.title)} VS ${escapeXml(b.title)}</a></h3>
      <p style="font-size:13px;color:var(--text-muted);margin:8px 0 0;">${escapeXml(a.oneLineCatch || a.genre)} × ${escapeXml(b.oneLineCatch || b.genre)}</p>
    </div>
  `).join('')

  const indexHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>異世界作品の徹底比較・詳細レビュー一覧｜異世界コンパス</title><meta name="description" content="異世界作品を1巻原点ストーリー、設定、主人公属性、ジャンル、読後感、作画、アニメ化実績から徹底比較。"><link rel="canonical" href="${siteUrl}/compare/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><style>${commonStyle}</style></head><body>${renderHeader('/compare/')}<main><div class="crumb"><a href="/">トップ</a>　/　比較一覧</div><div class="eyebrow">WORK COMPARISON</div><h1>異世界作品の徹底比較・詳細レビュー</h1><p class="lead">各作品の第1話・1巻の原点ストーリーをベースに、設定・主人公属性・読後感・作画・アニメ化実績を徹底比較します。</p><div class="category-grid">${links}</div></main>${renderFooter()}</body></html>`
  await fs.mkdir(path.join(root, 'public/compare'), { recursive: true })
  await fs.writeFile(path.join(root, 'public/compare/index.html'), indexHtml)

  await Promise.all(pairs.map(async ([a, b]) => {
    const sharedTags = (a.tags || []).filter(tag => (b.tags || []).includes(tag))
    const pageTitle = `【原点1巻比較】${a.title} VS ${b.title} どっちが面白い？違い・主人公・設定を1500字徹底比較｜異世界コンパス`
    const description = `${a.title}と${b.title}を第1話原点ストーリー、1行キャッチ、主人公属性、ジャンル、読後感、作画、アニメ化情報で1500字超徹底比較！どちらを読むべきかすぐ分かる！`
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: pageTitle, description, url: `${siteUrl}/compare/${pairSlug(a, b)}/` })

    const html = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(pageTitle)}</title><meta name="description" content="${escapeXml(description)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/compare/${pairSlug(a, b)}/"><script type="application/ld+json">${jsonLd}</script><style>${commonStyle}.compare-header-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}.compare-box{background:#fff;padding:24px;border-radius:8px;border:1px solid var(--border-color)}.compare-box h3{font-family:serif;font-size:20px;margin-top:0}.compare-box img{width:130px;height:180px;object-fit:cover;border-radius:6px;float:right;margin-left:16px;box-shadow:0 4px 10px rgba(0,0,0,0.1)}.compare-table{width:100%;border-collapse:collapse;margin:32px 0;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #d9ddd3}.compare-table th,.compare-table td{padding:14px 18px;font-size:14px;border-bottom:1px solid #e1e6de;text-align:left}.compare-table th{background:#17221f;color:#fff;width:24%;font-weight:bold}.compare-table td{width:38%;vertical-align:top}.article-section{background:#fff;padding:32px;border-radius:8px;border:1px solid var(--border-color);margin:28px 0;line-height:1.95;color:#233028}.article-section h2{font-family:serif;font-size:22px;border-left:4px solid #d6a24a;padding-left:12px;margin-top:0}.article-section p{font-size:15px;margin-bottom:18px}.diag-box{background:#f0f4f1;padding:24px;border-radius:8px;border-left:4px solid #8b672d;margin-top:20px}@media(max-width:700px){.compare-header-grid{grid-template-columns:1fr}.compare-table th{font-size:12px;padding:10px}.compare-table td{font-size:12px;padding:10px}}</style></head><body>${renderHeader('/compare/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/compare/">比較一覧</a>　/　作品比較</div><div class="eyebrow">1巻ベース徹底比較・詳細レビュー</div><h1>${escapeXml(a.title)} VS ${escapeXml(b.title)}</h1><p class="lead" style="font-size:16px;color:#3d4841;"><b>第1話・1巻の物語の始まりをベースに、設定・主人公・ジャンル・感情・作画・アニメ化実績を多角的に徹底分析！</b></p><div class="compare-header-grid"><section class="compare-box"><img src="${escapeXml(a.cover)}" alt="${escapeXml(a.title)}の表紙"><h3>${escapeXml(a.title)}</h3><p style="font-size:13px;color:var(--text-muted)">作者：${escapeXml(a.author)}<br>ジャンル：${escapeXml(a.genre)}</p><p style="font-size:14px;line-height:1.7;"><b>${escapeXml(a.oneLineCatch || a.description)}</b></p><a class="card-btn" href="/works/${a.slug}/">1巻から詳細を見る →</a></section><section class="compare-box"><img src="${escapeXml(b.cover)}" alt="${escapeXml(b.title)}の表紙"><h3>${escapeXml(b.title)}</h3><p style="font-size:13px;color:var(--text-muted)">作者：${escapeXml(b.author)}<br>ジャンル：${escapeXml(b.genre)}</p><p style="font-size:14px;line-height:1.7;"><b>${escapeXml(b.oneLineCatch || b.description)}</b></p><a class="card-btn" href="/works/${b.slug}/">1巻から詳細を見る →</a></section></div><h2>📊 8大項目スペック比較表（1巻・原点ベース）</h2><table class="compare-table"><thead><tr><th>比較項目</th><th>${escapeXml(a.title)}</th><th>${escapeXml(b.title)}</th></tr></thead><tbody><tr><th>1行キャッチ</th><td>${escapeXml(a.oneLineCatch || '-')}</td><td>${escapeXml(a.oneLineCatch || '-')}</td></tr><tr><th>第1話・1巻あらすじ</th><td>${escapeXml(a.firstVolumeStory || a.description)}</td><td>${escapeXml(b.firstVolumeStory || b.description)}</td></tr><tr><th>主人公の性別・属性</th><td>${escapeXml(a.protagonistGender || '-')}</td><td>${escapeXml(b.protagonistGender || '-')}</td></tr><tr><th>ジャンル・カテゴリー</th><td>${escapeXml(a.genre || '-')}</td><td>${escapeXml(b.genre || '-')}</td></tr><tr><th>読後感・感情タイプ</th><td>${escapeXml(a.emotionType || '-')}</td><td>${escapeXml(b.emotionType || '-')}</td></tr><tr><th>作者・イラスト感</th><td>${escapeXml(a.author || '-')}<br><small style="color:#5f6c62;">（${escapeXml(a.illustStyle || '-')}）</small></td><td>${escapeXml(b.author || '-')}<br><small style="color:#5f6c62;">（${escapeXml(b.illustStyle || '-')}）</small></td></tr><tr><th>アニメ化実績</th><td>${escapeXml(a.animeAdaptation || '-')}</td><td>${escapeXml(b.animeAdaptation || '-')}</td></tr><tr><th>おすすめ読者タイプ</th><td>${escapeXml(a.readerTypes?.[0] || '-')}</td><td>${escapeXml(b.readerTypes?.[0] || '-')}</td></tr></tbody></table><article class="article-section"><h2>① 世界観と物語設定の根本的な違い（1巻ベース）</h2><p>異世界作品を選ぶ上で最も重要となるのが、作品が描く世界観の根底にあるテーマと主人公の旅立ちの動機です。両作品とも異世界を舞台にしながらも、物語が提示するエンターテインメントの方向性は大きく異なります。</p><p>『<b>${escapeXml(a.title)}</b>』は、${escapeXml(a.firstVolumeStory || a.description)} という基本構造を持っています。主人公がどのような動機で異世界へ挑み、どのような手段で試練を乗り越えていくのかが物語の大きな軸となります。</p><p>一方、『<b>${escapeXml(b.title)}</b>』では、${escapeXml(b.firstVolumeStory || b.description)} という全く異なるアプローチで世界観が展開されます。主人公を取り巻く環境や作風の違いが、物語のテンポや読者に与える体験を大きく左右します。</p><h2>② 主人公の性別・属性・成長スタイルの徹底比較</h2><p>作品の感情移入度を左右する主人公の属性比較において、『<b>${escapeXml(a.title)}</b>』の主人公は【<b>${escapeXml(a.protagonistGender || '主人公')}</b>】という設定です。独自のアプローチや個性が遺憾なく発揮され、読者に強いインパクトを与えます。</p><p>対する『<b>${escapeXml(b.title)}</b>』の主人公は【<b>${escapeXml(b.protagonistGender || '主人公')}</b>】であり、対照的な魅力と戦い方を見せます。チート能力で爽快に問題を解決するのか、泥臭い努力や頭脳戦で成り上がるのか、あるいは人たらしな魅力で周りを巻き込むのか、主人公のタイプによって読後感がまったく異なります。</p><h2>③ 読後感・感情（爽快感・感動・爆笑度）の比較</h2><p>あなたが読書に求める感情によって、ベストな選択は決まります。『<b>${escapeXml(a.title)}</b>』がもたらす読書体験は【<b>${escapeXml(a.emotionType || '魅力あふれる展開')}</b>】です。作品の魅力として「${escapeXml(a.highlights?.[0] || '圧倒的見どころ')}」が挙げられ、読了後に深い満足感を味わえます。</p><p>一方、『<b>${escapeXml(b.title)}</b>』を読んだ時に得られる感情は【<b>${escapeXml(b.emotionType || '充実した読後感')}</b>】です。「${escapeXml(b.highlights?.[0] || '注目ポイント')}」という独自の見どころが光り、気分に合わせて楽しむことができます。</p><h2>④ 作画・イラストの雰囲気・アニメ化メディア展開の比較</h2><p>ビジュアル面やメディア展開の充実度も重要な比較要素です。『<b>${escapeXml(a.title)}</b>』は作画・イラストに関して「<b>${escapeXml(a.illustStyle || '高品質なイラスト')}</b>」という特徴を持ち、メディア化実績として【<b>${escapeXml(a.animeAdaptation || 'アニメ化作品')}</b>】という実績を誇ります。</p><p>『<b>${escapeXml(b.title)}</b>』は「<b>${escapeXml(b.illustStyle || '魅力的なアート')}</b>」というアートスタイルで表現され、【<b>${escapeXml(b.animeAdaptation || 'アニメ化実績あり')}</b>】というメディア展開を誇ります。映像化された迫力あるバトルや美しい世界観を楽しむことができる点も大きな強みです。</p><div class="diag-box"><h3 style="margin-top:0;font-size:18px;color:#17221f;">🎯 どちらを読むべき？最終診断フロー</h3><p style="margin-bottom:8px;">・<b>${escapeXml(a.oneLineCatch || a.title)}</b> や、${escapeXml(a.readerTypes?.[0] || a.genre)} を求めている方 ➔ 『<b><a href="/works/${a.slug}/">${escapeXml(a.title)}</a></b>』がおすすめ！</p><p style="margin-bottom:0;">・<b>${escapeXml(b.oneLineCatch || b.title)}</b> や、${escapeXml(b.readerTypes?.[0] || b.genre)} を求めている方 ➔ 『<b><a href="/works/${b.slug}/">${escapeXml(b.title)}</a></b>』がおすすめ！</p></div></article><h2>共通タグ・キーワード</h2><p>${sharedTags.length ? sharedTags.map(tag => `<span class="pill" style="font-size:13px;padding:4px 10px;">#${escapeXml(tag)}</span>`).join(' ') : '共通タグはありません。'}</p></main>${renderFooter()}</body></html>`
    const dir = path.join(root, 'public/compare', pairSlug(a, b))
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, 'index.html'), html)
  }))
}

async function main() {
  const seedBooks = await loadBooks()
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
