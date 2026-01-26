// src/features/locataire-dashboard/api/maintenance.js

import axios from 'axios';
import appConfig from '../../../routes/route';

// ✅ Créer une instance Axios dédiée pour le multipart/form-data
// Cette instance N'A PAS les intercepteurs globaux qui peuvent transformer en JSON
const multipartAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

/**
 * Récupère la liste des maintenances d'un locataire
 */
export const getMaintenancesByLocataire = async (locataireId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.urgence) params.append('urgence', filters.urgence);
    if (filters.categorie) params.append('categorie', filters.categorie);

    const url = filters.statut || filters.urgence || filters.categorie
      ? appConfig.api.filter_maintenanceLocataire(locataireId)
      : appConfig.api.list_maintenanceLocataire(locataireId);

    const response = await axios.get(url, { params });
    
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur getMaintenancesByLocataire:', error);
    
    if (error.response?.status === 404) {
      return [];
    }
    
    if (error.response) {
      throw new Error(
        error.response.data.message || 
        `Erreur ${error.response.status}: ${error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error('Aucune réponse du serveur. Vérifiez votre connexion.');
    } else {
      throw new Error('Erreur lors de la configuration de la requête');
    }
  }
};

/**
 * Récupère uniquement les demandes soumises
 */
export const getMaintenancesSoumises = async (locataireId) => {
  try {
    const response = await axios.get(
      appConfig.api.soumises_maintenanceLocataire(locataireId)
    );
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur getMaintenancesSoumises:', error);
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Récupère les détails d'une demande
 */
export const getMaintenanceDetails = async (locataireId, ficheId) => {
  try {
    const response = await axios.get(
      appConfig.api.details_maintenanceLocataire(locataireId, ficheId)
    );
    return response.data;
  } catch (error) {
    console.error('Erreur getMaintenanceDetails:', error);
    if (error.response) {
      throw new Error(
        error.response.data.message || 
        'Erreur lors de la récupération des détails'
      );
    }
    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * Crée une nouvelle demande de maintenance
 * ✅ Utilise multipartAxios (instance dédiée SANS intercepteurs)
 */
export const createMaintenance = async (locataireId, maintenanceData, photoFile = null) => {
  console.log('🔍 ===== CREATE MAINTENANCE =====');
  console.log('locataireId:', locataireId);
  console.log('maintenanceData:', maintenanceData);
  console.log('photoFile:', photoFile);
  
  try {
    const formData = new FormData();
    
    // Ajouter les champs
    formData.append('locationId', String(maintenanceData.locationId || 1));
    formData.append('categorie', maintenanceData.categorie.toUpperCase());
    formData.append('urgence', maintenanceData.urgence.toUpperCase());
    formData.append('description', maintenanceData.description);
    
    if (maintenanceData.motif) {
      formData.append('motif', maintenanceData.motif);
    }
    
    if (photoFile && photoFile instanceof File) {
      formData.append('photo', photoFile, photoFile.name);
    }

    // Debug FormData
    console.log('\n📦 FormData contents:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: "${value}"`);
      }
    }

    const url = `/api/locataires/${locataireId}/maintenance`;
    console.log('\n🌐 URL:', url);
    console.log('📤 Envoi avec multipartAxios (instance dédiée)...\n');

    // ✅ Utiliser multipartAxios au lieu d'axios
    const response = await multipartAxios.post(url, formData);
    
    console.log('✅ SUCCESS! Status:', response.status);
    console.log('Response data:', response.data);
    console.log('🔍 ===== FIN =====\n');
    
    return response.data;
    
  } catch (error) {
    console.error('\n❌ ===== ERREUR =====');
    console.error('Type:', error.name);
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Request Content-Type:', error.config?.headers?.['Content-Type']);
      
      // Vérifier si la requête a bien été envoyée en multipart
      const sentAsFormData = error.config?.data instanceof FormData;
      console.error('Sent as FormData?', sentAsFormData);
      
      if (!sentAsFormData) {
        console.error('⚠️ PROBLÈME: Les données n\'ont PAS été envoyées en FormData!');
        console.error('Type envoyé:', error.config?.data?.constructor.name);
      }
    }
    
    console.error('🔍 ===== FIN ERREUR =====\n');
    
    if (error.response?.status === 415) {
      throw new Error('Erreur 415: Le serveur n\'accepte pas le format des données');
    }
    
    if (error.response?.status === 400) {
      const message = error.response.data.message || 
                     error.response.data.errors?.join(', ') ||
                     'Données invalides';
      throw new Error(message);
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la création');
  }
};

/**
 * Télécharge la photo
 */
export const downloadMaintenancePhoto = async (locataireId, ficheId) => {
  try {
    const response = await axios.get(
      appConfig.api.photo_maintenanceLocataire(locataireId, ficheId),
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur downloadMaintenancePhoto:', error);
    if (error.response?.status === 404) {
      throw new Error('Aucune photo disponible');
    }
    throw new Error('Erreur lors du téléchargement');
  }
};

/**
 * Compte les demandes
 */
export const countMaintenances = async (locataireId) => {
  try {
    const response = await axios.get(
      appConfig.api.count_maintenanceLocataire(locataireId)
    );
    return response.data.nombreDemandes || 0;
  } catch (error) {
    console.error('Erreur countMaintenances:', error);
    return 0;
  }
};

/**
 * Obtenir l'URL de la photo
 */
export const getPhotoUrl = (locataireId, ficheId) => {
  return appConfig.api.photo_maintenanceLocataire(locataireId, ficheId);
};