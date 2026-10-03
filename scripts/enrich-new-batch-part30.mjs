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

const batchPart30Features = [
  {
    id: "isekai-reincarnated-skill-evolution-tree-growth-10",
    slug: "isekai-reincarnated-skill-evolution-tree-growth-10",
    title: "スキル進化・樹形図ツリーおすすめ異世界ラノベ10選【レベルアップ・派生強化・最上位スキルへの覚醒無双】",
    description: "地道な熟練度稼ぎや条件達成で下位スキルが最上位スキルへ劇的進化！スキルツリーの解放と独自ビルドで格上を凌駕していく育成の面白さが詰まった傑作ライトノベルを徹底解説。",
    tags: ["スキル進化", "スキルツリー", "レベルアップ", "育成", "存在進化", "ゲームシステム", "成り上がり", "RPG"],
    items: [
      {
        rank: 1,
        title: "蜘蛛ですが、なにか？",
        author: "馬場翁",
        highlight: "最弱小蜘蛛から『禁忌』『韋駄天』『神格化』へ！過酷な迷宮で生き延びるための怒涛のスキルツリー進化劇",
        reason: "危険度MAXのエルロー大迷宮の底で、糸や毒の熟練度を上げ、次々と上位スキルや進化先を解放していくサバイバル育成の最高峰。スキルポイントのやり繰りと限界突破の快感が極限まで味わえます。"
      },
      {
        rank: 2,
        title: "転生したらスライムだった件",
        author: "伏瀬",
        highlight: "『捕食者』『大賢者』から究極能力（アルティメットスキル）へ！進化と名付けで軍団ごと強くなる爽快感",
        reason: "敵の能力を取り込み統合・進化させるスキルシステムが秀逸。ユニークスキルから究極能力への昇華や、配下の魔物たちへのスキル伝播・種族進化など、育成と拡大の楽しさが圧倒的スケールで描かれます。"
      },
      {
        rank: 3,
        title: "転生したら剣でした",
        author: "棚架ユウ",
        highlight: "魔石を吸収して剣自身がスキルポイントを獲得！黒猫族の少女フランへ能力を授けて共に進化する名コンビ",
        reason: "魔物の魔石を喰らうことで膨大なスキルツリーを拡張し、装備者であるフランのステータスと技を自在に底上げ。地道なスキル合成や進化の試行錯誤がRPG好きの心を熱く掴んで離しません。"
      },
      {
        rank: 4,
        title: "望まぬ不死の冒険者",
        author: "丘野優",
        highlight: "スケルトンから屍食鬼、屍鬼、吸血鬼へ！存在進化によって失われた肉体と新たな異能を積み上げる重厚な旅路",
        reason: "最弱の魔物へ転落した主人公が、魔物を狩り続けて得られる力で段階的に上位種族へと進化していくダークファンタジー。スキルの獲得理由や魔力制御の理論が極めて綿密に構築されています。"
      },
      {
        rank: 5,
        title: "Re:Monster",
        author: "金斬児狐",
        highlight: "ゴブリンから始まる弱肉強食サバイバル！喰らえば喰らうほどスキルが増殖・合成される吸収進化の原点",
        reason: "喰らった生物の能力を身につける『吸喰能力』を駆使し、ゴブリンからオーガ、ロードへと目覚ましい進化を遂げる怪物転生記。日記形式で綴られるステータス上昇とスキル獲得のテンポが病みつきになります。"
      },
      {
        rank: 6,
        title: "モンスターがあふれる世界になったので、好きに生きたいと思います",
        author: "よどかわ",
        highlight: "現実世界に出現した魔物を狩り、スキルポイントで自由にアビリティをツリー強化！リアルサバイバル無双",
        reason: "会社の崩壊とともに始まった世界変異で、コツコツと魔物を倒しスキルツリーを思い通りにカスタマイズしていく楽しさが満載。現代のアイテムとスキルの相乗効果によるビルド構築が秀逸です。"
      },
      {
        rank: 7,
        title: "異世界迷宮でハーレムを",
        author: "蘇我捨恥",
        highlight: "ボーナスポイントでスキルとジョブを最適化！迷宮攻略のための緻密すぎるステータス＆装備ビルド理論",
        reason: "スキル設定やジョブチェンジのルールを徹底的に検証し、最も効率的な戦闘・探索スタイルを論理的に組み立てる究極のシステム派ファンタジー。1つのスキル進化が探索効率を跳ね上げる快感がたまりません。"
      },
      {
        rank: 8,
        title: "劣等人の魔剣使い",
        author: "萩鵜アキ",
        highlight: "劣等人と見下された少年が超高速でスキルツリーを全解放！眠れる魔剣の封印を解き放つ痛快下剋上",
        reason: "世界の誰よりも早くスキルを習得・派生させることができる隠された才能が開花し、理不尽な身分制度をその圧倒的な手数と魔剣技で打破していく王道のスカッと系成り上がりファンタジーです。"
      },
      {
        rank: 9,
        title: "ライブダンジョン！",
        author: "dy冷凍",
        highlight: "ネトゲの最適化理論で異世界の不遇ヒーラーを最前線へ！ヘイト管理とバフスキルツリーの極致",
        reason: "MMORPGの廃人知識を活かし、適切なスキル取得とクールタイム管理によって誰もクリアできなかった高難度迷宮を攻略。スキルの組み合わせによる戦術的勝利のカタルシスが圧倒的です。"
      },
      {
        rank: 10,
        title: "ありふれた職業で世界最強",
        author: "白米良",
        highlight: "魔人化と錬成スキルの極限派生！現代兵器の創造と神代魔法の融合で奈落の底から地上を蹂躙",
        reason: "無能とされた錬成師が魔物の肉を喰らいステータスを爆発的に進化させ、錬成スキルを銃火器や電磁加速器の創造へと派生させていく圧倒的無双。進化とカスタマイズの極致がここにあります。"
      }
    ]
  },
  {
    id: "isekai-reincarnated-alchemy-item-creation-craft-10",
    slug: "isekai-reincarnated-alchemy-item-creation-craft-10",
    title: "錬金術・アイテムクリエイトおすすめ異世界ラノベ10選【素材採取・調合・神級マジックアイテム創造無双】",
    description: "未知の薬草や魔石を採取し、独自の錬金術や魔導工学で奇跡のアイテムを創り出す！ものづくりへの情熱と革新的プロダクトで世界を豊かにする最高峰クラフトライトノベルを徹底解説。",
    tags: ["錬金術", "アイテムクリエイト", "魔導具", "調合", "素材採取", "ポーション", "クラフト", "スローライフ"],
    items: [
      {
        rank: 1,
        title: "魔導具師ダリヤはうつむかない",
        author: "甘岸久弥",
        highlight: "小型魔導コンロから防水布、人工魔剣まで！職人魂と前世のひらめきで人々の生活を一変させる極上のお仕事ファンタジー",
        reason: "魔物の素材や魔石の特性を深く理解し、前世の家電知識と融合させて新たな魔導具を次々と発明していくクラフト描写の圧倒的リアリティ。美味しい料理とワインを囲む職人同士の温かな絆が胸を打ちます。"
      },
      {
        rank: 2,
        title: "本好きの下剋上",
        author: "香月美夜",
        highlight: "植物の繊維から紙を作り、インクを調合し、魔術具を開発！知識と執念で本のある世界を切り拓く不朽の名作",
        reason: "紙のない世界で植物の採取・試作からスタートし、やがて貴族社会を巻き込む魔術具や印刷技術の開発へとスケールアップしていく緻密極まりないものづくり叙事詩。研究と開発の情熱が凝縮されています。"
      },
      {
        rank: 3,
        title: "聖女の魔力は万能です",
        author: "橘由華",
        highlight: "5割増しの超高品質ポーションや化粧品を開発！研究所で薬草を育てる穏やかで尊い異世界スローライフ",
        reason: "召喚された社畜OLが研究所で薬草栽培とポーション作りに没頭し、その異常な効能で騎士団や宮廷を驚嘆させていく癒やしのサクセスストーリー。丁寧な調合手順と甘酸っぱいロマンスが魅力的です。"
      },
      {
        rank: 4,
        title: "新米錬金術師の店舗経営",
        author: "いつきみずほ",
        highlight: "辺境の古民家で念願の錬金術ショップ開店！素材採取から魔導機器の修理、村の防衛までこなす健気な錬金術師",
        reason: "王都の養成学校を卒業した孤児の少女が、辺境の村で店舗を構え、地元住民と交流しながら実用的な薬品や魔導具を作り出す心温まる経営ファンタジー。採算管理や素材採取のサバイバル感も秀逸です。"
      },
      {
        rank: 5,
        title: "鍛冶屋ではじめる異世界スローライフ",
        author: "たままる",
        highlight: "神から授かった『チート生産能力』で万能の農具や名剣を鍛造！森の隠れ家で繰り広げられるものづくりライフ",
        reason: "鉄や魔銀を叩き、使う人の手に完璧に馴染む道具や武具を創り出す職人系ファンタジーの決定版。ケモ耳の少女たちとの穏やかな日常と、生み出した道具が人々の暮らしを劇的に助ける喜びが描かれます。"
      },
      {
        rank: 6,
        title: "ポーション頼みで生き延びます！",
        author: "FUNA",
        highlight: "容器も中身も思い通りの効果を付与できるチートポーション！機転と交渉術で世渡りする痛快コメディ",
        reason: "どんな病気や怪我も一瞬で治す神薬から若返りの秘薬まで、自由自在に創り出せる能力で教会や貴族を手玉に取る痛快な展開。主人公カオルの抜け目のない頭脳プレイとテンポの良い会話が最高です。"
      },
      {
        rank: 7,
        title: "チート薬師のスローライフ",
        author: "ケンノジ",
        highlight: "『創薬』スキルで傷薬からエナジードリンク、超強力殺虫剤まで開発！町の人々のお悩みを解決するほのぼの日常",
        reason: "街でドラッグストアを開業した青年が、異世界の常識を覆す便利で美味しい薬を次々と調合。狼少女のノエラをはじめとする愛らしい仲間たちと過ごす平和で優しいスローライフが癒やしてくれます。"
      },
      {
        rank: 8,
        title: "治癒魔法の間違った使い方",
        author: "くろかた",
        highlight: "自己治癒しながら筋トレで超肉体へ！回復魔法を格闘技と治癒弾へと昇華させた異端の戦場救命劇",
        reason: "治癒魔法の常識を打ち破り、肉体強化と組み合わせることで戦場を駆け巡る無敵の救命要員へと成長。アイテムや魔法の用途を別角度から再定義するクリエイティブな発想が痛快です。"
      },
      {
        rank: 9,
        title: "錬金貴族の領地経営",
        author: "三島千廣",
        highlight: "ハズレ属性とされた錬金術で荒れ地を肥沃な大地へ大改革！素材合成と科学的思考で領民を幸福にする内政劇",
        reason: "貴族家を追放された少年が、錬金術による土壌改良や新素材の合成によって貧しい領地を瞬く間に一大特産地へと成長させる爽快な領地経営。ものづくりが経済を動かすダイナミズムが味わえます。"
      },
      {
        rank: 10,
        title: "異世界のんびり素材採取生活",
        author: "錬金王",
        highlight: "チートな『素材鑑定＆採取』スキルで珍しい植物や鉱石をのんびりハント！美味しいご飯と自由気ままな旅",
        reason: "戦闘よりも未知の素材採取と自然の恵みを楽しむマイペースな冒険譚。集めた素材で便利な道具を作ったり美味しい郷土料理を味わったりする、肩の力を抜いて楽しめる極上のスローライフです。"
      }
    ]
  }
];

async function run() {
  const raw = fs.readFileSync(FEATURES_JSON_PATH, 'utf-8');
  let data = JSON.parse(raw);
  let features = Array.isArray(data) ? data : data.features;

  for (const feature of batchPart30Features) {
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
  console.log(`\nBatch features part 30 successfully fetched and updated! Total features: ${features.length}`);
}

run();
