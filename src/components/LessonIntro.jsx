import { useMemo, useState } from 'react'
import { LESSONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT, TYPE_LABELS } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick } from '../hooks/useSound.js'

// Vista previa de las palabras de una lección. Se muestra antes de los ejercicios
// para que el usuario tenga una base antes de practicar.
export default function LessonIntro({ lesson, lang = 'es', onStart }) {
  const t = makeT(lang)
  const [playing, setPlaying] = useState(null)

  // Una palabra es "nueva" si esta es la primera lección en la que aparece.
  const newWords = useMemo(() => {
    const seen = new Set()
    for (const l of LESSONS) {
      if (l.id === lesson.id) break
      for (const w of (l.words ?? [])) seen.add(w)
    }
    return new Set((lesson.words ?? []).filter(w => !seen.has(w)))
  }, [lesson.id])

  const handlePlay = (word) => {
    primeAudio()
    setPlaying(word)
    speak(word, { onEnd: () => setPlaying(null) })
  }

  const handleStart = () => {
    playClick()
    onStart()
  }

  const lessonTitle = lesson[`title_${lang}`] ?? lesson.title_es

  return (
    <div className="lesson-intro">
      <header className="lesson-intro-header">
        <span className="lesson-intro-eyebrow">{t('lessonIntroTitle')}</span>
        <h2 className="lesson-intro-title">{lessonTitle}</h2>
        <p className="lesson-intro-sub">{t('lessonIntroSub')}</p>
        <div className="lesson-intro-count">
          {t('lessonIntroWordCount', { n: lesson.words?.length ?? 0 })}
        </div>
      </header>

      <div className="lesson-intro-words">
        {(lesson.words ?? []).map(word => {
          const entry = VOCAB[word]
          if (!entry) return null
          const meaning = entry[lang] ?? entry.es
          const typeLabel = TYPE_LABELS[entry.tipo]?.[lang] ?? entry.tipo
          const isNew = newWords.has(word)
          return (
            <div key={word} className={`lesson-intro-word ${isNew ? 'is-new' : ''}`}>
              <div className="lesson-intro-glyph-block">
                <span className="sitelen lesson-intro-glyph" aria-hidden="true">{entry.tp}</span>
                <span className="lesson-intro-latin">{entry.tp}</span>
                <button
                  className={`lesson-intro-audio ${playing === word ? 'is-playing' : ''}`}
                  onClick={() => handlePlay(word)}
                  title={t('listen')}
                  aria-label={t('listen')}
                >
                  {playing === word ? '🔉' : '🔊'}
                </button>
              </div>
              <div className="lesson-intro-info">
                <span className="lesson-intro-type">{typeLabel}</span>
                <div className="lesson-intro-meaning">{meaning}</div>
                <div className="lesson-intro-example">{entry.ejemplo}</div>
              </div>
            </div>
          )
        })}
      </div>

      {lesson.phrases?.length > 0 && (
        <div className="lesson-intro-phrases">
          <h3 className="lesson-intro-phrases-title">
            {lang === 'es' ? 'frases que vas a aprender' : 'phrases you will learn'}
          </h3>
          {lesson.phrases.map((p, i) => (
            <div key={i} className="lesson-intro-phrase">
              <span className="lesson-intro-phrase-tp">{p.tp}</span>
              <span className="lesson-intro-phrase-tr">{p[lang] ?? p.es}</span>
            </div>
          ))}
        </div>
      )}

      <div className="lesson-intro-cta">
        <button className="lesson-intro-start" onClick={handleStart}>
          {t('lessonIntroStart')}
        </button>
      </div>
    </div>
  )
}
