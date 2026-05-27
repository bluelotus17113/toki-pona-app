import { useEffect, useState, useCallback } from 'react'

// Temas disponibles: light (default), dark, sepia.
// Aplica la clase `.theme-{name}` al <html> y persiste en localStorage.

export const THEMES = ['light', 'dark', 'sepia']
const KEY = 'tokipona.theme'

function readInitial() {
  try {
    const saved = localStorage.getItem(KEY)
    if (THEMES.includes(saved)) return saved
  } catch {}
  return 'light'
}

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  for (const t of THEMES) root.classList.remove(`theme-${t}`)
  if (theme !== 'light') root.classList.add(`theme-${theme}`)
}

export function useTheme() {
  const [theme, setThemeState] = useState(readInitial)

  useEffect(() => { applyTheme(theme) }, [theme])

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return
    setThemeState(next)
    try { localStorage.setItem(KEY, next) } catch {}
  }, [])

  // Ciclo: light → dark → sepia → light
  const cycleTheme = useCallback(() => {
    setThemeState(prev => {
      const idx = THEMES.indexOf(prev)
      const next = THEMES[(idx + 1) % THEMES.length]
      try { localStorage.setItem(KEY, next) } catch {}
      return next
    })
  }, [])

  return { theme, setTheme, cycleTheme }
}
