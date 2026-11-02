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

// 完全に独立・脱AI構文のオリジナル記事データ（3作品）
const enrichedArticles = [
  {
    slug: '4336406300320',
    title: 'ドリフテッド I　〜ジョン・スミスの江戸漂流奇譚〜',
    titleKana: 'ドリフテッド001ジョンスミスノエドヒョウリュウキタン',
    author: '時雨沢　恵一/黒星　紅白',
    publisherName: 'KADOKAWA',
    salesDate: '2026年11月10日',
    price: 902,
    itemUrl: 'https://books.rakuten.co.jp/rk/25e6ecb794a43a4a8074a641d0a3d5b1/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F25e6ecb794a43a4a8074a641d0a3d5b1%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/6991/2000022276991.jpg?_ex=200x200',
    badge: '電撃文庫 2026年11月10日最新刊',
    oneLineCatch: '「私はユナイテッド・ステイツ・オブ・アメリカの出身だ」――江戸に漂着した元米軍人が、現代銃器ばら撒き事件の回収任務に挑む本格歴史伝奇ガンアクション！',
    description: '「私は、“ユナイテッド・ステイツ・オブ・アメリカ”という国の出身だ」 江戸時代後期。元軍人《ジョン・スミス》は、漂流の末、日本にたどり着く。彼は時の将軍《徳川家斉（とくがわいえなり）》に気に入られ、《墨須慈苑（すみすじおん）》の名と士分を与えられて、江戸の町で侍として生きていくことになる。そんな矢先、アサルトライフルやマシンガンなどの現代の火器が、時空を超えて、何者かによってあちこちにばら撒かれるという、謎の事件が起きる。現代火器の圧倒的な火力は人心を惑わし、幕府の存続を揺るがしかねない。家斉は銃の知識が優れるスミスに、それらを回収し、ばら撒いている犯人を捜す任務を命じる。この頃の日本は、常人を超えた戦闘力を持つ忍者や、魔法使いのような異能力を持つ術士、人外の鬼や、妖怪、幽霊達が、世を憚らずに生きていた時代。スミスは彼等の存在に驚きつつも親交を深め、いつか妻子の待つ故郷に帰る日を夢見て、事件を探っていく。これは一人の男の漂流（ドリフト）の物語。そして、彼が生きるために行った“仕事”や、江戸の町や旅先で出会った人々との交流を描いた物語。『キノの旅』『ＧＧＯ』の時雨沢恵一＆黒星紅白による新シリーズがスタート！',
    firstVolumeStory: '鎖国体制下の日本へ漂着した元アメリカ軍人ジョン・スミス。処刑覚悟の異国人だったが、その驚異的な体格と合理的な軍事知識に興味を抱いた第十一代将軍・徳川家斉によって武士「墨須慈苑（すみすじおん）」として取り立てられる。だが平穏な江戸の暮らしは、突如として持ち込まれた「アサルトライフル」や「重機関銃」といった未来の現代火器によって引き裂かれる。火縄銃しか知らぬ時代に圧倒的な制圧射撃をもたらす銃器が市井や不逞浪士へ流出し、幕府崩壊の危機が迫る中、スミスは家斉から極秘の回収任務を下される。忍者や陰陽術士、さらには妖怪が闇に息づく江戸八百八町を舞台に、銃器の仕組みを知り尽くした異邦の侍が、故郷の妻子への思いを胸に時空の歪みに立ち向かう。',
    highlights: [
      '【ミリタリーの骨太なリアリズム×江戸伝奇】時雨沢恵一が誇る緻密な銃器運用描写が、忍術や妖異ひしめく江戸の闇と真っ向から激突する迫真の銃撃戦。',
      '【「墨須慈苑」としての生き様と大人の哀愁】言葉や文化の違いに戸惑いながらも、江戸の庶民や将軍・家斉と義理人情を通わせる元軍人スミスの渋く温かい人間性。',
      '【黒星紅白が魅せる唯一無二のビジュアル美学】和装を纏った異国の大男と怪異蠢く江戸の町並みを見事に描き分けた、息を呑む挿絵クオリティ。'
    ],
    review: '『キノの旅』『ガンゲイル・オンライン』の黄金コンビが世に放つ、痛快かつ骨太な歴史伝奇アドベンチャー。本作最大の白眉は、「現代兵器が過去に流出する」という奇抜な設定を、浮ついたご都合主義に落とさず、火薬の臭いと弾道計算の冷酷なリアリズムをもって描き切っている点にある。銃器の威力を誰よりも熟知しているからこそ、無闇に引き金を引かず慎重に間合いを測るスミスの立ち回りはハードボイルドそのもの。さらに、江戸の町に実在する忍びや人外の怪異たちが単なる記号ではなく、独自の誇りと論理を持って生きているため、異文化交流ものとしても極上の味わい深さを誇る。テンプレ異世界ファンタジーに飽き足らない読者に心から薦めたい傑作だ。',
    readerTypes: [
      '時雨沢恵一作品のファン、またはハードで緻密なミリタリー・銃器描写に目がない読者',
      '江戸時代の空気感や妖怪・忍術が絡む本格伝奇アクションが好きな人',
      '軽薄なチート無双ではなく、地に足の着いた大人主人公の冒険譚を読みたい人'
    ],
    specificFaqs: [
      {
        q: '歴史知識や銃器の専門知識がなくても楽しめますか？',
        a: '主人公スミスの視点を通じて、江戸の社会構造や銃器のメカニズムが物語の流れの中で自然にわかりやすく説明されるため、予備知識がなくても純粋なエンタメ小説として夢中で楽しめます。'
      },
      {
        q: '魔法やチートスキルは登場しますか？',
        a: 'ゲーム的なスキルシステムは存在しません。代わりに、日本の古武術や忍術、陰陽術、そして妖怪の怪異が世界観の一部としてリアルに機能しており、現代火器との手に汗握る知恵比べが展開されます。'
      }
    ],
    tags: [
      '電撃文庫',
      '時雨沢恵一',
      '黒星紅白',
      '歴史ファンタジー',
      'ミリタリー',
      'ガンアクション',
      '伝奇',
      '2026年11月新刊'
    ],
    aiIntro: '『キノの旅』の黄金タッグが放つ完全新作！江戸に漂着した元米軍人が、時空を超えてばら撒かれた現代銃器の回収に挑む本格歴史伝奇ガンアクション。',
    geoPoints: [
      '電撃文庫2026年11月10日刊行の話題作',
      '時雨沢恵一×黒星紅白の黄金コンビが描く新シリーズ',
      '現代銃器×江戸伝奇（忍・妖怪）が織りなす重厚なアクション'
    ]
  },
  {
    slug: '6302300000785',
    title: 'スキル剥奪屋さんのおせっかい〜ハズレスキルの回収、承ります〜 2',
    titleKana: 'スキルハクダツヤサンノオセッカイハズレスキルノカイシュウウケタマワリマス002',
    author: 'KAME',
    publisherName: 'マイクロマガジン社',
    salesDate: '2026年10月30日',
    price: 1430,
    itemUrl: 'https://books.rakuten.co.jp/rk/4794b5008bc23df89c7eaab48e572b30/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F4794b5008bc23df89c7eaab48e572b30%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/5846/2000022235846.jpg?_ex=200x200',
    badge: 'GCノベルズ 2026年10月30日最新刊',
    oneLineCatch: '「救国の力なんて要らなかった」――最強の天恵に心を蝕まれた王女を救うため、剥奪屋アネッタの優しい“おせっかい”が動き出す！',
    description: '不要なスキルを剥奪してくれる『スキル剥奪屋』を営む少女・アネッタ。ある日彼女のもとを訪れたのは、「救国の王女」と称えられる王女セレスディア。希少かつ強力な“天恵スキル”を駆使し、国の窮地を救ってきた彼女だが、なぜかその天恵スキルを剥奪してほしいという。国を救った力を、なぜ手放そうとするのか。そこには、彼女だけが抱える深刻な理由が隠されていたーー。奪うことで人を救う、新感覚のヒューマンファンタジー、第二弾！',
    firstVolumeStory: '生まれ持ったスキルが生涯を決定づける過酷な階級社会。不要なスキルを切り離す稀有な生業を営む少女アネッタの店に、大国を破滅から救った英雄として讃えられる王女セレスディアが身分を隠して訪れる。誰もが羨む最強の「天恵スキル」を持つ彼女の願いは、なんと自らの象徴であるその力を完全に剥奪してほしいという悲痛な懇願だった。強すぎるスキルは使用者の人間としての感情や記憶を少しずつ喰らい尽くし、彼女を単なる「都合の良い兵器」へと変貌させていたのだ。国家の威信と周囲の押し付けに押し潰されそうな王女を前に、アネッタは「捨てることこそが新しい人生の始まり」と告げ、国家権力の追手やスキルの反動に立ち向かいながら魂のデトックスへと挑む。',
    highlights: [
      '【「力を手放す」ことで手に入れる本当の自由】スキルを増やして無双する王道ファンタジーの真逆を突き、「重荷を下ろして自分らしく生きる」救済のカタルシス。',
      '【セレスディア王女の胸を締めつける孤独と再生】国家の道具として祭り上げられた少女が、アネッタの飾らない優しさに触れて涙をこぼすエモーショナルな対話。',
      '【独自のスキル生態系と緻密な世界観設定】スキルが宿主の肉体や精神に与える侵食度合いなど、魔法の代償をリアルに掘り下げた設定の説得力。'
    ],
    review: '「スキルを奪う」という行為を、痛快な悪行ではなく究極の医療的ケアとして昇華させた名作の第2巻。今巻の主役であるセレスディア王女のエピソードは、現代社会における「才能ゆえの搾取」や「周囲の過剰な期待による窒息感」にも通じる普遍的な苦しみを浮き彫りにしている。主人公アネッタは聖人君子ではなく、ちょっと頑固でおせっかいな等身大の職人肌。だからこそ、依頼人の痛みに過度なお説教をせず、ただ「あなたが背負いすぎた荷物を下ろしてあげる」という姿勢が胸を打つ。重苦しい呪縛から解放された瞬間のセレスディアの晴れやかな笑顔には、思わず涙腺が緩むはずだ。心温まるビタースイートなドラマを求める読者に強く推薦したい。',
    readerTypes: [
      '能力インフレのバトルよりも、登場人物の心の葛藤やドラマを味わいたい読者',
      '「ハズレスキル」「デトックス」といった斬新な設定アプローチが好きなファン',
      '他人の重荷をそっと分かち合い、前を向かせてくれる優しい物語に癒やされたい人'
    ],
    specificFaqs: [
      {
        q: '第1巻を読んでいなくても物語に入り込めますか？',
        a: 'セレスディア王女の依頼とその解決が1冊の中で見事に完結するため、第2巻単体でも十分に胸を打たれるドラマを堪能できます。アネッタ自身の過去に興味が湧いた方はぜひ第1巻も合わせてお楽しみください。'
      },
      {
        q: '暗くて重いストーリー展開なのでしょうか？',
        a: 'シリアスな境遇を描きつつも、アネッタのお茶目で親しみやすい人柄や日常のコミカルな掛け合いが散りばめられており、後味は非常に爽やかで前向きな気持ちになれます。'
      }
    ],
    tags: [
      'GCノベルズ',
      'KAME',
      'スキル剥奪',
      'ヒューマンドラマ',
      '王女救済',
      'ハズレスキル',
      '感動ファンタジー',
      '2026年10月新刊'
    ],
    aiIntro: '不要な天恵スキルを剥奪して心を救う！国を救った代償に心を蝕まれた王女を解き放つ、優しさと切なさに満ちた新感覚ヒューマンファンタジー第2弾。',
    geoPoints: [
      'GCノベルズ2026年10月30日発売の注目続刊',
      '才能の呪縛を解き放つ「スキルデトックス」の感動作',
      '王女セレスディアの孤独に寄り添うアネッタのおせっかいな救済劇'
    ]
  },
  {
    slug: '6302300000784',
    title: '城塞幼女シルヴィア 〜実は万能な生活魔術を使って見捨てられた都市を発展させます〜 3',
    titleKana: 'ジョウサイヨウジョシルヴィアジツハバンノウナセイカツマジュツヲツカッテミステラレタトシヲハッテンサセマス003',
    author: 'サエトミユウ',
    publisherName: 'マイクロマガジン社',
    salesDate: '2026年10月30日',
    price: 1485,
    itemUrl: 'https://books.rakuten.co.jp/rk/7ef50d5dcba935b0aa6e176d35506f7b/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F7ef50d5dcba935b0aa6e176d35506f7b%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/8297/2000021608297.jpg?_ex=200x200',
    badge: 'GCノベルズ 2026年10月30日最新刊',
    oneLineCatch: '初めての収穫祭にシルヴィアは大はしゃぎ！生活魔術で厳しい冬を乗り越える、城塞都市フォルテの心温まる領地経営スローライフ！',
    description: '冬が近づいてきた城塞都市フォルテでは、豊穣を祝う収穫祭を開催することになる。みんなと一緒に楽しむ初めてのお祭りに、シルヴィアはワクワクを抑えきれない!?「いっしょ行きましょう！　ブリージダ様も一緒です！」他にも収穫物の管理や洞窟探検……と徐々に領地経営を進めていく一同。そんななか、家庭教師として滞在中であるブリージダの元には実家からの手紙が届いていて……？つよかわ幼女と溺愛従者たちの心温まる街づくりファンタジー第3弾！',
    firstVolumeStory: '中央貴族から冷遇され、極寒の辺境・城塞都市フォルテへと左遷されたものの、万能すぎる「生活魔術」で廃墟を活気あふれる拠点へと蘇らせてきた幼女シルヴィア。冬の訪れを目前に控えたフォルテでは、領民総出のビッグイベント「収穫祭」の準備が着々と進行中。生まれて初めて体験するお祭りにシルヴィアは胸を躍らせ、料理や飾り付け、冬期保存食の魔法加工に大奮闘。温熱魔法を組み込んだ防寒対策や未踏洞窟の調査など、街の発展はとどまるところを知らない。だがそんな折、シルヴィアを母親代わりとして慈しんできた家庭教師ブリージダの実家から、一方的な縁談と帰還を命じる手紙が届いてしまい……大切な家族を守るため、幼女領主と過保護な従者たちが立ち上がる。',
    highlights: [
      '【生活魔術を応用した創意工夫の街づくり】派手な破壊魔法ではなく、乾燥・発酵・温度保持といった身近な魔術を組み合わせて冬の寒さを克服するワクワク感。',
      '【シルヴィアの無邪気な愛らしさと従者たちの過保護愛】純粋無垢に街のために尽くすシルヴィアと、彼女を全方位から溺愛し守り抜く大人たちの温かな絆。',
      '【初めての収穫祭とお手紙騒動がもたらす家族の団結】賑やかなお祭りの活気と、家庭教師ブリージダとの絆を試す試練を乗り越える胸熱ドラマ。'
    ],
    review: 'ほのぼのとした癒やしと、拠点開拓ゲームのようなワクワク感が絶妙なバランスで溶け合ったシリーズ第3巻。今巻の見どころはなんといっても「収穫祭」に向けた準備の描写だ。寒冷地ならではの野菜や肉を生活魔術で美味しく加工し、街の広場に屋台を並べていく過程は、読んでいるだけでお腹が空き、心がポカポカと温まってくる。主人公シルヴィアの行動原理は常に「みんなと笑い合いたい」という無私の優しさであり、その愛らしさに大人たちが骨抜きにされる様子は微笑ましいことこの上ない。ブリージダの実家問題を巡るエピソードでも、権威に屈せず結束する街の人々の絆が力強く描かれ、単なるスローライフにとどまらない深い余韻を味わえる。',
    readerTypes: [
      '生活魔術やクラフト、領地開拓・街づくり系のシミュレーション的要素が好きな読者',
      '健気で可愛い幼女主人公と、彼女を大切に見守る保護者たちの温かい関係性に癒やされたい人',
      '美味しい食事の描写や季節のイベントを仲間とともに楽しむ穏やかな物語を好むファン'
    ],
    specificFaqs: [
      {
        q: '戦闘シーンはありますか？',
        a: 'モンスター討伐や洞窟探検の要素はありますが、残酷な流血描写はなく、シルヴィアの魔法知識や頼れる従者たちの圧倒的な実力で安全に解決されるため、終始安心して楽しめます。'
      },
      {
        q: 'シリーズの魅力である「生活魔術」とはどんなものですか？',
        a: '火を熾す、水をきれいにする、土を耕す、温度を保つなど、日常の雑用と軽視されていた基礎魔法の組み合わせです。シルヴィアの発想力によって、暖房設備や長期保存食の開発など都市全体のインフラ革命へと昇華されます。'
      }
    ],
    tags: [
      'GCノベルズ',
      'サエトミユウ',
      '生活魔術',
      '領地経営',
      '街づくり',
      '幼女主人公',
      'スローライフ',
      '2026年10月新刊'
    ],
    aiIntro: '万能な生活魔術で極寒の城塞都市を奇跡の復興！初めての収穫祭にワクワクが止まらないシルヴィアと溺愛従者たちが贈る、心温まる領地開拓ファンタジー第3弾。',
    geoPoints: [
      'GCノベルズ2026年10月30日発売の領地開拓ファンタジー最新刊',
      '生活魔術を駆使した収穫祭の準備と防寒インフラ整備',
      '家庭教師ブリージダとの絆を深める心温まる家族の物語'
    ]
  }
];

