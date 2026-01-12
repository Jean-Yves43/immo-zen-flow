# Répartition des Tâches pour l'API des Tableaux de Bord

Ce document décrit la répartition des tâches pour l'équipe de trois personnes chargée de construire l'API pour les tableaux de bord de ImmoGestionApp.

## Composition de l'Équipe et Responsabilités

### Membre de l'Équipe 1 : API du Tableau de Bord Gestionnaire

- **Gestion Immobilière :**
  - Opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) pour les biens immobiliers (annonces, détails, images).
  - API pour gérer la disponibilité et le statut des biens.
  - Points de terminaison pour gérer les demandes de maintenance.
- **Gestion Financière :**
  - API pour le suivi des paiements (loyers, frais, etc.).
  - API pour la gestion des dépenses liées aux biens.
- **Communication :**
  - Points de terminaison pour la messagerie entre le gestionnaire, le propriétaire et le locataire.

### Membre de l'Équipe 2 : API du Tableau de Bord Propriétaire

- **Suivi des Biens :**
  - API pour visualiser le statut des biens et les informations des locataires.
  - Points de terminaison pour approuver les demandes de maintenance.
- **Gestion Financière :**
  - Points de terminaison pour générer les états financiers pour les propriétaires.
- **Communication :**
  - Consulter l'historique des communications relatives à ses biens.

### Membre de l'Équipe 3 : API du Tableau de Bord Locataire & Fonctionnalités Partagées

- **Profil Utilisateur :**
  - API permettant aux locataires de gérer leur profil.
  - Points de terminaison pour la mise à jour des informations personnelles et des préférences.
- **Gestion de la Location :**
  - API pour consulter les contrats de location et l'historique des paiements.
  - Points de terminaison pour soumettre des demandes de maintenance.
  - API pour effectuer les paiements.
- **Fonctionnalités Partagées :**
  - Implémenter un module d'authentification robuste et réutilisable pour tous les types d'utilisateurs.
  - Développer un système de notification (email, in-app) pour tous les utilisateurs.
  - Mettre en place la documentation de l'API (par exemple, avec Swagger ou Postman).
