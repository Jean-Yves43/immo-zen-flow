// src/services/list_maintenance.js
import appConfig from '../../../routes/route';


/**
 * Service pour gérer les maintenances d'un gestionnaire
 */
export const maintenanceService = {
  /**
   * Récupère la liste des maintenances d'un gestionnaire avec filtres optionnels
   * @param {number} gestionnaireId - ID du gestionnaire
   * @param {Object} filters - Filtres optionnels { statut, categorie, urgence, dateDebut, dateFin }
   * @returns {Promise<Object>} { maintenances: Array, nbrTotalMaintenances: number, nbrParStatut: Object }
   */
  getMaintenances: async (gestionnaireId, filters = {}) => {
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.categorie) params.append('categorie', filters.categorie);
      if (filters.urgence) params.append('urgence', filters.urgence);
      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);

      const url = `${appConfig.api.list_maintenancesGestionnaire(gestionnaireId)}${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des maintenances');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des maintenances:', error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'une maintenance
   * @param {number} maintenanceId - ID de la maintenance
   * @returns {Promise<Object>} Détails complets de la maintenance
   */
  getDetailsMaintenance: async (maintenanceId) => {
    try {
      const response = await fetch(appConfig.api.details_maintenance(maintenanceId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des détails de la maintenance');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  },

  /**
   * Recherche dans les maintenances
   * @param {Array} maintenances - Liste des maintenances
   * @param {string} query - Terme de recherche
   * @returns {Array} Maintenances filtrées
   */
  searchMaintenances: (maintenances, query) => {
    if (!query) return maintenances;

    const lowerQuery = query.toLowerCase();
    return maintenances.filter(m =>
      m.titre?.toLowerCase().includes(lowerQuery) ||
      m.bienRef?.toLowerCase().includes(lowerQuery) ||
      m.nomLocataire?.toLowerCase().includes(lowerQuery) ||
      m.prestataireNom?.toLowerCase().includes(lowerQuery) ||
      m.typeMaintenance?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Trie les maintenances
   * @param {Array} maintenances - Liste des maintenances
   * @param {string} sortBy - Champ de tri (dateDemande, urgence, statut, typeMaintenance)
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array} Liste triée
   */
  sortMaintenances: (maintenances, sortBy = 'dateDemande', order = 'desc') => {
    const urgenceOrder = { CRITIQUE: 4, HAUTE: 3, MOYENNE: 2, FAIBLE: 1 };
    const statutOrder = { CRITIQUE: 5, EN_ATTENTE: 4, EN_COURS: 3, TERMINEE: 2, ANNULEE: 1 };

    return [...maintenances].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'dateDemande':
          comparison = new Date(a.dateDemande) - new Date(b.dateDemande);
          break;
        case 'urgence':
          comparison = (urgenceOrder[a.urgence] || 0) - (urgenceOrder[b.urgence] || 0);
          break;
        case 'statut':
          comparison = (statutOrder[a.statut] || 0) - (statutOrder[b.statut] || 0);
          break;
        case 'typeMaintenance':
          comparison = (a.typeMaintenance || '').localeCompare(b.typeMaintenance || '');
          break;
        case 'nomLocataire':
          comparison = (a.nomLocataire || '').localeCompare(b.nomLocataire || '');
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Obtient la configuration de couleur selon l'urgence
   * @param {string} urgence - Niveau d'urgence
   * @returns {Object} Configuration { color, bgColor, label }
   */
  getUrgenceConfig: (urgence) => {
    const config = {
      CRITIQUE: {
        color: 'text-red-700 dark:text-red-400',
        bgColor: 'bg-red-500/10 border-red-500/20',
        label: 'Critique',
        dotColor: 'bg-red-500',
      },
      HAUTE: {
        color: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/20',
        label: 'Haute',
        dotColor: 'bg-orange-500',
      },
      MOYENNE: {
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        label: 'Moyenne',
        dotColor: 'bg-yellow-500',
      },
      FAIBLE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Faible',
        dotColor: 'bg-green-500',
      },
    };

    return config[urgence] || config.MOYENNE;
  },

  /**
   * Obtient la configuration de couleur selon le statut
   * @param {string} statut - Statut de la maintenance
   * @returns {Object} Configuration { color, bgColor, label }
   */
  getStatutConfig: (statut) => {
    const config = {
      EN_ATTENTE: {
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        label: 'En attente',
      },
      EN_COURS: {
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
        label: 'En cours',
      },
      TERMINEE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Terminée',
      },
      ANNULEE: {
        color: 'text-gray-700 dark:text-gray-400',
        bgColor: 'bg-gray-500/10 border-gray-500/20',
        label: 'Annulée',
      },
    };

    return config[statut] || config.EN_ATTENTE;
  },

  /**
   * Obtient l'icône selon le type de maintenance
   * @param {string} type - Type de maintenance
   * @returns {string} Nom de l'icône
   */
  getTypeIcon: (type) => {
    const icons = {
      PLOMBERIE: 'Droplet',
      ELECTRICITE: 'Zap',
      PEINTURE: 'Paintbrush',
      MENUISERIE: 'Hammer',
      SERRURERIE: 'Key',
      CLIMATISATION: 'Wind',
      AUTRE: 'Wrench',
    };

    return icons[type] || 'Wrench';
  },

  /**
   * Formate une date
   * @param {string} date - Date au format ISO
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
   * Calcule le nombre de jours depuis la demande
   * @param {string} dateDemande - Date de la demande
   * @returns {number} Nombre de jours
   */
  getDaysSinceDemande: (dateDemande) => {
    if (!dateDemande) return 0;
    const now = new Date();
    const demande = new Date(dateDemande);
    const diffTime = Math.abs(now - demande);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Vérifie si une maintenance est urgente et en retard
   * @param {Object} maintenance - Objet maintenance
   * @returns {boolean} True si urgente et non terminée depuis > 2 jours
   */
  isOverdue: (maintenance) => {
    if (maintenance.statut === 'TERMINEE' || maintenance.statut === 'ANNULEE') {
      return false;
    }
    
    const days = maintenanceService.getDaysSinceDemande(maintenance.dateDemande);
    const urgentLevels = ['CRITIQUE', 'HAUTE'];
    
    return urgentLevels.includes(maintenance.urgence) && days > 2;
  },

  /**
   * Vérifie si une maintenance a un prestataire assigné
   * @param {Object} maintenance - Objet maintenance
   * @returns {boolean} True si prestataire assigné
   */
  hasPrestataire: (maintenance) => {
    return !!(maintenance.prestataireId && maintenance.prestataireNom);
  },

  /**
   * Calcule la durée de résolution (si résolu)
   * @param {Object} maintenance - Détails de la maintenance
   * @returns {number|null} Nombre de jours ou null si non résolu
   */
  getDureeResolution: (maintenance) => {
    if (!maintenance.dateResolution || !maintenance.dateDemande) return null;
    
    const demande = new Date(maintenance.dateDemande);
    const resolution = new Date(maintenance.dateResolution);
    const diffTime = Math.abs(resolution - demande);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  },

  /**
   * Formate les informations de contact
   * @param {Object} details - Détails de la maintenance
   * @param {string} type - Type de contact (locataire, proprietaire, prestataire)
   * @returns {Object} Informations formatées { nom, email, tel }
   */
  getContactInfo: (details, type) => {
    const prefix = type.toLowerCase();
    return {
      id: details[`${prefix}Id`],
      nom: details[`${prefix}Nom`] || 'Non renseigné',
      email: details[`${prefix}Email`] || 'Non renseigné',
      tel: details[`${prefix}Tel`] || 'Non renseigné',
      specialite: type === 'prestataire' ? details[`${prefix}Specialite`] : null,
    };
  },

  /**
   * Obtient la configuration de couleur selon le statut des détails
   * @param {string} statut - Statut de la maintenance (RESOLUE, EN_COURS, etc.)
   * @returns {Object} Configuration { color, bgColor, label }
   */
  getStatutDetailsConfig: (statut) => {
    const config = {
      EN_ATTENTE: {
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        label: 'En attente',
        icon: '⏳',
      },
      EN_COURS: {
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
        label: 'En cours',
        icon: '🔧',
      },
      RESOLUE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Résolue',
        icon: '✓',
      },
      TERMINEE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Terminée',
        icon: '✓',
      },
      ANNULEE: {
        color: 'text-gray-700 dark:text-gray-400',
        bgColor: 'bg-gray-500/10 border-gray-500/20',
        label: 'Annulée',
        icon: '✗',
      },
    };

    return config[statut] || config.EN_ATTENTE;
  },

  /**
   * Exporte les maintenances en CSV
   * @param {Array} maintenances - Liste des maintenances
   * @returns {string} Contenu CSV
   */
  exportToCSV: (maintenances) => {
    const headers = 'ID,Type,Titre,Bien,Locataire,Date,Prestataire,Statut,Urgence\n';
    const rows = maintenances.map(m => 
      `${m.id},${m.typeMaintenance},${m.titre},${m.bienRef},${m.nomLocataire},${m.dateDemande},${m.prestataireNom},${m.statut},${m.urgence}`
    ).join('\n');
    
    return headers + rows;
  },
};