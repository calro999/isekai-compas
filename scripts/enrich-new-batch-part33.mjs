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

const batchPart33Features = [
  {
    id: "isekai-reincarnated-assassin-shadow-executioner-10",
    slug: "isekai-reincarnated-assassin-shadow-executioner-10",
    title: "異世界暗殺者・影の執行者おすすめ異世界ラノベ10選【表は名門貴族、裏は冷徹な処刑人！暗躍ステルス無双】",
    description: "現代の最高峰暗殺術と異世界の魔法が融合！表舞台の身分を完璧に演じ分けながら、夜の闇で悪を裁きターゲットを確実に抹殺する痛快ステルス＆暗殺アクション傑作ライトノベルを徹底解説。",
    tags: ["暗殺者", "ステルス", "影の執行者", "暗殺貴族", "裏稼業", "処刑人", "知略バトル", "無双"],
    items: [
      {
        rank: 1,
        title: "世界最高の暗殺者、異世界貴族に転生する",
        author: "月夜涙",
        highlight: "現代世界で暗殺の極致に至った伝説の男が貴族の暗殺一家へ転生！魔法と近代狙撃理論で勇者を救う任務",
        reason: "魔法を物理法則や化学反応として再構築し、風魔法による超長距離狙撃や遠隔毒殺を完成させるプロフェッショナルな暗殺描写が圧巻。ヒロインたちを育成し完璧な暗殺チームを組織していく緻密さが魅力です。"
      },
      {
        rank: 2,
        title: "暗殺者である俺のステータスが勇者よりも明らかに強いのだが",
        author: "赤井てら",
        highlight: "クラス転移で得た影の暗殺者適性がカンスト！勇者たちを影から守りながら真の黒幕を狩る痛快劇",
        reason: "存在感が薄いことを利用した完璧なステルス能力と、あらゆる敵を一撃で仕留める致命の一撃。表舞台に出ることなく、傲慢な勇者たちの裏で世界の危機を人知れず解決していくクールな活躍が爽快です。"
      },
      {
        rank: 3,
        title: "陰の実力者になりたくて！",
        author: "逢沢大介",
        highlight: "普段は平凡なモブを完璧に演じ、夜は漆黒の外套を纏うシャドウ様！圧倒的実力と究極の勘違いコメディ",
        reason: "『陰の実力者』というロールプレイを極限まで楽しむシドの規格外の武力と、彼が適当についた嘘がすべて世界の真実と合致していく神がかり的なストーリーテリング。スタイリッシュな戦闘描写が最高に熱いです。"
      },
      {
        rank: 4,
        title: "処刑少女の生きる道",
        author: "佐藤真登",
        highlight: "世界に厄災をもたらす転生者を密かに処刑する神官少女！純白の法衣の裏に隠された冷徹な使命",
        reason: "無邪気にチート能力を振りかざす異世界転生者を、緻密な罠と神聖術で確実に抹殺する異色のダークファンタジー。不死の能力を持つターゲットとの息詰まる頭脳戦と心理描写が読者を惹きつけます。"
      },
      {
        rank: 5,
        title: "勇者刑に処す 懲罰勇者9004隊刑務記録",
        author: "ロケット商会",
        highlight: "聖騎士団長を暗殺した『大罪人』ザイロ！何度死んでも蘇生され最前線で魔王軍を狩り続ける極限の死闘",
        reason: "過酷な戦場で冷徹な判断力と卓越した戦闘術を発揮し、絶望的な状況を生き延びる主人公のハードボイルドな佇まいが圧巻。重厚で緊迫感あふれる戦場描写と復讐のドラマが心を揺さぶります。"
      },
      {
        rank: 6,
        title: "影の英雄の日常譚",
        author: "坂石遊作",
        highlight: "魔王軍を影から単独で壊滅させた元裏部隊の英雄！平穏な隠居生活を脅かす刺客を静かに始末する余裕",
        reason: "世界を救った最強の暗殺工作員が、田舎でマイホームを買ってのんびり暮らそうとする日常系×無双劇。自分や大切な人々に害をなそうとする悪党を、痕跡を残さず瞬殺する大人の強者感がたまりません。"
      },
      {
        rank: 7,
        title: "黒の召喚士",
        author: "迷井豆腐",
        highlight: "隠蔽と高速機動を極めた戦闘狂！神速の体術と影魔法で強敵の急所を的確に穿つ爽快バトル",
        reason: "召喚士でありながら自ら最前線に立ち、隠蔽スキルと影潜伏を駆使して敵の虚を突くバトルスタイル。相手の力量を見極め、一切の油断なく確実に仕留める研ぎ澄まされた戦術が痛快です。"
      },
      {
        rank: 8,
        title: "ありふれた職業で世界最強",
        author: "白米良",
        highlight: "奈落の底で培ったステルス索敵と超長距離レールガン狙撃！敵対者は根絶やしにする容赦なき殲滅",
        reason: "気配遮断と遠隔索敵の極意を身につけ、敵が気づく前に数キロ先から消滅させる圧倒的な暗殺・狙撃能力。甘さを捨て去り自らの信念のために冷徹に行動するハジメの覚悟が光ります。"
      },
      {
        rank: 9,
        title: "劣等眼の転生魔術師",
        author: "柑橘ゆすら",
        highlight: "神速の暗殺魔術と影渡りで学園の裏に潜む魔族を粛清！古代の暗殺技術を操る絶対的強者",
        reason: "平穏な学園生活を装いながら、夜間に暗躍する魔族や犯罪組織を古代の暗殺術で次々と排除。周囲の誰も正体に気づかないまま、圧倒的な実力差で脅威を排除していく無双ぶりが楽しめます。"
      },
      {
        rank: 10,
        title: "オーバーロード",
        author: "丸山くがね",
        highlight: "アサシン特化の暗殺忍者・弐式アレンの遺産！ナザリック裏工作部隊による完璧な暗殺と情報操作",
        reason: "影に潜む暗殺蟲やシャドウ・デーモンを駆使した情報収集と要人暗殺。敵対組織の内部に完璧に入り込み、誰にも気づかれずに壊滅へと追い込む軍事ストラテジーの完成度が圧倒的です。"
      }
    ]
  },
  {
    id: "isekai-reincarnated-modern-knowledge-kingdom-rebuilding-10",
    slug: "isekai-reincarnated-modern-knowledge-kingdom-rebuilding-10",
    title: "現代知識・内政チートおすすめ異世界ラノベ10選【中世異世界のインフラ・経済・法制度を大改革！国家再建無双】",
    description: "現代の法学・経済学・農学・土木技術の知識を駆使して、破滅寸前の王国や貧しい寒村を大繁栄へと導く！武力だけでなく頭脳と制度改革で世界を豊かにする最高峰の内政・国家再建ライトノベルを徹底解説。",
    tags: ["内政チート", "現代知識", "国家再建", "領地経営", "経済改革", "インフラ整備", "制度改革", "頭脳戦"],
    items: [
      {
        rank: 1,
        title: "現実主義勇者の王国再建記",
        author: "どぜう丸",
        highlight: "勇者召喚された文系青年に王位が禅譲！行政改革、食糧危機解決、人材登用で破綻国家を立て直す名作",
        reason: "マキアヴェッリの君主論や近代行政学を参考に、腐敗した貴族を統制し、道路網の整備や水害対策を次々と実行。武力衝突を最小限に抑えながら経済と外交で勝利を収める本格的な内政劇が圧巻です。"
      },
      {
        rank: 2,
        title: "本好きの下剋上",
        author: "香月美夜",
        highlight: "紙の製造から印刷工房の設立、識字率向上と経済圏創出！貧民街から貴族社会の産業構造を変革する叙事詩",
        reason: "植物の採取から始まった紙作りが、やがて大商人や領主を巻き込む巨大産業へと発展。特許や著作権の概念を持ち込み、領地の財政基盤を根本から強化していく緻密極まりない経済描写が秀逸です。"
      },
      {
        rank: 3,
        title: "転生したらスライムだった件",
        author: "伏瀬",
        highlight: "魔物と人間が共生する理想の近代国家を建設！上下水道、街道整備、物流ハブ化で世界経済の中心へ",
        reason: "森の荒れ地に近代的な都市インフラを敷設し、ドワーフやエルフの技術を結集して最先端の商業都市へと成長させるプロセス。他国との通商条約締結やダンジョン運営による観光立国戦略などスケール感が抜群です。"
      },
      {
        rank: 4,
        title: "異世界建国記",
        author: "桜木桜",
        highlight: "捨て子の少年が輪作農法と文字教育で村を再興！やがて巨大な帝国へと駆け上がる本格建国クロニクル",
        reason: "三圃式農業や衛生管理の導入からスタートし、徐々に部族をまとめ上げて独自の法典と軍制を制定。地道な生産力向上と軍事改革の積み重ねが本物の歴史叙事詩を読んでいるような高揚感を生み出します。"
      },
      {
        rank: 5,
        title: "宝くじで40億当たったんだけど異世界に移住する",
        author: "すずの木くろ",
        highlight: "日本のホームセンターから農業機械と資材を爆買い！干ばつに苦しむ異世界の領地を劇的に救済",
        reason: "現代日本と異世界を自由に行き来し、肥料、重機、発電設備を投入して飢餓に瀕した寒村を大改革。現代の科学技術が中世の土木・農業に与える劇的なインパクトがわかりやすく痛快です。"
      },
      {
        rank: 6,
        title: "理想のヒモ生活",
        author: "渡辺恒彦",
        highlight: "王配として召喚されたサラリーマンが異世界宮廷で暗躍！近代的な官僚制と国際交易で王権を支える",
        reason: "表向きは妻である女王を立ててヒモ生活を満喫しながら、前世のビジネス感覚と交渉術で保守派貴族の陰謀をスマートに回避。重厚な政治サスペンスとリアルな異世界外交が極めて読み応えがあります。"
      },
      {
        rank: 7,
        title: "異世界のんびり農家",
        author: "内藤騎之介",
        highlight: "万能農具で森を開拓し多種族の集う大集落へ！品種改良と加工食品で世界一豊かで平和な村づくり",
        reason: "荒れ果てた死の森を肥沃な農地に変え、エルフや獣人、ドラゴンたちを受け入れて豊かな自治共同体を形成。ワイン醸造やチーズ作りなど食文化の発展と、領民たちの平和な日常が心を満たしてくれます。"
      },
      {
        rank: 8,
        title: "錬金貴族の領地経営",
        author: "三島千廣",
        highlight: "錬金術による土壌改良と新素材開発で不毛の地を穀倉地帯へ！科学的アプローチで貧困を打破する内政劇",
        reason: "ハズレ能力と蔑まれた錬金術を化学・農学的に活用し、塩害や病害虫に苦しむ土地を肥沃な農地へと再生。生み出した特産品で財政を黒字化させ、領民から熱烈に支持されるサクセスが爽快です。"
      },
      {
        rank: 9,
        title: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        author: "流優",
        highlight: "ダンジョンポイントで水道インフラと要塞都市を設計！近隣都市との交易路を開拓し経済共栄圏を構築",
        reason: "ダンジョン創造能力を単なる迎撃施設ではなく、自給自足の循環型都市として運用。周囲の魔物や人間社会との平和的な共存を目指し、優れたインフラを提供していくユニークな内政ファンタジーです。"
      },
      {
        rank: 10,
        title: "デスマーチからはじまる異世界狂想曲",
        author: "愛七ひろ",
        highlight: "プログラマー知識で魔導技術と産業機器を最適化！行く先々の街で衛生改善と新産業を創出する観光無双",
        reason: "旅先で出会った人々の困りごとを前世の知識とチート魔法であっさり解決。石鹸の普及や簡易コンロの開発など、市井の人々の生活水準を底上げしていく穏やかで優しい内政描写が魅力です。"
      }
    ]
  }
];

async function run() {
  const raw = fs.readFileSync(FEATURES_JSON_PATH, 'utf-8');
  let data = JSON.parse(raw);
  let features = Array.isArray(data) ? data : data.features;

  for (const feature of batchPart33Features) {
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
  console.log(`\nBatch features part 33 successfully fetched and updated! Total features: ${features.length}`);
}

run();
