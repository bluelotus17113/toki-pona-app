import { useState } from 'react'
import { speak } from '../../hooks/useSpeech.js'
import { makeT } from '../../data/i18n.js'

// Elegir una opción solo la SELECCIONA — no la evalúa. La corrección la
// dispara el botón COMPROBAR del pie, en Lesson.jsx. Así un toque accidental
// no cuesta una vida y se puede cambiar de opinión antes de comprometerse.
// `revealed` lo controla el padre: true una vez comprobada la respuesta.
export default function MultipleChoice({ ex, lang = 'es', onSelect, revealed }) {
  const t = makeT(lang)
  const [picked, setPicked] = useState(null)
  const [playing, setPlaying] = useState(false)

  const playAudio = () => {
    if (!ex.audioWord) return
    speak(ex.audioWord, {
      onStart: () => setPlaying(true),
      onEnd:   () => setPlaying(false)
    })
  }

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

  const promptText = typeof ex.prompt === 'string'
    ? ex.prompt
    : t(ex.prompt.key, ex.prompt.args)

  return (
    <div className="ex-card">
      <h2 className="ex-prompt">
        {promptText}
        {ex.audioWord && (
          <button
            className={`audio-btn ${playing ? 'is-playing' : ''}`}
            onClick={playAudio}
            type="button"
          >
            {playing ? '🔉' : '🔊'}
          </button>
        )}
      </h2>
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
