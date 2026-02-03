import { Outlet } from "react-router-dom";
import { Admin2Sidebar } from "@/components/admin2/Admin2Sidebar";
import { Admin2Header } from "@/components/admin2/Admin2Header";

export function Admin2Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Admin2Sidebar />
      <div className="ml-72 flex flex-col min-h-screen">
        <Admin2Header />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
