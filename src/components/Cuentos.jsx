import { useMemo, useState } from 'react'
import { STORIES, STORY_LENGTHS, storiesByLength } from '../data/stories.js'
import { makeT } from '../data/i18n.js'
import { playClick, playSuccess, playError } from '../hooks/useSound.js'

export default function Cuentos({ progress, lang = 'es', onExit, onRead }) {
  const t = makeT(lang)
  const [tab, setTab] = useState('shop')   // 'shop' | 'library'

  const owned = progress.state.purchasedStories
  const ownedStories = useMemo(
    () => STORIES.filter(s => owned.includes(s.id)),
    [owned]
  )

  const handleBuy = (story) => {
    const meta = STORY_LENGTHS[story.length]
    if (progress.state.completed.length < meta.minLessons) {
      playError()
      return
    }
    const ok = progress.purchaseStory(story.id, meta.price)
    if (ok) {
      playSuccess()
    } else {
      playError()
    }
  }

  const handleRead = (story) => {
    playClick()
    onRead(story.id)
  }

  return (
    <div className="cuentos-screen">
      <header className="lesson-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="cuentos-title-block">
          <h2>📚 {t('cuentosTitle')}</h2>
        </div>
        <div className="cuentos-mani" title={t('mani')}>
          <span className="mani-icon">🪙</span>
          <span className="mani-value">{progress.state.mani}</span>
        </div>
      </header>

      <div className="cuentos-tabs">
        <button
          className={`tab ${tab === 'shop' ? 'active' : ''}`}
          onClick={() => { playClick(); setTab('shop') }}
        >
          🏪 {t('cuentosShop')}
        </button>
        <button
          className={`tab ${tab === 'library' ? 'active' : ''}`}
          onClick={() => { playClick(); setTab('library') }}
        >
          📖 {t('cuentosLibrary')} · {ownedStories.length}
        </button>
      </div>

      {tab === 'shop' && (
        <div className="cuentos-shop">
          {['short', 'medium', 'long'].map(len => {
            const meta = STORY_LENGTHS[len]
            const stories = storiesByLength(len)
            const unlockReady = progress.state.completed.length >= meta.minLessons
            return (
              <section key={len} className={`shop-section ${unlockReady ? '' : 'locked'}`}>
                <header className="shop-section-head">
                  <span className="shop-section-emoji">{meta.emoji}</span>
                  <div className="shop-section-info">
                    <h3 className="shop-section-title">
                      {t('storiesLength_' + len)}
                    </h3>
                    <p className="shop-section-meta">
                      🪙 {meta.price} {t('mani')} · {!unlockReady && `🔒 ${t('storyUnlockAt', { n: meta.minLessons })}`}
                      {unlockReady && t('storyAvailable')}
                    </p>
                  </div>
                </header>

                <div className="story-grid">
                  {stories.map(story => {
                    const isOwned = owned.includes(story.id)
                    const title = story.title[lang] ?? story.title.es
                    const canAfford = progress.state.mani >= meta.price
                    return (
                      <article key={story.id} className={`story-card ${isOwned ? 'owned' : ''} ${!unlockReady ? 'locked' : ''}`}>
                        <div className="story-thumb">{story.thumbnail}</div>
                        <div className="story-body">
                          <h4 className="story-title">{title}</h4>
                          <div className="story-meta">
                            {story.sentences.length} {t('sentences')}
                          </div>
                        </div>
                        {isOwned ? (
                          <button className="story-btn read" onClick={() => handleRead(story)}>
                            ▶ {t('storyRead')}
                          </button>
                        ) : !unlockReady ? (
                          <button className="story-btn locked" disabled>
                            🔒
                          </button>
                        ) : !canAfford ? (
                          <button className="story-btn disabled" disabled>
                            🪙 {meta.price}
                          </button>
                        ) : (
                          <button className="story-btn buy" onClick={() => handleBuy(story)}>
                            🪙 {meta.price}
                          </button>
                        )}
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}

      {tab === 'library' && (
        <div className="cuentos-library">
          {ownedStories.length === 0 ? (
            <div className="library-empty">
              <div className="library-empty-icon">📭</div>
              <p>{t('libraryEmpty')}</p>
              <button className="primary-btn" onClick={() => setTab('shop')}>
                🏪 {t('cuentosShop')}
              </button>
            </div>
          ) : (
            <div className="story-grid">
              {ownedStories.map(story => {
                const title = story.title[lang] ?? story.title.es
                return (
                  <article key={story.id} className="story-card owned library">
                    <div className="story-thumb">{story.thumbnail}</div>
                    <div className="story-body">
                      <h4 className="story-title">{title}</h4>
                      <div className="story-meta">
                        {STORY_LENGTHS[story.length].emoji} {t('storiesLength_' + story.length)} · {story.sentences.length} {t('sentences')}
                      </div>
                    </div>
                    <button className="story-btn read" onClick={() => handleRead(story)}>
                      ▶ {t('storyRead')}
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
