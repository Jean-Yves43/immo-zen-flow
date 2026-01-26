// src/services/paiements.service.js
import appConfig from '../../../routes/route';

/**
 * Service pour gérer les paiements d'un gestionnaire
 * Compatible avec l'API Spring Boot R2DBC réactive
 */
export const paiementsService = {
  /**
   * Récupère la liste des paiements d'un gestionnaire
   * Endpoint: GET /api/gestionnaire/{gestionnaireId}/paiements
   * 
   * @param {number} gestionnaireId - ID du gestionnaire
   * @returns {Promise<Array<PaiementDTO>>} Liste des paiements
   */
  getPaiements: async (gestionnaireId) => {
    try {
      const response = await fetch(appConfig.api.list_paiementsGestionnaire(gestionnaireId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // L'API retourne directement un tableau de PaiementDTO
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des paiements:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des paiements');
    }
  },

  /**
   * Récupère les détails complets d'un paiement
   * Endpoint: GET /api/gestionnaire/paiements/{paiementId}/details
   * 
   * @param {number} paiementId - ID du paiement
   * @returns {Promise<PaiementDetailDTO>} Détails du paiement
   */
  getDetailsPaiement: async (paiementId) => {
    try {
      const response = await fetch(appConfig.api.details_paiement(paiementId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Paiement non trouvé');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des détails:', error);
      throw new Error(error.message || 'Erreur lors de la récupération des détails du paiement');
    }
  },

  /**
   * Envoie une relance pour un paiement en retard
   * Endpoint: POST /api/gestionnaire/{gestionnaireId}/paiements/{paiementId}/relance
   * 
   * Cette méthode crée automatiquement une notification "Relance envoyée"
   * 
   * @param {number} gestionnaireId - ID du gestionnaire
   * @param {number} paiementId - ID du paiement
   * @param {RelanceRequestDTO} relanceData - { typeRelance: string, messagePersonnalise: string }
   * @returns {Promise<RelanceResponseDTO>} Résultat de la relance
   */
  envoyerRelance: async (gestionnaireId, paiementId, relanceData) => {
    try {
      // Validation des données
      if (!relanceData.typeRelance) {
        throw new Error('Le type de relance est requis');
      }
      
      if (!relanceData.messagePersonnalise?.trim()) {
        throw new Error('Le message personnalisé est requis');
      }

      const response = await fetch(
        appConfig.api.relance_paiement(gestionnaireId, paiementId),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(relanceData),
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Paiement non trouvé');
        }
        if (response.status === 400) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Données de relance invalides');
        }
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Le backend retourne RelanceResponseDTO avec:
      // { relanceId, locataireNom, dateEnvoi, typeRelance, status }
      return data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la relance:', error);
      throw new Error(error.message || 'Erreur lors de l\'envoi de la relance');
    }
  },

  // ========== FILTRES ET RECHERCHE (Client-side) ==========

  /**
   * Recherche dans les paiements (filtrage local)
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @param {string} query - Terme de recherche
   * @returns {Array<PaiementDTO>} Paiements filtrés
   */
  searchPaiements: (paiements, query) => {
    if (!query?.trim()) return paiements;

    const lowerQuery = query.toLowerCase().trim();
    return paiements.filter(p =>
      p.nomLocataire?.toLowerCase().includes(lowerQuery) ||
      p.bienRef?.toLowerCase().includes(lowerQuery) ||
      p.proprietaireNom?.toLowerCase().includes(lowerQuery) ||
      p.id?.toString().includes(lowerQuery) ||
      p.refTrans?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filtre les paiements par statut
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @param {string} statut - Statut (PAYE, EN_ATTENTE, EN_RETARD)
   * @returns {Array<PaiementDTO>} Paiements filtrés
   */
  filterByStatut: (paiements, statut) => {
    if (!statut || statut === 'all') return paiements;
    return paiements.filter(p => p.statut === statut);
  },

  /**
   * Filtre les paiements par période d'échéance
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @param {string} dateDebut - Date de début (YYYY-MM-DD)
   * @param {string} dateFin - Date de fin (YYYY-MM-DD)
   * @returns {Array<PaiementDTO>} Paiements filtrés
   */
  filterByPeriode: (paiements, dateDebut, dateFin) => {
    if (!dateDebut && !dateFin) return paiements;

    return paiements.filter(p => {
      if (!p.dateEcheance) return false;
      
      const dateEcheance = new Date(p.dateEcheance);
      const debut = dateDebut ? new Date(dateDebut) : new Date(0);
      const fin = dateFin ? new Date(dateFin) : new Date(9999, 11, 31);
      
      return dateEcheance >= debut && dateEcheance <= fin;
    });
  },

  /**
   * Trie les paiements
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @param {string} sortBy - Champ de tri
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array<PaiementDTO>} Liste triée
   */
  sortPaiements: (paiements, sortBy = 'dateEcheance', order = 'desc') => {
    const statutOrder = { EN_RETARD: 3, EN_ATTENTE: 2, PAYE: 1 };

    return [...paiements].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dateEcheance':
          comparison = new Date(a.dateEcheance || 0) - new Date(b.dateEcheance || 0);
          break;
        case 'datePaiement':
          comparison = new Date(a.datePaiement || 0) - new Date(b.datePaiement || 0);
          break;
        case 'montant':
          comparison = (a.montant || 0) - (b.montant || 0);
          break;
        case 'statut':
          comparison = (statutOrder[a.statut] || 0) - (statutOrder[b.statut] || 0);
          break;
        case 'nomLocataire':
          comparison = (a.nomLocataire || '').localeCompare(b.nomLocataire || '');
          break;
        case 'proprietaireNom':
          comparison = (a.proprietaireNom || '').localeCompare(b.proprietaireNom || '');
          break;
        case 'bienRef':
          comparison = (a.bienRef || '').localeCompare(b.bienRef || '');
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  },

  // ========== STATISTIQUES ==========

  /**
   * Calcule les statistiques des paiements
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @returns {Object} Statistiques complètes
   */
  getStatistics: (paiements) => {
    const total = paiements.length;
    const payes = paiements.filter(p => p.statut === 'PAYE').length;
    const enAttente = paiements.filter(p => p.statut === 'EN_ATTENTE').length;
    const enRetard = paiements.filter(p => p.statut === 'EN_RETARD').length;
    
    const montantTotal = paiements.reduce((sum, p) => sum + (p.montant || 0), 0);
    const montantPaye = paiements
      .filter(p => p.statut === 'PAYE')
      .reduce((sum, p) => sum + (p.montant || 0), 0);
    const montantEnAttente = paiements
      .filter(p => p.statut === 'EN_ATTENTE')
      .reduce((sum, p) => sum + (p.montant || 0), 0);
    const montantEnRetard = paiements
      .filter(p => p.statut === 'EN_RETARD')
      .reduce((sum, p) => sum + (p.montant || 0), 0);

    const tauxPaiement = total > 0 ? (payes / total) * 100 : 0;
    const tauxRecouvrement = montantTotal > 0 ? (montantPaye / montantTotal) * 100 : 0;

    return {
      total,
      payes,
      enAttente,
      enRetard,
      montantTotal,
      montantPaye,
      montantEnAttente,
      montantEnRetard,
      tauxPaiement,
      tauxRecouvrement,
    };
  },

  // ========== UTILITAIRES ==========

  /**
   * Configuration des statuts avec couleurs et icônes
   * @param {string} statut - Statut du paiement
   * @returns {Object} Configuration de style
   */
  getStatutConfig: (statut) => {
    const config = {
      PAYE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Payé',
        icon: '✓',
        badgeVariant: 'success',
      },
      EN_ATTENTE: {
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        label: 'En attente',
        icon: '⏳',
        badgeVariant: 'warning',
      },
      EN_RETARD: {
        color: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/20',
        label: 'En retard',
        icon: '⚠',
        badgeVariant: 'destructive',
      },
    };

    return config[statut] || config.EN_ATTENTE;
  },

  /**
   * Vérifie si un paiement est en retard
   * @param {PaiementDTO} paiement - Objet paiement
   * @returns {boolean} True si en retard
   */
  isEnRetard: (paiement) => {
    return paiement.statut === 'EN_RETARD';
  },

  /**
   * Calcule le nombre de jours de retard
   * @param {string} dateEcheance - Date d'échéance (ISO string)
   * @returns {number} Nombre de jours de retard (0 si pas de retard)
   */
  getJoursRetard: (dateEcheance) => {
    if (!dateEcheance) return 0;
    
    const echeance = new Date(dateEcheance);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    echeance.setHours(0, 0, 0, 0);
    
    if (echeance >= today) return 0;
    
    const diffTime = Math.abs(today - echeance);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Formate un montant en FCFA
   * @param {number} montant - Montant
   * @returns {string} Montant formaté
   */
  formatMontant: (montant) => {
    if (montant === null || montant === undefined) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(montant) + ' FCFA';
  },

  /**
   * Formate une date ISO en format français
   * @param {string} date - Date ISO (YYYY-MM-DD)
   * @returns {string} Date formatée
   */
  formatDate: (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Date invalide';
    }
  },

  /**
   * Formate une date et heure complète
   * @param {string} dateTime - DateTime ISO
   * @returns {string} Date et heure formatées
   */
  formatDateTime: (dateTime) => {
    if (!dateTime) return 'N/A';
    try {
      return new Date(dateTime).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Date invalide';
    }
  },

  /**
   * Génère un message de relance par défaut
   * @param {PaiementDTO} paiement - Objet paiement
   * @returns {string} Message de relance
   */
  genererMessageRelance: (paiement) => {
    const joursRetard = paiementsService.getJoursRetard(paiement.dateEcheance);
    const montant = paiementsService.formatMontant(paiement.montant);
    const dateEcheance = paiementsService.formatDate(paiement.dateEcheance);

    if (paiement.statut === 'EN_RETARD') {
      return `Bonjour ${paiement.nomLocataire},

Nous vous rappelons que votre loyer pour le bien ${paiement.bienRef} d'un montant de ${montant} est en retard de ${joursRetard} jour${joursRetard > 1 ? 's' : ''}.

Date d'échéance : ${dateEcheance}

Merci de régulariser votre situation dans les plus brefs délais.

Cordialement,
L'équipe de gestion`;
    }

    return `Bonjour ${paiement.nomLocataire},

Nous vous rappelons que votre loyer pour le bien ${paiement.bienRef} d'un montant de ${montant} arrive à échéance le ${dateEcheance}.

Merci de procéder au paiement avant cette date.

Cordialement,
L'équipe de gestion`;
  },

  /**
   * Exporte les paiements en CSV
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @returns {string} Contenu CSV
   */
  exportToCSV: (paiements) => {
    const headers = 'ID;Locataire;Bien;Propriétaire;Montant;Échéance;Date Paiement;Statut;Mode Paiement;Référence\n';
    const rows = paiements.map(p =>
      `${p.id};${p.nomLocataire || ''};${p.bienRef || ''};${p.proprietaireNom || ''};${p.montant || 0};${p.dateEcheance || ''};${p.datePaiement || ''};${p.statut || ''};${p.modePaiement || ''};${p.refTrans || ''}`
    ).join('\n');

    return headers + rows;
  },

  /**
   * Télécharge le CSV des paiements
   * @param {Array<PaiementDTO>} paiements - Liste des paiements
   * @param {string} filename - Nom du fichier
   */
  downloadCSV: (paiements, filename = 'paiements.csv') => {
    const csv = paiementsService.exportToCSV(paiements);
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Types de relance disponibles (doit correspondre au backend)
   */
  TYPE_RELANCE: {
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    COURRIER: 'COURRIER',
    TELEPHONE: 'TELEPHONE',
  },

  /**
   * Modes de paiement disponibles
   */
  MODE_PAIEMENT: {
    ESPECES: 'ESPECES',
    VIREMENT: 'VIREMENT',
    CHEQUE: 'CHEQUE',
    CARTE: 'CARTE',
    MOBILE_MONEY: 'MOBILE_MONEY',
  },
};

export default paiementsService;