import { useMemo, useState } from 'react'
import { ACHIEVEMENTS, CATEGORIES, TOTAL_ACHIEVEMENTS } from '../data/achievements.js'
import { useAchievements } from '../hooks/useAchievements.js'
import { makeT } from '../data/i18n.js'

export default function Achievements({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const { unlocked } = useAchievements()
  const [filter, setFilter] = useState('all')

  const totalUnlocked = unlocked.size
  const pct = Math.round((totalUnlocked / TOTAL_ACHIEVEMENTS) * 100)

  const filtered = useMemo(() => {
    if (filter === 'all') return ACHIEVEMENTS
    if (filter === 'unlocked') return ACHIEVEMENTS.filter(a => unlocked.has(a.id))
    if (filter === 'locked') return ACHIEVEMENTS.filter(a => !unlocked.has(a.id))
    return ACHIEVEMENTS.filter(a => a.category === filter)
  }, [filter, unlocked])

  return (
    <div className="achievements-screen">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="achievements-title-block">
          <h2>🏆 {t('achievementsTitle')}</h2>
          <p className="achievements-sub">{totalUnlocked} / {TOTAL_ACHIEVEMENTS} · {pct}%</p>
        </div>
      </header>

      <div className="achievements-progress-bar">
        <div className="achievements-progress-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="achievements-filters">
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
          {t('filterAll')}
        </FilterPill>
        <FilterPill active={filter === 'unlocked'} onClick={() => setFilter('unlocked')}>
          ✓ {t('achievementsUnlocked')}
        </FilterPill>
        <FilterPill active={filter === 'locked'} onClick={() => setFilter('locked')}>
          🔒 {t('achievementsLocked')}
        </FilterPill>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <FilterPill key={key} active={filter === key} onClick={() => setFilter(key)}>
            {cat.icon} {cat[lang] ?? cat.es}
          </FilterPill>
        ))}
      </div>

      <div className="achievements-grid">
        {filtered.map(a => {
          const isUnlocked = unlocked.has(a.id)
          const title = a.title[lang] ?? a.title.es
          const desc = a.desc[lang] ?? a.desc.es
          return (
            <div
              key={a.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'} cat-${a.category}`}
            >
              <div className="achievement-icon-wrap">
                <span className="achievement-icon">{isUnlocked ? a.icon : '🔒'}</span>
              </div>
              <div className="achievement-body">
                <div className="achievement-title">{title}</div>
                <div className="achievement-desc">{desc}</div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="achievements-empty">{t('achievementsEmpty')}</div>
        )}
      </div>
    </div>
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      className={`filter-pill ${active ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
