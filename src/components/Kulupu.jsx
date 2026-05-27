import { useEffect } from 'react'
import { makeT } from '../data/i18n.js'
import { playClick } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

// Enlaces a los principales espacios de la comunidad real de toki pona.
// No hay backend: solo abrimos en el navegador del sistema.
const LINKS = [
  {
    id: 'discord',
    icon: '💬',
    glyph: 'kulupu',
    title: 'ma pona pi toki pona',
    sub: { es: 'discord — el chat más grande, gente fluida 24/7', en: 'discord — the biggest chat, fluent people 24/7' },
    url: 'https://discord.gg/tokipona',
    accent: '#c7d4ff'
  },
  {
    id: 'reddit',
    icon: '🗨️',
    glyph: 'toki',
    title: 'r/tokipona',
    sub: { es: 'reddit — posts, recursos y debates', en: 'reddit — posts, resources and debates' },
    url: 'https://www.reddit.com/r/tokipona/',
    accent: '#ffd0bf'
  },
  {
    id: 'wikipesija',
    icon: '📚',
    glyph: 'sona',
    title: 'wikipesija',
    sub: { es: 'wikipedia escrita en toki pona por la comunidad', en: 'wikipedia written in toki pona by the community' },
    url: 'https://wikipesija.org/wiki/lipu_open',
    accent: '#c6efd0'
  },
  {
    id: 'lipu-tenpo',
    icon: '📰',
    glyph: 'lipu',
    title: 'lipu tenpo',
    sub: { es: 'revista mensual — cuentos y artículos en toki pona nativo', en: 'monthly magazine — stories and articles in native toki pona' },
    url: 'https://liputenpo.org/',
    accent: '#fde74c'
  },
  {
    id: 'musilili',
    icon: '🎨',
    glyph: 'sitelen',
    title: 'musilili.net',
    sub: { es: 'el sitio de jan Same — fuentes, tipografías, recursos', en: "jan Same's site — fonts, typography, resources" },
    url: 'https://musilili.net/',
    accent: '#ffb8cd'
  },
  {
    id: 'linku',
    icon: '🔠',
    glyph: 'nimi',
    title: 'linku.la',
    sub: { es: 'diccionario oficial moderno — fuentes y herramientas', en: 'modern official dictionary — fonts and tools' },
    url: 'https://linku.la/',
    accent: '#d4e7f5'
  }
]

export default function Kulupu({ lang = 'es', onExit }) {
  const t = makeT(lang)

  useEffect(() => { unlock('kulupu-opened') }, [])

  const handleClick = (id) => {
    playClick()
    if (id === 'discord' || id === 'reddit' || id === 'wikipesija' ||
        id === 'lipu-tenpo' || id === 'musilili' || id === 'linku') {
      unlock('kulupu-explorer')
    }
  }

  return (
    <div className="kulupu-screen">
      <header className="kulupu-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="kulupu-title-block">
          <h2>🌍 {t('kulupuTitle')}</h2>
          <p>{t('kulupuSub')}</p>
        </div>
      </header>

      <div className="kulupu-banner">
        {t('kulupuBanner')}
      </div>

      <div className="kulupu-list">
        {LINKS.map(link => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="kulupu-card"
            style={{ '--card-accent': link.accent }}
            onClick={() => handleClick(link.id)}
          >
            <span className="kulupu-card-icon">{link.icon}</span>
            <span className="kulupu-card-glyph sitelen" aria-hidden="true">{link.glyph}</span>
            <span className="kulupu-card-text">
              <span className="kulupu-card-title">{link.title}</span>
              <span className="kulupu-card-sub">{link.sub[lang] ?? link.sub.es}</span>
            </span>
            <span className="kulupu-card-arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>

      <div className="kulupu-footnote">
        <p>{t('kulupuFootnote')}</p>
      </div>
    </div>
  )
}
