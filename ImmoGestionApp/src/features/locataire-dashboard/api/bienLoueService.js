// src/features/locataire-dashboard/api/bienLoueService.js
import axios from 'axios';
import appConfig from '../../../routes/route';

/**
 * Récupère la liste des biens loués par un locataire
 * @param {number} locataireId
 */
export const getBiensLouesByLocataire = async (locataireId) => {
  try {
    const response = await axios.get(appConfig.api.list_biensLocataire(locataireId));
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.error ||
          `Erreur API (${error.response.status})`
      );
    }
    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * Récupère uniquement les biens en location active pour un locataire
 * @param {number} locataireId
 */
export const getBiensLouesActifs = async (locataireId) => {
  if (!locataireId) throw new Error('locataireId manquant');
  try {
    const response = await axios.get(appConfig.api.list_biensLocataireActifs(locataireId));
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.error ||
          `Erreur API (${error.response.status})`
      );
    }
    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * Récupère les détails complets d’un bien loué par un locataire
 * @param {number} locataireId
 * @param {number} bienId
 */
export const getBienLoueDetails = async (locataireId, bienId) => {
  if (!locataireId) throw new Error('locataireId manquant');
  if (!bienId) throw new Error('bienId manquant');
  try {
    const response = await axios.get(appConfig.api.details_bienLoue(locataireId, bienId));
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.error ||
          `Erreur API (${error.response.status})`
      );
    }
    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * Liste les contrats disponibles pour un locataire (sans récupérer le blob).
 * @param {number} locataireId - ID du locataire
 * @returns {Promise<Array>} Tableau de ContratListDTO
 */
export const getContratsByLocataire = async (locataireId) => {
  try {
    const url = appConfig.api.list_contrats(locataireId);
    const { data } = await axios.get(url);
    return data; // Array<ContratListDTO>
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Erreur lors de la récupération des contrats"
    );
  }
};

/**
 * Télécharge le contrat d'une location appartenant au locataire.
 * Renvoie un blob (ex.: PDF).
 * @param {number} locataireId - ID du locataire
 * @param {number} locationId - ID de la location
 * @returns {Promise<Blob>} Blob contenant le contrat
 */
export const downloadContrat = async (locataireId, locationId) => {
  try {
    const url = appConfig.api.download_contrat(locataireId, locationId);
    const response = await axios.get(url, {
      responseType: "blob",
    });
    // On renvoie directement le blob ; le front pourra créer un lien de téléchargement
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Erreur lors du téléchargement du contrat"
    );
  }
};
