import { useEffect, useMemo, useState } from 'react'
import { STORIES } from '../data/stories.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick, playLessonComplete } from '../hooks/useSound.js'

export default function StoryReader({ storyId, lang = 'es', onExit }) {
  const t = makeT(lang)
  const story = useMemo(() => STORIES.find(s => s.id === storyId), [storyId])

  const [pageIdx, setPageIdx] = useState(0)
  const [showSitelen, setShowSitelen] = useState(false)
  const [tappedWord, setTappedWord] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [showTrans, setShowTrans] = useState(true)
  const [finished, setFinished] = useState(false)

  useEffect(() => { primeAudio() }, [])

  if (!story) {
    return (
      <div className="story-reader">
        <header className="lesson-header">
          <button className="exit-btn" onClick={onExit}>←</button>
        </header>
        <div className="story-not-found">cuento no encontrado</div>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="story-reader story-finished">
        <header className="lesson-header">
          <button className="exit-btn" onClick={onExit}>←</button>
        </header>
        <div className="story-finished-card">
          <div className="story-finished-emoji">🌿</div>
          <h2>{t('storyFinishedTitle')}</h2>
          <p className="story-finished-quote">"{story.sentences[story.sentences.length - 1].tp}"</p>
          <p className="story-finished-sub">— {story.title[lang] ?? story.title.es}</p>
          <button className="primary-btn" onClick={onExit}>{t('continue')}</button>
        </div>
      </div>
    )
  }

  const total = story.sentences.length
  const current = story.sentences[pageIdx]
  const isLast = pageIdx === total - 1
  const title = story.title[lang] ?? story.title.es

  // Tokeniza la oración: separa palabras y mantiene puntuación
  const tokens = current.tp.split(/(\s+|[.,:;!?"()])/).filter(t => t.length > 0)

  const handleSpeak = () => {
    if (playing) return
    setPlaying(true)
    speak(current.tp, { onEnd: () => setPlaying(false) })
  }

  const handleWordTap = (raw) => {
    const clean = raw.replace(/[.,:;!?"()]/g, '').toLowerCase()
    if (!clean || !VOCAB[clean]) return
    playClick()
    setTappedWord(clean)
    setTimeout(() => setTappedWord(null), 2200)
  }

  const handleNext = () => {
    playClick()
    if (isLast) {
      playLessonComplete()
      setFinished(true)
      return
    }
    setPageIdx(i => i + 1)
    setTappedWord(null)
  }

  const handlePrev = () => {
    if (pageIdx === 0) return
    playClick()
    setPageIdx(i => i - 1)
    setTappedWord(null)
  }

  const tappedDef = tappedWord && VOCAB[tappedWord]
    ? (VOCAB[tappedWord][lang] ?? VOCAB[tappedWord].es)
    : null

  return (
    <div className="story-reader">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="story-reader-title">
          <h2>{story.thumbnail} {title}</h2>
          <p>{pageIdx + 1} / {total}</p>
        </div>
        <button
          className={`story-toggle ${showSitelen ? 'on' : ''}`}
          onClick={() => { playClick(); setShowSitelen(s => !s) }}
          title={showSitelen ? 'latin' : 'sitelen pona'}
        >
          {showSitelen ? '🅰️' : '☉'}
        </button>
      </header>

      <div className="story-progress-bar">
        <div className="story-progress-fill" style={{ width: `${((pageIdx + 1) / total) * 100}%` }} />
      </div>

      <div className="story-page">
        <div className={`story-tp ${showSitelen ? 'sitelen' : ''}`}>
          {tokens.map((tok, i) => {
            const isWord = /^[a-zA-Z]+$/.test(tok)
            if (!isWord) return <span key={i}>{tok}</span>
            const clean = tok.toLowerCase()
            const known = !!VOCAB[clean]
            return (
              <span
                key={i}
                className={`story-word ${known ? 'tappable' : ''} ${tappedWord === clean ? 'active' : ''}`}
                onClick={() => known && handleWordTap(tok)}
              >
                {tok}
              </span>
            )
          })}
        </div>

        {tappedDef && (
          <div className="story-tooltip">
            <strong>{tappedWord}</strong> → {tappedDef}
          </div>
        )}

        <div className="story-actions-row">
          <button
            className={`story-audio ${playing ? 'is-playing' : ''}`}
            onClick={handleSpeak}
            disabled={playing}
          >
            {playing ? '🔉' : '🔊'} {t('listen')}
          </button>
          <button
            className={`story-trans-toggle ${showTrans ? 'on' : ''}`}
            onClick={() => { playClick(); setShowTrans(s => !s) }}
          >
            {showTrans ? '👁️' : '🙈'} {t('translation')}
          </button>
        </div>

        {showTrans && (
          <div className="story-translation">
            {current[lang] ?? current.es}
          </div>
        )}
      </div>

      <div className="story-nav">
        <button
          className="story-nav-btn"
          onClick={handlePrev}
          disabled={pageIdx === 0}
        >
          ← {t('prev')}
        </button>
        <button className="story-nav-btn primary" onClick={handleNext}>
          {isLast ? `🌿 ${t('finish')}` : `${t('next')} →`}
        </button>
      </div>
    </div>
  )
}
