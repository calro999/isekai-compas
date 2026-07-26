import fs from 'node:fs/promises';

const normalizeTitle = (value) => String(value || '').replace(/[\s　「」『』（）()！？!?・:：～〜]/g, '').toLowerCase();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function rakutenSeriesSearch(keyword, page = 1) {
  const params = new URLSearchParams({
    applicationId: process.env.RAKUTEN_APPLICATION_ID,
    accessKey: process.env.RAKUTEN_ACCESS_KEY,
    format: 'json', formatVersion: '2', keyword, koboGenreId: '101',
    hits: '30', page: String(page)
  });
  const response = await fetch(`https://openapi.rakuten.co.jp/services/api/Kobo/EbookSearch/20170426?${params}`);
  const json = await response.json();
  return json.Items || json.items || [];
}

async function fetchSeriesVolumes(book) {
  const baseTitle = book.seriesName || book.title.split('〜')[0].split('（')[0].split('(')[0].replace(/第?\d+巻?/, '').trim()
  try {
    let allItems = []
    let page = 1
    while (page <= 10) { 
      const items = await rakutenSeriesSearch(baseTitle, page)
      if (!items || items.length === 0) break
      allItems.push(...items)
      if (items.length < 30) break
      page++
      await sleep(200)
    }
    
    if (allItems.length === 0) throw new Error('No items found')
    
    let filtered = allItems.filter(item => !item.title.includes('【分冊版】') && (item.seriesName === book.seriesName || item.title.includes(baseTitle)))
    if (filtered.length === 0) filtered = allItems.filter(item => item.seriesName === book.seriesName || item.title.includes(baseTitle))
    
    const collator = new Intl.Collator('ja', { numeric: true, sensitivity: 'base' })
    filtered.sort((a, b) => collator.compare(a.title, b.title))
    
    const unique = []
    const seenTitles = new Set()
    for (const item of filtered) {
      const simplifiedTitle = normalizeTitle(item.title)
      if (!seenTitles.has(simplifiedTitle)) {
        seenTitles.add(simplifiedTitle)
        unique.push(item)
      }
    }

    return unique.map(i => i.title);

  } catch (e) {
    return [book.title];
  }
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

  const books = JSON.parse(await fs.readFile('public/data/books.json', 'utf8'));
  const testBook = books.find(b => b.title.includes('俺、勇者じゃないですから'));
  console.log('Testing book:', testBook.title);
  const vols = await fetchSeriesVolumes(testBook);
  console.log('Volumes found:', vols.length);
  vols.forEach(v => console.log(v));
}
run();
