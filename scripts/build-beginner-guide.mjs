import fs from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
dotenv.config()

const root = process.cwd()
const siteUrl = process.env.SITE_URL || 'https://isekai-compas.vercel.app'
const GA_ID = 'G-5WYW3QMS4V'

const queryDefinitions = [
  { kw: '無職転生 1 フジカワユカ', test: t => t.includes('無職転生') && t.includes('1') && !t.includes('分冊'), customTitle: '無職転生 〜異世界行ったら本気だす〜 第1巻', lead: '人生やり直し大河ファンタジーの金字塔！ 34歳無職引きこもりの男が異世界で本気を出して生き抜く冒険の始まり。' },
  { kw: '転生したらスライムだった件 1 川上泰樹', test: t => t.includes('転生したらスライムだった件') && (t.includes('1') || t.includes('（１）')) && !t.includes('32') && !t.includes('10th') && !t.includes('分冊'), customTitle: '転生したらスライムだった件 第1巻', lead: '最弱スライムから始まる魔国連邦建国記！ 「捕食者」と「大賢者」のスキルを手に異世界を拓く痛快サクセス。' },
  { kw: 'とんでもスキルで異世界放浪メシ 1 江口連', test: t => t.includes('とんでもスキルで異世界放浪メシ') && (t.includes('1') || t.includes('１') || t.includes('（１）')) && !t.includes('a la carte') && !t.includes('分冊'), customTitle: 'とんでもスキルで異世界放浪メシ 第1巻', lead: '「ネットスーパー」で現代の食材をお取り寄せ！ 伝説の魔獣フェルと美味いものを巡る絶品グルメスローライフ。' },
  { kw: '追放された転生重騎士はゲーム知識で無双する 1', test: t => t.includes('追放された転生重騎士はゲーム知識で無双する') && !t.includes('18') && !t.includes('２') && !t.includes('分冊'), customTitle: '追放された転生重騎士はゲーム知識で無双する 第1巻', lead: 'ハズレクラスと蔑まれた重騎士がゲーム知識で最強へ！ 効率的なビルドと圧倒的な耐久力で成り上がる痛快劇。' },
  { kw: '片田舎のおっさん、剣聖になる 1 乍藤和樹', test: t => t.includes('片田舎のおっさん、剣聖になる') && (t.includes('1') || t.includes('１')) && !t.includes('話売り') && !t.includes('無料お試し') && !t.includes('外伝') && !t.includes('分冊'), customTitle: '片田舎のおっさん、剣聖になる 第1巻', lead: '田舎の道場主が魅せる神速の剣技！ 大成した元弟子たちに引っ張り出され、無自覚に伝説を刻むおっさん剣客譚。' },
  { kw: '治癒魔法の間違った使い方 1 九我山レキ', test: t => t.includes('治癒魔法の間違った使い方') && (t.includes('1') || t.includes('１') || t.includes('（１）')) && !t.includes('Returns') && !t.includes('全12巻') && !t.includes('分冊'), customTitle: '治癒魔法の間違った使い方 第1巻', lead: '治癒魔法で肉体を即座に超回復！ 地獄の特訓で鍛え上げた怪力と俊足で戦場を駆ける型破りな肉弾バトル！' },
  { kw: '魔導具師ダリヤはうつむかない 1 甘岸久弥', test: t => t.includes('魔導具師ダリヤはうつむかない') && (t.includes('1') || t.includes('１') || t.includes('（１）')) && !t.includes('11') && !t.includes('10') && !t.includes('分冊'), customTitle: '魔導具師ダリヤはうつむかない 第1巻', lead: '婚約破棄から始まる自由な魔導具クラフト！ 現代知識と職人魂で暮らしを豊かにする大人のものづくりファンタジー。' },
  { kw: 'オーバーロード 1 不死者の王 丸山くがね', test: t => t.includes('オーバーロード') && t.includes('不死者の王') && !t.includes('分冊'), customTitle: 'オーバーロード 1 不死者の王', lead: '圧倒的な力で君臨するアンデッド魔王アインズ！ ナザリック地下大墳墓の軍勢を率いて異世界を征服するダーク金字塔。' },
  { kw: 'デスマーチからはじまる異世界狂想曲 1 愛七ひろ', test: t => t.includes('デスマーチからはじまる異世界狂想曲') && (t.includes('1') || t.includes('１') || t.includes('（１）')) && !t.includes('19') && !t.includes('18') && !t.includes('分冊'), customTitle: 'デスマーチからはじまる異世界狂想曲 第1巻', lead: '目覚めたらレベル310の最強ステータス！ 莫大な財産と圧倒的な力で美少女たちと各地を巡る観光スローライフ。' },
  { kw: '陰の実力者になりたくて！ 1 逢沢大介', test: t => t.includes('陰の実力者になりたくて！') && (t.includes('1') || t.includes('１') || t.includes('（１）')) && !t.includes('18') && !t.includes('マスターオブガーデン') && !t.includes('分冊'), customTitle: '陰の実力者になりたくて！ 第1巻', lead: '「陰の実力者」という厨二設定ごっこがなぜか全部現実に！？ 圧倒的な勘違いと神がかりな実力で悪を滅ぼす爆笑バトル！' }
]

