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

const batchPart25 = [
  {
    slug: "isekai-reincarnated-agriculture-farming-slowlife-10",
    title: "異世界農業・開拓・農園スローライフおすすめラノベ10選【万能農具・品種改良・自給自足の至福】",
    description: "荒れ果てた死の森や未開拓地を、チート農具と現代農業技術で一大穀倉地帯へ！野菜づくり、果樹園、醸造、仲間たちとの温かな収穫祭を描くおすすめ異世界農業・開拓ラノベ10選を徹底解説。",
    category: "農業・開拓・農園スローライフ",
    leadText: "「神様から授かった万能農具を振るい、どんな荒れ地も一瞬で肥沃な畑に変える」「異世界の未知の作物を品種改良し、味噌や醤油を醸造して至高の宴を開く」——異世界農業・開拓ファンタジーは、土を耕し作物を育てる地道な喜びと、仲間が集まり村が豊かになっていく開拓の醍醐味が最大の魅力です。心癒やされる傑作10選をお届けします。",
    searchQueries: [
      "異世界 農業 ラノベ おすすめ",
      "農園 開拓 スローライフ 小説 なろう",
      "異世界のんびり農家 類似作品",
      "万能農具 自給自足 ファンタジー 名作"
    ],
    items: [
      {
        keyword: "異世界のんびり農家",
        rank: 1,
        hook: "【万能農具で死の森を開拓】どんな土地も一瞬で耕作！多種族が集う大樹の村の理想郷！",
        detailedReview: "闘病生活の末に若くして命を落とした火楽（ヒラク）。神様から病気知らずの健康体と「万能農具」を授かり、誰も住めない死の森で気ままな農業を開始。トマト、大根、稲作から果樹園、酒造りまで次々と成功させ、エルフや吸血鬼たちとともに豊かで温かな村を作り上げる農園ファンタジーの頂点です。"
      },
      {
        keyword: "乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…",
        rank: 2,
        hook: "【破滅回避のための畑仕事】土と対話する悪役令嬢カタリナの無自覚人たらし農作業！",
        detailedReview: "追放エンドに備えて「追放されても農業で生きていけるように」と公爵邸の庭を耕し始めたカタリナ。泥だらけになりながら美味しい野菜を育てる彼女の無邪気な姿が、攻略対象の王子たちや令嬢たちの心を癒やし、破滅フラグをへし折っていく大人気コメディです。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 3,
        hook: "【現代の化学肥料と灌漑技術】日本の農業資材を大量投入し飢饉の農村を大救済！",
        detailedReview: "40億円の資産で日本のホームセンターから肥料、種子、農業用具を買い込み異世界へ運ぶカズラ。中世レベルの痩せた土地に現代の土壌改良技術と灌漑用水路を導入し、作物の収穫量を飛躍的に高めて飢餓に苦しむ領民を救う本格派開拓譚です。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 4,
        hook: "【特製農具の鍛造と家庭菜園】切れ味抜群の鍬や鎌を打ち上げ、森の工房で自給自足！",
        detailedReview: "森の中に鍛冶工房を構えたエイゾウ。村人たちのために土離れが良く疲れない特製クワやカマを鍛造。自身の工房の裏庭でも新鮮な野菜を育て、仲間たちと採れたてジビエ料理を楽しむ大人のための落ち着いたスローライフです。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 5,
        hook: "【スカベンジャースライムの肥料化】スライムの排泄物を超高品質な有機肥料として農園へ！",
        detailedReview: "リョウマが育てるスカベンジャースライム。ゴミや汚物を分解して極上の肥料を生み出す特性を活かし、荒れた土地を瞬時に豊かな農地へと再生。自然の循環とスライムの生態系を活かしたエコな農園開拓が魅力です。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 6,
        hook: "【魔法土木による超大規模開墾】山林を一瞬で農地に変え、米と大豆の栽培を推進！",
        detailedReview: "ヴェンデリンの土魔法チート。広大な未開拓地を一瞬で平地に均し、水路を引いて大規模な水田と畑を造成。前世の知識で米や大豆の栽培を成功させ、領地に一大農業革命をもたらすスケールの大きな開拓劇です。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 7,
        hook: "【全土の珍しい種苗収集と果樹園】ストレージで保管した苗木を孤児院や領地で栽培！",
        detailedReview: "大陸全土を旅するサトゥー。各地の市場で見つけた珍しい果物や香辛料の種子を収集し、自領や孤児院の農園で栽培・品種改良。採れたての果物でジャムやスイーツを作り、仲間たちを笑顔にするハートフルな農園ライフです。"
      },
      {
        keyword: "スライム倒して300年、知らないうちにレベルMAXになってました",
        rank: 8,
        hook: "【高原のハーブ園と自家製野菜】過労死の反省から毎日少しずつ育てる癒やしの畑！",
        detailedReview: "不老不死の魔女アズサが暮らす高原の一軒家。生活に必要な分だけハーブや野菜を育て、ポーションを調合したり美味しい家庭料理を作ったり。可愛い家族たちと一緒に無理のない自給自足生活を送る極上の癒やし作品です。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 9,
        hook: "【ダンジョン内水耕栽培と果樹園】DPで環境を整え、四季折々の新鮮野菜を収穫！",
        detailedReview: "迷宮の居住階層に広大な農園を整備したユキ。天候や害虫に左右されないダンジョン環境を活かし、レフィたちの大好物である甘い果物や新鮮な野菜を栽培。自給自足の美味しい食卓を囲むホームドラマです。"
      },
      {
        keyword: "村人転生 最強のスローライフ",
        rank: 10,
        hook: "【名もなき村人の土壌改良チート】前世の知識と微細な魔力操作で寒村を豊作の村へ！",
        detailedReview: "最果ての寒村に生まれた村人主人公。土壌の酸度調整や堆肥作りを前世の知識で行い、魔力操作で作物の成長を促進。貧しかった村を豊かな農村へと発展させていく、愚直で温かい農業サクセスストーリーです。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-black-magical-academy-10",
    title: "魔法学園・特待生・落ちこぼれの逆転劇おすすめ異世界ラノベ10選【実力隠蔽・学園首席・下剋上無双】",
    description: "名門貴族の魔法学園に入学した平民・特待生・落ちこぼれが、実技試験と魔力測定で学園の常識を完全破壊！おすすめ魔法学園・下剋上逆転ラノベ10選を徹底紹介。",
    category: "魔法学園・特待生・下剋上",
    leadText: "「貴族主義の魔法学園で無能の烙印を押された少年が、実技試験で学年首席を圧倒する」「測定不能の莫大な魔力で学園の測定水晶を爆砕し、教師たちを絶句させる」——魔法学園ファンタジーは、身分差別や見下しを圧倒的な実力で粉砕するカタルシスと、魅力的な学友たちとの青春が最大の魅力です。熱き10選を厳選しました。",
    searchQueries: [
      "魔法学園 ラノベ おすすめ",
      "落ちこぼれ 特待生 下剋上 異世界 小説 なろう",
      "魔王学院 類似作品 学園無双",
      "魔力測定 破壊 実力隠蔽 ファンタジー"
    ],
    items: [
      {
        keyword: "魔王学院の不適合者",
        rank: 1,
        hook: "【測定不能の不適合者】二千年前の始祖魔王が子孫たちの学校で全てを蹂躙・再教育！",
        detailedReview: "転生して魔王学院に入学した暴虐の魔王アノス。魔力測定器の限界を超えていたため「不適合者」と判定されるが、心臓の鼓動音だけで上級生を倒し、失われた古代魔法を完璧に操って教師や皇族たちを圧倒する学園下剋上の最高峰です。"
      },
      {
        keyword: "賢者の孫",
        rank: 2,
        hook: "【アールスハイド高等魔法学院首席】入学試験で規格外の魔力弾を放ち学院の的を蒸発させる！",
        detailedReview: "王立魔法学院の実技試験に挑んだシン・ウォルフォード。常識知らずの彼が放った無詠唱魔法が試験場の防護壁ごと標的を消滅させ、満場一致で首席入学。同級生たちに規格外の魔法理論を教えて『アルティメット・マジシャンズ』を結成します。"
      },
      {
        keyword: "無職転生",
        rank: 3,
        hook: "【ラノア魔法大学での特別生生活】無詠唱魔術の天才として学園の難題や人間関係を解決！",
        detailedReview: "ラノア魔法大学に特待生として入学したルーデウス。無詠唱魔術の扱い手として一目置かれながら、天才少女フィッツ（シルフィエット）や個性豊かな生徒たちとの交流、魔術研究を通じて心の傷を癒やしていく感動の学園編です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 4,
        hook: "【ミドガル魔剣士学園のモブA立ち回り】実技試験で完璧な負けっぷりを演じつつ夜は学園を救う！",
        detailedReview: "魔剣士学園に入学したシド・カゲノー。昼は『どこにでもいる平凡でダサいモブ学生』を寸分違わず演じ、テロリストの襲撃時にはあえて最初に斬られる完璧なモブ演技を披露。そして夜はシャドウとして敵拠点を殲滅する爆笑学園コメディです。"
      },
      {
        keyword: "悪役令嬢レベル99 〜私は裏ボスですが魔王ではありません〜",
        rank: 5,
        hook: "【王立学園の魔力測定でレベル99】測定不能の漆黒の魔力で教師と生徒たちをパニックに！",
        detailedReview: "学園入学時のレベル測定でカンスト値『99』を叩き出したユミエラ。魔王の手先と疑われながらも、実技演習でブラックホールを召喚してボスモンスターを一撃粉砕するなど、マイペースに学園生活を謳歌する無双劇です。"
      },
      {
        keyword: "乙女ゲー世界はモブに厳しい世界です",
        rank: 6,
        hook: "【学園の専横貴族と決闘裁判】高飛車なイケメン王子たちの鎧をロストアイテムで一撃粉砕！",
        detailedReview: "女尊男卑の王立学園に入学したモブ男子リオン。傲慢な攻略対象の王子たちがアンジェリカを断罪しようとした際、決闘裁判を申し込んで鎧（アロガンツ）で王子5人を完膚なきまでに叩きのめす痛快無比な名場面が光ります。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 7,
        hook: "【ロドネア帝立学園での呪術無双】魔力ゼロと侮られた少年が式神と呪符で学園の天才を圧倒！",
        detailedReview: "名門ロドネア学園に入学したセイカ。魔力がないと見下されるが、異世界の誰も知らない陰陽道の術理で魔力測定器をハックし、実技試験でドラゴンを一瞬で呪縛。裏で学園を脅かす悪魔崇拝者を静かに始末します。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 8,
        hook: "【エッカルス王立ハンター養成学校】手加減しているのに常人の数千倍の魔力を発揮！",
        detailedReview: "ハンター養成学校に入学したマイル。平凡な生徒を目指して全力で手加減するものの、体力測定で世界記録を更新し、模擬戦で剣を素手で白刃取りしてしまうなど、隠しきれない神童ぶりが笑いを誘うドタバタ学園劇です。"
      },
      {
        keyword: "ナイト＆マジック",
        rank: 9,
        hook: "【ライヒアラ騎操士学園の神童】幼少期から学生の枠を超えて新型ロボットの設計を主導！",
        detailedReview: "騎操士養成学園に入学したエルネスティ。持ち前のプログラミング知識と魔力操作で学園の教官たちを驚愕させ、学生でありながら国を揺るがす新型シルエットナイト開発プロジェクトのリーダーとなる痛快サクセスです。"
      },
      {
        keyword: "ゼロの使い魔",
        rank: 10,
        hook: "【トリステイン魔法学院での波乱】使い魔となった平凡な日本人が学院最強の騎士へ！",
        detailedReview: "名門魔法学院を舞台に、落ちこぼれのルイズに召喚された才人。魔法至上主義の貴族生徒たちから見下されながらも、伝説のガンダールヴの力で学院の決闘や外敵の襲撃を退け、英雄へと成り上がっていく金字塔です。"
      }
    ]
  }
];

async function enrichPart25() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart25) {
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
  console.log(`\nBatch features part 25 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart25().catch(console.error);
