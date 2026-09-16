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

export const batchFeaturesPart2 = [
  {
    slug: 'isekai-necromancer-undead-army-10',
    title: '死霊術士・ネクロマンサーおすすめ異世界ラノベ10選【不死者軍団・魂使役・漆黒の支配者】',
    metaTitle: 'ネクロマンサー・死霊術士おすすめ異世界ラノベ10選！アンデッド軍団＆漆黒の無双まとめ',
    description: '倒した強敵を配下のアンデッドとして蘇らせ、無敵の漆黒軍団を結成！骸骨兵、死霊騎士、ドラゴンの亡霊を統率し、単騎で一国の軍隊を蹂躙する「死霊術士・ネクロマンサー系」おすすめ異世界ラノベ10選を徹底解説します。',
    eyecatchBadge: 'ネクロマンサー・死霊術・不死者軍団',
    faq: [
      {
        q: 'ネクロマンサー・死霊術モノの面白さはどこですか？',
        a: '「倒せば倒すほど味方が増えていく」という圧倒的な増殖力と育成シミュレーションの快感にあります。恐怖の対象であるアンデッドを意のままに操り、傲慢な勇者や敵軍を絶望的な数と統率力で圧殺するピカレスク的カタルシスが最高です。'
      },
      {
        q: '死霊術士・ダークファンタジーの代表作は？',
        a: 'アンデッド魔王の頂点に君臨する『オーバーロード』や、倒した敵を影の兵士にする『俺だけレベルアップな件』、骸骨から進化する『望まぬ不死の冒険者』が必読の傑作です。'
      }
    ],
    items: [
      {
        keyword: 'オーバーロード',
        customTitle: 'オーバーロード',
        synopsis: 'VRMMOの片隅で骸骨の大魔法使いモモンガとして異世界へ転移した主人公。死霊術の最高位魔法を操り、死体からデス・ナイトやエルダー・リッチを無限に召喚。ナザリック地下大墳墓の主アインズ・ウール・ゴウンとして、世界を恐怖と圧倒的な知略で支配していく。',
        recommendReason: 'アンデッドの魔王視点で描かれるダークファンタジーの最高峰！死霊術の圧倒的な軍事力と、NPCたちからの絶対の忠誠が織りなす支配劇に圧倒されます。',
        points: [
          'デス・ナイト軍団を率いて国家を蹂躙する、ダークファンタジーの頂点に立つ魔王の威厳',
          'NPCたちの過剰な忠誠心と、内心焦りまくるアインズのユーモラスな勘違い劇',
          '国家の興亡や群像劇が緻密に練り上げられた圧倒的な世界観のリアリズム'
        ]
      },
      {
        keyword: '俺だけレベルアップな件',
        customTitle: '俺だけレベルアップな件',
        synopsis: '最弱ハンター水篠旬が手に入れた唯一無二の能力【影の抽出】。倒した魔獣や敵ハンターの魂を漆黒の「影の兵士」として従え、イグリートやタンクをはじめとする最強の影の軍団を結成。単騎でダンジョンを制圧する君主へと成り上がる。',
        recommendReason: '「起きろ（アライズ）」の合図で倒したボスが忠実な影の騎士へと変貌する瞬間の鳥肌とカッコよさが最高！影の兵士たちのコミカルな忠誠心も魅力です。',
        points: [
          '「起きろ」の一言で敵を配下に加える【影の抽出】スキルの圧倒的カッコよさ',
          'E級の最弱ハンターから影の君主へと駆け上がる完璧な成り上がりサクセス',
          '全世界を揺るがすゲートの危機に影の大軍団を率いて立ち向かう熱血バトル'
        ]
      },
      {
        keyword: '望まぬ不死の冒険者',
        customTitle: '望まぬ不死の冒険者',
        synopsis: '底辺冒険者のレントは迷宮の未踏地で巨大な竜に喰われ、気がつくと最弱のアンデッド「骨人（スケルトン）」になっていた。魔物を倒して魔力を吸収する「存在進化」を繰り返し、屍食鬼（グール）、屍鬼（ゾンビ）を経て、生前の人間以上の力を手に入れながら迷宮の深淵を目指す。',
        recommendReason: 'アンデッドとしての苦悩や肉体の変化を緻密に描きつつ、地道な経験と工夫で上位アンデッドへと進化していく本格ダークサバイバルファンタジーです。',
        points: [
          'スケルトンからグール、ヴァンパイアへと存在進化を駆け上がる育成の醍醐味',
          '人間社会に戻るため仮面をつけ、卓越した知識で仲間を助けるレントの優しさ',
          '迷宮の謎と古代魔導の神秘を解き明かしていく重厚な世界設定'
        ]
      },
      {
        keyword: '骸骨騎士様、只今異世界へお出掛け中',
        customTitle: '骸骨騎士様、只今異世界へお出掛け中',
        synopsis: '自キャラの「全身鎧の骸骨騎士アーク」として異世界へ転移した主人公。見た目は恐ろしいアンデッドなのに、中身は陽気でお人好しなゲーマー。悪党を圧倒的な神聖魔法と剣技で粉砕し、エルフの美少女と共に世直しの旅を続ける。',
        recommendReason: 'ガイコツの凶悪なビジュアルとお茶目な正義感のギャップが爽快！悪党を一切の手加減なく成敗してくれる王道の勧善懲悪ストーリーです。',
        points: [
          '見た目は恐ろしい骸骨騎士、中身はお茶目で善良なお人好しという愛すべき主人公',
          '悪徳領主や奴隷商人を圧倒的な力で成敗していく痛快な水戸黄門的世直し活劇',
          'もふもふの可愛い精霊獣ポンタやエルフの戦士アリアンとの温かい旅路'
        ]
      },
      {
        keyword: '最果てのパラディン',
        customTitle: '最果てのパラディン',
        synopsis: '死者の街で三人のアンデッド（骸骨剣士ブラッド、ミイラ神官マリー、幽霊魔法使いガス）に育てられた少年ウィル。彼らから武術、信仰、魔法を学び、愛を受けて育ったウィルは、灯火の神グレイスフィールの聖騎士として、邪悪な悪魔に立ち向かう。',
        recommendReason: 'アンデッドの親たちから注がれる無償の愛と、少年が高潔な聖騎士として成長していく感動の王道ファンタジー。涙なしには読めない名作です。',
        points: [
          '死者の街で三人の不死者に温かく育てられるウィルの心温まる幼少期',
          '灯火の神の加護を受け、高潔な信念で悪を討つ本格ハイファンタジーの筆致',
          '死生観や信仰の重みを丁寧に描き出す、文学的で重厚なストーリー'
        ]
      },
      {
        keyword: '陰の実力者になりたくて！',
        customTitle: '陰の実力者になりたくて！',
        synopsis: '「陰の実力者」シド・カゲノー。自作の厨二病設定をもとに配下を従え、漆黒の魔力で闇の教団を蹂躙。アンデッドや古代の吸血鬼すらも圧倒的な実力差で赤子のように手玉に取り、スタイリッシュに事件を解決していく。',
        recommendReason: '厨二病ごっこと世界の闇が奇跡の完全一致を果たす大爆笑コメディ！夜の支配者シャドウとしての圧倒的な強さとカッコよさに痺れます。',
        points: [
          'シドの適当なハッタリが全て世界の真実と的中してしまう神がかったプロット',
          'モブを演じる日常と、夜の絶対強者シャドウとしてのスタイリッシュな無双',
          '配下の美少女集団シャドウガーデンが放つ圧倒的な統率力と戦闘力'
        ]
      },
      {
        keyword: '最強陰陽師の異世界転生記',
        customTitle: '最強陰陽師の異世界転生記 〜下僕の妖怪どもに比べてモンスターが弱すぎるんだが〜',
        synopsis: '歴代最強の陰陽師・玖峨晴玄が異世界へ転生。魔力ゼロと蔑まれるが、前世から使役する百鬼夜行の強力な式神（妖怪・悪霊）たちを召喚し、異世界の魔法使いや凶悪魔獣を神秘の呪術で完封していく。',
        recommendReason: '霊魂や妖怪を使役する日本の陰陽道が、西洋ファンタジーの魔法体系を完全に凌駕するスマートなバトルが最高にカッコいいです！',
        points: [
          '西洋魔法の常識が通用しない、陰陽術と式神による圧倒的でミステリアスな無双',
          '目立たず平穏に生きようと画策するセイカの冷静沈着な頭脳戦と裏工作',
          '従魔の妖狐ユキをはじめとする個性豊かで強力な妖怪たちの活躍'
        ]
      },
      {
        keyword: '悠久の愚者アズリーの賢者のすゝめ',
        customTitle: '悠久の愚者アズリーの賢者のすゝめ',
        synopsis: '不老の薬を飲んで5000年間魔法と薬学を研究し続けた愚者アズリー。古代の死霊魔術や精霊使役を極めた彼は、巨大化する使い魔ポチと共に現代の世界へ。失われた古代魔術の知恵で数々の危機を救っていく。',
        recommendReason: '5000年間の研究の積み重ねが生み出す圧倒的な知識と実力！飄々としたおじいちゃん賢者アズリーの痛快な活躍が楽しめます。',
        points: [
          '5000年間の地道な実験と魔法研究によって極められた圧倒的知識と実力',
          '巨大化する使い魔ポチとのコミカルで息の合った掛け合いと冒険活劇',
          '「愚者」と呼ばれた男が、失われた古代魔法と知恵で現代を救うカタルシス'
        ]
      },
      {
        keyword: '骸骨兵士はダンジョンを守れなかった',
        customTitle: '骸骨兵士はダンジョンを守れなかった',
        synopsis: '名もなき最弱の骸骨兵士。ダンジョンを侵略する勇者に瞬殺されるが、死ぬたびに記憶を引き継いで過去へと巻き戻る「死に戻り」能力に覚醒。主であるサキュバスを救うため、何千回もの死線を越えてスキルを継承し、最強の死霊戦士へと進化していく。',
        recommendReason: '最弱のガイコツが死に覚えゲーのように経験値を積み重ね、絶望的な運命を書き換えていくダークループアクションの傑作です！',
        points: [
          '死ぬたびに前世のスキルと記憶を継承して強くなる緊迫のタイムリープ',
          '主を救うために不屈の闘志で立ち向かう骸骨兵士の胸を打つ忠誠心',
          '世界の崩壊と陰謀の真相に迫っていく重厚なサスペンスストーリー'
        ]
      },
      {
        keyword: 'デスマーチからはじまる異世界狂想曲',
        customTitle: 'デスマーチからはじまる異世界狂想曲',
        synopsis: 'レベル310の神話級ステータスを持つサトゥー。アンデッドの軍団が街を襲撃した際も、圧倒的な光魔法や空間魔法で瞬時に浄化・無力化。死霊術の暴走に苦しむ人々を救い、美味しい料理と観光の旅を続ける。',
        recommendReason: 'どんな絶望的なアンデッドの災害も裏から一瞬で平穏へと戻す安心感！仲間たちと美味しいご飯を食べる至福のスローライフです。',
        points: [
          '神話級の最強能力を持ちながら仲間たちと観光とグルメを楽しむ贅沢な旅路',
          'トラブルが発生すれば仮面の魔法使いとして裏から瞬殺解決する頼もしさ',
          '各地の名産品や郷土料理を味わう旅情あふれる丁寧な世界観'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: 'オーバーロード',
        reason: '死霊術の最高峰に君臨する魔王アインズの圧倒的カリスマと軍勢統率劇。ダークファンタジーの頂点に立つ名作です。'
      },
      {
        rank: 2,
        title: '俺だけレベルアップな件',
        reason: '「起きろ」の一言で敵ボスを影の兵士として従える圧倒的カッコよさと疾走感あふれるバトルは全読者必読です。'
      },
      {
        rank: 3,
        title: '望まぬ不死の冒険者',
        reason: '最弱スケルトンから上位アンデッドへと進化していく緻密なサバイバルと、人間味あふれるレントの生き様が胸を打ちます。'
      }
    ]
  },
  {
    slug: 'isekai-dungeon-master-labyrinth-10',
    title: 'ダンジョンマスター・迷宮創造＆拠点防衛おすすめラノベ10選【凶悪トラップ・侵略者迎撃・魔王経営】',
    metaTitle: 'ダンジョンマスター・迷宮運営おすすめラノベ10選！拠点防衛・トラップ迎撃＆魔王経営まとめ',
    description: '自分の理想の迷宮をゼロからクリエイト！凶悪な即死トラップ、強力なモンスター配置、迷宮都市の商業経営、そして攻め込んできた傲慢な人間軍団をタワーディフェンスで返り討ちにする「ダンジョンマスター・迷宮創造系」おすすめラノベ10選を徹底解説します。',
    eyecatchBadge: 'ダンジョンマスター・迷宮創造・防衛',
    faq: [
      {
        q: 'ダンジョンマスター系ラノベの魅力は何ですか？',
        a: 'クラフトゲーム（マインクラフトやシムシティ）のような「拠点づくりのワクワク感」と、タワーディフェンスのような「侵略者をトラップと魔物で迎撃する爽快感」が融合している点にあります。自給自足の快適なマイホームを作りつつ、敵を罠にハメて倒す知略戦が楽しめます。'
      },
      {
        q: 'ダンジョン経営モノのおすすめ定番作品は？',
        a: '近代都市型ダンジョンを築く『魔王様の街づくり！』や、引きこもり用迷宮で美少女たちと暮らす『魔王になったので、ダンジョン造って人外娘とほのぼのする』、怠惰な魔王の防衛劇『絶対ニート宣言！』がおすすめです。'
      }
    ],
    items: [
      {
        keyword: '魔王様の街づくり！',
        customTitle: '魔王様の街づくり！ 〜最強のダンジョンは近代都市〜',
        synopsis: '新たに生まれた「創造」の魔王プロケル。古い迷宮の慣習を捨て、銃火器を装備した魔物たちと共に人間と魔物が共存する近代都市ダンジョン「アヴァロン」を建設。カジノ、観光、安全な居住区で莫大なDPを稼ぎ、攻め込んできた敵対魔王の軍勢を近代兵器で迎撃する。',
        recommendReason: 'ダンジョン経営と近代都市シミュレーションが見事に融合！銃火器で武装した魔物たちが敵軍を迎え撃つタワーディフェンスの爽快感が抜群です。',
        points: [
          'ダンジョンを近代都市として開発し観光と商業で莫大な富を生み出す内政',
          '銃火器や現代兵器で武装した魔物たちが敵軍を迎え撃つ爽快な防衛戦',
          '人間と魔物が心から笑顔で暮らせる理想郷を追求するプロケルの信念'
        ]
      },
      {
        keyword: '魔王になったので、ダンジョン造って人外娘とほのぼのする',
        customTitle: '魔王になったので、ダンジョン造って人外娘とほのぼのする',
        synopsis: '魔王として転生したユキ。超危険な魔境地帯に引きこもり用ダンジョンを建築！銀髪覇竜レフィやヴァンパイア少女イルナたちと家族になり、美味しい料理と娯楽を満喫しながら、侵入してきた傲慢な人間軍団を最新のハイテクトラップで瞬殺する。',
        recommendReason: '理想のマイホームをクラフトし、可愛い人外美少女たちを甘やかす至福の日常と、侵略者を容赦なく撃退する防衛バトルの爽快感が最高です！',
        points: [
          '迷宮創造スキルで最新家電や温泉付き豪邸を作り上げるクラフト感',
          '銀髪美少女覇竜レフィとの甘々で微笑ましい家族のような共同生活',
          '身勝手な勇者や軍隊を近代トラップで手玉に取る防衛戦の圧倒的無双'
        ]
      },
      {
        keyword: 'ライブダンジョン！',
        customTitle: 'ライブダンジョン！',
        synopsis: '元廃人ゲーマーのツトムが異世界の迷宮攻略に挑む。不遇職のヒーラーでありながら、ヘイト管理とMMO戦術を駆使して迷宮のボスを完封。迷宮攻略のライブ中継を通じて街の常識を覆し、最強ギルドを育て上げていく。',
        recommendReason: '迷宮のギミックやボスの行動パターンをロジカルに解明し、完璧なチームプレイで攻略していく知的な快感がたまりません。',
        points: [
          'ヘイト管理とバフ・デバフを駆使する本格MMOゲーマーの洗練された戦術',
          '見下されていた白魔道士が最難関レイドボスを完封していく爽快な下剋上',
          '個性的なパーティメンバーたちを指導し最強ギルドへと育てる育成の快感'
        ]
      },
      {
        keyword: 'ダンジョン飯',
        customTitle: 'ダンジョン飯',
        synopsis: '深層で妹を喰われたライオスたちが、迷宮内の魔物を自給自足で調理しながら最下層を目指す。迷宮の生態系やトラップの構造を熟知したドワーフのセンシと共に、大サソリや動く鎧を美味しくいただきながら迷宮の深淵を踏破する。',
        recommendReason: '迷宮の生態系とトラップの仕組みを徹底的に掘り下げた大傑作！ダンジョンそのものが一つの生きた生態系として描かれるリアリティに感動します。',
        points: [
          '架空の魔物を極上料理に仕立てる圧倒的な調理リアリズムと飯テロ',
          'ダンジョン全体の生態系や食物連鎖を解き明かしていく重厚な世界観',
          '命をいただくことへの真摯な哲学と、仲間たちとの温かい食卓'
        ]
      },
      {
        keyword: 'オーバーロード',
        customTitle: 'オーバーロード',
        synopsis: 'ナザリック地下大墳墓の主アインズ。侵入者を迎え撃つ各階層の守護者たちと、即死級トラップが張り巡らされた絶対不可侵の要塞ダンジョン。愚かにも宝目当てで潜入したワーカーたちを、完璧な迎撃網で絶望へと叩き落とす。',
        recommendReason: '侵入者の視点から描かれるナザリック地下大墳墓の圧倒的な絶望感と、アインズ様の冷徹な防衛采配が鳥肌モノの迫力を誇ります。',
        points: [
          '各階層ごとに異なる環境と最強守護者が待ち構える難攻不落の巨大迷宮',
          '侵入者を罠と心理戦で弄び完全に絶望へと追い込む冷徹な防衛劇',
          'ナザリックの圧倒的な財力と軍事力で世界を内側から支配していくスケール感'
        ]
      },
      {
        keyword: '自動販売機に生まれ変わった俺は迷宮を彷徨う',
        customTitle: '自動販売機に生まれ変わった俺は迷宮を彷徨う',
        synopsis: '自販機として転生したハッコン。怪力少女ラッミスに背負われて迷宮の階層集落で暮らす。ジュースや温かいスープ、防犯グッズを提供して集落の防衛拠点を支え、魔物の大群が押し寄せた際は自販機の特殊機能で撃退に貢献する。',
        recommendReason: '自販機が集落のオアシス兼防衛拠点として機能していくユニークなアイデアと、仲間たちとの心温まる絆が素晴らしい名作です。',
        points: [
          '自販機の商品知識を工夫して迷宮の防衛や生活改善に役立てるアイデア',
          '怪力少女ラッミスとの言葉を超えた温かく微笑ましい信頼関係',
          '階層集落の人々に愛され、拠点として発展していくアットホームな日常'
        ]
      },
      {
        keyword: 'ダンジョンに出会いを求めるのは間違っているだろうか',
        customTitle: 'ダンジョンに出会いを求めるのは間違っているだろうか',
        synopsis: '迷宮都市オラリオの地下に広がる広大なダンジョン。未知の階層、モンスターの異常発生（パレード）、階層主（アンフィス・バエナ）の襲撃に、少年ベルが仲間たちと共に命懸けで立ち向かう。',
        recommendReason: 'ダンジョンの過酷な死線と、限界を超えて立ち上がる冒険者たちの魂の叫び！全ラノベ屈指の熱血バトルが炸裂します。',
        points: [
          '未知の深層で繰り広げられる極限のサバイバルと仲間たちとの熱い絆',
          '神々と眷族の絆、緻密に作り込まれた迷宮都市の重厚な世界設定',
          '限界突破のステータスと必殺技が炸裂する、鳥肌必至の白熱バトルシーン'
        ]
      },
      {
        keyword: '異世界のんびり農家',
        customTitle: '異世界のんびり農家',
        synopsis: '魔の森の中心に広大な大樹の村を開拓したヒラク。村の周囲には頑丈な防壁と堀、インフェルノウルフたちの哨戒網を構築。迷い込んできた凶悪魔獣や侵略軍を一瞬で迎撃し、村人全員が安心して暮らせる絶対安全なユートピアを維持する。',
        recommendReason: '完璧な防衛体制を整えた上で、仲間たちと美味しい農作物やお酒を味わう至福のスローライフ！開拓と防衛のバランスが最高です。',
        points: [
          '万能農具で村を要塞化し侵略者を瞬殺する安心感抜群の拠点防衛',
          '吸血鬼やエルフ、ドラゴンたちと築く多種族共存の温かいコミュニティ',
          '収穫祭や酒宴をみんなで楽しむ、ストレスゼロの平和な日常'
        ]
      },
      {
        keyword: '創造錬金術師は自由を謳歌する',
        customTitle: '創造錬金術師は自由を謳歌する 故郷を追放されたついでに、領地の隣で悠々自適の開拓ライフ',
        synopsis: '追放された錬金術師トールが、荒野に自動防衛タレットや結界装置を備えた最強の工房ダンジョンを建設。侵入してくる盗賊や魔物を近代トラップで迎撃しながら、仲間たちと自由気ままなスローライフを満喫する。',
        recommendReason: '錬金術で瞬時に防衛兵器や豪華な住居をクラフトしていくスピード感と、仲間たちとのほのぼのライフが癖になります。',
        points: [
          '万能の創造錬金術で荒野を近代的な要塞都市へと変える爆速クラフト',
          '侵略者を自動迎撃兵器で手玉に取るタワーディフェンスの爽快感',
          '可愛い獣人の仲間たちと共に温泉やご馳走を楽しむ悠々自適ライフ'
        ]
      },
      {
        keyword: 'Dジェネシス ダンジョンが出来て3年',
        customTitle: 'Dジェネシス ダンジョンが出来て3年',
        synopsis: '自宅のガレージダンジョンを拠点に、世界1位の探索者となった三好達也。ガレージを最新鋭のセキュリティと研究設備で要塞化し、ダンジョン資源の独占と科学的解析を進め、国際的な陰謀から自らの拠点を守り抜く。',
        recommendReason: '現代日本におけるリアルな拠点防衛と利権管理を描いた知性派ダンジョン小説！大人の知的好奇心を刺激します。',
        points: [
          '現実の法制度や国際情勢を綿密に計算した大人の拠点運営と利権確保',
          '世界1位の探索者でありながら淡々と研究を進める知的な立ち回り',
          'ダンジョン資源を科学技術と融合させていくワクワクする検証プロセス'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '魔王様の街づくり！ 〜最強のダンジョンは近代都市〜',
        reason: 'ダンジョン経営×近代都市シミュレーションの最高峰。銃火器で武装した魔物たちのタワーディフェンス防衛戦が爽快無比です。'
      },
      {
        rank: 2,
        title: '魔王になったので、ダンジョン造って人外娘とほのぼのする',
        reason: '理想の引きこもり迷宮をクラフトし、愛らしいドラゴン娘たちと暮らす多幸感が最高。侵略者への容赦ない迎撃もスカッとします。'
      },
      {
        rank: 3,
        title: 'ダンジョン飯',
        reason: 'ダンジョン全体の生態系とトラップの仕組みを極限までリアリスティックに描いた歴史的名作。食への深い哲学が光ります。'
      }
    ]
  }
]

async function enrichAndSave() {
  const featuresPath = path.join(root, 'public/data/curated-features.json')
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'))

  for (const feature of batchFeaturesPart2) {
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
  console.log(`\nBatch features part 2 successfully fetched and updated! Total features: ${features.length}`)
}

await enrichAndSave()
