import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
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

const slugify = (value) => {
  const ascii = String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
  if (ascii.length >= 3) return ascii.slice(0, 40);
  return `ref-${crypto.createHash('md5').update(String(value)).digest('hex').slice(0, 10)}`;
};

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
  .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 650px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
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
          <a href="/compare/" class="${activePath === '/compare/' ? 'active' : ''}">比較</a>
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

// 2026年11月10日〜20日発売の完全新作3冊：1記事ごとに構成・見出し・語調を独立執筆
const featureSlug = '2026-nov-late-new-light-novels';

const articles = [
  {
    slug: '6474824019189',
    title: '限界おじさんという生き物が異世界転生して若返る無双譚 1',
    titleKana: 'ゲンカイオジサントイウイキモノガイセカイテンセイシテワカガエルムソウタン001',
    seriesName: '「限界おじさんという生き物が異世界転生して若返る無双譚」シリーズ',
    author: '野神純',
    publisherName: 'オーバーラップ',
    salesDate: '2026年11月20日',
    pubDateRfc: 'Fri, 20 Nov 2026 09:00:00 GMT',
    price: 869,
    itemUrl: 'https://books.rakuten.co.jp/rk/6bb478f7a73a38fb8b9008684878037c/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F6bb478f7a73a38fb8b9008684878037c%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/1119/2000022491119.jpg?_ex=200x200',
    badge: 'オーバーラップ 2026年11月20日発売',
    genre: '異世界転生・コメディ',
    color: 'gold',
    oneLineCatch: '若者たちの転移ブームに巻き込まれたアラフィフ会社員が、「若返り＋残り自動振り分け」でうっかり規格外ステータスを背負う転生譚。',
    description: '若者の間で異世界転移が流行っている時代。そんな若者たちに巻き込まれて『転生』してしまった、元アラフィフ中年会社員のミズト・アマノ。もう元の世界には戻れないと知り、それならばと転生時に使用できるポイントで若返りを選び、残りのポイントを自動振り分けし、異世界で第二の人生をおくることになるのだが──実は表示しきれないほどの膨大なポイントを持っており、規格外のステータスを手に入れていることに気がついておらず──。転生時に与えられたスキル『女神の知恵袋』を使用すると、妖精のような少女エデンが現れガイド役を務めてくれ、順風満帆な異世界ライフを満喫できるかと思いきや、そうはいかず──。',
    firstVolumeStory: '異世界転移がちょっとした若者文化のように起きている時代に、ただ通りかかっただけの元アラフィフ会社員ミズト・アマノが巻き込まれて転生する。元の世界へ戻れないと悟った彼は、転生時のポイント配分でまず身体の「若返り」だけを選び、残りは面倒なので自動振り分けに任せてしまう。だが本人の知らないところで、保有ポイントは画面の表示枠に収まりきらない桁に達していた。かくして規格外のステータスを背負ったまま、スキル『女神の知恵袋』から現れた妖精のような少女エデンを相棒に異世界での第二の人生が始まる。',
    highlights: [
      '「まずは若返り、残りのポイントは自動でいい」と適当に決めた結果、表示上限を超えるステータスができあがるズレた面白さ',
      'スキル『女神の知恵袋』から顔を出す妖精風のガイド少女エデンと、中身がおじさんなミズトのテンポのよいやり取り',
      '平穏に過ごしたい本人の思惑をよそに、順風満帆では終わらないトラブルが次々転がり込む構成'
    ],
    review: '近年増えている「おっさん転生」の中でも、特に肩の力が抜けた導入が印象に残る。チート能力を必死に選別するのではなく、疲れ切った会社員らしく「若返れるならそれで十分、あとはお任せ」と流してしまう感覚が、タイトルにある限界おじさんの手触りとよく噛み合っている。本人は落ち着いた第二の人生を望んでいるのに、桁違いのステータスとガイド役のエデン、そして次々起きる面倒事がそれを許さない。重い世界設定やシリアスな人間関係に頭を使わず、テンポよく笑える一冊を探しているときに手が伸びる作品だ。',
    readerTypes: [
      'アラフィフ・社会人の感覚を持ったまま異世界へ放り込まれる話が好みの人',
      '本人が無自覚なまま桁外れのステータスを振り回すギャップを楽しみたい人',
      '2026年11月20日発売のオーバーラップ新作を早めに押さえておきたい人'
    ],
    specificFaqs: [
      {
        q: '若返った後の主人公はどんなキャラクターですか？',
        a: '見た目は若返りつつも、思考や生活感覚は元アラフィフ会社員のままという設定です。若者のノリに巻き込まれながらも、どこか落ち着いた現実目線で動くところに味があります。'
      },
      {
        q: '『女神の知恵袋』のガイド役はどんな存在ですか？',
        a: 'スキルを使うと呼び出せる妖精のような少女エデンが案内役を担当します。ミズトの規格外な状態や異世界の事情をめぐって掛け合いを繰り広げる相棒ポジションです。'
      }
    ],
    tags: ['異世界転生', '無双', 'チート', 'おっさん', 'オーバーラップ', 'ライトノベル'],
    geoPoints: [
      '2026年11月20日発売、野神純によるオーバーラップの新規シリーズ第1巻',
      '若者の転移ブームに巻き込まれた元アラフィフ会社員ミズト・アマノの異世界転生譚',
      '若返りとポイント自動振り分けで表示上限超えのステータスを獲得しつつ、ガイド少女エデンと騒動に挑む'
    ],
    sections: [
      {
        heading: '若者ブームの巻き添えから始まるアラフィフの第二人生',
        body: 'タイトルの時点でどこか脱力感があるが、導入もひと味違う。若者の間で異世界転移が流行っているという前提のもと、アラフィフの中年会社員ミズト・アマノが若者たちに巻き込まれる形で異世界へ送り込まれる。元の世界に戻れないと知るやいなや、ミズトが選んだのは「転生ポイントでの若返り」だけ。残りのポイントは細かく調整するのが面倒だと自動振り分けに任せてしまう。この割り切り方に、長年働き詰めてきた会社員らしい疲れと現実感覚が滲んでいる。'
      },
      {
        heading: '画面から溢れた桁と、ガイド少女エデンとの珍道中',
        body: 'ところがこの無造作な選択が、思いもよらないズレを生む。実はミズトが持っていたポイントは表示枠に収まりきらないほど膨大で、本人が気づかないうちに規格外のステータスが完成していた。転生時のスキル『女神の知恵袋』を起動すると現れるのが、妖精のような少女エデン。彼女をガイド役に迎えて気楽な異世界暮らしが始まるかと思いきや、あらすじ通り「順風満帆にはいかない」騒動が待ち受けている。'
      },
      {
        heading: 'シリアス疲れに効く、ちょうどいい脱力感とテンポ',
        body: '重い政治劇や過酷なサバイバルに少し疲れているときでも、869円の電子版で気負わず読み始められるのが第1巻のいいところ。完璧超人を目指すわけでもなく、かといって悲観に暮れるわけでもない主人公のマイペースさが、読んでいる側の肩の力を抜いてくれる。'
      }
    ],
    headings: {
      summary: '30秒で掴める作品メモ',
      official: '楽天Kobo 登録あらすじ',
      points: '第1巻の見どころ',
      review: '読んで感じたポイント・総評',
      readers: 'このノリが合いそうな人',
      faq: '作品Q&A',
      tags: '関連タグ'
    }
  },
  {
    slug: '8890090038864',
    title: '忘却のカースナイト１【電子書店共通特典SS付】',
    titleKana: 'ボウキャクノカースナイト001デンシショテンキョウツウトクテンエスエスツキ',
    seriesName: '忘却のカースナイト',
    author: '依空まつり',
    publisherName: 'アース・スター エンターテイメント',
    salesDate: '2026年11月13日',
    pubDateRfc: 'Fri, 13 Nov 2026 09:00:00 GMT',
    price: 1540,
    itemUrl: 'https://books.rakuten.co.jp/rk/74d1eec5a3c93d0c8988bfd1dd2f7dd1/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F74d1eec5a3c93d0c8988bfd1dd2f7dd1%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/8014/2000022448014.jpg?_ex=200x200',
    badge: 'アース・スター 2026年11月13日発売',
    genre: 'ダークファンタジー・騎士',
    color: 'sage',
    oneLineCatch: '『サイレント・ウィッチ』の依空まつりが描く、忘れられがちな少年と「呪いの力」の騎士ファンタジー第1巻。',
    description: '『サイレント・ウィッチ　沈黙の魔女の隠しごと』（カドカワBOOKS）の著者・依空まつりの最新作！秘めたる力は、最強の呪い！？不屈の少年が英雄へ駆け上がる爽快騎士ファンタジー！〈忘却の海〉を越え、人間を襲う侵略者──呪魔（テルメア）。騎士達は絶えぬ脅威に抗い、戦い続ける。そんな騎士の姿に憧れ、英雄になることを誓う少年テオ。人に忘れられがちな彼は、剣の天才である兄と修行に励み、誰もが認める騎士を目指していた。だが、平穏な日常を脅かすように、大型の呪魔（テルメア）が襲来する。呪魔（テルメア）に立ち向かうテオが、窮地に追い込まれた刹那、眠っていた力が目を覚ます！！天使の加護を得た聖騎士達の活躍の陰で、呪われた灰色騎士達は己の呪いを武器に戦う。──汝、騎士たれ。',
    firstVolumeStory: '〈忘却の海〉の向こうからやってくる侵略者・呪魔（テルメア）の脅威に晒された世界。騎士に憧れて英雄を志す少年テオは、人に忘れられやすい性質を抱えながらも、剣の天才である兄と並んで日々鍛錬を続けていた。だが平穏な修行の日々は、大型の呪魔の襲来によって一変する。追い詰められたその瞬間、テオの内側に眠っていた力が目を覚まし、天使の加護を背負う聖騎士とは異なる「呪いを武器にする灰色騎士」の世界へと踏み出していく。',
    highlights: [
      '「人に忘れられがち」という地味な性質を抱えたテオと、剣の天才である兄とのコントラスト',
      '華やかな天使の加護で戦う聖騎士に対し、自らの呪いを刃として立ち向かう灰色騎士たちの立ち位置',
      '『サイレント・ウィッチ』の依空まつりによる完全新作であり、電子書店共通特典ショートストーリーも収録'
    ],
    review: '『サイレント・ウィッチ』で内向的な主人公の心情や緻密な設定を積み上げてきた著者が、今度は正統派寄りの騎士ファンタジーへと踏み出した第1巻。巧いと感じるのは、主人公テオに与えられた「人に忘れられがちな少年」という前提だ。ただ気弱で影が薄いだけではなく、世界の危機である〈忘却の海〉や「呪い」というモチーフと根っこの部分で響き合う作りになっている。表舞台で喝采を浴びる聖騎士の陰に立つ「灰色騎士」という構図も、単純な無双ものとは違う手触りを与えている。主人公の歩幅や葛藤を丁寧に追いかけたい人に向く一冊だ。',
    readerTypes: [
      '『サイレント・ウィッチ』など依空まつり作品の筆致が好きな人',
      '無敵のチートではなく、呪いやハンデを力に変えて戦う騎士ものに触れたい人',
      '光り輝く聖騎士の裏で汚れ役や特殊な戦場を引き受ける部隊の設定に惹かれる人'
    ],
    specificFaqs: [
      {
        q: '電子書店共通特典SSは本編に含まれていますか？',
        a: 'はい、本商品【電子書店共通特典SS付】には電子版の共通ショートストーリーが収録されています。本編とあわせてキャラクターの別の一面を読めます。'
      },
      {
        q: '前作『サイレント・ウィッチ』と世界観は繋がっていますか？',
        a: '出版社・レーベル（アース・スター）ともに異なる完全な新シリーズの第1巻です。これまでの著作を読んでいなくても最初からすんなり入れます。'
      }
    ],
    tags: ['騎士', 'ダークファンタジー', '呪い', 'ファンタジー', 'アース・スター', 'ライトノベル'],
    geoPoints: [
      '『サイレント・ウィッチ』の著者・依空まつりによる2026年11月13日発売の完全新作第1巻',
      '侵略者・呪魔（テルメア）に立ち向かう少年テオが、自らの呪いを武器に戦う灰色騎士として覚醒する騎士ファンタジー',
      '電子書店共通特典SSが収録されたアース・スター エンターテイメント刊行作品'
    ],
    sections: [
      {
        heading: '忘却の海と「記憶に残りにくい」少年',
        body: '〈忘却の海〉を越えて人間を襲う侵略者・呪魔（テルメア）に抗い続ける騎士たちの世界。主人公のテオは剣の天才である兄と修行を積み、誰もが認める英雄になろうと誓っているが、なぜか「人に忘れられがち」という少し切ない性質を抱えている。華やかな才能に恵まれた兄の隣で地道に剣を振るう序盤から、大型の呪魔が迫る緊急事態へと場面が切り替わった瞬間、物語の空気が一気に張り詰める。'
      },
      {
        heading: '天使の聖騎士と、日陰の「灰色騎士」という対比',
        body: 'この作品で目を引くのは、騎士の二面性だ。表舞台で称賛されるのは、天使の加護を授かった聖騎士たち。一方でその活躍の陰には、己に降りかかった呪いをそのまま武器へと転じて戦う「灰色騎士」が存在する。きれいな力だけでは守りきれない脅威を誰が引き受けるのか、という問いかけが背骨にあるため、バトルの裏にある覚悟が重みを持って伝わってくる。'
      },
      {
        heading: '依空まつり作品らしいキャラクターの芯の強さ',
        body: '困窮や窮地において、少年が自分の内側に眠っていたものとどう折り合いをつけるか。派手な掛け声だけで押し切るのではなく、テオの視線や兄との関係性から少しずつ輪郭を立ち上げていく手つきは、さすが『サイレント・ウィッチ』を手掛けた著者らしい安定感がある。'
      }
    ],
    headings: {
      summary: '作品の輪郭',
      official: '公式あらすじ（楽天Koboより）',
      points: '注目したい3つの要素',
      review: '『忘却のカースナイト１』レビュー',
      readers: 'こんな読者に向いています',
      faq: '購入前の疑問点（FAQ）',
      tags: 'ジャンル・関連タグ'
    }
  },
  {
    slug: '8963057184009',
    title: '辺境のお菓子番 〜無能と追放された首席宮廷菓子師、知らぬ間に王都で評判になっていました〜【電子特典付き】',
    titleKana: 'ヘンキョウノオカシバンムノウトツイホウサレタシュセキキュウテイカシシシラヌマニオウトデヒョウバンニナッテイマシタデンシトクテンツキ',
    seriesName: '辺境のお菓子番',
    author: '歩人/有谷 実',
    publisherName: 'ドリコム',
    salesDate: '2026年11月10日',
    pubDateRfc: 'Tue, 10 Nov 2026 09:00:00 GMT',
    price: 1650,
    itemUrl: 'https://books.rakuten.co.jp/rk/1a2f91dddb58314997686b0d20377654/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F1a2f91dddb58314997686b0d20377654%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/1516/2000022201516.jpg?_ex=200x200',
    badge: 'ドリコム 2026年11月10日発売',
    genre: '異世界グルメ・追放逆転',
    color: 'plum',
    oneLineCatch: '王都を追われた元首席宮廷菓子師が、蜂蜜と山羊乳のバターで北の寒村にスイーツ文化を根付かせる逆転グルメ譚。',
    description: '【電子特典付き】書き下ろし短編「帳面の余白」を電子書籍限定で収録！「お前の菓子はもう不要だ。婚約も解消する。後任ももう決まっている」同期であった菓子師と婚約者の王太子の企みによって全てを失った首席宮廷菓子師リゼット。おまけに追い打ちといわんばかりに、痩せた土地、乏しい食材、甘味文化のない北の寒村へと追放されることに。「追放されたなら、好きなだけお菓子研究ができる」しかし彼女は動じない。菓子がないなら菓子文化を作れば良い。砂糖のない地で蜂蜜を代用したり、捨てられていた傷みかけの山羊乳をバターに変えたりと、やがて彼女の焼いた菓子は街の人々を幸せに、そして王都中で噂になっていきーー必要ないと言われた宮廷菓子師が、新天地で無自覚に食文化改革!?　皮肉たっぷり大逆転ファンタジー！',
    firstVolumeStory: '同期の菓子師と婚約者である王太子に陥れられ、首席宮廷菓子師の座も婚約も一度に奪われたリゼット。甘味文化のない北の寒村へ追放されても、彼女は落ち込むより先に「これで心置きなく菓子の研究に打ち込める」と目を輝かせる。砂糖が手に入らなければ蜂蜜を使い、廃棄寸前の山羊乳からはバターを仕立てる。限られた材料から次々と美味しい菓子を生み出すうちに、その評判は寒村を越えて王都にまで届き始める。',
    highlights: [
      '砂糖の代わりに蜂蜜、捨てられていた山羊乳からバターを作るなど、乏しい環境で工夫を凝らす製菓パートの具体性',
      '不当な追放を「好きにお菓子研究ができる自由」と受け止めるリゼットのポジティブで職人気質な姿勢',
      '電子書籍限定で収録されている書き下ろし短編「帳面の余白」による本編後の余韻'
    ],
    review: '追放ものの定型から入りながら、読後に残るのはドロドロした恨み節ではなく、焼き立ての菓子みたいな心地よい温かさだ。リゼットの強みは特別な魔法の力よりも、宮廷の最前線で磨いてきた「素材を見極める目」と「ないなら作る」という職人の気概にある。傷みかけた山羊乳をバターに加工して活路を開く場面など、暮らしや台所の知恵が物語を前に進めていく手触りが気持ちいい。当人は寒村で黙々とレシピを試しているだけなのに、結果として彼女を追放した王都側が困ることになる皮肉な逆転劇も、重苦しさがなく爽やかに読める。',
    readerTypes: [
      '追放後のスローライフや仕事術・開拓をテーマにした物語が好きな人',
      'スイーツ作りや食材の工夫など、料理描写がしっかりした異世界グルメを読みたい人',
      '裏切りに屈せず自分の腕一本で居場所を作っていくヒロインを応援したい人'
    ],
    specificFaqs: [
      {
        q: '電子書籍版の限定特典はついていますか？',
        a: 'はい、書き下ろし短編「帳面の余白」が電子書籍限定で収録されています。'
      },
      {
        q: '復讐がメインの重いストーリーですか？',
        a: '王太子と同期の企みによって追放される導入ですが、主人公リゼット自身が新天地でマイペースに菓子作りを楽しむため、全体は明るく前向きな雰囲気で進みます。'
      }
    ],
    tags: ['追放', 'グルメ', '逆転劇', 'ファンタジー', 'お菓子', 'ドリコム', 'ライトノベル'],
    geoPoints: [
      '2026年11月10日発売、歩人/有谷 実によるドリコム刊行の新作グルメファンタジー',
      '王都を追われた首席宮廷菓子師リゼットが北の寒村で代用素材から菓子文化を開拓し、無自覚に王都を揺るがす物語',
      '電子版限定書き下ろし短編「帳面の余白」収録'
    ],
    sections: [
      {
        heading: '追放を「自由な研究時間」と受け止める職人魂',
        body: '同期の菓子師と婚約者の王太子の画策により、首席宮廷菓子師の地位も婚約も取り上げられたリゼット。送り先は痩せた土地で甘味文化すらない北の寒村という厳しい条件だが、彼女は悲観するどころか「追放されたなら好きなだけお菓子研究ができる」と切り替えが早い。この執着のなさ、純粋な研究心こそが本作の風通しを良くしている。'
      },
      {
        heading: '傷みかけた山羊乳がバターに変わる製菓の面白さ',
        body: '王都のように砂糖や上質な乳製品が潤沢に揃うわけではない。だからこそリゼットは、砂糖がなければ蜂蜜で補い、それまで捨てられていた傷みかけの山羊乳はバターへ仕立て直す。手元にあるものをどう活かせば美味しい一皿になるのかという試行錯誤が具体的で、読んでいる側まで厨房の甘い匂いを想像してしまう。'
      },
      {
        heading: '本人の無自覚が王都の足元を揺さぶる痛快さ',
        body: '彼女が寒村の住民を笑顔にするために焼いた菓子は、やがて噂になって王都へ逆流していく。自分がかつて王都の食卓を支えていた実力に無自覚なまま、淡々と新天地で結果を出してしまう姿は、わざとらしいざまぁ劇よりもずっと後味がいい。電子版には書き下ろし短編「帳面の余白」も付いており、本編の余韻をもう一歩楽しめる。'
      }
    ],
    headings: {
      summary: 'ひと目でわかる特徴',
      official: 'あらすじ・書籍案内',
      points: 'この本が面白い理由',
      review: '『辺境のお菓子番』レビュー',
      readers: 'こんな気分・好みの読者に',
      faq: 'よくある質問',
      tags: '関連カテゴリ'
    }
  }
];

