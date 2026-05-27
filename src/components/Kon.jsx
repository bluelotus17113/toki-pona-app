import { useEffect, useRef, useState } from 'react'
import { makeT } from '../data/i18n.js'
import { MANTRAS, BREATH_PHASES, BREATH_CYCLE_SECONDS, getMantraOfTheDay } from '../data/mantras.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

// "kon" — sección de meditación. 3 modos: respiración guiada, mantra del día,
// silencio puro. SIN gamificación: no XP, no mani, no daily-lock, no logros
// agresivos. Solo un logro silencioso al usarla 5 veces. Respeta la práctica.

const SESSIONS_KEY = 'tokipona.kon.sessions'
const DURATIONS = [60, 180, 300, 600]  // 1, 3, 5, 10 min

function loadSessionCount() {
  try { return parseInt(localStorage.getItem(SESSIONS_KEY), 10) || 0 } catch { return 0 }
}
function incrementSessions() {
  const next = loadSessionCount() + 1
  try { localStorage.setItem(SESSIONS_KEY, String(next)) } catch {}
  if (next >= 5) unlock('kon-pona')
  return next
}

function fmtTime(s) {
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${String(r).padStart(2, '0')}`
}

export default function Kon({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const [mode, setMode] = useState(null)  // null | 'breathing' | 'mantra' | 'silence'

  const goBack = () => { playClick(); setMode(null) }

  // ============ Hub (lista de modos) ============
  if (!mode) {
    return (
      <div className="kon-screen">
        <header className="kon-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kon-title-block">
            <h2>🍃 {t('konTitle')}</h2>
            <p>{t('konSub')}</p>
          </div>
        </header>

        <div className="kon-quote">
          <em>"toki pona li nasin pi pilin pona."</em>
          <span>{t('konQuote')}</span>
        </div>

        <div className="kon-modes">
          <button className="kon-mode-card breathing" onClick={() => { playClick(); setMode('breathing') }}>
            <span className="kon-mode-icon">🌬️</span>
            <span className="kon-mode-text">
              <span className="kon-mode-title">{t('konBreathTitle')}</span>
              <span className="kon-mode-sub">{t('konBreathSub')}</span>
            </span>
          </button>
          <button className="kon-mode-card mantra" onClick={() => { playClick(); setMode('mantra') }}>
            <span className="kon-mode-icon">🌿</span>
            <span className="kon-mode-text">
              <span className="kon-mode-title">{t('konMantraTitle')}</span>
              <span className="kon-mode-sub">{t('konMantraSub')}</span>
            </span>
          </button>
          <button className="kon-mode-card silence" onClick={() => { playClick(); setMode('silence') }}>
            <span className="kon-mode-icon">🌙</span>
            <span className="kon-mode-text">
              <span className="kon-mode-title">{t('konSilenceTitle')}</span>
              <span className="kon-mode-sub">{t('konSilenceSub')}</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'breathing') return <BreathingMode lang={lang} onBack={goBack} />
  if (mode === 'mantra')    return <MantraMode lang={lang} onBack={goBack} />
  if (mode === 'silence')   return <SilenceMode lang={lang} onBack={goBack} />
  return null
}

// ============================================================
// Modo 1: Respiración guiada (box breathing)
// ============================================================
function BreathingMode({ lang, onBack }) {
  const t = makeT(lang)
  const [durationSec, setDurationSec] = useState(null)  // null = picker
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => { primeAudio() }, [])

  // tick global de tiempo
  useEffect(() => {
    if (durationSec === null || done) return
    const id = setInterval(() => {
      setElapsed(e => {
        const next = e + 1
        if (next >= durationSec) {
          setDone(true)
          if (!startedRef.current) return e
          startedRef.current = false
          return next
        }
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [durationSec, done])

  // contar sesión cuando termina
  useEffect(() => {
    if (done) incrementSessions()
  }, [done])

  const start = (sec) => {
    playClick()
    setDurationSec(sec)
    setElapsed(0)
    setDone(false)
    startedRef.current = true
  }

  // Calcular fase actual dentro del ciclo 16s
  const cyclePos = elapsed % BREATH_CYCLE_SECONDS
  let acc = 0
  let currentPhase = BREATH_PHASES[0]
  let phaseElapsed = 0
  for (const phase of BREATH_PHASES) {
    if (cyclePos < acc + phase.seconds) {
      currentPhase = phase
      phaseElapsed = cyclePos - acc
      break
    }
    acc += phase.seconds
  }
  const remaining = durationSec ? durationSec - elapsed : 0

  // ============ Picker de duración ============
  if (durationSec === null) {
    return (
      <div className="kon-screen kon-breathing-picker">
        <header className="kon-header">
          <button className="exit-btn" onClick={onBack}>←</button>
          <div className="kon-title-block">
            <h2>🌬️ {t('konBreathTitle')}</h2>
            <p>{t('konBreathPicker')}</p>
          </div>
        </header>
        <div className="kon-duration-list">
          {DURATIONS.map(sec => (
            <button key={sec} className="kon-duration-btn" onClick={() => start(sec)}>
              <span className="kon-duration-num">{Math.floor(sec / 60)}</span>
              <span className="kon-duration-unit">{t('konMinutes')}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ============ Terminó ============
  if (done) {
    return (
      <div className="kon-screen kon-done">
        <header className="kon-header">
          <button className="exit-btn" onClick={onBack}>←</button>
        </header>
        <div className="kon-done-card">
          <div className="kon-done-icon">🍃</div>
          <h3 className="kon-done-title">{t('konDoneTitle')}</h3>
          <p className="kon-done-sub">{t('konDoneSub', { n: Math.floor(durationSec / 60) })}</p>
          <button className="kon-done-btn" onClick={onBack}>
            {t('konBack')}
          </button>
        </div>
      </div>
    )
  }

  // ============ Sesión activa ============
  // Escala del círculo según la fase: in → 1.0, hold1 → 1.0, out → 0.45, hold2 → 0.45
  let scale = 0.45
  if (currentPhase.id === 'in') {
    scale = 0.45 + (phaseElapsed / currentPhase.seconds) * 0.55
  } else if (currentPhase.id === 'hold1') {
    scale = 1.0
  } else if (currentPhase.id === 'out') {
    scale = 1.0 - (phaseElapsed / currentPhase.seconds) * 0.55
  } else {
    scale = 0.45
  }

  const phaseTextEs = currentPhase.es
  const phaseTextLocal = currentPhase[lang] ?? currentPhase.es

  return (
    <div className="kon-screen kon-breathing-active">
      <header className="kon-header">
        <button className="exit-btn" onClick={onBack}>✕</button>
        <div className="kon-title-block">
          <span className="kon-remaining">{fmtTime(remaining)}</span>
        </div>
      </header>

      <div className="kon-breath-stage">
        <div
          className="kon-breath-circle"
          style={{ transform: `scale(${scale})` }}
        />
        <div className="kon-breath-label">{t(`konPhase_${currentPhase.id}`)}</div>
      </div>

      <div className="kon-breath-phrase">
        <div className="kon-breath-tp">{currentPhase.tp}</div>
        <div className="kon-breath-tr">{phaseTextLocal}</div>
      </div>

      <div className="kon-breath-dots">
        {BREATH_PHASES.map(p => (
          <span key={p.id} className={`kon-breath-dot ${currentPhase.id === p.id ? 'active' : ''}`} />
        ))}
      </div>
    </div>
  )
}

// ============================================================
// Modo 2: Mantra del día
// ============================================================
function MantraMode({ lang, onBack }) {
  const t = makeT(lang)
  const [mantra] = useState(() => getMantraOfTheDay())
  const [playing, setPlaying] = useState(false)
  const [secondsSpent, setSecondsSpent] = useState(0)
  const countedRef = useRef(false)

  useEffect(() => { primeAudio() }, [])

  // Contar sesión a los 30s
  useEffect(() => {
    const id = setInterval(() => setSecondsSpent(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  useEffect(() => {
    if (secondsSpent >= 30 && !countedRef.current) {
      countedRef.current = true
      incrementSessions()
    }
  }, [secondsSpent])

  const handleSpeak = () => {
    if (playing) return
    setPlaying(true)
    speak(mantra.tp, { onEnd: () => setPlaying(false) })
  }

  return (
    <div className="kon-screen kon-mantra">
      <header className="kon-header">
        <button className="exit-btn" onClick={onBack}>←</button>
        <div className="kon-title-block">
          <h2>🌿 {t('konMantraTitle')}</h2>
        </div>
      </header>

      <div className="kon-mantra-stage">
        <div className="kon-mantra-tp">{mantra.tp}</div>
        <div className="kon-mantra-divider" />
        <div className="kon-mantra-tr">{mantra[lang] ?? mantra.es}</div>
        <button
          className={`kon-mantra-speak ${playing ? 'playing' : ''}`}
          onClick={handleSpeak}
          aria-label={t('listen')}
        >
          {playing ? '🔉' : '🔊'}
        </button>
      </div>

      <p className="kon-mantra-hint">{t('konMantraHint')}</p>
    </div>
  )
}

// ============================================================
// Modo 3: Silencio puro
// ============================================================
function SilenceMode({ lang, onBack }) {
  const t = makeT(lang)
  const [seconds, setSeconds] = useState(0)
  const countedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (seconds >= 60 && !countedRef.current) {
      countedRef.current = true
      incrementSessions()
    }
  }, [seconds])

  return (
    <div className="kon-screen kon-silence">
      <button className="kon-silence-exit" onClick={onBack} aria-label={t('konBack')}>
        {fmtTime(seconds)} · {t('konSilenceExit')}
      </button>
      <div className="kon-silence-stage">
        <div className="sitelen kon-silence-glyph">pona</div>
      </div>
    </div>
  )
}
