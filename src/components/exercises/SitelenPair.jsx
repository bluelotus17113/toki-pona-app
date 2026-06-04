import { useMemo, useState } from 'react'
import { makeT } from '../../data/i18n.js'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ex: { words: ['jan', 'pona', 'telo', ...] }
// Empareja: glifo (lado izq, render sitelen) ↔ palabra romanizada (lado der)
export default function SitelenPair({ ex, lang = 'es', onResult }) {
  const t = makeT(lang)
  const glyphItems = useMemo(() => shuffle(ex.words.map(w => ({ key: 'g_' + w, side: 'glyph', text: w, pairKey: w }))), [ex])
  const latinItems = useMemo(() => shuffle(ex.words.map(w => ({ key: 'l_' + w, side: 'latin', text: w, pairKey: w }))), [ex])

  const [selected, setSelected] = useState(null)
  const [matched, setMatched] = useState(new Set())
  const [wrong, setWrong] = useState(null)
  const [mistakes, setMistakes] = useState(0)

  const handleClick = (item) => {
    if (matched.has(item.pairKey)) return
    if (!selected) {
      setSelected(item)
      return
    }
    if (selected.side === item.side) {
      setSelected(item)
      return
    }
    if (selected.pairKey === item.pairKey) {
      const next = new Set(matched)
      next.add(item.pairKey)
      setMatched(next)
      setSelected(null)
      if (next.size === ex.words.length) {
        onResult(mistakes === 0)
      }
    } else {
      setWrong(item.pairKey + '|' + selected.pairKey)
      setMistakes(m => m + 1)
      setTimeout(() => {
        setWrong(null)
        setSelected(null)
      }, 500)
    }
  }

  const cls = (item) => {
    if (matched.has(item.pairKey)) return 'matched'
    if (selected && selected.key === item.key) return 'selected'
    if (wrong && wrong.includes(item.pairKey)) return 'wrong-shake'
    return ''
  }

  return (
    <div className="ex-card">
      <h2 className="ex-prompt">{t('sitelenPairPrompt')}</h2>
      <div className="match-grid">
        <div className="match-col">
          {glyphItems.map(it => (
            <button key={it.key} className={`match-card tp ${cls(it)}`} onClick={() => handleClick(it)}>
              <span className="sitelen sitelen-pair-glyph" aria-label={it.text}>{it.text}</span>
            </button>
          ))}
        </div>
        <div className="match-col">
          {latinItems.map(it => (
            <button key={it.key} className={`match-card es ${cls(it)}`} onClick={() => handleClick(it)}>
              {it.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
