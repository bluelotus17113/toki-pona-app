import { useState } from 'react'
import { speak } from '../../hooks/useSpeech.js'
import { makeT } from '../../data/i18n.js'

export default function SentenceBuilder({ ex, lang = 'es', onResult }) {
  const t = makeT(lang)
  const [available, setAvailable] = useState(ex.tokens.map((tk, i) => ({ id: i, text: tk })))
  const [chosen, setChosen] = useState([])
  const [locked, setLocked] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const pick = (item) => {
    if (locked) return
    setChosen(c => [...c, item])
    setAvailable(a => a.filter(x => x.id !== item.id))
  }
  const unpick = (item) => {
    if (locked) return
    setChosen(c => c.filter(x => x.id !== item.id))
    setAvailable(a => [...a, item])
  }
  const check = () => {
    const result = chosen.map(c => c.text)
    const isCorrect = result.length === ex.answer.length && result.every((w, i) => w === ex.answer[i])
    setLocked(true)
    setFeedback(isCorrect ? 'right' : 'wrong')
    if (isCorrect) speak(ex.answer.join(' '))
    setTimeout(() => onResult(isCorrect), 1300)
  }

  const promptText = typeof ex.prompt === 'string'
    ? ex.prompt
    : t(ex.prompt.key, ex.prompt.args)

  return (
    <div className="ex-card">
      <h2 className="ex-prompt">{promptText}</h2>

      <div className={`sentence-line ${feedback || ''}`}>
        {chosen.length === 0 && <span className="placeholder">{t('placeholder')}</span>}
        {chosen.map(c => (
          <button key={c.id} className="token chosen" onClick={() => unpick(c)} disabled={locked}>
            {c.text}
          </button>
        ))}
      </div>

      <div className="token-pool">
        {available.map(tk => (
          <button key={tk.id} className="token" onClick={() => pick(tk)} disabled={locked}>
            {tk.text}
          </button>
        ))}
      </div>

      <button
        className={`primary-btn check-btn ${chosen.length === 0 ? 'disabled' : ''}`}
        disabled={chosen.length === 0 || locked}
        onClick={check}
      >
        {locked
          ? (feedback === 'right' ? t('correct') : t('answerIs', { answer: ex.answer.join(' ') }))
          : t('check')}
      </button>
    </div>
  )
}
