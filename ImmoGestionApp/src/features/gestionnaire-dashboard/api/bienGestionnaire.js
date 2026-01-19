// src/services/bienGestionnaire.js
import appConfig from '../../../routes/route';

/**
 * Service pour gérer les biens d'un gestionnaire
 */
export const bienGestionnaireService = {
  /**
   * Récupère la liste des biens d'un gestionnaire
   * @param {number} gestionnaireId - ID du gestionnaire
   * @returns {Promise<Array>} Liste des biens
   */
  getBiens: async (gestionnaireId) => {
    try {
      const response = await fetch(appConfig.api.list_biensGestionnaire(gestionnaireId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des biens');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des biens:', error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'un bien
   * @param {number} bienId - ID du bien
   * @returns {Promise<Object>} Détails complets du bien
   */
  getDetailsBien: async (bienId) => {
    try {
      const response = await fetch(appConfig.api.details_bienGestionnaire(bienId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des détails du bien');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  },

  /**
   * Recherche dans les biens
   * @param {Array} biens - Liste des biens
   * @param {string} query - Terme de recherche
   * @returns {Array} Biens filtrés
   */
  searchBiens: (biens, query) => {
    if (!query) return biens;

    const lowerQuery = query.toLowerCase();
    return biens.filter(bien =>
      bien.ref?.toLowerCase().includes(lowerQuery) ||
      bien.typeBien?.toLowerCase().includes(lowerQuery) ||
      bien.proprietaireNom?.toLowerCase().includes(lowerQuery) ||
      bien.quartierNom?.toLowerCase().includes(lowerQuery) ||
      bien.villeNom?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filtre les biens par statut
   * @param {Array} biens - Liste des biens
   * @param {string} statut - Statut à filtrer
   * @returns {Array} Biens filtrés
   */
  filterByStatut: (biens, statut) => {
    if (!statut) return biens;
    return biens.filter(bien => bien.statut === statut);
  },

  /**
   * Filtre les biens par type
   * @param {Array} biens - Liste des biens
   * @param {string} type - Type de bien
   * @returns {Array} Biens filtrés
   */
  filterByType: (biens, type) => {
    if (!type) return biens;
    return biens.filter(bien => bien.typeBien === type);
  },

  /**
   * Filtre les biens loués
   * @param {Array} biens - Liste des biens
   * @param {boolean} estLoue - true pour loués, false pour non loués
   * @returns {Array} Biens filtrés
   */
  filterByLoue: (biens, estLoue) => {
    if (estLoue === null || estLoue === undefined) return biens;
    return biens.filter(bien => bien.estLoue === estLoue);
  },

  /**
   * Trie les biens
   * @param {Array} biens - Liste des biens
   * @param {string} sortBy - Champ de tri
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array} Liste triée
   */
  sortBiens: (biens, sortBy = 'dateAjout', order = 'desc') => {
    return [...biens].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'ref':
          comparison = (a.ref || '').localeCompare(b.ref || '');
          break;
        case 'prixApt':
          comparison = (a.prixApt || 0) - (b.prixApt || 0);
          break;
        case 'surface':
          comparison = (a.surface || 0) - (b.surface || 0);
          break;
        case 'nbrChambres':
          comparison = (a.nbrChambres || 0) - (b.nbrChambres || 0);
          break;
        case 'dateAjout':
          comparison = new Date(a.dateAjout) - new Date(b.dateAjout);
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
   * Calcule les statistiques des biens
   * @param {Array} biens - Liste des biens
   * @returns {Object} Statistiques
   */
  getStatistics: (biens) => {
    const total = biens.length;
    const disponibles = biens.filter(b => b.statut === 'DISPONIBLE').length;
    const loues = biens.filter(b => b.estLoue).length;
    const vendus = biens.filter(b => b.estVendu).length;
    const totalValeur = biens.reduce((sum, b) => sum + (b.prixApt || 0), 0);
    const prixMoyen = total > 0 ? totalValeur / total : 0;

    // Stats par type
    const parType = {};
    biens.forEach(bien => {
      const type = bien.typeBien || 'Non défini';
      parType[type] = (parType[type] || 0) + 1;
    });

    return {
      total,
      disponibles,
      loues,
      vendus,
      totalValeur,
      prixMoyen,
      parType,
    };
  },

  /**
   * Obtient la configuration de couleur selon le statut
   * @param {string} statut - Statut du bien
   * @returns {Object} Configuration
   */
  getStatutConfig: (statut) => {
    const config = {
      DISPONIBLE: {
        color: 'text-green-700 dark:text-green-400',
        bgColor: 'bg-green-500/10 border-green-500/20',
        label: 'Disponible',
      },
      LOUE: {
        color: 'text-blue-700 dark:text-blue-400',
        bgColor: 'bg-blue-500/10 border-blue-500/20',
        label: 'Loué',
      },
      RESERVE: {
        color: 'text-orange-700 dark:text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/20',
        label: 'Réservé',
      },
      VENDU: {
        color: 'text-gray-700 dark:text-gray-400',
        bgColor: 'bg-gray-500/10 border-gray-500/20',
        label: 'Vendu',
      },
      EN_TRAVAUX: {
        color: 'text-yellow-700 dark:text-yellow-400',
        bgColor: 'bg-yellow-500/10 border-yellow-500/20',
        label: 'En travaux',
      },
    };

    return config[statut] || config.DISPONIBLE;
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
   * Formate une surface
   * @param {number} surface - Surface en m²
   * @returns {string} Surface formatée
   */
  formatSurface: (surface) => {
    if (!surface && surface !== 0) return 'N/A';
    return `${surface} m²`;
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
   * Obtient l'adresse complète
   * @param {Object} bien - Objet bien
   * @returns {string} Adresse formatée
   */
  getAdresseComplete: (bien) => {
    const parts = [
      bien.quartierNom,
      bien.communeNom,
      bien.villeNom,
    ].filter(Boolean);
    
    return parts.join(', ') || 'Adresse non disponible';
  },

  /**
   * Obtient la liste des équipements d'un bien
   * @param {Object} bien - Détails du bien
   * @returns {Array} Liste des équipements présents
   */
  getEquipements: (bien) => {
    const equipements = [
      { key: 'balcon', label: 'Balcon', icon: '🏔️' },
      { key: 'jardin', label: 'Jardin', icon: '🌳' },
      { key: 'parking', label: 'Parking', icon: '🚗' },
      { key: 'garage', label: 'Garage', icon: '🏠' },
      { key: 'terrasse', label: 'Terrasse', icon: '☀️' },
      { key: 'piscine', label: 'Piscine', icon: '🏊' },
      { key: 'equipee', label: 'Cuisine équipée', icon: '🍳' },
      { key: 'ascenseur', label: 'Ascenseur', icon: '🛗' },
      { key: 'gardien', label: 'Gardien', icon: '👮' },
    ];

    return equipements.filter(eq => bien[eq.key] === true);
  },

  /**
   * Exporte les biens en CSV
   * @param {Array} biens - Liste des biens
   * @returns {string} Contenu CSV
   */
  exportToCSV: (biens) => {
    const headers = 'Ref,Type,Statut,Prix,Surface,Chambres,Propriétaire,Quartier,Ville,Loué,Vendu\n';
    const rows = biens.map(b =>
      `${b.ref},${b.typeBien},${b.statut},${b.prixApt || 0},${b.surface || 0},${b.nbrChambres || 0},${b.proprietaireNom},${b.quartierNom},${b.villeNom},${b.estLoue ? 'Oui' : 'Non'},${b.estVendu ? 'Oui' : 'Non'}`
    ).join('\n');

    return headers + rows;
  },
};