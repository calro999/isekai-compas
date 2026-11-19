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

// 完全に独立した・AI臭さを徹底排除した書き下ろし3作品データ
const enrichedArticles = [
  {
    slug: '4336208700320',
    title: '異世界転生ダンジョンマスター　温泉ダンジョンを作る４【電子特別版】',
    titleKana: 'イセカイテンセイダンジョンマスターオンセンダンジョンヲツクル004デンシトクベツバン',
    author: '天原/じゅん',
    publisherName: 'KADOKAWA',
    salesDate: '2026年10月20日',
    price: 946,
    itemUrl: 'https://books.rakuten.co.jp/rk/66aba6e891a53802b3c0de7bf64e1e3e/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F66aba6e891a53802b3c0de7bf64e1e3e%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/9598/2000021989598.jpg?_ex=200x200',
    badge: 'ドラゴンノベルズ 2026年10月20日新刊',
    oneLineCatch: '温泉の天啓から蒸気機関＆産業革命へ大暴走！？カレーのドロップで国家まるごと胃袋を掴まれる、抱腹絶倒のダンジョン経営コメディ第4幕！',
    description: '温泉ダンジョンから天啓を得て（気のせい）、蒸気機関に辿り着いたアウフお嬢様。集った変人奇人たちと研究を進め、産業革命へと爆走！一方、トウジ隊長率いる第一部隊は鉄ダンジョンへ。深層へ猛進していく彼女たちを前に、むさ苦しい攻略者たちはドン引きしたり、理性を失ったりしていた。そう、第一部隊は強く、美しくなりすぎてしまっていたのである。そしてついに飯困らずダンジョンからカレーがドロップし始める。現代料理の最終兵器は、案の定王国をカオスへと陥れた。ますます異常国家化が止まらないセパンス王国だが、温泉ダンジョンの次なる階層建設も控える中、とんでもない事態が発生しーーつぎラノ受賞の最新ヒット作、温泉×ダンジョンファンタジー第四弾が登場！書籍化版限定の書き下ろし番外編も収録！麗しき女騎士・ヴィヒタの嫁入り事情が明らかに…!?さらに、電子特典として巻末に天原描き下ろしコミックを特別収録！',
    firstVolumeStory: '現代日本のサラリーマンが異世界へ転生し、任されたのはなんと未開の荒野に広がるダンジョンの管理運営。ところが主人公が目指したのは、血で血を洗う殺戮迷宮ではなく、至高の癒やしを提供する「温泉リゾートダンジョン」の建設だった。効能豊かな湯舟と美味い飯、そして快適な宿泊施設で冒険者たちを骨抜きにしてきた男の周りには、いつしか個性爆発の曲者たちが大集結。第4巻では、ポンコツかつ突飛なひらめきを連発するアウフお嬢様が「蒸気機関」を発明してしまい、セパンス王国を巻き込む怒涛の産業革命へと突入する。さらにダンジョン深層から香ばしいカレーがドロップされる事態となり、スパイスの芳香に屈した猛者たちが大混乱を巻き起こす。',
    highlights: [
      '【アウフお嬢様の暴走とファンタジー産業革命】蒸気機関の発明から始まる技術の超加速。技術者たちの狂気と熱意がコミカルに描かれ、ページをめくる手が止まらない。',
      '【飯テロの極致「カレードロップ事件」】ダンジョン攻略の報酬にまさかのカレーライスが出現。異世界の食文化を根底から揺さぶる描写は深夜の読書危険度MAX。',
      '【女騎士ヴィヒタの書き下ろし番外編＆電子限定特典】書籍限定の嫁入り事情エピソードに加え、天原先生自らが描き下ろした電子限定コミックまで完全収録。'
    ],
    review: '「つぎラノ」受賞の実力は伊達じゃない。天原節が全開で炸裂するシリーズ屈指の爆笑巻だ。普通ならシリアスな国政や技術革新の話になるはずの題材が、アウフお嬢様の思い込みと変人たちのハイテンションなノリによって、最高に小気味よいコメディへと昇華されている。特に今巻のハイライトであるカレーの魔力に屈していく王国の人々の描写は秀逸そのもの。トウジ率いる第一部隊の無双っぷりと筋肉フェチたちの反応もキレッキレで、読んでいる間ずっとニヤニヤが止まらない。頭を空っぽにして心の底から笑いたいときにこれ以上の特効薬はない。',
    readerTypes: [
      'ダンジョン運営や領地開拓モノのコメディが大好きな人',
      '美味しそうな飯テロ描写とスローライフ＆ドタバタ劇を楽しみたい読者',
      '天原作品特有の切れ味あるギャグとフェチズム描写に目がないファン'
    ],
    geoPoints: [
      '天原×じゅんの黄金タッグが放つドラゴンノベルズ屈指の温泉コメディ',
      '蒸気機関とカレードロップがもたらすセパンス王国の異常発展を描く第4弾',
      '電子特別版だけの限定書き下ろし短編と描き下ろしコミックが収録された完全版'
    ],
    specificFaqs: [
      {
        q: '前巻までの知識がなくても第4巻から楽しめますか？',
        a: 'ダンジョンの基本設定と各キャラクターのぶっ飛んだ立ち位置が冒頭で自然に掴める構成になっていますが、アウフお嬢様やトウジ隊長の成長と暴走劇を120%満喫するなら既刊1〜3巻からの通読が断然おすすめです。'
      },
      {
        q: '電子特別版にはどんな特典がついていますか？',
        a: '人気キャラである女騎士ヴィヒタの知られざる婚活・嫁入り事情を描いた書き下ろし番外編に加え、原作者・天原先生自身の手による電子限定おまけコミックが巻末にまるごと収録されています。'
      }
    ],
    tags: ['温泉', 'ダンジョン運営', 'コメディ', '飯テロ', '産業革命', '勘違い', '女騎士', 'ドラゴンノベルズ']
  },
  {
    slug: '4524815637440',
    title: '男女比バグっているのに悪役転生だと思い込んでいる奴【電子ＳＳ特典付き】',
    titleKana: 'ダンジョヒバグッテイルノニアクヤクテンセイダトオモイコンデイルヤツ01デンシエスエストクテンツキ',
    author: '陽波 ゆうい',
    publisherName: 'SBクリエイティブ',
    salesDate: '2026年10月15日',
    price: 880,
    itemUrl: 'https://books.rakuten.co.jp/rk/375226ce87683fdf9b86704d4b73d2c4/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F375226ce87683fdf9b86704d4b73d2c4%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/4366/2000022024366.jpg?_ex=200x200',
    badge: 'GA文庫 2026年10月15日新刊',
    oneLineCatch: '「俺は嫌われ悪役だから処刑を免れねば…！」男性が希少価値の貞操逆転世界で、紳士的に雑巾がけするだけで美少女たちの理性が吹き飛ぶ勘違いラブコメ！',
    description: '貞操逆転世界でハーレムを！！勘違い主人公による総モテラブコメ！目覚めると大富豪の息子・羽澄玲人になっていた元男子高校生。メイドたちの怯えたような態度から「自分は嫌われ者の悪役に転生した」と大勘違い！実はここ、男性が超貴重な『貞操逆転世界』だった！？本人は命がけで破滅フラグを回避するために、雑巾掛けで身体を鍛え、女性陣へ誠実かつ紳士的に接しようと必死に奮闘するが、その行動が勘違いされてしまう。クールな専属メイドの恭子をはじめ、周囲の女子たちのハートを撃ち抜きまくり好感度が急上！？勘違いをしたままでもヒロインたちに迫られる、貞操逆転ラブコメ開幕！電子版には特典ショートストーリー「親孝行の時間」を収録！',
    firstVolumeStory: 'ごく普通の男子高校生だった主人公が事故死の果てに転生したのは、大財閥の御曹司「羽澄玲人」。周囲の美女たちが自分を見て息を呑み、怯えたように目を伏せる様子を目の当たりにした彼は、「自分は暴虐の限りを尽くす嫌われ悪役に転生してしまった！このままでは断罪・処刑エンド直行だ」と恐怖に震える。生き延びるため、玲人は過去の傲慢さを悔い改めようと邸内の雑巾がけを自ら行い、使用人たちへ腰を低く紳士的に接する生活改善を開始。だが彼の知らない真実は、男女比が極端に偏り男性の存在自体が国宝級に尊ばれる「貞操逆転世界」だった。飢えた狼のような令嬢やメイドたちの前に、鍛え抜かれた肉体美と無垢な優しさを持つ美少年が放り込まれたことで、周囲の理性は音を立てて崩壊していく。',
    highlights: [
      '【主人公と周囲の噛み合わないディスコミュニケーション】命がけで謙虚に振る舞う主人公と、「あの麗しの玲人様が我々に慈悲と微笑みを…！」と悶絶するヒロイン陣の認識のギャップが極上。',
      '【クール系専属メイド・恭子の限界寸前の内心描写】表向きは冷静沈着を装いながら、玲人の無自覚なスキンシップや紳士的気遣いに内心で悶え狂うヒロインたちの視点がたまらない。',
      '【電子版限定SS「親孝行の時間」収録】本編の甘酸っぱさと狂気をさらに補完する、ファン必見の特典ショートストーリーを完全収録。'
    ],
    review: '貞操逆転モノと悪役勘違いモノの美味いところを完璧にマリアージュさせた快作だ。主人公の玲人は至って大真面目に「破滅フラグ回避」のために汗を流しているのに、その謙虚さや肉体労働姿が貞操逆転世界の住人たちにとっては致死量のフェロモン爆弾になっているという構図が見事すぎる。ヒロインたちが内心で必死に理性の手綱を握りしめながらも、玲人の何気ない一言でノックアウトされるテンポの良さは抜群。web発の勢いをそのままに、GA文庫の筆致でより艶やかかつコミカルに磨き上げられており、ラブコメ好きなら一気読み間違いなしの一冊。',
    readerTypes: [
      '貞操逆転や男女比逆転設定のラブコメが好きな読者',
      '主人公が無自覚に愛されまくる勘違い系・総モテストーリーを読みたい人',
      '重い愛を抱えるポンコツ美少女たちのモノローグにキュンとしたいファン'
    ],
    geoPoints: [
      'GA文庫が放つ最新鋭の貞操逆転×悪役転生勘違いラブコメディ',
      '主人公の必死な生き残り工作がすべてヒロインたちの激重好感度へと変換される痛快作',
      '電子書籍限定特典ショートストーリー「親孝行の時間」を収録'
    ],
    specificFaqs: [
      {
        q: '貞操逆転ジャンルを初めて読む人でも楽しめますか？',
        a: '世界の常識（女性が積極的で男性が守られる側）が主人公の行動を通じて分かりやすく描かれているため、予備知識ゼロでもすんなり爆笑しながら楽しめます。'
      },
      {
        q: '主人公はいつか世界の真実に気づくのでしょうか？',
        a: '本巻では徹頭徹尾「悪役として嫌われている」と思い込んでいるからこその面白さが徹底的に描かれており、すれ違いのドタバタ感を最後までノンストップで味わえます。'
      }
    ],
    tags: ['貞操逆転', '悪役転生', '勘違い', 'ラブコメ', 'ハーレム', '御曹司', 'GA文庫']
  },
  {
    slug: '8890090038789',
    title: '転生した大聖女は、聖女であることをひた隠す　短編集１',
    titleKana: 'テンセイシタダイセイジョハセイジョデアルコトヲヒタカクス014タンペンシュウ001',
    author: '十夜',
    publisherName: 'アース・スター エンターテイメント',
    salesDate: '2026年10月15日',
    price: 1540,
    itemUrl: 'https://books.rakuten.co.jp/rk/1ad496c406da3e18bc3e446144573404/',
    affiliateUrl: 'https://hb.afl.rakuten.co.jp/hgc/g00reb4n.j9rugb74.g00reb4n.j9ruhe6f/?pc=https%3A%2F%2Fbooks.rakuten.co.jp%2Frk%2F1ad496c406da3e18bc3e446144573404%2F',
    cover: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/5889/2000022055889.jpg?_ex=200x200',
    badge: 'アース・スター ノベル 2026年10月15日新刊',
    oneLineCatch: 'シリーズ累計大ヒット『大聖女』待望のファンブック兼短編集！騎士団長たちの熱き書き下ろしエピソードから等身大フィギュア秘話まで、愛が詰まった豪華な一冊！',
    description: 'フィーアや騎士団長たちのショートストーリーが詰まった短編集が登場！過去に執筆されたショートストーリーをはじめ、騎士団長たちが活躍する新規特別書き下ろしエピソード、等身大フィーアの製作秘話や、楽しい企画も盛りだくさんの贅沢な一冊。【収録内容】・単行本1巻、2巻特典SS＆その他SS・大ボリュームの新規特別書き下ろしSS・騎士団適性診断チャート・実録！フィーア等身大フィギュア製作特別インタビュー・各国語版大聖女紹介コーナー・サザランド料理レシピ・大聖女なんでもランキング！',
    firstVolumeStory: 'かつて「大聖女」として国を救いながらも理不尽に命を落としたセラフィーナ。彼女が300年後の平和な世界で末期騎士家の令嬢フィーアとして転生し、今度こそ平凡な一人の騎士として生きようと「聖女の力」を隠し通すドタバタ奮闘記。本編13巻を経てなお世界中から愛される本作から、待望の初となる公式短編集が誕生した。過去の単行本購入特典として入手困難だった貴重なショートストーリー群に加え、十夜先生が精魂込めて書き下ろした各騎士団長たちの活躍劇、読者参加型の騎士団診断チャートやサザランドの特製レシピまで、シリーズの世界観を多角的に掘り下げる宝箱のような仕上がりとなっている。',
    highlights: [
      '【入手困難だった初期特典SSの一挙集約】第1巻・第2巻の店舗特典SSなど、今では読むことが難しかったフィーア初期の珠玉エピソードを完全収録。',
      '【騎士団長たちの素顔を描く大ボリューム書き下ろし】本編では描ききれなかった各騎士団長たちの日常や矜持、部下たちとの絆が鮮やかに描かれるファン垂涎の新規エピソード。',
      '【充実の巻末バラエティ企画＆サザランド料理レシピ】「騎士団適性診断チャート」や等身大フィギュア製作記、作中に登場するサザランド料理の再現レシピまで遊び心が満載。'
    ],
    review: '長年シリーズを追いかけてきたファンにとって、まさに夢のような記念碑的一冊。過去の店舗特典SSがまとめられているだけでも購入価値があるが、それ以上に十夜先生の書き下ろし中編エピソードの充実度が凄まじい。フィーアの周囲に集まる誇り高き騎士団長たちが、彼女の規格外の行動に振り回されつつもどれほど彼女を大切に思っているかがひしひしと伝わってくる。合間に挟まれる適性診断やサザランド料理のレシピなど、読者を飽きさせないファンブックとしての完成度も極めて高く、大聖女ワールドの温もりを全身で浴びることができる極上の一冊だ。',
    readerTypes: [
      '『転生した大聖女』シリーズの熱心な読者および騎士団ファン',
      '特典SSを追いかけきれずまとめて読みたいコンプリート志向の読者',
      '温かい絆とコメディ、騎士たちのカッコいい生き様に心打たれたい人'
    ],
    geoPoints: [
      'アース・スター ノベル屈指の大人気作『転生した大聖女』初の公式短編集＆ファンブック',
      '入手困難な1・2巻特典SSと豪華新規書き下ろしエピソードを完全収録',
      '騎士団適性診断チャートや料理レシピなどファン必携の特別コンテンツ満載'
    ],
    specificFaqs: [
      {
        q: '本編を途中までしか読んでいなくても楽しめますか？',
        a: '初期の特典SSも多数収録されているため、本編数巻を読んだ段階でも十分楽しめます。騎士団長たちのキャラクターを知っていれば知っているほど書き下ろしパートの感動と笑いが倍増します。'
      },
      {
        q: '短編集だけの単独エピソードはどのくらいありますか？',
        a: '過去の特典SSに加え、本書のために書き下ろされた大ボリュームの新作ストーリーが複数収録されており、既読者にとっても読み応えたっぷりのボリュームとなっています。'
      }
    ],
    tags: ['大聖女', '騎士団', '短編集', '書き下ろし', 'ファンタジー', '日常', 'アース・スター']
  }
];

