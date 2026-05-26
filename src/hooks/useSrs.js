// Repetición espaciada (SRS) estilo Leitner.
// Trackea por palabra: shown/correct/wrong/level/dueAt.
// Persistencia en localStorage. Singleton + suscripciones para reactividad.
//
// Algoritmo:
//   - Acertaste: level += 1 (máx 7), dueAt = now + interval(newLevel)
//   - Fallaste:  level -= 2 (mín 0), dueAt = now + 30 min
//   - Palabras "due" (dueAt <= now) son las que necesitan revisión.

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'tokipona.srs.v1'

// Intervalos en ms por nivel: 30min → 1h → 4h → 1d → 3d → 7d → 14d → 30d
const INTERVALS_MS = [
  30  * 60 * 1000,
  60  * 60 * 1000,
  4   * 60 * 60 * 1000,
  24  * 60 * 60 * 1000,
  3   * 24 * 60 * 60 * 1000,
  7   * 24 * 60 * 60 * 1000,
  14  * 24 * 60 * 60 * 1000,
  30  * 24 * 60 * 60 * 1000
]
const MAX_LEVEL = INTERVALS_MS.length - 1
export const MASTERED_LEVEL = 6  // de aquí en adelante: "dominada"

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_stats)) } catch {}
}

// Estado singleton
let _stats = loadFromStorage()
const _listeners = new Set()
function notify() { _listeners.forEach(fn => fn()) }

// API pública: registrar respuesta
export function recordAnswer(word, correct) {
  if (!word || typeof word !== 'string') return
  const now = Date.now()
  const prev = _stats[word] ?? { shown: 0, correct: 0, wrong: 0, level: 0, dueAt: now }
  const newLevel = correct
    ? Math.min(prev.level + 1, MAX_LEVEL)
    : Math.max(0, prev.level - 2)
  const dueAt = correct
    ? now + INTERVALS_MS[newLevel]
    : now + INTERVALS_MS[0]  // 30 min para revisar pronto
  _stats[word] = {
    shown:   prev.shown + 1,
    correct: prev.correct + (correct ? 1 : 0),
    wrong:   prev.wrong   + (correct ? 0 : 1),
    level:   newLevel,
    dueAt
  }
  save()
  notify()
}

// Registrar múltiples palabras (para ejercicios match/build/sitelen-pair)
export function recordAnswers(words, correct) {
  if (!Array.isArray(words)) return
  for (const w of words) recordAnswer(w, correct)
}

export function getStats(word) {
  return _stats[word] ?? null
}

export function getAllStats() {
  return _stats
}

// "Urgencia" de revisar la palabra. 0 = no due, mayor = más urgente
export function priorityScore(word) {
  const s = _stats[word]
  if (!s) return 0
  const now = Date.now()
  const overdueMs = now - s.dueAt
  if (overdueMs <= 0) return 0
  const interval = INTERVALS_MS[s.level] ?? INTERVALS_MS[0]
  return 1 + Math.min(5, overdueMs / interval)
}

// Lista palabras due (entre candidatas opcionales o todas las trackeadas)
export function getDueWords(candidates = null) {
  const now = Date.now()
  const pool = candidates ?? Object.keys(_stats)
  return pool
    .filter(w => _stats[w] && _stats[w].dueAt <= now)
    .sort((a, b) => priorityScore(b) - priorityScore(a))
}

// Distribución de palabras por mastery
export function getMasteryDistribution() {
  const dist = { learning: 0, mastered: 0, due: 0 }
  const now = Date.now()
  for (const w of Object.keys(_stats)) {
    const s = _stats[w]
    if (s.level >= MASTERED_LEVEL) dist.mastered++
    else dist.learning++
    if (s.dueAt <= now) dist.due++
  }
  return dist
}

export function resetSrs() {
  _stats = {}
  save()
  notify()
}

// Hook React reactivo
export function useSrs() {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force(n => n + 1)
    _listeners.add(fn)
    return () => _listeners.delete(fn)
  }, [])
  return {
    stats: _stats,
    recordAnswer,
    recordAnswers,
    getStats,
    getAllStats,
    getDueWords,
    getMasteryDistribution,
    priorityScore
  }
}