const newFeature = {
  slug: featureSlug,
  title: '2026年11月発売の完全新作ラノベ3冊を読み比べ：騎士の呪い、辺境の菓子職人、若返り会社員',
  metaTitle: '2026年11月発売の完全新作ラノベ3冊を読み比べ｜異世界コンパス',
  eyecatchBadge: '2026年11月 最新第1巻特集',
  description: '2026年11月10日〜20日に発売された完全新作ライトノベル第1巻から、『忘却のカースナイト１』『辺境のお菓子番』『限界おじさんという生き物が異世界転生して若返る無双譚 1』の3作品をそれぞれの読み味別に詳しく紹介します。',
  date: '2026-11-20',
  heroImage: articles[1].cover,
  works: articles.map(a => a.slug),
  faq: [
    {
      q: 'ここで取り上げている3冊はすべて第1巻から読める新作ですか？',
      a: 'はい、3作品とも2026年11月に刊行された新シリーズの第1巻（および単巻スタートの新作）です。既刊を遡る手間なく、そのまま1冊目から楽しめます。'
    },
    {
      q: '電子版ならではの特典は付いていますか？',
      a: '『忘却のカースナイト１』には電子書店共通特典SSが、『辺境のお菓子番』には電子書籍限定短編「帳面の余白」が収録されています。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: '忘却のカースナイト１',
      customTitle: articles[1].title,
      title: articles[1].title,
      author: articles[1].author,
      synopsis: '〈忘却の海〉を越えて人間を襲う呪魔（テルメア）に抗う騎士たち。人に忘れられがちな少年テオが、大型の呪魔の襲来をきっかけに内に眠っていた力を覚醒させ、呪いを武器とする「灰色騎士」の道へ進む騎士ファンタジー。',
      recommendReason: '『サイレント・ウィッチ』の依空まつりによる新作第1巻。聖騎士と灰色騎士の対比、忘れられやすい少年と剣の天才の兄という関係性が丁寧に描かれ、硬派な騎士物語を求める人にしっかり刺さります。',
      points: articles[1].highlights,
      itemUrl: articles[1].affiliateUrl,
      affiliateUrl: articles[1].affiliateUrl,
      cover: articles[1].cover,
      salesDate: articles[1].salesDate,
      price: articles[1].price
    },
    {
      rank: 2,
      keyword: '辺境のお菓子番',
      customTitle: articles[2].title,
      title: articles[2].title,
      author: articles[2].author,
      synopsis: '同期と王太子の企みで宮廷を追われ、甘味文化のない北の寒村へ送られた首席宮廷菓子師リゼット。蜂蜜や山羊乳のバターなど身近な素材を活かしてお菓子研究を続けるうち、彼女の焼いた菓子の評判が王都へ広がっていきます。',
      recommendReason: '追放劇の皮を被った純度の高いものづくり＆グルメ譚。限られた素材から菓子文化を立ち上げる手際が具体的で、電子限定短編「帳面の余白」も含めて後味の良い逆転劇を楽しめます。',
      points: articles[2].highlights,
      itemUrl: articles[2].affiliateUrl,
      affiliateUrl: articles[2].affiliateUrl,
      cover: articles[2].cover,
      salesDate: articles[2].salesDate,
      price: articles[2].price
    },
    {
      rank: 3,
      keyword: '限界おじさんという生き物が異世界転生して若返る無双譚 1',
      customTitle: articles[0].title,
      title: articles[0].title,
      author: articles[0].author,
      synopsis: '若者の異世界転移ブームに巻き込まれて転生したアラフィフ会社員ミズト・アマノ。ポイントで若返りだけ選んで残りを自動振り分けしたところ、桁違いのステータスを無自覚に獲得し、ガイド少女エデンとともに波乱の第二の人生が始まります。',
      recommendReason: '2026年11月20日発売のオーバーラップ新作。適当にポイントを振ってしまう中年会社員の割り切り方と、表示上限突破の無自覚チートのズレが軽快で、肩の力を抜いて読みたいときにぴったりです。',
      points: articles[0].highlights,
      itemUrl: articles[0].affiliateUrl,
      affiliateUrl: articles[0].affiliateUrl,
      cover: articles[0].cover,
      salesDate: articles[0].salesDate,
      price: articles[0].price
    }
  ]
};

