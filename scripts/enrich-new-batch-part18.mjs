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

const batchPart18 = [
  {
    slug: "isekai-reincarnated-curse-unarmed-brawler-10",
    title: "格闘家・素手・体術無双おすすめ異世界ラノベ10選【正拳突き・徒手空拳・物理で魔法を粉砕】",
    description: "武器も魔法も不要！極限まで鍛え抜かれた肉体、神速の打撃、合気、徒手空拳で神話級モンスターや傲慢な魔術師を叩き伏せるおすすめ格闘家・肉体無双異世界ラノベ10選を徹底解説。",
    category: "格闘家・素手・肉体無双",
    leadText: "「派手な呪文を唱える魔術師の懐に一瞬で潜り込み、強烈なボディブロー一発で沈める」「鋼鉄のドラゴンの鱗を素手の正拳突きで粉砕する」——格闘家・体術無双ファンタジーは、魔法やチート武器に頼らず己の拳と肉体のみで理不尽を叩き割る爽快感と武のロマンが最大の魅力です。熱き血潮がたぎる傑作10選をお届けします。",
    searchQueries: [
      "格闘家 異世界 ラノベ おすすめ",
      "素手 徒手空拳 転生 小説 なろう",
      "空手 拳闘 魔法 物理で粉砕 ファンタジー",
      "肉体最強 体術チート ラノベ"
    ],
    items: [
      {
        keyword: "空手バカ異世界",
        rank: 1,
        hook: "【空手一筋・魔法全否定】トラックに撥ねられた空手家が正拳突き一つでドラゴンを粉砕！",
        detailedReview: "チートスキルや魔法の付与を「我が空手を汚すもの」と一切拒否して異世界に降り立った空手家。ゴブリン、オーガ、果ては天変地異を引き起こす古代竜に対し、愚直に鍛え上げた正拳突き、下段蹴り、受け返しの技術のみで真っ向勝負を挑む痛快無比な空手巨編です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 2,
        hook: "【古流武術の体捌きと金剛打撃】奈落の化け物の肉体スペックと格闘術の圧倒的暴力！",
        detailedReview: "銃火器の使い手でありながら、南雲ハジメの真の強さは奈落で極限まで鍛え上げられた近接格闘能力。【金剛】で硬化させた拳での打撃や古流武術の関節技、超重量を乗せたパイルブローで神の使徒たちを完膚なきまでに叩き伏せます。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 3,
        hook: "【超高速フットワークとカウンター】一撃死のプレッシャーを神業のステップと打撃で制す！",
        detailedReview: "サンラクの超人的な格闘センス。武器の間合いのみならず、飛び蹴り、バックステップ、パリィからのカウンター打撃など、プレイヤー自身の卓越した反射神経と体術で神話級モンスターを翻弄するアクションの最高峰です。"
      },
      {
        keyword: "痛いのは嫌なので防御力に極振りしたいと思います。",
        rank: 4,
        hook: "【要塞少女のボディプレスと悪食】物理攻撃を一切受け付けず、体当たり一つで敵を消滅！",
        detailedReview: "防御力（VIT）極振りのメイプル。攻撃力ゼロのはずが、巨大化スキルや毒龍（ヒドラ）の肉体変化、さらには全身兵器化によって、体当たりや盾の殴打で敵陣を丸ごと吹き飛ばす唯一無二の肉体無双を誇ります。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 5,
        hook: "【木の棒による神速打撃と歩法】ステータス皆無のぼっちが極限の体捌きで魔王軍を翻弄！",
        detailedReview: "ステータスが全て『マイナス』や『測定不能』の遥。しかし死線を潜り抜けて体得した超人的な間合い感覚と神速の足捌きにより、敵の攻撃を紙一重でかわしながら木の棒の痛烈な打撃を急所に叩き込みます。"
      },
      {
        keyword: "オーバーロード",
        rank: 6,
        hook: "【百合咲くメイド・セバスの素手格闘】龍神の拳で王都の裏社会の暗殺者たちを一瞬で殲滅！",
        detailedReview: "ナザリック地下大墳墓の執事セバス・チャン。武器を一切持たず、洗練された素手格闘（モンク技）と気功波のみで、王都最強を誇る「六腕」の達人たちを呼吸一つで全員瞬殺する姿は作品屈指の爽快感を誇ります。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 7,
        hook: "【オーガ族の剛力打撃と武術指南】シオンの剛力無双とハクロウの気闘法による肉体強化！",
        detailedReview: "鬼人族のシオンやベニマルたちの驚異的な身体能力。【剛力】スキルによる素手の破壊力や、ハクロウ直伝の気闘法によって、魔法障壁を拳の衝撃波で突き破る大迫力の肉弾バトルが繰り広げられます。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 8,
        hook: "【神聖気を纏う鉄拳制裁】巨大大剣を置き、素手のラリアットで凶悪モンスターを吹き飛ばす！",
        detailedReview: "大剣の使い手であるアークだが、相手を殺さずに制圧する場面では卓越した体術と気功波を駆使。盗賊や悪徳衛兵たちを素手の一撃で壁に叩きつける頼もしすぎる聖騎士の肉体スペックが光ります。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 9,
        hook: "【心臓の鼓動と指先一つで圧倒】魔法を使うまでもない！指先を弾くだけで空間を破砕！",
        detailedReview: "アノス・ヴォルディゴードの規格外の身体能力。魔法を詠唱する敵に対し、指先を軽く弾いた衝撃波で城壁ごと粉砕し、心臓の鼓動音だけで相手の全身を麻痺させる、格闘・肉体スペックの概念を超越した無双劇です。"
      },
      {
        keyword: "Re:Monster",
        rank: 10,
        hook: "【オーガの巨躯と千変万化の打撃】吸喰能力で獲得した無数の格闘スキルで軍勢を蹂躙！",
        detailedReview: "最弱ゴブリンからオーガ、使徒種へと進化したゴブ朗。硬化した皮膚と強靭な筋肉、そして喰らった武術家たちの格闘スキルを総動員し、素手の打撃とタックルで敵の重装甲兵団をなぎ倒していきます。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-territory-defense-fortress-10",
    title: "拠点防衛・籠城戦・要塞都市おすすめ異世界ラノベ10選【絶対防衛ライン・罠連鎖・物量撃退】",
    description: "押し寄せる数十万の魔物や敵国大軍勢を、難攻不落の要塞・緻密な罠・防衛兵器で完封！おすすめ拠点防衛・籠城戦・要塞都市ラノベ10選を徹底紹介。",
    category: "拠点防衛・籠城戦・要塞都市",
    leadText: "「圧倒的な兵力差を、地形と防衛設備を駆使して完膚なきまでに撃退する」「迷宮の罠を連鎖させ、侵入した勇者や軍勢を一歩も通さず壊滅させる」——拠点防衛・要塞ファンタジーは、知略と準備がもたらす『絶対防衛』の安心感と、敵の絶望的な顔を見下ろすカタルシスが最大の魅力です。鉄壁の傑作10選を厳選しました。",
    searchQueries: [
      "拠点防衛 ラノベ おすすめ",
      "籠城戦 異世界 要塞都市 小説 なろう",
      "タワーディフェンス 罠 迷宮 防衛 ファンタジー",
      "防衛戦 大軍撃退 戦略 ラノベ"
    ],
    items: [
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 1,
        hook: "【最凶トラップと防衛ライン】侵入者を誘導して落とし穴・毒ガス・覇王竜で迎撃！",
        detailedReview: "ダンジョンポイント（DP）を使って迷宮を拡張するユキ。侵入者の心理を読んだ巧妙な通路設計、連鎖する属性トラップ、そして最奥に控える最強覇王竜レフィによって、帝国軍や名うての冒険者たちを一人残らず迎撃・撃退する究極のダンジョンディフェンスです。"
      },
      {
        keyword: "オーバーロード",
        rank: 2,
        hook: "【ナザリック地下大墳墓・八階層の絶対防衛】過去に1500人のプレイヤー連合を全滅させた難攻不落！",
        detailedReview: "第1階層から第10階層まで各所に配置された神話級トラップと階層守護者。かつて全盛期のゲーム時代に侵入した1500人のプレイヤー連合軍を第8階層で全滅させた伝説の要塞防衛劇と、異世界の侵入者を冷徹に迎撃する圧倒的要塞美が描かれます。"
      },
      {
        keyword: "現実主義勇者の王国再建記",
        rank: 3,
        hook: "【要塞都市の防衛ラインと補給戦】赤字国家の防衛拠点を近代兵站と通信網で死守！",
        detailedReview: "ソーマが断行した防衛インフラ整備。三公との内乱や敵国の侵略に対し、要塞都市アルテナを拠点とした防衛ラインを構築。魔導映像通信網によるリアルタイム指揮と迅速な補給部隊の連携で、圧倒的多数の敵軍を最小限の被害で撃退します。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 4,
        hook: "【テンペスト地下迷宮100階層】ラミリスと共同開発した死なない迷宮防衛システム！",
        detailedReview: "リムルとラミリスが創り上げた100階層の地下迷宮。復活の腕輪による安全なアトラクションでありながら、帝国軍侵攻時には最凶の防衛要塞へと変貌。帝国軍30万の兵士たちを各階層の守護者たち（ヴェルドラ、ゼギオン、クマラ等）が完璧に各個撃破します。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 5,
        hook: "【現代資材による要塞化】有刺鉄線、セメント防壁、手押しポンプで村を完全防衛！",
        detailedReview: "日本のホームセンターから持ち込んだ建築資材と道具。イステール領の村に頑強なコンクリート防壁や有刺鉄線バリケードを急造し、敵対領主の騎兵部隊や凶悪な野盗の突撃を完璧に跳ね返すリアル志向の土木防衛戦です。"
      },
      {
        keyword: "幼女戦記",
        rank: 6,
        hook: "【ライン戦線の塹壕陣地死守】近代火砲と魔導工兵による圧倒的火力投射防衛！",
        detailedReview: "帝国西部の最前線・ライン戦線。泥濘の塹壕とトーチカに身を潜め、敵軍の波状攻撃を計算し尽くされた砲撃座標と航空魔導大隊の精密射撃で食い止める、息詰まる総力戦・陣地防衛戦の傑作です。"
      },
      {
        keyword: "ゲート 自衛隊 彼の地にて、斯く戦えり",
        rank: 7,
        hook: "【アルヌスの丘要塞防衛】中世十万の大軍勢を近代火器のキルゾーンで完封！",
        detailedReview: "特地の拠点「アルヌスの丘」に設営された自衛隊の防衛陣地。夜間に押し寄せた異世界連合軍十万に対し、暗視装置、迫撃砲、重機関銃を連動させた多重防御ラインで完璧に防圧・迎撃する近代戦術の圧倒的勝利です。"
      },
      {
        keyword: "異世界のんびり農家",
        rank: 8,
        hook: "【大樹の村の自然要塞】インフェルノウルフとデーモンスパイダーが守る絶対不可侵領域！",
        detailedReview: "ヒラクが暮らす大樹の村の防衛網。村を囲む防壁と堀に加え、森最強のクロたち（インフェルノウルフ）とザブトン（デーモンスパイダー）が全方位を監視。侵入しようとした凶悪ワイバーンや不埒な侵入者を瞬時に拘束・制圧します。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 9,
        hook: "【仮設拠点の多重トラップ防衛】木の枝とゴミスキルで作る即席の絶対防御陣地！",
        detailedReview: "森の中で孤立する遥が築いた仮設拠点。滑る床、落とし穴、自動迎撃ワイヤーなどを組み合わせたトリッキーなトラップ網を張り巡らせ、夜間に襲来する凶悪モンスターたちを一切中に入れずに自滅させる知略ディフェンスです。"
      },
      {
        keyword: "悪役令嬢の執事様",
        rank: 10,
        hook: "【公爵領の防衛結界と私兵配備】暗殺者や敵対貴族の私兵を屋敷の防犯網で一網打尽！",
        detailedReview: "ソフィアを守るため、シリルが屋敷と領都に施した多重防犯結界と監視網。侵入した不審者を無音で捕縛・尋問し、お嬢様の平穏な日常を1ミリも脅かさせない完璧なホームディフェンスです。"
      }
    ]
  }
];

async function enrichPart18() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart18) {
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
  console.log(`\nBatch features part 18 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart18().catch(console.error);
