// src/services/paiements.js
import appConfig from '../../../routes/route';

/**
 * Service pour gérer les paiements d'un gestionnaire
 */
export const paiementsService = {
  /**
   * Récupère la liste des paiements d'un gestionnaire
   * @param {number} gestionnaireId - ID du gestionnaire
   * @returns {Promise<Array>} Liste des paiements
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des paiements');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paiements:', error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'un paiement
   * @param {number} paiementId - ID du paiement
   * @returns {Promise<Object>} Détails du paiement
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des détails du paiement');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  },

  /**
   * Envoie une relance pour un paiement
   * @param {number} paiementId - ID du paiement
   * @param {Object} relanceData - { typeRelance: string, messagePersonnalise: string }
   * @returns {Promise<Object>} Résultat de la relance
   */
  envoyerRelance: async (paiementId, relanceData) => {
    try {
      const response = await fetch(appConfig.api.relance_paiement(paiementId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relanceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi de la relance');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la relance:', error);
      throw error;
    }
  },

  /**
   * Recherche dans les paiements
   * @param {Array} paiements - Liste des paiements
   * @param {string} query - Terme de recherche
   * @returns {Array} Paiements filtrés
   */
  searchPaiements: (paiements, query) => {
    if (!query) return paiements;

    const lowerQuery = query.toLowerCase();
    return paiements.filter(p =>
      p.nomLocataire?.toLowerCase().includes(lowerQuery) ||
      p.bienRef?.toLowerCase().includes(lowerQuery) ||
      p.proprietaireNom?.toLowerCase().includes(lowerQuery) ||
      p.id?.toString().includes(lowerQuery)
    );
  },

  /**
   * Filtre les paiements par statut
   * @param {Array} paiements - Liste des paiements
   * @param {string} statut - Statut (PAYE, EN_ATTENTE, EN_RETARD)
   * @returns {Array} Paiements filtrés
   */
  filterByStatut: (paiements, statut) => {
    if (!statut) return paiements;
    return paiements.filter(p => p.statut === statut);
  },

  /**
   * Filtre les paiements par période
   * @param {Array} paiements - Liste des paiements
   * @param {string} dateDebut - Date de début (YYYY-MM-DD)
   * @param {string} dateFin - Date de fin (YYYY-MM-DD)
   * @returns {Array} Paiements filtrés
   */
  filterByPeriode: (paiements, dateDebut, dateFin) => {
    if (!dateDebut && !dateFin) return paiements;

    return paiements.filter(p => {
      const dateEcheance = new Date(p.dateEcheance);
      const debut = dateDebut ? new Date(dateDebut) : new Date(0);
      const fin = dateFin ? new Date(dateFin) : new Date(9999, 11, 31);
      
      return dateEcheance >= debut && dateEcheance <= fin;
    });
  },

  /**
   * Trie les paiements
   * @param {Array} paiements - Liste des paiements
   * @param {string} sortBy - Champ de tri
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array} Liste triée
   */
  sortPaiements: (paiements, sortBy = 'dateEcheance', order = 'desc') => {
    const statutOrder = { EN_RETARD: 3, EN_ATTENTE: 2, PAYE: 1 };

    return [...paiements].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dateEcheance':
          comparison = new Date(a.dateEcheance) - new Date(b.dateEcheance);
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
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Calcule les statistiques des paiements
   * @param {Array} paiements - Liste des paiements
   * @returns {Object} Statistiques
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
    };
  },

  /**
   * Obtient la configuration de couleur selon le statut
   * @param {string} statut - Statut du paiement
   * @returns {Object} Configuration
   */
  getStatutConfig: (statut) => {
    const config = {
      PAYE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Payé',
        icon: '✓',
      },
      EN_ATTENTE: {
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        label: 'En attente',
        icon: '⏳',
      },
      EN_RETARD: {
        color: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/20',
        label: 'En retard',
        icon: '⚠',
      },
      PARTIEL: {
        color: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/20',
        label: 'Partiel',
        icon: '◐',
      },
    };

    return config[statut] || config.EN_ATTENTE;
  },

  /**
   * Vérifie si un paiement est en retard
   * @param {Object} paiement - Objet paiement
   * @returns {boolean} True si en retard
   */
  isEnRetard: (paiement) => {
    if (paiement.statut === 'PAYE') return false;
    
    const dateEcheance = new Date(paiement.dateEcheance);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return dateEcheance < today;
  },

  /**
   * Calcule le nombre de jours de retard
   * @param {string} dateEcheance - Date d'échéance
   * @returns {number} Nombre de jours de retard (0 si pas de retard)
   */
  getJoursRetard: (dateEcheance) => {
    const echeance = new Date(dateEcheance);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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
    if (!montant && montant !== 0) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + ' FCFA';
  },

  /**
   * Formate une date
   * @param {string} date - Date ISO
   * @returns {string} Date formatée
   */
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Génère un message de relance par défaut
   * @param {Object} paiement - Objet paiement
   * @returns {string} Message de relance
   */
  genererMessageRelance: (paiement) => {
    const joursRetard = paiementsService.getJoursRetard(paiement.dateEcheance);
    const montant = paiementsService.formatMontant(paiement.montant);

    if (paiement.statut === 'EN_RETARD') {
      return `Bonjour ${paiement.nomLocataire},\n\nNous vous rappelons que votre loyer pour le bien ${paiement.bienRef} d'un montant de ${montant} est en retard de ${joursRetard} jour(s).\n\nDate d'échéance : ${paiementsService.formatDate(paiement.dateEcheance)}\n\nMerci de régulariser votre situation dans les plus brefs délais.\n\nCordialement,\nL'équipe de gestion`;
    }

    return `Bonjour ${paiement.nomLocataire},\n\nNous vous rappelons que votre loyer pour le bien ${paiement.bienRef} d'un montant de ${montant} arrive à échéance le ${paiementsService.formatDate(paiement.dateEcheance)}.\n\nMerci de procéder au paiement avant cette date.\n\nCordialement,\nL'équipe de gestion`;
  },

  /**
   * Exporte les paiements en CSV
   * @param {Array} paiements - Liste des paiements
   * @returns {string} Contenu CSV
   */
  exportToCSV: (paiements) => {
    const headers = 'ID,Locataire,Bien,Propriétaire,Montant,Échéance,Statut\n';
    const rows = paiements.map(p =>
      `${p.id},${p.nomLocataire},${p.bienRef},${p.proprietaireNom},${p.montant},${p.dateEcheance},${p.statut}`
    ).join('\n');

    return headers + rows;
  },

  /**
   * Types de relance disponibles
   */
  TYPE_RELANCE: {
    EMAIL: 'EMAIL',
    SMS: 'SMS',
    COURRIER: 'COURRIER',
    TELEPHONE: 'TELEPHONE',
  },
};