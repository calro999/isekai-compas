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

const batchPart24 = [
  {
    slug: "isekai-reincarnated-curse-anti-magic-nullify-10",
    title: "魔法無効化・アンチマジック・異能喰らいおすすめ異世界ラノベ10選【術式破壊・魔力吸収・物理完全制圧】",
    description: "どんな天変地異級の上級魔法も一瞬でかき消す！魔法障壁を突き破り、魔力吸収や術式消滅で傲慢な魔術師を絶望させるおすすめ魔法無効化・アンチマジック異世界ラノベ10選を徹底解説。",
    category: "魔法無効化・アンチマジック",
    leadText: "「世界を滅ぼす大魔法を、触れただけで霧散させる」「魔法に絶対の自信を持つ貴族たちの前で、術式そのものを破壊して絶句させる」——魔法無効化・アンチマジックファンタジーは、魔法至上主義の権力構造を根底からへし折る圧倒的なカタルシスが最大の魅力です。爽快無比な傑作10選をお届けします。",
    searchQueries: [
      "魔法無効化 ラノベ おすすめ",
      "アンチマジック 異世界 小説 なろう",
      "魔力吸収 魔法を喰らう 主人公 チート",
      "術式破壊 物理最強 ファンタジー"
    ],
    items: [
      {
        keyword: "魔王学院の不適合者",
        rank: 1,
        hook: "【魔眼による術式完全滅殺】敵の魔法を見ただけで術式構造を崩壊・消滅させる始祖の覇気！",
        detailedReview: "暴虐の魔王アノス・ヴォルディゴード。【破滅の魔眼】を向けるだけで相手が発動しようとした高位魔法の術式そのものを分解・消滅させ、相手の心臓を鼓動の音だけで止めるなど、魔法対決の土俵にすら立たせない圧倒的無双劇です。"
      },
      {
        keyword: "痛いのは嫌なので防御力に極振りしたいと思います。",
        rank: 2,
        hook: "【悪食による魔法エネルギー丸呑み】上級魔法も光線も大盾で吸収・MP変換！",
        detailedReview: "メイプルのユニークスキル【悪食】。敵が放った広範囲殲滅魔法やレーザー攻撃を大盾で受け止め、全て魔力（MP）として吸収・変換。魔法攻撃を完全に無力化しながら自身のエネルギー源にしてしまうシステム破壊の極致です。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 3,
        hook: "【暴食之王（ベルゼビュート）の完全捕食】相手の放った核撃魔法ごと空間を丸ごと飲み込む！",
        detailedReview: "リムル＝テンペストの究極能力【暴食之王】。敵の攻撃魔法、障壁、魔素を空間ごと全て捕食・隔離。どれほど巨大な熱量や爆発であっても胃袋の中に閉じ込めて無害化する絶対防御と吸収の権能です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 4,
        hook: "【魔力遮断鉱石と神代空間結界】魔法を反射・減衰させる重力シールドで神の使徒を完封！",
        detailedReview: "南雲ハジメが錬成した対魔装甲。魔力を拡散・遮断する特殊鉱石と空間歪曲バリアを組み合わせ、敵国の宮廷魔導士や神の使徒が放つ大魔術を無傷で弾き返し、電磁加速弾で反撃する冷徹な殲滅戦術です。"
      },
      {
        keyword: "空手バカ異世界",
        rank: 5,
        hook: "【正拳突きによる魔力障壁破砕】魔法の理屈など関係ない！気合と物理インパクトで粉砕！",
        detailedReview: "チート魔法を全否定する空手家。敵の火球や氷柱を拳の風圧で吹き飛ばし、何重にも張られた魔法結界を一点集中の正拳突きで物理的に叩き割る、痛快極まるアンチマジック格闘劇です。"
      },
      {
        keyword: "即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。",
        rank: 6,
        hook: "【魔法の概念そのものを殺害】相手が唱えた魔法の『現象』だけをピンポイントで即死消滅！",
        detailedReview: "高遠夜霧の即死能力。人間やモンスターだけでなく、飛来する攻撃魔法や結界の概念そのものを「死」に至らしめることで、術式を一瞬で無力化する理不尽の極致です。"
      },
      {
        keyword: "オーバーロード",
        rank: 7,
        hook: "【高位魔法無効化パッシブ】第六位階以下の全魔法を完全にシャットアウトする死の支配者！",
        detailedReview: "アインズ・ウール・ゴウンの持つ常時発動パッシブ【高位魔法無効化】。異世界の人間が使える最高峰レベルの魔法ですら、アインズのローブに触れるだけでかすり傷一つつけられずに霧散する圧倒的スペック差が描かれます。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 8,
        hook: "【木の棒による魔力受け流し】魔法の魔力軸を見切り、地面へアースさせて無効化！",
        detailedReview: "遥の神技的な杖術。飛来する火炎球や雷撃の魔力集中点を木の棒で見極めて弾き、地面へ魔力を逃がすことでダメージを完全にゼロにする、職人芸のような魔術無力化アクションです。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 9,
        hook: "【陰陽五行による属性魔術の相剋無力化】火は水で消し、雷は土に逃がす絶対の理！",
        detailedReview: "セイカ・ランプローグの東洋呪術。異世界の属性魔法に対し、陰陽五行の相剋理論を瞬時に適用。相手の詠唱した最強魔法の属性を逆相殺し、何も起こらずに立ち尽くす魔術師たちを冷徹に見下ろします。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 10,
        hook: "【詠唱すら許さぬ先手麻痺】どんな大魔法使いも指一本動かせず魔法構築を完全阻止！",
        detailedReview: "三森灯火の【パラライズ（麻痺）】。詠唱を始めようとした瞬間に相手の全身の自由と発声を奪い、魔法の行使そのものを根本から封じ込める絶対的制圧術です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-tsundere-noble-villain-10",
    title: "貴族社会・社交界暗闘・権謀術数おすすめ異世界ラノベ10選【爵位争い・夜会スキャンダル・冷徹な政略結婚】",
    description: "優雅な微笑みの裏で毒杯と密書が飛び交う！貴族院の派閥抗争、夜会の心理戦、婚約破棄を逆手に取った政略で名門貴族を失脚させるおすすめ貴族社会・社交界暗闘ラノベ10選を徹底紹介。",
    category: "貴族社会・社交界暗闘・政略劇",
    leadText: "「華やかな夜会の裏で、冷徹な情報戦と証拠隠蔽が繰り広げられる」「無能を装いながら政敵の弱みを握り、貴族裁判で一網打尽に失脚させる」——貴族社会・社交界暗闘ファンタジーは、知性と気品、そして容赦のない権謀術数が織りなす大人のサスペンスが最大の魅力です。知略戦に痺れる傑作10選を厳選しました。",
    searchQueries: [
      "貴族社会 ラノベ おすすめ",
      "社交界 暗闘 権謀術数 小説 なろう",
      "公爵 令嬢 政略結婚 派閥争い ファンタジー",
      "薬屋のひとりごと 類似作品 宮廷劇"
    ],
    items: [
      {
        keyword: "薬屋のひとりごと",
        rank: 1,
        hook: "【後宮の毒殺未遂と薬品推理】花街育ちの薬師・猫猫が後宮のドロドロした陰謀を暴く！",
        detailedReview: "後宮の下級妃や宦官たちの間で渦巻く毒殺、世継ぎ争い、呪詛の噂。花街で鍛えられた毒と薬の知識を持つ少女・猫猫（マオマオ）が、美形の宦官・壬氏とともに数々の事件のトリックを暴いていく本格宮廷ミステリーの金字塔です。"
      },
      {
        keyword: "公爵令嬢の嗜み",
        rank: 2,
        hook: "【断罪劇を逆手に取った領地代行】腐敗貴族の利権構造を経済と法整備で完全解体！",
        detailedReview: "婚約破棄された公爵令嬢アイリス。王都の社交界を牛耳る第二王子派閥の嫌がらせを、確固たる領地経済力と貴族院での法的手続きで封殺。正当な手続きと圧倒的実績で政敵を完膚なきまでに追い詰める本格政略劇です。"
      },
      {
        keyword: "本好きの下剋上",
        rank: 3,
        hook: "【貴族院の派閥抗争と領地対抗戦】エーレンフェストを最下位から大領地へと押し上げる知略！",
        detailedReview: "貴族社会へ足を踏み入れたローゼマイン。夜会での会話の裏の裏を読む社交辞令、魔力奉納による領地順位の逆転、中央貴族や他領地の思惑が交錯する貴族院での高度な政治的駆け引きが圧巻の筆力で描かれます。"
      },
      {
        keyword: "ティアムーン帝国物語",
        rank: 4,
        hook: "【保身から始まる帝国貴族の綱引き】腐敗した中央貴族の不正を『帝国の英知』が次々と浄化！",
        detailedReview: "革命のギロチンを回避したいミーア皇女。私利私欲の保身行動が、優秀な文官ルードヴィッヒによって「腐敗貴族の不正蓄財を暴く一手」と昇華され、帝国の貴族派閥を劇的に刷新していく歴史改変劇です。"
      },
      {
        keyword: "天才王子の赤字国家再生術",
        rank: 5,
        hook: "【帝国貴族と属国の政略結婚外交】隣国の皇位継承争いに介入し自国の利益を最大化！",
        detailedReview: "ナトラ王国の若き王子ウェイン。帝国皇族や周辺大国の貴族たちとの婚姻外交、会談での腹の探り合い、裏切りの連鎖を天才的な頭脳で制し、小国ながら国際政治のキャスティングボートを握る痛快政略劇です。"
      },
      {
        keyword: "悪役令嬢の執事様",
        rank: 6,
        hook: "【夜会の毒殺計画と暗殺者の迎撃】お嬢様の社会的地位を守るため社交界の闇を始末！",
        detailedReview: "悪役令嬢ソフィアに仕える執事シリル。夜会でソフィアを陥れようとする嫉妬深い令嬢や腐敗貴族たちの毒殺計画やスキャンダル工作を事前に察知し、証拠を揃えて公の場で自滅させる完璧な影の守護劇です。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 7,
        hook: "【新興貴族の派閥争いと王宮工作】貧乏八男から一代で伯爵へ！旧臣派閥との生々しい確執！",
        detailedReview: "莫大な武功で瞬く間に上位貴族へと登りつめたヴェンデリン。しかし伝統を重んじる旧門閥貴族たちからの嫉妬や領地境界紛争、宮廷内での派閥抗争に巻き込まれ、王宮首脳陣との政治的バランスを取っていくリアルな貴族生活です。"
      },
      {
        keyword: "悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。",
        rank: 8,
        hook: "【王位継承権と反逆貴族の粛清】未来の惨劇を防ぐため、冷徹な法と慈愛で国家を統治！",
        detailedReview: "第一王女プライド。国家転覆を企む悪徳貴族や人身売買組織を、予知知識と圧倒的な王権で迅速に摘発・断罪。王宮の腐敗を一掃し、民衆と忠臣たちから絶大な支持を集める名君への道を描きます。"
      },
      {
        keyword: "現実主義勇者の王国再建記",
        rank: 9,
        hook: "【三公との対立と貴族内乱の鎮圧】腐敗官僚の追放と法治国家への完全移行！",
        detailedReview: "ソーマ・カズヤが断行した王宮改革。私腹を肥やす貴族や腐敗官僚を一斉摘発し、身分に関わらず有能な人材を登用。旧勢力の武力反乱を緻密な情報戦で各個撃破し、近代的な中央集権国家を完成させます。"
      },
      {
        keyword: "乙女ゲー世界はモブに厳しい世界です",
        rank: 10,
        hook: "【女尊男卑貴族社会への叛逆】理不尽な貴族院の結婚制度をロストアイテムの力で完全粉砕！",
        detailedReview: "女尊男卑の傲慢な貴族社会にモブとして転生したリオン。王宮夜会でのイケメン王子たちの理不尽な振る舞いを舌戦と決闘で叩きのめし、腐敗した貴族社会の序列を破壊していく痛快無比な下剋上です。"
      }
    ]
  }
];

async function enrichPart24() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart24) {
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
  console.log(`\nBatch features part 24 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart24().catch(console.error);
