import { useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { useLang } from './data/i18n.js'
import Home from './components/Home.jsx'
import Lesson from './components/Lesson.jsx'
import Practice from './components/Practice.jsx'
import Dictionary from './components/Dictionary.jsx'
import Grammar from './components/Grammar.jsx'
import NimiTu from './components/NimiTu.jsx'
import LessonComplete from './components/LessonComplete.jsx'

export default function App() {
  const progress = useProgress()
  const { lang, setLang } = useLang()
  const [screen, setScreen] = useState({ name: 'home' })

  const openLesson     = (lessonId) => setScreen({ name: 'lesson', lessonId })
  const openPractice   = () => setScreen({ name: 'practice' })
  const openDictionary = () => setScreen({ name: 'dictionary' })
  const openGrammar    = () => setScreen({ name: 'grammar' })
  const openNimiTu     = () => setScreen({ name: 'nimitu' })

  const finishLesson = (lessonId, score) => {
    progress.completeLesson(lessonId, score)
    setScreen({ name: 'complete', mode: 'lesson', lessonId, score })
  }

  const finishPractice = (score, correctCount, total) => {
    progress.addXp(score)
    setScreen({ name: 'complete', mode: 'practice', score, correctCount, total })
  }

  const goHome = () => setScreen({ name: 'home' })

  return (
    <div className="app">
      <BackgroundOrbs />
      {screen.name === 'home' && (
        <Home
          progress={progress}
          lang={lang}
          setLang={setLang}
          onOpen={openLesson}
          onPractice={openPractice}
          onDictionary={openDictionary}
          onGrammar={openGrammar}
          onNimiTu={openNimiTu}
        />
      )}
      {screen.name === 'lesson' && (
        <Lesson
          lessonId={screen.lessonId}
          progress={progress}
          lang={lang}
          onFinish={finishLesson}
          onExit={goHome}
        />
      )}
      {screen.name === 'practice' && (
        <Practice
          progress={progress}
          lang={lang}
          onFinish={finishPractice}
          onExit={goHome}
        />
      )}
      {screen.name === 'dictionary' && (
        <Dictionary lang={lang} onExit={goHome} />
      )}
      {screen.name === 'grammar' && (
        <Grammar lang={lang} onExit={goHome} />
      )}
      {screen.name === 'nimitu' && (
        <NimiTu progress={progress} lang={lang} onExit={goHome} />
      )}
      {screen.name === 'complete' && (
        <LessonComplete
          mode={screen.mode}
          lessonId={screen.lessonId}
          score={screen.score}
          correctCount={screen.correctCount}
          total={screen.total}
          lang={lang}
          onHome={goHome}
        />
      )}
    </div>
  )
}

function BackgroundOrbs() {
  return (
    <div className="bg-orbs" aria-hidden>
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
    </div>
  )
}
