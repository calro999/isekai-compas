import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
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

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const buildAffiliateUrl = (itemUrl, affiliateId) => `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(itemUrl)}&m=${encodeURIComponent(itemUrl)}`
const escapeXml = value => String(value).replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))

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
    --text-muted: #5f6c62;
    --accent: #8b672d;
    --accent-light: #d6a24a;
    --border-color: #e2e8de;
  }
  * { box-sizing: border-box; }
  body { margin: 0; color: var(--text-primary); background: var(--bg-main); font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; line-height: 1.7; }
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

  main { padding: 40px 20px 80px; max-width: 960px; margin: 0 auto; }
  .crumb { font-size: 13px; margin-bottom: 24px; color: var(--text-muted); }
  .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #a37a32; font-weight: bold; }
  h1 { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 30px; margin: 8px 0 16px; line-height: 1.4; color: #17221f; }
  .lead { font-size: 15px; color: #2d3832; background: #fff; padding: 22px; border-left: 4px solid #d6a24a; border-radius: 6px; margin-bottom: 36px; line-height: 1.8; box-shadow: 0 2px 8px rgba(0,0,0,0.03); }

  /* Feature Article Styles */
  .toc-box { background: #eef2ec; border: 1px solid #d2dcd0; border-radius: 8px; padding: 20px 24px; margin-bottom: 40px; }
  .toc-title { font-weight: bold; font-size: 16px; margin-bottom: 12px; color: #17221f; display: flex; align-items: center; gap: 6px; }
  .toc-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; font-size: 14px; }
  .toc-list li a { color: #2a3c33; }
  .toc-list li a:hover { color: #8b672d; }

  .feature-item-section { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 28px; margin-bottom: 40px; box-shadow: 0 4px 14px rgba(0,0,0,0.03); }
  h2.feature-work-title { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 23px; color: #17221f; margin: 0 0 20px; padding-bottom: 12px; border-bottom: 2px solid #e8ece7; display: flex; align-items: baseline; gap: 10px; }
  .work-rank-num { font-size: 26px; color: #d6a24a; font-family: system-ui, sans-serif; font-weight: bold; }

  .work-hero { display: flex; gap: 24px; margin-bottom: 24px; background: #fafbfa; border: 1px solid #eef2ec; padding: 18px; border-radius: 8px; }
  .work-cover-wrap { width: 150px; flex-shrink: 0; text-align: center; }
  .work-cover-wrap img { width: 100%; height: auto; max-height: 220px; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.12); }
  .work-meta { flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; }
  .work-meta-list { list-style: none; padding: 0; margin: 0 0 16px; font-size: 13px; color: var(--text-muted); line-height: 1.9; }
  .work-meta-list strong { color: var(--text-primary); }

  .rakuten-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #bf0000; color: #fff !important; font-weight: bold; font-size: 14px; padding: 12px 20px; border-radius: 6px; text-decoration: none !important; transition: background 0.2s, transform 0.2s; box-shadow: 0 4px 10px rgba(191,0,0,0.25); }
  .rakuten-btn:hover { background: #990000; transform: translateY(-2px); }

  .feature-content-box { margin-top: 20px; }
  .feature-content-box h3 { font-size: 17px; color: #17221f; margin: 24px 0 10px; display: flex; align-items: center; gap: 8px; font-weight: bold; border-left: 4px solid #8b672d; padding-left: 10px; }
  .feature-content-box p { font-size: 15px; color: #334038; line-height: 1.85; margin: 0 0 16px; text-align: justify; }

  /* Ranking Section */
  .ranking-section { background: #17221f; color: #fff; padding: 36px 30px; border-radius: 12px; margin-top: 50px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  h2.ranking-main-title { font-family: "Hiragino Mincho ProN", "Yu Mincho", serif; font-size: 26px; color: #d6a24a; margin: 0 0 12px; text-align: center; border: none; padding: 0; }
  .ranking-intro { font-size: 15px; color: #cfd8d3; text-align: center; max-width: 680px; margin: 0 auto 30px; line-height: 1.8; }
  
  .ranking-item-card { background: #23312d; border: 1px solid #374b43; border-radius: 8px; padding: 24px; margin-bottom: 20px; }
  .ranking-item-card.gold { border-left: 6px solid #f5b041; }
  .ranking-item-card.silver { border-left: 6px solid #bdc3c7; }
  .ranking-item-card.bronze { border-left: 6px solid #e59866; }
  .ranking-item-card h3 { font-size: 19px; color: #fff; margin: 0 0 12px; display: flex; align-items: center; gap: 10px; }
  .ranking-badge { display: inline-block; font-size: 12px; padding: 3px 10px; border-radius: 4px; font-weight: bold; color: #17221f; }
  .ranking-badge.gold { background: #f5b041; }
  .ranking-badge.silver { background: #bdc3c7; }
  .ranking-badge.bronze { background: #e59866; }
  .ranking-item-card p { font-size: 14.5px; color: #dce4e0; line-height: 1.8; margin: 0; }

  /* Feature Hub Cards */
  .features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; margin-top: 24px; }
  .feature-hub-card { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 24px; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; }
  .feature-hub-card:hover { transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.08); border-color: #d6a24a; }
  .feature-hub-badge { align-self: flex-start; background: #17221f; color: #d6a24a; font-size: 11px; font-weight: bold; padding: 4px 10px; border-radius: 4px; margin-bottom: 12px; }
  .feature-hub-title { font-size: 18px; font-weight: bold; margin: 0 0 10px; line-height: 1.5; }
  .feature-hub-title a { color: #17221f; }
  .feature-hub-desc { font-size: 13.5px; color: var(--text-muted); line-height: 1.7; flex-grow: 1; margin-bottom: 18px; }
  .feature-hub-btn { background: #17221f; color: #fff !important; padding: 10px 16px; border-radius: 6px; font-size: 13px; font-weight: bold; text-align: center; text-decoration: none !important; }
  .feature-hub-btn:hover { background: #d6a24a; color: #17221f !important; }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 40px 20px; margin-top: 60px; font-size: 14px; }
  .footer-inner { max-width: 1080px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
  .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 680px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
    .toc-list { grid-template-columns: 1fr; }
    .work-hero { flex-direction: column; align-items: center; text-align: center; }
    .work-meta { align-items: center; }
    .feature-item-section { padding: 20px 16px; }
    h1 { font-size: 24px; }
    h2.feature-work-title { font-size: 20px; }
    .ranking-section { padding: 24px 16px; }
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

async function fetchRakutenBookDirect(keyword) {
  await sleep(1050)
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    format: 'json',
    formatVersion: '2',
    keyword: keyword,
    koboGenreId: '101',
    hits: '10',
    sort: 'standard'
  })
  const res = await fetch(`https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`)
  if (!res.ok) {
    throw new Error(`Rakuten API Error ${res.status}: ${await res.text()}`)
  }
  const json = await res.json()
  const items = json.Items || json.items || []
  if (items.length === 0) {
    const bookParams = new URLSearchParams({
      applicationId: process.env.RAKUTEN_APPLICATION_ID,
      accessKey: process.env.RAKUTEN_ACCESS_KEY,
      affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
      format: 'json',
      formatVersion: '2',
      title: keyword,
      hits: '10'
    })
    const bRes = await fetch(`https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404?${bookParams}`)
    if (bRes.ok) {
      const bJson = await bRes.json()
      const bItems = bJson.Items || bJson.items || []
      if (bItems.length > 0) return bItems[0]
    }
    return null
  }
  const nonSplit = items.filter(i => !i.title.includes('【分冊版】') && !i.title.includes('分冊版'))
  return nonSplit.length > 0 ? nonSplit[0] : items[0]
}

let featureDefsFromFile = []
try {
  const jsonPath = path.join(root, 'public/data/curated-features.json')
  const content = await fs.readFile(jsonPath, 'utf8')
  featureDefsFromFile = JSON.parse(content)
} catch (e) {}

export const featureDefinitions = featureDefsFromFile.length > 0 ? featureDefsFromFile : [
  {
    slug: 'slowlife-10',
    title: '異世界でスローライフを満喫できるおすすめラノベ10選',
    metaTitle: '異世界スローライフ系おすすめラノベ10選！のんびり田舎暮らし＆グルメを満喫できる傑作まとめ',
    description: 'バトルやギスギスした人間関係に疲れたあなたへ。美味しい異世界飯、もふもふの相棒たち、のんびりとした領地開拓やカフェ経営など、読んでいるだけで心がじんわり温まるスローライフ系異世界ライトノベル10作品を読者目線で徹底解説します。',
    eyecatchBadge: '癒やし＆日常',
    items: [
      {
        keyword: 'とんでもスキルで異世界放浪メシ',
        customTitle: 'とんでもスキルで異世界放浪メシ',
        synopsis: '勇者召喚に巻き込まれた平凡なサラリーマン・ムコーダ。固有スキル「ネットスーパー」で現代日本の食材や調味料を取り寄せられることに気づき、危険な王城を脱出して気ままな一人旅に出発します。しかし、ネットスーパーの調味料で焼いた生姜焼きやステーキの匂いにつられ、伝説の魔獣フェンリル（フェル）や食いしん坊なスライム（スイ）が従魔になってしまい、至高のグルメ食い倒れ旅が幕を開けます。',
        recommendReason: 'とにかく作中に出てくる肉料理やスイーツの描写が圧倒的に飯テロです！食いしん坊なフェルや無邪気で可愛いスイに「おかわり！」とせがまれ、嬉しそうに料理を振る舞うムコーダの姿に思わず頬が緩みます。戦闘は基本的にチート従魔たちが秒殺してくれるため、読者は一切のストレスなく、旅先の風景と絶品料理の数々をまったり楽しめます。仕事終わりのリラックスタイムに最高の一冊です。'
      },
      {
        keyword: '異世界居酒屋「のぶ」',
        customTitle: '異世界居酒屋「のぶ」',
        synopsis: '古都アイテーリアの片隅に、なぜか日本の京都にある居酒屋「のぶ」の入り口が繋がってしまいます。店主のノブが生み出す揚げたての唐揚げや冷えた生ビール（トリアエズナマ）、おでんなど、異世界の人々にとっては未知の「極上料理」が、衛兵や貴族、果ては司教までも虜にしていきます。',
        recommendReason: 'ただ美味しい料理を食べるだけでなく、料理を通じて頑固な衛兵同士のわだかまりが解けたり、悩める職人が自信を取り戻したりと、人情味あふれる群像劇が描かれているのが最大の魅力です。1話完結型でテンポよく読めるので、疲れた夜にビール片手に読むと格別の癒やしを味わえます。'
      },
      {
        keyword: '鍛冶屋ではじめる異世界スローライフ',
        customTitle: '鍛冶屋ではじめる異世界スローライフ',
        synopsis: '過労死した中年サラリーマン・エイゾウが、神様からチートな鍛冶スキルを授かって森の奥深くで第二の人生をスタート。オーダーメイドで包丁やナタ、農具を作りながら、森で行き倒れていたエルフの少女サーミャや獣人たちを保護し、家族のように食卓を囲む穏やかな日々を紡ぎます。',
        recommendReason: '主人公が「世界を救う気は一切ない」「ただ好きなものを作って静かに暮らしたい」というスタンスを一貫しているのが本当に心地よいです。鉄を打ち、木を削り、美味しい森の幸を食べる。ものづくりへのこだわりと、素朴で温かい同居生活の描写に心のトゲがすっと消えていく感覚を味わえます。'
      },
      {
        keyword: '異世界でカフェを開店しました。',
        customTitle: '異世界でカフェを開店しました。',
        synopsis: '料理が大好きなOL・リサが転移した異世界は、なぜか料理の味が非常に大雑把で不味い世界でした。食への情熱を抑えきれなくなったリサは、妖精の助けを借りて森の近くに小さなカフェをオープン。ふわふわのフレンチトーストやハーブティー、手作りスープを振る舞い、噂を聞きつけた精霊や騎士たちで賑わう人気店へと育てていきます。',
        recommendReason: 'カフェの温もりあるインテリアや、焼き立てのパンと甘いスイーツの香りがページ越しに漂ってくるような丁寧な描写が秀逸です。女性主人公ならではの細やかな気配りや、訪れるお客さんたちとの心温まる交流に、日常の慌ただしさを忘れさせてくれます。'
      },
      {
        keyword: '神達に拾われた男',
        customTitle: '神達に拾われた男',
        synopsis: 'ブラック企業で過酷な人生を終えた中年男性・竹林竜馬。神々から祝福を受けて子供の姿で異世界へ転生した彼は、森の中で様々なスライムの研究とテイムに没頭します。クリーナースライムで洗濯や掃除をこなしたり、スカベンジャーでゴミ処理をしたりと、スライムたちの特性を活かして街の衛生問題を解決し、クリーニング店を開業して大成功を収めます。',
        recommendReason: '前世で酷使されていた主人公が、周囲の優しい人々（公爵家一家など）から純粋に感謝され、温かく見守られながら自分のペースで幸せを掴んでいく姿に涙腺が緩みます。スライムを便利屋のように活用するユニークな発想と、善人しかいない優しい世界観に安心して浸ることができます。'
      },
      {
        keyword: 'チート薬師のスローライフ',
        customTitle: 'チート薬師のスローライフ〜異世界に作ろうドラッグストア〜',
        synopsis: '社畜としてすり減っていた桐尾礼治が、創薬スキルを持って異世界へ転生。戦闘用ではなく、日常生活を快適にするポーション（目薬、エナジードリンク、消臭剤、虫除けなど）を開発し、狼耳の少女ノエラや幽霊のミナと一緒に田舎町で小さなドラッグストアを営みます。',
        recommendReason: '「異世界の住人が抱える日常のささやかな悩み」を現代的な発想の薬品で解決していくコミカルな日常劇が楽しい作品です。看板娘ノエラの無邪気な可愛さと、主人公の脱力系ツッコミの掛け合いが絶妙で、クスッと笑いながらストレスフリーで読み進められます。'
      },
      {
        keyword: '異世界料理道',
        customTitle: '異世界料理道',
        synopsis: '大衆食堂の見習い料理人・津留見明日太が、火事から包丁を守ろうとして異世界「森辺の民」の集落へ飛ばされてしまいます。狩猟民族である森辺の民は、巨大イノシシ「ギバ」の肉を臭くて硬い不味いものとして扱っていました。明日太は地球で培った下処理と調理技術を駆使し、ギバ肉を絶品の家庭料理へと昇華させていきます。',
        recommendReason: '異世界グルメ作品の中でも群を抜いて「食文化の衝突と相互理解」を深く掘り下げた重厚なスローライフです。魔法によるイージーなチートに頼らず、丁寧な下ごしらえや火加減、現地で手に入る食材の研究によって少しずつ集落の人々の信頼を勝ち取っていく過程は、読み応え抜群のドラマになっています。'
      },
      {
        keyword: 'ポーション頼みで生き延びます！',
        customTitle: 'ポーション頼みで生き延びます！',
        synopsis: '神様のミスで命を落としたOL・長瀬香。異世界転生にあたり「思い通りの容器に望む通りの効果の薬品を自由に出現させるスキル」を要求し、カオルとして異世界へ。権力者からの囲い込みや面倒な争いを巧みな話術とポーションチートで回避しながら、自分の自由気ままな安寧ライフを死守するために奔走します。',
        recommendReason: '主人公カオルのちゃっかりした商売上手ぶりと、機転の利いた立ち回りが痛快です。ただのんびりするだけでなく、自分の平穏を脅かす悪徳商人や貴族をギャフンと言わせる爽快感もあり、テンポの良さとユーモアに引き込まれます。'
      },
      {
        keyword: '異世界のんびり農家',
        customTitle: '異世界のんびり農家',
        synopsis: '闘病生活の末に亡くなった青年・街尾火楽（ヒラク）。神様から健康な肉体と「万能農具」を授かり、誰も立ち入らない魔の森の中心で一人開墾を始めます。農具を振るうだけで思い通りの農地や作物が育ち、インフェルノウルフのクロや吸血鬼のルー、ハイエルフたちが集まってきて、いつの間にか巨大な「大樹の村」へと発展していきます。',
        recommendReason: '荒れ地を耕し、作物を収穫し、家や施設を拡張していく「サンドボックス型ゲーム」のようなワクワク感がたまりません。村人たちがみんなヒラクを敬愛しており、村全体で酒を酌み交わしたり収穫祭を楽しんだりする大所帯のほのぼのライフが癖になります。'
      },
      {
        keyword: '魔導具師ダリヤはうつむかない',
        customTitle: '魔導具師ダリヤはうつむかない 〜きょうから自由な職人ライフ〜',
        synopsis: '結婚直前に婚約者から浮気・婚約破棄を言い渡された魔導具師のダリヤ。しかし彼女は泣き寝入りするどころか、「これからは誰にも縛られず、大好きな魔導具作りに没頭して自由に生きる！」と前を向きます。ドライヤー、防水布、小型魔導コンロなど、前世の知識と豊かな発想力で画期的な魔導具を次々と生み出し、職人として自立していきます。',
        recommendReason: '失意のどん底から自分の腕一本で立ち上がり、美味しいお酒と料理を味わいながら情熱を注ぎ込むダリヤの姿が実にカッコよく、清々しい応援したくなるヒロイン像です。友人の騎士ヴォルフとの大人でじれったい距離感や、お互いに美味い酒と肴を語り合う晩酌シーンの描写が絶品です。'
      }
    ],
    ranking: [
      {
        rank: 1,
        title: 'とんでもスキルで異世界放浪メシ',
        reason: '圧倒的な飯テロ力と、フェル・スイといった愛嬌抜群の従魔たちとの掛け合いが唯一無二です。戦闘のストレスが完全にゼロで、旅先で美味しいものを買って作って食べるというスローライフの究極形を体現しています。読めば必ずお腹が空き、心が癒やされる文句なしの第1位です。'
      },
      {
        rank: 2,
        title: '魔導具師ダリヤはうつむかない 〜きょうから自由な職人ライフ〜',
        reason: '自立した大人の女性が、ものづくりへの熱い情熱と美味しい晩酌で人生を再スタートさせる丁寧な筆致が素晴らしいです。ファンタジー世界のリアリティある職人文化と、心を通わせる仲間たちの温かさが胸に染み渡ります。'
      },
      {
        rank: 3,
        title: '異世界料理道',
        reason: '魔法チートに頼らない「真摯な料理と文化交流」を描いた大傑作。異文化の生活習慣に戸惑いながらも、一杯のスープや肉料理を通じて仲間として認められていく過程は、他の作品にはない深い感動と充実感を味わえます。'
      }
    ]
  },
  {
    slug: 'monster-reincarnation-10',
    title: '異世界転生したら人外・魔物だったおすすめラノベ10選',
    metaTitle: '人外・魔物転生おすすめ異世界ラノベ10選！スライム・蜘蛛・剣・骸骨など異形の成り上がり傑作まとめ',
    description: '人間をやめた主人公たちの規格外な大冒険！スライム、蜘蛛、ドラゴン、生ける骸骨、はては「剣」や「温泉」にまで転生してしまった異色の異世界ファンタジー小説から、進化とサバイバルの面白さが詰まった傑作10選を読者目線で厳選紹介します。',
    eyecatchBadge: '人外転生＆進化',
    items: [
      {
        keyword: '転生したらスライムだった件',
        customTitle: '転生したらスライムだった件',
        synopsis: '通り魔に刺されて死んだサラリーマン・三上悟が、異世界の洞窟で目覚めると最弱モンスター「スライム」になっていました。しかし授かったスキル「捕食者」で相手の能力を奪い、「大賢者」の知恵を借りることで驚異的な進化を遂げます。暴風竜ヴェルドラと友達になり「リムル」と名乗った彼は、ゴブリンや鬼人たちを束ね、多種族が共存できる理想の魔国を建国していきます。',
        recommendReason: '人外転生ブームの頂点に君臨する大人気作。ぷにぷにとした見た目の可愛さと、敵対勢力を一瞬で圧倒する規格外の強さのギャップがたまりません。仲間たちに名前をつけて進化させ、荒れ地から一大文明都市を築き上げていく内政＆無双のテンポの良さは何度読んでも胸が躍ります。'
      },
      {
        keyword: '蜘蛛ですが、なにか？',
        customTitle: '蜘蛛ですが、なにか？',
        synopsis: '教室の爆発事故で命を落とした女子高生が、最悪の難関迷宮の底で蜘蛛の魔物として孵化。生まれた瞬間から共食いや凶悪モンスターの襲撃に晒される極限状態の中、知恵と糸スキル、毒を駆使した命がけのサバイバルを繰り広げます。',
        recommendReason: '「私（蜘蛛子）」のテンションの高いハイテンションな一人語りと、それとは裏腹な過酷すぎる迷宮サバイバルの対比が最高に面白いです！弱者が格上の敵をトラップと状態異常でハメ倒してレベルアップし、より強力な蜘蛛形態へと進化していくゲームライクなカタルシスが中毒性を生み出しています。'
      },
      {
        keyword: '転生したら剣でした',
        customTitle: '転生したら剣でした',
        synopsis: '気がつくと台座に突き刺さった「知性を持つ魔剣」に転生していた主人公。魔物を自力で倒してスキルを吸収しながら己を強化していたところ、奴隷として虐待されていた黒猫族の少女フランと出会います。フランの装備者となり、彼女の「進化したい」という切実な願いを叶えるため、過保護な親馬鹿剣として世界中を旅します。',
        recommendReason: '無機物転生という斬新な設定ながら、主人公の「剣」と幼いフランの「父娘」のような絆が非常に尊い名作です。フランがどんどん強くなり、理不尽な敵をバッサバッサとなぎ倒していくアクションの爽快感と、美味しいカレーをフランに食べさせて喜ばせる日常のギャップが魅力的です。'
      },
      {
        keyword: 'オーバーロード',
        customTitle: 'オーバーロード',
        synopsis: 'サービス終了を迎えたVRMMORPGの片隅で、骸骨の姿をした大魔法使い「モモンガ」はギルド拠点ごと異世界へ転移してしまいます。かつてNPCだった配下の悪魔や吸血鬼たちが自我を持ち、自分を「至高の支配者」として崇拝する中、彼はアンデッドの魔王アインズ・ウール・ゴウンとして世界征服へ乗り出します。',
        recommendReason: '正義のヒーローではなく、冷徹なアンデッドの「絶対悪（魔王）」の視点から描かれるダークファンタジーの最高峰です。アインズの圧倒的な軍事力と心理的駆け引き、そして部下たちの勘違いに冷や汗を流しながらも威厳を保つコメディ要素のバランスが神がかっており、一度読み始めると止まりません。'
      },
      {
        keyword: '骸骨騎士様、只今異世界へお出掛け中',
        customTitle: '骸骨騎士様、只今異世界へお出掛け中',
        synopsis: 'MMOのゲームプレイ中に寝落ちした主人公が目を覚ますと、自身のアバターである「全身鎧の骸骨騎士アーク」になって異世界に立っていました。目立つとモンスターとして討伐されてしまうため、穏便に旅をしようとするものの、目の前の悪事を見過ごせないお人好しな性格から、エルフの美少女を救出したり国を揺るがす陰謀に巻き込まれていきます。',
        recommendReason: '見た目は恐ろしい骸骨なのに、中身は陽気で世直しが大好きな好人物というギャップが爽快です。悪党に対して容赦のないチート級の神聖魔法と剣技でスカッと成敗してくれるため、王道勧善懲悪のファンタジーとしてストレスなく楽しめます。'
      },
      {
        keyword: 'Re:Monster',
        customTitle: 'Re:Monster',
        synopsis: 'ストーカーに刺されて死亡した主人公が、最弱のモンスター「ゴブリン（ゴブ朗）」として異世界に転生。食べたものの能力を自分のものにできる特異能力【吸喰能力（アブソープション）】を駆使し、過酷な弱肉強食の世界で仲間たちを率いて急速に進化・台頭していきます。',
        recommendReason: 'モンスター側の視点で群れを統率し、ゴブリンからホブゴブリン、オーガへと段階的に進化していく育成シミュレーションのような面白さが炸裂しています。日記形式でテンポよく進む成り上がり劇と、モンスターならではの容赦ないサバイバル感が刺激的です。'
      },
      {
        keyword: '転生ごときで逃げられるとでも、兄さん？',
        customTitle: '転生ごときで逃げられるとでも、兄さん？',
        synopsis: 'ヤンデレの妹に監禁・殺害された主人公。地獄から逃れるため異世界へ転生するものの、妹もまた異常な執念で異世界へと追跡してきて……！？人外や異形モンスターを巡る狂気とサスペンスが交錯する異色のダークファンタジー。',
        recommendReason: '常識外れの狂気と圧倒的スピード感で読者を惹きつける異色作です。一般的な異世界モノとは一線を画すスリリングな心理戦と予測不可能な展開に、ページをめくる手が止まらなくなります。'
      },
      {
        keyword: '転生したらドラゴンの卵だった',
        customTitle: '転生したらドラゴンの卵だった〜最強以外目指さねぇ〜',
        synopsis: '気がつくと見知らぬ森で「ドラゴンの卵」として転生していた主人公。殻を割って生まれた小竜の姿から、魔物を狩りまくって経験値を稼ぎ、ステータスを伸ばして凶悪なドラゴンへと多段階進化を目指すサバイバルファンタジー。',
        recommendReason: '「最初は最弱のトカゲ同然」から始まり、死線をくぐり抜けながら進化ツリーを選択していくワクワク感がたまりません。孤独なモンスター生活の中で出会う相棒たちとの絆や、人間社会との距離感の葛藤など、人外主人公ならではのドラマが熱いです。'
      },
      {
        keyword: '自動販売機に生まれ変わった俺は迷宮を彷徨う',
        customTitle: '自動販売機に生まれ変わった俺は迷宮を彷徨う',
        synopsis: '自販機マニアの男が、落ちてくる自販機から身を守ろうとして事故死。異世界の湖畔で「自動販売機（ハッコン）」として転生してしまいます。移動も会話もできず、「いらっしゃいませ」「ざんねん」の録音ボイスしか出せない中、怪力の少女ラッミスに背負われて迷宮探索へと同行することになります。',
        recommendReason: '一発ネタに見えて、自販機のラインナップ（缶飲料、カップ麺、缶詰、アイス、簡易カイロ、防犯ブザーなど）を極限まで工夫してモンスター討伐や迷宮サバイバルを支援するロジカルな面白さに脱帽します。ハッコンとラッミスの信頼関係も微笑ましい傑作です。'
      },
      {
        keyword: '名湯「異世界の湯」開拓記',
        customTitle: '名湯『異世界の湯』開拓記 〜アラフォー温泉マニアの転生先は、のんびり温泉天国でした〜',
        synopsis: '温泉が大好きな男が転生した先は、なんと「効能豊かな源泉そのもの」！湯の中に現れる美少女エルフやケモ耳少女たちに極上の湯浴みを提供しながら、源泉魔力で温泉街を発展させていくユニークな人外（無機物）転生譚。',
        recommendReason: '温泉としての効能で傷ついた旅人を癒やし、美味しい温泉卵や料理を振る舞うほのぼのとした空気感が魅力です。お色気と癒やしが程よくブレンドされた、肩の力を抜いて楽しめる快作です。'
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '転生したらスライムだった件',
        reason: '人外転生の代名詞。最弱スライムから始まり、多種族を包容して巨大国家を築き上げるスケール感と爽快感は圧倒的です。リムルの魅力的なリーダーシップと仲間たちの躍動感が最高峰の面白さを保証してくれます。'
      },
      {
        rank: 2,
        title: '蜘蛛ですが、なにか？',
        reason: '絶望的な地下迷宮での知恵比べサバイバルと、蜘蛛子の軽快なモノローグが織りなす極上のテンポ感。進化ツリーを駆け上がる達成感と、後半明かされる緻密な世界設定の伏線回収が見事です。'
      },
      {
        rank: 3,
        title: '転生したら剣でした',
        reason: '「剣の親父」と「黒猫族の少女」の師弟＆父娘バディ関係がとにかくエモーショナル。スピード感溢れる剣劇バトルと、フランが健気に成長していく姿にグッと引き込まれます。'
      }
    ]
  },
  {
    slug: 'territory-management-10',
    title: '領地経営・内政が面白すぎる領主系異世界ラノベ10選',
    metaTitle: '領主・内政系おすすめ異世界ラノベ10選！領地開拓・経済改革・軍略がアツい名作まとめ',
    description: '剣の腕や魔法だけでなく、現代知識・経済学・科学技術・農業改革でボロボロの領地を大繁栄へと導く！知略と組織づくりで民を救い、大国を動かす領地経営・内政系異世界ライトノベル10選を徹底特集します。',
    eyecatchBadge: '領地経営＆内政',
    items: [
      {
        keyword: '現実主義勇者の王国再建記',
        customTitle: '現実主義勇者の王国再建記',
        synopsis: '異世界のエルフリーデン王国に勇者として召喚された相馬一也。しかし彼が求められたのは魔王討伐ではなく、財政難と食糧危機に瀕した王国の再建でした。王位を譲られたソーマは、現代の行政学や経済知識、人材登用法を駆使して、腐敗した貴族の粛清、綿密なインフラ整備、食糧改革を断行していきます。',
        recommendReason: '「適材適所」をモットーに、武力だけでなく歌姫や経理の達人など様々な特技を持つ人材を集めて国を立て直すプロセスが知的に爽快です。隣国との外交戦や軍事衝突でも、徹底した兵站と謀略で被害を最小限に抑える現実主義な統治が痛快です。'
      },
      {
        keyword: '本好きの下剋上',
        customTitle: '本好きの下剋上 〜司書になるためには手段を選んでいられません〜',
        synopsis: '本をこよなく愛する女子大生が、中世風の異世界の病弱な平民少女マインとして転生。しかしその世界では本は貴族しか持てない超高級品でした。「本がないなら自分で作ればいい！」と決意したマインは、植物紙の開発からインク作り、印刷技術の確立まで、ゼロから産業を興して成り上がっていきます。',
        recommendReason: '圧倒的な解像度で描かれる中世貴族社会と平民の暮らし、そして紙作り・印刷事業が社会経済を塗り替えていく大河ドラマのような重厚感。マインの発明が周囲の大人たちや領主を巻き込み、一大産業へと発展していくカタルシスは他の追随を許しません。'
      },
      {
        keyword: '八男って、それはないでしょう！',
        customTitle: '八男って、それはないでしょう！',
        synopsis: 'しがないサラリーマンの一宮信吾が、貧乏貴族の八男・ヴェンデリン（5歳）として転生。領地も遺産も継げない絶望的な境遇の中、卓越した魔法の才能を開花させます。やがて自らの実力で未開地を開拓し、辺境伯として広大な領地を経営していくことになります。',
        recommendReason: '貴族社会の生々しいしがらみや相続争い、領地経営にかかる費用やトンネル掘削・治水工事などのインフラ開拓が細かく描写されているのが特徴です。魔法を使った大規模開墾と、貴族政治のリアルな駆け引きが楽しめます。'
      },
      {
        keyword: '理想のヒモ生活',
        customTitle: '理想のヒモ生活',
        synopsis: 'ブラック企業の会社員・山井善治郎が、異世界の女王アウラから「王配（女王の夫）になって子供を作ってほしい」とスカウトされて異世界へ。政治に口を出さない「ヒモ」としてのんびり暮らすはずが、王宮内の派閥抗争や貴族の陰謀を前に、現代社会で培った常識と気配りを武器に巧妙な政治的立ち回りを演じることになります。',
        recommendReason: '派手なバトルや無双チートを排し、宮廷政治、外交交渉、婚姻政策、税制改革などのリアルな権力闘争を緻密に描いた大人のための内政ファンタジーです。女王アウラとの成熟した夫婦愛も素晴らしく、じっくり読ませる傑作です。'
      },
      {
        keyword: '天才王子の赤字国家再生術',
        customTitle: '天才王子の赤字国家再生術〜そうだ、売国しよう〜',
        synopsis: '資源も兵力もない弱小国家ナトラ王国の若き王子ウェイン。「早く国を他国に高く売り払って悠々自適の隠居生活を送りたい！」と画策するものの、持ち前の卓越した頭脳と軍略が裏目に出て、大国を返り討ちにして領土を拡大させてしまい、どんどん名君として祭り上げられていきます。',
        recommendReason: '「売国したいのに大勝利してしまう」という極上のコメディ構造と、一歩間違えれば国が滅ぶギリギリの知略戦・舌戦の切れ味が抜群です。補佐官ニニムとの軽妙な掛け合いと、予想の上を行く逆転劇にスカッとさせられます。'
      },
      {
        keyword: '領民0人スタートの辺境領主様',
        customTitle: '領民0人スタートの辺境領主様〜青のディアスと蒼角の乙女〜',
        synopsis: '長年の戦争で英雄となったものの、権力争いに巻き込まれ領民が一人もいない不毛の荒野「オレルド領」を与えられたディアス。しかしそこで角を持つ美しき鬼族の娘セーラと出会い、彼女の部族と共にゼロから領地開拓をスタート。実直な人柄と圧倒的な武力で、過酷な荒野を豊かで平和な地へと育てていきます。',
        recommendReason: '主人公ディアスの嘘偽りのない誠実さと、鬼族たちとの心温まる信頼関係が素晴らしいです。荒野の水源確保や住居建設、凶悪な魔獣からの防衛など、開拓の泥臭さと確かな手応えが胸に響きます。'
      },
      {
        keyword: '宝くじで40億当たったんだけど異世界に移住する',
        customTitle: '宝くじで40億当たったんだけど異世界に移住する',
        synopsis: '宝くじで40億円を当てた志野一良は、実家の屋敷が飢饉に苦しむ異世界の貧村と繋がっているのを発見します。日本で買い込んだ肥料、農業機械、医薬品、資材を異世界へ持ち込み、領主の娘イステリアと共に大規模な農業改革とインフラ復興に乗り出します。',
        recommendReason: '「現代日本の豊富な物資と資金力を異世界に注ぎ込む」という豪快な支援型内政が爽快です。村人たちが技術を学び、荒野が見事な水田や作付け地に変わっていく復興のドラマに胸が熱くなります。'
      },
      {
        keyword: '魔王様の街づくり！',
        customTitle: '魔王様の街づくり！ 〜最強のダンジョンは近代都市〜',
        synopsis: '新たに生まれた「創造」の魔王プロケルが、古い慣習にとらわれた迷宮づくりを拒否し、銃火器を装備した魔物たちと共に人間と魔物が共存する近代都市ダンジョン「アヴァロン」を建設。観光、商業、カジノ、安全な居住区を提供し、世界中の人々を魅了していきます。',
        recommendReason: 'ダンジョンマスター×近代都市経営というハイブリッドな発想が秀逸です。魔物たちの特性を活かした街づくりと、攻め込んできた敵対魔王の軍勢を近代兵器で迎撃するタワーディフェンス的な防衛戦の面白さが両立しています。'
      },
      {
        keyword: '異世界建国記',
        customTitle: '異世界建国記',
        synopsis: '転生した主人公アルムスが、捨て子たちが暮らす貧しい集落の長となり、輪作農業（ノーフォーク農法）や製鉄技術を導入して村を開拓。周辺部族との同盟や戦争を勝ち抜き、一歩ずつ領地を拡大して一大帝国を建国していく本格歴史ファンタジー。',
        recommendReason: '古代・中世の農業史や軍事史に忠実な、極めて骨太で地に足のついた建国記です。泥臭い開墾から始まり、徐々に勢力を伸ばして法制度や軍制を整えていく大河ロマンの醍醐味を存分に堪能できます。'
      },
      {
        keyword: 'お前のご奉仕はその程度か？',
        customTitle: 'お前のご奉仕はその程度か？',
        synopsis: '名門貴族の跡取り息子として領地を任された主人公が、悪友やメイドたちと共に領内の産業振興と治安維持に奮闘。ユーモラスなラブコメディの裏で、着実に領民の生活水準を向上させていく領主系快作。',
        recommendReason: 'ライトなノリでサクサク読めつつも、領地経営の勘所をしっかり押さえた構成が魅力です。魅力的なヒロインたちとの賑やかなやり取りを楽しみながら、領地が発展していく満足感を味わえます。'
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '本好きの下剋上 〜司書になるためには手段を選んでいられません〜',
        reason: '紙作りという一点から始まり、印刷業、出版業、そして国全体の教育・魔力行政改革へと繋がっていく内政描写の緻密さは世界一。登場人物たちの心理描写や社会構造のリアルさが群を抜いて素晴らしいです。'
      },
      {
        rank: 2,
        title: '現実主義勇者の王国再建記',
        reason: '「魔王を倒すことだけが勇者の役目ではない」という命題のもと、経済、食糧、人事、外交をロジカルに解決していく王政復古ドラマが極めて爽快。内政好きなら必読の金字塔です。'
      },
      {
        rank: 3,
        title: '天才王子の赤字国家再生術〜そうだ、売国しよう〜',
        reason: '怠けたい本音と天才的な軍略・内政手腕のギャップが生み出す怒涛のどんでん返しが最高に気持ちいい！テンポの良さと緻密な外交戦が両立したエンタメ内政の最高峰です。'
      }
    ]
  },
  {
    slug: 'cheat-musou-10',
    title: '圧倒的爽快感！チート＆最強主人公ラノベ10選',
    metaTitle: 'チート＆最強主人公おすすめ異世界ラノベ10選！規格外の強さで無双する爽快傑作まとめ',
    description: '理不尽な敵も強大な魔王も一撃粉砕！ストレスフリーで読める圧倒的なチート能力、隠された規格外の実力、爽快なバトルアクションが炸裂する最強主人公系ライトノベル10選を徹底レビューします。',
    eyecatchBadge: '無双＆チート',
    items: [
      {
        keyword: '陰の実力者になりたくて！',
        customTitle: '陰の実力者になりたくて！',
        synopsis: '「主人公でもラスボスでもなく、普段は目立たないが裏で圧倒的な実力を振るう陰の実力者」に憧れるシド・カゲノー。異世界転生後、自作の「闇の教団」設定をもとにノリで配下（シャドウガーデン）を従えて陰の活躍をエンジョイしていたところ、なぜか彼の中二病妄想がすべて本物の世界の真実だったことが判明し……！？',
        recommendReason: '勘違いコメディとシリアスな圧倒的無双バトルの融合が神がかり的な面白さ！本人は単なるごっこ遊びのつもりなのに、放つ一撃「アイ・アム・アトミック」で都市規模の敵を消滅させる規格外の強さとスタイリッシュさに痺れます。'
      },
      {
        keyword: '無職転生 〜異世界行ったら本気だす〜',
        customTitle: '無職転生 〜異世界行ったら本気だす〜',
        synopsis: '前世の後悔を胸に、赤ん坊からやり直すルーデウス。膨大な魔力量と無詠唱魔術の習得により若くして圧倒的な実力を身につけます。最強の剣士や神クラスの猛者たちが跋扈する過酷な世界で、大切な家族や仲間を守るために全力を尽くして戦い抜く人生やり直し大河ファンタジー。',
        recommendReason: '単なるイージーな俺TUEEEにとどまらず、主人公が己の弱さと向き合いながら世界の頂点クラスの戦いに挑んでいくドラマが圧倒的。魔法の理論体系やバトルの緊張感、家族の絆など、すべての要素が一級品の完成度を誇ります。'
      },
      {
        keyword: '月が導く異世界道中',
        customTitle: '月が導く異世界道中',
        synopsis: '異世界へ召喚された深澄真（まこと）。しかし美醜至上主義の女神から「顔が不細工」という理不尽な理由で世界の果ての荒野へ放り出されてしまいます。しかし、人界の常識を遥かに超越した莫大な魔力と神話級の従魔（上位竜の巴、大蜘蛛の澪）を従え、亜人たちの街を拓きながら理不尽な世界を圧倒していきます。',
        recommendReason: '女神から見捨てられた主人公が、規格外の魔力と弓の技で神に匹敵する力を振るうカタルシスが最高です。商人としての経済活動と、敵対する傲慢な勇者や軍勢を一瞬でねじ伏せる圧倒的武力のギャップにスカッとします。'
      },
      {
        keyword: '魔王学院の不適合者',
        customTitle: '魔王学院の不適合者 〜史上最強の魔王の始祖、転生して子孫たちの学校へ通う〜',
        synopsis: '平和を願い自ら命を絶った暴虐の魔王アノス・ヴォルディゴードが、2000年後に転生。しかし平和ボケした子孫たちの魔王学院では、彼の桁外れの力が測定不能で「不適合者」の烙印を押されてしまいます。理不尽な差別や陰謀を「殺したくらいで、俺が死ぬとでも思ったか？」と常識外れの絶対的強さで叩き潰していきます。',
        recommendReason: '主人公アノスの圧倒的すぎる強さとブレない器の大きさがとにかく気持ちいい！どんな絶望的な状況や世界の理（ことわり）すらも自らの力でねじ曲げて解決してしまう問答無用の爽快感は、ストレス解消にこれ以上ない傑作です。'
      },
      {
        keyword: 'ありふれた職業で世界最強',
        customTitle: 'ありふれた職業で世界最強',
        synopsis: 'クラスメイトと共に異世界召喚された南雲ハジメ。最弱の非戦闘系職業「錬成師」だった彼は、同級生の悪意によって大迷宮の奈落の底へ突き落とされてしまいます。絶望と死の淵で生き残る覚悟を決めたハジメは、魔物の肉を喰らい、錬成で近代火器を創り出して深淵から世界最強へと駆け上がります。',
        recommendReason: '裏切りから始まるダークな復讐と、奈落の底から這い上がってきた圧倒的強者の佇まいが男心をくすぐります。リボルバーやレールガン、パイルバンカーなど近代兵器を駆使したド派手なバトルアクションは爽快感抜群です。'
      },
      {
        keyword: '即死チートが最強すぎて',
        customTitle: '即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。',
        synopsis: '修学旅行のバスごと異世界へ召喚され、無能と判断されてドラゴンが迫るバスに置き去りにされた高遠夜霧。しかし彼の能力は「意図した対象を無条件で即死させる」という世界の法則を超越した絶対即死能力でした。どんな不死身も神もアンデッドも、害意を向けた瞬間に死に至らしめる理不尽無双コメディ。',
        recommendReason: '「どんなチート能力や防御結界も、死ぬんだから関係ない」という究極のシンプルさが爆笑と爽快感を生んでいます。主人公を舐めてかかってきた悪党や慢心した勇者たちが次々と一瞬で自滅していく様は痛快そのものです。'
      },
      {
        keyword: 'デスマーチからはじまる異世界狂想曲',
        customTitle: 'デスマーチからはじまる異世界狂想曲',
        synopsis: 'デスマーチ真っ最中のプログラマー・サトゥー（29歳）が、仮眠から目覚めると見知らぬ荒野に。マップチェック用に実装した初心者救済魔法「流星雨」を3発ぶっ放したところ、マップ全域の神話級モンスターと竜神が全滅し、一気にレベル310のカンスト大富豪になってしまいます。',
        recommendReason: '規格外すぎる神級の強さを持ちながら、本人はあくまで「異世界観光とグルメと仲間たちとののんびり旅」を満喫しようとするスタンスが心地よいです。いざトラブルが起きれば裏で一瞬で解決する頼もしさも魅力です。'
      },
      {
        keyword: 'リアデイルの大地にて',
        customTitle: 'リアデイルの大地にて',
        synopsis: '生命維持装置の停止で命を落とした少女・各務桂菜。彼女が目覚めたのは、自身がやり込んでいたVRMMO「リアデイル」の200年後の世界でした。アバターであるハイエルフ「ケーナ」として、限界突破したスキルと限界値超えの魔力を携え、かつて自分が作成したNPCの子供たちと再会しながら自由な旅を楽しみます。',
        recommendReason: 'のんびりしたお散歩気分と、いざ戦えば伝説の「スキルマスター第3号」として周囲を絶句させる圧倒的無双のバランスが絶妙です。ハイエルフの母として子供たちに接する温かい家族模様も癒やされます。'
      },
      {
        keyword: '精霊幻想記',
        customTitle: '精霊幻想記',
        synopsis: 'スラム街で生きる孤児の少年リオ。ある日突然、前世の日本人大学生「天川春人」の記憶と莫大な魔力が覚醒します。王族救出の功績で名門学園に入学するも、身分差別や理不尽な冤罪に巻き込まれ国を出奔。精霊術と卓越した体術を極め、大切な人々を守るため世界を股にかけた戦いに挑みます。',
        recommendReason: '理不尽な迫害や陰謀に屈せず、圧倒的な精霊術で敵を圧倒していくリオの気高き強さが胸を打ちます。ヒロインたちとの再会や絆、そして復讐と救済が交錯するドラマチックなストーリー展開が熱いです。'
      },
      {
        keyword: '異世界魔王と召喚少女の奴隷魔術',
        customTitle: '異世界魔王と召喚少女の奴隷魔術',
        synopsis: 'MMORPGで「魔王」として恐れられていた坂本拓真。ある日ゲーム内の姿のまま異世界へ召喚され、2人の美少女から奴隷化の儀式を受けます。しかし彼の固有装備「魔術反射」が発動し、逆に少女たちが奴隷に！コミュニケーション下手な拓真は、ゲームの魔王RP（ロールプレイ）を演じながら、圧倒的な火力で敵を蹂躙していきます。',
        recommendReason: '内心はビビリでコミュ障なのに、口を開けば傲慢不敵な魔王ボイスになってしまう主人公の愛嬌と、本物の魔王顔負けの超火力魔法で敵を消し去る爽快感が抜群のエンタメ作品です。'
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '陰の実力者になりたくて！',
        reason: '圧倒的なスタイリッシュさと、大爆笑の勘違いコメディが完璧に融合した現代無双ラノベの最高到達点。「アイ・アム・アトミック」の爽快感は一度味わうと病みつきになります。'
      },
      {
        rank: 2,
        title: '魔王学院の不適合者 〜史上最強の魔王の始祖、転生して子孫たちの学校へ通う〜',
        reason: '「理不尽を理不尽な強さでねじ伏せる」最強主人公の美学が極まっています。アノスの圧倒的な器の大きさと名言の数々にスカッとすること間違いなしです。'
      },
      {
        rank: 3,
        title: '無職転生 〜異世界行ったら本気だす〜',
        reason: 'ただ強いだけでなく、人間としての成長や苦難を乗り越えて強大な敵と戦う大河ロマン。重厚な世界観と熱いバトルの迫力において並ぶもののない傑作です。'
      }
    ]
  }
]

export async function buildFeaturePages() {
  console.log('--- 特集記事（10選シリーズ）の直接楽天API取得＆HTML生成を開始 ---')

  const jsonPath = path.join(root, 'public/data/curated-features.json')
  const targetFeatures = JSON.parse(await fs.readFile(jsonPath, 'utf8'))
  const resolvedFeatures = []

  for (const feature of targetFeatures) {
    console.log(`\n【特集処理中】: ${feature.title}`)
    const resolvedItems = []

    for (const item of feature.items) {
      console.log(`  -> 楽天API直接取得: ${item.keyword}`)
      let rakutenData = null
      try {
        rakutenData = await fetchRakutenBookDirect(item.keyword)
      } catch (e) {
        console.warn(`  [API Warning] ${e.message}`)
      }

      const existingResolved = (feature.resolvedItems || []).find(r => r.keyword === item.keyword)

      const cover = rakutenData?.largeImageUrl || rakutenData?.mediumImageUrl || existingResolved?.cover || ''
      const itemUrl = rakutenData?.itemUrl || existingResolved?.itemUrl || ''
      const affiliateUrl = itemUrl ? buildAffiliateUrl(itemUrl, process.env.RAKUTEN_AFFILIATE_ID || '54d2a438.4bc4abc2.54d2a439.aa1be583') : (existingResolved?.affiliateUrl || '')
      const author = rakutenData?.author || rakutenData?.authorKana || existingResolved?.author || '著者情報あり'
      const price = rakutenData?.itemPrice || rakutenData?.price || existingResolved?.price || 0
      const salesDate = rakutenData?.salesDate || existingResolved?.salesDate || ''

      resolvedItems.push({
        ...item,
        rakutenTitle: rakutenData?.title || rakutenData?.itemName || existingResolved?.rakutenTitle || item.customTitle,
        cover,
        itemUrl,
        affiliateUrl,
        author,
        price,
        salesDate
      })
    }

    resolvedFeatures.push({
      ...feature,
      resolvedItems
    })
  }

  // 1. 特集ハブページ (/features/index.html) の生成
  const hubCardsHtml = resolvedFeatures.map(f => `
    <div class="feature-hub-card">
      <span class="feature-hub-badge">${escapeXml(f.eyecatchBadge || 'おすすめ10選')}</span>
      <h2 class="feature-hub-title"><a href="/features/${f.slug}/">${escapeXml(f.title)}</a></h2>
      <p class="feature-hub-desc">${escapeXml(f.description)}</p>
      <a class="feature-hub-btn" href="/features/${f.slug}/">特集記事を読む（10作品解説） →</a>
    </div>
  `).join('')

  const hubHtml = `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>異世界ラノベおすすめ特集一覧｜異世界コンパス</title>
<meta name="description" content="スローライフ、人外転生、領地経営・内政、チート・無双など、人気テーマ別に厳選した異世界ライトノベル10選特集記事一覧です。">
<link rel="canonical" href="${siteUrl}/features/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>${commonStyle}</style>
${commonGaHead}
</head>
<body>
${renderHeader('/features/')}
<main>
  <div class="crumb"><a href="/">トップ</a>　/　特集一覧</div>
  <div class="eyebrow">CURATED SPECIAL FEATURES</div>
  <h1>異世界ラノベ おすすめ特化テーマ特集</h1>
  <p class="lead">スローライフ、人外転生、内政・領地経営、チート無双など、読者の「今読みたい気分」に合わせて厳選した異世界ラノベ10選特集です。全作品のあらすじ、読者目線レビュー、管理人の私的ランキングをお届けします。</p>

  <div class="features-grid">
    ${hubCardsHtml}
  </div>
</main>
${renderFooter()}
</body>
</html>`

  await fs.mkdir(path.join(root, 'public/features'), { recursive: true })
  await fs.writeFile(path.join(root, 'public/features/index.html'), hubHtml)

  // 2. 個別特集記事ページ (/features/{slug}/index.html) の生成
  for (const f of resolvedFeatures) {
    const dir = path.join(root, 'public/features', f.slug)
    await fs.mkdir(dir, { recursive: true })

    const tocHtml = f.resolvedItems.map((item, idx) => `
      <li><a href="#work-${idx + 1}">${idx + 1}. ${escapeXml(item.customTitle)}</a></li>
    `).join('')

    const itemsHtml = f.resolvedItems.map((item, idx) => `
      <section class="feature-item-section" id="work-${idx + 1}">
        <h2 class="feature-work-title">
          <span class="work-rank-num">${idx + 1}.</span>
          <span>${escapeXml(item.customTitle)}</span>
        </h2>
        
        <div class="work-hero">
          <div class="work-cover-wrap">
            <img src="${escapeXml(item.cover)}" alt="${escapeXml(item.customTitle)} 表紙画像" loading="lazy" width="150" height="210" />
          </div>
          <div class="work-meta">
            <ul class="work-meta-list">
              <li><strong>著者 / イラスト：</strong> ${escapeXml(item.author)}</li>
              ${item.salesDate ? `<li><strong>発売日：</strong> ${escapeXml(item.salesDate)}</li>` : ''}
              ${item.price ? `<li><strong>参考価格：</strong> ¥${item.price.toLocaleString()}</li>` : ''}
              <li><strong>配信ストア：</strong> 楽天Kobo 電子書籍</li>
            </ul>
            <div>
              <a class="rakuten-btn" href="${escapeXml(item.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">
                <span>楽天Koboで読む・詳細を見る ↗</span>
              </a>
            </div>
          </div>
        </div>

        <div class="feature-content-box">
          <h3>簡単なあらすじ</h3>
          <p>${escapeXml(item.synopsis)}</p>

          <h3>オススメな理由（読者目線レビュー）</h3>
          <p>${escapeXml(item.recommendReason)}</p>
        </div>
      </section>
    `).join('')

    const getRankClass = (rank) => rank === 1 ? 'gold' : rank === 2 ? 'silver' : 'bronze'
    const rankingCardsHtml = f.ranking.map(r => `
      <div class="ranking-item-card ${getRankClass(r.rank)}">
        <h3>
          <span class="ranking-badge ${getRankClass(r.rank)}">第${r.rank}位</span>
          <span>${escapeXml(r.title)}</span>
        </h3>
        <p>${escapeXml(r.reason)}</p>
      </div>
    `).join('')

    const articleJsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: f.title,
      description: f.description,
      mainEntityOfPage: `${siteUrl}/features/${f.slug}/`,
      publisher: {
        '@type': 'Organization',
        name: '異世界コンパス'
      }
    })

    const pageHtml = `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeXml(f.metaTitle || f.title)}｜異世界コンパス</title>
<meta name="description" content="${escapeXml(f.description)}">
<link rel="canonical" href="${siteUrl}/features/${f.slug}/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="${escapeXml(f.title)}">
<meta property="og:description" content="${escapeXml(f.description)}">
<meta property="og:type" content="article">
<script type="application/ld+json">${articleJsonLd}</script>
<style>${commonStyle}</style>
${commonGaHead}
</head>
<body>
${renderHeader('/features/')}
<main>
  <div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　特集詳細</div>
  <div class="eyebrow">${escapeXml(f.eyecatchBadge || 'SPECIAL FEATURE 10 SELECTION')}</div>
  <h1>${escapeXml(f.title)}</h1>
  <div class="lead">${escapeXml(f.description)}</div>

  <div class="toc-box">
    <div class="toc-title">✦ この記事で紹介する10作品＆目次</div>
    <ul class="toc-list">
      ${tocHtml}
      <li><a href="#ranking" style="font-weight:bold;color:#8b672d;">★ 管理人の私的ランキングTOP3</a></li>
    </ul>
  </div>

  <div class="feature-articles-body">
    ${itemsHtml}
  </div>

  <section class="ranking-section" id="ranking">
    <h2 class="ranking-main-title">管理人の私的ランキング</h2>
    <p class="ranking-intro">今回ご紹介した珠玉の10作品の中から、管理人が特に「まずはここから読んでほしい！」と熱烈におすすめしたいTOP3を私的ランキングとして選定しました。</p>
    
    <div class="ranking-cards">
      ${rankingCardsHtml}
    </div>
  </section>

  <div style="margin-top:40px; text-align:center;">
    <a href="/features/" class="card-btn" style="display:inline-block;padding:12px 24px;font-size:15px;background:#17221f;color:#fff;border-radius:6px;">← おすすめ特集一覧へ戻る</a>
  </div>
</main>
${renderFooter()}
</body>
</html>`

    await fs.writeFile(path.join(dir, 'index.html'), pageHtml)
    console.log(`  [Done] 特集記事ページ出力: public/features/${f.slug}/index.html`)
  }

  // JSONとしても保存
  const outJson = path.join(root, 'public/data/curated-features.json')
  await fs.writeFile(outJson, JSON.stringify(resolvedFeatures, null, 2))
  console.log(`\n全特集記事（10選）の生成が完了しました！`)
  return resolvedFeatures
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await buildFeaturePages()
}
