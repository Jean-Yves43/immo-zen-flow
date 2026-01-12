import { Outlet } from "react-router-dom";
import { TenantSidebar } from "../features/locataire-dashboard/components/TenantSlidebar";
import { TenantHeader } from "../features/locataire-dashboard/components/TenantHeader";

export function TenantLayout() {
  return (
    <div className="min-h-screen bg-background">
      <TenantSidebar />
      <div className="pl-64 transition-all duration-300">
        <TenantHeader />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
