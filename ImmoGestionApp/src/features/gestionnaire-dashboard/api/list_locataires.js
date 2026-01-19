// src/services/list_locataires.js
import appConfig from '../../../routes/route';

/**
 * Service pour gérer les locataires d'un gestionnaire
 */
export const locatairesService = {
  /**
   * Récupère la liste des locataires d'un gestionnaire
   * @param {number} gestionnaireId - ID du gestionnaire
   * @returns {Promise<Array>} Liste des locataires
   */
  getLocataires: async (gestionnaireId) => {
    try {
      const response = await fetch(appConfig.api.list_locatairesGestionnaire(gestionnaireId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des locataires');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des locataires:', error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'un locataire
   * @param {number} locataireId - ID du locataire
   * @returns {Promise<Object>} Détails complets du locataire
   */
  getDetailsLocataire: async (locataireId) => {
    try {
      const response = await fetch(appConfig.api.details_locataire(locataireId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des détails du locataire');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error);
      throw error;
    }
  },

  /**
   * Recherche un locataire par nom, email, référence bien ou propriétaire
   * @param {Array} locataires - Liste des locataires
   * @param {string} query - Terme de recherche
   * @returns {Array} Liste filtrée des locataires
   */
  searchLocataires: (locataires, query) => {
    if (!query) return locataires;

    const lowerQuery = query.toLowerCase();
    return locataires.filter(loc =>
      loc.nom?.toLowerCase().includes(lowerQuery) ||
      loc.email?.toLowerCase().includes(lowerQuery) ||
      loc.bienRef?.toLowerCase().includes(lowerQuery) ||
      loc.proprietaireNom?.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filtre les locataires par statut
   * @param {Array} locataires - Liste des locataires
   * @param {string} statut - Statut à filtrer (ACTIF, INACTIF, null pour tous)
   * @returns {Array} Liste filtrée
   */
  filterByStatut: (locataires, statut) => {
    if (!statut || statut === null) return locataires;
    return locataires.filter(loc => loc.statut === statut);
  },

  /**
   * Trie les locataires
   * @param {Array} locataires - Liste des locataires
   * @param {string} sortBy - Champ de tri (nom, loyer, bienRef, proprietaireNom, statut)
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array} Liste triée
   */
  sortLocataires: (locataires, sortBy = 'nom', order = 'asc') => {
    return [...locataires].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'nom':
          comparison = (a.nom || '').localeCompare(b.nom || '');
          break;
        case 'loyer':
          comparison = (a.loyer || 0) - (b.loyer || 0);
          break;
        case 'bienRef':
          comparison = (a.bienRef || '').localeCompare(b.bienRef || '');
          break;
        case 'proprietaireNom':
          comparison = (a.proprietaireNom || '').localeCompare(b.proprietaireNom || '');
          break;
        case 'statut':
          comparison = (a.statut || '').localeCompare(b.statut || '');
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Calcule les statistiques des locataires
   * @param {Array} locataires - Liste des locataires
   * @returns {Object} Statistiques calculées
   */
  getStatistics: (locataires) => {
    const actifs = locataires.filter(l => l.statut === 'ACTIF').length;
    const inactifs = locataires.filter(l => l.statut === 'INACTIF').length;
    const totalLoyers = locataires.reduce((sum, l) => sum + (l.loyer || 0), 0);
    const loyerMoyen = locataires.length > 0 ? totalLoyers / locataires.length : 0;

    return {
      total: locataires.length,
      actifs,
      inactifs,
      totalLoyers,
      loyerMoyen,
    };
  },

  /**
   * Filtre les biens loués par statut
   * @param {Array} biensLoues - Liste des biens loués
   * @param {string} statut - Statut à filtrer (ACTIVE, TERMINEE, etc.)
   * @returns {Array} Biens filtrés
   */
  filterBiensByStatut: (biensLoues, statut) => {
    if (!statut) return biensLoues;
    return biensLoues.filter(bien => bien.statut === statut);
  },

  /**
   * Calcule l'âge à partir de la date de naissance
   * @param {string} dob - Date de naissance (format: YYYY-MM-DD)
   * @returns {number} Âge en années
   */
  calculateAge: (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  /**
   * Formate une date
   * @param {string} date - Date au format ISO
   * @returns {string} Date formatée (ex: "3 février 1994")
   */
  formatDate: (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },

  /**
   * Formate un montant en FCFA
   * @param {number} montant - Montant à formater
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
};