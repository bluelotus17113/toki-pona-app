import { useState } from 'react'
import { makeT } from '../../data/i18n.js'

// Ejercicio MC con glifo sitelen pona como prompt.
// ex: { glyph: 'jan', options: [text...], answer: text }
export default function SitelenMc({ ex, lang = 'es', onResult }) {
  const t = makeT(lang)
  const [picked, setPicked] = useState(null)
  const [locked, setLocked] = useState(false)

  const handlePick = (opt) => {
    if (locked) return
    setPicked(opt)
    setLocked(true)
    onResult(opt === ex.answer, { correctAnswer: ex.answer })
  }

  const status = (opt) => {
    if (!locked) return ''
    if (opt === ex.answer) return 'right'
    if (opt === picked) return 'wrong'
    return 'dim'
  }

  return (
    <div className="ex-card">
      <h2 className="ex-prompt">{t('sitelenMcPrompt')}</h2>
      <div className="sitelen-prompt" aria-label={`glifo: ${ex.glyph}`}>{ex.glyph}</div>
      <div className="options-grid">
        {ex.options.map((opt) => (
          <button
            key={opt}
            className={`option ${status(opt)}`}
            onClick={() => handlePick(opt)}
            disabled={locked}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
