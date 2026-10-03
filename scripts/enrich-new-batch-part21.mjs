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

const batchPart21 = [
  {
    slug: "isekai-reincarnated-curse-mastermind-evil-god-10",
    title: "黒幕・邪神転生・世界の支配者おすすめ異世界ラノベ10選【神話級の威厳・人類の畏怖・世界改変】",
    description: "勇者でも魔王でもなく、世界の理を司る『邪神』や『絶対の黒幕』として君臨！神話級の力と圧倒的スケールで世界を意のままに導くおすすめ邪神・黒幕異世界ラノベ10選を徹底解説。",
    category: "邪神・黒幕・世界の支配者",
    leadText: "「目が覚めたら人類を滅ぼす神話の邪神そのものになっていた」「一挙手一投足が世界の歴史と宗教を塗り替えていく」——邪神・黒幕系ファンタジーは、人智を超越した絶対的な権能と、主人公を畏怖・崇拝する人類たちのリアクションが最大の魅力です。圧倒的スケールの傑作10選をお届けします。",
    searchQueries: [
      "邪神 転生 ラノベ おすすめ",
      "黒幕 主人公 異世界 小説 なろう",
      "神 主人公 畏怖 崇拝 ファンタジー",
      "オーバーロード 類似作品 邪神無双"
    ],
    items: [
      {
        keyword: "オーバーロード",
        rank: 1,
        hook: "【絶対の死の支配者】神話級のアンデッド王が放つ畏怖と、世界を掌握する冷徹な覇道！",
        detailedReview: "ナザリック地下大墳墓の主アインズ・ウール・ゴウン。人間にとっては触れることすら許されない絶対の死神であり、超位階魔法『黒き豊穣への貢（イア・シュブニグラス）』で一瞬にして数十万の軍勢を死霊の贄とする、邪神・黒幕系ノベルの頂点です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 2,
        hook: "【世界の裏を操る究極の黒幕】適当な妄想が世界の真実とリンクし、陰から歴史を支配！",
        detailedReview: "シド・カゲノーが演じるシャドウ。表向きは目立たないモブ学生として生活しながら、夜は世界中に張り巡らされた巨大組織シャドウガーデンの絶対指導者として君臨。敵対する闇の教団を容赦なく消滅させていくスタイリッシュ黒幕劇です。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 3,
        hook: "【最弱蜘蛛から神の領域『白』へ】世界のシステムを崩壊から救うため、神として暗躍！",
        detailedReview: "迷宮の小蜘蛛として生まれた主人公が、存在進化の果てに神化を遂げて神『白（シロ）』へ。魔王アリエルとともに世界の崩壊を防ぐため、人類の半分を犠牲にする覚悟で神話級の戦争を仕掛けていく、まさに神の視点の壮大すぎるドラマです。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 4,
        hook: "【理不尽な神々を滅殺する始祖】世界の秩序を司る神すら従わせる絶対の魔王！",
        detailedReview: "暴虐の魔王アノス。世界の秩序を盾に理不尽な運命を押し付ける神々に対し、「神を殺せば世界が滅ぶ？ ならば神の理ごと作り直すまでだ」と神々を服従・滅殺していく、全知全能の概念すら超越した圧倒的覇者です。"
      },
      {
        keyword: "即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。",
        rank: 5,
        hook: "【全次元の終焉を司る怪異】『死』という現象そのものの化身が異世界を歩む！",
        detailedReview: "高遠夜霧の正体は、あらゆる宇宙や高次元の神々すら観測した瞬間に消滅する根源的な終末の怪異。殺意を向けた神や魔神が思考する間もなく消滅していく、人智を完全に超越した絶対の理不尽を描いた傑作です。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 6,
        hook: "【女神に恐れられる荒野の覇王】世界を覆い尽くす莫大な魔力で神の理を揺るがす！",
        detailedReview: "深澄真の魔力総量は、世界を創造した女神すら恐れ慄くレベル。彼が本気で魔力を解放した瞬間、天変地異が起き神々が平伏する。異世界に独自の文明と自治領を打ち立てていく超スケールの覇道ファンタジーです。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 7,
        hook: "【目に見えぬ呪詛で運命を操る黒幕】表では無害な少年、裏では邪神級の式神を使役！",
        detailedReview: "前世で権力争いに敗れた反省から、二度目の生では「目立たず陰で全てを操る黒幕」として立ち回るセイカ。異世界の勇者や皇族たちを陰から都合よく誘導し、敵対者を音もなく呪殺していく冷徹な知略劇です。"
      },
      {
        keyword: "嘆きの亡霊は引退したい",
        rank: 8,
        hook: "【世界中から神算鬼謀の黒幕と誤認】適当に買った宝具が邪神の復活を未然に完全粉砕！",
        detailedReview: "クライ・アンドリヒの無自覚な黒幕ぶり。本人はただコレクションしたいだけなのに、選んだアイテムや配置した仲間が奇跡的に邪神教団の陰謀を先回りして壊滅させ、敵からも味方からも「全てを支配する黒幕」と恐れられます。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 9,
        hook: "【八星魔王（オクタグラム）の一角】神話級の竜や悪魔を従え世界情勢を裏から動かす盟主！",
        detailedReview: "覚醒魔王となったリムル＝テンペスト。配下に原初の悪魔や聖魔十二守護王を従え、西方聖教会や東の帝国との戦争を圧倒的な情報力と武力で制圧。世界会議の場で世界のルールを再定義する絶対の盟主へと登りつめます。"
      },
      {
        keyword: "幼女戦記",
        rank: 10,
        hook: "【神（存在X）に仇なす不屈の悪魔】ラインの悪魔として敵国から最も恐れられる指揮官！",
        detailedReview: "自らを異世界へ放逐した理不尽な神「存在X」への反逆を誓うターニャ。神を信じず徹底的な合理主義と近代軍事力で敵国を粉砕し、「ラインの悪魔」として世界中から恐怖と畏怖の対象となる重厚な戦記です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-curse-craft-merchant-guild-10",
    title: "商会設立・商業ギルド・経済支配おすすめ異世界ラノベ10選【特産品開発・流通革命・マネー無双】",
    description: "現代のマーケティング、複式簿記、物流革命、独占特許で異世界の経済を完全支配！貧乏領地や零細商会を世界的コングロマリットへ育てるおすすめ商会経営・経済ファンタジーラノベ10選を徹底紹介。",
    category: "商会設立・経済支配・商業ギルド",
    leadText: "「中世の閉鎖的な商業ギルドの利権を、近代的な株式会社と流通網で打破する」「新商品の独占販売とブランディングで王侯貴族の資産を根こそぎ吸い上げる」——商会設立・経済ファンタジーは、金と知恵が世界を動かしていくダイナミックなサクセスストーリーが最大の魅力です。ビジネスの醍醐味が詰まった傑作10選を厳選しました。",
    searchQueries: [
      "商会 異世界 ラノベ おすすめ",
      "商業ギルド 経済 経営 小説 なろう",
      "特産品開発 貿易 スローライフ ファンタジー",
      "本好きの下剋上 類似作品 商業サクセス"
    ],
    items: [
      {
        keyword: "本好きの下剋上",
        rank: 1,
        hook: "【プランタン商会の設立と出版革命】紙の製造特許から印刷・出版流通の大市場を創出！",
        detailedReview: "マインとベンノが立ち上げた「プランタン商会」。植物紙の製法特許、リンシャ（髪用油）、髪飾りの独占販売権を確立し、商業ギルドや領主を巻き込んで一大出版産業をゼロから築き上げていく、経済・商業小説の最高峰です。"
      },
      {
        keyword: "狼と香辛料",
        rank: 2,
        hook: "【行商人の知恵と中世市場経済】為替手形、信用取引、関税同盟の隙間を突く駆け引き！",
        detailedReview: "行商人ロレンスと賢狼ホロの旅路。都市ごとの市場相場のズレを利用したアービトラージ（裁定取引）や、大商会の乗っ取り工作、銀貨改鋳の裏をかく先物取引など、中世ヨーロッパのリアルな経済構造を緻密に描いた伝説的名作です。"
      },
      {
        keyword: "公爵令嬢の嗜み",
        rank: 3,
        hook: "【アズカルタ商会と銀行制度の導入】特産チョコレートと税制改革で領地経済を劇的再生！",
        detailedReview: "アイリスが立ち上げたアズカルタ商会。特産品チョコレートや美容品の販売で貴族から莫大な利益を得つつ、領民向けの銀行制度や低利融資、初等教育を整備して領地全体の経済基盤を近代化していく本格派内政商業劇です。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 4,
        hook: "【ロセッティ商会の設立と特許戦略】革新的な生活魔導具の商標登録と職人ギルド連携！",
        detailedReview: "自立した女性職人ダリヤが設立した「ロセッティ商会」。ドライヤーや防水布などの特許を商業ギルドに登録し、スカルファロット家をはじめとする貴族や腕利き職人たちと対等なパートナーシップを結んで事業を拡大していきます。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 5,
        hook: "【商人ギルドとの独占卸売契約】異世界の商人が泣いて喜ぶ現代商品の圧倒的商品力！",
        detailedReview: "ムコーダが持ち込む現代の石鹸、シャンプー、香辛料。商人ギルドの重鎮ランベルト商会と提携し、貴族向け最高級ブランドとして高額販売。手に入れた莫大な資金で悠々自適の放浪グルメ旅を続ける爽快ビジネスです。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 6,
        hook: "【巨大コングロマリット・ミツゴシ商会】現代のデパート、銀行、チョコレートを完全再現！",
        detailedReview: "シドが前世の知識（知恵の実）を適当に語った結果、アルファたちが設立した「ミツゴシ商会」。百貨店ビジネス、流通革命、信用紙幣の発行、フランチャイズ展開を瞬く間に実現し、世界の経済覇権を握る爆笑かつ圧巻のサクセスです。"
      },
      {
        keyword: "新米錬金術師の店舗経営",
        rank: 7,
        hook: "【辺境店舗の仕入れと価格戦略】素材の仕入れルート開拓とポーションの適正価格販売！",
        detailedReview: "サラサが営む辺境の錬金術店。採算の取れない高額卸売を排し、自ら素材採取して原価を抑え、村の経済力に合わせたポーション販売と特産品開発で持続可能な店舗経営を確立していくリアルなビジネスストーリーです。"
      },
      {
        keyword: "宝くじで40億当たったんだけど異世界に移住する",
        rank: 8,
        hook: "【異世界と現代日本の価格差トレード】現代の農業機具を持ち込み、領地の作物を日本で販売！",
        detailedReview: "カズラによる異世界と現代日本の貿易。現代の肥料や工具を異世界に安価で供給して農業生産力を爆発的に向上させ、異世界の希少な木材や特産品を日本へ持ち帰ることで双方の世界で莫大な富を築くハイブリッド経済譚です。"
      },
      {
        keyword: "ポーション頼みで生き延びます！",
        rank: 9,
        hook: "【カオル商会の立ち上げと利権防衛】万能ポーションの希少価値をコントロールし利権を死守！",
        detailedReview: "カオルの商魂たくましいビジネス手腕。ポーションを安売りして価値を落とさず、高慢な貴族や商人たちから巨額の対価を巻き上げ、貧民には慈善事業として施すなど、巧みな価格差別と交渉術で権力者を翻弄します。"
      },
      {
        keyword: "現実主義勇者の王国再建記",
        rank: 10,
        hook: "【王国の物流網再編と関税同盟】街道整備・港湾開発・特産品博覧会で国家財政を再建！",
        detailedReview: "ソーマが断行した国家規模の経済改革。滞っていた国内物流を改善するために街道を舗装し、港湾都市を新設。特産品を集めた料理番組・博覧会を開催して国内消費を刺激し、破綻寸前の国家財政を黒字化させる圧巻の内政です。"
      }
    ]
  }
];

async function enrichPart21() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart21) {
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
  console.log(`\nBatch features part 21 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart21().catch(console.error);
