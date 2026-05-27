// Wrapper de TTS que funciona en web y en Android (vía Capacitor).
// - En web: usa Web Speech API (necesita speech-dispatcher en Linux)
// - En Android: usa el plugin nativo @capacitor-community/text-to-speech

import { Capacitor } from '@capacitor/core'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { unlock } from './useAchievements.js'

const isNative = Capacitor.isNativePlatform()

// ============ Native (Capacitor / Android) ============

// Cache de voces: getSupportedVoices() cruza el bridge JS↔nativo,
// llamarlo en cada speak introduce ~50-200ms de latencia perceptible.
let nativeVoicesCache = null
let nativeEngineReady = false

async function getNativeVoicesCached() {
  if (nativeVoicesCache !== null) return nativeVoicesCache
  try {
    const { voices } = await TextToSpeech.getSupportedVoices()
    nativeVoicesCache = voices ?? []
  } catch (e) {
    console.warn('Cannot query TTS voices:', e)
    nativeVoicesCache = []
  }
  return nativeVoicesCache
}

async function nativeSpeak(text, opts = {}) {
  const voices = await getNativeVoicesCached()
  if (!voices || voices.length === 0) {
    console.warn('No native TTS engine, falling back to web speech')
    return webSpeak(text, opts)
  }

  // Cancelar cualquier speak previo para responder rápido a clics seguidos.
  try { await TextToSpeech.stop() } catch {}

  try {
    opts.onStart?.()
    await TextToSpeech.speak({
      text,
      lang: 'it-IT',
      rate: opts.rate ?? 0.85,
      pitch: opts.pitch ?? 1.0,
      volume: opts.volume ?? 1.0,
      voice: 0,
      category: 'ambient'
    })
    opts.onEnd?.()
  } catch (e) {
    console.warn('Native TTS failed, falling back to web:', e)
    return webSpeak(text, opts)
  }
}

async function nativeStop() {
  try { await TextToSpeech.stop() } catch {}
}

// Warm-up del motor TTS: en Android la primera invocación carga el modelo
// de voz (~200-800ms). Lo disparamos al iniciar la app para que el primer
// speak real sea instantáneo.
async function nativeWarmUp() {
  if (nativeEngineReady) return
  nativeEngineReady = true
  try {
    const voices = await getNativeVoicesCached()
    if (!voices || voices.length === 0) return
    // "speak" silencioso con texto mínimo: dispara la carga del modelo
    // sin emitir audio audible.
    await TextToSpeech.speak({
      text: 'a',
      lang: 'it-IT',
      rate: 2.0,
      pitch: 1.0,
      volume: 0.0,
      voice: 0,
      category: 'ambient'
    })
  } catch (e) {
    console.warn('TTS warm-up failed (non-fatal):', e)
  }
}

// ============ Web (navegador) ============

let voicesReady = null

function ensureVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve([])
  if (voicesReady) return voicesReady

  voicesReady = new Promise((resolve) => {
    const synth = window.speechSynthesis
    const voices = synth.getVoices()
    if (voices && voices.length > 0) return resolve(voices)

    const handler = () => {
      synth.removeEventListener('voiceschanged', handler)
      resolve(synth.getVoices())
    }
    synth.addEventListener('voiceschanged', handler)
    setTimeout(() => {
      synth.removeEventListener('voiceschanged', handler)
      resolve(synth.getVoices())
    }, 1500)
  })
  return voicesReady
}

function pickVoice(voices) {
  if (!voices || voices.length === 0) return null
  const langOrder = ['it-IT', 'it', 'es-ES', 'es-MX', 'es-AR', 'es', 'pt-BR', 'pt-PT', 'pt']
  for (const lang of langOrder) {
    const exact = voices.find(v => v.lang === lang)
    if (exact) return exact
    const prefix = lang.slice(0, 2)
    const partial = voices.find(v => v.lang.toLowerCase().startsWith(prefix))
    if (partial) return partial
  }
  return voices[0]
}

async function webSpeak(text, opts = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    opts.onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  const voices = await ensureVoices()

  try { synth.cancel() } catch {}
  await new Promise(r => setTimeout(r, 60))

  const u = new SpeechSynthesisUtterance(text)
  u.rate = opts.rate ?? 0.75
  u.pitch = opts.pitch ?? 1.0
  u.volume = opts.volume ?? 1.0

  const voice = pickVoice(voices)
  if (voice) {
    u.voice = voice
    u.lang = voice.lang
  } else {
    u.lang = 'it-IT'
  }

  u.onstart = () => opts.onStart?.()
  u.onend = () => opts.onEnd?.()
  u.onerror = (e) => {
    console.warn('speech error', e.error)
    opts.onEnd?.()
  }
  synth.speak(u)
}

// ============ API pública ============

export async function speak(text, opts = {}) {
  unlock('first-tts')
  if (isNative) return nativeSpeak(text, opts)
  return webSpeak(text, opts)
}

let primed = false
export async function primeAudio() {
  if (primed) return
  primed = true
  if (isNative) {
    // En Android: cachear voces + warm-up del motor TTS para que el primer
    // speak real no tenga que cargar el modelo.
    return nativeWarmUp()
  }
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    await ensureVoices()
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    u.rate = 10
    window.speechSynthesis.speak(u)
  } catch {}
}

export async function stopSpeaking() {
  if (isNative) return nativeStop()
  try { window.speechSynthesis.cancel() } catch {}
}
