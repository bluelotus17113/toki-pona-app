import { useEffect, useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { markPlayedToday } from '../utils/dailyPlay.js'

// Minijuego "nimi sin" (Wordle pona):
// Palabra de 4 letras del alfabeto TP en 6 intentos.
// Una palabra por día, determinística (hash de fecha). Persiste en localStorage.

const WORD_LEN = 4
const MAX_ATTEMPTS = 6
// Alfabeto de toki pona (14 letras)
const ALPHABET = ['a', 'e', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 's', 't', 'u', 'w']
const STORAGE_KEY = 'tokipona.nimisin.daily'

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

// Pool: palabras del vocab de exactamente 4 letras (alfabeto TP)
const WORD_POOL = Object.keys(VOCAB)
  .filter(w => w.length === WORD_LEN && [...w].every(c => ALPHABET.includes(c)))
  .sort()
const POOL_SET = new Set(WORD_POOL)

function getDailyWord() {
  const key = todayKey()
  const idx = fnv1a(`nimisin-${key}`) % WORD_POOL.length
  return { word: WORD_POOL[idx], dateKey: key }
}

// Colorea un intento contra la palabra objetivo. Implementación clásica wordle
// (dos pasadas: primero matches exactos, luego "present" sin doble-contar).
function scoreGuess(guess, target) {
  const result = Array(WORD_LEN).fill('absent')
  const targetUsed = Array(WORD_LEN).fill(false)
  // pass 1: exactos
  for (let i = 0; i < WORD_LEN; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
      targetUsed[i] = true
    }
  }
  // pass 2: presentes en otra posición
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === 'correct') continue
    for (let j = 0; j < WORD_LEN; j++) {
      if (!targetUsed[j] && guess[i] === target[j]) {
        result[i] = 'present'
        targetUsed[j] = true
        break
      }
    }
  }
  return result
}

// Estado del teclado: para cada letra, mejor estado conocido (correct > present > absent)
function buildKeyState(guesses) {
  const out = {}
  const order = { absent: 0, present: 1, correct: 2 }
  for (const g of guesses) {
    for (let i = 0; i < WORD_LEN; i++) {
      const letter = g.word[i]
      const state = g.score[i]
      if (!out[letter] || order[state] > order[out[letter]]) {
        out[letter] = state
      }
    }
  }
  return out
}

