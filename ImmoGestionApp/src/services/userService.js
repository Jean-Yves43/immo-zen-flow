// src/services/userService.js
import axios from 'axios';
import appConfig from '../routes/route';

/**
 * Récupère les détails complets d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Détails de l'utilisateur
 */
export const getUserDetails = async (userId) => {
  try {
    console.log('📤 Requête getUserDetails:', userId);
    console.log('🌐 URL:', appConfig.api.get_user_details(userId));
    
    const response = await axios.get(appConfig.api.get_user_details(userId));
    
    console.log('✅ getUserDetails réussi:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur getUserDetails:', error);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      
      if (error.response.status === 401) {
        throw new Error('Accès non autorisé. Vérifiez la configuration backend.');
      }
      if (error.response.status === 403) {
        throw new Error('Accès interdit.');
      }
      if (error.response.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error(error.response.data.message || 'Erreur lors de la récupération des détails');
    }
    
    if (error.request) {
      throw new Error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
    }
    
    throw new Error('Erreur lors de la préparation de la requête');
  }
};

/**
 * Met à jour les informations d'un utilisateur
 * @param {number} userId - ID de l'utilisateur
 * @param {Object} userData - Données à mettre à jour
 * @returns {Promise<Object>} Utilisateur mis à jour
 */
export const updateUserDetails = async (userId, userData) => {
  try {
    console.log('📤 Requête updateUserDetails:', userId, userData);
    
    const response = await axios.put(
      appConfig.api.update_user_details(userId),
      userData
    );
    
    console.log('✅ updateUserDetails réussi:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur updateUserDetails:', error);
    
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error('Données invalides. Vérifiez les champs.');
      }
      if (error.response.status === 401) {
        throw new Error('Accès non autorisé. Vérifiez la configuration backend.');
      }
      if (error.response.status === 403) {
        throw new Error('Accès interdit.');
      }
      if (error.response.status === 404) {
        throw new Error('Utilisateur non trouvé');
      }
      throw new Error(error.response.data.message || 'Erreur lors de la mise à jour');
    }
    
    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * Formate la date d'inscription
 * @param {string} dateStr - Date ISO
 * @returns {string} Date formatée
 */
export const formatInscriptionDate = (dateStr) => {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Obtient les initiales d'un utilisateur
 * @param {string} prenom - Prénom
 * @param {string} nom - Nom
 * @returns {string} Initiales (ex: "MM")
 */
export const getInitials = (prenom, nom) => {
  const p = prenom?.charAt(0)?.toUpperCase() || '';
  const n = nom?.charAt(0)?.toUpperCase() || '';
  return p + n;
};

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {boolean} true si valide
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valide un numéro de téléphone
 * @param {string} phone - Téléphone à valider
 * @returns {boolean} true si valide
 */
export const isValidPhone = (phone) => {
  // Format: +225 XX XX XX XX XX ou 0X XX XX XX XX
  const regex = /^(\+225|0)[0-9\s]{10,14}$/;
  return regex.test(phone);
};

/**
 * Formate un numéro de téléphone
 * @param {string} phone - Téléphone brut
 * @returns {string} Téléphone formaté
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Supprimer tous les espaces
  const clean = phone.replace(/\s/g, '');
  
  // Format: +225 XX XX XX XX XX
  if (clean.startsWith('+225')) {
    return clean.replace(/(\+225)(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
  }
  
  // Format: 0X XX XX XX XX
  if (clean.startsWith('0')) {
    return clean.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phone;
};