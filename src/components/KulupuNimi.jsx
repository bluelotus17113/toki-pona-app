import { useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

// Minijuego "kulupu nimi" (categorías): clasificar palabras TP en categorías
// temáticas. 5 rondas, cada una usa 2 categorías al azar con 5-6 palabras
// totales para clasificar. Refuerza vocabulario temático.

const ROUNDS = 5

// Categorías sin solapes — cada palabra pertenece a UNA sola categoría aquí.
const CATEGORIES = [
  {
    id: 'soweli',
    icon: '🐾',
    label: { es: 'animales', en: 'animals' },
    words: ['soweli', 'waso', 'kala', 'pipi', 'akesi', 'kijetesantakalu']
  },
  {
    id: 'jan',
    icon: '👥',
    label: { es: 'gente', en: 'people' },
    words: ['jan', 'meli', 'mije', 'mama', 'tonsi']
  },
  {
    id: 'sijelo',
    icon: '💪',
    label: { es: 'cuerpo', en: 'body' },
    words: ['lawa', 'luka', 'noka', 'oko', 'uta', 'monsi']
  },
  {
    id: 'kule',
    icon: '🎨',
    label: { es: 'colores', en: 'colors' },
    words: ['jelo', 'laso', 'loje', 'walo', 'pimeja']
  },
  {
    id: 'tomo',
    icon: '🏠',
    label: { es: 'lugares', en: 'places' },
    words: ['tomo', 'esun', 'lupa', 'supa', 'leko']
  },
  {
    id: 'pilin',
    icon: '💭',
    label: { es: 'emociones', en: 'emotions' },
    words: ['pilin', 'olin', 'musi', 'apeja', 'wawa']
  },
  {
    id: 'ma',
    icon: '🌍',
    label: { es: 'naturaleza', en: 'nature' },
    words: ['kiwen', 'nena', 'kon', 'suno', 'mun', 'kasi']
  },
  {
    id: 'moku',
    icon: '🍞',
    label: { es: 'comida', en: 'food' },
    words: ['moku', 'pan', 'kili', 'namako', 'misikeke', 'soko']
  }
]

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildRound() {
  const [catA, catB] = shuffle(CATEGORIES).slice(0, 2)
  // tomar 3 palabras de cada categoría
  const wordsA = shuffle(catA.words).slice(0, 3)
  const wordsB = shuffle(catB.words).slice(0, 3)
  const words = shuffle([
    ...wordsA.map(w => ({ word: w, cat: catA.id })),
    ...wordsB.map(w => ({ word: w, cat: catB.id }))
  ])
  return { categories: [catA, catB], words }
}

export default function KulupuNimi({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)
  const [started, setStarted] = useState(false)
  const [rounds, setRounds] = useState([])
  const [idx, setIdx] = useState(0)
  const [assignments, setAssignments] = useState({})  // word -> catId
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalWords, setTotalWords] = useState(0)
  const [done, setDone] = useState(false)
  const [maniReward, setManiReward] = useState(0)

  const current = started && !done ? rounds[idx] : null

  const start = () => {
    playClick()
    const newRounds = Array.from({ length: ROUNDS }, buildRound)
    setRounds(newRounds)
    setIdx(0)
    setAssignments({})
    setChecked(false)
    setCorrectCount(0)
    setTotalCorrect(0)
    setTotalWords(0)
    setDone(false)
    setManiReward(0)
    setStarted(true)
  }

  const assign = (word, catId) => {
    if (checked) return
    playClick()
    setAssignments(a => ({ ...a, [word]: catId }))
  }

  const unassign = (word) => {
    if (checked) return
    playClick()
    setAssignments(a => {
      const next = { ...a }
      delete next[word]
      return next
    })
  }

  const check = () => {
    if (!current) return
    const total = current.words.length
    let correct = 0
    for (const item of current.words) {
      if (assignments[item.word] === item.cat) correct++
    }
    setCorrectCount(correct)
    setChecked(true)
    if (correct === total) playSuccess()
    else playError()

    setTimeout(() => {
      const newTotalCorrect = totalCorrect + correct
      const newTotalWords = totalWords + total
      if (idx + 1 >= ROUNDS) {
        // terminó
        setTotalCorrect(newTotalCorrect)
        setTotalWords(newTotalWords)
        const reward = newTotalCorrect * 1 + (newTotalCorrect === newTotalWords ? 8 : 0)
        setManiReward(reward)
        progress.addMani(reward)
        unlock('kulupu-nimi-first-win')
        if (newTotalCorrect === newTotalWords) unlock('kulupu-nimi-perfect')
        playLessonComplete()
        setDone(true)
      } else {
        setTotalCorrect(newTotalCorrect)
        setTotalWords(newTotalWords)
        setIdx(i => i + 1)
        setAssignments({})
        setChecked(false)
      }
    }, 1600)
  }

  const allAssigned = current ? current.words.every(item => assignments[item.word]) : false

  // ============ Pantalla intro ============
  if (!started) {
    return (
      <div className="kulupunimi-screen">
        <header className="kulupunimi-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kulupunimi-title-block">
            <h2>📂 {t('kulupuNimiTitle')}</h2>
            <p>{t('kulupuNimiSub')}</p>
          </div>
        </header>

        <div className="kulupunimi-banner">
          {t('kulupuNimiIntro')}
        </div>

        <div className="kulupunimi-rules">
          <div className="kulupunimi-rule"><span>📂</span><span>{t('kulupuNimiRule1')}</span></div>
          <div className="kulupunimi-rule"><span>🎯</span><span>{t('kulupuNimiRule2')}</span></div>
          <div className="kulupunimi-rule"><span>🪙</span><span>{t('kulupuNimiRule3')}</span></div>
        </div>

        <button className="kulupunimi-start" onClick={start}>
          {t('kulupuNimiStart')}
        </button>
      </div>
    )
  }

  // ============ Pantalla resultados ============
  if (done) {
    const accuracy = Math.round((totalCorrect / totalWords) * 100)
    return (
      <div className="kulupunimi-screen done">
        <header className="kulupunimi-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="kulupunimi-title-block">
            <h2>🏆 {t('kulupuNimiResultTitle')}</h2>
          </div>
        </header>

        <div className="kulupunimi-result">
          <div className="kulupunimi-score">
            <div className="kulupunimi-score-big">{totalCorrect}/{totalWords}</div>
            <div className="kulupunimi-score-sub">{accuracy}% · {t('kulupuNimiAccuracy')}</div>
          </div>
          <div className="kulupunimi-reward">
            🪙 +{maniReward} mani
            {totalCorrect === totalWords && (
              <span className="kulupunimi-perfect">{t('kulupuNimiPerfect')}</span>
            )}
          </div>
          <div className="kulupunimi-result-actions">
            <button className="kulupunimi-result-btn primary" onClick={start}>
              {t('kulupuNimiAgain')}
            </button>
            <button className="kulupunimi-result-btn" onClick={onExit}>
              {t('kulupuNimiBack')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ============ Pantalla de juego ============
  // Palabras sin asignar
  const unassignedWords = current.words.filter(item => !assignments[item.word])
  // Por categoría: palabras asignadas
  const byCategory = (catId) => current.words.filter(item => assignments[item.word] === catId)

  return (
    <div className="kulupunimi-screen game">
      <header className="kulupunimi-game-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) onExit()
        }}>✕</button>
        <div className="kulupunimi-progress-bar">
          <div
            className="kulupunimi-progress-fill"
            style={{ width: `${(idx / ROUNDS) * 100}%` }}
          />
        </div>
        <div className="kulupunimi-round-info">
          {idx + 1}/{ROUNDS}
        </div>
      </header>

      <div className="kulupunimi-prompt">
        {t('kulupuNimiPrompt')}
      </div>

      {/* Pool de palabras sin clasificar */}
      <div className="kulupunimi-pool">
        {unassignedWords.length === 0 && (
          <div className="kulupunimi-pool-empty">{t('kulupuNimiAllPlaced')}</div>
        )}
        {unassignedWords.map(item => (
          <div key={item.word} className="kulupunimi-token">
            <span className="sitelen kn-token-glyph">{item.word}</span>
            <span className="kn-token-latin">{item.word}</span>
            <div className="kn-token-actions">
              {current.categories.map(cat => (
                <button
                  key={cat.id}
                  className="kn-assign-btn"
                  onClick={() => assign(item.word, cat.id)}
                  aria-label={`${cat.icon} ${cat.label[lang] ?? cat.label.es}`}
                >
                  {cat.icon}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bins por categoría */}
      <div className="kulupunimi-bins">
        {current.categories.map(cat => {
          const items = byCategory(cat.id)
          return (
            <div key={cat.id} className="kn-bin">
              <div className="kn-bin-header">
                <span className="kn-bin-icon">{cat.icon}</span>
                <span className="kn-bin-label">{cat.label[lang] ?? cat.label.es}</span>
                <span className="kn-bin-count">{items.length}</span>
              </div>
              <div className="kn-bin-body">
                {items.length === 0 && (
                  <span className="kn-bin-empty">{t('kulupuNimiEmpty')}</span>
                )}
                {items.map(item => {
                  let cls = 'kn-bin-item'
                  if (checked) {
                    cls += assignments[item.word] === item.cat ? ' is-correct' : ' is-wrong'
                  }
                  return (
                    <button
                      key={item.word}
                      className={cls}
                      onClick={() => unassign(item.word)}
                      disabled={checked}
                    >
                      <span className="sitelen kn-bin-glyph">{item.word}</span>
                      <span className="kn-bin-latin">{item.word}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <button
        className={`kulupunimi-check ${allAssigned && !checked ? '' : 'disabled'}`}
        disabled={!allAssigned || checked}
        onClick={check}
      >
        {checked
          ? `${correctCount}/${current.words.length} · ${correctCount === current.words.length ? t('correct') : t('wrong')}`
          : t('check')}
      </button>
    </div>
  )
}
