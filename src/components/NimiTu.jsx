import { useEffect, useMemo, useState } from 'react'
import { VOCAB } from '../data/vocabulary.js'
import { COMPOUNDS, pickRoundSet, pickWordsForRound, isCorrectAnswer } from '../data/compounds.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

const TOTAL_ROUNDS = 10
const XP_PER_CORRECT = 5

export default function NimiTu({ progress, lang, onExit }) {
  const t = makeT(lang)

  const rounds = useMemo(() => pickRoundSet(TOTAL_ROUNDS), [])
  const [roundIdx, setRoundIdx] = useState(0)
  const [slot1, setSlot1] = useState(null)
  const [slot2, setSlot2] = useState(null)
  const [feedback, setFeedback] = useState(null) // null | 'correct' | 'wrong'
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)

  const current = rounds[roundIdx]
  // Pool de palabras estable por ronda (no se reordena al tocar)
  const pool = useMemo(
    () => current ? pickWordsForRound(current, VOCAB, 10) : [],
    [current?.id]
  )

  if (finished) {
    return <NimiTuComplete
      correctCount={correctCount}
      total={TOTAL_ROUNDS}
      lang={lang}
      onExit={onExit}
      progress={progress}
    />
  }

  if (!current) return null

  const conceptText = current.concept[lang] ?? current.concept.es
  const hintText = current.hint[lang] ?? current.hint.es

  const handleWordPick = (w) => {
    if (feedback) return
    playClick()
    if (slot1 === null) setSlot1(w)
    else if (slot2 === null && w !== slot1) setSlot2(w)
  }

  const handleSlotClear = (which) => {
    if (feedback) return
    playClick()
    if (which === 1) {
      setSlot1(slot2)
      setSlot2(null)
    } else {
      setSlot2(null)
    }
  }

  const handleCheck = () => {
    if (!slot1 || !slot2 || feedback) return
    const correct = isCorrectAnswer(current, slot1, slot2)
    if (correct) {
      playSuccess()
      setFeedback('correct')
      setCorrectCount(c => c + 1)
      progress.addXp(XP_PER_CORRECT)
      progress.addMani(1)  // +1 mani por cada acierto
      unlock('nimitu-first-correct')
    } else {
      playError()
      setFeedback('wrong')
    }
    setTimeout(() => advance(), 1800)
  }

  const advance = () => {
    const next = roundIdx + 1
    if (next >= TOTAL_ROUNDS) {
      playLessonComplete()
      setFinished(true)
      return
    }
    setRoundIdx(next)
    setSlot1(null)
    setSlot2(null)
    setFeedback(null)
  }

  const canCheck = slot1 !== null && slot2 !== null && !feedback
  const usedWords = new Set([slot1, slot2].filter(Boolean))
  const [correctW1, correctW2] = current.answers[0]

  return (
    <div className="nimitu">
      <header className="lesson-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) onExit()
        }}>✕</button>
        <div className="progress-bar minigame">
          <div className="progress-fill" style={{ width: `${(roundIdx / TOTAL_ROUNDS) * 100}%` }} />
        </div>
        <div className="nimitu-score" title={t('correctAnswers')}>
          <span>⭐</span>
          <span>{correctCount}/{TOTAL_ROUNDS}</span>
        </div>
      </header>

      <div className="practice-banner nimitu-banner">
        🧩 {t('nimiTuTitle')} · {roundIdx + 1} / {TOTAL_ROUNDS}
      </div>

      <div className="nimitu-card">
        <div className="nimitu-concept">
          <div className="nimitu-emoji">{current.emoji}</div>
          <h2 className="nimitu-concept-text">{conceptText}</h2>
          <p className="nimitu-hint">💡 {hintText}</p>
        </div>

        <div className="nimitu-slots">
          <button
            className={`nimitu-slot ${slot1 ? 'filled' : ''} ${feedback === 'correct' ? 'ok' : ''} ${feedback === 'wrong' ? 'bad' : ''}`}
            onClick={() => slot1 && handleSlotClear(1)}
            disabled={feedback !== null}
            aria-label="primera palabra"
          >
            {slot1 || '?'}
          </button>
          <span className="nimitu-plus">+</span>
          <button
            className={`nimitu-slot ${slot2 ? 'filled' : ''} ${feedback === 'correct' ? 'ok' : ''} ${feedback === 'wrong' ? 'bad' : ''}`}
            onClick={() => slot2 && handleSlotClear(2)}
            disabled={feedback !== null}
            aria-label="segunda palabra"
          >
            {slot2 || '?'}
          </button>
        </div>

        <div className="nimitu-words">
          {pool.map(w => (
            <button
              key={w}
              className={`nimitu-word ${usedWords.has(w) ? 'used' : ''}`}
              disabled={usedWords.has(w) || feedback !== null}
              onClick={() => handleWordPick(w)}
            >
              {w}
            </button>
          ))}
        </div>

        <button
          className="nimitu-check"
          disabled={!canCheck}
          onClick={handleCheck}
        >
          {t('check')}
        </button>

        {feedback === 'correct' && (
          <div className="nimitu-feedback ok">
            <strong>✓ {t('correct')}</strong>
            <p>
              <em>{slot1}</em> + <em>{slot2}</em> = "{pickDef(slot1, lang)} {pickDef(slot2, lang)}"
            </p>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="nimitu-feedback bad">
            <strong>✗ {t('wrong')}</strong>
            <p>{t('correctAnswerIs')}: <em>{correctW1}</em> + <em>{correctW2}</em></p>
          </div>
        )}
      </div>
    </div>
  )
}

function pickDef(word, lang) {
  const w = VOCAB[word]
  if (!w) return word
  const def = lang === 'en' ? w.en : w.es
  return def.split(',')[0]
}

function NimiTuComplete({ correctCount, total, lang, onExit, progress }) {
  const t = makeT(lang)
  const xp = correctCount * XP_PER_CORRECT
  const pct = Math.round((correctCount / total) * 100)
  const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '👍' : '💪'
  const isPerfect = correctCount === total
  const bonusMani = isPerfect ? 5 : 0

  useEffect(() => {
    if (isPerfect) {
      unlock('nimitu-perfect')
      progress?.addMani(5)  // bonus por 10/10
    }
  }, [isPerfect])

  return (
    <div className="complete">
      <div className="confetti">
        {Array.from({ length: 30 }).map((_, i) => (
          <span key={i} className="confetto" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.6}s`,
            background: ['#ffd166', '#06d6a0', '#ef476f', '#118ab2', '#8338ec'][i % 5]
          }} />
        ))}
      </div>

      <div className="complete-card">
        <div className="big-leaf">{emoji}</div>
        <h2>{t('nimiTuComplete')}</h2>
        <p className="complete-title">{t('scoreHits', { c: correctCount, t: total })}</p>

        <div className="score-row">
          <div className="score-pill">
            <span className="pill-icon">⭐</span>
            <span className="pill-value">+{xp}</span>
            <span className="pill-label">{t('xp')}</span>
          </div>
          <div className="score-pill">
            <span className="pill-icon">🎯</span>
            <span className="pill-value">{pct}%</span>
            <span className="pill-label">{t('accuracy')}</span>
          </div>
        </div>

        <blockquote className="tp-quote">
          "nimi tu li pali e nimi sin" — <em>{t('nimiTuQuote')}</em>
        </blockquote>

        <button className="primary-btn" onClick={onExit}>{t('continue')}</button>
      </div>
    </div>
  )
}
