import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadEnv() {
  const content = await fs.readFile(path.join(root, '.env'), 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...vals] = trimmed.split('=');
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function searchWithRetry(itemNumber, maxRetries = 3) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    format: 'json',
    formatVersion: '2',
    itemNumber: itemNumber
  });

  const url = `https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        console.warn(`  [429 Rate Limit] Waiting 2.5s before retry (attempt ${attempt}/${maxRetries})...`);
        await sleep(2500);
        continue;
      }
      if (!res.ok) {
        throw new Error(`API returned ${res.status}: ${await res.text()}`);
      }
      const data = await res.json();
      const items = data.Items || data.items || [];
      return items[0];
    } catch (err) {
      if (attempt === maxRetries) throw err;
      await sleep(2000);
    }
  }
  return null;
}

async function main() {
  await loadEnv();

  const targetList = [
    { name: '栄転したおじさん、迷宮都市一の治癒士となる', itemNumber: '4336592900320' },
    { name: '設定厨、悪役貴族になる。', itemNumber: '4336343300320' },
    { name: 'テレポーター 〜出来損ないの魔法使いは、いずれ神域へと至る〜 1', itemNumber: '6302300000795' },
    { name: 'モブ司祭だけど、この世界が乙女ゲームだと気づいたのでヒロインを育成します３', itemNumber: '4336593400320' },
    { name: '男女比バグっているのに悪役転生だと思い込んでいる奴', itemNumber: '4524815637440' }
  ];

  console.log('--- 楽天API直接呼び出しによる5冊の詳細取得（レート制限対応版） ---');
  const detailedBooks = [];

  for (const t of targetList) {
    console.log(`Fetching from Rakuten API: ${t.name} (${t.itemNumber})...`);
    await sleep(1500);
    const book = await searchWithRetry(t.itemNumber);
    if (!book) {
      throw new Error(`Could not fetch details for ${t.name}`);
    }
    console.log(` -> OK: [${book.title}] | 著者: ${book.author} | 発売日: ${book.salesDate} | 定価: ${book.itemPrice}円`);
    detailedBooks.push(book);
  }

  await fs.writeFile(
    path.join(root, 'scripts/temp_research_5books_nov2026.json'),
    JSON.stringify(detailedBooks, null, 2),
    'utf8'
  );
  console.log('\nSuccessfully saved 5 books to scripts/temp_research_5books_nov2026.json');
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
