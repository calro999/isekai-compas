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

const batchPart16 = [
  {
    slug: "isekai-reincarnated-sage-master-disciple-10",
    title: "隠遁賢者・師匠育成・弟子太郎おすすめ異世界ラノベ10選【伝説の導き手・規格外の愛弟子・隠密最強】",
    description: "世界を救った伝説の大賢者や最強の師匠が、弟子を育てて無自覚に世界を揺るがす！おすすめ隠遁賢者・師匠育成・規格外弟子ラノベ10選を徹底解説。",
    category: "隠遁賢者・師匠育成",
    leadText: "「山奥でひっそり隠居している老賢者が、育てた弟子たちを全員英雄にしてしまう」「自分では普通の修行のつもりだったのに、弟子が大陸最強の魔術師に育っていた」——隠遁賢者・師匠育成ファンタジーは、師匠の底知れない超絶実力と、弟子たちの無邪気な無双劇が織りなす温かくも爽快な展開が魅力です。至高の10選をお届けします。",
    searchQueries: [
      "隠遁賢者 ラノベ おすすめ",
      "師匠 弟子 育成 異世界 小説 なろう",
      "賢者の孫 類似作品 師匠最強",
      "おっさん 師匠 覚醒 ファンタジー"
    ],
    items: [
      {
        keyword: "賢者の孫",
        rank: 1,
        hook: "【大賢者マーリンの英才教育】常識を教え忘れた結果、世界を揺るがす規格外の神童が誕生！",
        detailedReview: "大賢者マーリンと導の導師メリダに森の奥深くで育てられたシン。二人の伝説的魔法使いからあらゆる戦闘技術と魔術を伝授されたものの、世間の常識を一切教えられなかったため、15歳で王都に出た瞬間から国宝級のアイテムや無詠唱魔法を連発して周囲を卒倒させる痛快作です。"
      },
      {
        keyword: "無職転生",
        rank: 2,
        hook: "【天才魔道士ロキシーとの師弟愛】赤ん坊ルーデウスの才能を見出し、世界へ踏み出す勇気を与えた師匠！",
        detailedReview: "ルーデウスの幼少期に家庭教師として現れた水聖級魔術師ロキシー・ミグルディア。ルーデウスの無詠唱魔術の才能を伸ばすだけでなく、前世の引きこもりトラウマを抱えていた彼を優しく外の世界へと連れ出した、師弟の絆の原点にして最高峰の名作です。"
      },
      {
        keyword: "片田舎のおっさん、剣聖になる",
        rank: 3,
        hook: "【育てた弟子たちが全員国の最高戦力】片田舎の道場主が王都で伝説の英雄たちを圧倒！",
        detailedReview: "田舎の剣術道場主ベリル・ガーデナント。自分には才能がないと思い込んでいたが、彼の教えを受けた弟子たちは王都で騎士団長、筆頭魔導士、最高ランク冒険者へと大出世。弟子たちの熱烈な推薦で上京し、神技の太刀筋で世界を救う究極の師匠ファンタジーです。"
      },
      {
        keyword: "転生したら剣でした",
        rank: 4,
        hook: "【師匠（知性魔剣）と弟子フランの絆】虐げられていた少女を最強の剣士へと育てる親心！",
        detailedReview: "知性を持つ魔剣として転生した「師匠」と、黒猫族の少女フラン。ステータス共有や魔石吸収で得たスキルを惜しみなく授け、美味しい手料理を振る舞いながら、フランが念願の「黒猫族の進化」を果たすまで命がけで導く温かな師弟の冒険譚です。"
      },
      {
        keyword: "オーバーロード",
        rank: 5,
        hook: "【至高の四十一人としての創造主】自らが創り上げたNPCたちを我が子のように導く魔王！",
        detailedReview: "アインズ・ウール・ゴウンは、ナザリック地下大墳墓のNPCたちにとって絶対の神であり偉大なる創造主。彼らが自立して成長できるよう時に厳しく、時に優しく課題を与え、見守りながら世界征服の覇道を突き進む威厳ある師匠・主君像が描かれます。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 6,
        hook: "【孤独な天才魔導士ブランタークと師匠アルフレッド】森で出会った師の遺志を継ぐ少年！",
        detailedReview: "森の中で出会った死霊の魔導士アルフレッドから、魔法の手ほどきと莫大な魔導書・遺産を授かった少年ヴェンデリン。師の教えを胸に刻み、やがて王宮筆頭魔導士ブランタークとともに国家を背負う大魔導士へと成長していきます。"
      },
      {
        keyword: "魔王学院の不適合者",
        rank: 7,
        hook: "【始祖による子孫たちの特別講義】失われた古代魔導の神髄を不適合者として授業で叩き込む！",
        detailedReview: "暴虐の魔王アノス。魔王学院の教師や子孫たちが間違って解釈している魔法理論を、実技授業の中で圧倒的な実践と解説で正していく。落ちこぼれの生徒たちを次々と最強の魔導士へと覚醒させるカリスマ指導者ぶりが痛快です。"
      },
      {
        keyword: "陰の実力者になりたくて！",
        rank: 8,
        hook: "【シャドウの気まぐれ指導が生んだ七陰】悪魔憑きの少女たちを世界最強のエリート集団へ！",
        detailedReview: "悪魔憑きとして捨てられていたアルファたち少女を助け、魔力暴走を治療しながら適当に戦闘技術を教え込んだシド。その教えを完璧に咀嚼した彼女たちが、世界規模の巨大組織シャドウガーデンを作り上げるという勘違い師弟劇の極致です。"
      },
      {
        keyword: "ひとりぼっちの異世界攻略",
        rank: 9,
        hook: "【クラスの女子たちを影から特訓】ゴミスキルを活かした独自戦闘理論で仲間を救済！",
        detailedReview: "森で孤立しながらも、危機に瀕したクラスの女子たちや脳筋男子たちに、魔物の弱点やスキルの効率的な連携方法を影から指導。自らは目立たず仲間たちを強力な冒険者へと導いていく頼れるぼっち師匠です。"
      },
      {
        keyword: "魔導具師ダリヤはうつむかない",
        rank: 10,
        hook: "【偉大な父カルロからの継承】亡き父の職人魂と魔導具づくりの情熱を受け継ぐ成長劇！",
        detailedReview: "名魔導具師だった亡き父カルロの教えと工房を受け継いだダリヤ。父が遺した魔導具への探求心と職人たちへの敬意を胸に、自らの自由な発想で新たな魔導具を生み出していく、温かな親子の魂の継承ストーリーです。"
      }
    ]
  },
  {
    slug: "isekai-reincarnated-holy-healer-priest-10",
    title: "聖女・回復術士・治癒魔法チートおすすめ異世界ラノベ10選【神聖奇跡・即時全快・解毒蘇生無双】",
    description: "欠損部位の完全再生、不治の病の浄化、果ては死者蘇生まで！神聖魔法と治癒チートで国中の傷病者を救い、救世主として崇められるおすすめ聖女・治癒術士ラノベ10選を徹底紹介。",
    category: "聖女・回復術士・治癒チート",
    leadText: "「どんな致命傷も一瞬で光の奇跡で完治させる」「不治の呪いや疫病に苦しむ人々を神聖魔法で救い出し、国中の英雄や神官たちを驚嘆させる」——聖女・治癒魔法ファンタジーは、圧倒的な慈愛と奇跡の力で絶望を希望へと塗り替える救済のカタルシスが最大の魅力です。心打たれる傑作10選を厳選しました。",
    searchQueries: [
      "聖女 異世界 ラノベ おすすめ",
      "回復術士 治癒チート 小説 なろう",
      "聖女の魔力は万能です 類似作品",
      "ヒール 蘇生 魔法 医療 ファンタジー"
    ],
    items: [
      {
        keyword: "聖女の魔力は万能です",
        rank: 1,
        hook: "【常識外れの5割増し奇跡】植物研究所のOLが放つ神聖な光が国中の瀕死者を完全治癒！",
        detailedReview: "聖女召喚に巻き込まれたOLセイ。薬用植物研究所でポーション作りを始めるが、彼女の作るアイテムや治癒魔法は全て効能5割増しの超絶スペック。瀕死の騎士団長アルベルトを一瞬で完治させ、魔物討伐の最前線で浄化の奇跡を放つ大人の極上癒やしファンタジーです。"
      },
      {
        keyword: "異世界薬局",
        rank: 2,
        hook: "【神術×近代医学のハイブリッド】診眼と物質創造で中世の難病・流行り病を根絶！",
        detailedReview: "薬神の加護を受けた少年ファルマ。患者の患部を光で透視する【診眼】と、分子構造を具現化する神術を駆使し、結核、ペスト、白血病など当時の医療では治せなかった難病を次々と治療。中世の医学常識を根底から覆す本格医療・治癒ドラマです。"
      },
      {
        keyword: "回復術士のやり直し",
        rank: 3,
        hook: "【回復の極限・改変と再生】細胞レベルで肉体を書き換え、欠損再生から能力強奪まで！",
        detailedReview: "【癒】の勇者ケヤルの治癒能力。対象の傷を癒やすだけでなく、対象の経験値やスキルをコピーする【模倣（イミテート）】、肉体を意のままに改造する【改悪】を極め、自分を裏切った者たちを圧倒する異色の治癒ピカレスクです。"
      },
      {
        keyword: "ポーション頼みで生き延びます！",
        rank: 4,
        hook: "【あらゆる病を治す万能霊薬】若返りから切断された手足の接合まで完全治癒！",
        detailedReview: "カオルが神様から授かったポーション生成スキル。失明した眼球の再生、手足の復元、若返り、どんな不治の奇病も一瞬で完治させる霊薬をフラスコごと無尽蔵に生み出し、狡猾な貴族や教皇の野望を粉砕していきます。"
      },
      {
        keyword: "チート薬師のスローライフ",
        rank: 5,
        hook: "【創薬スキルで街の悩みを解決】胃もたれから疲労回復まで優しいポーションで人々を癒やす！",
        detailedReview: "ドラッグストアを開店したレイジ。戦いのためではなく、街の人々や獣人たちが健やかに暮らせるよう、飲みやすくて即効性のある傷薬、整胃薬、エナジードリンクを調合。争いのない温かな治癒スローライフの傑作です。"
      },
      {
        keyword: "悲劇の元凶となる最強外道ラスボス女王は民の為に尽くします。",
        rank: 6,
        hook: "【自己犠牲を厭わぬ救済の祈り】傷つき倒れる騎士や民を予知と神聖力で全身全霊で救護！",
        detailedReview: "前世の記憶を取り戻した王女プライド。ゲーム内で悲劇に見舞われるはずだった臣下や民を救うため、自らの危険を顧みず最前線へ駆けつけ、圧倒的な神聖武力と治癒で全員を生還させる感動の救済劇です。"
      },
      {
        keyword: "真の仲間じゃないと勇者のパーティーを追い出されたので、辺境でスローライフすることにしました",
        rank: 7,
        hook: "【辺境薬草店の優しい手当て】薬草軟膏と元冒険者の確かな知識で村人の健康を守る！",
        detailedReview: "ゾルタンの街で薬草屋を開業したレッド。採取した薬草の丁寧な調合技術と、冒険者時代の豊富な外傷治療知識を活かし、妖精熱や怪我に苦しむ町民たちを親身に手当てする心温まる日常が魅力です。"
      },
      {
        keyword: "神達に拾われた男",
        rank: 8,
        hook: "【ヒールスライムによる自動治癒】スライムたちの治癒液で冒険者ギルドの負傷者を一括治療！",
        detailedReview: "リョウマが育てたヒールスライムやポイズンスライム。スライムたちの分泌液を精製して高品質な消毒液や治癒薬を作り出し、大怪我を負った冒険者たちを迅速に処置するユニークなスライム医療です。"
      },
      {
        keyword: "八男って、それはないでしょう！",
        rank: 9,
        hook: "【聖魔法による古代竜の昇天浄化】巨大アンデッドや呪いを光の奔流で一瞬で成仏！",
        detailedReview: "高位の聖魔法を操るヴェンデリンとエリーゼ。王都を脅かすアンデッドの大軍勢や呪われたモンスターたちを、広範囲の聖光結界と治癒魔法で一瞬にして浄化・成仏させる圧倒的な聖者無双です。"
      },
      {
        keyword: "デスマーチからはじまる異世界狂想曲",
        rank: 10,
        hook: "【神薬エリクサーの惜しみない配布】カンスト魔導士が街の貧民や孤児たちを完全救済！",
        detailedReview: "サトゥーのストレージに眠る無尽蔵の高級回復薬と万能薬エリクサー。流行病に苦しむスラムの子供たちや瀕死の仲間たちに惜しみなく神薬を分け与え、影の聖者として街全体を救済する優しさに満ちた旅路です。"
      }
    ]
  }
];

async function enrichPart16() {
  const existingFeatures = JSON.parse(fs.readFileSync(FEATURES_JSON_PATH, 'utf-8'));

  for (const feature of batchPart16) {
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
  console.log(`\nBatch features part 16 successfully fetched and updated! Total features: ${existingFeatures.length}`);
}

enrichPart16().catch(console.error);
