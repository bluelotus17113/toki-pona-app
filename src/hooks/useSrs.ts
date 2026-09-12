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

/** Estado de repaso de una palabra. */
export interface WordStats {
  shown: number
  correct: number
  wrong: number
  /** Nivel Leitner, de 0 a `MAX_LEVEL`. */
  level: number
  /** Epoch en ms a partir del cual la palabra toca repasarla. */
  dueAt: number
}

/** Mapa palabra → su estado de repaso. */
export type SrsStats = Record<string, WordStats>

/** Recuento de palabras por estado de dominio. */
export interface MasteryDistribution {
  learning: number
  mastered: number
  due: number
}

// Intervalos en ms por nivel: 30min → 1h → 4h → 1d → 3d → 7d → 14d → 30d
const INTERVALS_MS: readonly number[] = [
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

function loadFromStorage(): SrsStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SrsStats) : {}
  } catch { return {} }
}

function save(): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(_stats)) } catch {}
}

// Estado singleton
let _stats: SrsStats = loadFromStorage()
const _listeners = new Set<() => void>()
function notify(): void { _listeners.forEach(fn => fn()) }

// API pública: registrar respuesta
export function recordAnswer(word: string, correct: boolean): void {
  if (!word || typeof word !== 'string') return
  const now = Date.now()
  const prev: WordStats = _stats[word] ?? { shown: 0, correct: 0, wrong: 0, level: 0, dueAt: now }
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
export function recordAnswers(words: string[], correct: boolean): void {
  if (!Array.isArray(words)) return
  for (const w of words) recordAnswer(w, correct)
}

export function getStats(word: string): WordStats | null {
  return _stats[word] ?? null
}

export function getAllStats(): SrsStats {
  return _stats
}

// "Urgencia" de revisar la palabra. 0 = no due, mayor = más urgente
export function priorityScore(word: string): number {
  const s = _stats[word]
  if (!s) return 0
  const now = Date.now()
  const overdueMs = now - s.dueAt
  if (overdueMs <= 0) return 0
  const interval = INTERVALS_MS[s.level] ?? INTERVALS_MS[0]
  return 1 + Math.min(5, overdueMs / interval)
}

// Lista palabras due (entre candidatas opcionales o todas las trackeadas)
export function getDueWords(candidates: string[] | null = null): string[] {
  const now = Date.now()
  const pool = candidates ?? Object.keys(_stats)
  return pool
    .filter(w => _stats[w] && _stats[w].dueAt <= now)
    .sort((a, b) => priorityScore(b) - priorityScore(a))
}

// Distribución de palabras por mastery
export function getMasteryDistribution(): MasteryDistribution {
  const dist: MasteryDistribution = { learning: 0, mastered: 0, due: 0 }
  const now = Date.now()
  for (const w of Object.keys(_stats)) {
    const s = _stats[w]
    if (s.level >= MASTERED_LEVEL) dist.mastered++
    else dist.learning++
    if (s.dueAt <= now) dist.due++
  }
  return dist
}

export function resetSrs(): void {
  _stats = {}
  save()
  notify()
}

/** Lo que expone `useSrs` a los componentes. */
export interface UseSrsResult {
  stats: SrsStats
  recordAnswer: typeof recordAnswer
  recordAnswers: typeof recordAnswers
  getStats: typeof getStats
  getAllStats: typeof getAllStats
  getDueWords: typeof getDueWords
  getMasteryDistribution: typeof getMasteryDistribution
  priorityScore: typeof priorityScore
}

// Hook React reactivo
export function useSrs(): UseSrsResult {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force(n => n + 1)
    _listeners.add(fn)
    return () => { _listeners.delete(fn) }
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
