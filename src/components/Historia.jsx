import { useEffect, useState } from 'react'
import { HISTORIA_SECTIONS } from '../data/historia.js'
import { makeT } from '../data/i18n.js'
import { playClick } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'

// Renderer markdown-lite: **bold**, `code`, párrafos por doble salto
function renderBody(text) {
  return text.split(/\n\n+/).map((p, i) => (
    <p key={i} dangerouslySetInnerHTML={{
      __html: p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n- /g, '<br/>• ')
        .replace(/^- /, '• ')
        .replace(/\n/g, '<br/>')
    }} />
  ))
}

export default function Historia({ lang = 'es', onExit }) {
  const t = makeT(lang)
  const [openId, setOpenId] = useState('origen')

  useEffect(() => { unlock('history-read') }, [])

  const toggle = (id) => {
    playClick()
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="historia-screen">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="historia-title-block">
          <h2>📜 {t('historiaTitle')}</h2>
          <p>{t('historiaSub')}</p>
        </div>
      </header>

      <div className="historia-banner">
        🌿 {t('historiaIntro')}
      </div>

      <div className="historia-list">
        {HISTORIA_SECTIONS.map(s => {
          const isOpen = openId === s.id
          const title = s.title[lang] ?? s.title.es
          const body  = s.body[lang]  ?? s.body.es
          return (
            <article key={s.id} className={`historia-card ${isOpen ? 'open' : ''}`}>
              <button className="historia-card-head" onClick={() => toggle(s.id)}>
                <span className="historia-card-icon">{s.icon}</span>
                <div className="historia-card-titles">
                  {s.year && <span className="historia-card-year">{s.year}</span>}
                  <h3 className="historia-card-title">{title}</h3>
                </div>
                <span className="historia-card-chev">{isOpen ? '▾' : '▸'}</span>
              </button>
              {isOpen && (
                <div className="historia-card-body">
                  {renderBody(body)}
                </div>
              )}
            </article>
          )
        })}
      </div>

      <div className="historia-footer-quote">
        <em>"toki pona li toki pona"</em>
        <br />
        <span>— {t('historiaQuoteSub')}</span>
      </div>
    </div>
  )
}
