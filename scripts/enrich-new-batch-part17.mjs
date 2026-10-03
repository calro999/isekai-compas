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

const batchPart17 = [
  {
    slug: "isekai-reincarnated-spirit-contract-elemental-10",
    title: "精霊契約・精霊王の加護おすすめ異世界ラノベ10選【四大精霊使役・無詠唱自然魔導・愛され体質】",
    description: "四大精霊や最高峰の精霊王と契約し、自然界の魔力を自在に操る！精霊たちに無条件で愛され、神話級の奇跡を巻き起こすおすすめ精霊使い・精霊契約異世界ラノベ10選を徹底解説。",
    category: "精霊使い・精霊王の加護",
    leadText: "「気難しく人間に懐かないはずの高位精霊たちが、主人公の周りに嬉しそうに群がる」「精霊王と直契約を結び、自然界の天変地異すら一言で鎮める」——精霊契約ファンタジーは、精霊たちの可愛らしい掛け合いと、詠唱や魔力制限を遥かに超える超絶自然魔導の圧倒的スケール感が最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "精霊契約 ラノベ おすすめ",
      "精霊使役 精霊王 加護 異世界 小説 なろう",
      "精霊に愛される 主人公 ファンタジー 名作",
      "四大精霊 自然魔法 チート ラノベ"
    ],
    items: [
      {
        keyword: "Re:ゼロから始める異世界生活",
        rank: 1,
        hook: "【大精霊パックとの契約と絶対零度】エミリアを守る慈愛の精霊と世界を凍てつかせる終焉の獣！",
        detailedReview: "ヒロイン・エミリアが使役する猫の姿をした大精霊パック。普段は軽妙なやり取りで周囲を和ませるが、いざとなれば世界を永久凍土に変える終焉の獣へと変貌。精霊術師としての緻密なマナ操作と、スバルと精霊たちの絆が織りなす大傑作です。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 2,
        hook: "【精霊の棲家と上位精霊合体】子供たちの暴走する魔力を精霊王の導きで完全安定化！",
        detailedReview: "リムルが訪れた「精霊の棲家」。精霊女王ラミリスの協力のもと、短命の運命を背負った召喚児たちに上位精霊を宿らせて救済。さらにリムル自身も精霊工学を取り入れた魔導アイテム開発を推し進める壮大なファンタジーです。"
      },
      {
        keyword: "聖女の魔力は万能です",
        rank: 3,
        hook: "【無数の小精霊たちが集う聖女】魔力を使うたびに金色に輝く精霊たちが舞い踊る！",
        detailedReview: "セイがポーション調合や浄化魔法を使う際、周囲には常人には見えない無数の光の精霊たちが集い、その威力を跳ね上げる。精霊たちに愛される心優しい聖女が、国中の瘴気を浄化し人々を救っていく癒やしと奇跡の物語です。"
      },
      {
        keyword: "精霊幻想記",
        rank: 4,
        hook: "【前世の記憶と人型精霊アイシア】孤児の少年が超位精霊と魂を分かち合い世界を駆ける！",
        detailedReview: "スラム街の孤児リオに前世の大学生・春人の記憶が蘇る。彼の体内に眠っていた美少女の姿をした人型上位精霊アイシアが覚醒。精霊術による無詠唱の飛行や身体強化、元素操作を武器に、過酷な身分社会を乗り越えていく本格派王道ファンタジーです。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 5,
        hook: "【ナノマシン精霊への直接指示】大気中の思考精霊（ナノマシン）と友達になり奇跡を連発！",
        detailedReview: "異世界の「精霊」の正体は古代のナノマシン。マイルはそのナノマシンたちと親身に対話し、現代の化学・物理現象を直接伝えることで、通常ではあり得ない超高密度の自然魔導や絶対障壁を軽々と引き出していきます。"
      },
      {
        keyword: "異世界薬局",
        rank: 6,
        hook: "【薬神の聖紋と精霊眼】神聖な精霊の力で病魔の病巣を正確に透視・消去！",
        detailedReview: "薬神の加護を宿したファルマ。人智を超えた精霊力と神術により、水や風の元素を原子レベルで操作し、無菌状態を作り出して近代手術を成功させるなど、精霊の恵みを医療に昇華させた傑作です。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 7,
        hook: "【荒野の精霊たちとの共鳴】莫大すぎる魔力に惹かれ、あらゆる自然精霊が自ら跪く！",
        detailedReview: "深澄真の底知れない魔力は、世界の自然精霊たちにとって太陽のような存在。荒野の未開拓地に豊かな水源を湧かせ、肥沃な大地を作り出す精霊たちの協力を得て、多種族が共存する理想郷を瞬く間に築き上げます。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 8,
        hook: "【森の小精霊とスライムの共生】自然の調和を愛する少年が精霊と魔物に囲まれるスローライフ！",
        detailedReview: "森の中でスライムたちと暮らすリョウマ。清らかな自然と純粋な心に惹かれた森の小精霊たちと自然に触れ合い、天候の恵みや豊かな水源を受け取りながら、街と森を繋ぐ心温まる生活を送ります。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 9,
        hook: "【全属性魔法と精霊の導き】地水火風・聖属性を全て極めた少年による天変地異の土木開拓！",
        detailedReview: "全属性の卓越した魔力適性を持つヴェンデリン。自然の精霊力を束ねて広大な山林を一瞬で農地に変え、川の流れを変えて灌漑水路を通すなど、自然魔法のスケールを存分に見せつける開拓ファンタジーです。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 10,
        hook: "【精霊王の真実と伝説の森】噂や伝承によって形作られる精霊たちの神秘を解き明かす！",
        detailedReview: "大精霊レノや精霊王が統べる精霊の森。人々の噂や伝承によって生まれ、姿を変える精霊の理を始祖アノスが看破し、二千年前の悲劇と絆を取り戻していく重厚な神話的ドラマが展開されます。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-bandit-subjugation-mercenary-10",
    title: "傭兵・盗賊討伐・冒険者ギルド成り上がりおすすめ異世界ラノベ10選【実力至上主義・泥臭い戦術・Sランク昇格】",
    description: "冒険者ギルドの最底辺FランクからSランクへ！盗賊団の殲滅、魔物の群れの掃討、傭兵としての冷徹な実力主義を描くおすすめ冒険者成り上がり・傭兵ラノベ10選を徹底紹介。",
    category: "傭兵・冒険者ギルド・実力主義",
    leadText: "「酒場の荒くれ者たちを黙らせ、難関依頼を単独で達成していく」「泥臭い罠と冷静な戦術で凶悪な盗賊団を一網打尽にする」——冒険者ギルド・傭兵ファンタジーは、実力だけが物を言う過酷な世界で、依頼を確実にこなして名声を高めていくステップアップの爽快感が最大の魅力です。骨太なプロの戦いが光る傑作10選を厳選しました。",
    searchQueries: [
      "冒険者ギルド ラノベ おすすめ",
      "傭兵 異世界 成り上がり 小説 なろう",
      "盗賊討伐 Sランク 昇格 ファンタジー",
      "実力主義 冒険者 泥臭い バトル"
    ],
    items: [
      {
        keyword: "ゴブリンスレイヤー",
        rank: 1,
        hook: "【ゴブリン根絶の冷徹プロ】知恵、罠、水攻め、毒煙！油断なき徹底殲滅のリアリズム！",
        detailedReview: "銀等級冒険者「ゴブリンスレイヤー」。世界を救うことには目もくれず、辺境の村々を脅かすゴブリンだけを冷徹に狩り続ける。油断すれば即全滅する過酷な世界観の中、泥臭い工夫と綿密な準備で群れを壊滅させるダークファンタジーの金字塔です。"
      },
      {
        keyword: "片田舎のおっさん、剣聖になる",
        rank: 2,
        hook: "【特別指南役としてのギルド討伐】王都の荒くれ冒険者や危険指定魔獣を一太刀で制圧！",
        detailedReview: "王都のギルドや騎士団から請われて特別指南役となったベリル。凶悪な盗賊団の根城や規格外の凶暴魔獣に対し、長年培った老獪な立ち回りと神速の剣技で無駄なく制圧し、冒険者たちの度肝を抜く痛快劇です。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 3,
        hook: "【万年銅級からの執念の昇格】迷宮を知り尽くした知識と存在進化で神銀級への道を切り拓く！",
        detailedReview: "才能に恵まれず万年銅級冒険者だったレント。迷宮の地形、魔物の弱点、採取ルートを知り尽くしたベテランならではの観察眼と、スケルトンから得た人外の力を組み合わせ、着実にギルドの評価を上げていく超骨太な冒険者譚です。"
      },
      {
        keyword: "灰と幻想のグリムガル",
        rank: 4,
        hook: "【生きるための泥臭いサバイバル】最弱ゴブリン1匹を倒すことの重みとパーティの絆！",
        detailedReview: "記憶を失い見知らぬ世界グリムガルへ降り立った少年少女たち。チート能力など一切ない中、泥臭くゴブリンと命を削り合って日銭を稼ぎ、仲間の死を乗り越えながら一歩ずつ前へ進む、リアリズムと人間ドラマの極致です。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 5,
        hook: "【緻密な迷宮攻略と盗賊狩り】ボーナスポイントと効率重視のルーティンでギルド資産を形成！",
        detailedReview: "加賀道夫の徹底した効率重視の迷宮探索。魔物のドロップアイテムや盗賊の賞金首を冷静に換金し、スキル割り振りを最適化しながら着実に拠点を固めていく、ゲームライクかつ超リアルな冒険者生活です。"
      },
      {
        keyword: "オーバーロード",
        rank: 6,
        hook: "【漆黒の英雄モモンの成り上がり】大剣二刀流の戦士として瞬く間にアダマンタイト級へ昇格！",
        detailedReview: "情報収集のため、漆黒の全身鎧を纏う冒険者「モモン」としてギルドに潜入したアインズ。巨大魔獣の瞬殺や吸血鬼討伐など、規格外の武勇伝を次々と打ち立て、平民たちの希望の星「アダマンタイト級英雄」へ登りつめる裏の顔が最高です。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 7,
        hook: "【森の危険地帯を単独制圧】ギルドの依頼板の放置案件を一人で片っ端から片付けるぼっち！",
        detailedReview: "パーティを組めない遥が、ギルドで誰も引き受けない超危険な討伐依頼を木の棒一本で単独受託。街の冒険者たちが恐れる魔物の大群を影から一網打尽にし、ギルド職員や街の人々を驚嘆させる痛快アクションです。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 8,
        hook: "【賞金首と超難関ユニークモンスター】プロゲーマーの立ち回りで不可能を可能にする！",
        detailedReview: "サンラクの圧倒的プレイヤースキル。ギルドの一般プレイヤーたちが手も足も出ない伝説のユニークモンスター「墓守のウェザエモン」などの難関レイドボスに対し、ギミックの完全解明と神業回避で挑む最高峰のバトルです。"
      },
      {
        keyword: "Re:Monster",
        rank: 9,
        hook: "【傭兵団『パラベラム』の結成】魔物たちを統率し、人間の国家間戦争を左右する一大軍閥へ！",
        detailedReview: "ゴブ朗が率いる戦闘集団「パラベラム」。周辺の盗賊団や敵対部族を次々と吸収・討伐し、人間族の国家から高額で戦争依頼を引き受ける最強の傭兵団へと急成長していく圧巻の覇道ファンタジーです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 10,
        hook: "【旅先での悪徳奴隷商人・盗賊成敗】困っている人々を助け、各地のギルドで名声を残す道中記！",
        detailedReview: "アークが旅先で遭遇する悪徳領主や凶悪な野盗集団。圧倒的な天変地異級の武技で瞬時に成敗し、助けた人々から感謝されつつも、正体がバレないよう風のように去っていく爽快な世直し冒険者譚です。"
      }
    ]
  }
];

async function enrichPart17() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart17) {
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
  console.log(`\nBatch features part 17 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart17().catch(console.error);
