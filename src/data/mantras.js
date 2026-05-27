// 30 mantras / frases meditativas de toki pona.
// Cada una compacta una idea contemplativa. Rotación determinística por fecha.

export const MANTRAS = [
  { tp: 'ale li pona',              es: 'todo está bien',                en: 'all is well' },
  { tp: 'kon mi li pona',           es: 'mi espíritu está en paz',       en: 'my spirit is at peace' },
  { tp: 'mi awen lon tenpo ni',     es: 'estoy presente en este momento', en: 'I am present in this moment' },
  { tp: 'mi pilin pona',            es: 'me siento bien',                en: 'I feel good' },
  { tp: 'nasin mi li pona',         es: 'mi camino es bueno',            en: 'my way is good' },
  { tp: 'tenpo ni la mi lon',       es: 'en este momento, existo',       en: 'in this moment, I am' },
  { tp: 'mi olin e mi',             es: 'me amo',                        en: 'I love myself' },
  { tp: 'mi sona ala — mi pona',    es: 'no sé — estoy en paz',          en: "I don't know — I am at peace" },
  { tp: 'ale li ante',              es: 'todo cambia',                   en: 'all changes' },
  { tp: 'kon li tawa',              es: 'el aliento fluye',              en: 'breath flows' },
  { tp: 'mi awen',                  es: 'persisto',                      en: 'I endure' },
  { tp: 'pona li lon',              es: 'el bien existe',                en: 'good exists' },
  { tp: 'mi en ale li wan',         es: 'yo y todo somos uno',           en: 'I and all are one' },
  { tp: 'mi pilin e kon',           es: 'siento el aliento',             en: 'I feel the breath' },
  { tp: 'tenpo li tawa',            es: 'el tiempo fluye',               en: 'time flows' },
  { tp: 'sijelo mi li pona',        es: 'mi cuerpo está bien',           en: 'my body is well' },
  { tp: 'mi ken awen',              es: 'puedo descansar',               en: 'I can rest' },
  { tp: 'pilin ike li tawa weka',   es: 'el mal sentir se va',           en: 'bad feelings go away' },
  { tp: 'mi jo e tenpo',            es: 'tengo tiempo',                  en: 'I have time' },
  { tp: 'mi pana e olin',           es: 'doy amor',                      en: 'I give love' },
  { tp: 'lawa mi li pona',          es: 'mi mente está en paz',          en: 'my mind is at peace' },
  { tp: 'ni li tenpo mi',           es: 'este es mi momento',            en: 'this is my time' },
  { tp: 'kon pona li lon mi',       es: 'el buen espíritu está en mí',   en: 'good spirit is in me' },
  { tp: 'mi alasa ala',             es: 'no busco nada',                 en: 'I seek nothing' },
  { tp: 'mi lon — ni li mute',      es: 'existo — eso es suficiente',    en: 'I am — that is enough' },
  { tp: 'pona tawa sina',           es: 'paz para vos',                  en: 'peace to you' },
  { tp: 'mi kute e kon',            es: 'escucho el aliento',            en: 'I listen to the breath' },
  { tp: 'mi pini e pilin ike',      es: 'termino con el mal sentir',     en: 'I end the bad feeling' },
  { tp: 'mi pilin e ma',            es: 'siento la tierra',              en: 'I feel the earth' },
  { tp: 'tenpo suno ni la mi pona', es: 'hoy estoy en paz',              en: 'today I am at peace' }
]

function fnv1a(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h >>> 0
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Mantra del día — determinístico, mismo todo el día, cambia a medianoche.
export function getMantraOfTheDay() {
  const idx = fnv1a(`mantra-${todayKey()}`) % MANTRAS.length
  return MANTRAS[idx]
}

// Fases del box breathing con su frase TP correspondiente.
export const BREATH_PHASES = [
  { id: 'in',    seconds: 4, tp: 'mi kama jo e kon pona', es: 'recibo buen aire',  en: 'I receive good air' },
  { id: 'hold1', seconds: 4, tp: 'mi awen',                es: 'me quedo',          en: 'I stay' },
  { id: 'out',   seconds: 4, tp: 'mi weka e ike',          es: 'suelto lo malo',    en: 'I release the bad' },
  { id: 'hold2', seconds: 4, tp: 'mi pona',                es: 'estoy en paz',      en: 'I am at peace' }
]

export const BREATH_CYCLE_SECONDS = BREATH_PHASES.reduce((s, p) => s + p.seconds, 0) // 16
