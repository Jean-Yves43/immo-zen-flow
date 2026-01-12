import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../features/admin-dashboard/components/AdminSidebar";
import { AdminHeader } from "../features/admin-dashboard/components/AdminHeader";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
