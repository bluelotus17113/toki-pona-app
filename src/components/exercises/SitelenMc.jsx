import { useState } from 'react'
import { makeT } from '../../data/i18n.js'

// Ejercicio MC con glifo sitelen pona como prompt.
// ex: { glyph: 'jan', options: [text...], answer: text }
// Selección diferida: ver MultipleChoice.jsx. Evalúa el botón COMPROBAR del pie.
export default function SitelenMc({ ex, lang = 'es', onSelect, revealed }) {
  const t = makeT(lang)
  const [picked, setPicked] = useState(null)

  const handlePick = (opt) => {
    if (revealed) return
    setPicked(opt)
    onSelect({ isCorrect: opt === ex.answer, correctAnswer: ex.answer })
  }

  const status = (opt) => {
    if (!revealed) return opt === picked ? 'picked' : ''
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
            disabled={revealed}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
