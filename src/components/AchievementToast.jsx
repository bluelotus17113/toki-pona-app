import { useEffect, useRef } from 'react'
import { useAchievements } from '../hooks/useAchievements.js'
import { playLessonComplete } from '../hooks/useSound.js'

const DISPLAY_MS = 3200

export default function AchievementToast({ lang = 'es' }) {
  const { current, showing, dismissCurrent, setShowing } = useAchievements()
  const lastSeenId = useRef(null)

  useEffect(() => {
    if (current && !showing) {
      // arranca uno nuevo
      setShowing(true)
      if (current.id !== lastSeenId.current) {
        lastSeenId.current = current.id
        playLessonComplete()
      }
      const timer = setTimeout(() => {
        dismissCurrent()
      }, DISPLAY_MS)
      return () => clearTimeout(timer)
    }
  }, [current, showing, dismissCurrent, setShowing])

  if (!current) return null

  const title = current.title[lang] ?? current.title.es
  const desc = current.desc[lang] ?? current.desc.es

  return (
    <div className="achievement-toast" role="alert" aria-live="polite">
      <div className="achievement-toast-icon">{current.icon}</div>
      <div className="achievement-toast-body">
        <div className="achievement-toast-banner">
          🏆 {lang === 'en' ? 'achievement unlocked' : 'logro desbloqueado'}
        </div>
        <div className="achievement-toast-title">{title}</div>
        <div className="achievement-toast-desc">{desc}</div>
      </div>
    </div>
  )
}
