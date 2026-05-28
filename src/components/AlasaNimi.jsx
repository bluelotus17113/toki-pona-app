import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { isPlayedToday, markPlayedToday } from '../utils/dailyPlay.js'
import DailyLockedScreen from './DailyLockedScreen.jsx'

const GAME_ID = 'alasanimi'
const SIZE = 7              // grilla 7x7
const TARGET_WORDS = 5      // 5 palabras a encontrar
const ALPHABET = ['a', 'e', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 's', 't', 'u', 'w']

// Palabras candidatas: 3-5 letras del alfabeto TP, sin compuestas raras
const POOL = Object.keys(VOCAB).filter(w =>
  w.length >= 3 && w.length <= 5 &&
  [...w].every(c => ALPHABET.includes(c))
).sort()

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Intenta colocar word en la grilla. Devuelve true si lo logró.
// Direcciones: H (horizontal →), V (vertical ↓)
function tryPlace(grid, word, dir, r, c) {
  const N = word.length
  if (dir === 'H') {
    if (c + N > SIZE) return false
    for (let i = 0; i < N; i++) {
      const existing = grid[r][c + i]
      if (existing !== '' && existing !== word[i]) return false
    }
    for (let i = 0; i < N; i++) grid[r][c + i] = word[i]
    return true
  } else {
    if (r + N > SIZE) return false
    for (let i = 0; i < N; i++) {
      const existing = grid[r + i][c]
      if (existing !== '' && existing !== word[i]) return false
    }
    for (let i = 0; i < N; i++) grid[r + i][c] = word[i]
    return true
  }
}

// Genera una grilla con TARGET_WORDS palabras. Retorna { grid, words: [{word, cells}] }
function generateGrid() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(''))
    const picked = shuffle(POOL).slice(0, 30)  // mucho pool para tener fallbacks
    const placed = []

    for (const word of picked) {
      if (placed.length >= TARGET_WORDS) break
      // intentar hasta 20 posiciones distintas
      let success = false
      for (let i = 0; i < 20 && !success; i++) {
        const dir = Math.random() < 0.5 ? 'H' : 'V'
        const r = Math.floor(Math.random() * SIZE)
        const c = Math.floor(Math.random() * SIZE)
        // Clonar grid antes de intentar para poder revertir
        const snapshot = grid.map(row => row.slice())
        if (tryPlace(grid, word, dir, r, c)) {
          // registrar las celdas
          const cells = []
          for (let k = 0; k < word.length; k++) {
            if (dir === 'H') cells.push([r, c + k])
            else cells.push([r + k, c])
          }
          placed.push({ word, cells, dir, r, c })
          success = true
        } else {
          // restaurar
          for (let rr = 0; rr < SIZE; rr++)
            for (let cc = 0; cc < SIZE; cc++)
              grid[rr][cc] = snapshot[rr][cc]
        }
      }
    }

    if (placed.length >= TARGET_WORDS) {
      // llenar vacíos con letras al azar
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (grid[r][c] === '') {
            grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
          }
        }
      }
      return { grid, words: placed }
    }
  }
  // Fallback: si después de 10 intentos no logra, retornar lo último
  return generateGrid()
}

// Dadas 2 celdas, devuelve la lista de celdas que conecta si la línea es válida (H o V)
function cellsBetween(a, b) {
  const [r1, c1] = a
  const [r2, c2] = b
  if (r1 === r2) {
    // horizontal
    const out = []
    const [from, to] = c1 <= c2 ? [c1, c2] : [c2, c1]
    for (let c = from; c <= to; c++) out.push([r1, c])
    return c1 <= c2 ? out : out.reverse()
  }
  if (c1 === c2) {
    const out = []
    const [from, to] = r1 <= r2 ? [r1, r2] : [r2, r1]
    for (let r = from; r <= to; r++) out.push([r, c1])
    return r1 <= r2 ? out : out.reverse()
  }
  return null
}

function cellKey([r, c]) { return `${r},${c}` }

