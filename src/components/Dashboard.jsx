import { useMemo } from 'react'
import { LESSONS, SECTIONS } from '../data/lessons.js'
import { VOCAB } from '../data/vocabulary.js'
import { makeT } from '../data/i18n.js'
import { getMasteryDistribution } from '../hooks/useSrs.js'

// Dashboard de progreso: stats + gráfico de XP de los últimos 30 días + % por sección.
// Lee todo de progress.state (dailyXp, streak, xp, completed) — no hace cálculos pesados.

function lastNDays(n) {
  const out = []
  const today = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    out.push({ key, label: d.getDate() })
  }
  return out
}

export default function Dashboard({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)
  const { state, effectiveStreak } = progress

  // Últimos 30 días de XP
  const days = useMemo(() => lastNDays(30), [])
  const dailyXp = state.dailyXp ?? {}
  const maxXp = Math.max(1, ...days.map(d => dailyXp[d.key] ?? 0))

  // % de lecciones por sección
  const sectionStats = useMemo(() => {
    return SECTIONS.map(sec => {
      const lessons = LESSONS.filter(l => l.section === sec.id)
      const done = lessons.filter(l => state.completed.includes(l.id)).length
      return {
        id: sec.id,
        icon: sec.icon,
        title: sec[`title_${lang}`] ?? sec.title_es,
        done,
        total: lessons.length,
        pct: lessons.length === 0 ? 0 : Math.round((done / lessons.length) * 100)
      }
    })
  }, [state.completed, lang])

  const totalLessons = LESSONS.length
  const completedLessons = state.completed.length

  // Palabras dominadas via SRS
  const mastery = useMemo(() => getMasteryDistribution(), [state.completed.length])
  const totalWords = Object.keys(VOCAB).length

  // XP promedio últimos 7 días
  const last7AvgXp = useMemo(() => {
    const recent = days.slice(-7)
    const sum = recent.reduce((acc, d) => acc + (dailyXp[d.key] ?? 0), 0)
    return Math.round(sum / 7)
  }, [days, dailyXp])

  // ¿Activo hoy?
  const todayKey = days[days.length - 1].key
  const activeToday = (dailyXp[todayKey] ?? 0) > 0

  return (
    <div className="dashboard-screen">
      <header className="dashboard-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="dashboard-title-block">
          <h2>📊 {t('dashboardTitle')}</h2>
          <p>{t('dashboardSub')}</p>
        </div>
      </header>

      {/* Stats grid */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">🔥</div>
          <div className="dashboard-stat-value">{effectiveStreak}</div>
          <div className="dashboard-stat-label">{t('dashboardStreak')}</div>
          {/* "en riesgo" solo si la racha sigue viva (ayer) y hoy aún no juega —
              antes avisaba igual con rachas muertas hace semanas. */}
          {!activeToday && effectiveStreak > 0 && (
            <div className="dashboard-stat-warn">{t('dashboardStreakAtRisk')}</div>
          )}
        </div>
        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">⭐</div>
          <div className="dashboard-stat-value">{state.xp.toLocaleString()}</div>
          <div className="dashboard-stat-label">{t('dashboardTotalXp')}</div>
        </div>
        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">📚</div>
          <div className="dashboard-stat-value">{completedLessons}/{totalLessons}</div>
          <div className="dashboard-stat-label">{t('dashboardLessons')}</div>
        </div>
        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">🧠</div>
          <div className="dashboard-stat-value">{mastery.mastered}</div>
          <div className="dashboard-stat-label">{t('dashboardMastered')}</div>
          <div className="dashboard-stat-sub">/ {totalWords} {t('dashboardWords')}</div>
        </div>
      </div>

      {/* XP por día — gráfico de barras */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>{t('dashboardXpChart')}</h3>
          <span className="dashboard-card-sub">{t('dashboardAvg7d', { n: last7AvgXp })}</span>
        </div>
        <div className="dashboard-chart" role="img" aria-label={t('dashboardXpChart')}>
          {days.map((d, i) => {
            const xp = dailyXp[d.key] ?? 0
            const height = xp === 0 ? 2 : Math.max(4, Math.round((xp / maxXp) * 100))
            const isToday = i === days.length - 1
            return (
              <div key={d.key} className="dashboard-chart-col" title={`${d.key}: ${xp} XP`}>
                <div className={`dashboard-chart-bar ${isToday ? 'is-today' : ''} ${xp === 0 ? 'is-empty' : ''}`}
                  style={{ height: `${height}%` }} />
                {(i % 5 === 0 || i === days.length - 1) && (
                  <div className="dashboard-chart-label">{d.label}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* % por sección */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>{t('dashboardSectionsProgress')}</h3>
        </div>
        <div className="dashboard-sections">
          {sectionStats.map(sec => (
            <div key={sec.id} className="dashboard-section-row">
              <span className="dashboard-section-icon">{sec.icon}</span>
              <div className="dashboard-section-body">
                <div className="dashboard-section-row-top">
                  <span className="dashboard-section-title">{sec.title}</span>
                  <span className="dashboard-section-pct">{sec.done}/{sec.total}</span>
                </div>
                <div className="dashboard-section-bar">
                  <div
                    className={`dashboard-section-bar-fill ${sec.pct === 100 ? 'done' : ''}`}
                    style={{ width: `${sec.pct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vocabulario — mini distribución */}
      <div className="dashboard-card">
        <div className="dashboard-card-header">
          <h3>{t('dashboardVocab')}</h3>
        </div>
        <div className="dashboard-vocab">
          <div className="dashboard-vocab-row">
            <span className="dashboard-vocab-label">🌱 {t('dashboardLearning')}</span>
            <span className="dashboard-vocab-val">{mastery.learning}</span>
          </div>
          <div className="dashboard-vocab-row">
            <span className="dashboard-vocab-label">🌳 {t('dashboardMastered')}</span>
            <span className="dashboard-vocab-val">{mastery.mastered}</span>
          </div>
          <div className="dashboard-vocab-row">
            <span className="dashboard-vocab-label">⏰ {t('dashboardDue')}</span>
            <span className="dashboard-vocab-val">{mastery.due}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
