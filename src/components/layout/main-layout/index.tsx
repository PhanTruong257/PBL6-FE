import { useState } from 'react'
import { MainHeader } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { cn } from '@/libs/utils/cn'

export interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem('isSidebarCollapsed')
      return storedValue ? JSON.parse(storedValue) : false
    }
    return false
  })

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
    localStorage.setItem(
      'isSidebarCollapsed',
      JSON.stringify(!isSidebarCollapsed),
    )
  }

  return (
    <div className="grid h-screen w-full grid-cols-[auto_1fr] overflow-hidden">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block h-screen overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col h-screen overflow-hidden">
        <MainHeader
          onToggleSidebar={toggleSidebar}
          sidebarContent={
            <Sidebar
              isCollapsed={false}
              onToggleCollapse={() => {}}
              className="border-none"
            />
          }
        />

        {/* Page Content */}
        <main className={cn('flex-1 overflow-auto', 'bg-muted/40')}>
          <div className="h-full w-full mx-auto px-4 md:px-6 py-4 md:py-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
