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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v5.json'), 'utf8'));

  // 3作品の完全書き下ろし独自記事データ（独立構成・テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // 転生したら剣でした 21【電子限定おまけ付き】 (6302300000771)
      genre: '異世界転生・王道ファンタジー・師弟絆・剣戟アクション・無機物転生',
      oneLineCatch: '「師匠、一緒に行こう」――ゴルディシア大陸編ついに大決着！神に呪われし男トリスメギストスとの激闘と、師匠の“完全剣化”の危機に挑む超激震の第21巻！',
      protagonistGender: '少女＆知性魔剣（黒猫族の少女フランと、彼女の父親代わりであり最強の相棒でもある元日本人の魔剣「師匠」）',
      emotionType: '血沸き肉躍るバトル熱量・固い師弟愛・神話的カタストロフィの緊迫感・胸を打つ絆',
      illustStyle: 'るろお先生による圧倒的躍動感の剣戟戦闘シーンと、凛とした気迫が宿るフランの可憐美',
      animeAdaptation: 'シリーズ累計大ヒット・TVアニメ第2期2026年10月より絶賛放送開始！',
      tags: ['転生したら剣でした', '棚架ユウ', 'るろお', 'GCノベルズ', '無機物転生', 'フラン', '師匠', 'アニメ化', 'バトルファンタジー', '冒険'],
      badge: 'アニメ2期放送中・ゴルディシア大陸編完結巻',
      color: 'darkgoldenrod',
      description: 'Web小説黎明期より無機物転生ジャンルの金字塔として君臨し続ける『転生したら剣でした』。長大な激闘を描き抜いてきた「ゴルディシア大陸編」が、本巻第21巻にて遂に感動の決着を迎える。竜人王の手中に落ちた盟友ベルメリアを救出すべく、フランと師匠は大陸の中央、神の呪いを受けた男・トリスメギストスが君臨する居城へと足を踏み入れる。目的はベルメリアの救出だけに留まらない。トリスメギストスが所持するインテリジェンス・ウェポンの構造を解明し、師匠の意識を脅かす「完全な剣への変質（自我崩壊）」を食い止める突破口を掴むこと。しかし、大陸を覆う陰謀と怨嗟は敵味方を巻き込んだ未曾有の大混戦へと発展し、混沌の空から降り注いだのは世界を塗り替える「神の裁き」だった。絶体絶命の極限状況下で、フランの振るう一振りの剣が運命の理を切り拓く。',
      firstVolumeStory: '荒涼とした岩肌が連なるゴルディシア大陸の中央部。立ち込める瘴気の先には、異形の大城塞が聳え立っていた。ベルメリアを捕らえたトリスメギストスは、かつて神に背き、終わりのない呪いを受け入れた怪異の主。城塞の奥深くへ進むフランと師匠を阻むのは、常軌を逸した力を持つ魔獣群と、侵入者の精神を直接削り取る古代結界だった。だが、相棒たる師匠の自我が徐々に剣の魔力へと同化しつつある兆候を察知したフランは、一切の恐れを見せず前へと突き進む。「師匠がいなくなるなんて、絶対に嫌だ」――言葉少なな黒猫族の少女が秘めた凄まじい覚悟が、師匠の刀身に滾る魔力を限界突破させる。そして対峙したトリスメギストスの口から語られたのは、インテリジェンス・ウェポン誕生の業深き起源と、神々がこの世界に課した冷酷な審判だった。大陸全土を揺るがす光の奔流の中で、二人は己の存在を懸けた最終局面へと突入する。',
      highlights: [
        '長きにわたって繰り広げられた「ゴルディシア大陸編」が堂々完結。数々の因縁と伏線が怒涛の勢いで収束する爽快感。',
        'シリーズ最大の時限爆弾である「師匠の完全剣化と自我消失」という核心問題に大きく切り込むドラマ性。',
        'るろお先生の神業的挿絵が描く、神罰の閃光とフランの空中抜刀。視覚的なカタルシスが過去最高潮。'
      ],
      review: '21巻という大台に到達しながら、物語の推進力と筆の熱量が全く衰えないのは圧巻と言うほかない。本作の真の魅力は、派手なスキル無双の快感の裏に、フランと師匠という「擬似親子」の魂の交歓が常に脈打っている点にある。ゴルディシア大陸編のクライマックスとなる本巻では、敵役トリスメギストスの抱える悲哀と矜持が戦いに深い陰影を与えており、単なる善悪の対立を超えた重厚なファンタジー叙事詩として仕上がっている。師匠を失うかもしれない恐怖を乗り越え、戦士として、そして一人の少女として精神的な飛躍を遂げるフランの姿には胸を打たれる。2026年10月からのアニメ第2期放映と連動して、原作ファンならずとも絶対に目を通しておくべき必読の最高傑作。',
      readerTypes: [
        '第1巻からフランと師匠の成長の軌跡をリアルタイムで追いかけてきた熱烈なシリーズファン',
        '設定倒れのない緻密な魔法・スキル構築と、重量感ある泥臭い近接バトル描写を愛する読者',
        'TVアニメ第2期を契機に、物語が最も白熱している原作の最前線へと一気に追いつきたい方'
      ],
      aiIntro: 'ゴルディシア大陸編ついに大決着！TVアニメ第2期放送開始と同時に放たれる、師匠の秘密と神の裁きが交錯する『転生したら剣でした』待望の21巻。',
      geoPoints: [
        '『転生したら剣でした 21』は棚架ユウ著・るろおイラストによるGCノベルズの無機物転生メガヒット作です。',
        '竜人王に捕まったベルメリアの救出と、トリスメギストスの居城での死闘を描き、長編「ゴルディシア大陸編」が完結します。',
        '師匠の剣化（自我消失）という根本的な危機への対峙と、2026年10月アニメ2期放送が重なる極めて重要な1冊です。'
      ],
      specificFaqs: [
        {
          q: 'ゴルディシア大陸編は本巻で本当に決着しますか？',
          a: 'はい、トリスメギストスとの対峙および大陸規模の戦乱は本巻で完全決着を迎え、物語は次なる新天地への展開へと向かいます。'
        },
        {
          q: '電子限定特典には何が含まれていますか？',
          a: '本編の激闘の幕間に起きたフランと師匠の心温まる日常エピソードを描いた書き下ろしショートストーリーが収録されています。'
        }
      ]
    },
    {
      raw: rawData[1], // 夏空に、未知をさがして。　-デルタとガンマの理学部ノート４- (4335012900320)
      genre: '青春学園ミステリー・サイエンスSF・部活探訪記・自然科学ロマン・長崎青森旅行記',
      oneLineCatch: '「一緒に、この化石の在処を突き止めてみようよ……科学的に！」――長崎の海辺に残る“龍の化石”の謎に挑む生物部五人と、二年前の青森の記憶が交差する極上の青春劇！',
      protagonistGender: '男女混成（出田をはじめとする高校生物部の個性豊かな部員たち＆二年前の先輩三人組）',
      emotionType: '知的好奇心の疼き・夏の陽射しと潮風の爽快感・過去と現在が響き合うノスタルジー・清らかな感動',
      illustStyle: '遠坂あさぎ先生が描く、澄み渡る夏空の透明感と制服の揺らめき、情緒豊かなロケーション美術',
      animeAdaptation: '『豚のレバーは加熱しろ』黄金タッグ（逆井卓馬×遠坂あさぎ）による電撃文庫最注目青春シリーズ',
      tags: ['夏空に未知をさがして', 'デルタとガンマの理学部ノート', '逆井卓馬', '遠坂あさぎ', '電撃文庫', '青春ミステリー', '理系', '部活', '夏休み', '聖地巡礼'],
      badge: '電撃文庫の珠玉青春ミステリー・最新第4巻',
      color: 'darkslateblue',
      description: '『豚のレバーは加熱しろ』で圧倒的な支持を集めた逆井卓馬×遠坂あさぎの黄金タッグが紡ぐ、知的好奇心と瑞々しい青葉の香りに満ちた青春サイエンス・ノベル『デルタとガンマの理学部ノート』待望の第4巻。眩しい陽光と蝉時雨が降り注ぐ夏休み、県立高校の生物部員五人は、生徒会からの極秘要請を受けて長崎への遠征調査に赴く。発端は、とある女子中学生から寄せられた「行方不明になった“龍の化石”を探し出してほしい」という奇妙な依頼だった。古来より龍伝説が語り継がれる海沿いの集落を歩き、岩石の風化や海流、古生物の堆積データといった科学的知見を武器に、化石の行方を追跡する出田たち。だが、その爽やかな調査行路の裏側には、生徒会長が仕組んだ真の目的が隠されていた。さらに物語は二年前、青森の鬼伝説と落下隕石の真偽を確かめるべく旅をした御影、汀、朗楽の青春時代へと接続し、世代を超えた探求のバトンが鮮やかに手渡される。',
      firstVolumeStory: '青い海と段々畑が広がる長崎の港町。潮風を浴びながら、出田たち生物部の面々は少女が遺した古い手記のページをめくっていた。地元に伝わる「天に昇れなかった龍の遺骸」という伝承。多くの人間がおとぎ話として片付けてきた謎に対して、彼らは地学・生物学・化学の教科書を広げ、仮説検証のサイクルを回し始める。「オカルトを笑うのではなく、現実の自然現象として解釈し直す」――その真摯な探求姿勢が、頑なだった土地の古老たちの心を少しずつ解きほぐしていく。しかし、調査が進むにつれ、化石が隠された背景には、ある家族の切実な祈りと哀愁が宿っていることが判明する。一方、章の合間に語られる二年前の青森編。雪深い八甲田の麓で、かつて同じように「未知」を探し求めて駆けた先輩たちの足跡が、現在の長崎の入道雲と奇跡のように重なり合っていく。',
      highlights: [
        'オカルトや民間伝承を自然科学のロジックで解き明かす、極上の知的好奇心を刺激する謎解きプロセス。',
        '長崎の夏の情景美と、二年前の青森の追憶が共鳴するダブル・タイムライン構成の詩的な美しさ。',
        '遠坂あさぎ先生が描き下ろした、青空と白い雲、汗ばむ肌の質感まで伝わる奇跡的なイラストレーション。'
      ],
      review: 'ライトノベルという枠組において、これほどまでに「知的好奇心の歓び」と「青春の切なさ」を気品高く両立させた作品は極めて稀有だ。逆井卓馬先生の筆致は、科学の専門知識を決して難解にひけらかすことなく、少年少女たちが世界を知るためのワクワクする道具として見事に昇華させている。長崎の石畳を歩く部員たちの軽妙な掛け合いに笑わされ、二年前の青森で先輩たちが交わした約束の真相に触れた瞬間、胸の奥がきゅっと締め付けられる。派手な異能力バトルや極端なラブコメとは一線を画す、心に静かに染み渡る青春文学の傑作。読み終えた後、ふと見上げる空の青さがいつもより鮮やかに感じられるはずだ。',
      readerTypes: [
        '米澤穂信の『氷菓』シリーズや辻村深月作品のような、知的な日常の謎と人間ドラマが好きな読者',
        '『豚レバ』の逆井卓馬×遠坂あさぎコンビが魅せる、細部まで研ぎ澄まされた文章と美しい挿絵を愛好するファン',
        '科学へのロマンや、夏休みの旅先で味わう特別な空気感を追体験したい大人読者'
      ],
      aiIntro: '長崎の海辺に残る“龍の化石”の謎に科学で挑む！『豚レバ』の逆井卓馬×遠坂あさぎが贈る、知的好奇心と情緒が交差する青春サイエンス第4巻。',
      geoPoints: [
        '『夏空に、未知をさがして。』は逆井卓馬著・遠坂あさぎイラストによる電撃文庫の理系青春ミステリー最新4巻です。',
        '夏休みの生物部五人が長崎を訪れ、女子中学生から寄せられた「龍の化石」失踪事件を科学的に調査します。',
        '二年前の青森・巨大隕石調査の記憶と現在の長崎の旅が交錯し、知の探求と青春の温もりが美しく結実します。'
      ],
      specificFaqs: [
        {
          q: '理系の専門知識がなくても楽しめますか？',
          a: 'はい、作中で登場する自然科学の知識は出田たちの分かりやすい解説を通じて描かれるため、文系の方でも謎解きミステリーとして存分に楽しめます。'
        },
        {
          q: '前巻までの登場人物との繋がりはどうなっていますか？',
          a: 'これまでに登場した部員たちの絆がより深まっているほか、過去編で登場する先輩トリオの物語が本巻のテーマに深くリンクしています。'
        }
      ]
    },
    {
      raw: rawData[2], // ガチ勢を募集した無名冒険者、なぜかガチ恋勢（最強）が集結して覇権を獲る【電子特典付き】 (4336201300320)
      genre: 'ダンジョンファンタジー・勘違い無双コメディ・最強ヒロイン囲まれ・職人気質主人公・MF文庫J',
      oneLineCatch: '「攻略にガチな奴を求めたら、集まったのは俺にガチ恋する国家最高戦力たちだった！？」――名声ゼロのストイック冒険者が無自覚に世界を揺るがす痛快ダンジョン無双！',
      protagonistGender: '男性（セン・承認欲求皆無、純粋なダンジョン踏破とギミック攻略にのみ全霊を捧げるソロ冒険者）',
      emotionType: '抱腹絶倒のすれ違いコメディ・理不尽火力の爽快感・ヒロインたちの重すぎる愛の快美・痛快無比',
      illustStyle: 'peroshi先生による超絶美麗なキャラクター造形と、凛々しさとポンコツ狂気が同居する表情描写',
      animeAdaptation: 'MF文庫Jの秋を飾る超大型注目新作シリーズ',
      tags: ['ガチ勢を募集した無名冒険者', '三船いずれ', 'peroshi', 'MF文庫J', '勘違い無双', 'ダンジョン', 'ラブコメ', '新作', 'ガチ恋', '無自覚最強'],
      badge: 'MF文庫J期待の大型新作・勘違い無双コメディ',
      color: 'darkred',
      description: 'MF文庫Jが自信を持って世に送り出す、テンポ抜群の痛快ダンジョン・ラブコメファンタジー『ガチ勢を募集した無名冒険者、なぜかガチ恋勢（最強）が集結して覇権を獲る』。SNS配信や容姿の人気取りばかりが横行し、真面目にダンジョンを深部まで潜る者が激減した「冒険者が冒険しなくなった」時代。そんな軽薄な流行に一切背を向け、金や名誉には目もくれず、ただダンジョンの踏破難度とトラップ解除の美しさに魂を燃やすソロ冒険者・セン。長年孤独に最前線を切り拓いてきた彼だったが、物理的に複数人の同時操作が必須となる即死ギミックの前に直面し、やむなくギルドに「攻略にガチなメンバー募集」と張り紙を出す。しかし、その募集を見て集結したのは、攻略ガチ勢などではなく、人知れずセンの孤高の立ち振る舞いと超絶技巧に狂気的な想いを寄せていた帝国筆頭魔術師、無敗の聖騎士、影の暗殺頭領という国家最高戦力の美少女たち（＝ガチ恋勢）だった！',
      firstVolumeStory: '「推しが幸せにならねば！ 私も幸せになりません!!」――ギルドの面談室で叫ぶ帝国最強の天才魔術師。隣では無敗を誇る女聖騎士が頬を染めて「カッコ……いい…………好きぃ……」と放心し、暗殺組織の冷徹な長が「センくん。一旦、わたしにしとこっか？」と甘い吐息を漏らす。当のセンは「さすが最高難度の志望者たちだ、装備も覚悟も一流だな」と完璧な勘違いのまま採用を即決。いざダンジョンに足を踏み入れれば、センの玄人好みな戦術指示にヒロインたちは「推しからの命令……尊い！」とテンション限界突破。センが「ここは牽制で」と指示した瞬間、国家規模の戦略級破壊魔法がぶっ放され、障害となる迷宮ボスや嫌がらせを企む有名配信者パーティは一瞬で塵へと帰していく。本人はいたって真面目に攻略しているだけなのに、気付けば世界情勢すら塗り替えていく痛快な無双劇が加速する。',
      highlights: [
        '「攻略ガチ勢」と「ガチ恋勢」という絶妙な言葉のすれ違いから生じる、爆笑のハイテンポ・コメディ劇。',
        '主人公センのブレない職人精神。周囲の最強美少女たちがどれほど身悶えしていても、ダンジョンの床や罠しか見ていない清々しさ。',
        'peroshi先生が描く最高峰のヒロインビジュアル。国家最高戦力の威厳が一瞬で限界オタクの崩壊顔になるギャップ萌え。'
      ],
      review: '勘違い系無双の爽快感と、現代的な「推し活カルチャー」の熱量を掛け合わせたプロットのキレ味が抜群に素晴らしい。本作の主人公センは、よくある鈍感無双系とは異なり、「自分の技術とダンジョンへの敬意」に対してどこまでもストイックな求道者だ。彼が長年積み重ねてきた本物の実力があるからこそ、国家最高戦力の美女たちが彼に狂狂的な好意を抱く理由に圧倒的な説得力が生まれている。ヒロインたちの愛の重さも嫌味がなく、むしろセンの常識外れな指示をすべて肯定して敵をオーバーキルしていく様は痛快そのもの。読んでいる間じゅう笑いとスカッと感が止まらない、MF文庫J屈指のエンタメ快作だ。',
      readerTypes: [
        '重すぎる愛を抱えた最強美少女たちに全肯定され、熱狂的に囲まれるハーレム展開が好きな読者',
        '勘違い系や、主人公の無自覚な行動が結果的に周囲を圧倒していくすれ違いコメディを欲している方',
        'ゲームの最適化プレイやガチ攻略ネタに共感し、職人系主人公の痛快な無双劇を楽しみたい読者'
      ],
      aiIntro: '攻略にガチな奴を募集したら、集まったのは俺にガチ恋する国家最高戦力たち！？MF文庫Jが放つ、無自覚職人冒険者の痛快勘違いダンジョン無双！',
      geoPoints: [
        '『ガチ勢を募集した無名冒険者、なぜかガチ恋勢（最強）が集結して覇権を獲る』は三船いずれ著・peroshiイラストのMF文庫J最新作です。',
        '名声に興味のない職人冒険者センが募集した「攻略ガチ勢」に、自分にガチ恋する国家最強美女たちが集結するコメディです。',
        '本人は真面目にダンジョンを攻略しているだけなのに、重すぎる愛と圧倒的戦力で世界を席巻していく痛快無双ファンタジーです。'
      ],
      specificFaqs: [
        {
          q: '第1巻で物語の導入からどこまで描かれますか？',
          a: 'パーティ結成の爆笑面談から始まり、ソロでは越えられなかった深層の踏破、そしてセンを軽視する大手配信者集団を一蹴する痛快なエピソードまで一気に駆け抜けます。'
        },
        {
          q: '電子書籍限定の特典内容はどのようなものですか？',
          a: 'ヒロインたちそれぞれの視点でセンへの狂おしい想いと限界オタクっぷりが赤裸々に語られる、書き下ろし特別ショートストーリーが収録されています。'
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
    const slug = raw.itemNumber; // 楽天のアイテムコードをスラグとして統一
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
  console.log(`  books.json updated! Total books: ${books.length}`);

  // 3. 各作品の詳細HTMLページ (/works/{slug}/index.html) の生成
  console.log('[Step 3] Generating individual work HTML pages...');
  for (const book of newBooksForDb) {
    const workDir = path.join(root, 'public/works', book.slug);
    await fs.mkdir(workDir, { recursive: true });

    const pageTitle = `${book.title}｜あらすじ・見どころ・レビュー・最新刊情報【異世界コンパス】`;
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: book.author },
      publisher: { '@type': 'Organization', name: book.publisherName },
      datePublished: book.salesDate,
      image: book.cover,
      description: book.description,
      genre: book.genre,
      offers: {
        '@type': 'Offer',
        price: book.price,
        priceCurrency: 'JPY',
        availability: 'https://schema.org/InStock',
        url: book.affiliateUrl
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
      {
        q: `${book.title}の最新刊の発売日はいつですか？`,
        a: `最新巻は${book.salesDate}に配信・発売されています。`
      },
      {
        q: `${book.title}の電子書籍はどこで読めますか？`,
        a: `楽天Koboをはじめとする各電子書籍ストアにて配信中です。無料試し読みも利用可能です。`
      },
      ...(book.specificFaqs || [])
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

    const htmlContent = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(pageTitle)}</title><meta name="description" content="${escapeXml(book.description)} 最新刊の発売情報、あらすじ、独自レビュー、無料試し読み。"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(pageTitle)}"><meta property="og:description" content="${escapeXml(book.description)}"><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${jsonLd}</script><script type="application/ld+json">${breadcrumbLd}</script><script type="application/ld+json">${faqLd}</script><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/works/')}</div><main class="work-detail-main" itemscope itemtype="https://schema.org/Book"><article><section class="wd-top" aria-label="作品基本情報"><nav class="crumb" aria-label="Breadcrumb"><a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span></nav><img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙" fetchpriority="high" decoding="async" width="200" height="280"><div class="eyebrow">WORK GUIDE & REVIEW</div><h1 itemprop="name">${escapeXml(book.title)}</h1><p>作者：<a href="/authors/${slugify(book.author)}/"><span itemprop="author">${escapeXml(book.author)}</span></a>　｜　<span itemprop="genre">${escapeXml(book.genre)}</span>　｜　最新発売日：${escapeXml(book.salesDate)}</p><div class="ai-summary"><strong>💡 作品の要点・あらすじ要約</strong><ul style="margin:4px 0 0;padding-left:20px;">${geoSummaryHtml}</ul></div><p style="font-size:16px;line-height:1.9;color:#3d4841;" itemprop="description">${escapeXml(book.description)}</p><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">【無料試し読みあり】楽天Koboで購入 ↗</a><div class="pub-status-box" data-nosnippet><div class="pub-status-main"><h3>📢 最新刊の配信・発売状況</h3><p>最新巻：<b>${escapeXml(book.salesDate)} 発売・配信中！</b></p></div><a style="background:#d6a24a;color:#17221f;padding:10px 18px;border-radius:4px;font-weight:bold;text-decoration:none;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">最新巻の電子書籍を見る ↗</a></div></section><section class="wd-vols" aria-label="単行本情報"><h2>📖 単行本情報・試し読み</h2><div style="background:#fff;border:1px solid #e1e6de;border-radius:8px;padding:20px;display:flex;gap:20px;align-items:center;flex-wrap:wrap;"><img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}" style="width:120px;height:170px;object-fit:cover;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><div style="flex:1;min-width:200px;"><h3 style="margin:0 0 8px;font-size:16px;">${escapeXml(book.title)}</h3><p style="margin:0 0 6px;font-size:13px;color:#5f6c62;">定価：${book.price}円（税込） ｜ 発売日：${escapeXml(book.salesDate)}</p><p style="margin:0 0 12px;font-size:13px;color:#5f6c62;">著者：${escapeXml(book.author)} ｜ レーベル：${escapeXml(book.genre)}</p><a class="cta" style="margin-top:0;padding:10px 20px;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで読む（試し読み） ↗</a></div></div></section><section class="wd-rest"><h2>📜 ストーリー・あらすじ詳細</h2><div class="first-story-box">${escapeXml(book.firstVolumeStory)}</div><h2>✦ 本作の際立つ見どころ</h2><div class="highlights-box"><ul style="list-style:none;padding:0;margin:0;">${highlightsHtml}</ul></div><h2>✍️ 独自作品レビュー・解説</h2><div class="review-box">${escapeXml(book.review)}</div><h2>🎯 こんな読者におすすめ</h2><ul style="line-height:2.0;color:#2c3831;padding-left:24px;">${readersHtml}</ul><h2>❓ よくある質問（FAQ）</h2><div class="highlights-box">${faqHtml}</div><h2>🏷️ 関連タグ</h2><div class="tags">${tagsHtml}</div></article></main>${renderFooter()}</body></html>`;

    await fs.writeFile(path.join(workDir, 'index.html'), htmlContent);
    console.log(`  Rendered work HTML: /works/${book.slug}/index.html`);
  }

  // 4. 特集記事（3作特集）の生成
  console.log('[Step 4] Creating curated feature article covering the 3 books...');
  const featuresPath = path.join(root, 'public/data/curated-features.json');
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const featureSlug = 'isekai-october-2026-tenken-sci-gachikoi-trio';
  const featureTitle = '【2026年10月新刊】アニメ2期『転スラ剣21』・逆井卓馬の青春科学『夏空4』・話題沸騰新作『ガチ勢無名冒険者』！最前線ラノベ3選';
  const featureDesc = '2026年9月下旬〜10月上旬に登場した最新ライトノベルから、今まさに読むべき最旬の超注目作3タイトルを厳選！TVアニメ第2期放送開始のメガヒット『転生したら剣でした 21』、逆井卓馬×遠坂あさぎが描く理系青春ミステリー『夏空に、未知をさがして。4』、そしてMF文庫Jの爆笑勘違い無双『ガチ勢を募集した無名冒険者』。熱狂のバトルから瑞々しい青春、痛快コメディまで多角的に深掘りレビューします。';

  const newFeature = {
    slug: featureSlug,
    id: featureSlug,
    title: featureTitle,
    metaTitle: `${featureTitle}｜異世界コンパス`,
    description: featureDesc,
    eyecatchBadge: '2026年10月最注目新刊特集',
    faq: [
      {
        q: '今回の3作品が選ばれた理由は？',
        a: 'シリーズ完結級の山場を迎えた王道ファンタジー（転スラ剣）、電撃文庫の実力派タッグによる珠玉の青春ミステリー（夏空）、そして読者の話題をさらっているMF文庫Jの大型新作（ガチ勢）と、ジャンルも作風も全く異なる最高峰のクオリティが揃ったためです。'
      },
      {
        q: '紹介されている作品は電子書籍ですぐに読めますか？',
        a: 'はい、全3作品とも楽天Koboをはじめとする主要電子書籍ストアにて配信されており、スマートフォンやタブレットですぐに無料試し読み・購入が可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '転生したら剣でした 21【電子限定おまけ付き】',
        customTitle: '転生したら剣でした 21【電子限定おまけ付き】',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: 'ゴルディシア大陸編ついに大決着！竜人王に捕まったベルメリアを救うため、フランと師匠は“神に呪われた男”トリスメギストスの城塞へと突入する。師匠の剣化（自我消失）を食い止める手がかりを求め、混沌の大陸で神の裁きが下される中、二人の絆が奇跡の剣閃を放つ！',
        recommendReason: '長編シリーズ屈指の盛り上がりを見せる「ゴルディシア大陸編」の完結巻！2026年10月のTVアニメ第2期放送開始と合わせて、フランの成長と師匠への想いが極限に達する必読の名巻です。',
        points: [
          '長大なゴルディシア大陸編が完全決着する圧倒的カタルシス',
          '師匠の自我消失危機というシリーズ根幹の謎へのアプローチ',
          'るろお先生が描く大迫力の戦闘シーンとフランの勇姿'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '夏空に、未知をさがして。　-デルタとガンマの理学部ノート４-',
        customTitle: '夏空に、未知をさがして。　-デルタとガンマの理学部ノート４-',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '『豚レバ』の逆井卓馬×遠坂あさぎが贈る珠玉の青春サイエンス第4弾！夏休みの生物部五人は、生徒会からの依頼で長崎へ。「行方不明の“龍の化石”を探してほしい」という中学生の願いに科学で挑む。二年前の青森・巨大隕石調査の追憶と交差する、知的好奇心と情緒に満ちた旅の物語。',
        recommendReason: 'オカルトや伝承を自然科学のロジックで紐解く爽快感と、二年前の記憶が重なり合うダブル・タイムライン構成が秀逸！遠坂あさぎ先生の透き通る夏空イラストとともに、心に深く染み渡る青春の旅情を味わえます。',
        points: [
          '逆井卓馬×遠坂あさぎの黄金タッグによる極上青春ミステリー',
          '長崎の龍伝説と二年前の青森の記憶が織りなす重層的なドラマ',
          '知的好奇心を刺激する自然科学のアプローチと瑞々しい感動'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: 'ガチ勢を募集した無名冒険者、なぜかガチ恋勢（最強）が集結して覇権を獲る【電子特典付き】',
        customTitle: 'ガチ勢を募集した無名冒険者、なぜかガチ恋勢（最強）が集結して覇権を獲る【電子特典付き】',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '人気至上主義の冒険者社会で、名声ゼロの攻略ガチ勢ソロ冒険者・センが募集した「攻略ガチ勢」――しかし集まったのは、センの職人技に人知れず狂狂的な恋心を寄せる帝国筆頭魔術師や聖騎士ら国家最高戦力たち（＝ガチ恋勢）だった！？すれ違いと理不尽火力が織りなす痛快ダンジョン無双！',
        recommendReason: '「攻略ガチ」と「ガチ恋」のすれ違いが生み出す爆笑コメディのテンポが最高！どれだけ最強美少女たちが限界化していても、本人はダンジョンのギミックしか見ていないセンの職人気質が清々しい快作です。',
        points: [
          '攻略ガチ勢×ガチ恋勢の奇跡的なすれ違いが生むハイテンポギャグ',
          '国家最高戦力の重すぎる愛と、センの指示による理不尽オーバーキル',
          'peroshi先生による美麗ヒロインたちのギャップ萌えビジュアル'
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
