import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { makeT, TYPE_LABELS } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'

const TYPE_KEYS = ['noun', 'verb', 'modifier', 'pronoun', 'particle', 'preposition', 'number', 'interjection']

export default function Dictionary({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [playing, setPlaying] = useState(null)

  const allEntries = useMemo(
    () => Object.values(VOCAB).sort((a, b) => a.tp.localeCompare(b.tp)),
    []
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allEntries.filter(e => {
      if (filterType !== 'all' && e.tipo !== filterType) return false
      if (!q) return true
      const meaning = (e[lang] ?? e.es).toLowerCase()
      return e.tp.toLowerCase().includes(q) ||
             meaning.includes(q) ||
             e.ejemplo.toLowerCase().includes(q)
    })
  }, [search, filterType, allEntries, lang])

  const handlePlay = (word) => {
    primeAudio()
    setPlaying(word)
    speak(word, { onEnd: () => setPlaying(null) })
  }

  return (
    <div className="dictionary">
      <header className="dict-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="dict-title-block">
          <h2 className="dict-title">📖 {t('dictionary')}</h2>
          <span className="dict-count">{filtered.length} / {allEntries.length}</span>
        </div>
      </header>

      <div className="dict-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
          autoFocus
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      <div className="dict-filters">
        <button
          className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
          onClick={() => setFilterType('all')}
        >
          {t('filterAll')}
        </button>
        {TYPE_KEYS.map(k => (
          <button
            key={k}
            className={`filter-pill ${filterType === k ? 'active' : ''}`}
            onClick={() => setFilterType(k)}
          >
            {TYPE_LABELS[k]?.[lang] ?? k}
          </button>
        ))}
      </div>

      <div className="dict-list">
        {filtered.length === 0 && (
          <div className="dict-empty">
            <span className="empty-icon">🤔</span>
            <p>{t('noResults', { q: search })}</p>
          </div>
        )}
        {filtered.map(entry => (
          <div key={entry.tp} className="dict-entry">
            <div className="dict-row">
              <span className="dict-tp">{entry.tp}</span>
              <button
                className={`audio-btn ${playing === entry.tp ? 'is-playing' : ''}`}
                onClick={() => handlePlay(entry.tp)}
              >
                {playing === entry.tp ? '🔉' : '🔊'}
              </button>
              <span className="dict-type-tag">{TYPE_LABELS[entry.tipo]?.[lang] ?? entry.tipo}</span>
            </div>
            <div className="dict-es">{entry[lang] ?? entry.es}</div>
            <div className="dict-example">
              <span className="dict-example-label">{t('example')}</span>
              <span className="dict-example-text">"{entry.ejemplo}"</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
