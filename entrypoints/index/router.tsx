import { createHashRouter, Navigate } from 'react-router'
import { Layout } from './components/layout'
import { ChatPage } from './pages/chat'
import { HomePage } from './pages/home'
import { SettingPage } from './pages/setting'
import { ModelSettingPage } from './pages/setting/model'
import { SupabaseSettingPage } from './pages/setting/supabase'
import { SystemSettingPage } from './pages/setting/system'

export const router = createHashRouter([
  {
    path: '',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/chat',
        element: <ChatPage />,
      },
      {
        path: '/setting',
        element: <SettingPage />,
        children: [
          {
            path: '',
            element: <Navigate to="system" replace />,
          },
          {
            path: 'system',
            element: <SystemSettingPage />,
          },
          {
            path: 'model',
            element: <ModelSettingPage />,
          },
          {
            path: 'supabase',
            element: <SupabaseSettingPage />,
          },
        ],
      },
    ],
  },

])
