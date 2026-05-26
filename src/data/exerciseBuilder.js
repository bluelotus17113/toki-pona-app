import { LESSONS } from './lessons.js'
import { VOCAB, WORDS } from './vocabulary.js'

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function sampleDistractors(word, n) {
  const pool = WORDS.filter(w => w !== word)
  return shuffle(pool).slice(0, n)
}

const text = (w, lang) => VOCAB[w][lang] ?? VOCAB[w].es

// Construye todos los ejercicios de UNA lección, en el idioma dado.
// Los prompts son objetos { key, args } que el componente traduce con t().
export function buildLessonExercises(lesson, lang = 'es') {
  const ex = []
  const lessonWords = lesson.words

  lessonWords.forEach(w => {
    const correct = VOCAB[w]
    const distractors = sampleDistractors(w, 3)
    const correctText = text(w, lang)
    ex.push({
      type: 'mc',
      prompt: { key: 'mcMeaning', args: { word: correct.tp } },
      audioWord: correct.tp,
      options: shuffle([correctText, ...distractors.map(d => text(d, lang))]),
      answer: correctText
    })
  })

  lessonWords.forEach(w => {
    const correct = VOCAB[w]
    const distractors = sampleDistractors(w, 3)
    const meaning = text(w, lang)
    ex.push({
      type: 'mc',
      prompt: { key: 'mcSayInTP', args: { word: meaning } },
      options: shuffle([correct.tp, ...distractors.map(d => VOCAB[d].tp)]),
      answer: correct.tp
    })
  })

  lessonWords.forEach(w => {
    const correct = VOCAB[w]
    const distractors = sampleDistractors(w, 3)
    ex.push({
      type: 'listen',
      audioWord: correct.tp,
      options: shuffle([correct.tp, ...distractors.map(d => VOCAB[d].tp)]),
      answer: correct.tp
    })
  })

  if (lessonWords.length >= 3) {
    ex.push({
      type: 'match',
      pairs: lessonWords.slice(0, 5).map(w => ({
        tp: VOCAB[w].tp,
        es: text(w, lang) // campo 'es' se usa como "lado traducido" del match
      }))
    })
  }

  lesson.phrases.forEach(p => {
    const correctTokens = p.tp.split(' ').filter(Boolean)
    const extras = shuffle(WORDS.filter(w => !correctTokens.includes(w))).slice(0, 3)
    const phraseText = p[lang] ?? p.es
    ex.push({
      type: 'build',
      prompt: { key: 'translatePrompt', args: { text: phraseText } },
      tokens: shuffle([...correctTokens, ...extras]),
      answer: correctTokens
    })
  })

  return shuffle(ex)
}

export function buildPracticeExercises(completedIds, count, lang = 'es') {
  if (!completedIds || completedIds.length === 0) return []

  const pool = []
  completedIds.forEach(id => {
    const lesson = LESSONS.find(l => l.id === id)
    if (!lesson) return
    pool.push(...buildLessonExercises(lesson, lang))
  })

  const byType = { mc: [], listen: [], match: [], build: [] }
  pool.forEach(ex => byType[ex.type]?.push(ex))

  const result = []
  ;['mc', 'listen', 'match', 'build'].forEach(t => {
    if (byType[t].length > 0) result.push(shuffle(byType[t])[0])
  })

  const rest = shuffle(pool.filter(ex => !result.includes(ex)))
  while (result.length < count && rest.length > 0) {
    result.push(rest.shift())
  }

  return shuffle(result).slice(0, count)
}

export function practiceExerciseCount(completedCount) {
  return Math.min(30, 10 + Math.max(0, completedCount - 1))
}
