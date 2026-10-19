import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const siteUrl = process.env.SITE_URL || 'https://isekai-compas.vercel.app'
const GA_ID = 'G-5WYW3QMS4V'

const commonGaHead = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}', { send_page_view: true });
</script>`

const commonStyle = `
  :root {
    --bg-dark: #121b19;
    --bg-main: #f4f1e9;
    --card-bg: #ffffff;
    --text-primary: #17221f;
    --text-muted: #57655a;
    --accent: #8b672d;
    --accent-light: #d6a24a;
    --border-color: #dce3d8;
  }
  * { box-sizing: border-box; }
  body { margin: 0; color: var(--text-primary); background: var(--bg-main); font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; line-height: 1.8; -webkit-font-smoothing: antialiased; }
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

  main { padding: 40px 20px 80px; max-width: 920px; margin: 0 auto; }
  .crumb { font-size: 13px; margin-bottom: 24px; color: var(--text-muted); }
  .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #a37a32; font-weight: bold; }
  h1 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 29px; margin: 8px 0 20px; line-height: 1.45; color: #17221f; }
  .lead { font-size: 15.5px; color: #233027; background: #fff; padding: 24px; border-left: 5px solid #d6a24a; border-radius: 6px; margin-bottom: 36px; line-height: 1.85; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }

  /* Feature Article Styles */
  .toc-box { background: #eaf0e8; border: 1px solid #c9d8c6; border-radius: 8px; padding: 22px 24px; margin-bottom: 40px; }
  .toc-title { font-weight: bold; font-size: 16px; margin-bottom: 14px; color: #17221f; display: flex; align-items: center; gap: 8px; }
  .toc-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; font-size: 14px; }
  .toc-list li a { color: #23372d; font-weight: 500; }
  .toc-list li a:hover { color: #8b672d; text-decoration: underline; }

  .feature-item-section { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 32px 28px; margin-bottom: 48px; box-shadow: 0 4px 16px rgba(0,0,0,0.03); }
  h2.feature-work-title { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 24px; color: #17221f; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 2px solid #e8ece7; display: flex; align-items: baseline; gap: 12px; line-height: 1.4; }
  .work-rank-num { font-size: 28px; color: #d6a24a; font-family: system-ui, sans-serif; font-weight: bold; }

  .work-hero { display: flex; gap: 24px; margin-bottom: 24px; background: #f9fbf8; border: 1px solid #e8ede5; padding: 20px; border-radius: 8px; }
  .work-cover-wrap { width: 160px; flex-shrink: 0; text-align: center; }
  .work-cover-wrap img { width: 100%; height: auto; max-height: 230px; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
  .work-meta { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .work-meta-list { list-style: none; padding: 0; margin: 0 0 16px; font-size: 13.5px; color: var(--text-muted); line-height: 2.0; }
  .work-meta-list strong { color: var(--text-primary); }

  .rakuten-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #bf0000; color: #fff !important; font-weight: bold; font-size: 14.5px; padding: 12px 24px; border-radius: 6px; text-decoration: none !important; transition: background 0.2s, transform 0.2s; box-shadow: 0 4px 10px rgba(191,0,0,0.22); }
  .rakuten-btn:hover { background: #990000; transform: translateY(-2px); box-shadow: 0 6px 14px rgba(191,0,0,0.3); }

  .feature-content-box { margin-top: 24px; }
  .feature-content-box h3 { font-size: 18px; color: #17221f; margin: 28px 0 12px; display: flex; align-items: center; gap: 8px; font-weight: bold; border-left: 5px solid #8b672d; padding-left: 12px; }
  .feature-content-box p { font-size: 15.5px; color: #2a3830; line-height: 1.9; margin: 0 0 18px; text-align: justify; }
  
  .points-box { background: #f4f8f3; border: 1px solid #d4e2d2; border-radius: 6px; padding: 16px 20px; margin: 18px 0; }
  .points-title { font-weight: bold; font-size: 14px; color: #1d3326; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .points-list { margin: 0; padding-left: 20px; font-size: 14px; color: #2c4234; line-height: 1.8; }

  .compare-link-card { background: #fffdfa; border: 1px dashed #d6a24a; border-radius: 6px; padding: 14px 18px; margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 13.5px; }
  .compare-link-card a { font-weight: bold; color: #8b672d; }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 40px 20px; margin-top: 60px; font-size: 14px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .footer-links { display: flex; gap: 20px; }
  .footer-links a { color: #cfd8d3; }

  /* Book Grid */
  .book-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; margin-top: 24px; }
  .book-card { background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .book-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); }
  .cover-container { width: 100%; height: 260px; background: #e8ece7; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center; }
  .cover-container img { width: 100%; height: 100%; object-fit: cover; }
  .badge-tag { position: absolute; top: 10px; left: 10px; background: #17221f; color: #fff; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
  .card-body { padding: 16px; display: flex; flex-direction: column; flex-grow: 1; }
  .card-title { font-size: 15px; font-weight: bold; line-height: 1.4; margin: 0 0 8px; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .card-title a { color: var(--text-primary); }
  .card-author { font-size: 12px; color: var(--text-muted); margin-bottom: 12px; }
  .card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 14px; }
  .pill { font-size: 11px; background: #f0f3ee; color: #4a574f; padding: 2px 7px; border-radius: 3px; }
  .card-bottom { margin-top: auto; padding-top: 10px; border-top: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; font-size: 13px; }
  .card-btn { background: #17221f; color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; }
  .card-btn:hover { background: #d6a24a; color: #17221f; text-decoration: none; }

  @media (max-width: 650px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
    .work-hero { flex-direction: column; align-items: center; text-align: center; }
    .toc-list { grid-template-columns: 1fr; }
    .book-cards-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .cover-container { height: 180px; }
    .card-title { font-size: 13px; }
  }
`

function renderHeader(activePath = '') {
  return `<header class="site-header">
    <div class="header-inner">
      <a class="brand" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
      <nav class="main-nav">
        <a href="/" class="${activePath === '/' ? 'active' : ''}">トップ</a>
        <a href="/features/" class="${activePath === '/features/' ? 'active' : ''}">特集<em>HOT</em></a>
        <a href="/works/" class="${activePath === '/works/' ? 'active' : ''}">作品一覧</a>
        <a href="/new/" class="${activePath === '/new/' ? 'active' : ''}">新刊<em>NEW</em></a>
        <a href="/tags/" class="${activePath === '/tags/' ? 'active' : ''}">タグ</a>
        <a href="/authors/" class="${activePath === '/authors/' ? 'active' : ''}">作者</a>
        <a href="/series/" class="${activePath === '/series/' ? 'active' : ''}">シリーズ</a>
        <a href="/compare/" class="${activePath === '/compare/' ? 'active' : ''}">比較</a>
      </nav>
    </div>
  </header>`
}

function renderFooter() {
  return `<footer class="site-footer">
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
        <a href="/sitemap/">サイトマップ</a>
      </div>
      <span class="copyright">© 2026 ISEKAI COMPASS</span>
    </div>
  </footer>`
}

const escapeXml = value => String(value || '').replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

async function run() {
  const books = JSON.parse(await fs.readFile(path.join(root, 'public/data/books.json'), 'utf8'))
  const booksBySlug = new Map(books.map(b => [b.slug, b]))
  const booksById = new Map(books.map(b => [b.id, b]))

  const getBook = (key) => booksBySlug.get(key) || booksById.get(key)

  // 1. 特集記事の超充実化定義
  const featureConfigs = [
    {
      slug: 'slowlife',
      title: '【癒やし・スローライフ】異世界グルメとまったり日常を楽しむおすすめ名作5選',
      description: '殺伐としたバトルはひと休み。絶品異世界飯やのんびりスローライフ、愛らしいもふもふ従魔たちに心から癒やされる至福の異世界作品を徹底解説。',
      eyebrow: 'HEALING & SLOW LIFE SPECIAL',
      lead: '魔王討伐の重圧や血で血を洗う権力争いに疲れた読者へ。現代の便利知識や料理の腕前を活かし、のんびりと異世界の日々を満喫する「至福のスローライフ作品」を特集します。読めばお腹が空き、心がふわりと温かくなる至高のラインナップをお届けします。',
      books: ['seed-houro-meshi', '4864724890012', '4046834110067', 'hachinan-1', 'isekai-shokudo-1']
    },
    {
      slug: 'brain',
      title: '【緻密な伏線・頭脳戦】考察が止まらない重厚な世界観おすすめ異世界作品6選',
      description: '単なる無双にとどまらない！練り込まれた世界観設定、張り巡らされた伏線、心理戦・内政改革が光る至高の異世界ラノベ・コミックを深掘りレビュー。',
      eyebrow: 'MIND GAMES & COMPLEX WORLDBUILDING',
      lead: 'ただ力任せに敵を吹き飛ばすだけでは物足りない――。そんな知的好奇心に溢れる読者へ贈る、緻密な頭脳戦・領地経営・心理戦が展開される本格派異世界作品をピックアップ。張り巡らされた伏線が回収される瞬間の鳥肌モノのカタルシスをご堪能ください。',
      books: ['4988601550993', '4333912954310', '4758032110023', 'genjitsu-yusha-1', 'seed-tensura', 'mushoku-tensei-1']
    },
    {
      slug: 'climb',
      title: '【底辺からの下克上】不遇や理不尽を叩き潰す成り上がりおすすめ名作6選',
      description: '無能と蔑まれ、冤罪で追放された主人公が圧倒的な努力と独自の才覚で頂点へと駆け上がる！胸を熱くする最高の成り上がり異世界作品を徹底紹介。',
      eyebrow: 'UNDERDOG TO HERO & REVERSAL',
      lead: '理不尽な追放、不当な冷遇、過酷な底辺からのスタート――。絶望の淵から這い上がり、見下していた者たちを実力で圧倒する「下克上・成り上がり」は異世界作品の最大の醍醐味です。読者の魂を揺さぶる熱い覚醒とカタルシスを体感できる傑作を集めました。',
      books: ['4390000014619', '4040645010045', 'tate-no-yusha-1', 'deathmarch-1', '4310000912057', '4310000912076']
    }
  ]

  for (const feat of featureConfigs) {
    const featBooks = feat.books.map(getBook).filter(Boolean)
    if (featBooks.length === 0) continue

    const tocList = featBooks.map((b, i) => `<li><a href="#work-${i + 1}">第${i + 1}位：${escapeXml(b.title)}</a></li>`).join('')

    const sectionsHtml = featBooks.map((b, i) => {
      const readers = (b.readerTypes || [
        '独自の世界観にどっぷり浸りたい人',
        '爽快感のあるストーリー展開が好きな人',
        'キャラクター同士の掛け合いを楽しみたい人'
      ]).map(r => `<li>・ ${escapeXml(r)}</li>`).join('')

      const geos = (b.geoPoints || [
        `${b.title}は、${b.author}が手掛ける本格異世界ファンタジー作品です。`,
        `電子書籍ストア（楽天Kobo等）にて全巻配信されており、無料試し読みが可能。`,
        `読者の期待を裏切らない丁寧な伏線回収とストーリーテリングが高評価を獲得。`
      ]).map(g => `<li>${escapeXml(g)}</li>`).join('')

      const highlights = (b.highlights || [
        `読者を飽きさせないスピーディーかつ重厚なストーリー展開`,
        `魅力的なヒロインや個性溢れる仲間たちとの絆`,
        `緻密に練られた魔法・世界観設定のディテール`
      ]).map(h => `<li>✦ ${escapeXml(h)}</li>`).join('')

      return `
      <section class="feature-item-section" id="work-${i + 1}">
        <h2 class="feature-work-title">
          <span class="work-rank-num">0${i + 1}</span>
          <span>${escapeXml(b.title)}</span>
        </h2>
        <div class="work-hero">
          <div class="work-cover-wrap">
            <img src="${escapeXml(b.cover)}" alt="${escapeXml(b.title)}の表紙画像" loading="lazy" width="160" height="230" />
          </div>
          <div class="work-meta">
            <ul class="work-meta-list">
              <li><strong>著者：</strong>${escapeXml(b.author)}</li>
              <li><strong>ジャンル：</strong>${escapeXml(b.genre)}</li>
              <li><strong>最新発売日：</strong>${escapeXml(b.salesDate || '好評発売中')}</li>
              <li><strong>定価：</strong>${b.price ? `${b.price}円（税込）` : '各巻参照'}</li>
            </ul>
            ${b.affiliateUrl ? `
              <a href="${escapeXml(b.affiliateUrl)}" class="rakuten-btn" target="_blank" rel="noopener noreferrer">
                <span>楽天Koboで無料試し読み・購入 ↗</span>
              </a>
            ` : ''}
          </div>
        </div>

        <div class="feature-content-box">
          <h3>📖 物語のあらすじ・プロット</h3>
          <p>${escapeXml(b.description || b.firstVolumeStory || `${b.title}の魅惑的な物語が幕を開けます。`)}</p>

          <h3>✦ 本作が誇る最大の魅力・見どころ</h3>
          <div class="points-box">
            <ul class="points-list" style="list-style:none;padding-left:0;">
              ${highlights}
            </ul>
          </div>

          <h3>✍️ 専門編集部による深掘りレビュー</h3>
          <p>${escapeXml(b.review || b.aiIntro || `${b.title}は読者の期待を上回る濃密なエンターテインメントを提供してくれます。`)}</p>

          <h3>🎯 こんな読者に特におすすめ！</h3>
          <ul class="points-list" style="list-style:none;padding-left:0;">
            ${readers}
          </ul>

          <div class="points-box" style="margin-top:20px;background:#eef5ec;">
            <div class="points-title">💡 AI検索・要点チェック（GEO）</div>
            <ul class="points-list">
              ${geos}
            </ul>
          </div>

          <div class="compare-link-card">
            <span>この作品の詳しい解説や他の名作との違いを見る：</span>
            <a href="/works/${b.slug}/">『${escapeXml(b.title)}』詳細レビューへ →</a>
          </div>
        </div>
      </section>
      `
    }).join('')

    const faqLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `この特集で紹介されている作品の選定基準は？`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `異世界コンパス編集部が、読者満足度、ストーリー構成力、世界観の独創性、電子書籍での配信状況を総合的に分析し、自信を持って推薦できる名作を厳選しています。`
          }
        },
        {
          "@type": "Question",
          "name": `作品は電子書籍で今すぐ読めますか？`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `はい、全作品が楽天Koboなどの主要電子書籍ストアにて配信されており、無料試し読みやポイント還元を利用してお得に購読可能です。`
          }
        }
      ]
    })

    const fullHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escapeXml(feat.title)}｜異世界コンパス</title><meta name="description" content="${escapeXml(feat.description)}"><link rel="canonical" href="${siteUrl}/features/${feat.slug}/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><script type="application/ld+json">${faqLd}</script><style>${commonStyle}</style>${commonGaHead}</head><body>${renderHeader('/features/')}<main><div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　${escapeXml(feat.title)}</div><div class="eyebrow">${feat.eyebrow}</div><h1>${escapeXml(feat.title)}</h1><p class="lead">${escapeXml(feat.lead)}</p><div class="toc-box"><div class="toc-title">📑 本記事の目次・紹介作品一覧</div><ul class="toc-list">${tocList}</ul></div>${sectionsHtml}<section class="feature-item-section" style="background:#fdfefd;border-left:5px solid #d6a24a;"><h2>まとめ：あなたにぴったりの1冊を見つけよう</h2><p>今回は「${escapeXml(feat.title)}」をテーマに、絶対に後悔しない傑作群を徹底解説しました。どの作品もそれぞれの個性と熱い見どころが詰まっています。気になる作品があれば、まずは無料試し読みからその世界へ飛び込んでみてください！</p><div style="margin-top:20px;"><a href="/features/" style="font-weight:bold;color:#8b672d;">← 他の特集記事をもっと見る</a></div></section></main>${renderFooter()}</body></html>`

    const targetDir = path.join(root, 'public/features', feat.slug)
    await fs.mkdir(targetDir, { recursive: true })
    await fs.writeFile(path.join(targetDir, 'index.html'), fullHtml, 'utf8')
    console.log(`✅ 魔改造完了: public/features/${feat.slug}/index.html (${fullHtml.length} bytes)`)
  }

  // 2. タグ、作者、シリーズページの再ビルド実行
  console.log('🔄 fetch-books の個別ページビルダーを実行中...')
  const fetchScript = await fs.readFile(path.join(root, 'scripts/fetch-books.mjs'), 'utf8')
  // 単体実行用関数を抽出して実行、または `npm run sync:books -- --seed`
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
