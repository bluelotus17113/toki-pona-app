// Curso bilingüe (es/en). Cada lección y sección tiene title/desc en ambos idiomas.
// Frases: { tp, es, en }

// Temas visuales por sección: color de acento + emojis decorativos que evocan
// el tema (montañas, restaurante, animales, etc.). Se usan en Home para tematizar
// el "camino" de lecciones.
export const SECTION_THEMES = {
  intro:   { accent: '#c6efd0', deco: ['🌱','🌿','🌾'] },   // pradera tierna
  familia: { accent: '#ffd6e0', deco: ['👨','👩','👶'] },   // gente
  cafe:    { accent: '#ffd6a5', deco: ['☕','🥐','🍰'] },   // cafetería
  viaje:   { accent: '#c7dce8', deco: ['🚗','🗺️','🛣️'] },  // ruta
  cita:    { accent: '#ffb8cd', deco: ['💕','🌹','✨'] },   // romance
  mercado: { accent: '#fde74c', deco: ['🛒','💰','🥖'] },   // mercado
  casa:    { accent: '#ffd6a5', deco: ['🏠','🛏️','🪴'] },   // hogar
  nat:     { accent: '#c6efd0', deco: ['🌳','🏔️','☀️'] },  // naturaleza
  anim:    { accent: '#fde74c', deco: ['🦊','🐦','🐟'] },   // animales
  cuerpo:  { accent: '#ffd6e0', deco: ['❤️','💪','👁️'] },   // cuerpo
  arte:    { accent: '#c7dce8', deco: ['🎨','🖌️','📝'] },   // arte
  tiempo:  { accent: '#fde74c', deco: ['⏰','🌙','☀️'] },   // tiempo
  conv:    { accent: '#ffd6e0', deco: ['💬','🗣️','💭'] },   // habla
  filo:    { accent: '#c6efd0', deco: ['🍃','☯️','🌌'] }    // filosofía
}

export const SECTIONS = [
  { id: 'intro',    icon: '🌱', title_es: 'Introducción',          title_en: 'Introduction',           desc_es: 'Tus primeras palabras en toki pona',          desc_en: 'Your first words in toki pona' },
  { id: 'familia',  icon: '👪', title_es: 'Personas y familia',    title_en: 'People and family',      desc_es: 'Hablar de la gente que te rodea',             desc_en: 'Talking about the people around you' },
  { id: 'cafe',     icon: '☕', title_es: 'En la cafetería',       title_en: 'At the café',            desc_es: 'Pedir comida, bebida y pagar',                desc_en: 'Order food, drinks, and pay' },
  { id: 'viaje',    icon: '🧳', title_es: 'De viaje',              title_en: 'Traveling',              desc_es: 'Direcciones, transporte, lugares',            desc_en: 'Directions, transport, places' },
  { id: 'cita',     icon: '💕', title_es: 'Cita romántica',        title_en: 'Romantic date',          desc_es: 'Cumplidos, invitar, sentimientos',            desc_en: 'Compliments, asking out, feelings' },
  { id: 'mercado',  icon: '🛍️', title_es: 'Mercado y dinero',      title_en: 'Market and money',       desc_es: 'Comprar, vender, cantidades',                 desc_en: 'Buying, selling, quantities' },
  { id: 'casa',     icon: '🏠', title_es: 'Casa y rutina',         title_en: 'Home and routine',       desc_es: 'Vida cotidiana en el hogar',                  desc_en: 'Daily life at home' },
  { id: 'nat',      icon: '🌿', title_es: 'Naturaleza',            title_en: 'Nature',                 desc_es: 'Cielo, tierra, agua, clima',                  desc_en: 'Sky, earth, water, weather' },
  { id: 'anim',     icon: '🐾', title_es: 'Animales',              title_en: 'Animals',                desc_es: 'Mamíferos, aves, peces, insectos',            desc_en: 'Mammals, birds, fish, insects' },
  { id: 'cuerpo',   icon: '🩺', title_es: 'Cuerpo y salud',        title_en: 'Body and health',        desc_es: 'Hablar de cómo te sientes',                   desc_en: 'Talking about how you feel' },
  { id: 'arte',     icon: '🎨', title_es: 'Trabajo y arte',        title_en: 'Work and art',           desc_es: 'Crear, escribir, currar',                     desc_en: 'Create, write, work' },
  { id: 'tiempo',   icon: '⏰', title_es: 'Tiempo y emociones',    title_en: 'Time and emotions',      desc_es: 'Momentos, ayer, sentimientos',                desc_en: 'Moments, yesterday, feelings' },
  { id: 'conv',     icon: '💬', title_es: 'Conversación avanzada', title_en: 'Advanced conversation',  desc_es: 'Partículas pi, kepeken, tan',                 desc_en: 'Particles pi, kepeken, tan' },
  { id: 'filo',     icon: '🍃', title_es: 'Filosofía toki pona',   title_en: 'toki pona philosophy',   desc_es: 'kon, nasin, pona — repaso final',             desc_en: 'kon, nasin, pona — final review' }
]

