import { RouterProvider } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { router } from './router'

export function Root() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors />
    </>
  )
}
