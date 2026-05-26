import { useEffect, useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { COMPOUND_CATEGORIES, TOTAL_COMPOUNDS, searchCompounds } from '../data/sitelenAtlas.js'
import { makeT, TYPE_LABELS } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

export default function SitelenAtlas({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const [tab, setTab] = useState('compounds')   // 'simple' | 'compounds'
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)  // { type: 'simple'|'compound', data }
  const [playing, setPlaying] = useState(false)

  useEffect(() => { unlock('atlas-opened') }, [])

  const sortedSimple = useMemo(
    () => Object.values(VOCAB).sort((a, b) => a.tp.localeCompare(b.tp)),
    []
  )

  const filteredSimple = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sortedSimple
    return sortedSimple.filter(e =>
      e.tp.toLowerCase().includes(q) ||
      (e[lang] ?? e.es).toLowerCase().includes(q)
    )
  }, [sortedSimple, search, lang])

  const compoundSearchResults = useMemo(
    () => search.trim() ? searchCompounds(search, lang) : null,
    [search, lang]
  )

  const handleOpenSimple = (entry) => {
    playClick()
    setSelected({ type: 'simple', data: entry })
  }
  const handleOpenCompound = (item) => {
    playClick()
    setSelected({ type: 'compound', data: item })
  }
  const handleClose = () => setSelected(null)

  const handleSpeak = (text) => {
    if (playing) return
    primeAudio()
    setPlaying(true)
    speak(text, { onEnd: () => setPlaying(false) })
  }

  return (
    <div className="atlas-screen">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="atlas-title-block">
          <h2>🔠 {t('atlasTitle')}</h2>
          <p>{Object.keys(VOCAB).length} {t('words')} · {TOTAL_COMPOUNDS} {t('compoundsLabel')}</p>
        </div>
      </header>

      <div className="atlas-tabs">
        <button
          className={`tab ${tab === 'compounds' ? 'active' : ''}`}
          onClick={() => { playClick(); setTab('compounds') }}
        >
          ✨ {t('atlasCompounds')}
        </button>
        <button
          className={`tab ${tab === 'simple' ? 'active' : ''}`}
          onClick={() => { playClick(); setTab('simple') }}
        >
          🔤 {t('atlasSimple')}
        </button>
      </div>

      <div className="atlas-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      {/* TAB: COMPUESTOS */}
      {tab === 'compounds' && (
        <div className="atlas-compounds">
          {compoundSearchResults ? (
            // resultados de búsqueda planos
            <section className="atlas-section">
              <header className="atlas-section-head">
                <span className="atlas-section-icon">🔍</span>
                <h3 className="atlas-section-title">{t('searchResults')}</h3>
                <span className="atlas-section-count">{compoundSearchResults.length}</span>
              </header>
              <div className="atlas-grid">
                {compoundSearchResults.map((item, idx) => (
                  <CompoundCard
                    key={`${item.compound}_${idx}`}
                    item={item}
                    lang={lang}
                    onClick={() => handleOpenCompound(item)}
                  />
                ))}
              </div>
              {compoundSearchResults.length === 0 && (
                <p className="atlas-empty">{t('noResults', { q: search })}</p>
              )}
            </section>
          ) : (
            // categorías normales
            COMPOUND_CATEGORIES.map(cat => (
              <section key={cat.id} className="atlas-section">
                <header className="atlas-section-head">
                  <span className="atlas-section-icon">{cat.icon}</span>
                  <h3 className="atlas-section-title">{cat.title[lang] ?? cat.title.es}</h3>
                  <span className="atlas-section-count">{cat.items.length}</span>
                </header>
                <div className="atlas-grid">
                  {cat.items.map((item, idx) => (
                    <CompoundCard
                      key={`${cat.id}_${idx}`}
                      item={item}
                      lang={lang}
                      onClick={() => handleOpenCompound(item)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      )}

      {/* TAB: SIMPLES */}
      {tab === 'simple' && (
        <div className="atlas-simple">
          <div className="atlas-grid">
            {filteredSimple.map(entry => (
              <button
                key={entry.tp}
                className="atlas-card simple"
                onClick={() => handleOpenSimple(entry)}
              >
                <span className="sitelen atlas-card-glyph">{entry.tp}</span>
                <span className="atlas-card-latin">{entry.tp}</span>
              </button>
            ))}
          </div>
          {filteredSimple.length === 0 && (
            <p className="atlas-empty">{t('noResults', { q: search })}</p>
          )}
        </div>
      )}

      {/* MODAL DE DETALLE */}
      {selected && (
        <div className="atlas-modal-backdrop" onClick={handleClose}>
          <div className="atlas-modal" onClick={e => e.stopPropagation()}>
            <button className="atlas-modal-close" onClick={handleClose}>✕</button>
            {selected.type === 'simple' && (
              <>
                <div className="atlas-modal-glyph sitelen">{selected.data.tp}</div>
                <div className="atlas-modal-latin">{selected.data.tp}</div>
                <div className="atlas-modal-type">
                  {TYPE_LABELS[selected.data.tipo]?.[lang] ?? selected.data.tipo}
                </div>
                <div className="atlas-modal-meaning">
                  {selected.data[lang] ?? selected.data.es}
                </div>
                {selected.data.ejemplo && (
                  <div className="atlas-modal-example">
                    <div className="atlas-modal-example-label">{t('example')}</div>
                    <span className="sitelen atlas-modal-example-glyphs">
                      {selected.data.ejemplo}
                    </span>
                    <span className="atlas-modal-example-text">"{selected.data.ejemplo}"</span>
                  </div>
                )}
                <button
                  className="primary-btn"
                  disabled={playing}
                  onClick={() => handleSpeak(selected.data.tp)}
                >
                  {playing ? '🔉' : '🔊'} {t('listen')}
                </button>
              </>
            )}
            {selected.type === 'compound' && (
              <>
                <div className="atlas-modal-glyph sitelen">{selected.data.compound}</div>
                <div className="atlas-modal-latin">{selected.data.compound}</div>
                <div className="atlas-modal-type">{t('compoundLabel')}</div>
                <div className="atlas-modal-meaning">
                  {selected.data[lang] ?? selected.data.es}
                </div>
                <div className="atlas-modal-breakdown">
                  {selected.data.compound.split(' ').map((w, i) => (
                    <span key={i} className="breakdown-word">
                      <span className="sitelen">{w}</span>
                      <span className="breakdown-latin">{w}</span>
                      <span className="breakdown-meaning">
                        {VOCAB[w]?.[lang] ?? VOCAB[w]?.es ?? '—'}
                      </span>
                    </span>
                  ))}
                </div>
                <button
                  className="primary-btn"
                  disabled={playing}
                  onClick={() => handleSpeak(selected.data.compound)}
                >
                  {playing ? '🔉' : '🔊'} {t('listen')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function CompoundCard({ item, lang, onClick }) {
  return (
    <button className="atlas-card compound" onClick={onClick}>
      <span className="sitelen atlas-card-glyph">{item.compound}</span>
      <span className="atlas-card-latin">{item.compound}</span>
      <span className="atlas-card-meaning">{item[lang] ?? item.es}</span>
    </button>
  )
}
