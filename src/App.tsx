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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
