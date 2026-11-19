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

function buildRakutenSearchAffiliateUrl(keyword, affiliateId) {
  const targetUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;
  return `https://hb.afl.rakuten.co.jp/hgc/${affiliateId}/?pc=${encodeURIComponent(targetUrl)}&m=${encodeURIComponent(targetUrl)}`;
}

async function main() {
  await loadEnv();
  const affiliateId = process.env.RAKUTEN_AFFILIATE_ID || 'g00reb4n.j9rugb74.g00reb4n.j9ruhe6f';
  console.log(`[Fix] 使用する楽天アフィリエイトID: ${affiliateId}`);

  // 1. books.json のロードとマップ作成
  const booksPath = path.join(root, 'public/data/books.json');
  const books = JSON.parse(await fs.readFile(booksPath, 'utf8'));

  const titleMap = new Map();
  for (const b of books) {
    if (b.title) {
      const norm = b.title.replace(/\s+/g, '').toLowerCase();
      titleMap.set(norm, b);
      titleMap.set(b.title.trim().toLowerCase(), b);
    }
  }

  function findBook(title) {
    if (!title) return null;
    const clean = title.trim().toLowerCase();
    if (titleMap.has(clean)) return titleMap.get(clean);
    const noSpace = clean.replace(/\s+/g, '');
    if (titleMap.has(noSpace)) return titleMap.get(noSpace);
    
    // 部分一致
    for (const [k, b] of titleMap.entries()) {
      if (k.length > 3 && (noSpace.includes(k) || k.includes(noSpace))) {
        return b;
      }
    }
    return null;
  }

  // 2. curated-features.json の修正
  console.log('[Fix] public/data/curated-features.json の修復開始...');
  const featuresPath = path.join(root, 'public/data/curated-features.json');
  const features = JSON.parse(await fs.readFile(featuresPath, 'utf8'));

  let fixedFeaturesCount = 0;
  for (const feat of features) {
    if (Array.isArray(feat.items)) {
      for (const item of feat.items) {
        const title = item.customTitle || item.title || item.keyword;
        const matched = findBook(title);

        if (!item.affiliateUrl || item.affiliateUrl === 'undefined' || !item.affiliateUrl.includes('hb.afl.rakuten.co.jp')) {
          if (matched && matched.affiliateUrl) {
            item.affiliateUrl = matched.affiliateUrl;
          } else {
            item.affiliateUrl = buildRakutenSearchAffiliateUrl(title, affiliateId);
          }
          fixedFeaturesCount++;
        }

        if (!item.cover || item.cover === 'undefined' || item.cover === '') {
          if (matched && (matched.cover || matched.largeImageUrl || matched.coverImage)) {
            item.cover = matched.cover || matched.largeImageUrl || matched.coverImage;
          } else if (item.largeImageUrl && item.largeImageUrl !== 'undefined') {
            item.cover = item.largeImageUrl;
          } else {
            item.cover = 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/4366/2000022024366.jpg?_ex=200x200';
          }
        }
      }
    }
  }
  await fs.writeFile(featuresPath, JSON.stringify(features, null, 2), 'utf8');
  console.log(`  -> curated-features.json 修復完了 (修正アイテム数: ${fixedFeaturesCount})`);

  // 3. public/features/*/index.html の走査と修復
  console.log('[Fix] public/features/*/index.html のHTML走査と修復開始...');
  const featBaseDir = path.join(root, 'public/features');
  const dirEntries = await fs.readdir(featBaseDir, { withFileTypes: true });

  let fixedHtmlCount = 0;
  let totalFixedLinks = 0;

  for (const entry of dirEntries) {
    if (!entry.isDirectory()) continue;
    const htmlPath = path.join(featBaseDir, entry.name, 'index.html');
    let content = '';
    try {
      content = await fs.readFile(htmlPath, 'utf8');
    } catch (e) {
      continue;
    }

    if (!content.includes('href="undefined"') && !content.includes('src="undefined"')) {
      continue;
    }

    let modified = false;

    // セクションごとに解析して置換
    // <section class="feature-item-section" id="work-..."> ... </section>
    content = content.replace(/(<section[^>]*class="feature-item-section"[^>]*>[\s\S]*?<\/section>)/g, (section) => {
      // 作品タイトルを抽出
      const titleMatch = section.match(/<h2[^>]*class="feature-work-title"[^>]*>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<\/h2>/);
      const title = titleMatch ? titleMatch[1].trim() : '';

      let newSection = section;

      if (newSection.includes('href="undefined"')) {
        const matched = findBook(title);
        const affUrl = (matched && matched.affiliateUrl) ? matched.affiliateUrl : buildRakutenSearchAffiliateUrl(title || '異世界ラノベ', affiliateId);
        newSection = newSection.replaceAll('href="undefined"', `href="${affUrl}"`);
        totalFixedLinks++;
        modified = true;
      }

      if (newSection.includes('src="undefined"')) {
        const matched = findBook(title);
        const coverUrl = (matched && (matched.cover || matched.largeImageUrl || matched.coverImage)) 
          ? (matched.cover || matched.largeImageUrl || matched.coverImage)
          : 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/4366/2000022024366.jpg?_ex=200x200';
        newSection = newSection.replaceAll('src="undefined"', `src="${coverUrl}"`);
        modified = true;
      }

      return newSection;
    });

    // それでも残っている単発の href="undefined" があればフォールバック置換
    if (content.includes('href="undefined"')) {
      const fallbackUrl = buildRakutenSearchAffiliateUrl('ライトノベル', affiliateId);
      content = content.replaceAll('href="undefined"', `href="${fallbackUrl}"`);
      modified = true;
    }
    if (content.includes('src="undefined"')) {
      const fallbackCover = 'https://thumbnail.image.rakuten.co.jp/@0_mall/rakutenkobo-ebooks/cabinet/4366/2000022024366.jpg?_ex=200x200';
      content = content.replaceAll('src="undefined"', `src="${fallbackCover}"`);
      modified = true;
    }

    if (modified) {
      await fs.writeFile(htmlPath, content, 'utf8');
      fixedHtmlCount++;
    }
  }

  console.log(`[Fix] HTML修復完了: 修正した特集記事HTML ${fixedHtmlCount} 件 (置換リンク数: ${totalFixedLinks})`);
}

main().catch(console.error);
