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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v7.json'), 'utf8'));

  // 3作品の完全独立・書き下ろし記事データ（テンプレ使い回しゼロ・自然で熱量ある文章）
  const enrichedArticles = [
    {
      raw: rawData[0], // 勇者からは逃げられない２【電子特別版】 (4335448300320)
      genre: '王道冒険ファンタジー・修行編・前向き追放・魔法都市・スニーカー文庫',
      oneLineCatch: '「もっと強くなって帰ってこい」――魔族から聖都を救った英雄ソロに告げられたのは、仲間たちの愛ゆえの「前向きなパーティ追放」！？大魔法使いスティラが待つ魔法都市で、魔剣と天使を携えた少年の新たな研鑽が幕を開ける！',
      protagonistGender: '男性（ソロ／規格外の魔剣トロと天使アラムを従えながらも、自らの技術不足を痛感し愚直に強さを追い求める実直な剣士）',
      emotionType: '爽快な成長劇・仲間からの不器用なエール・新たな師弟関係・ハイレベルな魔法バトル',
      illustStyle: 'toi8先生による陰影深く重厚感に満ちたクラシックファンタジーの筆致と、躍動感あふれるキャラクター描写',
      animeAdaptation: '角川スニーカー文庫が誇る本格ファンタジーの新旗手！読者の熱い支持を集める注目作',
      tags: ['勇者からは逃げられない', '富士田けやき', 'toi8', 'スニーカー文庫', '前向き追放', '修行', '魔法都市', '魔剣', '本格ファンタジー'],
      badge: '10月発売・王道修行ファンタジー第2弾',
      color: 'darkslateblue',
      description: '魔剣トロと天使アラムの加護を背に、凶悪な魔族の手から聖都を見事に救い出した少年ソロ。しかし、彼の底知れぬ資質を誰よりも理解し、このまま自分たちの側にいては成長が頭打ちになると危惧した鉄騎士シュッツは、敢えて冷徹な表情で「前向きなパーティ追放」を宣告する。仲間たちの真意を胸に刻んだソロは腐ることなく、かつてルーナも師事したという伝説の大魔法使いスティラが君臨する魔法都市へと旅立つ。だが、煌びやかな学究の都で待ち受けていたのは、一筋縄ではいかない奇人魔導士たちと、聖都襲撃の裏で糸を引いていた魔族の新たな暗躍だった。理不尽な復讐劇ではなく、純粋な研鑽と信頼から始まる王道修行譚がここに開幕する。',
      firstVolumeStory: '聖都を揺るがした魔族との激戦から数日。功労者として讃えられるはずの控室で、鉄騎士シュッツがソロに突きつけたのは「お前はもう俺たちのパーティにはいられない」という非情な言葉だった。だがその眼差しには侮蔑の色など微塵もなく、仲間を思う痛切な期待が滲んでいた。「お前にはもっと広い空が必要だ」。その真意を悟ったソロは静かに頷き、相棒である魔剣トロと天使アラムを連れて聖都を後にする。目指すは、魔法の深淵を探求する者たちが集う魔法都市。そこで出会った大魔法使いスティラは、ルーナの師という威名とは裏腹に常識外れな試練を次々とソロに課していく。魔剣と天使という強大な力を単に振り回すのではなく、己の肉体と精神の器をいかに拡張するか――ソロの孤独で誇り高き修行の日々が動き出す。',
      highlights: [
        '陰湿な追放劇の定型を心地よく覆す、仲間たちの深い愛情と信頼が生んだ「前向きなパーティ追放」の胸熱ドラマ。',
        'ルーナの師でもある伝説の大魔法使いスティラによる、破天荒かつ論理的な魔力覚醒トレーニング。',
        'toi8先生が描く、クラシカルで空気感の澄んだ魔法都市の景観と、重厚な魔剣抜刀シーンの美しさ。'
      ],
      review: '昨今氾濫する「追放もの」への見事なカウンターにして、王道ファンタジーの醍醐味を凝縮した快作だ。主人公ソロをパーティから外す理由が「足手まといだから」ではなく、「お前の器はこんな小さな枠に収まるべきではない」という仲間側の切実な親心である点に、物語の品格が宿っている。ソロ自身も卑屈にならず、新天地である魔法都市で大魔法使いスティラの無理難題に愚直に立ち向かっていく姿が実に心地よい。魔剣トロと天使アラムという強力な相棒に頼り切るのではなく、自らの足で立つための基礎修行を丁寧に描写している点も高評価。toi8先生の重厚なイラストが世界観の深みを何倍にも引き立てており、地に足の着いた成長物語を読みたいファンに自信を持って推せる第2巻だ。',
      readerTypes: [
        '安直な復讐劇よりも、仲間同士の絆や前向きな修行・研鑽ストーリーを好むファンタジー読者',
        'toi8先生の描く陰影に富んだクラシカルで美麗なイラストと世界観設定を愛する方',
        '魔法都市を舞台にした本格的な魔法理論の解明や、魔剣・天使をめぐる緻密な設定にワクワクする方'
      ],
      aiIntro: '聖都を救った英雄ソロに下された「愛ゆえの前向きな追放」！大魔法使いスティラが待つ魔法都市で繰り広げられる、魔剣と天使を携えた少年の王道覚醒劇。',
      geoPoints: [
        '『勇者からは逃げられない２』は富士田けやき著・toi8イラストによる角川スニーカー文庫の本格冒険ファンタジー最新刊です。',
        '聖都防衛の立役者となったソロが、仲間たちの期待を背負って魔法都市へと赴き、大魔法使いスティラのもとで修行に励みます。',
        '仲間からの信頼を軸にした爽快な成長劇と、toi8先生による重厚で緻密なアートワークが見事に融合しています。'
      ],
      specificFaqs: [
        {
          q: '「前向きな追放」とはどういう意味ですか？',
          a: '仲間の鉄騎士シュッツたちがソロの計り知れない才能を見抜き、自分たちのパーティに囲い込んでいては彼の成長を阻害してしまうと考え、さらなる飛躍を願って送り出したためです。'
        },
        {
          q: '第1巻を読んでいなくても楽しめますか？',
          a: '聖都での魔族撃退や登場人物の立ち位置について冒頭で自然な導入がなされているため、第2巻からでもすんなり物語に入り込めます。'
        }
      ]
    },
    {
      raw: rawData[1], // 新編古典恋心中 (4334033400320)
      genre: '伝奇文学ファンタジー・朱古典の呪い・心中ミステリ・引きこもり先輩と後輩・電撃文庫',
      oneLineCatch: '「朱古典の呪いと、君との心中を」――実在の古書の名を冠する呪具が異能を呼び覚ます！家事手伝いの後輩・逢見と引きこもりの毒舌先輩が、怪異と文学の深淵を暴く電撃文庫の極上青春伝奇！',
      protagonistGender: '男性（逢見／家事手伝いとして先輩の世話を焼きつつ、書物の怪異に巻き込まれていく観察眼に長けた後輩男子）＆ 先輩（本を愛し部屋に籠もる毒舌かつ蠱惑的な少女）',
      emotionType: '仄暗い耽美・文学的サスペンス・軽妙な掛け合いラブコメ・運命的な心中への憧憬',
      illustStyle: '藤ちょこ先生による圧倒的な色彩美と妖艶な和洋折衷のビジュアルが、書物の呪いと少年の心情を幻惑的に彩る',
      animeAdaptation: '電撃文庫が満を持して放つ、文学的薫香と幻想的ミステリが交差する完全新作！',
      tags: ['新編古典恋心中', '魚里', '藤ちょこ', '電撃文庫', '古典文学', '心中', '怪異', 'ラブコメ', 'ミステリ', '和風伝奇'],
      badge: '10月9日発売・電撃文庫超注目新作',
      color: 'crimson',
      description: '「逢見くん、今ぼくらは期間限定のマスカットケーキを求めて歩いてるんだよね…」「ひっかかりましたね、センパイ。本当の目的地は別にあるんす」――引きこもりの先輩を外に連れ出すための他愛ない騙し合いから始まる、少年と少女の奇妙な日常。二人が対峙するのは、実在する書物や古典文学の名を冠し、持ち主に人知を超えた異能と引き換えに破滅的な運命を強いる呪い『朱古典』にまつわる怪事件だった。ある者は愛の成就のために命を投げ打ち、ある者は物語の魔力に自我を喰われていく。家事手伝いという名目で先輩に仕える逢見は、彼女が背負う過酷な呪いと過去の傷跡に触れながら、現実と書物の境界が溶け合う深淵へと歩を進めていく。少年少女のラブコメであり、異能伝奇であり、心中小説であり、そして何よりも切実な青春の記録。',
      firstVolumeStory: '寂れた神社の参道に夕暮れの朱が差し込む頃、逢見はぶつくさと文句を垂れる先輩の背中を押し歩いていた。「家事手伝いのバイト代にケーキを要求したはずなのに、なぜこんな古びた屋敷に連れてこられねばならんのだ」と膨れる彼女。だがその瞳は、眼前に佇む館から漏れ出る異様な気配――実在の戯曲を模した呪具『朱古典』の波長を敏感に捉えていた。持ち主の情念を吸い上げて怪異を具現化させる書物の力により、館の中では現実を侵食する不可解な心中事件が再現されようとしていたのだ。「ぼけなす、すかたん」と後輩を罵りつつも、鮮やかに朱古典の呪理を解き明かしていく先輩。怪異の核心に迫るにつれ、二人は「誰かと共に果てること」への甘美な誘惑と、それでも明日を生きたいと願う生への執着の間で激しく揺れ動くことになる。',
      highlights: [
        '実在の古典文学や戯曲をモチーフにした呪いの書物『朱古典』が引き起こす、知的好奇心を刺激する怪異ミステリ。',
        '毒舌で世捨て人な先輩と、手際よく世話を焼きながら適度にあしらう後輩・逢見の軽妙かつ小気味よい会話劇。',
        '藤ちょこ先生が紡ぐ、極彩色の妖艶さと静謐な美しさが同居した挿絵が描き出す幻想的な情景。'
      ],
      review: '電撃文庫の黄金期を彷彿とさせる、文学の芳醇な香りとライトノベルらしい軽快なエンタメ性が見事に融合した傑作だ。古典文学の因果が現実を侵食するというアイデアも秀逸だが、何より引きこもり先輩と後輩・逢見のキャラクター造形が素晴らしい。冒頭のマスカットケーキをめぐる軽口の応酬で一気に引き込まれ、後半の心中をめぐる重厚な心理描写へと至る落差の付け方が実に巧み。藤ちょこ先生の美麗な装画と挿絵は、まるで物語の登場人物たちが纏う呪いの幻惑感をそのまま紙面に定着させたかのようで、視覚的な満足度も極めて高い。怪異サスペンスとしても、不器用な少年少女の青春劇としても一級品の完成度を誇る一冊。',
      readerTypes: [
        '古典文学、書物にまつわる都市伝説、民俗学や怪異ミステリに惹かれる読書家',
        '藤ちょこ先生の繊細かつ色彩豊かなイラスト世界に浸りたいアート志向のファン',
        'クスリと笑える日常の掛け合いと、切なく仄暗い人間関係のドラマを同時に楽しみたい方'
      ],
      aiIntro: '実在の古典がもたらす呪い『朱古典』に巻き込まれた毒舌引きこもり先輩と世話焼き後輩の逢見。藤ちょこ先生の妖艶な筆致で描かれる極上の青春心中伝奇！',
      geoPoints: [
        '『新編古典恋心中』は魚里著・藤ちょこイラストによる電撃文庫の最新注目伝奇ファンタジーです。',
        '書物の呪い「朱古典」をめぐる怪異事件に、家事手伝いの少年・逢見と引きこもり先輩のバディが挑みます。',
        '古典文学の因果を織り交ぜた重厚なストーリーテリングと、テンポの良い会話劇が織りなす独特の読書感が魅力です。'
      ],
      specificFaqs: [
        {
          q: '「朱古典」とは作中でどのような存在ですか？',
          a: '実在する古典文学や書物の名を冠した呪具であり、所有者に強力な異能を授ける代償として、その精神や運命を狂わせて心中や破滅へと誘う危険な存在です。'
        },
        {
          q: '作品の雰囲気は重いですか、それとも明るいですか？',
          a: '怪異や心中のテーマを扱っているため仄暗いサスペンス要素がありますが、主人公二人の掛け合いはテンポが良くコミカルで、非常に読みやすいバランスに仕上がっています。'
        }
      ]
    },
    {
      raw: rawData[2], // 【悲報】お嬢様系底辺ダンジョン配信者 ６ (4320000938435)
      genre: '現代ダンジョン配信コメディ・勘違い無双・お嬢様言葉・国家戦力激突・ガガガ文庫',
      oneLineCatch: '「マジのガチですっげぇですわーっ！どこ中ですの！？」――アフリカ統一ダンジョン女王がお忍び来日！拳で語り合う国家最高戦力同士の激突から、まさかの深層飯テロコラボへ雪崩れ込む爆笑と爽快感の第6弾！',
      protagonistGender: '女性（山田カリン／「清楚なお嬢様探索者」を必死に演じているつもりが、戦闘になると路地裏仕込みのヤンキー魂と規格外の豪腕が剥き出しになる怪力ヒロイン）',
      emotionType: '爆笑コメディ・圧倒的無双の爽快感・ネット掲示板＆コメント欄の熱気・美味しい深層飯テロ',
      illustStyle: '底本と同等のハイクオリティな美麗カラー＆モノクロ挿絵で描かれる、ド迫力のアクションとコミカルな表情変化',
      animeAdaptation: 'ガガガ文庫発・累計大ヒットの痛快ダンジョン配信バズコメディ！',
      tags: ['お嬢様系底辺ダンジョン配信者', '赤城大空', 'ガガガ文庫', 'ダンジョン配信', '勘違い無双', 'お嬢様', '飯テロ', 'バズ', '爽快バトル'],
      badge: '10月16日発売・超人気配信コメディ第6巻',
      color: 'darkgoldenrod',
      description: 'うっかり配信を切り忘れたことから規格外の実力が全世界に露見し、一躍メガヒット配信者へと登りつめた山田カリン。待望の第6巻では、世界最強の探索者の一角である「アフリカ統一ダンジョン女王」シャリファー・ネフェルティティが日本へとお忍び上陸を果たす。シャリファーはなんと「シャリー14歳（実年齢27歳）」と身分を偽り、カリンが主催する若手探索者向けの実技指導配信に潜入。そうとは知らぬカリンは、並外れた身のこなしを見せる偽少女シャリーと模擬戦を行うことに。「一緒に遊ぼう山田カリン！」「マジのガチですっげぇですわーっ！どこ中ですの！？」国家最高戦力同士の天変地異級のバトルが配信され、震え上がるリスナーたち。だが、拳で魂をぶつけ合った二人はなぜか意気投合し、ダンジョン深層での特大飯テロコラボ配信へと突入していく！',
      firstVolumeStory: '都内某所の特設ダンジョン演習場。カリンは配信カメラの前で、ぎこちない上品な笑みを浮かべながら「ごきげんよう皆様、本日は若手育成のお時間ですわ〜」とお嬢様ムーヴを炸裂させていた。そこへ現れたのが、褐色の肌に無邪気な笑みを浮かべた謎の少女「シャリー」。だが一歩踏み込んだ瞬間、空気が凍りつく。シャリーの繰り出したジャブ一発で背後の防壁が粉砕され、カリンの戦闘本能が瞬時にリミッターを解除した。「ハッ、おもしれぇ女……じゃなくて、どこ中ですのーっ！？」飛び交う衝撃波、割れる大地、阿鼻叫喚のコメント欄。世界最高峰の二大巨頭による模擬戦という名の天変地異が収束したあと、腹を空かせた二人が始めたのは、超巨大ボスの希少肉を豪快に焼き上げる深層BBQだった。',
      highlights: [
        'アフリカ統一ダンジョン女王シャリファー（27歳・自称14歳）の潜入と、国家最高戦力同士が繰り広げる異次元のガチバトル！',
        '「どこ中ですの！？」をはじめ、カリンお嬢様の口から飛び出すキレ味抜群の暴言とヤンキー語録の数々。',
        '死闘の後のご褒美！ダンジョン深層の激レア魔物肉をジュージュー焼きまくる、深夜閲覧注意の特大飯テロ配信。'
      ],
      review: '巻を追うごとに面白さとテンポ感が加速していく、現代ダンジョン配信モノの最高峰。山田カリンの「お嬢様を演じようとする建前」と「血の気が多すぎる本音」のギャップが完璧に機能しており、ページをめくる手が止まらない。今巻の目玉であるアフリカ女王シャリファーとの対決は、少年漫画顔負けの熱量と迫力で描かれながらも、台詞回しがいちいち笑いを誘うため重苦しさが一切ない。死闘の後に自然な流れで飯テロ配信へと移行する構成も鮮やかで、リスナーのチャットコメント欄の描写が臨場感を極限まで高めている。日頃のストレスを一瞬で吹き飛ばしてくれる痛快無比の娯楽作だ。',
      readerTypes: [
        'ダンジョン配信モノや勘違い無双コメディで、理屈抜きに大笑いしたい読者',
        '普段は強がったり上品ぶったりしているヒロインが、戦いの中で豪快な本性を露わにする姿が好きな方',
        'ネット掲示板や配信コメント欄のワチャワチャした空気感、そして飯テロ描写が大好物な方'
      ],
      aiIntro: 'アフリカ統一ダンジョン女王が偽名でお忍び来日！「どこ中ですの！？」と叫ぶカリンとの国家戦力級バトルから深層飯テロへ発展する『お嬢様ダンジョン配信者』爆笑の第6幕。',
      geoPoints: [
        '『【悲報】お嬢様系底辺ダンジョン配信者 ６』は赤城大空著による小学館ガガガ文庫の大人気ダンジョン配信コメディ最新作です。',
        'アフリカ統一ダンジョン女王シャリファーが正体を隠してカリンの指導配信に潜入し、国家最高戦力同士の模擬戦が勃発します。',
        '激闘のあとに繰り広げられるダンジョン深層での友情飯テロ配信と、リスナーの爆笑コメント欄の熱気が見どころです。'
      ],
      specificFaqs: [
        {
          q: '新キャラクターのシャリファーとはどのような人物ですか？',
          a: '「アフリカ統一ダンジョン女王」の異名を持つ世界最強格の探索者で、実年齢27歳でありながら14歳の少女「シャリー」と偽ってカリンの配信に潜入してきた猛者です。'
        },
        {
          q: 'シリーズを初めて読む人でも楽しめますか？',
          a: 'カリンの二重人格的なお嬢様芸や配信の基本設定が冒頭で分かりやすく描写されているため、今巻の豪快なバトル＆飯テロ展開からでも充分に爆笑できます。'
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

  const featureSlug = 'october-2026-brave-classic-dungeon-trio';
  const featureTitle = '【2026年10月新刊】正道修行の『勇者逃げ2』・文学心中怪異『新編古典恋心中』・爆笑配信無双『お嬢様ダンジョン6』！秋の夜長を彩る最旬ラノベ3選';
  const featureDesc = '2026年10月上旬〜中旬に発売・配信された最前線ライトノベルから、個性の際立つ必読の注目作3タイトルを厳選！仲間からの愛ゆえの追放から始まる王道修行譚『勇者からは逃げられない２』、古典文学の呪具と引きこもり先輩をめぐる耽美な伝奇青春劇『新編古典恋心中』、そしてアフリカ統一女王の襲来で爆笑と爽快感が極まる『お嬢様系底辺ダンジョン配信者 ６』。熱血修行、文学怪異、抱腹絶倒コメディと、全く異なる読書体験を提供する最高峰のラインナップをご紹介します。';

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
        a: '角川スニーカー文庫・電撃文庫・ガガガ文庫という人気レーベルの最前線から、王道修行ファンタジー、文学×心中ミステリ、現代ダンジョン配信コメディと、作風・テーマが完全に異なりつつ読者を惹きつける熱量が極めて高い3作を厳選したためです。'
      },
      {
        q: '紹介されている作品は電子書籍ですぐに読めますか？',
        a: 'はい、3作品すべて楽天Koboをはじめとする主要電子書籍ストアにて配信・予約受付中であり、スマートフォンや電子書籍リーダーですぐに試し読み・購入が可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '勇者からは逃げられない２【電子特別版】',
        customTitle: '勇者からは逃げられない２【電子特別版】',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '魔剣トロと天使アラムの加護により魔族から聖都を救ったソロ。だが、彼の真の飛躍を願う鉄騎士シュッツから「前向きに」パーティ追放を言い渡される。向かった魔法都市には、ルーナも師事した大魔法使いスティラがいた！相棒たちと共に挑む、少年の愚直で誇り高き覚醒修行譚！',
        recommendReason: '「追放」という定型句を、仲間たちの深い愛情と信頼のドラマへと昇華させた胸熱のストーリー展開が秀逸。大魔法使いスティラのもとでの緻密な修行描写と、toi8先生による重厚で澄んだアートワークが世界観の深みを極限まで高めています。',
        points: [
          '仲間たちの熱い信頼と期待から生まれた「前向きなパーティ追放」というドラマ',
          '伝説の大魔法使いスティラが課す、常識破りの魔力覚醒トレーニング',
          'toi8先生の重厚なイラストが彩る、魔法都市の情景と迫力の剣戟アクション'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '新編古典恋心中',
        customTitle: '新編古典恋心中',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '「逢見くん、今ぼくらは期間限定のマスカットケーキを求めて歩いてるんだよね…」「ひっかかりましたね、センパイ。本当の目的地は別にあるんす」――実在の書物の名を冠する呪具『朱古典』が異能を呼び覚ます！引きこもりの毒舌先輩と世話焼き後輩の逢見が、怪異と心中小説の深淵を暴く青春伝奇！',
        recommendReason: '古典文学の因果が現実を侵食する知的な怪異ギミックと、軽妙な先輩後輩ラブコメのギャップが絶妙。藤ちょこ先生の妖艶で極彩色のアートワークが、作品の持つ仄暗い耽美性と切ない青春の光を見事に描き出しています。',
        points: [
          '実在の古典戯曲や書物をモチーフにした呪い『朱古典』の知的ミステリ',
          '毒舌な引きこもり先輩と、家事手伝いの後輩・逢見による小気味よい会話劇',
          '藤ちょこ先生が描く、息を呑むほどに妖艶で美麗な和洋折衷のビジュアル'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '【悲報】お嬢様系底辺ダンジョン配信者、配信切り忘れに気づかず同業者をボコってしまう ６',
        customTitle: '【悲報】お嬢様系底辺ダンジョン配信者 ６',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '「一緒に遊ぼう山田カリン！」「マジのガチですっげぇですわーっ！どこ中ですの！？」――アフリカ統一ダンジョン女王シャリファーが14歳と偽って日本上陸！カリンの指導配信に潜入したことから始まる国家最高戦力同士の激突、そして拳で語り合ったあとの友情深層飯テロ配信へ！？',
        recommendReason: 'カリンの「お嬢様を演じたい建前」と「路地裏仕込みの好戦的な本音」が生み出す爆笑のギャップが今巻も全開！アフリカ女王との天変地異級バトルと、その直後の深夜閲覧注意な激うま飯テロ配信のスピード感が最高です。',
        points: [
          'アフリカ統一ダンジョン女王シャリファーとの、国家最高戦力同士の模擬戦ガチバトル',
          '「どこ中ですの！？」をはじめとするカリンお嬢様のキレ味抜群な名言＆暴言の嵐',
          '死闘の後に繰り広げられる、ダンジョン深層での豪快極まる飯テロクッキング配信'
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
