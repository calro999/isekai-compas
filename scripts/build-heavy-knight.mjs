import fs from 'node:fs/promises'
import path from 'node:path'

async function addHeavyKnightFeature() {
  const koboData = JSON.parse(await fs.readFile('kobo_data.json', 'utf8'))
  const affiliateId = '54d2a438.4bc4abc2.54d2a439.aa1be583'
  const siteUrl = 'https://isekai-compas.vercel.app'

  const buildAff = (url) => `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(url)}&m=${encodeURIComponent(url)}`

  const novelCardsHtml = koboData.novels.map(n => `
    <article class="feature-item-card" id="novel-vol-${n.vol}">
      <div class="feature-item-grid">
        <div class="feature-item-cover-col">
          <a href="${buildAff(n.url)}" rel="sponsored nofollow noopener" target="_blank">
            <img src="${n.img}" alt="${n.title}の表紙" class="feature-item-cover" loading="lazy">
          </a>
          <div class="feature-price-badge">¥${n.price.toLocaleString()}（税込）</div>
          <a href="${buildAff(n.url)}" class="feature-buy-btn" rel="sponsored nofollow noopener" target="_blank">楽天Koboで購入・試し読み ↗</a>
        </div>
        <div class="feature-item-content-col">
          <div class="feature-vol-tag">原作小説 第${n.vol}巻</div>
          <h3 class="feature-item-title"><a href="${buildAff(n.url)}" target="_blank" rel="sponsored nofollow noopener">${n.title}</a></h3>
          <div class="feature-item-meta">著者: 猫子 ｜ 発売日: ${n.date}</div>
          <div class="feature-lead-box">
            ${n.caption}
          </div>
          <div class="feature-review-box">
            <div class="review-badge">✦ 管理人の魂のレビュー</div>
            <p>${
              n.vol === 1 ? '代々〈剣聖〉を輩出する名門から追放される導入ですが、エルマは絶望するどころか「重騎士キター！！」と内心大歓喜！ このスピード感とブレないゲーマー魂が最高。世間の偏見を逆手に取り、最低限の装備から初期スキルツリーを無駄なく最短ルートで解放していく育成のワクワク感は1巻にして完成されています！' :
              n.vol === 2 ? '舞台は腕利き冒険者が集う聖地ラコリナへ。2巻の見どころは何と言っても「ハクスラ（アイテム収集＆強化）の楽しさ」が極まっている点！ ダンジョン固有のドロップアイテムの相場や使い道を熟知したエルマが、ルーチェの豪運をフル活用して資産と装備を爆発的に増やしていく様は痛快そのものです！' :
              n.vol === 3 ? '突如現れた限定ダンジョン〈幻獣の塔〉での激闘を描く第3巻！ ハウルロッド侯爵家の天才剣士スノウたちとの共闘を通じて、エルマの指揮官としての才覚が炸裂します。強烈なボスギミックに対して「どのタイミングでどのバフを重ねるか」というギリギリの駆け引きが熱すぎます！' :
              n.vol === 4 ? '物語の裏に潜む悪意ある組織との対決が本格化！ 対モンスター戦だけでなく「対人特化ビルドの強敵」とどう渡り合うかという戦術の深みが増します。さらに重騎士の性能を異次元に引き上げる防具を作るため、凄腕の錬金術師と接触するクラフト展開も男心をくすぐりまくりです！' :
              '激闘を越えて準A級冒険者となったエルマが挑むのは、国中の猛者が集う「大討伐」。戦力増強のために挑む契約獣テイムでは、予想の斜め上を行く伝説級の存在が登場！ かつて自分を追放した生家エドヴァン伯爵家との因縁も絡み合い、シリーズ屈指のボルテージを誇る必読巻です！'
            }</p>
          </div>
        </div>
      </div>
    </article>
  `).join('')

  const mangaCardsHtml = koboData.manga.map(m => `
    <article class="feature-item-card" id="manga-vol-${m.vol}">
      <div class="feature-item-grid">
        <div class="feature-item-cover-col">
          <a href="${buildAff(m.url)}" rel="sponsored nofollow noopener" target="_blank">
            <img src="${m.img}" alt="${m.title}の表紙" class="feature-item-cover" loading="lazy">
          </a>
          <div class="feature-price-badge">¥${m.price.toLocaleString()}（税込）</div>
          <a href="${buildAff(m.url)}" class="feature-buy-btn" rel="sponsored nofollow noopener" target="_blank">楽天Koboで購入・試し読み ↗</a>
        </div>
        <div class="feature-item-content-col">
          <div class="feature-vol-tag">コミカライズ（漫画） 第${m.vol}巻</div>
          <h3 class="feature-item-title"><a href="${buildAff(m.url)}" target="_blank" rel="sponsored nofollow noopener">${m.title}</a></h3>
          <div class="feature-item-meta">著者: 猫子 / 武六甲理衣 / じゃいあん ｜ 発売日: ${m.date}</div>
          <div class="feature-lead-box">
            ${m.caption}
          </div>
          <div class="feature-review-box">
            <div class="review-badge">✦ 管理人の魂のレビュー</div>
            <p>${
              m.vol === 1 ? '武六甲理衣先生の作画クオリティが第1話から大爆発！ 追放されたエルマが初期ダンジョンで重騎士の仕様を突いて無双する姿は痛快無比。表情豊かなキャラクターと重みのあるアクション描写に一瞬で引き込まれます！' :
              m.vol === 2 ? 'ヒロイン・ルーチェの可愛さと表情の豊かさがとにかく最高！ 誰も見向きもしない〈豪運〉の価値を見抜き、二人三脚で一攫千金を目指すダンジョンハックはゲーム好きならニヤニヤが止まりません！' :
              m.vol === 3 ? 'ボス戦決着からの、実家のエリート〈剣聖〉マリスとの対峙！ 圧倒的なステータス差を「スキルの発動フレーム」「パリィとカウンター」で完璧にいなして制圧するバトル構成に痺れます！' :
              m.vol === 4 ? 'ついに重騎士の真骨頂「死線の暴竜」が解禁！ 自らのHPを削って火力を爆上げする超リスク・超リターンの背水アタック。大ゴブリンを一撃粉砕する見開きシーンの迫力は鳥肌モノです！' :
              m.vol === 5 ? 'ダンジョンボスを倒した瞬間に起きる絶望の「存在進化」！ 攻撃範囲も威力も跳ね上がった怪物に対し、ミスリル装備と研ぎ澄まされた集中力で挑む極限バトルが描かれます！' :
              m.vol === 6 ? '僧侶メアベルと狩人ケルトが加入し、待望の4人フルパーティ結成！ 役割分担（ロール）が明確になったことで、戦術の奥深さが一気に跳ね上がります。魔剣士との因縁の決闘も見逃せません！' :
              m.vol === 7 ? '本来勝てるはずのない理不尽ボスとの遭遇戦！ 全員が持てるスキルの1秒の遅れすら許されない状況で、エルマの的確な指示とメンバーの信頼が奇跡を起こす名エピソードです！' :
              m.vol === 8 ? '5500万G級の神装備を手に入れ、防御力が別次元へ！ ルーチェの攻撃性能を極限まで高める〈死神の凶手〉を狙う狩りパートは、ハクスラ好きゲーマーのドーパミンがドバドバ出ます！' :
              m.vol === 9 ? 'スノウの華麗な剣技と、空を飛ぶボスの行動を先読みして地上に叩き落とすエルマの戦術が見事にシンクロ！ ヒーラー不在の背水状況での立ち回りは手に汗握る面白さです！' :
              m.vol === 10 ? '冒険者狩りを続ける黒幕を炙り出すサスペンスフルな展開！ 仲間たちとの連携も一段と成熟し、大規模依頼の緊迫した空気感がリアルに伝わってきます！' :
              m.vol === 11 ? '水中フィールドならではの立体的な戦闘描写が圧巻！ モンスター討伐と並行して進む「裏切り者との頭脳戦」の緊迫感にページをめくる手が止まりません！' :
              m.vol === 12 ? '凶悪ビルドを組んだA級魔剣士カロスとの頂上決戦！ 相手のコンボを破るためにエルマたちが繰り出す「カウンター戦術の美しさ」はシリーズ屈指の名勝負です！' :
              m.vol === 13 ? '新たな防具を手に入れるためのクラフト探索編！ クラン〈魔銀の笛〉との共闘を通して描かれる交易路の大規模間引き作戦はスケール感抜群です！' :
              m.vol === 14 ? 'ゲーム知識にない未知の変異種が登場！ 圧倒的な物量で押し寄せる虫の軍勢に対し、即席パーティで挑む防衛＆突破戦は息をつかせぬ大迫力！' :
              m.vol === 15 ? '昇級試験でまさかの最凶裏ボスとエンカウント！ ゲームプレイヤーなら誰もがトラウマになるような鬼畜ギミックの数々に、エルマがどう立ち向かうのか大注目です！' :
              m.vol === 16 ? '近接攻撃が一切通じない理不尽に対し、エルマが下した捨て身の大博打！ 仲間たちの支援とエルマの覚悟が交差するクライマックスの破壊力は涙腺崩壊モノです！' :
              m.vol === 17 ? '攻撃がかすりもしない回避特化の狩人ダーレンとの死闘！ レベル差と猛毒に蝕まれる極限状態の中、エルマが仕掛ける「回避の裏を突く戦術」が鳥肌モノのカッコよさ！' :
              'ついに準A級へと昇り詰めたエルマたち！ 次なる大討伐に向けた新たな相棒「契約獣」との共闘バトルは熱量MAX！ 1巻から積み重ねてきた成長の集大成がここにあります！'
            }</p>
          </div>
        </div>
      </div>
    </article>
  `).join('')

  const pageHtml = `<!doctype html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>【激推し】『追放された転生重騎士はゲーム知識で無双する』全巻徹底解説！1巻〜最新刊のあらすじ・魅力・全巻購入ガイド｜異世界コンパス</title>
<meta name="description" content="当サイト管理人一押し！『追放された転生重騎士はゲーム知識で無双する』の原作小説1〜最新5巻、コミカライズ1〜最新18巻をネタバレなしで徹底レビュー。楽天Kobo公式APIによる最新の書影画像と試し読み・購入リンクを全巻網羅！">
<link rel="canonical" href="${siteUrl}/features/tsuihou-jyuukishi-complete-guide/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:title" content="【激推し】『追放された転生重騎士はゲーム知識で無双する』全巻徹底解説！">
<meta property="og:description" content="当サイト管理人一押し！『追放された転生重騎士はゲーム知識で無双する』の原作小説＆コミック全巻を徹底レビュー。">
<meta property="og:image" content="https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/0392/2000011200392.jpg?_ex=200x200">
<meta property="og:type" content="article">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "【激推し】『追放された転生重騎士はゲーム知識で無双する』全巻徹底解説！1巻〜最新刊のあらすじ・魅力・全巻購入ガイド",
  "description": "『追放された転生重騎士はゲーム知識で無双する』の原作小説・コミカライズ全巻レビューと楽天Kobo試し読み購入ガイド",
  "mainEntityOfPage": "${siteUrl}/features/tsuihou-jyuukishi-complete-guide/",
  "publisher": {
    "@type": "Organization",
    "name": "異世界コンパス"
  }
}
</script>
<style>
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
  .main-nav { display: flex; gap: 16px; align-items: center; }
  .main-nav a { color: #cfd8d3; font-size: 14px; font-weight: 500; }
  .main-nav a:hover { color: #fff; }
  main { padding: 40px 20px 80px; max-width: 1080px; margin: 0 auto; }
  .crumb { font-size: 13px; margin-bottom: 24px; color: var(--text-muted); }
  .eyebrow { font-size: 12px; letter-spacing: 0.18em; color: #d6a24a; font-weight: bold; }
  h1 { font-family: serif; font-size: 30px; margin: 8px 0 20px; line-height: 1.4; color: #17221f; }
  .lead { font-size: 16px; color: #2c3831; margin-bottom: 36px; line-height: 1.9; background: #fff; padding: 24px; border-radius: 8px; border-left: 5px solid #d6a24a; box-shadow: 0 2px 10px rgba(0,0,0,0.04); }
  
  .reason-box { background: #fff; border: 1px solid var(--border-color); border-radius: 8px; padding: 24px; margin: 24px 0; }
  .reason-box h3 { margin-top: 0; color: #8b672d; font-size: 18px; display: flex; align-items: center; gap: 8px; }
  
  .section-title { font-family: serif; font-size: 24px; margin: 48px 0 20px; padding-bottom: 10px; border-bottom: 3px solid #17221f; display: flex; align-items: center; justify-content: space-between; }
  .section-subtitle { font-size: 14px; color: var(--text-muted); font-weight: normal; }

  .feature-item-card { background: #fff; border: 1px solid var(--border-color); border-radius: 10px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 14px rgba(0,0,0,0.04); }
  .feature-item-grid { display: grid; grid-template-columns: 180px 1fr; gap: 24px; }
  .feature-item-cover-col { display: flex; flex-direction: column; align-items: center; }
  .feature-item-cover { width: 160px; height: 230px; object-fit: cover; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.12); }
  .feature-price-badge { font-size: 13px; font-weight: bold; color: #17221f; margin: 10px 0 6px; }
  .feature-buy-btn { display: block; width: 100%; text-align: center; background: #17221f; color: #fff; padding: 10px 12px; border-radius: 6px; font-size: 12px; font-weight: bold; transition: background 0.2s; }
  .feature-buy-btn:hover { background: #d6a24a; color: #17221f; text-decoration: none; }

  .feature-vol-tag { font-size: 11px; background: #e8ece7; color: #3d4a42; display: inline-block; padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-bottom: 6px; }
  .feature-item-title { margin: 0 0 8px; font-size: 20px; font-weight: bold; line-height: 1.4; }
  .feature-item-title a { color: #17221f; }
  .feature-item-meta { font-size: 13px; color: var(--text-muted); margin-bottom: 14px; }
  .feature-lead-box { background: #f8faf7; padding: 14px 16px; border-radius: 6px; font-size: 14px; line-height: 1.8; color: #3a473f; margin-bottom: 14px; border: 1px solid #e2e8de; white-space: pre-wrap; }
  .feature-review-box { background: #fdfbf7; border-left: 4px solid #d6a24a; padding: 14px 16px; border-radius: 0 6px 6px 0; font-size: 14px; line-height: 1.8; color: #2c3831; }
  .review-badge { font-size: 12px; font-weight: bold; color: #8b672d; margin-bottom: 4px; }
  .feature-review-box p { margin: 0; }

  .site-footer { background: #17221f; color: #a3b0a8; padding: 40px 20px; margin-top: 60px; font-size: 14px; text-align: center; }

  @media (max-width: 650px) {
    .feature-item-grid { grid-template-columns: 1fr; }
    .feature-item-cover-col { flex-direction: row; gap: 16px; align-items: flex-start; margin-bottom: 12px; }
    .feature-item-cover { width: 110px; height: 160px; }
  }
</style>
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a class="brand" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス</span></a>
    <nav class="main-nav">
      <a href="/features/">特集</a>
      <a href="/works/">作品を探す</a>
      <a href="/new/">新刊</a>
      <a href="/tags/">タグ</a>
    </nav>
  </div>
</header>

<main>
  <div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　追放された転生重騎士はゲーム知識で無双する 特集</div>
  <div class="eyebrow">EDITOR'S SPECIAL PICK & REVIEW</div>
  <h1>【激推し】『追放された転生重騎士はゲーム知識で無双する』全巻徹底解説！</h1>
  <div class="lead">
    <strong>「ハズレ職？ 冗談言っちゃいけない、これは前世の廃人が辿り着いた『最強のぶっ壊れロジック』だ！！」</strong><br><br>
    数ある追放系・転生ファンタジーの中でも、<b>ここまで「ゲーム攻略の面白さ」と「ビルド構築の美しさ」を極限まで描ききった作品は他にありません。</b><br>
    当サイト管理人が今もっとも魂を震わせ、既刊を何周も読み返している最推し作品！ TVアニメも神作画＆美麗エフェクトで大絶賛放送中。原作小説（全5巻）＆コミカライズ（全18巻）の熱すぎる見どころをネタバレなしで全力レビューします！
  </div>

  <h2 class="section-title">⚡ 管理人が語る！この作品が他の追放モノと次元が違う4つの理由</h2>
  
  <div class="reason-box">
    <h3>💥 1. 「不遇職」を「最強の火力職」へと反転させる理論値ビルド！</h3>
    <p>世間では「足が遅い・攻撃が当たらない・ただ硬いだけの盾」と嘲笑される【重騎士】。だが、前世でこのゲームを極めたエルマは知っている――「HPを極限まで削り、防御力を超火力へと反転させるぶっ壊れスキル構成」が存在することを！ 単なるチートではなくゲーム仕様を極めた結果の圧倒的強さだからこそ、戦闘のカタルシスが桁違いです！</p>
  </div>

  <div class="reason-box">
    <h3>🎰 2. エルマ×ルーチェ！「重騎士」と「豪運道化師」の奇跡のバディ感</h3>
    <p>博打要素が高すぎて誰も使いたがらない不遇職【道化師】の少女・ルーチェ。しかし彼女が秘めたスキルツリー〈豪運〉とエルマのドロップ率計算が合致した瞬間、確率数％の神レアドロップを乱獲する最強の荒稼ぎコンビが爆誕！ 二人の軽快な掛け合いと絶対的な信頼関係が最高に熱い！</p>
  </div>

  <div class="reason-box">
    <h3>🛡️ 3. MMOの超難関レイドを思い出す「緻密すぎるボス攻略戦」！</h3>
    <p>ボスの行動パターン把握、ヘイト管理、デバフ連携、即死ギミックの解除、そしてコンマ1秒のスキル発動タイミング。まるで高難易度MMORPGの初見レイドに挑んでいるかのような緊張感と緻密な戦術プランに興奮が止まりません！</p>
  </div>

  <div class="reason-box">
    <h3>🎬 4. アニメ化で爆発した圧倒的映像美＆神作画のバトル！</h3>
    <p>重厚な甲冑の金属質感、盾受けの重低音、スキル解放時の鳥肌が立つエフェクト演出！ 原作・コミックの熱量がそのまま映像へと昇華されています。アニメから入った人も絶対に原作・コミカライズを読んで損はありません！</p>
  </div>

  <h2 class="section-title">📖 原作小説（ライトノベル版） 1巻〜最新5巻 全巻レビュー <span class="section-subtitle">全5巻・楽天Kobo配信中</span></h2>
  <div class="novels-list">
    ${novelCardsHtml}
  </div>

  <h2 class="section-title">🎨 コミカライズ（漫画版） 1巻〜最新18巻 全巻レビュー <span class="section-subtitle">全18巻・楽天Kobo配信中</span></h2>
  <div class="manga-list">
    ${mangaCardsHtml}
  </div>

  <div style="background:#fcf9f2; border:1px solid #ebd9b5; border-left:5px solid #bf0000; border-radius:8px; padding:22px; margin:40px 0; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
    <div style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:16px; color:#17221f; margin-bottom:8px;">
      <span style="background:#bf0000; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">電子書籍が初めての方へ</span>
      <span>楽天Koboで重騎士を今すぐ快適に読むには？</span>
    </div>
    <p style="font-size:14px; color:#4a574e; line-height:1.8; margin:0 0 14px;">
      「スマホやPCでも読める？」「試し読みに会員登録は必要？」「楽天ポイントでお得に全巻揃えるコツは？」など、電子書籍を安心して始めるための購入手順やメリットを徹底解説しています。
    </p>
    <a href="/features/rakuten-kobo-beginner-guide/" style="display:inline-flex; align-items:center; gap:6px; background:#17221f; color:#fff; padding:10px 20px; border-radius:5px; font-size:13.5px; font-weight:bold; text-decoration:none;">
      <span>楽天Kobo初心者向け購入・試し読みガイドを見る ➔</span>
    </a>
  </div>

  <div style="background:#17221f; color:#fff; padding:32px; border-radius:10px; margin-top:50px; text-align:center;">
    <h3 style="color:#d6a24a; font-size:22px; margin-top:0;">🏆 結論：今すぐこの世界に飛び込むべき！</h3>
    <p style="color:#cfd8d3; font-size:15px; max-width:640px; margin:0 auto 20px; line-height:1.8;">
      一度この「緻密なビルド構築と手に汗握る攻略劇」を味わってしまうと、他の作品では物足りなくなるレベルの中毒性があります。ぜひ楽天Koboの電子書籍でエルマたちの最強攻略の軌跡を一気読みしてみてください！
    </p>
    <a href="${buildAff(koboData.novels[0].url)}" target="_blank" rel="sponsored nofollow noopener" style="display:inline-block; background:#d6a24a; color:#17221f; font-weight:bold; padding:14px 32px; border-radius:6px; font-size:15px;">まずは小説第1巻を無料試し読みする ↗</a>
  </div>
</main>

<footer class="site-footer">
  <p>© 異世界コンパス - 異世界作品・ライトノベル・漫画発見メディア</p>
</footer>
</body>
</html>`

  const featureDir = path.join('public/features/tsuihou-jyuukishi-complete-guide')
  await fs.mkdir(featureDir, { recursive: true })
  await fs.writeFile(path.join(featureDir, 'index.html'), pageHtml, 'utf8')
  console.log('Written standalone page:', featureDir + '/index.html')

  const distFeatureDir = path.join('dist/features/tsuihou-jyuukishi-complete-guide')
  await fs.mkdir(distFeatureDir, { recursive: true })
  await fs.writeFile(path.join(distFeatureDir, 'index.html'), pageHtml, 'utf8')
  console.log('Written dist standalone page:', distFeatureDir + '/index.html')
}
addHeavyKnightFeature().catch(console.error)
