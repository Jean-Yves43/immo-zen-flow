import { useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { OwnerSidebar } from "../features/proprietaire-dashboard/components/OwnerSidebar";
import { OwnerHeader } from "../features/proprietaire-dashboard/components/OwnerHeader";
import { X } from "lucide-react";
import { Button } from "../components/Button";

export function OwnerLayout() {
  const [sidebarCollapsed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const managedBy = searchParams.get("managedBy");
  const managerName = searchParams.get("managerName");

  const exitManagerContext = () => {
    setSearchParams({});
    window.location.href = "/manager/owners";
  };

  return (
    <div className="min-h-screen bg-background">
      <OwnerSidebar />
      <OwnerHeader sidebarCollapsed={sidebarCollapsed} />
      
      {/* Manager Context Banner */}
      {managedBy && (
        <div
          className={`fixed top-16 z-20 bg-secondary text-secondary-foreground px-4 py-2 flex items-center justify-between transition-all duration-300 ${
            sidebarCollapsed ? "left-16 right-0" : "left-64 right-0"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              🔗 Vous gérez les biens de : <strong>{managerName || "Propriétaire"}</strong>
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={exitManagerContext}
            className="text-secondary-foreground hover:bg-secondary-foreground/10"
          >
            <X className="h-4 w-4 mr-1" />
            Quitter ce contexte
          </Button>
        </div>
      )}

      <main
        className={`transition-all duration-300 pt-16 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        } ${managedBy ? "pt-28" : ""}`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
