// Copia de seguridad del progreso: exportar / restaurar todo el estado local.
//
// Por qué existe: la app guarda TODO en localStorage dentro del WebView. Android
// limpia caché de apps y una reinstalación borra las 50 lecciones, la racha, el
// mani y el historial SRS entero. Sin backend (decisión de diseño), un archivo
// que el usuario controla es la única red de seguridad posible.
//
// El archivo es JSON plano, legible, y solo contiene progreso — ningún dato
// personal, ningún identificador. Se puede compartir, versionar o inspeccionar.

import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

export const BACKUP_APP_ID = 'toki-pona-a'
export const BACKUP_FORMAT = 1

// Única fuente de verdad de qué se respalda. Si agregás una clave nueva a la
// app, va acá — si no, queda fuera del backup y el usuario la pierde en silencio.
export const BACKUP_KEYS = [
  'tokipona.progress.v1',      // xp, mani, vidas, racha, cuentos comprados, xp diario
  'tokipona.srs.v1',           // repetición espaciada: nivel y vencimiento por palabra
  'tokipona.achievements.v1',  // logros desbloqueados
  'tokipona.kon.sessions',     // sesiones de meditación (kon)
  'tokipona.nimisin.daily',    // estado diario del minijuego nimi sin
  'tokipona.dailyPlays',       // "ya jugué hoy" por minijuego
  'tokipona.onboarded',
  'tokipona.theme',
  'tokipona.sound',
  'tokipona.haptics',
  'tokipona.lang',
  'tokipona.notify.hour'
]

// Excluidas a propósito:
//   tokipona.lesson.draft.*  -> borrador a medio hacer, atado a un orden de
//                               ejercicios que se regenera al azar en cada
//                               lección. Restaurarlo apuntaría a ejercicios
//                               distintos de los que el usuario había visto.
//   tokipona.notify.setup    -> las notificaciones viven en el SO, no acá.
//                               Restaurar el flag en un teléfono que nunca dio
//                               permiso dejaría el toggle en "on" sin nada
//                               programado detrás.
const DRAFT_PREFIX = 'tokipona.lesson.draft.'

function readKey(key) {
  try { return localStorage.getItem(key) } catch { return null }
}

// Datos de cabecera para que el usuario sepa QUÉ está por restaurar antes de
// pisar lo que tiene. Todo defensivo: un backup corrupto no debe romper el diálogo.
function summarize(data) {
  const summary = { xp: 0, lessons: 0, mani: 0, streak: 0, achievements: 0 }
  try {
    const p = JSON.parse(data['tokipona.progress.v1'] ?? '{}')
    summary.xp = p.xp ?? 0
    summary.lessons = Array.isArray(p.completed) ? p.completed.length : 0
    summary.mani = p.mani ?? 0
    summary.streak = p.streak ?? 0
  } catch {}
  try {
    const a = JSON.parse(data['tokipona.achievements.v1'] ?? '[]')
    summary.achievements = Array.isArray(a) ? a.length : 0
  } catch {}
  return summary
}

export function buildBackup() {
  const data = {}
  for (const key of BACKUP_KEYS) {
    const value = readKey(key)
    // Guardamos el string crudo tal como lo tiene localStorage: evita una ronda
    // de parse/stringify que podría alterar el contenido.
    if (value !== null) data[key] = value
  }
  return {
    app: BACKUP_APP_ID,
    format: BACKUP_FORMAT,
    exportedAt: new Date().toISOString(),
    summary: summarize(data),
    data
  }
}

export function backupFilename(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  const stamp = `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}`
  return `toki-pona-backup-${stamp}.json`
}

// Escribe la copia. En Android va al almacenamiento del teléfono; en web dispara
// una descarga del navegador. Devuelve { filename, location } — location es texto
// para mostrarle al usuario dónde quedó.
export async function exportBackup() {
  const json = JSON.stringify(buildBackup(), null, 2)
  const filename = backupFilename()

  if (!isNative) {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    // Revocar en el siguiente tick: revocar de inmediato aborta la descarga en
    // algunos navegadores.
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return { filename, location: filename }
  }

  const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
  // Documents es la carpeta que el usuario encuentra con cualquier explorador de
  // archivos. Si el sistema no la deja escribir (varía con la versión de Android
  // y el scoped storage), caemos al directorio externo propio de la app, que
  // siempre está disponible.
  const targets = [
    { directory: Directory.Documents, label: 'Documents' },
    { directory: Directory.External,  label: 'Android/data' }
  ]
  let lastError = null
  for (const target of targets) {
    try {
      const res = await Filesystem.writeFile({
        path: filename,
        data: json,
        directory: target.directory,
        encoding: Encoding.UTF8,
        recursive: true
      })
      return { filename, location: res?.uri ?? `${target.label}/${filename}` }
    } catch (e) {
      lastError = e
    }
  }
  throw lastError ?? new Error('no se pudo escribir el archivo')
}

// Valida y normaliza el contenido de un archivo de backup.
// Lanza Error con una clave de i18n como mensaje para que la UI la traduzca.
export function parseBackup(text) {
  let raw
  try {
    raw = JSON.parse(text)
  } catch {
    throw new Error('backupErrNotJson')
  }
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('backupErrNotJson')
  if (raw.app !== BACKUP_APP_ID) throw new Error('backupErrWrongApp')
  if (typeof raw.format !== 'number' || raw.format > BACKUP_FORMAT) throw new Error('backupErrFormat')
  if (!raw.data || typeof raw.data !== 'object' || Array.isArray(raw.data)) throw new Error('backupErrNoData')

  // Copiamos SOLO claves conocidas y solo si el valor es string: así un archivo
  // manipulado no puede inyectar entradas arbitrarias en localStorage.
  const data = {}
  for (const key of BACKUP_KEYS) {
    const value = raw.data[key]
    if (typeof value === 'string') data[key] = value
  }
  if (Object.keys(data).length === 0) throw new Error('backupErrNoData')

  return {
    app: raw.app,
    format: raw.format,
    exportedAt: typeof raw.exportedAt === 'string' ? raw.exportedAt : null,
    // Recalculamos el resumen desde los datos reales en vez de confiar en el que
    // venga escrito en el archivo.
    summary: summarize(data),
    data
  }
}

// Sustituye el estado local por el del backup.
// Semántica de reemplazo, no de mezcla: una clave que el backup no traiga se
// borra. Si mezcláramos, quedaría un híbrido incoherente (por ejemplo los logros
// de hoy con el progreso de hace un mes).
export function applyBackup(backup) {
  for (const key of BACKUP_KEYS) {
    try {
      if (key in backup.data) localStorage.setItem(key, backup.data[key])
      else localStorage.removeItem(key)
    } catch {}
  }
  // Los borradores de lección quedan huérfanos respecto del progreso restaurado.
  try {
    const stale = Object.keys(localStorage).filter(k => k.startsWith(DRAFT_PREFIX))
    stale.forEach(k => localStorage.removeItem(k))
  } catch {}
}

// Lee un File del input y devuelve el backup ya validado.
export async function readBackupFile(file) {
  const text = await file.text()
  return parseBackup(text)
}
