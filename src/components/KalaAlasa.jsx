import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { isPlayedToday, markPlayedToday } from '../utils/dailyPlay.js'
import DailyLockedScreen from './DailyLockedScreen.jsx'

const GAME_ID = 'kalaalasa'

// Minijuego "kala alasa" (pesca arcade):
// Peces con palabras TP nadan por la pantalla. Arriba aparece un significado
// y debés atrapar el pez con la palabra correcta. 60 segundos. Combo si
// aciertas seguidos. Tocar incorrecto resta vida.

const DURATION_SEC = 60
const HEARTS = 3
const LANES = 4              // filas paralelas donde nadan los peces
const SPAWN_INTERVAL = 1100  // ms entre nuevos peces
const FISH_SPEED = 60        // px/s (varía un poco por pez)
const TICK_MS = 60           // intervalo de actualización de posiciones

const FALLBACK_WORDS = [
  'toki', 'pona', 'mi', 'sina', 'ona', 'jan', 'moku', 'ike', 'telo', 'kili',
  'lili', 'suli', 'mute', 'wile', 'kama', 'tawa', 'wile', 'pilin', 'olin'
]

const SKIP_FOR_GAME = new Set(['e', 'li', 'la', 'pi', 'a', 'kin', 'taso', 'anu', 'en'])

const FISH_EMOJI = ['🐟', '🐠', '🐡', '🐬']

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
      if (VOCAB[w] && !SKIP_FOR_GAME.has(w)) set.add(w)
    }
  }
  for (const w of FALLBACK_WORDS) {
    if (set.size < 16) set.add(w)
  }
  return Array.from(set)
}

let fishIdCounter = 0
function makeFish(width, pool) {
  const word = pool[Math.floor(Math.random() * pool.length)]
  return {
    id: ++fishIdCounter,
    word,
    x: width + 80,
    lane: Math.floor(Math.random() * LANES),
    speed: FISH_SPEED + Math.random() * 20,
    emoji: FISH_EMOJI[Math.floor(Math.random() * FISH_EMOJI.length)]
  }
}