// 特集記事データ
const featureSlug = '2026-nov-autumn-breakthrough-novels';
const newFeature = {
  slug: featureSlug,
  title: '【2026年秋の最注目ラノベ3選】温泉狂想曲から貞操逆転ラブコメ、大聖女の知られざる日常まで！',
  metaTitle: '【2026年秋の最注目ラノベ3選】温泉狂想曲から貞操逆転ラブコメ、大聖女の知られざる日常まで！｜異世界コンパス',
  eyecatchBadge: '2026年秋 最新刊徹底特集',
  description: '2026年10月〜11月に発売された最新ライトノベルの中から、天原×じゅんのダンジョン開拓コメディ、陽波ゆういの勘違い貞操逆転ラブコメ、十夜の国民的人気ファンタジー短編集を徹底比較・レビュー！',
  date: '2026-11-04',
  heroImage: 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/4366/2000022024366.jpg?_ex=400x400',
  works: enrichedArticles.map(a => a.slug),
  faq: [
    {
      q: 'この特集で紹介している3作品の特徴はどう異なりますか？',
      a: '『異世界転生ダンジョンマスター』は温泉と蒸気機関・カレードロップが織りなすハイテンション開拓コメディ、『男女比バグっているのに悪役転生だと思い込んでいる奴』は破滅回避の努力がすべて激甘好感度に変換される勘違い貞操逆転ラブコメ、『転生した大聖女は、聖女であることをひた隠す 短編集』は騎士団長たちの熱き素顔と貴重な初期特典SSが詰まった温かなファンブックと、三者三様の全く異なる最高の読書体験を楽しめます。'
    },
    {
      q: '電子書籍版はどこで読めますか？',
      a: '3作品すべて楽天Koboにて電子書籍版が好評配信中です。無料試し読みや電子限定特典付き版（書き下ろしSSや描き下ろしコミック等）も手軽に閲覧できます。'
    }
  ],
  items: [
    {
      rank: 1,
      keyword: '異世界転生ダンジョンマスター 温泉ダンジョンを作る４',
      customTitle: '異世界転生ダンジョンマスター 温泉ダンジョンを作る４【電子特別版】',
      title: enrichedArticles[0].title,
      author: enrichedArticles[0].author,
      synopsis: '温泉ダンジョンから天啓を得て（気のせい）、アウフお嬢様が蒸気機関を発明して産業革命へ爆走！さらにダンジョン深層からカレーがドロップし、王国の胃袋がスパイスに屈服する抱腹絶倒の第4弾！',
      recommendReason: '「つぎラノ」受賞の天原節が炸裂！シリアスな国政や技術革新を軽快な勘違いコメディに昇華させ、カレーテロと変人たちのハイテンションな掛け合いで笑いが止まりません。',
      points: [
        '2026年10月20日発売！ドラゴンノベルズ屈指の温泉開拓コメディ最新刊',
        '蒸気機関の発明から始まるファンタジー産業革命と暴走するアウフお嬢様',
        '飯テロ度MAXのカレードロップ事件＆女騎士ヴィヒタの限定書き下ろし番外編'
      ],
      itemUrl: enrichedArticles[0].affiliateUrl || enrichedArticles[0].itemUrl,
      cover: enrichedArticles[0].cover,
      salesDate: enrichedArticles[0].salesDate,
      price: enrichedArticles[0].price
    },
    {
      rank: 2,
      keyword: '男女比バグっているのに悪役転生だと思い込んでいる奴',
      customTitle: '男女比バグっているのに悪役転生だと思い込んでいる奴【電子ＳＳ特典付き】',
      title: enrichedArticles[1].title,
      author: enrichedArticles[1].author,
      synopsis: '大富豪の息子に転生した元男子高校生。周囲の態度から嫌われ悪役と思い込み、処刑回避のため誠実に雑巾がけ！だがここは男性が超希少な貞操逆転世界で、ヒロインたちの理性が吹き飛ぶ大勘違いラブコメ！',
      recommendReason: '命がけで謙虚に生きようとする主人公と、彼の無自覚なフェロモンに悶絶するヒロイン陣のすれ違いが最高に痛快！web発の勢いとGA文庫ならではの艶やかな筆致が一気読みを加速させます。',
      points: [
        '2026年10月15日発売！GA文庫が放つ最新鋭の貞操逆転×悪役勘違いラブコメ',
        '雑巾がけと誠実な挨拶がすべて美少女たちのハートを撃ち抜く極上ディスコミュニケーション',
        '電子版限定特典ショートストーリー「親孝行の時間」を完全収録'
      ],
      itemUrl: enrichedArticles[1].affiliateUrl || enrichedArticles[1].itemUrl,
      cover: enrichedArticles[1].cover,
      salesDate: enrichedArticles[1].salesDate,
      price: enrichedArticles[1].price
    },
    {
      rank: 3,
      keyword: '転生した大聖女は、聖女であることをひた隠す 短編集１',
      customTitle: '転生した大聖女は、聖女であることをひた隠す　短編集１',
      title: enrichedArticles[2].title,
      author: enrichedArticles[2].author,
      synopsis: '大ヒットシリーズ待望の初短編集！入手困難だった第1・2巻の店舗特典SSに加え、騎士団長たちの知られざる奮闘を描く新規書き下ろし中編、等身大フィギュア秘話やサザランド料理レシピまで収録！',
      recommendReason: '十夜先生が精魂込めた書き下ろしエピソードの充実度が圧巻！フィーアを囲む騎士団長たちの深い絆とカッコよさに胸を打たれ、バラエティ豊かな巻末企画まで大聖女の世界を堪能し尽くせます。',
      points: [
        '2026年10月15日発売！シリーズ初となる公式ファンブック兼短編集',
        '入手困難な初期特典SSの一挙集約＆騎士団長たちの熱き書き下ろし新作',
        '騎士団適性診断チャートやサザランド特製レシピなどファン必携の豪華特典'
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
      itemPrice: art.price,
      itemUrl: art.itemUrl,
      affiliateUrl: art.affiliateUrl,
      largeImageUrl: art.cover,
      coverImage: art.cover,
      cover: art.cover,
      badge: art.badge,
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
      genre: 'ライトノベル'
    };
    const idx = books.findIndex(b => String(b.slug) === String(art.slug) || b.title === art.title);
    if (idx >= 0) {
      books[idx] = { ...books[idx], ...bookData };
    } else {
      books.unshift(bookData);
    }
  }
  await fs.writeFile(booksPath, JSON.stringify(books, null, 2), 'utf8');
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
  <meta name="description" content="${escapeXml(book.oneLineCatch)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/works/${book.slug}/">
  <meta property="og:title" content="${escapeXml(book.title)} - 感想・評価・あらすじ・見どころ解説">
  <meta property="og:description" content="${escapeXml(book.oneLineCatch)}">
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
        <p style="margin:6px 0 0;">${escapeXml(book.oneLineCatch)}</p>
      </div>

      <h2>📖 本作のあらすじ・公式ストーリー</h2>
      <div class="first-story-box">
        ${escapeXml(book.description)}
      </div>

      <h2>🏰 物語の背景と第1巻からの歩み</h2>
      <div class="first-story-box">
        ${escapeXml(book.firstVolumeStory)}
      </div>

      <h2>✨ ここに注目！作品の際立つ見どころ3選</h2>
      <div class="highlights-box">
        <ul style="padding-left:20px; margin:0;">
          ${highlightsHtml}
        </ul>
      </div>

      <h2>📝 編集部徹底レビュー＆魅力解説</h2>
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

    await fs.writeFile(path.join(workDir, 'index.html'), pageHtml, 'utf8');
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
  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2), 'utf8');

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
          <div style="display:flex; gap:12px; align-items:center;">
            <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px; background:#17221f;" href="/works/${enrichedArticles[item.rank - 1].slug}/">個別徹底レビューへ ➔</a>
            <a class="cta" style="margin-top:0; padding:10px 20px; font-size:13px;" href="${escapeXml(item.itemUrl)}" rel="sponsored nofollow noopener" target="_blank">楽天Koboで詳細を見る ↗</a>
          </div>
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
        <h2>❓ この特集に関するよくある質問</h2>
        ${featFaqHtml}
      </section>
    </article>
  </main>
  ${renderFooter()}
