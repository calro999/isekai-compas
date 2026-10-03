import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const POPULAR_TAGS = [
  'すべて',
  '追放・ざまぁ',
  '悪役令嬢',
  'スローライフ',
  '最強主人公',
  '転生・転移',
  'ダンジョン',
  '内政・建国',
  'もふもふ',
  '勘違い・コメディ',
  'アニメ化'
]

const DIAGNOSIS_TYPES = {
  musou: {
    name: '圧倒的無双・スカッと爽快型',
    desc: '日頃のストレスを吹き飛ばす、圧倒的な力と知恵で理不尽を叩き潰す物語がぴったり！',
    keywords: ['無双', '最強', 'チート', 'ざまぁ', '追放']
  },
  slowlife: {
    name: 'ほのぼの癒やし・スローライフ型',
    desc: '美味しいご飯や愛らしいもふもふに囲まれ、マイペースに暮らす至福の異世界生活がおすすめ！',
    keywords: ['スローライフ', 'もふもふ', '料理', 'メシ', '食堂', 'のんびり', '農業']
  },
  brain: {
    name: '緻密な伏線・頭脳戦＆内政型',
    desc: '現代知識での領地改革や、練り込まれた世界観と心理戦で魅せる重厚なドラマが刺さる！',
    keywords: ['内政', '薬屋', '頭脳', '建国', '外交', '考察', 'ゼロから']
  },
  villainess: {
    name: '逆転劇・華麗なる悪役令嬢型',
    desc: '断罪イベントを回避し、自らの才覚と魅力で新たな未来を切り拓く痛快ストーリー！',
    keywords: ['悪役令嬢', '破滅', '令嬢', '婚約破棄', '溺愛']
  }
}

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>
}

