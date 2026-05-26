import { useEffect, useState } from 'react'
import { GRAMMAR_TOPICS } from '../data/grammar.js'
import { makeT } from '../data/i18n.js'
import { speak } from '../hooks/useSpeech.js'
import { unlock } from '../hooks/useAchievements.js'

// Render mínimo de "markdown-lite": **negrita**, `código`, doble salto = nuevo párrafo.
function renderText(text) {
  const paragraphs = text.split(/\n\n+/)
  return paragraphs.map((p, i) => (
    <p key={i} dangerouslySetInnerHTML={{
      __html: p
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br/>')
    }} />
  ))
}

export default function Grammar({ lang, onExit }) {
  const t = makeT(lang)
  const [openId, setOpenId] = useState('overview')
  const [playing, setPlaying] = useState(null)

  useEffect(() => { unlock('grammar-read') }, [])

  const toggle = (id) => setOpenId(openId === id ? null : id)

  const playExample = (tp) => {
    setPlaying(tp)
    speak(tp, { onEnd: () => setPlaying(null) })
  }

  return (
    <div className="grammar">
      <header className="grammar-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="grammar-title-block">
          <h2 className="grammar-title">📐 {t('grammarTitle')}</h2>
        </div>
      </header>

      <p className="grammar-intro">{t('grammarIntro')}</p>

      <div className="topic-list">
        {GRAMMAR_TOPICS.map(topic => {
          const isOpen = openId === topic.id
          const title = topic[`title_${lang}`] ?? topic.title_es
          const body = topic[`body_${lang}`] ?? topic.body_es
          return (
            <div key={topic.id} className={`topic ${isOpen ? 'open' : ''}`}>
              <button className="topic-head" onClick={() => toggle(topic.id)}>
                <span className="topic-icon">{topic.icon}</span>
                <span className="topic-title">{title}</span>
                <span className="topic-chevron">{isOpen ? '▾' : '▸'}</span>
              </button>
              {isOpen && (
                <div className="topic-body">
                  <div className="topic-text">{renderText(body)}</div>
                  {topic.examples.length > 0 && (
                    <div className="topic-examples">
                      {topic.examples.map((ex, i) => (
                        <div key={i} className="example-row">
                          <button
                            className={`example-audio ${playing === ex.tp ? 'is-playing' : ''}`}
                            onClick={() => playExample(ex.tp)}
                            title="escuchar / listen"
                          >
                            {playing === ex.tp ? '🔉' : '🔊'}
                          </button>
                          <code className="example-tp">{ex.tp}</code>
                          <span className="example-arrow">→</span>
                          <span className="example-tr">{ex[lang] ?? ex.es}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
