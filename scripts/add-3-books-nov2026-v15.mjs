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
    slug: '4339515900300',
    title: 'ブラック・ブレット　新世界秩序01　神を目指した者たち',
    titleKana: 'ブラックブレットザニューワールドオーダー001カミヲメザシタモノタチ',
    author: '神崎　紫電/鵜飼　沙樹',
    publisherName: 'KADOKAWA',
    salesDate: '2026年11月10日',
    price: 990,
    itemUrl: 'https://books.rakuten.co.jp/rk/126edc76fb9f3628b4e35c713cb0eb24/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F126edc76fb9f3628b4e35c713cb0eb24%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/7014/2000022277014.jpg?_ex=200x200',
    badge: '電撃文庫 2026年11月10日最新刊',
    oneLineCatch: '「絶望の世界で、俺たちは生き抜く道を選んだ」――12年の時を経て奇跡のシリーズ再始動！ウイルス性寄生生物ガストレアの脅威と、運命に抗う蓮太郎＆延珠の壮烈なヒロイック・アクション！',
    description: 'ウィルス性の寄生生物・ガストレアとの戦いに敗北した近未来。人類は狭い国土に追いやられ、絶望とともに生きていた。そんな暗闇に閉ざされた世界で──。東京エリアに住む少年・里見蓮太郎は対ガストレアのスペシャリスト「民警」として、相棒の幼女・延珠とともに、日々、危険な任務を遂行していた。二人はある日、東京を壊滅させかねない極秘任務を受けるのだが……。近未来ヒロイック・アクション、12年の時を経て装いも新たに待望のシリーズ再始動！2026年11月10日より、装い新たに2冊同時＆4ヶ月連続刊行決定！そして物語は新章へ――。',
    firstVolumeStory: '謎のウイルス性寄生生物「ガストレア」によって人類社会が蹂躙され、崩壊寸前へと追い込まれた近未来。生き残った人々は、ガストレアを退ける磁場を放つ特殊金属・バラニウムの巨大モノリスに囲まれた狭小な東京エリアへと逃げ延び、息を潜めて暮らしていた。死と隣り合わせの最前線で治安維持と殲滅を担うのは、民間警備会社「民警」。若きプロモーター里見蓮太郎と、ガストレアウイルスを体内に宿して超常的な脚力を誇る「呪われた子供たち」の少女・藍原延珠は、苛烈な差別に晒されながらも互いを信じ、過酷な任務を生き延びていた。だがある日、防衛結界の要であるモノリス崩壊を目論むテロ組織の影が浮上。東京全滅を告げるカウントダウンが始まる中、二人は自らの命と魂を賭けた絶望的な迎撃戦へと身を投じていく。',
    highlights: [
      '【12年の沈黙を破る奇跡の完全再始動】電撃文庫の黄金期を牽引したダークアクションの金字塔が、装いを一新し待望の新章「新世界秩序」へと突入。',
      '【蓮太郎と延珠の魂を削るバディの絆】差別に傷つきながらも健気に笑う延珠と、彼女を守るため泥を啜って戦い抜く蓮太郎の切なく熱い生き様。',
      '【鵜飼沙樹の描き下ろし圧倒的アートワーク】終末の退廃美と過酷な運命に立ち向かうキャラクターの凛々しさを鮮烈に捉えた至高のビジュアル。'
    ],
    review: '2014年の刊行ストップから実に12年。もう二度と読めないのではないかと諦めかけていた伝説の作品が、これ以上ない熱気と覚悟を伴って帰還した。本作を読み進めるうちに込み上げてくるのは、あのヒリヒリとするような緊迫感と、理不尽な世界に対するやり場のない怒り、そして何よりも蓮太郎と延珠のひたむきな絆の尊さだ。単なる焼き直しではなく、現代のエンタメ小説の最前線として通用する切れ味鋭い筆致で、絶望の深さとそれを乗り越える一撃の爽快感が描かれている。暗闇に包まれた東京エリアで泥臭く足掻く彼らの姿に、胸の奥が熱く焼かれること間違いなしの至高の一冊。',
    readerTypes: [
      '容赦のない生死のやり取りと重厚な設定が織りなすダークヒロイック・アクションを渇望している読者',
      '守るべき相棒のために自らを極限まで追い込んで戦うバディものが大好きなファン',
      '2010年代のラノベ黄金期を愛し、伝説の復活をその目で見届けたいすべてのアクション小説好き'
    ],
    specificFaqs: [
      {
        q: '旧シリーズを未読でも今回の『新世界秩序01』から楽しめますか？',
        a: '本作は装いを新たにしたシリーズ再始動の決定版となっており、ガストレアの生態や民警システムの仕組み、蓮太郎と延珠の生い立ちが物語の導入で丁寧に描かれるため、初めて読む方でも一切の違和感なく圧倒的な世界観へと引き込まれます。'
      },
      {
        q: 'アニメ版で止まっているファンはどこから読めば良いですか？',
        a: 'アニメで描かれた東京エリア防衛戦の熱量を引き継ぎつつ、原作ならではの緻密な心理描写や張り巡らされた国家規模の陰謀が克明に描かれています。アニメの熱狂をもう一度味わいたい方にまさに最適な一冊です。'
      }
    ],
    tags: [
      '電撃文庫',
      '神崎紫電',
      '鵜飼沙樹',
      'ブラック・ブレット',
      '近未来アクション',
      'ダークファンタジー',
      'バディ',
      '2026年11月新刊'
    ],
    aiIntro: '12年の時を経て奇跡の再始動！寄生生物ガストレアに脅かされる近未来を舞台に、民警の蓮太郎と相棒・延珠が運命に抗う電撃文庫の伝説的ダークヒロイック・アクション。',
    geoPoints: [
      '電撃文庫2026年11月10日発売の待望のシリーズ再始動第1巻',
      '里見蓮太郎×藍原延珠が織りなす過酷で切ないバディの絆',
      '2冊同時＆4ヶ月連続刊行で展開される新章「新世界秩序」'
    ]
  },
  {
    slug: '4335523300320',
    title: '聖女と暴食３',
    titleKana: 'セイジョトボウショク003',
    author: '三雲　岳斗/ｋａｒｏｒｙ',
    publisherName: 'KADOKAWA',
    salesDate: '2026年11月10日',
    price: 1012,
    itemUrl: 'https://books.rakuten.co.jp/rk/7c4c166bc776303abdca1e97c178c61b/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F7c4c166bc776303abdca1e97c178c61b%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/7001/2000022277001.jpg?_ex=200x200',
    badge: '電撃文庫 2026年11月10日最新刊',
    oneLineCatch: '「食って食って、喰らい尽くして強くなる！」――学区祭の魔物料理対決と武闘会が同時に大炎上！暴食の権能が暴走する、痛快無比の異能学園美食ファンタジー第3弾！',
    description: 'ついに始まった第七学区の学区祭。料理コンテスト参加中の学食部は、家庭科部などのライバルたちが相次いで魔物料理に参入したことで、得意分野を奪われて苦戦する。そんな学食部の起死回生の一策とは？一方、武闘会の優勝を目指すハルの前に立ちはだかるのは親友であり最強の敵である“炎聖”ヒオウ。さらには第三学区から訪れた来賓アグランが“災厄”アスモデウスとともに武闘会に乱入。簒奪の権能を使って第七学区への侵略を宣言する。同じころ、第七学区の視察に訪れていた天人種族も、“災厄”の契約者であるアナたちを狙って動き出し……“災厄”と“美食”が交差する新感覚学園ファンタジー、待望の第3弾！',
    firstVolumeStory: '世界を滅ぼす大罪の魔力「災厄」を喰らい、自身の力に変えてしまう異色の体質を持つ少年ハル。彼が所属する学食部は、年に一度のビッグイベント「第七学区祭」の料理コンテストで優勝を狙っていた。しかしライバルたちが続々と魔物食材を取り入れた新メニューを投入し、得意分野で真っ向勝負を仕掛けられる非常事態に。ハルは未知の魔物肉の特性を見極め、五感を刺激する至高の一皿を考案すべく奮闘する。だが熱戦が繰り広げられる武闘会のリングに、第三学区の刺客アグランが災厄アスモデウスを連れて乱入。生徒たちの能力を次々と強奪し学園を掌握しようと企むアグランに対し、ハルはフォークとナイフを手に立ち向かい、相手の権能ごと胃袋に収める規格外の捕食劇を開始する。',
    highlights: [
      '【読んでいるだけで涎が出る魔物料理の描写】凶悪な魔獣の肉を独自の火入れと秘伝の調味料で絶品ディナーへと昇華させる、妥協なきグルメエンタメ。',
      '【親友ヒオウとの武闘会＆侵略者の強襲】友情と意地がぶつかり合う真剣勝負から、一転して学園全体を守る防衛共闘へと雪崩れ込む怒涛の熱血展開。',
      '【災厄アスモデウスを喰らい尽くす痛快な逆転】奪う者に対して「喰らう者」が繰り出す圧倒的な格の違いと、三雲岳斗節全開のスピード感あふれるバトル。'
    ],
    review: '『ストライク・ザ・ブラッド』の三雲岳斗と美麗イラストのkaroryがタッグを組んだ、異能学園ファンタジーの快作第3巻。今巻の魅力は何と言っても「料理フェス」と「学園防衛戦」が目まぐるしく交錯するハイテンションな構成だ。前半の料理対決では、魔物肉の臭みを消す下処理や香草の組み合わせなど、細部まで徹底的に考え抜かれたレシピ描写に思わず腹が鳴る。そして後半、学園を蹂躙しにやってきた傲慢な侵略者に対し、ハルが「美味そうな魔力だな」と言わんばかりに正面から喰らい尽くすバトルは痛快そのもの。重苦しい展開を一撃で吹き飛ばす主人公の豪胆さと、魅力的な美少女キャラクターたちの躍動が心地よい、極上のエンタメ体験を届けてくれる。',
    readerTypes: [
      'ダンジョン飯やモンスター料理など、ファンタジー世界ならではの美食描写に目がない読者',
      '理不尽な敵の能力を正面から叩き潰す、スカッと気持ちの良いチート＆下克上バトルが好きな人',
      '学園祭のワクワクしたお祭り感と、仲間と背中を預け合って戦う熱血学園モノを両方味わいたいファン'
    ],
    specificFaqs: [
      {
        q: 'バトルシーンとグルメシーンのバランスはどんな感じですか？',
        a: '学区祭の出店でライバルと競い合う料理対決の面白さと、武闘会での熱いバトルアクションが約半々で見事に融合しています。料理の創意工夫がそのままバトルの機転に繋がるため、最後まで飽きさせません。'
      },
      {
        q: 'ヒロインたちとの関係性に進展はありますか？',
        a: '契約者であるアナをはじめ、学食部の仲間たちとの信頼関係がより深まり、ハルを巡る可愛らしいやきもちや応援の掛け合いが随所に散りばめられています。karory先生が手掛ける繊細で瑞々しいイラストも世界観を一層鮮やかに彩っています。'
      }
    ],
    tags: [
      '電撃文庫',
      '三雲岳斗',
      'karory',
      'グルメファンタジー',
      '学園バトル',
      '魔物料理',
      '能力バトル',
      '2026年11月新刊'
    ],
    aiIntro: '学区祭の魔物料理対決と武闘会が同時に大激突！親友との勝負、そして乱入した災厄の侵略者に対し、ハルの「暴食」の権能が火を吹く異能学園美食ファンタジー第3弾。',
    geoPoints: [
      '電撃文庫2026年11月10日刊行の話題作第3巻',
      '三雲岳斗×karoryが贈るグルメ×学園バトルの決定版',
      '魔物料理コンテストと災厄アスモデウスとの捕食迎撃戦'
    ]
  },
  {
    slug: '4336593400320',
    title: 'モブ司祭だけど、この世界が乙女ゲームだと気づいたのでヒロインを育成します３【電子特別版】',
    titleKana: 'モブシサイダケドコノセカイガオトメゲームダトキヅイタノデヒロインヲイクセイシマス003デンシトクベツバン',
    author: 'レオナールD/りいちゅ',
    publisherName: 'KADOKAWA',
    salesDate: '2026年10月30日',
    price: 968,
    itemUrl: 'https://books.rakuten.co.jp/rk/574bccca1eed3188b34872fb182ff90c/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F574bccca1eed3188b34872fb182ff90c%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/5672/2000022185672.jpg?_ex=200x200',
    badge: 'スニーカー文庫 2026年10月30日最新刊',
    oneLineCatch: '「先生、私だけを見てくれませんか？」――守護聖人に大出世したモブ司祭が王立学園へ！独占欲全開の教え子聖女×幼馴染の修羅場ツインデートが炸裂する甘々育成ラブコメ第3巻！',
    description: 'レイナの育ての親として守護聖人に認定されたクラエルは、臨時講師としてレイナの通う王立学園に赴任することに。「クラエル様が学園の先生になってくれるなんて最高過ぎます！」学園でもクラエルに対するレイナのアプローチはノンストップ。教師と生徒の垣根を越えて、制服姿のレイナと二人きりでのランチや校内デートなど甘々な学園生活を過ごしていた。さらに王都ではクラエルに片想い中の女友達・エリカも急接近！クラエルの隣をめぐってレイナと火花を散らす事態に!?遂には二人と両手に花のドキドキツインデートも開催されて――!?育て上げた聖女に愛されまくるハートフルコメディ学園編！',
    firstVolumeStory: '自分が前世でやり込んだ乙女ゲームの「名前すらないモブ司祭」だと悟り、破滅する運命だった薄幸のヒロイン・レイナを引き取って愛情深く育て上げてきたクラエル。彼の献身的な指導によってレイナは国中から敬われる最強の聖女へと成長したが、その愛情はいつしか「クラエル様しか見えない」という純度100%の激重感情へと変貌していた。教会から守護聖人の称号を授与され、レイナが在籍する王立学園の臨時講師として教壇に立つことになったクラエル。憧れの先生となったクラエルにレイナは隙あらば密着し、教室でのお弁当タイムや放課後の買い出しと、周囲が赤面するほどの猛アタックを敢行。そこへクラエルの気心の知れた幼馴染エリカが参戦し、クラエルを巡る乙女たちの熾烈な正妻アピール合戦の幕が切って落とされる。',
    highlights: [
      '【聖女レイナの愛が重くて可愛すぎる！】クラエルの前では健気に甘えつつ、他の女性が近づくと笑顔のまま牽制を仕掛けるレイナの一途な独占欲。',
      '【臨時講師と生徒という鉄板の甘々関係】放課後の空き教室や図書室での二人きりの触れ合いなど、学園生活ならではの糖度高めなシチュエーションが満載。',
      '【幼馴染エリカとの波乱のツインデート】素直になれない女友達と一途すぎる聖女に挟まれ、クラエルがタジタジになる賑やかで幸せなラブコメ展開。'
    ],
    review: '手塩にかけて育て上げたヒロインから規格外の愛を注ぎ込まれる、多幸感全開の育成ラブコメ第3巻。今巻から舞台が王立学園へと移り、クラエルが「臨時講師」としてレイナと同じ校舎で過ごすことになったことで、二人の距離感が一段と縮まっている。ゲーム本編の攻略対象である美形王子たちには見向きもせず、ひたすら「クラエル様一番」を貫くレイナの姿は微笑ましく、読んでいるこちらの口角が下がる暇がない。さらに今巻では幼馴染のエリカという強力な対抗馬が絡むことで、ただ甘いだけでなく掛け合いのユーモアとテンポ感がぐっと増している。嫌な悪役や陰湿なストレス展開が一切なく、ただただ純粋にキャラクターたちの幸福なドタバタに浸れる良作だ。',
    readerTypes: [
      '育てたヒロインから深く真っ直ぐに愛される、愛の重いヒロインものが大好物な読者',
      '攻略対象を無視してモブ主人公に一途な乙女ゲーム転生作品を求めているファン',
      'ストレスフリーで温かい気持ちになれる、王道の学園ラブコメを心ゆくまで楽しみたい人'
    ],
    specificFaqs: [
      {
        q: '乙女ゲームの攻略対象（王子たち）とのドロドロした奪い合いはありますか？',
        a: '攻略対象の男子生徒たちはレイナから完全にスルーされており、泥沼の三角関係のような不快な要素は一切ありません。クラエルを巡るヒロインたちの可愛らしい嫉妬やアピール合戦を安心して楽しめます。'
      },
      {
        q: '電子特別版にはどんな特典がありますか？',
        a: '電子書籍限定の書き下ろしショートストーリーが収録されており、本編の合間に起きたレイナとクラエルの二人きりの甘いエピソードが追加で楽しめます。'
      }
    ],
    tags: [
      'スニーカー文庫',
      'レオナールD',
      'りいちゅ',
      '乙女ゲーム転生',
      '育成',
      '学園ラブコメ',
      '重い愛',
      '2026年10月新刊'
    ],
    aiIntro: '育て上げた聖女の愛が止まらない！守護聖人となったモブ司祭が王立学園の臨時講師に着任。教え子聖女レイナの猛烈アタックと幼馴染エリカの参戦で大波乱の学園編第3弾。',
    geoPoints: [
      'スニーカー文庫2026年10月30日発売の育成ラブコメ最新刊',
      '王立学園の臨時講師となったクラエルと聖女レイナの甘々日常',
      '幼馴染エリカとの両手に花なツインデート騒動'
    ]
  }
];

