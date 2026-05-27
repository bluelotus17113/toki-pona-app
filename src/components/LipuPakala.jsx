import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { isPlayedToday, markPlayedToday } from '../utils/dailyPlay.js'
import DailyLockedScreen from './DailyLockedScreen.jsx'
import SentenceBuilder from './exercises/SentenceBuilder.jsx'

const GAME_ID = 'lipupakala'

// Minijuego "lipu pakala" (frase rota): se muestra una traducción y el usuario
// debe ordenar las palabras en toki pona correctas. 5 frases por ronda.

const ROUND_SIZE = 5

// Frases fallback si el usuario aún no completó lecciones.
const FALLBACK_PHRASES = [
  { tp: 'mi pona',          es: 'yo estoy bien',         en: 'I am well' },
  { tp: 'sina suwi',        es: 'eres lindo/a',          en: 'you are cute' },
  { tp: 'mi olin e sina',   es: 'te amo',                en: 'I love you' },
  { tp: 'jan li ike',       es: 'la persona es mala',    en: 'the person is bad' },
  { tp: 'ona li pona',      es: 'él/ella está bien',     en: 'they are well' },
  { tp: 'mi moku',          es: 'yo como',               en: 'I eat' },
  { tp: 'mi wile e telo',   es: 'quiero agua',           en: 'I want water' },
  { tp: 'sina pona lukin',  es: 'te ves bien',           en: 'you look good' }
]

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Recolecta phrases de las lecciones completadas. Las frases muy cortas (1 palabra)
// o muy largas (>6) las filtramos: 2-6 palabras es lo ideal para el juego.
function collectPhrases(completedIds) {
  const out = []
  for (const id of completedIds) {
    const l = LESSONS.find(x => x.id === id)
    if (!l) continue
    for (const p of (l.phrases ?? [])) {
      const wordCount = p.tp.split(/\s+/).length
      if (wordCount >= 2 && wordCount <= 6) out.push(p)
    }
  }
  return out
}

function pickRoundPhrases(completedIds) {
  let pool = collectPhrases(completedIds)
  if (pool.length < ROUND_SIZE) {
    pool = pool.concat(FALLBACK_PHRASES)
  }
  return shuffle(pool).slice(0, ROUND_SIZE)
}

