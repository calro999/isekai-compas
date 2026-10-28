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

async function searchRakuten(titleQuery) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    affiliateId: process.env.RAKUTEN_AFFILIATE_ID,
    format: 'json',
    formatVersion: '2',
    title: titleQuery,
    koboGenreId: '101', // 電子書籍・本
    hits: '5',
    sort: '-releaseDate'
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

  const candidates = [
    'スライム倒して300年、知らないうちにレベルMAXになってました 30',
    'ひとりぼっちの異世界攻略 life.19',
    '時々ボソッとロシア語でデレる隣のアーリャさん 12',
    '青春ブタ野郎はドクターピッグの夢を見ない',
    '狼と香辛料 XXV Spring Log VIII',
    '週に一度クラスメイトを買う話 10',
    '攻撃力ゼロから始める剣聖譚 7'
  ];

  console.log('--- Querying Rakuten API for candidate light novels ---');
  const results = [];

  for (const query of candidates) {
    console.log(`Searching for: "${query}"...`);
    try {
      const items = await searchRakuten(query);
      if (items.length > 0) {
        const item = items[0];
        console.log(` -> Found: [${item.title}] by [${item.author}] (SalesDate: ${item.salesDate}, ItemNumber: ${item.itemNumber})`);
        results.push(item);
      } else {
        console.log(` -> No items found for "${query}"`);
      }
    } catch (e) {
      console.error(` -> Error searching "${query}":`, e.message);
    }
    await sleep(1200);
  }

  await fs.writeFile(path.join(root, 'scripts/temp_research_5books.json'), JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nSuccessfully saved ${results.length} books to scripts/temp_research_5books.json`);
}

main().catch(console.error);
