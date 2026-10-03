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

const batchPart8 = [
  {
    slug: "isekai-reincarnated-as-mob-character-10",
    title: "モブ転生・脇役からの下剋上おすすめ異世界ラノベ10選【主役喰い・原作改変・平穏志望の勘違い無双】",
    description: "主人公でも悪役でもない『名もなきモブキャラ』に転生！ゲーム知識や前世の記憶を駆使して死亡フラグをへし折り、平穏を望みながらも気付けば世界を救ってしまうおすすめモブ転生ラノベ10選を徹底解説。",
    category: "モブ転生・脇役成り上がり",
    leadText: "「乙女ゲームやRPGの背景にいるモブキャラに転生した」「メインキャラに関わらず平穏に暮らしたいのに、行動の全てが規格外すぎて目立ってしまう」——モブ転生ファンタジーは、原作のストーリーを知り尽くした知識チートと、本人の意図とは裏腹に英雄へ祭り上げられる勘違い劇の快感が最大の魅力です。読者の心を掴んで離さない傑作10選をお届けします。",
    searchQueries: [
      "モブ転生 ラノベ おすすめ",
      "脇役 転生 小説 なろう",
      "モブキャラ 勘違い 異世界 無双",
      "乙女ゲー モブ 下剋上 ラノベ"
    ],
    items: [
      {
        keyword: "乙女ゲー世界はモブに厳しい世界です",
        rank: 1,
        hook: "【女尊男卑のモブ貴族】前世で妹にやらされた乙女ゲーの知識とロストアイテムで大暴れ！",
        detailedReview: "女尊男卑が極まる理不尽な乙女ゲーム世界に、田舎の貧乏男爵家のモブ男子リオンとして転生。結婚相手に財産を奪われ奴隷同然の人生を歩まされる未来を回避するため、ゲーム知識を総動員して最強のロストアイテム（宇宙船・搭乗型人型機動兵器ルクシオン）を発掘。高飛車な攻略対象のイケメン王子たちを煽り散らしながら圧倒的火力で叩きのめす痛快無比な名作です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 2,
        hook: "【究極のモブ演技と勘違い】モブAに徹しながら深夜に『陰の実力者』として無双する！",
        detailedReview: "主人公でも黒幕でもなく、「普段は目立たない平凡なモブでありながら裏で全てを操る存在」に憧れるシド・カゲノー。魔力のある異世界へ転生後、昼は徹底した『モブAの立ち回り』を完璧に演じ、夜は漆黒の外套を纏うシャドウとして暗躍。彼が適当についた嘘の設定が実は世界の真実であり、配下のシャドウガーデンが世界を牛耳っていく爆笑必至の勘違いコメディです。"
      },
      {
        keyword: "嘆きの亡霊は引退したい",
        rank: 3,
        hook: "【才能ゼロのクランマスター】幼馴染たちが最強すぎて、何もしなくても神算鬼謀と称賛される！",
        detailedReview: "幼馴染たちとともにハンター（冒険者）を目指したものの、自分だけ才能が全く開花しなかったクライ・アンドリヒ。引退したいのに最強の幼馴染たちに祭り上げられ、帝都最強クランのリーダーに。彼の適当な発言やビビり行動が周囲の過大評価によって「全てを見通した神の一手」と解釈され、厄介な迷宮や事件が次々と解決していく究極の勘違いギャグファンタジーです。"
      },
      {
        keyword: "モブ高生の俺でも冒険者になれば",
        rank: 4,
        hook: "【現代ダンジョンの地味モブ】目立たない男子高校生が独自ステータスで影の最強探索者へ！",
        detailedReview: "世界中にダンジョンが出現した現代日本。クラスで地味なモブ高校生だった主人公が、誰も気づかない独自のスキルツリーと隠密スキルを開花させ、夜な夜な難関ダンジョンを単独踏破。クラスメイトや有名配信者たちが手こずるボスモンスターを影から一撃で粉砕していく、爽快な現代モブ下剋上ストーリーです。"
      },
      {
        keyword: "悪役令嬢の執事様",
        rank: 5,
        hook: "【破滅する悪役令嬢のモブ執事】最愛のお嬢様を断罪エンドから救うため世界中を敵に回す！",
        detailedReview: "乙女ゲーム世界の悪役令嬢ソフィアに仕えるモブ執事シリルとして転生。原作ではソフィアが処刑され自身も命を落とす運命を知ったシリルは、お嬢様を最高の幸せへ導くため、暗殺術から政治手腕、魔術開発まであらゆる能力を極限まで鍛え上げる。お嬢様への一途な忠誠心と、原作の傲慢なヒロインや王子を圧倒する知略戦が熱い傑作です。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 6,
        hook: "【貧乏領主の八男モブ】継承権皆無の立場から膨大な魔力で王国の中枢へ駆け上がる！",
        detailedReview: "領地も財産も回ってこない貧乏貴族の八男という、貴族社会における完全なモブ立場に転生したヴェンデリン。自立して平穏に生きるために魔力を鍛えていたところ、規格外の魔力量が発覚し、国家間の紛争や巨大竜討伐へと巻き込まれていく王道立身出世ファンタジーです。"
      },
      {
        keyword: "マジック・メイカー",
        rank: 7,
        hook: "【魔法が存在しない世界のモブ】前世の憧れから魔法をゼロから自作・開発する大研究！",
        detailedReview: "魔法に強い憧れを抱きながら死んだ男が、貴族の次男シオンとして転生。しかしその世界には魔法が存在しなかった。絶望するどころか「ないなら自分で創ればいい」と決意し、体内の魔力を感知して火・水・風の現象をゼロから再現。世界初の魔術師として歴史を塗り替えていく知的好奇心あふれる探求譚です。"
      },
      {
        keyword: "ティアムーン帝国物語",
        rank: 8,
        hook: "【ギロチン回避のモブ的保身】保身と自分ファーストの行動がなぜか『帝国の英知』と崇められる！",
        detailedReview: "革命によってギロチンで処刑されたわがまま皇女ミーアが、血染めの日記帳とともに12歳の過去へタイムリープ。二度と断罪されないため、保身と私利私欲のために動くが、周囲の優秀な側近や民衆がその行動を「民を思う高潔な深謀遠慮」と都合よく解釈。勘違いの連鎖で滅亡の運命を回避していく傑作歴史改変コメディです。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 9,
        hook: "【普通のモブ少女になりたい】神の平均値トラップで最強スペックを手に入れた少女の受難！",
        detailedReview: "「次の人生は普通の女の子（モブ）として生きたい」と願い、能力値を世界の平均にしてほしいと頼んだ主人公。しかし神様が算出した平均値は人類ではなく全生物の平均だったため、とんでもないチート幼女マイルが誕生。モブとして目立たず過ごそうとするのに、困った人を見捨てられず規格外の魔法を使ってしまう痛快冒険譚です。"
      },
      {
        keyword: "村人転生 最強のスローライフ",
        rank: 10,
        hook: "【名もなき村人Aの開拓】チートな生産・農業スキルで最果ての寒村を豊かに変革！",
        detailedReview: "勇者でも貴族でもなく、最果ての寒村に生まれた名もなき村人として転生。魔力操作と前世の知識を活かして土壌改良や新商品の開発を進め、村人たちと協力して豊かな村づくりを目指す。平穏を愛するモブ村人が、結果として国をも動かす存在になっていくハートフルなスローライフです。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-with-modern-knowledge-science-10",
    title: "現代知識・科学技術チートおすすめ異世界ラノベ10選【化学・物理・工業・文明開化無双】",
    description: "現代の科学・化学・物理・工学・医学の知恵を中世ファンタジー世界へ持ち込む！蒸気機関、鉄鋼、火薬、製紙、近代医療で文明を飛躍的に発展させるおすすめ科学技術チート異世界ラノベ10選を徹底紹介。",
    category: "現代知識・科学技術",
    leadText: "「魔法世界に化学反応や物理法則を持ち込んで威力を倍加させる」「紙や印刷技術、蒸気機関を導入して中世世界に産業革命を起こす」——現代知識・科学技術ファンタジーは、私たちが当たり前に知る科学の力が中世ファンタジー世界で驚異の奇跡として花開く知的な面白さが魅力です。文明発展の興奮を存分に味わえる至高の10選を厳選しました。",
    searchQueries: [
      "現代知識 異世界 ラノベ おすすめ",
      "科学チート 魔法 物理法則 小説 なろう",
      "産業革命 異世界転生 文明発展",
      "工学 化学 知識無双 ファンタジー"
    ],
    items: [
      {
        keyword: "本好きの下剋上",
        rank: 1,
        hook: "【印刷技術と製紙革命】本への偏愛がインク・植物紙・活版印刷の産業革命を引き起こす！",
        detailedReview: "本を愛するあまり、本のない世界で自ら本を作り出すことを決意したマイン。古代エジプトのパピルスやメソポタミアの粘土板から始まり、植物の繊維を用いた和紙の製造、植物性インクの開発、そして金属活字による活版印刷技術の確立まで、印刷文明の歴史を少女一人と職人たちの手で再現していく歴史的一大叙事詩です。"
      },
      {
        keyword: "異世界薬局",
        rank: 2,
        hook: "【分子構造と近代薬理学】元素記号をイメージして物質を創造！感染症と病魔を撲滅する！",
        detailedReview: "過労死した薬学研究者ファルマが、物質創造と消去の神術を授かって転生。分子構造式を頭の中で正確にイメージすることで、水銀や抗生物質、解熱鎮痛剤、消毒用エタノールなど現代の医薬品を自在に生成。顕微鏡の自作から病原菌の特定、検疫体制の確立まで、近代医学の叡智で中世の流行病を撃破していきます。"
      },
      {
        keyword: "賢者の孫",
        rank: 3,
        hook: "【物理法則×魔法の破壊力】水素爆発や熱膨張をイメージした魔法で従来の常識を消滅させる！",
        detailedReview: "前世の現代日本の記憶を持つ少年シン・ウォルフォード。魔法の威力は「術者のイメージ」に比例することを発見し、酸素と水素の燃焼による爆発、光の屈折や集光、大気圧の圧縮など、物理学・化学の知識を魔力に融合。従来の魔法使いが詠唱していた呪文を遥かに凌駕する天変地異級の無詠唱魔法を連発する痛快無双劇です。"
      },
      {
        keyword: "ナイト＆マジック",
        rank: 4,
        hook: "【重度のロボットオタクの工学革命】前世のプログラミングと機械工学で巨大人型兵器を創り出す！",
        detailedReview: "凄腕プログラマーにして重度のメカオタクだった青年が、巨大ロボット「シルエットナイト」が存在する異世界へ転生。前世のソフトウェア工学の知識で魔法演算コードを最適化し、機械工学の知識で新型の内骨格や新型推進機関を次々と開発。世界の兵器開発史を一人で数百年先へと進めてしまう大人気メカアクションファンタジーです。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 5,
        hook: "【生活を豊かにする魔導具開発】前世の家電知識と魔導素材を組み合わせて新商品を大ヒット！",
        detailedReview: "婚約破棄を契機に、自分の好きな魔導具作りに生きることを誓った女性職人ダリヤ。前世のドライヤーや小型冷蔵庫、防水布、人工炭酸水などの知識をヒントに、魔物の革や魔石を活用した革新的な生活魔導具を次々と発明。商会を立ち上げ、職人たちとともに暮らしを豊かにしていく温かなものづくりストーリーです。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 6,
        hook: "【現代資材と土木技術の導入】水車発電、土木建築用具、肥料で飢餓の農村を大救済！",
        detailedReview: "40億円の資産を背景に、ホームセンターや建材店からパイプ、セメント、農業用具、化学肥料を大量に異世界へ持ち込むカズラ。土木工学や農業の知識を活かして灌漑用水路を整備し、作物の収穫量を何倍にも引き上げることで、飢饉に苦しんでいた領地を一大穀倉地帯へと生まれ変わらせていきます。"
      },
      {
        keyword: "幼女戦記",
        rank: 7,
        hook: "【近代軍事理論と総力戦】エリートサラリーマンの合理主義が魔導大戦の戦局を支配する！",
        detailedReview: "徹底的な合理主義者だったエリートサラリーマンが、金髪碧眼の幼女ターニャとして魔導と銃火器が交錯する世界大戦下の帝国に転生。前世の近代軍事理論、サプライチェーン管理、クラウゼヴィッツの戦争論を駆使し、圧倒的な効率で敵国を殲滅していく重厚なミリタリー戦記です。"
      },
      {
        keyword: "ゲート 自衛隊 彼の地にて、斯く戦えり",
        rank: 8,
        hook: "【現代軍事力と近代文明の衝撃】戦車・戦闘機・通信網がファンタジー世界の軍勢を圧倒！",
        detailedReview: "銀座に突如開いた「門（ゲート）」の向こうに広がる特地（異世界）。派遣された自衛隊が、ドラゴンや魔法使い、中世騎士団の軍勢に対し、近代兵器の圧倒的な射程と火力、補給体制、そして医療・衛生技術で立ち向かう。科学技術と魔法文明の接触をリアルに描いた傑作ミリタリーファンタジーです。"
      },
      {
        keyword: "超人高校生たちは異世界でも余裕で生き抜くようです！",
        rank: 9,
        hook: "【各分野の天才高校生が集結】政治・科学・医療・発明で中世世界に超近代都市を建設！",
        detailedReview: "飛行機事故で異世界へ転落した7人の天才高校生たち。総理大臣、大発明家、名医、マジシャン、ジャーナリストなど各分野の頂点に立つ彼らが、中世レベルの異世界に原子力発電所や近代兵器、抗生物質を即座に導入し、悪徳貴族や帝国軍を圧倒していく超スケールの文明チートファンタジーです。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 10,
        hook: "【スライムの化学的応用】スライムの消化液や硬化液を研究して近代クリーニング店を開業！",
        detailedReview: "ブラック企業で過労死した男リョウマが、異世界の森でスライムたちの品種改良と生態研究に没頭。酸スライムの漂白作用、クリーナースライムの洗浄力、スティッキースライムの防水性を組み合わせ、異世界に前例のない画期的なクリーニング店やゴミ処理事業を展開していくユニークな科学応用スローライフです。"
      }
    ]
  }
];

async function enrichPart8() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart8) {
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
  console.log(`\nBatch features part 8 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart8().catch(console.error);