export default function KalaAlasa({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)

  if (isPlayedToday(GAME_ID)) {
    return <DailyLockedScreen icon="🎣" title={t('kalaAlasaTitle')} lang={lang} onExit={onExit} />
  }

  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const [fish, setFish] = useState([])
  const [target, setTarget] = useState(null)        // palabra a atrapar
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [hearts, setHearts] = useState(HEARTS)
  const [timeLeft, setTimeLeft] = useState(DURATION_SEC)
  const [maniReward, setManiReward] = useState(0)
  const [flash, setFlash] = useState(null)  // 'good' | 'bad' | null

  const poolRef = useRef([])
  const containerRef = useRef(null)
  const widthRef = useRef(360)
  const tickRef = useRef(null)
  const spawnRef = useRef(null)
  const timerRef = useRef(null)

  const completed = progress?.state?.completed ?? []

  const cleanup = () => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
    if (spawnRef.current) { clearInterval(spawnRef.current); spawnRef.current = null }
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => () => cleanup(), [])

  const start = () => {
    playClick()
    const pool = pickPool(completed)
    if (pool.length < 4) return
    poolRef.current = pool
    setFish([])
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setHearts(HEARTS)
    setTimeLeft(DURATION_SEC)
    setDone(false)
    setManiReward(0)
    setFlash(null)
    setTarget(pool[Math.floor(Math.random() * pool.length)])
    setStarted(true)

    // ancho del contenedor para spawn / despawn
    setTimeout(() => {
      if (containerRef.current) widthRef.current = containerRef.current.clientWidth || 360
    }, 50)
  }

  const finish = (finalScore, finalCombo) => {
    cleanup()
    setDone(true)
    // Recompensa proporcional al score; 0 si no acertó nada o muy poco.
    // Antes había un mínimo de 2 mani garantizado — quitado para que perder
    // sin acertar no genere monedas.
    const reward = Math.floor(finalScore / 5)
    setManiReward(reward)
    if (reward > 0) progress.addMani(reward)
    if (finalScore > 0) unlock('kala-alasa-first-win')
    if (finalCombo >= 10) unlock('kala-alasa-combo-10')
    markPlayedToday(GAME_ID)
    playLessonComplete()
  }

  // Game loop: timer + spawn + tick
  useEffect(() => {
    if (!started || done) return

    // cronómetro
    timerRef.current = setInterval(() => {
      setTimeLeft(s => {
        if (s <= 1) {
          return 0
        }
        return s - 1
      })
    }, 1000)

    // spawn de peces
    spawnRef.current = setInterval(() => {
      setFish(curr => {
        if (curr.length >= 6) return curr  // cap
        return [...curr, makeFish(widthRef.current, poolRef.current)]
      })
    }, SPAWN_INTERVAL)

    // tick de movimiento
    tickRef.current = setInterval(() => {
      const dx = (FISH_SPEED * TICK_MS) / 1000
      setFish(curr => curr
        .map(f => ({ ...f, x: f.x - (f.speed * TICK_MS) / 1000 }))
        .filter(f => f.x > -120)
      )
    }, TICK_MS)

    return cleanup
  }, [started, done])

  // Cuando timeLeft llega a 0, terminar
  useEffect(() => {
    if (started && !done && timeLeft <= 0) {
      finish(score, maxCombo)
    }
  }, [timeLeft, started, done])

  // Cuando no quedan vidas, terminar
  useEffect(() => {
    if (started && !done && hearts <= 0) {
      finish(score, maxCombo)
    }
  }, [hearts, started, done])

  const handleCatch = (f) => {
    if (done) return
    const correct = f.word === target
    if (correct) {
      const multiplier = combo >= 10 ? 3 : combo >= 5 ? 2 : 1
      const points = 2 * multiplier
      setScore(s => s + points)
      const newCombo = combo + 1
      setCombo(newCombo)
      if (newCombo > maxCombo) setMaxCombo(newCombo)
      setFlash('good')
      playSuccess()
      // nuevo target
      const pool = poolRef.current.filter(w => w !== target)
      if (pool.length > 0) {
        setTarget(pool[Math.floor(Math.random() * pool.length)])
      }
    } else {
      setHearts(h => h - 1)
      setCombo(0)
      setFlash('bad')
      playError()
    }
    // remover pez tocado
    setFish(curr => curr.filter(x => x.id !== f.id))
    setTimeout(() => setFlash(null), 250)
  }

  const currentTargetMeaning = useMemo(() => {
    if (!target) return ''
    const entry = VOCAB[target]
    if (!entry) return target
    return entry[lang] ?? entry.es
  }, [target, lang])

  // ============ Intro ============
  if (!started) {
    return (
      <div className="kalaalasa-screen">
        <header className="kalaalasa-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kalaalasa-title-block">
            <h2>🎣 {t('kalaAlasaTitle')}</h2>
            <p>{t('kalaAlasaSub')}</p>
          </div>
        </header>

        <div className="kalaalasa-banner">{t('kalaAlasaIntro')}</div>

        <div className="kalaalasa-rules">
          <div className="kalaalasa-rule"><span>🎯</span><span>{t('kalaAlasaRule1')}</span></div>
          <div className="kalaalasa-rule"><span>🔥</span><span>{t('kalaAlasaRule2')}</span></div>
          <div className="kalaalasa-rule"><span>❤️</span><span>{t('kalaAlasaRule3')}</span></div>
          <div className="kalaalasa-rule"><span>🪙</span><span>{t('kalaAlasaRule4')}</span></div>
        </div>

        <button className="kalaalasa-start" onClick={start}>
          {t('kalaAlasaStart')}
        </button>
      </div>
    )
  }

  // ============ Resultados ============
  if (done) {
    return (
      <div className="kalaalasa-screen done">
        <header className="kalaalasa-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kalaalasa-title-block">
            <h2>🏆 {t('kalaAlasaResultTitle')}</h2>
          </div>
        </header>

        <div className="kalaalasa-result">
          <div className="kalaalasa-score">
            <div className="kalaalasa-score-big">{score}</div>
            <div className="kalaalasa-score-sub">{t('kalaAlasaScore')}</div>
          </div>
          <div className="kalaalasa-stats">
            <div>🔥 {t('kalaAlasaMaxCombo')}: <strong>{maxCombo}</strong></div>
          </div>
          <div className="kalaalasa-reward">🪙 +{maniReward} mani</div>
          <p className="kalaalasa-tomorrow">{t('dailyLockedTomorrow')}</p>
          <div className="kalaalasa-result-actions">
            <button className="kalaalasa-result-btn primary" onClick={onExit}>
              {t('dailyLockedBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ Juego ============
  return (
    <div className={`kalaalasa-screen game ${flash ? 'flash-' + flash : ''}`}>
      <header className="kalaalasa-game-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) { cleanup(); onExit() }
        }}>✕</button>
        <div className="kalaalasa-hud">
          <span className="kalaalasa-hud-time">⏱ {timeLeft}s</span>
          <span className="kalaalasa-hud-score">⭐ {score}</span>
          <span className="kalaalasa-hud-combo">🔥 x{combo >= 10 ? 3 : combo >= 5 ? 2 : 1}</span>
          <span className="kalaalasa-hud-hearts">
            {Array.from({ length: HEARTS }).map((_, i) => (
              <span key={i}>{i < hearts ? '❤️' : '🤍'}</span>
            ))}
          </span>
        </div>
      </header>

      <div className="kalaalasa-target">
        <div className="kalaalasa-target-label">{t('kalaAlasaCatch')}</div>
        <div className="kalaalasa-target-meaning">"{currentTargetMeaning}"</div>
      </div>

      <div className="kalaalasa-arena" ref={containerRef}>
        {fish.map(f => (
          <button
            key={f.id}
            className="kalaalasa-fish"
            onClick={() => handleCatch(f)}
            style={{
              left: `${f.x}px`,
              top: `${10 + f.lane * 60}px`
            }}
          >
            <span className="kalaalasa-fish-emoji">{f.emoji}</span>
            <span className="kalaalasa-fish-word">{f.word}</span>
          </button>
        ))}
        {/* "olas" decorativas */}
        {Array.from({ length: LANES }).map((_, i) => (
          <div key={i} className="kalaalasa-wave" style={{ top: `${48 + i * 60}px` }}>
            ～～～～～～
          </div>
        ))}
      </div>
    </div>
  )
}
