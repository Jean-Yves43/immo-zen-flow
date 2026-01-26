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

    /**
     * Liste des paiements d'un gestionnaire
     */
    list_paiementsGestionnaire: (gestionnaireId) => 
      `${baseUrl}/api/gestionnaire/${gestionnaireId}/paiements`,

    /**
     * Détails d'un paiement
     */
    details_paiement: (paiementId) => 
      `${baseUrl}/api/gestionnaire/paiements/${paiementId}/details`,

    /**
     * Envoyer une relance pour un paiement
     * NOUVELLE URL : inclut le gestionnaireId
     */
    relance_paiement: (gestionnaireId, paiementId) => 
      `${baseUrl}/api/gestionnaire/${gestionnaireId}/paiements/${paiementId}/relance`,




    // ===== Locataire =====
    list_biensLocataire: (locataireId) => `${baseUrl}/api/locataires/${locataireId}/biens-loues`,
    list_paiementsLocataire: (locataireId) => `${baseUrl}/api/locataires/${locataireId}/paiements`,
    telecharger_recu: (paiementId, locataireId) => `${baseUrl}/api/locataires/${locataireId}/paiements/${paiementId}/recu`,
    list_maintenanceLocataire: (locataireId) => `${baseUrl}/api/locataires/${locataireId}/maintenance/filtrer`,
    create_maintenanceLocataire: (locataireId) => `${baseUrl}/api/locataires/${locataireId}/maintenance`,
    
    list_biensLocataireActifs: (locataireId) => `${baseUrl}/api/locataires/${locataireId}/biens-loues/actifs`,
    details_bienLoue: (locataireId, bienId) => `${baseUrl}/api/locataires/${locataireId}/biens-loues/${bienId}`,
     
    /**
     * Prévisualise les mois qui seront payés avant de confirmer
     * POST /api/locataires/{locataireId}/paiements/preview
     */
    preview_paiements: (locataireId) => 
      `${baseUrl}/api/locataires/${locataireId}/paiements/preview`,

    /**
     * Effectue un paiement intelligent (remplace effectuer_paiements)
     * POST /api/locataires/{locataireId}/paiements
     */
    effectuer_paiements: (locataireId) => 
      `${baseUrl}/api/locataires/${locataireId}/paiements`,

    /**
     * Récupère l'historique des paiements pour une location donnée
     * GET /api/locataires/{locataireId}/locations/{locationId}/paiements
     */
    
    historique_paiements: (locataireId, locationId) => 
      `${baseUrl}/api/locataires/${locataireId}/locations/${locationId}/paiements`,

    // Liste des contrats disponibles pour un locataire
    list_contrats: (locataireId) => `/api/contrats/${locataireId}`,

    // Télécharger un contrat (blob) pour une location précise
    download_contrat: (locataireId, locationId) =>
      `/api/contrats/${locataireId}/${locationId}/contrat`,

    
    // USERS - Endpoints pour la gestion utilisateur
    // ========================================
    
    /**
     * Récupérer les détails d'un utilisateur
     * GET /api/users/{userId}
     */
        get_user_details: (userId) => 
      `${baseUrl}/api/users/details/${userId}`,
    
    /**
     * Mettre à jour les détails d'un utilisateur
     * PUT /api/users/{userId}
     */
    update_user_details: (userId) => 
      `${baseUrl}/api/users/${userId}`,
  
    
  },
};

export default appConfig;