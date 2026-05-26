// Contenido de la sección Gramática — bilingüe (es/en)
// Cada tópico: { id, icon, title_es, title_en, body_es, body_en, examples: [{ tp, es, en }] }
// El body usa Markdown-lite muy simple: doble salto de línea = nuevo párrafo.

export const GRAMMAR_TOPICS = [
  {
    id: 'overview',
    icon: '✨',
    title_es: 'Visión general',
    title_en: 'Overview',
    body_es: `toki pona tiene unas 120 palabras y una gramática casi sin reglas.
Casi todo se construye con un puñado de **partículas** (li, e, la, pi, o, en, anu) y un **orden fijo** de palabras.
No hay género, número, ni conjugación verbal: una palabra puede ser sustantivo, verbo o adjetivo según donde la pongas.`,
    body_en: `toki pona has about 120 words and almost no grammar rules.
Almost everything is built from a handful of **particles** (li, e, la, pi, o, en, anu) and a **fixed word order**.
There is no gender, no plural, no verb conjugation: one word can be a noun, verb, or adjective depending on where you place it.`,
    examples: []
  },
  {
    id: 'basic-sentence',
    icon: '🧱',
    title_es: 'Estructura básica: sujeto · li · predicado',
    title_en: 'Basic structure: subject · li · predicate',
    body_es: `La oración más simple en toki pona es:

\`SUJETO + li + PREDICADO\`

\`li\` separa el sujeto del predicado. **Excepción**: cuando el sujeto es \`mi\` o \`sina\` solos, \`li\` se omite.`,
    body_en: `The simplest toki pona sentence is:

\`SUBJECT + li + PREDICATE\`

\`li\` separates the subject from the predicate. **Exception**: when the subject is \`mi\` or \`sina\` alone, \`li\` is dropped.`,
    examples: [
      { tp: 'ona li pona',  es: 'él/ella está bien',  en: 'they are well' },
      { tp: 'jan li suli',  es: 'la persona es grande', en: 'the person is big' },
      { tp: 'mi pona',      es: 'yo estoy bien (sin li)', en: 'I am well (no li)' },
      { tp: 'sina ike',     es: 'tú estás mal (sin li)', en: 'you are bad (no li)' }
    ]
  },
  {
    id: 'particle-e',
    icon: '🎯',
    title_es: 'Partícula e: objeto directo',
    title_en: 'Particle e: direct object',
    body_es: `Para añadir un objeto directo (lo que recibe la acción del verbo), se usa la partícula \`e\`:

\`SUJETO + li + VERBO + e + OBJETO\``,
    body_en: `To add a direct object (the thing receiving the verb's action), use the particle \`e\`:

\`SUBJECT + li + VERB + e + OBJECT\``,
    examples: [
      { tp: 'mi moku e kili',      es: 'yo como fruta',            en: 'I eat fruit' },
      { tp: 'sina lukin e mi',     es: 'tú me ves',                en: 'you see me' },
      { tp: 'ona li pana e mani',  es: 'él/ella da dinero',        en: 'they give money' }
    ]
  },
  {
    id: 'modifiers',
    icon: '🎨',
    title_es: 'Modificadores: adjetivos y adverbios',
    title_en: 'Modifiers: adjectives and adverbs',
    body_es: `Los modificadores van **después** de la palabra que modifican:

\`jan pona\` = persona buena = amigo
\`tomo lili\` = casa pequeña

Puedes encadenar varios modificadores; se aplican de izquierda a derecha:
\`jan pona suli\` = "amigo grande" (no "persona buenagrande").`,
    body_en: `Modifiers come **after** the word they modify:

\`jan pona\` = good person = friend
\`tomo lili\` = small house

You can chain multiple modifiers; they apply left-to-right:
\`jan pona suli\` = "big friend" (not "big good person").`,
    examples: [
      { tp: 'kili suwi',      es: 'fruta dulce',         en: 'sweet fruit' },
      { tp: 'tomo mi',        es: 'mi casa',             en: 'my house' },
      { tp: 'jan pona mute',  es: 'muchos amigos',       en: 'many friends' },
      { tp: 'meli sin pona',  es: 'mujer nueva buena',   en: 'good new woman' }
    ]
  },
  {
    id: 'particle-pi',
    icon: '🔗',
    title_es: 'Partícula pi: reagrupar modificadores',
    title_en: 'Particle pi: regrouping modifiers',
    body_es: `\`pi\` "agrupa" dos o más palabras como una sola unidad modificadora. Cambia el significado.

Sin pi: \`tomo telo nasa\` = "casa-agua rara" (un baño raro)
Con pi: \`tomo pi telo nasa\` = "casa de agua rara" (una casa de bebida alcohólica = un bar)

Usa \`pi\` cuando quieres que el segundo modificador se aplique al primer modificador, no al sustantivo.`,
    body_en: `\`pi\` "groups" two or more words as one modifying unit. It changes the meaning.

Without pi: \`tomo telo nasa\` = "weird water-house" (a weird bathroom)
With pi: \`tomo pi telo nasa\` = "house of weird water" (a house of strange drink = a bar)

Use \`pi\` when you want the second modifier to apply to the first modifier, not to the noun.`,
    examples: [
      { tp: 'jan pi ma mi',           es: 'persona de mi país',           en: 'person of my country' },
      { tp: 'tomo pi telo nasa',      es: 'bar (casa de bebida loca)',    en: 'bar (house of strange drink)' },
      { tp: 'kalama pi musi pona',    es: 'sonido de buena música',       en: 'sound of good music' }
    ]
  },
  {
    id: 'particle-la',
    icon: '🌗',
    title_es: 'Partícula la: contexto y condición',
    title_en: 'Particle la: context and condition',
    body_es: `\`la\` introduce el contexto, condición o tiempo de la oración principal.

\`CONTEXTO + la + ORACIÓN PRINCIPAL\`

Se traduce como "cuando", "si", "en (este contexto)", etc.`,
    body_en: `\`la\` introduces the context, condition, or time for the main clause.

\`CONTEXT + la + MAIN CLAUSE\`

Translated as "when", "if", "in (this context)", etc.`,
    examples: [
      { tp: 'tenpo ni la mi pona',     es: 'ahora estoy bien',                  en: 'right now I am well' },
      { tp: 'sina kama la mi musi',    es: 'cuando vienes, me divierto',        en: 'when you come, I have fun' },
      { tp: 'suno la mi pali',         es: 'durante el día trabajo',            en: 'during the day I work' },
      { tp: 'sina wile la o toki',     es: 'si quieres, habla',                 en: 'if you want, speak' }
    ]
  },
  {
    id: 'particle-o',
    icon: '📢',
    title_es: 'Partícula o: imperativo y vocativo',
    title_en: 'Particle o: imperative and vocative',
    body_es: `\`o\` tiene dos usos:

1. **Imperativo** (dar una orden): \`o + verbo\`
2. **Vocativo** (llamar a alguien): \`nombre + o\``,
    body_en: `\`o\` has two uses:

1. **Imperative** (command): \`o + verb\`
2. **Vocative** (calling someone): \`name + o\``,
    examples: [
      { tp: 'o kute!',                 es: '¡escucha!',                          en: 'listen!' },
      { tp: 'o moku',                  es: 'come',                               en: 'eat' },
      { tp: 'jan o, kama!',            es: '¡persona, ven!',                     en: 'person, come!' },
      { tp: 'mama o, mi olin e sina',  es: 'mamá, te quiero',                    en: 'mom, I love you' }
    ]
  },
  {
    id: 'questions',
    icon: '❓',
    title_es: 'Preguntas',
    title_en: 'Questions',
    body_es: `Hay tres maneras de preguntar:

1. **Sí/no**: repetir el verbo + \`ala\` + verbo: "\`sina pona ala pona?\`" (¿estás bien o no?)
2. **A o B**: usar \`anu\`: "\`sina pona anu ike?\`" (¿bien o mal?)
3. **Qué/cuál**: sustituir lo desconocido por \`seme\`: "\`ni li seme?\`" (¿esto es qué?)`,
    body_en: `Three ways to ask questions:

1. **Yes/no**: repeat the verb + \`ala\` + verb: "\`sina pona ala pona?\`" (are you well or not?)
2. **A or B**: use \`anu\`: "\`sina pona anu ike?\`" (well or bad?)
3. **What/which**: replace the unknown with \`seme\`: "\`ni li seme?\`" (this is what?)`,
    examples: [
      { tp: 'sina moku ala moku?',     es: '¿comes o no?',                      en: 'do you eat or not?' },
      { tp: 'ni li kili anu pan?',     es: '¿esto es fruta o pan?',             en: 'is this fruit or bread?' },
      { tp: 'nimi sina li seme?',      es: '¿cómo te llamas?',                  en: 'what is your name?' },
      { tp: 'sina tawa ma seme?',      es: '¿a qué país vas?',                  en: 'what country do you go to?' }
    ]
  },
  {
    id: 'negation',
    icon: '🚫',
    title_es: 'Negación con ala',
    title_en: 'Negation with ala',
    body_es: `Para negar, pon \`ala\` **después** de la palabra que niega:

\`mi sona\` = sé
\`mi sona ala\` = no sé`,
    body_en: `To negate, put \`ala\` **after** the word being negated:

\`mi sona\` = I know
\`mi sona ala\` = I do not know`,
    examples: [
      { tp: 'mi wile ala',             es: 'no quiero',                         en: 'I do not want' },
      { tp: 'ona li pona ala',         es: 'él/ella no está bien',              en: 'they are not well' },
      { tp: 'jan ala li lon tomo',     es: 'no hay nadie en casa',              en: 'no one is in the house' }
    ]
  },
  {
    id: 'prepositions',
    icon: '🧭',
    title_es: 'Preposiciones: lon, tawa, tan, kepeken',
    title_en: 'Prepositions: lon, tawa, tan, kepeken',
    body_es: `Las preposiciones se ponen al final de la oración, después del verbo y el objeto:

- \`lon\` — en, ubicado en
- \`tawa\` — hacia, para
- \`tan\` — desde, por, debido a
- \`kepeken\` — con (usando), mediante
- \`sama\` — como, igual a
- \`poka\` — junto a, con (compañía)`,
    body_en: `Prepositions come at the end of the sentence, after the verb and object:

- \`lon\` — at, located in
- \`tawa\` — towards, for
- \`tan\` — from, because of
- \`kepeken\` — with (using), by means of
- \`sama\` — like, same as
- \`poka\` — beside, with (companion)`,
    examples: [
      { tp: 'mi lon tomo',                  es: 'estoy en casa',                    en: 'I am at home' },
      { tp: 'mi pana e lipu tawa sina',     es: 'te doy el libro',                  en: 'I give the book to you' },
      { tp: 'mi kama tan ma sin',           es: 'vengo de un país nuevo',           en: 'I come from a new country' },
      { tp: 'mi pali kepeken ilo',          es: 'trabajo con una herramienta',      en: 'I work with a tool' },
      { tp: 'mi lon poka sina',             es: 'estoy a tu lado',                  en: 'I am beside you' }
    ]
  },
  {
    id: 'multiple-li',
    icon: '🔁',
    title_es: 'Múltiples predicados con li',
    title_en: 'Multiple predicates with li',
    body_es: `Si una misma cosa hace varias acciones, repites \`li\` antes de cada una:

\`ona li moku li toki\` = él come y habla

Si el verbo tiene varios objetos, repites \`e\` antes de cada uno:

\`mi moku e kili e pan\` = como fruta y pan`,
    body_en: `If one subject does multiple actions, repeat \`li\` before each:

\`ona li moku li toki\` = they eat and speak

If a verb has multiple objects, repeat \`e\` before each:

\`mi moku e kili e pan\` = I eat fruit and bread`,
    examples: [
      { tp: 'mi tawa li lukin e mun',  es: 'voy y miro la luna',                en: 'I go and look at the moon' },
      { tp: 'ona li suli li wawa',     es: 'él/ella es grande y fuerte',        en: 'they are big and strong' },
      { tp: 'mi olin e sina e ma',     es: 'amo a ti y al país',                en: 'I love you and the country' }
    ]
  },
  {
    id: 'numbers',
    icon: '🔢',
    title_es: 'Números',
    title_en: 'Numbers',
    body_es: `toki pona oficialmente sólo tiene tres números: \`wan\` (1), \`tu\` (2), y \`mute\` (mucho). \`ala\` significa cero/nada.

Algunos hablantes amplían con: \`luka\` (5, "mano"), \`mute\` (20), \`ale\` (100).

Para números compuestos, simplemente se suman: \`tu wan\` = 3.`,
    body_en: `toki pona officially has only three numbers: \`wan\` (1), \`tu\` (2), and \`mute\` (many). \`ala\` means zero/none.

Some speakers extend with: \`luka\` (5, "hand"), \`mute\` (20), \`ale\` (100).

For larger numbers, just add: \`tu wan\` = 3.`,
    examples: [
      { tp: 'jan wan',     es: 'una persona',         en: 'one person' },
      { tp: 'jan tu',      es: 'dos personas',        en: 'two persons' },
      { tp: 'jan tu wan',  es: 'tres personas',       en: 'three persons' },
      { tp: 'jan luka',    es: 'cinco personas',      en: 'five persons' },
      { tp: 'jan mute',    es: 'muchas personas',     en: 'many persons' },
      { tp: 'jan ala',     es: 'nadie / cero',        en: 'no one / zero' }
    ]
  }
]
