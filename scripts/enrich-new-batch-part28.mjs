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

const batchPart28 = [
  {
    slug: "isekai-reincarnated-craft-magic-golem-automation-10",
    title: "ゴーレム使役・自動化ファクトリーおすすめ異世界ラノベ10選【魔導オートメーション・機械軍団・生産無双】",
    description: "土や金属から無人のゴーレム軍団を創造し、開拓・採掘・防衛を完全自動化！魔導ファクトリーと自律兵器で世界を変革するおすすめゴーレム使役・自動化異世界ラノベ10選を徹底解説。",
    category: "ゴーレム使役・自動化ファクトリー",
    leadText: "「魔導回路を刻んだゴーレムを量産し、24時間不眠不休で鉱山採掘と都市建設を行わせる」「自律思考する金属ゴーレム軍団で侵略軍を完全迎撃する」——ゴーレム使役・自動化ファンタジーは、テクノロジーと魔法が融合した圧倒的な生産効率と、無機物の軍団を率いるロマンが最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "ゴーレム 異世界 ラノベ おすすめ",
      "自動化 生産チート 小説 なろう",
      "魔導人形 ファクトリー 工場 ファンタジー",
      "ナイト＆マジック 類似作品 ゴーレム無双"
    ],
    items: [
      {
        keyword: "ナイト＆マジック",
        rank: 1,
        hook: "【巨大人型騎操士のオートメーション】魔法演算機と魔導内骨格による自律型重機の開発！",
        detailedReview: "エルネスティが開発するシルエットナイト（巨大人型兵器）。魔導演算回路スクリプトを最適化し、半自動制御システムや多機能魔導アームを搭載。工学的な自動化思想で世界の兵器開発史を数百年進めるロボット工学ファンタジーの頂点です。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 2,
        hook: "【魔導具による生活の自動化】自動給湯、小型魔導コンロ、防水加工で工房の生産性を劇的向上！",
        detailedReview: "ダリヤが創り出す実用魔導具。手作業だった熱湯沸かしや乾燥作業を魔石回路で全自動化。職人たちの労働環境を劇的に改善し、工房全体の生産効率を飛躍的に高めていく心温まるものづくりストーリーです。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 3,
        hook: "【無人偵察機と自律戦闘ゴーレム】遠隔誘導ドローンと自動迎撃兵器で戦場を完全掌握！",
        detailedReview: "南雲ハジメが錬成した十字架型無人偵察ドローン「オルクス」と自動射撃タレット。全自動で敵を追尾・迎撃し、ハジメ自身が手を下すまでもなく敵性部隊を殲滅するハイテクオートメーション無双です。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 4,
        hook: "【スライムによる全自動クリーニング】クリーナースライムたちが24時間稼働する自動洗濯工場！",
        detailedReview: "リョウマが立ち上げた洗濯工房「バンブーフォレスト」。クリーナースライムとスカベンジャースライムの自律的な洗浄・消臭・乾燥ルーティンを構築し、人手をかけずに大量の洗濯物をピカピカに仕上げる画期的な自動化ビジネスです。"
      },
      {
        keyword: "オーバーロード",
        rank: 5,
        hook: "【ナザリックの自動防衛ゴーレム】第十階層を警備する神話級の巨大ゴーレム軍団！",
        detailedReview: "ナザリック地下大墳墓の随所に配備された古代の魔導ゴーレムや自動警備トラップ。一切の疲労や感情を持たず、侵入者を冷徹に排除し続ける絶対防衛システムの完成度が圧倒的です。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 6,
        hook: "【魔導人形ベレッタの自律進化】ラミリスを守護する超硬度魔鋼ゴーレムの覚醒！",
        detailedReview: "リムルが魔鋼と精霊素材で創造し、悪魔を宿らせた魔導人形（オートマタ）ベレッタ。思考と感情を持ち、精霊女王ラミリスの迷宮運営と防衛を補佐する万能のゴーレム従者です。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 7,
        hook: "【水車動力と手押しポンプの導入】水汲み労働を半自動化し村の農業生産力を倍加！",
        detailedReview: "カズラが村に導入した近代機械と動力装置。川の流れを利用した自動揚水水車や手押しポンプを設置し、毎日重労働だった水汲みを自動化して村人たちの生活水準を劇的に向上させます。"
      },
      {
        keyword: "新米錬金術師の店舗経営",
        rank: 8,
        hook: "【工房設備のオートメーション化】魔力撹拌機や温度自動調整釜で高品質ポーションを量産！",
        detailedReview: "サラサが導入する錬金術設備の改良。大釜の火加減調整や素材の均一撹拌を魔導具で自動化し、一人経営の店舗でありながら大量の注文を安定してこなす効率的な工房運営が描かれます。"
      },
      {
        keyword: "魔王になったので、ダンジョン造って人外娘とほのぼのする",
        rank: 9,
        hook: "【自律稼働トラップとガーゴイル哨戒】侵入者を自動検知して撃退する全自動迷宮！",
        detailedReview: "ユキが設計したダンジョンの自動防衛網。魔力感知センサーで連動する毒矢や落石トラップ、空を巡回する自律型ガーゴイルによって、留守中であっても迷宮を安全に維持するスマートな拠点運営です。"
      },
      {
        keyword: "本好きの下剋上",
        rank: 10,
        hook: "【自動化を目指す印刷プレス機の改良】木版から金属活字・大型印刷機への技術革新！",
        detailedReview: "マインがグーテンベルクの仲間たちと進める印刷機械の改良。手作業による写本から、てこの原理を応用した大型プレス印刷機へと発展させ、本の大量生産を可能にする出版革命の歴史的ドラマです。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-craft-magic-beast-furry-ear-10",
    title: "獣人・ケモ耳美少女・亜人共生おすすめ異世界ラノベ10選【猫耳・犬耳・狐耳・差別なき多種族理想郷】",
    description: "猫耳、犬耳、狐耳、兎耳の愛らしい獣人美少女たちと絆を結び、差別のない理想国家を建設！おすすめ獣人・ケモ耳・多種族共生異世界ラノベ10選を徹底紹介。",
    category: "獣人・ケモ耳・多種族共生",
    leadText: "「奴隷として虐げられていた健気な猫耳少女を救い出し、かけがえのない相棒として共に歩む」「人間と獣人、エルフ、ドワーフが笑顔で肩を並べる理想の国を創る」——獣人・ケモ耳共生ファンタジーは、ケモ耳ヒロインたちの一途な可愛らしさと、差別の壁を乗り越えて築き上げる温かな絆が最大の魅力です。至高の10選をお届けします。",
    searchQueries: [
      "獣人 ケモ耳 ラノベ おすすめ",
      "猫耳 狐耳 奴隷解放 異世界 小説 なろう",
      "多種族共生 亜人 建国 スローライフ",
      "盾の勇者 類似作品 獣人ヒロイン"
    ],
    items: [
      {
        keyword: "盾の勇者の成り上がり",
        rank: 1,
        hook: "【ラクーン種ラフタリアとの魂の絆】不信に満ちた盾の勇者を救った、一途で健気な亜人少女！",
        detailedReview: "冤罪で孤立した岩谷尚文が購入したラクーン種の奴隷少女ラフタリア。尚文の優しさに触れて急成長し、彼の「剣」として命がけで戦う最高の相棒に。亜人差別が根強い世界で、亜人の村を再興し共生を目指す感動巨編です。"
      },
      {
        keyword: "転生したら剣でした",
        rank: 2,
        hook: "【黒猫族の少女フランの進化の誓い】虐げられた最弱種族の誇りを取り戻すため世界最強の剣士へ！",
        detailedReview: "奴隷商人に囚われていた黒猫族の少女フランが、意志を持つ知性魔剣（師匠）と出会う。黒猫族が進化できないという呪われた宿命を打破するため、師匠の美味しいご飯と剣技で強敵をなぎ倒していく痛快成長譚です。"
      },
      {
        keyword: "勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う",
        rank: 3,
        hook: "【最強種・猫霊族の奏との出会い】天真爛漫な猫耳美少女と契約し、追放された少年が大覚醒！",
        detailedReview: "無能と追放されたビーストテイマーのレイン。森で行き倒れていた最強種・猫霊族の美少女・奏を助けて契約。素手で岩を砕く圧倒的パワーと、魚やご飯を美味しそうに食べる愛らしさに溢れた王道ファンタジーです。"
      },
      {
        keyword: "異世界のんびり農家",
        rank: 4,
        hook: "【獣人族・狼族・狐耳少女たちの移住】大樹の村で繰り広げられる多種族共存の大宴会！",
        detailedReview: "ヒラクが開拓した大樹の村に次々と移住してくるハウリン村の獣人族の娘たち。農業や警備、酒造りを分担し、インフェルノウルフやハイエルフたちとともに仲良く暮らす極上の多種族ハーレムスローライフです。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 5,
        hook: "【ハイランドオークと異種族の理想郷】ヒューマンに追われた亜人たちを温かく迎え入れる主君！",
        detailedReview: "深澄真が拓いた亜空。金髪ヒューマンに差別され荒野で飢えていたハイランドオークの少女エマやエルダードワーフたちに衣食住と技術を提供し、差別のない平和な理想郷を築き上げる壮大な建国記です。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 6,
        hook: "【ポチ・タマ・リザのケモ耳三人娘】犬耳・猫耳・橙鱗族の奴隷少女たちを温かく育てる旅路！",
        detailedReview: "サトゥーが救出した幼い奴隷三人娘、犬耳のポチ、猫耳のタマ、トカゲ人種のリザ。美味しいご飯やお肉をいっぱい食べさせ、安全に戦闘技術を教え込みながら、世界中を仲良く観光旅行する心温まるファミリードラマです。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 7,
        hook: "【虎獣人クルルとの工房暮らし】森で行き倒れていた獣人少女を助け、工房の温かな家族へ！",
        detailedReview: "森の鍛冶屋エイゾウが助けた虎の獣人少女クルル。工房の力仕事や狩りを手伝いながら、エイゾウの作る美味しい料理に舌鼓を打つ、穏やかで安心感に満ちたケモ耳スローライフです。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 8,
        hook: "【狼人族ロクサーヌの絶対忠誠】圧倒的な索敵能力と家庭的な優しさで主人を支える相棒！",
        detailedReview: "加賀道夫が最初に契約した狼人族の美少女ロクサーヌ。優れた嗅覚と聴覚で迷宮の魔物を察知し、戦闘では俊敏な回避で前衛を務め、家では極上の料理と奉仕で道夫を支える理想的なケモ耳ヒロインです。"
      },
      {
        keyword: "チート薬師のスローライフ",
        rank: 9,
        hook: "【人狼の少女ノエラのおねだり日常】『レイジ、ポーションちょうだい！』と甘える看板娘！",
        detailedReview: "レイジが助けた人狼の少女ノエラ。ドラッグストアの看板娘として店先でお客さんを出迎え、大好きなポーションをおねだりしては尻尾を振って喜ぶ、最高に愛らしくて癒やされるケモ耳日常コメディです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 10,
        hook: "【エルフの精鋭と獣人里の解放】拉致された亜人や獣人の子供たちを救出する世直し行脚！",
        detailedReview: "アークが旅先で出会うエルフ戦士アリアンや獣人の忍びチヨメ。悪徳貴族の人身売買ネットワークを叩き潰し、捕らわれていたケモ耳の子供たちを故郷の里へ送り届ける痛快な解放劇です。"
      }
    ]
  }
];

async function enrichPart28() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart28) {
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
  console.log(`\nBatch features part 28 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart28().catch(console.error);
