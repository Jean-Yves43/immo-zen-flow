import { Outlet } from "react-router-dom";
import { TenantSidebar } from "@/components/tenant/TenantSidebar";
import { TenantHeader } from "@/components/tenant/TenantHeader";

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
