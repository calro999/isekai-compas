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

const batchPart10 = [
  {
    slug: "isekai-reincarnated-into-otome-game-villainess-10",
    title: "悪役令嬢・乙女ゲーム転生おすすめラノベ10選【破滅フラグ回避・断罪逆転・溺愛ざまぁ】",
    description: "処刑・国外追放のバッドエンドをへし折る！乙女ゲームの悪役令嬢に転生した主人公が、知恵と愛嬌と内政手腕で断罪を回避し、周囲から溺愛されて大逆転するおすすめ悪役令嬢ラノベ10選を徹底紹介。",
    category: "悪役令嬢・乙女ゲーム転生",
    leadText: "「乙女ゲームの破滅確定な悪役令嬢に転生してしまった」「婚約破棄イベントを逆手に取って自由な人生を謳歌する」——悪役令嬢ジャンルは、絶望的な断罪フラグを前世知識と行動力で華麗にへし折っていく大逆転カタルシスと、無自覚な溺愛展開が最大の魅力です。国内外で熱狂的な支持を集める至高の10選を厳選しました。",
    searchQueries: [
      "悪役令嬢 ラノベ おすすめ",
      "乙女ゲーム 転生 破滅フラグ回避 小説",
      "婚約破棄 ざまぁ 溺愛 なろう",
      "悪役令嬢 内政 断罪 逆転 ファンタジー"
    ],
    items: [
      {
        keyword: "乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった…",
        rank: 1,
        hook: "【悪役令嬢ブームの原点】石につまずいて前世を思い出したカタリナの無自覚人たらしコメディ！",
        detailedReview: "頭をぶつけて前世の記憶を取り戻した公爵令嬢カタリナ・クラエス。自分が乙女ゲームの悪役令嬢であり、どのルートでも『国外追放』か『死亡』の破滅フラグしかないと気づく。追放後の農業生活に備えて畑を耕し、魔力特訓に励むうちに、攻略対象のイケメン王子たちだけでなくライバル令嬢までをも無自覚に骨抜きにしていく伝説的ラブコメディです。"
      },
      {
        keyword: "悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。",
        rank: 2,
        hook: "【ラスボス女王の贖罪と救済】極悪非道の運命を抗い、民と国を全身全霊で愛し守り抜く！",
        detailedReview: "乙女ゲームの極悪非道なラスボス女王プライド（8歳）に転生。ゲーム知識と強大な予知・武力チートを駆使し、本来なら悲劇に見舞われるはずだった登場人物たちを次々と救済。民や騎士たちから絶大な信頼と忠誠を集め、国を救う真の名君へと成長していく感動の救済ファンタジーです。"
      },
      {
        keyword: "ツンデレ悪役令嬢リーゼロッテと実況の遠藤くんと解説の小林さん",
        rank: 3,
        hook: "【神の神託による運命改変】高校生の実況と解説がゲーム内の婚約者王子に筒抜け！",
        detailedReview: "本当は婚約者王子ジークヴァルトのことが大好きなのに、素直になれずツンツンしてしまう悪役令嬢リーゼロッテ。現実世界でゲームをプレイする高校生の実況と解説が、なぜか王子の耳に『神の神託』としてリアルタイムで届くことに！ツンデレの本音が丸わかりになった王子による怒涛の溺愛と破滅回避が繰り広げられます。"
      },
      {
        keyword: "公爵令嬢の嗜み",
        rank: 4,
        hook: "【婚約破棄の瞬間から始まる内政】悪役令嬢が近代経済・税制改革で領地を劇的発展へ！",
        detailedReview: "ゲームのエンディングである「婚約破棄と断罪の場」で前世の記憶を取り戻したアイリス。処刑を免れて父から領地代行を任されると、公務員だった前世知識をフル活用して商会立ち上げ、チョコレートの特産品化、銀行制度や公衆衛生の導入に着手。知性と手腕で真の幸福を掴み取る本格派内政ファンタジーです。"
      },
      {
        keyword: "悪役令嬢なのでボス雇ってみました",
        rank: 5,
        hook: "【魔王を口説いて破滅回避】婚約破棄された令嬢がラスボスの魔王に求婚して大逆転！",
        detailedReview: "婚約破棄されたショックで前世を思い出したアイリーン。破滅ルートを避けるため、彼女が選んだ起死回生の一手は「ラスボスである魔王クロードを口説いて恋人（味方）にすること」。持ち前の強気な美貌と商魂、手作りスイーツで孤高の魔王の心を解きほぐし、理不尽な元婚約者たちを見返す痛快ラブバトルです。"
      },
      {
        keyword: "ループ7回目の悪役令嬢は、元敵国で自由気ままな花嫁生活を満喫する",
        rank: 6,
        hook: "【7回の人生経験をフル投入】薬師・商人・騎士のスキルで敵国の皇太子と渡り合う！",
        detailedReview: "20歳で命を落としては婚約破棄の瞬間に巻き戻るループを繰り返すリーシェ。7回目の人生では、過去生で身につけた商人・薬師・侍女・騎士の超一流スキルを総動員して「今度こそ長生きしてゴロゴロ生活する」と決意。しかし過去生で自分を殺した敵国の冷酷皇太子アルノルトから突然求婚され、知略と美貌で運命に挑みます。"
      },
      {
        keyword: "ティアムーン帝国物語",
        rank: 7,
        hook: "【ギロチン回避の歴史改変】元わがまま皇女の保身行動がなぜか『帝国の英知』と崇められる！",
        detailedReview: "革命で断罪されギロチンで処刑された皇女ミーアが、記憶を持ったまま12歳に逆行。死にたくない一心でスイーツと安全を確保しようとするが、その行動が周囲の優秀な臣下たちに深読みされ、帝国の病巣を次々と浄化していく大傑作勘違い歴史ファンタジーです。"
      },
      {
        keyword: "悪役令嬢レベル99 〜私は裏ボスですが魔王ではありません〜",
        rank: 8,
        hook: "【裏ボススペックのカンスト少女】ゲーマー魂でレベル99まで鍛えたら人間兵器に！",
        detailedReview: "乙女ゲームの裏ボス悪役令嬢ユミエラに転生。ゲームオタクだった彼女は、平穏に生きるために幼少期からダンジョンに潜り続け、学園入学時にはレベル99（カンスト）に到達。魔王と見紛う漆黒の魔力と圧倒的な強さ、そして天然ボケな性格が織りなす無双系学園コメディです。"
      },
      {
        keyword: "悪役令嬢の執事様",
        rank: 9,
        hook: "【執事視点の悪役令嬢救済】お嬢様を断罪の悲劇から守るため、モブ執事が暗躍無双！",
        detailedReview: "悪役令嬢ソフィアに仕える執事シリル。ゲーム通りならお嬢様が破滅し自分も死ぬ運命を覆すため、幼少期から文武両道・暗殺術・魔法研究を極め、お嬢様を心身ともに最高に育て上げる。主従の深い絆と、理不尽なゲーム強制力を粉砕する知略戦が胸を熱くさせます。"
      },
      {
        keyword: "悪役令嬢転生おじさん",
        rank: 10,
        hook: "【52歳真面目公務員の親心】おじさんの温かい人徳が悪役令嬢の所作を神対応へと変貌させる！",
        detailedReview: "52歳の真面目な公務員のおじさんが、乙女ゲームの悪役令嬢グレイスに転生。おじさん特有の親心、礼儀正しさ、気配り、人生経験が、悪役令嬢の高慢な言葉遣いと絶妙に混ざり合い、周囲の学園生徒や王子たちをことごとく魅了・更生させていく温かく笑える名作です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-samurai-sword-martial-arts-10",
    title: "剣豪・武術家・日本刀無双おすすめ異世界ラノベ10選【侍魂・極限の剣技・魔導を斬る達人】",
    description: "魔導やモンスターが支配する異世界に、一振りの日本刀と極限まで鍛え抜かれた剣技で挑む！魔法をも切り裂く達人の境地と侍の美学を描くおすすめ異世界剣豪・武術ラノベ10選を徹底解説。",
    category: "剣豪・武術・日本刀",
    leadText: "「派手なチート魔法を鋭い一閃で切り捨てる」「極限まで極めた剣術と武の境地で神話級の魔獣を両断する」——剣豪・武術家ファンタジーは、魔法至上主義の異世界において『研ぎ澄まされた肉体と剣技』が理不尽を圧倒する緊迫感とカタルシスが最大の魅力です。武の真髄に痺れる傑作10選をお届けします。",
    searchQueries: [
      "異世界 剣豪 ラノベ おすすめ",
      "日本刀 侍 転生 小説 なろう",
      "武術家 魔法 斬る 最強ファンタジー",
      "剣聖 達人 異世界 無双"
    ],
    items: [
      {
        keyword: "転生したらスライムだった件",
        rank: 1,
        hook: "【鬼人族の老剣聖ハクロウ】巨大モンスターを一瞬で三枚におろす神速の居合抜刀！",
        detailedReview: "ジュラ・テンペスト連邦国の指南役を務める鬼人族の老剣士ハクロウ。魔法やスキルに頼る若手魔物たちを一刀流・朧流水斬の鋭い神速居合で圧倒し、巨大な魔物や強敵を呼吸一つで両断する姿は、作品屈指の渋さとカッコよさを誇ります。"
      },
      {
        keyword: "異世界サムライ",
        rank: 2,
        hook: "【死に場所を求める女侍】戦国最強の女剣士ギンコが異世界の凶悪魔物を斬り捨てる！",
        detailedReview: "戦国時代を生き抜き、これ以上強い敵がいないことに絶望して「武士らしく潔く討ち死にしたい」と願っていた最強の女侍ギンコ。転移した異世界で凶悪なドラゴンや魔族の軍勢と対峙し、歓喜に震えながら日本刀一閃で魔物を両断していく圧倒的筆力のアクション巨編です。"
      },
      {
        keyword: "片田舎のおっさん、剣聖になる",
        rank: 3,
        hook: "【無自覚の老境剣聖】片田舎の道場主が王都で伝説の英雄たちを圧倒する神技の領域！",
        detailedReview: "片田舎でしがない道場主をしていたおっさんベリル・ガーデナント。自分には才能がないと謙遜していたが、弟子たちが王都で騎士団長や筆頭魔術師に出世し、彼らの推挙で王都へ上京。研ぎ澄まされた基本剣術と経験に裏打ちされた立ち回りで、化け物級の魔物や達人たちを一太刀で制圧していく究極のおっさん剣戟ファンタジーです。"
      },
      {
        keyword: "シャングリラ・フロンティア",
        rank: 4,
        hook: "【クソゲーハンターの超絶パリィ】一撃死の極限状況を紙一重の回避と双剣術で制す！",
        detailedReview: "理不尽なクソゲーで鍛え上げた超人的な反射神経と間合い管理を持つサンラク。神ゲー『シャングリラ・フロンティア』において、防具を捨てた半裸鳥頭スタイルで神話級ユニークモンスター・夜襲のリュカオーンらに挑み、神速のパリィと二刀流剣技で魅せる最高峰のアクションです。"
      },
      {
        keyword: "転生したら剣でした",
        rank: 5,
        hook: "【剣術スキル共有と二刀流】猫耳少女フランが師匠（魔剣）とともに極める剣聖の道！",
        detailedReview: "意志を持つ魔剣として転生した主人公と、黒猫族の少女フラン。魔物を倒して獲得した剣術・体術スキルを共有し、小柄な少女が大型魔獣や歴戦の冒険者を電光石火の剣技で圧倒していくスピード感抜群の成長剣劇ファンタジーです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 6,
        hook: "【重厚な両手剣と聖騎士技】大剣の一振りで山を割り、悪徳領主の軍勢を粉砕！",
        detailedReview: "ゲームアバターの骸骨騎士として異世界へ入ったアーク。身の丈を超える巨大な聖剣を軽々と振るい、天変地異級の武技と神聖魔法を融合させて理不尽な悪を打ち砕いていく王道の爽快アクションです。"
      },
      {
        keyword: "空手バカ異世界",
        rank: 7,
        hook: "【空手一筋・魔法全否定】魔法もドラゴンも関係ない！正拳突き一つで異世界を粉砕！",
        detailedReview: "トラックに撥ねられて異世界転生した空手家。チートスキルや魔法の付与を一切断り、「我が空手こそが最強」と証明するため、徒手空拳のみでゴブリン、オーク、果ては神話の魔龍に挑む。愚直なまでに鍛え上げた正拳突きの破壊力が清々しい異色作です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 8,
        hook: "【古流武術×魔力銃火器】奈落で体得した達人の身のこなしと神速の銃剣格闘！",
        detailedReview: "奈落の底で化け物の肉を喰らい身体能力を極限まで高めた南雲ハジメ。錬成した二丁拳銃ドンナー＆シュラークを手に、古流武術の体捌きと神速の射撃を融合させた近接戦闘術（ガンカタ）で神の使徒たちを圧倒します。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 9,
        hook: "【緻密な剣術ステップと鑑定】一撃必殺の隙を見極めるリアル志向の迷宮剣戟！",
        detailedReview: "デュランダルを手に入れた加賀道夫。派手な大技に頼るのではなく、相手の行動パターンとステータスを冷静に分析し、最小限の回避と精密な斬撃で確実に魔物の急所を貫くリアル志向の迷宮戦闘が魅力です。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 10,
        hook: "【木の棒からの神技開眼】ステータス皆無のぼっちが極限の間合い感覚で魔神を斬る！",
        detailedReview: "チートスキルを何も貰えず、ただの「木の棒」を手に森へ放り出された遥。しかし死線を潜り抜ける中で研ぎ澄まされた気配察知と杖術が極まり、やがて神剣を振るう魔王軍幹部をも翻弄する達人の境地へと到達します。"
      }
    ]
  }
];

async function enrichPart10() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart10) {
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
  console.log(`\nBatch features part 10 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart10().catch(console.error);
