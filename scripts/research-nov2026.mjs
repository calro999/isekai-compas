import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadEnv() {
  try {
    const envPath = path.join(root, '.env');
    const content = await fs.readFile(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=');
        const val = vals.join('=').trim();
        if (key.trim() && val) process.env[key.trim()] = val;
      }
    }
  } catch (e) {}
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function searchRakuten(paramsObj) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    format: 'json',
    formatVersion: '2',
    koboGenreId: '101903001', // ライトノベル
    sort: '-releaseDate',
    hits: '15',
    ...paramsObj
  });
  const url = `https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`;
  const response = await fetch(url);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Rakuten API Error (${response.status}): ${text}`);
  }
  const data = await response.json();
  return data.Items || data.items || [];
}

async function main() {
  await loadEnv();

  const booksPath = path.join(root, 'public/data/books.json');
  const existingBooks = JSON.parse(await fs.readFile(booksPath, 'utf8'));
  const existingSlugs = new Set(existingBooks.map(b => String(b.slug)));
  const existingTitles = new Set(existingBooks.map(b => b.title));

  console.log('--- 楽天API直接呼び出しによる最新ラノベのリサーチ開始 ---');

  const queries = [
    { title: 'ファンタジア文庫' },
    { title: 'スニーカー文庫' },
    { title: '電撃文庫' },
    { title: 'MF文庫J' },
    { title: 'オーバーラップ文庫' },
    { title: 'GA文庫' },
    { keyword: '転生' },
    { keyword: '追放' },
    { keyword: '悪役令嬢' },
    { keyword: 'チート' },
    { keyword: 'レベル' }
  ];

  const foundCandidates = new Map();

  for (const q of queries) {
    console.log(`Searching with params: ${JSON.stringify(q)}...`);
    try {
      const items = await searchRakuten(q);
      for (const item of items) {
        const slug = String(item.itemNumber);
        if (existingSlugs.has(slug) || existingTitles.has(item.title)) {
          continue;
        }
        // コミックではなく小説（ライトノベル）であるか判定（titleに「（コミック）」や「巻」だけでコミック版のものは除外）
        if (item.title.includes('（コミック）') || item.title.includes('【コミック】') || item.title.includes('【分冊版】') || item.title.includes('単話')) {
          continue;
        }
        if (!foundCandidates.has(slug)) {
          foundCandidates.set(slug, item);
        }
      }
    } catch (e) {
      console.error(`Error with ${JSON.stringify(q)}:`, e.message);
    }
    await sleep(1000);
  }

  const allItems = Array.from(foundCandidates.values());
  // 発売日が新しい順にソート
  allItems.sort((a, b) => (b.salesDate || '').localeCompare(a.salesDate || ''));

  console.log(`\nFound ${allItems.length} candidate books not yet registered.`);
  console.log('\nTop 20 candidates:');
  allItems.slice(0, 20).forEach((b, idx) => {
    console.log(`${idx + 1}. [${b.salesDate}] ${b.title} | 著: ${b.author} | 出版: ${b.publisherName} | slug: ${b.itemNumber}`);
  });

  await fs.writeFile(
    path.join(root, 'scripts/temp_candidates_pool.json'),
    JSON.stringify(allItems.slice(0, 30), null, 2),
    'utf8'
  );
  console.log('\nSaved candidates pool to scripts/temp_candidates_pool.json');
}

main().catch(console.error);