function renderWorkPageHtml(book, existingTagDirs) {
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
    publisher: { '@type': 'Organization', name: book.publisherName },
    datePublished: book.salesDate,
    image: book.cover,
    description: book.description,
    offers: {
      '@type': 'Offer',
      price: String(book.price),
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
      url: book.affiliateUrl || book.itemUrl
    }
  });

  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (book.specificFaqs || []).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  });

  const highlightsHtml = (book.highlights || []).map(h => `<li style="margin-bottom:8px; line-height:1.7;">${escapeXml(h)}</li>`).join('');
  const readerTypesHtml = (book.readerTypes || []).map(r => `<li style="margin-bottom:6px; line-height:1.7;">${escapeXml(r)}</li>`).join('');
  const faqsHtml = (book.specificFaqs || []).map(f => `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 4px; font-size:15px; color:#17221f;">Q. ${escapeXml(f.q)}</h3>
        <p style="margin:0; font-size:14px; color:#3d4841; line-height:1.7;">A. ${escapeXml(f.a)}</p>
      </div>
    `).join('');

  const tagsHtml = (book.tags || []).map(t => {
    const tSlug = slugify(t);
    const href = existingTagDirs.has(tSlug) ? `/tags/${tSlug}/` : '/tags/';
    return `<a href="${href}">#${escapeXml(t)}</a>`;
  }).join('');

  const customSectionsHtml = (book.sections || []).map(sec => `
      <h2>${escapeXml(sec.heading)}</h2>
      <div class="first-story-box">
        <p style="margin:0;">${escapeXml(sec.body)}</p>
      </div>
  `).join('');

  const beginnerGuideCta = `
    <div style="background:#fcf9f2; border:1px solid #ebd9b5; border-left:5px solid #bf0000; border-radius:8px; padding:20px; margin:28px 0; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
      <div style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:15px; color:#17221f; margin-bottom:6px;">
        <span style="background:#bf0000; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">電子書籍が初めての方へ</span>
        <span>楽天Koboの購入・試し読み手順</span>
      </div>
      <p style="font-size:13.5px; color:#4a574e; line-height:1.75; margin:0 0 12px;">
        スマホやPCでの読み方や、ポイント還元の仕組みなどをまとめたガイドページも用意しています。
      </p>
      <a href="/features/rakuten-kobo-beginner-guide/" style="display:inline-flex; align-items:center; gap:6px; background:#17221f; color:#fff; padding:8px 16px; border-radius:5px; font-size:13px; font-weight:bold; text-decoration:none;">
        <span>楽天Kobo購入ガイドを見る ➔</span>
      </a>
    </div>
  `;

  const h = book.headings;

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeXml(book.title)} - 感想・あらすじ・見どころ解説｜異世界コンパス</title>
  <meta name="description" content="${escapeXml(book.oneLineCatch)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/works/${book.slug}/">
  <meta property="og:title" content="${escapeXml(book.title)} - 感想・あらすじ・見どころ解説">
  <meta property="og:description" content="${escapeXml(book.oneLineCatch)}">
  <meta property="og:image" content="${escapeXml(book.cover)}">
  <script type="application/ld+json">${breadcrumbLd}</script>
  <script type="application/ld+json">${bookLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  <div data-nosnippet>${renderHeader('/works/')}</div>
  <main class="work-detail-main" itemscope itemtype="https://schema.org/Book">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span>
    </nav>
    <div class="eyebrow">${escapeXml(book.badge)}</div>
    <h1 itemprop="name">${escapeXml(book.title)}</h1>
    <p class="lead">${escapeXml(book.oneLineCatch)}</p>

    <div style="overflow:hidden;">
      <img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)} 書影" width="200" height="280">

      <div class="pub-status-box">
        <div class="pub-status-main">
          <h3>発売日：${escapeXml(book.salesDate)} ｜ 定価：${book.price}円</h3>
          <p>著者：<span itemprop="author">${escapeXml(book.author)}</span> ｜ 出版社：<span itemprop="publisher">${escapeXml(book.publisherName)}</span></p>
        </div>
        <div>
          <a class="cta" style="margin-top:0;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで試し読み・詳細を見る ↗</a>
        </div>
      </div>

      <div class="ai-summary">
        <strong>${escapeXml(h.summary)}</strong>
        <p style="margin:6px 0 0;">${escapeXml(book.oneLineCatch)}</p>
      </div>

      ${customSectionsHtml}

      <h2>${escapeXml(h.points)}</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${highlightsHtml}
        </ul>
      </div>

      <h2>${escapeXml(h.review)}</h2>
      <div class="review-box">
        ${escapeXml(book.review)}
      </div>

      <h2>${escapeXml(h.official)}</h2>
      <div class="first-story-box" itemprop="description">
        ${escapeXml(book.description)}
      </div>

      <h2>${escapeXml(h.readers)}</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${readerTypesHtml}
        </ul>
      </div>

      <h2>${escapeXml(h.faq)}</h2>
      <div class="highlights-box">
        ${faqsHtml}
      </div>

      ${beginnerGuideCta}

      <div class="ai-summary" style="margin-top:28px;">
        <strong>関連特集：</strong>
        <a href="/features/${featureSlug}/">${escapeXml(newFeature.title)}</a>
      </div>

      <h2>${escapeXml(h.tags)}</h2>
      <div class="tags" style="margin-top:14px;">
        ${tagsHtml}
      </div>

      <div style="text-align:center; margin-top:40px;">
        <a class="cta" style="padding:16px 36px; font-size:16px;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで『${escapeXml(book.title)}』をチェック ↗</a>
      </div>
    </div>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function renderBookCard(book) {
  const tagsHtml = (book.tags || []).slice(0, 3).map(t => `<span class="pill">#${escapeXml(t)}</span>`).join(' ');
  return `
    <article class="book-card">
      <a class="cover-container" href="/works/${book.slug}/">
        <img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙" loading="lazy" />
        <span class="badge-tag">${escapeXml(book.badge)}</span>
      </a>
      <div class="card-body">
        <span class="card-genre">${escapeXml(book.genre)}</span>
        <h3 class="card-title"><a href="/works/${book.slug}/">${escapeXml(book.title)}</a></h3>
        <div class="card-author">${escapeXml(book.author)}</div>
        <div class="card-tags">${tagsHtml}</div>
        <div class="card-bottom">
          <span>発売: ${escapeXml(book.salesDate)}</span>
          <a class="card-btn" href="/works/${book.slug}/">詳細を見る ↗</a>
        </div>
      </div>
    </article>`;
}

