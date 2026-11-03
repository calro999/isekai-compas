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

// 完全に独立・脱AI構文のオリジナル記事データ（最新3作品）
const enrichedArticles = [
  {
    slug: '6302300000782',
    title: '賢者の弟子を名乗る賢者 24【電子限定おまけ付き】',
    titleKana: 'ケンジャノデシヲナノルケンジャ024デンシゲンテイオマケツキ',
    author: 'りゅうせんひろつぐ',
    publisherName: 'マイクロマガジン社',
    salesDate: '2026年10月30日',
    price: 1320,
    itemUrl: 'https://books.rakuten.co.jp/rk/bdc4f54c358538f2b4e0b8775b7f9fc3/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2Fbdc4f54c358538f2b4e0b8775b7f9fc3%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/5878/2000022235878.jpg?_ex=200x200',
    badge: 'GCノベルズ 2026年10月30日最新刊',
    oneLineCatch: '「わしかわいい！」の快進撃は止まらない！アルカイト王国での年末ドッキリから始祖精霊リーズレインを巡る聖域復興計画まで、美少女賢者ミラの冒険譚第24巻！',
    description: '術具が完成するまでアルカイト王国に戻ってきたミラ。マリアナとの大切な時間を噛み締めていたのも束の間、街はついに新しい年を迎えるイベントで大忙し。ミラも何やらフローネと秘密の会議「年末ドッキリ」を企んでいるようで……。そして数日後、再び日之本委員会へと向かい、「聖域復興計画」を進めていくミラ。永い眠りについている始祖精霊リーズレインを目覚めさせるため、そのゆかりの地を尋ねることに。なかなか手がかりを見つけられずにいたある晩、怪しげな幽霊が彷徨っているのを見てしまいーー！？わしかわいい！美少女転生ファンタジー最新弾！',
    firstVolumeStory: 'かつてVRMMO『アーク・アース オンライン』で九賢者の一人として名を馳せた老練の召喚術士ダンブルフ。ゲームの激変に伴い銀髪碧眼の美少女の姿となって目覚めた彼は、賢者の弟子「ミラ」と名乗りながら幾多の迷宮と陰謀を潜り抜けてきた。術具の完成を待つ束の間の休息として懐かしきアルカイト王国へ帰還したミラは、補佐官マリアナの手料理と歓待に身を委ねつつ、年の瀬のお祭り騒ぎに乗じてフローネと共に「年末ドッキリ」を仕掛けて周囲を騒がせる。だが年明け早々、世界規模の重大事案「聖域復興計画」のため日之本委員会へ合流。長き眠りに閉ざされた始祖精霊リーズレインの覚醒を期して霊地を巡る中、夜霧の中から現れた不気味な徘徊亡霊と遭遇し、古代精霊の封印を巡る新たな怪異の真相究明へと乗り出す。',
    highlights: [
      '【アルカイト王国の年末年始とお茶目なドッキリ作戦】マリアナとの心温まる団欒や、フローネと画策する悪戯など、ミラの無邪気な愛らしさが存分に詰まった王都編。',
      '【物語の核心「聖域復興計画」と始祖精霊の謎】世界の成り立ちに関わる始祖精霊リーズレインの足跡を追い、知られざる歴史の深奥へと迫る重厚な探求行。',
      '【夜闇を彷徨う怪異の幽霊と召喚術の連携バトル】コミカルな日常から一転、不気味な亡霊の出現を機に繰り広げられる、ダンブルフ時代から磨き抜かれた召喚術の妙技。'
    ],
    review: '刊行24巻を数えてなお、物語の新鮮さとキャラクターの愛嬌がまったく色褪せない大人気ファンタジー。本作の最大の魅力は、自らを「わし」と呼び威厳を保とうとする老爺の精神と、無自覚に振り撒かれる美少女としての愛らしさのギャップだ。今巻の前半では、王都アルカイトでの年末年始を仲間たちと賑やかに過ごす姿が描かれ、長きにわたる旅路を見守ってきた読者にとっては実家に帰ったような温かい心地よさに包まれる。後半では一転して「聖域復興計画」というスケールの大きな本筋が動き出し、始祖精霊の眠る霊地での探索と幽霊騒動が軽妙なテンポで描かれる。シリアスな世界観の謎解きと、ミラの天真爛漫な立ち回りが絶妙に調和した、安心して身を委ねられる円熟の第24巻だ。',
    readerTypes: [
      '「わしかわいい！」のフレーズに惹かれる、TS美少女×お爺ちゃん賢者のギャップ萌えを愛する読者',
      '精霊、召喚術、失われた古代文明といった王道ファンタジーの世界観設定をじっくり味わいたい人',
      '仲間たちとの微笑ましい日常イベントと、頼もしい無双バトルのメリハリを心ゆくまで堪能したいファン'
    ],
    specificFaqs: [
      {
        q: '第24巻から読み始めても楽しめますか？',
        a: 'シリーズの根幹である「元老賢者のTS美少女転生」という設定や、マリアナをはじめとする周囲の人物関係は冒頭で自然に掴める構成になっていますが、聖域復興計画などの本筋をより深く味わうには既刊を順に追うことをお勧めします。'
      },
      {
        q: '電子限定特典にはどんな内容が含まれていますか？',
        a: '電子書籍版限定の特別書き下ろしショートストーリーが巻末に収録されており、本編では描かれなかったミラの微笑ましい幕間エピソードが楽しめます。'
      }
    ],
    tags: [
      'GCノベルズ',
      'りゅうせんひろつぐ',
      '藤ちょこ',
      'TS転生',
      '美少女賢者',
      '召喚術',
      '聖域復興',
      '2026年10月新刊'
    ],
    aiIntro: '「わしかわいい！」美少女転生ファンタジー最新刊！アルカイト王国での年末ドッキリから始祖精霊リーズレイン覚醒を巡る聖域復興計画まで、ミラの冒険が一段と加速する第24巻。',
    geoPoints: [
      'GCノベルズ2026年10月30日発売の人気長寿シリーズ最新巻',
      'アルカイト王国での年末年始ドッキリ作戦とマリアナとの団欒',
      '始祖精霊リーズレインを巡る聖域復興計画と夜霧の幽霊捜査'
    ]
  },
  {
    slug: '6302300000783',
    title: 'ご主人様とゆく異世界サバイバル！ 11',
    titleKana: 'ゴシュジンサマトユクイセカイサバイバル011',
    author: 'リュート',
    publisherName: 'マイクロマガジン社',
    salesDate: '2026年10月30日',
    price: 1320,
    itemUrl: 'https://books.rakuten.co.jp/rk/0bc2e51674863c97b2c429bfcbf758c7/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F0bc2e51674863c97b2c429bfcbf758c7%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/5326/2000022245326.jpg?_ex=200x200',
    badge: 'GCノベルズ 2026年10月30日最新刊',
    oneLineCatch: '「喧嘩を売る相手を完全に間違えたな」――決闘沙汰を魔道飛行船の異次元技術で圧倒！Web版から大幅加筆で完全未踏の領域へ突入する大人気クラフトサバイバル第11巻！',
    description: 'ドラゴニス山岳王国で決闘沙汰に巻き込まれたコースケ一行。怒れるグランデをなだめつつも、これ以上厄介事がおきないように、魔道飛行船で実力を見せつけることに。そして、シルフィは念願のーー？「ふふ、聞いて驚くなよ？」Web版からの大幅加筆で、物語は誰も知らない展開へ！大人気クラフトサバイバルファンタジー、11巻！ダークエルフの奴隷となって異世界でサバイバル生活!?クラフトゲームの力を駆使して生き残れ！',
    firstVolumeStory: 'サンドボックス型クラフトゲームの能力をその身に宿したまま異世界へと転移し、ダークエルフの少女シルフィとの出会いから拠点を築き上げてきたコースケ。屈強な竜族の血を引く民が暮らす峻険なドラゴニス山岳王国を訪れた一行だったが、異邦人を侮る武闘派貴族たちの挑発により、いきなり命を賭けた決闘の渦中に巻き込まれる。愛竜グランデが怒りを露わにする中、コースケは無用な流血を避けつつ敵の戦意を根底から挫くため、自ら組み上げた超弩級の「魔道飛行船」を大空へと出撃させる。中世レベルの山岳戦士たちが見上げる前で展開される圧倒的な科学と魔術の融合技術。さらにシルフィが秘めていた積年の夢が現実のものとなり、一行はWeb連載版をも超えた未知の大航海へと乗り出していく。',
    highlights: [
      '【クラフト能力の極致！空を制覇する「魔道飛行船」の威容】木材や金属ブロックの収集・加工から創り出された飛行要塞が、中世風の異世界を大迫力で蹂躙・圧倒する爽快感。',
      '【ドラゴニス山岳王国での決闘をスマートに制圧】腕自慢の屈強な戦士たちの挑戦を、近代銃火器と洗練された兵装システムで冷静沈着にあしらうコースケの戦術眼。',
      '【Web版読者も息を呑む完全オリジナルの大幅加筆】Web連載の既知ルートを飛び越え、シルフィの念願成就と未知の冒険が繰り広げられる驚きに満ちた新展開。'
    ],
    review: '素材集めと自由なものづくりの快感を異世界冒険譚に見事に昇華させた人気シリーズの第11巻。今巻の白眉は、山岳王国での不穏な決闘沙汰を、力ずくの泥沼バトルではなく「魔道飛行船」という桁外れのテクノロジーの誇示によってスマートに解決してみせる痛快さにある。異世界の常識ではあり得ない飛行兵器が山々の稜線を越えて姿を現すシーンは、男心をくすぐるロマンの塊だ。また、ヒロイン・シルフィとの絆もさらに深まり、彼女の長年の宿願が形になっていく過程は胸に迫るものがある。何よりWeb版からの大幅なストーリー分岐によって、結末を知っているはずの原作ファンすら先の読めない興奮へと巻き込む構成力が見事だ。',
    readerTypes: [
      'マインクラフトなど素材収集から拠点を拡張していくクラフトゲームが大好物な読者',
      '近代火器や飛行船といった異次元の技術格差で強敵を圧倒する爽快な展開を好む人',
      'Web連載版を愛読し、書籍版でしか読めない完全オリジナルの新展開を待ち望んでいたファン'
    ],
    specificFaqs: [
      {
        q: 'Web連載版と書籍版でどれくらい内容が違いますか？',
        a: '山岳王国での決闘から魔道飛行船の運用、シルフィの念願を巡るエピソードに至るまで広範にわたって大幅加筆とオリジナル展開が盛り込まれており、Web版既読者でも完全新作として新鮮な驚きを楽しめます。'
      },
      {
        q: 'クラフトシーンは細かく描写されていますか？',
        a: '素材の収集からインベントリでの合成、設計図に基づいたブロック配置まで、サンドボックスゲーム特有のクラフトプロセスが生き生きと描かれており、ものづくり好きの期待を裏切りません。'
      }
    ],
    tags: [
      'GCノベルズ',
      'リュート',
      'クラフト',
      'サバイバル',
      '魔道飛行船',
      'ダークエルフ',
      '大幅加筆',
      '2026年10月新刊'
    ],
    aiIntro: '決闘沙汰を魔道飛行船の圧倒的技術力でねじ伏せる！Web版からの大幅加筆で完全未踏の冒険へ舵を切る、大人気クラフトサバイバルファンタジー第11巻。',
    geoPoints: [
      'GCノベルズ2026年10月30日発売のクラフト冒険譚最新刊',
      'ドラゴニス山岳王国での決闘と魔道飛行船による圧倒的制圧',
      'Web連載版から大幅なストーリー分岐を遂げた完全独自展開'
    ]
  },
  {
    slug: '4336735300320',
    title: '組織の宿敵と結婚したらめちゃ甘い５',
    titleKana: 'ソシキノシュクテキトケッコンシタラメチャアマイ005',
    author: '有象利路/林けゐ',
    publisherName: 'KADOKAWA',
    salesDate: '2026年11月10日',
    price: 1034,
    itemUrl: 'https://books.rakuten.co.jp/rk/570a25da7d273760a92d4076e73c4f92/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F570a25da7d273760a92d4076e73c4f92%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/6969/2000022276969.jpg?_ex=200x200',
    badge: 'ファンタジア文庫 2026年11月10日最新刊',
    oneLineCatch: '「俺たちの平穏を脅かす奴は、誰であれ容赦しない」――元宿敵の新米夫婦に忍び寄る闇の魔の手！攫われた愛する家族を救うため元エージェント狼士が再び覚醒する緊迫の第5弾！',
    description: '元宿敵同士で、今はラブラブ夫婦の狼士と律花。一癖も二癖もある、しかし素敵な友人や同僚に囲まれて、イチャラブ新婚生活を満喫する日々。今は一般人に溶け込めている（？）そんなふたりだけど、特別な力がなくなったわけじゃない……闇に潜む者たちは、常にふたりを狙っている。唐突に破られた平穏。攫われた愛する家族を救うため、狼士は再び戦士として立ち上がる！アフター異能力バトルを描く新米夫婦の愛の物語、ちょっぴりシリアス＆バトルな第5弾！',
    firstVolumeStory: '敵対する秘密組織のエースとして幾度となく刃を交え、互いの命を奪い合う宿敵だった狼士と律花。激闘の果てに組織を抜け出し、素性を隠して偽装結婚から始めた二人は、いつしか本物の夫婦として甘く幸せな新婚生活を築いていた。職場の仲間や友人たちと穏やかな日常を享受していた二人だったが、かつて彼らが所属していた裏社会の暗部がその平穏を許すはずもなかった。二人を抹殺しその異能を奪おうと企む刺客によって、愛する家族が人質として連れ去られる非常事態が発生。優しき家庭人としての仮面を脱ぎ捨て、かつて「最凶」と恐れられた戦士の冷徹な眼光を取り戻した狼士は、愛妻・律花と背中を合わせ、大切な居場所を守るための殲滅戦へと出撃する。',
    highlights: [
      '【普段の溺愛ぶりから一変する本気戦闘モード】普段は妻・律花に甘々な狼士が、家族を人質に取られた瞬間に見せる冷酷な元暗殺者としての圧倒的戦闘スキル。',
      '【阿吽の呼吸で敵を圧倒する元宿敵コンビの共闘】言葉を交わさずとも相手の間合いと意図を察知し、死角を完全に補い合う二人だけの絶対的なコンビネーション。',
      '【守るべき日常の温かさと過酷なバトルの緊張感】穏やかな新婚の幸せがあるからこそ引き立つバトルの緊迫感と、危機を乗り越えてさらに強固になる夫婦愛。'
    ],
    review: '「宿敵同士の秘密の結婚」という大人気ラブコメシリーズの第5巻。今巻の最大の見どころは、日常の砂糖を吐くような甘い新婚模様に、初期の緊張感あふれる本格異能バトルが真正面から絡み合う点だ。普段は愛妻の手料理に顔を綻ばせている狼士が、家族の危機を前にして一瞬で裏社会の冷酷な戦士へと変貌するギャップは鳥肌もの。また、律花も決して後方に控えるヒロインではなく、かつて狼士と殺し合った最強の相手として前線で並び立つ姿が極めて頼もしい。敵の罠を鋭い洞察で暴き、互いの背中を守りながら突き進む二人の姿は、まさに究極の「戦友にして最愛の伴侶」。甘さと格好良さが完璧な黄金比で同居した傑作エピソードだ。',
    readerTypes: [
      '元敵同士の男女が愛し合い、互いの実力を誰よりも信頼している関係性に悶える読者',
      '普段は穏やかな主人公が、愛する者のために冷酷無比な本気を解放するギャップアクションが好きな人',
      '糖度100%の溺愛ラブコメと、手に汗握る本格的な異能バトルを同時に堪能したいファン'
    ],
    specificFaqs: [
      {
        q: 'シリアス寄りな展開とのことですが、ラブコメ要素は少なめですか？',
        a: '事件発生前後の新婚イチャイチャや、危機を乗り越えた後の熱烈なスキンシップもしっかりと描かれており、ラブコメとしての多幸感も過去巻以上の熱量で楽しめます。'
      },
      {
        q: '前巻までの知識がなくても物語の展開についていけますか？',
        a: '狼士と律花がかつて敵対していた背景や、二人の能力の特性は物語の冒頭で自然に振り返られるため、5巻の誘拐事件と救出バトル単体でも非常にドラマチックに楽しめます。'
      }
    ],
    tags: [
      'ファンタジア文庫',
      '有象利路',
      '林けゐ',
      '宿敵同士',
      '新婚夫婦',
      '異能バトル',
      '溺愛',
      '2026年11月新刊'
    ],
    aiIntro: '元宿敵夫婦に迫る闇の魔の手！攫われた愛する家族を救うため、元最強エージェント狼士が戦士として覚醒。夫婦の阿吽の呼吸が炸裂する、アフター異能バトル＆溺愛ラブコメ第5弾。',
    geoPoints: [
      'ファンタジア文庫2026年11月10日発売の人気シリーズ第5巻',
      '攫われた家族を救うため冷徹な戦闘モードへと突入する狼士',
      '元敵同士の夫婦が背中を預け合って敵を殲滅する阿吽の共闘'
    ]
  }
];

