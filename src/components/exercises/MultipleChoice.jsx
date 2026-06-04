import { useState } from 'react'
import { speak } from '../../hooks/useSpeech.js'
import { makeT } from '../../data/i18n.js'

export default function MultipleChoice({ ex, lang = 'es', onResult }) {
  const t = makeT(lang)
  const [picked, setPicked] = useState(null)
  const [locked, setLocked] = useState(false)
  const [playing, setPlaying] = useState(false)

  const playAudio = () => {
    if (!ex.audioWord) return
    speak(ex.audioWord, {
      onStart: () => setPlaying(true),
      onEnd:   () => setPlaying(false)
    })
  }

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
            disabled={locked}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}
