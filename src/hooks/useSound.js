// Efectos de sonido generados con Web Audio API (sin archivos, ~0 KB extra).
// Sonidos: click, success (acierto), error (fallo), lessonComplete (lección OK).
// Cada función dispara también el haptic equivalente — son ortogonales:
// el usuario puede mutear sonido pero mantener vibración (y viceversa).

import { useEffect, useState } from 'react'
import { hapticLight, hapticSuccess, hapticError, hapticHeavy } from './useHaptics.js'

const KEY = 'tokipona.sound'

export function isSoundOn() {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch { return true }
}

export function setSoundOn(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch {}
}

// Hook reactivo para componentes que necesitan saber el estado y togglearlo
export function useSoundToggle() {
  const [on, setOn] = useState(isSoundOn)
  useEffect(() => { setSoundOn(on) }, [on])
  return [on, () => setOn(v => !v)]
}

let ctx = null
function getCtx() {
  if (ctx) return ctx
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (AC) ctx = new AC()
  } catch {}
  return ctx
}

// Tonito simple con envolvente ADSR muy corto (suena natural, no metálico)
function tone(freq, duration, { type = 'sine', gain = 0.18, when = 0 } = {}) {
  const c = getCtx()
  if (!c) return
  // En móvil, AudioContext arranca suspendido — resumir en cada llamada
  if (c.state === 'suspended') c.resume().catch(() => {})

  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq

  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration)

  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + duration + 0.02)
}

export function playClick() {
  hapticLight()
  if (!isSoundOn()) return
  tone(660, 0.06, { type: 'triangle', gain: 0.12 })
}

export function playSuccess() {
  hapticSuccess()
  if (!isSoundOn()) return
  // Acorde ascendente alegre: C5 → E5 → G5
  tone(523, 0.10, { gain: 0.18, when: 0 })
  tone(659, 0.10, { gain: 0.18, when: 0.07 })
  tone(784, 0.18, { gain: 0.18, when: 0.14 })
}

export function playError() {
  hapticError()
  if (!isSoundOn()) return
  // "buzz" descendente, no agresivo
  tone(220, 0.13, { type: 'square', gain: 0.10, when: 0 })
  tone(165, 0.18, { type: 'square', gain: 0.10, when: 0.10 })
}

export function playLessonComplete() {
  hapticHeavy()
  if (!isSoundOn()) return
  // Fanfarria corta: arpegio C-mayor de 4 notas
  tone(523, 0.10, { gain: 0.20, when: 0 })       // C5
  tone(659, 0.10, { gain: 0.20, when: 0.10 })    // E5
  tone(784, 0.10, { gain: 0.20, when: 0.20 })    // G5
  tone(1047, 0.32, { gain: 0.22, when: 0.30 })   // C6
}