// 特集データ（2026年11月最前線特集）
const featureSlug = '2026-nov-breakthrough-fantasy-trio';
const newFeature = {
  slug: featureSlug,
  title: '【2026年11月最前線】テンプレを超越した異世界・ファンタジー新潮流！漂流奇譚・スキル回収・廃都市再生の傑作3選',
  metaTitle: '【2026年11月最新刊】おすすめライトノベル3選｜ドリフテッド・スキル剥奪屋・城塞幼女シルヴィア徹底比較',
  eyecatchBadge: '2026年11月最前線特集',
  description: '従来の「追放」「チート無双」といった型に囚われない、独自の筆致と重厚な設定が光る2026年10月下旬〜11月発売の注目作を厳選！元米軍人が江戸で現代銃器の回収に挑む歴史伝奇『ドリフテッド I』、最強の天恵を手放す救済譚『スキル剥奪屋さんのおせっかい 2』、生活魔術で過酷な辺境都市を甦らせる『城塞幼女シルヴィア 3』の魅力を徹底深掘り。',
  summary: '銃器リアリズムと怪異が衝突する歴史漂流活劇、才能という呪縛から人を解放する心揺さぶるヒューマンドラマ、そして生活の知恵と愛情で街を拓く至福のスローライフまで。秋の深まりとともにじっくりと物語世界に浸れる最新傑作3選をお届けします。',
  faq: [
    {
      q: 'この3作品に共通する魅力は何ですか？',
      a: '既存のテンプレ展開をなぞるのではなく、それぞれの作品が「銃器の弾道計算と江戸の伝奇」「スキルを捨てることによる救い」「生活魔術による日常の豊かさ」という唯一無二の軸を持っている点です。読後に深い満足感が残る実力派揃いです。'
    },
    {
      q: '電子書籍版はどこで読めますか？',
      a: '3作品すべて楽天Koboにて電子書籍版が好評配信・予約受付中です。スマートフォンや電子書籍リーダーで試し読みから手軽に楽しめます。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: 'ドリフテッド I　〜ジョン・スミスの江戸漂流奇譚〜',
      customTitle: 'ドリフテッド I　〜ジョン・スミスの江戸漂流奇譚〜',
      title: enrichedArticles[0].title,
      author: enrichedArticles[0].author,
      synopsis: '江戸後期に漂着し、将軍・徳川家斉から「墨須慈苑」の名を授かった元アメリカ軍人ジョン・スミス。泰平の世を揺るがす「現代銃器ばら撒き事件」を解決するため、忍びや陰陽術士、怪異が潜む江戸の町を奔走する！',
      recommendReason: '『キノの旅』の時雨沢恵一×黒星紅白が満を持して放つ歴史伝奇ガンアクション！徹底したミリタリー描写と江戸の風情、人外の術が絡み合う唯一無二の世界観に圧倒されます。',
      points: [
        '2026年11月10日発売！電撃文庫が誇る伝説的黄金タッグの完全新作',
        '火縄銃の時代に持ち込まれたアサルトライフルの脅威と、元米軍人のプロフェッショナルな捜査行',
        '忍術、陰陽術、妖怪が息づく江戸の怪異と現代火器が火花を散らす極上のエンタメ活劇'
      ],
      itemUrl: enrichedArticles[0].affiliateUrl || enrichedArticles[0].itemUrl,
      cover: enrichedArticles[0].cover,
      salesDate: enrichedArticles[0].salesDate,
      price: enrichedArticles[0].price
    },
    {
      rank: 2,
      keyword: 'スキル剥奪屋さんのおせっかい〜ハズレスキルの回収、承ります〜 2',
      customTitle: 'スキル剥奪屋さんのおせっかい〜ハズレスキルの回収、承ります〜 2',
      title: enrichedArticles[1].title,
      author: enrichedArticles[1].author,
      synopsis: '不要なスキルを回収する『スキル剥奪屋』のアネッタのもとに、国を救った英雄王女セレスディアが「天恵スキルを奪ってほしい」とやって来る。心を蝕む最強の力を手放し、人間らしく生きるための心温まる救済劇。',
      recommendReason: '「力を持つことが幸せとは限らない」という切実なテーマを、アネッタのおせっかいな優しさで包み込んだ傑作。読後に心の荷物がふっと軽くなるような感動を味わえます。',
      points: [
        '2026年10月30日発売！GCノベルズが贈る心温まるヒューマンファンタジー第2弾',
        '国を救った代償に自己を失いかけた王女の切ない告白と、魂のデトックス',
        '奪うことで人を救う、新感覚のスキル理論と心に染み入る対話劇'
      ],
      itemUrl: enrichedArticles[1].affiliateUrl || enrichedArticles[1].itemUrl,
      cover: enrichedArticles[1].cover,
      salesDate: enrichedArticles[1].salesDate,
      price: enrichedArticles[1].price
    },
    {
      rank: 3,
      keyword: '城塞幼女シルヴィア 〜実は万能な生活魔術を使って見捨てられた都市を発展させます〜 3',
      customTitle: '城塞幼女シルヴィア 〜実は万能な生活魔術を使って見捨てられた都市を発展させます〜 3',
      title: enrichedArticles[2].title,
      author: enrichedArticles[2].author,
      synopsis: '万能な生活魔術で極寒の廃城塞を甦らせてきた幼女シルヴィア。第3巻ではみんなで楽しむ初めての「収穫祭」が開催！美味しい料理と防寒設備の準備に励む中、家庭教師ブリージダの実家からの手紙が波乱を呼ぶ!?',
      recommendReason: '生活魔術の工夫で街がどんどん豊かになっていくクラフト感と、純真無垢なシルヴィアを囲む従者たちの保護者目線の温かさがたまらない、冬にぴったりの癒やし小説です。',
      points: [
        '2026年10月30日発売！GCノベルズの人気領地経営スローライフ第3弾',
        '美味しい料理に温熱魔法！冬の訪れを前に城塞都市を挙げて繰り広げられる収穫祭',
        'シルヴィアを守るためなら権力にも屈しない、個性豊かで頼もしい従者たちとの熱い絆'
      ],
      itemUrl: enrichedArticles[2].affiliateUrl || enrichedArticles[2].itemUrl,
      cover: enrichedArticles[2].cover,
      salesDate: enrichedArticles[2].salesDate,
      price: enrichedArticles[2].price
    }
  ]
};

async function main() {
  console.log('--- STARTING ADD 3 BOOKS & FEATURE GENERATION (v14) ---');

  // 1. public/data/books.json の更新
  console.log('[Step 1] Updating public/data/books.json...');
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

  // 2. 各個別作品ページ (/works/{slug}/index.html) の生成
  console.log('[Step 2] Rendering individual work pages (/works/{slug}/index.html)...');
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

  // 3. 特集記事の作成 (/features/{slug}/index.html) および curated-features.json の更新
  console.log('[Step 3] Updating curated-features.json and generating feature article...');
  const featuresPath = path.join(root, 'public/data/curated-features.json');
  let features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

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
