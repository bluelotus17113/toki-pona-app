import { LESSONS } from '../data/lessons.js'
import { makeT } from '../data/i18n.js'

export default function LessonComplete({ mode = 'lesson', lessonId, score, correctCount, total, maniEarned = 0, lang = 'es', onHome }) {
  const t = makeT(lang)
  const isPractice = mode === 'practice'
  const lesson = !isPractice ? LESSONS.find(l => l.id === lessonId) : null
  const lessonTitle = lesson ? (lesson[`title_${lang}`] ?? lesson.title_es) : ''

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
        <div className="big-leaf">{isPractice ? '🎲' : '🌿'}</div>
        <h2>{isPractice ? t('practiceComplete') : t('lessonComplete')}</h2>
        <p className="complete-title">
          {isPractice ? t('scoreHits', { c: correctCount, t: total }) : lessonTitle}
        </p>

        <div className="score-row">
          <div className="score-pill">
            <span className="pill-icon">⭐</span>
            <span className="pill-value">+{score}</span>
            <span className="pill-label">{t('xp')}</span>
          </div>
          {maniEarned > 0 && (
            <div className="score-pill mani">
              <span className="pill-icon">🪙</span>
              <span className="pill-value">+{maniEarned}</span>
              <span className="pill-label">mani</span>
            </div>
          )}
          {!isPractice && (
            <div className="score-pill">
              <span className="pill-icon">📚</span>
              <span className="pill-value">{lesson.words.length}</span>
              <span className="pill-label">{t('words')}</span>
            </div>
          )}
          {isPractice && (
            <div className="score-pill">
              <span className="pill-icon">🎯</span>
              <span className="pill-value">{Math.round((correctCount / total) * 100)}%</span>
              <span className="pill-label">{t('accuracy')}</span>
            </div>
          )}
        </div>

        {!isPractice && lesson && (
          <blockquote className="tp-quote">
            "{lesson.phrases[0].tp}" — <em>{lesson.phrases[0][lang] ?? lesson.phrases[0].es}</em>
          </blockquote>
        )}
        {isPractice && (
          <blockquote className="tp-quote">
            "sona li kama tan pali mute" — <em>{t('practiceQuote')}</em>
          </blockquote>
        )}

        <button className="primary-btn" onClick={onHome}>{t('continue')}</button>
      </div>
    </div>
  )
}
