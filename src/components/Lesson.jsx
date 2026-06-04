import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { buildLessonExercises } from '../data/exerciseBuilder.js'
import { makeT } from '../data/i18n.js'
import { primeAudio } from '../hooks/useSpeech.js'
import { playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { hapticHeavy } from '../hooks/useHaptics.js'
import { unlock } from '../hooks/useAchievements.js'
import { recordAnswer, recordAnswers } from '../hooks/useSrs.js'
import { loadDraft, saveDraft, clearDraft } from '../utils/lessonDraft.js'
import MultipleChoice from './exercises/MultipleChoice.jsx'
import Matching from './exercises/Matching.jsx'
import SentenceBuilder from './exercises/SentenceBuilder.jsx'
import ListenChoose from './exercises/ListenChoose.jsx'
import SitelenMc from './exercises/SitelenMc.jsx'
import SitelenPair from './exercises/SitelenPair.jsx'
import Hearts from './Hearts.jsx'
import LessonIntro from './LessonIntro.jsx'

// Mensaje del banner de combo (X respuestas seguidas).
// Devuelve { icon, key, args } — el componente hace el t(key, args).
function comboMessage(n) {
  if (n >= 25) return { icon: '🚀', key: 'comboMilestone25', args: { n } }
  if (n >= 20) return { icon: '🌟', key: 'comboMilestone20', args: { n } }
  if (n >= 15) return { icon: '💎', key: 'comboMilestone15', args: { n } }
  if (n >= 10) return { icon: '⚡', key: 'comboMilestone10', args: { n } }
  return         { icon: '🔥', key: 'comboMilestone5',  args: { n } }
}

// Emite N partículas con ángulo + distancia random desde el centro de su contenedor.
// El padre controla la posición (fixed center para success-burst, absolute para heart-burst).
function Particles({ count = 12, emojis = ['✨'], minDist = 60, maxDist = 140, className = '' }) {
  const items = useMemo(
    () => Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: Math.random() * 360,
      dist: minDist + Math.random() * (maxDist - minDist),
      delay: Math.random() * 90,
      scale: 0.85 + Math.random() * 0.5,
      emoji: emojis[Math.floor(Math.random() * emojis.length)]
    })),
    [count, emojis, minDist, maxDist]
  )
  return (
    <div className={`particles-burst ${className}`} aria-hidden="true">
      {items.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            '--angle': `${p.angle}deg`,
            '--dist': `${p.dist}px`,
            '--scale': p.scale,
            animationDelay: `${p.delay}ms`
          }}
        >{p.emoji}</span>
      ))}
    </div>
  )
}

