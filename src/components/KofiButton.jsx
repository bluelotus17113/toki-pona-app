import { makeT } from '../data/i18n.js'

const KOFI_URL = 'https://ko-fi.com/vaknadesu'

// variant: 'compact' (footer) | 'full' (no-hearts modal)
export default function KofiButton({ variant = 'compact', lang = 'es' }) {
  const t = makeT(lang)

  if (variant === 'full') {
    return (
      <a
        className="kofi-btn full"
        href={KOFI_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="kofi-icon">☕</span>
        <span className="kofi-text">
          <span className="kofi-title">{t('kofiModalTitle')}</span>
          <span className="kofi-sub">{t('kofiModalSub')}</span>
        </span>
      </a>
    )
  }

  return (
    <a
      className="kofi-btn compact"
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      ☕ {t('kofiSupport')}
    </a>
  )
}
