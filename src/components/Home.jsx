import { useEffect, useState } from 'react'
import { LESSONS, SECTIONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { LANGS, makeT } from '../data/i18n.js'
import { practiceExerciseCount } from '../data/exerciseBuilder.js'
import { playClick, useSoundToggle } from '../hooks/useSound.js'
import Hearts from './Hearts.jsx'
import AdRefillButton from './AdRefillButton.jsx'
import FeedbackButton from './FeedbackButton.jsx'
import KofiButton from './KofiButton.jsx'
import NoHeartsModal from './NoHeartsModal.jsx'

export default function Home({ progress, lang, setLang, onOpen, onPractice, onDictionary, onGrammar, onNimiTu, onSitelen, onLienzo, onAchievements }) {
  const { state, isUnlocked, reset, MAX_HEARTS } = progress
  const t = makeT(lang)
  const practiceAvailable = state.completed.length >= 1
  const practiceCount = practiceExerciseCount(state.completed.length)

  const [noHeartsOpen, setNoHeartsOpen] = useState(false)
  const [soundOn, toggleSound] = useSoundToggle()
  // cerrar el modal automáticamente si el usuario recupera una vida
  useEffect(() => {
    if (state.hearts > 0 && noHeartsOpen) setNoHeartsOpen(false)
  }, [state.hearts, noHeartsOpen])

  const tryOpenLesson = (lessonId) => {
    playClick()
    if (state.hearts <= 0) { setNoHeartsOpen(true); return }
    onOpen(lessonId)
  }
  const tryOpenPractice = () => {
    playClick()
    if (state.hearts <= 0) { setNoHeartsOpen(true); return }
    onPractice()
  }
  const handleDictionary = () => { playClick(); onDictionary() }
  const handleGrammar = () => { playClick(); onGrammar() }
  const handleNimiTu = () => { playClick(); onNimiTu() }
  const handleSitelen = () => { playClick(); onSitelen() }
  const handleLienzo = () => { playClick(); onLienzo() }
  const handleAchievements = () => { playClick(); onAchievements() }

  const lessonsBySection = SECTIONS.map(sec => ({
    section: sec,
    lessons: LESSONS.filter(l => l.section === sec.id)
  })).filter(g => g.lessons.length > 0)

  return (
    <div className="home">
      <header className="home-header compact">
        <div className="title-block">
          <h1 className="logo">toki pona <span className="leaf">a!</span></h1>
          <p className="subtitle">{t('appSubtitle')}</p>
        </div>
        <div className="header-controls">
          <LangSwitcher lang={lang} setLang={setLang} />
          <button
            className={`sound-toggle ${soundOn ? 'on' : 'off'}`}
            onClick={toggleSound}
            title={soundOn ? t('soundOn') : t('soundOff')}
            aria-label={soundOn ? t('soundOn') : t('soundOff')}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
        </div>
      </header>

      <div className="status-strip">
        <Hearts hearts={state.hearts} max={MAX_HEARTS} nextRegenAt={state.nextRegenAt} lang={lang} compact />
        <div className="status-divider" aria-hidden="true" />
        <div className="status-stat" title={t('xp')}>
          <span className="status-icon">⭐</span>
          <span className="status-value">{state.xp}</span>
        </div>
        <div className="status-divider" aria-hidden="true" />
        <div className="status-stat" title={t('lessons')}>
          <span className="status-icon">✅</span>
          <span className="status-value">{state.completed.length}/{LESSONS.length}</span>
        </div>
        {state.hearts < MAX_HEARTS && (
          <AdRefillButton onReward={progress.addHeart} lang={lang} variant="icon" />
        )}
      </div>

      <div className="action-row triple compact">
        <button
          className={`action-btn practice ${practiceAvailable ? '' : 'locked'}`}
          disabled={!practiceAvailable}
          onClick={tryOpenPractice}
        >
          <span className="action-icon">🎲</span>
          <span className="action-text">
            <span className="action-title">{t('practice')}</span>
            <span className="action-sub">
              {practiceAvailable ? t('practiceSub', { n: practiceCount }) : t('practiceLocked')}
            </span>
          </span>
        </button>

        <button className="action-btn dictionary" onClick={handleDictionary}>
          <span className="action-icon">📖</span>
          <span className="action-text">
            <span className="action-title">{t('dictionary')}</span>
            <span className="action-sub">{t('dictionarySub', { n: Object.keys(VOCAB).length })}</span>
          </span>
        </button>

        <button className="action-btn grammar" onClick={handleGrammar}>
          <span className="action-icon">📐</span>
          <span className="action-text">
            <span className="action-title">{t('grammar')}</span>
            <span className="action-sub">{t('grammarSub')}</span>
          </span>
        </button>
      </div>

      <div className="action-row triple compact">
        <button className="action-btn nimitu" onClick={handleNimiTu}>
          <span className="action-icon">🧩</span>
          <span className="action-text">
            <span className="action-title">{t('nimiTu')}</span>
            <span className="action-sub">{t('nimiTuSub')}</span>
          </span>
        </button>

        <button className="action-btn sitelen" onClick={handleSitelen}>
          <span className="action-icon">☉</span>
          <span className="action-text">
            <span className="action-title">{t('sitelenPona')}</span>
            <span className="action-sub">{t('sitelenPonaSub2')}</span>
          </span>
        </button>

        <button className="action-btn lienzo" onClick={handleLienzo}>
          <span className="action-icon">🖼️</span>
          <span className="action-text">
            <span className="action-title">{t('iloSitelen')}</span>
            <span className="action-sub">{t('iloSitelenSub')}</span>
          </span>
        </button>
      </div>

      <div className="course">
        {lessonsBySection.map(({ section, lessons }, secIdx) => {
          const allDone = lessons.every(l => state.completed.includes(l.id))
          const anyUnlocked = lessons.some(l => isUnlocked(l.id))
          const secTitle = section[`title_${lang}`] ?? section.title_es
          const secDesc  = section[`desc_${lang}`]  ?? section.desc_es
          return (
            <section key={section.id} className={`course-section ${allDone ? 'all-done' : ''} ${!anyUnlocked ? 'locked' : ''}`}>
              <header className="section-head">
                <span className="section-num">{t('partN', { n: secIdx + 1 })}</span>
                <div className="section-title-row">
                  <span className="section-icon">{section.icon}</span>
                  <h2 className="section-title">{secTitle}</h2>
                </div>
                <p className="section-desc">{secDesc}</p>
              </header>
              <div className="section-path">
                {lessons.map((lesson, idx) => {
                  const unlocked = isUnlocked(lesson.id)
                  const done = state.completed.includes(lesson.id)
                  const posClass = `pos-${idx % 4}`
                  const lessonTitle = lesson[`title_${lang}`] ?? lesson.title_es
                  const lessonDesc  = lesson[`desc_${lang}`]  ?? lesson.desc_es
                  return (
                    <button
                      key={lesson.id}
                      className={`lesson-node ${posClass} ${done ? 'done' : ''} ${!unlocked ? 'locked' : ''}`}
                      disabled={!unlocked}
                      onClick={() => unlocked && tryOpenLesson(lesson.id)}
                      title={lessonTitle}
                    >
                      <div className="node-circle">
                        {done ? '✓' : unlocked ? lesson.id : '🔒'}
                      </div>
                      <div className="node-label">
                        <div className="node-title">{lessonTitle}</div>
                        <div className="node-desc">{lessonDesc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <footer className="home-footer">
        <div className="footer-actions">
          <button className="achievements-btn" onClick={handleAchievements} title={t('achievementsTitle')}>
            🏆 {t('achievementsTitle')}
          </button>
          <FeedbackButton lang={lang} />
          <KofiButton variant="compact" lang={lang} />
          <button className="reset-btn" onClick={() => {
            if (confirm(t('confirmReset'))) reset()
          }}>{t('resetProgress')}</button>
        </div>
        <p className="footnote">{t('footnote')}</p>
      </footer>

      {noHeartsOpen && (
        <NoHeartsModal
          nextRegenAt={state.nextRegenAt}
          onClose={() => setNoHeartsOpen(false)}
          onReward={progress.addHeart}
          lang={lang}
        />
      )}
    </div>
  )
}

function Stat({ icon, label, value }) {
  return (
    <div className="stat">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function LangSwitcher({ lang, setLang }) {
  return (
    <div className="lang-switcher">
      {LANGS.map(l => (
        <button
          key={l.code}
          className={`lang-pill ${lang === l.code ? 'active' : ''}`}
          onClick={() => setLang(l.code)}
          title={l.label}
        >
          {l.flag} {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
