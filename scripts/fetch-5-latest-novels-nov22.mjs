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

async function fetchByItemNumber(itemNumber, maxRetries = 3) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    format: 'json',
    formatVersion: '2',
    itemNumber
  });
  const url = `https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const res = await fetch(url);
    if (res.status === 429) {
      console.warn(`  [429] Waiting 2.5s before retry (${attempt}/${maxRetries})...`);
      await sleep(2500);
      continue;
    }
    if (!res.ok) {
      throw new Error(`API returned ${res.status}: ${await res.text()}`);
    }
    const data = await res.json();
    const items = data.Items || data.items || [];
    return items[0] || null;
  }
  return null;
}

async function main() {
  await loadEnv();
  const existingBooks = JSON.parse(await fs.readFile(path.join(root, 'public/data/books.json'), 'utf8'));
  const existingSlugs = new Set(existingBooks.map(b => String(b.slug)));

  const targetList = [
    { name: '私、曇りの聖女と呼ばれたけれど！１', itemNumber: '8890090038865' },
    { name: '銃×石', itemNumber: '4320000960042' },
    { name: 'モブなので恋愛よりドラゴン育成したいです', itemNumber: '4524815627960' },
    { name: 'あくまでてんしです', itemNumber: '4320000960043' },
    { name: '転生したら奴隷使役と回復のスキルを持っていたので遊び半分で奴隷だけの秘密結社を作ってみた3', itemNumber: '4335707300320' }
  ];

  console.log('--- 楽天API直接呼び出しによる5冊の詳細情報取得 ---');
  const results = [];
  for (const t of targetList) {
    if (existingSlugs.has(t.itemNumber)) {
      throw new Error(`Duplicate detected in books.json: ${t.itemNumber} (${t.name})`);
    }
    await sleep(1200);
    const book = await fetchByItemNumber(t.itemNumber);
    if (!book) {
      throw new Error(`Could not fetch details for ${t.name} (${t.itemNumber})`);
    }
    console.log(`OK: [${book.title}] | 著: ${book.author} | 出版: ${book.publisherName} | 発売日: ${book.salesDate} | 価格: ${book.itemPrice}円 | URL: ${book.affiliateUrl}`);
    results.push(book);
  }

  const outPath = path.join(root, 'scripts/temp_research_5books_nov22.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nSaved 5 books to ${outPath}`);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
