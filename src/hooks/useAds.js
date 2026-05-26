// Anuncios recompensados (rewarded ads) via AdMob para móvil, con fallback simulado en web.
// IDs reales de producción (cuenta zeronvas@gmail.com).
// ⚠️ NUNCA hagas clic en tus propios anuncios — AdMob banea por fraude.
// Para probar sin riesgo, registrá este dispositivo como test device en
// https://admob.google.com/ → Configuración → Dispositivos de prueba.

import { Capacitor } from '@capacitor/core'

const isNative = Capacitor.isNativePlatform()

const REWARDED_AD_UNIT_ID = 'ca-app-pub-2143488314005063/7689332066'
const IS_TESTING = false

let AdMobLib = null
let initialized = false

async function loadAdMob() {
  if (!isNative) return null
  if (AdMobLib) return AdMobLib
  AdMobLib = await import('@capacitor-community/admob')
  return AdMobLib
}

async function ensureInit() {
  if (!isNative || initialized) return
  const lib = await loadAdMob()
  if (!lib) return
  try {
    await lib.AdMob.initialize({
      initializeForTesting: IS_TESTING,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false
    })
    initialized = true
  } catch (e) {
    console.warn('AdMob init failed:', e)
    throw e
  }
}

export function adsAvailable() { return isNative }

// Muestra un anuncio recompensado y resuelve con { rewarded, dismissed, simulated }
export async function showRewardedAd() {
  if (!isNative) {
    // En web simulamos: pequeño delay y consideramos como vista.
    await new Promise(r => setTimeout(r, 1200))
    return { rewarded: true, simulated: true }
  }

  await ensureInit()
  const lib = await loadAdMob()
  if (!lib) throw new Error('AdMob no disponible')
  const { AdMob, RewardAdPluginEvents } = lib

  return new Promise((resolve, reject) => {
    let resolved = false
    let rewarded = false

    const finish = (result) => {
      if (resolved) return
      resolved = true
      try { AdMob.removeAllListeners() } catch {}
      resolve(result)
    }
    const failWith = (err) => {
      if (resolved) return
      resolved = true
      try { AdMob.removeAllListeners() } catch {}
      reject(err instanceof Error ? err : new Error(err?.message ?? 'ad failed'))
    }

    AdMob.addListener(RewardAdPluginEvents.Rewarded, () => { rewarded = true })
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => finish({ rewarded, dismissed: true }))
    AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (err) => failWith(err))
    AdMob.addListener(RewardAdPluginEvents.FailedToShow, (err) => failWith(err))

    AdMob.prepareRewardVideoAd({
      adId: REWARDED_AD_UNIT_ID,
      isTesting: IS_TESTING
    })
      .then(() => AdMob.showRewardVideoAd())
      .catch(err => failWith(err))
  })
}
