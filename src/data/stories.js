// Cuentos cortos en toki pona para la tienda y modo lectura.
// Cada cuento es una secuencia de oraciones con traducción ES/EN.
// Vocabulario usado: solo palabras del VOCAB (vocabulary.js).

export const STORY_LENGTHS = {
  short:  { price: 15, minLessons: 3,  label_es: 'corto',   label_en: 'short',  emoji: '📕' },
  medium: { price: 40, minLessons: 10, label_es: 'mediano', label_en: 'medium', emoji: '📗' },
  long:   { price: 90, minLessons: 25, label_es: 'largo',   label_en: 'long',   emoji: '📘' }
}

export const STORIES = [
  // ============ CORTOS (6) — 5-8 oraciones ============
  {
    id: 'soweli-lili', length: 'short', thumbnail: '🦊',
    title: { es: 'el animalito',         en: 'the little animal' },
    sentences: [
      { tp: 'soweli lili li lon ma kasi.',     es: 'Un animal pequeño está en el bosque.',  en: 'A small animal is in the forest.' },
      { tp: 'ona li lukin e kasi suli.',       es: 'Mira un árbol grande.',                 en: 'It looks at a big tree.' },
      { tp: 'ona li kama jo e kili suwi.',     es: 'Toma una fruta dulce.',                 en: 'It gets a sweet fruit.' },
      { tp: 'soweli lili li pilin pona.',      es: 'El animalito se siente bien.',          en: 'The little animal feels good.' },
      { tp: 'ona li moku e kili.',             es: 'Se come la fruta.',                     en: 'It eats the fruit.' }
    ]
  },
  {
    id: 'tomo-mi', length: 'short', thumbnail: '🏠',
    title: { es: 'mi casa',              en: 'my house' },
    sentences: [
      { tp: 'tomo mi li lili.',                es: 'Mi casa es pequeña.',                   en: 'My house is small.' },
      { tp: 'tomo mi li jo e supa lape, supa moku, en kasi.', es: 'Mi casa tiene cama, mesa y plantas.', en: 'My house has a bed, table, and plants.' },
      { tp: 'mi olin e tomo mi.',              es: 'Amo mi casa.',                          en: 'I love my house.' },
      { tp: 'tenpo suno la mi lon tomo mi.',   es: 'De día estoy en mi casa.',              en: 'During the day I am in my house.' },
      { tp: 'mi pali e moku lon insa.',        es: 'Hago la comida adentro.',               en: 'I make food inside.' },
      { tp: 'tomo mi li pona mute.',           es: 'Mi casa es muy buena.',                 en: 'My house is very good.' }
    ]
  },
  {
    id: 'kili-suwi', length: 'short', thumbnail: '🍎',
    title: { es: 'la fruta dulce',       en: 'the sweet fruit' },
    sentences: [
      { tp: 'mi alasa e kili.',                es: 'Busco fruta.',                          en: 'I am looking for fruit.' },
      { tp: 'mi lukin e kili loje.',           es: 'Veo una fruta roja.',                   en: 'I see a red fruit.' },
      { tp: 'ona li suli en suwi.',            es: 'Es grande y dulce.',                    en: 'It is big and sweet.' },
      { tp: 'mi moku e kili.',                 es: 'Como la fruta.',                        en: 'I eat the fruit.' },
      { tp: 'kili li pona tawa mi.',           es: 'La fruta me gusta.',                    en: 'The fruit is good for me.' }
    ]
  },
  {
    id: 'jan-pona-mi', length: 'short', thumbnail: '🫂',
    title: { es: 'mi amigo',             en: 'my friend' },
    sentences: [
      { tp: 'mi jo e jan pona.',               es: 'Tengo un amigo.',                       en: 'I have a friend.' },
      { tp: 'ona li jan pi pilin pona.',       es: 'Es una persona de buen corazón.',       en: 'They are a kind person.' },
      { tp: 'mi en ona li toki mute.',         es: 'Hablamos mucho.',                       en: 'We talk a lot.' },
      { tp: 'tenpo pini la mi en ona li musi.', es: 'En el pasado, jugamos.',                en: 'In the past, we played.' },
      { tp: 'mi olin e jan pona mi.',          es: 'Amo a mi amigo.',                       en: 'I love my friend.' },
      { tp: 'ona li sama mama tawa mi.',       es: 'Es como familia para mí.',              en: 'They are like family to me.' }
    ]
  },
  {
    id: 'tenpo-suno', length: 'short', thumbnail: '☀️',
    title: { es: 'la mañana',            en: 'the morning' },
    sentences: [
      { tp: 'tenpo suno li open.',             es: 'El día empieza.',                       en: 'The day begins.' },
      { tp: 'suno li sewi.',                   es: 'El sol está arriba.',                   en: 'The sun is up.' },
      { tp: 'waso li kalama.',                 es: 'Los pájaros cantan.',                   en: 'Birds sing.' },
      { tp: 'mi pini e lape.',                 es: 'Termino de dormir.',                    en: 'I stop sleeping.' },
      { tp: 'mi kama tawa moku.',              es: 'Voy a desayunar.',                      en: 'I go to eat.' }
    ]
  },
  {
    id: 'musi-jan-lili', length: 'short', thumbnail: '🧒',
    title: { es: 'el juego del niño',    en: "the child's game" },
    sentences: [
      { tp: 'jan lili li lon ma kasi.',        es: 'Un niño está en el bosque.',            en: 'A child is in the forest.' },
      { tp: 'ona li jo e palisa.',             es: 'Tiene un palo.',                        en: 'They have a stick.' },
      { tp: 'ona li sitelen e nasin lon ma.',  es: 'Dibuja un camino en la tierra.',        en: 'They draw a path on the ground.' },
      { tp: 'waso li kama lon poka ona.',      es: 'Un pájaro llega a su lado.',            en: 'A bird comes to their side.' },
      { tp: 'jan lili li toki tawa waso.',     es: 'El niño le habla al pájaro.',           en: 'The child talks to the bird.' },
      { tp: 'ona li musi mute.',               es: 'Juega mucho.',                          en: 'They play a lot.' },
      { tp: 'tenpo pimeja la ona li tawa tomo.', es: 'En la noche se va a casa.',             en: 'At night they go home.' }
    ]
  },

  // ============ MEDIANOS (6) — 10-15 oraciones ============
  {
    id: 'tomo-telo', length: 'medium', thumbnail: '🚿',
    title: { es: 'el baño matutino',     en: 'the morning bath' },
    sentences: [
      { tp: 'tomo telo li lon poka tomo lape.',      es: 'El baño está al lado del dormitorio.', en: 'The bathroom is next to the bedroom.' },
      { tp: 'mi tawa lon insa lon tenpo suno.',      es: 'Entro adentro por la mañana.',         en: 'I go inside in the morning.' },
      { tp: 'mi kepeken e telo.',                    es: 'Uso el agua.',                         en: 'I use the water.' },
      { tp: 'telo li seli. mi pilin pona.',          es: 'El agua está caliente. Me siento bien.', en: 'The water is hot. I feel good.' },
      { tp: 'mi weka e jaki tan sijelo mi.',         es: 'Quito la suciedad de mi cuerpo.',      en: 'I remove dirt from my body.' },
      { tp: 'mi kama walo e sijelo.',                es: 'Limpio mi cuerpo.',                    en: 'I make my body clean.' },
      { tp: 'tenpo ni la sijelo mi li pona.',        es: 'Ahora mi cuerpo está bien.',           en: 'Now my body is good.' },
      { tp: 'mi pini kepeken e telo.',               es: 'Termino de usar el agua.',             en: 'I stop using the water.' },
      { tp: 'mi weka tan tomo telo.',                es: 'Salgo del baño.',                      en: 'I leave the bathroom.' },
      { tp: 'mi kama lon tomo moku.',                es: 'Voy a la cocina.',                     en: 'I come to the kitchen.' },
      { tp: 'mi wile e moku pona.',                  es: 'Quiero buena comida.',                 en: 'I want good food.' }
    ]
  },
  {
    id: 'ma-kasi', length: 'medium', thumbnail: '🌳',
    title: { es: 'el bosque',            en: 'the forest' },
    sentences: [
      { tp: 'mi tawa ma kasi.',                      es: 'Voy al bosque.',                       en: 'I go to the forest.' },
      { tp: 'kasi suli mute li lon ni.',             es: 'Muchos árboles grandes están aquí.',   en: 'Many big trees are here.' },
      { tp: 'mi kute e mu pi waso lili.',            es: 'Escucho el canto de pájaros pequeños.', en: 'I hear the sound of small birds.' },
      { tp: 'soweli li tawa lon insa.',              es: 'Animales se mueven adentro.',          en: 'Animals move within.' },
      { tp: 'mi lukin e kala lon telo.',             es: 'Veo peces en el agua.',                en: 'I see fish in the water.' },
      { tp: 'kasi li jelo, kasi li laso, kasi li loje.', es: 'Las plantas son amarillas, verdes y rojas.', en: 'Plants are yellow, green, and red.' },
      { tp: 'mi pilin e kon sewi.',                  es: 'Siento el aire de arriba.',            en: 'I feel the air above.' },
      { tp: 'mi alasa e kili suwi.',                 es: 'Busco fruta dulce.',                   en: 'I look for sweet fruit.' },
      { tp: 'mi jo e kili. mi moku e ona.',          es: 'Encuentro fruta. La como.',            en: 'I get fruit. I eat it.' },
      { tp: 'tenpo pimeja li kama.',                 es: 'Llega la noche.',                      en: 'Night comes.' },
      { tp: 'mi tawa lon tomo mi.',                  es: 'Voy a mi casa.',                       en: 'I go to my house.' },
      { tp: 'mi sona e ni: ma kasi li pona mute.',   es: 'Sé esto: el bosque es muy bueno.',     en: 'I know this: the forest is very good.' }
    ]
  },
  {
    id: 'moku-pona', length: 'medium', thumbnail: '🍲',
    title: { es: 'comida en familia',    en: 'family meal' },
    sentences: [
      { tp: 'mama meli li pali e moku.',             es: 'Mamá hace la comida.',                 en: 'Mom makes the food.' },
      { tp: 'ona li kepeken e pan, telo, en kili.',  es: 'Usa pan, agua, y fruta.',              en: 'She uses bread, water, and fruit.' },
      { tp: 'moku li seli. ona li suwi.',            es: 'La comida está caliente. Es dulce.',   en: 'The food is hot. It is sweet.' },
      { tp: 'jan ale lon tomo li kama.',             es: 'Toda la gente de la casa viene.',      en: 'Everyone in the house comes.' },
      { tp: 'mi en mama mije li kama lon supa moku.', es: 'Papá y yo llegamos a la mesa.',         en: 'Dad and I come to the table.' },
      { tp: 'mama meli li pana e moku tawa mi.',     es: 'Mamá me da la comida.',                en: 'Mom gives me the food.' },
      { tp: 'mi toki e ni: "moku ni li pona a!"',    es: 'Digo: "¡esta comida es buenísima!"',   en: 'I say: "this food is so good!"' },
      { tp: 'mama li pilin pona.',                   es: 'Mamá se siente bien.',                 en: 'Mom feels good.' },
      { tp: 'mi moku mute. mi kama jo e wawa.',      es: 'Como mucho. Recibo energía.',          en: 'I eat a lot. I gain strength.' },
      { tp: 'mi pana e mani tawa mama tan moku.',    es: 'Le doy dinero a mamá por la comida (en broma).', en: 'I give money to mom for the food (joke).' },
      { tp: 'ona li toki: "moku li pona tawa olin."',  es: 'Ella dice: "la comida es buena por el amor."', en: 'She says: "food is good because of love."' },
      { tp: 'mi sona e ni.',                         es: 'Lo entiendo.',                         en: 'I understand this.' },
      { tp: 'mi olin e mama mi.',                    es: 'Amo a mi mamá.',                       en: 'I love my mom.' }
    ]
  },
  {
    id: 'olin-sin', length: 'medium', thumbnail: '💕',
    title: { es: 'amor nuevo',           en: 'new love' },
    sentences: [
      { tp: 'mi tawa ma tomo lon tenpo pimeja.',     es: 'Voy a la ciudad de noche.',            en: 'I go to the city at night.' },
      { tp: 'mi kama lukin e jan sin.',              es: 'Veo a una persona nueva.',             en: 'I see a new person.' },
      { tp: 'ona li meli suli. uta ona li loje.',    es: 'Es una mujer grande. Sus labios son rojos.', en: 'She is a tall woman. Her lips are red.' },
      { tp: 'mi toki e ni: "sina pona lukin."',      es: 'Le digo: "te ves linda."',             en: 'I say: "you look beautiful."' },
      { tp: 'ona li mu lili. ona li pilin pona.',    es: 'Hace un pequeño sonido. Se siente bien.', en: 'She makes a small sound. She feels good.' },
      { tp: 'mi en ona li toki. mi kute e nimi ona.', es: 'Hablamos. Escucho su nombre.',          en: 'We talk. I hear her name.' },
      { tp: 'ona li jan musi en jan sona.',           es: 'Es divertida y sabia.',                en: 'She is funny and wise.' },
      { tp: 'mi wile e ona. ona li wile e mi.',      es: 'La quiero. Ella me quiere.',           en: 'I want her. She wants me.' },
      { tp: 'mi toki: "sina wile kama lon tomo moku?"', es: 'Digo: "¿quieres venir al restaurante?"', en: 'I say: "do you want to come to the restaurant?"' },
      { tp: 'ona li toki: "lon!"',                   es: 'Ella dice: "¡sí!"',                    en: 'She says: "yes!"' },
      { tp: 'mi en ona li moku. mi en ona li musi.', es: 'Comemos. Jugamos.',                    en: 'We eat. We have fun.' },
      { tp: 'pilin sin lili li kama lon insa mi.',   es: 'Un nuevo sentimiento crece dentro de mí.', en: 'A new small feeling grows inside me.' },
      { tp: 'tenpo kama la mi tawa lukin e ona kin.', es: 'En el futuro la veré otra vez.',         en: 'In the future I will see her again.' }
    ]
  },
  {
    id: 'kala-suli', length: 'medium', thumbnail: '🐋',
    title: { es: 'la ballena',           en: 'the whale' },
    sentences: [
      { tp: 'kala suli li lon ma telo.',             es: 'La ballena está en el mar.',           en: 'The whale is in the sea.' },
      { tp: 'ona li tawa lon anpa.',                 es: 'Se mueve por abajo.',                  en: 'It moves below.' },
      { tp: 'ona li lukin e ijo mute.',              es: 'Ve muchas cosas.',                     en: 'It sees many things.' },
      { tp: 'kala lili li tawa lon poka ona.',       es: 'Peces pequeños nadan a su lado.',      en: 'Small fish swim by its side.' },
      { tp: 'kala suli li toki tawa kala lili.',     es: 'La ballena le habla a los peces.',     en: 'The whale talks to the small fish.' },
      { tp: '"o tawa lon poka mi."',                 es: '"Vengan a mi lado."',                  en: '"Come to my side."' },
      { tp: 'ale li lon ma telo. ale li pona.',      es: 'Todo está en el mar. Todo está bien.', en: 'All is in the sea. All is good.' },
      { tp: 'ona li kute e kalama tan tomo tawa pi jan.', es: 'Escucha el sonido de barcos humanos.',  en: 'It hears sounds from human ships.' },
      { tp: 'jan li kepeken e ilo tawa.',            es: 'La gente usa vehículos.',              en: 'People use vehicles.' },
      { tp: 'kala suli li weka tan jan.',            es: 'La ballena se aleja de la gente.',     en: 'The whale moves away from people.' },
      { tp: 'ona li tawa lon anpa mute.',            es: 'Va muy hacia abajo.',                  en: 'It goes deep down.' },
      { tp: 'lon anpa la ma telo li pona en pimeja en kon nasa.', es: 'Allá abajo, el mar es bueno, oscuro y extraño.', en: 'Down there, the sea is good, dark, and strange.' }
    ]
  },
  {
    id: 'nasin-tawa', length: 'medium', thumbnail: '🛣️',
    title: { es: 'el viaje',             en: 'the journey' },
    sentences: [
      { tp: 'mi open e nasin sin.',                  es: 'Empiezo un nuevo camino.',             en: 'I start a new path.' },
      { tp: 'mi tawa weka tan tomo mi.',             es: 'Me alejo de mi casa.',                 en: 'I go away from my house.' },
      { tp: 'mi kepeken e ilo tawa suli.',           es: 'Uso un vehículo grande.',              en: 'I use a big vehicle.' },
      { tp: 'mi lukin e ma mute.',                   es: 'Veo muchas tierras.',                  en: 'I see many lands.' },
      { tp: 'nena suli li lon poka.',                es: 'Hay montañas grandes al lado.',        en: 'Big mountains are beside me.' },
      { tp: 'ma kasi li lon ni.',                    es: 'Aquí hay bosque.',                     en: 'There is forest here.' },
      { tp: 'ma telo li lon ni.',                    es: 'Aquí hay mar.',                        en: 'There is sea here.' },
      { tp: 'mi kama lon ma sin.',                   es: 'Llego a tierra nueva.',                en: 'I arrive in a new land.' },
      { tp: 'jan ante li toki e nimi sin tawa mi.',  es: 'Gente distinta me dice palabras nuevas.', en: 'Different people say new words to me.' },
      { tp: 'mi pilin e wawa pi sona sin.',          es: 'Siento la energía del nuevo saber.',   en: 'I feel the power of new knowledge.' },
      { tp: 'mi awen lon ma sin.',                   es: 'Me quedo en la tierra nueva.',         en: 'I stay in the new land.' }
    ]
  },

  // ============ LARGOS (3) — 20+ oraciones ============
  {
    id: 'jan-en-mun', length: 'long', thumbnail: '🌙',
    title: { es: 'el niño y la luna',    en: 'the child and the moon' },
    sentences: [
      { tp: 'jan lili li lon supa lape lon tenpo pimeja.', es: 'Un niño está en su cama de noche.',     en: 'A child is in bed at night.' },
      { tp: 'ona li lukin sewi.',                          es: 'Mira hacia arriba.',                    en: 'They look up.' },
      { tp: 'mun li suli en walo.',                        es: 'La luna es grande y blanca.',           en: 'The moon is big and white.' },
      { tp: 'jan lili li toki tawa mun:',                  es: 'El niño le habla a la luna:',           en: 'The child speaks to the moon:' },
      { tp: '"sina lon seme?"',                            es: '"¿dónde estás?"',                       en: '"where are you?"' },
      { tp: 'mun li toki ala. mun li mu lili.',            es: 'La luna no habla. Hace un sonido suave.', en: 'The moon does not speak. It makes a soft sound.' },
      { tp: 'jan li toki kin:',                            es: 'El niño dice también:',                  en: 'The child says also:' },
      { tp: '"mi wile e ni: mi tawa sina."',               es: '"quiero esto: ir a ti."',                en: '"I want this: to go to you."' },
      { tp: 'mun li kute. mun li pilin pona.',             es: 'La luna escucha. Se siente bien.',       en: 'The moon listens. It feels good.' },
      { tp: 'jan lili li open e luka. ona li wile kama tawa mun.', es: 'El niño abre las manos. Quiere ir a la luna.', en: 'The child opens their hands. They want to come to the moon.' },
      { tp: 'mun li lawa e suno lili tawa jan.',           es: 'La luna manda una luz pequeña al niño.', en: 'The moon sends a small light to the child.' },
      { tp: 'suno lili li kama lon poka jan.',             es: 'La pequeña luz llega al lado del niño.', en: 'The small light arrives by the child.' },
      { tp: 'jan li tawa sewi kepeken suno lili.',         es: 'El niño sube usando la pequeña luz.',    en: 'The child rises using the small light.' },
      { tp: 'ona li kama lon poka mun.',                   es: 'Llega al lado de la luna.',              en: 'They arrive beside the moon.' },
      { tp: 'mun li toki: "sina pona a!"',                 es: 'La luna dice: "¡eres maravilloso!"',     en: 'The moon says: "you are wonderful!"' },
      { tp: 'jan li musi lon mun.',                        es: 'El niño juega en la luna.',              en: 'The child plays on the moon.' },
      { tp: 'tenpo mute li tawa.',                         es: 'Pasa mucho tiempo.',                     en: 'Much time passes.' },
      { tp: 'jan li wile tawa tomo.',                      es: 'El niño quiere ir a casa.',              en: 'The child wants to go home.' },
      { tp: 'mun li pana e ijo tawa jan:',                  es: 'La luna le da algo al niño:',            en: 'The moon gives something to the child:' },
      { tp: '"o jo e ni. ni li sona pi olin sewi."',       es: '"toma esto. es el saber del amor de arriba."', en: '"take this. it is the wisdom of the love from above."' },
      { tp: 'jan li tawa anpa. ona li pilin sewi.',         es: 'El niño baja. Se siente elevado.',      en: 'The child goes down. They feel elevated.' },
      { tp: 'tenpo kama ale la, ona li sona e ni: olin pi jan en mun li pona a.', es: 'En todo tiempo futuro sabrá: el amor entre persona y luna es maravilloso.', en: 'In all future time they will know: love between person and moon is wonderful.' }
    ]
  },
  {
    id: 'kulupu-tomo-suli', length: 'long', thumbnail: '🏙️',
    title: { es: 'la comunidad de la ciudad', en: 'the city community' },
    sentences: [
      { tp: 'jan li mute lon ma tomo suli.',                es: 'Hay mucha gente en la gran ciudad.',   en: 'There are many people in the big city.' },
      { tp: 'jan ale li pali. jan ale li tawa.',            es: 'Toda la gente trabaja. Toda se mueve.', en: 'Everyone works. Everyone moves.' },
      { tp: 'jan pali li pana e moku tawa jan ante.',       es: 'Los trabajadores dan comida a otros.', en: 'Workers give food to others.' },
      { tp: 'jan sona li pana e sona tawa jan lili.',       es: 'Los maestros enseñan a los niños.',    en: 'Teachers give knowledge to children.' },
      { tp: 'mi tawa lon nasin pi tomo suli.',              es: 'Camino por las calles de la ciudad.',  en: 'I walk on the streets of the city.' },
      { tp: 'mi lukin e jan mute.',                         es: 'Veo a mucha gente.',                   en: 'I see many people.' },
      { tp: 'mi kute e kalama mute.',                       es: 'Escucho muchos sonidos.',              en: 'I hear many sounds.' },
      { tp: 'jan li toki nimi sin tawa mi.',                es: 'La gente me dice palabras nuevas.',    en: 'People say new words to me.' },
      { tp: 'mi toki: "mi sona ala."',                      es: 'Digo: "no sé."',                       en: 'I say: "I do not know."' },
      { tp: 'jan li musi. ona li pana e nimi sin tawa mi.', es: 'La gente se ríe. Me enseña palabras.', en: 'People laugh. They teach me words.' },
      { tp: 'mi kama sona.',                                es: 'Aprendo.',                             en: 'I learn.' },
      { tp: 'mi pana e mani tawa moku.',                    es: 'Pago por comida.',                     en: 'I give money for food.' },
      { tp: 'mi moku lon supa lon nasin.',                  es: 'Como en una mesa en la calle.',        en: 'I eat at a table on the street.' },
      { tp: 'waso lili li lon nasin. ona li alasa e moku lili.', es: 'Hay un pajarito en la calle. Busca comida.', en: 'A small bird is on the street. It searches for food.' },
      { tp: 'mi pana e pan lili tawa waso.',                es: 'Le doy un pedazo de pan al pájaro.',   en: 'I give a small piece of bread to the bird.' },
      { tp: 'waso li moku. ona li kama olin lili tawa mi.', es: 'El pájaro come. Me empieza a querer un poquito.', en: 'The bird eats. It comes to love me a little.' },
      { tp: 'jan lili tu li musi lon nasin.',               es: 'Dos niños juegan en la calle.',        en: 'Two children play on the street.' },
      { tp: 'ona li lawa e ijo lili kepeken luka.',         es: 'Mueven cosas pequeñas con las manos.', en: 'They move small things with their hands.' },
      { tp: 'mama li lukin tawa ona.',                      es: 'Sus mamás los miran.',                 en: 'Mothers watch over them.' },
      { tp: 'tenpo suno li tawa.',                          es: 'El día avanza.',                       en: 'The day passes.' },
      { tp: 'ma tomo li kama pimeja.',                      es: 'La ciudad se vuelve oscura.',          en: 'The city becomes dark.' },
      { tp: 'jan li tawa weka tawa tomo ona.',              es: 'La gente se va a sus casas.',          en: 'People go away to their houses.' },
      { tp: 'mi pini lukin e ma tomo. mi tawa kin.',        es: 'Termino de mirar la ciudad. Yo también me voy.', en: 'I finish watching the city. I go too.' },
      { tp: 'ma tomo li kulupu suli. ona li jo e pona en ike. ale li kulupu wan.', es: 'La ciudad es una gran comunidad. Tiene bien y mal. Todo es una sola comunidad.', en: 'The city is a big community. It has good and bad. All is one community.' }
    ]
  },
  {
    id: 'toki-pona-li-pona', length: 'long', thumbnail: '🍃',
    title: { es: 'toki pona es bueno',   en: 'toki pona is good' },
    sentences: [
      { tp: 'jan lili li open sona e toki pona.',           es: 'Un niño empieza a aprender toki pona.', en: 'A child begins to learn toki pona.' },
      { tp: 'ona li kute e nimi sin: "jan", "pona", "ma".', es: 'Escucha palabras nuevas: "jan", "pona", "ma".', en: 'They hear new words: "jan", "pona", "ma".' },
      { tp: 'nimi tu lili li kama nimi mute.',              es: 'Dos pequeñas palabras hacen muchas palabras.', en: 'Two little words become many words.' },
      { tp: 'jan lili li sona e ni: nimi li sama palisa.',  es: 'El niño entiende esto: las palabras son como palos.', en: 'The child understands: words are like sticks.' },
      { tp: 'sina ken pali e ijo mute tan palisa lili.',    es: 'Puedes hacer muchas cosas con palos pequeños.', en: 'You can make many things from small sticks.' },
      { tp: 'ona li sitelen e nimi.',                       es: 'Escribe las palabras.',                en: 'They write the words.' },
      { tp: 'ona li lukin e sitelen pi toki pona.',         es: 'Mira los glifos de toki pona.',        en: 'They look at the toki pona glyphs.' },
      { tp: 'sitelen li sama nimi. ona li pona lukin.',     es: 'Los glifos son como palabras. Son hermosos.', en: 'Glyphs are like words. They are beautiful.' },
      { tp: 'jan lili li toki tawa mama:',                  es: 'El niño le dice a su mamá:',           en: 'The child says to mom:' },
      { tp: '"mama, toki pona li seme tawa sina?"',         es: '"mamá, ¿qué es toki pona para ti?"',   en: '"mom, what is toki pona to you?"' },
      { tp: 'mama li toki:',                                es: 'Mamá dice:',                           en: 'Mom says:' },
      { tp: '"toki pona li nasin. ona li pona."',           es: '"toki pona es un camino. Es bueno."',  en: '"toki pona is a way. It is good."' },
      { tp: '"lon toki pona la, sina ken toki e ale."',     es: '"en toki pona, podés hablar de todo."', en: '"in toki pona, you can talk about everything."' },
      { tp: '"taso, sina kepeken nimi lili."',              es: '"pero usás pocas palabras."',          en: '"but you use few words."' },
      { tp: '"ni li pana e sona sin: ijo pona li jo e nasin lili."', es: '"esto da una nueva sabiduría: las cosas buenas tienen caminos simples."', en: '"this gives new wisdom: good things have simple ways."' },
      { tp: 'jan lili li sona e ni.',                       es: 'El niño entiende esto.',               en: 'The child understands this.' },
      { tp: 'ona li sitelen e lipu. ona li toki e nimi mute.', es: 'Escribe un libro. Habla muchas palabras.', en: 'They write a book. They speak many words.' },
      { tp: 'ona li lukin e ma. ona li lukin e jan.',       es: 'Mira la tierra. Mira a la gente.',     en: 'They look at the land. They look at people.' },
      { tp: 'ale li kama sin tan toki pona.',               es: 'Todo se vuelve nuevo por toki pona.',  en: 'Everything becomes new through toki pona.' },
      { tp: 'soweli li kama "soweli pona". ma li kama "ma kasi pona".', es: 'El animal se vuelve "buen animal". La tierra se vuelve "buen bosque".', en: 'The animal becomes "good animal". The land becomes "good forest".' },
      { tp: 'jan lili li pilin: "ale li pona."',            es: 'El niño siente: "todo está bien."',    en: 'The child feels: "everything is good."' },
      { tp: 'toki pona li sin tawa ona.',                   es: 'Toki pona es nuevo para él.',          en: 'Toki pona is new to them.' },
      { tp: 'ona li olin e nimi en sitelen.',               es: 'Ama las palabras y los glifos.',       en: 'They love the words and the glyphs.' },
      { tp: 'ona li sona e ni: nasin pi toki pona li nasin pi pona.', es: 'Sabe esto: el camino de toki pona es el camino del bien.', en: 'They know this: the way of toki pona is the way of good.' },
      { tp: 'toki pona li pona a!',                         es: '¡Toki pona es muy bueno!',             en: 'Toki pona is so good!' }
    ]
  }
]

// Lista todas las palabras únicas del cuento (para tap-to-translate)
export function getStoryVocab(story) {
  const set = new Set()
  for (const s of story.sentences) {
    s.tp.split(/\s+/).forEach(w => {
      // limpiar puntuación
      const clean = w.replace(/[.,:;!?"()]/g, '').toLowerCase()
      if (clean) set.add(clean)
    })
  }
  return [...set]
}

// Cuenta total de oraciones
export function getStoryLength(story) {
  return story.sentences.length
}

// Filtros
export function storiesByLength(len) {
  return STORIES.filter(s => s.length === len)
}
