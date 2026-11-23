import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function loadEnv() {
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
    hits: '20',
    ...paramsObj
  });
  const url = `https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const response = await fetch(url);
    if (response.status === 429) {
      await sleep(2500);
      continue;
    }
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Rakuten API Error (${response.status}): ${text}`);
    }
    const data = await response.json();
    return data.Items || data.items || [];
  }
  return [];
}

async function main() {
  await loadEnv();

  const booksPath = path.join(root, 'public/data/books.json');
  const existingBooks = JSON.parse(await fs.readFile(booksPath, 'utf8'));
  const existingSlugs = new Set(existingBooks.map(b => String(b.slug)));
  const existingTitles = new Set(existingBooks.map(b => b.title));

  console.log('--- 楽天API直接呼び出しによる最新ラノベのリサーチ開始 (2026-11-23) ---');

  const queries = [
    { page: 1 },
    { page: 2 },
    { page: 3 },
    { publisherName: 'KADOKAWA' },
    { publisherName: 'SBクリエイティブ' },
    { publisherName: '小学館' },
    { publisherName: '講談社' },
    { publisherName: '集英社' },
    { publisherName: 'オーバーラップ' },
    { publisherName: 'ホビージャパン' },
    { publisherName: '主婦の友社' },
    { publisherName: 'TOブックス' },
    { publisherName: 'アース・スター エンターテイメント' },
    { publisherName: '一迅社' },
    { publisherName: '双葉社' },
    { keyword: '異世界' },
    { keyword: '転生' },
    { keyword: '追放' },
    { keyword: '悪役令嬢' },
    { keyword: '聖女' },
    { keyword: 'ダンジョン' },
    { keyword: '魔王' }
  ];

  const foundCandidates = new Map();

  for (const q of queries) {
    try {
      const items = await searchRakuten(q);
      for (const item of items) {
        const slug = String(item.itemNumber);
        if (existingSlugs.has(slug) || existingTitles.has(item.title)) continue;
        if (!item.itemCaption || item.itemCaption.trim().length < 40) continue;
        if (
          item.title.includes('（コミック）') ||
          item.title.includes('【コミック】') ||
          item.title.includes('【分冊版】') ||
          item.title.includes('単話') ||
          item.title.includes('合本')
        ) {
          continue;
        }
        if (!foundCandidates.has(slug)) {
          foundCandidates.set(slug, item);
        }
      }
    } catch (e) {
      console.error(`Error with ${JSON.stringify(q)}:`, e.message);
    }
    await sleep(1100);
  }

  const allItems = Array.from(foundCandidates.values());
  const parseDate = (s) => {
    const m = String(s || '').match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);
    if (!m) return 0;
    return Number(m[1]) * 10000 + Number(m[2]) * 100 + Number(m[3]);
  };
  allItems.sort((a, b) => parseDate(b.salesDate) - parseDate(a.salesDate));

  const released = allItems.filter(b => parseDate(b.salesDate) <= 20261123 && parseDate(b.salesDate) >= 20261101);
  console.log(`\n未登録の2026年11月発売済み候補: ${released.length} 冊 (全体未登録: ${allItems.length} 冊)`);
  console.log('\n--- 発売済み最新ラノベ Top 30 ---');
  released.slice(0, 30).forEach((b, idx) => {
    console.log(`${idx + 1}. [${b.salesDate}] ${b.title} | 著: ${b.author} | 出版: ${b.publisherName} | ${b.itemPrice}円 | slug: ${b.itemNumber}`);
  });

  await fs.writeFile(
    path.join(root, 'scripts/temp_candidates_nov23.json'),
    JSON.stringify(released.slice(0, 40), null, 2),
    'utf8'
  );
}

main().catch(console.error);
