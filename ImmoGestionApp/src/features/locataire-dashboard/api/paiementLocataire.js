// src/services/paiementService.js
import axios from 'axios';
import appConfig from '../../../routes/route';

/**
 * ✅ NOUVEAU : Prévisualise les mois qui seront payés avant de confirmer
 * 
 * @param {number} locataireId - ID du locataire
 * @param {Object} paiementData - Données du paiement
 * @param {number} paiementData.locationId - ID de la location
 * @param {number} paiementData.nombreMois - Nombre de mois à payer
 * @param {number} paiementData.montantMensuel - Montant mensuel
 * @param {string} paiementData.methodePaiement - Méthode de paiement
 * @returns {Promise<Object>} Preview détaillée
 */
export const previewPaiement = async (locataireId, paiementData) => {
  try {
    console.log('🔍 Preview paiement:', { locataireId, paiementData });

    const response = await axios.post(
      appConfig.api.preview_paiements(locataireId),
      paiementData
    );

    console.log('✅ Preview reçue:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur previewPaiement:', error);

    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('Location non trouvée.');
      }
      if (error.response.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à effectuer ce paiement.');
      }
      throw new Error(
        error.response.data.message || 
        'Erreur lors de la prévisualisation'
      );
    }

    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * ✅ NOUVEAU : Effectue un paiement intelligent
 * Le système détermine automatiquement quels mois payer (retards en priorité)
 * 
 * @param {number} locataireId - ID du locataire
 * @param {Object} paiementData - Données du paiement simplifié
 * @param {number} paiementData.locationId - ID de la location
 * @param {number} paiementData.nombreMois - Nombre de mois à payer (ex: 3)
 * @param {number} paiementData.montantMensuel - Montant mensuel (ex: 300000)
 * @param {string} paiementData.methodePaiement - WAVE, ORANGE_MONEY, etc.
 * @param {string} [paiementData.numeroTelephone] - Numéro pour Mobile Money
 * @param {string} [paiementData.numeroCartePartiel] - Carte bancaire (optionnel)
 * @returns {Promise<Object>} Réponse avec détails des paiements effectués
 */
export const effectuerPaiementIntelligent = async (locataireId, paiementData) => {
  try {
    console.log('📤 Envoi paiement intelligent:', { locataireId, paiementData });

    const response = await axios.post(
      appConfig.api.effectuer_paiements(locataireId),
      paiementData
    );

    console.log('✅ Paiement effectué avec succès:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Erreur effectuerPaiementIntelligent:', error);

    if (error.response) {
      // Erreur de validation (400)
      if (error.response.status === 400) {
        const message = error.response.data.message || 
                       error.response.data.errors?.join(', ') ||
                       'Données invalides. Vérifiez les champs.';
        throw new Error(message);
      }

      // Location non autorisée (403)
      if (error.response.status === 403) {
        throw new Error('Vous n\'êtes pas autorisé à effectuer ce paiement.');
      }

      // Location non trouvée (404)
      if (error.response.status === 404) {
        throw new Error('Location non trouvée.');
      }

      throw new Error(
        error.response.data.message || 
        `Erreur ${error.response.status}: Impossible d'effectuer le paiement`
      );
    } else if (error.request) {
      throw new Error('Aucune réponse du serveur. Vérifiez votre connexion.');
    } else {
      throw new Error('Erreur lors de la préparation du paiement');
    }
  }
};

/**
 * ⚠️ DÉPRÉCIÉ : Ancienne méthode avec liste de mois manuelle
 * Utiliser effectuerPaiementIntelligent() à la place
 */
export const effectuerPaiements = async (locataireId, paiementData) => {
  console.warn('⚠️ effectuerPaiements() est déprécié. Utilisez effectuerPaiementIntelligent()');
  
  // Si l'ancien format est utilisé, on le convertit
  if (paiementData.paiements && Array.isArray(paiementData.paiements)) {
    const nouveauFormat = {
      locationId: paiementData.locationId,
      nombreMois: paiementData.paiements.length,
      montantMensuel: paiementData.paiements[0]?.montant || 0,
      methodePaiement: paiementData.methodePaiement,
      numeroTelephone: paiementData.numeroTelephone,
      numeroCartePartiel: paiementData.numeroCartePartiel,
    };
    
    return effectuerPaiementIntelligent(locataireId, nouveauFormat);
  }
  
  return effectuerPaiementIntelligent(locataireId, paiementData);
};

