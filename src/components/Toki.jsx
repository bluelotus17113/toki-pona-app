import { useEffect, useRef, useState } from 'react'
import { CONVERSATIONS } from '../data/conversations.js'
import { makeT } from '../data/i18n.js'
import { primeAudio, speak } from '../hooks/useSpeech.js'
import { playClick, playSuccess, playLessonComplete } from '../hooks/useSound.js'
import { unlock } from '../hooks/useAchievements.js'
import { isPlayedToday, markPlayedToday } from '../utils/dailyPlay.js'

// "toki" — Modo conversación: diálogos choose-your-own-adventure.
// El usuario elige entre 3 opciones por turno. Cada conversación es daily-locked
// con clave individual para evitar farmear XP.

const THEM_AUTOADVANCE_MS = 1800

export default function Toki({ progress, lang = 'es', onExit }) {
  const t = makeT(lang)
  const [conv, setConv] = useState(null)
  const [nodeId, setNodeId] = useState(null)
  const [history, setHistory] = useState([])
  const [goodChoices, setGoodChoices] = useState(0)
  const [totalChoices, setTotalChoices] = useState(0)
  const [done, setDone] = useState(false)
  const finishedRef = useRef(false)

  // primeAudio al montar
  useEffect(() => { primeAudio() }, [])

  // Reacciona cuando cambia nodeId: si es nodo "them" lo agrega al historial,
  // reproduce TTS, y programa avance automático al siguiente (o finaliza).
  useEffect(() => {
    if (!conv || !nodeId || done) return
    const node = conv.nodes[nodeId]
    if (!node) return

    if (node.speaker === 'them') {
      // Agregar a historia (evita duplicar si ya está)
      setHistory(h => {
        if (h[h.length - 1]?.tp === node.tp) return h
        return [...h, { speaker: 'them', tp: node.tp, tr: node[lang] ?? node.es }]
      })

      // Reproducir TTS
      const speakId = setTimeout(() => speak(node.tp), 320)

      // Avance automático al siguiente nodo o finalizar
      const advanceId = setTimeout(() => {
        if (node.isEnd) {
          finish()
        } else if (node.next) {
          setNodeId(node.next)
        }
      }, THEM_AUTOADVANCE_MS)

      return () => { clearTimeout(speakId); clearTimeout(advanceId) }
    }
  }, [nodeId, conv, done, lang])

  const start = (c) => {
    if (isPlayedToday(`toki-${c.id}`)) return
    playClick()
    finishedRef.current = false
    setConv(c)
    setNodeId(c.startNode)
    setHistory([])
    setGoodChoices(0)
    setTotalChoices(0)
    setDone(false)
  }

  const finish = () => {
    if (finishedRef.current || !conv) return
    finishedRef.current = true
    const baseXp = conv.rewardXp ?? 20
    const goodBonus = goodChoices * 3
    const totalXp = baseXp + goodBonus
    progress.addXp(totalXp)
    progress.addMani(5)
    unlock('toki-first-convo')
    if (goodChoices === totalChoices && totalChoices > 0) unlock('toki-perfect-convo')
    markPlayedToday(`toki-${conv.id}`)
    playLessonComplete()
    setDone(true)
  }

  const choose = (opt) => {
    playClick()
    playSuccess()
    setTotalChoices(n => n + 1)
    if (opt.isGood) setGoodChoices(n => n + 1)
    setHistory(h => [...h, { speaker: 'you', tp: opt.tp, tr: opt[lang] ?? opt.es }])
    setNodeId(opt.next)
  }

  const replaySpeak = (tp) => {
    primeAudio()
    speak(tp)
  }

  // ============ Lista de conversaciones ============
  if (!conv) {
    return (
      <div className="toki-screen">
        <header className="toki-header">
          <button className="exit-btn" onClick={onExit}>←</button>
          <div className="toki-title-block">
            <h2>💬 {t('tokiTitle')}</h2>
            <p>{t('tokiSub')}</p>
          </div>
        </header>

        <div className="toki-banner">{t('tokiIntro')}</div>

        <div className="toki-list">
          {CONVERSATIONS.map(c => {
            const played = isPlayedToday(`toki-${c.id}`)
            return (
              <button
                key={c.id}
                className={`toki-card ${played ? 'is-played' : ''}`}
                onClick={() => start(c)}
                disabled={played}
              >
                <span className="toki-card-icon">{c.icon}</span>
                <div className="toki-card-text">
                  <span className="toki-card-title">
                    {c.title[lang] ?? c.title.es}
                    {played && <span className="toki-card-played">✓ {t('minijuegosPlayedBadge')}</span>}
                  </span>
                  <span className="toki-card-context">{c.context[lang] ?? c.context.es}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // ============ Pantalla fin ============
  if (done) {
    const baseXp = conv.rewardXp ?? 20
    const goodBonus = goodChoices * 3
    return (
      <div className="toki-screen done">
        <header className="toki-header">
          <button className="exit-btn" onClick={() => setConv(null)}>←</button>
          <div className="toki-title-block">
            <h2>🏆 {t('tokiResultTitle')}</h2>
          </div>
        </header>
        <div className="toki-result">
          <div className="toki-result-icon">{conv.icon}</div>
          <h3 className="toki-result-name">{conv.title[lang] ?? conv.title.es}</h3>
          <div className="toki-result-stats">
            <div>⭐ +{baseXp + goodBonus} XP {goodChoices > 0 && <small>(base {baseXp} + bonus {goodBonus})</small>}</div>
            <div>🪙 +5 mani</div>
            <div>🎯 {goodChoices}/{totalChoices} {t('tokiGoodChoices')}</div>
          </div>
          <p className="toki-tomorrow">{t('dailyLockedTomorrow')}</p>
          <button className="toki-result-btn primary" onClick={() => setConv(null)}>
            {t('tokiAnother')}
          </button>
        </div>
      </div>
    )
  }

  // ============ Conversación en curso ============
  const node = conv.nodes[nodeId]

  return (
    <div className="toki-screen game">
      <header className="toki-header">
        <button className="exit-btn" onClick={() => {
          if (confirm(t('exitMinigameConfirm'))) setConv(null)
        }}>✕</button>
        <div className="toki-title-block">
          <h2>{conv.icon} {conv.title[lang] ?? conv.title.es}</h2>
        </div>
      </header>

      <div className="toki-context">{conv.context[lang] ?? conv.context.es}</div>

      <div className="toki-dialog">
        {history.map((msg, i) => (
          <div key={i} className={`toki-msg ${msg.speaker}`}>
            <button
              className="toki-msg-speak"
              onClick={() => replaySpeak(msg.tp)}
              title={t('listen')}
              aria-label={t('listen')}
            >
              🔊
            </button>
            <div className="toki-msg-bubble">
              <div className="toki-msg-tp">{msg.tp}</div>
              <div className="toki-msg-tr">{msg.tr}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Opciones del usuario */}
      {node?.speaker === 'you' && (
        <div className="toki-options">
          <div className="toki-options-prompt">
            <span className="toki-options-icon">💬</span>
            {node.prompt?.[lang] ?? node.prompt?.es ?? t('tokiPickReply')}
          </div>
          {node.options.map((opt, i) => (
            <button
              key={i}
              className="toki-option"
              onClick={() => choose(opt)}
            >
              <span className="toki-option-tp">{opt.tp}</span>
              <span className="toki-option-tr">{opt[lang] ?? opt.es}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
