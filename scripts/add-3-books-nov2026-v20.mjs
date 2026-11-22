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

const featureSlug = '2026-nov-22-three-new-voices';

const articles = [
  {
    slug: '8890090038865',
    title: '私、曇りの聖女と呼ばれたけれど！１　〜トンデモギフトの悪役令嬢は暴れん坊〜【電子書店共通特典SS付】',
    titleKana: 'ワタシクモリノセイジョトヨバレタケレド001トンデモギフトノアクヤクレイジョウハアバレンボウ',
    seriesName: '私、曇りの聖女と呼ばれたけれど！',
    author: '川崎悠',
    publisherName: 'アース・スター エンターテイメント',
    salesDate: '2026年11月13日',
    pubDateRfc: 'Fri, 13 Nov 2026 09:00:00 GMT',
    price: 1540,
    itemUrl: 'https://books.rakuten.co.jp/rk/3d92a27e8af136dda5f46cac8bc6b740/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F3d92a27e8af136dda5f46cac8bc6b740%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/8046/2000022448046.jpg?_ex=200x200',
    badge: 'アース・スター エンターテイメント 2026年11月13日発売',
    genre: '悪役令嬢・勘違いファンタジー',
    color: 'plum',
    oneLineCatch: 'とっさの嘘から『曇りの聖女』と祭り上げられた転生公爵令嬢が、襲撃者より「仏罰」におびえながら規格外の祝福で大暴れして破滅フラグを叩き折る。',
    description: '「私が授かったのは、空を曇らせることのできる祝福、みたいです」公爵令嬢カーマイン・マロットには秘密がある。一つは日本人の記憶を持つ転生者であること。そしてもう一つは、彼女だけが祝福の真の能力を知っていること。祝福について咄嗟に誤魔化した結果、勘違いした周囲はカーマインを『曇りの聖女』と呼び、望んでもいないのに王子の婚約者候補として注目し始める。それからというもの、カーマインは何者かの襲撃や不可解な事件に巻き込まれ、さらには祝福の正体も疑われるようになり……。彼女はふと思う。「私が悪役令嬢ポジションよねぇ……」けれどカーマインが最も恐れているのは、そんな襲撃や陰謀ではなく、もっと恐ろしい「仏罰」が下ることなのだ。何故なら彼女が得た本当の祝福の名は──破滅フラグをぶっ壊すため前代未聞の能力で大暴れ！？奇想天外ファンタジー、ここに開幕！',
    firstVolumeStory: '日本人の前世を思い出した公爵令嬢カーマイン・マロットは、自分が授かった祝福の正体を隠すため、周囲に「空を曇らせる力」と苦し紛れの説明をしてしまう。ところがその一言のせいで『曇りの聖女』という奇妙な呼び名が定着し、当人はまったく望んでいないのに王子の婚約者候補へ押し上げられてしまう。案の定、怪しい襲撃や妙な事件が次々と起こり、祝福の真偽まで探られ始める始末。周囲からはまるで悪役令嬢のような立場に置かれながらも、カーマインが本気で震えている相手は刺客でも政敵でもなく「仏罰」だった。破滅コースを回避するため、彼女は隠していたとんでもない祝福を引っ提げて暴れ出す。',
    highlights: [
      '「空を曇らせる」という地味すぎる言い訳が裏目に出て『曇りの聖女』扱いされるズレの面白さ',
      '暗殺者や王宮の陰謀よりも「仏罰」を怖がっている、ちょっと肝の据わり方がおかしい公爵令嬢',
      '電子版には【電子書店共通特典SS】がしっかり付いており、アース・スターノベル版の本編とあわせて楽しめる'
    ],
    review: '悪役令嬢モノは数あれど、王子の婚約者候補に祭り上げられた令嬢が「暗殺されそう」とか「婚約破棄されそう」ではなく、「このままいくと仏罰が下る」と怯えている時点でだいぶおかしい。カーマインは自分の祝福を隠したくて「空を曇らせるくらいです」と咄嗟にごまかしただけなのに、周囲の深読みが重なって『曇りの聖女』という妙にありがたい異名まで付いてしまう。おかげで王子の婚約者レースに放り込まれ、狙われ、疑われ、「これ私が悪役令嬢の枠では？」と気づくところまではお約束を踏んでいるのに、そこからの解決方法がどう見てもお淑やかな令嬢のそれではない。副題に「暴れん坊」とあるとおり、しおらしく待つのではなく自分から破滅フラグをへし折りにいく勢いが読んでいて痛快だ。',
    readerTypes: [
      'おしとやかな令嬢より、思い切りよく大暴れするタイプの悪役令嬢が好きな人',
      '小さな言い訳がどんどん大げさな勘違いに膨らんでいくコメディが好みの人',
      '特典SS付きの電子版でサクッと新シリーズの1巻を試したい人'
    ],
    specificFaqs: [
      {
        q: 'タイトルにある「曇りの聖女」というのは本当に天候を変える能力なのですか？',
        a: '周囲には「空を曇らせることのできる祝福、みたいです」と咄嗟にごまかしたためにそう呼ばれていますが、本当の祝福の正体はまったく別のとんでもない能力であり、彼女自身が「仏罰」を恐れる原因にもなっています。'
      },
      {
        q: '電子版に収録されている特典SSはどういう扱いですか？',
        a: '楽天Koboで配信されている本書は【電子書店共通特典SS付】となっており、書籍本編に加えて共通特典のショートストーリーが収録されています。'
      }
    ],
    tags: ['悪役令嬢', '転生', '聖女', '勘違い', 'ライトノベル'],
    geoPoints: [
      '2026年11月13日発売、川崎悠によるアース・スター エンターテイメントの新作第1巻',
      '日本人の記憶を持つ公爵令嬢カーマイン・マロットが、とっさの嘘から『曇りの聖女』と呼ばれる勘違い悪役令嬢ファンタジー',
      '陰謀や襲撃よりも「仏罰」を恐れながら、前代未聞の祝福で破滅フラグを叩き壊す痛快な展開'
    ],
    sections: [
      {
        heading: '「空を曇らせるだけ」の嘘から始まった聖女扱い',
        body: '発端はほんの気まぐれ、というより苦し紛れの誤魔化しだった。公爵令嬢カーマイン・マロットが授かった祝福の正体を隠そうとして口にした「空を曇らせることのできる祝福、みたいです」という言葉を、周囲が妙に深刻に受け取ってしまう。結果、誕生したのが『曇りの聖女』という微妙にありがたいのかよく分からない二つ名だ。しかもそのまま王子の婚約者候補に名を連ねてしまい、静かに暮らしたいはずの彼女の周りが一気にきな臭くなっていく。'
      },
      {
        heading: '刺客より怖いのは、まさかの「仏罰」',
        body: '謎の襲撃者が現れ、不可解な事件に首を突っ込まれる羽目になり、ついには祝福の中身まで疑われ始める。客観的に見れば王道ど真ん中の「悪役令嬢ポジション」に追い込まれているのだが、カーマインの頭の中を支配している恐怖はそこではない。彼女が何より恐れているのは「仏罰」が下ることだ。なぜ西洋風ファンタジーの公爵令嬢が仏罰を怖がっているのか──その違和感こそが、彼女が隠し通している本当の祝福名へと直結していく。'
      }
    ],
    headings: {
      summary: 'ざっくり3行メモ',
      official: '楽天Kobo 作品紹介',
      points: '読んで印象に残るポイント',
      review: '編集メモ・読後感',
      readers: 'こんな気分の日におすすめ',
      faq: '購入前のQ&A',
      tags: '関連タグ'
    }
  },
  {
    slug: '4320000960042',
    title: '銃×石',
    titleKana: 'ガンセキイチ',
    seriesName: '銃×石',
    author: '牛若守',
    publisherName: '小学館',
    salesDate: '2026年11月18日',
    pubDateRfc: 'Wed, 18 Nov 2026 09:00:00 GMT',
    price: 858,
    itemUrl: 'https://books.rakuten.co.jp/rk/7e65081655d0391db8f9c6bd2873336a/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F7e65081655d0391db8f9c6bd2873336a%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/7292/2000022327292.jpg?_ex=200x200',
    badge: '小学館 2026年11月18日発売',
    genre: '冒険アクション・ダークファンタジー',
    color: 'gold',
    oneLineCatch: '怪物とマフィアが支配する伝説の島アトランティスで、少女を身請けするために“不労”の採掘者が銃を握って奥地へ踏み込む。',
    description: 'この島で採掘する覚悟、お前さんにあるか？鉱物資源の宝庫ながら凶悪なクリーチャーの巣食う伝説の島、アトランティス。親に売られた少女・キャロンは、マフィアに連れて行かれたその島の娼館で働くことを迫られる。そんな彼女に救いの手を差し伸べたのは、かつて恋人と子を失った“不労”の採掘者ーーフェグスだった。マフィアから課された法外な身請け金を稼ぐため、フェグスとキャロンは島の奥地へと採掘に赴く。様々なクリーチャーとの対峙、苛烈を極める銃撃戦、迫る身請けの支払期限。二人は血の繋がりを超えて心を通わせながら、アトランティスに挑む。※「ガ報」付き！※この作品は底本と同じクオリティのカラーイラスト、モノクロの挿絵イラストが収録されています。',
    firstVolumeStory: '伝説の島アトランティスは、莫大な鉱物資源が眠る一方で凶悪なクリーチャーとマフィアがはびこる危険地帯だった。親に売られ、その島の娼館へ連れてこられた少女キャロンを救い出したのは、かつて恋人と我が子を失った過去を持つ“不労”の採掘者フェグス。だがマフィアは解放の条件として法外な身請け金を突きつけてくる。支払い期限が迫るなか、フェグスはキャロンを連れて島の奥地へ鉱石を掘りに出る。怪物の襲撃と激しい銃撃戦をくぐり抜けながら、血の繋がらない二人の距離が少しずつ変わっていく。',
    highlights: [
      '「伝説の島アトランティス」を幻想郷ではなく、鉱山・マフィア・怪物がひしめく荒くれ島として描く設定',
      '過去を失って働かなくなっていた採掘者フェグスと、身売りされた少女キャロンが危険な現場で組むバディ関係',
      '支払期限つきの身請け金稼ぎという切羽詰まった目的と、容赦ない銃撃戦＆クリーチャー戦の緊張感'
    ],
    review: '甘い異世界スローライフの対極にある、土と火薬の匂いが濃い一作。まずタイトルの『銃×石（ガンセキ）』からして飾り気がなく、中身も親に売られた少女キャロンを救うために、恋人と子を失った男フェグスが再び銃を手に取って鉱石を掘りにいくという骨太な筋立てになっている。興味深いのは、フェグスが最初から頼れる英雄ではなく「かつて家族を失った“不労”の採掘者」として登場する点だ。止まっていた男の時間が、キャロンに課された法外な身請け金と期限をきっかけにもう一度動き出す。クリーチャーの巣に飛び込むサバイバルとマフィア相手の銃撃戦、その合間に血の繋がりを超えた絆が少しずつ育っていく手触りは、ガガガ文庫らしい熱さがあって読み応えがある。',
    readerTypes: [
      '転生やステータス画面のない、泥臭いガンアクションとサバイバル小説が読みたい人',
      '過去を抱えた年上の男と居場所を奪われた少女のバディもの・疑似親子関係に弱い人',
      '858円で挿絵・カラー口絵完備の読み切り感のある第1巻を探している人'
    ],
    specificFaqs: [
      {
        q: 'タイトルの『銃×石』はどう読むのですか？',
        a: '書誌情報のカナ表記からも分かるとおり「ガンセキ」と読ませるタイトルです。島での鉱石採掘と、生き残りを懸けた銃撃戦の両方を象徴しています。'
      },
      {
        q: 'イラストや特典ページは電子版にも含まれますか？',
        a: 'はい。底本と同じクオリティのカラーイラストとモノクロ挿絵が収録されており、あわせて「ガ報」も付いています。'
      }
    ],
    tags: ['バトル', 'アクション', 'ファンタジー', 'ガガガ文庫', 'ライトノベル'],
    geoPoints: [
      '2026年11月18日発売、牛若守による小学館（ガガガ文庫）の新作ライトノベル',
      '鉱物資源と凶悪クリーチャーが混在する伝説の島アトランティスを舞台にした銃撃＆採掘サバイバル',
      '法外な身請け金と期限を背負い、不労の採掘者フェグスと少女キャロンが奥地へ挑む硬派なバディ物語'
    ],
    sections: [
      {
        heading: '楽園ではなく「鉱山とマフィアの島」としてのアトランティス',
        body: 'アトランティスと聞くと古代文明の神秘を思い浮かべがちだが、この物語の舞台はもっと生々しい。莫大な鉱物資源があるせいでマフィアが根を張り、娼館が立ち、少し町を外れれば凶悪なクリーチャーが牙をむく場所だ。一攫千金を夢見る者も食い物にされる者も集まってくるこの島の乾いた空気が、序盤からしっかりと物語の土台を作っている。'
      },
      {
        heading: '「不労」の男を再び動かした法外な身請け金',
        body: '主人公のフェグスは、かつて恋人と子どもを失って以来、働く気力をなくしていた採掘者だ。そんな彼が、親に売られてきた少女キャロンを見捨てられず、マフィアの突きつけた法外な身請け金を背負うことになる。期限が迫るなかで再び奥地へ向かう選択は、単なる人助けというより、フェグス自身が過去の喪失と向き合い直す時間にもなっている。'
      },
      {
        heading: '怪物、銃弾、期限。三つ巴の現場で結ばれる関係',
        body: '島の奥地で待っているのは、おとなしく鉱石を掘らせてくれる環境ではない。襲いかかるクリーチャーとの遭遇戦、追手や敵対勢力との激しい銃撃戦、そして容赦なく減っていく支払いまでの残り日数。生死の境目を何度もくぐるうちに、フェグスとキャロンは血の繋がりとは別のところで互いに欠かせない存在へと変わっていく。'
      }
    ],
    headings: {
      summary: '作品スペック＆導入',
      official: '公式あらすじ（楽天Kobo）',
      points: '『銃×石』の見どころ3選',
      review: '読んでみた率直な感想',
      readers: 'この作風が刺さりそうな読者',
      faq: '作品についてのQ&A',
      tags: 'ジャンル・レーベル'
    }
  },
  {
    slug: '4524815627960',
    title: 'モブなので恋愛よりドラゴン育成したいです　〜どハマりしたゲームの世界に転生したので、赤ちゃん白竜を育ててみる。するとヒロインが「かわいい！」と近付いてきて……〜',
    titleKana: 'モブナノデレンアイヨリドラゴンイクセイシタイデス01ドハマリシタゲームノセカイニテンセイシタノデアカチャンハクリュウヲソダテテミルスルトヒロインガカワイイトチカヅイテキテ',
    seriesName: 'モブなので恋愛よりドラゴン育成したいです',
    author: 'メソポ・たみあ',
    publisherName: 'SBクリエイティブ',
    salesDate: '2026年11月14日',
    pubDateRfc: 'Sat, 14 Nov 2026 09:00:00 GMT',
    price: 814,
    itemUrl: 'https://books.rakuten.co.jp/rk/bd463fe0bf3b3048ae11a9fde4d27684/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2Fbd463fe0bf3b3048ae11a9fde4d27684%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/8023/2000022448023.jpg?_ex=200x200',
    badge: 'SBクリエイティブ 2026年11月14日発売',
    genre: 'ゲーム転生・育成ファンタジー',
    color: 'sage',
    oneLineCatch: '恋愛RPGのモブ転生に絶望して高難度のドラゴン育成に逃げ込んだ男が、赤ちゃん白竜を可愛がりすぎたせいでヒロインたちの好感度を稼いでしまう。',
    description: 'ヒロインからの好感度がなぜか爆上がり！？知識チート×ハーレムファンタジー！！恋愛ＲＰＧゲームのモブに転生した主人公、ノエル。魅力的なヒロインの集うゲームだったが、モブの立場では恋愛は難しいと考え、ゲームの中で特に難易度が高いドラゴン育成を極めることに。希少なホワイト・ドラゴンの卵を手に入れ前世知識を用いて育成を進めていく中で、ノエルは周囲に一目置かれる存在になる。「か……かわいい……！　ちょ、ちょっと触ってもいい……！？」ドラゴンを育てていただけなのに、ヒロインとの交流が増えなぜか好感度もあがり始めて……？モブに転生してドラゴン育成に力を入れていたら、ヒロイン達に好かれ始めるハーレムファンタジー！※電子版は紙書籍版と一部異なる場合がありますので、あらかじめご了承ください',
    firstVolumeStory: 'やり込んでいた恋愛RPGの世界に、よりによってモブキャラのノエルとして転生してしまった主人公。魅力的なヒロインは多いものの、モブの立場では恋愛ルートなど無理だと早々に割り切り、彼は作中でも屈指の難関コンテンツである「ドラゴン育成」を極める道へ舵を切る。レアなホワイト・ドラゴンの卵を手に入れ、ゲーム知識をフル活用して赤ちゃん白竜を育て始めた結果、いつしか周囲から一目置かれる存在へと変化。さらには白竜の愛らしさに釣られたヒロインたちが「ちょっと触ってもいい！？」と次々距離を詰めてきて、気づけば好感度まで上がり始めていた。',
    highlights: [
      '恋愛をきっぱり諦めて「高難度のドラゴン育成システム」の攻略に走る、ゲーマーらしい潔い割り切り',
      'モブの飼い主ではなく、卵から孵った赤ちゃんホワイト・ドラゴンの可愛さにヒロインが食いついてくる導入',
      '結果的にヒロインとの接点が増え、育成の成果で周囲の評価までひっくり返っていく気持ちよさ'
    ],
    review: '「モブに転生したから恋は諦めた」というスタート自体は定番に近いけれど、その逃げ先がスローライフや隠居ではなく「その恋愛RPGの中で一番難易度の高いドラゴン育成のやり込み」なのがゲーマー気質で面白い。確かに、推しヒロインの恋愛イベントにモブとして割り込むのはハードルが高くても、育成システムの仕様を知り尽くしているなら希少種の卵を育て上げるほうが現実的だ。ところが実際にホワイト・ドラゴンの赤ちゃんを育ててみたら、当のヒロインたちが「かわいい！ 触らせて！」と寄ってきてしまい、本人の知らないうちに好感度が跳ね上がっていく。恋愛を追いかけない男のほうが逆にモテ始めるおかしさと、竜を愛でるほのぼの感が無理なく同居した一冊。814円の手頃さも嬉しい。',
    readerTypes: [
      'やり込み要素のあるゲーム知識を活かした転生ファンタジーが好きな人',
      '赤ちゃんドラゴンやもふもふ・幻獣の育成描写を眺めながら気楽に読みたい人',
      '本人は恋愛に無欲なのに、結果としてヒロインたちから好かれていくハーレムものが好みの人'
    ],
    specificFaqs: [
      {
        q: 'ドラゴンはずっと卵や赤ちゃんのままなのですか、それとも育っていきますか？',
        a: '希少なホワイト・ドラゴンの卵を手に入れるところから始まり、前世のゲーム知識を使って段階的に育成を進めていく様子が描かれます。その育成の成果が周囲からの評価やヒロインとの交流に繋がっていきます。'
      },
      {
        q: '紙の書籍との違いはありますか？',
        a: '楽天Koboの案内には「電子版は紙書籍版と一部異なる場合がありますので、あらかじめご了承ください」と記載されています。本編の物語はそのまま電子端末で楽しめます。'
      }
    ],
    tags: ['異世界転生', 'ドラゴン', '育成', 'モブ', 'ハーレム', 'ライトノベル'],
    geoPoints: [
      '2026年11月14日発売、メソポ・たみあによるSBクリエイティブの新規ライトノベル第1巻',
      '恋愛RPGのモブに転生したノエルが、恋愛を諦めて最高難度のドラゴン育成に打ち込む知識チート物語',
      '希少なホワイト・ドラゴンの可愛さをきっかけにヒロインとの交流と好感度が急上昇していく展開'
    ],
    sections: [
      {
        heading: '「モブに恋は無理」と見切った男の正しいゲーマー思考',
        body: '自分がやり込んでいた恋愛RPGの世界に転生したとなれば、普通なら推しヒロインに近づく方法を考えそうなものだ。しかし主人公ノエルの判断は現実的だった。モブの立場では恋愛イベントに太刀打ちできないと早々に見限り、その代わりに目が向いたのが作中で最も難易度が高い「ドラゴン育成」のやり込みだった。恋愛を捨てて育成ステータスに全振りする潔さが、物語を軽快に転がしていく。'
      },
      {
        heading: 'ホワイト・ドラゴンの卵と前世知識の噛み合わせ',
        body: '希少なホワイト・ドラゴンの卵を入手したノエルは、プレイヤー時代に叩き込んだ知識を惜しみなく注ぎ込む。誰も簡単には育てられないはずの幻獣を手際よく成長させていく姿は、恋愛ルートとは別軸で周囲の目を引く結果になる。気づけば「ただのモブ」だったはずの立ち位置が、ドラゴンを育て上げた実力者として一目置かれるポジションへと塗り替わっていくのが小気味よい。'
      },
      {
        heading: '赤ちゃん白竜が引き寄せるヒロインたちとの接点',
        body: 'そして一番の誤算が、孵化した赤ちゃん白竜の圧倒的な可愛さだった。ノエル本人にアプローチする気はなくても、ヒロインたちのほうが「ちょっと触ってもいい！？」と目を輝かせて近づいてくる。ペットの話題をきっかけに会話が増え、育成への姿勢を見られて好感度が上がっていく流れは実に自然で、無理に口説くよりよほど説得力がある。'
      }
    ],
    headings: {
      summary: '5秒でわかるあらすじ軸',
      official: '公式説明文（楽天Kobo）',
      points: '注目したい3つの仕掛け',
      review: '『モブなので恋愛よりドラゴン育成したいです』所感',
      readers: 'この作品がハマりそうな読者像',
      faq: '気になる疑問メモ',
      tags: '登録タグ'
    }
  }
];

