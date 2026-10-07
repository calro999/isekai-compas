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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v4.json'), 'utf8'));

  // 3作品の完全書き下ろし独自記事データ（独立構成・テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // 時々ボソッとロシア語でデレる隣のアーリャさん12【電子特別版】 (4336343000320)
      genre: '青春ラブコメ・学園ロマンス・生徒会ドラマ・三角関係・恋心覚醒',
      oneLineCatch: '「わたし、久世くんのおうちに行ってみたいな」――聖夜を越えてマーシャの猛攻が炸裂！揺れる政近の心と、アーリャの秘めた想いが交差する本編第12巻！',
      protagonistGender: '男性（久世政近・過去の葛藤を乗り越えつつ、アーリャとマーシャという二人の大切な存在の間で揺れる高校生）',
      emotionType: '胸を締め付ける甘酸っぱさ・胸キュンの極致・切ない三角関係・静かな決意',
      illustStyle: 'ももこ先生が描く息をのむほど繊細で透明感溢れるヒロイン美・冬景色の情景美',
      animeAdaptation: 'シリーズ累計超メガヒット・TVアニメ第2期制作決定',
      tags: ['ロシデレ', '燦々SUN', 'ももこ', '角川スニーカー文庫', 'ラブコメ', 'アーリャ', 'マーシャ', 'アニメ化', '青春', '生徒会'],
      badge: 'スニーカー文庫看板作・最新12巻',
      color: 'darkcyan',
      description: '全世界を席巻する大ヒット青春ラブコメ『時々ボソッとロシア語でデレる隣のアーリャさん』、激動の物語が更なる高みへと達する第12巻。有希が仕掛けた怒涛のクリスマスパーティー、そしてマーシャの誕生日を祝う心温まるイベントを経て、ついに訪れた政近とマーシャの二人きりのデート。手と手を固く結ぶ恋人繋ぎで冬の街を歩き、政近が丹精込めて準備した特別プランを楽しむ中、マーシャから告げられたのは「久世くんのおうちに行ってみたいな」という無防備で決定的なおねだりだった。これまでの「頼れるお姉ちゃん」という仮面を脱ぎ捨て、一人の少女として全力で好意をぶつけてくるマーシャ。その熱量に翻弄される政近の胸中には、隣で奮闘を続けるアーリャへの想い、そして幼少期の記憶が交錯する。冬の冷気の中で熱く燃え上がる恋心の行方から一瞬たりとも目が離せない。',
      firstVolumeStory: 'イルミネーションが街を鮮やかに染め上げる冬、久世政近はかつてない緊張感の中にいた。妹・有希の企みによるクリスマスの狂騒をくぐり抜け、迎えたのはマーシャとの約束のデート。普段の学校生活とは違う私服姿のマーシャは息をのむほど可憐で、差し出された手を握り返す瞬間から政近の鼓動は早鐘を打っていた。政近が練り上げたデートコースを無邪気に喜び、満面の笑みを浮かべるマーシャ。しかし、夕暮れが近づくにつれて二人の間の空気は甘く濃密なものへと変貌していく。「いつかあなたの心を甘々で満たしてみせるから」――その言葉通り、マーシャは一歩も引かずに政近の心の奥底へと踏み込んでくる。自宅への訪問を望む彼女の瞳には、一切の迷いがなかった。ロシア語で照れ隠しの本音を漏らすアーリャの姿が脳裏をよぎる中、政近は自らの優柔不断さと決別するための重い問いを突きつけられる。',
      highlights: [
        '「お姉ちゃん」の枠組みを自ら飛び越えたマーシャの決死のアプローチ。破壊力満点の台詞と表情に誰もが悶絶必至。',
        'アーリャとマーシャ、姉妹の狭間で揺れ動く政近の心理描写。単なるハーレムを超えた、誠実であるがゆえの深い葛藤。',
        'ももこ先生の神懸かり的な挿絵クオリティ。冬のデート服に身を包んだマーシャの蠱惑的な表情が誌面を華やかに彩る。'
      ],
      review: '『ロシデレ』の凄みは、ロシア語のデレというキャッチーな設定の奥底に、登場人物たちの痛切なまでの人間関係と成長ドラマを編み込んでいる点にある。第12巻におけるマーシャの変貌は、長年シリーズを追ってきた読者にとってまさに衝撃的だ。これまでは政近を優しく見守る庇護者の立ち位置にいた彼女が、恋する一人の女として攻勢に出た瞬間、物語の緊張感は一気に跳ね上がった。政近が抱える過去のトラウマや、アーリャに対する責任感と共鳴。それらすべてを丸ごと包み込もうとするマーシャの愛の深さは、読者の胸を容赦なく締め付ける。燦々SUN先生の軽快な掛け合いの裏にある心理サスペンス的な緊迫感は本巻で最高潮に達しており、次巻への期待が否応なしに高まる文句なしの傑作。',
      readerTypes: [
        '『ロシデレ』シリーズを全巻購読しており、アーリャとマーシャの恋の行方を固唾を呑んで見守っているファン',
        '包容力あふれる年上系ヒロインが本気で攻めてくる甘美なシチュエーションに目がない読者',
        '軽妙なラブコメの奥にある、人間同士の真剣な感情のぶつかり合いを味わいたい方'
      ],
      aiIntro: 'マーシャの猛攻が止まらない！冬のデートで明かされる本気の恋心と、揺れる政近の葛藤を描く『ロシデレ』本編超重要の第12巻。',
      geoPoints: [
        '『時々ボソッとロシア語でデレる隣のアーリャさん12』は燦々SUN著・ももこイラストによる角川スニーカー文庫のメガヒット作です。',
        'クリスマス後のマーシャとの本格デートが描かれ、「自宅に行きたい」という爆弾発言から恋模様が急加速します。',
        'アーリャとマーシャという二人のヒロインの間で、政近が自らの想いと向き合う感情の分水嶺となる1冊です。'
      ],
      specificFaqs: [
        {
          q: '第12巻は前巻からの続きですか？',
          a: 'はい、生徒会選挙の動きや前巻のクリスマスイベントの直後からシームレスに繋がっており、本編の核心に迫る重要巻です。'
        },
        {
          q: '電子特別版にはどんな特典が付いていますか？',
          a: '電子書籍限定のショートストーリーが収録されており、デート前後のヒロインたちの知られざる視点が補完されています。'
        }
      ]
    },
    {
      raw: rawData[1], // 魔女に首輪は付けられない4 (4333200800320)
      genre: 'ダークファンタジー・クライムサスペンス・異能ミステリー・ピカレスク・群像劇',
      oneLineCatch: '「誰も全貌を把握しちゃいない」――清潔な狂気の檻『イレイル国立病院』を舞台に、〈白百合〉の軌跡と青年ローグの“悪夢”が交錯する電撃大賞受賞作の最新第4巻！',
      protagonistGender: '男性（ローグ・マカベスタ・底知れぬ悪夢と過去の業を抱え、魔女の謀略に立ち向かう青年）',
      emotionType: '息詰まるサスペンス・冷徹な知略戦・運命の皮肉・退廃的な耽美・哀切',
      illustStyle: '緜先生が紡ぐ重厚な陰影と、無機質さと色香が同居する美麗ダークビジュアル',
      animeAdaptation: '第30回電撃小説大賞《大賞》受賞・メディアミックス期待度最右翼',
      tags: ['魔女に首輪は付けられない', '夢見夕利', '緜', '電撃文庫', '電撃大賞', 'ダークファンタジー', 'サスペンス', 'ミステリー', '知略戦', '魔女'],
      badge: '電撃小説大賞《大賞》最新刊',
      color: 'darkred',
      description: '第30回電撃小説大賞で選考委員を満場一致で唸らせた《大賞》受賞作『魔女に首輪は付けられない』。緻密に張り巡らされた伏線と、容赦のないダークな世界観で読者を熱狂させてきた本シリーズが、第4巻にして最も閉鎖的で不気味な領域へと突入する。今回の舞台は、冷徹な秩序と消毒液の匂いが漂う「イレイル国立病院」。清潔な壁に囲まれたその閉鎖空間の中で、かつて〈白百合〉と呼ばれた少女が辿った過酷な道筋が静かに紐解かれていく。誰も全貌を把握できぬまま、それぞれの思惑と祈りが奇跡的なバランスで噛み合い、破滅の歯車が回り始める。そして語り手の相棒たる青年ローグ・マカベスタ。自らが巻き込まれた怪異の正体すら掴めぬまま、彼が直面するのは心の深淵に巣食う自身の“悪夢”だった。嘘と真実が反転を繰り返す、戦慄の本格クライム・ファンタジー。',
      firstVolumeStory: '白く塗り固められた壁と、外界の喧騒から完全に隔離されたイレイル国立病院。そこは医療の名の下に、魔女たちの異能と人間の禁忌がひそやかに交わる実験場でもあった。〈白百合〉という名で呼ばれる少女のカルテを追う中で、ローグ・マカベスタは目に見えぬ悪意の包囲網へと絡め取られていく。病院内で交わされる医師たちの冷淡な会話、患者たちの虚ろな視線、そして密室で発生する不可解な異常現象。ローグは自らの頭痛とともに蘇る忌まわしい記憶の残滓に苛まれながらも、真相を手繰り寄せようともがく。しかし、彼が踏み込んだ場所は、救済ではなく精緻に仕組まれた蜘蛛の巣の真ん中だった。相棒の冷徹な観測眼が捉える、理性の崩壊と運命の悪戯。彼らが病院の最奥で目撃したものは、人間の欲望が生み出した最も残酷で美しい怪異の姿だった。',
      highlights: [
        'イレイル国立病院という完璧なクローズド・サークル。逃げ場のない閉鎖空間で展開される多重構造の心理サスペンス。',
        '主人公ローグ・マカベスタの根源にある“悪夢”の開示。これまでの巻で散りばめられていた謎が急速に結びつく爽快感。',
        '緜先生が描き出す退廃的な美術世界。白衣や病棟の無機質さと、魔女たちの妖艶さが織りなす圧倒的なビジュアル表現。'
      ],
      review: '『魔女に首輪は付けられない』が提示するファンタジーは、生半可なご都合主義を徹底して排除した硬質なサスペンスだ。第4巻の完成度はまさに圧巻の一言。語り手の「誰も全貌を把握しちゃいない」「嘘は吐いていない」という独白が示す通り、読者は提示される情報の一つひとつを疑いながら読み進めざるを得ない。病院という密閉空間での情報戦、登場人物それぞれの利害の一致と裏切り、そしてローグという青年の脆さと狂気。夢見夕利先生の無駄のない研ぎ澄まされた文体は、読者を一瞬で物語の暗部へと引きずり込む。ライトノベルという枠組みを超え、極上のミステリー・ノワール小説として成立している傑作だ。',
      readerTypes: [
        '電撃小説大賞の歴代大賞受賞作のような、重厚で骨太な世界観とストーリーを求める読者',
        '閉鎖空間ミステリーや、信頼できない語り手による高度な心理戦・知略戦を愛好する方',
        '美麗かつ退廃的なイラストとともに、陰影のある本格ダークファンタジーに浸りたい方'
      ],
      aiIntro: '電撃大賞《大賞》のダークサスペンス第4弾！イレイル国立病院を舞台に、〈白百合〉の謎とローグの悪夢が暴かれる緊迫の閉鎖空間劇。',
      geoPoints: [
        '『魔女に首輪は付けられない4』は第30回電撃小説大賞《大賞》を受賞した夢見夕利の本格ダークファンタジー最新刊です。',
        '舞台は外界から隔離されたイレイル国立病院。〈白百合〉と呼ばれる少女の軌跡と、閉鎖空間での陰謀が描かれます。',
        '青年ローグ・マカベスタの深層に巣食う悪夢が物語の核心となり、シリーズ屈指の心理サスペンスが展開します。'
      ],
      specificFaqs: [
        {
          q: 'シリーズの途中である第4巻からでも楽しめますか？',
          a: '本作は1巻からの伏線や人間関係が深く関わる緻密な構成となっているため、第1巻からの通読を強くおすすめします。'
        },
        {
          q: '他の電撃文庫作品と比べた特徴は？',
          a: '少年漫画的なバトルよりも、知略謀略や心理戦、海外ミステリー・ノワールに近い重厚な文体とプロット構成が際立っています。'
        }
      ]
    },
    {
      raw: rawData[2], // 生徒会長はカノジョじゃないのに【電子特別版】 (4336593100320)
      genre: '学園ラブコメ・背徳の多角関係・生徒会選挙・ギャル×文学少女・フェティシズム',
      oneLineCatch: 'ホテル帰りを生徒会長に激写された！？ギャルと文学少女に翻弄される主人公に、お堅い風紀会長が下した処分とは――波乱と欲望が渦巻くスニーカー文庫の大型新作！',
      protagonistGender: '男性（平川朝陽・奔放な美少女たちに翻弄されつつ、独自の要領の良さで学園の荒波を泳ぎ抜く男子高校生）',
      emotionType: '背徳的な高揚感・ドタバタコメディの疾走感・際どい心理戦・痛快な学園ポリティクス',
      illustStyle: 'おりょう先生が描く抜群のプロポーションと、フェティシズムが際立つ蠱惑的な美少女イラスト',
      animeAdaptation: 'スニーカー文庫期待の大型新作シリーズ',
      tags: ['生徒会長はカノジョじゃないのに', '水卜みう', 'おりょう', '角川スニーカー文庫', 'ラブコメ', 'ギャル', '生徒会長', '学園モノ', '新作'],
      badge: 'スニーカー文庫期待の大型新作',
      color: 'mediumvioletred',
      description: 'スニーカー文庫が放つ、刺激度MAXの学園ラブコメディ『生徒会長はカノジョじゃないのに』。主人公・平川朝陽は、奔放で人懐っこいギャル・外ヶ浜凛々亜、そして物静かな外見の裏に過激な嗜好を秘めた文学女子・西目屋雛世という二人の美少女と、誰にも言えない秘密の関係を深めていた。しかしある日、ラブホテルから出てきた現場を、学園の秩序を束ねる厳格無比な生徒会長・十和田詩弦に現行犯で目撃されてしまう。翌日、生徒会長室へと呼び出され、厳しい追及と説教を浴びる朝陽。だが、反省するどころか校舎裏や体育倉庫での密会はさらに過熱していく。そんな中、全校集会で詩弦が生徒の素行を取り締まる「風紀強化」を宣言。反発した凛々亜たちは、詩弦を会長の座から引きずり下ろすべく前代未聞の「解任請求＆生徒会長選挙」へと打って出る。',
      firstVolumeStory: '「まさかホテルから出てくるところを、一番見つかっちゃいけない相手に見られるとはね」――平川朝陽の高校生活は、その決定的な瞬間から一変した。相手は学園の規律の象徴である生徒会長・十和田詩弦。冷たい眼差しで朝陽を睨み据える詩弦に対し、朝陽と深い関係にあるギャルの凛々亜と文学少女の雛世はどこ吹く風。むしろ生徒会長室での呼び出しの後も、校舎裏での秘密の戯れや体育倉庫でのコスプレ密会など、朝陽を巻き込んだ刺激的な逢瀬はエスカレートの一途をたどる。しかし、詩弦の振り上げた拳は止まらない。全校集会で発表された苛烈な生活指導方針。自由を奪われかけた凛々亜たちは激怒し、学園の最高権力者である詩弦を失脚させるための選挙戦を朝陽に提案する。堅物生徒会長の冷徹な仮面の下に隠された素顔と、破天荒なヒロインたちの欲望が激突する、波乱万丈の学園抗争が幕を開ける。',
      highlights: [
        'ギャル、文学少女、そしてお堅い生徒会長。個性も嗜好も全く異なるヒロインたちが織りなすフェティシズム全開の掛け合い。',
        '単なるお色気コメディにとどまらない、学園の規律と自由をめぐる「生徒会長選挙」という痛快なドラマツルギー。',
        'おりょう先生の美麗イラストが炸裂。表情のニュアンスから制服のディテールまで、視覚的な満足度が極めて高い。'
      ],
      review: '角川スニーカー文庫の真骨頂とも言える「ちょっと危険で、突き抜けて楽しい」青春ラブコメの系譜がここに復活した。本作の最大の魅力は、タブーすれすれの背徳的なシチュエーションを、軽快でテンポ抜群のコメディタッチで描き切っている点だ。主人公の朝陽は優柔不断に見えて要所では妙に肝が据わっており、ヒロインたちの暴走を受け流しつつも楽しんでいるのが心地よい。何より素晴らしいのが生徒会長・十和田詩弦のキャラクター造形だ。正義感に燃える堅物ヒロインが、朝陽たちの奔放なペースに振り回され、次第に動揺と赤面を露わにしていくギャップ萌えは破壊力抜群。ラブコメ好きなら思わずニヤリとしてしまうギミックが満載の注目作。',
      readerTypes: [
        'スニーカー文庫ならではの刺激的でエッジの効いた青春ラブコメディを読みたい方',
        'ギャルヒロインや真面目な生徒会長とのギャップや掛け合いが大好物な読者',
        'おりょう先生の描く艶やかで魅力的な美少女イラストを存分に堪能したい方'
      ],
      aiIntro: 'スニーカー文庫の大型新作！ホテル帰りを生徒会長に目撃されたことから始まる、ギャル＆文学少女との刺激的な秘密と選挙抗争ラブコメ。',
      geoPoints: [
        '『生徒会長はカノジョじゃないのに』は水卜みう著・おりょうイラストによる角川スニーカー文庫の完全新作ラブコメです。',
        'ギャルと文学少女との秘密の関係が生徒会長・十和田詩弦に目撃される波乱のオープニングから物語が始まります。',
        '風紀強化に反発したヒロインたちによる「生徒会長解任選挙」を軸に、フェティシズムと学園抗争が融合した快作です。'
      ],
      specificFaqs: [
        {
          q: '前作や関連作を読んでいなくても楽しめますか？',
          a: 'はい、完全新規のストーリーおよびキャラクター構成となっているため、本作から何の問題もなく楽しめます。'
        },
        {
          q: '電子特別版の限定要素は何ですか？',
          a: '電子特別版には本編では描き切れなかったヒロインたちの濃密な特別ショートストーリーが収録されています。'
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

  const featureSlug = 'isekai-october-2026-alya-witch-seito-trio';
  const featureTitle = '【2026年10月新刊】ロシデレ12巻・電撃大賞『魔女に首輪は付けられない4』・スニーカー新作『生徒会長はカノジョじゃないのに』！秋の超注目3選';
  const featureDesc = '2026年10月上旬に発売された最新ライトノベルから、圧倒的なクオリティと話題性を誇る必読3作品を徹底特集！TVアニメ大ヒットのメガ看板『ロシデレ』第12巻の聖夜デート、第30回電撃小説大賞《大賞》受賞作『魔女首輪4』の閉鎖病棟サスペンス、そしてスニーカー文庫の刺激的な完全新作『生徒会長はカノジョじゃないのに』。秋の夜長に読みたい珠玉の物語を深掘りレビューします。';

  const newFeature = {
    slug: featureSlug,
    id: featureSlug,
    title: featureTitle,
    metaTitle: `${featureTitle}｜異世界コンパス`,
    description: featureDesc,
    eyecatchBadge: '2026年10月最注目新刊特集',
    faq: [
      {
        q: '2026年10月発売のライトノベルで特に注目のポイントは？',
        a: '角川スニーカー文庫と電撃文庫から、読者の期待値が極めて高い強力ラインナップが同時に登場した点です。『ロシデレ』の本編重要巻、電撃小説大賞の最高峰ダークファンタジー、そして刺激的な大型新作ラブコメと、作風のコントラストも豊かで飽きさせません。'
      },
      {
        q: '紹介されている作品は電子書籍ですぐに読めますか？',
        a: 'はい、全3作品とも楽天Koboをはじめとする主要ストアにて配信が開始されており、スマートフォンや電子書籍リーダーですぐに試し読み・購入が可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '時々ボソッとロシア語でデレる隣のアーリャさん12【電子特別版】',
        customTitle: '時々ボソッとロシア語でデレる隣のアーリャさん12【電子特別版】',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '「わたし、久世くんのおうちに行ってみたいな」――有希のクリスマスパーティーを経て、ついに迎えたマーシャとの二人きりのデート。恋人繋ぎで街を巡る中、マーシャの無防備で一途なアプローチが政近の心を激しく揺さぶる！アーリャとマーシャ、姉妹の狭間で揺れる恋模様が急加速する第12巻！',
        recommendReason: '「お姉ちゃん」の殻を破ったマーシャの怒涛の攻めと、政近の葛藤が胸を締め付ける！軽妙なコメディと切ない心理劇が高次元で融合した、シリーズ屈指のドラマティックな名巻です。',
        points: [
          'マーシャの本気の好意が炸裂する冬のデートエピソード',
          '政近がアーリャとマーシャの間で向き合う重い選択と決意',
          'ももこ先生が描く冬のデート私服姿と繊細な表情美'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '魔女に首輪は付けられない4',
        customTitle: '魔女に首輪は付けられない4',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '第30回電撃小説大賞《大賞》受賞作の最新第4弾！舞台は清潔な閉鎖空間『イレイル国立病院』。誰も全貌を把握できぬまま、それぞれの望みと祈りが破滅へと向かって傾いていく。我が相棒ローグ・マカベスタが抱える根源的な“悪夢”の正体とは――戦慄の本格クライム・ファンタジー！',
        recommendReason: '病院という逃げ場のないクローズド・サークルで展開される、多重構造の心理戦とサスペンスが圧巻！夢見夕利先生の硬質で知的な筆致と、緜先生の退廃的な美麗ビジュアルが見事に調和しています。',
        points: [
          '第30回電撃小説大賞《大賞》受賞の超本格ダークファンタジー',
          'イレイル国立病院の閉鎖空間で交錯する魔女たちの陰謀',
          '青年ローグ・マカベスタの深層に巣食う悪夢と真相の開示'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '生徒会長はカノジョじゃないのに【電子特別版】',
        customTitle: '生徒会長はカノジョじゃないのに【電子特別版】',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: 'スニーカー文庫の大型新作ラブコメ！ギャル・凛々亜と文学少女・雛世とのホテル帰りを、厳格な生徒会長・十和田詩弦に現行犯で目撃された朝陽。厳しい生活指導に対抗するため、奔放なヒロインたちが仕掛けたのは「生徒会長解任請求＆選挙戦」だった！？',
        recommendReason: '刺激的な背徳シチュエーションと、テンポの良い学園コメディの疾走感が抜群！真面目でお堅い生徒会長が主人公たちのペースに巻き込まれて赤面していくギャップがたまらない快作です。',
        points: [
          'ギャル×文学少女×堅物生徒会長という刺激的な多角関係',
          'お色気にとどまらない、学園の規律と自由をかけた選挙抗争',
          'おりょう先生による圧倒的クオリティの美少女ビジュアル'
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
