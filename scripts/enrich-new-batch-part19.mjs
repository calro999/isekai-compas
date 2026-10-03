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

const batchPart19 = [
  {
    slug: "isekai-reincarnated-curse-item-shop-appraisal-10",
    title: "万能鑑定・アイテム売買・道具屋経営おすすめ異世界ラノベ10選【目利き無双・掘り出し物・富豪サクセス】",
    description: "ゴミ同然のガラクタから伝説の神代遺物を見抜く！万能鑑定スキルで掘り出し物を買い叩き、適正価格と付加価値で大富豪へ成り上がるおすすめ鑑定・道具屋経営異世界ラノベ10選を徹底解説。",
    category: "鑑定スキル・アイテム売買・道具屋",
    leadText: "「誰も価値に気づかない呪われた剣を鑑定し、真の封印を解いて神器へと昇華させる」「露店のガラクタから国宝級の魔導具を格安で買い集めて商会を築く」——万能鑑定・道具屋ファンタジーは、主人公の卓越した眼力による目利き無双と、富が雪だるま式に増えていく商業サクセスの快感が魅力です。至高の10選をお届けします。",
    searchQueries: [
      "鑑定スキル ラノベ おすすめ",
      "道具屋 経営 異世界 小説 なろう",
      "目利き 鑑定 チート アイテム売買",
      "転生貴族 鑑定スキル 類似作品"
    ],
    items: [
      {
        keyword: "転生貴族、鑑定スキルで成り上がる",
        rank: 1,
        hook: "【人の隠れた才能を見抜く神眼】差別されていた少年たちを最強の家臣団へとスカウト！",
        detailedReview: "弱小貴族の長男アルスが得たのは、他人のステータスや隠れた適性を数値で見抜く【鑑定】スキル。差別されていたマルカ人の天才魔法使いリーツや、落ちこぼれ剣士たちを発掘・登用し、最強の領地軍を作り上げていく感動の人材登用ファンタジーです。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 2,
        hook: "【ネットスーパー商品の超高額転売】現代の石鹸・シャンプー・調味料が貴族たちの垂涎の的に！",
        detailedReview: "ムコーダがネットスーパーで仕入れる日用品。中世の異世界ではあり得ない芳香を放つ石鹸やシャンプー、安全で美味しい塩や胡椒を商人エルランドらに卸し、莫大な金貨とギルドでの特別待遇を勝ち取っていく痛快な商業劇です。"
      },
      {
        keyword: "狼と香辛料",
        rank: 3,
        hook: "【目利きと相場心理戦の最高峰】硬貨の純度・麦の先物・毛皮の品質を見極める行商人の知恵！",
        detailedReview: "行商人ロレンスと豊穣の狼神ホロ。各地の通貨に隠された銀の含有率改変や、季節ごとの物資相場の変動を冷静に見極め、悪徳商人の罠を逆手に取って莫大な利益を叩き出す、経済・目利き小説の永遠の金字塔です。"
      },
      {
        keyword: "新米錬金術師の店舗経営",
        rank: 4,
        hook: "【素材鑑定と適正価格の買取】冒険者が持ち込む素材の品質を見極め工房を健全経営！",
        detailedReview: "サラサが営む辺境の店舗。冒険者たちが持ち込む魔物素材や薬草を厳密に鑑定し、鮮度や品質に応じた適正価格で買い取り・加工。村人たちに必要な日用品を適正価格で供給する、リアルで心温まる道具屋経営ストーリーです。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 5,
        hook: "【魔導素材の潜在能力開花】捨て値の魔物素材から革新的な新商品を開発！",
        detailedReview: "ダリヤの卓越した素材知識。他の魔導具師が使い道がないと見捨てていた魔物の革や低品質魔石の隠された特性を活かし、防水布や小型ドライヤーを生み出して大ヒットを連発する職人サクセスです。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 6,
        hook: "【現代資材の価値創出】ホームセンターの道具や肥料が異世界では国宝級の価値に！",
        detailedReview: "日本で40億円分の物資を買い付け、異世界へ持ち込むカズラ。手押しポンプや化学肥料、ビタミン剤の劇的な効果を領主に見せつけ、絶大な信用と領地開発の主導権を手に入れていく文明格差サクセスです。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 7,
        hook: "【ドロップアイテムの相場鑑定】迷宮素材の売買と鍛冶合成で確実な資産形成！",
        detailedReview: "加賀道夫のスキル【鑑定】による魔物ドロップ品の選別。武器商人や奴隷商人と冷静に価格交渉を行い、スキル枠の空いた装備を安く買い取って合成強化するなど、無駄のない徹底した商業プレイが魅力です。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 8,
        hook: "【全アイテムの詳細ステータス看破】古代の遺物や失われた秘宝を各地のバザーで発掘！",
        detailedReview: "サトゥーのチート【全自動鑑定】。露店や蚤の市に転がっている正体不明のガラクタの中から、古代文明の魔導炉や伝説の神器を一瞬で見抜き、格安で回収して自作装備の素材にする目利き無双の楽しさが詰まっています。"
      },
      {
        keyword: "嘆きの亡霊は引退したい",
        rank: 9,
        hook: "【宝具コレクターの無自覚鑑定】見た目が奇妙なガラクタ宝具が世界の危機を救う！",
        detailedReview: "宝具（アーティファクト）の収集が趣味のクライ。効果がよく分からない奇妙な宝具を直感で買い集め、それを適当に仲間に持たせることで、あらゆる難関ボスの特殊攻撃をピンポイントで無効化してしまう痛快コメディです。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 10,
        hook: "【鉱物鑑定と神代魔法の融合】未踏破鉱山から未知の神話級鉱石を発掘・精製！",
        detailedReview: "南雲ハジメの鉱物鑑定スキル。大迷宮の奥深くに眠る未知の重力鉱石や魔力伝導金属を見極め、それらを錬成して前代未聞のレールガンや装甲車両を製造する超一流のクラフト目利きです。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-spirit-beast-summoner-familiar-10",
    title: "召喚士・ファミリア・使役術おすすめ異世界ラノベ10選【古代神獣・式神召喚・使魔無双】",
    description: "異次元の古代神獣、精霊、式神、幻獣を召喚して使役！召喚士としての才能を開花させ、多彩な眷属たちとともに戦局を完全に掌握するおすすめ召喚術・ファミリア使役ラノベ10選を徹底紹介。",
    category: "召喚士・ファミリア・使役術",
    leadText: "「誰も従えられなかった古代の神獣や幻獣を、圧倒的な親和性でファミリアとして召喚する」「無数の式神や精霊を戦場に展開し、単独で一国の大軍勢を包囲する」——召喚士・ファミリア使役ファンタジーは、個性豊かな召喚獣たちとの絆と、多彩な能力を組み合わせた戦術的連携の面白さが最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "召喚士 異世界 ラノベ おすすめ",
      "ファミリア 使魔 契約 小説 なろう",
      "式神 召喚獣 育成 ファンタジー 名作",
      "ビーストテイマー 召喚 チート ラノベ"
    ],
    items: [
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 1,
        hook: "【無数の強力式神を自在使役】魔法世界の誰も見たことがない強力な妖魔や神仏を使役！",
        detailedReview: "朝廷最強の陰陽師だったセイカ。転生先の魔法世界において、紙の呪符から管狐や鬼神、巨大な妖蛇などの式神を召喚。異世界の魔導士たちが感知すらできない呪力空間で敵を完全包囲する圧倒的使役無双です。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 2,
        hook: "【伝説の魔獣たちとの従魔契約】フェンリル、巨大スライム、ピクシードラゴンが大集結！",
        detailedReview: "ムコーダの手料理に胃袋を掴まれた伝説の従魔たち。風の神獣フェンリルのフェル、何でも溶かす食いしん坊スライムのスイ、超音速ピクシードラゴンのドラちゃん。圧倒的な武力と愛嬌を兼ね備えた最強のファミリアたちとの旅路です。"
      },
      {
        keyword: "勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う",
        rank: 3,
        hook: "【最強種たちとの多重契約】猫霊族、竜族、精霊族と次々に絆を結び全能力が爆発！",
        detailedReview: "動物を使役するだけの無能と追放されたレイン。しかし彼の真の才能は、世界に数少ない神話の「最強種」たちと複数同時に契約し、その超常スキルを共有できる規格外の使役能力だったという王道爽快ファンタジーです。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 4,
        hook: "【原初の悪魔召喚と絶対忠誠】悪魔の頂点に立つ原初の黒（ディアブロ）を召喚・臣従！",
        detailedReview: "魔王に進化したリムルが戦場で召喚した「原初の黒」ディアブロ。世界の均衡を崩す神話級の悪魔が、リムルに絶対の崇拝と忠誠を誓い、有能すぎる執事兼最高戦力として敵対国家を恐怖に陥れるカリスマ召喚劇です。"
      },
      {
        keyword: "オーバーロード",
        rank: 5,
        hook: "【高位アンデッド無制限召喚】デス・ナイトや魂喰らい（ソウルイーター）の大軍団展開！",
        detailedReview: "アインズ・ウール・ゴウンのネクロマンシー召喚術。死体媒介によって消滅しない高位アンデッド「デス・ナイト」を量産し、都市を一瞬で壊滅させる「ソウルイーター」を配置するなど、単独で国家滅亡級の召喚無双を誇ります。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 6,
        hook: "【数千匹のスライム軍団使役】クリーナー、スカベンジャー、メタルスライムの連携！",
        detailedReview: "リョウマが契約した多種多様なスライムたち。合体して巨大化するビッグスライムや、毒や酸を操る戦闘スライム、清掃や解体を行う作業スライムたちを緻密に指揮し、生活と戦闘の両面で大活躍させるスローライフです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 7,
        hook: "【精霊獣ポンタとの相棒契約】愛らしい見た目で風を操る緑の綿毛キツネ！",
        detailedReview: "アークの頭の上にちょこんと乗る精霊獣ポンタ（綿毛キツネ）。風魔法でアークの死角をサポートしたり、探知や索敵で大活躍。殺伐とした戦闘の中で最高の一服の清涼剤となる癒やしのファミリアです。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 8,
        hook: "【ダンジョン眷属召喚】DPで召喚した魔物たちが拠点の農業や警備で大活躍！",
        detailedReview: "ユキがダンジョンメニューから召喚する眷属たち。戦闘用のガーゴイルやスケルトンだけでなく、畑仕事を手伝うワーウルフや料理を学ぶ人外娘たちとともに、賑やかで温かな要塞兼ホームを作り上げます。"
      },
      {
        keyword: "ゼロの使い魔",
        rank: 9,
        hook: "【異世界からの使い魔召喚】ゼロのルイズに召喚された平凡な日本男子が伝説のガンダールヴへ！",
        detailedReview: "魔法が使えない落ちこぼれ貴族ルイズが、使い魔召喚の儀式で召喚したのは現代日本の男子高校生・才人。あらゆる武器を神速で扱える伝説の使い魔「ガンダールヴ」として覚醒し、愛と誇りのために戦う伝説の名作です。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 10,
        hook: "【魔物の使役とオート防衛】使えない召喚スキルを工夫して魔物の群れを陽動・誘導！",
        detailedReview: "遥のトリッキーな使役術。知能の低い魔物の習性を逆手に取り、音や光のスキルで敵同士を同士討ちさせたり、野生の魔獣を誘導して敵陣地を襲撃させる、スキルに頼らない頭脳派の使役・誘導戦術が光ります。"
      }
    ]
  }
];

async function enrichPart19() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart19) {
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
  console.log(`\nBatch features part 19 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart19().catch(console.error);