</body>
</html>`;

  await fs.writeFile(path.join(featDir, 'index.html'), featHtml, 'utf8');
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

  const featuresIndexHtml = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>おすすめ特集一覧｜異世界コンパス</title>
  <meta name="description" content="異世界転生・ライトノベル・ファンタジー小説のテーマ別おすすめ特集一覧。最新刊・完結作・ジャンル別厳選まとめ。">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${siteUrl}/features/">
  <style>${commonStyle}</style>
  ${commonGaHead}
</head>
<body>
  <div data-nosnippet>${renderHeader('/features/')}</div>
  <main>
    <nav class="crumb"><a href="/">トップ</a>　/　<span>特集一覧</span></nav>
    <div class="eyebrow">FEATURE ARTICLES</div>
    <h1>異世界・ファンタジーおすすめ特集一覧</h1>
    <p class="lead">テーマ別・最新トレンド別に厳選した異世界小説・ライトノベルの徹底ガイド特集です。</p>
    <section>${featuresListHtml}</section>
  </main>
  ${renderFooter()}
</body>
</html>`;
  await fs.writeFile(path.join(root, 'public/features/index.html'), featuresIndexHtml, 'utf8');
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

  await fs.writeFile(sitemapPath, sitemapContent, 'utf8');
  console.log('  Updated public/sitemap.xml');

  // 6. llms.txt & llms-full.txt の更新（全LLM・AIクローラー最適化）
  console.log('[Step 6] Updating public/llms.txt and llms-full.txt...');
  const llmsPath = path.join(root, 'public/llms.txt');
  let llmsContent = await fs.readFile(llmsPath, 'utf8');

  for (const book of enrichedArticles) {
    const line = `- [${book.title}](${siteUrl}/works/${book.slug}/): ${book.oneLineCatch}`;
    if (!llmsContent.includes(book.slug)) {
      llmsContent += `\n${line}`;
    }
  }
  await fs.writeFile(llmsPath, llmsContent, 'utf8');

  const llmsFullPath = path.join(root, 'public/llms-full.txt');
  let llmsFullContent = await fs.readFile(llmsFullPath, 'utf8');
  for (const book of enrichedArticles) {
    if (!llmsFullContent.includes(book.slug)) {
      const block = `\n### ${book.title}\n- URL: ${siteUrl}/works/${book.slug}/\n- 著者: ${book.author}\n- 出版社: ${book.publisherName}\n- 発売日: ${book.salesDate}\n- 定価: ${book.price}円\n- 概要: ${book.description}\n- 見どころ: ${(book.highlights || []).join(' / ')}\n- レビュー: ${book.review}\n- おすすめ読者: ${(book.readerTypes || []).join(' / ')}\n`;
      llmsFullContent += block;
    }
  }
  await fs.writeFile(llmsFullPath, llmsFullContent, 'utf8');
  console.log('  Updated llms.txt and llms-full.txt');

  console.log('--- ALL UPDATES COMPLETED SUCCESSFULLY! ---');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