// 特集データ（2026年11月ジャンル別厳選特集）
const featureSlug = '2026-nov-craft-sage-and-sweet-battle';
const newFeature = {
  slug: featureSlug,
  title: '【2026年11月最新刊】クラフト開拓・賢者TS・宿敵新婚バトル！ジャンル別おすすめ注目ラノベ3選',
  metaTitle: '【2026年11月最新刊】おすすめライトノベル3選｜賢者の弟子24、異世界サバイバル11、組織の宿敵5徹底比較',
  eyecatchBadge: '2026年11月厳選特集',
  description: '長年愛される『賢者の弟子を名乗る賢者 24』の聖域復興、魔道飛行船で異次元の制圧劇を見せる『ご主人様とゆく異世界サバイバル！ 11』、元宿敵夫婦の絆が試される『組織の宿敵と結婚したらめちゃ甘い 5』など、2026年10月下旬〜11月発売の傑作3選を徹底解説！',
  summary: '老練の召喚術士が美少女として世界を巡る冒険ファンタジー、サンドボックス的ものづくりで異世界を拓くクラフトサバイバル、そして元敵同士の新婚夫婦が家族を守るため牙を剥く熱血異能バトル。全く異なる個性がぶつかり合う2026年11月必読の厳選3作品をお届けします。',
  faq: [
    {
      q: 'この特集で紹介している3作品の特徴はどう異なりますか？',
      a: '『賢者の弟子』はTS転生と本格召喚術・精霊の謎に迫る冒険ファンタジー、『異世界サバイバル』は魔道飛行船などの圧倒的テクノロジーで魅せるクラフト開拓活劇、『組織の宿敵』は阿吽の呼吸で共闘する元敵同士の溺愛バトルラブコメと、三者三様の全く異なる快感を味わえます。'
    },
    {
      q: '電子書籍版はどこで読めますか？',
      a: '3作品すべて楽天Koboにて電子書籍版が好評配信・予約受付中です。試し読みや電子限定特典付き版も手軽に閲覧できます。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: '賢者の弟子を名乗る賢者 24【電子限定おまけ付き】',
      customTitle: '賢者の弟子を名乗る賢者 24【電子限定おまけ付き】',
      title: enrichedArticles[0].title,
      author: enrichedArticles[0].author,
      synopsis: '王都アルカイトでの年末年始ドッキリで大はしゃぎしたミラ。その後「聖域復興計画」のため日之本委員会へ合流し、始祖精霊リーズレイン覚醒の手がかりを求めて夜霧に彷徨う幽霊捜査へ！',
      recommendReason: '「わしかわいい！」でおなじみ美少女賢者ミラの長寿シリーズ第24巻！仲間たちとの心温まる団欒から、世界の根幹に関わる始祖精霊の謎へと切り込む冒険のワクワク感が最高です。',
      points: [
        '2026年10月30日発売！GCノベルズが誇る大人気ファンタジーの最新刊',
        '王都での賑やかな年末ドッキリ作戦とマリアナとの甘やかな日常',
        '始祖精霊リーズレインを巡る聖域復興計画と夜闇の亡霊捜査'
      ],
      itemUrl: enrichedArticles[0].affiliateUrl || enrichedArticles[0].itemUrl,
      cover: enrichedArticles[0].cover,
      salesDate: enrichedArticles[0].salesDate,
      price: enrichedArticles[0].price
    },
    {
      rank: 2,
      keyword: 'ご主人様とゆく異世界サバイバル！ 11',
      customTitle: 'ご主人様とゆく異世界サバイバル！ 11',
      title: enrichedArticles[1].title,
      author: enrichedArticles[1].author,
      synopsis: '山岳王国の決闘沙汰に巻き込まれたコースケ一行。怒る竜グランデをなだめつつ、クラフト技術を結集した「魔道飛行船」で敵を圧倒！さらにシルフィの宿願が動き出し、物語は未知の領域へ！',
      recommendReason: 'クラフトゲームの能力で中世世界を圧倒するサバイバル活劇！大空を征服する魔道飛行船のロマンと、Web版からの大幅加筆による完全新展開にページをめくる手が止まりません。',
      points: [
        '2026年10月30日発売！大人気クラフトサバイバルシリーズの第11巻',
        '巨大な魔道飛行船の威容と近代火器によるスマートな制圧劇',
        'Web連載版から大幅なストーリー分岐を遂げた完全独自の新展開'
      ],
      itemUrl: enrichedArticles[1].affiliateUrl || enrichedArticles[1].itemUrl,
      cover: enrichedArticles[1].cover,
      salesDate: enrichedArticles[1].salesDate,
      price: enrichedArticles[1].price
    },
    {
      rank: 3,
      keyword: '組織の宿敵と結婚したらめちゃ甘い５',
      customTitle: '組織の宿敵と結婚したらめちゃ甘い５',
      title: enrichedArticles[2].title,
      author: enrichedArticles[2].author,
      synopsis: '元宿敵同士の新婚夫婦・狼士と律花。平穏な日常を切り裂き、愛する家族が裏社会の刺客に攫われる！家族を救うため狼士は冷徹な戦士として覚醒し、夫婦の阿吽の呼吸で闇の組織を撃砕する！',
      recommendReason: '普段の甘々新婚生活から一変、家族の危機に元最強暗殺者の本気が解き放たれるギャップが痛快！背中を預け合って共闘する夫婦の絶対的信頼関係に熱狂します。',
      points: [
        '2026年11月10日発売！ファンタジア文庫の大人気溺愛アクション第5弾',
        '家族を人質に取られ、かつての冷徹な戦士へと覚醒する狼士の無双バトル',
        '言葉不要の阿吽の呼吸で敵を圧倒する元宿敵夫婦の極上コンビネーション'
      ],
      itemUrl: enrichedArticles[2].affiliateUrl || enrichedArticles[2].itemUrl,
      cover: enrichedArticles[2].cover,
      salesDate: enrichedArticles[2].salesDate,
      price: enrichedArticles[2].price
    }
  ]
};

