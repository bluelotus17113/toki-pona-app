import { makeT } from '../data/i18n.js'
import { playClick } from '../hooks/useSound.js'
import { playedTodayMap } from '../utils/dailyPlay.js'

// Hub de minijuegos: tarjetas grandes que abren cada minijuego.
// Cada tarjeta lleva: icono, glifo decorativo, título, descripción corta,
// mecánica resumida y la recompensa máxima en mani.

export default function Minijuegos({
  lang = 'es',
  onNimiTu, onKamaSona, onLipuPakala,
  onKalamaKute, onKulupuNimi, onNimiSin, onKalaAlasa,
  onAlasaNimi, onSitelenSin,
  onExit
}) {
  const t = makeT(lang)
  const playedToday = playedTodayMap()

  const GAMES = [
    {
      id: 'nimisin',
      icon: '🔤',
      glyph: 'sin',
      title: 'nimi sin',
      sub: t('nimiSinHubSub'),
      mechanic: t('nimiSinHubMechanic'),
      reward: '🪙 +20',
      accent: '#fff3b0',
      onOpen: onNimiSin
    },
    {
      id: 'kalamakute',
      icon: '🎧',
      glyph: 'kute',
      title: 'kalama kute',
      sub: t('kalamaKuteHubSub'),
      mechanic: t('kalamaKuteHubMechanic'),
      reward: '🪙 +25',
      accent: '#d4e7f5',
      onOpen: onKalamaKute
    },
    {
      id: 'nimitu',
      icon: '🧩',
      glyph: 'nimi',
      title: 'nimi tu',
      sub: t('nimiTuHubSub'),
      mechanic: t('nimiTuHubMechanic'),
      reward: '🪙 +10',
      accent: '#c6efd0',
      onOpen: onNimiTu
    },
    {
      id: 'kamasona',
      icon: '🃏',
      glyph: 'sona',
      title: 'kama sona',
      sub: t('kamaSonaHubSub'),
      mechanic: t('kamaSonaHubMechanic'),
      reward: '🪙 +15',
      accent: '#ffd6e0',
      onOpen: onKamaSona
    },
    {
      id: 'lipupakala',
      icon: '📝',
      glyph: 'lipu',
      title: 'lipu pakala',
      sub: t('lipuPakalaHubSub'),
      mechanic: t('lipuPakalaHubMechanic'),
      reward: '🪙 +15',
      accent: '#c7d4ff',
      onOpen: onLipuPakala
    },
    {
      id: 'kulupunimi',
      icon: '📂',
      glyph: 'kulupu',
      title: 'kulupu nimi',
      sub: t('kulupuNimiHubSub'),
      mechanic: t('kulupuNimiHubMechanic'),
      reward: '🪙 +14',
      accent: '#ffe5d6',
      onOpen: onKulupuNimi
    },
    {
      id: 'kalaalasa',
      icon: '🎣',
      glyph: 'kala',
      title: 'kala alasa',
      sub: t('kalaAlasaHubSub'),
      mechanic: t('kalaAlasaHubMechanic'),
      reward: '🪙 score/5',
      accent: '#c7e8d4',
      onOpen: onKalaAlasa
    },
    {
      id: 'alasanimi',
      icon: '🔍',
      glyph: 'alasa',
      title: 'alasa nimi',
      sub: t('alasaNimiHubSub'),
      mechanic: t('alasaNimiHubMechanic'),
      reward: '🪙 +15',
      accent: '#e6dafc',
      onOpen: onAlasaNimi
    },
    {
      id: 'sitelensin',
      icon: '✍️',
      glyph: 'sitelen',
      title: 'sitelen sin',
      sub: t('sitelenSinHubSub'),
      mechanic: t('sitelenSinHubMechanic'),
      reward: '🪙 +16',
      accent: '#fff0c2',
      onOpen: onSitelenSin
    }
  ]

  const handleOpen = (game) => {
    playClick()
    game.onOpen?.()
  }

  return (
    <div className="minijuegos-screen">
      <header className="minijuegos-header">
        <button className="exit-btn" onClick={onExit}>←</button>
        <div className="minijuegos-title-block">
          <h2>🎮 {t('minijuegosTitle')}</h2>
          <p>{t('minijuegosSub')}</p>
        </div>
      </header>

      <div className="minijuegos-banner">
        {t('minijuegosBanner')}
      </div>

      <div className="minijuegos-grid">
        {GAMES.map(game => {
          const isPlayed = !!playedToday[game.id]
          return (
            <button
              key={game.id}
              className={`minijuego-card ${isPlayed ? 'is-played' : ''}`}
              style={{ '--card-accent': game.accent }}
              onClick={() => handleOpen(game)}
            >
              {isPlayed && (
                <span className="minijuego-card-played-badge" title={t('dailyLockedTomorrow')}>
                  ✓ {t('minijuegosPlayedBadge')}
                </span>
              )}
              <div className="minijuego-card-top">
                <span className="minijuego-card-icon">{game.icon}</span>
                <span className="minijuego-card-glyph sitelen" aria-hidden="true">{game.glyph}</span>
              </div>
              <div className="minijuego-card-text">
                <span className="minijuego-card-title">{game.title}</span>
                <span className="minijuego-card-sub">{game.sub}</span>
                <span className="minijuego-card-mechanic">{game.mechanic}</span>
              </div>
              <div className="minijuego-card-footer">
                <span className="minijuego-card-reward">{game.reward}</span>
                <span className="minijuego-card-arrow" aria-hidden="true">→</span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="minijuegos-footnote">
        {t('minijuegosFootnote')}
      </div>
    </div>
  )
}
