import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function loadEnv() {
  try {
    const envPath = path.join(root, '.env')
    const content = await fs.readFile(envPath, 'utf8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=')
        const val = vals.join('=').trim()
        if (key.trim() && val) process.env[key.trim()] = val
      }
    }
  } catch (e) {}
}
await loadEnv()

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
const buildAffiliateUrl = (itemUrl, affiliateId) => `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(itemUrl)}&m=${encodeURIComponent(itemUrl)}`

async function fetchRakutenBookDirect(keyword) {
  await sleep(1050)
  // 1. Kobo EbookSearch
  try {
    const params = new URLSearchParams({
      applicationId: process.env.RAKUTEN_APPLICATION_ID,
      accessKey: process.env.RAKUTEN_ACCESS_KEY,
      affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
      format: 'json',
      formatVersion: '2',
      keyword: keyword,
      hits: '10',
      sort: 'standard'
    })
    const res = await fetch(`https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`)
    if (res.ok) {
      const json = await res.json()
      const items = json.Items || json.items || []
      if (items.length > 0) {
        const nonSplit = items.filter(i => !i.title.includes('【分冊版】') && !i.title.includes('分冊版'))
        return nonSplit.length > 0 ? nonSplit[0] : items[0]
      }
    }
  } catch (e) {
    console.error('Kobo API Error:', e.message)
  }

  // 2. BooksTotal Search フォールバック
  try {
    const totalParams = new URLSearchParams({
      applicationId: process.env.RAKUTEN_APPLICATION_ID,
      accessKey: process.env.RAKUTEN_ACCESS_KEY,
      affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
      format: 'json',
      formatVersion: '2',
      keyword: keyword,
      hits: '5'
    })
    const tRes = await fetch(`https://openapi.rakuten.co.jp/services/api/BooksTotal/Search/20170404?${totalParams}`)
    if (tRes.ok) {
      const tJson = await tRes.json()
      const tItems = tJson.Items || tJson.items || []
      if (tItems.length > 0) return tItems[0]
    }
  } catch (e) {
    console.error('BooksTotal API Error:', e.message)
  }

  // 3. BooksBook Search フォールバック
  try {
    const bookParams = new URLSearchParams({
      applicationId: process.env.RAKUTEN_APPLICATION_ID,
      accessKey: process.env.RAKUTEN_ACCESS_KEY,
      affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
      format: 'json',
      formatVersion: '2',
      title: keyword,
      hits: '5'
    })
    const bRes = await fetch(`https://openapi.rakuten.co.jp/services/api/BooksBook/Search/20170404?${bookParams}`)
    if (bRes.ok) {
      const bJson = await bRes.json()
      const bItems = bJson.Items || bJson.items || []
      if (bItems.length > 0) return bItems[0]
    }
  } catch (e) {
    console.error('BooksBook API Error:', e.message)
  }

  return null
}

