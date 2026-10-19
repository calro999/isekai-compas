import React, { useEffect, useMemo, useState, useRef } from 'react'
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
    id: 'musou',
    name: '圧倒的無双・スカッと爽快型',
    desc: '日頃のストレスを吹き飛ばす、圧倒的な力と知恵で理不尽を叩き潰す物語がぴったり！',
    keywords: ['無双', '最強', 'チート', 'ざまぁ', '追放', '圧倒']
  },
  slowlife: {
    id: 'slowlife',
    name: 'ほのぼの癒やし・スローライフ型',
    desc: '美味しいご飯や愛らしいもふもふに囲まれ、マイペースに暮らす至福の異世界生活がおすすめ！',
    keywords: ['スローライフ', 'もふもふ', '料理', 'メシ', '食堂', 'のんびり', '農業', '喫茶']
  },
  brain: {
    id: 'brain',
    name: '緻密な伏線・頭脳戦＆内政型',
    desc: '現代知識での領地改革や、練り込まれた世界観と心理戦で魅せる重厚なドラマが刺さる！',
    keywords: ['内政', '薬屋', '頭脳', '建国', '外交', '考察', 'ゼロから', '戦略']
  },
  villainess: {
    id: 'villainess',
    name: '逆転劇・華麗なる悪役令嬢型',
    desc: '断罪イベントを回避し、自らの才覚と魅力で新たな未来を切り拓く痛快ストーリー！',
    keywords: ['悪役令嬢', '破滅', '令嬢', '婚約破棄', '溺愛', 'ざまぁ']
  }
}

// 3問ステップ診断用の質問データ
const QUIZ_QUESTIONS = [
  {
    question: 'Q1. 今日の気分に一番近いのは？',
    options: [
      { text: 'スカッと爽快！理不尽を見返したい', type: 'musou' },
      { text: '疲れた心を癒やしてのんびりしたい', type: 'slowlife' },
      { text: 'じっくり練られた世界観・知略を楽しみたい', type: 'brain' },
      { text: '運命の理不尽を華麗に覆すドラマが見たい', type: 'villainess' }
    ]
  },
  {
    question: 'Q2. 主人公に求めるポジションは？',
    options: [
      { text: '最初から（あるいは覚醒して）圧倒的なチート能力', type: 'musou' },
      { text: 'マイペースで穏やか、周囲に愛される存在', type: 'slowlife' },
      { text: '現代の知識や策略を武器にする知性派', type: 'brain' },
      { text: '破滅フラグに立ち向かい、周りを惹きつける令嬢', type: 'villainess' }
    ]
  },
  {
    question: 'Q3. 物語で最もワクワクする要素は？',
    options: [
      { text: '傲慢な元仲間や敵をぎゃふんと言わせるカタルシス', type: 'musou' },
      { text: '美味しそうな異世界料理と可愛いもふもふ達', type: 'slowlife' },
      { text: '荒廃した領地や国が発展していくシミュレーション感', type: 'brain' },
      { text: '断罪を回避した先の溺愛ルートや真の幸せ', type: 'villainess' }
    ]
  }
]

function Icon({ children }) {
  return <span className="icon" aria-hidden="true">{children}</span>
}

function Toast({ message, visible }) {
  if (!visible) return null
  return (
    <div className="toast-notification" role="status" aria-live="polite">
      <span>{message}</span>
    </div>
  )
}