export default function AlasaNimi({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)

  const [gameState] = useState(generateGrid)
  const { grid, words } = gameState
  const [firstPick, setFirstPick] = useState(null)   // [r, c] o null
  const [foundWords, setFoundWords] = useState({})   // word -> [cells]
  const [feedback, setFeedback] = useState(null)     // 'right' | 'wrong'
  const [maniReward, setManiReward] = useState(0)
  const [done, setDone] = useState(false)

  // Marcar como jugado cuando termina
  const finishIfAllFound = (foundMap) => {
    if (Object.keys(foundMap).length >= words.length) {
      const reward = words.length * 3
      setManiReward(reward)
      progress.addMani(reward)
      unlock('alasa-nimi-first-win')
      const allFound = Object.keys(foundMap).length === words.length
      if (allFound) unlock('alasa-nimi-perfect')
      markPlayedToday(GAME_ID)
      playLessonComplete()
      setDone(true)
    }
  }

  const giveUp = () => {
    if (!confirm(t('alasaNimiGiveUpConfirm'))) return
    // dar las que ya encontró pero terminar
    const reward = Object.keys(foundWords).length * 3
    setManiReward(reward)
    if (reward > 0) progress.addMani(reward)
    markPlayedToday(GAME_ID)
    setDone(true)
  }

  const handleCell = (r, c) => {
    if (done) return
    playClick()
    if (firstPick === null) {
      setFirstPick([r, c])
      return
    }
    if (firstPick[0] === r && firstPick[1] === c) {
      // cancelar selección
      setFirstPick(null)
      return
    }
    const line = cellsBetween(firstPick, [r, c])
    if (!line) {
      // no es línea recta
      setFeedback('wrong')
      playError()
      setTimeout(() => { setFeedback(null); setFirstPick(null) }, 500)
      return
    }
    const chosen = line.map(([rr, cc]) => grid[rr][cc]).join('')
    const matched = words.find(w =>
      !foundWords[w.word] &&
      (w.word === chosen || w.word === chosen.split('').reverse().join(''))
    )
    if (matched) {
      const nextFound = { ...foundWords, [matched.word]: line }
      setFoundWords(nextFound)
      setFeedback('right')
      playSuccess()
      setTimeout(() => {
        setFeedback(null)
        setFirstPick(null)
        finishIfAllFound(nextFound)
      }, 600)
    } else {
      setFeedback('wrong')
      playError()
      setTimeout(() => { setFeedback(null); setFirstPick(null) }, 500)
    }
  }

  // Mapa de celdas encontradas → para colorear
  const foundCellsMap = useMemo(() => {
    const m = {}
    for (const [word, cells] of Object.entries(foundWords)) {
      for (const c of cells) m[cellKey(c)] = true
    }
    return m
  }, [foundWords])

  // Bloqueo diario después de todos los hooks (Rules of Hooks).
  if (isPlayedToday(GAME_ID)) {
    return <DailyLockedScreen icon="🔍" title={t('alasaNimiTitle')} lang={lang} onExit={onExit} />
  }

  // ============ Pantalla resultados ============
  if (done) {
    const found = Object.keys(foundWords).length
    const perfect = found === words.length
    return (
      <div className="alasanimi-screen done">
        <header className="alasanimi-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="alasanimi-title-block">
            <h2>🏆 {t('alasaNimiResultTitle')}</h2>
          </div>
        </header>

        <div className="alasanimi-result">
          <div className="alasanimi-score">
            <div className="alasanimi-score-big">{found}/{words.length}</div>
            <div className="alasanimi-score-sub">
              {perfect ? t('alasaNimiPerfect') : t('alasaNimiFound')}
            </div>
          </div>
          <div className="alasanimi-reward">🪙 +{maniReward} mani</div>
          <p className="alasanimi-tomorrow">{t('dailyLockedTomorrow')}</p>
          {/* mostrar las palabras */}
          <div className="alasanimi-words-summary">
            {words.map(w => (
              <span
                key={w.word}
                className={`alasanimi-word-chip ${foundWords[w.word] ? 'found' : ''}`}
              >
                {foundWords[w.word] ? '✓' : '✗'} {w.word}
              </span>
            ))}
          </div>
          <button className="alasanimi-result-btn primary" onClick={onExit}>
            {t('dailyLockedBack')}
          </button>
        </div>
      </div>
    )
  }

  // ============ Pantalla de juego ============
  return (
    <div className={`alasanimi-screen game ${feedback ? 'flash-' + feedback : ''}`}>
      <header className="alasanimi-game-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) onExit()
        }}>✕</button>
        <div className="alasanimi-title-block">
          <h2>🔍 {t('alasaNimiTitle')}</h2>
          <p>{Object.keys(foundWords).length}/{words.length}</p>
        </div>
      </header>

      <div className="alasanimi-prompt">
        {firstPick
          ? t('alasaNimiPromptEnd')
          : t('alasaNimiPromptStart')}
      </div>

      <div className="alasanimi-grid">
        {grid.map((row, r) => (
          <div key={r} className="alasanimi-grid-row">
            {row.map((letter, c) => {
              const isFirst = firstPick && firstPick[0] === r && firstPick[1] === c
              const isFound = foundCellsMap[cellKey([r, c])]
              let cls = 'alasanimi-cell'
              if (isFound) cls += ' is-found'
              if (isFirst) cls += ' is-first'
              return (
                <button
                  key={c}
                  className={cls}
                  onClick={() => handleCell(r, c)}
                  disabled={isFound}
                >
                  {letter}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <div className="alasanimi-words">
        {words.map(w => (
          <span
            key={w.word}
            className={`alasanimi-word-chip ${foundWords[w.word] ? 'found' : ''}`}
          >
            {foundWords[w.word] ? '✓' : '○'} {w.word}
          </span>
        ))}
      </div>

      <button className="alasanimi-giveup" onClick={giveUp}>
        {t('alasaNimiGiveUp')}
      </button>
    </div>
  )
}
