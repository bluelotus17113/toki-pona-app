import { useState, useEffect } from 'react'
import { unlock } from './useAchievements.js'

const KEY = 'tokipona.progress.v1'
const MAX_HEARTS = 5
const REGEN_MS = 60 * 60 * 1000 // 1 hora

const defaultState = {
  completed: [],        // ids de lecciones completadas
  xp: 0,                // experiencia total
  streak: 0,            // racha de días
  hearts: MAX_HEARTS,   // vidas actuales
  nextRegenAt: null,    // timestamp ms en que llega la próxima vida (null si está al máximo)
  unlockedAll: false
}

// Aplica todas las regeneraciones que correspondan según el tiempo transcurrido
function applyRegen(state, now) {
  if (state.hearts >= MAX_HEARTS) {
    return state.nextRegenAt ? { ...state, nextRegenAt: null } : state
  }
  if (!state.nextRegenAt) return state
  let hearts = state.hearts
  let nextRegenAt = state.nextRegenAt
  while (hearts < MAX_HEARTS && now >= nextRegenAt) {
    hearts += 1
    nextRegenAt = hearts >= MAX_HEARTS ? null : nextRegenAt + REGEN_MS
  }
  if (hearts === state.hearts && nextRegenAt === state.nextRegenAt) return state
  return { ...state, hearts, nextRegenAt }
}

export function useProgress() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      const initial = raw ? { ...defaultState, ...JSON.parse(raw) } : defaultState
      return applyRegen(initial, Date.now())
    } catch {
      return defaultState
    }
  })

  // Persistir
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])

  // Tick periódico para regenerar vidas y refrescar el countdown
  useEffect(() => {
    const tick = () => setState(s => applyRegen(s, Date.now()))
    const id = setInterval(tick, 1000) // cada segundo (para countdown vivo)
    return () => clearInterval(id)
  }, [])

  const completeLesson = (id, gainedXp = 20) => {
    setState(s => ({
      ...s,
      completed: s.completed.includes(id) ? s.completed : [...s.completed, id],
      xp: s.xp + gainedXp
      // hearts y nextRegenAt se conservan: las vidas perdidas siguen perdidas
      // y solo se recuperan por timer de 1h o viendo un anuncio
    }))
  }

  const addXp = (gainedXp) => {
    setState(s => ({ ...s, xp: s.xp + gainedXp }))
  }

  const loseHeart = () => {
    setState(s => {
      const now = Date.now()
      const newHearts = Math.max(0, s.hearts - 1)
      if (newHearts === 0) unlock('no-hearts-once')
      // si ya había un timer corriendo lo respetamos; si estaba lleno, arrancamos uno
      const nextRegenAt = s.nextRegenAt ?? (now + REGEN_MS)
      return { ...s, hearts: newHearts, nextRegenAt }
    })
  }

  const resetHearts = () => setState(s => ({ ...s, hearts: MAX_HEARTS, nextRegenAt: null }))

  const addHeart = () => {
    setState(s => {
      if (s.hearts >= MAX_HEARTS) return s
      const newHearts = s.hearts + 1
      const nextRegenAt = newHearts >= MAX_HEARTS ? null : s.nextRegenAt
      return { ...s, hearts: newHearts, nextRegenAt }
    })
  }

  const reset = () => {
    setState(defaultState)
    localStorage.removeItem(KEY)
  }

  const isUnlocked = (id) => {
    if (state.unlockedAll) return true
    if (id === 1) return true
    return state.completed.includes(id - 1)
  }

  return {
    state,
    MAX_HEARTS,
    completeLesson,
    addXp,
    loseHeart,
    addHeart,
    resetHearts,
    reset,
    isUnlocked
  }
}

// Formatea milisegundos como mm:ss (o hh:mm:ss si > 1h)
export function formatRemaining(ms) {
  if (ms <= 0) return '00:00'
  const total = Math.ceil(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n) => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}
