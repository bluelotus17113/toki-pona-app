import { useState } from 'react'
import { makeT } from '../data/i18n.js'
import { playClick, playLessonComplete } from '../hooks/useSound.js'

// Tutorial primera vez: 5 slides explicativos. Se muestra solo si el usuario
// nunca lo completó (localStorage flag). Al final marca onboarded = true.

const ONBOARD_KEY = 'tokipona.onboarded'

export function isOnboarded() {
  try { return localStorage.getItem(ONBOARD_KEY) === '1' } catch { return false }
}

export function markOnboarded() {
  try { localStorage.setItem(ONBOARD_KEY, '1') } catch {}
}

export function resetOnboarding() {
  try { localStorage.removeItem(ONBOARD_KEY) } catch {}
}

export default function Onboarding({ lang = 'es', onFinish }) {
  const t = makeT(lang)
  const [step, setStep] = useState(0)

  const SLIDES = [
    {
      icon: '🌱',
      title: t('onboardSlide1Title'),
      body: t('onboardSlide1Body'),
      glyph: 'toki'
    },
    {
      icon: '📚',
      title: t('onboardSlide2Title'),
      body: t('onboardSlide2Body'),
      glyph: 'kama'
    },
    {
      icon: '🎮',
      title: t('onboardSlide3Title'),
      body: t('onboardSlide3Body'),
      glyph: 'musi'
    },
    {
      icon: '📖',
      title: t('onboardSlide4Title'),
      body: t('onboardSlide4Body'),
      glyph: 'lipu'
    },
    {
      icon: '📊',
      title: t('onboardSlide5Title'),
      body: t('onboardSlide5Body'),
      glyph: 'pona'
    }
  ]

  const current = SLIDES[step]
  const isLast = step === SLIDES.length - 1
  const isFirst = step === 0

  const next = () => {
    playClick()
    if (isLast) {
      markOnboarded()
      playLessonComplete()
      onFinish?.()
    } else {
      setStep(s => s + 1)
    }
  }

  const prev = () => {
    if (isFirst) return
    playClick()
    setStep(s => s - 1)
  }

  const skip = () => {
    playClick()
    markOnboarded()
    onFinish?.()
  }

  return (
    <div className="onboarding-screen">
      <button className="onboarding-skip" onClick={skip}>
        {t('onboardSkip')} →
      </button>

      <div className="onboarding-card" key={step}>
        <div className="onboarding-glyph-row">
          <span className="onboarding-icon">{current.icon}</span>
          <span className="sitelen onboarding-sitelen" aria-hidden="true">{current.glyph}</span>
        </div>
        <h2 className="onboarding-title">{current.title}</h2>
        <p className="onboarding-body">{current.body}</p>
      </div>

      <div className="onboarding-dots">
        {SLIDES.map((_, i) => (
          <span key={i} className={`onboarding-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
        ))}
      </div>

      <div className="onboarding-actions">
        <button
          className={`onboarding-btn secondary ${isFirst ? 'invisible' : ''}`}
          onClick={prev}
          disabled={isFirst}
        >
          ← {t('onboardBack')}
        </button>
        <button className="onboarding-btn primary" onClick={next}>
          {isLast ? `${t('onboardStart')} 🚀` : `${t('onboardNext')} →`}
        </button>
      </div>
    </div>
  )
}
