import { list } from "postcss";

// src/route/route.ts
const baseUrl = import.meta.env.VITE_API_URL;

const appConfig = {
  baseUrl,
  api: {
    // ===== Auth =====
    login: `${baseUrl}/api/auth/login`,

    // ===== Gestionnaire =====
    list_proprietaires: (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/proprietaires`,
    list_locatairesGestionnaire: (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/locataires`,
    details_locataire: (locataireId) => `${baseUrl}/api/gestionnaire/locataires/${locataireId}`,
    list_maintenancesGestionnaire: (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/maintenances`,
    details_maintenance: (maintenanceId) => `${baseUrl}/api/gestionnaire/maintenances/${maintenanceId}`,
    list_biensGestionnaire: (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/biens`,
    details_bienGestionnaire: (bienId) => `${baseUrl}/api/gestionnaire/biens/${bienId}`,
    list_paiementsGestionnaire: (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/paiements`,
    details_paiement: (paiementId) => `${baseUrl}/api/gestionnaire/${paiementId}/details`,
    relance_paiement: (paiementId) => `${baseUrl}/api/gestionnaire/${paiementId}/relance`,
    stats : (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/statistiques`,
    revenues : (gestionnaireId) => `${baseUrl}/api/gestionnaire/${gestionnaireId}/revenus`,
  },
};

export default appConfig;