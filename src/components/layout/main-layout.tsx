import { useState, useEffect } from "react";
import { Outlet } from "@tanstack/react-router";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { USER_ROLE } from "@/types/auth";
import { useAuthStore } from "@/store/auth-store";
import { useMediaQuery } from "@/hooks/use-media-query";

export function MainLayout() {

  const { user, logout } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Get user role, default to student if not authenticated
  const userRole = user?.role || USER_ROLE.STUDENT;
  
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header user={user} onLogout={logout} />
      
      <div className="flex flex-1">
        <Sidebar
          role={userRole}
          isCollapsed={isSidebarCollapsed}
          isMobile={isMobile}
          isOpen={isSidebarOpen}
          onOpenChange={setIsSidebarOpen}
          onCollapsedChange={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-hidden">
          <div className="container h-full max-w-full py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}