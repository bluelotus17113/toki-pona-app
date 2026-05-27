import { lazy, Suspense, useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { useProgress } from './hooks/useProgress.js'
import { useLang } from './data/i18n.js'
import { checkAutoAchievements } from './hooks/useAchievements.js'
import { primeAudio } from './hooks/useSpeech.js'
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
import Historia from './components/Historia.jsx'
import SitelenAtlas from './components/SitelenAtlas.jsx'
import Kulupu from './components/Kulupu.jsx'
import KamaSona from './components/KamaSona.jsx'
import LipuPakala from './components/LipuPakala.jsx'
import Minijuegos from './components/Minijuegos.jsx'
import KalamaKute from './components/KalamaKute.jsx'
import KulupuNimi from './components/KulupuNimi.jsx'
import NimiSin from './components/NimiSin.jsx'
import KalaAlasa from './components/KalaAlasa.jsx'
import AlasaNimi from './components/AlasaNimi.jsx'
import SitelenSin from './components/SitelenSin.jsx'
import Dashboard from './components/Dashboard.jsx'
import Toki from './components/Toki.jsx'
import Onboarding, { isOnboarded } from './components/Onboarding.jsx'
import { useTheme } from './hooks/useTheme.js'
import { ensureDailyNotifications, isSetupDone as notifSetupDone } from './hooks/useNotifications.js'

// Lienzo lazy-loaded: contiene Konva (~300KB) — solo se carga al entrar.
const SitelenLienzo = lazy(() => import('./components/SitelenLienzo.jsx'))

export default function App() {
  const progress = useProgress()
  const { lang, setLang } = useLang()
  const { theme, cycleTheme } = useTheme()
  const [screen, setScreen] = useState({ name: 'home' })
  const [needsOnboarding, setNeedsOnboarding] = useState(() => !isOnboarded())

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
  const openHistoria   = () => setScreen({ name: 'historia' })
  const openAtlas      = () => setScreen({ name: 'atlas' })
  const openKulupu     = () => setScreen({ name: 'kulupu' })
  const openKamaSona   = () => setScreen({ name: 'kamasona' })
  const openLipuPakala = () => setScreen({ name: 'lipupakala' })
  const openMinijuegos = () => setScreen({ name: 'minijuegos' })
  const openKalamaKute = () => setScreen({ name: 'kalamakute' })
  const openKulupuNimi = () => setScreen({ name: 'kulupunimi' })
  const openNimiSin    = () => setScreen({ name: 'nimisin' })
  const openKalaAlasa  = () => setScreen({ name: 'kalaalasa' })
  const openAlasaNimi  = () => setScreen({ name: 'alasanimi' })
  const openSitelenSin = () => setScreen({ name: 'sitelensin' })
  const openDashboard  = () => setScreen({ name: 'dashboard' })
  const openToki       = () => setScreen({ name: 'toki' })

  // Chequear logros automáticos cada vez que cambia el estado de progress
  useEffect(() => {
    checkAutoAchievements(progress.state)
  }, [progress.state.completed.length, progress.state.xp])

  // Warm-up del motor TTS al arrancar la app — corre en background mientras
  // el usuario navega Home → Lección. Sin esto, el primer 🔊 tiene ~500ms
  // de retraso en Android (carga del modelo de voz).
  useEffect(() => {
    primeAudio()
  }, [])

  // Programar notificaciones diarias una vez que terminó el onboarding.
  // Si el usuario rechaza el permiso, no insistimos.
  useEffect(() => {
    if (needsOnboarding) return
    if (notifSetupDone()) return
    ensureDailyNotifications({ lang }).catch(() => {})
  }, [needsOnboarding, lang])

  // Manejo del botón Atrás del sistema (Android)
  // Mapeo: dónde va "atrás" desde cada pantalla. null = exit app
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const BACK_NAV = {
      home: null,             // ya en home → salir
      lesson:        'home',
      practice:      'home',
      dictionary:    'home',
      grammar:       'home',
      sitelen:       'home',
      lienzo:        'home',
      achievements:  'home',
      cuentos:       'home',
      story:         'cuentos',   // los cuentos se abren desde la tienda
      historia:      'home',
      atlas:         'home',
      kulupu:        'home',
      minijuegos:    'home',
      // los minijuegos vuelven al hub
      nimitu:        'minijuegos',
      kamasona:      'minijuegos',
      lipupakala:    'minijuegos',
      kalamakute:    'minijuegos',
      kulupunimi:    'minijuegos',
      nimisin:       'minijuegos',
      kalaalasa:     'minijuegos',
      alasanimi:     'minijuegos',
      sitelensin:    'minijuegos',
      dashboard:     'home',
      toki:          'home',
      complete:      'home'
    }
    let handle
    CapApp.addListener('backButton', () => {
      const target = BACK_NAV[screen.name]
      if (target === null) {
        // estamos en home — minimizar/salir
        CapApp.exitApp()
      } else {
        setScreen({ name: target })
      }
    }).then(h => { handle = h })
    return () => { if (handle) handle.remove() }
  }, [screen.name])

  const finishLesson = (lessonId, score, maniEarned = 0) => {
    progress.completeLesson(lessonId, score)
    setScreen({ name: 'complete', mode: 'lesson', lessonId, score, maniEarned })
  }

  const finishPractice = (score, correctCount, total, maniEarned = 0) => {
    progress.addXp(score)
    setScreen({ name: 'complete', mode: 'practice', score, correctCount, total, maniEarned })
  }

  const goHome = () => setScreen({ name: 'home' })
  const goMinijuegos = () => setScreen({ name: 'minijuegos' })

  // Pantalla de onboarding: bloquea todo lo demás hasta completarse o saltarse.
  if (needsOnboarding) {
    return (
      <div className="app">
        <BackgroundOrbs />
        <Onboarding lang={lang} onFinish={() => setNeedsOnboarding(false)} />
      </div>
    )
  }

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
          onHistoria={openHistoria}
          onAtlas={openAtlas}
          onKulupu={openKulupu}
          onMinijuegos={openMinijuegos}
          onDashboard={openDashboard}
          onToki={openToki}
          theme={theme}
          onCycleTheme={cycleTheme}
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
        <NimiTu progress={progress} lang={lang} onExit={goMinijuegos} />
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
      {screen.name === 'historia' && (
        <Historia lang={lang} onExit={goHome} />
      )}
      {screen.name === 'atlas' && (
        <SitelenAtlas lang={lang} onExit={goHome} />
      )}
      {screen.name === 'kulupu' && (
        <Kulupu lang={lang} onExit={goHome} />
      )}
      {screen.name === 'kamasona' && (
        <KamaSona progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'lipupakala' && (
        <LipuPakala progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'minijuegos' && (
        <Minijuegos
          lang={lang}
          onExit={goHome}
          onNimiTu={openNimiTu}
          onKamaSona={openKamaSona}
          onLipuPakala={openLipuPakala}
          onKalamaKute={openKalamaKute}
          onKulupuNimi={openKulupuNimi}
          onNimiSin={openNimiSin}
          onKalaAlasa={openKalaAlasa}
          onAlasaNimi={openAlasaNimi}
          onSitelenSin={openSitelenSin}
        />
      )}
      {screen.name === 'alasanimi' && (
        <AlasaNimi progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'sitelensin' && (
        <SitelenSin progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'dashboard' && (
        <Dashboard progress={progress} lang={lang} onExit={goHome} />
      )}
      {screen.name === 'toki' && (
        <Toki progress={progress} lang={lang} onExit={goHome} />
      )}
      {screen.name === 'kalamakute' && (
        <KalamaKute progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'kulupunimi' && (
        <KulupuNimi progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'nimisin' && (
        <NimiSin progress={progress} lang={lang} onExit={goMinijuegos} />
      )}
      {screen.name === 'kalaalasa' && (
        <KalaAlasa progress={progress} lang={lang} onExit={goMinijuegos} />
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
