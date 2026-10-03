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

const batchPart15 = [
  {
    slug: "isekai-demon-king-subordinates-territory-10",
    title: "魔王軍・配下育成・幹部無双おすすめ異世界ラノベ10選【絶対忠誠・組織拡大・軍団指揮】",
    description: "魔王として君臨、あるいは魔王軍の幹部・参謀として個性豊かな配下たちを育成・指揮！絶対の忠誠を誓う部下たちとともに勢力を拡大するおすすめ魔王軍・配下育成異世界ラノベ10選を徹底解説。",
    category: "魔王軍・配下育成・軍団指揮",
    leadText: "「絶対の忠誠を誓う配下の幹部たちが、主のために世界を跪かせる」「最弱の魔物たちを独自の軍事教練と進化で最強の軍団へ育て上げる」——魔王軍・配下育成ファンタジーは、主人公と配下たちの熱い主従の絆と、圧倒的な組織力で敵対勢力を蹂躙するスケール感が最大の魅力です。カリスマ溢れる傑作10選をお届けします。",
    searchQueries: [
      "魔王軍 ラノベ おすすめ",
      "配下育成 異世界 軍団指揮 小説 なろう",
      "魔王 主人公 忠誠 幹部 ファンタジー",
      "オーバーロード 類似作品 配下無双"
    ],
    items: [
      {
        keyword: "オーバーロード",
        rank: 1,
        hook: "【絶対支配者と忠実なる守護者たち】死の支配者アインズとナザリックNPCたちの完全掌握劇！",
        detailedReview: "ナザリック地下大墳墓の最高支配者アインズ・ウール・ゴウン。アルベド、デミウルゴス、シャルティアら神話級の階層守護者たちが捧げる絶対の崇拝と忠誠のもと、完璧な軍団連携と情報戦で世界を支配下に置いていく配下無双の最高峰です。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 2,
        hook: "【名付け進化と十二守護王】ゴブリンや鬼人を覚醒進化させ、世界最強の魔王軍を組織！",
        detailedReview: "リムルの【名付け】によって爆発的な進化を遂げたベニマル、シオン、ディアブロら配下たち。やがて覚醒魔王級の力を持つ「テンペスト十二守護王」として世界最強の軍団を形成し、主のために神や帝国軍を討滅していく熱き絆の物語です。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 3,
        hook: "【始祖魔王と混沌の七魔皇老】二千年の時を超えて集う臣下たちと偽りの歴史を粉砕！",
        detailedReview: "暴虐の魔王アノス・ヴォルディゴード。かつての配下である七魔皇老や新たに臣下となった魔族の生徒たちを率い、神々の理不尽な掟や偽りの魔王を圧倒的な力と知略で正す、カリスマ魔王の覇道が展開されます。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 4,
        hook: "【七陰と精鋭シャドウガーデン】主の妄想を完璧な組織力で具現化する超有能エリート美少女軍団！",
        detailedReview: "シャドウ（シド）に救われ、絶対の忠誠を誓うアルファら「七陰（しちいん）」。主の何気ない発言から真意を汲み取り（深読みし）、世界規模の商会や情報網、精鋭戦闘部隊を自律的に構築して闇の教団を追い詰める完璧な配下組織劇です。"
      },
      {
        keyword: "Re:Monster",
        rank: 5,
        hook: "【ゴブリン軍団の戦闘教練と進化】最弱の群れを階級制の強大モンスター軍団へ育成！",
        detailedReview: "最弱ゴブリンとして生まれたゴブ朗。吸喰能力で自身を進化させるだけでなく、仲間のゴブリンたちに武器製作、陣形戦術、魔術を徹底指導。ホブゴブリン、オーガ、使徒種へと集団進化させ、一大傭兵団・魔物帝国を築き上げます。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 6,
        hook: "【最強竜から吸血鬼までのファミリー】ダンジョンポイントで配下を召喚・強化する領主生活！",
        detailedReview: "魔王ユキのもとに集まった覇王竜レフィ、吸血鬼のイルナ、魔導司書やスライムたち。家族のような温かな絆で結ばれた配下たちとともに、侵入者を罠と圧倒的武力で迎撃しながらダンジョン拠点を豊かに発展させていきます。"
      },
      {
        keyword: "解雇された暗黒兵士（30代）のスローなセカンドライフ",
        rank: 7,
        hook: "【四天王を陰で操っていた名参謀】無能な上司に解雇された有能補佐官の偉大さが浮き彫りに！",
        detailedReview: "魔王軍四天王補佐として軍務・内政・補給の全てを取り仕切っていたダリエル。彼が解雇された途端に魔王軍四天王の機能が完全に麻痺し崩壊へ向かう様と、人間の村で新たな仲間たちを率いて英雄となるカタルシスが抜群です。"
      },
      {
        keyword: "悪役令嬢の執事様",
        rank: 8,
        hook: "【お嬢様専属の暗躍部隊組織】破滅を防ぐため、裏社会の有能な人材をスカウトし私兵化！",
        detailedReview: "悪役令嬢ソフィアを守る執事シリル。王都の裏路地で貧困に苦しむ孤児や腕利きの職人、暗殺者たちを救済して専属の諜報・防衛組織を設立。お嬢様への絶対忠誠を誓う精鋭部隊として敵対勢力を排除します。"
      },
      {
        keyword: "嘆きの亡霊は引退したい",
        rank: 9,
        hook: "【神話級ハンター集団『始まりの足跡』】マスターの意図を過大評価して勝手に難関を突破する猛者たち！",
        detailedReview: "帝都最強クランのリーダー・クライ。配下のレベル8ハンターたちやクランメンバーは、クライの奇行を「全てを見通した深謀遠慮」と盲信し、主のために超難関迷宮や帝国の陰謀を圧倒的な暴力で粉砕していきます。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 10,
        hook: "【上位竜・黒蜘蛛・亜人たちの理想郷】規格外の主人のもとに集う多種族最強コミュニティ！",
        detailedReview: "深澄真が拓いた亜空間『亜空』。トモエ、ミオ、識をはじめ、ハイオークやエルダードワーフ、アルケネなど、真の圧倒的な魔力と寛大さに心服した異種族たちが独自の軍事・生産拠点を築き上げます。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-blacksmith-apprentice-10",
    title: "鍛冶職人・魔導具クラフトおすすめ異世界ラノベ10選【神兵器鍛造・魔導具開発・職人魂】",
    description: "鉄を打ち、魂を込め、伝説の魔剣や革新的魔導具を創り出す！中世ファンタジーの技術体系を覆すおすすめ異世界鍛冶師・魔導具師ラノベ10選を徹底紹介。",
    category: "鍛冶職人・魔導具クラフト",
    leadText: "「無銘の鉄塊から神をも屠る伝説の魔剣を打ち出す」「前世の知識と魔導素材を組み合わせて世の中にない便利アイテムを開発する」——鍛冶・魔導具クラフトファンタジーは、地道なものづくりへの情熱と、自作した装備で仲間や世界が劇的に変わっていく職人ならではのカタルシスが最大の魅力です。魂を揺さぶる傑作10選を厳選しました。",
    searchQueries: [
      "鍛冶屋 異世界 ラノベ おすすめ",
      "魔導具師 クラフト 小説 なろう",
      "鍛冶 武器作成 スローライフ ファンタジー",
      "魔剣鍛造 アイテムクリエイト ラノベ"
    ],
    items: [
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 1,
        hook: "【生活魔導具クラフトの金字塔】前世の家電知識と魔導素材を融合し、職人たちと新時代を拓く！",
        detailedReview: "魔導具師ダリヤ・ロセッティ。小型魔導コンロ、防水布、人工炭酸水、ドライヤーなど、生活を豊かにする魔導具を次々と発明。素材の性質を深く理解し、職人たちと試行錯誤を重ねてものづくりの喜びを分かち合う温かな名作です。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 2,
        hook: "【チート生産スキルによる神業鍛造】森の工房で包丁から伝説の神剣まで思いのままにクラフト！",
        detailedReview: "定年退職を迎えた元社畜エイゾウが、神様から授かったチート生産能力で森の中に鍛冶工房を開業。切れ味抜群の万能包丁や農具で村人を喜ばせつつ、いざという時は竜をも断つ名剣を打ち上げる、大人のための落ち着いたクラフトスローライフです。"
      },
      {
        keyword: "本好きの下剋上",
        rank: 3,
        hook: "【本づくりのための技術革新】植物紙の漉き込みから金属活字の鋳造まで職人たちと技術を確立！",
        detailedReview: "本を読みたい一心で、紙の製造からインク調合、木版印刷、そして金属活字の鋳造に至るまで、中世の工房職人たちと議論を重ねて印刷文明の歴史を再現していく圧巻のクラフト叙事詩です。"
      },
      {
        keyword: "ナイト＆マジック",
        rank: 4,
        hook: "【巨大人型兵器の設計と魔改造】新型内骨格や推進機関をゼロから設計・建造するメカニック魂！",
        detailedReview: "エルネスティの重度なロボット工学愛。魔法演算コードの書き換えから新型シルエットナイトの内骨格設計、魔力転換炉の改良まで、自身の設計思想を具現化して戦場に革命を起こす開発メカアクションです。"
      },
      {
        keyword: "転生したら剣でした",
        rank: 5,
        hook: "【名工アリステアによる魔剣強化】神級鍛冶師の手によって自己進化する知性魔剣！",
        detailedReview: "意志を持つ魔剣（師匠）とフランの旅路。神級鍛冶師アリステアとの出会いを経て、神話級素材の打ち直しやスキルの最適化が行われ、剣そのものが究極の神剣へと至る鍛冶・装備進化の醍醐味が味わえます。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 6,
        hook: "【無能錬成師の神兵器ファクトリー】銃火器、パイルドライバー、無人偵察機を全自動錬成！",
        detailedReview: "最弱の「錬成師」だった南雲ハジメ。奈落の底で鉱物鑑定と神話級鉱石の加工技術を極め、電磁加速ライフル、四輪駆動装甲車、巨大潜水艇、軌道衛星レーザーまで自作する超絶錬成クラフト無双です。"
      },
      {
        keyword: "新米錬金術師の店舗経営",
        rank: 7,
        hook: "【素材解体から調合・設備投資】辺境の工房でポーションから魔導具まで手作り経営！",
        detailedReview: "孤児院育ちの少女サラサが、辺境の村で店舗を経営。魔物の素材採取、解体、大釜でのポーション調合、工房設備のアップグレードなど、リアルなものづくりとビジネスの楽しさが詰まった作品です。"
      },
      {
        keyword: "ポーション頼みで生き延びます！",
        rank: 8,
        hook: "【容器と薬剤の完全自由生成】耐熱ガラスから超硬合金容器まで思い通りのマテリアル生成！",
        detailedReview: "カオルが得たポーション生成能力は、薬品だけでなく「どんな形状・材質の容器でも生み出せる」チート仕様。超硬度のガラスや魔法金属のフラスコを作り出し、物理的な防御壁や武器としても活用する痛快劇です。"
      },
      {
        keyword: "マジック・メイカー",
        rank: 9,
        hook: "【魔導具の起源をゼロから創造】魔力を帯電・蓄積する鉱石を発見し世界初の魔導具を開発！",
        detailedReview: "魔法のない世界で魔法を創り出したシオン。魔力を蓄積・放出する特殊鉱石の性質を実験で解明し、魔力を込めて光るランプや着火装置などの生活魔導具を世界で初めて世に生み出していく知的好奇心満載の物語です。"
      },
      {
        keyword: "異世界薬局",
        rank: 10,
        hook: "【ガラス器具と顕微鏡の自作】神術と近代知識で高品質な実験器具と調合設備を製作！",
        detailedReview: "ファルマの物質創造神術。単に薬を作るだけでなく、不純物のない高品質な理化学ガラス器具や顕微鏡レンズを自作し、中世の工房では不可能だった精密な薬品精製プロセスを確立していく本格派です。"
      }
    ]
  }
];

async function enrichPart15() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart15) {
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
  console.log(`\nBatch features part 15 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart15().catch(console.error);
