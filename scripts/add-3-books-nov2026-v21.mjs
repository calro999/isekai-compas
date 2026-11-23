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

const featureSlug = '2026-nov-23-three-new-angles';

const articlesContent = {
  '4336811500320': {
    pubDateRfc: 'Fri, 20 Nov 2026 09:00:00 GMT',
    badge: 'KADOKAWA 2026年11月20日発売',
    genre: '青春サスペンス・ボーイミーツガール',
    color: 'slate',
    oneLineCatch: '予定のない夏休みに沈んでいた高校生・碓永が、余命わずかの少女・灰野から「死ぬ前に殺したい奴がいる」と持ちかけられ、共犯関係じみた夏へ踏み込んでいく。',
    firstVolumeStory: '夏休みなのにこれといった予定もなく、鬱屈とした毎日をやり過ごしていた高校生の碓永（うすなが）。そんな彼の前に現れた少女・灰野（はいの）は、すでに余命がわずかだと宣告されていた。しかし彼女が口にしたのは、やり残した夢や優しい思い出づくりではなく、「死ぬ前に殺したい奴がいるの」という物騒な計画。不敵に笑う灰野に巻き込まれる形で、碓永の退屈だった夏休みは一気に危うい殺人計画へと傾いていく。',
    highlights: [
      '「やりたいこと」に「殺りたい」を当てたタイトルどおり、余命モノの湿っぽさを裏切る不穏な入り方',
      '何も起きない夏休みを持て余していた碓永と、残り時間が限られた灰野という、歩幅の合わない二人の共犯関係',
      '猫田佐文のテキストと東条さかなのイラストで、ファンタジア文庫から2026年11月20日に発売されたばかりの新作'
    ],
    review: '余命わずかな少女と出会う夏休み、とだけ聞けばたいていは綺麗な涙を流して終わる話を想像する。けれど『彼女と死ぬまでに殺りたいこと』は、そこを真正面からずらしてくる。灰野が口にするのは「死ぬ前に殺したい奴がいるの」という一言だ。しかも、相手の男子高校生・碓永の側も、まぶしい青春を謳歌しているタイプではなく、予定のない夏休みを憂鬱そうにやり過ごしていた男である。やり場のない退屈を抱えた少年と、限られた命を誰かへの殺意に注ごうとしている少女。二人のあいだに芽生えるのが恋なのか、ただの共犯意識なのか、それとも別の感情なのかが読めないまま夏休みが進んでいく危うさに惹かれる。静かな夜にページをめくりたくなる温度の一冊だ。',
    readerTypes: [
      '泣かせにくるだけの余命モノではなく、少し毒やサスペンスが混じった青春小説を読みたい人',
      '「夏休み」「余命」「殺人計画」という噛み合わなさそうな組み合わせが気になった人',
      '2026年11月20日発売のファンタジア文庫新作を1巻から追いたい人'
    ],
    specificFaqs: [
      {
        q: 'タイトルの「殺りたいこと」はどんな意味合いですか？',
        a: '余命わずかと宣告された少女・灰野が、主人公の碓永に「死ぬ前に殺したい奴がいるの」と打ち明けることから物語が動き出すため、やりたいことリストのようでいて文字通り殺人計画を指しています。'
      },
      {
        q: 'シリーズものの途中巻ですか？',
        a: 'いいえ、2026年11月20日にKADOKAWA（ファンタジア文庫）から刊行された第1巻なので、これ一冊からそのまま読み始められます。'
      }
    ],
    tags: ['青春', 'サスペンス', 'ボーイミーツガール', 'ファンタジア文庫', 'ライトノベル'],
    geoPoints: [
      '2026年11月20日発売、猫田佐文・イラスト東条さかなによるKADOKAWAファンタジア文庫の新作',
      '予定のない夏休みを過ごす高校生・碓永が、余命わずかな少女・灰野の殺人計画に協力する青春サスペンス',
      '王道の余命物語とは異なる、不敵な少女と退屈な少年の共犯関係を描いた第1巻'
    ],
    sections: [
      {
        heading: '「死ぬまでにやりたいこと」を物騒に書き換える始まり方',
        body: '余命宣告を受けたヒロインが登場する小説には、海を見に行くとか、学校で思い出を作るとか、どこか清らかなお約束がある。それに対して灰野は、余命わずかな身でありながら「死ぬ前に殺したい奴がいる」と言い放つ。綺麗な思い出より先に殺意を片付けておきたいという歪んだ切実さがあるからこそ、物語の空気が最初からピリッと張り詰めている。'
      },
      {
        heading: '憂鬱な夏休みと殺人計画の奇妙な相性',
        body: '巻き込まれる側の碓永も、夏休みに何の予定も立てられず憂鬱を抱えていた高校生だ。もし彼が充実した毎日を送っていたら、灰野の突拍子もない誘いはただの迷惑で終わったかもしれない。空白だらけの夏を持て余していたからこそ、彼は灰野の計画に足を踏み入れてしまう。退屈と死期という二つの極端な時間が重なったとき、二人の距離がどう動くのかが見ものだ。'
      }
    ],
    headings: {
      summary: '30秒で把握する導入メモ',
      official: '楽天Kobo 掲載の公式あらすじ',
      points: '読み始める前に押さえておきたい着眼点',
      review: '『彼女と死ぬまでに殺りたいこと』に感じた危うい引力の正体',
      readers: 'こんな夜の読書に向いている一冊',
      faq: '購入前によくある疑問',
      tags: 'この作品の分類タグ'
    }
  },
  '4320000960043': {
    pubDateRfc: 'Wed, 18 Nov 2026 09:00:00 GMT',
    badge: '小学館 2026年11月18日発売',
    genre: '学園ラブコメ・ヒロイン特定ミステリー',
    color: 'crimson',
    oneLineCatch: '双子の妹たちが最愛の義兄・威吹に近づく「正体不明の5人のヒロイン」の正体を突き止めるべく情花学園へ潜入。応援派の姉と阻止派の妹が思惑違いの調査を始める。',
    firstVolumeStory: '真島日葵（まじま ひなた）と椿（つばき）の双子姉妹が情花学園へ入学した理由はただひとつ。大好きすぎる義理の兄・威吹（いぶき）にこっそり近づいている「5人のヒロイン」が誰なのかを突き止めることだった。二人が握っている手がかりは、『聖人』（兄に告白）、『魔王』（兄と同衾）、『かぐや』（兄とお泊まりデート）、『歌姫』（兄とキス）、『共犯者』（兄と共同生活）という衝撃の5項目。恋路を応援したい日葵と、なんとしても阻止したい椿がそれぞれの思惑でヒロイン捜しを進めるうちに、思いがけない事実に突き当たっていく。',
    highlights: [
      '第20回小学館ライトノベル大賞〈優秀賞〉受賞作で、主人公の義兄がほぼ不在という変化球の視点構成',
      '告白・同衾・お泊まりデート・キス・共同生活と、5人のヒロイン候補にまつわる情報が最初から濃すぎる',
      '「応援したい日葵」と「阻止したい椿」で双子のゴールが真逆のため、調査のたびに掛け合いが転がる'
    ],
    review: '帯や紹介文にある「主人公ほぼ不在の変化球ラブコメ」という言葉に偽りがない。普通ならモテモテの兄貴・威吹が主人公としてヒロインたちとイチャつくところを、この本では義妹の双子姉妹である日葵と椿が「兄に近づく5人の女を特定してやる！」と学園に乗り込む側から描いている。しかも二人が調べ上げた事前メモがひどい（褒めている）。『聖人』は告白、『魔王』はお泊まりどころか同衾、『かぐや』はお泊まりデート、『歌姫』はキス、『共犯者』は共同生活と、兄貴はいったい裏で何をやらかしているのかとツッコみたくなる情報ばかりが並んでいる。さらにややこしいのが、兄の恋愛を「応援したい」日葵と「阻止したい」椿で双子の足並みがまるで揃っていないこと。ラブコメと犯人捜しを混ぜたような軽快な構造で、ガガガ文庫の賞受賞作らしい一癖ある面白さがしっかり立っている。',
    readerTypes: [
      'ハーレムラブコメを「周囲の探偵役・身内目線」から眺めるひねった構成が好きな人',
      '個性派の双子ヒロインが言い合いをしながら調査を進める賑やかな学園モノが読みたい人',
      '第20回小学館ライトノベル大賞の優秀賞受賞作をチェックしておきたい人'
    ],
    specificFaqs: [
      {
        q: '義兄の威吹は作中にまったく出てこないのですか？',
        a: '公式紹介では「主人公ほぼ不在の変化球ラブコメ」と案内されており、物語の中心は双子姉妹（日葵と椿）による5人のヒロインの正体特定パートで進みます。'
      },
      {
        q: '電子版に挿絵や特典情報は入っていますか？',
        a: '楽天Koboの書誌情報では、底本と同じクオリティのカラーイラスト・モノクロ挿絵イラストに加えて「ガ報」も収録されていることが明記されています。'
      }
    ],
    tags: ['ラブコメ', '学園', '義妹', 'ガガガ文庫', '小学館ライトノベル大賞', 'ライトノベル'],
    geoPoints: [
      '2026年11月18日発売、前藤たんか（イラスト：池内たぬま）による第20回小学館ライトノベル大賞優秀賞受賞作',
      '双子姉妹・真島日葵と椿が、義兄・威吹と親密な5人の正体不明ヒロインを捜す学園ラブコメ',
      '主人公ほぼ不在のまま、応援派と阻止派の双子目線で謎解きが進む変化球の構成が特徴'
    ],
    sections: [
      {
        heading: '兄貴のモテ履歴が「調査リスト」になって出てくる異常事態',
        body: '日葵と椿が情花学園に入学する前にまとめ上げた5人のコードネームと実績がとにかく濃い。善良な『聖人』は告白済み、偉大な『魔王』は同衾済み、美麗な『かぐや』はお泊まりデート済み、不明な『歌姫』はキス済み、邪悪な『共犯者』に至っては共同生活までしているという。しかも全員が情花学園の生徒である可能性が高いと来れば、妹たちが黙っていられないのも納得だ。'
      },
      {
        heading: '応援する姉と阻止する妹、同盟なのに目的が真逆',
        body: '面白いのは、日葵が兄の恋路を「応援するため」に、椿がそれを「阻止するため」に同じ捜査をしている点だ。敵情視察という意味では協力関係にあるのに、正体が割れた後のアクションは真逆になる。お互いに腹の内を探りながらターゲットを絞り込んでいくテンポが良く、ただのハーレム紹介で終わらない仕掛けになっている。'
      },
      {
        heading: '「主人公ほぼ不在」だからこそ効いてくる推理ゲーム感',
        body: 'もし兄の威吹が語り手だったら、彼女たちとの甘いやり取りを順番に見せるだけの話になったはず。あえて兄を遠景に引いて、双子姉妹の側から断片的な噂や行動を繋ぎ合わせる形にしたことで、「この中の誰が『魔王』で誰が『歌姫』なのか」と読者も一緒に当てにいく楽しさが生まれている。'
      }
    ],
    headings: {
      summary: '設定の骨組みをパッと確認',
      official: '公式紹介文（楽天Kobo）',
      points: '変化球ラブコメとして目を引く3つの仕掛け',
      review: '「兄貴がほぼ出てこない」のにラブコメが成立するおかしさ',
      readers: 'このノリが合いそうな人',
      faq: '買う前に知っておきたいQ&A',
      tags: '関連キーワード'
    }
  },
  '7224000961944': {
    pubDateRfc: 'Mon, 09 Nov 2026 09:00:00 GMT',
    badge: 'アルファポリス 2026年11月09日発売',
    genre: '追放ファンタジー・異世界グルメ',
    color: 'amber',
    oneLineCatch: 'レベルが低いという理由だけで最強クランを追放された料理人カインが、Sランク相当の腕前を隠したまま猫人族の少女チュールと故郷へのんびり旅をする。',
    firstVolumeStory: '王都きっての強豪クラン『ドラゴンブレス』で料理人を務めていたカインは、レベルの低さを理由にクランを追い出されてしまう。腐ることもなく「故郷へ帰って食堂でも開こう」と旅立ったカインは、道中で魔物に襲われていた猫人族の少女・チュールを救う。彼女に懐かれて二人で歩く道中、山賊に始まり、チュールを狙う悪代官、さらには故郷に迫る十万もの帝国軍まで次々と厄介事が立ちはだかる。ところが実はクランで実力を隠していたカインは、その正体がSランク相当の規格外。どんな相手にも顔色ひとつ変えず、あっさり片付けて旅を続けていく。',
    highlights: [
      '「レベルの低さ」だけを見て料理人をクビにしたクランから離れ、故郷で食堂を開くつもりで旅立つ気楽な導入',
      '助けた猫人族の少女チュールが懐いて旅の相棒になり、道中で出会う悪党や魔物を淡々と退けていく',
      '山賊や悪代官だけでなく十万規模の帝国軍まで、Sランク相当の隠れた実力で顔色を変えずに解決する爽快さ'
    ],
    review: '追放モノは山ほどあるけれど、主人公が「クビにされたなら田舎に帰って食堂でもやるか」とあっさり気持ちを切り替えて旅に出る導入はやっぱり読み心地がいい。王都最強の『ドラゴンブレス』でサポートしていたカインは、表面上のレベルだけを理由に追い出されるが、実は真の実力がSランク相当。そんな男が、道中で助けた猫人族のチュールを連れてぷらぷら歩いているのだから、山賊や悪代官がちょっかいを出したところで勝負になるはずがない。面白いのは、後半でスケールが一気に「故郷を襲う十万もの帝国軍」まで跳ね上がっても、カインのペースがほとんど崩れないところだ。ギスギスした復讐劇に寄りすぎず、美味しい料理と猫人族の相棒を連れた世直しぶらり旅として気楽に読める一冊に仕上がっている。',
    readerTypes: [
      '追放された主人公が恨み節よりマイペースな新生活を優先する、ストレスの少ない異世界モノが好きな人',
      '料理人×隠れSランク最強×猫人族の相棒という組み合わせにピンと来た人',
      'アルファポリスの人気Web小説の書籍版をまとめて読みたい人'
    ],
    specificFaqs: [
      {
        q: '料理パートとバトルパートではどちらが中心ですか？',
        a: '追放された料理人が故郷で食堂を開くために旅をしながら、道中で出会う山賊・悪代官・帝国軍といったトラブルを隠していたSランク相当の実力で次々解決していくため、グルメ要素と爽快な世直しバトルの両方が楽しめます。'
      },
      {
        q: '初めて読む場合でもこの巻から入って大丈夫ですか？',
        a: 'はい、クランを追放されて旅に出るところから描かれる第1巻ですので、事前知識なしでそのまま楽しめます。'
      }
    ],
    tags: ['異世界', '追放', '料理', '最強主人公', 'アルファポリス', 'ライトノベル'],
    geoPoints: [
      '2026年11月9日発売、TBによるアルファポリスの追放＆異世界グルメファンタジー第1巻',
      '最強クラン『ドラゴンブレス』をレベル不足で追放された料理人カインが、猫人族チュールと故郷を目指す旅を描く',
      '実はSランク相当の力を隠していた主人公が、山賊や悪代官、十万の帝国軍まで顔色を変えずに退ける世直し譚'
    ],
    sections: [
      {
        heading: '「レベルが低い」で追い出された職人が向かう先は、故郷の食堂',
        body: '王都トップクラスのクラン『ドラゴンブレス』は、数値の低さだけを見て料理人のカインを切り捨ててしまう。ここまでは定番の追放劇だが、カインは元仲間を見返してやろうと息巻くより先に「故郷に戻って食堂でも開こう」と旅支度を始める。肩の力が抜けた目標があるおかげで、物語全体の空気が明るく保たれている。'
      },
      {
        heading: '猫人族の少女チュールとの出会いが、ぶらり旅を賑やかにする',
        body: '旅の途中で魔物に襲われていた猫人族のチュールを助けたことで、一人のんびり帰るはずだった道中に相棒が加わる。彼女に懐かれて一緒に歩くうちに、山賊やチュールを狙う悪代官といったわかりやすい悪党が次々と現れるのも旅モノらしい展開だ。守る相手がいるからこそ、カインの腕っぷしと料理の腕前が自然と映える。'
      },
      {
        heading: '相手が十万の帝国軍でも変わらない「日常の延長」の安心感',
        body: '物語の規模は山賊から悪代官、さらには故郷へ攻め寄せる十万の帝国軍へと一気に膨らんでいくが、カイン自身は顔色ひとつ変えない。普段は実力を隠していただけで本気を出せばSランク相当という裏付けがあるため、どんな大軍を前にしても「この男ならなんとかしてくれる」という気楽な安心感を持ってページをめくれる。'
      }
    ],
    headings: {
      summary: '旅のあらまし（ひとこと整理）',
      official: '楽天Kobo あらすじ',
      points: '『美味いだろ？』の気持ちよく読めるツボ',
      review: '十万の帝国軍を前にしても「食堂の主人」みたいな顔をしている強み',
      readers: 'こんな読後感を求めている人に',
      faq: '作品・書籍についてのQ&A',
      tags: '作品のタグ'
    }
  }
};

