import { useState, useEffect } from 'react'
import { unlock } from './useAchievements.js'

const KEY = 'tokipona.progress.v1'
const MAX_HEARTS = 5
const REGEN_MS = 60 * 60 * 1000 // 1 hora

const defaultState = {
  completed: [],        // ids de lecciones completadas
  xp: 0,                // experiencia total
  mani: 0,              // moneda interna (toki pona: mani = dinero)
  purchasedStories: [], // ids de cuentos comprados
  streak: 0,            // racha de días consecutivos
  hearts: MAX_HEARTS,   // vidas actuales
  nextRegenAt: null,    // timestamp ms en que llega la próxima vida (null si está al máximo)
  unlockedAll: false,
  dailyXp: {},          // { "YYYY-MM-DD": xpGanadoEseDía } — para dashboard
  lastActiveDate: null  // último día con actividad (clave YYYY-MM-DD)
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Incrementa XP del día actual y actualiza racha si es la primera actividad del día.
// Si el último día activo fue ayer → streak++; si fue antes → streak = 1.
function bumpDaily(state, gainedXp) {
  const today = todayKey()
  const prevDayXp = state.dailyXp?.[today] ?? 0
  const nextDailyXp = { ...(state.dailyXp ?? {}), [today]: prevDayXp + gainedXp }
  let nextStreak = state.streak ?? 0
  let nextLastActive = state.lastActiveDate
  if (state.lastActiveDate !== today) {
    nextStreak = state.lastActiveDate === yesterdayKey() ? nextStreak + 1 : 1
    nextLastActive = today
  }
  return { ...state, dailyXp: nextDailyXp, streak: nextStreak, lastActiveDate: nextLastActive }
}

// La racha guardada solo se recalcula dentro de bumpDaily, o sea al ganar XP.
// Si el usuario deja de jugar, el número se queda congelado y miente hasta que
// vuelve a completar una lección. Para mostrarla hay que derivarla: la racha
// sigue viva solo si la última actividad fue hoy o ayer.
// No tocamos state.streak — bumpDaily ya la reinicia bien cuando el usuario vuelve.
export function effectiveStreak(state) {
  const stored = state.streak ?? 0
  if (stored === 0) return 0
  const last = state.lastActiveDate
  return (last === todayKey() || last === yesterdayKey()) ? stored : 0
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
    setState(s => {
      const next = {
        ...s,
        completed: s.completed.includes(id) ? s.completed : [...s.completed, id],
        xp: s.xp + gainedXp
      }
      return bumpDaily(next, gainedXp)
    })
  }

  const addXp = (gainedXp) => {
    setState(s => bumpDaily({ ...s, xp: s.xp + gainedXp }, gainedXp))
  }

  const addMani = (gainedMani) => {
    setState(s => ({ ...s, mani: s.mani + gainedMani }))
  }

  // Intenta gastar `cost` mani. Devuelve true si pudo, false si no había suficiente.
  const spendMani = (cost) => {
    let success = false
    setState(s => {
      if (s.mani < cost) return s
      success = true
      return { ...s, mani: s.mani - cost }
    })
    return success
  }

  // Compra un cuento: descuenta mani y agrega el id a purchasedStories.
  // Devuelve true si la compra fue exitosa.
  const purchaseStory = (storyId, price) => {
    let success = false
    setState(s => {
      if (s.purchasedStories.includes(storyId)) { success = true; return s }
      if (s.mani < price) return s
      success = true
      return {
        ...s,
        mani: s.mani - price,
        purchasedStories: [...s.purchasedStories, storyId]
      }
    })
    return success
  }

  const ownsStory = (storyId) => state.purchasedStories.includes(storyId)

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
    // Racha real para mostrar: 0 si se rompió por inactividad (ver effectiveStreak).
    // El tick de 1s hace que cruce la medianoche sola, sin recargar la app.
    effectiveStreak: effectiveStreak(state),
    completeLesson,
    addXp,
    addMani,
    spendMani,
    purchaseStory,
    ownsStory,
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
