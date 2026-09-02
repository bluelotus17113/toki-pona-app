import { useEffect, useRef, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { LANGS, makeT } from '../data/i18n.js'
import { exportBackup, readBackupFile, applyBackup } from '../utils/backup.js'
import { LESSONS } from '../data/lessons.js'
import { TOTAL_ACHIEVEMENTS } from '../data/achievements.js'
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

// Espejo de versionName en android/app/build.gradle — mover las dos juntas.
const APP_VERSION = '1.1'

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

  // ---- copia de seguridad ----
  const fileInputRef = useRef(null)
  const [backupBusy, setBackupBusy] = useState(false)
  const [backupMsg, setBackupMsg] = useState(null)  // { kind: 'ok' | 'err', text }

  const handleExport = async () => {
    setBackupBusy(true)
    setBackupMsg(null)
    try {
      const { location } = await exportBackup()
      const key = Capacitor.isNativePlatform() ? 'backupSaved' : 'backupSavedWeb'
      setBackupMsg({ kind: 'ok', text: t(key, { location }) })
    } catch {
      setBackupMsg({ kind: 'err', text: t('backupErrWrite') })
    } finally {
      setBackupBusy(false)
    }
  }

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0]
    // Limpiar el input permite volver a elegir el MISMO archivo después
    // (sin esto, el onChange no dispara la segunda vez).
    e.target.value = ''
    if (!file) return
    setBackupMsg(null)
    try {
      const backup = await readBackupFile(file)
      const date = backup.exportedAt
        ? new Date(backup.exportedAt).toLocaleDateString()
        : '—'
      // Mostrar qué trae la copia ANTES de pisar lo que el usuario tiene ahora:
      // restaurar un backup viejo por error es tan destructivo como el reset.
      if (!confirm(t('backupRestoreConfirm', { date, ...backup.summary }))) return
      applyBackup(backup)
      setBackupMsg({ kind: 'ok', text: t('backupRestored') })
      // Recargar para que los singletons (SRS, logros) relean el almacenamiento.
      setTimeout(() => window.location.reload(), 700)
    } catch (err) {
      const key = err?.message ?? ''
      setBackupMsg({
        kind: 'err',
        text: key.startsWith('backupErr') ? t(key) : t('backupErrNotJson')
      })
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

        <button className="settings-action-btn good" onClick={handleExport} disabled={backupBusy}>
          💾 {backupBusy ? t('backupWorking') : t('backupExport')}
        </button>
        <p className="settings-action-help">{t('backupExportHelp')}</p>

        <button
          className="settings-action-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={backupBusy}
        >
          ↩️ {t('backupImport')}
        </button>
        <p className="settings-action-help">{t('backupImportHelp')}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImportFile}
          hidden
        />

        {backupMsg && (
          <p className={`settings-backup-msg ${backupMsg.kind}`} role="status">
            {backupMsg.text}
          </p>
        )}

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
          {/* Contados desde los datos: hardcodearlos ya nos dejó "42 logros"
              cuando en realidad hay 44. Minijuegos sigue fijo porque no hay
              catálogo del cual contarlos. */}
          <div className="settings-about-row">
            <span>{t('settingsLessons')}</span>
            <span className="settings-about-value">{LESSONS.length}</span>
          </div>
          <div className="settings-about-row">
            <span>{t('settingsMinigames')}</span>
            <span className="settings-about-value">9</span>
          </div>
          <div className="settings-about-row">
            <span>{t('settingsAchievements')}</span>
            <span className="settings-about-value">{TOTAL_ACHIEVEMENTS}</span>
          </div>
          <p className="settings-credits">{t('settingsCredits')}</p>
        </div>
      </section>
    </div>
  )
}
