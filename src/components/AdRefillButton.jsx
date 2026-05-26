import { useState } from 'react'
import { showRewardedAd, adsAvailable } from '../hooks/useAds.js'
import { makeT } from '../data/i18n.js'

export default function AdRefillButton({ onReward, lang = 'es', variant = 'full' }) {
  const t = makeT(lang)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const result = await showRewardedAd()
      if (result.rewarded || result.simulated) {
        onReward?.()
      }
    } catch (e) {
      console.warn('Ad failed:', e)
      setError(t('adFailed'))
      setTimeout(() => setError(null), 3500)
    } finally {
      setLoading(false)
    }
  }

  // icon-only para el status strip compacto
  if (variant === 'icon') {
    return (
      <button
        className={`ad-refill-icon ${loading ? 'loading' : ''} ${error ? 'has-error' : ''}`}
        onClick={handleClick}
        disabled={loading}
        title={error || t('adRefillSub')}
        aria-label={t('adRefillSub')}
      >
        {loading ? '⏳' : (error ? '⚠️' : '🎬+❤️')}
      </button>
    )
  }

  return (
    <button
      className={`ad-refill-btn ${loading ? 'loading' : ''} ${error ? 'has-error' : ''}`}
      onClick={handleClick}
      disabled={loading}
      title={t('adRefillSub')}
    >
      <span className="ad-icon">{loading ? '⏳' : '🎬'}</span>
      <span className="ad-text">
        <span className="ad-title">
          {loading ? t('adLoading') : (error ?? t('adRefillTitle'))}
        </span>
        {!loading && !error && (
          <span className="ad-sub">
            {adsAvailable() ? t('adRefillSub') : t('adWebNote')}
          </span>
        )}
      </span>
      {!loading && !error && <span className="ad-plus">+❤️</span>}
    </button>
  )
}
