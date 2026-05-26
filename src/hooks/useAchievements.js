// Sistema de logros: singleton en memoria + persistencia en localStorage
// + suscripciones para que el toast aparezca globalmente.
//
// Uso:
//   - Llamar `unlock(id)` desde cualquier componente cuando ocurre un evento
//   - Usar `useAchievements()` en App.jsx para mostrar el toast y la lista

import { useEffect, useState } from 'react'
import { ACHIEVEMENTS } from '../data/achievements.js'

const STORAGE_KEY = 'tokipona.achievements.v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return new Set(raw ? JSON.parse(raw) : [])
  } catch {
    return new Set()
  }
}

function saveToStorage(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]))
  } catch {}
}

// Estado singleton (compartido entre todos los hooks)
let _unlocked = loadFromStorage()
let _queue = []          // cola de logros recién desbloqueados (toast pendiente)
let _showing = false     // hay un toast en pantalla ahora mismo
const _listeners = new Set()

function notify() {
  _listeners.forEach(fn => fn())
}

// API pública: desbloquear por id (idempotente)
export function unlock(id) {
  if (_unlocked.has(id)) return null
  const ach = ACHIEVEMENTS.find(a => a.id === id)
  if (!ach) {
    console.warn('unknown achievement:', id)
    return null
  }
  _unlocked.add(id)
  saveToStorage(_unlocked)
  _queue.push(ach)
  notify()
  return ach
}

// Chequea todas las achievements `auto` contra el estado de progress
// y desbloquea las que correspondan
export function checkAutoAchievements(progressState) {
  if (!progressState) return
  for (const a of ACHIEVEMENTS) {
    if (a.auto && !_unlocked.has(a.id) && a.auto(progressState)) {
      unlock(a.id)
    }
  }
}

// Marcar como "mostrado" el primer item de la cola (lo consume).
// El hook llama a esto cuando el toast termina su animación.
export function dismissCurrent() {
  if (_queue.length > 0) {
    _queue.shift()
    _showing = false
    notify()
  }
}

export function setShowing(v) {
  _showing = v
  notify()
}

// Hook React que expone el estado actual reactivamente
export function useAchievements() {
  const [, force] = useState(0)
  useEffect(() => {
    const fn = () => force(n => n + 1)
    _listeners.add(fn)
    return () => _listeners.delete(fn)
  }, [])
  return {
    unlocked: _unlocked,
    queue: _queue,
    current: _queue[0] ?? null,
    showing: _showing,
    unlock,
    dismissCurrent,
    setShowing
  }
}

// Helpers
export function isUnlocked(id) {
  return _unlocked.has(id)
}

export function getUnlockedCount() {
  return _unlocked.size
}

export function resetAchievements() {
  _unlocked = new Set()
  _queue = []
  _showing = false
  saveToStorage(_unlocked)
  notify()
}
