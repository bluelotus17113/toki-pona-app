import { useEffect, useMemo, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

// Minijuego "kalama kute" (audio-first):
// El TTS dice una palabra; el usuario elige el glifo correcto entre 4.
// 10 rondas, 3 vidas. Refuerza el reconocimiento auditivo del idioma.

const ROUNDS = 10
const HEARTS = 3
const OPTIONS = 4

// Partículas que no son fáciles de identificar por audio en aislamiento.
const SKIP_FOR_AUDIO = new Set(['e', 'li', 'la', 'pi', 'a', 'kin', 'taso', 'anu', 'en'])

const FALLBACK_WORDS = [
  'toki', 'pona', 'mi', 'sina', 'ona', 'jan', 'moku', 'ike',
  'telo', 'kili', 'lili', 'suli', 'mute', 'wile', 'kama', 'tawa'
]

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickPool(completedIds) {
  const set = new Set()
  for (const id of completedIds) {
    const l = LESSONS.find(x => x.id === id)
    if (!l) continue
    for (const w of (l.words ?? [])) {
      if (VOCAB[w] && !SKIP_FOR_AUDIO.has(w)) set.add(w)
    }
  }
  for (const w of FALLBACK_WORDS) {
    if (set.size < ROUNDS + 8) set.add(w)
  }
  return Array.from(set)
}

function buildRound(pool) {
  const shuffled = shuffle(pool)
  const correct = shuffled[0]
  const distractors = shuffled.slice(1, OPTIONS)
  const options = shuffle([correct, ...distractors])
  return { correct, options }
}

export default function KalamaKute({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)
  const [started, setStarted] = useState(false)
  const [rounds, setRounds] = useState([])
  const [idx, setIdx] = useState(0)
  const [hearts, setHearts] = useState(HEARTS)
  const [correctCount, setCorrectCount] = useState(0)
  const [feedback, setFeedback] = useState(null)  // 'right' | 'wrong' | null
  const [chosen, setChosen] = useState(null)
  const [done, setDone] = useState(false)
  const [maniReward, setManiReward] = useState(0)
  const [locked, setLocked] = useState(false)

  const completed = progress?.state?.completed ?? []
  const current = started && !done ? rounds[idx] : null

  useEffect(() => { primeAudio() }, [])

  // auto-reproducir la palabra al entrar a una nueva ronda
  useEffect(() => {
    if (current && !locked) {
      const id = setTimeout(() => speak(current.correct), 300)
      return () => clearTimeout(id)
    }
  }, [idx, current?.correct, locked])

  const start = () => {
    playClick()
    const pool = pickPool(completed)
    if (pool.length < OPTIONS) return
    const newRounds = []
    for (let i = 0; i < ROUNDS; i++) {
      newRounds.push(buildRound(pool))
    }
    setRounds(newRounds)
    setIdx(0)
    setHearts(HEARTS)
    setCorrectCount(0)
    setFeedback(null)
    setChosen(null)
    setDone(false)
    setManiReward(0)
    setLocked(false)
    setStarted(true)
  }

  const finish = (correctSoFar, heartsLeft) => {
    setDone(true)
    const survived = heartsLeft > 0
    const reward = correctSoFar * 2 + (correctSoFar === ROUNDS ? 5 : 0)
    setManiReward(reward)
    progress.addMani(reward)
    if (survived) {
      unlock('kalama-kute-first-win')
      if (correctSoFar === ROUNDS) unlock('kalama-kute-perfect')
    }
    playLessonComplete()
  }

  const handleReplay = () => {
    if (!current || locked) return
    playClick()
    speak(current.correct)
  }

  const handlePick = (word) => {
    if (locked || !current) return
    setLocked(true)
    setChosen(word)
    const isCorrect = word === current.correct
    if (isCorrect) {
      setFeedback('right')
      setCorrectCount(c => c + 1)
      playSuccess()
    } else {
      setFeedback('wrong')
      setHearts(h => h - 1)
      playError()
    }

    setTimeout(() => {
      const newCorrect = isCorrect ? correctCount + 1 : correctCount
      const newHearts = isCorrect ? hearts : hearts - 1
      const isLastRound = idx + 1 >= ROUNDS
      const noHearts = newHearts <= 0
      if (isLastRound || noHearts) {
        finish(newCorrect, newHearts)
        return
      }
      setIdx(i => i + 1)
      setFeedback(null)
      setChosen(null)
      setLocked(false)
    }, 1100)
  }

  // ============ Pantalla intro ============
  if (!started) {
    return (
      <div className="kalamakute-screen">
        <header className="kalamakute-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kalamakute-title-block">
            <h2>🎧 {t('kalamaKuteTitle')}</h2>
            <p>{t('kalamaKuteSub')}</p>
          </div>
        </header>

        <div className="kalamakute-banner">
          {t('kalamaKuteIntro')}
        </div>

        <div className="kalamakute-rules">
          <div className="kalamakute-rule"><span>🔊</span><span>{t('kalamaKuteRule1')}</span></div>
          <div className="kalamakute-rule"><span>❤️</span><span>{t('kalamaKuteRule2')}</span></div>
          <div className="kalamakute-rule"><span>🪙</span><span>{t('kalamaKuteRule3')}</span></div>
        </div>

        <button className="kalamakute-start" onClick={start}>
          {t('kalamaKuteStart')}
        </button>
      </div>
    )
  }

  // ============ Pantalla resultados ============
  if (done) {
    const accuracy = Math.round((correctCount / ROUNDS) * 100)
    return (
      <div className="kalamakute-screen done">
        <header className="kalamakute-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kalamakute-title-block">
            <h2>🏆 {t('kalamaKuteResultTitle')}</h2>
          </div>
        </header>

        <div className="kalamakute-result">
          <div className="kalamakute-score">
            <div className="kalamakute-score-big">{correctCount}/{ROUNDS}</div>
            <div className="kalamakute-score-sub">{accuracy}% · {t('kalamaKuteAccuracy')}</div>
          </div>
          <div className="kalamakute-reward">
            🪙 +{maniReward} mani
            {correctCount === ROUNDS && (
              <span className="kalamakute-perfect">{t('kalamaKutePerfect')}</span>
            )}
          </div>
          <div className="kalamakute-result-actions">
            <button className="kalamakute-result-btn primary" onClick={start}>
              {t('kalamaKuteAgain')}
            </button>
            <button className="kalamakute-result-btn" onClick={onExit}>
              {t('kalamaKuteBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ Pantalla de juego ============
  return (
    <div className="kalamakute-screen game">
      <header className="kalamakute-game-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) onExit()
        }}>✕</button>
        <div className="kalamakute-progress-bar">
          <div
            className="kalamakute-progress-fill"
            style={{ width: `${(idx / ROUNDS) * 100}%` }}
          />
        </div>
        <div className="kalamakute-hearts">
          {Array.from({ length: HEARTS }).map((_, i) => (
            <span key={i} className="kk-heart">{i < hearts ? '❤️' : '🤍'}</span>
          ))}
        </div>
      </header>

      <div className="kalamakute-game-body">
        <div className="kalamakute-round-info">
          {idx + 1} / {ROUNDS}
        </div>

        <button
          className={`kalamakute-listen-btn ${locked ? 'locked' : ''}`}
          onClick={handleReplay}
          disabled={locked}
        >
          <span className="kalamakute-listen-icon">🔊</span>
          <span className="kalamakute-listen-text">{t('kalamaKuteListen')}</span>
        </button>

        <div className="kalamakute-options">
          {current.options.map(word => {
            const entry = VOCAB[word]
            if (!entry) return null
            const isCorrect = word === current.correct
            const isChosen = chosen === word
            let cls = 'kk-option'
            if (locked) {
              if (isCorrect) cls += ' is-correct'
              else if (isChosen) cls += ' is-wrong'
            }
            return (
              <button
                key={word}
                className={cls}
                onClick={() => handlePick(word)}
                disabled={locked}
              >
                <span className="sitelen kk-option-glyph">{word}</span>
                <span className="kk-option-latin">{word}</span>
              </button>
            )
          })}
        </div>

        {feedback && (
          <div className={`kalamakute-feedback ${feedback}`}>
            {feedback === 'right' ? t('correct') : t('answerIs', { answer: current.correct })}
          </div>
        )}
      </div>
    </div>
  )
}
