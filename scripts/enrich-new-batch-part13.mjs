import fs from 'fs';
import path from 'path';
import https from 'https';

const APP_ID = '1016335345703901726';
const AFFILIATE_ID = '4e2b85e0.0c7104b9.4e2b85e1.a0280eb4';
const FEATURES_JSON_PATH = path.resolve('public/data/curated-features.json');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function searchRakuten(keyword) {
  console.log(`Searching Rakuten API for keyword: "${keyword}"...`);
  // 1. Kobo Ebook
  const koboUrl = `https://app.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?format=json&applicationId=${APP_ID}&affiliateId=${AFFILIATE_ID}&title=${encodeURIComponent(keyword)}&hits=1&sort=standard`;
  try {
    const res = await fetchJson(koboUrl);
    if (res.Items && res.Items.length > 0) {
      const item = res.Items[0].Item;
      console.log(`  -> Found Kobo: ${item.title} (${item.author})`);
      return {
        title: item.title,
        author: item.author || '不明',
        itemPrice: item.itemPrice,
        itemUrl: item.affiliateUrl || item.itemUrl,
        mediumImageUrl: item.mediumImageUrl || item.largeImageUrl || '',
        largeImageUrl: item.largeImageUrl || item.mediumImageUrl || '',
        itemCaption: item.itemCaption || '',
        publisherName: item.publisherName || 'Kobo'
      };
    }
  } catch (err) {
    console.error(`  Kobo error for ${keyword}:`, err.message);
  }

  await sleep(1050);

  // 2. Books Total Search
  const booksUrl = `https://app.rakuten.co.jp/services/api/BooksTotal/Search/20170404?format=json&applicationId=${APP_ID}&affiliateId=${AFFILIATE_ID}&keyword=${encodeURIComponent(keyword)}&hits=1&sort=standard`;
  try {
    const res = await fetchJson(booksUrl);
    if (res.Items && res.Items.length > 0) {
      const item = res.Items[0].Item;
      console.log(`  -> Found Books: ${item.title} (${item.author})`);
      return {
        title: item.title,
        author: item.author || '不明',
        itemPrice: item.itemPrice,
        itemUrl: item.affiliateUrl || item.itemUrl,
        mediumImageUrl: item.mediumImageUrl || item.largeImageUrl || '',
        largeImageUrl: item.largeImageUrl || item.mediumImageUrl || '',
        itemCaption: item.itemCaption || '',
        publisherName: item.publisherName || '楽天ブックス'
      };
    }
  } catch (err) {
    console.error(`  Books error for ${keyword}:`, err.message);
  }

  return null;
}

