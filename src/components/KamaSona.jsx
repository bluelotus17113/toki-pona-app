import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { isPlayedToday, markPlayedToday } from '../utils/dailyPlay.js'
import DailyLockedScreen from './DailyLockedScreen.jsx'

const GAME_ID = 'kamasona'

// Minijuego de memoria: emparejar glifo sitelen ↔ significado.
// Las palabras vienen de las lecciones que el usuario completó (refuerza
// vocabulario aprendido). Si completó <4 lecciones, usa pool de fallback.

const LEVELS = {
  easy:   { pairs: 4, cols: 4 },
  medium: { pairs: 6, cols: 4 },
  hard:   { pairs: 8, cols: 4 }
}

const FALLBACK_WORDS = ['toki', 'pona', 'mi', 'sina', 'ona', 'jan', 'moku', 'ike']

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickWords(completed, count) {
  const pool = new Set()
  for (const lessonId of completed) {
    const l = LESSONS.find(x => x.id === lessonId)
    if (!l) continue
    for (const w of (l.words ?? [])) {
      if (VOCAB[w]) pool.add(w)
    }
  }
  // si la pool es muy chica usar fallback
  const fallbackAdded = FALLBACK_WORDS.filter(w => VOCAB[w])
  for (const w of fallbackAdded) {
    if (pool.size < count * 2) pool.add(w)
  }
  return shuffle(Array.from(pool)).slice(0, count)
}