/**
 * Récupère la liste des paiements d'un locataire
 * @param {number} locataireId - ID du locataire
 * @returns {Promise<Array>} Liste des paiements
 */
export const getPaiementsByLocataire = async (locataireId) => {
  try {
    const response = await axios.get(appConfig.api.list_paiementsLocataire(locataireId));
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors de la récupération des paiements');
    } else {
      throw new Error('Erreur réseau ou serveur');
    }
  }
};

/**
 * Télécharge le reçu d'un paiement
 * @param {number} paiementId - ID du paiement
 * @param {number} locataireId - ID du locataire
 * @returns {Promise<Blob>} Fichier PDF du reçu
 */
export const telechargerRecu = async (paiementId, locataireId) => {
  try {
    const response = await axios.get(
      appConfig.api.telecharger_recu(paiementId, locataireId),
      {
        responseType: 'blob',
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Erreur lors du téléchargement du reçu');
    } else {
      throw new Error('Erreur réseau ou serveur');
    }
  }
};

/**
 * Récupère l'historique des paiements d'une location
 * 
 * @param {number} locataireId - L'ID du locataire
 * @param {number} locationId - L'ID de la location
 * @returns {Promise<Array>} Liste des paiements
 */
export const getHistoriquePaiements = async (locataireId, locationId) => {
  try {
    const response = await axios.get(
      appConfig.api.historique_paiements(locataireId, locationId)
    );

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Erreur getHistoriquePaiements:', error);

    if (error.response?.status === 404) {
      return [];
    }

    if (error.response) {
      throw new Error(
        error.response.data.message || 
        'Erreur lors de la récupération de l\'historique'
      );
    }

    throw new Error('Erreur réseau ou serveur');
  }
};

/**
 * Calcule les statistiques de paiement pour une location
 * 
 * @param {number} locataireId - L'ID du locataire
 * @param {number} locationId - L'ID de la location
 * @returns {Promise<Object>} Statistiques {totalPaye, enRetard, aPayer, dernierPaiement}
 */
export const getStatistiquesPaiement = async (locataireId, locationId) => {
  try {
    const historique = await getHistoriquePaiements(locataireId, locationId);
    const aujourdHui = new Date();

    // Calculer le total payé
    const totalPaye = historique
      .filter(p => p.datePaiement)
      .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);

    // Calculer les paiements en retard
    const enRetard = historique
      .filter(p => {
        if (p.datePaiement) return false;
        const echeance = new Date(p.dateEcheance);
        return echeance < aujourdHui;
      })
      .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);

    // Calculer les paiements à venir
    const aPayer = historique
      .filter(p => {
        if (p.datePaiement) return false;
        const echeance = new Date(p.dateEcheance);
        return echeance >= aujourdHui;
      })
      .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);

    // Dernier paiement effectué
    const paiementsEffectues = historique
      .filter(p => p.datePaiement)
      .sort((a, b) => new Date(b.datePaiement) - new Date(a.datePaiement));
    
    const dernierPaiement = paiementsEffectues[0] || null;

    return {
      totalPaye,
      enRetard,
      aPayer,
      nombrePaiements: historique.length,
      nombrePaiementsEffectues: paiementsEffectues.length,
      dernierPaiement,
    };
  } catch (error) {
    console.error('Erreur getStatistiquesPaiement:', error);
    return {
      totalPaye: 0,
      enRetard: 0,
      aPayer: 0,
      nombrePaiements: 0,
      nombrePaiementsEffectues: 0,
      dernierPaiement: null,
    };
  }
};

/**
 * ✅ NOUVEAU : Valide les données d'un paiement intelligent
 * 
 * @param {Object} paiementData - Les données à valider
 * @returns {Object} {valide: boolean, erreurs: Array}
 */
