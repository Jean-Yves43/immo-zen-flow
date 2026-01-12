import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Louer from "./pages/Louer";
import Vendre from "./pages/Vendre";
import DevenirPartenaire from "./pages/DevenirPartenaire";
import APropos from "./pages/APropos";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Tenant pages
import { TenantLayout } from "./layouts/TenantLayout";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import TenantLogement from "./pages/tenant/TenantLogement";
import TenantPaiements from "./pages/tenant/TenantPaiements";
import TenantRecus from "./pages/tenant/TenantRecus";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";
import TenantNotifications from "./pages/tenant/TenantNotifications";
import TenantProfil from "./pages/tenant/TenantProfil";

// Admin pages
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminManagersOverview from "./pages/admin/AdminManagersOverview";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminSettings from "./pages/admin/AdminSettings";

// Owner pages
import { OwnerLayout } from "./layouts/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerTenants from "./pages/owner/OwnerTenants";
import OwnerPayments from "./pages/owner/OwnerPayments";
import OwnerReceipts from "./pages/owner/OwnerReceipts";
import OwnerMaintenance from "./pages/owner/OwnerMaintenance";
import OwnerSales from "./pages/owner/OwnerSales";
import OwnerStatistics from "./pages/owner/OwnerStatistics";
import OwnerSettings from "./pages/owner/OwnerSettings";

// Manager pages
import { ManagerLayout } from "./layouts/ManagerLayout";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerOwners from "./pages/manager/ManagerOwners";
import ManagerProperties from "./pages/manager/ManagerProperties";
import ManagerTenants from "./pages/manager/ManagerTenants";
import ManagerPayments from "./pages/manager/ManagerPayments";
import ManagerMaintenance from "./pages/manager/ManagerMaintenance";
import ManagerStatistics from "./pages/manager/ManagerStatistics";
import ManagerNotifications from "./pages/manager/ManagerNotifications";
import ManagerSettings from "./pages/manager/ManagerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/louer" element={<Louer />} />
          <Route path="/vendre" element={<Vendre />} />
          <Route path="/devenir-partenaire" element={<DevenirPartenaire />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Tenant Dashboard Routes */}
          <Route path="/tenant" element={<TenantLayout />}>
            <Route index element={<TenantDashboard />} />
            <Route path="logement" element={<TenantLogement />} />
            <Route path="paiements" element={<TenantPaiements />} />
            <Route path="recus" element={<TenantRecus />} />
            <Route path="maintenance" element={<TenantMaintenance />} />
            <Route path="notifications" element={<TenantNotifications />} />
            <Route path="profil" element={<TenantProfil />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users/managers" element={<AdminUsers />} />
            <Route path="users/owners" element={<AdminUsers />} />
            <Route path="users/tenants" element={<AdminUsers />} />
            <Route path="properties" element={<AdminProperties />} />
            <Route path="managers-overview" element={<AdminManagersOverview />} />
            <Route path="statistics" element={<AdminStatistics />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Owner Dashboard Routes */}
          <Route path="/owner" element={<OwnerLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="properties" element={<OwnerProperties />} />
            <Route path="tenants" element={<OwnerTenants />} />
            <Route path="payments" element={<OwnerPayments />} />
            <Route path="receipts" element={<OwnerReceipts />} />
            <Route path="maintenance" element={<OwnerMaintenance />} />
            <Route path="sales" element={<OwnerSales />} />
            <Route path="statistics" element={<OwnerStatistics />} />
            <Route path="settings" element={<OwnerSettings />} />
          </Route>

          {/* Manager Dashboard Routes */}
          <Route path="/manager" element={<ManagerLayout />}>
            <Route index element={<ManagerDashboard />} />
            <Route path="owners" element={<ManagerOwners />} />
            <Route path="properties" element={<ManagerProperties />} />
            <Route path="tenants" element={<ManagerTenants />} />
            <Route path="payments" element={<ManagerPayments />} />
            <Route path="maintenance" element={<ManagerMaintenance />} />
            <Route path="statistics" element={<ManagerStatistics />} />
            <Route path="notifications" element={<ManagerNotifications />} />
            <Route path="settings" element={<ManagerSettings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
