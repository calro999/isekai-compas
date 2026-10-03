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

const batchPart6 = [
  {
    slug: "isekai-reincarnation-class-group-10",
    title: "クラス転移・集団召喚おすすめ異世界ラノベ10選【能力格差・追放下剋上・学級サバイバル】",
    description: "教室ごと丸ごと異世界召喚！ステータス鑑定による能力格差、無能烙印からの超絶覚醒、クラスメイト同士の確執や裏切り、群像劇サバイバルを描くおすすめ異世界クラス転移ラノベ10選を徹底解説。",
    category: "クラス転移・集団召喚",
    leadText: "「ある日突然、教室全体が光に包まれクラスメイト全員で異世界へ召喚される」——クラス転移・集団召喚ファンタジーは、クラス内の人間関係やスクールカーストが異世界の能力値によって劇的に逆転・再編されるカタルシスが最大の魅力です。無能と見下された主人公の超絶覚醒から、仲間たちとのサバイバル群像劇まで、必読の傑作10選をお届けします。",
    searchQueries: [
      "クラス転移 ラノベ おすすめ",
      "集団召喚 異世界 クラスメイト 追放",
      "クラスごと転移 能力格差 下剋上 なろう",
      "学校ごと異世界 復讐 覚醒 小説"
    ],
    items: [
      {
        keyword: "ありふれた職業で世界最強",
        rank: 1,
        hook: "【奈落からの魔改造覚醒】クラスのいじめられっ子が奈落の底で化け物を喰らい最強へ！",
        detailedReview: "クラスメイト全員とともに異世界へ召喚された南雲ハジメは、最弱の「錬成師」だったことで悪意あるクラスメイトの裏切りに遭い、大迷宮の深淵へと突き落とされる。絶望の底で生き残るために魔物の肉を喰らい、肉体を魔改造して独自の銃火器を生み出しながら最強のモンスターへと変貌していく展開は、クラス転移復讐＆成り上がり物の絶対的最高峰です。"
      },
      {
        keyword: "蜘蛛ですが、なにか？",
        rank: 2,
        hook: "【クラス全員が異世界転生】最弱の蜘蛛魔物として迷宮生まれ！人族と魔族の壮大な群像劇",
        detailedReview: "突然の爆発事故により、教室にいた生徒全員が異世界へと転生。勇者や王侯貴族として恵まれた環境に生まれたクラスメイトたちをよそに、最底辺の迷宮で最弱の「蜘蛛」として産み落とされた女子高生の過酷極まるサバイバルが描かれます。やがて蜘蛛子の成長と人族サイドのクラスメイトたちの運命が複雑に交錯していく緻密な構成は圧巻です。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 3,
        hook: "【女神に顔で拒絶された勇者】荒野に捨てられた高校生が人外の仲間と拓く規格外の覇道！",
        detailedReview: "両親の契約によって異世界召喚された深澄真。しかし異世界の美醜至上主義な女神から「顔がブサイク」という理不尽極まりない理由で勇者の資格を剥奪され、世界の果ての荒野に放逐される。しかし圧倒的な魔力と上位竜や災害の黒蜘蛛を従え、人外の従者たちとともに亜人の理想郷を築き上げていく爽快な世直し劇が展開されます。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 4,
        hook: "【余り物バッドスキル全取得】ぼっち高校生が不遇スキルを掛け合わせてチート神に！",
        detailedReview: "クラス全員が異世界召喚され、強いチートスキルを早い者勝ちで奪い合う中、出遅れた主人公遥には「ぼっち」「ニート」「ひきこもり」などのゴミスキルしか残っていなかった。しかしそれらの余り物スキルを全て押し付けられた結果、スキルの奇跡的なシナジーによって超絶万能チートを発現。ひとりを愛しながらもクラスメイトを影から救っていく痛快アクションコメディです。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 5,
        hook: "【E級判定からの廃棄宣告】絶対的生存率ゼロの遺跡から状態異常スキルで女神に復讐を誓う！",
        detailedReview: "クラスメイトとともに召喚された空気系モブ男子・三森灯火は、女神ヴィシスから最低ランクの「E級」と判定され、生存率ゼロの廃棄遺跡へと追放される。しかし彼の得た【麻痺】【毒】【睡眠】などの状態異常スキルは、成功率100%かつ必中の凶悪チートだった。冷徹に魔物を殲滅し、女神とクラスメイトたちへの復讐行を開始する緊迫感あふれるダークファンタジーです。"
      },
      {
        keyword: "即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。",
        rank: 6,
        hook: "【バスごと召喚された規格外】賢者候補の選別に置き去りにされた少年の一撃必殺無双！",
        detailedReview: "修学旅行中のバスごと異世界に召喚され、賢者からギフト（能力）を与えられたクラスメイトたち。能力を得られずドラゴンのおとりにされた主人公・高遠夜霧だったが、実は彼こそが「死ね」と念じるだけであらゆる神や理を殺滅する根源的な怪異だった。あらゆるチートや理不尽を鼻歌交じりに消滅させていく究極の理不尽即死コメディです。"
      },
      {
        keyword: "異世界迷宮でハーレムを",
        rank: 7,
        hook: "【ステータス再設定と迷宮攻略】ゲーム感覚の転移から始まる緻密なスキルビルドと生活設計！",
        detailedReview: "怪しげなウェブサイトのゲームキャラメイクを完了したことで異世界に転移した加賀道夫。自ら設定したボーナスポイントとスキル割り振りを武器に、迷宮探索で資金を稼ぎ、奴隷商人から美少女ロクサーヌを購入してハーレムを築いていきます。クラス転移とは異なる個人転移の最高峰であり、徹底的にリアルな迷宮経済と生活描写が光ります。"
      },
      {
        keyword: "モンスターがあふれる世界になったので、好きに生きたいと思います",
        rank: 8,
        hook: "【現実世界のダンジョン化】社畜サラリーマンが現実の崩壊を機に自由を謳歌する現代サバイバル！",
        detailedReview: "ある日突然、世界中にモンスターが出現し文明社会が崩壊。ブラック企業勤めだった主人公は、偶然モンスターを倒したことでレベルアップとスキルシステムに目覚め、社畜生活から解放されて自由気ままに生きることを決意します。日常が非日常へと塗り替えられるスリルと、マイペースな探索が魅力の傑作です。"
      },
      {
        keyword: "望まぬ不死の冒険者",
        rank: 9,
        hook: "【最底辺からの存在進化】骨人（スケルトン）から始まる地道な迷宮探索と肉体再生！",
        detailedReview: "才能に恵まれず万年銅級冒険者だったレントは、迷宮の未踏破区域で竜に喰われ、目覚めると魔物「スケルトン」になっていた。人間に戻るため、魔物を倒して「存在進化（エボリューション）」を繰り返し、ゾンビ、グール、吸血鬼へと進化を遂げていく重厚なダークファンタジー。緻密な設定と愚直な主人公の生き様が心を打ちます。"
      },
      {
        keyword: "異世界チート魔術師",
        rank: 10,
        hook: "【全属性＆規格外魔力】幼馴染とともに召喚された高校生が王道ハイファンタジーを駆け抜ける！",
        detailedReview: "普通の高校生である太一と凛が、突如として異世界へ転移。魔力測定を行ったところ、二人とも通常ではあり得ない全属性適性と測定不能の魔力総量を秘めていることが判明。圧倒的なチート魔術を駆使して魔物や敵国の陰謀を打ち砕いていく、直球ど真ん中の王道チート魔術バトルです。"
      }
    ]
  },
  {
    slug: "isekai-black-company-escape-slowlife-10",
    title: "ブラック企業・社畜脱出おすすめ異世界ラノベ10選【過労死からの解放・自由な第二の人生】",
    description: "理不尽な労働・デスマーチ・残業地獄からの完全脱出！現代日本のブラック企業で擦り切れた主人公が、異世界で圧倒的な自由とマイペースな幸せを掴み取るおすすめ社畜解放ラノベ10選を徹底紹介。",
    category: "社畜脱出・セカンドライフ",
    leadText: "「毎日終電、休日出勤、理不尽な上司と終わらない残業」——現代社会のブラック企業で心身を削られた主人公たちが、異世界転生をきっかけに『二度とあんな働き方はしない！』と誓い、自由気ままなセカンドライフを謳歌する作品群は現代人の心に深く刺さります。労働の苦しみを知る大人にこそ読んでほしい至高の10選を厳選しました。",
    searchQueries: [
      "社畜 異世界転生 ラノベ おすすめ",
      "ブラック企業 脱出 スローライフ 小説",
      "過労死 転生 のんびり 自由 なろう",
      "サラリーマン 異世界 セカンドライフ"
    ],
    items: [
      {
        keyword: "スライム倒して300年、知らないうちにレベルMAXになってました",
        rank: 1,
        hook: "【過労死の反省から不老不死へ】高原の一軒家でスライムを毎日狩り続けたら世界最強に！",
        detailedReview: "ブラック企業で過労死したOLアズサが、「絶対に無理して働かない」と誓って不老不死の魔女として高原の村へ転生。生活費のために1日2〜3匹のスライムを狩るだけの悠々自適な生活を300年続けた結果、知らないうちに経験値がカンストして世界最強になっていたという心温まる日常コメディ。可愛い家族が増えていく幸せな日常が心を満たします。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 2,
        hook: "【デスマーチ徹夜中に転移】仮眠から目覚めたらマップ殲滅で一瞬にしてカンスト＆大富豪！",
        detailedReview: "納期前のデスマーチで徹夜続きだったプログラマー鈴木（サトゥー）が、仮眠中にゲームと酷似した異世界へ転移。初期支給の「流星雨」で広大なマップの魔物を全滅させたことで、レベル310と天文学的な財宝を獲得。最強の力を隠しながら、異世界の美食や観光名所を巡る豪華絢爛な観光旅行を満喫する究極のセカンドライフです。"
      },
      {
        keyword: "異世界居酒屋「のぶ」",
        rank: 3,
        hook: "【異世界の路地裏に繋がる居酒屋】冷えた生ビールと温かな居酒屋料理で異世界人を虜にする！",
        detailedReview: "京都の寂れた通りにある居酒屋「のぶ」の入り口が、なぜか中世ヨーロッパ風の異世界・古都アイテーリアと繋がった。料亭での厳しい修行を経て独立した大将ノブと給仕のしのぶが、冷えた「トリアエズナマ」や唐揚げ、おでんなどの日本の大衆料理を振る舞い、過酷な現実を生きる衛兵や貴族たちの心を解きほぐしていきます。"
      },
      {
        keyword: "異世界のんびり農家",
        rank: 4,
        hook: "【闘病の末に手に入れた健康体】万能農具を振るって森を開拓！仲間が集まる大樹の村！",
        detailedReview: "ブラック企業での酷使と長年の闘病生活の末に若くして命を落とした火楽（ヒラク）。神様から病気にならない健康な肉体と、どんな土地も耕せる「万能農具」を授かり、誰も住まない死の森で気ままな農業を開始。やがてエルフや吸血鬼、天使や竜など様々な種族が集まり、豊かで平和な理想の村を作り上げていく圧巻の開拓譚です。"
      },
      {
        keyword: "鍛冶屋ではじめる異世界スローライフ",
        rank: 5,
        hook: "【定年を迎えた社畜の夢】チートな生産能力で森の中に自分だけの鍛冶工房を開業！",
        detailedReview: "社畜として人生を終えた男が、のんびりものづくりをして暮らしたいと願って異世界へ転生。神様から授かった「チート生産スキル」によって、包丁や農具から伝説の神剣まで思いのままにクラフト可能に。猫耳少女やエルフの娘とともに、森の中でマイペースに依頼を受けながら暮らす落ち着いた大人向けのスローライフ作品です。"
      },
      {
        keyword: "解雇された暗黒兵士（30代）のスローなセカンドライフ",
        rank: 6,
        hook: "【突然のリストラからの大逆転】魔法が使えず解雇された魔王軍兵士が人間の村で才能開花！",
        detailedReview: "魔王軍四天王補佐として過酷な労働に従事しながらも、魔法が使えないという理由で突然解雇されたダリエル（32歳）。絶望して森を彷徨う中、助けた人間の少女の村に身を寄せるが、実は彼が人間族であり、すべての物理スキルを極めた超人であることが判明。温かな村人たちと家庭を築き、充実した第二の人生を歩み出します。"
      },
      {
        keyword: "佐々木とピーちゃん",
        rank: 7,
        hook: "【中堅サラリーマンと文鳥賢者】ペットショップで買った文鳥が異世界の大賢者だった！",
        detailedReview: "ブラック企業勤務で疲弊した中堅サラリーマン佐々木が、癒やしを求めてペットショップで文鳥を購入。しかしその文鳥は異世界から転生してきた大賢者ピエルカルロスだった。異世界と現代日本を自由に行き来する魔法を教わった佐々木は、異世界で現代品を売買して早期退職とセミリタイアを目指すが、様々なトラブルに巻き込まれていきます。"
      },
      {
        keyword: "転生したらスライムだった件",
        rank: 8,
        hook: "【後輩を庇って刺されたサラリーマン】魔物たちに衣食住と労働環境を提供する理想郷建設！",
        detailedReview: "通り魔から後輩をかばって死んだ三上悟（37歳独身サラリーマン）が、スライムとして転生。前世で培った高いコミュニケーション能力、マネジメント能力、柔軟な思考力をフルに活かし、ゴブリンやオークなどの魔物たちに清潔な住環境と美味しい食事、無理のない分業体制を与えて理想的な国家を築き上げていく統治ファンタジーです。"
      },
      {
        keyword: "おっさん冒険者ケインの善行",
        rank: 9,
        hook: "【お人好し社畜マインドの奇跡】ゴミ拾いや人助けを地道に続けたら神々の加護が山盛りに！",
        detailedReview: "お人好しすぎて貧乏くじばかり引いてきた元社畜の冒険者ケイン。周囲からバカにされながらも地道な街の清掃や困っている人々の手助けを続けていたところ、その善行が神々の目に留まり、とんでもない神級スキルと幸運が次々と舞い込んできます。善人が報われる圧倒的な爽快感と温かさが魅力の作品です。"
      },
      {
        keyword: "とんでもスキルで異世界放浪メシ",
        rank: 10,
        hook: "【巻き込まれ会社員の自衛】勇者召喚に巻き込まれた社畜がネットスーパーの美味で世界を制覇！",
        detailedReview: "勇者召喚に巻き込まれた平凡なサラリーマン・ムコーダ。王宮の胡散臭さを察知して即座に脱出し、唯一のスキル「ネットスーパー」で現代の調味料や食材を取り寄せながらのんびり旅に出る。しかしその手料理の美味さに釣られて伝説の魔獣フェンリルが従魔になり、気ままなグルメ放浪記が幕を開けます。"
      }
    ]
  }
];

async function enrichPart6() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart6) {
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
  console.log(`\nBatch features part 6 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart6().catch(console.error);
