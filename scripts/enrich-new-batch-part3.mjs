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

export const batchFeaturesPart3 = [
  {
    slug: 'isekai-appraisal-cheat-item-box-10',
    title: '鑑定スキル・アイテムボックス万能チートおすすめラノベ10選【真価看破・無限収納・サクサク無双】',
    metaTitle: '鑑定スキル＆アイテムボックスおすすめ異世界ラノベ10選！真価看破・無限収納＆成り上がりまとめ',
    description: 'ガラクタの山から伝説の国宝を発見！誰も気づかないステータスや隠し才能を看破し、無限のアイテムボックスで物資と魔導兵器をサクサク持ち運ぶ！探索・商売・育成が何倍も快適になる「鑑定＆アイテムボックス系」おすすめ異世界ラノベ10選を徹底解説します。',
    eyecatchBadge: '鑑定スキル・アイテムボックス・無双',
    faq: [
      {
        q: '鑑定スキル＆アイテムボックスモノの面白さはどこですか？',
        a: '情報格差を利用して格安のガラクタから超希少なアーティファクトを発見する「目利きカタルシス」と、重量や腐敗を気にせず何でも収納できる「圧倒的ストレスフリーなサクサク冒険」にあります。隠れた逸材を発掘して育成するスカウト要素も魅力です。'
      },
      {
        q: '鑑定・収納系のおすすめ入門作は？',
        a: '人材発掘の最高峰『転生貴族、鑑定スキルで成り上がる』や、素材採取と神眼の旅を描く『素材採取家の異世界旅行記』、大容量収納で商売する『とんでもスキルで異世界放浪メシ』が鉄板です。'
      }
    ],
    items: [
      {
        keyword: '転生貴族、鑑定スキルで成り上がる',
        customTitle: '転生貴族、鑑定スキルで成り上がる〜弱小領地を受け継いだので、優秀な人材を増やしていたら、最強領地になってた〜',
        synopsis: '弱小貴族の跡取りアルス。他人の潜在能力や統率・武勇・知略・政治の数値を完璧に見抜く【鑑定スキル】を持つ。差別されていたマルカ人の少年リーツや天才軍師ロセルを抜擢し、乱世を生き抜く最強の精鋭軍団を育て上げる。',
        recommendReason: '「スカウト＆人材育成」の最高傑作！才能を見出された家臣たちがアルスのために命を懸けて奮闘する絆と成長に胸が熱くなります。',
        points: [
          '【鑑定】で隠れた才能を発掘し最強の軍師や武将へと育てるスカウトの醍醐味',
          'アルスの誠実な人柄に救われた家臣たちの熱い忠誠心と家族のような絆',
          '弱小領地から周辺の大名たちと渡り合い一大勢力へと拡大する戦国サクセス'
        ]
      },
      {
        keyword: '素材採取家の異世界旅行記',
        customTitle: '素材採取家の異世界旅行記',
        synopsis: 'あらゆる素材の位置と真価を見抜く「神眼」と、大容量の「アイテムボックス」を授かったタケル。危険な迷宮や秘境から超希少な薬草や鉱石を安全に採取し、名工たちに素材を提供しながら各地を巡る。',
        recommendReason: 'RPGの素材集めと収集要素が好きな人にはたまらない癒やし旅情ファンタジー！サクサク採取と美味しい料理の旅に心が癒やされます。',
        points: [
          '神眼チートで超希少な鉱石や薬草をサクサク発見する収集の快感',
          '伝説の鍛冶職人たちに素材を提供し最高峰の武具を打ち立てる職人サポート',
          '危険な争いを避け各地の美味しい郷土料理を味わう自由気ままな一人旅'
        ]
      },
      {
        keyword: 'とんでもスキルで異世界放浪メシ',
        customTitle: 'とんでもスキルで異世界放浪メシ',
        synopsis: '【アイテムボックス】と【ネットスーパー】を持つムコーダ。巨大な魔獣の肉や素材を時間停止のアイテムボックスに丸ごと収納。いつでも新鮮な状態で取り出して絶品ステーキを調理し、フェルたちの胃袋を満たす。',
        recommendReason: '時間停止のアイテムボックスで大量の肉や食材を鮮度抜群のまま保存し、いつでもどこでも絶品キャンプ飯を作る飯テロの極致です！',
        points: [
          '時間停止の完全収納スキルで食材の鮮度を100%キープする快適調理',
          '日本の調味料と高級魔獣肉が織りなす圧倒的な飯テロ描写',
          'もふもふフェルやスライムスイとの家族のような心温まる旅路'
        ]
      },
      {
        keyword: 'アラフォー男の異世界通販生活',
        customTitle: 'アラフォー男の異世界通販生活',
        synopsis: 'ネット通販スキルを持つケンイチ。アイテムボックスに現代の工具や保存食、発電機を大量にストックし、未開の森で快適な隠れ家を整える。素材を換金して通販で欲しい物資を取り寄せる。',
        recommendReason: '現代の便利グッズを必要な時にアイテムボックスから取り出してサクッと解決する大人の余裕が魅力的です。',
        points: [
          '通販サイトとアイテムボックスを組み合わせた快適なグランピング空間',
          '危険を避け安全第一で物事を進めるアラフォーの落ち着いたサバイバル術',
          '現地の人々との温かい物々交換を通じた地域復興と人情味'
        ]
      },
      {
        keyword: 'デスマーチからはじまる異世界狂想曲',
        customTitle: 'デスマーチからはじまる異世界狂想曲',
        synopsis: 'プログラマーのサトゥー。全アイテム・全人物のステータスやスキルを瞬時に詳細把握できる【全マップ探知＆詳細鑑定】と、無限容量の【インベントリ】を所持。未知の食材や宝物を鑑定しながら観光を満喫する。',
        recommendReason: 'ゲームの全知マップと無限インベントリによる究極のストレスフリー！どんなレアアイテムも一瞬で鑑定して有効活用します。',
        points: [
          '全マップ探知と詳細鑑定で敵の奇襲や罠を100%未然に防ぐ安心感',
          '無限インベントリに各地の名産品や料理をストックして楽しむ観光旅',
          'いざ事件が起きれば裏から圧倒的な力で瞬殺解決する頼もしさ'
        ]
      },
      {
        keyword: '転生したらスライムだった件',
        customTitle: '転生したらスライムだった件',
        synopsis: 'ユニークスキル【捕食者】（後の暴食之王）と【大賢者】を持つリムル。大賢者の完璧な解析鑑定と、捕食者の無限胃袋（ストレージ）空間を駆使し、魔物のスキルを吸収・再現しながら建国を進める。',
        recommendReason: '大賢者による超高精度の解析鑑定と、捕食による能力獲得のコンボが最高にスタイリッシュで爽快です！',
        points: [
          '大賢者（相棒）の冷静沈着な解析ナビゲートと的確な戦術指南',
          '捕食した相手のスキルや姿を自在に再現・進化させる無限の成長ツリー',
          '多種族が手を取り合って最新鋭の理想都市を築く建国・内政の面白さ'
        ]
      },
      {
        keyword: '蜘蛛ですが、なにか？',
        customTitle: '蜘蛛ですが、なにか？',
        synopsis: '迷宮サバイバルに挑む蜘蛛子。【鑑定】スキルを血のにじむような努力でカンストまで育成！敵の弱点や耐性、スキルの詳細を看破し、格上の凶悪魔物を知恵と状態異常でハメ倒していく。',
        recommendReason: '最初は「情報が少なすぎて役に立たない鑑定」を地道にレベリングして最強の看破スキルへと育て上げる育成の達成感が抜群です！',
        points: [
          '鑑定スキルをカンストさせて敵の全ステータスと弱点を看破する知的バトル',
          '蜘蛛子の超ハイテンションなモノローグと極限サバイバルのギャップ',
          '進化ツリーを駆け上がるゲームライクな育成の面白さと伏線回収'
        ]
      },
      {
        keyword: '異世界薬局',
        customTitle: '異世界薬局',
        synopsis: '薬学研究者ファルマが授かった【診眼】スキル。患者の身体にかざすだけで病変部位や病名が光り輝いて判明する。現代薬学の知識と診眼を組み合わせ、中世の難病や疫病を的確に診断・治療していく。',
        recommendReason: '超能力的な診眼と本物の薬理学・病理学が融合した本格医療ドラマ！迷信を科学と診断の力で打ち破るカタルシスが素晴らしいです。',
        points: [
          '診眼による透視診断と現代薬学を融合させたリアルな医療ドラマ',
          '黒死病などの疫病アウトブレイクを水際で食い止める緊迫の防遏作戦',
          '身分に関係なくすべての人々に正しい医療を届けるファルマの医師魂'
        ]
      },
      {
        keyword: '老後に備えて異世界で８万枚の金貨を貯めます',
        customTitle: '老後に備えて異世界で８万枚の金貨を貯めます',
        synopsis: '世界間転移と大容量アイテムボックスを持つミツハ。地球の百均グッズや缶詰、ナイフ、さらには傭兵の重火器までアイテムボックスに詰め込んで異世界へ持ち込み、貴族相手に爆売りして金貨を稼ぎまくる。',
        recommendReason: '「アイテムボックス×世界間転移」の機動力をフル活用して、情報格差と物価格差でガッポリ稼ぐミツハの商魂が痛快です！',
        points: [
          '地球の物資を無限に持ち込んで異世界貴族を魅了する爆速ビジネス',
          'ピンチの時は銃火器を瞬時に取り出して自衛するミツハの容赦ない決断力',
          '稼いだ富で老後資金を貯めつつ弱者を救う社会起業家的一面'
        ]
      },
      {
        keyword: 'ポーション頼みで生き延びます！',
        customTitle: 'ポーション頼みで生き延びます！',
        synopsis: '異空間収納とポーション創造チートを持つカオル。望む効果と容器のポーションを瞬時に生み出し、時間停止のアイテムボックスに保管。悪徳貴族や神官の企みを鑑定眼と知略で暴き、ポーションで制裁を下す。',
        recommendReason: 'アイテムボックスからあらゆる特効薬や目潰し液を取り出してトラブルをスマートに解決するカオルの機転が爆笑を誘います！',
        points: [
          '容器も効果も自由自在なポーションチートと悪魔的な知恵の活用',
          '自分の平穏を脅かす悪徳貴族を策謀とアイテムで完膚なきまでに撃退',
          '孤児たちの保護や医療支援を通じて自然と聖女として崇められる展開'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '転生貴族、鑑定スキルで成り上がる〜弱小領地を受け継いだので、優秀な人材を増やしていたら、最強領地になってた〜',
        reason: '鑑定スキルを「人材発掘・育成」に特化させた大傑作。隠れた才能を見出し、最強の家臣団を築き上げる感動と興奮は唯一無二です。'
      },
      {
        rank: 2,
        title: '素材採取家の異世界旅行記',
        reason: '神眼チートとアイテムボックスで超希少素材をサクサク集めるRPG的ワクワク感が最高。各地の名工やグルメとの旅情に癒やされます。'
      },
      {
        rank: 3,
        title: 'とんでもスキルで異世界放浪メシ',
        reason: '時間停止のアイテムボックスで鮮度抜群の食材を保管し、いつでも絶品料理を振る舞う飯テロの頂点。従魔たちとの絆も尊いです。'
      }
    ]
  },
  {
    slug: 'isekai-modern-weapon-gun-firearms-10',
    title: '現代兵器・銃火器ミリタリー無双おすすめ異世界ラノベ10選【魔法を銃弾で粉砕・近代兵装・圧倒的制圧力】',
    metaTitle: '現代兵器・銃火器ミリタリーおすすめ異世界ラノベ10選！近代兵器で魔法を圧倒する爽快傑作まとめ',
    description: '詠唱も魔力も関係ない！音速の弾丸と圧倒的な火力が中世ファンタジーの常識を粉砕する！アサルトライフル、対物スナイパーライフル、ロケットランチャー、重装甲車。近代兵器と魔法が激突する「現代兵器・銃火器ミリタリー系」おすすめ異世界ラノベ10選を徹底解説します。',
    eyecatchBadge: '現代兵器・銃火器・ミリタリー無双',
    faq: [
      {
        q: '現代兵器・銃火器モノの最大の面白さは何ですか？',
        a: '詠唱に何秒もかかる大魔法に対し、引き金を引くだけで0.1秒で急所を撃ち抜く「圧倒的な実用性と初速の暴力」にあります。魔法至上主義の傲慢な貴族やモンスターを、近代の銃火器や弾道学のロジックで一方的に制圧するカタルシスが最高です。'
      },
      {
        q: '銃火器・ミリタリーファンタジーの代表作は？',
        a: '自作銃火器で神をも殺す『ありふれた職業で世界最強』や、自衛隊が異世界に進出する『GATE 自衛隊 彼の地にて、斯く戦えり』、航空魔導大隊を率いる『幼女戦記』が3大巨頭です。'
      }
    ],
    items: [
      {
        keyword: 'ありふれた職業で世界最強',
        customTitle: 'ありふれた職業で世界最強',
        synopsis: '奈落の底で錬成スキルに覚醒した南雲ハジメ。タングステン鋼を錬成した大型リボルバー「ドンナー」、電磁加速対物ライフル「シュラーク」、超電磁砲レールガンなど近代火器を次々と自作。中世ファンタジーの魔物や神の使徒を圧倒的な弾幕と破壊力で殲滅する。',
        recommendReason: '銃火器クラフト×厨二病カッコよさの最高到達点！リボルバーの撃発音やレールガンの閃光が脳裏に焼き付くド派手なミリタリーアクションが爽快です。',
        points: [
          '錬成魔法でリボルバー、ライフル、レールガンを創り出す緻密な銃火器クラフト',
          '詠唱を待たずに一瞬で頭部を撃ち抜く圧倒的な近代兵装の制圧力',
          '裏切った同級生や傲慢な敵を一切の容赦なく粉砕するダークヒーローの雄姿'
        ]
      },
      {
        keyword: '幼女戦記',
        customTitle: '幼女戦記',
        synopsis: '孤児ターニャ・デグレチャフが率いる第203航空魔導大隊。魔導半自動小銃や短機関銃、航空爆雷を装備し、塹壕戦で膠着する戦線を高高度からの急降下電撃射撃で突破。近代戦の軍事理論と銃火器で敵軍を蹂躙する。',
        recommendReason: '第一次・第二次世界大戦の銃火器・航空戦術を忠実に再現した重厚なミリタリー描写！硝煙と爆発のリアルな臨場感が圧倒的です。',
        points: [
          '近代小銃・機関銃・爆薬の運用理論を緻密に落とし込んだ本格戦場描写',
          '高高度からの電撃強襲で敵陣地を火の海に変える航空魔導大隊の迫力',
          '合理主義を貫くターニャの冷徹な軍略と皮肉な運命のドラマ'
        ]
      },
      {
        keyword: '魔王様の街づくり！',
        customTitle: '魔王様の街づくり！ 〜最強のダンジョンは近代都市〜',
        synopsis: '「創造」の魔王プロケル。魔物たちにアサルトライフルやスナイパーライフル、グレネードランチャーを配備し、近代銃撃戦の訓練を実施。迷宮に攻め込んできた旧態依然とした騎士団や敵対魔王の軍勢を、十字砲火と狙撃で全滅させる。',
        recommendReason: '「銃火器で武装した魔物軍団」による近代タワーディフェンスが最高に爽快！キツネ少女クイナの超長距離スナイプがカッコいいです。',
        points: [
          'アサルトライフルや対物ライフルで武装した魔物たちの圧倒的十字砲火',
          'ダンジョンを近代都市として開発し観光と兵器開発を両立する内政',
          '剣と魔法の軍勢を近代兵器のキルゾーンに誘い込んで完封する知略'
        ]
      },
      {
        keyword: '老後に備えて異世界で８万枚の金貨を貯めます',
        customTitle: '老後に備えて異世界で８万枚の金貨を貯めます',
        synopsis: '世界間転移能力を持つミツハ。地球の傭兵団「ウルフファング」と契約し、アサルトライフル、重機関銃、装甲車、携帯対戦車ミサイルを異世界へ持ち込む。王国を侵略してきた敵国の大軍やワイバーン部隊を、近代傭兵の圧倒的火力で殲滅する。',
        recommendReason: '中世の騎士団やワイバーン部隊を、地球の機関銃や対空ミサイルで瞬殺する爽快なカルチャーショック！ミツハの豪快な采配が痛快です。',
        points: [
          '地球の現役傭兵団を装甲車ごと異世界へ投入する豪快すぎる武力解決',
          'ワイバーンを対空火器で撃ち落とし敵軍を機関銃で薙ぎ払う圧倒的制圧',
          '金貨8万枚を貯めるため商売と防衛を両立するミツハの逞しい商魂'
        ]
      },
      {
        keyword: '乙女ゲー世界はモブに厳しい世界です',
        customTitle: '乙女ゲー世界はモブに厳しい世界です',
        synopsis: 'モブ男爵リオンが発掘した旧人類のチート戦艦「ルクシオン」。ドローン兵器、レールキャノン、自動追尾ミサイル、超高度AIを搭載した近代超兵器で、中世風の貴族騎士団や空中艦隊をボタン一つで蹂躙する。',
        recommendReason: '中世ファンタジーの理不尽な貴族社会を、旧人類の超テクノロジーとレールガンで跡形もなく吹き飛ばす爽快感が最高です！',
        points: [
          '超巨大戦艦ルクシオンが放つレールキャノンとミサイルの圧倒的殲滅力',
          '傲慢な王子や貴族を徹底的に煽り倒して精神的にも肉体的にも完封するリオン',
          '毒舌AIルクシオンとの皮肉混じりの軽快な掛け合いとロボットバトル'
        ]
      },
      {
        keyword: '俺は星間国家の悪徳領主！',
        customTitle: '俺は星間国家の悪徳領主！',
        synopsis: 'SF星間国家の伯爵リアム。専用機動騎士「アヴィド」に超電磁ライフルや近接ブレードを搭載。中世貴族のような腐敗領主たちや海賊艦隊を、最新鋭の宇宙艦隊と機動兵器の超火力で一網打尽にする。',
        recommendReason: '宇宙戦艦の主砲斉射と人型機動兵器のスタイリッシュな無双アクション！悪徳領主を目指すリアムの勘違いコメディも爆笑必至です。',
        points: [
          '専用機アヴィドと最新鋭宇宙艦隊が放つ圧倒的なSF兵器無双',
          '悪徳領主を目指すリアムが領民から名君と崇拝される爆笑すれ違い',
          '一刀流の剣技と近代兵装を組み合わせたド迫力のアクションシーン'
        ]
      },
      {
        keyword: '戦闘員、派遣します！',
        customTitle: '戦闘員、派遣します！',
        synopsis: '悪の秘密結社キサラギの平社員・戦闘員六号と美少女アンドロイドのアリス。ショットガン、ロケットランチャー、プラスチック爆薬を異世界へ転送し、中世の魔王軍相手に近代火器と悪知恵で大暴れする。',
        recommendReason: '『このすば』の暁なつめ先生が描く痛快ミリタリーギャグ！ショットガンをぶっ放す毒舌アンドロイド・アリスの可愛さと六号のクズっぷりが最高です。',
        points: [
          '近代銃火器と悪のハイテクノロジーで異世界の魔物を蹂躙する爽快バトル',
          '高性能アンドロイド・アリスの容赦のないショットガン掃射と辛辣ツッコミ',
          'セコくておバカな悪行ポイント稼ぎが巻き起こす大爆笑コメディ'
        ]
      },
      {
        keyword: '陰の実力者になりたくて！',
        customTitle: '陰の実力者になりたくて！',
        synopsis: 'シド・カゲノーの放つ究極奥義「アイ・アム・アトミック」。核兵器の爆発原理を魔力で再現したその一撃は、都市を丸ごと吹き飛ばす戦略兵器そのもの。スライムスーツによる防弾・防刃性能と併せて圧倒的な破壊力を見せつける。',
        recommendReason: '「核兵器に勝つために魔力を極めた」というシドの狂気的な設定と、戦略核レベルの破壊力を放つ必殺技のカッコよさに痺れます。',
        points: [
          '核爆発を魔力で具現化する「アイ・アム・アトミック」の圧倒的破壊力',
          'スライムスーツを自在に変形させて銃弾や刃を弾く最新鋭の防護性能',
          '厨二病全開のシドと配下のシャドウガーデンが織りなすスタイリッシュ無双'
        ]
      },
      {
        keyword: 'シャングリラ・フロンティア',
        customTitle: 'シャングリラ・フロンティア〜クソゲーハンター、神ゲーに挑まんとす〜',
        synopsis: 'フルダイブゲーム『シャンフロ』で、古代文明の遺産であるレールガンやパイルバンカー、自律起動兵器などの超近代兵装を発掘。神話級のユニークモンスター「墓守のウェザエモン」との超科学バトルに挑む。',
        recommendReason: 'ファンタジー世界に眠る失われた超テクノロジー兵器と、プレイヤーの神業フレーム回避が激突する最高峰のアクションです！',
        points: [
          '古代文明のレールガンや強化外骨格アーマーを駆使するド迫力ボス戦',
          'クソゲーで鍛え上げた超人的なプレイヤースキルと反射神経の無双',
          '世界の真実とロストテクノロジーの謎を解き明かしていく攻略の熱狂'
        ]
      },
      {
        keyword: '魔法科高校の劣等生',
        customTitle: '魔法科高校の劣等生',
        synopsis: '司波達也の操る戦略級魔法「質量爆発（マテリアル・バースト）」。物質をアインシュタインの公式（E=mc²）に基づいて100%エネルギー変換し、微小な水滴一滴から核兵器を遥かに凌駕する超巨大爆発を引き起こす。',
        recommendReason: '現代物理学と魔法を完全融合させた究極のミリタリーSF！どんな軍隊も一瞬で消滅させる達也の圧倒的強さに圧倒されます。',
        points: [
          'アインシュタインの相対性理論を応用した戦略級魔法マテリアル・バーストの威力',
          '銃型CADを用いた超高速魔法演算と冷静沈着な特殊部隊戦闘',
          '軍事テロリストを一切の容赦なく殲滅する「さすがはお兄様」の絶対的無双'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: 'ありふれた職業で世界最強',
        reason: '大型リボルバーからレールガンまで、自作銃火器で神をも屠るダークヒーローのカッコよさが最高峰。銃火器ミリタリー無双の金字塔です。'
      },
      {
        rank: 2,
        title: '幼女戦記',
        reason: '第一次・第二次大戦の軍事理論と航空魔導小銃の射撃戦が融合した圧倒的リアリズム。硝煙漂う戦場描写は唯一無二の迫力です。'
      },
      {
        rank: 3,
        title: '魔王様の街づくり！ 〜最強のダンジョンは近代都市〜',
        reason: '銃火器で武装した魔物軍団によるキルゾーン防衛戦が爽快無比。近代兵装タワーディフェンスの面白さを存分に堪能できます。'
      }
    ]
  }
]

async function enrichAndSave() {
  const featuresPath = path.join(root, 'public/data/curated-features.json')
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'))

  for (const feature of batchFeaturesPart3) {
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
  console.log(`\nBatch features part 3 successfully fetched and updated! Total features: ${features.length}`)
}

await enrichAndSave()