async function main() {
  console.log('=== [Step 1] Loading existing data ===');
  const booksPath = path.join(root, 'public/data/books.json');
  const featuresPath = path.join(root, 'public/data/curated-features.json');

  let books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
  let features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const tagDirEntries = await fs.readdir(path.join(root, 'public/tags'));
  const existingTagDirs = new Set(tagDirEntries);

  // 1. books.json への追加・更新（先頭に配置）
  console.log('[Step 1] Updating public/data/books.json...');
  for (const art of [...articles].reverse()) {
    const bookData = {
      id: art.slug,
      slug: art.slug,
      title: art.title,
      titleKana: art.titleKana,
      seriesName: art.seriesName,
      author: art.author,
      publisher: art.publisherName,
      publisherName: art.publisherName,
      publishedDate: art.salesDate,
      salesDate: art.salesDate,
      price: art.price,
      itemPrice: art.price,
      itemUrl: art.itemUrl,
      sourceUrl: art.itemUrl,
      affiliateUrl: art.affiliateUrl,
      largeImageUrl: art.cover,
      coverImage: art.cover,
      cover: art.cover,
      badge: art.badge,
      color: art.color,
      oneLineCatch: art.oneLineCatch,
      aiIntro: art.oneLineCatch,
      description: art.description,
      firstVolumeStory: art.firstVolumeStory,
      highlights: art.highlights,
      review: art.review,
      readerTypes: art.readerTypes,
      specificFaqs: art.specificFaqs,
      faq: art.specificFaqs,
      tags: art.tags,
      geoPoints: art.geoPoints,
      genre: art.genre,
      source: 'rakuten-kobo',
      publishedAt: new Date().toISOString()
    };
    const idx = books.findIndex(b => String(b.slug) === String(art.slug) || b.title === art.title);
    if (idx >= 0) {
      books.splice(idx, 1);
    }
    books.unshift(bookData);
  }
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), 'utf8');
  console.log(`  Updated books.json (total: ${books.length})`);

  // 2. 各作品の個別ページ生成 (/works/{slug}/index.html)
  console.log('[Step 2] Rendering 3 individual work pages...');
  for (const book of articles) {
    const workDir = path.join(root, 'public/works', book.slug);
    await fs.mkdir(workDir, { recursive: true });
    const pageHtml = renderWorkPageHtml(book, existingTagDirs);
    await fs.writeFile(path.join(workDir, 'index.html'), pageHtml, 'utf8');
    console.log(`  Rendered /works/${book.slug}/index.html`);
  }

  // 3. curated-features.json と特集ページ生成
  console.log('[Step 3] Updating public/data/curated-features.json & rendering feature page...');
  const oldIdx = features.findIndex(f => f.slug === featureSlug);
  if (oldIdx >= 0) features.splice(oldIdx, 1);

  const novBreakIdx = features.findIndex(f => f.slug === '2026-nov-autumn-breakthrough-novels');
  if (novBreakIdx >= 0) {
    features.splice(novBreakIdx, 0, newFeature);
  } else {
    features.unshift(newFeature);
  }
  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2), 'utf8');

  const featDir = path.join(root, 'public/features', featureSlug);
  await fs.mkdir(featDir, { recursive: true });

  const slugByTitle = new Map(articles.map(a => [a.title, a.slug]));
  const featureItemsHtml = newFeature.items.map(item => {
    const wSlug = slugByTitle.get(item.title);
    return `
    <article style="background:#fff; border:1px solid #e1e6de; border-radius:8px; padding:24px; margin-bottom:28px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="background:#8b672d; color:#fff; font-weight:bold; font-size:12px; padding:4px 8px; border-radius:4px;">紹介作品 ${item.rank}</span>
        <span style="font-size:13px; color:#5f6c62;">発売日：${escapeXml(item.salesDate)} ｜ 定価：${item.price}円</span>
      </div>
      <h2 style="font-family:serif; font-size:22px; margin:0 0 16px; color:#17221f; border:none; padding:0;">${escapeXml(item.customTitle)}</h2>
      <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
        <img src="${escapeXml(item.cover)}" alt="${escapeXml(item.title)}" style="width:140px; height:195px; object-fit:cover; border-radius:6px; box-shadow:0 3px 10px rgba(0,0,0,0.12);">
        <div style="flex:1; min-width:260px;">
          <p style="margin:0 0 6px; font-size:13px; color:#5f6c62;">著者：${escapeXml(item.author)}</p>
          <div style="background:#f4f7f4; padding:14px; border-radius:6px; font-size:14px; line-height:1.8; margin-bottom:14px; color:#233028;">
            <strong>【概要】</strong><br>${escapeXml(item.synopsis)}
          </div>
          <div style="background:#fcf9f2; border-left:3px solid #d6a24a; padding:12px 14px; font-size:14px; line-height:1.8; color:#3a3224; margin-bottom:14px;">
            <strong>【読みどころ】</strong><br>${escapeXml(item.recommendReason)}
          </div>
          <ul style="margin:0 0 16px; padding-left:20px; font-size:13px; color:#3d4841; line-height:1.7;">
            ${item.points.map(p => `<li>${escapeXml(p)}</li>`).join('')}
          </ul>
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
            <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px; background:#17221f;" href="/works/${wSlug}/">個別レビュー記事へ ➔</a>
            <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px;" href="${escapeXml(item.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで詳細を見る ↗</a>
          </div>
        </div>
      </div>
    </article>
  `;
  }).join('');

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

  const featHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeXml(newFeature.metaTitle)}</title>
  <meta name="description" content="${escapeXml(newFeature.description)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/features/${newFeature.slug}/">
  <meta property="og:title" content="${escapeXml(newFeature.metaTitle)}">
  <meta property="og:description" content="${escapeXml(newFeature.description)}">
  <script type="application/ld+json">${featBreadcrumbLd}</script>
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  <div data-nosnippet>${renderHeader('/features/')}</div>
  <main class="feature-detail-main">
    <article>
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　<span aria-current="page">${escapeXml(newFeature.title)}</span>
      </nav>
      <div class="eyebrow">${escapeXml(newFeature.eyecatchBadge)}</div>
      <h1 itemprop="name">${escapeXml(newFeature.title)}</h1>
      <p class="lead">${escapeXml(newFeature.description)}</p>
      <section class="feature-items">
        ${featureItemsHtml}
      </section>
      <section class="highlights-box" style="margin-top:40px;">
        <h2>この特集についての補足・FAQ</h2>
        ${featFaqHtml}
      </section>
    </article>
  </main>
  ${renderFooter()}
