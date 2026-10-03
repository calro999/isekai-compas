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

const batchPart23 = [
  {
    slug: "isekai-reincarnated-curse-space-time-teleport-10",
    title: "空間魔法・転移・ストレージチートおすすめ異世界ラノベ10選【無限収納・瞬間移動・次元切断】",
    description: "無限のアイテムボックス、大陸間テレポート、次元断裂攻撃！空間を完全に掌握して物流も戦闘も無双するおすすめ空間魔法・転移チート異世界ラノベ10選を徹底解説。",
    category: "空間魔法・転移・ストレージ",
    leadText: "「山のような魔物の死骸や物資を一瞬で亜空間に吸い込み、いつでも鮮度そのままに取り出す」「数千キロ離れた王都と前線を一瞬で往復して戦局と流通を激変させる」——空間魔法・転移ファンタジーは、圧倒的な機動性と無限の物資補給がもたらすスマートな無双劇が最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "空間魔法 ラノベ おすすめ",
      "転移 異世界 アイテムボックス 小説 なろう",
      "ストレージ 無限収納 チート ファンタジー",
      "次元魔法 テレポート 無双 名作"
    ],
    items: [
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 1,
        hook: "【全アイテム自動回収ストレージ】時間停止・容量無限の保管庫と大陸全土への瞬間移動！",
        detailedReview: "サトゥーの持つチート【ストレージ】。時間停止かつ容量無限であり、倒した魔物の素材やドロップ品、街で買い集めた食材や美術品を瞬時に一括収納。さらに【空間魔法】による長距離テレポートと帰還門で、観光と人助けを自由自在にこなす究極の利便性無双です。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 2,
        hook: "【ネットスーパー×無限アイテムボックス】現代の商品を鮮度100%のまま無限ストック！",
        detailedReview: "ムコーダの容量無制限・時間停止アイテムボックス。ネットスーパーで大量に買い込んだ生鮮食品や調味料、従魔たちが狩ってきた巨大魔獣の高級肉を一切腐らせずに保管。いつでも出来立ての絶品料理を振る舞える旅の最強インフラです。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 3,
        hook: "【広大無辺の亜空間『亜空』】空間を丸ごと切り取った独自の世界を所有・拡張！",
        detailedReview: "深澄真の魔力によって創造・維持される異次元空間『亜空』。地球の日本の気候や地形を再現し、上位竜や多種族が暮らす大都市をまるごと内包。界転移の魔法でいつでも亜空と現実世界を行き来する超スケールの空間掌握です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 4,
        hook: "【空間魔法『羅針盤』と次元転移】神代魔法で空間をねじ曲げ、地球への帰還ゲートを開く！",
        detailedReview: "南雲ハジメが習得した神代空間魔法。空間を切り裂く次元断裂刃や、敵の攻撃を別の空間へ受け流す結界、そして全世界の座標を瞬時に特定してテレポートする『ゲートキー』を錬成し、神の結界すら突破します。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 5,
        hook: "【転移魔法『ゲート』の縦横無尽な活用】一度行った場所へ仲間ごと一瞬でテレポート！",
        detailedReview: "アークが使う転移魔法。エルフの隠れ里や王都、戦場を一瞬で結び、拉致されたエルフたちを安全に故郷へ送り届けるなど、圧倒的な機動力で悪徳貴族や暗殺者たちの追撃を完全に振り切る痛快アクションです。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 6,
        hook: "【空間跳躍・城ごと転移】魔法陣一つで巨大魔王城デルゾゲードを戦場へ直接召喚！",
        detailedReview: "アノスの空間魔術【ガトゥム】。自身の転移だけでなく、数百キロ離れた巨大城郭デルゾゲードを瞬時に敵軍の頭上へ空間転移させて配置。空間の距離や概念すら意のままに操る圧倒的始祖魔導です。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 7,
        hook: "【長距離瞬間移動『瞬間移動』】王都と未開拓領地を直結する国家最高峰の機動力！",
        detailedReview: "ヴェンデリンが習得した古代魔法【瞬間移動】。通常なら馬車で数週間かかる距離を一瞬で移動し、緊急のドラゴン討伐や未開拓地の開墾資材の大量輸送を一手に担い、王国の最重要戦力として重用されます。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 8,
        hook: "【スライムスーツの空間圧縮とステルス】空間に溶け込み気配を完全遮断する神速移動！",
        detailedReview: "シャドウの極限の体捌きと魔力操作。周囲の空間と自身の魔力波長を完全に同調させることで、敵の目の前を歩いていても誰にも認識されず、一瞬で背後へ回り込んで首を刈り取る不可視の神速機動です。"
      },
      {
        keyword: "ポーション頼みで生き延びます！",
        rank: 9,
        hook: "【アイテムボックス付きのチート容器】空間拡張された魔法フラスコから無限に薬品を取り出す！",
        detailedReview: "カオルが生み出す薬品容器。外見は小さなガラス瓶でありながら、内部は数万リットルの液体を保管できる空間拡張仕様。酸や聖水を滝のように放出して敵軍の拠点を一瞬で水没・溶解させる奇策が炸裂します。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 10,
        hook: "【迷宮ワープポイントと帰還スキル】安全地帯へ即時脱出する徹底したリスク管理！",
        detailedReview: "加賀道夫の【フィールドウォーク】スキル。迷宮内の各階層や自宅の部屋に一瞬で転移可能であり、危機に陥ってもノータイムで安全地帯へ撤退できる究極のリスクヘッジで着実な迷宮攻略を進めます。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-black-hair-summoned-10",
    title: "黒髪黒目・異世界人の珍重おすすめ異世界ラノベ10選【古代予言・神の御子・魔力純度と文化の衝撃】",
    description: "金髪碧眼が当たり前の世界で、黒髪黒目の姿が『伝説の勇者』や『神の御子』として珍重・畏敬される！おすすめ黒髪黒目主人公異世界ラノベ10選を徹底紹介。",
    category: "黒髪黒目・異世界文化の衝撃",
    leadText: "「中世風の異世界において、黒髪黒目の容姿が失われた古代の英雄の血統として崇められる」「珍しい容姿と異世界の洗練された礼儀作法で、王侯貴族や美少女たちを魅了する」——黒髪黒目ファンタジーは、ファンタジー世界における主人公の異質さと特別感、そして文化的なギャップがもたらすドラマが最大の魅力です。至高の10選を厳選しました。",
    searchQueries: [
      "黒髪黒目 異世界 ラノベ おすすめ",
      "黒髪 主人公 転生 小説 なろう",
      "異世界人 珍重 予言 勇者 ファンタジー",
      "月が導く異世界道中 類似作品 黒髪"
    ],
    items: [
      {
        keyword: "月が導く異世界道中",
        rank: 1,
        hook: "【ヒューマンの美醜基準を覆す黒髪】女神に罵倒された黒髪の少年が亜人たちの絶対神へ！",
        detailedReview: "金髪美形至上主義の女神から「不細工」と荒野へ捨てられた黒髪の深澄真。しかしその黒髪と底知れない魔力、温かな人柄は、ハイランドオークやエルダードワーフたちにとってまさに慈愛に満ちた絶対神として熱烈に崇拝されます。"
      },
      {
        keyword: "Re:ゼロから始める異世界生活",
        rank: 2,
        hook: "【親竜王国ルグニカの黒髪少年】ジャージ姿の珍しい黒髪異邦人が王選の運命を動かす！",
        detailedReview: "金髪や銀髪、獣人が行き交うルグニカ王都に突如現れた黒髪三白眼のスバル。異質な見た目と怪しげな言動で当初は警戒されながらも、死に戻りと仲間への愚直な献身によって、王国の英雄たちから絶大な信頼を勝ち取っていきます。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 3,
        hook: "【黒髪から白髪紅眼への劇的変貌】魔物喰らいによる変異と、かつての黒髪の記憶！",
        detailedReview: "召喚当初は平凡な黒髪の少年だった南雲ハジメ。奈落で魔物の肉を喰らい白髪紅眼の異形の肉体へと変貌するが、その胸に宿る日本男児としての芯の強さと生き様が、異世界のヒロインたちを惹きつけて離しません。"
      },
      {
        keyword: "無職転生",
        rank: 4,
        hook: "【スペルド族の禁忌と黒髪の異邦人】前世の記憶を持つルーデウスと魔大陸の緑髪・黒髪の仲間たち！",
        detailedReview: "金髪碧眼のルーデウスが、魔大陸で恐れられるスペルド族の戦士ルイジェルドや黒髪の異邦人たちと出会い、差別の歴史を解きほぐしながら成長していく、異種族理解と文化の交流を描いた不朽の名作です。"
      },
      {
        keyword: "盾の勇者の成り上がり",
        rank: 5,
        hook: "【異世界の服飾と黒髪の盾勇者】異邦の衣服や料理文化を持ち込み民衆を救う守護神！",
        detailedReview: "黒髪の大学生・岩谷尚文。差別と冤罪に苦しみながらも、日本の着物文化や薬草加工技術、行商で培った実直な商売によって、亜人たちや平民から本物の救世主として崇められていく感動巨編です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 6,
        hook: "【黒髪モブ学生と漆黒のシャドウ】漆黒の髪と瞳をスタイリッシュに演じ分ける究極のモブ劇！",
        detailedReview: "黒髪の平凡な学生シド・カゲノー。昼は目立たないモブとして周囲に溶け込み、夜は漆黒のコートと仮面を纏うシャドウとして、美少女たちを率いて世界の闇を断罪する完璧な二重生活が痛快です。"
      },
      {
        keyword: "異世界薬局",
        rank: 7,
        hook: "【金髪貴族の少年に宿る黒髪の薬学者魂】前世の近代医学知識と神聖な薬神の聖紋！",
        detailedReview: "白銀の髪を持つ貴族の少年ファルマ。しかしその内面には日本の薬学研究所で培われた確かな科学精神と慈愛が宿っており、中世の不衛生な社会に近代医療を根付かせていく本格派ドラマです。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 8,
        hook: "【黒髪の行商人サトゥーの優雅な旅路】珍しい黒髪と極上の日本風料理で各地の王族を魅了！",
        detailedReview: "黒髪の青年サトゥー。各地の都市で黒髪黒目の容姿が「伝説の勇者の血統」や「遠方の神秘的な異邦人」として注目を集めつつ、醤油や味噌を再現した絶品和食で貴族やドワーフたちを胃袋から魅了します。"
      },
      {
        keyword: "賢者の孫",
        rank: 9,
        hook: "【常識知らずの黒髪大魔導士】現代日本の物理・科学知識を魔法に応用する規格外の少年！",
        detailedReview: "黒髪の少年シン・ウォルフォード。前世の科学知識を活かした無詠唱魔術で、王立魔法学院の教師や貴族たちを卒倒させ、世界を滅ぼす魔人たちを圧倒していく王道チートファンタジーです。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 10,
        hook: "【和食を愛する黒髪魔導士の領地経営】醤油・味噌・米の栽培を異世界で実現！",
        detailedReview: "ヴェンデリンが前世の記憶を頼りに探求する日本の食文化。米や大豆に似た作物を発見・栽培し、刺身や味噌汁を再現して貴族社会に和食ブームを巻き起こす、文化・グルメ開拓の面白さが詰まっています。"
      }
    ]
  }
];

async function enrichPart23() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart23) {
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
  console.log(`\nBatch features part 23 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart23().catch(console.error);