export const validerDonneesPaiementIntelligent = (paiementData) => {
  const erreurs = [];

  // Vérifier locationId
  if (!paiementData.locationId) {
    erreurs.push('L\'ID de la location est requis');
  }

  // Vérifier nombreMois
  if (!paiementData.nombreMois || paiementData.nombreMois < 1) {
    erreurs.push('Le nombre de mois doit être au moins 1');
  }

  if (paiementData.nombreMois > 12) {
    erreurs.push('Maximum 12 mois à la fois');
  }

  // Vérifier montantMensuel
  if (!paiementData.montantMensuel || parseFloat(paiementData.montantMensuel) <= 0) {
    erreurs.push('Le montant mensuel doit être supérieur à 0');
  }

  // Vérifier méthode de paiement
  if (!paiementData.methodePaiement) {
    erreurs.push('La méthode de paiement est requise');
  }

  const methodesValides = [
    'CARTE_BANCAIRE', 'VISA', 'MASTERCARD',
    'WAVE', 'ORANGE_MONEY', 'MOOV_MONEY', 'MTN_MONEY'
  ];
  
  if (paiementData.methodePaiement && !methodesValides.includes(paiementData.methodePaiement)) {
    erreurs.push('Méthode de paiement invalide');
  }

  return {
    valide: erreurs.length === 0,
    erreurs,
  };
};

/**
 * ⚠️ DÉPRÉCIÉ : Ancienne validation avec liste de mois
 * Utiliser validerDonneesPaiementIntelligent() à la place
 */
export const validerDonneesPaiement = (paiementData) => {
  console.warn('⚠️ validerDonneesPaiement() est déprécié. Utilisez validerDonneesPaiementIntelligent()');
  
  // Si nouveau format, utiliser la nouvelle validation
  if (paiementData.nombreMois !== undefined) {
    return validerDonneesPaiementIntelligent(paiementData);
  }

  // Sinon, ancienne validation (pour compatibilité)
  const erreurs = [];

  if (!paiementData.locationId) {
    erreurs.push('L\'ID de la location est requis');
  }

  if (!paiementData.methodePaiement) {
    erreurs.push('La méthode de paiement est requise');
  }

  if (!paiementData.paiements || paiementData.paiements.length === 0) {
    erreurs.push('Au moins un paiement est requis');
  }

  return {
    valide: erreurs.length === 0,
    erreurs,
  };
};

/**
 * Filtre les paiements par statut
 * 
 * @param {Array} paiements - Liste des paiements
 * @param {string} statut - Le statut ("PAYE", "EN_RETARD", "A_VENIR", "RETARD_REGLE", "AVANCE")
 * @returns {Array} Paiements filtrés
 */
export const filtrerPaiementsParStatut = (paiements, statut) => {
  const aujourdHui = new Date();

  switch (statut) {
    case 'PAYE':
      return paiements.filter(p => p.datePaiement);
    
    case 'EN_RETARD':
      return paiements.filter(p => {
        if (p.datePaiement) return false;
        const echeance = new Date(p.dateEcheance);
        return echeance < aujourdHui;
      });
    
    case 'A_VENIR':
      return paiements.filter(p => {
        if (p.datePaiement) return false;
        const echeance = new Date(p.dateEcheance);
        return echeance >= aujourdHui;
      });
    
    // ✅ NOUVEAU : Statuts spécifiques de l'API intelligente
    case 'RETARD_REGLE':
      return paiements.filter(p => p.statut === 'RETARD_REGLE');
    
    case 'AVANCE':
      return paiements.filter(p => p.statut === 'AVANCE');
    
    default:
      return paiements;
  }
};

/**
 * Formate un montant en FCFA
 * 
 * @param {number} montant - Le montant à formater
 * @returns {string} Montant formaté
 */
export const formaterMontantFCFA = (montant) => {
  if (montant === null || montant === undefined) return "0 FCFA";
  return (
    new Intl.NumberFormat("fr-FR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant) + " FCFA"
  );
};

/**
 * Formate un montant en devise
 * 
 * @param {number} montant - Le montant à formater
 * @param {string} devise - La devise (par défaut "EUR")
 * @returns {string} Montant formaté
 */
export const formaterMontant = (montant, devise = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: devise,
  }).format(montant);
};

