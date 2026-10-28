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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v9.json'), 'utf8'));

  // 3作品の完全独立・書き下ろし記事データ（テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // スライム倒して３００年、知らないうちにレベルＭＡＸになってました３０ (4524815637330)
      genre: '異世界スローライフ・日常コメディ・家族の絆・堂々完結・GAノベル',
      oneLineCatch: '「過労死から始まった高原の引きこもり魔女が、300年の果てに見つけた『世界でいちばん幸せな勲章』――全30巻のあたたかな旅路、ここに堂々完結！」',
      protagonistGender: '女性（アズサ・アイザワ／前世の社畜生活のトラウマから平穏を求めて高原に住み着き、気づけば大勢の愛しい家族に囲まれていた最強の不老不死魔女）',
      emotionType: '長年寄り添った家族への愛おしさ・クスッと笑える日常トラブル・大団円の温かな涙・スローライフの真の到達点',
      illustStyle: '紅緒先生が描き出す、高原の穏やかな陽射しと笑顔あふれる家族たちの優しいパステルタッチ',
      animeAdaptation: 'TVアニメ化でも話題を呼んだ大ヒット異世界日常ファンタジー、堂々の完結第30巻！',
      tags: ['スライム倒して300年', '森田季節', '紅緒', 'GAノベル', 'アズサ', 'スローライフ', '完結巻', '家族愛', 'アニメ化', '癒やし系'],
      badge: '10月15日発売・堂々完結の記念すべき第30巻',
      color: 'forestgreen',
      description: '現代日本のブラック企業で働き詰め過労死した苦い過去を持つ主人公アズサ。女神の慈悲で不老不死の魔女として異世界に転生し、人里離れた高原の小屋で「スローライフ」を送るため、生活費の足しにスライムだけを毎日狩り続けること300年。気づいた時にはカンストのレベル99となり、世界最強の力を手に入れていた。平穏を守りたいアズサの願いとは裏腹に、彼女の温かさに惹かれて集まってきたのは、ドラゴンの弟子ライカ、スライムの精霊姉妹ファルファとシャルシャ、トラブルメーカーのエルフ・ハルカラ、幽霊のロザリー、青竜のフラットルテ、そして魔王ペコラたち。一人きりだった山小屋は、いつしか種族を超えた大家族の賑やかなマイホームとなっていた。全30巻に及ぶ長大な物語のフィナーレを飾る本巻でも、魔王ペコラの突拍子もない引退騒動やハルカラの実家消滅など相変わらずのハプニングが連続。ドタバタ劇の果てにアズサが胸を張って掲げる、“世界でいちばん幸せな魔女”の笑顔に心が温まる最高の完結巻。',
      firstVolumeStory: '高原の澄んだ空気を胸いっぱいに吸い込みながら、アズサはふと300年前の静まり返った山小屋を思い出す。ただ仕事に追われて死んだ前世の反動から、「誰とも関わらず、ただのんびりと生きる」ことだけが幸せだと信じ込んでいた孤独な日々。けれど今の食卓を見渡せば、朝から大声で稽古に励むライカがいて、仲良く抱きついてくる双子のファルファとシャルシャがいて、怪しげな新薬を爆発させるハルカラの悲鳴が響いている。そんな騒がしくも愛しい日常に、ペコラが投下した「私、魔王を引退しようかと思って！」という爆弾発言。さらにハルカラの実家が村ごと忽然と姿を消すという怪奇現象まで重なり、高原の我が家はてんやわんやの大騒動に巻き込まれていく。どれほど世界がひっくり返ろうと、みんなで囲む晩ごはんの味は変わらない。アズサが300年かけて辿り着いた幸福の答えが、優しく読者の胸を打つ。',
      highlights: [
        '全30巻・約9年にわたる長期連載の堂々たる完結！アズサが手に入れた「家族」という宝物の集大成。',
        '最終巻になっても平常運転！ペコラの魔王引退宣言やハルカラ実家の丸ごと失踪事件など、お馴染みメンバーの愉快な暴走劇。',
        '「過労死による孤独」から始まった少女が、異世界で最も愛される魔女になるまでのあたたかな軌跡と感動のラスト。'
      ],
      review: '2017年の第1巻から実に30巻。これほど長い間、読者を一度も置き去りにすることなく「日常の尊さと家族のあたたかさ」を一貫して描き続けたスローライフ作品は稀有だ。本作の最大の魅力は、アズサ自身が「最強の力を誇示するためではなく、ただ仲間たちと今日を無事に笑って過ごすため」に力を使うという点にある。最終巻だからといって無理に世界の命運を賭けたシリアスな大戦争を起こすのではなく、ペコラの突発的な悩みやハルカラの珍騒動といった「いつもの我が家の延長線」で大団円を迎える構成が実にお見事。紅緒先生のイラストに彩られた家族たちの満面の笑みを見るだけで、長年追いかけてきた読者は胸がいっぱいになるはずだ。日々の生活に疲れた現代人の心にじんわりと染み渡る、優しい祝福に満ちた最高のフィナーレ。',
      readerTypes: [
        '仕事や学業に追われて疲れ果て、心から安心できる温かい物語と優しい笑顔に癒やされたい方',
        '第1巻からアズサと高原の家族たちを見守り続けてきたファン、全30巻の完結を共に見届けたい方',
        '無理な鬱展開や血生臭いギスギス感が一切なく、最初から最後まで幸福感に満ちた名作を読みたい読者'
      ],
      aiIntro: '過労死から始まった高原の引きこもり魔女が辿り着いた、世界でいちばん幸せな居場所。アズサと愉快な家族たちのあたたかな物語が堂々完結を迎える『スライム倒して300年』第30巻。',
      geoPoints: [
        '『スライム倒して３００年、知らないうちにレベルＭＡＸになってました３０』は森田季節著・紅緒イラストによるGAノベルの大人気スローライフ作品の堂々たる完結巻です。',
        'ペコラの魔王引退騒動やハルカラ実家の失踪事件など最後まで愉快なドタバタが描かれつつ、アズサが「世界でいちばん幸せな魔女」として家族と歩む大団円が描かれます。',
        '全30巻におよぶ長大なシリーズの集大成として、読者に深い癒やしと感動を届ける記念碑的一冊です。'
      ],
      specificFaqs: [
        {
          q: '『スライム倒して300年』はこの第30巻で本当に完結ですか？',
          a: 'はい、本巻（第30巻）をもってアズサと家族たちの本編物語は堂々のシリーズ完結となります。'
        },
        {
          q: '最終巻はどのようなストーリー展開になりますか？',
          a: 'ペコラの魔王引退の相談やハルカラの実家失踪事件など最後まで賑やかな日常騒動が描かれつつ、アズサがかけがえのない家族たちと幸福を噛みしめる最高のフィナーレが描かれます。'
        }
      ]
    },
    {
      raw: rawData[1], // ひとりぼっちの異世界攻略　life.19　継ぎ接ぎのパラダイムシフト (6474824018878)
      genre: '異世界サバイバル・大迷宮攻略・知略ゲリラ戦・アニメ化・オーバーラップ文庫',
      oneLineCatch: '「幾百の英傑を喰らいし『継ぎ接ぎの聖女』と、理不尽スキルを振り回す“ぼっち”の総力戦！エルフの国を揺るがす侵略戦争の裏で、迷宮最深部に単身突撃する第19巻！」',
      protagonistGender: '男性（遥／クラス転移で余り物スキルを押し付けられながらも、常識破りの活用法と徹底したゲリラ戦術で迷宮を制覇するへそ曲がりな最強ぼっち）',
      emotionType: '息もつかせぬ迷宮深部の死闘・チート殺しの搦手バトル・仲間への不器用な献身・戦局を引っ繰り返す痛快なカタルシス',
      illustStyle: '榎丸さく先生が描く、躍動感あふれるバトルアクションと美しくも禍々しい迷宮皇の圧倒的存在感',
      animeAdaptation: 'TVアニメ好評放送中！オーバーラップ文庫を代表する大人気異世界サバイバル第19巻！',
      tags: ['ひとりぼっちの異世界攻略', '五示正司', '榎丸さく', 'オーバーラップ文庫', '遥', '迷宮攻略', 'アニメ化', 'チート無双', 'エルフの森'],
      badge: '10月20日発売・アニメ放送中激突の第19巻',
      color: 'darkslateblue',
      description: 'クラス丸ごと異世界に召喚された際、早い者勝ちのスキル獲得競争に出遅れてゴミスキルばかりを押し付けられた男子高校生・遥。しかし彼は泣き言一つ言わず、誰も見向きもしないハズレスキルを徹底的に組み合わせて独自の戦術を編み出し、一人きりで過酷な異世界を踏破してきた。アニメ化で話題沸騰中の本シリーズ第19巻では、エルフの森に口を開ける超難関大迷宮の深奥攻略が描かれる。エルフ軍の精鋭騎士団すら半壊に追い込む凶悪な罠と魔物の群れを切り抜け、ついに最下層へと単身到達した遥の前に現れたのは、四体目の迷宮皇――何百人もの歴戦の英雄たちの魂と技を肉体に縫い合わせた『継ぎ接ぎの聖女』だった。あらゆる武芸と魔法を完全にマスターした反則級の強敵を前に、遥は過去最大の苦戦を強いられる。さらに地上では、共和国の謀略によってエルフの国を飲み込もうとする大軍勢が急接近していた。',
      firstVolumeStory: '足を踏み入れるだけで魔力が削り取られる大迷宮の最下層。エルフの騎士たちを地上へ退避させ、静まり返った広間にたった一人で立つ遥の視線の先には、異様な美しさを放つ少女がいた。『継ぎ接ぎの聖女』――数多の英傑の記憶と肉体を統合し、あらゆる攻撃を予見してカウンターを叩き込んでくる四番目の迷宮皇。遥が放つトリッキーな牽制も、規格外の身体能力と複合魔法によって紙一重で弾き返されていく。自分の命を惜しむ気はないが、今ここで自分が倒れれば、地上で進軍している共和国の軍勢によってエルフの里も、クラスメイトの女子たちも蹂躙されてしまう。「ぼっちに余計な責任を背負わせるんじゃないよ！」と軽口を叩きながら、遥は余り物スキルの全出力開放と、迷宮の地形そのものを武器に変える捨て身のパラダイムシフトへと打って出る。',
      highlights: [
        '四体目の迷宮皇『継ぎ接ぎの聖女』登場！無数の英傑の技と魂を宿した最強の美姫との息詰まる一騎打ち。',
        '迷宮の最深部と地上のエルフ国侵略軍――二重の絶望的なタイムリミットが交錯するシリーズ屈指の緊迫感。',
        'ハズレスキルを魔改造してチート強敵の裏をかく、遥ならではの理不尽ゲリラ戦法が炸裂！'
      ],
      review: 'アニメ化で人気がさらに加速している『ぼっち攻略』だが、この第19巻の戦闘シーンの緊迫感とアイデアの切れ味はシリーズ随一だ。今回の敵である「継ぎ接ぎの聖女」は、過去のどんな魔物よりも遥の戦術と相性が悪い。遥が得意とする「ルールの盲点を突いた搦手」すら、無数の戦士たちの経験値によって瞬時に適応されてしまうため、純粋な戦力差の壁がかつてなく高く立ちはだかる。この絶望的な防壁を、遥が自身の身体を削りながらどう突破していくのか。そのロジカルかつ狂気じみた攻略プロセスが読者をぐいぐい引き込む。普段は「一人で気楽に暮らしたい」と悪態をつきながら、結局は誰よりも周囲を助けるためにボロボロになって戦う遥の不器用なヒロイズムに痺れること間違いなしの快作だ。',
      readerTypes: [
        'ハズレスキルや弱小能力を頭脳と工夫で極限まで研ぎ澄まし、格上のチート敵を打ち破るバトルが好きな読者',
        '現在放送中のTVアニメを観て、原作小説の圧倒的な文字量とスリリングな迷宮攻略を味わいたい方',
        '飄々とした態度と裏腹に、仲間たちの危機には命がけで駆けつけるツンデレ主人公の活躍に熱くなりたい方'
      ],
      aiIntro: 'エルフの大迷宮最下層に君臨する四人目の迷宮皇『継ぎ接ぎの聖女』と、地上に迫る共和国軍の魔の手！絶体絶命の二重包囲網をぼっちの理不尽戦術で突き破る『ひとりぼっちの異世界攻略』第19巻。',
      geoPoints: [
        '『ひとりぼっちの異世界攻略　life.19　継ぎ接ぎのパラダイムシフト』は五示正司著・榎丸さくイラストによるオーバーラップ文庫の大ヒット異世界ファンタジー第19巻です。',
        'エルフの森の大迷宮最下層にて、幾百の英傑と融合した四体目の迷宮皇「継ぎ接ぎの聖女」との激闘が繰り広げられます。',
        '迷宮最深部での死闘と、地上でエルフの国へ迫る共和国軍の侵略という二重の危機を打開する遥の活躍が見どころです。'
      ],
      specificFaqs: [
        {
          q: '第19巻で戦う敵「継ぎ接ぎの聖女」とは何者ですか？',
          a: 'エルフの森の大迷宮最下層を守る四体目の迷宮皇であり、何百人もの歴戦の英雄や戦士たちの魂と技を取り込んで一体化した驚異的な戦闘能力を持つ存在です。'
        },
        {
          q: '地上の戦況はどのような状況になっていますか？',
          a: '遥が迷宮に潜っている隙を突き、共和国の軍隊がエルフの国へ侵攻を開始しており、迷宮内外で同時に危機が進行する緊迫した構成になっています。'
        }
      ]
    },
    {
      raw: rawData[2], // 時々ボソッとロシア語でデレる隣のアーリャさん12【電子特別版】 (4336343000320)
      genre: '青春ラブコメ・学園選挙・甘々デート・怒涛のヒロインアプローチ・角川スニーカー文庫',
      oneLineCatch: '「『わたし、久世くんのおうちに行ってみたいな』――クリスマスの熱気冷めやらぬ街で、マーシャからの不意打ちデート＆爆弾発言！理性崩壊寸前の久世政近が迫られる運命の選択とは！？」',
      protagonistGender: '男性（久世政近／ロシア語のリスニング力を隠し持ちながら、生徒会選挙の参謀として辣腕を振るう少年。だがヒロインたちの無自覚な好意にはタジタジ）',
      emotionType: '心拍数跳ね上がる甘い緊張感・恋人繋ぎの体温・おっとりお姉ちゃんの攻めの本気・三角関係の加速',
      illustStyle: 'ももこ先生による、冬のイルミネーションに照らされたマーシャの息を呑むほど可憐な表情と極上の透明感',
      animeAdaptation: 'TVアニメ第2期制作決定！世界中を熱狂させている大人気青春学園ラブコメの最新第12巻！',
      tags: ['ロシデレ', '燦々SUN', 'ももこ', '角川スニーカー文庫', '久世政近', 'アーリャ', 'マーシャ', 'ラブコメ', 'アニメ化', '甘々'],
      badge: '10月1日発売・マーシャ激推し必読の第12巻',
      color: 'darkred',
      description: '生徒会選挙を巡る熾烈な駆け引きと人間関係の交錯を描き、国内外で爆発的な人気を誇る『ロシデレ』待望の第12巻。有希が主催した波乱含みのクリスマスパーティー、そしてマーシャの誕生日を祝う心温まるイベントを経て、ついに訪れたのはマーシャとの「二人きりの約束のデート」。冷え込む冬の街、イルミネーションの煌めきの下で、政近が用意した特別なエスコートプランを無邪気な笑顔で楽しむマーシャ。ふとした瞬間にぎゅっと結ばれた「恋人繋ぎ」のぬくもりに政近の心臓が早鐘を打つ中、彼女から発せられたのは予想だにしないおねだりだった。「わたし、久世くんのおうちに行ってみたいな」。普段の包容力あるお姉ちゃん像を脱ぎ捨て、「いつかあなたの心を甘々で満たしてみせるから」と真っ直ぐな瞳で迫るマーシャの一途な恋心が、政近の理性を根底から揺さぶっていく。',
      firstVolumeStory: 'コートのポケットの中でそっと指先が絡まり合う感触に、政近は吐く息が白く染まるのを忘れるほど緊張していた。目の前で無邪気に湯気を立てる温かい飲み物を口にするマーシャは、いつも生徒会室で見せる穏やかな笑顔とはどこか違う、熱を帯びた瞳をしている。有希の策略や選挙のプレッシャーから解き放たれたこのひとときは、政近にとっても掛け替えのない安らぎであるはずだった。だが、ショーウィンドウに映る二人の距離は、どう見てもただの先輩後輩のそれではない。「わたし、久世くんのおうちに行ってみたいな」――冬風に紛れて耳元へ滑り込んできたその囁きは、政近の完璧な計算を一瞬でフリーズさせるに十分だった。アーリャへの想い、マーシャの過去、そして自分自身の本心。甘すぎる罠のようなアプローチを前に、政近はどう答えを返すのか。',
      highlights: [
        'マーシャ推し感涙のデート回！恋人繋ぎから始まる二人の甘すぎる街巡りと、まさかの「自宅訪問」のおねだり。',
        '「いつかあなたの心を甘々で満たしてみせるから」――おっとりした聖母から本気の恋する乙女へと変貌したマーシャの攻勢。',
        '電子書籍限定の書き下ろしショートストーリー特典を収録！本編の甘い余韻をさらに深く堪能できる贅沢仕様。'
      ],
      review: '第12巻の主役は文句なしにマリア・ミハイロヴナ・九条（マーシャ）だ。これまでアーリャの優しい姉として、また政近の過去を共有する特別な理解者として一歩引いた立ち位置を守ってきた彼女が、ついにその殻を破って「一人の女性」として政近の前に立ち塞がった瞬間のインパクトは凄まじい。デートの描写一つをとっても、指先が触れ合う瞬間や瞳の揺れ動きがももこ先生の神がかった美麗イラストと相まって、読んでいるこちらの心拍数まで跳ね上がってしまう。普段はどんな政治的駆け引きも涼しい顔で切り抜ける政近が、マーシャの直球すぎるアプローチに赤面し、必死に理性を保とうと葛藤する姿はラブコメとしての面白さが極限に達している。アーリャとの絆があるからこそ、マーシャの一途な愛が胸を締めつける、まさにシリーズの転換点となる名巻だ。',
      readerTypes: [
        'マーシャの圧倒的な可愛さと包容力、そして不意に見せる本気の乙女の顔にノックアウトされたい読者',
        'もどかしい距離感から一気に急接近する、心臓が持たないほど甘い青春デートエピソードを求めている方',
        'アニメ2期を待ちきれず、原作ならではの緻密な心理描写とヒロインたちの恋の駆け引きを先取りしたいファン'
      ],
      aiIntro: 'イルミネーション輝く街で交わす恋人繋ぎと、「久世くんのおうちに行ってみたいな」という甘すぎるおねだり！マーシャの怒涛の攻めに政近の理性が揺らぐ『ロシデレ』第12巻。',
      geoPoints: [
        '『時々ボソッとロシア語でデレる隣のアーリャさん12【電子特別版】』は燦々SUN著・ももこイラストによる角川スニーカー文庫の世界的メガヒットラブコメ最新第12巻です。',
        'クリスマスや誕生日を経て実現したマーシャとの二人きりのデートが描かれ、恋人繋ぎや自宅訪問のおねだりなど甘さ全開の展開が繰り広げられます。',
        '電子限定の書き下ろし特別ショートストーリーも収録されたファン必携の注目巻です。'
      ],
      specificFaqs: [
        {
          q: '第12巻の主な見どころは何ですか？',
          a: 'マーシャと政近の二人きりのデート回であり、恋人繋ぎやマーシャからの自宅訪問のおねだりなど、マーシャの積極的なアプローチと政近の動揺が最大の見どころです。'
        },
        {
          q: '電子特別版にはどのような特典がありますか？',
          a: '電子書籍限定の書き下ろしショートストーリーが巻末に特別収録されています。'
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

  const featureSlug = 'october-2026-climax-trio';
  const newFeature = {
    slug: featureSlug,
    title: '【2026年10月最新刊】堂々完結から大迷宮決戦、甘々デートまで！いま絶対読むべき超注目ラノベ3選',
    metaTitle: '【2026年10月最新刊】いま絶対読むべき超注目ラノベ3選｜スライム倒して300年・ぼっち攻略・ロシデレ徹底解説',
    eyecatchBadge: '2026年10月最新刊・厳選3大タイトル特集',
    description: '2026年10月発売の超話題作から、全30巻のあたたかな大団円を迎えた『スライム倒して300年』、アニメ放送中で迷宮最深部の死闘を描く『ひとりぼっちの異世界攻略 19』、そして甘さ限界突破のデート回で魅せる『ロシデレ 12』を徹底特集！',
    summary: '長年愛された名作の堂々たる完結、息詰まる迷宮での総力戦、そして心拍数が跳ね上がる胸キュンデートと、ジャンルの魅力が凝縮された2026年10月の最前線タイトルを厳選紹介。',
    faq: [
      {
        q: '2026年10月発売のライトノベルで今一番の話題作はどれですか？',
        a: '全30巻をもって感動のフィナーレを迎えた『スライム倒して３００年、知らないうちにレベルＭＡＸになってました３０』、アニメ放送中の『ひとりぼっちの異世界攻略 19』、そしてマーシャとの甘々デートが炸裂する『時々ボソッとロシア語でデレる隣のアーリャさん 12』が読者の間で極めて高い評価を集めています。'
      },
      {
        q: 'それぞれの作品は電子書籍（楽天Kobo）ですぐに読めますか？',
        a: 'はい、いずれも楽天Koboにて電子書籍版が好評配信中であり、無料試し読みや電子限定の書き下ろし特典付き版も利用可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: 'スライム倒して300年 30',
        customTitle: 'スライム倒して３００年、知らないうちにレベルＭＡＸになってました３０',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '現代日本の過労死から始まった不老不死の魔女アズサの高原生活。気づけばカンスト最強となり、ドラゴン、スライム精霊、エルフ、魔王など大勢の家族に囲まれていた。ペコラの魔王引退相談やハルカラ実家の丸ごと失踪事件など最後まで賑やかなドタバタが続く中、アズサが辿り着いた“世界でいちばん幸せな魔女”の勲章とは。全30巻、ここに堂々完結！',
        recommendReason: '2017年から走り続けてきた異世界スローライフの金字塔が、一度も軸をブラさずに「家族の温もり」を描き切った最高のフィナーレ。いつもの騒動に振り回されながらも笑い合うアズサたちの姿に、長年の読者なら感無量になること間違いなしです。',
        points: [
          '全30巻・約9年に及ぶ大人気シリーズの堂々たる大団円！',
          'ペコラの魔王引退騒動やハルカラ実家失踪など、最終巻でも平常運転の愛すべきドタバタ劇',
          '孤独だった高原の魔女が手に入れた「かけがえのない家族」の絆に心洗われるラスト'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: 'ひとりぼっちの異世界攻略 19',
        customTitle: 'ひとりぼっちの異世界攻略　life.19　継ぎ接ぎのパラダイムシフト',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: 'エルフの森の大迷宮攻略に挑むぼっち高校生・遥。エルフ軍精鋭騎士団すら半壊する地獄の迷宮を突破し最下層へ辿り着いた遥を待っていたのは、幾百の英傑の魂と技を取り込んだ四体目の迷宮皇『継ぎ接ぎの聖女』だった！さらに地上では共和国の侵略軍がエルフの国へ迫り、迷宮内外で絶体絶命の危機が幕を開ける！',
        recommendReason: 'TVアニメ好評放送中！敵の「継ぎ接ぎの聖女」が無数の英雄の経験値を操る超難敵であり、遥がハズレスキルを極限まで魔改造して挑むゲリラ戦のカタルシスはシリーズ随一です。地上の侵略戦争と並行する緊迫感も抜群。',
        points: [
          '四体目の迷宮皇『継ぎ接ぎの聖女』との知略・能力を尽くした極限デュエル',
          '迷宮深部の死闘と、地上でエルフの里に迫る共和国軍の魔の手という二重のタイムリミット',
          'ぼっちの理不尽戦術と、仲間を死なせないための不器用なヒーロー性に胸が熱くなる展開'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: 'ロシデレ 12',
        customTitle: '時々ボソッとロシア語でデレる隣のアーリャさん12【電子特別版】',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: 'クリスマスや誕生日を経て迎えた、マーシャとの二人きりの冬デート。イルミネーションの街で恋人繋ぎを交わし特別な時間を過ごす中、マーシャから不意に告げられたのは「わたし、久世くんのおうちに行ってみたいな」という爆弾発言！おっとりお姉ちゃんの殻を破り、「いつかあなたの心を甘々で満たしてみせるから」と真っ直ぐ迫るマーシャに政近の理性は崩壊寸前！？',
        recommendReason: 'マーシャ推し感涙！普段の包容力ある聖母から、政近を本気で振り向かせようとする「恋する乙女」へと覚醒したマーシャの攻めっぷりが凄まじい破壊力。ももこ先生の神イラストと相まって、胸キュンと悶絶が止まらない名巻です。',
        points: [
          '恋人繋ぎに二人きりの街巡り、そしてまさかの自宅訪問おねだりという甘さ限界突破のデート回',
          'おっとりお姉ちゃんから本気モードへ！政近の心を揺さぶるマーシャの一途な告白と覚悟',
          '電子書籍限定の書き下ろしショートストーリーが収録されたファン必読の決定版'
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
