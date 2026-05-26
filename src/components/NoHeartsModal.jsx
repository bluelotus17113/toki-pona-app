import { useState } from 'react'
import { formatRemaining } from '../hooks/useProgress.js'
import { showRewardedAd } from '../hooks/useAds.js'
import { makeT } from '../data/i18n.js'
import KofiButton from './KofiButton.jsx'

export default function NoHeartsModal({ nextRegenAt, onClose, onReward, lang = 'es' }) {
  const t = makeT(lang)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const remainingMs = nextRegenAt ? Math.max(0, nextRegenAt - Date.now()) : 0

  const watchAd = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await showRewardedAd()
      if (result.rewarded || result.simulated) {
        onReward?.()
        // El modal se cerrará automáticamente desde el padre cuando hearts > 0
      }
    } catch (e) {
      console.warn('Ad failed:', e)
      setError(t('adFailed'))
      setTimeout(() => setError(null), 3500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card no-hearts" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="cerrar">✕</button>

        <div className="big-sad">💔</div>
        <h3>{t('noHeartsTitle')}</h3>
        <p className="modal-sub">{t('noHeartsSub')}</p>

        {nextRegenAt && (
          <div className="regen-timer">
            ⏳ {t('nextHeartIn')} <strong>{formatRemaining(remainingMs)}</strong>
          </div>
        )}

        <div className="modal-actions vertical">
          <button
            className={`primary-btn ${loading ? 'loading' : ''}`}
            onClick={watchAd}
            disabled={loading}
          >
            {loading ? `⏳ ${t('adLoading')}` : (error ? `⚠️ ${error}` : `🎬 ${t('watchAdForHeart')}`)}
          </button>
          <KofiButton variant="full" lang={lang} />
          <button className="secondary-btn" onClick={onClose}>
            ⏳ {t('waitInstead')}
          </button>
        </div>
      </div>
    </div>
  )
}