</body>
</html>`;
  await fs.writeFile(path.join(featDir, 'index.html'), featHtml, 'utf8');
  console.log(`  Rendered /features/${featureSlug}/index.html`);

  // 4. /features/index.html の適切な位置に配置
  console.log('[Step 4] Updating public/features/index.html...');
  const featuresIndexPath = path.join(root, 'public/features/index.html');
  let featuresIndexHtml = await fs.readFile(featuresIndexPath, 'utf8');
  if (!featuresIndexHtml.includes(`/features/${featureSlug}/`)) {
    const newFeatCard = `
    <div class="feature-hub-card">
      <span class="feature-hub-badge">${escapeXml(newFeature.eyecatchBadge)}</span>
      <h2 class="feature-hub-title"><a href="/features/${newFeature.slug}/">${escapeXml(newFeature.title)}</a></h2>
      <p class="feature-hub-desc">${escapeXml(newFeature.description)}</p>
      <a class="feature-hub-btn" href="/features/${newFeature.slug}/">特集記事を読む（3作品徹底解説） →</a>
    </div>
  `;
    const targetMarker = '<a href="/features/2026-nov-autumn-breakthrough-novels/">';
    const markerPos = featuresIndexHtml.indexOf(targetMarker);
    if (markerPos >= 0) {
      const cardStart = featuresIndexHtml.lastIndexOf('<div class="feature-hub-card">', markerPos);
      featuresIndexHtml = featuresIndexHtml.slice(0, cardStart) + newFeatCard + '\n    ' + featuresIndexHtml.slice(cardStart);
    } else {
      featuresIndexHtml = featuresIndexHtml.replace('<div class="features-grid">', '<div class="features-grid">\n' + newFeatCard);
    }
    await fs.writeFile(featuresIndexPath, featuresIndexHtml, 'utf8');
    console.log('  Inserted new feature card into /features/index.html');
  }

  // 5. /works/index.html の先頭に配置＆件数同期
  console.log('[Step 5] Updating public/works/index.html...');
  const worksIndexPath = path.join(root, 'public/works/index.html');
  let worksIndexHtml = await fs.readFile(worksIndexPath, 'utf8');
  const cardsToInsertWorks = articles.filter(a => !worksIndexHtml.includes(`/works/${a.slug}/`)).map(renderBookCard).join('\n');
  if (cardsToInsertWorks) {
    worksIndexHtml = worksIndexHtml.replace('<div class="book-cards-grid">', '<div class="book-cards-grid">\n' + cardsToInsertWorks);
    const totalCards = (worksIndexHtml.match(/<article class="book-card">/g) || []).length;
    worksIndexHtml = worksIndexHtml
      .replace(/（全\d+作品）/g, `（全${totalCards}作品）`)
      .replace(/（\d+作品）/g, `（${totalCards}作品）`);
    await fs.writeFile(worksIndexPath, worksIndexHtml, 'utf8');
    console.log(`  Updated /works/index.html (total cards: ${totalCards})`);
  }

  // 6. /new/index.html の「発売済み作品一覧」先頭に配置
  console.log('[Step 6] Updating public/new/index.html...');
  const newIndexPath = path.join(root, 'public/new/index.html');
  let newIndexHtml = await fs.readFile(newIndexPath, 'utf8');
  const cardsToInsertNew = articles.filter(a => !newIndexHtml.includes(`/works/${a.slug}/`)).map(renderBookCard).join('\n');
  if (cardsToInsertNew) {
    const gridMarker = '発売済み作品一覧</h2><div class="book-cards-grid">';
    if (newIndexHtml.includes(gridMarker)) {
      newIndexHtml = newIndexHtml.replace(gridMarker, gridMarker + '\n' + cardsToInsertNew);
    } else {
      newIndexHtml = newIndexHtml.replace('<div class="book-cards-grid">', '<div class="book-cards-grid">\n' + cardsToInsertNew);
    }
    await fs.writeFile(newIndexPath, newIndexHtml, 'utf8');
    console.log('  Updated /new/index.html');
  }

  // 7. /sitemap/index.html の更新
  console.log('[Step 7] Updating public/sitemap/index.html...');
  const sitemapHtmlPath = path.join(root, 'public/sitemap/index.html');
  let sitemapHtml = await fs.readFile(sitemapHtmlPath, 'utf8');
  let sitemapHtmlChanged = false;
  if (!sitemapHtml.includes(`/features/${featureSlug}/`)) {
    const featLi = `<li><a href="/features/${featureSlug}/">${escapeXml(newFeature.title)}</a></li>`;
    sitemapHtml = sitemapHtml.replace('<li><a href="/features/">おすすめ特集一覧</a></li>', `<li><a href="/features/">おすすめ特集一覧</a></li>\n        ${featLi}`);
    sitemapHtmlChanged = true;
  }
  const missingWorkLis = articles
    .filter(a => !sitemapHtml.includes(`/works/${a.slug}/`))
    .map(a => `<li><a href="/works/${a.slug}/">${escapeXml(a.title)}</a></li>`)
    .join('\n        ');
  if (missingWorkLis) {
    const workAnchor = '<li><a href="/works/4336735300320/">';
    if (sitemapHtml.includes(workAnchor)) {
      sitemapHtml = sitemapHtml.replace(workAnchor, `${missingWorkLis}\n        ${workAnchor}`);
    } else {
      sitemapHtml = sitemapHtml.replace('<li><a href="/works/">全作品一覧</a></li>', `<li><a href="/works/">全作品一覧</a></li>\n        ${missingWorkLis}`);
    }
    sitemapHtmlChanged = true;
  }
  if (sitemapHtmlChanged) {
    await fs.writeFile(sitemapHtmlPath, sitemapHtml, 'utf8');
    console.log('  Updated /sitemap/index.html');
  }

  // 8. /rss.xml の更新
  console.log('[Step 8] Updating public/rss.xml...');
  const rssPath = path.join(root, 'public/rss.xml');
  let rssXml = await fs.readFile(rssPath, 'utf8');
  const rssItems = articles
    .filter(a => !rssXml.includes(`/works/${a.slug}/`))
    .map(a => `<item><title>${escapeXml(a.title)}</title><link>${siteUrl}/works/${a.slug}/</link><description>${escapeXml(a.description)}</description><pubDate>${a.pubDateRfc}</pubDate></item>`)
    .join('\n    ');
  if (rssItems) {
    rssXml = rssXml.replace('<item>', `${rssItems}\n    <item>`);
    await fs.writeFile(rssPath, rssXml, 'utf8');
    console.log('  Updated /rss.xml');
  }

  // 9. /sitemap.xml の更新
  console.log('[Step 9] Updating public/sitemap.xml...');
  const sitemapXmlPath = path.join(root, 'public/sitemap.xml');
  let sitemapXml = await fs.readFile(sitemapXmlPath, 'utf8');
  const todayStr = '2026-11-20';
  for (const book of articles) {
    const bookUrl = `${siteUrl}/works/${book.slug}/`;
    if (!sitemapXml.includes(bookUrl)) {
      const entry = `  <url>\n    <loc>${bookUrl}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      sitemapXml = sitemapXml.replace('</urlset>', `${entry}</urlset>`);
    }
  }
  const featUrl = `${siteUrl}/features/${featureSlug}/`;
  if (!sitemapXml.includes(featUrl)) {
    const entry = `  <url>\n    <loc>${featUrl}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    sitemapXml = sitemapXml.replace('</urlset>', `${entry}</urlset>`);
  }
  await fs.writeFile(sitemapXmlPath, sitemapXml, 'utf8');
  console.log('  Updated /sitemap.xml');

  console.log('--- ALL SITE PLACEMENT COMPLETED ---');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