export const LESSONS = [
  // ============ 1. INTRO ============
  {
    id: 1, section: 'intro',
    title_es: 'Primeros saludos', title_en: 'First greetings',
    desc_es: 'Las primeras palabras que dirás', desc_en: 'Your very first words',
    words: ['toki', 'pona', 'ike', 'a'],
    phrases: [
      { tp: 'toki!',           es: '¡hola!',                en: 'hi!' },
      { tp: 'pona!',           es: '¡bien! / ¡bueno!',      en: 'good!' },
      { tp: 'toki pona a!',    es: '¡qué bonito idioma!',   en: 'what a beautiful language!' },
      { tp: 'ike a!',          es: '¡qué mal!',             en: 'how bad!' }
    ]
  },
  {
    id: 2, section: 'intro',
    title_es: 'Yo, tú, él/ella', title_en: 'I, you, they',
    desc_es: 'Los pronombres en toki pona', desc_en: 'Pronouns in toki pona',
    words: ['mi', 'sina', 'ona', 'en'],
    phrases: [
      { tp: 'mi pona',         es: 'yo estoy bien',         en: 'I am well' },
      { tp: 'sina ike',        es: 'tú estás mal',          en: 'you are bad' },
      { tp: 'ona pona',        es: 'él/ella está bien',     en: 'they are well' },
      { tp: 'mi en sina',      es: 'yo y tú',               en: 'you and I' }
    ]
  },
  {
    id: 3, section: 'intro',
    title_es: 'Partículas li y e', title_en: 'Particles li and e',
    desc_es: 'El esqueleto de toda oración', desc_en: 'The skeleton of every sentence',
    words: ['li', 'e', 'jan', 'moku'],
    phrases: [
      { tp: 'ona li pona',         es: 'él/ella está bien',         en: 'they are well' },
      { tp: 'jan li ike',          es: 'la persona es mala',        en: 'the person is bad' },
      { tp: 'mi moku',             es: 'yo como',                   en: 'I eat' },
      { tp: 'ona li moku e ijo',   es: 'él come algo',              en: 'they eat something' }
    ]
  },
  {
    id: 4, section: 'intro',
    title_es: 'Cómo te llamas', title_en: 'What is your name',
    desc_es: 'Presentarte en toki pona', desc_en: 'Introducing yourself',
    words: ['nimi', 'sina', 'mi', 'seme', 'ni'],
    phrases: [
      { tp: 'nimi mi li Maria',    es: 'me llamo María',            en: 'my name is Maria' },
      { tp: 'nimi sina li seme?',  es: '¿cómo te llamas?',          en: 'what is your name?' },
      { tp: 'ni li nimi mi',       es: 'este es mi nombre',         en: 'this is my name' },
      { tp: 'toki, nimi mi li ...',es: 'hola, me llamo...',         en: 'hi, my name is...' }
    ]
  },

  // ============ 2. FAMILIA ============
  {
    id: 5, section: 'familia',
    title_es: 'La familia', title_en: 'Family',
    desc_es: 'Madre, padre, hijos, hermanos', desc_en: 'Mother, father, children, siblings',
    words: ['mama', 'meli', 'mije', 'jan', 'lili'],
    phrases: [
      { tp: 'mama mi',                  es: 'mi madre/padre',                en: 'my parent' },
      { tp: 'jan lili mi',              es: 'mi hijo/a',                     en: 'my child' },
      { tp: 'meli li mama mi',          es: 'la mujer es mi madre',          en: 'the woman is my mother' },
      { tp: 'mije ni li mama mi',       es: 'este hombre es mi padre',       en: 'this man is my father' }
    ]
  },
  {
    id: 6, section: 'familia',
    title_es: 'Describir personas', title_en: 'Describing people',
    desc_es: 'Cómo es alguien físicamente y de carácter', desc_en: 'What someone looks like and their character',
    words: ['suli', 'lili', 'suwi', 'wawa', 'nasa'],
    phrases: [
      { tp: 'jan suli',                 es: 'persona grande/importante',     en: 'big/important person' },
      { tp: 'jan suwi',                 es: 'persona dulce/linda',           en: 'sweet/cute person' },
      { tp: 'meli wawa',                es: 'mujer fuerte',                  en: 'strong woman' },
      { tp: 'mije nasa',                es: 'hombre raro',                   en: 'weird man' }
    ]
  },
  {
    id: 7, section: 'familia',
    title_es: 'Amigos y comunidad', title_en: 'Friends and community',
    desc_es: 'Tu gente: jan pona, kulupu', desc_en: 'Your people: jan pona, kulupu',
    words: ['kulupu', 'olin', 'pona', 'sama'],
    phrases: [
      { tp: 'jan pona mi',              es: 'mi amigo (mi persona buena)',   en: 'my friend (my good person)' },
      { tp: 'kulupu mi li suli',        es: 'mi grupo es grande',            en: 'my group is big' },
      { tp: 'mi olin e sina',           es: 'te quiero',                     en: 'I love you' },
      { tp: 'jan sama mi',              es: 'mi hermano (persona igual a mí)', en: 'my sibling (person same as me)' }
    ]
  },

  // ============ 3. CAFÉ ============
  {
    id: 8, section: 'cafe',
    title_es: 'Pedir comida', title_en: 'Ordering food',
    desc_es: 'Lo más importante: moku', desc_en: 'The most important: moku',
    words: ['moku', 'wile', 'pan', 'kili'],
    phrases: [
      { tp: 'mi wile e moku',           es: 'quiero comida',                 en: 'I want food' },
      { tp: 'mi wile e pan',            es: 'quiero pan',                    en: 'I want bread' },
      { tp: 'mi wile e kili',           es: 'quiero fruta',                  en: 'I want fruit' },
      { tp: 'mi moku e pan suwi',       es: 'como pan dulce',                en: 'I eat sweet bread' }
    ]
  },
  {
    id: 9, section: 'cafe',
    title_es: 'Bebidas', title_en: 'Drinks',
    desc_es: 'telo: agua, café, té, todo líquido', desc_en: 'telo: water, coffee, tea, any liquid',
    words: ['telo', 'seli', 'lete', 'kili', 'jelo'],
    phrases: [
      { tp: 'mi wile e telo',           es: 'quiero agua',                   en: 'I want water' },
      { tp: 'telo seli',                es: 'bebida caliente (café/té)',     en: 'hot drink (coffee/tea)' },
      { tp: 'telo lete',                es: 'bebida fría',                   en: 'cold drink' },
      { tp: 'telo kili',                es: 'jugo (agua de fruta)',          en: 'juice (fruit water)' }
    ]
  },
  {
    id: 10, section: 'cafe',
    title_es: 'Sabores y opiniones', title_en: 'Tastes and opinions',
    desc_es: 'Decir si está rico, asqueroso, frío', desc_en: 'Saying if something is tasty, gross, cold',
    words: ['suwi', 'jaki', 'pona', 'mute'],
    phrases: [
      { tp: 'moku ni li suwi',          es: 'esta comida está rica',         en: 'this food is tasty' },
      { tp: 'moku ni li jaki',          es: 'esta comida está asquerosa',    en: 'this food is gross' },
      { tp: 'mi pilin pona',            es: 'me siento bien',                en: 'I feel good' },
      { tp: 'mi moku mute',             es: 'como mucho',                    en: 'I eat a lot' }
    ]
  },
  {
    id: 11, section: 'cafe',
    title_es: 'Pagar la cuenta', title_en: 'Paying the bill',
    desc_es: 'mani, pana, kepeken', desc_en: 'mani, pana, kepeken',
    words: ['mani', 'pana', 'kepeken', 'lipu'],
    phrases: [
      { tp: 'mi pana e mani',           es: 'doy dinero (pago)',             en: 'I give money (I pay)' },
      { tp: 'mani mute anu lili?',      es: '¿mucho o poco?',                en: 'a lot or a little?' },
      { tp: 'mi kepeken lipu mani',     es: 'uso tarjeta (papel-dinero)',    en: 'I use a card (money-paper)' },
      { tp: 'mi pana e mani tawa sina', es: 'te pago',                       en: 'I pay you' }
    ]
  },

  // ============ 4. VIAJE ============
  {
    id: 12, section: 'viaje',
    title_es: 'Ir y venir', title_en: 'Go and come',
    desc_es: 'tawa, kama, weka — el movimiento', desc_en: 'tawa, kama, weka — movement',
    words: ['tawa', 'kama', 'weka', 'lon'],
    phrases: [
      { tp: 'mi tawa',                  es: 'me voy',                        en: 'I go / I leave' },
      { tp: 'mi kama',                  es: 'vengo / estoy llegando',        en: 'I come / I arrive' },
      { tp: 'mi tawa weka',             es: 'me voy lejos',                  en: 'I go far away' },
      { tp: 'mi lon ma sin',            es: 'estoy en un sitio nuevo',       en: 'I am in a new place' }
    ]
  },
  {
    id: 13, section: 'viaje',
    title_es: 'Direcciones', title_en: 'Directions',
    desc_es: 'arriba, abajo, al lado, dentro', desc_en: 'up, down, beside, inside',
    words: ['anpa', 'sewi', 'poka', 'monsi', 'sinpin', 'insa'],
    phrases: [
      { tp: 'lon sewi',                 es: 'arriba',                        en: 'above' },
      { tp: 'lon anpa',                 es: 'abajo',                         en: 'below' },
      { tp: 'lon poka mi',              es: 'a mi lado',                     en: 'next to me' },
      { tp: 'tawa sinpin',              es: 'hacia adelante',                en: 'forward' }
    ]
  },
  {
    id: 14, section: 'viaje',
    title_es: 'Países y lugares', title_en: 'Countries and places',
    desc_es: 'ma: tierra, país, región', desc_en: 'ma: land, country, region',
    words: ['ma', 'tomo', 'esun', 'nasin'],
    phrases: [
      { tp: 'ma mi',                    es: 'mi país',                       en: 'my country' },
      { tp: 'tomo telo',                es: 'baño (casa-agua)',              en: 'bathroom (water-house)' },
      { tp: 'ma tomo',                  es: 'ciudad (tierra-casa)',          en: 'city (house-land)' },
      { tp: 'nasin ni li tawa esun',    es: 'este camino lleva al mercado',  en: 'this road leads to the market' }
    ]
  },
  {
    id: 15, section: 'viaje',
    title_es: 'Transporte', title_en: 'Transport',
    desc_es: 'Cómo te mueves: a pie, en coche, en avión', desc_en: 'How you move: walking, car, plane',
    words: ['kepeken', 'ilo', 'noka', 'tawa'],
    phrases: [
      { tp: 'mi tawa kepeken noka',     es: 'voy caminando (con los pies)',  en: 'I go walking (using my feet)' },
      { tp: 'mi tawa kepeken ilo tawa', es: 'voy en coche',                  en: 'I go by car' },
      { tp: 'mi tawa lon waso',         es: 'viajo en avión (en pájaro)',    en: 'I travel by plane (on a bird)' },
      { tp: 'tenpo seme la sina kama?', es: '¿cuándo llegas?',               en: 'when do you arrive?' }
    ]
  },

  // ============ 5. CITA ============
  {
    id: 16, section: 'cita',
    title_es: 'Cumplidos', title_en: 'Compliments',
    desc_es: 'Decir cosas bonitas a alguien', desc_en: 'Saying nice things to someone',
    words: ['suwi', 'pona', 'lukin', 'wawa'],
    phrases: [
      { tp: 'sina suwi',                es: 'eres lindx',                    en: 'you are cute' },
      { tp: 'sina pona lukin',          es: 'te ves bien',                   en: 'you look good' },
      { tp: 'sina wawa',                es: 'eres fuerte',                   en: 'you are strong' },
      { tp: 'sina pona tawa mi',        es: 'eres buenx para mí',            en: 'you are good for me' }
    ]
  },
  {
    id: 17, section: 'cita',
    title_es: 'Invitar a salir', title_en: 'Asking out',
    desc_es: 'Proponer hacer algo juntos', desc_en: 'Proposing to do something together',
    words: ['musi', 'tawa', 'mi', 'wile', 'kama'],
    phrases: [
      { tp: 'sina wile musi?',          es: '¿quieres divertirte?',          en: 'do you want to have fun?' },
      { tp: 'sina ken kama tawa mi?',   es: '¿puedes venir conmigo?',        en: 'can you come with me?' },
      { tp: 'mi wile tawa kepeken sina',es: 'quiero ir contigo',             en: 'I want to go with you' },
      { tp: 'mi en sina la mi musi',    es: 'cuando estoy contigo, me divierto', en: 'when I am with you, I have fun' }
    ]
  },
  {
    id: 18, section: 'cita',
    title_es: 'Emociones del corazón', title_en: 'Heart emotions',
    desc_es: 'pilin, olin: el amor en toki pona', desc_en: 'pilin, olin: love in toki pona',
    words: ['pilin', 'olin', 'suwi', 'sina'],
    phrases: [
      { tp: 'mi olin e sina',           es: 'te amo',                        en: 'I love you' },
      { tp: 'mi pilin pona tan sina',   es: 'me siento bien gracias a ti',   en: 'I feel good thanks to you' },
      { tp: 'sina suwi tawa mi',        es: 'eres lindx para mí',            en: 'you are cute to me' },
      { tp: 'pilin mi li pona mute',    es: 'mi corazón está muy bien',      en: 'my heart is very well' }
    ]
  },

  // ============ 6. MERCADO ============
  {
    id: 19, section: 'mercado',
    title_es: 'Comprar y vender', title_en: 'Buying and selling',
    desc_es: 'esun: el intercambio', desc_en: 'esun: the exchange',
    words: ['esun', 'mani', 'jo', 'pana'],
    phrases: [
      { tp: 'mi tawa esun',             es: 'voy al mercado',                en: 'I go to the market' },
      { tp: 'mi esun e kili',           es: 'compro fruta',                  en: 'I buy fruit' },
      { tp: 'mi jo e mani',             es: 'tengo dinero',                  en: 'I have money' },
      { tp: 'mi pana e mani, mi jo e ijo', es: 'doy dinero, recibo cosa',    en: 'I give money, I get a thing' }
    ]
  },
  {
    id: 20, section: 'mercado',
    title_es: 'Cantidades', title_en: 'Quantities',
    desc_es: 'Contar cosas: uno, dos, mucho, poco', desc_en: 'Counting: one, two, many, few',
    words: ['wan', 'tu', 'mute', 'lili', 'ale'],
    phrases: [
      { tp: 'kili wan',                 es: 'una fruta',                     en: 'one fruit' },
      { tp: 'kili tu',                  es: 'dos frutas',                    en: 'two fruits' },
      { tp: 'mani mute',                es: 'mucho dinero',                  en: 'a lot of money' },
      { tp: 'mi jo e mani lili',        es: 'tengo poco dinero',             en: 'I have little money' }
    ]
  },
  {
    id: 21, section: 'mercado',
    title_es: 'Productos', title_en: 'Products',
    desc_es: 'Cosas para comprar', desc_en: 'Things to buy',
    words: ['len', 'ilo', 'lipu', 'kili', 'poki'],
    phrases: [
      { tp: 'len sin',                  es: 'ropa nueva',                    en: 'new clothes' },
      { tp: 'ilo toki',                 es: 'teléfono (herramienta-de-hablar)', en: 'phone (talking-tool)' },
      { tp: 'lipu sona',                es: 'libro de aprendizaje',          en: 'study book' },
      { tp: 'poki telo',                es: 'botella (caja de agua)',        en: 'bottle (water container)' }
    ]
  },

  // ============ 7. CASA ============
  {
    id: 22, section: 'casa',
    title_es: 'En casa', title_en: 'At home',
    desc_es: 'tomo: tu hogar', desc_en: 'tomo: your home',
    words: ['tomo', 'lupa', 'supa', 'poki'],
    phrases: [
      { tp: 'tomo mi li lili',          es: 'mi casa es pequeña',            en: 'my house is small' },
      { tp: 'mi awen lon tomo',         es: 'me quedo en casa',              en: 'I stay at home' },
      { tp: 'supa moku',                es: 'mesa (superficie de comida)',   en: 'table (food surface)' },
      { tp: 'lupa li open',             es: 'la puerta está abierta',        en: 'the door is open' }
    ]
  },
  {
    id: 23, section: 'casa',
    title_es: 'Cocinar', title_en: 'Cooking',
    desc_es: 'seli + moku = cocinar', desc_en: 'seli + moku = to cook',
    words: ['seli', 'moku', 'ilo', 'pali'],
    phrases: [
      { tp: 'mi pali e moku',           es: 'cocino (hago comida)',          en: 'I cook (I make food)' },
      { tp: 'mi kepeken seli',          es: 'uso fuego/calor',               en: 'I use fire/heat' },
      { tp: 'mi pana e moku tawa sina', es: 'te sirvo la comida',            en: 'I serve you food' },
      { tp: 'moku mi li seli',          es: 'mi comida está caliente',       en: 'my food is hot' }
    ]
  },
  {
    id: 24, section: 'casa',
    title_es: 'Dormir y descansar', title_en: 'Sleep and rest',
    desc_es: 'lape: tu momento de paz', desc_en: 'lape: your peaceful time',
    words: ['lape', 'awen', 'pilin', 'pini'],
    phrases: [
      { tp: 'mi wile lape',             es: 'quiero dormir',                 en: 'I want to sleep' },
      { tp: 'mi lape pona',             es: 'duermo bien',                   en: 'I sleep well' },
      { tp: 'mi awen',                  es: 'descanso / espero',             en: 'I rest / I wait' },
      { tp: 'tenpo lape li pini',       es: 'la hora de dormir terminó',     en: 'sleep time is over' }
    ]
  },

  // ============ 8. NATURALEZA ============
  {
    id: 25, section: 'nat',
    title_es: 'Cielo y luz', title_en: 'Sky and light',
    desc_es: 'Sol, luna, estrellas', desc_en: 'Sun, moon, stars',
    words: ['suno', 'mun', 'sewi', 'pimeja'],
    phrases: [
      { tp: 'suno li suli',             es: 'el sol es grande',              en: 'the sun is big' },
      { tp: 'mun li lon sewi',          es: 'la luna está arriba',           en: 'the moon is up' },
      { tp: 'tenpo pimeja',             es: 'noche (tiempo oscuro)',         en: 'night (dark time)' },
      { tp: 'mun mute li lon sewi',     es: 'muchas estrellas en el cielo',  en: 'many stars in the sky' }
    ]
  },
  {
    id: 26, section: 'nat',
    title_es: 'Tierra, plantas, montañas', title_en: 'Land, plants, mountains',
    desc_es: 'ma: tu entorno natural', desc_en: 'ma: your natural surroundings',
    words: ['ma', 'kasi', 'kiwen', 'nena'],
    phrases: [
      { tp: 'ma li pona',               es: 'la tierra está bien',           en: 'the earth is fine' },
      { tp: 'kasi suli',                es: 'árbol (planta grande)',         en: 'tree (big plant)' },
      { tp: 'kiwen suli',               es: 'roca grande',                   en: 'big rock' },
      { tp: 'nena suli',                es: 'montaña',                       en: 'mountain' }
    ]
  },
  {
    id: 27, section: 'nat',
    title_es: 'Agua y clima', title_en: 'Water and weather',
    desc_es: 'telo, kon: lagos, ríos, lluvia, viento', desc_en: 'telo, kon: lakes, rivers, rain, wind',
    words: ['telo', 'kon', 'lete', 'seli', 'suno'],
    phrases: [
      { tp: 'telo suli',                es: 'mar/lago (agua grande)',        en: 'sea/lake (big water)' },
      { tp: 'telo li kama tan sewi',    es: 'llueve (agua viene del cielo)', en: 'it rains (water comes from above)' },
      { tp: 'tenpo lete',                es: 'invierno (tiempo frío)',        en: 'winter (cold time)' },
      { tp: 'kon li wawa',              es: 'el viento es fuerte',           en: 'the wind is strong' }
    ]
  },

  // ============ 9. ANIMALES ============
  {
    id: 28, section: 'anim',
    title_es: 'Mamíferos', title_en: 'Mammals',
    desc_es: 'soweli: el zoo de toki pona', desc_en: 'soweli: the toki pona zoo',
    words: ['soweli', 'mu', 'lili', 'suli'],
    phrases: [
      { tp: 'soweli lili',              es: 'animal pequeño (gato, perro)',  en: 'small animal (cat, dog)' },
      { tp: 'soweli suli',              es: 'animal grande (caballo, vaca)', en: 'big animal (horse, cow)' },
      { tp: 'soweli li mu',             es: 'el animal hace ruido',          en: 'the animal makes a sound' },
      { tp: 'mi olin e soweli mi',      es: 'quiero a mi mascota',           en: 'I love my pet' }
    ]
  },
  {
    id: 29, section: 'anim',
    title_es: 'Aves', title_en: 'Birds',
    desc_es: 'waso: lo que vuela', desc_en: 'waso: what flies',
    words: ['waso', 'sewi', 'tawa', 'kalama'],
    phrases: [
      { tp: 'waso li tawa sewi',        es: 'el pájaro vuela alto',          en: 'the bird flies high' },
      { tp: 'kalama waso',              es: 'canto de pájaro',               en: 'birdsong' },
      { tp: 'waso lili',                es: 'pájaro pequeño',                en: 'small bird' },
      { tp: 'mi lukin e waso mute',     es: 'veo muchos pájaros',            en: 'I see many birds' }
    ]
  },
  {
    id: 30, section: 'anim',
    title_es: 'Peces, insectos, reptiles', title_en: 'Fish, bugs, reptiles',
    desc_es: 'kala, pipi, akesi', desc_en: 'kala, pipi, akesi',
    words: ['kala', 'pipi', 'akesi', 'telo'],
    phrases: [
      { tp: 'kala li lon telo',         es: 'el pez está en el agua',        en: 'the fish is in the water' },
      { tp: 'pipi lili',                es: 'insecto pequeño',               en: 'tiny bug' },
      { tp: 'akesi li lon ma',          es: 'el reptil está en la tierra',   en: 'the reptile is on the ground' },
      { tp: 'pipi li tawa lon kasi',    es: 'el bicho se mueve por la planta', en: 'the bug moves on the plant' }
    ]
  },

  // ============ 10. CUERPO ============
  {
    id: 31, section: 'cuerpo',
    title_es: 'Partes del cuerpo', title_en: 'Body parts',
    desc_es: 'sijelo: tu cuerpo entero', desc_en: 'sijelo: your whole body',
    words: ['sijelo', 'lawa', 'luka', 'noka', 'uta'],
    phrases: [
      { tp: 'lawa mi',                  es: 'mi cabeza',                     en: 'my head' },
      { tp: 'luka mi',                  es: 'mi mano/brazo',                 en: 'my hand/arm' },
      { tp: 'noka mi',                  es: 'mi pie/pierna',                 en: 'my foot/leg' },
      { tp: 'sijelo mi li pona',        es: 'mi cuerpo está bien',           en: 'my body is well' }
    ]
  },
  {
    id: 32, section: 'cuerpo',
    title_es: 'Sentirse mal', title_en: 'Feeling unwell',
    desc_es: 'pakala, pilin ike: cuando algo duele', desc_en: 'pakala, pilin ike: when something hurts',
    words: ['pakala', 'pilin', 'ike', 'lete'],
    phrases: [
      { tp: 'lawa mi li pakala',        es: 'me duele la cabeza',            en: 'I have a headache' },
      { tp: 'mi pilin ike',             es: 'me siento mal',                 en: 'I feel bad' },
      { tp: 'sijelo mi li seli',        es: 'tengo fiebre (cuerpo caliente)', en: 'I have a fever (body is hot)' },
      { tp: 'mi pilin lete',            es: 'tengo frío',                    en: 'I feel cold' }
    ]
  },
  {
    id: 33, section: 'cuerpo',
    title_es: 'Cuidarse', title_en: 'Taking care',
    desc_es: 'Beber agua, dormir, descansar', desc_en: 'Drink water, sleep, rest',
    words: ['telo', 'lape', 'awen', 'pona'],
    phrases: [
      { tp: 'o moku e telo',            es: 'bebe agua',                     en: 'drink water' },
      { tp: 'o lape',                   es: 'duerme',                        en: 'sleep' },
      { tp: 'sina ken kama pona',       es: 'puedes mejorar',                en: 'you can get better' },
      { tp: 'sijelo li wile awen',      es: 'el cuerpo necesita descanso',   en: 'the body needs rest' }
    ]
  },

  // ============ 11. TRABAJO/ARTE ============
  {
    id: 34, section: 'arte',
    title_es: 'Trabajar', title_en: 'Working',
    desc_es: 'pali: hacer cosas', desc_en: 'pali: making things',
    words: ['pali', 'kepeken', 'ilo', 'tenpo'],
    phrases: [
      { tp: 'mi pali',                  es: 'yo trabajo',                    en: 'I work' },
      { tp: 'mi pali kepeken ilo',      es: 'trabajo con herramientas',      en: 'I work with tools' },
      { tp: 'tenpo pali',               es: 'hora de trabajo',               en: 'work time' },
      { tp: 'pali mi li pona',          es: 'mi trabajo está bien',          en: 'my work is good' }
    ]
  },
  {
    id: 35, section: 'arte',
    title_es: 'Arte y música', title_en: 'Art and music',
    desc_es: 'musi, kalama, sitelen, kule', desc_en: 'musi, kalama, sitelen, kule',
    words: ['musi', 'kalama', 'sitelen', 'kule'],
    phrases: [
      { tp: 'kalama musi',              es: 'música (sonido de juego)',      en: 'music (playful sound)' },
      { tp: 'sitelen pona',             es: 'pintura/imagen bonita',         en: 'nice picture' },
      { tp: 'mi musi',                  es: 'estoy jugando / haciendo arte', en: 'I am playing / making art' },
      { tp: 'kule mute',                es: 'muchos colores',                en: 'many colors' }
    ]
  },
  {
    id: 36, section: 'arte',
    title_es: 'Escribir y leer', title_en: 'Writing and reading',
    desc_es: 'sitelen, lipu, nimi', desc_en: 'sitelen, lipu, nimi',
    words: ['sitelen', 'lipu', 'nimi', 'sona'],
    phrases: [
      { tp: 'mi sitelen e nimi',        es: 'escribo palabras',              en: 'I write words' },
      { tp: 'mi lukin e lipu',          es: 'leo el libro',                  en: 'I read the book' },
      { tp: 'mi sona e toki pona',      es: 'sé toki pona',                  en: 'I know toki pona' },
      { tp: 'lipu sona',                es: 'libro de estudio',              en: 'study book' }
    ]
  },

  // ============ 12. TIEMPO ============
  {
    id: 37, section: 'tiempo',
    title_es: 'Día y noche', title_en: 'Day and night',
    desc_es: 'suno, mun, tenpo', desc_en: 'suno, mun, tenpo',
    words: ['suno', 'mun', 'tenpo', 'ni'],
    phrases: [
      { tp: 'tenpo suno',               es: 'día (tiempo del sol)',          en: 'day (sun time)' },
      { tp: 'tenpo pimeja',             es: 'noche',                         en: 'night' },
      { tp: 'tenpo ni',                 es: 'ahora (este tiempo)',           en: 'now (this time)' },
      { tp: 'tenpo suno ni',            es: 'hoy',                           en: 'today' }
    ]
  },
  {
    id: 38, section: 'tiempo',
    title_es: 'Ayer, hoy, mañana', title_en: 'Yesterday, today, tomorrow',
    desc_es: 'tenpo pini, tenpo ni, tenpo kama', desc_en: 'tenpo pini, tenpo ni, tenpo kama',
    words: ['pini', 'kama', 'ni', 'sin'],
    phrases: [
      { tp: 'tenpo pini',               es: 'antes / ayer (tiempo terminado)', en: 'before / yesterday (past time)' },
      { tp: 'tenpo kama',               es: 'después / mañana',              en: 'after / tomorrow' },
      { tp: 'tenpo suno sin',           es: 'mañana (nuevo día)',            en: 'tomorrow (new day)' },
      { tp: 'mi pali lon tenpo pini',   es: 'trabajé antes',                 en: 'I worked before' }
    ]
  },
  {
    id: 39, section: 'tiempo',
    title_es: 'Emociones', title_en: 'Emotions',
    desc_es: 'pilin: lo que sientes', desc_en: 'pilin: what you feel',
    words: ['pilin', 'pona', 'ike', 'musi', 'wawa'],
    phrases: [
      { tp: 'mi pilin pona',            es: 'estoy feliz',                   en: 'I am happy' },
      { tp: 'mi pilin ike',             es: 'estoy triste',                  en: 'I am sad' },
      { tp: 'mi pilin musi',            es: 'me siento juguetón',            en: 'I feel playful' },
      { tp: 'mi pilin wawa',            es: 'me siento fuerte',              en: 'I feel strong' }
    ]
  },

  // ============ 13. CONVERSACIÓN ============
  {
    id: 40, section: 'conv',
    title_es: 'Hacer preguntas', title_en: 'Asking questions',
    desc_es: 'seme y anu', desc_en: 'seme and anu',
    words: ['seme', 'anu', 'lon', 'ken'],
    phrases: [
      { tp: 'ni li seme?',              es: '¿qué es esto?',                 en: 'what is this?' },
      { tp: 'sina pona anu ike?',       es: '¿estás bien o mal?',            en: 'are you well or bad?' },
      { tp: 'sina lon?',                es: '¿estás ahí?',                   en: 'are you there?' },
      { tp: 'mi ken toki?',             es: '¿puedo hablar?',                en: 'can I speak?' }
    ]
  },
  {
    id: 41, section: 'conv',
    title_es: 'Partículas pi y kepeken', title_en: 'Particles pi and kepeken',
    desc_es: 'Frases más ricas', desc_en: 'Richer phrases',
    words: ['pi', 'kepeken', 'tan', 'sama'],
    phrases: [
      { tp: 'jan pi ma mi',             es: 'persona de mi país',            en: 'person of my country' },
      { tp: 'mi pali kepeken ilo sin',  es: 'trabajo con una herramienta nueva', en: 'I work with a new tool' },
      { tp: 'mi pona tan sina',         es: 'estoy bien gracias a ti',       en: 'I am well thanks to you' },
      { tp: 'sina sama mi',             es: 'tú eres como yo',               en: 'you are like me' }
    ]
  },

  // ============ 14. FILOSOFÍA ============
  {
    id: 42, section: 'filo',
    title_es: 'kon: el espíritu', title_en: 'kon: the spirit',
    desc_es: 'El concepto más profundo', desc_en: 'The deepest concept',
    words: ['kon', 'pona', 'sewi', 'awen'],
    phrases: [
      { tp: 'kon mi li pona',           es: 'mi espíritu está en paz',       en: 'my spirit is at peace' },
      { tp: 'kon sewi',                 es: 'espíritu/aliento divino',       en: 'divine spirit/breath' },
      { tp: 'mi awen kepeken kon pona', es: 'me mantengo con buen ánimo',    en: 'I stay with good spirit' },
      { tp: 'kon ni li pona tawa mi',   es: 'esta esencia me agrada',        en: 'this essence is good to me' }
    ]
  },
  {
    id: 43, section: 'filo',
    title_es: 'nasin: el camino', title_en: 'nasin: the way',
    desc_es: 'Tu manera, tu sendero', desc_en: 'Your way, your path',
    words: ['nasin', 'pona', 'mi', 'alasa'],
    phrases: [
      { tp: 'nasin mi li pona',         es: 'mi camino es bueno',            en: 'my way is good' },
      { tp: 'mi alasa e nasin sin',     es: 'busco un camino nuevo',         en: 'I seek a new way' },
      { tp: 'nasin toki pona',          es: 'la manera de toki pona',        en: 'the toki pona way' },
      { tp: 'sina ken kama sona e nasin pona', es: 'puedes aprender el buen camino', en: 'you can learn the good way' }
    ]
  },
  {
    id: 44, section: 'filo',
    title_es: 'Repaso final — toki pona li pona a!', title_en: 'Final review — toki pona li pona a!',
    desc_es: 'Todo lo aprendido en una lección', desc_en: 'Everything you learned in one lesson',
    words: ['olin', 'pona', 'sona', 'toki', 'kon'],
    phrases: [
      { tp: 'mi olin e toki pona',      es: 'amo el toki pona',              en: 'I love toki pona' },
      { tp: 'mi sona e toki pona',      es: 'sé toki pona',                  en: 'I know toki pona' },
      { tp: 'toki pona li pona a!',     es: '¡toki pona es hermoso!',        en: 'toki pona is beautiful!' },
      { tp: 'kon pona tawa sina',       es: 'buena energía para ti',         en: 'good energy to you' }
    ]
  }
]
