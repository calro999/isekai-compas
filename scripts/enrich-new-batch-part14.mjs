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

const batchPart14 = [
  {
    slug: "isekai-reincarnated-dragon-slayer-dragon-rider-10",
    title: "竜騎士・ドラゴン育成・竜殺しおすすめ異世界ラノベ10選【最強竜種契約・竜騎士団・ドラゴンスレイヤー】",
    description: "最強の竜と絆を結び空を駆ける！ドラゴンの卵の孵化から始まる相棒育成、竜騎士としての無双、そして神話の邪竜を討伐するおすすめ異世界竜・ドラゴンラノベ10選を徹底解説。",
    category: "ドラゴン・竜騎士・竜殺し",
    leadText: "「最強の神話竜と契約して大空を自在に飛翔する」「卵から育て上げた相棒ドラゴンとともに大陸全土を駆け巡る」——ドラゴンをテーマにした異世界ファンタジーは、圧倒的なスケール感と人竜の深い絆、そしてドラゴンスレイヤーとしての熱き武勇伝が最大の魅力です。ロマンあふれる至高の10選をお届けします。",
    searchQueries: [
      "ドラゴン ラノベ おすすめ",
      "竜騎士 異世界 育成 小説 なろう",
      "竜殺し ドラゴンスレイヤー ファンタジー 名作",
      "ドラゴンの卵 転生 契約 ラノベ"
    ],
    items: [
      {
        keyword: "転生したらドラゴンの卵だった",
        rank: 1,
        hook: "【卵からの進化サバイバル】最弱ベビードラゴンから神話級の最凶竜へ進化ツリーを駆け上がる！",
        detailedReview: "森の中で一個の卵として転生した主人公。弱肉強食の過酷な世界で魔物を狩り、経験値を稼いで進化ツリーを選択。トカゲ同然の幼体から厄病子竜、邪竜、果ては天変地異を引き起こす神話級ドラゴンへと成長していく圧倒的進化育成ファンタジーです。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 2,
        hook: "【暴風竜ヴェルドラとの魂の友愛】封印された天災級ドラゴンと魂の絆を結ぶ建国譚！",
        detailedReview: "洞窟の最奥で勇者に封印されていた暴風竜ヴェルドラ。スライムとして生まれたリムルが彼と出会い、名前を贈り合って盟友に。ヴェルドラの莫大な魔素と加護を得たリムルが、やがてヴェルドラを体内で解析・解放し、世界最強の竜魔タッグとして君臨します。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 3,
        hook: "【最強覇王竜レフィとの同居生活】甘党の古代竜美少女と築くマイペースなダンジョン生活！",
        detailedReview: "魔王となったユキのダンジョンに突如現れたのは、世界最強の覇王竜レフィ。お菓子や絶品料理で餌付けした結果、人型美少女の姿で居座ることに。天変地異を起こす最強の竜が、主人公の前だけで見せる甘えたがりなギャップがたまらない名作です。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 4,
        hook: "【無敵の上位竜トモエが忠臣へ】圧倒的な幻術と空間支配力を持つ上位竜が時代劇オタクに！",
        detailedReview: "荒野で深澄真の前に立ちはだかった霧の上位竜シェン。真の底知れない莫大な魔力に心服し、主従契約を結んで「トモエ」と名乗る。時代劇と日本文化に心酔し、広大な亜空間『亜空』の管理を担う頼もしすぎる最強の相棒です。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 5,
        hook: "【暴食のピクシードラゴン】甘いケーキと高級肉に釣られて契約したドラちゃんの可愛さ！",
        detailedReview: "フェンリルのフェルに続いてムコーダの仲間に加わったピクシードラゴンのドラちゃん。手のひらサイズの可愛らしい姿ながら、神速の飛行と上位竜を屠る強力なブレスを放つ実力者。甘いお菓子が大好物な愛嬌満点のドラゴンです。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 6,
        hook: "【迷宮の主たる竜との遭遇】竜に喰われたことで始まった不死者の進化ロード！",
        detailedReview: "銅級冒険者レントの運命を狂わせた、迷宮の未踏破区域に君臨する巨大竜。竜に喰われスケルトンとなったレントが、いつか竜に届く高みを目指し、存在進化を繰り返しながら迷宮の深淵へ挑む重厚なダークファンタジーです。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 7,
        hook: "【古竜との知恵比べと討伐】世界の最強種である古竜を少女一人で手玉に取る痛快劇！",
        detailedReview: "人類の数千倍のスペックを持つマイル。人語を解し傲慢に振る舞う古代の最強竜（古竜）に対し、圧倒的な魔力砲と機転で完膚なきまでに叩きのめし、思わず古竜側が土下座して命乞いしてしまう爆笑の竜討伐コメディです。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 8,
        hook: "【不死古代竜の成仏討伐】王都を震撼させた巨大アンデッドドラゴンを一撃で浄化！",
        detailedReview: "魔導飛行船を襲撃した巨大な古代竜のアンデッド。王都の騎士団や魔導士たちが絶望する中、少年ヴェンデリンが放った聖魔法の超光線によって一瞬で成仏・浄化。この偉業によって一躍国の英雄へと駆け上がります。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 9,
        hook: "【神話級ユニーク竜・深淵のクアッド】理不尽な超高難度ボス竜に挑む超絶プレイヤースキル！",
        detailedReview: "世界観の根幹を担う七大最強種や神話竜たち。サンラクたちトッププレイヤーが、一撃死確定の広範囲ブレスや飛行ギミックを緻密な連携と反射神経で攻略していく、ゲーマー必読の超熱血バトルです。"
      },
      {
        keyword: "転生したらドラゴンの幼女だった",
        rank: 10,
        hook: "【神竜幼女のまったりスローライフ】人智を超えた強大さと愛らしさが共存する癒やしの世界！",
        detailedReview: "最強のドラゴンとしてのスペックを持ちながら、幼女の姿で生まれた主人公。ブレス一発で山を消し飛ばす圧倒的パワーを持ちながらも、森の仲間たちと美味しい果物を食べたりお昼寝したりする極上の癒やし系ファンタジーです。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-archer-gunner-sniper-10",
    title: "弓使い・ガンナー・狙撃手おすすめ異世界ラノベ10選【超長距離狙撃・不可視の魔弓・弾幕無双】",
    description: "数キロ先の敵を不可視の魔矢や電磁加速銃で撃ち抜く！前衛の死角から戦局を完全に支配するおすすめ弓使い・スナイパー・ガンナー異世界ラノベ10選を徹底紹介。",
    category: "弓使い・ガンナー・狙撃",
    leadText: "「近接攻撃しか持たない敵を、視界外の遥か遠方から一方的に射抜く」「魔力を込めた追尾矢や電磁加速弾で軍勢を一掃する」——遠距離狙撃・ガンナーファンタジーは、圧倒的な射程優位と冷静沈着なターゲットロックがもたらす爽快感が最大の魅力です。研ぎ澄まされた命中率を誇る傑作10選を厳選しました。",
    searchQueries: [
      "弓使い ラノベ おすすめ",
      "ガンナー 狙撃手 異世界 小説 なろう",
      "スナイパー ライフル 転生 チート",
      "遠距離攻撃 弓術 魔弓 ファンタジー"
    ],
    items: [
      {
        keyword: "ありふれた職業で世界最強",
        rank: 1,
        hook: "【電磁加速対物ライフル】数キロ先から神の使徒を撃ち抜く超長距離レールガン狙撃！",
        detailedReview: "南雲ハジメが錬成した超大型対物ライフル「シュラーゲン」。電磁加速によって音速を遥かに超える弾丸を撃ち出し、視界外の遠距離から敵国の幹部や巨大魔物の頭部を正確無比に消滅させる、スナイパーガンナー無双の金字塔です。"
      },
      {
        keyword: "世界最高の暗殺者、異世界貴族に転生する",
        rank: 2,
        hook: "【弾道計算×重力魔術ライフル】地球の最新狙撃技術で勇者すら射程圏内に収めるプロの技！",
        detailedReview: "ルーグ・トウアハーデが開発した魔導スナイパーライフル。風速、湿度、コリオリの力を考慮した精密な弾道計算と、重力魔術による超加速弾を組み合わせ、数十キロ離れた上空の標的をも確実に仕留めるプロの暗殺狙撃術が圧巻です。"
      },
      {
        keyword: "魔弾の王と戦姫",
        rank: 3,
        hook: "【伝説の黒弓の射手】百発百中の神技弓術で戦国の戦況を一変させる若き領主！",
        detailedReview: "弓を侮る貴族社会の中で、家伝の卓越した弓術を極めたティグルヴルムド。黒弓の秘められた力と驚異的な動体視力・空間把握力により、敵軍の総大将や竜騎兵を遥か遠方から射抜く本格派弓兵戦記の傑作です。"
      },
      {
        keyword: "幼女戦記",
        rank: 4,
        hook: "【高高度航空魔導狙撃】上空数千メートルからの光弾狙撃で敵航空部隊を殲滅！",
        detailedReview: "ターニャ・デグレチャフが振るう九七式魔導歩槍。高高度の気流を計算し、術式を込めた超長距離光弾で敵の指揮所や航空魔導士を正確無比に撃ち落とす、冷徹な軍事スナイパーアクションの最高峰です。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 5,
        hook: "【精密エイムと弱点特効】初見ボスの極小弱点を確実に撃ち抜くテクニカル射撃！",
        detailedReview: "銃器や弓矢を扱うプレイヤーたちの緻密なエイム力。敵の弱点部位（コアや関節）をミリ単位で狙い撃ち、部位破壊や体勢崩しを引き起こして勝利を手繰り寄せるリアル志向の遠距離アクションが熱い作品です。"
      },
      {
        keyword: "ゲート 自衛隊 彼の地にて、斯く戦えり",
        rank: 6,
        hook: "【対物狙撃銃と機関銃の弾幕】中世騎士団の突撃をアウトレンジから完全に粉砕！",
        detailedReview: "特地に派遣された自衛隊の狙撃班。12.7mm対物ライフルによる超長距離狙撃でドラゴンの目を撃ち抜き、中距離の弾幕射撃で敵の突撃を寄せ付けない、現代銃火器の圧倒的射程アドバンテージを描きます。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 7,
        hook: "【全方位オート追尾魔弓】木の棒から放たれる無数の魔力矢が視界の敵を殲滅！",
        detailedReview: "ゴミスキルを組み合わせた遥の遠距離攻撃。放った魔力弾が敵の回避行動を先読みして自動追尾し、森の木々をすり抜けて魔獣の急所を撃ち抜く、トリッキーかつ爽快な遠距離シューティング無双です。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 8,
        hook: "【不可視の状態異常遠距離付与】視認しただけで射程無制限に敵を麻痺・毒殺！",
        detailedReview: "三森灯火の状態異常スキルは、物理的な弾丸や矢を必要とせず、視界内に捉えた敵へダイレクトに必中効果を付与。相手の間合いの外側から一切の反撃を許さずに無力化する究極の遠距離制圧です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 9,
        hook: "【スライム糸による全方位遠隔切断】不可視のワイヤーと弾丸で敵拠点を瞬時に制圧！",
        detailedReview: "シャドウが操るスライムマテリアルの極細ワイヤー。数百メートル四方に張り巡らせた見えない糸で敵軍の武器や首を一瞬で刈り取り、スライム弾による遠距離狙撃で黒幕を粉砕するスタイリッシュガン＆ワイヤーアクションです。"
      },
      {
        keyword: "賢者の孫",
        rank: 10,
        hook: "【集光レーザー魔導狙撃】太陽光と魔力をレンズ効果で収束させた超光速狙撃！",
        detailedReview: "シンが開発した光学魔術。物理法則を応用し、光を一点に集光させて超高熱の不可視レーザーとして射出。数キロ先の標的を一瞬で蒸発させる、科学知識を融合させた究極の遠距離攻撃です。"
      }
    ]
  }
];

async function enrichPart14() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart14) {
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
  console.log(`\nBatch features part 14 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart14().catch(console.error);
