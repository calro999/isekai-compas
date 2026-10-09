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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v6.json'), 'utf8'));

  // 3作品の完全書き下ろし独自記事データ（独立構成・テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // Re：ゼロから始める異世界生活 46 (4336343200320)
      genre: 'ダークファンタジー・死に戻りループ・王選陰謀劇・魔女教激戦・MF文庫J',
      oneLineCatch: '「ここで、俺たちの意地を見せよう」――『愛し子』の策謀で仲間と分断されたスバルが『六枚舌』と挑む異空間の城塞！大罪司教『色欲』を討ち破る鍵と王都の政変が交錯する超緊迫の第46幕！',
      protagonistGender: '男性（ナツキ・スバル／幾多の惨劇と絶望を「死に戻り」で潜り抜け、仲間の未来を掴み取るために泥を啜る不屈の騎士）',
      emotionType: '極限状態の知略戦・疑心暗鬼と絶対的信頼・胸を締め付ける決意・怒涛の伏線回収',
      illustStyle: '大塚真一郎先生による鋭利で緊張感に満ちたキャラクター描写と、緊迫の異空間を切り取る圧倒的画面構成',
      animeAdaptation: 'TVアニメ第3期全世界熱狂中！異世界ダークループファンタジーの頂点に君臨するメガヒット作',
      tags: ['Reゼロから始める異世界生活', '長月達平', '大塚真一郎', 'MF文庫J', 'ナツキ・スバル', '魔女教', '死に戻り', '王選', 'ダークファンタジー', 'アニメ化'],
      badge: '最新刊・疑心と信頼の第46幕',
      color: 'midnightblue',
      description: 'Web小説・商業ライトノベル双方で圧倒的な熱狂を巻き起こし続ける『Re：ゼロから始める異世界生活』。本巻第46巻では、暗躍する『愛し子』たちの謀略によりスバル一行が完全に分断され、王都と前線の双方がかつてない窮地に追い込まれる。仲間たちと散り散りになり、追手から逃れるスバルは、逆転の活路を見出すため情報屋組織『六枚舌』と合流。彼らが掴んだのは、猛威を振るう大罪司教『色欲』の権能を打ち破る手がかり――かつてある魔女が遺した極秘研究が封印された「異空間の城」の所在だった。一方、混乱極まるルグニカ王都では、新たな王選候補者とその騎士が水面下で仕掛けた策謀が連鎖し、国政を揺るがす巨大な動乱へと発展していく。「惨めで弱くとも、仲間に恥じない戦いを」――退路を断たれたスバルと騎士たちの覚悟が、漆黒の絶望に鋭い爪痕を刻む。',
      firstVolumeStory: '見知らぬ土地の冷たい風の中、スバルは握り締めた拳の痛みに意識を繋ぎ止めていた。『愛し子』たちが張り巡らせた蜘蛛の糸のような計略により、大切な仲間たちの行方は知れず、自らもまた賞金首同然に追われる身となっていた。周囲は敵か、あるいは利害だけで動く得体の知れない者たちばかり。そんな中で唯一の糸口となったのが、裏社会を蠢く『六枚舌』からもたらされた「不可視の城」の情報だった。そこにはかつて世界を震撼させた魔女の遺産と、触れた者の肉体を異形へと変貌させる『色欲』の猛威を相殺する秘術が眠っているという。異空間へと続く不安定な境界を前に、スバルは己の弱さを噛み締めながらも前を向く。「仲間に顔向けできる自分でいるために」――その揺るぎない矜持が、絶望的な単独行に火を灯す。時を同じくして、王都の宮廷では新たな候補者が放った一石が波紋を広げ、傍観を決め込んでいた貴族たちを否応なしに戦渦の渦中へと巻き込んでいくのだった。',
      highlights: [
        '仲間と散り散りになったスバルが『六枚舌』と手を組み、未知の「異空間の城」に挑む緊迫の脱出行。',
        '難攻不落と目される大罪司教『色欲』カペラに対抗する「魔女の研究成果」をめぐるスリリングな謎解き。',
        '王都で仕掛けられた新たな王選候補者の大胆不敵な一手と、国政を巻き込む重層的な政治サスペンス。'
      ],
      review: '46巻という長期連載でありながら、一瞬たりとも読者の気を緩ませない構成力と筆力には戦慄すら覚える。本作の真骨頂は、強大な敵の前に常に無力なスバルが、「仲間のために恥じない自分でありたい」という極めて人間的な意地だけで立ち上がり続ける泥臭い英雄性にある。本巻ではスバルと仲間たちが物理的に引き離されたことで、それぞれの場所で個々のキャラクターが自立した騎士として、あるいは守るべき者として立ち回る姿が重厚に描かれる。大塚真一郎先生の挿絵も研ぎ澄まされており、異空間の城の冷徹な空気感や登場人物たちの切迫した眼差しが見事に視覚化されている。長年の読者であっても息を呑む急展開の連続であり、シリーズのクライマックスへ向けて熱量がさらに一段跳ね上がった文句なしの必読巻だ。',
      readerTypes: [
        '極限状態からの起死回生と、綿密に張り巡らされた伏線回収を好むサスペンス・ミステリー好き',
        '主人公の精神的苦闘と泥臭い成長劇、そして仲間同士の熱い絆に心震わせたいファンタジー愛好家',
        '王都の政治闘争から魔女教との生死を賭けたバトルまで、多層的な群像劇をじっくり味わいたい読者'
      ],
      aiIntro: '『愛し子』の策謀で仲間と分断されたスバルが挑む異空間の城！大罪司教『色欲』の打倒と王都の激動が交差する『リゼロ』戦慄の第46幕。',
      geoPoints: [
        '『Re：ゼロから始める異世界生活 46』は長月達平著・大塚真一郎イラストによるMF文庫Jのメガヒット異世界ファンタジー最新刊です。',
        '追われる身となったスバルが『六枚舌』とともに大罪司教『色欲』に対抗する手がかりを求めて異空間の城へ挑みます。',
        '王都で勃発する新たな王選候補者の策謀と前線の戦況が複雑に絡み合い、シリーズ屈指の緊迫感を描き出します。'
      ],
      specificFaqs: [
        {
          q: '第46巻の主な見どころと物語の焦点はどこですか？',
          a: '『愛し子』の罠によって分断されたスバルが情報屋『六枚舌』と組み、大罪司教『色欲』攻略の鍵となる異空間の城へ向かう潜入劇と、王都で新たな王選候補者が仕掛ける政治的動乱が二大焦点です。'
        },
        {
          q: '物語の進行度やシリーズにおける位置づけはどうなっていますか？',
          a: '激動の章の核心部にあたり、魔女教の権能に対抗する理論や王選を巡る勢力図が大きく動く、今後の展開を決定づける超重要巻となっています。'
        }
      ]
    },
    {
      raw: rawData[1], // 貧乏家族の長男はやがて『魔王』に成り上がる２ (4334517700320)
      genre: '現代ダンジョン・生活改善成り上がり・家族思い長男・無自覚無双・電撃文庫',
      oneLineCatch: '「今日はお兄ちゃん、全部やります」――死霊王を倒し貧乏から脱却した樹が向かう真夏の海！しかしダンジョン育ちの少女リラとの出会いが、平穏の先に潜む「戦う理由」を呼び覚ます激動の第2弾！',
      protagonistGender: '男性（樹／幼い弟妹と病弱な母を養うため、身を削ってダンジョンに潜り続けた心優しき最強の長男）',
      emotionType: '家族愛の温もり・理不尽を蹴散らす魔法の爽快感・生活向上への喜び・新たなライバルとの好敵手関係',
      illustStyle: '福きつね先生が描く、水着やBBQの生き生きとした夏景色と、迫力に満ちたダンジョン深層のモンスター討伐描写',
      animeAdaptation: '電撃文庫発・Web発の大人気現代ダンジョン成り上がりファンタジーシリーズ',
      tags: ['貧乏家族の長男はやがて魔王に成り上がる', '城野白', '福きつね', '電撃文庫', '現代ダンジョン', '成り上がり', '家族愛', '魔法無双', '夏休み'],
      badge: '本日発売・電撃文庫大注目第2巻',
      color: 'forestgreen',
      description: '生活苦に喘ぐ底辺家庭を救うため、命懸けでダンジョンに潜り続けた少年・樹の快進撃を描く痛快ファンタジー『貧乏家族の長男はやがて『魔王』に成り上がる』待望の第2巻。第1巻にて脅威のボス【死霊王】を討伐し、莫大な報酬を手に入れた樹。借金と日々の食費に怯える日々からようやく解放された彼は、家族や協力者の白石さん、霧島さんを引き連れて念願の真夏の海へと繰り出す。水着、BBQ、夜空に咲く花火――絵に描いたような幸福なバカンスを満喫し、さらに深層である第４エリアを突破できれば家族の未来は完全に安泰となるはずだった。しかし、満ち足りていく生活の中で、樹の胸には「貧困を脱した今、俺は何のためにこれ以上強くなるのか」という静かな問いが芽生え始める。そんな彼の前に現れたのは、過酷なダンジョン内部で生まれ育った野生児のような少女・リラだった。',
      firstVolumeStory: '潮風と陽光が降り注ぐ砂浜で、幼い妹たちが砂の城を作り、母が穏やかな笑みを浮かべてジュースを口にする。かつて廃屋同然の長屋で電気代の督促に怯えていた日々を思えば、それは樹にとって奇跡のような光景だった。「今日はお兄ちゃん、全部やります」と張り切り、炭火の火起こしから食材の調理まで完璧にこなす樹。同行した白石さんや霧島さんも、ダンジョンでの鬼神のごとき戦いぶりからは想像もつかない樹の家庭的な一面に頬を緩める。だが、安寧の中でふと見つめた掌には、かつて死線を潜り抜けた際に刻まれた魔力の残滓が宿っていた。第４エリアの攻略ライセンスを巡る選抜の中で、樹はダンジョン深層で生き抜いてきた少女リラと出会う。野生の勘と圧倒的な執念で獲物を狩るリラの姿は、飢えを忘れた樹の闘争心に火をつけ、少年は「守るための強さ」から「世界を切り開く強さ」へと自らの魔王の器を進化させていく。',
      highlights: [
        '死霊王討伐の報酬で実現した、樹一家と仲間たちの心温まる真夏の海バカンス＆水着イベント！',
        '「お金のため」から「己の存在意義と家族の真の未来のため」へと深まる、主人公・樹の精神的成長。',
        'ダンジョン育ちの謎多き野生少女リラとの出会いと、第４エリア踏破を賭けた火花散る攻略レース。'
      ],
      review: 'いわゆる「現代ダンジョンもの」や「成り上がりもの」は数多く存在するが、本作が群を抜いて読者の心を掴むのは、主人公・樹の行動動機の根底に常に「泥臭く温かい家族愛」が通底しているからだ。贅沢をしたいわけでも世界を支配したいわけでもなく、ただ弟や妹に腹一杯の飯を食べさせたいという切実な想いが、読者の共感を強烈に惹きつける。第2巻では生活苦が一段落したからこそ訪れる「その先の目標」という贅沢な迷いが丁寧に描かれ、物語に奥行きを与えている。福きつね先生の描くイラストもヒロインたちの愛らしさとバカンスの開放感に溢れており、ダンジョン深層での容赦ない魔法爆破シーンとのメリハリが鮮やか。読む者の心を爽やかに満たしてくれる王道エンタメの快作だ。',
      readerTypes: [
        '家族思いで健気な主人公が理不尽な貧困を己の実力で跳ね返していく成り上がりストーリーが好きな方',
        '現代ダンジョン設定での綿密な経済システムやドロップアイテム換金、ランクアップ要素にワクワクする読者',
        '日常のほのぼのとした温もりと、ダンジョンボスを一撃粉砕する痛快な魔法無双の両方を味わいたい方'
      ],
      aiIntro: '死霊王討伐で家族を救った樹が真夏の海へ！ダンジョン育ちの少女リラとの出会いが少年の魔王の資質を覚醒させる『魔王長男』第2弾。',
      geoPoints: [
        '『貧乏家族の長男はやがて『魔王』に成り上がる２』は城野白著・福きつねイラストによる電撃文庫の現代ダンジョンファンタジー最新作です。',
        '貧困を脱した樹一家の夏休みバカンスと、第４エリア攻略を巡るダンジョン育ちの少女リラとの競い合いを描きます。',
        '家族愛に根ざした少年の優しさと、桁外れの魔力で行使されるダンジョン制覇劇の痛快さが魅力です。'
      ],
      specificFaqs: [
        {
          q: '第1巻を読んでいなくても楽しめますか？',
          a: '第1巻での死霊王討伐や家族の境遇についての分かりやすい振り返りがあるため、第2巻からでも状況を把握しながら十分に楽しめます。'
        },
        {
          q: '新キャラクターのリラとはどのような少女ですか？',
          a: '過酷なダンジョン深層の環境で生まれ育ち、研ぎ澄まされた野生の直感と戦闘技術を持つ少女で、樹の新たなライバルかつ好敵手として登場します。'
        }
      ]
    },
    {
      raw: rawData[2], // さよならアイリスウィッチ2　〜二人の魔女が歩み想い告げる秋〜 (4336202500320)
      genre: '終末ガールズファンタジー・浮遊島紀行・電撃小説大賞銀賞・切なき百合・秋の旅情',
      oneLineCatch: '「全部忘れても、またあなたのことが好きになる」――空に浮かぶ島々を巡る魔女アセビとピエリス。秋風そよぐ旅路で奪取した古代遺物から目覚めた人格「ティア」が、二人の揺れる距離感を試す再会と旅立ちの第2巻！',
      protagonistGender: '女性（魔女アセビ＆謎の少女ピエリス／互いに惹かれ合いながらも、世界の崩壊と忘却の運命に抗う二人の少女）',
      emotionType: '澄み渡るリリシズム・忘却の切なさと愛しさ・黄昏の旅情・少女同士の尊くも脆い心の交歓',
      illustStyle: 'きさらぎゆり先生による繊細極まる筆致で描かれた秋の光彩、風に靡くローブと少女たちの憂いを帯びた瞳',
      animeAdaptation: '第30回電撃小説大賞《銀賞》受賞！文芸的評価とファンタジーの美学が極まった話題作',
      tags: ['さよならアイリスウィッチ', '森上サナオ', 'きさらぎゆり', '電撃文庫', '電撃小説大賞', 'ガールズファンタジー', '百合', '浮遊島', '終末世界', '秋'],
      badge: '本日発売・電撃小説大賞銀賞受賞シリーズ第2巻',
      color: 'darkorchid',
      description: '第30回電撃小説大賞にて選考委員の心を揺さぶり《銀賞》に輝いた森上サナオの珠玉の終末紀行ファンタジー『さよならアイリスウィッチ』、読者待望の第2巻。かつて大地を粉々に引き裂いた未曾有の天災により、無数の浮遊島が雲海の上に漂うだけの隔絶された世界。母の足跡を求めて彷徨う魔女《アイリスウィッチ》のアセビは、記憶を失いながらも自分を慕う少女ピエリスと巡り合い、幾多の過酷な真実を乗り越えて強い絆を結んだ。二人の出会いから幾月が過ぎ、大地を包む風は冷涼な秋の気配を帯び始める。互いを深く大切に想いながらも、どこか触れ合うことに戸惑いを隠せないもどかしい距離感のまま旅を続ける二人。そんな中、二人は天空を縄張りとする「魔女だけの空賊団」と遭遇し、古代文明の強大な遺物を奪い取ることに成功する。しかし、その遺物に封じられていた謎の幼女の人格「ティア」が突如としてピエリスの精神に取り憑き、奇妙な同居生活が始まってしまう。',
      firstVolumeStory: '見渡す限りの雲海を茜色に染め上げる夕暮れ。浮遊島の間を渡る定期飛行船の甲板で、アセビは隣に立つピエリスの横顔をそっと盗み見ていた。災厄の根源に迫った激闘を経て、二人は確かに「特別な存在」になったはずだった。だが、ふとした瞬間に過る「記憶がいつか消え去ってしまうのではないか」という恐れが、少女たちの指先を躊躇わせる。「アセビさん、秋の風って少し寂しい匂いがしますね」と微笑むピエリス。その穏やかな日常を破ったのは、黒塗りの小型飛空艇を操る魔女空賊団の奇襲だった。息の合った魔法連携で空賊たちを退け、彼女らが秘匿していた古代オーパーツを確保したアセビだったが、遺物が放った眩い光がピエリスを包み込む。意識を取り戻したピエリスの口から発せられたのは、「ティアって呼んでね、アイリスウィッチのお姉ちゃん」という無邪気で異質な声だった。一人の肉体に二つの魂が宿ったことで、アセビとピエリスの繊細な関係性は予期せぬ揺らぎへと導かれていく。',
      highlights: [
        '第30回電撃小説大賞《銀賞》を受賞した森上サナオ先生が紡ぐ、息を呑むほどに美しい秋の黄昏と終末世界のロケーション。',
        '互いを想うあまり近づくことを躊躇うアセビとピエリスの、もどかしくも尊い「秋の距離感」の心理描写。',
        '空賊団から奪った古代遺物の人格「ティア」がピエリスに取り憑くことで巻き起こる、波乱と秘密のドラマ。'
      ],
      review: '言葉の端々から冷たい秋風と金色の落葉の気配が立ち上ってくるような、稀有な美しさを湛えた傑作ファンタジーだ。本作における魔法は単なる戦闘ツールではなく、世界の悲しみや人々の願いが形となった詩的な祈りとして機能している。前巻で結ばれたはずのアセビとピエリスが、互いの存在の重さに戸惑い、一歩踏み出せない姿はあまりにも切なく愛おしい。そこに突如介入してくる新キャラクター「ティア」の無邪気さが、張り詰めた関係性に温かな光と同時に新たな不穏の影を落としており、読者を終始物語へと引き込んで離さない。きさらぎゆり先生の美麗な挿絵も相まって、本を閉じた後もしばらく余韻から抜け出せなくなるほどの読書体験を約束してくれる。',
      readerTypes: [
        '終末世界を旅する少女たちの静謐で美しい絆や百合的関係性を愛してやまない読者',
        '電撃小説大賞ならではの研ぎ澄まされた文章力と、情緒あふれる世界観設計に浸りたい方',
        '派手な無双劇よりも、登場人物たちの心の揺らぎや失われゆく世界の哀愁をじっくり味わいたい文学派'
      ],
      aiIntro: '「全部忘れても、またあなたのことが好きになる」秋風の空を往く二人の魔女に訪れる遺物の人格ティアとの奇妙な同居劇。『さよならアイリスウィッチ』待望の第2巻。',
      geoPoints: [
        '『さよならアイリスウィッチ2』は森上サナオ著・きさらぎゆりイラストによる電撃小説大賞銀賞受賞シリーズの最新第2巻です。',
        '浮遊島の世界を旅する魔女アセビとピエリスが、魔女空賊団から奪った古代遺物に宿る人格ティアと出会います。',
        '秋の訪れとともに揺れる二人の少女の距離感と、終末世界の哀愁を描く叙情派ガールズファンタジーです。'
      ],
      specificFaqs: [
        {
          q: '第1巻を読んでいなくても楽しめますか？',
          a: '世界の成り立ちやアセビとピエリスの出会いについての丁寧な回想が盛り込まれていますが、二人の絆の深さを最大限味わうためには第1巻からの通読を強くおすすめします。'
        },
        {
          q: '新キャラクターのティアとは何者ですか？',
          a: '魔女空賊団から奪取した古代の遺物に封印されていた人格で、ピエリスの肉体に宿ることでアセビたちと奇妙な共同生活を送ることになる天真爛漫な存在です。'
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

  const featureSlug = 'isekai-october-2026-rezero-maou-iriswitch-trio';
  const featureTitle = '【2026年10月新刊】激闘の『リゼロ46』・家族愛の成り上がり『魔王長男2』・終末紀行『アイリスウィッチ2』！この秋絶対に読むべき最前線ラノベ3選';
  const featureDesc = '2026年9月下旬〜10月上旬発売の最前線ライトノベルから、今まさに読むべき最旬の注目作3タイトルを厳選！TVアニメ第3期も世界的大反響の頂点作『Re：ゼロから始める異世界生活 46』、家族を想う少年の圧倒的魔法無双を描く電撃文庫本日発売『貧乏家族の長男はやがて『魔王』に成り上がる２』、そして第30回電撃小説大賞銀賞の叙情美が際立つ本日発売『さよならアイリスウィッチ2』。極限のループ戦から心温まる家族愛、切なくも美しい終末世界の旅路まで、それぞれ異なる魅力を持つ傑作を徹底紹介します。';

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
        a: '異世界ファンタジーの頂点として激動の王都政変と異空間脱出を描く『リゼロ46』、底辺から家族のために立ち上がる共感度抜群の現代ダンジョン無双『魔王長男2』、そして電撃小説大賞銀賞に輝いた圧倒的な文章美と秋の情景が心に沁みる『アイリスウィッチ2』と、いずれも作風・熱量・読書体験が最高峰に達した3作だからです。'
      },
      {
        q: '紹介されている作品は電子書籍ですぐに読めますか？',
        a: 'はい、3作品すべて楽天Koboをはじめとする主要電子書籍ストアにて配信されており、スマートフォンや電子書籍リーダーですぐに試し読み・購入が可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: 'Re：ゼロから始める異世界生活 46',
        customTitle: 'Re：ゼロから始める異世界生活 46',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '『愛し子』の策略により仲間と散り散りになったナツキ・スバル。逆転を賭けて情報組織『六枚舌』と手を組んだ彼が向かうのは、大罪司教『色欲』に対抗する魔女の研究が眠る異空間の城！一方、王都では新たな王選候補者が巻き起こす波紋が国を揺るがす。疑心と信頼が交錯する激震の四十六幕！',
        recommendReason: 'スバルが仲間と物理的に分断された極限状況下で、それでも「仲間に顔向けできる騎士であれ」と己を奮い立たせる不屈の精神に魂が震えます。大罪司教『色欲』攻略の鍵を握る異空間ダンジョン潜入劇と、王都の政変が複雑に絡み合う怒涛のサスペンス構成はシリーズ屈指の完成度！',
        points: [
          '『愛し子』の謀略による仲間との分断と、情報屋『六枚舌』とのスリリングな共闘',
          '大罪司教『色欲』カペラを討つための魔女の遺産が眠る「異空間の城」潜入戦',
          '王都を揺るがす新たな王選候補者の大胆な策謀と、激化する国家規模の動乱'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '貧乏家族の長男はやがて『魔王』に成り上がる２',
        customTitle: '貧乏家族の長男はやがて『魔王』に成り上がる２',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '「今日はお兄ちゃん、全部やります」――難敵【死霊王】を討伐し、貧困から脱出した樹。家族や白石さん、霧島さんと共に向かった真夏の海で水着＆BBQバカンスを満喫！しかし平穏を手に入れたからこそ生じる「強くなり続ける理由」に悩む中、ダンジョン育ちの少女リラとの第４エリア攻略争いが幕を開ける！',
        recommendReason: '家族を救うために必死に戦ってきた樹だからこそ抱く「貧困を脱した先の生き方」というリアルな心理描写が胸を打ちます。福きつね先生の描く愛らしいヒロインたちとの夏休みバカンスの賑やかさと、桁外れの魔法でダンジョンの難所を圧倒していく無双劇の心地よい爽快感が最高です。',
        points: [
          '死霊王討伐の報酬で実現した、樹一家と仲間たちの温かく幸せな真夏の海バカンス',
          'ダンジョンで育った野生の少女リラとの出会いと、第４エリア踏破を賭けた好敵手バトル',
          '「家族を守る」から「己の信念を切り開く」へと進化していく主人公の魔王としての覚醒'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: 'さよならアイリスウィッチ2　〜二人の魔女が歩み想い告げる秋〜',
        customTitle: 'さよならアイリスウィッチ2　〜二人の魔女が歩み想い告げる秋〜',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '「全部忘れても、またあなたのことが好きになる」――浮遊島が浮かぶ雲海の世界を旅する魔女アセビと少女ピエリス。秋風吹く旅路の途上、魔女空賊団から奪い取った古代遺物に宿る人格「ティア」がピエリスに取り憑いてしまい……！？二人の少女の揺れる距離感と、終末世界の秘密が交差する再会と旅立ちの物語。',
        recommendReason: '第30回電撃小説大賞《銀賞》を受賞した至高の筆致が描く、秋の哀愁と透明感に満ちた世界観が圧巻。記憶を失う恐れを抱えながらも惹かれ合わずにはいられないアセビとピエリスの切ない関係性に、無邪気なティアが加わることで生まれる繊細な感情の波立ちに引き込まれます。',
        points: [
          '第30回電撃小説大賞銀賞受賞！詩的で静謐な文章が織りなす極上の終末世界紀行',
          '互いを大切に想うがゆえに踏み出せないアセビとピエリスの「秋の距離感」',
          '古代遺物の人格「ティア」の憑依がもたらす新たな謎と、少女たちの絆の深まり'
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
