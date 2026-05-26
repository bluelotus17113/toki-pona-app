import { useEffect, useMemo, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { buildLessonExercises } from '../data/exerciseBuilder.js'
import { makeT } from '../data/i18n.js'
import { primeAudio } from '../hooks/useSpeech.js'
import { playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import MultipleChoice from './exercises/MultipleChoice.jsx'
import Matching from './exercises/Matching.jsx'
import SentenceBuilder from './exercises/SentenceBuilder.jsx'
import ListenChoose from './exercises/ListenChoose.jsx'
import Hearts from './Hearts.jsx'

export default function Lesson({ lessonId, progress, lang, onFinish, onExit }) {
  const t = makeT(lang)
  const lesson = LESSONS.find(l => l.id === lessonId)
  const exercises = useMemo(() => buildLessonExercises(lesson, lang), [lessonId, lang])
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => { primeAudio() }, [])

  const done = idx >= exercises.length
  const outOfHearts = !done && progress.state.hearts <= 0

  // Si nos quedamos sin vidas en medio de la lección: salir tras 1.4s
  useEffect(() => {
    if (!outOfHearts) return
    const timer = setTimeout(() => onExit(), 1400)
    return () => clearTimeout(timer)
  }, [outOfHearts, onExit])

  if (!lesson) return <div>{t('lessonNotFound')}</div>

  if (done) {
    const score = Math.max(5, correct * 2 - mistakes)
    playLessonComplete()
    setTimeout(() => onFinish(lesson.id, score), 0)
    return null
  }

  const current = exercises[idx]
  const total = exercises.length

  const handleResult = (isCorrect) => {
    if (isCorrect) {
      setCorrect(c => c + 1)
      playSuccess()
    } else {
      setMistakes(m => m + 1)
      progress.loseHeart()
      playError()
    }
    setIdx(i => i + 1)
  }

  return (
    <div className="lesson">
      <header className="lesson-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitConfirm'))) onExit()
        }}>✕</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(idx / total) * 100}%` }} />
        </div>
        <Hearts
          hearts={progress.state.hearts}
          max={progress.MAX_HEARTS}
          nextRegenAt={progress.state.nextRegenAt}
          lang={lang}
          compact
        />
      </header>

      <div className="exercise-area" key={idx}>
        {current.type === 'mc' && <MultipleChoice ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'listen' && <ListenChoose ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'match' && <Matching ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'build' && <SentenceBuilder ex={current} lang={lang} onResult={handleResult} />}
      </div>

      {outOfHearts && (
        <div className="out-of-hearts-overlay" role="alert">
          <div className="out-of-hearts-card">
            <div className="big-sad">💔</div>
            <h3>{t('noHeartsTitle')}</h3>
            <p className="modal-sub">{t('outOfHeartsExiting')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
