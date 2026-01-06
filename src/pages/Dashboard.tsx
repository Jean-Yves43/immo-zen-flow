import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TenantOverview } from "@/components/dashboard/TenantOverview";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats */}
              <DashboardStats />

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <RevenueChart />
                </div>
                {/* Recent Activity */}
                <div>
                  <RecentActivity />
                </div>
              </div>

              {/* Properties and Tenants */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentProperties />
                <TenantOverview />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
