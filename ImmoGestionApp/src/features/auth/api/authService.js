// src/services/authService.js
import appConfig from '../../../routes/route';

/**
 * Service d'authentification
 */
export const authService = {
  /**
   * Connexion utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe
   * @returns {Promise<Object>} Données utilisateur
   */
  login: async (email, password) => {
    try {
      const response = await fetch(appConfig.api.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: email, // L'API backend attend "identifier"
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur de connexion');
      }

      const data = await response.json();

      // Sauvegarde des informations utilisateur
      if (data.userId) {
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('roleId', data.roleId);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  /**
   * Déconnexion utilisateur
   */
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('roleId');
  },

  /**
   * Récupère l'utilisateur connecté
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Vérifie si l'utilisateur est connecté
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('userId');
  },
};