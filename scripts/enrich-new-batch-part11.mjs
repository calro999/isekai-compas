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

const batchPart11 = [
  {
    slug: "isekai-reincarnated-assassin-shadow-operative-10",
    title: "暗殺者・影の始末屋おすすめ異世界ラノベ10選【プロの技術・暗躍無双・冷徹な処刑劇】",
    description: "現代の暗殺術、隠密工作、毒殺、狙撃技術でファンタジーの理不尽な権力者や魔族を人知れず始末する！おすすめ異世界暗殺者・スナイパーラノベ10選を徹底解説。",
    category: "暗殺者・影の工作員",
    leadText: "「世界最高の暗殺者が勇者を暗殺する使命を帯びて転生する」「派手な魔法を過信した敵を、完全な死角からの不可視の一撃で葬り去る」——暗殺者・影の始末屋ファンタジーは、徹底した合理主義とプロフェッショナリズムがもたらす冷徹な暗躍劇が最大の魅力です。研ぎ澄まされた緊迫感あふれる傑作10選をお届けします。",
    searchQueries: [
      "暗殺者 異世界転生 ラノベ おすすめ",
      "世界最高の暗殺者 異世界貴族に転生する 類似作品",
      "スナイパー 狙撃 異世界 小説 なろう",
      "暗殺 ステルス 隠密 チート ファンタジー"
    ],
    items: [
      {
        keyword: "世界最高の暗殺者、異世界貴族に転生する",
        rank: 1,
        hook: "【プロの暗殺術×魔術開発】女神から『勇者暗殺』の密命を受けた暗殺貴族の完璧なる準備劇！",
        detailedReview: "地球上で暗殺の極致を極めた男が、暗殺貴族トウアハーデ家の長男ルーグとして転生。与えられた使命は「将来世界を滅ぼす勇者の暗殺」。現代の弾道学や化学知識を魔法と融合させて超長距離狙撃魔術や新型爆薬を開発し、表向きは優雅な貴族、裏では冷徹な始末屋として暗躍するプロフェッショナルファンタジーの頂点です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 2,
        hook: "【影を統べるスタイリッシュ暗殺】暗闇に潜み、理不尽な悪を漆黒の一撃で消滅させる！",
        detailedReview: "「普段は凡庸なモブ、裏では全てを操る最強の影」を目指すシド・カゲノー。スライムスーツの超伝導魔力特性を活かした不可視の刃と神速の体術、そして一撃で山をも消し飛ばす奥義『アイ・アム・アトミック』で敵対組織を冷徹に粉砕していくスタイリッシュアクションの極致です。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 3,
        hook: "【電磁加速式対物ライフル狙撃】数キロ先から神の使徒を撃ち抜く超長距離スナイピング！",
        detailedReview: "奈落の底で超常の錬成技術を手に入れた南雲ハジメ。自作した超大型対物ライフル「シュラーゲン」に電磁加速（レールガン）を付与し、視界外の遠距離から敵国の幹部や魔物を頭部ごと粉砕する圧倒的スナイパー無双の爽快感が際立ちます。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 4,
        hook: "【必中必殺のステルス暗殺】絶対無音で麻痺・毒・睡眠を付与し、反撃すら許さず完全処刑！",
        detailedReview: "最低ランクのE級と判定され廃棄遺跡に捨てられた三森灯火。成功率100%の【パラライズ（麻痺）】【ポイズン（毒）】を駆使し、魔獣や傲慢な勇者たちを一切の物音を立てずに無力化・抹殺する冷徹無比なステルス暗殺サバイバルです。"
      },
      {
        keyword: "骸骨騎士様、只今異世界へお出掛け中",
        rank: 5,
        hook: "【エルフの凄腕くノ一従者】隠密移動と暗殺術で悪徳奴隷商人を闇から葬る！",
        detailedReview: "アークの相棒となるエルフの精鋭忍者アリアンとチヨメ。里に伝わる神速の忍術、煙幕、くない投擲、暗殺術を駆使して、エルフ族を拉致する悪徳商人や腐敗貴族の拠点を静かに殲滅していく本格アクションが魅力です。"
      },
      {
        keyword: "回復術士のやり直し",
        rank: 6,
        hook: "【人体の構造を掌握する暗殺医療】触れるだけで肉体を改変し、苦痛とともに処刑する！",
        detailedReview: "【回復（ヒール）】の真髄を極め、対象の肉体や記憶を自由に書き換えるケヤルガ。治療に見せかけて相手の血管を破裂させたり、毒薬の知識と変身能力で敵中枢に潜入して首謀者を始末する、容赦なき復讐ピカレスクです。"
      },
      {
        keyword: "最強陰陽師の異世界転生記",
        rank: 7,
        hook: "【目に見えぬ呪詛と式神の暗躍】魔法世界で誰も感知できない呪術暗殺の圧倒的アドバンテージ！",
        detailedReview: "朝廷の陰謀で暗殺された歴代最強の陰陽師・玖峨晴嘉が、魔法の世界へ転生。魔力を持たないと侮られるが、異世界の誰も感知できない「気」と「呪符」、無数の式神を駆使して、背後から音もなく敵の呪詛を跳ね返し処刑する知略暗躍譚です。"
      },
      {
        keyword: "悪役令嬢の執事様",
        rank: 8,
        hook: "【お嬢様を陰から守る影の刃】暗殺組織の手口を知り尽くした執事が敵を闇夜で始末！",
        detailedReview: "悪役令嬢ソフィアに仕えるモブ執事シリル。お嬢様に危険が及ばぬよう、夜な夜な王都の裏社会に潜入し、敵対貴族が放った暗殺者や諜報員を返り討ちにして証拠ごと隠滅する、クールで頼もしい影の守護神ぶりが光ります。"
      },
      {
        keyword: "即死チートが最強すぎて、異世界のやつらがまるで相手にならないんですが。",
        rank: 9,
        hook: "【究極の不可逆的暗殺】気配も魔法も関係なく、殺意を向けられた瞬間に相手の心臓を止める！",
        detailedReview: "高遠夜霧の持つ即死能力は、暗殺者が気配を消して背後から狙撃しようと、毒を盛ろうと、自身への殺意を感知した瞬間にオートで相手の命（あるいは特定の臓器・機能）を停止させる。あらゆる暗殺技術すら無力化する絶対の終焉です。"
      },
      {
        keyword: "幼女戦記",
        rank: 10,
        hook: "【魔導狙撃ライフルによる航空暗殺】上空数千メートルからの精密射撃で敵司令部を壊滅！",
        detailedReview: "帝国軍第二〇三航空魔導大隊を率いるターニャ。高高度からの長距離精密魔導狙撃で敵の通信基地や指揮官を正確無比に狙撃・破壊する、冷徹で計算し尽くされたミリタリー暗殺戦術の傑作です。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-hero-betrayed-banished-revenge-10",
    title: "勇者裏切り・追放復讐おすすめ異世界ラノベ10選【絶望からの覚醒・冷酷な制裁・完全ざまぁ】",
    description: "信じていた仲間や国王に裏切られ、命の危機に瀕した勇者・魔導士が真の力に目覚める！理不尽な追放者たちを絶望の淵へ叩き落とすおすすめ勇者裏切り・追放復讐ラノベ10選を徹底紹介。",
    category: "追放・裏切り・復讐",
    leadText: "「世界を救ったのに魔王の呪いだと恐れられて処刑されかけた」「無能の烙印を押されて追放された後、パーティが崩壊していく」——追放・裏切り復讐ファンタジーは、底辺に突き落とされた主人公の圧倒的逆転覚醒と、裏切った者たちが自業自得の結末を迎える極上のカタルシスが最大の魅力です。スカッと胸がすく傑作10選を厳選しました。",
    searchQueries: [
      "追放 復讐 ラノベ おすすめ",
      "勇者 裏切り ざまぁ 小説 なろう",
      "パーティ追放 覚醒 復讐 異世界",
      "裏切られた勇者 復讐劇 完結"
    ],
    items: [
      {
        keyword: "回復術士のやり直し",
        rank: 1,
        hook: "【時を巻き戻す完全復讐劇】薬漬けにされ搾取された癒の勇者が、かつての勇者たちに地獄を見せる！",
        detailedReview: "勇者パーティで都合よく利用され、薬物中毒にされて虐待を受け続けた【癒】の勇者ケヤル。魔王を倒した瞬間、賢者の石を使って世界を巻き戻し、かつての仲間たち（勇者・聖女・騎士）への綿密かつ冷酷な復讐劇を開始する、追放復讐ピカレスクの極致です。"
      },
      {
        keyword: "盾の勇者の成り上がり",
        rank: 2,
        hook: "【冤罪からの不屈の成り上がり】国家ぐるみの裏切りから憤怒の盾と仲間たちで世界を救う！",
        detailedReview: "四聖勇者の一人として召喚されながら、王女の卑劣な罠によって冤罪を着せられ全財産と名誉を剥奪された盾の勇者・岩谷尚文。誰も信じられなくなった彼が、亜人の少女ラフタリアと出会い、防御力特化の盾スキルを磨き抜いて真の英雄へと成り上がっていく感動巨編です。"
      },
      {
        keyword: "ハズレ枠の【状態異常スキル】で最強になった俺がすべてを蹂躙するまで",
        rank: 5,
        hook: "【女神への復讐行】最弱E級と見下され廃棄された少年が、絶対必中の毒と麻痺で神を狩る！",
        detailedReview: "クラス召喚で最低評価を受け、生存率ゼロの廃棄遺跡に放り込まれた三森灯火。クソ女神ヴィシスへの復讐だけを胸に、相手の行動を完全に封じる凶悪な状態異常スキルで遺跡の超難関ボスを殲滅。冷静沈着に力を蓄え、自分を捨てた者たちを狩り尽くすダークリベンジです。"
      },
      {
        keyword: "ありふれた職業で世界最強",
        rank: 4,
        hook: "【クラスメイトの裏切りと奈落】友人に背中から撃たれた少年が、世界の敵として君臨する！",
        detailedReview: "大迷宮の戦闘中、嫉妬に狂ったクラスメイトの魔法で奈落の底へ突き落とされた南雲ハジメ。絶望の暗闇で「邪魔する奴は神でも殺す」と決意し、魔物を喰らい尽くして最強のモンスターへと変貌。裏切った者たちを圧倒的な実力差で絶望させる究極の下剋上です。"
      },
      {
        keyword: "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました",
        rank: 5,
        hook: "【パーティ崩壊の始まり】導き手レッドを追放した勇者パーティが機能不全に陥る皮肉！",
        detailedReview: "初期レベルの高さで序盤を支えたが、成長限界を迎えたことで賢者アレスから「お前は真の仲間ではない」と追放されたレッド。しかしレッドがいなくなったことでパーティの補給・調整・戦術が崩壊。一方レッドは辺境で最愛のお姫様と幸せな薬草屋スローライフを満喫します。"
      },
      {
        keyword: "勇者パーティーを追放されたビーストテイマー、最強種の猫耳少女と出会う",
        rank: 6,
        hook: "【何もしない無能と罵られた調教士】最強種と契約し、追放したパーティを完膚なきまでに圧倒！",
        detailedReview: "索敵や荷物持ちとしてパーティを支えていたビーストテイマーのレイン。勇者から「動物を使役するだけの無能」と追放されるが、直後に最強種である猫霊族の美少女・奏と契約。規格外の身体能力と魔力を得て、追放した元パーティを遥かに凌駕する英雄へと大覚醒します。"
      },
      {
        keyword: "解雇された暗黒兵士（30代）のスローなセカンドライフ",
        rank: 7,
        hook: "【四天王軍を支えていた実力者】魔法が使えないと解雇された補佐役が人間族の英雄へ！",
        detailedReview: "魔王軍四天王を裏で支えていた暗黒兵士ダリエル。新四天王の愚息によって「魔法が使えない無能」と即日解雇されるが、彼が抜けた魔王軍は内政と軍務が完全に麻痺。人間の村に身を寄せたダリエルは、すべての物理スキルを極めた超人として人々を救い幸せを掴みます。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 8,
        hook: "【余り物スキルでの孤高の無双】クラスメイト全員に置いていかれたぼっちが最強の守護神へ！",
        detailedReview: "チートスキル争奪戦に出遅れ、使えないバッドスキルだけを押し付けられて森に置き去りにされた遥。しかしスキルの隠されたシナジーを見抜いて独自覚醒し、危機に陥ったクラスメイトたちを影から圧倒的な実力で救出し、見返していく痛快コメディです。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 9,
        hook: "【始祖を否定した子孫への鉄槌】不適合者の烙印を押された魔王が、偽りの勇者と歴史を粉砕！",
        detailedReview: "二千年後に転生した暴虐の魔王アノス。しかし魔王学院では偽りの魔王の名前が崇められ、本物の始祖であるアノスは「不適合者」として差別される。侮辱する貴族の生徒や教師たちを心音一つ・瞬き一つで圧倒し、真実を突きつける究極のカタルシスです。"
      },
      {
        keyword: "月が導く異世界道中",
        rank: 10,
        hook: "【理不尽な女神の放逐からの逆襲】顔が不細工と見捨てられた少年が、神すら恐れる亜人の覇王へ！",
        detailedReview: "女神の身勝手な美醜基準で「不細工」と罵られ、荒野へ捨てられた深澄真。しかし荒野で最強の上位竜トモエや災害の黒蜘蛛ミオを従え、亜人たちの巨大自治都市を建設。女神の信徒や身勝手な勇者たちを圧倒的な魔力で威圧し、独自の覇道を突き進みます。"
      }
    ]
  }
];

async function enrichPart11() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart11) {
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
  console.log(`\nBatch features part 11 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart11().catch(console.error);
