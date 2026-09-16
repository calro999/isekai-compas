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

const batchPart5 = [
  {
    slug: "isekai-alchemist-potion-craft-10",
    title: "錬金術師・ポーション調合おすすめ異世界ラノベ10選【万能薬・アイテムクリエイト・工房経営】",
    description: "万能ポーションの作成から伝説のエリクサー調合、工房経営まで！錬金術スキルで無双・大活躍するおすすめ異世界錬金術師ラノベ10作品を徹底解説。読者が求めるクラフト・調合要素が満載の決定版。",
    category: "クラフト・錬金術",
    leadText: "「薬草を採取して万能ポーションを調合する」「常識外れの効果を持つ霊薬で国中の貴族や冒険者を驚嘆させる」——錬金術師を主役に据えた作品は、ファンタジー特有のクラフト要素と研究・経営の面白さが凝縮された大人気ジャンルです。粗悪なポーションしか作れない世界に突如現れた天才錬金術師の成り上がりや、ひっそり辺境で営む工房スローライフまで、今読むべき傑作10選を厳選紹介します。",
    searchQueries: [
      "異世界 錬金術師 ラノベ おすすめ",
      "ポーション 調合 小説 なろう",
      "錬金術 工房経営 スローライフ",
      "アイテム作成 チート ラノベ"
    ],
    items: [
      {
        keyword: "ポーション頼みで生き延びます！",
        rank: 1,
        hook: "【容器も効果も自由自在】神様から授かったチート容器と万能ポーションで異世界を完全攻略！",
        detailedReview: "突然異世界へ転移することになった主人公カオルが手に入れたのは、「思い描いた通りの効果を発揮する薬品を、思い通りの容器に入れて生み出せる」という超絶チート能力。若返りの薬から病の特効薬、さらには酸や聖水まで自由自在に生み出し、狡猾な貴族や商人たちの思惑を巧みな交渉術とポーションの圧倒的効能で一蹴していく爽快感がたまりません。商魂逞しい少女の痛快サクセスストーリーです。"
      },
      {
        keyword: "聖女の魔力は万能です",
        rank: 2,
        hook: "【効能5割増しの奇跡】植物研究所で調合したポーションが国を救う！大人の癒やし系異世界ファンタジー",
        detailedReview: "仕事帰りに聖女召喚に巻き込まれたOLセイが、放置された王宮を離れて薬用植物研究所で暮らし始める物語。彼女が作るポーションはなぜか通常よりも5割増しの驚異的な効能を持ち、瀕死の騎士団長を救ったことからその非凡な才能が明らかになっていきます。丁寧な薬草採取や調合プロセスの描写、そして研究所の仲間たちとの温かな交流が心地よく、クラフト小説の金字塔と呼べる逸品です。"
      },
      {
        keyword: "辺境の薬師、都でSランク冒険者となる",
        rank: 3,
        hook: "【規格外の調合術】辺境で培った薬師の常識が都の常識を覆す！勘違い＆無双劇",
        detailedReview: "人里離れた辺境で師匠から苛烈な修行を受け、あらゆる万能薬を当然のように作れるようになった薬師の青年が都へ上京する痛快ファンタジー。本人は「これくらい普通」と思って差し出した回復薬が、都の最高峰ポーションすら足元にも及ばない超神薬だったことから大騒動へと発展します。無自覚な実力者による圧倒的ポーション無双と爽快なバトル展開が見どころです。"
      },
      {
        keyword: "錬金術師です。自重はゴミ箱に捨ててきました。",
        rank: 4,
        hook: "【ブレーキ破壊の錬金術】神々の遺産すら超えるアイテムを量産する暴走錬金コメディ！",
        detailedReview: "転生時に錬金術スキルを得た主人公が、常識や自重を完全に投げ捨てて思いつく限りの超兵器や超回復アイテムを作り出していく痛快コメディ。周囲の常識を木っ端微塵に粉砕するアイテムの数々と、それに振り回される周囲のリアクションが最高に痛快です。制限なしのクラフト無双を思う存分堪能したい読者にイチオシの作品です。"
      },
      {
        keyword: "新米錬金術師の店舗経営",
        rank: 5,
        hook: "【お宝素材採取と工房経営】孤児院育ちの少女が念願の自分のお店を辺境の村でオープン！",
        detailedReview: "難関の王立錬金術師養成学校を卒業した少女サラサが、格安で買い取った辺境の村の店舗で一人前の錬金術師を目指す物語。薬草の採取から魔物の素材解体、ポーション調合、村人たちとの売買交渉や設備投資など、錬金術師のリアルな「お店経営」の側面が非常に緻密に描かれています。丁寧な世界観と少女たちの友情、そして時にシビアな冒険者事情のバランスが絶妙です。"
      },
      {
        keyword: "異世界薬局",
        rank: 6,
        hook: "【現代薬理学×神術】若き薬学研究者が神の力と近代医学で中世の病魔に立ち向かう！",
        detailedReview: "過労死した天才薬学研究者が、宮廷薬師の名家に転生。物質創造・消去の神術と前世の圧倒的な薬学・病理学知識を武器に、当時不治とされていた結核やペストなどの難病を次々と治療していく本格派医療・錬金ファンタジー。確かな医学的知見に基づいたポーション・医薬品調合のリアリティは他作品の追随を許しません。"
      },
      {
        keyword: "チート薬師のスローライフ",
        rank: 7,
        hook: "【ドラッグストア開店】鑑定と創薬スキルで異世界の人々と人外を癒やすほのぼの日常！",
        detailedReview: "社畜生活に疲れて異世界へ転移した主人公レイジが、手に入れた創薬スキルを活用して田舎町にドラッグストアを開店。傷薬や解毒薬だけでなく、エナジードリンクや食器用洗剤、スキンケア用品まで次々と作り出し、人狼の少女ノエラや幽霊のミナとともにのんびりスローライフを送ります。ストレスフリーで読める極上の癒やし系調合譚です。"
      },
      {
        keyword: "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました",
        rank: 8,
        hook: "【辺境薬草店ライフ】勇者パーティの元導き手が愛するお姫様と営む極上の薬草店！",
        detailedReview: "初期レベルが高かったものの成長限界を迎えて勇者パーティを追放されたレッドが、最果ての地ゾルタンで薬草屋を開業する物語。採取した薬草の丁寧な下処理や軟膏作り、そしてかつての仲間である元ツンデレお姫様リットとの甘酸っぱい同棲生活が丁寧に描かれます。薬師としての確かな知識と、いざという時の実力者ぶりが見事に調和した名作です。"
      },
      {
        keyword: "アトリエ",
        rank: 9,
        hook: "【王道錬金術の神髄】素材の品質選定から特性引き継ぎまで！調合の奥深さを突き詰めた世界観",
        detailedReview: "様々な素材を採取し、大釜で調合して新たなアイテムを生み出す錬金術の面白さを徹底的に描いた大人気シリーズ。品質管理、特性の継承、レシピの発想など、錬金術師ならではの試行錯誤と成長ストーリーが濃密に描かれており、クラフト系ファンタジーが好きな読者なら絶対に外せない鉄板作品です。"
      },
      {
        keyword: "転生少女の履歴書",
        rank: 10,
        hook: "【地道な研究と技術革新】魔法と化学を融合させて生活必需品から新産業を興す知性派サクセス！",
        detailedReview: "転生した少女が持ち前の知的好奇心と研究熱心さを活かし、魔法世界の素材を科学的な視点で分析・精製していく本格派技術・錬金ファンタジー。単なるチート付与ではなく、試行錯誤と実験を重ねて新たな薬品や合成素材を生み出していく地道な開発プロセスが知的好奇心を刺激します。"
      }
    ]
  },
  {
    slug: "isekai-baby-childhood-growth-10",
    title: "赤ちゃん・幼少期から始まる異世界転生おすすめラノベ10選【神童・修行・英才教育・天才児無双】",
    description: "赤ん坊や幼少期から転生スタート！赤子の頃からの魔力修行や前世知識を活かした神童無双、家族との温かい絆を描いたおすすめ異世界幼少期ラノベ10選を徹底紹介。成長の醍醐味が味わえる傑作集。",
    category: "成長・神童・幼少期",
    leadText: "「赤ん坊の頃からハイハイしながら魔力を練り上げる」「幼少期から大人顔負けの知性と魔法で周囲を驚愕させる神童無双」——赤ちゃんや幼少期から人生をやり直す転生ファンタジーは、主人公の成長過程をじっくり味わえる屈指の人気テーマです。家族との心温まる絆や、小さな体でとんでもない偉業を成し遂げる爽快感が詰まった至高の10選をお届けします。",
    searchQueries: [
      "赤ちゃん 転生 ラノベ おすすめ",
      "幼少期から始まる 異世界 成長",
      "神童 魔法修行 天才児 なろう",
      "子供 転生 スローライフ 小説"
    ],
    items: [
      {
        keyword: "無職転生",
        rank: 1,
        hook: "【大河ファンタジーの最高峰】赤ん坊ルーデウスの魔法修行から始まる壮大な人生の再起！",
        detailedReview: "人生に絶望していた34歳引きこもり男が、赤ん坊ルーデウスとして異世界に転生。幼少期から魔力総量を増やすための地道な鍛錬や無詠唱魔法の習得に励み、師匠ロキシーとの出会いを経て成長していく過程が圧倒的な筆力で描かれます。赤ちゃんからの成長過程を最も丁寧に、そして情熱的に描いた異世界転生の金字塔です。"
      },
      {
        keyword: "本好きの下剋上",
        rank: 2,
        hook: "【病弱幼女の知恵と執念】虚弱な体と貧民街の環境から本を読むために世界を変革する！",
        detailedReview: "本を愛する女子大生が、病弱な少女マインとして中世風異世界の貧民街で目覚める物語。紙も本も高価で手に入らない世界で、前世知識と驚異の行動力を武器に植物から紙を手作りし、粘土板や簡易インクの開発に挑みます。幼少期の過酷な環境から家族や仲間たちと支え合って成り上がっていく展開は涙と感動の連続です。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 3,
        hook: "【貧乏貴族の八男スタート】5歳の朝に覚醒！隠された魔力と師匠の遺産で大出世！",
        detailedReview: "商社マンの一宮信吾が目を覚ますと、辺境の貧乏貴族の八男・ヴェンデリン（5歳）になっていた。領地も遺産も継げない絶望的な境遇の中、自身の持つ莫大な魔力資質に気づき、森で出会った魔法使いの師匠から手ほどきを受けて実力を開花させていきます。幼少期からの地道な修行と自立への歩みが痛快な立身出世ストーリーです。"
      },
      {
        keyword: "賢者の孫",
        rank: 4,
        hook: "【規格外の神童育成】大賢者に拾われ物理法則×魔法で常識知らずの最強チート児誕生！",
        detailedReview: "赤ん坊の時に大賢者マーリンに拾われたシンは、前世の物理法則の記憶を魔法に応用することで、幼少期から規格外の魔力を発揮。しかし大賢者が「常識」を教え忘れたため、15歳で街に出た時には世界を揺るがす超絶チート神童になっていたという痛快作。無邪気に常識をぶち破る爽快感は一級品です。"
      },
      {
        keyword: "転生貴族の異世界冒険録",
        rank: 5,
        hook: "【神々の過保護な加護】5歳のお披露目会でステータスが神レベルに爆発！",
        detailedReview: "通り魔から少女をかばって命を落とした青年が、貴族の三男カイン（3歳）として転生。5歳の洗礼式で神々からやりすぎなほどの加護とチートステータスを授かり、神童どころか人外レベルの力を得てしまいます。子供ならではの無邪気さで無双し、国王や貴族たちを胃痛に追い込むギャグ＆爽快バトルが魅力です。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 6,
        hook: "【最弱魔物からの新生】洞窟での赤子同然のスタートから捕食と解析で無限進化！",
        detailedReview: "通り魔に刺されて死んだサラリーマンが異世界の洞窟でスライムとして誕生。視覚も聴覚もない生まれたての状態から「大賢者」と「捕食者」のスキルを駆使して世界の理を理解し、ヴェルドラとの出会いを経て急速に進化していきます。弱小な存在からの段階的な成長と勢力拡大のプロセスが痛快無比です。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 7,
        hook: "【勘違い神童の悲喜劇】10歳の誕生日に前世を思い出し、神の「平均」解釈で超人に！",
        detailedReview: "前世で才能がありすぎて孤独だった少女が、「来世の能力は平均値で」と願って転生したものの、神様が算出した「世界の最強種（古竜）と最弱種の平均」によって人類平均の6800倍の魔力を持つスーパー幼女マイルに。目立たず普通の幸せを掴もうとするのに、実力が隠しきれず神童ぶりがバレてしまうドタバタ劇が最高です。"
      },
      {
        keyword: "転生貴族、鑑定スキルで成り上がる",
        rank: 8,
        hook: "【弱小貴族の神童領主】3歳にして他人の潜在能力を見抜く眼力で天下の逸材をスカウト！",
        detailedReview: "弱小貴族の長男アルス（3歳）として転生した主人公が、他人のステータスや隠れた才能を見抜く「鑑定スキル」を開花。差別されていた差別民の魔法天才少年や、落ちこぼれの剣術達人など、世に埋もれていた逸材たちを幼少期から次々と臣下に迎え入れ、最強の領地を作り上げていく感動の人材育成ファンタジーです。"
      },
      {
        keyword: "転生幼女はあきらめない",
        rank: 9,
        hook: "【超愛され幼女の奮闘】生まれた瞬間から死線！愛らしい容姿と知恵で周囲を虜にする！",
        detailedReview: "転生した途端に母親を亡くし、厳しい貴族社会の中で生き残りをかけて奮闘する幼女リーリアの物語。まだ言葉も話せない赤ん坊の時期から前世の知性と卓越した魔力適性を活かして周囲の大人たちの警戒を解き、圧倒的な愛らしさと神童ぶりで味方を増やしていくハートフルな成長劇です。"
      },
      {
        keyword: "魔力ゼロの最強賢者",
        rank: 10,
        hook: "【無魔力からの大逆転】赤子の頃に魔力ゼロと判定されながらも前世の魔導具知識で無双！",
        detailedReview: "魔法が全ての世界で魔力ゼロの劣等生として生まれた少年が、前世で極めた現代科学と魔導具技術を融合させて独自の魔法体系を構築。幼少期からのたゆまぬ研究と実験によって、魔法至上主義の貴族たちを圧倒していく下剋上ストーリーです。"
      }
    ]
  }
];

async function enrichPart5() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart5) {
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
  console.log(`\nBatch features part 5 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart5().catch(console.error);
