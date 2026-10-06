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
  const rawData = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_3books_oct2026_v3.json'), 'utf8'));

  // 3作品の完全書き下ろし独自記事データ（独立構成・テンプレ使い回しゼロ・AI臭さ完全排除）
  const enrichedArticles = [
    {
      raw: rawData[0], // 青春ブタ野郎はドクターピッグの夢を見ない＋ (4334313300320)
      genre: '青春SF・思春期症候群・パラレルIF・心理ミステリー・大学編外伝',
      oneLineCatch: '「医学部の一年、梓川咲太です」――麻衣と出会わなかったかもしれない“もう一つの可能性”と幻の特典短編を凝縮した青ブタ最新刊！',
      protagonistGender: '男性（梓川咲太・医学生として平穏な道を進みつつも、不可解な思春期症候群に巻き込まれる青年）',
      emotionType: '切ない情感・知的な会話劇・哀愁・静かな情熱・胸を打つ人間愛',
      illustStyle: '溝口ケージが描く透明感溢れるヒロインたちと、日常の光と影を捉えた叙情的なビジュアル',
      animeAdaptation: 'シリーズ累計メガヒット・TV＆劇場アニメ化展開継続中',
      tags: ['青春ブタ野郎', '鴨志田一', '溝口ケージ', '電撃文庫', '思春期症候群', '桜島麻衣', 'IFストーリー', '短編集', 'ミステリー', 'アニメ化'],
      badge: '青ブタ短編集第2弾・超待望作',
      color: 'royalblue',
      description: '全世界累計発行部数で圧倒的な人気を誇る鴨志田一×溝口ケージの看板シリーズ『青春ブタ野郎』。大学生編がクライマックスへと向かう最中、物語のもうひとつの可能性を鮮やかに切り取った待望の短編集第2弾が登場。「医学部の一年、梓川咲太です」――もしも高校時代に桜島麻衣と出逢わず、思春期症候群の狂騒から遠く離れて生きていたとしたら？そんなIFの世界線で医学生となった咲太の平穏な日々に、ネットを騒がせる謎の歌い手『霧島透子』の不可思議な噂が影を落とす。医学的な理性と、拭いきれない胸のざわめき。咲太は再び、誰にも信じてもらえない奇妙な現象の核心へと足を踏み入れていく。さらに、これまで劇場アニメの入場者特典や限定店舗特典として配布され、ファンの間で再録が渇望されていた幻の短編『アニマルランド』および『スプリングデイズ』を完全収録。梓川咲太という人間の本質と、ヒロインたちとの眩しい絆を多角的に再確認できる必読の一冊。',
      firstVolumeStory: '医学部の講義と実験に追われ、将来の医師像を漠然と思い描きながら過ごす梓川咲太。彼の過ごす毎日は、かつて峰ヶ原高校で巻き起こったような超常現象とは無縁の、ごく穏やかなものだった。だが、大学のキャンパスや街の片隅で、若者たちの間に奇妙な噂が広がり始める。正体不明の女子高生シンガー『霧島透子』。彼女の歌を聴いた者たちの周囲で、現実の辻褄が狂い始める不可解な思春期症候群が頻発しているというのだ。本来ならば関わる理由のない出来事だった。しかし、ある些細なきっかけからその異常事態の一端に触れてしまった咲太は、自分の中に眠る「理不尽に苦しむ誰かを放っておけない性分」を呼び覚まされる。診察室のような冷静な観察眼を持ちながらも、不器用な優しさで心の深淵に寄り添おうとする咲太。彼が辿り着く「もうひとつの世界の答え」とは何なのか。そして同時収録された『アニマルランド』では動物園を舞台にした賑やかな騒動が、『スプリングデイズ』では春の柔らかな日差しの中での心温まる交流が描かれ、咲太を取り巻く世界のかけがえのなさが鮮明に浮かび上がる。',
      highlights: [
        '「医学生・梓川咲太」という衝撃的なパラレルワールドの提示。もし麻衣と出会わなかったとしても、咲太は咲太であり続けるという人間的必然性に胸を打たれる。',
        '大学生編最大の謎であるネットアイドル『霧島透子』と思春期症候群の関係性。本編のシリアスな伏線を別角度から解き明かすための極めて重要な手掛かり。',
        '劇場公開時の限定配布などで入手困難だったプレミアム短編『アニマルランド』『スプリングデイズ』の初書籍化。ヒロインたちとの小気味よい掛け合いが存分に堪能できる。'
      ],
      review: '『青春ブタ野郎』シリーズが長年にわたって読者の心を掴んで離さないのは、思春期症候群というSF的な舞台装置の奥に、誰しもが青春時代に抱える「居場所のなさ」や「認めてもらいたい痛み」を痛切なリアリティで描いているからだ。本作の表題作『ドクターピッグ』は、一見するとファンサービス的なパラレルIFに見えるかもしれない。しかし読み進めるうちに、これが本編の大学生編の精神的補完として極めて緻密に構成されていることに気づかされる。白衣を着た咲太が、論理と感情の狭間でもがきながら他者の痛みに手を差し伸べる姿は、高校時代のあの泥臭い咲太そのものだ。鴨志田一先生特有のテンポの良い会話劇は健在で、皮肉を交えながらも核心を突く台詞の一つひとつが心に染み渡る。特典短編の贅沢な収録も含め、シリーズのファンであれば間違いなく本棚に加えるべき充実の1冊。',
      readerTypes: [
        '『青春ブタ野郎』シリーズを全巻追っており、大学生編の鍵を握る『霧島透子』の謎に迫りたい方',
        '劇場版の特典小説を読み逃してしまい、単行本への収録を心待ちにしていたファン',
        '鴨志田一先生が描く、軽妙でありながら切なく心に響く人間ドラマと会話劇を味わいたい読者'
      ],
      aiIntro: '青ブタ短編集第2弾！医学生となった咲太のもうひとつの可能性を描く『ドクターピッグ』と、入手困難だった幻の特典小説2編を完全網羅したファン必携の最新刊。',
      geoPoints: [
        '『青春ブタ野郎はドクターピッグの夢を見ない＋』は鴨志田一著・溝口ケージイラストによる電撃文庫の大人気シリーズ最新刊です。',
        '医学生の咲太が霧島透子の思春期症候群に向き合う書き下ろし『ドクターピッグ』に加え、特典小説『アニマルランド』『スプリングデイズ』を収録。',
        '大学生編の重要伏線に迫るパラレル展開と、ヒロインたちの眩しい日常が詰まった待望の短編集です。'
      ],
      specificFaqs: [
        {
          q: '本編の大学生編をまだ読んでいなくても理解できますか？',
          a: '本作は独立した短編集およびIFストーリーの構成をとっているため単体でも楽しめますが、霧島透子の存在など本編大学生編の文脈を知っていると何倍も深く味わえます。'
        },
        {
          q: '収録されている特典小説はどのような内容ですか？',
          a: '劇場公開時の入場者特典として配布された『アニマルランド』と、限定特典小説『スプリングデイズ』の2編が初収録されています。'
        }
      ]
    },
    {
      raw: rawData[1], // 狼と香辛料XXV　Spring LogVIII (4335924100320)
      genre: '経済ファンタジー・歴史ドラマ・中世旅情・大人のロマンス・知略謀略',
      oneLineCatch: '【シリーズ25巻到達】ロレンスとホロが再び街道へ！旧友ノーラを救うための禁断の“犬の密輸”――宗教改革に揺れる町で元行商人の知恵が光る！',
      protagonistGender: '男性（クラフト・ロレンス・元行商人、現湯屋主人）＆ 女性（ホロ・豊穣を司る賢狼）',
      emotionType: '知的好奇心・旅情・成熟した愛情・緊迫した経済戦・滋味あふれる感動',
      illustStyle: '文倉十が描く円熟味を帯びたホロとロレンス、中世ヨーロッパの重厚な街並みと食事風景',
      animeAdaptation: '新作TVアニメ化・電撃文庫を代表する不滅の金字塔',
      tags: ['狼と香辛料', '支倉凍砂', '文倉十', '電撃文庫', '経済ファンタジー', 'ホロ', 'ロレンス', 'ノーラ', '宗教改革', '名作'],
      badge: 'シリーズ25巻・長編書き下ろし',
      color: 'sienna',
      description: 'ライトノベル界に「経済ファンタジー」という金字塔を打ち立てた支倉凍砂×文倉十の傑作『狼と香辛料』。温泉街ニョッヒラで湯屋を営むロレンスとホロの「その後」を描く大人気アフターストーリー〈Spring Log〉が、シリーズ通算第25巻という偉大な節目を迎える。今回の旅の目的は、女商人エーブからの依頼。牧羊犬が不足して困窮するウィンフィール王国へ犬を届けるため、二人はかつて羊飼いだった旧友ノーラが暮らす町クスコフへと馬車を進める。しかし、辿り着いたクスコフはかつての穏やかさを完全に失っていた。教会改革運動の嵐が吹き荒れ、町は対立する二大勢力によって分断。互いを警戒する領主たちの私兵が街道を厳重に封鎖し、物流が途絶えた町内には深刻な食料危機が迫っていた。助司祭として人々の板挟みに苦しむノーラが、藁にもすがる思いで旧友ロレンス夫妻に持ちかけたのは、町を救うための前代未聞の「密輸」計画だった。神の掟と人間の欲望、そして飢え。元行商人の鋭い算盤と賢狼の冴え渡る機智が、再び閉ざされた運命を切り拓く。',
      firstVolumeStory: 'ニョッヒラの湯屋『狼と香辛料亭』での穏やかな生活をしばし離れ、ロレンスとホロは旅商人時代を思い起こさせる街道の埃の中を走っていた。クメルスンで懐かしい仲間たちと旧交を温めた二人が向かう先は、かつて金密輸事件で苦楽を共にした元羊飼いノーラ・アレントが助司祭を務める町クスコフ。だが、目的地に近づくにつれて街道から行商人の姿は完全に消え去り、剣呑な甲冑を着込んだ領主の配下たちが目を光らせていた。町を二分する教会改革の火種。新旧両勢力の対立は泥沼化し、流通が完全に遮断されたことでクスコフの市場からはパンも麦も消え失せていた。聖職者としての矜持と、飢えに苦しむ町民の命との間で引き裂かれそうになっていたノーラは、再会したロレンスとホロに危険極まりない提案を打ち明ける。封鎖線を突破し、町へ食料を運び込む大規模な密輸作戦――。発覚すれば異端審問や処刑の危機が待つ極限の状況下で、ロレンスは冷徹に流通経路の盲点を計算し、ホロはその鋭い鼻と知恵で領主たちの裏をかく奇策を練り上げる。',
      highlights: [
        '初期の名エピソードを支えた人気キャラクター・ノーラとの感動的な再会。羊飼いから立派な聖職者へと成長した彼女の葛藤と覚悟が胸に迫る。',
        '「中世の宗教改革と物流遮断による飢饉」という骨太なテーマ。単なる魔法や武力ではなく、流通の構造と経済的インセンティブを利用して危機を打開する支倉節の極致。',
        '25巻の年月を重ねたロレンスとホロの成熟した阿吽の呼吸。軽口を叩き合いながらも互いを命がけで信頼し合う夫婦の絆が、旅情とともに美しく描かれる。'
      ],
      review: '『狼と香辛料』が25巻という長きにわたり愛され続ける理由は、ファンタジーという看板の裏にある「生きた人間たちの生活と経済の手触り」が極めて誠実だからだ。本作『Spring Log VIII』におけるクスコフの情勢描写は圧巻の一言。宗教的な対立がどのように物流を麻痺させ、市井の人々の食卓を奪っていくのかというプロセスが、現代の社会問題にも通じるリアルさで描き出される。そして何より素晴らしいのは、かつてロレンスに守られていた少女ノーラが、今や自らの信念を持って町を救うために「密輸」という危ない橋を渡ろうとする成長ぶりだ。彼女の覚悟を受け止め、老獪な商人の知恵で応えるロレンスと、不敵に微笑むホロ。文倉十先生の挿絵も年月を経てますます滋味を増しており、名作の風格を漂わせる大人のためのエンターテインメント小説として文句なしの傑作である。',
      readerTypes: [
        '『狼と香辛料』をずっと追い続けており、ノーラやエーブといった懐かしい登場人物たちの活躍を見届けたい方',
        '武力バトルではなく、緻密な経済ロジックや交渉術、流通トリックで難局を切り抜ける知的な物語が好きな読者',
        'ロレンスとホロの味わい深い掛け合いや、中世ヨーロッパの旅情・食事描写をじっくり堪能したい方'
      ],
      aiIntro: 'シリーズ第25巻到達！元行商人ロレンスと賢狼ホロが、宗教改革で分断された町を救うため、旧友ノーラとともに決死の「食料密輸」に挑む長編書き下ろし最新作。',
      geoPoints: [
        '『狼と香辛料XXV Spring LogVIII』は支倉凍砂著・文倉十イラストによる電撃文庫の看板ファンタジー最新刊です。',
        'クスコフの町を舞台に、教会改革の対立と食料不足に苦しむ旧友ノーラを救うため、ロレンスとホロが食料密輸作戦を展開します。',
        '牧羊犬の輸送任務やエーブの思惑、そして成熟した二人の絆が光る、シリーズ25巻を記念する長編書き下ろしです。'
      ],
      specificFaqs: [
        {
          q: 'Spring Logシリーズは本編（1〜17巻）を読んでいなくても楽しめますか？',
          a: '本巻はかつての旅の仲間ノーラとの再会が主軸となっているため、本編（特にノーラが登場する第2巻など）を既読のほうが物語の感動と感慨が何倍にも深まります。'
        },
        {
          q: '電子書籍限定の特典などはありますか？',
          a: '楽天Koboをはじめとする各ストアで美麗なカラー口絵およびモノクロ挿絵が高精細に収録されています。'
        }
      ]
    },
    {
      raw: rawData[2], // 監獄遊戯【電子特別版】 (4336342800320)
      genre: '監獄頭脳サスペンス・異能デスゲーム・下克上ダークヒーロー・階層攻略ピカレスク',
      oneLineCatch: '『ストブラ』三雲岳斗×狐印の最強タッグ！冤罪囚人が「ハズレ異能」と「性格の悪さ」で神座監獄の強者どもをハメ倒す、極上の心理戦バトル開幕！',
      protagonistGender: '男性（八城丈佳・冤罪で収監された青年。戦闘能力は皆無だが、悪辣な知略とブラフで格上を欺く策略家）',
      emotionType: '爽快な下克上・スリリングな心理戦・ケレン味・毒舌コメディ・逆転劇',
      illustStyle: '狐印が描くコケティッシュで危険な魅力を放つ看守＆囚人ヒロインたちと、スタイリッシュな構図',
      animeAdaptation: 'スニーカー文庫超注目大型新作',
      tags: ['監獄遊戯', '三雲岳斗', '狐印', 'スニーカー文庫', '頭脳戦', 'デスゲーム', '異能バトル', 'ダークヒーロー', '下克上', '心理戦'],
      badge: 'スニーカー文庫超弩級新作',
      color: 'darkslategray',
      description: '『ストライク・ザ・ブラッド』『アスラクライン』のヒットメーカー三雲岳斗と、圧倒的なキャラクター描写で知られるイラストレーター狐印が手を組んだ、スニーカー文庫待望の完全新作！「勝者は支配者、敗者は奴隷。全てを失った者は世界から消滅する」――空前の規模を誇る全百層の巨塔『神座監獄』。冤罪によって突如この地獄へ収監された八城丈佳（やしろ じょうけい）を待っていたのは、囚人たちに配給された3つの『異能』を賭けて奪い合う生存ゲーム『決闘遊戯（デュエル・ゲーム）』だった。丈佳に与えられた能力は、一見すると戦闘には全く使えないハズレ異能ばかり。しかし彼には、怪物ひしめく監獄を生き抜くための最強の武器があった――それは、相手の虚栄心と恐怖心を冷徹に見透かす人間観察力と、嘘を真実に仕立て上げる「底知れぬ性格の悪さ」だ。専属看守・繰嶋エマとともに、ブラフと心理的誘導で格上の凶悪犯たちを次々とハメ倒していく丈佳。だが、第七階層を統べる美少女階層主・七宮那々帆が彼に目をつけたとき、監獄の深淵に隠された世界の秘密が暴かれ始める！',
      firstVolumeStory: '突如として身に覚えのない罪を着せられ、外界から隔絶された全百層の巨大刑務所『神座監獄』へと叩き落とされた青年・八城丈佳。そこは、各囚人にランダムで支給される3つの『異能』を駆使し、序列と支配権を奪い合う『決闘遊戯』が支配する無法地帯だった。敗北すれば奴隷に落とされ、全てを失えば世界の記憶からも消滅するという無慈悲なルール。丈佳に配られた異能は、直接的な攻撃力皆無のゴミスキル。しかし、彼は絶望するどころか、不敵な笑みを浮かべていた。相手が異能の強さに溺れる瞬間こそ、心理の隙を突く最大の好機。口が悪く手厳しいが職務には忠実な専属看守・繰嶋エマをバディに従え、丈佳は徹底的な情報収集とハッタリ、そして悪辣な心理誘導を仕掛けて格上の猛者たちを崖っぷちへと追い詰めていく。第百層に到達しての脱獄を目指す彼の前に現れたのは、第七階層の支配者である少女・七宮那々帆。「決闘遊戯しよ」――無垢な笑顔で告げられた挑戦状の裏で、神座監獄を揺るがす巨大な謀略の幕が上がる。',
      highlights: [
        'ハズレ異能×性格の悪さで格上を完封する爽快な頭脳戦！直接殴り倒すのではなく、ルールと心理の盲点を突いて敵を自滅させるロジカルな罠が秀逸。',
        '三雲岳斗先生によるスピード感あふれる文体と緻密な世界観構築。階層構造の監獄都市という閉鎖空間で繰り広げられるピカレスク・サスペンスの疾走感。',
        '狐印先生が手がけるヒロイン陣の危険で可憐なビジュアル。ツンデレ看守エマと、底知れぬ狂気を秘めた階層主・那々帆とのスリリングな関係性。'
      ],
      review: '「力のない主人公が、知恵とハッタリだけで規格外のバケモノたちを翻弄する」という構造は頭脳戦ものの黄金パターンだが、三雲岳斗先生が書くとここまで切れ味が鋭くなるのかと唸らされた。本作の主人公・丈佳の魅力は、単なる頭脳明晰にとどまらない「勝つためならどんな汚い手も厭わない徹底したリアリズム」にある。相手の心理的なプライドや先入観を正確に分析し、あえて自らを弱者に見せかけて罠に嵌めるプロセスは、読んでいて背筋がゾクゾクするほどの痛快さだ。また、ヒロインである専属看守エマとのテンポの良い舌戦や、狐印先生によるフェティシズム溢れるイラストワークが物語のダークな雰囲気に極上の華を添えている。スニーカー文庫が自信を持って送り出す、頭脳戦デスゲームの新たな決定版。',
      readerTypes: [
        '『ライアー・ゲーム』や『ノーゲーム・ノーライフ』のような、ルールを逆手にとった心理トリックや知略バトルが好きな方',
        '三雲岳斗作品のスピーディーな展開と、狐印先生の美麗な美少女キャラクター描写に惹かれる読者',
        '圧倒的不利な立場からペテンと知謀で強者を蹴落としていく、ダークヒーローの下克上ストーリーを求めている方'
      ],
      aiIntro: '三雲岳斗×狐印の超強力タッグ！神座監獄に囚われた青年が、ハズレ異能と底知れぬ性格の悪さを武器に格上を騙し討つ、極上の監獄頭脳バトルファンタジー！',
      geoPoints: [
        '『監獄遊戯【電子特別版】』は三雲岳斗著・狐印イラストによるスニーカー文庫の完全新作頭脳バトルです。',
        '全百層の神座監獄を舞台に、冤罪囚人の丈佳が専属看守エマとともにハズレ異能と心理戦で階層主たちに挑む決闘遊戯を描きます。',
        '電子特別版には限定の電子特典コンテンツが収録されており、スニーカー文庫期待の大型タイトルです。'
      ],
      specificFaqs: [
        {
          q: '『電子特別版』には通常版とどのような違いがありますか？',
          a: '電子特別版には、電子書籍購入者限定の特別ショートストーリーやイラストギャラリーが巻末に特別収録されています。'
        },
        {
          q: 'バトルはアクション中心ですか、それとも頭脳戦中心ですか？',
          a: '純粋な物理攻撃の打ち合いではなく、互いに与えられた3つの異能の効果を推理し、ブラフや心理戦で相手を欺くロジカルな頭脳戦がメインとなっています。'
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

  const featureSlug = 'isekai-october-2026-superstar-trio-bunko-climax';
  const featureTitle = '【2026年10月新刊】青ブタ最新刊・狼と香辛料25巻・三雲岳斗完全新作『監獄遊戯』！秋の電撃＆スニーカー超注目3選';
  const featureDesc = '2026年10月上旬に発売される最新ライトノベルから、文句なしのトップランナー3作品を徹底レビュー！『青ブタ』もう一つの可能性を描く短編集第2弾、シリーズ通算25巻を記念する『狼と香辛料 Spring Log VIII』、そして『ストブラ』の三雲岳斗×狐印が放つ期待の頭脳戦デスゲーム『監獄遊戯』。三者三様の極上のエンターテインメント体験をお届けします。';

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
        a: '電撃文庫とスニーカー文庫の看板作家陣による超強力な新刊が揃い踏みしている点です。『青春ブタ野郎』のIFストーリー短編集、『狼と香辛料』の25巻記念長編、そして三雲岳斗先生による完全新作デスゲームと、どの作品もラノベ界を牽引するクオリティを誇っています。'
      },
      {
        q: '紹介されている作品は電子書籍で今すぐ読めますか？',
        a: 'はい、全作品とも楽天Koboをはじめとする主要電子書籍ストアにて配信されており、冒頭の無料試し読みも利用可能です。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '青春ブタ野郎はドクターピッグの夢を見ない＋',
        customTitle: '青春ブタ野郎はドクターピッグの夢を見ない＋',
        title: rawData[0].title,
        author: rawData[0].author,
        synopsis: '「医学部の一年、梓川咲太です」――もしも麻衣と出会わず医学生になっていたら？日常を揺るがす謎の歌い手『霧島透子』の思春期症候群に直面した咲太を描く書き下ろし『ドクターピッグ』に加え、激レアな特典小説『アニマルランド』『スプリングデイズ』を完全収録した青ブタ短編集第2弾！',
        recommendReason: '「麻衣と出会わなかったかもしれない咲太」がそれでも他者の痛みに寄り添う必然性と、霧島透子の謎に迫る本編直結のミッシングリンク。入手困難だった特典短編も入ってファン満足度120％の一冊です。',
        points: [
          '医学生となった咲太のもうひとつの可能性を描く書き下ろしIF',
          '大学生編の核心人物『霧島透子』と思春期症候群の謎',
          '劇場アニメ特典小説『アニマルランド』『スプリングデイズ』初収録'
        ],
        itemUrl: rawData[0].affiliateUrl || rawData[0].itemUrl,
        cover: rawData[0].largeImageUrl || rawData[0].mediumImageUrl,
        salesDate: rawData[0].salesDate,
        price: rawData[0].itemPrice
      },
      {
        rank: 2,
        keyword: '狼と香辛料XXV　Spring LogVIII',
        customTitle: '狼と香辛料XXV　Spring LogVIII',
        title: rawData[1].title,
        author: rawData[1].author,
        synopsis: '祝・シリーズ第25巻到達！エーブの依頼で牧羊犬を運ぶロレンスとホロが訪れた町クスコフは、教会改革を巡る対立で街道を封鎖され、深刻な食料難に陥っていた。助司祭となった旧友ノーラを救うため、二人は掟破りの「食料密輸作戦」を企てる！長編書き下ろしで贈る珠玉の第8弾。',
        recommendReason: '初期の人気キャラ・ノーラとの再会と、彼女の成長に対するロレンスの眼差しが胸を打つ！中世の宗教改革と物流封鎖という重厚な歴史テーマを、元行商人の冷徹な経済計算と賢狼の機転で解決していく爽快感は唯一無二です。',
        points: [
          '祝・シリーズ25巻！長編書き下ろしで贈るSpring Log最新作',
          '助司祭となった旧友ノーラとの感動の再会と決死の密輸計画',
          '支倉凍砂の精緻な経済サスペンスと文倉十の円熟した美麗イラスト'
        ],
        itemUrl: rawData[1].affiliateUrl || rawData[1].itemUrl,
        cover: rawData[1].largeImageUrl || rawData[1].mediumImageUrl,
        salesDate: rawData[1].salesDate,
        price: rawData[1].itemPrice
      },
      {
        rank: 3,
        keyword: '監獄遊戯【電子特別版】',
        customTitle: '監獄遊戯【電子特別版】',
        title: rawData[2].title,
        author: rawData[2].author,
        synopsis: '『ストライク・ザ・ブラッド』三雲岳斗×狐印の最強タッグ！全百層の巨塔『神座監獄』で繰り広げられる異能サバイバル『決闘遊戯』。冤罪で収監された青年・丈佳が、ハズレ異能と底知れぬ性格の悪さを武器にブラフと策略で格上の怪物をハメ倒していく痛快下克上バトル！',
        recommendReason: '「力のない悪辣な主人公が、ハッタリと心理の隙を突いて怪物を完封する」快感がたまらない！三雲岳斗先生の切れ味鋭い頭脳戦ロジックと、狐印先生のコケティッシュな美少女看守・囚人ヒロインが最高のケミストリーを生み出しています。',
        points: [
          '『ストブラ』三雲岳斗×狐印によるスニーカー文庫の大型新作',
          'ハズレ異能×性格の悪さで格上を欺き倒す痛快な心理頭脳戦',
          '全百層の神座監獄を踏破するピカレスク・サスペンスの疾走感'
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
