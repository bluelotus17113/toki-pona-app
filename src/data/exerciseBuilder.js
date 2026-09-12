import { LESSONS } from './lessons.js'
import { VOCAB, WORDS } from './vocabulary.js'
import { priorityScore } from '../hooks/useSrs'

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
      answer: correctText,
      targetWord: correct.tp
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
      answer: correct.tp,
      targetWord: correct.tp
    })
  })

  lessonWords.forEach(w => {
    const correct = VOCAB[w]
    const distractors = sampleDistractors(w, 3)
    ex.push({
      type: 'listen',
      audioWord: correct.tp,
      options: shuffle([correct.tp, ...distractors.map(d => VOCAB[d].tp)]),
      answer: correct.tp,
      targetWord: correct.tp
    })
  })

  // sitelen-mc: ver el glifo y elegir el significado (1 por palabra)
  lessonWords.forEach(w => {
    const correct = VOCAB[w]
    const distractors = sampleDistractors(w, 3)
    const correctText = text(w, lang)
    ex.push({
      type: 'sitelen-mc',
      glyph: correct.tp,
      options: shuffle([correctText, ...distractors.map(d => text(d, lang))]),
      answer: correctText,
      targetWord: correct.tp
    })
  })

  if (lessonWords.length >= 3) {
    const matchWords = lessonWords.slice(0, 5)
    ex.push({
      type: 'match',
      pairs: matchWords.map(w => ({
        tp: VOCAB[w].tp,
        es: text(w, lang) // campo 'es' se usa como "lado traducido" del match
      })),
      targetWords: matchWords
    })
    // sitelen-pair: glifo ↔ palabra romanizada
    const pairWords = lessonWords.slice(0, 4)
    ex.push({
      type: 'sitelen-pair',
      words: pairWords,
      targetWords: pairWords
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
      answer: correctTokens,
      targetWords: correctTokens.filter(t => VOCAB[t])
    })
  })

  return shuffle(ex)
}

// Cuánta "urgencia SRS" tiene un ejercicio (suma de scores de sus target words)
function exerciseSrsScore(ex) {
  if (ex.targetWord) return priorityScore(ex.targetWord)
  if (ex.targetWords) {
    return ex.targetWords.reduce((acc, w) => acc + priorityScore(w), 0) / ex.targetWords.length
  }
  return 0
}

export function buildPracticeExercises(completedIds, count, lang = 'es') {
  if (!completedIds || completedIds.length === 0) return []

  const pool = []
  completedIds.forEach(id => {
    const lesson = LESSONS.find(l => l.id === id)
    if (!lesson) return
    pool.push(...buildLessonExercises(lesson, lang))
  })

  const byType = { mc: [], listen: [], match: [], build: [], 'sitelen-mc': [], 'sitelen-pair': [] }
  pool.forEach(ex => byType[ex.type]?.push(ex))

  const result = []
  // Garantizar al menos 1 ejercicio de cada tipo presente — pero priorizando palabras "due"
  ;['mc', 'listen', 'match', 'build', 'sitelen-mc', 'sitelen-pair'].forEach(t => {
    if (byType[t].length === 0) return
    const sorted = [...byType[t]].sort((a, b) => exerciseSrsScore(b) - exerciseSrsScore(a))
    // 60% del tiempo pickeamos el más urgente; 40% random para evitar monotonía
    const pick = Math.random() < 0.6 ? sorted[0] : shuffle(byType[t])[0]
    result.push(pick)
  })

  // El resto del pool: ordenamos por SRS priority y picamos top
  const remaining = pool.filter(ex => !result.includes(ex))
  const sortedByPriority = [...remaining].sort((a, b) => exerciseSrsScore(b) - exerciseSrsScore(a))

  // 70% urgentes + 30% random (que mezclen sin volverse predecibles)
  const urgentCount = Math.floor((count - result.length) * 0.7)
  const urgentPick = sortedByPriority.slice(0, urgentCount)
  const randomPool = shuffle(remaining.filter(ex => !urgentPick.includes(ex)))

  while (result.length < count && (urgentPick.length > 0 || randomPool.length > 0)) {
    if (urgentPick.length > 0 && Math.random() < 0.7) {
      result.push(urgentPick.shift())
    } else if (randomPool.length > 0) {
      result.push(randomPool.shift())
    } else if (urgentPick.length > 0) {
      result.push(urgentPick.shift())
    }
  }

  return shuffle(result).slice(0, count)
}

export function practiceExerciseCount(completedCount) {
  return Math.min(30, 10 + Math.max(0, completedCount - 1))
}
