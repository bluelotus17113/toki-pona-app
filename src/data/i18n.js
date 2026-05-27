// Sistema i18n centralizado: cadenas UI bilingües (es/en), hook de idioma,
// helpers para traducir y persistencia en localStorage.

import { useEffect, useState, useCallback } from 'react'
import { unlock } from '../hooks/useAchievements.js'

export const LANGS = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' }
]

const LANG_KEY = 'tokipona.lang'

export function getInitialLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY)
    if (saved === 'es' || saved === 'en') return saved
  } catch {}
  return 'es'
}

// Hook global con setLang persistente; usar al nivel raíz y propagar como prop o context.
export function useLang() {
  const [lang, setLangState] = useState(getInitialLang)
  const setLang = useCallback((next) => {
    setLangState(prev => {
      if (prev !== next) unlock('lang-changed')
      return next
    })
    try { localStorage.setItem(LANG_KEY, next) } catch {}
  }, [])
  return { lang, setLang }
}

// =========== UI strings ===========
export const STRINGS = {
  // home
  appSubtitle:      { es: 'aprende la lengua del bien',          en: 'learn the language of good' },
  xp:               { es: 'xp',                                   en: 'xp' },
  lessons:          { es: 'lecciones',                            en: 'lessons' },
  hearts:           { es: 'vidas',                                en: 'hearts' },
  practice:         { es: 'práctica',                             en: 'practice' },
  practiceSub:      { es: '{n} ejercicios al azar',               en: '{n} random exercises' },
  practiceLocked:   { es: 'completá 1 lección para desbloquear',  en: 'complete 1 lesson to unlock' },
  dictionary:       { es: 'diccionario',                          en: 'dictionary' },
  dictionarySub:    { es: '{n} palabras con audio',               en: '{n} words with audio' },
  grammar:          { es: 'gramática',                            en: 'grammar' },
  grammarSub:       { es: 'aprende la estructura',                en: 'learn the structure' },
  nimiTu:           { es: 'nimi tu',                              en: 'nimi tu' },
  nimiTuSub:        { es: 'combina 2 palabras',                   en: 'combine 2 words' },
  sitelenPona:      { es: 'sitelen pona',                         en: 'sitelen pona' },
  sitelenPonaSub2:  { es: 'escribe con glifos',                   en: 'write with glyphs' },
  sitelenPonaTitle: { es: 'sitelen pona — escritura',             en: 'sitelen pona — writing' },
  sitelenPonaSub:   { es: 'toca palabras → ves los glifos',       en: 'tap words → see the glyphs' },
  sitelenPlaceholder: { es: 'toca palabras abajo para construir...', en: 'tap words below to build...' },
  backspace:        { es: 'borrar última',                        en: 'delete last' },
  clear:            { es: 'limpiar',                              en: 'clear' },
  sitelenMcPrompt:  { es: '¿qué significa este glifo?',           en: 'what does this glyph mean?' },
  sitelenPairPrompt:{ es: 'empareja cada glifo con su palabra',   en: 'match each glyph with its word' },
  iloSitelen:       { es: 'ilo sitelen',                          en: 'ilo sitelen' },
  iloSitelenSub:    { es: 'lienzo creativo',                      en: 'creative canvas' },
  iloSitelenTitle:  { es: 'ilo sitelen — lienzo',                 en: 'ilo sitelen — canvas' },
  iloSitelenHint:   { es: 'toca glifos abajo para añadirlos al lienzo · arrastra · pellizca para tamaño · toca para color', en: 'tap glyphs below to add to canvas · drag · pinch to resize · tap to color' },
  color:            { es: 'color',                                en: 'color' },
  delete:           { es: 'eliminar',                             en: 'delete' },
  save:             { es: 'guardar',                              en: 'save' },
  hidePalette:      { es: 'ocultar paleta',                       en: 'hide palette' },
  showPalette:      { es: 'mostrar paleta',                       en: 'show palette' },
  fontLoading:      { es: 'cargando glifos...',                   en: 'loading glyphs...' },
  canvasEmpty:      { es: 'el lienzo está vacío',                 en: 'canvas is empty' },
  savedTo:          { es: 'guardado en {path}',                   en: 'saved to {path}' },
  saveFailed:       { es: 'no se pudo guardar',                   en: 'could not save' },
  confirmClearCanvas: { es: '¿borrar todo el lienzo?',            en: 'clear the entire canvas?' },
  achievementsTitle:  { es: 'logros',                             en: 'achievements' },
  achievementsUnlocked: { es: 'desbloqueados',                    en: 'unlocked' },
  achievementsLocked: { es: 'bloqueados',                         en: 'locked' },
  achievementsEmpty:  { es: 'no hay logros en este filtro',       en: 'no achievements in this filter' },
  checkpointReached:  { es: '¡parte completada!',                 en: 'part complete!' },
  checkpointPending:  { es: 'meta de la parte',                   en: 'part goal' },

  // mani + cuentos
  mani:               { es: 'mani',                               en: 'mani' },
  cuentosTitle:       { es: 'cuentos',                            en: 'stories' },
  cuentosCtaSub:      { es: 'leé historias en toki pona',         en: 'read stories in toki pona' },
  cuentosShop:        { es: 'tienda',                             en: 'shop' },
  cuentosLibrary:     { es: 'biblioteca',                         en: 'library' },
  storiesLength_short:  { es: 'cuentos cortos',                   en: 'short stories' },
  storiesLength_medium: { es: 'cuentos medianos',                 en: 'medium stories' },
  storiesLength_long:   { es: 'cuentos largos',                   en: 'long stories' },
  storyUnlockAt:      { es: 'completá {n} lecciones',             en: 'complete {n} lessons' },
  storyAvailable:     { es: 'disponibles',                        en: 'available' },
  storyRead:          { es: 'leer',                               en: 'read' },
  sentences:          { es: 'oraciones',                          en: 'sentences' },
  libraryEmpty:       { es: 'todavía no tenés cuentos. visitá la tienda para comprar tu primero.', en: 'no stories yet. visit the shop to buy your first one.' },
  storyFinishedTitle: { es: '¡cuento terminado!',                 en: 'story finished!' },
  listen:             { es: 'escuchar',                           en: 'listen' },
  translation:        { es: 'traducción',                         en: 'translation' },
  prev:               { es: 'anterior',                           en: 'previous' },
  next:               { es: 'siguiente',                          en: 'next' },
  finish:             { es: 'terminar',                           en: 'finish' },

  // Word of the Day
  wodLabel:           { es: 'palabra del día',                    en: 'word of the day' },
  wodTitle:           { es: 'tocá para escuchar',                 en: 'tap to hear' },

  // kama sona (memory game)
  kamaSonaTitle:      { es: 'kama sona',                          en: 'kama sona' },
  kamaSonaSub:        { es: 'memoria — empareja glifo y significado', en: 'memory — match glyph and meaning' },
  kamaSonaCtaSub:     { es: 'minijuego de memoria · ganá mani',   en: 'memory minigame · earn mani' },
  kamaSonaIntro:      { es: 'voltea dos cartas. si el glifo y el significado coinciden, las quedás. ¿podés con todas?', en: 'flip two cards. if the glyph and meaning match, you keep them. can you clear them all?' },
  kamaSonaEasy:       { es: 'fácil',                              en: 'easy' },
  kamaSonaMedium:     { es: 'medio',                              en: 'medium' },
  kamaSonaHard:       { es: 'difícil',                            en: 'hard' },
  kamaSonaPairs:      { es: '{n} parejas',                        en: '{n} pairs' },
  kamaSonaAttempts:   { es: 'intentos',                           en: 'attempts' },
  kamaSonaMistakes:   { es: 'errores',                            en: 'mistakes' },
  kamaSonaTime:       { es: 'tiempo',                             en: 'time' },
  kamaSonaWinTitle:   { es: '¡ganaste!',                          en: 'you won!' },
  kamaSonaPerfect:    { es: '· ¡perfecto! +bonus',                en: '· perfect! +bonus' },
  kamaSonaAgain:      { es: 'otra ronda',                         en: 'play again' },
  kamaSonaChangeLevel:{ es: 'cambiar nivel',                      en: 'change level' },
  kamaSonaNoProgress: { es: 'usamos palabras de muestra. completá lecciones para que aparezcan las tuyas.', en: 'using sample words. complete lessons to play with yours.' },
  kamaSonaUsesWords:  { es: 'usa palabras de tus {n} lecciones completadas', en: 'uses words from your {n} completed lessons' },

  // lipu pakala (frase rota)
  lipuPakalaTitle:    { es: 'lipu pakala',                        en: 'lipu pakala' },
  lipuPakalaSub:      { es: 'frases rotas — ordena las palabras', en: 'broken sentences — order the words' },
  lipuPakalaCtaSub:   { es: 'arma frases · refuerza la sintaxis', en: 'build sentences · master syntax' },
  lipuPakalaIntro:    { es: 'vas a ver una traducción y palabras desordenadas. ordenálas para armar la frase en toki pona.', en: "you'll see a translation and shuffled words. arrange them to form the toki pona sentence." },
  lipuPakalaRule1:    { es: '5 frases por ronda',                 en: '5 sentences per round' },
  lipuPakalaRule2:    { es: 'cronómetro al final · sin penalizar errores', en: 'timer at the end · no penalty for mistakes' },
  lipuPakalaRule3:    { es: '+2 mani por acierto · bonus si perfecto', en: '+2 mani per hit · bonus if perfect' },
  lipuPakalaStart:    { es: 'empezar →',                          en: 'start →' },
  lipuPakalaNoProgress:{ es: 'usamos frases de muestra. completá lecciones para que aparezcan las tuyas.', en: 'using sample sentences. complete lessons to play with yours.' },
  lipuPakalaUsesPhrases:{ es: 'usa frases de tus {n} lecciones completadas', en: 'uses sentences from your {n} completed lessons' },
  lipuPakalaResultTitle:{ es: '¡ronda terminada!',                en: 'round finished!' },
  lipuPakalaAccuracy: { es: 'aciertos',                           en: 'accuracy' },
  lipuPakalaPerfect:  { es: ' · ¡pleno! +5 bonus',                en: ' · perfect! +5 bonus' },
  lipuPakalaAgain:    { es: 'otra ronda',                         en: 'play again' },
  lipuPakalaBack:     { es: 'volver',                             en: 'back' },

  // kulupu (comunidad)
  kulupuTitle:        { es: 'kulupu',                             en: 'kulupu' },
  kulupuSub:          { es: 'la comunidad real de toki pona',     en: 'the real toki pona community' },
  kulupuBanner:       { es: 'esta app es solo el comienzo. la verdadera comunidad vive en estos espacios — gente fluida, recursos, eventos y amigos que te esperan.', en: 'this app is just the start. the real community lives in these spaces — fluent people, resources, events and friends waiting for you.' },
  kulupuFootnote:     { es: 'los enlaces se abren en tu navegador. nada se guarda en servidores nuestros.', en: 'links open in your browser. nothing is stored on our servers.' },

  // lesson intro (vista previa de palabras)
  lessonIntroTitle:   { es: 'palabras nuevas',                    en: 'new words' },
  lessonIntroSub:     { es: 'mirá las palabras de esta lección antes de practicar', en: 'review the words of this lesson before practicing' },
  lessonIntroStart:   { es: 'empezar →',                          en: 'start →' },
  lessonIntroWordCount: { es: '{n} palabras',                     en: '{n} words' },

  // Historia
  historiaTitle:      { es: 'historia',                           en: 'history' },
  historiaSub:        { es: 'el origen y la filosofía de toki pona', en: 'the origin and philosophy of toki pona' },
  historiaIntro:      { es: 'el lenguaje del bien — la historia detrás del idioma que estás aprendiendo', en: 'the language of good — the story behind the language you are learning' },
  historiaQuoteSub:   { es: 'el lema de la comunidad',            en: 'the community motto' },

  // atlas
  atlasTitle:         { es: 'atlas',                              en: 'atlas' },
  atlasSimple:        { es: 'simples',                            en: 'simple' },
  atlasCompounds:     { es: 'compuestos',                         en: 'compounds' },
  compoundsLabel:     { es: 'compuestos',                         en: 'compounds' },
  compoundLabel:      { es: 'compuesto',                          en: 'compound' },
  searchResults:      { es: 'resultados',                         en: 'results' },

  // templates ilo sitelen
  templates:          { es: 'plantillas',                         en: 'templates' },
  templatesTitle:     { es: 'plantillas',                         en: 'templates' },
  templatesSub:       { es: 'tocá una para cargarla al lienzo (reemplaza lo que haya)', en: 'tap one to load it onto the canvas (replaces current)' },
  confirmLoadTemplate:{ es: '¿reemplazar el lienzo actual con esta plantilla?', en: 'replace current canvas with this template?' },
  nimiTuTitle:      { es: 'combina palabras',                     en: 'combine words' },
  nimiTuComplete:   { es: '¡minijuego completado!',               en: 'minigame complete!' },
  nimiTuQuote:      { es: 'dos palabras crean una nueva',         en: 'two words create a new one' },
  exitMinigameConfirm: { es: '¿salir del minijuego?',             en: 'exit the minigame?' },
  correctAnswers:   { es: 'aciertos',                             en: 'correct' },
  wrong:            { es: 'casi...',                              en: 'almost...' },
  correctAnswerIs:  { es: 'la respuesta era',                     en: 'the answer was' },
  partN:            { es: 'parte {n}',                            en: 'part {n}' },
  resetProgress:    { es: '↻ reiniciar progreso',                 en: '↻ reset progress' },
  confirmReset:     { es: '¿Borrar todo el progreso?',            en: 'Delete all progress?' },
  footnote:         { es: 'hecho con cariño — toki pona li pona a!', en: 'made with love — toki pona li pona a!' },

  // hearts
  nextHeartIn:      { es: 'próxima vida en',                      en: 'next heart in' },
  heartsMax:        { es: 'vidas al máximo',                      en: 'hearts at max' },

  // lesson / practice
  exitConfirm:      { es: '¿salir? perderás el progreso de esta lección', en: 'exit? you will lose progress in this lesson' },
  exitPracticeConfirm: { es: '¿salir de la práctica?',            en: 'exit practice?' },
  lessonNotFound:   { es: 'lección no encontrada',                en: 'lesson not found' },
  practiceLabel:    { es: 'práctica aleatoria',                   en: 'random practice' },
  practiceProgress: { es: '{i} / {n}',                            en: '{i} / {n}' },
  practiceEmpty:    { es: 'aún no hay nada que repasar',          en: 'nothing to review yet' },
  practiceEmptyDesc:{ es: 'completá al menos una lección y volvé aquí para repasar.', en: 'complete at least one lesson and come back to review.' },

  // exercises
  mcMeaning:        { es: '¿qué significa "{word}"?',             en: 'what does "{word}" mean?' },
  mcSayInTP:        { es: '¿cómo se dice "{word}" en toki pona?', en: 'how do you say "{word}" in toki pona?' },
  listenPrompt:     { es: 'escucha y elige la palabra',           en: 'listen and pick the word' },
  matchPrompt:      { es: 'empareja las palabras con su significado', en: 'match the words with their meaning' },
  translatePrompt:  { es: 'traduce: "{text}"',                    en: 'translate: "{text}"' },
  tapToRepeat:      { es: 'toca para repetir',                    en: 'tap to repeat' },
  playing:          { es: 'sonando...',                           en: 'playing...' },
  placeholder:      { es: 'toca palabras abajo para construir la frase', en: 'tap words below to build the sentence' },
  check:            { es: 'comprobar',                            en: 'check' },
  correct:          { es: '¡bien!',                               en: 'correct!' },
  answerIs:         { es: 'respuesta: {answer}',                  en: 'answer: {answer}' },

  // complete
  lessonComplete:   { es: '¡lección completada!',                 en: 'lesson completed!' },
  practiceComplete: { es: '¡práctica completada!',                en: 'practice completed!' },
  scoreHits:        { es: '{c} / {t} aciertos',                   en: '{c} / {t} correct' },
  words:            { es: 'palabras',                             en: 'words' },
  accuracy:         { es: 'aciertos',                             en: 'accuracy' },
  continue:         { es: 'continuar →',                          en: 'continue →' },
  practiceQuote:    { es: 'el saber viene de mucha práctica',     en: 'knowledge comes from much practice' },

  // dictionary
  searchPlaceholder:{ es: 'buscar en toki pona o español...',     en: 'search in toki pona or english...' },
  noResults:        { es: 'sin resultados para "{q}"',            en: 'no results for "{q}"' },
  example:          { es: 'ejemplo:',                             en: 'example:' },
  filterAll:        { es: 'todas',                                en: 'all' },

  // word types
  typeNoun:         { es: 'sustantivo',     en: 'noun' },
  typeVerb:         { es: 'verbo',          en: 'verb' },
  typeModifier:     { es: 'modificador',    en: 'modifier' },
  typeParticle:     { es: 'partícula',      en: 'particle' },
  typePronoun:      { es: 'pronombre',      en: 'pronoun' },
  typePreposition:  { es: 'preposición',    en: 'preposition' },
  typeInterjection: { es: 'interjección',   en: 'interjection' },
  typeNumber:       { es: 'número',         en: 'number' },

  // grammar
  grammarTitle:     { es: 'gramática de toki pona',               en: 'toki pona grammar' },
  grammarIntro:     { es: 'toki pona tiene una gramática asombrosamente simple. Casi todo se construye con un puñado de partículas y un orden fijo. Esto es todo lo que necesitas saber.', en: 'toki pona has a strikingly simple grammar. Almost everything is built from a handful of particles and a fixed word order. This is all you need to know.' },

  // ads
  adRefillTitle:    { es: 'ver anuncio',                          en: 'watch ad' },
  adRefillSub:      { es: 'recibe +1 vida',                       en: 'get +1 heart' },
  adWebNote:        { es: 'simulado en web · real en el APK',     en: 'simulated on web · real in APK' },
  adLoading:        { es: 'cargando anuncio...',                  en: 'loading ad...' },
  adFailed:         { es: 'anuncio no disponible',                en: 'ad unavailable' },

  // no hearts
  noHeartsTitle:    { es: 'te quedaste sin vidas',                en: 'you ran out of hearts' },
  noHeartsSub:      { es: 'mira un anuncio para recuperar una vida, o espera a que se regenere.', en: 'watch an ad to refill a heart, or wait for one to regenerate.' },
  watchAdForHeart:  { es: 'ver anuncio · +1 ❤️',                 en: 'watch ad · +1 ❤️' },
  waitInstead:      { es: 'esperar',                              en: 'wait' },
  outOfHeartsExiting: { es: 'saliendo de la lección...',          en: 'exiting the lesson...' },

  // ko-fi
  kofiSupport:      { es: 'apoyame',                              en: 'support me' },
  kofiModalTitle:   { es: 'invitame un café',                     en: 'buy me a coffee' },
  kofiModalSub:     { es: 'apoyá el desarrollo de la app',        en: 'support the app development' },

  // sound
  soundOn:          { es: 'sonido activado',                      en: 'sound on' },
  soundOff:         { es: 'sonido silenciado',                    en: 'sound off' },

  // feedback
  sendFeedback:     { es: 'enviar feedback',                      en: 'send feedback' },
  feedbackTitle:    { es: 'tu feedback me ayuda',                 en: 'your feedback helps' },
  feedbackSub:      { es: 'contame qué te gusta, qué cambiarías o qué bug encontraste', en: 'tell me what you like, what you would change, or what bug you found' },
  feedbackPlaceholder: { es: 'escribe aquí...',                   en: 'write here...' },
  feedbackSend:     { es: 'enviar',                               en: 'send' },
  cancel:           { es: 'cancelar',                             en: 'cancel' },
  feedbackNote:     { es: 'se abrirá tu app de email con el mensaje pre-llenado.', en: 'your email app will open with the message pre-filled.' },
  feedbackType_bug: { es: '🐛 bug',                               en: '🐛 bug' },
  feedbackType_idea:{ es: '💡 idea',                              en: '💡 idea' },
  feedbackType_love:{ es: '💖 amor',                              en: '💖 love' },
  feedbackType_other:{ es: '✨ otro',                             en: '✨ other' }
}

