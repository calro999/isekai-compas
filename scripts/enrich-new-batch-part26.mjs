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

const batchPart26 = [
  {
    slug: "isekai-reincarnated-curse-black-necromancer-undead-army-10",
    title: "死霊術士・ネクロマンサー軍団おすすめ異世界ラノベ10選【不死の軍勢・魂の使役・深淵の支配者】",
    description: "倒した魔物や敵兵をアンデッドとして蘇らせ、無尽蔵の不死軍団を編成！国家規模の大軍勢を一人で指揮するおすすめ死霊術士・ネクロマンサーラノベ10選を徹底解説。",
    category: "死霊術士・ネクロマンサー・不死軍団",
    leadText: "「息絶えた敵将をデス・ナイトとして再構築し、忠実な臣下として永遠に従わせる」「数万の白骨スケルトン軍団を行進させ、一国を無血開城へと追い込む」——死霊術士・ネクロマンサーファンタジーは、死者を従える圧倒的な物量と冷徹な軍団指揮のカリスマ性が最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "ネクロマンサー ラノベ おすすめ",
      "死霊術士 異世界 不死軍団 小説 なろう",
      "アンデッド スケルトン 使役 チート",
      "オーバーロード 類似作品 死霊術"
    ],
    items: [
      {
        keyword: "オーバーロード",
        rank: 1,
        hook: "【不死者の最高支配者】死の魔力を統べるアインズと無限に生み出されるデス・ナイト軍団！",
        detailedReview: "死の支配者たるオーバーロードのアインズ。倒した人間の死体を触媒にして永続アンデッドを召喚し、都市をも滅ぼすソウルイーターを配置するなど、単独で国家滅亡級の不死軍団を展開するネクロマンシーの頂点です。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 2,
        hook: "【最底辺骨人からの存在進化】スケルトンから吸血鬼へ！眷属使役と生命力掌握の極致！",
        detailedReview: "迷宮で竜に喰われスケルトンとなったレント。魔物を倒して魔力を吸収する存在進化（エボリューション）を重ね、屍食鬼、グール、吸血鬼へと進化しながら、不死者ならではの魔力と眷属使役を極めていく重厚なファンタジーです。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 3,
        hook: "【絶対毒殺と死霊の如き冷徹さ】相手の生命を確実に刈り取り、廃棄遺跡の深淵を制圧！",
        detailedReview: "三森灯火の冷徹無比なステルス制圧術。必中の状態異常で魔獣を瞬殺し、屍の山を築きながら女神への復讐を進める姿は、まさに死を司る冷酷な執行者そのものの緊迫感を放ちます。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 4,
        hook: "【死霊・鬼神を使役する百鬼夜行】異世界の魔導士を恐怖に陥れる東洋呪術の死者使役！",
        detailedReview: "セイカ・ランプローグが操る呪術と式神。異世界の霊魂や怨念を束ねて巨大な妖魔や餓鬼を具現化し、敵対する暗殺者や魔族の軍勢を影から一網打尽にする圧倒的使役無双です。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 5,
        hook: "【全身骨格の聖騎士という矛盾】見た目は凶悪アンデッド、中身は神聖魔法の守護者！",
        detailedReview: "全身骨格の骸骨騎士アーク。恐ろしい見た目からアンデッドと誤解されやすいが、天変地異級の武技と神聖治癒魔法で弱者を救う、ダークな外見と温かな心が生み出すギャップが最高の冒険譚です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 6,
        hook: "【神代再生魔法による擬似使役】魔物の魂と肉体を魔改造兵器へと組み込む超技術！",
        detailedReview: "南雲ハジメが獲得した神代魔法と錬成術。倒した神話級モンスターのコアや素材を抽出し、自律型の無人戦闘ドローンや自動防衛兵器として再構築して戦場を支配するテクノロジーネクロマンシーです。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 7,
        hook: "【師匠アルフレッドの死霊成仏】死霊術士の師の想いを受け継ぎ、巨大古代竜アンデッドを浄化！",
        detailedReview: "森の死霊となった大魔導士アルフレッドから魔法を学んだヴェンデリン。アンデッドの悲哀を理解し、王都を襲った巨大アンデッドドラゴンを聖光で成仏させるなど、死者との深い絆と浄化のドラマが描かれます。"
      },
      {
        keyword: "Re:Monster",
        rank: 8,
        hook: "【死体のスキルを全て吸喰】喰らった魔物の魂と能力を自身と配下の血肉へ完全統合！",
        detailedReview: "吸喰能力を持つゴブ朗。倒した強敵の死体を喰らうことでそのスキルを完全に我が物とし、配下の魔物たちにも死体の肉を分け与えて軍団全体を急速に強化・進化させていく生態系支配です。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 9,
        hook: "【死者を三秒で蘇生させる始祖】殺しては蘇生を繰り返す、生と死を弄ぶ絶対の魔力！",
        detailedReview: "暴虐の魔王アノス。「殺したくらいで死ぬと思うな」の言葉通り、敵を一瞬で殺害し、三秒後に完全蘇生させて真実を自白させるなど、生と死の理を完全に掌握した神をも超える力を見せつけます。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 10,
        hook: "【腐蝕攻撃と不死スキルの獲得】魂ごと削る死の魔力と、決して滅びない並列意思！",
        detailedReview: "最弱小蜘蛛が極めた「腐蝕攻撃」と「不死」スキル。相手の肉体と魂を直接崩壊させる死霊術の極致を行使し、自らは身体が消滅しても卵や眷属から何度でも蘇る不死の邪神へと進化していきます。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-black-craft-potion-brewing-10",
    title: "薬師・創薬チート・病魔撃破おすすめ異世界ラノベ10選【近代薬理学・疫病根絶・ドラッグストア開業】",
    description: "ペスト、結核、謎の風土病を近代医学と創薬チートで完全治療！中世の迷信を科学的エビデンスで打ち破るおすすめ薬師・創薬・医療異世界ラノベ10選を徹底紹介。",
    category: "薬師・創薬チート・医療ファンタジー",
    leadText: "「迷信や祈祷に頼っていた中世都市に、近代薬理学に基づいた特効薬を届ける」「顕微鏡で病原菌を特定し、抗生物質と消毒液でパンデミックを阻止する」——薬師・医療ファンタジーは、確かな科学知識と人々の命を救う情熱がもたらす感動のドラマが最大の魅力です。知的好奇心を刺激する傑作10選を厳選しました。",
    searchQueries: [
      "薬師 異世界 ラノベ おすすめ",
      "創薬 チート 疫病 医療 小説 なろう",
      "異世界薬局 類似作品 薬学",
      "ポーション ドラッグストア スローライフ"
    ],
    items: [
      {
        keyword: "異世界薬局",
        rank: 1,
        hook: "【分子構造の神術具現化】若き天才薬学者がペストや白血病に近代医学で挑む！",
        detailedReview: "過労死した薬学研究者ファルマ。神術による物質創造と近代薬理学の知識を融合させ、抗菌薬、抗がん剤、消毒液を生成。貴族の独占市場を排して平民のための「異世界薬局」を開業し、中世の公衆衛生を根本から変革する名作です。"
      },
      {
        keyword: "聖女の魔力は万能です",
        rank: 2,
        hook: "【薬用植物研究所の奇跡】5割増しの効能を持つポーションで瀕死の騎士たちを救護！",
        detailedReview: "OLセイが植物研究所で始める薬草研究とポーション調合。丁寧な採取と抽出プロセスによって作られたポーションは通常品の数倍の治癒力を発揮し、騎士団の遠征や瘴気浄化の要として活躍する極上の癒やし系ファンタジーです。"
      },
      {
        keyword: "薬屋のひとりごと",
        rank: 3,
        hook: "【花街育ちの毒と薬の推理】毒味役・猫猫が後宮の怪事件を薬理的エビデンスで解決！",
        detailedReview: "花街の薬師として育った猫猫（マオマオ）。毒物や薬草への異常な偏愛と観察眼を武器に、後宮の妃たちを襲う白粉の毒性、木炭中毒、毒キノコの効能などを科学的に見抜いていく本格ミステリーです。"
      },
      {
        keyword: "ポーション頼みで生き延びます！",
        rank: 4,
        hook: "【効果自由自在の万能霊薬】手足の再生から若返りまで、思い描いた通りの薬品を生成！",
        detailedReview: "カオルが神様から授かったポーション生成能力。どんな難病も一瞬で完治させる霊薬をフラスコごと生み出し、狡猾な貴族や教会の思惑を巧みな商魂とポーションの圧倒的効能で一蹴していく爽快劇です。"
      },
      {
        keyword: "チート薬師のスローライフ",
        rank: 5,
        hook: "【町に愛されるドラッグストア】鑑定と創薬スキルで胃薬からスキンケア用品まで開発！",
        detailedReview: "異世界へ転移した元社畜レイジが田舎町に開店したドラッグストア。人狼の少女ノエラや幽霊ミナとともに、傷薬だけでなく、虫除けスプレー、疲労回復ドリンク、美味しい紅茶などを作り、人々を笑顔にするほのぼのスローライフです。"
      },
      {
        keyword: "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました",
        rank: 6,
        hook: "【辺境ゾルタンの薬草屋生活】薬草の採取と軟膏調合で愛するお姫様と営む極上の日常！",
        detailedReview: "勇者パーティを追放されたレッドが辺境で開いた薬草屋。採取した薬草の丁寧な下処理と確かな医学知識で村人の病気や怪我を治しつつ、元ツンデレお姫様リットとの甘酸っぱい同棲生活を満喫する温かな物語です。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 7,
        hook: "【スライム抽出液の医療応用】消毒スライムや解毒スライムの体液で安全な処置を実現！",
        detailedReview: "リョウマが育てたスライムたちの多機能性。傷口を清潔に保つ消毒液、毒魔獣の猛毒を中和する解毒液をスライムから安全に採取し、冒険者ギルドの医療体制を劇的に改善していくユニークな研究スローライフです。"
      },
      {
        keyword: "新米錬金術師の店舗経営",
        rank: 8,
        hook: "【素材採取から大釜調合】王立学校仕込みの正規ポーション調合技術で村を支える！",
        detailedReview: "サラサが辺境の村で営む錬金術店。危険な魔物から採れる希少素材を丁寧に解体し、大釜で温度と魔力を管理しながら高品質な回復薬や防虫薬を調合していくリアルなものづくりが魅力です。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 9,
        hook: "【人工炭酸水と冷却魔導具】暑気中和や衛生環境を改善する画期的な生活発明！",
        detailedReview: "ダリヤが創り出す魔導具。熱中症を防ぐ保冷機能付き靴敷きや、清潔な湯を沸かす小型魔導温水器など、人々の健康と衛生を支える実用的な発明で職人や貴族たちを救っていきます。"
      },
      {
        keyword: "ループ7回目の悪役令嬢は、元敵国で自由気ままな花嫁生活を満喫する",
        rank: 10,
        hook: "【過去生で培った薬師の知識】猛毒の調合と解毒薬の精製で宮廷の暗殺工作を完全阻止！",
        detailedReview: "7回目の人生を歩むリーシェ。過去生で薬師として各地の薬草や毒物を研究し尽くした知識を活かし、敵国の皇太子アルノルトを狙う毒殺未遂事件を瞬時に見抜いて解毒薬を自作する知性派サクセスです。"
      }
    ]
  }
];

async function enrichPart26() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart26) {
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
  console.log(`\nBatch features part 26 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart26().catch(console.error);
