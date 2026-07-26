import fs from 'node:fs/promises'

async function findOreYushaCovers() {
  const url95 = 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent('俺 勇者じゃないですから 95')
  const res95 = await fetch(url95, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } })
  const html95 = await res95.text()
  const img95Matches = [...html95.matchAll(/(https:\/\/thumbnail\.image\.rakuten\.co\.jp\/@0_mall\/[^\s"'\?]+\.(?:jpg|jpeg|png))/gi)]

  const url94 = 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent('俺 勇者じゃないですから 94')
  const res94 = await fetch(url94, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } })
  const html94 = await res94.text()
  const img94Matches = [...html94.matchAll(/(https:\/\/thumbnail\.image\.rakuten\.co\.jp\/@0_mall\/[^\s"'\?]+\.(?:jpg|jpeg|png))/gi)]

  console.log('95話候補:', img95Matches.slice(0, 3).map(m => m[1]))
  console.log('94話候補:', img94Matches.slice(0, 3).map(m => m[1]))
}

findOreYushaCovers()
