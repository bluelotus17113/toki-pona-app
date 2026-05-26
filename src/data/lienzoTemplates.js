// Plantillas para ilo sitelen: composiciones pre-armadas que el usuario
// puede cargar al canvas. La mayoría son cartouches (compuesto head + modifier
// donde el modifier va DENTRO del head).
//
// Coordenadas pensadas para canvas ~360x360. El componente puede escalar/centrar.

export const LIENZO_TEMPLATES = [
  // ============ Cartouches clásicos ============
  {
    id: 'jan-pona',
    emoji: '🫂',
    title: { es: 'jan pona',  en: 'jan pona' },
    desc:  { es: 'amigo (cartouche)', en: 'friend (cartouche)' },
    glyphs: [
      { word: 'jan',  x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'pona', x: 165, y: 165, fontSize: 70,  fill: '#2d9a48' }
    ]
  },
  {
    id: 'tomo-telo',
    emoji: '🚿',
    title: { es: 'tomo telo', en: 'tomo telo' },
    desc:  { es: 'baño',      en: 'bathroom' },
    glyphs: [
      { word: 'tomo', x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'telo', x: 160, y: 160, fontSize: 70,  fill: '#118ab2' }
    ]
  },
  {
    id: 'ma-kasi',
    emoji: '🌳',
    title: { es: 'ma kasi',   en: 'ma kasi' },
    desc:  { es: 'bosque',    en: 'forest' },
    glyphs: [
      { word: 'ma',   x: 90,  y: 90,  fontSize: 180, fill: '#8b6f47' },
      { word: 'kasi', x: 165, y: 165, fontSize: 70,  fill: '#2d9a48' }
    ]
  },
  {
    id: 'kala-suli',
    emoji: '🐋',
    title: { es: 'kala suli', en: 'kala suli' },
    desc:  { es: 'ballena',   en: 'whale' },
    glyphs: [
      { word: 'kala', x: 90,  y: 90,  fontSize: 180, fill: '#118ab2' },
      { word: 'suli', x: 165, y: 165, fontSize: 70,  fill: '#1b2099' }
    ]
  },
  {
    id: 'mama-mije',
    emoji: '👨',
    title: { es: 'mama mije', en: 'mama mije' },
    desc:  { es: 'padre',     en: 'father' },
    glyphs: [
      { word: 'mama', x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'mije', x: 165, y: 165, fontSize: 70,  fill: '#118ab2' }
    ]
  },
  {
    id: 'mama-meli',
    emoji: '👩',
    title: { es: 'mama meli', en: 'mama meli' },
    desc:  { es: 'madre',     en: 'mother' },
    glyphs: [
      { word: 'mama', x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'meli', x: 165, y: 165, fontSize: 70,  fill: '#e85d75' }
    ]
  },
  {
    id: 'jan-lili',
    emoji: '🧒',
    title: { es: 'jan lili',  en: 'jan lili' },
    desc:  { es: 'niño',      en: 'child' },
    glyphs: [
      { word: 'jan',  x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'lili', x: 170, y: 170, fontSize: 60,  fill: '#fbc02d' }
    ]
  },
  {
    id: 'jan-sona',
    emoji: '👩‍🏫',
    title: { es: 'jan sona',  en: 'jan sona' },
    desc:  { es: 'sabio, maestro', en: 'wise person, teacher' },
    glyphs: [
      { word: 'jan',  x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'sona', x: 160, y: 160, fontSize: 75,  fill: '#fbc02d' }
    ]
  },
  {
    id: 'ilo-toki',
    emoji: '📱',
    title: { es: 'ilo toki',  en: 'ilo toki' },
    desc:  { es: 'teléfono',  en: 'phone' },
    glyphs: [
      { word: 'ilo',  x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'toki', x: 160, y: 160, fontSize: 75,  fill: '#8338ec' }
    ]
  },
  {
    id: 'ilo-sona',
    emoji: '💻',
    title: { es: 'ilo sona',  en: 'ilo sona' },
    desc:  { es: 'computadora', en: 'computer' },
    glyphs: [
      { word: 'ilo',  x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'sona', x: 160, y: 160, fontSize: 75,  fill: '#fbc02d' }
    ]
  },
  {
    id: 'moku-suwi',
    emoji: '🍬',
    title: { es: 'moku suwi', en: 'moku suwi' },
    desc:  { es: 'dulce',     en: 'sweet, candy' },
    glyphs: [
      { word: 'moku', x: 90,  y: 90,  fontSize: 180, fill: '#1b2099' },
      { word: 'suwi', x: 165, y: 165, fontSize: 70,  fill: '#e85d75' }
    ]
  },
  {
    id: 'tenpo-suno',
    emoji: '☀️',
    title: { es: 'tenpo suno', en: 'tenpo suno' },
    desc:  { es: 'día',       en: 'day' },
    glyphs: [
      { word: 'tenpo', x: 80,  y: 80,  fontSize: 180, fill: '#1b2099' },
      { word: 'suno',  x: 160, y: 160, fontSize: 80,  fill: '#fbc02d' }
    ]
  },
  {
    id: 'tenpo-pimeja',
    emoji: '🌙',
    title: { es: 'tenpo pimeja', en: 'tenpo pimeja' },
    desc:  { es: 'noche',     en: 'night' },
    glyphs: [
      { word: 'tenpo',  x: 70,  y: 80,  fontSize: 180, fill: '#1b2099' },
      { word: 'pimeja', x: 150, y: 160, fontSize: 80,  fill: '#000000' }
    ]
  },
  {
    id: 'kasi-suli',
    emoji: '🌳',
    title: { es: 'kasi suli', en: 'kasi suli' },
    desc:  { es: 'árbol',     en: 'tree' },
    glyphs: [
      { word: 'kasi', x: 90,  y: 90,  fontSize: 180, fill: '#2d9a48' },
      { word: 'suli', x: 170, y: 170, fontSize: 65,  fill: '#1b2099' }
    ]
  },
  {
    id: 'soweli-pona',
    emoji: '🐶',
    title: { es: 'soweli pona', en: 'soweli pona' },
    desc:  { es: 'mascota',   en: 'pet' },
    glyphs: [
      { word: 'soweli', x: 70,  y: 90,  fontSize: 180, fill: '#8b6f47' },
      { word: 'pona',   x: 160, y: 160, fontSize: 75,  fill: '#2d9a48' }
    ]
  },

  // ============ Composiciones de varias palabras ============
  {
    id: 'toki-pona',
    emoji: '🍃',
    title: { es: 'toki pona', en: 'toki pona' },
    desc:  { es: 'lenguaje del bien', en: 'language of good' },
    glyphs: [
      { word: 'toki', x: 60,  y: 130, fontSize: 130, fill: '#1b2099' },
      { word: 'pona', x: 200, y: 130, fontSize: 130, fill: '#2d9a48' }
    ]
  },
  {
    id: 'mi-olin-e-sina',
    emoji: '💌',
    title: { es: 'mi olin e sina', en: 'mi olin e sina' },
    desc:  { es: 'te amo',    en: 'I love you' },
    glyphs: [
      { word: 'mi',   x: 30,  y: 130, fontSize: 80, fill: '#1b2099' },
      { word: 'olin', x: 120, y: 130, fontSize: 80, fill: '#e85d75' },
      { word: 'e',    x: 210, y: 130, fontSize: 80, fill: '#1b2099' },
      { word: 'sina', x: 270, y: 130, fontSize: 80, fill: '#1b2099' }
    ]
  },
  {
    id: 'ale-li-pona',
    emoji: '✨',
    title: { es: 'ale li pona', en: 'ale li pona' },
    desc:  { es: 'todo está bien', en: 'all is good' },
    glyphs: [
      { word: 'ale',  x: 30,  y: 130, fontSize: 100, fill: '#1b2099' },
      { word: 'li',   x: 150, y: 130, fontSize: 100, fill: '#8338ec' },
      { word: 'pona', x: 230, y: 130, fontSize: 100, fill: '#2d9a48' }
    ]
  },
  {
    id: 'sona-pona',
    emoji: '🧠',
    title: { es: 'sona pona', en: 'sona pona' },
    desc:  { es: 'sabiduría', en: 'wisdom' },
    glyphs: [
      { word: 'sona', x: 80,  y: 130, fontSize: 130, fill: '#fbc02d' },
      { word: 'pona', x: 220, y: 130, fontSize: 130, fill: '#2d9a48' }
    ]
  },

  // ============ Decorativos / artísticos ============
  {
    id: 'mun-en-suno',
    emoji: '🌗',
    title: { es: 'mun en suno', en: 'mun en suno' },
    desc:  { es: 'luna y sol', en: 'moon and sun' },
    glyphs: [
      { word: 'mun',  x: 50,  y: 130, fontSize: 130, fill: '#8338ec' },
      { word: 'en',   x: 180, y: 130, fontSize: 100, fill: '#1b2099' },
      { word: 'suno', x: 250, y: 130, fontSize: 130, fill: '#fbc02d' }
    ]
  },
  {
    id: 'kulupu-jan',
    emoji: '👥',
    title: { es: 'kulupu jan', en: 'kulupu jan' },
    desc:  { es: 'comunidad', en: 'community' },
    glyphs: [
      { word: 'kulupu', x: 50,  y: 130, fontSize: 130, fill: '#118ab2' },
      { word: 'jan',    x: 220, y: 130, fontSize: 130, fill: '#1b2099' }
    ]
  },
  {
    id: 'pona-lukin',
    emoji: '🌸',
    title: { es: 'pona lukin', en: 'pona lukin' },
    desc:  { es: 'hermoso (lit. bueno de mirar)', en: 'beautiful (lit. good to look at)' },
    glyphs: [
      { word: 'pona',  x: 60,  y: 130, fontSize: 130, fill: '#e85d75' },
      { word: 'lukin', x: 200, y: 130, fontSize: 130, fill: '#1b2099' }
    ]
  }
]

// Helper: dado un template y stage size, devuelve los glyphs con IDs únicos
// listos para insertar en el state del lienzo. Centra si stage es distinto a 360.
export function instantiateTemplate(template, stageW = 360, stageH = 360) {
  const scaleX = stageW / 360
  const scaleY = stageH / 360
  const scale = Math.min(scaleX, scaleY)
  let counter = 0
  return template.glyphs.map(g => ({
    id: `tpl_${template.id}_${++counter}_${Date.now().toString(36)}`,
    word: g.word,
    x: g.x * scale,
    y: g.y * scale,
    fontSize: g.fontSize * scale,
    fill: g.fill,
    scaleX: 1,
    scaleY: 1,
    rotation: 0
  }))
}
