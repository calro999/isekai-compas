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

const batchPart27 = [
  {
    slug: "isekai-reincarnated-craft-magic-sword-enchant-10",
    title: "魔剣・聖剣・付与術士（エンチャンター）おすすめ異世界ラノベ10選【神話級武器鍛造・属性付与・最強バフ無双】",
    description: "錆びた鉄剣を神をも屠る魔剣へ強化！属性付与、切れ味倍加、自動修復、ステータス超絶バフで味方を覚醒させるおすすめ魔剣・付与術士異世界ラノベ10選を徹底解説。",
    category: "魔剣・聖剣・付与術士",
    leadText: "「味方の武器に属性付与と攻撃力100倍バフをかけ、雑兵を一瞬で英雄へと変貌させる」「意志を持つ知性魔剣を鍛え上げ、神話の魔獣を一刀両断する」——魔剣・付与術士ファンタジーは、武具の秘められたポテンシャルを極限まで引き出す職人的な面白さと、圧倒的なバフ効果で戦局を塗り替える爽快感が最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "魔剣 ラノベ おすすめ",
      "付与術士 エンチャンター 異世界 小説 なろう",
      "転生したら剣でした 類似作品 神剣",
      "武器強化 バフ チート ファンタジー"
    ],
    items: [
      {
        keyword: "転生したら剣でした",
        rank: 1,
        hook: "【意志を持つ知性魔剣の自己進化】魔石を吸収して剣自身がスキルアップし黒猫少女を導く！",
        detailedReview: "自我を持つ魔剣として転生した「師匠」。魔獣の魔石を喰らうことで剣自身にスキルが付与され、所有者である黒猫族の少女フランに身体強化や属性剣技を付与。二人三脚で神剣への道を駆け上がる魔剣ファンタジーの頂点です。"
      },
      {
        keyword: "片田舎のおっさん、剣聖になる",
        rank: 2,
        hook: "【魔導刀工ルーシー特製の魔法剣】切れ味と耐久力を極限まで高めた名刀がおっさんの神技を支える！",
        detailedReview: "ベリル・ガーデナントが振るう特注の剣。魔法鍛冶師ルーシーの手によって魔導付与された刀身が、ベリルの寸分狂わぬ太刀筋と合わさることで、巨大魔獣の外殻や神聖魔法すら両断する至高の剣劇を生み出します。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 3,
        hook: "【魔導付与による革新武具】魔物の革や魔石の波長を合わせ、魔物討伐部隊の装備を劇的強化！",
        detailedReview: "ダリヤが開発する魔導付与装備。風属性の靴敷き、耐熱・耐酸の魔導手袋、魔力伝導率を極限まで高めた魔剣の柄など、魔物討伐部隊の騎士ヴォルフたちを影から支える緻密な付与クラフトが魅力です。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 4,
        hook: "【チート生産スキルによる神剣鍛造】切れ味・耐久力・魔力親和性を極限まで込めた至高の一振り！",
        detailedReview: "元社畜エイゾウが打つ魔剣や聖剣。神様から授かったチート能力により、鉄に魔力を流し込みながら鍛造することで、ドラゴンのブレスにも耐えうる絶対強度の神具を打ち上げる大人の職人譚です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 5,
        hook: "【神代鉱石への重力・電磁付与】パイルドライバーやレールガンに神代魔法をエンチャント！",
        detailedReview: "南雲ハジメの神代付与錬成。タングステン鋼や重力鉱石に【重力魔法】【雷属性付与】を刻み込み、音速を超える電磁加速弾や山を穿つパイルバンカーを量産する超ハイテクエンチャント無双です。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 6,
        hook: "【神聖属性特化の大聖剣】アンデッド特効と広範囲浄化結界を纏う聖騎士の一撃！",
        detailedReview: "アークが振るう神聖大剣。全身甲冑から溢れ出る神聖気を刀身に宿らせ、一振りで邪悪な魔術結界やアンデッドの大群を跡形もなく消滅させる王道痛快アクションです。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 7,
        hook: "【万物を滅殺する理滅剣ヴェヌズドノア】世界の理や概念すら切り裂く始祖の絶対魔剣！",
        detailedReview: "暴虐の魔王アノスが召喚する理滅剣ヴェヌズドノア。「理があるからこそ滅ぼせない？ ならば理そのものを斬るまでだ」の言葉通り、運命や不死の概念すら両断する究極の概念兵器です。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 8,
        hook: "【空きスロットへのスキルカード付与】聖剣デュランダルに即死や経験値倍加をエンチャント！",
        detailedReview: "加賀道夫の装備合成システム。手に入れた魔剣や防具の空きスロットに、魔物からドロップしたモンスターカードを合成。属性攻撃やHP吸収効果を付与して迷宮周回効率を極限まで高めるゲーマー的付与術です。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 9,
        hook: "【神話級ユニーク武器の特性解放】古代文明の遺産『ウェザエモン』の魔導装具を極限活用！",
        detailedReview: "サンラクたちが手に入れる古代神代武器。破損のリスクや特殊な発動条件をプレイヤースキルで乗り越え、属性付与や変形ギミックをフル活用して神話級ボスに挑む熱血バトルです。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 10,
        hook: "【木の棒への全属性エンチャント】ただの木の枝に空気弾や雷撃を纏わせて魔剣化！",
        detailedReview: "武器を持たない遥が編み出した付与術。森で拾った木の棒に微小な魔力操作で風刃や電撃を纏わせ、国宝級の名剣と打ち合っても折れない超高硬度魔導杖へと強化するトリッキーな無双劇です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-black-modern-weapons-tactics-10",
    title: "近代兵器・自衛隊・ミリタリー戦術おすすめ異世界ラノベ10選【火砲・戦車・制空権・近代的兵站】",
    description: "ライフル、戦車、戦闘機、近代兵站でファンタジーの軍勢を圧倒！魔法やドラゴンを近代軍事理論と科学的火力投射で完全制圧するおすすめミリタリー異世界ラノベ10選を徹底紹介。",
    category: "近代兵器・自衛隊・ミリタリー戦術",
    leadText: "「中世騎士団の突撃を、重機関銃のキルゾーンと砲兵陣地のアウトレンジ砲撃で完封する」「ドラゴンの航空戦力に対し、対空ミサイルと戦闘機で絶対制空権を確立する」——近代兵器・ミリタリーファンタジーは、圧倒的な火力差と近代的兵站管理がもたらす合理的カタルシスが最大の魅力です。重厚な傑作10選を厳選しました。",
    searchQueries: [
      "ミリタリー 異世界 ラノベ おすすめ",
      "自衛隊 銃 近代兵器 転生 小説 なろう",
      "ゲート 類似作品 現代兵器 ファンタジー",
      "戦車 戦闘機 魔法 制圧 ラノベ"
    ],
    items: [
      {
        keyword: "ゲート 自衛隊 彼の地にて、斯く戦えり",
        rank: 1,
        hook: "【自衛隊の大規模異世界派遣】特地に開いた門の向こうで戦車・戦闘機・近代補給が炸裂！",
        detailedReview: "銀座に開いた異世界の門。派遣された陸上自衛隊が、中世の帝国騎士団や巨大な炎龍に対し、74式戦車、F-4戦闘機、12.7mm重機関銃、近代通信網を駆使して圧倒。外交交渉や文化交流も含めてリアルに描いたミリタリーファンタジーの最高峰です。"
      },
      {
        keyword: "幼女戦記",
        rank: 2,
        hook: "【魔導大戦と近代軍事ドクトリン】クラウゼヴィッツの戦争論と航空魔導歩兵の電撃戦！",
        detailedReview: "合理主義のエリートサラリーマンが幼女ターニャとして魔導大戦下の帝国に転生。前世の近代軍事学、補給管理、統合参謀本部の戦術を駆使し、塹壕戦から航空強襲まで敵国の防衛線を突破していく重厚なミリタリー戦記です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 3,
        hook: "【現代火器と神代技術の魔改造】レールガン、対物狙撃銃、ガトリング、無人偵察ドローン！",
        detailedReview: "南雲ハジメが錬成した近代兵器群。回転式拳銃ドンナーから始まり、電磁加速対物ライフル、6銃身ガトリング砲、四輪駆動装甲車ブリーゼン、軌道衛星兵器まで、地球の兵器知識を神代魔法で究極進化させた兵器無双です。"
      },
      {
        keyword: "ナイト＆マジック",
        rank: 4,
        hook: "【工学設計と機動兵器ドクトリン】新型内骨格と推進機関で巨大人型兵器の戦術を刷新！",
        detailedReview: "エルネスティのメカニック魂。単なるロボット製造にとどまらず、空挺降下部隊、新型魔導砲、飛行戦艦など近代軍事の兵装体系を異世界に導入し、戦争の概念そのものを塗り替える開発アクションです。"
      },
      {
        keyword: "世界最高の暗殺者、異世界貴族に転生する",
        rank: 5,
        hook: "【弾道学と長距離スナイピング】現代の狙撃理論と化学爆薬で勇者すら射程圏内に収める！",
        detailedReview: "ルーグ・トウアハーデが開発した魔導銃火器。風速、地球の自転、重力加速度を計算した超長距離狙撃ライフルやタングステン弾芯の徹甲弾を用い、神話級のターゲットを視界外から確実に仕留めるプロの軍事技術です。"
      },
      {
        keyword: "現実主義勇者の王国再建記",
        rank: 6,
        hook: "【近代兵站とリアルタイム魔導通信】食糧補給網と映像通信で三公の内乱を迅速鎮圧！",
        detailedReview: "ソーマが指揮する王国軍改革。戦闘の勝敗を決める兵站（ロジスティクス）の近代化、街道と港湾の輸送ルート整備、魔導映像通信によるリアルタイム指揮系統を確立し、無駄な血を流さずに勝利を収める戦略ファンタジーです。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 7,
        hook: "【現代資材による土木陣地構築】有刺鉄線、セメントトーチカ、手押しポンプで防衛完備！",
        detailedReview: "日本から大量の建築資材と農業機械を持ち込むカズラ。中世の村に近代的な防衛陣地と用水路を急造し、敵対領主の重装騎士団の突撃を有刺鉄線とバリケードで完璧に挫折させる実践的ミリタリー土木です。"
      },
      {
        keyword: "超人高校生たちは異世界でも余裕で生き抜くようです！",
        rank: 8,
        hook: "【超近代科学兵器の短期製造】中世世界に原子力発電、地対空ミサイル、近代弾薬を配備！",
        detailedReview: "天才発明家や総理大臣を含む7人の高校生たち。中世風異世界において短期間で近代的工場と発電所を建設し、近代兵器とミサイルで圧政を敷く帝国軍を一瞬で殲滅する圧倒的文明格差バトルです。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 9,
        hook: "【核兵器への対抗から生まれた魔導極致】核爆発の熱量と衝撃波を魔力で完全再現する奥義！",
        detailedReview: "前世から「核兵器に勝てる人間」を目指して肉体と魔力を鍛え上げたシド。異世界で完成させた奥義『アイ・アム・アトミック』は、街一つを蒸発させる戦術核兵器そのものの破壊力を誇るスタイリッシュアクションです。"
      },
      {
        keyword: "魔弾の王と戦姫",
        rank: 10,
        hook: "【弓兵集団と近代的戦術機動】風速と射程を計算した集団一斉射撃で騎兵突撃を撃退！",
        detailedReview: "ティグルが率いる弓兵隊の緻密な射撃戦術。地形の起伏を利用したアンブッシュ（待ち伏せ）や、射程の長い黒弓を活かした敵指揮官の精密狙撃で、圧倒的多数の重装騎兵部隊を翻弄する本格戦術絵巻です。"
      }
    ]
  }
];

async function enrichPart27() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart27) {
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
  console.log(`\nBatch features part 27 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart27().catch(console.error);
