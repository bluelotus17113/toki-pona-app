// Persistencia del progreso de una lección activa.
// Permite cerrar la app a mitad de lección y reanudar donde quedaste.
// Se invalida automáticamente si cambia el idioma o el set de ejercicios.

const KEY = (lessonId) => `tokipona.lesson.draft.${lessonId}`

export function loadDraft(lessonId, expectedTotal, expectedLang) {
  try {
    const raw = localStorage.getItem(KEY(lessonId))
    if (!raw) return null
    const d = JSON.parse(raw)
    // Validar que el set de ejercicios y el idioma sean los mismos
    if (d.total !== expectedTotal) return null
    if (d.lang !== expectedLang) return null
    // No reanudar si ya estaba terminada (idx >= total)
    if (d.idx >= expectedTotal) return null
    // No reanudar si no hubo progreso real (idx == 0 y sin intro pasada)
    if (d.idx === 0 && d.showIntro) return null
    return d
  } catch { return null }
}

export function saveDraft(lessonId, draft) {
  try { localStorage.setItem(KEY(lessonId), JSON.stringify(draft)) } catch {}
}

export function clearDraft(lessonId) {
  try { localStorage.removeItem(KEY(lessonId)) } catch {}
}
