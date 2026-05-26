// Historia y filosofía de toki pona — contenido bilingüe es/en.
// Datos: jan Sonja Lang creó el idioma en 2001, publicó pu en 2014.
// Comunidad activa: ~500 hablantes fluidos, miles que entienden, Wikipedia (wikipesija).

export const HISTORIA_SECTIONS = [
  {
    id: 'origen',
    icon: '🎂',
    year: '2001',
    title: { es: 'el origen', en: 'the origin' },
    body: {
      es: 'En 2001, **Sonja Lang** (también conocida como **jan Sonja**), una lingüista y traductora canadiense, creó toki pona como un experimento personal. Estaba pasando por una etapa difícil y diseñó el idioma como una forma de simplificar sus pensamientos. Su pregunta original era: ¿qué pasa si una persona reduce todo lo que piensa al mínimo absoluto?\n\nEl nombre del idioma significa literalmente "**lenguaje del bien**" (toki = idioma, pona = bueno/simple).',
      en: 'In 2001, **Sonja Lang** (also known as **jan Sonja**), a Canadian linguist and translator, created toki pona as a personal experiment. She was going through a difficult time and designed the language as a way to simplify her thoughts. Her original question was: what happens if a person reduces everything they think to the bare minimum?\n\nThe name of the language literally means "**language of good**" (toki = language, pona = good/simple).'
    }
  },
  {
    id: 'libro',
    icon: '📖',
    year: '2014',
    title: { es: 'el libro pu', en: 'the pu book' },
    body: {
      es: 'Durante años el idioma vivió solo en internet, especialmente en grupos de Yahoo y foros. En **2014**, jan Sonja publicó el libro oficial: **"Toki Pona: The Language of Good"**, conocido en la comunidad simplemente como **pu** (la palabra para "libro oficial").\n\npu definió las **120 palabras canónicas** del idioma. Es el "diccionario" autorizado. Existen otras palabras post-pu que la comunidad usa, pero pu sigue siendo la referencia.',
      en: 'For years the language lived only on the internet, especially in Yahoo groups and forums. In **2014**, jan Sonja published the official book: **"Toki Pona: The Language of Good"**, known in the community simply as **pu** (the word for "official book").\n\npu defined the **120 canonical words** of the language. It is the authorized "dictionary". There are other post-pu words the community uses, but pu remains the reference.'
    }
  },
  {
    id: 'filosofia',
    icon: '🍃',
    title: { es: 'la filosofía', en: 'the philosophy' },
    body: {
      es: 'toki pona no es solo un idioma: es una **filosofía minimalista**. Sus ideas centrales:\n\n- **Pocas palabras**: solo ~120. No hay sinónimos. Cada palabra cubre un campo amplio de significados.\n- **Composición sobre vocabulario**: en vez de aprender una palabra para "amigo", combinás `jan` (persona) + `pona` (bueno) = `jan pona`.\n- **Pensamiento simple**: forzarte a hablar con pocas palabras te obliga a **pensar con más claridad**. Lo complejo se vuelve simple.\n- **Atención plena**: muchos hablantes describen aprender toki pona como una experiencia meditativa.\n\nUna frase famosa de la comunidad: *"toki pona li toki pona"* — "toki pona es el lenguaje del bien".',
      en: 'toki pona is not just a language: it is a **minimalist philosophy**. Its core ideas:\n\n- **Few words**: only ~120. No synonyms. Each word covers a broad field of meanings.\n- **Composition over vocabulary**: instead of learning a word for "friend", you combine `jan` (person) + `pona` (good) = `jan pona`.\n- **Simple thought**: forcing yourself to speak with few words forces you to **think more clearly**. The complex becomes simple.\n- **Mindfulness**: many speakers describe learning toki pona as a meditative experience.\n\nA famous community phrase: *"toki pona li toki pona"* — "toki pona is the language of good".'
    }
  },
  {
    id: 'sitelen',
    icon: '☉',
    title: { es: 'sitelen pona — la escritura', en: 'sitelen pona — the script' },
    body: {
      es: '**sitelen pona** es el sistema de escritura logográfico de toki pona. Cada palabra tiene su propio glifo simbólico.\n\nA diferencia del alfabeto latino que usás para escribirlo normalmente, sitelen pona es **icónico**: el glifo de `kasi` (planta) parece una planta, el de `jan` (persona) parece una persona simplificada.\n\nLos glifos se pueden **combinar visualmente** poniendo uno dentro de otro (cartouche), formando compuestos. Esto es lo que probás en *ilo sitelen* dentro de la app.\n\nExisten otros sistemas: **sitelen sitelen** (más decorativo, estilo maya), **sitelen Emosi** (basado en emojis), y más.',
      en: '**sitelen pona** is toki pona\'s logographic writing system. Each word has its own symbolic glyph.\n\nUnlike the Latin alphabet you normally use to write it, sitelen pona is **iconic**: the glyph for `kasi` (plant) looks like a plant, the one for `jan` (person) looks like a simplified person.\n\nGlyphs can be **visually combined** by placing one inside another (cartouche), forming compounds. This is what you try in *ilo sitelen* inside the app.\n\nOther systems exist: **sitelen sitelen** (more decorative, Mayan-style), **sitelen Emosi** (emoji-based), and more.'
    }
  },
  {
    id: 'comunidad',
    icon: '👥',
    title: { es: 'la comunidad', en: 'the community' },
    body: {
      es: 'toki pona tiene una **comunidad pequeña pero apasionada** alrededor del mundo:\n\n- ~500 hablantes considerados fluidos\n- Miles que entienden el idioma\n- **wikipesija** — la Wikipedia en toki pona\n- **r/tokipona** — comunidad en Reddit\n- **ma pona pi toki pona** — servidor de Discord grande (~10k miembros)\n- **lipu tenpo** — revista periódica escrita en toki pona\n\nLa comunidad sigue creando contenido: música, juegos, traducciones de obras famosas (incluyendo *El Principito*), poesía y arte visual.',
      en: 'toki pona has a **small but passionate community** around the world:\n\n- ~500 speakers considered fluent\n- Thousands who understand the language\n- **wikipesija** — Wikipedia in toki pona\n- **r/tokipona** — Reddit community\n- **ma pona pi toki pona** — large Discord server (~10k members)\n- **lipu tenpo** — periodic magazine written in toki pona\n\nThe community keeps creating content: music, games, translations of famous works (including *The Little Prince*), poetry, and visual art.'
    }
  },
  {
    id: 'curiosidades',
    icon: '🤔',
    title: { es: 'datos curiosos', en: 'fun facts' },
    body: {
      es: '- **No hay género gramatical** ni números plurales obligatorios.\n- **El verbo "ser" no existe** como tal. Decís *mi jan* literalmente "yo persona".\n- **No hay tiempos verbales** estrictos. El tiempo se infiere por contexto o partículas (`tenpo pini` = pasado).\n- jan Sonja también **diseñó la fuente** "linja pona" que estás usando en esta app.\n- toki pona es uno de los **idiomas construidos más exitosos** después del Esperanto, considerando su simplicidad extrema.\n- Algunas personas la usan **como práctica de meditación** o para escribir un diario.\n- Hay un **estándar oficial actualizado en 2021** llamado **ku** que añadió más palabras post-pu.\n- Existe una traducción de **El Principito** ("jan lawa lili") en toki pona.',
      en: '- **No grammatical gender** or mandatory plural numbers.\n- **The verb "to be" does not exist** as such. You say *mi jan* literally "I person".\n- **No strict verb tenses**. Time is inferred from context or particles (`tenpo pini` = past).\n- jan Sonja also **designed the font** "linja pona" you are using in this app.\n- toki pona is one of the **most successful constructed languages** after Esperanto, considering its extreme simplicity.\n- Some people use it **as meditation practice** or to write a journal.\n- There is an **official standard updated in 2021** called **ku** that added more post-pu words.\n- There is a translation of **The Little Prince** ("jan lawa lili") in toki pona.'
    }
  },
  {
    id: 'porque',
    icon: '✨',
    title: { es: '¿por qué aprender toki pona?', en: 'why learn toki pona?' },
    body: {
      es: 'A diferencia de idiomas naturales que requieren años de estudio, toki pona se puede **aprender en una semana** con dedicación. Pero **dominarlo** — saber expresar ideas complejas con palabras simples — puede llevar toda una vida.\n\nGente lo aprende por razones muy distintas:\n- **Por curiosidad lingüística**: ¿cómo funciona un idioma con solo 120 palabras?\n- **Para meditar**: forzar pensamiento simple, dejar el ruido mental.\n- **Por ser parte de una comunidad creativa**: arte, escritura, música en TP.\n- **Para mejorar otros idiomas**: aprender a "decir menos para decir más".\n- **Por diversión pura**: es un puzzle creativo cada vez que armás una frase.\n\nNo hay propósito comercial ni profesional. Es un idioma del bien, hecho por amor.',
      en: 'Unlike natural languages that require years of study, toki pona can be **learned in a week** with dedication. But **mastering it** — knowing how to express complex ideas with simple words — can take a lifetime.\n\nPeople learn it for very different reasons:\n- **Out of linguistic curiosity**: how does a language with only 120 words work?\n- **To meditate**: forcing simple thought, letting go of mental noise.\n- **To be part of a creative community**: art, writing, music in TP.\n- **To improve other languages**: learning to "say less to mean more".\n- **For pure fun**: it\'s a creative puzzle every time you build a sentence.\n\nThere is no commercial or professional purpose. It is a language of good, made out of love.'
    }
  }
]
