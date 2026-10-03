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

const batchPart7 = [
  {
    slug: "isekai-reincarnated-as-monster-nonhuman-10",
    title: "魔物・人外転生おすすめ異世界ラノベ10選【スライム・蜘蛛・ドラゴン・進化と捕食の快感】",
    description: "人間を辞めて魔物に転生！スライム、蜘蛛、ドラゴン、剣、スケルトンなど、人外スタートから捕食・スキル獲得・存在進化を繰り返して生態系の頂点へ登りつめるおすすめ人外魔物転生ラノベ10選を徹底紹介。",
    category: "魔物転生・人外主人公",
    leadText: "「目が覚めたらプルプルのスライムだった」「最弱の小蜘蛛として生まれた過酷な迷宮サバイバル」——人間以外の魔物や無機物に転生する人外ファンタジーは、レベルアップによる劇的な『進化（エボリューション）』と捕食スキルの獲得が最大の魅力です。独自の生態系を生き抜き、やがて神話級の存在へと至る圧巻の10作品を厳選しました。",
    searchQueries: [
      "魔物転生 ラノベ おすすめ",
      "人外 転生 小説 なろう",
      "スライム 蜘蛛 ドラゴン 転生 進化",
      "魔物進化 捕食 スキル 異世界"
    ],
    items: [
      {
        keyword: "転生したらスライムだった件",
        rank: 1,
        hook: "【最弱から魔王への進化】大賢者と捕食者を武器に魔物の国を築くモンスター転生の最高峰！",
        detailedReview: "通り魔に刺されたサラリーマンが異世界で目覚めると、最弱のモンスター「スライム」になっていた。しかし特殊スキル【捕食者】であらゆる対象の能力を解析・吸収し、【大賢者】のナビゲートを得て急速に力を拡大。暴風竜ヴェルドラをはじめとする強力な魔物たちと絆を結び、多種族が共存する巨大国家ジュラ・テンペスト連邦国を建国していく痛快無比のサクセスストーリーです。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 2,
        hook: "【絶望の迷宮サバイバル】最弱小蜘蛛が罠と知恵と毒で凶悪モンスターを喰らい尽くす！",
        detailedReview: "女子高生が目覚めると、世界最大の大迷宮で生まれたばかりの「スモールライトレッサータラテクト（小型蜘蛛）」だった。肉親同士の共食い、格上の凶悪魔物たちの襲撃という絶体絶命の環境の中、蜘蛛糸の罠と麻痺毒、そして持ち前のポジティブ思考で死線を突破。進化ツリーを駆け上がり、神の領域へと至る超骨太サバイバルファンタジーです。"
      },
      {
        keyword: "転生したら剣でした",
        rank: 3,
        hook: "【意志を持つ知性魔剣】名もなき黒猫族の少女と契約し、魔石を喰らって自己進化！",
        detailedReview: "交通事故で死んだ男が転生したのは、魔法とスキルを使う自我を持った「知性を持つ魔剣（インテリジェンス・ウェポン）」。台座に刺さって動けなかった彼が出会ったのは、奴隷として虐げられていた猫耳少女フラン。師匠と弟子として契約を交わし、魔物の魔石を吸収して剣自身がスキルアップしながら、フランの進化と自由のために世界を駆ける心温まる冒険譚です。"
      },
      {
        keyword: "転生したらドラゴンの卵だった",
        rank: 4,
        hook: "【卵スタートの進化ロード】ステータス鑑定を頼りに最凶ドラゴンへの進化ツリーを駆け上がる！",
        detailedReview: "未知の森の中で転生したのは、なんと一個のドラゴンの卵。孵化して竜の幼体「ベビードラゴン」となった主人公は、弱肉強食の過酷な野生で生き残るため、魔物を狩って経験値を稼ぎ、分岐する進化ツリーから生き残りやすい系統を選択していきます。ゲームライクな進化システムと、孤独なドラゴンと少女の交流が胸を熱くさせます。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 5,
        hook: "【骨人からの存在進化】竜に喰われた冒険者がスケルトンから不死者として再生を目指す！",
        detailedReview: "迷宮の未踏破区域で竜に遭遇し喰われてしまった底辺冒険者レント。奇跡的に意識を取り戻したものの、その体は白骨の魔物「スケルトン」だった。人間に戻るため、魔物を討伐して魔力を吸収する「存在進化（エボリューション）」を重ね、グール、屍食鬼、上位吸血鬼へと進化しながら、かつての夢である神銀級冒険者を目指す重厚な物語です。"
      },
      {
        keyword: "Re:Monster",
        rank: 6,
        hook: "【ゴブリンからの喰代受胎】食べたものの能力を完全吸収！最弱ゴブリンが魔王級へ君臨！",
        detailedReview: "非業の死を遂げた超能力者が、最弱モンスターの「ゴブリン」として転生。しかし食べたものの能力やスキルをそのまま自分の力にできるチート能力【吸喰能力（アクロファジー）】を持っていた。周囲の魔物や敵対者を貪り喰らい、ホブゴブリン、オーガ、使徒種へと驚異的なスピードで進化を遂げ、魔物軍団を統率する覇王へと登りつめます。"
      },
      {
        keyword: "オーバーロード",
        rank: 7,
        hook: "【アンデッドの絶対覇者】死の支配者たる骸骨の大魔法使いが世界をその手中に収める！",
        detailedReview: "サービス終了を迎えたDMMO-RPG「ユグドラシル」で、ガイコツ姿の大魔法使いモモンガ（アインズ・ウール・ゴウン）としてゲームの世界観ごと異世界へ転移。人間性を失った冷徹なアンデッドの肉体と、絶対の忠誠を誓うナザリック地下大墳墓のNPCたちを率い、圧倒的な軍事力と計略で世界征服へと乗り出すダークファンタジーの金字塔です。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 8,
        hook: "【全身骨格の最強騎士】見た目は凶悪アンデッド、中身はお人好しな世直し道中記！",
        detailedReview: "MMORPGのプレイ中に寝落ちした主人公が、アバターである「全身骨格の骸骨騎士アーク」の姿で異世界へ転移。目立つと魔物として討伐されてしまうため鎧兜で骨の体を隠しつつ、旅先で困っているエルフの美少女や人々を圧倒的なゲームスキルで助けていく爽快痛快な世直しファンタジーです。"
      },
      {
        keyword: "自動販売機に生まれ変わった俺は迷宮を彷徨う",
        rank: 9,
        hook: "【無機物転生の衝撃作】動けない自動販売機が缶ジュースとおでんで迷宮の救世主に！",
        detailedReview: "自動販売機マニアの男が、倒れてきた自販機から身を守って死亡し、なんと異世界の迷宮で「自動販売機（ハッコン）」に転生。自分からは動けないものの、ポイントを消費して現代のあらゆる飲料・食品・生活用品を排出し、怪力少女ラッミスに背負われて迷宮を攻略していく奇抜かつ緻密な傑作コメディです。"
      },
      {
        keyword: "転生したらドラゴンの幼女だった",
        rank: 10,
        hook: "【神話級ドラゴンの日常】人智を超えた強大な力と愛らしい姿のギャップに癒やされる！",
        detailedReview: "最強のドラゴンとして生まれ変わった主人公が、人外としての圧倒的なスペックを持ちながらも、温かい人々や仲間たちと触れ合いながらマイペースに過ごすほのぼのファンタジー。規格外のブレスや飛行能力でトラブルを一撃解決する爽快感と、愛らしい日常の対比が魅力です。"
      }
    ]
  },
  {
    slug: "isekai-territory-management-kingdom-building-10",
    title: "領地経営・国づくりおすすめ異世界ラノベ10選【内政チート・産業革命・インフラ整備・富国強兵】",
    description: "荒れ果てた寒村や貧乏領地を近代技術と経済改革で大都市へ！インフラ整備・衛生改革・農業革命・法整備で国を豊かにするおすすめ内政・領地経営・建国ファンタジーラノベ10選を徹底解説。",
    category: "内政・領地経営・建国",
    leadText: "「痩せた土地を土壌改良と新農法で穀倉地帯に変える」「上下水道の整備や特産品の開発で貧乏領地を一大交易都市へ発展させる」——領地経営・内政ファンタジーは、主人公の現代知識と戦略によって街や国が目に見えて豊かになっていく達成感が最大の魅力です。知略と情熱で理想国家を築き上げる珠玉の10選を紹介します。",
    searchQueries: [
      "領地経営 ラノベ おすすめ",
      "内政チート 異世界 国づくり 小説",
      "富国強兵 産業革命 なろう ファンタジー",
      "領主 貴族 開発 スローライフ"
    ],
    items: [
      {
        keyword: "現実主義勇者の王国再建記",
        rank: 1,
        hook: "【超本格派内政ファンタジー】現代の行政・財政・人材登用術で破綻寸前の王国を劇的に再生！",
        detailedReview: "勇者として異世界のエルフリーデン王国に召喚された相馬一也（ソーマ）。しかし彼は魔王討伐ではなく、国の破綻した財政と食糧難を立て直すため、前世の法学・経済学の知識を駆使して「富国強兵」に着手。「唯才の令」によって身分を問わず有能な人材を集め、物流改革や港湾整備、農業振興を断行して国難を乗り越えていく本格派王道内政譚です。"
      },
      {
        keyword: "異世界薬局",
        rank: 2,
        hook: "【公衆衛生と薬局経営】中世の不衛生な都市に近代医療と薬事制度を根付かせる！",
        detailedReview: "宮廷薬師の名家に転生した薬学研究者ファルマが、平民でも手頃な価格で安全な薬を手に入れられる「異世界薬局」を開業。貴族の独占市場を解体し、上下水道の清掃や消毒液の普及、ペストの検疫体制確立など、医療のみならず国家規模の公衆衛生改革を推し進めていく圧巻の社会変革ドラマです。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 3,
        hook: "【魔物たちのメガロポリス建設】道路舗装から上下水道、国際貿易ハブ都市の創出！",
        detailedReview: "スライムのリズムが築いたジュラ・テンペスト連邦国は、ドワーフの鍛冶技術やハイエルフの建築技術を取り入れ、近代的な舗装道路、上下水道、温泉旅館街まで備えた超巨大都市へと成長。周辺諸国との街道整備や関税同盟の締結など、緻密な外交・経済戦略によって世界経済の中心へと躍り出る建国劇の最高峰です。"
      },
      {
        keyword: "天才王子の赤字国家再生術",
        rank: 4,
        hook: "【国を売りたいのに名君に！？】予想外の知略と勝利が連鎖する痛快弱小国家サクセス！",
        detailedReview: "資源も軍事力もない弱小国家ナトラ王国の若き王子ウェイン。「早く国を売っ払って悠々自適の隠居生活を送りたい！」と願っているのに、持ち前の天才的な頭脳と外交手腕が裏目に出て、隣国を併合し、名君としての名声を世界中に轟かせてしまう痛快政略コメディ。張り巡らされた伏線と軍事・外交の駆け引きが秀逸です。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 5,
        hook: "【40億円の日本物資を全投入】肥料・農業機械・食料支援で飢饉に苦しむ領民を救済！",
        detailedReview: "メガビッグで40億円を当選した志野一良が、自宅の納屋が異世界に繋がっていることを発見。飢饉と重税に喘ぐイステール領の村を救うため、日本のホームセンターから化学肥料、農業用具、発電機、手押しポンプなどを大量に買い込んで持ち込み、圧倒的な近代物資で領地の農業革命とインフラ近代化を推し進めます。"
      },
      {
        keyword: "狼と香辛料",
        rank: 6,
        hook: "【中世経済と商取引の金字塔】為替・銀貨改鋳・相場取引を巡る行商人ホロとロレンスの旅路！",
        detailedReview: "行商人クラフト・ロレンスと豊穣の狼神ホロが旅をしながら、各地の都市で商取引を繰り広げる経済ファンタジーの伝説的名作。通貨の銀含有率操作、麦の先物取引、密輸の駆け引きなど、緻密な経済理論と商人たちの心理戦が圧倒的なリアリティで描かれます。内政・経済好きなら必読の一作です。"
      },
      {
        keyword: "異世界のんびり農家",
        rank: 7,
        hook: "【森の未開拓地から巨大自治領へ】万能農具で拓いた農地が多種族共存の一大勢力に！",
        detailedReview: "誰も寄り付かない「死の森」で一人農業を始めたヒラク。万能農具で作った豊かな作物の噂を聞きつけ、住処を追われたハイエルフや獣人、ドワーフたちが次々と移住。住居の建築、酒造り、チェスや野球などの娯楽導入まで、住人たちの要望に応えるうちに自然と巨大な自治共同体「大樹の村」が完成していく究極の箱庭内政です。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 8,
        hook: "【迷宮防衛と領地開発】DP（ダンジョンポイント）で畑・住宅・温泉を開発する領主ライフ！",
        detailedReview: "魔王としてダンジョンを創造する力を得たユキ。侵入者を罠で撃退しながらダンジョンポイントを稼ぎ、ダンジョン内に農園や住宅街、温泉施設を建設して自分だけの理想郷を築き上げます。覇王竜レフィやヴァンパイアの少女とともに、周辺の街との貿易協定を結びながら領地を発展させるハイブリッド内政です。"
      },
      {
        keyword: "公爵令嬢の嗜み",
        rank: 9,
        hook: "【乙女ゲーム悪役令嬢の内政改革】婚約破棄から領地代行へ！商会設立と税制改革で富国へ！",
        detailedReview: "乙女ゲームの悪役令嬢アイリスに転生した元公務員の主人公。ゲーム通りに婚約破棄を言い渡されるが、父である公爵から領地代行を任されることに。持ち前の行政知識と経済感覚を活かし、特産品チョコレートの販売、独自商会の立ち上げ、銀行制度の導入、初等教育の普及など、近代的領地経営で領民の圧倒的支持を集めます。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 10,
        hook: "【未開拓地の開墾と新領地経営】莫大な魔力でトンネル開削・山林伐採・巨大領地開拓！",
        detailedReview: "貧乏貴族の八男から大魔法使いとして頭角を現したヴェンデリン。手に入れた未開拓の広大な新領地を開発するため、規格外の土魔法で山を削ってトンネルを通し、広大な森を一瞬で農地に変え、魔導飛行船を就航させて物流網を構築。土木チートによる壮大な領地開発と貴族社会の政略が絡み合う大作です。"
      }
    ]
  }
];

async function enrichPart7() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart7) {
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
  console.log(`\nBatch features part 7 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart7().catch(console.error);