// Etiquetas de tipo gramatical (key -> traducción)
export const TYPE_LABELS = {
  noun:         { es: 'sustantivo',   en: 'noun' },
  verb:         { es: 'verbo',        en: 'verb' },
  modifier:     { es: 'modificador',  en: 'modifier' },
  particle:     { es: 'partícula',    en: 'particle' },
  pronoun:      { es: 'pronombre',    en: 'pronoun' },
  preposition:  { es: 'preposición',  en: 'preposition' },
  interjection: { es: 'interjección', en: 'interjection' },
  number:       { es: 'número',       en: 'number' }
}

// =========== helpers de traducción ===========
function interpolate(str, args) {
  if (!args) return str
  return str.replace(/\{(\w+)\}/g, (_, k) => args[k] ?? `{${k}}`)
}

// Devuelve la cadena UI traducida con interpolación opcional
export function tr(key, lang, args) {
  const entry = STRINGS[key]
  if (!entry) return key
  const raw = entry[lang] ?? entry.es ?? key
  return interpolate(raw, args)
}

// Crea una función t() ligada al idioma actual
export function makeT(lang) {
  return (key, args) => tr(key, lang, args)
}

// Selecciona el campo correcto de un objeto bilingüe (con fallback a es)
// item puede tener fields .es / .en (para phrases) o usa una propiedad genérica
export function pick(item, lang, key = null) {
  if (key) return item[`${key}_${lang}`] ?? item[`${key}_es`] ?? item[key]
  return item[lang] ?? item.es
}
