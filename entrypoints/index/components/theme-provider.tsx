import { createContext, use, useEffect } from 'react'
import { Theme } from '@/lib/types'
import { useStore } from '../store'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme
}

const initialState: ThemeProviderState = {
  theme: Theme.SYSTEM,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = Theme.SYSTEM,
  ...props
}: ThemeProviderProps) {
  const { systemSetting } = useStore()

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    const theme = systemSetting?.theme ?? defaultTheme

    if (theme === Theme.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [systemSetting?.theme, defaultTheme])

  const value = {
    theme: systemSetting?.theme ?? defaultTheme,
  }

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = use(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
