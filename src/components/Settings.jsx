import { useEffect, useState } from 'react'
import { LANGS, makeT } from '../data/i18n.js'
import { THEMES } from '../hooks/useTheme.js'
import { useSoundToggle } from '../hooks/useSound.js'
import {
  isPermissionGranted, requestPermission,
  getHourPref, setHourPref,
  scheduleDaily, cancelAll, isSetupDone
} from '../hooks/useNotifications.js'
import { resetOnboarding } from './Onboarding.jsx'

// Pantalla de configuración centralizada.
// Toggles: sonido · tema · idioma · notif on/off · hora notif · acciones (reset).

const APP_VERSION = '1.0'

export default function Settings({ progress, lang, setLang, theme, onSetTheme, onExit }) {
  const t = makeT(lang)
  const [soundOn, toggleSound] = useSoundToggle()
  const [notifGranted, setNotifGranted] = useState(false)
  const [notifSetup, setNotifSetup] = useState(false)
  const [hour, setHour] = useState(getHourPref())

  // Cargar estado real de notifs al montar
  useEffect(() => {
    isPermissionGranted().then(setNotifGranted)
    setNotifSetup(isSetupDone())
  }, [])

  const handleNotifToggle = async () => {
    if (notifSetup) {
      await cancelAll()
      setNotifSetup(false)
    } else {
      let granted = notifGranted
      if (!granted) granted = await requestPermission()
      setNotifGranted(granted)
      if (granted) {
        const ok = await scheduleDaily({ lang })
        setNotifSetup(ok)
      }
    }
  }

  const handleHourChange = async (e) => {
    const h = parseInt(e.target.value, 10)
    setHour(h)
    setHourPref(h)
    if (notifSetup) {
      // re-programar con la nueva hora
      await scheduleDaily({ lang })
    }
  }

  const handleResetProgress = () => {
    if (!confirm(t('settingsResetConfirm'))) return
    if (!confirm(t('settingsResetConfirm2'))) return
    progress.reset()
    resetOnboarding()
    // recargar para que aparezca el onboarding de nuevo
    if (typeof window !== 'undefined') window.location.reload()
  }

  const handleResetOnboardingOnly = () => {
    if (!confirm(t('settingsOnboardingResetConfirm'))) return
    resetOnboarding()
    if (typeof window !== 'undefined') window.location.reload()
  }

  return (
    <div className="settings-screen">
      <header className="settings-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="settings-title-block">
          <h2>⚙️ {t('settingsTitle')}</h2>
          <p>{t('settingsSub')}</p>
        </div>
      </header>

      {/* Apariencia */}
      <section className="settings-section">
        <h3 className="settings-section-title">🎨 {t('settingsAppearance')}</h3>

        <div className="settings-row">
          <span className="settings-row-label">{t('settingsTheme')}</span>
          <div className="settings-segment">
            {THEMES.map(th => (
              <button
                key={th}
                className={`settings-segment-btn ${theme === th ? 'active' : ''}`}
                onClick={() => onSetTheme(th)}
              >
                {th === 'light' ? '☀️' : th === 'dark' ? '🌙' : '📜'} {t(`settingsTheme_${th}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-row">
          <span className="settings-row-label">{t('settingsLanguage')}</span>
          <div className="settings-segment">
            {LANGS.map(l => (
              <button
                key={l.code}
                className={`settings-segment-btn ${lang === l.code ? 'active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.flag} {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Audio */}
      <section className="settings-section">
        <h3 className="settings-section-title">🔊 {t('settingsAudio')}</h3>

        <div className="settings-row">
          <span className="settings-row-label">{t('settingsSoundEffects')}</span>
          <button
            className={`settings-toggle ${soundOn ? 'on' : 'off'}`}
            onClick={toggleSound}
            aria-label={soundOn ? t('soundOn') : t('soundOff')}
          >
            <span className="settings-toggle-dot" />
          </button>
        </div>
      </section>

      {/* Notificaciones */}
      <section className="settings-section">
        <h3 className="settings-section-title">🔔 {t('settingsNotifications')}</h3>

        <div className="settings-row">
          <span className="settings-row-label">
            {t('settingsDailyReminder')}
            <small className="settings-row-sub">{t('settingsDailyReminderSub')}</small>
          </span>
          <button
            className={`settings-toggle ${notifSetup ? 'on' : 'off'}`}
            onClick={handleNotifToggle}
          >
            <span className="settings-toggle-dot" />
          </button>
        </div>

        {notifSetup && (
          <div className="settings-row">
            <span className="settings-row-label">{t('settingsNotifHour')}</span>
            <input
              type="number"
              min="0"
              max="23"
              value={hour}
              onChange={handleHourChange}
              className="settings-number-input"
            />
            <span className="settings-hour-suffix">:00</span>
          </div>
        )}
      </section>

      {/* Acciones de progreso */}
      <section className="settings-section">
        <h3 className="settings-section-title">📦 {t('settingsData')}</h3>

        <button className="settings-action-btn warn" onClick={handleResetOnboardingOnly}>
          🌱 {t('settingsResetOnboarding')}
        </button>
        <p className="settings-action-help">{t('settingsResetOnboardingHelp')}</p>

        <button className="settings-action-btn danger" onClick={handleResetProgress}>
          🗑 {t('settingsResetProgress')}
        </button>
        <p className="settings-action-help">{t('settingsResetProgressHelp')}</p>
      </section>

      {/* Acerca de */}
      <section className="settings-section">
        <h3 className="settings-section-title">ℹ️ {t('settingsAbout')}</h3>
        <div className="settings-about">
          <div className="settings-about-row">
            <span>toki pona a!</span>
            <span className="settings-about-value">v{APP_VERSION}</span>
          </div>
          <div className="settings-about-row">
            <span>{t('settingsLessons')}</span>
            <span className="settings-about-value">50</span>
          </div>
          <div className="settings-about-row">
            <span>{t('settingsMinigames')}</span>
            <span className="settings-about-value">9</span>
          </div>
          <div className="settings-about-row">
            <span>{t('settingsAchievements')}</span>
            <span className="settings-about-value">42</span>
          </div>
          <p className="settings-credits">{t('settingsCredits')}</p>
        </div>
      </section>
    </div>
  )
}
