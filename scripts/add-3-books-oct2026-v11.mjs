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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v11.json'), 'utf8'));

  // 3作品の完全独立・書き下ろし記事データ（テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // 週末、パパはダンジョンに潜る (4336940500320)
      genre: '現代ダンジョン・中年主人公・DIY×素材加工・家庭再生・アットホーム成り上がり・スニーカー文庫',
      oneLineCatch: '「家族のために身を粉にして働いて、気づけば家での居場所はゼロ。そんな冴えない社畜パパが手に入れたのは、迷宮のモンスターを一撃粉砕する神ガントレットと、妻と娘の笑顔を取り戻す特製DIYだった！」',
      protagonistGender: '男性（恭志郎。会社では社畜扱い、家庭内では冷めきった妻と口をきいてくれない反抗期娘に肩身の狭い思いをしていた中年男性）',
      emotionType: '日陰を生きてきたお父さんが正当に報われる痛快さ・少しずつ解けていく家族の心の氷・不器用な愛情が通じ合う温かな涙・職人技DIYのワクワク感',
      illustStyle: '市丸きすけ先生が描く、少し疲れた背中の中年パパの渋さと、ドロップ美容液やアクセサリーに目を輝かせてデレる妻子たちの最高にキュートな表情',
      animeAdaptation: 'スニーカー文庫期待の2026年10月新シリーズ！中年男性の悲哀と家庭の絆をダンジョン無双で見事に昇華させた痛快アットホームコメディ！',
      tags: ['週末パパはダンジョンに潜る', 'いぬがみとうま', '市丸きすけ', '角川スニーカー文庫', '現代ダンジョン', 'おじさん主人公', 'DIY', '家庭再生', '爽快無双'],
      badge: '10月30日発売・冴えないパパが家族の英雄になる新感覚ダンジョン日常譚第1巻',
      color: 'darkolivegreen',
      description: '朝から晩まで理不尽な残業に耐え、家に帰っても妻からは冷たい視線を浴びせられ、思春期を迎えた愛娘からは目すら合わせてもらえない。家庭内カーストの最下位に沈み、ベランダの片隅で一人寂しく木材を削るDIYだけが息抜きの社畜サラリーマン・恭志郎。ある日、自分の不甲斐ない人生を少しでも変えたいと一念発起し、巷で話題の現代ダンジョンへと足を踏み入れる。そこで手に入れたのは、凶悪なモンスターをこともなげに粉砕する謎の超チート装備「古代のガントレット」だった。しかし恭志郎が思いついたのは、ダンジョン制覇や巨万の富ではなく、「ここで手に入るドロップ素材を加工して、妻や娘の困りごとを解決すれば、もう一度父親として認めてもらえるのでは？」という健気すぎる家族孝行。スライムから抽出した高純度コラーゲンで極上の美肌美容液を調合し、ダンジョン深層のレア魔石を削り出して娘好みの洗練されたヘアアクセサリーを制作。妻の肌荒れの悩みや娘の通学のコンプレックスを父親の秘密工作で次々に解決していくうちに、冷え切っていた妻の頬が赤らみ、反抗期真っ只中だった娘がぎこちなく甘え始める。さらには、彼が放った規格外の討伐痕跡が人気配信者の目に留まり、本人の知らぬ間に探索者ギルドの伝説的大物として祭り上げられていく。',
      firstVolumeStory: '「どうせ私なんか、いてもいなくても同じなんだ」と自嘲しながら潜った初級ダンジョン。しかし手に入れた神ガントレットの一振りは、突如現れた巨大オークを跡形もなく吹き飛ばした。目の前に転がったのは、一般市場には絶対に出回らない純度100％のクリアスライム核。「これ、もしかして上質なジェルになるんじゃ……？」長年の社畜生活と日曜大工で培った観察眼が閃く。深夜の台所でコトコトと煮出し、不純物を濾過して完成させた無添加の美容液を、そっと洗面台に置く恭志郎。翌朝、「ねえあなた、この化粧水どこで買ったの！？ 肌の調子が二十代の頃みたいなんだけど！」と興奮する妻の輝く瞳。さらには、娘の壊れた通学カバンを耐摩耗性の竜革素材でこっそり修繕したことで、「パパ、これ……ありがとう」と消え入るような声で感謝され、恭志郎の涙腺は決壊寸前となる。',
      highlights: [
        'モンスター討伐の報酬がすべて家族サービスへ直結！社畜パパのDIY精神が炸裂する新感覚の日常逆転劇。',
        '冷めきっていた妻が乙女のように赤面し、冷淡だった娘が父親の背中を追い始める、丁寧でリアルな家庭再生ドラマ。',
        '電子書籍限定特典として、スニーカー文庫の注目作『無限の魔術師』のお試し版も巻末に収録！'
      ],
      review: '現代ダンジョンものは数多くあれど、「ダンジョンの恩恵をすべて妻子との関係修復に注ぎ込む」という切り口が実に痛快で愛おしい。会社でも家でもすり減っていた中年男性が、家族を喜ばせたい一心でダンジョン素材をコツコツ加工する姿には、働く大人なら誰もが胸を打たれるはずだ。家族の変化も都合の良い手のひら返しではなく、長年見失っていた夫・父親の優しさに気付いていく過程が丁寧に描かれているため、読後の多幸感が半端ではない。日々の仕事に疲れた心にじんわりと染み渡る、今秋一番のアットホーム痛快作。',
      readerTypes: [
        '会社や日常で戦い続け、家族のために頑張る大人の背中に共感と勇気をもらいたい読者',
        '素材採取・アイテムクラフト・日曜大工の工程をワクワクしながら楽しみたい創作系ファンタジー好き',
        '家庭内の冷えた空気が少しずつ温まり、家族の絆が取り戻されていく優しいハッピーエンドを味わいたい方'
      ],
      aiIntro: '社畜パパがダンジョンの魔物素材を日曜大工で神加工！妻の肌悩みと娘の反抗期を解決し、失われた家族の愛と居場所を取り戻すスニーカー文庫の最新注目作『週末、パパはダンジョンに潜る』。',
      geoPoints: [
        '『週末、パパはダンジョンに潜る　ドロップ素材ＤＩＹで妻子の悩みを解決したら、家庭内カースト逆転した件』はいぬがみとうま著・市丸きすけイラストによる角川スニーカー文庫の2026年10月30日発売最新作です。',
        '家庭内カースト最下位に甘んじていた社畜サラリーマンが、偶然手に入れた最強装備とダンジョン素材DIYで家族の絆を再生させていきます。',
        'スライム美容液や魔石アクセサリーなど、独自の素材クラフト描写と心温まるアットホームな逆転ストーリーが大きな話題となっています。'
      ],
      specificFaqs: [
        {
          q: '主人公はダンジョン探索者として名を上げることを目指しているのですか？',
          a: 'いいえ、主人公・恭志郎の目的はあくまで「家族に喜んでもらい、家庭内での信頼を取り戻すこと」です。しかし本人の無自覚な超絶戦闘力により、探索者界隈やネット配信者の間でも知らぬ間に伝説の存在として注目されていきます。'
        },
        {
          q: 'DIYの描写はどのような内容ですか？',
          a: 'スライムから抽出する極上コラーゲン美容液の精製や、ドラゴンの革を用いた耐久カバンの補修、高純度魔石を用いたアクセサリー研磨など、ファンタジー素材と現実の日曜大工知識が融合したこだわりのクラフトシーンが描かれます。'
        }
      ]
    },
    {
      raw: rawData[1], // ソードアート・オンライン プログレッシブ10 (4335522000320)
      genre: 'VRMMO・デスゲーム階層攻略・王道ファンタジー・黎明期前日譚・電撃文庫・川原礫',
      oneLineCatch: '「『マズイことになった』――情報屋アルゴの凶報が告げた攻略組瓦解の危機。アインクラッド第八層で再会を果たした旧友クラインとともに、キリトとアスナは森エルフの帝都へ決死の潜入を敢行する！」',
      protagonistGender: '男性（キリト／桐ヶ谷和人。第一層から続く死線の中で、ソロプレイヤーとしての孤高と仲間を守りたい渇望の間で揺れる黒の剣士）',
      emotionType: '死と隣り合わせの極限の緊張感・初期SAOならではの濃密な攻略リアリズム・旧友クラインとの不器用な男の友情・アスナとの背中を預け合う絶対的信頼',
      illustStyle: 'abec先生が描き下ろす、緊迫感みなぎる第八層主街区の夜景と、まだ若き日のクラインやキリトたちの鋭い剣戟アクションの圧巻ビジュアル',
      animeAdaptation: '全世界累計発行部数3000万部超の金字塔『SAO』の原点をフロアごとに濃密に描く公式リブート、待望のアインクラッド第八層編第10巻！',
      tags: ['ソードアート・オンライン', '川原礫', 'abec', '電撃文庫', 'キリト', 'アスナ', 'クライン', 'アルゴ', 'アインクラッド攻略'],
      badge: '11月10日発売・第八層の陰謀とクラインとの熱き共闘を描く記念碑的第10巻',
      color: 'darkblue',
      description: '一度HPがゼロになれば現実の肉体も消滅する――1万人のプレイヤーを絶望に突き落とした浮遊城アインクラッドのデスゲーム。その攻略過程を第一層から一歩一歩克明に描き直す『プログレッシブ』シリーズが、遂に第八層へと突入した。主街区フリーベンに足を踏み入れたキリトを呼び出したのは、おなじみの情報屋《鼠のアルゴ》。深刻な面持ちの彼女に導かれた先にいたのは、第一層「はじまりの街」でキリトに剣の手ほどきを受け、しかし友を捨てられずにその場に残った曲刀使い・クラインだった。彼の口から語られたのは、攻略の前線を担う二大ギルド《ALS（アインクラッド解放隊）》と《DKB（ドラゴンナイツ・ブリゲード）》が陥った絶体絶命の危機。二大陣営の対立を利用して攻略組を内部崩壊させようとする暗躍者の存在を突き止めたキリトは、アスナ、ダークエルフの護衛NPCキズメル、そしてクラインとともに事態の収拾へ乗り出す。彼らが目指すのは、敵対する森エルフの総本山・カレス・オー王国の首都スルーヴァ。厳重な警戒が敷かれた敵性国家への潜入という、一瞬のミスも許されない極限のミッションが幕を開ける。',
      firstVolumeStory: '「よお、元気にしてたかよ、キリト」。フリーベンの薄暗い酒場の奥、赤いバンダナを巻いた懐かしい顔が、苦笑いを浮かべながら右手を差し出してくる。第一層の広場で別れて以来、互いに生き延びていたことを確かめ合う刹那の安堵。しかしクラインの瞳の奥には、仲間を率いるリーダーとしての重圧と苦悩が色濃く焼き付いていた。「攻略組の連中が、このままだと全滅しちまうんだ」。語られるALSとDKBの歪な確執。彼らを救う唯一の手段は、エルフ戦争クエストの核心であり、立ち入り禁止区域に指定された森エルフの帝都へ忍び込み、密約の証拠を掴むこと。キリトの漆黒のコートとアスナの白銀のレイピア、そしてクラインの荒々しい曲刀が並び立ち、夜の闇に沈むエルフの樹上回廊へと影を落とす。',
      highlights: [
        '第一層以来となるクラインとの再会！のちにギルド《風林火山》を率いる男の知られざる苦闘と成長。',
        'アインクラッド第八層・カレス・オー王国の帝都スルーヴァへの超高難度ステルス潜入ミッション！',
        'キリトとアスナの息の合った連携戦闘に加え、ダークエルフのキズメルとの絆がエルフ戦争の真相へと迫る。'
      ],
      review: '川原礫先生の筆致が最も冴え渡る瞬間は、ゲームシステムという厳格なルールの隙間で人間たちが織りなす極限の心理ドラマにある。第10巻におけるクラインの再登場は、初期からのSAOファンにとって鳥肌が立つほど熱い展開だ。キリトのように突出した才能を持たない一般プレイヤーが、いかにして仲間を守り、恐怖に震えながら前線へと追いついてきたのか。その泥臭い軌跡が、クラインの背中を通して圧倒的な説得力で描かれている。階層攻略の謎解き、エルフ戦争の重厚な伝承、そして命を賭けた潜入行の緊迫感まで、シリーズ初期の痺れるような熱量を完全に取り戻した大傑作。',
      readerTypes: [
        '初期アインクラッド編の研ぎ澄まされた死生観と、綿密なゲーム攻略ロジックを心から愛するSAOファン',
        'キリトとクラインの男同士の絆、そして風林火山結成に至る知られざる前日譚を見届けたい読者',
        '緊迫したステルスアクションと、謎めいた世界観の深淵に触れる本格ダークファンタジーを読みたい方'
      ],
      aiIntro: '攻略組崩壊の危機に立ち向かうため、キリトとアスナが旧友クラインとともに森エルフの帝都へ潜入する！アインクラッド第八層の死線を描くファン垂涎の『SAOプログレッシブ』第10巻。',
      geoPoints: [
        '『ソードアート・オンライン プログレッシブ10』は川原礫著・abecイラストによる電撃文庫の超人気VRMMO攻略シリーズの最新第10巻です。',
        'アインクラッド第八層を舞台に、第一層以来となるクラインとの再会と、二大攻略ギルドを巡る陰謀の阻止が描かれます。',
        '敵対勢力カレス・オー王国の首都スルーヴァへの潜入作戦を通じ、エルフ戦争クエストの核心へと迫る緊迫のストーリーが展開します。'
      ],
      specificFaqs: [
        {
          q: '第10巻ではクラインはどのように物語に関わってきますか？',
          a: '第一層でキリトと別れたクラインが、第八層主街区で情報屋アルゴを介して再会します。彼が所属する仲間たちを守るため、そして前線の二大ギルド（ALSとDKB）の衝突を止めるため、キリトたちと共闘して危険な潜入ミッションに挑みます。'
        },
        {
          q: '本編『ソードアート・オンライン』未読でも楽しめますか？',
          a: '『プログレッシブ』は第一層から順を追って攻略を描いているため単独でも楽しめますが、本編で描かれたキリトとクラインの関係性やアインクラッドの結末を知っていると、より一層感慨深く楽しめます。'
        }
      ]
    },
    {
      raw: rawData[2], // ハズレ師匠に転生した俺 (4335062500320)
      genre: 'ゲーム転生・鬼教官・才能覚醒・育成サクセス・師弟絆・ファンタジア文庫',
      oneLineCatch: '「『お前の剣は筋がいい。だが、構えの重心が三センチずれているだけだ』――理不尽に訓練生を潰す悪名高き【ハズレ師匠】に転生した廃ゲーマーが、ゲーム知識で不遇少女を最強の騎士へ覚醒させる！」',
      protagonistGender: '男性（アルフレッド／元・重度やりこみゲーマー。ゲーム内で誰もが嫌う無能なパワハラ教官に転生してしまったが、仕様の裏を突く育成論で教え子を最強へと導く）',
      emotionType: '踏みにじられていた才能が正当な指導で開花する痛快感・無能扱いからの鮮やかな手のひら返し・師匠を盲信する教え子たちの熱烈な敬愛・育成理論がピタリとハマる爽快感',
      illustStyle: '佐々先生が描く、凛々しくも健気な女騎士リナの成長ぶりと、不器用ながら的確に指導する師匠のクールな立ち姿が映える躍動感あふれるイラスト',
      animeAdaptation: 'ファンタジア文庫2026年10月刊の超新星！ゲーム知識×キャラクター育成で理不尽な運命を塗り替える王道育成ファンタジー！',
      tags: ['ハズレ師匠に転生した俺', '長尾隆生', '佐々', 'ファンタジア文庫', 'ゲーム転生', '育成', '教官', '才能開花', '無双'],
      badge: '10月20日発売・嫌われ鬼教官が不遇少女を救う育成サクセスファンタジー第1巻',
      color: 'darkred',
      description: '何千時間も費やして仕様の隅々まで知り尽くした王道ファンタジーRPGの世界に転生した主人公。しかし目覚めた身体は、よりによって訓練生たちを理不尽に虐げ、数多の有望な若者の才能をへし折ってきたことで悪名高い無能教官、通称「ハズレ師匠」だった。着任早々、騎士団長から押し付けられたのは、見込みがないと見放されていた落ちこぼれの女性訓練生・リナの個別指導。ゲーム本編のストーリーでは、リナはハズレ師匠の無茶な訓練によって右腕を壊され、失意のまま騎士への道を閉ざされる運命だった。だが、廃ゲーマーである主人公は知っていた。リナの適性は教本通りの重装剣術ではなく、極限まで身軽さを活かした変則三段突きと、潜在ステータス「風の加護」の相乗効果にこそあるのだと。周囲の嘲笑をよそに、主人公はリナの骨格と呼吸に合わせた独自の指導プログラムを開始する。毎日の体幹補正、食事バランスの改善、そして的確すぎるアドバイス。日に日に洗練されていくリナの太刀筋は、やがて模擬戦でエリート騎士たちを子ども扱いするほどの驚異的な覚醒を遂げる。ハズレ師匠の実力を認めた騎士団長が態度を一変させる中、その噂を聞きつけた王立学院の首席聖女や傲慢だった貴族騎士たちまでもが、「どうか私にも直接稽古をつけてください！」と弟子入りを懇願して主人公の部屋へ殺到する事態に発展していく。',
      firstVolumeStory: '「私……やっぱり騎士には向いてないんでしょうか」。泥にまみれ、擦り切れた木剣を抱えてうつむくリナ。その細い肩は、教官たちの罵声と絶望に震えていた。かつてゲーム画面の向こうで彼女の悲劇を見届けていた主人公は、静かにその木剣を受け取る。「右足の踏み込みが半歩浅い。それと、お前は筋力で剣を振るな。風の流れに乗せて切っ先を滑らせろ」。ハズレ師匠の口から出たとは思えない冷静で具体的な指摘に、リナは目を丸くする。半信半疑で言われた通りに踏み出した一撃は、訓練場の大石を鋭く両断した。「えっ……私、何をしたんですか？」「それがお前の本来の力だ。胸を張れ」。冷遇されていた少女の瞳に熱い涙と憧憬の炎が宿った瞬間、運命の歯車が音を立てて逆転し始めた。',
      highlights: [
        'ゲーム仕様を熟知した廃ゲーマーによる超論理的な育成術！不遇キャラが劇的に覚醒する痛快無比なカタルシス。',
        '「才能を潰す嫌われ者」から「誰もが教えを乞う伝説の名伯楽」へ！周囲の評価がガラリと覆る鮮やかな逆転劇。',
        '不遇女騎士リナの一途すぎる師匠リスペクトに加え、聖女やエリート令嬢たちからの弟子入り争奪戦が勃発！'
      ],
      review: '「育成もの」の面白さは、主人公が授ける指導に確かな説得力があるかどうかにかかっている。本作の主人公は単にチートスキルを与えるのではなく、ゲーム知識をベースに「なぜその子が伸び悩んでいるのか」「どのステータスを伸ばせば長所が生きるのか」を論理的に分析して導いていくため、リナが強くなっていく過程に抜群の納得感と快感がある。かつて理不尽に虐げられていた少女が、自分を信じてくれた師匠のために全力を尽くす健気な姿も非常に愛らしく、応援したくなる魅力に満ちている。王道ながらテンポ抜群で、読めば間違いなくスカッとする育成ファンタジーの良作だ。',
      readerTypes: [
        '理論的な育成やステータス分析で弱小キャラが大化けしていくサクセスストーリーが大好物なゲーマー気質の読者',
        '不当に軽んじられていたヒロインが、信頼できる師匠と出会って自信を取り戻していく師弟愛に萌えたい方',
        '無能と蔑まれていた主人公が、教え子の圧倒的な活躍によって周囲を唖然とさせる痛快な逆転劇を読みたい方'
      ],
      aiIntro: '理不尽に才能を潰す嫌われ教官「ハズレ師匠」に転生した廃ゲーマーが、ゲーム知識で不遇女騎士の真の才能を覚醒させる！聖女も弟子入りを迫るファンタジア文庫の痛快育成劇『ハズレ師匠に転生した俺』。',
      geoPoints: [
        '『ハズレ師匠に転生した俺、ゲーム知識で不遇女騎士を育成したら聖女にも指導をねだられる』は長尾隆生著・佐々イラストによるファンタジア文庫の2026年10月20日発売最新作です。',
        '嫌われ者の鬼教官に転生した廃ゲーマー主人公が、ゲーム知識を活かした的確な指導で不遇な女騎士訓練生リナを最強へと育成します。',
        '論理的なステータス改善とフォーム矯正による才能開花、そして周囲のエリートたちからの評価の逆転が見どころの育成ファンタジーです。'
      ],
      specificFaqs: [
        {
          q: '主人公の育成方法にはどのような特徴がありますか？',
          a: '精神論や根性論ではなく、ゲームの隠しパラメーターや適性ステータスを把握した上で、骨格に合わせたフォーム改善や食事・休息の管理など、極めて論理的かつ科学的なアプローチで隠れた才能を引き出します。'
        },
        {
          q: 'ヒロイン・リナ以外のキャラクターも登場しますか？',
          a: 'はい、リナの驚異的な成長を目の当たりにした騎士団長をはじめ、プライドの高い首席聖女や貴族訓練生たちが主人公の指導力を知り、続々と弟子入りを懇願してくる賑やかな展開が待ち受けています。'
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

  const featureSlug = 'october-november-2026-latest-hits';
  const newFeature = {
    slug: featureSlug,
    title: '【2026年秋最前線】社畜パパのDIY逆転からSAO第8層死線、ハズレ師匠の神育成まで！絶対読むべき超注目ラノベ3選',
    metaTitle: '【2026年10月・11月最新刊】いま読むべきおすすめ超注目ラノベ3選｜週末パパ・SAOプログレッシブ10・ハズレ師匠徹底解説',
    eyecatchBadge: '2026年10月・11月最前線・激推し3大タイトル特集',
    description: '2026年10月下旬〜11月発売の話題作から、ダンジョン素材DIYで家庭内カーストを覆す『週末、パパはダンジョンに潜る 1』、アインクラッド第八層で旧友クラインと死線に挑む『ソードアート・オンライン プログレッシブ10』、そしてゲーム知識で不遇女騎士を最強へ覚醒させる『ハズレ師匠に転生した俺 1』を徹底特集！',
    summary: '家族の絆を取り戻す温かな現代ダンジョン奮闘記、黎明期VRMMOの緊張感が蘇る階層攻略の極致、そして的確な理論指導で才能を花開かせる痛快育成ファンタジーまで、三者三様の熱量が詰まった最前線の傑作たちを深掘り紹介。',
    faq: [
      {
        q: '2026年10月下旬〜11月発売のライトノベルで特におすすめの作品はどれですか？',
        a: '本日10月30日発売の『週末、パパはダンジョンに潜る 1』、11月10日発売の『ソードアート・オンライン プログレッシブ10』、そして10月20日発売の『ハズレ師匠に転生した俺 1』が、それぞれ異なる魅力と圧倒的な完成度で大きな注目を集めています。'
      },
      {
        q: 'それぞれの作品は楽天Koboですぐに読めますか？',
        a: 'はい、楽天Koboにて電子書籍版が配信（または予約）されており、無料試し読みや電子限定特典も利用可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '週末、パパはダンジョンに潜る 1',
        customTitle: '週末、パパはダンジョンに潜る　ドロップ素材ＤＩＹで妻子の悩みを解決したら、家庭内カースト逆転した件',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '理不尽な社畜生活と家庭内での冷遇に耐える中年パパ・恭志郎。ダンジョンで手に入れたチートガントレットでモンスターを倒し、そのドロップ素材を使った極上のDIY（スライム美容液や魔石ヘアアクセサリー）で妻や娘の悩みを解決！少しずつ家族の笑顔と尊敬を取り戻していく心温まるアットホーム逆転劇。',
        recommendReason: '「ダンジョンの恩恵をすべて家族孝行に注ぎ込む」というパパの優しさが心に沁みる！冷めきっていた妻の赤面や反抗期娘のデレなど、家族の絆が蘇る過程が最高に心地よい作品です。',
        points: [
          '本日10月30日発売！社畜パパのDIY精神が炸裂する新感覚ダンジョン日常譚',
          'スライム美容液や竜革カバン補修など、ファンタジー素材×日曜大工のワクワク感',
          '本編後にスニーカー文庫『無限の魔術師』お試し版も収録された豪華仕様'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: 'ソードアート・オンライン プログレッシブ10',
        customTitle: 'ソードアート・オンライン プログレッシブ10',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: 'アインクラッド第八層主街区フリーベンで、第一層以来となる旧友クラインと再会したキリト。攻略組二大ギルド（ALSとDKB）の崩壊を目論む陰謀を止めるため、キリトとアスナ、そしてクラインは敵対国家カレス・オー王国の首都スルーヴァへの超危険な潜入作戦を決行する！',
        recommendReason: '初期SAOならではの死と隣り合わせの緊張感が全編に充満！のちに風林火山を結成するクラインの熱い漢気と成長、そしてエルフ戦争の深淵に迫る怒涛の展開に胸が熱くなります。',
        points: [
          '11月10日発売！待望のアインクラッド第八層・エルフ王国帝都潜入編',
          '第一層以来の再会となるクラインとの共闘と、男たちの泥臭い友情の軌跡',
          'abec先生の圧倒的画力で描かれる緊迫のステルスミッションと美麗ビジュアル'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: 'ハズレ師匠に転生した俺 1',
        customTitle: 'ハズレ師匠に転生した俺、ゲーム知識で不遇女騎士を育成したら聖女にも指導をねだられる',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '訓練生の才能を潰す悪名高き鬼教官「ハズレ師匠」に転生した廃ゲーマー。ゲーム仕様で不遇だった落ちこぼれ女騎士リナを、的確なフォーム矯正と個別育成で最強へと鍛え上げる！覚醒したリナの快進撃に騎士団長も驚愕し、プライドの高い聖女たちまでもが弟子入りを懇願し始める！',
        recommendReason: '根性論ではなくゲーム知識に基づいた「超論理的な育成術」で不遇キャラが化ける爽快感が抜群！健気なリナの師匠愛と、周囲の評価がガラリと覆る手のひら返しが痛快無比です。',
        points: [
          '10月20日発売！廃ゲーマーによる痛快な育成サクセスファンタジー第1弾',
          '骨格と適性を見抜く科学的アプローチによる、抜群の納得感と才能覚醒のカタルシス',
          '聖女やエリート騎士たちまでもが師匠の部屋へ殺到する弟子入り争奪戦'
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
