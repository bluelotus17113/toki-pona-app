import { useEffect, useState } from 'react'
import { timeUntilTomorrow } from '../utils/dailyPlay.js'
import { makeT } from '../data/i18n.js'

// Pantalla mostrada cuando un minijuego ya fue jugado hoy.
// Reutilizable: se le pasa icono, título del minijuego y onExit.
export default function DailyLockedScreen({ icon = '⏳', title, lang = 'es', onExit }) {
  const t = makeT(lang)
  const [tick, setTick] = useState(0)

  // actualizar countdown cada minuto
  useEffect(() => {
    const id = setInterval(() => setTick(x => x + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const { hours, mins } = timeUntilTomorrow()

  return (
    <div className="daily-locked-screen">
      <header className="daily-locked-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="daily-locked-title-block">
          <h2>{icon} {title}</h2>
        </div>
      </header>

      <div className="daily-locked-card">
        <div className="daily-locked-icon">✅</div>
        <h3 className="daily-locked-title">{t('dailyLockedTitle')}</h3>
        <p className="daily-locked-sub">{t('dailyLockedSub')}</p>

        <div className="daily-locked-countdown">
          <span className="daily-locked-countdown-label">
            {t('dailyLockedNextIn')}
          </span>
          <span className="daily-locked-countdown-value">
            {hours}h {mins}m
          </span>
        </div>

        <p className="daily-locked-tip">{t('dailyLockedTip')}</p>

        <button className="daily-locked-back" onClick={onExit}>
          {t('dailyLockedBack')}
        </button>
      </div>
    </div>
  )
}
