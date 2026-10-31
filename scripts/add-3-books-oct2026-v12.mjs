import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteUrl = 'https://isekai-compas.vercel.app';
const GA_ID = 'G-5WYW3QMS4V';

const escapeXml = (value) =>
  String(value || '').replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;'
  }[c]));

const commonGaHead = `<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA_ID}', {
    send_page_view: true
  });
</script>`;

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
  h1 { font-family: serif; font-size: 30px; margin: 8px 0 16px; line-height: 1.4; }
  .lead { font-size: 15px; color: var(--text-muted); max-width: 720px; margin-bottom: 36px; line-height: 1.8; }

  .cover-main { width: 200px; height: 280px; object-fit: cover; float: right; margin: 0 0 24px 36px; border-radius: 6px; box-shadow: 0 6px 16px rgba(0,0,0,0.12); }
  h2 { font-family: serif; margin-top: 46px; border-left: 4px solid #d6a24a; padding-left: 12px; font-size: 22px; }
  .cta { display: inline-block; background: #17221f; color: #fff; padding: 14px 26px; border-radius: 6px; font-weight: bold; margin-top: 16px; text-decoration: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .cta:hover { background: #d6a24a; color: #17221f; text-decoration: none; }
  .pub-status-box { background: #17221f; color: #fff; padding: 24px; border-radius: 8px; margin: 24px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
  .pub-status-main h3 { margin: 0; font-size: 18px; color: #d6a24a; }
  .pub-status-main p { margin: 6px 0 0; font-size: 14px; color: #cfd8d3; }
  
  .ai-summary { background: #f9fbf9; border: 1px solid #e1e6de; padding: 16px; border-radius: 6px; margin: 16px 0; font-size: 13px; color: #3d4841; line-height: 1.6; }
  .first-story-box { background: #f0f4f1; padding: 24px; border-radius: 8px; border: 1px solid #c8d4c5; margin: 24px 0; line-height: 1.9; color: #233028; }
  .highlights-box { background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #d9ddd3; margin: 24px 0; }
  .review-box { background: #f9f8f3; padding: 24px; border-radius: 8px; border-left: 4px solid #17221f; margin: 24px 0; line-height: 1.9; color: #2c3831; }
  .tags a { display: inline-block; background: #e2e8de; padding: 6px 12px; margin: 4px 4px 4px 0; border-radius: 4px; font-size: 13px; text-decoration: none; }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 40px 20px; margin-top: 60px; font-size: 14px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .footer-links { display: flex; gap: 20px; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 650px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .cover-main { width: 130px; height: 180px; margin-left: 16px; }
    .work-detail-main { display: flex; flex-direction: column; }
  }
`;

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
        </nav>
      </div>
    </header>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="footer-inner">
        <div>
          <p><strong>異世界コンパス</strong> - なろう・異世界・ライトノベル総合比較検索ガイド</p>
          <small>© 2026 ISEKAI COMPASS. All rights reserved.</small>
        </div>
        <div class="footer-links">
          <a href="/">トップ</a>
          <a href="/features/">特集</a>
          <a href="/works/">作品一覧</a>
          <a href="/new/">新刊</a>
          <a href="/sitemap/">サイトマップ</a>
        </div>
      </div>
    </footer>
  `;
}

async function main() {
  console.log('--- STARTING ADD 3 BOOKS & FEATURE GENERATION (v12) ---');

  // 1. JSONデータの読み込み
  const enrichedArticles = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v12.json'), 'utf8'));
  console.log(`Loaded ${enrichedArticles.length} enriched articles.`);

  // 2. public/data/books.json の更新
  console.log('[Step 2] Updating public/data/books.json...');
  const booksPath = path.join(root, 'public/data/books.json');
  let books = JSON.parse(await fs.readFile(booksPath, 'utf8'));

  for (const book of enrichedArticles) {
    const existingIndex = books.findIndex(b => b.slug === book.slug);
    if (existingIndex >= 0) {
      console.log(`  Updating existing book: ${book.title}`);
      books[existingIndex] = { ...books[existingIndex], ...book };
    } else {
      console.log(`  Appending new book: ${book.title}`);
      books.push(book);
    }
  }

  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), 'utf8');
  console.log(`  Saved public/data/books.json! Total books: ${books.length}`);

  // 3. 各個別作品ページ (/works/{slug}/index.html) の生成
  console.log('[Step 3] Rendering individual work pages (/works/{slug}/index.html)...');
  for (const book of enrichedArticles) {
    const workDir = path.join(root, 'public/works', book.slug);
    await fs.mkdir(workDir, { recursive: true });

    const breadcrumbLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: '作品一覧', item: `${siteUrl}/works/` },
        { '@type': 'ListItem', position: 3, name: book.title, item: `${siteUrl}/works/${book.slug}/` }
      ]
    });

    const bookLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: book.author },
      datePublished: book.salesDate,
      image: book.cover,
      offers: {
        '@type': 'Offer',
        price: book.price,
        priceCurrency: 'JPY',
        availability: 'https://schema.org/InStock',
        url: book.affiliateUrl
      },
      description: book.description
    });

    const workHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(book.title)}の見どころ・あらすじ解説｜異世界コンパス</title><meta name="description" content="${escapeXml(book.description.slice(0, 140))}..."><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(book.title)}の見どころ・あらすじ解説"><meta property="og:description" content="${escapeXml(book.description.slice(0, 140))}..."><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${breadcrumbLd}</script><script type="application/ld+json">${bookLd}</script><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/works/')}</div><main class="work-detail-main"><article itemscope itemtype="https://schema.org/Book"><nav class="crumb" aria-label="Breadcrumb"><a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span></nav><div class="eyebrow">${escapeXml(book.badge)}</div><h1 itemprop="name">${escapeXml(book.title)}</h1><p class="lead">${escapeXml(book.oneLineCatch)}</p><img class="cover-main" itemprop="image" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}" loading="lazy"><section class="pub-status-box"><div class="pub-status-main"><h3>📖 発売日・書誌ステータス</h3><p>著者：<span itemprop="author">${escapeXml(book.author)}</span> ｜ 出版社：${escapeXml(book.publisherName)} ｜ 発売日：${escapeXml(book.salesDate)} ｜ 定価：${book.price}円</p></div><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで読む（試し読み） ↗</a></section><section><h2>📖 あらすじ・物語の背景</h2><p>${escapeXml(book.description)}</p></section><section class="first-story-box"><h2>🌟 本巻のストーリー・ハイライト</h2><p>${escapeXml(book.firstVolumeStory)}</p></section><section class="highlights-box"><h2>🔥 ここが熱い！注目ポイント3選</h2><ul>${book.highlights.map(h => `<li style="margin-bottom:10px;">${escapeXml(h)}</li>`).join('')}</ul></section><section class="review-box"><h2>✍️ 独自深掘りレビュー・作品評</h2><p>${escapeXml(book.review)}</p></section><section><h2>🎯 こんな読者・ファンにおすすめ！</h2><ul>${book.readerTypes.map(r => `<li style="margin-bottom:8px;">${escapeXml(r)}</li>`).join('')}</ul></section><section class="highlights-box"><h2>❓ よくある質問（FAQ）</h2>${book.specificFaqs.map(f => `<h3 style="font-size:15px; margin:16px 0 6px; color:#17221f;">Q. ${escapeXml(f.q)}</h3><p style="font-size:14px; margin:0 0 12px; color:#3d4841; line-height:1.7;">A. ${escapeXml(f.a)}</p>`).join('')}</section><section style="margin-top:36px;"><div class="tags">${book.tags.map(t => `<a href="/tags/">#${escapeXml(t)}</a>`).join('')}</div></section><div style="text-align:center; margin-top:40px;"><a class="cta" style="padding:16px 36px; font-size:16px;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで詳細を見る（無料試し読み） ↗</a></div></article></main>${renderFooter()}</body></html>`;

    await fs.writeFile(path.join(workDir, 'index.html'), workHtml);
    console.log(`  Rendered work HTML: /works/${book.slug}/index.html`);
  }

  // 4. 特集記事の作成 (/features/{slug}/index.html) および curated-features.json の更新
  console.log('[Step 4] Updating curated-features.json and generating feature article...');
  const featuresPath = path.join(root, 'public/data/curated-features.json');
  let features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const featureSlug = 'late-autumn-2026-dengeki-sneaker-top-picks';
  const newFeature = {
    slug: featureSlug,
    title: '【2026年秋〜11月電撃・スニーカー最前線】地下牢聖女の甘々救済から魔王討伐後の職探し、全知全能王の超勘違いまで！いま絶対読むべき注目ラノベ3選',
    metaTitle: '【2026年10月・11月最新刊】電撃文庫＆スニーカー文庫おすすめ注目ラノベ3選｜捕らえた聖女・最後の勇者の職探し・全知全能の王2徹底解説',
    eyecatchBadge: '2026年10月・11月最前線・電撃＆スニーカー激推し特集',
    description: '2026年10月下旬〜11月発売の話題作から、冤罪で心が折れた聖女と心優しき魔族元帥の地下牢ラブコメ『捕らえた聖女の目が死んでたので正体隠して面倒見る 1』、魔王討伐の日に無職となった最強少女の再就職奮闘記『最後の勇者の職探し！ 1』、そして秋先生が放つ全知全能主人公の痛快勘違い学園劇『全知全能の王、御言葉が勘違いされる 2』を徹底特集！',
    summary: '死んだ目の聖女が手料理で笑顔を取り戻す至高のヒーリング劇、戦後を生きる元英雄たちのリアルで心温まるお仕事探し、そして一言呟くだけで世界が非常事態に突入する圧倒的勘違い無双コメディまで、レーベルの枠を超えて今読むべき最前線の傑作3選を深掘り紹介。',
    faq: [
      {
        q: '2026年10月下旬〜11月発売のライトノベルでいま最も勢いのある注目作はどれですか？',
        a: '10月30日発売のスニーカー文庫新作『捕らえた聖女の目が死んでたので正体隠して面倒見る 1』、11月10日発売の電撃文庫新作『最後の勇者の職探し！ 1』、そして同じく11月10日発売の秋先生最新作『全知全能の王、御言葉が勘違いされる 2』が、それぞれ独自の切り口と極上のエンタメ性で大きな反響を呼んでいます。'
      },
      {
        q: '紹介されている3作品は電子書籍ですぐに読めますか？',
        a: 'はい、楽天Koboにて電子書籍版が配信および先行予約受付中です。無料試し読みや電子限定の特別版・特典も用意されています。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '捕らえた聖女の目が死んでたので正体隠して面倒見る 1',
        customTitle: '捕らえた聖女の目が死んでたので正体隠して面倒見る【電子特別版】',
        title: enrichedArticles[0].title,
        author: enrichedArticles[0].author,
        synopsis: '人間側の裏切りで身代わりに投獄され、完全に心を閉ざした聖女フィーネ。敵の魔族元帥ヴァルディは、そのあまりに痛々しい姿を見かねて温かい紅茶と手料理を差し入れてしまう。優しい看守と信じ込んで無邪気に懐く聖女と、「俺がお前を捕らえた敵将だ」と言い出せなくなった最強魔族の甘々地下牢ライフ！',
        recommendReason: '「拷問するはずが、思わず美味しいご飯を作っておもてなし」というお人好し魔族英雄のツンデレ気質と、美味しい食事でどんどん瞳に光が戻っていく聖女の姿がたまらなく愛おしい！癒やしと糖度が極限まで詰まった傑作です。',
        points: [
          '2026年10月30日発売！角川スニーカー文庫期待の甘々地下牢ファンタジー第1巻',
          '死んだ魚のようだった聖女の目が、温かい手料理と優しい言葉でみるみる輝きを取り戻す',
          '身分を隠したハラハラ感と、敵国貴族たちを一蹴する男気あふれる爽快バトル'
        ],
        itemUrl: enrichedArticles[0].affiliateUrl || enrichedArticles[0].itemUrl,
        cover: enrichedArticles[0].cover,
        salesDate: enrichedArticles[0].salesDate,
        price: enrichedArticles[0].price
      },
      {
        rank: 2,
        keyword: '最後の勇者の職探し！ 1',
        customTitle: '最後の勇者の職探し！',
        title: enrichedArticles[1].title,
        author: enrichedArticles[1].author,
        synopsis: '勇者育成学校を歴代最高得点で首席卒業した少女ヒナツ。いざ世界救済の旅路へ……と思いきや、卒業式の当日に「魔王討伐完了」の報せが届き、一瞬で無職に転落！戦後の平和な世界で勇者の破壊的スキルは持て余され、ハローワーク通いの日雇いバイト生活が始まる。笑えてホロリと泣ける新世代お仕事青春劇。',
        recommendReason: '「魔王が倒された後、勇者はどうやって生きていくのか？」という普遍的な問いに、軽快なユーモアと真摯な人間ドラマで答える意欲作！神話級の剣技を持ちながら履歴書一枚に頭を抱えるヒナツのポンコツ可愛い姿に誰もが共感必至です。',
        points: [
          '2026年11月10日発売！電撃文庫が贈るポスト魔王×ハローワーク青春ファンタジー',
          'オーバースペックな最強少女が、路地裏の害獣駆除や日雇いギグワークで奮闘するギャップ',
          '平和な社会で役目を終えた元戦士たちが、新たな居場所と生きがいを見出す胸熱ドラマ'
        ],
        itemUrl: enrichedArticles[1].affiliateUrl || enrichedArticles[1].itemUrl,
        cover: enrichedArticles[1].cover,
        salesDate: enrichedArticles[1].salesDate,
        price: enrichedArticles[1].price
      },
      {
        rank: 3,
        keyword: '全知全能の王、御言葉が勘違いされる 2',
        customTitle: '全知全能の王、御言葉が勘違いされる２　〜友達が欲しくて学院に入っただけなのに、世界中で非常事態が宣言されてしまった〜',
        title: enrichedArticles[2].title,
        author: enrichedArticles[2].author,
        synopsis: '世界の七割を滅ぼした先代の力を継承した少年クロノ。彼の切実な願いは「友達を100人作ること」。しかし彼の放つ些細な一言は、世界の命運を左右する絶対の神託として周囲の賢者や首脳陣に深読みされ、世界規模の厳戒態勢を招いてしまう！学園コメディの爆笑と全知全能の呪いに迫る第2弾！',
        recommendReason: '『魔王学院の不適合者』の秋先生ならではの圧倒的勘違い芸がさらにキレ味を増して炸裂！主人公の純真無垢な親切心と、勝手に裏を読みすぎて胃を痛める周囲のリアクションの落差が最高に痛快で、一気読み間違いなしの面白さです。',
        points: [
          '2026年11月10日発売！秋×りいちゅが贈る電撃文庫のメガヒット勘違い無双第2弾',
          '「天気がいいから散歩でも」の一言で、情報機関が世界再編の親征と誤認し非常事態に',
          '先代オウルが遺した真意と、クロノの失われた過去に迫る緻密なシリアス展開も必見'
        ],
        itemUrl: enrichedArticles[2].affiliateUrl || enrichedArticles[2].itemUrl,
        cover: enrichedArticles[2].cover,
        salesDate: enrichedArticles[2].salesDate,
        price: enrichedArticles[2].price
      }
    ]
  };

  const existingFeatIndex = features.findIndex(f => f.slug === featureSlug);
  if (existingFeatIndex >= 0) {
    features[existingFeatIndex] = newFeature;
  } else {
    features.unshift(newFeature);
  }

  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2), 'utf8');
  console.log(`  Updated curated-features.json! Total features: ${features.length}`);

  // 特集ページHTML (/features/{slug}/index.html) の生成
  const featDir = path.join(root, 'public/features', featureSlug);
  await fs.mkdir(featDir, { recursive: true });

  const featureItemsHtml = newFeature.items.map(item => `
    <article style="background:#fff; border:1px solid #e1e6de; border-radius:8px; padding:24px; margin-bottom:28px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px; margin-bottom:12px;">
        <span style="background:#8b672d; color:#fff; font-weight:bold; font-size:12px; padding:4px 8px; border-radius:4px;">おすすめ第 ${item.rank} 位</span>
        <span style="font-size:13px; color:#5f6c62;">発売日：${escapeXml(item.salesDate)} ｜ 定価：${item.price}円</span>
      </div>
      <h3 style="font-family:serif; font-size:22px; margin:0 0 16px; color:#17221f;">${escapeXml(item.customTitle)}</h3>
      <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
        <img src="${escapeXml(item.cover)}" alt="${escapeXml(item.title)}" style="width:140px; height:195px; object-fit:cover; border-radius:6px; box-shadow:0 3px 10px rgba(0,0,0,0.12);">
        <div style="flex:1; min-width:260px;">
          <p style="margin:0 0 6px; font-size:13px; color:#5f6c62;">著者：${escapeXml(item.author)}</p>
          <div style="background:#f4f7f4; padding:14px; border-radius:6px; font-size:14px; line-height:1.8; margin-bottom:14px; color:#233028;">
            <strong>【あらすじ】</strong><br>${escapeXml(item.synopsis)}
          </div>
          <div style="background:#fcf9f2; border-left:3px solid #d6a24a; padding:12px 14px; font-size:14px; line-height:1.8; color:#3a3224; margin-bottom:14px;">
            <strong>【ここが面白い！】</strong><br>${escapeXml(item.recommendReason)}
          </div>
          <ul style="margin:0 0 16px; padding-left:20px; font-size:13px; color:#3d4841; line-height:1.7;">
            ${item.points.map(p => `<li>${escapeXml(p)}</li>`).join('')}
          </ul>
          <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px;" href="${escapeXml(item.itemUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで詳細を見る（無料試し読み） ↗</a>
        </div>
      </div>
    </article>
  `).join('');

  const featFaqHtml = newFeature.faq.map(f => `
    <h3 style="font-size:15px; margin:16px 0 6px; color:#17221f;">Q. ${escapeXml(f.q)}</h3>
    <p style="font-size:14px; margin:0 0 12px; color:#3d4841; line-height:1.7;">A. ${escapeXml(f.a)}</p>
  `).join('');

  const featBreadcrumbLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'トップ', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: '特集一覧', item: `${siteUrl}/features/` },
      { '@type': 'ListItem', position: 3, name: newFeature.title, item: `${siteUrl}/features/${newFeature.slug}/` }
    ]
  });

  const featHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(newFeature.metaTitle)}</title><meta name="description" content="${escapeXml(newFeature.description)}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/features/${newFeature.slug}/"><meta property="og:title" content="${escapeXml(newFeature.metaTitle)}"><meta property="og:description" content="${escapeXml(newFeature.description)}"><script type="application/ld+json">${featBreadcrumbLd}</script><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/features/')}</div><main class="feature-detail-main"><article><nav class="crumb" aria-label="Breadcrumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　<span aria-current="page">${escapeXml(newFeature.title)}</span></nav><div class="eyebrow">${escapeXml(newFeature.eyecatchBadge)}</div><h1 itemprop="name">${escapeXml(newFeature.title)}</h1><p class="lead">${escapeXml(newFeature.description)}</p><section class="feature-items">${featureItemsHtml}</section><section class="highlights-box" style="margin-top:40px;"><h2>❓ この特集に関するよくある質問</h2>${featFaqHtml}</section></article></main>${renderFooter()}</body></html>`;

  await fs.writeFile(path.join(featDir, 'index.html'), featHtml);
  console.log(`  Rendered feature HTML: /features/${featureSlug}/index.html`);

  // 5. /features/index.html の更新
  console.log('[Step 5] Updating /features/index.html...');
  const featuresListHtml = features.slice(0, 40).map(f => `
    <article style="background:#fff; border:1px solid #e1e6de; border-radius:8px; padding:20px; margin-bottom:16px;">
      <span style="font-size:11px; font-weight:bold; color:#8b672d; letter-spacing:0.1em;">${escapeXml(f.eyecatchBadge || '特集')}</span>
      <h2 style="font-size:18px; margin:6px 0 10px; border:none; padding:0;"><a href="/features/${f.slug}/">${escapeXml(f.title)}</a></h2>
      <p style="font-size:13px; color:#5f6c62; margin:0 0 12px; line-height:1.6;">${escapeXml(f.description)}</p>
      <a href="/features/${f.slug}/" style="font-size:13px; font-weight:bold;">特集記事を読む →</a>
    </article>
  `).join('');

  const featuresIndexHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>おすすめ特集一覧｜異世界コンパス</title><meta name="description" content="異世界転生・ライトノベル・ファンタジー小説のテーマ別おすすめ特集一覧。最新刊・完結作・ジャンル別厳選まとめ。"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/features/"><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/features/')}</div><main><nav class="crumb"><a href="/">トップ</a>　/　<span>特集一覧</span></nav><div class="eyebrow">FEATURE ARTICLES</div><h1>異世界・ファンタジーおすすめ特集一覧</h1><p class="lead">テーマ別・最新トレンド別に厳選した異世界小説・ライトノベルの徹底ガイド特集です。</p><section>${featuresListHtml}</section></main>${renderFooter()}</body></html>`;
  await fs.writeFile(path.join(root, 'public/features/index.html'), featuresIndexHtml);
  console.log('  Updated /features/index.html');

  // 6. sitemap.xml の更新
  console.log('[Step 6] Updating public/sitemap.xml...');
  const sitemapPath = path.join(root, 'public/sitemap.xml');
  let sitemapContent = await fs.readFile(sitemapPath, 'utf8');

  for (const book of enrichedArticles) {
    const bookUrl = `${siteUrl}/works/${book.slug}/`;
    if (!sitemapContent.includes(bookUrl)) {
      const entry = `  <url>\n    <loc>${bookUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      sitemapContent = sitemapContent.replace('</urlset>', `${entry}</urlset>`);
    }
  }

  const featUrl = `${siteUrl}/features/${featureSlug}/`;
  if (!sitemapContent.includes(featUrl)) {
    const entry = `  <url>\n    <loc>${featUrl}</loc>\n    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    sitemapContent = sitemapContent.replace('</urlset>', `${entry}</urlset>`);
  }

  await fs.writeFile(sitemapPath, sitemapContent);
  console.log('  Updated public/sitemap.xml');

  // 7. llms.txt & llms-full.txt の更新
  console.log('[Step 7] Updating public/llms.txt and llms-full.txt...');
  const llmsPath = path.join(root, 'public/llms.txt');
  let llmsContent = await fs.readFile(llmsPath, 'utf8');

  for (const book of enrichedArticles) {
    const line = `- [${book.title}](${siteUrl}/works/${book.slug}/): ${book.aiIntro}`;
    if (!llmsContent.includes(book.slug)) {
      llmsContent += `\n${line}`;
    }
  }
  await fs.writeFile(llmsPath, llmsContent);

  const llmsFullPath = path.join(root, 'public/llms-full.txt');
  let llmsFullContent = await fs.readFile(llmsFullPath, 'utf8');
  for (const book of enrichedArticles) {
    if (!llmsFullContent.includes(book.slug)) {
      const block = `\n### ${book.title}\n- URL: ${siteUrl}/works/${book.slug}/\n- 著者: ${book.author}\n- 発売日: ${book.salesDate}\n- 概要: ${book.description}\n- 見どころ: ${(book.highlights || []).join(' / ')}\n`;
      llmsFullContent += block;
    }
  }
  await fs.writeFile(llmsFullPath, llmsFullContent);
  console.log('  Updated llms.txt and llms-full.txt');

  console.log('--- ALL UPDATES COMPLETED SUCCESSFULLY! ---');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
