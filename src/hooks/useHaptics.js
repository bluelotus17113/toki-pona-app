// Haptics centralizado. Solo dispara en nativo (Android); en web es no-op.
// Carga el plugin de forma lazy para no inflar el bundle inicial.

import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()
const KEY_HAPTICS = 'tokipona.haptics'

let mod = null
async function loadMod() {
  if (!isNative) return null
  if (mod) return mod
  mod = await import('@capacitor/haptics')
  return mod
}

export function isHapticsOn() {
  try { return localStorage.getItem(KEY_HAPTICS) !== 'off' } catch { return true }
}
export function setHapticsOn(on) {
  try { localStorage.setItem(KEY_HAPTICS, on ? 'on' : 'off') } catch {}
}

// Tap suave — botones del menú, navegación
export async function hapticLight() {
  if (!isNative || !isHapticsOn()) return
  try {
    const m = await loadMod()
    if (!m) return
    await m.Haptics.impact({ style: m.ImpactStyle.Light })
  } catch {}
}

// Tap fuerte — confirmar acción importante (lección completa, logro)
export async function hapticHeavy() {
  if (!isNative || !isHapticsOn()) return
  try {
    const m = await loadMod()
    if (!m) return
    await m.Haptics.impact({ style: m.ImpactStyle.Heavy })
  } catch {}
}

// Respuesta correcta — patrón "success" del SO
export async function hapticSuccess() {
  if (!isNative || !isHapticsOn()) return
  try {
    const m = await loadMod()
    if (!m) return
    await m.Haptics.notification({ type: m.NotificationType.Success })
  } catch {}
}

// Respuesta incorrecta — patrón "warning" (más suave que error para no castigar)
export async function hapticError() {
  if (!isNative || !isHapticsOn()) return
  try {
    const m = await loadMod()
    if (!m) return
    await m.Haptics.notification({ type: m.NotificationType.Warning })
  } catch {}
}