function App() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('すべて')
  const [onlyAnime, setOnlyAnime] = useState(false)
  const [sortBy, setSortBy] = useState('recommended') // 'recommended' | 'newest' | 'title'
  const [displayCount, setDisplayCount] = useState(16)
  
  // テーマ管理 (ダーク / ライト)
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('isekai_theme')
      if (savedTheme) return savedTheme
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    } catch {
      return 'dark'
    }
  })

  // お気に入り
  const [saved, setSaved] = useState(() => {
    try {
      const stored = localStorage.getItem('isekai_saved_books')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // 閲覧履歴
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('isekai_history_books')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [activeDrawerTab, setActiveDrawerTab] = useState('saved') // 'saved' | 'history'
  const [isSavedOpen, setIsSavedOpen] = useState(false)
  const [compareList, setCompareList] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const searchInputRef = useRef(null)
  const toastTimeoutRef = useRef(null)

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current)
    setToastMessage(msg)
    setToastVisible(true)
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false)
    }, 2800)
  }

  // テーマ適用
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('isekai_theme', theme)
    } catch (e) {
      console.warn('LocalStorage theme save error:', e)
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // お気に入り同期
  useEffect(() => {
    try {
      localStorage.setItem('isekai_saved_books', JSON.stringify(saved))
    } catch (e) {
      console.warn('LocalStorage save error:', e)
    }
  }, [saved])

  // 閲覧履歴同期
  useEffect(() => {
    try {
      localStorage.setItem('isekai_history_books', JSON.stringify(history))
    } catch (e) {
      console.warn('LocalStorage history error:', e)
    }
  }, [history])

  // スクロール検知 & プログレスバー
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (windowHeight > 0) {
        setScrollProgress((totalScroll / windowHeight) * 100)
      }
      setShowScrollTop(totalScroll > 320)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // グローバルショートカットキー (⌘K / Ctrl+K, ESC)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchModalOpen(true)
      } else if (e.key === 'Escape') {
        setIsSearchModalOpen(false)
        setIsSavedOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // データロード
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

  // 閲覧履歴に追加するハンドラ
  const recordView = (book) => {
    if (!book || !book.slug) return
    setHistory(prev => {
      const filtered = prev.filter(b => b.slug !== book.slug)
      return [book, ...filtered].slice(0, 15) // 最大15件
    })
  }

  // お気に入り切り替え
  const toggleSave = (book) => {
    setSaved(prev => {
      const exists = prev.some(b => b.slug === book.slug || b.title === book.title)
      if (exists) {
        showToast(`「${book.title}」をお気に入りから解除しました`)
        return prev.filter(b => b.slug !== book.slug && b.title !== book.title)
      }
      showToast(`♥「${book.title}」をお気に入りに保存しました！`)
      return [...prev, book]
    })
  }

  const isBookSaved = (book) => {
    return saved.some(b => b.slug === book.slug || b.title === book.title)
  }

  // 比較リスト切り替え
  const toggleCompare = (book) => {
    setCompareList(prev => {
      if (prev.some(b => b.slug === book.slug)) {
        showToast(`比較リストから解除しました`)
        return prev.filter(b => b.slug !== book.slug)
      }
      if (prev.length >= 2) {
        showToast(`比較リストを更新しました（2作品選択中）`)
        return [prev[1], book]
      }
      showToast(`⚔️ 比較リストに追加しました（${prev.length + 1}/2）`)
      return [...prev, book]
    })
  }

  // フィルタリング処理
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

      const matchesAnime = !onlyAnime || (Boolean(b.animeAdaptation) || text.includes('アニメ化') || text.includes('tvアニメ'))

      return matchesQuery && matchesTag && matchesAnime
    })

    if (sortBy === 'newest') {
      result.sort((a, b) => (b.salesDate || '').localeCompare(a.salesDate || ''))
    } else if (sortBy === 'title') {
      result.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ja'))
    }

    return result
  }, [books, activeTag, query, onlyAnime, sortBy])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // お気に入りURL共有機能
  const handleShareSaved = () => {
    if (saved.length === 0) return
    const text = `【異世界コンパス】私のお気に入り異世界漫画リスト：\n${saved.map(b => `・${b.title}`).join('\n')}\nhttps://isekai-compas.vercel.app/`
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 お気に入りリストをクリップボードにコピーしました！')
    }).catch(() => {
      showToast('コピーに失敗しました')
    })
  }

  return (
    <div className="app-shell">
      {/* スクロールプログレスバー */}
      <div 
        className="scroll-progress-bar" 
        style={{ width: `${scrollProgress}%` }} 
        aria-hidden="true" 
      />

      {/* Top Announcement Bar */}
      <div className="topline">
        <div className="topline-inner wrap">
          <span>✨ 異世界漫画・なろう系コミック専門ナビゲーション</span>
          <div className="topline-right">
            <span>【毎日更新】掲載作品数 {books.length ? `${books.length}冊` : '100+作品'}</span>
            <button 
              className="theme-toggle-btn" 
              onClick={toggleTheme} 
              aria-label={theme === 'dark' ? 'ライトテーマに切り替え' : 'ダークテーマに切り替え'}
              title={theme === 'dark' ? 'ライトテーマへ' : 'ダークテーマへ'}
            >
              {theme === 'dark' ? '☀️ ライト' : '🌙 ダーク'}
            </button>
          </div>
        </div>
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
            onClick={() => setIsSearchModalOpen(true)}
            aria-label="検索パレットを開く (⌘K)"
          >
            <Icon>⌕</Icon>
            <span>作品・作者を検索</span>
            <kbd>⌘ K</kbd>
          </button>
          <button 
            className={`saved-btn ${saved.length > 0 ? 'has-items' : ''}`}
            onClick={() => setIsSavedOpen(true)}
            aria-label="保存したお気に入り作品一覧を見る"
            title="お気に入り作品一覧"
          >
            <Icon>{saved.length > 0 ? '♥' : '♡'}</Icon>
            {saved.length > 0 && <span className="badge-count">{saved.length}</span>}
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
                ref={searchInputRef}
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="作品名・作者名・世界観（例: 追放, 悪役令嬢, 料理）で検索"
                aria-label="キーワードで作品を検索"
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

        {/* 1秒適性診断コンポーネント (クイック＆ステップの2モード搭載) */}
        <DiagnosisWidget books={books} onRecordView={recordView} showToast={showToast} />

        {/* 作品一覧 & フィルターセクション */}
        <section className="section wrap" id="discover">
          <div className="section-heading">
            <div>
              <span className="eyebrow dark">DISCOVER WORKS</span>
              <h2>作品を探す・絞り込む</h2>
              <p>該当作品：<strong>{filtered.length}</strong> 件</p>
            </div>
            <div className="filter-controls-group">
              <label className="anime-filter-toggle">
                <input 
                  type="checkbox" 
                  checked={onlyAnime} 
                  onChange={e => setOnlyAnime(e.target.checked)} 
                />
                <span>📺 アニメ化作品のみ</span>
              </label>
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
          </div>

          {/* タグフィルターバー */}
          <div className="tag-filter-bar">
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                className={`filter-chip ${activeTag === tag ? 'active' : ''}`}
                onClick={() => {
                  setActiveTag(tag)
                  setDisplayCount(16) // タグ変更時は初期件数に戻す
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* 作品カードグリッド */}
          <div className="book-grid grid-4">
            {filtered.slice(0, displayCount).map(book => (
              <BookCard 
                key={book.id || book.slug || book.title} 
                book={book} 
                saved={isBookSaved(book)} 
                onSave={() => toggleSave(book)}
                inCompare={compareList.some(b => b.slug === book.slug)}
                onToggleCompare={() => toggleCompare(book)}
                onRecordView={() => recordView(book)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>条件に一致する作品が見つかりませんでした</h3>
                <p>別のキーワードで検索するか、タグやフィルターの条件をリセットしてみてください。</p>
                <button 
                  className="reset-btn"
                  onClick={() => { 
                    setActiveTag('すべて')
                    setQuery('')
                    setOnlyAnime(false)
                  }}
                >
                  検索条件をすべてリセット
                </button>
              </div>
            )}
          </div>

          {/* さらに表示ボタン */}
          {filtered.length > displayCount && (
            <div className="load-more-container">
              <button 
                className="load-more-btn"
                onClick={() => setDisplayCount(prev => prev + 16)}
              >
                もっと見る（残り {filtered.length - displayCount} 件） ↓
              </button>
              <a className="secondary-link" href="/works/">
                全{filtered.length}件を別ページで一覧表示 →
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
                <img 
                  src={book.cover} 
                  alt={`${book.title}の表紙`} 
                  loading="lazy" 
                  width="60" 
                  height="85"
                />
                <div className="release-info">
                  <span className="tag-pill">{book.badge || '注目'}</span>
                  <h3>
                    <a 
                      href={`/works/${book.slug}/`}
                      onClick={() => recordView(book)}
                    >
                      {book.title}
                    </a>
                  </h3>
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
                      title="楽天Koboで詳細・試し読みを見る"
                    >
                      楽天Kobo ↗
                    </a>
                  )}
                  <a 
                    className="circle-arrow" 
                    href={`/works/${book.slug}/`} 
                    aria-label={`${book.title}の詳細`}
                    onClick={() => recordView(book)}
                  >
                    ↗
                  </a>
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

      {/* 比較フローティングバー（作品選択時） */}
      {compareList.length > 0 && (
        <div className="compare-floating-bar" role="dialog" aria-label="作品比較リスト">
          <div className="wrap compare-bar-inner">
            <div className="compare-bar-info">
              <span className="compare-badge">⚔️ 比較リスト ({compareList.length}/2)</span>
              <strong className="compare-titles">
                {compareList.map(b => b.title).join('  VS  ')}
              </strong>
            </div>
            <div className="compare-bar-actions">
              {compareList.length === 2 ? (
                <a 
                  className="compare-go-btn" 
                  href={`/compare/${compareList[0].slug}-vs-${compareList[1].slug}/`}
                >
                  この2作品を徹底比較する ⚔️
                </a>
              ) : (
                <span className="compare-hint">※あと1作品選んでください</span>
              )}
              <button 
                className="compare-clear-btn" 
                onClick={() => setCompareList([])}
                aria-label="比較リストをクリア"
              >
                クリア
              </button>
            </div>
          </div>
        </div>
      )}

      {/* お気に入り＆閲覧履歴 ドロワーモーダル */}
      {isSavedOpen && (
        <div className="modal-overlay" onClick={() => setIsSavedOpen(false)}>
          <div className="saved-drawer" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="お気に入り・履歴">
            <div className="drawer-header">
              <div className="drawer-tabs">
                <button 
                  className={`drawer-tab-btn ${activeDrawerTab === 'saved' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('saved')}
                >
                  ♥ お気に入り ({saved.length})
                </button>
                <button 
                  className={`drawer-tab-btn ${activeDrawerTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveDrawerTab('history')}
                >
                  🕒 閲覧履歴 ({history.length})
                </button>
              </div>
              <button className="close-btn" onClick={() => setIsSavedOpen(false)} aria-label="閉じる">✕</button>
            </div>

            <div className="drawer-body">
              {activeDrawerTab === 'saved' ? (
                saved.length === 0 ? (
                  <div className="drawer-empty">
                    <p className="empty-icon">♡</p>
                    <p>まだお気に入りに保存された作品はありません。</p>
                    <p className="subtext">作品カードのハートアイコン（♡）を押してブックマークすると、ここにストックされます。</p>
                  </div>
                ) : (
                  <div>
                    <div className="drawer-actions-bar">
                      <button className="share-list-btn" onClick={handleShareSaved}>
                        📋 お気に入りリストをコピー
                      </button>
                      <button className="clear-history-btn" onClick={() => { if(confirm('お気に入りをすべて削除しますか？')) setSaved([]); }}>
                        一括削除
                      </button>
                    </div>
                    <div className="saved-items-list">
                      {saved.map(b => (
                        <div key={b.slug || b.title} className="saved-item-row">
                          <img src={b.cover} alt={b.title} width="48" height="68" />
                          <div className="saved-item-info">
                            <h4><a href={`/works/${b.slug}/`}>{b.title}</a></h4>
                            <p>{b.author}</p>
                            {b.affiliateUrl && (
                              <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer" className="kobo-mini-link">
                                楽天Koboで読む ↗
                              </a>
                            )}
                          </div>
                          <button className="remove-saved-btn" onClick={() => toggleSave(b)} title="保存解除" aria-label="保存解除">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ) : (
                history.length === 0 ? (
                  <div className="drawer-empty">
                    <p className="empty-icon">🕒</p>
                    <p>閲覧履歴はまだありません。</p>
                    <p className="subtext">作品をチェックすると、直近の閲覧履歴が自動で記録されます。</p>
                  </div>
                ) : (
                  <div>
                    <div className="drawer-actions-bar">
                      <span className="history-count">最近閲覧した作品（{history.length}件）</span>
                      <button className="clear-history-btn" onClick={() => setHistory([])}>
                        履歴を消去
                      </button>
                    </div>
                    <div className="saved-items-list">
                      {history.map(b => (
                        <div key={b.slug || b.title} className="saved-item-row">
                          <img src={b.cover} alt={b.title} width="48" height="68" />
                          <div className="saved-item-info">
                            <h4><a href={`/works/${b.slug}/`}>{b.title}</a></h4>
                            <p>{b.author}</p>
                            {b.affiliateUrl && (
                              <a href={b.affiliateUrl} target="_blank" rel="noopener noreferrer" className="kobo-mini-link">
                                楽天Koboで読む ↗
                              </a>
                            )}
                          </div>
                          <button 
                            className={`mini-fav-btn ${isBookSaved(b) ? 'active' : ''}`} 
                            onClick={() => toggleSave(b)}
                            title={isBookSaved(b) ? 'お気に入り解除' : 'お気に入り保存'}
                          >
                            {isBookSaved(b) ? '♥' : '♡'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* ⌘K クイック検索モーダル */}
      {isSearchModalOpen && (
        <SearchModal 
          books={books} 
          onClose={() => setIsSearchModalOpen(false)}
          onRecordView={recordView}
        />
      )}

      {/* スクロールトップボタン */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn" 
          onClick={scrollToTop} 
          aria-label="ページトップへ戻る"
          title="トップへ戻る"
        >
          ↑
        </button>
      )}

      {/* モバイル用ボトムナビゲーション */}
      <nav className="mobile-bottom-nav" aria-label="モバイルナビゲーション">
        <a href="#top" className="bottom-nav-item">
          <Icon>⌂</Icon>
          <span>ホーム</span>
        </a>
        <button 
          className="bottom-nav-item" 
          onClick={() => {
            const el = document.getElementById('discover')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <Icon>⌕</Icon>
          <span>探す</span>
        </button>
        <button 
          className="bottom-nav-item"
          onClick={() => {
            const el = document.querySelector('.diagnosis-container')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          <Icon>🎯</Icon>
          <span>診断</span>
        </button>
        <button 
          className="bottom-nav-item" 
          onClick={() => setIsSavedOpen(true)}
        >
          <Icon>♥</Icon>
          <span>お気に入り</span>
          {saved.length > 0 && <span className="mobile-nav-badge">{saved.length}</span>}
        </button>
      </nav>

      {/* トースト通知 */}
      <Toast message={toastMessage} visible={toastVisible} />

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

function BookCard({ book, saved, onSave, inCompare, onToggleCompare, onRecordView }) {
  return (
    <article className="book-card vertical">
      <div className="cover-wrap-vert">
        <a 
          href={`/works/${book.slug}/`}
          onClick={onRecordView}
        >
          <img 
            src={book.cover} 
            alt={`${book.title}の表紙画像`} 
            loading="lazy" 
            width="220" 
            height="310" 
          />
        </a>
        <span className={'cover-badge ' + (book.color || 'gold')}>{book.badge || '注目作'}</span>
        <button 
          className={'save ' + (saved ? 'is-saved' : '')} 
          onClick={(e) => { e.preventDefault(); onSave(); }} 
          aria-label={saved ? 'お気に入りから削除' : 'お気に入りに保存'}
          title={saved ? 'お気に入りから削除' : 'お気に入りに保存'}
        >
          {saved ? '♥' : '♡'}
        </button>
      </div>
      <div className="book-meta-vert">
        <div className="book-top-tags">
          <span className="genre">{book.genre}</span>
          {book.animeAdaptation && <span className="anime-badge">TVアニメ化</span>}
        </div>
        <h3>
          <a 
            href={`/works/${book.slug}/`}
            onClick={onRecordView}
          >
            {book.title}
          </a>
        </h3>
        <p className="author">{book.author}</p>
        
        {book.oneLineCatch && (
          <p className="one-line-catch">「{book.oneLineCatch}」</p>
        )}

        <div className="book-bottom-vert">
          <a 
            className="detail-btn" 
            href={`/works/${book.slug}/`}
            onClick={onRecordView}
          >
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

        <button 
          className={`compare-select-btn ${inCompare ? 'selected' : ''}`}
          onClick={onToggleCompare}
        >
          {inCompare ? '✓ 比較リストに追加中' : '⚔️ 比較に追加'}
        </button>
      </div>
    </article>
  )
}

// 診断ウィジェット（クイックタブ & 3問ステップ診断のデュアルモード）
function DiagnosisWidget({ books, onRecordView, showToast }) {
  const [mode, setMode] = useState('quick') // 'quick' | 'quiz'
  const [selectedMood, setSelectedMood] = useState('musou')
  
  // 3問クイズの回答ステート
  const [currentStep, setCurrentStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState([])
  const [quizResultType, setQuizResultType] = useState(null)

  const currentType = DIAGNOSIS_TYPES[mode === 'quiz' && quizResultType ? quizResultType : selectedMood]

  const matched = useMemo(() => {
    if (!books.length) return []
    const keywords = currentType.keywords
    return books.filter(b => {
      const text = `${b.title} ${b.genre} ${b.description} ${(b.tags || []).join(' ')} ${b.oneLineCatch || ''}`.toLowerCase()
      return keywords.some(kw => text.includes(kw.toLowerCase()))
    }).slice(0, 3)
  }, [books, currentType])

  const handleQuizAnswer = (type) => {
    const updated = [...quizAnswers, type]
    setQuizAnswers(updated)
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // 集計：一番多く選ばれたタイプを決定
      const counts = updated.reduce((acc, t) => {
        acc[t] = (acc[t] || 0) + 1
        return acc
      }, {})
      let maxType = 'musou'
      let maxCount = 0
      for (const [t, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count
          maxType = t
        }
      }
      setQuizResultType(maxType)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(0)
    setQuizAnswers([])
    setQuizResultType(null)
  }

  const shareText = `【異世界コンパス 1秒適性診断】私のタイプは「${currentType.name}」でした！おすすめ作品：${matched.map(m => `『${m.title}』`).slice(0, 2).join(' ')} #異世界コンパス #異世界漫画`
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent('https://isekai-compas.vercel.app/')}`

  const copyShareText = () => {
    navigator.clipboard.writeText(`${shareText}\nhttps://isekai-compas.vercel.app/`).then(() => {
      showToast('📋 診断結果をクリップボードにコピーしました！')
    })
  }

  return (
    <section className="section wrap diagnosis-container">
      <div className="diagnosis-box">
        <div className="diagnosis-header">
          <div className="diagnosis-header-top">
            <span className="eyebrow dark">INTERACTIVE DIAGNOSIS</span>
            <div className="diagnosis-mode-toggles">
              <button 
                className={`mode-btn ${mode === 'quick' ? 'active' : ''}`}
                onClick={() => setMode('quick')}
              >
                ⚡ 1秒クイック診断
              </button>
              <button 
                className={`mode-btn ${mode === 'quiz' ? 'active' : ''}`}
                onClick={() => { setMode('quiz'); resetQuiz(); }}
              >
                ❓ 3問深掘り診断
              </button>
            </div>
          </div>
          <h2>🎯 あなたにぴったりの異世界 適性診断</h2>
          <p>
            {mode === 'quick' 
              ? '「今どんな気分で楽しみたい？」を選ぶだけで、絶対にハマるおすすめ作品をナビゲート！'
              : '簡単な3つの直感質問に答えて、あなたの隠れた欲望にジャストフィットする異世界を導き出します。'}
          </p>
        </div>

        {mode === 'quick' ? (
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
        ) : (
          <div className="quiz-flow-area">
            {!quizResultType ? (
              <div className="quiz-card">
                <div className="quiz-progress-label">質問 {currentStep + 1} / {QUIZ_QUESTIONS.length}</div>
                <h3 className="quiz-question-title">{QUIZ_QUESTIONS[currentStep].question}</h3>
                <div className="quiz-options-list">
                  {QUIZ_QUESTIONS[currentStep].options.map((opt, i) => (
                    <button 
                      key={i} 
                      className="quiz-option-btn"
                      onClick={() => handleQuizAnswer(opt.type)}
                    >
                      <span>{opt.text}</span>
                      <b>→</b>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="quiz-completed-banner">
                <span>🎉 3問の深掘り診断が完了しました！</span>
                <button className="quiz-retry-btn" onClick={resetQuiz}>もう一度診断する ↺</button>
              </div>
            )}
          </div>
        )}

        {/* 診断結果表示 */}
        {(mode === 'quick' || quizResultType) && (
          <div className="diagnosis-result-area">
            <div className="result-badge-row">
              <div className="result-title-group">
                <span className="result-label">あなたの診断結果タイプ</span>
                <h3>✨ {currentType.name}</h3>
                <p className="result-desc">{currentType.desc}</p>
              </div>
              <div className="result-actions-group">
                <a 
                  href={shareUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="x-share-btn"
                  title="診断結果をX（Twitter）でシェア"
                >
                  <span>𝕏</span> 結果をポスト
                </a>
                <button 
                  className="copy-result-btn"
                  onClick={copyShareText}
                  title="結果テキストをコピー"
                >
                  📋 結果をコピー
                </button>
              </div>
            </div>

            <div className="result-books-grid">
              {matched.map(b => (
                <div key={b.id || b.slug || b.title} className="result-book-card">
                  <a 
                    href={`/works/${b.slug}/`} 
                    className="result-cover-link"
                    onClick={() => onRecordView(b)}
                  >
                    <img src={b.cover} alt={b.title} loading="lazy" width="90" height="130" />
                  </a>
                  <div className="result-book-info">
                    <span className="result-book-genre">{b.genre}</span>
                    <h4>
                      <a 
                        href={`/works/${b.slug}/`}
                        onClick={() => onRecordView(b)}
                      >
                        {b.title}
                      </a>
                    </h4>
                    <p className="result-author">{b.author}</p>
                    <div className="result-card-actions">
                      <a 
                        href={`/works/${b.slug}/`} 
                        className="result-detail-link"
                        onClick={() => onRecordView(b)}
                      >
                        解説を見る →
                      </a>
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
        )}
      </div>
    </section>
  )
}

// ⌘K 検索モーダルダイアログ
function SearchModal({ books, onClose, onRecordView }) {
  const [modalQuery, setModalQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    if (!modalQuery.trim()) return []
    const q = modalQuery.toLowerCase().trim()
    return books.filter(b => {
      const text = `${b.title} ${b.author} ${b.genre} ${(b.tags || []).join(' ')} ${b.oneLineCatch || ''}`.toLowerCase()
      return text.includes(q)
    }).slice(0, 8)
  }, [books, modalQuery])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="search-palette" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="クイック検索">
        <div className="palette-input-wrap">
          <Icon>⌕</Icon>
          <input 
            ref={inputRef}
            value={modalQuery} 
            onChange={e => setModalQuery(e.target.value)}
            placeholder="作品名・作者・タグ・キーワードで検索..."
            aria-label="検索キーワード"
          />
          <kbd className="palette-esc-badge" onClick={onClose}>ESC</kbd>
        </div>

        <div className="palette-results-body">
          {modalQuery.trim() === '' ? (
            <div className="palette-hint">
              <p>キーワードを入力するとリアルタイムに作品を検索できます。</p>
              <div className="palette-quick-tags">
                <span>人気のキーワード：</span>
                {['追放', '悪役令嬢', 'スローライフ', 'もふもふ', 'チート', '内政'].map(kw => (
                  <button key={kw} onClick={() => setModalQuery(kw)}>{kw}</button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="palette-no-results">
              「{modalQuery}」に一致する作品は見つかりませんでした。
            </div>
          ) : (
            <div className="palette-items-list">
              {results.map(b => (
                <a 
                  key={b.slug} 
                  href={`/works/${b.slug}/`} 
                  className="palette-item"
                  onClick={() => {
                    onRecordView(b)
                    onClose()
                  }}
                >
                  <img src={b.cover} alt={b.title} width="40" height="56" />
                  <div className="palette-item-text">
                    <span className="palette-item-title">{b.title}</span>
                    <span className="palette-item-sub">{b.author} · {b.genre}</span>
                  </div>
                  <span className="palette-item-arrow">→</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
