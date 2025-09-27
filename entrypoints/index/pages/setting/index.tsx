import { NavLink, Outlet } from 'react-router'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export function SettingPage() {
  const menu = [
    {
      to: 'system',
      label: '系统设置',
    },
    {
      to: 'model',
      label: '模型设置',
    },
    {
      to: 'supabase',
      label: 'Supabase设置',
    },
  ]

  return (
    <div className="h-full flex gap-4">
      <div className="w-[200px] h-min rounded-lg border border-border divide-y divide-border">
        {menu.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => cn('block px-4 py-2 font-medium hover:bg-accent', { 'bg-accent': isActive })}>
            {item.label}
          </NavLink>
        ))}
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
        <Outlet />
      </ScrollArea>
    </div>
  )
}
