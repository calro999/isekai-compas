import fs from 'node:fs/promises';

async function rakutenSearchSeries(keyword) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    format: 'json', formatVersion: '2', keyword,
    hits: '30'
  });
  const response = await fetch(`https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`);
  const json = await response.json();
  return json.Items || json.items || [];
}

async function run() {
  const envContent = await fs.readFile('.env', 'utf8').catch(() => '')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [k, ...v] = trimmed.split('=')
      process.env[k.trim()] = v.join('=').trim()
    }
  }

  let allItems = [];
  for (let page = 1; page <= 3; page++) {
    const items = await rakutenSearchSeries('俺、勇者じゃないですから');
    if (!items || items.length === 0) break;
    allItems.push(...items);
    if (items.length < 30) break;
  }
  
  let filtered = allItems.filter(item => !item.title.includes('【分冊版】'));
  console.log('Total returned:', allItems.length);
  console.log('Filtered exact series:', filtered.length);
  filtered.forEach(f => console.log(f.title));
}
run();
