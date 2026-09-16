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

export const batchFeaturesPart1 = [
  {
    slug: 'isekai-craftsman-blacksmith-10',
    title: '異世界鍛冶屋・伝説の神兵器クラフトおすすめラノベ10選【名刀鍛造・魔導武具・職人魂】',
    metaTitle: '異世界鍛冶屋・名刀クラフトおすすめラノベ10選！神話級武器鍛造＆職人スローライフまとめ',
    description: '槌の音が響く炉の前で、神話級の業物が産声を上げる！鉄と炎に向き合い、使う者の命を守る包丁からドラゴンスレイヤーまでを打ち上げる男のロマン。職人魂と最新鋭クラフトが炸裂する「異世界鍛冶屋・武器製作系」おすすめラノベ10選を徹底解説します。',
    eyecatchBadge: '鍛冶屋・武器製作・職人魂',
    faq: [
      {
        q: '鍛冶屋・クラフト系ラノベの魅力は何ですか？',
        a: '金属の選定、炉の温度管理、折り返し鍛錬、焼き入れ、魔力付与といった「ものづくりの工程」が緻密に描かれ、主人公の打った道具や武器が使い手の人生や戦況を劇的に変えていく達成感とカタルシスにあります。'
      },
      {
        q: '鍛冶職人モノのおすすめ入門作は？',
        a: '森の奥で静かに道具を打つ『鍛冶屋ではじめる異世界スローライフ』や、伝説の魔剣を自ら鍛え上げる『転生したら剣でした』、不遇職から神鍛冶師になる『不遇職【鍛冶師】だけど最強です』が鉄板です。'
      }
    ],
    items: [
      {
        keyword: '鍛冶屋ではじめる異世界スローライフ',
        customTitle: '鍛冶屋ではじめる異世界スローライフ',
        synopsis: '過労死した元社畜の中年エイゾウが、神様から鍛冶チートを授かって異世界の深き森に工房を開く。世界を救う気は一切なく、使う人の手に馴染む包丁やナタを真心込めて打つ日々。しかし彼が打つ刃物は、切れ味も耐久度も神話級の業物ばかりで、エルフの美女剣士や国の重鎮たちが次々と工房を訪れるようになる。',
        recommendReason: '鉄を熱し、叩き、焼き入れをする鍛冶のプロセスが極めて丁寧に描かれ、職人のものづくりへの情熱が心地よく心に響きます。森の仲間たちと囲む手料理の温かさも絶品です。',
        points: [
          '鉄と炎に向き合う鍛冶職人のこだわりと、使う人に寄り添う道具づくりの美学',
          '森の工房に集まるエルフや獣人の少女たちと築く、温かく平和な家族スローライフ',
          '打った包丁やナタが使う人の生活を劇的に豊かにしていく職人冥利の喜び'
        ]
      },
      {
        keyword: '不遇職【鍛冶師】だけど最強です',
        customTitle: '不遇職【鍛冶師】だけど最強です 〜気づけば何でも作れるようになっていた、男の万能スローライフ〜',
        synopsis: '成人時のギフト鑑定で戦闘向きではない「鍛冶師」を授かり、追放された少年レリクス。しかし彼の鍛冶スキルは、壊れない神話級の武器から、自動防衛ゴーレム、快適な魔導ハウスまであらゆるものを瞬時にクラフトできる万能チートだった！辺境の地で自由にものづくりを楽しみながら、追放した者たちを圧倒していく。',
        recommendReason: '「ただの鍛冶師」が神話級の武具やインフラをサクサク創り出し、周囲の度肝を抜きまくる爽快感が圧倒的！素材採取からクラフトまでのテンポが抜群です。',
        points: [
          'ハズレ職と見下されていた鍛冶師が神話級アーティファクトを量産する爽快無双',
          '武器だけでなく快適な住居や防衛設備まで何でも生み出す万能クラフト',
          'レリクスを追放して武器が調達できなくなり自滅していく元パーティの痛快ざまぁ'
        ]
      },
      {
        keyword: '転生したら剣でした',
        customTitle: '転生したら剣でした',
        synopsis: '知性を持つ「魔剣」として異世界に転生した主人公。魔物を倒してスキルを自己吸収しながら、自己修復と刃の強化を繰り返す。奴隷の黒猫族少女フランと出会い、彼女の装備者（師匠）となって、自らの刀身を最高峰の神剣へと進化させながら世界を切り拓いていく。',
        recommendReason: '「剣自身が自己進化・自己鍛造していく」という斬新なクラフト＆バトル！フランとの父娘のような強い絆と、迫力満点の剣劇アクションが熱いです。',
        points: [
          '魔石を吸収して刀身の耐久度や属性を自在に強化していくワクワクする成長要素',
          '黒猫族の少女フランと知性を持つ魔剣（師匠）の尊すぎるバディ関係',
          'あらゆる理不尽と強敵を両断する、圧倒的な切れ味と爽快なバトル'
        ]
      },
      {
        keyword: '魔導具師ダリヤはうつむかない',
        customTitle: '魔導具師ダリヤはうつむかない 〜きょうから自由な職人ライフ〜',
        synopsis: '婚約破棄を機に独立した女性職人ダリヤ。前世の家電知識と魔導具の技術を掛け合わせ、防水布や小型魔導コンロ、魔導剣の付与技術などを開発。騎士ヴォルフの魔剣の柄や鞘を工夫し、使い手の身体への負担を減らす最高の一品を仕立て上げていく。',
        recommendReason: '武器そのものの威力だけでなく、「使う騎士の手首への負担」「重心バランス」「柄の握りやすさ」といった細やかな職人目線の工夫が胸を打ちます。',
        points: [
          '騎士ヴォルフの戦い方に寄り添い、オーダーメイドで武具を改良する職人の知恵',
          '美味しいお酒と料理を囲みながら深まる、大人同士の心地よい信頼と友情',
          '理不尽な偏見を跳ね除け、自分の腕一本で道を切り拓く凛とした生き様'
        ]
      },
      {
        keyword: '素材採取家の異世界旅行記',
        customTitle: '素材採取家の異世界旅行記',
        synopsis: 'あらゆる素材の位置と真価を見抜く「神眼」を授かったタケル。前人未到の火山やダンジョン深層で超希少鉱石（ヒヒイロカネ、ミスリル、アダマンタイト）を採取し、各地の伝説の鍛冶師たちに提供。最高峰の武具が打ち上がっていく過程を旅と共に楽しむ。',
        recommendReason: 'RPGの素材集めや鉱石採掘が好きな人にはたまらない作品！超レア素材を持ち込まれた名工たちが目を輝かせて名剣を打つシーンがワクワクします。',
        points: [
          '神眼チートで誰も見つけられない幻の鉱石や霊木を発見する採掘の醍醐味',
          '伝説の鍛冶職人たちとの熱い絆と、最高級の素材から生まれる名武具',
          '危険な争いを避け、美味しい郷土料理を味わいながら各地を巡る癒やし旅'
        ]
      },
      {
        keyword: 'ありふれた職業で世界最強',
        customTitle: 'ありふれた職業で世界最強',
        synopsis: '奈落の底へ突き落とされた非戦闘職【錬成師】の南雲ハジメ。鉱石と魔物の素材を錬成し、リボルバー「ドンナー」、対物ライフル「シュラーク」、電磁加速パイルバンカーなど近代兵器と魔導武具をゼロから開発。自作の圧倒的火力で神話級の迷宮を踏破していく。',
        recommendReason: '鍛冶・錬成チートを近代火器に応用した男のロマンの極致！鉱物錬成によるオリジナル武装のギミック解説が緻密で、男子の心を鷲掴みにします。',
        points: [
          '錬成魔法でリボルバーや電磁レールガンを創り出す圧倒的な近代兵装クラフト',
          '最弱の錬成師が過酷な極限サバイバルを経て世界最強の覇者へと覚醒する熱さ',
          '裏切った者たちや偽りの神を一切の容赦なく蹂躙する痛快無比なカタルシス'
        ]
      },
      {
        keyword: 'Only Sense Online',
        customTitle: 'Only Sense Online ―オンリーセンス・オンライン―',
        synopsis: 'VRMMO『OSO』でゴミスキルばかりを選んだユン。調合・鍛冶・付与・木工のセンスを組み合わせ、誰も作れない特殊な付与矢や軽量防具、補助ポーションを開発。トップギルドの戦士たちがこぞって買い求める超一流の生産職人へと登り詰めていく。',
        recommendReason: '地道な素材選定と試行錯誤から、プレイヤーの需要に応える最高の一品を作り上げるクラフトの純粋な楽しさが詰まっています。',
        points: [
          '不遇スキルのシナジーで誰も真似できない高品質アイテムを創り出す職人技',
          '露店での販売やトッププレイヤーたちとの信頼関係を築く生産職ライフ',
          '派手な戦闘よりもものづくりの探求をマイペースに楽しむリラックス感'
        ]
      },
      {
        keyword: 'とあるおっさんのＶＲＭＭＯ活動記',
        customTitle: 'とあるおっさんのＶＲＭＭＯ活動記',
        synopsis: '最新VRMMOであえて不遇スキルの【弓】【木工】【鍛冶】を選んだ38歳のアース。目立たず地道にオリジナル合成弓や頑丈なブーツ、料理を作っていたはずが、細部までこだわり抜いた職人武具が規格外の性能を発揮し、ゲーム内の有名人になってしまう。',
        recommendReason: '大人が仕事終わりに趣味に没頭するような、落ち着いたクラフトの魅力が全編に溢れています。試行錯誤で性能を高めていく過程が秀逸です。',
        points: [
          '誰も使わないハズレスキルを極めて独自の名工武具を生み出す職人の意地',
          '美味しい手料理や特製武具で仲間たちをサポートする大人の余裕',
          '妖精王やトップギルドからも一目置かれるアースの誠実な人柄'
        ]
      },
      {
        keyword: '神達に拾われた男',
        customTitle: '神達に拾われた男',
        synopsis: '異世界転生した心優しい少年竜馬。アイアンスライムやメタルスライムを育て上げ、彼らの特性を活かして頑丈な金属糸や硬質ナイフ、防水防刃の作業着を自作。スライムたちの力を借りた画期的な工房経営を展開していく。',
        recommendReason: 'スライムを単なる雑魚モンスターではなく、金属精錬や糸紡ぎのパートナーとして活用するユニークなクラフト発想が最高に楽しい作品です。',
        points: [
          'メタルスライムたちの特性を活かした独自鉱物加工と製品開発',
          '前世の苦労人が誠実に仕事に向き合い、街の人々に感謝される温かいドラマ',
          'ストレスフリーで読める、優しさと工夫に満ちた工房スローライフ'
        ]
      },
      {
        keyword: '異世界居酒屋「のぶ」',
        customTitle: '異世界居酒屋「のぶ」',
        synopsis: '居酒屋「のぶ」を支えるのは、大将が手入れを怠らない日本の鋼の包丁。古都アイテーリアの頑固な鍛冶職人やガラス職人が店を訪れ、大将の刃物の見事な研ぎ味や器の美しさに職人としてのプライドを刺激され、新たな名作を生み出していく。',
        recommendReason: '料理人の包丁さばきと、異世界の職人たちが互いの技量に敬意を払い高め合っていく職人同士の粋な人間ドラマに胸が熱くなります。',
        points: [
          '日本の包丁の切れ味と職人技が異世界の鍛冶師たちを唸らせるカルチャーショック',
          '美味しい料理と酒を通じて意気投合する職人たちの熱いモノづくり魂',
          '日々の手入れと真摯な仕込みが光る、落ち着いた大人の人情劇'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '鍛冶屋ではじめる異世界スローライフ',
        reason: '鉄と炎に向き合い、使う人の幸せを願って刃物を打つ職人魂の描写が最高峰。森の仲間たちとの穏やかな暮らしにも心底癒やされます。'
      },
      {
        rank: 2,
        title: '不遇職【鍛冶師】だけど最強です',
        reason: 'ハズレ職と見下されていた鍛冶師が神話級の武具や建物をサクサク創り出し、周囲を圧倒していく下剋上カタルシスが抜群です。'
      },
      {
        rank: 3,
        title: '転生したら剣でした',
        reason: '知性を持つ魔剣として自らを強化・鍛造しながら、愛娘フランと共に世界を切り拓いていく唯一無二のバディファンタジーです。'
      }
    ]
  },
  {
    slug: 'ts-gender-bender-fantasy-10',
    title: 'TS（性転換）・男から美少女転生おすすめラノベ10選【精神男×美少女・無自覚無双・波乱万丈】',
    metaTitle: 'TS・性転換おすすめ異世界ラノベ10選！中身おっさん×絶世の美少女転生＆無自覚無双まとめ',
    description: '中身は歴戦のゲーマーやおっさんなのに、外見は誰もが見惚れる絶世の銀髪美少女や幼女に！？男勝りな豪快ムーブと可憐な見た目のギャップ、周囲の勘違いと熱烈な求婚、そして圧倒的な実力無双！TS（性転換）ジャンルの最高峰傑作10選を徹底解説します。',
    eyecatchBadge: 'TS転生・性転換・美少女無双',
    faq: [
      {
        q: 'TS（性転換）モノの最大の魅力は何ですか？',
        a: '「中身の男らしい性格や思考」と「外見の可憐で美しい少女の姿」が生み出す唯一無二のギャップにあります。本人は男友達のノリで接しているのに、周囲の男性騎士や王子たちが胸キュンして悶絶したり、美少女の姿で敵軍を一撃粉砕する無双の爽快感が病みつきになります。'
      },
      {
        q: 'TSファンタジーの定番おすすめ作品は？',
        a: '老賢者が美少女になる『賢者の弟子を名乗る賢者』や、英雄王が可愛い見習い騎士になる『英雄王、武を極めるため転生す』、社畜が幼女軍人になる『幼女戦記』が3大名作です。'
      }
    ],
    items: [
      {
        keyword: '賢者の弟子を名乗る賢者',
        customTitle: '賢者の弟子を名乗る賢者',
        synopsis: 'VRMMOの九賢者「軍勢のダンブルフ」として名を馳せていた男・咲森鑑。課金アイテムの気まぐれで可憐な美少女アバターに変身した直後、ゲームの30年後の世界へ転移！老賢者の威厳を守るため「ダンブルフの弟子ミラ」を名乗り、「〜なのじゃ」と喋りながら、神話級の召喚魔法で世界中を冒険する。',
        recommendReason: '「わし、かわいい！」と自分の姿に惚れ惚れしつつ、中身は完全に老賢者（わし）というコミカルなギャップと、軍隊を一瞬で消滅させる最高位召喚術のスケール感が最高です！',
        points: [
          '可憐な銀髪美少女ミラと、中身の老賢者のコミカルで愛らしいギャップ',
          '神獣や英霊を自在に使役して戦場を支配する圧倒的な召喚魔法無双',
          '30年の間に変貌した世界と仲間たちの足跡を追う壮大な冒険活劇'
        ]
      },
      {
        keyword: '英雄王、武を極めるため転生す',
        customTitle: '英雄王、武を極めるため転生す 〜そして、世界最強の見習い騎士♀〜',
        synopsis: '巨大な王国を築き上げ「英雄王」と称えられた老王イングリス。女神の祝福を受け、「今世は国のためではなく、一人の武人として限界まで強さを極めたい！」と願って転生した先は、なんと美少女騎士見習い（♀）の肉体だった！可愛い見た目のまま、規格外の霊素（エーテル）を操り、強敵とのバトルに狂喜乱舞する。',
        recommendReason: '「可愛い美少女なのに中身は筋金入りの脳筋バトルジャンキー」というイングリスの突き抜けたキャラクターが爽快！圧倒的な武の極みで敵を一撃粉砕します。',
        points: [
          '絶世の美少女でありながら強敵との戦いとお肉をこよなく愛するイングリスの痛快さ',
          '騎士道精神と前世の王の知恵を兼ね備えた、頼もしすぎる最強の幼馴染ムーブ',
          '天恵武姫（ハイラル・メナス）や魔石獣を素手で叩き伏せる圧倒的エーテル無双'
        ]
      },
      {
        keyword: '幼女戦記',
        customTitle: '幼女戦記',
        synopsis: '冷徹な合理主義のエリートサラリーマンが、金髪碧眼の孤児ターニャ・デグレチャフとして魔法と硝煙の世界大戦へ転生。後方の安全な出世コースを目指すターニャだが、合理的な作戦立案と規格外の魔導適性が仇となり、常に最も過酷な最前線へ投入され「ラインの悪魔」と恐れられていく。',
        recommendReason: '中身のエリート男性の冷徹な思考と、幼女の姿で放つ圧倒的な爆撃魔導の破壊力！戦争のリアリズムと皮肉な運命のすれ違いが圧倒的な傑作です。',
        points: [
          'エリートサラリーマンの合理主義と思惑が裏目に出る皮肉な運命のドラマ',
          '幼女の愛らしい外見の裏に潜む、冷徹で狂気じみた「ラインの悪魔」のカリスマ',
          '近代軍事戦術と航空魔導戦闘が融合した圧倒的なミリタリーアクション'
        ]
      },
      {
        keyword: '自称悪役令嬢な婚約者の観察記録。',
        customTitle: '自称悪役令嬢な婚約者の観察記録。',
        synopsis: '天才王子セシルはある日、婚約者のバーティアから「私は悪役令嬢です！あなたを真実の愛へ導くため、立派に婚約破棄されてみせます！」と堂々宣言される。前世の記憶を持つバーティアのおバカで一生懸命な空回り行動を観察するうちに、退屈していた王子の心は彼女への深い愛へと変わっていく。',
        recommendReason: '悪役令嬢を目指しているのにどう見てもただのドジっ子で愛嬌抜群なバーティアと、それを楽しそうに愛でる腹黒王子の溺愛観察コメディの最高峰です！',
        points: [
          '悪役になりきれないバーティアの天真爛漫な可愛さと爆笑の空回り',
          '退屈な世界に飽きていた完璧王子セシルが彼女の虜になっていく極上ロマンス',
          '王子視点で語られるからこそ際立つ、ヒロインの愛らしさと周囲の温かさ'
        ]
      },
      {
        keyword: 'リアデイルの大地にて',
        customTitle: 'リアデイルの大地にて',
        synopsis: '病室で生命維持装置が停止し命を落とした少女・各務桂菜。目覚めると、プレイしていたVRMMO『リアデイル』の200年後の世界に、ハイエルフのアバター「ケーナ」として転生していた。限界突破した神話級魔力と大人の落ち着きで、自作のNPCの子供たちと再会しながら自由気ままな旅を送る。',
        recommendReason: '伝説の最強プレイヤーとしての圧倒的な貫禄と、各地の美味しいお酒や郷土料理を味わう穏やかなスローライフのバランスが絶妙な癒やし大作です。',
        points: [
          '200年後の世界で神話と崇められる最強ハイエルフ・ケーナの圧倒的魔力',
          '成長した我が子たち（エルフ、ドワーフ、人間）との心温まる家族関係',
          'マイペースに世界を旅しながらトラブルをサクッと解決する安心感'
        ]
      },
      {
        keyword: '乙女ゲー世界はモブに厳しい世界です',
        customTitle: '乙女ゲー世界はモブに厳しい世界です',
        synopsis: '妹に無理やり乙女ゲームを攻略させられた後に事故死した男。女尊男卑のゲーム世界にモブ男爵リオンとして転生するが、実はゲーム内の「裏主人公」や聖女の運命、転生者たちの思惑が交錯。前世のゲーマー知識とチートAIルクシオンを駆使して理不尽をぶち壊す。',
        recommendReason: '性格の悪い主人公が、傲慢なイケメン王子や腐敗貴族を完膚なきまでに煽り倒してボコボコにする痛快無比なド外道サクセスストーリーです！',
        points: [
          '理不尽な女尊男卑社会を、ロストアイテムの圧倒的軍事力でぶち壊す爽快感',
          '敵を徹底的に煽り倒すリオンの痛快なゲス顔ムーブと毒舌AIの掛け合い',
          '悪役令嬢や気弱なヒロインたちをさりげなく救うリオンの隠れた男気'
        ]
      },
      {
        keyword: '蜘蛛ですが、なにか？',
        customTitle: '蜘蛛ですが、なにか？',
        synopsis: '女子高生だった「私」が転生したのは、大迷宮の底で孵化した最弱の蜘蛛モンスター！持ち前の超絶ポジティブ思考と一人語りで、毒と糸と知恵を駆使して格上の凶悪魔物をハメ倒し、多段階進化を繰り返して世界の頂点（神）へと登り詰めていく。',
        recommendReason: '「私（蜘蛛子）」の超ハイテンションなモノローグと、過酷すぎる迷宮サバイバルのギャップが中毒性抜群！緻密な世界設定と驚愕の伏線回収に圧倒されます。',
        points: [
          'テンションMAXの軽快な一人語りと、一歩間違えれば即死の極限サバイバル',
          'レベルアップと進化ツリーを駆け上がるゲームライクな育成・戦闘の面白さ',
          '物語後半に明かされる世界の真実と転生者たちの壮絶な運命のドラマ'
        ]
      },
      {
        keyword: '転生したらスライムだった件',
        customTitle: '転生したらスライムだった件',
        synopsis: '通り魔に刺されて死んだ37歳の独身サラリーマン三上悟。異世界で最弱モンスターの「スライム（リムル）」として転生！人化スキルで銀髪金眼の美少女のような姿を手に入れ、多種族が平和に共存する巨大国家テンペストを建国していく。',
        recommendReason: '愛らしいスライム＆美少女の姿と、敵対勢力を一瞬で消滅させる規格外の魔王パワーのギャップが爽快！多種族をまとめる大人の包容力も魅力です。',
        points: [
          '最弱スライムから世界の頂点に立つ魔王へと上り詰める圧巻の成り上がり',
          '銀髪美少女の姿と中身のおっさんサラリーマンの親しみやすいキャラクター',
          '荒れ野から最新鋭の理想都市を築き上げる建国・内政のワクワク感'
        ]
      },
      {
        keyword: '陰の実力者になりたくて！',
        customTitle: '陰の実力者になりたくて！',
        synopsis: 'モブとして日常を送りつつ裏で全てを支配する「陰の実力者」を目指すシド・カゲノー。自作の厨二病設定が世界の真実と完全一致し、本人はごっこ遊びのつもりで放った奥義で都市ごと敵を消滅させ、配下の精鋭美女軍団から絶対の主として崇拝される。',
        recommendReason: 'スタイリッシュな無双アクションと、最高峰のすれ違い勘違いコメディの融合！シドのブレない厨二病美学に大爆笑しながらスカッとできます。',
        points: [
          '適当なハッタリが全て世界の真実と的中してしまう神がかったすれ違いプロット',
          'モブに徹する日常と、夜の絶対強者シャドウとしての圧倒的無双のギャップ',
          '配下の美少女集団シャドウガーデンの盲信的な崇拝とカッコよさ'
        ]
      },
      {
        keyword: '魔王学院の不適合者',
        customTitle: '魔王学院の不適合者 〜史上最強の魔王の始祖、転生して子孫たちの学校へ通う〜',
        synopsis: '2000年前に神々すら圧倒した暴虐の魔王アノス。転生後の魔王学院で測定不能のため「不適合者」とされるが、「殺したくらいで、俺が死ぬとでも思ったか？」と常識外れの力で理不尽を粉砕し、真の始祖としての威厳を見せつける。',
        recommendReason: 'どんな絶望も世界の理すらも格の違いで一瞬でねじ伏せるアノス様のカリスマ性が圧巻！家族思いで器の大きい真の覇者の姿に惚れ惚れします。',
        points: [
          '心臓の鼓動だけで敵を倒すなど、常識を遥かに超越したアノス様の神話級無双',
          '理不尽な差別に苦しむ仲間を救い、真の王として導く圧倒的な器量',
          '2000年前に隠された悲劇の真相と謀略を力と知性で暴くカタルシス'
        ]
      }
    ],
    ranking: [
      {
        rank: 1,
        title: '賢者の弟子を名乗る賢者',
        reason: '「わし、かわいい！」の老賢者マインドと可憐な銀髪美少女ミラのギャップが完璧。召喚術で軍隊を薙ぎ払う圧倒的スケールの無双が最高峰です。'
      },
      {
        rank: 2,
        title: '英雄王、武を極めるため転生す 〜そして、世界最強の見習い騎士♀〜',
        reason: '絶世の美少女でありながらバトルジャンキーな英雄王イングリスの痛快な無双劇。強敵を素手で叩き伏せる爽快感が抜群です。'
      },
      {
        rank: 3,
        title: '幼女戦記',
        reason: 'エリート男性の冷徹な合理主義と幼女軍人のビジュアルが織りなす本格ミリタリー戦記。世界大戦の最前線を切り拓く迫力は唯一無二です。'
      }
    ]
  }
]

async function enrichAndSave() {
  const featuresPath = path.join(root, 'public/data/curated-features.json')
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'))

  for (const feature of batchFeaturesPart1) {
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
  console.log(`\nBatch features part 1 successfully fetched and updated! Total features: ${features.length}`)
}

await enrichAndSave()