/**
 * Formate une date
 * 
 * @param {string} date - Date au format ISO
 * @param {string} format - Format souhaité ("court", "long", "relatif")
 * @returns {string} Date formatée
 */
export const formaterDate = (date, format = 'court') => {
  if (!date) return '';

  const dateObj = new Date(date);

  switch (format) {
    case 'court':
      return dateObj.toLocaleDateString('fr-FR');
    
    case 'long':
      return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    
    case 'relatif':
      const maintenant = new Date();
      const diffMs = maintenant - dateObj;
      const diffJours = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffJours === 0) return 'Aujourd\'hui';
      if (diffJours === 1) return 'Hier';
      if (diffJours < 7) return `Il y a ${diffJours} jours`;
      if (diffJours < 30) return `Il y a ${Math.floor(diffJours / 7)} semaines`;
      if (diffJours < 365) return `Il y a ${Math.floor(diffJours / 30)} mois`;
      return `Il y a ${Math.floor(diffJours / 365)} ans`;
    
    default:
      return dateObj.toLocaleDateString('fr-FR');
  }
};

/**
 * Obtient le libellé d'une méthode de paiement
 * 
 * @param {string} methode - Code de la méthode (WAVE, VISA, etc.)
 * @returns {string} Libellé lisible
 */
export const getLibelleMethodePaiement = (methode) => {
  const libelles = {
    'CARTE_BANCAIRE': 'Carte Bancaire',
    'VISA': 'Visa',
    'MASTERCARD': 'Mastercard',
    'WAVE': 'Wave',
    'ORANGE_MONEY': 'Orange Money',
    'MOOV_MONEY': 'Moov Money',
    'MTN_MONEY': 'MTN Money',
  };

  return libelles[methode] || methode;
};

/**
 * Obtient l'icône d'une méthode de paiement
 * 
 * @param {string} methode - Code de la méthode
 * @returns {string} Nom de l'icône (pour lucide-react)
 */
export const getIconeMethodePaiement = (methode) => {
  const icones = {
    'CARTE_BANCAIRE': 'CreditCard',
    'VISA': 'CreditCard',
    'MASTERCARD': 'CreditCard',
    'WAVE': 'Smartphone',
    'ORANGE_MONEY': 'Smartphone',
    'MOOV_MONEY': 'Smartphone',
    'MTN_MONEY': 'Smartphone',
  };

  return icones[methode] || 'Wallet';
};

/**
 * ⚠️ DÉPRÉCIÉ : Génération manuelle des mois
 * L'API intelligente gère cela automatiquement
 */
export const genererMoisDisponibles = (nbMois = 12, inclurePassés = true) => {
  console.warn('⚠️ genererMoisDisponibles() n\'est plus nécessaire avec l\'API intelligente');
  
  const mois = [];
  const aujourdHui = new Date();
  
  const debutIndex = inclurePassés ? -6 : 0;
  
  for (let i = debutIndex; i < nbMois; i++) {
    const date = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth() + i, 1);
    const annee = date.getFullYear();
    const moisNum = String(date.getMonth() + 1).padStart(2, '0');
    const moisNom = date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    mois.push({
      value: `${annee}-${moisNum}`,
      label: moisNom.charAt(0).toUpperCase() + moisNom.slice(1),
      date: date,
    });
  }

  return mois;
};

/**
 * ⚠️ DÉPRÉCIÉ : Vérification manuelle d'existence de paiement
 * L'API intelligente gère les doublons automatiquement
 */
export const verifierPaiementMois = async (locataireId, locationId, mois) => {
  console.warn('⚠️ verifierPaiementMois() n\'est plus nécessaire avec l\'API intelligente');
  
  try {
    const historique = await getHistoriquePaiements(locataireId, locationId);
    
    const [annee, moisNum] = mois.split('-');
    const dateEcheance = new Date(parseInt(annee), parseInt(moisNum), 0);
    const dateEcheanceStr = dateEcheance.toISOString().split('T')[0];

    return historique.some(p => p.dateEcheance === dateEcheanceStr);
  } catch (error) {
    console.error('Erreur verifierPaiementMois:', error);
    return false;
  }
};