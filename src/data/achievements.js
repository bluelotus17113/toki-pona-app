// Logros de toki pona a! — 20 logros bilingües (es/en).
// Dos tipos:
//   - auto: se chequean automáticamente vs progress state (XP, lecciones)
//   - event: se desbloquean explícitamente con unlock(id) desde el componente

import { LESSONS } from './lessons.js'

export const CATEGORIES = {
  study:       { es: 'estudio',       en: 'study',       icon: '📚' },
  creativity:  { es: 'creatividad',   en: 'creativity',  icon: '🎨' },
  discovery:   { es: 'descubrimiento', en: 'discovery',  icon: '🔍' },
  easter:      { es: 'pascuas',       en: 'easter eggs', icon: '🥚' }
}

export const ACHIEVEMENTS = [
  // ============ Estudio (7) ============
  {
    id: 'first-lesson', icon: '🎓', category: 'study',
    title: { es: 'primer paso',                  en: 'first step' },
    desc:  { es: 'completá tu primera lección',  en: 'complete your first lesson' },
    auto: (s) => s.completed.length >= 1
  },
  {
    id: 'five-lessons', icon: '🌱', category: 'study',
    title: { es: 'brotando',                     en: 'sprouting' },
    desc:  { es: 'completá 5 lecciones',         en: 'complete 5 lessons' },
    auto: (s) => s.completed.length >= 5
  },
  {
    id: 'thirty-lessons', icon: '🌳', category: 'study',
    title: { es: 'kasi suli',                    en: 'kasi suli' },
    desc:  { es: 'completá 30 lecciones',        en: 'complete 30 lessons' },
    auto: (s) => s.completed.length >= 30
  },
  {
    id: 'all-lessons', icon: '🏆', category: 'study',
    title: { es: 'jan sona pona',                en: 'jan sona pona' },
    desc:  { es: 'completá todas las lecciones', en: 'complete every lesson' },
    auto: (s) => s.completed.length >= LESSONS.length
  },
  {
    id: 'xp-500', icon: '⭐', category: 'study',
    title: { es: 'media estrella',               en: 'half a star' },
    desc:  { es: 'ganá 500 XP',                  en: 'earn 500 XP' },
    auto: (s) => s.xp >= 500
  },
  {
    id: 'xp-2000', icon: '🌟', category: 'study',
    title: { es: 'estrella completa',            en: 'full star' },
    desc:  { es: 'ganá 2000 XP',                 en: 'earn 2000 XP' },
    auto: (s) => s.xp >= 2000
  },
  {
    id: 'perfect-lesson', icon: '💎', category: 'study',
    title: { es: 'sin un rasguño',               en: 'flawless' },
    desc:  { es: 'completá una lección sin errores', en: 'finish a lesson with zero mistakes' }
  },

  // ============ Creatividad (6) ============
  {
    id: 'nimitu-first-correct', icon: '🧩', category: 'creativity',
    title: { es: 'primer compuesto',             en: 'first compound' },
    desc:  { es: 'acertaste un compuesto en nimi tu', en: 'got a compound right in nimi tu' }
  },
  {
    id: 'nimitu-perfect', icon: '🎯', category: 'creativity',
    title: { es: 'pleno',                        en: 'perfect run' },
    desc:  { es: '10/10 en una sesión de nimi tu', en: '10/10 in a single nimi tu session' }
  },
  {
    id: 'sitelen-first-write', icon: '☉', category: 'creativity',
    title: { es: 'primera escritura',            en: 'first writing' },
    desc:  { es: 'escribiste algo en sitelen pona', en: 'wrote your first sitelen pona text' }
  },
  {
    id: 'lienzo-first-save', icon: '🖼️', category: 'creativity',
    title: { es: 'obra de arte',                 en: 'work of art' },
    desc:  { es: 'guardaste tu primer dibujo del lienzo', en: 'saved your first canvas creation' }
  },
  {
    id: 'lienzo-first-compound', icon: '🎨', category: 'creativity',
    title: { es: 'cartouche',                    en: 'cartouche' },
    desc:  { es: 'formaste un compuesto poniendo un glifo dentro de otro', en: 'formed a compound by nesting a glyph inside another' }
  },
  {
    id: 'lienzo-colors-5', icon: '🌈', category: 'creativity',
    title: { es: 'paleta llena',                 en: 'full palette' },
    desc:  { es: 'usaste 5 colores distintos en el lienzo', en: 'used 5 different colors in the canvas' }
  },

  // ============ Descubrimiento (5) ============
  {
    id: 'dict-opened', icon: '📖', category: 'discovery',
    title: { es: 'lipu sona',                    en: 'lipu sona' },
    desc:  { es: 'abriste el diccionario',       en: 'opened the dictionary' }
  },
  {
    id: 'grammar-read', icon: '📐', category: 'discovery',
    title: { es: 'nasin nimi',                   en: 'nasin nimi' },
    desc:  { es: 'visitaste la gramática',       en: 'visited the grammar page' }
  },
  {
    id: 'first-tts', icon: '🔊', category: 'discovery',
    title: { es: 'kalama!',                      en: 'kalama!' },
    desc:  { es: 'escuchaste una palabra en voz alta', en: 'heard a word pronounced' }
  },
  {
    id: 'lang-changed', icon: '🌍', category: 'discovery',
    title: { es: 'jan toki tu',                  en: 'jan toki tu' },
    desc:  { es: 'cambiaste el idioma de la app', en: 'changed the app language' }
  },
  {
    id: 'first-ad', icon: '🎬', category: 'discovery',
    title: { es: 'gracias por el aire',          en: 'thanks for the air' },
    desc:  { es: 'viste un anuncio para recuperar una vida', en: 'watched an ad to refill a heart' }
  },

  // ============ Easter eggs (2) ============
  {
    id: 'no-hearts-once', icon: '💔', category: 'easter',
    title: { es: 'pakala!',                      en: 'pakala!' },
    desc:  { es: 'te quedaste sin vidas — pasa hasta a los mejores', en: 'ran out of hearts — happens to the best of us' }
  },
  {
    id: 'mi-olin', icon: '💌', category: 'easter',
    title: { es: 'mi olin e sina',               en: 'mi olin e sina' },
    desc:  { es: 'escribiste "te amo" en toki pona en el playground', en: 'typed "I love you" in toki pona at the playground' }
  },
  {
    id: 'history-read', icon: '📜', category: 'discovery',
    title: { es: 'historiador',                  en: 'historian' },
    desc:  { es: 'leíste la historia de toki pona', en: 'read the history of toki pona' }
  },
  {
    id: 'atlas-opened', icon: '🔠', category: 'discovery',
    title: { es: 'cartógrafo de glifos',         en: 'glyph cartographer' },
    desc:  { es: 'exploraste el atlas de sitelen pona', en: 'explored the sitelen pona atlas' }
  },
  {
    id: 'ku-master', icon: '🦝', category: 'study',
    title: { es: 'maestro ku',                   en: 'ku master' },
    desc:  { es: 'completaste las lecciones de palabras ku', en: 'completed the ku words lessons' },
    auto: (s) => [45,46,47,48,49,50].every(id => s.completed.includes(id))
  },
  {
    id: 'kulupu-opened', icon: '🌍', category: 'discovery',
    title: { es: 'encontré mi tribu',            en: 'found my tribe' },
    desc:  { es: 'abriste la pantalla de comunidad', en: 'opened the community screen' }
  },
  {
    id: 'kulupu-explorer', icon: '🧭', category: 'discovery',
    title: { es: 'explorador de kulupu',         en: 'kulupu explorer' },
    desc:  { es: 'visitaste un espacio de la comunidad real', en: 'visited a real community space' }
  },
  {
    id: 'kama-sona-first-win', icon: '🃏', category: 'creativity',
    title: { es: 'memoria pona',                 en: 'sharp memory' },
    desc:  { es: 'ganaste una partida de kama sona', en: 'won a kama sona round' }
  },
  {
    id: 'kama-sona-perfect', icon: '🧠', category: 'creativity',
    title: { es: 'memoria suli',                 en: 'flawless mind' },
    desc:  { es: 'ganaste kama sona sin errores', en: 'won kama sona without mistakes' }
  },
  {
    id: 'lipu-pakala-first-win', icon: '🧩', category: 'creativity',
    title: { es: 'frase armada',                 en: 'sentence assembled' },
    desc:  { es: 'completaste una ronda de lipu pakala', en: 'finished a lipu pakala round' }
  },
  {
    id: 'lipu-pakala-perfect', icon: '✨', category: 'creativity',
    title: { es: 'pleno pakala',                 en: 'flawless pakala' },
    desc:  { es: '5/5 en una ronda de lipu pakala', en: '5/5 in a lipu pakala round' }
  },
  {
    id: 'kalama-kute-first-win', icon: '🎧', category: 'creativity',
    title: { es: 'oído fino',                    en: 'sharp ear' },
    desc:  { es: 'completaste una ronda de kalama kute', en: 'finished a kalama kute round' }
  },
  {
    id: 'kalama-kute-perfect', icon: '🔊', category: 'creativity',
    title: { es: 'pleno auditivo',               en: 'flawless ear' },
    desc:  { es: '10/10 en una ronda de kalama kute', en: '10/10 in a kalama kute round' }
  },
  {
    id: 'kulupu-nimi-first-win', icon: '📂', category: 'creativity',
    title: { es: 'clasificador',                 en: 'classifier' },
    desc:  { es: 'completaste una ronda de kulupu nimi', en: 'finished a kulupu nimi round' }
  },
  {
    id: 'kulupu-nimi-perfect', icon: '🎯', category: 'creativity',
    title: { es: 'pleno clasificador',           en: 'flawless classifier' },
    desc:  { es: 'kulupu nimi sin errores',      en: 'kulupu nimi without mistakes' }
  },
  {
    id: 'nimi-sin-first-win', icon: '🔤', category: 'creativity',
    title: { es: 'wordler',                      en: 'wordler' },
    desc:  { es: 'ganaste una partida de nimi sin', en: 'won a nimi sin game' }
  },
  {
    id: 'nimi-sin-genius', icon: '🧠', category: 'creativity',
    title: { es: 'genio del sin',                en: 'sin genius' },
    desc:  { es: 'nimi sin en 2 intentos o menos', en: 'nimi sin in 2 tries or fewer' }
  },
  {
    id: 'kala-alasa-first-win', icon: '🎣', category: 'creativity',
    title: { es: 'pescador',                     en: 'angler' },
    desc:  { es: 'completaste una ronda de kala alasa', en: 'finished a kala alasa round' }
  },
  {
    id: 'kala-alasa-combo-10', icon: '🔥', category: 'creativity',
    title: { es: 'racha de fuego',               en: 'on fire' },
    desc:  { es: 'combo de 10 en kala alasa',    en: '10-combo in kala alasa' }
  },
  {
    id: 'alasa-nimi-first-win', icon: '🔍', category: 'creativity',
    title: { es: 'cazador de palabras',          en: 'word hunter' },
    desc:  { es: 'completaste una ronda de alasa nimi', en: 'finished an alasa nimi round' }
  },
  {
    id: 'alasa-nimi-perfect', icon: '🎯', category: 'creativity',
    title: { es: 'rastreador',                   en: 'tracker' },
    desc:  { es: 'encontraste todas en alasa nimi', en: 'found all words in alasa nimi' }
  },
  {
    id: 'sitelen-sin-first-win', icon: '✍️', category: 'creativity',
    title: { es: 'mano que escribe',             en: 'writing hand' },
    desc:  { es: 'trazaste tu primer glifo',     en: 'traced your first glyph' }
  },
  {
    id: 'sitelen-sin-complete', icon: '🖋️', category: 'creativity',
    title: { es: 'calígrafo',                    en: 'calligrapher' },
    desc:  { es: 'completaste una sesión de sitelen sin', en: 'completed a sitelen sin session' }
  },
  {
    id: 'toki-first-convo', icon: '💬', category: 'discovery',
    title: { es: 'primera charla',               en: 'first chat' },
    desc:  { es: 'completaste una conversación interactiva', en: 'finished an interactive conversation' }
  },
  {
    id: 'toki-perfect-convo', icon: '🎙️', category: 'discovery',
    title: { es: 'orador pona',                  en: 'eloquent speaker' },
    desc:  { es: 'todas las opciones "buenas" en una conversación', en: 'all "good" choices in one conversation' }
  }
]

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length
