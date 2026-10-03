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

const batchPart29Features = [
  {
    id: "isekai-reincarnated-skill-steal-copy-absorb-10",
    slug: "isekai-reincarnated-skill-steal-copy-absorb-10",
    title: "スキル強奪・能力コピーおすすめ異世界ラノベ10選【暴食・吸収進化・敵のチート技を奪う下剋上無双】",
    description: "倒した魔物や強敵のチートスキルを吸収・強奪・コピーして加速度的に成り上がる痛快ファンタジー！最弱からの大逆転や底知れぬ成長曲線が熱い傑作ライトノベルを厳選徹底紹介。",
    tags: ["スキル強奪", "能力コピー", "暴食", "下剋上", "成り上がり", "チート成長", "ダークファンタジー", "無双"],
    items: [
      {
        rank: 1,
        title: "暴食のベルセルク～俺だけレベルという概念を突破する～",
        author: "一色一凛",
        highlight: "倒した敵のステータスとスキルを喰らい尽くす！飢餓感と戦いながら規格外の強者へと駆け上がるダークファンタジーの金字塔",
        reason: "ただ腹が減るだけの無能スキルと思われていた『暴食』が、殺した相手の能力をすべて我が物にする禁忌の力だと覚醒した瞬間のカタルシスが抜群。ステータスインフレの爽快感と重厚な復讐劇が融合した最高峰の作品です。"
      },
      {
        rank: 2,
        title: "ありふれた職業で世界最強",
        author: "白米良",
        highlight: "奈落の底で魔物を喰らい、その魔力と固有魔法を獲得！絶望から生還した錬成師による容赦なき圧倒的無双譚",
        reason: "クラス転移で裏切られ奈落に落とされた少年が、生き延びるために魔物の肉を喰らい、魔人化して異能を獲得していく展開が熱狂的人気を博しています。敵の能力を取り込み自身の錬成術で昇華させる怒涛の爽快感が魅力です。"
      },
      {
        rank: 3,
        title: "黒の召喚士",
        author: "迷井豆腐",
        highlight: "前世の記憶と引き換えに膨大なスキルポイントと隠蔽・成長スキルを獲得！強敵を従えスキルを極めるバトルジャンキー",
        reason: "戦闘狂の主人公が強い敵を求めて冒険を繰り広げ、相手のスキル構成や戦術を分析・攻略しながら自らの戦闘力へと還元していく爽快バトル。テンポ抜群の戦闘描写と痛快な仲間集めが秀逸です。"
      },
      {
        rank: 4,
        title: "成長チートでなんでもできるようになったが、無職だけは辞められないようです",
        author: "時野洋輔",
        highlight: "経験値獲得量数百倍＆ジョブチェンジで全職業のスキルを網羅・習得！圧倒的速度で全能へと至るチート成長劇",
        reason: "あらゆる職業の固有スキルを驚異的なスピードで吸収・習得していくマルチクラス無双。無職という名の全知全能ジョブで、世界の理を軽々と凌駕していく軽快なストーリーラインが心地よい快作です。"
      },
      {
        rank: 5,
        title: "モンスターがあふれる世界になったので、好きに生きたいと思います",
        author: "よどかわ",
        highlight: "現実崩壊後の世界で魔物を倒しスキルポイントを荒稼ぎ！現代兵器と異能スキルを組み合わせたサバイバル無双",
        reason: "社畜青年が世界変異を機に会社を辞め、魔物を狩ることで得られるスキルを自由にツリー強化して最強の自由人を目指す痛快サスペンスファンタジー。着実にスキルを獲得していくRPG的な楽しさが凝縮されています。"
      },
      {
        rank: 6,
        title: "異世界でチート能力を手にした俺は、現実世界をも無双する",
        author: "美紅",
        highlight: "異世界と現実を往復し、超常スキルと神級ステータスをそのまま両世界で発揮！人生大逆転スクール＆ファンタジーライフ",
        reason: "いじめられっ子だった主人公が異世界の賢者の遺産とスキルを丸ごと吸収・継承し、美貌と神速の武力を手に入れて二つの世界で無双する究極の爽快感。圧倒的なスペック差で敵をねじ伏せる展開が最高に爽快です。"
      },
      {
        rank: 7,
        title: "望まぬ不死の冒険者",
        author: "丘野優",
        highlight: "スケルトンから始まり魔物を喰らい『存在進化』！失われた肉体を取り戻しながらスキルを蓄積する重厚な冒険譚",
        reason: "迷宮で竜に喰われ不死の魔物となった万年下級冒険者が、他の魔物を倒して力を奪い、屍食鬼、屍鬼、吸血鬼へと進化していくダークファンタジー。地道な研鑽と魔物の力吸収による進化プロセスの緻密さが光ります。"
      },
      {
        rank: 8,
        title: "巻き込まれて異世界転移する奴は、大抵チート",
        author: "海東方舟",
        highlight: "勇者召喚に巻き込まれただけの男が手に入れた『あらゆる能力を即座にコピー・強化』する究極のチート！",
        reason: "神様の手違いで巻き込まれた主人公が、見た魔法やスキルを一瞬で理解・習得し、本家以上の威力で放つ破格のコピー能力ファンタジー。王道を行く爽快な無双劇とヒロインたちとの軽妙なやり取りが楽しめます。"
      },
      {
        rank: 9,
        title: "ライブダンジョン！",
        author: "dy冷凍",
        highlight: "MMORPGの白魔道士知識とバフ・スキル管理で異世界の迷宮攻略を根本から変革！ヘイト管理と支援術式の極致",
        reason: "回復職不遇の異世界において、適切なバフスキルとヘイトコントロール技術を駆使して最前線の迷宮を次々と攻略していく戦術派ファンタジー。相手のスキルやボスの行動パターンを完全に把握して攻略する理詰めの熱さが秀逸です。"
      },
      {
        rank: 10,
        title: "魔王学院の不適合者",
        author: "秋",
        highlight: "理不尽を理不尽で叩き潰す始祖の魔王！相手の魔法や概念すら自らの掌中で掌握し無力化する絶対的覇道",
        reason: "転生した暴虐の魔王アノスが、相手の放った最強魔法を瞬時に構造解析してさらに上位の術式で圧倒する痛快無比の作品。『殺したくらいで死ぬと思ったか？』に代表される圧倒的強者感と緻密な魔法理論の融合が唯一無二です。"
      }
    ]
  },
  {
    id: "isekai-reincarnated-dungeon-streamer-vtuber-explorer-10",
    slug: "isekai-reincarnated-dungeon-streamer-vtuber-explorer-10",
    title: "ダンジョン配信・VTuber探索者おすすめ現代異世界ラノベ10選【世界中へ生配信・コメント欄熱狂・バズり無双】",
    description: "現代に出現した迷宮を探索しながら生配信（ストリーミング）！リスナーのコメントの嵐とともに圧倒的な実力でバズりまくる痛快現代ファンタジー＆ダンジョン探索者ライトノベルを厳選徹底紹介。",
    tags: ["ダンジョン配信", "現代ファンタジー", "探索者", "バズ", "ストリーマー", "コメント欄", "痛快無双", "掲示板"],
    items: [
      {
        rank: 1,
        title: "Dジェネシス ダンジョンが出来て3年",
        author: "之貫紀",
        highlight: "偶然手に入れたオーブで世界ランキング1位に！緻密な世界観設定と大人たちのリアルなダンジョン経済戦争を描く傑作",
        reason: "突如出現したダンジョンによって変貌した現代日本を舞台に、研究者気質の主人公が地道な実験と圧倒的スキルで世界を揺るがす本格派。配信・技術開示による社会への影響描写が極めてリアルで読み応え抜群です。"
      },
      {
        rank: 2,
        title: "おっさん底辺ダンジョン配信者",
        author: "ハルノイチ",
        highlight: "無自覚な超絶技巧でボスをワンパン！同接数万超えのコメント欄が熱狂する痛快バズりエンタメ",
        reason: "地道に探索を続けてきた地味なおっさんが、配信を通じてその異常な戦闘力と神回避テクニックを世に知らしめていく勘違い＆無双劇。視聴者のコメントのツッコミと主人公の天然っぷりのギャップが最高に笑えて爽快です。"
      },
      {
        rank: 3,
        title: "ダンジョン配信者を救う陰の実力者",
        author: "和泉和",
        highlight: "ピンチに陥った人気VTuberや配信者を影から救出！『あの一撃でボスを消し去った奴は誰だ!?』とネット騒然",
        reason: "目立たず静かにダンジョンを攻略したいだけなのに、美少女配信者の危機を救ったせいでネット上の都市伝説として祭り上げられていく王道の陰の実力者ムーブ。ネットの反応回が最高に盛り上がります。"
      },
      {
        rank: 4,
        title: "現代ダンジョンライフの続きは異世界オープンワールドで！",
        author: "霜月緋色",
        highlight: "現代ダンジョンで鍛えた能力で異世界オープンワールドへ！二つの世界を股にかける極上冒険ライフ",
        reason: "現代のダンジョン探索と異世界ファンタジーの魅力をハイブリッドで楽しめる欲張りな設定。着実に強くなっていく探索者の日常と、ダンジョン産アイテムによる現実世界の利便性向上描写が秀逸です。"
      },
      {
        rank: 5,
        title: "ネットの『クソレビュー』で無双する",
        author: "茨木野",
        highlight: "世間の評価が低いハズレスキルやアイテムを裏技的解釈で最強へ！独自の攻略法でダンジョン界を震撼させる",
        reason: "ネット上で散々叩かれているゴミスキルを検証し、驚きのコンボとシナジーで神スキルへと昇華させるゲーム攻略的な面白さ。掲示板やSNSでの手のひら返しが痛快無比な作品です。"
      },
      {
        rank: 6,
        title: "俺だけ入れる隠しダンジョン",
        author: "瀬戸メグル",
        highlight: "大賢者からの直伝スキルとLP（ライフポイント）消費で規格外の力を創造！秘密の特訓で圧倒的強者へ",
        reason: "人知れぬ隠しダンジョンで超レアなスキルと装備を独占入手し、学園やギルドで無双する秘密主義の成り上がり劇。コミカルなエロコメ要素と爽快な戦闘のバランスが絶妙です。"
      },
      {
        rank: 7,
        title: "元・世界１位のサブキャラ育成日記",
        author: "沢村治太郎",
        highlight: "ネトゲ廃人の世界1位がゲームの世界へ転生！完璧な理論値育成と配信映えする神プレイで無双",
        reason: "ゲームの仕様、隠しイベント、スキルの最適配分を完全に把握した元廃人による完璧無欠の攻略劇。一切の無駄がない鮮やかな戦闘スタイルと、周囲の度肝を抜くプレイの数々に惚れ惚れします。"
      },
      {
        rank: 8,
        title: "世界でただ一人の魔物使い",
        author: "門司柿家",
        highlight: "危険な魔物をモフモフ従魔として手懐ける！配信カメラの前で神獣と戯れる癒やし＆無双ライフ",
        reason: "凶悪なダンジョンモンスターを愛らしい相棒に変えてしまう唯一無二のテイマー能力。配信を通じて視聴者に癒やしと衝撃を与えながら、トップ探索者へと上り詰める爽快なサクセスストーリーです。"
      },
      {
        rank: 9,
        title: "クーデレ美少女たちに囲まれてダンジョン配信",
        author: "白猫参謀",
        highlight: "ソロ特化の超実力者がクーデレ系ヒロインたちとパーティ結成！配信映え抜群の連携と甘々日常",
        reason: "圧倒的な実力を持ちながらもマイペースな主人公が、魅力的な美少女配信者たちと協力して最深部へ挑むラブコメ×配信アクション。ダンジョン内の臨場感ある戦闘とコメント欄の盛り上がりが抜群です。"
      },
      {
        rank: 10,
        title: "最底辺おっさん、勇者見習いになる。",
        author: "日之浦拓",
        highlight: "年齢制限ギリギリで覚醒した規格外の才能！若い探索者たちを圧倒するいぶし銀の神業アクション",
        reason: "長年不遇をかこってきたおっさんが、眠っていた才能を一気に開花させて若手エリートたちを驚嘆させる王道の下剋上。経験に裏打ちされた冷静沈着な戦いぶりと熱い人情味が心に響きます。"
      }
    ]
  }
];

async function run() {
  const raw = fs.readFileSync(FEATURES_JSON_PATH, 'utf-8');
  let data = JSON.parse(raw);
  let features = Array.isArray(data) ? data : data.features;

  for (const feature of batchPart29Features) {
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
  console.log(`\nBatch features part 29 successfully fetched and updated! Total features: ${features.length}`);
}

run();