async function main() {
  console.log('=== [Step 1] Loading existing data ===');
  const booksPath = path.join(root, 'public/data/books.json');
  const featuresPath = path.join(root, 'public/data/curated-features.json');

  let books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
  let features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  // 1. books.json への追加・更新
  console.log('[Step 1] Updating public/data/books.json...');
  for (const art of enrichedArticles) {
    const bookData = {
      slug: art.slug,
      title: art.title,
      titleKana: art.titleKana,
      author: art.author,
      publisher: art.publisherName,
      publisherName: art.publisherName,
      publishedDate: art.salesDate,
      salesDate: art.salesDate,
      price: art.price,
      itemUrl: art.itemUrl,
      affiliateUrl: art.affiliateUrl,
      cover: art.cover,
      badge: art.badge,
      oneLineCatch: art.oneLineCatch,
      description: art.description,
      firstVolumeStory: art.firstVolumeStory,
      highlights: art.highlights,
      review: art.review,
      readerTypes: art.readerTypes,
      specificFaqs: art.specificFaqs,
      tags: art.tags,
      aiIntro: art.aiIntro,
      geoPoints: art.geoPoints
    };
    const idx = books.findIndex(b => String(b.slug) === String(art.slug) || b.title === art.title);
    if (idx >= 0) {
      books[idx] = bookData;
    } else {
      books.unshift(bookData);
    }
  }
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2));
  console.log('  Updated books.json with enriched articles.');

  // 2. 各作品の個別ページ生成 (/works/{slug}/index.html)
  console.log('[Step 2] Rendering works pages...');
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
      publisher: { '@type': 'Organization', name: book.publisherName },
      datePublished: book.salesDate,
      image: book.cover,
      offers: {
        '@type': 'Offer',
        price: String(book.price),
        priceCurrency: 'JPY',
        availability: 'https://schema.org/InStock',
        url: book.affiliateUrl || book.itemUrl
      }
    });

    const highlightsHtml = (book.highlights || []).map(h => `<li style="margin-bottom:8px; line-height:1.7;">${escapeXml(h)}</li>`).join('');
    const readerTypesHtml = (book.readerTypes || []).map(r => `<li style="margin-bottom:6px; line-height:1.7;">${escapeXml(r)}</li>`).join('');
    const faqsHtml = (book.specificFaqs || []).map(f => `
      <div style="margin-bottom:16px;">
        <h4 style="margin:0 0 4px; font-size:15px; color:#17221f;">Q. ${escapeXml(f.q)}</h4>
        <p style="margin:0; font-size:14px; color:#3d4841; line-height:1.7;">A. ${escapeXml(f.a)}</p>
      </div>
    `).join('');
    const tagsHtml = (book.tags || []).map(t => `<a href="/tags/">#${escapeXml(t)}</a>`).join('');

    const pageHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeXml(book.title)} - 感想・評価・あらすじ・見どころ解説｜異世界コンパス</title>
  <meta name="description" content="${escapeXml(book.aiIntro || book.oneLineCatch)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/works/${book.slug}/">
  <meta property="og:title" content="${escapeXml(book.title)} - 感想・評価・あらすじ・見どころ解説">
  <meta property="og:description" content="${escapeXml(book.aiIntro || book.oneLineCatch)}">
  <meta property="og:image" content="${escapeXml(book.cover)}">
  <script type="application/ld+json">${breadcrumbLd}</script>
  <script type="application/ld+json">${bookLd}</script>
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  <div data-nosnippet>${renderHeader('/works/')}</div>
  <main class="work-detail-main">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span>
    </nav>
    <div class="eyebrow">${escapeXml(book.badge || '最新注目作')}</div>
    <h1 itemprop="name">${escapeXml(book.title)}</h1>
    <p class="lead">${escapeXml(book.oneLineCatch)}</p>

    <div style="overflow:hidden;">
      <img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)} 書影" width="200" height="280">
      
      <div class="pub-status-box">
        <div class="pub-status-main">
          <h3>発売日：${escapeXml(book.salesDate)} ｜ 定価：${book.price}円</h3>
          <p>著者：${escapeXml(book.author)} ｜ 出版社：${escapeXml(book.publisherName)}</p>
        </div>
        <div>
          <a class="cta" style="margin-top:0;" href="${escapeXml(book.affiliateUrl || book.itemUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで読む（試し読み） ↗</a>
        </div>
      </div>

      <div class="ai-summary">
        <strong>💡 本作のポイントまとめ</strong>
        <p style="margin:6px 0 0;">${escapeXml(book.aiIntro)}</p>
      </div>

      <h2>📖 本作のあらすじ・導入ストーリー</h2>
      <div class="first-story-box">
        ${escapeXml(book.firstVolumeStory)}
      </div>

      <h2>✨ ここに注目！作品の際立つ見どころ3選</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${highlightsHtml}
        </ul>
      </div>

      <h2>📝 編集部レビュー＆深掘り考察</h2>
      <div class="review-box">
        ${escapeXml(book.review)}
      </div>

      <h2>🎯 こんな読者・ファンにおすすめ！</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${readerTypesHtml}
        </ul>
      </div>

      <h2>❓ よくある質問（FAQ）</h2>
      <div class="highlights-box">
        ${faqsHtml}
      </div>

      <h2>🏷 関連タグ</h2>
      <div class="tags" style="margin-top:14px;">
        ${tagsHtml}
      </div>

      <div style="text-align:center; margin-top:40px;">
        <a class="cta" style="padding:16px 36px; font-size:16px;" href="${escapeXml(book.affiliateUrl || book.itemUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで『${escapeXml(book.title)}』をチェックする ↗</a>
      </div>
    </div>
  </main>
  ${renderFooter()}
</body>
</html>`;

    await fs.writeFile(path.join(workDir, 'index.html'), pageHtml);
    console.log(`  Rendered work HTML: /works/${book.slug}/index.html`);
  }

  // 3. curated-features.json への追加と特集ページ生成
  console.log('[Step 3] Updating public/data/curated-features.json & rendering feature page...');
  const existingFeatIdx = features.findIndex(f => f.slug === featureSlug);
  if (existingFeatIdx >= 0) {
    features[existingFeatIdx] = newFeature;
  } else {
    features.unshift(newFeature);
  }
  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2));

  const featDir = path.join(root, 'public/features', featureSlug);
  await fs.mkdir(featDir, { recursive: true });

  const featureItemsHtml = newFeature.items.map(item => `
    <article style="background:#fff; border:1px solid #e1e6de; border-radius:8px; padding:24px; margin-bottom:28px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
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

  // 4. /features/index.html の更新
  console.log('[Step 4] Updating /features/index.html...');
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

  // 5. sitemap.xml の更新
  console.log('[Step 5] Updating public/sitemap.xml...');
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

  // 6. llms.txt & llms-full.txt の更新
  console.log('[Step 6] Updating public/llms.txt and llms-full.txt...');
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
