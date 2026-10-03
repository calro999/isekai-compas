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
        publisherName: item.publisherName || 'Kobo'
      };
    }
  } catch (err) {
    console.error(`  Books error for ${keyword}:`, err.message);
  }

  return null;
}

const batchPart32Features = [
  {
    id: "isekai-reincarnated-banished-awakening-revenge-10",
    slug: "isekai-reincarnated-banished-awakening-revenge-10",
    title: "追放・覚醒・ざまぁおすすめ異世界ラノベ10選【無能と虐げられた真のチート能力が開花！痛快大逆転劇】",
    description: "理不尽にパーティーや家から追放された主人公が、隠された真の才能や規格外チートを開花させて大逆転！見捨てた者たちの後悔と主人公の圧倒的サクセスが痛快な傑作ライトノベルを徹底解説。",
    tags: ["追放", "覚醒", "ざまぁ", "成り上がり", "下剋上", "チート開花", "痛快", "大逆転"],
    items: [
      {
        rank: 1,
        title: "勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う",
        author: "深山鈴",
        highlight: "ただの雑用係と追放された男は万物を使役する神級テイマー！最強種の美少女たちと紡ぐ心温まる無双譚",
        reason: "パーティーから侮られ追放されたレインが、最強種である猫耳少女奏と契約したことで真のチートスペックを開花。理不尽な元パーティーが崩壊していくざまぁと、新たな仲間との温かい絆の対比が心地よい名作です。"
      },
      {
        rank: 2,
        title: "パーティーから追放されたその治癒師、実は最強につき",
        author: "影茸",
        highlight: "最弱と罵られ追放されたヒーラーは超攻撃型武闘派！常識外れの自己バフと格闘術で無双する爽快アクション",
        reason: "回復しか能がないと見捨てられたラウストが、実は卓越した回避術と独自の戦闘理論を持つ怪物だったという大逆転劇。不遇時代を支え合った仲間と共に頂点へと駆け上がるサクセスロードが熱いです。"
      },
      {
        rank: 3,
        title: "追放された転生重騎士はゲーム知識で無双する",
        author: "猫子",
        highlight: "ハズレ職の重騎士と見なされ追放！しかし前世のゲーム知識で『最強の迎撃要塞』へとビルド構築",
        reason: "世間では役立たずと蔑まれている重騎士の真の凶悪コンボを熟知した主人公が、精密なスキル配分とボス攻略法で周囲の度肝を抜く知性派ファンタジー。システムをハックする快感が抜群です。"
      },
      {
        rank: 4,
        title: "万能スキル『器用貧乏』が実は最強でした",
        author: "機知とんち",
        highlight: "何でもできるが特化がないと追放された男！全スキルのシナジーで神話級の威力を発揮する万能無双",
        reason: "器用貧乏と切り捨てられたスキルが、あらゆる魔法や剣技の前提条件を満たす究極のマルチタレントだったという爽快感。一人でパーティー全員分以上の役割をこなす万能っぷりに惚れ惚れします。"
      },
      {
        rank: 5,
        title: "冒険者をクビになったので、錬金術師として出直します！",
        author: "佐々木さざめき",
        highlight: "戦闘不能のポンコツ扱いから一転！神代のレシピを再現する天才錬金術師としての独立起業ライフ",
        reason: "冒険者パーティーを追い出された青年が、祖父の工房を継いで超高品質ポーションや魔導具を次々と世に送り出し、国中の要人から引っ張りだこになる痛快なものづくり成り上がり劇です。"
      },
      {
        rank: 6,
        title: "Sランクパーティから解雇された【呪具師】",
        author: "小林虎千代",
        highlight: "味方に気づかれず超強力バフ呪具を配り続けていた男！解雇された途端に元パーティは壊滅へ",
        reason: "呪具の副作用を完璧に制御し、パーティの屋台骨を支えていた主人公。彼を追い出した愚かな仲間たちが一瞬で没落していく鮮烈なざまぁ展開と、主人公の自由気ままな新生活が最高に痛快です。"
      },
      {
        rank: 7,
        title: "「お前ごときが魔王に勝てると思うな」と勇者パーティを追放されたので、王都で気ままに暮らしたい",
        author: "kiki",
        highlight: "ステータスゼロの無能少女が『反転』スキルで神域へ！ダークで凄惨な運命をぶち壊す圧倒的執念",
        reason: "狂気の勇者パーティから拷問同然に追放されたフラムが、呪いと反転の力で超常のステータスを手に入れ、自らを陥れた者たちを圧倒していく重厚かつ鮮烈なダークファンタジーの傑作です。"
      },
      {
        rank: 8,
        title: "劣等眼の転生魔術師",
        author: "柑橘ゆすら",
        highlight: "琥珀色の瞳を見下す愚者たちを古代魔術で一蹴！数百年後の世界で繰り広げられる無双スクールライフ",
        reason: "かつて最強と謳われながら自らを封印した魔術師が、魔法技術が衰退し劣等眼と差別される未来で目覚め、常識外れの古代魔術で無知なエリートたちを軽々と凌駕していく王道の爽快劇です。"
      },
      {
        rank: 9,
        title: "追放された落ちこぼれ、実は世界最強の魔術士でした",
        author: "御子柴奈々",
        highlight: "魔力ゼロの烙印を押された少年は、概念そのものを斬り裂く真の規格外だった！圧倒的無双ファンタジー",
        reason: "測定不能の魔力ゆえに無能と判定され実家を追放された主人公が、真の実力を発揮して国家存亡の危機をあっさり救ってしまう痛快な下剋上。敵を寄せ付けない絶対的強者感が魅力です。"
      },
      {
        rank: 10,
        title: "クラス最安値で売られた俺は、実は最強パラメーター",
        author: "RYOMA",
        highlight: "召喚奴隷として二束三文で買われた男が、神話級の隠しパラメータで世界を震撼させる痛快冒険譚",
        reason: "オークションで最低値評価を受けた主人公が、実はあらゆるステータスがカンストしたチート存在だったという爽快な導入。自分を安売りした者たちを見返す圧倒的パワープレイが楽しめます。"
      }
    ]
  },
  {
    id: "isekai-reincarnated-magic-science-steampunk-weapon-10",
    slug: "isekai-reincarnated-magic-science-steampunk-weapon-10",
    title: "魔導科学・スチームパンク・兵器開発おすすめ異世界ラノベ10選【現代の科学理論と魔法を融合！超文明無双】",
    description: "前世の工学・物理学・兵器工学の知識と異世界の魔力や魔鉱石が奇跡の融合！ロボット、蒸気機関、近代銃火器から魔導航空母艦まで、未知の超技術で世界を変革する傑作SFファンタジーを徹底解説。",
    tags: ["魔導科学", "スチームパンク", "兵器開発", "科学チート", "ロボット", "工学", "近代兵器", "技術革新"],
    items: [
      {
        rank: 1,
        title: "ナイツ＆マジック",
        author: "天酒之瓢",
        highlight: "重度のロボットオタクが異世界で巨大魔導ロボット（幻晶騎士）を開発！工学理論と情熱で創る新時代",
        reason: "プログラマーとしての知識と異常なロボット愛を武器に、魔導演算エンジンや新型可変フレームを次々と発明。異世界の戦争形態そのものを塗り替えていく爽快感とメカニック描写の緻密さが最高峰です。"
      },
      {
        rank: 2,
        title: "GATE 自衛隊 彼の地にて、斯く戦えり",
        author: "柳内たくみ",
        highlight: "銀座に出現した異世界へ陸上自衛隊が突入！近代兵器の圧倒的火力と戦術でドラゴンや軍勢を圧倒",
        reason: "小銃、戦車、戦闘機といった現代兵器と異世界の魔法・ファンタジー生物が激突するミリタリーの金字塔。兵站や政治交渉を含めたリアルな描写と、圧倒的な制空権・火力制圧のカタルシスが圧巻です。"
      },
      {
        rank: 3,
        title: "魔導具師ダリヤはうつむかない",
        author: "甘岸久弥",
        highlight: "家電製品のアイデアを魔導回路で具現化！職人のひらめきと魔物素材研究で暮らしを豊かにする極上作",
        reason: "前世の物理・電気の知識を魔導具の回路設計に応用し、小型給湯器から遠征用乾燥機、人工魔剣まで発明。科学的アプローチによる素材実験と職人魂の融合が知的好奇心を刺激します。"
      },
      {
        rank: 4,
        title: "幼女戦記",
        author: "カルロ・ゼン",
        highlight: "魔導宝珠と近代兵器戦術の極致！徹底的な合理主義で戦場を支配する空戦魔導大隊の狂気",
        reason: "物理学と計算科学を駆使して演算宝珠の限界性能を引き出し、ライフルや航空戦術と組み合わせた立体機動戦闘を展開。ミリタリー戦史と魔導技術のハイレベルな融合に圧倒されます。"
      },
      {
        rank: 5,
        title: "ありふれた職業で世界最強",
        author: "白米良",
        highlight: "錬成魔法で電磁加速砲（レールガン）や武装バイクを自作！神代魔法と現代兵器のハイブリッド殲滅",
        reason: "奈落の底で採取した希少鉱石を錬成し、リボルバー拳銃から衛星レーザー兵器まで開発。圧倒的な科学技術と規格外の魔力を融合させた容赦ない無双バトルが熱狂的人気を誇ります。"
      },
      {
        rank: 6,
        title: "機巧少女は傷つかない",
        author: "海冬レイジ",
        highlight: "魔術回路を内蔵した自動人形（オートマトン）！魔導と機械工学が織りなす極上の学園バトルファンタジー",
        reason: "19世紀末の英国を模したスチームパンク風の世界観で、機巧魔術の最高峰『夜会』を舞台に美しき自動人形夜々と共に頂点を目指す。精密な人形機構と熱い魂のぶつかり合いが秀逸です。"
      },
      {
        rank: 7,
        title: "魔法科高校の劣等生",
        author: "佐島勤",
        highlight: "現代科学の理論体系で魔法を完全に体系化！CAD（術式補助演算機）と核融合級魔法を操る達也の無双",
        reason: "魔法をオカルトではなく物理法則の改変技術として徹底的に理論づけたSFファンタジーの金字塔。達也の生み出す革新的なCAD設計と戦略級魔法の圧倒的威力に酔いしれます。"
      },
      {
        rank: 8,
        title: "銃皇無尽のファフニール",
        author: "ツカサ",
        highlight: "巨大なドラゴンを物質変換兵器と銃火器で討つ！精密射撃と物質生成によるタクティカルバトル",
        reason: "上位存在であるドラゴンに対抗するため、物質変換能力を駆使して対物ライフルやレールガンを生成し戦術的に弱点を突くミリタリーアクション。頭脳派の戦闘スタイルが光ります。"
      },
      {
        rank: 9,
        title: "異世界迷宮の最深部を目指そう",
        author: "割内タリサ",
        highlight: "魔力操作を次元物理的に解釈！極限の絶望迷宮を卓越した理詰めと狂気の執念で踏破する傑作",
        reason: "ゲーム的な迷宮の仕様と魔力法則を極限まで論理的に解析し、独自の次元魔法や剣技を編み出して死線を越えていく重厚な冒険譚。緻密な設定と魂を削る心理描写が唯一無二です。"
      },
      {
        rank: 10,
        title: "神達に拾われた男",
        author: "Roy",
        highlight: "スライムの生体反応と化学知識を融合！石炭抽出から防水素材、衛生インフラまで開発する生産無双",
        reason: "前世の化学や工業知識を活かしてスライムの体液や分解能力を応用し、異世界に新たな素材産業やリサイクル技術を定着させる。温かな日常の中に光る科学的工夫の数々が楽しい名作です。"
      }
    ]
  }
];

async function run() {
  const raw = fs.readFileSync(FEATURES_JSON_PATH, 'utf-8');
  let data = JSON.parse(raw);
  let features = Array.isArray(data) ? data : data.features;

  for (const feature of batchPart32Features) {
    console.log(`\n=== Fetching Rakuten data for feature: [${feature.id}] ${feature.title} ===`);
    const enrichedItems = [];
    
    for (const item of feature.items) {
      const rakutenData = await searchRakuten(item.title);
      await sleep(1050); // 楽天APIレートリミット対策
      enrichedItems.push({
        ...item,
        rakuten: rakutenData
      });
    }

    const featureObject = {
      ...feature,
      items: enrichedItems,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = features.findIndex(f => f.id === feature.id);
    if (existingIndex >= 0) {
      features[existingIndex] = featureObject;
    } else {
      features.push(featureObject);
    }
  }

  if (Array.isArray(data)) {
    data = features;
  } else {
    data.features = features;
  }

  fs.writeFileSync(FEATURES_JSON_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`\nBatch features part 32 successfully fetched and updated! Total features: ${features.length}`);
}

run();