// Construye el "ex" para SentenceBuilder a partir de una frase y el idioma.
function buildExercise(phrase, lang) {
  const answer = phrase.tp.split(/\s+/).filter(Boolean)
  // tokens desordenados, asegurando que no quede igual a answer
  let tokens = shuffle(answer)
  if (tokens.length > 1 && tokens.every((t, i) => t === answer[i])) {
    // si por azar quedó igual, swap los primeros dos
    [tokens[0], tokens[1]] = [tokens[1], tokens[0]]
  }
  const prompt = phrase[lang] ?? phrase.es
  return { tokens, answer, prompt }
}

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function LipuPakala({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)

  if (isPlayedToday(GAME_ID)) {
    return <DailyLockedScreen icon="🧩" title={t('lipuPakalaTitle')} lang={lang} onExit={onExit} />
  }

  const [started, setStarted] = useState(false)
  const [phrases, setPhrases] = useState([])
  const [idx, setIdx] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [maniReward, setManiReward] = useState(0)
  const [exerciseKey, setExerciseKey] = useState(0) // fuerza remount de SentenceBuilder

  const completed = progress?.state?.completed ?? []

  // cronómetro
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  // construir ejercicio actual
  const currentEx = useMemo(() => {
    if (!started || done) return null
    const p = phrases[idx]
    if (!p) return null
    return buildExercise(p, lang)
  }, [started, done, phrases, idx, lang, exerciseKey])

  const start = () => {
    playClick()
    setPhrases(pickRoundPhrases(completed))
    setIdx(0)
    setCorrect(0)
    setSeconds(0)
    setRunning(true)
    setDone(false)
    setStarted(true)
    setManiReward(0)
    setExerciseKey(k => k + 1)
  }

  const handleResult = (isCorrect) => {
    if (isCorrect) {
      setCorrect(c => c + 1)
      playSuccess()
    } else {
      playError()
    }
    // avanzar a siguiente frase
    if (idx + 1 >= phrases.length) {
      // terminó
      setRunning(false)
      setDone(true)
      const newCorrect = isCorrect ? correct + 1 : correct
      // recompensa: 2 mani por acierto + 5 bonus si perfecto
      const reward = newCorrect * 2 + (newCorrect === ROUND_SIZE ? 5 : 0)
      setManiReward(reward)
      progress.addMani(reward)
      unlock('lipu-pakala-first-win')
      if (newCorrect === ROUND_SIZE) unlock('lipu-pakala-perfect')
      markPlayedToday(GAME_ID)
      playLessonComplete()
    } else {
      setIdx(i => i + 1)
      setExerciseKey(k => k + 1)
    }
  }

  // ============ Pantalla intro ============
  if (!started) {
    return (
      <div className="lipupakala-screen">
        <header className="lipupakala-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="lipupakala-title-block">
            <h2>🧩 {t('lipuPakalaTitle')}</h2>
            <p>{t('lipuPakalaSub')}</p>
          </div>
        </header>

        <div className="lipupakala-banner">
          {t('lipuPakalaIntro')}
        </div>

        <div className="lipupakala-rules">
          <div className="lipupakala-rule">
            <span className="lipupakala-rule-icon">📝</span>
            <span>{t('lipuPakalaRule1')}</span>
          </div>
          <div className="lipupakala-rule">
            <span className="lipupakala-rule-icon">⏱</span>
            <span>{t('lipuPakalaRule2')}</span>
          </div>
          <div className="lipupakala-rule">
            <span className="lipupakala-rule-icon">🪙</span>
            <span>{t('lipuPakalaRule3')}</span>
          </div>
        </div>

        <button className="lipupakala-start" onClick={start}>
          {t('lipuPakalaStart')}
        </button>

        <div className="lipupakala-footnote">
          {completed.length === 0
            ? t('lipuPakalaNoProgress')
            : t('lipuPakalaUsesPhrases', { n: completed.length })}
        </div>
      </div>
    )
  }

  // ============ Pantalla de resultados ============
  if (done) {
    const accuracy = Math.round((correct / ROUND_SIZE) * 100)
    return (
      <div className="lipupakala-screen done">
        <header className="lipupakala-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="lipupakala-title-block">
            <h2>🏆 {t('lipuPakalaResultTitle')}</h2>
            <p>{fmtTime(seconds)}</p>
          </div>
        </header>

        <div className="lipupakala-result">
          <div className="lipupakala-score">
            <div className="lipupakala-score-big">{correct}/{ROUND_SIZE}</div>
            <div className="lipupakala-score-sub">{accuracy}% · {t('lipuPakalaAccuracy')}</div>
          </div>

          <div className="lipupakala-reward">
            🪙 +{maniReward} mani
            {correct === ROUND_SIZE && (
              <span className="lipupakala-perfect">{t('lipuPakalaPerfect')}</span>
            )}
          </div>

          <p className="lipupakala-tomorrow">{t('dailyLockedTomorrow')}</p>
          <div className="lipupakala-result-actions">
            <button className="lipupakala-result-btn primary" onClick={onExit}>
              {t('dailyLockedBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ Pantalla de juego ============
  return (
    <div className="lipupakala-screen game">
      <header className="lipupakala-game-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) onExit()
        }}>✕</button>
        <div className="lipupakala-progress-bar">
          <div
            className="lipupakala-progress-fill"
            style={{ width: `${(idx / phrases.length) * 100}%` }}
          />
        </div>
        <div className="lipupakala-game-stats">
          <span className="lp-stat">⏱ {fmtTime(seconds)}</span>
          <span className="lp-stat">{idx + 1}/{phrases.length}</span>
        </div>
      </header>

      <div className="lipupakala-exercise" key={exerciseKey}>
        {currentEx && (
          <SentenceBuilder ex={currentEx} lang={lang} onResult={handleResult} />
        )}
      </div>
    </div>
  )
}
