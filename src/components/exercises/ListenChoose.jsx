import { useEffect, useState } from 'react'
import { speak } from '../../hooks/useSpeech.js'
import { makeT } from '../../data/i18n.js'

export default function ListenChoose({ ex, lang = 'es', onResult }) {
  const t = makeT(lang)
  const [picked, setPicked] = useState(null)
  const [locked, setLocked] = useState(false)
  const [playing, setPlaying] = useState(false)

  const playAudio = () => {
    speak(ex.audioWord, {
      onStart: () => setPlaying(true),
      onEnd:   () => setPlaying(false)
    })
  }

  useEffect(() => {
    const ti = setTimeout(() => playAudio(), 400)
    return () => clearTimeout(ti)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex])

  const handlePick = (opt) => {
    if (locked) return
    setPicked(opt)
    setLocked(true)
    setTimeout(() => onResult(opt === ex.answer), 900)
  }

  const status = (opt) => {
    if (!locked) return ''
    if (opt === ex.answer) return 'right'
    if (opt === picked) return 'wrong'
    return 'dim'
  }

  return (
    <div className="ex-card">
      <h2 className="ex-prompt">{t('listenPrompt')}</h2>
      <button
        className={`big-audio-btn ${playing ? 'is-playing' : ''}`}
        onClick={playAudio}
        type="button"
      >
        <span className="speaker">{playing ? '🔉' : '🔊'}</span>
        <span className="hint">{playing ? t('playing') : t('tapToRepeat')}</span>
        {playing && (
          <span className="sound-waves" aria-hidden>
            <span /><span /><span /><span />
          </span>
        )}
      </button>
      <div className="options-grid">
        {ex.options.map((opt) => (
          <button
            key={opt}
            className={`option mono ${status(opt)}`}
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