export const batchFeaturesPart4 = [
  {
    slug: 'isekai-dark-hero-villain-protagonist-10',
    title: 'ダークヒーロー・冷徹な悪役主人公おすすめ異世界ラノベ10選【容赦なき制裁・冷酷無比・ピカレスクの極致】',
    metaTitle: 'ダークヒーロー・冷徹主人公おすすめ異世界ラノベ10選！悪党に容赦ない制裁＆ピカレスクまとめ',
    description: '偽善や綺麗事は一切不要！悪党には死以上の絶望を、裏切り者には完璧な破滅を。冷徹な知略と圧倒的な力で世界の悪を蹂躙する「ダークヒーロー・悪役主人公系」おすすめ異世界ラノベ10選を徹底解説します。',
    eyecatchBadge: 'ダークヒーロー・冷徹無比・制裁',
    faq: [
      {
        q: 'ダークヒーロー・悪役主人公モノの最大の魅力は何ですか？',
        a: '「甘さや情けを一切かけず、悪党を徹底的に断罪する容赦のなさ」にあります。綺麗事を語る偽善者を論理と圧倒的な力で叩き伏せ、自らの信念や大切な仲間のためなら世界中を敵に回すことも厭わない孤高のカリスマ性に痺れます。'
      },
      {
        q: 'ダークヒーロー系のおすすめ代表作は？',
        a: '絶対悪の魔王として君臨する『オーバーロード』や、奈落から這い上がった覇者『ありふれた職業で世界最強』、徹底的な復讐を執行する『回復術士のやり直し』が3大巨頭です。'
      }
    ],
    items: [
      {
        keyword: 'オーバーロード',
        customTitle: 'オーバーロード',
        synopsis: 'ナザリック地下大墳墓の主アインズ・ウール・ゴウン。慈悲なき魔王として、敵対する勢力や愚かな侵入者を容赦なく罠にハメて全滅させる。世界の理を冷徹に見定め、ナザリックの繁栄のためなら国家の解体や数万の軍勢の殲滅すらも平然と実行する。',
        recommendReason: '「正義の味方」ではなく「圧倒的な絶対悪」の視点から描かれるダークファンタジーの最高峰！冷徹な知略と圧倒的武力の前に誰も抗えません。',
        points: [
          '一切の甘さを排除した魔王アインズによる冷酷無比な国家侵略と情報戦',
          'ナザリックの守護者たちからの絶対の忠誠と圧倒的な戦闘力',
          '敵対者が絶望の中で自らの無力さを悟る瞬間を描く重厚なストーリー'
        ]
      },
      {
        keyword: 'ありふれた職業で世界最強',
        customTitle: 'ありふれた職業で世界最強',
        synopsis: 'クラスメイトの裏切りで奈落へ落とされた南雲ハジメ。生き残るため魔物を喰らい、人間性を削ぎ落として冷徹な暗殺者へと覚醒。邪魔する者は同級生であろうと神であろうと、自作の近代銃火器で躊躇なく射殺する。',
        recommendReason: '「敵対するなら誰であれ殺す」という徹底した合理主義と、愛するユエたち仲間への深い愛情のギャップが最高にカッコいいダークヒーローです！',
        points: [
          '甘い綺麗事を捨て去り自らの意志で世界に立ち向かうハジメの覚醒劇',
          '大型リボルバーや電磁レールガンで敵を容赦なく撃ち抜く圧倒的火力',
          '裏切った者たちに下される完璧で清々しい因果応報とざまぁ'
        ]
      },
      {
        keyword: '回復術士のやり直し',
        customTitle: '回復術士のやり直し〜即死魔法とスキルコピーの万能回復〜',
        synopsis: '勇者たちに薬漬けにされ搾取された【癒】の勇者ケヤル。回復魔法で過去へタイムリープし、前世で自分を虐げた勇者や王族たちへ完璧な復讐を執行。相手の能力を奪い、記憶を改変し、自業自得の地獄へと叩き落とす。',
        recommendReason: '一切の妥協も許しも排除した究極のダークリベンジ！悪人たちに自らの罪を思い知らせる冷徹な復讐計画が刺激的です。',
        points: [
          '奪われた尊厳を取り戻すため緻密に罠を仕掛けるケヤルの冷徹な頭脳戦',
          '治癒魔法を拡張し即死や記憶改変まで操る規格外のチート能力',
          '傲慢な勇者たちが自らの罪に絶望しながら破滅していく圧倒的カタルシス'
        ]
      },
      {
        keyword: '陰の実力者になりたくて！',
        customTitle: '陰の実力者になりたくて！',
        synopsis: '「陰の実力者」シド・カゲノー。自作の厨二病設定に沿って夜の街で悪党を狩り尽くす。自らを害しようとするテロリストや偽善者を、圧倒的な漆黒の魔力と「アイ・アム・アトミック」で塵一つ残さず消滅させる。',
        recommendReason: '悪党相手には一切の手加減をせず、スタイリッシュかつ圧倒的な火力で粉砕するシドのカッコよさと爆笑ギャグの融合が最高です！',
        points: [
          '悪党を核爆発レベルの魔力で一撃粉砕する圧倒的なスタイリッシュ無双',
          'モブを完璧に演じ分ける日常と、夜の絶対強者シャドウのギャップ',
          '配下の美少女集団シャドウガーデンが放つ絶対の忠誠と冷徹な制裁'
        ]
      },
      {
        keyword: '幼女戦記',
        customTitle: '幼女戦記',
        synopsis: 'エリートサラリーマンの合理主義を貫くターニャ・デグレチャフ。国際法を逆手に取り、敵都市の工場地帯に避難勧告を出した上で合法的に爆撃して灰燼に帰す。感情論を排した冷徹な用兵で「ラインの悪魔」と恐れられる。',
        recommendReason: '国際法や軍事規則を完全に熟知した上で、法的に完璧な形で敵を殲滅するターニャの冷徹な知性が鳥肌モノの面白さを誇ります。',
        points: [
          '国際法を合法的盾として活用し敵拠点を完全粉砕する冷徹な軍略',
          '安全な後方を望みながら最前線で英雄として祭り上げられる皮肉な運命',
          '近代ミリタリー教義と航空魔導戦闘が融合した圧倒的な迫力'
        ]
      },
      {
        keyword: '最強陰陽師の異世界転生記',
        customTitle: '最強陰陽師の異世界転生記 〜下僕の妖怪どもに比べてモンスターが弱すぎるんだが〜',
        synopsis: '前世で仲間に裏切られ暗殺された陰陽師・玖峨晴玄。「今世は狡猾に立ち回る」と誓い、自分や仲間を脅かす敵対貴族や暗殺者を、呪殺・式神使役で誰にも悟られず裏から抹殺していく。',
        recommendReason: '表向きは無能な三男を装いながら、裏では一切の証拠を残さず敵を呪殺・消滅させるセイカの冷徹なプロフェッショナルぶりが魅力です。',
        points: [
          '西洋魔法の届かない日本の呪術と式神で敵を完全隠密処理する知略',
          '狡猾に生きようとしながらも仲間を守るためには容赦しない男気',
          '従魔の妖狐ユキをはじめとする百鬼夜行の強力な式神たちの活躍'
        ]
      },
      {
        keyword: '乙女ゲー世界はモブに厳しい世界です',
        customTitle: '乙女ゲー世界はモブに厳しい世界です',
        synopsis: 'モブ男爵リオン。自分や大切な人を陥れようとする傲慢な貴族や王子たちを、徹底的な煽りスキルと超兵器ルクシオンの武力で完膚なきまでに精神崩壊・破滅へ追い込む。',
        recommendReason: '主人公リオンの一切遠慮のないゲス顔煽りと、ムカつく敵を骨の髄まで叩き潰すド外道カタルシスが最高に爽快です！',
        points: [
          '腐敗した貴族社会を圧倒的な超兵器でぶち壊す痛快な成り上がり',
          '敵を徹底的に煽り倒して再起不能にするリオンの容赦ない制裁',
          '悪態をつきながらも虐げられたヒロインたちを救う隠れた優しさ'
        ]
      },
      {
        keyword: '盾の勇者の成り上がり',
        customTitle: '盾の勇者の成り上がり',
        synopsis: '冤罪で名誉を奪われた岩谷尚文。人間不信から冷徹な現実主義者となり、自分を陥れた王女や教団に対し、冷徹な知略と呪いの盾（憤怒の盾）で徹底的な社会的・軍事的制裁を下していく。',
        recommendReason: '冤罪のどん底から這い上がり、真の実力で世界を救いつつ、裏切り者たちを裁判で完璧に断罪する「ざまぁ」の爽快感が格別です。',
        points: [
          '攻撃不能の盾使いが呪いの盾とカウンターで理不尽を叩き潰す熱血バトル',
          '亜人奴隷ラフタリアとの深い信頼と家族のような温かい絆',
          '尚文を陥れた悪徳王女たちに下される完璧な法の裁きと制裁'
        ]
      },
      {
        keyword: '魔王学院の不適合者',
        customTitle: '魔王学院の不適合者 〜史上最強の魔王の始祖、転生して子孫たちの学校へ通う〜',
        synopsis: '暴虐の魔王アノス。心優しい両親や仲間を愛する一方で、敵対する神々や悪意ある者には「殺したくらいで俺が死ぬとでも思ったか？」と圧倒的な力で無限の恐怖を叩き込む。',
        recommendReason: '愛する者への無償の優しさと、悪に対する次元の違う圧倒的制裁のギャップが最高にカッコいい真の覇者です！',
        points: [
          '神々の理すらも一撃でねじ伏せる規格外の絶対的強さと名言の数々',
          '理不尽な差別に苦しむ仲間を包容し真の王として導く圧倒的器量',
          '敵対者を絶望させるアノス様の神話級無双と爽快なストーリー'
        ]
      },
      {
        keyword: '即死チートが最強すぎて',
        customTitle: '即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。',
        synopsis: '高遠夜霧の持つ絶対即死能力。害意を向けた対象は神であろうと不死身であろうと0.1秒で即死。自らの平穏を脅かす悪党を、何のためらいもなく淡々と即死させていく。',
        recommendReason: '「どんなチート防御も死ぬんだから無意味」という究極のシンプルさと、悪党が一瞬で自滅していくストレスフリーな爽快感が抜群です！',
        points: [
          '敵意を向けた瞬間に相手が絶命する世界の法則を超越した絶対即死',
          'どんな強大な神やバリアも一撃で無力化する究極の安心感',
          '自業自得で自滅していく傲慢な悪党たちの爽快な退場劇'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: 'オーバーロード',
        reason: '冷徹な絶対悪としての魔王アインズの圧倒的カリスマと軍勢統率劇。ダークファンタジーの頂点に立つ名作です。'
      },
      {
        rank: 2,
        title: 'ありふれた職業で世界最強',
        reason: '甘い綺麗事を捨て去り、自作近代兵器で敵を殲滅するダークヒーローのカッコよさが最高峰。疾走感あふれるバトルは必読です。'
      },
      {
        rank: 3,
        title: '回復術士のやり直し〜即死魔法とスキルコピーの万能回復〜',
        reason: '一切の妥協を排した冷徹な復讐計画とざまぁの爽快感が抜群。ピカレスクリベンジの極致を味わえます。'
      }
    ]
  },
  {
    slug: 'isekai-slowlife-mofumofu-tamer-10',
    title: 'もふもふ従魔・聖獣テイマーおすすめ異世界ラノベ10選【神獣契約・極上の癒やし・まったり冒険】',
    metaTitle: 'もふもふ従魔・聖獣テイマーおすすめ異世界ラノベ10選！極上の癒やし＆ほのぼのスローライフまとめ',
    description: '巨大フェンリル、無邪気なスライム、伝説の霊鳥、可愛い仔竜！もふもふの毛並みに顔を埋め、美味しいご飯を一緒に食べて世界中をのんびり旅する。読むだけでストレスが完全に消え去る「もふもふ従魔・テイマースローライフ系」おすすめ異世界ラノベ10選を徹底解説します。',
    eyecatchBadge: 'もふもふ従魔・聖獣テイマー・癒やし',
    faq: [
      {
        q: 'もふもふテイマー系ラノベの魅力は何ですか？',
        a: '神話級の強さを持つ伝説の聖獣たちが、主人公にだけ甘えたり、美味しいご飯をおねだりして尻尾を振る「究極の愛らしさとギャップ萌え」にあります。戦闘は従魔たちが一瞬で片付けてくれるため、読者も一切のストレスなく癒やしに浸れます。'
      },
      {
        q: 'もふもふ好きに絶対おすすめの代表作は？',
        a: 'フェンリルとスライムが大活躍する『とんでもスキルで異世界放浪メシ』や、多種多様なスライムと暮らす『神達に拾われた男』、最強種の猫耳少女と契約する『勇者パーティーを追放されたビーストテイマー』が鉄板です。'
      }
    ],
    items: [
      {
        keyword: 'とんでもスキルで異世界放浪メシ',
        customTitle: 'とんでもスキルで異世界放浪メシ',
        synopsis: 'ネットスーパーのスキルを持つムコーダ。日本の調味料で作った絶品料理の匂いに釣られ、伝説の魔獣フェンリル（フェル）や生まれたてのスライム（スイ）、ドラゴンのドラちゃんが従魔に加入！もふもふのフェルをもふりながら、世界中を巡る至福のグルメ旅。',
        recommendReason: 'もふもふ従魔ラノベの最高峰！フェルが「主、飯だ！」と催促したり、スイが「あるじー、おいしいー！」と跳ね回る姿に全読者が悶絶します。',
        points: [
          'もふもふ巨大フェンリルと愛嬌抜群のスライムスイの尊すぎる家族の絆',
          '日本の調味料で焼くジューシーな肉料理に舌鼓を打つ極上の飯テロ',
          '戦闘は従魔たちが瞬殺してくれるため完全ストレスフリーな安心感'
        ]
      },
      {
        keyword: '神達に拾われた男',
        customTitle: '神達に拾われた男',
        synopsis: '森の中で一人スライムたちの研究とテイムに没頭する少年竜馬。クリーナースライム、スカベンジャースライム、メタルスライムなど多彩なスライムたちと心を通わせ、彼らの特性を活かして街の住人を助けながら幸せな暮らしを築いていく。',
        recommendReason: 'ぷるぷるしたスライムたちを大切に慈しみ、家族のように育てていく竜馬の優しさに心が洗われます。悪人のいない優しい世界観も魅力です。',
        points: [
          '多彩な進化を遂げるスライムたちの特性を活かした町おこし＆工房経営',
          '前世の苦労人が報われ周囲から愛され大切にされていく温かい人間ドラマ',
          'ストレスフリーで読める善人だらけの穏やかで平和な世界観'
        ]
      },
      {
        keyword: '勇者パーティーを追放されたビーストテイマー',
        customTitle: '勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う',
        synopsis: '追放されたビーストテイマーのレイン。森で倒れていた最強種「猫霊族」の美少女カナデを助けて契約。さらに竜族や精霊族の少女たちと仲間になり、彼女たちの能力を共有して無敵のパーティを結成していく。',
        recommendReason: '猫耳美少女カナデの素直で甘えん坊な可愛さと、レインを信頼しきった仲間たちとの絆が最高に微笑ましい王道ファンタジーです！',
        points: [
          '猫霊族カナデをはじめとする最強種の美少女たちとの心温まる絆と契約',
          'レインを追放した元勇者パーティが自業自得で没落していく痛快ざまぁ',
          '仲間たち全員で困難を乗り越え新天地で活躍する熱い冒険劇'
        ]
      },
      {
        keyword: '異世界のんびり農家',
        customTitle: '異世界のんびり農家',
        synopsis: '万能農具で大樹の村を開拓したヒラク。森で保護したインフェルノウルフのクロとユキ、その子供たち（無数の狼たち）や巨大蜘蛛ザブトンたちと家族になり、畑を守りながら平和な農作業スローライフを満喫する。',
        recommendReason: '忠実で賢いインフェルノウルフたちや、服を織ってくれる頼もしいザブトンたちとの温かい共生関係に心底癒やされます！',
        points: [
          '忠誠心抜群のインフェルノウルフ軍団と賢い巨大蜘蛛ザブトンの愛らしさ',
          '万能農具で森を拓き村から自治都市へと発展していく開拓の快感',
          '収穫した新鮮野菜や自家製ワインをみんなで楽しむ大宴会の幸福感'
        ]
      },
      {
        keyword: '骸骨騎士様、只今異世界へお出掛け中',
        customTitle: '骸骨騎士様、只今異世界へお出掛け中',
        synopsis: '骸骨騎士アークの相棒である精霊獣ポンタ（緑の狐のような可愛い小動物）。アークの兜の上に乗って「きゅ〜！」と鳴くポンタの可愛さと、アークの圧倒的な神聖魔法無双のギャップが楽しい世直し冒険譚。',
        recommendReason: 'ポンタのもふもふな愛らしさが旅の最高の癒やし！悪党を豪快に成敗する爽快感と相まってストレスなく楽しめます。',
        points: [
          '兜の上に乗ってもふもふ揺れる精霊獣ポンタの反則級の可愛さ',
          '悪徳領主や盗賊を一撃で粉砕する爽快な勧善懲悪バトルと神聖魔法無双',
          'エルフの戦士アリアンと共に各地の悪を成敗する水戸黄門的楽しさ'
        ]
      },
      {
        keyword: 'チート薬師のスローライフ',
        customTitle: 'チート薬師のスローライフ〜異世界に作ろうドラッグストア〜',
        synopsis: '創薬スキルを持つレイジ。ポーションで助けたもふもふ人狼の美少女ノエラが看板娘として懐き、薬局でお客さんをお出迎え。ノエラの大好物のおやつを作ってあげながら、田舎町でのんびり薬屋を営む。',
        recommendReason: '「あるじー、おなかすいたー！」と尻尾を振って甘えてくるノエラの愛らしさに癒やされっぱなしのハートフル日常コメディです！',
        points: [
          '人狼少女ノエラをはじめとする個性豊かで可愛いヒロインたちとの日常',
          '目薬やエナジードリンクなど身近な医薬品で街の住人を助ける温かい発想',
          '戦闘のプレッシャーが一切ない、平和で優しい町医者風ドラッグストア'
        ]
      },
      {
        keyword: '鍛冶屋ではじめる異世界スローライフ',
        customTitle: '鍛冶屋ではじめる異世界スローライフ',
        synopsis: '森の工房で鍛冶屋を営む中年エイゾウ。森で瀕死だった人狼の少女サーミャを助け、工房で一緒に暮らし始める。サーミャの鋭い嗅覚と狩猟能力に助けられながら、家族のように食卓を囲む穏やかな日々。',
        recommendReason: '人狼サーミャの素直で健気な仕草と、エイゾウを父親のように慕う温かい関係性に胸がじんわり温かくなります。',
        points: [
          '森の工房に集まるサーミャたちと築く、温かく平和な家族スローライフ',
          '鉄と炎に向き合い、使う人の幸せを願って真摯に道具を打つ職人魂',
          '森の恵みを料理して分け合う、素朴で贅沢な食事シーンの幸福感'
        ]
      },
      {
        keyword: 'デスマーチからはじまる異世界狂想曲',
        customTitle: 'デスマーチからはじまる異世界狂想曲',
        synopsis: 'サトゥーが保護した犬耳族のポチと猫耳族のタマ。元気いっぱいに「〜なのです！」「〜にゃ！」と駆け回り、サトゥーの美味しい手料理を頬張る。サトゥーの保護者目線の優しい眼差しが描かれる。',
        recommendReason: 'ポチとタマの無邪気な愛らしさは全ラノベ屈指！二人が美味しそうにご飯を食べて喜ぶ姿を見るだけで心が洗われます。',
        points: [
          '犬耳ポチ＆猫耳タマの無邪気で愛嬌たっぷりなリアクションと元気さ',
          '保護者として少女たちを温かく育て見守るサトゥーの大人の包容力',
          '美味しいご当地料理やスイーツをみんなで食べ歩く至福の観光旅'
        ]
      },
      {
        keyword: '転生したらドラゴンの卵だった',
        customTitle: '転生したらドラゴンの卵だった〜最強以外目指さねぇ〜',
        synopsis: 'ドラゴンの卵から孵化した主人公。相棒の黒蜥蜴や仲間たちと共に過酷な森でサバイバルを繰り広げ、進化を重ねて立派なドラゴンへと成長していく。魔物同士の心温まる友情と絆を描く。',
        recommendReason: 'モンスター同士の不器用で温かい友情と、相棒を守るために死線を越えて進化していく熱い絆にグッと引き込まれます！',
        points: [
          '卵から孵化し相棒と共に死線を越えて進化していく育成の醍醐味',
          '孤独な魔物生活の中で芽生える相棒との絆と心温まるドラマ',
          'スキルとステータスを駆使して格上の魔物を討ち倒す白熱のモンスターバトル'
        ]
      },
      {
        keyword: '魔王になったので、ダンジョン造って人外娘とほのぼのする',
        customTitle: '魔王になったので、ダンジョン造って人外娘とほのぼのする',
        synopsis: '魔王ユキが住む迷宮に居着いた最強の覇竜レフィ（銀髪美少女）やフェンリルの眷族たち。美味しいご飯やスイーツを囲み、家族として甘々で温かいスローライフを満喫する。',
        recommendReason: 'ドラゴン娘や眷族たちを思いっきり甘やかし、美味しいご飯を一緒に食べる多幸感あふれる日常が癖になります！',
        points: [
          '銀髪覇竜レフィをはじめとする人外美少女たちとの甘々で温かい共同生活',
          '迷宮創造スキルで快適な居住空間や温泉を作り上げるクラフト感',
          '侵略者を容赦のないハイテクトラップと魔王の圧倒的武力で迎撃する爽快感'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: 'とんでもスキルで異世界放浪メシ',
        reason: 'フェルやスイといった愛嬌抜群の従魔たちとの掛け合いと圧倒的飯テロ力が唯一無二。読むだけで心が癒やされる最高峰の従魔ラノベです。'
      },
      {
        rank: 2,
        title: '神達に拾われた男',
        reason: '多種多様なスライムたちを大切に慈しみ、街の人々と幸せを築く温かい人間ドラマ。ストレスゼロの癒やしを味わえます。'
      },
      {
        rank: 3,
        title: '勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う',
        reason: '猫耳少女カナデをはじめとする最強種ヒロインたちの愛らしさと、追放からの痛快な下剋上サクセスが完璧なバランスです。'
      }
    ]
  }
]

async function enrichAndSave() {
  const featuresPath = path.join(root, 'public/data/curated-features.json')
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'))

  for (const feature of batchFeaturesPart4) {
    console.log(`\n=== Fetching Rakuten data for feature: [${feature.slug}] ${feature.title} ===`)
    const resolvedItems = []

    for (const item of feature.items) {
      console.log(`Searching Rakuten API for keyword: "${item.keyword}"...`)
      const bookData = await fetchRakutenBookDirect(item.keyword)

      if (bookData) {
        console.log(`  -> Found: ${bookData.title} (${bookData.author || '不明'})`)
        const itemUrl = bookData.itemUrl || bookData.affiliateUrl || ''
        const affUrl = process.env.RAKUTEN_AFFILIATE_ID
          ? buildAffiliateUrl(itemUrl, process.env.RAKUTEN_AFFILIATE_ID)
          : (bookData.affiliateUrl || itemUrl)

        resolvedItems.push({
          ...item,
          rakutenTitle: bookData.title,
          cover: bookData.largeImageUrl || bookData.mediumImageUrl || bookData.smallImageUrl || '',
          itemUrl: itemUrl,
          affiliateUrl: affUrl,
          author: bookData.author || bookData.artistName || '著者情報なし',
          price: bookData.itemPrice || 0,
          salesDate: bookData.salesDate || ''
        })
      } else {
        console.log(`  -> Not found on Rakuten API, using fallback search keyword`)
        resolvedItems.push({
          ...item,
          rakutenTitle: item.customTitle || item.keyword,
          cover: '',
          itemUrl: `https://books.rakuten.co.jp/search?sitem=${encodeURIComponent(item.keyword)}`,
          affiliateUrl: `https://books.rakuten.co.jp/search?sitem=${encodeURIComponent(item.keyword)}`,
          author: '人気作家',
          price: 0,
          salesDate: ''
        })
      }
    }

    const completeFeature = {
      ...feature,
      resolvedItems: resolvedItems
    }

    const idx = features.findIndex(f => f.slug === feature.slug)
    if (idx >= 0) {
      features[idx] = completeFeature
    } else {
      features.push(completeFeature)
    }
  }

  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2))
  console.log(`\nBatch features part 4 successfully fetched and updated! Total features: ${features.length}`)
}

await enrichAndSave()
