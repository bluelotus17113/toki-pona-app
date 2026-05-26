import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

// Palabras "siempre a mano" (más comunes para componer frases)
const COMMON = ['mi','sina','ona','li','e','la','ni','pona','ike','ala','a','jan']

export default function SitelenPona({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const [tokens, setTokens] = useState([])
  const [search, setSearch] = useState('')
  const [playing, setPlaying] = useState(false)

  const allWords = useMemo(
    () => Object.values(VOCAB).map(v => v.tp).sort((a, b) => a.localeCompare(b)),
    []
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allWords
    return allWords.filter(w => {
      if (w.toLowerCase().startsWith(q)) return true
      const def = (VOCAB[w]?.[lang] ?? VOCAB[w]?.es ?? '').toLowerCase()
      return def.includes(q)
    })
  }, [search, allWords, lang])

  const sentence = tokens.join(' ')

  const addToken = (w) => {
    if (tokens.length >= 24) return
    playClick()
    setTokens(prev => {
      const next = [...prev, w]
      unlock('sitelen-first-write')
      // easter egg: "mi olin e sina" en ese orden
      if (next.length >= 4) {
        const last4 = next.slice(-4)
        if (last4[0] === 'mi' && last4[1] === 'olin' && last4[2] === 'e' && last4[3] === 'sina') {
          unlock('mi-olin')
        }
      }
      return next
    })
  }

  const removeLast = () => {
    if (tokens.length === 0) return
    playClick()
    setTokens(prev => prev.slice(0, -1))
  }

  const clearAll = () => {
    if (tokens.length === 0) return
    playClick()
    setTokens([])
  }

  const handleSpeak = () => {
    if (!sentence || playing) return
    primeAudio()
    setPlaying(true)
    speak(sentence, { onEnd: () => setPlaying(false) })
  }

  return (
    <div className="sitelen-screen">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="sitelen-header-title">
          <h2>☉ {t('sitelenPonaTitle')}</h2>
          <p className="sitelen-header-sub">{t('sitelenPonaSub')}</p>
        </div>
      </header>

      <div className="sitelen-output">
        <div className="sitelen-output-glyphs sitelen">
          {sentence || '·'}
        </div>
        <div className="sitelen-output-latin">
          {sentence || <span className="sitelen-placeholder">{t('sitelenPlaceholder')}</span>}
        </div>
        <div className="sitelen-output-actions">
          <button
            className="sitelen-action speak"
            onClick={handleSpeak}
            disabled={!sentence || playing}
            title={t('tapToRepeat')}
          >
            {playing ? '🔉' : '🔊'}
          </button>
          <button
            className="sitelen-action back"
            onClick={removeLast}
            disabled={tokens.length === 0}
            aria-label={t('backspace')}
          >
            ⌫
          </button>
          <button
            className="sitelen-action clear"
            onClick={clearAll}
            disabled={tokens.length === 0}
          >
            ✕ {t('clear')}
          </button>
        </div>
      </div>

      <div className="sitelen-common">
        {COMMON.map(w => (
          <button
            key={w}
            className="sitelen-key common"
            onClick={() => addToken(w)}
            title={VOCAB[w]?.[lang] ?? VOCAB[w]?.es}
          >
            <span className="sitelen sitelen-key-glyph">{w}</span>
            <span className="sitelen-key-latin">{w}</span>
          </button>
        ))}
      </div>

      <div className="sitelen-search">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
      </div>

      <div className="sitelen-keyboard">
        {filtered.map(w => (
          <button
            key={w}
            className="sitelen-key"
            onClick={() => addToken(w)}
            title={VOCAB[w]?.[lang] ?? VOCAB[w]?.es}
          >
            <span className="sitelen sitelen-key-glyph">{w}</span>
            <span className="sitelen-key-latin">{w}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="sitelen-empty">{t('noResults', { q: search })}</div>
        )}
      </div>
    </div>
  )
}
