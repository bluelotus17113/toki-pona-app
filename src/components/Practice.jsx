import { useEffect, useMemo, useState } from 'react'
import { buildPracticeExercises, practiceExerciseCount } from '../data/exerciseBuilder.js'
import { makeT } from '../data/i18n.js'
import { primeAudio } from '../hooks/useSpeech.js'
import { playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { recordAnswer, recordAnswers } from '../hooks/useSrs.js'
import MultipleChoice from './exercises/MultipleChoice.jsx'
import Matching from './exercises/Matching.jsx'
import SentenceBuilder from './exercises/SentenceBuilder.jsx'
import ListenChoose from './exercises/ListenChoose.jsx'
import SitelenMc from './exercises/SitelenMc.jsx'
import SitelenPair from './exercises/SitelenPair.jsx'
import Hearts from './Hearts.jsx'

export default function Practice({ progress, lang, onFinish, onExit }) {
  const t = makeT(lang)
  const completedIds = progress.state.completed
  const total = practiceExerciseCount(completedIds.length)
  const exercises = useMemo(
    () => buildPracticeExercises(completedIds, total, lang),
    [completedIds.join(','), total, lang]
  )

  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [mistakes, setMistakes] = useState(0)

  useEffect(() => { primeAudio() }, [])

  if (exercises.length === 0) {
    return (
      <div className="lesson">
        <header className="lesson-header">
          <button className="exit-btn" onClick={onExit}>✕</button>
          <div style={{ flex: 1 }} />
        </header>
        <div className="ex-card" style={{ textAlign: 'center' }}>
          <h2>{t('practiceEmpty')}</h2>
          <p style={{ color: 'var(--ink-soft)' }}>{t('practiceEmptyDesc')}</p>
        </div>
      </div>
    )
  }

  const done = idx >= exercises.length
  const outOfHearts = !done && progress.state.hearts <= 0

  useEffect(() => {
    if (!outOfHearts) return
    const timer = setTimeout(() => onExit(), 1400)
    return () => clearTimeout(timer)
  }, [outOfHearts, onExit])

  if (done) {
    const score = Math.max(5, correct * 3 - mistakes)
    // Mani por práctica según % de aciertos
    const pct = correct / exercises.length
    const maniReward = pct >= 0.9 ? 6 : pct >= 0.7 ? 5 : pct >= 0.5 ? 3 : 2
    progress.addMani(maniReward)
    playLessonComplete()
    setTimeout(() => onFinish(score, correct, exercises.length, maniReward), 0)
    return null
  }

  const current = exercises[idx]

  const handleResult = (isCorrect) => {
    if (current?.targetWord)  recordAnswer(current.targetWord, isCorrect)
    if (current?.targetWords) recordAnswers(current.targetWords, isCorrect)
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
          if (confirm(t('exitPracticeConfirm'))) onExit()
        }}>✕</button>
        <div className="progress-bar practice">
          <div className="progress-fill" style={{ width: `${(idx / exercises.length) * 100}%` }} />
        </div>
        <Hearts
          hearts={progress.state.hearts}
          max={progress.MAX_HEARTS}
          nextRegenAt={progress.state.nextRegenAt}
          lang={lang}
          compact
        />
      </header>

      <div className="practice-banner">
        🎲 {t('practiceLabel')} · {t('practiceProgress', { i: idx + 1, n: exercises.length })}
      </div>

      <div className="exercise-area" key={idx}>
        {current.type === 'mc' && <MultipleChoice ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'listen' && <ListenChoose ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'match' && <Matching ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'build' && <SentenceBuilder ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'sitelen-mc' && <SitelenMc ex={current} lang={lang} onResult={handleResult} />}
        {current.type === 'sitelen-pair' && <SitelenPair ex={current} lang={lang} onResult={handleResult} />}
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
