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

export default function Matching({ ex, lang = 'es', onResult }) {
  const t = makeT(lang)
  const tpItems = useMemo(() => shuffle(ex.pairs.map(p => ({ key: 't_' + p.tp, side: 'tp', text: p.tp, pairKey: p.tp }))), [ex])
  const esItems = useMemo(() => shuffle(ex.pairs.map(p => ({ key: 'e_' + p.tp, side: 'es', text: p.es, pairKey: p.tp }))), [ex])

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
      if (next.size === ex.pairs.length) {
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
      <h2 className="ex-prompt">{t('matchPrompt')}</h2>
      <div className="match-grid">
        <div className="match-col">
          {tpItems.map(it => (
            <button key={it.key} className={`match-card tp ${cls(it)}`} onClick={() => handleClick(it)}>
              {it.text}
            </button>
          ))}
        </div>
        <div className="match-col">
          {esItems.map(it => (
            <button key={it.key} className={`match-card es ${cls(it)}`} onClick={() => handleClick(it)}>
              {it.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
