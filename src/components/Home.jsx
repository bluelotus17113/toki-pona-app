import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS, SECTIONS, SECTION_THEMES } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { practiceExerciseCount } from '../data/exerciseBuilder.js'
import { playClick, useSoundToggle } from '../hooks/useSound.js'
import { speak } from '../hooks/useSpeech.js'
import { getWordOfTheDay } from '../utils/wordOfTheDay.js'
import Hearts from './Hearts.jsx'
import AdRefillButton from './AdRefillButton.jsx'
import FeedbackButton from './FeedbackButton.jsx'
import KofiButton from './KofiButton.jsx'
import NoHeartsModal from './NoHeartsModal.jsx'

export default function Home({ progress, lang, setLang, onOpen, onPractice, onDictionary, onGrammar, onSitelen, onLienzo, onAchievements, onCuentos, onHistoria, onAtlas, onKulupu, onMinijuegos, onDashboard, onToki, onSettings, onKon, theme, onCycleTheme }) {
  const { state, isUnlocked, reset, MAX_HEARTS } = progress
  const t = makeT(lang)
  const practiceAvailable = state.completed.length >= 1
  const practiceCount = practiceExerciseCount(state.completed.length)

  const [noHeartsOpen, setNoHeartsOpen] = useState(false)
  const [activeSheet, setActiveSheet] = useState(null)  // null | 'more' | 'practicas' | 'escritura' | 'complementos'
  const closeSheet = () => setActiveSheet(null)
  const [soundOn, toggleSound] = useSoundToggle()
  const wod = useMemo(() => getWordOfTheDay(), [])
  const [wodPlaying, setWodPlaying] = useState(false)
  const handleWodSpeak = () => {
    if (wodPlaying) return
    playClick()
    setWodPlaying(true)
    speak(wod.word, { onEnd: () => setWodPlaying(false) })
  }
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
  const handleSitelen = () => { playClick(); onSitelen() }
  const handleLienzo = () => { playClick(); onLienzo() }
  const handleAchievements = () => { playClick(); onAchievements() }
  const handleCuentos = () => { playClick(); onCuentos() }
  const handleHistoria = () => { playClick(); onHistoria() }
  const handleAtlas = () => { playClick(); onAtlas() }
  const handleKulupu = () => { playClick(); onKulupu() }
  const handleMinijuegos = () => { playClick(); onMinijuegos() }
  const handleDashboard = () => { playClick(); onDashboard() }
  const handleToki = () => { playClick(); onToki() }
  const handleSettings = () => { playClick(); onSettings() }
  const handleKon = () => { playClick(); onKon() }

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
        <button
          className="wod-card"
          onClick={handleWodSpeak}
          title={t('wodTitle')}
        >
          <div className="wod-label">🌅 {t('wodLabel')}</div>
          <div className="wod-glyph-row">
            <span className="sitelen wod-glyph">{wod.word}</span>
            <span className="wod-latin">{wod.word}</span>
            <span className="wod-audio">{wodPlaying ? '🔉' : '🔊'}</span>
          </div>
          <div className="wod-translation">
            {wod.entry[lang] ?? wod.entry.es}
          </div>
        </button>
        <div className="header-controls">
          <button
            className={`sound-toggle ${soundOn ? 'on' : 'off'}`}
            onClick={toggleSound}
            title={soundOn ? t('soundOn') : t('soundOff')}
            aria-label={soundOn ? t('soundOn') : t('soundOff')}
          >
            {soundOn ? '🔊' : '🔇'}
          </button>
          <button
            className="theme-toggle"
            onClick={handleSettings}
            title={t('settingsTitle')}
            aria-label={t('settingsTitle')}
          >
            ⚙️
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
        <div className="status-stat mani-stat" title={t('mani')}>
          <span className="status-icon">🪙</span>
          <span className="status-value">{state.mani}</span>
        </div>
        <div className="status-divider" aria-hidden="true" />
        <div className="status-stat" title={t('lessons')}>
          <span className="status-icon">✅</span>
          <span className="status-value">{state.completed.length}/{LESSONS.length}</span>
        </div>
        {(state.streak ?? 0) > 0 && (
          <>
            <div className="status-divider" aria-hidden="true" />
            <div className="status-stat streak-stat" title={t('streakTitle')}>
              <span className="status-icon">🔥</span>
              <span className="status-value">{state.streak}</span>
            </div>
          </>
        )}
        {state.hearts < MAX_HEARTS && (
          <AdRefillButton onReward={progress.addHeart} lang={lang} variant="icon" />
        )}
      </div>

      <div className="action-row quad compact">
        <button className="action-btn cat-practicas" onClick={() => { playClick(); setActiveSheet('practicas') }}>
          <span className="action-icon">🎲</span>
          <span className="action-text">
            <span className="action-title">{t('homePracticas')}</span>
            <span className="action-sub">{t('homePracticasSub')}</span>
          </span>
        </button>

        <button className="action-btn cat-escritura" onClick={() => { playClick(); setActiveSheet('escritura') }}>
          <span className="action-icon">✍️</span>
          <span className="action-text">
            <span className="action-title">{t('homeEscritura')}</span>
            <span className="action-sub">{t('homeEscrituraSub')}</span>
          </span>
        </button>

        <button className="action-btn cat-minijuegos" onClick={handleMinijuegos}>
          <span className="action-icon">🎮</span>
          <span className="action-text">
            <span className="action-title">{t('homeMinijuegos')}</span>
            <span className="action-sub">{t('homeMinijuegosSub')}</span>
          </span>
        </button>

        <button className="action-btn cat-complementos" onClick={() => { playClick(); setActiveSheet('complementos') }}>
          <span className="action-icon">🍃</span>
          <span className="action-text">
            <span className="action-title">{t('homeComplementos')}</span>
            <span className="action-sub">{t('homeComplementosSub')}</span>
          </span>
        </button>
      </div>

      <div className="course">
        {lessonsBySection.map(({ section, lessons }, secIdx) => {
          const allDone = lessons.every(l => state.completed.includes(l.id))
          const anyUnlocked = lessons.some(l => isUnlocked(l.id))
          const secTitle = section[`title_${lang}`] ?? section.title_es
          const secDesc  = section[`desc_${lang}`]  ?? section.desc_es
          const theme = SECTION_THEMES[section.id] ?? { accent: 'var(--yellow)', deco: [] }
          return (
            <section
              key={section.id}
              className={`course-section theme-${section.id} ${allDone ? 'all-done' : ''} ${!anyUnlocked ? 'locked' : ''}`}
              style={{ '--section-accent': theme.accent }}
            >
              <header className="section-head">
                <span className="section-deco section-deco-left"  aria-hidden="true">{theme.deco[0]}</span>
                <span className="section-deco section-deco-right" aria-hidden="true">{theme.deco[2] ?? theme.deco[0]}</span>
                <span className="section-num">{t('partN', { n: secIdx + 1 })}</span>
                <div className="section-title-row">
                  <span className="section-icon">{section.icon}</span>
                  <h2 className="section-title">{secTitle}</h2>
                </div>
                <p className="section-desc">{secDesc}</p>
                {theme.deco[1] && (
                  <span className="section-deco section-deco-bottom" aria-hidden="true">{theme.deco[1]}</span>
                )}
              </header>
              <div className="section-path">
                {lessons.map((lesson, idx) => {
                  const unlocked = isUnlocked(lesson.id)
                  const done = state.completed.includes(lesson.id)
                  const posClass = `pos-${idx % 4}`
                  const lessonTitle = lesson[`title_${lang}`] ?? lesson.title_es
                  const lessonDesc  = lesson[`desc_${lang}`]  ?? lesson.desc_es
                  const isLast = idx === lessons.length - 1
                  // estado del trail hacia la siguiente: completo si ESTA está hecha, abierto si solo está desbloqueada, locked si no
                  let trailState = 'locked'
                  if (done) trailState = 'done'
                  else if (unlocked) trailState = 'open'
                  return (
                    <Fragment key={lesson.id}>
                      <button
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
                      {!isLast && (
                        <div
                          className={`path-trail from-${idx % 4} ${trailState}`}
                          aria-hidden="true"
                        >
                          <span className="step" /><span className="step" /><span className="step" />
                        </div>
                      )}
                    </Fragment>
                  )
                })}
                <div className={`section-checkpoint ${allDone ? 'reached' : 'pending'}`}>
                  <div className="checkpoint-flag">{allDone ? '🏆' : '🏁'}</div>
                  <div className="checkpoint-text">
                    <div className="checkpoint-title">
                      {allDone ? t('checkpointReached') : t('checkpointPending')}
                    </div>
                    <div className="checkpoint-sub">{section.icon} {secTitle}</div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}
      </div>

      <footer className="home-footer">
        <div className="footer-actions">
          <button
            className="achievements-btn more-btn"
            onClick={() => { playClick(); setActiveSheet('more') }}
            title={t('moreLabel')}
          >
            ⋯ {t('moreLabel')}
          </button>
          <FeedbackButton lang={lang} />
          <KofiButton variant="compact" lang={lang} />
          <button className="reset-btn" onClick={() => {
            if (confirm(t('confirmReset'))) reset()
          }}>{t('resetProgress')}</button>
        </div>
        <p className="footnote">{t('footnote')}</p>
      </footer>

      {activeSheet === 'practicas' && (
        <ActionSheet
          lang={lang}
          title={t('sheetPracticasTitle')}
          onClose={closeSheet}
          items={[
            {
              icon: '🎲',
              label: t('practice'),
              sub: practiceAvailable ? t('sheetSubPractice') : t('practiceLocked'),
              locked: !practiceAvailable,
              onClick: () => { closeSheet(); tryOpenPractice() }
            },
            {
              icon: '📖',
              label: t('dictionary'),
              sub: t('sheetSubDictionary'),
              onClick: () => { closeSheet(); handleDictionary() }
            },
            {
              icon: '📐',
              label: t('grammar'),
              sub: t('sheetSubGrammar'),
              onClick: () => { closeSheet(); handleGrammar() }
            }
          ]}
        />
      )}

      {activeSheet === 'escritura' && (
        <ActionSheet
          lang={lang}
          title={t('sheetEscrituraTitle')}
          onClose={closeSheet}
          items={[
            {
              icon: '☉',
              label: t('sitelenPona'),
              sub: t('sheetSubSitelen'),
              onClick: () => { closeSheet(); handleSitelen() }
            },
            {
              icon: '🖼️',
              label: t('iloSitelen'),
              sub: t('sheetSubLienzo'),
              onClick: () => { closeSheet(); handleLienzo() }
            }
          ]}
        />
      )}

      {activeSheet === 'complementos' && (
        <ActionSheet
          lang={lang}
          title={t('sheetComplementosTitle')}
          onClose={closeSheet}
          items={[
            {
              icon: '🍃',
              label: t('konTitle'),
              sub: t('sheetSubKon'),
              onClick: () => { closeSheet(); handleKon() }
            },
            {
              icon: '💬',
              label: t('tokiTitle'),
              sub: t('sheetSubToki'),
              onClick: () => { closeSheet(); handleToki() }
            },
            {
              icon: '📚',
              label: t('cuentosTitle'),
              sub: `🪙 ${state.mani}`,
              onClick: () => { closeSheet(); handleCuentos() }
            }
          ]}
        />
      )}

      {activeSheet === 'more' && (
        <ActionSheet
          lang={lang}
          title={t('moreSheetTitle')}
          onClose={closeSheet}
          items={[
            { icon: '🏆', label: t('achievementsTitle'), onClick: () => { closeSheet(); handleAchievements() } },
            { icon: '📊', label: t('dashboardTitle'),    onClick: () => { closeSheet(); handleDashboard() } },
            { icon: '📜', label: t('historiaTitle'),     onClick: () => { closeSheet(); handleHistoria() } },
            { icon: '🔠', label: t('atlasTitle'),        onClick: () => { closeSheet(); handleAtlas() } },
            { icon: '🌍', label: t('kulupuTitle'),       onClick: () => { closeSheet(); handleKulupu() } }
          ]}
        />
      )}

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

function ActionSheet({ lang, title, items, onClose }) {
  const t = makeT(lang)
  const startYRef = useRef(null)
  const lastYRef = useRef(0)
  const sheetRef = useRef(null)
  const [dragY, setDragY] = useState(0)
  const [closing, setClosing] = useState(false)

  // Lock body scroll mientras el sheet está abierto
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  // Cerrar con animación + delay para que termine el slide-down
  const closeWithAnim = () => {
    if (closing) return
    setClosing(true)
    setDragY(window.innerHeight)
    setTimeout(onClose, 180)
  }

  const onTouchStart = (e) => {
    startYRef.current = e.touches[0].clientY
    lastYRef.current = 0
  }
  const onTouchMove = (e) => {
    if (startYRef.current == null) return
    const dy = e.touches[0].clientY - startYRef.current
    if (dy > 0) {
      lastYRef.current = dy
      setDragY(dy)
    }
  }
  const onTouchEnd = () => {
    const dy = lastYRef.current
    startYRef.current = null
    if (dy > 100) closeWithAnim()
    else setDragY(0)
  }

  return (
    <div className="more-sheet-backdrop" onClick={closeWithAnim}>
      <div
        className={`more-sheet ${closing ? 'is-closing' : ''}`}
        ref={sheetRef}
        style={{ transform: `translateY(${dragY}px)`, transition: dragY === 0 || closing ? 'transform 0.18s ease' : 'none' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="more-sheet-grabber" aria-hidden="true" />
        <h3 className="more-sheet-title">{title}</h3>
        <div className="more-sheet-grid">
          {items.map(it => (
            <button
              key={it.label}
              className={`more-sheet-item ${it.locked ? 'is-locked' : ''}`}
              onClick={it.onClick}
              disabled={!!it.locked}
            >
              <span className="more-sheet-item-icon">{it.icon}</span>
              <span className="more-sheet-item-label">{it.label}</span>
              {it.sub && <span className="more-sheet-item-sub">{it.sub}</span>}
            </button>
          ))}
        </div>
        <button className="more-sheet-close" onClick={closeWithAnim}>{t('moreSheetClose')}</button>
      </div>
    </div>
  )
}