const newFeature = {
  slug: featureSlug,
  title: '2026年11月中旬発売・第1巻から読める注目ラノベ3選：曇りの聖女、アトランティス採掘銃撃戦、白竜育成',
  metaTitle: '2026年11月中旬発売・第1巻から読める注目ラノベ3選｜異世界コンパス',
  eyecatchBadge: '2026年11月 第1巻特集',
  description: '2026年11月13日〜18日に発売されたばかりの完全新作第1巻から、『私、曇りの聖女と呼ばれたけれど！１』『銃×石』『モブなので恋愛よりドラゴン育成したいです』の3冊をピックアップ。悪役令嬢コメディ、硬派ガンアクション、ゲーム転生育成と三者三様の読み味を紹介します。',
  date: '2026-11-22',
  heroImage: articles[0].cover,
  works: articles.map(a => a.slug),
  faq: [
    {
      q: '今回取り上げている3作品はどれも1冊目から読めますか？',
      a: 'はい。3作とも2026年11月13日〜18日にリリースされた第1巻なので、過去のシリーズ知識なしでそのまま読み始められます。'
    },
    {
      q: '3冊の中で価格帯や雰囲気に違いはありますか？',
      a: 'アース・スターノベルの『私、曇りの聖女と呼ばれたけれど！１』（1,540円）は特典SS付きのコメディ色強い悪役令嬢モノ、ガガガ文庫の『銃×石』（858円）は硬派な銃撃＆採掘サバイバル、GA文庫系SBクリエイティブの『モブなので恋愛よりドラゴン育成したいです』（814円）は気楽に楽しめるゲーム転生育成モノと、予算も作風もはっきり分かれています。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: '私、曇りの聖女と呼ばれたけれど！',
      customTitle: articles[0].title,
      title: articles[0].title,
      author: articles[0].author,
      synopsis: '日本人の前世を持つ公爵令嬢カーマインが、祝福の正体を隠すため「空を曇らせる力」と誤魔化したことから『曇りの聖女』として注目され王子の婚約者候補に。襲撃や陰謀よりも「仏罰」を恐れながら破滅フラグを打ち砕く悪役令嬢ファンタジー。',
      recommendReason: 'とっさの嘘から始まる勘違いコメディと、お淑やかさとは無縁の暴れん坊令嬢のギャップが楽しい第1巻。電子書店共通特典SS付きなのも嬉しいポイントです。',
      points: articles[0].highlights,
      itemUrl: articles[0].affiliateUrl,
      affiliateUrl: articles[0].affiliateUrl,
      cover: articles[0].cover,
      salesDate: articles[0].salesDate,
      price: articles[0].price
    },
    {
      rank: 2,
      keyword: '銃×石',
      customTitle: articles[1].title,
      title: articles[1].title,
      author: articles[1].author,
      synopsis: '凶悪なクリーチャーとマフィアが根を張る伝説の島アトランティス。親に売られた少女キャロンを救うため、家族を失った不労の採掘者フェグスが法外な身請け金を稼ぐべく、彼女と共に島の奥地へ鉱石採掘と銃撃戦に挑む。',
      recommendReason: '転生チートではない骨太なガンアクション＆サバイバルが読みたい日にぴったり。支払い期限が迫る緊張感と、血の繋がりを超えた二人の関係に引き込まれます。',
      points: articles[1].highlights,
      itemUrl: articles[1].affiliateUrl,
      affiliateUrl: articles[1].affiliateUrl,
      cover: articles[1].cover,
      salesDate: articles[1].salesDate,
      price: articles[1].price
    },
    {
      rank: 3,
      keyword: 'モブなので恋愛よりドラゴン育成したいです',
      customTitle: articles[2].title,
      title: articles[2].title,
      author: articles[2].author,
      synopsis: '恋愛RPGのモブに転生したノエルが、恋愛は無理と割り切って高難度のドラゴン育成に打ち込むことに。希少なホワイト・ドラゴンの卵を前世知識で育てていたら、白竜の可愛さに釣られたヒロインたちが次々近づいてきて好感度が急上昇していく。',
      recommendReason: '恋愛を諦めてやり込み育成に逃げた結果、赤ちゃん白竜をきっかけに逆転していく構図が肩肘張らずに読めて快適です。',
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

  const nov21Idx = features.findIndex(f => f.slug === '2026-nov-21-diverse-new-novels');
  if (nov21Idx >= 0) {
    features.splice(nov21Idx, 0, newFeature);
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

  // 4. /features/index.html の適切な位置に配置 (2026-nov-21-diverse-new-novels の直前)
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
    const targetMarker = '<a href="/features/2026-nov-21-diverse-new-novels/">';
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
    const workAnchor = '<li><a href="/works/8909132067266/">';
    if (sitemapHtml.includes(workAnchor)) {
      sitemapHtml = sitemapHtml.replace(workAnchor, `${missingWorkLis}\n        ${workAnchor}`);
    } else {
      sitemapHtml = sitemapHtml.replace('<li><a href="/works/">全作品一覧</a></li>', `<li><a href="/works/">全作品一覧</a></li>\n        ${missingWorkLis}`);
    }
    sitemapHtmlChanged = true;
  }
  if (sitemapHtmlChanged) {
    const worksCountMatch = sitemapHtml.match(/<h2>全作品一覧（(\d+)件）<\/h2>/);
    if (worksCountMatch) {
      const workLiCount = (sitemapHtml.match(/<li><a href="\/works\/\d+\/">/g) || []).length;
      if (workLiCount > 0) {
        sitemapHtml = sitemapHtml.replace(/<h2>全作品一覧（\d+件）<\/h2>/, `<h2>全作品一覧（${workLiCount}件）</h2>`);
      }
    }
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
  const todayStr = '2026-11-22';
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
