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

const batchPart20 = [
  {
    slug: "isekai-reincarnated-curse-labyrinth-deep-level-10",
    title: "深層迷宮・ダンジョン孤立サバイバルおすすめ異世界ラノベ10選【奈落への落下・単独踏破・人外への変貌】",
    description: "大迷宮の最深層・奈落へ置き去りにされた絶望から始まる！凶悪な深層モンスターの肉を喰らい、死線を越えて単独踏破を目指すおすすめ深層迷宮サバイバル異世界ラノベ10選を徹底解説。",
    category: "深層迷宮・奈落サバイバル",
    leadText: "「仲間やクラスメイトに裏切られ、生存率ゼロの迷宮奈落へ突き落とされる」「誰も到達したことのない最深層から、魔物を喰らい尽くして地上を目指す」——深層迷宮サバイバルファンタジーは、極限の飢餓と絶望の中で主人公が覚醒し、人外の怪物へと変貌を遂げていく圧倒的カタルシスが最大の魅力です。手に汗握る傑作10選をお届けします。",
    searchQueries: [
      "ダンジョン 奈落 異世界 ラノベ おすすめ",
      "深層迷宮 孤立 サバイバル 小説 なろう",
      "ありふれた職業 類似作品 迷宮 最下層",
      "魔物を喰らう 覚醒 進化 ラノベ"
    ],
    items: [
      {
        keyword: "ありふれた職業で世界最強",
        rank: 1,
        hook: "【奈落の底での魔改造覚醒】オルクス大迷宮の最深層で魔物の肉を喰らい、最強の捕食者へ！",
        detailedReview: "クラスメイトの悪意でオルクス大迷宮の奈落へ突き落とされた南雲ハジメ。左腕を失い激痛と絶望に苛まれながらも、生き残るために熊型魔獣を狩りその肉を喰らうことで肉体が変異。神代魔法と銃火器錬成を手に入れ、深層の覇者となって地上を目指す迷宮サバイバルの最高峰です。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 2,
        hook: "【エルロー大迷宮の最下層転落】凶悪な地龍アラバが徘徊する地獄のエルロー大窪へ！",
        detailedReview: "最弱小蜘蛛として生まれた主人公。上層からさらに過酷な「中層（マグマ地帯）」、そして最強の龍たちが巣食う「下層・最下層」へと追い詰められる。毒糸トラップと知恵をフル回転させ、格上の魔物を喰らって進化ツリーを駆け上がる命がけの迷宮サバイバルです。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 3,
        hook: "【生存率ゼロの廃棄遺跡】クソ女神に捨てられた少年が状態異常スキルで深層ボスを殲滅！",
        detailedReview: "最低E級と判定され、歴代の召喚者たちが全員死亡した廃棄遺跡へ追放された三森灯火。迫り来る異形の大群に対し、必中の【パラライズ】【ポイズン】を駆使して深層の守護者を撃破。遺跡の出口を目指して冷徹に突き進む緊迫感満点のダークファンタジーです。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 4,
        hook: "【迷宮の未踏破区域での覚醒】竜に喰われた骨人が『存在進化』で迷宮の秘密に迫る！",
        detailedReview: "水月の迷宮で未踏破の隠し部屋を見つけたレント。巨大竜に遭遇して命を落とすが、目覚めるとスケルトンになっていた。魔物を倒して魔力を吸収する存在進化を繰り返し、迷宮の主や深層の謎を解き明かしていく重厚なダンジョン探索記です。"
      },
      {
        keyword: "ダンジョン飯",
        rank: 5,
        hook: "【迷宮深層での魔物食自給自足】妹の救出と空腹を満たすため、ドラゴンの肉まで調理！",
        detailedReview: "迷宮の最深層でレッドドラゴンに呑まれた妹ファリンを救うため、荷物を失ったライオス一行が挑む極限の迷宮踏破。動く鎧のスープ、大サソリの水炊きなど、迷宮の生態系を理解し食べて生き延びる超本格派グルメサバイバルです。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 6,
        hook: "【大迷宮の危険階層単独踏破】クラスメイトが手こずる迷宮深層を木の棒一本で無双！",
        detailedReview: "ゴミスキルを押し付けられ一人で迷宮に挑む遥。トラップやモンスターの群れを独自の歩法と知覚スキルで紙一重で回避し、最下層のボスモンスターを罠にハメて討伐。仲間を影から助けながら深層を踏破していく痛快アクションです。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 7,
        hook: "【緻密な階層攻略ルーティン】魔物の湧き周期と弱点属性を計算し尽くすリアル迷宮アタック！",
        detailedReview: "加賀道夫のリアル志向な迷宮アタック。各階層のボス部屋のギミック、ドロップ率、疲労度、MP管理を徹底的にデータ化し、奴隷の美少女たちと完璧な陣形を組んで安全かつ確実に深層を制覇していくゲームライクな名作です。"
      },
      {
        keyword: "痛いのは嫌なので防御力に極振りしたいと思います。",
        rank: 8,
        hook: "【ダンジョンボスの丸かじり攻略】毒竜ヒドラを完食して毒耐性と悪食スキルを獲得！",
        detailedReview: "メイプルが挑んだ難関ダンジョンのボス部屋。一切のダメージを受けない鉄壁のVITでボスの攻撃を耐え凌ぎ、武器が壊れたためボスである毒竜ヒドラを直接生きたまま喰らい尽くすという前代未聞の攻略法でボスを完全撃破します。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 9,
        hook: "【初見殺し迷宮エリアの神速突破】超高難度ユニークエリアを即死回避のプレイヤースキルで制す！",
        detailedReview: "神ゲー『シャンフロ』の未踏破エリアに挑むサンラク。視界ゼロの暗闇迷宮や即死トラップが張り巡らされた古代遺跡を、極限の動体視力とジャスト回避で駆け抜けるゲーマー魂全開の超絶アクションです。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 10,
        hook: "【自作迷宮の最深層クリエイト】侵入者を迎え撃つ最強のボス部屋と生活空間の融合！",
        detailedReview: "ユキが作り上げた自作ダンジョンの最深層。外敵にとっては地獄のような難攻不落の防衛エリアでありながら、最奥には温泉や農園が広がる天国のような居住空間。迷宮を攻略する側から創る側へのユニークな視点が魅力です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-tsundere-heroine-10",
    title: "ツンデレヒロイン・素直になれない美少女おすすめ異世界ラノベ10選【クーデレ・ギャップ萌え・悶絶溺愛】",
    description: "最初は冷たくてツンツンしていた美少女が、主人公の優しさや規格外の実力に触れてデレデレに！おすすめツンデレ・クーデレヒロイン異世界ラノベ10選を徹底紹介。",
    category: "ツンデレヒロイン・ラブコメ",
    leadText: "「最初は『あんたなんか大嫌い！』と睨みつけていたお姫様が、命を救われて真っ赤になって照れ隠しする」「高飛車な悪役令嬢が、心の声を看破されて悶絶する」——ツンデレ・クーデレヒロインファンタジーは、冷淡な態度が徐々に崩れていくギャップ萌えと、素直になれない甘酸っぱいやり取りが最大の魅力です。胸キュン必至の傑作10選を厳選しました。",
    searchQueries: [
      "ツンデレ ヒロイン ラノベ おすすめ",
      "クーデレ 異世界 ラブコメ 小説 なろう",
      "ツナマヨ 類似作品 ツンデレ悪役令嬢",
      "ギャップ萌え 異世界 恋愛 ファンタジー"
    ],
    items: [
      {
        keyword: "ツンデレ悪役令嬢リーゼロッテと実況の遠藤くんと解説の小林さん",
        rank: 1,
        hook: "【ツンデレの最高峰ツナマヨ】きつい言葉の裏に隠された可愛すぎる本音が神託で丸裸に！",
        detailedReview: "悪役令嬢リーゼロッテの素直になれないツンツンした態度の裏にある「ジーク様が大好き！」という悶絶級の本音が、現実世界の高校生の実況と解説を通じて婚約者王子ジークに筒抜けに。照れ隠しするリーゼロッテと、愛おしさに悶える王子の極上ラブコメディです。"
      },
      {
        keyword: "ゼロの使い魔",
        rank: 2,
        hook: "【ツンデレヒロインの原点にして金字塔】貧乳・無才のルイズが才人にだけ見せる一途な愛！",
        detailedReview: "使い魔として召喚された才人を「犬」扱いしながらも、命がけで自分を守ってくれる姿に次第に惹かれていくルイズ・フランソワーズ。嫉妬で鞭を振るいながらも、二人きりになると甘えてくるツンデレの王道中の王道です。"
      },
      {
        keyword: "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました",
        rank: 3,
        hook: "【お転婆ツンデレ姫リットの激甘同棲】かつての英雄姫がレッドの前だけで見せる乙女なデレ！",
        detailedReview: "かつては勝ち気でツンツンしたお転婆姫だったリット。辺境ゾルタンでレッドと再会してからは、一緒に暮らす中で溢れんばかりの好意と甘々モード全開に。素直になれない時期を越えた後の最高に甘い恋人生活が描かれます。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 4,
        hook: "【吸血姫ユエのクーデレ独占欲】普段は物静かな美少女がハジメにだけ見せる濃厚な愛情表現！",
        detailedReview: "奈落の底でハジメに救出された吸血鬼の姫ユエ。寡黙で感情を表に出さないクーデレながら、ハジメに対しては一切の躊躇なく血を吸い、抱きつき、絶対の信頼と甘い独占欲を露わにする姿が最高に魅力的です。"
      },
      {
        keyword: "盾の勇者の成り上がり",
        rank: 5,
        hook: "【タヌキ耳少女ラフタリアの一途な想い】不器用な尚文を叱りつつも全身全霊で寄り添う相棒！",
        detailedReview: "尚文の不器用さや人間不信を一番近くで理解し、時に怒り、時に照れながらも絶対に裏切らないラフタリア。尚文が他の女性と親しくなると頬を膨らませて拗ねる姿がたまらなく愛らしいヒロインです。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 6,
        hook: "【最強覇王竜レフィのツンデレ同居】『妾を誰だと思うておる！』と言いつつ甘いお菓子に屈服！",
        detailedReview: "世界最強の古代竜レフィ。プライドが高く最初はユキを威圧していたが、美味しいご飯と甘いケーキに釣られてあっさりデレ化。人型美少女の姿でソファーでゴロゴロしながらユキにかまってもらおうとするギャップが最高です。"
      },
      {
        keyword: "乙女ゲー世界はモブに厳しい世界です",
        rank: 7,
        hook: "【高貴な公爵令嬢アンジェリカの意地とデレ】プライドを捨ててリオンに心を開く瞬間！",
        detailedReview: "王子に婚約破棄され孤立無援だった誇り高き令嬢アンジェリカ。モブ貴族リオンの命がけの決闘劇に救われ、最初は戸惑いながらも次第にリオンに惹かれ、ライバルだったオリヴィアとともにリオンを支えるツンデレ美少女です。"
      },
      {
        keyword: "この素晴らしい世界に祝福を！",
        rank: 8,
        hook: "【爆裂魔法狂いめぐみんのツンデレ相棒】カズマとの絶妙な掛け合いから生まれる甘い距離感！",
        detailedReview: "中二病全開でカズマと小競り合いを繰り返すめぐみん。しかし冒険を重ねる中でカズマへの信頼と恋心を自覚し、夜のテントや宿屋で見せる素直な告白と照れ隠しが読者の心を掴んで離しません。"
      },
      {
        keyword: "無職転生",
        rank: 9,
        hook: "【狂犬お嬢様エリスの不器用な愛情】暴力ヒロインからルーデウスのために強くなる一途な覚悟！",
        detailedReview: "手が付けられない凶暴なお嬢様だったエリス。ルーデウスの教育と魔大陸サバイバルを経て彼を心から愛するようになり、彼を守れる強い女になるために旅立つという、ツンデレの枠を超えた究極の純愛が描かれます。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 10,
        hook: "【災害の黒蜘蛛ミオの強烈な執着】飢餓に狂っていた魔物が真の料理と優しさにメロメロ！",
        detailedReview: "あらゆる物を喰らい尽くす狂気の黒蜘蛛だったミオ。真に屈服させられてからは、真の着物を羽織り、美味しい手料理を振る舞われ、真の一挙手一投足に嬌声を上げてデレデレになる圧巻の従者ヒロインです。"
      }
    ]
  }
];

async function enrichPart20() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart20) {
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
  console.log(`\nBatch features part 20 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart20().catch(console.error);
