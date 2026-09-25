import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'theme-mode'
const MODES = ['light', 'dark', 'system']

const getSystemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

function getStoredMode() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return MODES.includes(v) ? v : 'system'
  } catch {
    return 'system'
  }
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(getStoredMode)
  const [systemTheme, setSystemTheme] = useState(getSystemTheme)

  // Mientras el modo sea "system", sigue el tema del sistema operativo en vivo
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemTheme(mq.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const resolved = mode === 'system' ? systemTheme : mode

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolved)
  }, [resolved])

  const setMode = (next) => {
    if (!MODES.includes(next)) return
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* almacenamiento no disponible: el tema simplemente no persiste */
    }
  }

  const value = useMemo(() => ({ mode, setMode, resolved }), [mode, resolved])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme debe usarse dentro de <ThemeProvider>')
  return ctx
}
