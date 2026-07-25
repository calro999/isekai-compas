import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const fallbackBooks = [
  { title: '転生したら第七王子だったので', author: '謙虚なサークル', genre: '無双・成長', tags: ['転生', '最強主人公'], badge: '話題作', cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80', color: 'gold', desc: '魔術を極めたい少年が、異世界で自由に生きる王道ファンタジー。' },
  { title: 'とんでもスキルで異世界放浪メシ', author: '江口連', genre: 'スローライフ', tags: ['スローライフ', 'もふもふ'], badge: 'ほっこり', cover: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=600&q=80', color: 'sage', desc: 'ネットスーパーのスキルで、旅とごはんを楽しむ異世界生活。' },
  { title: '追放された令嬢の華麗なる生活', author: '柚木深つばさ', genre: '悪役令嬢・恋愛', tags: ['追放', '悪役令嬢', 'ざまぁ'], badge: '新刊', cover: 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80', color: 'rose', desc: '追放された先で、本当の自分と運命の人に出会う再起の物語。' },
  { title: 'ダンジョン飯はじめました', author: '九井諒子', genre: 'ダンジョン・冒険', tags: ['ダンジョン', '冒険'], badge: '定番', cover: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80', color: 'blue', desc: '迷宮を知り尽くす仲間たちの、食と冒険の異世界グルメ。' },
]

const tags = ['追放', '悪役令嬢', 'スローライフ', 'ダンジョン', '最強主人公', 'ざまぁ', '転生', '内政', 'もふもふ', '恋愛']

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }

function App() {
  const [books, setBooks] = useState(fallbackBooks)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('すべて')
  const [saved, setSaved] = useState([])
  useEffect(() => {
    fetch('/data/books.json').then(response => response.ok ? response.json() : Promise.reject(new Error('book data unavailable'))).then(setBooks).catch(() => {})
  }, [])
  const filtered = useMemo(() => books.filter(b => (active === 'すべて' || b.genre.includes(active) || b.tags?.includes(active)) && (b.title + b.author).includes(query)), [active, query])
  const toggleSave = (title) => setSaved(s => s.includes(title) ? s.filter(t => t !== title) : [...s, title])

  return <div className="app-shell">
    <div className="topline"><span>異世界漫画だけの、作品発見メディア</span><span>毎日更新｜最終更新 2024.06.24</span></div>
    <header className="header wrap">
      <a className="brand" href="#top"><span className="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a>
      <nav className="main-nav">
        {['作品を探す', '新刊', 'タグから探す', 'シリーズ', '作者'].map((n, i) => <a key={n} href={i === 1 ? '#new' : '#discover'}>{n}{i === 1 && <em>NEW</em>}</a>)}
      </nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => document.querySelector('.hero-search input')?.focus()}><Icon>⌕</Icon><span>作品・作者を検索</span><kbd>⌘ K</kbd></button><button className="saved-btn" aria-label="保存した作品"><Icon>♡</Icon><span>{saved.length || ''}</span></button></div>
    </header>

    <main id="top">
      <section className="hero wrap">
        <div className="hero-copy"><div className="eyebrow"><span className="spark">✦</span> 異世界漫画専門ナビゲーション</div><h1>次に読む異世界を、<br /><i>世界観</i>から選ぼう。</h1><p>「追放」「もふもふ」「内政」…<br />あなたの気分にぴったりの物語が見つかります。</p><div className="hero-search"><Icon>⌕</Icon><input value={query} onChange={e => setQuery(e.target.value)} placeholder="作品名・作者名・キーワードで検索"/><button>探す</button></div><div className="popular"><span>POPULAR</span>{tags.slice(0, 5).map(t => <button key={t} onClick={() => setActive(t)}>{t}</button>)}</div></div>
        <div className="hero-art"><div className="moon"></div><div className="mountain back"></div><div className="mountain front"></div><div className="castle"><span>♜</span></div><div className="hero-card"><span className="mini-label">TODAY'S PICK</span><strong>物語の余韻に、<br />浸れる一冊。</strong><span className="card-arrow">↗</span></div><div className="orb orb-one"></div><div className="orb orb-two"></div></div>
      </section>

      <section className="section wrap" id="discover"><div className="section-heading"><div><span className="eyebrow dark">DISCOVER</span><h2>今日のおすすめ</h2><p>今、読者から注目されている異世界漫画</p></div><a className="text-link" href="#all">すべて見る <span>→</span></a></div><div className="book-grid">{filtered.slice(0, 3).map(book => <BookCard key={book.title} book={book} saved={saved.includes(book.title)} onSave={() => toggleSave(book.title)} />)}</div></section>

      <section className="quote-band"><div className="quote-inner wrap"><span className="quote-mark">“</span><div><p>ランキングだけじゃ見つからない、<br /><strong>あなたのための異世界</strong>を案内します。</p></div><span className="quote-note">READ YOUR<br />OWN STORY</span></div></section>

      <section className="section wrap" id="new"><div className="section-heading compact"><div><span className="eyebrow dark">NEW RELEASES</span><h2>新刊・注目作</h2></div><a className="text-link" href="#new">新刊をすべて見る <span>→</span></a></div><div className="release-list">{books.map((book, i) => <div className="release-row" key={book.title}><span className="release-no">0{i + 1}</span><img src={book.cover} alt="" /><div className="release-info"><span className="tag-pill">{book.badge}</span><h3>{book.title}</h3><p>{book.author}　·　{book.genre}</p></div><span className="release-date">2024.06.{24 - i * 2}</span><button className="circle-arrow">↗</button></div>)}</div></section>

      <section className="tag-section"><div className="wrap tag-layout"><div><span className="eyebrow dark">BROWSE BY MOOD</span><h2>気分から探す</h2><p>いまの気分にあわせて、<br />物語の扉を開こう。</p><a className="text-link" href="#tags">タグを一覧で見る <span>→</span></a></div><div className="tag-cloud" id="tags">{tags.map((t, i) => <button className={i === 0 ? 'active' : ''} key={t} onClick={() => setActive(t)}><span>#</span>{t}<b>↗</b></button>)}</div></div></section>
    </main>
    <footer className="footer"><div className="wrap footer-inner"><a className="brand light" href="#top"><span className="brand-mark">✦</span><span><strong>異世界</strong>コンパス<small>ISEKAI COMPASS</small></span></a><div className="footer-links"><span>作品を探す</span><span>タグ一覧</span><span>シリーズ</span><span>運営について</span><span>お問い合わせ</span></div><span className="copyright">© ISEKAI COMPASS</span></div></footer>
  </div>
}

function BookCard({ book, saved, onSave }) { return <article className="book-card"><div className="cover-wrap"><img src={book.cover} alt="" /><span className={'cover-badge ' + book.color}>{book.badge}</span><button className={'save ' + (saved ? 'is-saved' : '')} onClick={onSave} aria-label="作品を保存">{saved ? '♥' : '♡'}</button><div className="cover-shine"></div></div><div className="book-meta"><span className="genre">{book.genre}</span><h3>{book.title}</h3><p>{book.author}</p><div className="book-bottom"><span className="stars">★★★★★ <small>4.8</small></span><a href="#detail">詳細を見る <b>↗</b></a></div></div></article> }

createRoot(document.getElementById('root')).render(<App />)
