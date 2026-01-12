import { Toaster } from "./components/Toaster";
import { Toaster as Sonner } from "./components/Sonner";
import { TooltipProvider } from "./components/Tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./features/landing/pages/Landing";
import Louer from "./features/landing/pages/Louer";

// Tenant pages
import { TenantLayout } from "./layouts/TenantLayout";
import TenantDashboard from "./features/locataire-dashboard/pages/TenantDashboard";
import TenantLogement from "./features/locataire-dashboard/pages/TenantLogement";
import TenantPaiements from "./features/locataire-dashboard/pages/TenantPaiements";
import TenantRecus from "./features/locataire-dashboard/pages/Tenantrecus";
import TenantMaintenance from "./features/locataire-dashboard/pages/TenantMaintenance";
import TenantNotifications from "./features/locataire-dashboard/pages/TenantNotifications";
import TenantProfil from "./features/locataire-dashboard/pages/TenantProfil";

// Admin pages
import { AdminLayout } from "./layouts/AdminLayout";
import AdminDashboard from "./features/admin-dashboard/pages/AdminDashboard";
import AdminUsers from "./features/admin-dashboard/pages/AdminUsers";
import AdminProperties from "./features/admin-dashboard/pages/AdminProperties";
import AdminManagersOverview from "./features/admin-dashboard/pages/AdminManagersOverview";
import AdminStatistics from "./features/admin-dashboard/pages/AdminStatistics";
import AdminNotifications from "./features/admin-dashboard/pages/AdminNotifications";
import AdminSettings from "./features/admin-dashboard/pages/AdminSettings";

// Owner pages
import { OwnerLayout } from "./layouts/OwnerLayout";
import OwnerDashboard from "./features/proprietaire-dashboard/pages/OwnerDashboard";
import OwnerProperties from "./features/proprietaire-dashboard/pages/OwnerProperties";
import OwnerTenants from "./features/proprietaire-dashboard/pages/OwnerTenants";
import OwnerPayments from "./features/proprietaire-dashboard/pages/OwnerPayment";
import OwnerReceipts from "./features/proprietaire-dashboard/pages/OwnerReceipts";
import OwnerMaintenance from "./features/proprietaire-dashboard/pages/OwnerMaintenance";
import OwnerSales from "./features/proprietaire-dashboard/pages/OwnerSales";
import OwnerStatistics from "./features/proprietaire-dashboard/pages/OwnerStatistics";
import OwnerSettings from "./features/proprietaire-dashboard/pages/OwnerSettings";

// Manager pages
import { ManagerLayout } from "./layouts/ManagerLayout";
import ManagerDashboard from "./features/gestionnaire-dashboard/pages/ManagerDashboard";
import ManagerOwners from "./features/gestionnaire-dashboard/pages/ManagerOwners";
import ManagerProperties from "./features/gestionnaire-dashboard/pages/ManagerProperties";
import ManagerTenants from "./features/gestionnaire-dashboard/pages/ManagerTenants";
import ManagerPayments from "./features/gestionnaire-dashboard/pages/ManagerPayments";
import ManagerMaintenance from "./features/gestionnaire-dashboard/pages/ManagerMaintenance";
import ManagerStatistics from "./features/gestionnaire-dashboard/pages/ManageerStatistic";
import ManagerNotifications from "./features/gestionnaire-dashboard/pages/ManagerNotifications";
import ManagerSettings from "./features/gestionnaire-dashboard/pages/ManagerSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/louer" element={<Louer />} />
          
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

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