const batchPart13 = [
  {
    slug: "isekai-magic-scholar-theory-research-10",
    title: "魔術研究・魔法理論チートおすすめ異世界ラノベ10選【数理魔導・術式解析・新魔法創造】",
    description: "詠唱を数式やプログラムとして再構築！魔力の流動構造を徹底解明し、誰も見たことのない新術式や古代魔導を創造するおすすめ魔術研究者・魔法理論チート異世界ラノベ10選を徹底解説。",
    category: "魔術研究・魔法理論",
    leadText: "「常識とされていた呪文詠唱の無駄を削ぎ落とし、最短最速の数理コードで魔法を再構築する」「失われた古代魔導の理論を解読し、規格外の新属性を創出する」——魔術研究・魔法理論ファンタジーは、知的好奇心を刺激する緻密な魔法設定と、研究者ならではのロジカルな無双劇が最大の魅力です。知性派ファン必読の傑作10選をお届けします。",
    searchQueries: [
      "魔術研究 ラノベ おすすめ",
      "魔法理論 術式解析 チート 小説 なろう",
      "プログラミング 魔法 数式 異世界",
      "魔法学者 魔導具 開発 ファンタジー"
    ],
    items: [
      {
        keyword: "ナイト＆マジック",
        rank: 1,
        hook: "【プログラミング×魔法演算】天才SEが魔法術式をソースコードとして最適化し世界を変革！",
        detailedReview: "重度のメカオタクにして天才プログラマーだった青年エルネスティ。異世界転生後、魔法がバイナリコードやスクリプト言語に似た構造を持つことを見抜き、魔法術式の論理記述を劇的に短縮・最適化。世界初の巨大人型兵器用新型推進機関や多重詠唱システムを自作し、歴史を書き換える名作です。"
      },
      {
        keyword: "賢者の孫",
        rank: 2,
        hook: "【現代物理学×イメージ魔法】化学反応と原子構造の理解で常識外れの無詠唱魔法を量産！",
        detailedReview: "大賢者に育てられたシン・ウォルフォード。魔法の威力が詠唱ではなく「術者の物理イメージ」で決まることを理解し、水素と酸素の燃焼、熱膨張、大気圧の圧縮などを組み合わせて天変地異級の魔法を無詠唱で次々と開発。魔法理論のブレイクスルーを巻き起こします。"
      },
      {
        keyword: "マジック・メイカー",
        rank: 3,
        hook: "【魔法不在世界での新魔法開発】体内の不可視エネルギーを観測し、火・水・風の現象をゼロから構築！",
        detailedReview: "魔法に強い憧れを持ちながら転生したシオン。しかし転生先の世界には魔法が存在しなかった。彼は諦めずに人体の気の巡りを観測し、熱運動や気流の法則を試行錯誤して世界で初めて「魔法」と呼ばれる現象を発明。知的好奇心と研究への情熱が心を揺さぶる傑作です。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 4,
        hook: "【魔導素材の特性研究】魔物の皮や魔石の性質を科学的発想で組み合わせ革新的な道具を発明！",
        detailedReview: "魔導具師のダリヤ・ロセッティ。前世の家電や生活用品の構造をヒントに、水属性・風属性魔石の出力バランスや魔物素材の耐熱・防水特性を緻密に研究。ドライヤーや人工炭酸水、遠征用コンロなど、世界を豊かにする新魔導具を次々と世に送り出します。"
      },
      {
        keyword: "無職転生",
        rank: 5,
        hook: "【幼少期からの無詠唱魔力鍛錬】魔力総量の限界突破と複合魔術の精密操作ロジック！",
        detailedReview: "赤ん坊ルーデウスの徹底した魔力鍛錬。身体の成長期に魔力を使い切ることで魔力総量を爆発的に増やし、水と火を融合させて雲を作り雷を落とす気象魔術など、自然科学の原理を魔力操作に組み込んだ理論派魔術の最高峰です。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 6,
        hook: "【陰陽五行説による魔法の凌駕】西洋魔術の理を東洋の呪術理論で完全解読・無力化！",
        detailedReview: "朝廷最強の陰陽師だったセイカ。異世界の属性魔法に対し、東洋の陰陽五行（木火土金水）と相生・相剋の理論を適用。相手の火属性魔法を水気で封じ、土気で金属魔法を制御するなど、異世界の魔導学者たちが理解不能な絶対の理論優位を確立します。"
      },
      {
        keyword: "異世界薬局",
        rank: 7,
        hook: "【分子構造の視覚化による物質創造】元素周期表と分子模型を脳内に展開する究極の化学魔導！",
        detailedReview: "宮廷薬師ファルマの物質創造能力。ただ願うのではなく、物質の正確な化学式・分子構造を脳内で精密にイメージすることで、水銀や抗菌剤、ステロイドなどを誤差なく生成。魔力と近代薬理学を完全融合させた学術的ファンタジーです。"
      },
      {
        keyword: "オーバーロード",
        rank: 8,
        hook: "【718種に及ぶ魔導体系の熟知】ゲームシステムの魔術体系と異世界の原始魔法（ワイルドマジック）の分析！",
        detailedReview: "死の支配者アインズ。第1位階から第10位階、そして超位階魔法に至る膨大な魔法知識を完璧に把握し、敵の属性耐性、バフ、デバフ、詠唱中断のタイミングをミリ秒単位で計算して戦局を支配する、究極の魔導マスターの戦術が光ります。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 9,
        hook: "【深層魔導と根源融合】神々の作った魔法法則すら再定義する魔王の深淵なる術理！",
        detailedReview: "二千年前の魔王アノス。子孫たちが形骸化させた魔法術式を一目で看破・修正し、失われた古代の起源魔法や根源再生魔法を自在に操る。魔法の根本原理を極めた者だけが見せる圧倒的な術式解説と無双が痛快です。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 10,
        hook: "【ナノマシンとの対話と物理干渉】魔法の本質であるナノマシンに直接物理命令を送信！",
        detailedReview: "マイルが使う魔法の正体は、大気中に充満する古代ナノマシンへの思考命令。現代の素粒子物理学や化学結合の知識をナノマシンに指示することで、従来の詠唱呪文ではあり得ない超高密度レーザーや絶対零度凍結を瞬時に引き起こします。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-shield-tank-defense-10",
    title: "盾役・タンク・鉄壁防御おすすめ異世界ラノベ10選【防御極振り・無傷の要塞・パリィ無双】",
    description: "攻撃力ゼロでも絶対に倒れない！防御力特化、ヘイト管理、神速パリィ、状態異常完全無効で敵の絶望を誘うおすすめ盾役・タンク無双異世界ラノベ10選を徹底紹介。",
    category: "盾役・タンク・防御特化",
    leadText: "「どんな神話級ドラゴンのブレスもかすり傷一つ負わずに受け止める」「パーティの全ダメージを肩代わりして味方を完封勝利へ導く」——盾役・タンク特化ファンタジーは、敵の最大火力を涼しい顔で弾き返す鉄壁の安心感と、理不尽な攻撃を完封する爽快感が最大の魅力です。要塞の如き頼もしさを誇る傑作10選を厳選しました。",
    searchQueries: [
      "盾役 タンク ラノベ おすすめ",
      "防御特化 異世界 小説 なろう",
      "防振り 類似作品 盾の勇者 タンク無双",
      "パリィ 鉄壁要塞 チート ファンタジー"
    ],
    items: [
      {
        keyword: "痛いのは嫌なので防御力に極振りしたいと思います。",
        rank: 1,
        hook: "【防御極振りの歩く要塞】ダメージゼロ！痛覚ゼロ！あらゆる攻撃を無効化する天然少女！",
        detailedReview: "VRMMO『NewWorld Online』を始めた初心者メイプル。痛いのが嫌という理由でステータスを【防御力（VIT）】に全振りした結果、モンスターの噛みつきも毒も魔法も一切効かない超絶要塞へと成長。大盾で敵をすり潰し、ヒドラを喰らい尽くして毒無効と悪食スキルを獲得していく痛快無比な防振り伝説です。"
      },
      {
        keyword: "盾の勇者の成り上がり",
        rank: 2,
        hook: "【憤怒の盾と絶対防御】攻撃手段を持たない盾の勇者が、仲間を守り抜く鉄壁の守護神へ！",
        detailedReview: "四聖勇者の中で唯一攻撃用武器を持てない「盾の勇者」岩谷尚文。冤罪と差別に抗いながら、多種多様な魔獣の素材を盾に吸収させて防御特性・反撃特性を開放。仲間を命がけで守る絶対障壁と、理不尽な世界への怒りを力に変える重厚な成り上がり巨編です。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 3,
        hook: "【紙一重の神速パリィ】防具なしの一撃死スリルを極限のジャスト回避と弾きで制す！",
        detailedReview: "防具を装備せず身軽さ特化で挑むサンラク。敵の超高速・超広範囲の必殺技をミリ単位で見切り、双剣やバックラーによるジャストパリィで攻撃を無力化して隙を作り出す、究極のテクニカル・ディフェンスアクションです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 4,
        hook: "【神聖大盾と全身甲冑の要塞】天変地異の攻撃をも仁王立ちで弾き返す全身骨格の聖騎士！",
        detailedReview: "ゲームアバターの全身重装甲冑と巨大シールドを装備した骸骨騎士アーク。ドラゴン級の咆哮や敵軍の一斉射撃を大盾一枚で涼しい顔で受け止め、神聖障壁で周囲の仲間を完全防護する頼もしすぎる鉄壁の守護者です。"
      },
      {
        keyword: "オーバーロード",
        rank: 5,
        hook: "【絶対守護神アルベド＆漆黒のアルミニウム】物理攻撃完全無効とダメージ転送の極致！",
        detailedReview: "ナザリック地下大墳墓の守護者統括アルベドは、最高峰の防御特化型タンク。神話級の武器攻撃すら鎧で受け流し、アインズへのダメージを身代わりで引き受ける鉄壁の防壁として機能。アインズ自身も低位魔法・低位物理攻撃の完全無効化パッシブを誇ります。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 6,
        hook: "【金剛発勁と超重力障壁】肉体硬化と重力魔法で神の使徒の光線すら跳ね返す！",
        detailedReview: "奈落の底で魔物の肉を喰らい肉体を極限まで強化したハジメ。スキル【金剛】による皮膚の超硬化と、自作した重力シールド・対物バリアによって、神の軍勢による大爆撃を無傷で突破する圧倒的な突破力を発揮します。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 7,
        hook: "【木の棒での完全見切り】全方位の攻撃を歩法と受け流しで無力化する神速のぼっち！",
        detailedReview: "防具もチートも持たない遥。しかし極限まで鍛え上げた気配察知と受け流し技術により、大迷宮のモンスターたちの猛攻を木の棒一本で全て受け流し、敵同士を激突させて自滅させる究極の回避・防御戦術を展開します。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 8,
        hook: "【攻撃させない究極の先手防御】麻痺と睡眠で敵の攻撃行動そのものを完全凍結！",
        detailedReview: "三森灯火の防御思想は「攻撃を食らう前に相手の身体機能を完全停止させること」。超高速の魔獣や一撃必殺の勇者であっても、先手で【パラライズ】を叩き込み、一切の攻撃機会を与えずに無力化する絶対的制圧ディフェンスです。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 9,
        hook: "【物理・自然影響完全無効】痛覚無効、熱変動無効、電流耐性を備えた無敵のスライムボディ！",
        detailedReview: "リムルのスライムボディは【物理攻撃耐性】【痛覚無効】【熱変動耐性】【電流耐性】などのパッシブスキルで固められており、通常攻撃が一切通用しない。さらに【暴食之王（ベルゼビュート）】で敵の攻撃エネルギーそのものを飲み込んで無力化します。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 10,
        hook: "【概念防御と不滅の根源】世界が滅びても根源が滅びない始祖の絶対的不死防御！",
        detailedReview: "「心臓を潰されたくらいで、俺が死ぬとでも思ったか？」の名言で知られるアノス。心臓を貫かれようと、世界を消滅させる魔法を浴びようと、根源そのものが滅びない限り一瞬で再生する、防御の概念を超越した絶対の存在です。"
      }
    ]
  }
];

async function enrichPart13() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart13) {
    console.log(`\n=== Fetching Rakuten data for feature: [${feature.slug}] ${feature.title} ===`);
    const enrichedItems = [];

    for (const item of feature.items) {
      const rakutenData = await searchRakuten(item.keyword);
      await sleep(1100);

      enrichedItems.push({
        rank: item.rank,
        title: rakutenData?.title || item.keyword,
        author: rakutenData?.author || '不明',
        itemPrice: rakutenData?.itemPrice || null,
        itemUrl: rakutenData?.itemUrl || 'https://books.rakuten.co.jp/',
        mediumImageUrl: rakutenData?.mediumImageUrl || '',
        largeImageUrl: rakutenData?.largeImageUrl || '',
        publisherName: rakutenData?.publisherName || '',
        hook: item.hook,
        detailedReview: item.detailedReview
      });
    }

    const featureObj = {
      slug: feature.slug,
      title: feature.title,
      description: feature.description,
      category: feature.category,
      leadText: feature.leadText,
      searchQueries: feature.searchQueries,
      items: enrichedItems
    };

    const idx = existingFeatures.findIndex((f) => f.slug === feature.slug);
    if (idx !== -1) {
      existingFeatures[idx] = featureObj;
    } else {
      existingFeatures.push(featureObj);
    }
  }

  fs.writeFileSync(FEATURES_JSON_PATH, JSON.stringify(existingFeatures, null, 2), 'utf-8');
  console.log(`\nBatch features part 13 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart13().catch(console.error);
