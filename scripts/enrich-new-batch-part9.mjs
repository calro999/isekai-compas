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

const batchPart9 = [
  {
    slug: "isekai-misunderstood-overestimated-protagonist-10",
    title: "勘違い・過大評価主人公おすすめ異世界ラノベ10選【本人は無自覚・周囲が勝手に崇拝・神算鬼謀】",
    description: "本人は普通にしているつもりなのに、周囲が勝手に『神の知恵』『世界の覇者』と深読みして崇め奉る！爆笑必至の勘違い・過大評価おすすめ異世界ラノベ10選を徹底解説。圧倒的なコメディとカタルシス。",
    category: "勘違い・コメディ",
    leadText: "「適当に言った嘘がなぜか全部真実になっていた」「ビビって逃げ回っていただけなのに神がかった知略として絶賛される」——勘違い・過大評価系ラノベは、主人公の思惑と周囲のリアクションの壮大なズレが最高に面白い人気ジャンルです。読めば絶対に笑えて痛快な傑作10選をお届けします。",
    searchQueries: [
      "勘違い系 ラノベ おすすめ",
      "過大評価 主人公 異世界 小説",
      "無自覚 神算鬼謀 崇拝 なろう",
      "勘違いコメディ 異世界転生"
    ],
    items: [
      {
        keyword: "陰の実力者になりたくて！",
        rank: 1,
        hook: "【適当な中二病設定が完全的中】適当についた嘘の教団が実在し、世界の裏を牛耳る覇者に！",
        detailedReview: "主人公シド・カゲノーは「陰の実力者」の設定を楽しむため、助けた少女たちに適当な『闇の教団を倒す組織・シャドウガーデン』という中二病設定を語り聞かせる。しかしその設定は全て異世界の真実であり、配下の美少女たちは彼を『全てを見通す絶対神』と崇拝。本人は壮大なごっこ遊びのつもりで無自覚に世界を救っていく究極の勘違いコメディです。"
      },
      {
        keyword: "オーバーロード",
        rank: 2,
        hook: "【最高支配者への絶対忠誠】部下たちの深読みが暴走し、世界征服のシナリオが自動で完成！",
        detailedReview: "中身は平凡なサラリーマンのモモンガ（アインズ）。配下のデミウルゴスやアルベドら天才軍師NPCたちが、アインズの何気ない一言を「数千年先まで見据えた神の一手」と深読み。アインズは必死に威厳を保ちながら「うむ、その通りだ」と話を合わせるうちに、あれよあれよと世界征服が進んでいく知略と勘違いの金字塔です。"
      },
      {
        keyword: "嘆きの亡霊は引退したい",
        rank: 3,
        hook: "【最弱マスターの神算鬼謀】引退したいだけなのに、周囲の全幅の信頼で難事件を即時解決！",
        detailedReview: "才能皆無の凡人クライ・アンドリヒ。帝都最強クランのリーダーとして祭り上げられ、死にたくない一心で逃げたり適当に買い集めた宝具を押し付けたりするが、それが奇跡的な連鎖を生み「全てクライの計算通り」と周囲が熱狂。本人の胃痛と周囲の過大評価のコントラストが最高に笑える大傑作です。"
      },
      {
        keyword: "ティアムーン帝国物語",
        rank: 4,
        hook: "【保身の行動が帝国の英知に】ギロチンを恐れて甘いお菓子と安全を求めたら名君の鑑へ！",
        detailedReview: "処刑されたミーア皇女が過去へやり直しのリープ。自分の命と贅沢な暮らしを守るために取った保身行動が、側近ルードヴィッヒや民衆によって「貧民街を救い、飢饉を未然に防ぐ大英断」と超絶ポジティブに解釈され、『帝国の叡智』として世界中から崇敬を集める歴史改変勘違いコメディです。"
      },
      {
        keyword: "天才王子の赤字国家再生術",
        rank: 5,
        hook: "【早く国を売りたいのに大勝利】弱小国家を売り払うつもりが、奇策がハマり隣国を併合！",
        detailedReview: "若き王子ウェインは「国を売って悠々自適の隠居生活」を目指し、わざと負けそうな無茶な外交や奇襲を仕掛けるが、天才的な戦術眼が災いして連戦連勝。領土は広がり、名声は大陸中に轟き、ますます激務に追われるハメになる痛快政略劇です。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 6,
        hook: "【ご飯を作っているだけなのに】伝説の神獣たちを手懐け、神々すら手玉に取る大魔導士扱い！",
        detailedReview: "サラリーマンのムコーダは、美味しいご飯を食べて旅をしたいだけなのに、その料理に釣られてフェンリルやドラちゃん、ベヒーモスが従魔に。周囲の冒険者ギルドや国家からは「古代の神獣たちを従える規格外の特級冒険者」として恐れ敬われ、本人の庶民感覚とのギャップが癒やしを生み出します。"
      },
      {
        keyword: "私、能力は平均値でって言ったよね！",
        rank: 7,
        hook: "【目立ちたくないのに超絶神童】モブとして生きるはずが、古竜を一撃粉砕して伝説に！",
        detailedReview: "普通の平穏な学園生活を望むマイル。実力を隠そうと手加減するものの、そもそもの基準値が「世界の全生物の平均（人間の数千倍）」であるため、何をしても常識破壊の超絶魔導を発揮。仲間たちから呆れられつつも頼りにされるドタバタ冒険劇です。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 8,
        hook: "【不適合者と判定された始祖】魔王の力を理解できない測定器によって落ちこぼれ扱い！",
        detailedReview: "二千年前に世界を救った暴食の魔王アノス。転生して魔王学院へ入学するが、彼の底知れない魔力は学院の魔力測定器の測定上限を遥かに超えていたため「不適合者」の烙印を押される。本物の魔王による圧倒的無双と、子孫たちの勘違いを正していく圧倒的カタルシスが魅力です。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 9,
        hook: "【観光したいだけの大賢者】名声を避けてモブ商人を装うが、裏の顔クロが世界を救済！",
        detailedReview: "レベル310の神級チートスペックを持つサトゥー。普段は温厚な行商人として旅情グルメを楽しんでいるが、仲間や街に危機が迫ると仮面の勇者「クロ」として一瞬で魔王や邪神を殲滅。周囲からは「伝説の救世主」として崇拝される二重生活の面白さが光ります。"
      },
      {
        keyword: "賢者の孫",
        rank: 10,
        hook: "【常識を知らない規格外】『えっ、これくらい誰でもできるでしょ？』と本気で驚く少年！",
        detailedReview: "大賢者に育てられ、前世の物理知識と魔力を融合させて天変地異級の魔法を連発するシン。しかし常識を教わっていなかったため、自分が作った国宝級アイテムや無詠唱魔法を「普通」だと思い込み、王立魔法学院の教師や貴族たちを卒倒させ続ける痛快コメディです。"
      }
    ]
  },
  {
    slug: "isekai-summoned-kitchen-food-cooking-10",
    title: "異世界料理・グルメ無双おすすめラノベ10選【現代の美味で胃袋掌握・居酒屋・屋台・神獣懐柔】",
    description: "マヨネーズ、醤油、ラーメン、揚げたて唐揚げで異世界人の胃袋を完全掌握！伝説の神獣から国王・貴族まで料理の美味さで虜にするおすすめ異世界料理・グルメファンタジーラノベ10選を徹底紹介。",
    category: "料理・グルメファンタジー",
    leadText: "「出汁の旨味やスパイスの刺激を知らない異世界人に現代料理を振る舞う」「魔物の肉を絶品ステーキに調理して伝説の魔獣を胃袋で従える」——料理・グルメファンタジーは、読んでいるだけでお腹が空いてくる圧倒的なシズル感と、食を通じた温かな人間関係が最大の魅力です。至福のグルメ作品10選を厳選しました。",
    searchQueries: [
      "異世界 料理 ラノベ おすすめ",
      "グルメファンタジー 小説 なろう",
      "居酒屋 カフェ 異世界 現代料理",
      "飯テロ ラノベ スローライフ"
    ],
    items: [
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 1,
        hook: "【ネットスーパー×男飯の極致】ショウガ焼き・唐揚げ・ステーキで伝説の神獣を胃袋調教！",
        detailedReview: "巻き込まれ召喚されたサラリーマン・ムコーダの「ネットスーパー」スキル。日本の調味料や食材、そして魔物の高級肉を使った料理が、伝説の魔獣フェンリルや暴食竜ドラちゃんを完全ノックアウト。従魔契約を結び、毎食の絶品飯テロを繰り広げながら旅をする、異世界グルメ小説の金字塔です。"
      },
      {
        keyword: "異世界居酒屋「のぶ」",
        rank: 2,
        hook: "【古都と繋がる大衆居酒屋】トリアエズナマとおでん、枝豆が異世界の市民と貴族を魅了！",
        detailedReview: "京都の居酒屋「のぶ」の扉が、中世風の異世界・古都アイテーリアに通じる。冷えた生ビール「トリアエズナマ」、揚げたての鶏唐揚げ、出汁の染みたおでんなど、日本の居酒屋文化が異世界の衛兵、徴税請負人、貴族たちの心を温かく解きほぐしていく珠玉の人情グルメドラマです。"
      },
      {
        keyword: "異世界食堂",
        rank: 3,
        hook: "【土曜日だけの魔法の扉】洋食屋「ねこや」のメンチカツ・エビフライに集う異世界住人たち！",
        detailedReview: "商店街の一角にある洋食屋「ねこや」。創業70年の老舗だが、土曜日だけ異世界のあらゆる場所と扉が繋がる。ドラゴン、エルフ、魔導士、騎士たちが、カツ丼、オムライス、パフェなどの絶品洋食に舌鼓を打ち、料理ごとのエピソードがオムニバス形式で美しく紡がれる極上の癒やし作品です。"
      },
      {
        keyword: "異世界のんびり農家",
        rank: 4,
        hook: "【採れたて新鮮野菜と手作り調味料】万能農具で育てた極上野菜と味噌・醤油・ワイン造り！",
        detailedReview: "死の森を開拓したヒラクが、万能農具で育てた安心・安全で超絶美味な野菜や果物。大豆から味噌や醤油を醸造し、ブドウから極上のワインを仕込み、村に集まったエルフや鬼人族、吸血鬼たちと大宴会を開く。生産から調理、食卓の笑顔までが揃った至高の農園グルメです。"
      },
      {
        keyword: "ダンジョン飯",
        rank: 5,
        hook: "【魔物食のバイブル】大サソリと歩き茸の水炊き！迷宮生態系を味わい尽くす本格冒険飯！",
        detailedReview: "妹を救うため資金難で迷宮深層へ挑むライオス一行。食糧難を乗り切るため、倒したスライム、マンドレイク、大サソリ、動く鎧などの魔物を調理して自給自足の旅に出る。緻密に構築されたモンスターの生態系と調理理論が融合した、魔物食ファンタジーの絶対的最高峰です。"
      },
      {
        keyword: "異世界料理道",
        rank: 6,
        hook: "【大衆料理人の意地と技術】森の狩人「森辺の民」にジビエ肉と下処理技術で本物の美味を届ける！",
        detailedReview: "見習い料理人・津留見明日太が、森の狩猟民族「森辺の民」の世界へ転移。獣臭くて固いと嫌われていたギバ肉を、丁寧な血抜き、筋切り、燻製、独自のタレで絶品料理へと昇華。異文化の民と食を通じて心を通わせていく、極めて丁寧で重厚な本格料理ファンタジーです。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 7,
        hook: "【大陸全土の郷土料理と屋台巡り】チート魔導士が各地の珍味・屋台飯・宮廷料理を再現！",
        detailedReview: "カンスト魔導士サトゥーの旅の真の目的は、各地の名物グルメの堪能と再現。屋台の串焼きから王宮のフルコースまで、手に入れた素材と調味料で絶品料理を自作し、仲間の獣娘たち（ポチ・タマ・リザ）に振る舞う幸せな食卓描写が読者の食欲を刺激します。"
      },
      {
        keyword: "チート薬師のスローライフ",
        rank: 8,
        hook: "【調合スキルで生み出す嗜好品】エナジードリンクから紅茶・スイーツまで街を癒やす！",
        detailedReview: "創薬スキルを持つレイジが、薬だけでなく美味しくて元気が出るポーションやハーブティー、スイーツを開発。狼少女ノエラや幽霊ミナとともに、美味しいおやつとドリンクで街の人々の疲れを癒やしていくほのぼの日常グルメスローライフです。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 9,
        hook: "【男のこだわりキャンプ飯】鍛冶仕事の合間に作る燻製肉と特製包丁の極上ステーキ！",
        detailedReview: "自作の切れ味鋭い包丁と調理器具を使い、森で採れた新鮮なジビエ肉や野菜を豪快に調理。作業終わりの冷えたエールと香ばしい燻製料理の組み合わせがたまらない、大人のためのアウトドア系グルメ＆クラフト小説です。"
      },
      {
        keyword: "おっさん冒険者ケインの善行",
        rank: 10,
        hook: "【家庭的な大衆料理の温もり】孤児院の子供たちや仲間へ振る舞う愛情たっぷり温かご飯！",
        detailedReview: "お人好しな元社畜冒険者ケインが、困っている仲間や孤児院の子供たちのために作るカレーや肉じゃがなどの温かな家庭料理。美味しい食事を通じて絆が深まり、周囲に笑顔が広がっていくハートフルな名作です。"
      }
    ]
  }
];

async function enrichPart9() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart9) {
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
  console.log(`\nBatch features part 9 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart9().catch(console.error);
