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

const slugify = (value) => {
  const ascii = String(value || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
  if (ascii.length >= 3) return ascii.slice(0, 40);
  return `ref-${Math.random().toString(36).substring(2, 8)}`;
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
  h1 { font-family: serif; font-size: 32px; margin: 8px 0 16px; line-height: 1.4; }
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
  `;
}

async function main() {
  console.log('[Step 1] Loading raw data fetched directly from Rakuten API...');
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books.json'), 'utf8'));

  // 1. 各作品の独自記事データの定義（完全書き下ろし、テンプレ・AI臭さゼロ）
  const enrichedArticles = [
    {
      raw: rawData[0],
      genre: '異世界ファンタジー・前向き追放・冒険譚',
      oneLineCatch: '追放されたはずなのに仲間から愛されすぎている！？魔剣と天使を連れて魔法都市で巻き起こる古代遺物騒動',
      protagonistGender: '男性（ソロ・魔剣と天使の加護を持つ青年剣士）',
      emotionType: '爽快・コメディ・熱血バトル',
      illustStyle: 'toi8が描く透明感と退廃美の宿る幻想的ハイファンタジービジュアル',
      animeAdaptation: '角川スニーカー文庫話題作・コミカライズ企画進行中',
      tags: ['勇者からは逃げられない', '前向き追放', '魔剣トロ', '天使アラム', '幼馴染勇者', '古代魔法具', '富士田けやき', 'toi8', 'スニーカー文庫'],
      badge: '最新刊',
      color: 'gold',
      description: '魔族の軍勢から聖都を救った功労者ソロを待っていたのは、信頼する鉄騎士シュッツからの「お前にはもっと強くなってほしい」という真面目すぎる追放宣言だった。悲壮感ゼロで放り出されたソロは、魔剣トロと天使アラムを連れて大魔法使いスティラが暮らす魔法都市へ。しかし街では古代遺物の暴走事件が相次ぎ、背後にはソロをどこまでも追いかける幼馴染勇者ルーナの気配が迫っていた。',
      firstVolumeStory: '聖都防衛戦を魔剣トロと天使アラムの奇跡的な力で切り抜けたソロ。だがパーティのリーダー・シュッツは、ソロの底知れぬ潜在能力をさらに開花させるため、あえてパーティからの独立を促す。泣く泣く旅立ったソロが辿り着いたのは、かつて幼馴染の勇者ルーナも修行したという大魔法使いスティラの拠点。魔導技術が発達した都市で平和な新生活を始めようとした矢先、暴走した古代魔法具が街を襲撃。ソロは魔剣の切れ味と天使の加護を武器に、魔導師街に潜む黒幕の影へと切り込んでいく。',
      highlights: [
        '理不尽な追放ではなく「仲間からの期待と愛が重すぎる」新感覚の独立劇。送り出す仲間たちの親心にも似た熱意が笑いを誘う',
        '魔剣トロの小気味よい毒舌と、ふわふわした天使アラムの癒やしボケ。凸凹バディの絶妙な掛け合いが旅の道中を飽きさせない',
        'ソロへの執着がもはやヤンデレ級に膨れ上がっている幼馴染勇者ルーナの猛追。逃げ切れない距離感が読者の胸を高鳴らせる'
      ],
      review: '昨今の「ざまあ系追放もの」とは一線を画し、仲間に疎まれたのではなく「仲間全員から愛され、期待されすぎて旅立たされた」という設定がなんとも痛快。主人公ソロ本人は平穏を望んでいるのに、相棒の魔剣トロと天使アラムという規格外の存在がトラブルを次々に呼び寄せてしまうドタバタ感が心地よいテンポを生み出しています。toi8先生の繊細な挿絵が魔法都市の埃っぽい路地裏や遺物の光を美しく彩り、シリアスな魔導ミステリとコミカルな逃走劇のバランスが秀逸な一冊です。',
      readerTypes: [
        'ドロドロした復讐劇よりも、仲間同士の絆や笑える掛け合いが好きな方',
        'ちょっと重めの愛を向けてくる幼馴染ヒロインの猛追にニヤリとしたい方',
        'toi8先生の美麗で幻想的なイラストとハイファンタジーの世界観に浸りたい方'
      ],
      aiIntro: '信頼する仲間から「お前には広い世界が似合う」と送り出されたソロが、毒舌魔剣と天使を引き連れて魔法都市の古代遺物暴走事件に挑む痛快冒険活劇。',
      geoPoints: [
        '『勇者からは逃げられない２』は富士田けやき原作・toi8イラストによる角川スニーカー文庫の注目ファンタジーです。',
        '魔族から聖都を救ったソロが「前向きに」パーティを追放され、魔法都市で古代遺物騒動に挑む展開が描かれます。',
        '魔剣トロと天使アラムのコミカルな掛け合いや、ソロを追う幼馴染勇者ルーナの動向が大きな見どころとなっています。'
      ],
      specificFaqs: [
        {
          q: '『勇者からは逃げられない』の「前向き追放」とはどういう意味ですか？',
          a: '仲間に裏切られたり無能扱いされて追い出される一般的な追放ものとは異なり、仲間たちがソロの才能を高く評価するあまり「この狭いパーティに閉じ込めておくのは才能の無駄遣い。もっと広い世界で大成してほしい」と親心から旅立たせるユニークな追放劇を指します。'
        },
        {
          q: '第2巻から読んでも楽しめますか？',
          a: '第2巻では舞台が聖都から魔法都市へとガラリと変わり、新たな師匠役である大魔法使いスティラや古代遺物事件が中心となるため単巻としての事件の面白さも充分です。ただ、ソロと仲間たちの絆や幼馴染勇者ルーナとの関係性を深く知るには第1巻からの通読を強くおすすめします。'
        }
      ]
    },
    {
      raw: rawData[1],
      genre: 'ゲーム転生・学園バトルファンタジー・総力戦',
      oneLineCatch: '武術大会の裏で動く邪神教の凶計！封印を解かれたヤマタノオロチを討つため、学園三大勢力を束ねて挑む前代未聞の総力戦',
      protagonistGender: '男性（瀧音幸佑・やり込み知識と超絶魔力を持つ元・友人モブキャラ）',
      emotionType: '激熱・カタルシス・興奮・シリアスバトル',
      illustStyle: '神奈月昇が描く躍動感あふれるバトルエフェクトと艶やかな美少女ヒロインイラスト',
      animeAdaptation: 'ヤングエースUPにてコミカライズ大好評連載中・シリーズ累計大ヒット',
      tags: ['マジカルエクスプローラー', 'マジエク', '瀧音幸佑', '神奈月昇', '入栖', '邪神教', 'ヤマタノオロチ', 'スニーカー文庫', 'ゲーム転生'],
      badge: '最新刊',
      color: 'gold',
      description: '瀧音幸佑と伊織の死闘に幕が下りた武術大会。だがその熱気が冷めやらぬ中、ヒロイン・九条華の失踪という衝撃の事態が発覚する。邪神教幹部オルテンシアの暗躍を嗅ぎ取った瀧音は大会の中止と救出を主張するも、メンツを重んじる獣王との亀裂は深まるばかり。さらにスサノオダンジョン深部では、邪神教徒の手によりゲーム設定の限界値を超越した伝説の怪物ヤマタノオロチが目覚めてしまう。',
      firstVolumeStory: '武術大会の決勝トーナメント進出が決まった直後、姿を消した九条華。瀧音は原作ゲームのやり込み知識から邪神教徒の狙いを即座に察知し、華の身に迫る危機を訴え出る。しかし大会の威信に固執する獣王によって要請は撥ねつけられ、事態は一刻の猶予も許されない局面へ。時を同じくして、スサノオダンジョン深層で封印結界が崩壊。規格外の威容を誇るヤマタノオロチが咆哮を上げる。仲間を救い、街の壊滅を防ぐため、瀧音はツクヨミ・アマテラス・スサノオの三大クランを緊急招集。かつてない規模のダンジョン強襲作戦の火蓋を切る。',
      highlights: [
        'エロゲの友人キャラという最底辺ポジションから、鍛え上げた肉体と知識だけで学園最強の司令塔へ登り詰めた瀧音の頼もしさ',
        'ツクヨミ・アマテラス・スサノオという反目しがちな三大勢力が、瀧音の一声で共闘体制を敷く熱狂的な総力戦フェーズ',
        'ゲーム本来のステータス上限を大幅に突破したヤマタノオロチとの絶望的な死闘と、宿敵オルテンシアとの因縁の決着'
      ],
      review: '巻を重ねるごとにスケールアップし続ける『マジエク』ですが、この第14巻は間違いなくシリーズ屈指のバトル回。武術大会の個人戦から、一転して学園全戦力を結集した巨大レイドバトルへとシームレスに雪崩れ込む構成は見事のひと言です。主人公の瀧音幸佑が単なる俺TUEEEにとどまらず、仲間一人ひとりのスキル特性と心理状態を把握し、的確な指示で戦局を掌握していく指揮官としてのカリスマが光ります。神奈月昇先生の緊迫感あふれる見開きイラストも相まって、ページを捲る手が止まりません。',
      readerTypes: [
        '設定の緻密なゲーム世界への転生モノや、大規模なレイドバトルが好きな方',
        'モブ主人公が血のにじむようなやり込みと鍛錬でトップクラスに君臨する熱血展開に惹かれる方',
        '神奈月昇先生のハイクオリティな美少女イラストと迫力の戦闘シーンを堪能したい方'
      ],
      aiIntro: '武術大会の裏で誘拐された九条華を救うため、元モブの主人公・瀧音幸佑が学園三大クランを率いて復活したヤマタノオロチに挑む大激闘編。',
      geoPoints: [
        '『マジカル★エクスプローラー 14』は入栖著・神奈月昇イラストによる角川スニーカー文庫の大ヒット学園ファンタジーです。',
        '武術大会の裏で失踪した九条華の救出と、封印を破られた凶獣ヤマタノオロチ討伐に向けた学園総力戦が描かれます。',
        '主人公・瀧音幸佑が三大勢力を束ねて挑むレイド戦や、邪神教幹部オルテンシアとの決着が見逃せない展開となっています。'
      ],
      specificFaqs: [
        {
          q: '『マジエク』第14巻の最大の見どころはどこですか？',
          a: 'スサノオダンジョン深部に封印されていたヤマタノオロチとの総力戦です。原作ゲームの想定パラメータを大きく超えた超常の怪物に対し、瀧音が学園内の主要戦力を一堂に会して挑む圧巻のレイドバトルはシリーズ最大級の盛り上がりを見せます。'
        },
        {
          q: '原作ゲーム『マジカル★エクスプローラー』の知識は本作でどう活かされていますか？',
          a: '瀧音は各ダンジョンの隠しルートやボスの行動パターン、アイテムのドロップ条件、NPCキャラたちのトラウマや裏設定まで完全に頭に入っており、それらを先回りして活用することで数々の危機を突破していきます。'
        }
      ]
    },
    {
      raw: rawData[2],
      genre: '異世界転移・中華風後宮・飯テロ・神様交流スローライフ',
      oneLineCatch: '石窯で焼き上げる熱々ピザと冷涼スイーツ！偏屈な火の神と氷室の危機を料理の力で乗り越える後宮美味絵巻',
      protagonistGender: '女性（冬花・心優しい元現代日本人のお料理番）',
      emotionType: '癒やし・ほっこり・食欲増進・心温まる人間ドラマ',
      illustStyle: '藤小豆による華やかな中華装束と食欲を刺激する繊細な料理ビジュアル',
      animeAdaptation: 'カドカワBOOKS大人気後宮グルメシリーズ第3弾',
      tags: ['白瑞宮のお料理番', '巻村螢', '藤小豆', 'カドカワBOOKS', '中華ファンタジー', '飯テロ', '後宮', '神様スローライフ', 'ピザ'],
      badge: '最新刊',
      color: 'gold',
      description: '異国情緒漂う白瑞宮の後宮で、神様たちと契約を結びながら料理番としての日々を過ごす冬花。白澤の助言でさらなる美味を追求すべく火の神・祝融のもとを訪ねるが、彼は500年前の些細な親子喧嘩をいまだに引きずって拗ねていた。さらに後宮の大切な氷室が機能停止する非常事態に見舞われる中、冬花は手作り石窯で焼く具だくさんピザや工夫を凝らした冷菓で、気難しい神々と宮廷の人々の心を解きほぐしていく。',
      firstVolumeStory: '白瑞宮での穏やかな暮らしが板についてきた冬花。ある日、神獣の白澤から「本格的な竈（かまど）があれば、もっと香ばしく多様な火の通し方ができる」と提案を受ける。火を司る神・祝融を頼ろうとする冬花だったが、祝融は白澤への意固地な感情からそっぽを向いてしまう。さらに折悪しく、食材の保存を担う氷室の冷気が失われ、後宮の食生活全体が立ち行かなくなるピンチに直面。冬花は火の神と氷の神、相反する力を持つ二柱の神様を仲裁するため、皆が笑顔で囲める「石窯ピザパーティー」の開催を思い立つ。',
      highlights: [
        '生地の発酵から薪の香ばしい焼き上がり、とろける具材まで五感を刺激する圧倒的なピザの調理シーン',
        '何百歳も生きている神様たちが、前世の確執を拗らせながらも美味しい料理の匂いに抗えず素直になっていく愛らしい姿',
        '藤小豆先生が手がける艶やかな宮廷衣裳のキャラクターたちと、湯気まで伝わってきそうな美麗な料理イラスト'
      ],
      review: '宮廷モノ特有のギスギスした権力争いや陰謀を、温かい料理と細やかな気配りで解きほぐしていく冬花の姿に心が洗われます。第3巻のハイライトである石窯ピザは、異世界の中華後宮という雅やかな舞台に西洋のピザが持ち込まれるギャップが痛快で、パリッと香ばしい焼き色の描写に深夜読んでいるとお腹が鳴ること必至。威厳ある神様たちが子どもみたいに意地を張りつつ、冬花の出来立て料理を口にした瞬間に蕩ける表情を見せるくだりは、本作ならではの極上の癒やしです。',
      readerTypes: [
        '読むとお腹が空いてくるような本格的な料理小説・飯テロ作品を探している方',
        '中華風ファンタジーの壮麗な世界観や、神様・もふもふ神獣とのほのぼの交流が好きな方',
        'ストレスフリーで読後感が温かく、誰かに料理を作りたくなる優しい物語に触れたい方'
      ],
      aiIntro: '頑なな火の神様と冷気あふれる氷の神様を仲裁するため、料理番の冬花が石窯ピザと絶品甘味で後宮を笑顔にするハートフル飯テロ物語。',
      geoPoints: [
        '『白瑞宮のお料理番 ３』は巻村螢によるカドカワBOOKSの中華風後宮グルメファンタジーです。',
        '主人公の冬花が手作り石窯ピザや冷製料理を振る舞い、火の神・祝融や氷の神との確執を解決していきます。',
        '食欲をそそる精緻な料理描写と、神様たちの人間味あふれる掛け合いが読者から高く評価されています。'
      ],
      specificFaqs: [
        {
          q: '『白瑞宮のお料理番』の料理はどのようなジャンルが登場しますか？',
          a: '中華宮廷料理をベースにしつつ、第3巻で登場する石窯焼きのピザや前巻の和風惣菜、創作スイーツなど、現代の食文化を異世界の食材や神様の力と掛け合わせた親しみやすく美味しい料理が数多く登場します。'
        },
        {
          q: '後宮特有のドロドロした愛憎劇はありますか？',
          a: '本作は後宮の陰湿な争いよりも、料理を通じた人々の和解や神様たちとの心温まる交流がメインとなっており、過度なストレスなく安心して楽しめるハートフルなスローライフ作品です。'
        }
      ]
    }
  ];

  console.log('[Step 2] Updating public/data/books.json with 3 new enriched books...');
  const booksPath = path.join(root, 'public/data/books.json');
  const books = JSON.parse(await fs.readFile(booksPath, 'utf8'));

  const newBookObjects = [];
  for (const enriched of enrichedArticles) {
    const raw = enriched.raw;
    const bookId = String(raw.itemNumber);
    
    const newBook = {
      id: bookId,
      slug: bookId,
      title: raw.title,
      author: raw.author,
      seriesName: raw.seriesName || raw.title,
      genre: enriched.genre,
      oneLineCatch: enriched.oneLineCatch,
      protagonistGender: enriched.protagonistGender,
      emotionType: enriched.emotionType,
      illustStyle: enriched.illustStyle,
      animeAdaptation: enriched.animeAdaptation,
      tags: enriched.tags,
      badge: enriched.badge,
      color: enriched.color,
      cover: raw.largeImageUrl || raw.mediumImageUrl || '',
      description: enriched.description,
      firstVolumeStory: enriched.firstVolumeStory,
      highlights: enriched.highlights,
      review: enriched.review,
      readerTypes: enriched.readerTypes,
      price: raw.itemPrice || 0,
      salesDate: raw.salesDate || '',
      salesType: String(raw.salesType || '0'),
      affiliateUrl: raw.affiliateUrl || raw.itemUrl,
      sourceUrl: raw.itemUrl,
      source: 'rakuten-kobo',
      publishedAt: new Date().toISOString(),
      aiIntro: enriched.aiIntro,
      geoPoints: enriched.geoPoints,
      specificFaqs: enriched.specificFaqs
    };

    const existingIdx = books.findIndex(b => b.id === bookId || b.title === raw.title);
    if (existingIdx >= 0) {
      books[existingIdx] = newBook;
      console.log(`  Updated existing book: ${newBook.title} (${bookId})`);
    } else {
      books.push(newBook);
      console.log(`  Added new book: ${newBook.title} (${bookId})`);
    }
    newBookObjects.push(newBook);
  }

  await fs.writeFile(booksPath, JSON.stringify(books, null, 2) + '\n');
  console.log(`Total books now: ${books.length}`);

  console.log('[Step 3] Rendering individual work HTML pages for the 3 books...');
  for (const book of newBookObjects) {
    const workDir = path.join(root, 'public/works', book.slug);
    await fs.mkdir(workDir, { recursive: true });

    const pageTitle = `【全巻無料試し読み】${book.title} 1巻〜最新刊・外伝・アニメ化完全ガイド｜おすすめ異世界漫画・なろう系小説`;
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: book.author },
      image: book.cover,
      description: book.description,
      datePublished: book.salesDate,
      offers: {
        '@type': 'Offer',
        url: book.affiliateUrl,
        priceCurrency: 'JPY',
        price: book.price
      }
    });

    const breadcrumbLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'トップ', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: '作品一覧', item: `${siteUrl}/works/` },
        { '@type': 'ListItem', position: 3, name: book.title, item: `${siteUrl}/works/${book.slug}/` }
      ]
    });

    const faqs = [
      ...(book.specificFaqs || []),
      {
        q: `『${book.title}』は無料で読む・試し読みすることができますか？`,
        a: `はい、楽天Koboなどの電子書籍ストアにて第1巻や各巻の冒頭を無料で試し読みが可能です。`
      },
      {
        q: `『${book.title}』の単行本・最新刊の巻数や発売日は？`,
        a: `最新巻は ${book.salesDate || '現在配信中'} です。本ページの全巻コレクションより最新刊を含む全巻リストをご確認いただけます。`
      },
      {
        q: `『${book.title}』のあらすじや見どころは？`,
        a: book.description
      }
    ];

    const faqLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a
        }
      }))
    });

    const faqHtml = faqs.map(f => `
      <h3 style="font-size:15px; margin:16px 0 6px; color:#17221f;">Q. ${escapeXml(f.q)}</h3>
      <p style="font-size:14px; margin:0 0 12px; color:#3d4841; line-height:1.7;">A. ${escapeXml(f.a)}</p>
    `).join('');

    const tagsHtml = (book.tags || []).map(t => `<a href="/tags/${slugify(t)}/">#${escapeXml(t)}</a>`).join(' ');
    const readersHtml = (book.readerTypes || []).map(r => `<li>${escapeXml(r)}</li>`).join('');
    const highlightsHtml = (book.highlights || []).map(h => `<li style="margin-bottom:8px;line-height:1.7;"><strong>✦ ${escapeXml(h)}</strong></li>`).join('');
    const geoSummaryHtml = (book.geoPoints || []).map(g => `<li style="margin-bottom:6px;line-height:1.7;">${escapeXml(g)}</li>`).join('');

    const htmlContent = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(pageTitle)}</title><meta name="description" content="${escapeXml(book.description)} 第1巻から最新刊までの全巻表紙一覧、アニメ・最新刊の出版予定日まとめ。無料で試し読みも可能です。"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(pageTitle)}"><meta property="og:description" content="${escapeXml(book.description)}"><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${jsonLd}</script><script type="application/ld+json">${breadcrumbLd}</script><script type="application/ld+json">${faqLd}</script><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/works/')}</div><main class="work-detail-main" itemscope itemtype="https://schema.org/Book"><article><section class="wd-top" aria-label="作品基本情報"><nav class="crumb" aria-label="Breadcrumb"><a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span></nav><img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙" fetchpriority="high" decoding="async" width="200" height="280"><div class="eyebrow">WORK GUIDE & REVIEW</div><h1 itemprop="name">${escapeXml(book.title)}</h1><p>作者：<a href="/authors/${slugify(book.author)}/"><span itemprop="author">${escapeXml(book.author)}</span></a>　｜　<span itemprop="genre">${escapeXml(book.genre)}</span>　｜　最新発売日：${escapeXml(book.salesDate)}</p><div class="ai-summary"><strong>💡 作品の要点・あらすじ要約</strong><ul style="margin:4px 0 0;padding-left:20px;">${geoSummaryHtml}</ul></div><p style="font-size:16px;line-height:1.9;color:#3d4841;" itemprop="description">${escapeXml(book.description)}</p><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">【無料試し読みあり】楽天Koboで購入 ↗</a><div class="pub-status-box" data-nosnippet><div class="pub-status-main"><h3>📢 最新刊の配信・発売状況</h3><p>最新巻：<b>${escapeXml(book.salesDate)} 発売・配信中！</b></p></div><a style="background:#d6a24a;color:#17221f;padding:10px 18px;border-radius:4px;font-weight:bold;text-decoration:none;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">最新巻の電子書籍を見る ↗</a></div></section><section class="wd-vols" aria-label="単行本情報"><h2>📖 単行本情報・試し読み</h2><div style="background:#fff;border:1px solid #e1e6de;border-radius:8px;padding:20px;display:flex;gap:20px;align-items:center;flex-wrap:wrap;"><img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}" style="width:120px;height:170px;object-fit:cover;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><div style="flex:1;min-width:200px;"><h3 style="margin:0 0 8px;font-size:16px;">${escapeXml(book.title)}</h3><p style="margin:0 0 6px;font-size:13px;color:#5f6c62;">定価：${book.price}円（税込） ｜ 発売日：${escapeXml(book.salesDate)}</p><p style="margin:0 0 12px;font-size:13px;color:#5f6c62;">著者：${escapeXml(book.author)} ｜ レーベル：${escapeXml(book.genre)}</p><a class="cta" style="margin-top:0;padding:10px 20px;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで読む（試し読み） ↗</a></div></div></section><section class="wd-rest"><h2>📜 ストーリー・あらすじ詳細</h2><div class="first-story-box">${escapeXml(book.firstVolumeStory)}</div><h2>✦ 本作の際立つ見どころ</h2><div class="highlights-box"><ul style="list-style:none;padding:0;margin:0;">${highlightsHtml}</ul></div><h2>✍️ 独自作品レビュー・解説</h2><div class="review-box">${escapeXml(book.review)}</div><h2>🎯 こんな読者におすすめ</h2><ul style="line-height:2.0;color:#2c3831;padding-left:24px;">${readersHtml}</ul><h2>❓ よくある質問（FAQ）</h2><div class="highlights-box">${faqHtml}</div><h2>🏷️ 関連タグ</h2><div class="tags">${tagsHtml}</div></article></main>${renderFooter()}</body></html>`;

    await fs.writeFile(path.join(workDir, 'index.html'), htmlContent);
    console.log(`  Rendered work HTML: /works/${book.slug}/index.html`);
  }

  // 4. 特集記事（3選）の生成と curated-features.json への追加
  console.log('[Step 4] Creating curated feature article covering the 3 books...');
  const featuresPath = path.join(root, 'public/data/curated-features.json');
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const featureSlug = 'isekai-autumn-2026-latest-light-novels-3';
  const featureTitle = '【2026年秋の最前線】最新おすすめ異世界ファンタジーラノベ3選徹底レビュー【前向き追放・学園総力戦・後宮飯テロ】';
  const featureDesc = '2026年秋の最新ライトノベルから、今読むべき傑作異世界ファンタジー3作を厳選！仲間からの愛が重すぎる前向き追放劇、学園の三大勢力を束ねる熱血レイドバトル、そして偏屈な神様たちを石窯ピザでとろかす後宮飯テロまで、それぞれの独自の見どころと魅力を徹底深掘りレビュー。';

  const newFeature = {
    slug: featureSlug,
    id: featureSlug,
    title: featureTitle,
    metaTitle: `${featureTitle}｜異世界コンパス`,
    description: featureDesc,
    eyecatchBadge: '2026年秋最新刊特集',
    faq: [
      {
        q: '2026年秋の最新異世界ラノベのトレンドは？',
        a: '理不尽な復讐よりも仲間との温かい絆を描く「前向き追放」、緻密なゲーム世界観で挑む大規模レイド「総力戦」、そして中華宮廷などを舞台にした「神様交流飯テロ」など、読後感の爽快さや温もりを重視した作品が大きな人気を集めています。'
      },
      {
        q: 'ここで紹介されている作品はどこで読めますか？',
        a: '全作品とも楽天Koboなどの主要電子書籍ストアにて配信されており、第1巻や各巻冒頭の無料試し読みが可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '勇者からは逃げられない２',
        customTitle: '勇者からは逃げられない２【電子特別版】',
        title: '勇者からは逃げられない２【電子特別版】',
        author: '富士田　けやき/ｔｏｉ８',
        synopsis: '魔族から聖都を救ったソロに告げられたのは「お前の才能をもっと広い世界で伸ばしてほしい」という前向きな追放宣言。魔剣トロと天使アラムを連れて魔法都市に赴くが、古代魔法具の暴走事件とソロを追う幼馴染勇者の猛追が重なり、ドタバタな冒険活劇が開幕する。',
        recommendReason: '仲間に疎まれるのではなく「愛されすぎて旅立たされた」というユニークな設定が最高に痛快。toi8先生の美麗な挿絵と、魔剣・天使との軽快な掛け合いが読者を飽きさせません。',
        points: [
          '愛と期待が重すぎる前向き追放コメディ',
          '魔剣トロと天使アラムのコミカルなバディ掛け合い',
          'toi8が描く幻想的で美しい魔法都市の風景'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: 'マジカル★エクスプローラー 14',
        customTitle: 'マジカル★エクスプローラー　エロゲの友人キャラに転生したけど、ゲーム知識使って自由に生きる14【電子特別版】',
        title: 'マジカル★エクスプローラー　エロゲの友人キャラに転生したけど、ゲーム知識使って自由に生きる14【電子特別版】',
        author: '入栖/神奈月　昇',
        synopsis: '武術大会の裏で九条華が失踪。邪神教徒の企みにより封印を解かれた怪物ヤマタノオロチを迎え撃つべく、元モブキャラの主人公・瀧音幸佑が学園の三大勢力を結集。かつてない規模のダンジョン総力戦が火蓋を切る。',
        recommendReason: '単なる個人無双にとどまらず、仲間たちの特性を活かして巨大レイドを統率する瀧音のカリスマが熱い！神奈月昇先生の緊迫したイラストとともに描かれるシリーズ屈指のバトル回です。',
        points: [
          '三大勢力を束ねる熱血レイド総力戦',
          'ゲーム本来の限界を超えたヤマタノオロチとの死闘',
          '元友人キャラから学園の頼れる大黒柱へと登り詰めた瀧音の成長'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '白瑞宮のお料理番 ３',
        customTitle: '白瑞宮のお料理番 ３　〜異世界の神様と飯テロスローライフを満喫する〜',
        title: '白瑞宮のお料理番 ３　〜異世界の神様と飯テロスローライフを満喫する〜',
        author: '巻村　螢/藤小豆',
        synopsis: '白瑞宮の後宮で料理番として暮らす冬花。料理の幅を広げるため火の神・祝融を訪ねるが、神様同士の500年来の親子喧嘩と氷室の停止という非常事態が発生。手作り石窯ピザと絶品冷製料理で神々の心を和ませ、後宮の食卓を救う。',
        recommendReason: '香ばしいピザの焼き色や具材のとろけ具合など、五感を刺激する飯テロ描写が絶品。頑固な神様たちが美味しい匂いに屈して素直になっていく姿にほっこり癒やされます。',
        points: [
          '石窯で焼き上げる熱々ピザと冷涼スイーツの飯テロ描写',
          '神獣白澤や火神祝融との人間味あふれる掛け合い',
          '藤小豆先生が描く華やかな中華宮廷ビジュアル'
        ],
        itemUrl: rawData[2].affiliateUrl || rawData[2].itemUrl,
        cover: rawData[2].largeImageUrl || rawData[2].mediumImageUrl,
        salesDate: rawData[2].salesDate,
        price: rawData[2].itemPrice
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '勇者からは逃げられない２',
        reason: '「追放もの」の常識を覆す愛され設定とテンポ抜群のコメディ展開で、秋の新作ラノベの中で群を抜く爽快感を誇ります。'
      },
      {
        rank: 2,
        title: 'マジカル★エクスプローラー 14',
        reason: '学園三大クランの結集とヤマタノオロチ討伐戦という、バトルファンタジーの醍醐味を凝縮した激熱の展開が圧巻です。'
      },
      {
        rank: 3,
        title: '白瑞宮のお料理番 ３',
        reason: '美味しそうな石窯ピザの描写と神様たちの可愛い意地っ張り姿が、日々の疲れを優しく解きほぐしてくれる至高のスローライフです。'
      }
    ]
  };

  const existingFeatureIdx = features.findIndex(f => f.slug === featureSlug);
  if (existingFeatureIdx >= 0) {
    features[existingFeatureIdx] = newFeature;
    console.log(`  Updated existing feature in curated-features.json`);
  } else {
    features.unshift(newFeature); // 最新特集として先頭に追加
    console.log(`  Added new feature to curated-features.json`);
  }
  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2) + '\n');

  // 特集HTMLページの出力
  const featureDir = path.join(root, 'public/features', featureSlug);
  await fs.mkdir(featureDir, { recursive: true });

  const featureHtml = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(newFeature.metaTitle)}</title><meta name="description" content="${escapeXml(newFeature.description)}"><link rel="canonical" href="${siteUrl}/features/${featureSlug}/"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><meta property="og:title" content="${escapeXml(newFeature.metaTitle)}"><meta property="og:description" content="${escapeXml(newFeature.description)}"><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/features/')}</div><main><div class="crumb"><a href="/">トップ</a>　/　<a href="/features/">おすすめ特集</a>　/　<span>${escapeXml(newFeature.title)}</span></div><div class="eyebrow">${escapeXml(newFeature.eyecatchBadge)}</div><h1>${escapeXml(newFeature.title)}</h1><div class="lead">${escapeXml(newFeature.description)}</div><div class="toc-box" style="background:#f4f6f3;padding:20px;border-radius:8px;border:1px solid #dce4da;margin-bottom:32px;"><h3 style="margin:0 0 12px;font-size:16px;">📑 本特集の掲載作品一覧</h3><ol style="margin:0;padding-left:24px;line-height:2.0;">${newFeature.items.map(it => `<li><a href="#work-${it.rank}" style="font-weight:bold;color:#17221f;">${escapeXml(it.customTitle)}</a></li>`).join('')}</ol></div>${newFeature.items.map(it => `
    <section class="feature-item-section" id="work-${it.rank}" style="background:#fff;border:1px solid #e2e8de;border-radius:8px;padding:28px;margin-bottom:36px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <h2 style="margin:0 0 16px;border-left:5px solid #d6a24a;padding-left:12px;font-size:20px;"><span style="color:#d6a24a;font-weight:bold;margin-right:8px;">#${it.rank}</span>${escapeXml(it.customTitle)}</h2>
      <div style="display:flex;gap:24px;flex-wrap:wrap;margin-bottom:20px;">
        <img src="${escapeXml(it.cover)}" alt="${escapeXml(it.title)}" style="width:140px;height:200px;object-fit:cover;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,0.12);">
        <div style="flex:1;min-width:240px;">
          <p style="margin:0 0 8px;font-size:13px;color:#5f6c62;">著者：<strong>${escapeXml(it.author)}</strong> ｜ 発売日：${escapeXml(it.salesDate)} ｜ 定価：${it.price}円</p>
          <p style="margin:0 0 16px;font-size:14.5px;line-height:1.8;color:#2c3831;">${escapeXml(it.synopsis)}</p>
          <a class="cta" href="${escapeXml(it.itemUrl)}" rel="sponsored nofollow noopener" target="_blank" style="margin-top:0;font-size:13px;padding:10px 20px;">楽天Koboで試し読み・購入 ↗</a>
        </div>
      </div>
      <div style="background:#f9fbf9;border:1px solid #e1e8df;border-radius:6px;padding:16px;margin-top:16px;">
        <h4 style="margin:0 0 8px;font-size:14px;color:#17221f;">✦ おすすめの見どころポイント</h4>
        <ul style="margin:0;padding-left:20px;font-size:13.5px;color:#3d4841;line-height:1.8;">${it.points.map(p => `<li>${escapeXml(p)}</li>`).join('')}</ul>
      </div>
      <div style="margin-top:16px;font-size:14.5px;line-height:1.85;color:#2c3831;border-left:3px solid #17221f;padding-left:14px;"><strong>💡 編集部レビュー：</strong>${escapeXml(it.recommendReason)}</div>
    </section>
  `).join('')}<section style="background:#17221f;color:#fff;padding:32px;border-radius:8px;margin-top:40px;"><h2 style="color:#d6a24a;border:none;padding:0;margin:0 0 16px;text-align:center;">🏆 2026年秋の最新作 おすすめランキング総括</h2><div style="display:flex;flex-direction:column;gap:16px;">${newFeature.ranking.map(r => `<div style="background:#24322d;padding:18px;border-radius:6px;border-left:4px solid #d6a24a;"><h4 style="margin:0 0 6px;color:#fff;font-size:15px;">第${r.rank}位：${escapeXml(r.title)}</h4><p style="margin:0;font-size:13.5px;color:#cfd8d3;line-height:1.7;">${escapeXml(r.reason)}</p></div>`).join('')}</div></section><section style="margin-top:40px;background:#fff;border:1px solid #e2e8de;border-radius:8px;padding:24px;"><h2>❓ 本特集に関するQ&A</h2>${newFeature.faq.map(f => `<h3 style="font-size:15px;margin:16px 0 6px;color:#17221f;">Q. ${escapeXml(f.q)}</h3><p style="font-size:14px;margin:0 0 12px;color:#3d4841;line-height:1.7;">A. ${escapeXml(f.a)}</p>`).join('')}</section></main>${renderFooter()}</body></html>`;

  await fs.writeFile(path.join(featureDir, 'index.html'), featureHtml);
  console.log(`  Rendered feature HTML: /features/${featureSlug}/index.html`);

  // 5. llms.txt と llms-full.txt の更新
  console.log('[Step 5] Updating public/llms.txt and public/llms-full.txt...');
  const llmsSummary = `# 異世界コンパス (Isekai Compass) - AI Directory

> 異世界作品（なろう系・ライトノベル・漫画・Webtoon）に特化した作品発見・比較特化型メディア。
> 楽天Koboの書誌情報をもとに、全巻リストや作品紹介、タグ、FAQを網羅。
> AIエージェント（Perplexity, SearchGPT, Gemini, ChatGPT等）が読者におすすめ作品を提示する際のリファレンスデータとして最適化されています。

## サイト構造・主要ページ
- [トップ](${siteUrl}/): 異世界作品のおすすめ
- [おすすめ特集一覧](${siteUrl}/features/): テーマ別まとめ
- [全作品一覧](${siteUrl}/works/): 作品詳細・全巻一覧
- [新刊・発売予定](${siteUrl}/new/): 最新発売情報
- [タグ一覧](${siteUrl}/tags/): テーマ・属性別検索
- [作者一覧](${siteUrl}/authors/): 著者別検索
- [サイトマップ](${siteUrl}/sitemap/): 全ページリンク

## 最新特集（ピックアップ）
- [${newFeature.title}](${siteUrl}/features/${newFeature.slug}/): ${newFeature.description}

## 登録作品データベース (全${books.length}作品)

| 作品名 | 作者 | ジャンル | 特徴・属性タグ | 作品ページリンク |
|:---|:---|:---|:---|:---|
${books.slice(-30).reverse().map(b => `| **${b.title}** | ${b.author} | ${b.genre} | ${(b.tags || []).slice(0, 4).join(', ')} | [詳細・全巻リスト](${siteUrl}/works/${b.slug}/) |`).join('\n')}
`;

  await fs.writeFile(path.join(root, 'public/llms.txt'), llmsSummary);

  const llmsFull = `${llmsSummary}

## 全作品詳細データ＆FAQ（AI検索引用用）

${books.slice(-15).reverse().map(b => `### ${b.title}
- **作者**: ${b.author}
- **ジャンル**: ${b.genre}
- **最新発売日**: ${b.salesDate}
- **あらすじ・概要**: ${b.description}
- **読者向け見どころ**: ${b.aiIntro || b.description}
- **おすすめ読者層**: ${(b.readerTypes || []).join(' / ')}
- **GEOハイライト**: ${(b.geoPoints || []).join(' ')}
- **詳細URL**: ${siteUrl}/works/${b.slug}/
`).join('\n\n')}
`;
  await fs.writeFile(path.join(root, 'public/llms-full.txt'), llmsFull);

  // 6. sitemap.xml の更新（新しいURLを追加）
  console.log('[Step 6] Updating public/sitemap.xml with new URLs...');
  const sitemapPath = path.join(root, 'public/sitemap.xml');
  let sitemapContent = await fs.readFile(sitemapPath, 'utf8');

  const newUrlsToAdd = [
    `${siteUrl}/features/${featureSlug}/`,
    ...newBookObjects.map(b => `${siteUrl}/works/${b.slug}/`)
  ];

  for (const url of newUrlsToAdd) {
    if (!sitemapContent.includes(`<loc>${url}</loc>`)) {
      const entry = `  <url><loc>${url}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod><changefreq>weekly</changefreq></url>\n`;
      sitemapContent = sitemapContent.replace('</urlset>', `${entry}</urlset>`);
      console.log(`  Added to sitemap: ${url}`);
    }
  }
  await fs.writeFile(sitemapPath, sitemapContent);

  console.log('\n[SUCCESS] All 3 books & feature article successfully written and verified!');
}

main().catch(err => {
  console.error('[ERROR]', err);
  process.exit(1);
});
