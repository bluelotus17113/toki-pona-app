import { useState } from 'react'
import { makeT } from '../data/i18n.js'

const FEEDBACK_EMAIL = 'vaknadesu@gmail.com'

export default function FeedbackButton({ lang = 'es' }) {
  const t = makeT(lang)
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const [type, setType] = useState('bug')

  const close = () => { setOpen(false); setText('') }

  const send = () => {
    const cleaned = text.trim()
    if (!cleaned) return
    const subject = encodeURIComponent(`[toki pona app] ${type}`)
    const bodyTxt = `Tipo / Type: ${type}\nIdioma / Lang: ${lang}\n\n${cleaned}`
    const body = encodeURIComponent(bodyTxt)
    window.location.href = `mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`
    setTimeout(close, 200)
  }

  return (
    <>
      <button className="feedback-btn" onClick={() => setOpen(true)}>
        💬 {t('sendFeedback')}
      </button>
      {open && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <header className="modal-head">
              <h3>💬 {t('feedbackTitle')}</h3>
              <button className="exit-btn" onClick={close}>✕</button>
            </header>
            <p className="modal-sub">{t('feedbackSub')}</p>

            <div className="feedback-types">
              {['bug', 'idea', 'love', 'other'].map(k => (
                <button
                  key={k}
                  className={`type-pill ${type === k ? 'active' : ''}`}
                  onClick={() => setType(k)}
                >
                  {t(`feedbackType_${k}`)}
                </button>
              ))}
            </div>

            <textarea
              className="feedback-text"
              placeholder={t('feedbackPlaceholder')}
              rows={5}
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
            />

            <div className="modal-actions">
              <button className="secondary-btn" onClick={close}>{t('cancel')}</button>
              <button
                className="primary-btn"
                onClick={send}
                disabled={!text.trim()}
              >
                {t('feedbackSend')}
              </button>
            </div>

            <p className="modal-note">{t('feedbackNote')}</p>
          </div>
        </div>
      )}
    </>
  )
}
