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

const batchPart22 = [
  {
    slug: "isekai-reincarnated-curse-labyrinth-creation-builder-10",
    title: "迷宮創造・ダンジョン建築・トラップ設計おすすめ異世界ラノベ10選【DP経営・迷宮マスター・箱庭クラフト】",
    description: "何もない洞窟から超巨大な難攻不落迷宮をクリエイト！ダンジョンポイント（DP）での罠設置、モンスター配置、冒険者誘導、居住空間づくりを描くおすすめダンジョン建築・迷宮マスターラノベ10選を徹底解説。",
    category: "迷宮創造・ダンジョン建築",
    leadText: "「ダンジョンポイントを駆使して最凶のトラップ迷宮をゼロから設計する」「侵入者を撃退しながら、内部に温泉街や超豪華な居住区を建築する」——迷宮創造・ダンジョンマスター系ファンタジーは、箱庭づくりの楽しさと、侵入者を罠と戦術で翻弄するタワーディフェンスの快感が魅力です。必読の傑作10選をお届けします。",
    searchQueries: [
      "ダンジョンマスター ラノベ おすすめ",
      "迷宮創造 DP 建築 小説 なろう",
      "ダンジョン運営 スローライフ ファンタジー",
      "魔王になったので ダンジョン造って 類似作品"
    ],
    items: [
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 1,
        hook: "【迷宮創造×まったりホームライフ】DPで最凶トラップと豪華温泉街を創り出す領主生活！",
        detailedReview: "魔王となったユキが手に入れた迷宮創造能力。侵入者を迎え撃つ即死トラップや落とし穴を巧妙に配置しつつ、ダンジョン深層には露天風呂、豪華な寝室、畑を整備。最強竜レフィたちと美味しいご飯を食べながら、防衛と建築を両立させる傑作です。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 2,
        hook: "【テンペスト地下迷宮100階層の建設】ラミリスと創り上げた前代未聞の巨大エンタメ迷宮！",
        detailedReview: "リムルと迷宮妖精ラミリスが開発した地下迷宮100階層。冒険者たちに安全な攻略アトラクションを提供して入場料と宝箱で莫大な利益を上げつつ、国家有事には帝国軍大軍勢を各個撃破する絶対防衛要塞として機能させる圧巻の建築構想です。"
      },
      {
        keyword: "オーバーロード",
        rank: 3,
        hook: "【ナザリック地下大墳墓の全十階層】至高の四十一人によって創られた芸術的かつ凶悪な迷宮！",
        detailedReview: "沼地、溶岩地帯、氷結牢獄、神殿など各階層ごとに全く異なる生態系と神話級ギミックを備えたナザリック。プレイヤーたちの叡智と悪意が結晶化したトラップ網と守護者たちが、異世界の侵入者を容赦なく迎撃する要塞建築の金字塔です。"
      },
      {
        keyword: "異世界のんびり農家",
        rank: 4,
        hook: "【大樹の村の巨大自治区づくり】掘削と木工で拡張される多種族共存の理想郷！",
        detailedReview: "万能農具で森を切り拓くヒラク。頑丈な住宅街、酒蔵、温水プール、格闘技場、巨大果樹園を次々と建築。森最強の魔物たちと共存しながら、防衛堀と見張り塔を備えた難攻不落の村をゼロから築き上げる至高の箱庭建築譚です。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 5,
        hook: "【森の工房兼ログハウス建築】チート生産スキルで快適な自作の作業場を拡張！",
        detailedReview: "森の中に自分だけの鍛冶工房を構えたエイゾウ。頑丈な炉の築造、水車を利用した自動送風装置、仲間たちのための快適な個室やウッドデッキを自作し、落ち着いた大人のものづくり生活を満喫するクラフトストーリーです。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 6,
        hook: "【現代土木技術による村の要塞化】セメント・パイプ・発電機で中世の寒村を近代都市へ！",
        detailedReview: "日本から大量の建材と工具を持ち込むカズラ。用水路のコンクリート補強、手押しポンプの設置、ソーラー街灯の敷設など、中世の村をわずか数ヶ月で衛生・防衛・生産性に優れた近代拠点へ生まれ変わらせる土木無双です。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 7,
        hook: "【拠点用一軒家のリノベーション】迷宮探索の疲れを癒やす快適なマイホーム設計！",
        detailedReview: "迷宮都市で手に入れた一軒家をリフォームする加賀道夫。防犯対策、浴室の整備、快適な家具の買い出し、奴隷たちとのプライベート空間の確保など、探索の拠点となる住居づくりを緻密に描写するリアリズムが光ります。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 8,
        hook: "【スライム建材による店舗・住宅建築】硬化スライム液で頑丈かつ耐火性の高い石造り工房！",
        detailedReview: "リョウマが開発したスライム建築術。スティッキースライムの粘着液と硬化スライムの特性を組み合わせ、セメント不要で地震や火災に強い石造り店舗や住宅を短期間で建設していく画期的なスローライフです。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 9,
        hook: "【土魔法による山脈開削と新都市建設】巨大山脈をトンネルで貫き広大な領都を一瞬で造成！",
        detailedReview: "ヴェンデリンの規格外の土属性魔法。山を削って幹線道路を通し、未開拓の森を一瞬で整地して新領都の基盤を完成させる。重機数千台分に匹敵する超絶土木チートによる壮大な都市建設が描かれます。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 10,
        hook: "【森の秘密基地とからくりトラップ】木の枝とツタで作る侵入者絶対迎撃の要塞ハウス！",
        detailedReview: "森で孤立する遥が創り上げた多重セキュリティ付きツリーハウス。滑る床、落石、自動発射ボウガンなどのからくりトラップを張り巡らせ、夜行性モンスターを寄せ付けずに快適に過ごす知恵と工夫のサバイバル建築です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-gaming-skills-mmo-status-10",
    title: "ゲーマー転生・ゲームシステム操作おすすめ異世界ラノベ10選【スキルツリー・レベル上限突破・隠しコマンド】",
    description: "異世界なのにUIが見える！スキルツリーの最適化、バグ技・裏技の活用、ステータス画面操作で世界の理をハックするおすすめゲーマー・MMOシステム転生ラノベ10選を徹底紹介。",
    category: "ゲーマー転生・ゲームシステム操作",
    leadText: "「ステータス画面とスキルツリーを駆使して、誰も気づかない最強のシナジービルドを完成させる」「クソゲーで培ったバグ利用や隠しコマンドで世界の制約を突破する」——ゲームシステム転生ファンタジーは、ゲーム脳ならではの効率化とルール破りの快感が最大の魅力です。ゲーマー必読の至高の10選を厳選しました。",
    searchQueries: [
      "ゲーマー 異世界転生 ラノベ おすすめ",
      "スキルツリー ステータス 小説 なろう",
      "裏技 バグ技 チート ファンタジー 名作",
      "シャングリラ・フロンティア 類似作品 MMO"
    ],
    items: [
      {
        keyword: "シャングリラ・フロンティア",
        rank: 1,
        hook: "【クソゲーハンターの極限プレイヤースキル】ステータス差をジャストパリィと知識で粉砕！",
        detailedReview: "数々の理不尽クソゲーをクリアしてきたサンラク。神ゲー『シャンフロ』において、防具なしの鳥頭スタイルで挑み、ボスの攻撃判定のミリ単位の隙やフレームを見極めてカウンターを叩き込む、ゲーマーの頂点に立つ熱血アクションです。"
      },
      {
        keyword: "痛いのは嫌なので防御力に極振りしたいと思います。",
        rank: 2,
        hook: "【VIT極振りのシステム破壊ビルド】運営の想定を遥かに超えるスキルシナジーで暴走！",
        detailedReview: "痛いのが嫌で防御力に全ステータスを振った初心者メイプル。ダメージゼロによる隠しスキル獲得、毒竜悪食、巨大要塞化など、運営の想定をことごとく粉砕して『歩くラスボス』へと進化していく痛快ゲームコメディです。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 3,
        hook: "【プログラマーのUI操作と全知マップ】マップ全域索敵とスキルポイント即時全振り！",
        detailedReview: "元プログラマーのサトゥー。視界に広がる超高性能UIマップ、全自動スキル獲得、天文学的なスキルポイントを活用し、状況に応じて一瞬で最適なスキルを最大レベルまで引き上げて完全攻略するスマート無双です。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 4,
        hook: "【キャラメイク時のボーナスポイント配分】スキルリセットと職業変更で最適解を追求！",
        detailedReview: "転移時のキャラメイクで手に入れた大量のボーナスポイント。経験値倍加、ジョブチェンジ、スキル割り振りを徹底的に検証し、迷宮の効率的周回と生活水準の向上を論理的に突き詰めるシステム構築の傑作です。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 5,
        hook: "【バッドスキル同士の隠しシナジー】余り物ゴミスキルを組み合わせてチート神へ昇華！",
        detailedReview: "残飯処理のように押し付けられた大量のマイナス効果スキル。しかしそれらを同時に発動させることで相互のデメリットを打ち消し合い、未知の絶対領域スキルへと変貌させるゲーマー特有のビルド構築が光ります。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 6,
        hook: "【ステータスプレートの限界突破】神代魔法のスキルツリー解放で世界をハック！",
        detailedReview: "ステータスプレートに表示される数値を超越した南雲ハジメ。錬成、重力、空間、再生などの神代魔法を解放し、自身の身体能力と兵器スペックを掛け合わせて神の定めた世界のシステムそのものを破壊します。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 7,
        hook: "【スキルポイントの綿密な配分と進化ツリー】鑑定スキルを育てて世界の裏システムを解読！",
        detailedReview: "小蜘蛛として生まれた主人公が、死に物狂いで貯めたスキルポイント。鑑定を最優先でカンストさせ、叡智スキルを獲得して世界の管理者やシステムログの真実に迫っていく、圧巻のゲーマー的頭脳サバイバルです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 8,
        hook: "【MMOアバターの完全引き継ぎ】最高レベル聖騎士のスキルとインベントリで無双！",
        detailedReview: "MMORPGのカンストキャラの姿で転移したアーク。ゲーム内で習得した天変地異級の武技、瞬間移動魔法、無制限インベントリをそのまま行使し、困っている人々を爽快に助けていく王道冒険譚です。"
      },
      {
        keyword: "オーバーロード",
        rank: 9,
        hook: "【DMMO-RPGの膨大なデータ熟知】全718種の魔法と数千のアイテム効果を完全把握！",
        detailedReview: "ユグドラシルの熟練プレイヤーだったモモンガ。相手の装備や魔力からクラス構成を瞬時に見抜き、バフ・デバフの秒数管理やフェイク魔法で相手の耐性を剥がしていく、プロゲーマーならではの究極のPK戦術が炸裂します。"
      },
      {
        keyword: "悪役令嬢レベル99 〜私は裏ボスですが魔王ではありません〜",
        rank: 10,
        hook: "【裏ボスのカンスト育成ルーティン】闇属性ダンジョンに籠もって15歳でレベル99達成！",
        detailedReview: "元ゲーマーの女子大生が転生した裏ボス令嬢ユミエラ。平穏に生きるための保険として幼少期からダンジョンに籠もり、効率的な範囲魔法でレベルカンスト（99）を達成。周囲の常識を置き去りにするゲーマー無双です。"
      }
    ]
  }
];

async function enrichPart22() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart22) {
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
  console.log(`\nBatch features part 22 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart22().catch(console.error);