function App() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('すべて')
  const [sortBy, setSortBy] = useState('recommended') // 'recommended' | 'newest' | 'title'
  const [saved, setSaved] = useState(() => {
    try {
      const stored = localStorage.getItem('isekai_saved_books')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [isSavedOpen, setIsSavedOpen] = useState(false)
  const [compareList, setCompareList] = useState([])

  useEffect(() => {
    try {
      localStorage.setItem('isekai_saved_books', JSON.stringify(saved))
    } catch (e) {
      console.warn('LocalStorage save error:', e)
    }
  }, [saved])

  useEffect(() => {
    const loadData = async () => {
      if (window.__INITIAL_DATA__ && Array.isArray(window.__INITIAL_DATA__)) {
        setBooks(window.__INITIAL_DATA__)
        return
      }
      try {
        let res = await fetch('/data/books.json')
        if (!res.ok) res = await fetch('./data/books.json')
        if (res.ok) {
          const items = await res.json()
          setBooks(items.filter(book => book.slug && book.title))
        }
      } catch (e) {
        console.warn('Failed to load books.json:', e)
      }
    }
    loadData()
  }, [])

  const toggleSave = (book) => {
    setSaved(prev => {
      const exists = prev.some(b => b.slug === book.slug || b.title === book.title)
      if (exists) {
        return prev.filter(b => b.slug !== book.slug && b.title !== book.title)
      }
      return [...prev, book]
    })
  }

  const isBookSaved = (book) => {
    return saved.some(b => b.slug === book.slug || b.title === book.title)
  }

  const toggleCompare = (book) => {
    setCompareList(prev => {
      if (prev.some(b => b.slug === book.slug)) {
        return prev.filter(b => b.slug !== book.slug)
      }
      if (prev.length >= 2) {
        return [prev[1], book]
      }
      return [...prev, book]
    })
  }

  const filtered = useMemo(() => {
    let result = books.filter(b => {
      const text = `${b.title || ''} ${b.author || ''} ${b.genre || ''} ${(b.tags || []).join(' ')} ${b.description || ''} ${b.oneLineCatch || ''}`.toLowerCase()
      const matchesQuery = !query || text.includes(query.toLowerCase().trim())
      
      let matchesTag = true
      if (activeTag !== 'すべて') {
        if (activeTag === '追放・ざまぁ') {
          matchesTag = text.includes('追放') || text.includes('ざまぁ')
        } else if (activeTag === '転生・転移') {
          matchesTag = text.includes('転生') || text.includes('転移')
        } else if (activeTag === '勘違い・コメディ') {
          matchesTag = text.includes('勘違い') || text.includes('コメディ') || text.includes('ギャグ')
        } else if (activeTag === 'アニメ化') {
          matchesTag = Boolean(b.animeAdaptation) || text.includes('アニメ化') || text.includes('tvアニメ')
        } else {
          matchesTag = text.includes(activeTag.toLowerCase())
        }
      }
      return matchesQuery && matchesTag
    })

    if (sortBy === 'newest') {
      result.sort((a, b) => (b.salesDate || '').localeCompare(a.salesDate || ''))
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ja'))
    }

    return result
  }, [books, activeTag, query, sortBy])

  return (
    <div className="app-shell">
      {/* Top Banner Bar */}
      <div className="topline">
        <span>✨ 異世界漫画・なろう系コミック専門ナビゲーション</span>
        <span>【毎日更新】掲載作品数 {books.length ? `${books.length}冊` : '100+作品'}</span>
      </div>

      {/* Main Header */}
      <header className="header wrap">
        <a className="brand" href="/">
          <span className="brand-mark">✦</span>
          <span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span>
        </a>
        <nav className="main-nav">
          <a href="/features/">特集記事<em>HOT</em></a>
          <a href="/works/">全作品一覧</a>
          <a href="/new/">新刊速報<em>NEW</em></a>
          <a href="/tags/">タグ・世界観</a>
          <a href="/series/">シリーズ</a>
          <a href="/authors/">作者一覧</a>
          <a href="/compare/">2作品比較</a>
        </nav>
        <div className="header-actions">
          <button 
            className="search-trigger" 
            onClick={() => document.querySelector('.hero-search input')?.focus()}
            aria-label="検索バーに移動"
          >
            <Icon>⌕</Icon>
            <span>作品・作者を検索</span>
            <kbd>⌘ K</kbd>
          </button>
          <button 
            className="saved-btn" 
            onClick={() => setIsSavedOpen(true)}
            aria-label="保存したお気に入り作品一覧を見る"
          >
            <Icon>♡</Icon>
            {saved.length > 0 && <span>{saved.length}</span>}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main id="top">
        <section className="hero wrap">
          <div className="hero-copy">
            <div className="eyebrow"><span className="spark">✦</span> 異世界コミック専門ナビゲーション</div>
            <h1>次にハマる異世界を、<br /><i>世界観と気分</i>から選ぼう。</h1>
            <p>
              「追放ざまぁ」「悪役令嬢」「スローライフ」「もふもふ内政」…<br />
              膨大な作品の中から、あなたの今の気分にドンピシャな物語を案内します。
            </p>
            <div className="hero-search">
              <Icon>⌕</Icon>
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="作品名・作者名・世界観（例: 追放, 悪役令嬢, 料理）で検索"
              />
              {query && (
                <button className="clear-btn" onClick={() => setQuery('')} aria-label="検索クリア">✕</button>
              )}
              <button onClick={() => {
                const el = document.getElementById('discover')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}>探す</button>
            </div>
            <div className="popular">
              <span>POPULAR</span>
              {['追放・ざまぁ', '悪役令嬢', 'スローライフ', '最強主人公', 'アニメ化'].map(t => (
                <button 
                  key={t} 
                  className={activeTag === t ? 'active' : ''}
                  onClick={() => {
                    setActiveTag(t)
                    const el = document.getElementById('discover')
                    el?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="hero-art">
            <div className="moon"></div>
            <div className="mountain back"></div>
            <div className="mountain front"></div>
            <div className="castle"><span>♜</span></div>
            <div className="hero-card">
              <span className="mini-label">TODAY'S SPECIAL</span>
              <strong>世界観にどっぷり浸る、<br />至高の1冊を。</strong>
              <span className="card-arrow">↗</span>
            </div>
            <div className="orb orb-one"></div>
            <div className="orb orb-two"></div>
          </div>
        </section>

        {/* 1秒適性診断コンポーネント */}
        <DiagnosisWidget books={books} />

        {/* 作品一覧 & フィルターセクション */}
        <section className="section wrap" id="discover">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">DISCOVER WORKS</span>
              <h2>作品を探す・絞り込む</h2>
              <p>該当作品：<strong>{filtered.length}</strong> 件</p>
            </div>
            <div className="sort-controls">
              <label htmlFor="sort-select">並び順：</label>
              <select 
                id="sort-select"
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="recommended">おすすめ順</option>
                <option value="newest">新刊・発売日順</option>
                <option value="title">五十音順</option>
              </select>
            </div>
          </div>

          {/* タグフィルターバー */}
          <div className="tag-filter-bar">
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                className={`filter-chip ${activeTag === tag ? 'active' : ''}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 作品カードグリッド */}
          <div className="book-grid grid-4">
            {filtered.slice(0, 16).map(book => (
              <BookCard 
                key={book.id || book.slug || book.title} 
                book={book} 
                saved={isBookSaved(book)} 
                onSave={() => toggleSave(book)}
                inCompare={compareList.some(b => b.slug === book.slug)}
                onToggleCompare={() => toggleCompare(book)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="empty-state">
                <p>条件に一致する作品が見つかりませんでした。</p>
                <button onClick={() => { setActiveTag('すべて'); setQuery(''); }}>検索条件をリセット</button>
              </div>
            )}
          </div>

          {filtered.length > 16 && (
            <div className="more-action">
              <a className="primary-btn" href="/works/">
                全{filtered.length}件の作品をもっと見る <span>→</span>
              </a>
            </div>
          )}
        </section>

        {/* クォートバンド */}
        <section className="quote-band">
          <div className="quote-inner wrap">
            <span className="quote-mark">“</span>
            <div>
              <p>ランキングの波に埋もれた、<br /><strong>本当に読みたかった異世界</strong>に出会える場所。</p>
            </div>
            <span className="quote-note">FIND YOUR<br />FAVORITE WORLD</span>
          </div>
        </section>

        {/* 新刊・注目作タイムライン */}
        <section className="section wrap" id="new">
          <div className="section-heading compact">
            <div>
              <span className="eyebrow dark">NEW & POPULAR RELEASES</span>
              <h2>新刊速報・ピックアップ</h2>
            </div>
            <a className="text-link" href="/new/">新刊一覧をすべて見る <span>→</span></a>
          </div>
          <div className="release-list">
            {books.slice(0, 8).map((book, i) => (
              <div className="release-row" key={book.id || book.slug || book.title}>
                <span className="release-no">0{i + 1}</span>
                <img src={book.cover} alt={`${book.title}の表紙`} loading="lazy" />
                <div className="release-info">
                  <span className="tag-pill">{book.badge || '注目'}</span>
                  <h3><a href={`/works/${book.slug}/`}>{book.title}</a></h3>
                  <p>{book.author}　·　{book.genre}</p>
                </div>
                <span className="release-date">{book.salesDate || '好評発売中'}</span>
                <div className="release-actions">
                  {book.affiliateUrl && (
                    <a 
                      href={book.affiliateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="kobo-read-btn"
                    >
                      楽天Kobo ↗
                    </a>
                  )}
                  <a className="circle-arrow" href={`/works/${book.slug}/`} aria-label={`${book.title}の詳細`}>↗</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 特集記事案内セクション */}
        <section className="section wrap features-preview-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">CURATED FEATURES</span>
              <h2>専門編集部による徹底特集</h2>
              <p>テーマ別に厳選した必読作品の深掘り比較レビュー</p>
            </div>
            <a className="text-link" href="/features/">特集一覧を見る <span>→</span></a>
          </div>
          <div className="feature-cards-grid">
            <a href="/features/" className="feature-card">
              <div className="feature-tag">定番名作</div>
              <h3>【2026年最新】絶対に読むべき異世界転生おすすめ漫画50選</h3>
              <p>王道ハイファンタジーから人生やり直し、大河ロマンまで完全網羅！</p>
              <span className="feature-more">特集を読む →</span>
            </a>
            <a href="/features/" className="feature-card">
              <div className="feature-tag">爽快逆転</div>
              <h3>追放・ざまぁ系おすすめ！理不尽を叩き潰す最高傑作セレクション</h3>
              <p>底辺からの覚醒、見返した時のカタルシスがたまらない名作を厳選。</p>
              <span className="feature-more">特集を読む →</span>
            </a>
            <a href="/features/" className="feature-card">
              <div className="feature-tag">癒やし満点</div>
              <h3>異世界スローライフ＆料理グルメ！ほっこり読みたいおすすめ漫画</h3>
              <p>マイペースな開拓生活ともふもふ達との癒やしの日々をお届け。</p>
              <span className="feature-more">特集を読む →</span>
            </a>
          </div>
        </section>

        {/* タグから探す */}
        <section className="tag-section">
          <div className="wrap tag-layout">
            <div>
              <span className="eyebrow dark">EXPLORE BY TAG</span>
              <h2>世界観・要素から探す</h2>
              <p>好みのシチュエーションや<br />設定タグから直感的に選べます。</p>
              <a className="text-link" href="/tags/">全タグを一覧で見る <span>→</span></a>
            </div>
            <div className="tag-cloud" id="tags">
              {POPULAR_TAGS.slice(1).map((t) => (
                <button 
                  className={activeTag === t ? 'active' : ''} 
                  key={t} 
                  onClick={() => {
                    setActiveTag(t)
                    document.getElementById('discover')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <span>#</span>{t}<b>↗</b>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 比較フローティングバー（2作品選択時） */}
      {compareList.length > 0 && (
        <div className="compare-floating-bar">
          <div className="wrap compare-bar-inner">
            <div className="compare-bar-info">
              <span>比較リスト（{compareList.length}/2）:</span>
              <strong>{compareList.map(b => b.title).join(' vs ')}</strong>
            </div>
            <div className="compare-bar-actions">
              {compareList.length === 2 && (
                <a 
                  className="compare-go-btn" 
                  href={`/compare/${compareList[0].slug}-vs-${compareList[1].slug}/`}
                >
                  この2作品を徹底比較する ⚔️
                </a>
              )}
              <button className="compare-clear-btn" onClick={() => setCompareList([])}>クリア</button>
            </div>
          </div>
        </div>
      )}

      {/* お気に入りドロワーモーダル */}
      {isSavedOpen && (
        <div className="modal-overlay" onClick={() => setIsSavedOpen(false)}>
          <div className="saved-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>お気に入り保存した作品 ({saved.length})</h3>
              <button className="close-btn" onClick={() => setIsSavedOpen(false)}>✕</button>
            </div>
            <div className="drawer-body">
              {saved.length === 0 ? (
                <div className="drawer-empty">
                  <p>まだお気に入りに保存された作品はありません。</p>
                  <p className="subtext">気になる作品のハートアイコン（♡）を押してブックマークできます。</p>
                </div>
              ) : (
                <div className="saved-items-list">
                  {saved.map(b => (
                    <div key={b.slug || b.title} className="saved-item-row">
                      <img src={b.cover} alt={b.title} />
                      <div className="saved-item-info">
                        <h4><a href={`/works/${b.slug}/`}>{b.title}</a></h4>
                        <p>{b.author}</p>
                        {b.affiliateUrl && (
                          <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer" className="kobo-mini-link">
                            楽天Koboで読む ↗
                          </a>
                        )}
                      </div>
                      <button className="remove-saved-btn" onClick={() => toggleSave(b)} title="保存解除">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="wrap footer-inner">
          <a className="brand light" href="#top">
            <span className="brand-mark">✦</span>
            <span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span>
          </a>
          <div className="footer-links">
            <a href="/features/">おすすめ特集</a>
            <a href="/works/">全作品一覧</a>
            <a href="/new/">新刊速報</a>
            <a href="/tags/">世界観タグ</a>
            <a href="/series/">シリーズ</a>
            <a href="/authors/">作者一覧</a>
            <a href="/compare/">作品比較</a>
          </div>
          <span className="copyright">© 2026 ISEKAI COMPASS. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}

function BookCard({ book, saved, onSave, inCompare, onToggleCompare }) {
  return (
    <article className="book-card vertical">
      <div className="cover-wrap-vert">
        <a href={`/works/${book.slug}/`}>
          <img src={book.cover} alt={`${book.title}の表紙画像`} loading="lazy" />
        </a>
        <span className={'cover-badge ' + (book.color || 'gold')}>{book.badge || '注目作'}</span>
        <button 
          className={'save ' + (saved ? 'is-saved' : '')} 
          onClick={(e) => { e.preventDefault(); onSave(); }} 
          aria-label={saved ? 'お気に入りから削除' : 'お気に入りに保存'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="book-meta-vert">
        <div className="book-top-tags">
          <span className="genre">{book.genre}</span>
          {book.animeAdaptation && <span className="anime-badge">TVアニメ化</span>}
        </div>
        <h3><a href={`/works/${book.slug}/`}>{book.title}</a></h3>
        <p className="author">{book.author}</p>
        
        {book.oneLineCatch && (
          <p className="one-line-catch">「{book.oneLineCatch}」</p>
        )}

        <div className="book-bottom-vert">
          <a className="detail-btn" href={`/works/${book.slug}/`}>
            詳細レビュー ↗
          </a>
          {book.affiliateUrl && (
            <a 
              className="kobo-buy-btn" 
              href={book.affiliateUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              title="楽天Kobo電子書籍ストアで試し読み・購入"
            >
              電子版 ↗
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function DiagnosisWidget({ books }) {
  const [selectedMood, setSelectedMood] = useState('musou')

  const currentType = DIAGNOSIS_TYPES[selectedMood]

  const matched = useMemo(() => {
    if (!books.length) return []
    const keywords = currentType.keywords
    return books.filter(b => {
      const text = `${b.title} ${b.genre} ${b.description} ${(b.tags || []).join(' ')} ${b.oneLineCatch || ''}`.toLowerCase()
      return keywords.some(kw => text.includes(kw.toLowerCase()))
    }).slice(0, 3)
  }, [books, selectedMood])

  const shareText = `【異世界コンパス 1秒適性診断】私のタイプは「${currentType.name}」でした！おすすめ作品：${matched.map(m => `『${m.title}』`).slice(0, 2).join(' ')} #異世界コンパス #異世界漫画`
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://isekai-compas.vercel.app/')}`

  return (
    <section className="section wrap diagnosis-container">
      <div className="diagnosis-box">
        <div className="diagnosis-header">
          <span className="eyebrow dark">INTERACTIVE DIAGNOSIS</span>
          <h2>🎯 あなたにぴったりの異世界 1秒適性診断</h2>
          <p>「今どんな気分で楽しみたい？」を選ぶだけで、絶対にハマるおすすめ作品をナビゲート！</p>
        </div>

        <div className="diagnosis-selector">
          {Object.entries(DIAGNOSIS_TYPES).map(([key, item]) => (
            <button
              key={key}
              className={`diagnosis-tab ${selectedMood === key ? 'active' : ''}`}
              onClick={() => setSelectedMood(key)}
            >
              <span className="tab-title">{item.name.split('・')[0]}</span>
              <span className="tab-sub">{item.name.split('・')[1]}</span>
            </button>
          ))}
        </div>

        <div className="diagnosis-result-area">
          <div className="result-badge-row">
            <div className="result-title-group">
              <span className="result-label">診断結果タイプ</span>
              <h3>✨ {currentType.name}</h3>
              <p className="result-desc">{currentType.desc}</p>
            </div>
            <a 
              href={shareUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="x-share-btn"
              title="診断結果をX（Twitter）でシェア"
            >
              <span>𝕏</span> 結果をシェア
            </a>
          </div>

          <div className="result-books-grid">
            {matched.map(b => (
              <div key={b.id || b.slug || b.title} className="result-book-card">
                <a href={`/works/${b.slug}/`} className="result-cover-link">
                  <img src={b.cover} alt={b.title} loading="lazy" />
                </a>
                <div className="result-book-info">
                  <span className="result-book-genre">{b.genre}</span>
                  <h4><a href={`/works/${b.slug}/`}>{b.title}</a></h4>
                  <p className="result-author">{b.author}</p>
                  <div className="result-card-actions">
                    <a href={`/works/${b.slug}/`} className="result-detail-link">解説を見る →</a>
                    {b.affiliateUrl && (
                      <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer" className="result-kobo-link">
                        楽天Koboで読む ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

createRoot(document.getElementById('root')).render(<App />)
