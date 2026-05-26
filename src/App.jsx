import { lazy, Suspense, useEffect, useState } from 'react'
import { useProgress } from './hooks/useProgress.js'
import { useLang } from './data/i18n.js'
import { checkAutoAchievements } from './hooks/useAchievements.js'
import Home from './components/Home.jsx'
import Lesson from './components/Lesson.jsx'
import Practice from './components/Practice.jsx'
import Dictionary from './components/Dictionary.jsx'
import Grammar from './components/Grammar.jsx'
import NimiTu from './components/NimiTu.jsx'
import SitelenPona from './components/SitelenPona.jsx'
import LessonComplete from './components/LessonComplete.jsx'
import Achievements from './components/Achievements.jsx'
import AchievementToast from './components/AchievementToast.jsx'
import Cuentos from './components/Cuentos.jsx'
import StoryReader from './components/StoryReader.jsx'

// Lienzo lazy-loaded: contiene Konva (~300KB) — solo se carga al entrar.
const SitelenLienzo = lazy(() => import('./components/SitelenLienzo.jsx'))

export default function App() {
  const progress = useProgress()
  const { lang, setLang } = useLang()
  const [screen, setScreen] = useState({ name: 'home' })

  const openLesson     = (lessonId) => setScreen({ name: 'lesson', lessonId })
  const openPractice   = () => setScreen({ name: 'practice' })
  const openDictionary = () => setScreen({ name: 'dictionary' })
  const openGrammar    = () => setScreen({ name: 'grammar' })
  const openNimiTu     = () => setScreen({ name: 'nimitu' })
  const openSitelen    = () => setScreen({ name: 'sitelen' })
  const openLienzo     = () => setScreen({ name: 'lienzo' })
  const openAchievements = () => setScreen({ name: 'achievements' })
  const openCuentos    = () => setScreen({ name: 'cuentos' })
  const openStory      = (storyId) => setScreen({ name: 'story', storyId })

  // Chequear logros automáticos cada vez que cambia el estado de progress
  useEffect(() => {
    checkAutoAchievements(progress.state)
  }, [progress.state.completed.length, progress.state.xp])

  const finishLesson = (lessonId, score, maniEarned = 0) => {
    progress.completeLesson(lessonId, score)
    setScreen({ name: 'complete', mode: 'lesson', lessonId, score, maniEarned })
  }

  const finishPractice = (score, correctCount, total, maniEarned = 0) => {
    progress.addXp(score)
    setScreen({ name: 'complete', mode: 'practice', score, correctCount, total, maniEarned })
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
          onSitelen={openSitelen}
          onLienzo={openLienzo}
          onAchievements={openAchievements}
          onCuentos={openCuentos}
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
      {screen.name === 'sitelen' && (
        <SitelenPona lang={lang} onExit={goHome} />
      )}
      {screen.name === 'lienzo' && (
        <Suspense fallback={<div className="lienzo-loading-screen">cargando lienzo...</div>}>
          <SitelenLienzo lang={lang} onExit={goHome} />
        </Suspense>
      )}
      {screen.name === 'achievements' && (
        <Achievements lang={lang} onExit={goHome} />
      )}
      {screen.name === 'cuentos' && (
        <Cuentos progress={progress} lang={lang} onExit={goHome} onRead={openStory} />
      )}
      {screen.name === 'story' && (
        <StoryReader storyId={screen.storyId} lang={lang} onExit={openCuentos} />
      )}

      <AchievementToast lang={lang} />
      {screen.name === 'complete' && (
        <LessonComplete
          mode={screen.mode}
          lessonId={screen.lessonId}
          score={screen.score}
          correctCount={screen.correctCount}
          total={screen.total}
          maniEarned={screen.maniEarned}
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
