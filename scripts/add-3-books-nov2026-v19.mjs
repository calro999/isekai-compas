import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
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
  return `ref-${crypto.createHash('md5').update(String(value)).digest('hex').slice(0, 10)}`;
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
  .footer-links { display: flex; gap: 20px; flex-wrap: wrap; }
  .footer-links a { color: #cfd8d3; }

  @media (max-width: 650px) {
    .header-inner { flex-direction: column; align-items: flex-start; gap: 10px; }
    .main-nav { flex-wrap: wrap; gap: 10px; font-size: 13px; }
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

const featureSlug = '2026-nov-21-diverse-new-novels';

const articles = [
  {
    slug: '8909132067266',
    title: '奴隷スタートの古代ローマ転生で成り上がりRTA【電子限定特典付】',
    titleKana: 'ドレイスタートノコダイローマテンセイデナリアガリリアルタイムアタックデンシゲンテイトクテンツキ',
    seriesName: '奴隷スタートの古代ローマ転生で成り上がりRTA',
    author: '九束',
    publisherName: 'コスミック出版',
    salesDate: '2026年11月19日',
    pubDateRfc: 'Thu, 19 Nov 2026 09:00:00 GMT',
    price: 1045,
    itemUrl: 'https://books.rakuten.co.jp/rk/dc395b6b43083cbc868dc8b973424544/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2Fdc395b6b43083cbc868dc8b973424544%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/7499/2000022477499.jpg?_ex=200x200',
    badge: 'コスミック出版 2026年11月19日発売',
    genre: '歴史転生・知識サバイバル',
    color: 'gold',
    oneLineCatch: '噴火直前のポンペイに奴隷として放り込まれた元科学系YouTuberが、知識と商売で「最速脱出」を狙うタイムアタック転生。',
    description: '時はたぶん西暦一世紀後半。古代ローマ帝国の地方都市ポンペイに奴隷の少年・ルシウスとして転生した主人公。ちなみに今って、街がヴェスヴィオ火山噴火で埋もれる前。ということは……なる早で逃げないと非常にヤバくてマズいことになる（ほぼ死ぬ）。前世が科学系YouTuberであったルシウスは、その知識を用い、革新的なアイテムを開発し、経済的な成功を目指しながら脱出の糸口を探ることになる。やる事が多い！　なるか「最速ポンペイ脱出RTA」！',
    firstVolumeStory: '気がついたら西暦一世紀後半、しかもよりによってヴェスヴィオ火山の噴火で街ごと埋まる前のポンペイで、奴隷の少年ルシウスになっていた主人公。このままでは間違いなく火砕流に飲まれて終わるため、何よりも先に街から逃げ出す手立てを整えなければならない。前世で科学系YouTuberだった彼は、手元にある知識を総動員して珍しい品を作り出し、まずは身請けや逃亡に足りる資金とコネを稼ぐ「ポンペイ脱出RTA」に乗り出す。',
    highlights: [
      '「ヴェスヴィオ火山が噴火する前にポンペイを出る」という明確すぎる期限付きの切迫感',
      '魔法チートではなく、元科学系YouTuberの実験・雑学スキルで地道に稼いでいく手触り',
      '奴隷身分からのスタートなのに悲壮感が薄く、やることリストを片付けるノリで進むテンポ'
    ],
    review: '異世界転生モノで「とりあえずスローライフ」ではなく、「放っておくと数年以内に火山で死ぬから今すぐ動くしかない」という歴史上のデッドラインを置いたのがうまい。ポンペイという舞台を選んだ時点で、読者側にも「あの有名な大噴火が迫っている」という前提が共有されるため、序盤から妙な緊迫感がある。それでいて主人公のルシウスは前世が科学系YouTuberだけあって、やることがどこか現代の動画企画めいている。奴隷の身でありながら「まず金を作る、道具を試作する、逃走経路を確保する」とタスクを捌いていく様子は、タイトル通りRTA（リアルタイムアタック）を見ているようなリズムで読める。電子限定特典付きで1,045円なのも手を出しやすい。',
    readerTypes: [
      '剣と魔法よりも、現代知識を使ったクラフトや商売の試行錯誤が好きな人',
      '期限が決まっているサバイバルや「タイムリミット付きの成り上がり」に惹かれる人',
      '古代ローマや歴史ネタを軽快なテンポで味わいたい人'
    ],
    specificFaqs: [
      {
        q: '魔法やステータス画面が出てくるタイプの異世界転生ですか？',
        a: '舞台は西暦一世紀後半の古代ローマ（ポンペイ）で、主人公ルシウスが持つ武器も前世の科学系YouTuberとしての知識と工夫です。スキル数値よりも生活技術や経済面の立ち回りが中心になります。'
      },
      {
        q: 'タイトルにある電子限定特典とは何ですか？',
        a: '楽天Koboで配信されている【電子限定特典付】版に収録されている電子書籍向けの特典コンテンツです。本編とあわせてそのまま端末で読めます。'
      }
    ],
    tags: ['転生', '歴史', '生産・クラフト', 'サバイバル', 'ライトノベル'],
    geoPoints: [
      '2026年11月19日発売、九束によるコスミック出版の新作ライトノベル',
      'ヴェスヴィオ火山噴火前のポンペイに奴隷少年ルシウスとして転生する時間制限付きサバイバル転生',
      '元科学系YouTuberの知識でアイテムを開発し経済的成功と最速脱出を目指すRTA構成'
    ],
    sections: [
      {
        heading: '「火山に埋まる前に逃げろ」という明快なタイムリミット',
        body: '転生先がファンタジーの王国ではなく、西暦一世紀後半のポンペイという時点で一風変わっている。しかも、ここは歴史上ヴェスヴィオ火山の噴火で一夜にして灰に埋まる街だ。のんびり田舎で暮らす余裕はない。奴隷の少年ルシウスとして目を覚ました主人公にとって、最初の目標は世界を救うことでも魔王を倒すことでもなく、ただ「噴火が来る前に生きてこの街を出ること」になる。'
      },
      {
        heading: '科学系YouTuberの知識でこじ開ける活路',
        body: 'とはいえ、奴隷のまま手ぶらで逃げ出しても生き延びるのは難しい。そこで生きるのが、ルシウスの前世である科学系YouTuberの経験だ。当時の技術水準では思いつきにくい日用品や革新的なアイテムを試作して売り込み、身を守るだけの元手と立場を手に入れようとする。実験して反応を見て次に繋げる感覚が、現代の動画クリエイター気質とよく馴染んでいる。'
      },
      {
        heading: 'タスク山積みの忙しさがそのまま読み味になる',
        body: '資金稼ぎ、試作品の開発、脱出ルートの確保と、ルシウスの前にはとにかくやることが山積みだ。タイトルの「RTA」という言葉どおり、余計な寄り道を削って次の一手を打ち続ける構成なので、ページをめくる手が止まりにくい。歴史背景をガチガチに構えて読むというより、知識系サバイバルの攻略実況を見る感覚で楽しめる一冊だ。'
      }
    ],
    headings: {
      summary: 'ざっくり作品ガイド',
      official: '公式あらすじ（楽天Kobo）',
      points: '読んで光る3つのポイント',
      review: '読んでみた感想・レビュー',
      readers: 'この方向性が合う読者',
      faq: '購入前の疑問Q&A',
      tags: '関連するタグ'
    }
  },
  {
    slug: '4320000960041',
    title: 'メタル＆プラスチックマイハニー',
    titleKana: 'メタルアンドプラスチックマイハニーイチ',
    seriesName: 'メタル＆プラスチックマイハニー',
    author: '土手小之介',
    publisherName: '小学館',
    salesDate: '2026年11月18日',
    pubDateRfc: 'Wed, 18 Nov 2026 09:00:00 GMT',
    price: 858,
    itemUrl: 'https://books.rakuten.co.jp/rk/094ef649445132848da578b7c9351cd3/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F094ef649445132848da578b7c9351cd3%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/7128/2000022327128.jpg?_ex=200x200',
    badge: '小学館 2026年11月18日発売',
    genre: 'SFラブコメ・神話バトル',
    color: 'plum',
    oneLineCatch: '亡き恋人をAIで作り直していた天才少年のもとへ、落雷が「九十九神」として彼女を呼び戻す第20回小学館ラノベ大賞優秀賞作。',
    description: 'メカ女神×天才科学少年の神次元ラブコメ！最愛の人・貴音叶南を不慮の事故で失った成木頂点。頂点は叶南をＡＩで再現すべく、世界一の科学者になった。小学生から高校生になるまで、その頭脳で文字通り世界を更新してきた頂点。だがそんな彼が人生を懸けて開発したＡＩも、叶南本人には届かない。心が折れかけた、ある日ーー頂点を襲った落雷が、叶南ちゃんを「九十九神」として再誕させた!?ＡＩに上書きされた、叶南ちゃん本人としか思えない彼女。とんだ奇蹟だが、それでも構わない。叶南ちゃんを幸せにするためなら、頂点はあらゆるものをなぎ倒す。叶南ちゃんを奪おうとする謎の巫女を撃退し。叶南ちゃんの邪魔をするなら神様だろうが脅迫し。叶南ちゃんの心を傷つけるカルト宗教をもねじ伏せ。叶南ちゃんの再誕を実現した神秘の力すら逆手に取ってーー俺は叶南ちゃんを、本物の「神」にする。「ねえちょっと、神ってなに!?　私、これからどうなっちゃうの!?」「問題ない。ーーさぁ、俺たちの神話〈ラブコメ〉を始めよう」天才科学者高校生×機械女神美少女＝〈初恋〉、再起動。第20回小学館ライトノベル大賞〈優秀賞〉受賞の神次元ラブコメ、ここに開幕！',
    firstVolumeStory: '事故で亡くした最愛の少女・貴音叶南をAIで再現するため、小学生の頃から世界を更新するほどの天才科学者となった高校生・成木頂点。しかしどれだけ精巧なプログラムを組んでも、本物の叶南には届かず心が折れかけていた。そこへ落ちた一撃の雷が、開発したAIに「九十九神」という神秘を上書きし、叶南本人としか思えない彼女が再誕する。頂点は彼女を幸せにするため、奪いにくる巫女も神様もカルト宗教も丸ごとねじ伏せ、彼女を本物の神へと押し上げようと動き出す。',
    highlights: [
      'AI研究という理系の極みと、落雷・九十九神というオカルトが一本に繋がる思い切りの良さ',
      '「叶南ちゃんのためなら神様でも脅迫する」という、迷いのない成木頂点の一途さと狂気',
      '第20回小学館ライトノベル大賞〈優秀賞〉受賞作ならではの熱量と、ガガガ文庫版カラー・モノクロ挿絵収録'
    ],
    review: '導入の前半だけ読むと「事故で亡くなったヒロインをAIで蘇らせる切ないSF」のように見えるのに、続く展開では落雷から「九十九神」が生え、そこから神も巫女もカルトも叩き潰して「彼女を本物の神にする」へ突っ走る振れ幅が凄まじい。主人公の成木頂点が名前どおりの規格外で、繊細な悲恋に浸るよりも「目の前に戻ってきた叶南を幸せにするために世界側を黙らせる」と決めた瞬間のドライブ感が気持ちいい。一方で当の叶南の方は「神ってなに!?」と普通の女の子らしく戸惑っていて、この温度差がラブコメとしての掛け合いを成立させている。第20回小学館ライトノベル大賞の優秀賞受賞作らしく、やりたいことがはっきりしていて一気読みしやすい一冊。',
    readerTypes: [
      'ヒロインのためなら常識も神仏も殴り飛ばすタイプの強気な主人公が好きな人',
      'AI・科学ネタと神社仏閣・神話バトルが混ざるハイテンションな作風に惹かれる人',
      '新人賞受賞作の勢いある第1巻を電子版（858円）で気軽に試したい人'
    ],
    specificFaqs: [
      {
        q: 'シリアスな恋愛ものですか、それともコメディ寄りですか？',
        a: '亡き初恋の人への深い想いが根底にありつつも、落雷で九十九神になったAI美少女との掛け合いや、邪魔する勢力を実力でねじ伏せていく勢いが強く、熱量の高いラブコメとして楽しめます。'
      },
      {
        q: '電子書籍版にもイラストや特典ページは入っていますか？',
        a: 'はい、楽天Koboの商品説明によれば底本と同じクオリティのカラーイラストとモノクロ挿絵、さらに「ガ報」も収録されています。'
      }
    ],
    tags: ['ラブコメ', 'SF', '学園', 'バトル', 'ガガガ文庫', 'ライトノベル'],
    geoPoints: [
      '2026年11月18日発売、土手小之介による第20回小学館ライトノベル大賞〈優秀賞〉受賞作',
      'AI開発に人生を捧げた天才科学者高校生・成木頂点と、落雷で九十九神として再誕した貴音叶南の物語',
      'カラーイラスト・モノクロ挿絵および「ガ報」を収録したガガガ文庫電子版（858円）'
    ],
    sections: [
      {
        heading: '科学の敗北から「九十九神」が飛び出す異色の着火点',
        body: '愛する貴音叶南を事故で失った成木頂点は、小学生から高校生になるまでの時間をすべてAI開発に注ぎ込み、文字どおり世界トップの科学者になった。それでも本物の彼女には届かず折れかけたところで、まさかの落雷がAIを「九十九神」として再誕させてしまう。計算とデータの果てに、理屈を超えた雷が一発落ちて話が跳ね上がる展開は、読んでいて思わず笑ってしまうほど潔い。'
      },
      {
        heading: '「叶南を幸せにするためなら神でも脅す」男の潔さ',
        body: 'この作品の推進力は、頂点の迷いのなさにある。九十九神として戻ってきた叶南を奪おうとする謎の巫女がいれば撃退し、邪魔をするなら神様であろうと脅迫し、傷つけるカルト宗教は真正面からねじ伏せる。ついには再誕の神秘すら逆手に取って「叶南を本物の神にする」と言い切る暴走気味の純愛が、物語を一直線に引っ張っていく。'
      },
      {
        heading: '振り回されるヒロインと、新人賞らしい熱量',
        body: '頂点のスケールが大きすぎる一方で、当の叶南は「神ってなに!? 私、これからどうなっちゃうの!?」と常識人目線でツッコミを入れる側だ。この二人の掛け合いがあるからこそ、壮大な設定が重たくなりすぎず、〈ラブコメ〉としての軽快さが保たれている。カラー・モノクロ挿絵入りで858円という文庫価格も手に取りやすい。'
      }
    ],
    headings: {
      summary: '30秒で把握する設定メモ',
      official: '楽天Kobo 紹介文',
      points: 'この作品で推したい3点',
      review: '『メタル＆プラスチックマイハニー』感想',
      readers: 'こんな好みにハマるはず',
      faq: 'よくある疑問',
      tags: 'ジャンル・タグ'
    }
  },
  {
    slug: '4524815645220',
    title: '魔法なき世界の異端魔導士　冤罪で捕まりかけた大魔導士は異世界で自由気ままに旅をします',
    titleKana: 'マホウナキセカイノイタンマドウシ01エンザイデツカマリカケタダイマドウシハイセカイデジユウキママニタビヲシマス',
    seriesName: '魔法なき世界の異端魔導士',
    author: '出雲 大吉',
    publisherName: 'SBクリエイティブ',
    salesDate: '2026年11月14日',
    pubDateRfc: 'Sat, 14 Nov 2026 09:00:00 GMT',
    price: 1430,
    itemUrl: 'https://books.rakuten.co.jp/rk/6e55a3f1742237d0998540f5e1e34480/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F6e55a3f1742237d0998540f5e1e34480%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/8043/2000022448043.jpg?_ex=200x200',
    badge: 'SBクリエイティブ 2026年11月14日発売',
    genre: '異世界転移・バディ冒険',
    color: 'sage',
    oneLineCatch: '無実の罪から別世界へ逃げ込んだ大魔導士と毒舌ホムンクルスが、魔法の消えた世界で訳あり令嬢と海を目指す逃避行。',
    description: '最強魔導士×毒舌従者×訳あり令嬢の痛快逃亡劇！無実の罪で追われ、転移魔法で別世界へ脱出した最強の魔導士ヴェルナーとホムンクルスの従者リーエ。だが転移した先は魔法が廃れ、失われた世界だった！落ち延びた先の屋敷で、とある事情を抱える貴族令嬢セシリアと巡り合う。彼女の危機を見過ごせないヴェルナーは、一宿一飯の恩返しとして一緒に国外へ脱出することを決意する。目指すは海の向こうの新天地。魔法が廃れた世界でチート級の魔法技術を使って追手を翻弄し、三人は冒険者として旅を続けていく。最強魔導士×毒舌ホムンクルス×訳あり令嬢。魔法なき世界で凸凹な三人が新天地を目指す、波乱だらけの異世界逃避行！',
    firstVolumeStory: '冤罪を着せられて追われる身となった最強魔導士ヴェルナーは、ホムンクルスの従者リーエとともに転移魔法で別世界へ逃げ出す。ところが辿り着いたのは、すでに魔法そのものが廃れて失われた世界だった。身を寄せた屋敷で事情を抱えた貴族令嬢セシリアと出会ったヴェルナーは、一宿一飯の恩義を返すため彼女の国外脱出に手を貸すことを決める。魔法を知らない追手を規格外の魔術で煙に巻きながら、凸凹な三人の海を越える旅が始まる。',
    highlights: [
      '「元の世界の最強魔導士が、魔法が廃れた別世界へ逃げる」という珍しいギャップ構図',
      '主人に容赦ない毒舌ホムンクルス・リーエと、訳あり令嬢セシリアを交えた三人旅の空気感',
      '一宿一飯の恩返しから国外脱出、さらに冒険者としての新天地行へと広がる旅のスケール'
    ],
    review: '転生してゼロから成り上がるのではなく、「もともと完成された大魔導士が、冤罪を避けて別世界へ亡命してくる」という始まり方が落ち着いていて読みやすい。しかも移り先が「かつては魔法があったのに今は廃れている世界」なので、ヴェルナーの使う魔法が現地の人々や追手にとっては完全に想定外のジョーカーになる。そこに毒舌を吐きながらも主人のそばを離れないホムンクルスのリーエと、自分の家事情から逃げ出したい貴族令嬢セシリアが加わることで、単なる無双ではなく三人組のロードムービーらしい会話劇が立ち上がる。一宿一飯の義理をきっかけに、海を越えて新天地へ向かう開放感も気持ちよく、旅もののファンタジーが読みたい気分の日にしっくりくる一冊だ。',
    readerTypes: [
      '少人数のパーティで街から街へ移動する旅系ファンタジーが好きな人',
      '主人公と毒舌な相棒（従者）の掛け合いを楽しみたい人',
      '「魔法が失われた世界」に規格外の魔術を持ち込むカルチャーショックが好みの人'
    ],
    specificFaqs: [
      {
        q: '元の世界からの追手との暗い戦いが中心ですか？',
        a: '発端こそ冤罪による脱出ですが、別世界へ移ってからは現地での恩返しや追手の翻弄、海の向こうを目指す自由気ままな冒険旅が主軸になっており、重すぎない雰囲気で読めます。'
      },
      {
        q: '物語はどのあたりまで一巻で描かれますか？',
        a: '異世界転移直後の屋敷で貴族令嬢セシリアと出会い、彼女の危機を救って国外脱出と冒険者としての旅路へ踏み出すまでが第1巻の大きな流れです。'
      }
    ],
    tags: ['異世界転移', '魔導士', '旅', 'ファンタジー', 'SBクリエイティブ', 'ライトノベル'],
    geoPoints: [
      '2026年11月14日発売、出雲 大吉によるSBクリエイティブの新規シリーズ第1巻',
      '冤罪で追われた最強魔導士ヴェルナーと毒舌ホムンクルス・リーエ、貴族令嬢セシリアの三人旅',
      '魔法が廃れた世界を舞台に、未知の魔術で追手を翻弄しながら海の向こうの新天地を目指す逃避行'
    ],
    sections: [
      {
        heading: '「魔法が廃れた世界」に降り立った本物の大魔導士',
        body: '現代日本からの転生ではなく、もともと魔術世界で頂点に立っていた大魔導士ヴェルナーが、無実の罪で追われた末に転移魔法で別世界へ逃げ込むのが発端だ。しかも辿り着いた先では、かつて存在したはずの魔法がすっかり廃れてしまっている。相手が対策の立てようがない魔術を自在に操れるため、窮地に陥ってもどこか余裕を感じさせる立ち回りが光る。'
      },
      {
        heading: '大魔導士・毒舌従者・訳あり令嬢という三人組のバランス',
        body: 'ヴェルナーの隣にいるのはホムンクルスの従者リーエ。主人の腕は認めつつも容赦なく毒舌を飛ばす彼女のおかげで、最強キャラ特有の堅苦しさが適度に抜ける。さらに落ち延び先の屋敷で出会う貴族令嬢セシリアが加わり、「一宿一飯の恩返し」から三人の利害が一致して国外脱出へと転がり出す流れが自然だ。'
      },
      {
        heading: '追手をかわして海の向こうへ抜ける旅の開放感',
        body: '追ってくる側の思惑を規格外の魔法技術でひっくり返しつつ、三人が向かうのは海の向こうの新天地。特定の領地に縛られて内政を続けるのではなく、冒険者として外へ外へと歩いていく開放感がある。自由気ままな旅の雰囲気と、少し訳ありな仲間たちの距離感をじっくり味わいたい読者に向いている。'
      }
    ],
    headings: {
      summary: '物語の輪郭メモ',
      official: '公式案内（楽天Kobo）',
      points: '読みどころの整理',
      review: '『魔法なき世界の異端魔導士』レビュー',
      readers: 'この作品が合いそうな人',
      faq: '購入前のチェック（Q&A）',
      tags: '関連カテゴリ'
    }
  }
];

const newFeature = {
  slug: featureSlug,
  title: '2026年11月中旬発売の注目新作ラノベ3選：古代ローマ脱出RTA、機械女神ラブコメ、魔法なし異世界旅',
  metaTitle: '2026年11月中旬発売の注目新作ラノベ3選｜異世界コンパス',
  eyecatchBadge: '2026年11月 最新刊ピックアップ',
  description: '2026年11月14日〜19日に発売された新作ライトノベルから、『奴隷スタートの古代ローマ転生で成り上がりRTA』『メタル＆プラスチックマイハニー』『魔法なき世界の異端魔導士』の3冊を取り上げ、それぞれの設定と読み味を比較しました。',
  date: '2026-11-21',
  heroImage: articles[0].cover,
  works: articles.map(a => a.slug),
  faq: [
    {
      q: '紹介されている3作品はすべて第1巻（単独スタート）ですか？',
      a: 'はい。3冊とも2026年11月中旬に発売された新シリーズ・単独新作の第1巻なので、既刊を追う必要がなく1冊目からすぐ読み始められます。'
    },
    {
      q: '電子限定特典や挿絵の収録状況はどうなっていますか？',
      a: '『奴隷スタートの古代ローマ転生で成り上がりRTA』には電子限定特典が収録されており、『メタル＆プラスチックマイハニー』には底本同様のカラー・モノクロ挿絵と「ガ報」が収録されています。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: '奴隷スタートの古代ローマ転生で成り上がりRTA',
      customTitle: articles[0].title,
      title: articles[0].title,
      author: articles[0].author,
      synopsis: 'ヴェスヴィオ火山噴火前の古代ローマ・ポンペイに奴隷少年ルシウスとして転生した元科学系YouTuber。噴火で全滅するタイムリミットまでに、現代の科学知識でアイテムを開発し経済的成功と脱出を図るタイムアタック転生。',
      recommendReason: '「火山噴火前にポンペイを脱出する」という明確な期限があるため、転生ものの中でもテンポと緊張感が抜群。知識チート系の工夫が好きな人にまずおすすめしたい一冊です。',
      points: articles[0].highlights,
      itemUrl: articles[0].affiliateUrl,
      affiliateUrl: articles[0].affiliateUrl,
      cover: articles[0].cover,
      salesDate: articles[0].salesDate,
      price: articles[0].price
    },
    {
      rank: 2,
      keyword: 'メタル＆プラスチックマイハニー',
      customTitle: articles[1].title,
      title: articles[1].title,
      author: articles[1].author,
      synopsis: '最愛の少女・貴音叶南を亡くし、AIで再現するため世界一の科学者になった高校生・成木頂点。落雷によってAIが「九十九神」として再誕したことから、巫女も神もカルトもなぎ倒して彼女を本物の神にするラブコメが開幕する。',
      recommendReason: '第20回小学館ライトノベル大賞〈優秀賞〉受賞作。科学の壁を落雷と神話で突破する突拍子もない展開と、一切ブレない主人公の勢いに一気に読まされます。',
      points: articles[1].highlights,
      itemUrl: articles[1].affiliateUrl,
      affiliateUrl: articles[1].affiliateUrl,
      cover: articles[1].cover,
      salesDate: articles[1].salesDate,
      price: articles[1].price
    },
    {
      rank: 3,
      keyword: '魔法なき世界の異端魔導士',
      customTitle: articles[2].title,
      title: articles[2].title,
      author: articles[2].author,
      synopsis: '冤罪から別世界へ転移した最強魔導士ヴェルナーと毒舌ホムンクルス従者リーエ。魔法が廃れたその世界で訳ありの貴族令嬢セシリアと出会い、一宿一飯の恩返しとして追手を翻弄しながら海を越える逃避行が始まる。',
      recommendReason: '魔法を知らない世界に完成済みの大魔導士が迷い込む構図が面白く、凸凹な三人組の掛け合いとロードムービー風の開放感が心地よい作品です。',
      points: articles[2].highlights,
      itemUrl: articles[2].affiliateUrl,
      affiliateUrl: articles[2].affiliateUrl,
      cover: articles[2].cover,
      salesDate: articles[2].salesDate,
      price: articles[2].price
    }
  ]
};

function renderWorkPageHtml(book, existingTagDirs) {
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
    description: book.description,
    offers: {
      '@type': 'Offer',
      price: String(book.price),
      priceCurrency: 'JPY',
      availability: 'https://schema.org/InStock',
      url: book.affiliateUrl || book.itemUrl
    }
  });

  const faqLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (book.specificFaqs || []).map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }))
  });

  const highlightsHtml = (book.highlights || []).map(h => `<li style="margin-bottom:8px; line-height:1.7;">${escapeXml(h)}</li>`).join('');
  const readerTypesHtml = (book.readerTypes || []).map(r => `<li style="margin-bottom:6px; line-height:1.7;">${escapeXml(r)}</li>`).join('');
  const faqsHtml = (book.specificFaqs || []).map(f => `
      <div style="margin-bottom:16px;">
        <h3 style="margin:0 0 4px; font-size:15px; color:#17221f;">Q. ${escapeXml(f.q)}</h3>
        <p style="margin:0; font-size:14px; color:#3d4841; line-height:1.7;">A. ${escapeXml(f.a)}</p>
      </div>
    `).join('');

  const tagsHtml = (book.tags || []).map(t => {
    const tSlug = slugify(t);
    const href = existingTagDirs.has(tSlug) ? `/tags/${tSlug}/` : '/tags/';
    return `<a href="${href}">#${escapeXml(t)}</a>`;
  }).join('');

  const customSectionsHtml = (book.sections || []).map(sec => `
      <h2>${escapeXml(sec.heading)}</h2>
      <div class="first-story-box">
        <p style="margin:0;">${escapeXml(sec.body)}</p>
      </div>
  `).join('');

  const beginnerGuideCta = `
    <div style="background:#fcf9f2; border:1px solid #ebd9b5; border-left:5px solid #bf0000; border-radius:8px; padding:20px; margin:28px 0; box-shadow:0 2px 10px rgba(0,0,0,0.03);">
      <div style="display:flex; align-items:center; gap:8px; font-weight:bold; font-size:15px; color:#17221f; margin-bottom:6px;">
        <span style="background:#bf0000; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px;">電子書籍が初めての方へ</span>
        <span>楽天Koboの購入・試し読み手順</span>
      </div>
      <p style="font-size:13.5px; color:#4a574e; line-height:1.75; margin:0 0 12px;">
        スマホやPCでの読み方や、ポイント還元の仕組みなどをまとめたガイドページも用意しています。
      </p>
      <a href="/features/rakuten-kobo-beginner-guide/" style="display:inline-flex; align-items:center; gap:6px; background:#17221f; color:#fff; padding:8px 16px; border-radius:5px; font-size:13px; font-weight:bold; text-decoration:none;">
        <span>楽天Kobo購入ガイドを見る ➔</span>
      </a>
    </div>
  `;

  const h = book.headings;

  return `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeXml(book.title)} - 感想・あらすじ・見どころ解説｜異世界コンパス</title>
  <meta name="description" content="${escapeXml(book.oneLineCatch)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/works/${book.slug}/">
  <meta property="og:title" content="${escapeXml(book.title)} - 感想・あらすじ・見どころ解説">
  <meta property="og:description" content="${escapeXml(book.oneLineCatch)}">
  <meta property="og:image" content="${escapeXml(book.cover)}">
  <script type="application/ld+json">${breadcrumbLd}</script>
  <script type="application/ld+json">${bookLd}</script>
  <script type="application/ld+json">${faqLd}</script>
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  <div data-nosnippet>${renderHeader('/works/')}</div>
  <main class="work-detail-main" itemscope itemtype="https://schema.org/Book">
    <nav class="crumb" aria-label="Breadcrumb">
      <a href="/">トップ</a>　/　<a href="/works/">作品一覧</a>　/　<span aria-current="page">${escapeXml(book.title)}</span>
    </nav>
    <div class="eyebrow">${escapeXml(book.badge)}</div>
    <h1 itemprop="name">${escapeXml(book.title)}</h1>
    <p class="lead">${escapeXml(book.oneLineCatch)}</p>

    <div style="overflow:hidden;">
      <img class="cover-main" src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)} 書影" width="200" height="280">

      <div class="pub-status-box">
        <div class="pub-status-main">
          <h3>発売日：${escapeXml(book.salesDate)} ｜ 定価：${book.price}円</h3>
          <p>著者：<span itemprop="author">${escapeXml(book.author)}</span> ｜ 出版社：<span itemprop="publisher">${escapeXml(book.publisherName)}</span></p>
        </div>
        <div>
          <a class="cta" style="margin-top:0;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで試し読み・詳細を見る ↗</a>
        </div>
      </div>

      <div class="ai-summary">
        <strong>${escapeXml(h.summary)}</strong>
        <p style="margin:6px 0 0;">${escapeXml(book.oneLineCatch)}</p>
      </div>

      ${customSectionsHtml}

      <h2>${escapeXml(h.points)}</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${highlightsHtml}
        </ul>
      </div>

      <h2>${escapeXml(h.review)}</h2>
      <div class="review-box">
        ${escapeXml(book.review)}
      </div>

      <h2>${escapeXml(h.official)}</h2>
      <div class="first-story-box" itemprop="description">
        ${escapeXml(book.description)}
      </div>

      <h2>${escapeXml(h.readers)}</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${readerTypesHtml}
        </ul>
      </div>

      <h2>${escapeXml(h.faq)}</h2>
      <div class="highlights-box">
        ${faqsHtml}
      </div>

      ${beginnerGuideCta}

      <div class="ai-summary" style="margin-top:28px;">
        <strong>関連特集：</strong>
        <a href="/features/${featureSlug}/">${escapeXml(newFeature.title)}</a>
      </div>

      <h2>${escapeXml(h.tags)}</h2>
      <div class="tags" style="margin-top:14px;">
        ${tagsHtml}
      </div>

      <div style="text-align:center; margin-top:40px;">
        <a class="cta" style="padding:16px 36px; font-size:16px;" href="${escapeXml(book.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで『${escapeXml(book.title)}』をチェック ↗</a>
      </div>
    </div>
  </main>
  ${renderFooter()}
</body>
</html>`;
}

