// Compuestos toki pona — el corazón compositivo del idioma.
// Cada concepto se forma combinando 2 palabras del VOCAB. Orden: HEAD + MODIFIER.
// Todas las palabras usadas existen en src/data/vocabulary.js.

export const COMPOUNDS = [
  // ============ PERSONAS ============
  { id: 'friend',     emoji: '🫂', level: 'easy',
    concept: { es: 'amigo / amiga',   en: 'friend' },
    hint:    { es: 'persona buena',   en: 'good person' },
    answers: [['jan','pona']] },

  { id: 'child',      emoji: '🧒', level: 'easy',
    concept: { es: 'niño / niña',     en: 'child' },
    hint:    { es: 'persona pequeña', en: 'small person' },
    answers: [['jan','lili']] },

  { id: 'teacher',    emoji: '👩‍🏫', level: 'easy',
    concept: { es: 'maestro / maestra', en: 'teacher' },
    hint:    { es: 'persona del saber', en: 'knowledge person' },
    answers: [['jan','sona']] },

  { id: 'leader',     emoji: '👑', level: 'easy',
    concept: { es: 'líder / jefe',    en: 'leader / boss' },
    hint:    { es: 'persona-cabeza',  en: 'head person' },
    answers: [['jan','lawa']] },

  { id: 'worker',     emoji: '👷', level: 'easy',
    concept: { es: 'trabajador',      en: 'worker' },
    hint:    { es: 'persona del trabajo', en: 'work person' },
    answers: [['jan','pali']] },

  { id: 'soldier',    emoji: '🪖', level: 'medium',
    concept: { es: 'soldado / guerrero', en: 'soldier / warrior' },
    hint:    { es: 'persona de batalla',  en: 'battle person' },
    answers: [['jan','utala']] },

  { id: 'father',     emoji: '👨', level: 'easy',
    concept: { es: 'padre',           en: 'father' },
    hint:    { es: 'progenitor masculino', en: 'male parent' },
    answers: [['mama','mije']] },

  { id: 'mother',     emoji: '👩', level: 'easy',
    concept: { es: 'madre',           en: 'mother' },
    hint:    { es: 'progenitor femenino', en: 'female parent' },
    answers: [['mama','meli']] },

  // ============ LUGARES ============
  { id: 'bathroom',   emoji: '🚿', level: 'easy',
    concept: { es: 'baño',            en: 'bathroom' },
    hint:    { es: 'sala de agua',    en: 'water room' },
    answers: [['tomo','telo']] },

  { id: 'restaurant', emoji: '🍽️', level: 'easy',
    concept: { es: 'restaurante',     en: 'restaurant' },
    hint:    { es: 'casa de comida',  en: 'food building' },
    answers: [['tomo','moku']] },

  { id: 'school',     emoji: '🏫', level: 'easy',
    concept: { es: 'escuela',         en: 'school' },
    hint:    { es: 'casa del saber',  en: 'knowledge building' },
    answers: [['tomo','sona']] },

  { id: 'bedroom',    emoji: '🛏️', level: 'medium',
    concept: { es: 'dormitorio',      en: 'bedroom' },
    hint:    { es: 'sala para dormir', en: 'sleep room' },
    answers: [['tomo','lape']] },

  { id: 'city',       emoji: '🏙️', level: 'medium',
    concept: { es: 'ciudad',          en: 'city' },
    hint:    { es: 'tierra de edificios', en: 'land of buildings' },
    answers: [['ma','tomo']] },

  { id: 'forest',     emoji: '🌳', level: 'medium',
    concept: { es: 'bosque / selva',  en: 'forest / jungle' },
    hint:    { es: 'tierra de plantas', en: 'plant land' },
    answers: [['ma','kasi']] },

  { id: 'sea',        emoji: '🌊', level: 'easy',
    concept: { es: 'mar / océano',    en: 'sea / ocean' },
    hint:    { es: 'tierra de agua',  en: 'water land' },
    answers: [['ma','telo']] },

  { id: 'mountain',   emoji: '🏔️', level: 'medium',
    concept: { es: 'montaña',         en: 'mountain' },
    hint:    { es: 'tierra de piedra', en: 'stone land' },
    answers: [['ma','kiwen']] },

  // ============ COMIDA Y BEBIDA ============
  { id: 'candy',      emoji: '🍬', level: 'easy',
    concept: { es: 'dulce / caramelo', en: 'candy / dessert' },
    hint:    { es: 'comida dulce',    en: 'sweet food' },
    answers: [['moku','suwi']] },

  { id: 'soup',       emoji: '🍲', level: 'medium',
    concept: { es: 'sopa',            en: 'soup' },
    hint:    { es: 'comida líquida',  en: 'water food' },
    answers: [['moku','telo']] },

  { id: 'juice',      emoji: '🧃', level: 'easy',
    concept: { es: 'jugo / zumo',     en: 'juice' },
    hint:    { es: 'agua dulce',      en: 'sweet water' },
    answers: [['telo','suwi']] },

  { id: 'tea',        emoji: '🍵', level: 'medium',
    concept: { es: 'té / agua caliente', en: 'tea / hot water' },
    hint:    { es: 'agua caliente',   en: 'hot water' },
    answers: [['telo','seli']] },

  // ============ ANIMALES ============
  { id: 'whale',      emoji: '🐋', level: 'medium',
    concept: { es: 'ballena',         en: 'whale' },
    hint:    { es: 'pez grande',      en: 'big fish' },
    answers: [['kala','suli']] },

  { id: 'raptor',     emoji: '🦅', level: 'medium',
    concept: { es: 'ave rapaz',       en: 'large bird / raptor' },
    hint:    { es: 'ave grande',      en: 'big bird' },
    answers: [['waso','suli']] },

  // ============ TIEMPO ============
  { id: 'day',        emoji: '☀️', level: 'easy',
    concept: { es: 'día',             en: 'day' },
    hint:    { es: 'tiempo del sol',  en: 'time of sun' },
    answers: [['tenpo','suno']] },

  { id: 'night',      emoji: '🌙', level: 'easy',
    concept: { es: 'noche',           en: 'night' },
    hint:    { es: 'tiempo oscuro',   en: 'dark time' },
    answers: [['tenpo','pimeja']] },

  { id: 'year',       emoji: '📅', level: 'medium',
    concept: { es: 'año',             en: 'year' },
    hint:    { es: 'tiempo circular', en: 'circular time' },
    answers: [['tenpo','sike']] },

  { id: 'past',       emoji: '⏪', level: 'medium',
    concept: { es: 'pasado',          en: 'past' },
    hint:    { es: 'tiempo terminado', en: 'ended time' },
    answers: [['tenpo','pini']] },

  { id: 'future',     emoji: '⏩', level: 'medium',
    concept: { es: 'futuro',          en: 'future' },
    hint:    { es: 'tiempo que viene', en: 'coming time' },
    answers: [['tenpo','kama']] },

  // ============ HERRAMIENTAS / TECNOLOGÍA ============
  { id: 'phone',      emoji: '📱', level: 'easy',
    concept: { es: 'teléfono',        en: 'phone' },
    hint:    { es: 'herramienta para hablar', en: 'talk tool' },
    answers: [['ilo','toki']] },

  { id: 'computer',   emoji: '💻', level: 'medium',
    concept: { es: 'computadora',     en: 'computer' },
    hint:    { es: 'herramienta del saber', en: 'knowledge tool' },
    answers: [['ilo','sona']] },

  { id: 'vehicle',    emoji: '🚗', level: 'medium',
    concept: { es: 'vehículo',        en: 'vehicle / car' },
    hint:    { es: 'herramienta de movimiento', en: 'movement tool' },
    answers: [['ilo','tawa']] },

  { id: 'toy',        emoji: '🧸', level: 'medium',
    concept: { es: 'juguete',         en: 'toy' },
    hint:    { es: 'herramienta de juego', en: 'fun tool' },
    answers: [['ilo','musi']] },

  // ============ SENTIMIENTOS ============
  { id: 'happy',      emoji: '😊', level: 'easy',
    concept: { es: 'feliz / alegre',  en: 'happy' },
    hint:    { es: 'sentir bien',     en: 'feel good' },
    answers: [['pilin','pona']] },

  { id: 'sad',        emoji: '😢', level: 'easy',
    concept: { es: 'triste',          en: 'sad' },
    hint:    { es: 'sentir mal',      en: 'feel bad' },
    answers: [['pilin','ike']] },

  // ============ NATURALEZA ============
  { id: 'tree',       emoji: '🌲', level: 'easy',
    concept: { es: 'árbol',           en: 'tree' },
    hint:    { es: 'planta grande',   en: 'big plant' },
    answers: [['kasi','suli']] },

  { id: 'news',       emoji: '📰', level: 'medium',
    concept: { es: 'noticias',        en: 'news' },
    hint:    { es: 'habla nueva',     en: 'new talk' },
    answers: [['toki','sin']] }
]

// Genera distractores: palabras del VOCAB que NO son la respuesta correcta,
// excluyendo partículas/pronombres/preposiciones/interjecciones/números.
const NON_COMPOUND_TYPES = new Set(['particle', 'pronoun', 'preposition', 'interjection', 'number'])

export function pickWordsForRound(compound, vocab, totalSlots = 10) {
  const [correct1, correct2] = compound.answers[0]
  const correctSet = new Set([correct1, correct2])

  const candidates = Object.keys(vocab).filter(k =>
    !correctSet.has(k) && !NON_COMPOUND_TYPES.has(vocab[k].tipo)
  )

  // shuffle Fisher–Yates
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
  }

  const distractors = candidates.slice(0, totalSlots - 2)
  const pool = [correct1, correct2, ...distractors]
  // shuffle final pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

// Devuelve N compuestos aleatorios para una sesión
export function pickRoundSet(n = 10) {
  const arr = [...COMPOUNDS]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.slice(0, n)
}

// Verifica si [w1, w2] es respuesta válida para el compuesto
export function isCorrectAnswer(compound, w1, w2) {
  return compound.answers.some(([a, b]) => a === w1 && b === w2)
}
