// Notificaciones locales diarias para re-engagement.
// Plugin: @capacitor/local-notifications. Solo se ejecuta en nativo (Android).
// Estrategia: programamos 14 notifs por adelantado (una por día), cada una con
// LA palabra del día específica para esa fecha. El cálculo es determinístico
// (FNV-1a hash de YYYY-MM-DD) idéntico al de wordOfTheDay.js, así la notif
// y la pantalla siempre muestran la misma palabra.
// Se re-programa cada vez que el usuario abre la app — siempre quedan ~14
// días futuros listos.

import { Capacitor } from '@capacitor/core'
import { VOCAB } from '../data/vocabulary.js'

const isNative = Capacitor.isNativePlatform()
const KEY_NOTIFY_SETUP = 'tokipona.notify.setup'
const KEY_NOTIFY_HOUR = 'tokipona.notify.hour'
const DEFAULT_HOUR = 9
const BATCH_DAYS = 14                    // cuántos días por adelantado programamos
const NOTIFICATION_ID_BASE = 7100        // 7100..7113 reservados para batch

// FNV-1a 32-bit — replicado de wordOfTheDay.js para evitar circular import
function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const SORTED_WORDS = Object.keys(VOCAB).sort()
function wordForDate(d) {
  const key = dateKey(d)
  const idx = fnv1a(key) % SORTED_WORDS.length
  return { word: SORTED_WORDS[idx], entry: VOCAB[SORTED_WORDS[idx]] }
}

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

// Programa BATCH_DAYS notifs por adelantado, una por día, cada una con la
// palabra del día específica calculada para esa fecha.
export async function scheduleDaily({ lang = 'es' } = {}) {
  if (!isNative) return false
  const lib = await loadLib()
  if (!lib) return false
  const granted = await isPermissionGranted()
  if (!granted) return false

  const hour = getHourPref()
  const titleES = '🌅 palabra del día'
  const titleEN = '🌅 word of the day'

  try {
    // Cancelar batch anterior (IDs reservados 7100..7100+BATCH_DAYS)
    const idsToCancel = []
    for (let i = 0; i < BATCH_DAYS; i++) idsToCancel.push({ id: NOTIFICATION_ID_BASE + i })
    try { await lib.LocalNotifications.cancel({ notifications: idsToCancel }) } catch {}

    // Programar nuevas
    const now = new Date()
    const notifications = []
    for (let i = 0; i < BATCH_DAYS; i++) {
      const targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, hour, 0, 0)
      // Si la hora ya pasó hoy, saltar el día 0 (no programar notif que dispararía inmediatamente)
      if (i === 0 && targetDate.getTime() <= Date.now() + 60_000) continue

      const { word, entry } = wordForDate(targetDate)
      const meaning = lang === 'en' ? (entry?.en ?? entry?.es ?? '') : (entry?.es ?? '')
      const title = lang === 'en' ? titleEN : titleES
      const body = `${word} — ${meaning.split(',')[0]}`

      notifications.push({
        id: NOTIFICATION_ID_BASE + i,
        title,
        body,
        schedule: {
          at: targetDate,
          allowWhileIdle: true
        },
        smallIcon: 'ic_stat_icon_config_sample',
        autoCancel: true
      })
    }

    if (notifications.length > 0) {
      await lib.LocalNotifications.schedule({ notifications })
    }
    try { localStorage.setItem(KEY_NOTIFY_SETUP, '1') } catch {}
    return true
  } catch (e) {
    console.warn('schedule notifications failed:', e)
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
