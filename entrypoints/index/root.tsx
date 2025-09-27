import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/entrypoints/index/components/theme-provider'
import { Theme } from '@/lib/types'
import { router } from './router'
import { useStore } from './store'

export function Root() {
  const { systemSetting } = useStore()

  return (
    <ThemeProvider defaultTheme={systemSetting?.theme ?? Theme.SYSTEM}>
      <RouterProvider router={router} />
      <Toaster richColors theme={systemSetting?.theme ?? Theme.SYSTEM} />
    </ThemeProvider>
  )
}
