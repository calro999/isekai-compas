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
  gtag('config', '${GA_ID}', {
    send_page_view: true
  });
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

  /* Ranking Section */
  .ranking-section { background: #17221f; color: #fff; padding: 40px 32px; border-radius: 12px; margin-top: 60px; box-shadow: 0 8px 24px rgba(0,0,0,0.18); }
  h2.ranking-main-title { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 28px; color: #d6a24a; margin: 0 0 14px; text-align: center; border: none; padding: 0; }
  .ranking-intro { font-size: 15px; color: #d2ddd6; text-align: center; max-width: 700px; margin: 0 auto 36px; line-height: 1.85; }
  
  .ranking-item-card { background: #23312c; border: 1px solid #374b41; border-radius: 8px; padding: 26px; margin-bottom: 24px; }
  .ranking-item-card.gold { border-left: 6px solid #f5b041; }
  .ranking-item-card.silver { border-left: 6px solid #bdc3c7; }
  .ranking-item-card.bronze { border-left: 6px solid #e59866; }
  .ranking-item-card h3 { font-size: 20px; color: #fff; margin: 0 0 14px; display: flex; align-items: center; gap: 12px; }
  .ranking-badge { display: inline-block; font-size: 12.5px; padding: 3px 12px; border-radius: 4px; font-weight: bold; color: #17221f; }
  .ranking-badge.gold { background: #f5b041; }
  .ranking-badge.silver { background: #bdc3c7; }
  .ranking-badge.bronze { background: #e59866; }
  .ranking-item-card p { font-size: 15px; color: #e2ece6; line-height: 1.85; margin: 0; }

  /* FAQ Section (GEO / AI-SEO) */
  .faq-section { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 32px 28px; margin-top: 48px; }
  .faq-section h2 { font-size: 22px; margin: 0 0 20px; border-left: 5px solid #d6a24a; padding-left: 12px; color: #17221f; font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; }
  .faq-item { margin-bottom: 20px; border-bottom: 1px solid #edf1eb; padding-bottom: 16px; }
  .faq-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .faq-q { font-weight: bold; font-size: 16px; color: #17221f; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .faq-a { font-size: 14.5px; color: #37463e; line-height: 1.8; margin: 0; }

  /* Feature Hub Cards */
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 26px; margin-top: 28px; }
  .feature-hub-card { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 26px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
  .feature-hub-card:hover { transform: translateY(-4px); box-shadow: 0 8px 22px rgba(0,0,0,0.08); border-color: #d6a24a; }
  .feature-hub-badge { align-self: flex-start; background: #17221f; color: #d6a24a; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; }
  .feature-hub-title { font-size: 18.5px; font-weight: bold; margin: 0 0 12px; line-height: 1.5; }
  .feature-hub-title a { color: #17221f; }
  .feature-hub-desc { font-size: 14px; color: var(--text-muted); line-height: 1.75; flex-grow: 1; margin-bottom: 20px; }
  .feature-hub-btn { background: #17221f; color: #fff !important; padding: 11px 18px; border-radius: 6px; font-size: 13.5px; font-weight: bold; text-align: center; text-decoration: none !important; }
  .feature-hub-btn:hover { background: #d6a24a; color: #17221f !important; }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 44px 20px; margin-top: 60px; font-size: 14px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 680px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
    .toc-list { grid-template-columns: 1fr; }
    .work-hero { flex-direction: column; align-items: center; text-align: center; }
    .work-meta { align-items: center; }
    .feature-item-section { padding: 22px 18px; }
    h1 { font-size: 23px; }
    h2.feature-work-title { font-size: 19px; }
    .ranking-section { padding: 26px 18px; }
  }
`

function renderHeader(activePath = '') {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
        <nav class="main-nav">
          <a href="/" class="${activePath === '/' ? 'active' : ''}">トップ</a>
          <a href="/features/" class="${activePath.startsWith('/features') ? 'active' : ''}">特集<em>HOT</em></a>
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
          <a href="/sitemap/">サイトマップ</a>
        </div>
        <span class="copyright">© ISEKAI COMPASS</span>
      </div>
    </footer>
  `
}

const escapeXml = value => String(value || '').replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

async function buildAllFeatures() {
  const featuresPath = path.join(root, 'public/data/curated-features.json')
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'))
  console.log(`Building HTML for all ${features.length} features...`)

  // 1. 特集一覧ページ (/features/index.html) の生成
  const hubHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>おすすめ特集一覧 - 異世界ラノベ＆漫画テーマ別厳選 | 異世界コンパス</title>
<meta name="description" content="スローライフ、主人公最強、人外転生、領地経営、悪役令嬢、現代ダンジョン配信、異世界医療など、読みたいテーマ別に厳選した異世界ラノベ・Web小説・コミカライズ特集まとめ。">
<link rel="canonical" href="${siteUrl}/features/">
${commonGaHead}
<style>${commonStyle}</style>
</head>
<body>
${renderHeader('/features/')}
<main class="wrap">
  <div class="crumb"><a href="/">トップ</a>　/　おすすめ特集一覧</div>
  <span class="eyebrow">CURATED FEATURES</span>
  <h1>おすすめ特集一覧（テーマ別厳選10選）</h1>
  <div class="lead">
    「今どんな異世界ラノベ・漫画を読みたいか？」という気分やシチュエーションに合わせて、読者目線で徹底的に厳選したテーマ別特集記事一覧です。各作品の見どころ、あらすじ、独自ランキング、FAQを詳しく解説しています。
  </div>

  <div class="features-grid">
    ${features.map(f => `
      <article class="feature-hub-card">
        <span class="feature-hub-badge">${escapeXml(f.eyecatchBadge || 'おすすめ10選')}</span>
        <h2 class="feature-hub-title"><a href="/features/${f.slug}/">${escapeXml(f.title)}</a></h2>
        <p class="feature-hub-desc">${escapeXml(f.description)}</p>
        <a href="/features/${f.slug}/" class="feature-hub-btn">特集記事を見る ➔</a>
      </article>
    `).join('\n')}
  </div>
</main>
${renderFooter()}
</body>
</html>`

  const featuresDir = path.join(root, 'public/features')
  await fs.mkdir(featuresDir, { recursive: true })
  await fs.writeFile(path.join(featuresDir, 'index.html'), hubHtml)

  // 2. 各特集記事ページの生成
  for (const f of features) {
    const dir = path.join(featuresDir, f.slug)
    await fs.mkdir(dir, { recursive: true })

    const items = f.resolvedItems || f.items || []

    const itemsHtml = items.map((item, idx) => {
      const rankNum = idx + 1
      const points = item.points || []
      const pointsHtml = points.length > 0 ? `
        <div class="points-box">
          <div class="points-title">✦ 本作の注目ポイント＆見どころ</div>
          <ul class="points-list">
            ${points.map(p => `<li>${escapeXml(p)}</li>`).join('\n')}
          </ul>
        </div>
      ` : ''

      const coverHtml = item.cover ? `
        <div class="work-cover-wrap">
          <img src="${escapeXml(item.cover)}" alt="${escapeXml(item.customTitle || item.keyword)}" loading="lazy">
        </div>
      ` : ''

      return `
      <section class="feature-item-section" id="work-${rankNum}">
        <h2 class="feature-work-title">
          <span class="work-rank-num">#${rankNum}</span>
          <span>${escapeXml(item.customTitle || item.keyword)}</span>
        </h2>

        <div class="work-hero">
          ${coverHtml}
          <div class="work-meta">
            <ul class="work-meta-list">
              <li><strong>楽天収録タイトル：</strong> ${escapeXml(item.rakutenTitle || item.customTitle || item.keyword)}</li>
              <li><strong>著者 / イラスト：</strong> ${escapeXml(item.author || '詳細参照')}</li>
              ${item.price ? `<li><strong>参考価格：</strong> ¥${Number(item.price).toLocaleString()}</li>` : ''}
              ${item.salesDate ? `<li><strong>発売日：</strong> ${escapeXml(item.salesDate)}</li>` : ''}
            </ul>
            <div>
              <a href="${escapeXml(item.affiliateUrl || item.itemUrl || '#')}" target="_blank" rel="nofollow sponsored noopener" class="rakuten-btn">
                <span>楽天Koboで試し読み・購入する</span> ➔
              </a>
            </div>
          </div>
        </div>

        <div class="feature-content-box">
          <h3>📖 あらすじ・ストーリーの背景</h3>
          <p>${escapeXml(item.synopsis || '')}</p>

          <h3>💡 管理人のおすすめポイント・ここが熱い！</h3>
          <p>${escapeXml(item.recommendReason || '')}</p>

          ${pointsHtml}
        </div>
      </section>
      `
    }).join('\n')

    const ranking = f.ranking || []
    const rankingCardsHtml = ranking.map(r => {
      const badgeClass = r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : 'bronze'
      const badgeText = r.rank === 1 ? '第1位 ★ 最推し' : r.rank === 2 ? '第2位' : '第3位'
      return `
        <div class="ranking-item-card ${badgeClass}">
          <h3><span class="ranking-badge ${badgeClass}">${badgeText}</span> ${escapeXml(r.title)}</h3>
          <p>${escapeXml(r.reason)}</p>
        </div>
      `
    }).join('\n')

    const faq = f.faq || []
    const faqSectionHtml = faq.length > 0 ? `
      <section class="faq-section" id="faq">
        <h2>よくある質問（FAQ）</h2>
        ${faq.map(q => `
          <div class="faq-item">
            <div class="faq-q"><span>Q.</span> <strong>${escapeXml(q.q)}</strong></div>
            <div class="faq-a">${escapeXml(q.a)}</div>
          </div>
        `).join('\n')}
      </section>
    ` : ''

    // JSON-LD (Schema.org Article & FAQPage & ItemList)
    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "headline": f.title,
          "description": f.description,
          "url": `${siteUrl}/features/${f.slug}/`,
          "inLanguage": "ja",
          "publisher": {
            "@type": "Organization",
            "name": "異世界コンパス",
            "url": siteUrl
          }
        },
        {
          "@type": "ItemList",
          "itemListElement": items.map((item, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": item.customTitle || item.keyword,
            "url": item.affiliateUrl || item.itemUrl || `${siteUrl}/features/${f.slug}/#work-${idx + 1}`
          }))
        }
      ]
    }

    if (faq.length > 0) {
      jsonLd["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": faq.map(q => ({
          "@type": "Question",
          "name": q.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": q.a
          }
        }))
      })
    }

    const pageHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeXml(f.metaTitle || f.title)} | 異世界コンパス</title>
<meta name="description" content="${escapeXml(f.description)}">
<link rel="canonical" href="${siteUrl}/features/${f.slug}/">
${commonGaHead}
<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>
<style>${commonStyle}</style>
</head>
<body>
${renderHeader(`/features/${f.slug}/`)}
<main class="wrap">
  <div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　${escapeXml(f.title)}</div>
  <span class="eyebrow">${escapeXml(f.eyecatchBadge || '特集')}</span>
  <h1>${escapeXml(f.title)}</h1>
  
  <div class="lead">
    ${escapeXml(f.description)}
  </div>

  <nav class="toc-box">
    <div class="toc-title"><span>📑 目次（掲載作品一覧）</span></div>
    <ul class="toc-list">
      ${items.map((item, idx) => `<li><a href="#work-${idx + 1}">${idx + 1}. ${escapeXml(item.customTitle || item.keyword)}</a></li>`).join('\n')}
      ${ranking.length > 0 ? `<li><a href="#ranking">★ 管理人の私的ランキングTOP3</a></li>` : ''}
      ${faq.length > 0 ? `<li><a href="#faq">❓ よくある質問（FAQ）</a></li>` : ''}
    </ul>
  </nav>

  <div class="feature-articles-body">
    ${itemsHtml}
  </div>

  ${ranking.length > 0 ? `
  <section class="ranking-section" id="ranking">
    <h2 class="ranking-main-title">管理人の私的ランキング</h2>
    <p class="ranking-intro">今回ご紹介した珠玉の10作品の中から、管理人が特に「まずはここから読んでほしい！」と熱烈におすすめしたいTOP3を私的ランキングとして選定しました。</p>
    
    <div class="ranking-cards">
      ${rankingCardsHtml}
    </div>
  </section>
  ` : ''}

  <div style="background:#fcf9f2; border:1px solid #ebd9b5; border-left:5px solid #bf0000; border-radius:8px; padding:22px; margin:40px 0; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
    <div style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:16px; color:#17221f; margin-bottom:8px;">
      <span style="background:#bf0000; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">電子書籍が初めての方へ</span>
      <span>気になる作品を今すぐスマホやPCで読むには？</span>
    </div>
    <p style="font-size:14px; color:#4a574e; line-height:1.8; margin:0 0 14px;">
      「専用端末は必要？」「無料試し読みは会員登録なしでできる？」「楽天ポイントでお得に買う方法は？」など、電子書籍を安心して始めるための購入手順やメリットを徹底解説しています。
    </p>
    <a href="/features/rakuten-kobo-beginner-guide/" style="display:inline-flex; align-items:center; gap:6px; background:#17221f; color:#fff; padding:10px 20px; border-radius:5px; font-size:13.5px; font-weight:bold; text-decoration:none;">
      <span>楽天Kobo初心者向け購入・試し読みガイドを見る ➔</span>
    </a>
  </div>

  ${faqSectionHtml}

  <div style="margin-top:40px; text-align:center;">
    <a href="/features/" style="display:inline-block;padding:12px 24px;font-size:15px;background:#17221f;color:#fff;border-radius:6px;font-weight:bold;">← おすすめ特集一覧へ戻る</a>
  </div>
</main>
${renderFooter()}
</body>
</html>`

    await fs.writeFile(path.join(dir, 'index.html'), pageHtml)
  }

  console.log(`Successfully built all HTML feature pages!`)
}

await buildAllFeatures()
