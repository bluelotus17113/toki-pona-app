import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { isPlayedToday, markPlayedToday } from '../utils/dailyPlay.js'
import DailyLockedScreen from './DailyLockedScreen.jsx'

// Minijuego "sitelen sin" (caligrafía):
// Mostramos el glifo en gris claro como guía y el usuario lo traza encima.
// No validamos precisión — solo confirmamos que dibujó algo antes de avanzar.
// 8 palabras por sesión, daily-locked.

const GAME_ID = 'sitelensin'
const ROUNDS = 8
const STROKE_COLOR_LIGHT = '#1b2099'
const STROKE_COLOR_DARK = '#e6e9ff'

const FALLBACK_WORDS = ['toki', 'pona', 'mi', 'sina', 'jan', 'moku', 'ike', 'telo', 'suno', 'kasi']

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
      if (VOCAB[w] && /^[a-z]+$/.test(w) && w.length >= 2) set.add(w)
    }
  }
  for (const w of FALLBACK_WORDS) {
    if (set.size < ROUNDS + 4) set.add(w)
  }
  return Array.from(set)
}

export default function SitelenSin({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)

  const [started, setStarted] = useState(false)
  const [words, setWords] = useState([])
  const [idx, setIdx] = useState(0)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [done, setDone] = useState(false)
  const [maniReward, setManiReward] = useState(0)

  const canvasRef = useRef(null)
  const isDrawingRef = useRef(false)
  const lastPosRef = useRef(null)
  const completed = progress?.state?.completed ?? []

  const currentWord = !done && started ? words[idx] : null

  const start = () => {
    playClick()
    const pool = pickPool(completed)
    if (pool.length < 1) return
    const picked = shuffle(pool).slice(0, ROUNDS)
    setWords(picked)
    setIdx(0)
    setHasDrawn(false)
    setDone(false)
    setManiReward(0)
    setStarted(true)
  }

  // Configurar el canvas cuando aparece o cambia la palabra
  useEffect(() => {
    if (!currentWord || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    // ajustar resolución al tamaño real
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    ctx.lineWidth = 6
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    // detectar tema activo para color de trazo
    const isDark = document.documentElement.classList.contains('theme-dark')
    ctx.strokeStyle = isDark ? STROKE_COLOR_DARK : STROKE_COLOR_LIGHT
    setHasDrawn(false)
    lastPosRef.current = null
  }, [idx, currentWord])

  const getPos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    let x, y
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }
    return { x, y }
  }

  const startDraw = (e) => {
    e.preventDefault()
    isDrawingRef.current = true
    const pos = getPos(e)
    lastPosRef.current = pos
    setHasDrawn(true)
  }

  const draw = (e) => {
    if (!isDrawingRef.current) return
    e.preventDefault()
    const ctx = canvasRef.current.getContext('2d')
    const pos = getPos(e)
    const last = lastPosRef.current
    if (last) {
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(pos.x, pos.y)
      ctx.stroke()
    }
    lastPosRef.current = pos
  }

  const stopDraw = () => {
    isDrawingRef.current = false
    lastPosRef.current = null
  }

  const clearCanvas = () => {
    playClick()
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    setHasDrawn(false)
  }

  const advance = () => {
    if (!hasDrawn) return
    playSuccess()
    if (idx + 1 >= ROUNDS) {
      // terminó
      const reward = ROUNDS * 2  // 2 mani por glifo trazado
      setManiReward(reward)
      progress.addMani(reward)
      unlock('sitelen-sin-first-win')
      unlock('sitelen-sin-complete')
      markPlayedToday(GAME_ID)
      playLessonComplete()
      setDone(true)
    } else {
      setIdx(i => i + 1)
    }
  }

  const skipWord = () => {
    if (!confirm(t('sitelenSinSkipConfirm'))) return
    if (idx + 1 >= ROUNDS) {
      const reward = idx * 2
      setManiReward(reward)
      if (reward > 0) progress.addMani(reward)
      markPlayedToday(GAME_ID)
      setDone(true)
    } else {
      setIdx(i => i + 1)
    }
  }

  const wordMeaning = useMemo(() => {
    if (!currentWord) return ''
    const entry = VOCAB[currentWord]
    return entry?.[lang] ?? entry?.es ?? currentWord
  }, [currentWord, lang])

  // Bloqueo diario después de todos los hooks (Rules of Hooks).
  if (isPlayedToday(GAME_ID)) {
    return <DailyLockedScreen icon="✍️" title={t('sitelenSinTitle')} lang={lang} onExit={onExit} />
  }

  // ============ Intro ============
  if (!started) {
    return (
      <div className="sitelensin-screen">
        <header className="sitelensin-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="sitelensin-title-block">
            <h2>✍️ {t('sitelenSinTitle')}</h2>
            <p>{t('sitelenSinSub')}</p>
          </div>
        </header>

        <div className="sitelensin-banner">{t('sitelenSinIntro')}</div>

        <div className="sitelensin-rules">
          <div className="sitelensin-rule"><span>👀</span><span>{t('sitelenSinRule1')}</span></div>
          <div className="sitelensin-rule"><span>👆</span><span>{t('sitelenSinRule2')}</span></div>
          <div className="sitelensin-rule"><span>🪙</span><span>{t('sitelenSinRule3')}</span></div>
        </div>

        <button className="sitelensin-start" onClick={start}>
          {t('sitelenSinStart')}
        </button>
      </div>
    )
  }

  // ============ Resultados ============
  if (done) {
    return (
      <div className="sitelensin-screen done">
        <header className="sitelensin-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="sitelensin-title-block">
            <h2>🏆 {t('sitelenSinResultTitle')}</h2>
          </div>
        </header>

        <div className="sitelensin-result">
          <div className="sitelensin-result-icon">✨</div>
          <div className="sitelensin-result-title">{t('sitelenSinResultSub')}</div>
          <div className="sitelensin-reward">🪙 +{maniReward} mani</div>
          <p className="sitelensin-tomorrow">{t('dailyLockedTomorrow')}</p>
          <button className="sitelensin-result-btn primary" onClick={onExit}>
            {t('dailyLockedBack')}
          </button>
        </div>
      </div>
    )
  }

  // ============ Juego ============
  return (
    <div className="sitelensin-screen game">
      <header className="sitelensin-game-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) onExit()
        }}>✕</button>
        <div className="sitelensin-progress-bar">
          <div
            className="sitelensin-progress-fill"
            style={{ width: `${(idx / ROUNDS) * 100}%` }}
          />
        </div>
        <div className="sitelensin-round-info">
          {idx + 1}/{ROUNDS}
        </div>
      </header>

      <div className="sitelensin-prompt">
        <span className="sitelensin-word-latin">{currentWord}</span>
        <span className="sitelensin-word-meaning">{wordMeaning}</span>
      </div>

      <div className="sitelensin-canvas-wrap">
        {/* Glifo template en gris claro detrás del canvas */}
        <div className="sitelensin-template sitelen" aria-hidden="true">
          {currentWord}
        </div>
        <canvas
          ref={canvasRef}
          className="sitelensin-canvas"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>

      <div className="sitelensin-actions">
        <button className="sitelensin-btn-clear" onClick={clearCanvas}>
          🗑 {t('sitelenSinClear')}
        </button>
        <button className="sitelensin-btn-skip" onClick={skipWord}>
          {t('sitelenSinSkip')}
        </button>
        <button
          className={`sitelensin-btn-next ${hasDrawn ? '' : 'disabled'}`}
          onClick={advance}
          disabled={!hasDrawn}
        >
          {t('sitelenSinNext')} →
        </button>
      </div>
    </div>
  )
}
