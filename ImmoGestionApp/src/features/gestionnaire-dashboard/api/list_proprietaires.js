// src/services/list_proprietaires.js
import appConfig from '../../../routes/route';

/**
 * Service pour gérer les propriétaires d'un gestionnaire
 */
export const proprietairesService = {
  /**
   * Récupère la liste des propriétaires d'un gestionnaire
   * @param {number} gestionnaireId - ID du gestionnaire
   * @returns {Promise<Object>} { proprietaires: Array, totalProprietaires: number }
   */
  getProprietaires: async (gestionnaireId) => {
    try {
      const response = await fetch(appConfig.api.list_proprietaires(gestionnaireId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération des propriétaires');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des propriétaires:', error);
      throw error;
    }
  },

  /**
   * Recherche un propriétaire par nom ou email
   * @param {number} gestionnaireId - ID du gestionnaire
   * @param {string} query - Terme de recherche
   * @returns {Promise<Array>} Liste filtrée des propriétaires
   */
  searchProprietaires: async (gestionnaireId, query) => {
    try {
      const data = await proprietairesService.getProprietaires(gestionnaireId);
      
      if (!query) return data;

      const filtered = data.proprietaires.filter(prop => 
        prop.nom.toLowerCase().includes(query.toLowerCase()) ||
        prop.email.toLowerCase().includes(query.toLowerCase())
      );

      return {
        proprietaires: filtered,
        totalProprietaires: filtered.length
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      throw error;
    }
  },

  /**
   * Trie les propriétaires
   * @param {Array} proprietaires - Liste des propriétaires
   * @param {string} sortBy - Champ de tri (nom, nbrTotalBiens, nbrTotalLocataires)
   * @param {string} order - Ordre (asc, desc)
   * @returns {Array} Liste triée
   */
  sortProprietaires: (proprietaires, sortBy = 'nom', order = 'asc') => {
    return [...proprietaires].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'nom':
          comparison = a.nom.localeCompare(b.nom);
          break;
        case 'nbrTotalBiens':
          comparison = a.nbrTotalBiens - b.nbrTotalBiens;
          break;
        case 'nbrTotalLocataires':
          comparison = a.nbrTotalLocataires - b.nbrTotalLocataires;
          break;
        default:
          comparison = 0;
      }

      return order === 'asc' ? comparison : -comparison;
    });
  },
};