async function fetchKobo(def) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    format: 'json',
    formatVersion: '2',
    keyword: def.kw,
    hits: '15'
  })
  const res = await fetch(`https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`)
  const data = await res.json()
  const items = data.Items || data.items || []
  const match = items.find(x => def.test(x.title)) || items[0]
  return {
    customTitle: def.customTitle,
    lead: def.lead,
    rakutenTitle: match.title,
    author: match.author,
    price: match.itemPrice,
    salesDate: match.salesDate,
    cover: match.largeImageUrl || match.mediumImageUrl,
    itemUrl: match.itemUrl,
    affiliateUrl: match.affiliateUrl
  }
}

export async function buildBeginnerGuidePage() {
  console.log('--- 楽天Kobo 電子書籍初心者ガイド（10選直接取得）生成開始 ---')
  const resolved10 = []
  for (const def of queryDefinitions) {
    console.log(`  -> 楽天Kobo API直接取得: ${def.customTitle}`)
    const data = await fetchKobo(def)
    resolved10.push(data)
    await new Promise(r => setTimeout(r, 1050))
  }

  const escapeXml = (v) => String(v || '').replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

  const booksCardsHtml = resolved10.map((b, idx) => `
    <section class="guide-book-card" id="book-${idx + 1}">
      <div class="guide-book-num">${idx + 1}</div>
      <div class="guide-book-hero">
        <div class="guide-book-cover">
          <img src="${escapeXml(b.cover)}" alt="${escapeXml(b.customTitle)} 表紙画像" loading="lazy" width="160" height="230" />
        </div>
        <div class="guide-book-meta">
          <h3 class="guide-book-title">${escapeXml(b.customTitle)}</h3>
          <p class="guide-book-lead">${escapeXml(b.lead)}</p>
          <ul class="guide-book-info-list">
            <li><strong>著者・作画：</strong> ${escapeXml(b.author || '人気作家')}</li>
            <li><strong>参考価格：</strong> ¥${(b.price || 0).toLocaleString()}（税込）</li>
            <li><strong>発売日：</strong> ${escapeXml(b.salesDate || '配信中')}</li>
            <li><strong>対応端末：</strong> スマホ / タブレット / PC / 電子書籍リーダー</li>
          </ul>
          <div class="guide-book-cta">
            <a class="rakuten-buy-btn" href="${escapeXml(b.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">
              <span>楽天Koboで第1巻を読む（無料試し読みあり） ↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `).join('')

  const pageHtml = `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>【完全初心者向け】楽天Koboで電子書籍を買うメリット・購入方法・試し読みガイド＆人気第1巻おすすめ10選｜異世界コンパス</title>
<meta name="description" content="「電子書籍ってどうやって買うの？」「会員登録は必要？」「スマホやPCで読める？」そんな疑問をすべて解決！楽天Koboで電子書籍を読むメリット、購入手順、無料試し読みの使い方を分かりやすく解説。初めての1冊にぴったりな大人気異世界作品の第1巻10選も紹介します。">
<link rel="canonical" href="${siteUrl}/features/rakuten-kobo-beginner-guide/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="【完全初心者向け】楽天Koboで電子書籍を始めるメリット・購入方法・試し読みガイド＆人気第1巻10選">
<meta property="og:description" content="電子書籍初心者に向けて、楽天Koboのメリット、購入手順、アプリの使い方を徹底解説。無料試し読みから始められる大人気作の第1巻10選も掲載！">
<meta property="og:type" content="article">
<style>
  :root {
    --bg-dark: #121b19;
    --bg-main: #f4f1e9;
    --card-bg: #ffffff;
    --text-primary: #17221f;
    --text-muted: #57655a;
    --accent: #8b672d;
    --accent-light: #d6a24a;
    --rakuten-red: #bf0000;
    --border-color: #dce3d8;
  }
  * { box-sizing: border-box; }
  body { margin: 0; color: var(--text-primary); background: var(--bg-main); font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif; line-height: 1.85; -webkit-font-smoothing: antialiased; }
  a { color: var(--accent); text-decoration: none; }
  a:hover { text-decoration: underline; }
  
  .site-header { background: #17221f; color: #fff; padding: 14px 20px; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.15); }
  .header-inner { max-width: 1080px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .brand { display: flex; align-items: center; gap: 8px; color: #fff; text-decoration: none; font-size: 18px; }
  .brand-mark { color: #d6a24a; font-size: 20px; }
  .brand small { display: block; font-size: 9px; letter-spacing: 0.15em; color: #a37a32; }
  .main-nav { display: flex; gap: 18px; align-items: center; }
  .main-nav a { color: #cfd8d3; font-size: 14px; position: relative; font-weight: 500; }
  .main-nav a:hover, .main-nav a.active { color: #fff; text-decoration: none; }

  main { padding: 40px 20px 80px; max-width: 900px; margin: 0 auto; }
  .crumb { font-size: 13px; margin-bottom: 24px; color: var(--text-muted); }
  .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #a37a32; font-weight: bold; }
  h1 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 28px; margin: 8px 0 24px; line-height: 1.45; color: #17221f; }
  
  .intro-box { background: #fff; border-left: 6px solid var(--rakuten-red); border-radius: 8px; padding: 26px; margin-bottom: 36px; box-shadow: 0 2px 12px rgba(0,0,0,0.03); }
  .intro-box p { margin: 0 0 14px; font-size: 15.5px; line-height: 1.85; color: #233027; }
  .intro-box p:last-child { margin: 0; }

  .toc-box { background: #eaf0e8; border: 1px solid #c9d8c6; border-radius: 8px; padding: 22px 24px; margin-bottom: 40px; }
  .toc-title { font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #17221f; }
  .toc-list { list-style: none; padding: 0; margin: 0; }
  .toc-list li { margin-bottom: 8px; font-size: 14.5px; }
  .toc-list li a { color: #23372d; font-weight: 500; }
  .toc-list li a:hover { color: var(--accent); }

  .section-block { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 32px 28px; margin-bottom: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); }
  .section-block h2 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 23px; color: #17221f; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 2px solid #e8ece7; display: flex; align-items: center; gap: 10px; }
  .section-block h3 { font-size: 18px; color: #17221f; margin: 26px 0 12px; border-left: 5px solid var(--accent); padding-left: 12px; }
  .section-block p { font-size: 15px; color: #2c3a32; line-height: 1.85; margin: 0 0 16px; }

  .merit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
  .merit-card { background: #f8faf7; border: 1px solid #dce5da; border-radius: 8px; padding: 20px; }
  .merit-card h4 { font-size: 16px; color: #17221f; margin: 0 0 8px; display: flex; align-items: center; gap: 6px; }
  .merit-card p { font-size: 13.5px; color: #415247; margin: 0; line-height: 1.7; }

  .step-flow { display: flex; flex-direction: column; gap: 16px; margin: 20px 0; }
  .step-item { background: #fdfbf7; border: 1px solid #ecd8b8; border-radius: 8px; padding: 20px; display: flex; gap: 18px; align-items: flex-start; }
  .step-badge { background: #d6a24a; color: #17221f; font-weight: bold; font-size: 14px; padding: 6px 14px; border-radius: 20px; flex-shrink: 0; }
  .step-content h4 { margin: 0 0 6px; font-size: 16px; color: #17221f; }
  .step-content p { margin: 0; font-size: 14px; color: #435248; }

  .qa-block { background: #f4f8f4; border: 1px solid #d3e2d3; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
  .qa-q { font-weight: bold; font-size: 15.5px; color: #17221f; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .qa-a { font-size: 14px; color: #324339; line-height: 1.8; margin: 0; }

  /* 10選カード */
  .guide-book-card { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 26px; margin-bottom: 28px; position: relative; box-shadow: 0 4px 14px rgba(0,0,0,0.03); }
  .guide-book-num { position: absolute; top: 16px; left: 16px; width: 32px; height: 32px; background: #17221f; color: #d6a24a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; }
  .guide-book-hero { display: flex; gap: 24px; margin-left: 36px; }
  .guide-book-cover { width: 140px; flex-shrink: 0; text-align: center; }
  .guide-book-cover img { width: 100%; height: auto; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
  .guide-book-meta { flex-grow: 1; }
  .guide-book-title { font-size: 19px; color: #17221f; margin: 0 0 8px; font-weight: bold; }
  .guide-book-lead { font-size: 14px; color: #3a4b41; line-height: 1.7; margin: 0 0 14px; background: #f9fbf9; padding: 12px 14px; border-radius: 6px; border-left: 3px solid #d6a24a; }
  .guide-book-info-list { list-style: none; padding: 0; margin: 0 0 16px; font-size: 13px; color: var(--text-muted); line-height: 1.9; }
  .guide-book-info-list strong { color: var(--text-primary); }

  .rakuten-buy-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: var(--rakuten-red); color: #fff !important; font-weight: bold; font-size: 14px; padding: 11px 22px; border-radius: 6px; text-decoration: none !important; transition: background 0.2s, transform 0.2s; box-shadow: 0 4px 10px rgba(191,0,0,0.2); }
  .rakuten-buy-btn:hover { background: #990000; transform: translateY(-2px); box-shadow: 0 6px 14px rgba(191,0,0,0.3); }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 40px 20px; margin-top: 60px; font-size: 14px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 680px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
    .merit-grid { grid-template-columns: 1fr; }
    .guide-book-hero { flex-direction: column; align-items: center; margin-left: 0; margin-top: 24px; text-align: center; }
    .guide-book-info-list { text-align: left; }
    .step-item { flex-direction: column; gap: 10px; }
  }
</style>
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());
  gtag("config", "${GA_ID}", { send_page_view: true });
</script>
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
    <nav class="main-nav">
      <a href="/">トップ</a>
      <a href="/features/" class="active">特集<em>HOT</em></a>
      <a href="/works/">作品を探す</a>
      <a href="/new/">新刊<em>NEW</em></a>
      <a href="/tags/">タグ</a>
      <a href="/authors/">作者</a>
      <a href="/series/">シリーズ</a>
      <a href="/compare/">比較</a>
    </nav>
  </div>
</header>

<main>
  <div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　楽天Kobo電子書籍初心者ガイド</div>
  <div class="eyebrow">BEGINNER GUIDE &amp; BEST 10 SELECTION</div>
  <h1>【完全初心者向け】楽天Koboで電子書籍を買うメリット・購入手順・無料試し読み徹底解説</h1>

  <div class="intro-box">
    <p>「紙の本から電子書籍に切り替えてみたいけれど、買い方や使い方がよくわからない……」「スマホやパソコンでも読めるの？」「専用の端末や会員登録は必須？」</p>
    <p>そんな電子書籍の購入を検討している初心者の方に向けて、国内最大級の電子書籍ストア<strong>「楽天Kobo（コボ）」</strong>のメリットやデジタルの強み、購入の流れ、無料試し読みの方法をわかりやすく徹底解説します。</p>
    <p>記事の後半では、<strong>初めての1冊に絶対おすすめしたい大人気異世界ライトノベル・漫画の第1巻（10選）</strong>を楽天Kobo公式データとともにご紹介します！</p>
  </div>

  <div class="toc-box">
    <div class="toc-title">✦ 目次・この記事でわかること</div>
    <ul class="toc-list">
      <li><a href="#section-merit">1. なぜ電子書籍？楽天Koboで本を読む7つの圧倒的メリット</a></li>
      <li><a href="#section-device">2. 専用端末は不要！スマホ・タブレット・PCで今すぐ読める仕組み</a></li>
      <li><a href="#section-trial">3. 無料試し読みは登録不要？誰でもすぐに立ち読みできる方法</a></li>
      <li><a href="#section-howto">4. 楽天Koboでの購入手順・会員登録・決済方法を3ステップで解説</a></li>
      <li><a href="#section-points">5. 楽天ポイントがザクザク貯まる＆使える！お得な買い方のコツ</a></li>
      <li><a href="#section-faq">6. 電子書籍のよくある質問・不安への回答（FAQ）</a></li>
      <li><a href="#section-books">7. 初めての電子書籍に！今読みたい珠玉の人気作「第1巻」10選</a></li>
    </ul>
  </div>

  <section class="section-block" id="section-merit">
    <h2>1. なぜ電子書籍？楽天Koboで本を読む7つの圧倒的メリット</h2>
    <p>紙の書籍には紙ならではの良さがありますが、一度電子書籍の便利さを体験すると「もう紙には戻れない」という読者が続出しています。特に楽天Koboには以下のような大きなメリットがあります。</p>

    <div class="merit-grid">
      <div class="merit-card">
        <h4>📦 本棚のスペースが一切不要！</h4>
        <p>何十巻、何百巻購入しても部屋の場所を一切取りません。部屋が本で埋まる心配がなく、何千冊でも端末1台にスッキリ収まります。</p>
      </div>
      <div class="merit-card">
        <h4>⚡ 買ったら1秒で届く・今すぐ読める</h4>
        <p>深夜でも早朝でも、読みたいと思った瞬間にポチッと購入すれば、数秒のダウンロードですぐに読み始められます。書店の開店待ちや配達日数はゼロです。</p>
      </div>
      <div class="merit-card">
        <h4>👜 重い本を持ち歩く必要なし</h4>
        <p>通勤・通学の電車内や旅行先でも、スマートフォン1台あればいつでもどこでも読書が可能。分厚いライトノベルや大長編漫画も手軽に読めます。</p>
      </div>
      <div class="merit-card">
        <h4>🔍 文字サイズや背景色を自由に変更</h4>
        <p>小説（テキスト作品）は文字の大きさやフォント、行間、背景色（白・黒・セピア）を自分好みに調整可能。夜間の読書も目が疲れません。</p>
      </div>
      <div class="merit-card">
        <h4>💰 楽天ポイントが貯まる・使える</h4>
        <p>普段のお買い物で貯まった楽天ポイントを使って本が買えます。もちろん購入時にも1%以上のポイントが還元され、お買い物マラソンやSPUの対象にもなります。</p>
      </div>
      <div class="merit-card">
        <h4>🔒 家族や周囲に表紙を見られない</h4>
        <p>スマホやタブレットの画面で読むため、どんなジャンルの本を読んでいても周囲の目を気にする必要がありません。プライバシーも安心です。</p>
      </div>
    </div>
  </section>

  <section class="section-block" id="section-device">
    <h2>2. 専用端末は不要！スマホ・タブレット・PCで今すぐ読める仕組み</h2>
    <p>「電子書籍を読むには、専用の電子書籍リーダー（Kobo ClaraやKobo Sageなど）を買わなければいけないの？」と疑問に思う方が多いですが、<strong>専用端末を購入する必要はまったくありません。</strong></p>
    <p>普段お使いの<strong>スマートフォン（iPhone / Android）</strong>、<strong>タブレット（iPad / Androidタブレット）</strong>、<strong>パソコン（Windows / Mac）</strong>に無料の「楽天Koboアプリ」をインストールするだけで、誰でも今すぐ手持ちの端末で読書を楽しめます。</p>
    
    <h3>複数端末での同期も自動！</h3>
    <p>同じ楽天アカウントでログインしておけば、「通勤電車ではスマホで読み、帰宅後は家のiPadやパソコンの大画面で続きを開く」といった使い分けが可能です。読み進めたページ位置（しおり）もクラウド経由で自動的に同期されます。</p>
  </section>

  <section class="section-block" id="section-trial">
    <h2>3. 無料試し読みは登録不要？誰でもすぐに立ち読みできる方法</h2>
    <p>「どんな作品か雰囲気を確かめてから買いたい」「文字の読みやすさを試してみたい」という方のために、楽天Koboでは<strong>ほぼすべての作品で冒頭数十ページの「無料試し読み」</strong>が提供されています。</p>

    <div class="qa-block">
      <div class="qa-q">Q. 試し読みに会員登録やクレジットカード登録は必要ですか？</div>
      <p class="qa-a"><strong>いいえ、登録は一切不要です！</strong> 楽天Koboの商品ページにある「ブラウザで試し読み」または「無料立ち読み」ボタンをタップするだけで、ログインなしでもすぐに作品の冒頭や第1話を読むことができます。</p>
    </div>
    <p>まずは気になる作品の試し読みボタンを押して、電子書籍の閲覧画面がどのようなものか体験してみるのがおすすめです。</p>
  </section>

  <section class="section-block" id="section-howto">
    <h2>4. 楽天Koboでの購入手順・会員登録・決済方法を3ステップで解説</h2>
    <p>電子書籍の購入は驚くほど簡単です。普段楽天市場を利用している方なら、登録済みの住所やクレジットカード情報を使ってわずか数十秒で購入が完了します。</p>

    <div class="step-flow">
      <div class="step-item">
        <div class="step-badge">STEP 1</div>
        <div class="step-content">
          <h4>楽天会員にログイン（未登録の方は無料登録）</h4>
          <p>すでに楽天アカウントをお持ちの方はそのままログイン。お持ちでない方も、メールアドレスとお名前だけで数分で無料登録できます。</p>
        </div>
      </div>
      <div class="step-item">
        <div class="step-badge">STEP 2</div>
        <div class="step-content">
          <h4>読みたい本を選んで「買い物かご」または「購入手続き」へ</h4>
          <p>作品ページから「購入手続きへ」を選択。クレジットカード、楽天ポイント、楽天キャッシュなどお好みの決済方法を選びます。</p>
        </div>
      </div>
      <div class="step-item">
        <div class="step-badge">STEP 3</div>
        <div class="step-content">
          <h4>無料アプリを開いて本をダウンロード！</h4>
          <p>スマホやタブレットの「楽天Koboアプリ」を開くと、購入した本が自動的に本棚に追加されます。タップしてダウンロードすればすぐに読み始められます。</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section-block" id="section-points">
    <h2>5. 楽天ポイントがザクザク貯まる＆使える！お得な買い方のコツ</h2>
    <p>楽天Kobo最大の強みは、<strong>「楽天経済圏」のポイント還元とお得なクーポン</strong>です。</p>
    <ul style="padding-left: 20px; line-height: 1.9; font-size: 15px; color: #2c3a32;">
      <li><strong>全額ポイント支払いが可能：</strong> 街のお買い物や楽天カードで貯まった「通常ポイント」「期間限定ポイント」を1ポイント＝1円として電子書籍の購入に使えます。</li>
      <li><strong>SPU（スーパーポイントアッププログラム）対象：</strong> 楽天Koboで当月合計1,000円（税込）以上のお買い物をすると、その月の楽天市場でのお買い物ポイント倍率がアップします。</li>
      <li><strong>定期的なまとめ買いクーポン：</strong> 「まとめ買いで15%〜20%OFF」「初めての方限定の割引クーポン」など、頻繁に割引キャンペーンが実施されています。</li>
    </ul>
  </section>

  <section class="section-block" id="section-faq">
    <h2>6. 電子書籍のよくある質問・不安への回答（FAQ）</h2>
    <div class="qa-block">
      <div class="qa-q">Q. 一度購入した本は、スマホを機種変更しても読めますか？</div>
      <p class="qa-a"><strong>はい、何度でも再ダウンロードして読めます。</strong> 購入履歴は楽天アカウントに安全に保存されているため、スマートフォンを買い替えたり新しいタブレットを追加しても、同じアカウントでログインすれば追加料金なしで再度本をダウンロードできます。</p>
    </div>
    <div class="qa-block">
      <div class="qa-q">Q. オフライン（電波のない場所・飛行機の中）でも読めますか？</div>
      <p class="qa-a"><strong>はい、読めます。</strong> 自宅のWi-Fiなどで端末に一度ダウンロードしておけば、地下鉄の中や山の中、機内モードの状態でも完全オフラインで快適に読書を楽しめます。</p>
    </div>
    <div class="qa-block">
      <div class="qa-q">Q. 月額料金や年会費などの固定費はかかりますか？</div>
      <p class="qa-a"><strong>月額費用は一切かかりません。</strong> 楽天Koboは「本を1冊ずつ購入する買い切り型ストア」です。アプリの利用料も無料ですので、購入した本の代金以外に余計な費用は1円も発生しません。</p>
    </div>
  </section>

  <section class="section-block" id="section-books">
    <h2>7. 初めての電子書籍に！今読みたい珠玉の人気作「第1巻」10選</h2>
    <p>「電子書籍の良さはわかったけれど、まず何を読めばいいかわからない」という方へ！ 現在アニメ化やメディアミックスで絶大な人気を誇る異世界ライトノベル・漫画の<strong>「第1巻」</strong>を厳選してご紹介します。</p>
    <p>各作品の画像やリンクから、楽天Koboで即座に無料試し読みや購入が可能です。</p>

    <div class="guide-books-list" style="margin-top: 30px;">
      ${booksCardsHtml}
    </div>
  </section>

  <div style="margin-top: 50px; text-align: center;">
    <a href="/features/" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:bold; background:#17221f; color:#fff; border-radius:6px;">← おすすめ特集一覧へ戻る</a>
  </div>
</main>

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
</body>
</html>`

  const dir = path.join(root, 'public/features/rakuten-kobo-beginner-guide')
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'index.html'), pageHtml)

  const distDir = path.join(root, 'dist/features/rakuten-kobo-beginner-guide')
  await fs.mkdir(distDir, { recursive: true })
  await fs.writeFile(path.join(distDir, 'index.html'), pageHtml)

  console.log('✅ 楽天Kobo初心者向け購入完全ガイドの生成が完了しました！')
}

await buildBeginnerGuidePage()
