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

const batchPart12 = [
  {
    slug: "isekai-reincarnated-time-loop-rewind-10",
    title: "ループ・死に戻り・時間逆行おすすめ異世界ラノベ10選【絶望の運命改変・試行錯誤・未来予知無双】",
    description: "命を落とすたびに過去のセーブポイントへ巻き戻る！絶望的なバッドエンドや仲間の死を回避するため、死の記憶と試行錯誤で運命の糸を手繰り寄せるおすすめ死に戻り・タイムループラノベ10選を徹底解説。",
    category: "タイムループ・死に戻り",
    leadText: "「何度死んでも諦めず、未来の記憶を武器に絶望的な結末を塗り替える」「破滅確定の未来を知った主人公が、幼少期から完璧な布石を打つ」——時間逆行・死に戻りファンタジーは、極限の心理戦と繰り返される試行錯誤の末に掴み取る劇的な勝利が最大の魅力です。手に汗握る傑作10選を厳選しました。",
    searchQueries: [
      "死に戻り ラノベ おすすめ",
      "タイムループ 異世界 逆行 小説 なろう",
      "時間遡行 人生やり直し ファンタジー 名作",
      "Re:ゼロ 類似作品 ループもの ラノベ"
    ],
    items: [
      {
        keyword: "Re:ゼロから始める異世界生活",
        rank: 1,
        hook: "【死に戻りサスペンスの金字塔】無力な少年が死の苦痛と絶望を越えて最愛の人を救い出す！",
        detailedReview: "突如異世界へ召喚された無力な少年ナツキ・スバルが得た唯一の能力は、命を落とすと過去へ巻き戻る【死に戻り】。狂気と激痛に苛まれながらも、幾重にも張り巡らされた悲劇のフラグを情報収集と仲間との絆で一本ずつ解きほぐしていく、サスペンスと感動の最高峰です。"
      },
      {
        keyword: "ループ7回目の悪役令嬢は、元敵国で自由気ままな花嫁生活を満喫する",
        rank: 2,
        hook: "【7回の人生経験フル活用】20歳で死ぬ運命を打ち破るため、万能スキルで皇太子と対峙！",
        detailedReview: "20歳で死亡するたびに婚約破棄の瞬間に戻るループを繰り返すリーシェ。商人、薬師、侍女、騎士として極めた知識と技術を総動員し、7回目の人生で自分を殺した敵国の冷酷皇太子アルノルトの求婚を受諾。知略と行動力で戦争回避と平穏を目指す極上ロマンスファンタジーです。"
      },
      {
        keyword: "ティアムーン帝国物語",
        rank: 3,
        hook: "【ギロチン処刑からの大逆転】血染めの日記帳を手に、破滅の運命を保身と叡智で塗り替える！",
        detailedReview: "革命で断罪されギロチンで処刑された皇女ミーアが、記憶と血染めの日記帳を持って12歳の過去へ逆行。死を回避するための保身行動が、優秀な臣下たちに『国を憂う神算鬼謀』と深読みされ、帝国の飢饉や疫病、内乱を未然に防いでいく傑作歴史改変コメディです。"
      },
      {
        keyword: "回復術士のやり直し",
        rank: 4,
        hook: "【賢者の石による世界巻き戻し】地獄の記憶を保持したまま、勇者たちへの復讐行を開始！",
        detailedReview: "勇者たちに薬漬けにされ利用され尽くした【癒】の勇者ケヤル。魔王を倒した瞬間、秘宝の力で世界を4年前へ巻き戻し、すべてを知る圧倒的アドバンテージを武器に、かつての加害者たちへ容赦なき制裁を下していくピカレスクリベンジです。"
      },
      {
        keyword: "無職転生",
        rank: 5,
        hook: "【人生やり直しの究極叙事詩】前世の後悔を胸に、赤ん坊から本気で生き直す壮大な大河ドラマ！",
        detailedReview: "34歳引きこもり男が異世界で赤ん坊ルーデウスとして転生。死に戻りではないものの、「人生の完全なやり直し」をテーマに、幼少期からのたゆまぬ努力、家族や仲間との葛藤、そして未来からの警告（ヒトガミとの戦い）に立ち向かう人生讃歌の最高傑作です。"
      },
      {
        keyword: "公爵令嬢の嗜み",
        rank: 6,
        hook: "【婚約破棄の現場から始まる再起】破滅直前のターニングポイントから領地経営へ！",
        detailedReview: "断罪宣告を受けた瞬間に前世の記憶を思い出したアイリス。追放刑を逆手に取って領地代行として赴任し、前世の近代経済・行政知識を活かして領地を一大貿易拠点へと発展させていく本格派逆転劇です。"
      },
      {
        keyword: "悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。",
        rank: 7,
        hook: "【未来の惨劇を知るラスボスの贖罪】凄惨なゲーム未来を変えるため、身を挺して民を救う！",
        detailedReview: "極悪非道なラスボス女王プライド（8歳）に前世の記憶が蘇る。ゲーム知識で自身が引き起こすはずだった悲劇や大切な人々の死を未然に防ぎ、自己犠牲を厭わぬ慈愛と圧倒的な武力で国中から愛される名君へと運命を変革します。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 8,
        hook: "【クソゲーの死に覚え攻略】幾千回のゲームオーバーで培われた神速の反射神経と戦術眼！",
        detailedReview: "無数の理不尽クソゲーで死に覚えを繰り返してきたサンラク。神ゲー『シャンフロ』においても、初見殺しのユニークボス相手に最小限のミスで行動パターンを見切り、死線を潜り抜けていくゲーマー魂が炸裂します。"
      },
      {
        keyword: "嘆きの亡霊は引退したい",
        rank: 9,
        hook: "【危険予知の奇跡的直感】死にたくない本能がもたらす神がかり的なトラブル回避！",
        detailedReview: "才能ゼロのマスター・クライ。死にたくない一心で直感的に選んだアイテムや行き先が、結果として迷宮の崩壊や帝国の陰謀を寸前で防ぐ「未来予知級の采配」となり、周囲の崇拝を加速させる痛快コメディです。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 10,
        hook: "【歴史の真実を看破する覇者】前世からの妄想と修練が異世界の闇の教団と完全にリンク！",
        detailedReview: "前世から核兵器に耐えうる力を求めて修行を重ねていたシド。異世界転生後、自分が適当に語った『ディアボロス教団』の伝説が実は千年前の歴史の真実であり、影の英雄として教団の野望を粉砕していく圧倒的無双劇です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-dark-magic-necromancer-10",
    title: "呪術・黒魔術・デバフ特化おすすめ異世界ラノベ10選【状態異常・弱体化・死霊使役・深淵の魔導】",
    description: "ド派手な攻撃魔法をあざ笑う、凶悪な状態異常・弱体化デバフ・呪詛・黒魔術の神髄！相手の自由を奪いじわじわと追い詰めるおすすめ呪術・デバフ特化異世界ラノベ10選を徹底解説。",
    category: "呪術・デバフ・黒魔術",
    leadText: "「相手のステータスを半減させ、麻痺と毒で一歩も動けなくする」「誰も感知できない呪詛や死霊術で大軍勢を沈黙させる」——呪術・デバフ特化ファンタジーは、単純な火力勝負ではない搦め手と戦術的制圧の圧倒的カタルシスが最大の魅力です。深淵の魔導を極めた傑作10選をお届けします。",
    searchQueries: [
      "デバフ 状態異常 異世界 ラノベ おすすめ",
      "呪術 黒魔術 主人公 小説 なろう",
      "ネクロマンサー 死霊術 弱体化 チート",
      "ハズレ枠 状態異常スキル 類似作品"
    ],
    items: [
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 1,
        hook: "【絶対必中の状態異常】麻痺・毒・睡眠で格上の神話級モンスターや勇者を完全無力化！",
        detailedReview: "最低ランクのE級と判定され廃棄遺跡へ放逐された三森灯火。しかし彼の【パラライズ（麻痺）】【ポイズン（毒）】【スリープ（睡眠）】は成功率100%かつ必中。どれほど強大なステータスを持つ敵でも指一本動かせぬまま絶命させる、状態異常デバフ無双の絶対的頂点です。"
      },
      {
        keyword: "オーバーロード",
        rank: 2,
        hook: "【死の支配者の即死・デバフ魔導】時間停止、即死魔法、ステータス低下で敵軍を蹂躙！",
        detailedReview: "死霊系魔法の頂点に立つアインズ・ウール・ゴウン。相手の耐性を無視して即死させる『黒核爆発』『全ては死に向かう（クライ・オブ・ザ・バンシー）』や、時間停止、全能力低下デバフを組み合わせ、数万の大軍を一瞬で全滅させるアンデッドの絶対覇道です。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 3,
        hook: "【異世界未知の呪詛と式神】魔法防御をすり抜ける陰陽道の呪術で傲慢な貴族を恐怖に陥れる！",
        detailedReview: "異世界には存在しない「呪力」と「呪符」を用いるセイカ。魔法障壁を完全に無視して相手の体内に直接呪詛を流し込み、目に見えない式神で神経を麻痺させるなど、異世界の常識を根底から覆す呪術の恐ろしさが光ります。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 4,
        hook: "【猛毒・邪眼・腐蝕攻撃】視覚に捉えただけでステータスを削り取る恐怖のデバフ魔物！",
        detailedReview: "最弱小蜘蛛として生まれた主人公。麻痺毒、合成毒、さらには相手を視認するだけで継続ダメージとステータス低下を与える「死見の邪眼」「歪曲の邪眼」、魂ごと削る「腐蝕攻撃」を極め、迷宮の生態系を支配する邪神へと進化していきます。"
      },
      {
        keyword: "回復術士のやり直し",
        rank: 5,
        hook: "【治癒を反転させた肉体破壊】触れた相手の神経や血管を意のままに狂わせる禁断の術理！",
        detailedReview: "【回復（ヒール）】の概念を突き詰め、「対象の肉体を改悪する【改悪（リカバー）】」へと昇華させたケヤルガ。相手の視神経を奪い、四肢の感覚を狂わせ、激痛のデバフを与えて戦闘不能に追い込む容赦なき制裁劇です。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 6,
        hook: "【不死者の生命力吸収】骨人から吸血鬼へ！眷属使役と生命力ドレインの重厚な魔導！",
        detailedReview: "スケルトンから存在進化を重ねるレント。不死者特有の「気・魔力・聖気」の融合術を体得し、相手の生命力を奪うドレイン攻撃や麻痺を伴う魔眼で、格上の魔物や凶悪な盗賊たちを冷静沈着に追い詰めます。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 7,
        hook: "【バッドステータスの連鎖発動】使えないゴミスキル同士を掛け合わせて絶対防御と遅延を付与！",
        detailedReview: "余り物のマイナス効果スキルを押し付けられた遥。しかしスキルの隠された相互作用によって、相手の攻撃を遅延させ、命中率をゼロにし、足元を滑らせて自滅させるトリッキーなデバフ戦術を編み出し魔王軍を翻弄します。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 8,
        hook: "【聖騎士とアンデッドの二面性】見た目は凶悪スケルトン、中身は神聖魔法のマスター！",
        detailedReview: "骸骨騎士アークの骨の肉体は、毒や麻痺、精神攻撃などの状態異常を一切無効化。相手のデバフを完全にシャットアウトしながら、自分は天変地異級の武技と神聖魔法で敵拠点を消滅させる痛快アクションです。"
      },
      {
        keyword: "即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。",
        rank: 9,
        hook: "【デバフの究極系『存在の停止』】部分即死で『視力』『魔力』『心臓』だけを個別に停止！",
        detailedReview: "高遠夜霧の即死能力は、命を奪うだけでなく「相手の能力だけを殺す」「視覚だけを殺す」「毒の概念を殺す」といった部分即死も可能。あらゆる耐性や防御魔法を無意味にする絶対の制圧能力です。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 10,
        hook: "【根源を滅殺する深遠魔導】相手の再生能力や時間の概念すら殺す始祖の漆黒魔力！",
        detailedReview: "暴虐の魔王アノス。相手の心臓を鼓動の音だけで止め、時間を巻き戻す魔法すら打ち消す『根源殺滅』の魔剣デルゾゲードを振るい、神々の理不尽な掟や呪いを全て無に帰す圧倒的無双劇です。"
      }
    ]
  }
];

async function enrichPart12() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart12) {
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
  console.log(`\nBatch features part 12 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart12().catch(console.error);
