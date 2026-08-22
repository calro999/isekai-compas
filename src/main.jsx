import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const tags = ['追放', '悪役令嬢', 'スローライフ', 'ダンジョン', '最強主人公', 'ざまぁ', '転生', '内政', 'もふもふ', '恋愛']

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function App() {
  const [books, setBooks] = useState([])
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('すべて')
  const [saved, setSaved] = useState([])

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

  const filtered = useMemo(() => {
    return books.filter(b => 
      (active === 'すべて' || (b.genre && b.genre.includes(active)) || (b.tags && b.tags.includes(active))) &&
      ((b.title || '') + (b.author || '')).includes(query)
    )
  }, [books, active, query])

  const toggleSave = (title) => setSaved(s => s.includes(title) ? s.filter(t => t !== title) : [...s, title])

  return <div className="app-shell">
    <div className="topline"><span>異世界漫画だけの、作品発見メディア</span><span>毎日更新｜全{books.length}作品</span></div>
    <header className="header wrap">
      <a className="brand" href="/"><span class="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
      <nav className="main-nav">
        <a href="/features/">特集<em>HOT</em></a>
        <a href="/works/">作品を探す</a>
        <a href="/new/">新刊<em>NEW</em></a>
        <a href="/tags/">タグから探す</a>
        <a href="/series/">シリーズ</a>
        <a href="/authors/">作者</a>
        <a href="/compare/">比較</a>
      </nav>
      <div className="header-actions">
        <button className="search-trigger" onClick={() => document.querySelector('.hero-search input')?.focus()}><Icon>⌕</Icon><span>作品・作者を検索</span><kbd>⌘ K</kbd></button>
        <button className="saved-btn" aria-label="保存した作品"><Icon>♡</Icon><span>{saved.length || ''}</span></button>
      </div>
    </header>

    <main id="top">
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="spark">✦</span> 異世界漫画専門ナビゲーション</div>
          <h1>次に読む異世界を、<br /><i>世界観</i>から選ぼう。</h1>
          <p>「追放」「もふもふ」「内政」…<br />あなたの気分にぴったりの物語が見つかります。</p>
          <div className="hero-search">
            <Icon>⌕</Icon>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="作品名・作者名・キーワードで検索"/>
            <button>探す</button>
          </div>
          <div className="popular">
            <span>POPULAR</span>
            {tags.slice(0, 5).map(t => <button key={t} onClick={() => setActive(t)}>{t}</button>)}
          </div>
        </div>
        <div className="hero-art">
          <div className="moon"></div>
          <div className="mountain back"></div>
          <div className="mountain front"></div>
          <div className="castle"><span>♜</span></div>
          <div className="hero-card">
            <span className="mini-label">TODAY'S PICK</span>
            <strong>物語の余韻に、<br />浸れる一冊。</strong>
            <span className="card-arrow">↗</span>
          </div>
          <div className="orb orb-one"></div>
          <div className="orb orb-two"></div>
        </div>
      </section>

      <section className="section wrap" id="discover">
        <div className="section-heading">
          <div>
            <span className="eyebrow dark">RECOMMENDED</span>
            <h2>今日のおすすめ</h2>
            <p>今、読者から注目されている異世界作品（4選）</p>
          </div>
          <a className="text-link" href="/works/">すべて見る <span>→</span></a>
        </div>
        <div className="book-grid grid-4">
          {filtered.slice(0, 4).map(book => (
            <BookCard key={book.id || book.title} book={book} saved={saved.includes(book.title)} onSave={() => toggleSave(book.title)} />
          ))}
          {books.length === 0 && <p className="data-note">作品データを読み込んでいます。</p>}
        </div>
      </section>

      <DiagnosisWidget books={books} />

      <section className="quote-band">
        <div className="quote-inner wrap">
          <span className="quote-mark">“</span>
          <div>
            <p>ランキングだけじゃ見つからない、<br /><strong>あなたのための異世界</strong>を案内します。</p>
          </div>
          <span className="quote-note">READ YOUR<br />OWN STORY</span>
        </div>
      </section>

      <section className="section wrap" id="new">
        <div className="section-heading compact">
          <div>
            <span className="eyebrow dark">NEW RELEASES</span>
            <h2>新刊・注目作</h2>
          </div>
          <a className="text-link" href="/new/">新刊をすべて見る <span>→</span></a>
        </div>
        <div className="release-list">
          {books.slice(0, 6).map((book, i) => (
            <div className="release-row" key={book.id || book.title}>
              <span className="release-no">0{i + 1}</span>
              <img src={book.cover} alt={`${book.title}の表紙`} />
              <div className="release-info">
                <span className="tag-pill">{book.badge || '新着'}</span>
                <h3><a href={`/works/${book.slug}/`}>{book.title}</a></h3>
                <p>{book.author}　·　{book.genre}</p>
              </div>
              <span className="release-date">{book.salesDate}</span>
              <a className="circle-arrow" href={`/works/${book.slug}/`} aria-label={`${book.title}の詳細`}>↗</a>
            </div>
          ))}
        </div>
      </section>

      <section className="tag-section">
        <div className="wrap tag-layout">
          <div>
            <span className="eyebrow dark">BROWSE BY MOOD</span>
            <h2>気分から探す</h2>
            <p>いまの気分にあわせて、<br />物語の扉を開こう。</p>
            <a className="text-link" href="/tags/">タグを一覧で見る <span>→</span></a>
          </div>
          <div className="tag-cloud" id="tags">
            {tags.map((t, i) => <button className={i === 0 ? 'active' : ''} key={t} onClick={() => setActive(t)}><span>#</span>{t}<b>↗</b></button>)}
          </div>
        </div>
      </section>
    </main>

    <footer className="footer">
      <div className="wrap footer-inner">
        <a className="brand light" href="#top"><span className="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
        <div className="footer-links">
          <a href="/features/">おすすめ特集</a>
          <a href="/works/">全作品</a>
          <a href="/new/">新刊一覧</a>
          <a href="/tags/">タグ一覧</a>
          <a href="/series/">シリーズ</a>
          <a href="/authors/">作者一覧</a>
          <a href="/compare/">比較・関連作品</a>
        </div>
        <span className="copyright">© ISEKAI COMPASS</span>
      </div>
    </footer>
  </div>
}

function BookCard({ book, saved, onSave }) {
  return (
    <article className="book-card vertical">
      <a className="cover-wrap-vert" href={`/works/${book.slug}/`}>
        <img src={book.cover} alt={`${book.title}の表紙`} loading="lazy" />
        <span className={'cover-badge ' + (book.color || 'gold')}>{book.badge || '注目'}</span>
        <button className={'save ' + (saved ? 'is-saved' : '')} onClick={(e) => { e.preventDefault(); onSave(); }} aria-label="作品を保存">
          {saved ? '♥' : '♡'}
        </button>
      </a>
      <div className="book-meta-vert">
        <span className="genre">{book.genre}</span>
        <h3><a href={`/works/${book.slug}/`}>{book.title}</a></h3>
        <p className="author">{book.author}</p>
        <div className="book-bottom-vert">
          <span className="stars">★★★★★ <small>4.8</small></span>
          <a class="detail-btn" href={`/works/${book.slug}/`}>詳細を見る ↗</a>
        </div>
      </div>
    </article>
  )
}

function DiagnosisWidget({ books }) {
  const [mood, setMood] = useState('無双')
  const [heroType, setHeroType] = useState('最強')

  const matched = useMemo(() => {
    if (!books.length) return []
    return books.filter(b => {
      const text = (b.title + b.genre + b.description + (b.tags || []).join(''))
      const matchMood = mood === '無双' ? text.includes('無双') || text.includes('最強') || text.includes('チート')
                      : mood === '癒やし' ? text.includes('スローライフ') || text.includes('食堂') || text.includes('メシ') || text.includes('下剋上')
                      : mood === '頭脳戦' ? text.includes('薬屋') || text.includes('ゼロから') || text.includes('破滅') || text.includes('ノーゲーム') || text.includes('王国')
                      : text.includes('勇者') || text.includes('盾') || text.includes('治癒') || text.includes('魅力')
      return matchMood
    }).slice(0, 3)
  }, [books, mood, heroType])

  return (
    <section className="section wrap" style={{ background: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #d6a24a', margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <span className="eyebrow dark" style={{ color: '#d6a24a' }}>INTERACTIVE DIAGNOSIS</span>
        <h2 style={{ fontFamily: 'serif', fontSize: '24px', margin: '8px 0' }}>🎯 あなたにぴったりの異世界作品 1秒診断</h2>
        <p style={{ color: '#5f6c62', fontSize: '14px', margin: 0 }}>今の気分を選ぶだけで、原点1巻から楽しめる最高の一着をコンパス案内します。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#17221f', marginBottom: '8px' }}>① 今どんな気分で読みたい？</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['無双', '癒やし', '頭脳戦', '逆転'].map(m => (
              <button key={m} onClick={() => setMood(m)} style={{ padding: '8px 14px', borderRadius: '20px', border: mood === m ? '2px solid #8b672d' : '1px solid #e2e8de', background: mood === m ? '#17221f' : '#fff', color: mood === m ? '#fff' : '#17221f', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                {m === '無双' ? '⚔️ 圧倒的無双' : m === '癒やし' ? '☕ 癒やし・グルメ' : m === '頭脳戦' ? '🧠 考察・頭脳戦' : '🔥 逆転・成り上がり'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #e2e8de', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 16px', color: '#17221f' }}>✨ 診断結果：あなたにおすすめの『1巻からハマる作品』</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {matched.map(b => (
            <div key={b.id || b.title} style={{ background: '#f8f9f7', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8de', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <img src={b.cover} alt={b.title} style={{ width: '60px', height: '84px', objectFit: 'cover', borderRadius: '4px' }} />
              <div>
                <h4 style={{ fontSize: '14px', margin: '0 0 4px', lineHeight: '1.4' }}><a href={`/works/${b.slug}/`} style={{ color: '#17221f' }}>{b.title}</a></h4>
                <p style={{ fontSize: '11px', color: '#5f6c62', margin: '0 0 8px' }}>{b.author}</p>
                <a href={`/works/${b.slug}/`} style={{ fontSize: '12px', color: '#8b672d', fontWeight: 'bold' }}>1巻詳細を見る →</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

createRoot(document.getElementById('root')).render(<App />)