export default function Lesson({ lessonId, progress, lang, onFinish, onExit }) {
  const t = makeT(lang)
  const lesson = LESSONS.find(l => l.id === lessonId)
  const exercises = useMemo(() => buildLessonExercises(lesson, lang), [lessonId, lang])

  // Restaurar draft si el usuario había empezado esta lección antes
  const draft = useMemo(() => loadDraft(lessonId, exercises.length, lang), [lessonId, exercises.length, lang])
  const [idx, setIdx] = useState(() => draft?.idx ?? 0)
  const [correct, setCorrect] = useState(() => draft?.correct ?? 0)
  const [mistakes, setMistakes] = useState(() => draft?.mistakes ?? 0)
  const [showIntro, setShowIntro] = useState(() => draft ? false : true)
  const [resumedBadge, setResumedBadge] = useState(!!draft)
  // Feedback visual: 'right' | 'wrong' | null — pinta toda la pantalla por 550ms
  const [flash, setFlash] = useState(null)
  // Token que se incrementa con cada respuesta para remountar las partículas
  const [burstKey, setBurstKey] = useState(0)
  // Shake del contador de vidas cuando perdés una
  const [heartShake, setHeartShake] = useState(false)
  const prevHeartsRef = useRef(progress.state.hearts)
  // Combo: respuestas correctas consecutivas + banner cuando cruza un milestone
  const [combo, setCombo] = useState(0)
  const [comboBanner, setComboBanner] = useState(null)
  // Celebración de lección perfecta (overlay 1.5s antes del resultado)
  const [perfectShow, setPerfectShow] = useState(false)

  useEffect(() => { primeAudio() }, [])

  // Detectar caída de vidas para gatillar shake + shatter
  useEffect(() => {
    if (progress.state.hearts < prevHeartsRef.current) {
      setHeartShake(true)
      const id = setTimeout(() => setHeartShake(false), 720)
      prevHeartsRef.current = progress.state.hearts
      return () => clearTimeout(id)
    }
    prevHeartsRef.current = progress.state.hearts
  }, [progress.state.hearts])

  // Auto-save: persistir progreso cada vez que cambia algo relevante
  useEffect(() => {
    // No guardar antes de empezar (idx 0 + showIntro)
    if (idx === 0 && showIntro) return
    // No guardar si ya terminó (se limpia al completar)
    if (idx >= exercises.length) return
    saveDraft(lessonId, { idx, correct, mistakes, showIntro, total: exercises.length, lang })
  }, [idx, correct, mistakes, showIntro, lessonId, exercises.length, lang])

  // Auto-hide del badge "continuaste donde quedaste" tras 2.5s
  useEffect(() => {
    if (!resumedBadge) return
    const id = setTimeout(() => setResumedBadge(false), 2500)
    return () => clearTimeout(id)
  }, [resumedBadge])

  const done = idx >= exercises.length
  const outOfHearts = !done && progress.state.hearts <= 0

  // Si nos quedamos sin vidas en medio de la lección: salir tras 1.4s
  useEffect(() => {
    if (!outOfHearts) return
    const timer = setTimeout(() => onExit(), 1400)
    return () => clearTimeout(timer)
  }, [outOfHearts, onExit])

  if (!lesson) return <div>{t('lessonNotFound')}</div>

  if (showIntro) {
    return (
      <div className="lesson">
        <header className="lesson-header">
          <button className="exit-btn" onClick={onExit}>✕</button>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '0%' }} />
          </div>
          <Hearts
            hearts={progress.state.hearts}
            max={progress.MAX_HEARTS}
            nextRegenAt={progress.state.nextRegenAt}
            lang={lang}
            compact
          />
        </header>
        <LessonIntro
          lesson={lesson}
          lang={lang}
          onStart={() => setShowIntro(false)}
        />
      </div>
    )
  }

  if (done) {
    const score = Math.max(5, correct * 2 - mistakes)
    if (mistakes === 0) unlock('perfect-lesson')
    // Recompensa en mani: 3 base + 3 bonus si fue perfecta
    const maniReward = mistakes === 0 ? 6 : 3
    if (!perfectShow) {
      progress.addMani(maniReward)
      playLessonComplete()
      clearDraft(lessonId)
      if (mistakes === 0) {
        // Mostrar celebración 1.5s antes de navegar
        setPerfectShow(true)
        hapticHeavy()
        setTimeout(() => onFinish(lesson.id, score, maniReward), 1500)
      } else {
        setTimeout(() => onFinish(lesson.id, score, maniReward), 0)
        return null
      }
    }
    if (perfectShow) {
      return (
        <div className="perfect-celebration" role="status">
          <div className="perfect-celebration-inner">
            <div className="perfect-celebration-icon">🌟</div>
            <h2 className="perfect-celebration-title">{t('perfectLessonTitle')}</h2>
            <p className="perfect-celebration-sub">{t('perfectLessonSub')}</p>
          </div>
          <Particles
            key="perfect-burst"
            count={28}
            emojis={['✨', '⭐', '🌟', '💚', '🌸', '🍃', '💛']}
            minDist={140}
            maxDist={320}
            className="success-burst"
          />
        </div>
      )
    }
    return null
  }

  const current = exercises[idx]
  const total = exercises.length

  const handleResult = (isCorrect) => {
    // Registrar en SRS la(s) palabra(s) trabajada(s) en este ejercicio
    if (current?.targetWord)  recordAnswer(current.targetWord, isCorrect)
    if (current?.targetWords) recordAnswers(current.targetWords, isCorrect)
    setFlash(isCorrect ? 'right' : 'wrong')
    setBurstKey(k => k + 1)
    setTimeout(() => setFlash(null), 550)
    if (isCorrect) {
      const newCombo = combo + 1
      setCombo(newCombo)
      // Banner solo en milestones múltiplos de 5
      if (newCombo >= 5 && newCombo % 5 === 0) {
        setComboBanner(comboMessage(newCombo))
        hapticHeavy()
        setTimeout(() => setComboBanner(null), 1700)
      }
      setCorrect(c => c + 1)
      playSuccess()
    } else {
      setCombo(0)
      setMistakes(m => m + 1)
      progress.loseHeart()
      playError()
    }
    setIdx(i => i + 1)
  }

  return (
    <div className={`lesson ${flash ? `lesson-flash-${flash}` : ''}`}>
      <header className="lesson-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitConfirm'))) onExit()
        }}>✕</button>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(idx / total) * 100}%` }} />
        </div>
        <div className={`lesson-hearts-wrap ${heartShake ? 'shaking' : ''}`}>
          <Hearts
            hearts={progress.state.hearts}
            max={progress.MAX_HEARTS}
            nextRegenAt={progress.state.nextRegenAt}
            lang={lang}
            compact
          />
          {heartShake && (
            <Particles
              key={`heart-${burstKey}`}
              count={10}
              emojis={['💔', '💥', '✖']}
              minDist={30}
              maxDist={75}
              className="heart-burst"
            />
          )}
        </div>
      </header>

      {flash === 'right' && (
        <Particles
          key={`right-${burstKey}`}
          count={18}
          emojis={['✨', '⭐', '🌟', '💚', '🌸', '🍃']}
          minDist={120}
          maxDist={260}
          className="success-burst"
        />
      )}

      {comboBanner && (
        <div className="combo-banner" role="status" aria-live="polite">
          <span className="combo-banner-icon">{comboBanner.icon}</span>
          <span className="combo-banner-text">{t(comboBanner.key, comboBanner.args)}</span>
        </div>
      )}

      {resumedBadge && (
        <div className="lesson-resumed-badge" role="status">
          ↻ {t('lessonResumed')}
        </div>
      )}

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
