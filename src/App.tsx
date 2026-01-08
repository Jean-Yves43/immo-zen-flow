import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Louer from "./pages/Louer";
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