// Recompensa por intentos restantes (más intentos restantes = más mani)
function rewardForAttempts(attemptsUsed) {
  const table = [20, 16, 13, 10, 7, 5]  // 1 a 6 intentos
  return table[attemptsUsed - 1] ?? 5
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export default function NimiSin({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)
  const daily = useMemo(() => getDailyWord(), [])

  // estado guardado para este día (si jugó hoy ya)
  const stored = useMemo(() => {
    const s = loadState()
    if (s && s.dateKey === daily.dateKey) return s
    return null
  }, [daily.dateKey])

  const [guesses, setGuesses] = useState(stored?.guesses ?? [])
  const [current, setCurrent] = useState('')
  const [status, setStatus] = useState(stored?.status ?? 'playing')  // 'playing' | 'won' | 'lost'
  const [maniReward, setManiReward] = useState(stored?.maniReward ?? 0)
  const [shake, setShake] = useState(false)
  const [toastMsg, setToastMsg] = useState(null)

  const keyState = useMemo(() => buildKeyState(guesses), [guesses])

  // Persistir cada vez que cambia
  useEffect(() => {
    if (status === 'playing' && guesses.length === 0) return
    saveState({
      dateKey: daily.dateKey,
      guesses,
      status,
      maniReward
    })
  }, [guesses, status, maniReward, daily.dateKey])

  // Si el usuario ya terminó la partida de hoy (cargada de localStorage),
  // marcar en el helper genérico para que el hub muestre el badge.
  useEffect(() => {
    if (status !== 'playing') markPlayedToday('nimisin')
  }, [status])

  const showToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 1400)
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  const handleType = (letter) => {
    if (status !== 'playing') return
    if (current.length >= WORD_LEN) return
    playClick()
    setCurrent(c => c + letter)
  }

  const handleBackspace = () => {
    if (status !== 'playing') return
    if (current.length === 0) return
    playClick()
    setCurrent(c => c.slice(0, -1))
  }

  const handleSubmit = () => {
    if (status !== 'playing') return
    if (current.length !== WORD_LEN) {
      triggerShake()
      showToast(t('nimiSinTooShort'))
      return
    }
    if (!POOL_SET.has(current)) {
      triggerShake()
      showToast(t('nimiSinNotInList'))
      return
    }
    const score = scoreGuess(current, daily.word)
    const newGuesses = [...guesses, { word: current, score }]
    setGuesses(newGuesses)
    setCurrent('')

    const isWin = score.every(s => s === 'correct')
    if (isWin) {
      const reward = rewardForAttempts(newGuesses.length)
      setManiReward(reward)
      progress.addMani(reward)
      unlock('nimi-sin-first-win')
      if (newGuesses.length <= 2) unlock('nimi-sin-genius')
      setStatus('won')
      markPlayedToday('nimisin')
      playLessonComplete()
      return
    }
    if (newGuesses.length >= MAX_ATTEMPTS) {
      setStatus('lost')
      // mani de consuelo
      progress.addMani(2)
      setManiReward(2)
      markPlayedToday('nimisin')
      playError()
      return
    }
    playSuccess()
  }

  // Soporte teclado físico (web)
  useEffect(() => {
    const onKey = (e) => {
      if (status !== 'playing') return
      const k = e.key.toLowerCase()
      if (k === 'enter') { handleSubmit(); return }
      if (k === 'backspace') { handleBackspace(); return }
      if (k.length === 1 && ALPHABET.includes(k)) { handleType(k); return }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [status, current, guesses])

  // Filas: las jugadas + la actual (si todavía juega) + las vacías
  const rows = []
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    if (i < guesses.length) {
      rows.push({ type: 'past', guess: guesses[i] })
    } else if (i === guesses.length && status === 'playing') {
      rows.push({ type: 'current' })
    } else {
      rows.push({ type: 'empty' })
    }
  }

  return (
    <div className="nimisin-screen">
      <header className="nimisin-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="nimisin-title-block">
          <h2>🔤 {t('nimiSinTitle')}</h2>
          <p>{t('nimiSinSub')}</p>
        </div>
      </header>

      <div className="nimisin-meta">
        <span>{daily.dateKey}</span>
        <span>·</span>
        <span>{guesses.length}/{MAX_ATTEMPTS}</span>
      </div>

      {toastMsg && (
        <div className="nimisin-toast">{toastMsg}</div>
      )}

      <div className={`nimisin-board ${shake ? 'shake' : ''}`}>
        {rows.map((row, i) => (
          <div key={i} className="nimisin-row">
            {Array.from({ length: WORD_LEN }).map((_, j) => {
              let letter = ''
              let cls = 'nimisin-cell'
              if (row.type === 'past') {
                letter = row.guess.word[j]
                cls += ' filled ' + row.guess.score[j]
              } else if (row.type === 'current') {
                letter = current[j] ?? ''
                if (letter) cls += ' typing'
              }
              return (
                <div key={j} className={cls}>{letter}</div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Resultado final */}
      {status !== 'playing' && (
        <div className={`nimisin-result ${status}`}>
          {status === 'won' ? (
            <>
              <div className="nimisin-result-icon">🏆</div>
              <div className="nimisin-result-title">{t('nimiSinWonTitle')}</div>
              <div className="nimisin-result-sub">
                {t('nimiSinWonSub', { n: guesses.length })}
              </div>
              <div className="nimisin-result-reward">🪙 +{maniReward} mani</div>
            </>
          ) : (
            <>
              <div className="nimisin-result-icon">💔</div>
              <div className="nimisin-result-title">{t('nimiSinLostTitle')}</div>
              <div className="nimisin-result-sub">
                {t('nimiSinAnswerWas')} <strong>{daily.word}</strong>
              </div>
              <div className="nimisin-result-reward">🪙 +{maniReward} mani</div>
            </>
          )}
          <div className="nimisin-result-tomorrow">
            {t('nimiSinTomorrow')}
          </div>
        </div>
      )}

      {/* Teclado custom (14 letras del alfabeto TP) */}
      {status === 'playing' && (
        <div className="nimisin-keyboard">
          <div className="nimisin-keyboard-row">
            {['a', 'e', 'i', 'j', 'k', 'l', 'm'].map(letter => (
              <button
                key={letter}
                className={`nimisin-key ${keyState[letter] ?? ''}`}
                onClick={() => handleType(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="nimisin-keyboard-row">
            {['n', 'o', 'p', 's', 't', 'u', 'w'].map(letter => (
              <button
                key={letter}
                className={`nimisin-key ${keyState[letter] ?? ''}`}
                onClick={() => handleType(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          <div className="nimisin-keyboard-row">
            <button className="nimisin-key wide" onClick={handleBackspace}>⌫</button>
            <button className="nimisin-key wide primary" onClick={handleSubmit}>
              {t('nimiSinSubmit')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