function renderBookCard(book) {
  const tagsHtml = (book.tags || []).slice(0, 3).map(t => `<span class="pill">#${escapeXml(t)}</span>`).join(' ');
  return `
    <article class="book-card">
      <a class="cover-container" href="/works/${book.slug}/">
        <img src="${escapeXml(book.cover)}" alt="${escapeXml(book.title)}の表紙" loading="lazy" />
        <span class="badge-tag">${escapeXml(book.badge)}</span>
      </a>
      <div class="card-body">
        <span class="card-genre">${escapeXml(book.genre)}</span>
        <h3 class="card-title"><a href="/works/${book.slug}/">${escapeXml(book.title)}</a></h3>
        <div class="card-author">${escapeXml(book.author)}</div>
        <div class="card-tags">${tagsHtml}</div>
        <div class="card-bottom">
          <span>発売: ${escapeXml(book.salesDate)}</span>
          <a class="card-btn" href="/works/${book.slug}/">詳細を見る ↗</a>
        </div>
      </div>
    </article>`;
}

async function main() {
  console.log('=== [Step 1] Loading existing data ===');
  const booksPath = path.join(root, 'public/data/books.json');
  const featuresPath = path.join(root, 'public/data/curated-features.json');

  let books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
  let features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const tagDirEntries = await fs.readdir(path.join(root, 'public/tags'));
  const existingTagDirs = new Set(tagDirEntries);

  // 1. books.json への追加・更新（先頭に配置）
  console.log('[Step 1] Updating public/data/books.json...');
  for (const art of [...articles].reverse()) {
    const bookData = {
      id: art.slug,
      slug: art.slug,
      title: art.title,
      titleKana: art.titleKana,
      seriesName: art.seriesName,
      author: art.author,
      publisher: art.publisherName,
      publisherName: art.publisherName,
      publishedDate: art.salesDate,
      salesDate: art.salesDate,
      price: art.price,
      itemPrice: art.price,
      itemUrl: art.itemUrl,
      sourceUrl: art.itemUrl,
      affiliateUrl: art.affiliateUrl,
      largeImageUrl: art.cover,
      coverImage: art.cover,
      cover: art.cover,
      badge: art.badge,
      color: art.color,
      oneLineCatch: art.oneLineCatch,
      aiIntro: art.oneLineCatch,
      description: art.description,
      firstVolumeStory: art.firstVolumeStory,
      highlights: art.highlights,
      review: art.review,
      readerTypes: art.readerTypes,
      specificFaqs: art.specificFaqs,
      faq: art.specificFaqs,
      tags: art.tags,
      geoPoints: art.geoPoints,
      genre: art.genre,
      source: 'rakuten-kobo',
      publishedAt: new Date().toISOString()
    };
    const idx = books.findIndex(b => String(b.slug) === String(art.slug) || b.title === art.title);
    if (idx >= 0) {
      books.splice(idx, 1);
    }
    books.unshift(bookData);
  }
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), 'utf8');
  console.log(`  Updated books.json (total: ${books.length})`);

  // 2. 各作品の個別ページ生成 (/works/{slug}/index.html)
  console.log('[Step 2] Rendering 3 individual work pages...');
  for (const book of articles) {
    const workDir = path.join(root, 'public/works', book.slug);
    await fs.mkdir(workDir, { recursive: true });
    const pageHtml = renderWorkPageHtml(book, existingTagDirs);
    await fs.writeFile(path.join(workDir, 'index.html'), pageHtml, 'utf8');
    console.log(`  Rendered /works/${book.slug}/index.html`);
  }

  // 3. curated-features.json と特集ページ生成
  console.log('[Step 3] Updating public/data/curated-features.json & rendering feature page...');
  const oldIdx = features.findIndex(f => f.slug === featureSlug);
  if (oldIdx >= 0) features.splice(oldIdx, 1);

  const novLateIdx = features.findIndex(f => f.slug === '2026-nov-late-new-light-novels');
  if (novLateIdx >= 0) {
    features.splice(novLateIdx, 0, newFeature);
  } else {
    features.unshift(newFeature);
  }
  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2), 'utf8');

  const featDir = path.join(root, 'public/features', featureSlug);
  await fs.mkdir(featDir, { recursive: true });

  const slugByTitle = new Map(articles.map(a => [a.title, a.slug]));
  const featureItemsHtml = newFeature.items.map(item => {
    const wSlug = slugByTitle.get(item.title);
    return `
    <article style="background:#fff; border:1px solid #e1e6de; border-radius:8px; padding:24px; margin-bottom:28px; box-shadow:0 2px 8px rgba(0,0,0,0.04);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="background:#8b672d; color:#fff; font-weight:bold; font-size:12px; padding:4px 8px; border-radius:4px;">紹介作品 ${item.rank}</span>
        <span style="font-size:13px; color:#5f6c62;">発売日：${escapeXml(item.salesDate)} ｜ 定価：${item.price}円</span>
      </div>
      <h2 style="font-family:serif; font-size:22px; margin:0 0 16px; color:#17221f; border:none; padding:0;">${escapeXml(item.customTitle)}</h2>
      <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
        <img src="${escapeXml(item.cover)}" alt="${escapeXml(item.title)}" style="width:140px; height:195px; object-fit:cover; border-radius:6px; box-shadow:0 3px 10px rgba(0,0,0,0.12);">
        <div style="flex:1; min-width:260px;">
          <p style="margin:0 0 6px; font-size:13px; color:#5f6c62;">著者：${escapeXml(item.author)}</p>
          <div style="background:#f4f7f4; padding:14px; border-radius:6px; font-size:14px; line-height:1.8; margin-bottom:14px; color:#233028;">
            <strong>【概要】</strong><br>${escapeXml(item.synopsis)}
          </div>
          <div style="background:#fcf9f2; border-left:3px solid #d6a24a; padding:12px 14px; font-size:14px; line-height:1.8; color:#3a3224; margin-bottom:14px;">
            <strong>【読みどころ】</strong><br>${escapeXml(item.recommendReason)}
          </div>
          <ul style="margin:0 0 16px; padding-left:20px; font-size:13px; color:#3d4841; line-height:1.7;">
            ${item.points.map(p => `<li>${escapeXml(p)}</li>`).join('')}
          </ul>
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
            <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px; background:#17221f;" href="/works/${wSlug}/">個別レビュー記事へ ➔</a>
            <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px;" href="${escapeXml(item.affiliateUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで詳細を見る ↗</a>
          </div>
        </div>
      </div>
    </article>
  `;
  }).join('');

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

  const featHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeXml(newFeature.metaTitle)}</title>
  <meta name="description" content="${escapeXml(newFeature.description)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/features/${newFeature.slug}/">
  <meta property="og:title" content="${escapeXml(newFeature.metaTitle)}">
  <meta property="og:description" content="${escapeXml(newFeature.description)}">
  <script type="application/ld+json">${featBreadcrumbLd}</script>
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  <div data-nosnippet>${renderHeader('/features/')}</div>
  <main class="feature-detail-main">
    <article>
      <nav class="crumb" aria-label="Breadcrumb">
        <a href="/">トップ</a>　/　<a href="/features/">特集一覧</a>　/　<span aria-current="page">${escapeXml(newFeature.title)}</span>
      </nav>
      <div class="eyebrow">${escapeXml(newFeature.eyecatchBadge)}</div>
      <h1 itemprop="name">${escapeXml(newFeature.title)}</h1>
      <p class="lead">${escapeXml(newFeature.description)}</p>
      <section class="feature-items">
        ${featureItemsHtml}
      </section>
      <section class="highlights-box" style="margin-top:40px;">
        <h2>この特集についての補足・FAQ</h2>
        ${featFaqHtml}
      </section>
    </article>
  </main>
  ${renderFooter()}
