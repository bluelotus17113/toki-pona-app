// Notificaciones locales diarias para re-engagement.
// Plugin: @capacitor/local-notifications. Solo se ejecuta en nativo (Android).
// Pide permiso una vez, programa una notif diaria a las 9am (configurable).

import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()
const KEY_NOTIFY_SETUP = 'tokipona.notify.setup'
const KEY_NOTIFY_HOUR = 'tokipona.notify.hour'
const DEFAULT_HOUR = 9
const NOTIFICATION_ID = 7001  // ID fijo: si re-programamos sobreescribimos

let LocalNotificationsLib = null

async function loadLib() {
  if (!isNative) return null
  if (LocalNotificationsLib) return LocalNotificationsLib
  LocalNotificationsLib = await import('@capacitor/local-notifications')
  return LocalNotificationsLib
}

export async function isPermissionGranted() {
  if (!isNative) return false
  try {
    const lib = await loadLib()
    if (!lib) return false
    const { display } = await lib.LocalNotifications.checkPermissions()
    return display === 'granted'
  } catch { return false }
}

export async function requestPermission() {
  if (!isNative) return false
  try {
    const lib = await loadLib()
    if (!lib) return false
    const { display } = await lib.LocalNotifications.requestPermissions()
    return display === 'granted'
  } catch (e) {
    console.warn('notif permission error:', e)
    return false
  }
}

export function getHourPref() {
  try {
    const v = parseInt(localStorage.getItem(KEY_NOTIFY_HOUR), 10)
    if (!isNaN(v) && v >= 0 && v <= 23) return v
  } catch {}
  return DEFAULT_HOUR
}

export function setHourPref(h) {
  try { localStorage.setItem(KEY_NOTIFY_HOUR, String(h)) } catch {}
}

// Programa una notificación recurrente diaria a la hora preferida del usuario.
// El plugin soporta `schedule.on` con campos {hour, minute} para repeat diario.
export async function scheduleDaily({ lang = 'es' } = {}) {
  if (!isNative) return false
  const lib = await loadLib()
  if (!lib) return false
  const granted = await isPermissionGranted()
  if (!granted) return false

  const hour = getHourPref()

  // Mensajes según idioma
  const title = lang === 'en' ? 'toki pona a!' : 'toki pona a!'
  const body = lang === 'en'
    ? 'word of the day is ready · keep your streak going 🔥'
    : 'la palabra del día está lista · mantené tu racha 🔥'

  try {
    // Cancelar la programada anterior para evitar duplicados
    try { await lib.LocalNotifications.cancel({ notifications: [{ id: NOTIFICATION_ID }] }) } catch {}

    await lib.LocalNotifications.schedule({
      notifications: [{
        id: NOTIFICATION_ID,
        title,
        body,
        schedule: {
          on: { hour, minute: 0 },   // repite a esa hora cada día
          allowWhileIdle: true
        },
        smallIcon: 'ic_stat_icon_config_sample',  // fallback default
        autoCancel: true
      }]
    })
    try { localStorage.setItem(KEY_NOTIFY_SETUP, '1') } catch {}
    return true
  } catch (e) {
    console.warn('schedule notification failed:', e)
    return false
  }
}

export async function cancelAll() {
  if (!isNative) return
  try {
    const lib = await loadLib()
    if (!lib) return
    const pending = await lib.LocalNotifications.getPending()
    if (pending?.notifications?.length) {
      await lib.LocalNotifications.cancel({ notifications: pending.notifications })
    }
    try { localStorage.removeItem(KEY_NOTIFY_SETUP) } catch {}
  } catch (e) {
    console.warn('cancel notif failed:', e)
  }
}

export function isSetupDone() {
  try { return localStorage.getItem(KEY_NOTIFY_SETUP) === '1' } catch { return false }
}

// Flujo conveniente: pedí permiso si hace falta, y si el usuario acepta,
// programá la notif diaria. Devuelve true si quedó activa.
export async function ensureDailyNotifications({ lang = 'es' } = {}) {
  if (!isNative) return false
  let granted = await isPermissionGranted()
  if (!granted) granted = await requestPermission()
  if (!granted) return false
  return scheduleDaily({ lang })
}
