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

const batchPart31Features = [
  {
    id: "isekai-reincarnated-death-loop-time-rewind-10",
    slug: "isekai-reincarnated-death-loop-time-rewind-10",
    title: "ループ・死に戻り・タイムリープおすすめ異世界ラノベ10選【絶望の運命を知識と執念で覆す頭脳戦＆死線突破】",
    description: "理不尽な死や破滅の運命から時間を巻き戻し、繰り返す時間の中で得た情報と執念で未来を切り拓く！緊迫感あふれる心理戦と圧倒的カタルシスが味わえる傑作ループ系ライトノベルを厳選紹介。",
    tags: ["死に戻り", "ループ", "タイムリープ", "時間遡行", "絶望回避", "頭脳戦", "心理戦", "サスペンス"],
    items: [
      {
        rank: 1,
        title: "Re:ゼロから始める異世界生活",
        author: "長月達平",
        highlight: "死して時間を巻き戻す『死に戻り』！無力な少年が過酷な運命に抗い大切な人々を救い出す不朽の金字塔",
        reason: "圧倒的な理不尽と凄惨な死の恐怖に直面しながらも、泥臭く情報を集め仲間を救うために立ち上がるスバルの精神的成長が圧巻。緻密な伏線回収と感情を揺さぶる劇的ドラマが最高峰の傑作です。"
      },
      {
        rank: 2,
        title: "ティアムーン帝国物語～断頭台から始まる、姫の転生逆転ストーリー～",
        author: "餅月望",
        highlight: "ギロチンの運命から逃れるために保身に走るポンコツ皇女！周囲の深読みと勘違いで帝国を救う大快挙",
        reason: "前世で革命によって処刑された皇女ミーアが、血染めの日記帳を頼りに破滅フラグを全力で回避。本人の小物で打算的な動機が周囲の聖女的リスペクトへと変換される痛快コメディの極みです。"
      },
      {
        rank: 3,
        title: "ループ7回目の悪役令嬢は、元敵国で自由気ままな花嫁生活を満喫する",
        author: "雨川透子",
        highlight: "商人、薬師、騎士と過去6回の人生で培った万能の知識と戦闘技術！皇太子からの求婚で始まる波乱の7周目",
        reason: "毎回20歳で命を落としていたリーシェが、過去のループで培った多彩な職業スキルを総動員して自らの命を奪った張本人である皇太子と対峙。圧倒的スペックと気品ある立ち振る舞いが痛快無比です。"
      },
      {
        rank: 4,
        title: "悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。",
        author: "天壱",
        highlight: "自らが迎える極悪ラスボスの破滅結末を知った王女！圧倒的な武力と慈愛で運命を改変する感動作",
        reason: "乙女ゲームの非道なラスボス女王に転生したプライドが、未来で悲劇に見舞われる人々を予知知識と規格外の権能で救済。自己犠牲をも厭わない高潔な魂に多くの人々が心酔していく王道ドラマです。"
      },
      {
        rank: 5,
        title: "勇者刑に処す 懲罰勇者9004隊刑務記録",
        author: "ロケット商会",
        highlight: "死ぬことすら許されず蘇生させられて魔王軍と戦い続ける！絶望の戦場で繰り広げられる極限ダークファンタジー",
        reason: "大罪を犯した重罪人として『勇者』の刑に処され、何度殺されても蘇生させられ前線で戦わされる狂気の戦場劇。過酷極まる世界観と、不屈の執念で生き延びる主人公たちの生き様が胸に突き刺さります。"
      },
      {
        rank: 6,
        title: "All You Need Is Kill",
        author: "桜坂洋",
        highlight: "謎の地球外生命体との戦闘で死ぬたび出撃前日へ逆戻り！ハリウッド映画化も果たしたSFループの原点",
        reason: "初陣で戦死した新兵が、死と再生を繰り返す中で敵の行動パターンを完璧に把握し、最強の戦士へと研ぎ澄まされていく極上のループバトル。ミリタリー描写のリアリティと切ない結末が語り継がれています。"
      },
      {
        rank: 7,
        title: "悪役令嬢の中の人",
        author: "まきぶろ",
        highlight: "ヒロインに冤罪を着せられ処刑された心優しい少女の無念を晴らす！本物の悪役令嬢による徹底的復讐劇",
        reason: "自分の中に宿っていた異世界転生者の優しい魂が濡れ衣を着せられ消滅したとき、本来の人格である悪役令嬢エミの復讐が始まる。情報戦と魔法技術を極め、完璧な復讐を遂行する姿が鳥肌モノです。"
      },
      {
        rank: 8,
        title: "幼女戦記",
        author: "カルロ・ゼン",
        highlight: "神（存在X）への反骨心と徹底的な合理主義！熾烈な世界大戦の最前線で安全な後方勤務を目指す狂気",
        reason: "合理主義のエリートサラリーマンが幼女士官として転生し、理不尽な死線と軍令を卓越した戦術眼で潜り抜ける傑作戦記。主人公の思惑と周囲の英雄視とのズレが絶妙な緊張感と笑いを生み出します。"
      },
      {
        rank: 9,
        title: "蜘蛛ですが、なにか？",
        author: "馬場翁",
        highlight: "死と隣り合わせの極限迷宮サバイバル！時系列の交錯と驚愕の真実が明かされる怒涛の伏線回収",
        reason: "何度も死にかけながら毒と糸で生き延びる蜘蛛子の孤独な戦いと、人間の勇者たちの時間軸が巧みに交差し、世界の崩壊をめぐる壮大な真相へと繋がっていく神がかり的な構成美が光ります。"
      },
      {
        rank: 10,
        title: "豚のレバーは加熱しろ",
        author: "逆井卓馬",
        highlight: "豚に転生した男が心を読める美少女を悲惨な運命から救う！知略と純愛で世界に抗う奇跡の冒険劇",
        reason: "ただの豚になってしまった主人公が、過酷な身分制度によって生贄となる運命を背負った少女ジェスを救うため、知恵と機転を振り絞って強敵に立ち向かう感動とサスペンスの名作です。"
      }
    ]
  },
  {
    id: "isekai-reincarnated-dungeon-master-labyrinth-craft-10",
    slug: "isekai-reincarnated-dungeon-master-labyrinth-craft-10",
    title: "ダンジョンマスター・迷宮創造おすすめ異世界ラノベ10選【侵入者を罠と魔物で迎え撃つ防衛ストラテジー＆領地経営】",
    description: "迷宮の主（ダンジョンマスター）となり、罠の配置、魔物の召喚、施設拡張で侵入者を迎え撃つ！拠点防衛と内政・領地経営の面白さが凝縮された傑作ストラテジー系ライトノベルを徹底解説。",
    tags: ["ダンジョンマスター", "迷宮創造", "防衛ストラテジー", "トラップ", "魔王", "拠点防衛", "内政", "経営"],
    items: [
      {
        rank: 1,
        title: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        author: "流優",
        highlight: "チート魔王が最強のドラゴン少女とダンジョン創造！強固な防衛網とあたたかな家庭を築くスローライフ",
        reason: "迷宮創造スキルで強力な罠や快適な居住空間を設計し、やってくる不届きな侵入者を撃退しながら、愛らしい眷属たちと穏やかな日常を過ごす癒やしと無双のハイブリッドが楽しめます。"
      },
      {
        rank: 2,
        title: "怠惰なダンジョンマスターの運営記",
        author: "鬼影スパナ",
        highlight: "絶対に働きたくない男の超効率的防衛術！知恵とトンチで冒険者たちを撃退・経済誘導する名作",
        reason: "『働きたくない』という一心から、侵入者を安全かつ効率的に迎撃する罠を考案し、ダンジョンポイントを賢く運用して町や冒険者ギルドを手玉に取る知略ストラテジーの傑作です。"
      },
      {
        rank: 3,
        title: "オーバーロード",
        author: "丸山くがね",
        highlight: "ナザリック地下大墳墓の主として君臨！圧倒的戦力と絶対防衛陣を誇るダークファンタジーの覇者",
        reason: "ギルドメンバーと築き上げた難攻不落の巨大要塞ナザリックから世界征服へと乗り出す魔王アンズの覇道。階層守護者たちの圧倒的強さと、侵入者を絶望に叩き落とす防衛ギミックが圧巻です。"
      },
      {
        rank: 4,
        title: "転生したらスライムだった件",
        author: "伏瀬",
        highlight: "魔国連邦の地下に100階層の巨大迷宮を建設！冒険者への娯楽提供と防衛拠点を両立する画期的街づくり",
        reason: "ヴェルドラやラミリスらと協力して創り上げた100層ダンジョンが、国の経済を活性化させると同時に国国防衛の最終防壁として機能する見事な設定。ボスの配置や罠の工夫がワクワクさせます。"
      },
      {
        rank: 5,
        title: "異世界迷宮でハーレムを",
        author: "蘇我捨恥",
        highlight: "迷宮のルールとボーナスポイントを徹底分析！緻密な階層攻略と生活拠点の構築を描くシステム派",
        reason: "迷宮内のワープポイントやドロップアイテムの法則を論理的に解き明かし、最も効率的な稼ぎと生活設計を組み立てていくリアル志向の迷宮ファンタジー。地道な攻略の積み重ねが魅力です。"
      },
      {
        rank: 6,
        title: "最強不敗の神剣使い",
        author: "羽田遼亮",
        highlight: "神剣の力でダンジョンを切り開き自分だけの最強拠点を築く！理不尽を叩き潰す圧倒的爽快バトル",
        reason: "強大な敵に奪われた故郷を取り戻すため、手に入れた神剣の絶大な力で迷宮を支配し、味方を増やしながら破竹の勢いで進撃する王道の無双アクションファンタジーです。"
      },
      {
        rank: 7,
        title: "神達に拾われた男",
        author: "Roy",
        highlight: "スライムたちの特性を活かした独自の研究と拠点設営！街のゴミ処理から鉱山開発までこなす生産無双",
        reason: "多様な進化を遂げたスライムたちと共に、誰も思いつかなかったクリーニングや防水加工、建築技術を開発して地域経済を活性化。温かい人間関係と生産活動の楽しさが詰まっています。"
      },
      {
        rank: 8,
        title: "影の英雄の日常譚",
        author: "坂石遊作",
        highlight: "英雄として世界を救った男が手に入れた念願のマイホーム！静かな隠居生活を守るための防衛無双",
        reason: "平和になった世界で目立たず平穏に暮らしたい主人公が、自分の敷地に次々とやってくる厄介な来訪者や刺客を影からスマートに撃退していく大人の余裕あふれる傑作です。"
      },
      {
        rank: 9,
        title: "没落予定なので、鍛冶職人を目指す",
        author: "CK",
        highlight: "ゲーム知識を活かして没落運命を回避！特殊鉱石の採掘と名刀鍛造で領地を立て直すものづくりファンタジー",
        reason: "貴族家の没落を防ぐため、迷宮の隠し資源を活用して伝説級の武具を打ち直し、自らの領地と家族を守り抜く職人魂あふれるサクセスストーリー。地道な鍛冶修行と防衛計画が熱いです。"
      },
      {
        rank: 10,
        title: "ライブダンジョン！",
        author: "dy冷凍",
        highlight: "迷宮のギミックとボスの行動AIを完全掌握！ヒーラー不遇の常識を覆す論理的ダンジョンレイド",
        reason: "迷宮のトラップや敵の行動パターンを徹底的に分析し、タンク・アタッカー・ヒーラーの理想的なフォーメーションで高難度フロアを攻略していくレイドバトルの醍醐味が凝縮されています。"
      }
    ]
  }
];

async function run() {
  const raw = fs.readFileSync(FEATURES_JSON_PATH, 'utf-8');
  let data = JSON.parse(raw);
  let features = Array.isArray(data) ? data : data.features;

  for (const feature of batchPart31Features) {
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
  console.log(`\nBatch features part 31 successfully fetched and updated! Total features: ${features.length}`);
}

run();
