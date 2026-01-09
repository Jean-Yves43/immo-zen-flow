import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";

export function ManagerLayout() {
  const [sidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <ManagerSidebar />
      <ManagerHeader sidebarCollapsed={sidebarCollapsed} />
      <main className={`transition-all duration-300 pt-16 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
