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
    fetch('/data/books.json')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('book data unavailable')))
      .then(items => setBooks(items.filter(book => book.slug && book.title)))
      .catch(() => {})
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

createRoot(document.getElementById('root')).render(<App />)

