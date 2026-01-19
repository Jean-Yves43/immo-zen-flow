// src/services/stats.js
import appConfig from '../../../routes/route';

/**
 * Service pour gérer les statistiques d'un gestionnaire
 */
export const statsService = {
  /**
   * Récupère les statistiques globales d'un gestionnaire
   * @param {number} gestionnaireId - ID du gestionnaire
   * @param {Object} filters - Filtres optionnels { dateDebut, dateFin }
   * @returns {Promise<Object>} Statistiques globales
   */
  getStatistiques: async (gestionnaireId, filters = {}) => {
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams();

      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);

      const url = `${appConfig.api.stats(gestionnaireId)}${
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
        throw new Error(errorData.message || 'Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  },

  /**
   * Récupère les revenus par propriétaire
   * @param {number} gestionnaireId - ID du gestionnaire
   * @param {Object} filters - Filtres optionnels { dateDebut, dateFin }
   * @returns {Promise<Object>} { revenus: Array, periode: string, totalProprietaires: number }
   */
  getRevenus: async (gestionnaireId, filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.dateDebut) params.append('dateDebut', filters.dateDebut);
      if (filters.dateFin) params.append('dateFin', filters.dateFin);

      const url = `${appConfig.api.revenues(gestionnaireId)}${
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
        throw new Error(errorData.message || 'Erreur lors de la récupération des revenus');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des revenus:', error);
      throw error;
    }
  },

  /**
   * Calcule les statistiques globales des revenus
   * @param {Array} revenus - Liste des revenus par propriétaire
   * @returns {Object} Statistiques globales
   */
  getRevenusStatistics: (revenus) => {
    let totalRevenus = 0;
    let totalRevenusRecus = 0;
    let totalRevenusEnAttente = 0;
    let totalBiens = 0;
    let totalBiensLoues = 0;
    let totalPaiements = 0;
    let totalPaiementsRecus = 0;

    revenus.forEach(r => {
      totalRevenus += r.totalRevenus || 0;
      totalRevenusRecus += r.revenusRecus || 0;
      totalRevenusEnAttente += r.revenusEnAttente || 0;
      totalBiens += r.nbrBiens || 0;
      totalBiensLoues += r.nbrBiensLoues || 0;
      totalPaiements += r.nbrPaiements || 0;
      totalPaiementsRecus += r.nbrPaiementsRecus || 0;
    });

    const tauxRecouvrement = totalRevenus > 0 ? (totalRevenusRecus / totalRevenus) * 100 : 0;
    const tauxPaiement = totalPaiements > 0 ? (totalPaiementsRecus / totalPaiements) * 100 : 0;

    return {
      totalRevenus,
      totalRevenusRecus,
      totalRevenusEnAttente,
      totalBiens,
      totalBiensLoues,
      totalPaiements,
      totalPaiementsRecus,
      tauxRecouvrement,
      tauxPaiement,
      revenuMoyenParProprietaire: revenus.length > 0 ? totalRevenus / revenus.length : 0,
    };
  },

  /**
   * Recherche dans les revenus
   * @param {Array} revenus - Liste des revenus
   * @param {string} query - Terme de recherche
   * @returns {Array} Revenus filtrés
   */
  searchRevenus: (revenus, query) => {
    if (!query) return revenus;

    const lowerQuery = query.toLowerCase();
    return revenus.filter(r =>
      r.proprietaireNom?.toLowerCase().includes(lowerQuery) ||
      r.proprietaireEmail?.toLowerCase().includes(lowerQuery) ||
      r.proprietaireId?.toString().includes(lowerQuery)
    );
  },

  /**
   * Trie les revenus
   * @param {Array} revenus - Liste des revenus
   * @param {string} sortBy - Champ de tri
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array} Liste triée
   */
  sortRevenus: (revenus, sortBy = 'totalRevenus', order = 'desc') => {
    return [...revenus].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'proprietaireNom':
          comparison = (a.proprietaireNom || '').localeCompare(b.proprietaireNom || '');
          break;
        case 'totalRevenus':
          comparison = (a.totalRevenus || 0) - (b.totalRevenus || 0);
          break;
        case 'revenusRecus':
          comparison = (a.revenusRecus || 0) - (b.revenusRecus || 0);
          break;
        case 'revenusEnAttente':
          comparison = (a.revenusEnAttente || 0) - (b.revenusEnAttente || 0);
          break;
        case 'nbrBiens':
          comparison = (a.nbrBiens || 0) - (b.nbrBiens || 0);
          break;
        case 'nbrBiensLoues':
          comparison = (a.nbrBiensLoues || 0) - (b.nbrBiensLoues || 0);
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Filtre les propriétaires avec revenus en attente
   * @param {Array} revenus - Liste des revenus
   * @returns {Array} Propriétaires avec revenus en attente
   */
  filterRevenusEnAttente: (revenus) => {
    return revenus.filter(r => (r.revenusEnAttente || 0) > 0);
  },

  /**
   * Filtre les propriétaires sans revenus
   * @param {Array} revenus - Liste des revenus
   * @returns {Array} Propriétaires sans revenus
   */
  filterSansRevenus: (revenus) => {
    return revenus.filter(r => (r.totalRevenus || 0) === 0);
  },

  /**
   * Obtient les données pour un graphique de revenus par propriétaire (top 10)
   * @param {Array} revenus - Liste des revenus
   * @returns {Array} Données pour graphique
   */
  getRevenusChartData: (revenus) => {
    const sorted = statsService.sortRevenus(revenus, 'totalRevenus', 'desc');
    const top10 = sorted.slice(0, 10);

    return top10.map(r => ({
      name: r.proprietaireNom || 'Inconnu',
      revenue: r.totalRevenus || 0,
      revenusRecus: r.revenusRecus || 0,
      revenusEnAttente: r.revenusEnAttente || 0,
    }));
  },

  /**
   * Obtient les données pour un graphique en anneau (revenus reçus vs en attente)
   * @param {Object} stats - Statistiques globales des revenus
   * @returns {Array} Données pour graphique
   */
  getRevenusDonutData: (stats) => {
    return [
      {
        name: 'Revenus reçus',
        value: stats.totalRevenusRecus || 0,
        color: '#10b981', // green
        percentage: stats.totalRevenus > 0
          ? (stats.totalRevenusRecus / stats.totalRevenus) * 100
          : 0,
      },
      {
        name: 'Revenus en attente',
        value: stats.totalRevenusEnAttente || 0,
        color: '#f59e0b', // orange
        percentage: stats.totalRevenus > 0
          ? (stats.totalRevenusEnAttente / stats.totalRevenus) * 100
          : 0,
      },
    ].filter(item => item.value > 0);
  },

  /**
   * Calcule le taux de recouvrement d'un propriétaire
   * @param {Object} revenu - Objet revenu d'un propriétaire
   * @returns {number} Taux en pourcentage
   */
  getTauxRecouvrementProprietaire: (revenu) => {
    if (!revenu.totalRevenus || revenu.totalRevenus === 0) return 0;
    return (revenu.revenusRecus / revenu.totalRevenus) * 100;
  },

  /**
   * Exporte les revenus en CSV
   * @param {Array} revenus - Liste des revenus
   * @returns {string} Contenu CSV
   */
  exportRevenusToCSV: (revenus) => {
    const headers = 'Propriétaire,Email,Total Revenus,Revenus Reçus,Revenus En Attente,Biens,Biens Loués,Paiements,Paiements Reçus\n';
    const rows = revenus.map(r =>
      `${r.proprietaireNom},${r.proprietaireEmail},${r.totalRevenus || 0},${r.revenusRecus || 0},${r.revenusEnAttente || 0},${r.nbrBiens || 0},${r.nbrBiensLoues || 0},${r.nbrPaiements || 0},${r.nbrPaiementsRecus || 0}`
    ).join('\n');

    return headers + rows;
  },

  /**
   * Formate un montant en FCFA
   * @param {number} montant - Montant
   * @returns {string} Montant formaté
   */
  formatMontant: (montant) => {
    if (!montant && montant !== 0) return '0 FCFA';
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + ' FCFA';
  },

  /**
   * Calcule le taux d'occupation des biens
   * @param {Object} stats - Objet statistiques
   * @returns {number} Taux d'occupation en pourcentage
   */
  getTauxOccupation: (stats) => {
    if (!stats.totalBiens || stats.totalBiens === 0) return 0;
    return (stats.totalBiensLoues / stats.totalBiens) * 100;
  },

  /**
   * Calcule le taux de disponibilité
   * @param {Object} stats - Objet statistiques
   * @returns {number} Taux de disponibilité en pourcentage
   */
  getTauxDisponibilite: (stats) => {
    if (!stats.totalBiens || stats.totalBiens === 0) return 0;
    return (stats.totalBiensDisponibles / stats.totalBiens) * 100;
  },

  /**
   * Calcule le taux de maintenances terminées
   * @param {Object} stats - Objet statistiques
   * @returns {number} Taux en pourcentage
   */
  getTauxMaintenancesTerminees: (stats) => {
    if (!stats.totalMaintenances || stats.totalMaintenances === 0) return 0;
    return (stats.maintenancesTerminees / stats.totalMaintenances) * 100;
  },

  /**
   * Obtient les données pour un graphique de répartition des biens
   * @param {Object} stats - Objet statistiques
   * @returns {Array} Données pour graphique
   */
  getBiensChartData: (stats) => {
    const total = stats.totalBiens || 1;
    return [
      {
        name: 'Loués',
        value: stats.totalBiensLoues || 0,
        color: '#3b82f6', // blue
        percentage: (stats.totalBiensLoues / total) * 100,
      },
      {
        name: 'Disponibles',
        value: stats.totalBiensDisponibles || 0,
        color: '#10b981', // green
        percentage: (stats.totalBiensDisponibles / total) * 100,
      },
      {
        name: 'Vendus',
        value: stats.totalBiensVendus || 0,
        color: '#6b7280', // gray
        percentage: (stats.totalBiensVendus / total) * 100,
      },
    ].filter(item => item.value > 0);
  },

  /**
   * Obtient les données pour un graphique de paiements
   * @param {Object} stats - Objet statistiques
   * @returns {Array} Données pour graphique
   */
  getPaiementsChartData: (stats) => {
    const total = (stats.totalPaiementsEffectues || 0) + (stats.totalPaiementsAttendus || 0) || 1;
    return [
      {
        name: 'Effectués',
        value: stats.totalPaiementsEffectues || 0,
        color: '#10b981', // green
        percentage: (stats.totalPaiementsEffectues / total) * 100,
      },
      {
        name: 'Attendus',
        value: stats.totalPaiementsAttendus || 0,
        color: '#f59e0b', // orange
        percentage: (stats.totalPaiementsAttendus / total) * 100,
      },
    ].filter(item => item.value > 0);
  },

  /**
   * Obtient les données pour un graphique de maintenances
   * @param {Object} stats - Objet statistiques
   * @returns {Array} Données pour graphique
   */
  getMaintenancesChartData: (stats) => {
    return [
      {
        name: 'Terminées',
        value: stats.maintenancesTerminees || 0,
        color: '#10b981', // green
      },
      {
        name: 'En cours',
        value: stats.maintenancesEnCours || 0,
        color: '#3b82f6', // blue
      },
      {
        name: 'En attente',
        value: stats.maintenancesEnAttente || 0,
        color: '#f59e0b', // orange
      },
    ].filter(item => item.value > 0);
  },

  /**
   * Obtient les KPIs principaux
   * @param {Object} stats - Objet statistiques
   * @returns {Array} Liste des KPIs
   */
  getKPIs: (stats) => {
    return [
      {
        label: 'Biens totaux',
        value: stats.totalBiens || 0,
        icon: 'Home',
        color: 'primary',
        trend: null,
      },
      {
        label: 'Taux d\'occupation',
        value: `${statsService.getTauxOccupation(stats).toFixed(1)}%`,
        icon: 'TrendingUp',
        color: 'blue',
        trend: statsService.getTauxOccupation(stats) >= 80 ? 'up' : 'down',
      },
      {
        label: 'Taux de recouvrement',
        value: `${(stats.tauxRecouvrement || 0).toFixed(1)}%`,
        icon: 'DollarSign',
        color: 'green',
        trend: (stats.tauxRecouvrement || 0) >= 90 ? 'up' : 'down',
      },
      {
        label: 'Maintenances en cours',
        value: stats.maintenancesEnCours || 0,
        icon: 'Wrench',
        color: 'orange',
        trend: null,
      },
    ];
  },

  /**
   * Formate un pourcentage
   * @param {number} value - Valeur en pourcentage
   * @returns {string} Pourcentage formaté
   */
  formatPercentage: (value) => {
    if (value === null || value === undefined) return '0%';
    return `${value.toFixed(1)}%`;
  },

  /**
   * Obtient la couleur selon le taux de recouvrement
   * @param {number} taux - Taux de recouvrement
   * @returns {string} Classe de couleur Tailwind
   */
  getRecouvrementColor: (taux) => {
    if (taux >= 90) return 'text-green-600';
    if (taux >= 70) return 'text-yellow-600';
    return 'text-red-600';
  },

  /**
   * Obtient la couleur selon le taux d'occupation
   * @param {number} taux - Taux d'occupation
   * @returns {string} Classe de couleur Tailwind
   */
  getOccupationColor: (taux) => {
    if (taux >= 80) return 'text-green-600';
    if (taux >= 60) return 'text-yellow-600';
    return 'text-red-600';
  },

  /**
   * Obtient une analyse textuelle des statistiques
   * @param {Object} stats - Objet statistiques
   * @returns {Object} Analyse { biens, paiements, maintenances }
   */
  getAnalyse: (stats) => {
    const tauxOccupation = statsService.getTauxOccupation(stats);
    const tauxRecouvrement = stats.tauxRecouvrement || 0;

    return {
      biens: {
        message: tauxOccupation >= 80
          ? `Excellent taux d'occupation (${tauxOccupation.toFixed(1)}%)`
          : tauxOccupation >= 60
          ? `Taux d'occupation acceptable (${tauxOccupation.toFixed(1)}%)`
          : `Attention: taux d'occupation faible (${tauxOccupation.toFixed(1)}%)`,
        status: tauxOccupation >= 80 ? 'success' : tauxOccupation >= 60 ? 'warning' : 'danger',
      },
      paiements: {
        message: tauxRecouvrement >= 90
          ? `Excellent recouvrement (${tauxRecouvrement.toFixed(1)}%)`
          : tauxRecouvrement >= 70
          ? `Recouvrement acceptable (${tauxRecouvrement.toFixed(1)}%)`
          : `Attention: recouvrement faible (${tauxRecouvrement.toFixed(1)}%)`,
        status: tauxRecouvrement >= 90 ? 'success' : tauxRecouvrement >= 70 ? 'warning' : 'danger',
      },
      maintenances: {
        message: stats.maintenancesEnAttente > 5
          ? `${stats.maintenancesEnAttente} maintenances en attente`
          : stats.maintenancesEnCours > 0
          ? `${stats.maintenancesEnCours} maintenance(s) en cours`
          : 'Aucune maintenance en attente',
        status: stats.maintenancesEnAttente > 5 ? 'warning' : 'success',
      },
    };
  },

  /**
   * Génère un rapport textuel
   * @param {Object} stats - Objet statistiques
   * @returns {string} Rapport
   */
  genererRapport: (stats) => {
    const analyse = statsService.getAnalyse(stats);

    return `
📊 RAPPORT DE GESTION

🏠 BIENS:
- Total: ${stats.totalBiens || 0}
- Loués: ${stats.totalBiensLoues || 0} (${statsService.getTauxOccupation(stats).toFixed(1)}%)
- Disponibles: ${stats.totalBiensDisponibles || 0}
- Vendus: ${stats.totalBiensVendus || 0}
${analyse.biens.message}

💰 PAIEMENTS:
- Effectués: ${stats.totalPaiementsEffectues || 0}
- Attendus: ${stats.totalPaiementsAttendus || 0}
- Taux de recouvrement: ${(stats.tauxRecouvrement || 0).toFixed(1)}%
${analyse.paiements.message}

🔧 MAINTENANCES:
- Total: ${stats.totalMaintenances || 0}
- Terminées: ${stats.maintenancesTerminees || 0}
- En cours: ${stats.maintenancesEnCours || 0}
- En attente: ${stats.maintenancesEnAttente || 0}
${analyse.maintenances.message}

👥 ACTEURS:
- Propriétaires: ${stats.totalProprietaires || 0}
- Locataires: ${stats.totalLocataires || 0}
    `.trim();
  },

  /**
   * Compare deux périodes de statistiques
   * @param {Object} stats1 - Statistiques période 1
   * @param {Object} stats2 - Statistiques période 2
   * @returns {Object} Comparaison
   */
  compareStats: (stats1, stats2) => {
    return {
      biens: {
        evolution: stats2.totalBiens - stats1.totalBiens,
        percentage: stats1.totalBiens > 0
          ? ((stats2.totalBiens - stats1.totalBiens) / stats1.totalBiens) * 100
          : 0,
      },
      occupation: {
        evolution: statsService.getTauxOccupation(stats2) - statsService.getTauxOccupation(stats1),
        trend: statsService.getTauxOccupation(stats2) > statsService.getTauxOccupation(stats1) ? 'up' : 'down',
      },
      recouvrement: {
        evolution: (stats2.tauxRecouvrement || 0) - (stats1.tauxRecouvrement || 0),
        trend: (stats2.tauxRecouvrement || 0) > (stats1.tauxRecouvrement || 0) ? 'up' : 'down',
      },
      maintenances: {
        evolution: stats2.totalMaintenances - stats1.totalMaintenances,
        percentage: stats1.totalMaintenances > 0
          ? ((stats2.totalMaintenances - stats1.totalMaintenances) / stats1.totalMaintenances) * 100
          : 0,
      },
    };
  },

  /**
   * Périodes prédéfinies
   */
  PERIODES: {
    AUJOURD_HUI: 'today',
    SEMAINE: 'week',
    MOIS: 'month',
    TRIMESTRE: 'quarter',
    ANNEE: 'year',
    PERSONNALISE: 'custom',
  },

  /**
   * Obtient les dates pour une période prédéfinie
   * @param {string} periode - Type de période
   * @returns {Object} { dateDebut, dateFin }
   */
  getDatesForPeriode: (periode) => {
    const today = new Date();
    let dateDebut, dateFin;

    switch (periode) {
      case 'today':
        dateDebut = dateFin = today.toISOString().split('T')[0];
        break;

      case 'week':
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
        dateDebut = firstDayOfWeek.toISOString().split('T')[0];
        dateFin = new Date().toISOString().split('T')[0];
        break;

      case 'month':
        dateDebut = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        dateFin = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        break;

      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        dateDebut = new Date(today.getFullYear(), quarter * 3, 1).toISOString().split('T')[0];
        dateFin = new Date(today.getFullYear(), quarter * 3 + 3, 0).toISOString().split('T')[0];
        break;

      case 'year':
        dateDebut = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
        dateFin = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
        break;

      default:
        dateDebut = dateFin = null;
    }

    return { dateDebut, dateFin };
  },
};
