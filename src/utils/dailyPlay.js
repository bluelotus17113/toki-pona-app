// Persistencia de "ya jugué hoy" por minijuego.
// localStorage: { "tokipona.dailyPlays": { "kamasona": "2026-05-27", ... } }
// Se considera "jugado hoy" si el valor coincide con la fecha local actual.

const KEY = 'tokipona.dailyPlays'

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}')
  } catch { return {} }
}

function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
}

export function isPlayedToday(gameId) {
  return load()[gameId] === todayKey()
}

export function markPlayedToday(gameId) {
  const state = load()
  state[gameId] = todayKey()
  save(state)
}

// Snapshot de qué juegos están "jugados hoy" — útil para el hub.
export function playedTodayMap() {
  const today = todayKey()
  const state = load()
  const out = {}
  for (const [gameId, date] of Object.entries(state)) {
    out[gameId] = date === today
  }
  return out
}

// Tiempo hasta la medianoche local (próximo "día nuevo").
export function timeUntilTomorrow() {
  const now = new Date()
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  const ms = tomorrow - now
  const totalMin = Math.floor(ms / 60000)
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  return { hours, mins, totalMs: ms }
}
