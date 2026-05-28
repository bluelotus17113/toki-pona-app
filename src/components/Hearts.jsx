import { useEffect, useState } from 'react'
import { formatRemaining } from '../hooks/useProgress.js'
import { makeT } from '../data/i18n.js'

export default function Hearts({ hearts, max, nextRegenAt, lang = 'es', compact = false }) {
  const t = makeT(lang)
  const showTimer = hearts < max && nextRegenAt
  // Tick local para que el countdown se vea fluido aunque `state` no cambie
  // (useProgress evita re-render cuando applyRegen no modifica el estado).
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!showTimer) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [showTimer])
  const remainingMs = nextRegenAt ? Math.max(0, nextRegenAt - now) : 0

  if (compact) {
    return (
      <div className="hearts-compact" title={showTimer ? `${t('nextHeartIn')} ${formatRemaining(remainingMs)}` : t('heartsMax')}>
        <span className="heart-icon">❤️</span>
        <span className="heart-count">{hearts}</span>
        {showTimer && <span className="heart-timer">+{formatRemaining(remainingMs)}</span>}
      </div>
    )
  }

  return (
    <div className="hearts-block">
      <div className="hearts-row">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={`heart-pip ${i < hearts ? 'full' : 'empty'}`}>
            {i < hearts ? '❤️' : '🤍'}
          </span>
        ))}
      </div>
      {showTimer ? (
        <div className="hearts-timer" aria-live="polite">
          {t('nextHeartIn')} <strong>{formatRemaining(remainingMs)}</strong>
        </div>
      ) : (
        <div className="hearts-timer full"><strong>{t('heartsMax')}</strong></div>
      )}
    </div>
  )
}
