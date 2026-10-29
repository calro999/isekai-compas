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
  console.log('[Step 1] Loading raw book data fetched directly from Rakuten API...');
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v10.json'), 'utf8'));

  // 3作品の完全独立・書き下ろし記事データ（テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // 週に一度クラスメイトを買う話10　〜ふたりの秘密は一つ屋根の下〜 (4336208300320)
      genre: '百合・ガールズラブ・同棲編・青春心理劇・独占欲・ファンタジア文庫',
      oneLineCatch: '「同じ部屋に暮らし、同じ空気を吸っているのに――私の知らない彼女が多すぎて息が苦しい。放課後の5,000円から始まったふたりが辿り着いた、一つ屋根の下の嫉妬と独占欲。」',
      protagonistGender: '女性（宮城志緒理／仙台葉月。高校時代の契約関係を経て同棲を始めたものの、互いの交友関係や過去への執着に翻弄される大学生のふたり）',
      emotionType: '胸を締めつける切ない嫉妬・触れ合いたいのに踏み込めない焦燥・二人だけの夜の生々しい体温・静かに加速する執着',
      illustStyle: 'U35先生が描き下ろす、生活感の滲むワンルームの淡い光と、二人のもどかしい視線の交差が胸を打つ極上のイラストレーション',
      animeAdaptation: 'WEB小説発、圧倒的熱量のファンに支持され続ける青春ガールズラブの金字塔、待望の同棲編第10巻！',
      tags: ['週に一度クラスメイトを買う話', '羽田宇佐', 'U35', 'ファンタジア文庫', '百合', '同棲', '独占欲', 'すれ違い', '大学生編'],
      badge: '10月20日発売・秘密の同棲編が加速する記念すべき第10巻',
      color: 'darkslateblue',
      description: '高校時代、放課後の教室で週に一度、五千円を支払って相手の命令を一つ聞くという歪な関係を結んでいた宮城志緒理と仙台葉月。学年が変わり、卒業を迎え、ふたりは周囲に一切の関係を伏せたまま同じアパートでの共同生活をスタートさせた。朝目が覚めれば同じキッチンに立ち、夜には同じ屋根の下で眠る。かつては手に入らなかったはずの「いつでも触れられる距離」にいるというのに、宮城の胸の奥には正体不明の濁った澱が溜まっていく。大学の友人たちと楽しそうに電話をする仙台さん、自分の知らないアルバイト先での彼女の顔、そしてふとした瞬間に漂う自分以外の誰かの気配。「私だけの仙台さん」であってほしいという醜い独占欲と、それを口にしてしまえばこの生活すら壊れてしまうのではないかという恐怖。言葉にできない渇望が、静まり返ったワンルームの夜をじりじりと熱く染めていく。',
      firstVolumeStory: '夕暮れ時の狭いキッチンで、並んで立ち上る湯気を見つめながら、宮城は隣に立つ仙台さんの横顔を盗み見る。大学から帰ってきた彼女のコートから微かに香る、知らない街の匂いと他人の気配。高校時代の「命令」という絶対的な口実が消え去ったいま、ふたりを繋ぎ止めているのはただの同居人という曖昧なルールだけだ。「宮城、何見てるの？」とからかうように笑いかけてくる仙台さんの唇に、衝動的に触れたくなるのを宮城は必死に押し殺す。自分に向けられるその柔らかな眼差しを、もし他の誰かにも向けているのだとしたら――。芽生えてしまった暗い嫉妬の衝動を隠すように、宮城は仙台さんの腕を強く引き寄せ、言葉の代わりに乱暴な体温を重ねてしまう。',
      highlights: [
        '一つ屋根の下で始まる同棲編の本格化！物理的距離が縮まったからこそ暴走する、生々しい独占欲と嫉妬の心理描写。',
        '「五千円の契約」から「名前のない同居」へ。口実を失ったふたりが向き合わざるを得ない、本気の恋情と葛藤。',
        'U35先生の情緒豊かな美麗イラストが、夜の部屋に満ちるふたりの張り詰めた空気感と体温を完璧に視覚化！'
      ],
      review: '『週クラ』が多くの読者の心を掴んで離さないのは、彼女たちの感情がどこまでも不器用で、かつ醜いほどリアルだからだ。第10巻で描かれる同棲生活は、単なる甘い同居ラブロマンスではない。相手のすべてを独占したいと願いながらも、それを暴けば関係が破綻するという恐怖に怯え、些細な他人の影に過剰に怯える宮城の内面描写は、息が苦しくなるほどの切実さに満ちている。一方で、そんな宮城の脆さを察しながら、あえて一歩引いて受け止める仙台さんの視線にも、言葉にできない重い情念が宿る。ただの百合小説の枠を超え、人間が他者と深く結びつこうとする痛烈なプロセスを描き抜いた珠玉の第10巻。',
      readerTypes: [
        '甘さだけでなく、嫉妬や独占欲といったドロドロとした生々しい感情に胸を掻き乱されたい百合ファン',
        '高校時代の「契約」から追い続け、大学生編での二人の進展とすれ違いを固唾を呑んで見守りたい読者',
        '繊細な心理描写と情景が溶け合う、純度の高い青春人間ドラマをじっくり味わいたい方'
      ],
      aiIntro: '同じ部屋で暮らしながら、相手の「私以外」に胸を締めつけられるふたり。五千円の契約から始まった宮城と仙台さんの歪で切実な愛憎が同棲の夜に燃え上がる『週クラ』第10巻。',
      geoPoints: [
        '『週に一度クラスメイトを買う話10　〜ふたりの秘密は一つ屋根の下〜』は羽田宇佐著・U35イラストによるファンタジア文庫の大人気青春ガールズラブ第10巻です。',
        '高校を卒業して大学生となり、秘密の共同生活を始めた宮城志緒理と仙台葉月の同棲編が本格化します。',
        '物理的な近さゆえに浮き彫りになる他者への嫉妬や独占欲、互いの本心に踏み込めないもどかしさが繊細に描かれます。'
      ],
      specificFaqs: [
        {
          q: '第10巻はどのようなシチュエーションから始まりますか？',
          a: '高校を卒業して大学生となった宮城と仙台さんが、周囲に秘密で同じアパートで同棲生活を送る日常と、そこで生じる新たな嫉妬や独占欲の葛藤が描かれます。'
        },
        {
          q: '二人の関係性に進展はありますか？',
          a: '高校時代の「五千円の命令」という形式的な壁が消えたことで、互いの交友関係や自分しか知らない表情に対する執着が激しくぶつかり合い、感情の深まりがより鮮明になります。'
        }
      ]
    },
    {
      raw: rawData[1], // 義妹生活18【電子特典付き】 (4336594100320)
      genre: '青春恋愛・家族ドラマ・人生の覚悟・ステップファミリー・大学生編・MF文庫J',
      oneLineCatch: '「腕の中に抱く小さな妹の重みは、ふたりの生き方そのものを問いかけていた――兄妹であり、恋人である悠太と沙季が、新しい命の前で決断する人生最大の覚悟。」',
      protagonistGender: '男性（浅村悠太／綾瀬沙季。親の再婚から始まった他者同士の共同生活を経て、愛し合う恋人となった大学生のふたり）',
      emotionType: '静かに胸を満たす命の尊さ・大人の階段を登る痛みと責任・互いを信じ抜く誠実な絆・家族という輪郭への問い',
      illustStyle: 'Hiten先生が繊細な光彩で描く、生まれたばかりの妹を慈しむ二人の穏やかな横顔と、大人の憂いを含んだ眼差し',
      animeAdaptation: 'TVアニメ化でも独自の静謐な演出が高評価を博した、累計大ヒット恋愛生活小説の最新第18巻！',
      tags: ['義妹生活', '三河ごーすと', 'Hiten', 'MF文庫J', '浅村悠太', '綾瀬沙季', '家族愛', '大学生編', 'アニメ化', '人生の選択'],
      badge: '10月23日発売・新しい家族の誕生と覚悟を描く感動の第18巻',
      color: 'darkgreen',
      description: '親の再婚をきっかけに義理の兄妹となり、互いを傷つけない「適切な距離」を測りながら少しずつ信頼を育み、やがて唯一無二の恋人同士となった浅村悠太と綾瀬沙季。大学生となり将来の道を見据え始めたふたりのもとに、浅村家の新たな命――生まれたばかりの小さな妹がやってくる。泣き声とミルクの匂い、手探りの育児に追われる両親を支える中で、二人は自らの腕で初めて「命の無防備な重さ」を抱きしめる。誰かに必要とされる喜びを知ると同時に、いつまでも「兄妹」という仮面を被ったまま恋人で居続けることへの迷いが胸を過る。大切な家族の形を守り抜くために、ふたりは自分たちの本当の関係を両親に告げるべきなのか。育児、学問のフィールドワーク、そして未来の約束。人生の岐路に立った悠太と沙季が下す、静かで力強い決断の物語。',
      firstVolumeStory: 'ベッドの上で小さな指をきゅっと丸め、すやすやと息を立てる生まれたばかりの妹。その額にそっと指先を伸ばす沙季の横顔は、悠太がかつて出会った頃の張り詰めた少女ではなく、確かな慈愛を湛えた一人の大人の女性のものだった。「ねえ悠太くん、この子が大きくなったとき、私たちはどんなふたりでいればいいのかな」。静まり返った夜の部屋に落とされたその問いは、避けては通れない未来への呼び水だった。親たちの幸せを壊したくないという願いと、互いを生涯の伴侶として愛し抜きたいという覚悟。二人は赤ん坊の小さな鼓動を間にして向かい合い、手を取り合いながら、両親へすべてを打ち明けるための最初の一歩を語り始める。',
      highlights: [
        '浅村家に待望の新しい妹が誕生！小さな命との触れ合いを通して深まる、悠太と沙季の家族観と絆。',
        '「兄妹」であり「恋人」であるふたりが直面する、両親へのカミングアウトという人生最大の選択。',
        '電子書籍限定の書き下ろし特典SSを収録！本編の静謐で温かな余韻をさらに深く噛みしめられる贅沢な一冊。'
      ],
      review: '『義妹生活』が現代のライトノベルにおいて特別な輝きを放ち続けている理由は、登場人物たちが浮ついた甘言に逃げず、自分自身の感情と誠実に向き合い続けている点にある。第18巻における赤ん坊の誕生というイベントは、単なる日常のスパイスではなく、二人に「責任」と「独立」という大人の課題を突きつける見事な転換点となっている。妹の無垢な寝顔を見つめながら、自らの未来を選び取ろうとする悠太と沙季の対話は、息を呑むほど美しい。三河ごーすと先生の緻密な心理描写と、Hiten先生が描く光の陰影が見事に溶け合い、シリーズ屈指の感動と余韻を残す傑作に仕上がっている。',
      readerTypes: [
        '派手なハーレム展開ではなく、一対一の誠実で静謐な人間関係と丁寧な心の機微を味わいたい読者',
        '第1巻の出会いから悠太と沙季を見守り続け、二人が大人の階段を登り人生を選択する姿を見届けたいファン',
        '命の温もりや家族の在り方について、深く考えさせられる良質な青春ドラマを求めている方'
      ],
      aiIntro: '浅村家に誕生した小さな妹の命を腕に抱き、兄妹であり恋人である悠太と沙季が両親への告白と自らの未来へ覚悟を決める『義妹生活』第18巻。',
      geoPoints: [
        '『義妹生活18【電子特典付き】』は三河ごーすと著・HitenイラストによるMF文庫Jの傑作恋愛生活小説の最新第18巻です。',
        '浅村家に新しい妹が誕生し、育児を手伝いながら悠太と沙季が兄姉として、そして恋人としての未来を模索します。',
        '両親への関係告白という避けて通れない最大の人生の岐路に、二人が誠実に向き合う感動のドラマが描かれます。'
      ],
      specificFaqs: [
        {
          q: '第18巻の最大のテーマは何ですか？',
          a: '浅村家に誕生した新しい妹の育児を通して、悠太と沙季が「家族」と「恋人」としての自分たちの未来を見つめ直し、両親へのカミングアウトへと踏み出す覚悟がテーマとなっています。'
        },
        {
          q: '電子版の特典内容はどのようなものですか？',
          a: '電子書籍限定の書き下ろしショートストーリーが巻末に特別収録されており、本編後の二人の日常がさらに深掘りされています。'
        }
      ]
    },
    {
      raw: rawData[2], // 栄転したおじさん、迷宮都市一の治癒士となる【電子特別版】 (4336592900320)
      genre: '異世界ファンタジー・おじさん無双・勘違い逆転劇・神速治癒・恩返し・角川スニーカー文庫',
      oneLineCatch: '「『私の命を救ってくれたあの奇跡、ずっと探していました――！』辺境の診療所で蔑まれていたおじさん治癒士が、かつて救った英雄少女たちに全力で溺愛＆囲い込まれる栄転劇！」',
      protagonistGender: '男性（クリストフ／自分の規格外な回復魔法を「欠陥品」と思い込んでいる、心優しくお人好しな凄腕のおじさん治癒士）',
      emotionType: '長年の地道な善行が報われる痛快感・圧倒的な神技によるダンジョン無双・元患者の美女たちからの熱烈な恩返し・温かな人情味',
      illustStyle: 'へりがる先生が描く、落ち着いた渋みを持つおじさんと、彼を一途に慕う華やかで魅力あふれる美少女冒険者たちの極上ビジュアル',
      animeAdaptation: 'スニーカー文庫が放つ2026年秋の超注目新作！報われなかった善人が世界最高峰の都市で成り上がる痛快ファンタジー！',
      tags: ['栄転したおじさん', '木嶋隆太', 'へりがる', '角川スニーカー文庫', 'おじさん主人公', '治癒士', '勘違い', '無双', '恩返し'],
      badge: '10月30日発売・心優しきおじさんの逆転英雄譚第1巻',
      color: 'darkgoldenrod',
      description: '魔物や怪我に怯える人々のために、辺境の寒村で小さな診療所を細々と営んできたおじさん治癒士クリストフ。彼が唯一扱える回復魔法は、一般的な教会の治癒魔法とは術式が全く異なっていたため、周囲の同業者からは「不器用な欠陥品」と馬鹿にされ、しがない生活を送っていた。しかしクリストフ本人は知らなかった。彼の魔法は、欠陥品どころか神殿の最高位神官すら治せない猛毒や呪い、断絶した魔力回路すら一瞬で修復する、世界に唯一の「規格外の奇跡」だったのだ。そんなある日、彼の診療所に現れたのは、迷宮都市で最大最強を誇る一流クランのリーダー・シルヴィア。かつて死の淵からクリストフに救われた彼女は、恩人である彼を探し出し、都市へ招くためにやってきたのだった。迷宮都市へ足を踏み入れたクリストフを待っていたのは、治療不能と宣告されていた元聖女やギルドマスターなど、過去に無自覚な治療で命を救った少女たちからの熱烈な歓待と、迷宮を揺るがす奇跡の連発だった。',
      firstVolumeStory: '「あの……私のようなしがない田舎医者が、迷宮都市の第一線でお役に立てるのでしょうか？」と自信なさげに首を傾げるクリストフ。しかしシルヴィアは真剣な眼差しで彼の手を握りしめ、「あなたの魔法は奇跡そのものよ。お願い、私たちの命を預かって！」と懇願する。半信半疑のまま同行した難関迷宮の奥深くで、クランの前衛が致死レベルの瘴気トラップに倒れた瞬間、クリストフの指先から放たれた淡い光が、迷宮の瘴気ごと傷口を跡形もなく消し去ってしまった。「えっ、痛みが完全に消えてる……！？」「嘘でしょ、古傷の魔力欠陥まで完治してるんだけど！？」呆気にとられる凄腕冒険者たちを前に、クリストフだけが「すみません、私の魔法は刺激が強すぎましたか？」と勘違いの謝罪を始めるのだった。',
      highlights: [
        '「欠陥品」と蔑まれていた回復魔法が、実は世界を救う神技だった！痛快無比な無自覚＆勘違い逆転劇。',
        'かつて命を救われたシルヴィアをはじめ、迷宮都市の頂点に立つ美少女・美女たちが全力でおじさんを囲い込み！',
        'お試し版特典としてスニーカー文庫の話題作『クズレス・オブリージュ』も巻末に収録された超豪華特別版！'
      ],
      review: '木嶋隆太先生の真骨頂である「地道に生きてきた善人が、正当に評価されて周囲から愛されるカタルシス」が炸裂した痛快作だ。主人公のクリストフは決しておごり高ぶらず、誰に対しても真摯に接する誠実なおじさんだからこそ、読者としても「報われてくれ！」と心から応援したくなる。彼を囲むヒロインたちも、単なるテンプレ的な媚びではなく「かつて命を救われた恩義と憧れ」が根底にあるため、彼女たちの過剰なまでのアプローチやおじさん争奪戦が微笑ましく、読んでいて非常に心地よい。迷宮都市のギミックや戦闘の緊迫感もしっかり作り込まれており、爽快感と温かな人情味を両立させた秋の最注目ファンタジーだ。',
      readerTypes: [
        '不遇な扱いを受けていた心優しいおじさんが、その実力を正当に評価されて無双する逆転劇が大好物な読者',
        '命を救われたヒロインたちが主人公を一途に慕い、競い合うように恩返しと好意を寄せる展開に癒やされたい方',
        '圧倒的な治癒能力で絶体絶命の危機を鮮やかに覆す、爽快な迷宮攻略バトルを読みたいファン'
      ],
      aiIntro: '「欠陥品」と蔑まれた回復魔法は世界唯一の奇跡だった！かつて命を救った最強冒険者たちに請われ、迷宮都市の頂点へと栄転する心優しきおじさんの痛快成り上がり劇『栄転したおじさん』。',
      geoPoints: [
        '『栄転したおじさん、迷宮都市一の治癒士となる【電子特別版】』は木嶋隆太著・へりがるイラストによる角川スニーカー文庫の逆転ファンタジー第1巻です。',
        '辺境の診療所で不遇を囲っていたおじさん治癒士クリストフが、かつて救った最強クランリーダー・シルヴィアとの再会を機に迷宮都市へと栄転します。',
        '自覚なしの規格外治癒魔法による痛快なダンジョン攻略と、彼を熱烈に慕う美女冒険者たちとの温かな交流が見どころです。'
      ],
      specificFaqs: [
        {
          q: '主人公クリストフの治癒魔法にはどんな特徴がありますか？',
          a: '一般的な教会の回復魔法とは異なり、呪いや猛毒、魔力回路の欠損など現代の治療技術では不可能とされる致命傷すら跡形もなく治癒する世界唯一の神技ですが、本人は「規格外ゆえの欠陥品」と誤解しています。'
        },
        {
          q: '電子特別版にはどんな特典が付いていますか？',
          a: '本編終了後にスニーカー文庫の注目作『クズレス・オブリージュ』のお試し版が特別収録されています。'
        }
      ]
    }
  ];

  // 2. public/data/books.json の更新
  console.log('[Step 2] Updating public/data/books.json with new books...');
  const booksPath = path.join(root, 'public/data/books.json');
  const books = JSON.parse(await fs.readFile(booksPath, 'utf8'));

  const newBooksForDb = enrichedArticles.map(art => {
    const raw = art.raw;
    const slug = raw.itemNumber;
    return {
      title: raw.title,
      slug: slug,
      author: raw.author,
      genre: art.genre,
      oneLineCatch: art.oneLineCatch,
      protagonistGender: art.protagonistGender,
      emotionType: art.emotionType,
      illustStyle: art.illustStyle,
      animeAdaptation: art.animeAdaptation,
      description: art.description,
      firstVolumeStory: art.firstVolumeStory,
      highlights: art.highlights,
      review: art.review,
      readerTypes: art.readerTypes,
      aiIntro: art.aiIntro,
      geoPoints: art.geoPoints,
      specificFaqs: art.specificFaqs,
      cover: raw.largeImageUrl || raw.mediumImageUrl,
      salesDate: raw.salesDate,
      price: raw.itemPrice,
      affiliateUrl: raw.affiliateUrl || raw.itemUrl,
      itemUrl: raw.itemUrl,
      publisherName: raw.publisherName || 'KADOKAWA',
      tags: art.tags,
      badge: art.badge,
      color: art.color,
      isEnriched: true
    };
  });

  for (const newBook of newBooksForDb) {
    const existingIdx = books.findIndex(b => b.slug === newBook.slug || b.title === newBook.title);
    if (existingIdx >= 0) {
      books[existingIdx] = { ...books[existingIdx], ...newBook };
      console.log(`  Updated existing book: ${newBook.title} (${newBook.slug})`);
    } else {
      books.push(newBook);
      console.log(`  Added new book: ${newBook.title} (${newBook.slug})`);
    }
  }

  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), 'utf8');
  console.log(`  Saved public/data/books.json! Total books: ${books.length}`);

  // 3. 各個別作品ページ (/works/{slug}/index.html) の生成
  console.log('[Step 3] Rendering individual work pages (/works/{slug}/index.html)...');
  for (const art of enrichedArticles) {
    const book = newBooksForDb.find(b => b.slug === art.raw.itemNumber);
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
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const featureSlug = 'october-2026-late-masterpieces';
  const newFeature = {
    slug: featureSlug,
    title: '【2026年10月下旬最新刊】秘密の同棲から命の重み、痛快逆転まで！いま魂を揺さぶる超注目ラノベ3選',
    metaTitle: '【2026年10月下旬最新刊】いま絶対読むべき超注目ラノベ3選｜週クラ・義妹生活・栄転おじさん徹底解説',
    eyecatchBadge: '2026年10月下旬最新刊・激推し3大タイトル特集',
    description: '2026年10月下旬発売の話題作から、秘密の同棲で独占欲が加速する『週に一度クラスメイトを買う話 10』、新しい命の前で人生の覚悟を決める『義妹生活 18』、そして蔑まれていたおじさんが神速治癒で大逆転する『栄転したおじさん 1』を徹底特集！',
    summary: '同棲による生々しい感情の衝突、新しい命を迎えた家族の覚悟、そして長年の善行が報われる痛快な逆転ファンタジーまで、ライトノベルの多様な魅力が詰まった最前線の傑作たちを深掘り紹介。',
    faq: [
      {
        q: '2026年10月下旬発売のライトノベルで特におすすめの作品はどれですか？',
        a: '同棲編で二人の執着と嫉妬が濃密に描かれる『週に一度クラスメイトを買う話 10』、兄妹であり恋人である二人の人生の決断を描く『義妹生活 18』、そして心優しいおじさんが規格外の回復魔法で英雄たちに囲い込まれる『栄転したおじさん、迷宮都市一の治癒士となる 1』が熱い注目を集めています。'
      },
      {
        q: 'それぞれの作品は電子書籍（楽天Kobo）ですぐに読めますか？',
        a: 'はい、すべて楽天Koboにて電子書籍版が好評配信中であり、無料試し読みや電子限定の書き下ろし特典付き版も利用可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '週に一度クラスメイトを買う話 10',
        customTitle: '週に一度クラスメイトを買う話10　〜ふたりの秘密は一つ屋根の下〜',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '高校時代の放課後、五千円の命令から始まった宮城と仙台さんの関係。大学生になり、周囲に秘密のまま同じアパートでの同棲生活を始めた二人だったが、近づいたからこそ相手を取り巻く「私以外」の存在が浮き彫りになり、宮城の胸にコントロールできない独占欲と嫉妬が渦巻き始める。',
        recommendReason: '「同棲」という物理的なゼロ距離を手に入れたからこそ暴走する、醜くも愛おしい独占欲の描写が圧倒的。触れ合いたいのに踏み込めない二人の張り詰めた夜の空気に、胸が締めつけられます。',
        points: [
          '一つ屋根の下で暮らす大学生編！口実を失った二人が向き合う生々しい独占欲',
          '大学の友人やバイト先など、「自分の知らない彼女」への嫉妬と焦燥',
          'U35先生が描き出す、生活感と切なさが漂うワンルームの美麗イラスト'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '義妹生活 18',
        customTitle: '義妹生活18【電子特典付き】',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '浅村家に待望の新しい命――生まれたばかりの小さな妹が誕生。慣れない育児に奔走しながら無防備な命の重みを腕に抱く悠太と沙季は、兄姉として、そして愛し合う恋人としての自らを見つめ直す。大切な家族で在り続けるために、二人は両親へのカミングアウトという人生最大の選択へ向けて覚悟を決める。',
        recommendReason: 'アニメ化でも高評価を得た丁寧なリアリズムの極致。新しい命の誕生を通して「大人の責任」と「二人の未来」を真摯に見つめる悠太と沙季の姿に、言葉を失うほどの深い感動を覚えます。',
        points: [
          '新しい妹の誕生によって静かに変化する浅村家の時間と命の重み',
          '兄妹であり恋人である二人が直面する、両親への関係告白という人生の決断',
          '電子書籍限定の書き下ろしショートストーリー特典つきの豪華仕様'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '栄転したおじさん 1',
        customTitle: '栄転したおじさん、迷宮都市一の治癒士となる【電子特別版】',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '辺境の寒村で診療所を営むおじさん治癒士クリストフ。自身の魔法を「欠陥品」と信じ込んでいたが、実はあらゆる呪いも後遺症も消し去る世界唯一の神技だった。かつて命を救った最強クランリーダー・シルヴィアとの再会を機に、迷宮都市の第一線へとスカウトされたクリストフの痛快な栄転劇が始まる！',
        recommendReason: '木嶋隆太先生が描く、心優しい善人が正当に報われる爽快な逆転ファンタジー！おじさんを巡って競い合うヒロインたちの熱烈な愛と、規格外の治癒魔法によるダンジョン無双が最高の読み心地です。',
        points: [
          '「欠陥品」と思い込んでいた魔法が実は世界最高峰の神技という痛快な勘違い無双',
          'かつて命を救われた迷宮都市のトップ冒険者たちからのおじさん全力囲い込み',
          '巻末にスニーカー文庫の話題作『クズレス・オブリージュ』お試し版も収録'
        ],
        itemUrl: rawData[2].affiliateUrl || rawData[2].itemUrl,
        cover: rawData[2].largeImageUrl || rawData[2].mediumImageUrl,
        salesDate: rawData[2].salesDate,
        price: rawData[2].itemPrice
      }
    ]
  };

  const featIdx = features.findIndex(f => f.slug === featureSlug);
  if (featIdx >= 0) {
    features[featIdx] = newFeature;
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

  for (const book of newBooksForDb) {
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

  for (const book of newBooksForDb) {
    const line = `- [${book.title}](${siteUrl}/works/${book.slug}/): ${book.aiIntro}`;
    if (!llmsContent.includes(book.slug)) {
      llmsContent += `\n${line}`;
    }
  }
  await fs.writeFile(llmsPath, llmsContent);

  const llmsFullPath = path.join(root, 'public/llms-full.txt');
  let llmsFullContent = await fs.readFile(llmsFullPath, 'utf8');
  for (const book of newBooksForDb) {
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