const targetSlugs = ['4336811500320', '4320000960043', '7224000961944'];

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
        <a href="/features/${featureSlug}/">2026年11月発売・作風がまるで違う新作ラノベ3選（青春サスペンス・変化球ラブコメ・追放グルメ）</a>
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
  console.log('=== [Step 1] Loading Rakuten API raw research data & existing site data ===');
  const rawList = JSON.parse(await fs.readFile(path.join(root, 'scripts/temp_research_5books_nov23.json'), 'utf8'));
  const rawMap = new Map(rawList.map(item => [String(item.itemNumber), item]));

  const articles = targetSlugs.map(slug => {
    const raw = rawMap.get(slug);
    if (!raw) throw new Error(`Missing raw Rakuten API data for slug: ${slug}`);
    const content = articlesContent[slug];
    return {
      slug,
      title: raw.title,
      titleKana: raw.titleKana,
      seriesName: raw.seriesName || raw.title,
      author: raw.author,
      publisherName: raw.publisherName,
      salesDate: raw.salesDate,
      price: raw.itemPrice,
      itemUrl: raw.itemUrl,
      affiliateUrl: raw.affiliateUrl,
      cover: raw.largeImageUrl,
      description: String(raw.itemCaption || '').replace(/\n+/g, '').trim(),
      ...content
    };
  });

  const newFeature = {
    slug: featureSlug,
    title: '2026年11月発売・作風がまるで違う新作ラノベ3選：余命少女×殺人計画、兄不在の双子ラブコメ、追放料理人の世直し旅',
    metaTitle: '2026年11月発売・作風がまるで違う新作ラノベ3選｜異世界コンパス',
    eyecatchBadge: '2026年11月23日 新刊特集',
    description: '2026年11月9日〜20日に発売された第1巻から、ファンタジア文庫『彼女と死ぬまでに殺りたいこと』、ガガガ文庫『あくまでてんしです』、アルファポリス『美味いだろ？　クランを追放された最強料理人の異世界ぶらり旅』の3冊を紹介。',
    date: '2026-11-23',
    heroImage: articles[0].cover,
    works: articles.map(a => a.slug),
    faq: [
      {
        q: '今回紹介している3冊はどれから読んでも楽しめますか？',
        a: 'はい。いずれも2026年11月発売の第1巻なので、シリーズの予備知識は不要です。重めのサスペンスなら『彼女と死ぬまでに殺りたいこと』、賑やかな学園モノなら『あくまでてんしです』、気楽な異世界旅なら『美味いだろ？』と気分で選べます。'
      },
      {
        q: '電子版での価格や特典の違いはありますか？',
        a: '『彼女と死ぬまでに殺りたいこと』（KADOKAWA）は990円、『あくまでてんしです』（小学館）は891円でカラー・モノクロ挿絵と「ガ報」付き、『美味いだろ？』（アルファポリス）は単行本版価格の1,540円となっています。'
      }
    ],
    items: [
      {
        rank: 1,
        keyword: '彼女と死ぬまでに殺りたいこと',
        customTitle: articles[0].title,
        title: articles[0].title,
        author: articles[0].author,
        synopsis: '予定のない夏休みを憂鬱に過ごしていた高校生・碓永と、余命わずかと宣告された少女・灰野。「死ぬ前に殺したい奴がいるの」という彼女の一言から、二人は夏休みをかけた殺人計画へ踏み出していく。',
        recommendReason: '綺麗な思い出づくりに逃げない余命モノの危うさと、退屈を抱えた少年の距離感がじわっと効くKADOKAWA最新作です。',
        points: articles[0].highlights,
        itemUrl: articles[0].affiliateUrl,
        affiliateUrl: articles[0].affiliateUrl,
        cover: articles[0].cover,
        salesDate: articles[0].salesDate,
        price: articles[0].price
      },
      {
        rank: 2,
        keyword: 'あくまでてんしです',
        customTitle: articles[1].title,
        title: articles[1].title,
        author: articles[1].author,
        synopsis: '双子姉妹の真島日葵と椿は、最愛の義兄・威吹に近づく5人の正体不明ヒロイン（聖人・魔王・かぐや・歌姫・共犯者）の正体を突き止めるため情花学園へ入学。応援派の姉と阻止派の妹がそれぞれの思惑で動き出す。',
        recommendReason: '主人公の義兄がほぼ画面に出てこない変化球構造と、第20回小学館ライトノベル大賞優秀賞らしいテンポの良さが光ります。',
        points: articles[1].highlights,
        itemUrl: articles[1].affiliateUrl,
        affiliateUrl: articles[1].affiliateUrl,
        cover: articles[1].cover,
        salesDate: articles[1].salesDate,
        price: articles[1].price
      },
      {
        rank: 3,
        keyword: '美味いだろ？',
        customTitle: articles[2].title,
        title: articles[2].title,
        author: articles[2].author,
        synopsis: 'レベルの低さを理由に最強クラン『ドラゴンブレス』をクビになった料理人カイン。故郷で食堂を開くつもりの旅先で猫人族の少女チュールを助け、山賊や悪代官、さらには十万の帝国軍まで隠していたSランク相当の実力で片付けていく。',
        recommendReason: '復讐にギスギスせず、美味しい料理と相棒の猫人族少女を連れてマイペースに世直ししていく読みやすさがあります。',
        points: articles[2].highlights,
        itemUrl: articles[2].affiliateUrl,
        affiliateUrl: articles[2].affiliateUrl,
        cover: articles[2].cover,
        salesDate: articles[2].salesDate,
        price: articles[2].price
      }
    ]
  };

  const booksPath = path.join(root, 'public/data/books.json');
  const featuresPath = path.join(root, 'public/data/curated-features.json');

  let books = JSON.parse(await fs.readFile(booksPath, 'utf8'));
  let features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  const tagDirEntries = await fs.readdir(path.join(root, 'public/tags'));
  const existingTagDirs = new Set(tagDirEntries);

  // 1. books.json への追加（先頭に配置）
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
    if (idx >= 0) books.splice(idx, 1);
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

  const nov22Idx = features.findIndex(f => f.slug === '2026-nov-22-three-new-voices');
  if (nov22Idx >= 0) {
    features.splice(nov22Idx, 0, newFeature);
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

  // 4. /features/index.html の適切な位置に配置 (2026-nov-22-three-new-voices の直前)
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
    const targetMarker = '<a href="/features/2026-nov-22-three-new-voices/">';
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
    const workAnchor = '<li><a href="/works/8890090038865/">';
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
      const workLiCount = (sitemapHtml.match(/<li><a href="\/works\/[^"]+\/">/g) || []).length;
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
  const todayStr = '2026-11-23';
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