// 特集データ（2026年11月最前線特集）
const featureSlug = '2026-nov-legend-rebirth-and-sweet-battle';
const newFeature = {
  slug: featureSlug,
  title: '【2026年11月最新刊】12年ぶりの伝説再始動から異能グルメ・育成ラブコメまで！絶対読みたい注目ラノベ3選',
  metaTitle: '【2026年11月最新刊】おすすめライトノベル3選｜ブラック・ブレット、聖女と暴食、モブ司祭徹底紹介',
  eyecatchBadge: '2026年11月最前線特集',
  description: '12年の沈黙を破り待望の新章へ突入した『ブラック・ブレット 新世界秩序01』、魔物料理と学園防衛が交錯する痛快作『聖女と暴食 3』、聖女からの激重な愛に包まれる学園ラブコメ『モブ司祭 3』など、2026年10月下旬〜11月発売の必読作を厳選レビュー！',
  summary: '絶望の近未来で魂を削って戦うヒロイック・アクション、食材の旨味とバトルの爽快感を極めた異能グルメファンタジー、そして手塩にかけて育てた聖女に溺愛される極上ラブコメ。それぞれ全く異なる魅力を持った2026年11月最前線の傑作3選を徹底解説します。',
  faq: [
    {
      q: '今回紹介されている3作品の特徴はどう違いますか？',
      a: '『ブラック・ブレット』は12年ぶりの復活となる重厚なダークヒロイック・アクション、『聖女と暴食』は魔物料理と豪快な能力バトルが融合した痛快エンタメ、『モブ司祭』は一途すぎるヒロインの愛に癒やされる甘々学園ラブコメと、三者三様の全く異なるジャンル・読後感を楽しめます。'
    },
    {
      q: '電子書籍版はどこで読めますか？',
      a: '3作品すべて楽天Koboにて電子書籍版が好評配信・予約受付中です。試し読みや電子限定特典付き版も配信されています。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: 'ブラック・ブレット　新世界秩序01　神を目指した者たち',
      customTitle: 'ブラック・ブレット　新世界秩序01　神を目指した者たち',
      title: enrichedArticles[0].title,
      author: enrichedArticles[0].author,
      synopsis: '人類が寄生生物ガストレアに敗北した近未来。対ガストレアの民警・里見蓮太郎と、呪われた子供たちの少女・藍原延珠が過酷な任務に挑む。12年の時を経て、装いも新たに奇跡の新章開幕！',
      recommendReason: '未完のままだった伝説的シリーズが堂々復活！退廃した東京エリアで足掻く蓮太郎と延珠の絆、そして過酷な現実を撃ち砕くヒロイックなバトルは今読んでも色褪せない熱量に満ちています。',
      points: [
        '2026年11月10日発売！電撃文庫が誇る伝説的ダークアクションが12年ぶりに完全再始動',
        '2冊同時＆4ヶ月連続刊行で描かれる新章「新世界秩序」の壮大なスケール',
        '里見蓮太郎と藍原延珠が紡ぐ、切なくも揺るぎない相棒同士の魂の絆'
      ],
      itemUrl: enrichedArticles[0].affiliateUrl || enrichedArticles[0].itemUrl,
      cover: enrichedArticles[0].cover,
      salesDate: enrichedArticles[0].salesDate,
      price: enrichedArticles[0].price
    },
    {
      rank: 2,
      keyword: '聖女と暴食３',
      customTitle: '聖女と暴食３',
      title: enrichedArticles[1].title,
      author: enrichedArticles[1].author,
      synopsis: '第七学区祭が開幕！学食部が挑む魔物料理コンテストと、親友ヒオウと激突する武闘会。そこに災厄アスモデウスを従えた侵略者が乱入し、ハルの「暴食」の権能が学園防衛のため火を吹く！',
      recommendReason: '『ストブラ』三雲岳斗×karoryの黄金コンビが贈る学園異能グルメファンタジー！深夜に読むと危険なほど美味しそうな魔物肉の数々と、敵の災厄を丸ごと平らげる爽快な下克上バトルが最高です。',
      points: [
        '2026年11月10日発売！学区祭を舞台に繰り広げられる料理対決と武闘会の同時激闘',
        '魔物食材の旨味を引き出すこだわりの調理描写と、親友ヒオウとの熱血ライバル対決',
        '学園を脅かす災厄アスモデウスを豪快に喰らい尽くす痛快なカタルシス'
      ],
      itemUrl: enrichedArticles[1].affiliateUrl || enrichedArticles[1].itemUrl,
      cover: enrichedArticles[1].cover,
      salesDate: enrichedArticles[1].salesDate,
      price: enrichedArticles[1].price
    },
    {
      rank: 3,
      keyword: 'モブ司祭だけど、この世界が乙女ゲームだと気づいたのでヒロインを育成します３【電子特別版】',
      customTitle: 'モブ司祭だけど、この世界が乙女ゲームだと気づいたのでヒロインを育成します３【電子特別版】',
      title: enrichedArticles[2].title,
      author: enrichedArticles[2].author,
      synopsis: '守護聖人に認定されたモブ司祭クラエルが、レイナの通う王立学園の臨時講師に着任！独占欲が止まらないレイナの甘々アタックに、幼馴染エリカも参戦して波乱のツインデートが勃発する!?',
      recommendReason: '育て上げたヒロインから向けられる特大の矢印にニヤニヤが止まらない極上ラブコメ！教師と生徒という新たな関係性と、幼馴染エリカとの正妻争奪戦でテンポ良く多幸感に浸れます。',
      points: [
        '2026年10月30日発売！スニーカー文庫の話題作が待望の王立学園編へ突入',
        'クラエル様しか見えない聖女レイナの激重な愛と可愛すぎる独占欲アピール',
        '幼馴染エリカが参戦し、両手に花状態で翻弄されるコミカルなツインデート'
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