</body>
</html>`;
  await fs.writeFile(path.join(featDir, 'index.html'), featHtml, 'utf8');
  console.log(`  Rendered /features/${featureSlug}/index.html`);

  // 4. /features/index.html の適切な位置に配置 (2026-nov-late-new-light-novels の直前)
  console.log('[Step 4] Updating public/features/index.html...');
  const featuresIndexPath = path.join(root, 'public/features/index.html');
  let featuresIndexHtml = await fs.readFile(featuresIndexPath, 'utf8');
  if (!featuresIndexHtml.includes(`/features/${featureSlug}/`)) {
    const newFeatCard = `
    <div class="feature-hub-card">
      <span class="feature-hub-badge">${escapeXml(newFeature.eyecatchBadge)}</span>
      <h2 class="feature-hub-title"><a href="/features/${newFeature.slug}/">${escapeXml(newFeature.title)}</a></h2>
      <p class="feature-hub-desc">${escapeXml(newFeature.description)}</p>
      <a class="feature-hub-btn" href="/features/${newFeature.slug}/">特集記事を読む（3作品徹底解説） →</a>
    </div>
  `;
    const targetMarker = '<a href="/features/2026-nov-late-new-light-novels/">';
    const markerPos = featuresIndexHtml.indexOf(targetMarker);
    if (markerPos >= 0) {
      const cardStart = featuresIndexHtml.lastIndexOf('<div class="feature-hub-card">', markerPos);
      featuresIndexHtml = featuresIndexHtml.slice(0, cardStart) + newFeatCard + '\n    ' + featuresIndexHtml.slice(cardStart);
    } else {
      featuresIndexHtml = featuresIndexHtml.replace('<div class="features-grid">', '<div class="features-grid">\n' + newFeatCard);
    }
    await fs.writeFile(featuresIndexPath, featuresIndexHtml, 'utf8');
    console.log('  Inserted new feature card into /features/index.html');
  }

  // 5. /works/index.html の先頭に配置＆件数同期
  console.log('[Step 5] Updating public/works/index.html...');
  const worksIndexPath = path.join(root, 'public/works/index.html');
  let worksIndexHtml = await fs.readFile(worksIndexPath, 'utf8');
  const cardsToInsertWorks = articles.filter(a => !worksIndexHtml.includes(`/works/${a.slug}/`)).map(renderBookCard).join('\n');
  if (cardsToInsertWorks) {
    worksIndexHtml = worksIndexHtml.replace('<div class="book-cards-grid">', '<div class="book-cards-grid">\n' + cardsToInsertWorks);
    const totalCards = (worksIndexHtml.match(/<article class="book-card">/g) || []).length;
    worksIndexHtml = worksIndexHtml
      .replace(/（全\d+作品）/g, `（全${totalCards}作品）`)
      .replace(/（\d+作品）/g, `（${totalCards}作品）`);
    await fs.writeFile(worksIndexPath, worksIndexHtml, 'utf8');
    console.log(`  Updated /works/index.html (total cards: ${totalCards})`);
  }

  // 6. /new/index.html の「発売済み作品一覧」先頭に配置
  console.log('[Step 6] Updating public/new/index.html...');
  const newIndexPath = path.join(root, 'public/new/index.html');
  let newIndexHtml = await fs.readFile(newIndexPath, 'utf8');
  const cardsToInsertNew = articles.filter(a => !newIndexHtml.includes(`/works/${a.slug}/`)).map(renderBookCard).join('\n');
  if (cardsToInsertNew) {
    const gridMarker = '発売済み作品一覧</h2><div class="book-cards-grid">';
    if (newIndexHtml.includes(gridMarker)) {
      newIndexHtml = newIndexHtml.replace(gridMarker, gridMarker + '\n' + cardsToInsertNew);
    } else {
      newIndexHtml = newIndexHtml.replace('<div class="book-cards-grid">', '<div class="book-cards-grid">\n' + cardsToInsertNew);
    }
    await fs.writeFile(newIndexPath, newIndexHtml, 'utf8');
    console.log('  Updated /new/index.html');
  }

  // 7. /sitemap/index.html の更新
  console.log('[Step 7] Updating public/sitemap/index.html...');
  const sitemapHtmlPath = path.join(root, 'public/sitemap/index.html');
  let sitemapHtml = await fs.readFile(sitemapHtmlPath, 'utf8');
  let sitemapHtmlChanged = false;
  if (!sitemapHtml.includes(`/features/${featureSlug}/`)) {
    const featLi = `<li><a href="/features/${featureSlug}/">${escapeXml(newFeature.title)}</a></li>`;
    sitemapHtml = sitemapHtml.replace('<li><a href="/features/">おすすめ特集一覧</a></li>', `<li><a href="/features/">おすすめ特集一覧</a></li>\n        ${featLi}`);
    sitemapHtmlChanged = true;
  }
  const missingWorkLis = articles
    .filter(a => !sitemapHtml.includes(`/works/${a.slug}/`))
    .map(a => `<li><a href="/works/${a.slug}/">${escapeXml(a.title)}</a></li>`)
    .join('\n        ');
  if (missingWorkLis) {
    const workAnchor = '<li><a href="/works/6474824019189/">';
    if (sitemapHtml.includes(workAnchor)) {
      sitemapHtml = sitemapHtml.replace(workAnchor, `${missingWorkLis}\n        ${workAnchor}`);
    } else {
      sitemapHtml = sitemapHtml.replace('<li><a href="/works/">全作品一覧</a></li>', `<li><a href="/works/">全作品一覧</a></li>\n        ${missingWorkLis}`);
    }
    sitemapHtmlChanged = true;
  }
  if (sitemapHtmlChanged) {
    await fs.writeFile(sitemapHtmlPath, sitemapHtml, 'utf8');
    console.log('  Updated /sitemap/index.html');
  }

  // 8. /rss.xml の更新
  console.log('[Step 8] Updating public/rss.xml...');
  const rssPath = path.join(root, 'public/rss.xml');
  let rssXml = await fs.readFile(rssPath, 'utf8');
  const rssItems = articles
    .filter(a => !rssXml.includes(`/works/${a.slug}/`))
    .map(a => `<item><title>${escapeXml(a.title)}</title><link>${siteUrl}/works/${a.slug}/</link><description>${escapeXml(a.description)}</description><pubDate>${a.pubDateRfc}</pubDate></item>`)
    .join('\n    ');
  if (rssItems) {
    rssXml = rssXml.replace('<item>', `${rssItems}\n    <item>`);
    await fs.writeFile(rssPath, rssXml, 'utf8');
    console.log('  Updated /rss.xml');
  }

  // 9. /sitemap.xml の更新
  console.log('[Step 9] Updating public/sitemap.xml...');
  const sitemapXmlPath = path.join(root, 'public/sitemap.xml');
  let sitemapXml = await fs.readFile(sitemapXmlPath, 'utf8');
  const todayStr = '2026-11-21';
  for (const book of articles) {
    const bookUrl = `${siteUrl}/works/${book.slug}/`;
    if (!sitemapXml.includes(bookUrl)) {
      const entry = `  <url>\n    <loc>${bookUrl}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
      sitemapXml = sitemapXml.replace('</urlset>', `${entry}</urlset>`);
    }
  }
  const featUrl = `${siteUrl}/features/${featureSlug}/`;
  if (!sitemapXml.includes(featUrl)) {
    const entry = `  <url>\n    <loc>${featUrl}</loc>\n    <lastmod>${todayStr}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    sitemapXml = sitemapXml.replace('</urlset>', `${entry}</urlset>`);
  }
  await fs.writeFile(sitemapXmlPath, sitemapXml, 'utf8');
  console.log('  Updated /sitemap.xml');

  console.log('--- ALL SITE PLACEMENT COMPLETED ---');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
