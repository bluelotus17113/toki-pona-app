// Conversaciones interactivas tipo "choose your own adventure".
// Estructura de cada conversación:
//   { id, title, icon, context, nodes: { nodeId: Node, ... }, startNode }
// Cada Node:
//   { speaker: 'them' | 'you', tp, es, en, options?: [{ tp, es, en, next, isGood? }] }
//   - Si speaker === 'them', tiene `next` directo al próximo nodo.
//   - Si speaker === 'you', tiene `options` (3 opciones, el usuario elige).
//   - isGood: una opción "buena" da bonus de XP. Las otras igual avanzan.

export const CONVERSATIONS = [
  // ============ 1. Pedir café (cafetería) ============
  {
    id: 'cafe',
    icon: '☕',
    title: { es: 'pedir café', en: 'ordering coffee' },
    context: {
      es: 'estás en una cafetería. el barista te saluda.',
      en: 'you are in a café. the barista greets you.'
    },
    startNode: 'them1',
    rewardXp: 25,
    nodes: {
      them1: {
        speaker: 'them',
        tp: 'toki! sina wile e seme?',
        es: '¡hola! ¿qué querés?',
        en: 'hi! what do you want?',
        next: 'you1'
      },
      you1: {
        speaker: 'you',
        prompt: { es: 'pedile algo', en: 'order something' },
        options: [
          { tp: 'mi wile e telo seli', es: 'quiero una bebida caliente', en: 'I want a hot drink', next: 'them2', isGood: true },
          { tp: 'mi wile e moku', es: 'quiero comida', en: 'I want food', next: 'them2b' },
          { tp: 'mi pona', es: 'estoy bien', en: 'I am fine', next: 'them2c' }
        ]
      },
      them2: {
        speaker: 'them',
        tp: 'pona! telo seli mute anu lili?',
        es: '¡bien! ¿bebida grande o chica?',
        en: 'good! big or small drink?',
        next: 'you2'
      },
      them2b: {
        speaker: 'them',
        tp: 'mi jo e pan suwi.',
        es: 'tengo pan dulce.',
        en: 'I have sweet bread.',
        next: 'you2'
      },
      them2c: {
        speaker: 'them',
        tp: 'a! sina wile ala e ijo?',
        es: '¡ah! ¿no querés nada?',
        en: 'oh! you want nothing?',
        next: 'you2'
      },
      you2: {
        speaker: 'you',
        prompt: { es: 'respondé', en: 'reply' },
        options: [
          { tp: 'mute, pona', es: 'grande, gracias', en: 'big, thanks', next: 'them3', isGood: true },
          { tp: 'lili, pona', es: 'chico, gracias', en: 'small, thanks', next: 'them3', isGood: true },
          { tp: 'mi sona ala', es: 'no sé', en: "I don't know", next: 'them3b' }
        ]
      },
      them3: {
        speaker: 'them',
        tp: 'pona a! mani li tu.',
        es: '¡muy bien! son 2 mani.',
        en: 'great! that\'s 2 mani.',
        next: 'you3'
      },
      them3b: {
        speaker: 'them',
        tp: 'mi pana e telo seli lili tawa sina.',
        es: 'te doy una bebida chica.',
        en: 'I give you a small drink.',
        next: 'you3'
      },
      you3: {
        speaker: 'you',
        prompt: { es: 'pagá y despedite', en: 'pay and say goodbye' },
        options: [
          { tp: 'pona, mi pana e mani', es: 'bien, pago', en: 'good, I pay', next: 'end', isGood: true },
          { tp: 'mi tawa', es: 'me voy', en: 'I leave', next: 'end' },
          { tp: 'a, pona tawa sina', es: 'ah, buena suerte', en: 'oh, good luck', next: 'end' }
        ]
      },
      end: {
        speaker: 'them',
        tp: 'pona tawa sina! kama sin!',
        es: '¡buena suerte! ¡volvé pronto!',
        en: 'good luck! come back soon!',
        isEnd: true
      }
    }
  },

  // ============ 2. Presentaciones ============
  {
    id: 'presentaciones',
    icon: '👋',
    title: { es: 'conocer a alguien', en: 'meeting someone' },
    context: {
      es: 'una persona nueva se acerca y te saluda.',
      en: 'a new person walks up and greets you.'
    },
    startNode: 'them1',
    rewardXp: 25,
    nodes: {
      them1: {
        speaker: 'them',
        tp: 'toki! nimi mi li Ana. sina seme?',
        es: '¡hola! me llamo Ana. ¿y vos?',
        en: 'hi! my name is Ana. and you?',
        next: 'you1'
      },
      you1: {
        speaker: 'you',
        prompt: { es: 'presentate', en: 'introduce yourself' },
        options: [
          { tp: 'nimi mi li Maria. mi pilin pona.', es: 'me llamo María. me siento bien.', en: 'I am Maria. I feel good.', next: 'them2', isGood: true },
          { tp: 'mi jan.', es: 'soy una persona.', en: 'I am a person.', next: 'them2b' },
          { tp: 'mi sona ala', es: 'no sé', en: "I don't know", next: 'them2c' }
        ]
      },
      them2: {
        speaker: 'them',
        tp: 'pona lukin! sina kama tan seme?',
        es: '¡qué lindo! ¿de dónde sos?',
        en: 'nice! where are you from?',
        next: 'you2'
      },
      them2b: {
        speaker: 'them',
        tp: 'a, sama mi! sina kama tan seme?',
        es: 'ah, como yo. ¿de dónde sos?',
        en: 'oh, same as me. where are you from?',
        next: 'you2'
      },
      them2c: {
        speaker: 'them',
        tp: 'pona, mi sona ala kin.',
        es: 'bien, yo tampoco sé.',
        en: 'good, I also don\'t know.',
        next: 'you2'
      },
      you2: {
        speaker: 'you',
        prompt: { es: 'de dónde sos', en: 'where you\'re from' },
        options: [
          { tp: 'mi kama tan ma Mesiko', es: 'vengo de México', en: 'I come from Mexico', next: 'them3', isGood: true },
          { tp: 'mi kama tan ma Inka', es: 'vengo de Perú', en: 'I come from Peru', next: 'them3', isGood: true },
          { tp: 'mi lon ni', es: 'estoy aquí', en: 'I am here', next: 'them3b' }
        ]
      },
      them3: {
        speaker: 'them',
        tp: 'epiku! mi wile sona e ma sina.',
        es: '¡épico! quiero conocer tu país.',
        en: 'epic! I want to know your country.',
        next: 'end'
      },
      them3b: {
        speaker: 'them',
        tp: 'a, nasin sama.',
        es: 'ah, igual camino.',
        en: 'oh, same way.',
        next: 'end'
      },
      end: {
        speaker: 'them',
        tp: 'pona lukin tawa sina! mi olin e jan sama sina.',
        es: '¡un gusto! me gustás como amiga.',
        en: 'nice meeting you! I like you as a friend.',
        isEnd: true
      }
    }
  },

  // ============ 3. Pedir ayuda ============
  {
    id: 'ayuda',
    icon: '🆘',
    title: { es: 'pedir ayuda', en: 'asking for help' },
    context: {
      es: 'perdiste algo y le pedís ayuda a alguien en la calle.',
      en: 'you lost something and ask someone on the street for help.'
    },
    startNode: 'you1',
    rewardXp: 30,
    nodes: {
      you1: {
        speaker: 'you',
        prompt: { es: 'pedí ayuda', en: 'ask for help' },
        options: [
          { tp: 'toki! mi wile e pana sona', es: '¡hola! necesito ayuda', en: 'hi! I need help', next: 'them1', isGood: true },
          { tp: 'sina sona seme?', es: '¿qué sabés?', en: 'what do you know?', next: 'them1b' },
          { tp: 'mi pakala', es: 'tengo un problema', en: 'I have a problem', next: 'them1', isGood: true }
        ]
      },
      them1: {
        speaker: 'them',
        tp: 'toki! seme li ike?',
        es: '¡hola! ¿qué pasa?',
        en: 'hi! what\'s wrong?',
        next: 'you2'
      },
      them1b: {
        speaker: 'them',
        tp: 'mi sona e mute. sina wile e seme?',
        es: 'sé muchas cosas. ¿qué necesitás?',
        en: 'I know many things. what do you need?',
        next: 'you2'
      },
      you2: {
        speaker: 'you',
        prompt: { es: 'explicá qué pasó', en: 'explain what happened' },
        options: [
          { tp: 'mi weka e ilo toki mi', es: 'perdí mi teléfono', en: 'I lost my phone', next: 'them2', isGood: true },
          { tp: 'mi alasa e ma tomo', es: 'busco la ciudad', en: 'I look for the city', next: 'them2b' },
          { tp: 'mi pilin ike', es: 'me siento mal', en: 'I feel bad', next: 'them2c' }
        ]
      },
      them2: {
        speaker: 'them',
        tp: 'a, ike! ilo toki sina li lon seme?',
        es: '¡ay, qué mal! ¿dónde está tu teléfono?',
        en: 'oh, that\'s bad! where is your phone?',
        next: 'you3'
      },
      them2b: {
        speaker: 'them',
        tp: 'tawa sinpin, lon nasin suli.',
        es: 'andá derecho, por la avenida grande.',
        en: 'go forward, along the big street.',
        next: 'end'
      },
      them2c: {
        speaker: 'them',
        tp: 'o moku e telo. sina kama pona.',
        es: 'tomá agua. te vas a sentir mejor.',
        en: 'drink water. you\'ll feel better.',
        next: 'end'
      },
      you3: {
        speaker: 'you',
        prompt: { es: 'respondé dónde', en: 'reply where' },
        options: [
          { tp: 'lon tomo telo, mi pilin', es: 'en el baño, creo', en: 'in the bathroom, I think', next: 'end', isGood: true },
          { tp: 'lon insa poki mi pini', es: 'estaba en mi bolso', en: 'it was in my bag', next: 'end', isGood: true },
          { tp: 'mi sona ala', es: 'no sé', en: "I don't know", next: 'end' }
        ]
      },
      end: {
        speaker: 'them',
        tp: 'pona! mi ken pana sona tawa sina. o kama!',
        es: '¡bien! puedo ayudarte. vamos.',
        en: 'good! I can help you. let\'s go.',
        isEnd: true
      }
    }
  }
]
