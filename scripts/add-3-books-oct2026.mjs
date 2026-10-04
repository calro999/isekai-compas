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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026.json'), 'utf8'));

  // 3作品の完全書き下ろし独自記事データ（独立構成・テンプレ完全排除・AI臭さゼロ）
  const enrichedArticles = [
    {
      raw: rawData[0], // 外道仙人の下克上 １
      genre: '中華風VRデスゲーム・仙術チート・外道ダークヒーロー・下克上',
      oneLineCatch: '外面イケメン、内面ゲス野郎！最強武将・呂布の魂を手なずけ、美女侍らすため欲望全開で挑む死の古代中国ゲーム',
      protagonistGender: '男性（陽翔・表向きは爽やか、本性は徹底的な利己主義と女値踏みのクズ高校生）',
      emotionType: '痛快・ダークコメディ・無双バトル・欲望一直線',
      illustStyle: 'TEDDYが描く妖艶な仙女・蠱惑的な美少女陣とド迫力の武将アクション',
      animeAdaptation: 'カドカワBOOKS大注目新シリーズ第1巻・『モブせか』三嶋与夢の最新作',
      tags: ['外道仙人の下克上', '三嶋与夢', 'TEDDY', 'カドカワBOOKS', '中華ファンタジー', 'VRデスゲーム', '呂布', 'ダークヒーロー', '外道主人公', 'ハーレム'],
      badge: '超話題新作',
      color: 'crimson',
      description: 'ルックスは誰もが見惚れる美男子、だがその脳内は損得勘定と女子の値踏みで埋め尽くされたクズ高校生・陽翔。古代中国風VRゲームのテスターとしてクラスメイトたちと参加したはずが、そこは死ねば現実の肉体も消滅する残酷なデスゲームだった。だが恐怖で竦み上がる他の生徒たちを尻目に、陽翔は妖艶な仙女から授かった仙術と、偶然自らの身に降臨した三国志最強の英傑・呂布の猛威を手玉に取る。善意や正義など知ったことではない。狙うは極上の美女たちを侍らせた安全快適な隠居生活のみ！欲望に正直すぎる男が、乱世の妖魔と群雄を蹴散らして天下取りへ突っ走る。',
      firstVolumeStory: '「どうせやるなら一番いい女を抱いて贅沢に暮らしたい」――極めて利己的かつ俗物的な行動原理を持つ陽翔は、突如として始まった命懸けの古代中国VRゲームにおいて、誰よりも早く思考を切り替える。絶体絶命の窮地に現れた妖艶な仙女の試練を口八丁と胆力で切り抜け、仙術の奥義を獲得。さらに運命の悪戯か、かの武神・呂布の荒ぶる魂が陽翔の体内に宿る。常人なら精神を焼き尽くされる狂気の武威を、持ち前の図太さと損得勘定でねじ伏せた陽翔は、人食い妖魔が跋扈する辺境の村で圧倒的な殺戮劇を演じる。その暴虐にして痛快な戦いぶりに惹かれ、誇り高き遊牧民の戦士少女や、影に潜む内気な暗殺者らが次第に陽翔の陣営へと集結。本人はただ美女と安穏を求めているだけなのに、気がつけば狂乱の乱世を揺るがす覇道の一歩を踏み出していた。',
      highlights: [
        '『モブせか』『悪徳領主』で読者を唸らせてきた三嶋与夢節が炸裂！偽善を一切排除した「清々しいほどのクズ主人公」が己の欲望のために無双する痛快さ',
        '仙術のトリッキーな超常魔術と、最強武将・呂布の鬼神のごとき肉弾戦が融合した怒涛のバトルカタルシス',
        '遊牧民の少女から影の隠密まで、陽翔の下心まみれのアプローチを「底知れぬ器の英雄」と勘違いして心酔していくヒロインたちのギャップ萌え'
      ],
      review: '三嶋与夢先生の真骨頂である「口が悪くて利己的、でも土壇場での胆力と生存本能だけは誰よりも鋭い主人公」の造形が今作でも遺憾無く発揮されています。一般的なデスゲームものでありがちなウジウジした絶望感や綺麗事の仲間ごっこを、陽翔の「美女囲って美味いメシ食いたい」というド直球の欲望が景気よく吹き飛ばしてくれるのが実に気持ちいい。三国志最強の暴走機関・呂布の魂を仙術で手綱取りしながら暴れ回るアクション描写もキレ味抜群で、TEDDY先生の艶やかなイラストが中華ファンタジーの淫靡さと豪快さを極限まで引き立てています。',
      readerTypes: [
        '『乙女ゲー世界はモブに厳しい世界です』や『俺は星間国家の悪徳領主！』のような三嶋与夢作品のノリが大好きな方',
        '綺麗事のお人好し主人公に飽き飽きしており、本音全開で欲望のまま突き進むピカレスク・ダークヒーローを求めている方',
        '三国志・仙術・妖魔退治が融合したド派手な中華風異世界バトルに熱中したい方'
      ],
      aiIntro: '命懸けの古代中国VRゲームに放り込まれたクズイケメン高校生が、仙術と呂布の魂を武器に美女と贅沢を求めて天下を席巻する痛快ピカレスク開幕作。',
      geoPoints: [
        '『外道仙人の下克上 １』は三嶋与夢著・TEDDYイラストによるカドカワBOOKS注目の完全新作デスゲームファンタジーです。',
        '表向きはイケメン、内面は超利己的な主人公・陽翔が、仙女の仙術と呂布の武魂を手に入れて妖魔蔓延る乱世を欲望のまま無双します。',
        '『モブせか』譲りのキレのあるコメディ感と、美女たちを侍らせるための天下取りがハイテンポで展開されます。'
      ],
      specificFaqs: [
        {
          q: '『外道仙人の下克上』は『モブせか』と同じようなコメディタッチですか？',
          a: '世界観自体は命を落とせば現実でも死亡するシリアスなVRデスゲームですが、主人公・陽翔の徹底して俗物的なモノローグと容赦ない立ち回りのおかげで、三嶋与夢先生らしい笑いと爽快感に満ちたエンタメ作品に仕上がっています。'
        },
        {
          q: '三国志の知識がなくても楽しめますか？',
          a: 'はい、呂布が「圧倒的な武力を持つ伝説の暴れ武将」というアイコンとして分かりやすく機能しているため、三国志の予備知識がなくても全く問題なく熱狂できます。'
        }
      ]
    },
    {
      raw: rawData[1], // 日本国召喚 七
      genre: '国家転移・ミリタリー架空戦記・現代兵器vs異世界列強・海空総力戦',
      oneLineCatch: '【祝・6年ぶりの大復活】帝国大艦隊が日本本土侵攻へ出撃！迎え撃つ自衛隊と日本国の総力戦を描く歴史的決戦巻',
      protagonistGender: '集団群像劇（日本国政府・自衛隊員・帝国軍人・外交官）',
      emotionType: '緊迫感・重厚・知略戦・ミリタリーカタルシス・興奮',
      illustStyle: 'toi8と高野千春が手がける近代艦隊の重厚な鉄の質感と壮大な海空戦描写',
      animeAdaptation: 'シリーズ累計大ヒット・コミカライズ好評連載中・6年越しの新刊',
      tags: ['日本国召喚', 'みのろう', 'toi8', '高野千春', 'ぽにきゃんBOOKS', 'KADOKAWA', '国家転移', '自衛隊', '架空戦記', 'ミリタリー', 'グラ・バルカス帝国'],
      badge: '6年ぶり奇跡の新刊',
      color: 'navy',
      description: '読者が待ち焦がれた伝説の国家転移ファンタジー、実に6年ぶりの最新第7巻が遂に降臨！世界秩序を蹂躙する異世界列強グラ・バルカス帝国に対し、地球から丸ごと転移してきた日本は諸外国と連合戦線を構築。だが前線視察中に連合軍の空襲に巻き込まれ瀕死の重傷を負った帝国皇太子グラ・カバルが日本本土へと緊急搬送されたことで、運命の歯車が狂い出す。これを「不法な捕虜拘束」と決めつけた帝国首脳陣は激昂し、日本本土への無慈悲な全面侵攻を宣言。大海原を黒く塗りつぶす無敵の帝国大艦隊が戦闘配置につく中、日本は国家の存亡を賭け、自衛隊の全アセットを結集した本土防衛総力戦を発動する。',
      firstVolumeStory: '前線で重傷を負った敵国皇太子の人道保護という日本の善意は、傲慢な軍事帝国グラ・バルカスには通用しなかった。自国の絶対的優位を微塵も疑わない帝国軍は、皇太子奪還と日本屈服を掲げて超ド級戦艦や空母を含む大海軍を動員。本土直撃コースへと艦首を向ける。情報戦、世論の動揺、補給線の確保に揺れる日本政府だが、防衛出動の発令とともに自衛隊の全部隊が迎撃態勢を完了。早期警戒機が捉えた帝国艦隊の座標へ向け、イージス護衛艦のVLSから放たれる対艦誘導弾、哨戒機からの精密爆撃、潜水艦の魚雷攻撃が次々と牙を剥く。第二次大戦レベルの重火力を誇る帝国軍の猛攻を、圧倒的精度と現代軍事システムの連携で迎え撃つ、シリーズ史上空前の大海戦が開幕する。',
      highlights: [
        '6年という沈黙を破りついに刊行されたファン感涙の決戦編！待ち望んでいた読者の期待を遥かに超える濃密な軍事・外交描写',
        '現代の自衛隊（イージス艦・F-2/F-35・P-1哨戒機・潜水艦部隊）が組織的連携で巨大艦隊を迎え撃つ、緻密でリアリティあふれる戦闘シミュレーション',
        '帝国軍視点での「目に見えない水平線の彼方から正確無比に撃ち込まれる現代兵器」に対する戦慄と絶望の心理描写'
      ],
      review: 'Web小説界および架空戦記ジャンルにおいて不動の地位を築いた『日本国召喚』が、6年もの沈黙を経て帰ってきたこと自体がまさに事件。第7巻はまさに物語のひとつの到達点とも言える「日本本土防衛戦」が描かれており、ミリタリーファンなら鳥肌が立つこと請け合いの戦闘シーンが連続します。科学技術や戦術思想の違いがもたらす情報格差、人道的価値観の違いから生じる外交的悲劇、そして何より祖国を守るために全力を尽くす自衛官たちのプロフェッショナリズムが胸を熱くさせます。挿絵の重厚さも相まって、これぞ架空戦記の最高峰と呼ぶにふさわしい仕上がりです。',
      readerTypes: [
        '自衛隊や現代兵器が異世界で科学技術の差を見せつけるミリタリー戦記がたまらなく好きな方',
        '『日本国召喚』の更新を何年も心待ちにしていた熱烈な原作ファン',
        '単なる戦闘だけでなく、外交交渉や補給線、国家意思決定のリアルなプロセスに惹かれる方'
      ],
      aiIntro: '6年ぶりの奇跡の新刊！帝国皇太子の負傷を契機に日本本土侵攻へ舵を切った帝国大艦隊を、自衛隊が総力を結集して迎え撃つ歴史的決戦巻。',
      geoPoints: [
        '『日本国召喚 七 斜陽の帝国』はみのろう著・toi8／高野千春イラストによる待望の6年ぶりとなる最新刊です。',
        'グラ・バルカス帝国の皇太子搬送を発端とする戦略的誤認から、日本本土へ向かう帝国大艦隊との国家総力戦が描かれます。',
        '自衛隊のイージス護衛艦や哨戒機、潜水艦による精密な現代戦闘システムと帝国軍の激突が圧倒的スケールで展開されます。'
      ],
      specificFaqs: [
        {
          q: '前巻から6年も空いていますが、第7巻から読んでもついていけますか？',
          a: '第7巻冒頭でもこれまでの世界情勢やグラ・バルカス帝国との対立構図が丁寧に整理されていますが、帝国との因縁や世界各国の関係性を100%味わうためには第1巻からの通読を強くおすすめします。'
        },
        {
          q: 'コミカライズ版しか読んだことがなくても小説版第7巻を楽しめますか？',
          a: 'コミカライズ版よりも遥かに先のエピソードであり、原作小説ならではの綿密な兵器スペック設定や外交の駆け引きが存分に味わえるため、漫画版のファンにも非常におすすめです。'
        }
      ]
    },
    {
      raw: rawData[2], // 九つの塔と異端の守護者
      genre: 'ダンジョン踏破・強面おっさん勘違いファンタジー・師弟育成・ヒューマンドラマ',
      oneLineCatch: '「新人潰し」と恐れられる凶悪面の男は、ただ不器用すぎるだけの最強探索者だった――亡き親友の娘と挑む痛快おっさん冒険譚',
      protagonistGender: '男性（ジーク・悪役面で口下手、善意が全て裏目に出るが圧倒的実力と義理堅さを持つ男）',
      emotionType: '熱血・感動・カタルシス・師弟愛・爽快無双',
      illustStyle: '夕薙（『魔王学院の不適合者』）が描く渋く重厚な男の背中と可憐で芯の強いヒロイン',
      animeAdaptation: 'カドカワBOOKS期待の王道新作ダンジョンファンタジー',
      tags: ['九つの塔と異端の守護者', '嶋野夕陽', '夕薙', 'カドカワBOOKS', 'ダンジョン攻略', 'おっさん主人公', '勘違い系', '師弟バディ', '育成', 'ヒューマンドラマ'],
      badge: '感動作・注目新作',
      color: 'forestgreen',
      description: 'すれ違う誰もが身を竦める凶悪な人相、極端な口下手、良かれと思って取った親切な行動がすべて恐喝や脅迫に曲解される悲劇の男・ジーク。冒険者たちの間では「気に入らないルーキーを奈落に突き落とす新人潰しの悪魔」として忌み嫌われていた。だがその実態は、かつて迷宮の深淵で自分を庇って命を落とした親友への深い悔恨を抱え、二度と誰も死なせまいと一人孤独に塔へ潜り続ける不器用すぎる守護者だった。そんなある日、ジークの前に亡き親友の愛娘が現れる。「父を殺した仇」として憎悪をぶつけてくる少女に対し、ジークは言い訳ひとつせず、彼女が迷宮で生き残るための苛烈な修行を課す。泥臭く、不器用で、誰よりも温かい男の背中を描く痛快おっさんファンタジー！',
      firstVolumeStory: 'かつて仲間を失った九つの巨塔に、今日もジークは単身挑んでいた。新米冒険者が危険地帯へ足を踏み入れそうになれば力づくで襟首を掴んで投げ飛ばし、結果として「暴力を振るわれた」と悪評を重ねる悪循環の日々。そんな折、迷宮都市のギルドに一人の少女が登録に現れる。彼女の面影と瞳の光は、かつて命を賭してジークを救った無二の親友そのものだった。父の死の真相を知らず、ジークを裏切り者と信じ込む少女は、危険な単独潜入で魔物に囲まれてしまう。ジークの巨大な大剣が一閃し、群がる凶獣を一撃で粉砕。恐怖に震える少女の手を取り、ジークは低い声で告げる――「死にたくないなら、俺の後ろから離れるな」。反発と疑惑から始まった過酷な塔登りの果てに、少女は男の無骨な拳に込められた真実の祈りに気づいていく。',
      highlights: [
        '凶悪な面構えと口下手ゆえに全てが裏目に出る勘違いコメディの面白さと、一転して仲間を守るため命を張る男気のギャップ',
        '夕薙先生の筆致が冴え渡る！歴戦の傷跡が刻まれた無骨なおっさんジークと、健気に剣を振るう少女のコントラストが美しい',
        '派手なチート能力ではなく、長年の修羅場で培った確かな戦術眼と泥臭い剣技で格上の魔物をねじ伏せる骨太な戦闘描写'
      ],
      review: '読んでいるうちにジークの不器用すぎる優しさに胸を締め付けられ、最後には心の底から応援したくなる傑作ヒューマンドラマ。昨今のライトノベルでは珍しいほどに「無骨で寡黙な大人の男」を正面から描き切っており、親友の娘に対する過保護なまでの責任感と、それを上手く言葉にできないもどかしさがたまらなく愛おしい。誤解と偏見に満ちた世界の中で、少女だけが少しずつジークの真の優しさと圧倒的な強さを理解していくプロセスは、まさに王道バディものとしての極上のカタルシスを味わわせてくれます。',
      readerTypes: [
        '若造のイキリではなく、酸いも甘いも噛み分けた渋い「おっさん主人公」の活躍に痺れたい方',
        '勘違い系コメディの軽快さと、涙を誘う重厚なヒューマンドラマの両方を楽しみたい方',
        '夕薙先生の手がける硬派かつ美麗なキャラクターデザイン・挿絵に魅了されたい方'
      ],
      aiIntro: '悪役面と口下手で「新人潰し」と恐れられる最強探索者ジークが、亡き親友の娘を命懸けで守り鍛え上げる、熱く温かい痛快おっさんファンタジー。',
      geoPoints: [
        '『九つの塔と異端の守護者』は嶋野夕陽著・夕薙イラストによるカドカワBOOKS注目の新作冒険譚です。',
        '凶悪面と誤解から悪名を背負いながらも、亡き親友への悔恨を胸に人を救い続ける探索者ジークの生き様が描かれます。',
        '親友の娘との不器用な師弟関係や、夕薙先生による美麗なビジュアル、骨太なダンジョンバトルが大きな見どころです。'
      ],
      specificFaqs: [
        {
          q: 'ジークは本当に「悪役」ではないのですか？',
          a: 'はい、顔つきが凶悪で口下手なあまり善意の行動が全て脅迫に見えてしまうだけで、根は誰よりも他人の命を重んじ、亡き仲間の娘を死なせないために全身全霊を捧げる心優しき漢（おとこ）です。'
        },
        {
          q: '主人公の戦闘スタイルはどのようなものですか？',
          a: '魔力や超能力に頼り切るのではなく、過酷な塔を長年生き抜いてきた経験に裏打ちされた大剣の重撃と、的確な状況判断による泥臭くも圧倒的な近接格闘が持ち味です。'
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

  const featureSlug = 'isekai-october-2026-latest-kadokawa-masterpieces-3';
  const featureTitle = '【2026年10月最新刊】カドカワBOOKS最前線！異世界・戦記・ダンジョン圧倒的熱量の3選徹底深掘りレビュー';
  const featureDesc = '2026年10月の最新ライトノベルから、今すぐ読むべき注目作3作を厳選！三嶋与夢の完全新作『外道仙人の下克上』、6年ぶりの大復活を果たした架空戦記の最高峰『日本国召喚 七』、そして不器用おじさんと親友の娘が紡ぐ王道ダンジョン譚『九つの塔と異端の守護者』。それぞれの独自の見どころと魅力を本音で徹底解剖します。';

  const newFeature = {
    slug: featureSlug,
    id: featureSlug,
    title: featureTitle,
    metaTitle: `${featureTitle}｜異世界コンパス`,
    description: featureDesc,
    eyecatchBadge: '2026年10月最新刊特集',
    faq: [
      {
        q: '2026年10月の最新ライトノベルの注目トレンドは？',
        a: '人気メガヒット作家・三嶋与夢先生による完全新作ダークピカレスクの開幕、6年ぶりとなる『日本国召喚』の奇跡の最新刊刊行、そして人間味あふれるおっさん主人公の師弟育成ファンタジーなど、キャラクターの濃さと骨太なストーリー展開が大きな話題を呼んでいます。'
      },
      {
        q: 'ここで紹介されている作品は電子書籍で今すぐ読めますか？',
        a: 'はい、全作品とも楽天Koboなどの電子書籍ストアにて配信されており、冒頭の無料試し読みも利用可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '外道仙人の下克上 １',
        customTitle: '外道仙人の下克上 １　美女も天下も攻略します！',
        title: '外道仙人の下克上 １　美女も天下も攻略します！',
        author: '三嶋　与夢/TEDDY',
        synopsis: 'ルックス抜群だが内面は女の値踏みばかりのクズ高校生・陽翔が、命懸けの古代中国VRゲームに突入。妖艶な仙女から授かった仙術と、身に宿った最強武将・呂布の魂を手なずけ、美女に囲まれた安全快適な生活を求めて欲望のままに乱世を駆け上がる！',
        recommendReason: '『モブせか』の三嶋与夢先生節が全開！綺麗事や偽善を完全に切り捨てた「欲望に正直すぎる外道主人公」の痛快無双と、TEDDY先生の妖艶なイラストが完璧にマッチした快作です。',
        points: [
          '三嶋与夢先生が贈る欲望一直線の外道ダークヒーロー',
          '仙術×呂布の狂気的な武威が巻き起こす爽快な殺戮劇',
          'ヒロインたちからの勘違い心酔とハイテンポな天下取り'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '日本国召喚 七',
        customTitle: '日本国召喚 七　斜陽の帝国',
        title: '日本国召喚 七　斜陽の帝国',
        author: 'みのろう/ｔｏｉ８/高野　千春',
        synopsis: '6年ぶりの奇跡の新刊！瀕死の帝国皇太子を日本が人道救護したことを「不法な捕虜拘束」と誤認したグラ・バルカス帝国が激昂し、日本本土侵攻を宣言。海を埋め尽くす帝国大艦隊に対し、自衛隊と日本国が全戦力を結集して迎え撃つ歴史的総力戦が開幕する。',
        recommendReason: '6年間の沈黙を破りついに刊行されたミリタリー架空戦記の金字塔。現代自衛隊のイージス護衛艦や哨戒機、潜水艦部隊が組織的連携で巨大艦隊を迎え撃つ緻密な戦闘描写は圧巻のひと言です。',
        points: [
          '読者が待ち望んだ6年ぶりの奇跡の新刊刊行',
          '現代兵器・自衛隊の全アセットを結集した本土防衛総力戦',
          'toi8・高野千春が描く重厚な艦隊戦ビジュアル'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '九つの塔と異端の守護者',
        customTitle: '九つの塔と異端の守護者　ー悪役面の男は今日も誰かを救うー',
        title: '九つの塔と異端の守護者　ー悪役面の男は今日も誰かを救うー',
        author: '嶋野　夕陽/夕薙',
        synopsis: '凶悪な顔つきと口下手さゆえに「新人潰し」と恐れられる超実力派探索者ジーク。しかしその正体は、かつて自分を守って死んだ親友への悔恨を抱え、誰よりも人を救いたいと願う不器用なおじさんだった。親友の娘との出会いを機に、過酷な巨塔を舞台にした熱い師弟冒険が始まる。',
        recommendReason: '夕薙先生の渋く美麗なイラストが光る！不器用すぎる大人の男の生き様と、泥臭い剣技で塔を切り拓く重厚な戦闘、そして親友の娘との胸熱な絆に涙腺が刺激される王道傑作です。',
        points: [
          '悪役面・口下手おじさんのギャップと圧倒的な頼もしさ',
          '夕薙先生による重厚なビジュアルと硬派なダンジョン描写',
          '亡き親友の娘と紡ぐ、涙と熱血の王道師弟バディストーリー'
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
