// Atlas de sitelen pona: compuestos clásicos agrupados por head word.
// Inspirado en lipu nimi pi linku (la imagen de referencia compartida).
// Cada compuesto se renderiza con la fuente linja pona via ligaduras.
//
// Las palabras "simples" vienen de VOCAB directamente; acá solo curamos compuestos.

export const COMPOUND_CATEGORIES = [
  {
    id: 'jan',
    icon: '👤',
    head: 'jan',
    title: { es: 'personas (jan-X)',     en: 'people (jan-X)' },
    items: [
      { compound: 'jan pona',   es: 'amigo, persona buena',           en: 'friend, good person' },
      { compound: 'jan ike',    es: 'enemigo, mala persona',          en: 'enemy, bad person' },
      { compound: 'jan lili',   es: 'niño, persona joven',            en: 'child, young person' },
      { compound: 'jan suli',   es: 'adulto, persona importante',     en: 'adult, important person' },
      { compound: 'jan sona',   es: 'sabio, maestro',                 en: 'wise person, teacher' },
      { compound: 'jan lawa',   es: 'líder, jefe',                    en: 'leader, boss' },
      { compound: 'jan utala',  es: 'soldado, guerrero',              en: 'soldier, warrior' },
      { compound: 'jan pali',   es: 'trabajador',                     en: 'worker' },
      { compound: 'jan toki',   es: 'orador, hablante',               en: 'speaker' },
      { compound: 'jan musi',   es: 'artista, comediante',            en: 'artist, comedian' },
      { compound: 'jan unpa',   es: 'amante',                         en: 'lover' },
      { compound: 'jan moli',   es: 'persona muerta, asesino',        en: 'dead person, killer' },
      { compound: 'jan sin',    es: 'persona nueva, extraño',         en: 'new person, stranger' },
      { compound: 'jan nasa',   es: 'persona rara, loca',             en: 'weird person, fool' },
      { compound: 'jan pakala', es: 'persona herida',                 en: 'wounded person' },
      { compound: 'jan wawa',   es: 'persona fuerte, héroe',          en: 'strong person, hero' }
    ]
  },
  {
    id: 'tomo',
    icon: '🏠',
    head: 'tomo',
    title: { es: 'edificios (tomo-X)',   en: 'buildings (tomo-X)' },
    items: [
      { compound: 'tomo telo',  es: 'baño',                           en: 'bathroom' },
      { compound: 'tomo moku',  es: 'restaurante, cocina',            en: 'restaurant, kitchen' },
      { compound: 'tomo sona',  es: 'escuela',                        en: 'school' },
      { compound: 'tomo lape',  es: 'dormitorio',                     en: 'bedroom' },
      { compound: 'tomo pali',  es: 'oficina, taller',                en: 'office, workshop' },
      { compound: 'tomo musi',  es: 'teatro, cine',                   en: 'theater, cinema' },
      { compound: 'tomo sin',   es: 'casa nueva',                     en: 'new house' },
      { compound: 'tomo suli',  es: 'edificio grande, mansión',       en: 'big building, mansion' },
      { compound: 'tomo lili',  es: 'cabaña',                         en: 'small hut, cabin' },
      { compound: 'tomo mama',  es: 'casa familiar',                  en: 'family home' },
      { compound: 'tomo tawa',  es: 'auto-caravana, casa rodante',    en: 'mobile home' },
      { compound: 'tomo pi sona nasin', es: 'biblioteca (lit. casa de saber del camino)', en: 'library' }
    ]
  },
  {
    id: 'ma',
    icon: '🗺️',
    head: 'ma',
    title: { es: 'lugares (ma-X)',       en: 'places (ma-X)' },
    items: [
      { compound: 'ma tomo',    es: 'ciudad',                         en: 'city' },
      { compound: 'ma kasi',    es: 'bosque, selva',                  en: 'forest, jungle' },
      { compound: 'ma telo',    es: 'lago, mar',                      en: 'lake, sea' },
      { compound: 'ma kiwen',   es: 'montaña',                        en: 'mountain' },
      { compound: 'ma seli',    es: 'desierto',                       en: 'desert' },
      { compound: 'ma lete',    es: 'ártico, polo',                   en: 'arctic' },
      { compound: 'ma suli',    es: 'país, continente',               en: 'country, continent' },
      { compound: 'ma pona',    es: 'paraíso',                        en: 'paradise' },
      { compound: 'ma utala',   es: 'campo de batalla',               en: 'battlefield' },
      { compound: 'ma sin',     es: 'tierra nueva',                   en: 'new land' },
      { compound: 'ma anpa',    es: 'subsuelo, infierno',             en: 'underworld' }
    ]
  },
  {
    id: 'moku',
    icon: '🍽️',
    head: 'moku',
    title: { es: 'comida (moku-X)',      en: 'food (moku-X)' },
    items: [
      { compound: 'moku suwi',  es: 'dulce, postre',                  en: 'sweet, dessert' },
      { compound: 'moku telo',  es: 'sopa',                           en: 'soup' },
      { compound: 'moku pona',  es: 'comida rica',                    en: 'good food' },
      { compound: 'moku ike',   es: 'comida mala',                    en: 'bad food' },
      { compound: 'moku suli',  es: 'comida grande, banquete',        en: 'feast' },
      { compound: 'moku lili',  es: 'snack, bocadito',                en: 'snack' },
      { compound: 'moku seli',  es: 'comida caliente',                en: 'hot food' },
      { compound: 'moku lete',  es: 'helado',                         en: 'ice cream' }
    ]
  },
  {
    id: 'telo',
    icon: '💧',
    head: 'telo',
    title: { es: 'líquidos (telo-X)',    en: 'liquids (telo-X)' },
    items: [
      { compound: 'telo suwi',  es: 'jugo, zumo',                     en: 'juice' },
      { compound: 'telo nasa',  es: 'alcohol',                        en: 'alcohol' },
      { compound: 'telo wawa',  es: 'bebida energética, café',        en: 'energy drink, coffee' },
      { compound: 'telo seli',  es: 'té, agua caliente',              en: 'tea, hot water' },
      { compound: 'telo lete',  es: 'agua fría, hielo derretido',     en: 'cold water' },
      { compound: 'telo pona',  es: 'agua potable',                   en: 'drinking water' },
      { compound: 'telo jaki',  es: 'agua sucia, contaminada',        en: 'dirty water' },
      { compound: 'telo loje',  es: 'sangre (lit. agua roja)',        en: 'blood' },
      { compound: 'telo oko',   es: 'lágrimas (post-pu)',             en: 'tears (post-pu)' }
    ]
  },
  {
    id: 'tenpo',
    icon: '⏰',
    head: 'tenpo',
    title: { es: 'tiempo (tenpo-X)',     en: 'time (tenpo-X)' },
    items: [
      { compound: 'tenpo suno',   es: 'día',                          en: 'day' },
      { compound: 'tenpo pimeja', es: 'noche',                        en: 'night' },
      { compound: 'tenpo sike',   es: 'año',                          en: 'year' },
      { compound: 'tenpo pini',   es: 'pasado, antes',                en: 'past, before' },
      { compound: 'tenpo kama',   es: 'futuro, después',              en: 'future, later' },
      { compound: 'tenpo ni',     es: 'ahora',                        en: 'now' },
      { compound: 'tenpo mute',   es: 'a menudo, mucho tiempo',       en: 'often, a long time' },
      { compound: 'tenpo lili',   es: 'un momento, brevemente',       en: 'a moment, briefly' },
      { compound: 'tenpo seli',   es: 'verano',                       en: 'summer' },
      { compound: 'tenpo lete',   es: 'invierno',                     en: 'winter' },
      { compound: 'tenpo sin',    es: 'recientemente, hace poco',     en: 'recently' }
    ]
  },
  {
    id: 'ilo',
    icon: '🔧',
    head: 'ilo',
    title: { es: 'herramientas (ilo-X)', en: 'tools (ilo-X)' },
    items: [
      { compound: 'ilo toki',    es: 'teléfono',                      en: 'phone' },
      { compound: 'ilo sona',    es: 'computadora',                   en: 'computer' },
      { compound: 'ilo tawa',    es: 'vehículo, auto',                en: 'vehicle, car' },
      { compound: 'ilo musi',    es: 'juguete, consola de juegos',    en: 'toy, game console' },
      { compound: 'ilo sitelen', es: 'cámara, lápiz, pincel',         en: 'camera, pen, brush' },
      { compound: 'ilo nanpa',   es: 'calculadora',                   en: 'calculator' },
      { compound: 'ilo moku',    es: 'tenedor, utensilio',            en: 'utensil, fork' },
      { compound: 'ilo lukin',   es: 'lentes, binoculares',           en: 'glasses, binoculars' },
      { compound: 'ilo pana',    es: 'arma (lit. herramienta de dar)', en: 'weapon' },
      { compound: 'ilo kute',    es: 'auriculares',                   en: 'headphones' }
    ]
  },
  {
    id: 'soweli',
    icon: '🦊',
    head: 'soweli',
    title: { es: 'animales (soweli-X)',  en: 'animals (soweli-X)' },
    items: [
      { compound: 'soweli suli',  es: 'animal grande',                en: 'big animal' },
      { compound: 'soweli lili',  es: 'animalito',                    en: 'small animal' },
      { compound: 'soweli wawa',  es: 'animal fuerte',                en: 'strong animal' },
      { compound: 'soweli ike',   es: 'animal peligroso',             en: 'dangerous animal' },
      { compound: 'soweli pona',  es: 'mascota',                      en: 'pet' },
      { compound: 'soweli nasa',  es: 'animal raro',                  en: 'weird animal' },
      { compound: 'soweli telo',  es: 'animal acuático',              en: 'aquatic mammal' }
    ]
  },
  {
    id: 'kala',
    icon: '🐟',
    head: 'kala',
    title: { es: 'peces (kala-X)',       en: 'fish (kala-X)' },
    items: [
      { compound: 'kala suli', es: 'ballena, pez grande',             en: 'whale, big fish' },
      { compound: 'kala lili', es: 'pececito',                        en: 'small fish' },
      { compound: 'kala moli', es: 'pez muerto',                      en: 'dead fish' }
    ]
  },
  {
    id: 'waso',
    icon: '🦅',
    head: 'waso',
    title: { es: 'aves (waso-X)',        en: 'birds (waso-X)' },
    items: [
      { compound: 'waso suli', es: 'ave grande, rapaz',                en: 'big bird, raptor' },
      { compound: 'waso lili', es: 'pajarito',                         en: 'small bird' },
      { compound: 'waso telo', es: 'ave acuática',                     en: 'waterfowl' }
    ]
  },
  {
    id: 'kasi',
    icon: '🌿',
    head: 'kasi',
    title: { es: 'plantas (kasi-X)',     en: 'plants (kasi-X)' },
    items: [
      { compound: 'kasi suli', es: 'árbol',                            en: 'tree' },
      { compound: 'kasi lili', es: 'hierba, pasto',                    en: 'grass, small plant' },
      { compound: 'kasi nasa', es: 'planta psicoactiva',               en: 'psychoactive plant' },
      { compound: 'kasi pona', es: 'planta medicinal',                 en: 'medicinal plant' },
      { compound: 'kasi loje', es: 'flor roja',                        en: 'red flower' }
    ]
  },
  {
    id: 'pilin',
    icon: '❤️',
    head: 'pilin',
    title: { es: 'sentimientos (pilin-X)', en: 'feelings (pilin-X)' },
    items: [
      { compound: 'pilin pona', es: 'feliz, contento',                 en: 'happy, content' },
      { compound: 'pilin ike',  es: 'triste',                          en: 'sad' },
      { compound: 'pilin wawa', es: 'apasionado, intenso',             en: 'passionate, intense' },
      { compound: 'pilin sin',  es: 'nuevo sentimiento',               en: 'new feeling' },
      { compound: 'pilin nasa', es: 'confundido, raro',                en: 'confused, strange' },
      { compound: 'pilin moli', es: 'desesperanzado',                  en: 'hopeless' }
    ]
  },
  {
    id: 'mama',
    icon: '👪',
    head: 'mama',
    title: { es: 'familia (mama-X)',     en: 'family (mama-X)' },
    items: [
      { compound: 'mama mije', es: 'padre',                            en: 'father' },
      { compound: 'mama meli', es: 'madre',                            en: 'mother' }
    ]
  },
  {
    id: 'misc',
    icon: '✨',
    head: '',
    title: { es: 'otros compuestos',      en: 'other compounds' },
    items: [
      { compound: 'toki pona',  es: 'lenguaje del bien',               en: 'language of good' },
      { compound: 'sitelen pona', es: 'glifo bueno (la escritura)',    en: 'good writing (the script)' },
      { compound: 'nasin pona', es: 'buen camino',                     en: 'good way' },
      { compound: 'nasin sona', es: 'método, filosofía',               en: 'method, philosophy' },
      { compound: 'nimi sin',   es: 'palabra nueva',                   en: 'new word' },
      { compound: 'linja lawa', es: 'cabello (lit. hilo de cabeza)',   en: 'hair' },
      { compound: 'lipu sona',  es: 'libro de saber',                  en: 'book of knowledge' },
      { compound: 'lipu toki',  es: 'carta, mensaje',                  en: 'letter, message' },
      { compound: 'kon pona',   es: 'buen espíritu, aire fresco',      en: 'good spirit' },
      { compound: 'kulupu jan', es: 'comunidad, sociedad',             en: 'community, society' },
      { compound: 'mun pona',   es: 'buena luna',                      en: 'good moon' },
      { compound: 'kalama musi', es: 'música',                         en: 'music' },
      { compound: 'sona pona',  es: 'sabiduría',                       en: 'wisdom' }
    ]
  }
]

// Total: cantidad de compuestos curados
export const TOTAL_COMPOUNDS = COMPOUND_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0)

// Búsqueda: filtra compuestos cuyo texto coincide
export function searchCompounds(query, lang = 'es') {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const out = []
  for (const cat of COMPOUND_CATEGORIES) {
    for (const item of cat.items) {
      const def = (item[lang] ?? item.es).toLowerCase()
      if (item.compound.toLowerCase().includes(q) || def.includes(q)) {
        out.push({ ...item, category: cat.id })
      }
    }
  }
  return out
}