function buildBoard(words) {
  // 2 cartas por palabra: una con glifo, otra con significado
  const cards = []
  words.forEach((w, i) => {
    cards.push({ id: `${w}-glyph`, word: w, kind: 'glyph', pairKey: i })
    cards.push({ id: `${w}-mean`,  word: w, kind: 'mean',  pairKey: i })
  })
  return shuffle(cards)
}

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function KamaSona({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)

  // Bloqueo diario
  if (isPlayedToday(GAME_ID)) {
    return <DailyLockedScreen icon="🃏" title={t('kamaSonaTitle')} lang={lang} onExit={onExit} />
  }

  const [level, setLevel] = useState(null)
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])   // ids actualmente boca-arriba (max 2)
  const [matched, setMatched] = useState([])   // pairKeys completados
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const [won, setWon] = useState(false)
  const [maniReward, setManiReward] = useState(0)
  const flipBackTimer = useRef(null)

  const completed = progress?.state?.completed ?? []

  // cronómetro
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])

  // detectar victoria
  useEffect(() => {
    if (!level || won) return
    if (matched.length > 0 && matched.length === LEVELS[level].pairs) {
      setRunning(false)
      setWon(true)
      // recompensa: base 5 fácil / 10 medio / 15 difícil + bonus por sin errores
      const base = level === 'easy' ? 5 : level === 'medium' ? 10 : 15
      const bonus = mistakes === 0 ? Math.round(base * 0.6) : 0
      const reward = base + bonus
      setManiReward(reward)
      progress.addMani(reward)
      unlock('kama-sona-first-win')
      if (mistakes === 0) unlock('kama-sona-perfect')
      markPlayedToday(GAME_ID)
      playLessonComplete()
    }
  }, [matched, level])

  // limpiar timer al desmontar
  useEffect(() => () => {
    if (flipBackTimer.current) clearTimeout(flipBackTimer.current)
  }, [])

  const startLevel = (lvl) => {
    playClick()
    const words = pickWords(completed, LEVELS[lvl].pairs)
    if (words.length < LEVELS[lvl].pairs) return
    setLevel(lvl)
    setCards(buildBoard(words))
    setFlipped([])
    setMatched([])
    setAttempts(0)
    setMistakes(0)
    setSeconds(0)
    setRunning(true)
    setWon(false)
    setManiReward(0)
  }

  const handleFlip = (card) => {
    if (!running) return
    if (flipped.length >= 2) return
    if (flipped.find(c => c.id === card.id)) return
    if (matched.includes(card.pairKey)) return

    const next = [...flipped, card]
    setFlipped(next)
    playClick()

    if (next.length === 2) {
      setAttempts(a => a + 1)
      const [a, b] = next
      if (a.pairKey === b.pairKey) {
        // match
        setTimeout(() => {
          setMatched(m => [...m, a.pairKey])
          setFlipped([])
          playSuccess()
        }, 450)
      } else {
        // no match
        setMistakes(m => m + 1)
        flipBackTimer.current = setTimeout(() => {
          setFlipped([])
          playError()
        }, 900)
      }
    }
  }

  const resetToMenu = () => {
    playClick()
    setLevel(null)
    setWon(false)
    setRunning(false)
  }

  // ============ Pantalla de selección de nivel ============
  if (!level) {
    return (
      <div className="kamasona-screen">
        <header className="kamasona-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kamasona-title-block">
            <h2>🃏 {t('kamaSonaTitle')}</h2>
            <p>{t('kamaSonaSub')}</p>
          </div>
        </header>

        <div className="kamasona-banner">
          {t('kamaSonaIntro')}
        </div>

        <div className="kamasona-level-list">
          <button className="kamasona-level easy" onClick={() => startLevel('easy')}>
            <span className="kamasona-level-icon">🌱</span>
            <span className="kamasona-level-text">
              <span className="kamasona-level-title">{t('kamaSonaEasy')}</span>
              <span className="kamasona-level-sub">{t('kamaSonaPairs', { n: LEVELS.easy.pairs })} · 🪙 +5</span>
            </span>
          </button>
          <button className="kamasona-level medium" onClick={() => startLevel('medium')}>
            <span className="kamasona-level-icon">🌿</span>
            <span className="kamasona-level-text">
              <span className="kamasona-level-title">{t('kamaSonaMedium')}</span>
              <span className="kamasona-level-sub">{t('kamaSonaPairs', { n: LEVELS.medium.pairs })} · 🪙 +10</span>
            </span>
          </button>
          <button className="kamasona-level hard" onClick={() => startLevel('hard')}>
            <span className="kamasona-level-icon">🌳</span>
            <span className="kamasona-level-text">
              <span className="kamasona-level-title">{t('kamaSonaHard')}</span>
              <span className="kamasona-level-sub">{t('kamaSonaPairs', { n: LEVELS.hard.pairs })} · 🪙 +15</span>
            </span>
          </button>
        </div>

        <div className="kamasona-footnote">
          {completed.length === 0
            ? t('kamaSonaNoProgress')
            : t('kamaSonaUsesWords', { n: completed.length })}
        </div>
      </div>
    )
  }

  // ============ Pantalla de juego ============
  return (
    <div className="kamasona-screen game">
      <header className="kamasona-game-header">
        <button className="exit-btn" onClick={resetToMenu}>←</button>
        <div className="kamasona-game-stats">
          <span className="ks-stat">⏱ {fmtTime(seconds)}</span>
          <span className="ks-stat">{t('kamaSonaAttempts')}: {attempts}</span>
          <span className="ks-stat">{matched.length}/{LEVELS[level].pairs}</span>
        </div>
      </header>

      <div className={`kamasona-grid cols-${LEVELS[level].cols}`}>
        {cards.map(card => {
          const isFlipped = flipped.some(c => c.id === card.id) || matched.includes(card.pairKey)
          const isMatched = matched.includes(card.pairKey)
          const entry = VOCAB[card.word]
          return (
            <button
              key={card.id}
              className={`ks-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
              onClick={() => handleFlip(card)}
              disabled={isMatched || won}
              aria-label={isFlipped ? card.word : 'carta'}
            >
              <div className="ks-card-inner">
                <div className="ks-card-back">
                  <span className="ks-card-back-dot">·</span>
                </div>
                <div className="ks-card-front">
                  {card.kind === 'glyph' ? (
                    <span className="sitelen ks-card-glyph">{card.word}</span>
                  ) : (
                    <span className="ks-card-mean">{entry?.[lang] ?? entry?.es ?? card.word}</span>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {won && (
        <div className="kamasona-win-overlay" role="alert">
          <div className="kamasona-win-card">
            <div className="kamasona-win-icon">🏆</div>
            <h3>{t('kamaSonaWinTitle')}</h3>
            <div className="kamasona-win-stats">
              <div><strong>{fmtTime(seconds)}</strong> · {t('kamaSonaTime')}</div>
              <div><strong>{attempts}</strong> · {t('kamaSonaAttempts')}</div>
              <div><strong>{mistakes}</strong> · {t('kamaSonaMistakes')}</div>
            </div>
            <div className="kamasona-win-reward">
              🪙 +{maniReward} mani {mistakes === 0 && <span className="kamasona-win-perfect">{t('kamaSonaPerfect')}</span>}
            </div>
            <p className="kamasona-win-note">{t('dailyLockedTomorrow')}</p>
            <div className="kamasona-win-actions">
              <button className="kamasona-win-btn primary" onClick={onExit}>
                {t('dailyLockedBack')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
