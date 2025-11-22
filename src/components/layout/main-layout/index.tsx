import { useState } from "react"
import { MainHeader } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { cn } from "@/libs/utils/cn"

export interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <div className="grid min-h-screen w-full grid-cols-[auto_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
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
        <main className={cn(
          "flex-1 space-y-4 py-2 px-4",
          "bg-muted/40"
        )}>
          <div className="mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}