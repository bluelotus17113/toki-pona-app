// Word of the Day — selección determinística por fecha local.
// Cambia cada día a medianoche. Hash simple del YYYY-MM-DD → índice estable.

import { VOCAB } from '../data/vocabulary.js'

function todayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// hash determinístico (FNV-1a 32-bit) → integer estable
function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

// Lista de palabras ordenadas (estable a través de sesiones)
const SORTED_WORDS = Object.keys(VOCAB).sort()

export function getWordOfTheDay() {
  const key = todayKey()
  const idx = fnv1a(key) % SORTED_WORDS.length
  const word = SORTED_WORDS[idx]
  return { word, entry: VOCAB[word], dateKey: key }
}
