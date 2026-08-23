import fs from 'node:fs/promises'
import fsSync from 'node:fs'
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
  h1 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 27px; margin: 8px 0 20px; line-height: 1.45; color: #17221f; }
  .lead { font-size: 15.5px; color: #233027; background: #fff; padding: 24px; border-left: 5px solid #d6a24a; border-radius: 6px; margin-bottom: 36px; line-height: 1.85; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }

  .compare-header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }
  .compare-box { background: #fff; padding: 24px; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; justify-content: space-between; }
  .compare-box h3 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 19px; margin: 0 0 10px; line-height: 1.4; }
  .compare-box-body { display: flex; gap: 16px; margin-bottom: 16px; }
  .compare-box img { width: 120px; height: 165px; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); flex-shrink: 0; background: #fdfdfd; }
  .compare-box-desc { font-size: 13.5px; line-height: 1.7; color: #2d3b32; }
  .card-btn { display: inline-block; text-align: center; background: #17221f; color: #fff !important; font-weight: 500; font-size: 13.5px; padding: 10px 16px; border-radius: 6px; text-decoration: none !important; transition: background 0.2s; }
  .card-btn:hover { background: #8b672d; }

  .compare-table { width: 100%; border-collapse: collapse; margin: 32px 0; background: #fff; border-radius: 8px; overflow: hidden; border: 1px solid #d9ddd3; }
  .compare-table th, .compare-table td { padding: 13px 16px; font-size: 14px; border-bottom: 1px solid #e1e6de; text-align: left; }
  .compare-table th { background: #17221f; color: #fff; width: 22%; font-weight: bold; }
  .compare-table td { width: 39%; vertical-align: top; line-height: 1.65; }

  .article-section { background: #fff; padding: 32px; border-radius: 8px; border: 1px solid var(--border-color); margin: 28px 0; line-height: 1.95; color: #233028; }
  .article-section h2 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 21px; border-left: 5px solid #d6a24a; padding-left: 12px; margin: 36px 0 16px; color: #17221f; }
  .article-section h2:first-of-type { margin-top: 0; }
  .article-section p { font-size: 15px; margin-bottom: 18px; text-align: justify; }
  .contrast-badge { display: inline-block; font-size: 12px; padding: 2px 8px; border-radius: 4px; background: #edf4ee; color: #2b5536; font-weight: bold; margin-bottom: 8px; }

  .diag-box { background: #f4f8f4; padding: 24px; border-radius: 8px; border-left: 5px solid #8b672d; margin-top: 32px; }
  .diag-box h3 { margin-top: 0; font-size: 18px; color: #17221f; }
  .diag-item { margin-bottom: 12px; font-size: 14.5px; }
  .diag-item:last-child { margin-bottom: 0; }
  
  .pill { display: inline-block; background: #e8eee9; color: #26382d; border-radius: 20px; padding: 4px 12px; font-size: 13px; margin: 0 6px 6px 0; }

  footer { background: #121b19; color: #8e9e94; padding: 40px 20px; text-align: center; font-size: 13px; margin-top: 60px; border-top: 1px solid #23312c; }
  footer a { color: #cfd8d3; }

  @media(max-width:700px){
    .compare-header-grid { grid-template-columns: 1fr; }
    .compare-table th { font-size: 12px; padding: 10px; width: 28%; }
    .compare-table td { font-size: 12px; padding: 10px; width: 36%; }
    .compare-box-body { flex-direction: column; align-items: center; }
    .compare-box img { width: 100px; height: 140px; }
  }
`

const escapeXml = value => String(value || '').replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

function renderHeader(currentPath) {
  return `
    <header class="site-header">
      <div class="header-inner">
        <a class="brand" href="/"><span class="brand-mark">🧭</span><span>異世界コンパス<small>ISEKAI COMPASS</small></span></a>
        <nav class="main-nav">
          <a href="/features/" class="${currentPath.startsWith('/features') ? 'active' : ''}">特集<em>注目</em></a>
          <a href="/compare/" class="${currentPath.startsWith('/compare') ? 'active' : ''}">作品比較</a>
          <a href="/tags/" class="${currentPath.startsWith('/tags') ? 'active' : ''}">タグ検索</a>
          <a href="/new/" class="${currentPath.startsWith('/new') ? 'active' : ''}">新着</a>
        </nav>
      </div>
    </header>
  `
}

function renderFooter() {
  return `
    <footer>
      <p style="margin-bottom:8px;"><a href="/">トップ</a> ｜ <a href="/features/">特集一覧</a> ｜ <a href="/compare/">作品比較一覧</a> ｜ <a href="/tags/">タグ一覧</a> ｜ <a href="/new/">新着作品</a></p>
      <p style="color:#607367;font-size:12px;">© 異世界コンパス (ISEKAI COMPASS) - 異世界ファンタジー・転生ラノベ徹底ナビ</p>
    </footer>
  `
}

export function pairSlug(a, b) {
  return `${a.slug}-vs-${b.slug}`
}

export function getPairs(books) {
  const pairs = []
  for (let i = 0; i < books.length; i++) {
    for (let j = i + 1; j < books.length; j++) {
      pairs.push([books[i], books[j]])
    }
  }
  return pairs
}

// ハッシュからインデックスを取得（決定論的かつ多様な文体ローテーション）
function getDeterministicIndex(str, modulo) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % modulo
}

// 属性分類と関係性判定
function analyzePairRelationship(a, b) {
  const gA = a.genre || ''
  const gB = b.genre || ''
  const tA = a.tags || []
  const tB = b.tags || []
  const sharedTags = tA.filter(t => tB.includes(t))

  const isSameGenre = gA && gB && (gA.includes(gB) || gB.includes(gA) || gA === gB)
  const isBothReincarnation = (gA.includes('転生') || tA.some(t => t.includes('転生'))) && (gB.includes('転生') || tB.some(t => t.includes('転生')))
  const isBothVillainess = (gA.includes('悪役令嬢') || tA.some(t => t.includes('悪役令嬢'))) && (gB.includes('悪役令嬢') || tB.some(t => t.includes('悪役令嬢')))
  const isBothSlowLife = (gA.includes('スローライフ') || tA.some(t => t.includes('スローライフ'))) && (gB.includes('スローライフ') || tB.some(t => t.includes('スローライフ')))
  const isBothCheat = (gA.includes('無双') || gA.includes('最強') || tA.some(t => t.includes('最強'))) && (gB.includes('無双') || gB.includes('最強') || tB.some(t => t.includes('最強')))

  const isContrastMood = (a.emotionType?.includes('感動') || a.emotionType?.includes('シリアス')) && (b.emotionType?.includes('爽快') || b.emotionType?.includes('コメディ') || b.emotionType?.includes('癒やし'))
  
  let themeType = 'general'
  if (isBothVillainess) themeType = 'villainess_match'
  else if (isBothSlowLife) themeType = 'slowlife_match'
  else if (isBothCheat) themeType = 'cheat_match'
  else if (isBothReincarnation && isSameGenre) themeType = 'same_genre_reincarnation'
  else if (isSameGenre) themeType = 'same_genre_clash'
  else if (isContrastMood) themeType = 'contrast_mood'
  else themeType = 'cross_genre_comparison'

  return {
    themeType,
    sharedTags,
    isSameGenre,
    isContrastMood
  }
}

// セクション1: 世界観と導入の独自比較生成
function generateWorldComparison(a, b, rel, seed) {
  const idx = getDeterministicIndex(`${a.id}-${b.id}-sec1`, 4)
  const storyA = a.firstVolumeStory || a.description || ''
  const storyB = b.firstVolumeStory || b.description || ''

  if (rel.themeType === 'villainess_match') {
    return `
      <p><span class="contrast-badge">悪役令嬢・破滅回避の切り口</span></p>
      <p>どちらも「破滅フラグをどう回避するか」というスリリングな状況から始まる大人気作ですが、主人公の生き残り戦略と物語のトーンは対照的です。</p>
      <p>『<b>${escapeXml(a.title)}</b>』は、${escapeXml(storyA)}。主人公のバイタリティと前世の知識を活かして、周囲の人間関係や運命をガラリと変えていく展開が痛快です。</p>
      <p>一方の『<b>${escapeXml(b.title)}</b>』では、${escapeXml(storyB)}。貴族社会の思惑や恋愛・権謀術数への切り込み方に独自の味わいがあり、一味違ったドラマを楽しめます。</p>
    `
  }

  if (rel.themeType === 'slowlife_match') {
    return `
      <p><span class="contrast-badge">スローライフ・日常の描き方</span></p>
      <p>殺伐とした争いから離れ、異世界での暮らしや美味しい食事、仲間との穏やかな時間を楽しむ2作品ですが、日常の舞台や拠点の雰囲気に大きな個性があります。</p>
      <p>『<b>${escapeXml(a.title)}</b>』の第1巻は、${escapeXml(storyA)}。一歩ずつ生活基盤を整え、周囲の人々や魔物と絆を深めていく過程が丁寧に描かれます。</p>
      <p>対する『<b>${escapeXml(b.title)}</b>』は、${escapeXml(storyB)}。独自のスキルやユニークな仲間たちとの掛け合いが心地よく、肩の力を抜いてまったり楽しみたい時にぴったりです。</p>
    `
  }

  if (rel.themeType === 'cheat_match') {
    return `
      <p><span class="contrast-badge">圧倒的戦力・無双スタイルの違い</span></p>
      <p>主人公が規格外の強さで理不尽な状況を打ち破る爽快感が魅力の2作品ですが、その「強さの性質」と「バトルの見せ場」は大きく異なります。</p>
      <p>『<b>${escapeXml(a.title)}</b>』は、${escapeXml(storyA)}。圧倒的な力で周囲の常識を覆していくスケール感とダイナミックな戦闘が読者を引き込みます。</p>
      <p>一方の『<b>${escapeXml(b.title)}</b>』は、${escapeXml(storyB)}。力を隠して裏から操るのか、正面突破で蹴散らすのか、主人公のポリシーによってバトルのカタルシスが色濃く分かれます。</p>
    `
  }

  // 一般・異ジャンル対決
  const intros = [
    `物語のスケール感と主人公の冒険の動機を比べると、読後感やワクワクするポイントがはっきりと分かれます。`,
    `第1巻の導入部を読み解くと、主人公が置かれた初期の立場と、立ち向かう試練の方向性に独自の持ち味があります。`,
    `異世界への転生・転移のシチュエーションから広がる舞台設計において、それぞれの作品ならではの魅力が光ります。`,
    `物語のテンポ感や世界観の作り込みの違いによって、全く異なる読書体験を味わえる2作品です。`
  ]
  const introText = intros[idx]

  return `
    <p><span class="contrast-badge">世界観と第1巻ストーリーの対比</span></p>
    <p>${introText}</p>
    <p>『<b>${escapeXml(a.title)}</b>』は、${escapeXml(storyA)}。主人公が異世界の過酷な現実や新しい環境にどう立ち向かっていくかが見どころです。</p>
    <p>これに対し『<b>${escapeXml(b.title)}</b>』は、${escapeXml(storyB)}。描かれる世界の空気感や物語の推進力が異なり、それぞれ違った角度から異世界ファンタジーの醍醐味を堪能できます。</p>
  `
}

// セクション2: 主人公属性・成長スタイルの独自比較生成
function generateProtagonistComparison(a, b, rel, seed) {
  const pA = a.protagonistGender || '主人公'
  const pB = b.protagonistGender || '主人公'
  const hA = a.highlights?.[0] || a.oneLineCatch || ''
  const hB = b.highlights?.[0] || b.oneLineCatch || ''

  return `
    <p><span class="contrast-badge">主人公のタイプ・戦い方・魅力</span></p>
    <p>感情移入や爽快感を大きく左右する主人公のキャラクター造形において、『<b>${escapeXml(a.title)}</b>』の主人公は【<b>${escapeXml(pA)}</b>】です。特に「${escapeXml(hA)}」で見せるような決断力と行動パターンが、物語をグイグイ引っ張る大きな原動力となっています。</p>
    <p>対する『<b>${escapeXml(b.title)}</b>』の主人公は【<b>${escapeXml(pB)}</b>】です。「${escapeXml(hB)}」のように、直面したピンチや難問を独自の機転やスキルで切り抜ける姿が痛快です。</p>
    <p>頭脳と心理戦で立ち回るタイプなのか、圧倒的な実力でねじ伏せるタイプなのか、周囲を巻き込んで成長していくタイプなのか、主人公の性格によって読者の満足感が大きく変わります。</p>
  `
}

// セクション3: 読後感・感情体験の独自比較生成
function generateEmotionComparison(a, b, rel, seed) {
  const eA = a.emotionType || '充実した満足感'
  const eB = b.emotionType || '心地よい余韻'
  const rA = a.review || a.highlights?.[1] || ''
  const rB = b.review || b.highlights?.[1] || ''

  return `
    <p><span class="contrast-badge">読み終えた後の満足感・読後感</span></p>
    <p>ページをめくる中で湧き上がる感情のツボにも違いがあります。『<b>${escapeXml(a.title)}</b>』がもたらすのは【<b>${escapeXml(eA)}</b>】という読後感です。${rA ? `読者レビューでも「${escapeXml(rA)}」と高く評価され、胸を熱くさせてくれます。` : ''}</p>
    <p>一方の『<b>${escapeXml(b.title)}</b>』で味わえるのは【<b>${escapeXml(eB)}</b>】です。${rB ? `「${escapeXml(rB)}」という独自の魅力があり、` : ''}今自分が求めている気分のトーンに合わせて選ぶことで、期待以上の読書体験が得られます。</p>
  `
}

// セクション4: 作画・メディア化実績の独自比較生成
function generateVisualComparison(a, b, rel, seed) {
  const styleA = a.illustStyle || '魅力的なビジュアル表現'
  const styleB = b.illustStyle || '美麗なアートワーク'
  const animeA = a.animeAdaptation || 'メディア展開中'
  const animeB = b.animeAdaptation || 'メディア展開中'

  return `
    <p><span class="contrast-badge">ビジュアル表現とメディア展開</span></p>
    <p>表紙・挿絵の美麗さやアニメ化などのメディアミックス実績も要チェックです。</p>
    <p>『<b>${escapeXml(a.title)}</b>』は、イラストについて「<b>${escapeXml(styleA)}</b>」という特徴を持ち、メディア化としては【<b>${escapeXml(animeA)}</b>】という実績を誇ります。</p>
    <p>『<b>${escapeXml(b.title)}</b>』は「<b>${escapeXml(styleB)}</b>」というアートが世界観を鮮烈に引き立てており、【<b>${escapeXml(animeB)}</b>】という人気を獲得しています。小説の文章だけでなく、コミカライズやアニメなど多彩な形で作品世界を味わえるのも大きな強みです。</p>
  `
}

// セクション5: 診断・おすすめ誘導
function generateDiagnosis(a, b) {
  const rTypeA = a.readerTypes?.[0] || a.oneLineCatch || a.genre
  const rTypeB = b.readerTypes?.[0] || b.oneLineCatch || b.genre
  const catchA = a.oneLineCatch || a.title
  const catchB = b.oneLineCatch || b.title

  return `
    <div class="diag-box">
      <h3>🎯 あなたに合うのはどっち？おすすめ診断</h3>
      <div class="diag-item">
        👉 <b>${escapeXml(catchA)}</b> を味わいたい方、また【<b>${escapeXml(rTypeA)}</b>】を求めているなら ➔ 『<b><a href="/works/${a.slug}/">${escapeXml(a.title)}</a></b>』がベストマッチ！
      </div>
      <div class="diag-item">
        👉 <b>${escapeXml(catchB)}</b> を楽しみたい方、また【<b>${escapeXml(rTypeB)}</b>】を重視するなら ➔ 『<b><a href="/works/${b.slug}/">${escapeXml(b.title)}</a></b>』がおすすめです！
      </div>
    </div>
  `
}

// 単一の徹底比較HTMLを生成
export function buildComparePageHtml(a, b, targetSlug = null) {
  const rel = analyzePairRelationship(a, b)
  const seed = `${a.id}_${b.id}`
  const actualSlug = targetSlug || pairSlug(a, b)

  const pageTitle = `【徹底比較】${a.title} VS ${b.title} どっちが面白い？違い・主人公・第1巻ストーリーを詳細レビュー｜異世界コンパス`
  const description = `${a.title}と${b.title}を第1話・1巻原点ストーリー、主人公属性、ジャンル、読後感、作画、アニメ化情報から徹底比較！違いやおすすめ読者タイプがすぐ分かる。`
  const canonicalUrl = `${siteUrl}/compare/${actualSlug}/`

  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: description,
    url: canonicalUrl,
    mainEntityOfPage: canonicalUrl,
    publisher: {
      '@type': 'Organization',
      'name': '異世界コンパス'
    }
  })

  const sharedTagsHtml = rel.sharedTags.length
    ? rel.sharedTags.map(tag => `<a class="pill" href="/tags/${encodeURIComponent(tag)}/">#${escapeXml(tag)}</a>`).join(' ')
    : '<span>共通タグはありません（ジャンル・世界観の対比をお楽しみください）。</span>'

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeXml(pageTitle)}</title>
  <meta name="description" content="${escapeXml(description)}">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="${escapeXml(pageTitle)}">
  <meta property="og:description" content="${escapeXml(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${escapeXml(a.cover || b.cover || '')}">
  <script type="application/ld+json">${jsonLd}</script>
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  ${renderHeader('/compare/')}
  <main>
    <div class="crumb"><a href="/">トップ</a>　/　<a href="/compare/">作品比較一覧</a>　/　作品詳細比較</div>
    <div class="eyebrow">WORK COMPARISON & REVIEW</div>
    <h1>${escapeXml(a.title)} <span style="color:#d6a24a;font-size:0.85em;">VS</span> ${escapeXml(b.title)}</h1>
    <p class="lead"><b>第1話・1巻の原点ストーリー、主人公の成長スタイル、読後感、作画・アニメ化実績から2作品の個性を徹底比較！どちらを読むか迷った際の参考にどうぞ。</b></p>

    <div class="compare-header-grid">
      <section class="compare-box">
        <div>
          <h3>${escapeXml(a.title)}</h3>
          <div class="compare-box-body">
            <img src="${escapeXml(a.cover)}" alt="${escapeXml(a.title)}の表紙">
            <div class="compare-box-desc">
              <p style="margin:0 0 6px;font-size:12.5px;color:var(--text-muted)">作者：${escapeXml(a.author)}<br>ジャンル：${escapeXml(a.genre)}</p>
              <p style="margin:0;font-weight:500;">${escapeXml(a.oneLineCatch || a.description)}</p>
            </div>
          </div>
        </div>
        <a class="card-btn" href="/works/${a.slug}/">1巻から詳細を見る →</a>
      </section>

      <section class="compare-box">
        <div>
          <h3>${escapeXml(b.title)}</h3>
          <div class="compare-box-body">
            <img src="${escapeXml(b.cover)}" alt="${escapeXml(b.title)}の表紙">
            <div class="compare-box-desc">
              <p style="margin:0 0 6px;font-size:12.5px;color:var(--text-muted)">作者：${escapeXml(b.author)}<br>ジャンル：${escapeXml(b.genre)}</p>
              <p style="margin:0;font-weight:500;">${escapeXml(b.oneLineCatch || b.description)}</p>
            </div>
          </div>
        </div>
        <a class="card-btn" href="/works/${b.slug}/">1巻から詳細を見る →</a>
      </section>
    </div>

    <h2>📊 8大項目スペック比較表（1巻・原点ベース）</h2>
    <table class="compare-table">
      <thead>
        <tr>
          <th>比較項目</th>
          <th>${escapeXml(a.title)}</th>
          <th>${escapeXml(b.title)}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>1行キャッチ</th>
          <td>${escapeXml(a.oneLineCatch || '-')}</td>
          <td>${escapeXml(b.oneLineCatch || '-')}</td>
        </tr>
        <tr>
          <th>第1話・1巻あらすじ</th>
          <td>${escapeXml(a.firstVolumeStory || a.description)}</td>
          <td>${escapeXml(b.firstVolumeStory || b.description)}</td>
        </tr>
        <tr>
          <th>主人公の性別・属性</th>
          <td>${escapeXml(a.protagonistGender || '-')}</td>
          <td>${escapeXml(b.protagonistGender || '-')}</td>
        </tr>
        <tr>
          <th>ジャンル・カテゴリー</th>
          <td>${escapeXml(a.genre || '-')}</td>
          <td>${escapeXml(b.genre || '-')}</td>
        </tr>
        <tr>
          <th>読後感・感情タイプ</th>
          <td>${escapeXml(a.emotionType || '-')}</td>
          <td>${escapeXml(b.emotionType || '-')}</td>
        </tr>
        <tr>
          <th>作者・イラスト感</th>
          <td>${escapeXml(a.author || '-')}<br><small style="color:#5f6c62;">（${escapeXml(a.illustStyle || '-')}）</small></td>
          <td>${escapeXml(b.author || '-')}<br><small style="color:#5f6c62;">（${escapeXml(b.illustStyle || '-')}）</small></td>
        </tr>
        <tr>
          <th>アニメ化実績</th>
          <td>${escapeXml(a.animeAdaptation || '-')}</td>
          <td>${escapeXml(b.animeAdaptation || '-')}</td>
        </tr>
        <tr>
          <th>おすすめ読者タイプ</th>
          <td>${escapeXml(a.readerTypes?.[0] || '-')}</td>
          <td>${escapeXml(b.readerTypes?.[0] || '-')}</td>
        </tr>
      </tbody>
    </table>

    <article class="article-section">
      <h2>① 世界観と物語設定の根本的な違い（1巻ベース）</h2>
      ${generateWorldComparison(a, b, rel, seed)}

      <h2>② 主人公の属性・性格と成長スタイルの対比</h2>
      ${generateProtagonistComparison(a, b, rel, seed)}

      <h2>③ 読後感・体験できる感情（爽快感・感動・共感）の比較</h2>
      ${generateEmotionComparison(a, b, rel, seed)}

      <h2>④ 作画・イラストの魅力とアニメ化メディア展開</h2>
      ${generateVisualComparison(a, b, rel, seed)}

      ${generateDiagnosis(a, b)}
    </article>

    <h2 style="font-size:20px;margin:32px 0 12px;">🏷️ 共通タグ・キーワード</h2>
    <div style="margin-bottom:32px;">${sharedTagsHtml}</div>
  </main>
  ${renderFooter()}
</body>
</html>`
}

export async function writeAllComparePages(books) {
  const bookMap = new Map(books.map(b => [b.slug, b]))
  const pairs = getPairs(books)
  const compareDir = path.join(root, 'public/compare')
  await fs.mkdir(compareDir, { recursive: true })

  // 1. 既存のpublic/compareディレクトリをすべて検出してタスク化（サチコURLの完全カバレッジ保証）
  const tasks = new Map()

  // まず標準ペア
  for (const [a, b] of pairs) {
    const slug = pairSlug(a, b)
    tasks.set(slug, { a, b, slug })
  }

  // 次に既存の全ディレクトリ
  if (fsSync.existsSync(compareDir)) {
    const existingDirs = fsSync.readdirSync(compareDir).filter(d => fsSync.statSync(path.join(compareDir, d)).isDirectory())
    for (const dir of existingDirs) {
      const parts = dir.split('-vs-')
      if (parts.length === 2) {
        const a = bookMap.get(parts[0])
        const b = bookMap.get(parts[1])
        if (a && b) {
          tasks.set(dir, { a, b, slug: dir })
        }
      }
    }
  }

  const allTasks = Array.from(tasks.values())
  console.log(`Generating ${allTasks.length} compare pages (including all existing indexing paths)...`)

  // Index Page
  const links = pairs.map(([a, b]) => `
    <div class="cat-card" style="background:#fff;border:1px solid #dce3d8;padding:16px;border-radius:8px;margin-bottom:12px;">
      <h3 style="font-size:16px;margin:0 0 6px;"><a href="/compare/${pairSlug(a, b)}/">${escapeXml(a.title)} VS ${escapeXml(b.title)}</a></h3>
      <p style="font-size:13px;color:var(--text-muted);margin:0;">${escapeXml(a.oneLineCatch || a.genre)} × ${escapeXml(b.oneLineCatch || b.genre)}</p>
    </div>
  `).join('')

  const indexHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>異世界作品の徹底比較・詳細レビュー一覧｜異世界コンパス</title>
  <meta name="description" content="異世界作品を1巻原点ストーリー、設定、主人公属性、ジャンル、読後感、作画、アニメ化実績から徹底比較。">
  <link rel="canonical" href="${siteUrl}/compare/">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  ${renderHeader('/compare/')}
  <main>
    <div class="crumb"><a href="/">トップ</a>　/　作品比較一覧</div>
    <div class="eyebrow">WORK COMPARISON DIRECTORY</div>
    <h1>異世界作品の徹底比較・詳細レビュー</h1>
    <p class="lead">各作品の第1話・1巻の原点ストーリーをベースに、世界観・主人公属性・読後感・作画・アニメ化実績を多角的に比較分析します。</p>
    <div class="category-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">${links}</div>
  </main>
  ${renderFooter()}
</body>
</html>`
  await fs.writeFile(path.join(compareDir, 'index.html'), indexHtml)

  // Chunk processing for 15,000+ files
  const chunkSize = 200
  for (let i = 0; i < allTasks.length; i += chunkSize) {
    const chunk = allTasks.slice(i, i + chunkSize)
    await Promise.all(chunk.map(async ({ a, b, slug }) => {
      const html = buildComparePageHtml(a, b, slug)
      const dir = path.join(compareDir, slug)
      await fs.mkdir(dir, { recursive: true })
      await fs.writeFile(path.join(dir, 'index.html'), html)
    }))
    if (i % 2500 === 0 && i > 0) {
      console.log(`Generated ${i} / ${allTasks.length} compare pages...`)
    }
  }
  console.log(`Successfully generated all ${allTasks.length} compare pages!`)
}

// CLI direct run
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const books = JSON.parse(await fs.readFile(path.join(root, 'public/data/books.json'), 'utf8'))
  await writeAllComparePages(books)
}
