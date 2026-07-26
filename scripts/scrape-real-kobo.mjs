import fs from 'node:fs/promises'

const queries = [
  { id: '4333912900320', name: '無職転生 〜異世界行ったら本気だす〜 24', search: '無職転生 24 コミック' },
  { id: 'seed-tensura', name: '転生したらスライムだった件 24', search: '転生したらスライムだった件 24 漫画' },
  { id: 'seed-houro-meshi', name: 'とんでもスキルで異世界放浪メシ 10', search: 'とんでもスキルで異世界放浪メシ 10' },
  { id: '6671308504690', name: '転生したけどステータス「魅力」に全振り！？ (114)', search: '転生したけどステータス 魅力 に全振り' },
  { id: '4390000014619', name: '【分冊版】俺、勇者じゃないですから。 (95)', search: '俺 勇者じゃないですから 95' },
  { id: '4390000014618', name: '【分冊版】俺、勇者じゃないですから。 (94)', search: '俺 勇者じゃないですから 94' },
  { id: '4390000021594', name: '陰の実力者になりたくて！ (6)', search: '陰の実力者になりたくて 6' },
  { id: '4988601550993', name: '薬屋のひとりごと (13)', search: '薬屋のひとりごと 13' },
  { id: '4333912911220', name: 'オーバーロード (16) 半森妖精の神人 [下]', search: 'オーバーロード 16' },
  { id: '4333912954310', name: 'Re：ゼロから始める異世界生活 (37)', search: 'Re ゼロから始める異世界生活 37' },
  { id: '4864724890012', name: '本好きの下剋上 第五部「女神の化身12」', search: '本好きの下剋上 女神の化身 12' },
  { id: '4758032110023', name: '乙女ゲームの破滅フラグしかない悪役令嬢に転生してしまった… (13)', search: '乙女ゲームの破滅フラグ 13' },
  { id: '4091435210014', name: '説得のいらない異世界無双 (1)', search: '説得のいらない異世界無双 1' },
  { id: '4040645010045', name: '治癒魔法の間違った使い方〜戦場をかける回復要員〜 (13)', search: '治癒魔法の間違った使い方 13' },
  { id: '4046834110067', name: '異世界おじさん (11)', search: '異世界おじさん 11' },
  { id: '4824001110078', name: 'ありふれた職業で世界最強 (13)', search: 'ありふれた職業で世界最強 13' }
]

async function run() {
  const resultData = {}

  for (const item of queries) {
    console.log(`Fetch: ${item.name}...`)
    try {
      const url = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.search)}/`
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' } })
      const html = await res.text()

      // 画像抽出
      const imgMatches = [...html.matchAll(/(https:\/\/thumbnail\.image\.rakuten\.co\.jp\/@0_mall\/[^\s"'\?]+\.(?:jpg|jpeg|png))/gi)]
      // 商品URL抽出
      const linkMatches = [...html.matchAll(/(https:\/\/(?:item|books)\.rakuten\.co\.jp\/[^\s"']+)/gi)]

      let image = imgMatches.length > 0 ? imgMatches[0][1] + '?_ex=300x300' : null
      let link = linkMatches.length > 0 ? linkMatches[0][1] : null

      console.log(`  -> Image: ${image}`)
      console.log(`  -> Link: ${link}`)

      resultData[item.id] = { image, link }
    } catch (e) {
      console.error(`  -> Failed: ${e.message}`)
    }
  }

  await fs.writeFile('./scripts/real-scraped-data.json', JSON.stringify(resultData, null, 2))
  console.log('Saved scraped real data.')
}

run()
