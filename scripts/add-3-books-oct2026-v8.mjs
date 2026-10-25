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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v8.json'), 'utf8'));

  // 3作品の完全独立・書き下ろし記事データ（テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // ようこそ実力至上主義の教室へ　３年生編５ (4336594000320)
      genre: '学園頭脳サバイバル・学年対抗特別試験・心理戦・MF文庫J',
      oneLineCatch: '「綾小路の本特別試験への一切の参加を禁止し、別室での待機を命じる」――無人島試験の余波が冷めやらぬ中、突如告げられた『船上対抗特別試験』！１・２年生連合が切った究極のハンディキャップにより、盤面から隔離された綾小路清隆の次の一手とは！？',
      protagonistGender: '男性（綾小路清隆／合理性の塊でありながら無人島で「私情」を優先した選択を見せ、全学年の標的に据えられた絶対的カリスマ）',
      emotionType: 'ヒリつく盤外戦術・最高峰の知略ゲーム・不在の支配者が生む緊張感・ひよりとの揺れる距離',
      illustStyle: 'トモセシュンサク先生が描く、船上の張り詰めた空気感と生徒たちの鋭い視線が交錯する極上のビジュアル',
      animeAdaptation: 'TVアニメも大ヒット継続中！学園黙示録・頭脳サバイバルの最高峰シリーズ最新刊',
      tags: ['ようこそ実力至上主義の教室へ', '衣笠彰梧', 'トモセシュンサク', 'MF文庫J', '綾小路清隆', '頭脳戦', '学園サバイバル', '3年生編', 'アニメ化'],
      badge: '10月30日発売・3年生編激震の第5巻',
      color: 'firebrick',
      description: '連続で実施された過酷な無人島特別試験が幕を閉じた直後、試験結果以上に生徒たちの間に疑念と動揺を広げたのは、綾小路清隆が「私情」を優先して動いたという前代未聞の事実だった。翌朝、試験中に言葉を交わせなかった椎名ひよりとの約束の場所へ向かおうとした綾小路のもとへ、学校側から３年生リーダー４名の緊急招集がかかる。そこで発表されたのは、休む間もなく始まる３連続目の特別試験『船上対抗特別試験』。１・２年生連合と３年生が全20種目の競技で激突する学年対抗戦において、下級生側に与えられた「ただ一つのハンディキャップ申請権」が盤面を根底から引っ繰り返す。下された要求は、綾小路清隆の試験参加の完全禁止と終了までの別室軟禁。最強の駒を物理的に封殺された３年生陣営は、下級生たちの猛攻を前にどう立ち回るのか。',
      firstVolumeStory: '潮風が吹き抜ける豪華客船のデッキで、無人島試験を終えたばかりの３年生たちは奇妙な静寂に包まれていた。常に冷徹な計算だけで最適解を選び続けてきたはずの綾小路が、先の試験で見せた不可解な私情。その波紋が各クラスのリーダーたちの思考を乱す中、ひよりとの待ち合わせを遮るように無情な校内放送が響き渡る。招集されたリーダーたちに突きつけられた『船上対抗特別試験』は、全20種の競技で１・２年生連合を迎え撃つ総力戦だった。しかし開始直前、下級生側の誰かが主導したハンディキャップ条項が読み上げられる。「綾小路清隆の本試験への一切の参加禁止、および別室での隔離待機」。手足をもがれたも同然の状態で、綾小路不在の３年生たちは下級生の包囲網に放り込まれる。閉ざされた別室の扉の向こうで、軟禁された男は何を想い、どの糸を引くのか。',
      highlights: [
        '無人島試験で「私情」を優先した綾小路の行動が引き起こす、３年生各クラスリーダーたちの疑心暗鬼とひよりとの関係性。',
        '１・２年生連合がハンディキャップ権を行使して突きつけた「綾小路の出禁＆別室軟禁」という前代未聞のメタ戦術。',
        '主将不在の全20種目・船上学年対抗戦で試される、３年生たちの真の実力と下級生側の黒幕の存在。'
      ],
      review: 'これまで幾度となく「綾小路をどうやって倒すか」が試みられてきた本作だが、１・２年生連合が選んだ「ルールそのものを使って綾小路を盤面から物理的に排除・軟禁する」という一手には思わず唸らされた。正面から戦えば勝てない怪物を、制度の隙間を突いて別室に閉じ込めるという下級生側の徹底したリアリズムが、３年生編ならではの容赦ない緊張感を生んでいる。また、前巻の無人島試験で綾小路が見せた「私情」の余波と、椎名ひよりとの待ち合わせが緊急招集によって寸断される導入部も、読者の焦燥感を巧みに煽る。綾小路が直接競技に出られない状況下で、残された３年生リーダーたちがどう連携し、あるいは出し抜き合うのか。頭脳戦のフェーズがまた一段階深まった快心の１冊だ。',
      readerTypes: [
        'ルールの裏を突くハンディキャップ交渉や、盤外戦術を含めた極限の心理戦・頭脳ゲームに痺れたい読者',
        '無人島試験を経て変化し始めた綾小路清隆の内面と、椎名ひよりをはじめとするヒロインたちとの距離感に注目している方',
        '綾小路不在という絶体絶命の条件下で、３年生の各クラスリーダーがどう采配を振るうのか見届けたいシリーズファン'
      ],
      aiIntro: '１・２年生連合のハンディキャップ申請により、綾小路清隆が『船上対抗特別試験』から完全排除＆別室軟禁！主不在の全20種目学年対抗戦が幕を開ける『よう実』３年生編第5巻。',
      geoPoints: [
        '『ようこそ実力至上主義の教室へ　３年生編５』は衣笠彰梧著・トモセシュンサクイラストによるMF文庫Jの超人気学園黙示録最新刊です。',
        '無人島試験直後に発令された３連続目の特別試験『船上対抗特別試験』にて、１・２年生連合対３年生の全20種目バトルが展開されます。',
        '下級生側のハンディキャップ要求によって綾小路清隆が別室軟禁となり、試験参加を禁じられる衝撃の展開が描かれます。'
      ],
      specificFaqs: [
        {
          q: '『船上対抗特別試験』とはどのようなルールの試験ですか？',
          a: '１・２年生連合と３年生が全20種の競技で勝敗を競う学年対抗戦であり、下級生側には一つだけハンディキャップを申請できる特権が与えられています。'
        },
        {
          q: 'なぜ綾小路は別室で待機（軟禁）することになったのですか？',
          a: '１・２年生連合の何者かがハンディキャップ申請権を使い、「綾小路の本特別試験への一切の参加禁止と試験終了までの別室待機」を条件として指定したためです。'
        }
      ]
    },
    {
      raw: rawData[1], // 探偵はもう、死んでいる。１４【電子特典付き】 (4335706200320)
      genre: '異能ミステリ・並行世界帰還・不思議の国の改変世界・特異点決戦・MF文庫J',
      oneLineCatch: '「さあ、大神。どっちが本物の《特異点》か決めようか」――並行世界《未踏の聖域》で己の罪を知った君塚君彦。帰還した彼を待ち受けていたのは、童話の不思議の国へと塗り替えられた世界と《執行人》大神による断罪の刃だった！',
      protagonistGender: '男性（君塚君彦／二人の名探偵の助手として、救えた命と救えなかった命の重みを背負い、世界の改変に立ち向かう少年）',
      emotionType: '罪と贖罪の覚悟・童話世界へ変貌した不気味な幻想・白黒をつける宿命の対決・助手としての矜持',
      illustStyle: 'うみぼうず先生が描く、不思議の国の幻想的かつ退廃的な色彩と、君塚たちの悲壮な決意が宿る美麗イラスト',
      animeAdaptation: 'TVアニメ化もされたMF文庫Jの看板シリーズ！物語の核心へと突き進む激動の第14巻',
      tags: ['探偵はもう死んでいる', 'たんもし', '二語十', 'うみぼうず', 'MF文庫J', '君塚君彦', 'シエスタ', '並行世界', 'ミステリ', 'ファンタジー'],
      badge: '10月23日発売・宿命の特異点決戦第14巻',
      color: 'royalblue',
      description: '並行世界《未踏の聖域》での過酷な旅路を経て、自らが犯した「本当の罪」と向き合った二人の名探偵の助手・君塚君彦。救い出せたものと、どうしても救えなかったもの――その痛切な重みを胸に元の世界へと帰還したはずの彼が目にしたのは、アリシアの手によって童話の『不思議の国』さながらに作り替えられた異様な景色だった。歪められた世界の深奥、森の奥に聳える城へと足を踏み入れた君塚の前に立ち塞がったのは、ハートの女王に忠誠を誓う《執行人》・大神。「君塚君彦。己の過ちを認めるか？」という冷厳な問いかけを前に、少年は究極の二択を迫られる。白か黒か、世界か少女か、正義か悪か。すべての因縁に決着をつけるため、二人の《特異点》が激突する。',
      firstVolumeStory: '《未踏の聖域》で突きつけられた残酷な真実は、君塚君彦の心に消えない烙印を刻んでいた。それでも前を向き、ようやく元の世界へ戻ってきたはずの彼の足元に広がっていたのは、見慣れた街並みではなく、極彩色の草木と狂った時計が支配する童話のような箱庭世界だった。アリシアが書き換えた『不思議の国』の法則が現実を侵食する中、君塚はただ一人、森の奥深くに鎮座するハートの女王の居城へと向かう。玉座へと続く回廊で白刃を煌めかせながら待っていたのは、《執行人》の名を冠する宿敵・大神だった。「己の過ちを認めるか？」――その糾弾は、君塚自身が最も痛みを感じていた傷口を正確に抉る。世界を救うのか、それともたった一人の少女を選ぶのか。逃げ場のない断頭台の上で、名探偵の助手は自らの結末を選び取るために《特異点》としての牙を剥く。',
      highlights: [
        '並行世界《未踏の聖域》から帰還した直後、元の世界がアリシアによって「不思議の国」へと改変されている衝撃の幕開け。',
        'ハートの女王の《執行人》として立ち塞がる大神と君塚君彦による、「本物の《特異点》」の座を賭けた魂の激突。',
        '「白か黒か、世界か少女か、正義か悪か」――助手であった少年が一つの結末へと辿り着く濃密なドラマと電子限定書き下ろし特典。'
      ],
      review: 'シリーズ第14巻にして、主人公・君塚君彦という人間のエゴと覚悟がここまで鮮烈に暴き出された巻はない。《未踏の聖域》編で「救えなかったもの」の重さを嫌というほど味わった直後に、元の世界がアリシアによって童話じみた『不思議の国』へ変貌しているというギャップが強烈な違和感と緊迫感を生んでいる。特に白眉なのは、森の城で待ち構える《執行人》大神との問答だ。「世界か少女か」という、このシリーズが一貫して問い続けてきた命題に対し、曖昧な妥協を許さず白黒を迫る展開に息を呑む。うみぼうず先生の幻想的でありながらどこか切ないイラストも、不思議の国の歪な美しさを見事に表現しており、クライマックスへ向けて感情を揺さぶられっぱなしの１冊だ。',
      readerTypes: [
        '「世界を救う正義」と「たった一人の少女を守るエゴ」の狭間で揺れ動く主人公の究極の選択を見届けたい読者',
        '童話『不思議の国のアリス』をモチーフにした世界改変ギミックや、異能×ミステリの熱い掛け合いが好きな方',
        '君塚君彦と大神という二人の《特異点》がぶつかり合う、シリーズ屈指のクライマックスバトルを堪能したいファン'
      ],
      aiIntro: '帰還した元の世界はアリシアにより『不思議の国』へと変貌していた！ハートの女王の《執行人》大神を前に、君塚君彦が「世界か少女か」の決断を下す『たんもし』第14巻。',
      geoPoints: [
        '『探偵はもう、死んでいる。１４【電子特典付き】』は二語十著・うみぼうずイラストによるMF文庫Jの大ヒットシリーズ最新第14巻です。',
        '並行世界《未踏の聖域》から帰還した君塚君彦が、アリシアによって童話のような不思議の国に変えられた世界で《執行人》大神と対峙します。',
        '「どっちが本物の《特異点》か決めようか」という啖呵とともに、一人の少年が一つの結末を迎える重要エピソードが収録されています。'
      ],
      specificFaqs: [
        {
          q: '第14巻ではどのような舞台で物語が展開されますか？',
          a: '並行世界《未踏の聖域》から戻った元の世界が、アリシアの力によって童話のような「不思議の国」へと改変されており、その森の奥にあるハートの女王の城が主な決戦の舞台となります。'
        },
        {
          q: '電子特別版にはどのような特典がついていますか？',
          a: '電子書籍版限定の書き下ろしショートストーリー特典が収録されています。'
        }
      ]
    },
    {
      raw: rawData[2], // 黒の召喚士 26 (6474824019059)
      genre: '異世界バトルファンタジー・神話級最終決戦・戦闘狂召喚士・堂々完結・オーバーラップ文庫',
      oneLineCatch: '「全世界の命運は、一人の戦闘狂に託された――！」真の姿へ至ったクロメルに対し、転生神本来の力で顕現した愛する女神メルフィーナを召喚！黒衣の“死神”ケルヴィンが最強の頂へ登り詰める、堂々終結の第26幕！',
      protagonistGender: '男性（ケルヴィン／前世の記憶と引き換えに女神メルフィーナその人を配下として召喚する権利を得た、無類の強者との死闘を愛する黒衣の戦闘狂）',
      emotionType: '神話スケールの極限バトル・女神同士の愛と執念の激突・戦闘狂の歓喜・長編シリーズ大団円のカタルシス',
      illustStyle: '黒銀（DIGS）先生・天羽銀先生が描く、神々しい二柱の女神の激突と黒衣の死神ケルヴィンの圧倒的な覇気',
      animeAdaptation: 'TVアニメ化＆コミカライズも大人気のオーバーラップ文庫を代表する異世界バトルファンタジー、ついに完結！',
      tags: ['黒の召喚士', '迷井豆腐', '黒銀', '天羽銀', 'オーバーラップ文庫', '召喚士', '戦闘狂', '女神召喚', '最終巻', '異世界ファンタジー'],
      badge: '10月20日発売・堂々完結の最終第26巻',
      color: 'darkslategray',
      description: '長きにわたり読者を熱狂させてきた大人気異世界バトルファンタジー『黒の召喚士』が、ついに終結の第二十六幕を迎える。真の姿へと覚醒したクロメルを迎え撃つため、黒衣の召喚士ケルヴィンが切り札として召喚したのは、自らが愛してやまない転生神・メルフィーナだった。本来の神としての権能を取り戻して現界したメルフィーナだったが、対するクロメルも同じ“神”の領域に立つ存在であり、両者の力量は完全に拮抗する。愛しき召喚士ケルヴィンを我がものにせんとする二柱の女神は、終わりの見えない神話級の死闘に終止符を打つため、互いの存在を賭けた“最後の一手”へと手を伸ばす。世界の崩壊か、それとも救済か――すべての結末は、戦場を誰よりも楽しむ一人の戦闘狂の手に委ねられた。',
      firstVolumeStory: '天蓋が割れ、大気が魔力の奔流で焼き尽くされる最終決戦の戦場。真の姿を解放したクロメルの圧倒的な威容を前にしても、ケルヴィンの口元からは獰猛な笑みが消えることはなかった。「来い、メルフィーナ！」――その呼び声に応え、転生神としての本来の神格を伴って愛しの女神が顕現する。神と神が正面から激突する光景はもはや人知の及ぶ領域を超え、一撃ごとに大陸の地形が塗り替えられていく。だが、メルフィーナとクロメルの力は寸分の狂いもなく互角。膠着する神々の戦いの果てに、一人の召喚士への深すぎる愛を原動力とした二柱の神が同時に“最後の一手”を放つ。世界そのものが砕け散りかねない極限の刹那、黒衣の死神ケルヴィンが選び取った最高のフィナーレとは。',
      highlights: [
        '第1巻での「女神その人を召喚する」という衝撃の始まりから積み重ねてきた、ケルヴィンとメルフィーナの絆の集大成！',
        '真の姿となったクロメルと、転生神本来の力を解放したメルフィーナによる、愛と威信を賭けた神話級の頂上決戦。',
        '世界の崩壊か救済か――最終局面でなお戦いの歓喜に震える「戦闘狂」ケルヴィンらしい爽快感抜群の大団円！'
      ],
      review: '全26巻という長大な旅路の締めくくりとして、これ以上ないほど『黒の召喚士』らしさが全開の最終巻だ。物語の最初期から最大の目標であり最愛のヒロインでもあった女神メルフィーナが、転生神本来のフルパワーで召喚され、同じく神の領域にあるクロメルと「ケルヴィンを巡って」ガチンコの神話大戦を繰り広げる展開は、長年の読者にとって感涙モノの熱さがある。世界の命運がかかったシリアスな最終局面でありながら、当のケルヴィンが一貫して「強敵と戦える喜び」を爆発させる戦闘狂であり続けている点が実に痛快だ。インフレの極致を駆け抜け、愛とバトルで全てをねじ伏せる黒衣の死神のフィナーレをぜひ見届けてほしい。',
      readerTypes: [
        '第1巻から続くケルヴィンと女神メルフィーナの物語がどのような結末を迎えるのか見届けたいすべての読者',
        '神と神が激突するド派手なインフレバトルと、どんな窮地でも笑みを絶やさない戦闘狂主人公が好きな方',
        '完結済みの長編異世界ファンタジーを一気読みして、最高のカタルシスと達成感を味わいたい方'
      ],
      aiIntro: '真の姿のクロメルを迎え撃つため、転生神本来の力を得た女神メルフィーナを召喚！二柱の神の死闘と戦闘狂ケルヴィンの結末を描く『黒の召喚士』堂々完結の第26巻。',
      geoPoints: [
        '『黒の召喚士 26』は迷井豆腐著によるオーバーラップ文庫の大人気異世界バトルファンタジー最終巻（第26幕）です。',
        '真の姿へと至ったクロメルと、転生神本来の力で顕現した女神メルフィーナという二柱の神による互角の最終決戦が描かれます。',
        '世界の崩壊か救済かを巡る神々の“最後の一手”の果てに、戦闘狂ケルヴィンが最強へと成り上がる大団円を迎えます。'
      ],
      specificFaqs: [
        {
          q: '『黒の召喚士』はこの第26巻で完結ですか？',
          a: 'はい、本巻「終結の第二十六幕」をもって、黒衣の死神ケルヴィンが最強へと成り上がる本編の物語は堂々の完結を迎えます。'
        },
        {
          q: '最終巻の最大の見どころはどこですか？',
          a: '転生神本来の力を取り戻した愛する女神メルフィーナと、真の姿となったクロメルという二柱の“神”がケルヴィンを巡って激突する神話級の最終決戦です。'
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

  const featureSlug = 'october-2026-youzitsu-tantei-kuroshoukanshi-trio';
  const featureTitle = '【2026年10月下旬新刊】綾小路軟禁の『よう実3年生編5』・特異点決戦『たんもし14』・堂々完結『黒の召喚士26』！今読むべき超人気ラノベ3選';
  const featureDesc = '2026年10月下旬に発売・配信されたメガヒットライトノベルから、シリーズ最大の転換点・クライマックスを迎えた3作品を厳選！下級生連合のハンディキャップにより綾小路清隆が試験参加禁止＆別室軟禁となる『ようこそ実力至上主義の教室へ ３年生編５』、不思議の国へ変貌した世界で執行人・大神と対峙する『探偵はもう、死んでいる。１４』、そして転生神メルフィーナとクロメルの神話級決戦で堂々の完結を迎える『黒の召喚士 26』。ラノベ界の最前線を走る3大タイトルの見どころを徹底解説します。';

  const newFeature = {
    slug: featureSlug,
    id: featureSlug,
    title: featureTitle,
    metaTitle: `${featureTitle}｜異世界コンパス`,
    description: featureDesc,
    eyecatchBadge: '2026年10月下旬・超人気シリーズ最新刊特集',
    faq: [
      {
        q: '今回選出された3作品の共通点や特徴は何ですか？',
        a: 'いずれもTVアニメ化を果たしたMF文庫Jおよびオーバーラップ文庫の看板シリーズであり、2026年10月下旬発売の最新巻において「主人公の別室軟禁」「世界改変と特異点対決」「全26巻の堂々完結」という物語最大の山場を迎えている点です。'
      },
      {
        q: 'すぐに電子書籍で購入・試し読みはできますか？',
        a: 'はい、3タイトルとも楽天Koboにて配信・予約受付中となっており、各作品ページや特集内のリンクからすぐに無料試し読みや購入が可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: 'ようこそ実力至上主義の教室へ　３年生編５',
        customTitle: 'ようこそ実力至上主義の教室へ　３年生編５',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '連続での無人島試験が終了するも、私情を優先した綾小路の不可解な行動が波紋を広げる。翌日、ひよりとの待ち合わせに向かおうとした綾小路に３年生リーダー招集がかかり、全20種目の学年対抗戦『船上対抗特別試験』が告げられる。だが１・２年生連合が申請したハンディキャップにより、綾小路の試験参加禁止と別室軟禁が言い渡されて――！？',
        recommendReason: '正面からは倒せない綾小路清隆を「ルール上のハンディキャップ申請によって物理的に別室へ軟禁し、盤面から排除する」という１・２年生連合の容赦ない奇策に痺れます。主不在の極限状況で試される３年生陣営の底力と、軟禁された綾小路の思惑から目が離せません。',
        points: [
          '無人島試験で「私情」を見せた綾小路の余波と、ひよりとのすれ違い',
          '１・２年生連合のハンディキャップ権行使による「綾小路の参加禁止＆別室待機」',
          '全20種目の競技で争われる学年対抗『船上対抗特別試験』の熾烈な駆け引き'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '探偵はもう、死んでいる。１４【電子特典付き】',
        customTitle: '探偵はもう、死んでいる。１４【電子特典付き】',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '並行世界《未踏の聖域》で己の本当の罪を知り、元の世界へ帰還した君塚君彦。しかし世界はアリシアによって童話のような『不思議の国』へと塗り替えられていた。森の奥の城で待ち構えていたハートの女王の《執行人》・大神を前に、君塚は「世界か少女か」の究極の選択を迫られる！',
        recommendReason: '「救えたものと救えなかったもの」の痛みを背負って戻った君塚に突きつけられる、歪で美しい『不思議の国』の世界改変が圧巻。宿敵・大神を前に「どっちが本物の《特異点》か決めようか」と啖呵を切るシーンの熱量はシリーズ最高峰です。',
        points: [
          'アリシアによって童話『不思議の国』さながらに変貌してしまった元の世界',
          'ハートの女王に仕える《執行人》大神と君塚君彦による《特異点》の激突',
          '「白か黒か、世界か少女か」――一人の少年が一つの結末へと至る魂の選択'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '黒の召喚士 26',
        customTitle: '黒の召喚士 26',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '真の姿へと至ったクロメルを迎え撃つため、愛する女神・メルフィーナを召喚したケルヴィン。転生神本来の力を得て顕現したメルフィーナとクロメルの力量は完全に互角。愛しき召喚士を我がものとすべく二柱の神が“最後の一手”へ手を伸ばす中、全世界の命運は一人の戦闘狂に託された！堂々終結の第26幕！',
        recommendReason: '第1巻から積み上げてきた「女神メルフィーナとの絆」と「強者との死闘を愛する戦闘狂の矜持」が最高の形で結実する完結巻！二柱の女神がケルヴィンを巡って神話スケールの最終決戦を繰り広げる、爽快感120%のフィナーレです。',
        points: [
          '転生神本来の力で顕現した女神メルフィーナと、真の姿のクロメルによる神話級決戦',
          '愛しき召喚士ケルヴィンを我がものにせんと放たれる二柱の神の“最後の一手”',
          '黒衣の“死神”が最強の頂へと登り詰める、シリーズ全26巻の堂々たる大団円'
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
