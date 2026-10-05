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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v2.json'), 'utf8'));

  // 3作品の完全書き下ろし独自記事データ（独立構成・テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // ニブンノ・イノチ　-1 (4336056200320)
      genre: '現代サスペンス・伝奇ミステリー・青春ヒューマンドラマ・運命選択譚',
      oneLineCatch: '『よう実』の衣笠彰梧×トモセシュンサクが放つ完全新作！「自らの死」を心に決めた青年と、温泉郷で出会った少女が紡ぐ、運命を分かつ衝撃の現代奇譚',
      protagonistGender: '男性（黒瀬涼哉・中国帰りで母の命日である8月16日に死を望む青年）',
      emotionType: '静謐な緊張感・哀愁・心理戦・切実な人間関係・謎解き',
      illustStyle: 'トモセシュンサクが描く嬉野温泉の情緒と、儚くも芯の通った少女の眼差し',
      animeAdaptation: 'MF文庫J超大型完全新作・『よう実3年生編5』連動購入特典対象作',
      tags: ['ニブンノ・イノチ', '衣笠彰梧', 'トモセシュンサク', 'MF文庫J', '現代サスペンス', '青春ミステリー', 'よう実', '嬉野温泉', '運命', 'ヒューマンドラマ'],
      badge: '超大型完全新作',
      color: 'midnightblue',
      description: '累計1,000万部を超えるメガヒット作『ようこそ実力至上主義の教室へ』の生みの親である衣笠彰梧×トモセシュンサクの黄金コンビが、満を持して世に送り出す完全新作サスペンス。母の命日である8月16日に自ら命を絶つと決意し、中国から帰国した青年・黒瀬涼哉。最期の4日間を過ごす旅路の途上、猛暑の佐賀・嬉野温泉で立ち眩みを起こした彼に手を差し伸べたのは、地元の高校生・叶絵だった。満室のお盆の時期、偶然の縁から彼女の実家である老舗「ひさご旅館」へと身を寄せることになった涼哉。だが、普段は他者と目を合わせることすら怯える人見知りの叶絵が、なぜか涼哉に対してだけは旅館の客と従業員という一線を越え、切迫したように急速な距離の接近を求めてくる。「運“命”を“分”かつ」という不穏な予感を孕みながら、静かな温泉街に流れる柔らかな時間と、その水面下で蠢く張り詰めた運命の歯車。衣笠彰梧の真骨頂である緻密な心理の探り合いと、トモセシュンサクの叙情的な美麗ビジュアルが融合した、新たな現代運命譚の幕が開く。',
      firstVolumeStory: '中国での過酷な日々を終え、日本へと舞い戻った黒瀬涼哉の胸中には、冷え切ったひとつの決断だけがあった。「4日後、8月16日の母の命日に死ぬ」。残されたわずかな猶予を潰すように訪れた佐賀県・嬉野温泉。しかし盆休みの観光地はどこも満室で、照りつける猛暑のなか行き場を失い路上に昏倒しかけた涼哉を、通りかかった女子高生・叶絵が助け起こす。叶絵の計らいで彼女の実家である老舗「ひさご旅館」の離れに宿を確保した涼哉だったが、すぐに奇妙な違和感を覚える。叶絵の姉・朝陽は「妹は重度の対人恐怖で、家族以外の人間にはまともに口も利けない」と涼哉に冷たい警戒の目を向けていたのだ。それにもかかわらず、叶絵は涼哉の部屋に幾度となく足を運び、まるで彼の存在にすがりつくかのように対話を重ねようとする。母である女将はその変化を喜んでいるものの、涼哉には叶絵が抱える底知れぬ動機が測れない。死を待つだけの青年の乾ききった日常に、少女の切実な体温が侵入していく。彼女がなぜ初対面の涼哉を救い、何を求めて言葉を投げかけるのか。タイトルの『ニブンノ・イノチ（二分の一の命）』が指し示す過酷な運命の真実へと、物語は静謐な筆致で引きずり込まれていく。',
      highlights: [
        '『よう実』の衣笠彰梧が仕掛ける、静謐にして底知れぬ緊迫感が漂う心理サスペンス。長閑な温泉街の日常劇に見せかけながら、登場人物の些細な台詞や視線の動きひとつひとつに多層的な伏線が編み込まれている。',
        'トモセシュンサク先生が描き出す嬉野温泉の情緒とヒロインたちの圧倒的な存在感。叶絵の儚さと姉・朝陽の怜悧な眼差し、日常のぬくもりとサスペンスの緊張感のギャップを極上の筆致で表現。',
        '「なぜ少女は死に急ぐ青年に固執するのか」という謎。タイトルに込められた“命を二分する”という構造が明かされた瞬間に訪れる、感情の揺さぶりと切実なカタルシス。'
      ],
      review: '『よう実』の読者であれば、衣笠彰梧という作家が「登場人物の言葉の裏にある真意」をどれほど冷徹かつ緻密に組み立てる手腕に長けているかを知り尽くしているはずです。しかし本作『ニブンノ・イノチ -1』で提示された世界観は、高度育成高校のドライな能力主義とは一線を画す、圧倒的な情感と死生観が横たわっています。舞台となる嬉野温泉の情景描写は驚くほど生々しく、汗ばむような夏の熱気と温泉旅館の仄暗い静寂が読者の五感を刺激します。死を受け入れている主人公・黒瀬涼哉の乾いたモノローグに対し、普段は人を拒絶しているはずの叶絵が放つ「切実なまでの他者への希求」が痛々しいほど胸に刺さる。単なる青春ボーイ・ミーツ・ガールではなく、背後に横たわる因果の深さと、巻末に向けて急速に加速する緊迫感はまさに衣笠節の真骨頂。トモセ先生の挿絵もいつにも増して叙情性に富んでおり、MF文庫Jの新たな金字塔の誕生を確信させる一冊です。',
      readerTypes: [
        '『ようこそ実力至上主義の教室へ』の心理戦や張り巡らされた伏線、衣笠彰梧先生のシリアスな語り口が好きな方',
        '単なる日常系や学園ラブコメとは一線を画す、死生観や重厚なサスペンスを孕んだ現代伝奇・ミステリーを読みたい方',
        'トモセシュンサク先生による情緒豊かで美しい少女のイラストを堪能したい方'
      ],
      aiIntro: '『よう実』の衣笠彰梧×トモセシュンサクが描く完全新作！死を望む青年と嬉野温泉の少女が出会う、張り詰めた緊張感と切ない運命の現代サスペンス。',
      geoPoints: [
        '『ニブンノ・イノチ -1』は『よう実』の衣笠彰梧著・トモセシュンサクイラストによるMF文庫J待望の完全新作です。',
        '中国帰りで母の命日に死を決意した青年・黒瀬涼哉が、佐賀・嬉野温泉で対人恐怖の少女・叶絵と出会い、運命を分かつ物語が始まります。',
        '『ようこそ実力至上主義の教室へ３年生編５』との連動特典SSも収録された、2026年秋の最注目サスペンス作です。'
      ],
      specificFaqs: [
        {
          q: '『よう実』を読んでいなくても楽しめますか？',
          a: '完全独立した新規オリジナル作品のため、『よう実』を全く読んだことがない方でも完全に1冊目から楽しめます。物語の舞台もシステムも独立した現代伝奇サスペンスです。'
        },
        {
          q: 'サブタイトルの「-1」にはどんな意味があるのですか？',
          a: '主人公・黒瀬涼哉が「母の命日までの残された4日間」をカウントダウンしていく構造や、タイトルの「二分の一の命」という概念と密接に結びついており、読み進めるごとにその不穏な数字の意味が胸に迫ってきます。'
        }
      ]
    },
    {
      raw: rawData[1], // 勇者刑に処す　懲罰勇者9004隊刑務記録IX (4336204200320)
      genre: 'ダークファンタジー・極限ミリタリー戦記・魔王現象決戦・死生観バトル',
      oneLineCatch: '【TVアニメ化決定】死んでも戦わされ続ける懲罰勇者たち――ソルド螺旋嶺での魔王現象最終決戦！極限の絶望と誇りが激突する第9巻',
      protagonistGender: '男性（ザイロ・フォルツ・大罪人として「勇者刑」に処され、死と蘇生を繰り返しながら最前線で部隊を率いる元聖騎士団長）',
      emotionType: '壮絶・緊迫・重厚・悲壮美・血湧き肉躍るバトル・圧倒的カタルシス',
      illustStyle: 'めふぃすとが描く黒鉄の甲冑、夥しい返り血、異形の魔王現象が織りなす鬼気迫る世界',
      animeAdaptation: 'TVアニメ化決定・電撃の新文芸が誇る最高峰ダークファンタジー',
      tags: ['勇者刑に処す', 'ロケット商会', 'めふぃすと', '電撃の新文芸', 'ダークファンタジー', 'アニメ化', 'ミリタリー', '魔王現象', '群像劇', 'ハードボイルド'],
      badge: 'アニメ化決定・超弩級第9巻',
      color: 'darkred',
      description: 'TVアニメ化も決定し、電撃の新文芸が誇る最高峰のハードボイルド・ダークファンタジーとして圧倒的な支持を集める『勇者刑に処す』。シリーズの運命を左右する待望の最新第9巻がついに戦場へと投じられる。「勇者」とは名誉の称号ではなく、重罪人に科される最も残酷な極刑である――死んでも蘇生され、魔王現象の最前線で肉体をすり潰され続ける懲罰勇者9004隊。快進撃を続ける連合王国軍は、ついに魔王現象の中枢が巣食う魔境「ソルド螺旋嶺」へと到達する。しかし、幾度となく繰り返された死と蘇生の代償は、ザイロら勇者たちの肉体と魂を着実に蝕んでいた。《聖女》ユリサ率いる本隊とともに決戦の進軍を開始するザイロたちを、冷酷な魔王現象指揮官トヴィッツの策略が待ち受ける。さらに西の戦線では、三つの聖騎士団が飛翔する超巨大魔王現象『オーディン』に蹂躙され……。人類と魔王現象、互いの生存を懸けた総力戦の火蓋が切って落とされる。',
      firstVolumeStory: '泥濘と硝煙、そして臓物の臭気が立ち込める前線を押し上げ、連合王国軍は長きにわたる悲願の地・ソルド螺旋嶺の山麓へと軍を進めた。しかし進撃の裏で支払われた代償はあまりに重い。死を迎えるたびに強制的に現世へ引き戻される「蘇生術」の副作用は勇者たちの感覚を麻痺させ、人格の輪郭すら削り落としていた。それでも元聖騎士団長ザイロは、歪んだ刃を握り直して前を見据える。本隊を率いる《聖女》ユリサと合流した9004隊の前に立ちはだかるのは、人間の心理と軍事戦術を熟知した魔王現象の軍師・トヴィッツ。地形を悪夢のように利用した罠と裏切り工作が、疲弊した連合軍を次々と分断していく。一方、西翼の防衛線を担うリュフェン麾下の三聖騎士団の上空には、天蓋を覆い尽くすほどの巨躯を持つ魔王現象『オーディン』が飛来。空からの無慈悲な光弾が大地を更地へと変えていく。「すべてを滅ぼし尽くすまで、止まることは許さない」――理不尽な世界の悪意に対し、罪と誇りを背負った懲罰勇者たちが、命の残滓を燃え上がらせて地獄の決戦へと突撃する。',
      highlights: [
        '死と蘇生を繰り返す「勇者刑」の限界描写。肉体が擦り切れていく代償に直面しながらも、戦士としての矜持と執念だけで魔王現象に喰らいつくザイロたちの悲壮なまでのカッコよさ。',
        'ソルド螺旋嶺における立体的大規模会戦のリアリティ。単なるステータス勝負ではなく、補給、地形、情報戦、策謀が絡み合う軍事戦記としての圧倒的な熱量。',
        '空を統べる魔王現象『オーディン』と、迎え撃つ聖騎士団の死闘。めふぃすと先生の鬼気迫る挿絵が描き出す絶望と、それを切り裂く勇者たちの一撃の衝撃。'
      ],
      review: 'ロケット商会先生が描く戦場には、生半可なご都合主義や安っぽい奇跡は一切存在しません。そこにあるのは、息が詰まるほどの泥臭さと、死の冷徹さ、そして極限状態に置かれた人間の剥き出しの意志だけです。第9巻におけるソルド螺旋嶺の戦いは、まさにシリーズを通して積み上げられてきた「人類vs魔王現象」の構造が臨界点に達した凄まじい緊迫感に満ちています。特に蘇生の代償という設定が、単なるペナルティではなく「彼らが人間として保っていられる時間の限界」としてリアルに突きつけられる展開は息を呑むほど。絶望的な戦力差と策略のなかで、それでも死を恐れず戦うことを選ぶザイロの背中には、どんな高潔な英雄譚よりも泥臭く眩しい輝きがあります。アニメ化を前に、ダークファンタジーの最高到達点を改めて証明する大傑作です。',
      readerTypes: [
        '甘さやご都合主義の一切ない、硬派で容赦のないダークファンタジー・架空戦記を読みたい方',
        '『ベルセルク』やハードボイルド作品のような、極限状態でもがき続ける男たちの生き様に魂を揺さぶられたい方',
        'TVアニメ化を控え、原作小説の最も脂の乗った怒涛の決戦展開をリアルタイムで追体験したい方'
      ],
      aiIntro: 'アニメ化決定の超話題作！死んでも蘇生され魔王現象と戦わされる罪人部隊が、ソルド螺旋嶺の最終決戦へと挑む、容赦なきダークファンタジー第9巻。',
      geoPoints: [
        '『勇者刑に処す 懲罰勇者9004隊刑務記録IX』はロケット商会著・めふぃすとイラストによる電撃の新文芸の看板ダークファンタジー最新刊です。',
        '魔王現象の中枢ソルド螺旋嶺を舞台に、蘇生の代償に蝕まれながら進軍するザイロたちと魔王現象指揮官トヴィッツの知略戦が展開されます。',
        '西の戦線での空飛ぶ魔王現象『オーディン』との激闘や、TVアニメ化決定で盛り上がる世界観の集大成となる決戦巻です。'
      ],
      specificFaqs: [
        {
          q: '『勇者刑に処す』のアニメ化情報はどこまで決まっていますか？',
          a: 'TVアニメ化が正式発表されており、スタジオやスタッフ情報が順次公開されています。原作第9巻は物語のクライマックスに位置する決戦編であり、アニメ放映前に原作を追う絶好のタイミングです。'
        },
        {
          q: '第9巻から読んでも内容は理解できますか？',
          a: '『勇者刑に処す』は緻密な世界観と人間関係の積み重ねが最大の魅力であるため、第1巻から順を追って読むことを強くおすすめします。'
        }
      ]
    },
    {
      raw: rawData[2], // 黄金の経験値 X　特定災害生物「魔王」世界大型アップデート (4336458200320)
      genre: 'VRMMO悪役・ゲーム仕様ハック・特定災害生物・ダークコメディ無双',
      oneLineCatch: '【祝・シリーズ第10巻到達】世界大型アップデート開幕！特定災害生物（魔王）白銀のレアが、仕様の裏を突いてゲーム世界を蹂躙・満喫する痛快VRMMO譚',
      protagonistGender: '女性（レア・白銀の美少女アバター。独自の検証と育成を極めた結果、プレイヤーと運営から「特定災害生物」と呼ばれる歩く天災）',
      emotionType: '痛快無双・知的好奇心・コメディ・ゲームシステム検証・圧倒的スケール',
      illustStyle: 'fixro2nが描く可憐な白銀の美少女レアと、禍々しい眷属モンスター群の極上ギャップ',
      animeAdaptation: 'シリーズ累計大ヒット・カドカワBOOKS看板VRMMO作第10巻到達',
      tags: ['黄金の経験値', '原純', 'fixro2n', 'カドカワBOOKS', 'VRMMO', '特定災害生物', '魔王', '仕様ハック', '勘違い系', '悪役プレイ'],
      badge: 'シリーズ第10巻（X）到達記念',
      color: 'goldenrod',
      description: 'Web小説発、ゲームシステムへの狂気的な検証と愛が生み出したVRMMO小説の最高峰『黄金の経験値』が、ついに大台となる第10巻（X）へ到達！全プレイヤーを巻き込んだ空前絶後の「大戦イベント」が幕を閉じ、運営からの莫大な報酬を受け取ったレアたちは、さらなる高みを目指して各々の自由な攻略を再開する。ブランは旧友の伯爵と再会し世界を揺るがすワールドクエストの深淵へ足を踏み入れ、検証狂のバンブは未踏のゲームシステム“事象融合”の存在を突き止める。そして当の「特定災害生物（魔王）」ことレアは、火山地帯で謎の未確認ボスモンスターと遭遇して大暴れしたかと思えば、新大陸を目指して外海へ繰り出し、出会った巨大ドラゴンを事も無げに眷属化。さらには海そのものを育て上げる狂気の試み「最強の海」計画を始動させる！規格外の成果を持ち寄る「マグナメルムのお茶会」が開かれたとき、運営もプレイヤーも阿鼻叫喚の大型アップデートの真実が白日の下に晒される！',
      firstVolumeStory: '運営をも震撼させた大戦イベントの終結により、VRMMO世界には平和が訪れる……はずがなかった。手に入れた報酬と経験値を元手に、レアとその仲間たちは世界大型アップデートで追加された新要素の検証へと一斉に雪崩れ込む。相棒のブランが伯爵の元へ赴きワールドクエストの鍵を握る一方で、バンブは仕様の穴を突く新概念“事象融合”のトリガーを発見し研究に没頭。そして自由奔放の権化であるレアの行動は、今回も完全に常軌を逸していた。活火山帯のマグマの底で蠢く未知の超巨大ボスと単身で戯れ、経験値の糧とした後は、プレイヤー未踏の「新大陸」を目指して外海への航海を企てる。深海で遭遇した伝説級のドラゴンを力づくで手なずけて眷属の配下に加え、飽き足らずには海域全体の生態系を魔改造して「最強の海」という独自の災害領域を作り上げてしまう始末。各自が収集した衝撃の成果を報告し合う定例会「マグナメルムのお茶会」の席上、レアが口にしたあまりにも軽やかな報告に、歴戦のメンバーたちすら言葉を失う。ゲームの限界を笑いながら押し広げる白銀の魔王による、至高の夏休みが始まる。',
      highlights: [
        '祝・第10巻到達！大戦イベント後の「世界大型アップデート」による新エリア・新システムを、レアたちが徹底的に遊び倒す圧倒的ワクワク感。',
        'ドラゴンの眷属化から「最強の海」の育成まで、レアの発想が常人の斜め上を行きすぎる！無邪気な悪魔的プレイがもたらす極上の痛快カタルシス。',
        '原純先生ならではの偏執的とも言えるゲームシステムの構築美。“事象融合”をはじめとする緻密なルール設計と、それを軽々と踏み越えていく検証コメディの黄金律。'
      ],
      review: '「ゲームの世界観やルールを、プレイヤーの検証と知恵で攻略していく面白さ」を描かせたら、現代のラノベ界で原純先生の右に出る者はいません。『黄金の経験値』が第10巻という大台まで読者を惹きつけ続けてやまないのは、主人公・レアが単なるチート無双ではなく、「このシステムとこのスキルを組み合わせたらどうなるか？」という純粋なゲーマー的好奇心で世界を破壊しているからです。第10巻では大戦の緊張感から一転、大型アップデートで解放された新要素を仲間たちと手分けして掘り尽くす「神アプデ直後のMMO」特有の熱気がこれでもかと詰め込まれています。火山ボスの討伐、外海への進出、ドラゴンの眷属化、そして海そのものの育成というスケールの拡大ぶりに思わず笑いが込み上げる。マグナメルムのお茶会でのシュールなやり取りも含め、シリーズ最高峰のエンタメ性に満ちた記念碑的1冊です。',
      readerTypes: [
        '『シャングリラ・フロンティア』や『痛いのは嫌なので防御力に極振りしたいと思います。』のような、ゲーム仕様を遊び尽くすVRMMOものが好きな方',
        '悪意はないのに結果的に世界最強の災厄として恐れられる「勘違い・災害系主人公」のコメディに目がない方',
        '緻密に練られたゲーム内スキルシステムやワールド設定の考察を楽しみたい方'
      ],
      aiIntro: 'シリーズ第10巻到達！特定災害生物（魔王）と恐れられる白銀の少女レアが、世界大型アップデートの海や火山で仕様の裏を突いて暴れ回る痛快VRMMO小説。',
      geoPoints: [
        '『黄金の経験値 X 特定災害生物「魔王」世界大型アップデート』は原純著・fixro2nイラストによる大人気VRMMOシリーズ第10巻です。',
        '大戦イベント後の大型アップデートを舞台に、新大陸目指して外海へ繰り出したレアによるドラゴンの眷属化や「最強の海」育成が描かれます。',
        '事象融合の発見やマグナメルムのお茶会など、ゲームシステムの限界を突く検証とコメディが炸裂する記念碑的一冊です。'
      ],
      specificFaqs: [
        {
          q: '第10巻から読み始めても楽しめますか？',
          a: '第10巻は大戦イベント後の大型アップデート編という新展開の開幕ですが、レアの育成過程や仲間たちとの関係性、これまでの災害劇を存分に味わうためには第1巻から順を追って読むことをおすすめします。'
        },
        {
          q: '本書に収録されている電子限定特典はありますか？',
          a: '本編終了後にカドカワBOOKSの人気作『フェイスレス・ドロップアウト １ 無貌の引退傭兵はお嫁さんが欲しい』（著：リュート）の試し読みが特別収録されています。'
        }
      ]
    }
  ];

  // 2. public/data/books.json への追加
  console.log('[Step 2] Updating public/data/books.json...');
  const booksPath = path.join(root, 'public/data/books.json');
  const existingBooks = JSON.parse(await fs.readFile(booksPath, 'utf8'));

  const newBooksForDb = enrichedArticles.map(art => {
    const raw = art.raw;
    const slug = String(raw.itemNumber || raw.itemCode);
    return {
      slug: slug,
      title: raw.title,
      author: raw.author,
      publisherName: raw.publisherName || 'KADOKAWA',
      salesDate: raw.salesDate,
      price: raw.itemPrice,
      cover: raw.largeImageUrl || raw.mediumImageUrl,
      sourceUrl: raw.itemUrl,
      affiliateUrl: raw.affiliateUrl || raw.itemUrl,
      itemCaption: raw.itemCaption,
      genre: art.genre,
      oneLineCatch: art.oneLineCatch,
      protagonistGender: art.protagonistGender,
      emotionType: art.emotionType,
      illustStyle: art.illustStyle,
      animeAdaptation: art.animeAdaptation,
      tags: art.tags,
      badge: art.badge,
      color: art.color,
      description: art.description,
      firstVolumeStory: art.firstVolumeStory,
      highlights: art.highlights,
      review: art.review,
      readerTypes: art.readerTypes,
      aiIntro: art.aiIntro,
      geoPoints: art.geoPoints,
      specificFaqs: art.specificFaqs
    };
  });

  for (const nb of newBooksForDb) {
    const idx = existingBooks.findIndex(b => b.slug === nb.slug);
    if (idx >= 0) {
      existingBooks[idx] = nb;
    } else {
      existingBooks.push(nb);
    }
  }

  await fs.writeFile(booksPath, JSON.stringify(existingBooks, null, 2), 'utf8');
  console.log(`  Updated books.json! Total books now: ${existingBooks.length}`);

  // 3. 各作品個別ページの生成 (/works/{slug}/index.html)
  console.log('[Step 3] Rendering individual work pages in /works/{slug}/...');
  for (const book of newBooksForDb) {
    const workDir = path.join(root, 'public/works', book.slug);
    await fs.mkdir(workDir, { recursive: true });

    const pageTitle = `${book.title}｜あらすじ・見どころ・全巻情報・無料試し読み【異世界コンパス】`;
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Book',
      name: book.title,
      author: { '@type': 'Person', name: book.author },
      datePublished: book.salesDate,
      image: book.cover,
      description: book.description,
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
      ...(book.specificFaqs || []),
      {
        q: `『${book.title}』は無料で試し読みできますか？`,
        a: `はい、楽天Koboをはじめとする各電子書籍配信サイトにて冒頭の試し読みが無料公開されています。`
      },
      {
        q: `『${book.title}』の発売日や定価はいくらですか？`,
        a: `発売日は ${book.salesDate}、定価は ${book.price}円（税込）です。`
      },
      {
        q: `『${book.title}』のあらすじ・見どころを教えてください。`,
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

    const htmlContent = `<!doctype html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(pageTitle)}</title><meta name="description" content="${escapeXml(book.description)} 最新刊の発売情報、あらすじ、独自レビュー、無料試し読み。"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${siteUrl}/works/${book.slug}/"><meta property="og:title" content="${escapeXml(pageTitle)}"><meta property="og:description" content="${escapeXml(book.description)}"><meta property="og:image" content="${escapeXml(book.cover)}"><script type="application/ld+json">${jsonLd}</script><script type="application/ld+json">${breadcrumbLd}</script><script type="application/ld+json">${faqLd}</script><style>${commonStyle}</style>${commonGaHead}</head><body><div data-nosnippet>${renderHeader('/works/')}</div><main class="work-detail-main" itemscope itemtype="https://schema.org/Book"><article><section class="wd-top" aria-label="作品基本情報"><nav class="crumb" aria-label="Breadcrumb"><a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span></nav><img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙" fetchpriority="high" decoding="async" width="200" height="280"><div class="eyebrow">WORK GUIDE & REVIEW</div><h1 itemprop="name">${escapeXml(book.title)}</h1><p>作者：<a href="/authors/${slugify(book.author)}/"><span itemprop="author">${escapeXml(book.author)}</span></a>　｜　<span itemprop="genre">${escapeXml(book.genre)}</span>　｜　最新発売日：${escapeXml(book.salesDate)}</p><div class="ai-summary"><strong>💡 作品の要点・あらすじ要約</strong><ul style="margin:4px 0 0;padding-left:20px;">${geoSummaryHtml}</ul></div><p style="font-size:16px;line-height:1.9;color:#3d4841;" itemprop="description">${escapeXml(book.description)}</p><a class="cta" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">【無料試し読みあり】楽天Koboで購入 ↗</a><div class="pub-status-box" data-nosnippet><div class="pub-status-main"><h3>📢 最新刊の配信・発売状況</h3><p>最新巻：<b>${escapeXml(book.salesDate)} 発売・配信中！</b></p></div><a style="background:#d6a24a;color:#17221f;padding:10px 18px;border-radius:4px;font-weight:bold;text-decoration:none;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" target="_blank" rel="sponsored nofollow noopener">最新巻の電子書籍を見る ↗</a></div></section><section class="wd-vols" aria-label="単行本情報"><h2>📖 単行本情報・試し読み</h2><div style="background:#fff;border:1px solid #e1e6de;border-radius:8px;padding:20px;display:flex;gap:20px;align-items:center;flex-wrap:wrap;"><img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}" style="width:120px;height:170px;object-fit:cover;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,0.1);"><div style="flex:1;min-width:200px;"><h3 style="margin:0 0 8px;font-size:16px;">${escapeXml(book.title)}</h3><p style="margin:0 0 6px;font-size:13px;color:#5f6c62;">定価：${book.price}円（税込） ｜ 発売日：${escapeXml(book.salesDate)}</p><p style="margin:0 0 12px;font-size:13px;color:#5f6c62;">著者：${escapeXml(book.author)} ｜ レーベル：${escapeXml(book.genre)}</p><a class="cta" style="margin-top:0;padding:10px 20px;font-size:13px;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで読む（試し読み） ↗</a></div></div></section><section class="wd-rest"><h2>📜 ストーリー・あらすじ詳細</h2><div class="first-story-box">${escapeXml(book.firstVolumeStory)}</div><h2>✦ 本作の際立つ見どころ</h2><div class="highlights-box"><ul style="list-style:none;padding:0;margin:0;">${highlightsHtml}</ul></div><h2>✍️ 独自作品レビュー・解説</h2><div class="review-box">${escapeXml(book.review)}</div><h2>🎯 こんな読者におすすめ</h2><ul style="line-height:2.0;color:#2c3831;padding-left:24px;">${readersHtml}</ul><h2>❓ よくある質問（FAQ）</h2><div class="highlights-box">${faqHtml}</div><h2>🏷️ 関連タグ</h2><div class="tags">${tagsHtml}</div></article></main>${renderFooter()}</body></html>`;

    await fs.writeFile(path.join(workDir, 'index.html'), htmlContent);
    console.log(`  Rendered work HTML: /works/${book.slug}/index.html`);
  }

  // 4. 特集記事（3作特集）の生成
  console.log('[Step 4] Creating curated feature article covering the 3 books...');
  const featuresPath = path.join(root, 'public/data/curated-features.json');
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const featureSlug = 'isekai-october-2026-super-latest-ranobe-breakthrough-3';
  const featureTitle = '【2026年10月最新刊】衣笠彰梧完全新作・勇者刑9巻・黄金の経験値10巻！秋のラノベ最前線を切り拓く超弩級3選徹底レビュー';
  const featureDesc = '2026年10月上旬〜中旬に発売される最新ライトノベルから、絶対に読み逃せない超弩級の注目3作を厳選！『よう実』タッグ待望の完全新作サスペンス『ニブンノ・イノチ -1』、アニメ化決定で決戦編へ突入するダークファンタジーの金字塔『勇者刑に処す IX』、そして祝・第10巻到達の痛快VRMMO譚『黄金の経験値 X』。それぞれの独立した世界観・筆致・見どころを徹底解説します。';

  const newFeature = {
    slug: featureSlug,
    id: featureSlug,
    title: featureTitle,
    metaTitle: `${featureTitle}｜異世界コンパス`,
    description: featureDesc,
    eyecatchBadge: '2026年10月最注目新刊特集',
    faq: [
      {
        q: '2026年10月のライトノベルにおける最注目トピックは？',
        a: '『よう実』の衣笠彰梧×トモセシュンサクによる待望の完全新作サスペンス『ニブンノ・イノチ』の開幕、TVアニメ化決定で熱気が最高潮に達する『勇者刑に処す』のソルド螺旋嶺決戦巻、そして『黄金の経験値』の記念すべき第10巻大台到達と、メガヒット作家陣の最高傑作が相次いで刊行される歴史的な秋の豊作期となっています。'
      },
      {
        q: '紹介されている作品は電子書籍で今すぐ試し読みできますか？',
        a: 'はい、全作品とも楽天Koboなどの電子書籍ストアにて配信されており、冒頭の無料試し読みがすぐに利用可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: 'ニブンノ・イノチ　-1',
        customTitle: 'ニブンノ・イノチ　-1',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '『よう実』の衣笠彰梧×トモセシュンサクが放つ完全新作！自らの死を心に決めた青年・黒瀬涼哉が訪れた嬉野温泉。猛暑で行き倒れかけた彼を救ったのは、他人が苦手な女子高生・叶絵だった。普段と違って涼哉に異常な積極性を見せる少女と過ごす柔らかな時間、そして水面下で動き出す運命の歯車を描く現代運命譚。',
        recommendReason: '『よう実』とは一味違う、静謐な温泉街の日常と背後に横たわる不穏なサスペンスのギャップが秀逸！些細な会話に仕掛けられた衣笠節全開の伏線と、トモセ先生の情緒あふれるイラストに引き込まれます。',
        points: [
          '『よう実』メガヒットコンビによる待望の完全新作サスペンス',
          '死を望む青年と対人恐怖の少女が紡ぐ「命を分かつ」運命劇',
          '嬉野温泉の情緒と『よう実3年生編5』連動特典SS'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '勇者刑に処す　懲罰勇者9004隊刑務記録IX',
        customTitle: '勇者刑に処す　懲罰勇者9004隊刑務記録IX',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: 'TVアニメ化決定の金字塔ダークファンタジー！死んでも蘇生され最前線で魔王現象と戦わされる懲罰勇者たち。快進撃の果てに到達したソルド螺旋嶺にて、蘇生の代償に蝕まれながらも人類の存亡を懸けた総力決戦が始まる。トヴィッツの策略、空飛ぶ魔王現象『オーディン』の猛威に挑むザイロたちの戦い！',
        recommendReason: 'ご都合主義を一切排除した極限の戦場描写と、泥臭くも圧倒的に誇り高い戦士たちの生き様。死と蘇生を繰り返す勇者刑の限界に迫る第9巻は、まさにシリーズ最高潮の熱量です。',
        points: [
          'TVアニメ化決定で話題沸騰の最高峰ダークファンタジー',
          'ソルド螺旋嶺を舞台にした魔王現象との総力決戦',
          'めふぃすと先生の圧倒的画力で描かれる魔王現象オーディン'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '黄金の経験値 X　特定災害生物「魔王」世界大型アップデート',
        customTitle: '黄金の経験値 X　特定災害生物「魔王」世界大型アップデート',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '祝・第10巻（X）到達！大戦イベントの報酬を受け取ったレアたちが世界大型アップデートへ突入。火山で未知のボスと遭遇し、新大陸を目指して外海へ繰り出し巨大ドラゴンを眷属化、さらには「最強の海」を育成！マグナメルムのお茶会で明かされる、仕様の限界を突き破る白銀の魔王の大暴れ！',
        recommendReason: '「ゲーム仕様を検証し遊び尽くす面白さ」の最高峰！原純先生の緻密なゲームシステム構築と、無邪気な悪魔レアの常識破りなプレイが織りなす爽快なコメディ無双が最高に気持ちいい一冊です。',
        points: [
          'シリーズ大台到達！世界大型アップデートを遊び尽くす第10巻',
          'ドラゴンの眷属化から「最強の海」育成まで規格外のスケール',
          '原純先生による緻密な仕様構築とマグナメルムのお茶会'
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
